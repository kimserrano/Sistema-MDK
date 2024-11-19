const ClienteNegocio = require('../negocio/clienteNegocio');
const { ipcRenderer } = require('electron');

const historialCompras = document.getElementById('historialCompras').querySelector('tbody');
const searchProducto = document.getElementById('searchProducto');
const fechaInicio = document.getElementById('fechaInicio');
const fechaFin = document.getElementById('fechaFin');
const filtrarBtn = document.getElementById('filtrarBtn');
let telef

ipcRenderer.on('cargar-historial', (event, telefono) => {
    cargarHistorial(telefono); // Cargar historial sin filtros al inicio
});

// Agregar evento al botón de filtrar
filtrarBtn.addEventListener('click', () => {
    const filtroProducto = searchProducto.value; // Obtener el valor del filtro de producto
    const filtroFechaInicio = fechaInicio.value; // Obtener la fecha de inicio
    const filtroFechaFin = fechaFin.value; // Obtener la fecha de fin
    cargarHistorial(telef, filtroProducto, filtroFechaInicio, filtroFechaFin);
});

async function cargarHistorial(telefono, filtroProducto = '', filtroFechaInicio = '', filtroFechaFin = '') {
    try {
        telef = telefono
        const { compras } = await ClienteNegocio.getHistorialCompras(telefono);

        const comprasFiltradas = compras.filter(compra => {
            const coincideProducto = filtroProducto ? compra.Producto.toLowerCase().includes(filtroProducto.toLowerCase()) : true;
            const coincideFechaInicio = filtroFechaInicio ? new Date(compra.Fecha) >= new Date(filtroFechaInicio) : true;
            const coincideFechaFin = filtroFechaFin ? new Date(compra.Fecha) <= new Date(filtroFechaFin) : true;
            return coincideProducto && coincideFechaInicio && coincideFechaFin;
        });

        historialCompras.innerHTML = '';

        comprasFiltradas.forEach(compra => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${new Date(compra.Fecha).toLocaleDateString()}</td>
                <td>${compra.Producto}</td>
                <td>${compra.Cantidad}</td>
                <td>$${compra.Precio.toFixed(2)}</td>
                <td>${compra.Lote}</td>
            `;
            historialCompras.appendChild(row);
        });
    } catch (error) {
        console.error('Error al cargar el historial de compras:', error);
        alert('No se pudo cargar el historial de compras. Inténtalo de nuevo.');
    }
}
