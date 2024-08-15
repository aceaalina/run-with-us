import { getAllProducts } from "./api/products.js";
import { mapProductToCard } from "./utils/layout.js";

document.addEventListener("DOMContentLoaded", () => {
  displayAllProducts();
  setupPriceSort();
  setupColorSort();
  setupSizeSort();
});

const mainContainer = document.querySelector(".main");

async function displayAllProducts(sortedProducts = null) {
  const products = sortedProducts || (await getAllProducts());

  mainContainer.innerHTML = products.map(mapProductToCard).join(" ");

  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const productId = button.getAttribute("data-id");
      const price = button.getAttribute("data-price");
      const name = button.getAttribute("data-name");
      const imageUrl = button.getAttribute("data-image");

      const sizeSelect = button.previousElementSibling;
      const selectedSize = sizeSelect ? sizeSelect.value : "";

      if (!selectedSize) {
        alert("Te rugăm să selectezi o mărime.");
        return;
      }

      let cart = JSON.parse(localStorage.getItem("cart")) || {};
      const product = await fetchProductDetails(productId);
      const stock = product.sizeStock[selectedSize] || 0;

      if (cart[productId]) {
        if (cart[productId].size && cart[productId].size[selectedSize]) {
          if (cart[productId].size[selectedSize] < stock) {
            cart[productId].size[selectedSize] += 1;
          } else {
            alert("Stoc epuizat pentru produsul " + name);
          }
        } else {
          cart[productId].size[selectedSize] = 1;
        }
      } else {
        cart[productId] = {
          quantity: 1,
          price: price,
          name: name,
          imageUrl: imageUrl,
          size: { [selectedSize]: 1 },
        };
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      showConfirmationMessage(
        `${name} (${selectedSize}) a fost adăugat în coș!`
      );
    });
  });
}

async function fetchProductDetails(productId) {
  const url = `https://668d7a51099db4c579f3178d.mockapi.io/products/${productId}`;
  const response = await fetch(url);
  return response.json();
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

function setupSizeSort() {
  const sizeSortSelect = document.getElementById("size-sort");

  sizeSortSelect.addEventListener("change", async (event) => {
    const selectedSize = event.target.value;
    const products = await getAllProducts();

    let filteredProducts;

    if (selectedSize === "all") {
      filteredProducts = products;
    } else {
      filteredProducts = products.filter(
        (product) => product.size && product.size.includes(selectedSize)
      );
    }

    displayAllProducts(filteredProducts);
  });
}
