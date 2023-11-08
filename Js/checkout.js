function cargarProductosDesdeLocalStorage() {
  const productTable = document.getElementById("productTable");

  const productos = JSON.parse(localStorage.getItem("carrito")) || [];

  productTable.innerHTML = "";

  let totalCarrito = 0;

  productos.forEach((producto) => {
    const row = document.createElement("tr");
    const precioTotal = (
      parseFloat(producto.precio) * parseFloat(producto.cantidad)
    ).toFixed(2);
    totalCarrito += parseFloat(precioTotal);

    row.innerHTML = `
            <td>${producto.nombre}</td>
            <td>${producto.precio}</td>
            <td>${producto.cantidad}</td>
            <td>${precioTotal}</td>
        `;
    productTable.appendChild(row);
  });

  document.getElementById("totalCarrito").textContent = totalCarrito.toFixed(2);
}

cargarProductosDesdeLocalStorage();

function calcularMontoTotal(carrito) {
  let total = 0;
  carrito.forEach(function (producto) {
    total += producto.precio * producto.cantidad;
  });
  return total;
}

function mostrarMontoTotal() {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  if (carrito.length > 0) {
    let montoTotal = calcularMontoTotal(carrito);
    Swal.fire({
      icon: "success",
      title: "Pago exitoso",
      text: "Monto total: $" + montoTotal.toFixed(2),
    }).then(function (result) {
      localStorage.removeItem("carrito");
      window.history.back();
    });
  } else {
    Swal.fire({
      icon: "error",
      title: "Carrito vacío",
      text: "Agrega productos al carrito antes de pagar",
    });
  }
}

document.getElementById("pay-button").addEventListener("click", function () {
  let nombre = document.getElementById("nombre").value;
  let tarjeta = document.getElementById("tarjeta").value;
  let expiracion = document.getElementById("expiracion").value;
  let cvv = document.getElementById("cvv").value;

  // Verifica si los campos están llenos
  if (
    nombre.trim() === "" ||
    tarjeta.trim() === "" ||
    expiracion.trim() === "" ||
    cvv.trim() === ""
  ) {
    Swal.fire({
      icon: "error",
      title: "Campos incompletos",
      text: "Por favor, completa todos los campos antes de pagar",
    });
  } else {
    mostrarMontoTotal();
  }
});
