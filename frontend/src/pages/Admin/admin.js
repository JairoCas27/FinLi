// ==============================================================================
// === CONFIGURACIÓN DE LA API ===
// ==============================================================================
const API_URL_BASE = 'http://localhost:8080'; // <-- Ajusta el puerto si es diferente al 8080
const ENDPOINT_USUARIOS = '/api/admin/usuarios'; 
const ENDPOINT_ESTADOS = '/api/admin/estados-usuario'; // NUEVO ENDPOINT

// ==============================================================================
// === VARIABLES GLOBALES ===
// ==============================================================================
let users = [];
let currentEditingUserId = null;
let currentDeletingUserId = null; 
const API_BASE_URL = API_URL_BASE; 

// Referencias a modales de Bootstrap
const addUserModal = new bootstrap.Modal(document.getElementById('addUserModal'));
const deleteUserModal = new bootstrap.Modal(document.getElementById('deleteUserModal'));
const editUserModal = new bootstrap.Modal(document.getElementById('editUserModal')); // NUEVA REFERENCIA

// Referencias para la navegación y títulos
const navLinks = document.querySelectorAll('.sidebar .nav-link');
const contentSections = document.querySelectorAll('.content-section');
const mainTitle = document.getElementById('main-title');
const mainSubtitle = document.getElementById('main-subtitle');
const titleMap = {
    'inicio': { title: 'Bienvenido, <span class="text-gradient">Administrador</span>', subtitle: 'Panel de control' },
    'usuarios': { title: 'Gestión de Usuarios', subtitle: 'Administra y controla todos los usuarios del sistema FinLi' },
    'reportes': { title: 'Reportes Financieros', subtitle: 'Analiza el rendimiento y crecimiento de FinLi' }
};

// Ayudante para la fecha
document.getElementById('year').textContent = new Date().getFullYear();

// ==============================================================================
// === LÓGICA DE CARGA DE DATOS DESDE EL BACKEND ===
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
                // PENDIENTE: AUTENTICACIÓN.
            }
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        users = data; 

    } catch (error) {
        console.error("Fallo al cargar la lista de usuarios:", error.message);
        // Opcionalmente, puedes mostrar un mensaje de error en la UI
    }
}

// --------------------------------------------------------------------------------
// --- FUNCIONES EXISTENTES MODIFICADAS ---
// --------------------------------------------------------------------------------

function updateUserCount() {
    document.getElementById('totalUsers').textContent = users.length;
    document.getElementById('totalUsers2').textContent = users.length;
    document.getElementById('countInicio').textContent = Math.min(4, users.length);
    document.getElementById('countUsuarios').textContent = users.length; 
}

/**
 * FUNCIÓN CORREGIDA: Eliminación del filtro estricto que vaciaba la tabla.
 */
