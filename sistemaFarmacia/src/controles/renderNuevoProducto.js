const ProductoNegocio = require('../negocio/productoNegocio');

document.getElementById('nuevo-producto-form').addEventListener('submit', async (event) => {
    event.preventDefault(); 
    
    const nombre = document.getElementById('nombreProducto').value;
    const fechaVencimiento = document.getElementById('fechaVencimiento').value;
    const lote = document.getElementById('loteProducto').value;
    const precio = Number(document.getElementById('precioProducto').value);
    const cantidad = Number(document.getElementById('cantidadProducto').value);

    try {
        await ProductoNegocio.crearProducto({nombre, lote, cantidad, precio, fechaVencimiento}).then((r)=>{
            alert('El producto se a agregado con exito!!')
        });

    } catch (error) {
        console.error('Error al agregar producto:', error);
        alert(error);
    }
});
