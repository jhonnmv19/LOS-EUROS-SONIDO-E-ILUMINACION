document.getElementById("formRegistro").addEventListener("submit", function (event) {
  event.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const apellido = document.getElementById("apellido").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  const fechaNacimiento = document.getElementById("fecha").value;
  const correo = document.getElementById("correo").value.trim();
  const clave = document.getElementById("clave").value;

  const errorTelefono = document.getElementById("errorTelefono");
  const errorEdad = document.getElementById("errorEdad");

  errorTelefono.textContent = "";
  errorEdad.textContent = "";

  // Validación de teléfono (actualizada para aceptar signos como +, (, ), -)
  if (!/^[\d\+\(\)\-]+$/.test(telefono)) {
    errorTelefono.textContent = "⚠️ El teléfono solo debe contener números, y los signos (+), (-), (, ) son permitidos.";
    return;
  }

  // Validación de edad
  const hoy = new Date();
  const fechaNac = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - fechaNac.getFullYear();
  const cumpleEsteAnio = hoy.getMonth() < fechaNac.getMonth() || 
    (hoy.getMonth() === fechaNac.getMonth() && hoy.getDate() < fechaNac.getDate());

  if (edad < 18 || (edad === 18 && cumpleEsteAnio)) {
    errorEdad.textContent = "⚠️ Debes tener al menos 18 años para registrarte.";
    return;
  }

  // Validación de clave segura
  if (clave.length < 8 || !/[A-Z]/.test(clave) || !/[a-z]/.test(clave) || !/[0-9]/.test(clave) || !/[\W_]/.test(clave)) {
    alert("La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y símbolos.");
    return;
  }

  // Verificar si ya existe el usuario
  const usuariosRegistrados = JSON.parse(localStorage.getItem("usuarios")) || [];
  const usuarioExistente = usuariosRegistrados.find(u => u.correo === correo);

  if (usuarioExistente) {
    alert("El correo electrónico ya está registrado.");
    return;
  }

  // Guardar usuario
  usuariosRegistrados.push({ nombre, apellido, telefono, fechaNacimiento, correo, clave });
  localStorage.setItem("usuarios", JSON.stringify(usuariosRegistrados));

  // Mostrar mensaje de éxito
  const mensaje = document.getElementById("mensajeExito");
  mensaje.textContent = `¡Enhorabuena ${nombre}! Te registraste en la empresa LOS EUROS DE BOLIVIA. Ahora podrás realizar tus compras con tranquilidad.`;
  mensaje.classList.remove("oculto");
  mensaje.classList.add("mostrar");

  setTimeout(() => {
    mensaje.classList.remove("mostrar");
    mensaje.classList.add("oculto");
    window.location.href = "login.html"; // Redirige después de 10 segundos
  }, 10000); // 10000 milisegundos (10 segundos)
});

// Seguridad de la clave
document.getElementById("clave").addEventListener("input", function () {
  const seguridad = document.getElementById("seguridadClave");
  const nivel = evaluarSeguridadClave(this.value);

  seguridad.textContent = `Seguridad: ${nivel.texto}`;
  seguridad.className = nivel.clase;
});

function evaluarSeguridadClave(clave) {
  let nivel = 0;
  if (clave.length >= 8) nivel++;
  if (/[A-Z]/.test(clave)) nivel++;
  if (/[a-z]/.test(clave)) nivel++;
  if (/[0-9]/.test(clave)) nivel++;
  if (/[\W_]/.test(clave)) nivel++;

  if (nivel >= 5) return { texto: "Alta 🔒", clase: "alta" };
  if (nivel >= 3) return { texto: "Media ⚠️", clase: "media" };
  return { texto: "Baja 🔓", clase: "baja" };
}

// Mostrar/ocultar contraseña
document.getElementById("toggleClave").addEventListener("click", function () {
  const claveInput = document.getElementById("clave");
  if (claveInput.type === "password") {
    claveInput.type = "text";
    this.textContent = "🙈";
  } else {
    claveInput.type = "password";
    this.textContent = "👁️";
  }
});
