// ==============================================================================
// === CONFIGURACIÓN DE LA API ===
// ==============================================================================
const API_URL_BASE = 'http://localhost:8080'; // <-- Ajusta el puerto si es diferente al 8080
const ENDPOINT_USUARIOS = '/api/admin/usuarios'; 

// ==============================================================================
// === VARIABLES GLOBALES ===
// ==============================================================================
let users = [];
let currentEditingUserId = null;
let currentDeletingUserId = null;

// Ayudante para la fecha
document.getElementById('year').textContent = new Date().getFullYear();

// ==============================================================================
// === LÓGICA DE CARGA DE DATOS DESDE EL BACKEND (REEMPLAZO DE localStorage) ===
// ==============================================================================

/**
 * Función principal de inicialización.
 * Carga los usuarios desde la API y luego llama a renderizar.
 */
async function initializeUsers() {
    console.log("Iniciando carga de usuarios desde la API...");
    
    // 1. Cargar usuarios desde el Backend
    await cargarUsuariosDesdeAPI(); 
    
    // 2. Renderizar los usuarios obtenidos
    renderUsers(); 
}

/**
 * Realiza la petición HTTP al nuevo endpoint de Spring Boot.
 */
async function cargarUsuariosDesdeAPI() {
    try {
        const response = await fetch(API_URL_BASE + ENDPOINT_USUARIOS, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // PENDIENTE: AUTENTICACIÓN. SI USAS JWT, DESCOMENTA Y AJUSTA ESTO:
                // 'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
            }
        });

        if (!response.ok) {
            // Maneja errores de servidor (401, 403, 500, etc.)
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        // Asigna el arreglo de usuarios obtenido del backend a la variable global 'users'
        users = data; 

    } catch (error) {
        console.error("Fallo al cargar la lista de usuarios:", error.message);
        // Opcionalmente, puedes mostrar un mensaje de error en la UI
    }
}

// --------------------------------------------------------------------------------
// --- FUNCIONES EXISTENTES MODIFICADAS ---
// --------------------------------------------------------------------------------

// NO ES NECESARIA, EL BACKEND SE ENCARGA DE GUARDAR LOS DATOS
// function saveUsers() {
//     // NO IMPLEMENTADA. Los datos se manejan en el servidor.
// }

// Función original para actualizar contadores
function updateUserCount() {
    // Usamos 'users.length' que ahora se llena con los datos de la API
    document.getElementById('totalUsers').textContent = users.length;
    document.getElementById('totalUsers2').textContent = users.length;
    document.getElementById('countInicio').textContent = Math.min(4, users.length);
    document.getElementById('countUsuarios').textContent = Math.min(10, users.length);
}

// Función original para renderizar usuarios en las tablas
function renderUsers() {
    // Ordenar usuarios por ID (o por el campo de fecha si se agrega al DTO)
    const sortedUsers = [...users].sort((a, b) => (b.id || 0) - (a.id || 0));
    
    // Renderizar en la tabla de Inicio (solo los 4 más recientes)
    const tbodyInicio = document.getElementById('tbodyInicio');
    if (tbodyInicio) {
        tbodyInicio.innerHTML = '';
        const usersForInicio = sortedUsers.slice(0, 4);
        usersForInicio.forEach(user => {
            tbodyInicio.appendChild(createUserRow(user));
        });
    }
    
    // Renderizar en la tabla de Usuarios (todos los usuarios)
    const tbodyUsuarios = document.getElementById('tbodyUsuarios');
    if (tbodyUsuarios) {
        tbodyUsuarios.innerHTML = '';
        sortedUsers.forEach(user => {
            tbodyUsuarios.appendChild(createUserRow(user, 'usuarios'));
        });
    }
    
    updateUserCount();
}

/**
 * Función que crea una fila de usuario usando los campos de UsuarioResponse.java.
 * DTO: id, email, nombre, apellidoPaterno, apellidoMaterno
 */
