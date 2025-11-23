// Variables para gráficas
let userGrowthChartReportes = null;
let subscriptionDistributionChart = null;
let subscriptionIncomeChart = null;

document.addEventListener('DOMContentLoaded', function() {
    initializeReportes();
});

function initializeReportes() {
    loadSubscriptionStats();
    initializeChartsReportes();
    updateNotificationsDropdown();
    
    // Event listener para aplicar filtros
    document.getElementById('applyReportFilters').addEventListener('click', function() {
        loadSubscriptionStats();
        updateReportCharts();
    });

    // Event listener para exportar Excel
    document.getElementById('exportExcelBtn').addEventListener('click', function() {
        exportReportToExcel();
    });
}

function loadSubscriptionStats() {
    // Precios de suscripción
    const PRICES = {
        'Mensual': 3.69,
        'Anual': 18.99,
        'De por vida': 49.99
    };
    
    // Calcular ingresos basados en usuarios reales
    let monthlyIncome = 0;
    let annualIncome = 0;
    let lifetimeIncome = 0;
    
    users.forEach(user => {
        const price = PRICES[user.subscriptionType];
        if (price) {
            switch (user.subscriptionType) {
                case 'Mensual':
                    monthlyIncome += price;
                    break;
                case 'Anual':
                    annualIncome += price;
                    break;
                case 'De por vida':
                    lifetimeIncome += price;
                    break;
            }
        }
    });
    
    const totalIncome = monthlyIncome + annualIncome + lifetimeIncome;
    
    // Actualizar la interfaz
    document.getElementById('totalIncome').textContent = `S/. ${totalIncome.toFixed(2)}`;
    document.getElementById('monthlyIncome').textContent = `S/. ${monthlyIncome.toFixed(2)}`;
    document.getElementById('annualIncome').textContent = `S/. ${annualIncome.toFixed(2)}`;
    document.getElementById('lifetimeIncome').textContent = `S/. ${lifetimeIncome.toFixed(2)}`;
}

function initializeChartsReportes() {
    // Gráfica para Reportes
    const userGrowthCtxReportes = document.getElementById('userGrowthChartReportes');
    if (userGrowthCtxReportes) {
        userGrowthChartReportes = new Chart(userGrowthCtxReportes.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                datasets: [{
                    label: 'Usuarios Registrados',
                    data: generateUserGrowthData(),
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
    }

    // Gráfica de distribución de suscriptores
    const subscriptionCtx = document.getElementById('subscriptionDistributionChart');
    if (subscriptionCtx) {
        subscriptionDistributionChart = new Chart(subscriptionCtx.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Sin suscripción', 'Mensual', 'Anual', 'De por vida'],
                datasets: [{
                    data: [
                        users.filter(u => u.subscriptionType === 'Sin suscripción').length,
                        users.filter(u => u.subscriptionType === 'Mensual').length,
                        users.filter(u => u.subscriptionType === 'Anual').length,
                        users.filter(u => u.subscriptionType === 'De por vida').length
                    ],
                    backgroundColor: ['#6c757d', '#0ea46f', '#ffc107', '#06a3ff'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Gráfica de ingresos por suscripción
    const incomeCtx = document.getElementById('subscriptionIncomeChart');
    if (incomeCtx) {
        subscriptionIncomeChart = new Chart(incomeCtx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Junio', 'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre'],
                datasets: [
                    {
                        label: 'Mensual',
                        data: [1200, 1900, 1500, 1800, 2200, 2500],
                        backgroundColor: '#0ea46f'
                    },
                    {
                        label: 'Anual',
                        data: [1800, 2200, 1900, 2100, 2400, 2800],
                        backgroundColor: '#ffc107'
                    },
                    {
                        label: 'De por vida',
                        data: [200, 300, 250, 400, 350, 500],
                        backgroundColor: '#06a3ff'
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
                        },
                        ticks: {
                            callback: function(value) {
                                return 'S/.' + value;
                            }
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
    }
}

function updateReportCharts() {
    // Contar usuarios por tipo de suscripción
    const subscriptionCounts = {
        'Sin suscripción': users.filter(u => u.subscriptionType === 'Sin suscripción').length,
        'Mensual': users.filter(u => u.subscriptionType === 'Mensual').length,
        'Anual': users.filter(u => u.subscriptionType === 'Anual').length,
        'De por vida': users.filter(u => u.subscriptionType === 'De por vida').length
    };
    
    // Actualizar gráfica de distribución de suscriptores
    if (subscriptionDistributionChart) {
        subscriptionDistributionChart.data.datasets[0].data = [
            subscriptionCounts['Sin suscripción'],
            subscriptionCounts['Mensual'],
            subscriptionCounts['Anual'],
            subscriptionCounts['De por vida']
        ];
        subscriptionDistributionChart.update();
    }
    
    // Actualizar gráfica de crecimiento de usuarios
    if (userGrowthChartReportes) {
        const userGrowthData = generateUserGrowthData();
        userGrowthChartReportes.data.datasets[0].data = userGrowthData;
        userGrowthChartReportes.update();
    }
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

function exportReportToExcel() {
    // Crear datos para exportación
    let csv = 'Reporte Financiero - FinLi\n\n';
    csv += 'Estadísticas de Ingresos\n';
    csv += 'Concepto,Monto\n';
    csv += `Ingresos Totales,S/. ${document.getElementById('totalIncome').textContent.replace('S/. ', '')}\n`;
    csv += `Suscripciones Mensuales,S/. ${document.getElementById('monthlyIncome').textContent.replace('S/. ', '')}\n`;
    csv += `Suscripciones Anuales,S/. ${document.getElementById('annualIncome').textContent.replace('S/. ', '')}\n`;
    csv += `Suscripciones Vitalicias,S/. ${document.getElementById('lifetimeIncome').textContent.replace('S/. ', '')}\n\n`;
    
    csv += 'Distribución de Usuarios\n';
    csv += 'Tipo de Suscripción,Cantidad,Porcentaje\n';
    
    const totalUsers = users.length;
    const subscriptionTypes = ['Sin suscripción', 'Mensual', 'Anual', 'De por vida'];
    
    subscriptionTypes.forEach(type => {
        const count = users.filter(u => u.subscriptionType === type).length;
        const percentage = totalUsers > 0 ? ((count / totalUsers) * 100).toFixed(2) : '0.00';
        csv += `"${type}",${count},${percentage}%\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'reporte_financiero_finli.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    showNotification('Reporte exportado exitosamente', 'success');
}