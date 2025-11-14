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

            // 🟦 Guardar sesión
            sessionStorage.setItem("loggedUser", JSON.stringify(userData));
            console.log("✅ Usuario logueado:", userData);

            // Extraemos datos que el backend manda
            const tipo = userData.tipoSuscripcion;                // "Gratuito", "Mensual", etc.
            const estado = userData.estadoUsuario?.idEstado || 1; // Si viene null, asumimos activo

            console.log("TIPO SUB:", tipo, " (tipo real:", typeof tipo, ")");
            console.log("ESTADO SUB:", estado, " (estado real:", typeof estado, ")");

            // =====================================================
            // 🔥 VALIDACIÓN DEL ESTADO DE SUSCRIPCIÓN
            // =====================================================

            if (estado === 2) {
                alert("❌ Tu cuenta está SUSPENDIDA. No puedes ingresar.");
                return;
            }

            if (estado === 3) {
                alert("⚠ Tu suscripción fue cancelada. Los beneficios seguirán hasta que termine el periodo actual.");
            }

            if (estado === 4) {
                alert("⚠ Tu suscripción ha expirado. Serás redirigido al panel gratuito.");
                window.location.href = "/frontend/src/pages/Usuario/usuario.html";
                return;
            }

            // =====================================================
            // 🎯 VALIDACIÓN DEL TIPO DE SUSCRIPCIÓN (STRING)
            // =====================================================

            if (tipo === "Gratuito") {
                window.location.href = "/frontend/src/pages/Usuario/usuario.html";
                return;
            }

            if (tipo === "Mensual" || tipo === "Anual" || tipo === "De por vida") {
                window.location.href = "/frontend/src/pages/Usuario/premium.html";
                return;
            }

            // Si llega hasta aquí, recibiste un valor raro
            alert("Error: Tipo de suscripción desconocido.");

        } catch (error) {
            console.error("❌ Error al conectarse con el servidor:", error);
            alert("Hubo un problema al conectarse con el servidor.");
        }
    });
});
