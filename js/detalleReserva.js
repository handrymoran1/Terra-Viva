

function cargarDetalleReserva() {
  const habitacion = JSON.parse(
    sessionStorage.getItem("habitacionSeleccionada"),
  );
  const busqueda = JSON.parse(sessionStorage.getItem("busquedaHabitaciones"));

  if (!habitacion) {
    const tarjeta = document.getElementById("tarjetaDetalleReserva");
    if (tarjeta) {
      tarjeta.innerHTML =
        '<div class="alert alert-warning text-center m-5">No has seleccionado ninguna habitación. <a href="../index.html">Volver al inicio</a></div>';
    }
    return;
  }

  document.getElementById("detalleImagen").src =
    habitacion.imagen || "https://placehold.co/400x300?text=Sin+Imagen";
  document.getElementById("detalleImagen").alt = habitacion.nombre;
  document.getElementById("detalleNombre").textContent = habitacion.nombre;
  document.getElementById("detalleDescripcion").textContent =
    habitacion.descripcion;
  document.getElementById("detallePrecio").textContent =
    habitacion.precio.toLocaleString("es-CO");

  if (busqueda) {
    const fechaLlegada = new Date(
      busqueda.llegada + "T00:00:00",
    ).toLocaleDateString("es-CO");
    const fechaSalida = new Date(
      busqueda.salida + "T00:00:00",
    ).toLocaleDateString("es-CO");

    document.getElementById("detalleFechas").textContent =
      `${fechaLlegada} hasta ${fechaSalida}`;
    document.getElementById("detalleHuespedes").textContent =
      busqueda.huespedes;
  }
}
document.addEventListener("DOMContentLoaded", cargarDetalleReserva);
