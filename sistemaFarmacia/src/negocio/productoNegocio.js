const ProductoDAO = require('../dao/productoDAO');
const Producto = require('../dominio/producto');

class ProductoService {
    constructor() {
        this.productoDAO = new ProductoDAO();
    }

    validarFecha(fecha) {
        const regexFecha = /^\d{4}-\d{2}-\d{2}$/;
        return regexFecha.test(fecha);
    }

    validarNumeroPositivo(valor) {
        return typeof valor === 'number' && valor > 0;
    }

    validarTexto(texto, longitudMin = 3, longitudMax = 100) {
        return typeof texto === 'string' && texto.length >= longitudMin && texto.length <= longitudMax;
    }

    async crearProducto(data) {
        const { nombre, lote, cantidad, precio, fechaVencimiento } = data;
        console.log(typeof cantidad)
        if (!this.validarTexto(nombre, 3, 50)) {
            throw new Error('El nombre del producto es inválido (entre 3 y 50 caracteres).');
        }
        if (!this.validarTexto(lote, 3, 30)) {
            throw new Error('El lote es inválido (entre 3 y 30 caracteres).');
        }
        if (!this.validarNumeroPositivo(cantidad)) {
            throw new Error('La cantidad debe ser un número positivo.');
        }
        if (!this.validarNumeroPositivo(precio)) {
            throw new Error('El precio debe ser un número positivo.');
        }
        if (!this.validarFecha(fechaVencimiento)) {
            throw new Error('La fecha de vencimiento es inválida. Debe tener el formato YYYY-MM-DD.');
        }

        const nuevoProducto = new Producto(nombre, lote, cantidad, fechaVencimiento, precio);

        try {
            const resultado = await this.productoDAO.crearProducto(nuevoProducto);
            return resultado;
        } catch (error) {
            throw new Error('Error al crear el producto');
        }
    }

    async obtenerProductoPorId(id) {
        if (!id || !this.validarNumeroPositivo(id)) {
            throw new Error('ID de producto inválido.');
        }

        try {
            const producto = await this.productoDAO.obtenerProductoPorId(id);
            return producto;
        } catch (error) {
            throw new Error('Error al obtener el producto: ' + error.message);
        }
    }

    async actualizarProducto(id, data) {
        const { nombre, lote, cantidad, fechaVencimiento, precio } = data;

        if (!id || !this.validarNumeroPositivo(id)) {
            throw new Error('ID de producto inválido.');
        }
        if (!this.validarTexto(nombre, 3, 50)) {
            throw new Error('El nombre del producto es inválido (entre 3 y 50 caracteres).');
        }
        if (!this.validarTexto(lote, 3, 30)) {
            throw new Error('El lote es inválido (entre 3 y 30 caracteres).');
        }
        if (!this.validarNumeroPositivo(cantidad)) {
            throw new Error('La cantidad debe ser un número positivo.');
        }
        if (!this.validarFecha(fechaVencimiento)) {
            throw new Error('La fecha de vencimiento es inválida. Debe tener el formato YYYY-MM-DD.');
        }
        if (!this.validarNumeroPositivo(precio)) {
            throw new Error('El precio debe ser un número positivo.');
        }

        const productoActualizado = new Producto(nombre, lote, cantidad, fechaVencimiento, precio);

        try {
            const resultado = await this.productoDAO.actualizarProducto(id, productoActualizado);
            return resultado;
        } catch (error) {
            throw new Error('Error al actualizar el producto: ' + error.message);
        }
    }

    async eliminarProducto(id) {
        if (!id || !this.validarNumeroPositivo(id)) {
            throw new Error('ID de producto inválido.');
        }

        try {
            const resultado = await this.productoDAO.eliminarProducto(id);
            return resultado;
        } catch (error) {
            throw new Error('Error al eliminar el producto: ' + error.message);
        }
    }

    async obtenerTodosLosProductos() {
        try {
            const productos = await this.productoDAO.obtenerTodosLosProductos();
            return productos;
        } catch (error) {
            throw new Error('Error al obtener los productos: ' + error.message);
        }
    }
    async reducirInventario(id, cantidadAReducir) {
        if (!id || !this.validarNumeroPositivo(id)) {
            throw new Error('ID de producto inválido.');
        }
        if (!this.validarNumeroPositivo(cantidadAReducir)) {
            throw new Error('La cantidad a reducir debe ser un número positivo.');
        }

        const producto = await this.obtenerProductoPorId(id);

        console.log(producto)
        if (producto.cantidad < cantidadAReducir) {
            throw new Error('La cantidad a reducir excede el inventario disponible.');
        }        
        const productoActualizado = new Producto(producto.nombre, producto.lote, nuevaCantidad, producto.fechaVencimiento, producto.precio);

        try {
            const resultado = await this.productoDAO.actualizarProducto(id, productoActualizado);
            return resultado;
        } catch (error) {
            throw new Error('Error al reducir el inventario del producto: ' + error.message);
        }        
    }


}

module.exports = new ProductoService();
