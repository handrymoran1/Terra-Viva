const CLAVE_HABITACIONES = 'habitacionesHuellas'; // Clave para almacenar las habitaciones en localStorage

const habitacionesIniciales = [// Datos de para inicializar las habitaciones
  { id: 1, nombre: "ALOJAMIENTO", precio: 340000, imagen: "huellas_de_la_pola\assets\habitaciones\habitacion1.png", descripcion: "Elegante esia cotancn cama gfgfgfgfgdfgdfgddfgdfgdfgdfghghghg.", mostrar: true },
  { id: 2, nombre: "Habitación 2", precio: 700000, imagen: "", descripcion: "Suite de lujo con balcón.", mostrar: true },
  { id: 3, nombre: "Habitación 3", precio: 250000, imagen: ".", descripcion: "Habitación temática botánica.", mostrar: true },
  { id: 4, nombre: "Habitación 4", precio: 800000, imagen: ".", descripcion: "Suite familiar espaciosa.", mostrar: true },
  { id: 5, nombre: "Habitación 5", precio: 200000, imagen: ".", descripcion: "Opción cómoda y funcional.", mostrar: true },
  { id: 6, nombre: "Habitación 6", precio: 420000, imagen: ".", descripcion: "Vista a la ciudad, cama Queen.", mostrar: true },
  { id: 7, nombre: "Habitación 7", precio: 550000, imagen: ".", descripcion: "Con jacuzzi y terraza.", mostrar: true },
  { id: 8, nombre: "Habitación 8", precio: 310000, imagen: ".", descripcion: "Económica pero acogedora.", mostrar: true },
  { id: 9, nombre: "Habitación 9", precio: 670000, imagen: ".", descripcion: "Doble con vistas panorámicas.", mostrar: true },
  { id: 10, nombre: "Habitación 10", precio: 920000, imagen: ".", descripcion: "Presidencial con servicio 24h.", mostrar: true }
];

function inicializarHabitaciones() {// Solo se inicializan si no hay datos previos en localStorage
  const guardadas = localStorage.getItem(CLAVE_HABITACIONES);// Si no hay habitaciones guardadas, se inicializan con los datos predefinidos
  if (!guardadas) {// Solo se inicializan si no hay datos previos en localStorage
    localStorage.setItem(CLAVE_HABITACIONES, JSON.stringify(habitacionesIniciales));// Esto asegura que al cargar por primera vez, el sistema tenga datos para mostrar y administrar
  }
}

function obtenerHabitaciones() { // Devuelve un array de habitaciones desde localStorage, o un array vacío si no hay datos
  const data = localStorage.getItem(CLAVE_HABITACIONES);// Si no hay datos, devuelve un array vacío para evitar errores al intentar renderizar o administrar habitaciones
  return data ? JSON.parse(data) : [];// Esto garantiza que las funciones que dependen de esta información siempre tengan un array válido para trabajar, incluso si el localStorage está vacío o ha sido limpiado.
}

function guardarHabitaciones(habitaciones) {// Guarda el array de habitaciones actualizado en localStorage
  localStorage.setItem(CLAVE_HABITACIONES, JSON.stringify(habitaciones));// Esto se llama cada vez que se cambia la visibilidad de una habitación para asegurar que los cambios se mantengan al recargar la página o navegar entre el catálogo y el dashboard de administración.
}

function actualizarVisibilidadHabitacion(id, mostrar) {// Actualiza el estado de mostrar/ocultar de una habitación específica por su ID
  let habitaciones = obtenerHabitaciones();// Se obtiene el array actual de habitaciones para modificarlo
  const index = habitaciones.findIndex(hab => hab.id === id);// Se busca la habitación por su ID para actualizar su propiedad "mostrar"
  if (index !== -1) {// Si se encuentra la habitación, se actualiza su estado de visibilidad
    habitaciones[index].mostrar = mostrar;// Se actualiza el array con el nuevo estado de visibilidad
    guardarHabitaciones(habitaciones);// Se guarda el array actualizado en localStorage para que los cambios se reflejen en el catálogo y el dashboard de administración.
  }
}

