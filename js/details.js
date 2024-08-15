document.addEventListener("DOMContentLoaded", showProductDetails);

const url = "https://668d7a51099db4c579f3178d.mockapi.io/products";

async function showProductDetails() {
  const urlSearchParam = new URLSearchParams(window.location.search);
  const productId = urlSearchParam.get("id");

  try {
    const response = await fetch(`${url}/${productId}`);
    const product = await response.json();

    const sizeOptions = product.size
      .map((size) => `<option value="${size}">${size}</option>`)
      .join("");
    const sizeStock = product.size
      .map(
        (size) => `<p>${size}: ${product.sizeStock[size] || 0} disponibile</p>`
      )
      .join("");

    const mainContainer = document.querySelector(".main");
    mainContainer.innerHTML = `
      <div class="product-details">
        <img src="../${product.imageUrl}" alt="${product.name}" />
        <h2>${product.name}</h2>
        <p>${product.details}</p>
        <p>Preț: ${product.price} lei</p>
        <div id="stock-info">${sizeStock}</div>
        <select id="size-select">
          ${sizeOptions}
        </select>
        <button id="add-to-cart">Adaugă în coș</button>
      </div>
    `;

    const addToCartBtn = document.getElementById("add-to-cart");
    const sizeSelect = document.getElementById("size-select");

    function updateAddToCartButton() {
      const selectedSize = sizeSelect.value;
      const sizeStockAvailable = product.sizeStock[selectedSize] || 0;

      if (sizeStockAvailable > 0) {
        addToCartBtn.disabled = false;
        addToCartBtn.textContent = "Adaugă în coș";
      } else {
        addToCartBtn.disabled = true;
        addToCartBtn.textContent = "Stoc epuizat";
      }
    }

    updateAddToCartButton();

    sizeSelect.addEventListener("change", () => {
      updateAddToCartButton();
    });

    addToCartBtn.addEventListener("click", async () => {
      const selectedSize = sizeSelect.value;

      if (!selectedSize) {
        alert("Te rugăm să selectezi o mărime.");
        return;
      }

      const sizeStockAvailable = product.sizeStock[selectedSize] || 0;

      if (sizeStockAvailable > 0) {
        await addToCart(product, selectedSize);
        product.sizeStock[selectedSize]--;
        await updateProductStock(productId, product.sizeStock);

        document.getElementById("stock-info").innerHTML = product.size
          .map(
            (size) =>
              `<p>${size}: ${product.sizeStock[size] || 0} disponibile</p>`
          )
          .join("");

        updateAddToCartButton();

        if (product.sizeStock[selectedSize] === 0) {
          addToCartBtn.disabled = true;
          addToCartBtn.textContent = "Stoc epuizat";
        }
      } else {
        alert("Stoc epuizat pentru această mărime.");
      }
    });
  } catch (error) {
    console.error("Error loading product details:", error);
  }
}

async function addToCart(product, selectedSize) {
  let cart = JSON.parse(localStorage.getItem("cart")) || {};
  const productId = product.id;

  if (!cart[productId]) {
    cart[productId] = {
      quantity: 0,
      price: product.price,
      name: product.name,
      imageUrl: product.imageUrl,
      size: {},
    };
  }

  if (!cart[productId].size[selectedSize]) {
    cart[productId].size[selectedSize] = 0;
  }

  if (cart[productId].size[selectedSize] < product.sizeStock[selectedSize]) {
    cart[productId].size[selectedSize] += 1;
    cart[productId].quantity += 1;
    localStorage.setItem("cart", JSON.stringify(cart));
    showConfirmationMessage(
      `${product.name} (${selectedSize}) a fost adăugat în coș!`
    );
  } else {
    alert("Stoc epuizat pentru această mărime.");
  }
}

async function updateProductStock(productId, sizeStock) {
  await fetch(`${url}/${productId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sizeStock: sizeStock,
    }),
  });
}

function showConfirmationMessage(message) {
  const messageElement = document.getElementById("confirmation-message");
  messageElement.textContent = message;
  messageElement.style.display = "block";

  setTimeout(() => {
    messageElement.style.display = "none";
  }, 3000);
}
