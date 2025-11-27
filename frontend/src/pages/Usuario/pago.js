// Datos de planes
const plans = {
    mensual: {
        name: "Mensual",
        price: 3.69,
        period: "Facturado mensualmente",
        discount: 0,
        taxes: 0.66
    },
    anual: {
        name: "Anual",
        price: 18.99,
        period: "Facturado anualmente",
        discount: 25.29,
        taxes: 3.42
    },
    vitalicio: {
        name: "De por vida",
        price: 49.99,
        period: "Pago único",
        discount: 0,
        taxes: 9.00
    }
};

// Elementos del DOM
const paymentForm = document.getElementById('payment-form');
const loadingOverlay = document.getElementById('loading-overlay');
const planOptions = document.querySelectorAll('.plan-option');
const paymentAmount = document.getElementById('payment-amount');
const summaryPlan = document.getElementById('summary-plan');
const summaryPrice = document.getElementById('summary-price');
const summaryPeriod = document.getElementById('summary-period');
const detailPlan = document.getElementById('detail-plan');
const detailPrice = document.getElementById('detail-price');
const detailDiscount = document.getElementById('detail-discount');
const detailTaxes = document.getElementById('detail-taxes');
const detailTotal = document.getElementById('detail-total');
const backLink = document.getElementById('back-link');

// Plan seleccionado actualmente
let selectedPlan = 'anual';

// 🔥 Recuperar usuario logueado
const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));

if (!loggedUser) {
  alert("No estás autenticado. Serás redirigido al login.");
  window.location.href = "/frontend/src/pages/Login/login.html";
}

// Inicializar la página
document.addEventListener('DOMContentLoaded', function() {
    updatePlanDisplay();
    setupEventListeners();
});

// Configurar event listeners
function setupEventListeners() {
    // Cambio de plan
    planOptions.forEach(option => {
        option.addEventListener('click', function() {
            planOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            selectedPlan = this.getAttribute('data-plan');
            updatePlanDisplay();
        });
    });

    // Formatear número de tarjeta
    document.getElementById('cardNumber').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ');
        if (formattedValue) {
            e.target.value = formattedValue;
        }
        validateCardNumber(e.target);
    });

    // Formatear fecha de vencimiento
    document.getElementById('expiryDate').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (value.length >= 2) {
            e.target.value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        validateExpiryDate(e.target);
    });

    // Solo números para CVV
    document.getElementById('cvv').addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/[^0-9]/gi, '');
        validateCVV(e.target);
    });

    // Validación en tiempo real para otros campos
    document.getElementById('cardholder').addEventListener('blur', function() {
        validateRequiredField(this);
    });

    document.getElementById('email').addEventListener('blur', function() {
        validateEmail(this);
    });

    // Envío del formulario
    paymentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        processPayment();
    });

    // Enlace de volver
    backLink.addEventListener('click', function(e) {
        e.preventDefault();
        if (confirm('¿Estás seguro de que quieres volver? Se perderá la información ingresada.')) {
            window.history.back();
        }
    });
}

// Actualizar la visualización según el plan seleccionado
function updatePlanDisplay() {
    const plan = plans[selectedPlan];
    
    summaryPlan.textContent = `Plan ${plan.name}`;
    summaryPrice.textContent = `S/. ${plan.price.toFixed(2)}`;
    summaryPeriod.textContent = plan.period;
    
    detailPlan.textContent = `Plan ${plan.name}`;
    detailPrice.textContent = `S/. ${plan.price.toFixed(2)}`;
    
    if (plan.discount > 0) {
        detailDiscount.textContent = `-S/. ${plan.discount.toFixed(2)}`;
        detailDiscount.parentElement.style.display = 'flex';
    } else {
        detailDiscount.parentElement.style.display = 'none';
    }
    
    detailTaxes.textContent = `S/. ${plan.taxes.toFixed(2)}`;
    detailTotal.textContent = `S/. ${plan.price.toFixed(2)}`;
    
    paymentAmount.textContent = `S/. ${plan.price.toFixed(2)}`;
}

// Validaciones
function validateRequiredField(field) {
    if (field.value.trim() === '') {
        field.classList.add('is-invalid');
        return false;
    } else {
        field.classList.remove('is-invalid');
        return true;
    }
}

function validateEmail(field) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(field.value.trim())) {
        field.classList.add('is-invalid');
        return false;
    } else {
        field.classList.remove('is-invalid');
        return true;
    }
}

function validateCardNumber(field) {
    const cardNumber = field.value.replace(/\s/g, '');
    if (cardNumber.length !== 16 || isNaN(cardNumber)) {
        field.classList.add('is-invalid');
        return false;
    } else {
        field.classList.remove('is-invalid');
        return true;
    }
}

function validateExpiryDate(field) {
    const value = field.value;
    const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    
    if (!regex.test(value)) {
        field.classList.add('is-invalid');
        return false;
    }
    
    const [month, year] = value.split('/');
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;
    
    if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        field.classList.add('is-invalid');
        return false;
    }
    
    field.classList.remove('is-invalid');
    return true;
}

function validateCVV(field) {
    if (field.value.length !== 3 || isNaN(field.value)) {
        field.classList.add('is-invalid');
        return false;
    } else {
        field.classList.remove('is-invalid');
        return true;
    }
}

