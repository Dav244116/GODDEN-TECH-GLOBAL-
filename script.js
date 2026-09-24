/* =========================================
   GODDEN TECH GLOBAL
   Premium Gadget Store
========================================= */


/* BACKEND */

const BACKEND_URL =
  "https://godden-tech-backend-production.up.railway.app";


/* WHATSAPP NUMBER */

const WHATSAPP_NUMBER = "2347068270950";


/* PRODUCT DATABASE */

const products = [

  {
    id: 1,
    name: "iPhone 15 Pro",
    category: "smartphones",
    price: 1250000,
    icon: "📱",
    badge: "FEATURED",
    description: "Premium Apple smartphone with powerful performance."
  },

  {
    id: 2,
    name: "Samsung Galaxy S25",
    category: "smartphones",
    price: 1150000,
    icon: "📱",
    badge: "NEW",
    description: "Modern Galaxy flagship smartphone."
  },

  {
    id: 3,
    name: "MacBook Air M3",
    category: "laptops",
    price: 1750000,
    icon: "💻",
    badge: "POPULAR",
    description: "Powerful and lightweight laptop for everyday performance."
  },

  {
    id: 4,
    name: "HP EliteBook",
    category: "laptops",
    price: 950000,
    icon: "💻",
    badge: "PRO",
    description: "Professional laptop built for productivity."
  },

  {
    id: 5,
    name: "AirPods Pro",
    category: "audio",
    price: 380000,
    icon: "🎧",
    badge: "HOT",
    description: "Premium wireless earbuds with immersive audio."
  },

  {
    id: 6,
    name: "Sony WH-1000XM5",
    category: "audio",
    price: 650000,
    icon: "🎧",
    badge: "PREMIUM",
    description: "Premium wireless headphones for immersive listening."
  },

  {
    id: 7,
    name: "PlayStation 5",
    category: "gaming",
    price: 950000,
    icon: "🎮",
    badge: "GAMING",
    description: "Next-generation gaming console."
  },

  {
    id: 8,
    name: "Apple Watch Series 10",
    category: "wearables",
    price: 620000,
    icon: "⌚",
    badge: "NEW",
    description: "Smart wearable for everyday connectivity."
  },

  {
    id: 9,
    name: "JBL Charge 5",
    category: "audio",
    price: 280000,
    icon: "🔊",
    badge: "HOT",
    description: "Portable speaker with powerful sound."
  },

  {
    id: 10,
    name: "Gaming Controller",
    category: "gaming",
    price: 85000,
    icon: "🎮",
    badge: "GAMING",
    description: "Responsive controller for your gaming setup."
  },

  {
    id: 11,
    name: "65W Fast Charger",
    category: "accessories",
    price: 45000,
    icon: "🔌",
    badge: "FAST",
    description: "High-speed charging accessory for compatible devices."
  },

  {
    id: 12,
    name: "Galaxy Buds",
    category: "audio",
    price: 210000,
    icon: "🎧",
    badge: "NEW",
    description: "Compact wireless earbuds for everyday listening."
  }

];


/* STATE */

let cart = JSON.parse(
  localStorage.getItem("goddenCart") || "[]"
);

let currentFilter = "all";
let currentProduct = null;


/* DOM */

const productsGrid =
  document.getElementById("productsGrid");

const emptyProducts =
  document.getElementById("emptyProducts");

const cartCount =
  document.getElementById("cartCount");

const cartDrawer =
  document.getElementById("cartDrawer");

const cartItems =
  document.getElementById("cartItems");

const cartEmpty =
  document.getElementById("cartEmpty");

const cartTotal =
  document.getElementById("cartTotal");

const overlay =
  document.getElementById("overlay");

const modal =
  document.getElementById("productModal");

const toast =
  document.getElementById("toast");

const searchPanel =
  document.getElementById("searchPanel");

const searchInput =
  document.getElementById("searchInput");

const mobileMenu =
  document.getElementById("mobileMenu");


/* MONEY FORMAT */

function formatMoney(amount) {

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0
  }).format(amount);

}


/* CATEGORY NAME */

function categoryName(category) {

  return category
    .replace("-", " ")
    .replace(/\b\w/g, letter => letter.toUpperCase());

}


/* SAVE CART */

function saveCart() {

  localStorage.setItem(
    "goddenCart",
    JSON.stringify(cart)
  );

}


/* RENDER PRODUCTS */

