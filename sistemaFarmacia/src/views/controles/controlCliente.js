
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
