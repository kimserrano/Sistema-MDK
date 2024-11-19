CREATE DATABASE IF NOT EXISTS farmacia;
USE farmacia;

-- Tabla para Cajeros con Usuario y Contraseña en BLOB
CREATE TABLE Cajero (
    Usuario VARCHAR(100) PRIMARY KEY,  -- Usuario como clave primaria
    Contra BLOB NOT NULL  -- Contraseña almacenada en BLOB para mayor seguridad
);

-- Tabla para Administradores con Usuario y Contraseña en BLOB
CREATE TABLE Administrador (
    Usuario VARCHAR(100) PRIMARY KEY,  -- Usuario como clave primaria
    Contra BLOB NOT NULL  -- Contraseña almacenada en BLOB para mayor seguridad
);

-- Tabla para Clientes
CREATE TABLE Cliente (
    Telefono VARCHAR(15) PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL    
);

-- Tabla para Productos
CREATE TABLE Producto (
    id INT PRIMARY KEY AUTO_INCREMENT,
    Nombre VARCHAR(100) UNIQUE,
    Lote VARCHAR(50),
    FechaVencimiento DATE,
    Cantidad INT,
    Precio FLOAT,
    PrecioOriginal FLOAT,
    Descuento INT
);

-- Tabla para Ventas
CREATE TABLE Venta (
    IdVenta INT AUTO_INCREMENT PRIMARY KEY,
    Fecha DATE NOT NULL,
    Total DECIMAL(20, 2) NOT NULL,
    UsuarioCajero VARCHAR(100),  -- Cambiado de INT a VARCHAR(100) para coincidir con Cajero.Usuario
    Telefono VARCHAR(15),  -- Cambiado de INT a VARCHAR(15) para coincidir con la tabla Cliente
    FOREIGN KEY (UsuarioCajero) REFERENCES Cajero(Usuario) ON DELETE SET NULL,  -- Relacionado con el usuario del cajero
    FOREIGN KEY (Telefono) REFERENCES Cliente(Telefono) ON DELETE CASCADE  -- Relacionado con el teléfono del cliente
);

-- Tabla intermedia para relación N:M entre Ventas y Productos
CREATE TABLE VentaProducto (
    IdVenta INT,
    Nombre VARCHAR(100),  -- Cambiado de INT a VARCHAR(100) para coincidir con la tabla Producto
    Cantidad INT NOT NULL,
    PRIMARY KEY (IdVenta, Nombre),
    FOREIGN KEY (IdVenta) REFERENCES Venta(IdVenta) ON DELETE CASCADE,
    FOREIGN KEY (Nombre) REFERENCES Producto(Nombre) ON DELETE CASCADE
);
