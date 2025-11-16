// admin.js

// ==============================================================================
// === CONFIGURACIÓN DE LA API ===
// ==============================================================================
const API_URL_BASE = 'http://localhost:8080'; // <-- Ajusta el puerto si es diferente al 8080
const ENDPOINT_USUARIOS = '/api/admin/usuarios';
const ENDPOINT_ESTADOS = '/api/admin/estados-usuario';
const ENDPOINT_TIPOS_SUSCRIPCION = '/api/admin/tipos-suscripcion';
const ENDPOINT_EXPORTAR = '/api/admin/usuarios/exportar';
const ENDPOINT_CATEGORIAS = '/api/categorias'; // Ruta base de categorías
const ENDPOINT_SUBCATEGORIAS = '/api/categorias/subcategorias'; // Ruta para crear subcategorías

// ==============================================================================
// === VARIABLES GLOBALES ===
// ==============================================================================
let currentEditingUserId = null;
let currentDeletingUserId = null;
const API_BASE_URL = API_URL_BASE;

// Variables para PAGINACIÓN y FILTRADO
let currentPage = 1; 
const ROWS_PER_PAGE = 10; 
let currentSubscriptionFilter = 'all'; 
let currentUsersCache = []; // Caché de usuarios de la página actual para edición

// Referencias a modales de Bootstrap
const addUserModal = new bootstrap.Modal(document.getElementById('addUserModal'));
const deleteUserModal = new bootstrap.Modal(document.getElementById('deleteUserModal'));
const editUserModal = new bootstrap.Modal(document.getElementById('editUserModal'));
const userCustomizationModal = new bootstrap.Modal(document.getElementById('userCustomizationModal'));

// Referencias para la navegación y títulos
const contentSections = document.querySelectorAll('.content-section');
const mainTitle = document.getElementById('main-title');
const mainSubtitle = document.getElementById('main-subtitle');

// **ACTUALIZADO**: Mapa de títulos y subtítulos para las 5 secciones
const titleMap = {
    'inicio': { title: 'Bienvenido, <span class="text-gradient">Administrador</span>', subtitle: 'Panel de control' },
    'usuarios': { title: 'Gestión de Usuarios', subtitle: 'Administra y controla todos los usuarios del sistema FinLi' },
    'apartados': { title: 'Gestión de Apartados', subtitle: 'Configuración de categorías y medios de pago predeterminados' }, 
    'reportes': { title: 'Reportes Financieros', subtitle: 'Analiza el rendimiento y crecimiento de FinLi' },
    'actividades': { title: 'Historial de Actividades', subtitle: 'Revisa las operaciones y eventos del sistema' } 
};

// Asignar el año al footer
const yearSpan = document.getElementById('year');
if (yearSpan) yearSpan.textContent = new Date().getFullYear();


// ==============================================================================
// === LÓGICA PRINCIPAL DE USUARIOS (CARGA Y FILTRADO) ===
// ==============================================================================

/**
 * Función principal de carga y filtrado (LLAMA AL BACKEND DE JAVA).
 */
