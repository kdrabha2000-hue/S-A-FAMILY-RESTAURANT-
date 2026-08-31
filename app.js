// FIREBASE CONFIGURATION
const firebaseConfig = {
  apiKey: "AIzaSyDDTFZDBEAXS6hsQ_W5akOMRWiXyZdjkSo",
  authDomain: "kd-ka-khana-ghar-tak.firebaseapp.com",
  databaseURL: "https://kd-ka-khana-ghar-tak-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "kd-ka-khana-ghar-tak"
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// DEFAULT BACKUP MENU
const defaultMenu = [
  { id: "1", name: "Chicken Steamed Momo (10 Pcs)", price: 120, category: "Fast Food", isVeg: false, inStock: true, img: "https://images.unsplash.com/photo-1625201941771-7eb5a3a67d02?w=200" },
  { id: "2", name: "Chicken Fried Momo (10 Pcs)", price: 140, category: "Fast Food", isVeg: false, inStock: true, img: "https://images.unsplash.com/photo-1625201941771-7eb5a3a67d02?w=200" },
  { id: "3", name: "Chicken Schezwan Gravy Momo", price: 160, category: "Fast Food", isVeg: false, inStock: true, img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200" },
  { id: "4", name: "Chicken Pakora", price: 100, halfPrice: 50, hasVariant: true, category: "Fast Food", isVeg: false, inStock: true, img: "https://images.unsplash.com/photo-1562967914-608f82629710?w=200" },
  { id: "5", name: "Veg Chowmein", price: 50, category: "Fast Food", isVeg: true, inStock: true, img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200" },
  { id: "6", name: "Chicken Chowmein", price: 100, category: "Fast Food", isVeg: false, inStock: true, img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200" },
  { id: "7", name: "Veg Roll", price: 40, category: "Rolls", isVeg: true, inStock: true, img: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=200" },
  { id: "8", name: "Chicken Roll", price: 80, category: "Rolls", isVeg: false, inStock: true, img: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=200" },
  { id: "9", name: "Pork Roll", price: 100, category: "Rolls", isVeg: false, inStock: true, img: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=200" },
  { id: "10", name: "Chicken Biryani", price: 180, category: "Main Course", isVeg: false, inStock: true, img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200" },
  { id: "11", name: "Cold Drink / Thumbs Up", price: 40, category: "Drinks", isVeg: true, inStock: true, img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=200" }
];

let restaurantMenu = [...defaultMenu];
let currentCategory = 'All';
let cart = [];
let wishlist = JSON.parse(localStorage.getItem('sa_wishlist')) || [];
let activeOrder = JSON.parse(localStorage.getItem('sa_active_order')) || null;
let appliedCoupon = null;
let deliveryMode = 'delivery';
let userTip = 0;

// SYNC MENU REALTIME
db.ref('restaurant_menu').on('value', (snap) => {
  const data = snap.val();
  if (data && Object.keys(data).length > 0) {
    restaurantMenu = Object.entries(data).map(([k, item]) => ({
      ...item,
      id: String(item.id || k),
      inStock: item.inStock !== false
    }));
  } else {
    restaurantMenu = [...defaultMenu];
  }
  refreshCurrentTab();
});

document.addEventListener('DOMContentLoaded', () => {
  switchTab('home');
  listenToActiveOrder();
});

function refreshCurrentTab() {
  const activeBtn = document.querySelector('.nav-item.active span');
  const activeTab = activeBtn ? activeBtn.innerText.toLowerCase() : 'home';
  if (activeTab === 'home') renderHomeScreen(document.getElementById('app-container'));
  if (activeTab === 'menu') renderMenuScreen(document.getElementById('app-container'));
}

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
      <div class="brand-title">S&A</div>
      <div style="font-weight:bold; font-size:13px; letter-spacing:1px;">FAMILY RESTAURANT</div>
      <div class="tagline">Fast Food & Fresh Meals</div>
    </div>

    <div class="offer-strip">⚡ SPECIAL OFFER: Use <b>WELCOME50</b> for Flat ₹50 OFF!</div>

    <div class="search-wrapper">
      <i class="fa-solid fa-magnifying-glass"></i>
      <input type="text" placeholder="Search momos, rolls, chowmein..." oninput="handleSearch(this.value, 'home-list')">
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
        <button class="btn-order-now" onclick="addToCart('4', 'Half')">ORDER HALF</button>
      </div>
      <img src="https://images.unsplash.com/photo-1562967914-608f82629710?w=200" alt="Pakora">
    </div>

    <h4 style="padding: 10px 15px 5px 15px; font-size:13px; color:var(--primary-red);">POPULAR ITEMS</h4>
    <div id="home-list"></div>

    <a href="tel:8453270362" style="position:fixed; bottom:70px; right:15px; background:#4CAF50; color:#fff; width:45px; height:45px; border-radius:50%; display:flex; align-items:center; justify-content:center; text-decoration:none; box-shadow:0 4px 10px rgba(0,0,0,0.5); z-index:90;">
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
      <button class="pill ${currentCategory==='All'?'active':''}" onclick="filterCategory('All', this)">All</button>
      <button class="pill ${currentCategory==='Fast Food'?'active':''}" onclick="filterCategory('Fast Food', this)">Fast Food</button>
      <button class="pill ${currentCategory==='Rolls'?'active':''}" onclick="filterCategory('Rolls', this)">Rolls</button>
      <button class="pill ${currentCategory==='Main Course'?'active':''}" onclick="filterCategory('Main Course', this)">Main Course</button>
      <button class="pill ${currentCategory==='Drinks'?'active':''}" onclick="filterCategory('Drinks', this)">Drinks</button>
    </div>

    <div id="full-menu-list"></div>
  `;
  
  const items = currentCategory === 'All' 
    ? restaurantMenu 
    : restaurantMenu.filter(i => (i.category || '').toLowerCase().trim() === currentCategory.toLowerCase().trim());
    
  renderItemsList(items, 'full-menu-list');
}

function filterCategory(cat, btn) {
  currentCategory = cat;
  document.querySelectorAll('.pill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const items = cat === 'All' 
    ? restaurantMenu 
    : restaurantMenu.filter(i => (i.category || '').toLowerCase().trim() === cat.toLowerCase().trim());
  renderItemsList(items, 'full-menu-list');
}

function handleSearch(keyword, targetId) {
  const filtered = restaurantMenu.filter(i => (i.name || '').toLowerCase().includes(keyword.toLowerCase()));
  renderItemsList(filtered, targetId);
}

function renderItemsList(items, targetId) {
  const list = document.getElementById(targetId);
  if (!list) return;

  if (!items || items.length === 0) {
    list.innerHTML = `<p style="text-align:center; padding:30px; color:var(--text-gray); font-size:12px;">No dishes found in this section.</p>`;
    return;
  }

  list.innerHTML = items.map(item => {
    const badgeColor = item.isVeg ? "veg-dot" : "nonveg-dot";
    const inCart = cart.find(c => String(c.id) === String(item.id));
    const isWished = wishlist.includes(String(item.id));

    return `
      <div class="item-card">
        <button class="wishlist-btn ${isWished ? 'active' : ''}" onclick="toggleWishlist('${item.id}')">
          <i class="fa-${isWished ? 'solid' : 'regular'} fa-heart"></i>
        </button>
        <img src="${item.img || 'https://images.unsplash.com/photo-1562967914-608f82629710?w=200'}" alt="${item.name}">
        <div class="item-info">
          <h4><span class="badge-dot ${badgeColor}"></span>${item.name}</h4>
          <p class="price">₹${item.price} ${item.hasVariant ? `<small style="font-size:10px; color:#aaa;">(Full) / ₹${item.halfPrice} (Half)</small>` : ''}</p>
        </div>
        ${!item.inStock ? `<span class="sold-out-badge">SOLD OUT</span>` : 
          item.hasVariant ? `
            <div style="display:flex; flex-direction:column; gap:4px;">
              <button class="btn-add-red" style="font-size:10px; padding:4px 8px;" onclick="addToCart('${item.id}', 'Half')">HALF +</button>
              <button class="btn-add-red" style="font-size:10px; padding:4px 8px;" onclick="addToCart('${item.id}', 'Full')">FULL +</button>
            </div>
          ` :
          inCart ? `
            <div class="qty-ctrl">
              <button onclick="changeQty('${item.id}', -1)">-</button>
              <span>${inCart.qty}</span>
              <button onclick="changeQty('${item.id}', 1)">+</button>
            </div>
          ` : `
            <button class="btn-add-red" onclick="addToCart('${item.id}')">ADD +</button>
          `
        }
      </div>
    `;
  }).join('');
}

function toggleWishlist(id) {
  const strId = String(id);
  if (wishlist.includes(strId)) {
    wishlist = wishlist.filter(x => x !== strId);
  } else {
    wishlist.push(strId);
  }
  localStorage.setItem('sa_wishlist', JSON.stringify(wishlist));
  refreshCurrentTab();
}

function addToCart(id, variant = null) {
  const item = restaurantMenu.find(i => String(i.id) === String(id));
  if (!item || item.inStock === false) return;

  const itemKey = variant ? `${item.id}_${variant}` : `${item.id}`;
  const itemName = variant ? `${item.name} (${variant})` : item.name;
  const itemPrice = variant === 'Half' ? (item.halfPrice || item.price) : item.price;

  const existing = cart.find(i => i.cartKey === itemKey);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, cartKey: itemKey, name: itemName, price: Number(itemPrice), qty: 1 });
  }
  updateBadge();
  refreshCurrentTab();
}

function changeQty(id, delta, cartKey = null) {
  const item = cartKey ? cart.find(i => i.cartKey === cartKey) : cart.find(i => String(i.id) === String(id));
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter(i => i !== item);
  }
  updateBadge();
  refreshCurrentTab();
}

function updateBadge() {
  const total = cart.reduce((sum, i) => sum + i.qty, 0);
  const badge = document.getElementById('cart-badge');
  if (badge) badge.innerText = total;
}

function renderCartScreen(container) {
  const subtotal = cart.reduce((sum, item) => sum + (Number(item.price) * item.qty), 0);
  const delivery = (deliveryMode === 'delivery' && subtotal > 0) ? 30 : 0;
  const packing = subtotal > 0 ? 10 : 0;
  const discount = appliedCoupon === 'WELCOME50' && subtotal >= 200 ? 50 : 0;
  const total = Math.max(0, subtotal + delivery + packing + userTip - discount);

  container.innerHTML = `
    <div class="red-top-bar">
      <span>YOUR CART</span>
      <i class="fa-solid fa-trash" style="cursor:pointer;" onclick="cart=[]; updateBadge(); renderCartScreen(document.getElementById('app-container'));"></i>
    </div>

    <div style="display:flex; margin:10px 15px; background:var(--card-bg); border-radius:8px; padding:4px; border:1px solid var(--border-color);">
      <button style="flex:1; padding:8px; border:none; border-radius:6px; font-weight:bold; font-size:12px; cursor:pointer; background:${deliveryMode==='delivery'?'var(--primary-red)':'none'}; color:${deliveryMode==='delivery'?'#fff':'#aaa'};" onclick="deliveryMode='delivery'; renderCartScreen(document.getElementById('app-container'));">🛵 Home Delivery</button>
      <button style="flex:1; padding:8px; border:none; border-radius:6px; font-weight:bold; font-size:12px; cursor:pointer; background:${deliveryMode==='pickup'?'var(--primary-red)':'none'}; color:${deliveryMode==='pickup'?'#fff':'#aaa'};" onclick="deliveryMode='pickup'; renderCartScreen(document.getElementById('app-container'));">🛍️ Takeaway</button>
    </div>

    ${cart.map(item => `
      <div class="item-card">
        <img src="${item.img || 'https://images.unsplash.com/photo-1562967914-608f82629710?w=200'}">
        <div class="item-info">
          <h4>${item.name}</h4>
          <p class="price">₹${item.price}</p>
        </div>
        <div class="qty-ctrl">
          <button onclick="changeQty('${item.id}', -1, '${item.cartKey}')">-</button>
          <span>${item.qty}</span>
          <button onclick="changeQty('${item.id}', 1, '${item.cartKey}')">+</button>
        </div>
        <div style="font-weight:bold; width: 45px; text-align:right;">₹${item.price * item.qty}</div>
      </div>
    `).join('')}

    ${cart.length > 0 ? `
      <div style="margin: 10px 15px; display:flex; gap:8px;">
        <input type="text" id="coupon-input" class="input-box" placeholder="WELCOME50" style="text-transform:uppercase;">
        <button class="btn-add-red" onclick="applyPromo()">APPLY</button>
      </div>

      <div style="padding: 12px; background: var(--card-bg); margin: 15px; border-radius:12px; border:1px solid var(--border-color);">
        <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:12px;"><span>Subtotal</span> <span>₹${subtotal}</span></div>
        <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:12px;"><span>Delivery Fee</span> <span>₹${delivery}</span></div>
        <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:12px;"><span>Packaging Fee</span> <span>₹${packing}</span></div>
        ${discount > 0 ? `<div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:12px; color:#4CAF50;"><span>Coupon Applied</span> <span>-₹${discount}</span></div>` : ''}
        <hr style="border-color:var(--border-color); margin:8px 0;">
        <div style="display:flex; justify-content:space-between; font-weight:bold; font-size:15px;"><span>TOTAL</span> <span class="price" style="color:var(--primary-red);">₹${total}</span></div>
      </div>

      <button class="btn-large-red" onclick="switchTab('checkout')">CONTINUE TO CHECKOUT ></button>
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
  const subtotal = cart.reduce((sum, item) => sum + (Number(item.price) * item.qty), 0);
  const delivery = (deliveryMode === 'delivery' && subtotal > 0) ? 30 : 0;
  const packing = subtotal > 0 ? 10 : 0;
  const discount = appliedCoupon === 'WELCOME50' && subtotal >= 200 ? 50 : 0;
  const total = Math.max(0, subtotal + delivery + packing + userTip - discount);
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
      <textarea id="cust-address" class="input-box" rows="2" placeholder="House / Village / Landmark">${deliveryMode==='pickup'?'Takeaway Pickup':(savedUser.address || '')}</textarea>
    </div>

    <div class="input-group">
      <label>Special Instructions</label>
      <input type="text" id="cust-note" class="input-box" placeholder="e.g. Less spicy, extra sauce">
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
    alert("Please enter Name, Phone, and Address!");
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
    totalBill: Number(total),
    status: "Received",
    createdAt: Date.now(),
    timestamp: Date.now()
  };

  db.ref('orders/' + orderId).set(newOrder)
    .then(() => {
      activeOrder = newOrder;
      localStorage.setItem('sa_active_order', JSON.stringify(activeOrder));
      listenToActiveOrder();

      cart = [];
      updateBadge();

      if (typeof confetti === 'function') confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      showSuccessModal(orderId);
    })
    .catch(err => {
      alert("Firebase Write Error: Check Database Rules! " + err.message);
    });
}

function showSuccessModal(orderId) {
  const overlay = document.createElement('div');
  overlay.className = "modal-overlay";
  overlay.innerHTML = `
    <div class="modal-content">
      <i class="fa-solid fa-circle-check" style="color:#4CAF50; font-size:45px; margin-bottom:12px;"></i>
      <h3 style="color:#fff;">Order Placed!</h3>
      <p style="color:var(--text-gray); font-size:12px; margin: 8px 0;">Order #${orderId} sent to kitchen.</p>
      <button class="btn-large-red" style="margin:10px 0 0 0;" onclick="closeModalAndTrack()">TRACK ORDER</button>
    </div>
  `;
  document.body.appendChild(overlay);
}

function closeModalAndTrack() {
  document.querySelector('.modal-overlay')?.remove();
  switchTab('orders');
}

function listenToActiveOrder() {
  if (!activeOrder || !activeOrder.orderId) return;

  db.ref('orders/' + activeOrder.orderId).on('value', snap => {
    const data = snap.val();
    if (data && data.status) {
      activeOrder = data;
      localStorage.setItem('sa_active_order', JSON.stringify(activeOrder));
      const currentTab = document.querySelector('.nav-item.active span')?.innerText.toLowerCase();
      if (currentTab === 'track' || currentTab === 'orders') renderOrdersScreen(document.getElementById('app-container'));
    }
  });
}

function renderOrdersScreen(container) {
  const s = activeOrder ? activeOrder.status : '';

  container.innerHTML = `
    <div class="red-top-bar"><span>LIVE ORDER TRACKING</span></div>

    <div style="padding: 15px;">
      <div style="display:flex; gap:8px; margin-bottom:15px;">
        <input type="text" id="track-id-input" class="input-box" placeholder="Order ID (e.g. ORD-578035)" value="${activeOrder ? activeOrder.orderId : ''}">
        <button class="btn-add-red" onclick="trackManualOrder()">TRACK</button>
      </div>

      ${activeOrder ? `
        <div class="tracker-card" style="margin:0;">
          <div style="display:flex; justify-content:space-between; margin-bottom:12px; font-size:13px;">
            <span>Order <b>#${activeOrder.orderId}</b></span>
            <span style="color:var(--primary-red); font-weight:bold;">₹${activeOrder.totalBill}</span>
          </div>

          <div class="track-step ${['Received', 'Preparing', 'On The Way', 'Delivered'].includes(s) ? 'active' : ''}">
            <div class="track-icon"><i class="fa-solid fa-receipt"></i></div>
            <div><strong>Order Received</strong><div style="font-size:10px; color:var(--text-gray);">Order accepted by kitchen</div></div>
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
      ` : `<p style="padding:30px; text-align:center; color:var(--text-gray); font-size:12px;">No active order right now.</p>`}
    </div>
  `;
}

function trackManualOrder() {
  const id = document.getElementById('track-id-input').value.trim();
  if (!id) return;
  db.ref('orders/' + id).once('value', snap => {
    const data = snap.val();
    if (data) {
      activeOrder = data;
      localStorage.setItem('sa_active_order', JSON.stringify(activeOrder));
      listenToActiveOrder();
      renderOrdersScreen(document.getElementById('app-container'));
    } else {
      alert("Order not found!");
    }
  });
}

function renderProfileScreen(container) {
  const user = JSON.parse(localStorage.getItem('sa_user_info')) || { name: '', phone: '', address: '' };
  const wishedDishes = restaurantMenu.filter(m => wishlist.includes(String(m.id)));

  container.innerHTML = `
    <div class="red-top-bar"><span>CUSTOMER PROFILE</span></div>
    <div style="padding: 15px;">
      <div style="text-align:center; margin-bottom:15px;">
        <i class="fa-solid fa-circle-user" style="font-size:55px; color:var(--primary-red);"></i>
        <h3 style="margin-top:6px;">${user.name || 'Foodie'}</h3>
        <p style="font-size:11px; color:var(--text-gray);">${user.phone || 'No phone linked'}</p>
      </div>

      <div style="background:var(--card-bg); padding:12px; border-radius:10px; border:1px solid var(--border-color); margin-bottom:15px;">
        <strong style="font-size:12px; color:var(--primary-red);">SAVED ADDRESS</strong>
        <div class="input-group" style="margin:6px 0;"><input type="text" id="prof-name" class="input-box" value="${user.name}" placeholder="Name"></div>
        <div class="input-group" style="margin:6px 0;"><input type="tel" id="prof-phone" class="input-box" value="${user.phone}" placeholder="Phone"></div>
        <div class="input-group" style="margin:6px 0;"><textarea id="prof-address" class="input-box" rows="2" placeholder="Address">${user.address}</textarea></div>
        <button class="btn-large-red" style="width:100%; margin:8px 0 0 0; padding:8px;" onclick="saveProfileData()">SAVE DETAILS</button>
      </div>

      <strong style="font-size:12px; color:var(--primary-red); display:block; margin-bottom:8px;">MY WISHLIST (❤️)</strong>
      ${wishedDishes.length > 0 ? wishedDishes.map(w => `
        <div class="item-card" style="margin:6px 0;">
          <img src="${w.img}">
          <div class="item-info"><h4>${w.name}</h4><p class="price">₹${w.price}</p></div>
          <button class="btn-add-red" onclick="addToCart('${w.id}')">ADD</button>
        </div>
      `).join('') : '<p style="color:var(--text-gray); font-size:11px;">No dishes saved yet.</p>'}
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
