class Producto {
    constructor(nombre, lote, cantidad, fechaVencimiento, precio, precioOriginal = null, descuento = null, id = null) {
        this.id = id; // id será null si no se proporciona
        this.nombre = nombre;
        this.lote = lote;
        this.cantidad = cantidad;
        this.fechaVencimiento = fechaVencimiento;
        this.precio = precio;
        this.precioOriginal = precioOriginal;
        this.descuento = descuento;
    }

}

module.exports = Producto;

