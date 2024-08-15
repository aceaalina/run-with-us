document.addEventListener("DOMContentLoaded", () => {
  const cartItemsContainer = document.querySelector(".cart-items");
  const cartTotalContainer = document.querySelector(".cart-total");

  // Funcția care returnează stocul pentru un produs dat
  async function fetchProductStock(productId) {
    const url = `https://668d7a51099db4c579f3178d.mockapi.io/products/${productId}`;
    const response = await fetch(url);
    const product = await response.json();
    return product.sizeStock;
  }

  // Functia care actualizează vizualizarea cosului
  async function updateCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || {};
    cartItemsContainer.innerHTML = "";
    let total = 0;

    for (let id in cart) {
      const product = cart[id];
      const sizeStock = await fetchProductStock(id);

      for (let size in product.size) {
        const productCard = document.createElement("div");
        const decreaseDisabled = product.size[size] === 1 ? "disabled" : "";
        const sizeAvailableStock = sizeStock[size] || 0;
        const increaseDisabled =
          product.size[size] >= sizeAvailableStock ? "disabled" : "";

        productCard.className = "cart-item";
        productCard.innerHTML = `
          <img src="../${product.imageUrl}" alt="${product.name}" />
          <div class="details">
            <span>${product.name} (${size})</span>
          </div>
          <div class="quantity">
            <button data-id="${id}" data-size="${size}" ${decreaseDisabled} class="decrease">-</button>
            <span>${product.size[size]}</span>
            <button data-id="${id}" data-size="${size}" ${increaseDisabled} class="increase">+</button>
          </div>
          <div class="price">${product.price * product.size[size]} lei</div>
          <button data-id="${id}" data-size="${size}" class="delete">Șterge</button>
        `;
        total += product.price * product.size[size];
        cartItemsContainer.appendChild(productCard);
      }
    }

    cartTotalContainer.innerHTML =
      total === 0 ? "Coșul de cumpărături este gol" : `Total: ${total} lei`;
  }

  // Funcția care adaugă o cantitate la produsul din coș
  async function handleIncrement(e) {
    const id = e.target.getAttribute("data-id");
    const size = e.target.getAttribute("data-size");

    const cart = JSON.parse(localStorage.getItem("cart")) || {};
    const product = cart[id];
    const sizeStock = await fetchProductStock(id);
    const availableStock = sizeStock[size] || 0;

    if (product.size[size] < availableStock) {
      product.size[size] += 1;
      cart[id] = product;
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCart();
    } else {
      alert("Stoc epuizat pentru această mărime.");
    }
  }

  // Gestionare click-uri in cos
  cartItemsContainer.addEventListener("click", async (e) => {
    const id = e.target.getAttribute("data-id");
    const size = e.target.getAttribute("data-size");

    if (e.target.classList.contains("increase")) {
      await handleIncrement(e);
    } else if (e.target.classList.contains("decrease")) {
      const cart = JSON.parse(localStorage.getItem("cart")) || {};
      if (cart[id].size[size] > 1) {
        cart[id].size[size] -= 1;
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCart();
      } else {
        delete cart[id].size[size];
        if (Object.keys(cart[id].size).length === 0) {
          delete cart[id];
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCart();
      }
    } else if (e.target.classList.contains("delete")) {
      const cart = JSON.parse(localStorage.getItem("cart")) || {};
      delete cart[id].size[size];
      if (Object.keys(cart[id].size).length === 0) {
        delete cart[id];
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCart();
    }
  });

  updateCart();
});
