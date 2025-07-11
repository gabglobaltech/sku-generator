
function pad(str, len = 3) {
  return str.toString().padStart(len, "0");
}
function designTypeShortener(type) {
  const map = {
    Anime: "AN",
    Birthday: "BD",
    Anniversary: "AV",
    Retirement: "RT",
    Love: "LV",
  };
  return map[type] || type.slice(0, 2).toUpperCase();
}
function designNameShortener(name) {
  return name
    .split(" ")
    .map(w => w[0])
    .join("")
    .toUpperCase();
}
function getBaseKey(series, cat, dType, dName, custom) {
  return `${pad(series)}-${cat}-${designTypeShortener(dType)}-${designNameShortener(dName)}-${custom}`.toUpperCase();
}

function generateSKUs() {
  const series = document.getElementById("series").value || "001";
  const cat = (document.getElementById("category").value || "MUG").toUpperCase();
  const dType = document.getElementById("designType").value || "Anime";
  const dName = document.getElementById("designName").value || "";
  const custom = document.getElementById("custom").value || "";

  const baseKey = getBaseKey(series, cat, dType, dName, custom);
  const stored = JSON.parse(localStorage.getItem("recentSKUs") || "[]");
  const indexes = stored
    .filter(s => s.startsWith(baseKey))
    .map(s => parseInt(s.split("-").pop(), 10))
    .filter(n => !isNaN(n));
  let nextIndex = indexes.length ? Math.max(...indexes) + 1 : 1;

  const newBatch = [];
  while (newBatch.length < 10 && nextIndex <= 999) {
    const sku = `${baseKey}-${pad(nextIndex, 2)}`;
    if (!stored.includes(sku)) newBatch.push(sku);
    nextIndex++;
  }

  const updated = [...newBatch, ...stored].slice(0, 100);
  localStorage.setItem("recentSKUs", JSON.stringify(updated));
  renderSKUs();
}

function renderSKUs() {
  const list = document.getElementById("skuList");
  const stored = JSON.parse(localStorage.getItem("recentSKUs") || "[]");
  list.innerHTML = "";
  stored.forEach(sku => {
    const div = document.createElement("div");
    div.textContent = sku;
    list.appendChild(div);
  });
}

function clearSKUs() {
  localStorage.removeItem("recentSKUs");
  renderSKUs();
}

renderSKUs();
