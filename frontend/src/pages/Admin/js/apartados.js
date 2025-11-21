document.addEventListener('DOMContentLoaded', function() {
    initializeApartados();
});

function initializeApartados() {
    renderDefaultCategories();
    renderDefaultSubcategories();
    loadDefaultPaymentMethods();
    updateNotificationsDropdown();
    
    // Event listeners para gestión de categorías
    document.getElementById('saveCategoryBtn').addEventListener('click', saveCategory);
    document.getElementById('saveSubcategoryBtn').addEventListener('click', saveSubcategory);
    document.getElementById('savePaymentMethodBtn').addEventListener('click', savePaymentMethod);
}

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
            const subcategoriesCount = defaultSubcategories[category.id] ? defaultSubcategories[category.id].length : 0;
            
            html += `
                <div class="list-group-item d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center">
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

function renderDefaultSubcategories() {
    const container = document.getElementById('defaultSubcategoriesList');
    if (!container) return;
    
    let html = '<div class="manage-categories-container">';
    
    defaultCategories.forEach(category => {
        const subcategories = defaultSubcategories[category.id] || [];
        
        if (subcategories.length > 0) {
            html += `
                <div class="mb-4">
                    <div class="d-flex align-items-center mb-3">
                        <i class="${category.icon} text-${category.color} me-2"></i>
                        <h6 class="mb-0 text-${category.color}">${category.label}</h6>
                        <span class="badge bg-${category.color} ms-2">${subcategories.length} subcategorías</span>
                    </div>
                    <div class="row g-2">
            `;
            
            subcategories.forEach((subcategory, index) => {
                html += `
                    <div class="col-md-6 col-lg-4">
                        <div class="subcategory-item d-flex justify-content-between align-items-center">
                            <div class="d-flex align-items-center">
                                <i class="${subcategory.icon} me-2 text-muted"></i>
                                <div>
                                    <div class="fw-medium">${subcategory.label}</div>
                                    <small class="text-muted">${subcategory.name}</small>
                                </div>
                            </div>
                            <div class="btn-group">
                                <button class="btn btn-sm btn-outline-warning" 
                                    onclick="editSubcategory('${category.id}', '${subcategory.name}')"
                                    title="Editar">
                                    <i class="bi bi-pencil"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-danger" 
                                    onclick="deleteSubcategory('${category.id}', '${subcategory.name}')"
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
    
    if (Object.keys(defaultSubcategories).length === 0) {
        html += `
            <div class="text-center py-4">
                <i class="bi bi-tags display-4 text-muted"></i>
                <p class="text-muted mt-3">No hay subcategorías configuradas</p>
            </div>
        `;
    }
    
    html += '</div>';
    container.innerHTML = html;
}

