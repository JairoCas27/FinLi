# FinLi - Sistema de Autenticación Documentación

📋 **Descripción**

El sistema de autenticación de FinLi incluye páginas de Inicio de Sesión y Registro con un diseño moderno y atractivo. Presenta efectos visuales avanzados, formularios intuitivos y una experiencia de usuario fluida.

---

## 🗂️ Estructura de Archivos

```text
frontend/
├── public/
│   └── img/
│       └── Logo/
│           ├── LogoFinLi.png
│           └── LogoFinLi2.png
└── src/
    └── pages/   
        └── Autenticación/
            ├── login.html
            ├── registro.html
            └── login.css

```

---

## 🎨 Paleta de Colores

| Color       | Código HEX | Uso                               |
|-------------|------------|-----------------------------------|
| Verde Claro | #d7ffe3    | Fondos, efectos                   |
| Verde Oscuro| #0ea46f    | Botones, acentos                  |
| Blanco      | #ffffff    | Fondos, textos                    |
| Amarillo    | #ffee00    | Acentos                           |
| Plomo       | #f7f7f7    | Fondos secundarios                |
| Mint        | #d7ffe3    | Gradientes                        |

---

## 🚀 Configuración y Dependencias

```html
<!-- Bootstrap 5.3.0 -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- Bootstrap Icons 1.10.0 -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">

<!-- Google Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
```

---

## 📱 Componentes Bootstrap Utilizados

### Diseño de Columnas

| Componente | Clases Utilizadas         | Propósito                         |
|------------|---------------------------|-----------------------------------|
| Container  | .container                | Contenedores principales          |
| Grid System| .row, .col-md-*, .col-lg-*| Sistema responsivo                |
| Spacing    | .mb-*, .mt-*, .p-*        | Utilidades de espaciado           |

### Navegación

| Componente | Clases Utilizadas            | Propósito                        |
|------------|------------------------------|----------------------------------|
| Navbar     | .navbar, .navbar-expand-lg   | Barra de navegación responsive   |
| Nav Items  | .nav-item, .nav-link         | Elementos del menú               |
| Responsive | .navbar-toggler, .collapse   | Menú hamburguesa                 |

### Componentes de UI

| Componente | Clases Utilizadas       | Propósito                        |
|------------|-------------------------|----------------------------------|
| Cards      | .card, .card-shadow     | Formularios en tarjetas          |
| Forms      | .form-control, .form-label | Controles de formulario      |
| Buttons    | .btn, .btn-custom       | Botones personalizados           |
| Checkbox   | .form-check, .form-check-input | Checkbox de términos     |

### Utilidades Bootstrap

| Categoría | Clases Utilizadas      | Propósito                         |
|-----------|------------------------|-----------------------------------|
| Flexbox   | .d-flex, .justify-content-* | Layout flexible              |
| Display   | .d-none, .d-block      | Control de visualización          |
| Text      | .text-center, .fw-semibold | Estilos de texto              |
| Spacing   | .py-3, .gap-2          | Espaciado consistente             |

---

## 🎨 Estilos Personalizados 

### Variables CSS

```css
:root {
    --mint: #d7ffe3;
    --verdeCla: #d7ffe3;
    --verdeOs: #0ea46f;
    --blanco: #ffff;
    --amarrillo: #ffee00;
    --plomo: #f7f7f7;
    font-size: 19px;
}
```

### Fondo Animado 

```css
.animated-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    background: linear-gradient(-45deg, #d7ffe3, #a8ffd1, #8dffc4, #0ea46f);
    background-size: 400% 400%;
    animation: gradient 15s ease infinite;
}

@keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}
```

### Efectos de Formas Flotantes

```css
.shape {
    position: absolute;
    border-radius: 50%;
    opacity: 0.15;
    animation: float 20s infinite ease-in-out;
    filter: blur(2px);
}

@keyframes float {
    0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
    25% { transform: translate(30px, 25px) rotate(10deg) scale(1.1); }
    50% { transform: translate(15px, 40px) rotate(-10deg) scale(0.9); }
    75% { transform: translate(-20px, 25px) rotate(8deg) scale(1.05); }
}
```

### Sistema de Partículas

```css
.particles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
}

.particle {
    position: absolute;
    background-color: rgba(255, 255, 255, 0.6);
    border-radius: 50%;
    animation: particle-float 15s infinite linear;
}

@keyframes particle-float {
    0% {
        transform: translateY(100vh) rotate(0deg) scale(0.5);
        opacity: 0;
    }
    100% {
        transform: translateY(-100px) rotate(720deg) scale(1.2);
        opacity: 0;
    }
}
```

### Efectos de Ondas

```css
.waves {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 15vh;
}

.wave {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 200%;
    height: 100%;
    background: url("data:image/svg+xml,...") repeat-x;
    background-size: 1200px 100%;
    animation: wave 18s linear infinite;
    opacity: 0.3;
}

@keyframes wave {
    0% { transform: translateX(0); }
    50% { transform: translateX(-25%); }
    100% { transform: translateX(-50%); }
}
```

---

## 📱 Características Responsive

**Breakpoints**

- Desktop: Layout completo con todos los efectos
- Tablet: Efectos optimizados para rendimiento
- Mobile: Navegación colapsable, formularios adaptados

**Comportamiento Adaptativo**

```css
@media (max-width: 768px) {
    .form-section {
        padding: 2rem 0;
    }
    .register-card {
        padding: 1.5rem;
    }
}
```

---

## 🎯 Funcionalidades de las Páginas

### Página de Inicio de Sesión

- Formulario simple: Email y contraseña
- Enlace de recuperación: "¿Olvidaste tu contraseña?"
- Redirección a registro: Para nuevos usuarios
- Validación visual: Estados de focus y hover

### Página de Registro

- Formulario completo: Nombres, apellidos, email, contraseña y confirmación
- Términos y condiciones: Checkbox obligatorio
- Validación de contraseña: Campo de confirmación
- Redirección a login: Para usuarios existentes

---

## 🔧 Optimizaciones Implementadas

### Performance

- Efectos CSS: Animaciones nativas sin JavaScript
- SVG en línea: Ondas sin requests externos
- Gradientes CSS: Sin imágenes pesadas
- Responsive Design: Optimizado para todos los dispositivos

### UX/UI

- Feedback Visual: Estados hover y focus en todos los elementos
- Transiciones Suaves: Animaciones de 0.3s en interacciones
- Jerarquía Visual: Contenido bien estructurado y legible
- Accesibilidad: Labels asociados correctamente

### Efectos Visuales

- Fondo Dinámico: Gradiente animado continuo
- Formas Flotantes: 6 formas con animaciones desfasadas
- Partículas: Efecto de burbujas ascendentes
- Ondas: Múltiples capas de ondas en la parte inferior
- Luces: Efectos de spotlight difuminados

---

## 🎨 Diseño de Formularios

### Estructura Común

```html
<section class="form-section">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8 col-lg-6">
                <div class="card card-shadow register-card">
                    <!-- Logo y título -->
                    <!-- Formulario -->
                    <!-- Enlaces de redirección -->
                </div>
            </div>
        </div>
    </div>
</section>
```

### Elementos de Formulario

- Labels claros: Descripciones específicas para cada campo
- Placeholders informativos: Ejemplos de formato esperado
- Validación visual: Bordes y sombras al focus
- Botones destacados: Color corporativo y buen contraste

---

## 📄 Licencia

© 2025 FinLi. Todos los derechos reservados.

Documentación FinLi - Sistema de Autenticación

