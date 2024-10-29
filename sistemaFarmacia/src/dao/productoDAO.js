
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
    consultarTodos() {
        const query = 'SELECT * FROM Producto';
        return connection.promise().query(query)
            .then(([rows]) => {
                return rows.map(row => new Producto( row.Nombre, row.Lote,row.Cantidad ,row.FechaVencimiento , row.Precio));
            })
            .catch((err) => {
                console.error('Error al consultar los productos:', err);
                throw err; // Propaga el error
            });
    }
    obtenerProductoPorId(id) {
        const query = 'SELECT * FROM producto WHERE id = ?';
        
        return new Promise((resolve, reject) => {
            connection.query(query, [id], (err, results) => {
                if (err) {
                    console.error('Error al obtener producto:', err);
                    return reject(err);
                }
                console.log(results)
                if (results.length > 0) {
                    const producto = new Producto(
                        results[0].Nombre,
                        results[0].Lote,
                        results[0].Cantidad,
                        results[0].FechaVencimiento,
                        results[0].Precio
                    );
                    resolve(producto);
                } else {
                    reject(new Error('Producto no encontrado'));
                }
            });
        });
    }

    obtenerProductosPorCriterio(criterio) {
        return new Promise((resolve, reject) => {
            let searchValue;
            let query;
    
            // Verifica si el criterio comienza con "LOTE"
            if (criterio.startsWith("LOTE")) {
                // Si es así, quitar "LOTE" y preparar el valor de búsqueda solo para Lote
                const loteValue = criterio.replace("LOTE", "").trim();
                searchValue = `%${loteValue}%`; // Se aplican los % para LIKE
                query = `
                    SELECT * FROM producto 
                    WHERE Lote LIKE ?
                `;
            } else {
                searchValue = `%${criterio}%`; // Aplica el % para LIKE en otros casos
                query = `
                    SELECT * FROM producto 
                    WHERE id LIKE ? OR Nombre LIKE ? OR Lote LIKE ?
                `;
            }
    
            const values = criterio.startsWith("LOTE") ? [searchValue] : [searchValue, searchValue, searchValue];
    
            connection.query(query, values, (err, results) => {
                if (err) {
                    console.error('Error en la consulta:', err);
                    return reject(err);
                }
    
                const productos = results.map(result => new Producto(
                    result.Nombre,
                    result.Lote,
                    result.Cantidad,
                    result.FechaVencimiento,
                    result.Precio
                ));
    
                resolve(productos);
            });
        });
    }
    actualizarProducto(id, producto) {
        const query = 'UPDATE producto SET nombre = ?, lote = ?, cantidad = ?, fechavencimiento = ?, precio = ? WHERE id = ?';
        const params = [producto.nombre, producto.lote, producto.cantidad, producto.fechaVencimiento, producto.precio, id];
        
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
        const query = 'DELETE FROM producto WHERE id = ?';
        
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

    

    verificarProductoExistente(nombre) {
        const query = 'SELECT COUNT(*) AS existe FROM producto WHERE nombre = ?';
        
        return new Promise((resolve, reject) => {
            connection.query(query, [nombre], (err, resultados) => {
                if (err) {
                    console.error('Error al verificar producto existente:', err);
                    return reject(err);
                }
                resolve(resultados[0].existe > 0); 
            });
        });
    }
    
}

module.exports = ProductoDAO;
