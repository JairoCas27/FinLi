// Variables globales compartidas
let users = [];
let activities = [];
let currentEditingUserId = null;
let currentDeletingUserId = null;
let currentViewingUserId = null;

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

// Inicialización común
document.addEventListener('DOMContentLoaded', function() {
    // Establecer año actual
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Cargar datos comunes
    loadCommonData();
});

function loadCommonData() {
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
    
    const storedPaymentMethods = localStorage.getItem('finliPaymentMethods');
    if (storedPaymentMethods) {
        paymentMethods = JSON.parse(storedPaymentMethods);
    }
    
    loadDefaultCategories();
}

function loadDefaultCategories() {
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

    defaultSubcategories = {};
    Object.keys(userCategoriesMap).forEach(key => {
        defaultSubcategories[key] = userCategoriesMap[key].subcategories;
    });
}

function saveUsers() {
    localStorage.setItem('finliUsers', JSON.stringify(users));
}

function saveActivities() {
    localStorage.setItem('finliActivities', JSON.stringify(activities));
}

function savePaymentMethods() {
    localStorage.setItem('finliPaymentMethods', JSON.stringify(paymentMethods));
}

function saveDefaultCategories() {
    localStorage.setItem('finliDefaultCategories', JSON.stringify(defaultCategories));
}

function saveDefaultSubcategories() {
    localStorage.setItem('finliDefaultSubcategories', JSON.stringify(defaultSubcategories));
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
}

function showNotification(message, type = 'success') {
    // Crear notificación toast
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
        document.body.appendChild(toastContainer);
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

// Funciones para gestión de usuarios (compartidas)
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
        userCategories: [],
        userSubcategories: [],
        userPaymentMethods: []
    };
    
    users.push(newUser);
    saveUsers();
    
    addActivity(`Nuevo usuario registrado: ${name}`, 'user', newUser.id, { userName: name, email });
    
    showNotification('Usuario creado exitosamente', 'success');
    
    // Limpiar formulario
    document.getElementById('addUserForm').reset();
    const preview = document.getElementById('addPhotoPreview');
    if (preview) preview.style.display = 'none';
    
    // Cerrar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('addUserModal'));
    if (modal) modal.hide();
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
    if (user.photo && preview) {
        preview.src = user.photo;
        preview.style.display = 'block';
    } else if (preview) {
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
            
            addActivity(`Usuario actualizado: ${name}`, 'user', user.id, { userName: name, email });
            
            showNotification('Usuario actualizado exitosamente', 'success');
            
            // Cerrar modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
            modal.hide();
        };
        reader.readAsDataURL(photoFile);
    } else {
        saveUsers();
        
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
    
    addActivity(`Usuario eliminado: ${userName}`, 'user');
    
    showNotification('Usuario eliminado exitosamente', 'success');
    
    // Cerrar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('deleteUserModal'));
    modal.hide();
}

// Funciones para gestión de categorías (compartidas)
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
    
    addActivity(`Categoría ${currentEditingCategoryId ? 'actualizada' : 'creada'}: ${name}`, 'system');
    
    showNotification(`Categoría ${currentEditingCategoryId ? 'actualizada' : 'creada'} exitosamente`, 'success');
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('categoryModal'));
    modal.hide();
    currentEditingCategoryId = null;
}

// Funciones para generar datos de gráficas
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

// Funciones para actualizar contadores
function updateUserCount() {
    const totalUsers = users.length;
    const subscribedUsers = users.filter(user => user.subscriptionType !== "Sin suscripción").length;
    
    const totalUsersCount = document.getElementById('totalUsersCount');
    const totalSubscriptions = document.getElementById('totalSubscriptions');
    const totalUsersElement = document.getElementById('totalUsers');
    const totalUsers2 = document.getElementById('totalUsers2');
    const totalUsersInicio = document.getElementById('totalUsersInicio');
    
    if (totalUsersCount) totalUsersCount.textContent = totalUsers;
    if (totalSubscriptions) totalSubscriptions.textContent = subscribedUsers;
    if (totalUsersElement) totalUsersElement.textContent = totalUsers;
    if (totalUsers2) totalUsers2.textContent = totalUsers;
    if (totalUsersInicio) totalUsersInicio.textContent = totalUsers;
}

// =============================================
// SISTEMA DE CIERRE DE SESIÓN
// =============================================

function setupLogoutButton() {
    const logoutButtons = document.querySelectorAll('.btn-logout');
    
    logoutButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Confirmación simple
            if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                // Mostrar notificación
                showNotification('Cerrando sesión...', 'info');
                
                // Redirigir después de un breve delay
                setTimeout(() => {
                    // Cambia esta ruta según tu necesidad
                    window.location.href = '../Inicio/inicio.html';
                }, 1000);
            }
        });
    });
}

// Inicializar cuando se cargue el DOM
document.addEventListener('DOMContentLoaded', function() {
    setupLogoutButton();
});