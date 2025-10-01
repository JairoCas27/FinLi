# FinLi - Inicio Documentación

📋 **Descripción del Proyecto**

FinLi es una aplicación web de gestión financiera personal diseñada para ayudar a los usuarios a tomar el control de sus finanzas de manera sencilla e intuitiva. La página de inicio presenta información sobre los servicios, testimonios de usuarios y opciones de contacto.

---

## 🗂️ Estructura de Archivos

```text
frontend/
├── public/
│   └── img/
│       ├── Logo/
│       │   ├── LogoFinLi.png
│       │   └── LogoFinLi2.png
│       ├── Contenido/
│       │   ├── principal_01.png
│       │   ├── principal_02.png
│       │   ├── principal_03.png
│       │   ├── gestion.png
│       │   ├── reporte.png
│       │   └── pagos.png
│       └── Usuarios/
│           ├── Usuario1.png
│           ├── Usuario2.png
│           ├── Usuario3.png
│           ├── Usuario4.png
│           ├── Usuario5.png
│           └── Usuario6.png
└── src/
    └── pages/
        ├── Inicio/
        │   ├── inicio.html
        │   └── inicio.css
        ├── Nosotros/
        │   └── nosotros.html
        ├── Servicios/
        │   └── servicios.html
        └── Autenticación/
            └── login.html
```

---

## 🎨 Paleta de Colores

| Color       | Código HEX | Uso                                  |
|-------------|------------|---------------------------------------|
| Verde Claro | #d7ffe3    | Fondo principal, botones              |
| Verde Oscuro| #0ea46f    | Hover efectos, elementos destacados   |
| Blanco      | #ffffff    | Fondos, texto                         |
| Amarillo    | #ffd000    | Estrellas de calificación             |
| Plomo       | #f7f7f7    | Fondos secundarios                    |
| Mint        | #d7ffe3    | Fondos alternativos                   |

---

## 🚀 Dependencias

```html
<!-- Bootstrap CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- Bootstrap Icons -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">

<!-- Google Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&family=Playfair+Display:ital@0;1&display=swap" rel="stylesheet">

<!-- Bootstrap JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
```

---

## 📱 Componentes Bootstrap Utilizados

### Diseño de Columnas

| Componente | Clases Utilizadas                        | Propósito                         |
|------------|------------------------------------------|-----------------------------------|
| Container  | .container, .container-fluid             | Contenedores principales          |
| Grid System| .row, .col-md-*, .offset-md-*            | Sistema de columnas responsivo    |
| Spacing    | .p-*, .m-*, .gap-*                       | Espaciado entre elementos         |

### Navegación

| Componente | Clases Utilizadas            | Propósito                        |
|------------|------------------------------|----------------------------------|
| Navbar     | .navbar, .navbar-expand-lg   | Barra de navegación principal    |
| Nav Items  | .nav-item, .nav-link, .active| Elementos del menú               |
| Responsive | .navbar-toggler, .collapse   | Menú responsive                  |

### Componentes de Contenido

| Componente | Clases Utilizadas                        | Propósito                          |
|------------|------------------------------------------|------------------------------------|
| Cards      | .card, .card-body, .card-title           | Tarjetas de servicios              |
| Buttons    | .btn, .btn-custom (personalizado)        | Botones de acción                  |
| Carousel   | .carousel, .carousel-item, .carousel-control-* | Carruseles de imágenes y testimonios |
| Forms      | .form-control, .form-label, .mb-3        | Formulario de contacto             |

### Utilidades

| Categoría  | Clases Utilizadas                 | Propósito                         |
|------------|-----------------------------------|-----------------------------------|
| Typography | .fw-*, .fs-*, .text-*             | Estilos de texto                  |
| Display    | .d-*, .display-*                  | Control de visualización          |
| Flexbox    | .d-flex, .justify-content-*, .align-items-* | Layout flexible           |
| Borders    | .border-0, .rounded-*             | Control de bordes                 |

---

## 🎯 Funcionalidades JavaScript de Bootstrap

### Carruseles

```javascript
// Hero Carusel
const heroCarousel = new bootstrap.Carousel('#heroCarousel', {
  ride: 'carousel',
  interval: 5000
});

// Testimoniales Carrusel
const testimonialCarousel = new bootstrap.Carousel('#testimonialCarousel', {
  ride: 'carousel'
});
```

### Navegación Responsive

```javascript
// Navbar Toggler
const navbarToggler = document.querySelector('.navbar-toggler');
const navbarCollapse = document.querySelector('.navbar-collapse');

navbarToggler.addEventListener('click', function() {
  navbarCollapse.classList.toggle('show');
});
```

---

## 🎨 Estilos Personalizados 

### Variables CSS

```css
:root {
  --verdeCla: #d7ffe3;
  --verdeOs: #0ea46f;
  --blanco: #ffffff;
  --amarrillo: #ffd000;
  --plomo: #f7f7f7;
  --mint: #d7ffe3;
  --letra: 'Footlight MT Light', sans-serif;
}
```

### Efectos Visuales

- Hover Effects: Transformaciones y transiciones suaves
- Card Shadows: Sombras elegantes para profundidad
- Glass Morphism: Efecto vidrio con backdrop-filter
- Gradient Overlays: Mejora de contraste en imágenes

---

## 📱 Características Responsive

**Breakpoints Utilizados**

- Mobile First: Diseño base para móviles
- Tablet: col-md-* (≥768px)
- Desktop: col-lg-* (≥992px)

**Comportamiento Responsive**

- Navbar: Colapsa en móviles
- Grid System: Se adapta automáticamente
- Images: object-fit: cover para mantener proporciones
- Text: Tamaños de fuente responsivos

---

## 🔧 Scripts y Dependencias

**Dependencias Externas**

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

## 🎯 Mejoras Futuras Sugeridas

**Accesibilidad:**

- Añadir aria-labels descriptivos

**Performance:**

- Optimizar imágenes
- Minificar CSS y JS

**Funcionalidad:**

- Validación de formularios

---

## 📄 Licencia

© 2025 FinLi. Todos los derechos reservados.
