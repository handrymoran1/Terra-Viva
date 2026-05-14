const CLAVE_HABITACIONES = "habitacionesHuellas";

const habitacionesIniciales = [
  {
    id: 1,
    nombre: "dsdsds",
    precio: 340000,
    imagen: "../assets/habitaciones/habitacion1.png",
    descripcion:
      "Elegante esia cotancn cama gfgfgfgfgdfgdfgddfgdfgdfgdfghghghg.",
    mostrar: true,
  },
  {
    id: 2,
    nombre: "",
    precio: 700000,
    imagen: "../assets/habitaciones/habitacion2.png",
    descripcion: "Suite de lujo con balcón.",
    mostrar: true,
  },
  {
    id: 3,
    nombre: "Habitación 3",
    precio: 250000,
    imagen: "../assets/habitaciones/habitacion3.png",
    descripcion: "Habitación temática botánica.",
    mostrar: true,
  },
  {
    id: 4,
    nombre: "Habitación 4",
    precio: 800000,
    imagen: "../assets/habitaciones/habitacion4.png",
    descripcion: "Suite familiar espaciosa.",
    mostrar: true,
  },
  {
    id: 5,
    nombre: "Habitación 5",
    precio: 200000,
    imagen: "../assets/habitaciones/habitacion5.png",
    descripcion: "Opción cómoda y funcional.",
    mostrar: true,
  },
  {
    id: 6,
    nombre: "Habitación 6",
    precio: 420000,
    imagen: "../assets/habitaciones/habitacion6.png",
    descripcion: "Vista a la ciudad, cama Queen.",
    mostrar: true,
  },
  {
    id: 7,
    nombre: "Habitación 7",
    precio: 550000,
    imagen: "../assets/habitaciones/habitacion7.png",
    descripcion: "Con jacuzzi y terraza.",
    mostrar: true,
  },
  {
    id: 8,
    nombre: "Habitación 8",
    precio: 310000,
    imagen: "../assets/habitaciones/habitacion8.png",
    descripcion: "Económica pero acogedora.",
    mostrar: true,
  },
  {
    id: 9,
    nombre: "Habitación 9",
    precio: 670000,
    imagen: "../assets/habitaciones/habitacion9.png",
    descripcion: "Doble con vistas panorámicas.",
    mostrar: true,
  },
  {
    id: 10,
    nombre: "Habitación 10",
    precio: 920000,
    imagen: "../assets/habitaciones/habitacion10.png",
    descripcion: "Presidencial con servicio 24h.",
    mostrar: true,
  },
];

function inicializarHabitaciones() {
  localStorage.removeItem(CLAVE_HABITACIONES);
  localStorage.setItem(
    CLAVE_HABITACIONES,
    JSON.stringify(habitacionesIniciales),
  );
}

function obtenerHabitaciones() {
  return JSON.parse(localStorage.getItem(CLAVE_HABITACIONES)) || [];
}

function guardarHabitaciones(habitaciones) {
  localStorage.setItem(CLAVE_HABITACIONES, JSON.stringify(habitaciones));
}

// utilidades

function generarId() {
  const habitaciones = obtenerHabitaciones();

  if (habitaciones.length === 0) return 1;

  return Math.max(...habitaciones.map((h) => h.id)) + 1;
}

function placeholderImagen() {
  return "https://placehold.co/300x200?text=Sin+imagen";
}

// modelado crud

function agregarHabitacion(nombre, precio, descripcion, imagen) {
  const habitaciones = obtenerHabitaciones();

  const nueva = {
    id: generarId(),
    nombre: nombre,
    precio: parseFloat(precio),
    descripcion: descripcion || "",
    imagen: imagen || "",
    mostrar: true,
  };

  habitaciones.push(nueva);
  guardarHabitaciones(habitaciones);

  return nueva;
}

function editarHabitacion(id, nombre, precio, descripcion, imagen) {
  const habitaciones = obtenerHabitaciones();

  const index = habitaciones.findIndex((h) => h.id === id);

  if (index === -1) return false;

  habitaciones[index].nombre = nombre;
  habitaciones[index].precio = parseFloat(precio);
  habitaciones[index].descripcion = descripcion || "";

  if (imagen !== undefined) {
    habitaciones[index].imagen = imagen;
  }

  guardarHabitaciones(habitaciones);

  return true;
}

function eliminarHabitacion(id) {
  if (!confirm("¿Eliminar esta habitación?")) return false;

  let habitaciones = obtenerHabitaciones();

  habitaciones = habitaciones.filter((h) => h.id !== id);

  guardarHabitaciones(habitaciones);

  return true;
}

