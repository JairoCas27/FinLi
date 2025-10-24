// ---- VARIABLES GLOBALES ----
let transactions = []; // Array para almacenar todas las transacciones
let selectedCategory = null; // Categoría seleccionada actualmente
let selectedImage = null; // Imagen seleccionada para la transacción
let userAvatar = null; // Avatar del usuario
let editingTransactionId = null; // ID de la transacción en edición

// ---- SISTEMA DE NAVEGACIÓN ----
// Gestión de cambios entre secciones de la aplicación


// Elementos de navegación
const navLinks = document.querySelectorAll('.nav-link'); // Enlaces del menú lateral
const contentSections = document.querySelectorAll('.content-section'); // Secciones de contenido
const mainTitle = document.getElementById('main-title'); // Título principal dinámico
const mainSubtitle = document.getElementById('main-subtitle'); // Subtítulo principal dinámico
const searchInput = document.getElementById('search-input'); // Campo de búsqueda
const floatingAddBtn = document.getElementById('floatingAddBtn'); // Botón flotante para agregar

// Datos de configuración para cada sección
const sectionData = {
    inicio: {
        title: 'Bienvenido, <span class="text-gradient">Jairo</span>', // Título con estilo gradiente
        subtitle: 'Panel de control personal', // Descripción de la sección
        placeholder: 'Buscar transacciones...' // Texto placeholder para búsqueda
    },
    informes: {
        title: 'Tus <span class="text-gradient">Finanzas</span> en Detalles',
        subtitle: 'Análisis y reportes financieros',
        placeholder: 'Buscar reportes...'
    },
    perfil: {
        title: 'Mi <span class="text-gradient">Perfil</span>',
        subtitle: 'Administra tu información personal',
        placeholder: 'Buscar en configuración...'
    }
};

// ---- INICIALIZACIÓN DE NAVEGACIÓN ----
// Configuración de eventos para cambiar entre secciones

// Inicializar navegación
navLinks.forEach(link => {
    link.addEventListener('click', function() {
        const targetSection = this.getAttribute('data-section'); // Sección objetivo del click
        
        // Actualizar estados activos
        navLinks.forEach(nav => nav.classList.remove('active')); // Remover activo de todos
        this.classList.add('active'); // Marcar enlace actual como activo
        
        // Mostrar/ocultar secciones
        contentSections.forEach(section => {
            section.classList.remove('active'); // Ocultar todas las secciones
            if (section.id === targetSection) {
                section.classList.add('active'); // Mostrar solo la sección objetivo
            }
        });
        
        // Actualizar títulos y placeholder según la sección
        if (sectionData[targetSection]) {
            mainTitle.innerHTML = sectionData[targetSection].title; // Actualizar título
            mainSubtitle.textContent = sectionData[targetSection].subtitle; // Actualizar subtítulo
            searchInput.placeholder = sectionData[targetSection].placeholder; // Actualizar placeholder
        }

        // Inicializar gráficos si se muestra la sección de informes
        if (targetSection === 'informes') {
            initializeCharts(); // Llamar función para crear gráficos
        }
    });
});

// ---- FUNCIONALIDAD DEL BOTÓN FLOTANTE ----
// Navegación rápida para agregar transacciones

// Funcionalidad del botón flotante
floatingAddBtn.addEventListener('click', function() {
    // Navegar a la sección de inicio
    document.querySelectorAll('.nav-link').forEach(nav => nav.classList.remove('active')); // Remover activos
    document.querySelector('[data-section="inicio"]').classList.add('active'); // Activar inicio
    
    // Mostrar sección de inicio
    document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active')); // Ocultar todas
    document.getElementById('inicio').classList.add('active'); // Mostrar inicio
    
    // Actualizar títulos
    mainTitle.innerHTML = sectionData.inicio.title; // Título de inicio
    mainSubtitle.textContent = sectionData.inicio.subtitle; // Subtítulo de inicio
    searchInput.placeholder = sectionData.inicio.placeholder; // Placeholder de inicio
    
    // Scroll al formulario de transacción
    document.querySelector('.card-stat').scrollIntoView({ behavior: 'smooth' }); // Desplazamiento suave
});

