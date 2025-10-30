document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registroForm");

    if (!form) {
        console.error("❌ Formulario de registro no encontrado.");
        return;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const apellidoPaterno = document.getElementById("apellido-paterno").value.trim();
        const apellidoMaterno = document.getElementById("apellido-materno").value.trim();
        const email = document.getElementById("email").value.trim();
        const contrasena = document.getElementById("contrasena").value.trim();
        const fechaNacimiento = document.getElementById("fecha-nacimiento").value;
        const edad = document.getElementById("edad").value;
        const confirmarContrasena = document.getElementById("confirmarContrasena").value.trim();
        const terminos = document.getElementById("terms").checked;

        if (!nombre || !apellidoPaterno || !apellidoMaterno || !email || !contrasena || !fechaNacimiento || !edad || !confirmarContrasena) {
            alert("Completa todos los campos obligatorios.");
            return;
        }


        if (contrasena !== confirmarContrasena) {
        alert("Las contraseñas no coinciden.");
        return;
        }

        if (!terminos) {
        alert("Debes aceptar los términos y condiciones.");
        return;
        }

        try {
            const response = await fetch("http://localhost:8080/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        nombre,
        apellidoPaterno,
        apellidoMaterno,
        email,
        contrasena,
        confirmarContrasena: contrasena,
        edad: parseInt(edad)
    })
});

            if (!response.ok) {
                const errorText = await response.text();
                alert("Error al registrarse: " + errorText);
                return;
            }

            alert("✅ Registro exitoso. Ahora puedes iniciar sesión.");
            window.location.href = "login.html";
        } catch (error) {
            console.error("❌ Error al conectar con el servidor:", error);
            alert("Hubo un problema al conectar con el servidor.");
        }
    });
});
