// Variables específicas para la página de inicio
let currentPageInicio = 1;
const usersPerPageInicio = 3;

document.addEventListener('DOMContentLoaded', function () {
    initializeInicio();
});

// Cargar los 3 usuarios más recientes (dashboard)
async function loadLatestUsersForHome() {
    try {
        const res = await fetch('http://localhost:8080/api/admin/users/latest');
        if (!res.ok) throw new Error('Error obteniendo usuarios');
        const latest = await res.json();

        // Adaptamos al formato que ya espera tu tabla
        users = latest.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            subscriptionType: u.subscriptionType,
            photo: u.photo,
            registrationDate: u.registrationDate,
            status: u.status
        }));

        renderUsersInicio(); // tu función ya existente
    } catch (err) {
        console.error(err);
        document.getElementById('tbodyInicio').innerHTML =
            '<tr><td colspan="6" class="text-center text-danger">Error al cargar usuarios</td></tr>';
    }
}

// 3. EDITAR (CARGAR DATOS EN EL MODAL)
async function editUser(id) {
    userToEditId = id; // Guardamos el ID para usarlo al guardar cambios

    try {
        // Llamada al backend para obtener el detalle separado
        // Endpoint: GET /api/admin/users/{id}
        const response = await fetch(`http://localhost:8080/api/admin/users/${id}`);

        if (!response.ok) {
            throw new Error('No se pudo obtener la información del usuario');
        }

        const user = await response.json();

        // Llenar el formulario con los datos recibidos del DTO (UserDetailDTO)
        document.getElementById('editUserNombre').value = user.nombre || '';
        document.getElementById('editUserApellidoPaterno').value = user.apellidoPaterno || '';
        document.getElementById('editUserApellidoMaterno').value = user.apellidoMaterno || '';
        document.getElementById('editUserEdad').value = user.edad || '';
        document.getElementById('editUserEmail').value = user.email || '';

        // Seleccionar ROL (si existe en el select, sino default 'usuario')
        const rolSelect = document.getElementById('editUserRol');
        if (rolSelect) rolSelect.value = user.rol || 'usuario';

        // Seleccionar SUSCRIPCIÓN (si existe en el select, sino default 4)
        const subSelect = document.getElementById('editUserSubscriptionType');
        if (subSelect) subSelect.value = user.subscriptionId || 4;

        // Limpiar el campo de contraseña (para que esté vacío por seguridad)
        const passField = document.getElementById('editUserPassword');
        if (passField) passField.value = '';

        // Mostrar modal
        const editModal = new bootstrap.Modal(document.getElementById('editUserModal'));
        editModal.show();

    } catch (error) {
        console.error("Error cargando usuario para editar:", error);
        alert("Error al cargar los datos del usuario.");
    }
}

// ===== EDITAR USUARIO (desde inicio.html) =====
async function editUser(id) {
    userToEditId = id; // usas la misma variable global que usuarios.js

    try {
        const response = await fetch(`http://localhost:8080/api/admin/users/${id}`);
        if (!response.ok) throw new Error('No se pudo obtener la información del usuario');
        const user = await response.json();

        // Llenar el formulario con los datos recibidos del DTO (UserDetailDTO)
        document.getElementById('editUserNombre').value = user.nombre || '';
        document.getElementById('editUserApellidoPaterno').value = user.apellidoPaterno || '';
        document.getElementById('editUserApellidoMaterno').value = user.apellidoMaterno || '';
        document.getElementById('editUserEdad').value = user.edad || '';
        document.getElementById('editUserEmail').value = user.email || '';

        const rolSelect = document.getElementById('editUserRol');
        if (rolSelect) rolSelect.value = user.rol || 'usuario';

        const subSelect = document.getElementById('editUserSubscriptionType');
        if (subSelect) subSelect.value = user.subscriptionId || 4;

        const passField = document.getElementById('editUserPassword');
        if (passField) passField.value = '';

        const editModal = new bootstrap.Modal(document.getElementById('editUserModal'));
        editModal.show();

    } catch (error) {
        console.error("Error cargando usuario para editar:", error);
        alert("Error al cargar los datos del usuario.");
    }
}

// ===== ELIMINAR USUARIO (abre modal) =====
function deleteUser(id) {
    userToDeleteId = id; // usada luego en confirmDeleteUser
    const user = users.find(u => u.id === id);
    document.getElementById('deleteUserName').textContent = user ? user.name : 'este usuario';
    const modal = new bootstrap.Modal(document.getElementById('deleteUserModal'));
    modal.show();
}

