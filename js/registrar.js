const btnRegistrar = document.getElementById("btnRegistrar");
const textoAlerta = document.getElementById("textoAlerta");
const textoEmail = document.getElementById("textoEmail");
const inputEmail = document.getElementById("inputCorreo");
const textoTelefono = document.getElementById("textoTelefono");
const textoPassword = document.getElementById("textoPassword");
const confirmarPassword = document.getElementById("textoConfirmarPassword");

// [ALERTA] Visual para retroalimentación
const alertaRegistro = document.getElementById("alerta-registro");
const iconoAlertaReg = document.getElementById("icono-alerta-reg");
const mensajeAlertaReg = document.getElementById("mensaje-alerta-reg");

function mostrarAlertaRegistro(exito, mensaje) {
  alertaRegistro.classList.remove("d-none");
  mensajeAlertaReg.textContent = mensaje;
  if (exito) {
    iconoAlertaReg.innerHTML = '<i class="bi bi-check-circle-fill"></i>';
  } else {
    iconoAlertaReg.innerHTML = '<i class="bi bi-exclamation-triangle-fill"></i>';
  }
}

// [TOGGLE] Configurar visibilidad de contraseña
function configurarToggleContrasena(idToggle, idInput, idIcono) {
  const toggle = document.getElementById(idToggle);
  const input = document.getElementById(idInput);
  const icono = document.getElementById(idIcono);
  toggle.addEventListener("click", function () {
    const tipo = input.getAttribute("type") === "password" ? "text" : "password";
    input.setAttribute("type", tipo);
    if (tipo === "password") {
      icono.className = "bi bi-eye-fill";
    } else {
      icono.className = "bi bi-eye-slash-fill";
    }
  });
}

// [INICIALIZAR] Toggles de contraseña al cargar la página
document.addEventListener("DOMContentLoaded", function () {
  configurarToggleContrasena("toggle-contrasena-reg", "inputPassword", "icono-ojo-reg");
  configurarToggleContrasena("toggle-confirmar-reg", "inputPasswordDos", "icono-ojo-confirmar");
});

btnRegistrar.addEventListener("click", function (e) {
  e.preventDefault();
  console.log("vamos bien.");
  registrarUsuario();
});

function registrarUsuario() {
  const nombre = document.getElementById("inputNombre").value;
  const email = document.getElementById("inputCorreo").value;
  const telefono = document.getElementById("inputTelefono").value;
  const password = document.getElementById("inputPassword").value;
  const inputPasswordDos = document.getElementById("inputPasswordDos").value;

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  // [VALIDAR] Que el nombre no esté registrado
  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].nombre === nombre) {
      textoAlerta.innerHTML = `<h5>Este nombre ya está registrado.</h5>`;
      return;
    }
  }

  // [VALIDAR] Que el nombre no esté vacío
  if (nombre.trim() === "") {
    alert("El nombre ome.");
    textoAlerta.innerHTML = "<h5>¡Ingrese su nombre completo primero! ⚠️<h5>";
    return;
  }

  // [VALIDAR] Que el correo no esté registrado
  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].email === email) {
      textoEmail.innerHTML = `<h5>Este correo ya está registrado.</h5>`;
      return;
    }
  }

  // [VALIDAR] Que el correo no esté vacío
  if (email.trim() === "") {
    textoEmail.innerHTML = "<h5>¡Ingrese su correo! ⚠️<h5>";
    return;
  }

  // [VALIDAR] Que el teléfono no esté registrado
  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].telefono === telefono) {
      textoTelefono.innerHTML = `<h5>Este teléfono ya está registrado.</h5>`;
      return;
    }
  }

  // [VALIDAR] Que el teléfono tenga al menos 10 dígitos
  if (telefono.trim() === "" || telefono.length < 10) {
    textoTelefono.innerHTML = "<h5>¡Ingrese su telefono completo! ⚠️<h5>";
    return;
  }

  // [VALIDAR] Que la contraseña tenga al menos 10 caracteres
  if (password.trim() === "" || password.length < 10) {
    textoPassword.innerHTML = "<h5>¡La contraseña debe tener al menos 10 caracteres! ⚠️<h5>";
    return;
  }

  // [VALIDAR] Que las contraseñas coincidan
  if (inputPasswordDos !== password) {
    confirmarPassword.innerHTML = "<h5>Las contraseñas no coinciden ⚠️</h5>";
    confirmarPassword.focus();
    return;
  }

  // [CREAR] Nuevo usuario con array de reservas vacío
  usuarios.push({
    nombre: nombre,
    email: email,
    telefono: telefono,
    password: password,
    reservas: []   // [CAMBIO] Inicializar historial de reservas vacío
  });

  // [GUARDAR] Lista actualizada de usuarios
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  textoAlerta.innerHTML = "";
  window.location.href = "../html/iniciarSesion.html";
}