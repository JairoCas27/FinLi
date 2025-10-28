-- Crear tablas manualmente para H2
CREATE TABLE IF NOT EXISTS EstadoUsuario (
    id_estado INT AUTO_INCREMENT PRIMARY KEY,
    nombre_estado VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS Usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    correo VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    apellido_Paterno VARCHAR(50) NOT NULL,
    apellido_Materno VARCHAR(50) NOT NULL,
    edad INT NOT NULL,
    id_estadoUsuario INT NOT NULL,
    FOREIGN KEY (id_estadoUsuario) REFERENCES EstadoUsuario(id_estado)
);

CREATE TABLE IF NOT EXISTS password_reset_token (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(64) NOT NULL UNIQUE,
    usuario_id INT NOT NULL,
    expiry_date TIMESTAMP NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(id)
);

CREATE TABLE IF NOT EXISTS FuenteCategoria (
    id_fuente INT AUTO_INCREMENT PRIMARY KEY,
    nombre_fuente VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS Categorias (
    idCategoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(255) NOT NULL,
    id_fuente INT NOT NULL,
    id_usuario INT,
    FOREIGN KEY (id_fuente) REFERENCES FuenteCategoria(id_fuente),
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id)
);

CREATE TABLE IF NOT EXISTS Subcategorias (
    idSubcategoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre_subcategoria VARCHAR(255) NOT NULL,
    id_categoria INT NOT NULL,
    id_usuario INT,
    FOREIGN KEY (id_categoria) REFERENCES Categorias(idCategoria),
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id)
);

CREATE TABLE IF NOT EXISTS MedioPago (
    idMedioPago INT AUTO_INCREMENT PRIMARY KEY,
    nombre_medioPago VARCHAR(100) NOT NULL,
    monto_inicial DOUBLE NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL,
    id_usuario INT,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id)
);

CREATE TABLE IF NOT EXISTS Transacciones (
    idTransaccion INT AUTO_INCREMENT PRIMARY KEY,
    nombre_transaccion VARCHAR(100) NOT NULL,
    tipo VARCHAR(10) NOT NULL,
    monto DOUBLE NOT NULL,
    fecha TIMESTAMP NOT NULL,
    descripcion_transaccion VARCHAR(100),
    imagen LONGTEXT,
    id_usuario INT NOT NULL,
    id_medioPago INT NOT NULL,
    id_categoria INT NOT NULL,
    id_subcategoria INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id),
    FOREIGN KEY (id_medioPago) REFERENCES MedioPago(idMedioPago),
    FOREIGN KEY (id_categoria) REFERENCES Categorias(idCategoria),
    FOREIGN KEY (id_subcategoria) REFERENCES Subcategorias(idSubcategoria)
);

-- Datos iniciales para pruebas
INSERT INTO EstadoUsuario (id_estado, nombre_estado) VALUES
(1, 'Activo'),
(2, 'Inactivo'),
(3, 'Pendiente');

INSERT INTO FuenteCategoria (id_fuente, nombre_fuente) VALUES
(1, 'Sistema'),
(2, 'Usuario');