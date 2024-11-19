const connection = require('../dbConexion/database');
const Administrador = require('../dominio/administrador');
class administradorDAO {
    static insertar(administrador) {
        if (!(administrador instanceof Administrador)) {
            throw new Error('El argumento debe ser una instancia de Administrador');
        }

        const query = 'INSERT INTO Administrador (Usuario, Contra) VALUES (?, ?)';

        // Devolvemos la promesa
        return connection.promise().query(query, [administrador.usuario, administrador.contra])
            .then(([result]) => {
                console.log(`Administrador insertado con ID: ${result.insertId}`);
                return result;
            })
            .catch((err) => {
                console.error('Error al insertar el administrador:', err);
                throw new Error('No se pudo agregar el administrador. Inténtalo de nuevo.');
            });
    }

    static existe(usuario) {
        const query = 'SELECT * FROM Administrador WHERE Usuario LIKE ?';
        const likeUsuario = `%${usuario}%`;
        return connection.promise().query(query, [likeUsuario])
            .then(([rows]) => {
                if (rows.length === 0) {
                    return [];
                }
                return rows;
            })
            .catch((err) => {
                console.error('Error al buscar el administrador por su usuario:', err);
                throw new Error('No se pudo encontrar a él administrador. Inténtalo de nuevo.');
            });
    }

    static iniciarSesion(usuario, contra) {
        const query = 'SELECT * FROM Administrador WHERE Usuario = ?';

        return connection.promise().query(query, [usuario])
            .then(([rows]) => {
                if (rows.length === 0) {
                    return null;
                }
                const admin = rows[0];
                const storedPassword = admin.Contra.toString('utf-8');
               
                // Comparar la contraseña ingresada con la almacenada (usando bcrypt)
                if (contra !== storedPassword) {
                    return null;
                }

                return admin;

            })
            .catch((err) => {
                console.error('Error al iniciar sesión:', err);
                // En caso de un error en la base de datos o conexión, retornar null
                return null;
            });
    }

}

module.exports = administradorDAO;
