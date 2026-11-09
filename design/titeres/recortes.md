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

## El Resplandor

Hojas originales en `design/titeres/` y `design/fondos/`. Prompts en `prompts/06-resplandor-titeres.md`. Se guardan con estos nombres:

- `design/titeres/resplandor-familia.webp` (hoja 1)
- `design/titeres/resplandor-hotel.webp` (hoja 2)
- `design/fondos/resplandor-objetos.webp` (hoja 3)
- `design/fondos/resplandor-escenografia.webp` (hoja 4)

```bash
python herramientas/recortar_titeres.py design/titeres/resplandor-familia.webp sitio/assets/titeres/el-resplandor --nombres jack,wendy,danny,hallorann
python herramientas/recortar_titeres.py design/titeres/resplandor-hotel.webp sitio/assets/titeres/el-resplandor --nombres senora-217,grady,lloyd,invitada
python herramientas/recortar_titeres.py design/fondos/resplandor-objetos.webp sitio/assets/objetos/el-resplandor --sin-separar --nombres "mazo,llave-217,manometro,manguera,avispero,antifaz,copa,boton-ascensor,copo,recortes,maquina,coche"
python herramientas/recortar_titeres.py design/fondos/resplandor-escenografia.webp sitio/assets/objetos/el-resplandor --sin-separar --nombres "caldera,banera,barra,puerta-217,seto-leon,seto-conejo,seto-perro,reloj"
```

- Los nombres de los títeres coinciden con los que ya espera `sitio/el-resplandor/index.html`.
- Las hojas mixtas (personajes y objetos) se parten en dos imágenes antes de recortar.

- Hoja de objetos: la última fila sale del recortador como libro, máquina de escribir y coche (orden por altura, no de lectura). Por eso los nombres van como `recortes,maquina,coche`.
- Hoja de escenografía: los márgenes blancos de la bañera, la puerta y el conejo se tocan y el recortador los une. Se separó con un script que asigna cada píxel a la figura más cercana.