async function initializeInicio() {
    await loadLatestUsersForHome(); // ✅ carga real
    initializeChartsInicio();
    updateNotificationsDropdown();
    updateRecentActivities();
    updateUserCount();

    // Event listeners para modales de usuarios
    document.getElementById('saveUserBtn').addEventListener('click', saveUser);
    document.getElementById('updateUserBtn').addEventListener('click', updateUser);
    document.getElementById('confirmDeleteBtn').addEventListener('click', confirmDeleteUser);

    // Event listener para vista previa de foto
    document.getElementById('userPhoto').addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                document.getElementById('addPhotoPreview').src = e.target.result;
                document.getElementById('addPhotoPreview').style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    document.getElementById('editUserPhoto').addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                document.getElementById('editPhotoPreview').src = e.target.result;
                document.getElementById('editPhotoPreview').style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    // Event listeners para botones de acción en tabla
    document.addEventListener('click', function (e) {
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
    document.getElementById('exportBtnInicio').addEventListener('click', function () {
        exportUsersToCSV('usuarios_inicio.csv');
    });
}


function renderUsersInicio() {
    const sortedUsers = [...users].sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate));

    const tbodyInicio = document.getElementById('tbodyInicio');
    tbodyInicio.innerHTML = '';

    const startIndexInicio = (currentPageInicio - 1) * usersPerPageInicio;
    const usersForInicio = sortedUsers.slice(startIndexInicio, startIndexInicio + usersPerPageInicio);

    usersForInicio.forEach(user => {
        tbodyInicio.appendChild(createUserRowInicio(user));
    });

    updateInicioPagination(sortedUsers.length);
}

function createUserRowInicio(user) {
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

function updateInicioPagination(totalUsers) {
    const totalPages = Math.ceil(totalUsers / usersPerPageInicio);
    const paginationContainer = document.getElementById('paginationInicio');
    const countElement = document.getElementById('countInicio');

    if (countElement) {
        const startIndex = (currentPageInicio - 1) * usersPerPageInicio + 1;
        const endIndex = Math.min(startIndex + usersPerPageInicio - 1, totalUsers);
        countElement.textContent = `${startIndex}-${endIndex}`;
    }

    if (paginationContainer) {
        let paginationHTML = '';

        // Botón Anterior
        paginationHTML += `
            <li class="page-item ${currentPageInicio === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="changePageInicio(${currentPageInicio - 1})">Anterior</a>
            </li>
        `;

        // Números de página
        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `
                <li class="page-item ${currentPageInicio === i ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="changePageInicio(${i})">${i}</a>
                </li>
            `;
        }

        // Botón Siguiente
        paginationHTML += `
            <li class="page-item ${currentPageInicio === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="changePageInicio(${currentPageInicio + 1})">Siguiente</a>
            </li>
        `;

        paginationContainer.innerHTML = paginationHTML;
    }
}

function changePageInicio(page) {
    const totalPages = Math.ceil(users.length / usersPerPageInicio);
    if (page >= 1 && page <= totalPages) {
        currentPageInicio = page;
        renderUsersInicio();
    }
}