function renderizarCatalogo() { // Renderiza el catálogo de habitaciones mostrando solo las que tienen "mostrar: true"
  const contenedor = document.getElementById('contenedorHabitaciones');// Si no se encuentra el contenedor, no se intenta renderizar para evitar errores en páginas que no tienen esta sección (como el dashboard de administración)
  if (!contenedor) return;// Se obtiene el array de habitaciones y se filtra para mostrar solo las que están marcadas como visibles

  const habitaciones = obtenerHabitaciones();// Se filtra el array para obtener solo las habitaciones que deben mostrarse en el catálogo, lo que permite ocultar habitaciones sin eliminarlas del sistema.
  const habitacionesVisibles = habitaciones.filter(hab => hab.mostrar === true);// Se limpia el contenedor antes de renderizar para evitar duplicados al recargar o cambiar la visibilidad de las habitaciones
  contenedor.innerHTML = '';// Si no hay habitaciones visibles, se muestra un mensaje indicando que no hay opciones disponibles en lugar de dejar el contenedor vacío, lo que mejora la experiencia del usuario al informar claramente la situación.
  if (habitacionesVisibles.length === 0) {// Si no hay habitaciones visibles, se muestra un mensaje indicando que no hay opciones disponibles en lugar de dejar el contenedor vacío, lo que mejora la experiencia del usuario al informar claramente la situación.
    contenedor.innerHTML = '<div class="col-12 text-center"><p class="text-muted">No hay habitaciones disponibles en este momento.</p></div>';
    return;
  }
  habitacionesVisibles.forEach(hab => {// Se itera sobre las habitaciones visibles para crear y agregar las tarjetas al contenedor del catálogo, mostrando solo la información relevante para los usuarios finales.
    const col = document.createElement('div');// Se crea un elemento div para cada habitación que se va a mostrar en el catálogo, lo que permite organizar las tarjetas de manera responsiva utilizando clases de Bootstrap.
    col.className = 'col';// Se asigna la clase "col" para que cada tarjeta ocupe un espacio adecuado en la cuadrícula del catálogo, adaptándose a diferentes tamaños de pantalla.
    col.innerHTML = `
      <div class="card card-habitacion h-100 shadow-sm">
        <img src="${hab.imagen}" class="img-habitacion" alt="${hab.nombre}" style="height: 180px; object-fit: cover;">
        <div class="card-texto text-center">
          <h6 class="mb-1">${hab.nombre}</h6>
          <p class="precio mb-2">$${hab.precio.toLocaleString('es-CO')} / noche</p>
          <p class="card-text texto-card-habitacion">${hab.descripcion || ''}</p>
          <button class="btn-reservar" data-id="${hab.id}">Reservar</button>
        </div>
      </div>
    `;
    contenedor.appendChild(col);// Se agrega la tarjeta de la habitación al contenedor del catálogo para que se muestre en la página.
  });

  document.querySelectorAll('.btn-reservar').forEach(btn => {// Se agrega un evento de clic a cada botón de reservar para mostrar una alerta con la información de la habitación seleccionada, lo que simula el proceso de reserva y proporciona feedback al usuario.
    btn.addEventListener('click', (e) => {// Se obtiene el ID de la habitación desde el atributo data-id del botón para identificar cuál habitación fue seleccionada.
      const id = parseInt(btn.dataset.id);// Se busca la habitación correspondiente en el array de habitaciones para obtener su información y mostrarla en la alerta.
      const habitacion = obtenerHabitaciones().find(h => h.id === id);// Si se encuentra la habitación, se muestra una alerta con su nombre y precio por noche, lo que simula el proceso de reserva y proporciona feedback al usuario sobre su selección.
      if (habitacion) {// Si se encuentra la habitación, se muestra una alerta con su nombre y precio por noche, lo que simula el proceso de reserva y proporciona feedback al usuario sobre su selección.
        alert(`Selecciono ${habitacion.nombre}. Precio: $${habitacion.precio.toLocaleString('es-CO')} / noche.`);// En un sistema real, aquí se redirigiría a una página de reserva o se abriría un formulario para completar la reserva, pero por ahora solo se muestra una alerta con la información de la habitación seleccionada.
      }
    });
  });
}

