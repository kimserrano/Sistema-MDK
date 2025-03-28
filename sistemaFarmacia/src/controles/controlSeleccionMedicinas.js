const ProductoNegocio = require('../negocio/productoNegocio');
const VentaNegocio = require('../negocio/ventaNegocio');
const productos = require('../dominio/producto');
const { getClienteSeleccionado, setClienteSeleccionado } = require('../controles/controlCliente');
const cajeroActivo = JSON.parse(localStorage.getItem('cajeroActivo'));
const { ipcRenderer } = require('electron');

document.addEventListener("DOMContentLoaded", () => {

    obtenerTodosLosProductos();
    const buscarInput = document.getElementById('buscarProducto');
    const buscarBtn = document.querySelector('.btn-primary.rounded');

    // Ejecuta la búsqueda cada vez que se escribe en el campo de texto
    buscarInput.addEventListener('input', buscarProductos);

    // Ejecuta la búsqueda cuando se presiona el botón
    buscarBtn.addEventListener('click', buscarProductos);// Asegúrate de que esta función esté definida en otro lugar
    const btnBuscar = document.getElementById('btnBuscarCliente');
    const btnLimpiar = document.getElementById('btnLimpiarCliente');

    // Al presionar el botón "Buscar", ejecutamos la función vaciasTicket
    btnBuscar.addEventListener('click', () => {
        vaciarTicket(); // Llamada al método vaciasTicket
    });

    // Al presionar el botón "Limpiar", ejecutamos la función vaciasTicket
    btnLimpiar.addEventListener('click', () => {
        vaciarTicket(); // Llamada al método vaciasTicket
    });
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
       // Verificar si la fecha de vencimiento existe y si está vencida
       let fechaVencimiento = 'Sin fecha';
       let estiloVencido = '';
       let botonDeshabilitado = '';
       if (producto.fechaVencimiento) {
           const hoy = new Date();
           hoy.setHours(0, 0, 0, 0);
           const fechaProducto = new Date(producto.fechaVencimiento);
           fechaProducto.setHours(0, 0, 0, 0);
           const esVencido = fechaProducto < hoy; // Producto vencido si la fecha es menor a hoy
    
           if (esVencido ) {
               fechaVencimiento = `Vencido: ${formatearFecha(producto.fechaVencimiento)}`;
               estiloVencido = 'style="color: red; font-weight: bold;"'; // Estilo para productos vencidos
               botonDeshabilitado = 'disabled';
           } else {
               fechaVencimiento = `Vence: ${formatearFecha(producto.fechaVencimiento)}`;
           }
       }

        productoDiv.innerHTML = `
            <div class="product">
                <h6>${producto.nombre}</h6>
                <p>$${producto.precio.toFixed(2)}</p>
              <p ${estiloVencido}>${fechaVencimiento}</p> 
                 <div class="d-flex justify-content-center align-items-center mb-3">
            <div class="d-flex align-items-center">
                <p class="mb-0 mr-2">Código:</p>
                <p class="product-id mb-0">${producto.id}</p> <!-- Código al lado de 'Código:' -->
            </div>
        </div>
                <div class="d-flex justify-content-center align-items-center">
                    <button class="btn btn-outline-primary" onclick="cambiarCantidad(this, -1)">-</button>
                    <input type="number" value="0" min="0" max="${producto.cantidad}" class="form-control mx-2 text-center cantidad-input" style="width: 70px;" 
                           oninput="validarCantidad(this, ${producto.cantidad})"> <!-- Validación de input -->
                    <button class="btn btn-outline-primary" onclick="cambiarCantidad(this, 1)" ${botonDeshabilitado}>+</button>
                </div>
            </div>
        `;
        productsSection.appendChild(productoDiv);
    });
}



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

