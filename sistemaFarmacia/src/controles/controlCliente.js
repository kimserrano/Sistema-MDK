const ClienteNegocio = require('../negocio/clienteNegocio');

document.addEventListener("DOMContentLoaded", () => {
    const nombreInput = document.getElementById("nombre");
    const telefonoInput = document.getElementById("telefono");
    const form = document.querySelector("form");
    

    form.addEventListener("submit", async (event) => {
        event.preventDefault();  // Evitar el comportamiento por defecto del formulario

        const nombre = nombreInput.value.trim();
        const telefono = telefonoInput.value.trim();

        try {
            await ClienteNegocio.agregarCliente(telefono, nombre);

            Swal.fire({
                icon: 'success',
                title: 'Cliente agregado',
                text: 'El cliente ha sido agregado exitosamente.',
            });

            form.reset();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message,
            });
        }
    });
});

// BUSQUEDA
document.addEventListener("DOMContentLoaded", () => {
    const buscarClienteInput = document.getElementById("buscarCliente");
    const buscarClienteBtn = document.getElementById("btnBuscarCliente");
    const clienteTicket = document.getElementById("ClienteTicket");

    const btnLimpiar = document.getElementById('btnLimpiarCliente');
    const inputCliente = document.getElementById('buscarCliente');

    btnLimpiar.addEventListener('click', function() {
        inputCliente.value = '';
        clienteTicket.innerHTML = `<strong>Cliente: Público en general</strong>`;
      });


    buscarClienteBtn.addEventListener("click", async () => {
        const nombre = buscarClienteInput.value.trim();

        if (nombre !== "") {
            try {
                let clientes;

                if (/^\d+$/.test(nombre)) {
                    clientes = await ClienteNegocio.buscarClientePorTelefono(nombre);
                } else {
                    clientes = await ClienteNegocio.buscarClientePorNombre(nombre);
                }

                if (clientes.length > 0) {
                    const existingModal = document.getElementById('modalClientes');
                    if (existingModal) existingModal.remove();

                    crearModalClientes(clientes);
                } else {
                    Swal.fire({
                        icon: 'info',
                        title: 'Sin resultados',
                        text: 'No se encontraron clientes con ese nombre o teléfono.',
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `Ocurrió un error al buscar clientes: ${error.message}`,
                });
            }
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Campo vacío',
                text: 'Por favor ingresa un nombre o teléfono para buscar.',
            });
        }
    });

    function crearModalClientes(clientes) {
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
                                    <li class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" data-nombre="${cliente.Nombre}" data-telefono="${cliente.Telefono}">
                                        <div>
                                            <h6 class="mb-1">${cliente.Nombre}</h6>
                                            <p class="mb-1">${cliente.Telefono}</p>
                                        </div>
                                        <div>
                                            <button class="btn btn-outline-primary" onclick="verHistorial('${cliente.Telefono}')">
                                                <i class="bi bi-clock"></i>
                                            </button>
                                            <button class="btn btn-outline-secondary" onclick="editarCliente('${cliente.Telefono}')">
                                                <i class="bi bi-pencil"></i>
                                            </button>
                                            <button class="btn btn-outline-danger" onclick="eliminarCliente('${cliente.Telefono}')">
                                                <i class="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        const modalClientes = new bootstrap.Modal(document.getElementById('modalClientes'));
        modalClientes.show();

        const listaClientes = document.getElementById("listaClientes");
        listaClientes.addEventListener("click", (event) => {
            const clienteSeleccionado = event.target.closest('li');
            if (clienteSeleccionado) {
                const nombre = clienteSeleccionado.getAttribute("data-nombre");
                const telefono = clienteSeleccionado.getAttribute("data-telefono");

                clienteTicket.innerHTML = `<strong>Cliente: ${nombre}</strong>`;

                modalClientes.hide();
                document.getElementById('modalClientes').remove();
            }
        });
    }
});
