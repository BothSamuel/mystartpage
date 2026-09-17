const defaultSites = [
  { id: '1', name: 'Twitter', url: 'https://twitter.com', icon: 'IMG/Twitter.PNG' },
  { id: '2', name: 'Google', url: 'https://google.com', icon: 'IMG/Google-64.png' },
  { id: '3', name: 'YouTube', url: 'https://youtube.com', icon: 'IMG/Youtube_Dock_ICON_by_AkirakunXix.png' },
  { id: '4', name: 'Facebook', url: 'https://facebook.com', icon: 'IMG/Facebook.PNG' },
  { id: '5', name: 'DeviantArt', url: 'https://deviantart.com', icon: 'IMG/Deviant.PNG' },
  { id: '6', name: 'Wikipedia', url: 'https://wikipedia.org', icon: 'IMG/600px-Wikipedia-logo.svg.png' },
  { id: '7', name: 'MySpace', url: 'https://myspace.com', icon: 'IMG/mySpace.PNG' },
  { id: '8', name: 'Abduzeedo', url: 'https://abduzeedo.com', icon: 'IMG/abdu.PNG' }
];

const modal = document.getElementById('customModal');
const modalTitle = document.getElementById('modalTitle');
const openModalBtn = document.getElementById('openModalBtn');
const cancelBtn = document.getElementById('cancelBtn');
const saveBtn = document.getElementById('saveBtn');
const iconGrid = document.getElementById('iconGrid');

let editingSiteId = null;

document.addEventListener('DOMContentLoaded', loadSites);
document.addEventListener('click', closeAllMenus);

openModalBtn.addEventListener('click', () => {
  editingSiteId = null;
  modalTitle.textContent = 'Añadir nuevo acceso directo';
  clearInputs();
  modal.classList.add('active');
});

cancelBtn.addEventListener('click', closeModal);

saveBtn.addEventListener('click', () => {
  const url = document.getElementById('siteUrl').value.trim();
  const name = document.getElementById('siteName').value.trim();
  let icon = document.getElementById('siteIcon').value.trim();

  if (!url || !name) {
    alert('Por favor ingresa al menos el nombre y la URL');
    return;
  }

  // Si no se proporciona una imagen personalizada, se obtiene el favicon oficial de la web
  if (!icon) {
    try {
      const domain = new URL(url).hostname;
      icon = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    } catch (e) {
      // En caso de que la URL no empiece por http/https o tenga formato no válido
      icon = `https://www.google.com/s2/favicons?domain=${url}&sz=128`;
    }
  }

  let sites = getStoredSites();

  if (editingSiteId) {
    sites = sites.map(s => s.id === editingSiteId ? { ...s, name, url, icon } : s);
  } else {
    const newSite = { id: Date.now().toString(), name, url, icon };
    sites.push(newSite);
  }

  localStorage.setItem('startpage_sites', JSON.stringify(sites));
  renderGrid();
  closeModal();
});

function getStoredSites() {
  const stored = localStorage.getItem('startpage_sites');
  if (!stored) {
    localStorage.setItem('startpage_sites', JSON.stringify(defaultSites));
    return defaultSites;
  }
  return JSON.parse(stored);
}

function loadSites() {
  renderGrid();
}

function renderGrid() {
  const wrappers = iconGrid.querySelectorAll('.icon-card-wrapper');
  wrappers.forEach(w => w.remove());

  const sites = getStoredSites();
  sites.forEach(site => {
    const wrapper = document.createElement('div');
    wrapper.className = 'icon-card-wrapper';
    wrapper.innerHTML = `
      <a href="${site.url}" class="icon-card">
        <img src="${site.icon}" alt="${site.name}" title="${site.name}">
      </a>
      <button class="more-options-btn" title="Opciones">•••</button>
      <div class="card-context-menu">
        <button class="edit-opt">Editar</button>
        <button class="delete-opt">Eliminar</button>
      </div>
    `;

    const optionsBtn = wrapper.querySelector('.more-options-btn');
    const menu = wrapper.querySelector('.card-context-menu');
    const editBtn = wrapper.querySelector('.edit-opt');
    const deleteBtn = wrapper.querySelector('.delete-opt');

    optionsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAllMenus();
      menu.classList.toggle('active');
    });

    editBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAllMenus();
      openEditModal(site);
    });

    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteSite(site.id);
    });

    iconGrid.insertBefore(wrapper, openModalBtn);
  });
}

function openEditModal(site) {
  editingSiteId = site.id;
  modalTitle.textContent = 'Editar acceso directo';
  document.getElementById('siteName').value = site.name;
  document.getElementById('siteUrl').value = site.url;
  document.getElementById('siteIcon').value = site.icon;
  modal.classList.add('active');
}

function deleteSite(id) {
  if (confirm('¿Deseas eliminar este acceso directo?')) {
    let sites = getStoredSites().filter(s => s.id !== id);
    localStorage.setItem('startpage_sites', JSON.stringify(sites));
    renderGrid();
  }
}

function closeAllMenus() {
  document.querySelectorAll('.card-context-menu').forEach(m => m.classList.remove('active'));
}

function closeModal() {
  modal.classList.remove('active');
  clearInputs();
}

function clearInputs() {
  document.getElementById('siteName').value = '';
  document.getElementById('siteUrl').value = '';
  document.getElementById('siteIcon').value = '';
}