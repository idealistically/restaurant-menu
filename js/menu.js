/* ---------- menu.js  (complete replacement) ---------- */
const menuSection = document.getElementById('menu');
const graviesSection = document.getElementById('gravies-toppings');
const themeBtn = document.getElementById('themeToggle');
const yearSpan = document.getElementById('year');
const imagesKey = 'images';

/* ---------- helpers ---------- */
function $(sel, ctx = document) { return ctx.querySelector(sel); }

function groupBy(arr, key) {
  return arr.reduce((acc, cur) => {
    (acc[cur[key]] = acc[cur[key]] || []).push(cur);
    return acc;
  }, {});
}

/* ---------- image toggle ---------- */
let imagesOn = localStorage.getItem(imagesKey) === 'on';
applyImageToggle();

themeBtn.addEventListener('click', toggleTheme);
$('#imgToggle').addEventListener('click', toggleImages);

function toggleImages() {
  imagesOn = !imagesOn;
  applyImageToggle();
  localStorage.setItem(imagesKey, imagesOn ? 'on' : 'off');
}

function applyImageToggle() {
  document.body.classList.toggle('images-off', !imagesOn);
  $('#imgToggle').textContent = imagesOn ? '📷 ON' : '📷 OFF';
}

function toggleTheme() {
  const dark = document.documentElement.dataset.theme === 'dark';
  const next = dark ? '' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('theme', next);
}

/* ---------- render ---------- */
function renderItem(it) {
  let price = `<strong>$${it.price}</strong>`;
  if (it.halfDozen && it.dozen) {
    price = `<span class="price-dual">½ Dozen $${it.halfDozen} / Dozen $${it.dozen}</span>`;
  }
  return `
    <article class="card">
      ${it.image ? `<img src="${it.image}" alt="${it.name}" loading="lazy" />` : ''}
      ${it.subcategory ? `<h3 class="subcategory">${it.subcategory}</h3>` : ''}
      <h2>${it.name}</h2>
      ${it.subtitle ? `<p class="subtitle">${it.subtitle}</p>` : ''}
      <p>${it.description}</p>
      ${price}
    </article>`;
}

function renderGravy(g) {
  if (g.type === 'group') {
    return `
      <article class="card">
        <h2>${g.name}</h2>
        <p>${g.options.join(' / ')}</p>
        <strong>$${g.price}</strong>
      </article>`;
  }
  return renderItem(g);
}

function renderMenu(data) {
  const grouped = groupBy(data, 'category');
  let html = '';

  for (const [cat, items] of Object.entries(grouped)) {
    html += `<h2 class="category">${cat}</h2>`;
    items.forEach(it => (html += renderItem(it)));

    // immediately after Schnitzels, insert Gravies & Toppings once
    if (cat === 'Schnitzels' && grouped['Gravies & Toppings']) {
      html += `<h2 class="category">Gravies & Toppings</h2>`;
      grouped['Gravies & Toppings'].forEach(g => (html += renderGravy(g)));
    }
  }
  menuSection.innerHTML = html;
}

/* ---------- fetch & init ---------- */
fetch('data/menu.json')
  .then(r => r.json())
  .then(renderMenu);

yearSpan.textContent = new Date().getFullYear();