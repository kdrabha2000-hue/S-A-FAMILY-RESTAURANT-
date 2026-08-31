// FIREBASE CONFIGURATION
const firebaseConfig = {
  apiKey: "AIzaSyDDTFZDBEAXS6hsQ_W5akOMRWiXyZdjkSo",
  authDomain: "kd-ka-khana-ghar-tak.firebaseapp.com",
  databaseURL: "https://kd-ka-khana-ghar-tak-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "kd-ka-khana-ghar-tak",
  storageBucket: "kd-ka-khana-ghar-tak.firebasestorage.app",
  messagingSenderId: "69933070653",
  appId: "1:69933070653:web:f9b93ba827d794bb376d54"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

let restaurantMenu = [
  { id: 1, name: "Chicken Pakora", price: 100, halfPrice: 50, hasVariant: true, category: "Fast Food", isVeg: false, inStock: true, img: "https://images.unsplash.com/photo-1562967914-608f82629710?w=200" },
  { id: 2, name: "Veg Chowmein", price: 50, category: "Fast Food", isVeg: true, inStock: true, img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200" },
  { id: 3, name: "Chicken Chowmein", price: 100, category: "Fast Food", isVeg: false, inStock: true, img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200" },
  { id: 4, name: "Chicken Momos", price: 70, category: "Fast Food", isVeg: false, inStock: true, img: "https://images.unsplash.com/photo-1625201941771-7eb5a3a67d02?w=200" },
  { id: 5, name: "Chicken Roll", price: 80, category: "Rolls", isVeg: false, inStock: true, img: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=200" },
  { id: 6, name: "Cold Drink (Thumbs Up)", price: 40, category: "Drinks", isVeg: true, inStock: true, img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=200" }
];

let shopSettings = {
  isOpen: true,
  offerText: "⚡ SPECIAL OFFER: Use WELCOME50 for Flat ₹50 OFF!",
  deliveryFee: 30,
  packingFee: 10,
  minOrder: 100
};

let cart = [];
let activeOrder = JSON.parse(localStorage.getItem('sa_active_order')) || null;
let appliedCoupon = null;

// SYNC LIVE SETTINGS & MENU
db.ref('shop_settings').on('value', snap => {
  if (snap.val()) shopSettings = { ...shopSettings, ...snap.val() };
});

db.ref('restaurant_menu').on('value', snap => {
  const data = snap.val();
  if (data) restaurantMenu = Object.values(data);
  const activeTab = document.querySelector('.nav-item.active span')?.innerText.toLowerCase();
  if (activeTab === 'home' || activeTab === 'menu') switchTab(activeTab);
});

document.addEventListener('DOMContentLoaded', () => {
  switchTab('home');
  listenToActiveOrder();
});

function switchTab(screenName) {
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById(`nav-${screenName}`);
  if (btn) btn.classList.add('active');

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
    <div class="screen-header">
      <div class="brand-main">
        <div class="brand-title">S&A</div>
        <div style="font-weight: bold; font-size: 13px; letter-spacing: 1px;">FAMILY RESTAURANT</div>
        <div class="tagline">Fast Food & Fresh Meals</div>
      </div>
    </div>

    ${!shopSettings.isOpen ? `
      <div style="background:#b71c1c; color:#fff; text-align:center; padding:10px; font-size:12px; font-weight:bold;">
        ⚠️ RESTAURANT IS TEMPORARILY CLOSED FOR NEW ORDERS
      </div>
    ` : ''}

    <div class="offer-strip">${shopSettings.offerText}</div>

    <div class="search-wrapper">
      <i class="fa-solid fa-magnifying-glass"></i>
      <input type="text" placeholder="Search momos, pakora, chowmein..." oninput="handleSearch(this.value, 'home-list')">
    </div>

    <div class="location-box">
      <i class="fa-solid fa-location-dot"></i>
      <div>
        <strong>U.T. Road, Bengbari</strong><br>
        <span style="color:var(--text-gray);">Udalguri, Assam - 784523</span>
      </div>
    </div>

    <div class="special-banner">
      <div>
        <small style="color:#ffcdd2; font-weight:bold;">BESTSELLER</small>
        <h3 style="font-size:17px; margin-top:2px;">Chicken Pakora</h3>
        <p class="price" style="margin-top:4px;">Starting ₹50</p>
        <button class="btn-order-now" onclick="addToCart(1, 'Half')">ORDER HALF</button>
      </div>
      <img src="https://images.unsplash.com/photo-1562967914-608f82629710?w=200" alt="Pakora">
    </div>

    <h4 style="padding: 10px 15px 5px 15px; font-size:13px; color:var(--primary-red);">POPULAR ITEMS</h4>
    <div id="home-list"></div>

    <a href="tel:8453270362" style="position:fixed; bottom:75px; right:15px; background:#4CAF50; color:#fff; width:45px; height:45px; border-radius:50%; display:flex; align-items:center; justify-content:center; text-decoration:none; box-shadow:0 4px 10px rgba(0,0,0,0.5); z-index:90;">
      <i class="fa-solid fa-phone" style="font-size:18px;"></i>
    </a>
  `;
  renderItemsList(restaurantMenu, 'home-list');
}

function renderMenuScreen(container) {
  container.innerHTML = `
    <div class="red-top-bar"><span>FULL MENU</span></div>

    <div class="search-wrapper">
      <i class="fa-solid fa-magnifying-glass"></i>
      <input type="text" placeholder="Search dishes..." oninput="handleSearch(this.value, 'full-menu-list')">
    </div>

    <div class="category-pills">
      <button class="pill active" onclick="filterCategory('All', this)">All</button>
      <button class="pill" onclick="filterCategory('Fast Food', this)">Fast Food</button>
      <button class="pill" onclick="filterCategory('Rolls', this)">Rolls</button>
      <button class="pill" onclick="filterCategory('Main Course', this)">Main Course</button>
      <button class="pill" onclick="filterCategory('Drinks', this)">Drinks</button>
    </div>

    <div id="full-menu-list"></div>
  `;
  renderItemsList(restaurantMenu, 'full-menu-list');
}

function handleSearch(keyword, targetId) {
  const filtered = restaurantMenu.filter(i => i.name.toLowerCase().includes(keyword.toLowerCase()));
  renderItemsList(filtered, targetId);
}

function filterCategory(cat, btn) {
  document.querySelectorAll('.pill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const filtered = cat === 'All' ? restaurantMenu : restaurantMenu.filter(i => i.category === cat);
  renderItemsList(filtered, 'full-menu-list');
}

function renderItemsList(items, targetId) {
  const list = document.getElementById(targetId);
  if (!list) return;

  list.innerHTML = items.map(item => {
    const badgeColor = item.isVeg ? "veg-dot" : "nonveg-dot";
    const cartItem = cart.find(c => c.id === item.id);

    return `
      <div class="item-card">
        <img src="${item.img}" alt="${item.name}">
        <div class="item-info">
          <h4><span class="badge-dot ${badgeColor}"></span>${item.name}</h4>
          <p class="price">₹${item.price} ${item.hasVariant ? `<small style="font-size:10px; color:#aaa;">(Full) / ₹${item.halfPrice} (Half)</small>` : ''}</p>
        </div>
        ${!item.inStock ? `<span class="sold-out-badge">SOLD OUT</span>` : 
          item.hasVariant ? `
            <div style="display:flex; flex-direction:column; gap:4px;">
              <button class="btn-add-red" style="font-size:10px; padding:4px 8px;" onclick="addToCart(${item.id}, 'Half')">HALF +</button>
              <button class="btn-add-red" style="font-size:10px; padding:4px 8px;" onclick="addToCart(${item.id}, 'Full')">FULL +</button>
            </div>
          ` :
          cartItem ? `
            <div class="qty-ctrl">
              <button onclick="changeQty(${item.id}, -1)">-</button>
              <span>${cartItem.qty}</span>
              <button onclick="changeQty(${item.id}, 1)">+</button>
            </div>
          ` : `
            <button class="btn-add-red" onclick="addToCart(${item.id})">ADD +</button>
          `
        }
      </div>
    `;
  }).join('');
}

function addToCart(id, variant = null) {
  if (!shopSettings.isOpen) {
    alert("Dukan abhi band hai. Order accept nahi ho rahe.");
    return;
  }
  const item = restaurantMenu.find(i => i.id === id);
  if (!item || !item.inStock) return;

  const itemKey = variant ? `${item.id}_${variant}` : `${item.id}`;
  const itemName = variant ? `${item.name} (${variant})` : item.name;
  const itemPrice = variant === 'Half' ? item.halfPrice : item.price;

  const existing = cart.find(i => i.cartKey === itemKey);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, cartKey: itemKey, name: itemName, price: itemPrice, qty: 1 });
  }
  updateBadge();
  const currentTab = document.querySelector('.nav-item.active span')?.innerText.toLowerCase();
  if (currentTab === 'home' || currentTab === 'menu') switchTab(currentTab);
}

function changeQty(id, delta, cartKey = null) {
  const item = cartKey ? cart.find(i => i.cartKey === cartKey) : cart.find(i => i.id === id);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter(i => i !== item);
  }
  updateBadge();
  const currentTab = document.querySelector('.nav-item.active span')?.innerText.toLowerCase();
  if (currentTab) switchTab(currentTab);
}

function updateBadge() {
  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);
  const badge = document.getElementById('cart-badge');
  if (badge) badge.innerText = totalItems;
}

function renderCartScreen(container) {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const delivery = subtotal > 0 ? shopSettings.deliveryFee : 0;
  const packing = subtotal > 0 ? shopSettings.packingFee : 0;
  const discount = appliedCoupon === 'WELCOME50' && subtotal >= 200 ? 50 : 0;
  const total = Math.max(0, subtotal + delivery + packing - discount);

  container.innerHTML = `
    <div class="red-top-bar">
      <span>YOUR CART</span>
      <i class="fa-solid fa-trash" onclick="cart=[]; updateBadge(); renderCartScreen(document.getElementById('app-container'));"></i>
    </div>

    ${cart.map(item => `
      <div class="item-card">
        <img src="${item.img}">
        <div class="item-info">
          <h4>${item.name}</h4>
          <p class="price">₹${item.price}</p>
        </div>
        <div class="qty-ctrl">
          <button onclick="changeQty(${item.id}, -1, '${item.cartKey}')">-</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${item.id}, 1, '${item.cartKey}')">+</button>
        </div>
        <div style="font-weight:bold; width: 45px; text-align:right;">₹${item.price * item.qty}</div>
      </div>
    `).join('')}

    ${cart.length > 0 ? `
      <div style="background:#1a1a1a; margin:10px 15px; padding:10px; border-radius:8px; border:1px dashed #444; display:flex; justify-content:space-between; align-items:center;">
        <span style="font-size:12px;">🥤 Add Cold Drink (₹40)?</span>
        <button class="btn-add-red" style="font-size:11px; padding:4px 10px;" onclick="addToCart(6)">ADD</button>
      </div>

      <div style="margin: 10px 15px; display:flex; gap:8px;">
        <input type="text" id="coupon-input" class="input-box" placeholder="Enter Coupon (e.g. WELCOME50)" style="text-transform:uppercase;">
        <button class="btn-add-red" onclick="applyPromo()">APPLY</button>
      </div>

      <div style="padding: 12px; background: var(--card-bg); margin: 15px; border-radius:12px; border:1px solid var(--border-color);">
        <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:12px;"><span>Subtotal</span> <span>₹${subtotal}</span></div>
        <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:12px;"><span>Delivery Fee</span> <span>₹${delivery}</span></div>
        <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:12px;"><span>Packaging Fee</span> <span>₹${packing}</span></div>
        ${discount > 0 ? `<div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:12px; color:#4CAF50;"><span>Discount (WELCOME50)</span> <span>-₹${discount}</span></div>` : ''}
        <hr style="border-color:var(--border-color); margin:8px 0;">
        <div style="display:flex; justify-content:space-between; font-weight:bold; font-size:15px;"><span>TOTAL</span> <span class="price" style="color:var(--primary-red);">₹${total}</span></div>
      </div>

      <button class="btn-large-red" onclick="proceedToCheckout(${subtotal})">CONTINUE TO CHECKOUT ></button>
    ` : '<p style="padding:40px; text-align:center; color:var(--text-gray);">Your plate is empty!</p>'}
  `;
}

function proceedToCheckout(subtotal) {
  if (subtotal < shopSettings.minOrder) {
    alert(`Minimum order ₹${shopSettings.minOrder} hona chahiye.`);
    return;
  }
  switchTab('checkout');
}

function applyPromo() {
  const code = document.getElementById('coupon-input').value.trim().toUpperCase();
  if (code === 'WELCOME50') {
    appliedCoupon = 'WELCOME50';
    alert("Coupon applied! ₹50 OFF.");
  } else {
    alert("Invalid Coupon Code");
  }
  renderCartScreen(document.getElementById('app-container'));
}

function renderCheckoutScreen(container) {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discount = appliedCoupon === 'WELCOME50' && subtotal >= 200 ? 50 : 0;
  const total = Math.max(0, subtotal + shopSettings.deliveryFee + shopSettings.packingFee - discount);
  const savedUser = JSON.parse(localStorage.getItem('sa_user_info')) || {};

  container.innerHTML = `
    <div class="red-top-bar"><span>CHECKOUT DETAILS</span></div>

    <div class="input-group">
      <label>Customer Name</label>
      <input type="text" id="cust-name" class="input-box" value="${savedUser.name || ''}" placeholder="Full Name">
    </div>

    <div class="input-group">
      <label>Mobile Number</label>
      <input type="tel" id="cust-phone" class="input-box" value="${savedUser.phone || ''}" placeholder="10-digit number">
    </div>

    <div class="input-group">
      <label>Delivery Address</label>
      <textarea id="cust-address" class="input-box" rows="2" placeholder="House / Village / Landmark">${savedUser.address || ''}</textarea>
    </div>

    <div class="input-group">
      <label>Cooking Note (Optional)</label>
      <input type="text" id="cust-note" class="input-box" placeholder="e.g. Extra sauce, mirchi kam">
    </div>

    <div style="display:flex; justify-content:space-between; padding: 10px 15px; font-weight:bold;">
      <span>Payable Total:</span>
      <span class="price" style="font-size:18px;">₹${total}</span>
    </div>

    <button class="btn-large-red" onclick="placeDirectOrder(${total})">CONFIRM & SEND ORDER 🔥</button>
  `;
}

function placeDirectOrder(total) {
  const name = document.getElementById('cust-name').value.trim();
  const phone = document.getElementById('cust-phone').value.trim();
  const address = document.getElementById('cust-address').value.trim();
  const note = document.getElementById('cust-note').value.trim();

  if (!name || !phone || !address) {
    alert("Please fill Name, Phone, and Address!");
    return;
  }

  localStorage.setItem('sa_user_info', JSON.stringify({ name, phone, address }));

  const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
  const newOrder = {
    orderId: orderId,
    customerName: name,
    phone: phone,
    address: address,
    cookingNote: note || "None",
    items: cart,
    totalBill: total,
    status: "Received",
    date: new Date().toLocaleDateString(),
    timestamp: Date.now()
  };

  db.ref('orders/' + orderId).set(newOrder).then(() => {
    activeOrder = newOrder;
    localStorage.setItem('sa_active_order', JSON.stringify(activeOrder));
    listenToActiveOrder();

    cart = [];
    updateBadge();

    if (typeof confetti === 'function') {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }

    showSuccessModal(orderId);
  });
}

function showSuccessModal(orderId) {
  const overlay = document.createElement('div');
  overlay.className = "modal-overlay";
  overlay.innerHTML = `
    <div class="modal-content">
      <i class="fa-solid fa-circle-check" style="color:#4CAF50; font-size:45px; margin-bottom:12px;"></i>
      <h3 style="color:#fff;">Order Received!</h3>
      <p style="color:var(--text-gray); font-size:12px; margin: 8px 0;">Order #${orderId} has been sent to kitchen.</p>
      <button class="btn-large-red" style="margin:10px 0 0 0;" onclick="closeModalAndTrack()">LIVE STATUS</button>
    </div>
  `;
  document.body.appendChild(overlay);
}

function closeModalAndTrack() {
  document.querySelector('.modal-overlay')?.remove();
  switchTab('orders');
}

function listenToActiveOrder() {
  if (!activeOrder) return;
  db.ref('orders/' + activeOrder.orderId).on('value', snap => {
    const data = snap.val();
    if (data) {
      activeOrder = data;
      localStorage.setItem('sa_active_order', JSON.stringify(activeOrder));
      const currentTab = document.querySelector('.nav-item.active span')?.innerText.toLowerCase();
      if (currentTab === 'track' || currentTab === 'orders') renderOrdersScreen(document.getElementById('app-container'));
    }
  });
}

function renderOrdersScreen(container) {
  if (!activeOrder) {
    container.innerHTML = `
      <div class="red-top-bar"><span>LIVE ORDER TRACKING</span></div>
      <p style="padding:40px; text-align:center; color:var(--text-gray);">No active orders right now.</p>
    `;
    return;
  }

  const s = activeOrder.status;
  container.innerHTML = `
    <div class="red-top-bar"><span>LIVE STATUS</span></div>

    <div class="tracker-card">
      <div style="display:flex; justify-content:space-between; margin-bottom:15px; font-size:13px;">
        <span>Order <b>#${activeOrder.orderId}</b></span>
        <span style="color:var(--primary-red); font-weight:bold;">₹${activeOrder.totalBill}</span>
      </div>

      <div class="track-step ${['Received', 'Preparing', 'On The Way', 'Delivered'].includes(s) ? 'active' : ''}">
        <div class="track-icon"><i class="fa-solid fa-receipt"></i></div>
        <div><strong>Order Received</strong><div style="font-size:10px; color:var(--text-gray);">Restaurant has received your order</div></div>
      </div>

      <div class="track-step ${['Preparing', 'On The Way', 'Delivered'].includes(s) ? 'active' : ''}">
        <div class="track-icon"><i class="fa-solid fa-kitchen-set"></i></div>
        <div><strong>Cooking in Kitchen</strong><div style="font-size:10px; color:var(--text-gray);">Chef is preparing fresh hot food</div></div>
      </div>

      <div class="track-step ${['On The Way', 'Delivered'].includes(s) ? 'active' : ''}">
        <div class="track-icon"><i class="fa-solid fa-motorcycle"></i></div>
        <div><strong>Out for Delivery</strong><div style="font-size:10px; color:var(--text-gray);">Rider is on the way</div></div>
      </div>

      <div class="track-step ${s === 'Delivered' ? 'active' : ''}">
        <div class="track-icon"><i class="fa-solid fa-circle-check"></i></div>
        <div><strong>Delivered</strong><div style="font-size:10px; color:var(--text-gray);">Enjoy your meal!</div></div>
      </div>
    </div>
  `;
}

function renderProfileScreen(container) {
  const user = JSON.parse(localStorage.getItem('sa_user_info')) || { name: '', phone: '', address: '' };
  container.innerHTML = `
    <div class="red-top-bar"><span>CUSTOMER PROFILE</span></div>
    <div style="padding: 15px;">
      <div style="text-align:center; margin-bottom:20px;">
        <i class="fa-solid fa-circle-user" style="font-size:65px; color:var(--primary-red);"></i>
        <h3 style="margin-top:8px;">${user.name || 'Foodie'}</h3>
        <p style="font-size:12px; color:var(--text-gray);">${user.phone || 'No phone linked'}</p>
      </div>

      <div style="background:var(--card-bg); padding:15px; border-radius:12px; border:1px solid var(--border-color); margin-bottom:15px;">
        <strong style="font-size:13px; color:var(--primary-red);">MY DETAILS (AUTO-FILL)</strong>
        <div class="input-group" style="margin:8px 0;"><input type="text" id="prof-name" class="input-box" value="${user.name}" placeholder="Name"></div>
        <div class="input-group" style="margin:8px 0;"><input type="tel" id="prof-phone" class="input-box" value="${user.phone}" placeholder="Phone"></div>
        <div class="input-group" style="margin:8px 0;"><textarea id="prof-address" class="input-box" rows="2" placeholder="Address">${user.address}</textarea></div>
        <button class="btn-large-red" style="width:100%; margin:10px 0 0 0; padding:10px;" onclick="saveProfileData()">SAVE DETAILS</button>
      </div>
    </div>
  `;
}

function saveProfileData() {
  const name = document.getElementById('prof-name').value.trim();
  const phone = document.getElementById('prof-phone').value.trim();
  const address = document.getElementById('prof-address').value.trim();
  localStorage.setItem('sa_user_info', JSON.stringify({ name, phone, address }));
  alert("Profile Saved!");
  renderProfileScreen(document.getElementById('app-container'));
}
