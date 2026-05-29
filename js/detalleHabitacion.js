document.addEventListener("DOMContentLoaded", function () {
  // Actualizar navbar según sesión
  actualizarNavbar();

  // Datos de la habitación actual (definidos en cada página de detalle)
  const habitacionActual = window.habitacionData;

  const btnBuscar = document.getElementById("btnBuscar");
  if (!btnBuscar || !habitacionActual) return;

  btnBuscar.addEventListener("click", () => {
    const llegada = document.getElementById("fechaLlegada").value;
    const salida = document.getElementById("fechaSalida").value;
    const huespedes = document.getElementById("huespedes").value;

    // Validar fechas
    if (!llegada || !salida) {
      alert("Por favor selecciona fechas de llegada y salida.");
      return;
    }

    if (new Date(salida) <= new Date(llegada)) {
      alert("La fecha de salida debe ser posterior a la fecha de llegada.");
      return;
    }

    // Guardar datos en sessionStorage
    sessionStorage.setItem(
      "habitacionSeleccionada",
      JSON.stringify(habitacionActual)
    );
    sessionStorage.setItem(
      "busquedaHabitaciones",
      JSON.stringify({ llegada, salida, huespedes })
    );

    // Redirigir a detalleReserva.html
    window.location.href = "detalleReserva.html";
  });
});