// ---- INICIALIZACIÓN DE GRÁFICOS ----
// Configuración de gráficos para la sección de informes

// Inicializar gráficos
function initializeCharts() {
    // Gráfico de Ingresos vs Gastos
    const incomeExpensesCtx = document.getElementById('incomeExpensesChart').getContext('2d'); // Contexto del canvas
    new Chart(incomeExpensesCtx, {
        type: 'bar', // Tipo de gráfico de barras
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep'], // Etiquetas de meses
            datasets: [
                {
                    label: 'Ingresos', // Leyenda para ingresos
                    data: [], // Datos vacíos por ahora
                    backgroundColor: '#0ea46f' // Color verde para ingresos
                },
                {
                    label: 'Gastos', // Leyenda para gastos
                    data: [], // Datos vacíos por ahora
                    backgroundColor: '#ff6b6b' // Color rojo para gastos
                }
            ]
        },
        options: {
            responsive: true, // Gráfico responsive
            maintainAspectRatio: false, // No mantener relación de aspecto
            scales: {
                y: {
                    beginAtZero: true, // Eje Y comienza en cero
                    grid: {
                        color: 'rgba(0,0,0,0.05)' // Color de grid sutil
                    }
                },
                x: {
                    grid: {
                        display: false // Ocultar grid del eje X
                    }
                }
            }
        }
    });

    // Gráfico de Doughnut para Gastos
    const expensesCtx = document.getElementById('expensesChart').getContext('2d'); // Contexto del canvas
    new Chart(expensesCtx, {
        type: 'doughnut', // Tipo de gráfico doughnut
        data: {
            labels: ['Comida', 'Transporte', 'Entretenimiento', 'Salud', 'Compras', 'Otros'], // Categorías
            datasets: [{
                data: [], // Datos vacíos por ahora
                backgroundColor: [ // Paleta de colores para categorías
                    '#0ea46f',
                    '#06a3ff',
                    '#8e44ad',
                    '#ff6b6b',
                    '#f39c12',
                    '#95a5a6'
                ],
                borderWidth: 0 // Sin borde
            }]
        },
        options: {
            responsive: true, // Gráfico responsive
            maintainAspectRatio: false, // No mantener relación de aspecto
            plugins: {
                legend: {
                    position: 'right' // Leyenda a la derecha
                }
            }
        }
    });

    // Gráfico de Línea para Balance
    const balanceCtx = document.getElementById('balanceChart').getContext('2d'); // Contexto del canvas
    new Chart(balanceCtx, {
        type: 'line', // Tipo de gráfico de línea
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep'], // Etiquetas de meses
            datasets: [{
                label: 'Balance', // Leyenda del gráfico
                data: [], // Datos vacíos por ahora
                borderColor: '#0ea46f', // Color de línea verde
                backgroundColor: 'rgba(14, 164, 111, 0.1)', // Fondo semi-transparente
                borderWidth: 3, // Grosor de línea
                fill: true, // Rellenar área bajo la línea
                tension: 0.4 // Suavizado de curva
            }]
        },
        options: {
            responsive: true, // Gráfico responsive
            maintainAspectRatio: false, // No mantener relación de aspecto
            plugins: {
                legend: {
                    display: false // Ocultar leyenda
                }
            },
            scales: {
                y: {
                    beginAtZero: true, // Eje Y comienza en cero
                    grid: {
                        color: 'rgba(0,0,0,0.05)' // Color de grid sutil
                    }
                },
                x: {
                    grid: {
                        display: false // Ocultar grid del eje X
                    }
                }
            }
        }
    });
}

// ---- CONFIGURACIÓN GENERAL ----
// Elementos de utilidad general

// Establecer año actual
document.getElementById('year').textContent = new Date().getFullYear(); // Año en el footer

// Agregar efectos hover a las tarjetas
document.querySelectorAll('.card-stat, .chart-card, .table-card, .card-report').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)'; // Elevar tarjeta al pasar mouse
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)'; // Volver a posición original
    });
});

// ---- SELECCIÓN DE CATEGORÍAS ----
// Gestión de botones de categorías para transacciones

