const connection = require('../dbConexion/database');
const Cliente = require('../dominio/cliente');
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

     // Buscar cliente por teléfono
     static buscarPorTelefono(telefono) {
        const query = 'SELECT * FROM Cliente WHERE Telefono LIKE ?';
        const likeTelefono = `%${telefono}%`;  
        return connection.promise().query(query, [likeTelefono])
            .then(([rows]) => {
                if (rows.length === 0) {
                    throw new Error('No se encontró un cliente con ese teléfono.');
                }
                console.log(`Clientes encontrados: ${JSON.stringify(rows)}`);
                return rows;  
            })
            .catch((err) => {
                console.error('Error al buscar el cliente por teléfono:', err);
                throw new Error('No se pudo encontrar el cliente. Inténtalo de nuevo.');
            });
    }

    // Buscar cliente por nombre
    static buscarPorNombre(nombre) {
        const query = 'SELECT * FROM Cliente WHERE Nombre LIKE ?';
    
        return connection.promise().query(query, [`%${nombre}%`])
            .then(([rows]) => {
                if (rows.length === 0) {
                    throw new Error('No se encontró un cliente con ese nombre.');
                }
                console.log(`Clientes encontrados: ${JSON.stringify(rows)}`);
                return rows;  // Retornamos todos los clientes que coincidan con el nombre
            })
            .catch((err) => {
                console.error('Error al buscar el cliente por nombre:', err);
                throw new Error('No se pudo encontrar el cliente. Inténtalo de nuevo.');
            });
    }
    
}

module.exports = clienteDAO;
