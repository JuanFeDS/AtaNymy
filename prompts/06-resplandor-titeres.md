# El Resplandor: títeres y objetos para la experiencia

Cuatro hojas para la experiencia del hotel. Cada prompt va completo, listo para pegar en ChatGPT o Gemini. Se guardan en `design/titeres/` (personajes) y `design/fondos/` (objetos) y se recortan con `herramientas/recortar_titeres.py` (comandos en `design/titeres/recortes.md`).

El estilo es el de las hojas de Cien años de soledad: papel plano, de una sola pieza, con margen blanco. No se cambia. Ya se rechazaron grabado sucio y apagado, muchas líneas y cómic plano.

Los datos con `(*)` no vienen del libro: se añadieron para fijar consistencia. Corrígelos si no te cuadran. Los rasgos físicos de la familia y de Hallorann salen de la descripción de la novela.

## Reglas para todos los prompts

- **Nunca nombrar el título, el autor ni los apellidos de los personajes.** Con el título puesto, ChatGPT dibujó la película (hacha, rostros de los actores).
- Si aun así aparece un rostro conocido, añadir: "Rostro genérico e ilustrado, sin parecido con ningún actor."
- Una sola variable por iteración: para corregir, usar "Mantén todo igual. Cambia solo X".

## Hojas mixtas: personajes y objetos juntos

Sirve cuando un personaje necesita su objeto propio (la caldera, la bañera) y el CSS no alcanza. Se pide en la misma hoja, con esta regla de composición:

- Los personajes van arriba, con palito. Los objetos van abajo, sin palito.
- Cada objeto, con su margen blanco de papel recortado, bien separado de los demás.

Antes de recortar, yo parto la imagen en dos: el recortador trata los palitos de forma distinta a los objetos y no se pueden mezclar en una sola pasada. Plantilla para pedirla:

```
Crea una hoja con [N] títeres de papel arriba y [M] objetos recortados abajo, de una novela de terror de los años 70 ambientada en un hotel de montaña. Personajes y objetos son originales, descritos solo con el texto de abajo, sin parecido con ninguna película ni actor.

Arriba, con palito: [descripción de cada personaje, con (*) en lo inventado].
Abajo, sin palito: [lista de objetos].

[bloque de estilo de títeres, con "N figuras con palito arriba y M objetos sin palito abajo"]
```

## Hoja 1: la familia y Hallorann

```
Crea una hoja con cuatro títeres de papel de personajes de una novela de terror de los años 70 ambientada en un hotel de montaña. Son personajes originales, descritos solo con el texto de abajo: no se basan en ninguna película ni en ningún actor, y el rostro de cada uno es genérico e ilustrado.

Arriba a la izquierda: Jack, hombre de unos 30 años y 1,80 m, delgado y algo demacrado, de piel pálida y cabello rubio rojizo despeinado. Rostro cansado y amable, con una mano llevada a los labios en el gesto de frotárselos. Viste un jersey de lana gris (*) y pantalones de pana (*). En la otra mano lleva un mazo de roque de madera, con la cabeza ancha hacia abajo.

Arriba a la derecha: Wendy, mujer de unos 28 años, de buena figura, con cabello rubio color trigo, liso y a la altura de los hombros (*), y un rostro sereno y decidido. Viste un vestido azul de cuello marinero y un cárdigan grueso encima (*). Está de pie, firme, con los brazos a los lados y la barbilla en alto.

Abajo a la izquierda: Danny, niño de 5 años, pequeño y flaco, de piel clara y fina, labios bien moldeados, ojos de un gris nebuloso y cabello rubio muy claro. Expresión atenta, como quien escucha algo que los demás no oyen. Lleva el brazo derecho enyesado y un chaquetón con cremallera, gastado en los codos (*). Sostiene un coche de juguete (*) con la mano izquierda.

Abajo a la derecha: Dick, hombre negro de más de 60 años, un gigante: muy alto y corpulento, el más grande de los cuatro. Cabello afro corto que empieza a encanecer, ojos oscuros y una sonrisa amplia con dientes muy blancos y parejos. Cocinero del hotel: viste uniforme blanco de cocinero con delantal (*) y sostiene un cucharón de metal (*).

Estilo: títere de papel recortado. Cada figura es de cuerpo entero, de una sola pieza y plana, pegada a un palito de madera clara que sale recto por debajo de los pies. Línea de contorno limpia y fina, color plano y vivo con una textura de papel apenas visible, sombras mínimas en bloques planos. Margen blanco de papel recortado alrededor de toda la silueta, incluidos las manos y los objetos que sostiene. Fondo gris claro liso. Cuatro figuras por hoja en cuadrícula de 2 por 2, bien separadas: ningún palito ni objeto toca a otra figura. Formato vertical 2:3, sin texto ni marcas de agua. No es grabado, ni cómic, ni tiene rayado ni sombreado sucio.
```

