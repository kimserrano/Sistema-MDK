const pool = require('../dbConexion/database');

class VentaDAO {
    static async getVentasByCliente(telefono) {
        const [rows] = await pool.query('SELECT * FROM Venta WHERE Telefono = ?', [telefono]);
        return rows;
    };
}

module.exports = VentaDAO;
