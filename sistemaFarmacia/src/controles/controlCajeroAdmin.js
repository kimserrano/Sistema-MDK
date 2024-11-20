const CajeroAdminNegocio = require('../negocio/CajeroAdminNegocio');

document.addEventListener("DOMContentLoaded", () => {
    const usuarioInput = document.getElementById("username");
    const contraInput = document.getElementById("password");
    const form = document.querySelector("form");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();  // Evitar el comportamiento por defecto del formulario

        const usuario = usuarioInput.value.trim();
        const contra = contraInput.value.trim();
        const esAdmin = document.querySelector('input[name="admin"]:checked').value;

        try {
            await CajeroAdminNegocio.agregarCajeroAdmin(usuario, contra, esAdmin);

            Swal.fire({
                icon: 'success',
                title: 'Agregado',
                text: 'El trabajador ha sido agregado exitosamente.',
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
