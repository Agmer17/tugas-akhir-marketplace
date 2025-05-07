document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("productCardsContainer");
  if (!container) {
    console.error('Container produk dengan ID "productCardsContainer" tidak ditemukan!');
    return;
  }

  try {
    const products = await fetchProducts("/data.json");
    renderProductCards(products, container);
  } catch (error) {
    console.error("Error saat memuat data produk:", error);
    container.innerHTML = "<p>Gagal memuat produk. Coba refresh halaman.</p>";
  }
});

function formatPrice(price) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

async function fetchProducts(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Gagal mengambil data: ${response.status} ${response.statusText}`);
  }
  return await response.json();
}

function renderProductCards(products, container) {
  products.forEach((product) => {
    const card = createProductCard(product);
    container.appendChild(card);

    card.addEventListener("click", () => handleCardClick(card));
  });
}

function createProductCard(product) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("me-3");

  const card = document.createElement("div");
  card.classList.add("card", "product-card", "h-100");
  card.dataset.img = product.img;
  card.dataset.price = product.price;
  card.dataset.name = product.name;
  card.dataset.desc = product.description;

  const cardTop = document.createElement("div");
  cardTop.classList.add("card-top-yellow");

  const img = document.createElement("img");
  img.src = `./img/product/${product.img}`;
  img.classList.add("h-100", "card-img-top", "object-fit-cover");
  img.alt = product.name;

  cardTop.appendChild(img);

  const cardBottom = document.createElement("div");
  cardBottom.classList.add("card-bottom-white", "p-2");

  const title = document.createElement("h6");
  title.classList.add("card-title", "text-dark", "text-center", "mb-1");
  title.textContent = product.name;

  const price = document.createElement("p");
  price.classList.add("card-text", "fw-bold", "text-warning", "text-center", "mb-0");
  price.textContent = formatPrice(product.price);

  cardBottom.appendChild(title);
  cardBottom.appendChild(price);

  card.appendChild(cardTop);
  card.appendChild(cardBottom);
  wrapper.appendChild(card);

  return wrapper;
}

function handleCardClick(wrapper) {
  const card = wrapper.querySelector(".card.product-card");
  if (!card) {
    console.error("Inner card element not found inside clicked product card.");
    return;
  }

  const { name, price, img, desc } = card.dataset;
  const url = `/html/product.html?name=${encodeURIComponent(name)}&price=${encodeURIComponent(price)}&img=${encodeURIComponent(img)}&desc=${encodeURIComponent(desc)}`;
  window.location.href = url;
}

// Script untuk fungsi scrolling tombol
function scrollCards(scrollOffset) {
  const container = document.querySelector(".horizontal-scroll-container");
  container.scrollBy({
    left: scrollOffset,
    behavior: "smooth", // Animasi smooth scrolling
  });
}
document.querySelectorAll(".btn.bg-warning").forEach((button) => {
  button.addEventListener("click", function (e) {
    e.preventDefault(); // Jangan langsung redirect

    // Cari elemen parent .col (yang punya data-*)
    const parent = this.closest(".col");

    const name = parent.dataset.name;
    const price = parent.dataset.price;
    const img = parent.dataset.img;

    // Encode dan buat URL
    const query = new URLSearchParams({
      name: name,
      price: price,
      img: img,
    });

    // Redirect ke product.html dengan query string
    window.location.href = `./html/product.html?${query.toString()}`;
  });
});

document.querySelectorAll(".btn.btn-primary.btn-sm.w-100").forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();

    // Ambil elemen induk terdekat yang punya atribut data-*
    const productEl = button.closest("[data-name][data-price][data-img]");

    const name = productEl.dataset.name;
    const price = productEl.dataset.price;
    const img = productEl.dataset.img;

    const product = { name, price, img };

    // Ambil cart dari sessionStorage, atau buat array kosong
    let cart = JSON.parse(sessionStorage.getItem("cart")) || [];

    cart.push(product);

    sessionStorage.setItem("cart", JSON.stringify(cart));

    alert("Produk ditambahkan ke keranjang!");
  });
});
