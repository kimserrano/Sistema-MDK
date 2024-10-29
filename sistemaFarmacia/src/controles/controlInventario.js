
const ProductoNegocio = require('../negocio/productoNegocio'); // Asegúrate de que la ruta sea correcta
const productos = require('../dominio/producto');


document.addEventListener("DOMContentLoaded", () => {
    console.log('Document loaded, loading products...');
    
    // Agregar el evento al botón de búsqueda
    obtenerTodosLosProductos();
    const buscarInput = document.getElementById('buscarProducto');
    const buscarBtn = document.querySelector('.btn-primary.rounded'); // Asegúrate de que este selector coincida con tu botón de búsqueda

    // Ejecuta la búsqueda cada vez que se escribe en el campo de texto
    buscarInput.addEventListener('input', buscarProductos);

    // Ejecuta la búsqueda cuando se presiona el botón
    buscarBtn.addEventListener('click', buscarProductos);
    
});

async function buscarProductos() {
    const inputBuscarProducto = document.getElementById('buscarProducto');
    const criterio = inputBuscarProducto.value.trim(); // Obtener el valor de búsqueda y eliminar espacios

    if (criterio === '') {
        obtenerTodosLosProductos(); // Si el campo está vacío, obtiene todos los productos
        return;
    }

    try {
     // Asegúrate de que la clase ProductoNegocio esté bien instanciada
        const productosEncontrados = await ProductoNegocio.obtenerProductosPorCriterio(criterio);

        // Mostrar los productos encontrados (puedes implementar esto según tus necesidades)
        mostrarProductosEncontrados(productosEncontrados);
    } catch (error) {
        console.error('Error al buscar productos:', error);
        alert('Ocurrió un error al buscar productos. Inténtelo de nuevo más tarde.');
    }
}
async function obtenerTodosLosProductos() {
    try {
        const todosLosProductos = await ProductoNegocio.obtenerTodosLosProductos(); // Método que devuelve todos los productos
        mostrarProductosEncontrados(todosLosProductos);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        alert('Ocurrió un error al cargar los productos. Inténtelo de nuevo más tarde.');
    }
}


function mostrarProductosEncontrados(productos) {
    const productsSection = document.querySelector('.products-section-bottom .row');
    productsSection.innerHTML = ''; // Limpiar el contenido existente

    if (productos.length === 0) {
        productsSection.innerHTML = '<p>No se encontraron productos.</p>';
        return;
    }

    productos.forEach(producto => {
        const productoDiv = document.createElement('div');
        productoDiv.className = 'col-md-4';
        productoDiv.innerHTML = `
            <div class="product">
                <h6>${producto.nombre}</h6>
                <p>$${producto.precio.toFixed(2)}</p>
                <p class="cantidad">Cantidad: ${producto.cantidad}</p> <!-- Mostrar la cantidad aquí -->
                <div class="d-flex justify-content-center align-items-center">
                    <button class="btn btn-outline-danger me-2" onclick="borrarProducto('${producto.id}')">
                        <i class="bi bi-trash"></i> <!-- Ícono de borrar -->
                    </button>
                    <button class="btn btn-outline-primary" onclick="editarProducto('${producto.id}')">
                        <i class="bi bi-pencil"></i> <!-- Ícono de editar -->
                    </button>
                </div>
            </div>
        `;
        productsSection.appendChild(productoDiv);
    });
}
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const productoNegocio = require('../negocio/productoNegocio');

console.log('qondaentre');

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
    const listaProductos = productos.map(p => {
        const diasDiferencia = calcularDiasHastaVencimiento(p.fechaVencimiento);

        if (diasDiferencia > 0) {
            return `${p.nombre}: caduca en ${diasDiferencia} días`;
        } else {
            return `${p.nombre}: caducado hace ${Math.abs(diasDiferencia)} días`;
        }

    }).join('\n');

    const mailOptions = {
        from: 'mdkmedicinas@gmail.com',
        to: 'mdkmedicinas@gmail.com',
        subject: 'Productos a punto de vencer',
        text: `Lista de productos próximos a caducar o caducados:\n\n${listaProductos}`
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

