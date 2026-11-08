const NS = 'http://www.w3.org/2000/svg';
const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const acotar = (valor, minimo = 0, maximo = 1) => Math.min(maximo, Math.max(minimo, valor));

function nodo(nombre, atributos = {}, texto) {
  const elemento = document.createElementNS(NS, nombre);
  Object.entries(atributos).forEach(([clave, valor]) => elemento.setAttribute(clave, valor));
  if (texto !== undefined) elemento.textContent = texto;
  return elemento;
}

/* ───────── El viaje de Humboldt (1799-1804) ───────── */
// [lugar, año, x, y] en un mapa a mano de 1200 × 760, sin escala
const PARADAS = [
  ['La Coruña', 1799, 1080, 175],
  ['Tenerife', 1799, 1010, 300],
  ['Cumaná', 1799, 560, 410],
  ['Orinoco', 1800, 500, 485],
  ['La Habana', 1800, 330, 290],
  ['Cartagena', 1801, 420, 400],
  ['Bogotá', 1801, 410, 470],
  ['Quito', 1802, 345, 545],
  ['Chimborazo', 1802, 322, 578],
  ['Lima', 1802, 320, 660],
  ['México', 1803, 170, 300],
  ['La Habana', 1804, 330, 290],
  ['Filadelfia', 1804, 400, 150],
  ['Burdeos', 1804, 1110, 130],
];

const viaje = (() => {
  const mapa = document.querySelector('.mapa');
  const camara = mapa.querySelector('.camara');
  const sombra = mapa.querySelector('.ruta-sombra');
  const hecha = mapa.querySelector('.ruta-hecha');
  const capaParadas = mapa.querySelector('.estaciones');
  const viajero = mapa.querySelector('.viajero');
  const textoEstacion = document.querySelector('[data-estacion]');
  const textoAnio = document.querySelector('[data-anio-h]');
  const textoParada = document.querySelector('[data-parada]');

  let trazo = `M${PARADAS[0][2]} ${PARADAS[0][3]}`;
  const medidor = nodo('path', { fill: 'none', stroke: 'none' });
  mapa.append(medidor);
  const fracciones = [0];
  const largos = [0];
  for (let i = 1; i < PARADAS.length; i += 1) {
    const [, , x0, y0] = PARADAS[i - 1];
    const [, , x1, y1] = PARADAS[i];
    const signo = i % 2 ? 1 : -1;
    const cx = (x0 + x1) / 2 - (y1 - y0) * 0.18 * signo;
    const cy = (y0 + y1) / 2 + (x1 - x0) * 0.18 * signo;
    trazo += ` Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x1} ${y1}`;
    medidor.setAttribute('d', trazo);
    largos.push(medidor.getTotalLength());
  }
  medidor.remove();
  const total = largos[largos.length - 1];
  largos.forEach((largo, i) => { fracciones[i] = largo / total; });
  sombra.setAttribute('d', trazo);
  hecha.setAttribute('d', trazo);
  hecha.style.strokeDasharray = `${total} ${total}`;

  const vistas = new Set();
  const grupos = PARADAS.map(([lugar, anio, x, y]) => {
    const grupo = nodo('g', { class: 'estacion' });
    grupo.append(nodo('circle', { cx: x, cy: y, r: 5 }));
    const repetida = vistas.has(lugar);
    vistas.add(lugar);
    const etiqueta = nodo('text', { x: x + 10, y: y + (repetida ? 20 : 4) });
    etiqueta.append(document.createTextNode(repetida ? '' : `${lugar} `));
    etiqueta.append(nodo('tspan', { class: 'anio' }, String(anio)));
    grupo.append(etiqueta);
    capaParadas.append(grupo);
    return grupo;
  });

  const ESCALA = window.matchMedia('(max-width: 860px)').matches ? 1.25 : 1.45;

  const mover = (avance) => {
    hecha.style.strokeDashoffset = `${total * (1 - avance)}`;
    const punto = sombra.getPointAtLength(total * avance);
    viajero.setAttribute('transform', `translate(${punto.x.toFixed(1)} ${punto.y.toFixed(1)})`);
    const dx = 300 - punto.x * ESCALA;
    const dy = 350 - punto.y * ESCALA;
    camara.setAttribute('transform', `translate(${dx.toFixed(1)} ${dy.toFixed(1)}) scale(${ESCALA})`);
    let actual = 0;
    fracciones.forEach((fraccion, i) => {
      const pasada = avance >= fraccion - 0.001;
      grupos[i].classList.toggle('pasada', pasada);
      if (pasada) actual = i;
    });
    textoEstacion.textContent = PARADAS[actual][0];
    textoAnio.textContent = String(PARADAS[actual][1]);
    textoParada.textContent = String(actual + 1);
  };
  mover.fraccionDe = (lugar) => fracciones[PARADAS.findIndex(([nombre]) => nombre === lugar)];
  return mover;
})();

