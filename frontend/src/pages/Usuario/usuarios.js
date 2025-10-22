// ---- VARIABLES GLOBALES ----
let transactions = [];
let selectedCategory = null;
let selectedSubCategory = null;
let selectedImage = null;
let editingTransactionId = null;
let currentPeriod = 'mensual';
let currentFilter = 'categorias';

// Variables globales para múltiples selecciones en informes
let selectedCategories = [];
let selectedSubCategories = [];

// ---- CARGAR DATOS REALES DEL USUARIO ----
function loadUserFromBackend() {
    const raw = localStorage.getItem('usuario');
    if (!raw) { // no hay login
        location.href = '../Autenticacion/login.html';
        return;
    }
    const u = JSON.parse(raw); // viene del endpoint UsuarioResponse

    // mapeamos a la estructura que ya usa el front
    userProfile = {
        name: `${u.nombre} ${u.apellidoPaterno} ${u.apellidoMaterno}`,
        firstName: u.nombre,
        lastName: `${u.apellidoPaterno} ${u.apellidoMaterno}`,
        email: u.email,
        age: u.edad,
        avatar: null // más adelante puedes agregar campo avatar en BD
    };

    // pisamos localStorage para que el resto del código siga igual
    localStorage.setItem('finli-profile', JSON.stringify(userProfile));
}

// ---- INICIALIZACIÓN ----
document.addEventListener('DOMContentLoaded', () => {
    loadUserFromBackend(); // ✅ datos reales
    loadDataFromLocalStorage(); // carga transacciones, etc.
});

//Cargar categorías al iniciar la página
loadUserCategories(); // ✅ nuevo

async function loadUserCategories() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario || !usuario.email) return;

    try {
        const res = await fetch(`http://localhost:8080/api/categorias?email=${usuario.email}`);
        const categorias = await res.json();

        // Limpiar categorías previas
        customCategories = [];
        customSubcategories = {};

        categorias.forEach(cat => {
            customCategories.push({
                name: cat.nombreCategoria.toLowerCase(),
                label: cat.nombreCategoria,
                icon: 'bi-tag' // puedes mejorar esto después
            });

            // Cargar subcategorías
            fetch(`http://localhost:8080/api/categorias/${cat.idCategoria}/subcategorias?email=${usuario.email}`)
                .then(res => res.json())
                .then(subs => {
                    customSubcategories[cat.nombreCategoria.toLowerCase()] = subs.map(s => ({
                        name: s.nombreSubcategoria.toLowerCase(),
                        label: s.nombreSubcategoria,
                        icon: 'bi-tag'
                    }));
                    updateCategoryButtons(); // refrescar botones
                });
        });

    } catch (err) {
        console.error('Error al cargar categorías:', err);
    }
}

// Array para notificaciones
let notifications = [];

// Categorías personalizadas
let customCategories = [];
let customSubcategories = {};

// Mapeo de subcategorías por categoría
const subcategoriesMap = {
    vivienda: [
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
    ],
    transporte: [
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
    ],
    alimentacion: [
        { name: 'supermercado', icon: 'bi-cart4', label: 'Supermercado' },
        { name: 'mercado', icon: 'bi-shop-window', label: 'Mercado' },
        { name: 'restaurantes', icon: 'bi-sina-weibo', label: 'Restaurantes' },
        { name: 'delivery', icon: 'bi-truck', label: 'Comida a Domicilio' },
        { name: 'cafetería', icon: 'bi-cup-hot', label: 'Cafetería' }
    ],
    finanzas: [
        { name: 'deudas', icon: 'bi-wallet2', label: 'Deudas' },
        { name: 'préstamos', icon: 'bi-bank', label: 'Préstamos' },
        { name: 'tarjetaCrédito', icon: 'bi-credit-card', label: 'Tarjetas de Crédito' },
        { name: 'ahorro', icon: 'bi-piggy-bank', label: 'Ahorro' },
        { name: 'inversión', icon: 'bi-graph-up', label: 'Inversión' }
    ],
    salud: [
        { name: 'médicos', icon: 'bi-heart-pulse', label: 'Médicos' },
        { name: 'medicamentos', icon: 'bi-capsule', label: 'Medicamentos' },
        { name: 'gimnasio', icon: 'bi-activity', label: 'Gimnasio' },
        { name: 'deportes', icon: 'bi-trophy', label: 'Deportes' },
        { name: 'belleza', icon: 'bi-brush', label: 'Belleza' },
        { name: 'peluquería', icon: 'bi-scissors', label: 'Peluquería' },
        { name: 'cosméticos', icon: 'bi-brush', label: 'Cosméticos' },
        { name: 'seguroMédico', icon: 'bi-file-medical-fill', label: 'Seguro Médico' }
    ],
    entretenimiento: [
        { name: 'suscripciones', icon: 'bi-collection-play', label: 'Suscripciones' },
        { name: 'netflix', icon: 'bi-tv', label: 'Netflix' },
        { name: 'spotify', icon: 'bi-spotify', label: 'Spotify' },
        { name: 'amazon', icon: 'bi-amazon', label: 'Amazon Prime' },
        { name: 'software', icon: 'bi-file-earmark-code', label: 'Software' },
        { name: 'viajes', icon: 'bi-geo-alt', label: 'Viajes' },
        { name: 'vacaciones', icon: 'bi-suitcase', label: 'Vacaciones' },
        { name: 'hoteles', icon: 'bi-building', label: 'Hoteles' },
        { name: 'tours', icon: 'bi-globe-americas', label: 'Tours' },
        { name: 'Cine', icon: 'bi-film', label: 'Cine' },
        { name: 'Teatro', icon: 'bi-snapchat', label: 'Teatro' },
        { name: 'conciertos', icon: 'bi-music-note-list', label: 'Conciertos' },
        { name: 'museos', icon: 'bi-shop-window', label: 'Museos' },
        { name: 'juegos', icon: 'bi-controller', label: 'Juegos' },
        { name: 'videojuegos', icon: 'bi-joystick', label: 'Videojuegos' }
    ],
    ropa: [
        { name: 'vestimenta', icon: 'bi-shop', label: 'Vestimenta' },
        { name: 'calzado', icon: 'bi-bag', label: 'Calzado' }
    ],
    electronica: [
        { name: 'gadgets', icon: 'bi-earbuds', label: 'Gadgets' },
        { name: 'teléfonos', icon: 'bi-phone-vibrate', label: 'Teléfonos' },
        { name: 'laptops', icon: 'bi-laptop', label: 'Laptops' },
        { name: 'consolas', icon: 'bi-controller', label: 'Consolas' }
    ],
    hogar: [
        { name: 'muebles', icon: 'bi-box-seam', label: 'Muebles' },
        { name: 'decoración', icon: 'bi-palette', label: 'Decoración' },
        { name: 'Utensilios', icon: 'bi-basket', label: 'Utensilios' },
        { name: 'Regalos', icon: 'bi-gift', label: 'Regalos' }
    ],
    educacion: [
        { name: 'matrícula', icon: 'bi-mortarboard', label: 'Matrícula' },
        { name: 'colegiatura', icon: 'bi-cash-stack', label: 'Colegiatura' },
        { name: 'libros', icon: 'bi-book', label: 'Libros' },
        { name: 'materiales', icon: 'bi-pencil', label: 'Materiales' },
        { name: 'cursos', icon: 'bi-journal', label: 'Cursos' },
        { name: 'Talleres', icon: 'bi-mortarboard-fill', label: 'Talleres' }
    ]
};

// ---- INICIALIZACIÓN AL CARGAR LA PÁGINA ----
document.addEventListener('DOMContentLoaded', function() {
    // Cargar datos desde localStorage
    loadDataFromLocalStorage();
    
    // Cargar categorías personalizadas
    loadCustomCategoriesFromLocalStorage();
    
    // Establecer fecha y hora actual
    const now = new Date();
    const formattedNow = now.toISOString().slice(0, 16);
    
    // Solo establecer valores si los elementos existen
    const dateTimeInput = document.getElementById('transactionDateTime');
    const dateTimeInputPagos = document.getElementById('transactionDateTimePagos');
    
    if (dateTimeInput) dateTimeInput.value = formattedNow;
    if (dateTimeInputPagos) dateTimeInputPagos.value = formattedNow;
    
    // Inicializar componentes
    initializeNavigation();
    initializeCategoryButtons();
    initializeEventListeners();
    initializeProfile();
    initializeNotifications();
    
    // Renderizar transacciones
    renderTransactions();
    renderTransactionsPagos();
    updateBalance();
    
    // Inicializar filtros dinámicos
    initializeDynamicFilters();
    
    // Inicializar gráficos (solo si estamos en la sección de informes)
    if (document.getElementById('informes').classList.contains('active')) {
        initializeCharts();
    }
});

// ---- CARGAR DATOS DESDE LOCALSTORAGE ----
function loadDataFromLocalStorage() {
    // Cargar transacciones
    const savedTransactions = localStorage.getItem('finli-transactions');
    if (savedTransactions) {
        transactions = JSON.parse(savedTransactions);
    }
    
    // Cargar perfil
    const savedProfile = localStorage.getItem('finli-profile');
    if (savedProfile) {
        userProfile = JSON.parse(savedProfile);
    }
    
    // Cargar notificaciones
    const savedNotifications = localStorage.getItem('finli-notifications');
    if (savedNotifications) {
        notifications = JSON.parse(savedNotifications);
    }
}

// ---- GUARDAR DATOS EN LOCALSTORAGE ----
function saveTransactionsToLocalStorage() {
    localStorage.setItem('finli-transactions', JSON.stringify(transactions));
}

function saveProfileToLocalStorage() {
    localStorage.setItem('finli-profile', JSON.stringify(userProfile));
}

function saveNotificationsToLocalStorage() {
    localStorage.setItem('finli-notifications', JSON.stringify(notifications));
}

// ---- SISTEMA DE NAVEGACIÓN ----
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    const mainTitle = document.getElementById('main-title');
    const mainSubtitle = document.getElementById('main-subtitle');
    const floatingAddBtn = document.getElementById('floatingAddBtn');

    // Verificar que los elementos existen
    if (!navLinks.length || !contentSections.length || !mainTitle || !mainSubtitle) {
        console.warn('Elementos de navegación no encontrados');
        return;
    }

    const sectionData = {
        inicio: {
            title: 'Bienvenido, <span class="text-gradient">Jairo</span>',
            subtitle: 'Panel de control personal'
        },
        pagos: {
            title: 'Tu <span class="text-gradient">Agenda</span> de Pagos',
            subtitle: 'Reportes mensuales y semanales'
        },
        informes: {
            title: 'Tus <span class="text-gradient">Finanzas</span> en Detalles',
            subtitle: 'Análisis y reportes financieros'
        },
        perfil: {
            title: 'Mi <span class="text-gradient">Perfil</span>',
            subtitle: 'Administra tu información personal'
        }
    };

    // Inicializar navegación
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
            }

            if (targetSection === 'informes') {
                setTimeout(() => {
                    updateCharts();
                }, 100);
            }
        });
    });

    // Botón flotante
    if (floatingAddBtn) {
        floatingAddBtn.addEventListener('click', function() {
            document.querySelectorAll('.nav-link').forEach(nav => nav.classList.remove('active'));
            const inicioLink = document.querySelector('[data-section="inicio"]');
            if (inicioLink) inicioLink.classList.add('active');
            
            document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));
            document.getElementById('inicio').classList.add('active');
            
            mainTitle.innerHTML = sectionData.inicio.title;
            mainSubtitle.textContent = sectionData.inicio.subtitle;
            
            const cardStat = document.querySelector('.card-stat');
            if (cardStat) {
                cardStat.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

// ---- GESTIÓN DE CATEGORÍAS Y SUBCATEGORÍAS ----
function initializeCategoryButtons() {
    // Cargar categorías personalizadas desde localStorage
    loadCustomCategoriesFromLocalStorage();
    
    // Actualizar los botones de categorías para incluir las personalizadas
    updateCategoryButtons();
    
    // Categorías en Inicio
    const inicioCategoryBtns = document.querySelectorAll('#inicio .category-btn');
    if (inicioCategoryBtns.length > 0) {
        inicioCategoryBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                if (this.id === 'personalize-categories-btn') {
                    showCustomizeCategoriesModal();
                    return;
                }
                
                document.querySelectorAll('#inicio .category-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                selectedCategory = this.getAttribute('data-category');
                
                // Mostrar subcategorías
                showSubcategories('inicio', selectedCategory);
            });
        });
    }
    
    // Categorías en Pagos
    const pagosCategoryBtns = document.querySelectorAll('#pagos .category-btn');
    if (pagosCategoryBtns.length > 0) {
        pagosCategoryBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                if (this.id === 'personalize-categories-btn-pagos') {
                    showCustomizeCategoriesModal();
                    return;
                }
                
                document.querySelectorAll('#pagos .category-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                selectedCategory = this.getAttribute('data-category');
                
                // Mostrar subcategorías
                showSubcategories('pagos', selectedCategory);
            });
        });
    }
}

