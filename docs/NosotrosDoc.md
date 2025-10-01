# FinLi - Nosotros Documentación

📋 **Descripción**

La página "Nosotros" de FinLi presenta la historia, misión, visión y valores de la empresa de manera visualmente atractiva. Utiliza un diseño moderno con efectos de burbujas animadas, secciones con formas curvas y una estética limpia que refleja la identidad de la marca.

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
│           └── nosotros.png
└── src/
    └── pages/
        ├── Inicio/
        │   └── inicio.css
        ├── Nosotros/
        │   ├── nosotros.html
        │   └── nosotros.css
        ├── Servicios/
        │   └── servicios.html
        └── Autenticación/
            └── login.html
```

---

## 🎨 Paleta de Colores

| Color       | Código HEX | Uso en la Página                 |
|-------------|------------|----------------------------------|
| Verde Claro | #d7ffe3    | Burbujas, fondos                 |
| Verde Oscuro| #0ea46f    | Títulos, acentos                 |
| Amarillo    | #ffd000    | Burbujas                         |
| Blanco      | #ffffff    | Fondos principales               |
| Plomo       | #f7f7f7    | Fondos secundarios               |
| Mint        | #d7ffe3    | Gradientes y fondos              |

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

| Componente | Clases Utilizadas           | Propósito                              |
|------------|-----------------------------|----------------------------------------|
| Container  | .container                  | Contenedores principales centrados     |
| Grid System| .row, .col-lg-*            | Sistema de columnas responsivo         |
| Spacing    | .mb-*, .py-*, .p-*         | Espaciado entre elementos              |
| Alignment  | .align-items-center, .justify-content-center | Centrado vertical y horizontal |

### Navegación

| Componente | Clases Utilizadas            | Propósito                        |
|------------|------------------------------|----------------------------------|
| Navbar     | .navbar, .navbar-expand-lg   | Barra de navegación responsive   |
| Nav Items  | .nav-item, .nav-link, .active| Elementos del menú con estado activo |
| Responsive | .navbar-toggler, .collapse   | Menú hamburguesa para móviles    |

### Componentes de Contenido

| Componente | Clases Utilizadas            | Propósito                        |
|------------|------------------------------|----------------------------------|
| Cards      | .card-shadow (personalizado) | Efecto de sombra en imágenes     |
| Buttons    | .btn, .btn-custom            | Botones personalizados           |
| Images     | .w-100, .h-100               | Imágenes responsivas             |

---

## 🎨 Estilos Personalizados Clave

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

### Efectos de Burbujas Animadas

```css
.bubbles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
}

.bubble {
  position: absolute;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  opacity: 0.5;
  animation: float 6s infinite ease-in-out;
}

.bubble-small { width: 40px; height: 40px; font-size: 16px; }
.bubble-medium { width: 60px; height: 60px; font-size: 22px; }
.bubble-large { width: 80px; height: 80px; font-size: 28px; }
```

### Secciones con Formas Curvas

```css
.historia-hero {
  background: linear-gradient(135deg, var(--plomo) 0%, var(--plomo) 100%);
  padding: 4rem 0 3rem;
  border-bottom-left-radius: 60% 20%;
  border-bottom-right-radius: 60% 20%;
  margin-bottom: -5rem;
}

.nosotros-hero {
  background: linear-gradient(135deg, var(--mint) 0%, var(--verdeCla) 100%);
  padding: 8rem 0 3rem;
  border-bottom-left-radius: 60% 15%;
  border-bottom-right-radius: 60% 15%;
}
```

### Tarjeta Circular de Visión

```css
.mision-vision-card {
  width: 420px;
  height: 420px;
  padding: 2rem;
  border-radius: 50%;
  background: var(--blanco);
  box-shadow: 0 15px 35px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: all 0.4s ease;
}

.mision-vision-card:hover {
  transform: scale(1.05);
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
}
```

### Iconos de Valores

```css
.valor-icon {
  background: var(--verdeOs);
  color: white;
  border-radius: 50%;
  padding: 1rem;
  font-size: 1.8rem;
  width: 70px;
  height: 70px;
  margin-bottom: 1.5rem;
}
```

---

## 📱 Características Responsive

**Breakpoints Implementados**

- Mobile First: Diseño base para móviles
- Tablet: col-lg-* (≥992px) - Layout de dos columnas
- Desktop: Diseño completo con todas las secciones

**Comportamiento Adaptativo**

- Navbar: Colapsa en móviles con menú hamburguesa
- Grid System: Reorganización automática de columnas
- Imágenes: Escalado responsivo
- Texto: Tamaños adaptativos

---

## 🎯 Secciones de Contenido

1. **Nuestra Historia**
   - Diseño: Dos columnas (imagen + texto)
   - Imagen: Foto del equipo con efecto de sombra
   - Contenido: Origen y propósito de FinLi
   - Efectos: Formas curvas en los bordes inferiores

2. **Nuestra Misión**
   - Diseño: Sección centrada con fondo gradiente
   - Elementos: Tres valores principales con iconos
   - Iconos: cash-stack, piggy-bank, people
   - Layout: Flexbox responsivo para los valores

3. **Nuestra Visión**
   - Diseño: Tarjeta circular única
   - Efectos: Hover con escala y sombra
   - Posicionamiento: Centrado perfecto
   - Contenido: Texto inspirador sobre el futuro

---

## 🔧 Optimizaciones Implementadas

**Performance**

- Lazy Loading: loading="lazy" en imágenes
- Efficient CSS: Variables y reutilización de estilos
- CDN Resources: Dependencias optimizadas

**UX/UI**

- Hover Effects: Interacciones suaves en todos los elementos
- Visual Hierarchy: Títulos y contenido bien estructurados
- Color Psychology: Paleta que inspira confianza y crecimiento

**Accesibilidad**

- Alt Texts: Descripciones para imágenes
- Semantic HTML: Estructura semántica adecuada
- Color Contrast: Texto legible en todos los fondos

---

## 🎨 Efectos Visuales Especiales

- **Burbujas Flotantes**: 15 burbujas de diferentes tamaños y colores
- Posicionamiento aleatorio en la pantalla
- Símbolos de dinero ($) como contenido
- Efecto de flotación suave

- **Formas Curvas en Secciones**: Bordes inferiores con radio elíptico
- Crean un flujo visual único y mejoran la experiencia de scroll

- **Transiciones y Hovers**: Efectos de escala en tarjetas, sombras dinámicas y transiciones suaves

---

## 📄 Mejoras Futuras Sugeridas

**Animaciones Mejoradas**

- Animación más elaborada para las burbujas
- Efectos de aparición al hacer scroll
- Transiciones entre secciones

---

## 📄 Licencia

© 2025 FinLi. Todos los derechos reservados.

Documentación FinLi - Página Nosotros