async function loadUsers(page = 1, subscriptionType = 'all', searchTerm = '') { 
    currentPage = page;
    currentSubscriptionFilter = subscriptionType;

    const tbody = document.getElementById('tbodyUsuarios');
    const paginationContainer = document.getElementById('paginationUsuarios');
    
    // Muestra el estado de carga
    if (tbody) tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Cargando usuarios...</td></tr>';
    if (paginationContainer) paginationContainer.innerHTML = '';

const url = new URL(API_URL_BASE + ENDPOINT_USUARIOS, window.location.origin);
    url.searchParams.append('page', currentPage);
    url.searchParams.append('limit', ROWS_PER_PAGE);
    url.searchParams.append('subscriptionType', currentSubscriptionFilter); 
    
    // --- NUEVA LÍNEA CLAVE ---
    if (searchTerm) {
        url.searchParams.append('searchTerm', searchTerm);
    }

    try {
        const response = await fetch(url.toString());
        
        if (!response.ok) {
             // Lanza el error para que sea capturado en el catch
            throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json(); 
        currentUsersCache = data.users || []; // **CORRECCIÓN**: Asegurar que los datos se guarden en caché
        
        // Renderizar elementos
        if (tbody) renderUserTable(data.users, tbody); 
        if (paginationContainer) renderPagination(data.totalCount, ROWS_PER_PAGE, currentPage, paginationContainer);
        updateUserCountDisplay(data.totalCount, data.users.length);

        // Si estamos en la página 1, cargamos la tabla de Inicio
        if (currentPage === 1) {
            renderInicioTable(data.users);
        }
        
    } catch (error) {
        console.error('Error al cargar los usuarios desde el backend de Java. Revisa CORS o el ENDPOINT:', error);
        if (tbody) tbody.innerHTML = '<tr><td colspan="6" class="text-center text-danger">Error al cargar los datos. Revisa la Consola (F12).</td></tr>';
        updateUserCountDisplay(0, 0);
        return { users: [], totalCount: 0 }; // Devuelve un objeto vacío para evitar errores en otras funciones
    }
    return { users: currentUsersCache, totalCount: currentUsersCache.length };
}


// --------------------------------------------------------------------------------
// --- FUNCIONES DE RENDERIZADO Y UTILIDAD ---
// --------------------------------------------------------------------------------

function updateUserCountDisplay(totalCount, displayedCount) {
    const totalUsersSpan = document.getElementById('totalUsers2');
    const countUsuariosSpan = document.getElementById('countUsuarios');
    const totalUsersTotalSpan = document.getElementById('totalUsers');
    
    const start = (currentPage - 1) * ROWS_PER_PAGE + 1;
    const end = Math.min(currentPage * ROWS_PER_PAGE, totalCount);

    if (totalUsersSpan) totalUsersSpan.textContent = totalCount.toLocaleString();
    if (totalUsersTotalSpan) totalUsersTotalSpan.textContent = totalCount.toLocaleString();
    
    if (countUsuariosSpan) {
        if (totalCount === 0) {
             countUsuariosSpan.textContent = `0`;
        } else {
             countUsuariosSpan.textContent = `${start} - ${end}`;
        }
    }
}

function renderUserTable(usersToRender, tbody) {
    if (!tbody) return;
    tbody.innerHTML = ''; 
    
    if (!usersToRender || usersToRender.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No se encontraron usuarios.</td></tr>';
        return;
    }

    const sortedUsers = [...usersToRender].sort((a, b) => (b.id || 0) - (a.id || 0));

    sortedUsers.forEach(user => {
        tbody.appendChild(createUserRow(user, 'usuarios'));
    });
}

function renderInicioTable(usersPage1) {
    const tbodyInicio = document.getElementById('tbodyInicio');
    if (tbodyInicio) {
        tbodyInicio.innerHTML = '';
        const usersForInicio = [...usersPage1].slice(0, 4); 
        
        if (usersForInicio.length === 0) {
            tbodyInicio.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No hay usuarios recientes.</td></tr>';
        } else {
             usersForInicio.forEach(user => {
                tbodyInicio.appendChild(createUserRow(user, 'inicio')); 
            });
        }
        
        const countInicioSpan = document.getElementById('countInicio');
        if(countInicioSpan) countInicioSpan.textContent = usersForInicio.length;
    }
}


/**
 * Crea una fila de usuario (ACTUALIZADO para 6 columnas del HTML del compañero).
 */
function createUserRow(user, section = 'inicio') {
    const tr = document.createElement('tr');
    
    const nombreCompleto = `${user.nombre || ''} ${user.apellidoPaterno || ''} ${user.apellidoMaterno || ''}`.trim();
    const initials = nombreCompleto.split(/\s+/).map(n => n.charAt(0)).join('').toUpperCase();
    
    const colors = ['#20c997', '#0d6efd', '#ffc107', '#adb5bd', '#e74c3c', '#2ecc71', '#9b59b6'];
    const colorIndex = (user.id || 0) % colors.length;
    const bgColor = colors[colorIndex];
    
    const subscriptionType = user.estadoUsuario ? user.estadoUsuario.nombreEstado : "Sin suscripción"; 
    
    let badgeClass = 'bg-secondary';
    if (subscriptionType.includes('Mensual')) badgeClass = 'bg-primary';
    else if (subscriptionType.includes('Anual')) badgeClass = 'bg-warning text-dark';
    else if (subscriptionType.includes('vida')) badgeClass = 'bg-info';
    
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
    <td><span class="badge rounded-pill ${badgeClass}">${subscriptionType}</span></td>
    <td class="text-center">
        <button class="btn btn-sm btn-outline-info customization-user" data-id="${user.id}" title="Personalizar"><i class="bi bi-person-gear"></i></button>
        <button class="btn btn-sm btn-outline-secondary edit-user" data-id="${user.id}" title="Editar"><i class="bi bi-pencil"></i></button>
        <button class="btn btn-sm btn-outline-danger delete-user" data-id="${user.id}" data-name="${nombreCompleto}" title="Eliminar"><i class="bi bi-trash"></i></button>
    </td>
    `;
    
    return tr;
}


// =================================================================
// FUNCIÓN PARA GENERAR LOS BOTONES DE PAGINACIÓN 
// =================================================================
function renderPagination(totalCount, limit, currentPage, container) {
    if (!container) return;
    container.innerHTML = ''; 
    const totalPages = Math.ceil(totalCount / limit);
    
    if (totalPages <= 1) return; 

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
                loadUsers(page, currentSubscriptionFilter); 
            });
        }
        
        li.appendChild(a);
        return li;
    };

    container.appendChild(
        createPageItem('Anterior', currentPage - 1, currentPage === 1, false)
    );

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

    container.appendChild(
        createPageItem('Siguiente', currentPage + 1, currentPage === totalPages, false)
    );
}

// ==============================================================================
// === LÓGICA DE EXPORTACIÓN A EXCEL (APACHE POI) ===
// ==============================================================================

async function manejarExportacionExcel() {
    const exportButton = document.getElementById('exportBtnUsuarios'); 
    
    if (!exportButton) {
         // Intenta usar el botón de exportación de la sección Inicio, si existe
        const exportButtonInicio = document.getElementById('exportBtnInicio');
        if (exportButtonInicio) {
            exportButton = exportButtonInicio;
        } else {
            console.error("Botón de exportar no encontrado (IDs: 'exportBtnUsuarios' o 'exportBtnInicio').");
            alert('❌ Error: El botón de exportar no se encontró.');
            return;
        }
    }
    
    exportButton.disabled = true;
    const originalText = exportButton.innerHTML;
    exportButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Exportando...';
    
    try {
        // La URL debe ser el ENDPOINT que maneja Apache POI y devuelve el archivo
        const response = await fetch(API_BASE_URL + ENDPOINT_EXPORTAR, { method: 'GET' });

        if (!response.ok) {
            throw new Error('Error al generar el archivo Excel: ' + response.statusText);
        }

        const blob = await response.blob();
        
        const disposition = response.headers.get('Content-Disposition');
        let filename = 'usuarios_finli.xlsx'; 
        if (disposition && disposition.indexOf('attachment') !== -1) {
            const filenameRegex = /filename="?(.+?)"?$/;
            const matches = filenameRegex.exec(disposition);
            if (matches != null && matches[1]) {
                filename = matches[1].replace(/['"]/g, '');
            }
        }

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        alert(`✅ Archivo '${filename}' generado y descargado correctamente.`);

    } catch (error) {
        console.error("Fallo en la exportación a Excel. Revisa el backend (Apache POI):", error);
        alert('❌ Error al exportar los datos a Excel. Revisa la consola para más detalles.');
    } finally {
        exportButton.disabled = false;
        exportButton.innerHTML = originalText;
    }
}


// ==============================================================================
// === LÓGICA DE ESTADOS Y CRUD (MANTENIDA) ===
// ==============================================================================

async function cargarEstadosUsuario(selectId) {
    const selectElement = document.getElementById(selectId);
    if (!selectElement) return;
    
    selectElement.innerHTML = '<option value="">Cargando...</option>';

    try {
        const response = await fetch(API_BASE_URL + ENDPOINT_ESTADOS);
        if (!response.ok) throw new Error('Error al obtener estados: ' + response.statusText);

        const estados = await response.json();
        
        selectElement.innerHTML = '<option value="">-- Seleccione un Tipo de Suscripción --</option>'; 
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

// ... (Despues de la funcion cargarEstadosUsuario) ...

/**
 * Llama al backend para obtener la lista de Tipos de Suscripción 
 * (Gratuito, Mensual, Anual, De por vida) y pobla el select de edición.
 */
async function cargarTiposSuscripcion(selectId) {
    const selectElement = document.getElementById(selectId);
    if (!selectElement) return;
    
    selectElement.innerHTML = '<option value="">Cargando tipos de suscripción...</option>';

    try {
        const response = await fetch(API_BASE_URL + ENDPOINT_TIPOS_SUSCRIPCION);
        if (!response.ok) throw new Error('Error al obtener tipos de suscripción: ' + response.statusText);

        const tiposSuscripcion = await response.json();
        
        selectElement.innerHTML = '<option value="">-- Seleccione Tipo de Suscripción --</option>'; 
        tiposSuscripcion.forEach(tipo => {
            const option = document.createElement('option');
            // GARANTIZAMOS que el valor sea una CADENA, aunque el ID sea un número
            option.value = String(tipo.idTipoSuscripcion); // <--- CLAVE
            option.textContent = tipo.nombreTipoSuscripcion;
            selectElement.appendChild(option);
        });

    } catch (error) {
        console.error("Error al cargar tipos de suscripción:", error);
        selectElement.innerHTML = '<option value="">Error de carga</option>';
    }
}

const editUserModalElement = document.getElementById('editUserModal');
if (editUserModalElement) {
    // Al abrir el modal
    editUserModalElement.addEventListener('show.bs.modal', async () => {
        // 1. Cargar la lista de ESTADOS (Activo/Desactivado)
        await cargarEstadosUsuario('editUserEstadoUsuario'); 
        // 2. Cargar la lista de TIPOS DE SUSCRIPCIÓN
        await cargarTiposSuscripcion('editUserTipoSuscripcion'); 
        
        // --- SOLUCIÓN DE LECTURA ASÍNCRONA ---
        // Se asume que loadUsers ha recargado currentUsersCache con el dato más reciente
        
        setTimeout(() => {
            const user = currentUsersCache.find(u => u.id === currentEditingUserId);
            if (user) {
                cargarDatosUsuarioParaEdicion(user);
            } else {
                 console.error(`Usuario ID ${currentEditingUserId} no encontrado en la caché. Imposible pre-seleccionar datos.`);
            }
        }, 0); 
        // ----------------------------------------------
    });
}

// ... (código anterior se mantiene)

document.getElementById('saveUserBtn').addEventListener('click', async function() {
    const form = document.getElementById('addUserForm');
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // 1. Recolección de valores del formulario
    const estadoUsuarioId = parseInt(document.getElementById('userEstadoUsuario').value, 10);
    const tipoSuscripcionId = parseInt(document.getElementById('userTipoSuscripcion').value, 10);

    // 2. Construcción del DTO de Creación (Usuario)
    const nuevoCliente = {
        nombre: document.getElementById('userName').value, 
        apellidoPaterno: document.getElementById('userApellidoPaterno').value, // <-- NUEVO
        apellidoMaterno: document.getElementById('userApellidoMaterno').value, // <-- NUEVO
        correo: document.getElementById('userEmail').value, 
        contrasena: document.getElementById('userPassword').value, // Obligatoria al crear
        edad: parseInt(document.getElementById('userEdad').value, 10), // <-- NUEVO
        fechaRegistro: document.getElementById('userRegistrationDate').value, 
        
        // Estado Activo/Inactivo
        estadoUsuario: { 
             idEstado: estadoUsuarioId 
        },

        // Campo auxiliar, usado en el controlador para mapear contrasena
        nuevaContrasena: document.getElementById('userPassword').value, 
        
        // Campo auxiliar para la suscripción inicial
        nuevoTipoSuscripcionId: tipoSuscripcionId // Enviamos el ID para que el backend lo maneje

    };
    
    this.disabled = true; 
    
    try {
        // Envíamos el DTO de Usuario, que ahora tiene el campo auxiliar de suscripción
        const response = await fetch(API_BASE_URL + ENDPOINT_USUARIOS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoCliente)
        });

        const data = await response.json();

        if (response.status === 201) { 
            alert(`✅ Cliente ${data.nombre} agregado con ID: ${data.id}.`);
            form.reset(); 
            addUserModal.hide(); 
            // Recargar la tabla en la página 1 para ver el nuevo usuario
            loadUsers(1); 
        } else {
            alert(`❌ Error al crear cliente: ${data.message || 'Error desconocido'}`);
        }

    } catch (error) {
        console.error("Error de red/conexión:", error);
        alert('❌ Error de conexión con el servidor.');

    } finally {
        this.disabled = false; 
    }
});


// ... (código anterior se mantiene)

function cargarDatosUsuarioParaEdicion(user) {
    if (!user) return;
    
    // Rellenamos el campo oculto con el ID para la actualización
    document.getElementById('editUserIdHidden').value = user.id || ''; 
    
    // 1. Relleno de los campos de datos personales
    document.getElementById('editUserName').value = user.nombre || ''; 
    document.getElementById('editUserApellidoPaterno').value = user.apellidoPaterno || ''; 
    document.getElementById('editUserApellidoMaterno').value = user.apellidoMaterno || ''; 
    document.getElementById('editUserEdad').value = user.edad || ''; 
    
    // Correo, Fecha de Registro y Contraseña (Se mantienen)
    document.getElementById('editUserEmail').value = user.correo || '';
    document.getElementById('editUserRegistrationDate').value = user.fechaRegistro ? user.fechaRegistro.split('T')[0] : ''; 
    document.getElementById('editUserPassword').value = ''; // Siempre vacía

    // 1. Relleno del ESTADO DE USUARIO (Activo/Desactivado)
    const estadoUsuarioId = user.estadoUsuario ? user.estadoUsuario.idEstado : null;
    const selectEstadoUsuario = document.getElementById('editUserEstadoUsuario');
    if (estadoUsuarioId) {
        selectEstadoUsuario.value = String(estadoUsuarioId); // <--- DEBE SER STRING()
    } else {
        selectEstadoUsuario.selectedIndex = 0;
    }

    // 2. Relleno del TIPO DE SUSCRIPCIÓN 
    const suscripcionActual = user.suscripcionActual || {};
    const idPlanActual = suscripcionActual.idTipoSuscripcion;

    const selectTipoSuscripcion = document.getElementById('editUserTipoSuscripcion');

    if (idPlanActual) {
        selectTipoSuscripcion.value = String(idPlanActual); // <--- DEBE SER STRING()
    } else {
        selectTipoSuscripcion.selectedIndex = 0; 
    }

}

// ... (alrededor de la línea 287 en tu admin.js)

document.getElementById('updateUserBtn').addEventListener('click', async function() {
    const form = document.getElementById('editUserForm');
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // 1. Obtener el ID del campo oculto
    const userId = document.getElementById('editUserIdHidden').value || currentEditingUserId; 
    
    // 2. Recolección de valores de los 5 nuevos/modificados campos
    const newPassword = document.getElementById('editUserPassword').value; 
    const estadoUsuarioId = parseInt(document.getElementById('editUserEstadoUsuario').value, 10);
    const tipoSuscripcionId = parseInt(document.getElementById('editUserTipoSuscripcion').value, 10);

    // 3. Construcción del DTO de Actualización
    const usuarioActualizado = {
        id: userId, 
        
        // Datos personales (los 5 nuevos/modificados)
        nombre: document.getElementById('editUserName').value,
        apellidoPaterno: document.getElementById('editUserApellidoPaterno').value,
        apellidoMaterno: document.getElementById('editUserApellidoMaterno').value,
        edad: parseInt(document.getElementById('editUserEdad').value, 10),
        
        // Campos que ya existían
        correo: document.getElementById('editUserEmail').value,
        fechaRegistro: document.getElementById('editUserRegistrationDate').value,
        
        // Estado Activo/Inactivo
        estadoUsuario: { 
             idEstado: estadoUsuarioId
        },
        
        // Contraseña y Tipo de Suscripción (Auxiliares)
        nuevaContrasena: newPassword || null,
        nuevoTipoSuscripcionId: tipoSuscripcionId
    };
    
    this.disabled = true; 
    
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINT_USUARIOS}/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(usuarioActualizado)
        });

        if (response.ok) { 
            alert(`✅ Usuario ID ${userId} actualizado correctamente.`);
            
            // --- CAMBIO CLAVE: FORZAR RECARGA ANTES DE CERRAR EL MODAL ---
            // Esto asegura que currentUsersCache tenga los datos frescos
            await loadUsers(currentPage, currentSubscriptionFilter); 
            
            editUserModal.hide(); 
        } else if (response.status === 404) {
            alert(`❌ Error: Usuario ID ${userId} no encontrado.`);
        } else {
            const data = await response.json();
            alert(`❌ Error al actualizar usuario: ${data.message || 'Error desconocido'}`);
        }

    } catch (error) {
        console.error("Error de red/conexión:", error);
        alert('❌ Error de conexión con el servidor.');
    } finally {
        this.disabled = false; 
    }
});;

document.addEventListener('click', function(e) {
    
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
    
    if (e.target.closest('.edit-user')) {
        const editButton = e.target.closest('.edit-user');
        const userId = editButton.getAttribute('data-id');
        
        if (userId) {
            currentEditingUserId = parseInt(userId, 10);
            editUserModal.show(); 
        }
    }
    
    if (e.target.closest('.customization-user')) {
        const customizationButton = e.target.closest('.customization-user');
        const userId = customizationButton.getAttribute('data-id');
        if (userId) {
            const user = currentUsersCache.find(u => u.id === parseInt(userId));
            if(user) {
                document.getElementById('modalUserName').textContent = user.nombre || 'N/A';
                document.getElementById('modalUserEmail').textContent = user.correo || 'N/A';
                document.getElementById('modalUserSubscription').textContent = user.estadoUsuario ? user.estadoUsuario.nombreEstado : 'N/A';
                document.getElementById('modalUserAvatar').textContent = user.nombre.charAt(0).toUpperCase();
            }
            userCustomizationModal.show();
        }
    }
});


document.getElementById('confirmDeleteBtn').addEventListener('click', async function() {
    if (!currentDeletingUserId) return;

    this.disabled = true;
    this.textContent = 'Eliminando...';
    
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINT_USUARIOS}/${currentDeletingUserId}`, {
            method: 'DELETE',
        });

        if (response.status === 204) { 
            alert(`✅ Usuario ID ${currentDeletingUserId} eliminado lógicamente (Estado Inactivo).`); 
            
            deleteUserModal.hide(); 
            loadUsers(currentPage, currentSubscriptionFilter); 

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
// === LÓGICA DE NAVEGACIÓN Y CARGA DE SECCIONES ===
// ==============================================================================

function switchSection(sectionId) {
    
    contentSections.forEach(section => {
        section.classList.remove('active');
    });
    document.querySelectorAll('.sidebar .nav-link').forEach(link => {
        link.classList.remove('active');
    });

    const targetSection = document.getElementById(sectionId);
    const targetLink = document.querySelector(`.sidebar a[data-section="${sectionId}"]`);
    
    if (targetSection && targetLink) {
        targetSection.classList.add('active');
        targetLink.classList.add('active');
        
        const titles = titleMap[sectionId] || titleMap['inicio'];
        mainTitle.innerHTML = titles.title;
        mainSubtitle.textContent = titles.subtitle;
        
        // Cargar datos específicos al cambiar de sección
        if (sectionId === 'usuarios') {
            loadUsers(1, currentSubscriptionFilter); 
        } else if (sectionId === 'reportes') {
            initializeCharts();
        } else if (sectionId === 'apartados') {
            // Lógica para cargar categorías, subcategorías y medios de pago predeterminados
            console.log('Cargando datos de Apartados (Gestión de contenido)...');
            // 💡 LLAMADA CRÍTICA: Se llama a la función para cargar y mostrar las categorías
            cargarCategoriasDefault(); 
        } else if (sectionId === 'actividades') {
            // Lógica para cargar el timeline de actividades
            console.log('Cargando Historial de Actividades...');
        }
    }
}

function initializeCharts() {
    console.log("Gráficos de Reportes inicializados. (Lógica de Chart.js pendiente)");
}


// ==============================================================================
// === INICIALIZACIÓN DE LA APLICACIÓN Y ASIGNACIÓN DE EVENTOS ===
// ==============================================================================

// ... (código anterior se mantiene)

// Listener para el botón "Agregar Usuario" que abre el modal
const addUserBtn = document.getElementById('addUserModalBtn'); // Asegúrate que tu botón tenga este ID, o usa 'addUserBtn' si es el caso.
if (addUserBtn) {
    addUserBtn.addEventListener('click', () => {
        // Al hacer clic, simplemente mostramos el modal.
        addUserModal.show(); 
    });
}

// Listener para el MODAL de Agregar Usuario que carga las opciones (¡AQUÍ ESTÁ LA CLAVE!)
const addUserModalElement = document.getElementById('addUserModal');
if (addUserModalElement) {
    // Escucha el evento que Bootstrap dispara justo ANTES de mostrar el modal.
    addUserModalElement.addEventListener('show.bs.modal', async () => {
        // 1. Cargar la lista de ESTADOS (Activo/Desactivado)
        await cargarEstadosUsuario('userEstadoUsuario'); // ID de SELECT del modal Agregar
        // 2. Cargar la lista de TIPOS DE SUSCRIPCIÓN
        await cargarTiposSuscripcion('userTipoSuscripcion'); // ID de SELECT del modal Agregar
        
        // Opcional: Establecer la fecha de registro actual por defecto
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('userRegistrationDate').value = today;
    });
    
    // Listener para limpiar campos al cerrar
    addUserModalElement.addEventListener('hide.bs.modal', () => {
        document.getElementById('addUserForm').reset();
        document.getElementById('userPassword').value = ''; 
    });
}

// ==============================================================================
// === LÓGICA DE CATEGORÍAS Y SUBCATEGORÍAS (SECCIÓN APARTADOS) ===
// ==============================================================================

// Nota: El ADMIN_EMAIL solo se usará para los métodos POST (Creación), no para la carga base.
const ADMIN_EMAIL = 'admin@finli.com'; // O la forma real de obtener el email de sesión

/**
 * 1. Carga las categorías existentes con id_usuario=NULL (base) para listarlas y llenar los selects.
 */
async function cargarCategoriasDefault(selectId = null) {
    const defaultCategoriesList = document.getElementById('defaultCategoriesList');
    
    // Limpiar listas y selects
    if (defaultCategoriesList) defaultCategoriesList.innerHTML = '';
    
    const selectElement = selectId ? document.getElementById(selectId) : null;
    if (selectElement) {
        selectElement.innerHTML = '<option value="" disabled selected>Cargando...</option>';
    }

    try {
        // 💡 CAMBIO CRÍTICO: Usamos el endpoint /api/categorias/base que no requiere email, 
        // y devuelve categorías con id_usuario = NULL.
        const response = await fetch(`${API_URL_BASE}${ENDPOINT_CATEGORIAS}/base`);
        
        if (!response.ok) {
            throw new Error('Error al obtener categorías base: ' + response.statusText);
        }
        
        const categorias = await response.json();

        // 1. Llenar el Dropdown (para el modal de Subcategoría)
        if (selectElement) {
            selectElement.innerHTML = '<option value="" disabled selected>-- Seleccione Categoría Padre --</option>';
            categorias.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.idCategoria;
                option.textContent = cat.nombreCategoria;
                selectElement.appendChild(option);
            });
        }
        
        // 2. Renderizar la lista en la sección "Apartados"
        if (defaultCategoriesList) {
            if (categorias.length === 0) {
                defaultCategoriesList.innerHTML = '<div class="alert alert-info">No hay categorías base registradas.</div>';
            } else {
                defaultCategoriesList.innerHTML = '';
                categorias.forEach(cat => {
                    const item = document.createElement('a');
                    item.className = 'list-group-item list-group-item-action d-flex justify-content-between align-items-center';
                    item.innerHTML = `
                        <span class="d-flex align-items-center gap-2">
                             <i class="bi bi-tag-fill"></i>
                             ${cat.nombreCategoria}
                        </span>
                        <span class="badge bg-secondary rounded-pill">${cat.subcategorias ? cat.subcategorias.length : 0} Subcategorías</span>
                    `;
                    defaultCategoriesList.appendChild(item);
                });
            }
        }
        
        return categorias;

    } catch (error) {
        console.error("Error al cargar categorías/subcategorías:", error);
        if (selectElement) selectElement.innerHTML = '<option value="">Error de carga</option>';
        if (defaultCategoriesList) defaultCategoriesList.innerHTML = '<div class="alert alert-danger">Error al cargar categorías. Revisa la consola.</div>';
    }
}