function actualizarVisibilidadHabitacion(id, mostrar) {
  const habitaciones = obtenerHabitaciones();

  const index = habitaciones.findIndex((h) => h.id === id);

  if (index !== -1) {
    habitaciones[index].mostrar = mostrar;
    guardarHabitaciones(habitaciones);
  }
}

// ajustar habitaciones

function ajustarCatalogo() {
  const contenedor = document.getElementById("contenedorHabitaciones");

  if (!contenedor) {
    return;
  }

  const todasLasHabitaciones = obtenerHabitaciones();

  contenedor.innerHTML = "";

  let hayHabitacionesVisibles = false;

  //aquí recorremos una por una de las habitaciones
  for (let i = 0; i < todasLasHabitaciones.length; i++) {
    const habitacion = todasLasHabitaciones[i];

    // Si la habitacion no esta marcada para mostrarse nos la saltamos
    if (habitacion.mostrar === false) {
      continue;
    }

    hayHabitacionesVisibles = true;

    const col = document.createElement("div");

    col.className = "col";

    const imagenSrc = habitacion.imagen || placeholderImagen();

    col.innerHTML = `
      <div class="card card-habitacion h-100 shadow-sm">
        <img 
          src="${imagenSrc}" 
          class="img-habitacion" 
          alt="${habitacion.nombre}" 
          style="height: 180px; object-fit: cover;"
        >

        <div class="card-texto text-center">
          <h6 class="mb-1">${habitacion.nombre}</h6>

          <p class="precio mb-2">
            $${habitacion.precio.toLocaleString("es-CO")} / noche
          </p>

          <p class="card-text texto-card-habitacion">
            ${habitacion.descripcion || ""}
          </p>

          <button 
            class="btn-reservar" 
            data-id="${habitacion.id}"
          >
            Reservar
          </button>
        </div>
      </div>
    `;

    contenedor.appendChild(col);
  }

  document.querySelectorAll(".btn-reservar").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);

      const habitacion = obtenerHabitaciones().find((h) => h.id === id);

      if (habitacion) {
        alert(
          `Seleccionó ${habitacion.nombre}. Precio: $${habitacion.precio.toLocaleString("es-CO")} / noche.`,
        );

        const datosBusqueda = sessionStorage.getItem("busquedaHabitaciones");

        if (datosBusqueda) {
          window.location.href = "../html/detalleReserva.html";
        } else {
          if (
            confirm(
              "Primero debes seleccionar fechas en el inicio. ¿Ir allá ahora?",
            )
          ) {
            window.location.href = "../index.html";
          }
        }
      }
    });
  });
}

function actualizarTodosLosContadores() {
  const spanDisponibles = document.getElementById("contadorDisponible");

  const spanOcupadas = document.getElementById("contadorOcupadas");

  const habitaciones = obtenerHabitaciones();

  if (spanDisponibles) {
    const cantDisponibles = habitaciones.filter(
      (h) => h.mostrar === true,
    ).length;

    spanDisponibles.textContent = cantDisponibles;
  }

  if (spanOcupadas) {
    const cantOcupadas = habitaciones.filter((h) => h.mostrar === false).length;

    spanOcupadas.textContent = cantOcupadas;
  }
}

// función simple para cambiar el color de la lista del admin

function pintarListaAdmin() {
  const contenedor = document.getElementById("listaHabitacionesAdmin");

  if (!contenedor) return;
}

// ajustar imagen

let imagenBase64 = null;

