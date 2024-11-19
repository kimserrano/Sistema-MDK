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


describe('VentaNegocio', () => {

    describe('registrarVenta', () => {
        it('debería registrar una venta y devolver el idVenta', async () => {
            const venta = { telefono: '1234567890', total: 800 };
            const idVentaSimulada = 1;

            // Simula que el DAO devuelve un ID de venta al registrar la venta
            VentaDAO.registrarVenta.mockResolvedValue(idVentaSimulada);

            const idVenta = await VentaNegocio.registrarVenta(venta);

            expect(idVenta).toBe(idVentaSimulada); // Compara con el ID simulado
            expect(VentaDAO.registrarVenta).toHaveBeenCalledWith(venta); // Verifica que el DAO fue llamado con la venta correcta
        });

        it('debería manejar el error si el DAO falla al registrar la venta', async () => {
            const venta = { telefono: '1234567890', total: 800 };
            const mensajeError = 'Error en la base de datos';

            // Simula que el DAO lanza un error
            VentaDAO.registrarVenta.mockRejectedValue(new Error(mensajeError));

            await expect(VentaNegocio.registrarVenta(venta))
                .rejects
                .toThrow(mensajeError);
        });
    });

    describe('registrarVentaProducto', () => {
        it('debería registrar un producto en la venta y devolver el resultado', async () => {
            const idVenta = 1;
            const nombre = 'Paracetamol';
            const cantidad = 2;
            const resultadoSimulado = { success: true };

            // Simula que el DAO devuelve un resultado exitoso
            VentaDAO.registrarVentaProducto.mockResolvedValue(resultadoSimulado);

            const resultado = await VentaNegocio.registrarVentaProducto(idVenta, nombre, cantidad);

            expect(resultado).toEqual(resultadoSimulado); // Compara con el resultado simulado
            expect(VentaDAO.registrarVentaProducto).toHaveBeenCalledWith(idVenta, nombre, cantidad); // Verifica que el DAO fue llamado correctamente
        });

        it('debería manejar el error si el DAO falla al registrar el producto', async () => {
            const idVenta = 1;
            const nombre = 'Paracetamol';
            const cantidad = 2;
            const mensajeError = 'Error al registrar producto';

            // Simula que el DAO lanza un error
            VentaDAO.registrarVentaProducto.mockRejectedValue(new Error(mensajeError));

            await expect(VentaNegocio.registrarVentaProducto(idVenta, nombre, cantidad))
                .rejects
                .toThrow(mensajeError);
        });
    });
});