// Función para mostrar subcategorías
function showSubcategories(section, category) {
    const containerId = section === 'inicio' ? 'subcategories-container' : 'subcategories-container-pagos';
    const container = document.getElementById(containerId);
    
    if (!container) return;
    
    // Buscar subcategorías en categorías predefinidas y personalizadas
    const subcategories = subcategoriesMap[category] || customSubcategories[category] || [];
    
    if (subcategories.length > 0) {
        let html = `
            <div class="section-divider"></div>
            <h6 class="d-flex align-items-center gap-2 mb-3 text-warning">
                <i class="bi bi-tags"></i> Sub-Categoría ${getCategoryLabel(category)}
            </h6>
            <div class="category-buttons">
        `;
        
        subcategories.forEach(sub => {
            html += `
                <button class="subcategory-btn" data-category="${sub.name}">
                    <i class="${sub.icon}"></i> ${sub.label}
                </button>
            `;
        });
        
        html += `</div>`;
        container.innerHTML = html;
        
        // Añadir event listeners a los botones de subcategoría
        document.querySelectorAll(`#${containerId} .subcategory-btn`).forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll(`#${containerId} .subcategory-btn`).forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                selectedSubCategory = this.getAttribute('data-category');
            });
        });
    } else {
        container.innerHTML = '';
    }
}

// ---- SISTEMA DE FILTROS DINÁMICOS ----
function initializeDynamicFilters() {
    // Filtros para Inicio y Pagos
    initializeTransactionFilters();
    
    // Filtros para Informes
    initializeReportFilters();
}

function initializeTransactionFilters() {
    // Inicializar filtros para Inicio
    const inicioFilterBtn = document.getElementById('FiltroTraProfileBtn');
    const inicioFiltersContainer = document.querySelector('#inicio .filters-container');
    
    if (inicioFilterBtn && inicioFiltersContainer) {
        inicioFilterBtn.addEventListener('click', function() {
            inicioFiltersContainer.classList.toggle('d-none');
            
            // Cambiar el ícono del botón según el estado
            const icon = inicioFilterBtn.querySelector('i');
            if (inicioFiltersContainer.classList.contains('d-none')) {
                icon.className = 'bi bi-funnel';
                inicioFilterBtn.innerHTML = '<i class="bi bi-funnel"></i> Filtro';
            } else {
                icon.className = 'bi bi-funnel-fill';
                inicioFilterBtn.innerHTML = '<i class="bi bi-funnel-fill"></i> Ocultar Filtros';
            }
        });
        
        // Event listeners para los botones de periodo en Inicio
        document.querySelectorAll('#inicio .btn-group .btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('#inicio .btn-group .btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentPeriod = this.getAttribute('data-period');
                
                // Mostrar el filtro correspondiente
                showTransactionFilter('inicio', currentPeriod);
                renderTransactions();
            });
        });
    }
    
    // Inicializar filtros para Pagos
    const pagosFilterBtn = document.getElementById('FiltroTraProfileBtnPagos');
    const pagosFiltersContainer = document.getElementById('filters-container-pagos');
    
    if (pagosFilterBtn && pagosFiltersContainer) {
        pagosFilterBtn.addEventListener('click', function() {
            pagosFiltersContainer.classList.toggle('d-none');
            
            // Cambiar el ícono del botón según el estado
            const icon = pagosFilterBtn.querySelector('i');
            if (pagosFiltersContainer.classList.contains('d-none')) {
                icon.className = 'bi bi-funnel';
                pagosFilterBtn.innerHTML = '<i class="bi bi-funnel"></i> Filtro';
            } else {
                icon.className = 'bi bi-funnel-fill';
                pagosFilterBtn.innerHTML = '<i class="bi bi-funnel-fill"></i> Ocultar Filtros';
            }
        });
        
        // Event listeners para los botones de periodo en Pagos
        document.querySelectorAll('#pagos .btn-group .btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('#pagos .btn-group .btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentPeriod = this.getAttribute('data-period');
                
                // Mostrar el filtro correspondiente
                showTransactionFilter('pagos', currentPeriod);
                renderTransactionsPagos();
            });
        });
    }
    
    // Mostrar filtro inicial
    showTransactionFilter('inicio', 'mensual');
    showTransactionFilter('pagos', 'mensual');
}

function showTransactionFilter(section, period) {
    const containerId = `${section}-filter-container`;
    let container = document.getElementById(containerId);
    
    // Si no existe el contenedor, crearlo
    if (!container) {
        let filterRow;
        if (section === 'inicio') {
            filterRow = document.querySelector(`#${section} .filters-container`);
        } else {
            filterRow = document.getElementById('filters-container-pagos');
        }
        
        if (filterRow) {
            const newCol = document.createElement('div');
            newCol.className = 'col-12 col-md-6 mt-2';
            newCol.id = containerId;
            filterRow.appendChild(newCol);
            container = newCol;
        }
    }
    
    let html = '';
    const now = new Date();
    
    switch(period) {
        case 'mensual':
            const currentMonth = now.toISOString().slice(0, 7);
            html = `
                <div class="filter-group">
                    <div class="filter-label">Selecciona un mes</div>
                    <input type="month" class="form-control" id="${section}-month-filter" value="${currentMonth}">
                </div>
            `;
            break;
        case 'quincenal':
        case 'semanal':
            const startDate = new Date(now);
            const endDate = new Date(now);
            
            if (period === 'semanal') {
                startDate.setDate(now.getDate() - now.getDay());
                endDate.setDate(now.getDate() + (6 - now.getDay()));
            } else { // quincenal
                if (now.getDate() <= 15) {
                    startDate.setDate(1);
                    endDate.setDate(15);
                } else {
                    startDate.setDate(16);
                    endDate.setDate(new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate());
                }
            }
            
            html = `
                <div class="filter-group">
                    <div class="filter-label">Selecciona ${period === 'semanal' ? 'semana' : 'quincena'}</div>
                    <div class="row g-2">
                        <div class="col-6">
                            <input type="date" class="form-control" id="${section}-start-date" 
                                   value="${startDate.toISOString().slice(0, 10)}">
                        </div>
                        <div class="col-6">
                            <input type="date" class="form-control" id="${section}-end-date" 
                                   value="${endDate.toISOString().slice(0, 10)}">
                        </div>
                    </div>
                </div>
            `;
            break;
        case 'diario':
            html = `
                <div class="filter-group">
                    <div class="filter-label">Selecciona un día</div>
                    <input type="date" class="form-control" id="${section}-day-filter" value="${now.toISOString().slice(0, 10)}">
                </div>
            `;
            break;
    }
    
    if (container) {
        container.innerHTML = html;
        
        // Agregar event listeners a los nuevos inputs
        const inputs = container.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('change', () => {
                if (section === 'inicio') {
                    renderTransactions();
                } else {
                    renderTransactionsPagos();
                }
            });
        });
    }
}

// Inicialización de filtros de informes
function initializeReportFilters() {
    // Filtros de periodo para Informes
    const periodBtns = document.querySelectorAll('#informes .btn-group .btn[data-period]');
    if (periodBtns.length > 0) {
        periodBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('#informes .btn-group .btn[data-period]').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentPeriod = this.getAttribute('data-period');
                
                // Mostrar filtro de periodo
                showReportPeriodFilter();
                
                // Mostrar todos los gráficos
                showAllCharts();
                
                // Actualizar gráficos
                updateCharts();
            });
        });
    }
    
    // Filtros de categoría para Informes
    const filterBtns = document.querySelectorAll('#informes .btn-group .btn[data-filter]');
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('#informes .btn-group .btn[data-filter]').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentFilter = this.getAttribute('data-filter');
                
                // Si es "Limpiar", resetear filtros
                if (currentFilter === 'limpiar') {
                    resetReportFilters();
                    return;
                }
                
                // Mostrar filtro de categorías
                showReportCategoryFilter();
                
                // Mostrar todos los gráficos
                showAllCharts();
                
                // Actualizar gráficos
                updateCharts();
            });
        });
    }
    
    // Mostrar ambos filtros inicialmente
    showReportPeriodFilter();
    showReportCategoryFilter();
}

// Mostrar el filtro de periodo
function showReportPeriodFilter() {
    let container = document.getElementById('informes-period-filter');
    
    if (!container) {
        const filterRow = document.querySelector('#informes .filters-container');
        if (filterRow) {
            const newCol = document.createElement('div');
            newCol.className = 'col-md-4 mt-2';
            newCol.id = 'informes-period-filter';
            filterRow.appendChild(newCol);
            container = newCol;
        }
    }
    
    if (!container) return;
    
    container.style.display = 'block';
    
    let html = '';
    const now = new Date();
    
    switch(currentPeriod) {
        case 'mensual':
            const currentMonth = now.toISOString().slice(0, 7);
            html = `
                <div class="filter-group">
                    <div class="filter-label">Selecciona un mes</div>
                    <input type="month" class="form-control" id="informes-month-filter" value="${currentMonth}">
                </div>
            `;
            break;
        case 'quincenal':
        case 'semanal':
            const startDate = new Date(now);
            const endDate = new Date(now);
            
            if (currentPeriod === 'semanal') {
                startDate.setDate(now.getDate() - now.getDay());
                endDate.setDate(now.getDate() + (6 - now.getDay()));
            } else { // quincenal
                if (now.getDate() <= 15) {
                    startDate.setDate(1);
                    endDate.setDate(15);
                } else {
                    startDate.setDate(16);
                    endDate.setDate(new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate());
                }
            }
            
            html = `
                <div class="filter-group">
                    <div class="filter-label">Selecciona ${currentPeriod === 'semanal' ? 'semana' : 'quincena'}</div>
                    <div class="row g-2">
                        <div class="col-6">
                            <input type="date" class="form-control" id="informes-start-date" 
                                value="${startDate.toISOString().slice(0, 10)}">
                        </div>
                        <div class="col-6">
                            <input type="date" class="form-control" id="informes-end-date" 
                                value="${endDate.toISOString().slice(0, 10)}">
                        </div>
                    </div>
                </div>
            `;
            break;
    }
    
    container.innerHTML = html;
    
    // Agregar event listeners
    const inputs = container.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('change', function() {
            showAllCharts();
            updateCharts();
        });
    });
}

// Mostrar el filtro de categoría con selección múltiple
function showReportCategoryFilter() {
    let container = document.getElementById('informes-category-filter');
    
    if (!container) {
        const filterRow = document.querySelector('#informes .filters-container');
        if (filterRow) {
            const newCol = document.createElement('div');
            newCol.className = 'col-md-8 mt-2';
            newCol.id = 'informes-category-filter';
            filterRow.appendChild(newCol);
            container = newCol;
        }
    }
    
    if (!container) return;
    
    container.style.display = 'block';
    
    let html = `
        <div class="category-buttons" id="informes-category-buttons">
            <button class="category-btn" data-category="vivienda">
                <i class="bi bi-house"></i> Vivienda
            </button>   
            <button class="category-btn" data-category="transporte">
                <i class="bi bi-car-front"></i> Transporte
            </button>                         
            <button class="category-btn" data-category="alimentacion">
                <i class="bi bi-cup-straw"></i> Alimentacion
            </button>
            <button class="category-btn" data-category="finanzas">
                <i class="bi bi-cash-coin"></i> Finanzas Personales
            </button>
            <button class="category-btn" data-category="salud">
                <i class="bi bi-heart-pulse"></i> Cuidado Personal y Salud
            </button>
            <button class="category-btn" data-category="entretenimiento">
                <i class="bi bi-controller"></i> Entretenimiento y Ocio
            </button>
            <button class="category-btn" data-category="ropa">
                <i class="bi bi-bag"></i> Ropa
            </button>
            <button class="category-btn" data-category="electronica">
                <i class="bi bi-pc-display"></i> Electrónica
            </button>
            <button class="category-btn" data-category="hogar">
                <i class="bi bi-houses"></i> Artículos del Hogar
            </button>
            <button class="category-btn" data-category="educacion">
                <i class="bi bi-book"></i> Educación
            </button>
        </div>

        <div class="mt-3">
            <button class="btn btn-sm btn-outline-primary" id="show-subcategories-btn">
                <i class="bi bi-arrow-down"></i> Ver Subcategorías
            </button>
        </div>

        <div id="informes-subcategories-container" style="display: none;">
            <!-- Las subcategorías se cargarán aquí dinámicamente -->
        </div>
    `;
    
    container.innerHTML = html;
    
    // Configurar event listeners para categorías (selección múltiple)
    document.querySelectorAll('#informes-category-buttons .category-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Permitir selección múltiple de categorías
            if (this.classList.contains('active')) {
                this.classList.remove('active');
                selectedCategories = selectedCategories.filter(cat => cat !== category);
            } else {
                this.classList.add('active');
                selectedCategories.push(category);
            }
            
            // Mostrar todos los gráficos al filtrar
            showAllCharts();
            
            // Actualizar gráficos
            updateCharts();
        });
    });
    
    // Botón para mostrar subcategorías
    const showSubcategoriesBtn = document.getElementById('show-subcategories-btn');
    if (showSubcategoriesBtn) {
        showSubcategoriesBtn.addEventListener('click', function() {
            const subcontainer = document.getElementById('informes-subcategories-container');
            if (subcontainer.style.display === 'none') {
                subcontainer.style.display = 'block';
                this.innerHTML = '<i class="bi bi-arrow-up"></i> Ocultar Subcategorías';
                
                // Mostrar subcategorías de las categorías seleccionadas
                showInformesSubcategories();
            } else {
                subcontainer.style.display = 'none';
                this.innerHTML = '<i class="bi bi-arrow-down"></i> Ver Subcategorías';
            }
        });
    }
}

