// Variables globales
let users = [];
let activities = [];
let currentEditingUserId = null;
let currentDeletingUserId = null;
let currentViewingUserId = null;
let chartsInitialized = false;

// Variables para paginación
let currentPageInicio = 1;
const usersPerPageInicio = 3;
let currentPageUsuarios = 1;
const usersPerPageUsuarios = 10;

// Variables para búsqueda y filtros
let searchUsersInput = '';
let subscriptionFilterValue = 'all';

// Variables para gestión de categorías
let defaultCategories = [];
let defaultSubcategories = {};
let currentEditingCategoryId = null;
let currentEditingSubcategoryId = null;
let currentEditingPaymentMethod = null;

// Categorías y subcategorías del sistema usuario
const userCategoriesMap = {
    vivienda: {
        label: 'Vivienda',
        icon: 'bi-house',
        color: 'success',
        subcategories: [
            { name: 'alquiler', icon: 'bi-door-open', label: 'Alquiler' },
            { name: 'hipoteca', icon: 'bi-bank', label: 'Hipoteca' },
            { name: 'servicios', icon: 'bi-gear', label: 'Servicios' },
            { name: 'internet', icon: 'bi-wifi', label: 'Internet' },
            { name: 'agua', icon: 'bi-droplet-half', label: 'Agua' },
            { name: 'luz', icon: 'bi-lightning-charge', label: 'Luz' },
            { name: 'gas', icon: 'bi-fire', label: 'Gas' },
            { name: 'telefono', icon: 'bi-telephone', label: 'Teléfono' },
            { name: 'mantenimiento', icon: 'bi-gear-wide', label: 'Mantenimiento' },
            { name: 'reparaciones', icon: 'bi-tools', label: 'Reparaciones' },
            { name: 'seguro', icon: 'bi-house-heart', label: 'Seguro de Vivienda' }
        ]
    },
    transporte: {
        label: 'Transporte',
        icon: 'bi-car-front',
        color: 'primary',
        subcategories: [
            { name: 'combustible', icon: 'bi-fuel-pump', label: 'Combustible' },
            { name: 'gasolina', icon: 'bi-fuel-pump-fill', label: 'Gasolina' },
            { name: 'diésel', icon: 'bi-fuel-pump-diesel', label: 'Diésel' },
            { name: 'transpPúblico', icon: 'bi-bus-front', label: 'Transporte Público' },
            { name: 'busInterprovincial', icon: 'bi-bus-front-fill', label: 'Bus Interprovincial' },
            { name: 'tren', icon: 'bi-train-front', label: 'Tren' },
            { name: 'taxis', icon: 'bi-car-front', label: 'Taxis' },
            { name: 'mantenimiento', icon: 'bi-tools', label: 'Mantenimiento' },
            { name: 'reparaciones', icon: 'bi-wrench', label: 'Reparaciones' },
            { name: 'seguro', icon: 'bi-shield-lock', label: 'Seguro' },
            { name: 'estacionamiento', icon: 'bi-house-lock', label: 'Estacionamiento' },
            { name: 'peajes', icon: 'bi-cash-stack', label: 'Peajes' }
        ]
    },
    alimentacion: {
        label: 'Alimentación',
        icon: 'bi-cup-straw',
        color: 'warning',
        subcategories: [
            { name: 'supermercado', icon: 'bi-cart4', label: 'Supermercado' },
            { name: 'mercado', icon: 'bi-shop-window', label: 'Mercado' },
            { name: 'restaurantes', icon: 'bi-sina-weibo', label: 'Restaurantes' },
            { name: 'delivery', icon: 'bi-truck', label: 'Comida a Domicilio' },
            { name: 'cafetería', icon: 'bi-cup-hot', label: 'Cafetería' }
        ]
    },
    salud: {
        label: 'Cuidado Personal y Salud',
        icon: 'bi-heart-pulse',
        color: 'danger',
        subcategories: [
            { name: 'médicos', icon: 'bi-heart-pulse', label: 'Médicos' },
            { name: 'medicamentos', icon: 'bi-capsule', label: 'Medicamentos' },
            { name: 'gimnasio', icon: 'bi-activity', label: 'Gimnasio' },
            { name: 'deportes', icon: 'bi-trophy', label: 'Deportes' },
            { name: 'belleza', icon: 'bi-brush', label: 'Belleza' },
            { name: 'peluquería', icon: 'bi-scissors', label: 'Peluquería' },
            { name: 'cosméticos', icon: 'bi-brush', label: 'Cosméticos' },
            { name: 'seguroMédico', icon: 'bi-file-medical-fill', label: 'Seguro Médico' }
        ]
    },
    entretenimiento: {
        label: 'Entretenimiento y Ocio',
        icon: 'bi-controller',
        color: 'info',
        subcategories: [
            { name: 'suscripciones', icon: 'bi-collection-play', label: 'Suscripciones' },
            { name: 'netflix', icon: 'bi-tv', label: 'Netflix' },
            { name: 'spotify', icon: 'bi-spotify', label: 'Spotify' },
            { name: 'amazon', icon: 'bi-amazon', label: 'Amazon Prime' },
            { name: 'software', icon: 'bi-file-earmark-code', label: 'Software' },
            { name: 'viajes', icon: 'bi-geo-alt', label: 'Viajes' },
            { name: 'vacaciones', icon: 'bi-suitcase', label: 'Vacaciones' },
            { name: 'hoteles', icon: 'bi-building', label: 'Hoteles' },
            { name: 'tours', icon: 'bi-globe-americas', label: 'Tours' },
            { name: 'cine', icon: 'bi-film', label: 'Cine' },
            { name: 'teatro', icon: 'bi-snapchat', label: 'Teatro' },
            { name: 'conciertos', icon: 'bi-music-note-list', label: 'Conciertos' },
            { name: 'museos', icon: 'bi-shop-window', label: 'Museos' },
            { name: 'juegos', icon: 'bi-controller', label: 'Juegos' },
            { name: 'videojuegos', icon: 'bi-joystick', label: 'Videojuegos' }
        ]
    },
    ropa: {
        label: 'Ropa',
        icon: 'bi-bag',
        color: 'secondary',
        subcategories: [
            { name: 'vestimenta', icon: 'bi-shop', label: 'Vestimenta' },
            { name: 'calzado', icon: 'bi-bag', label: 'Calzado' }
        ]
    },
    electronica: {
        label: 'Electrónica',
        icon: 'bi-pc-display',
        color: 'success',
        subcategories: [
            { name: 'gadgets', icon: 'bi-earbuds', label: 'Gadgets' },
            { name: 'teléfonos', icon: 'bi-phone-vibrate', label: 'Teléfonos' },
            { name: 'laptops', icon: 'bi-laptop', label: 'Laptops' },
            { name: 'consolas', icon: 'bi-controller', label: 'Consolas' }
        ]
    },
    hogar: {
        label: 'Artículos del Hogar',
        icon: 'bi-houses',
        color: 'primary',
        subcategories: [
            { name: 'muebles', icon: 'bi-box-seam', label: 'Muebles' },
            { name: 'decoración', icon: 'bi-palette', label: 'Decoración' },
            { name: 'utensilios', icon: 'bi-basket', label: 'Utensilios' },
            { name: 'regalos', icon: 'bi-gift', label: 'Regalos' }
        ]
    },
    educacion: {
        label: 'Educación',
        icon: 'bi-book',
        color: 'warning',
        subcategories: [
            { name: 'matrícula', icon: 'bi-mortarboard', label: 'Matrícula' },
            { name: 'colegiatura', icon: 'bi-cash-stack', label: 'Colegiatura' },
            { name: 'libros', icon: 'bi-book', label: 'Libros' },
            { name: 'materiales', icon: 'bi-pencil', label: 'Materiales' },
            { name: 'cursos', icon: 'bi-journal', label: 'Cursos' },
            { name: 'talleres', icon: 'bi-mortarboard-fill', label: 'Talleres' }
        ]
    }
};

// Medios de pago del sistema usuario
let paymentMethods = [
    { 
        name: 'Efectivo', 
        logo: '/frontend/public/img/Tipos/efectivo.png'
    },
    { 
        name: 'Yape', 
        logo: '/frontend/public/img/Tipos/yape.png'
    },
    { 
        name: 'Plin', 
        logo: '/frontend/public/img/Tipos/plin.png'
    },
    { 
        name: 'BCP', 
        logo: '/frontend/public/img/Tipos/bcp.png'
    },
    { 
        name: 'BBVA', 
        logo: '/frontend/public/img/Tipos/bbva.png'
    },
    { 
        name: 'PayPal', 
        logo: '/frontend/public/img/Tipos/paypal.png'
    },
    { 
        name: 'Credito', 
        logo: '/frontend/public/img/Tipos/credito.png'
    },
    { 
        name: 'Debito', 
        logo: '/frontend/public/img/Tipos/debito.png'
    }
];

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializeUsers();
    initializeActivities();
    initializePaymentMethods();
    loadDefaultCategories();
    updateNotificationsDropdown();
    
    // Establecer fecha actual como valor por defecto
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('userRegistrationDate').value = today;
    document.getElementById('activityDateFilter').value = today;
    
    // Establecer año actual
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // Inicializar reportes cuando se muestre la sección
    const reportesLink = document.querySelector('[data-section="reportes"]');
    reportesLink.addEventListener('click', function() {
        setTimeout(() => {
            initializeReports();
        }, 100);
    });

    // Configurar event listeners para gestión de categorías
    document.getElementById('saveCategoryBtn').addEventListener('click', saveCategory);
    document.getElementById('saveSubcategoryBtn').addEventListener('click', saveSubcategory);
    document.getElementById('savePaymentMethodBtn').addEventListener('click', savePaymentMethod);
    
    // Event listeners para botones de acción en tablas
    document.addEventListener('click', function(e) {
        if (e.target.closest('.view-more')) {
            const userId = parseInt(e.target.closest('.view-more').getAttribute('data-id'));
            showUserCustomization(userId);
        }
        
        if (e.target.closest('.edit-user')) {
            const userId = parseInt(e.target.closest('.edit-user').getAttribute('data-id'));
            editUser(userId);
        }
        
        if (e.target.closest('.delete-user')) {
            const userId = parseInt(e.target.closest('.delete-user').getAttribute('data-id'));
            deleteUser(userId);
        }
    });
    
    // Event listeners para filtros de actividades
    document.getElementById('activityTypeFilter').addEventListener('change', renderActivities);
    document.getElementById('activityDateFilter').addEventListener('change', renderActivities);
    document.getElementById('activitySearch').addEventListener('input', renderActivities);
    
    // Event listener para limpiar actividades
    document.getElementById('clearActivitiesBtn').addEventListener('click', clearActivities);
    
    // Event listeners para usuarios
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

    // NUEVOS EVENT LISTENERS PARA BÚSQUEDA Y FILTROS
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

    // Event listener para marcar todas las notificaciones como leídas
    document.getElementById('markAllAsRead').addEventListener('click', function(e) {
        e.preventDefault();
        markAllActivitiesAsRead();
    });
});

