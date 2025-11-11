import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Activity, CreditCard, TrendingUp, Search, Bell, LogOut, Home, Settings, FileText, Clock, Plus, Edit2, Trash2, Eye, X, Check, Filter, Download } from 'lucide-react';
import './admin.css';

// ==============================================================================
// === CONFIGURACIÓN DE LA API ===
// ==============================================================================
const API_URL_BASE = 'http://localhost:8080';
const ENDPOINT_USUARIOS = '/api/admin/usuarios';
const ENDPOINT_ESTADOS = '/api/admin/estados-usuario';
const ENDPOINT_EXPORTAR = '/api/admin/usuarios/exportar';

const ROWS_PER_PAGE = 10;
const COLORS = ['#6c757d', '#0ea46f', '#ffc107', '#06a3ff'];

// ==============================================================================
// === COMPONENTE PRINCIPAL ===
// ==============================================================================
export default function AdminPanel() {
    const [activeSection, setActiveSection] = useState('inicio');
    const [users, setUsers] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('all');
    const [estados, setEstados] = useState([]);
    const [loading, setLoading] = useState(false);

    // Modales
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [showEditUserModal, setShowEditUserModal] = useState(false);
    const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [deletingUser, setDeletingUser] = useState(null);

    // Cargar usuarios
    const loadUsers = async (page = 1, status = 'all') => {
        setLoading(true);
        try {
            const url = new URL(API_URL_BASE + ENDPOINT_USUARIOS);
            url.searchParams.append('page', page);
            url.searchParams.append('limit', ROWS_PER_PAGE);
            url.searchParams.append('status', status);

            const response = await fetch(url.toString());
            if (!response.ok) throw new Error(`Error HTTP ${response.status}`);

            const data = await response.json();
            setUsers(data.users || []);
            setTotalUsers(data.totalCount || 0);
            setCurrentPage(page);
            setStatusFilter(status);
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
            alert('Error al cargar los datos del servidor');
        } finally {
            setLoading(false);
        }
    };

    // Cargar estados
    const loadEstados = async () => {
        try {
            const response = await fetch(API_URL_BASE + ENDPOINT_ESTADOS);
            if (!response.ok) throw new Error('Error al cargar estados');
            const data = await response.json();
            setEstados(data);
        } catch (error) {
            console.error('Error al cargar estados:', error);
        }
    };

    // Exportar a Excel
    const handleExportExcel = async () => {
        try {
            const response = await fetch(API_URL_BASE + ENDPOINT_EXPORTAR);
            if (!response.ok) throw new Error('Error al generar Excel');

            const blob = await response.blob();
            const disposition = response.headers.get('Content-Disposition');
            let filename = 'usuarios_finli.xlsx';

            if (disposition && disposition.indexOf('attachment') !== -1) {
                const filenameRegex = /filename="?(.+?)"?$/;
                const matches = filenameRegex.exec(disposition);
                if (matches != null && matches[1]) {
                    filename = matches[1].replace(/['"]/g, '');
                }
            }

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            alert(`✅ Archivo '${filename}' descargado correctamente.`);
        } catch (error) {
            console.error('Error al exportar:', error);
            alert('❌ Error al exportar los datos a Excel');
        }
    };

    // Crear usuario
    const handleCreateUser = async (userData) => {
        try {
            const response = await fetch(API_URL_BASE + ENDPOINT_USUARIOS, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (response.status === 201) {
                alert(`✅ Cliente ${data.nombre} agregado con ID: ${data.id}`);
                setShowAddUserModal(false);
                loadUsers(1, statusFilter);
            } else {
                alert(`❌ Error al crear cliente: ${data.message || 'Error desconocido'}`);
            }
        } catch (error) {
            console.error('Error al crear usuario:', error);
            alert('❌ Error de conexión con el servidor');
        }
    };

    // Actualizar usuario
    const handleUpdateUser = async (userId, userData) => {
        try {
            const response = await fetch(`${API_URL_BASE}${ENDPOINT_USUARIOS}/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            if (response.status === 200) {
                alert(`✅ Usuario ID ${userId} actualizado correctamente`);
                setShowEditUserModal(false);
                setEditingUser(null);
                loadUsers(currentPage, statusFilter);
            } else {
                alert('❌ Error al actualizar usuario');
            }
        } catch (error) {
            console.error('Error al actualizar:', error);
            alert('❌ Error de conexión con el servidor');
        }
    };

    // Eliminar usuario
    const handleDeleteUser = async (userId) => {
        try {
            const response = await fetch(`${API_URL_BASE}${ENDPOINT_USUARIOS}/${userId}`, {
                method: 'DELETE'
            });

            if (response.status === 204) {
                alert(`✅ Usuario ID ${userId} eliminado lógicamente`);
                setShowDeleteUserModal(false);
                setDeletingUser(null);
                loadUsers(currentPage, statusFilter);
            } else {
                alert('❌ Error al eliminar usuario');
            }
        } catch (error) {
            console.error('Error al eliminar:', error);
            alert('❌ Error de conexión con el servidor');
        }
    };

    // Efectos
    useEffect(() => {
        loadUsers();
        loadEstados();
    }, []);

    // Calcular paginación
    const totalPages = Math.ceil(totalUsers / ROWS_PER_PAGE);
    const subscribedUsers = users.filter(u =>
        u.estadoUsuario?.nombreEstado?.includes('Premium')
    ).length;

    return (
        <div className="admin-container">
            <div className="app-shell">
                {/* SIDEBAR */}
                <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />

                {/* MAIN CONTENT */}
                <main className="main-content">
                    <Header totalUsers={totalUsers} onExport={handleExportExcel} />

                    {/* INICIO SECTION */}
                    {activeSection === 'inicio' && (
                        <InicioSection
                            totalUsers={totalUsers}
                            subscribedUsers={subscribedUsers}
                            recentUsers={users.slice(0, 4)}
                            onAddUser={() => setShowAddUserModal(true)}
                            onEditUser={(user) => {
                                setEditingUser(user);
                                setShowEditUserModal(true);
                            }}
                            onDeleteUser={(user) => {
                                setDeletingUser(user);
                                setShowDeleteUserModal(true);
                            }}
                        />
                    )}

                    {/* USUARIOS SECTION */}
                    {activeSection === 'usuarios' && (
                        <UsuariosSection
                            users={users}
                            loading={loading}
                            totalUsers={totalUsers}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            statusFilter={statusFilter}
                            onPageChange={(page) => loadUsers(page, statusFilter)}
                            onStatusChange={(status) => loadUsers(1, status)}
                            onAddUser={() => setShowAddUserModal(true)}
                            onEditUser={(user) => {
                                setEditingUser(user);
                                setShowEditUserModal(true);
                            }}
                            onDeleteUser={(user) => {
                                setDeletingUser(user);
                                setShowDeleteUserModal(true);
                            }}
                            onExport={handleExportExcel}
                        />
                    )}

                    {/* REPORTES SECTION */}
                    {activeSection === 'reportes' && (
                        <ReportesSection users={users} />
                    )}
                </main>
            </div>

            {/* MODALES */}
            {showAddUserModal && (
                <UserModal
                    estados={estados}
                    onClose={() => setShowAddUserModal(false)}
                    onSave={handleCreateUser}
                />
            )}

            {showEditUserModal && editingUser && (
                <UserModal
                    user={editingUser}
                    estados={estados}
                    onClose={() => {
                        setShowEditUserModal(false);
                        setEditingUser(null);
                    }}
                    onSave={(userData) => handleUpdateUser(editingUser.id, userData)}
                />
            )}

            {showDeleteUserModal && deletingUser && (
                <DeleteUserModal
                    userName={`${deletingUser.nombre} ${deletingUser.apellidoPaterno}`}
                    onClose={() => {
                        setShowDeleteUserModal(false);
                        setDeletingUser(null);
                    }}
                    onConfirm={() => handleDeleteUser(deletingUser.id)}
                />
            )}
        </div>
    );
}

// ==============================================================================
// === COMPONENTES ===
// ==============================================================================

function Sidebar({ activeSection, onSectionChange }) {
    const navItems = [
        { id: 'inicio', icon: Home, label: 'Inicio' },
        { id: 'usuarios', icon: Users, label: 'Usuarios' },
        { id: 'apartados', icon: Settings, label: 'Apartados' },
        { id: 'reportes', icon: FileText, label: 'Reportes' },
        { id: 'actividades', icon: Clock, label: 'Actividades' }
    ];

    return (
        <aside className="sidebar fade-in">
            <div className="brand">
                <div className="brand-logo">F</div>
                <div>
                    <h3>FinLi</h3>
                    <div className="brand-subtitle">Panel administrativo</div>
                </div>
            </div>

            <nav className="nav-menu">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => onSectionChange(item.id)}
                        className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>

            <button className="btn-logout">
                <LogOut size={20} />
                <span>Cerrar sesión</span>
            </button>

            <div className="sidebar-footer">
                <div>FinLi © {new Date().getFullYear()}</div>
                <div>Versión 1.0</div>
            </div>
        </aside>
    );
}

function Header({ totalUsers, onExport }) {
    return (
        <header className="topbar">
            <div>
                <h2 className="page-title">
                    Bienvenido, <span className="text-gradient">Administrador</span>
                </h2>
                <p className="page-subtitle">Panel de control</p>
            </div>

            <div className="header-actions">
                <button className="btn-icon">
                    <Bell size={20} />
                </button>

                <div className="user-info">
                    <div className="avatar-sm">A</div>
                    <div className="user-details">
                        <div className="user-name">Administrador</div>
                        <div className="user-email">admin@finli.com</div>
                    </div>
                </div>
            </div>
        </header>
    );
}

function InicioSection({ totalUsers, subscribedUsers, recentUsers, onAddUser, onEditUser, onDeleteUser }) {
    return (
        <div className="content-section-wrapper">
            {/* Stats */}
            <div className="stats-grid">
                <StatCard
                    icon={Users}
                    value={totalUsers}
                    label="Total de usuarios"
                    color="green"
                />
                <StatCard
                    icon={Activity}
                    value="0"
                    label="Transacciones (último mes)"
                    color="blue"
                />
                <StatCard
                    icon={CreditCard}
                    value={subscribedUsers}
                    label="Usuarios suscritos"
                    color="yellow"
                />
            </div>

            {/* Recent Users */}
            <div className="table-card fade-in">
                <div className="card-header">
                    <div>
                        <h5>Últimos usuarios registrados</h5>
                        <small className="muted">Listado rápido de usuarios recientes</small>
                    </div>
                    <button className="btn btn-success" onClick={onAddUser}>
                        <Plus size={16} />
                        Agregar Usuario
                    </button>
                </div>
                <UserTable
                    users={recentUsers}
                    onEdit={onEditUser}
                    onDelete={onDeleteUser}
                />
            </div>
        </div>
    );
}

function UsuariosSection({
    users, loading, totalUsers, currentPage, totalPages, statusFilter,
    onPageChange, onStatusChange, onAddUser, onEditUser, onDeleteUser, onExport
}) {
    const start = (currentPage - 1) * ROWS_PER_PAGE + 1;
    const end = Math.min(currentPage * ROWS_PER_PAGE, totalUsers);

    return (
        <div className="content-section-wrapper">
            {/* Filtros */}
            <div className="search-filter-container fade-in">
                <div className="filter-row">
                    <select
                        className="form-select"
                        value={statusFilter}
                        onChange={(e) => onStatusChange(e.target.value)}
                    >
                        <option value="all">Todos los estados</option>
                        <option value="active">Activos</option>
                        <option value="inactive">Inactivos</option>
                    </select>
                </div>
            </div>

            {/* Tabla */}
            <div className="table-card">
                <div className="card-header">
                    <div>
                        <h5>Lista de Usuarios</h5>
                        <small className="muted">Total: {totalUsers.toLocaleString()} usuarios registrados</small>
                    </div>
                    <div className="button-group">
                        <button className="btn btn-info" onClick={onAddUser}>
                            <Plus size={16} />
                            Agregar Usuario
                        </button>
                        <button className="btn btn-success" onClick={onExport}>
                            <Download size={16} />
                            Exportar Excel
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="loading-state">Cargando usuarios...</div>
                ) : (
                    <>
                        <UserTable
                            users={users}
                            onEdit={onEditUser}
                            onDelete={onDeleteUser}
                        />

                        <div className="table-footer">
                            <div className="muted">
                                Mostrando {totalUsers === 0 ? '0' : `${start} - ${end}`} de {totalUsers.toLocaleString()} usuarios
                            </div>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={onPageChange}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

function ReportesSection({ users }) {
    const subscriptionData = [
        { name: 'Sin Premium', value: users.filter(u => !u.estadoUsuario?.nombreEstado?.includes('Premium')).length },
        { name: 'Premium', value: users.filter(u => u.estadoUsuario?.nombreEstado?.includes('Premium')).length }
    ];

    const monthlyData = [
        { month: 'Ene', users: 5 },
        { month: 'Feb', users: 10 },
        { month: 'Mar', users: 15 },
        { month: 'Abr', users: 22 },
        { month: 'May', users: 30 },
        { month: 'Jun', users: 35 }
    ];

    return (
        <div className="content-section-wrapper">
            <div className="charts-grid">
                <div className="chart-card">
                    <h5>Distribución de Usuarios</h5>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={subscriptionData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {subscriptionData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-card">
                    <h5>Crecimiento Mensual</h5>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="users" fill="#0ea46f" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon: Icon, value, label, color }) {
    return (
        <div className={`card-stat ${color} fade-in`}>
            <div className="stat-content">
                <div>
                    <div className="stat-value">{value}</div>
                    <div className="stat-label">{label}</div>
                </div>
                <div className="stat-icon">
                    <Icon size={24} />
                </div>
            </div>
        </div>
    );
}

function UserTable({ users, onEdit, onDelete }) {
    const getInitials = (user) => {
        const nombre = user.nombre || '';
        const apellido = user.apellidoPaterno || '';
        return (nombre[0] || '') + (apellido[0] || '');
    };

    return (
        <div className="table-responsive">
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Avatar</th>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Estado</th>
                        <th>Registro</th>
                        <th className="text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="text-center text-muted">
                                No se encontraron usuarios
                            </td>
                        </tr>
                    ) : (
                        users.map(user => (
                            <tr key={user.id}>
                                <td>
                                    <span className="badge bg-light text-dark">{user.id}</span>
                                </td>
                                <td>
                                    <div className="avatar-sm">
                                        {getInitials(user)}
                                    </div>
                                </td>
                                <td>
                                    <div className="user-name-cell">
                                        {`${user.nombre} ${user.apellidoPaterno} ${user.apellidoMaterno || ''}`.trim()}
                                    </div>
                                </td>
                                <td>{user.correo}</td>
                                <td>
                                    <span className={`badge ${user.estadoUsuario?.nombreEstado?.includes('Premium') ? 'bg-warning' : 'bg-light'} text-dark`}>
                                        {user.estadoUsuario?.nombreEstado || 'N/A'}
                                    </span>
                                </td>
                                <td>
                                    {user.fechaRegistro ? new Date(user.fechaRegistro).toLocaleDateString() : 'N/A'}
                                </td>
                                <td className="text-center">
                                    <div className="table-actions">
                                        <button
                                            className="table-action-btn edit"
                                            onClick={() => onEdit(user)}
                                            title="Editar"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            className="table-action-btn delete"
                                            onClick={() => onDelete(user)}
                                            title="Eliminar"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    const pages = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) {
        endPage = Math.min(5, totalPages);
        startPage = 1;
    } else if (currentPage > totalPages - 2) {
        startPage = Math.max(1, totalPages - 4);
        endPage = totalPages;
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return (
        <nav>
            <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => onPageChange(currentPage - 1)}>
                        Anterior
                    </button>
                </li>
                {pages.map(page => (
                    <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => onPageChange(page)}>
                            {page}
                        </button>
                    </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => onPageChange(currentPage + 1)}>
                        Siguiente
                    </button>
                </li>
            </ul>
        </nav>
    );
}

function UserModal({ user, estados, onClose, onSave }) {
    const [formData, setFormData] = useState({
        nombre: user?.nombre || '',
        apellidoPaterno: user?.apellidoPaterno || '',
        apellidoMaterno: user?.apellidoMaterno || '',
        correo: user?.correo || '',
        contrasena: '',
        edad: user?.edad || '',
        estadoUsuarioId: user?.estadoUsuario?.idEstado || ''
    });

    const handleSubmit = () => {
        const userData = {
            nombre: formData.nombre,
            apellidoPaterno: formData.apellidoPaterno,
            apellidoMaterno: formData.apellidoMaterno,
            correo: formData.correo,
            edad: parseInt(formData.edad, 10),
            estadoUsuario: { idEstado: parseInt(formData.estadoUsuarioId, 10) }
        };

        if (!user && formData.contrasena) {
            userData.contrasena = formData.contrasena;
        }

        onSave(userData);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h5>{user ? 'Editar Usuario' : 'Agregar Usuario'}</h5>
                    <button className="btn-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div>
                    <div className="modal-body">
                        <div className="form-group">
                            <label>Nombre</label>
                            <input
                                type="text"
                                className="form-control"
                                value={formData.nombre}
                                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Apellido Paterno</label>
                            <input
                                type="text"
                                className="form-control"
                                value={formData.apellidoPaterno}
                                onChange={(e) => setFormData({ ...formData, apellidoPaterno: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Apellido Materno</label>
                            <input
                                type="text"
                                className="form-control"
                                value={formData.apellidoMaterno}
                                onChange={(e) => setFormData({ ...formData, apellidoMaterno: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Correo</label>
                            <input
                                type="email"
                                className="form-control"
                                value={formData.correo}
                                onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                                required
                            />
                        </div>

                        {!user && (
                            <div className="form-group">
                                <label>Contraseña</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={formData.contrasena}
                                    onChange={(e) => setFormData({ ...formData, contrasena: e.target.value })}
                                    required={!user}
                                />
                            </div>
                        )}

                        <div className="form-group">
                            <label>Edad</label>
                            <input
                                type="number"
                                className="form-control"
                                value={formData.edad}
                                onChange={(e) => setFormData({ ...formData, edad: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Estado</label>
                            <select
                                className="form-control"
                                value={formData.estadoUsuarioId}
                                onChange={(e) => setFormData({ ...formData, estadoUsuarioId: e.target.value })}
                                required
                            >
                                <option value="">-- Seleccione un Estado --</option>
                                {estados.map(estado => (
                                    <option key={estado.idEstado} value={estado.idEstado}>
                                        {estado.nombreEstado}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-success">
                            {user ? 'Actualizar' : 'Guardar'}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

function DeleteUserModal({ userName, onClose, onConfirm }) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h5>Eliminar Usuario</h5>
                    <button className="btn-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    <p>¿Estás seguro de que deseas eliminar al usuario <strong>{userName}</strong>?</p>
                    <p className="text-muted">Esta acción marcará al usuario como inactivo.</p>
                </div>

                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>
                        Cancelar
                    </button>
                    <button className="btn btn-danger" onClick={onConfirm}>
                        Eliminar Usuario
                    </button>
                </div>
            </div>
        </div>
    );
}