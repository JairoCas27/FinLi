// Variables específicas para la página de usuarios
let currentPageUsuarios = 1;
const usersPerPageUsuarios = 10;
let searchUsersInput = '';
let subscriptionFilterValue = 'all';

document.addEventListener('DOMContentLoaded', function() {
    initializeUsuarios();
});

function initializeUsuarios() {
    renderUsers();
    updateNotificationsDropdown();
    updateUserCount();
    
    // Event listeners para búsqueda y filtros
    document.getElementById('searchUsersInput').addEventListener('input', function(e) {
        searchUsersInput = e.target.value.toLowerCase();
        currentPageUsuarios = 1;
        renderUsers();
    });

    document.getElementById('subscriptionFilter').addEventListener('change', function(e) {
        subscriptionFilterValue = e.target.value;
        currentPageUsuarios = 1;
        renderUsers();
    });
    
    // Event listeners para modales de usuarios
    document.getElementById('saveUserBtn').addEventListener('click', saveUser);
    document.getElementById('updateUserBtn').addEventListener('click', updateUser);
    document.getElementById('confirmDeleteBtn').addEventListener('click', confirmDeleteUser);
    
    // Event listener para vista previa de foto
    document.getElementById('userPhoto').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('addPhotoPreview').src = e.target.result;
                document.getElementById('addPhotoPreview').style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
    
    document.getElementById('editUserPhoto').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('editPhotoPreview').src = e.target.result;
                document.getElementById('editPhotoPreview').style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    // Event listeners para botones de acción en tabla
    document.addEventListener('click', function(e) {
        if (e.target.closest('.edit-user')) {
            const userId = parseInt(e.target.closest('.edit-user').getAttribute('data-id'));
            editUser(userId);
        }
        
        if (e.target.closest('.delete-user')) {
            const userId = parseInt(e.target.closest('.delete-user').getAttribute('data-id'));
            deleteUser(userId);
        }
    });

    // Event listener para exportar CSV
    document.getElementById('exportBtnUsuarios').addEventListener('click', function() {
        exportUsersToCSV('usuarios_completo.csv');
    });
}

function renderUsers() {
    // Filtrar usuarios según búsqueda y filtros
    let filteredUsers = [...users];
    
    if (searchUsersInput) {
        filteredUsers = filteredUsers.filter(user => 
            user.name.toLowerCase().includes(searchUsersInput) || 
            user.email.toLowerCase().includes(searchUsersInput)
        );
    }
    
    if (subscriptionFilterValue !== 'all') {
        filteredUsers = filteredUsers.filter(user => user.subscriptionType === subscriptionFilterValue);
    }
    
    const sortedUsers = filteredUsers.sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate));
    
    // Renderizar en la tabla de Usuarios (con paginación)
    const tbodyUsuarios = document.getElementById('tbodyUsuarios');
    tbodyUsuarios.innerHTML = '';
    
    const startIndexUsuarios = (currentPageUsuarios - 1) * usersPerPageUsuarios;
    const usersForUsuarios = sortedUsers.slice(startIndexUsuarios, startIndexUsuarios + usersPerPageUsuarios);
    
    usersForUsuarios.forEach(user => {
        tbodyUsuarios.appendChild(createUserRow(user, 'usuarios'));
    });
    
    // Actualizar contadores y paginación de Usuarios
    updateUsuariosPagination(sortedUsers.length);
    updateUserCount();
}

function createUserRow(user, section = 'usuarios') {
    const tr = document.createElement('tr');
    
    const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
    const colors = ['var(--accent)', 'var(--accent-3)', 'var(--accent-4)', 'var(--muted)', '#3498db', '#e74c3c', '#2ecc71', '#9b59b6', '#f39c12', '#1abc9c'];
    const colorIndex = user.id % colors.length;
    const bgColor = colors[colorIndex];
    
    const subscriptionBadgeClass = {
        'Sin suscripción': 'bg-light text-dark',
        'Mensual': 'bg-success text-white',
        'Anual': 'bg-warning text-dark',
        'De por vida': 'bg-info text-white'
    };
    
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
        <td><span class="badge rounded-pill ${subscriptionBadgeClass[user.subscriptionType]}">${user.subscriptionType}</span></td>
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

function updateUsuariosPagination(totalUsers) {
    const totalPages = Math.ceil(totalUsers / usersPerPageUsuarios);
    const paginationContainer = document.getElementById('paginationUsuarios');
    const countElement = document.getElementById('countUsuarios');
    
    if (countElement) {
        const startIndex = (currentPageUsuarios - 1) * usersPerPageUsuarios + 1;
        const endIndex = Math.min(startIndex + usersPerPageUsuarios - 1, totalUsers);
        countElement.textContent = `${startIndex}-${endIndex}`;
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

    const recentActivities = activities.slice(0, 5);
    const unreadCount = recentActivities.filter(act => !act.read).length;
    
    badge.textContent = unreadCount > 0 ? unreadCount : '';
    badge.style.display = unreadCount > 0 ? 'inline-block' : 'none';

    let dropdownHTML = '';

    if (recentActivities.length === 0) {
        dropdownHTML = `<li><span class="dropdown-item text-muted text-center small">No hay actividades recientes</span></li>`;
    } else {
        recentActivities.forEach(activity => {
            const icon = getActivityIcon(activity.type);
            const timeAgo = getTimeAgo(activity.timestamp);

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
    
    showNotification('Datos exportados exitosamente', 'success');
}