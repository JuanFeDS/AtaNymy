function azar(semilla){ let s = semilla; return () => (s = (s * 16807) % 2147483647) / 2147483647; }
document.querySelectorAll('[data-rasgado]').forEach((el, n) => {
  const r = azar(97 + n * 31 + (+el.dataset.rasgado || 0)), pasos = 14, j = +(el.dataset.aspereza || 1.1), pts = [];
  const p = (x, y) => pts.push(`${(x + (r() - .5) * j).toFixed(2)}% ${(y + (r() - .5) * j * 1.4).toFixed(2)}%`);
  for (let i = 0; i < pasos; i++) p(100 * i / pasos, 0);
  for (let i = 0; i < pasos; i++) p(100, 100 * i / pasos);
  for (let i = 0; i < pasos; i++) p(100 - 100 * i / pasos, 100);
  for (let i = 0; i < pasos; i++) p(0, 100 - 100 * i / pasos);
  el.style.clipPath = `polygon(${pts.join(',')})`;
});