// Función para mostrar subcategorías en informes con selección múltiple
function showInformesSubcategories() {
    const container = document.getElementById('informes-subcategories-container');
    if (!container) return;
    
    if (selectedCategories.length === 0) {
        container.innerHTML = `
            <div class="alert alert-warning mt-3">
                <i class="bi bi-exclamation-triangle"></i> Selecciona al menos una categoría primero
            </div>
        `;
        return;
    }
    
    let html = `
        <div class="section-divider mt-3"></div>
        <h6 class="d-flex align-items-center gap-2 mb-3 text-warning">
            <i class="bi bi-tags"></i> Sub-Categorías (Múltiple)
        </h6>
    `;
    
    // Mostrar subcategorías de todas las categorías seleccionadas
    selectedCategories.forEach(category => {
        const subcategories = subcategoriesMap[category] || customSubcategories[category] || [];
        if (subcategories.length > 0) {
            html += `
                <div class="mb-3">
                    <h6 class="text-info">${getCategoryLabel(category)}</h6>
                    <div class="category-buttons">
            `;
            
            subcategories.forEach(sub => {
                const isActive = selectedSubCategories.includes(sub.name);
                html += `
                    <button class="subcategory-btn ${isActive ? 'active' : ''}" data-category="${sub.name}">
                        <i class="${sub.icon}"></i> ${sub.label}
                    </button>
                `;
            });
            
            html += `</div></div>`;
        }
    });
    
    container.innerHTML = html;
    
    // Añadir event listeners a los botones de subcategoría (selección múltiple)
    document.querySelectorAll('#informes-subcategories-container .subcategory-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const subcategory = this.getAttribute('data-category');
            
            // Permitir selección múltiple de subcategorías
            if (this.classList.contains('active')) {
                this.classList.remove('active');
                selectedSubCategories = selectedSubCategories.filter(sub => sub !== subcategory);
            } else {
                this.classList.add('active');
                selectedSubCategories.push(subcategory);
            }
            
            // Mostrar todos los gráficos al filtrar
            showAllCharts();
            
            // Actualizar gráficos
            updateCharts();
        });
    });
}

// ---- CONTROL DE VISUALIZACIÓN DE GRÁFICOS ----
function showSingleChart(chartId) {
    // Ocultar todos los gráficos primero
    document.querySelectorAll('.card-report').forEach(card => {
        card.style.display = 'none';
    });
    
    // Mostrar solo el gráfico especificado
    let targetCard = null;
    if (chartId === 'incomeExpensesChart') {
        targetCard = document.querySelector('#incomeExpensesChart').closest('.card-report');
    } else if (chartId === 'expensesChart') {
        targetCard = document.querySelector('#expensesChart').closest('.card-report');
    } else if (chartId === 'balanceChart') {
        targetCard = document.querySelector('#balanceChart').closest('.card-report');
    }
    
    if (targetCard) {
        targetCard.style.display = 'block';
        // Hacer que el gráfico ocupe más espacio para mejor visualización
        targetCard.classList.add('mx-auto');
        targetCard.classList.add('col-lg-10');
        
        // Aumentar el tamaño del canvas del gráfico
        const canvas = targetCard.querySelector('canvas');
        if (canvas) {
            canvas.style.height = '400px';
            canvas.style.width = '100%';
        }
    }
}

// Función para mostrar todos los gráficos con mejor visualización
function showAllCharts() {
    // Mostrar todos los gráficos
    document.querySelectorAll('.card-report').forEach(card => {
        card.style.display = 'block';
        card.classList.remove('mx-auto', 'col-lg-6', 'col-lg-8', 'col-lg-10');
    });
    
    // Restaurar layout original pero con mejor tamaño para gráficos
    const incomeExpensesCard = document.querySelector('#incomeExpensesChart')?.closest('.card-report')?.parentElement;
    const expensesCard = document.querySelector('#expensesChart')?.closest('.card-report')?.parentElement;
    const balanceCard = document.querySelector('#balanceChart')?.closest('.card-report')?.parentElement;
    
    if (incomeExpensesCard) incomeExpensesCard.className = 'col-lg-6 mb-4';
    if (expensesCard) expensesCard.className = 'col-lg-6 mb-4';
    if (balanceCard) balanceCard.className = 'col-lg-12 mb-4';
    
    // Aumentar tamaño de todos los gráficos para mejor visualización
    document.querySelectorAll('.chart-container canvas').forEach(canvas => {
        canvas.style.height = '300px';
        canvas.style.width = '100%';
    });
    
    // Gráfico de balance más grande
    const balanceCanvas = document.querySelector('#balanceChart');
    if (balanceCanvas) {
        balanceCanvas.style.height = '350px';
    }
}

// ---- INICIALIZACIÓN DE EVENT LISTENERS ----
function initializeEventListeners() {
    // Carga de imágenes
    const imageInput = document.getElementById('imageInput');
    const imageInputPagos = document.getElementById('imageInputPagos');
    
    if (imageInput) {
        imageInput.addEventListener('change', function(e) {
            handleImageUpload(e, 'imagePreview');
        });
    }
    
    if (imageInputPagos) {
        imageInputPagos.addEventListener('change', function(e) {
            handleImageUpload(e, 'imagePreviewPagos');
        });
    }
    
    // Agregar transacciones
    const addTransactionBtn = document.getElementById('addTransactionBtn');
    const addTransactionBtnPagos = document.getElementById('addTransactionBtnPagos');
    
    if (addTransactionBtn) {
        addTransactionBtn.addEventListener('click', addTransaction);
    }
    
    if (addTransactionBtnPagos) {
        addTransactionBtnPagos.addEventListener('click', addTransactionPagos);
    }
    
    // Perfil
    initializeProfileEvents();
    
    // Modales
    const saveTransactionBtn = document.getElementById('saveTransactionBtn');
    if (saveTransactionBtn) {
        saveTransactionBtn.addEventListener('click', saveEditedTransaction);
    }
    
    // Cerrar sesión
    const logoutBtn = document.getElementById('logoutBtn');
    const logoutProfileBtn = document.getElementById('logoutProfileBtn');
    
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    if (logoutProfileBtn) logoutProfileBtn.addEventListener('click', handleLogout);
    
    // Agregar event listeners para imágenes
    const imagePreview = document.getElementById('imagePreview');
    const imagePreviewPagos = document.getElementById('imagePreviewPagos');
    
    if (imagePreview) {
        imagePreview.addEventListener('click', function() {
            if (imageInput) imageInput.click();
        });
    }
    
    if (imagePreviewPagos) {
        imagePreviewPagos.addEventListener('click', function() {
            if (imageInputPagos) imageInputPagos.click();
        });
    }
}

function handleImageUpload(e, previewId) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            selectedImage = event.target.result;
            const preview = document.getElementById(previewId);
            if (preview) {
                preview.innerHTML = '';
                const img = document.createElement('img');
                img.src = selectedImage;
                preview.appendChild(img);
            }
        };
        reader.readAsDataURL(file);
    }
}

// ---- AGREGAR TRANSACCIÓN EN INICIO ----
function addTransaction() {
    const type = document.getElementById('transactionType').value;
    const amount = document.getElementById('transactionAmount').value;
    const description = document.getElementById('transactionDescription').value;
    const dateTime = document.getElementById('transactionDateTime').value;
    const paymentMethod = document.getElementById('paymentMethod').value;
    
    if (!validateTransactionForm(type, amount, dateTime, paymentMethod)) {
        return;
    }
    
    const transaction = {
        id: Date.now(),
        type: type,
        amount: parseFloat(amount),
        description: description,
        category: selectedCategory,
        subcategory: selectedSubCategory,
        paymentMethod: paymentMethod,
        image: selectedImage,
        dateTime: dateTime,
        formattedDate: formatDateTime(dateTime),
        status: 'pendiente'
    };
    
    transactions.push(transaction);
    saveTransactionsToLocalStorage();
    renderTransactions();
    renderTransactionsPagos();
    updateBalance();
    updateCharts();
    resetForm();
    
    addNotification(`Transacción ${type === 'ingreso' ? 'de ingreso' : 'de gasto'} agregada: S/. ${amount}`, 'success');
    showNotification('Transacción agregada exitosamente', 'success');
}

// ---- AGREGAR TRANSACCIÓN EN PAGOS ----
function addTransactionPagos() {
    const type = document.getElementById('transactionTypePagos').value;
    const amount = document.getElementById('transactionAmountPagos').value;
    const description = document.getElementById('NamePago').value;
    const dateTime = document.getElementById('transactionDateTimePagos').value;
    const paymentMethod = document.getElementById('paymentMethodPagos').value;
    
    if (!validateTransactionForm(type, amount, dateTime, paymentMethod)) {
        return;
    }
    
    const transaction = {
        id: Date.now(),
        type: type,
        amount: parseFloat(amount),
        description: description,
        category: selectedCategory,
        subcategory: selectedSubCategory,
        paymentMethod: paymentMethod,
        image: selectedImage,
        dateTime: dateTime,
        formattedDate: formatDateTime(dateTime),
        status: 'pendiente'
    };
    
    transactions.push(transaction);
    saveTransactionsToLocalStorage();
    renderTransactionsPagos();
    renderTransactions();
    updateBalance();
    updateCharts();
    resetFormPagos();
    
    addNotification(`Pago programado agregado: ${description} - S/. ${amount}`, 'success');
    showNotification('Pago agregado exitosamente', 'success');
}

function validateTransactionForm(type, amount, dateTime, paymentMethod) {
    if (type === 'seleccion') {
        showNotification('Por favor selecciona el tipo de movimiento', 'error');
        return false;
    }
    if (!amount || amount <= 0 || isNaN(amount)) {
        showNotification('Por favor ingresa un monto válido', 'error');
        return false;
    }
    if (!dateTime) {
        showNotification('Por favor selecciona fecha y hora', 'error');
        return false;
    }
    if (paymentMethod === 'seleccion') {
        showNotification('Por favor selecciona un método de pago', 'error');
        return false;
    }
    if (!selectedCategory) {
        showNotification('Por favor selecciona una categoría', 'error');
        return false;
    }
    return true;
}

