const track = document.querySelector('.track');
const speed = 40; // px per second
const gap = 4;    // must match the CSS gap

// Duplicate buttons until the track is at least 2x the container width
const original = [...track.children];
const container = track.parentElement;
while (track.scrollWidth < container.offsetWidth * 2) {
  original.forEach(el => track.appendChild(el.cloneNode(true)));
}

// Width of one full set of originals (the loop length)
const loopWidth = original.reduce((w, el) => w + el.offsetWidth + gap, 0);

let offset = 0;
let last = performance.now();

function tick(now) {
  const dt = (now - last) / 1000;
  last = now;

  offset = (offset + speed * dt) % loopWidth;   // the modulo wrap
  track.style.transform = `translateX(${-offset}px)`;

  requestAnimationFrame(tick);
}

// Start once images have loaded so the widths are correct
window.addEventListener('load', () => requestAnimationFrame(tick));
