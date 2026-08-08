// 1. Firebase Config & Initialization
const firebaseConfig = {
  apiKey: "AIzaSyCASOp4d-HQdEjrxLxV-Bmx3lhhfed0GqE",
  authDomain: "fir-a-familyrestaurant.firebaseapp.com",
  projectId: "fir-a-familyrestaurant",
  storageBucket: "fir-a-familyrestaurant.firebasestorage.app",
  messagingSenderId: "631976985851",
  appId: "1:631976985851:web:9fb349b7f832dad5b61c5e",
  measurementId: "G-19X7WCXX8L"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// 2. Restaurant Data & Menu
const myWhatsAppNumber = "918453270362";

const restaurantMenu = [
  { id: 1, name: "Chicken Biryani", price: 180, category: "Special", img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300", isSpec: true },
  { id: 2, name: "Chicken Pakora (Full)", price: 100, category: "Fast Food", img: "https://images.unsplash.com/photo-1562967914-608f82629710?w=300" },
  { id: 3, name: "Chicken Pakora (Half)", price: 50, category: "Fast Food", img: "https://images.unsplash.com/photo-1562967914-608f82629710?w=300" },
  { id: 4, name: "Chowmein", price: 50, category: "Fast Food", img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=300" },
  { id: 5, name: "Egg Chowmein", price: 100, category: "Fast Food", img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=300" },
  { id: 6, name: "Pork Chowmein", price: 120, category: "Fast Food", img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=300" },
  { id: 7, name: "Momos", price: 50, category: "Fast Food", img: "https://images.unsplash.com/photo-1625220194771-7eb5a3a69395?w=300" },
  { id: 8, name: "Chicken Momos", price: 80, category: "Fast Food", img: "https://images.unsplash.com/photo-1625220194771-7eb5a3a69395?w=300" },
  { id: 9, name: "Pork Momos", price: 80, category: "Fast Food", img: "https://images.unsplash.com/photo-1625220194771-7eb5a3a69395?w=300" },
  { id: 10, name: "Chicken Roll", price: 60, category: "Rolls", img: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=300" },
  { id: 11, name: "Pork Roll", price: 100, category: "Rolls", img: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=300" },
  { id: 12, name: "Egg Roll", price: 50, category: "Rolls", img: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=300" },
  { id: 13, name: "Single Roll", price: 40, category: "Rolls", img: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=300" },
  { id: 14, name: "Veg Thali", price: 120, category: "Main Course", img: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300" },
  { id: 15, name: "Butter Chicken", price: 150, category: "Main Course", img: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=300" },
  { id: 16, name: "Cold Coffee", price: 80, category: "Drinks", img: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=300" }
];

let cart = [];
let bannerTimer = null;

// 3. Navigation Switcher
function switchTab(tabName) {
  if (bannerTimer) clearInterval(bannerTimer);
  document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
  
  const container = document.getElementById('app-container');
  if(tabName === 'home') {
    renderHomeScreen(container);
  } else if(tabName === 'menu') {
    renderMenuScreen(container, 'All');
  } else if(tabName === 'cart') {
    renderCartScreen(container);
  } else if(tabName === 'profile') {
    renderProfileScreen(container);
  }
}

// 4. Render Home Screen
function renderHomeScreen(container) {
  const populars = restaurantMenu.slice(0, 5);

  container.innerHTML = `
    <div class="location-card">
      <div class="loc-header"><i class="fa-solid fa-location-dot"></i> U.T. Road, Bengbari</div>
      <div class="loc-address">Udalguri, Assam - 784523</div>
      <div class="loc-info-row">
        <span><i class="fa-solid fa-clock"></i> Open: 8:00 AM - 9:30 PM</span>
        <span><i class="fa-solid fa-motorcycle"></i> Fast Delivery 5-10 km</span>
      </div>
    </div>

    <!-- Sliding Banner -->
    <div class="banner-special" id="banner-slider">
      <div class="special-tag">TODAY'S SPECIAL</div>
      <div class="banner-title" id="banner-title">Chicken Biryani</div>
      <div class="banner-price" id="banner-price">₹180</div>
      <button class="btn-order-now" id="banner-btn" onclick="addToCart(1)">ORDER NOW</button>
    </div>

    <!-- Discount Coupon -->
    <div style="background: #1f1f1f; border: 1px dashed var(--primary-red); border-radius: 10px; padding: 10px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <div style="font-weight: bold; color: var(--primary-red); font-size: 0.85rem;">OFFER: WELCOME50</div>
        <div style="font-size: 0.75rem; color: var(--text-gray);">Get ₹50 OFF on orders above ₹299</div>
      </div>
      <button style="background: var(--primary-red); color: white; border: none; padding: 5px 10px; border-radius: 5px; font-size: 0.75rem; font-weight: bold; cursor: pointer;" onclick="alert('कूपन लागू हो गया है!')">APPLY</button>
    </div>

    <div class="section-title">
      <span>POPULAR ITEMS</span>
    </div>
    <div class="horizontal-scroll">
      ${populars.map(item => `
        <div class="pop-card">
          <img src="${item.img}" alt="${item.name}">
          <div class="pop-title">${item.name}</div>
          <div class="pop-price">₹${item.price}</div>
          <button class="btn-add" style="margin-top:6px; padding:3px 8px; font-size:0.7rem;" onclick="addToCart(${item.id})">ADD +</button>
        </div>
      `).join('')}
    </div>
  `;

  startBannerSlider();
}

// Banner Auto Slider
let bannerIndex = 0;
function startBannerSlider() {
  const specials = restaurantMenu.filter(i => i.isSpec || i.price >= 100);
  bannerTimer = setInterval(() => {
    const titleEl = document.getElementById('banner-title');
    const priceEl = document.getElementById('banner-price');
    const btnEl = document.getElementById('banner-btn');
    if (titleEl && priceEl && btnEl) {
      bannerIndex = (bannerIndex + 1) % specials.length;
      const curr = specials[bannerIndex];
      titleEl.innerText = curr.name;
      priceEl.innerText = `₹${curr.price}`;
      btnEl.setAttribute('onclick', `addToCart(${curr.id})`);
    }
  }, 3000);
}

// 5. Render Menu Screen
function renderMenuScreen(container, activeCat) {
  const categories = ['All', 'Fast Food', 'Rolls', 'Main Course', 'Drinks'];
  
  const filtered = (activeCat === 'All') 
    ? restaurantMenu 
    : restaurantMenu.filter(item => item.category === activeCat);

  container.innerHTML = `
    <div class="category-pills">
      ${categories.map(cat => `
        <button class="pill ${cat === activeCat ? 'active' : ''}" onclick="filterCategory('${cat}')">${cat}</button>
      `).join('')}
    </div>
    <div class="menu-list">
      ${filtered.map(item => `
        <div class="item-card">
          <img src="${item.img}" alt="${item.name}">
          <div class="item-info">
            <h4>${item.name}</h4>
            <p>₹${item.price}</p>
          </div>
          <button class="btn-add" onclick="addToCart(${item.id})">ADD +</button>
        </div>
      `).join('')}
    </div>
  `;
}

function filterCategory(cat) {
  const container = document.getElementById('app-container');
  renderMenuScreen(container, cat);
}

// 6. Cart Logic
function addToCart(id) {
  const item = restaurantMenu.find(i => i.id === id);
  const existing = cart.find(i => i.id === id);
  if(existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  updateBadge();
}

function updateBadge() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById('cart-badge').innerText = count;
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if(item) {
    item.qty += delta;
    if(item.qty <= 0) {
      cart = cart.filter(i => i.id !== id);
    }
  }
  updateBadge();
  renderCartScreen(document.getElementById('app-container'));
}

function renderCartScreen(container) {
  if(cart.length === 0) {
    container.innerHTML = `<p style="text-align:center; padding:40px; color:var(--text-gray);">आपकी कार्ट खाली है!</p>`;
    return;
  }

  const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
  const delivery = 30;
  const total = subtotal + delivery;

  container.innerHTML = `
    <div class="menu-list">
      ${cart.map(item => `
        <div class="item-card">
          <img src="${item.img}" alt="${item.name}">
          <div class="item-info">
            <h4>${item.name}</h4>
            <p>₹${item.price * item.qty}</p>
          </div>
          <div class="qty-ctrl">
            <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
            <span>${item.qty}</span>
            <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
          </div>
        </div>
      `).join('')}
    </div>

    <div class="price-summary">
      <div class="summary-row"><span>Subtotal</span><span>₹${subtotal}</span></div>
      <div class="summary-row"><span>Delivery Charge</span><span>₹${delivery}</span></div>
      <div class="summary-row total"><span>Total Amount</span><span>₹${total}</span></div>
    </div>

    <button class="btn-red-large" onclick="renderCheckoutScreen()">PROCEED TO CHECKOUT</button>
  `;
}

// 7. Checkout Screen
function renderCheckoutScreen() {
  const container = document.getElementById('app-container');
  const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
  const total = subtotal + 30;

  container.innerHTML = `
    <h3 style="margin-bottom:15px; color:var(--primary-red);">DELIVERY DETAILS</h3>
    
    <div class="input-group">
      <label>Full Name</label>
      <input type="text" id="cust-name" placeholder="Enter Name">
    </div>
    
    <div class="input-group">
      <label>Mobile Number</label>
      <input type="tel" id="cust-phone" placeholder="Enter Mobile Number">
    </div>

    <div class="input-group">
      <label>Full Delivery Address</label>
      <textarea id="cust-address" rows="3" placeholder="Street, Landmark, House No."></textarea>
    </div>

    <div class="price-summary">
      <div class="summary-row total"><span>Total Payable</span><span>₹${total}</span></div>
    </div>

    <button class="btn-red-large" onclick="processOrder(${total})">PLACE ORDER ON WHATSAPP</button>
  `;
}

function processOrder(total) {
  const name = document.getElementById('cust-name').value;
  const phone = document.getElementById('cust-phone').value;
  const address = document.getElementById('cust-address').value;

  if(!name || !phone || !address) {
    alert("कृपया नाम, फ़ोन नंबर और पता भरें!");
    return;
  }

  let msg = `*NEW ORDER - S&A FAMILY RESTAURANT*\n\n`;
  msg += `*Name:* ${name}\n*Phone:* ${phone}\n*Address:* ${address}\n\n`;
  msg += `*ITEMS:*\n`;
  cart.forEach(i => {
    msg += `- ${i.name} x ${i.qty} = ₹${i.price * i.qty}\n`;
  });
  msg += `\n*TOTAL PAYABLE:* ₹${total}`;

  const url = `https://wa.me/${myWhatsAppNumber}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

// 8. Auth / Profile Screen
function renderProfileScreen(container) {
  const user = auth.currentUser;
  
  if(user) {
    container.innerHTML = `
      <div style="text-align:center; padding:20px;">
        <i class="fa-solid fa-circle-user" style="font-size:3rem; color:var(--primary-red);"></i>
        <h3 style="margin-top:10px;">${user.email}</h3>
        <button class="btn-red-large" style="margin-top:20px;" onclick="auth.signOut()">LOGOUT</button>
      </div>
    `;
  } else {
    container.innerHTML = `
      <h3 style="margin-bottom:15px; color:var(--primary-red);">LOGIN / SIGN UP</h3>
      <div class="input-group">
        <label>Email</label>
        <input type="email" id="auth-email" placeholder="Email">
      </div>
      <div class="input-group">
        <label>Password</label>
        <input type="password" id="auth-pass" placeholder="Password">
      </div>
      <button class="btn-red-large" onclick="handleLogin()">LOGIN</button>
      <button class="btn-red-large" style="background:#333; margin-top:10px;" onclick="handleSignUp()">CREATE ACCOUNT</button>
    `;
  }
}

function handleLogin() {
  const email = document.getElementById('auth-email').value;
  const pass = document.getElementById('auth-pass').value;

  if (!email || !pass) {
    alert("कृपया ईमेल और पासवर्ड दर्ज करें!");
    return;
  }

  auth.signInWithEmailAndPassword(email, pass)
    .then(() => {
      alert("लॉगिन सफल रहा!");
      switchTab('home');
    })
    .catch(err => alert("लॉगिन में त्रुटि: " + err.message));
}

function handleSignUp() {
  const email = document.getElementById('auth-email').value;
  const pass = document.getElementById('auth-pass').value;

  if (!email || !pass) {
    alert("कृपया ईमेल और पासवर्ड दर्ज करें!");
    return;
  }

  auth.createUserWithEmailAndPassword(email, pass)
    .then(() => {
      alert("अकाउंट सफलतापूर्वक बन गया!");
      switchTab('home');
    })
    .catch(err => alert(err.message));
}

auth.onAuthStateChanged(() => {
  switchTab('home');
});

// App Start
switchTab('home');