// Sistema de Navegación
const navLinks = document.querySelectorAll('.nav-link');
const contentSections = document.querySelectorAll('.content-section');
const mainTitle = document.getElementById('main-title');
const mainSubtitle = document.getElementById('main-subtitle');
const searchInput = document.getElementById('search-input');

const sectionData = {
    inicio: {
        title: 'Bienvenido, <span class="text-gradient">Administrador</span>',
        subtitle: 'Panel de control',
        placeholder: 'Buscar usuarios...'
    },
    usuarios: {
        title: 'Gestión de <span class="text-gradient">Usuarios</span>',
        subtitle: 'Administra y controla todos los usuarios del sistema FinLi',
        placeholder: 'Buscar usuarios...'
    },
    apartados: {
        title: 'Apartados de la <span class="text-gradient">Aplicación</span>',
        subtitle: 'Configuración predeterminada del sistema',
        placeholder: 'Buscar categorías...'
    },
    reportes: {
        title: 'Reportes <span class="text-gradient">Financieros</span>',
        subtitle: 'Análisis de suscripciones e ingresos',
        placeholder: 'Buscar reportes...'
    },
    actividades: {
        title: 'Historial de <span class="text-gradient">Actividades</span>',
        subtitle: 'Registro completo de todas las actividades del sistema',
        placeholder: 'Buscar actividades...'
    }
};

navLinks.forEach(link => {
    link.addEventListener('click', function() {
        const targetSection = this.getAttribute('data-section');
        
        navLinks.forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');
        
        contentSections.forEach(section => {
            section.classList.remove('active');
            if (section.id === targetSection) {
                section.classList.add('active');
            }
        });
        
        if (sectionData[targetSection]) {
            mainTitle.innerHTML = sectionData[targetSection].title;
            mainSubtitle.textContent = sectionData[targetSection].subtitle;
            searchInput.placeholder = sectionData[targetSection].placeholder;
        }

        if (targetSection === 'reportes') {
            initializeReports();
        }
        
        if (targetSection === 'actividades') {
            renderActivities();
        }
        
        if (targetSection === 'apartados') {
            loadDefaultCategories();
        }
    });
});

// Función para mostrar sección específica
function showSection(sectionName) {
    document.querySelectorAll('.nav-link').forEach(nav => nav.classList.remove('active'));
    document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));
    
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
    document.getElementById(sectionName).classList.add('active');
    
    if (sectionData[sectionName]) {
        document.getElementById('main-title').innerHTML = sectionData[sectionName].title;
        document.getElementById('main-subtitle').textContent = sectionData[sectionName].subtitle;
    }
}

// Sistema de Usuarios
function initializeUsers() {
    const storedUsers = localStorage.getItem('finliUsers');
    if (storedUsers) {
        users = JSON.parse(storedUsers);
    } else {
        // Datos de ejemplo mejorados
        users = [
            {
                id: 1,
                name: "Juan Pérez García",
                email: "juan.perez@example.com",
                subscriptionType: "Mensual",
                registrationDate: "2024-01-15",
                photo: null,
                lastLogin: "2024-03-20T10:30:00",
                status: "active",
                // NUEVOS CAMPOS PARA PERSONALIZACIÓN
                userCategories: [],
                userSubcategories: [],
                userPaymentMethods: []
            },
            {
                id: 2,
                name: "María García López",
                email: "maria.garcia@example.com",
                subscriptionType: "Anual",
                registrationDate: "2024-02-20",
                photo: null,
                lastLogin: "2024-03-19T14:45:00",
                status: "active",
                userCategories: [],
                userSubcategories: [],
                userPaymentMethods: []
            },
            {
                id: 3,
                name: "Carlos Rodríguez Martínez",
                email: "carlos.rodriguez@example.com",
                subscriptionType: "Sin suscripción",
                registrationDate: "2024-03-10",
                photo: null,
                lastLogin: "2024-03-18T09:15:00",
                status: "active",
                userCategories: [],
                userSubcategories: [],
                userPaymentMethods: []
            },
            {
                id: 4,
                name: "Ana Martínez Silva",
                email: "ana.martinez@example.com",
                subscriptionType: "De por vida",
                registrationDate: "2024-01-05",
                photo: null,
                lastLogin: "2024-03-20T16:20:00",
                status: "active",
                userCategories: [],
                userSubcategories: [],
                userPaymentMethods: []
            },
            {
                id: 5,
                name: "Luis Fernández Torres",
                email: "luis.fernandez@example.com",
                subscriptionType: "Mensual",
                registrationDate: "2024-03-25",
                photo: null,
                lastLogin: "2024-03-25T11:30:00",
                status: "active",
                userCategories: [],
                userSubcategories: [],
                userPaymentMethods: []
            }
        ];
        saveUsers();
    }
    
    renderUsers();
}

function saveUsers() {
    localStorage.setItem('finliUsers', JSON.stringify(users));
    updateUserCount();
}

function updateUserCount() {
    const totalUsers = users.length;
    const subscribedUsers = users.filter(user => user.subscriptionType !== "Sin suscripción").length;
    
    document.getElementById('totalUsersCount').textContent = totalUsers;
    document.getElementById('totalSubscriptions').textContent = subscribedUsers;
    document.getElementById('totalUsers').textContent = totalUsers;
    document.getElementById('totalUsers2').textContent = totalUsers;
    document.getElementById('totalUsersInicio').textContent = totalUsers;
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
    
    // Renderizar en la tabla de Inicio (solo los 3 más recientes con paginación)
    const tbodyInicio = document.getElementById('tbodyInicio');
    tbodyInicio.innerHTML = '';
    
    const startIndexInicio = (currentPageInicio - 1) * usersPerPageInicio;
    const usersForInicio = sortedUsers.slice(startIndexInicio, startIndexInicio + usersPerPageInicio);
    
    usersForInicio.forEach(user => {
        tbodyInicio.appendChild(createUserRow(user, 'inicio'));
    });
    
    // Actualizar contadores y paginación de Inicio
    updateInicioPagination(sortedUsers.length);
    
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

// Función para actualizar la paginación de Inicio
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

// Función para actualizar la paginación de Usuarios
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

// Función para cambiar página en Inicio
function changePageInicio(page) {
    const totalPages = Math.ceil(users.length / usersPerPageInicio);
    if (page >= 1 && page <= totalPages) {
        currentPageInicio = page;
        renderUsers();
    }
}

// Función para cambiar página en Usuarios
function changePageUsuarios(page) {
    const totalPages = Math.ceil(users.length / usersPerPageUsuarios);
    if (page >= 1 && page <= totalPages) {
        currentPageUsuarios = page;
        renderUsers();
    }
}

function createUserRow(user, section = 'inicio') {
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
                <button class="table-action-btn view view-more" data-id="${user.id}" title="Ver más">
                    <i class="bi bi-eye"></i>
                </button>
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

// Funciones para agregar, editar y eliminar usuarios
function saveUser() {
    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    const subscriptionType = document.getElementById('userSubscriptionType').value;
    const registrationDate = document.getElementById('userRegistrationDate').value;
    const password = document.getElementById('userPassword').value;
    const photoFile = document.getElementById('userPhoto').files[0];
    
    if (!name || !email || !password) {
        showNotification('Por favor completa todos los campos obligatorios', 'error');
        return;
    }
    
    // Verificar si el correo ya existe
    if (users.some(user => user.email === email)) {
        showNotification('El correo electrónico ya está registrado', 'error');
        return;
    }
    
    let photo = null;
    if (photoFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            photo = e.target.result;
            createUserWithPhoto(name, email, subscriptionType, registrationDate, password, photo);
        };
        reader.readAsDataURL(photoFile);
    } else {
        createUserWithPhoto(name, email, subscriptionType, registrationDate, password, photo);
    }
}

function createUserWithPhoto(name, email, subscriptionType, registrationDate, password, photo) {
    const newUser = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        name,
        email,
        subscriptionType,
        registrationDate,
        photo,
        lastLogin: new Date().toISOString(),
        status: 'active',
        // NUEVOS CAMPOS PARA PERSONALIZACIÓN
        userCategories: [],
        userSubcategories: [],
        userPaymentMethods: []
    };
    
    users.push(newUser);
    saveUsers();
    renderUsers();
    
    addActivity(`Nuevo usuario registrado: ${name}`, 'user', newUser.id, { userName: name, email });
    
    showNotification('Usuario creado exitosamente', 'success');
    
    // Limpiar formulario
    document.getElementById('addUserForm').reset();
    document.getElementById('addPhotoPreview').style.display = 'none';
    
    // Cerrar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('addUserModal'));
    modal.hide();
}