function renderUsers() {
    // ❌ CÓDIGO ANTERIOR: const activeUsers = users.filter(user => user.estadoUsuario && user.estadoUsuario.idEstado !== 2);
    // ✅ CÓDIGO CORREGIDO: Usamos la lista completa de usuarios para asegurar que se muestren.
    const usersToRender = users;
    
    const sortedUsers = [...usersToRender].sort((a, b) => (b.id || 0) - (a.id || 0));
    
    // Renderizado para la sección de Inicio (últimos 4)
    const tbodyInicio = document.getElementById('tbodyInicio');
    if (tbodyInicio) {
        tbodyInicio.innerHTML = '';
        const usersForInicio = sortedUsers.slice(0, 4);
        usersForInicio.forEach(user => {
            tbodyInicio.appendChild(createUserRow(user));
        });
    }
    
    // Renderizado para la sección de Usuarios (todos)
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
 * NOTA: Asumimos que el DTO ya trae 'estadoUsuario' con 'nombreEstado'.
 */
function createUserRow(user, section = 'inicio') {
    const tr = document.createElement('tr');
    
    // Usamos los campos reales: nombre, apellidoPaterno, apellidoMaterno
    const nombreCompleto = `${user.nombre || ''} ${user.apellidoPaterno || ''} ${user.apellidoMaterno || ''}`.trim();
    const initials = nombreCompleto.split(' ').map(n => n[0]).join('').toUpperCase();
    
    const colors = ['var(--accent-3)', 'var(--accent)', 'var(--accent-4)', 'var(--muted)', '#3498db', '#e74c3c', '#2ecc71', '#9b59b6', '#f39c12', '#1abc9c'];
    const colorIndex = (user.id || 0) % colors.length;
    const bgColor = colors[colorIndex];
    
    // Asumiendo que el DTO de respuesta no incluye fecha de registro por ahora
    const formattedDate = "N/A"; 
    
    // Determinando el tipo de cuenta y estado (Ajuste según tu DTO)
    // ESTA LÍNEA ES SEGURA y usa operadores de protección, por eso los estados sí se cargaban.
    const userType = user.estadoUsuario ? user.estadoUsuario.nombreEstado : "Desconocido"; 
    const isPremium = userType.includes("Premium") ? 'bg-warning text-dark' : 'bg-light text-dark';
    
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
    <td>${user.correo || 'N/A'}</td>
    <td><span class="badge rounded-pill ${isPremium}">${userType}</span></td>
    <td>${formattedDate}</td>
    <td class="text-end">
        <button class="btn btn-sm btn-light edit-user" data-id="${user.id}" title="Editar"><i class="bi bi-pencil"></i></button>
        <button class="btn btn-sm btn-light delete-user" data-id="${user.id}" data-name="${nombreCompleto}" title="Eliminar"><i class="bi bi-trash"></i></button>
    </td>
    `;
    
    return tr;
}

// ==============================================================================
// === LÓGICA COMPARTIDA: ESTADOS DE USUARIO ===
// ==============================================================================

/**
 * Carga los estados de usuario desde el backend a un elemento select.
 * @param {string} selectId El ID del select (e.g., 'estadoUsuarioId', 'editEstadoUsuarioId').
 */
async function cargarEstadosUsuario(selectId) {
    const selectElement = document.getElementById(selectId);
    if (!selectElement) return;
    
    selectElement.innerHTML = '<option value="">Cargando...</option>';

    try {
        const response = await fetch(API_BASE_URL + ENDPOINT_ESTADOS);
        if (!response.ok) throw new Error('Error al obtener estados: ' + response.statusText);

        const estados = await response.json();
        
        selectElement.innerHTML = '<option value="">-- Seleccione un Estado --</option>'; 
        estados.forEach(estado => {
            const option = document.createElement('option');
            option.value = estado.idEstado; 
            option.textContent = estado.nombreEstado;
            selectElement.appendChild(option);
        });

    } catch (error) {
        console.error("Error al cargar estados:", error);
        selectElement.innerHTML = '<option value="">Error de carga</option>';
        // Aquí podrías agregar una alerta visual específica si es necesario
    }
}

// Evento para cargar estados al abrir el modal de Agregar Usuario
const addUserModalElement = document.getElementById('addUserModal');
if (addUserModalElement) {
    addUserModalElement.addEventListener('show.bs.modal', () => cargarEstadosUsuario('estadoUsuarioId'));
}

// Evento para cargar estados al abrir el modal de Editar Usuario
const editUserModalElement = document.getElementById('editUserModal');
if (editUserModalElement) {
    editUserModalElement.addEventListener('show.bs.modal', async () => {
        await cargarEstadosUsuario('editEstadoUsuarioId');
        // Esto garantiza que los estados se carguen antes de rellenar los datos
        cargarDatosUsuarioParaEdicion(currentEditingUserId);
    });
}


// ==============================================================================
// === LÓGICA DE CREACIÓN DE USUARIO (CRUD - C) ===
// ==============================================================================

document.getElementById('saveUserBtn').addEventListener('click', async function() {
    const form = document.getElementById('addUserForm');
    const alertDiv = document.getElementById('add-user-alert');
    
    alertDiv.classList.add('d-none'); 
    alertDiv.className = 'alert d-none'; 
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const nuevoCliente = {
        nombre: form.nombre.value,
        apellidoPaterno: form.apellidoPaterno.value,
        apellidoMaterno: form.apellidoMaterno.value,
        correo: form.correo.value,
        contrasena: form.contrasena.value,
        edad: parseInt(form.edad.value, 10),
        estadoUsuario: { 
            idEstado: parseInt(form.estadoUsuarioId.value, 10) 
        }
    };
    
    this.disabled = true; 
    
    try {
        const response = await fetch(API_BASE_URL + ENDPOINT_USUARIOS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoCliente)
        });

        const data = await response.json();

        if (response.status === 201) { 
            alertDiv.textContent = `✅ Cliente ${data.nombre} agregado con ID: ${data.id}.`;
            alertDiv.className = 'alert alert-success';
            form.reset(); 
            addUserModal.hide(); 
            initializeUsers(); 
        } else {
            alertDiv.textContent = `❌ Error al crear cliente: ${data.message || 'Error desconocido'}`;
            alertDiv.className = 'alert alert-danger';
        }

    } catch (error) {
        console.error("Error de red/conexión:", error);
        alertDiv.textContent = '❌ Error de conexión con el servidor.';
        alertDiv.className = 'alert alert-danger';

    } finally {
        alertDiv.classList.remove('d-none'); 
        this.disabled = false; 
    }
});


// ==============================================================================
// === LÓGICA DE ACTUALIZACIÓN DE USUARIO (CRUD - U) ===
// ==============================================================================

/**
 * Función que busca el usuario y rellena el modal de edición.
 * @param {number} id El ID del usuario a cargar.
 */
function cargarDatosUsuarioParaEdicion(id) {
    const user = users.find(u => u.id === id);
    if (!user) {
        console.error("Usuario no encontrado para editar:", id);
        return;
    }

    // Rellenar campos del modal de Edición
    document.getElementById('editUserId').value = user.id;
    document.getElementById('editUserIdDisplay').textContent = `#${user.id}`;
    document.getElementById('editNombre').value = user.nombre || '';
    document.getElementById('editApellidoPaterno').value = user.apellidoPaterno || '';
    document.getElementById('editApellidoMaterno').value = user.apellidoMaterno || '';
    document.getElementById('editCorreo').value = user.correo || '';
    document.getElementById('editEdad').value = user.edad || '';
    
    // Seleccionar el estado actual
    const estadoUsuarioId = user.estadoUsuario ? user.estadoUsuario.idEstado : null;
    document.getElementById('editEstadoUsuarioId').value = estadoUsuarioId;

    // Ya no es necesario mostrar el modal aquí, se hace en el manejador del evento show.bs.modal
}

/**
 * Maneja el envío del formulario de Actualización.
 */
document.getElementById('updateUserBtn').addEventListener('click', async function() {
    const form = document.getElementById('editUserForm');
    const alertDiv = document.getElementById('edit-user-alert');
    
    alertDiv.classList.add('d-none'); 
    alertDiv.className = 'alert d-none'; 
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const userId = parseInt(form.editUserId.value, 10);
    
    // Mapeo de campos HTML a la estructura JSON esperada por Usuario.java
    const usuarioActualizado = {
        id: userId, // Necesario para el PUT
        nombre: form.editNombre.value,
        apellidoPaterno: form.editApellidoPaterno.value,
        apellidoMaterno: form.editApellidoMaterno.value,
        correo: form.editCorreo.value,
        edad: parseInt(form.editEdad.value, 10),
        estadoUsuario: { 
            idEstado: parseInt(form.editEstadoUsuarioId.value, 10) 
        }
        // Nota: La contraseña y la foto se omiten en esta actualización
    };
    
    this.disabled = true; 
    
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINT_USUARIOS}/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(usuarioActualizado)
        });

        const data = await response.json();

        if (response.status === 200) { // 200 OK
            alertDiv.textContent = `✅ Usuario ID ${userId} actualizado correctamente.`;
            alertDiv.className = 'alert alert-success';
            
            // Recargar la tabla y cerrar el modal
            editUserModal.hide(); 
            initializeUsers(); 
        } else if (response.status === 404) {
            alertDiv.textContent = `❌ Error: Usuario ID ${userId} no encontrado.`;
            alertDiv.className = 'alert alert-danger';
        } else {
            alertDiv.textContent = `❌ Error al actualizar usuario: ${data.message || 'Error desconocido'}`;
            alertDiv.className = 'alert alert-danger';
        }

    } catch (error) {
        console.error("Error de red/conexión:", error);
        alertDiv.textContent = '❌ Error de conexión con el servidor.';
        alertDiv.className = 'alert alert-danger';
    } finally {
        alertDiv.classList.remove('d-none'); 
        this.disabled = false; 
    }
});