function loadDefaultPaymentMethods() {
    const container = document.getElementById('defaultPaymentMethodsList');
    let html = '';
    
    paymentMethods.forEach((method, index) => {
        html += `
            <div class="col-md-6 col-lg-3 mb-4">
                <div class="payment-method-card">
                    ${method.logo ? `
                        <img src="${method.logo}" alt="${method.name}" class="payment-method-logo" 
                                onerror="this.src='/frontend/public/img/Tipos/default.png'; this.onerror=null;">
                    ` : `
                        <div class="payment-method-icon">
                            <i class="bi bi-credit-card"></i>
                        </div>
                    `}
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
    
    // Agregar botón para nuevo medio de pago
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

function editSubcategory(categoryId, subcategoryName) {
    const subcategory = defaultSubcategories[categoryId]?.find(s => s.name === subcategoryName);
    if (!subcategory) return;
    
    currentEditingSubcategoryId = subcategoryName;
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
        if (category.id === categoryId) {
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
        // Editar subcategoría existente
        const subcategoryIndex = defaultSubcategories[currentEditingCategoryId]?.findIndex(s => s.name === currentEditingSubcategoryId);
        if (subcategoryIndex !== -1) {
            defaultSubcategories[currentEditingCategoryId][subcategoryIndex].label = name;
            defaultSubcategories[currentEditingCategoryId][subcategoryIndex].icon = icon;
            
            // Si cambió la categoría padre, mover la subcategoría
            if (currentEditingCategoryId !== parentCategoryId) {
                const subcategory = defaultSubcategories[currentEditingCategoryId][subcategoryIndex];
                defaultSubcategories[currentEditingCategoryId].splice(subcategoryIndex, 1);
                
                if (!defaultSubcategories[parentCategoryId]) {
                    defaultSubcategories[parentCategoryId] = [];
                }
                defaultSubcategories[parentCategoryId].push(subcategory);
            }
        }
    } else {
        // Agregar nueva subcategoría
        const newSubcategory = {
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

function deleteSubcategory(categoryId, subcategoryName) {
    const subcategory = defaultSubcategories[categoryId]?.find(s => s.name === subcategoryName);
    if (!subcategory) return;
    
    if (!confirm(`¿Estás seguro de que deseas eliminar la subcategoría "${subcategory.label}"?\n\nEsta acción no se puede deshacer.`)) {
        return;
    }
    
    defaultSubcategories[categoryId] = defaultSubcategories[categoryId].filter(s => s.name !== subcategoryName);
    
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

function savePaymentMethod() {
    const name = document.getElementById('paymentMethodName').value.trim();
    const logo = document.getElementById('paymentMethodLogo').value.trim();
    
    if (!name) {
        showNotification('Por favor ingresa un nombre para el medio de pago', 'error');
        return;
    }
    
    if (currentEditingPaymentMethod !== null) {
        // Editar medio de pago existente
        paymentMethods[currentEditingPaymentMethod].name = name;
        if (logo) {
            paymentMethods[currentEditingPaymentMethod].logo = logo;
        }
    } else {
        // Agregar nuevo medio de pago
        paymentMethods.push({
            name: name,
            logo: logo || null
        });
    }
    
    savePaymentMethods();
    loadDefaultPaymentMethods();
    
    showNotification(`Medio de pago ${currentEditingPaymentMethod !== null ? 'actualizado' : 'creado'} exitosamente`, 'success');
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('paymentMethodModal'));
    modal.hide();
    currentEditingPaymentMethod = null;
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

function deleteCategory(categoryId) {
    const category = defaultCategories.find(c => c.id === categoryId);
    if (!category) return;
    
    if (!confirm(`¿Estás seguro de que deseas eliminar la categoría "${category.label}"?\n\nEsta acción eliminará también todas sus subcategorías y no se puede deshacer.`)) {
        return;
    }
    
    defaultCategories = defaultCategories.filter(c => c.id !== categoryId);
    delete defaultSubcategories[categoryId];
    
    saveDefaultCategories();
    saveDefaultSubcategories();
    renderDefaultCategories();
    renderDefaultSubcategories();
    
    addActivity(`Categoría eliminada: ${category.label}`, 'system');
    showNotification('Categoría eliminada exitosamente', 'success');
}

function updateNotificationsDropdown() {
    const badge = document.getElementById('notificationBadge');
    const dropdownContent = document.getElementById('activitiesDropdownContent');
    
    if (!badge || !dropdownContent) return;

    const recentActivities = activities.slice(0, 5);
    const unreadCount = recentActivities.filter(act => !act.read).length;
    
    badge.textContent = unreadCount > 0 ? unreadCount : '';
    badge.style.display = unreadCount > 0 ? 'inline-block' : 'none';

    let dropdownHTML = '';

    if (recentActivities.length === 0) {
        dropdownHTML = `<li><span class="dropdown-item text-muted text-center small">No hay actividades recientes</span></li>`;
    } else {
        recentActivities.forEach(activity => {
            const icon = getActivityIcon(activity.type);
            const timeAgo = getTimeAgo(activity.timestamp);

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