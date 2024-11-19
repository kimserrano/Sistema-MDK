const ClienteNegocio = require('../src/negocio/ClienteNegocio');

describe('ClienteNegocio', () => {
    test('debería agregar un cliente sin lanzar errores', async () => {
        const telefono = '5222222559';
        const nombre = 'berly2';

        await expect(ClienteNegocio.agregarCliente(telefono, nombre)).resolves.not.toThrow();
    });

    test('debería lanzar un error si los datos son inválidos', async () => {
        const telefono = '';
        const nombre = '';

        await expect(ClienteNegocio.agregarCliente(telefono, nombre)).rejects.toThrow('El nombre del cliente es obligatorio.');
    });
});
