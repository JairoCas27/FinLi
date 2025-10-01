# FinLi - Servicios Documentación

📋 **Descripción**

La página "Servicios" de FinLi presenta de manera detallada las tres herramientas principales de la plataforma: Gestión de Ingresos y Gastos, Análisis y Reportes Visuales, y Pagos y Presupuestos Inteligentes. Utiliza un diseño limpio con imágenes ilustrativas y descripciones completas de cada funcionalidad.

---

## 🗂️ Estructura de Archivos

```text
frontend/
├── public/
│   └── img/
│       ├── Logo/
│       │   ├── LogoFinLi.png
│       │   └── LogoFinLi2.png
│       └── Contenido/
│           ├── gestion.png
│           ├── reporte.png
│           └── pagos.png
└── src/
    └── pages/
        ├── Inicio/
        │   └── inicio.css
        ├── Servicios/
        │   ├── servicios.html
        │   └── servicios.css
        ├── Nosotros/
        │   └── nosotros.css
        └── Autenticación/
            └── login.html
```

---

## 🎨 Paleta de Colores

| Color        | Código HEX | Uso en la Página                          |
|--------------|------------|-------------------------------------------|
| Verde Claro  | #d7ffe3    | Burbujas, fondos, botones                 |
| Verde Oscuro | #0ea46f    | Burbujas, iconos, acentos                 |
| Amarillo     | #ffee00    | Burbujas, elementos destacados            |
| Blanco       | #ffffff    | Fondos principales                        |
| Plomo        | #f7f7f7    | Burbujas, fondos de tarjetas              |
| Mint         | #d7ffe3    | Fondos alternativos                       |
| Gris Oscuro  | #616263    | Textos, footer                            |

---

## 🚀 Configuración y Dependencias

```html
<!-- Bootstrap 5.3.0 -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

<!-- Bootstrap Icons 1.10.0 -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">

<!-- Google Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&family=Playfair+Display:ital@0;1&display=swap" rel="stylesheet">
```

---

## 📱 Componentes Bootstrap Utilizados

### Diseño de Columnas

| Componente | Clases Utilizadas                | Propósito                                   |
|------------|----------------------------------|---------------------------------------------|
| Container  | .container                       | Contenedores principales centrados          |
| Grid System| .row, .col-lg-*, .mx-auto        | Sistema de columnas responsivo              |
| Spacing    | .mb-*, .py-*, .p-*               | Espaciado consistente                        |
| Alignment  | .align-items-center, .text-center| Centrado vertical y horizontal               |

### Navegación

| Componente | Clases Utilizadas            | Propósito                         |
|------------|------------------------------|-----------------------------------|
| Navbar     | .navbar, .navbar-expand-lg   | Barra de navegación responsive    |
| Nav Items  | .nav-item, .nav-link, .active| Elementos de menú con estado activo |
| Responsive | .navbar-toggler, .collapse   | Menú hamburguesa para móviles     |

### Componentes de Contenido

| Componente  | Clases Utilizadas                | Propósito                                  |
|-------------|----------------------------------|--------------------------------------------|
| Hero Section| .display-4, .fw-bold, .lead      | Encabezado principal destacado              |
| Cards       | .service-card (personalizado)    | Tarjetas de servicios con hover             |
| Images      | .img-fluid                       | Imágenes responsivas                        |
| Buttons     | .btn, .btn-custom, .btn-lg       | Botones de llamada a la acción              |

### Utilidades Bootstrap

| Categoría  | Clases Utilizadas                | Propósito                         |
|------------|----------------------------------|-----------------------------------|
| Typography | .fw-bold, .fst-italic, .lead     | Énfasis en textos                 |
| Flexbox    | .d-flex, .flex-lg-row-reverse    | Layout flexible y alternado       |
| Display    | .d-block, .d-none                | Control de visualización          |
| Borders    | .rounded-3                       | Bordes redondeados                |

---

## 🎯 Funcionalidades JavaScript de Bootstrap

