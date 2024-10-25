const clienteDAO = require('../dao/clienteDAO');
const Cliente = require('../dominio/cliente');

class ClienteNegocio {
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

            const nuevoCliente = new Cliente(telefono, nombre);
            await clienteDAO.insertar(nuevoCliente);
        } catch (error) {
            console.error('Error en la capa de negocio al agregar el cliente:', error);
            throw error;  // Propagamos el error para que lo maneje quien invoque esta función
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
            throw error;  // Propagamos el error para que lo maneje quien invoque esta función
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
            throw error;  // Propagamos el error para que lo maneje quien invoque esta función
        }
    }
}

module.exports = ClienteNegocio;