Estado: la primera versión se rechazó por parecerse a la película. Esta incluye los rasgos del libro.

## Hoja 2: los habitantes del hotel

```
Crea una hoja con cuatro títeres de papel de fantasmas de un hotel de montaña, de una novela de terror de los años 70. Son personajes originales, descritos solo con el texto de abajo, sin parecido con ninguna película ni actor, con rostro genérico e ilustrado. Son cadáveres y apariciones que dan miedo de verdad, no simpáticos ni de disfraz: piel gris, verdosa o violácea, ojeras muy marcadas, ojos hundidos o completamente blancos, ropa vieja, ajada y manchada. Se evita la sangre abundante y las vísceras porque los generadores las rechazan: el miedo viene de la descomposición, la mirada vacía y la postura. No todos sonríen: la mayoría tiene el gesto serio, frío o vacío. Cada uno lleva su palito como los demás títeres.

Arriba a la izquierda: la mujer de la habitación 217, una mujer mayor y muerta, que se está bañando: está dentro de una bañera antigua con patas de garra que forma parte de la figura, con el agua turbia hasta el pecho, de modo que no se ve ropa ni desnudez. El cuerpo está hinchado, con piel verde violácea y manchas oscuras, el cabello gris pegado y mojado, los ojos completamente blancos y la boca entreabierta, sin sonrisa. Se incorpora del agua con los brazos extendidos hacia delante y las manos hinchadas. El palito sale por debajo de la bañera.

Arriba a la derecha: Delbert, el cuidador fantasma, hombre de mediana edad vestido de camarero formal (*), con chaqueta blanca de botones amarillenta y raída, pajarita torcida y una bandeja de plata vacía en una mano. Rostro pálido y grisáceo, ojeras profundas, mirada fija y fría, la boca recta, sin sonrisa. Muy erguido, correcto y sin vida.

Abajo a la izquierda: Lloyd, el cantinero fantasma, hombre de unos 40 años (*) con chaleco rojo desgastado, camisa blanca amarillenta con mangas recogidas y un paño sucio al hombro. Sostiene una copa de cóctel alta con un líquido ámbar. Piel gris azulada, ojos hundidos con la pupila diminuta y una sonrisa demasiado ancha y fija, antinatural. Es el único que sonríe de forma amable, y eso lo hace más inquietante.

Abajo a la derecha: una invitada a la fiesta de máscaras de los años 40 (*), mujer con un vestido largo de seda dorada, rasgado y descolorido en el borde, guantes largos y un antifaz de plumas rojo y negro sobre los ojos. Piel gris con grietas finas, una boca demasiado abierta, como en una carcajada congelada, y los dientes amarillos. Sostiene una copa de champán rota y vacía. Pose de baile, torcida y rígida, como una muñeca mal articulada.

Estilo: títere de papel recortado. Cada figura es de cuerpo entero, de una sola pieza y plana, pegada a un palito de madera clara que sale recto por debajo de los pies. Línea de contorno limpia y fina, color plano y vivo con una textura de papel apenas visible, sombras mínimas en bloques planos. Margen blanco de papel recortado alrededor de toda la silueta, incluidos las manos y los objetos que sostiene. Fondo gris claro liso. Cuatro figuras por hoja en cuadrícula de 2 por 2, bien separadas: ningún palito ni objeto toca a otra figura. Formato vertical 2:3, sin texto ni marcas de agua. No es grabado, ni cómic, ni tiene rayado ni sombreado sucio.
```

Estado: sin resultados registrados todavía.

