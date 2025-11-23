// ==========================================
// VARIABLES GLOBALES
// ==========================================

// 1. IMPORTANTE: No usamos 'let' porque 'users' ya existe en principal.js.
// Simplemente la reiniciamos para llenarla con datos reales.
users = []; 

// Variables para guardar temporalmente los IDs de acción
let userToDeleteId = null;
let userToEditId = null; // <--- IMPORTANTE: Para saber a quién estamos editando

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

// Esta función carga los datos desde el Backend (Java)
async function initializeUsuarios(searchTerm = '') {
    try {
        // 1. Construimos la URL con el parámetro de búsqueda si existe
        // Endpoint creado en AdminUsuarioController
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
        console.log("Usuarios cargados:", users.length);

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
        if(tbody) tbody.innerHTML = '<tr><td colspan="7" class="text-center text-danger">Error de conexión con el servidor</td></tr>';
    }
}

// ==========================================
// EVENT LISTENERS
// ==========================================

function setupEventListeners() {
    // 1. BUSCADOR: Conectado al Backend con "debounce"
    const searchInput = document.getElementById('searchUsersInput');
    if(searchInput) {
        let timeoutId;
        searchInput.addEventListener('input', function(e) {
            clearTimeout(timeoutId);
            const texto = e.target.value;
            
            // Espera 300ms antes de llamar al servidor para no saturarlo
            timeoutId = setTimeout(() => {
                initializeUsuarios(texto);
            }, 300);
        });
    }

    // 2. FILTRO SUSCRIPCIÓN: Local
    const filterInput = document.getElementById('subscriptionFilter');
    if(filterInput) {
        filterInput.addEventListener('change', function(e) {
            subscriptionFilterValue = e.target.value;
            currentPageUsuarios = 1;
            renderUsers();
        });
    }
    
    // 3. BOTONES DE MODALES (Guardar, Actualizar, Confirmar Eliminar)
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

    // 6. ACCIONES EN TABLA (Delegación de eventos)
    document.addEventListener('click', function(e) {
        // Click en Editar
        if (e.target.closest('.edit-user')) {
            const userId = parseInt(e.target.closest('.edit-user').getAttribute('data-id'));
            editUser(userId);
        }
        
        // Click en Eliminar
        if (e.target.closest('.delete-user')) {
            const userId = parseInt(e.target.closest('.delete-user').getAttribute('data-id'));
            deleteUser(userId);
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
    
    // Filtro local adicional si se requiere (el principal ya lo hizo Java)
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
    
    // Ordenar (Nota: Java envía fecha fija '2024-01-01' por ahora, así que el orden será por defecto)
    const sortedUsers = filteredUsers.sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate));
    
    // Paginación y Renderizado
    const tbodyUsuarios = document.getElementById('tbodyUsuarios');
    if(tbodyUsuarios) {
        tbodyUsuarios.innerHTML = '';
        
        const startIndexUsuarios = (currentPageUsuarios - 1) * usersPerPageUsuarios;
        const usersForUsuarios = sortedUsers.slice(startIndexUsuarios, startIndexUsuarios + usersPerPageUsuarios);
        
        if (usersForUsuarios.length === 0) {
            // Nota: colspan="7" porque ahora tenemos una columna extra
            tbodyUsuarios.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No se encontraron usuarios</td></tr>';
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
    
    // --- Lógica de colores para Suscripción ---
    const subscriptionBadgeClass = {
        'Sin suscripción': 'bg-light text-dark',
        'Mensual': 'bg-success text-white',
        'Anual': 'bg-warning text-dark',
        'De por vida': 'bg-info text-white'
    };
    const badgeClass = subscriptionBadgeClass[user.subscriptionType] || 'bg-secondary text-white';

    // --- NUEVO: Lógica de colores para el ESTADO ---
    const statusBadgeClass = {
        'Activo': 'bg-success',               // Verde
        'Inactivo': 'bg-danger',              // Rojo
        'Suspendido': 'bg-warning text-dark', // Amarillo
        'Bloqueado': 'bg-dark text-white'     // Negro
    };
    // Obtenemos el estado que viene de Java (o 'Desconocido' si es null)
    const userStatus = user.status || 'Desconocido';
    const statusClass = statusBadgeClass[userStatus] || 'bg-secondary';
    
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
        
        <!-- NUEVA COLUMNA: ESTADO -->
        <td><span class="badge ${statusClass}">${userStatus}</span></td>

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
// LÓGICA DE ACCIONES (ELIMINAR, EDITAR, GUARDAR)
// ==========================================

// 1. ELIMINAR (Abrir Modal)
function deleteUser(id) {
    userToDeleteId = id;
    
    // Buscamos el usuario en el array local para mostrar su nombre
    const user = users.find(u => u.id === id);
    const nameToShow = user ? user.name : 'este usuario';
    
    const nameElement = document.getElementById('deleteUserName');
    if(nameElement) nameElement.textContent = nameToShow;
    
    // Mostrar modal
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteUserModal'));
    deleteModal.show();
}

// 2. CONFIRMAR ELIMINACIÓN (Llamada al Backend)
async function confirmDeleteUser() {
    if (!userToDeleteId) return;

    const btn = document.getElementById('confirmDeleteBtn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Eliminando...';
    btn.disabled = true;

    try {
        // Llamada al endpoint existente: DELETE /api/admin/usuarios/{id}
        const response = await fetch(`http://localhost:8080/api/admin/usuarios/${userToDeleteId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok || response.status === 204) {
            // Éxito: Cerrar modal
            const modalEl = document.getElementById('deleteUserModal');
            const modalInstance = bootstrap.Modal.getInstance(modalEl);
            modalInstance.hide();

            // Recargar la tabla para que desaparezca el usuario (o cambie de estado)
            await initializeUsuarios(); 
            
        } else {
            alert("Error al intentar eliminar el usuario (Status: " + response.status + ")");
        }

    } catch (error) {
        console.error("Error eliminando usuario:", error);
        alert("Error de conexión con el servidor.");
    } finally {
        // Restaurar botón
        btn.innerHTML = originalText;
        btn.disabled = false;
        userToDeleteId = null;
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
        if(passField) passField.value = '';

        // Mostrar modal
        const editModal = new bootstrap.Modal(document.getElementById('editUserModal'));
        editModal.show();

    } catch (error) {
        console.error("Error cargando usuario para editar:", error);
        alert("Error al cargar los datos del usuario.");
    }
}

// 4. GUARDAR NUEVO USUARIO (Lógica Real)
async function saveUser() {
    const btn = document.getElementById('saveUserBtn');
    
    // 1. Capturar datos del formulario HTML
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

    // Validaciones básicas
    if (!userData.nombre || !userData.email || !userData.password) {
        alert("Por favor completa los campos obligatorios.");
        return;
    }

    // Cambiar estado del botón (Feedback visual)
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Guardando...';
    btn.disabled = true;

    try {
        // 2. Enviar datos al Backend (POST)
        const response = await fetch('http://localhost:8080/api/admin/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        // 3. Manejar la respuesta
        if (response.ok) {
            // Éxito: Cerrar modal, limpiar formulario y recargar tabla
            const modalEl = document.getElementById('addUserModal');
            const modalInstance = bootstrap.Modal.getInstance(modalEl);
            modalInstance.hide();
            
            document.getElementById('addUserForm').reset(); // Limpiar campos
            
            // Limpiar foto previa si existe
            const preview = document.getElementById('addPhotoPreview');
            if(preview) {
                preview.src = '';
                preview.style.display = 'none';
            }

            alert("Usuario creado exitosamente.");
            await initializeUsuarios(); // Recargar la tabla para ver al nuevo usuario

        } else {
            // Error del servidor (ej: correo duplicado)
            const errorMsg = await response.text();
            alert("Error al guardar: " + errorMsg);
        }

    } catch (error) {
        console.error("Error guardando usuario:", error);
        alert("Error de conexión con el servidor.");
    } finally {
        // Restaurar botón
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

// 5. ACTUALIZAR USUARIO (PUT)
async function updateUser() {
    if (!userToEditId) return;

    const btn = document.getElementById('updateUserBtn');
    
    // Capturar datos del formulario de EDICIÓN
    const userData = {
        nombre: document.getElementById('editUserNombre').value,
        apellidoPaterno: document.getElementById('editUserApellidoPaterno').value,
        apellidoMaterno: document.getElementById('editUserApellidoMaterno').value,
        edad: parseInt(document.getElementById('editUserEdad').value),
        email: document.getElementById('editUserEmail').value,
        password: document.getElementById('editUserPassword').value, // Puede ir vacío
        rol: document.getElementById('editUserRol').value,
        subscriptionId: parseInt(document.getElementById('editUserSubscriptionType').value)
    };

    if (!userData.nombre || !userData.email) {
        alert("Nombre y correo son obligatorios.");
        return;
    }

    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Actualizando...';
    btn.disabled = true;

    try {
        // Petición PUT al backend
        // Endpoint: PUT /api/admin/users/{id}
        const response = await fetch(`http://localhost:8080/api/admin/users/${userToEditId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            const modalEl = document.getElementById('editUserModal');
            const modalInstance = bootstrap.Modal.getInstance(modalEl);
            modalInstance.hide();

            alert("Usuario actualizado correctamente.");
            await initializeUsuarios(); // Recargar tabla para ver los cambios

        } else {
            const errorMsg = await response.text();
            alert("Error al actualizar: " + errorMsg);
        }

    } catch (error) {
        console.error("Error actualizando usuario:", error);
        alert("Error de conexión con el servidor.");
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
        userToEditId = null;
    }
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
    if (!badge || !dropdownContent || typeof activities === 'undefined') return;

    const recentActivities = activities.slice(0, 5);
    const unreadCount = recentActivities.filter(act => !act.read).length;
    
    badge.textContent = unreadCount > 0 ? unreadCount : '';
    badge.style.display = unreadCount > 0 ? 'inline-block' : 'none';

    let dropdownHTML = '';
    if (recentActivities.length === 0) {
        dropdownHTML = `<li><span class="dropdown-item text-muted text-center small">No hay actividades recientes</span></li>`;
    } else {
        recentActivities.forEach(activity => {
            const icon = typeof getActivityIcon === 'function' ? getActivityIcon(activity.type) : 'bi-bell';
            const timeAgo = typeof getTimeAgo === 'function' ? getTimeAgo(activity.timestamp) : '';
            dropdownHTML += `<li class="notification-item ${activity.read ? 'read' : 'unread'}"><a class="dropdown-item" href="actividades.html"><div class="d-flex align-items-start"><i class="bi ${icon} me-2"></i><div><div class="small">${activity.message}</div><div class="text-muted small">${timeAgo}</div></div></div></a></li>`;
        });
    }
    dropdownContent.innerHTML = dropdownHTML;
}

// 7. EXPORTAR (AHORA LLAMA AL BACKEND PARA DESCARGAR EL EXCEL)
function exportUsersToCSV(filename) { // Mantenemos el nombre de la función para no romper el listener, aunque descargue Excel
    const exportBtn = document.getElementById('exportBtnUsuarios');
    const originalText = exportBtn.innerHTML;
    exportBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Exportando...';
    exportBtn.disabled = true;

    // Llamada al endpoint del Backend
    fetch('http://localhost:8080/api/admin/users/export/excel')
        .then(response => {
            if (response.ok) {
                return response.blob();
            }
            throw new Error('Error al exportar');
        })
        .then(blob => {
            // Crear link invisible para descargar
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            // Nombre del archivo (puede venir del header o ponemos uno nosotros)
            a.download = 'reporte_usuarios_finli.xlsx'; 
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            
            if(typeof showNotification === 'function') {
                showNotification('Excel descargado exitosamente', 'success');
            }
        })
        .catch(error => {
            console.error('Error exportando:', error);
            alert('Hubo un error al generar el Excel.');
        })
        .finally(() => {
            exportBtn.innerHTML = originalText;
            exportBtn.disabled = false;
        });
}