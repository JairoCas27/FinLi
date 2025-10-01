# FinLi - Nosotros Documentación

📋 **Descripción**

La página "Nosotros" de FinLi presenta la historia, misión, visión y valores de la empresa. Incluye un diseño visual atractivo con elementos flotantes y secciones bien estructuradas que comunican la identidad y propósito de la marca.

---

## 🗂️ Estructura de Archivos

```text
proyecto/
├── nosotros.html
├── CSS/
│   ├── Inicio.css
│   └── nosotros.css
└── img/
    ├── Logo/
    │   ├── LogoFinLi.png
    │   └── LogoFinLi2.png
    └── Contenido/
        └── nosotros.png
```

---

## 🎨 Paleta de Colores y Elementos Visuales

### Colores Utilizados

| Color       | Código HEX | Uso en la Página                 |
|-------------|------------|----------------------------------|
| Verde Claro | #d7ffe3    | Burbujas, fondos                 |
| Verde Oscuro| #0ea46f    | Burbujas, acentos                |
| Amarillo    | #ffd000    | Burbujas, elementos destacados   |
| Plomo       | #f7f7f7    | Burbujas, fondos secundarios     |

### Elementos Visuales Especiales

- Burbujas animadas con símbolos de dinero ($)
- Iconos de Bootstrap para representar valores
- Efectos de sombra y hover en tarjetas
- Diseño responsive con imágenes optimizadas

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

| Componente | Clases Utilizadas           | Propósito                       |
|------------|-----------------------------|---------------------------------|
| Container  | .container                  | Contenedores principales        |
| Grid System| .row, .col-lg-*, .col-md-*  | Sistema de columnas responsivo  |
| Spacing    | .mb-*, .py-3, .gap-*        | Espaciado entre elementos       |
| Alignment  | .align-items-center, .justify-content-center | Alineación vertical y horizontal |

### Navegación

| Componente | Clases Utilizadas            | Propósito                        |
|------------|------------------------------|----------------------------------|
| Navbar     | .navbar, .navbar-expand-lg   | Barra de navegación principal    |
| Nav Items  | .nav-item, .nav-link, .active| Elementos del menú con estado activo |
| Responsive | .navbar-toggler, .collapse   | Menú hamburguesa en móviles      |

### Componentes de Contenido

| Componente | Clases Utilizadas            | Propósito                         |
|------------|------------------------------|-----------------------------------|
| Cards      | .card-shadow (personalizado) | Tarjeta de imagen con sombra      |
| Buttons    | .btn, .btn-custom            | Botón de Iniciar Sesión personalizado |
| Images     | .w-100, .h-100               | Imágenes responsivas              |

### Utilidades Bootstrap

| Categoría  | Clases Utilizadas                  | Propósito                         |
|------------|------------------------------------|-----------------------------------|
| Typography | .fw-semibold, .fs-5, .text-center  | Estilos de texto y alineación     |
| Display    | .d-flex, .d-block                  | Control de visualización          |
| Flexbox    | .justify-content-*, .align-items-* | Layout flexible y centrado        |
| Borders    | .rounded-3                         | Bordes redondeados                |

---

## 🎯 Funcionalidades JavaScript de Bootstrap

### Navegación Responsive

```javascript
// Toggler del navbar 
const navbarToggler = document.querySelector('.navbar-toggler');
const navbarCollapse = document.querySelector('.navbar-collapse');

// Bootstrap maneja automáticamente la funcionalidad
// mediante data-bs-toggle y data-bs-target
```

### Comportamiento de Componentes

- Navbar Toggler: Expande/contrae el menú en dispositivos móviles
- Scroll Suave: Navegación entre secciones (si está implementado)
- Responsive Images: Adaptación automática de imágenes

---

## 🎨 Estilos Personalizados Clave

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

.bubble-small { width: 40px; height: 40px; }
.bubble-medium { width: 60px; height: 60px; }
.bubble-large { width: 80px; height: 80px; }

.bubble-verdeCla { background-color: var(--verdeCla); }
.bubble-verdeOs { background-color: var(--verdeOs); }
.bubble-amarrillo { background-color: var(--amarrillo); }
.bubble-plomo { background-color: var(--plomo); }
```

### Secciones Especializadas

- Historia Hero: Diseño con imagen y texto lado a lado
- Nosotros Hero: Sección de misión con valores en iconos
- Misión Visión: Tarjeta centrada con contenido inspirador

### Efectos Visuales

- Card Shadows: Sombras elegantes para profundidad
- Hover Effects: Transformaciones suaves al interactuar
- Glass Morphism: Efecto vidrio en algunos elementos

---

## 📱 Características Responsive

**Breakpoints Implementados**

- Mobile First: Diseño base para móviles
- Tablet: col-lg-* (≥992px) - Layout de dos columnas
- Desktop: col-lg-* para disposiciones complejas

**Comportamiento Adaptativo**

- Navbar: Colapsa en móviles con menú hamburguesa
- Imágenes: w-100 h-100 para adaptarse al contenedor
- Texto: Tamaños y alineación responsivos
- Grid System: Reorganización automática de columnas

---

## 🔧 Optimizaciones Implementadas

### Performance

- Lazy Loading: loading="lazy" en imágenes
- CDN Resources: Dependencias cargadas desde CDN
- Efficient CSS: Clases utilitarias de Bootstrap

### Accesibilidad

- Alt Texts: Descripciones para imágenes
- ARIA Labels: Atributos para navegación
- Semantic HTML: Estructura semántica adecuada

---

## 🎯 Secciones de Contenido

1. **Nuestra Historia**
   - Imagen del equipo
   - Texto fundacional
   - Diseño de dos columnas

2. **Nuestra Misión**
   - Tres valores principales con iconos
   - Diseño centrado
   - Iconos representativos

3. **Nuestra Visión**
   - Tarjeta destacada
   - Texto inspirador
   - Enfoque en liderazgo regional

---

## 📄 Mejoras Futuras Sugeridas

**Animaciones Mejoradas:**

- Transiciones más suaves entre secciones
- Efectos de aparición al hacer scroll

**Optimizaciones Técnicas:**

- Optimización avanzada de imágenes
- Minificación de CSS personalizado

---

## 📄 Licencia

© 2025 FinLi. Todos los derechos reservados.

Documentación FinLi - Página Nosotros
