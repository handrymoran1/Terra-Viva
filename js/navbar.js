function actualizarNavbar() {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));

  const divNoLogueado = document.getElementById("navNoLogueado");
  const divLogueado = document.getElementById("navLogueado");
  const navAvatar = document.getElementById("navAvatar");

  if (usuario) {
    if (divNoLogueado) divNoLogueado.style.display = "none";
    if (divLogueado) {
      divLogueado.classList.remove("d-none");
      divLogueado.style.display = "flex";
      divLogueado.style.gap = "8px";
      divLogueado.style.alignItems = "center";
    }
    if (navAvatar && usuario.nombre) {
      navAvatar.textContent = usuario.nombre.charAt(0).toUpperCase();
    }
  } else {
    if (divNoLogueado) divNoLogueado.style.display = "flex";
    if (divLogueado) {
      divLogueado.classList.add("d-none");
      divLogueado.style.display = "none";
    }
  }
}

function cerrarSesionManual() {
  localStorage.removeItem("usuarioLogueado");
  alert("Has cerrado sesión correctamente.");
  const enSubdirectorio = window.location.pathname.includes("/html/");
  window.location.href = enSubdirectorio ? "../index.html" : "./index.html";
}

document.addEventListener("DOMContentLoaded", actualizarNavbar);
