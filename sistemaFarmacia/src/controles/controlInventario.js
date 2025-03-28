
const ProductoNegocio = require('../negocio/productoNegocio'); // Asegúrate de que la ruta sea correcta
const productos = require('../dominio/producto');


document.addEventListener("DOMContentLoaded", () => {
    console.log('Document loaded, loading products...');
    
    // Agregar el evento al botón de búsqueda
    obtenerTodosLosProductos();
    const buscarInput = document.getElementById('buscarProducto');
    const buscarBtn = document.querySelector('.btn-primary.rounded'); 

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
                    <button class="btn btn-outline-danger me-2" onclick="borrarProducto(${producto.id})">
                        <i class="bi bi-trash"></i> <!-- Ícono de borrar -->
                    </button>
                    <button class="btn btn-outline-primary" onclick="editarProducto(${producto.id})">
                        <i class="bi bi-pencil"></i> <!-- Ícono de editar -->
                    </button>
                </div>
            </div>
        `;
        productsSection.appendChild(productoDiv);
    });
}

async function editarProducto(productoId) {
    try {
        const producto = await ProductoNegocio.obtenerProductoPorId(productoId);

        if (!producto) {
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Producto no encontrado.',
            });
            return;
        }

        const { value: formValues } = await Swal.fire({
            title: 'Editar Producto',
            html: `
                <div class="modal-editar-producto">
                    <div class="form-group">
                        <label for="nombreProducto">Nombre</label>
                        <input id="nombreProducto" class="swal2-input" value="${producto.nombre}">
                    </div>
                    <div class="form-group">
                        <label for="precioProducto">Precio</label>
                        <input id="precioProducto" type="number" class="swal2-input" value="${producto.precio}">
                    </div>
                    <div class="form-group">
                        <label for="cantidadProducto">Cantidad</label>
                        <input id="cantidadProducto" type="number" class="swal2-input" value="${producto.cantidad}">
                    </div>
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            customClass: {
                popup: 'modal-editar-producto-popup'
            },
            preConfirm: () => {
                return {
                    nombre: document.getElementById('nombreProducto').value.trim(),
                    precio: parseFloat(document.getElementById('precioProducto').value),
                    cantidad: parseInt(document.getElementById('cantidadProducto').value)
                };
            }
        });
        

        if (formValues) {
            let nuevoNombre = producto.nombre !== formValues.nombre;

            producto.nombre = formValues.nombre;
            producto.precio = formValues.precio;
            producto.cantidad = formValues.cantidad;
            producto.fechaVencimiento = formatoFechaSQL(producto.fechaVencimiento);

            await ProductoNegocio.actualizarProducto(productoId, producto, nuevoNombre);

            await Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Producto actualizado exitosamente.',
            });

            obtenerTodosLosProductos();
        }
    } catch (error) {
        console.error('Error al editar producto:', error);
        await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al editar el producto. Inténtelo de nuevo más tarde.',
        });
    }
}


function formatoFechaSQL(fecha) {
    const date = new Date(fecha);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

async function borrarProducto(productoId) {
    try {
        const confirmacion = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'No podrás recuperar este producto después de eliminarlo.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (confirmacion.isConfirmed) {
            await ProductoNegocio.eliminarProducto(productoId);
            Swal.fire('Eliminado', 'El producto ha sido eliminado.', 'success');
            obtenerTodosLosProductos();
        }
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        Swal.fire('Error', 'No se pudo eliminar el producto. Inténtalo de nuevo.', 'error');
    }
}

