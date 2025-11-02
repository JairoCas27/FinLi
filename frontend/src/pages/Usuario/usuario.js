// ---- VARIABLES GLOBALES ----
let transactions = [];
let selectedCategory = null;
let selectedSubCategory = null;
let selectedImage = null;
let editingTransactionId = null;
let currentPeriod = null; 
let currentFilter = 'categorias';

// Variables para selects de métodos de pago
let transferFromSelect = null;
let transferToSelect = null;
let incomePaymentMethodSelect = null;

// Variables globales para múltiples selecciones en informes
let selectedCategories = [];
let selectedSubCategories = [];

// Perfil de usuario
let userProfile = {
    name: 'Jairo Castillo',
    firstName: 'Jairo',
    lastName: 'Castillo',
    email: 'jairo@utp.edu.pe',
    age: '20',
    avatar: null
};

// Array para notificaciones
let notifications = [];

// Categorías personalizadas
let customCategories = [];
let customSubcategories = {};

// Variable para almacenar la sección actual
let currentSection = 'inicio';

// ---- VARIABLES GLOBALES PARA INGRESOS ----
let paymentMethods = [];
let transfers = [];
let incomeRecords = [];
let paymentMethodsChart = null;

// ---- VARIABLES GLOBALES PARA PAGOS PROGRAMADOS ----
let scheduledPayments = [];

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
    loadPaymentMethodsFromLocalStorage();
    loadTransfersFromLocalStorage();
    loadIncomeRecordsFromLocalStorage();
    loadCustomCategoriesFromLocalStorage();
    loadScheduledPaymentsFromLocalStorage();
    
    // INICIALIZAR MEDIOS DE PAGO POR DEFECTO  
    initializeDefaultPaymentMethods();
    
    // Establecer fecha y hora actual
    const now = new Date();
    const formattedNow = now.toISOString().slice(0, 16);
    
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
    
    // SINCRONIZAR TODOS LOS DATOS AL INICIO
    syncAllData();
    
    // Inicializar filtros dinámicos
    initializeDynamicFilters();
    
    // Asegurar que el select de métodos de pago esté actualizado
    updateIncomeTableMessage();
    updateTotalIncome();
    updateAllPaymentMethodSelects();
    
    // Inicializar gráficos (solo si estamos en la sección de informes)
    if (document.getElementById('informes').classList.contains('active')) {
        initializeCharts();
    }

    // Modal de contacto
    const contactModal = new bootstrap.Modal(document.getElementById('contactModal'));
    
    // Abrir modal de contacto al hacer clic en "Centro de Contacto"
    document.getElementById('contactCenterBtn').addEventListener('click', function() {
        contactModal.show();
    });
    
    // Manejar el envío del formulario de contacto
    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obtener los valores del formulario
        const name = document.getElementById('contactName').value;
        const email = document.getElementById('contactEmail').value;
        const message = document.getElementById('contactMessage').value;
        
        // Validación básica
        if (!name || !email || !message) {
            alert('Por favor, complete todos los campos del formulario.');
            return;
        }
        
        // Simular envío del formulario
        console.log('Enviando formulario de contacto:', { name, email, message });
        
        // Mostrar mensaje de éxito
        alert('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.');
        
        // Cerrar el modal
        contactModal.hide();
        
        // Limpiar el formulario
        document.getElementById('contactForm').reset();
        
    });
    
    // Código existente para el modal premium
    const premiumModal = new bootstrap.Modal(document.getElementById('premiumModal'));
    
    document.getElementById('openPremiumModalBtn').addEventListener('click', function() {
        premiumModal.show();
    });
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

// ---- CARGAR DATOS DE INGRESOS DESDE LOCALSTORAGE ----
function loadPaymentMethodsFromLocalStorage() {
    const savedPaymentMethods = localStorage.getItem('finli-payment-methods');
    if (savedPaymentMethods) {
        paymentMethods = JSON.parse(savedPaymentMethods);
    }
}

function loadTransfersFromLocalStorage() {
    const savedTransfers = localStorage.getItem('finli-transfers');
    if (savedTransfers) {
        transfers = JSON.parse(savedTransfers);
    }
}

function loadIncomeRecordsFromLocalStorage() {
    const savedIncomeRecords = localStorage.getItem('finli-income-records');
    if (savedIncomeRecords) {
        incomeRecords = JSON.parse(savedIncomeRecords);
    }
}

