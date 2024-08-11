import { getAllProducts } from "./api/products.js";
import { mapProductToCard } from "./utils/layout.js";

document.addEventListener("DOMContentLoaded", () => {
  displayAllProducts();
  setupPriceSort();
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

      let cart = JSON.parse(localStorage.getItem("cart")) || {};
      if (cart[productId]) {
        cart[productId].quantity += 1;
      } else {
        cart[productId] = {
          quantity: 1,
          price: price,
          name: name,
          imageUrl: imageUrl,
        };
      }

      localStorage.setItem("cart", JSON.stringify(cart));
    });
  });
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