function editUser(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    currentEditingUserId = userId;
    
    document.getElementById('editUserName').value = user.name;
    document.getElementById('editUserEmail').value = user.email;
    document.getElementById('editUserSubscriptionType').value = user.subscriptionType;
    document.getElementById('editUserRegistrationDate').value = user.registrationDate;
    
    const preview = document.getElementById('editPhotoPreview');
    if (user.photo) {
        preview.src = user.photo;
        preview.style.display = 'block';
    } else {
        preview.style.display = 'none';
    }
    
    const modal = new bootstrap.Modal(document.getElementById('editUserModal'));
    modal.show();
}

function updateUser() {
    const user = users.find(u => u.id === currentEditingUserId);
    if (!user) return;
    
    const name = document.getElementById('editUserName').value;
    const email = document.getElementById('editUserEmail').value;
    const subscriptionType = document.getElementById('editUserSubscriptionType').value;
    const registrationDate = document.getElementById('editUserRegistrationDate').value;
    const photoFile = document.getElementById('editUserPhoto').files[0];
    
    if (!name || !email) {
        showNotification('Por favor completa todos los campos obligatorios', 'error');
        return;
    }
    
    // Verificar si el correo ya existe (excluyendo el usuario actual)
    if (users.some(u => u.email === email && u.id !== currentEditingUserId)) {
        showNotification('El correo electrónico ya está registrado', 'error');
        return;
    }
    
    user.name = name;
    user.email = email;
    user.subscriptionType = subscriptionType;
    user.registrationDate = registrationDate;
    
    if (photoFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            user.photo = e.target.result;
            saveUsers();
            renderUsers();
            
            addActivity(`Usuario actualizado: ${name}`, 'user', user.id, { userName: name, email });
            
            showNotification('Usuario actualizado exitosamente', 'success');
            
            // Cerrar modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
            modal.hide();
        };
        reader.readAsDataURL(photoFile);
    } else {
        saveUsers();
        renderUsers();
        
        addActivity(`Usuario actualizado: ${name}`, 'user', user.id, { userName: name, email });
        
        showNotification('Usuario actualizado exitosamente', 'success');
        
        // Cerrar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
        modal.hide();
    }
}

function deleteUser(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    currentDeletingUserId = userId;
    document.getElementById('deleteUserName').textContent = user.name;
    
    const modal = new bootstrap.Modal(document.getElementById('deleteUserModal'));
    modal.show();
}

function confirmDeleteUser() {
    const userIndex = users.findIndex(u => u.id === currentDeletingUserId);
    if (userIndex === -1) return;
    
    const userName = users[userIndex].name;
    users.splice(userIndex, 1);
    saveUsers();
    renderUsers();
    
    addActivity(`Usuario eliminado: ${userName}`, 'user');
    
    showNotification('Usuario eliminado exitosamente', 'success');
    
    // Cerrar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('deleteUserModal'));
    modal.hide();
}

// Sistema de Actividades
function initializeActivities() {
    const storedActivities = localStorage.getItem('finliActivities');
    if (storedActivities) {
        activities = JSON.parse(storedActivities);
    } else {
        // Actividades de ejemplo mejoradas
        activities = [
            {
                id: 1,
                message: "Nuevo usuario registrado: Juan Pérez García",
                type: "user",
                userId: 1,
                details: { userName: "Juan Pérez García", email: "juan.perez@example.com" },
                timestamp: new Date('2024-01-15T10:30:00').toISOString(),
                read: false
            },
            {
                id: 2,
                message: "Usuario María García López actualizó su suscripción a Anual",
                type: "subscription",
                userId: 2,
                details: { userName: "María García López", subscriptionType: "Anual" },
                timestamp: new Date('2024-02-20T14:45:00').toISOString(),
                read: false
            },
            {
                id: 3,
                message: "Sistema actualizado a versión 1.1",
                type: "system",
                userId: null,
                details: { version: "1.1" },
                timestamp: new Date('2024-03-01T09:00:00').toISOString(),
                read: false
            },
            {
                id: 4,
                message: "Nueva categoría agregada: Viajes",
                type: "system",
                userId: null,
                details: { category: "Viajes" },
                timestamp: new Date('2024-03-15T11:20:00').toISOString(),
                read: false
            }
        ];
        saveActivities();
    }
    
    renderActivities();
    updateRecentActivities();
}

function addActivity(message, type = 'system', userId = null, details = {}) {
    const activity = {
        id: Date.now(),
        message,
        type,
        userId,
        details,
        timestamp: new Date().toISOString(),
        read: false
    };
    
    activities.unshift(activity);
    
    if (activities.length > 1000) {
        activities = activities.slice(0, 1000);
    }
    
    saveActivities();
    updateNotificationsDropdown();
    updateRecentActivities();
    
    if (document.getElementById('actividades')?.classList.contains('active')) {
        renderActivities();
    }
}

function saveActivities() {
    localStorage.setItem('finliActivities', JSON.stringify(activities));
}

