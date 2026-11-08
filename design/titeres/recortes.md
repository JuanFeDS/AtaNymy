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
