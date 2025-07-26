// fetch JSON, render cards, filter & dark-mode toggle
const menuEl = document.getElementById('menu');
const filterBtns = document.querySelectorAll('[data-filter]');
const themeBtn = document.getElementById('themeToggle');
const yearSpan = document.getElementById('year');

let menuData = [];

async function loadMenu() {
  const res = await fetch('data/menu.json');
  menuData = await res.json();
  render(menuData);
}

function render(list) {
  menuEl.innerHTML = list.map(card).join('');
}

const card = ({name, price, image, description}) => `
  <article class="card">
    <img src="${image}" alt="${name}" width="400" height="300" loading="lazy" />
    <h2>${name}</h2>
    <p>${description}</p>
    <strong>$${price.toFixed(2)}</strong>
  </article>
`;

// filtering
filterBtns.forEach(btn =>
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.toggle('active', b === btn));
    const tag = btn.dataset.filter;
    const filtered =
      tag === 'all' ? menuData : menuData.filter(item => item.tags.includes(tag));
    render(filtered);
  })
);

// dark-mode toggle
const stored = localStorage.getItem('theme');
if (stored) document.documentElement.dataset.theme = stored;
themeBtn.addEventListener('click', () => {
  const dark = document.documentElement.dataset.theme === 'dark';
  const next = dark ? '' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('theme', next);
});
/* ---------- images ON / OFF ---------- */
const imgBtn = document.getElementById('imgToggle');
const imagesKey = 'images';

// default = OFF
let imagesOn = localStorage.getItem(imagesKey) !== 'on';
toggleImages();

imgBtn.addEventListener('click', () => {
  imagesOn = !imagesOn;
  toggleImages();
});

function toggleImages() {
  document.body.classList.toggle('images-off', !imagesOn);
  imgBtn.textContent = imagesOn ? '📷 ON' : '📷 OFF';
  localStorage.setItem(imagesKey, imagesOn ? 'on' : 'off');
}

// footer year
yearSpan.textContent = new Date().getFullYear();

loadMenu();
