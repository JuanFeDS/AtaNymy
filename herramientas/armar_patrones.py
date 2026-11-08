"""Arma patrones de fondo sin costuras a partir de una hoja de iconos de línea.

La hoja trae los iconos en filas (una fila por escena). El script separa cada
icono, lo convierte en máscara (la tinta opaca, el blanco transparente) y
reparte los iconos de cada fila al azar, con giros distintos, en una baldosa
que se repite sin que se noten las uniones. En la web la baldosa se usa como
máscara, así que el patrón toma el color que le dé el CSS.

Uso:
    python herramientas/armar_patrones.py HOJA CARPETA_SALIDA --filas 10 --columnas 5 \
        --nombres umbral,imanes,... [--lado 640] [--iconos 14] [--semilla 7]
"""

import argparse
import random
from pathlib import Path

import numpy as np
from PIL import Image, ImageOps
from scipy import ndimage

UMBRAL_TINTA = 150
MARGEN_ICONO = 4
TAMANO_ICONO = (52, 74)
DISTANCIA_MINIMA = 0.82
INTENTOS_POR_ICONO = 400


def bandas(perfil, cantidad):
    """Divide un perfil de tinta en `cantidad` bandas, cortando por los huecos más vacíos."""
    suavizado = ndimage.uniform_filter1d(perfil.astype(float), size=9)
    largo = len(perfil)
    cortes = [0]
    for indice in range(1, cantidad):
        centro = int(largo * indice / cantidad)
        ventana = int(largo / cantidad * 0.35)
        tramo = suavizado[centro - ventana:centro + ventana]
        cortes.append(centro - ventana + int(np.argmin(tramo)))
    cortes.append(largo)
    return list(zip(cortes[:-1], cortes[1:]))


def separar_iconos(ruta, filas, columnas):
    """Devuelve una lista de filas; cada fila es una lista de máscaras de icono (PIL, modo L)."""
    gris = np.asarray(Image.open(ruta).convert("L"))
    tinta = gris < UMBRAL_TINTA
    iconos = []
    for arriba, abajo in bandas(tinta.sum(axis=1), filas):
        fila = []
        franja = tinta[arriba:abajo]
        for izquierda, derecha in bandas(franja.sum(axis=0), columnas):
            celda = franja[:, izquierda:derecha]
            filas_tinta, columnas_tinta = np.nonzero(celda)
            if filas_tinta.size == 0:
                continue
            recorte = gris[arriba:abajo, izquierda:derecha][
                max(filas_tinta.min() - MARGEN_ICONO, 0):filas_tinta.max() + MARGEN_ICONO + 1,
                max(columnas_tinta.min() - MARGEN_ICONO, 0):columnas_tinta.max() + MARGEN_ICONO + 1,
            ]
            alfa = ImageOps.invert(Image.fromarray(recorte))
            fila.append(Image.eval(alfa, lambda valor: 0 if valor < 40 else min(255, int(valor * 1.3))))
        iconos.append(fila)
    return iconos


def baldosa(iconos, lado, cantidad, azar):
    """Reparte los iconos en una baldosa cuadrada que se repite sin costuras."""
    lienzo = Image.new("L", (lado, lado), 0)
    colocados = []
    for indice in range(cantidad):
        icono = iconos[indice % len(iconos)]
        tamano = azar.randint(*TAMANO_ICONO)
        escala = tamano / max(icono.size)
        pieza = icono.resize((max(1, int(icono.width * escala)), max(1, int(icono.height * escala))), Image.LANCZOS)
        pieza = pieza.rotate(azar.uniform(-35, 35), resample=Image.BICUBIC, expand=True)
        separacion = lado / (cantidad ** 0.5) * DISTANCIA_MINIMA
        for _ in range(INTENTOS_POR_ICONO):
            x, y = azar.uniform(0, lado), azar.uniform(0, lado)
            lejos = all(
                min(abs(x - ox), lado - abs(x - ox)) ** 2 + min(abs(y - oy), lado - abs(y - oy)) ** 2 >= separacion ** 2
                for ox, oy in colocados
            )
            if lejos:
                break
        colocados.append((x, y))
        for desplazamiento_x in (-lado, 0, lado):
            for desplazamiento_y in (-lado, 0, lado):
                destino = (int(x - pieza.width / 2 + desplazamiento_x), int(y - pieza.height / 2 + desplazamiento_y))
                capa = Image.new("L", (lado, lado), 0)
                capa.paste(pieza, destino)
                lienzo = Image.fromarray(np.maximum(np.asarray(lienzo), np.asarray(capa)))
    return lienzo


def guardar_mascara(mascara, ruta):
    """Guarda la baldosa como PNG negro con transparencia, listo para usar como máscara CSS."""
    imagen = Image.new("RGBA", mascara.size, (0, 0, 0, 0))
    imagen.putalpha(mascara)
    imagen.save(ruta, optimize=True)


def main():
    """Punto de entrada de la línea de comandos."""
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("hoja", help="Hoja de iconos de línea negra sobre blanco")
    parser.add_argument("salida", help="Carpeta donde guardar las baldosas")
    parser.add_argument("--filas", type=int, required=True)
    parser.add_argument("--columnas", type=int, required=True)
    parser.add_argument("--nombres", required=True, help="Un nombre por fila, separados por comas")
    parser.add_argument("--lado", type=int, default=640, help="Lado de la baldosa en píxeles")
    parser.add_argument("--iconos", type=int, default=14, help="Iconos por baldosa")
    parser.add_argument("--semilla", type=int, default=7)
    argumentos = parser.parse_args()
    nombres = argumentos.nombres.split(",")
    filas = separar_iconos(argumentos.hoja, argumentos.filas, argumentos.columnas)
    if len(nombres) != len(filas):
        raise SystemExit(f"Hay {len(filas)} filas pero se dieron {len(nombres)} nombres.")
    carpeta = Path(argumentos.salida)
    carpeta.mkdir(parents=True, exist_ok=True)
    azar = random.Random(argumentos.semilla)
    for nombre, iconos in zip(nombres, filas):
        guardar_mascara(baldosa(iconos, argumentos.lado, argumentos.iconos, azar), carpeta / f"{nombre}.png")
        print(f"{nombre}: {len(iconos)} iconos")


if __name__ == "__main__":
    main()