// ---- RENDERIZADO DE TRANSACCIONES EN INICIO ----
function renderTransactions() {
    const tbody = document.getElementById('transactionsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (transactions.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-4">
                    <div class="empty-state">
                        <i class="bi bi-receipt"></i>
                        <div>No hay transacciones registradas</div>
                        <small class="text-muted">Agrega tu primera transacción usando el formulario superior</small>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    const filteredTransactions = filterTransactionsByPeriod(transactions, currentPeriod, 'inicio');
    const sortedTransactions = [...filteredTransactions].sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
    
    sortedTransactions.forEach(transaction => {
        const tr = document.createElement('tr');
        
        const categoryColors = {
            vivienda: { bg: 'rgba(14, 164, 111, 0.1)', color: '#013220' },
            transporte: { bg: 'rgba(6, 163, 255, 0.1)', color: '#0833a2' },
            alimentacion: { bg: 'rgba(142, 68, 173, 0.1)', color: '#4c2882' },
            finanzas: { bg: 'rgba(255, 193, 7, 0.1)', color: '#b58900' },
            salud: { bg: 'rgba(255, 107, 107, 0.1)', color: '#ff0000' },
            entretenimiento: { bg: 'rgba(52, 152, 219, 0.1)', color: '#3498db' },
            ropa: { bg: 'rgba(155, 89, 182, 0.1)', color: '#9b59b6' },
            electronica: { bg: 'rgba(46, 204, 113, 0.1)', color: '#2ecc71' },
            hogar: { bg: 'rgba(241, 196, 15, 0.1)', color: '#f1c40f' },
            educacion: { bg: 'rgba(230, 126, 34, 0.1)', color: '#e67e22' }
        };
        
        const categoryStyle = categoryColors[transaction.category] || { bg: 'rgba(108, 117, 125, 0.1)', color: 'var(--muted)' };
        
        // Obtener el nombre de la subcategoría
        let subcategoryLabel = '';
        if (transaction.subcategory) {
            const subcat = findSubcategory(transaction.category, transaction.subcategory);
            subcategoryLabel = subcat ? subcat.label : transaction.subcategory;
        }
        
        tr.innerHTML = `
            <td>
                <div class="d-flex flex-column">
                    <span class="category-badge text-center" style="background-color: ${categoryStyle.bg}; color: ${categoryStyle.color};">
                        ${getCategoryLabel(transaction.category)}
                    </span>
                    ${subcategoryLabel ? `
                        <small class="text-muted mt-1 text-center">${subcategoryLabel}</small>
                    ` : ''}
                </div>
            </td>
            <td>
                <span class="transaction-type-badge ${transaction.type === 'ingreso' ? 'transaction-type-income' : 'transaction-type-expense'}">
                    ${transaction.type === 'ingreso' ? 'Ingreso' : 'Gasto'}
                </span>
            </td>
            <td class="${transaction.type === 'ingreso' ? 'transaction-amount-income text-success' : 'transaction-amount-expense text-danger'}">
                ${transaction.type === 'ingreso' ? '+' : '-'}S/. ${transaction.amount.toFixed(2)}
            </td>
            <td>
                ${transaction.image ? 
                    `<img src="${transaction.image}" class="transaction-image" onclick="viewImage('${transaction.image}')" alt="Imagen de transacción">` : 
                    `<div class="transaction-image-placeholder" onclick="showNotification('No hay imagen para esta transacción', 'info')">
                        <i class="bi bi-image"></i>
                    </div>`
                }
            </td>
            <td>${transaction.formattedDate}</td>
            <td class="text-end">
                <div class="action-buttons">
                    <button class="action-btn view-btn" onclick="viewTransaction(${transaction.id})" title="Ver detalles">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="action-btn edit-btn" onclick="editTransaction(${transaction.id})" title="Editar">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="confirmDeleteTransaction(${transaction.id})" title="Eliminar">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
}

// ---- RENDERIZADO DE TRANSACCIONES EN PAGOS ----
function renderTransactionsPagos() {
    const tbody = document.getElementById('transactionsTableBodyPagos');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (transactions.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-4">
                    <div class="empty-state">
                        <i class="bi bi-receipt"></i>
                        <div>No hay pagos registrados</div>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    const filteredTransactions = filterTransactionsByPeriod(transactions, currentPeriod, 'pagos');
    const sortedTransactions = [...filteredTransactions].sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
    
    sortedTransactions.forEach(transaction => {
        const tr = document.createElement('tr');

        const categoryColors = {
            vivienda: { bg: 'rgba(14, 164, 111, 0.1)', color: '#013220' },
            transporte: { bg: 'rgba(6, 163, 255, 0.1)', color: '#0833a2' },
            alimentacion: { bg: 'rgba(142, 68, 173, 0.1)', color: '#4c2882' },
            finanzas: { bg: 'rgba(255, 193, 7, 0.1)', color: '#b58900' },
            salud: { bg: 'rgba(255, 107, 107, 0.1)', color: '#ff0000' },
            entretenimiento: { bg: 'rgba(52, 152, 219, 0.1)', color: '#3498db' },
            ropa: { bg: 'rgba(155, 89, 182, 0.1)', color: '#9b59b6' },
            electronica: { bg: 'rgba(46, 204, 113, 0.1)', color: '#2ecc71' },
            hogar: { bg: 'rgba(241, 196, 15, 0.1)', color: '#f1c40f' },
            educacion: { bg: 'rgba(230, 126, 34, 0.1)', color: '#e67e22' }
        };
        
        const categoryStyle = categoryColors[transaction.category] || { bg: 'rgba(108, 117, 125, 0.1)', color: 'var(--muted)' };
        
        // Obtener el nombre de la subcategoría
        let subcategoryLabel = '';
        if (transaction.subcategory) {
            const subcat = findSubcategory(transaction.category, transaction.subcategory);
            subcategoryLabel = subcat ? subcat.label : transaction.subcategory;
        }
        
        tr.innerHTML = `
            <td>${transaction.description || 'Sin nombre'}</td>
            <td>
                <div class="d-flex flex-column">
                    <span class="category-badge text-center" style="background-color: ${categoryStyle.bg}; color: ${categoryStyle.color};">
                        ${getCategoryLabel(transaction.category)}
                    </span>
                    ${subcategoryLabel ? `
                        <small class="text-muted mt-1 text-center">${subcategoryLabel}</small>
                    ` : ''}
                </div>
            </td>
            <td class="${transaction.type === 'ingreso' ? 'transaction-amount-income text-success' : 'transaction-amount-expense text-danger'}">
                ${transaction.type === 'ingreso' ? '+' : '-'}S/. ${transaction.amount.toFixed(2)}
            </td>
            <td>${transaction.formattedDate}</td>
            <td>
                <select class="form-select form-select-sm status-select" data-transaction-id="${transaction.id}" onchange="updateTransactionStatus(${transaction.id}, this.value)">
                    <option value="pendiente" ${transaction.status === 'pendiente' ? 'selected' : ''}>Pendiente</option>
                    <option value="cancelado" ${transaction.status === 'cancelado' ? 'selected' : ''}>Cancelado</option>
                </select>
            </td>
            <td class="text-end">
                <div class="action-buttons">
                    <button class="action-btn view-btn" onclick="viewTransaction(${transaction.id})" title="Ver detalles">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="action-btn edit-btn" onclick="editTransaction(${transaction.id})" title="Editar">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="confirmDeleteTransaction(${transaction.id})" title="Eliminar">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
}

// ---- FILTROS DE PERIODO ----
function initializeFilters() {
    // Filtros en Inicio
    document.querySelectorAll('#inicio .btn-group .btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('#inicio .btn-group .btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentPeriod = this.getAttribute('data-period');
            renderTransactions();
        });
    });
    
    // Filtros en Pagos
    document.querySelectorAll('#pagos .btn-group .btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('#pagos .btn-group .btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentPeriod = this.getAttribute('data-period');
            renderTransactionsPagos();
        });
    });
}

function filterTransactionsByPeriod(transactionsList, period, section = 'inicio') {
    let filteredTransactions = [...transactionsList];
    
    // Obtener valores de filtro según la sección
    let filterValue = null;
    
    switch(period) {
        case 'mensual':
            const monthFilter = document.getElementById(`${section}-month-filter`);
            if (monthFilter && monthFilter.value) {
                filterValue = monthFilter.value;
                filteredTransactions = filteredTransactions.filter(t => {
                    const transDate = new Date(t.dateTime);
                    return transDate.toISOString().slice(0, 7) === filterValue;
                });
            }
            break;
            
        case 'quincenal':
        case 'semanal':
            const startDate = document.getElementById(`${section}-start-date`);
            const endDate = document.getElementById(`${section}-end-date`);
            if (startDate && startDate.value && endDate && endDate.value) {
                const start = new Date(startDate.value);
                const end = new Date(endDate.value);
                end.setHours(23, 59, 59, 999); // Incluir todo el día final
                
                filteredTransactions = filteredTransactions.filter(t => {
                    const transDate = new Date(t.dateTime);
                    return transDate >= start && transDate <= end;
                });
            }
            break;
            
        case 'diario':
            const dayFilter = document.getElementById(`${section}-day-filter`);
            if (dayFilter && dayFilter.value) {
                filterValue = dayFilter.value;
                filteredTransactions = filteredTransactions.filter(t => {
                    const transDate = new Date(t.dateTime);
                    return transDate.toISOString().slice(0, 10) === filterValue;
                });
            }
            break;
    }
    
    return filteredTransactions;
}

// Función para actualizar el estado de la transacción
function updateTransactionStatus(transactionId, newStatus) {
    const transaction = transactions.find(t => t.id === transactionId);
    if (transaction) {
        transaction.status = newStatus;
        saveTransactionsToLocalStorage();
        renderTransactionsPagos();
        updateBalance();
        updateCharts();
        showNotification(`Estado de transacción actualizado a: ${newStatus}`, 'success');
    }
}

// ---- ACTUALIZAR BALANCE ----
function updateBalance() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Filtrar transacciones del mes actual
    const monthlyTransactions = transactions.filter(t => {
        const transDate = new Date(t.dateTime);
        return transDate.getMonth() === currentMonth && transDate.getFullYear() === currentYear;
    });
    
    const totalIncome = monthlyTransactions
        .filter(t => t.type === 'ingreso')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = monthlyTransactions
        .filter(t => t.type === 'gasto')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = totalIncome - totalExpenses;
    
    // Actualizar UI
    const balanceAmount = document.querySelector('.balance-amount');
    const incomeElement = document.querySelector('.balance-label + .fs-4.fw-bold');
    const expensesElement = document.querySelector('.balance-label.mt-2 + .fs-4.fw-bold');
    const balanceLabel = document.querySelector('.balance-label.mt-2');
    
    if (balanceAmount) balanceAmount.textContent = `S/. ${balance.toFixed(2)}`;
    if (incomeElement) incomeElement.textContent = `S/. ${totalIncome.toFixed(2)}`;
    if (expensesElement) expensesElement.textContent = `S/. ${totalExpenses.toFixed(2)}`;
    if (balanceLabel) balanceLabel.textContent = `+ S/. ${balance.toFixed(2)} este mes`;
}

// ---- GRÁFICOS ----
let incomeExpensesChart = null;
let expensesChart = null;
let balanceChart = null;

function initializeCharts() {
    // Solo inicializar si estamos en la sección de informes
    if (!document.getElementById('informes').classList.contains('active')) {
        return;
    }
    
    updateCharts();
}

// Función para actualizar gráficos con mejoras visuales
function updateCharts() {
    // Solo actualizar si estamos en la sección de informes
    if (!document.getElementById('informes') || !document.getElementById('informes').classList.contains('active')) {
        return;
    }
    
    // Forzar resize de los gráficos después de actualizar
    setTimeout(() => {
        if (incomeExpensesChart) {
            incomeExpensesChart.resize();
        }
        if (expensesChart) {
            expensesChart.resize();
        }
        if (balanceChart) {
            balanceChart.resize();
        }
    }, 100);
    
    updateIncomeExpensesChart();
    updateExpensesChart();
    updateBalanceChart();
}

// Función para actualizar gráfico de ingresos vs gastos
function updateIncomeExpensesChart() {
    const ctx = document.getElementById('incomeExpensesChart');
    if (!ctx) return;
    
    const filteredTransactions = getFilteredTransactionsForCharts();
    
    // Agrupar por periodo según el filtro actual
    const periodData = {};
    filteredTransactions.forEach(transaction => {
        const date = new Date(transaction.dateTime);
        let periodKey, periodLabel;
        
        switch(currentPeriod) {
            case 'mensual':
                periodKey = `${date.getFullYear()}-${date.getMonth()}`;
                periodLabel = date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
                break;
            case 'quincenal':
                const half = date.getDate() <= 15 ? 1 : 2;
                periodKey = `${date.getFullYear()}-${date.getMonth()}-${half}`;
                periodLabel = `Quincena ${half} - ${date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}`;
                break;
            case 'semanal':
                const week = Math.ceil(date.getDate() / 7);
                periodKey = `${date.getFullYear()}-${date.getMonth()}-${week}`;
                periodLabel = `Semana ${week} - ${date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}`;
                break;
        }
        
        if (!periodData[periodKey]) {
            periodData[periodKey] = { income: 0, expenses: 0, label: periodLabel };
        }
        
        if (transaction.type === 'ingreso') {
            periodData[periodKey].income += transaction.amount;
        } else {
            periodData[periodKey].expenses += transaction.amount;
        }
    });
    
    const labels = Object.values(periodData).map(data => data.label);
    const incomeData = Object.values(periodData).map(data => data.income);
    const expensesData = Object.values(periodData).map(data => data.expenses);
    
    if (incomeExpensesChart) {
        incomeExpensesChart.destroy();
    }
    
    // Configuración mejorada del gráfico
    incomeExpensesChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Ingresos',
                    data: incomeData,
                    backgroundColor: '#0ea46f',
                    borderColor: '#0a8358',
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                },
                {
                    label: 'Gastos',
                    data: expensesData,
                    backgroundColor: '#ff6b6b',
                    borderColor: '#e55a5a',
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            size: 14,
                            family: "'Poppins', sans-serif"
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: {
                        family: "'Poppins', sans-serif"
                    },
                    bodyFont: {
                        family: "'Poppins', sans-serif"
                    },
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': S/.' + context.parsed.y.toFixed(2);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    },
                    ticks: {
                        font: {
                            family: "'Poppins', sans-serif"
                        },
                        callback: function(value) {
                            return 'S/.' + value;
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: "'Poppins', sans-serif"
                        }
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeInOutQuart'
            }
        }
    });
}

