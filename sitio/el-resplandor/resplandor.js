const raiz = document.documentElement;
const movimientoReducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const NS_SVG = 'http://www.w3.org/2000/svg';

const limitar = (valor, minimo = 0, maximo = 1) => Math.min(maximo, Math.max(minimo, valor));
const suavizar = (t) => { const u = limitar(t); return u * u * (3 - 2 * u); };

const pisos = [...document.querySelectorAll('.piso')];
const viajes = [...document.querySelectorAll('.viaje')];
const lamparas = [...document.querySelectorAll('.indicador li')];
const indicador = document.querySelector('.indicador');
const placa = document.querySelector('[data-placa]');
const sotano = document.querySelector('.piso-sotano');
const salon = document.querySelector('.piso-salon');
// Dos ejes distintos: el orden del DOM es la historia (escena 0…5); data-nivel es la altura en el edificio (0 = R … 5 = S)
const niveles = pisos.map((piso) => Number(piso.dataset.nivel));
const ESCENA_SOTANO = pisos.indexOf(sotano);
const ESCENA_SALON = pisos.indexOf(salon);
// En el salón el indicador se adelanta un instante a la parada que viene después en la historia
const NIVEL_FALLA = niveles[ESCENA_SALON + 1] ?? niveles[ESCENA_SALON];

function progresoDe(seccion) {
  const caja = seccion.getBoundingClientRect();
  const recorrido = caja.height - window.innerHeight;
  if (recorrido <= 0) return caja.top < 0 ? 1 : 0;
  return limitar(-caja.top / recorrido);
}

// Los títeres todavía se están generando: la figura solo aparece si su imagen existe.
document.querySelectorAll('.titere[data-src]').forEach((figura) => {
  const imagen = new Image();
  imagen.alt = '';
  imagen.addEventListener('load', () => { figura.append(imagen); figura.hidden = false; });
  imagen.src = figura.dataset.src;
});

// Marcas del reloj de la caldera
(() => {
  const grupo = document.querySelector('.cr-marcas');
  if (!grupo) return;
  for (let i = 0; i <= 10; i += 1) {
    const angulo = ((-120 + i * 24 - 90) * Math.PI) / 180;
    const trazo = document.createElementNS(NS_SVG, 'path');
    trazo.setAttribute('d', `M${(100 + 70 * Math.cos(angulo)).toFixed(1)} ${(100 + 70 * Math.sin(angulo)).toFixed(1)} L${(100 + 82 * Math.cos(angulo)).toFixed(1)} ${(100 + 82 * Math.sin(angulo)).toFixed(1)}`);
    grupo.append(trazo);
  }
})();

// El paso del relato que está en el centro de la pantalla se enciende
const observadorPasos = new IntersectionObserver((entradas) => {
  entradas.forEach((entrada) => entrada.target.classList.toggle('activo', entrada.isIntersecting));
}, { rootMargin: '-42% 0px -42% 0px' });
document.querySelectorAll('.paso').forEach((paso) => observadorPasos.observe(paso));

// Ventanas del viaje, en pantallas (alto del viewport):
//   entrada = cuánto del hueco ha subido desde abajo · salida = dónde queda el borde de abajo del hueco.
// Las puertas cierran con la entrada, abren con la salida; así abren cuando el piso nuevo ya está fijo
// y en las paradas de recorrido.js (párrafos centrados) siempre están abiertas, también en móvil.
const CIERRA_DESDE = 0.02;
const CIERRA_TRAMO = 0.4;
const ABRE_DESDE = 0.42;
const ABRE_TRAMO = 0.4;
const DING_ANTES = 0.22;
const easeInOutCubico = (u) => (u < 0.5 ? 4 * u * u * u : 1 - ((-2 * u + 2) ** 3) / 2);

