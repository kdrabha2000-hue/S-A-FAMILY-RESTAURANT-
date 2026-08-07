const restaurantMenu = [
  { id: 1, name: "Chicken Biryani", price: 180, category: "Main Course", img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200" },
  { id: 2, name: "Veg Thali", price: 120, category: "Main Course", img: "https://images.unsplash.com/photo-1613378026884-6faf73376d7e?w=200" },
  { id: 3, name: "Fried Rice", price: 100, category: "Main Course", img: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=200" },
  { id: 4, name: "Butter Chicken", price: 150, category: "Main Course", img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=200" },
  { id: 5, name: "Chilli Chicken", price: 120, category: "Main Course", img: "https://images.unsplash.com/photo-1525607551316-4a8e16d1f968?w=200" },
  { id: 6, name: "Chicken Roll", price: 90, category: "Rolls", img: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=200" },
  { id: 7, name: "Veg Roll", price: 50, category: "Rolls", img: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=200" },
  { id: 8, name: "Chicken Momos", price: 60, category: "Fast Food", img: "https://images.unsplash.com/photo-1625201941771-7eb5a3a67d02?w=200" },
  { id: 9, name: "Cold Coffee", price: 80, category: "Drinks", img: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=200" }
];

let cart = [];
let activeOrdersList = [];

document.addEventListener('DOMContentLoaded', () => {
  switchTab('home');
});

function switchTab(screenName) {
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  
  const container = document.getElementById('app-container');
  if (screenName === 'home') renderHomeScreen(container);
  if (screenName === 'menu') renderMenuScreen(container);
  if (screenName === 'cart') renderCartScreen(container);
  if (screenName === 'checkout') renderCheckoutScreen(container);
  if (screenName === 'orders') renderOrdersScreen(container);
  if (screenName === 'profile') renderProfileScreen(container);
}

function renderHomeScreen(container) {
  container.innerHTML = `
    <div class="header-top">
      <div>
        <div class="brand-title">S&A FAMILY RESTAURANT</div>
        <div class="tagline">Freshly Made, Especially for You</div>
      </div>
    </div>
    <div class="location-card">
      <i class="fa-solid fa-location-dot"></i>
      <div>U.T. Road, Bengbari, Udalguri, Assam - 784523</div>
    </div>
    <div class="info-card">
      <i class="fa-solid fa-clock"></i> <span>Open: 8:00 AM - 9:30 PM</span>
      <i class="fa-solid fa-motorcycle" style="margin-left:auto;"></i> <span>Delivery 5-10 km</span>
    </div>

    <div class="banner">
      <div>
        <small style="color: #ffcdd2;">TODAY'S SPECIAL</small>
        <h3>Chicken Biryani</h3>
        <p class="price">₹180</p>
        <button class="btn-primary" onclick="addToCart(1)">ORDER NOW</button>
      </div>
      <img src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200" alt="Biryani">
    </div>

    <h4 style="margin: 15px 15px 5px 15px;">POPULAR ITEMS</h4>
    <div class="horizontal-scroll">
      ${restaurantMenu.slice(0, 5).map(i => `
        <div class="mini-card">
          <img src="${i.img}">
          <div style="font-size:11px; margin-top:4px;">${i.name}</div>
          <div class="price" style="font-size:11px;">₹${i.price}</div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderMenuScreen(container) {
  container.innerHTML = `
    <h3 style="padding: 15px 15px 0 15px;">MENU</h3>
    <div class="category-pills">
      <button class="pill active" onclick="filterCategory('All', this)">All</button>
      <button class="pill" onclick="filterCategory('Main Course', this)">Main Course</button>
      <button class="pill" onclick="filterCategory('Rolls', this)">Rolls</button>
      <button class="pill" onclick="filterCategory('Fast Food', this)">Fast Food</button>
      <button class="pill" onclick="filterCategory('Drinks', this)">Drinks</button>
    </div>
    <div id="full-menu-list"></div>
  `;
  renderItemsList(restaurantMenu, 'full-menu-list');
}

function filterCategory(cat, btn) {
  document.querySelectorAll('.pill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const filtered = cat === 'All' ? restaurantMenu : restaurantMenu.filter(i => i.category === cat);
  renderItemsList(filtered, 'full-menu-list');
}

function renderItemsList(items, targetId) {
  const list = document.getElementById(targetId);
  list.innerHTML = items.map(item => `
    <div class="item-card">
      <img src="${item.img}">
      <div class="item-info">
        <h4>${item.name}</h4>
        <p class="price">₹${item.price}</p>
      </div>
      <button class="btn-add" onclick="addToCart(${item.id})">ADD +</button>
    </div>
  `).join('');
}

function addToCart(id) {
  const item = restaurantMenu.find(i => i.id === id);
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  updateBadge();
  alert(`${item.name} Added to Cart!`);
}

function updateBadge() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById('cart-badge').innerText = count;
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  }
  renderCartScreen(document.getElementById('app-container'));
  updateBadge();
}

function renderCartScreen(container) {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const delivery = subtotal > 0 ? 50 : 0;
  const total = subtotal + delivery;

  container.innerHTML = `
    <h3 style="padding: 15px;">YOUR CART</h3>
    ${cart.map(item => `
      <div class="item-card">
        <img src="${item.img}">
        <div class="item-info">
          <h4>${item.name}</h4>
          <p class="price">₹${item.price}</p>
        </div>
        <div class="qty-ctrl">
          <button onclick="changeQty(${item.id}, -1)">-</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${item.id}, 1)">+</button>
        </div>
        <div style="font-weight:bold;">₹${item.price * item.qty}</div>
      </div>
    `).join('')}

    ${cart.length > 0 ? `
      <div style="padding: 15px; background: var(--card-bg); margin: 15px; border-radius:10px;">
        <div style="display:flex; justify-content:space-between; margin-bottom:8px;"><span>Subtotal</span> <span>₹${subtotal}</span></div>
        <div style="display:flex; justify-content:space-between; margin-bottom:8px;"><span>Delivery Charge</span> <span>₹${delivery}</span></div>
        <hr style="border-color:var(--border-color); margin:10px 0;">
        <div style="display:flex; justify-content:space-between; font-weight:bold;"><span>TOTAL AMOUNT</span> <span class="price">₹${total}</span></div>
      </div>
      <div style="padding:0 15px;">
        <button class="btn-primary" style="width:100%; padding:12px;" onclick="switchTab('checkout')">PROCEED TO CHECKOUT</button>
      </div>
    ` : '<p style="padding:20px; text-align:center;">Your Cart is Empty</p>'}
  `;
}

function renderCheckoutScreen(container) {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const total = subtotal + 50;

  container.innerHTML = `
    <h3 style="padding: 15px;">CHECKOUT</h3>
    <div style="padding: 15px;">
      <label>Name</label>
      <input type="text" id="cust-name" class="input-box" placeholder="Your Name">
      
      <label style="margin-top:10px; display:block;">Mobile Number</label>
      <input type="text" id="cust-phone" class="input-box" placeholder="Your Mobile Number">
      
      <label style="margin-top:10px; display:block;">Delivery Address</label>
      <textarea id="cust-address" class="input-box" placeholder="Full Address"></textarea>

      <div style="margin-top:15px; background:var(--card-bg); padding:10px; border-radius:6px;">
        <strong>Total Payable: ₹${total}</strong>
      </div>

      <button class="btn-primary" style="width:100%; padding:12px; margin-top:15px;" onclick="placeFinalOrder(${total})">PLACE ORDER NOW</button>
    </div>
  `;
}

function placeFinalOrder(total) {
  const name = document.getElementById('cust-name').value;
  const phone = document.getElementById('cust-phone').value;
  const address = document.getElementById('cust-address').value;

  if (!name || !phone || !address) {
    alert('Please fill all details!');
    return;
  }

  const orderId = Math.floor(100000 + Math.random() * 900000);
  activeOrdersList.push({ id: orderId, items: [...cart], total: total, status: 'Order Placed' });

  let message = `*NEW ORDER - S&A FAMILY RESTAURANT*\n`;
  message += `*Order ID:* %23${orderId}\n`;
  message += `*Customer:* ${name} (${phone})\n\n`;
  message += `*Address:* ${address}\n\n`;
  message += `*Items:*\n`;
  cart.forEach(i => {
    message += `- ${i.name} x ${i.qty} = ₹${i.price * i.qty}\n`;
  });
  message += `\n*TOTAL AMOUNT:* ₹${total}`;

  cart = [];
  updateBadge();

  const myWhatsAppNumber = "919365779888";
  window.location.href = `https://wa.me/${myWhatsAppNumber}?text=${message}`;
}

function renderOrdersScreen(container) {
  container.innerHTML = `
    <h3 style="padding:15px;">YOUR ORDERS</h3>
    ${activeOrdersList.length === 0 ? '<p style="padding:15px;">No active orders.</p>' : 
      activeOrdersList.map(o => `
        <div style="background:var(--card-bg); margin:15px; padding:15px; border-radius:8px;">
          <div><strong>Order #${o.id}</strong></div>
          <small>Status: ${o.status}</small>
          <div style="margin-top:10px;">Total: ₹${o.total}</div>
        </div>
      `).join('')}
  `;
}

function renderProfileScreen(container) {
  container.innerHTML = `
    <h3 style="padding:15px;">MY PROFILE</h3>
    <div style="padding:15px;">
      <p>S&A Family Restaurant App</p>
      <p style="color:var(--text-gray); font-size:12px;">Version 1.0</p>
    </div>
  `;
}
