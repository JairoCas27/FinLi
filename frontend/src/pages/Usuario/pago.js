

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
            // Quitar selección anterior
            planOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Agregar selección actual
            this.classList.add('selected');
            
            // Actualizar plan seleccionado
            selectedPlan = this.getAttribute('data-plan');
            
            // Actualizar la visualización
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
            window.location.replace('usuario.html');
        }
    });
}

// Actualizar la visualización según el plan seleccionado
function updatePlanDisplay() {
    const plan = plans[selectedPlan];
    
    // Actualizar resumen
    summaryPlan.textContent = `Plan ${plan.name}`;
    summaryPrice.textContent = `S/. ${plan.price.toFixed(2)}`;
    summaryPeriod.textContent = plan.period;
    
    // Actualizar detalles
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
    
    // Actualizar botón de pago
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

// Procesar el pago
// Procesar el pago
function processPayment() {
  if (!validateForm()) {
    alert("Por favor corrige los errores en el formulario.");
    return;
  }

  const planMap = {
    mensual: 1,
    anual: 2,
    vitalicio: 3
  };

  const idTipoSuscripcion = planMap[selectedPlan];

  const formData = new URLSearchParams();
  formData.append("idUsuario", loggedUser.id);
  formData.append("idTipoSuscripcion", idTipoSuscripcion);

  // Mostrar pantalla de carga
  loadingOverlay.classList.add('active');

  fetch("http://localhost:8080/api/suscripciones/cambiar", {
    method: "PUT",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      console.log("✅ Suscripción actualizada:", data);

      // Actualizar sessionStorage
      loggedUser.tipoSuscripcion = selectedPlan === "vitalicio" ? "De por vida" : selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1);
      loggedUser.estadoSuscripcion = "Activa";
      loggedUser.fechaFinSuscripcion = data.fechaFin || null;
      sessionStorage.setItem("loggedUser", JSON.stringify(loggedUser));

      // Ocultar carga y mostrar éxito
      loadingOverlay.classList.remove('active');
      showSuccessMessage();
    })
    .catch(err => {
      console.error("❌ Error al actualizar suscripción:", err);
      loadingOverlay.classList.remove('active');
      alert("Ocurrió un error al procesar tu suscripción.");
    });
}

// Mostrar mensaje de éxito
function showSuccessMessage() {
    const email = document.getElementById('email').value;
    const plan = plans[selectedPlan];
    
    loadingOverlay.innerHTML = `
        <div class="success-message">
            <div class="success-icon">
                <i class="bi bi-check-lg"></i>
            </div>
            <h3>¡Pago Completado Exitosamente!</h3>
            <p class="text-muted">¡Felicidades ${loggedUser.nombre}! Tu suscripción <strong>${plan.name}</strong> ha sido activada.</p>
            <div class="summary-details mt-3">
                <div class="detail-row">
                    <span>Plan:</span>
                    <span>${plan.name}</span>
                </div>
                <div class="detail-row">
                    <span>Total pagado:</span>
                    <span>S/. ${plan.price.toFixed(2)}</span>
                </div>
                <div class="detail-row">
                    <span>Correo:</span>
                    <span>${email}</span>
                </div>
            </div>
            <p class="mt-3 small text-muted">Hemos enviado un correo de confirmación a ${email} con los detalles de tu suscripción.</p>
            <button class="btn-payment mt-3" id="go-to-dashboard">
                <i class="bi bi-rocket-takeoff"></i> Comenzar a usar FinLi Premium
            </button>
        </div>
    `;
    
    loadingOverlay.classList.add('active');
    
    // Configurar botón de ir al dashboard
    document.getElementById('go-to-dashboard').addEventListener('click', function() {
        alert('¡Redirigiendo al dashboard de FinLi Premium!');
        window.location.replace('premium.html');
    });
}