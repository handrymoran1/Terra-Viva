const btnRegistrar = document.getElementById("btnRegistrar");
const textoAlerta = document.getElementById("textoAlerta");
const textoEmail = document.getElementById("textoEmail");
const inputEmail = document.getElementById("inputCorreo");
const textoTelefono = document.getElementById("textoTelefono");

btnRegistrar.addEventListener("click", function (e) {
  e.preventDefault();
  console.log("vamos bien.");
});

function registrarUsuario() {
  const nombre = document.getElementById("inputNombre").value;
  const email = document.getElementById("inputCorreo").value;
  const telefono = document.getElementById("inputTelefono").value;

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  let existeNombre = false;
  let existeEmail = false;
  let existeTelefono = false;

  //verificar el nombre primero que no exista
  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].nombre === nombre) {
      existeNombre = true;
      textoAlerta.innerHTML = `<h5>Este nombre ya está registrado.</h5>`;
      return;
    }
  }
  //ahora que no esté vacío el campo.
  if (nombre.trim() === "") {
    alert("El nombre ome.");
    textoAlerta.innerHTML = "<h5>¡Ingrese su nombre completo primero! ⚠️<h5>";
    return;
  }
//en esta verificamos que el correo no exista y despues que no esté vacío el campo
  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].telefono === telefono) {
      existeEmail = true;
      textoEmail.innerHTML = `<h5>Este correo ya está registrado.</h5>`;
      return;
    }
  }

  if (email.trim() === "") {
    textoEmail.innerHTML = "<h5>¡Ingrese su nombre completo! ⚠️<h5>";
    return;
  }

  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].telefono === telefono) {
      existeTelefono = true;
      textoTelefono.innerHTML = `<h5>Este teléfono ya está registrado.</h5>`;
      return;
    }
  }

  if (telefono.trim() === "") {
    textoTelefono.innerHTML = "<h5>¡Ingrese su telefono completo! ⚠️<h5>";
    return;
  }


  usuarios.push({ nombre: nombre, email: email, telefono: telefono});
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  textoAlerta.innerHTML = "";

  alert("Usuario guardado.");
}
