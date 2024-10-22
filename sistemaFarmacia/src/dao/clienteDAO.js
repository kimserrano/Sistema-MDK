const connection = require('../dbConexion/database');
const Cliente = require('../dominio/Cliente');
class clienteDAO {
    static insertar(cliente) {
        // el argumento tiene que ser un Cliente
        if (!(cliente instanceof Cliente)) {
            throw new Error('El argumento debe ser una instancia de Cliente');
        }
    
        const query = 'INSERT INTO Cliente (Telefono, Nombre) VALUES (?, ?)';
    
        // Devolvemos la promesa
        return connection.promise().query(query, [cliente.telefono, cliente.nombre])
            .then(([result]) => {
                console.log(`Cliente insertado con ID: ${result.insertId}`);
                return result;  // Devolvemos el resultado para su posterior uso
            })
            .catch((err) => {
                console.error('Error al insertar el cliente:', err);
                throw new Error('No se pudo agregar el cliente. Inténtalo de nuevo.');
            });
    }
    
}

module.exports = clienteDAO;