/* ───────── Notas: cada una cae en el lado de su capítulo ───────── */
const notas = (() => {
  const plantilla = document.getElementById('notas-datos');
  const contenedores = { g: document.querySelector('.notas-g'), h: document.querySelector('.notas-h') };
  const tarjetas = [...plantilla.content.querySelectorAll('.nota-tarjeta')].map((tarjeta) => {
    const copia = tarjeta.cloneNode(true);
    contenedores[copia.dataset.lado].append(copia);
    return copia;
  });
  const lineasSuma = [...document.querySelectorAll('.suma li')];
  const panelGauss = document.querySelector('.panel-gauss');
  const panelHumboldt = document.querySelector('.panel-humboldt');
  const ceres = document.querySelector('.ceres');
  const altura = document.querySelector('[data-altura]');
  const ALTURA_ALCANZADA = 5878;
  const INICIO = 0.03;
  const TRAMO = 0.94 / tarjetas.length;

  return (progreso) => {
    const indice = Math.floor((progreso - INICIO) / TRAMO);
    tarjetas.forEach((tarjeta, i) => tarjeta.classList.toggle('activa', i === indice));
    const local = acotar((progreso - INICIO - indice * TRAMO) / TRAMO);
    tarjetas.forEach((tarjeta, i) => {
      if (tarjeta.hasAttribute('data-comillas')) tarjeta.classList.toggle('indirecto', i < indice || (i === indice && local > 0.4));
    });
    const modo = tarjetas[indice] ? tarjetas[indice].dataset.modo : undefined;
    const avanceModo = acotar(local / 0.75);
    panelGauss.classList.toggle('modo-ceres', modo === 'ceres');
    panelHumboldt.classList.toggle('modo-chimborazo', modo === 'chimborazo');
    panelGauss.style.setProperty('--l', modo === 'ceres' ? avanceModo.toFixed(3) : '0');
    panelHumboldt.style.setProperty('--l', modo === 'chimborazo' ? avanceModo.toFixed(3) : '0');
    if (modo === 'ceres') {
      const angulo = avanceModo * Math.PI * 2;
      const giro = (-12 * Math.PI) / 180;
      const ex = 138 * Math.cos(angulo);
      const ey = 98 * Math.sin(angulo);
      const x = 168 + ex * Math.cos(giro) - ey * Math.sin(giro);
      const y = 116 + ex * Math.sin(giro) + ey * Math.cos(giro);
      ceres.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
    }
    if (modo === 'chimborazo') altura.textContent = `≈ ${Math.round(avanceModo * ALTURA_ALCANZADA).toLocaleString('es')}`;
    const inicioSuma = INICIO + TRAMO;
    lineasSuma.forEach((linea, i) => linea.classList.toggle('escrita', progreso > inicioSuma + i * TRAMO * 0.14));
  };
})();

/* ───────── El mapa avanza al ritmo de las notas: Humboldt llega al Chimborazo con su nota ───────── */
const tramosRuta = (() => {
  const tarjetas = [...document.getElementById('notas-datos').content.querySelectorAll('.nota-tarjeta')];
  const tramo = 0.94 / tarjetas.length;
  const indiceChimborazo = tarjetas.findIndex((tarjeta) => tarjeta.dataset.modo === 'chimborazo');
  return [[0.03, 0], [0.03 + (indiceChimborazo + 0.35) * tramo, viaje.fraccionDe('Chimborazo')], [0.93, 1]];
})();

function rutaSegunLectura(progreso) {
  for (let i = 1; i < tramosRuta.length; i += 1) {
    const [s0, r0] = tramosRuta[i - 1];
    const [s1, r1] = tramosRuta[i];
    if (progreso <= s1) return r0 + (r1 - r0) * acotar((progreso - s0) / (s1 - s0));
  }
  return 1;
}

/* ───────── Scroll ───────── */
const partido = document.querySelector('.partido');
let pendiente = false;

function actualizar() {
  pendiente = false;
  const caja = partido.getBoundingClientRect();
  const recorrido = caja.height - window.innerHeight;
  const progreso = recorrido > 0 ? acotar(-caja.top / recorrido) : 0;
  partido.style.setProperty('--s', progreso.toFixed(3));
  viaje(rutaSegunLectura(progreso));
  notas(progreso);
}

window.addEventListener('scroll', () => {
  if (!pendiente) { pendiente = true; requestAnimationFrame(actualizar); }
}, { passive: true });
window.addEventListener('resize', actualizar);
actualizar();

/* ───────── Berlín, otra vez: se cierra la pantalla ───────── */
const encuentro = document.querySelector('.encuentro');
if (reducido) encuentro.classList.add('cerrado');
new IntersectionObserver(([entrada]) => {
  if (entrada.isIntersecting) encuentro.classList.add('cerrado');
}, { threshold: 0.3 }).observe(encuentro);

/* ───────── ¿Más Gauss o más Humboldt? ───────── */
const RESPUESTAS = {
  g: 'Te creemos. Seguro leíste esto entero sin levantarte de la silla.',
  h: 'Entonces ya estarías leyendo otra cosa, en otro país, midiendo la temperatura del café.',
};
const respuesta = document.querySelector('.voto-respuesta');
document.querySelectorAll('[data-voto]').forEach((boton) => {
  boton.setAttribute('aria-pressed', 'false');
  boton.addEventListener('click', () => {
    document.querySelectorAll('[data-voto]').forEach((otro) => otro.setAttribute('aria-pressed', String(otro === boton)));
    respuesta.textContent = RESPUESTAS[boton.dataset.voto];
  });
});
