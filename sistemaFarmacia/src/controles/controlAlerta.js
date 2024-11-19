const cron = require('node-cron');
const nodemailer = require('nodemailer');
const productoNegocio = require('../negocio/productoNegocio');

// Configuración del transportador de nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mdkmedicinas@gmail.com', // user de correo
        pass: 'ftmewrngxozfrtxz' // contra de correo 
    }
});

function calcularDiasHastaVencimiento(fechaVencimiento) {
    const hoy = new Date();
    const diasDiferencia = Math.ceil((fechaVencimiento - hoy) / (1000 * 60 * 60 * 24));
    return diasDiferencia;
}

// Función para enviar correo con productos
async function enviarCorreo(productos) {

     // Crear la tabla HTML
     let tablaProductos = `
     <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;">
         <thead>
             <tr>
                 <th>Producto</th>
                 <th>Fecha de Vencimiento</th>
                 <th>Días hasta Vencimiento</th>
             </tr>
         </thead>
         <tbody>
 `;

   productos.forEach(p => {
        const diasDiferencia = calcularDiasHastaVencimiento(p.fechaVencimiento);
        tablaProductos += `
            <tr>
                <td>${p.nombre}</td>
                <td>${new Date(p.fechaVencimiento).toLocaleDateString()}</td>
                <td>${diasDiferencia > 0 ? `Caduca en ${diasDiferencia} días` : `Caducado hace ${Math.abs(diasDiferencia)} días`}</td>
            </tr>
        `;
    });

    tablaProductos += `
            </tbody>
        </table>
    `;

    const mailOptions = {
        from: 'mdkmedicinas@gmail.com',
        to: 'mdkmedicinas@gmail.com',
        subject: 'Productos a punto de vencer',
       html: `
            <p>Lista de productos próximos a caducar o caducados:</p>
            ${tablaProductos}
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Correo enviado exitosamente');
    } catch (error) {
        console.error('Error al enviar el correo:', error);
    }
}


async function verificarProductosCaducados() {
    try {
        const productosACaducar = await productoNegocio.obtenerProductosProximosCaducar();
        if (productosACaducar.length > 0) {
            await productoNegocio.aplicarDescuentos(productosACaducar);
            console.log('Productos que caducan con descuentos aplicados:', productosACaducar);
            // Enviar correo con los productos que caducan
            await enviarCorreo(productosACaducar);
        }
    } catch (error) {
        console.error('Error al verificar productos vencidos o próximos a vencer:', error);
    }
}

// Programación de la tarea para que se ejecute cada día a las 10 p.m.
cron.schedule('*/5 * * * *', () => {
    console.log('Ejecutando tarea programada...');
    verificarProductosCaducados();
}, {
    timezone: "America/Mexico_City"
});

