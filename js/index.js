document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("productCardsContainer");
  const newProductContainer = document.getElementById("productNormalContainer");
  if (!container || !newProductContainer) {
    console.error(
      'Container produk dengan ID "productCardsContainer" tidak ditemukan!'
    );
    return;
  }

  try {
    const products = await fetchProducts("/data.json");
    const slidingProduct = products.slice(0, 7);
    renderProductCards(slidingProduct, container);
    renderNormalProducts(products, newProductContainer);
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
    throw new Error(
      `Gagal mengambil data: ${response.status} ${response.statusText}`
    );
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
  price.classList.add(
    "card-text",
    "fw-bold",
    "text-warning",
    "text-center",
    "mb-0"
  );
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
  const url = `/html/product.html?name=${encodeURIComponent(
    name
  )}&price=${encodeURIComponent(price)}&img=${encodeURIComponent(
    img
  )}&desc=${encodeURIComponent(desc)}`;
  window.location.href = url;
}

// Script untuk fungsi scrolling tombol
function scrollCards(scrollOffset) {
  const container = document.querySelector(".horizontal-scroll-container");
  container.scrollBy({
    left: scrollOffset,
    behavior: "smooth",
  });
}

// document.querySelectorAll(".btn.bg-warning").forEach((button) => {
//   button.addEventListener("click", function (e) {
//     e.preventDefault(); // Jangan langsung redirect

//     // Cari elemen parent .col (yang punya data-*)
//     const parent = this.closest(".col");

//     const name = parent.dataset.name;
//     const price = parent.dataset.price;
//     const img = parent.dataset.img;

//     // Encode dan buat URL
//     const query = new URLSearchParams({
//       name: name,
//       price: price,
//       img: img,
//     });

//     // Redirect ke product.html dengan query string
//     window.location.href = `./html/product.html?${query.toString()}`;
//   });
// });

// document.querySelectorAll(".btn.btn-primary.btn-sm.w-100").forEach((button) => {
//   button.addEventListener("click", (e) => {
//     e.preventDefault();

//     // Ambil elemen induk terdekat yang punya atribut data-*
//     const productEl = button.closest("[data-name][data-price][data-img]");

//     const name = productEl.dataset.name;
//     const price = productEl.dataset.price;
//     const img = productEl.dataset.img;

//     const product = { name, price, img };

//     // Ambil cart dari sessionStorage, atau buat array kosong
//     let cart = JSON.parse(sessionStorage.getItem("cart")) || [];

//     cart.push(product);

//     sessionStorage.setItem("cart", JSON.stringify(cart));

//     alert("Produk ditambahkan ke keranjang!");
//   });
// });

function renderNormalProducts(products, container) {
  // Hanya ambil produk tertentu kalau diperlukan, misal tanpa filter: gunakan seluruh array
  const productList = [...products].reverse();
  const dataProduct = productList.slice(0, 8);
  dataProduct.forEach((product) => {
    const col = document.createElement("div");
    col.className = "col fw-semibold";
    col.dataset.img = product.img;
    col.dataset.price = product.price;
    col.dataset.name = product.name;

    const card = document.createElement("div");
    card.className = "card h-100 border-primary-color";

    const img = document.createElement("img");
    img.src = `./img/product/${product.img}`;
    img.className = "img-fluid card-img-top";
    img.alt = "Product Image";

    const cardBody = document.createElement("div");
    cardBody.className = "card-body d-flex flex-column";

    const title = document.createElement("h5");
    title.className = "card-title";
    title.textContent = product.name;

    const originalPrice = document.createElement("p");
    originalPrice.className = "card-text mb-0";
    originalPrice.innerHTML = `<small class="text-muted"><del>${formatPrice(
      product.originalPrice || product.price * 2
    )}</del></small>`;

    const price = document.createElement("p");
    price.className = "card-text";
    price.textContent = formatPrice(product.price);

    const btnGroup = document.createElement("div");
    btnGroup.className = "mt-auto";

    const viewBtn = document.createElement("a");
    viewBtn.href = `/html/product.html?name=${encodeURIComponent(
      product.name
    )}&price=${encodeURIComponent(product.price)}&img=${encodeURIComponent(
      product.img
    )}&desc=${encodeURIComponent(product.description || "")}`;
    viewBtn.className =
      "btn bg-warning text-white fw-semibold btn-sm w-100 mb-2";
    viewBtn.textContent = "View Detail";

    const cartBtn = document.createElement("a");
    cartBtn.className = "btn btn-primary btn-sm w-100";
    cartBtn.textContent = "Add To Cart";
    cartBtn.addEventListener("click", () => {
      const data = {
        name: product.name,
        price: product.price,
        img: product.img,
      };
      let cart = JSON.parse(sessionStorage.getItem("cart")) || [];

      cart.push(product);

      sessionStorage.setItem("cart", JSON.stringify(cart));

      alert("Produk ditambahkan ke keranjang!");
    });

    // Merakit elemen
    btnGroup.appendChild(viewBtn);
    btnGroup.appendChild(cartBtn);

    cardBody.appendChild(title);
    cardBody.appendChild(originalPrice);
    cardBody.appendChild(price);
    cardBody.appendChild(btnGroup);

    card.appendChild(img);
    card.appendChild(cardBody);

    col.appendChild(card);
    container.appendChild(col);
  });
}
