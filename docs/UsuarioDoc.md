# FinLi - Usuario Documentación

📋 **Descripción**

El Panel de Usuario de FinLi es una aplicación web completa para gestión financiera personal que permite a los usuarios registrar, categorizar y analizar sus transacciones financieras. Incluye funcionalidades de dashboard, reportes visuales y gestión de perfil.

---

## 🗂️ Estructura de Archivos

```text
frontend/
├── public/
│   └── img/
│       └── Logo/
│           └── LogoFinLi.png
└── src/
    └── pages/
        └── Usuario/
            ├── usuario.html
            ├── usuario.css
            └── usuarios.js
```

---

## 🎨 Paleta de Colores

| Color        | Código HEX | Uso                                 |
|--------------|------------|-------------------------------------|
| Verde Oscuro | #0ea46f    | Botones principales, acentos        |
| Gris Oscuro  | #6c757d    | Textos secundarios                  |
| Gris Claro   | #838e98    | Elementos de apoyo                  |
| Verde Claro  | #d7ffe3    | Fondos, efectos hover               |
| Rojo         | #ff6b6b    | Gastos, errores                     |
| Blanco       | #ffffff    | Fondos principales                  |

---

## 🚀 Configuración y Dependencias

```html
<!-- Bootstrap 5.3.2 -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

<!-- Bootstrap Icons 1.10.5 -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet">

<!-- Google Fonts - Poppins -->
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">

<!-- Chart.js -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
```

---

## 📱 Componentes Bootstrap Utilizados

### Diseño de Columnas

| Componente | Clases Utilizadas            | Propósito                       |
|------------|------------------------------|---------------------------------|
| Container  | .container-fluid             | Contenedor fluido               |
| Grid System| .row, .col-lg-*, .col-md-*   | Sistema responsivo              |
| Spacing    | .mb-*, .mt-*, .p-*, .gap-*   | Espaciado utilitario            |

### Navegación y Estructura

| Componente | Clases Utilizadas            | Propósito                       |
|------------|------------------------------|---------------------------------|
| Sidebar    | .sidebar (personalizado)     | Navegación lateral              |
| Topbar     | .topbar (personalizado)      | Cabecera principal              |
| Navigation | .nav-link, .active           | Navegación por secciones        |

### Componentes de UI

| Componente | Clases Utilizadas            | Propósito                       |
|------------|------------------------------|---------------------------------|
| Cards      | .card-stat, .card-report     | Tarjetas personalizadas         |
| Buttons    | .btn, .btn-outline-*         | Botones y variantes             |
| Forms      | .form-control, .form-select  | Controles de formulario         |
| Tables     | .table, .table-responsive    | Tablas de datos                 |
| Modals     | .modal, .modal-dialog        | Ventanas modales                |
| Dropdowns  | .dropdown, .dropdown-menu    | Menús desplegables              |

---

## 🎯 Funcionalidades JavaScript

### Navegación y UI

```javascript
// Gestión de secciones
const sectionData = {
    inicio: { title: 'Bienvenido...', subtitle: 'Panel de control personal' },
    informes: { title: 'Tus Finanzas...', subtitle: 'Análisis y reportes' },
    perfil: { title: 'Mi Perfil...', subtitle: 'Información personal' }
};

// Cambio dinámico de secciones
navLinks.forEach(link => {
    link.addEventListener('click', function() {
        // Actualizar UI y contenido
    });
});
```

### Gestión de Transacciones

```javascript
// Array global para almacenar transacciones
let transactions = [];

// Agregar nueva transacción
document.getElementById('addTransactionBtn').addEventListener('click', function() {
    // Validar y crear transacción
    const transaction = {
        id: transactions.length + 1,
        type: document.getElementById('transactionType').value,
        amount: parseFloat(amount),
        category: selectedCategory,
        // ... más propiedades
    };
    transactions.push(transaction);
    renderTransactions();
});
```

### Gráficos y Visualizaciones

```javascript
// Inicialización de gráficos con Chart.js
function initializeCharts() {
    // Gráfico de barras - Ingresos vs Gastos
    new Chart(incomeExpensesCtx, {
        type: 'bar',
        data: { /* datasets */ },
        options: { /* configuración */ }
    });

    // Gráfico doughnut - Distribución de gastos
    new Chart(expensesCtx, {
        type: 'doughnut',
        data: { /* datasets */ }
    });

    // Gráfico de línea - Evolución de balance
    new Chart(balanceCtx, {
        type: 'line',
        data: { /* datasets */ }
    });
}
```