// Selección de categorías - NUEVO: Botones de categorías
document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // Si es el botón de personalizar, no hacer nada
        if (this.id === 'personalize-categories-btn') {
            alert('Función de personalizar categorías'); // Mensaje temporal
            return;
        }
        
        // Quitar la clase active de todos los botones
        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        
        // Añadir la clase active al botón clickeado
        this.classList.add('active');
        selectedCategory = this.getAttribute('data-category'); // Guardar categoría seleccionada
    });
});

// ---- CARGA Y PREVISUALIZACIÓN DE IMÁGENES ----
// Gestión de imágenes para transacciones y avatar

// Carga y previsualización de imagen de transacción
document.getElementById('imageInput').addEventListener('change', function(e) {
    const file = e.target.files[0]; // Archivo seleccionado
    if (file) {
        const reader = new FileReader(); // Lector de archivos
        reader.onload = function(event) {
            selectedImage = event.target.result; // Guardar imagen en base64
            const preview = document.getElementById('imagePreview'); // Contenedor de previsualización
            preview.innerHTML = ''; // Limpiar previsualización anterior
            const img = document.createElement('img'); // Crear elemento imagen
            img.src = selectedImage; // Establecer fuente
            preview.appendChild(img); // Agregar al contenedor
        };
        reader.readAsDataURL(file); // Leer archivo como Data URL
    }
});

// Carga y previsualización de avatar de usuario
document.getElementById('avatarInput').addEventListener('change', function(e) {
    const file = e.target.files[0]; // Archivo seleccionado
    if (file) {
        const reader = new FileReader(); // Lector de archivos
        reader.onload = function(event) {
            userAvatar = event.target.result; // Guardar avatar en base64
            
            // Actualizar todas las previsualizaciones de avatar
            document.getElementById('avatarImage').src = userAvatar; // Avatar en sidebar
            document.getElementById('avatarImage').style.display = 'block'; // Mostrar imagen
            document.getElementById('avatarPlaceholder').style.display = 'none'; // Ocultar placeholder
            
            document.getElementById('profilePictureImage').src = userAvatar; // Avatar en perfil
            document.getElementById('profilePictureImage').style.display = 'block'; // Mostrar imagen
            document.getElementById('profilePicturePlaceholder').style.display = 'none'; // Ocultar placeholder
            
            document.getElementById('userAvatarSmall').src = userAvatar; // Avatar pequeño
            document.getElementById('userAvatarSmall').style.display = 'block'; // Mostrar imagen
            document.getElementById('userInitials').style.display = 'none'; // Ocultar iniciales
        };
        reader.readAsDataURL(file); // Leer archivo como Data URL
    }
});

// ---- AGREGAR TRANSACCIÓN ----
// Funcionalidad para crear nuevas transacciones

// Agregar funcionalidad de transacción
document.getElementById('addTransactionBtn').addEventListener('click', function() {
    const type = document.getElementById('transactionType').value; // Tipo: ingreso o gasto
    const amount = document.getElementById('transactionAmount').value; // Monto numérico
    const description = document.getElementById('transactionDescription').value; // Descripción opcional
    const dateTime = document.getElementById('transactionDateTime').value; // Fecha y hora
    
    // Validar campos obligatorios
    if (!amount || !selectedCategory || !dateTime) {
        alert('Por favor, complete todos los campos obligatorios.'); // Mensaje de error
        return;
    }
    
    // Crear objeto de transacción
    const transaction = {
        id: transactions.length + 1, // ID incremental
        type: type, // Tipo de transacción
        amount: parseFloat(amount), // Monto convertido a número
        description: description, // Descripción
        category: selectedCategory, // Categoría seleccionada
        image: selectedImage, // Imagen adjunta
        dateTime: dateTime, // Fecha y hora original
        formattedDate: formatDateTime(dateTime) // Fecha formateada
    };
    
    transactions.push(transaction); // Agregar al array
    renderTransactions(); // Actualizar tabla
    resetForm(); // Limpiar formulario
    
    alert('Transacción agregada exitosamente'); // Mensaje de confirmación
});

// ---- RENDERIZADO DE TRANSACCIONES ----
// Mostrar transacciones en la tabla