/**
 * 2. Prepara y muestra el modal para agregar Categoría.
 */
function showAddCategoryModal() {
    const categoryModal = new bootstrap.Modal(document.getElementById('categoryModal'));
    document.getElementById('categoryModalLabel').textContent = 'Agregar Nueva Categoría';
    document.getElementById('categoryForm').reset();
    
    // Ocultar el campo de icono si no se usa realmente en el DTO de creación
    // Si usas el icono en tu DTO (que no lo incluimos, solo nombre), deberías ajustarlo
    document.getElementById('categoryIcon').parentNode.style.display = 'none';

    categoryModal.show();
}

/**
 * 3. Prepara y muestra el modal para agregar Subcategoría.
 */
async function showAddSubcategoryModal() {
    const subcategoryModal = new bootstrap.Modal(document.getElementById('subcategoryModal'));
    document.getElementById('subcategoryModalLabel').textContent = 'Agregar Nueva Subcategoría';
    document.getElementById('subcategoryForm').reset();
    
    // ⚠️ CRÍTICO: Cargar las categorías en el select 'parentCategory'
    await cargarCategoriasDefault('parentCategory');

    // Ocultar el campo de icono si no se usa realmente
    document.getElementById('subcategoryIcon').parentNode.style.display = 'none';

    subcategoryModal.show();
}


