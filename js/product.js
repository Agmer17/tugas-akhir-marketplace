window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);

  const name = params.get("name");
  const price = params.get("price");
  const img = params.get("img");

  // Format angka ke format Rupiah
  function formatRupiah(angka) {
    return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  if (name) {
    document.getElementById("product-name").textContent = name;

    // Ambil kata pertama untuk Series
    const firstWord = name.split(" ")[0];
    const seriesEl = document.querySelector(".product-info-item:nth-child(4)"); // Series ada di posisi ke-4
    if (seriesEl) {
      seriesEl.innerHTML = `<strong>Series:</strong> ${firstWord}`;
    }
  }

  if (price) {
    const rawPrice = parseInt(price.replace(/\D/g, ""));
    const formattedPrice = formatRupiah(rawPrice);

    document.getElementById("product-price").textContent =
      "Rp" + formattedPrice;

    // Hitung DP = harga / 8
    const dp = Math.floor(rawPrice / 8);
    const dpEl = document.querySelector(".product-dp");
    if (dpEl) {
      dpEl.textContent = "DP Rp" + formatRupiah(dp);
    }
  }

  if (img) {
    const imgPath = "../img/product/" + img;
    document.getElementById("main-img").src = imgPath;

    const thumbs = document.querySelectorAll("#thumbnails img");
    thumbs.forEach((th) => {
      th.src = imgPath;
    });
  }
});
