CREATE DATABASE IF NOT EXISTS farmacia;
USE farmacia;

-- Tabla para Cajeros
CREATE TABLE Cajero (
    IdCajero INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL
);

-- Tabla para Administradores
CREATE TABLE Administrador (
    IdAdmin INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL
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
    Precio FLOAT
);

-- Tabla para Ventas
CREATE TABLE Venta (
    IdVenta INT AUTO_INCREMENT PRIMARY KEY,
    Fecha DATE NOT NULL,
    Total DECIMAL(20, 2) NOT NULL,
    IdCajero INT,
    Telefono VARCHAR(15), -- Cambiado de INT a VARCHAR(15) para coincidir con la tabla Cliente
    FOREIGN KEY (IdCajero) REFERENCES Cajero(IdCajero) ON DELETE SET NULL, -- Si se elimina un cajero, la venta sigue con IdCajero NULL
    FOREIGN KEY (Telefono) REFERENCES Cliente(Telefono) ON DELETE CASCADE -- Si se elimina un cliente, se eliminan sus ventas
);

-- Tabla intermedia para relación N:M entre Ventas y Productos
CREATE TABLE VentaProducto (
    IdVenta INT,
    Nombre VARCHAR(100), -- Cambiado de INT a VARCHAR(100) para coincidir con la tabla Producto
    Cantidad INT NOT NULL,
    PRIMARY KEY (IdVenta, Nombre),
    FOREIGN KEY (IdVenta) REFERENCES Venta(IdVenta) ON DELETE CASCADE,
    FOREIGN KEY (Nombre) REFERENCES Producto(Nombre) ON DELETE CASCADE
);
