
const connection = require('../dbConexion/database');
const Producto = require('../dominio/producto');

class ProductoDAO {

    crearProducto(producto) {
        console.log('Cantidad a insertar:', producto.cantidad);
        const query = 'INSERT INTO producto (nombre, lote, cantidad, fechavencimiento, precio, precioOriginal) VALUES (?, ?, ?, ?, ?, ?)';
        const params = [producto.nombre, producto.lote, producto.cantidad, producto.fechaVencimiento, producto.precio, producto.precio];

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

                return rows.map(row => new Producto(row.Nombre, row.Lote, row.Cantidad, row.FechaVencimiento, row.Precio, row.PrecioOriginal, row.Descuento, row.id));


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
                //(row.Nombre, row.Lote, row.Cantidad, row.FechaVencimiento, row.Precio, row.PrecioOriginal, row.Descuento, row.id)
                if (results.length > 0) {
                    const producto = new Producto(
                        results[0].Nombre,
                        results[0].Lote,
                        results[0].Cantidad,
                        results[0].FechaVencimiento,
                        results[0].Precio,
                        results[0].PrecioOriginal,
                        results[0].Descuento,
                        results[0].id
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
                    result.Precio,
                    null,
                    null,
                    result.id
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

    // Productos que caducan desde hoy o antes hasta en los próximos 15 días
    consultarProximosProductosACaducar() {
        const query = `
        SELECT * FROM Producto
        WHERE FechaVencimiento <= DATE_ADD(CURDATE(), INTERVAL 15 DAY)
    `;
        return connection.promise().query(query)
            .then(([rows]) => {
                return rows.map(row => new Producto(row.Nombre, row.Lote, row.Cantidad, row.FechaVencimiento, row.Precio, row.PrecioOriginal, row.Descuento, row.id));
            })
            .catch((err) => {
                console.error('Error al consultar productos que caducan en 15 días:', err);
                throw err;
            });
    }

    // Método para actualizar precios y descuentos en la base de datos
    async actualizarPrecios(productos) {
        const promises = productos.map(producto => {
            const query = `
            UPDATE Producto
            SET Precio = ?, Descuento = ?
            WHERE id = ?
        `;
            const values = [producto.precio, producto.descuento, producto.id];

            return connection.promise().query(query, values)
                .then(() => {
                    console.log(`Precio y descuento actualizados para ${producto.nombre}: nuevo precio ${producto.precio}, descuento ${producto.descuento}`);
                })
                .catch((err) => {
                    console.error(`Error al actualizar el precio y descuento de ${producto.nombre}:`, err);
                });
        });

        // Esperar que todas las actualizaciones se completen
        await Promise.all(promises);
    }

}

module.exports = ProductoDAO;
