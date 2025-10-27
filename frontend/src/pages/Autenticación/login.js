document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");

    if (!loginForm) {
        console.error("❌ No se encontró el formulario de login.");
        return;
    }

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const contrasena = document.getElementById("contrasena").value.trim();

        if (!email || !contrasena) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, contrasena })
            });

            if (!response.ok) {
                const errorText = await response.text();
                alert("Error al iniciar sesión: " + errorText);
                return;
            }

            const userData = await response.json();

            // ✅ Guardamos sesión correctamente
            sessionStorage.setItem("loggedUser", JSON.stringify(userData));

            console.log("✅ Usuario logueado:", userData);

            alert(`Inicio de sesión exitoso. ¡Bienvenido, ${userData.nombre || "usuario"}!`);

            // Redirigir al panel principal del usuario
            window.location.href = "/frontend/src/pages/Usuario/usuario.html";
        } catch (error) {
            console.error("❌ Error al conectarse con el servidor:", error);
            alert("Hubo un problema al conectarse con el servidor.");
        }
    });
});