function renderActivities() {
    const container = document.getElementById('activitiesTimeline');
    const countElement = document.getElementById('activitiesCount');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    if (activities.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-clock-history"></i>
                <div>No hay actividades registradas</div>
                <small class="text-muted">Las actividades del sistema aparecerán aquí</small>
            </div>
        `;
        countElement.textContent = 'Mostrando 0 actividades';
        return;
    }
    
    let filteredActivities = [...activities];
    const typeFilter = document.getElementById('activityTypeFilter').value;
    const dateFilter = document.getElementById('activityDateFilter').value;
    const searchFilter = document.getElementById('activitySearch').value.toLowerCase();
    
    if (typeFilter !== 'all') {
        filteredActivities = filteredActivities.filter(act => act.type === typeFilter);
    }
    
    if (dateFilter) {
        filteredActivities = filteredActivities.filter(act => 
            act.timestamp.startsWith(dateFilter)
        );
    }
    
    if (searchFilter) {
        filteredActivities = filteredActivities.filter(act => 
            act.message.toLowerCase().includes(searchFilter) ||
            (act.details.userName && act.details.userName.toLowerCase().includes(searchFilter))
        );
    }
    
    filteredActivities.forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.className = `activity-item ${activity.read ? 'read' : 'unread'}`;
        
        const date = new Date(activity.timestamp);
        const formattedDate = date.toLocaleDateString('es-ES') + ' ' + date.toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'});
        const timeAgo = getTimeAgo(activity.timestamp);
        
        activityItem.innerHTML = `
            <div class="d-flex">
                <div class="activity-icon ${activity.type}">
                    <i class="${getActivityIcon(activity.type)}"></i>
                </div>
                <div class="activity-content">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <div class="fw-medium">${activity.message}</div>
                            <div class="activity-time">${formattedDate} • ${timeAgo}</div>
                        </div>
                        <div class="d-flex align-items-center gap-2">
                            <span class="activity-badge ${getActivityBadgeClass(activity.type)}">
                                ${getActivityTypeLabel(activity.type)}
                            </span>
                            ${!activity.read ? `
                                <button class="mark-read-btn" onclick="markActivityAsRead(${activity.id})" title="Marcar como leída">
                                    <i class="bi bi-check"></i>
                                </button>
                            ` : ''}
                        </div>
                    </div>
                    ${activity.details.userName ? `<div class="mt-2"><small class="text-muted">Usuario: ${activity.details.userName}</small></div>` : ''}
                    ${activity.details.subscriptionType ? `<div><small class="text-success">Suscripción: ${activity.details.subscriptionType}</small></div>` : ''}
                    ${activity.details.version ? `<div><small class="text-info">Versión: v${activity.details.version}</small></div>` : ''}
                    ${activity.details.category ? `<div><small class="text-warning">Categoría: ${activity.details.category}</small></div>` : ''}
                </div>
            </div>
        `;
        container.appendChild(activityItem);
    });
    
    countElement.textContent = `Mostrando ${filteredActivities.length} actividades`;
}

// NUEVA FUNCIÓN PARA MARCAR TODAS LAS ACTIVIDADES COMO LEÍDAS
function markAllActivitiesAsRead() {
    activities.forEach(activity => {
        activity.read = true;
    });
    saveActivities();
    updateNotificationsDropdown();
    renderActivities();
    updateRecentActivities();
    showNotification('Todas las actividades marcadas como leídas', 'success');
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
                    <span class="badge ${getActivityBadgeClass(activity.type)}" style="font-size: 0.6rem;">
                        ${getActivityTypeLabel(activity.type)}
                    </span>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
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
            const textClass = getActivityTextClass(activity.type);
            const timeAgo = getTimeAgo(activity.timestamp);

            dropdownHTML += `
                <li class="notification-item ${activity.read ? 'read' : 'unread'}">
                    <a class="dropdown-item ${activity.read ? '' : 'fw-bold'}" href="#" onclick="markActivityAsRead(${activity.id}); showSection('actividades')">
                        <div class="d-flex align-items-start">
                            <i class="bi ${icon} ${textClass} me-2"></i>
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

function markActivityAsRead(id) {
    const activity = activities.find(a => a.id === id);
    if (activity && !activity.read) {
        activity.read = true;
        saveActivities();
        updateNotificationsDropdown();
        
        if (document.getElementById('actividades')?.classList.contains('active')) {
            renderActivities();
        }
    }
}

function clearActivities() {
    if (confirm('¿Estás seguro de que deseas limpiar todo el historial de actividades? Esta acción no se puede deshacer.')) {
        activities = [];
        saveActivities();
        renderActivities();
        updateNotificationsDropdown();
        updateRecentActivities();
        showNotification('Historial de actividades limpiado exitosamente', 'success');
    }
}

// Funciones auxiliares para actividades
function getActivityIcon(type) {
    const icons = {
        user: 'bi-person',
        system: 'bi-gear',
        subscription: 'bi-credit-card',
        financial: 'bi-cash-coin'
    };
    return icons[type] || 'bi-info-circle';
}

function getActivityColor(type) {
    const colors = {
        user: 'primary',
        system: 'secondary',
        subscription: 'success',
        financial: 'warning'
    };
    return colors[type] || 'info';
}

function getActivityTextClass(type) {
    const classes = {
        user: 'text-primary',
        system: 'text-secondary',
        subscription: 'text-success',
        financial: 'text-warning'
    };
    return classes[type] || 'text-info';
}

function getActivityBadgeClass(type) {
    const classes = {
        user: 'bg-primary',
        system: 'bg-secondary',
        subscription: 'bg-success',
        financial: 'bg-warning'
    };
    return classes[type] || 'bg-info';
}

function getActivityTypeLabel(type) {
    const labels = {
        user: 'Usuario',
        system: 'Sistema',
        subscription: 'Suscripción',
        financial: 'Financiero'
    };
    return labels[type] || 'General';
}

function getTimeAgo(timestamp) {
    const now = new Date();
    const date = new Date(timestamp);
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'hace un momento';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `hace ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `hace ${hours} h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `hace ${days} día${days > 1 ? 's' : ''}`;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

// Sistema de Gestión de Categorías y Subcategorías
function loadDefaultCategories() {
    // Cargar categorías del sistema usuario
    defaultCategories = Object.keys(userCategoriesMap).map(key => {
        const category = userCategoriesMap[key];
        return {
            id: key,
            name: key,
            label: category.label,
            icon: category.icon,
            color: category.color
        };
    });

    // Cargar subcategorías del sistema usuario
    defaultSubcategories = {};
    Object.keys(userCategoriesMap).forEach(key => {
        defaultSubcategories[key] = userCategoriesMap[key].subcategories;
    });

    renderDefaultCategories();
    renderDefaultSubcategories();
    loadDefaultPaymentMethods();
}

function saveDefaultCategories() {
    localStorage.setItem('finliDefaultCategories', JSON.stringify(defaultCategories));
}

function saveDefaultSubcategories() {
    localStorage.setItem('finliDefaultSubcategories', JSON.stringify(defaultSubcategories));
}

// Función mejorada para renderizar categorías
function renderDefaultCategories() {
    const container = document.getElementById('defaultCategoriesList');
    if (!container) return;
    
    let html = '';
    
    if (defaultCategories.length === 0) {
        html = `
            <div class="text-center py-4">
                <i class="bi bi-inbox display-4 text-muted"></i>
                <p class="text-muted mt-3">No hay categorías configuradas</p>
            </div>
        `;
    } else {
        defaultCategories.forEach(category => {
            const subcategoriesCount = defaultSubcategories[category.id] ? defaultSubcategories[category.id].length : 0;
            
            html += `
                <div class="list-group-item d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center">
                        <i class="${category.icon} text-${category.color} me-3 fs-5"></i>
                        <div>
                            <strong class="d-block">${category.label}</strong>
                            <small class="text-muted">ID: ${category.id}</small>
                        </div>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                        <span class="badge bg-${category.color} rounded-pill">${subcategoriesCount} subcat.</span>
                        <div class="btn-group">
                            <button class="btn btn-sm btn-outline-warning" onclick="editCategory('${category.id}')" title="Editar categoría">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="deleteCategory('${category.id}')" title="Eliminar categoría">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
    }
    
    container.innerHTML = html;
}

// Función mejorada para renderizar subcategorías
function renderDefaultSubcategories() {
    const container = document.getElementById('defaultSubcategoriesList');
    if (!container) return;
    
    let html = '<div class="manage-categories-container">';
    
    defaultCategories.forEach(category => {
        const subcategories = defaultSubcategories[category.id] || [];
        
        if (subcategories.length > 0) {
            html += `
                <div class="mb-4">
                    <div class="d-flex align-items-center mb-3">
                        <i class="${category.icon} text-${category.color} me-2"></i>
                        <h6 class="mb-0 text-${category.color}">${category.label}</h6>
                        <span class="badge bg-${category.color} ms-2">${subcategories.length} subcategorías</span>
                    </div>
                    <div class="row g-2">
            `;
            
            subcategories.forEach((subcategory, index) => {
                html += `
                    <div class="col-md-6 col-lg-4">
                        <div class="subcategory-item d-flex justify-content-between align-items-center">
                            <div class="d-flex align-items-center">
                                <i class="${subcategory.icon} me-2 text-muted"></i>
                                <div>
                                    <div class="fw-medium">${subcategory.label}</div>
                                    <small class="text-muted">${subcategory.name}</small>
                                </div>
                            </div>
                            <div class="btn-group">
                                <button class="btn btn-sm btn-outline-warning" 
                                    onclick="editSubcategory('${category.id}', '${subcategory.name}')"
                                    title="Editar">
                                    <i class="bi bi-pencil"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-danger" 
                                    onclick="deleteSubcategory('${category.id}', '${subcategory.name}')"
                                    title="Eliminar">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            html += `</div></div>`;
        }
    });
    
    if (Object.keys(defaultSubcategories).length === 0) {
        html += `
            <div class="text-center py-4">
                <i class="bi bi-tags display-4 text-muted"></i>
                <p class="text-muted mt-3">No hay subcategorías configuradas</p>
            </div>
        `;
    }
    
    html += '</div>';
    container.innerHTML = html;
}

// Funciones para gestión de categorías
function showAddCategoryModal() {
    currentEditingCategoryId = null;
    document.getElementById('categoryModalLabel').textContent = 'Agregar Nueva Categoría';
    document.getElementById('categoryName').value = '';
    document.getElementById('categoryIcon').value = 'bi-house';
    document.getElementById('saveCategoryBtn').textContent = 'Crear Categoría';
    document.getElementById('saveCategoryBtn').className = 'btn btn-success';
    
    const modal = new bootstrap.Modal(document.getElementById('categoryModal'));
    modal.show();
}

function editCategory(categoryId) {
    const category = defaultCategories.find(c => c.id === categoryId);
    if (!category) return;
    
    currentEditingCategoryId = categoryId;
    document.getElementById('categoryModalLabel').textContent = 'Editar Categoría';
    document.getElementById('categoryName').value = category.label;
    document.getElementById('categoryIcon').value = category.icon;
    document.getElementById('saveCategoryBtn').textContent = 'Actualizar Categoría';
    document.getElementById('saveCategoryBtn').className = 'btn btn-warning';
    
    const modal = new bootstrap.Modal(document.getElementById('categoryModal'));
    modal.show();
}

function saveCategory() {
    const name = document.getElementById('categoryName').value.trim();
    const icon = document.getElementById('categoryIcon').value;
    
    if (!name) {
        showNotification('Por favor ingresa un nombre para la categoría', 'error');
        return;
    }
    
    if (currentEditingCategoryId) {
        // Editar categoría existente
        const categoryIndex = defaultCategories.findIndex(c => c.id === currentEditingCategoryId);
        if (categoryIndex !== -1) {
            defaultCategories[categoryIndex].label = name;
            defaultCategories[categoryIndex].icon = icon;
        }
    } else {
        // Agregar nueva categoría
        const newId = 'cat_' + Date.now();
        const colors = ['success', 'primary', 'warning', 'danger', 'info', 'secondary'];
        const colorIndex = defaultCategories.length % colors.length;
        
        defaultCategories.push({
            id: newId,
            name: name.toLowerCase().replace(/\s+/g, '_'),
            label: name,
            icon: icon,
            color: colors[colorIndex]
        });
        
        defaultSubcategories[newId] = [];
    }
    
    saveDefaultCategories();
    renderDefaultCategories();
    renderDefaultSubcategories();
    
    addActivity(`Categoría ${currentEditingCategoryId ? 'actualizada' : 'creada'}: ${name}`, 'system');
    
    showNotification(`Categoría ${currentEditingCategoryId ? 'actualizada' : 'creada'} exitosamente`, 'success');
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('categoryModal'));
    modal.hide();
    currentEditingCategoryId = null;
}

function deleteCategory(categoryId) {
    const category = defaultCategories.find(c => c.id === categoryId);
    if (!category) return;
    
    if (!confirm(`¿Estás seguro de que deseas eliminar la categoría "${category.label}"?\n\nEsta acción eliminará también todas sus subcategorías y no se puede deshacer.`)) {
        return;
    }
    
    defaultCategories = defaultCategories.filter(c => c.id !== categoryId);
    delete defaultSubcategories[categoryId];
    
    saveDefaultCategories();
    saveDefaultSubcategories();
    renderDefaultCategories();
    renderDefaultSubcategories();
    
    addActivity(`Categoría eliminada: ${category.label}`, 'system');
    showNotification('Categoría eliminada exitosamente', 'success');
}

// Funciones para gestión de subcategorías
function showAddSubcategoryModal() {
    currentEditingSubcategoryId = null;
    document.getElementById('subcategoryModalLabel').textContent = 'Agregar Nueva Subcategoría';
    document.getElementById('subcategoryName').value = '';
    document.getElementById('subcategoryIcon').value = 'bi-tag';
    document.getElementById('saveSubcategoryBtn').textContent = 'Crear Subcategoría';
    document.getElementById('saveSubcategoryBtn').className = 'btn btn-success';
    
    // Cargar categorías padre
    const parentCategorySelect = document.getElementById('parentCategory');
    parentCategorySelect.innerHTML = '';
    
    defaultCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.label;
        parentCategorySelect.appendChild(option);
    });
    
    const modal = new bootstrap.Modal(document.getElementById('subcategoryModal'));
    modal.show();
}

