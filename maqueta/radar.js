const SVG_NS = 'http://www.w3.org/2000/svg';

function crearElemento(nombre, atributos, texto) {
  const nodo = document.createElementNS(SVG_NS, nombre);
  Object.entries(atributos).forEach(([clave, valor]) => nodo.setAttribute(clave, valor));
  if (texto !== undefined) nodo.textContent = texto;
  return nodo;
}

function dibujarRadar(svg) {
  const dimensiones = JSON.parse(svg.dataset.scores);
  const centro = 240;
  const radio = 150;
  const punto = (indice, distancia) => {
    const angulo = ((-90 + indice * (360 / dimensiones.length)) * Math.PI) / 180;
    return [centro + distancia * Math.cos(angulo), centro + distancia * Math.sin(angulo)];
  };
  const poligono = (distancia) =>
    dimensiones.map((_, i) => punto(i, distancia)).map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ') + ' Z';

  svg.setAttribute('viewBox', '-50 0 580 480');
  for (let nivel = 1; nivel <= 5; nivel += 1) {
    svg.append(crearElemento('path', { class: 'ring', d: poligono((radio * nivel) / 5) }));
  }
  dimensiones.forEach((_, i) => {
    const [x, y] = punto(i, radio);
    svg.append(crearElemento('path', { class: 'axis', d: `M${centro} ${centro} L${x.toFixed(1)} ${y.toFixed(1)}` }));
  });
  const puntos = dimensiones.map(([, valor], i) => punto(i, (radio * valor) / 5));
  svg.append(crearElemento('path', {
    class: 'shape',
    d: puntos.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ') + ' Z',
  }));
  puntos.forEach(([x, y]) => svg.append(crearElemento('circle', { class: 'dot', cx: x.toFixed(1), cy: y.toFixed(1), r: 7 })));
  dimensiones.forEach(([nombre, valor], i) => {
    const [x, y] = punto(i, radio + 52);
    const ancla = Math.abs(x - centro) < 4 ? 'middle' : x > centro ? 'start' : 'end';
    svg.append(crearElemento('text', { class: 'lbl', x: x.toFixed(0), y: (y - 8).toFixed(0), 'text-anchor': ancla }, nombre));
    svg.append(crearElemento('text', { class: 'val', x: x.toFixed(0), y: (y + 18).toFixed(0), 'text-anchor': ancla }, String(valor).replace('.', ',')));
  });
}

document.querySelectorAll('svg.radar').forEach(dibujarRadar);

function sustituirPorIcono(imagen) {
  const icono = document.createElement('i');
  icono.className = `ti ${imagen.dataset.fallbackIcon}`;
  imagen.replaceWith(icono);
}

document.querySelectorAll('img[data-fallback-icon]').forEach((imagen) => {
  if (imagen.complete && imagen.naturalWidth === 0) {
    sustituirPorIcono(imagen);
  } else {
    imagen.addEventListener('error', () => sustituirPorIcono(imagen), { once: true });
  }
});
