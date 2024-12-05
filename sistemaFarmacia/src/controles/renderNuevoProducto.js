const ProductoNegocio = require('../negocio/productoNegocio');

document.getElementById('nuevo-producto-form').addEventListener('submit', async (event) => {
    event.preventDefault(); 
    
    const nombreInput = document.getElementById('nombreProducto');
    const fechaVencimientoInput = document.getElementById('fechaVencimiento');
    const loteInput = document.getElementById('loteProducto');
    const precioInput = document.getElementById('precioProducto');
    const cantidadInput = document.getElementById('cantidadProducto');

    const nombre = nombreInput.value;
    const fechaVencimiento = fechaVencimientoInput.value;
    const lote = loteInput.value;
    const precio = Number(precioInput.value);
    const cantidad = Number(cantidadInput.value);

    try {
        await ProductoNegocio.crearProducto({nombre, lote, cantidad, precio, fechaVencimiento});
        
        Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'El producto se ha agregado con éxito.',
        });

        // Limpiar los campos del formulario
        nombreInput.value = '';
        fechaVencimientoInput.value = '';
        loteInput.value = '';
        precioInput.value = '';
        cantidadInput.value = '';

    } catch (error) {
        console.error('Error al agregar producto:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'Hubo un problema al agregar el producto.',
        });
    }
});
