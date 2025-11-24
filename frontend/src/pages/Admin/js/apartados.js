// ==========================================
// VARIABLES GLOBALES
// ==========================================

// 1. IMPORTANTE: Quitamos 'let' para evitar conflictos si ya existen en principal.js.
defaultCategories = []; 
defaultSubcategories = {}; // Objeto que contendrá: { '1': [sub1, sub2], '2': [sub3] }
paymentMethods = []; 

// Variables para edición (También quitamos 'let')
currentEditingCategoryId = null; // Corregido
currentEditingSubcategoryId = null; // Corregido
currentEditingPaymentMethod = null; // Corregido

// ==========================================
// INICIALIZACIÓN
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    initializeApartados();
});

function initializeApartados() {
    // 1. Cargar Categorías (y Subcategorías) desde el Backend
    fetchCategoriesAndSubcategories();
    
    // 2. Renderizar el resto (lógica local original intacta)
    fetchDefaultPaymentMethods();
    updateNotificationsDropdown();
    
    // Event listeners para gestión de categorías
    const saveCatBtn = document.getElementById('saveCategoryBtn');
    if(saveCatBtn) saveCatBtn.addEventListener('click', saveCategory);

    const saveSubcatBtn = document.getElementById('saveSubcategoryBtn');
    if(saveSubcatBtn) saveSubcatBtn.addEventListener('click', saveSubcategory);

    const savePayBtn = document.getElementById('savePaymentMethodBtn');
    if(savePayBtn) savePayBtn.addEventListener('click', savePaymentMethod);
}

// --- NUEVA FUNCIÓN: TRAER CATEGORÍAS Y SUBCATEGORÍAS ---
async function fetchCategoriesAndSubcategories() {
    try {
        // Petición de Categorías
        const catResponse = await fetch('http://localhost:8080/api/admin/categories');
        
        if (!catResponse.ok) {
            throw new Error('Error al obtener categorías');
        }

        defaultCategories = await catResponse.json();
        
        // Petición de Subcategorías (Traer TODAS y agrupar)
        // Usamos un endpoint que traiga todas las subcategorías del sistema para agruparlas.
        // Como no hemos creado un endpoint /subcategories/all, llamaremos a cada categoría individualmente
        // NOTA: Para producción, crear un endpoint /subcategories/all que devuelva {categoriaId: [sub1, sub2]} sería más eficiente.
        
        const allSubcategories = {};
        
        for (const category of defaultCategories) {
            const subResponse = await fetch(`http://localhost:8080/api/admin/categories/${category.id}/subcategories`);
            
            if (subResponse.ok) {
                const subs = await subResponse.json();
                if (subs.length > 0) {
                    allSubcategories[category.id] = subs;
                }
            } else {
                console.warn(`No se encontraron subcategorías para ID: ${category.id}`);
            }
        }
        
        defaultSubcategories = allSubcategories;
        console.log("Subcategorías agrupadas:", Object.keys(defaultSubcategories).length);

        // Renderizamos ambas secciones
        renderDefaultCategories(); 
        renderDefaultSubcategories(); 
        
    } catch (error) {
        console.error("Error al cargar apartados:", error);
        const containerCat = document.getElementById('defaultCategoriesList');
        if(containerCat) containerCat.innerHTML = '<div class="text-center text-danger p-3">Error de conexión con el servidor.</div>';
    }
}

// --- NUEVA FUNCIÓN: TRAER MEDIOS DE PAGO DESDE BACKEND ---
async function fetchDefaultPaymentMethods() {
    try {
        // Endpoint: /api/admin/payment-methods
        const response = await fetch('http://localhost:8080/api/admin/payment-methods');
        
        if (!response.ok) {
            throw new Error('Error al obtener medios de pago');
        }

        // Guardamos los datos del backend (DTO: id, name, logo)
        paymentMethods = await response.json();
        
        // Renderizamos las tarjetas
        renderDefaultPaymentMethods();
        
    } catch (error) {
        console.error("Error:", error);
        const containerPay = document.getElementById('defaultPaymentMethodsList');
        if(containerPay) containerPay.innerHTML = '<div class="text-center text-danger p-3">Error de conexión con el servidor.</div>';
    }
}

// ==========================================
// RENDERIZADO DE CATEGORÍAS (ACTUALIZADO)
// ==========================================