```javascript
// Bootstrap maneja automáticamente mediante data attributes
const navbarToggler = document.querySelector('[data-bs-toggle="collapse"]');
// Funcionalidad incluida en bootstrap.bundle.min.js
```

**Comportamiento de Componentes**

- Navbar Toggler: Expansión/colapso del menú en móviles
- Smooth Scrolling: Navegación por anclas (#gestion, #analisis, #pagos)
- Responsive Layout: Reorganización automática en diferentes breakpoints

---

## 🎨 Estilos Personalizados Clave

### Variables CSS

```css
:root {
    --verdeCla: #d7ffe3;
    --verdeOs: #0ea46f;
    --blanco: #ffffff;
    --amarrillo: #ffee00;
    --plomo: #f7f7f7;
    --mint: #d7ffe3;
    --grisOscuro: #616263;
    --letra: 'Footlight MT Light', sans-serif;
}
```

### Burbujas Animadas

```css
.bubbles {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    overflow: hidden;
}

.bubble {
    position: absolute;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-weight: bold;
    animation: float 6s infinite ease-in-out;
}
```

### Hero Section

```css
.hero-servicios {
    background: linear-gradient(135deg, var(--verdeCla) 0%, var(--plomo) 100%);
    padding: 2rem 0;
    margin-bottom: 2rem;
}
```

### Tarjetas de Servicios

```css
.service-card {
    background: var(--plomo);
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    padding: 2.5rem;
    margin-bottom: 2rem;
    transition: transform 0.3s ease;
    height: 100%;
}

.service-card:hover {
    transform: translateY(-5px);
}

.service-icon {
    font-size: 3rem;
    color: var(--verdeOs);
    margin-bottom: 1.5rem;
}
```

---

## 📱 Características Responsive

**Breakpoints Implementados**

- Mobile First: Diseño base para móviles
- Tablet: col-lg-* (≥992px) - Layout de dos columnas
- Desktop: Diseño alternado con flex-lg-row-reverse

**Comportamiento Adaptativo**

- Navbar: Menú colapsable en dispositivos móviles
- Grid System: Reorganización automática de servicios
- Imágenes: Escalado responsivo con .img-fluid
- Texto: Tamaños adaptativos y legibles

---

## 🎯 Secciones de Contenido

1. **Hero Section**
   - Título principal inspirador
   - Texto descriptivo breve
   - Diseño centrado y limpio

2. **Servicios Detallados**

   - **Gestión de Ingresos y Gastos**
     - Icono: `bi-cash-coin`
     - Funcionalidad: Registro y categorización
     - Beneficio: Control y organización financiera

   - **Análisis y Reportes Visuales**
     - Icono: `bi-bar-chart-line`
     - Funcionalidad: Gráficos y patrones de gasto
     - Beneficio: Toma de decisiones informadas

   - **Pagos y Presupuestos Inteligentes**
     - Icono: `bi-wallet2`
     - Funcionalidad: Alertas y presupuestos
     - Beneficio: Planificación sin estrés

---

## 🔧 Optimizaciones Implementadas

### Performance

- Efficient Loading: Dependencias desde CDN
- Optimized Images: Uso de .img-fluid para responsividad
- CSS Variables: Mantenimiento consistente de estilos

### UX/UI

- Hover Effects: Feedback visual en interacciones
- Consistent Spacing: Espaciado uniforme entre secciones
- Visual Hierarchy: Títulos y contenido bien estructurados

### Navegación

- Anchor Links: Navegación interna por IDs
- Active States: Indicador visual de página actual
- Responsive Menu: Accesibilidad en todos los dispositivos

---

## 📄 Mejoras Futuras Sugeridas

**Interactividad Mejorada:**

- Animaciones de scroll suave


**Accesibilidad:**

- Textos alternativos descriptivos


## 📄 Licencia

© 2025 FinLi. Todos los derechos reservados.

Documentación FinLi - Página Servicios

