const clienteDAO = require('../dao/clienteDAO');
const Cliente = require('../dominio/cliente');

class ClienteNegocio {
    // Método para agregar un cliente
    static async agregarCliente(telefono, nombre) {
        try {
            // Validaciones para el nombre
            if (!nombre || typeof nombre !== 'string') {
                throw new Error('El nombre del cliente es obligatorio.');
            }
            if (nombre.length < 2) {
                throw new Error('El nombre del cliente debe tener al menos 2 letras.');
            }

            // Validaciones para el teléfono
            if (!telefono || typeof telefono !== 'string') {
                throw new Error('El teléfono del cliente es obligatorio.');
            }
            if (telefono.length < 10) {
                throw new Error('El teléfono del cliente debe tener al menos 10 caracteres.');
            }

            const existe = await clienteDAO.existe(telefono)

            if(existe.length > 0){
                throw new Error('El numero de telefono ya existe');
            }

            const nuevoCliente = new Cliente(telefono, nombre);
            await clienteDAO.insertar(nuevoCliente);
        } catch (error) {
            console.error('Error en la capa de negocio al agregar el cliente:', error);
            throw error;
        }
    }

    // Método para obtener todos los clientes
    static async obtenerClientes() {
        try {
            const clientes = await clienteDAO.obtenerTodos();
            return clientes;
        } catch (error) {
            console.error('Error en la capa de negocio al obtener los clientes:', error);
            throw error;
        }
    }

    // Método para buscar un cliente por teléfono
    static async buscarClientePorTelefono(telefono) {
        try {
            if (!telefono || typeof telefono !== 'string') {
                throw new Error('El teléfono del cliente es obligatorio.');
            }
            const cliente = await clienteDAO.buscarPorTelefono(telefono);
            return cliente;
        } catch (error) {
            console.error('Error en la capa de negocio al buscar el cliente por teléfono:', error);
            throw error;
        }
    }

    // Método para buscar un cliente por nombre
    static async buscarClientePorNombre(nombre) {
        try {
            if (!nombre || typeof nombre !== 'string') {
                throw new Error('El nombre del cliente es obligatorio.');
            }
            const clientes = await clienteDAO.buscarPorNombre(nombre);
            return clientes;
        } catch (error) {
            console.error('Error en la capa de negocio al buscar el cliente por nombre:', error);
            throw error;
        }
    }

    // Método para eliminar un cliente por teléfono
    static async eliminarCliente(telefono) {
        try {
            if (!telefono || typeof telefono !== 'string') {
                throw new Error('El teléfono del cliente es obligatorio.');
            }
            await clienteDAO.eliminarPorTelefono(telefono);
        } catch (error) {
            console.error('Error en la capa de negocio al eliminar el cliente:', error);
            throw error;
        }
    }

    // Método para obtener el historial de compras de un cliente y determinar si es elegible para descuentos
    static async getHistorialCompras(telefono) {
        try {
            const compras = await clienteDAO.getClienteCompras(telefono);
            if (compras.length === 0) {
                return { compras: [], marcasConDescuento: [] };
            }

            const productosPorMarca = {};
            compras.forEach(compra => {
                const { Producto, Cantidad } = compra;
                productosPorMarca[Producto] = (productosPorMarca[Producto] || 0) + Cantidad;
            });

            const marcasConDescuento = Object.keys(productosPorMarca).filter(
                producto => productosPorMarca[producto] >= 10
            );

            return { compras, marcasConDescuento };
        } catch (error) {
            console.error('Error en la capa de negocio al obtener el historial de compras:', error);
            throw error;
        }
    }
}

module.exports = ClienteNegocio;