// Validar todo el formulario
function validateForm() {
    const cardholder = document.getElementById('cardholder');
    const cardNumber = document.getElementById('cardNumber');
    const expiryDate = document.getElementById('expiryDate');
    const cvv = document.getElementById('cvv');
    const email = document.getElementById('email');
    
    const validations = [
        validateRequiredField(cardholder),
        validateCardNumber(cardNumber),
        validateExpiryDate(expiryDate),
        validateCVV(cvv),
        validateEmail(email)
    ];
    
    return validations.every(validation => validation === true);
}

// Procesar el pago - VERSIÓN QUE REDIRIGE A exitoPago.html
function processPayment() {
    if (!validateForm()) {
        alert("Por favor corrige los errores en el formulario.");
        return;
    }

    const emailInput = document.getElementById("email").value;
    const cardNumberInput = document.getElementById("cardNumber").value.replace(/\s/g, "");

    const planName = selectedPlan === "mensual" ? "Mensual" :
                    selectedPlan === "anual" ? "Anual" : "De por vida";

    console.log("📦 Iniciando proceso de pago para plan:", planName);

    // Mostrar overlay de carga
    showLoadingOverlay();

    // SIMULAR PROCESO DE PAGO CON TIEMPO DE ESPERA
    setTimeout(() => {
        // 1. Actualizar el estado del usuario inmediatamente
        updateUserSubscriptionStatus();

        // 2. Guardar datos del pago en sessionStorage para la página de éxito
        const pagoData = {
            planName: planName,
            price: plans[selectedPlan].price.toFixed(2),
            email: emailInput,
            userName: loggedUser.nombre
        };
        
        sessionStorage.setItem('pagoExitoso', JSON.stringify(pagoData));

        // 3. Ejecutar proceso en segundo plano (no bloquea la redirección)
        executeBackgroundProcess(planName, emailInput, cardNumberInput);

        // 4. Redirigir a la página de éxito
        window.location.href = 'exitoPago.html';

    }, 3000); // 3 segundos de espera
}

// Función para ejecutar proceso en segundo plano SIN bloquear la redirección
function executeBackgroundProcess(planName, emailInput, cardNumberInput) {
    console.log("🔄 Ejecutando proceso en segundo plano...");
    
    // Intentar las llamadas API sin afectar la experiencia del usuario
    Promise.all([
        updateSubscriptionAPI(planName),
        sendPaymentConfirmationAPI(planName, emailInput, cardNumberInput)
    ]).then(results => {
        console.log("✅ Procesos en segundo plano completados:", results);
    }).catch(error => {
        console.error("❌ Error en procesos en segundo plano:", error);
        // No mostramos error al usuario ya que la redirección ya ocurrió
    });
}

// Función para actualizar suscripción en API
function updateSubscriptionAPI(planName) {
    return fetch("http://localhost:8080/api/suscripciones/cambiar", {
        method: "PUT",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            idUsuario: loggedUser.id,
            idTipoSuscripcion: selectedPlan === "mensual" ? 1 : selectedPlan === "anual" ? 2 : 3
        })
    })
    .then(res => {
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        return res.json();
    })
    .then(data => {
        console.log("✅ Suscripción actualizada en API:", data);
        return data;
    });
}

// Función para enviar confirmación de pago
function sendPaymentConfirmationAPI(planName, emailInput, cardNumberInput) {
    return fetch("http://localhost:8080/api/pagos/confirmar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            idUsuario: loggedUser.id,
            correoUsuario: loggedUser.correo,
            nombreTipoSuscripcion: planName,
            cardNumber: cardNumberInput,
            email: emailInput
        })
    })
    .then(res => {
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        return res.text();
    })
    .then(data => {
        console.log("✅ Confirmación de pago enviada:", data);
        return data;
    });
}

// Mostrar overlay de carga
function showLoadingOverlay() {
    loadingOverlay.innerHTML = `
        <div class="spinner"></div>
        <h3>Procesando tu pago</h3>
        <p>Esto puede tomar unos segundos...</p>
    `;
    loadingOverlay.classList.add('active');
}

// Actualizar el estado de suscripción del usuario en sessionStorage
function updateUserSubscriptionStatus() {
    const planName = selectedPlan === "mensual" ? "Mensual" :
                    selectedPlan === "anual" ? "Anual" : "De por vida";
    
    if (loggedUser) {
        loggedUser.tipoSuscripcion = planName;
        loggedUser.estadoSuscripcion = "Activa";
        
        // Calcular fecha de fin según el plan
        const today = new Date();
        let endDate = new Date();
        
        if (selectedPlan === "mensual") {
            endDate.setMonth(today.getMonth() + 1);
        } else if (selectedPlan === "anual") {
            endDate.setFullYear(today.getFullYear() + 1);
        } else { // vitalicio
            endDate.setFullYear(today.getFullYear() + 50); // 50 años como "vitalicio"
        }
        
        loggedUser.fechaFinSuscripcion = endDate.toISOString().split('T')[0];
        sessionStorage.setItem("loggedUser", JSON.stringify(loggedUser));
        
        console.log("✅ Usuario actualizado en sessionStorage:", loggedUser);
    }
}

// Ocultar overlay
function hideOverlay() {
    loadingOverlay.classList.remove('active');
}