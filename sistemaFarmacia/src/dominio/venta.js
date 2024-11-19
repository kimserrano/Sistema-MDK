class Venta {
    //fecha = new Date().toISOString().split('T')[0]
    constructor(total, usuarioCajero, telefono, id = null) {
        this.id = id; // id será null si no se proporciona
        this.fecha = new Date();
        this.total = total;
        this.usuarioCajero = usuarioCajero;
        this.telefono = telefono;
    }

}

module.exports = Venta;