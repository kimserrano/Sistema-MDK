
const ClienteNegocio = require('../negocio/ClienteNegocio');

document.addEventListener("DOMContentLoaded", () => {
    const nombreInput = document.getElementById("nombre");
    const telefonoInput = document.getElementById("telefono");
    const form = document.querySelector("form");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();  // Evitar el comportamiento por defecto del formulario

        // Obtener los valores de los inputs
        const nombre = nombreInput.value.trim();
        const telefono = telefonoInput.value.trim();

        try {
            // Intentar agregar el cliente
            await ClienteNegocio.agregarCliente(telefono, nombre);

            Swal.fire({
                icon: 'success',
                title: 'Cliente agregado',
                text: 'El cliente ha sido agregado exitosamente.',
            });

            // Limpiar el formulario después de enviar los datos
            form.reset();
        } catch (error) {
            // Mostrar el error como una alerta
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message,
            });
        }

    });
});



//BUSQUEDA 
document.addEventListener("DOMContentLoaded", () => {
    const buscarClienteInput = document.getElementById("buscarCliente");
    const buscarClienteBtn = document.getElementById("btnBuscarCliente");
    const clienteTicket = document.getElementById("ClienteTicket");

    // Evento para buscar cliente cuando se hace clic en el botón
    buscarClienteBtn.addEventListener("click", async () => {
        const nombre = buscarClienteInput.value.trim();
        
        if (nombre !== "") {
            try {
                let clientes;
                
                // Verifica si el nombre es un número (teléfono)
                if (/^\d+$/.test(nombre)) {
                    // Si es un número, buscar por teléfono
                    clientes = await ClienteNegocio.buscarClientePorTelefono(nombre);
                } else {
                    // Si no es un número, buscar por nombre
                    clientes = await ClienteNegocio.buscarClientePorNombre(nombre);
                }
                
                if (clientes.length > 0) {
                    // Cerrar el modal anterior si existe
                    const existingModal = document.getElementById('modalClientes');
                    if (existingModal) {
                        existingModal.remove();
                    }

                    // Crear y mostrar el modal con los resultados de búsqueda
                    crearModalClientes(clientes);
                } else {
                    // Mostrar alerta de SweetAlert si no hay clientes
                    Swal.fire({
                        icon: 'info',
                        title: 'Sin resultados',
                        text: 'No se encontraron clientes con ese nombre o teléfono.',
                    });
                }
            } catch (error) {
                // Manejo del error con SweetAlert
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `Ocurrió un error al buscar clientes: ${error.message}`,
                });
            }
        } else {
            // Mostrar una alerta si el campo de búsqueda está vacío
            Swal.fire({
                icon: 'warning',
                title: 'Campo vacío',
                text: 'Por favor ingresa un nombre o teléfono para buscar.',
            });
        }
    });

    // Función para crear el modal dinámicamente con los resultados
    function crearModalClientes(clientes) {
        // Crear el modal HTML dinámicamente
        const modalHTML = `
            <div class="modal fade" id="modalClientes" tabindex="-1" aria-labelledby="modalClientesLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="modalClientesLabel">Seleccionar Cliente</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <ul id="listaClientes" class="list-group">
                                ${clientes.map(cliente => `
                                    <li class="list-group-item list-group-item-action" data-nombre="${cliente.Nombre}" data-telefono="${cliente.Telefono}">
                                        ${cliente.Nombre} - ${cliente.Telefono}
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Insertar el modal en el body del documento
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Mostrar el modal
        const modalClientes = new bootstrap.Modal(document.getElementById('modalClientes'));
        modalClientes.show();

        // Añadir evento de selección de cliente
        const listaClientes = document.getElementById("listaClientes");
        listaClientes.addEventListener("click", (event) => {
            const clienteSeleccionado = event.target.getAttribute("data-nombre");
            const telefonoSeleccionado = event.target.getAttribute("data-telefono");
            
            if (clienteSeleccionado && telefonoSeleccionado) {
                // Actualizar el nombre del cliente en el ticket
                clienteTicket.innerHTML = `<strong>Cliente: ${clienteSeleccionado}</strong>`;
                
                // Cerrar el modal
                modalClientes.hide();
                // Remover el modal del DOM después de cerrarlo
                document.getElementById('modalClientes').remove();
            }
        });
    }
});
