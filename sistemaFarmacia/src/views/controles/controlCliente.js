
const ClienteNegocio = require('../negocio/ClienteNegocio');
const Cliente = require('../dominio/Cliente');


document.addEventListener("DOMContentLoaded", () => {
    const nombreInput = document.getElementById("nombre");
    const telefonoInput = document.getElementById("telefono");
    const form = document.querySelector("form");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();  // Evitar el comportamiento por defecto del formulario

        // Obtener los valores de los inputs
        const nombre = nombreInput.value.trim();
        const telefono = telefonoInput.value.trim();
       
        const nuevoCliente = new Cliente(telefono, nombre);

    await ClienteNegocio.agregarCliente(telefono, nombre);
    
    
        // Limpiar el formulario después de enviar los datos
        form.reset();
        
    });
});