function renderDefaultCategories() {
    const container = document.getElementById('defaultCategoriesList');
    if (!container) return;
    
    let html = '';
    
    if (defaultCategories.length === 0) {
        html = `
            <div class="text-center py-4">
                <i class="bi bi-inbox display-4 text-muted"></i>
                <p class="text-muted mt-3">No hay categorías configuradas</p>
            </div>
        `;
    } else {
        defaultCategories.forEach(category => {
            // CAMBIO: Usamos el conteo que viene del Backend
            const subcategoriesCount = category.subcategoriesCount || 0;
            
            html += `
                <div class="list-group-item d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center">
                        <!-- Icono y Color vienen del Backend -->
                        <i class="${category.icon} text-${category.color} me-3 fs-5"></i>
                        <div>
                            <strong class="d-block">${category.label}</strong>
                            <small class="text-muted">ID: ${category.id}</small>
                        </div>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                        <span class="badge bg-${category.color} rounded-pill">${subcategoriesCount} subcat.</span>
                        <div class="btn-group">
                            <button class="btn btn-sm btn-outline-warning" onclick="editCategory('${category.id}')" title="Editar categoría">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="deleteCategory('${category.id}')" title="Eliminar categoría">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
    }
    
    container.innerHTML = html;
}

// ==========================================
// RENDERIZADO DE SUBCATEGORÍAS (ACTUALIZADO)
// ==========================================

function renderDefaultSubcategories() {
    const container = document.getElementById('defaultSubcategoriesList');
    if (!container) return;
    
    let html = '<div class="manage-categories-container">';
    let totalSubcategoriesRendered = 0;
    
    defaultCategories.forEach(category => {
        // Las subcategorías se leen de la variable global 'defaultSubcategories'
        const subcategories = defaultSubcategories[category.id] || [];
        
        if (subcategories.length > 0) {
            totalSubcategoriesRendered += subcategories.length;
            
            // Renderizar el encabezado (Vivienda 11 subcategorías)
            html += `
                <div class="mb-4">
                    <div class="d-flex align-items-center mb-3">
                        <i class="${category.icon} text-${category.color} me-2"></i>
                        <h6 class="mb-0 text-${category.color}">${category.label}</h6>
                        <span class="badge bg-${category.color} ms-2">${subcategories.length} subcategorías</span>
                    </div>
                    <div class="row g-2">
            `;
            
            // Renderizar las tarjetas de subcategoría
            subcategories.forEach((subcategory) => {
                html += `
                    <div class="col-md-6 col-lg-4">
                        <div class="subcategory-item d-flex justify-content-between align-items-center">
                            <div class="d-flex align-items-center">
                                <i class="${subcategory.icon} me-2 text-muted"></i>
                                <div>
                                    <div class="fw-medium">${subcategory.label}</div>
                                    <!-- Usamos el 'id' del backend para el 'name' técnico si no existe otro -->
                                    <small class="text-muted">ID: ${subcategory.id}</small> 
                                </div>
                            </div>
                            <div class="btn-group">
                                <button class="btn btn-sm btn-outline-warning" 
                                    onclick="editSubcategory('${category.id}', '${subcategory.id}')" 
                                    title="Editar">
                                    <i class="bi bi-pencil"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-danger" 
                                    onclick="deleteSubcategory('${category.id}', '${subcategory.id}')"
                                    title="Eliminar">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            html += `</div></div>`;
        }
    });
    
    // Si no hay ninguna subcategoría en total (incluyendo las que vienen del backend)
    if (totalSubcategoriesRendered === 0) {
        html = `
            <div class="text-center py-4">
                <i class="bi bi-tags display-4 text-muted"></i>
                <p class="text-muted mt-3">No hay subcategorías configuradas o falló la carga.</p>
            </div>
        `;
    }
    
    html += '</div>';
    container.innerHTML = html;
}

/// ==========================================
// RENDERIZADO DE MEDIOS DE PAGO (ACTUALIZADO)
// ==========================================