// Función para formatear la fecha
function formatearFecha(fechaStr) {
    const fecha = new Date(fechaStr);
    const opciones = { month: 'short', day: 'numeric', year: 'numeric' }; // Formato: "Nov 12, 2024"
    return fecha.toLocaleDateString('en-US', opciones);
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
                <p id="fecha"></p>
                <p class="product-id">${producto.id}</p> 
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
async function verificarVentas(telefonoCliente) {
    try {
        const cantidadVentas = await VentaNegocio.obtenerCantidadVentasPorTelefono(telefonoCliente);

        // Retornar true si tiene 2 o más compras (aplica descuento)
        console.log("tiene" + cantidadVentas)
        if (cantidadVentas >= 5) {
            return true
        } else {
            return false;
        }

    } catch (error) {
        console.error('Error:', error);
        return false; // Retorna false si ocurre un error
    }
}

async function actualizarTicket() {
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
        const idProducto = item.querySelector('.product-id').innerText;

        if (cantidad > 0) {
            const subtotal = precio * cantidad;
            total += subtotal;

            // Crear un nuevo elemento en el ticket
            const newItem = document.createElement('div');
            newItem.className = 'item';
            newItem.setAttribute('data-id', idProducto);
            newItem.innerHTML = `
                <span class="nombre">${nombre}</span>
                <span class="id-producto">${idProducto}</span>
                <span class="cantidad-precio">$${precio.toFixed(2)} x ${cantidad}</span>
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

    // Obtener el cliente seleccionado
    const clienteSeleccionado = getClienteSeleccionado();
    if (clienteSeleccionado !== null) {
        // Obtener el teléfono del cliente seleccionado
        const telefonoCliente = clienteSeleccionado.telefono;
        console.log(telefonoCliente);
        // Obtener la cantidad de ventas del cliente usando su teléfono

        // Aplicar descuento si tiene 2 o más compras
        const v = await verificarVentas(telefonoCliente);
        if (v) {
            const descuento = total * 0.10; // 10% de descuento
            const totalConDescuento = total - descuento;
            // Crear y agregar el elemento de descuento
            const descuentoItem = document.createElement('div');
            descuentoItem.className = 'item total-item';
            descuentoItem.innerHTML = `<span><strong>Descuento:</strong></span><span>-$${descuento.toFixed(2)}</span>`;
            totalContainer.appendChild(descuentoItem);

            // Crear y agregar el total con descuento
            const totalConDescuentoItem = document.createElement('div');
            totalConDescuentoItem.className = 'item total-item';
            totalConDescuentoItem.innerHTML = `<span><strong>Total con descuento:</strong></span><span>$${totalConDescuento.toFixed(2)}</span>`;
            totalContainer.appendChild(totalConDescuentoItem);
        }
    }

    const ivaItem = document.createElement('div');
    ivaItem.className = 'item total-item';
    ivaItem.innerHTML = `<span><strong>IVAs:</strong></span><span>$${iva.toFixed(2)}</span>`;
    totalContainer.appendChild(ivaItem);

    const totalConIvaItem = document.createElement('div');
    totalConIvaItem.className = 'item total-item';
    totalConIvaItem.innerHTML = `<span><strong>Total con IVA:</strong></span><span>$${totalConIva.toFixed(2)}</span>`;
    totalContainer.appendChild(totalConIvaItem);



}


function vaciarTicket() {
    const ticketSection = document.querySelector('.ticket');
    const productosContenedor = ticketSection.querySelector('.productos-contenedor'); // Contenedor de productos
    const totalContainer = ticketSection.querySelector('.mt-auto'); // Contenedor de totales
    const clienteTicket = document.getElementById('ClienteTicket'); // Elemento del cliente
    const buscarClienteInput = document.getElementById('buscarCliente'); // Input del cliente

    // Limpiar el contenido de los productos
    productosContenedor.innerHTML = '';

    // Limpiar los totales
    const totalItems = totalContainer.querySelectorAll('.total-item');
    totalItems.forEach(item => item.remove());

    const totalItem = document.createElement('div');
    totalItem.className = 'item total-item';
    totalItem.innerHTML = `<span><strong>Total:</strong></span><span>$0.00</span>`;
    totalContainer.appendChild(totalItem);

    const ivaItem = document.createElement('div');
    ivaItem.className = 'item total-item';
    ivaItem.innerHTML = `<span><strong>IVA:</strong></span><span>$0.00</span>`;
    totalContainer.appendChild(ivaItem);

    const totalConIvaItem = document.createElement('div');
    totalConIvaItem.className = 'item total-item';
    totalConIvaItem.innerHTML = `<span><strong>Total con IVA:</strong></span><span>$0.00</span>`;
    totalContainer.appendChild(totalConIvaItem);

    // Resetear las cantidades de los productos a 0
    const cantidadInputs = document.querySelectorAll('.products-section-bottom .cantidad-input');
    cantidadInputs.forEach(input => {
        input.value = 0;
    });


    // Resetear el cliente a "Público en general"
    clienteTicket.innerHTML = '<strong>Cliente: Público en general</strong>';
    // Limpiar el input de buscar cliente
    buscarClienteInput.value = '';
}

// Función para capturar el contenido del ticket
function guardarTicket() {
    const items = document.querySelectorAll('.productos-contenedor .item');
    let ticketContenido = "Ticket de Compra\n\n";
    const cliente = getClienteSeleccionado();

    if (cliente) {
        ticketContenido += `Cliente: ${cliente.nombre}\nTeléfono: ${cliente.telefono}\n\n`;
    } else {
        ticketContenido += `Cliente: público en general\n\n`;
    }

    if (cajeroActivo) {
        ticketContenido += `Cajero: ${cajeroActivo.Usuario}\n\n`;
    }

    const productos = [];

    // Verifica si hay productos antes de procesar
    if (items.length === 0) {
        Swal.fire({
            title: 'Error',
            text: 'No puedes procesar un pago vacío. Agrega productos al carrito.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
        return;  // Detiene la ejecución si no hay productos
    }

    // Recopilar los productos y sus detalles
    items.forEach(item => {
        const nombre = item.querySelector('.nombre').innerText;
        const cantidadPrecio = item.querySelector('.cantidad-precio').innerText;
        const idProducto = item.getAttribute('data-id');

        ticketContenido += `${nombre} ${cantidadPrecio}\n`;
        productos.push({
            nombre: nombre,
            id: idProducto,
            cantidad: parseInt(cantidadPrecio.split(' x ')[1]) // Extraer la cantidad después de la "x"
        });
    });

    // Total, IVA y total con IVA
    const total = document.querySelector('.mt-auto .item:nth-child(1) span:last-child').innerText;
    const iva = document.querySelector('.mt-auto .item:nth-child(2) span:last-child').innerText;
    let totalConIva = document.querySelector('.mt-auto .item:nth-child(3) span:last-child').innerText;

    ticketContenido += `\nTotal: ${total}\nIVA: ${iva}\nTotal con IVA: ${totalConIva}`;

    totalConIva = parseFloat(totalConIva.replace('$', '').trim());

    // Crear el objeto venta
    const venta = {
        fecha: new Date(),
        total: totalConIva,
        usuarioCajero: cajeroActivo ? cajeroActivo.Usuario : 'Desconocido',
        telefono: cliente ? cliente.telefono : null
    };

    // Registrar la venta
    VentaNegocio.registrarVenta(venta)
        .then(idVenta => {
            // Una vez que se registre la venta, registrar los productos
            productos.forEach(producto => {
                VentaNegocio.registrarVentaProducto(idVenta, producto.nombre, producto.cantidad)
                    .then(() => {
                        // Actualizar la cantidad del producto en la base de datos
                        ProductoNegocio.reducirInventario(parseInt(producto.id, 10), producto.cantidad);
                    })
                    .catch(err => {
                        console.error('Error al registrar el producto:', err);
                    });
            });

            // Enviar el contenido del ticket al proceso principal
            const { ipcRenderer } = require('electron');
            ipcRenderer.send('guardar-ticket', ticketContenido);

            // Mostrar mensaje de confirmación
            ipcRenderer.once('ticket-guardado', (event, result) => {
                if (result.success) {
                    Swal.fire({
                        title: '¡Imprimiendo Ticket!',
                        text: 'La venta ha sido registrada correctamente',
                        icon: 'success',
                        confirmButtonText: 'Aceptar'
                    });
                    setClienteSeleccionado(null);
                    vaciarTicket();
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: 'No se pudo procesar la compra.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    });
                }
            });
        })
        .catch(error => {
            console.error('Error al registrar la venta:', error);
            Swal.fire({
                title: 'Error',
                text: 'No se pudo registrar la venta.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        });
}


function verHistorial(telefono) {
    ipcRenderer.send('open-historial', telefono);
}


// Añadir eventListener al botón "Pagar"
const botonPagar = document.querySelector('.btn.btn-primary');
botonPagar.addEventListener('click', guardarTicket);




