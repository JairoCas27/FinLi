// Variables específicas para la página de actividades
let currentPageActivities = 1;
const activitiesPerPage = 10;

document.addEventListener('DOMContentLoaded', function() {
    initializeActividades();
});

function initializeActividades() {
    renderActivities();
    updateNotificationsDropdown();
    
    // Event listeners para filtros
    document.getElementById('activityTypeFilter').addEventListener('change', renderActivities);
    document.getElementById('activityDateFilter').addEventListener('change', renderActivities);
    document.getElementById('activitySearch').addEventListener('input', renderActivities);
    
    // Event listeners para botones de acción
    document.getElementById('markAllAsRead').addEventListener('click', markAllActivitiesAsRead);
    document.getElementById('clearActivitiesBtn').addEventListener('click', clearActivities);
    document.getElementById('exportActivitiesBtn').addEventListener('click', exportActivitiesToCSV);
}

function renderActivities() {
    const container = document.getElementById('activitiesTimeline');
    const countElement = document.getElementById('activitiesCount');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    if (activities.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-clock-history"></i>
                <div>No hay actividades registradas</div>
                <small class="text-muted">Las actividades del sistema aparecerán aquí</small>
            </div>
        `;
        countElement.textContent = 'Mostrando 0 actividades';
        return;
    }
    
    let filteredActivities = [...activities];
    const typeFilter = document.getElementById('activityTypeFilter').value;
    const dateFilter = document.getElementById('activityDateFilter').value;
    const searchFilter = document.getElementById('activitySearch').value.toLowerCase();
    
    if (typeFilter !== 'all') {
        filteredActivities = filteredActivities.filter(act => act.type === typeFilter);
    }
    
    if (dateFilter) {
        filteredActivities = filteredActivities.filter(act => 
            act.timestamp.startsWith(dateFilter)
        );
    }
    
    if (searchFilter) {
        filteredActivities = filteredActivities.filter(act => 
            act.message.toLowerCase().includes(searchFilter) ||
            (act.details.userName && act.details.userName.toLowerCase().includes(searchFilter))
        );
    }
    
    // Aplicar paginación
    const startIndex = (currentPageActivities - 1) * activitiesPerPage;
    const paginatedActivities = filteredActivities.slice(startIndex, startIndex + activitiesPerPage);
    
    paginatedActivities.forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.className = `activity-item ${activity.read ? 'read' : 'unread'}`;
        
        const date = new Date(activity.timestamp);
        const formattedDate = date.toLocaleDateString('es-ES') + ' ' + date.toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'});
        const timeAgo = getTimeAgo(activity.timestamp);
        
        activityItem.innerHTML = `
            <div class="d-flex">
                <div class="activity-icon ${activity.type}">
                    <i class="${getActivityIcon(activity.type)}"></i>
                </div>
                <div class="activity-content">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <div class="fw-medium">${activity.message}</div>
                            <div class="activity-time">${formattedDate} • ${timeAgo}</div>
                        </div>
                        <div class="d-flex align-items-center gap-2">
                            <span class="activity-badge ${getActivityBadgeClass(activity.type)}">
                                ${getActivityTypeLabel(activity.type)}
                            </span>
                            ${!activity.read ? `
                                <button class="mark-read-btn" onclick="markActivityAsRead(${activity.id})" title="Marcar como leída">
                                    <i class="bi bi-check"></i>
                                </button>
                            ` : ''}
                        </div>
                    </div>
                    ${activity.details.userName ? `<div class="mt-2"><small class="text-muted">Usuario: ${activity.details.userName}</small></div>` : ''}
                    ${activity.details.subscriptionType ? `<div><small class="text-success">Suscripción: ${activity.details.subscriptionType}</small></div>` : ''}
                    ${activity.details.version ? `<div><small class="text-info">Versión: v${activity.details.version}</small></div>` : ''}
                    ${activity.details.category ? `<div><small class="text-warning">Categoría: ${activity.details.category}</small></div>` : ''}
                </div>
            </div>
        `;
        container.appendChild(activityItem);
    });
    
    countElement.textContent = `Mostrando ${paginatedActivities.length} de ${filteredActivities.length} actividades`;
    updateActivitiesPagination(filteredActivities.length);
}

function updateActivitiesPagination(totalActivities) {
    const totalPages = Math.ceil(totalActivities / activitiesPerPage);
    const paginationContainer = document.getElementById('activitiesPagination');
    
    if (paginationContainer) {
        let paginationHTML = '';
        
        // Botón Anterior
        paginationHTML += `
            <li class="page-item ${currentPageActivities === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="changePageActivities(${currentPageActivities - 1})">Anterior</a>
            </li>
        `;
        
        // Números de página
        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `
                <li class="page-item ${currentPageActivities === i ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="changePageActivities(${i})">${i}</a>
                </li>
            `;
        }
        
        // Botón Siguiente
        paginationHTML += `
            <li class="page-item ${currentPageActivities === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="changePageActivities(${currentPageActivities + 1})">Siguiente</a>
            </li>
        `;
        
        paginationContainer.innerHTML = paginationHTML;
    }
}

function changePageActivities(page) {
    const totalPages = Math.ceil(activities.length / activitiesPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPageActivities = page;
        renderActivities();
    }
}

function markAllActivitiesAsRead() {
    activities.forEach(activity => {
        activity.read = true;
    });
    saveActivities();
    updateNotificationsDropdown();
    renderActivities();
    showNotification('Todas las actividades marcadas como leídas', 'success');
}

function markActivityAsRead(id) {
    const activity = activities.find(a => a.id === id);
    if (activity && !activity.read) {
        activity.read = true;
        saveActivities();
        updateNotificationsDropdown();
        renderActivities();
    }
}

function clearActivities() {
    if (confirm('¿Estás seguro de que deseas limpiar todo el historial de actividades? Esta acción no se puede deshacer.')) {
        activities = [];
        saveActivities();
        renderActivities();
        updateNotificationsDropdown();
        showNotification('Historial de actividades limpiado exitosamente', 'success');
    }
}

function exportActivitiesToCSV() {
    let csv = 'ID,Fecha,Hora,Tipo,Actividad,Usuario\n';
    
    activities.forEach(activity => {
        const date = new Date(activity.timestamp);
        const fecha = date.toLocaleDateString('es-ES');
        const hora = date.toLocaleTimeString('es-ES');
        const usuario = activity.details.userName || 'Sistema';
        
        csv += `"${activity.id}","${fecha}","${hora}","${getActivityTypeLabel(activity.type)}","${activity.message}","${usuario}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'actividades_finli.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    showNotification('Actividades exportadas exitosamente', 'success');
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