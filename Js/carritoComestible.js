let carrito = [];

async function cargarProductos() {
  try {
    const response = await fetch("/Json/productosComestibles.json");
    const data = await response.json();
    const productosContainer = document.getElementById("productosContainer");

    data.forEach((producto) => {
      const productoDiv = document.createElement("div");
      productoDiv.className = "col-lg-4";
      productoDiv.innerHTML = `
                        <img src="${producto.imagen}" alt="${
        producto.nombre
      }" width="200">
               <h3>${producto.nombre}</h3>
               <p>Precio: $${producto.precio.toFixed(2)}</p>
              <button class="btn btn-primary  " onclick="agregarAlCarrito(${
                producto.id
              }, '${producto.nombre}', ${
        producto.precio
      })">Agregar al Carrito</button>
                    `;

      productosContainer.appendChild(productoDiv);
    });
  } catch (error) {
    console.error("Error al cargar los productos:", error);
  }
}

cargarProductos();

function mostrarNotificacion(producto, tipo) {
  Toastify({
      text: `Producto agregado al carrito: ${producto}`,
      duration: 2000,
      close: true,
      gravity: "top",
      position: "right",
      backgroundColor: tipo === "success" ? "green" : "red",
  }).showToast();
}

function agregarAlCarrito(id, nombre, precio,) {
  if (carrito.some((item) => item.id === id)) {
    carrito.forEach((item) => {
      if (item.id === id) {
        item.cantidad += 1;
        item.total += precio;
      }
    });
  } else {
    carrito.push({ id, nombre, precio, cantidad: 1, total: precio });
  }

  guardarCarritoEnLocalStorage();
  actualizarCarrito();
  mostrarNotificacion(nombre, "success");

}




function vaciarCarrito() {
  if (carrito.length > 0) {
    Swal.fire({
      title: "¿Estás seguro de que deseas vaciar el carrito?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, vaciar carrito",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        carrito = [];
        guardarCarritoEnLocalStorage();
        actualizarCarrito();
        Swal.fire("Carrito vaciado", "", "success");
      } else {
        Swal.fire("Operación cancelada", "", "info");
      }
    });
  } else {
    Swal.fire("¡No hay productos que vaciar!", "", "warning");
  }
}

function eliminarDelCarrito(id) {
  const index = carrito.findIndex((item) => item.id === id);
  if (index !== -1) {
    const item = carrito[index];
    if (item.cantidad > 1) {
      item.cantidad -= 1;
      item.total -= item.precio;
    } else {
      carrito.splice(index, 1);
    }
    guardarCarritoEnLocalStorage();
  }
  actualizarCarrito();
}

function actualizarCarrito() {
  const carritoElement = document.getElementById("carrito");
  carritoElement.innerHTML = "";
  let totalCarrito = 0;

  carrito.forEach((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
                    <td>${item.nombre}</td>
                    <td>${item.cantidad}</td>
                    <td>$${item.precio.toFixed(2)}</td>
                    <td>$${item.total.toFixed(2)}</td>
                    <td><button class="btn btn-danger btn-sm" onclick="eliminarDelCarrito(${
                      item.id
                    })">Eliminar</button></td>
                    
                    
                `;
    carritoElement.appendChild(tr);
    totalCarrito += item.total;
  });


  const totalElement = document.getElementById("totalCarrito");
  totalElement.textContent = `$${totalCarrito.toFixed(2)}`;
}

function guardarCarritoEnLocalStorage() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function cargarCarritoDesdeLocalStorage() {
  const carritoEnLocalStorage = localStorage.getItem("carrito");
  if (carritoEnLocalStorage) {
    carrito = JSON.parse(carritoEnLocalStorage);
    actualizarCarrito();
  }
}

cargarCarritoDesdeLocalStorage();


