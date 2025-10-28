// ==============================================================================
// === CONFIGURACIÓN DE LA API ===
// ==============================================================================
const API_URL_BASE = 'http://localhost:8080'; // <-- Ajusta el puerto si es diferente al 8080
const ENDPOINT_USUARIOS = '/api/admin/usuarios'; 
const ENDPOINT_ESTADOS = '/api/admin/estados-usuario'; 
const ENDPOINT_EXPORTAR = '/api/admin/usuarios/exportar'; // Nuevo ENDPOINT de Excel

// ==============================================================================
// === VARIABLES GLOBALES (ACTUALIZADO PARA PAGINACIÓN) ===
// ==============================================================================
let currentEditingUserId = null;
let currentDeletingUserId = null; 
const API_BASE_URL = API_URL_BASE; 

// NUEVAS VARIABLES PARA PAGINACIÓN Y FILTRADO
let currentPage = 1; // Página actual (siempre empieza en 1)
const ROWS_PER_PAGE = 10; // Número de usuarios por página (TU REQUISITO)
let currentStatusFilter = 'all'; // Estado del filtro ('all', 'active', 'inactive')
// Fin NUEVAS VARIABLES

// Referencias a modales de Bootstrap
const addUserModal = new bootstrap.Modal(document.getElementById('addUserModal'));
const deleteUserModal = new bootstrap.Modal(document.getElementById('deleteUserModal'));
const editUserModal = new bootstrap.Modal(document.getElementById('editUserModal')); 

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
// === LÓGICA DE CARGA DE DATOS DESDE EL BACKEND (REEMPLAZADO POR loadUsers) ===
// ==============================================================================

/**
 * Función principal de carga y filtrado (LLAMA AL BACKEND DE JAVA).
 * @param {number} page La página a cargar.
 * @param {string} status El filtro de estado ('all', 'active', 'inactive').
 */
async function loadUsers(page = 1, status = 'all') {
    // 1. Actualizar estado global
    currentPage = page;
    currentStatusFilter = status;

    const tbody = document.getElementById('tbodyUsuarios');
    const paginationContainer = document.getElementById('paginationUsers');
    
    // Limpiar tabla y mostrar mensaje de carga
    tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">Cargando usuarios...</td></tr>';
    if (paginationContainer) paginationContainer.innerHTML = '';

    // 2. Construir la URL con parámetros para el backend de Java
    // Se envía 'page', 'limit' (10) y 'status' al endpoint de Java
    const url = new URL(API_URL_BASE + ENDPOINT_USUARIOS, window.location.origin);
    url.searchParams.append('page', currentPage);
    url.searchParams.append('limit', ROWS_PER_PAGE);
    url.searchParams.append('status', currentStatusFilter); 

    try {
        // 3. Petición HTTP a tu API de Java
        const response = await fetch(url.toString());
        
        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
        }

        // El backend de Java DEBE devolver: { users: [/* ... */], totalCount: 96000 }
        const data = await response.json(); 

        // 4. Renderizar la tabla y la paginación
        renderUserTable(data.users, tbody); // Renderiza solo los 10 usuarios
        renderPagination(data.totalCount, ROWS_PER_PAGE, currentPage, paginationContainer);

        // 5. Actualizar los totales mostrados
        updateUserCountDisplay(data.totalCount, data.users.length);
        
    } catch (error) {
        console.error('Error al cargar los usuarios desde el backend de Java:', error);
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-danger">Error al cargar los datos.</td></tr>';
        updateUserCountDisplay(0, 0);
    }
}


// --------------------------------------------------------------------------------
// --- FUNCIONES DE RENDERIZADO Y UTILIDAD (MODIFICADO) ---
// --------------------------------------------------------------------------------

/**
 * Actualiza los contadores de la UI (Mostrando X-Y de Z).
 * @param {number} totalCount El total de usuarios en el backend.
 * @param {number} displayedCount El número de usuarios mostrados en la página actual.
 */