// ---- CARGAR PAGOS PROGRAMADOS DESDE LOCALSTORAGE ----
function loadScheduledPaymentsFromLocalStorage() {
    const savedScheduledPayments = localStorage.getItem('finli-scheduled-payments');
    if (savedScheduledPayments) {
        scheduledPayments = JSON.parse(savedScheduledPayments);
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

// ---- GUARDAR DATOS DE INGRESOS EN LOCALSTORAGE ----
function savePaymentMethodsToLocalStorage() {
    localStorage.setItem('finli-payment-methods', JSON.stringify(paymentMethods));
}

function saveTransfersToLocalStorage() {
    localStorage.setItem('finli-transfers', JSON.stringify(transfers));
}

function saveIncomeRecordsToLocalStorage() {
    localStorage.setItem('finli-income-records', JSON.stringify(incomeRecords));
}

// ---- GUARDAR PAGOS PROGRAMADOS EN LOCALSTORAGE ----
function saveScheduledPaymentsToLocalStorage() {
    localStorage.setItem('finli-scheduled-payments', JSON.stringify(scheduledPayments));
}

// ---- SINCRONIZACIÓN COMPLETA DE DATOS ----
function syncAllData() {
    // Actualizar balances
    updateBalance();
    updateTotalBalance();
    updateTotalIncome();
    
    // Actualizar interfaces
    renderTransactions();
    renderScheduledPayments();
    renderPaymentMethods();
    renderIncomeRecords();
    renderTransfers();
    
    // Actualizar gráficas si estamos en informes
    if (document.getElementById('informes')?.classList.contains('active')) {
        updateCharts();
    }
    
    // Actualizar notificaciones si estamos en esa sección
    if (document.getElementById('notificaciones')?.classList.contains('active')) {
        renderNotificationsSection();
    }
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
        ingresos: {
            title: 'Gestión de <span class="text-gradient">Ingresos</span>',
            subtitle: 'Medios de pago y transferencias'
        },
        pagos: {
            title: 'Tu <span class="text-gradient">Agenda</span> de Pagos',
            subtitle: 'Reportes mensuales y semanales'
        },
        informes: {
            title: 'Tus <span class="text-gradient">Finanzas</span> en Detalles',
            subtitle: 'Análisis y reportes financieros'
        },
        notificaciones: {
            title: 'Tus <span class="text-gradient">Notificaciones</span>',
            subtitle: 'Gestiona tus alertas y notificaciones'
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
            currentSection = targetSection;
            
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

            // ACTUALIZAR COMPONENTES ESPECÍFICOS DE CADA SECCIÓN
            if (targetSection === 'ingresos') {
                initializeIncomeSection();
            }

            if (targetSection === 'notificaciones') {
                renderNotificationsSection();
            }

            if (targetSection === 'inicio') {
                updateAllPaymentMethodSelects();
                updateBalance();
            }

            if (targetSection === 'informes') {
                setTimeout(() => {
                    updateCharts();
                }, 100);
            }
            
            if (targetSection === 'pagos') {
                renderScheduledPayments();
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

// ---- INICIALIZACIÓN DE LA SECCIÓN INGRESOS ----
function initializeIncomeSection() {
    renderPaymentMethods();
    renderTransfers();
    renderIncomeRecords();
    updatePaymentMethodsChart();
    setupIncomeEventListeners();
    updateAllPaymentMethodSelects();  
}

// ---- CONFIGURAR EVENT LISTENERS PARA INGRESOS ----
function setupIncomeEventListeners() {
    // Agregar medio de pago
    const addPaymentMethodBtn = document.getElementById('addPaymentMethodBtn');
    if (addPaymentMethodBtn) {
        addPaymentMethodBtn.addEventListener('click', addPaymentMethod);
    }
    
    // Realizar transferencia
    const makeTransferBtn = document.getElementById('makeTransferBtn');
    if (makeTransferBtn) {
        makeTransferBtn.addEventListener('click', makeTransfer);
    }
    
    // Registrar ingreso en sección ingresos
    const addIncomeBtnIngresos = document.getElementById('addIncomeBtn');
    if (addIncomeBtnIngresos) {
        addIncomeBtnIngresos.addEventListener('click', addIncome);
    }
}

// ---- AGREGAR MEDIO DE PAGO ----
function addPaymentMethod() {
    const name = document.getElementById('paymentMethodName').value.trim();
    const amount = parseFloat(document.getElementById('initialAmount').value);
    
    if (!name) {
        showNotification('Por favor ingresa un nombre para el medio de pago', 'error');
        return;
    }
    
    if (isNaN(amount) || amount < 0) {
        showNotification('Por favor ingresa un monto válido', 'error');
        return;
    }
    
    // Verificar si ya existe un medio de pago con ese nombre
    const existingMethod = paymentMethods.find(method => method.name.toLowerCase() === name.toLowerCase());
    if (existingMethod) {
        showNotification('Ya existe un medio de pago con ese nombre', 'error');
        return;
    }
    
    const paymentMethod = {
        id: Date.now(),
        name: name,
        balance: amount,
        initialAmount: amount
    };
    
    paymentMethods.push(paymentMethod);
    savePaymentMethodsToLocalStorage();
    renderPaymentMethods();
    updateAllPaymentMethodSelects(); 
    updatePaymentMethodsChart();
    updateTotalBalance();

    // REGISTRAR AUTOMÁTICAMENTE COMO INGRESO SI HAY MONTO INICIAL
    if (amount > 0) {
        const incomeRecord = {
            id: Date.now() + 1,
            methodId: paymentMethod.id,
            methodName: paymentMethod.name,
            amount: amount,
            description: 'Saldo inicial',
            date: new Date().toISOString(),
            formattedDate: formatDateTime(new Date().toISOString()),
            type: 'saldo_inicial'
        };
        
        incomeRecords.push(incomeRecord);
        saveIncomeRecordsToLocalStorage();
        syncIncomeTables();
        
        addNotification(`Saldo inicial registrado: S/. ${amount.toFixed(2)} en ${name}`, 'info');
    }
    
    // Limpiar formulario
    document.getElementById('paymentMethodName').value = '';
    document.getElementById('initialAmount').value = '';
    
    showNotification('Medio de pago agregado exitosamente', 'success');
}

// ---- RENDERIZAR MEDIOS DE PAGO ----
function renderPaymentMethods() {
    const table = document.getElementById('paymentMethodsTable');
    if (!table) return;
    
    table.innerHTML = '';
    
    if (paymentMethods.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="3" class="text-center py-4">
                    <div class="empty-state">
                        <i class="bi bi-wallet2"></i>
                        <div>No hay medios de pago registrados</div>
                        <small class="text-muted">Agrega tu primer medio de pago usando el formulario superior</small>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    // Renderizar tabla
    paymentMethods.forEach(method => {
        const paymentMethodClass = getPaymentMethodClass(method.name);
        const paymentMethodLogo = getPaymentMethodLogo(method.name);
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="payment-method-with-logo">
                    ${paymentMethodLogo}
                    <span class="payment-method-badge ${paymentMethodClass}">${method.name}</span>
                </div>
            </td>
            <td>S/. ${method.balance.toFixed(2)}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit-btn" onclick="editPaymentMethod(${method.id})" title="Editar">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="deletePaymentMethod(${method.id})" title="Eliminar">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        `;
        table.appendChild(tr);
    });
    
    // Actualizar selects
    if (transferFromSelect) {
        transferFromSelect.innerHTML = '<option value="">Selecciona el medio de pago</option>';
        paymentMethods.forEach(method => {
            const option = document.createElement('option');
            option.value = method.id;
            option.textContent = `${method.name} (S/. ${method.balance.toFixed(2)})`;
            transferFromSelect.appendChild(option);
        });
    }
    
    if (transferToSelect) {
        transferToSelect.innerHTML = '<option value="">Selecciona el medio de pago</option>';
        paymentMethods.forEach(method => {
            const option = document.createElement('option');
            option.value = method.id;
            option.textContent = `${method.name} (S/. ${method.balance.toFixed(2)})`;
            transferToSelect.appendChild(option);
        });
    }
    
    if (incomePaymentMethodSelect) {
        incomePaymentMethodSelect.innerHTML = '<option value="">Selecciona el medio de pago</option>';
        paymentMethods.forEach(method => {
            const option = document.createElement('option');
            option.value = method.id;
            option.textContent = `${method.name} (S/. ${method.balance.toFixed(2)})`;
            incomePaymentMethodSelect.appendChild(option);
        });
    }
}

// Función para obtener logo del método de pago
function getPaymentMethodLogo(methodName) {
    const methodMap = {
        'yape': '/frontend/public/img/Tipos/yape.png',
        'plin': '/frontend/public/img/Tipos/plin.png',
        'bcp': '/frontend/public/img/Tipos/bcp.png',
        'bbva': '/frontend/public/img/Tipos/bbva.png',
        'paypal': '/frontend/public/img/Tipos/paypal.png',
        'credito': '/frontend/public/img/Tipos/credito.png',
        'debito': '/frontend/public/img/Tipos/debito.png',
        'efectivo': '/frontend/public/img/Tipos/efectivo.png'
    };
    
    const logoPath = methodMap[methodName.toLowerCase()];
    if (logoPath) {
        return `<img src="${logoPath}" alt="${methodName}" class="payment-method-logo" onerror="this.style.display='none'">`;
    }
    return '';
}

// ---- ELIMINAR MEDIO DE PAGO ----
function deletePaymentMethod(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este medio de pago? Se perderán todos los datos asociados.')) {
        paymentMethods = paymentMethods.filter(method => method.id !== id);
        savePaymentMethodsToLocalStorage();
        renderPaymentMethods();
        updatePaymentMethodsChart();
        updateTotalBalance();
        showNotification('Medio de pago eliminado', 'success');
    }
}

function editPaymentMethod(id) {
    const method = paymentMethods.find(m => m.id === id);
    if (!method) return;
    
    // Crear modal de edición
    const modalBody = `
        <div class="mb-3">
            <label class="form-label">Nombre del Medio de Pago</label>
            <input type="text" class="form-control" id="editPaymentMethodName" value="${method.name}">
        </div>
        <div class="mb-3">
            <label class="form-label">Saldo Actual S/.</label>
            <input type="number" class="form-control" id="editPaymentMethodBalance" value="${method.balance.toFixed(2)}" step="0.01">
        </div>
        <div class="alert alert-info">
            <small><i class="bi bi-info-circle"></i> Al modificar el saldo, se registrará automáticamente como un ajuste.</small>
        </div>
    `;
    
    // Mostrar modal personalizado
    showCustomModal(
        'Editar Medio de Pago',
        modalBody,
        'Guardar Cambios',
        'secondary',
        () => {
            const newName = document.getElementById('editPaymentMethodName').value.trim();
            const newBalance = parseFloat(document.getElementById('editPaymentMethodBalance').value);
            
            if (!newName) {
                showNotification('Por favor ingresa un nombre válido', 'error');
                return false;
            }
            
            if (isNaN(newBalance) || newBalance < 0) {
                showNotification('Por favor ingresa un saldo válido', 'error');
                return false;
            }
            
            // Verificar si el nombre ya existe (excluyendo el actual)
            const nameExists = paymentMethods.some(m => 
                m.id !== id && m.name.toLowerCase() === newName.toLowerCase()
            );
            
            if (nameExists) {
                showNotification('Ya existe un medio de pago con ese nombre', 'error');
                return false;
            }
            
            // Calcular diferencia para registro de ajuste
            const balanceDifference = newBalance - method.balance;
            
            // Actualizar método de pago
            method.name = newName;
            method.balance = newBalance;
            
            // Registrar ajuste si hubo cambio en el saldo
            if (balanceDifference !== 0) {
                const adjustmentRecord = {
                    id: Date.now(),
                    methodId: method.id,
                    methodName: method.name,
                    amount: Math.abs(balanceDifference),
                    description: `Ajuste de saldo - ${balanceDifference > 0 ? 'Incremento' : 'Decremento'}`,
                    type: balanceDifference > 0 ? 'ajuste_ingreso' : 'ajuste_gasto',
                    date: new Date().toISOString(),
                    formattedDate: formatDateTime(new Date().toISOString())
                };
                
                incomeRecords.push(adjustmentRecord);
                saveIncomeRecordsToLocalStorage();
                
                addNotification(`Ajuste de saldo en ${method.name}: S/. ${Math.abs(balanceDifference).toFixed(2)}`, 'info');
            }
            
            savePaymentMethodsToLocalStorage();
            renderPaymentMethods();
            updateAllPaymentMethodSelects();
            updatePaymentMethodsChart();
            updateTotalBalance();
            syncIncomeTables();
            
            showNotification('Medio de pago actualizado exitosamente', 'success');
            return true;
        }
    );
}

// Función para mostrar modal personalizado
function showCustomModal(title, body, confirmText, confirmClass, onConfirm) {
    // Crear modal dinámicamente
    const modalId = 'customModal-' + Date.now();
    const modalHTML = `
        <div class="modal fade" id="${modalId}" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        ${body}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-${confirmClass}" id="${modalId}-confirm">${confirmText}</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modalElement = document.getElementById(modalId);
    const modal = new bootstrap.Modal(modalElement);
    
    // Configurar evento del botón confirmar
    document.getElementById(`${modalId}-confirm`).addEventListener('click', function() {
        if (onConfirm && onConfirm() !== false) {
            modal.hide();
        }
    });
    
    // Eliminar modal del DOM cuando se oculte
    modalElement.addEventListener('hidden.bs.modal', function() {
        document.body.removeChild(modalElement);
    });
    
    modal.show();
}

// ---- REALIZAR TRANSFERENCIA ----
function makeTransfer() {
    const fromId = parseInt(document.getElementById('transferFrom').value);
    const toId = parseInt(document.getElementById('transferTo').value);
    const amount = parseFloat(document.getElementById('transferAmount').value);
    
    if (!fromId || !toId) {
        showNotification('Por favor selecciona ambos medios de pago', 'error');
        return;
    }
    
    if (fromId === toId) {
        showNotification('No puedes transferir al mismo medio de pago', 'error');
        return;
    }
    
    if (isNaN(amount) || amount <= 0) {
        showNotification('Por favor ingresa un monto válido', 'error');
        return;
    }
    
    const fromMethod = paymentMethods.find(method => method.id === fromId);
    const toMethod = paymentMethods.find(method => method.id === toId);
    
    if (!fromMethod || !toMethod) {
        showNotification('Error: Medio de pago no encontrado', 'error');
        return;
    }
    
    if (fromMethod.balance < amount) {
        showNotification(`Saldo insuficiente en ${fromMethod.name}. Saldo disponible: S/. ${fromMethod.balance.toFixed(2)}`, 'error');
        return;
    }
    
    // Realizar la transferencia
    fromMethod.balance -= amount;
    toMethod.balance += amount;
    
    // Registrar la transferencia
    const transfer = {
        id: Date.now(),
        fromId: fromId,
        fromName: fromMethod.name,
        toId: toId,
        toName: toMethod.name,
        amount: amount,
        date: new Date().toISOString(),
        formattedDate: formatDateTime(new Date().toISOString())
    };
    
    transfers.push(transfer);
    
    // Guardar cambios
    savePaymentMethodsToLocalStorage();
    saveTransfersToLocalStorage();
    
    // ACTUALIZAR TODAS LAS INTERFACES
    renderPaymentMethods();
    renderTransfers();
    updatePaymentMethodsChart();
    updateTotalBalance();
    updateBalance(); // ACTUALIZAR BALANCE GENERAL
    updateAllPaymentMethodSelects();
    
    // Limpiar formulario
    document.getElementById('transferFrom').value = '';
    document.getElementById('transferTo').value = '';
    document.getElementById('transferAmount').value = '';
    
    // NOTIFICACIONES
    addNotification(`Transferencia: S/. ${amount.toFixed(2)} de ${fromMethod.name} a ${toMethod.name}`, 'info');
    showNotification('Transferencia realizada exitosamente', 'success');
}

// ---- AGREGAR TRANSACCIÓN EN INICIO ----
function addTransaction() {
    const amountInput = document.getElementById('transactionAmount');
    const descriptionInput = document.getElementById('transactionDescription');
    const dateTimeInput = document.getElementById('transactionDateTime');
    const paymentMethodSelect = document.getElementById('paymentMethod');
    
    if (!amountInput || !descriptionInput || !dateTimeInput || !paymentMethodSelect) {
        showNotification('Error: Elementos del formulario no encontrados', 'error');
        return;
    }
    
    const amount = parseFloat(amountInput.value);
    const description = descriptionInput.value.trim();
    const dateTime = dateTimeInput.value;
    const paymentMethodId = parseInt(paymentMethodSelect.value);
    
    // Validaciones básicas
    if (!paymentMethodId || paymentMethodSelect.value === 'seleccion') {
        showNotification('Por favor selecciona un método de pago válido', 'error');
        return;
    }
    
    if (isNaN(amount) || amount <= 0) {
        showNotification('Por favor ingresa un monto válido mayor a 0', 'error');
        return;
    }
    
    if (!dateTime) {
        showNotification('Por favor selecciona fecha y hora', 'error');
        return;
    }
    
    if (!selectedCategory) {
        showNotification('Por favor selecciona una categoría', 'error');
        return;
    }
    
    // Validar saldo suficiente
    if (!validateExpense(paymentMethodId, amount)) {
        return;
    }
    
    // Obtener el nombre del medio de pago
    const paymentMethod = paymentMethods.find(m => m.id === paymentMethodId);
    
    const transaction = {
        id: Date.now(),
        type: 'gasto',
        amount: amount,
        description: description,
        category: selectedCategory,
        subcategory: selectedSubCategory,
        paymentMethod: paymentMethod ? paymentMethod.name : 'Desconocido',
        paymentMethodId: paymentMethodId,
        image: selectedImage,
        dateTime: dateTime,
        formattedDate: formatDateTime(dateTime),
        status: 'completado'
    };
    
    transactions.push(transaction);
    
    // Actualizar saldo del medio de pago
    if (paymentMethod) {
        paymentMethod.balance -= amount;
        savePaymentMethodsToLocalStorage();
        renderPaymentMethods();
        updatePaymentMethodsChart();
        updateAllPaymentMethodSelects();
    }
    
    saveTransactionsToLocalStorage();
    renderTransactions();
    updateBalance(); // ACTUALIZAR BALANCE
    updateCharts(); // ACTUALIZAR GRÁFICAS
    resetForm();
    
    // NOTIFICACIONES SINCRONIZADAS
    addNotification(`Gasto registrado: ${description} - S/. ${amount.toFixed(2)}`, 'success');
    showNotification('Gasto registrado exitosamente', 'success');
}

// ---- ACTUALIZAR BALANCE TOTAL ----
function updateTotalBalance() {
    const totalBalance = paymentMethods.reduce((sum, method) => sum + method.balance, 0);
    
    // Actualizar en la sección de inicio si es necesario
    const balanceAmount = document.querySelector('.balance-amount');
    if (balanceAmount && !balanceAmount.textContent.includes('S/.')) {
        balanceAmount.textContent = `S/. ${totalBalance.toFixed(2)}`;
    }
}

// ---- ACTUALIZAR BALANCE GENERAL ----
function updateBalance() {
    // Calcular total de ingresos desde incomeRecords
    let totalIncome = incomeRecords.reduce((sum, income) => sum + income.amount, 0);
    
    // Calcular total de gastos desde transactions (solo los que no están cancelados)
    let totalExpenses = transactions
        .filter(transaction => transaction.type === 'gasto' && transaction.status !== 'cancelado')
        .reduce((sum, transaction) => sum + transaction.amount, 0);

    // Calcular balance total (ingresos - gastos)
    const totalBalance = totalIncome - totalExpenses;

    // Actualizar la tarjeta de balance en la sección de inicio
    const balanceAmount = document.querySelector('.balance-amount');
    const incomeElements = document.querySelectorAll('.balance-card .fs-4.fw-bold');
    
    if (balanceAmount) {
        balanceAmount.textContent = `S/. ${totalBalance.toFixed(2)}`;
    }

    if (incomeElements.length >= 2) {
        // Ingresos
        incomeElements[0].textContent = `S/. ${totalIncome.toFixed(2)}`;
        // Gastos
        incomeElements[1].textContent = `S/. ${totalExpenses.toFixed(2)}`;
    }

    // Actualizar también el texto de "este mes"
    const balanceLabel = document.querySelector('.balance-label.mt-2');
    if (balanceLabel) {
        const netChange = totalIncome - totalExpenses;
        balanceLabel.textContent = netChange >= 0 ? 
            `+ S/. ${netChange.toFixed(2)} este mes` : 
            `- S/. ${Math.abs(netChange).toFixed(2)} este mes`;
    }
}

// ---- VALIDAR GASTO ----
function validateExpense(paymentMethodId, amount) {
    const method = paymentMethods.find(m => m.id === paymentMethodId);
    if (!method) {
        showNotification('Error: Medio de pago no encontrado', 'error');
        return false;
    }
    
    if (method.balance < amount) {
        showNotification(`Saldo insuficiente en ${method.name}. Saldo disponible: S/. ${method.balance.toFixed(2)}`, 'error');
        return false;
    }
    
    return true;
}

// ---- OBTENER CLASE CSS PARA MÉTODO DE PAGO ----
function getPaymentMethodClass(methodName) {
    const methodMap = {
        'yape': 'payment-method-yape',
        'plin': 'payment-method-plin',
        'bcp': 'payment-method-bcp',
        'bbva': 'payment-method-bbva',
        'paypal': 'payment-method-paypal',
        'credito': 'payment-method-credito',
        'debito': 'payment-method-debito',
        'efectivo': 'payment-method-efectivo'
    };
    
    return methodMap[methodName.toLowerCase()] || 'payment-method-efectivo';
}

// ---- ACTUALIZAR GRÁFICO DE MÉTODOS DE PAGO ----
function updatePaymentMethodsChart() {
    const ctx = document.getElementById('paymentMethodsChart');
    if (!ctx || paymentMethods.length === 0) return;
    
    if (paymentMethodsChart) {
        paymentMethodsChart.destroy();
    }
    
    const labels = paymentMethods.map(method => method.name);
    const data = paymentMethods.map(method => method.balance);
    const backgroundColors = [
        '#0ea46f', '#06a3ff', '#8e44ad', '#f39c12', '#ff6b6b',
        '#3498db', '#9b59b6', '#2ecc71', '#f1c40f', '#e67e22'
    ];
    
    paymentMethodsChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
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
                    position: 'bottom',
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
            }
        }
    });
}

// ---- RENDERIZAR TRANSFERENCIAS ----
function renderTransfers() {
    const table = document.getElementById('transfersTable');
    if (!table) return;
    
    table.innerHTML = '';
    
    if (transfers.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-4">
                    <div class="empty-state">
                        <i class="bi bi-arrow-left-right"></i>
                        <div>No hay transferencias registradas</div>
                        <small class="text-muted">Las transferencias entre medios de pago aparecerán aquí</small>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    const sortedTransfers = [...transfers].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    sortedTransfers.forEach(transfer => {
        const fromMethodClass = getPaymentMethodClass(transfer.fromName);
        const toMethodClass = getPaymentMethodClass(transfer.toName);
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${transfer.formattedDate}</td>
            <td>
                <div class="d-flex align-items-center gap-2">
                    <i class="bi bi-arrow-left-right text-primary"></i>
                    <div class="payment-method-with-logo">
                        ${getPaymentMethodLogo(transfer.fromName)}
                        <span class="payment-method-badge ${fromMethodClass}">${transfer.fromName}</span>
                    </div>
                </div>
            </td>
            <td>
                <div class="d-flex align-items-center gap-2">
                    <i class="bi bi-arrow-left-right text-success"></i>
                    <div class="payment-method-with-logo">
                        ${getPaymentMethodLogo(transfer.toName)}
                        <span class="payment-method-badge ${toMethodClass}">${transfer.toName}</span>
                    </div>
                </div>
            </td>
            <td class="fw-bold">S/. ${transfer.amount.toFixed(2)}</td>
            <td>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteTransfer(${transfer.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        table.appendChild(tr);
    });
}

// Función para eliminar transferencias
function deleteTransfer(id) {
    const transfer = transfers.find(t => t.id === id);
    if (!transfer) return;
    
    if (!confirm(`¿Estás seguro de que deseas eliminar esta transferencia?\n${transfer.fromName} → ${transfer.toName} - S/. ${transfer.amount.toFixed(2)}`)) {
        return;
    }
    
    // Revertir la transferencia en los métodos de pago
    const fromMethod = paymentMethods.find(m => m.id === transfer.fromId);
    const toMethod = paymentMethods.find(m => m.id === transfer.toId);
    
    if (fromMethod) fromMethod.balance += transfer.amount;
    if (toMethod) toMethod.balance -= transfer.amount;
    
    // Eliminar la transferencia
    transfers = transfers.filter(t => t.id !== id);
    
    savePaymentMethodsToLocalStorage();
    saveTransfersToLocalStorage();
    
    renderPaymentMethods();
    renderTransfers();
    updateAllPaymentMethodSelects();
    updatePaymentMethodsChart();
    updateTotalBalance();
    
    showNotification('Transferencia eliminada exitosamente', 'success');
}

// Función para sincronizar todas las tablas de ingresos
function syncIncomeTables() {
    renderIncomeRecords();
    
    // Actualizar la tabla de ingresos en Inicio
    const inicioIncomeTable = document.getElementById('incomeTable');
    if (inicioIncomeTable) {
        renderIncomeRecords();
    }
}

// ---- VALIDAR GASTO ----
function validateExpense(paymentMethodId, amount) {
    const method = paymentMethods.find(m => m.id === paymentMethodId);
    if (!method) {
        showNotification('Error: Medio de pago no encontrado', 'error');
        return false;
    }
    
    if (method.balance < amount) {
        showNotification(`Saldo insuficiente en ${method.name}. Saldo disponible: S/. ${method.balance.toFixed(2)}`, 'error');
        return false;
    }
    
    return true;
}

// ---- INICIALIZAR MEDIOS DE PAGO POR DEFECTO ----
function initializeDefaultPaymentMethods() {
    if (paymentMethods.length === 0) {
        paymentMethods = [
            {
                id: 1,
                name: 'Efectivo',
                balance: 0,
                initialAmount: 0
            },
            {
                id: 2,
                name: 'Yape',
                balance: 0,
                initialAmount: 0
            },
            {
                id: 3,
                name: 'Plin',
                balance: 0,
                initialAmount: 0
            },
            {
                id: 4,
                name: 'PayPal',
                balance: 0,
                initialAmount: 0
            },
            {
                id: 5,
                name: 'BCP',
                balance: 0,
                initialAmount: 0
            },
            {
                id: 6,
                name: 'BBVA',
                balance: 0,
                initialAmount: 0
            },
            {
                id: 7,
                name: 'Credito',
                balance: 0,
                initialAmount: 0
            },
            {
                id: 8,
                name: 'Debito',
                balance: 0,
                initialAmount: 0
            }
        ];
        savePaymentMethodsToLocalStorage();
    }
}

// ---- GESTIÓN DE CATEGORÍAS Y SUBCATEGORÍAS ----
function initializeCategoryButtons() {
    // Cargar categorías personalizadas desde localStorage
    loadCustomCategoriesFromLocalStorage();
    
    // Actualizar los botones de categorías para incluir las personalizadas
    updateCategoryButtons();
    
    // Usar event delegation para manejar clics en categorías
    document.addEventListener('click', function(e) {
        // Botones de categoría en Inicio
        if (e.target.closest('#inicio .category-btn') && !e.target.closest('#inicio #personalize-categories-btn')) {
            const btn = e.target.closest('#inicio .category-btn');
            document.querySelectorAll('#inicio .category-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedCategory = btn.getAttribute('data-category');
            showSubcategories('inicio', selectedCategory);
        }
        
        // Botones de categoría en Pagos
        if (e.target.closest('#pagos .category-btn') && !e.target.closest('#pagos #personalize-categories-btn-pagos')) {
            const btn = e.target.closest('#pagos .category-btn');
            document.querySelectorAll('#pagos .category-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedCategory = btn.getAttribute('data-category');
            showSubcategories('pagos', selectedCategory);
        }
        
        // Botón personalizar en Inicio (sin funcionalidad)
        if (e.target.closest('#inicio #personalize-categories-btn')) {
            // Funcionalidad eliminada - no hacer nada
            showNotification('La funcionalidad de personalizar categorías disponible para premium', 'info');
        }
        
        // Botón personalizar en Pagos (sin funcionalidad)
        if (e.target.closest('#pagos #personalize-categories-btn-pagos')) {
            // Funcionalidad eliminada - no hacer nada
            showNotification('La funcionalidad de personalizar categorías disponible para premium', 'info');
        }
    });
}

// Función para mostrar subcategorías
function showSubcategories(section, category) {
    const containerId = section === 'inicio' ? 'subcategories-container' : 'subcategories-container-pagos';
    const container = document.getElementById(containerId);
    
    if (!container) return;
    
    // Buscar subcategorías en categorías predefinidas Y personalizadas
    const predefinedSubcategories = subcategoriesMap[category] || [];
    const customSubcategoriesForCategory = customSubcategories[category] || [];
    const allSubcategories = [...predefinedSubcategories, ...customSubcategoriesForCategory];
    
    if (allSubcategories.length > 0) {
        let html = `
            <div class="section-divider"></div>
            <h6 class="d-flex align-items-center gap-2 mb-3 text-warning">
                <i class="bi bi-tags"></i> Sub-Categoría ${getCategoryLabel(category)}
            </h6>
            <div class="category-buttons">
        `;
        
        allSubcategories.forEach(sub => {
            html += `
                <button class="subcategory-btn" data-category="${sub.name}">
                    <i class="${sub.icon}"></i> ${sub.label}
                </button>
            `;
        });
        
        // Agregar botón "+" para nueva subcategoría (sin funcionalidad)
        html += `
            <button class="subcategory-btn subcategory-add-btn" data-category="${category}">
                <i class="bi bi-plus"></i> Nueva Subcategoría
            </button>
        `;
        
        html += `</div>`;
        container.innerHTML = html;
        
        // Añadir event listeners a los botones de subcategoría
        document.querySelectorAll(`#${containerId} .subcategory-btn`).forEach(btn => {
            btn.addEventListener('click', function() {
                if (this.classList.contains('subcategory-add-btn')) {
                    // Si es el botón de añadir, mostrar mensaje (sin funcionalidad)
                    showNotification('La funcionalidad de agregar subcategorías disponible para premium', 'info');
                } else {
                    document.querySelectorAll(`#${containerId} .subcategory-btn`).forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    selectedSubCategory = this.getAttribute('data-category');
                }
            });
        });
    } else {
        // Si no hay subcategorías, mostrar solo el botón para añadir (sin funcionalidad)
        let html = `
            <div class="section-divider"></div>
            <h6 class="d-flex align-items-center gap-2 mb-3 text-warning">
                <i class="bi bi-tags"></i> Sub-Categoría ${getCategoryLabel(category)}
            </h6>
            <div class="category-buttons">
                <button class="subcategory-btn subcategory-add-btn" data-category="${category}">
                    <i class="bi bi-plus"></i> Nueva Subcategoría
                </button>
            </div>
        `;
        container.innerHTML = html;
        
        // Añadir event listener al botón de añadir (sin funcionalidad)
        const addButton = container.querySelector('.subcategory-add-btn');
        if (addButton) {
            addButton.addEventListener('click', function() {
                showNotification('La funcionalidad de agregar subcategorías no está disponible', 'info');
            });
        }
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
    const pagosFilterBtn = document.getElementById('FiltroPagosBtn');
    const pagosFiltersContainer = document.getElementById('pagos-filters-row');
    
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
                renderScheduledPayments();
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
            filterRow = document.getElementById('pagos-filters-row');
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
                    renderScheduledPayments();
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
                
                // Mostrar filtro de categorías
                showReportFilter();
                
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
                const filterType = this.getAttribute('data-filter');
                
                if (filterType === 'limpiar') {
                    resetReportFilters();
                    return;
                }
                
                if (filterType === 'limpiar-categorias') {
                    selectedCategories = [];
                    selectedSubCategories = [];
                    document.querySelectorAll('#informes .category-btn, #informes .subcategory-btn').forEach(btn => {
                        btn.classList.remove('active');
                    });
                    updateCharts();
                    showNotification('Filtros de categoría limpiados', 'info');
                    return;
                }
                
                // Mostrar filtro de categorías
                showReportFilter();
                
                // Actualizar gráficos
                updateCharts();
            });
        });
    }
    
    // Mostrar filtro inicial y asegurar que los tres gráficos sean visibles al inicio
    showReportFilter();
    
    // Forzar que al inicio se muestren los tres gráficos
    setTimeout(() => {
        updateChartsVisibility();
    }, 500);
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
    
    if (incomeExpensesCard) incomeExpensesCard.className = 'col-lg-12 mb-4';
    if (expensesCard) expensesCard.className = 'col-lg-12 mb-4';
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
    
    // Cambiar de addTransactionPagos a addScheduledPayment
    if (addTransactionBtnPagos) {
        addTransactionBtnPagos.addEventListener('click', addScheduledPayment);
    }
    
    // Agregar ingreso en sección inicio
    const addIncomeBtnInicio = document.getElementById('addIncomeBtnInicio');
    if (addIncomeBtnInicio) {
        addIncomeBtnInicio.addEventListener('click', addIncome);
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

    // Event listeners para la sección de notificaciones
    const markAllReadBtn = document.getElementById('markAllReadBtn');
    const clearAllNotificationsBtn = document.getElementById('clearAllNotificationsBtn');
    const notificationTypeFilter = document.getElementById('notificationTypeFilter');
    const notificationStatusFilter = document.getElementById('notificationStatusFilter');
    
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', markAllNotificationsAsRead);
    }
    
    if (clearAllNotificationsBtn) {
        clearAllNotificationsBtn.addEventListener('click', clearAllNotifications);
    }
    
    if (notificationTypeFilter) {
        notificationTypeFilter.addEventListener('change', renderNotificationsSection);
    }
    
    if (notificationStatusFilter) {
        notificationStatusFilter.addEventListener('change', renderNotificationsSection);
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

function validateTransactionForm(type, amount, dateTime, paymentMethodId) {
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
    if (!paymentMethodId) {
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
        
        // Obtener la clase del método de pago y el logo
        const paymentMethodClass = getPaymentMethodClass(transaction.paymentMethod);
        const paymentMethodLogo = getPaymentMethodLogo(transaction.paymentMethod);
        
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
                <div class="payment-method-with-logo-center">
                    ${paymentMethodLogo}
                </div>
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

// ---- AGREGAR PAGO PROGRAMADO ----
function addScheduledPayment() {
    const nameInput = document.getElementById('NamePago');
    const amountInput = document.getElementById('transactionAmountPagos');
    const dateTimeInput = document.getElementById('transactionDateTimePagos');
    const paymentMethodSelect = document.getElementById('paymentMethodPagos');
    
    if (!nameInput || !amountInput || !dateTimeInput || !paymentMethodSelect) {
        showNotification('Error: Elementos del formulario no encontrados', 'error');
        return;
    }
    
    const name = nameInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const dateTime = dateTimeInput.value;
    const paymentMethodId = parseInt(paymentMethodSelect.value);
    
    if (!name) {
        showNotification('Por favor ingresa un nombre para el pago', 'error');
        return;
    }
    
    if (isNaN(amount) || amount <= 0) {
        showNotification('Por favor ingresa un monto válido mayor a 0', 'error');
        return;
    }
    
    if (!dateTime) {
        showNotification('Por favor selecciona fecha y hora', 'error');
        return;
    }
    
    if (!paymentMethodId || paymentMethodSelect.value === 'seleccion') {
        showNotification('Por favor selecciona un método de pago', 'error');
        return;
    }
    
    if (!selectedCategory) {
        showNotification('Por favor selecciona una categoría', 'error');
        return;
    }
    
    // Obtener el nombre del medio de pago
    const paymentMethod = paymentMethods.find(m => m.id === paymentMethodId);
    
    const scheduledPayment = {
        id: Date.now(),
        name: name,
        amount: amount,
        category: selectedCategory,
        subcategory: selectedSubCategory,
        paymentMethod: paymentMethod ? paymentMethod.name : 'Desconocido',
        paymentMethodId: paymentMethodId,
        image: selectedImage,
        dateTime: dateTime,
        formattedDate: formatDateTime(dateTime),
        status: 'pendiente', // pendiente, completado, cancelado
        type: 'pago_programado'
    };
    
    scheduledPayments.push(scheduledPayment);
    saveScheduledPaymentsToLocalStorage();
    renderScheduledPayments();
    resetFormPagos();
    
    // NOTIFICACIONES
    addNotification(`Pago programado: ${name} - S/. ${amount.toFixed(2)}`, 'success');
    showNotification('Pago programado agregado exitosamente', 'success');
}

// ---- RENDERIZAR PAGOS PROGRAMADOS ----
function renderScheduledPayments() {
    const tbody = document.getElementById('transactionsTableBodyPagos');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (scheduledPayments.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-4">
                    <div class="empty-state">
                        <i class="bi bi-receipt"></i>
                        <div>No hay pagos programados</div>
                        <small class="text-muted">Agrega tu primer pago programado usando el formulario superior</small>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    const filteredPayments = filterScheduledPaymentsByPeriod(scheduledPayments, currentPeriod);
    const sortedPayments = [...filteredPayments].sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
    
    sortedPayments.forEach(payment => {
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
        
        const categoryStyle = categoryColors[payment.category] || { bg: 'rgba(108, 117, 125, 0.1)', color: 'var(--muted)' };
        
        // Obtener el nombre de la subcategoría
        let subcategoryLabel = '';
        if (payment.subcategory) {
            const subcat = findSubcategory(payment.category, payment.subcategory);
            subcategoryLabel = subcat ? subcat.label : payment.subcategory;
        }
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${payment.name}</td>
            <td>
                <div class="d-flex flex-column">
                    <span class="category-badge text-center" style="background-color: ${categoryStyle.bg}; color: ${categoryStyle.color};">
                        ${getCategoryLabel(payment.category)}
                    </span>
                    ${subcategoryLabel ? `
                        <small class="text-muted mt-1 text-center">${subcategoryLabel}</small>
                    ` : ''}
                </div>
            </td>
            <td class="transaction-amount-expense text-danger">
                -S/. ${payment.amount.toFixed(2)}
            </td>
            <td>${payment.formattedDate}</td>
            <td>
                <select class="form-select form-select-sm status-select" data-payment-id="${payment.id}" onchange="updateScheduledPaymentStatus(${payment.id}, this.value)">
                    <option value="pendiente" ${payment.status === 'pendiente' ? 'selected' : ''}>Pendiente</option>
                    <option value="completado" ${payment.status === 'completado' ? 'selected' : ''}>Completado</option>
                    <option value="cancelado" ${payment.status === 'cancelado' ? 'selected' : ''}>Cancelado</option>
                </select>
            </td>
            <td class="text-end">
                <div class="action-buttons">
                    <button class="action-btn edit-btn" onclick="editScheduledPayment(${payment.id})" title="Editar">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="confirmDeleteScheduledPayment(${payment.id})" title="Eliminar">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
}

// ---- ACTUALIZAR ESTADO DEL PAGO PROGRAMADO ----
function updateScheduledPaymentStatus(paymentId, newStatus) {
    const payment = scheduledPayments.find(p => p.id === paymentId);
    if (payment) {
        payment.status = newStatus;
        
        // Si el pago se marca como completado, crear una transacción
        if (newStatus === 'completado') {
            const transaction = {
                id: Date.now(),
                type: 'gasto',
                amount: payment.amount,
                description: payment.name,
                category: payment.category,
                subcategory: payment.subcategory,
                paymentMethod: payment.paymentMethod,
                paymentMethodId: payment.paymentMethodId,
                image: payment.image,
                dateTime: new Date().toISOString(),
                formattedDate: formatDateTime(new Date().toISOString()),
                status: 'completado',
                source: 'pago_programado'
            };
            
            transactions.push(transaction);
            
            // Actualizar saldo del medio de pago
            const method = paymentMethods.find(m => m.id === payment.paymentMethodId);
            if (method) {
                method.balance -= payment.amount;
                savePaymentMethodsToLocalStorage();
                renderPaymentMethods();
                updatePaymentMethodsChart();
            }
            
            saveTransactionsToLocalStorage();
            renderTransactions();
            updateBalance();
        }
        
        // Si el pago se marca como cancelado, también crear una transacción
        if (newStatus === 'cancelado') {
            const transaction = {
                id: Date.now(),
                type: 'gasto',
                amount: payment.amount,
                description: `${payment.name} (Cancelado)`,
                category: payment.category,
                subcategory: payment.subcategory,
                paymentMethod: payment.paymentMethod,
                paymentMethodId: payment.paymentMethodId,
                image: payment.image,
                dateTime: new Date().toISOString(),
                formattedDate: formatDateTime(new Date().toISOString()),
                status: 'cancelado',
                source: 'pago_programado'
            };
            
            transactions.push(transaction);
            saveTransactionsToLocalStorage();
            renderTransactions();
            updateBalance();
        }
        
        saveScheduledPaymentsToLocalStorage();
        renderScheduledPayments();
        
        showNotification(`Estado del pago actualizado a: ${newStatus}`, 'success');
    }
}

// ---- FILTRAR PAGOS PROGRAMADOS POR PERIODO ----
function filterScheduledPaymentsByPeriod(payments, period) {
    let filteredPayments = [...payments];
    
    if (filteredPayments.length === 0) {
        return filteredPayments;
    }
    
    let filterValue = null;
    
    switch(period) {
        case 'mensual':
            const monthFilter = document.getElementById('pagos-month-filter');
            if (monthFilter && monthFilter.value) {
                filterValue = monthFilter.value;
                filteredPayments = filteredPayments.filter(p => {
                    try {
                        const paymentDate = new Date(p.dateTime);
                        return paymentDate.toISOString().slice(0, 7) === filterValue;
                    } catch (error) {
                        return false;
                    }
                });
            }
            break;
            
        case 'quincenal':
        case 'semanal':
            const startDate = document.getElementById('pagos-start-date');
            const endDate = document.getElementById('pagos-end-date');
            if (startDate && startDate.value && endDate && endDate.value) {
                const start = new Date(startDate.value);
                const end = new Date(endDate.value);
                end.setHours(23, 59, 59, 999);
                
                filteredPayments = filteredPayments.filter(p => {
                    try {
                        const paymentDate = new Date(p.dateTime);
                        return paymentDate >= start && paymentDate <= end;
                    } catch (error) {
                        return false;
                    }
                });
            }
            break;
            
        case 'diario':
            const dayFilter = document.getElementById('pagos-day-filter');
            if (dayFilter && dayFilter.value) {
                filterValue = dayFilter.value;
                filteredPayments = filteredPayments.filter(p => {
                    try {
                        const paymentDate = new Date(p.dateTime);
                        return paymentDate.toISOString().slice(0, 10) === filterValue;
                    } catch (error) {
                        return false;
                    }
                });
            }
            break;
    }
    
    return filteredPayments;
}

// ---- FILTROS DE PERIODO ----
function filterTransactionsByPeriod(transactionsList, period, section = 'inicio') {
    let filteredTransactions = [...transactionsList];
    
    // Si no hay transacciones, retornar array vacío
    if (filteredTransactions.length === 0) {
        return filteredTransactions;
    }
    
    // Obtener valores de filtro según la sección
    let filterValue = null;
    
    switch(period) {
        case 'mensual':
            const monthFilter = document.getElementById(`${section}-month-filter`);
            if (monthFilter && monthFilter.value) {
                filterValue = monthFilter.value;
                filteredTransactions = filteredTransactions.filter(t => {
                    try {
                        const transDate = new Date(t.dateTime);
                        return transDate.toISOString().slice(0, 7) === filterValue;
                    } catch (error) {
                        return false;
                    }
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
                    try {
                        const transDate = new Date(t.dateTime);
                        return transDate >= start && transDate <= end;
                    } catch (error) {
                        return false;
                    }
                });
            }
            break;
            
        case 'diario':
            const dayFilter = document.getElementById(`${section}-day-filter`);
            if (dayFilter && dayFilter.value) {
                filterValue = dayFilter.value;
                filteredTransactions = filteredTransactions.filter(t => {
                    try {
                        const transDate = new Date(t.dateTime);
                        return transDate.toISOString().slice(0, 10) === filterValue;
                    } catch (error) {
                        return false;
                    }
                });
            }
            break;
    }
    
    return filteredTransactions;
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
    
    try {
        updateIncomeExpensesChart();
        updateExpensesChart();
        updateBalanceChart();
        updateChartsVisibility();
        
        // Forzar resize de los gráficos
        setTimeout(() => {
            if (incomeExpensesChart) incomeExpensesChart.resize();
            if (expensesChart) expensesChart.resize();
            if (balanceChart) balanceChart.resize();
        }, 100);
    } catch (error) {
        console.error('Error actualizando gráficas:', error);
    }
}

// ---- ACTUALIZAR GRÁFICO INGRESOS VS GASTOS ----
function updateIncomeExpensesChart() {
    const ctx = document.getElementById('incomeExpensesChart');
    if (!ctx) return;
    
    const filteredIncome = getFilteredIncomeForCharts();
    const filteredExpenses = getFilteredTransactionsForCharts()
        .filter(transaction => transaction.type === 'gasto' && transaction.status !== 'cancelado');
    
    // Agrupar por periodo según el filtro actual
    const periodData = {};
    
    // Procesar ingresos
    filteredIncome.forEach(income => {
        const date = new Date(income.date);
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
            default:
                periodKey = `${date.getFullYear()}-${date.getMonth()}`;
                periodLabel = date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
        }
        
        if (!periodData[periodKey]) {
            periodData[periodKey] = { income: 0, expenses: 0, label: periodLabel };
        }
        
        periodData[periodKey].income += income.amount;
    });
    
    // Procesar gastos
    filteredExpenses.forEach(transaction => {
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
            default:
                periodKey = `${date.getFullYear()}-${date.getMonth()}`;
                periodLabel = date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
        }
        
        if (!periodData[periodKey]) {
            periodData[periodKey] = { income: 0, expenses: 0, label: periodLabel };
        }
        
        periodData[periodKey].expenses += transaction.amount;
    });
    
    const labels = Object.values(periodData).map(data => data.label);
    const incomeData = Object.values(periodData).map(data => data.income);
    const expensesData = Object.values(periodData).map(data => data.expenses);
    
    if (incomeExpensesChart) {
        incomeExpensesChart.destroy();
    }
    
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

// ---- FILTRAR INGRESOS PARA GRÁFICOS ----
function getFilteredIncomeForCharts() {
    let filtered = [...incomeRecords];
    
    // Aplicar filtros según la configuración actual
    if (currentPeriod === 'mensual') {
        const monthFilter = document.getElementById('informes-month-filter');
        if (monthFilter && monthFilter.value) {
            filtered = filtered.filter(income => {
                const incomeDate = new Date(income.date);
                return incomeDate.toISOString().slice(0, 7) === monthFilter.value;
            });
        }
    } else if (currentPeriod === 'quincenal' || currentPeriod === 'semanal') {
        const startDate = document.getElementById('informes-start-date');
        const endDate = document.getElementById('informes-end-date');
        if (startDate && startDate.value && endDate && endDate.value) {
            const start = new Date(startDate.value);
            const end = new Date(endDate.value);
            end.setHours(23, 59, 59, 999);
            
            filtered = filtered.filter(income => {
                const incomeDate = new Date(income.date);
                return incomeDate >= start && incomeDate <= end;
            });
        }
    }
    
    return filtered;
}

// Función para actualizar gráfico de distribución de gastos con selección múltiple
function updateExpensesChart() {
    const ctx = document.getElementById('expensesChart');
    if (!ctx) return;
    
    const filteredTransactions = getFilteredTransactionsForCharts();
    const expenses = filteredTransactions.filter(t => t.type === 'gasto' && t.status !== 'cancelado');
    
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
    const filteredIncome = getFilteredIncomeForCharts();
    
    // Calcular balance acumulado por mes
    const monthlyBalance = {};
    let runningBalance = 0;
    
    // Combinar y ordenar todas las transacciones e ingresos por fecha
    const allRecords = [
        ...filteredTransactions.map(t => ({ ...t, type: t.type, amount: t.type === 'ingreso' ? t.amount : -t.amount, date: new Date(t.dateTime) })),
        ...filteredIncome.map(i => ({ ...i, type: 'ingreso', amount: i.amount, date: new Date(i.date) }))
    ];
    
    // Ordenar por fecha
    const sortedRecords = allRecords.sort((a, b) => a.date - b.date);
    
    sortedRecords.forEach(record => {
        const date = new Date(record.date);
        const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
        const label = date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
        
        if (!monthlyBalance[monthKey]) {
            monthlyBalance[monthKey] = { balance: runningBalance, label: label };
        }
        
        runningBalance += record.amount;
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

// ---- CONTROL DE VISIBILIDAD DE GRÁFICOS ----
function updateChartsVisibility() {
    const incomeExpensesCard = document.querySelector('#incomeExpensesChart').closest('.card-report');
    const expensesCard = document.querySelector('#expensesChart').closest('.card-report');
    const balanceCard = document.querySelector('#balanceChart').closest('.card-report');
    
    // Mostrar todos los gráficos inicialmente
    incomeExpensesCard.style.display = 'block';
    expensesCard.style.display = 'block';
    balanceCard.style.display = 'block';
    
    // Si hay filtro de período activo (mensual, quincenal, semanal) Y NO hay filtro de categoría
    if (currentPeriod && currentPeriod !== 'seleccion' && selectedCategories.length === 0 && selectedSubCategories.length === 0) {
        // SOLO mostrar Ingresos vs Gastos, OCULTAR los otros dos
        incomeExpensesCard.style.display = 'block';
        expensesCard.style.display = 'none';
        balanceCard.style.display = 'none';
    }
    // Si hay filtro de categoría o subcategoría activo Y NO hay filtro de período
    else if ((selectedCategories.length > 0 || selectedSubCategories.length > 0) && (!currentPeriod || currentPeriod === 'seleccion')) {
        // SOLO mostrar Distribución de Gastos, OCULTAR los otros dos
        incomeExpensesCard.style.display = 'none';
        expensesCard.style.display = 'block';
        balanceCard.style.display = 'none';
    }
    // Si hay ambos filtros activos (período Y categoría)
    else if ((selectedCategories.length > 0 || selectedSubCategories.length > 0) && currentPeriod && currentPeriod !== 'seleccion') {
        // Mostrar ambos gráficos relevantes, OCULTAR Balance
        incomeExpensesCard.style.display = 'block';
        expensesCard.style.display = 'block';
        balanceCard.style.display = 'none';
    }
    // Si no hay ningún filtro activo
    else {
        // Mostrar los tres gráficos
        incomeExpensesCard.style.display = 'block';
        expensesCard.style.display = 'block';
        balanceCard.style.display = 'block';
    }
}

// ---- FUNCIÓN MEJORADA PARA FILTROS DE INFORME ----
function showReportFilter() {
    const container = document.getElementById('informes-category-filter-container');
    if (!container) return;
    
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
            <button class="btn btn-sm btn-outline-success" id="show-subcategories-btn">
                <i class="bi bi-arrow-down"></i> Ver Subcategorías
            </button>
        </div>

        <div id="informes-subcategories-container" style="display: none;">
            <!-- Las subcategorías se cargarán aquí dinámicamente -->
        </div>
    `;
    
    container.innerHTML = html;
    
    // Configurar event listeners
    document.querySelectorAll('#informes-category-buttons .category-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            if (this.classList.contains('active')) {
                this.classList.remove('active');
                selectedCategories = selectedCategories.filter(cat => cat !== category);
            } else {
                this.classList.add('active');
                selectedCategories.push(category);
            }
            
            updateCharts();
        });
    });

    // ---- FUNCIÓN PARA MOSTRAR SUBCATEGORÍAS EN INFORME ----
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
        
        // Añadir event listeners a los botones de subcategoría
        document.querySelectorAll('#informes-subcategories-container .subcategory-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const subcategory = this.getAttribute('data-category');
                
                if (this.classList.contains('active')) {
                    this.classList.remove('active');
                    selectedSubCategories = selectedSubCategories.filter(sub => sub !== subcategory);
                } else {
                    this.classList.add('active');
                    selectedSubCategories.push(subcategory);
                }
                
                updateCharts();
            });
        });
    }
    
    // Botón para mostrar subcategorías
    const showSubcategoriesBtn = document.getElementById('show-subcategories-btn');
    if (showSubcategoriesBtn) {
        showSubcategoriesBtn.addEventListener('click', function() {
            const subcontainer = document.getElementById('informes-subcategories-container');
            if (subcontainer.style.display === 'none') {
                subcontainer.style.display = 'block';
                this.innerHTML = '<i class="bi bi-arrow-up"></i> Ocultar Subcategorías';
                showInformesSubcategories();
            } else {
                subcontainer.style.display = 'none';
                this.innerHTML = '<i class="bi bi-arrow-down"></i> Ver Subcategorías';
            }
        });
    }

    // Limpiar selecciones de categoría al mostrar el filtro
    selectedCategories = [];
    selectedSubCategories = [];
    document.querySelectorAll('#informes-category-buttons .category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
}

// ---- MOSTRAR CONTROLES DE PERIODO EN INFORMES ----
function showInformesPeriodFilter(period) {
    const container = document.getElementById('informes-period-filter-container');
    if (!container) return;
    
    const now = new Date();
    let html = '';
    
    switch(period) {
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
    
    // Agregar event listeners a los nuevos inputs
    const inputs = container.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('change', () => {
            updateCharts();
        });
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
        
        // Obtener la clase del método de pago
        const paymentMethodClass = getPaymentMethodClass(transaction.paymentMethod);
        
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
                <div class="transaction-detail-label">Método de Pago</div>
                <div class="transaction-detail-value">
                    <span class="payment-method-badge ${paymentMethodClass}">${transaction.paymentMethod}</span>
                </div>
            </div>
            <div class="transaction-detail-item">
                <div class="transaction-detail-label">Monto</div>
                <div class="transaction-detail-value ${transaction.type === 'ingreso' ? 'transaction-amount-income text-success' : 'transaction-amount-expense'}">
                    ${transaction.type === 'ingreso' ? '+' : '-'}S/. ${transaction.amount.toFixed(2)}
                </div>
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

        // Obtener la clase del método de pago
        const paymentMethodClass = getPaymentMethodClass(transaction.paymentMethod);
        
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
                    <span class="payment-method-badge ${paymentMethodClass}">${transaction.paymentMethod}</span>
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
                <i class="bi bi-tags text-success"></i>Categoría
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
        renderScheduledPayments();
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
    
    // Si es un gasto, revertir el saldo en el método de pago
    if (transaction && transaction.type === 'gasto') {
        const method = paymentMethods.find(m => m.name === transaction.paymentMethod);
        if (method) {
            method.balance += transaction.amount;
            savePaymentMethodsToLocalStorage();
            renderPaymentMethods();
            updatePaymentMethodsChart();
        }
    }
    
    transactions = transactions.filter(t => t.id !== id);
    saveTransactionsToLocalStorage();
    
    // ACTUALIZAR TODAS LAS INTERFACES
    renderTransactions();
    renderScheduledPayments();
    updateBalance();
    updateCharts();
    
    // NOTIFICACIONES
    if (transaction) {
        addNotification(`Transacción eliminada: ${transaction.description} - S/. ${transaction.amount.toFixed(2)}`, 'warning');
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
    updateNotificationsUI(); // Cargar iniciales en dropdown y badge
}

function addNotification(message, type = 'info') {
    if (!message) return; // No añadir notificaciones vacías

    const notification = {
        id: Date.now(),
        message: message,
        type: type,
        timestamp: new Date().toISOString(),
        read: false
    };

    notifications.unshift(notification); // Añadir al principio

    // Limitar a ~50 notificaciones
    if (notifications.length > 50) {
        notifications = notifications.slice(0, 50);
    }

    saveNotificationsToLocalStorage();
    updateNotificationsUI(); // Actualizar badge y dropdown

    // Si estamos en la sección de notificaciones, actualizarla
    if (document.getElementById('notificaciones')?.classList.contains('active')) {
        renderNotificationsSection();
    }

    // Mostrar notificación toast emergente
    showToastNotification(message, type);
}

// Actualiza el badge y el dropdown del header
function updateNotificationsUI() {
    const badge = document.querySelector('#notificationsDropdown .badge');
    const dropdownMenu = document.querySelector('.dropdown-notifications');

    if (!badge || !dropdownMenu) return;

    // Contar no leídas
    const unreadCount = notifications.filter(n => !n.read).length;
    badge.textContent = unreadCount > 0 ? unreadCount : '';
    badge.style.display = unreadCount > 0 ? 'inline-block' : 'none';

    // Actualizar dropdown (mostrar ~5 más recientes)
    let dropdownHTML = `
        <li><h6 class="dropdown-header">Notificaciones (${unreadCount} nuevas)</h6></li>
        <li><hr class="dropdown-divider"></li>
    `;

    if (notifications.length === 0) {
        dropdownHTML += `<li><span class="dropdown-item text-muted text-center small">No hay notificaciones</span></li>`;
    } else {
        notifications.slice(0, 5).forEach(n => {
            const icon = getNotificationIcon(n.type);
            const textClass = getNotificationTextClass(n.type);
            const timeAgo = formatTimeAgo(n.timestamp); 

            dropdownHTML += `
                <li>
                    <a class="dropdown-item ${n.read ? 'opacity-75' : 'fw-bold'}" href="#" onclick="handleNotificationClick(${n.id})">
                        <div class="d-flex align-items-start">
                            <i class="bi ${icon} ${textClass} me-2 fs-5"></i>
                            <div class="flex-grow-1">
                                <div class="small">${n.message}</div>
                                <div class="text-muted small">${timeAgo}</div>
                            </div>
                            ${!n.read ? '<span class="badge bg-success rounded-pill ms-2" style="font-size: 0.6em;">●</span>' : ''}
                        </div>
                    </a>
                </li>
            `;
        });
        dropdownHTML += `<li><hr class="dropdown-divider"></li>`;
    }

    dropdownHTML += `<li><a class="dropdown-item text-center small text-success" href="#" onclick="showSection('notificaciones'); return false;">Ver todas</a></li>`;

    dropdownMenu.innerHTML = dropdownHTML;
}

// Formatear tiempo relativo (simple)
function formatTimeAgo(isoTimestamp) {
    try {
        const date = new Date(isoTimestamp);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        if (seconds < 60) return `hace ${seconds} seg`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `hace ${minutes} min`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `hace ${hours} hr`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `hace ${days} día${days > 1 ? 's' : ''}`;
        return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    } catch (e) {
        return 'hace un momento';
    }
}

// Manejar clic en una notificación del dropdown
function handleNotificationClick(id) {
    markNotificationAsRead(id);
    showSection('notificaciones');
    setTimeout(() => {
        const item = document.querySelector(`.notification-item[data-id="${id}"]`);
        item?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        item?.classList.add('highlight');
        setTimeout(() => item?.classList.remove('highlight'), 1500);
    }, 300);
}

function getNotificationIcon(type) {
    switch(type) {
        case 'success': return 'bi-check-circle-fill';
        case 'error': return 'bi-x-octagon-fill';
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
    if (notification && !notification.read) {
        notification.read = true;
        saveNotificationsToLocalStorage();
        updateNotificationsUI();

        // Si estamos en la sección de notificaciones, actualizarla
        if (document.getElementById('notificaciones')?.classList.contains('active')) {
            renderNotificationsSection();
        }
    }
}

function markAllNotificationsAsRead() {
    let changed = false;
    notifications.forEach(notification => {
        if (!notification.read) {
            notification.read = true;
            changed = true;
        }
    });
    if(changed) {
        saveNotificationsToLocalStorage();
        updateNotificationsUI();
        if (document.getElementById('notificaciones')?.classList.contains('active')) {
            renderNotificationsSection();
        }
        showToastNotification("Todas las notificaciones marcadas como leídas.", "info");
    }
}

function clearAllNotifications() {
    if (notifications.length > 0 && confirm('¿Estás seguro de que deseas eliminar TODAS las notificaciones?')) {
        notifications = [];
        saveNotificationsToLocalStorage();
        updateNotificationsUI();
        if (document.getElementById('notificaciones')?.classList.contains('active')) {
            renderNotificationsSection();
        }
        showToastNotification("Historial de notificaciones limpiado.", "success");
    }
}

// Muestra notificación emergente (Toast)
function showToastNotification(message, type = 'success') {
    const toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        console.error("Toast container not found!");
        return;
    }

    const toastId = 'toast-' + Date.now();
    const iconClass = getNotificationIcon(type);
    const textClass = getNotificationTextClass(type);
    const headerColorClass = `text-bg-${type === 'error' ? 'danger' : (type === 'warning' ? 'warning' : 'secondary')}`;

    const toastHTML = `
        <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="5000">
            <div class="toast-header ${headerColorClass} text-white">
                <i class="bi ${iconClass} me-2"></i>
                <strong class="me-auto">FinLi Notificación</strong>
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
    if (toastElement) {
        const toast = new bootstrap.Toast(toastElement);
        toast.show();
        toastElement.addEventListener('hidden.bs.toast', () => toastElement.remove());
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

// Función para mostrar el modal de personalización de categorías (SIN FUNCIONALIDAD)
function showCustomizeCategoriesModal(preselectedCategory = null) {
    // Funcionalidad eliminada - solo mostrar mensaje
    showNotification('La funcionalidad de personalizar categorías no está disponible', 'info');
}

// Función para actualizar el contenido del modal (SIN FUNCIONALIDAD)
function updateCustomizeCategoriesModal() {
    // Funcionalidad eliminada - no hacer nada
}

// Función para actualizar las opciones de categorías padre (SIN FUNCIONALIDAD)
function updateParentCategoryOptions() {
    // Funcionalidad eliminada - no hacer nada
}

// Función para actualizar la lista de categorías personalizadas (SIN FUNCIONALIDAD)
function updateCustomCategoriesList() {
    // Funcionalidad eliminada - no hacer nada
}

// Función para agregar nueva categoría (SIN FUNCIONALIDAD)
function addNewCategory() {
    showNotification('La funcionalidad de agregar categorías disponible para premium', 'info');
}

// Función para agregar nueva subcategoría (SIN FUNCIONALIDAD)
function addNewSubcategory() {
    showNotification('La funcionalidad de agregar subcategorías disponible para premium', 'info');
}

// Función para eliminar categoría personalizada (SIN FUNCIONALIDAD)
function deleteCustomCategory(index) {
    showNotification('La funcionalidad de eliminar categorías disponible para premium', 'info');
}

// Función para editar una categoría personalizada (SIN FUNCIONALIDAD)
function editCustomCategory(index) {
    showNotification('La funcionalidad de editar categorías disponible para premium', 'info');
}

// Función para editar una subcategoría (SIN FUNCIONALIDAD)
function editSubcategory(categoryName, subcategoryIndex, isCustomCategory = false) {
    showNotification('La funcionalidad de editar subcategorías disponible para premium', 'info');
}

// Función mejorada para eliminar subcategorías (SIN FUNCIONALIDAD)
function deleteSubcategory(categoryName, subcategoryName, isCustomCategory = false) {
    showNotification('La funcionalidad de eliminar subcategorías disponible para premium', 'info');
}

// Función mejorada para la pestaña de gestión (SIN FUNCIONALIDAD)
function updateManageCategoriesTab() {
    // Funcionalidad eliminada - no hacer nada
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
    
    // Agregar botón de personalizar (SIN FUNCIONALIDAD)
    const personalizeId = sectionId === 'inicio' ? 'personalize-categories-btn' : 'personalize-categories-btn-pagos';
    html += `
        <button class="category-btn" id="${personalizeId}">
            <i class="bi bi-sliders"></i> Personalizar
        </button>
    `;
    
    container.innerHTML = html;
}

// Función auxiliar para obtener icono de categoría
function getCategoryIcon(category) {
    const iconMap = {
        vivienda: 'house',
        transporte: 'car-front',
        alimentacion: 'cup-straw',
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

// ---- FUNCIONES PARA LA SECCIÓN NOTIFICACIONES ----

// Función para renderizar la sección de notificaciones
function renderNotificationsSection() {
    const container = document.getElementById('notifications-list');
    const emptyState = document.getElementById('empty-notifications');
    
    if (!container || !emptyState) return;
    
    // Obtener filtros
    const typeFilter = document.getElementById('notificationTypeFilter').value;
    const statusFilter = document.getElementById('notificationStatusFilter').value;
    
    // Filtrar notificaciones
    let filteredNotifications = [...notifications];
    
    if (typeFilter !== 'all') {
        filteredNotifications = filteredNotifications.filter(n => n.type === typeFilter);
    }
    
    if (statusFilter !== 'all') {
        const isRead = statusFilter === 'read';
        filteredNotifications = filteredNotifications.filter(n => n.read === isRead);
    }
    
    // Mostrar estado vacío si no hay notificaciones
    if (filteredNotifications.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    // Renderizar notificaciones
    let html = '';
    
    filteredNotifications.forEach(notification => {
        const icon = getNotificationIcon(notification.type);
        const textClass = getNotificationTextClass(notification.type);
        const date = new Date(notification.timestamp);
        const formattedDate = date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        html += `
            <div class="notification-item ${notification.read ? '' : 'unread'}" data-id="${notification.id}">
                <div class="notification-icon ${notification.type}">
                    <i class="bi ${icon}"></i>
                </div>
                <div class="notification-content">
                    <div class="notification-message">${notification.message}</div>
                    <div class="notification-time">${formattedDate}</div>
                </div>
                <div class="notification-actions">
                    <span class="notification-badge ${notification.read ? 'read' : 'unread'}">
                        ${notification.read ? 'Leída' : 'No leída'}
                    </span>
                    ${!notification.read ? 
                        `<button class="btn btn-sm btn-outline-primary mark-as-read" data-id="${notification.id}">
                            <i class="bi bi-check"></i>
                        </button>` : ''
                    }
                    <button class="btn btn-sm btn-outline-danger delete-notification" data-id="${notification.id}">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    
    // Añadir event listeners a los botones
    document.querySelectorAll('.mark-as-read').forEach(button => {
        button.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            markNotificationAsRead(id);
        });
    });
    
    document.querySelectorAll('.delete-notification').forEach(button => {
        button.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            deleteNotification(id);
        });
    });
}

// Función para eliminar una notificación específica
function deleteNotification(id) {
    notifications = notifications.filter(n => n.id !== id);
    saveNotificationsToLocalStorage();
    renderNotificationsSection();
    updateNotificationsUI();
    showNotification('Notificación eliminada', 'success');
}

// ---- FUNCIONES PARA INGRESOS ----

// Función para actualizar el mensaje de tabla vacía en ingresos
function updateIncomeTableMessage() {
    const emptyIncomeMessage = document.getElementById('emptyIncomeMessage');
    const incomeTable = document.getElementById('incomeTable');
    
    if (incomeRecords.length === 0) {
        if (emptyIncomeMessage) {
            emptyIncomeMessage.style.display = '';
        }
    } else {
        if (emptyIncomeMessage) {
            emptyIncomeMessage.style.display = 'none';
        }
    }
}

// ---- ACTUALIZAR TOTAL DE INGRESOS EN SECCIÓN INGRESOS ----
function updateTotalIncome() {
    const totalIncome = incomeRecords.reduce((sum, income) => sum + income.amount, 0);
    const totalIncomeElement = document.getElementById('totalIncomeAmount');
    
    if (totalIncomeElement) {
        totalIncomeElement.textContent = `S/. ${totalIncome.toFixed(2)}`;
    }
}

// ---- AGREGAR INGRESO ----
function addIncome() {
    const methodId = parseInt(document.getElementById('incomePaymentMethod').value);
    const amount = parseFloat(document.getElementById('incomeAmount').value);
    const description = document.getElementById('incomeDescription').value.trim();
    
    if (!methodId) {
        showNotification('Por favor selecciona un medio de pago', 'error');
        return;
    }
    
    if (isNaN(amount) || amount <= 0) {
        showNotification('Por favor ingresa un monto válido', 'error');
        return;
    }
    
    const method = paymentMethods.find(m => m.id === methodId);
    if (!method) {
        showNotification('Error: Medio de pago no encontrado', 'error');
        return;
    }
    
    // Registrar el ingreso
    method.balance += amount;
    
    const incomeRecord = {
        id: Date.now(),
        methodId: methodId,
        methodName: method.name,
        amount: amount,
        description: description || 'Ingreso sin descripción',
        date: new Date().toISOString(),
        formattedDate: formatDateTime(new Date().toISOString()),
        type: 'ingreso'
    };
    
    incomeRecords.push(incomeRecord);
    
    // Guardar cambios
    savePaymentMethodsToLocalStorage();
    saveIncomeRecordsToLocalStorage();
    
    // ACTUALIZAR TODAS LAS INTERFACES
    renderPaymentMethods();
    syncIncomeTables();
    updatePaymentMethodsChart();
    updateTotalBalance();
    updateBalance(); // ACTUALIZAR BALANCE GENERAL
    updateTotalIncome(); // ACTUALIZAR TOTAL INGRESOS EN SECCIÓN INGRESOS
    
    // ACTUALIZAR LOS SELECTS DE MÉTODOS DE PAGO EN TIEMPO REAL
    updateAllPaymentMethodSelects();

    // Actualizar mensaje de tabla vacía
    updateIncomeTableMessage();
    
    // Limpiar formulario
    document.getElementById('incomePaymentMethod').value = '';
    document.getElementById('incomeAmount').value = '';
    document.getElementById('incomeDescription').value = '';
    
    // NOTIFICACIONES
    addNotification(`Ingreso registrado: S/. ${amount.toFixed(2)} en ${method.name}`, 'success');
    showNotification('Ingreso registrado exitosamente', 'success');
}

// ---- RENDERIZAR REGISTROS DE INGRESOS ----
function renderIncomeRecords() {
    const table = document.getElementById('incomeTable');
    if (!table) return;
    
    // Ocultar el mensaje de tabla vacía si hay registros
    updateIncomeTableMessage();
    
    // Limpiar tabla (excepto el mensaje de vacío)
    const rows = table.querySelectorAll('tr:not(#emptyIncomeMessage)');
    rows.forEach(row => row.remove());
    
    if (incomeRecords.length === 0) {
        return;
    }

    const sortedIncome = [...incomeRecords].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    sortedIncome.forEach(income => {
        const paymentMethodClass = getPaymentMethodClass(income.methodName);
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${income.formattedDate}</td>
            <td>
                <div class="payment-method-with-logo-center">
                    ${getPaymentMethodLogo(income.methodName)}
                </div>
            </td>
            <td class="transaction-amount-income text-success">+S/. ${income.amount.toFixed(2)}</td>
            <td>${income.description}</td>
            <td>
                <span class="badge ${income.type === 'ajuste_ingreso' ? 'bg-warning' : 'bg-success'}">
                    ${income.type === 'ajuste_ingreso' ? 'Ajuste' : 'Ingreso'}
                </span>
            </td>
            <td class="text-end">
                <div class="action-buttons">
                    <button class="action-btn edit-btn" onclick="editIncomeRecord(${income.id})" title="Editar">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteIncomeRecord(${income.id})" title="Eliminar">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        `;
        table.appendChild(tr);
    });
}

// ---- ELIMINAR REGISTRO DE INGRESO ----
function deleteIncomeRecord(id) {
    const income = incomeRecords.find(inc => inc.id === id);
    if (!income) return;
    
    if (!confirm(`¿Estás seguro de que deseas eliminar este ingreso?\n${income.description} - S/. ${income.amount.toFixed(2)}`)) {
        return;
    }
    
    // Revertir el ingreso en el método de pago
    const method = paymentMethods.find(m => m.id === income.methodId);
    if (method) {
        method.balance -= income.amount;
    }
    
    // Eliminar el registro
    incomeRecords = incomeRecords.filter(inc => inc.id !== id);
    
    savePaymentMethodsToLocalStorage();
    saveIncomeRecordsToLocalStorage();
    
    renderPaymentMethods();
    renderIncomeRecords();
    updateAllPaymentMethodSelects();
    updatePaymentMethodsChart();
    updateTotalBalance();
    updateBalance();
    
    // Actualizar total de ingresos
    updateTotalIncome();
    
    // Actualizar mensaje de tabla vacía
    updateIncomeTableMessage();
    
    addNotification(`Ingreso eliminado: ${income.description} - S/. ${income.amount.toFixed(2)}`, 'warning');
    showNotification('Ingreso eliminado exitosamente', 'success');
}

// ---- EDITAR REGISTRO DE INGRESO ----
function editIncomeRecord(id) {
    const income = incomeRecords.find(inc => inc.id === id);
    if (!income) return;
    
    const modalBody = `
        <div class="mb-3">
            <label class="form-label">Monto S/.</label>
            <input type="number" class="form-control" id="editIncomeAmount" value="${income.amount.toFixed(2)}" step="0.01">
        </div>
        <div class="mb-3">
            <label class="form-label">Descripción</label>
            <input type="text" class="form-control" id="editIncomeDescription" value="${income.description}">
        </div>
        <div class="mb-3">
            <label class="form-label">Medio de Pago</label>
            <select class="form-select" id="editIncomePaymentMethod">
                ${paymentMethods.map(method => 
                    `<option value="${method.id}" ${method.id === income.methodId ? 'selected' : ''}>
                        ${method.name} (S/. ${method.balance.toFixed(2)})
                    </option>`
                ).join('')}
            </select>
        </div>
    `;
    
    showCustomModal(
        'Editar Registro de Ingreso',
        modalBody,
        'Guardar Cambios',
        'success',
        () => {
            const newAmount = parseFloat(document.getElementById('editIncomeAmount').value);
            const newDescription = document.getElementById('editIncomeDescription').value.trim();
            const newMethodId = parseInt(document.getElementById('editIncomePaymentMethod').value);
            
            if (isNaN(newAmount) || newAmount <= 0) {
                showNotification('Por favor ingresa un monto válido', 'error');
                return false;
            }
            
            if (!newDescription) {
                showNotification('Por favor ingresa una descripción', 'error');
                return false;
            }
            
            const oldMethod = paymentMethods.find(m => m.id === income.methodId);
            const newMethod = paymentMethods.find(m => m.id === newMethodId);
            
            if (!newMethod) {
                showNotification('Error: Medio de pago no encontrado', 'error');
                return false;
            }
            
            // Revertir el ingreso anterior en el método de pago original
            if (oldMethod) {
                oldMethod.balance -= income.amount;
            }
            
            // Aplicar el nuevo ingreso al método de pago seleccionado
            newMethod.balance += newAmount;
            
            // Actualizar el registro de ingreso
            income.amount = newAmount;
            income.description = newDescription;
            income.methodId = newMethodId;
            income.methodName = newMethod.name;
            
            savePaymentMethodsToLocalStorage();
            saveIncomeRecordsToLocalStorage();
            
            renderPaymentMethods();
            renderIncomeRecords();
            updateAllPaymentMethodSelects();
            updatePaymentMethodsChart();
            updateTotalBalance();
            updateBalance();
            
            // Actualizar total de ingresos
            updateTotalIncome();
            
            showNotification('Ingreso actualizado exitosamente', 'success');
            return true;
        }
    );
}

// ---- ACTUALIZAR TODOS LOS SELECTS DE MÉTODOS DE PAGO ----
function updateAllPaymentMethodSelects() {
    // Actualizar todos los selects de métodos de pago en la aplicación
    const selectIds = [
        'paymentMethod',           // Inicio - Agregar transacción
        'incomePaymentMethod',     // Inicio - Agregar ingreso
        'transferFrom',            // Ingresos - Transferencia desde
        'transferTo',              // Ingresos - Transferencia hacia
        'paymentMethodPagos'       // Pagos - Método de pago
    ];
    
    selectIds.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (!select) return;
        
        // Guardar valor seleccionado actual
        const currentValue = select.value;
        
        // Limpiar y reconstruir opciones
        select.innerHTML = selectId === 'paymentMethod' || selectId === 'paymentMethodPagos' ? 
            '<option value="seleccion">Selecciona un metodo...</option>' : 
            '<option value="">Selecciona el medio de pago</option>';
        
        if (paymentMethods.length === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'No hay métodos de pago disponibles';
            option.disabled = true;
            select.appendChild(option);
        } else {
            paymentMethods.forEach(method => {
                const option = document.createElement('option');
                option.value = method.id;
                option.textContent = `${method.name} (S/. ${method.balance.toFixed(2)})`;
                select.appendChild(option);
            });
        }
        
        // Restaurar valor seleccionado si aún existe
        if (currentValue && Array.from(select.options).some(opt => opt.value === currentValue)) {
            select.value = currentValue;
        }
    });
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
        <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="5000">
            <div class="toast-header bg-${typeColors[type]} text-white">
                <i class="bi bi-${typeIcons[type]} me-2"></i>
                <strong class="me-auto">FinLi</strong>
                <small>Ahora</small>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
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
    const imagePreview = document.getElementById('imagePreview');
    
    if (transactionAmount) transactionAmount.value = '';
    if (transactionDescription) transactionDescription.value = '';
    if (transactionDateTime) transactionDateTime.value = '';
    if (paymentMethod) paymentMethod.value = 'seleccion';
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
    const imagePreviewPagos = document.getElementById('imagePreviewPagos');
    
    if (transactionAmountPagos) transactionAmountPagos.value = '';
    if (NamePago) NamePago.value = '';
    if (transactionDateTimePagos) transactionDateTimePagos.value = '';
    if (paymentMethodPagos) paymentMethodPagos.value = 'seleccion';
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
    // Resetear periodo
    currentPeriod = null;
    document.querySelectorAll('#informes .btn-group .btn[data-period]').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Resetear categorías y subcategorías
    selectedCategories = [];
    selectedSubCategories = [];
    
    // Resetear botones de categoría
    document.querySelectorAll('#informes .category-btn, #informes .subcategory-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Ocultar contenedor de subcategorías
    const subcontainer = document.getElementById('informes-subcategories-container');
    if (subcontainer) {
        subcontainer.style.display = 'none';
    }
    
    // Resetear botón de subcategorías
    const showSubcategoriesBtn = document.getElementById('show-subcategories-btn');
    if (showSubcategoriesBtn) {
        showSubcategoriesBtn.innerHTML = '<i class="bi bi-arrow-down"></i> Ver Subcategorías';
    }
    
    // Mostrar todos los gráficos
    updateCharts();
    
    showNotification('Filtros reiniciados', 'info');
}

// Función para mostrar una sección específica
function showSection(sectionName) {
    document.querySelectorAll('.nav-link').forEach(nav => nav.classList.remove('active'));
    document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));
    
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
    document.getElementById(sectionName).classList.add('active');
    
    // Actualizar título y subtítulo
    const sectionData = {
        inicio: {
            title: 'Bienvenido, <span class="text-gradient">Jairo</span>',
            subtitle: 'Panel de control personal'
        },
        ingresos: {
            title: 'Gestión de <span class="text-gradient">Ingresos</span>',
            subtitle: 'Medios de pago y transferencias'
        },
        pagos: {
            title: 'Tu <span class="text-gradient">Agenda</span> de Pagos',
            subtitle: 'Reportes mensuales y semanales'
        },
        informes: {
            title: 'Tus <span class="text-gradient">Finanzas</span> en Detalles',
            subtitle: 'Análisis y reportes financieros'
        },
        notificaciones: {
            title: 'Tus <span class="text-gradient">Notificaciones</span>',
            subtitle: 'Gestiona tus alertas y notificaciones'
        },
        perfil: {
            title: 'Mi <span class="text-gradient">Perfil</span>',
            subtitle: 'Administra tu información personal'
        }
    };
    
    if (sectionData[sectionName]) {
        document.getElementById('main-title').innerHTML = sectionData[sectionName].title;
        document.getElementById('main-subtitle').textContent = sectionData[sectionName].subtitle;
    }
    
    // Si es la sección de ingresos, inicializar la sección
    if (sectionName === 'ingresos') {
        initializeIncomeSection();
    }
    
    // Si es la sección de notificaciones, renderizar las notificaciones
    if (sectionName === 'notificaciones') {
        renderNotificationsSection();
    }
    
    // Si es la sección de pagos, renderizar los pagos programados
    if (sectionName === 'pagos') {
        renderScheduledPayments();
    }
}

// Funciones adicionales para pagos programados
function editScheduledPayment(id) {
    const payment = scheduledPayments.find(p => p.id === id);
    if (!payment) return;
    
    // Implementar lógica de edición similar a editTransaction
    showNotification('Funcionalidad de edición de pagos programados en desarrollo', 'info');
}

function confirmDeleteScheduledPayment(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este pago programado?')) {
        deleteScheduledPayment(id);
    }
}

function deleteScheduledPayment(id) {
    const payment = scheduledPayments.find(p => p.id === id);
    if (!payment) return;
    
    scheduledPayments = scheduledPayments.filter(p => p.id !== id);
    saveScheduledPaymentsToLocalStorage();
    renderScheduledPayments();
    
    showNotification('Pago programado eliminado exitosamente', 'success');
}

// Mostrar modal premium al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    const premiumModal = new bootstrap.Modal(document.getElementById('premiumModal'));
    premiumModal.show();
    
    // Funcionalidad para seleccionar plan
    document.querySelectorAll('.plan-option').forEach(option => {
        option.addEventListener('click', function() {
            // Quitar selección anterior
            document.querySelectorAll('.plan-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Agregar selección actual
            this.classList.add('selected');
        });
    });
    
    // Funcionalidad del botón de suscripción
    document.getElementById('subscribeNowBtn').addEventListener('click', function() {
        const selectedPlan = document.querySelector('.plan-option.selected');
        const planName = selectedPlan.querySelector('.plan-name').textContent;
        const planPrice = selectedPlan.querySelector('.plan-price').textContent;
        
        // Mostrar mensaje de confirmación
        alert(`¡Excelente elección! Has seleccionado el plan ${planName} por ${planPrice}. Serás redirigido al proceso de pago.`);
        
        // Cerrar modal después de suscribirse
        const premiumModal = bootstrap.Modal.getInstance(document.getElementById('premiumModal'));
        premiumModal.hide();
        window.location.replace('pago.html');
    });

    // Funcionalidad del botón de cierre
    document.getElementById('closePremiumBtn').addEventListener('click', function() {
        const premiumModal = bootstrap.Modal.getInstance(document.getElementById('premiumModal'));
        premiumModal.hide();
        
        // Opcional: Mostrar un mensaje o guardar en localStorage que el usuario cerró el modal
        localStorage.setItem('premiumModalClosed', 'true');
    });

    document.getElementById('personalize-categories-btn').addEventListener('click', function() {
        premiumModal.show();
    });

    document.getElementById('personalize-categories-btn-pagos').addEventListener('click', function() {
        premiumModal.show();
    });

    document.getElementById('ajustesBtn').addEventListener('click', function() {
        premiumModal.show();
    });

    // Funcionalidad del botón "Suscribirse" en el perfil
    document.getElementById('openPremiumModalBtn').addEventListener('click', function() {
        premiumModal.show();
    });

});