// Variables globales
let users = [];
let currentEditingUserId = null;
let currentDeletingUserId = null;

// Ayudante para la fecha
document.getElementById('year').textContent = new Date().getFullYear();

// Inicializar datos de usuarios
function initializeUsers() {
    // Cargar usuarios desde localStorage o inicializar array vacío
    const storedUsers = localStorage.getItem('finliUsers');
    if (storedUsers) {
        users = JSON.parse(storedUsers);
    } else {
        users = [];
    }
    
    renderUsers();
}

// Guardar usuarios en localStorage
function saveUsers() {
    localStorage.setItem('finliUsers', JSON.stringify(users));
    updateUserCount();
}

// Actualizar contadores de usuarios
function updateUserCount() {
    document.getElementById('totalUsers').textContent = users.length;
    document.getElementById('totalUsers2').textContent = users.length;
    document.getElementById('countInicio').textContent = Math.min(4, users.length);
    document.getElementById('countUsuarios').textContent = Math.min(10, users.length);
}

// Renderizar usuarios en las tablas
function renderUsers() {
    // Ordenar usuarios por fecha de registro (más recientes primero)
    const sortedUsers = [...users].sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate));
    
    // Renderizar en la tabla de Inicio (solo los 4 más recientes)
    const tbodyInicio = document.getElementById('tbodyInicio');
    tbodyInicio.innerHTML = '';
    
    const usersForInicio = sortedUsers.slice(0, 4);
    usersForInicio.forEach(user => {
        tbodyInicio.appendChild(createUserRow(user));
    });
    
    // Renderizar en la tabla de Usuarios (todos los usuarios)
    const tbodyUsuarios = document.getElementById('tbodyUsuarios');
    tbodyUsuarios.innerHTML = '';
    
    sortedUsers.forEach(user => {
        tbodyUsuarios.appendChild(createUserRow(user, 'usuarios'));
    });
    
    updateUserCount();
}

// Crear fila de usuario para la tabla
function createUserRow(user, section = 'inicio') {
    const tr = document.createElement('tr');
    
    // Obtener iniciales del nombre
    const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
    
    // Determinar color de fondo para el avatar
    const colors = ['var(--accent-3)', 'var(--accent)', 'var(--accent-4)', 'var(--muted)', '#3498db', '#e74c3c', '#2ecc71', '#9b59b6', '#f39c12', '#1abc9c'];
    const colorIndex = user.id % colors.length;
    const bgColor = colors[colorIndex];
    
    // Formatear fecha de registro
    const formattedDate = formatDate(user.registrationDate);
    
    tr.innerHTML = `
    <td><span class="badge bg-light text-dark">${user.id}</span></td>
    <td>
        <div class="d-flex align-items-center gap-2">
        <div class="avatar-sm" style="background:${user.photo ? 'transparent' : bgColor}">
            ${user.photo ? 
            `<img src="${user.photo}" alt="${user.name}">` : 
            `<span>${initials}</span>`
            }
        </div>
        </div>
    </td>
    <td>
        <div style="font-weight:600">${user.name}</div>
    </td>
    <td>${user.email}</td>
    <td><span class="badge rounded-pill ${user.type === 'Premium' ? 'bg-warning text-dark' : 'bg-light text-dark'}">${user.type}</span></td>
    <td>${formattedDate}</td>
    <td class="text-end">
        <button class="btn btn-sm btn-light edit-user" data-id="${user.id}" title="Editar"><i class="bi bi-pencil"></i></button>
        <button class="btn btn-sm btn-light delete-user" data-id="${user.id}" title="Eliminar"><i class="bi bi-trash"></i></button>
    </td>
    `;
    
    return tr;
}

// Formatear fecha de YYYY-MM-DD a DD/MM/YYYY
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Navigation system
const navLinks = document.querySelectorAll('.nav-link');
const contentSections = document.querySelectorAll('.content-section');
const mainTitle = document.getElementById('main-title');
const mainSubtitle = document.getElementById('main-subtitle');
const searchInput = document.getElementById('search-input');

// Titles and placeholders for each section
const sectionData = {
    inicio: {
        title: 'Bienvenido, <span class="text-gradient">Administrador</span>',
        subtitle: 'Panel de control',
        placeholder: 'Buscar usuarios...'
    },
    usuarios: {
        title: 'Bienvenido, <span class="text-gradient">Administrador</span>',
        subtitle: 'Gestión de usuarios',
        placeholder: 'Buscar usuarios...'
    },
    reportes: {
        title: 'Bienvenido, <span class="text-gradient">Administrador</span>',
        subtitle: 'Reportes y análisis',
        placeholder: 'Buscar reportes...'
    }
};

