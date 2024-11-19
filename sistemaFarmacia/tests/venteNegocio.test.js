const VentaNegocio = require('../src/negocio/ventaNegocio'); // Ruta del archivo de negocio
const VentaDAO = require('../src/dao/ventaDAO');  // Ruta corregida

// Mock de la capa DAO
jest.mock('../src/dao/ventaDAO'); 

describe('obtenerCantidadVentasPorTelefono', () => {

    it('debería devolver la cantidad correcta de ventas para un cliente', async () => {
        const telefonoCliente = '1234567890';
        const ventasSimuladas = [
            { idVenta: 1, telefono: telefonoCliente, fecha: '2024-11-01', total: 500 },
            { idVenta: 2, telefono: telefonoCliente, fecha: '2024-11-05', total: 300 }
        ];
        
        // Simulamos que el DAO devuelve una lista de ventas
        VentaDAO.getVentasByCliente.mockResolvedValue(ventasSimuladas);

        const cantidadVentas = await VentaNegocio.obtenerCantidadVentasPorTelefono(telefonoCliente);

        expect(cantidadVentas).toBe(ventasSimuladas.length); // Esperamos que el número de ventas coincida con el tamaño de ventasSimuladas
        expect(VentaDAO.getVentasByCliente).toHaveBeenCalledWith(telefonoCliente); // Verifica que el DAO fue llamado con el teléfono correcto
    });

    it('debería devolver 0 si no hay ventas para un cliente', async () => {
        const telefonoCliente = '0987654321';
        
        // Simulamos que el DAO no devuelve ninguna venta
        VentaDAO.getVentasByCliente.mockResolvedValue([]);

        const cantidadVentas = await VentaNegocio.obtenerCantidadVentasPorTelefono(telefonoCliente);

        expect(cantidadVentas).toBe(0); // Si no hay ventas, la cantidad debería ser 0
        expect(VentaDAO.getVentasByCliente).toHaveBeenCalledWith(telefonoCliente); // Verifica que el DAO fue llamado con el teléfono correcto
    });

    it('debería manejar el error si el DAO falla al obtener las ventas', async () => {
        const telefonoCliente = '1234567890';
        const mensajeError = 'Error en la base de datos';

        // Simulamos un error en el DAO
        VentaDAO.getVentasByCliente.mockRejectedValue(new Error(mensajeError));

        await expect(VentaNegocio.obtenerCantidadVentasPorTelefono(telefonoCliente))
            .rejects
            .toThrow('Error al obtener ventas del cliente: ' + mensajeError);
    });

});
