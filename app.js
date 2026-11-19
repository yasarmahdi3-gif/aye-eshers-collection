
// ======================================
// AYEESHER'S COLLECTION - MAIN APP
// ======================================

const WHATSAPP_NUMBER = "2347070477730";

// Temporary sample products.
// We will replace these with the seller's
// actual products and prices.

const products = [
  {
    id: 1,
    name: "Elegant Ladies Fashion",
    category: "Fashion",
    price: 0,
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600",
  },
  {
    id: 2,
    name: "Beautiful Fashion Scarf",
    category: "Scarves",
    price: 0,
    image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600",
  },
  {
    id: 3,
    name: "Luxury Women's Shoes",
    category: "Shoes",
    price: 0,
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600",
  },
  {
    id: 4,
    name: "Elegant Jewellery",
    category: "Jewellery",
    price: 0,
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600",
  },
  {
    id: 5,
    name: "Fashion Accessories",
    category: "Accessories",
    price: 0,
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600",
  },
  {
    id: 6,
    name: "Beautiful Ladies Outfit",
    category: "Fashion",
    price: 0,
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600",
  }
];

let cart = [];

// DISPLAY PRODUCTS

function displayProducts() {
  const productList = document.getElementById("productList");

  if (!productList) return;

  productList.innerHTML = products.map(product => `
    <div class="product-card">
      <img
        src="${product.image}"
        alt="${product.name}"
        loading="lazy"
      >

      <div class="product-info">
        <p>${product.category}</p>
        <h3>${product.name}</h3>
        <p>Price: Contact us</p>

        <button onclick="addToCart(${product.id})">
          ADD TO CART
        </button>
      </div>
    </div>
  `).join("");
}

// ADD TO CART

function addToCart(id) {
  const product = products.find(item => item.id === id);

  if (!product) return;

  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }

  updateCart();

  alert(product.name + " added to your cart!");
}

// REMOVE FROM CART

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCart();
}

// UPDATE CART

function updateCart() {
  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const cartTotal = document.getElementById("cartTotal");

  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity, 0
  );

  if (cartCount) {
    cartCount.textContent = totalItems;
  }

  if (cartItems) {
    if (cart.length === 0) {
      cartItems.innerHTML = "Your shopping cart is empty.";
    } else {
      cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
          <span>
            ${item.name} × ${item.quantity}
          </span>

          <button onclick="removeFromCart(${item.id})">
            Remove
          </button>
        </div>
      `).join("");
    }
  }

  if (cartTotal) {
    cartTotal.textContent = "Price confirmed on WhatsApp";
  }
}

// WHATSAPP ORDERING

function orderOnWhatsApp() {
  if (cart.length === 0) {
    alert("Please add products to your cart first.");
    return;
  }

  let message = "Hello AYEESHER'S COLLECTION! I want to order:\n\n";

  cart.forEach(item => {
    message +=
      item.name + " - Quantity: " + item.quantity + "\n";
  });

  message += "\nPlease confirm the prices and availability. Thank you!";

  const url =
    "https://wa.me/" +
    WHATSAPP_NUMBER +
    "?text=" +
    encodeURIComponent(message);

  window.open(url, "_blank");
}

// ONLINE PAYMENT

function payOnline() {
  if (cart.length === 0) {
    alert("Please add products to your cart first.");
    return;
  }

  alert(
    "Online payment is not activated yet. " +
    "Please order through WhatsApp while we set up the secure payment gateway."
  );
}

// MOBILE MENU

const menuToggle = document.getElementById("menuToggle");
const navigation = document.getElementById("navigation");

if (menuToggle && navigation) {
  menuToggle.addEventListener("click", () => {
    navigation.classList.toggle("active");
  });

  navigation.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navigation.classList.remove("active");
    });
  });
}

// CONNECT BUTTONS

const whatsappButton = document.getElementById("whatsappOrder");
const paymentButton = document.getElementById("onlinePayment");

if (whatsappButton) {
  whatsappButton.addEventListener("click", orderOnWhatsApp);
}

if (paymentButton) {
  paymentButton.addEventListener("click", payOnline);
}

// START WEBSITE

displayProducts();
updateCart();

console.log("AYEESHER'S COLLECTION website loaded successfully!");
