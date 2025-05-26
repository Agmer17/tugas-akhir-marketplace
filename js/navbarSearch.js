const form = document.querySelector("form[role='search']");
const input = form.querySelector("input[type='search']");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const query = encodeURIComponent(input.value.trim());
  if (query) {
    window.location.href = `/html/search.html?query=${query}`;
  }
});
