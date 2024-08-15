document.addEventListener("DOMContentLoaded", showProductDetails);

const url = "https://668d7a51099db4c579f3178d.mockapi.io/products";

async function showProductDetails() {
  const urlSearchParam = new URLSearchParams(window.location.search);
  const productId = urlSearchParam.get("id");

  try {
    const response = await fetch(`${url}/${productId}`);
    const product = await response.json();

    let currentStock = product.stock;

    const mainContainer = document.querySelector(".main");
    const addToCartButton = `<button id="add-to-cart">Adaugă în coș</button>`;

    mainContainer.innerHTML = `
      <div class="product-details">
        <img src="../${product.imageUrl}" alt="${product.name}" />
        <h2>${product.name}</h2>
        <p>${product.details}</p>
        <p>Preț: ${product.price} lei</p>
        <p id="stock-info">Stoc: ${currentStock}</p>
        ${addToCartButton}
      </div>
    `;

    const addToCartBtn = document.getElementById("add-to-cart");

    addToCartBtn.addEventListener("click", () => {
      if (currentStock > 0) {
        addToCart(product);
        currentStock--;
        document.getElementById(
          "stock-info"
        ).textContent = `Stoc: ${currentStock}`;

        if (currentStock === 0) {
          addToCartBtn.disabled = true;
          addToCartBtn.textContent = "Stoc epuizat";
        }
      }
    });

    if (currentStock === 0) {
      addToCartBtn.disabled = true;
      addToCartBtn.textContent = "Stoc epuizat";
    }
  } catch (error) {
    console.error("Error loading product details:", error);
  }
}

function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || {};
  const productId = product.id;

  if (cart[productId]) {
    if (cart[productId].quantity < product.stock) {
      cart[productId].quantity += 1;
    }
  } else {
    cart[productId] = {
      quantity: 1,
      price: product.price,
      name: product.name,
      imageUrl: product.imageUrl,
      stock: product.stock,
    };
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  showConfirmationMessage(`${product.name} a fost adăugat în coș!`);
}

function showConfirmationMessage(message) {
  const messageElement = document.getElementById("confirmation-message");
  messageElement.textContent = message;
  messageElement.style.display = "block";

  setTimeout(() => {
    messageElement.style.display = "none";
  }, 3000);
}
