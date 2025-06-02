document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".card.p-4");
  const cartSubtotalElem = document.querySelectorAll(".summary-card span")[1]; // Subtotal
  const cartOngkirElem = document.querySelectorAll(".summary-card span")[3]; // Ongkir
  const cartTotalElem = document.querySelectorAll(".summary-card span")[5]; // Total
  const ongkir = 10000;
  const paymentBTN = document.getElementById("paymentBTN");

  const formatRupiah = (price) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  function renderCart() {
    const rawCart = JSON.parse(sessionStorage.getItem("cart")) || [];
    container.innerHTML = "";

    let subtotal = 0;

    const mergedCart = [];

    rawCart.forEach((item) => {
      const existing = mergedCart.find((i) => i.name === item.name);
      if (existing) {
        existing.qty += parseInt(item.qty || 1);
      } else {
        mergedCart.push({
          ...item,
          qty: parseInt(item.qty || 1),
        });
      }
    });

    if (mergedCart.length === 0) {
      container.textContent = "Keranjang belanja Anda kosong.";
      if (paymentBTN) paymentBTN.disabled = true;
    } else {
      if (paymentBTN) paymentBTN.disabled = false;

      mergedCart.forEach((item, index) => {
        const price = parseFloat(item.price);
        const totalPerItem = price * item.qty;
        subtotal += totalPerItem;

        const productDiv = document.createElement("div");
        productDiv.className = "row product-item align-items-center mb-2";

        // Kolom gambar
        const imgCol = document.createElement("div");
        imgCol.className = "col-md-2 col-sm-3 col-4";
        const img = document.createElement("img");
        img.src = `./../img/product/${item.img}`;
        img.alt = item.name;
        img.className = "img-fluid rounded";
        imgCol.appendChild(img);

        const infoCol = document.createElement("div");
        infoCol.className = "col-md-4 col-sm-5 col-8";
        const title = document.createElement("h6");
        title.className = "mb-0";
        title.textContent = "Produk";
        const name = document.createElement("p");
        name.className = "mb-1";
        name.textContent = item.name;
        const desc = document.createElement("small");
        desc.className = "text-muted";
        desc.textContent = "Custom Futsal Jersey";
        infoCol.append(title, name, desc);

        // Kolom harga satuan
        const priceCol = document.createElement("div");
        priceCol.className =
          "col-md-2 col-sm-4 col-6 text-md-start text-sm-end mt-2 mt-sm-0";
        const priceP = document.createElement("p");
        priceP.className = "mb-0";
        priceP.textContent = `${formatRupiah(price)}`;
        priceCol.appendChild(priceP);

        // Kolom kuantitas
        const qtyCol = document.createElement("div");
        qtyCol.className = "col-md-2 col-sm-4 col-6 mt-2 mt-sm-0";
        const qtyControl = document.createElement("div");
        qtyControl.className = "quantity-control d-flex gap-1";

        const btnMinus = document.createElement("button");
        btnMinus.className = "btn btn-outline-secondary btn-sm btn-minus";
        btnMinus.dataset.index = index;
        btnMinus.textContent = "-";

        const qtyInput = document.createElement("input");
        qtyInput.type = "text";
        qtyInput.className = "form-control form-control-sm text-center";
        qtyInput.value = item.qty;
        qtyInput.disabled = true;

        const btnPlus = document.createElement("button");
        btnPlus.className = "btn btn-outline-secondary btn-sm btn-plus";
        btnPlus.dataset.index = index;
        btnPlus.textContent = "+";

        qtyControl.append(btnMinus, qtyInput, btnPlus);
        qtyCol.appendChild(qtyControl);

        // Kolom total per item
        const totalCol = document.createElement("div");
        totalCol.className =
          "col-md-2 col-sm-4 col-12 text-md-end text-sm-end text-start mt-2 mt-sm-0";
        const totalP = document.createElement("p");
        totalP.className = "mb-0 fw-bold";
        totalP.textContent = `Rp ${totalPerItem.toLocaleString()}`;
        totalCol.appendChild(totalP);

        // Gabungkan semuanya
        productDiv.append(imgCol, infoCol, priceCol, qtyCol, totalCol);
        container.appendChild(productDiv);
      });
    }

    // Update subtotal, ongkir, total
    cartSubtotalElem.textContent = `Rp ${subtotal.toLocaleString()}`;
    cartOngkirElem.textContent = `Rp ${ongkir.toLocaleString()}`;
    cartTotalElem.textContent = `Rp ${(subtotal + ongkir).toLocaleString()}`;

    if (mergedCart.length > 0) {
      attachEventListeners();
    }
  }

  function attachEventListeners() {
    const btnPlus = document.querySelectorAll(".btn-plus");
    const btnMinus = document.querySelectorAll(".btn-minus");

    btnPlus.forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = parseInt(btn.getAttribute("data-index"));
        const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
        // Pastikan qty adalah angka, default 1 jika undefined/null/NaN
        const currentQty = parseInt(cart[index].qty || 1);
        cart[index].qty = currentQty + 1;
        sessionStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
      });
    });

    btnMinus.forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = parseInt(btn.getAttribute("data-index"));
        const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
        const currentQty = parseInt(cart[index].qty || 1);

        if (currentQty <= 1) {
          if (confirm(`Hapus item "${cart[index].name}" dari keranjang?`)) {
            cart.splice(index, 1); // hapus dari cart
          } else {
            return; // Batalkan jika user membatalkan konfirmasi
          }
        } else {
          cart[index].qty = currentQty - 1;
        }

        sessionStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
      });
    });
  }

  function renderSummaryItems() {
    let subtotal = 0;
    const rawCart = JSON.parse(sessionStorage.getItem("cart")) || [];
    const mergedCart = [];

    rawCart.forEach((item) => {
      const existing = mergedCart.find((i) => i.name === item.name);
      if (existing) {
        existing.qty += parseInt(item.qty || 1);
      } else {
        mergedCart.push({
          ...item,
          qty: parseInt(item.qty || 1),
        });
      }
    });

    const summaryCard = document.querySelector(".order-summary-card");
    summaryCard.innerHTML = "";

    mergedCart.forEach((item) => {
      const qty = parseInt(item.qty || 1);
      const price = parseFloat(item.price);
      const totalPerItem = price * qty;
      subtotal += totalPerItem;
      const itemsDiv = document.createElement("div");
      itemsDiv.classList.add("summary-item");

      const spanItemName = document.createElement("span");
      spanItemName.textContent = `${item.name} (x${qty})`;

      const spanItemTotal = document.createElement("span");
      spanItemTotal.textContent = formatRupiah(totalPerItem);

      itemsDiv.appendChild(spanItemName);
      itemsDiv.appendChild(spanItemTotal);

      summaryCard.appendChild(itemsDiv);
    });

    summaryCard.appendChild(document.createElement("hr"));

    let subtotalDivs = document.createElement("div");
    subtotalDivs.classList.add("summary-item", "subtotal");
    let subtotalTitle = document.createElement("span");
    subtotalTitle.textContent = "Cart Subtotal";
    let totalItemPrice = document.createElement("span");
    totalItemPrice.textContent = formatRupiah(subtotal);

    subtotalDivs.appendChild(subtotalTitle);
    subtotalDivs.appendChild(totalItemPrice);
    summaryCard.append(subtotalDivs);

    const shippingCostDiv = document.createElement("div");
    shippingCostDiv.className = "summary-item shipping-cost";

    const labelSpan = document.createElement("span");
    labelSpan.textContent = "Ongkir";

    const valueSpan = document.createElement("span");
    valueSpan.textContent = "Rp 10.000";

    shippingCostDiv.append(labelSpan, valueSpan);

    summaryCard.append(shippingCostDiv);

    const totalDiv = document.createElement("div");
    totalDiv.className = "summary-item total";

    const totalTitle = document.createElement("span");
    totalTitle.textContent = "Cart Total";

    const totalItemShipVal = document.createElement("span");
    totalItemShipVal.textContent = `${formatRupiah(subtotal + 10000)}`; // atau nilai total langsung

    totalDiv.append(totalTitle, totalItemShipVal);
    summaryCard.append(totalDiv);
  }

  renderCart();

  if (paymentBTN) {
    const checkoutDialog = document.getElementById("checkoutDialog");
    const closeDialogBtn = checkoutDialog.querySelector(".close-dialog-btn");
    const cancelBtn = checkoutDialog.querySelector(".cancel-btn");
    const confirmBtn = checkoutDialog.querySelector(".confirm-btn");

    paymentBTN.addEventListener("click", () => {
      checkoutDialog.showModal();
      renderSummaryItems();
    });

    closeDialogBtn.addEventListener("click", function () {
      checkoutDialog.close();
    });

    // Fungsi untuk menutup dialog saat tombol 'Batal' diklik
    cancelBtn.addEventListener("click", function () {
      checkoutDialog.close();
    });
  }
});