---

## 🎨 Estilos Personalizados Clave

### Variables CSS

```css
:root {
    --verdeOs: #0ea46f;
    --grisOs: #6c757d;
    --grisCla: #838e98;
    --verdeCla: #d7ffe3;
    --rojo: #ff6b6b;
    --SombrasCards: 0 8px 32px rgba(12, 37, 24, 0.08);
    --SombrasFlotantes: 0 12px 40px rgba(12, 37, 24, 0.12);
}
```

### Layout Principal

```css
.app-shell {
    display: flex;
    min-height: 100vh;
    gap: 1.5rem;
    padding: 1rem;
}

.sidebar {
    width: 270px;
    background: linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%);
    backdrop-filter: blur(16px);
    border-radius: 20px;
    box-shadow: var(--SombrasCards);
}
```

### Efectos Visuales

```css
/* Efectos hover y transiciones */
.card-stat:hover, .card-report:hover {
    transform: translateY(-5px);
    box-shadow: var(--SombrasFlotantes);
}

/* Degradados y superposiciones */
.balance-card {
    background: linear-gradient(135deg, var(--verdeOs), var(--grisOs));
    color: white;
}
```

---

## 📊 Estructura de Datos

### Objeto Transacción

```javascript
{
    id: number,
    type: 'ingreso' | 'gasto',
    amount: number,
    description: string,
    category: string,
    image: string | null,
    dateTime: string,
    formattedDate: string
}
```

### Categorías Disponibles

```javascript
const categories = [
    'comida', 'salud', 'salario', 'entretenimiento',
    'transporte', 'hogar', 'compras', 'educacion'
];
```

---

## 🔧 Funcionalidades Principales

2. **Categorización**
   - 8 categorías predefinidas
   - Botones de selección visual
   - Colores distintivos por categoría

3. **Reportes Visuales**
   - Ingresos vs Gastos: Gráfico de barras comparativo
   - Distribución: Gráfico doughnut por categorías
   - Evolución: Gráfico de línea temporal

4. **Gestión de Perfil**
   - Edición de información personal
   - Cambio de avatar
   - Configuración de notificaciones
   - Opciones de suscripción

---

## 📱 Características Responsive

**Breakpoints**

- Desktop: Layout sidebar + main
- Tablet: Sidebar colapsable
- Mobile: Navegación vertical

**Comportamiento Adaptativo**

```css
@media (max-width: 991px) {
    .sidebar {
        width: 100%;
        height: auto;
    }
    .app-shell {
        flex-direction: column;
    }
}
```

---

## 🎯 Optimizaciones Implementadas

### Performance

- Lazy Loading: Gráficos se inicializan solo cuando son necesarios
- Local Storage: Datos persisten en el navegador
- Efficient Rendering: Actualizaciones incrementales de la UI

### UX/UI

- Feedback Visual: Hover effects y transiciones
- Validación en Tiempo Real: Formularios con validación inmediata
- Navegación Intuitiva: Cambios de sección fluidos

### Accesibilidad

- Controles de Formulario: Labels asociados correctamente
- Navegación por Teclado: Focus states visibles
- Contraste de Colores: Texto legible en todos los fondos

---


## 🚀 Script de Inicialización

```javascript
document.addEventListener('DOMContentLoaded', function() {
    // Configuración inicial
    setCurrentYear();
    initializeNavigation();
    setupEventListeners();
    
    // Inicializar componentes según sección activa
    if (currentSection === 'informes') {
        initializeCharts();
    }
    
    // Renderizar datos existentes
    renderTransactions();
});
```

---

## 📄 Mejoras Futuras Sugeridas

1. **Funcionalidades Avanzadas**
   - Presupuestos mensuales
   - Objetivos de ahorro
   - Recordatorios de pago
   - Análisis predictivo

2. **Experiencia de Usuario**
   - Modo oscuro

---
## 📄 Licencia

© 2025 FinLi. Todos los derechos reservados.

Documentación FinLi - Panel de Usuario

