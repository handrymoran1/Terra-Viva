function cerrarSesionManual() {
  localStorage.removeItem("usuarioLogueado");
  alert("Has cerrado sesión correctamente.");
  window.location.href = "../index.html";
}

document.addEventListener("DOMContentLoaded", function () {
  actualizarNavbar();

  const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));
  if (!usuario) {
    alert("Debes iniciar sesión para ver esta página.");
    window.location.href = "../html/iniciarSesion.html";
    return;
  }

  // Referencias
  const inputNombre = document.getElementById("inputNombre");
  const inputCorreo = document.getElementById("inputCorreo");
  const inputTelefono = document.getElementById("inputTelefono");
  const inputCiudad = document.getElementById("inputCiudad");
  const nombreDisplay = document.getElementById("nombreDisplay");
  const correoDisplay = document.getElementById("correoDisplay");
  const fotoPreview = document.getElementById("fotoPreview");

  // Rellenar campos
  inputNombre.value = usuario.nombre || "";
  inputCorreo.value = usuario.email || "";
  inputTelefono.value = usuario.telefono || "";
  if (inputCiudad) inputCiudad.value = usuario.ciudad || "";
  nombreDisplay.textContent = usuario.nombre || "Usuario";
  correoDisplay.textContent = usuario.email || "";

  const inicial = (usuario.nombre || "U").charAt(0).toUpperCase();
  fotoPreview.src = `https://ui-avatars.com/api/?name=${inicial}&background=1B4015&color=fff&size=200&font-size=0.4`;

  // Guardar cambios
  const btnGuardar = document.getElementById("btnGuardar");
  const toastGuardado = document.getElementById("toastGuardado");

  btnGuardar.addEventListener("click", function () {
    const nuevoNombre = inputNombre.value.trim();
    const nuevoTelefono = inputTelefono.value.trim();
    const nuevaCiudad = inputCiudad ? inputCiudad.value.trim() : "";

    if (!nuevoNombre) {
      alert("El nombre no puede estar vacío.");
      return;
    }

    usuario.nombre = nuevoNombre;
    usuario.telefono = nuevoTelefono;
    usuario.ciudad = nuevaCiudad;
    localStorage.setItem("usuarioLogueado", JSON.stringify(usuario));

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    for (let i = 0; i < usuarios.length; i++) {
      if (usuarios[i].email === usuario.email) {
        usuarios[i].nombre = nuevoNombre;
        usuarios[i].telefono = nuevoTelefono;
        usuarios[i].ciudad = nuevaCiudad;
        break;
      }
    }
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    nombreDisplay.textContent = nuevoNombre;
    const nuevaInicial = nuevoNombre.charAt(0).toUpperCase();
    fotoPreview.src = `https://ui-avatars.com/api/?name=${nuevaInicial}&background=1B4015&color=fff&size=200&font-size=0.4`;
    actualizarNavbar();

    toastGuardado.classList.add("show");
    setTimeout(() => toastGuardado.classList.remove("show"), 3000);
  });
});

// actulizamos segun logeo del usuario
function actualizarNavbar() {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));
  const navAvatar =
    document.getElementById("navAvatar") ||
    document.querySelector(".nav-avatar-icon");

  if (usuario && navAvatar && usuario.nombre) {
    navAvatar.textContent = usuario.nombre.charAt(0).toUpperCase();
  }
}

// Esto va cuando ya se tenga la base de datos (LLENAR LOS NUMEROS)
// fetch("/api/usuario/estadisticas")
//   .then(res => res.json())
//   .then(datos => {
//     document.querySelectorAll(".stat-reservas").forEach(el => el.textContent = datos.totalReservas);
//     document.querySelectorAll(".stat-activa").forEach(el => el.textContent = datos.reservaActiva);
//     document.querySelectorAll(".stat-noches").forEach(el => el.textContent = datos.nochesHospedado);

//   });

// Ocultar el placeholder y mostrar la lista real
/*/document.getElementById("reservasVacias").style.display = "none";
document.getElementById("listaReservas").innerHTML += `<div class="reserva-item">...</div>`;/*/