// Función para actualizar gráfico de distribución de gastos con selección múltiple
function updateExpensesChart() {
    const ctx = document.getElementById('expensesChart');
    if (!ctx) return;
    
    const filteredTransactions = getFilteredTransactionsForCharts();
    const expenses = filteredTransactions.filter(t => t.type === 'gasto');
    
    // Agrupar por categoría o subcategoría según lo seleccionado
    let data = {};
    let labels = [];
    
    if (selectedSubCategories.length > 0) {
        // Mostrar subcategorías seleccionadas
        expenses.forEach(expense => {
            if (selectedSubCategories.includes(expense.subcategory)) {
                if (!data[expense.subcategory]) {
                    data[expense.subcategory] = 0;
                }
                data[expense.subcategory] += expense.amount;
            }
        });
        
        // Obtener etiquetas de subcategorías
        labels = Object.keys(data).map(sub => {
            const subcat = findSubcategory(expenses.find(e => e.subcategory === sub)?.category, sub);
            return subcat ? subcat.label : sub;
        });
    } else if (selectedCategories.length > 0) {
        // Mostrar categorías seleccionadas
        expenses.forEach(expense => {
            if (selectedCategories.includes(expense.category)) {
                if (!data[expense.category]) {
                    data[expense.category] = 0;
                }
                data[expense.category] += expense.amount;
            }
        });
        
        labels = Object.keys(data).map(cat => getCategoryLabel(cat));
    } else {
        // Mostrar todas las categorías
        expenses.forEach(expense => {
            if (!data[expense.category]) {
                data[expense.category] = 0;
            }
            data[expense.category] += expense.amount;
        });
        
        labels = Object.keys(data).map(cat => getCategoryLabel(cat));
    }
    
    const chartData = Object.values(data);
    
    const backgroundColors = [
        '#0ea46f', '#06a3ff', '#8e44ad', '#f39c12', '#ff6b6b',
        '#3498db', '#9b59b6', '#2ecc71', '#f1c40f', '#e67e22',
        '#1abc9c', '#34495e', '#e74c3c', '#95a5a6', '#f1c40f'
    ];
    
    if (expensesChart) {
        expensesChart.destroy();
    }
    
    expensesChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: chartData,
                backgroundColor: backgroundColors.slice(0, labels.length),
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        font: {
                            family: "'Poppins', sans-serif"
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${context.label}: S/.${context.parsed.toFixed(2)} (${percentage}%)`;
                        }
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeInOutQuart'
            }
        }
    });
}

function updateBalanceChart() {
    const ctx = document.getElementById('balanceChart');
    if (!ctx) return;
    
    const filteredTransactions = getFilteredTransactionsForCharts();
    
    // Calcular balance acumulado por mes
    const monthlyBalance = {};
    let runningBalance = 0;
    
    // Ordenar transacciones por fecha
    const sortedTransactions = [...filteredTransactions].sort((a, b) => 
        new Date(a.dateTime) - new Date(b.dateTime)
    );
    
    sortedTransactions.forEach(transaction => {
        const date = new Date(transaction.dateTime);
        const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
        const label = date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
        
        if (!monthlyBalance[monthKey]) {
            monthlyBalance[monthKey] = { balance: runningBalance, label: label };
        }
        
        if (transaction.type === 'ingreso') {
            runningBalance += transaction.amount;
        } else {
            runningBalance -= transaction.amount;
        }
        
        monthlyBalance[monthKey].balance = runningBalance;
    });
    
    const labels = Object.values(monthlyBalance).map(data => data.label);
    const balanceData = Object.values(monthlyBalance).map(data => data.balance);
    
    if (balanceChart) {
        balanceChart.destroy();
    }
    
    balanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Balance Acumulado',
                data: balanceData,
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
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Balance: S/.' + context.parsed.y.toFixed(2);
                        }
                    }
                }
            },
            scales: {
                y: {
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

// Función auxiliar para filtrar transacciones en gráficos con selección múltiple
function getFilteredTransactionsForCharts() {
    let filtered = [...transactions];
    
    // Aplicar filtros según la configuración actual
    if (currentPeriod === 'mensual') {
        const monthFilter = document.getElementById('informes-month-filter');
        if (monthFilter && monthFilter.value) {
            filtered = filtered.filter(t => {
                const transDate = new Date(t.dateTime);
                return transDate.toISOString().slice(0, 7) === monthFilter.value;
            });
        }
    } else if (currentPeriod === 'quincenal' || currentPeriod === 'semanal') {
        const startDate = document.getElementById('informes-start-date');
        const endDate = document.getElementById('informes-end-date');
        if (startDate && startDate.value && endDate && endDate.value) {
            const start = new Date(startDate.value);
            const end = new Date(endDate.value);
            end.setHours(23, 59, 59, 999);
            
            filtered = filtered.filter(t => {
                const transDate = new Date(t.dateTime);
                return transDate >= start && transDate <= end;
            });
        }
    }
    
    // Aplicar filtro de categorías si hay seleccionadas
    if (selectedCategories.length > 0) {
        filtered = filtered.filter(t => selectedCategories.includes(t.category));
        
        // Aplicar filtro de subcategorías si hay seleccionadas
        if (selectedSubCategories.length > 0) {
            filtered = filtered.filter(t => selectedSubCategories.includes(t.subcategory));
        }
    }
    
    return filtered;
}

// ---- ACCIONES SOBRE TRANSACCIONES ----
function viewTransaction(id) {
    const transaction = transactions.find(t => t.id === id);
    if (transaction) {
        const modalBody = document.getElementById('viewTransactionModalBody');
        
        // Obtener el nombre de la subcategoría
        let subcategoryLabel = '';
        if (transaction.subcategory) {
            const subcat = findSubcategory(transaction.category, transaction.subcategory);
            subcategoryLabel = subcat ? subcat.label : transaction.subcategory;
        }
        
        modalBody.innerHTML = `
            <div class="transaction-detail-item">
                <div class="transaction-detail-label">Categoría</div>
                <div class="transaction-detail-value">${getCategoryLabel(transaction.category)}</div>
            </div>
            ${subcategoryLabel ? `
            <div class="transaction-detail-item">
                <div class="transaction-detail-label">Subcategoría</div>
                <div class="transaction-detail-value">${subcategoryLabel}</div>
            </div>
            ` : ''}
            <div class="transaction-detail-item">
                <div class="transaction-detail-label">Tipo</div>
                <div class="transaction-detail-value">
                    <span class="transaction-type-badge ${transaction.type === 'ingreso' ? 'transaction-type-income' : 'transaction-type-expense'}">
                        ${transaction.type === 'ingreso' ? 'Ingreso' : 'Gasto'}
                    </span>
                </div>
            </div>
            <div class="transaction-detail-item">
                <div class="transaction-detail-label">Monto</div>
                <div class="transaction-detail-value ${transaction.type === 'ingreso' ? 'transaction-amount-income' : 'transaction-amount-expense'}">
                    ${transaction.type === 'ingreso' ? '+' : '-'}S/. ${transaction.amount.toFixed(2)}
                </div>
            </div>
            <div class="transaction-detail-item">
                <div class="transaction-detail-label">Método de Pago</div>
                <div class="transaction-detail-value">${transaction.paymentMethod || 'No especificado'}</div>
            </div>
            <div class="transaction-detail-item">
                <div class="transaction-detail-label">Descripción</div>
                <div class="transaction-detail-value">${transaction.description || 'Sin descripción'}</div>
            </div>
            <div class="transaction-detail-item">
                <div class="transaction-detail-label">Fecha y Hora</div>
                <div class="transaction-detail-value">${transaction.formattedDate}</div>
            </div>
            ${transaction.image ? `
            <div class="transaction-detail-item">
                <div class="transaction-detail-label">Imagen</div>
                <div class="transaction-detail-value">
                    <img src="${transaction.image}" class="transaction-detail-image" alt="Imagen de transacción">
                </div>
            </div>
            ` : ''}
        `;
        
        const viewModal = new bootstrap.Modal(document.getElementById('viewTransactionModal'));
        viewModal.show();
    }
}

function editTransaction(id) {
    const transaction = transactions.find(t => t.id === id);
    if (transaction) {
        editingTransactionId = id;
        
        const modalBody = document.getElementById('editTransactionModalBody');
        
        // Determinar si estamos en la sección de Pagos
        const isPagosSection = document.getElementById('pagos').classList.contains('active');
        
        modalBody.innerHTML = `
            <div class="transaction-form-grid">
                <div class="transaction-form-item">
                    <label class="form-label fw-semibold">Tipo</label>
                    <select class="form-select" id="editTransactionType">
                        <option value="gasto" ${transaction.type === 'gasto' ? 'selected' : ''}>Gasto</option>
                        <option value="ingreso" ${transaction.type === 'ingreso' ? 'selected' : ''}>Ingreso</option>
                    </select>
                </div>
                <div class="transaction-form-item">
                    <label class="form-label fw-semibold">Método de Pago</label>
                    <select class="form-select" id="editPaymentMethod">
                        <option value="efectivo" ${transaction.paymentMethod === 'efectivo' ? 'selected' : ''}>Efectivo</option>
                        <option value="yape" ${transaction.paymentMethod === 'yape' ? 'selected' : ''}>Yape</option>
                        <option value="plin" ${transaction.paymentMethod === 'plin' ? 'selected' : ''}>Plin</option>
                        <option value="credito" ${transaction.paymentMethod === 'credito' ? 'selected' : ''}>Tarjeta de Crédito</option>
                        <option value="debito" ${transaction.paymentMethod === 'debito' ? 'selected' : ''}>Tarjeta de Débito</option>
                        <option value="paypal" ${transaction.paymentMethod === 'paypal' ? 'selected' : ''}>Paypal</option>
                        <option value="transferencia" ${transaction.paymentMethod === 'transferencia' ? 'selected' : ''}>Transferencia Bancaria</option>
                    </select>
                </div>
                <div class="transaction-form-item">
                    <label class="form-label fw-semibold">S/. monto</label>
                    <input type="number" class="form-control" id="editTransactionAmount" value="${transaction.amount}" step="0.01">
                </div>
            </div>

            <div class="transaction-form-grid">
                <div class="transaction-form-item">
                    <label class="form-label fw-semibold">Imagen</label>
                    <div class="image-preview" id="editImagePreview">
                        ${transaction.image ? 
                            `<img src="${transaction.image}" alt="Imagen de transacción">` : 
                            `<div class="image-preview-placeholder">
                                <small>Selecciona imagen</small>
                            </div>`
                        }
                    </div>
                    <input type="file" id="editImageInput" accept="image/*" style="display: none;">
                </div>
                <div class="transaction-form-item">
                    <label class="form-label fw-semibold">Fecha y Hora</label>
                    <input type="datetime-local" class="form-control" id="editTransactionDateTime" value="${transaction.dateTime}">
                </div>
                <div class="transaction-form-item">
                    <label class="form-label fw-semibold">${isPagosSection ? 'Nombre de Pago' : 'Descripción'}</label>
                    <input type="text" class="form-control" id="editTransactionDescription" value="${transaction.description || ''}" 
                           placeholder="${isPagosSection ? 'Nombre de pago...' : 'Descripción de la transacción...'}">
                </div>
            </div>

            <div class="section-divider"></div>
            
            <h6 class="d-flex align-items-center gap-2 mb-3">
                <i class="bi bi-tags text-primary"></i>Categoría
            </h6>
            
            <div class="category-buttons" id="editCategoryButtons">
                ${generateCategoryButtonsHTML(transaction.category)}
            </div>
            
            <div id="editSubcategoryContainer">
                ${getEditSubcategoryHTML(transaction.category, transaction.subcategory)}
            </div>
        `;
        
        // Configurar categorías en edición
        document.querySelectorAll('#editCategoryButtons .category-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('#editCategoryButtons .category-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                selectedCategory = this.getAttribute('data-category');
                
                // Mostrar subcategorías
                const subcategoryContainer = document.getElementById('editSubcategoryContainer');
                subcategoryContainer.innerHTML = getEditSubcategoryHTML(selectedCategory, null);
                
                // Configurar subcategorías
                document.querySelectorAll('#editSubcategoryContainer .subcategory-btn').forEach(subBtn => {
                    subBtn.addEventListener('click', function() {
                        document.querySelectorAll('#editSubcategoryContainer .subcategory-btn').forEach(b => b.classList.remove('active'));
                        this.classList.add('active');
                        selectedSubCategory = this.getAttribute('data-category');
                    });
                });
            });
        });
        
        // Configurar subcategorías existentes
        document.querySelectorAll('#editSubcategoryContainer .subcategory-btn').forEach(subBtn => {
            subBtn.addEventListener('click', function() {
                document.querySelectorAll('#editSubcategoryContainer .subcategory-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                selectedSubCategory = this.getAttribute('data-category');
            });
        });
        
        // Configurar imagen en edición
        document.getElementById('editImageInput').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    selectedImage = event.target.result;
                    const preview = document.getElementById('editImagePreview');
                    preview.innerHTML = '';
                    const img = document.createElement('img');
                    img.src = selectedImage;
                    preview.appendChild(img);
                };
                reader.readAsDataURL(file);
            }
        });
        
        // Configurar vista previa de imagen
        document.getElementById('editImagePreview').addEventListener('click', function() {
            document.getElementById('editImageInput').click();
        });
        
        const editModal = new bootstrap.Modal(document.getElementById('editTransactionModal'));
        editModal.show();
    }
}

// Función auxiliar para generar botones de categoría
function generateCategoryButtonsHTML(selectedCategory) {
    let html = '';
    const categories = Object.keys(subcategoriesMap);
    
    categories.forEach(category => {
        html += `
            <button class="category-btn ${selectedCategory === category ? 'active' : ''}" data-category="${category}">
                <i class="bi bi-${getCategoryIcon(category)}"></i> ${getCategoryLabel(category)}
            </button>
        `;
    });
    
    // Agregar categorías personalizadas si existen
    if (customCategories && customCategories.length > 0) {
        customCategories.forEach(category => {
            html += `
                <button class="category-btn ${selectedCategory === category.name ? 'active' : ''}" data-category="${category.name}">
                    <i class="${category.icon}"></i> ${category.label}
                </button>
            `;
        });
    }
    
    return html;
}

function getEditSubcategoryHTML(category, currentSubcategory) {
    const subcategories = subcategoriesMap[category] || customSubcategories[category] || [];
    
    if (subcategories.length === 0) return '';
    
    let html = `
        <div class="section-divider"></div>
        <h6 class="d-flex align-items-center gap-2 mb-3 text-warning">
            <i class="bi bi-tags"></i> Sub-Categoría ${getCategoryLabel(category)}
        </h6>
        <div class="category-buttons">
    `;
    
    subcategories.forEach(sub => {
        html += `
            <button class="subcategory-btn ${currentSubcategory === sub.name ? 'active' : ''}" data-category="${sub.name}">
                <i class="${sub.icon}"></i> ${sub.label}
            </button>
        `;
    });
    
    html += `</div>`;
    return html;
}

function saveEditedTransaction() {
    const type = document.getElementById('editTransactionType').value;
    const amount = document.getElementById('editTransactionAmount').value;
    const description = document.getElementById('editTransactionDescription').value;
    const dateTime = document.getElementById('editTransactionDateTime').value;
    const paymentMethod = document.getElementById('editPaymentMethod').value;
    
    if (!amount || !selectedCategory || !dateTime || !paymentMethod) {
        showNotification('Por favor, complete todos los campos obligatorios.', 'error');
        return;
    }
    
    const index = transactions.findIndex(t => t.id === editingTransactionId);
    if (index !== -1) {
        transactions[index] = {
            ...transactions[index],
            type: type,
            amount: parseFloat(amount),
            description: description,
            category: selectedCategory,
            subcategory: selectedSubCategory,
            paymentMethod: paymentMethod,
            image: selectedImage,
            dateTime: dateTime,
            formattedDate: formatDateTime(dateTime)
        };
        
        saveTransactionsToLocalStorage();
        renderTransactions();
        renderTransactionsPagos();
        updateBalance();
        updateCharts();
        
        const editModal = bootstrap.Modal.getInstance(document.getElementById('editTransactionModal'));
        editModal.hide();
        
        addNotification(`Transacción actualizada: ${description} - S/. ${amount}`, 'info');
        showNotification('Transacción actualizada exitosamente', 'success');
    }
}

function confirmDeleteTransaction(id) {
    if (confirm('¿Estás seguro de que deseas eliminar esta transacción?')) {
        deleteTransaction(id);
    }
}

function deleteTransaction(id) {
    const transaction = transactions.find(t => t.id === id);
    transactions = transactions.filter(t => t.id !== id);
    saveTransactionsToLocalStorage();
    renderTransactions();
    renderTransactionsPagos();
    updateBalance();
    updateCharts();
    
    if (transaction) {
        addNotification(`Transacción eliminada: ${transaction.description || 'Sin descripción'} - S/. ${transaction.amount}`, 'warning');
    }
    
    showNotification('Transacción eliminada exitosamente', 'success');
}

function viewImage(imageSrc) {
    const modalImage = document.getElementById('modalImage');
    if (modalImage) {
        modalImage.src = imageSrc;
        const imageModal = new bootstrap.Modal(document.getElementById('imageModal'));
        imageModal.show();
    }
}

// ---- SISTEMA DE NOTIFICACIONES ----
function initializeNotifications() {
    updateNotificationsUI();
}

function addNotification(message, type = 'info') {
    const notification = {
        id: Date.now(),
        message: message,
        type: type,
        timestamp: new Date().toLocaleString(),
        read: false
    };
    
    notifications.unshift(notification);
    
    // Limitar a 50 notificaciones
    if (notifications.length > 50) {
        notifications = notifications.slice(0, 50);
    }
    
    // Guardar en localStorage
    saveNotificationsToLocalStorage();
    
    // Actualizar UI
    updateNotificationsUI();
    
    // Mostrar notificación toast
    showNotification(message, type);
}

function updateNotificationsUI() {
    const badge = document.querySelector('.badge');
    const dropdown = document.querySelector('.dropdown-notifications');
    
    if (!badge || !dropdown) return;
    
    // Actualizar badge
    const unreadCount = notifications.filter(n => !n.read).length;
    badge.textContent = unreadCount;
    
    // Actualizar dropdown
    let html = `
        <li>
            <h6 class="dropdown-header">Notificaciones</h6>
        </li>
        <li><hr class="dropdown-divider"></li>
    `;
    
    if (notifications.length === 0) {
        html += `
            <li>
                <a class="dropdown-item text-center small" href="#">
                    No hay notificaciones
                </a>
            </li>
        `;
    } else {
        // Mostrar las 5 notificaciones más recientes
        notifications.slice(0, 5).forEach(notification => {
            const icon = getNotificationIcon(notification.type);
            const textClass = getNotificationTextClass(notification.type);
            
            html += `
                <li>
                    <a class="dropdown-item ${notification.read ? '' : 'fw-bold'}" href="#" onclick="markNotificationAsRead(${notification.id})">
                        <div class="d-flex align-items-center">
                            <i class="bi ${icon} ${textClass} me-2"></i>
                            <div class="flex-grow-1">
                                <div class="small">${notification.message}</div>
                                <div class="text-muted small">${notification.timestamp}</div>
                            </div>
                            ${!notification.read ? '<span class="badge bg-primary ms-2">Nuevo</span>' : ''}
                        </div>
                    </a>
                </li>
            `;
        });
        
        html += `
            <li><hr class="dropdown-divider"></li>
            <li>
                <a class="dropdown-item text-center small" href="#" onclick="markAllNotificationsAsRead()">
                    Marcar todas como leídas
                </a>
            </li>
            <li>
                <a class="dropdown-item text-center small" href="#" onclick="clearAllNotifications()">
                    Limpiar todas las notificaciones
                </a>
            </li>
        `;
    }
    
    dropdown.innerHTML = html;
}

function getNotificationIcon(type) {
    switch(type) {
        case 'success': return 'bi-check-circle-fill';
        case 'error': return 'bi-exclamation-circle-fill';
        case 'warning': return 'bi-exclamation-triangle-fill';
        case 'info': return 'bi-info-circle-fill';
        default: return 'bi-bell-fill';
    }
}

function getNotificationTextClass(type) {
    switch(type) {
        case 'success': return 'text-success';
        case 'error': return 'text-danger';
        case 'warning': return 'text-warning';
        case 'info': return 'text-info';
        default: return 'text-primary';
    }
}

function markNotificationAsRead(id) {
    const notification = notifications.find(n => n.id === id);
    if (notification) {
        notification.read = true;
        saveNotificationsToLocalStorage();
        updateNotificationsUI();
    }
}

function markAllNotificationsAsRead() {
    notifications.forEach(notification => {
        notification.read = true;
    });
    saveNotificationsToLocalStorage();
    updateNotificationsUI();
}

function clearAllNotifications() {
    if (confirm('¿Estás seguro de que deseas eliminar todas las notificaciones?')) {
        notifications = [];
        saveNotificationsToLocalStorage();
        updateNotificationsUI();
    }
}

// ---- FUNCIONALIDAD DE PERFIL ----
function initializeProfile() {
    // Actualizar interfaz con datos del perfil
    updateProfileInApp();
}

function initializeProfileEvents() {
    // Gestión de edición del perfil
    const editProfileBtn = document.getElementById('editProfileBtn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function() {
            const profileForm = document.getElementById('profileForm');
            if (profileForm.style.display === 'none') {
                profileForm.style.display = 'block';
                this.innerHTML = '<i class="bi bi-x me-1"></i> Cancelar';
                
                // Cargar datos actuales en el formulario
                loadProfileFormData();
            } else {
                profileForm.style.display = 'none';
                this.innerHTML = '<i class="bi bi-pencil me-1"></i> Editar';
                // Restaurar valores originales en caso de cancelar
                resetProfileForm();
            }
        });
    }

    const cancelEditBtn = document.getElementById('cancelEditBtn');
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', function() {
            const profileForm = document.getElementById('profileForm');
            if (profileForm) {
                profileForm.style.display = 'none';
            }
            const editProfileBtn = document.getElementById('editProfileBtn');
            if (editProfileBtn) {
                editProfileBtn.innerHTML = '<i class="bi bi-pencil me-1"></i> Editar';
            }
            resetProfileForm();
        });
    }

    // Cambio de foto de perfil
    const changeProfilePictureBtn = document.getElementById('changeProfilePictureBtn');
    const avatarInput = document.getElementById('avatarInput');
    
    if (changeProfilePictureBtn && avatarInput) {
        changeProfilePictureBtn.addEventListener('click', function() {
            avatarInput.click();
        });

        avatarInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Validar tipo de archivo
                if (!file.type.startsWith('image/')) {
                    showNotification('Por favor, selecciona un archivo de imagen válido', 'error');
                    return;
                }
                
                // Validar tamaño (máximo 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    showNotification('La imagen no debe superar los 5MB', 'error');
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = function(event) {
                    const imageData = event.target.result;
                    
                    // Actualizar vista previa
                    const profilePicturePreview = document.getElementById('profilePicturePreview');
                    if (profilePicturePreview) {
                        profilePicturePreview.innerHTML = `<img src="${imageData}" alt="Foto de perfil">`;
                    }
                    
                    // Mostrar botón de eliminar foto
                    const removeProfilePhotoBtn = document.getElementById('removeProfilePhotoBtn');
                    if (removeProfilePhotoBtn) {
                        removeProfilePhotoBtn.style.display = 'block';
                    }
                    
                    // Guardar temporalmente para aplicar al guardar
                    userProfile.tempAvatar = imageData;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Eliminar foto de perfil
    const removeProfilePhotoBtn = document.getElementById('removeProfilePhotoBtn');
    if (removeProfilePhotoBtn) {
        removeProfilePhotoBtn.addEventListener('click', function() {
            resetProfilePhoto();
            userProfile.tempAvatar = null;
            userProfile.avatar = null;
            
            // Limpiar input de archivo
            if (avatarInput) {
                avatarInput.value = '';
            }
            
            showNotification('Foto de perfil eliminada', 'info');
        });
    }

    // Guardar cambios del perfil
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validar formulario
            if (!validateProfileForm()) {
                return;
            }
            
            // Obtener valores del formulario
            const firstName = document.getElementById('firstName').value.trim();
            const lastName = document.getElementById('lastName').value.trim();
            const email = document.getElementById('userEmail').value.trim();
            const age = document.getElementById('userEdad').value;
            
            // Actualizar perfil
            const fullName = `${firstName} ${lastName}`;
            updateUserProfile(fullName, email, age);
            
            // Actualizar avatar si hay uno temporal
            if (userProfile.tempAvatar) {
                userProfile.avatar = userProfile.tempAvatar;
                userProfile.tempAvatar = null;
            }
            
            // Guardar en localStorage
            saveProfileToLocalStorage();
            
            // MOSTRAR NOTIFICACIÓN Y RECARGAR LA PÁGINA
            showNotification('Perfil actualizado correctamente', 'success');
            
            // Recargar la página después de un breve delay para que se vea la notificación
            setTimeout(() => {
                location.reload();
            }, 1500);
        });
    }
}

function loadProfileFormData() {
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const userEmail = document.getElementById('userEmail');
    const userEdad = document.getElementById('userEdad');
    
    if (firstName) firstName.value = userProfile.firstName || 'Jairo';
    if (lastName) lastName.value = userProfile.lastName || 'Castillo';
    if (userEmail) userEmail.value = userProfile.email || 'jairo@utp.edu.pe';
    if (userEdad) userEdad.value = userProfile.age || '20';
    
    // Cargar foto de perfil si existe
    const profilePicturePreview = document.getElementById('profilePicturePreview');
    if (userProfile.avatar && profilePicturePreview) {
        profilePicturePreview.innerHTML = `<img src="${userProfile.avatar}" alt="Foto de perfil">`;
        // Mostrar botón de eliminar foto
        const removeProfilePhotoBtn = document.getElementById('removeProfilePhotoBtn');
        if (removeProfilePhotoBtn) {
            removeProfilePhotoBtn.style.display = 'block';
        }
    } else {
        resetProfilePhoto();
    }
}

function resetProfileForm() {
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const userEmail = document.getElementById('userEmail');
    const userEdad = document.getElementById('userEdad');
    
    if (firstName) firstName.value = userProfile.firstName || 'Jairo';
    if (lastName) lastName.value = userProfile.lastName || 'Castillo';
    if (userEmail) userEmail.value = userProfile.email || 'jairo@utp.edu.pe';
    if (userEdad) userEdad.value = userProfile.age || '20';
    
    // Restablecer foto de perfil
    if (userProfile.avatar) {
        const profilePicturePreview = document.getElementById('profilePicturePreview');
        if (profilePicturePreview) {
            profilePicturePreview.innerHTML = `<img src="${userProfile.avatar}" alt="Foto de perfil">`;
        }
    } else {
        resetProfilePhoto();
    }
}

function resetProfilePhoto() {
    const initials = getInitials(userProfile.name);
    const profilePicturePreview = document.getElementById('profilePicturePreview');
    if (profilePicturePreview) {
        profilePicturePreview.innerHTML = 
            `<div id="profilePicturePlaceholder" style="width:100%;height:100%;background:linear-gradient(135deg,var(--verdeOs),var(--grisOs));display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;font-size:3rem;">${initials}</div>`;
    }
    const removeProfilePhotoBtn = document.getElementById('removeProfilePhotoBtn');
    if (removeProfilePhotoBtn) {
        removeProfilePhotoBtn.style.display = 'none';
    }
}

function validateProfileForm() {
    let isValid = true;
    
    // Validar nombre
    const firstName = document.getElementById('firstName');
    if (firstName && !firstName.value.trim()) {
        markFieldInvalid('firstName', 'El nombre es obligatorio');
        isValid = false;
    } else if (firstName) {
        markFieldValid('firstName');
    }
    
    // Validar apellido
    const lastName = document.getElementById('lastName');
    if (lastName && !lastName.value.trim()) {
        markFieldInvalid('lastName', 'El apellido es obligatorio');
        isValid = false;
    } else if (lastName) {
        markFieldValid('lastName');
    }
    
    // Validar email
    const userEmail = document.getElementById('userEmail');
    if (userEmail) {
        const email = userEmail.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            markFieldInvalid('userEmail', 'El correo electrónico es obligatorio');
            isValid = false;
        } else if (!emailRegex.test(email)) {
            markFieldInvalid('userEmail', 'Ingresa un correo electrónico válido');
            isValid = false;
        } else {
            markFieldValid('userEmail');
        }
    }
    
    // Validar edad
    const userEdad = document.getElementById('userEdad');
    if (userEdad) {
        const age = userEdad.value;
        if (!age || age < 1 || age > 120) {
            markFieldInvalid('userEdad', 'Ingresa una edad válida');
            isValid = false;
        } else {
            markFieldValid('userEdad');
        }
    }
    
    return isValid;
}

function markFieldInvalid(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.classList.add('is-invalid');
        field.classList.remove('is-valid');
        
        // Mostrar mensaje de error
        let feedback = field.nextElementSibling;
        if (!feedback || !feedback.classList.contains('invalid-feedback')) {
            feedback = document.createElement('div');
            feedback.className = 'invalid-feedback';
            field.parentNode.appendChild(feedback);
        }
        feedback.textContent = message;
        feedback.style.display = 'block';
    }
}

function markFieldValid(fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
        
        // Ocultar mensaje de error
        const feedback = field.nextElementSibling;
        if (feedback && feedback.classList.contains('invalid-feedback')) {
            feedback.style.display = 'none';
        }
    }
}

function updateUserProfile(name, email, age) {
    userProfile.name = name;
    userProfile.email = email;
    userProfile.age = age;
    userProfile.firstName = name.split(' ')[0];
    userProfile.lastName = name.split(' ').slice(1).join(' ');
    
    // Guardar en localStorage
    saveProfileToLocalStorage();
    
    // Agregar notificación
    addNotification('Perfil actualizado correctamente', 'info');
}

function updateProfileInApp() {
    // Actualizar barra superior
    const userName = document.getElementById('user-name');
    const userEmail = document.getElementById('user-email');
    const userInitials = document.getElementById('userInitials');
    
    if (userName) userName.textContent = userProfile.name;
    if (userEmail) userEmail.textContent = userProfile.email;
    if (userInitials) userInitials.textContent = getInitials(userProfile.name);
    
    // Actualizar avatar en barra superior
    const userAvatar = document.querySelector('.avatar-sm');
    if (userAvatar) {
        if (userProfile.avatar) {
            userAvatar.innerHTML = `<img src="${userProfile.avatar}" alt="Avatar">`;
        } else {
            userAvatar.innerHTML = `<span>${getInitials(userProfile.name)}</span>`;
        }
    }
    
    // Actualizar sección de perfil
    const profileName = document.querySelector('.profile-name');
    const profileEmail = document.querySelector('.profile-email');
    
    if (profileName) profileName.textContent = userProfile.name;
    if (profileEmail) profileEmail.textContent = userProfile.email;
    
    // Actualizar avatar en perfil
    const profileAvatar = document.getElementById('profileAvatar');
    if (profileAvatar) {
        if (userProfile.avatar) {
            profileAvatar.innerHTML = `<img src="${userProfile.avatar}" alt="Avatar">`;
            const avatarPlaceholder = document.getElementById('avatarPlaceholder');
            if (avatarPlaceholder) {
                avatarPlaceholder.style.display = 'none';
            }
        } else {
            profileAvatar.innerHTML = `<div id="avatarPlaceholder" style="width:100%;height:100%;background:linear-gradient(135deg,var(--verdeOs),var(--grisOs));display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;font-size:2rem;">${getInitials(userProfile.name)}</div>`;
        }
    }
    
    // Actualizar título principal si contiene el nombre
    const mainTitle = document.getElementById('main-title');
    if (mainTitle && mainTitle.innerHTML.includes('Jairo')) {
        mainTitle.innerHTML = mainTitle.innerHTML.replace('Jairo', userProfile.firstName);
    }
}

function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

// ---- PERSONALIZACIÓN DE CATEGORÍAS ----

// Función para mostrar el modal de personalización de categorías
function showCustomizeCategoriesModal() {
    // Actualizar el contenido del modal
    updateCustomizeCategoriesModal();
    
    // Mostrar el modal
    const modalElement = document.getElementById('customizeCategoriesModal');
    if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    }
}

// Función para actualizar el contenido del modal
function updateCustomizeCategoriesModal() {
    updateParentCategoryOptions();
    updateCustomCategoriesList();
}

// Función para actualizar las opciones de categorías padre
function updateParentCategoryOptions() {
    const parentCategorySelect = document.getElementById('parentCategory');
    if (!parentCategorySelect) return;
    
    parentCategorySelect.innerHTML = '';
    
    // Agregar categorías predefinidas
    Object.keys(subcategoriesMap).forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = getCategoryLabel(category);
        parentCategorySelect.appendChild(option);
    });
    
    // Agregar categorías personalizadas
    if (customCategories && customCategories.length > 0) {
        customCategories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.name;
            option.textContent = category.label;
            parentCategorySelect.appendChild(option);
        });
    }
}

// Función para actualizar la lista de categorías personalizadas
function updateCustomCategoriesList() {
    const categoriesList = document.getElementById('customCategoriesList');
    if (!categoriesList) return;
    
    if (!customCategories || customCategories.length === 0) {
        categoriesList.innerHTML = '<p class="text-muted">No hay categorías personalizadas.</p>';
        return;
    }
    
    let html = '<h6>Categorías Personalizadas</h6><div class="list-group">';
    
    customCategories.forEach((category, index) => {
        html += `
            <div class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                    <i class="${category.icon} me-2"></i>
                    <span>${category.label}</span>
                </div>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteCustomCategory(${index})">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;
    });
    
    html += '</div>';
    
    categoriesList.innerHTML = html;
}

