const SVG_NS = 'http://www.w3.org/2000/svg';

document.documentElement.classList.add('js');

function nodoSvg(nombre, atributos = {}, texto) {
  const nodo = document.createElementNS(SVG_NS, nombre);
  Object.entries(atributos).forEach(([clave, valor]) => nodo.setAttribute(clave, valor));
  if (texto !== undefined) nodo.textContent = texto;
  return nodo;
}

function inyectarFiltros() {
  const svg = nodoSvg('svg', { width: 0, height: 0, 'aria-hidden': 'true', style: 'position:absolute' });
  svg.innerHTML = `
    <filter id="lapiz" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7"/>
      <feDisplacementMap in="SourceGraphic" scale="4"/>
    </filter>
    <filter id="tinta" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" result="ruido"/>
      <feColorMatrix in="ruido" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.7 1.5" result="poros"/>
      <feComposite in="SourceGraphic" in2="poros" operator="in" result="gastado"/>
      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="9" result="onda"/>
      <feDisplacementMap in="gastado" in2="onda" scale="3"/>
    </filter>`;
  document.body.prepend(svg);
}

function dibujarRadar(svg) {
  const dimensiones = JSON.parse(svg.dataset.scores);
  const centro = 240;
  const radio = 150;
  const punto = (indice, distancia) => {
    const angulo = ((-90 + indice * (360 / dimensiones.length)) * Math.PI) / 180;
    return [centro + distancia * Math.cos(angulo), centro + distancia * Math.sin(angulo)];
  };
  const trazo = (puntos) => puntos.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ') + ' Z';

  svg.setAttribute('viewBox', '-60 0 600 480');
  for (let nivel = 1; nivel <= 5; nivel += 1) {
    svg.append(nodoSvg('path', { class: 'ring', d: trazo(dimensiones.map((_, i) => punto(i, (radio * nivel) / 5))) }));
  }
  dimensiones.forEach((_, i) => {
    const [x, y] = punto(i, radio);
    svg.append(nodoSvg('path', { class: 'axis', d: `M${centro} ${centro} L${x.toFixed(1)} ${y.toFixed(1)}` }));
  });
  const puntos = dimensiones.map(([, valor], i) => punto(i, (radio * valor) / 5));
  svg.append(nodoSvg('path', { class: 'shape', d: trazo(puntos) }));
  puntos.forEach(([x, y]) => svg.append(nodoSvg('circle', { class: 'dot', cx: x.toFixed(1), cy: y.toFixed(1), r: 5 })));
  dimensiones.forEach(([nombre, valor], i) => {
    const [x, y] = punto(i, radio + 40);
    const ancla = Math.abs(x - centro) < 4 ? 'middle' : x > centro ? 'start' : 'end';
    svg.append(nodoSvg('text', { class: 'lbl', x: x.toFixed(0), y: (y - 12).toFixed(0), 'text-anchor': ancla }, nombre));
    svg.append(nodoSvg('text', { class: 'val', x: x.toFixed(0), y: (y + 26).toFixed(0), 'text-anchor': ancla }, String(valor).replace('.', ',')));
  });
}

function estamparSello(contenedor, indice) {
  const arriba = contenedor.dataset.arriba || 'ATA NYMY';
  const abajo = contenedor.dataset.abajo || 'LEÍDO';
  const centro = contenedor.dataset.centro || '';
  const id = `arco-${indice}`;
  const svg = nodoSvg('svg', { viewBox: '0 0 200 200', role: 'img', 'aria-label': `Sello: ${abajo} ${centro}` });
  const grupo = nodoSvg('g', { filter: 'url(#tinta)' });
  grupo.append(
    nodoSvg('circle', { cx: 100, cy: 100, r: 92, fill: 'none', stroke: 'currentColor', 'stroke-width': 5 }),
    nodoSvg('circle', { cx: 100, cy: 100, r: 64, fill: 'none', stroke: 'currentColor', 'stroke-width': 2.5 }),
    nodoSvg('path', { id: `${id}-a`, d: 'M 24 100 A 76 76 0 0 1 176 100', fill: 'none' }),
    nodoSvg('path', { id: `${id}-b`, d: 'M 30 100 A 70 70 0 0 0 170 100', fill: 'none' }),
  );
  const textoArriba = nodoSvg('text', { 'font-size': 19, 'text-anchor': 'middle' });
  textoArriba.append(nodoSvg('textPath', { href: `#${id}-a`, startOffset: '50%' }, arriba));
  const textoAbajo = nodoSvg('text', { 'font-size': 19, 'text-anchor': 'middle', dy: 14 });
  textoAbajo.append(nodoSvg('textPath', { href: `#${id}-b`, startOffset: '50%' }, abajo));
  grupo.append(textoArriba, textoAbajo, nodoSvg('text', { x: 100, y: 110, 'font-size': 26, 'text-anchor': 'middle' }, centro));
  svg.append(grupo);
  contenedor.append(svg);
}

function sustituirPorIcono(imagen) {
  const icono = document.createElement('i');
  icono.className = `ti ${imagen.dataset.fallbackIcon}`;
  icono.setAttribute('aria-hidden', 'true');
  imagen.replaceWith(icono);
}

function partirMarcasLargas() {
  document.querySelectorAll('.sub, .doble, .tach').forEach((marca) => {
    const texto = marca.textContent;
    if (texto.length <= 16) return;
    const clase = ['sub', 'doble', 'tach'].find((nombre) => marca.classList.contains(nombre));
    marca.classList.remove(clase);
    marca.textContent = '';
    const palabras = texto.trim().split(/\s+/);
    palabras.forEach((palabra, indice) => {
      const trozo = document.createElement('span');
      trozo.className = `${clase} trozo`;
      trozo.style.transitionDelay = `${indice * 0.07}s`;
      trozo.textContent = palabra;
      marca.append(trozo);
      if (indice < palabras.length - 1) marca.append(' ');
    });
  });
}

function observarMarcas() {
  const marcas = document.querySelectorAll('.sub, .doble, .circ, .tach, .resalta');
  if (!('IntersectionObserver' in window)) {
    marcas.forEach((marca) => marca.classList.add('visto'));
    return;
  }
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('visto');
        observador.unobserve(entrada.target);
      }
    });
  }, { rootMargin: '0px 0px -12% 0px' });
  marcas.forEach((marca) => observador.observe(marca));
}

inyectarFiltros();
partirMarcasLargas();
document.querySelectorAll('svg.radar').forEach(dibujarRadar);
document.querySelectorAll('.sello').forEach(estamparSello);
document.querySelectorAll('img[data-fallback-icon]').forEach((imagen) => {
  if (imagen.complete && imagen.naturalWidth === 0) sustituirPorIcono(imagen);
  else imagen.addEventListener('error', () => sustituirPorIcono(imagen), { once: true });
});
observarMarcas();