function createUserRow(user, section = 'inicio') {
    const tr = document.createElement('tr');
    
    // CONCATENACIÓN DE NOMBRE
    const nombreCompleto = `${user.nombre || ''} ${user.apellidoPaterno || ''} ${user.apellidoMaterno || ''}`.trim();
    
    // Obtener iniciales
    const initials = nombreCompleto.split(' ').map(n => n[0]).join('').toUpperCase();
    
    // Determinar color de fondo para el avatar
    const colors = ['var(--accent-3)', 'var(--accent)', 'var(--accent-4)', 'var(--muted)', '#3498db', '#e74c3c', '#2ecc71', '#9b59b6', '#f39c12', '#1abc9c'];
    const colorIndex = (user.id || 0) % colors.length;
    const bgColor = colors[colorIndex];
    
    // DATOS PENDIENTES DE IMPLEMENTACIÓN EN DTO (usamos placeholders)
    const formattedDate = "N/A (Falta Fecha)"; 
    const userType = "Estándar"; 
    
    tr.innerHTML = `
    <td><span class="badge bg-light text-dark">${user.id || 'N/A'}</span></td>
    <td>
        <div class="d-flex align-items-center gap-2">
        <div class="avatar-sm" style="background:${user.photo ? 'transparent' : bgColor}">
            ${user.photo ? 
            `<img src="${user.photo}" alt="${nombreCompleto}">` : 
            `<span>${initials.substring(0, 2)}</span>`
            }
        </div>
        </div>
    </td>
    <td>
        <div style="font-weight:600">${nombreCompleto}</div>
    </td>
    <td>${user.email || 'N/A'}</td>
    <td><span class="badge rounded-pill ${userType === 'Premium' ? 'bg-warning text-dark' : 'bg-light text-dark'}">${userType}</span></td>
    <td>${formattedDate}</td>
    <td class="text-end">
        <button class="btn btn-sm btn-light edit-user" data-id="${user.id}" title="Editar"><i class="bi bi-pencil"></i></button>
        <button class="btn btn-sm btn-light delete-user" data-id="${user.id}" title="Eliminar"><i class="bi bi-trash"></i></button>
    </td>
    `;
    
    return tr;
}

// Formatear fecha (Esta función queda sin uso por ahora al faltar el campo en el DTO)
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// --------------------------------------------------------------------------------
// --- RESTO DE TU CÓDIGO (Navegación, Modales, Gráficos) ---
// --------------------------------------------------------------------------------

// Navigation system (MANTENER SIN CAMBIOS)
const navLinks = document.querySelectorAll('.nav-link');
const contentSections = document.querySelectorAll('.content-section');
const mainTitle = document.getElementById('main-title');
const mainSubtitle = document.getElementById('main-subtitle');
const searchInput = document.getElementById('search-input');

// Titles and placeholders for each section (MANTENER SIN CAMBIOS)
const sectionData = {
    inicio: {
        title: 'Bienvenido, <span class="text-gradient">Administrador</span>',
        subtitle: 'Panel de control',
        placeholder: 'Buscar usuarios...'
    },
    usuarios: {
        title: 'Bienvenido, <span class="text-gradient">Administrador</span>',
        subtitle: 'Gestión de usuarios',
        placeholder: 'Buscar usuarios...'
    },
    reportes: {
        title: 'Bienvenido, <span class="text-gradient">Administrador</span>',
        subtitle: 'Reportes y análisis',
        placeholder: 'Buscar reportes...'
    }
};

// Initialize navigation (MANTENER SIN CAMBIOS)
navLinks.forEach(link => {
    link.addEventListener('click', function() {
        const targetSection = this.getAttribute('data-section');
        
        // Update active states
        navLinks.forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');
        
        // Show/hide sections
        contentSections.forEach(section => {
            section.classList.remove('active');
            if (section.id === targetSection) {
                section.classList.add('active');
            }
        });
        
        // Update titles and placeholder
        if (sectionData[targetSection]) {
            mainTitle.innerHTML = sectionData[targetSection].title;
            mainSubtitle.textContent = sectionData[targetSection].subtitle;
            searchInput.placeholder = sectionData[targetSection].placeholder;
        }

        // Initialize charts if showing reports section
        if (targetSection === 'reportes') {
            initializeCharts();
        }
    });
});

// Export table to CSV functions (MANTENER SIN CAMBIOS)
document.getElementById('exportBtnInicio').addEventListener('click', function(){
    exportTableToCSV('inicio');
});

document.getElementById('exportBtnUsuarios').addEventListener('click', function(){
    exportTableToCSV('usuarios');
});

