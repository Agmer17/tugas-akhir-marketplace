window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const addToCart = document.getElementById("addToCart");

  const productData = {
    name: params.get("name"),
    price: params.get("price"),
    img: params.get("img"),
    desc: params.get("desc"),
  };

  sessionStorage.setItem("dummyItemData", productData);

  const formatRupiah = (price) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  const updateProductName = (name) => {
    const nameEl = document.getElementById("product-name");
    if (!nameEl) return;

    nameEl.textContent = name;

    const firstWord = name.split(" ")[0];
    const seriesEl = document.querySelector(".product-info-item:nth-child(4)");
    if (seriesEl) {
      seriesEl.innerHTML = `<strong>Series:</strong> ${firstWord}`;
    }
  };

  const addProductToCart = (data) => {
    let cart = JSON.parse(sessionStorage.getItem("cart")) || [];

    cart.push({ name: data.name, price: data.price, img: data.img });

    sessionStorage.setItem("cart", JSON.stringify(cart));

    alert("Produk ditambahkan ke keranjang!");
  };

  const updateProductPrice = (price) => {
    const rawPrice = parseInt(price.replace(/\D/g, ""));
    const formattedPrice = formatRupiah(rawPrice);

    const priceEl = document.getElementById("product-price");
    if (priceEl) {
      priceEl.textContent = formattedPrice;
    }

    const dp = Math.floor(rawPrice / 8);
    const dpEl = document.querySelector(".product-dp");
    if (dpEl) {
      dpEl.textContent = "DP " + formatRupiah(dp);
    }
  };

  const updateProductImage = (img) => {
    const imgPath = `../img/product/${img}`;
    const mainImgEl = document.getElementById("main-img");
    if (mainImgEl) {
      mainImgEl.src = imgPath;
    }

    const thumbs = document.querySelectorAll("#thumbnails img");
    thumbs.forEach((th) => (th.src = imgPath));
  };

  const updateProductDesc = (desc) => {
    const descEl = document.getElementById("desc");
    if (descEl) {
      descEl.textContent = desc;
    }
  };

  function loadProduct() {
    if (productData.name) updateProductName(productData.name);
    if (productData.price) updateProductPrice(productData.price);
    if (productData.img) updateProductImage(productData.img);
    if (productData.desc) updateProductDesc(productData.desc);
    addToCart.addEventListener("click", () => {
      addProductToCart(productData);
    });

    history.pushState(
      "",
      productData.name,
      `/product/${productData.name.replaceAll(" ", "-")}`
    );
  }

  // Saat tombol back/forward diklik
  window.onpopstate = function (event) {
    if (event.state?.page === productData.name) {
      history.replaceState({ page: "home" }, "", "/");
    }
  };

  loadProduct();
});