function updateUserCountDisplay(totalCount, displayedCount) {
    const totalUsersSpan = document.getElementById('totalUsers2');
    const countUsuariosSpan = document.getElementById('countUsuarios');
    
    const start = (currentPage - 1) * ROWS_PER_PAGE + 1;
    const end = Math.min(currentPage * ROWS_PER_PAGE, totalCount);

    if (totalUsersSpan) totalUsersSpan.textContent = totalCount.toLocaleString();
    
    // Este span ahora muestra el rango de usuarios (ej: 1 - 10)
    if (countUsuariosSpan) {
        if (totalCount === 0) {
             countUsuariosSpan.textContent = `0`;
        } else {
             countUsuariosSpan.textContent = `${start} - ${end}`;
        }
    }
    // Para el conteo total en la sección INICIO
    const totalUsersInicioSpan = document.getElementById('totalUsers');
    if (totalUsersInicioSpan) {
        totalUsersInicioSpan.textContent = totalCount.toLocaleString();
    }
}

/**
 * Renderiza la tabla de usuarios de la sección USUARIOS (solo la página actual).
 * @param {Array} usersToRender La lista de 10 usuarios de la página actual.
 * @param {HTMLElement} tbody El cuerpo de la tabla.
 */
function renderUserTable(usersToRender, tbody) {
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (!usersToRender || usersToRender.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No se encontraron usuarios con el estado seleccionado.</td></tr>';
        return;
    }

    // Ordenar los usuarios por ID de forma descendente (los más nuevos primero)
    const sortedUsers = [...usersToRender].sort((a, b) => (b.id || 0) - (a.id || 0));

    sortedUsers.forEach(user => {
        // Usamos la función existente para crear la fila
        tbody.appendChild(createUserRow(user, 'usuarios'));
    });
}


/**
 * Renderiza la tabla de usuarios de la sección INICIO (últimos 4).
 * NOTA: Esta función es un placeholder. La carga de datos para "Inicio"
 * idealmente debería ser con un endpoint separado que devuelva los 4 más recientes,
 * pero aquí usamos los 4 primeros de la lista paginada de la página 1.
 */
function renderInicioTable(usersPage1) {
    const tbodyInicio = document.getElementById('tbodyInicio');
    if (tbodyInicio) {
        tbodyInicio.innerHTML = '';
        const usersForInicio = [...usersPage1].slice(0, 4); 
        usersForInicio.forEach(user => {
            tbodyInicio.appendChild(createUserRow(user));
        });
        document.getElementById('countInicio').textContent = Math.min(4, usersPage1.length);
    }
}


/**
 * Función que crea una fila de usuario usando los campos de UsuarioResponse.java.
 */
