const f = document.querySelector("footer");
const sym_image = document.querySelector("#symbol");

const RAW = "https://raw.githubusercontent.com/chris-pikul/electronic-symbols/main";
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

async function showSymbol() {
  try {
    const today = todayKey();
    let saved = JSON.parse(localStorage.getItem("symbolOfTheDay") ?? "null");

    if (saved?.date !== today) {
      saved = { date: today, symbol: await symbolOfTheDay() };
      localStorage.setItem("symbolOfTheDay", JSON.stringify(saved));
    }

    sym_image.setAttribute("src", saved.symbol.url);
    sym_image.alt = saved.symbol.name;
  } catch (err) {
    console.error("symbol load failed:", err);
  }
}

function startTicker() {
  const items = [...f.children];
  while (f.scrollWidth < f.clientWidth * 2) {
    f.append(...items.map((el) => el.cloneNode(true)));
  }

  (function tick() {
    if (f.matches(":hover")) {
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