function editSubcategory(categoryId, subcategoryName) {
    const subcategory = defaultSubcategories[categoryId]?.find(s => s.name === subcategoryName);
    if (!subcategory) return;
    
    currentEditingSubcategoryId = subcategoryName;
    currentEditingCategoryId = categoryId;
    
    document.getElementById('subcategoryModalLabel').textContent = 'Editar Subcategoría';
    document.getElementById('subcategoryName').value = subcategory.label;
    document.getElementById('subcategoryIcon').value = subcategory.icon;
    document.getElementById('saveSubcategoryBtn').textContent = 'Actualizar Subcategoría';
    document.getElementById('saveSubcategoryBtn').className = 'btn btn-warning';
    
    // Cargar categorías padre
    const parentCategorySelect = document.getElementById('parentCategory');
    parentCategorySelect.innerHTML = '';
    
    defaultCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.label;
        if (category.id === categoryId) {
            option.selected = true;
        }
        parentCategorySelect.appendChild(option);
    });
    
    const modal = new bootstrap.Modal(document.getElementById('subcategoryModal'));
    modal.show();
}

function saveSubcategory() {
    const name = document.getElementById('subcategoryName').value.trim();
    const icon = document.getElementById('subcategoryIcon').value;
    const parentCategoryId = document.getElementById('parentCategory').value;
    
    if (!name) {
        showNotification('Por favor ingresa un nombre para la subcategoría', 'error');
        return;
    }
    
    if (!parentCategoryId) {
        showNotification('Por favor selecciona una categoría padre', 'error');
        return;
    }
    
    if (currentEditingSubcategoryId) {
        // Editar subcategoría existente
        const subcategoryIndex = defaultSubcategories[currentEditingCategoryId]?.findIndex(s => s.name === currentEditingSubcategoryId);
        if (subcategoryIndex !== -1) {
            defaultSubcategories[currentEditingCategoryId][subcategoryIndex].label = name;
            defaultSubcategories[currentEditingCategoryId][subcategoryIndex].icon = icon;
            
            // Si cambió la categoría padre, mover la subcategoría
            if (currentEditingCategoryId !== parentCategoryId) {
                const subcategory = defaultSubcategories[currentEditingCategoryId][subcategoryIndex];
                defaultSubcategories[currentEditingCategoryId].splice(subcategoryIndex, 1);
                
                if (!defaultSubcategories[parentCategoryId]) {
                    defaultSubcategories[parentCategoryId] = [];
                }
                defaultSubcategories[parentCategoryId].push(subcategory);
            }
        }
    } else {
        // Agregar nueva subcategoría
        const newSubcategory = {
            name: name.toLowerCase().replace(/\s+/g, '_'),
            label: name,
            icon: icon
        };
        
        if (!defaultSubcategories[parentCategoryId]) {
            defaultSubcategories[parentCategoryId] = [];
        }
        
        defaultSubcategories[parentCategoryId].push(newSubcategory);
    }
    
    saveDefaultSubcategories();
    renderDefaultSubcategories();
    
    addActivity(`Subcategoría ${currentEditingSubcategoryId ? 'actualizada' : 'creada'}: ${name}`, 'system');
    
    showNotification(`Subcategoría ${currentEditingSubcategoryId ? 'actualizada' : 'creada'} exitosamente`, 'success');
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('subcategoryModal'));
    modal.hide();
    currentEditingSubcategoryId = null;
    currentEditingCategoryId = null;
}

function deleteSubcategory(categoryId, subcategoryName) {
    const subcategory = defaultSubcategories[categoryId]?.find(s => s.name === subcategoryName);
    if (!subcategory) return;
    
    if (!confirm(`¿Estás seguro de que deseas eliminar la subcategoría "${subcategory.label}"?\n\nEsta acción no se puede deshacer.`)) {
        return;
    }
    
    defaultSubcategories[categoryId] = defaultSubcategories[categoryId].filter(s => s.name !== subcategoryName);
    
    saveDefaultSubcategories();
    renderDefaultSubcategories();
    
    addActivity(`Subcategoría eliminada: ${subcategory.label}`, 'system');
    showNotification('Subcategoría eliminada exitosamente', 'success');
}

// Función para cargar medios de pago
function initializePaymentMethods() {
    const storedPaymentMethods = localStorage.getItem('finliPaymentMethods');
    if (storedPaymentMethods) {
        paymentMethods = JSON.parse(storedPaymentMethods);
    }
    loadDefaultPaymentMethods();
}

function loadDefaultPaymentMethods() {
    const container = document.getElementById('defaultPaymentMethodsList');
    let html = '';
    
    paymentMethods.forEach((method, index) => {
        html += `
            <div class="col-md-6 col-lg-3 mb-4">
                <div class="payment-method-card">
                    ${method.logo ? `
                        <img src="${method.logo}" alt="${method.name}" class="payment-method-logo" 
                                onerror="this.src='/frontend/public/img/Tipos/default.png'; this.onerror=null;">
                    ` : `
                        <div class="payment-method-icon">
                            <i class="bi bi-credit-card"></i>
                        </div>
                    `}
                    <h6 class="mb-2">${method.name}</h6>
                    <div class="d-flex justify-content-center gap-2 mt-3">
                        <button class="btn btn-sm btn-outline-warning" onclick="editPaymentMethod(${index})" title="Editar">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deletePaymentMethod(${index})" title="Eliminar">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    // Agregar botón para nuevo medio de pago
    html += `
        <div class="col-md-6 col-lg-3 mb-4">
            <div class="payment-method-card d-flex align-items-center justify-content-center" 
                    style="border: 2px dashed var(--accent); background: rgba(14, 164, 111, 0.05); cursor: pointer;" 
                    onclick="showAddPaymentMethodModal()">
                <div class="text-center">
                    <i class="bi bi-plus-circle display-6 text-success mb-2"></i>
                    <h6 class="text-success">Agregar Medio de Pago</h6>
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

function showAddPaymentMethodModal() {
    currentEditingPaymentMethod = null;
    document.getElementById('paymentMethodModalLabel').textContent = 'Agregar Medio de Pago';
    document.getElementById('paymentMethodName').value = '';
    document.getElementById('paymentMethodLogo').value = '';
    document.getElementById('savePaymentMethodBtn').textContent = 'Crear Medio de Pago';
    
    const modal = new bootstrap.Modal(document.getElementById('paymentMethodModal'));
    modal.show();
}

function editPaymentMethod(index) {
    const method = paymentMethods[index];
    currentEditingPaymentMethod = index;
    
    document.getElementById('paymentMethodModalLabel').textContent = 'Editar Medio de Pago';
    document.getElementById('paymentMethodName').value = method.name;
    document.getElementById('paymentMethodLogo').value = method.logo || '';
    document.getElementById('savePaymentMethodBtn').textContent = 'Actualizar Medio de Pago';
    
    const modal = new bootstrap.Modal(document.getElementById('paymentMethodModal'));
    modal.show();
}

function savePaymentMethod() {
    const name = document.getElementById('paymentMethodName').value.trim();
    const logo = document.getElementById('paymentMethodLogo').value.trim();
    
    if (!name) {
        showNotification('Por favor ingresa un nombre para el medio de pago', 'error');
        return;
    }
    
    if (currentEditingPaymentMethod !== null) {
        // Editar medio de pago existente
        paymentMethods[currentEditingPaymentMethod].name = name;
        if (logo) {
            paymentMethods[currentEditingPaymentMethod].logo = logo;
        }
    } else {
        // Agregar nuevo medio de pago
        paymentMethods.push({
            name: name,
            logo: logo || null
        });
    }
    
    savePaymentMethods();
    loadDefaultPaymentMethods();
    
    showNotification(`Medio de pago ${currentEditingPaymentMethod !== null ? 'actualizado' : 'creado'} exitosamente`, 'success');
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('paymentMethodModal'));
    modal.hide();
    currentEditingPaymentMethod = null;
}

function deletePaymentMethod(index) {
    const method = paymentMethods[index];
    if (!confirm(`¿Estás seguro de que deseas eliminar el medio de pago "${method.name}"?`)) {
        return;
    }
    
    paymentMethods.splice(index, 1);
    savePaymentMethods();
    loadDefaultPaymentMethods();
    
    showNotification(`Medio de pago "${method.name}" eliminado exitosamente`, 'success');
}

function savePaymentMethods() {
    localStorage.setItem('finliPaymentMethods', JSON.stringify(paymentMethods));
}

// Sistema de Personalización del Usuario
function showUserCustomization(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    currentViewingUserId = userId;
    
    // Actualizar información del usuario en el modal
    document.getElementById('modalUserName').textContent = user.name;
    document.getElementById('modalUserEmail').textContent = user.email;
    document.getElementById('modalUserSubscription').textContent = user.subscriptionType || 'Sin suscripción';
    
    const avatar = document.getElementById('modalUserAvatar');
    const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
    const colors = ['var(--accent)', 'var(--accent-3)', 'var(--accent-4)', '#3498db', '#e74c3c', '#2ecc71'];
    const colorIndex = user.id % colors.length;
    
    if (user.photo) {
        avatar.innerHTML = `<img src="${user.photo}" alt="${user.name}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
    } else {
        avatar.innerHTML = `<span>${initials}</span>`;
        avatar.style.background = colors[colorIndex];
    }
    
    loadUserCategories(userId);
    loadUserSubcategories(userId);
    loadUserPaymentMethods(userId);
    
    // Guardar la sección actual antes de abrir el modal
    const currentSection = document.querySelector('.content-section.active').id;
    localStorage.setItem('lastActiveSection', currentSection);
    
    const modal = new bootstrap.Modal(document.getElementById('userCustomizationModal'));
    modal.show();
    
    // Configurar para volver a la sección actual al cerrar
    modal._element.addEventListener('hidden.bs.modal', function () {
        const lastSection = localStorage.getItem('lastActiveSection') || 'usuarios';
        showSection(lastSection);
    });
}

function loadUserCategories(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    const container = document.getElementById('userCategoriesList');
    
    // Inicializar userCategories si no existe
    if (!user.userCategories) {
        user.userCategories = [];
    }
    
    let html = `
        <div class="list-group" id="userCategoriesListContent">
    `;
    
    if (user.userCategories.length === 0) {
        html += `
            <div class="empty-search-results">
                <i class="bi bi-inbox"></i>
                <p>No hay categorías personalizadas</p>
                <small class="text-muted">Agrega categorías personalizadas para este usuario</small>
            </div>
        `;
    } else {
        user.userCategories.forEach(category => {
            html += `
                <div class="list-group-item d-flex justify-content-between align-items-center user-category-item">
                    <div class="d-flex align-items-center">
                        <i class="${category.icon} text-${category.color} me-3"></i>
                        <div>
                            <div class="fw-medium">${category.label}</div>
                            <small class="text-muted">Categoría personalizada</small>
                        </div>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                        <span class="badge bg-${category.color}">${category.transactionCount || 0} trans.</span>
                        <div class="btn-group">
                            <button class="btn btn-sm btn-outline-warning" onclick="editUserCategory(${userId}, '${category.id}')" title="Editar">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="deleteUserCategory(${userId}, '${category.id}')" title="Eliminar">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
    }
    
    html += `</div>`;
    container.innerHTML = html;
    
    // Agregar funcionalidad de búsqueda
    document.getElementById('searchUserCategories').addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const items = container.querySelectorAll('.user-category-item');
        let hasResults = false;
        
        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                item.style.display = 'flex';
                hasResults = true;
            } else {
                item.style.display = 'none';
            }
        });
        
        // Mostrar mensaje si no hay resultados
        const emptyMessage = container.querySelector('.empty-search-results');
        if (!hasResults && items.length > 0) {
            if (!emptyMessage) {
                container.innerHTML += `
                    <div class="empty-search-results">
                        <i class="bi bi-search"></i>
                        <p>No se encontraron categorías</p>
                        <small class="text-muted">Intenta con otros términos de búsqueda</small>
                    </div>
                `;
            }
        } else if (emptyMessage) {
            emptyMessage.remove();
        }
    });
}

