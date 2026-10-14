const f = document.querySelector('footer');

addEventListener('load', () => {
  // clone once so there's always overflow to scroll into
  const items = [...f.children];
  while (f.scrollWidth < f.clientWidth * 2) {
    f.append(...items.map(el => el.cloneNode(true)));
  }

  (function tick() {
    if (f.matches(':hover')) {
      f.scrollLeft += 1;
      const first = f.firstElementChild;
      const w = first.nextElementSibling.offsetLeft - first.offsetLeft; // width + gap
      if (f.scrollLeft >= w) {
        f.append(first);
        f.scrollLeft -= w;
      }
    }
    requestAnimationFrame(tick);
  })();
});
