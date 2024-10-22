class Producto {
    constructor(nombre,lote,cantidad,fechaVencimiento, precio) {
        this.nombre = nombre;
        this.lote = lote;
        this.cantidad = cantidad; 
        this.fechaVencimiento = fechaVencimiento;
        this.precio = precio
    }
     constructor(id, nombre, lote, fechaVencimiento, cantidad, precio) {
        this.id = id;
        this.nombre = nombre;
        this.lote = lote;
        this.fechaVencimiento = fechaVencimiento;
        this.cantidad = cantidad;
        this.precio = precio;
    }
  }
  
  module.exports = Producto;
  
