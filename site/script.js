const f = document.querySelector("footer");

const RAW =
  "https://raw.githubusercontent.com/chris-pikul/electronic-symbols/main";
let manifest;

const todayKey = () => new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD, local time

// same date, same index
function dayIndex(length) {
  let h = 0;
  for (const ch of todayKey()) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h % length;
}

async function symbolOfTheDay(format = "SVG") {
  manifest ??= await (await fetch(`${RAW}/manifest.json`)).json();
  const s = manifest[dayIndex(manifest.length)];
  const base = s.filename.replace(/\.(svg|png|jpg)$/i, "");
  return { ...s, url: `${RAW}/${format}/${base}.${format.toLowerCase()}` };
}

// updates every copy, since the ticker clones the figure
function renderSymbol(symbol) {
  for (const fig of f.querySelectorAll(".symbol-item")) {
    const img = fig.querySelector("img");
    img.setAttribute("src", symbol.url);
    img.alt = symbol.name;
    fig.querySelector("figcaption").textContent = symbol.name;
  }
}

async function showSymbol() {
  try {
    const today = todayKey();
    let saved = JSON.parse(localStorage.getItem("symbolOfTheDay") ?? "null");

    if (saved?.date !== today) {
      saved = { date: today, symbol: await symbolOfTheDay() };
      localStorage.setItem("symbolOfTheDay", JSON.stringify(saved));
    }

    renderSymbol(saved.symbol);
  } catch (err) {
    console.error("symbol load failed:", err);
  }
}

function startTicker() {
  let paused = false;
  f.addEventListener("click", (e) => {
    if (e.target.closest("a")) return;
    paused = !paused;
  });

  const items = [...f.children];
  while (f.scrollWidth < f.clientWidth * 2) {
    f.append(...items.map((el) => el.cloneNode(true)));
  }

  (function tick() {
    if (f.matches(":hover") && !paused) {
      f.scrollLeft += 1;
      const first = f.firstElementChild;
      const w = first.nextElementSibling.offsetLeft - first.offsetLeft;
      if (f.scrollLeft >= w) {
        f.append(first);
        f.scrollLeft -= w;
      }
    }
    requestAnimationFrame(tick);
  })();
}

if (document.readyState === "complete") startTicker();
else addEventListener("load", startTicker);

showSymbol();
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) showSymbol();
});
