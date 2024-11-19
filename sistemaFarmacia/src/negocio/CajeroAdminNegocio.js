const administradorDAO = require('../dao/administradorDAO');
const cajeroDAO = require('../dao/cajeroDAO');
const Cajero = require('../dominio/cajero');
const Administrador = require('../dominio/administrador');

class CajeroAdminNegocio {

    static async agregarCajeroAdmin(usuario, contra, esAdmin) {
        const permisosAdmin = esAdmin === "yes";
        try {
            // Validaciones para el nombre
            if (!usuario || typeof usuario !== 'string') {
                throw new Error('El usuario es obligatorio.');
            }
            if (usuario.length < 5) {
                throw new Error('El usuario debe tener al menos 5 letras.');
            }

            // Validación de la contraseña
            if (!contra || typeof contra !== 'string') {
                throw new Error('La contraseña es obligatoria.');
            }
            if (/\s/.test(contra)) { // Verifica que no haya espacios en blanco
                throw new Error('La contraseña no debe contener espacios en blanco.');
            }
            if (contra.length < 5) {
                throw new Error('La contraseña debe tener al menos 5 caracteres.');
            }
            if (!/[A-Z]/.test(contra)) { // Verifica al menos una letra mayúscula
                throw new Error('La contraseña debe contener al menos una letra mayúscula.');
            }
            if (!/\d/.test(contra)) { // Verifica al menos un número
                throw new Error('La contraseña debe contener al menos un número.');
            }

            const existeCajero = await cajeroDAO.existe(usuario)
            const existeAdmin = await administradorDAO.existe(usuario)

            if (existeCajero.length > 0 || existeCajero.length > 0) {
                throw new Error('El usuario ya existe');
            }

            if (permisosAdmin) {
                const nuevoAdmin = new Administrador(usuario, contra);
                await administradorDAO.insertar(nuevoAdmin);
            } else {
                const nuevoCajero = new Cajero(usuario, contra);
                await cajeroDAO.insertar(nuevoCajero);
            }


        } catch (error) {
            console.error('Error en la capa de negocio al agregar trabajador:', error);
            throw error;
        }
    }

    static async iniciarSesionTrabajador(usuario, contra) {

        try {
            // Validaciones para el nombre
            if (!usuario || typeof usuario !== 'string') {
                throw new Error('El usuario es obligatorio.');
            }

            // Validación de la contraseña
            if (!contra || typeof contra !== 'string') {
                throw new Error('La contraseña es obligatoria.');
            }

            let cajero = null;
            let administrador = null;
    
            // Intentar verificar si el usuario es un cajero
            try {
                cajero = await cajeroDAO.iniciarSesion(usuario, contra);
            } catch (error) {
                console.log('No se encontró cajero:', error.message); // Si falla, no se hace nada y sigue buscando al administrador
            }
    
            // Intentar verificar si el usuario es un administrador
            try {
                administrador = await administradorDAO.iniciarSesion(usuario, contra);
            } catch (error) {
                console.log('No se encontró administrador:', error.message); // Si falla, no se hace nada y sigue buscando
            }
    
            // Si encontramos un cajero, retornamos el objeto cajero
            if (cajero) {
                return { tipo: 'cajero', usuario: cajero };
            }
    
            // Si encontramos un administrador, retornamos el objeto administrador
            if (administrador) {
                return { tipo: 'administrador', usuario: administrador };
            }
    
            // Si ambos fallan
            throw new Error('Usuario o contraseña incorrectos.');
            
        } catch (error) {
            console.error('Error en la capa de negocio al iniciar sesion:', error);
            throw error;
        }


    }
}

module.exports = CajeroAdminNegocio;
