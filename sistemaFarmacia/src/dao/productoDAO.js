const connection = require('../dbConexion/database'); 
const Producto = require('../dominio/producto'); 

class ProductoDAO {
    
    crearProducto(producto) {
        const query = 'INSERT INTO producto (nombre, lote, cantidad, fechavencimiento, precio) VALUES (?, ?, ?, ?, ?)';
        const params = [producto.nombre, producto.lote, producto.cantidad, producto.fechaVencimiento, producto.precio];
        
        return new Promise((resolve, reject) => {
            connection.query(query, params, (err, result) => {
                if (err) {
                    console.error('Error al crear producto:', err);
                    return reject(err);
                }
                console.log('Producto creado exitosamente');
                resolve(result);
            });
        });
    }

    obtenerProductoPorId(id) {
        const query = 'SELECT * FROM productos WHERE id = ?';
        
        return new Promise((resolve, reject) => {
            connection.query(query, [id], (err, results) => {
                if (err) {
                    console.error('Error al obtener producto:', err);
                    return reject(err);
                }
                if (results.length > 0) {
                    const producto = new Producto(
                        results[0].nombre,
                        results[0].lote,
                        results[0].cantidad,
                        results[0].fechavencimiento
                    );
                    resolve(producto);
                } else {
                    reject(new Error('Producto no encontrado'));
                }
            });
        });
    }

    actualizarProducto(id, producto) {
        const query = 'UPDATE productos SET nombre = ?, lote = ?, cantidad = ?, fechavencimiento = ? WHERE id = ?';
        const params = [producto.nombre, producto.lote, producto.cantidad, producto.fechaVencimiento, id];
        
        return new Promise((resolve, reject) => {
            connection.query(query, params, (err, result) => {
                if (err) {
                    console.error('Error al actualizar producto:', err);
                    return reject(err);
                }
                if (result.affectedRows > 0) {
                    console.log('Producto actualizado exitosamente');
                    resolve(result);
                } else {
                    reject(new Error('Producto no encontrado para actualizar'));
                }
            });
        });
    }

    eliminarProducto(id) {
        const query = 'DELETE FROM productos WHERE id = ?';
        
        return new Promise((resolve, reject) => {
            connection.query(query, [id], (err, result) => {
                if (err) {
                    console.error('Error al eliminar producto:', err);
                    return reject(err);
                }
                if (result.affectedRows > 0) {
                    console.log('Producto eliminado exitosamente');
                    resolve(result);
                } else {
                    reject(new Error('Producto no encontrado para eliminar'));
                }
            });
        });
    }

    obtenerTodosLosProductos() {
        const query = 'SELECT * FROM productos';
        
        return new Promise((resolve, reject) => {
            connection.query(query, (err, results) => {
                if (err) {
                    console.error('Error al obtener productos:', err);
                    return reject(err);
                }
                const productos = results.map(row => new Producto(
                    row.nombre,
                    row.lote,
                    row.cantidad,
                    row.fechavencimiento
                ));
                resolve(productos);
            });
        });
    }
}

module.exports = ProductoDAO;
