const cajeroDAO = require('../dao/cajeroDAO');
const Cajero = require('../dominio/Cajero');

class CajeroNegocio {
    static async agregarCajero(nombre) {
        try {
            // Lógica empresarial: aquí puedes añadir validaciones, transformaciones, etc.
            if (!nombre || typeof nombre !== 'string') {
                throw new Error('El nombre del cajero es obligatorio y debe ser un string');
            }

            const nuevoCajero = new Cajero(nombre);
            // Llamada al DAO para insertar el cajero
            await cajeroDAO.insertar(nuevoCajero);
        } catch (error) {
            console.error('Error en la capa de negocio al agregar el cajero:', error);
            throw error;  // Propagamos el error para que lo maneje quien invoque esta función
        }
    }
}

module.exports = CajeroNegocio;
