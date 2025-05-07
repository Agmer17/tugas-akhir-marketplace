document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".card.p-4");
  const cartSubtotalElem = document.querySelectorAll(".summary-card span")[1]; // Subtotal
  const cartOngkirElem = document.querySelectorAll(".summary-card span")[3]; // Ongkir
  const cartTotalElem = document.querySelectorAll(".summary-card span")[5]; // Total
  const ongkir = 10000;

  function renderCart() {
    const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    container.innerHTML = ""; // bersihkan container

    let subtotal = 0;

    cart.forEach((item, index) => {
      const price = parseFloat(item.price);
      const qty = parseInt(item.qty || 1);
      const totalPerItem = price * qty;
      subtotal += totalPerItem;

      const productHTML = document.createElement("div");
      productHTML.className = "row product-item align-items-center";
      productHTML.innerHTML = `
        <div class="col-md-2 col-sm-3 col-4">
          <img src="./../img/product/${
            item.img
          }" class="img-fluid rounded" alt="${item.name}" />
        </div>
        <div class="col-md-4 col-sm-5 col-8">
          <h6 class="mb-0">Produk</h6>
          <p class="mb-1">${item.name}</p>
          <small class="text-muted">Custom Futsal Jersey</small>
        </div>
        <div class="col-md-2 col-sm-4 col-6 text-md-start text-sm-end mt-2 mt-sm-0">
          <p class="mb-0">Rp ${price.toLocaleString()}</p>
        </div>
        <div class="col-md-2 col-sm-4 col-6 mt-2 mt-sm-0">
          <div class="quantity-control d-flex gap-1">
            <button class="btn btn-outline-secondary btn-sm btn-minus" data-index="${index}">-</button>
            <input type="text" class="form-control form-control-sm text-center" value="${qty}" disabled />
            <button class="btn btn-outline-secondary btn-sm btn-plus" data-index="${index}">+</button>
          </div>
        </div>
        <div class="col-md-2 col-sm-4 col-12 text-md-end text-sm-end text-start mt-2 mt-sm-0">
          <p class="mb-0 fw-bold">Rp ${totalPerItem.toLocaleString()}</p>
        </div>
      `;
      container.appendChild(productHTML);
    });

    // Update nilai subtotal, ongkir, dan total
    cartSubtotalElem.textContent = `Rp ${subtotal.toLocaleString()}`;
    cartOngkirElem.textContent = `Rp ${ongkir.toLocaleString()}`;
    cartTotalElem.textContent = `Rp ${(subtotal + ongkir).toLocaleString()}`;

    attachEventListeners(); // pasang event listener ulang setiap render
  }

  function attachEventListeners() {
    const btnPlus = document.querySelectorAll(".btn-plus");
    const btnMinus = document.querySelectorAll(".btn-minus");

    btnPlus.forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = parseInt(btn.getAttribute("data-index"));
        const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
        cart[index].qty = (parseInt(cart[index].qty) || 1) + 1;
        sessionStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
      });
    });

    btnMinus.forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = parseInt(btn.getAttribute("data-index"));
        const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
        const currentQty = parseInt(cart[index].qty) || 1;

        if (currentQty <= 1) {
          cart.splice(index, 1); // hapus dari cart
        } else {
          cart[index].qty = currentQty - 1;
        }

        sessionStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
      });
    });
  }

  renderCart(); // panggil saat pertama
});
