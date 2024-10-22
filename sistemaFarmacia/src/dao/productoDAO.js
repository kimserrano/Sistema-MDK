const connection = require('../dbConexion/database');
const Producto = require('../dominio/Producto');

class ProductoDAO {

    // Método para consultar todos los productos
    consultarTodos() {
        const query = 'SELECT * FROM Producto';

        return connection.promise().query(query)
            .then(([rows]) => {
                return rows.map(row => new Producto(row.id, row.Nombre, row.Lote, row.FechaVencimiento, row.Cantidad, row.Precio));
            })
            .catch((err) => {
                console.error('Error al consultar los productos:', err);
                throw err; // Propaga el error
            });
    }
}

module.exports = ProductoDAO;
