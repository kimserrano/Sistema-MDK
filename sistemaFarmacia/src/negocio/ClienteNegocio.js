const clienteDAO = require('../dao/clienteDAO');
const Cliente = require('../dominio/Cliente');

class ClienteNegocio {
    static async agregarCliente(telefono, nombre) {
        try {
            // Lógica empresarial: aquí puedes añadir validaciones, transformaciones, etc.
            if ((!nombre || typeof nombre !== 'string')) {
                throw new Error('El nombre del cliente  y su telefono son obligatorio y deben ser un string');
            }

           
            const nuevoCliente = new Cliente(telefono, nombre);
            await clienteDAO.insertar(nuevoCliente);
        } catch (error) {
            console.error('Error en la capa de negocio al agregar el cliente:', error);
            throw error;  // Propagamos el error para que lo maneje quien invoque esta función
        }
    }
}

module.exports = ClienteNegocio;