// Initialize navigation
navLinks.forEach(link => {
    link.addEventListener('click', function() {
        const targetSection = this.getAttribute('data-section');
        
        // Update active states
        navLinks.forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');
        
        // Show/hide sections
        contentSections.forEach(section => {
            section.classList.remove('active');
            if (section.id === targetSection) {
                section.classList.add('active');
            }
        });
        
        // Update titles and placeholder
        if (sectionData[targetSection]) {
            mainTitle.innerHTML = sectionData[targetSection].title;
            mainSubtitle.textContent = sectionData[targetSection].subtitle;
            searchInput.placeholder = sectionData[targetSection].placeholder;
        }

        // Initialize charts if showing reports section
        if (targetSection === 'reportes') {
            initializeCharts();
        }
    });
});

// Export table to CSV functions
document.getElementById('exportBtnInicio').addEventListener('click', function(){
    exportTableToCSV('inicio');
});

document.getElementById('exportBtnUsuarios').addEventListener('click', function(){
    exportTableToCSV('usuarios');
});

function exportTableToCSV(section) {
    const table = document.querySelector(`#${section} table`);
    const rows = Array.from(table.querySelectorAll('tbody tr'));
    const csv = [];
    
    // Get headers
    const headers = Array.from(table.querySelectorAll('thead th'));
    const headerText = headers.map(th => th.textContent.trim()).join(',');
    csv.push(headerText);
    
    // Get rows data
    rows.forEach(r => {
        const cols = Array.from(r.querySelectorAll('td'));
        const rowData = cols.map(td => {
            // Skip photo column
            if (td.querySelector('.avatar-sm')) {
                return '';
            }
            return td.innerText.trim();
        });
        csv.push(rowData.join(','));
    });
    
    const blob = new Blob([csv.join('\n')], {type: 'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); 
    a.href = url; 
    a.download = `usuarios_${section}.csv`; 
    a.click(); 
    URL.revokeObjectURL(url);
}

// Add hover effects to cards
document.querySelectorAll('.card-stat, .chart-card, .table-card, .card-report').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Preview de imagen al seleccionar archivo
document.getElementById('userPhoto').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            document.getElementById('addPhotoPreview').src = event.target.result;
            document.getElementById('addPhotoPreview').style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('editUserPhoto').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            document.getElementById('editPhotoPreview').src = event.target.result;
            document.getElementById('editPhotoPreview').style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

// Agregar nuevo usuario
document.getElementById('saveUserBtn').addEventListener('click', function() {
    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    const type = document.getElementById('userType').value;
    const registrationDate = document.getElementById('userRegistrationDate').value;
    const password = document.getElementById('userPassword').value;
    const photoFile = document.getElementById('userPhoto').files[0];
    
    if (!name || !email || !type || !registrationDate || !password) {
        alert('Por favor, complete todos los campos obligatorios.');
        return;
    }
    
    // Generar ID único
    const id = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    
    // Procesar foto si se ha subido
    let photoData = null;
    if (photoFile) {
        const reader = new FileReader();
        reader.onload = function(event) {
            photoData = event.target.result;
            addUserToSystem(id, name, email, type, registrationDate, photoData);
        };
        reader.readAsDataURL(photoFile);
    } else {
        addUserToSystem(id, name, email, type, registrationDate, photoData);
    }
});

function addUserToSystem(id, name, email, type, registrationDate, photoData) {
    const newUser = {
        id,
        name,
        email,
        type,
        registrationDate,
        photo: photoData
    };
    
    users.push(newUser);
    saveUsers();
    renderUsers();
    
    alert('Usuario agregado exitosamente');
    document.getElementById('addUserModal').querySelector('.btn-close').click();
    document.getElementById('addUserForm').reset();
    document.getElementById('addPhotoPreview').style.display = 'none';
}

// Editar usuario
document.addEventListener('click', function(e) {
    if (e.target.closest('.edit-user')) {
        const userId = parseInt(e.target.closest('.edit-user').getAttribute('data-id'));
        const user = users.find(u => u.id === userId);
        
        if (user) {
            currentEditingUserId = userId;
            document.getElementById('editUserName').value = user.name;
            document.getElementById('editUserEmail').value = user.email;
            document.getElementById('editUserType').value = user.type;
            document.getElementById('editUserRegistrationDate').value = user.registrationDate;
            
            // Mostrar foto actual si existe
            const preview = document.getElementById('editPhotoPreview');
            if (user.photo) {
                preview.src = user.photo;
                preview.style.display = 'block';
            } else {
                preview.style.display = 'none';
            }
            
            // Abrir modal de edición
            const editModal = new bootstrap.Modal(document.getElementById('editUserModal'));
            editModal.show();
        }
    }
});

document.getElementById('updateUserBtn').addEventListener('click', function() {
    if (!currentEditingUserId) return;
    
    const name = document.getElementById('editUserName').value;
    const email = document.getElementById('editUserEmail').value;
    const type = document.getElementById('editUserType').value;
    const registrationDate = document.getElementById('editUserRegistrationDate').value;
    const photoFile = document.getElementById('editUserPhoto').files[0];
    
    if (!name || !email || !type || !registrationDate) {
        alert('Por favor, complete todos los campos obligatorios.');
        return;
    }
    
    const userIndex = users.findIndex(u => u.id === currentEditingUserId);
    if (userIndex === -1) return;
    
    // Procesar foto si se ha subido una nueva
    if (photoFile) {
        const reader = new FileReader();
        reader.onload = function(event) {
            users[userIndex].photo = event.target.result;
            updateUserInSystem(userIndex, name, email, type, registrationDate);
        };
        reader.readAsDataURL(photoFile);
    } else {
        updateUserInSystem(userIndex, name, email, type, registrationDate);
    }
});

function updateUserInSystem(userIndex, name, email, type, registrationDate) {
    users[userIndex].name = name;
    users[userIndex].email = email;
    users[userIndex].type = type;
    users[userIndex].registrationDate = registrationDate;
    
    saveUsers();
    renderUsers();
    
    alert('Usuario actualizado exitosamente');
    document.getElementById('editUserModal').querySelector('.btn-close').click();
    document.getElementById('editUserForm').reset();
    document.getElementById('editPhotoPreview').style.display = 'none';
    currentEditingUserId = null;
}

// Eliminar usuario
document.addEventListener('click', function(e) {
    if (e.target.closest('.delete-user')) {
        const userId = parseInt(e.target.closest('.delete-user').getAttribute('data-id'));
        const user = users.find(u => u.id === userId);
        
        if (user) {
            currentDeletingUserId = userId;
            document.getElementById('deleteUserName').textContent = user.name;
            
            // Abrir modal de eliminación
            const deleteModal = new bootstrap.Modal(document.getElementById('deleteUserModal'));
            deleteModal.show();
        }
    }
});

document.getElementById('confirmDeleteBtn').addEventListener('click', function() {
    if (!currentDeletingUserId) return;
    
    const userIndex = users.findIndex(u => u.id === currentDeletingUserId);
    if (userIndex === -1) return;
    
    users.splice(userIndex, 1);
    saveUsers();
    renderUsers();
    
    alert('Usuario eliminado exitosamente');
    document.getElementById('deleteUserModal').querySelector('.btn-close').click();
    currentDeletingUserId = null;
});

// Initialize chart for Inicio section
const userGrowthCtxInicio = document.getElementById('userGrowthChartInicio').getContext('2d');
new Chart(userGrowthCtxInicio, {
    type: 'line',
    data: {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        datasets: [{
            label: 'Usuarios Registrados',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            borderColor: '#0ea46f',
            backgroundColor: 'rgba(14, 164, 111, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0,0,0,0.05)'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    }
});

// Charts initialization 
let chartsInitialized = false;

function initializeCharts() {
    if (chartsInitialized) return;
    
    // User Growth Chart
    const userGrowthCtx = document.getElementById('userGrowthChart').getContext('2d');
    new Chart(userGrowthCtx, {
        type: 'line',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            datasets: [{
                label: 'Usuarios Registrados',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                borderColor: '#0ea46f',
                backgroundColor: 'rgba(14, 164, 111, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0,0,0,0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });

    // Expenses Chart
    const expensesCtx = document.getElementById('expensesChart').getContext('2d');
    new Chart(expensesCtx, {
        type: 'doughnut',
        data: {
            labels: ['Alimentación', 'Transporte', 'Entretenimiento', 'Servicios', 'Salud', 'Otros'],
            datasets: [{
                data: [0, 0, 0, 0, 0, 0],
                backgroundColor: [
                    '#0ea46f',
                    '#06a3ff',
                    '#8e44ad',
                    '#ff6b6b',
                    '#f39c12',
                    '#95a5a6'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });

    // Income vs Expenses Chart
    const incomeExpensesCtx = document.getElementById('incomeExpensesChart').getContext('2d');
    new Chart(incomeExpensesCtx, {
        type: 'bar',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Ingresos',
                    data: [0, 0, 0, 0, 0, 0],
                    backgroundColor: '#0ea46f'
                },
                {
                    label: 'Gastos',
                    data: [0, 0, 0, 0, 0, 0],
                    backgroundColor: '#ff6b6b'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0,0,0,0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });

    // Transaction Trends Chart
    const transactionTrendsCtx = document.getElementById('transactionTrendsChart').getContext('2d');
    new Chart(transactionTrendsCtx, {
        type: 'bar',
        data: {
            labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
            datasets: [{
                label: 'Transacciones',
                data: [0, 0, 0, 0, 0, 0, 0],
                backgroundColor: '#06a3ff',
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0,0,0,0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });

    chartsInitialized = true;
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    initializeUsers();
    
    // Establecer fecha actual como valor por defecto en el formulario de agregar usuario
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('userRegistrationDate').value = today;
});