## Hoja 3: objetos pequeños

Sin palito y sin personajes. Doce objetos, cuadrícula de 3 por 4.

```
Crea una hoja de objetos recortados en papel, de una novela de terror de los años 70 ambientada en un hotel de montaña. Doce objetos sueltos en una cuadrícula de 3 columnas por 4 filas, bien separados, cada uno con margen blanco de papel recortado alrededor y fondo gris claro liso. Línea de contorno limpia y fina, color plano y vivo, textura de papel apenas visible, sombras mínimas en bloques planos. Sin texto ni marcas de agua. No es grabado, ni cómic, ni rayado. Formato vertical 2:3.

De izquierda a derecha y de arriba abajo:
1. Un mazo de roque de madera con cabeza ancha.
2. Una llave antigua de latón con una etiqueta de cartón con el número 217.
3. Un manómetro redondo de latón, con la aguja en la zona roja.
4. Una manguera contra incendios enrollada, de lona roja, con boquilla de latón.
5. Un avispero grande de papel gris, con avispas amarillas y negras alrededor.
6. Un antifaz de plumas rojo y negro.
7. Una copa de cóctel alta con líquido ámbar.
8. Un botón de ascensor de latón, redondo, con un número en relieve.
9. Un copo de nieve grande, azul hielo, de seis puntas.
10. Un coche de juguete pequeño.
11. Un libro de recortes de periódico viejo, abierto, con recortes pegados.
12. Una máquina de escribir antigua con una hoja a medio escribir.
```

Estado: sin resultados registrados todavía.

## Hoja 4: escenografía grande

Los objetos que en la página hoy están hechos con CSS y no alcanzan. Ocho piezas grandes, sin palito, cuadrícula de 2 por 4. Cuando lleguen, sustituyo las versiones de CSS por estas.

```
Crea una hoja de ocho objetos grandes recortados en papel, de una novela de terror de los años 70 ambientada en un hotel de montaña. Cuadrícula de 2 columnas por 4 filas, cada objeto grande y completo, bien separado de los demás, con margen blanco de papel recortado alrededor y fondo gris claro liso. Línea de contorno limpia y fina, color plano y vivo, textura de papel apenas visible, sombras mínimas en bloques planos. Sin personajes, sin texto ni marcas de agua. No es grabado, ni cómic, ni rayado. Formato vertical 2:3.

De izquierda a derecha y de arriba abajo:
1. Una caldera antigua de sótano: tanque de acero remachado, con tubos de cobre, un volante de válvula rojo y un manómetro grande de latón con la aguja en la zona roja.
2. Una bañera con patas de garra y una cortina de baño malva a medio correr, sin ninguna persona.
3. Una barra de bar de madera oscura con tres botellas de colores y una copa de cóctel con líquido ámbar.
4. Una puerta de habitación de madera oscura con una placa de latón con el número 217, entreabierta.
5. Un seto recortado en forma de león, verde intenso, con nieve en el lomo. Sin ojos ni cara.
6. Un seto recortado en forma de conejo, verde intenso, con nieve. Sin ojos ni cara.
7. Un seto recortado en forma de perro sentado, verde intenso, con nieve. Sin ojos ni cara.
8. Un reloj de pared grande de salón de baile, con marco dorado, marcando casi las doce.
```

Estado: sin resultados registrados todavía.

## Qué vigilar

- Que los palitos de las hojas 1 y 2 no toquen a otra figura. Si pasa, usar `--limpiar` al recortar, como con Mauricio y Fernanda.
- Que Hallorann (así, con doble n, como en la novela) quede como personaje digno, no como caricatura.
- Que Wendy no quede en pose pasiva ni de víctima.
- Que la señora de la 217 dé miedo de verdad pero sin desnudez visible: el agua turbia y la bañera tapan el cuerpo. Si el generador se niega, probar con el agua hasta el cuello. Que nadie sonría de forma simpática: la sonrisa solo es válida si es antinatural.
- Que los setos no tengan ojos ni caras: en el libro solo se mueven cuando no los miras.
- Mantener el mismo margen blanco y la misma línea que las hojas de Cien años.

## Corrección tipo

```
Mantén todo igual. Cambia solo [figura / objeto]: [qué cambia].
```
