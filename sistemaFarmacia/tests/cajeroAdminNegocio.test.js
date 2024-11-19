const CajeroAdminNegocio = require('../src/negocio/CajeroAdminNegocio'); // Ruta de la capa de negocio
const cajeroDAO = require('../src/dao/cajeroDAO'); // DAO del cajero
const administradorDAO = require('../src/dao/administradorDAO'); // DAO del administrador

// Mock de las capas DAO
jest.mock('../src/dao/cajeroDAO');
jest.mock('../src/dao/administradorDAO');

describe('CajeroAdminNegocio', () => {

    describe('iniciarSesionTrabajador', () => {

        it('debería iniciar sesión como administrador', async () => {
            const usuario = 'admin123';
            const contra = 'Password1';

            administradorDAO.iniciarSesion.mockResolvedValue({ usuario, contra });

            const resultado = await CajeroAdminNegocio.iniciarSesionTrabajador(usuario, contra);

            expect(resultado).toEqual({ tipo: 'administrador', usuario: { usuario, contra } });
            expect(administradorDAO.iniciarSesion).toHaveBeenCalledWith(usuario, contra);
        });

        it('debería iniciar sesión como cajero', async () => {
            const usuario = 'cajero123';
            const contra = 'Password1';

            cajeroDAO.iniciarSesion.mockResolvedValue({ usuario, contra });

            const resultado = await CajeroAdminNegocio.iniciarSesionTrabajador(usuario, contra);

            expect(resultado).toEqual({ tipo: 'cajero', usuario: { usuario, contra } });
            expect(cajeroDAO.iniciarSesion).toHaveBeenCalledWith(usuario, contra);
        });

        

        it('debería lanzar un error si el usuario o contraseña son incorrectos', async () => {
            const usuario = 'invalido';
            const contra = 'Password1';

            cajeroDAO.iniciarSesion.mockRejectedValue(new Error('Usuario no encontrado'));
            administradorDAO.iniciarSesion.mockRejectedValue(new Error('Usuario no encontrado'));

            await expect(CajeroAdminNegocio.iniciarSesionTrabajador(usuario, contra))
                .rejects
                .toThrow(); // Solo espera que se lance un error, sin verificar el mensaje
        });

        it('debería lanzar un error si el usuario no es válido', async () => {
            const usuario = ''; // Usuario vacío
            const contra = 'Password1';

            await expect(CajeroAdminNegocio.iniciarSesionTrabajador(usuario, contra))
                .rejects
                .toThrow(); // Solo espera que se lance un error, sin verificar el mensaje
        });
    });
});
