const { ipcRenderer } = require('electron');

async function loadClientes() {
  try {
    const clientes = await ipcRenderer.invoke('get-clientes');
    renderClientes(clientes);
  } catch (error) {
    console.error('Error al cargar los clientes:', error);
  }
}

function renderClientes(clientes) {
  const clientList = document.getElementById('client-list');
  clientList.innerHTML = '';

  clientes.forEach(cliente => {
    const clientCard = document.createElement('div');
    clientCard.classList.add('client-card');
    clientCard.innerHTML = `
      <div class="client">
        <h6>${cliente.Nombre}</h6>
        <p>Teléfono: ${cliente.Telefono}</p>
        <div class="d-flex justify-content-center align-items-center">
          <button class="btn btn-outline-primary me-2" onclick="verHistorial('${cliente.Telefono}')">
            <i class="bi bi-clock"></i> <!-- Ícono de historial -->
          </button>
          <button class="btn btn-outline-warning me-2" onclick="editarCliente('${cliente.Telefono}')">
            <i class="bi bi-pencil"></i> <!-- Ícono de editar -->
          </button>
          <button class="btn btn-outline-danger" onclick="eliminarCliente('${cliente.Telefono}')">
            <i class="bi bi-trash"></i> <!-- Ícono de borrar -->
          </button>
        </div>
      </div>
    `;
    clientList.appendChild(clientCard);
  });
}
let clienteAEliminar = null;

function eliminarCliente(telefono) {
  clienteAEliminar = telefono;
  console.log("entre")
  const deleteModal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
  deleteModal.show();
}
document.getElementById('confirmDeleteButton').addEventListener('click', async () => {
  if (clienteAEliminar) {
    try {
      await ipcRenderer.invoke('delete-cliente', clienteAEliminar);
      clienteAEliminar = null;
      loadClientes();
      const deleteModal = bootstrap.Modal.getInstance(document.getElementById('confirmDeleteModal'));
      deleteModal.hide();
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
    }
  }
});
function verHistorial(telefono) {
  ipcRenderer.send('open-historial', telefono);
}
function editarCliente(telefono) {
  clienteAEditar = telefono;

  // Mostrar el modal para editar el nombre
  const editNameModal = new bootstrap.Modal(document.getElementById('editNameModal'));
  editNameModal.show();
}
document.getElementById('confirmEditButton').addEventListener('click', async () => {
  const nuevoNombre = document.getElementById('newNameInput').value.trim();
  const errorMessage = document.getElementById('error-message');

  if (!nuevoNombre) {
    // Mostrar error si el nombre está vacío
    errorMessage.style.display = 'block';
  } else {
    // Ocultar el error y proceder con la actualización
    errorMessage.style.display = 'none';

    try {
      await ipcRenderer.invoke('update-client-name', clienteAEditar, nuevoNombre);
      clienteAEditar = null;
      loadClientes();
      const editNameModal = bootstrap.Modal.getInstance(document.getElementById('editNameModal'));
      editNameModal.hide();
    } catch (error) {
      console.error('Error al editar el nombre del cliente:', error);
    }
  }
});
document.getElementById('search-button').addEventListener('click', async () => {
  const searchQuery = document.getElementById('search-input').value;
  try {
    const clientes = await ipcRenderer.invoke('search-clientes', searchQuery);
    renderClientes(clientes);
  } catch (error) {
    console.error('Error al buscar clientes:', error);
  }
});

loadClientes();
