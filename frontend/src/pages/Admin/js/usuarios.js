// ==========================================
// VARIABLES GLOBALES
// ==========================================

// 1. IMPORTANTE: No usamos 'let' porque 'users' ya existe en principal.js.
// Simplemente la reiniciamos para llenarla con datos reales.
users = []; 

let currentPageUsuarios = 1;
const usersPerPageUsuarios = 10;
let searchUsersInput = '';
let subscriptionFilterValue = 'all';

// ==========================================
// INICIALIZACIÓN
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    initializeUsuarios();
});

// Esta función ahora es ASÍNCRONA para esperar al Backend
async function initializeUsuarios(searchTerm = '') {
    try {
        // 1. Construimos la URL con el parámetro de búsqueda si existe
        let url = 'http://localhost:8080/api/admin/users';
        if (searchTerm) {
            url += `?search=${encodeURIComponent(searchTerm)}`;
        }

        // 2. Petición al servidor
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }

        // 3. Guardamos los datos reales en la variable global
        users = await response.json();
        
        // Limpiamos el input de búsqueda LOCAL para que renderUsers no filtre doble
        // (El filtrado ya lo hizo Java)
        searchUsersInput = ''; 
        currentPageUsuarios = 1;

        // 4. Renderizamos la tabla
        renderUsers();
        
        // 5. Funciones auxiliares (si existen en tu proyecto)
        if (typeof updateUserCount === 'function') updateUserCount();
        if (typeof updateNotificationsDropdown === 'function') updateNotificationsDropdown();
        
        // 6. Configurar listeners (solo la primera vez)
        if (searchTerm === '') {
            setupEventListeners();
        }

    } catch (error) {
        console.error("Error cargando usuarios:", error);
        const tbody = document.getElementById('tbodyUsuarios');
        if(tbody) tbody.innerHTML = '<tr><td colspan="6" class="text-center text-danger">Error de conexión con el servidor</td></tr>';
    }
}

// ==========================================
// EVENT LISTENERS
// ==========================================

