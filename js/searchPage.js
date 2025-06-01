document.addEventListener("DOMContentLoaded", async () => {
  const productContainer = document.getElementById("allProductContainer");
  const input = form.querySelector("input[type='search']");

  try {
    const params = new URLSearchParams(window.location.search);
    input.value = params.get("query");
    const response = await fetch("/data.json");
    const dataFromJson = await response.json();
    const query = params.get("query")?.toLowerCase();

    const filtered = dataFromJson.filter((item) =>
      item.name.toLowerCase().startsWith(query)
    );

    // Kosongin dulu kontainernya
    productContainer.innerHTML = "";

    if (filtered.length === 0) {
      const h1 = document.createElement("h1");
      h1.textContent = "BARANG GAK ADA TAU :(";
      h1.classList.add("text-dark", "fw-bold", "text-center", "py-3");
      productContainer.appendChild(h1);
    } else {
      renderProduct(filtered, productContainer);
    }
  } catch (error) {
    console.error("Gagal memuat data:", error);
  }
});

function renderProduct(productsData, container) {
  container.innerHTML = "";
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
    "mb-4",
    "card-container-all"
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
