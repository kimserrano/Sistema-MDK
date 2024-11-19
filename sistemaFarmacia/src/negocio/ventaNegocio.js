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


}

module.exports = VentaNegocio;