// ==============================================================================
// === LÓGICA DE ELIMINACIÓN DE USUARIO (CRUD - D) ===
// ==============================================================================

/**
 * Event Listener principal para los botones de la tabla (Eliminar/Editar).
 */
document.addEventListener('click', function(e) {
    
    // --- Lógica de ELIMINAR ---
    if (e.target.closest('.delete-user')) {
        const deleteButton = e.target.closest('.delete-user');
        const userId = deleteButton.getAttribute('data-id');
        const userName = deleteButton.getAttribute('data-name');
        
        if (userId && userName) {
            currentDeletingUserId = parseInt(userId, 10);
            document.getElementById('deleteUserName').textContent = userName;
            deleteUserModal.show();
        }
        
    }
    
    // --- Lógica de EDITAR (Ahora implementada) ---
    if (e.target.closest('.edit-user')) {
        const editButton = e.target.closest('.edit-user');
        const userId = editButton.getAttribute('data-id');
        
        if (userId) {
            currentEditingUserId = parseInt(userId, 10);
            // El modal se abre en el manejador 'show.bs.modal'
            // donde primero carga los estados y luego los datos.
            editUserModal.show(); 
        }
    }
});


/**
 * Maneja la confirmación de la eliminación (Reemplaza la lógica local).
 */
