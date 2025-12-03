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

        // Validaciones
        if (!nombre || !apellidoPaterno || !apellidoMaterno || !email || !contrasena || !fechaNacimiento || !edad || !confirmarContrasena) {
            alert("⚠️ Completa todos los campos obligatorios.");
            return;
        }

        if (contrasena !== confirmarContrasena) {
            alert("⚠️ Las contraseñas no coinciden.");
            return;
        }

        if (!terminos) {
            alert("⚠️ Debes aceptar los términos y condiciones.");
            return;
        }

        if (contrasena.length < 8) {
            alert("⚠️ La contraseña debe tener al menos 8 caracteres.");
            return;
        }

        // Mostrar estado de carga
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = "Registrando...";
        submitBtn.disabled = true;
        submitBtn.classList.add('btn-loading');

        try {
            const response = await fetch("http://localhost:8080/api/auth/register", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    nombre,
                    apellidoPaterno,
                    apellidoMaterno,
                    email,
                    contrasena,
                    confirmarContrasena: contrasena,
                    edad: parseInt(edad),
                    rol: "usuario",
                    fechaRegistro: new Date().toISOString(),
                    foto: null 
                })
            });

            console.log("✅ Estado de respuesta:", response.status);

            // Leer la respuesta como texto primero
            const responseText = await response.text();
            console.log("📄 Respuesta del servidor:", responseText);

            if (!response.ok) {
                // Intentar parsear como JSON si es un error estructurado
                try {
                    const errorData = JSON.parse(responseText);
                    throw new Error(errorData.message || errorData || "Error desconocido en el registro");
                } catch {
                    // Si no es JSON, usar el texto como error
                    throw new Error(responseText || "Error en el servidor");
                }
            }

            // Intentar parsear la respuesta exitosa como JSON
            let userData;
            try {
                userData = JSON.parse(responseText);
                console.log("✅ Datos del usuario registrado:", userData);
            } catch {
                // Si no es JSON, asumir que es un mensaje de texto
                console.log("📝 Respuesta en texto plano:", responseText);
            }
            
            // Mostrar notificación de éxito
            alert("✅ ¡Registro exitoso!\n\n" +
                  "📧 Se ha enviado un correo de bienvenida a: " + email + "\n\n" +
                  "🔐 Ahora puedes iniciar sesión con tus credenciales.");
            
            // Redirigir a login después de 2 segundos
            setTimeout(() => {
                console.log("🔄 Redirigiendo a login...");
                window.location.href = "login.html";
            }, 2000);
            
        } catch (error) {
            console.error("❌ Error en el registro:", error);
            
            // Mostrar mensaje de error específico
            let errorMessage = "Hubo un problema al registrarse.";
            
            if (error.message.includes("Correo ya registrado")) {
                errorMessage = "❌ Este correo electrónico ya está registrado.";
            } else if (error.message.includes("Las contraseñas no coinciden")) {
                errorMessage = "❌ Las contraseñas no coinciden.";
            } else if (error.message.includes("conectarse") || error.message.includes("Network")) {
                errorMessage = "🌐 No se pudo conectar con el servidor. Verifica tu conexión a internet.";
            } else {
                errorMessage = "❌ " + error.message;
            }
            
            alert(errorMessage);
        } finally {
            // Restaurar el botón
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.classList.remove('btn-loading');
        }
    });
});