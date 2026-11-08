# Chica de 19 años: turnaround y expresiones

Descripción de origen: joven de 19 años con piel, cabello y ojos de tono castaño dorado, cuerpo esbelto de piernas largas y pequeños senos firmes. Cabello rapado al cero que empieza a crecerle corto y suave como un campo de trigo.

Los datos con `(*)` no venían en la descripción. Se fijó que tiene 19 años y proporciones adultas, porque los modelos tienden a rejuvenecer personajes esbeltos.

## Turnaround (prompt único para ambas herramientas, versión vigente)

```
Crea una hoja de giro de personaje (character turnaround) para producción de animación 2D.

Personaje: una mujer joven de 19 años, con proporciones plenamente adultas. Su piel, cabello y ojos tienen tonos castaño dorado cálido, con ligeras variaciones entre ellos para que se distingan. Tiene un cuerpo esbelto de piernas largas y busto pequeño. Su cabello es corto, de unos 2 o 3 centímetros, suave, denso y algo desordenado, como un campo de trigo que se mece; se nota que antes estuvo rapado al cero y está creciendo. Viste una camiseta sencilla de manga corta color crema, pantalones holgados de lino color verde oliva y sandalias de cuero.

Rostro: facciones angulares, pómulos altos, mandíbula definida, nariz recta, cejas marcadas y mirada serena.

Vistas: cinco vistas del mismo personaje en una sola fila sobre fondo gris claro liso, de izquierda a derecha: de frente, de tres cuartos frontal, de perfil, de tres cuartos trasero y de espaldas. Pose neutra de pie, brazos ligeramente separados del cuerpo, expresión serena. Todas las vistas con la misma altura y los pies sobre la misma línea base. El cabello debe verse igual en todas las vistas, incluida la nuca.

Estilo: como en la película de animación de Disney "Atlantis: el imperio perdido" (2001). Diseño de personaje angular y geométrico, siluetas fuertes, contornos gruesos y seguros de grosor variable, sombras como bloques planos de borde duro y alto contraste, sin degradados ni sombreado suave, pliegues de ropa rectos y marcados, y paleta terrosa y apagada.

Formato 16:9, sin texto ni marcas de agua.
```

Nota: una versión previa con cabello de 1 cm resultó demasiado corto para la intención del autor.

Resultado: ChatGPT acertó en cabello, proporciones y color pero quedó en un estilo suave tipo anime. Gemini se acercó más a la técnica de Atlantis (línea gruesa, sombras duras), pero la piel salió mostaza, las piernas cortas y el cabello puntiagudo con franja oscura en la nuca.

### Iteraciones propuestas

ChatGPT:
```
Mantén exactamente el personaje, la pose, la ropa y la alineación de las cinco vistas. Cambia solo el estilo de dibujo: contornos negros gruesos y seguros de grosor variable, rasgos del rostro más angulares y geométricos, y sombras como bloques planos de borde duro, sin degradados ni sombreado pictórico, como en la película "Atlantis: el imperio perdido".
```

Gemini:
```
Mantén el estilo de dibujo, la ropa y las cinco vistas. Cambia solo esto: la piel debe ser un castaño dorado cálido, menos amarillo y menos saturado; las piernas más largas y la figura más esbelta, con caderas estrechas; el cabello más suave y denso, como trigo, sin la franja oscura en la nuca; y sin línea de suelo.
```

## Hoja de expresiones (expression sheet)

Usar el turnaround aprobado como imagen de referencia, **la misma imagen en ambas herramientas**.

```
Usa la imagen adjunta como referencia exacta del personaje: mismo rostro, mismo cabello, mismo color de piel, ojos y ropa. Crea una hoja de expresiones (expression sheet) para producción de animación 2D.

Composición: una cuadrícula de 2 filas por 4 columnas, con ocho primeros planos de busto (cabeza, cuello y hombros) del mismo personaje sobre un fondo gris claro liso. Todos con el mismo tamaño, el mismo encuadre y la misma escala, en vista frontal o de tres cuartos muy ligera.

Expresiones, de izquierda a derecha y de arriba abajo:
1. Neutral serena.
2. Alegría: sonrisa abierta y sincera, ojos entrecerrados.
3. Tristeza: cejas inclinadas hacia arriba por dentro, mirada baja, labios apretados.
4. Enojo: ceño fruncido, mandíbula tensa, mirada firme.
5. Asombro: ojos muy abiertos, cejas altas, boca ligeramente abierta.
6. Miedo: ojos abiertos con la mirada tensa, cejas elevadas y juntas, boca entreabierta y tensa.
7. Duda: una ceja arqueada, mirada de reojo, boca ladeada.
8. Determinación: mirada fija al frente, cejas rectas y firmes, labios apretados.

El cabello debe verse idéntico en las ocho: corto, suave, denso, como un campo de trigo.

Estilo: como en la película de animación de Disney "Atlantis: el imperio perdido" (2001). Diseño angular y geométrico, contornos gruesos y seguros de grosor variable, sombras como bloques planos de borde duro y alto contraste, sin degradados ni sombreado suave, y paleta terrosa y apagada. Las expresiones deben ser claras y legibles, con las formas del rostro empujadas con fuerza, sin perder la identidad del personaje.

Formato 16:9, sin texto, sin números ni marcas de agua.
```

Resultado: la identidad se mantuvo en ambas. Fallaron enojo vs. determinación (4 y 8) y asombro vs. miedo (5 y 6).

### Iteraciones para separar las expresiones

Determinación (8):
```
Mantén exactamente la hoja de expresiones, el personaje y el estilo. Cambia solo la expresión 8 (determinación): mirada fija al frente y ligeramente hacia arriba, cejas rectas y relajadas, sin ceño fruncido, mandíbula firme y una leve sonrisa de seguridad en un lado de la boca. Debe verse claramente distinta del enojo de la expresión 4.
```

Miedo (6):
```
Mantén todo igual. Cambia solo la expresión 6 (miedo): cejas muy elevadas y curvadas hacia arriba por dentro, ojos más abiertos con pupilas pequeñas, boca abierta y tensa con los labios hacia atrás, y la cabeza ligeramente echada hacia atrás. Debe distinguirse claramente del asombro de la expresión 5.
```
