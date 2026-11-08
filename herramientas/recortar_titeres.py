"""Recorta los títeres de papel de una hoja generada con IA.

Toma una imagen con una o varias figuras sobre un fondo gris liso, quita el
fondo y guarda cada figura en un PNG con transparencia. Corrige dos fallos
habituales de las hojas por tandas: separa figuras que quedaron unidas porque
el palito de una toca a la otra, y devuelve a cada figura los adornos que
quedaron sueltos (mariposas, clavos). Escribe un `titeres.json` con el tamaño
de cada recorte.

Uso:
    python herramientas/recortar_titeres.py ENTRADA CARPETA_SALIDA [--nombres a,b,c] [--limpiar x0,y0,x1,y1;...]

Los nombres se asignan en orden de lectura: de arriba abajo y de izquierda a derecha.
`--limpiar` pinta de fondo rectángulos de la hoja antes de recortar, para separar a mano
un palito que toca la cabeza de otra figura.
"""

import argparse
import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage

TOLERANCIA_FONDO = 11
PROPORCION_ADORNO = 0.05
DISTANCIA_ADORNO = 90
PROPORCION_PALITO = 0.15
HOLGURA_PALITO = 12
MARGEN = 6
EROSION_BORDE = 2


def mascara_fondo(rgb):
    """Devuelve el fondo: el gris de los bordes de la imagen, sin tocar el margen blanco de papel."""
    borde = np.concatenate([rgb[0], rgb[-1], rgb[:, 0], rgb[:, -1]])
    color_fondo = np.median(borde, axis=0)
    distancia = np.sqrt(((rgb - color_fondo) ** 2).sum(axis=2))
    parece_fondo = distancia <= TOLERANCIA_FONDO
    etiquetas, _ = ndimage.label(parece_fondo)
    bordes = np.concatenate([etiquetas[0], etiquetas[-1], etiquetas[:, 0], etiquetas[:, -1]])
    return np.isin(etiquetas, np.unique(bordes[bordes > 0]))


def componentes(mascara):
    """Separa la máscara en regiones conectadas, de mayor a menor área."""
    etiquetas, cantidad = ndimage.label(mascara)
    regiones = [etiquetas == indice for indice in range(1, cantidad + 1)]
    return sorted(regiones, key=lambda region: region.sum(), reverse=True)


def caja(region):
    """Devuelve (arriba, abajo, izquierda, derecha) de una región."""
    filas, columnas = np.nonzero(region)
    return filas.min(), filas.max(), columnas.min(), columnas.max()


def separar_unidas(region):
    """Corta una figura doble por el punto donde el palito de una toca a la otra.

    El palito deja un estrechamiento muy marcado a media altura; una figura sola no lo tiene.
    """
    arriba, abajo, _, _ = caja(region)
    anchos = region.sum(axis=1)
    inicio = arriba + int((abajo - arriba) * 0.3)
    fin = arriba + int((abajo - arriba) * 0.7)
    tramo = anchos[inicio:fin]
    if not (tramo > 0).any() or tramo[tramo > 0].min() > anchos.max() * PROPORCION_PALITO:
        return [region]
    # Se corta por la fila más angosta, que cae en medio del palito y nunca dentro de una cabeza.
    angosto = tramo[tramo > 0].min()
    corte = inicio + int(np.flatnonzero(tramo == angosto)[0])
    columnas_palito = np.flatnonzero(region[corte])
    izquierda_palito = columnas_palito.min() - HOLGURA_PALITO
    derecha_palito = columnas_palito.max() + HOLGURA_PALITO
    superior = region.copy()
    superior[corte + 1:] = False
    inferior = region.copy()
    inferior[:corte + 1] = False
    # A la figura de abajo solo se le quita el tramo de palito que queda por encima de ella:
    # las filas donde todo lo que hay está dentro de la franja del palito.
    fuera_palito = inferior.copy()
    fuera_palito[:, izquierda_palito:derecha_palito + 1] = False
    filas_con_figura = np.flatnonzero(fuera_palito.any(axis=1))
    if filas_con_figura.size:
        inferior[corte + 1:filas_con_figura[0], izquierda_palito:derecha_palito + 1] = False
    # Los restos del palito que quedan sueltos tras el corte se descartan: cada mitad conserva su pieza principal.
    mitades = [componentes(mitad)[0] for mitad in (superior, inferior) if mitad.any()]
    return [parte for mitad in mitades for parte in separar_unidas(mitad)]


