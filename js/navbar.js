function actualizarNavbar() {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));

  const divNoLogueado = document.getElementById("navNoLogueado");
  const divLogueado = document.getElementById("navLogueado");
  const navAvatar = document.getElementById("navAvatar");

  if (usuario) {
    if (divNoLogueado) divNoLogueado.classList.add("d-none");
    if (divLogueado) divLogueado.classList.remove("d-none");
    if (navAvatar && usuario.nombre) {
      navAvatar.textContent = usuario.nombre.charAt(0).toUpperCase();
    }
  } else {
    if (divNoLogueado) divNoLogueado.classList.remove("d-none");
    if (divLogueado) divLogueado.classList.add("d-none");
  }
}

function cerrarSesionManual() {
  localStorage.removeItem("usuarioLogueado");
  alert("Has cerrado sesión correctamente.");
  window.location.href = "../index.html";
}

document.addEventListener("DOMContentLoaded", actualizarNavbar);
