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

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

// DEFAULT RESTAURANT MENU
let restaurantMenu = [
  { id: 1, name: "Chicken Pakora (Full)", price: 100, category: "Fast Food", isVeg: false, inStock: true, img: "https://images.unsplash.com/photo-1562967914-608f82629710?w=200" },
  { id: 2, name: "Chicken Pakora (Half)", price: 50, category: "Fast Food", isVeg: false, inStock: true, img: "https://images.unsplash.com/photo-1562967914-608f82629710?w=200" },
  { id: 3, name: "Veg Chowmein", price: 50, category: "Fast Food", isVeg: true, inStock: true, img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200" },
  { id: 4, name: "Chicken Chowmein", price: 100, category: "Fast Food", isVeg: false, inStock: true, img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200" },
  { id: 5, name: "Pork Chowmein", price: 120, category: "Fast Food", isVeg: false, inStock: true, img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200" },
  { id: 6, name: "Veg Momos", price: 50, category: "Fast Food", isVeg: true, inStock: true, img: "https://images.unsplash.com/photo-1625201941771-7eb5a3a67d02?w=200" },
  { id: 7, name: "Chicken Momos", price: 70, category: "Fast Food", isVeg: false, inStock: true, img: "https://images.unsplash.com/photo-1625201941771-7eb5a3a67d02?w=200" },
  { id: 8, name: "Pork Momos", price: 80, category: "Fast Food", isVeg: false, inStock: true, img: "https://images.unsplash.com/photo-1625201941771-7eb5a3a67d02?w=200" },
  { id: 9, name: "Veg Roll", price: 40, category: "Rolls", isVeg: true, inStock: true, img: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=200" },
  { id: 10, name: "Chicken Roll", price: 80, category: "Rolls", isVeg: false, inStock: true, img: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=200" },
  { id: 11, name: "Pork Roll", price: 100, category: "Rolls", isVeg: false, inStock: true, img: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=200" },
  { id: 12, name: "Chicken Biryani", price: 180, category: "Main Course", isVeg: false, inStock: true, img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200" },
  { id: 13, name: "Butter Chicken", price: 200, category: "Main Course", isVeg: false, inStock: true, img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=200" },
  { id: 14, name: "Cold Coffee", price: 70, category: "Drinks", isVeg: true, inStock: true, img: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=200" }
];

let cart = [];
let activeOrder = JSON.parse(localStorage.getItem('sa_active_order')) || null;
let appliedCoupon = null;

// SYNC MENU FROM FIREBASE REALTIME
db.ref('restaurant_menu').on('value', (snapshot) => {
  const data = snapshot.val();
  if (data) {
    restaurantMenu = Object.values(data);
    const activeTab = document.querySelector('.nav-item.active span')?.innerText.toLowerCase();
    if (activeTab === 'home' || activeTab === 'menu') {
      switchTab(activeTab);
    }
  }
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

    <div class="offer-strip">⚡ SPECIAL OFFER: Use <b>WELCOME50</b> for Flat ₹50 OFF!</div>

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
        <p class="price" style="margin-top:4px;">Just ₹50</p>
        <button class="btn-order-now" onclick="addToCart(2)">ORDER NOW</button>
      </div>
      <img src="https://images.unsplash.com/photo-1562967914-608f82629710?w=200" alt="Pakora">
    </div>

    <h4 style="padding: 10px 15px 5px 15px; font-size:13px; color:var(--primary-red);">POPULAR DISHES</h4>
    <div id="home-list"></div>
  `;
  renderItemsList(restaurantMenu, 'home-list');
}

function renderMenuScreen(container) {
  container.innerHTML = `
    <div class="red-top-bar"><span>OUR FULL MENU</span></div>

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
    const inCart = cart.find(c => c.id === item.id);
    const badgeColor = item.isVeg ? "veg-dot" : "nonveg-dot";
    return `
      <div class="item-card">
        <img src="${item.img}" alt="${item.name}">
        <div class="item-info">
          <h4><span class="badge-dot ${badgeColor}"></span>${item.name}</h4>
          <p class="price">₹${item.price}</p>
        </div>
        ${!item.inStock ? `<span class="sold-out-badge">SOLD OUT</span>` : 
          inCart ? `
            <div class="qty-ctrl">
              <button onclick="changeQty(${item.id}, -1)">-</button>
              <span>${inCart.qty}</span>
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

function addToCart(id) {
  const item = restaurantMenu.find(i => i.id === id);
  if (!item || !item.inStock) return;
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  updateBadge();
  const currentTab = document.querySelector('.nav-item.active span')?.innerText.toLowerCase();
  if (currentTab === 'home' || currentTab === 'menu') switchTab(currentTab);
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
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
  const delivery = subtotal > 0 ? 30 : 0;
  const discount = appliedCoupon === 'WELCOME50' && subtotal >= 200 ? 50 : 0;
  const total = Math.max(0, subtotal + delivery - discount);

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
          <button onclick="changeQty(${item.id}, -1)">-</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${item.id}, 1)">+</button>
        </div>
        <div style="font-weight:bold; width: 45px; text-align:right;">₹${item.price * item.qty}</div>
      </div>
    `).join('')}

    ${cart.length > 0 ? `
      <div style="margin: 10px 15px; display:flex; gap:8px;">
        <input type="text" id="coupon-input" class="input-box" placeholder="Enter WELCOME50" style="text-transform:uppercase;">
        <button class="btn-add-red" onclick="applyPromo()">APPLY</button>
      </div>

      <div style="padding: 12px; background: var(--card-bg); margin: 15px; border-radius:12px; border:1px solid var(--border-color);">
        <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:13px;"><span>Subtotal</span> <span>₹${subtotal}</span></div>
        <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:13px;"><span>Delivery Fee</span> <span>₹${delivery}</span></div>
        ${discount > 0 ? `<div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:13px; color:#4CAF50;"><span>Coupon Applied</span> <span>-₹${discount}</span></div>` : ''}
        <hr style="border-color:var(--border-color); margin:10px 0;">
        <div style="display:flex; justify-content:space-between; font-weight:bold; font-size:15px;"><span>TOTAL</span> <span class="price" style="color:var(--primary-red);">₹${total}</span></div>
      </div>

      <button class="btn-large-red" onclick="switchTab('checkout')">CONTINUE TO ORDER ></button>
    ` : '<p style="padding:40px; text-align:center; color:var(--text-gray);">Your plate is empty!</p>'}
  `;
}

function applyPromo() {
  const code = document.getElementById('coupon-input').value.trim().toUpperCase();
  if (code === 'WELCOME50') {
    appliedCoupon = 'WELCOME50';
    alert("Coupon applied! ₹50 OFF on orders above ₹200.");
  } else {
    alert("Invalid Coupon Code");
  }
  renderCartScreen(document.getElementById('app-container'));
}

function renderCheckoutScreen(container) {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discount = appliedCoupon === 'WELCOME50' && subtotal >= 200 ? 50 : 0;
  const total = Math.max(0, subtotal + 30 - discount);
  const savedUser = JSON.parse(localStorage.getItem('sa_user_info')) || {};

  container.innerHTML = `
    <div class="red-top-bar"><span>COMPLETE YOUR ORDER</span></div>

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
      <label>Special Instructions (Optional)</label>
      <input type="text" id="cust-note" class="input-box" placeholder="e.g. Less spicy, extra sauce">
    </div>

    <div class="input-group">
      <label>Payment Method</label>
      <div style="background:var(--card-bg); padding:12px; border-radius:8px; border:1px solid var(--border-color); font-size:12px;">
        <i class="fa-solid fa-circle-check" style="color:var(--primary-red);"></i> Cash on Delivery (COD) / Direct UPI
      </div>
    </div>

    <div style="display:flex; justify-content:space-between; padding: 10px 15px; font-weight:bold;">
      <span>Payable Total:</span>
      <span class="price" style="font-size:18px;">₹${total}</span>
    </div>

    <button class="btn-large-red" onclick="placeDirectOrder(${total})">CONFIRM & SEND ORDER 🔥</button>
  `;
}

// DIRECT FIREBASE ORDER SUBMISSION (NO WHATSAPP NEEDED)
function placeDirectOrder(total) {
  const name = document.getElementById('cust-name').value.trim();
  const phone = document.getElementById('cust-phone').value.trim();
  const address = document.getElementById('cust-address').value.trim();
  const note = document.getElementById('cust-note').value.trim();

  if (!name || !phone || !address) {
    alert("Please fill Name, Phone, and Address!");
    return;
  }

  // Save details for auto-fill in profile
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
    status: "Received", // Statuses: Received -> Preparing -> On The Way -> Delivered
    timestamp: Date.now()
  };

  // Push directly to Firebase Realtime Database
  db.ref('orders/' + orderId).set(newOrder).then(() => {
    // Save to active order
    activeOrder = newOrder;
    localStorage.setItem('sa_active_order', JSON.stringify(activeOrder));
    listenToActiveOrder();

    // Reset Cart
    cart = [];
    updateBadge();

    // Trigger Celebration Confetti
    if (typeof confetti === 'function') {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }

    showSuccessModal(orderId);
  }).catch(err => {
    alert("Database connection error: " + err.message);
  });
}

function showSuccessModal(orderId) {
  const overlay = document.createElement('div');
  overlay.className = "modal-overlay";
  overlay.innerHTML = `
    <div class="modal-content">
      <i class="fa-solid fa-circle-check" style="color:#4CAF50; font-size:45px; margin-bottom:12px;"></i>
      <h3 style="color:#fff;">Order Confirmed!</h3>
      <p style="color:var(--text-gray); font-size:12px; margin: 8px 0;">Order #${orderId} kitchen mein receive ho chuka hai!</p>
      <button class="btn-large-red" style="margin:10px 0 0 0;" onclick="closeModalAndTrack()">TRACK ORDER NOW</button>
    </div>
  `;
  document.body.appendChild(overlay);
}

function closeModalAndTrack() {
  document.querySelector('.modal-overlay')?.remove();
  switchTab('orders');
}

// REALTIME ORDER TRACKER
function listenToActiveOrder() {
  if (!activeOrder) return;
  db.ref('orders/' + activeOrder.orderId).on('value', (snap) => {
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
    <div class="red-top-bar"><span>LIVE TRACKING</span></div>

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
        <div><strong>Order Delivered</strong><div style="font-size:10px; color:var(--text-gray);">Enjoy your fresh meal!</div></div>
      </div>
    </div>
  `;
}

function renderProfileScreen(container) {
  const user = JSON.parse(localStorage.getItem('sa_user_info')) || { name: 'Customer', phone: 'Not set', address: 'Not set' };
  container.innerHTML = `
    <div class="red-top-bar"><span>MY PROFILE</span></div>
    <div style="padding:20px; text-align:center;">
      <i class="fa-solid fa-circle-user" style="font-size:60px; color:var(--primary-red); margin-bottom:10px;"></i>
      <h3>${user.name}</h3>
      <p style="color:var(--text-gray); font-size:12px;">${user.phone}</p>
      <div style="background:var(--card-bg); margin-top:20px; padding:15px; border-radius:10px; text-align:left; border:1px solid var(--border-color);">
        <strong style="font-size:12px; color:var(--primary-red);">SAVED ADDRESS</strong>
        <p style="font-size:12px; margin-top:4px;">${user.address}</p>
      </div>
    </div>
  `;
}
function renderProfileScreen(container) {
  const user = JSON.parse(localStorage.getItem('sa_user_info')) || { name: '', phone: '', address: '' };
  
  container.innerHTML = `
    <div class="red-top-bar"><span>CUSTOMER PROFILE</span></div>
    
    <div style="padding: 15px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <i class="fa-solid fa-circle-user" style="font-size: 65px; color: var(--primary-red);"></i>
        <h3 style="margin-top: 8px; color: #fff;">${user.name || 'Guest Foodie'}</h3>
        <p style="font-size: 12px; color: var(--text-gray);">${user.phone ? '📞 ' + user.phone : 'No phone linked'}</p>
      </div>

      <div style="background: var(--card-bg); padding: 15px; border-radius: 12px; border: 1px solid var(--border-color); margin-bottom: 15px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 12px;">
          <strong style="font-size: 13px; color: var(--primary-red);">MY DETAILS (AUTO-FILL)</strong>
          <i class="fa-solid fa-user-pen" style="color: var(--primary-red);"></i>
        </div>
        
        <div class="input-group" style="margin: 8px 0;">
          <label style="font-size: 11px;">Your Name</label>
          <input type="text" id="prof-name" class="input-box" value="${user.name}" placeholder="Enter your name">
        </div>

        <div class="input-group" style="margin: 8px 0;">
          <label style="font-size: 11px;">Phone Number</label>
          <input type="tel" id="prof-phone" class="input-box" value="${user.phone}" placeholder="Enter mobile number">
        </div>

        <div class="input-group" style="margin: 8px 0;">
          <label style="font-size: 11px;">Default Delivery Address</label>
          <textarea id="prof-address" class="input-box" rows="2" placeholder="House / Village / Landmark">${user.address}</textarea>
        </div>

        <button class="btn-large-red" style="width: 100%; margin: 10px 0 0 0; padding: 10px;" onclick="saveProfileData()">SAVE DETAILS</button>
      </div>

      <div style="background: var(--card-bg); padding: 15px; border-radius: 12px; border: 1px solid var(--border-color); text-align: center;">
        <i class="fa-solid fa-store" style="color: var(--primary-red); font-size: 20px; margin-bottom: 5px;"></i>
        <h4 style="font-size: 13px;">S&A FAMILY RESTAURANT</h4>
        <p style="font-size: 11px; color: var(--text-gray); margin-top: 3px;">U.T. Road, Bengbari, Udalguri, Assam</p>
      </div>
    </div>
  `;
}

function saveProfileData() {
  const name = document.getElementById('prof-name').value.trim();
  const phone = document.getElementById('prof-phone').value.trim();
  const address = document.getElementById('prof-address').value.trim();

  if (!name || !phone) {
    alert("Kripya Naam aur Phone Number zaroor bharein!");
    return;
  }

  localStorage.setItem('sa_user_info', JSON.stringify({ name, phone, address }));
  alert("Profile Details Saved Successfully! 🎉");
  renderProfileScreen(document.getElementById('app-container'));
}