/**
 * 4. Maneja el envío del formulario para crear una Categoría.
 */
async function manejarCreacionCategoria() {
    const saveBtn = document.getElementById('saveCategoryBtn');
    const form = document.getElementById('categoryForm');
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const nombreCategoria = document.getElementById('categoryName').value;
    
    // DTO: CrearCategoriaRequest.java
    const data = {
        nombreCategoria: nombreCategoria,
        // Usamos el ID de un usuario administrador/base (ej: 1) o null si el backend lo permite.
        // Como tu Controller exige el email para obtener el ID, lo dejamos simple aquí:
        // El Controller se encargará de obtener el ID a partir de ADMIN_EMAIL.
    };

    saveBtn.disabled = true;
    const originalText = saveBtn.textContent;
    saveBtn.textContent = 'Guardando...';

    try {
        // POST /api/categorias?email=admin@finli.com
        const response = await fetch(`${API_URL_BASE}${ENDPOINT_CATEGORIAS}?email=${ADMIN_EMAIL}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.status === 201) {
            alert(`✅ Categoría "${nombreCategoria}" creada con éxito.`);
            form.reset();
            new bootstrap.Modal(document.getElementById('categoryModal')).hide();
            cargarCategoriasDefault(); // Recargar la lista de categorías en la sección
        } else {
            const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
            alert(`❌ Error al crear categoría: ${errorData.message || response.statusText}`);
        }
    } catch (error) {
        console.error('Error de red:', error);
        alert('❌ Error de conexión con el servidor.');
    } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = originalText;
    }
}

/**
 * 5. Maneja el envío del formulario para crear una Subcategoría.
 */
async function manejarCreacionSubcategoria() {
    const saveBtn = document.getElementById('saveSubcategoryBtn');
    const form = document.getElementById('subcategoryForm');
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const idCategoria = document.getElementById('parentCategory').value;
    const nombreSubcategoria = document.getElementById('subcategoryName').value;

    // DTO: CrearSubcategoriaRequest.java
    const data = {
        nombreSubcategoria: nombreSubcategoria,
        idCategoria: parseInt(idCategoria, 10), // Convertir a número
        // El Controller se encarga de obtener el idUsuario
    };

    saveBtn.disabled = true;
    const originalText = saveBtn.textContent;
    saveBtn.textContent = 'Guardando...';

    try {
        // POST /api/categorias/subcategorias?email=admin@finli.com
        const response = await fetch(`${API_URL_BASE}${ENDPOINT_SUBCATEGORIAS}?email=${ADMIN_EMAIL}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.status === 201) {
            alert(`✅ Subcategoría "${nombreSubcategoria}" creada con éxito.`);
            form.reset();
            new bootstrap.Modal(document.getElementById('subcategoryModal')).hide();
            cargarCategoriasDefault(); // Recargar la lista de categorías para actualizar los contadores
        } else {
            const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
            alert(`❌ Error al crear subcategoría: ${errorData.message || response.statusText}`);
        }
    } catch (error) {
        console.error('Error de red:', error);
        alert('❌ Error de conexión con el servidor.');
    } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = originalText;
    }
}

