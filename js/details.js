document.addEventListener("DOMContentLoaded", showProductDetails);

const url = "https://668d7a51099db4c579f3178d.mockapi.io/products";
async function showProductDetails() {
  const urlSearchParam = new URLSearchParams(window.location.search);
  const productId = urlSearchParam.get("id");

  const response = await fetch(`${url}/${productId}`);
  const product = await response.json();

  document.querySelector(".main").innerHTML = `<h2>${product.details}</h2>`;
}
