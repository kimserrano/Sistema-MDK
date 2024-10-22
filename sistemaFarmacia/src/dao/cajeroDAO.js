const connection = require('../dbConexion/database');
const Cajero = require('../dominio/Cajero');
class cajeroDAO {
   static insertar(cajero) {
        // Asegúrate de que cajero sea una instancia de Cajero
        if (!(cajero instanceof Cajero)) {
            throw new Error('El argumento debe ser una instancia de Cajero');
        }

        const query = 'INSERT INTO Cajero (Nombre) VALUES (?)';

        // Devolvemos una promesa y utilizamos then/catch para manejar el resultado
        connection.promise().query(query, [cajero.nombre])
            .then(([result]) => {
                console.log(`Cajero insertado con ID: ${result.insertId}`);
            })
            .catch((err) => {
                console.error('Error al insertar el cajero:', err);
            });
    }
}

module.exports = cajeroDAO;