// Cierre con peso: arranca lento, golpea y rebota un poco antes de quedar selladas
function hojasCerrando(avance, conRebote = true) {
  if (avance <= 0) return 1;
  if (avance < 0.8) return 1 - easeInOutCubico(avance / 0.8);
  return conRebote ? 0.045 * Math.sin(Math.PI * limitar((avance - 0.8) / 0.2)) : 0;
}

// Apertura: un tirón corto al soltar el pestillo y luego un deslizamiento suave
function hojasAbriendo(avance) {
  if (avance <= 0) return 0;
  if (avance < 0.14) return 0.03 * suavizar(avance / 0.14);
  const u = limitar((avance - 0.14) / 0.86);
  return 0.03 + 0.97 * (0.5 - Math.cos(Math.PI * u) / 2);
}

let ultimoY = window.scrollY;
let sentido = 1;
let expreso = null;
let cotaActual = niveles[0];

function estadoDelViaje(alto) {
  for (let indice = 0; indice < viajes.length; indice += 1) {
    const viaje = viajes[indice];
    const caja = viaje.getBoundingClientRect();
    const entrada = (alto - caja.top) / alto;
    const salida = caja.bottom / alto;
    if (entrada <= CIERRA_DESDE || salida <= 0) continue;
    const cierre = limitar((entrada - CIERRA_DESDE) / CIERRA_TRAMO);
    const apertura = limitar((ABRE_DESDE - salida) / ABRE_TRAMO);
    // retrocede = el lector hace scroll hacia atrás; no dice si la cabina sube o baja
    const retrocede = sentido < 0;
    const desde = indice > 0 ? niveles[indice - 1] : niveles[0];
    const hasta = niveles[indice];
    // +1 la cabina baja, -1 sube; el viaje del vestíbulo a PB no cambia de nivel y conserva el sentido del scroll
    const rumbo = Math.sign(hasta - desde) * (retrocede ? -1 : 1) || (retrocede ? -1 : 1);
    // Distancia que falta para empezar a abrir, según hacia dónde se viaja
    const falta = retrocede ? entrada - (CIERRA_DESDE + CIERRA_TRAMO) : salida - ABRE_DESDE;
    const largo = caja.height / alto + 1;
    const avance = suavizar(limitar((entrada - 0.45) / (largo - 0.62 - 0.45)));
    let tiron = 0;
    if (!movimientoReducido) {
      const arranque = limitar((entrada - 0.42) / 0.18);
      const frenado = limitar((0.8 - salida) / 0.18);
      tiron = rumbo * (7 * Math.sin(Math.PI * arranque) - 5 * Math.sin(Math.PI * frenado));
    }
    return {
      abre: apertura > 0 ? hojasAbriendo(apertura) : hojasCerrando(cierre, !retrocede),
      cerrada: cierre >= 1 && apertura <= 0,
      hacia: retrocede ? (indice > 0 ? viajes[indice - 1].dataset.hacia : 'Hall') : viaje.dataset.hacia,
      destino: retrocede ? desde : hasta,
      cota: desde + (hasta - desde) * avance,
      historia: indice > 0 ? indice - 1 + avance : 0,
      sube: rumbo < 0,
      ding: falta <= DING_ANTES,
      tiron,
    };
  }
  return null;
}

// Viaje expreso (botones del tablero): puertas cerradas todo el trayecto, abren al llegar
function estadoExpreso(alto) {
  const distancia = Math.abs(expreso.destino.getBoundingClientRect().top) / alto;
  if (distancia < 0.004) { expreso = null; return null; }
  // El scroll suave del navegador arranca rápido en saltos largos: el cierre se reparte en el primer 10 % del trayecto
  const cierre = limitar(Math.abs(window.scrollY - expreso.origen) / Math.max(alto * CIERRA_TRAMO, expreso.trayecto * 0.1));
  const apertura = limitar((ABRE_DESDE - distancia) / ABRE_TRAMO);
  const recorrido = limitar(Math.abs(window.scrollY - expreso.origen) / expreso.trayecto);
  return {
    abre: apertura > 0 ? hojasAbriendo(apertura) : hojasCerrando(cierre),
    cerrada: cierre >= 1 && apertura <= 0,
    hacia: expreso.hacia,
    destino: expreso.lampara,
    cota: expreso.desde + (expreso.lampara - expreso.desde) * recorrido,
    historia: null,
    sube: expreso.lampara < expreso.desde,
    ding: distancia - ABRE_DESDE <= DING_ANTES,
    tiron: 0,
  };
}