// Función para agregar nueva categoría
function addNewCategory() {
    const nameInput = document.getElementById('newCategoryName');
    const iconSelect = document.getElementById('newCategoryIcon');
    
    if (!nameInput || !iconSelect) return;
    
    const name = nameInput.value.trim();
    const icon = iconSelect.value;
    
    if (!name) {
        showNotification('Por favor ingresa un nombre para la categoría', 'error');
        return;
    }
    
    // Verificar si la categoría ya existe
    const categoryExists = customCategories.some(cat => cat.name === name.toLowerCase()) || 
                          Object.keys(subcategoriesMap).includes(name.toLowerCase());
    
    if (categoryExists) {
        showNotification('Ya existe una categoría con ese nombre', 'error');
        return;
    }
    
    // Agregar la nueva categoría
    const newCategory = {
        name: name.toLowerCase(),
        label: name,
        icon: icon
    };
    
    customCategories.push(newCategory);
    
    // Inicializar array de subcategorías para esta categoría
    customSubcategories[name.toLowerCase()] = [];
    
    // Guardar en localStorage
    saveCustomCategoriesToLocalStorage();
    
    // Limpiar formulario
    nameInput.value = '';
    
    // Actualizar la lista de categorías
    updateCustomCategoriesList();
    
    // Actualizar botones de categorías en la interfaz
    updateCategoryButtons();
    
    // Cerrar el modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('customizeCategoriesModal'));
    if (modal) {
        modal.hide();
    }
    
    showNotification('Categoría agregada exitosamente', 'success');
}

