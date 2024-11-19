const ClienteNegocio = require('../src/negocio/clienteNegocio');
const clienteDAO = require('../src/dao/clienteDAO');

// Mockear las funciones de clienteDAO
jest.mock('../src/dao/clienteDAO', () => ({
    insertar: jest.fn(),
    buscarPorTelefono: jest.fn(),
    buscarPorNombre: jest.fn(),
    existe: jest.fn(),
    getClienteCompras: jest.fn()
}));

describe('ClienteNegocio', () => {
    // Pruebas de agregar cliente
    test('debería agregar un cliente sin lanzar errores', async () => {
        const telefono = '3222222559';
        const nombre = 'berly2';

        // Mockeamos la respuesta de la inserción
        clienteDAO.existe.mockResolvedValue([]);
        clienteDAO.insertar.mockResolvedValue({ insertId: 1 });

        await expect(ClienteNegocio.agregarCliente(telefono, nombre)).resolves.not.toThrow();
    });

    test('debería lanzar un error si los datos son inválidos', async () => {
        const telefono = '';
        const nombre = '';

        await expect(ClienteNegocio.agregarCliente(telefono, nombre)).rejects.toThrow('El nombre del cliente es obligatorio.');
    });

    // Pruebas de búsqueda de clientes
    describe('buscarClientePorTelefono', () => {
        test('debería devolver el cliente si el teléfono existe', async () => {
            const telefono = '1234567890';
            const clienteMock = { telefono: '1234567890', nombre: 'Juan' };

            // Mockeamos la respuesta del DAO
            clienteDAO.buscarPorTelefono.mockResolvedValue(clienteMock);

            const cliente = await ClienteNegocio.buscarClientePorTelefono(telefono);

            expect(cliente).toEqual(clienteMock);
            expect(clienteDAO.buscarPorTelefono).toHaveBeenCalledWith(telefono);
        });

        test('debería devolver null si no se encuentra el cliente', async () => {
            const telefono = '0987654321';

            clienteDAO.buscarPorTelefono.mockResolvedValue(null);

            const cliente = await ClienteNegocio.buscarClientePorTelefono(telefono);

            expect(cliente).toBeNull();
        });

        test('debería lanzar un error si ocurre un problema en el DAO', async () => {
            const telefono = '1234567890';
            const errorMock = new Error('Error al buscar en la base de datos');

            clienteDAO.buscarPorTelefono.mockRejectedValue(errorMock);

            await expect(ClienteNegocio.buscarClientePorTelefono(telefono)).rejects.toThrow('Error al buscar en la base de datos');
        });
    });

    describe('buscarClientePorNombre', () => {
        test('debería devolver una lista de clientes si se encuentran coincidencias por nombre', async () => {
            const nombre = 'Juan';
            const clientesMock = [
                { telefono: '1234567890', nombre: 'Juan' },
                { telefono: '0987654321', nombre: 'Juan' },
            ];

            clienteDAO.buscarPorNombre.mockResolvedValue(clientesMock);

            const clientes = await ClienteNegocio.buscarClientePorNombre(nombre);

            expect(clientes).toEqual(clientesMock);
            expect(clienteDAO.buscarPorNombre).toHaveBeenCalledWith(nombre);
        });

        test('debería devolver una lista vacía si no se encuentran clientes', async () => {
            const nombre = 'Pedro';

            clienteDAO.buscarPorNombre.mockResolvedValue([]);

            const clientes = await ClienteNegocio.buscarClientePorNombre(nombre);

            expect(clientes).toEqual([]);
        });

        test('debería lanzar un error si ocurre un problema en el DAO', async () => {
            const nombre = 'Juan';
            const errorMock = new Error('Error al buscar en la base de datos');

            clienteDAO.buscarPorNombre.mockRejectedValue(errorMock);

            await expect(ClienteNegocio.buscarClientePorNombre(nombre)).rejects.toThrow('Error al buscar en la base de datos');
        });

        test('debería lanzar un error si el teléfono ya existe', async () => {
            const telefono = '3222222559';
            const nombre = 'berly2';
        
            clienteDAO.existe.mockResolvedValue([{ telefono }]);
        
            await expect(ClienteNegocio.agregarCliente(telefono, nombre)).rejects.toThrow('El numero de telefono ya existe');
            expect(clienteDAO.existe).toHaveBeenCalledWith(telefono);
        });

        test('debería lanzar un error si el cliente no tiene compras previas', async () => {
            const telefono = '3223222559';
    
            clienteDAO.getClienteCompras.mockResolvedValue([]);
    
            await expect(ClienteNegocio.getHistorialCompras(telefono)).rejects.toThrow('No hay compras previas registradas para este cliente');
        });
        
        test('debería lanzar un error si ocurre un problema en el DAO', async () => {
            const telefono = '3222222559';
            const errorMock = new Error('Error al obtener el historial de compras');
    
            clienteDAO.getClienteCompras.mockRejectedValue(errorMock);
    
            await expect(ClienteNegocio.getHistorialCompras(telefono)).rejects.toThrow('Error al obtener el historial de compras');
        });

        test('debería devolver las compras y las marcas con descuento si el cliente califica', async () => {
            const telefono = '3222222559';
            const comprasMock = [
                { Producto: 'Marca1', Cantidad: 5 },
                { Producto: 'Marca1', Cantidad: 5 },
                { Producto: 'Marca2', Cantidad: 3 },
            ];
    
            clienteDAO.getClienteCompras.mockResolvedValue(comprasMock);
    
            const resultado = await ClienteNegocio.getHistorialCompras(telefono);
    
            expect(resultado.compras).toEqual(comprasMock);
            expect(resultado.marcasConDescuento).toEqual(['Marca1']);
        });
    });
});
