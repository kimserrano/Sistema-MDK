const pool = require('../dbConexion/database');
const Venta = require('../dominio/venta');

class VentaDAO {
    static async getVentasByCliente(telefono) {
        const [rows] = await pool.query('SELECT * FROM Venta WHERE Telefono = ?', [telefono]);
        return rows;
    };

    static registrarVenta(venta) {
        const query = 'INSERT INTO Venta (Fecha, Total, UsuarioCajero, Telefono) VALUES (?, ?, ?, ?)';

        // Se utilizan parámetros para prevenir inyecciones SQL
        const params = [venta.fecha, venta.total, venta.usuarioCajero, venta.telefono];

        return new Promise((resolve, reject) => {
            pool.query(query, params, (err, result) => {
                if (err) {
                    console.error('Error al registrar venta:', err);
                    return reject(err); // En caso de error, se rechaza la promesa
                }

                // Obtener el idVenta generado automáticamente
                const idVenta = result.insertId; // insertId devuelve el id generado por la consulta

                console.log('Venta registrada exitosamente con ID:', idVenta);
                resolve(idVenta); // Resuelve con el idVenta generado
            });
        });
    }


    static registrarVentaProducto(idVenta, nombre, cantidad) {
        const query = 'INSERT INTO VentaProducto (IdVenta, Nombre, Cantidad) VALUES (?, ?, ?)';
        const params = [idVenta, nombre, cantidad];

        return new Promise((resolve, reject) => {
            pool.query(query, params, (err, result) => {
                if (err) {
                    console.error('Error al registrar venta de producto:', err);
                    return reject(err);
                }
                console.log('Producto registrado exitosamente en venta.');
                resolve(result);
            });
        });
    }

}



module.exports = VentaDAO;