// Función para agregar nueva subcategoría
function addNewSubcategory() {
    const parentCategorySelect = document.getElementById('parentCategory');
    const nameInput = document.getElementById('newSubcategoryName');
    const iconSelect = document.getElementById('newSubcategoryIcon');
    
    if (!parentCategorySelect || !nameInput || !iconSelect) return;
    
    const parentCategory = parentCategorySelect.value;
    const name = nameInput.value.trim();
    const icon = iconSelect.value;
    
    if (!name) {
        showNotification('Por favor ingresa un nombre para la subcategoría', 'error');
        return;
    }
    
    if (!parentCategory) {
        showNotification('Por favor selecciona una categoría padre', 'error');
        return;
    }
    
    // Verificar si la subcategoría ya existe
    const existingSubcategories = subcategoriesMap[parentCategory] || customSubcategories[parentCategory] || [];
    const subcategoryExists = existingSubcategories.some(sub => sub.name === name.toLowerCase());
    
    if (subcategoryExists) {
        showNotification('Ya existe una subcategoría con ese nombre', 'error');
        return;
    }
    
    // Agregar la nueva subcategoría
    const newSubcategory = {
        name: name.toLowerCase(),
        label: name,
        icon: icon
    };
    
    // Determinar si es una categoría predefinida o personalizada
    if (subcategoriesMap[parentCategory]) {
        subcategoriesMap[parentCategory].push(newSubcategory);
    } else if (customSubcategories[parentCategory]) {
        customSubcategories[parentCategory].push(newSubcategory);
    } else {
        // Si no existe, crear el array
        customSubcategories[parentCategory] = [newSubcategory];
    }
    
    // Guardar en localStorage
    saveCustomCategoriesToLocalStorage();
    
    // Limpiar formulario
    nameInput.value = '';
    
    // Cerrar el modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('customizeCategoriesModal'));
    if (modal) {
        modal.hide();
    }
    
    showNotification('Subcategoría agregada exitosamente', 'success');
}