function loadUserSubcategories(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    const container = document.getElementById('userSubcategoriesList');
    
    // Inicializar userSubcategories si no existe
    if (!user.userSubcategories) {
        user.userSubcategories = [];
    }
    
    let html = `
        <div class="list-group" id="userSubcategoriesListContent">
    `;
    
    if (user.userSubcategories.length === 0) {
        html += `
            <div class="empty-search-results">
                <i class="bi bi-tags"></i>
                <p>No hay subcategorías personalizadas</p>
                <small class="text-muted">Agrega subcategorías personalizadas para este usuario</small>
            </div>
        `;
    } else {
        user.userSubcategories.forEach(subcategory => {
            html += `
                <div class="list-group-item d-flex justify-content-between align-items-center user-subcategory-item">
                    <div class="d-flex align-items-center">
                        <i class="${subcategory.icon} me-3 text-muted"></i>
                        <div>
                            <div class="fw-medium">${subcategory.label}</div>
                            <small class="text-muted">${subcategory.categoryLabel || 'Sin categoría'}</small>
                        </div>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                        <span class="badge bg-secondary">${subcategory.transactionCount || 0} trans.</span>
                        <div class="btn-group">
                            <button class="btn btn-sm btn-outline-warning" onclick="editUserSubcategory(${userId}, '${subcategory.id}')" title="Editar">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="deleteUserSubcategory(${userId}, '${subcategory.id}')" title="Eliminar">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
    }
    
    html += `</div>`;
    container.innerHTML = html;
    
    // Funcionalidad de búsqueda
    document.getElementById('searchUserSubcategories').addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const items = container.querySelectorAll('.user-subcategory-item');
        let hasResults = false;
        
        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                item.style.display = 'flex';
                hasResults = true;
            } else {
                item.style.display = 'none';
            }
        });
        
        // Mostrar mensaje si no hay resultados
        const emptyMessage = container.querySelector('.empty-search-results');
        if (!hasResults && items.length > 0) {
            if (!emptyMessage) {
                container.innerHTML += `
                    <div class="empty-search-results">
                        <i class="bi bi-search"></i>
                        <p>No se encontraron subcategorías</p>
                        <small class="text-muted">Intenta con otros términos de búsqueda</small>
                    </div>
                `;
            }
        } else if (emptyMessage) {
            emptyMessage.remove();
        }
    });
}

function loadUserPaymentMethods(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    const container = document.getElementById('userPaymentMethodsList');
    
    // Inicializar userPaymentMethods si no existe
    if (!user.userPaymentMethods) {
        user.userPaymentMethods = [];
    }
    
    let html = `
        <div class="row" id="userPaymentMethodsListContent">
    `;
    
    if (user.userPaymentMethods.length === 0) {
        html += `
            <div class="col-12">
                <div class="empty-search-results">
                    <i class="bi bi-credit-card"></i>
                    <p>No hay medios de pago personalizados</p>
                    <small class="text-muted">Agrega medios de pago personalizados para este usuario</small>
                </div>
            </div>
        `;
    } else {
        user.userPaymentMethods.forEach(method => {
            const statusClass = method.status === 'active' ? 'status-active' : 'status-inactive';
            const statusText = method.status === 'active' ? 'Activo' : 'Inactivo';
            
            html += `
                <div class="col-md-6 mb-3 user-payment-method-item">
                    <div class="payment-method-card">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <div class="d-flex align-items-center">
                                ${method.logo ? `
                                    <img src="${method.logo}" alt="${method.name}" class="payment-method-logo me-3" 
                                            style="width: 40px; height: 40px; object-fit: contain;" 
                                            onerror="this.style.display='none'">
                                ` : `
                                    <div class="payment-method-icon me-3">
                                        <i class="bi bi-credit-card"></i>
                                    </div>
                                `}
                                <div>
                                    <h6 class="mb-1">${method.name}</h6>
                                    <div class="text-success fw-bold fs-5">S/. ${method.balance ? method.balance.toFixed(2) : '0.00'}</div>
                                </div>
                            </div>
                            <span class="status-badge ${statusClass}">${statusText}</span>
                        </div>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="text-muted small">${method.transactionCount || 0} transacciones</span>
                            <div class="btn-group">
                                <button class="btn btn-sm btn-outline-warning" onclick="editUserPaymentMethod(${userId}, '${method.id}')">
                                    <i class="bi bi-pencil"></i>
                                </button>
                                <button class="btn btn-sm ${method.status === 'active' ? 'btn-outline-danger' : 'btn-outline-success'}" 
                                        onclick="${method.status === 'active' ? 'deactivateUserPaymentMethod' : 'activateUserPaymentMethod'}(${userId}, '${method.id}')">
                                    <i class="bi ${method.status === 'active' ? 'bi-eye-slash' : 'bi-eye'}"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-danger" onclick="deleteUserPaymentMethod(${userId}, '${method.id}')">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
    }
    
    html += `</div>`;
    container.innerHTML = html;
    
    // Funcionalidad de búsqueda
    document.getElementById('searchUserPaymentMethods').addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const items = container.querySelectorAll('.user-payment-method-item');
        let hasResults = false;
        
        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                item.style.display = 'block';
                hasResults = true;
            } else {
                item.style.display = 'none';
            }
        });
        
        // Mostrar mensaje si no hay resultados
        const emptyMessage = container.querySelector('.empty-search-results');
        if (!hasResults && items.length > 0) {
            if (!emptyMessage) {
                container.innerHTML += `
                    <div class="col-12">
                        <div class="empty-search-results">
                            <i class="bi bi-search"></i>
                            <p>No se encontraron medios de pago</p>
                            <small class="text-muted">Intenta con otros términos de búsqueda</small>
                        </div>
                    </div>
                `;
            }
        } else if (emptyMessage) {
            emptyMessage.remove();
        }
    });
}

// NUEVAS FUNCIONES PARA GESTIÓN DE PERSONALIZACIÓN DEL USUARIO
function showAddUserCategoryModal() {
    currentEditingCategoryId = null;
    document.getElementById('categoryModalLabel').textContent = 'Agregar Categoría Personalizada';
    document.getElementById('categoryName').value = '';
    document.getElementById('categoryIcon').value = 'bi-house';
    document.getElementById('saveCategoryBtn').textContent = 'Crear Categoría';
    document.getElementById('saveCategoryBtn').className = 'btn btn-success';
    document.getElementById('saveCategoryBtn').onclick = function() { saveUserCategory(currentViewingUserId); };
    
    const modal = new bootstrap.Modal(document.getElementById('categoryModal'));
    modal.show();
}