// Renderizar transacciones en tabla
function renderTransactions() {
    const tbody = document.getElementById('transactionsTableBody'); // Cuerpo de la tabla
    tbody.innerHTML = ''; // Limpiar tabla
    
    // Si no hay transacciones, mostrar mensaje
    if (transactions.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-4">
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
    
    // Ordenar transacciones por fecha (más recientes primero)
    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
    
    // Crear filas para cada transacción
    sortedTransactions.forEach(transaction => {
        const tr = document.createElement('tr'); // Crear fila de tabla
        
        // Colores de categoría para estilos visuales
        const categoryColors = {
            entretenimiento: { bg: 'rgba(14, 164, 111, 0.1)', color: '#013220' }, // Verde oscuro
            salario: { bg: 'rgba(6, 163, 255, 0.1)', color: '#0833a2' }, // Azul
            comida: { bg: 'rgba(142, 68, 173, 0.1)', color: '#4c2882' }, // Púrpura
            transporte: { bg: 'rgba(255, 193, 7, 0.1)', color: '#b58900' }, // Amarillo
            salud: { bg: 'rgba(255, 107, 107, 0.1)', color: '#ff0000' }, // Rojo
            hogar: { bg: 'rgba(52, 152, 219, 0.1)', color: '#3498db' }, // Azul claro
            compras: { bg: 'rgba(155, 89, 182, 0.1)', color: '#9b59b6' }, // Lila
            educacion: { bg: 'rgba(46, 204, 113, 0.1)', color: '#2ecc71' } // Verde
        };
        
        const categoryStyle = categoryColors[transaction.category] || { bg: 'rgba(108, 117, 125, 0.1)', color: 'var(--muted)' }; // Estilo por defecto
        
        // Contenido HTML de la fila
        tr.innerHTML = `
            <td>
                <span class="category-badge" style="background-color: ${categoryStyle.bg}; color: ${categoryStyle.color};">
                    ${capitalizeFirstLetter(transaction.category)} <!-- Nombre de categoría capitalizado -->
                </span>
            </td>
            <td>
                <span class="transaction-type-badge ${transaction.type === 'ingreso' ? 'transaction-type-income' : 'transaction-type-expense'}">
                    ${transaction.type === 'ingreso' ? 'Ingreso' : 'Gasto'} <!-- Mostrar tipo -->
                </span>
            </td>
            <td class="${transaction.type === 'ingreso' ? 'transaction-amount-income' : 'transaction-amount-expense'}">
                ${transaction.type === 'ingreso' ? '+' : '-'}S/. ${transaction.amount.toFixed(2)} <!-- Monto con signo -->
            </td>
            <td>${transaction.description || ''}</td> <!-- Descripción o vacío -->
            <td>
                ${transaction.image ? 
                    `<img src="${transaction.image}" class="transaction-image" onclick="viewImage('${transaction.image}')" alt="Imagen de transacción">` : 
                    `<div class="transaction-image-placeholder" onclick="alert('No hay imagen para esta transacción')">
                        <i class="bi bi-image"></i>
                    </div>`
                } <!-- Imagen o placeholder -->
            </td>
            <td>${transaction.formattedDate}</td> <!-- Fecha formateada -->
            <td class="text-end">
                <div class="action-buttons">
                    <button class="action-btn view-btn" onclick="viewTransaction(${transaction.id})" title="Ver detalles">
                        <i class="bi bi-eye"></i> <!-- Botón ver -->
                    </button>
                    <button class="action-btn edit-btn" onclick="editTransaction(${transaction.id})" title="Editar">
                        <i class="bi bi-pencil"></i> <!-- Botón editar -->
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteTransaction(${transaction.id})" title="Eliminar">
                        <i class="bi bi-trash"></i> <!-- Botón eliminar -->
                    </button>
                </div>
            </td>
        `;
        
        tbody.appendChild(tr); // Agregar fila a la tabla
    });
}

// ---- FUNCIONES AUXILIARES ----
// Utilidades para formato y manipulación de datos

// Funciones auxiliares
function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString); // Crear objeto fecha
    const day = String(date.getDate()).padStart(2, '0'); // Día con 2 dígitos
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mes con 2 dígitos
    const year = date.getFullYear(); // Año completo
    const hours = String(date.getHours()).padStart(2, '0'); // Horas con 2 dígitos
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Minutos con 2 dígitos
    return `${day}/${month}/${year} ${hours}:${minutes}`; // Formato DD/MM/YYYY HH:MM
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1); // Primera letra mayúscula
}

