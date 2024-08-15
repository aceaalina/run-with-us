document.addEventListener("DOMContentLoaded", () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || {};
  const cartItemsContainer = document.querySelector(".cart-items");
  const cartTotalContainer = document.querySelector(".cart-total");

  function updateCart() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    for (let id in cart) {
      const product = cart[id];

      const productCard = document.createElement("div");
      productCard.className = "cart-item";
      const decreaseDisabled = product.quantity === 1 ? "disabled" : "";
      const increaseDisabled =
        product.quantity >= product.stock ? "disabled" : "";

      productCard.innerHTML = `
        <img src="../${product.imageUrl}" alt="${product.name}" />
        <div class="details">
          <span>${product.name}</span>
        </div>
        <div class="quantity">
          <button data-id="${id}" ${decreaseDisabled} class="decrease">-</button>
          <span>${product.quantity}</span>
          <button data-id="${id}" ${increaseDisabled} class="increase">+</button>
        </div>
        <div class="price">${product.price * product.quantity} lei</div>
        <button data-id="${id}" class="delete">Șterge</button>
      `;
      total += product.price * product.quantity;
      cartItemsContainer.appendChild(productCard);
    }

    cartTotalContainer.innerHTML =
      total === 0 ? "Coșul de cumpărături este gol" : `Total: ${total} lei`;
  }

  cartItemsContainer.addEventListener("click", (e) => {
    const id = e.target.getAttribute("data-id");

    if (e.target.classList.contains("increase")) {
      const product = cart[id];
      if (product.quantity < product.stock) {
        cart[id].quantity += 1;
      }
    } else if (e.target.classList.contains("decrease")) {
      if (cart[id].quantity > 1) {
        cart[id].quantity -= 1;
      } else {
        delete cart[id];
      }
    } else if (e.target.classList.contains("delete")) {
      delete cart[id];
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
  });

  updateCart();
});
