const ProductoDAO = require('../dao/productoDAO');
const productos = require('../dominio/producto');

class ProductoNegocio {
    constructor() {
        this.productoDAO = new ProductoDAO();
    }

    async consultarProductos() {
        try {
            // Llamada al DAO para obtener los productos
            const productos = await this.productoDAO.consultarTodos();
            return productos; // Retorna los productos consultados
        } catch (error) {
            console.error('Error en la capa de negocio al consultar productos:', error);
            throw error;  // Propagamos el error para que lo maneje quien invoque esta función
        }
    }
}

module.exports = new ProductoNegocio();
