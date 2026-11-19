const supabase = window.supabaseClient;
/* =========================================
   AYEESHER'S COLLECTION
   SUPABASE BACKEND + SHOPPING SYSTEM
========================================= */

const WHATSAPP_NUMBER = "2347070477730";

let cart = [];
let currentUser = null;
let products = [];

// ELEMENTS
const productList = document.getElementById("productList");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

const authForms = document.getElementById("authForms");
const userDashboard = document.getElementById("userDashboard");
const authMessage = document.getElementById("authMessage");

// =========================================
// SECURITY / DISPLAY HELPERS
// =========================================

function showMessage(message, isError = false) {
  if (!authMessage) return;

  authMessage.textContent = message;
  authMessage.style.color = isError ? "#c0392b" : "#247a43";
}

function formatPrice(price) {
  return Number(price).toLocaleString("en-NG", {
    maximumFractionDigits: 2
  });
}

function createElement(tag, className, text) {
  const element = document.createElement(tag);

  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;

  return element;
}

// =========================================
// CUSTOMER REGISTRATION
// =========================================

const signupForm = document.getElementById("signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("signupName").value.trim();
    const phone = document.getElementById("signupPhone").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value;

    if (!name || !phone || !email || password.length < 8) {
      showMessage("Please complete all fields correctly.", true);
      return;
    }

    const submitButton = signupForm.querySelector("button");
    submitButton.disabled = true;
    showMessage("Creating your account...");

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            phone: phone
          }
        }
      });

      if (error) throw error;

      if (data.session) {
        document.getElementById("signupPassword").value = "";
        signupForm.reset();
        await refreshSession();

        showMessage("Welcome! Your account has been created.");
      } else {
        showMessage(
          "Account created! Please check your email to confirm your account."
        );
        signupForm.reset();
      }

    } catch (error) {
      showMessage(error.message, true);
    } finally {
      submitButton.disabled = false;
    }
  });
}

// =========================================
// CUSTOMER LOGIN
// =========================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    const submitButton = loginForm.querySelector("button");
    submitButton.disabled = true;

    showMessage("Signing you in...");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      loginForm.reset();
      await refreshSession();

      showMessage("Login successful. Welcome back!");

    } catch (error) {
      showMessage(error.message, true);
    } finally {
      submitButton.disabled = false;
    }
  });
}

// =========================================
// SESSION MANAGEMENT
// =========================================

async function refreshSession() {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error(error.message);
    currentUser = null;
  } else {
    currentUser = data.user;
  }

  updateAccountDisplay();
}

function updateAccountDisplay() {
  if (currentUser) {
    if (authForms) authForms.hidden = true;
    if (userDashboard) userDashboard.hidden = false;

    const name =
      currentUser.user_metadata?.full_name ||
      currentUser.email;

    const nameElement = document.getElementById("userName");

    if (nameElement) {
      nameElement.textContent = "Hello, " + name;
    }

  } else {
    if (authForms) authForms.hidden = false;
    if (userDashboard) userDashboard.hidden = true;
  }
}

// LOGOUT

const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {
  logoutButton.addEventListener("click", async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      showMessage(error.message, true);
      return;
    }

    currentUser = null;
    updateAccountDisplay();
    showMessage("You have logged out successfully.");
  });
}

// WATCH AUTH CHANGES

supabase.auth.onAuthStateChange((event, session) => {
  currentUser = session?.user || null;
  updateAccountDisplay();
});

// =========================================
// LOAD PRODUCTS FROM SUPABASE
// =========================================

async function loadProducts() {
  if (!productList) return;

  productList.textContent = "Loading products...";

  try {
    const { data, error } = await supabase
      .from("products")
      .select("id, name, description, price, image_url, category_id, stock")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) throw error;

    products = data || [];
    renderProducts();

  } catch (error) {
    console.error("Product loading error:", error.message);

    productList.textContent =
      "Unable to load products. Please refresh the page.";
  }
}

