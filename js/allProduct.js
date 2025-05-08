/* <div class="col-6 col-sm-6 col-md-4 col-lg-3 mb-4">
  <div class="product-item">
    <img
      src="https://placehold.co/300x400"
      class="img-fluid"
      alt="Product Image"
    />
    <div>
      <div class="product-status">Order Closed</div>
      <div class="product-title">Produk Rifaldi</div>
      <div class="product-price">Rp510,000</div>
      <div class="product-dp">DP Rp200,000</div>
    </div>
  </div>
</div>; */

document.addEventListener("DOMContentLoaded", async () => {
  const productContainer = document.getElementById("allProductContainer");
  try {
    const response = await fetch("/data.json");
    const dataFromJson = await response.json();

    renderProduct(dataFromJson, productContainer);
  } catch (error) {
    console.log(error);
  }
});

function renderProduct(productsData, container) {
  productsData.forEach((data) => {
    container.appendChild(createProductCards(data));
  });
}

function formatPrice(price) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

function calculateDP(price) {
  return formatPrice(Math.floor(price / 8));
}

function createProductCards(dataProduct) {
  const cardContainer = document.createElement("div");
  cardContainer.classList.add(
    "col-6",
    "col-sm-6",
    "col-md-4",
    "col-lg-3",
    "mb-4"
  );

  const card = document.createElement("div");
  card.classList.add("product-item");

  const productImage = document.createElement("img");
  productImage.setAttribute("src", `./../img/product/${dataProduct.img}`);
  productImage.classList.add("img-fluid");

  const productDataDiv = document.createElement("div");

  const statusDiv = document.createElement("div");
  statusDiv.className = "product-status";
  statusDiv.textContent = "Order Open";
  productDataDiv.appendChild(statusDiv);

  const titleDiv = document.createElement("div");
  titleDiv.className = "product-title";
  titleDiv.textContent = dataProduct.name;
  productDataDiv.appendChild(titleDiv);

  // Buat dan tambahkan elemen price
  const priceDiv = document.createElement("div");
  priceDiv.className = "product-price";
  priceDiv.textContent = formatPrice(dataProduct.price);
  productDataDiv.appendChild(priceDiv);

  // Buat dan tambahkan elemen DP
  const dpDiv = document.createElement("div");
  dpDiv.className = "product-dp";
  dpDiv.textContent = `DP ${calculateDP(dataProduct.price)}`;
  productDataDiv.appendChild(dpDiv);

  card.appendChild(productImage);
  card.appendChild(productDataDiv);
  cardContainer.appendChild(card);

  cardContainer.addEventListener("click", () => {
    const query = new URLSearchParams({
      name: dataProduct.name,
      price: dataProduct.price,
      img: dataProduct.img,
    });
    window.location.href = `./product.html?${query.toString()}`;
  });

  return cardContainer;
}