document.getElementById('confirmDeleteBtn').addEventListener('click', async function() {
    if (!currentDeletingUserId) return;

    this.disabled = true;
    this.textContent = 'Eliminando...';
    
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINT_USUARIOS}/${currentDeletingUserId}`, {
            method: 'DELETE',
        });

        if (response.status === 204) { // 204 No Content (Éxito en eliminación lógica)
            // No usamos alert() en producción, pero lo mantenemos por ahora
            alert(`✅ Usuario ID ${currentDeletingUserId} eliminado lógicamente (Estado Inactivo).`); 
            
            deleteUserModal.hide(); 
            initializeUsers(); 

        } else if (response.status === 404) {
            alert('❌ Error: El usuario no fue encontrado.');
        } else {
            alert('❌ Error al procesar la solicitud de eliminación.');
        }

    } catch (error) {
        console.error("Error de red/conexión:", error);
        alert('❌ Error de conexión con el servidor.');
    } finally {
        this.disabled = false;
        this.textContent = 'Eliminar Usuario';
        currentDeletingUserId = null; 
    }
});


// ==============================================================================
// === LÓGICA DE NAVEGACIÓN DE LA BARRA LATERAL (Solución al problema) ===
// ==============================================================================

/**
 * Función que maneja el cambio de sección.
 * @param {string} sectionId El ID de la sección a mostrar (e.g., 'usuarios').
 */
function switchSection(sectionId) {
    
    // 1. Ocultar todas las secciones de contenido y desactivar enlaces
    contentSections.forEach(section => {
        section.classList.remove('active');
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    // 2. Mostrar la sección deseada y activar el enlace
    const targetSection = document.getElementById(sectionId);
    const targetLink = document.querySelector(`.sidebar a[data-section="${sectionId}"]`);
    
    if (targetSection && targetLink) {
        targetSection.classList.add('active');
        targetLink.classList.add('active');
        
        // 3. Actualizar el título principal y subtítulo
        const titles = titleMap[sectionId] || titleMap['inicio'];
        mainTitle.innerHTML = titles.title;
        mainSubtitle.textContent = titles.subtitle;
        
        // 4. Si navegamos a la sección de Reportes, inicializamos los gráficos.
        if (sectionId === 'reportes') {
            initializeCharts();
        }
    } else {
        console.error(`Sección o enlace para ID '${sectionId}' no encontrado.`);
    }
}

// --------------------------------------------------------------------------------
// --- ASIGNACIÓN DE EVENTOS A LOS BOTONES DE NAVEGACIÓN ---
// --------------------------------------------------------------------------------

navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault(); 
        const sectionId = this.getAttribute('data-section');
        if (sectionId) {
            switchSection(sectionId);
        }
    });
});


// ==============================================================================
// === INICIALIZACIÓN DE GRÁFICOS (Se mantiene el esqueleto) ===
// ==============================================================================
const userGrowthCtxInicio = document.getElementById('userGrowthChartInicio').getContext('2d');
// ... CÓDIGO DEL GRÁFICO ...

let chartsInitialized = false;

function initializeCharts() {
    if (chartsInitialized) return;

    chartsInitialized = true;
    console.log("Gráficos inicializados.");
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    initializeUsers(); 
    
    // 5. Asegurar que la sección de Inicio esté activa al cargar
    switchSection('inicio'); 
});