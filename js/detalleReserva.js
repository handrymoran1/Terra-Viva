document.addEventListener("DOMContentLoaded", function () {
  //aquí traemos los datos
  actualizarNavbar();
  const habitacion = JSON.parse(
    sessionStorage.getItem("habitacionSeleccionada"),
  );
  const busqueda = JSON.parse(sessionStorage.getItem("busquedaHabitaciones"));
  const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));

  // 2. Verificamos si hay habitación
  if (!habitacion) {
    const tarjeta = document.getElementById("tarjetaDetalleReserva");
    if (tarjeta) {
      tarjeta.innerHTML =
        '<div class="alert alert-warning text-center m-5">No has seleccionado ninguna habitación. <a href="../index.html">Volver al inicio</a></div>';
    }
    return;
  }

  // ahora llenamos los datos básicos
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

    const fLlegada = new Date(busqueda.llegada);
    const fSalida = new Date(busqueda.salida);

    // calculamos los dias
    const diferenciaMs = fSalida - fLlegada;
    const diasEstancia = diferenciaMs / (1000 * 60 * 60 * 24);

    const totalPagar = habitacion.precio * diasEstancia;

    // actualizamos el DOM
    document.getElementById("detalleCantidadNoches").textContent = diasEstancia;
    document.getElementById("detalleTotalPagar").textContent =
      totalPagar.toLocaleString("es-CO");
  }

  const btnConfirmar = document.getElementById("btnConfirmarReserva");

  if (!usuario) {
    if (btnConfirmar) {
        btnConfirmar.disabled = true;
        btnConfirmar.style.pointerEvents = "none";
        btnConfirmar.style.opacity = "0.7";

        const mensajeNoLogin = document.createElement('div');
        mensajeNoLogin.innerHTML = '<div class="alert alert-warning text-center mt-3">Debes <a href="./iniciarSesion.html">iniciar sesión</a> para poder confirmar la reserva.</div>';
        btnConfirmar.parentNode.insertBefore(mensajeNoLogin, btnConfirmar);
    }
} else {
    if (btnConfirmar) {
        btnConfirmar.addEventListener("click", function () {
            Swal.fire({
                title: '<strong>Tu Pago Seguro Con Terra Viva <img src="../assets/logo/secure.png" style="height: 32px; vertical-align: text-bottom;"></strong>',
                customClass: {
                    title: 'swal-title-custom',
                    htmlContainer: 'swal-html-container-custom',
                    confirmButton: 'swal-confirm-button-custom',
                    cancelButton: 'swal-cancel-button-custom'
                },
                html: `
          <i class="bi bi-credit-card-fill custom-credit-card-icon"></i>
          <p class="mt-3">Estás a punto de pagar <b>$${document.getElementById("detalleTotalPagar").textContent}</b>.</p>
          <p>Ingresa los datos de tu tarjeta de crédito para continuar.</p>
          <form id="payment-form">
            <div class="form-group">
              <label for="card-number">Número de la tarjeta</label>
              <div class="position-relative">
                <input type="password" class="form-control" id="card-number" placeholder="**** **** **** ****" oninput="this.value = this.value.replace(/[^0-9]/g, '')" maxlength="16">
                <button class="btn" type="button" id="toggle-card-number">
                  <i class="bi bi-eye"></i>
                </button>
              </div>
            </div>
            <div class="form-group">
              <label for="card-holder">Nombre del titular</label>
              <input type="text" class="form-control" id="card-holder" placeholder="Nombre completo" oninput="this.value = this.value.replace(/[^a-zA-Z ]/g, '')">
            </div>
            <div class="row">
              <div class="col">
                <label for="expiry-date">Fecha de expiración</label>
                <input type="text" class="form-control" id="expiry-date" placeholder="MM/YY" oninput="this.value = this.value.replace(/[^0-9/]/g, '')" maxlength="5">
              </div>
              <div class="col">
                <label for="cvv">CVV</label>
                <input type="text" class="form-control" id="cvv" placeholder="***" oninput="this.value = this.value.replace(/[^0-9]/g, '')" maxlength="3">
              </div>
            </div>
          </form>
        `,
                showCancelButton: true,
                confirmButtonText: 'Pagar',
                cancelButtonText: 'Cancelar',
                showLoaderOnConfirm: true,
                didOpen: () => {
                    const toggleButton = document.getElementById('toggle-card-number');
                    const cardNumberInput = document.getElementById('card-number');
                    toggleButton.addEventListener('click', function () {
                        const type = cardNumberInput.getAttribute('type') === 'password' ? 'text' : 'password';
                        cardNumberInput.setAttribute('type', type);
                        this.querySelector('i').classList.toggle('bi-eye');
                        this.querySelector('i').classList.toggle('bi-eye-slash');
                    });

                    const expiryDateInput = document.getElementById('expiry-date');
                    expiryDateInput.addEventListener('input', (e) => {
                        if (e.target.value.length === 2 && e.inputType !== 'deleteContentBackward') {
                            e.target.value += '/';
                        }
                    });
                },
                preConfirm: () => {
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            resolve();
                        }, 2000);
                    });
                },
                allowOutsideClick: () => !Swal.isLoading()
            }).then((result) => {
                if (result.isConfirmed) {
                    let historial = JSON.parse(localStorage.getItem("historialReservas")) || [];
                    const reservaFinal = {
                        habitacion: habitacion.nombre,
                        total: document.getElementById("detalleTotalPagar").textContent,
                        fecha: new Date().toISOString(),
                    };
                    historial.push(reservaFinal);
                    localStorage.setItem("historialReservas", JSON.stringify(historial));
                    sessionStorage.removeItem("habitacionSeleccionada");
                    sessionStorage.removeItem("busquedaHabitaciones");
                    Swal.fire({
                        title: '¡Pago Exitoso!',
                        text: 'Tu reserva ha sido confirmada.',
                        icon: 'success',
                        confirmButtonText: 'Ver mis reservas'
                    }).then(() => {
                        window.location.href = "./perfil_usuario.html";
                    });
                }
            });
        });
    }
}
});