function renderDefaultPaymentMethods() {
    const container = document.getElementById('defaultPaymentMethodsList');
    if (!container) return;

    let html = '';
    
    // Verificamos si hay métodos de pago cargados
    let hasMethods = paymentMethods && paymentMethods.length > 0;
    
    if (hasMethods) {
        paymentMethods.forEach((method, index) => {
            // Usamos el 'logo' (clase bi-) que ahora viene del backend (MedioPagoDTO.logo)
            const iconClass = method.logo || 'bi-credit-card'; 

            html += `
                <div class="col-md-6 col-lg-3 mb-4">
                    <div class="payment-method-card">
                        
                        <div class="payment-method-icon">
                            <i class="bi ${iconClass}"></i>
                        </div>
                        
                        <h6 class="mb-2">${method.name}</h6>
                        <div class="d-flex justify-content-center gap-2 mt-3">
                            <button class="btn btn-sm btn-outline-warning" onclick="editPaymentMethod(${index})" title="Editar">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="deletePaymentMethod(${index})" title="Eliminar">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    // Agregamos el botón de nuevo medio de pago (se muestra siempre o después de los listados)
    html += `
        <div class="col-md-6 col-lg-3 mb-4">
            <div class="payment-method-card d-flex align-items-center justify-content-center" 
                    style="border: 2px dashed var(--accent); background: rgba(14, 164, 111, 0.05); cursor: pointer;" 
                    onclick="showAddPaymentMethodModal()">
                <div class="text-center">
                    <i class="bi bi-plus-circle display-6 text-success mb-2"></i>
                    <h6 class="text-success">Agregar Medio de Pago</h6>
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

// La función loadDefaultPaymentMethods original ahora es solo un wrapper o ya no se usa, pero la actualizo para que no haga doble trabajo.
function loadDefaultPaymentMethods() {
    // Ya no es necesario que esta función haga nada, pues initializeApartados llama a fetchDefaultPaymentMethods()
    // Si otras partes del código la llaman, simplemente renderizamos lo que se haya cargado.
    renderDefaultPaymentMethods();
}

// ==========================================
// LISTENERS Y MODALES
// ==========================================

function setupEventListeners() {
    // Los listeners ya se agregaron en initializeApartados
}

// --- Funciones de Lógica (Tu código original) ---

function showAddCategoryModal() {
    const input = document.getElementById('categoryName');
    if(input) input.value = '';
    
    const modal = new bootstrap.Modal(document.getElementById('categoryModal'));
    modal.show();
}

function saveCategory() {
    console.log("Guardar categoría (pendiente de backend POST)");
}

function editCategory(id) {
    console.log("Editar categoría ID:", id);
}

function deleteCategory(id) {
    const category = defaultCategories.find(c => c.id === id);
    if (!category) return;
    
    if (!confirm(`¿Estás seguro de que deseas eliminar la categoría "${category.label}"?\n\nEsta acción eliminará también todas sus subcategorías y no se puede deshacer.`)) {
        return;
    }
    
    // Lógica local para simulación
    defaultCategories = defaultCategories.filter(c => c.id !== id);
    delete defaultSubcategories[id];
    
    saveDefaultCategories();
    saveDefaultSubcategories();
    fetchCategoriesAndSubcategories(); // Usamos el fetch para recargar
    
    addActivity(`Categoría eliminada: ${category.label}`, 'system');
    showNotification('Categoría eliminada exitosamente', 'success');
}

// Funciones de Subcategorías (Tus originales, ahora usando IDs numéricos)
function showAddSubcategoryModal() {
    currentEditingSubcategoryId = null;
    document.getElementById('subcategoryModalLabel').textContent = 'Agregar Nueva Subcategoría';
    document.getElementById('subcategoryName').value = '';
    document.getElementById('subcategoryIcon').value = 'bi-tag';
    document.getElementById('saveSubcategoryBtn').textContent = 'Crear Subcategoría';
    document.getElementById('saveSubcategoryBtn').className = 'btn btn-success';
    
    // Cargar categorías padre
    const parentCategorySelect = document.getElementById('parentCategory');
    parentCategorySelect.innerHTML = '';
    
    defaultCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.label;
        parentCategorySelect.appendChild(option);
    });
    
    const modal = new bootstrap.Modal(document.getElementById('subcategoryModal'));
    modal.show();
}

function editSubcategory(categoryId, subcategoryId) {
    // Buscamos por ID (numérico)
    const subcategory = defaultSubcategories[categoryId]?.find(s => s.id == subcategoryId);
    if (!subcategory) return;
    
    currentEditingSubcategoryId = subcategoryId;
    currentEditingCategoryId = categoryId;
    
    document.getElementById('subcategoryModalLabel').textContent = 'Editar Subcategoría';
    document.getElementById('subcategoryName').value = subcategory.label;
    document.getElementById('subcategoryIcon').value = subcategory.icon;
    document.getElementById('saveSubcategoryBtn').textContent = 'Actualizar Subcategoría';
    document.getElementById('saveSubcategoryBtn').className = 'btn btn-warning';
    
    // Cargar categorías padre
    const parentCategorySelect = document.getElementById('parentCategory');
    parentCategorySelect.innerHTML = '';
    
    defaultCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.label;
        if (category.id == categoryId) {
            option.selected = true;
        }
        parentCategorySelect.appendChild(option);
    });
    
    const modal = new bootstrap.Modal(document.getElementById('subcategoryModal'));
    modal.show();
}

