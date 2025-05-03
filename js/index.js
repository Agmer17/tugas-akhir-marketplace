// Script untuk fungsi scrolling tombol
function scrollCards(scrollOffset) {
  const container = document.querySelector(".horizontal-scroll-container");
  container.scrollBy({
    left: scrollOffset,
    behavior: "smooth", // Animasi smooth scrolling
  });
}
