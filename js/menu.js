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

/* ---------- image toggle ---------- 
let imagesOn = localStorage.getItem(imagesKey) === 'on';
applyImageToggle();


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

*/
/* always start dark */

themeBtn.addEventListener('click', toggleTheme);
document.documentElement.dataset.theme = 'dark';
localStorage.setItem('theme', 'dark');
themeBtn.textContent = '| LIGHT MODE |';   // because we're already **in** dark mode

function toggleTheme() {
  const isDark = document.documentElement.dataset.theme === 'dark';
  const next   = isDark ? '' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('theme', next);
  themeBtn.textContent = isDark ? '| DARK MODE |' : '| LIGHT MODE |';
}




/* ---------- render ---------- */
function renderItem(it) {
  let price = `<strong>$${it.price}</strong>`;
  if (it.halfDozen && it.dozen) {
    price = `<span class="price-dual">½ Dozen $${it.halfDozen} / Dozen $${it.dozen}</span>`;
  }
  return `
    <article class="card" data-category="${it.category}">
      ${it.image ? `<img src="${it.image}" alt="${it.name}" loading="lazy" />` : ''}
      ${it.subcategory ? `<h3 class="subcategory">${it.subcategory}</h3>` : ''}
      <h2>${it.name}</h2>
      ${it.subtitle ? `<p class="subtitle">${it.subtitle}</p>` : ''}
      <p>${it.description}</p>
      ${price}
    </article>`;
}

function renderGravy(g) {
  // ALWAYS render the group card
  return `
    <article class="card" data-category="Gravies & Toppings">
      <h2>${g.name}</h2>
      <p>${Array.isArray(g.options) ? g.options.join(' / ') : '—'}</p>
      <strong>$${g.price}</strong>
    </article>`;
}


function renderMenu(data) {
  const grouped = groupBy(data, 'category');
  let html = '';
  Object.entries(grouped).forEach(([cat, items]) => {
    html += `<div class="category-block">
               <h2 class="category sticky">
                 ${cat}
                 ${cat === 'Little Hunter' ? '<br><small>Kids Meals come with a choice of soft drink or juice</small>' : ''}
               </h2>`;

    items.forEach(it => {
      html += (it.type === 'group') ? renderGravy(it) : renderItem(it);
    });

    html += `</div>`;
  });
  menuSection.innerHTML = html;
}


fetch('data/menu.json')
  .then(r => r.json())
  .then(data => {
    const filterBtns = document.querySelectorAll('#filters [data-filter]');
    let menuData = data;

    // initial render
    renderMenu(menuData);

    // attach listeners only after DOM
    filterBtns.forEach(btn =>
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const tag = btn.dataset.filter;
        const list =
          tag === 'all'
            ? menuData
            : menuData.filter(d => d.tags && d.tags.some(t => String(t).toLowerCase().includes('vegetarian')));
        renderMenu(list);
      })
    );
  });


yearSpan.textContent = new Date().getFullYear();