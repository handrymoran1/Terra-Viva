let btnBuscarDisponibilidad = document.getElementById(
  "btnBuscarDisponibilidad",
);

btnBuscarDisponibilidad.addEventListener("click", function (e) {
  e.preventDefault();
  const llegada = document.getElementById("fechaLlegada").value;
  const salida = document.getElementById("fechaSalida").value;
  const huespedes = document.getElementById("huespedes").value;

  if (!llegada || !salida) {
    alert("Seleccione fechas de llegada y salida.");
    return;
  }

  if (new Date(salida) <= new Date(llegada)) {
    alert("La fecha de salida debe ser posterior a la de entrada.");
    return;
  }

  const datosBusqueda = {
    llegada: llegada,
    salida: salida,
    huespedes: huespedes,
  };
  // aquí cuando cerremos el navegador se borra ese almacenamiento en sessionStorage
  sessionStorage.setItem("busquedaHabitaciones", JSON.stringify(datosBusqueda));

  window.location.href = "/html/habitaciones.html";
});


// actulizamos segun logeo del usuario
function actualizarNavbar() {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));
  
  const divNoLogueado = document.getElementById("navNoLogueado");
  const divLogueado = document.getElementById("navLogueado");
  const navAvatar = document.getElementById("navAvatar");

  if (usuario) {
    if(divNoLogueado) divNoLogueado.classList.add("d-none"); // Ocultar Registrar/Login
    if(divLogueado) divLogueado.classList.remove("d-none");  // Mostrar Perfil/Cerrar Sesión
    
    if(navAvatar && usuario.nombre) {
      navAvatar.textContent = usuario.nombre.charAt(0).toUpperCase();
    }
  } else {
    if(divNoLogueado) divNoLogueado.classList.remove("d-none"); // Mostrar Registrar/Login
    if(divLogueado) divLogueado.classList.add("d-none");        // Ocultar Perfil/Cerrar Sesión
  }
}

function cerrarSesionManual() {
  localStorage.removeItem("usuarioLogueado");
  alert("Has cerrado sesión correctamente.");
  window.location.href = "./index.html";
}

document.addEventListener("DOMContentLoaded", actualizarNavbar);