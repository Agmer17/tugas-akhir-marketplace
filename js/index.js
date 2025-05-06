document.querySelectorAll(".product-card").forEach((card) => {
  card.addEventListener("click", () => {
    const name = encodeURIComponent(card.dataset.name);
    const price = encodeURIComponent(card.dataset.price);
    const img = encodeURIComponent(card.dataset.img);

    const url = `/html/product.html?name=${name}&price=${price}&img=${img}`;
    window.location.href = url;
  });
});

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
