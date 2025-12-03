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

// Cargar estadísticas del dashboard
async function loadDashboardStats() {
    try {
        const res = await fetch('http://localhost:8080/api/admin/stats/dashboard');
        if (!res.ok) throw new Error('Error obteniendo estadísticas');
        const stats = await res.json();
        
        // Actualizar UI
        document.getElementById('totalUsersCount').textContent = stats.totalUsers || '0';
        document.getElementById('totalSubscriptions').textContent = stats.subscribedUsers || '0';
        
        // Si hay datos de transacciones, actualizar
        if (stats.recentTransactions !== undefined) {
            document.querySelector('.card-stat.tx .stat-value').textContent = stats.recentTransactions || '0';
        }
        
        // Calcular crecimiento porcentual (si hay datos de crecimiento)
        if (stats.userGrowth && stats.userGrowth.length >= 2) {
            const growthPercentage = stats.userGrowth[stats.userGrowth.length - 1] > 0 ? 
                Math.round((stats.userGrowth[stats.userGrowth.length - 1] / 
                          Math.max(stats.userGrowth[stats.userGrowth.length - 2], 1)) * 100) : 0;
            
            const growthElement = document.querySelector('.card-stat.users .mt-3');
            if (growthElement) {
                growthElement.innerHTML = `<i class="bi bi-arrow-up-right text-success me-1"></i> Crecimiento +${growthPercentage}% en el último mes`;
            }
        }
        
        return stats.userGrowth || [];
    } catch (error) {
        console.error('Error cargando estadísticas:', error);
        return [];
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
    // Cargar datos reales
    await loadLatestUsersForHome(); // ✅ carga usuarios más recientes
    await loadDashboardStats(); // ✅ carga estadísticas del dashboard
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

    if (usersForInicio.length === 0) {
        tbodyInicio.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No se encontraron usuarios</td></tr>';
    } else {
        usersForInicio.forEach(user => {
            tbodyInicio.appendChild(createUserRowInicio(user));
        });
    }

    updateInicioPagination(sortedUsers.length);
}

function createUserRowInicio(user) {
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
    const badgeClass = subscriptionBadgeClass[user.subscriptionType] || 'bg-secondary text-white';

    tr.innerHTML = `
        <td><span class="badge bg-light text-dark">${user.id}</span></td>
        <td>
            <div class="d-flex align-items-center gap-2">
                <div class="avatar-sm" style="background:${user.photo ? 'transparent' : bgColor}">
                    ${user.photo ?
            `<img src="${user.photo}" alt="${user.name}" style="width:100%;height:100%;border-radius:50%;">` :
            `<span>${initials}</span>`
        }
                </div>
            </div>
        </td>
        <td>
            <div style="font-weight:600">${user.name || 'Sin nombre'}</div>
            <small class="text-muted">${user.email || 'Sin correo'}</small>
        </td>
        <td>${user.email || ''}</td>
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

function updateInicioPagination(totalUsers) {
    const totalPages = Math.ceil(totalUsers / usersPerPageInicio);
    const paginationContainer = document.getElementById('paginationInicio');
    const countElement = document.getElementById('countInicio');

    if (countElement) {
        if (totalUsers === 0) {
            countElement.textContent = '0-0';
        } else {
            const startIndex = (currentPageInicio - 1) * usersPerPageInicio + 1;
            const endIndex = Math.min(startIndex + usersPerPageInicio - 1, totalUsers);
            countElement.textContent = `${startIndex}-${endIndex}`;
        }
    }

    // Actualizar total de usuarios en la tabla
    const totalUsersElement = document.getElementById('totalUsersInicio');
    if (totalUsersElement) {
        totalUsersElement.textContent = totalUsers;
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

async function initializeChartsInicio() {
    const userGrowthCtxInicio = document.getElementById('userGrowthChartInicio');
    if (userGrowthCtxInicio) {
        // Obtener datos reales de crecimiento
        const growthData = await generateUserGrowthData();
        
        const chart = new Chart(userGrowthCtxInicio.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                datasets: [{
                    label: 'Usuarios Registrados',
                    data: growthData,
                    borderColor: '#0ea46f',
                    backgroundColor: 'rgba(14, 164, 111, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#0ea46f',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#0ea46f',
                        borderWidth: 1,
                        cornerRadius: 5
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0,0,0,0.05)'
                        },
                        ticks: {
                            color: '#666'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#666'
                        }
                    }
                }
            }
        });
        
        // Guardar referencia al chart para posibles actualizaciones
        window.userGrowthChart = chart;
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

// ===== DATOS REALES PARA EL GRÁFICO (últimos 12 meses) =====
async function generateUserGrowthData() {
    try {
        const res = await fetch('http://localhost:8080/api/admin/usuarios/crecimiento-mensual');
        if (!res.ok) {
            console.warn('Error obteniendo crecimiento, usando datos de prueba');
            return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        }
        const data = await res.json();
        
        // Validar que sea un array
        if (Array.isArray(data) && data.length === 12) {
            return data;
        } else {
            console.warn('Formato de datos incorrecto, usando datos de prueba');
            return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        }
    } catch (err) {
        console.error('Error generando datos de crecimiento:', err);
        return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // fallback
    }
}

function exportUsersToCSV(filename) {
    if (!users || users.length === 0) {
        alert('No hay datos para exportar');
        return;
    }

    let csv = 'ID,Nombre,Email,Tipo Suscripción,Fecha Registro,Estado\n';

    users.forEach(user => {
        csv += `"${user.id || ''}","${user.name || ''}","${user.email || ''}","${user.subscriptionType || ''}","${user.registrationDate || ''}","${user.status || ''}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    if (typeof showNotification === 'function') {
        showNotification('Datos exportados exitosamente', 'success');
    } else {
        alert('Datos exportados exitosamente');
    }
}