function createUserRow(user, section = 'inicio') {
    const tr = document.createElement('tr');
    
    // Usamos los campos reales: nombre, apellidoPaterno, apellidoMaterno
    const nombreCompleto = `${user.nombre || ''} ${user.apellidoPaterno || ''} ${user.apellidoMaterno || ''}`.trim();
    const initials = nombreCompleto.split(' ').map(n => n[0]).join('').toUpperCase();
    
    const colors = ['var(--accent-3)', 'var(--accent)', 'var(--accent-4)', 'var(--muted)', '#3498db', '#e74c3c', '#2ecc71', '#9b59b6', '#f39c12', '#1abc9c'];
    const colorIndex = (user.id || 0) % colors.length;
    const bgColor = colors[colorIndex];
    
    // Suponiendo que el backend devuelve la fecha de registro
    const formattedDate = user.fechaRegistro ? new Date(user.fechaRegistro).toLocaleDateString() : "N/A";
    
    const estadoNombre = user.estadoUsuario ? user.estadoUsuario.nombreEstado : "Desconocido"; 
    const isPremium = estadoNombre.includes("Premium") ? 'bg-warning text-dark' : 'bg-light text-dark';
    
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
    <td><span class="badge rounded-pill ${isPremium}">${estadoNombre}</span></td>
    <td>${formattedDate}</td>
    <td class="text-end">
        <button class="btn btn-sm btn-light edit-user" data-id="${user.id}" title="Editar"><i class="bi bi-pencil"></i></button>
        <button class="btn btn-sm btn-light delete-user" data-id="${user.id}" data-name="${nombreCompleto}" title="Eliminar"><i class="bi bi-trash"></i></button>
    </td>
    `;
    
    return tr;
}


// =================================================================
// FUNCIÓN PARA GENERAR LOS BOTONES DE PAGINACIÓN (NUEVA)
// =================================================================
function renderPagination(totalCount, limit, currentPage, container) {
    if (!container) return;
    container.innerHTML = ''; // Limpiar botones anteriores
    const totalPages = Math.ceil(totalCount / limit);
    
    if (totalPages <= 1) return; // No mostrar paginación si solo hay 1 página

    // Función para crear un elemento de página (li)
    const createPageItem = (text, page, isDisabled, isActive) => {
        const li = document.createElement('li');
        li.className = `page-item ${isDisabled ? 'disabled' : ''} ${isActive ? 'active' : ''}`;
        
        const a = document.createElement('a');
        a.className = 'page-link';
        a.href = '#';
        a.textContent = text;
        
        if (!isDisabled && !isActive) {
            a.addEventListener('click', (e) => {
                e.preventDefault();
                // CRUCIAL: Llamamos a loadUsers con la nueva página y el filtro ACTUAL
                loadUsers(page, currentStatusFilter); 
            });
        }
        
        li.appendChild(a);
        return li;
    };

    // 1. Botón Anterior
    container.appendChild(
        createPageItem('Anterior', currentPage - 1, currentPage === 1, false)
    );

    // 2. Botones de Número (simplificación para mostrar un rango)
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) {
        endPage = Math.min(5, totalPages);
        startPage = 1;
    } else if (currentPage > totalPages - 2) {
        startPage = Math.max(1, totalPages - 4);
        endPage = totalPages;
    }
    
    for (let i = startPage; i <= endPage; i++) {
        container.appendChild(
            createPageItem(i, i, false, i === currentPage)
        );
    }

    // 3. Botón Siguiente
    container.appendChild(
        createPageItem('Siguiente', currentPage + 1, currentPage === totalPages, false)
    );
}

// ==============================================================================
// === LÓGICA DE EXPORTACIÓN A EXCEL (SE MANTIENE) ===
// ==============================================================================

/**
 * Llama al endpoint de Spring Boot, recibe el archivo binario (Blob) y fuerza la descarga.
 */
async function manejarExportacionExcel() {
    const exportButton = document.getElementById('exportBtnUsuarios'); 
    if (!exportButton) {
        console.error("Botón de exportar (ID 'exportBtnUsuarios') no encontrado.");
        return;
    }
    
    exportButton.disabled = true;
    const originalText = exportButton.innerHTML;
    exportButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Exportando...';
    
    try {
        const response = await fetch(API_BASE_URL + ENDPOINT_EXPORTAR, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error('Error al generar el archivo Excel: ' + response.statusText);
        }

        // Obtener el contenido del archivo como Blob
        const blob = await response.blob();
        
        // Obtener el nombre del archivo del encabezado 'Content-Disposition'
        const disposition = response.headers.get('Content-Disposition');
        let filename = 'usuarios_finli.xlsx'; // Nombre de archivo por defecto
        if (disposition && disposition.indexOf('attachment') !== -1) {
            const filenameRegex = /filename="?(.+?)"?$/;
            const matches = filenameRegex.exec(disposition);
            if (matches != null && matches[1]) {
                filename = matches[1].replace(/['"]/g, '');
            }
        }

        // Crear un link temporal para forzar la descarga
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        
        // Limpieza
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        alert(`✅ Archivo '${filename}' generado y descargado correctamente.`);

    } catch (error) {
        console.error("Fallo en la exportación a Excel:", error);
        alert('❌ Error al exportar los datos a Excel. Revisa la consola para más detalles.');
    } finally {
        exportButton.disabled = false;
        exportButton.innerHTML = originalText;
    }
}


// ==============================================================================
// === LÓGICA COMPARTIDA: ESTADOS DE USUARIO (SE MANTIENE) ===
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
        // Necesitamos tener una lista local de usuarios para rellenar
        // TEMPORAL: Esto asume que el usuario a editar está en la página actual.
        // La solución ideal es hacer un fetch a /api/usuarios/{id}
        const currentUsersData = await loadUsers(currentPage, currentStatusFilter);
        const user = currentUsersData.users.find(u => u.id === currentEditingUserId);
        cargarDatosUsuarioParaEdicion(user);
    });
}


// ==============================================================================
// === LÓGICA DE CREACIÓN, EDICIÓN Y ELIMINACIÓN (SE MANTIENE) ===
// ==============================================================================

// LÓGICA DE CREACIÓN (CRUD - C)
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
            loadUsers(1); // Volver a cargar la página 1 después de agregar
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


// LÓGICA DE ACTUALIZACIÓN (CRUD - U)
/**
 * Función que rellena el modal de edición con los datos del usuario.
 * @param {object} user El objeto usuario a cargar.
 */
function cargarDatosUsuarioParaEdicion(user) {
    if (!user) {
        console.error("Usuario no encontrado para editar:", currentEditingUserId);
        alert('Error: No se pudieron cargar los datos del usuario para editar.');
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
    
    // Mapeo de campos HTML a la estructura JSON esperada
    const usuarioActualizado = {
        id: userId, 
        nombre: form.editNombre.value,
        apellidoPaterno: form.editApellidoPaterno.value,
        apellidoMaterno: form.editApellidoMaterno.value,
        correo: form.editCorreo.value,
        edad: parseInt(form.editEdad.value, 10),
        estadoUsuario: { 
            idEstado: parseInt(form.editEstadoUsuarioId.value, 10) 
        }
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
            
            editUserModal.hide(); 
            loadUsers(currentPage, currentStatusFilter); // Recargar la página actual
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


// LÓGICA DE ELIMINACIÓN (CRUD - D)
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
            currentDeletingUserId = parseInt(userId, 1_0);
            document.getElementById('deleteUserName').textContent = userName;
            deleteUserModal.show();
        }
        
    }
    
    // --- Lógica de EDITAR ---
    if (e.target.closest('.edit-user')) {
        const editButton = e.target.closest('.edit-user');
        const userId = editButton.getAttribute('data-id');
        
        if (userId) {
            currentEditingUserId = parseInt(userId, 1_0);
            editUserModal.show(); 
            // La carga de datos real ocurre en el 'show.bs.modal'
        }
    }
});


/**
 * Maneja la confirmación de la eliminación (Llamada DELETE lógica).
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
            alert(`✅ Usuario ID ${currentDeletingUserId} eliminado lógicamente (Estado Inactivo).`); 
            
            deleteUserModal.hide(); 
            loadUsers(currentPage, currentStatusFilter); // Recargar la página actual

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
// === LÓGICA DE NAVEGACIÓN DE LA BARRA LATERAL (SE MANTIENE) ===
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

// El contexto del gráfico debe existir en admin.html
const userGrowthCtxInicio = document.getElementById('userGrowthChartInicio')?.getContext('2d');
// ... CÓDIGO DEL GRÁFICO ...

let chartsInitialized = false;

function initializeCharts() {
    if (chartsInitialized) return;

    chartsInitialized = true;
    console.log("Gráficos inicializados.");
}

// ==============================================================================
// === INICIALIZACIÓN DE LA APLICACIÓN Y ASIGNACIÓN DE EVENTOS (MODIFICADO) ===
// ==============================================================================

// Asignación de Evento al botón de exportar
const exportButtonListener = document.getElementById('exportBtnUsuarios');
if (exportButtonListener) {
    exportButtonListener.addEventListener('click', manejarExportacionExcel);
}

document.addEventListener('DOMContentLoaded', function() {
    
    // Asignación del Listener para el filtro de estado
    const filterElement = document.getElementById('userStatusFilter');
    if (filterElement) {
        filterElement.addEventListener('change', (event) => {
            const newStatus = event.target.value;
            // Cuando se filtra, SIEMPRE volvemos a la página 1
            loadUsers(1, newStatus); 
        });
    }

    // Asegurar que la sección de Inicio esté activa al cargar
    switchSection('inicio'); 
    
    // CRUCIAL: Llamar a loadUsers() para cargar la tabla de usuarios
    loadUsers(); 
});