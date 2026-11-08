const raiz = document.documentElement;
const movimientoReducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const NS_SVG = 'http://www.w3.org/2000/svg';

const limitar = (valor, minimo = 0, maximo = 1) => Math.min(maximo, Math.max(minimo, valor));
const azar = (semilla) => {
  const x = Math.sin(semilla * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

function progresoDe(seccion) {
  const caja = seccion.getBoundingClientRect();
  const recorrido = caja.height - window.innerHeight;
  if (recorrido <= 0) return caja.top < 0 ? 1 : 0;
  return limitar(-caja.top / recorrido);
}

function crear(nombre, atributos = {}, texto) {
  const nodo = document.createElementNS(NS_SVG, nombre);
  Object.entries(atributos).forEach(([clave, valor]) => nodo.setAttribute(clave, valor));
  if (texto !== undefined) nodo.textContent = texto;
  return nodo;
}

/* ───────── 0 · Esfera de cien años ───────── */
(() => {
  const grupo = document.querySelector('.marcas-esfera');
  for (let anio = 0; anio < 100; anio += 1) {
    const angulo = (anio / 100) * 2 * Math.PI - Math.PI / 2;
    const decena = anio % 10 === 0;
    const interior = decena ? 150 : 162;
    const x1 = 200 + interior * Math.cos(angulo);
    const y1 = 200 + interior * Math.sin(angulo);
    const x2 = 200 + 176 * Math.cos(angulo);
    const y2 = 200 + 176 * Math.sin(angulo);
    grupo.append(crear('path', { d: `M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}`, 'stroke-width': decena ? 2.4 : 1.1 }));
    if (anio % 25 === 0 && anio > 0) {
      grupo.append(crear('text', { x: (200 + 126 * Math.cos(angulo)).toFixed(1), y: (208 + 126 * Math.sin(angulo)).toFixed(1), 'text-anchor': 'middle' }, String(anio || 100)));
    }
  }
})();

/* ───────── II · Espiral de nombres ───────── */
const espiral = (() => {
  const svg = document.querySelector('.espiral');
  const vuelta = svg.querySelector('.vuelta');
  const capa = svg.querySelector('.nombres-capa');
  const VUELTAS = 7;
  const RADIO_INICIAL = 34;
  const PASO_RADIO = 34;
  const CENTRO = 300;
  const punto = (theta) => {
    const radio = RADIO_INICIAL + (PASO_RADIO * theta) / (2 * Math.PI);
    const angulo = theta - Math.PI / 2;
    return [CENTRO + radio * Math.cos(angulo), CENTRO + radio * Math.sin(angulo)];
  };
  // [generación, fracción de vuelta (0 arriba, .25 derecha, .5 abajo, .75 izquierda), nombre, tipo, nota]
  const familia = [
    [1, 0, 'José Arcadio Buendía', 'j', 'funda Macondo'],
    [1, 0.33, 'Úrsula Iguarán', 'o', 'sostiene la casa casi un siglo'],
    [2, 0, 'José Arcadio', 'j', 'se va con los gitanos'],
    [2, 0.5, 'Aureliano, el coronel', 'a', '32 levantamientos, todos perdidos'],
    [2, 0.86, 'Amaranta', 'o', ''],
    [3, 0.62, 'Arcadio', 'o', 'hijo de José Arcadio y Pilar Ternera'],
    [3, 0.5, 'Aureliano José', 'a', ''],
    [4, 0, 'José Arcadio Segundo', 'j', ''],
    [4, 0.5, 'Aureliano Segundo', 'a', ''],
    [4, 0.68, 'Remedios, la bella', 'o', 'sube al cielo doblando sábanas'],
    [5, 0, 'José Arcadio', 'j', 'se va a Roma'],
    [5, 0.2, 'Meme', 'o', ''],
    [5, 0.8, 'Amaranta Úrsula', 'o', ''],
    [6, 0.5, 'Aureliano Babilonia', 'a', 'hijo de Meme y Mauricio Babilonia'],
    [7, 0.5, 'Aureliano', 'a', 'el último'],
  ];

  const muestras = [];
  for (let theta = 0; theta <= VUELTAS * 2 * Math.PI; theta += 0.04) muestras.push(punto(theta));
  vuelta.setAttribute('d', muestras.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' '));
  const largo = vuelta.getTotalLength();
  vuelta.style.strokeDasharray = `${largo}`;

  const nodos = familia.map(([generacion, fraccion, nombre, tipo, nota]) => {
    const theta = 2 * Math.PI * (generacion - 1 + fraccion);
    const [x, y] = punto(theta);
    const grupo = crear('g', { class: `nombre tipo-${tipo}` });
    grupo.append(crear('circle', { cx: x.toFixed(1), cy: y.toFixed(1), r: 4 }));
    const aLaDerecha = tipo !== 'o' || x >= CENTRO;
    const lugar = { x: aLaDerecha ? x + 9 : x - 9, y: y + 5, ancla: aLaDerecha ? 'start' : 'end' };
    const etiqueta = crear('text', { x: lugar.x.toFixed(1), y: lugar.y.toFixed(1), 'text-anchor': lugar.ancla }, nombre);
    if (nota) etiqueta.append(crear('title', {}, `${nombre}: ${nota}`));
    grupo.append(etiqueta);
    capa.append(grupo);
    return { grupo, umbral: theta / (VUELTAS * 2 * Math.PI) };
  });

  svg.closest('.escenario').querySelectorAll('[data-ver]').forEach((boton) => {
    boton.addEventListener('click', () => {
      const tipo = boton.dataset.ver;
      const activo = boton.getAttribute('aria-pressed') !== 'true';
      svg.classList.remove('ver-j', 'ver-a');
      boton.parentElement.querySelectorAll('[data-ver]').forEach((otro) => otro.setAttribute('aria-pressed', 'false'));
      if (activo) {
        svg.classList.add(`ver-${tipo}`);
        boton.setAttribute('aria-pressed', 'true');
      }
    });
  });

  return (progreso) => {
    const dibujado = limitar((progreso - 0.04) / 0.8);
    vuelta.style.strokeDashoffset = `${largo * (1 - dibujado)}`;
    nodos.forEach(({ grupo, umbral }) => grupo.classList.toggle('visible', dibujado >= umbral));
    svg.classList.toggle('cerrada', dibujado >= 0.995);
  };
})();

/* ───────── III · El insomnio borra palabras ───────── */
const insomnio = (() => {
  const parrafo = document.querySelector('.parrafo-olvido');
  const protegidas = new Set(['memoria.', 'etiquetas:', 'martes.']);
  const palabras = parrafo.dataset.texto.split(' ').map((texto, indice) => {
    const span = document.createElement('span');
    span.className = 'palabra';
    span.textContent = texto;
    parrafo.append(span, ' ');
    return { span, protegida: protegidas.has(texto), umbral: 0.14 + 0.56 * azar(indice + 1) };
  });
  parrafo.setAttribute('aria-label', parrafo.dataset.texto);
  const rotulos = [...document.querySelectorAll('.rotulo')].map((rotulo) => ({ rotulo, umbral: Number(rotulo.style.getPropertyValue('--t')) }));
  const remate = document.querySelector('.remate');

  return (progreso) => {
    palabras.forEach(({ span, protegida, umbral }) => {
      const olvidar = progreso > umbral;
      span.classList.toggle('olvidada', olvidar && !protegida);
      span.classList.toggle('guardada', olvidar && protegida);
    });
    rotulos.forEach(({ rotulo, umbral }) => rotulo.classList.toggle('pegado', progreso >= umbral));
    remate.classList.toggle('visible', progreso > 0.8);
  };
})();

/* ───────── IV · La lluvia y su conteo ───────── */
const lluvia = (() => {
  const escena = document.querySelector('.escena-lluvia');
  const lienzo = escena.querySelector('.cortina');
  const contexto = lienzo.getContext('2d');
  const grupoRayas = escena.querySelector('.rayas');
  const textoDias = escena.querySelector('[data-dias]');
  const DIAS_TOTALES = 1797;
  const marcas = [];
  const raya = (x, y, alto, grosor) => {
    const inclinacion = (Math.sin(x * 1.7) * 1.6).toFixed(1);
    const trazo = crear('path', { d: `M${x} ${y} l${inclinacion} ${alto}`, 'stroke-width': grosor, stroke: 'currentColor', 'stroke-linecap': 'round', fill: 'none' });
    grupoRayas.append(trazo);
    marcas.push(trazo);
  };
  for (let anio = 0; anio < 4; anio += 1) {
    const base = 6 + anio * 72;
    for (let mes = 0; mes < 12; mes += 1) raya(base + mes * 4.8, 10, 56, 1.8);
    const cruce = crear('path', { d: `M${base - 3} 58 L${base + 59} 20`, 'stroke-width': 2.4, stroke: 'currentColor', 'stroke-linecap': 'round', fill: 'none' });
    grupoRayas.append(cruce);
    marcas.push(cruce);
  }
  for (let mes = 0; mes < 11; mes += 1) raya(8 + mes * 10, 100, 44, 2);
  [[124, 124], [137, 120]].forEach(([cx, cy]) => {
    const dia = crear('circle', { cx, cy, r: 3.4, fill: 'currentColor' });
    grupoRayas.append(dia);
    marcas.push(dia);
  });

  const gotas = Array.from({ length: 260 }, (_, i) => ({ x: azar(i + 3), y: azar(i + 97), v: 0.6 + azar(i + 41) * 0.8, largo: 10 + azar(i + 7) * 16 }));
  let intensidad = 0;
  let enMarcha = false;

  function ajustarLienzo() {
    const escala = window.devicePixelRatio || 1;
    lienzo.width = lienzo.clientWidth * escala;
    lienzo.height = lienzo.clientHeight * escala;
    contexto.setTransform(escala, 0, 0, escala, 0, 0);
  }

  function pintar() {
    const ancho = lienzo.clientWidth;
    const alto = lienzo.clientHeight;
    contexto.clearRect(0, 0, ancho, alto);
    const visibles = Math.floor(gotas.length * intensidad);
    contexto.strokeStyle = 'rgba(190, 230, 255, 0.4)';
    contexto.lineWidth = 1.1;
    contexto.beginPath();
    for (let i = 0; i < visibles; i += 1) {
      const gota = gotas[i];
      gota.y += gota.v * 0.018;
      if (gota.y > 1.05) { gota.y = -0.05; gota.x = azar(gota.x * 1000 + i); }
      const x = gota.x * ancho;
      const y = gota.y * alto;
      contexto.moveTo(x, y);
      contexto.lineTo(x - gota.largo * 0.18, y + gota.largo);
    }
    contexto.stroke();
    if (enMarcha) requestAnimationFrame(pintar);
  }

  window.addEventListener('resize', ajustarLienzo);
  ajustarLienzo();

  return (progreso) => {
    intensidad = movimientoReducido ? 0 : Math.sin(Math.PI * progreso);
    escena.style.setProperty('--i', Math.sin(Math.PI * progreso).toFixed(3));
    const conteo = limitar((progreso - 0.08) / 0.74);
    const hechas = Math.round(conteo * marcas.length);
    marcas.forEach((marca, i) => marca.classList.toggle('hecha', i < hechas));
    textoDias.textContent = conteo >= 1 ? '4 años, 11 meses y 2 días' : `≈ ${Math.round(conteo * DIAS_TOTALES).toLocaleString('es')}`;
    const debeLlover = intensidad > 0.02 && progreso > 0 && progreso < 1;
    if (debeLlover && !enMarcha) { enMarcha = true; requestAnimationFrame(pintar); }
    if (!debeLlover && enMarcha) { enMarcha = false; contexto.clearRect(0, 0, lienzo.width, lienzo.height); }
  };
})();

/* ───────── V · Mariposas amarillas que siguen al cursor ───────── */
(() => {
  if (movimientoReducido) return;
  const enjambre = document.querySelector('.enjambre');
  const seccion = document.querySelector('.escena-mariposas');
  const forma = '<svg viewBox="0 0 26 22"><path class="ala ala-i" d="M13 11 C 6 0 0 2 1 8 C 2 13 8 13 13 11 C 7 14 4 20 9 21 C 12 21 13 15 13 11Z"/><path class="ala ala-d" d="M13 11 C 20 0 26 2 25 8 C 24 13 18 13 13 11 C 19 14 22 20 17 21 C 14 21 13 15 13 11Z"/><rect class="cuerpo" x="12.2" y="6" width="1.6" height="11" rx=".8"/></svg>';
  const bandada = Array.from({ length: 7 }, (_, i) => {
    const nodo = document.createElement('div');
    nodo.className = 'mariposa';
    nodo.innerHTML = forma;
    enjambre.append(nodo);
    return { nodo, x: window.innerWidth / 2, y: window.innerHeight, retraso: 0.025 + i * 0.012, dx: (azar(i + 5) - 0.5) * 140, dy: (azar(i + 9) - 0.5) * 110, fase: azar(i + 2) * 6 };
  });
  const objetivo = { x: window.innerWidth * 0.7, y: window.innerHeight * 0.5, ultimo: 0 };
  let activa = false;

  window.addEventListener('pointermove', (evento) => {
    objetivo.x = evento.clientX;
    objetivo.y = evento.clientY;
    objetivo.ultimo = performance.now();
  }, { passive: true });

  function volar(tiempo) {
    const quieto = tiempo - objetivo.ultimo > 2500;
    bandada.forEach((mariposa) => {
      const deriva = tiempo / 1000 + mariposa.fase;
      const metaX = (quieto ? window.innerWidth * (0.5 + 0.3 * Math.sin(deriva * 0.4)) : objetivo.x) + mariposa.dx + Math.sin(deriva * 2.1) * 14;
      const metaY = (quieto ? window.innerHeight * (0.45 + 0.2 * Math.cos(deriva * 0.5)) : objetivo.y) + mariposa.dy + Math.cos(deriva * 1.7) * 12;
      const vx = (metaX - mariposa.x) * mariposa.retraso;
      const vy = (metaY - mariposa.y) * mariposa.retraso;
      mariposa.x += vx;
      mariposa.y += vy;
      const giro = Math.max(-35, Math.min(35, vx * 3));
      mariposa.nodo.style.transform = `translate(${mariposa.x.toFixed(1)}px, ${mariposa.y.toFixed(1)}px) rotate(${giro.toFixed(1)}deg)`;
    });
    if (activa) requestAnimationFrame(volar);
  }

  new IntersectionObserver(([entrada]) => {
    const visible = entrada.isIntersecting;
    enjambre.classList.toggle('activo', visible);
    if (visible && !activa) { activa = true; requestAnimationFrame(volar); }
    if (!visible) activa = false;
  }, { threshold: 0.25 }).observe(seccion);
})();

/* ───────── Pasos del relato y reloj de cien años ───────── */
const observadorPasos = new IntersectionObserver((entradas) => {
  entradas.forEach((entrada) => entrada.target.classList.toggle('activo', entrada.isIntersecting));
}, { rootMargin: '-38% 0px -38% 0px' });
document.querySelectorAll('.paso').forEach((paso) => observadorPasos.observe(paso));

/* ───────── V · Treinta y dos levantamientos, todos perdidos ───────── */
const guerras = (() => {
  const contenedor = document.querySelector('.banderas');
  const contador = document.querySelector('[data-levantamientos]');
  const TOTAL = 32;
  const banderas = Array.from({ length: TOTAL }, () => {
    const bandera = document.createElement('span');
    bandera.className = 'bandera';
    bandera.innerHTML = '<img src="../assets/objetos/cien-anos/bandera.png" alt=""><svg viewBox="0 0 30 30" preserveAspectRatio="none"><path class="tacha" d="M3 4 L27 27 M27 5 L4 26"/></svg>';
    contenedor.append(bandera);
    return bandera;
  });
  return (progreso) => {
    const avance = limitar((progreso - 0.05) / 0.75) * TOTAL;
    banderas.forEach((bandera, i) => {
      bandera.classList.toggle('alzada', avance > i);
      bandera.classList.toggle('perdida', avance > i + 0.6);
    });
    contador.textContent = String(Math.min(TOTAL, Math.floor(avance)));
  };
})();

/* ───────── IX · Teatro de sombras ───────── */
const sombras = (() => {
  const escena = document.querySelector('.escena-sombras');
  const pantalla = escena.querySelector('.escenario');
  const figuras = [...escena.querySelectorAll('.sombra')];
  const suave = (t) => t * t * (3 - 2 * t);
  const mezcla = (a, b, t) => a + (b - a) * t;
  let luzX = 0.5;
  let objetivoLuz = 0.5;
  let centros = figuras.map(() => -1000);
  let animandoLuz = false;

  function inclinar() {
    const ancho = window.innerWidth;
    pantalla.style.setProperty('--luz-x', `${(luzX * 100).toFixed(1)}%`);
    figuras.forEach((figura, i) => {
      figura.style.setProperty('--sesgo', `${(((centros[i] - luzX * ancho) / ancho) * 16).toFixed(2)}deg`);
    });
  }

  function seguirLuz() {
    luzX += (objetivoLuz - luzX) * 0.06;
    inclinar();
    if (animandoLuz && Math.abs(objetivoLuz - luzX) > 0.001) requestAnimationFrame(seguirLuz);
    else animandoLuz = false;
  }

  window.addEventListener('pointermove', (evento) => {
    objetivoLuz = 0.2 + 0.6 * (evento.clientX / window.innerWidth);
    if (!animandoLuz && !movimientoReducido) { animandoLuz = true; requestAnimationFrame(seguirLuz); }
  }, { passive: true });

  return (progreso) => {
    const ancho = window.innerWidth;
    const alto = window.innerHeight;
    const movil = ancho < 860;
    const desfile = limitar(progreso / 0.5);
    const separacion = suave(limitar((progreso - 0.5) / 0.28));
    const lectura = suave(limitar((progreso - 0.8) / 0.14));
    const altoFigura = mezcla(alto * (movil ? 0.38 : 0.58), alto * (movil ? 0.17 : 0.29), separacion);
    const anchos = figuras.map((figura) => {
      const imagen = figura.querySelector('img');
      const proporcion = imagen.naturalWidth ? imagen.naturalWidth / imagen.naturalHeight : 0.5;
      return altoFigura * proporcion;
    });
    const hueco = ancho * 0.025;
    const largoFila = anchos.reduce((suma, valor) => suma + valor, 0) + hueco * (figuras.length - 1);
    const inicioFila = mezcla(ancho, (ancho - largoFila) / 2, 1 - (1 - desfile) ** 2);
    let cursor = inicioFila;
    centros = figuras.map((_, i) => {
      const enFila = cursor + anchos[i] / 2;
      cursor += anchos[i] + hueco;
      const enSoledad = movil
        ? ancho * (0.14 + 0.24 * (i % 4))
        : ancho * (0.09 + (0.82 * i) / (figuras.length - 1));
      return mezcla(enFila, enSoledad, separacion);
    });
    // En móvil no caben ocho en fila: al separarse, los cuatro primeros suben a una segunda fila.
    const alzas = figuras.map((_, i) => (movil && i < 4 ? alto * 0.3 * separacion : 0));
    figuras.forEach((figura, i) => {
      const cercania = 1 - limitar(Math.abs(centros[i] - ancho / 2) / (ancho * 0.17));
      figura.style.setProperty('--cx', `${centros[i].toFixed(1)}px`);
      figura.style.setProperty('--h', `${altoFigura.toFixed(1)}px`);
      figura.style.setProperty('--alza', `${alzas[i].toFixed(1)}px`);
      figura.style.setProperty('--nombre', (suave(cercania) * (1 - limitar(separacion * 4))).toFixed(3));
      figura.style.setProperty('--foco', separacion.toFixed(3));
    });
    pantalla.style.setProperty('--luz', (1 - 0.88 * separacion).toFixed(3));
    pantalla.style.setProperty('--lectura', lectura.toFixed(3));
    inclinar();
  };
})();

/* ───────── El color de cada época de Macondo ───────── */
const epocas = (() => {
  // [selector de la escena que la ancla, fondo, luz, tinta, acento]
  const paleta = [
    ['.umbral', '#0E4D3A', '#1F8A5B', '#FFF4D6', '#FFD23F'],
    ['.escena-imanes', '#0E4D3A', '#1F8A5B', '#FFF4D6', '#FFD23F'],
    ['.escena-hielo', '#0B5A47', '#21946A', '#FFF4D6', '#FFD23F'],
    ['.escena-insomnio', '#2B1F5C', '#6A3FA0', '#F4EEFF', '#FFD23F'],
    ['.escena-nombres', '#A3164F', '#F0507F', '#FFF0F3', '#FFD23F'],
    ['.escena-guerras', '#4A1414', '#8C2A1E', '#FFEDE3', '#FFB347'],
    ['.escena-remedios', '#2D6CDF', '#7FB2FF', '#FFFFFF', '#FFD23F'],
    ['.escena-mariposas', '#0D5E57', '#19A38A', '#F2FFF8', '#FFD23F'],
    ['.escena-lluvia', '#16233F', '#2E4D86', '#E6EEF7', '#9BE7F5'],
    ['.escena-sombras', '#1C0F0A', '#8A4B1E', '#FFEEDD', '#FFB347'],
    ['.cierre', '#7A2216', '#D2532F', '#FFEEDD', '#FFB347'],
  ];
  const aRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const mezclar = (a, b, t) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',')})`;
  let anclas = [];

  function medir() {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    anclas = paleta.map(([selector, ...colores], indice) => {
      const seccion = document.querySelector(selector);
      const centro = seccion.offsetTop + seccion.offsetHeight / 2 - window.innerHeight / 2;
      const posicion = indice === 0 ? 0 : indice === paleta.length - 1 ? 1 : limitar(centro / total);
      return { posicion, colores: colores.map(aRgb) };
    });
  }

  function pintar(edad) {
    let siguiente = anclas.findIndex((ancla) => ancla.posicion >= edad);
    if (siguiente <= 0) siguiente = Math.max(1, siguiente);
    const desde = anclas[siguiente - 1];
    const hasta = anclas[siguiente];
    const tramo = hasta.posicion - desde.posicion;
    const t = tramo > 0 ? limitar((edad - desde.posicion) / tramo) : 1;
    // Cada época se sostiene y el cambio ocurre rápido entre escenas, para no pasar por colores turbios
    const corte = limitar((t - 0.38) / 0.24);
    const suave = corte * corte * (3 - 2 * corte);
    ['--fondo', '--fondo-2', '--tinta', '--acento'].forEach((variable, i) => {
      raiz.style.setProperty(variable, mezclar(desde.colores[i], hasta.colores[i], suave));
    });
  }

  window.addEventListener('resize', medir);
  medir();
  return pintar;
})();

const reloj = document.querySelector('[data-anio]');
const escenas = [...document.querySelectorAll('.escena[data-escena]')];
const actualizadores = { nombres: espiral, insomnio, lluvia, guerras, sombras };
let pendiente = false;

function actualizar() {
  pendiente = false;
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const edad = total > 0 ? limitar(window.scrollY / total) : 0;
  raiz.style.setProperty('--edad', edad.toFixed(3));
  epocas(edad);
  reloj.textContent = String(Math.max(1, Math.round(edad * 100)));
  escenas.forEach((escena) => {
    const progreso = progresoDe(escena);
    escena.style.setProperty('--s', progreso.toFixed(3));
    const actualizador = actualizadores[escena.dataset.escena];
    if (actualizador) actualizador(progreso);
  });
}

window.addEventListener('scroll', () => {
  if (!pendiente) { pendiente = true; requestAnimationFrame(actualizar); }
}, { passive: true });
window.addEventListener('resize', actualizar);
actualizar();

document.querySelector('[data-volver]').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: movimientoReducido ? 'auto' : 'smooth' });
});
