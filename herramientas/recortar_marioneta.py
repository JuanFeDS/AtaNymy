"""Recorta las piezas de una hoja de marioneta de papel generada con IA.

Toma una imagen con piezas sueltas sobre un fondo gris liso, quita el fondo,
separa cada pieza en un PNG con transparencia y busca el encuadernador dorado
de cada una para usarlo como punto de giro. Escribe un `piezas.json` con el
tamaño y el pivote de cada pieza, listo para montar la marioneta en la web.

Uso:
    python herramientas/recortar_marioneta.py ENTRADA CARPETA_SALIDA
"""

import argparse
import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

AREA_MINIMA = 1500
CROMA_MAXIMA_FONDO = 18
LUMINOSIDAD_MINIMA_FONDO = 150
MARGEN = 6


def cargar_rgb(ruta):
    """Carga la imagen como arreglo RGB de enteros."""
    return np.asarray(Image.open(ruta).convert("RGB")).astype(np.int16)


def mascara_fondo(rgb):
    """Devuelve el fondo: gris claro sin color, conectado con los bordes de la imagen."""
    croma = rgb.max(axis=2) - rgb.min(axis=2)
    luminosidad = rgb.mean(axis=2)
    parece_fondo = (croma <= CROMA_MAXIMA_FONDO) & (luminosidad >= LUMINOSIDAD_MINIMA_FONDO)
    etiquetas, _ = ndimage.label(parece_fondo)
    bordes = np.concatenate([etiquetas[0], etiquetas[-1], etiquetas[:, 0], etiquetas[:, -1]])
    etiquetas_borde = np.unique(bordes[bordes > 0])
    return np.isin(etiquetas, etiquetas_borde)


def separar_piezas(fondo):
    """Etiqueta las piezas sueltas y descarta las manchas demasiado pequeñas."""
    piezas = ndimage.binary_opening(~fondo, iterations=2)
    piezas = ndimage.binary_fill_holes(piezas)
    etiquetas, cantidad = ndimage.label(piezas)
    areas = ndimage.sum(piezas, etiquetas, range(1, cantidad + 1))
    validas = [indice + 1 for indice, area in enumerate(areas) if area >= AREA_MINIMA]
    return etiquetas, validas


def buscar_encuadernador(rgb, mascara):
    """Busca el encuadernador: el brillo dorado más intenso dentro de la pieza."""
    rojo, verde, azul = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    dorado = (rojo > 150) & (verde > 120) & (azul < verde - 25) & (rojo - verde < 55) & (verde - azul > 40)
    brillo = (rojo > 225) & (verde > 205) & (azul > 150)
    candidatos = mascara & (dorado | brillo)
    etiquetas, cantidad = ndimage.label(ndimage.binary_dilation(candidatos, iterations=2))
    if cantidad == 0:
        return None
    mejor = None
    for indice in range(1, cantidad + 1):
        zona = etiquetas == indice
        area = int(zona.sum())
        filas, columnas = np.nonzero(zona)
        alto = filas.max() - filas.min() + 1
        ancho = columnas.max() - columnas.min() + 1
        redondez = min(alto, ancho) / max(alto, ancho)
        if 60 <= area <= 1600 and redondez > 0.6 and (mejor is None or area > mejor[0]):
            mejor = (area, float(columnas.mean()), float(filas.mean()))
    return None if mejor is None else (mejor[1], mejor[2])


def guardar_pieza(imagen, mascara, indice, carpeta):
    """Recorta la pieza con su transparencia y devuelve su caja en la hoja original."""
    filas, columnas = np.nonzero(mascara)
    arriba = max(filas.min() - MARGEN, 0)
    izquierda = max(columnas.min() - MARGEN, 0)
    abajo = min(filas.max() + MARGEN + 1, mascara.shape[0])
    derecha = min(columnas.max() + MARGEN + 1, mascara.shape[1])
    alfa = Image.fromarray((mascara * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.7))
    pieza = imagen.convert("RGBA")
    pieza.putalpha(alfa)
    nombre = f"pieza-{indice:02d}.png"
    pieza.crop((izquierda, arriba, derecha, abajo)).save(carpeta / nombre, optimize=True)
    return nombre, (int(izquierda), int(arriba), int(derecha), int(abajo))


def recortar(entrada, salida):
    """Recorta todas las piezas y escribe el JSON con tamaños y pivotes."""
    carpeta = Path(salida)
    carpeta.mkdir(parents=True, exist_ok=True)
    imagen = Image.open(entrada).convert("RGB")
    rgb = cargar_rgb(entrada)
    etiquetas, validas = separar_piezas(mascara_fondo(rgb))
    centros = ndimage.center_of_mass(etiquetas > 0, etiquetas, validas)
    orden = sorted(zip(validas, centros), key=lambda par: (round(par[1][0] / 120), par[1][1]))
    datos = []
    for indice, (etiqueta, centro) in enumerate(orden, start=1):
        mascara = etiquetas == etiqueta
        nombre, (izquierda, arriba, derecha, abajo) = guardar_pieza(imagen, mascara, indice, carpeta)
        pivote = buscar_encuadernador(rgb, mascara)
        datos.append({
            "archivo": nombre,
            "ancho": derecha - izquierda,
            "alto": abajo - arriba,
            "hoja": {"x": izquierda, "y": arriba},
            "centro": {"x": round(centro[1]), "y": round(centro[0])},
            "pivote": None if pivote is None else {"x": round(pivote[0] - izquierda, 1), "y": round(pivote[1] - arriba, 1)},
        })
    (carpeta / "piezas.json").write_text(json.dumps(datos, indent=2, ensure_ascii=False), encoding="utf-8")
    return datos


def main():
    """Punto de entrada de la línea de comandos."""
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("entrada", help="Hoja de piezas sobre fondo gris liso")
    parser.add_argument("salida", help="Carpeta donde guardar los PNG y piezas.json")
    argumentos = parser.parse_args()
    for pieza in recortar(argumentos.entrada, argumentos.salida):
        print(pieza["archivo"], pieza["ancho"], "x", pieza["alto"], "centro", pieza["centro"], "pivote", pieza["pivote"])


if __name__ == "__main__":
    main()