function renderProducts() {

  const searchTerm =
    searchInput.value.trim().toLowerCase();

  const filteredProducts =
    products.filter(product => {

      const matchesCategory =
        currentFilter === "all" ||
        product.category === currentFilter;

      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm);

      return matchesCategory && matchesSearch;

    });


  productsGrid.innerHTML = "";


  if (filteredProducts.length === 0) {

    emptyProducts.classList.add("show");

    return;

  }


  emptyProducts.classList.remove("show");


  filteredProducts.forEach(product => {

    const card =
      document.createElement("article");

    card.className = "product-card";


    card.innerHTML = `

      <div
        class="product-image"
        data-product="${product.id}"
      >

        <span class="product-badge">
          ${product.badge}
        </span>

        <span>
          ${product.icon}
        </span>

      </div>


      <div class="product-info">

        <span class="product-category">
          ${categoryName(product.category)}
        </span>

        <h3 class="product-name">
          ${product.name}
        </h3>

        <p class="product-description">
          ${product.description}
        </p>


        <div class="product-bottom">

          <span class="product-price">
            ${formatMoney(product.price)}
          </span>

          <button
            class="add-btn"
            data-add="${product.id}"
            aria-label="Add ${product.name} to cart"
          >
            +
          </button>

        </div>

      </div>

    `;


    productsGrid.appendChild(card);

  });

}


/* ADD TO CART */

function addToCart(productId) {

  const product =
    products.find(item => item.id === productId);

  if (!product) return;


  const existing =
    cart.find(item => item.id === productId);


  if (existing) {

    existing.quantity += 1;

  } else {

    cart.push({
      ...product,
      quantity: 1
    });

  }


  saveCart();
  renderCart();

  showToast(`${product.name} added to cart`);

}


/* REMOVE */

function removeFromCart(productId) {

  cart =
    cart.filter(item => item.id !== productId);

  saveCart();

  renderCart();

}


/* CHANGE QUANTITY */

function changeQuantity(productId, amount) {

  const item =
    cart.find(product => product.id === productId);

  if (!item) return;


  item.quantity += amount;


  if (item.quantity <= 0) {

    removeFromCart(productId);

    return;

  }


  saveCart();

  renderCart();

}


/* RENDER CART */

function renderCart() {

  cartItems.innerHTML = "";


  let totalItems = 0;
  let totalPrice = 0;


  cart.forEach(item => {

    totalItems += item.quantity;

    totalPrice +=
      item.price * item.quantity;


    const row =
      document.createElement("div");

    row.className = "cart-item";


    row.innerHTML = `

      <div class="cart-item-icon">
        ${item.icon}
      </div>


      <div>

        <div class="cart-item-name">
          ${item.name}
        </div>

        <div class="cart-item-price">
          ${formatMoney(item.price)}
        </div>


        <div class="qty-controls">

          <button
            data-minus="${item.id}"
          >
            −
          </button>

          <span>
            ${item.quantity}
          </span>

          <button
            data-plus="${item.id}"
          >
            +
          </button>

        </div>

      </div>


      <button
        class="remove-item"
        data-remove="${item.id}"
        aria-label="Remove item"
      >
        ✕
      </button>

    `;


    cartItems.appendChild(row);

  });


  cartCount.textContent = totalItems;

  cartTotal.textContent =
    formatMoney(totalPrice);


  if (cart.length === 0) {

    cartEmpty.classList.add("show");

  } else {

    cartEmpty.classList.remove("show");

  }

}


/* OPEN CART */

function openCart() {

  cartDrawer.classList.add("open");
  overlay.classList.add("open");

  document.body.classList.add("no-scroll");

}


/* CLOSE CART */

function closeCart() {

  cartDrawer.classList.remove("open");
  overlay.classList.remove("open");

  document.body.classList.remove("no-scroll");

}


/* OPEN PRODUCT */

function openProduct(productId) {

  const product =
    products.find(item => item.id === productId);

  if (!product) return;


  currentProduct = product;


  document.getElementById("modalIcon")
    .textContent = product.icon;

  document.getElementById("modalCategory")
    .textContent = categoryName(product.category);

  document.getElementById("modalTitle")
    .textContent = product.name;

  document.getElementById("modalDescription")
    .textContent = product.description;

  document.getElementById("modalPrice")
    .textContent = formatMoney(product.price);


  modal.classList.add("open");

}


/* CLOSE PRODUCT */

function closeProduct() {

  modal.classList.remove("open");

  currentProduct = null;

}


/* TOAST */

function showToast(message) {

  toast.querySelector("p").textContent =
    message;

  toast.classList.add("show");


  setTimeout(() => {

    toast.classList.remove("show");

  }, 2200);

}


/* CHECKOUT */

