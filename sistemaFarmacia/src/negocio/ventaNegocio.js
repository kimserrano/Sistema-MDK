const VentaDAO = require('../dao/ventaDAO');


class VentaNegocio {

    static registrarVenta(venta) {
        return new Promise((resolve, reject) => {
            VentaDAO.registrarVenta(venta)  // Llamamos al repositorio (capa de datos)
                .then(idVenta => {
                    resolve(idVenta);  // Resolvemos con el idVenta
                })
                .catch(err => {
                    reject(err);  // Rechazamos si hay un error en la base de datos
                });
        });
    }

    static registrarVentaProducto(idVenta, nombre, cantidad) {
        return new Promise((resolve, reject) => {
            VentaDAO.registrarVentaProducto(idVenta, nombre, cantidad)
                .then(result => {
                    resolve(result);  // Resolvemos cuando el producto se registre con éxito
                })
                .catch(err => {
                    reject(err);  // Rechazamos si hay un error al registrar el producto
                });
        });
    }

    static obtenerCantidadVentasPorTelefono(telefono) {
        return new Promise((resolve, reject) => {
            VentaDAO.getVentasByCliente(telefono) // Llama al método del DAO
                .then(ventas => {
                    const cantidadVentas = ventas.length; // Calcula la cantidad de ventas
                    resolve(cantidadVentas); // Resuelve con la cantidad
                })
                .catch(err => {
                    reject(new Error('Error al obtener ventas del cliente: ' + err.message)); // Rechaza con un mensaje claro
                });
        });
    }
}

module.exports = VentaNegocio;

