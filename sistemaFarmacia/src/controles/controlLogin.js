const CajeroAdminNegocio = require('../negocio/CajeroAdminNegocio');

document.addEventListener("DOMContentLoaded", () => {
    const usuarioInput = document.getElementById("usuario");
    const contraInput = document.getElementById("password");
    const form = document.querySelector("form");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();  // Evitar el comportamiento por defecto del formulario

        const usuario = usuarioInput.value.trim();
        const contra = contraInput.value.trim();

        try {
            const resultado = await CajeroAdminNegocio.iniciarSesionTrabajador(usuario, contra);
            console.log(resultado);
            if (resultado.tipo === 'cajero') {
                window.location.href = '../views/seleccionMedicinas.html';
            } else if (resultado.tipo === 'administrador') {
                window.location.href = '../views/inventario.html';
            }


        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message,
            });
        }
    });
});