function ajustarListaAdmin() {
  const contenedor = document.getElementById("listaHabitacionesAdmin");

  if (!contenedor) return;

  const habitaciones = obtenerHabitaciones();

  contenedor.innerHTML = "";

  habitaciones.forEach((hab) => {
    const estadoTexto = hab.mostrar ? "Visible" : "Oculto";

    const estadoColor = hab.mostrar ? "success" : "secondary";

    const imagenSrc = hab.imagen || placeholderImagen();

    const item = document.createElement("div");

    item.className = "list-group-item d-flex align-items-center";

    item.innerHTML = `
      <div class="me-3">
        <img 
          src="${imagenSrc}" 
          alt="${hab.nombre}" 
          style="width: 80px; height: 60px; object-fit: cover; border-radius: 5px;"
          onerror="this.src='${placeholderImagen()}'"
        >
      </div>

      <div class="flex-grow-1">
        <strong>${hab.nombre}</strong> 
        - $${hab.precio.toLocaleString("es-CO")} / noche
        <br>

        <small class="text-muted">
          ${hab.descripcion || ""}
        </small>
        <br>

        <span class="badge bg-${estadoColor}">
          ${estadoTexto}
        </span>
      </div>

      <div class="d-flex gap-2">
        <button 
          class="btn btn-sm btn-outline-warning btn-editar" 
          data-id="${hab.id}"
        >
          Editar
        </button>

        <button 
          class="btn btn-sm btn-outline-danger btn-eliminar" 
          data-id="${hab.id}"
        >
          Eliminar
        </button>

        <button 
          class="btn btn-sm btn-outline-primary toggle-visibilidad" 
          data-id="${hab.id}" 
          data-mostrar="${hab.mostrar}"
        >
          ${hab.mostrar ? "Ocultar" : "Mostrar"}
        </button>
      </div>
    `;

    contenedor.appendChild(item);
  });

  document.querySelectorAll(".btn-editar").forEach((btn) => {
    btn.addEventListener("click", () =>
      cargarFormularioEdicion(parseInt(btn.dataset.id)),
    );
  });

  document.querySelectorAll(".btn-eliminar").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (eliminarHabitacion(parseInt(btn.dataset.id))) {
        ajustarListaAdmin();
        ajustarCatalogo();
        actualizarTodosLosContadores();
      }
    });
  });

  document.querySelectorAll(".toggle-visibilidad").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);

      const mostrarActual = btn.dataset.mostrar === "true";

      actualizarVisibilidadHabitacion(id, !mostrarActual);

      ajustarListaAdmin();
      ajustarCatalogo();
      actualizarTodosLosContadores();
    });
  });
}

// formulario

function cargarFormularioEdicion(id) {
  const habitaciones = obtenerHabitaciones();

  const hab = habitaciones.find((h) => h.id === id);

  if (!hab) return;

  document.getElementById("habitacionId").value = hab.id;

  document.getElementById("nombre").value = hab.nombre;

  document.getElementById("precio").value = hab.precio;

  document.getElementById("descripcion").value = hab.descripcion || "";

  document.getElementById("imagenInput").value = "";

  imagenBase64 = hab.imagen;

  document.getElementById("tituloFormulario").textContent = "Editar habitación";
}

function resetFormulario() {
  document.getElementById("formularioHabitacion").reset();

  document.getElementById("habitacionId").value = "";

  document.getElementById("tituloFormulario").textContent =
    "Agregar nueva habitación";

  imagenBase64 = null;
}

function manejarEnvioFormulario(e) {
  e.preventDefault();

  const id = document.getElementById("habitacionId").value;

  const nombre = document.getElementById("nombre").value.trim();

  const precio = document.getElementById("precio").value.trim();

  const descripcion = document.getElementById("descripcion").value.trim();

  if (id) {
    editarHabitacion(parseInt(id), nombre, precio, descripcion, imagenBase64);
  } else {
    agregarHabitacion(nombre, precio, descripcion, imagenBase64);
  }

  resetFormulario();

  ajustarListaAdmin();
  ajustarCatalogo();
  actualizarTodosLosContadores();
}

// DOMContentLoaded

document.addEventListener("DOMContentLoaded", () => {
  inicializarHabitaciones();

  ajustarCatalogo();

  actualizarTodosLosContadores();

  mostrarResumenBusqueda();

  if (document.getElementById("listaHabitacionesAdmin")) {
    pintarListaAdmin();

    activarEventosAdmin();

    const form = document.getElementById("formularioHabitacion");

    if (form) {
      form.addEventListener("submit", manejarEnvioFormulario);
    }

    document
      .getElementById("btnCancelar")
      .addEventListener("click", resetFormulario);

    const inputImagen = document.getElementById("imagenInput");

    if (inputImagen) {
      inputImagen.addEventListener("change", function (e) {
        const file = e.target.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = function (ev) {
          imagenBase64 = ev.target.result;
        };

        reader.readAsDataURL(file);
      });
    }
  }

  const btnNueva = document.getElementById("btnNuevaBusqueda");

  if (btnNueva) {
    btnNueva.addEventListener("click", function () {
      sessionStorage.removeItem("busquedaHabitaciones");

      window.location.href = "../index.html";
    });
  }

  const btnCerrarSesion = document.getElementById("btnCerrarSesion");

  console.log("¿Botón encontrado?", btnCerrarSesion);

  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", function () {
      console.log("Intentando cerrar sesión...");

      localStorage.removeItem("usuarioLogueado");

      alert("Has cerrado sesión correctamente.");

      window.location.href = "../index.html";
    });
  }
});