function saveSubcategory() {
    const name = document.getElementById('subcategoryName').value.trim();
    const icon = document.getElementById('subcategoryIcon').value;
    const parentCategoryId = document.getElementById('parentCategory').value;
    
    if (!name) {
        showNotification('Por favor ingresa un nombre para la subcategoría', 'error');
        return;
    }
    
    if (!parentCategoryId) {
        showNotification('Por favor selecciona una categoría padre', 'error');
        return;
    }
    
    if (currentEditingSubcategoryId) {
        // Lógica de Edición Local
        const subcategoryIndex = defaultSubcategories[currentEditingCategoryId]?.findIndex(s => s.id == currentEditingSubcategoryId);
        if (subcategoryIndex !== -1) {
            defaultSubcategories[currentEditingCategoryId][subcategoryIndex].label = name;
            defaultSubcategories[currentEditingCategoryId][subcategoryIndex].icon = icon;
            
            // Si cambió la categoría padre, mover la subcategoría
            if (currentEditingCategoryId != parentCategoryId) {
                const subcategory = defaultSubcategories[currentEditingCategoryId][subcategoryIndex];
                defaultSubcategories[currentEditingCategoryId].splice(subcategoryIndex, 1);
                
                if (!defaultSubcategories[parentCategoryId]) {
                    defaultSubcategories[parentCategoryId] = [];
                }
                defaultSubcategories[parentCategoryId].push(subcategory);
            }
        }
    } else {
        // Lógica de Creación Local
        const newSubcategory = {
            id: Date.now(), // ID temporal
            name: name.toLowerCase().replace(/\s+/g, '_'),
            label: name,
            icon: icon
        };
        
        if (!defaultSubcategories[parentCategoryId]) {
            defaultSubcategories[parentCategoryId] = [];
        }
        
        defaultSubcategories[parentCategoryId].push(newSubcategory);
    }
    
    saveDefaultSubcategories();
    renderDefaultSubcategories();
    
    addActivity(`Subcategoría ${currentEditingSubcategoryId ? 'actualizada' : 'creada'}: ${name}`, 'system');
    
    showNotification(`Subcategoría ${currentEditingSubcategoryId ? 'actualizada' : 'creada'} exitosamente`, 'success');
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('subcategoryModal'));
    modal.hide();
    currentEditingSubcategoryId = null;
    currentEditingCategoryId = null;
}

function deleteSubcategory(categoryId, subcategoryId) {
    const subcategory = defaultSubcategories[categoryId]?.find(s => s.id == subcategoryId);
    if (!subcategory) return;
    
    if (!confirm(`¿Estás seguro de que deseas eliminar la subcategoría "${subcategory.label}"?\n\nEsta acción no se puede deshacer.`)) {
        return;
    }
    
    defaultSubcategories[categoryId] = defaultSubcategories[categoryId].filter(s => s.id != subcategoryId);
    
    saveDefaultSubcategories();
    renderDefaultSubcategories();
    
    addActivity(`Subcategoría eliminada: ${subcategory.label}`, 'system');
    showNotification('Subcategoría eliminada exitosamente', 'success');
}

function showAddPaymentMethodModal() {
    currentEditingPaymentMethod = null;
    document.getElementById('paymentMethodModalLabel').textContent = 'Agregar Medio de Pago';
    document.getElementById('paymentMethodName').value = '';
    document.getElementById('paymentMethodLogo').value = '';
    document.getElementById('savePaymentMethodBtn').textContent = 'Crear Medio de Pago';
    
    const modal = new bootstrap.Modal(document.getElementById('paymentMethodModal'));
    modal.show();
}

function editPaymentMethod(index) {
    const method = paymentMethods[index];
    currentEditingPaymentMethod = index;
    
    document.getElementById('paymentMethodModalLabel').textContent = 'Editar Medio de Pago';
    document.getElementById('paymentMethodName').value = method.name;
    document.getElementById('paymentMethodLogo').value = method.logo || '';
    document.getElementById('savePaymentMethodBtn').textContent = 'Actualizar Medio de Pago';
    
    const modal = new bootstrap.Modal(document.getElementById('paymentMethodModal'));
    modal.show();
}

