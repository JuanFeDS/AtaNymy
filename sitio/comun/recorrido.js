// Recorrido con flechas: → y ↓ llevan al siguiente momento de la historia, ← y ↑ al anterior.
// Las paradas salen del propio HTML:
//   .paso                      el párrafo del relato queda centrado en pantalla
//   [data-paradas="0.2,0.6"]   fracciones del recorrido de una escena fija
//   [data-parada]              el elemento queda en el tercio superior
// Espacio, AvPág y la rueda siguen haciendo scroll libre.
(() => {
  const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const TOLERANCIA = 24;

  function arriba(elemento) {
    return elemento.getBoundingClientRect().top + window.scrollY;
  }

  function paradas() {
    const alto = window.innerHeight;
    const posiciones = [0];
    document.querySelectorAll('.paso').forEach((paso) => {
      posiciones.push(arriba(paso) + paso.offsetHeight / 2 - alto / 2);
    });
    document.querySelectorAll('[data-paradas]').forEach((seccion) => {
      const recorrido = seccion.offsetHeight - alto;
      seccion.dataset.paradas.split(',').forEach((fraccion) => {
        posiciones.push(arriba(seccion) + recorrido * Number(fraccion));
      });
    });
    document.querySelectorAll('[data-parada]').forEach((elemento) => {
      posiciones.push(arriba(elemento) - alto * 0.18);
    });
    const maximo = document.documentElement.scrollHeight - alto;
    posiciones.push(maximo);
    return posiciones
      .map((posicion) => Math.round(Math.min(Math.max(posicion, 0), maximo)))
      .sort((a, b) => a - b)
      .filter((posicion, i, lista) => i === 0 || posicion - lista[i - 1] > TOLERANCIA);
  }

  function indiceActual(lista) {
    let indice = 0;
    lista.forEach((posicion, i) => { if (posicion <= window.scrollY + TOLERANCIA) indice = i; });
    return indice;
  }

  const indicador = document.createElement('nav');
  indicador.className = 'recorrido';
  indicador.setAttribute('aria-label', 'Recorrer la historia');
  indicador.innerHTML = '<button type="button" data-dir="-1" aria-label="Momento anterior">←</button><span class="recorrido-cuenta" aria-live="polite"></span><button type="button" data-dir="1" aria-label="Momento siguiente">→</button>';
  document.body.append(indicador);
  const cuenta = indicador.querySelector('.recorrido-cuenta');

  function pintarCuenta() {
    const lista = paradas();
    cuenta.textContent = `${indiceActual(lista) + 1} / ${lista.length}`;
  }

  // El scroll suave del navegador dura lo mismo para cualquier distancia y acelera las animaciones.
  // Este va a ritmo de lectura: más largo cuanto más lejos, con entrada y salida suaves.
  const DURACION_MINIMA = 1400;
  const DURACION_MAXIMA = 3200;
  const MS_POR_PIXEL = 1.1;
  let animacion = null;

  const suavizar = (t) => (t < 0.5 ? 4 * t * t * t : 1 - ((-2 * t + 2) ** 3) / 2);

  function detener() {
    if (animacion) cancelAnimationFrame(animacion.cuadro);
    animacion = null;
  }

  function desplazar(destino) {
    detener();
    if (reducido) { window.scrollTo(0, destino); return; }
    const origen = window.scrollY;
    const distancia = destino - origen;
    const duracion = Math.min(DURACION_MAXIMA, Math.max(DURACION_MINIMA, Math.abs(distancia) * MS_POR_PIXEL));
    const inicio = performance.now();
    animacion = { destino, cuadro: 0 };
    const paso = (ahora) => {
      const t = Math.min(1, (ahora - inicio) / duracion);
      window.scrollTo(0, origen + distancia * suavizar(t));
      if (t < 1 && animacion) animacion.cuadro = requestAnimationFrame(paso);
      else animacion = null;
    };
    animacion.cuadro = requestAnimationFrame(paso);
  }

  function mover(direccion) {
    const lista = paradas();
    const y = animacion ? animacion.destino : window.scrollY;
    const destino = direccion > 0
      ? lista.find((posicion) => posicion > y + TOLERANCIA)
      : [...lista].reverse().find((posicion) => posicion < y - TOLERANCIA);
    if (destino === undefined) return;
    desplazar(destino);
    indicador.classList.add('usado');
  }

  ['wheel', 'touchstart', 'mousedown'].forEach((tipo) => {
    window.addEventListener(tipo, (evento) => {
      if (!evento.target.closest || !evento.target.closest('.recorrido')) detener();
    }, { passive: true });
  });

  document.addEventListener('keydown', (evento) => {
    if (evento.altKey || evento.ctrlKey || evento.metaKey || evento.shiftKey) return;
    const objetivo = evento.target;
    if (objetivo.closest && objetivo.closest('input, textarea, select, [contenteditable]')) return;
    const direcciones = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    if (!(evento.key in direcciones)) return;
    evento.preventDefault();
    mover(direcciones[evento.key]);
  });

  indicador.addEventListener('click', (evento) => {
    const boton = evento.target.closest('[data-dir]');
    if (boton) mover(Number(boton.dataset.dir));
  });

  let pendiente = false;
  window.addEventListener('scroll', () => {
    if (pendiente) return;
    pendiente = true;
    requestAnimationFrame(() => { pendiente = false; pintarCuenta(); });
  }, { passive: true });
  window.addEventListener('resize', pintarCuenta);
  window.addEventListener('load', pintarCuenta);
  pintarCuenta();
})();
