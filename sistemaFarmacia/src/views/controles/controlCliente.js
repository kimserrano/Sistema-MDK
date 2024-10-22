
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



//PROBAR BUSQUEDA 
// Función para probar la búsqueda de un cliente por teléfono
async function probarBuscarPorTelefono(telefono) {
    try {
        const cliente = await ClienteNegocio.buscarClientePorTelefono(telefono);
        if (cliente) {
            console.log('Cliente encontrado por teléfono:', cliente);
        } else {
            console.log('No se encontró ningún cliente con el teléfono:', telefono);
        }
    } catch (error) {
        console.error('Error al buscar el cliente por teléfono:', error.message);
    }
}

// Función para probar la búsqueda de clientes por nombre
async function probarBuscarPorNombre(nombre) {
    try {
        const clientes = await ClienteNegocio.buscarClientePorNombre(nombre);
        if (clientes.length > 0) {
            console.log('Clientes encontrados con el nombre:', nombre, clientes);
        } else {
            console.log('No se encontró ningún cliente con el nombre:', nombre);
        }
    } catch (error) {
        console.error('Error al buscar clientes por nombre:', error.message);
    }
}

// Probar búsquedas
(async function probarBusquedas() {
    // Probar búsqueda por teléfono
    console.log("Probando búsqueda por teléfono...");
    await probarBuscarPorTelefono('6442326038');  // Cambia este número para pruebas

    // Probar búsqueda por nombre
    console.log("Probando búsqueda por nombre...");
    await probarBuscarPorNombre('Juan');  // Cambia este nombre para pruebas
})();