function renderizarListaDesplegable() {// Renderiza el select con las habitaciones visibles para que los usuarios puedan seleccionar una habitación específica y ver su información detallada.
  const select = document.getElementById('listaDesplegableHabitaciones');// Si no se encuentra el select, no se intenta renderizar para evitar errores en páginas que no tienen esta sección (como el dashboard de administración)
  if (!select) return;// Se obtiene el array de habitaciones y se filtra para mostrar solo las que están marcadas como visibles, lo que permite ocultar habitaciones sin eliminarlas del sistema y mantener la flexibilidad en la gestión de las opciones disponibles para los usuarios.

  const habitaciones = obtenerHabitaciones();// Se filtra el array para obtener solo las habitaciones que deben mostrarse en el select, lo que permite ocultar habitaciones sin eliminarlas del sistema y mantener la flexibilidad en la gestión de las opciones disponibles para los usuarios.
  const habitacionesVisibles = habitaciones.filter(hab => hab.mostrar === true);// Se limpia el select antes de renderizar para evitar duplicados al recargar o cambiar la visibilidad de las habitaciones, lo que garantiza que el select siempre muestre la información actualizada y correcta.
  select.innerHTML = '<option value="" disabled selected>-- Seleccione una habitación --</option>';// Si no hay habitaciones visibles, se muestra una opción deshabilitada indicando que no hay opciones disponibles en lugar de dejar el select vacío, lo que mejora la experiencia del usuario al informar claramente la situación.
  habitacionesVisibles.forEach(hab => {// Se itera sobre las habitaciones visibles para crear y agregar las opciones al select, mostrando solo la información relevante para los usuarios finales.
    const opcion = document.createElement('option');//
    opcion.value = hab.id;// Se asigna el ID de la habitación como valor de la opción para identificar cuál habitación fue seleccionada posteriormente.
    opcion.textContent = `${hab.nombre} - $${hab.precio.toLocaleString('es-CO')} / noche`;// Se muestra el nombre y precio de la habitación en el texto de la opción para que los usuarios puedan identificar fácilmente las opciones disponibles al seleccionar una habitación específica.
    select.appendChild(opcion);// Se agrega la opción al select para que se muestre en la página y los usuarios puedan seleccionar una habitación específica para ver su información detallada.
  });
}

function configurarSeleccionDesplegable() { // Configura el botón para mostrar la habitación seleccionada en el select, lo que permite a los usuarios obtener información detallada sobre la habitación que han seleccionado de manera interactiva.
  const select = document.getElementById('listaDesplegableHabitaciones'); // Si no se encuentra el select o el botón, no se intenta configurar para evitar errores en páginas que no tienen estas secciones (como el dashboard de administración)
  const boton = document.getElementById('botonSeleccionarHabitacion'); // Se obtiene el contenedor donde se mostrará la información de la habitación seleccionada para actualizar su contenido dinámicamente cuando el usuario haga clic en el botón, lo que mejora la experiencia del usuario al proporcionar feedback inmediato sobre su selección.
  const contenedor = document.getElementById('resultadoSeleccion'); // Si no se encuentra el contenedor, se usará una alerta para mostrar la información de la habitación seleccionada, lo que garantiza que el usuario reciba feedback sobre su selección incluso si la página no tiene un área designada para mostrar esta información.
  if (!select || !boton) return; // Se agrega un evento de clic al botón para mostrar la información de la habitación seleccionada en el select, lo que permite a los usuarios obtener detalles sobre la habitación que han seleccionado de manera interactiva y mejorar su experiencia al navegar por las opciones disponibles.

  boton.addEventListener('click', () => { // Se obtiene el ID de la habitación seleccionada desde el valor del select para identificar cuál habitación fue seleccionada y mostrar su información detallada.
    const id = parseInt(select.value); // Se valida que se haya seleccionado una opción válida antes de intentar mostrar la información de la habitación, lo que mejora la experiencia del usuario al evitar errores o confusiones al hacer clic en el botón sin haber seleccionado una habitación.
    if (isNaN(id)) { // Si no se ha seleccionado una opción válida, se muestra una alerta indicando que se debe seleccionar una habitación antes de intentar mostrar su información, lo que mejora la experiencia del usuario al proporcionar feedback claro sobre lo que se espera que hagan para obtener la información deseada.
      alert('Por favor, seleccione una habitación válida.'); // Se muestra una alerta indicando que se debe seleccionar una habitación antes de intentar mostrar su información, lo que mejora la experiencia del usuario al proporcionar feedback claro sobre lo que se espera que hagan para obtener la información deseada.
      return;// Si no se ha seleccionado una opción válida, se muestra una alerta indicando que se debe seleccionar una habitación antes de intentar mostrar su información, lo que mejora la experiencia del usuario al proporcionar feedback claro sobre lo que se espera que hagan para obtener la información deseada.
    }
    const habitaciones = obtenerHabitaciones();// Se obtiene el array de habitaciones para buscar la habitación correspondiente al ID seleccionado y mostrar su información detallada.
    const habitacion = habitaciones.find(h => h.id === id);// Si se encuentra la habitación, se muestra un mensaje con su nombre, precio por noche y descripción, lo que proporciona a los usuarios información detallada sobre la habitación que han seleccionado de manera interactiva.
    if (habitacion) { // Si se encuentra la habitación, se muestra un mensaje con su nombre, precio por noche y descripción, lo que proporciona a los usuarios información detallada sobre la habitación que han seleccionado de manera interactiva.
      const mensaje = `Ha seleccionado: ${habitacion.nombre} - $${habitacion.precio.toLocaleString('es-CO')} / noche. ${habitacion.descripcion}`; // Se muestra un mensaje con el nombre, precio por noche y descripción de la habitación seleccionada para proporcionar a los usuarios información detallada sobre su selección de manera interactiva.
      if (contenedor) { // Si se encuentra el contenedor, se muestra la información de la habitación seleccionada dentro de él para proporcionar feedback inmediato al usuario sobre su selección de manera más visual y atractiva, lo que mejora la experiencia del usuario al interactuar con la página.
        contenedor.innerHTML = `<div class="alert alert-success mt-3">${mensaje}</div>`; // Se muestra la información de la habitación seleccionada dentro del contenedor utilizando una alerta de Bootstrap para resaltar la información y mejorar la experiencia del usuario al interactuar con la página.
      } else { // Si no se encuentra el contenedor, se muestra la información de la habitación seleccionada en una alerta para garantizar que el usuario reciba feedback sobre su selección incluso si la página no tiene un área designada para mostrar esta información, lo que mejora la experiencia del usuario al proporcionar feedback inmediato sobre su selección.
        alert(mensaje); // Se muestra la información de la habitación seleccionada en una alerta para garantizar que el usuario reciba feedback sobre su selección incluso si la página no tiene un área designada para mostrar esta información, lo que mejora la experiencia del usuario al proporcionar feedback inmediato sobre su selección.
      }
    }
  });
}