function initializeChartsInicio() {
    const userGrowthCtxInicio = document.getElementById('userGrowthChartInicio');
    if (userGrowthCtxInicio) {
        new Chart(userGrowthCtxInicio.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                datasets: [{
                    label: 'Usuarios Registrados',
                    data: generateUserGrowthData(),
                    borderColor: '#0ea46f',
                    backgroundColor: 'rgba(14, 164, 111, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0,0,0,0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
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

function updateRecentActivities() {
    const container = document.getElementById('recentActivitiesList');
    if (!container) return;

    const recentActivities = activities.slice(0, 3);

    if (recentActivities.length === 0) {
        container.innerHTML = '<p class="text-muted small text-center py-4">No hay actividades recientes</p>';
        return;
    }

    let html = '';
    recentActivities.forEach(activity => {
        const timeAgo = getTimeAgo(activity.timestamp);
        html += `
            <div class="recent-activity-item ${activity.type} ${activity.read ? 'read' : 'unread'}">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <div class="small fw-medium">${activity.message}</div>
                        <div class="recent-activity-time">${timeAgo}</div>
                    </div>
                    <span class="badge bg-${getActivityColor(activity.type)}" style="font-size: 0.6rem;">
                        ${getActivityTypeLabel(activity.type)}
                    </span>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
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

// ===== FUNCIONES DE GUARDAR / ACTUALIZAR / ELIMINAR (para inicio.html) =====

// Guardar nuevo usuario
async function saveUser() {
    const btn = document.getElementById('saveUserBtn');
    const userData = {
        nombre: document.getElementById('userNombre').value,
        apellidoPaterno: document.getElementById('userApellidoPaterno').value,
        apellidoMaterno: document.getElementById('userApellidoMaterno').value,
        edad: parseInt(document.getElementById('userEdad').value),
        email: document.getElementById('userEmail').value,
        password: document.getElementById('userPassword').value,
        rol: document.getElementById('userRol').value,
        subscriptionId: parseInt(document.getElementById('userSubscriptionType').value)
    };

    if (!userData.nombre || !userData.email || !userData.password) {
        alert("Por favor completa los campos obligatorios.");
        return;
    }

    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Guardando...';

    try {
        const res = await fetch('http://localhost:8080/api/admin/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        if (res.ok) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('addUserModal'));
            modal.hide();
            document.getElementById('addUserForm').reset();
            showNotification('Usuario creado exitosamente', 'success');
            await loadLatestUsersForHome(); // recarga tabla
        } else {
            const msg = await res.text();
            alert("Error: " + msg);
        }
    } catch (err) {
        console.error(err);
        alert("Error de conexión.");
    } finally {
        btn.disabled = false;
        btn.innerHTML = 'Guardar Usuario';
    }
}

// Actualizar usuario
async function updateUser() {
    if (!userToEditId) return;
    const btn = document.getElementById('updateUserBtn');
    const userData = {
        nombre: document.getElementById('editUserNombre').value,
        apellidoPaterno: document.getElementById('editUserApellidoPaterno').value,
        apellidoMaterno: document.getElementById('editUserApellidoMaterno').value,
        edad: parseInt(document.getElementById('editUserEdad').value),
        email: document.getElementById('editUserEmail').value,
        password: document.getElementById('editUserPassword').value,
        rol: document.getElementById('editUserRol').value,
        subscriptionId: parseInt(document.getElementById('editUserSubscriptionType').value)
    };

    if (!userData.nombre || !userData.email) {
        alert("Nombre y correo son obligatorios.");
        return;
    }

    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Actualizando...';

    try {
        const res = await fetch(`http://localhost:8080/api/admin/users/${userToEditId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        if (res.ok) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
            modal.hide();
            showNotification('Usuario actualizado correctamente', 'success');
            await loadLatestUsersForHome(); // recarga tabla
        } else {
            const msg = await res.text();
            alert("Error: " + msg);
        }
    } catch (err) {
        console.error(err);
        alert("Error de conexión.");
    } finally {
        btn.disabled = false;
        btn.innerHTML = 'Actualizar Usuario';
        userToEditId = null;
    }
}



// ===== ELIMINAR LÓGICA (cambiar estado a "Desactivado") =====
async function confirmDeleteUser() {
    if (!userToDeleteId) return;
    const btn = document.getElementById('confirmDeleteBtn');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Desactivando...';

    try {
        // 1. Obtener datos actuales del usuario
        const resGet = await fetch(`http://localhost:8080/api/admin/users/${userToDeleteId}`);
        if (!resGet.ok) throw new Error('No se pudo obtener el usuario');
        const user = await resGet.json();

        // 2. Preparar DTO con estado = Desactivado (ID 2)
        const updatedData = {
            nombre: user.nombre,
            apellidoPaterno: user.apellidoPaterno,
            apellidoMaterno: user.apellidoMaterno,
            edad: user.edad,
            email: user.email,
            password: '', // vacío = no cambiar
            rol: user.rol,
            subscriptionId: user.subscriptionId ?? 4,
            // ✅ AGREGAMOS ESTADO = 2 (Desactivado)
            estadoUsuarioId: 2
        };

        // 3. Enviar PUT con el mismo DTO que usas para editar
        const resPut = await fetch(`http://localhost:8080/api/admin/users/${userToDeleteId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        });

        if (resPut.ok) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('deleteUserModal'));
            modal.hide();
            showNotification('Usuario desactivado', 'success');
            await loadLatestUsersForHome(); // recarga tabla
        } else {
            const msg = await resPut.text();
            alert("Error al desactivar: " + msg);
        }
    } catch (err) {
        console.error(err);
        alert("Error de conexión.");
    } finally {
        btn.disabled = false;
        btn.innerHTML = 'Desactivar Usuario';
        userToDeleteId = null;
    }

}