function setupEventListeners() {
    // 1. BUSCADOR: Conectado al Backend con "debounce" (espera a que termines de escribir)
    const searchInput = document.getElementById('searchUsersInput');
    if(searchInput) {
        let timeoutId;
        searchInput.addEventListener('input', function(e) {
            clearTimeout(timeoutId);
            const texto = e.target.value;
            
            // Espera 300ms antes de llamar al servidor
            timeoutId = setTimeout(() => {
                initializeUsuarios(texto);
            }, 300);
        });
    }

    // 2. FILTRO SUSCRIPCIÓN: Local (Filtra sobre los resultados ya traídos)
    const filterInput = document.getElementById('subscriptionFilter');
    if(filterInput) {
        filterInput.addEventListener('change', function(e) {
            subscriptionFilterValue = e.target.value;
            currentPageUsuarios = 1;
            renderUsers();
        });
    }
    
    // 3. BOTONES DE MODALES
    const saveBtn = document.getElementById('saveUserBtn');
    if(saveBtn) saveBtn.addEventListener('click', saveUser);

    const updateBtn = document.getElementById('updateUserBtn');
    if(updateBtn) updateBtn.addEventListener('click', updateUser);

    const deleteBtn = document.getElementById('confirmDeleteBtn');
    if(deleteBtn) deleteBtn.addEventListener('click', confirmDeleteUser);
    
    // 4. VISTA PREVIA DE FOTO (Agregar)
    const photoInput = document.getElementById('userPhoto');
    if(photoInput) {
        photoInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const preview = document.getElementById('addPhotoPreview');
                    if(preview) {
                        preview.src = e.target.result;
                        preview.style.display = 'block';
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // 5. VISTA PREVIA DE FOTO (Editar)
    const editPhotoInput = document.getElementById('editUserPhoto');
    if(editPhotoInput) {
        editPhotoInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const preview = document.getElementById('editPhotoPreview');
                    if(preview) {
                        preview.src = e.target.result;
                        preview.style.display = 'block';
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // 6. ACCIONES EN TABLA (Delegación)
    document.addEventListener('click', function(e) {
        if (e.target.closest('.edit-user')) {
            const userId = parseInt(e.target.closest('.edit-user').getAttribute('data-id'));
            // Asegúrate de que la función editUser esté definida (en este archivo o principal.js)
            if (typeof editUser === 'function') editUser(userId);
        }
        
        if (e.target.closest('.delete-user')) {
            const userId = parseInt(e.target.closest('.delete-user').getAttribute('data-id'));
            // Asegúrate de que la función deleteUser esté definida
            if (typeof deleteUser === 'function') deleteUser(userId);
        }
    });

    // 7. EXPORTAR
    const exportBtn = document.getElementById('exportBtnUsuarios');
    if(exportBtn) {
        exportBtn.addEventListener('click', function() {
            exportUsersToCSV('usuarios_completo.csv');
        });
    }
}

// ==========================================
// LÓGICA DE RENDERIZADO
// ==========================================

function renderUsers() {
    let filteredUsers = [...users];
    
    // Nota: El filtro de texto principal ya lo hace el Backend en initializeUsuarios.
    // Aquí solo aplicamos filtros locales adicionales si es necesario (como el searchUsersInput si quisieras filtrar localmente)
    if (searchUsersInput) {
        filteredUsers = filteredUsers.filter(user => 
            user.name.toLowerCase().includes(searchUsersInput) || 
            user.email.toLowerCase().includes(searchUsersInput)
        );
    }
    
    // Filtro por tipo de suscripción (Local)
    if (subscriptionFilterValue !== 'all') {
        filteredUsers = filteredUsers.filter(user => user.subscriptionType === subscriptionFilterValue);
    }
    
    // Ordenar por fecha (Nota: Si el backend envía fechas fijas, esto no cambiará el orden)
    const sortedUsers = filteredUsers.sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate));
    
    // Paginación
    const tbodyUsuarios = document.getElementById('tbodyUsuarios');
    if(tbodyUsuarios) {
        tbodyUsuarios.innerHTML = '';
        
        const startIndexUsuarios = (currentPageUsuarios - 1) * usersPerPageUsuarios;
        const usersForUsuarios = sortedUsers.slice(startIndexUsuarios, startIndexUsuarios + usersPerPageUsuarios);
        
        if (usersForUsuarios.length === 0) {
            tbodyUsuarios.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No se encontraron usuarios</td></tr>';
        } else {
            usersForUsuarios.forEach(user => {
                tbodyUsuarios.appendChild(createUserRow(user, 'usuarios'));
            });
        }
    }
    
    updateUsuariosPagination(sortedUsers.length);
    if (typeof updateUserCount === 'function') updateUserCount();
}

function createUserRow(user, section = 'usuarios') {
    const tr = document.createElement('tr');
    
    const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : '?';
    const colors = ['var(--accent)', 'var(--accent-3)', 'var(--accent-4)', 'var(--muted)', '#3498db', '#e74c3c', '#2ecc71', '#9b59b6', '#f39c12', '#1abc9c'];
    const colorIndex = (user.id || 0) % colors.length;
    const bgColor = colors[colorIndex];
    
    const subscriptionBadgeClass = {
        'Sin suscripción': 'bg-light text-dark',
        'Mensual': 'bg-success text-white',
        'Anual': 'bg-warning text-dark',
        'De por vida': 'bg-info text-white'
    };
    
    // Si el tipo de suscripción no coincide con los anteriores, usa un default
    const badgeClass = subscriptionBadgeClass[user.subscriptionType] || 'bg-secondary text-white';
    
    tr.innerHTML = `
        <td><span class="badge bg-light text-dark">${user.id}</span></td>
        <td>
            <div class="d-flex align-items-center gap-2">
                <div class="avatar-sm" style="background:${user.photo ? 'transparent' : bgColor}">
                    ${user.photo ? 
                    `<img src="${user.photo}" alt="${user.name}">` : 
                    `<span>${initials}</span>`
                    }
                </div>
            </div>
        </td>
        <td>
            <div style="font-weight:600">${user.name}</div>
            <small class="text-muted">${user.email}</small>
        </td>
        <td>${user.email}</td>
        <td><span class="badge rounded-pill ${badgeClass}">${user.subscriptionType || 'Desconocido'}</span></td>
        <td class="text-center">
            <div class="table-actions">
                <button class="table-action-btn edit edit-user" data-id="${user.id}" title="Editar">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="table-action-btn delete delete-user" data-id="${user.id}" title="Eliminar">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </td>
    `;
    
    return tr;
}

// ==========================================
// PAGINACIÓN Y EXTRAS
// ==========================================

function updateUsuariosPagination(totalUsers) {
    const totalPages = Math.ceil(totalUsers / usersPerPageUsuarios);
    const paginationContainer = document.getElementById('paginationUsuarios');
    const countElement = document.getElementById('countUsuarios');
    
    if (countElement) {
        if (totalUsers === 0) {
            countElement.textContent = '0-0';
        } else {
            const startIndex = (currentPageUsuarios - 1) * usersPerPageUsuarios + 1;
            const endIndex = Math.min(startIndex + usersPerPageUsuarios - 1, totalUsers);
            countElement.textContent = `${startIndex}-${endIndex}`;
        }
    }
    
    if (paginationContainer) {
        let paginationHTML = '';
        
        // Botón Anterior
        paginationHTML += `
            <li class="page-item ${currentPageUsuarios === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="changePageUsuarios(${currentPageUsuarios - 1})">Anterior</a>
            </li>
        `;
        
        // Números de página
        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `
                <li class="page-item ${currentPageUsuarios === i ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="changePageUsuarios(${i})">${i}</a>
                </li>
            `;
        }
        
        // Botón Siguiente
        paginationHTML += `
            <li class="page-item ${currentPageUsuarios === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="changePageUsuarios(${currentPageUsuarios + 1})">Siguiente</a>
            </li>
        `;
        
        paginationContainer.innerHTML = paginationHTML;
    }
}

function changePageUsuarios(page) {
    const totalPages = Math.ceil(users.length / usersPerPageUsuarios);
    if (page >= 1 && page <= totalPages) {
        currentPageUsuarios = page;
        renderUsers();
    }
}

function updateNotificationsDropdown() {
    const badge = document.getElementById('notificationBadge');
    const dropdownContent = document.getElementById('activitiesDropdownContent');
    
    if (!badge || !dropdownContent) return;

    // Asegúrate de que la variable 'activities' exista (probablemente en principal.js)
    if (typeof activities === 'undefined') return;

    const recentActivities = activities.slice(0, 5);
    const unreadCount = recentActivities.filter(act => !act.read).length;
    
    badge.textContent = unreadCount > 0 ? unreadCount : '';
    badge.style.display = unreadCount > 0 ? 'inline-block' : 'none';

    let dropdownHTML = '';

    if (recentActivities.length === 0) {
        dropdownHTML = `<li><span class="dropdown-item text-muted text-center small">No hay actividades recientes</span></li>`;
    } else {
        recentActivities.forEach(activity => {
            // Funciones auxiliares (getActivityIcon, getTimeAgo) deben estar en principal.js
            const icon = typeof getActivityIcon === 'function' ? getActivityIcon(activity.type) : 'bi-bell';
            const timeAgo = typeof getTimeAgo === 'function' ? getTimeAgo(activity.timestamp) : '';

            dropdownHTML += `
                <li class="notification-item ${activity.read ? 'read' : 'unread'}">
                    <a class="dropdown-item ${activity.read ? '' : 'fw-bold'}" href="actividades.html">
                        <div class="d-flex align-items-start">
                            <i class="bi ${icon} me-2"></i>
                            <div class="flex-grow-1">
                                <div class="small">${activity.message}</div>
                                <div class="text-muted small">${timeAgo}</div>
                            </div>
                            ${!activity.read ? '<span class="badge bg-success rounded-pill ms-2" style="font-size: 0.6em;">●</span>' : ''}
                        </div>
                    </a>
                </li>
            `;
        });
    }

    dropdownContent.innerHTML = dropdownHTML;
}

function exportUsersToCSV(filename) {
    let csv = 'ID,Nombre,Email,Tipo Suscripción,Fecha Registro\n';
    
    users.forEach(user => {
        csv += `"${user.id}","${user.name}","${user.email}","${user.subscriptionType}","${user.registrationDate}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Asegúrate de que showNotification esté definida
    if(typeof showNotification === 'function') {
        showNotification('Datos exportados exitosamente', 'success');
    }
}