function saveUserCategory(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    const name = document.getElementById('categoryName').value.trim();
    const icon = document.getElementById('categoryIcon').value;
    
    if (!name) {
        showNotification('Por favor ingresa un nombre para la categoría', 'error');
        return;
    }
    
    const colors = ['success', 'primary', 'warning', 'danger', 'info', 'secondary'];
    const colorIndex = user.userCategories.length % colors.length;
    
    const newCategory = {
        id: 'user_cat_' + Date.now(),
        label: name,
        icon: icon,
        color: colors[colorIndex],
        transactionCount: 0,
        isCustom: true
    };
    
    user.userCategories.push(newCategory);
    saveUsers();
    loadUserCategories(userId);
    
    addActivity(`Categoría personalizada creada para usuario: ${name}`, 'system', userId);
    
    showNotification('Categoría personalizada creada exitosamente', 'success');
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('categoryModal'));
    modal.hide();
}

function editUserCategory(userId, categoryId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    const category = user.userCategories.find(c => c.id === categoryId);
    if (!category) return;
    
    currentEditingCategoryId = categoryId;
    document.getElementById('categoryModalLabel').textContent = 'Editar Categoría Personalizada';
    document.getElementById('categoryName').value = category.label;
    document.getElementById('categoryIcon').value = category.icon;
    document.getElementById('saveCategoryBtn').textContent = 'Actualizar Categoría';
    document.getElementById('saveCategoryBtn').className = 'btn btn-warning';
    document.getElementById('saveCategoryBtn').onclick = function() { updateUserCategory(userId, categoryId); };
    
    const modal = new bootstrap.Modal(document.getElementById('categoryModal'));
    modal.show();
}

function updateUserCategory(userId, categoryId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    const categoryIndex = user.userCategories.findIndex(c => c.id === categoryId);
    if (categoryIndex === -1) return;
    
    const name = document.getElementById('categoryName').value.trim();
    const icon = document.getElementById('categoryIcon').value;
    
    if (!name) {
        showNotification('Por favor ingresa un nombre para la categoría', 'error');
        return;
    }
    
    user.userCategories[categoryIndex].label = name;
    user.userCategories[categoryIndex].icon = icon;
    
    saveUsers();
    loadUserCategories(userId);
    
    addActivity(`Categoría personalizada actualizada: ${name}`, 'system', userId);
    
    showNotification('Categoría personalizada actualizada exitosamente', 'success');
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('categoryModal'));
    modal.hide();
    currentEditingCategoryId = null;
}

function deleteUserCategory(userId, categoryId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    const category = user.userCategories.find(c => c.id === categoryId);
    if (!category) return;
    
    if (!confirm(`¿Estás seguro de que deseas eliminar la categoría personalizada "${category.label}"?\n\nEsta acción no se puede deshacer.`)) {
        return;
    }
    
    user.userCategories = user.userCategories.filter(c => c.id !== categoryId);
    saveUsers();
    loadUserCategories(userId);
    
    addActivity(`Categoría personalizada eliminada: ${category.label}`, 'system', userId);
    showNotification('Categoría personalizada eliminada exitosamente', 'success');
}

// Funciones para subcategorías personalizadas
function showAddUserSubcategoryModal() {
    currentEditingSubcategoryId = null;
    document.getElementById('subcategoryModalLabel').textContent = 'Agregar Subcategoría Personalizada';
    document.getElementById('subcategoryName').value = '';
    document.getElementById('subcategoryIcon').value = 'bi-tag';
    document.getElementById('saveSubcategoryBtn').textContent = 'Crear Subcategoría';
    document.getElementById('saveSubcategoryBtn').className = 'btn btn-success';
    document.getElementById('saveSubcategoryBtn').onclick = function() { saveUserSubcategory(currentViewingUserId); };
    
    // Cargar categorías disponibles
    const parentCategorySelect = document.getElementById('parentCategory');
    parentCategorySelect.innerHTML = '';
    
    const user = users.find(u => u.id === currentViewingUserId);
    if (user) {
        user.userCategories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.label;
            parentCategorySelect.appendChild(option);
        });
    }
    
    const modal = new bootstrap.Modal(document.getElementById('subcategoryModal'));
    modal.show();
}

function saveUserSubcategory(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    const name = document.getElementById('subcategoryName').value.trim();
    const icon = document.getElementById('subcategoryIcon').value;
    const parentCategoryId = document.getElementById('parentCategory').value;
    
    if (!name) {
        showNotification('Por favor ingresa un nombre para la subcategoría', 'error');
        return;
    }
    
    const parentCategory = user.userCategories.find(c => c.id === parentCategoryId);
    
    const newSubcategory = {
        id: 'user_subcat_' + Date.now(),
        label: name,
        icon: icon,
        categoryId: parentCategoryId,
        categoryLabel: parentCategory ? parentCategory.label : 'Sin categoría',
        transactionCount: 0,
        isCustom: true
    };
    
    user.userSubcategories.push(newSubcategory);
    saveUsers();
    loadUserSubcategories(userId);
    
    addActivity(`Subcategoría personalizada creada para usuario: ${name}`, 'system', userId);
    
    showNotification('Subcategoría personalizada creada exitosamente', 'success');
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('subcategoryModal'));
    modal.hide();
}

function editUserSubcategory(userId, subcategoryId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    const subcategory = user.userSubcategories.find(s => s.id === subcategoryId);
    if (!subcategory) return;
    
    currentEditingSubcategoryId = subcategoryId;
    document.getElementById('subcategoryModalLabel').textContent = 'Editar Subcategoría Personalizada';
    document.getElementById('subcategoryName').value = subcategory.label;
    document.getElementById('subcategoryIcon').value = subcategory.icon;
    document.getElementById('saveSubcategoryBtn').textContent = 'Actualizar Subcategoría';
    document.getElementById('saveSubcategoryBtn').className = 'btn btn-warning';
    document.getElementById('saveSubcategoryBtn').onclick = function() { updateUserSubcategory(userId, subcategoryId); };
    
    // Cargar categorías disponibles
    const parentCategorySelect = document.getElementById('parentCategory');
    parentCategorySelect.innerHTML = '';
    
    user.userCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.label;
        if (category.id === subcategory.categoryId) {
            option.selected = true;
        }
        parentCategorySelect.appendChild(option);
    });
    
    const modal = new bootstrap.Modal(document.getElementById('subcategoryModal'));
    modal.show();
}

function updateUserSubcategory(userId, subcategoryId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    const subcategoryIndex = user.userSubcategories.findIndex(s => s.id === subcategoryId);
    if (subcategoryIndex === -1) return;
    
    const name = document.getElementById('subcategoryName').value.trim();
    const icon = document.getElementById('subcategoryIcon').value;
    const parentCategoryId = document.getElementById('parentCategory').value;
    
    if (!name) {
        showNotification('Por favor ingresa un nombre para la subcategoría', 'error');
        return;
    }
    
    const parentCategory = user.userCategories.find(c => c.id === parentCategoryId);
    
    user.userSubcategories[subcategoryIndex].label = name;
    user.userSubcategories[subcategoryIndex].icon = icon;
    user.userSubcategories[subcategoryIndex].categoryId = parentCategoryId;
    user.userSubcategories[subcategoryIndex].categoryLabel = parentCategory ? parentCategory.label : 'Sin categoría';
    
    saveUsers();
    loadUserSubcategories(userId);
    
    addActivity(`Subcategoría personalizada actualizada: ${name}`, 'system', userId);
    
    showNotification('Subcategoría personalizada actualizada exitosamente', 'success');
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('subcategoryModal'));
    modal.hide();
    currentEditingSubcategoryId = null;
}

function deleteUserSubcategory(userId, subcategoryId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    const subcategory = user.userSubcategories.find(s => s.id === subcategoryId);
    if (!subcategory) return;
    
    if (!confirm(`¿Estás seguro de que deseas eliminar la subcategoría personalizada "${subcategory.label}"?\n\nEsta acción no se puede deshacer.`)) {
        return;
    }
    
    user.userSubcategories = user.userSubcategories.filter(s => s.id !== subcategoryId);
    saveUsers();
    loadUserSubcategories(userId);
    
    addActivity(`Subcategoría personalizada eliminada: ${subcategory.label}`, 'system', userId);
    showNotification('Subcategoría personalizada eliminada exitosamente', 'success');
}

// Funciones para medios de pago personalizados
function showAddUserPaymentMethodModal() {
    currentEditingPaymentMethod = null;
    document.getElementById('paymentMethodModalLabel').textContent = 'Agregar Medio de Pago Personalizado';
    document.getElementById('paymentMethodName').value = '';
    document.getElementById('paymentMethodLogo').value = '';
    document.getElementById('savePaymentMethodBtn').textContent = 'Crear Medio de Pago';
    document.getElementById('savePaymentMethodBtn').className = 'btn btn-success';
    document.getElementById('savePaymentMethodBtn').onclick = function() { saveUserPaymentMethod(currentViewingUserId); };
    
    const modal = new bootstrap.Modal(document.getElementById('paymentMethodModal'));
    modal.show();
}

function saveUserPaymentMethod(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    const name = document.getElementById('paymentMethodName').value.trim();
    const logo = document.getElementById('paymentMethodLogo').value.trim();
    
    if (!name) {
        showNotification('Por favor ingresa un nombre para el medio de pago', 'error');
        return;
    }
    
    const newPaymentMethod = {
        id: 'user_pay_' + Date.now(),
        name: name,
        logo: logo || null,
        balance: 0,
        transactionCount: 0,
        status: 'active',
        isCustom: true
    };
    
    user.userPaymentMethods.push(newPaymentMethod);
    saveUsers();
    loadUserPaymentMethods(userId);
    
    addActivity(`Medio de pago personalizado creado para usuario: ${name}`, 'system', userId);
    
    showNotification('Medio de pago personalizado creado exitosamente', 'success');
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('paymentMethodModal'));
    modal.hide();
}

