// Replace this with your full international format WhatsApp number, digits only.
// Example Morocco: 2126XXXXXXXX (do not include +, spaces or leading 0).
const WHATSAPP_NUMBER = "212600000000";

const products = [
  {id:1,name:"DARKVEILUM Oversized Hoodie",category:"Hoodies",price:299,image:"images/hoodie.jpg",tag:"SIGNATURE"},
  {id:2,name:"Enter The Veil T-Shirt",category:"T-Shirts",price:149,image:"images/tshirt.jpg",tag:"NEW"},
  {id:3,name:"DARKVEILUM Bucket Hat",category:"Headwear",price:99,image:"images/bucket-hat.jpg",tag:"ESSENTIAL"},
  {id:4,name:"Dark Mode Gym Tank",category:"Sportswear",price:129,image:"images/gym-tank.jpg",tag:"ACTIVE"}
];

let cart = JSON.parse(localStorage.getItem("darkveilum-cart") || "[]");
const productGrid = document.getElementById("productGrid");
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");

function renderProducts(filter="All") {
  const visible = products.filter(p => filter === "All" || p.category === filter);
  productGrid.innerHTML = visible.map(p => `
    <article class="product-card">
      <div class="product-image">
        <img src="${p.image}" alt="${p.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='block'">
        <span class="image-placeholder" style="display:none">DV</span>
      </div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <p>${p.tag} · ${p.category}</p>
        <div class="product-buy">
          <span class="price">${p.price} DH</span>
          <button class="add-button" onclick="addToCart(${p.id})">ADD TO BAG +</button>
        </div>
      </div>
    </article>`).join("");
}

function saveCart() {
  localStorage.setItem("darkveilum-cart", JSON.stringify(cart));
  renderCart();
}

function addToCart(id) {
  const item = cart.find(i => i.id === id);
  if (item) item.quantity += 1;
  else cart.push({id, quantity:1});
  saveCart();
  openCart();
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
}

function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.id);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);
  document.getElementById("cartCount").textContent = count;
  document.getElementById("cartTotal").textContent = `${total} DH`;
  const container = document.getElementById("cartItems");
  if (!cart.length) {
    container.innerHTML = '<p class="muted">Your bag is empty.</p>';
    return;
  }
  container.innerHTML = cart.map(item => {
    const p = products.find(product => product.id === item.id);
    if (!p) return "";
    return `<div class="cart-row"><div><strong>${p.name}</strong><small>${item.quantity} × ${p.price} DH</small></div><button class="remove-item" onclick="removeFromCart(${p.id})">REMOVE</button></div>`;
  }).join("");
}

function openCart() {
  cartDrawer.classList.add("open");
  cartOverlay.classList.add("open");
  cartDrawer.setAttribute("aria-hidden","false");
}
function closeCart() {
  cartDrawer.classList.remove("open");
  cartOverlay.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden","true");
}

document.getElementById("cartOpen").addEventListener("click", openCart);
document.getElementById("cartClose").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);
document.getElementById("checkoutButton").addEventListener("click", () => {
  if (!cart.length) {
    alert("Your bag is empty.");
    return;
  }
  if (WHATSAPP_NUMBER === "212600000000") {
    alert("Please replace the sample WhatsApp number in script.js with your business number.");
    return;
  }
  const lines = cart.map(item => {
    const p = products.find(product => product.id === item.id);
    return `${p.name} — ${item.quantity} × ${p.price} DH`;
  });
  const total = cart.reduce((sum,item) => sum + products.find(p => p.id === item.id).price * item.quantity,0);
  const message = `Hello DARKVEILUM! I would like to place an order:\n${lines.join("\n")}\nSubtotal: ${total} DH\n\nPlease confirm availability, sizes and delivery.`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,"_blank");
});

document.querySelectorAll(".filter-button").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter-button").forEach(b => b.classList.remove("active"));
    button.classList.add("active");
    renderProducts(button.dataset.filter);
  });
});
document.querySelectorAll("[data-filter-link]").forEach(link => {
  link.addEventListener("click", () => {
    const filter = link.dataset.filterLink;
    document.querySelectorAll(".filter-button").forEach(b => {
      b.classList.toggle("active", b.dataset.filter === filter);
    });
    renderProducts(filter);
  });
});

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
menuToggle.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded","false");
}));

document.getElementById("contactWhatsApp").href = `https://wa.me/${WHATSAPP_NUMBER}`;
document.getElementById("year").textContent = new Date().getFullYear();
renderProducts();
renderCart();
