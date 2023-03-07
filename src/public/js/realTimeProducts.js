const socket = io();
const container = document.querySelector("#container");

socket.on("realTimeProducts", (data) => {
  let products = "";
  data.forEach((p) => {
    products += `<p>ID: ${p.id} - ${p.title} - $${p.price}<p/>`;
  });
  container.innerHTML = products;
});

const addProduct = document.querySelector("#addProduct");
const formAddProduct = document.querySelector("#formAddProduct");
// formAddProduct
addProduct.addEventListener("click", async (e) => {
  e.preventDefault();
  const product = {
  title: formAddProduct.title.value,
  description: formAddProduct.description.value,
  price: formAddProduct.price.value,
  stock: formAddProduct.stock.value,
  category: formAddProduct.category.value  
  };

  const response = await fetch("http://localhost:8080/api/products", {
    method: "POST",
    body: JSON.stringify(product),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
  const json = await response.json();
  if (json.status === "success") {
    formAddProduct.reset();
    Swal.fire({
      toast: true,
      position: "top-center",
      showConfirmButton: false,
      timer: 3000,
      title: `Producto agregado`,
      icon: "success",
    });
  }
  
});

// -----------------------------------------------------------------------------

const deleteProduct = document.querySelector("#deleteProduct");
const formDeleteProduct = document.querySelector("#formDeleteProduct");

deleteProduct.addEventListener("click", async (e) => {
  e.preventDefault();
  const id = formDeleteProduct.productId.value;
  if (!id)
    return Swal.fire({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      title: `Complete el campo ID`,
      icon: "error",
    });

  const response = await fetch(`http://localhost:8080/api/products/${id}`, {
    method: "DELETE",
  });
  const json = await response.json();
  if (json.status === "success") {
    formDeleteProduct.reset();
    Swal.fire({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      title: `Producto borrado`,
      icon: "success",
    });
  }
});