function renderizarListaAdmin() { // Renderiza la lista de habitaciones con opciones para mostrar/ocultar en el dashboard de administración, lo que permite a los administradores gestionar fácilmente la visibilidad de las habitaciones en el catálogo sin eliminar datos, lo que mejora la flexibilidad y control sobre las opciones disponibles para los usuarios finales.
  const contenedor = document.getElementById('listaHabitacionesAdmin'); // Si no se encuentra el contenedor, no se intenta renderizar para evitar errores en páginas que no tienen esta sección (como el catálogo o la página principal)
  if (!contenedor) return; // Se obtiene el array de habitaciones para renderizar la lista completa con su estado de visibilidad, lo que permite a los administradores ver todas las habitaciones y gestionar su visibilidad de manera eficiente desde el dashboard de administración.

  const habitaciones = obtenerHabitaciones(); // Se limpia el contenedor antes de renderizar para evitar duplicados al recargar o cambiar la visibilidad de las habitaciones, lo que garantiza que la lista siempre muestre la información actualizada y correcta.
  contenedor.innerHTML = ''; // Se itera sobre todas las habitaciones para crear y agregar los elementos de la lista con su información y estado de visibilidad, lo que permite a los administradores gestionar fácilmente la visibilidad de las habitaciones en el catálogo sin eliminar datos, lo que mejora la flexibilidad y control sobre las opciones disponibles para los usuarios finales.
  habitaciones.forEach(hab => { // Se crea un elemento div para cada habitación que se va a mostrar en la lista de administración, lo que permite organizar la información de manera clara y accesible para los administradores al gestionar la visibilidad de las habitaciones.
    const item = document.createElement('div'); // Se asigna la clase "list-group-item" para que cada elemento de la lista tenga el estilo adecuado y se utilicen las utilidades de Bootstrap para organizar el contenido dentro de cada elemento, lo que mejora la apariencia y usabilidad del dashboard de administración al gestionar la visibilidad de las habitaciones.
    item.className = 'list-group-item d-flex justify-content-between align-items-center'; // Se asigna la clase "list-group-item" para que cada elemento de la lista tenga el estilo adecuado y se utilicen las utilidades de Bootstrap para organizar el contenido dentro de cada elemento, lo que mejora la apariencia y usabilidad del dashboard de administración al gestionar la visibilidad de las habitaciones.
    const estadoTexto = hab.mostrar ? 'Visible' : 'Oculto'; // Se determina el texto del estado de visibilidad de la habitación para mostrarlo en la lista de administración, lo que proporciona a los administradores información clara sobre qué habitaciones están visibles u ocultas en el catálogo, lo que mejora la experiencia del usuario al gestionar las opciones disponibles para los usuarios finales.
    const estadoColor = hab.mostrar ? 'success' : 'secondary'; // Se determina el color del badge que indica el estado de visibilidad de la habitación para mostrarlo en la lista de administración, lo que proporciona a los administradores una indicación visual clara sobre qué habitaciones están visibles u ocultas en el catálogo, lo que mejora la experiencia del usuario al gestionar las opciones disponibles para los usuarios finales.
    item.innerHTML = `
      <div>
        <strong>${hab.nombre}</strong> - $${hab.precio.toLocaleString('es-CO')} / noche<br>
        <small class="text-muted">${hab.descripcion || ''}</small><br>
        <span class="badge bg-${estadoColor}">${estadoTexto}</span>
      </div>
      <div>
        <button class="btn btn-sm btn-outline-primary toggle-visibilidad" data-id="${hab.id}" data-mostrar="${hab.mostrar}">
          ${hab.mostrar ? 'Ocultar' : 'Mostrar'}
        </button>
      </div>
    `;
    contenedor.appendChild(item);// Se agrega el elemento de la habitación a la lista de administración para que se muestre en el dashboard y los administradores puedan gestionar su visibilidad de manera eficiente desde esta sección.
  });

  document.querySelectorAll('.toggle-visibilidad').forEach(btn => { // Se agrega un evento de clic a cada botón de mostrar/ocultar para actualizar la visibilidad de la habitación correspondiente y refrescar la lista de administración, el catálogo y el select en tiempo real, lo que mejora la experiencia del usuario al gestionar las opciones disponibles para los usuarios finales sin necesidad de recargar la página.
    btn.addEventListener('click', (e) => { // Se obtiene el ID de la habitación desde el atributo data-id del botón para identificar cuál habitación se va a actualizar su visibilidad.
      const id = parseInt(btn.dataset.id); // Se determina el estado actual de visibilidad de la habitación desde el atributo data-mostrar del botón para calcular el nuevo estado que se va a asignar, lo que permite alternar entre mostrar y ocultar la habitación de manera eficiente al hacer clic en el botón.
      const mostrarActual = btn.dataset.mostrar === 'true'; // Se calcula el nuevo estado de visibilidad que se va a asignar a la habitación al hacer clic en el botón, lo que permite alternar entre mostrar y ocultar la habitación de manera eficiente al hacer clic en el botón.
      const nuevoEstado = !mostrarActual; // Se actualiza la visibilidad de la habitación correspondiente utilizando la función actualizarVisibilidadHabitacion, lo que garantiza que los cambios se reflejen en el catálogo y el select de manera inmediata, mejorando la experiencia del usuario al gestionar las opciones disponibles para los usuarios finales sin necesidad de recargar la página.
      actualizarVisibilidadHabitacion(id, nuevoEstado); // Se actualiza la visibilidad de la habitación correspondiente utilizando la función actualizarVisibilidadHabitacion, lo que garantiza que los cambios se reflejen en el catálogo y el select de manera inmediata, mejorando la experiencia del usuario al gestionar las opciones disponibles para los usuarios finales sin necesidad de recargar la página.
      renderizarListaAdmin();        // refrescar lista del admin para mostrar el nuevo estado de la habitación
      renderizarCatalogo();          // refrescar catálogo en tiempo real para mostrar/ocultar la habitación según el nuevo estado, lo que mejora la experiencia del usuario al gestionar las opciones disponibles para los usuarios finales sin necesidad de recargar la página.
      renderizarListaDesplegable();  // refrescar select en tiempo real para mostrar/ocultar la habitación según el nuevo estado, lo que mejora la experiencia del usuario al gestionar las opciones disponibles para los usuarios finales sin necesidad de recargar la página.
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {// Se ejecuta al cargar la página
  inicializarHabitaciones();// Solo se inicializan si no hay datos previos en localStorage
  renderizarCatalogo();// Renderiza el catálogo con las habitaciones visibles
  renderizarListaDesplegable();// Renderiza el select con las habitaciones visibles
  configurarSeleccionDesplegable();// Configura el botón para mostrar la habitación seleccionada
  if (document.getElementById('listaHabitacionesAdmin')) {// Si estamos en el dashboard de admin
    renderizarListaAdmin();// Renderiza la lista de habitaciones con opciones para mostrar/ocultar
  }
});