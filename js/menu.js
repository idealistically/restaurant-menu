// Fetch JSON, build cards, wire filters
const menuSection = document.getElementById('menu');

async function loadMenu() {
  const res = await fetch('data/menu.json');
  const items = await res.json();
  render(items);
}

function render(items) {
  menuSection.innerHTML = items.map(card).join('');
}

const card = ({name, price, image, description}) => `
  <article class="card">
    <img src="${image}" alt="${name}" loading="lazy" width="400" height="300">
    <h2>${name}</h2>
    <p>${description}</p>
    <strong>$${price.toFixed(2)}</strong>
  </article>
`;

loadMenu();