function exportTableToCSV(section) {
    const table = document.querySelector(`#${section} table`);
    const rows = Array.from(table.querySelectorAll('tbody tr'));
    const csv = [];
    
    // Get headers
    const headers = Array.from(table.querySelectorAll('thead th'));
    const headerText = headers.map(th => th.textContent.trim()).join(',');
    csv.push(headerText);
    
    // Get rows data
    rows.forEach(r => {
        const cols = Array.from(r.querySelectorAll('td'));
        const rowData = cols.map(td => {
            // Skip photo column
            if (td.querySelector('.avatar-sm')) {
                return '';
            }
            return td.innerText.trim();
        });
        csv.push(rowData.join(','));
    });
    
    const blob = new Blob([csv.join('\n')], {type: 'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); 
    a.href = url; 
    a.download = `usuarios_${section}.csv`; 
    a.click(); 
    URL.revokeObjectURL(url);
}

// Add hover effects to cards (MANTENER SIN CAMBIOS)
document.querySelectorAll('.card-stat, .chart-card, .table-card, .card-report').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Preview de imagen al seleccionar archivo (MANTENER SIN CAMBIOS)
document.getElementById('userPhoto').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            document.getElementById('addPhotoPreview').src = event.target.result;
            document.getElementById('addPhotoPreview').style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('editUserPhoto').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            document.getElementById('editPhotoPreview').src = event.target.result;
            document.getElementById('editPhotoPreview').style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

// Agregar nuevo usuario (MANTENER SIN CAMBIOS, PERO DEBERÍA LLAMAR A LA API EN EL FUTURO)
document.getElementById('saveUserBtn').addEventListener('click', function() {
    // ESTA LÓGICA DEBE SER REEMPLAZADA POR UNA LLAMADA A LA API POST /api/admin/users/add
    alert('ADVERTENCIA: Esta función aún usa lógica local y debe ser actualizada para usar la API de Spring Boot.');

    // ... TU LÓGICA EXISTENTE PARA AÑADIR USUARIO ...
});

function addUserToSystem(id, name, email, type, registrationDate, photoData) {
    // ESTA LÓGICA DEBE SER REEMPLAZADA POR UNA LLAMADA A LA API POST /api/admin/users/add
    alert('ADVERTENCIA: Esta función aún usa lógica local y debe ser actualizada para usar la API de Spring Boot.');

    // ... TU LÓGICA EXISTENTE PARA AÑADIR USUARIO ...
    // Después de guardar en la API, debes llamar a initializeUsers() para recargar la tabla.
}

// Editar usuario (MANTENER SIN CAMBIOS, PERO DEBERÍA LLAMAR A LA API EN EL FUTURO)
document.addEventListener('click', function(e) {
    // ... TU LÓGICA EXISTENTE PARA ABRIR MODAL DE EDICIÓN ...
});

document.getElementById('updateUserBtn').addEventListener('click', function() {
    // ESTA LÓGICA DEBE SER REEMPLAZADA POR UNA LLAMADA A LA API PUT /api/admin/users/{id}
    alert('ADVERTENCIA: Esta función aún usa lógica local y debe ser actualizada para usar la API de Spring Boot.');

    // ... TU LÓGICA EXISTENTE PARA ACTUALIZAR USUARIO ...
});

function updateUserInSystem(userIndex, name, email, type, registrationDate) {
    // ESTA LÓGICA DEBE SER REEMPLAZADA POR UNA LLAMADA A LA API PUT /api/admin/users/{id}
    alert('ADVERTENCIA: Esta función aún usa lógica local y debe ser actualizada para usar la API de Spring Boot.');
    
    // ... TU LÓGICA EXISTENTE PARA ACTUALIZAR USUARIO ...
    // Después de actualizar en la API, debes llamar a initializeUsers() para recargar la tabla.
}

// Eliminar usuario (MANTENER SIN CAMBIOS, PERO DEBERÍA LLAMAR A LA API EN EL FUTURO)
document.addEventListener('click', function(e) {
    // ... TU LÓGICA EXISTENTE PARA ABRIR MODAL DE ELIMINACIÓN ...
});

document.getElementById('confirmDeleteBtn').addEventListener('click', function() {
    // ESTA LÓGICA DEBE SER REEMPLAZADA POR UNA LLAMADA A LA API DELETE /api/admin/users/{id}
    alert('ADVERTENCIA: Esta función aún usa lógica local y debe ser actualizada para usar la API de Spring Boot.');

    // ... TU LÓGICA EXISTENTE PARA ELIMINAR USUARIO ...
    // Después de eliminar en la API, debes llamar a initializeUsers() para recargar la tabla.
});

// Inicialización de gráficos (MANTENER SIN CAMBIOS)
const userGrowthCtxInicio = document.getElementById('userGrowthChartInicio').getContext('2d');
// ... CÓDIGO DEL GRÁFICO ...

let chartsInitialized = false;

function initializeCharts() {
    if (chartsInitialized) return;
    // ... CÓDIGO DE INICIALIZACIÓN DE GRÁFICOS ...
    chartsInitialized = true;
}

// Inicializar la aplicación (MANTENER SIN CAMBIOS)
document.addEventListener('DOMContentLoaded', function() {
    initializeUsers(); // <-- Aquí llamamos a la nueva función de carga de la API
    
    // Establecer fecha actual como valor por defecto en el formulario de agregar usuario
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('userRegistrationDate').value = today;
});