function resetForm() {
    document.getElementById('transactionAmount').value = ''; // Limpiar monto
    document.getElementById('transactionDescription').value = ''; // Limpiar descripción
    document.getElementById('transactionDateTime').value = ''; // Limpiar fecha
    document.getElementById('imagePreview').innerHTML = ` <!-- Restaurar previsualización -->
        <div class="image-preview-placeholder">
            <i class="bi bi-image"></i>
            <small>Haz clic para seleccionar imagen</small>
        </div>
    `;
    selectedImage = null; // Resetear imagen
    document.querySelectorAll('.category-btn').forEach(i => i.classList.remove('active')); // Deseleccionar categorías
    selectedCategory = null; // Resetear categoría
    editingTransactionId = null; // Resetear edición
}

// ---- ACCIONES SOBRE TRANSACCIONES ----
// Funciones para ver, editar y eliminar transacciones

// Acciones de transacción
function viewTransaction(id) {
    const transaction = transactions.find(t => t.id === id); // Buscar transacción por ID
    if (transaction) {
        const modalBody = document.getElementById('viewTransactionModalBody'); // Cuerpo del modal
        
        // Construir el contenido del modal
        modalBody.innerHTML = `
            <div class="transaction-detail-item">
                <div class="transaction-detail-label">Categoría</div>
                <div class="transaction-detail-value">${capitalizeFirstLetter(transaction.category)}</div>
            </div>
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
                <div class="transaction-detail-label">Descripción</div>
                <div class="transaction-detail-value">${transaction.description || 'Sin descripción'}</div>
            </div>
            <div class="transaction-detail-item">
                <div class="transaction-detail-label">Fecha y Hora</div>
                <div class="transaction-detail-value">${transaction.formattedDate}</div>
            </div>
            ${transaction.image ? ` <!-- Mostrar imagen solo si existe -->
            <div class="transaction-detail-item">
                <div class="transaction-detail-label">Imagen</div>
                <div class="transaction-detail-value">
                    <img src="${transaction.image}" class="transaction-detail-image" alt="Imagen de transacción">
                </div>
            </div>
            ` : ''}
        `;
        
        // Mostrar el modal
        const viewModal = new bootstrap.Modal(document.getElementById('viewTransactionModal')); // Crear instancia
        viewModal.show(); // Mostrar modal
    }
}

