// ---------- perfil_usuario.js ----------
document.addEventListener("DOMContentLoaded", function () {
  // cargar navbar dinámico
  actualizarNavbar();

  // obtener usuario logueado
  const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));

  // si no hay sesión, redirigir a inicio de sesión
  if (!usuario) {
    window.location.href = "../html/iniciarSesion.html";
    return;
  }

  // ---------- SECCIÓN: INFORMACIÓN DEL PERFIL ----------
  const inputNombre = document.getElementById("inputNombre");
  const inputCorreo = document.getElementById("inputCorreo");
  const inputTelefono = document.getElementById("inputTelefono");
  const nombreDisplay = document.getElementById("nombreDisplay");
  const correoDisplay = document.getElementById("correoDisplay");
  const fotoPreview = document.getElementById("fotoPreview");

  // cargar datos del usuario en los campos
  inputNombre.value = usuario.nombre || "";
  inputCorreo.value = usuario.email || "";
  inputTelefono.value = usuario.telefono || "";
  nombreDisplay.textContent = usuario.nombre || "Usuario";
  correoDisplay.textContent = usuario.email || "";

  // generar avatar con inicial
  const iniciales = (usuario.nombre || "U").charAt(0).toUpperCase();
  fotoPreview.src = `https://ui-avatars.com/api/?name=${iniciales}&background=1B4015&color=fff&size=200&font-size=0.4`;

  // botón guardar cambios
  const btnGuardar = document.getElementById("btnGuardar");
  const toastGuardado = document.getElementById("toastGuardado");

  btnGuardar.addEventListener("click", function () {
    const nuevoNombre = inputNombre.value.trim();
    const nuevoTelefono = inputTelefono.value.trim();

    if (!nuevoNombre) {
      alert("El nombre no puede estar vacío.");
      return;
    }

    // actualizar datos en localStorage
    usuario.nombre = nuevoNombre;
    usuario.telefono = nuevoTelefono;
    localStorage.setItem("usuarioLogueado", JSON.stringify(usuario));

    // sincronizar con lista de usuarios registrados
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    for (let i = 0; i < usuarios.length; i++) {
      if (usuarios[i].email === usuario.email) {
        usuarios[i].nombre = nuevoNombre;
        usuarios[i].telefono = nuevoTelefono;
        break;
      }
    }
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    nombreDisplay.textContent = nuevoNombre;

    // actualizar avatar si cambió el nombre
    const nuevasIniciales = nuevoNombre.charAt(0).toUpperCase();
    fotoPreview.src = `https://ui-avatars.com/api/?name=${nuevasIniciales}&background=1B4015&color=fff&size=200&font-size=0.4`;

    // mostrar toast de confirmación
    toastGuardado.classList.add("show");
    setTimeout(() => {
      toastGuardado.classList.remove("show");
    }, 3000);
  });

  // ---------- SECCIÓN: RESERVAS DEL USUARIO ----------
  // obtener reservas vinculadas al correo
  const claveReservas = "reservas_" + usuario.email;
  const reservas = JSON.parse(localStorage.getItem(claveReservas)) || [];

  // referencias a elementos de la UI de reservas
  const listaReservasDiv = document.getElementById("listaReservas");
  const reservasVaciasDiv = document.getElementById("reservasVacias");

  // actualizar contadores de estadísticas (todos los elementos con esas clases)
  const totalReservas = reservas.length;
  document.querySelectorAll(".stat-reservas").forEach((el) => {
    el.textContent = totalReservas;
  });

  // contar noches totales hospedadas
  let totalNoches = 0;
  reservas.forEach((r) => {
    totalNoches += r.noches || 0;
  });
  document.querySelectorAll(".stat-noches").forEach((el) => {
    el.textContent = totalNoches;
  });

  // reserva activa: la más cercana en el futuro (fechaSalida > hoy)
  const hoy = new Date();
  const reservasFuturas = reservas.filter((r) => {
    if (r.fechaSalida) {
      const fechaSalida = new Date(r.fechaSalida);
      return fechaSalida >= hoy;
    }
    return false;
  });
  const reservaActiva =
    reservasFuturas.length > 0
      ? reservasFuturas.sort(
          (a, b) => new Date(a.fechaLlegada) - new Date(b.fechaLlegada)
        )[0]
      : null;
  const activasCount = reservaActiva ? 1 : 0;
  document.querySelectorAll(".stat-activa").forEach((el) => {
    el.textContent = activasCount;
  });

  // construir HTML de la lista de reservas o mostrar placeholder vacío
  if (reservas.length === 0) {
    // ya existe el placeholder con id "reservasVacias", no hacer nada
  } else {
    // ocultar placeholder
    if (reservasVaciasDiv) {
      reservasVaciasDiv.style.display = "none";
    }

    // crear tabla de reservas
    const tablaHTML = `
      <div class="table-responsive">
        <table class="table table-hover align-middle">
          <thead class="table-success">
            <tr>
              <th>Habitación</th>
              <th>Fechas</th>
              <th>Huéspedes</th>
              <th>Noches</th>
              <th>Total</th>
              <th>Fecha de reserva</th>
            </tr>
          </thead>
          <tbody>
            ${reservas
              .map((reserva) => {
                const fechaLlegada = reserva.fechaLlegada
                  ? new Date(
                      reserva.fechaLlegada + "T00:00:00"
                    ).toLocaleDateString("es-CO")
                  : "-";
                const fechaSalida = reserva.fechaSalida
                  ? new Date(
                      reserva.fechaSalida + "T00:00:00"
                    ).toLocaleDateString("es-CO")
                  : "-";
                const fechaReserva = reserva.fechaReserva
                  ? new Date(reserva.fechaReserva).toLocaleString("es-CO")
                  : "-";

                return `
                  <tr>
                    <td>
                      <div class="d-flex align-items-center">
                        <img src="${
                          reserva.imagen ||
                          "https://placehold.co/80x60?text=Sin+Imagen"
                        }" 
                             alt="${reserva.habitacion}" 
                             class="me-2 rounded" 
                             width="60" height="40" 
                             style="object-fit: cover;">
                        <span class="fw-semibold">${reserva.habitacion}</span>
                      </div>
                    </td>
                    <td>${fechaLlegada} → ${fechaSalida}</td>
                    <td>${reserva.huespedes}</td>
                    <td>${reserva.noches}</td>
                    <td>$${reserva.total}</td>
                    <td>${fechaReserva}</td>
                  </tr>
                `;
              })
              .join("")}
          </tbody>
        </table>
      </div>
    `;

    // inyectar la tabla dentro del contenedor de reservas
    listaReservasDiv.insertAdjacentHTML("beforeend", tablaHTML);
  }
});