def armar_figuras(fondo):
    """Agrupa las regiones en figuras completas: separa las unidas y reasigna los adornos sueltos."""
    regiones = componentes(ndimage.binary_fill_holes(ndimage.binary_opening(~fondo, iterations=2)))
    area_mayor = regiones[0].sum()
    grandes = [region for region in regiones if region.sum() >= area_mayor * PROPORCION_ADORNO]
    adornos = [region for region in regiones if 40 <= region.sum() < area_mayor * PROPORCION_ADORNO]
    figuras = [parte for region in grandes for parte in separar_unidas(region)]
    for adorno in adornos:
        cercania = ndimage.binary_dilation(adorno, iterations=DISTANCIA_ADORNO)
        contactos = [int((cercania & figura).sum()) for figura in figuras]
        if max(contactos) > 0:
            figuras[contactos.index(max(contactos))] |= adorno
    return figuras


def guardar(imagen, region, nombre, carpeta):
    """Recorta la figura con su transparencia y la guarda como PNG.

    Erosiona el borde un par de píxeles para que no quede la franja gris del fondo.
    """
    region = ndimage.binary_erosion(region, iterations=EROSION_BORDE)
    arriba, abajo, izquierda, derecha = caja(region)
    arriba, izquierda = max(arriba - MARGEN, 0), max(izquierda - MARGEN, 0)
    abajo, derecha = min(abajo + MARGEN + 1, region.shape[0]), min(derecha + MARGEN + 1, region.shape[1])
    alfa = Image.fromarray((region * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.5))
    figura = imagen.convert("RGBA")
    figura.putalpha(alfa)
    figura.crop((izquierda, arriba, derecha, abajo)).save(carpeta / f"{nombre}.png", optimize=True)
    return {"archivo": f"{nombre}.png", "ancho": int(derecha - izquierda), "alto": int(abajo - arriba)}


def limpiar_zonas(imagen, zonas):
    """Pinta con el color del fondo los rectángulos indicados (x0, y0, x1, y1)."""
    rgb = np.asarray(imagen).astype(np.int16)
    borde = np.concatenate([rgb[0], rgb[-1], rgb[:, 0], rgb[:, -1]])
    color_fondo = tuple(int(valor) for valor in np.median(borde, axis=0))
    pincel = ImageDraw.Draw(imagen)
    for zona in zonas:
        pincel.rectangle(zona, fill=color_fondo)
    return imagen


def recortar(entrada, salida, nombres=None, zonas=None):
    """Recorta todas las figuras de la hoja y escribe titeres.json en la carpeta de salida."""
    carpeta = Path(salida)
    carpeta.mkdir(parents=True, exist_ok=True)
    imagen = Image.open(entrada).convert("RGB")
    if zonas:
        imagen = limpiar_zonas(imagen, zonas)
    figuras = armar_figuras(mascara_fondo(np.asarray(imagen).astype(np.int16)))
    alto_fila = max(caja(figura)[1] - caja(figura)[0] for figura in figuras) * 0.6
    figuras.sort(key=lambda figura: (round(caja(figura)[0] / alto_fila), caja(figura)[2]))
    nombres = nombres or [f"titere-{indice:02d}" for indice in range(1, len(figuras) + 1)]
    if len(nombres) != len(figuras):
        raise SystemExit(f"Se encontraron {len(figuras)} figuras pero se dieron {len(nombres)} nombres.")
    indice_json = carpeta / "titeres.json"
    datos = json.loads(indice_json.read_text(encoding="utf-8")) if indice_json.exists() else {}
    for nombre, figura in zip(nombres, figuras):
        datos[nombre] = guardar(imagen, figura, nombre, carpeta)
    indice_json.write_text(json.dumps(datos, indent=2, ensure_ascii=False), encoding="utf-8")
    return {nombre: datos[nombre] for nombre in nombres}


def main():
    """Punto de entrada de la línea de comandos."""
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("entrada", help="Hoja de títeres sobre fondo gris liso")
    parser.add_argument("salida", help="Carpeta donde guardar los PNG y titeres.json")
    parser.add_argument("--nombres", help="Nombres separados por comas, en orden de lectura")
    parser.add_argument("--limpiar", help="Rectángulos x0,y0,x1,y1 a pintar de fondo, separados por punto y coma")
    argumentos = parser.parse_args()
    nombres = argumentos.nombres.split(",") if argumentos.nombres else None
    zonas = [tuple(int(valor) for valor in zona.split(",")) for zona in argumentos.limpiar.split(";")] if argumentos.limpiar else None
    for nombre, datos in recortar(argumentos.entrada, argumentos.salida, nombres, zonas).items():
        print(f"{nombre}: {datos['ancho']} x {datos['alto']}")


if __name__ == "__main__":
    main()