// Función para eliminar categoría personalizada
function deleteCustomCategory(index) {
    if (confirm('¿Estás seguro de que deseas eliminar esta categoría? También se eliminarán todas sus subcategorías.')) {
        const category = customCategories[index];
        
        // Eliminar la categoría
        customCategories.splice(index, 1);
        
        // Eliminar sus subcategorías
        delete customSubcategories[category.name];
        
        // Guardar en localStorage
        saveCustomCategoriesToLocalStorage();
        
        // Actualizar la lista de categorías
        updateCustomCategoriesList();
        
        // Actualizar botones de categorías en la interfaz
        updateCategoryButtons();
        
        showNotification('Categoría eliminada exitosamente', 'success');
    }
}

// Función para actualizar botones de categorías en la interfaz
function updateCategoryButtons() {
    // Actualizar en Inicio
    updateCategoryButtonsInSection('inicio');
    
    // Actualizar en Pagos
    updateCategoryButtonsInSection('pagos');
}

// Función para actualizar botones de categorías en una sección específica
function updateCategoryButtonsInSection(sectionId) {
    const container = document.querySelector(`#${sectionId} .category-buttons`);
    if (!container) return;
    
    let html = '';
    
    // Agregar categorías predefinidas
    Object.keys(subcategoriesMap).forEach(category => {
        const isActive = selectedCategory === category;
        html += `
            <button class="category-btn ${isActive ? 'active' : ''}" data-category="${category}">
                <i class="bi bi-${getCategoryIcon(category)}"></i> ${getCategoryLabel(category)}
            </button>
        `;
    });
    
    // Agregar categorías personalizadas
    if (customCategories && customCategories.length > 0) {
        customCategories.forEach(category => {
            const isActive = selectedCategory === category.name;
            html += `
                <button class="category-btn ${isActive ? 'active' : ''}" data-category="${category.name}">
                    <i class="${category.icon}"></i> ${category.label}
                </button>
            `;
        });
    }
    
    // Agregar botón de personalizar
    const personalizeId = sectionId === 'inicio' ? 'personalize-categories-btn' : 'personalize-categories-btn-pagos';
    html += `
        <button class="category-btn" id="${personalizeId}">
            <i class="bi bi-sliders"></i> Personalizar
        </button>
    `;
    
    container.innerHTML = html;
    
    // Reconfigurar event listeners
    document.querySelectorAll(`#${sectionId} .category-btn`).forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.id.startsWith('personalize-categories-btn')) {
                showCustomizeCategoriesModal();
                return;
            }
            
            document.querySelectorAll(`#${sectionId} .category-btn`).forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            selectedCategory = this.getAttribute('data-category');
            
            // Mostrar subcategorías
            showSubcategories(sectionId, selectedCategory);
        });
    });
}

// Función auxiliar para obtener icono de categoría
function getCategoryIcon(category) {
    const iconMap = {
        vivienda: 'house',
        transporte: 'car-front',
        alimentacion: 'cup-straw',
        finanzas: 'cash-coin',
        salud: 'heart-pulse',
        entretenimiento: 'controller',
        ropa: 'bag',
        electronica: 'pc-display',
        hogar: 'houses',
        educacion: 'book'
    };
    
    return iconMap[category] || 'tag';
}

// Función para cargar categorías personalizadas desde localStorage
function loadCustomCategoriesFromLocalStorage() {
    const savedCustomCategories = localStorage.getItem('finli-custom-categories');
    const savedCustomSubcategories = localStorage.getItem('finli-custom-subcategories');
    
    if (savedCustomCategories) {
        customCategories = JSON.parse(savedCustomCategories);
    }
    
    if (savedCustomSubcategories) {
        customSubcategories = JSON.parse(savedCustomSubcategories);
    }
}

// Función para guardar categorías personalizadas en localStorage
function saveCustomCategoriesToLocalStorage() {
    localStorage.setItem('finli-custom-categories', JSON.stringify(customCategories));
    localStorage.setItem('finli-custom-subcategories', JSON.stringify(customSubcategories));
}

// Función auxiliar para obtener etiqueta de categoría
function getCategoryLabel(category) {
    // Buscar en categorías predefinidas
    const predefinedCategories = {
        vivienda: 'Vivienda',
        transporte: 'Transporte',
        alimentacion: 'Alimentación',
        finanzas: 'Finanzas Personales',
        salud: 'Cuidado Personal y Salud',
        entretenimiento: 'Entretenimiento y Ocio',
        ropa: 'Ropa',
        electronica: 'Electrónica',
        hogar: 'Artículos del Hogar',
        educacion: 'Educación'
    };
    
    if (predefinedCategories[category]) {
        return predefinedCategories[category];
    }
    
    // Buscar en categorías personalizadas
    const customCategory = customCategories.find(cat => cat.name === category);
    if (customCategory) {
        return customCategory.label;
    }
    
    return capitalizeFirstLetter(category);
}

// Función auxiliar para encontrar una subcategoría
function findSubcategory(category, subcategoryName) {
    if (!category || !subcategoryName) return null;
    
    const subcategories = subcategoriesMap[category] || customSubcategories[category] || [];
    return subcategories.find(sub => sub.name === subcategoryName) || null;
}

// ---- FUNCIONES UTILITARIAS ----
function showNotification(message, type = 'success') {
    // Crear notificación toast de Bootstrap
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        // Si no existe, crear el contenedor
        const container = document.createElement('div');
        container.className = 'toast-container position-fixed top-0 end-0 p-3';
        document.body.appendChild(container);
        toastContainer = container;
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
        <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">
                <i class="bi bi-${typeIcons[type] || 'info-circle'}-fill text-${typeColors[type] || 'primary'} me-2"></i>
                <strong class="me-auto">FinLi</strong>
                <small>Ahora</small>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `;
    
    // Agregar el toast al contenedor
    toastContainer.insertAdjacentHTML('beforeend', toastHTML);
    
    // Mostrar el toast
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
    
    // Eliminar el toast del DOM después de que se oculte
    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });
}

function formatDateTime(dateTimeString) {
    try {
        const date = new Date(dateTimeString);
        if (isNaN(date.getTime())) {
            return 'Fecha inválida';
        }
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch (error) {
        return 'Fecha inválida';
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function resetForm() {
    const transactionAmount = document.getElementById('transactionAmount');
    const transactionDescription = document.getElementById('transactionDescription');
    const transactionDateTime = document.getElementById('transactionDateTime');
    const paymentMethod = document.getElementById('paymentMethod');
    const transactionType = document.getElementById('transactionType');
    const imagePreview = document.getElementById('imagePreview');
    
    if (transactionAmount) transactionAmount.value = '';
    if (transactionDescription) transactionDescription.value = '';
    if (transactionDateTime) transactionDateTime.value = '';
    if (paymentMethod) paymentMethod.value = 'seleccion';
    if (transactionType) transactionType.value = 'seleccion';
    if (imagePreview) {
        imagePreview.innerHTML = `
            <div class="image-preview-placeholder">
                <small>Selecciona imagen</small>
            </div>
        `;
    }
    selectedImage = null;
    document.querySelectorAll('#inicio .category-btn').forEach(i => i.classList.remove('active'));
    document.querySelectorAll('#inicio .subcategory-btn').forEach(i => i.classList.remove('active'));
    const subcategoriesContainer = document.getElementById('subcategories-container');
    if (subcategoriesContainer) {
        subcategoriesContainer.innerHTML = '';
    }
    selectedCategory = null;
    selectedSubCategory = null;
    editingTransactionId = null;
}

function resetFormPagos() {
    const transactionAmountPagos = document.getElementById('transactionAmountPagos');
    const NamePago = document.getElementById('NamePago');
    const transactionDateTimePagos = document.getElementById('transactionDateTimePagos');
    const paymentMethodPagos = document.getElementById('paymentMethodPagos');
    const transactionTypePagos = document.getElementById('transactionTypePagos');
    const imagePreviewPagos = document.getElementById('imagePreviewPagos');
    
    if (transactionAmountPagos) transactionAmountPagos.value = '';
    if (NamePago) NamePago.value = '';
    if (transactionDateTimePagos) transactionDateTimePagos.value = '';
    if (paymentMethodPagos) paymentMethodPagos.value = 'seleccion';
    if (transactionTypePagos) transactionTypePagos.value = 'seleccion';
    if (imagePreviewPagos) {
        imagePreviewPagos.innerHTML = `
            <div class="image-preview-placeholder">
                <small>Selecciona imagen</small>
            </div>
        `;
    }
    selectedImage = null;
    document.querySelectorAll('#pagos .category-btn').forEach(i => i.classList.remove('active'));
    document.querySelectorAll('#pagos .subcategory-btn').forEach(i => i.classList.remove('active'));
    const subcategoriesContainerPagos = document.getElementById('subcategories-container-pagos');
    if (subcategoriesContainerPagos) {
        subcategoriesContainerPagos.innerHTML = '';
    }
    selectedCategory = null;
    selectedSubCategory = null;
    editingTransactionId = null;
}

function handleLogout() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        showNotification('Sesión cerrada correctamente', 'info');
        // Redirigir a la página de login después de 1 segundo
        setTimeout(() => {
            // En un entorno real, aquí iría la redirección al login
            window.location.href = '/frontend/src/pages/Autenticación/login.html';
            console.log('Redirigiendo al login...');
        }, 1000);
    }
}

// Función: Resetear filtros de informes
function resetReportFilters() {
    // Resetear periodo a mensual
    currentPeriod = 'mensual';
    document.querySelectorAll('#informes .btn-group .btn[data-period]').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-period') === 'mensual') {
            btn.classList.add('active');
        }
    });
    
    // Resetear filtro a categorías
    currentFilter = 'categorias';
    document.querySelectorAll('#informes .btn-group .btn[data-filter]').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-filter') === 'categorias') {
            btn.classList.add('active');
        }
    });
    
    // Resetear categorías y subcategorías seleccionadas
    selectedCategories = [];
    selectedSubCategories = [];
    selectedCategory = null;
    selectedSubCategory = null;
    
    // Limpiar selecciones de categorías
    document.querySelectorAll('#informes-category-filter .category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.querySelectorAll('#informes-subcategories-container .subcategory-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Limpiar contenedor de subcategorías
    const subcontainer = document.getElementById('informes-subcategories-container');
    if (subcontainer) {
        subcontainer.innerHTML = '';
        subcontainer.style.display = 'none';
    }
    
    // Resetear botón de subcategorías
    const showSubcategoriesBtn = document.getElementById('show-subcategories-btn');
    if (showSubcategoriesBtn) {
        showSubcategoriesBtn.innerHTML = '<i class="bi bi-arrow-down"></i> Ver Subcategorías';
    }
    
    // Resetear filtros de fecha
    const now = new Date();
    const currentMonth = now.toISOString().slice(0, 7);
    const monthFilter = document.getElementById('informes-month-filter');
    if (monthFilter) {
        monthFilter.value = currentMonth;
    }
    
    // Mostrar todos los gráficos
    showAllCharts();
    
    // Actualizar gráficos
    updateCharts();
    
    showNotification('Filtros reiniciados', 'info');
}

// Configurar event listeners para el modal de personalización
document.addEventListener('DOMContentLoaded', function() {
    // Configurar botones del modal de personalización
    const addNewCategoryBtn = document.getElementById('addNewCategoryBtn');
    const addNewSubcategoryBtn = document.getElementById('addNewSubcategoryBtn');
    
    if (addNewCategoryBtn) {
        addNewCategoryBtn.addEventListener('click', addNewCategory);
    }
    
    if (addNewSubcategoryBtn) {
        addNewSubcategoryBtn.addEventListener('click', addNewSubcategory);
    }
    
    // Configurar filtro de informes
    const informesFilterBtn = document.getElementById('FiltroProfileBtn');
    const informesFiltersContainer = document.querySelector('#informes .filters-container');
    
    if (informesFilterBtn && informesFiltersContainer) {
        informesFilterBtn.addEventListener('click', function() {
            informesFiltersContainer.classList.toggle('d-none');
            
            // Cambiar el ícono del botón según el estado
            const icon = informesFilterBtn.querySelector('i');
            if (informesFiltersContainer.classList.contains('d-none')) {
                icon.className = 'bi bi-funnel';
                informesFilterBtn.innerHTML = '<i class="bi bi-funnel"></i> Filtro';
            } else {
                icon.className = 'bi bi-funnel-fill';
                informesFilterBtn.innerHTML = '<i class="bi bi-funnel-fill"></i> Ocultar Filtros';
            }
        });
    }
});