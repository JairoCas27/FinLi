// registro.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const apellidoPaterno = document.getElementById("apellido-paterno").value.trim();
    const apellidoMaterno = document.getElementById("apellido-materno").value.trim();
    const edad = parseInt(document.getElementById("edad").value, 10);
    const email = document.getElementById("email").value.trim();
    const contrasena = document.getElementById("contrasena").value.trim();
    const confirmarContrasena = document.getElementById("confirmarContrasena").value.trim();
    const terminos = document.getElementById("terms").checked;

    if (!nombre || !apellidoPaterno || !apellidoMaterno || !edad || !email || !contrasena || !confirmarContrasena) {
      alert("Por favor completa todos los campos.");
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
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nombre,
          apellidoPaterno,
          apellidoMaterno,
          edad,
          email,
          contrasena,
          confirmarContrasena: confirmarContrasena
        })
      });

      const data = await res.text();

      if (res.ok) {
        alert("Usuario registrado con éxito");
        window.location.href = "login.html";
      } else {
        alert("Error al registrar: " + data);
      }
    } catch (error) {
      alert("Error de conexión: " + error.message);
    }
  });
});