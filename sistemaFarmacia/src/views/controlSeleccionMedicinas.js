
const ProductoNegocio = require('../negocio/ProductoNegocio'); // Asegúrate de que la ruta sea correcta
const productos = require('../dominio/producto');

document.addEventListener("DOMContentLoaded", () => {
    console.log('Document loaded, loading products...que me ves'); 
    cargarProductos(); // Asegúrate de que esta función esté definida en otro lugar
});
async function cargarProductos() {
    try {
        // Llamada a la capa de negocio para consultar productos
        const productos = await ProductoNegocio.obtenerTodosLosProductos();
        console.log('Productos consultados:', productos);
        mostrarProductos(productos); // Llama a la función para mostrar productos
    } catch (error) {
        console.error('Error al cargar los productos desde el index:', error);
    }
}


function mostrarProductos(productos) {
    const productsSection = document.querySelector('.products-section-bottom .row');
    productsSection.innerHTML = ''; // Limpiar el contenido existente

    productos.forEach(producto => {
        const productoDiv = document.createElement('div');
        productoDiv.className = 'col-md-4';
        productoDiv.innerHTML = `
            <div class="product">
                <h6>${producto.nombre}</h6>
                <p>$${producto.precio.toFixed(2)}</p>
                <div class="d-flex justify-content-center align-items-center">
                    <button class="btn btn-outline-primary" onclick="cambiarCantidad(this, -1)">-</button>
                    <input type="number" value="0" min="0" max="${producto.cantidad}" class="form-control mx-2 text-center cantidad-input" style="width: 70px;" 
                           oninput="validarCantidad(this, ${producto.cantidad})"> <!-- Validación de input -->
                    <button class="btn btn-outline-primary" onclick="cambiarCantidad(this, 1)">+</button>
                </div>
            </div>
        `;
        productsSection.appendChild(productoDiv);
    });
}



function validarCantidad(input, max) {
    let value = parseInt(input.value);

    // Verifica si el valor está fuera del rango permitido
    if (value < 0) {
        input.value = 0; // Establece a 0 si es menor que 0
    } else if (value > max) {
        input.value = max; // Establece al máximo si es mayor que el máximo
    }
}
// Función para cambiar la cantidad
function cambiarCantidad(button, cambio) {
    const input = button.parentNode.querySelector('.cantidad-input');
    let cantidadActual = parseInt(input.value);
    let nuevoCantidad = cantidadActual + cambio;

    // Verifica si el nuevo cantidad es válido
    if (nuevoCantidad < 0) {
        nuevoCantidad = 0; // No permitir cantidades negativas
    } else if (nuevoCantidad > parseInt(input.max)) {
        nuevoCantidad = parseInt(input.max); // No permitir sobrepasar la cantidad máxima
    }

    input.value = nuevoCantidad; // Actualiza el input

    // Actualiza el ticket con la nueva cantidad
    actualizarTicket(); 
}
function actualizarTicket() {
    const items = document.querySelectorAll('.products-section-bottom .product');
    const ticketSection = document.querySelector('.ticket');
    const productosContenedor = ticketSection.querySelector('.productos-contenedor'); // Obtener el contenedor de productos

    // Limpiar el contenido existente del contenedor de productos
    productosContenedor.innerHTML = ''; // Limpiar el contenido existente

    let total = 0;

    items.forEach(item => {
        const nombre = item.querySelector('h6').innerText;
        const precio = parseFloat(item.querySelector('p').innerText.replace('$', ''));
        const cantidad = parseInt(item.querySelector('.cantidad-input').value);

        if (cantidad > 0) {
            const subtotal = precio * cantidad;
            total += subtotal;

            // Crear un nuevo elemento en el ticket
            const newItem = document.createElement('div');
            newItem.className = 'item';
            newItem.innerHTML = `
                <span>${nombre}</span>
                <span>$${precio.toFixed(2)} x ${cantidad}</span>
            `;
            productosContenedor.appendChild(newItem); // Agregar al contenedor de productos
        }
    });

    // Calcular IVA y total final
    const iva = total * 0.16; // Suponiendo que el IVA es del 16%
    const totalConIva = total + iva;

    // Obtener el contenedor de totales
    const totalContainer = ticketSection.querySelector('.mt-auto');

    // Limpiar los elementos de totales existentes
    const totalItems = totalContainer.querySelectorAll('.total-item');
    totalItems.forEach(item => item.remove());

    // Crear y agregar nuevos elementos de totales
    const totalItem = document.createElement('div');
    totalItem.className = 'item total-item';
    totalItem.innerHTML = `<span><strong>Total:</strong></span><span>$${total.toFixed(2)}</span>`;
    totalContainer.appendChild(totalItem);

    const ivaItem = document.createElement('div');
    ivaItem.className = 'item total-item';
    ivaItem.innerHTML = `<span><strong>IVA:</strong></span><span>$${iva.toFixed(2)}</span>`;
    totalContainer.appendChild(ivaItem);

    const totalConIvaItem = document.createElement('div');
    totalConIvaItem.className = 'item total-item';
    totalConIvaItem.innerHTML = `<span><strong>Total con IVA:</strong></span><span>$${totalConIva.toFixed(2)}</span>`;
    totalContainer.appendChild(totalConIvaItem);
}