function renderProducts() {
  if (!productList) return;

  productList.replaceChildren();

  if (products.length === 0) {
    productList.textContent =
      "Our products are coming soon. Please check back!";
    return;
  }

  products.forEach(product => {
    const card = createElement("article", "product-card");

    const image = document.createElement("img");

    image.src = product.image_url || "";
    image.alt = product.name;
    image.loading = "lazy";

    image.onerror = () => {
      image.style.display = "none";
    };

    const info = createElement("div", "product-info");

    const name = createElement("h3", "", product.name);

    const description = createElement(
      "p",
      "",
      product.description || product.name
    );

    const price = createElement(
      "p",
      "",
      Number(product.price) > 0
        ? "₦" + formatPrice(product.price)
        : "Contact us for price"
    );

    const button = createElement(
      "button",
      "",
      Number(product.stock) > 0
        ? "ADD TO CART"
        : "ENQUIRE ON WHATSAPP"
    );

    if (Number(product.stock) > 0) {
      button.addEventListener("click", () => addToCart(product.id));
    } else {
      button.addEventListener("click", () => {
        window.open(
          "https://wa.me/" + WHATSAPP_NUMBER +
          "?text=" + encodeURIComponent(
            "Hello, I'm interested in " + product.name
          ),
          "_blank"
        );
      });
    }

    info.append(name, description, price, button);
    card.append(image, info);
    productList.append(card);
  });
}

// =========================================
// SHOPPING CART
// =========================================

function addToCart(id) {
  const product = products.find(item => item.id === id);

  if (!product) return;

  const existing = cart.find(item => item.id === id);

  if (existing) {
    if (existing.quantity >= Number(product.stock)) {
      alert("Sorry, you have reached the available stock.");
      return;
    }

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

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCart();
}

function updateCart() {
  if (!cartItems) return;

  cartItems.replaceChildren();

  if (cart.length === 0) {
    cartItems.textContent = "Your shopping cart is empty.";
  }

  cart.forEach(item => {
    const row = createElement("div", "cart-item");

    const details = createElement(
      "span",
      "",
      item.name + " × " + item.quantity
    );

    const removeButton = createElement(
      "button",
      "",
      "Remove"
    );

    removeButton.addEventListener("click", () => {
      removeFromCart(item.id);
    });

    row.append(details, removeButton);
    cartItems.append(row);
  });

  const quantity = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const total = cart.reduce(
    (sum, item) =>
      sum + Number(item.price) * item.quantity,
    0
  );

  if (cartCount) cartCount.textContent = quantity;

  if (cartTotal) {
    cartTotal.textContent = formatPrice(total);
  }
}

// =========================================
// WHATSAPP CHECKOUT
// =========================================

function orderOnWhatsApp() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  let message =
    "Hello AYEESHER'S COLLECTION!\n\nI want to place an order:\n\n";

  cart.forEach(item => {
    message +=
      item.name +
      " × " + item.quantity +
      " — " +
      (Number(item.price) > 0
        ? "₦" + formatPrice(item.price * item.quantity)
        : "Price to be confirmed") +
      "\n";
  });

  message +=
    "\nPlease confirm availability and delivery details. Thank you!";

  window.open(
    "https://wa.me/" +
    WHATSAPP_NUMBER +
    "?text=" +
    encodeURIComponent(message),
    "_blank"
  );
}

const whatsappButton =
  document.getElementById("whatsappOrder");

if (whatsappButton) {
  whatsappButton.addEventListener("click", orderOnWhatsApp);
}

// =========================================
// ONLINE PAYMENT PLACEHOLDER
// =========================================

const paymentButton =
  document.getElementById("onlinePayment");

if (paymentButton) {
  paymentButton.addEventListener("click", () => {
    alert(
      "Online payments are being set up. " +
      "Please use WhatsApp ordering for now."
    );
  });
}

// =========================================
// MOBILE NAVIGATION
// =========================================

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

// =========================================
// START APPLICATION
// =========================================

async function startApp() {
  await refreshSession();
  await loadProducts();
  updateCart();

  console.log(
    "AYEESHER'S COLLECTION backend initialized!"
  );
}

startApp();
