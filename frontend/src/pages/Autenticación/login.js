// login.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evita que el formulario recargue la página

    const email = document.getElementById("email").value.trim();
    const contrasena = document.getElementById("contrasena").value.trim();

    if (!email || !contrasena) {
      alert("Por favor completa todos los campos.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, contrasena })
      });

      const data = await res.text(); // Puedes cambiar a .json() si devuelves un objeto JSON

      if (res.ok) {
        alert("Inicio de sesión exitoso");
        // Guardar token o datos en localStorage si lo deseas
        localStorage.setItem("usuario", data);
        window.location.href = "/frontend/src/pages/Usuario/usuario.html";
      } else {
        alert("Error: " + data);
      }
    } catch (error) {
      alert("Error de conexión: " + error.message);
    }
  });
});