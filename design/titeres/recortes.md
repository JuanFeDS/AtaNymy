# Recortes de títeres

Hojas originales generadas con IA y el comando exacto para recortarlas en `sitio/assets/titeres/`.

## Cien años de soledad

```bash
python herramientas/recortar_titeres.py design/titeres/cien-anos-jose-arcadio.webp sitio/assets/titeres/cien-anos --nombres jose-arcadio-buendia
python herramientas/recortar_titeres.py design/titeres/cien-anos-tanda-1.webp sitio/assets/titeres/cien-anos --nombres ursula,melquiades,coronel-descartado,remedios
python herramientas/recortar_titeres.py design/titeres/cien-anos-tanda-2.webp sitio/assets/titeres/cien-anos --nombres coronel,mauricio-babilonia,pilar-ternera,fernanda --limpiar "700,735,750,773"
```

- Después de la tanda 1, borrar `coronel-descartado.png` y su entrada en `titeres.json`: el uniforme de gala no correspondía al personaje.
- En la tanda 2, el palito de Mauricio toca el moño de Fernanda. `--limpiar` pinta de gris esa zona antes de recortar.

## Objetos de Cien años de soledad

```bash
python herramientas/recortar_titeres.py design/fondos/cien-anos-objetos.webp sitio/assets/objetos/cien-anos --sin-separar --nombres "hielo,iman,clavo,llave,candado,tijeras,olla,sabana-1,sabana-2,sabana-3,bandera,mariposa-1,mariposa-2,mariposa-3,mariposa-4,mariposa-5,mariposa-6"
```

- `--sin-separar` evita que el asta de la bandera se parta como si fuera un palito entre dos figuras.

## Patrones de fondo de Cien años de soledad

```bash
python herramientas/armar_patrones.py design/fondos/cien-anos-iconos.webp sitio/assets/patrones/cien-anos --filas 10 --columnas 5 --nombres umbral,imanes,hielo,insomnio,nombres,guerras,remedios,mariposas,lluvia,sombras
```

- `--iconos` (por defecto 14) cambia la densidad; `--semilla` cambia la distribución.
- La opacidad se ajusta en `cien.css` con `--opacidad-patron` (por defecto 0.075).