// La caldera, atada al avance del sótano (s). Todo sube y baja con el scroll, sin relojes.
function estadoCaldera(s) {
  const ESTALLA = 0.8;
  const tension = suavizar((s - 0.48) / (ESTALLA - 0.48));
  const estalla = limitar((s - ESTALLA) / 0.07);
  const despues = s >= ESTALLA;
  if (movimientoReducido) {
    const final = s >= ESTALLA + 0.04 ? 1 : 0;
    return { tension, temblor: 0, sacude: 0, fuego: 0, onda: 0, vuela: 0, humo: final, ceniza: final, destello: 0, alarma: false, presion: final ? 0.04 : 0.72 + 0.28 * tension };
  }
  const fuego = suavizar((s - ESTALLA) / 0.018) * (1 - suavizar((s - ESTALLA - 0.03) / 0.06));
  return {
    tension,
    temblor: despues ? 0 : tension,
    sacude: despues ? 1 - suavizar((s - ESTALLA) / 0.09) : 0,
    fuego,
    onda: estalla,
    vuela: limitar((s - ESTALLA) / 0.13),
    humo: suavizar((s - ESTALLA - 0.025) / 0.12),
    ceniza: suavizar((s - ESTALLA - 0.04) / 0.09),
    destello: 0.32 * fuego,
    alarma: tension > 0.72 && !despues,
    presion: despues ? 0.04 + 0.96 * (1 - suavizar((s - ESTALLA) / 0.04)) : 0.72 + 0.28 * tension,
  };
}

function actualizar() {
  const alto = window.innerHeight;
  const y = window.scrollY;
  if (y !== ultimoY) sentido = y > ultimoY ? 1 : -1;
  ultimoY = y;
  // Escena = el último piso (en orden de la historia) cuyo borde superior ya pasó la mitad de la pantalla
  let escena = 0;
  pisos.forEach((piso, indice) => {
    piso.style.setProperty('--s', progresoDe(piso).toFixed(4));
    if (piso.getBoundingClientRect().top <= alto / 2) escena = indice;
  });
  let cota = niveles[escena];
  let historia = escena;

  const viaje = (expreso && estadoExpreso(alto)) || estadoDelViaje(alto);
  const abre = viaje ? viaje.abre : 1;
  if (viaje) cota = viaje.cota;
  if (viaje && viaje.historia !== null) historia = viaje.historia;
  cotaActual = cota;

  raiz.style.setProperty('--abre', abre.toFixed(3));
  raiz.style.setProperty('--tiron', `${(viaje ? viaje.tiron : 0).toFixed(2)}px`);
  raiz.classList.toggle('abierto', abre >= 0.999);
  raiz.classList.toggle('viajando', Boolean(viaje && viaje.cerrada));
  if (viaje && viaje.hacia) placa.textContent = viaje.hacia;
  const ding = Boolean(viaje && viaje.ding && abre < 0.6);
  placa.parentElement.classList.toggle('ding', ding);
  placa.parentElement.classList.toggle('sube', Boolean(viaje && viaje.sube));

  const progresoSalon = parseFloat(salon.style.getPropertyValue('--s')) || 0;
  const falla = !viaje && escena === ESCENA_SALON && progresoSalon > 0.4 && progresoSalon < 0.52;
  const cotaVisible = falla ? NIVEL_FALLA - 0.3 : cota;
  raiz.style.setProperty('--cota', cotaVisible.toFixed(3));
  indicador.classList.toggle('falla', falla);
  // Redondeo: en los viajes largos cada lámpara intermedia se enciende al pasar, aunque el scroll vaya rápido
  lamparas.forEach((lampara, i) => {
    lampara.classList.toggle('on', Math.round(cotaVisible) === i);
    lampara.classList.toggle('ding', ding && viaje.destino === i);
  });

  const progresoSotano = parseFloat(sotano.style.getPropertyValue('--s')) || 0;
  const caldera = estadoCaldera(progresoSotano);
  const enSotano = escena === ESCENA_SOTANO && !viaje;
  // La presión sigue a la historia, no a la altura: sube con cada escena y llega a la caldera en el sótano
  let presion = 0.1 + 0.62 * limitar(historia / ESCENA_SOTANO);
  if (enSotano) presion = caldera.presion;
  if (sotano.getBoundingClientRect().bottom < alto / 2) presion = 0.04;
  raiz.style.setProperty('--presion', presion.toFixed(3));
  raiz.style.setProperty('--boom', (enSotano ? caldera.destello : 0).toFixed(3));
  raiz.classList.toggle('alarma', enSotano && caldera.alarma);
  ['tension', 'temblor', 'sacude', 'fuego', 'onda', 'vuela', 'humo', 'ceniza'].forEach((nombre) => {
    sotano.style.setProperty(`--${nombre}`, caldera[nombre].toFixed(3));
  });
}

