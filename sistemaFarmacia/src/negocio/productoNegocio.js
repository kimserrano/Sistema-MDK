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

        const existe = await this.productoDAO.verificarProductoExistente(nombre);
        if (existe) {
            throw new Error('El producto con este nombre ya existe.');
            
        }

        const nuevoProducto = new Producto(nombre, lote, cantidad, fechaVencimiento, precio);

        try {
            const resultado = await this.productoDAO.crearProducto(nuevoProducto);
            return resultado;
        } catch (error) {
            throw new Error(error.message);
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

        const existe = await this.productoDAO.verificarProductoExistente(nombre);
        if (existe) {
            throw new Error('Ya existe un producto con este nombre. El nombre debe ser único.');
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
    async obtenerProductosPorCriterio(criterio) {
        if (!criterio) {
            throw new Error('Criterio de búsqueda inválido.');
        }
    
        try {
            const productos = await this.productoDAO.obtenerProductosPorCriterio(criterio);
            
           
    
            return productos;
        } catch (error) {
            throw new Error('Error al obtener los productos: ' + error.message);
        }
    }

    async obtenerTodosLosProductos() {
        try {
            const productos = await this.productoDAO.consultarTodos();
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
        const nuevaCantidad = producto.cantidad - cantidadAReducir;
        const productoActualizado = new Producto(producto.nombre, producto.lote, nuevaCantidad, producto.fechaVencimiento, producto.precio);

        try {
            const resultado = await this.productoDAO.actualizarProducto(id, productoActualizado);
            return resultado;
        } catch (error) {
            throw new Error('Error al reducir el inventario del producto: ' + error.message);
        }
    }

    // Productos que caducan en los próximos 15 días o antes
    async obtenerProductosProximosCaducar() {
        try {
            const productos = await this.productoDAO.consultarProximosProductosACaducar();
            return productos;
        } catch (error) {
            throw new Error('Error al obtener productos que caducan en estos días: ' + error.message);
        }
    }


    // Método para aplicar descuentos a los productos
    async aplicarDescuentos(productos) {
        const hoy = new Date();

        for (const producto of productos) {
            const diasDiferencia = Math.ceil((producto.fechaVencimiento - hoy) / (1000 * 60 * 60 * 24));

            // Determinar el porcentaje de descuento necesario
            let nuevoDescuento = 0;
            if (diasDiferencia < 0) {
                continue;  // Ya caducado, sin descuento adicional
            } else if (diasDiferencia === 0) {
                nuevoDescuento = 20;
            } else if (diasDiferencia <= 7) {
                nuevoDescuento = 15;
            } else if (diasDiferencia <= 15) {
                nuevoDescuento = 10;
            }

            // Si el descuento actual es el mismo que el nuevo, no se hace nada
            if (producto.descuento === nuevoDescuento) {
                console.log(`El producto ${producto.nombre} ya tiene un descuento del ${producto.descuento}%, sin cambios necesarios.`);
                continue;
            }

            // Calcular el nuevo precio basado en el precio original
            if (nuevoDescuento > 0) {
                producto.precio = producto.precioOriginal * (1 - nuevoDescuento / 100);
                producto.descuento = nuevoDescuento;

                // Actualizar en la base de datos
                await this.productoDAO.actualizarPrecios([producto]);
                console.log(`Precio y descuento actualizados para ${producto.nombre}: nuevo precio ${producto.precio}, descuento ${producto.descuento}%`);
            }
        }
    }


}

module.exports = new ProductoService();
