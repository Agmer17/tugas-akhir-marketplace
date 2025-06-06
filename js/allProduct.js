document.addEventListener("DOMContentLoaded", async () => {
  const productContainer = document.getElementById("allProductContainer");
  try {
    const response = await fetch("/data.json");
    const dataFromJson = await response.json();

    renderProduct(dataFromJson, productContainer);
    renderProductCategory(dataFromJson);
  } catch (error) {
    console.log(error);
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

function buatCheckboxCategory(cat, isAll = false) {
  const div = document.createElement("div");
  div.className = "form-check";

  const input = document.createElement("input");
  input.type = "checkbox";
  input.className = "form-check-input";
  input.id = `category${capitalize(cat)}`;
  input.value = cat;
  if (isAll) input.checked = true;

  const label = document.createElement("label");
  label.className = "form-check-label";
  label.htmlFor = input.id;
  label.textContent = capitalize(cat);

  div.appendChild(input);
  div.appendChild(label);

  return div;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function renderProductCategory(data) {
  const productContainer = document.getElementById("allProductContainer");

  const categories = [
    ...new Set(data.map((item) => item.name.split(" ")[0].toLowerCase())),
  ];
  const container = document.getElementById("categoryAll");

  categories.forEach((itemName) => {
    const checkbox = buatCheckboxCategory(itemName);
    container.appendChild(checkbox);
  });

  container.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    checkbox.addEventListener("change", (e) => {
      if (checkbox.checked) {
        // Uncheck semua checkbox lain kecuali ini
        container.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
          if (cb !== checkbox) cb.checked = false;
        });

        // Filter data sesuai kategori checkbox ini (case insensitive)
        const category = checkbox.value.toLowerCase();
        const filteredData = data.filter((item) =>
          item.name.toLowerCase().startsWith(category)
        );

        renderProduct(filteredData, productContainer);
      } else {
        // Kalau checkbox di-uncheck, render semua produk (opsional)
        renderProduct(data, productContainer);
      }
    });
  });
}