function editUserPaymentMethod(userId, methodId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    const method = user.userPaymentMethods.find(m => m.id === methodId);
    if (!method) return;
    
    currentEditingPaymentMethod = methodId;
    document.getElementById('paymentMethodModalLabel').textContent = 'Editar Medio de Pago Personalizado';
    document.getElementById('paymentMethodName').value = method.name;
    document.getElementById('paymentMethodLogo').value = method.logo || '';
    document.getElementById('savePaymentMethodBtn').textContent = 'Actualizar Medio de Pago';
    document.getElementById('savePaymentMethodBtn').className = 'btn btn-warning';
    document.getElementById('savePaymentMethodBtn').onclick = function() { updateUserPaymentMethod(userId, methodId); };
    
    const modal = new bootstrap.Modal(document.getElementById('paymentMethodModal'));
    modal.show();
}

function updateUserPaymentMethod(userId, methodId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    const methodIndex = user.userPaymentMethods.findIndex(m => m.id === methodId);
    if (methodIndex === -1) return;
    
    const name = document.getElementById('paymentMethodName').value.trim();
    const logo = document.getElementById('paymentMethodLogo').value.trim();
    
    if (!name) {
        showNotification('Por favor ingresa un nombre para el medio de pago', 'error');
        return;
    }
    
    user.userPaymentMethods[methodIndex].name = name;
    if (logo) {
        user.userPaymentMethods[methodIndex].logo = logo;
    }
    
    saveUsers();
    loadUserPaymentMethods(userId);
    
    addActivity(`Medio de pago personalizado actualizado: ${name}`, 'system', userId);
    
    showNotification('Medio de pago personalizado actualizado exitosamente', 'success');
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('paymentMethodModal'));
    modal.hide();
    currentEditingPaymentMethod = null;
}

function deleteUserPaymentMethod(userId, methodId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    const method = user.userPaymentMethods.find(m => m.id === methodId);
    if (!method) return;
    
    if (!confirm(`¿Estás seguro de que deseas eliminar el medio de pago personalizado "${method.name}"?\n\nEsta acción no se puede deshacer.`)) {
        return;
    }
    
    user.userPaymentMethods = user.userPaymentMethods.filter(m => m.id !== methodId);
    saveUsers();
    loadUserPaymentMethods(userId);
    
    addActivity(`Medio de pago personalizado eliminado: ${method.name}`, 'system', userId);
    showNotification('Medio de pago personalizado eliminado exitosamente', 'success');
}

function activateUserPaymentMethod(userId, methodId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    const method = user.userPaymentMethods.find(m => m.id === methodId);
    if (!method) return;
    
    method.status = 'active';
    saveUsers();
    loadUserPaymentMethods(userId);
    
    showNotification(`Medio de pago ${method.name} activado`, 'success');
}

function deactivateUserPaymentMethod(userId, methodId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    const method = user.userPaymentMethods.find(m => m.id === methodId);
    if (!method) return;
    
    if (confirm(`¿Estás seguro de que deseas desactivar el medio de pago ${method.name} para este usuario?`)) {
        method.status = 'inactive';
        saveUsers();
        loadUserPaymentMethods(userId);
        
        showNotification(`Medio de pago ${method.name} desactivado`, 'success');
    }
}

// Sistema de Reportes
function initializeReports() {
    if (chartsInitialized) return;
    
    loadSubscriptionStats();
    initializeReportCharts();
    chartsInitialized = true;
}

function loadSubscriptionStats() {
    // Precios de suscripción
    const PRICES = {
        'Mensual': 3.69,
        'Anual': 18.99,
        'De por vida': 49.99
    };
    
    // Calcular ingresos basados en usuarios reales
    let monthlyIncome = 0;
    let annualIncome = 0;
    let lifetimeIncome = 0;
    
    users.forEach(user => {
        const price = PRICES[user.subscriptionType];
        if (price) {
            switch (user.subscriptionType) {
                case 'Mensual':
                    monthlyIncome += price;
                    break;
                case 'Anual':
                    annualIncome += price;
                    break;
                case 'De por vida':
                    lifetimeIncome += price;
                    break;
            }
        }
    });
    
    const totalIncome = monthlyIncome + annualIncome + lifetimeIncome;
    
    // Actualizar la interfaz
    document.getElementById('totalIncome').textContent = `S/. ${totalIncome.toFixed(2)}`;
    document.getElementById('monthlyIncome').textContent = `S/. ${monthlyIncome.toFixed(2)}`;
    document.getElementById('annualIncome').textContent = `S/. ${annualIncome.toFixed(2)}`;
    document.getElementById('lifetimeIncome').textContent = `S/. ${lifetimeIncome.toFixed(2)}`;
    
    // Actualizar gráficas con datos reales
    updateReportCharts();
}

// Actualizar gráficas con datos reales
function updateReportCharts() {
    // Contar usuarios por tipo de suscripción
    const subscriptionCounts = {
        'Sin suscripción': users.filter(u => u.subscriptionType === 'Sin suscripción').length,
        'Mensual': users.filter(u => u.subscriptionType === 'Mensual').length,
        'Anual': users.filter(u => u.subscriptionType === 'Anual').length,
        'De por vida': users.filter(u => u.subscriptionType === 'De por vida').length
    };
    
    // Actualizar gráfica de distribución de suscriptores
    if (window.subscriptionDistributionChart) {
        window.subscriptionDistributionChart.data.datasets[0].data = [
            subscriptionCounts['Sin suscripción'],
            subscriptionCounts['Mensual'],
            subscriptionCounts['Anual'],
            subscriptionCounts['De por vida']
        ];
        window.subscriptionDistributionChart.update();
    }
    
    // Actualizar gráfica de crecimiento de usuarios
    if (window.userGrowthChartReportes) {
        // Generar datos de crecimiento basados en usuarios reales
        const userGrowthData = generateUserGrowthData();
        window.userGrowthChartReportes.data.datasets[0].data = userGrowthData;
        window.userGrowthChartReportes.update();
    }
}

// Generar datos de crecimiento basados en usuarios reales
function generateUserGrowthData() {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const currentMonth = new Date().getMonth();
    const data = [];
    
    // Contar usuarios por mes de registro
    const usersByMonth = {};
    months.forEach((month, index) => {
        usersByMonth[index] = 0;
    });
    
    users.forEach(user => {
        const registrationMonth = new Date(user.registrationDate).getMonth();
        if (registrationMonth <= currentMonth) {
            usersByMonth[registrationMonth]++;
        }
    });
    
    // Calcular crecimiento acumulado
    let cumulative = 0;
    for (let i = 0; i <= currentMonth; i++) {
        cumulative += usersByMonth[i];
        data.push(cumulative);
    }
    
    // Rellenar con datos estimados para meses futuros
    for (let i = currentMonth + 1; i < 12; i++) {
        const growthRate = 0.1; // 10% de crecimiento mensual estimado
        cumulative = Math.round(cumulative * (1 + growthRate));
        data.push(cumulative);
    }
    
    return data;
}

function initializeReportCharts() {
    // Gráfica de crecimiento de usuarios
    const userGrowthCtx = document.getElementById('userGrowthChartReportes').getContext('2d');
    window.userGrowthChartReportes = new Chart(userGrowthCtx, {
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
    
    // Gráfica de distribución de suscriptores
    const subscriptionCtx = document.getElementById('subscriptionDistributionChart').getContext('2d');
    window.subscriptionDistributionChart = new Chart(subscriptionCtx, {
        type: 'doughnut',
        data: {
            labels: ['Sin suscripción', 'Mensual', 'Anual', 'De por vida'],
            datasets: [{
                data: [
                    users.filter(u => u.subscriptionType === 'Sin suscripción').length,
                    users.filter(u => u.subscriptionType === 'Mensual').length,
                    users.filter(u => u.subscriptionType === 'Anual').length,
                    users.filter(u => u.subscriptionType === 'De por vida').length
                ],
                backgroundColor: ['#6c757d', '#0ea46f', '#ffc107', '#06a3ff'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
    
    // Gráfica de ingresos por suscripción
    const incomeCtx = document.getElementById('subscriptionIncomeChart').getContext('2d');
    new Chart(incomeCtx, {
        type: 'bar',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Mensual',
                    data: [1200, 1900, 1500, 1800, 2200, 2500],
                    backgroundColor: '#0ea46f'
                },
                {
                    label: 'Anual',
                    data: [1800, 2200, 1900, 2100, 2400, 2800],
                    backgroundColor: '#ffc107'
                },
                {
                    label: 'De por vida',
                    data: [200, 300, 250, 400, 350, 500],
                    backgroundColor: '#06a3ff'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0,0,0,0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return 'S/.' + value;
                        }
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

// Sistema de Notificaciones
function showNotification(message, type = 'success') {
    // Crear notificación toast
    const toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        const container = document.createElement('div');
        container.className = 'toast-container position-fixed top-0 end-0 p-3';
        document.body.appendChild(container);
    }

    const toastId = 'toast-' + Date.now();
    const typeIcons = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    
    const typeColors = {
        'success': 'success',
        'error': 'danger',
        'warning': 'warning',
        'info': 'primary'
    };

    const toastHTML = `
        <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="5000">
            <div class="toast-header bg-${typeColors[type]} text-white">
                <i class="bi bi-${typeIcons[type]} me-2"></i>
                <strong class="me-auto">FinLi Admin</strong>
                <small>Ahora</small>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `;

    toastContainer.insertAdjacentHTML('beforeend', toastHTML);
    
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
    
    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });
}

// Inicializar chart para Inicio
const userGrowthCtxInicio = document.getElementById('userGrowthChartInicio').getContext('2d');
new Chart(userGrowthCtxInicio, {
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

// Efectos hover mejorados
document.querySelectorAll('.card-stat, .chart-card, .table-card, .card-report, .payment-method-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});