const connection = require('../dbConexion/database');
const Cajero = require('../dominio/cajero');

class cajeroDAO {
    static insertar(cajero) {
        // el argumento tiene que ser un Cajero
        if (!(cajero instanceof Cajero)) {
            throw new Error('El argumento debe ser una instancia de Cajero');
        }

        const query = 'INSERT INTO Cajero (Usuario, Contra) VALUES (?, ?)';

        // Devolvemos la promesa
        return connection.promise().query(query, [cajero.usuario, cajero.contra])
            .then(([result]) => {
                console.log(`Cajero insertado con ID: ${result.insertId}`);
                return result;
            })
            .catch((err) => {
                console.error('Error al insertar el cliente:', err);
                throw new Error('No se pudo agregar el cliente. Inténtalo de nuevo.');
            });
    }

    static existe(usuario) {
        const query = 'SELECT * FROM Cajero WHERE Usuario LIKE ?';
        const likeUsuario = `%${usuario}%`;
        return connection.promise().query(query, [likeUsuario])
            .then(([rows]) => {
                if (rows.length === 0) {
                    return [];
                }
                return rows;
            })
            .catch((err) => {
                console.error('Error al buscar el Cajero por su usuario:', err);
                throw new Error('No se pudo encontrar a él cajero. Inténtalo de nuevo.');
            });
    }

    static iniciarSesion(usuario, contra) {
        const query = 'SELECT * FROM Cajero WHERE Usuario = ?';

        return connection.promise().query(query, [usuario])
            .then(([rows]) => {
                if (rows.length === 0) {
                    return null;
                }
                const cajero = rows[0];
                const storedPassword = cajero.Contra.toString('utf-8');

                // Comparar la contraseña ingresada con la almacenada (usando bcrypt)
                if (contra !== storedPassword) {
                    return null;
                }
                return cajero;

            })
            .catch((err) => {
                console.error('Error al iniciar sesión:', err);
            // En caso de un error en la base de datos o conexión, retornar null
            return null;
            });
    }


}

module.exports = cajeroDAO;
