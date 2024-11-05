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
                return result;
            })
            .catch((err) => {
                console.error('Error al insertar el cliente:', err);
                throw new Error('No se pudo agregar el cliente. Inténtalo de nuevo.');
            });
    }

    // Método para obtener todos los clientes
    static obtenerTodos() {
        const query = 'SELECT * FROM Cliente';
        return connection.promise().query(query)
            .then(([rows]) => {
                return rows;  // Retornamos todos los clientes
            })
            .catch((err) => {
                console.error('Error al obtener los clientes:', err);
                throw new Error('No se pudo obtener la lista de clientes. Inténtalo de nuevo.');
            });
    }

    // Método para eliminar un cliente por teléfono
    static eliminarPorTelefono(telefono) {
        const query = 'DELETE FROM Cliente WHERE Telefono = ?';
        return connection.promise().query(query, [telefono])
            .then(([result]) => {
                if (result.affectedRows === 0) {
                    throw new Error('No se encontró un cliente con ese teléfono para eliminar.');
                }
                console.log(`Cliente con teléfono ${telefono} eliminado.`);
                return result;
            })
            .catch((err) => {
                console.error('Error al eliminar el cliente:', err);
                throw new Error('No se pudo eliminar el cliente. Inténtalo de nuevo.');
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
                return rows;
            })
            .catch((err) => {
                console.error('Error al buscar el cliente por nombre:', err);
                throw new Error('No se pudo encontrar el cliente. Inténtalo de nuevo.');
            });
    }

    // Obtener historial de compras de un cliente por teléfono
    static async getClienteCompras(telefono) {
        const query = `
            SELECT v.IdVenta, v.Fecha, vp.Nombre AS Producto, vp.Cantidad, p.Precio, p.Lote 
            FROM Venta v
            JOIN VentaProducto vp ON v.IdVenta = vp.IdVenta
            JOIN Producto p ON vp.Nombre = p.Nombre
            WHERE v.Telefono = ?
        `;
        
        try {
            const [rows] = await connection.promise().query(query, [telefono]);
            return rows;
        } catch (error) {
            console.error('Error al obtener el historial de compras:', error);
            throw new Error('No se pudo obtener el historial de compras. Inténtalo de nuevo.');
        }
    }

    static existe(telefono) {
        const query = 'SELECT * FROM Cliente WHERE Telefono LIKE ?';
        const likeTelefono = `%${telefono}%`;
        return connection.promise().query(query, [likeTelefono])
            .then(([rows]) => {
                if (rows.length === 0) {
                    return [];
                }
                return rows;
            })
            .catch((err) => {
                console.error('Error al buscar el cliente por teléfono:', err);
                throw new Error('No se pudo encontrar el cliente. Inténtalo de nuevo.');
            });
    }

}

module.exports = clienteDAO;