let pendiente = false;
function pedirActualizar() {
  if (pendiente) return;
  pendiente = true;
  requestAnimationFrame(() => { pendiente = false; actualizar(); });
}

// Los setos solo se mueven cuando nadie los mira: cuando el scroll se detiene
(() => {
  const jardin = document.querySelector('.piso-jardin');
  const setos = [...jardin.querySelectorAll('.seto')];
  const ritmo = [1, 0.7, 0.85];
  const MAXIMO = 8;
  let pasos = 0;
  let temporizador = null;
  let reloj = null;

  const visible = () => { const s = parseFloat(jardin.style.getPropertyValue('--s')) || 0; return s > 0.04 && s < 0.96; };
  const mover = () => {
    if (!visible() || pasos >= MAXIMO) return;
    pasos += 1;
    setos.forEach((seto, i) => seto.style.setProperty('--paso', Math.round(pasos * ritmo[i]).toString()));
  };

  window.addEventListener('scroll', () => {
    clearTimeout(temporizador);
    clearInterval(reloj);
    temporizador = setTimeout(() => {
      mover();
      reloj = setInterval(mover, 1200);
    }, 900);
  }, { passive: true });
})();

document.querySelectorAll('[data-ir]').forEach((boton) => {
  boton.addEventListener('click', () => {
    const destino = document.getElementById(boton.dataset.ir);
    const anterior = destino.previousElementSibling;
    if (Math.abs(destino.getBoundingClientRect().top) > window.innerHeight) {
      const trayecto = Math.abs(destino.getBoundingClientRect().top);
      expreso = { destino, origen: window.scrollY, trayecto, hacia: anterior.dataset.hacia, lampara: Number(destino.dataset.nivel), desde: cotaActual };
    }
    destino.scrollIntoView({ behavior: movimientoReducido ? 'auto' : 'smooth', block: 'start' });
  });
});

// Cualquier gesto del lector cancela el expreso y devuelve el control al scroll normal
['wheel', 'touchstart', 'keydown'].forEach((tipo) => {
  window.addEventListener(tipo, () => { expreso = null; }, { passive: true });
});
window.addEventListener('scrollend', () => { expreso = null; pedirActualizar(); });

window.addEventListener('scroll', pedirActualizar, { passive: true });
window.addEventListener('resize', pedirActualizar);
window.addEventListener('load', pedirActualizar);
actualizar();