// ===== FUNCIONES DE GUARDAR / ACTUALIZAR / ELIMINAR (para inicio.html) =====

// Guardar nuevo usuario
async function saveUser() {
    const btn = document.getElementById('saveUserBtn');
    const userData = {
        nombre: document.getElementById('userNombre').value,
        apellidoPaterno: document.getElementById('userApellidoPaterno').value,
        apellidoMaterno: document.getElementById('userApellidoMaterno').value,
        edad: parseInt(document.getElementById('userEdad').value) || 0,
        email: document.getElementById('userEmail').value,
        password: document.getElementById('userPassword').value,
        rol: document.getElementById('userRol').value,
        subscriptionId: parseInt(document.getElementById('userSubscriptionType').value) || 4
    };

    if (!userData.nombre || !userData.email || !userData.password) {
        alert("Por favor completa los campos obligatorios.");
        return;
    }

    btn.disabled = true;
    const originalText = btn.innerHTML;
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
            
            // Limpiar vista previa de foto
            const preview = document.getElementById('addPhotoPreview');
            if(preview) {
                preview.src = '';
                preview.style.display = 'none';
            }
            
            if (typeof showNotification === 'function') {
                showNotification('Usuario creado exitosamente', 'success');
            } else {
                alert('Usuario creado exitosamente');
            }
            
            // Recargar datos
            await loadLatestUsersForHome();
            await loadDashboardStats();
            
            // Actualizar gráfico si existe
            if (window.userGrowthChart) {
                const newData = await generateUserGrowthData();
                window.userGrowthChart.data.datasets[0].data = newData;
                window.userGrowthChart.update();
            }
            
        } else {
            const msg = await res.text();
            alert("Error: " + msg);
        }
    } catch (err) {
        console.error(err);
        alert("Error de conexión con el servidor.");
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
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
        edad: parseInt(document.getElementById('editUserEdad').value) || 0,
        email: document.getElementById('editUserEmail').value,
        password: document.getElementById('editUserPassword').value || '',
        rol: document.getElementById('editUserRol').value,
        subscriptionId: parseInt(document.getElementById('editUserSubscriptionType').value) || 4
    };

    if (!userData.nombre || !userData.email) {
        alert("Nombre y correo son obligatorios.");
        return;
    }

    btn.disabled = true;
    const originalText = btn.innerHTML;
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
            
            if (typeof showNotification === 'function') {
                showNotification('Usuario actualizado correctamente', 'success');
            } else {
                alert('Usuario actualizado correctamente');
            }
            
            // Recargar datos
            await loadLatestUsersForHome();
            
        } else {
            const msg = await res.text();
            alert("Error: " + msg);
        }
    } catch (err) {
        console.error(err);
        alert("Error de conexión con el servidor.");
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
        userToEditId = null;
    }
}

// ===== ELIMINAR LÓGICA (cambiar estado a "Desactivado") =====
async function confirmDeleteUser() {
    if (!userToDeleteId) return;
    const btn = document.getElementById('confirmDeleteBtn');
    btn.disabled = true;
    const originalText = btn.innerHTML;
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
            
            if (typeof showNotification === 'function') {
                showNotification('Usuario desactivado correctamente', 'success');
            } else {
                alert('Usuario desactivado correctamente');
            }
            
            // Recargar datos
            await loadLatestUsersForHome();
            await loadDashboardStats();
            
        } else {
            const msg = await resPut.text();
            alert("Error al desactivar: " + msg);
        }
    } catch (err) {
        console.error(err);
        alert("Error de conexión con el servidor.");
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
        userToDeleteId = null;
    }
}

// Función auxiliar para actualizar conteo de usuarios
function updateUserCount() {
    const totalUsersElement = document.getElementById('totalUsers');
    const totalUsers2Element = document.getElementById('totalUsers2');
    
    if (totalUsersElement && users) {
        totalUsersElement.textContent = users.length;
    }
    
    if (totalUsers2Element && users) {
        totalUsers2Element.textContent = users.length;
    }
}