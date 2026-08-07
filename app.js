const restaurantMenu = [
   SPECIAL FAST FOODS (Chowmein, Momos, Rolls & Chicken Pakora)
  { id: 1, name: "Chicken Pakora (Full)", price: 100, category: "Fast Food", isSpecial: true, img: "https://images.unsplash.com/photo-1562967914-608f82629710?w=200" },
  { id: 2, name: "Chicken Pakora (Half)", price: 50, category: "Fast Food", isSpecial: true, img: "https://images.unsplash.com/photo-1562967914-608f82629710?w=200" },
  
  3 Types of Chowmein
  { id: 3, name: "Veg Chowmein", price: 50, category: "Fast Food", isSpecial: true, img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200" },
  { id: 4, name: "Chicken Chowmein", price: 100, category: "Fast Food", isSpecial: true, img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200" },
  { id: 5, name: "Pork Chowmein", price: 120, category: "Fast Food", isSpecial: true, img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200" },

  3 Types of Momos
  { id: 6, name: "Veg Momos", price: 50, category: "Fast Food", isSpecial: true, img: "https://images.unsplash.com/photo-1625201941771-7eb5a3a67d02?w=200" },
  { id: 7, name: "Chicken Momos", price: 70, category: "Fast Food", isSpecial: true, img: "https://images.unsplash.com/photo-1625201941771-7eb5a3a67d02?w=200" },
  { id: 8, name: "Pork Momos", price: 80, category: "Fast Food", isSpecial: true, img: "https://images.unsplash.com/photo-1625201941771-7eb5a3a67d02?w=200" },

  3 Types of Rolls
  { id: 9, name: "Veg Roll", price: 40, category: "Rolls", isSpecial: true, img: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=200" },
  { id: 10, name: "Chicken Roll", price: 80, category: "Rolls", isSpecial: true, img: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=200" },
  { id: 11, name: "Pork Roll", price: 100, category: "Rolls", isSpecial: true, img: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=200" },

  Other Specials & Drinks
  { id: 12, name: "Chicken Biryani", price: 180, category: "Main Course", isSpecial: true, img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200" },
  { id: 13, name: "Butter Chicken", price: 200, category: "Main Course", isSpecial: true, img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=200" },
  { id: 14, name: "Cold Coffee", price: 70, category: "Drinks", img: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=200" }
];

let cart = [];

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
  const specials = restaurantMenu.filter(i => i.isSpecial);
  container.innerHTML = `
    <div class="screen-header">
      <div class="brand-main">
        <div class="brand-title">S&A</div>
        <div style="font-weight: bold; font-size: 13px; letter-spacing: 1px;">FAMILY RESTAURANT</div>
        <div class="tagline">Fast Food & Fresh Meals</div>
      </div>
    </div>

    <div class="offer-strip">
      ⚡ SPECIAL OFFER: Apply Code <b>WELCOME50</b> & Get Flat ₹50 OFF!
    </div>

    <div class="location-box">
      <i class="fa-solid fa-location-dot"></i>
      <div>
        <strong>U.T. Road, Bengbari</strong><br>
        <span style="color:var(--text-gray);">Udalguri, Assam - 784523</span>
      </div>
    </div>

    <div class="info-row">
      <div><i class="fa-solid fa-clock"></i> Open 8:00 AM - 9:00 PM</div>
      <div style="margin-left:auto;"><i class="fa-solid fa-motorcycle"></i> Fast Delivery 5-12 km</div>
    </div>

    <!-- MAIN BANNER FOR FAST FOOD -->
    <div class="special-banner">
      <div>
        <small style="color: #ffcdd2; font-weight: bold;">SPECIAL FAST FOOD</small>
        <h3 style="font-size: 17px; margin-top:2px;">Chicken Pakora</h3>
        <p class="price" style="margin-top: 4px;">Just ₹50</p>
        <button class="btn-order-now" onclick="addToCart(2)">ORDER NOW</button>
      </div>
      <img src="https://images.unsplash.com/photo-1562967914-608f82629710?w=200" alt="Pakora">
    </div>

    <div style="display:flex; justify-content:space-between; padding:5px 15px; align-items:center;">
      <h4 style="font-size: 13px; color: var(--primary-red); font-weight: bold;">🔥 TOP SPECIAL ITEMS</h4>
      <span style="font-size: 11px; color: var(--text-gray); cursor:pointer;" onclick="switchTab('menu')">View All ></span>
    </div>

    <div class="horizontal-scroll">
      ${specials.map(i => `
        <div class="pop-card" onclick="addToCart(${i.id})">
          <img src="${i.img}">
          <div style="font-size:11px; font-weight:bold;">${i.name}</div>
          <div style="font-size:11px; color:var(--primary-red); font-weight:bold;">₹${i.price}</div>
        </div>
      `).join('')}
    </div>

    <h4 style="padding: 10px 15px 0 15px; font-size:13px; color: var(--primary-red);">FAST FOODS & ROLLS</h4>
    <div id="home-fastfood-list"></div>
  `;
  renderItemsList(specials, 'home-fastfood-list');
}

function renderMenuScreen(container) {
  container.innerHTML = `
    <div class="red-top-bar">
      <span>MENU CARD</span>
      <i class="fa-solid fa-magnifying-glass"></i>
    </div>

    <div class="category-pills">
      <button class="pill active" onclick="filterCategory('All', this)">All Specials</button>
      <button class="pill" onclick="filterCategory('Fast Food', this)">Fast Food & Momos</button>
      <button class="pill" onclick="filterCategory('Rolls', this)">Rolls</button>
      <button class="pill" onclick="filterCategory('Main Course', this)">Main Course</button>
      <button class="pill" onclick="filterCategory('Drinks', this)">Drinks</button>
    </div>

    <div id="full-menu-list"></div>
  `;
  renderItemsList(restaurantMenu, restaurantMenu.filter(...)
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
    const cartItem = cart.find(c => c.id === item.id);
    return `
      <div class="item-card">
        <img src="${item.img}">
        <div class="item-info">
          <h4>${item.name}</h4>
          <p class="price">₹${item.price}</p>
        </div>
        ${cartItem ? `
          <div class="qty-ctrl">
            <button onclick="changeQty(${item.id}, -1)">-</button>
            <span>${cartItem.qty}</span>
            <button onclick="changeQty(${item.id}, 1)">+</button>
          </div>
        ` : `
          <button class="btn-add-red" onclick="addToCart(${item.id})">ADD +</button>
        `}
      </div>
    `;
  }).join('');
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
  const activeNav = document.querySelector('.nav-item.active span');
  if (activeNav) switchTab(activeNav.innerText.toLowerCase());
}

function updateBadge() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const badge = document.getElementById('cart-badge');
  if (badge) badge.innerText = count;
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  }
  updateBadge();
  const activeNav = document.querySelector('.nav-item.active span');
  if (activeNav) switchTab(activeNav.innerText.toLowerCase());
}

function renderCartScreen(container) {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const delivery = subtotal > 0 ? 40 : 0;
  const discount = subtotal >= 200 ? 50 : 0;
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
      <div style="padding: 12px; background: var(--card-bg); margin: 15px; border-radius:12px; border:1px solid var(--border-color);">
        <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:13px;"><span>Subtotal</span> <span>₹${subtotal}</span></div>
        <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:13px;"><span>Delivery Charge</span> <span>₹${delivery}</span></div>
        ${discount > 0 ? `<div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:13px; color:#4CAF50;"><span>Offer Discount (WELCOME50)</span> <span>-₹${discount}</span></div>` : ''}
        <hr style="border-color:var(--border-color); margin:10px 0;">
        <div style="display:flex; justify-content:space-between; font-weight:bold; font-size:15px;"><span>TOTAL PAYABLE</span> <span class="price" style="color:var(--primary-red);">₹${total}</span></div>
      </div>
      <button class="btn-large-red" onclick="switchTab('checkout')">PROCEED TO CHECKOUT ></button>
    ` : '<p style="padding:30px; text-align:center; color:var(--text-gray);">Your Cart is Empty</p>'}
  `;
}

function renderCheckoutScreen(container) {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discount = subtotal >= 200 ? 50 : 0;
  const total = Math.max(0, subtotal + 40 - discount);

  container.innerHTML = `
    <div class="red-top-bar">
      <span>CHECKOUT</span>
    </div>

    <div class="input-group" style="margin-top:15px;">
      <label>DELIVERY DETAILS</label>
      <input type="text" id="cust-name" class="input-box" placeholder="Your Name">
    </div>

    <div class="input-group">
      <input type="tel" id="cust-phone" class="input-box" placeholder="Mobile Number">
    </div>

    <div class="input-group">
      <textarea id="cust-address" class="input-box" rows="3" placeholder="Complete Delivery Address"></textarea>
    </div>

    <div class="input-group">
      <label>PAYMENT METHOD</label>
      <div style="background:var(--card-bg); padding:12px; border-radius:8px; border:1px solid var(--border-color); font-size:13px;">
        <i class="fa-solid fa-circle-check" style="color:var(--primary-red);"></i> UPI ID: <b>6000026478@okbizaxis</b> / Cash on Delivery
      </div>
    </div>

    <div style="display:flex; justify-content:space-between; padding: 10px 15px; font-weight:bold;">
      <span>Total Amount</span>
      <span class="price" style="font-size:18px;">₹${total}</span>
    </div>

    <button class="btn-large-red" onclick="placeFinalOrder(${total})">SEND ORDER ON WHATSAPP ></button>
  `;
}

function placeFinalOrder(total) {
  const name = document.getElementById('cust-name').value.trim();
  const phone = document.getElementById('cust-phone').value.trim();
  const address = document.getElementById('cust-address').value.trim();

  if (!name || !phone || !address) {
    alert('Please fill Name, Mobile Number and Address!');
    return;
  }

  const orderId = Math.floor(100000 + Math.random() * 900000);

  let message = `*NEW ORDER - S&A FAMILY RESTAURANT*\n`;
  message += `----------------------------------------\n`;
  message += `*Order ID:* %23${orderId}\n`;
  message += `*Customer:* ${name}\n`;
  message += `*Mobile Number:* ${phone}\n`;
  message += `*Address:* ${address}\n`;
  message += `----------------------------------------\n`;
  message += `*ITEMS:*\n`;
  cart.forEach(i => {
    message += `• ${i.name} x ${i.qty} = ₹${i.price * i.qty}\n`;
  });
  message += `----------------------------------------\n`;
  message += `*TOTAL PAYABLE:* ₹${total}\n\n`;
  message += `Please confirm my order!`;

  cart = [];
  updateBadge();

  const myWhatsAppNumber = "918453270362";
  window.location.href = `https://wa.me/${myWhatsAppNumber}?text=${encodeURIComponent(message)}`;
}

function renderOrdersScreen(container) {
  container.innerHTML = `
    <div class="red-top-bar"><span>ORDERS</span></div>
    <p style="padding:20px; text-align:center; color:var(--text-gray);">No active orders.</p>
  `;
}

function renderProfileScreen(container) {
  container.innerHTML = `
    <div class="red-top-bar"><span>PROFILE</span></div>
    <div style="padding:20px; text-align:center;">
      <h3>S&A FAMILY RESTAURANT</h3>
      <p style="color:var(--text-gray); font-size:12px; margin-top:5px;">U.T. Road, Bengbari, Udalguri, Assam</p>
    </div>
  `;
}
1. Firebase Config (Firebase Console से अपना Config Details पेस्ट करें)

const firebaseConfig = {
  apiKey: "AIzaSyA9rXmSvtDVg2pfne8Xxik_l7TOGrhMWGM",
  authDomain: "fir-a-familyrestaurant.firebaseapp.com",
  projectId: "fir-a-familyrestaurant",
  storageBucket: "fir-a-familyrestaurant.firebasestorage.app",
  messagingSenderId: "631976985851",
  appId: "1:631976985851:web:9044bf9d216260f7b61c5e",
  measurementId: "G-KH3HE2ZZGZ"
};

Initialize Firebase
//const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

 Initialize Firebase
firebase.initiAlizeapp(firebaseConfig);
const auth = firebase.auth();

2. Sign Up Function
function signUp() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  auth.createUserWithEmailAndPassword(email, password)
    .then(userCredential => alert("Account Created Successfully!"))
    .catch(error => alert(error.message));
}

3. Login Function
function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  auth.signInWithEmailAndPassword(email, password)
    .then(userCredential => alert("Logged In Successfully!"))
    .catch(error => alert(error.message));
}

 4. Google Sign-In Function
function googleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .catch(error => alert(error.message));
}

 5. Auth State Listener (Profile Display Logic)
auth.onAuthStateChanged(user => {
  if (user) {
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('profile-container').style.display = 'block';
    document.getElementById('user-email').innerText = user.email;
    document.getElementById('user-name').innerText = user.displayName || "Customer";
  } else {
    document.getElementById('auth-container').style.display = 'block';
    document.getElementById('profile-container').style.display = 'none';
  }
});

 6. Logout Function
function logout() {
  auth.signOut();
}
