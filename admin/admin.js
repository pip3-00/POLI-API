/**
 * ADMIN PANEL - Politécnico Ann y Ted Kheel
 * Panel de administración del CMS
 */

// Usar variable global definida en config.js
const API_URL = window.API_URL || 'https://tu-servidor-api-production.com';
import { loadContent } from './services/content.js';

console.log('📡 API URL:', API_URL);
console.log('🔥 admin.js EJECUTADO');

document.addEventListener('DOMContentLoaded', async () => {
  console.log('🔥 DOMContentLoaded');
  await loadAdmin();
});

async function loadAdmin() {
  try {
    console.log('📡 Cargando datos del CMS...');

    const { contenidos, total } = await loadContent({ limit: 50 });

    console.log('📦 Contenidos:', contenidos);

    // Ocultar spinner siempre
    document.getElementById('loadingSpinner').style.display = 'none';

    if (contenidos.length === 0) {
      // Ocultar tabla, mostrar empty state, badge 0
      document.getElementById('tableContainer').style.display = 'none';
      document.getElementById('emptyState').style.display = 'block';
      document.getElementById('contentCount').textContent = '0 contenidos';
    } else {
      // Ocultar empty, mostrar tabla, renderizar filas, badge total
      document.getElementById('emptyState').style.display = 'none';
      document.getElementById('tableContainer').style.display = 'block';
      renderContents(contenidos);
      document.getElementById('contentCount').textContent = `${total} contenidos`;
    }
  } catch (err) {
    console.error('❌ Error cargando admin:', err);
  }
}

function renderContents(contents) {
  const tableBody = document.getElementById('contentsTableBody');
  tableBody.innerHTML = '';

  contents.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.id}</td>
      <td>${item.type}</td>
      <td>${item.page}</td>
      <td>${item.key}</td>
      <td>${item.title}</td>
      <td>${item.is_active ? 'Sí' : 'No'}</td>
      <td class="text-end">—</td>
    `;
    tableBody.appendChild(tr);
  });
}

async function fetchAllContents(limit = 10, offset = 0) {
    const token = localStorage.getItem('admin_token');
    if (!token) {
        console.error('⚠️ No hay token de admin, debes iniciar sesión');
        window.location.href = '../login.html';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/content/admin/all?limit=${limit}&offset=${offset}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (response.status === 401) {
            console.error('❌ Token inválido o expirado');
            localStorage.removeItem('admin_token');
            window.location.href = '../login.html';
            return;
        }

        if (!response.ok) throw new Error(`Error al cargar contenidos: ${response.status}`);

        const data = await response.json();
        renderContentList(data);
    } catch (err) {
        console.error(err);
    }
}

/**
 * Renderiza la lista de contenidos en el contenedor #content-list
 * @param {Object} data - Datos del fetch que contienen contenidos y total
 */
function renderContentList(data) {
    const container = document.getElementById('content-list');
    if (!container) {
        console.error('❌ No se encontró el contenedor #content-list');
        return;
    }

    // Extraer el array de contenidos (soporta tanto 'contenidos' como 'contents')
    const contenidos = data.contenidos ?? data.contents ?? [];
    
    // Limpiar el contenedor
    container.innerHTML = '';

    if (!Array.isArray(contenidos) || contenidos.length === 0) {
        container.innerHTML = '<li class="text-muted p-3">No hay contenidos disponibles</li>';
        return;
    }

    // Renderizar cada contenido como un elemento de lista
    contenidos.forEach(item => {
        const li = document.createElement('li');
        li.className = 'content-item mb-2 p-2 border-bottom';
        li.innerHTML = `
            <strong>${escapeHtml(item.type || 'Sin tipo')}</strong> — 
            <span>${escapeHtml(item.page || 'Sin página')}</span> —
            <em>${escapeHtml(item.title || 'Sin título')}</em>
        `;
        container.appendChild(li);
    });

    console.log(`✅ Renderizados ${contenidos.length} contenidos en #content-list`);
}

/**
 * Función helper para escapar HTML y prevenir XSS
 * @param {string} text - Texto a escapar
 * @returns {string} - Texto escapado
 */
function escapeHtml(text) {
    if (text == null) return '';
    const div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
}

// Ejecutar al cargar el panel
document.addEventListener('DOMContentLoaded', () => {
    fetchAllContents();
});