function editTransaction(id) {
    const transaction = transactions.find(t => t.id === id); // Buscar transacción por ID
    if (transaction) {
        editingTransactionId = id; // Guardar ID en edición
        
        const modalBody = document.getElementById('editTransactionModalBody'); // Cuerpo del modal de edición
        
        // Construir el formulario de edición
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
                    <label class="form-label fw-semibold">S/. monto</label>
                    <input type="number" class="form-control" id="editTransactionAmount" value="${transaction.amount}" step="0.01">
                </div>
                <div class="transaction-form-item full-width">
                    <label class="form-label fw-semibold">Descripción</label>
                    <input type="text" class="form-control" id="editTransactionDescription" value="${transaction.description || ''}" placeholder="Descripción de la transacción...">
                </div>
            </div>

            <div class="datetime-row">
                <div class="transaction-form-item">
                    <label class="form-label fw-semibold">Imagen</label>
                    <div class="image-preview" id="editImagePreview" onclick="document.getElementById('editImageInput').click()">
                        ${transaction.image ? 
                            `<img src="${transaction.image}" alt="Imagen de transacción">` : 
                            `<div class="image-preview-placeholder">
                                <i class="bi bi-image"></i>
                                <small>Haz clic para seleccionar imagen</small>
                            </div>`
                        }
                    </div>
                    <input type="file" id="editImageInput" accept="image/*" style="display: none;">
                </div>
                <div class="transaction-form-item">
                    <label class="form-label fw-semibold">Fecha y Hora</label>
                    <input type="datetime-local" class="form-control" id="editTransactionDateTime" value="${transaction.dateTime}">
                </div>
            </div>

            <div class="section-divider"></div>
            
            <h6 class="d-flex align-items-center gap-2 mb-3">
                <i class="bi bi-tags text-primary"></i> Selecciona Categoría
            </h6>
            
            <div class="category-buttons" id="editCategoryButtons">
                <button class="category-btn ${transaction.category === 'comida' ? 'active' : ''}" data-category="comida">
                    <i class="bi bi-cup-straw"></i> Comida
                </button>
                <button class="category-btn ${transaction.category === 'salud' ? 'active' : ''}" data-category="salud">
                    <i class="bi bi-heart-pulse"></i> Salud
                </button>
                <button class="category-btn ${transaction.category === 'salario' ? 'active' : ''}" data-category="salario">
                    <i class="bi bi-cash-coin"></i> Salario
                </button>
                <button class="category-btn ${transaction.category === 'entretenimiento' ? 'active' : ''}" data-category="entretenimiento">
                    <i class="bi bi-controller"></i> Entretenimiento
                </button>
                <button class="category-btn ${transaction.category === 'transporte' ? 'active' : ''}" data-category="transporte">
                    <i class="bi bi-car-front"></i> Transporte
                </button>
                <button class="category-btn ${transaction.category === 'hogar' ? 'active' : ''}" data-category="hogar">
                    <i class="bi bi-house"></i> Hogar
                </button>
                <button class="category-btn ${transaction.category === 'compras' ? 'active' : ''}" data-category="compras">
                    <i class="bi bi-bag"></i> Compras
                </button>
                <button class="category-btn ${transaction.category === 'educacion' ? 'active' : ''}" data-category="educacion">
                    <i class="bi bi-book"></i> Educación
                </button>
            </div>
        `;
        
        // Configurar la selección de categorías en el modal de edición
        document.querySelectorAll('#editCategoryButtons .category-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('#editCategoryButtons .category-btn').forEach(b => b.classList.remove('active')); // Deseleccionar todos
                this.classList.add('active'); // Seleccionar actual
                selectedCategory = this.getAttribute('data-category'); // Guardar categoría
            });
        });
        
        // Configurar la carga de imagen en el modal de edición
        document.getElementById('editImageInput').addEventListener('change', function(e) {
            const file = e.target.files[0]; // Archivo seleccionado
            if (file) {
                const reader = new FileReader(); // Lector de archivos
                reader.onload = function(event) {
                    selectedImage = event.target.result; // Guardar imagen
                    const preview = document.getElementById('editImagePreview'); // Contenedor de previsualización
                    preview.innerHTML = ''; // Limpiar previsualización
                    const img = document.createElement('img'); // Crear elemento imagen
                    img.src = selectedImage; // Establecer fuente
                    preview.appendChild(img); // Agregar al contenedor
                };
                reader.readAsDataURL(file); // Leer archivo
            }
        });
        
        // Mostrar el modal
        const editModal = new bootstrap.Modal(document.getElementById('editTransactionModal')); // Crear instancia
        editModal.show(); // Mostrar modal
    }
}

// ---- GUARDAR CAMBIOS DE EDICIÓN ----
// Actualizar transacción modificada

// Guardar cambios en la transacción editada
document.getElementById('saveTransactionBtn').addEventListener('click', function() {
    const type = document.getElementById('editTransactionType').value; // Tipo actualizado
    const amount = document.getElementById('editTransactionAmount').value; // Monto actualizado
    const description = document.getElementById('editTransactionDescription').value; // Descripción actualizada
    const dateTime = document.getElementById('editTransactionDateTime').value; // Fecha actualizada
    
    // Validar campos obligatorios
    if (!amount || !selectedCategory || !dateTime) {
        alert('Por favor, complete todos los campos obligatorios.'); // Mensaje de error
        return;
    }
    
    // Actualizar la transacción
    const index = transactions.findIndex(t => t.id === editingTransactionId); // Encontrar índice
    if (index !== -1) {
        transactions[index] = { // Reemplazar transacción
            id: editingTransactionId, // Mantener mismo ID
            type: type, // Nuevo tipo
            amount: parseFloat(amount), // Nuevo monto
            description: description, // Nueva descripción
            category: selectedCategory, // Nueva categoría
            image: selectedImage, // Nueva imagen
            dateTime: dateTime, // Nueva fecha
            formattedDate: formatDateTime(dateTime) // Fecha formateada
        };
        
        renderTransactions(); // Actualizar tabla
        
        // Cerrar el modal
        const editModal = bootstrap.Modal.getInstance(document.getElementById('editTransactionModal')); // Obtener instancia
        editModal.hide(); // Ocultar modal
        
        alert('Transacción actualizada exitosamente'); // Mensaje de confirmación
    }
});

function deleteTransaction(id, showAlert = true) {
    // Confirmar eliminación si se solicita alerta
    if (showAlert && !confirm('¿Estás seguro de que deseas eliminar esta transacción?')) {
        return; // Cancelar si usuario no confirma
    }
    
    transactions = transactions.filter(t => t.id !== id); // Filtrar transacción eliminada
    renderTransactions(); // Actualizar tabla
    
    if (showAlert) {
        alert('Transacción eliminada exitosamente'); // Mensaje de confirmación
    }
}

function viewImage(imageSrc) {
    document.getElementById('modalImage').src = imageSrc; // Establecer imagen en modal
    const imageModal = new bootstrap.Modal(document.getElementById('imageModal')); // Crear instancia
    imageModal.show(); // Mostrar modal
}

// ---- FUNCIONALIDAD DE PERFIL ----
// Gestión de edición del perfil de usuario

// Funcionalidad para editar perfil
document.getElementById('editProfileBtn').addEventListener('click', function() {
    const profileForm = document.getElementById('profileForm'); // Formulario de perfil
    if (profileForm.style.display === 'none') {
        profileForm.style.display = 'block'; // Mostrar formulario
        this.innerHTML = '<i class="bi bi-x me-1"></i> Cancelar'; // Cambiar texto a cancelar
    } else {
        profileForm.style.display = 'none'; // Ocultar formulario
        this.innerHTML = '<i class="bi bi-pencil me-1"></i> Editar'; // Cambiar texto a editar
    }
});

document.getElementById('cancelEditBtn').addEventListener('click', function() {
    document.getElementById('profileForm').style.display = 'none'; // Ocultar formulario
    document.getElementById('editProfileBtn').innerHTML = '<i class="bi bi-pencil me-1"></i> Editar'; // Restaurar texto
});

// ---- INICIALIZACIÓN AL CARGAR LA PÁGINA ----
// Configuración inicial cuando el DOM está listo

// Inicializar gráficos al cargar la página si está en sección de informes
document.addEventListener('DOMContentLoaded', function() {
    // ...existing code...

    const nombreUsuario = localStorage.getItem('nombreUsuario') || 'Usuario';
    const emailUsuario = localStorage.getItem('emailUsuario') || 'correo@ejemplo.com';

    // Topbar principal
    const mainTitleText = document.querySelector('#main-title .text-gradient');
    if (mainTitleText) mainTitleText.textContent = nombreUsuario;

    // Perfil
    const profileName = document.getElementById('profileName');
    if (profileName) profileName.textContent = nombreUsuario;

    const profileEmail = document.getElementById('profileEmail');
    if (profileEmail) profileEmail.textContent = emailUsuario;

    // Topbar rápido (esquina derecha)
    const quickProfileName = document.getElementById('quickProfileName');
    if (quickProfileName) quickProfileName.textContent = nombreUsuario;

    const quickProfileEmail = document.getElementById('quickProfileEmail');
    if (quickProfileEmail) quickProfileEmail.textContent = emailUsuario;
    // ...resto de tu código existente...
    if (document.getElementById('informes').classList.contains('active')) {
        initializeCharts(); // Inicializar gráficos si en informes
    }
    
    // Establecer fecha y hora actual como valor por defecto
    const now = new Date(); // Fecha actual
    const formattedNow = now.toISOString().slice(0, 16); // Formato YYYY-MM-DDTHH:MM
    document.getElementById('transactionDateTime').value = formattedNow; // Establecer en campo
    
    // Renderizar transacciones vacías inicialmente
    renderTransactions(); // Mostrar tabla vacía

});