// ... (El resto de tu código comienza con document.addEventListener('DOMContentLoaded', function() { ... )

document.addEventListener('DOMContentLoaded', function() {

    // Asignación del Listener para la Barra de Búsqueda (Sección Usuarios)
    const searchInput = document.getElementById('searchUsersInput');
    if (searchInput) {
        let searchTimer; // Para evitar saturar el servidor con peticiones (Debounce)
        
        searchInput.addEventListener('input', (event) => {
            clearTimeout(searchTimer);
            const newSearchTerm = event.target.value.trim();
            
            // Esperar 300ms después de que el usuario deja de escribir
            searchTimer = setTimeout(() => {
                // Reinicia la paginación a la página 1 al buscar
                loadUsers(1, currentSubscriptionFilter, newSearchTerm); 
            }, 300); 
        });
    }
    
    const navLinks = document.querySelectorAll('.sidebar .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); 
            const sectionId = this.getAttribute('data-section');
            if (sectionId) {
                switchSection(sectionId);
            }
        });
    });

    // Asignación del Listener para el filtro de Tipo de Suscripción (Sección Usuarios)
    const subscriptionFilterElement = document.getElementById('subscriptionFilter');
    if (subscriptionFilterElement) {
        subscriptionFilterElement.addEventListener('change', (event) => {
            const newSubscriptionType = event.target.value;
            loadUsers(1, newSubscriptionType); 
        });
    }
    
    // Asignación de Evento al botón de exportar de la sección Usuarios
    const exportButtonListener = document.getElementById('exportBtnUsuarios');
    if (exportButtonListener) {
        exportButtonListener.addEventListener('click', manejarExportacionExcel);
    }
    
    // Asignación de Evento al botón de exportar de la sección Inicio (si existe)
    const exportButtonInicioListener = document.getElementById('exportBtnInicio');
    if (exportButtonInicioListener) {
        exportButtonInicioListener.addEventListener('click', manejarExportacionExcel);
    }


    // 1. Asegurar que la sección de Inicio esté activa al cargar
    switchSection('inicio'); 
    
    // 2. Cargar los datos iniciales
    loadUsers(); 

    // =======================================================
    // === LISTENERS para Categorías y Subcategorías ===
    // =======================================================
    
    // 1. Botones de la sección "Apartados" (para abrir los modales)
    const addCategoryBtn = document.querySelector('#apartados button.btn-success[onclick="showAddCategoryModal()"]');
    if (addCategoryBtn) {
        addCategoryBtn.onclick = showAddCategoryModal;
    }

    const addSubcategoryBtn = document.querySelector('#apartados button.btn-success[onclick="showAddSubcategoryModal()"]');
    if (addSubcategoryBtn) {
        addSubcategoryBtn.onclick = showAddSubcategoryModal;
    }
    
    // 2. Botón de GUARDAR CATEGORÍA del modal
    const saveCategoryBtn = document.getElementById('saveCategoryBtn');
    if (saveCategoryBtn) {
        saveCategoryBtn.addEventListener('click', manejarCreacionCategoria);
    }

    // 3. Botón de GUARDAR SUBCATEGORÍA del modal
    const saveSubcategoryBtn = document.getElementById('saveSubcategoryBtn');
    if (saveSubcategoryBtn) {
        saveSubcategoryBtn.addEventListener('click', manejarCreacionSubcategoria);
    }
    
    // ... (El resto de tu código DOMContentLoaded)

    // 1. Asegurar que la sección de Inicio esté activa al cargar
    switchSection('inicio'); 
    
    // 2. Cargar los datos iniciales
    loadUsers(); 
});

