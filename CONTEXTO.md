# AtaNymy: contexto del ejercicio de prompts de imagen

Ejercicio para diseñar ilustraciones con IA comparando **ChatGPT** y **Gemini** con los mismos prompts. Objetivo: ilustrar escenas y personajes de un libro en estilo de animación 2D tipo *Atlantis: el imperio perdido* (Disney, 2001).

El libro parece ser *Por quién doblan las campanas* (Hemingway). Es una inferencia a partir de las descripciones de personajes y del campamento de Pablo y Pilar; no está confirmado.

## Personajes y escenarios trabajados

| Pieza | Descripción de origen | Archivo de prompts |
|---|---|---|
| Escena de prueba | Aureliano y el hielo, *Cien años de soledad* | `prompts/01-escena-hielo.md` |
| Joven estadounidense | Alto, esbelto, barba rubia de tres días, camisa con imperdible, pantalones de pana | `prompts/02-turnaround-americano.md` |
| Chica de 19 años | Castaño dorado, cabello rapado que vuelve a crecer | `prompts/03-chica.md` |
| Pablo | Recio, cabeza redonda, ojos pequeños, nariz rota, labio hendido con cicatriz | `prompts/05-pablo.md` |
| Escenarios | Cueva y campamento escondido en la sierra de Guadarrama | `prompts/04-escenarios.md` |

## Flujo recomendado

1. **Character turnaround**: cinco vistas (frente, 3/4, perfil, 3/4 trasero, espalda) sobre fondo liso.
2. **Expression sheet**: ocho expresiones en cuadrícula, usando el turnaround como imagen de referencia.
3. **Escenario** sin personajes.
4. **Escena final**: escenario y personajes como referencias, un solo instante visual.

## Hallazgos (una muestra por herramienta, no son reglas)

- **ChatGPT** siguió mejor la dirección técnica: ángulo de cámara, fondo desenfocado, contraste de luz. Mejor anatomía y color en los personajes.
- **Gemini** resolvió mejor la lógica del lugar (cuenca cerrada con paredes de roca) y las proporciones infantiles. En la escena del hielo ignoró el contrapicado y llenó el fondo de detalle.
- En el turnaround del americano ninguna capturó el estilo Atlantis al primer intento; en el de la chica Gemini se acercó más a la técnica (línea gruesa, sombras duras) y ChatGPT a la anatomía.
- La **imagen ancla** funciona: con el mismo turnaround de referencia, ambas mantuvieron la identidad de la chica en las ocho expresiones.
- Fallos comunes: expresiones parecidas (enojo vs. determinación, asombro vs. miedo), edad del niño de 6 años, pino silvestre convertido en abeto, escenas demasiado oscuras.
- Mantener el mismo prompt exacto en ambas herramientas sirve como control; el formato nativo (segmentado para ChatGPT, narrativo para Gemini) conviene probarlo en una segunda ronda.

## Reglas de prompt que se aplicaron

- **ChatGPT** (guía oficial de OpenAI): orden escena → sujeto → detalles → restricciones, segmentos etiquetados, "cambia solo X, mantén todo lo demás".
- **Gemini** (guía oficial de Google): prosa descriptiva, `[Sujeto] + [Acción] + [Contexto] + [Composición] + [Estilo]`, planteamiento en positivo, iteración con ajustes pequeños.
- En ambas: una sola variable por iteración, repetir lo que no debe cambiar, describir los rasgos del estilo además de nombrar la película.
- Lo marcado con `(*)` en los prompts son detalles que no venían en la descripción del libro y se añadieron para fijar consistencia.

## Fuentes

- [GPT Image Generation Models Prompting Guide](https://developers.openai.com/cookbook/examples/multimodal/image-gen-models-prompting-guide)
- [Ultimate prompting guide for Nano Banana](https://cloud.google.com/blog/products/ai-machine-learning/ultimate-prompting-guide-for-nano-banana)
- [Gemini API: generación de imágenes](https://ai.google.dev/gemini-api/docs/image-generation)
- [Guía de personajes consistentes (Neolemon)](https://www.neolemon.com/blog/ai-cartoon-character-prompting-guide)

## Ata Nymy: el sitio

Blog o bitácora de lectura, todo en español, con reseñas, ensayos, fraseario, infografías, seguimiento, marginalia, mapas de personajes, líneas de tiempo, retratos con IA y atmósferas. Convive con la cuenta de Instagram @ata_nymy: las entradas pueden ser la fuente de los carruseles.

**Stack previsto:** Astro + MDX estático, publicado en GitHub Pages con subdominio. Supabase solo si aparece algo dinámico.

**Sitio oficial:** la carpeta `sitio/` es la fuente y se publica tal cual en la rama `gh-pages`, en https://juanfeds.com/AtaNymy/
- `index.html`: la estantería, todavía en estilo v2.
- `cien-anos-de-soledad/`: reseña como experiencia de scroll que dura cien años, con escenas de imanes, hielo, insomnio, nombres, guerras, Remedios, subrayados y lluvia.
- `la-medicion-del-mundo/`: pantalla partida entre Gauss y Humboldt, con viaje en el mapa, órbita de Ceres, altímetro del Chimborazo y cierre en Berlín.
- `quijote/`: el fraseario, todavía en estilo v2.
- `comun/`: tokens, taller, marcas y ficha, compartidos por todas las páginas.
- `design/maqueta*` queda solo como historial de iteraciones.
- **Para publicar:** reemplazar el contenido de `gh-pages` por el de `sitio/` y hacer push.

**Reglas de diseño que salieron de las iteraciones:**
- Cada entrada es una experiencia con una mecánica sacada del propio libro, no una plantilla de artículo.
- Cada libro trae su paleta viva y su tipografía. Lo constante es el sello: firma, jaguar y ficha de lectura.
- Nada de beige o sepia como base ni monocromía, y nada de abusar de la letra gigante.
- La ficha (`ficha.css`) mantiene la estructura (radar de 5 dimensiones, época y nota) y se viste con el color y la letra de cada libro.
- La regla de un color fijo por serie es solo para Instagram; en la web hay libertad.

**Para verlo en local:** en `.claude/launch.json`, `sitio` sirve el sitio en http://localhost:4322 y `maquetas` sirve el historial en http://localhost:4321.

## Pendiente

- Rehacer como experiencia el fraseario del Quijote y la estantería.
- Logo del jaguar en alta resolución: `design/assets/jaguar.png` falta y se usa una huella provisional.
- Evaluar el interior de la cueva (prompt listo, sin resultados registrados).
- Probar las iteraciones propuestas (ángulo bajo en Gemini, corrección de pino silvestre, restilizar el turnaround del americano).
- Hoja de expresiones de Pablo y del americano.
- Primera escena completa con personajes y escenario como referencias.
- Decidir si se guardan aquí las imágenes generadas (carpeta `resultados/`).
