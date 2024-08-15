import { getAllProducts } from "./api/products.js";
import { mapProductToCard } from "./utils/layout.js";

document.addEventListener("DOMContentLoaded", () => {
  displayAllProducts();
  setupPriceSort();
  setupColorSort();
});

const mainContainer = document.querySelector(".main");

async function displayAllProducts(sortedProducts = null) {
  const products = sortedProducts || (await getAllProducts());

  mainContainer.innerHTML = products.map(mapProductToCard).join(" ");

  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.getAttribute("data-id");
      const price = button.getAttribute("data-price");
      const name = button.getAttribute("data-name");
      const imageUrl = button.getAttribute("data-image");
      const stock = parseInt(button.getAttribute("data-stock"));

      let cart = JSON.parse(localStorage.getItem("cart")) || {};

      console.log(`Produs: ${name}, Stock: ${stock}`);

      if (cart[productId]) {
        if (cart[productId].quantity < stock) {
          cart[productId].quantity += 1;
        } else {
          alert("Stoc epuizat pentru produsul " + name);
        }
      } else {
        cart[productId] = {
          quantity: 1,
          price: price,
          name: name,
          imageUrl: imageUrl,
          stock: stock,
        };
      }

      localStorage.setItem("cart", JSON.stringify(cart));
    });
  });
}

function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || {};
  const productId = product.id;

  if (cart[productId]) {
    if (cart[productId].quantity < product.stock) {
      cart[productId].quantity += 1;
      showConfirmationMessage(`${product.name} a fost adăugat în coș!`);
    } else {
      alert(`Stoc epuizat pentru produsul ${product.name}`);
    }
  } else {
    cart[productId] = {
      quantity: 1,
      price: product.price,
      name: product.name,
      imageUrl: product.imageUrl,
      stock: product.stock,
    };
    showConfirmationMessage(`${product.name} a fost adăugat în coș!`);
  }
  console.log(
    `Produs: ${product.name}, Stoc actual: ${cart[productId].quantity}, Stoc disponibil: ${product.stock}`
  );

  localStorage.setItem("cart", JSON.stringify(cart));
}

function showConfirmationMessage(message) {
  const messageElement = document.getElementById("confirmation-message");
  if (messageElement) {
    messageElement.textContent = message;
    messageElement.style.display = "block";

    setTimeout(() => {
      messageElement.style.display = "none";
    }, 3000);
  }
}

function setupPriceSort() {
  const priceSortSelect = document.getElementById("price-sort");

  priceSortSelect.addEventListener("change", async (event) => {
    const sortOrder = event.target.value;
    const products = await getAllProducts();

    let sortedProducts;

    if (sortOrder === "asc") {
      sortedProducts = products.sort(
        (a, b) => parseFloat(a.price) - parseFloat(b.price)
      );
    } else if (sortOrder === "desc") {
      sortedProducts = products.sort(
        (a, b) => parseFloat(b.price) - parseFloat(a.price)
      );
    }

    displayAllProducts(sortedProducts);
  });
}

function setupColorSort() {
  const colorSortSelect = document.getElementById("color-sort");

  colorSortSelect.addEventListener("change", async (event) => {
    const selectedColor = event.target.value;
    const products = await getAllProducts();

    let filteredProducts;

    if (selectedColor === "all") {
      filteredProducts = products;
    } else {
      filteredProducts = products.filter(
        (product) => product.color && product.color.includes(selectedColor)
      );
    }

    displayAllProducts(filteredProducts);
  });
}