async function savePaymentMethod() {
    const name = document.getElementById('paymentMethodName').value.trim();
    const logo = document.getElementById('paymentMethodLogo').value.trim();

    if (!name) {
        showNotification('Por favor ingresa un nombre para el medio de pago', 'error');
        return;
    }

    const payload = { name, logo };

    try {
        const response = await fetch('http://localhost:8080/api/admin/payment-methods', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('Error al guardar');

        // Recargamos la lista
        await fetchDefaultPaymentMethods();

        showNotification('Medio de pago creado exitosamente', 'success');
        bootstrap.Modal.getInstance(document.getElementById('paymentMethodModal')).hide();

    } catch (e) {
        console.error(e);
        showNotification('No se pudo crear el medio de pago', 'error');
    }
}

function deletePaymentMethod(index) {
    const method = paymentMethods[index];
    if (!confirm(`¿Estás seguro de que deseas eliminar el medio de pago "${method.name}"?`)) {
        return;
    }
    
    paymentMethods.splice(index, 1);
    savePaymentMethods();
    loadDefaultPaymentMethods();
    
    showNotification(`Medio de pago "${method.name}" eliminado exitosamente`, 'success');
}

function updateNotificationsDropdown() {
    const badge = document.getElementById('notificationBadge');
    const dropdownContent = document.getElementById('activitiesDropdownContent');
    
    if (!badge || !dropdownContent) return;

    const recentActivities = typeof activities !== 'undefined' ? activities.slice(0, 5) : [];
    const unreadCount = recentActivities.filter(act => !act.read).length;
    
    badge.textContent = unreadCount > 0 ? unreadCount : '';
    badge.style.display = unreadCount > 0 ? 'inline-block' : 'none';

    let dropdownHTML = '';

    if (recentActivities.length === 0) {
        dropdownHTML = `<li><span class="dropdown-item text-muted text-center small">No hay actividades recientes</span></li>`;
    } else {
        recentActivities.forEach(activity => {
            const icon = typeof getActivityIcon === 'function' ? getActivityIcon(activity.type) : 'bi-bell';
            const timeAgo = typeof getTimeAgo === 'function' ? getTimeAgo(activity.timestamp) : '';

            dropdownHTML += `
                <li class="notification-item ${activity.read ? 'read' : 'unread'}">
                    <a class="dropdown-item ${activity.read ? '' : 'fw-bold'}" href="actividades.html">
                        <div class="d-flex align-items-start">
                            <i class="bi ${icon} me-2"></i>
                            <div class="flex-grow-1">
                                <div class="small">${activity.message}</div>
                                <div class="text-muted small">${timeAgo}</div>
                            </div>
                            ${!activity.read ? '<span class="badge bg-success rounded-pill ms-2" style="font-size: 0.6em;">●</span>' : ''}
                        </div>
                    </a>
                </li>
            `;
        });
    }

    dropdownContent.innerHTML = dropdownHTML;
}

// --- Funciones de Lógica para CATEGORÍAS (Se mantienen para que no rompan los listeners) ---

function showAddCategoryModal() {
    const input = document.getElementById('categoryName');
    if(input) input.value = '';
    
    const modal = new bootstrap.Modal(document.getElementById('categoryModal'));
    modal.show();
}

function saveCategory() {
    console.log("Guardar categoría (pendiente de backend POST)");
}

function editCategory(id) {
    console.log("Editar categoría ID:", id);
}

function deleteCategory(id) {
    const category = defaultCategories.find(c => c.id === id);
    if (!category) return;
    
    if (!confirm(`¿Estás seguro de que deseas eliminar la categoría "${category.label}"?\n\nEsta acción eliminará también todas sus subcategorías y no se puede deshacer.`)) {
        return;
    }
    
    defaultCategories = defaultCategories.filter(c => c.id !== id);
    delete defaultSubcategories[id];
    
    saveDefaultCategories();
    saveDefaultSubcategories();
    renderDefaultCategories();
    renderDefaultSubcategories();
    
    addActivity(`Categoría eliminada: ${category.label}`, 'system');
    showNotification('Categoría eliminada exitosamente', 'success');
}

// Funciones locales que tu código usa pero que no me pasaste definidas (por si acaso las incluyo como placeholders funcionales para que no de error)
function saveDefaultSubcategories() {
    console.log("Guardando subcategorías (local)");
}
function saveDefaultCategories() {
    console.log("Guardando categorías (local)");
}
function savePaymentMethods() {
    console.log("Guardando métodos de pago (local)");
}
function addActivity(msg, type) {
    console.log("Actividad:", msg);
}
function showNotification(msg, type) {
    // Si existe una función global, la usamos, sino alert
    if(typeof window.showNotification === 'function') {
        window.showNotification(msg, type);
    } else {
        console.log("Notificación:", msg);
    }
}