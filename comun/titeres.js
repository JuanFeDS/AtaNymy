// Los teatrinos fuera de una escena fija no tienen --s propio: entran al verse y salen al dejar de verse.
document.querySelectorAll('[data-teatrino]').forEach((teatrino) => {
  teatrino.style.setProperty('--s', '0');
  new IntersectionObserver(([entrada]) => {
    teatrino.style.setProperty('--s', entrada.isIntersecting ? '0.5' : '0');
  }, { threshold: 0.25 }).observe(teatrino.parentElement);
});
