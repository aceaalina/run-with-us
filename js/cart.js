import { getProductById } from "../api/products.js";

document.addEventListener("DOMContentLoaded", () => {
  const cart = JSON.parse(localStorage.getItem("cart"));
  const cartItemsContainer = document.querySelector(".cart-items");
  const cartTotalContainer = document.querySelector(".cart-total");

  function updateCart() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    for (let id in cart) {
      const product = cart[id];

      const productCard = document.createElement("div");
      productCard.className = "cart-item";
      const descreaseDisabled = product.quantity === 1 ? "disabled" : "";
      productCard.innerHTML = `
        <img src="../${product.imageUrl}" alt="${product.name}" />
        <div class="details">
          <span>${product.name}</span>
          <span>${product.details}</span>
        </div>
        <div class="quantity">
          <button data-id=${id} ${descreaseDisabled} class="decrease">-</button>
          <span>${product.quantity}</span>
          <button data-id=${id} class="increase">+</button>
        </div>
        <div class="price">${product.price * product.quantity} lei</div>
        <button data-id=${id} class="delete">Sterge</button>
      `;
      total = total + product.price * product.quantity;
      cartItemsContainer.appendChild(productCard);
    }
    cartTotalContainer.innerHTML =
      total === 0 ? "Cosul de cumparaturi este gol" : `Total: ${total}`;
  }

  cartItemsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("increase")) {
      const id = e.target.getAttribute("data-id");
      cart[id].quantity += 1;
    } else if (e.target.classList.contains("decrease")) {
      const id = e.target.getAttribute("data-id");
      cart[id].quantity -= 1;
    } else if (e.target.classList.contains("delete")) {
      const id = e.target.getAttribute("data-id");
      delete cart[id];
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
  });

  updateCart();
});