async function checkout() {

  if (cart.length === 0) {

    showToast("Your cart is empty");

    return;

  }


  let total = 0;


  const orderLines =
    cart.map(item => {

      const itemTotal =
        item.price * item.quantity;

      total += itemTotal;


      return `• ${item.name} x${item.quantity} — ${formatMoney(itemTotal)}`;

    });


  /*
    Send order to GODDEN TECH backend
  */

  try {

    showToast("Sending your order...");


    const response =
      await fetch(`${BACKEND_URL}/api/orders`, {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          customer: {
            source: "GODDEN TECH GLOBAL website"
          },

          items: cart.map(item => ({

            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity

          })),

          total: total

        })

      });


    const data =
      await response.json();


    if (!response.ok || !data.success) {

      throw new Error(
        data.message || "Order could not be created."
      );

    }


    const orderId =
      data.order?.orderId || "Pending";


    const message =

`Hello GODDEN TECH GLOBAL 👋

I would like to place an order.

ORDER ID:
${orderId}

MY ORDER:
${orderLines.join("\n")}

TOTAL:
${formatMoney(total)}

Please confirm availability and delivery details.

Thank you.`;


    const url =
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;


    showToast("Order created successfully");

    window.open(url, "_blank");


  } catch (error) {

    console.error(
      "Checkout error:",
      error
    );


    showToast(
      "Unable to connect to the order server."
    );

  }

}


/* FILTER */

function setFilter(filter) {

  currentFilter = filter;

  document.querySelectorAll(".filter")
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.filter === filter
      );

    });


  renderProducts();

  document
    .getElementById("shop")
    .scrollIntoView({
      behavior: "smooth"
    });

}


/* EVENT DELEGATION */

productsGrid.addEventListener("click", event => {

  const addButton =
    event.target.closest("[data-add]");

  if (addButton) {

    addToCart(
      Number(addButton.dataset.add)
    );

    return;

  }


  const image =
    event.target.closest("[data-product]");

  if (image) {

    openProduct(
      Number(image.dataset.product)
    );

  }

});


cartItems.addEventListener("click", event => {

  const plus =
    event.target.closest("[data-plus]");

  const minus =
    event.target.closest("[data-minus]");

  const remove =
    event.target.closest("[data-remove]");


  if (plus) {

    changeQuantity(
      Number(plus.dataset.plus),
      1
    );

  }


  if (minus) {

    changeQuantity(
      Number(minus.dataset.minus),
      -1
    );

  }


  if (remove) {

    removeFromCart(
      Number(remove.dataset.remove)
    );

  }

});


/* FILTER BUTTONS */

document.querySelectorAll(".filter")
  .forEach(button => {

    button.addEventListener("click", () => {

      setFilter(button.dataset.filter);

    });

  });


/* CATEGORY BUTTONS */

document.querySelectorAll(".category-card")
  .forEach(button => {

    button.addEventListener("click", () => {

      setFilter(button.dataset.category);

    });

  });


/* CART */

document
  .getElementById("cartBtn")
  .addEventListener("click", openCart);


document
  .getElementById("closeCart")
  .addEventListener("click", closeCart);


overlay.addEventListener("click", closeCart);


document
  .getElementById("startShopping")
  .addEventListener("click", () => {

    closeCart();

    document
      .getElementById("shop")
      .scrollIntoView({
        behavior: "smooth"
      });

  });


document
  .getElementById("checkoutBtn")
  .addEventListener("click", checkout);


/* PRODUCT MODAL */

document
  .getElementById("modalClose")
  .addEventListener("click", closeProduct);


modal.addEventListener("click", event => {

  if (event.target === modal) {

    closeProduct();

  }

});


document
  .getElementById("modalAdd")
  .addEventListener("click", () => {

    if (!currentProduct) return;

    addToCart(currentProduct.id);

    closeProduct();

    openCart();

  });


/* SEARCH */

document
  .getElementById("searchBtn")
  .addEventListener("click", () => {

    searchPanel.classList.toggle("open");

    if (searchPanel.classList.contains("open")) {

      searchInput.focus();

    }

  });


document
  .getElementById("closeSearch")
  .addEventListener("click", () => {

    searchPanel.classList.remove("open");

  });


searchInput.addEventListener(
  "input",
  renderProducts
);


/* MOBILE MENU */

document
  .getElementById("mobileMenuBtn")
  .addEventListener("click", () => {

    mobileMenu.classList.toggle("open");

  });


document
  .querySelectorAll(".mobile-menu a")
  .forEach(link => {

    link.addEventListener("click", () => {

      mobileMenu.classList.remove("open");

    });

  });


/* ESCAPE KEY */

document.addEventListener("keydown", event => {

  if (event.key !== "Escape") return;

  closeCart();

  closeProduct();

  searchPanel.classList.remove("open");

  mobileMenu.classList.remove("open");

});


/* INITIALIZE */

renderProducts();

renderCart();