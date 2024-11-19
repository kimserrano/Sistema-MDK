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

function verHistorial(telefono) {
  ipcRenderer.send('open-historial', telefono);
}

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
