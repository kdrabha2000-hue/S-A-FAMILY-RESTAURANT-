const restaurantMenu = [
  // Specials / Main Course
  { id: 1, name: "Chicken Biryani", price: 180, category: "Main Course", isSpecial: true, img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200" },
  { id: 2, name: "Butter Chicken Full", price: 380, category: "Main Course", isSpecial: true, img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=200" },
  { id: 3, name: "Butter Chicken Half", price: 200, category: "Main Course", img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=200" },
  { id: 4, name: "Chicken Curry Full", price: 240, category: "Main Course", img: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=200" },
  { id: 5, name: "Chicken Curry Half", price: 140, category: "Main Course", img: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=200" },
  { id: 6, name: "Mutton Curry Full", price: 400, category: "Main Course", isSpecial: true, img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=200" },
  { id: 7, name: "Mutton Curry Half", price: 220, category: "Main Course", img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=200" },
  { id: 8, name: "Mutton Rogan Josh", price: 300, category: "Main Course", img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=200" },
  { id: 9, name: "Pork Curry Full", price: 280, category: "Main Course", img: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=200" },
  { id: 10, name: "Pork Curry Half", price: 150, category: "Main Course", img: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=200" },
  { id: 11, name: "Pork Masala", price: 300, category: "Main Course", img: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=200" },
  { id: 12, name: "Paneer Masala", price: 200, category: "Main Course", img: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=200" },
  { id: 13, name: "Shahi Paneer", price: 260, category: "Main Course", img: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=200" },
  { id: 14, name: "Palak Paneer", price: 200, category: "Main Course", img: "https://images.unsplash.com/photo-1613378026884-6faf73376d7e?w=200" },
  { id: 15, name: "Mix Veg", price: 180, category: "Main Course", img: "https://images.unsplash.com/photo-1613378026884-6faf73376d7e?w=200" },
  { id: 16, name: "Aloo Gobi", price: 160, category: "Main Course", img: "https://images.unsplash.com/photo-1613378026884-6faf73376d7e?w=200" },

  // Breads & Rice
  { id: 17, name: "Plain Tawa Roti", price: 10, category: "Main Course", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200" },
  { id: 18, name: "Tawa Roti Butter", price: 15, category: "Main Course", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200" },
  { id: 19, name: "Tandoori Roti", price: 25, category: "Main Course", img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=200" },
  { id: 20, name: "Tandoori Butter Roti", price: 35, category: "Main Course", img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=200" },
  { id: 21, name: "Plain Naan", price: 60, category: "Main Course", img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=200" },
  { id: 22, name: "Butter Naan", price: 80, category: "Main Course", img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=200" },
  { id: 23, name: "Lachha Paratha", price: 30, category: "Main Course", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200" },
  { id: 24, name: "Plain Rice", price: 140, category: "Main Course", img: "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=200" },
  { id: 25, name: "Jeera Rice", price: 100, category: "Main Course", img: "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=200" },

  // Dal & Chole
  { id: 26, name: "Plain Dal", price: 70, category: "Main Course", img: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200" },
  { id: 27, name: "Dal Fry", price: 110, category: "Main Course", img: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200" },
  { id: 28, name: "Dal Tadka", price: 140, category: "Main Course", img: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200" },
  { id: 29, name: "Dal Makhani", price: 200, category: "Main Course", img: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200" },
  { id: 30, name: "Chole Masala", price: 220, category: "Main Course", img: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200" },

  // Breakfast & Snacks
  { id: 31, name: "Roti Veg", price: 40, category: "Breakfast & Snacks", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200" },
  { id: 32, name: "Puri Veg", price: 40, category: "Breakfast & Snacks", img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=200" },
  { id: 33, name: "Paratha Veg", price: 40, category: "Breakfast & Snacks", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200" },
  { id: 34, name: "Aloo Paratha", price: 50, category: "Breakfast & Snacks", isSpecial: true, img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200" },
  { id: 35, name: "Paneer Paratha", price: 100, category: "Breakfast & Snacks", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200" },
  { id: 36, name: "Cheese Paratha", price: 120, category: "Breakfast & Snacks", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200" },
  { id: 37, name: "Sandwich Veg", price: 50, category: "Breakfast & Snacks", img: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=200" },
  { id: 38, name: "Sandwich Non-Veg", price: 80, category: "Breakfast & Snacks", img: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=200" },
  { id: 39, name: "Bread Butter", price: 60, category: "Breakfast & Snacks", img: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=200" },
  { id: 40, name: "Cornflakes", price: 80, category: "Breakfast & Snacks", img: "https://images.unsplash.com/photo-1521483451569-e33803c0330c?w=200" },

  // Fast Food & Momos
  { id: 41, name: "Veg Momo Full", price: 50, category: "Fast Food", isSpecial: true, img: "https://images.unsplash.com/photo-1625201941771-7eb5a3a67d02?w=200" },
  { id: 42, name: "Veg Momo Half", price: 30, category: "Fast Food", img: "https://images.unsplash.com/photo-1625201941771-7eb5a3a67d02?w=200" },
  { id: 43, name: "Chicken Momo Full", price: 70, category: "Fast Food", isSpecial: true, img: "https://images.unsplash.com/photo-1625201941771-7eb5a3a67d02?w=200" },
  { id: 44, name: "Chicken Momo Half", price: 40, category: "Fast Food", img: "https://images.unsplash.com/photo-1625201941771-7eb5a3a67d02?w=200" },
  { id: 45, name: "Pork Momo Full", price: 80, category: "Fast Food", img: "https://images.unsplash.com/photo-1625201941771-7eb5a3a67d02?w=200" },
  { id: 46, name: "Pork Momo Half", price: 50, category: "Fast Food", img: "https://images.unsplash.com/photo-1625201941771-7eb5a3a67d02?w=200" },
  { id: 47, name: "Paneer Momo Full", price: 100, category: "Fast Food", img: "https://images.unsplash.com/photo-1625201941771-7eb5a3a67d02?w=200" },
  { id: 48, name: "Paneer Momo Half", price: 60, category: "Fast Food", img: "https://images.unsplash.com/photo-1625201941771-7eb5a3a67d02?w=200" },
  { id: 49, name: "Cheese Momo Full", price: 120, category: "Fast Food", img: "https://images.unsplash.com/photo-1625201941771-7eb5a3a67d02?w=200" },
  { id: 50, name: "Cheese Momo Half", price: 70, category: "Fast Food", img: "https://images.unsplash.com/photo-1625201941771-7eb5a3a67d02?w=200" },
  
  // Chowmein & Fried Rice
  { id: 51, name: "Veg Chow Full", price: 50, category: "Fast Food", img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200" },
  { id: 52, name: "Veg Chow Half", price: 30, category: "Fast Food", img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200" },
  { id: 53, name: "Chicken Chow Full", price: 100, category: "Fast Food", img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200" },
  { id: 54, name: "Chicken Chow Half", price: 60, category: "Fast Food", img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200" },
  { id: 55, name: "Veg Roll", price: 40, category: "Fast Food", img: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=200" },
  { id: 56, name: "Chicken Roll", price: 80, category: "Fast Food", isSpecial: true, img: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=200" },
  { id: 57, name: "Pork Roll", price: 100, category: "Fast Food", img: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=200" },

  // Starters & Tandoori
  { id: 58, name: "Tandoori Chicken Full", price: 500, category: "Fast Food", isSpecial: true, img: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=200" },
  { id: 59, name: "Tandoori Chicken Half", price: 300, category: "Fast Food", img: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=200" },
  { id: 60, name: "Chilli Chicken Full", price: 200, category: "Fast Food", img: "https://images.unsplash.com/photo-1525607551316-4a8e16d1f968?w=200" },
  { id: 61, name: "Chilli Chicken Half", price: 110, category: "Fast Food", img: "https://images.unsplash.com/photo-1525607551316-4a8e16d1f968?w=200" },

  // Tea, Coffee & Beverages
  { id: 62, name: "Black Tea", price: 10, category: "Drinks", img: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=200" },
  { id: 63, name: "Milk Tea", price: 20, category: "Drinks", img: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=200" },
  { id: 64, name: "Ice Tea", price: 35, category: "Drinks", img: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=200" },
  { id: 65, name: "Black Coffee", price: 20, category: "Drinks", img: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=200" },
  { id: 66, name: "Milk Coffee", price: 40, category: "Drinks", img: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=200" },
  { id: 67, name: "Cold Coffee", price: 70, category: "Drinks", isSpecial: true, img: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=200" },
  { id: 68, name: "Fresh Lime Water", price: 50, category: "Drinks", img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=200" },
  { id: 69, name: "Apple Juice", price: 100, category: "Drinks", img: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=200" },
  { id: 70, name: "Mango Juice", price: 100, category: "Drinks", img: "https://images.unsplash.com/photo-1546173159-315724a31696?w=200" },

  // Desserts
  { id: 71, name: "Gulab Jamun", price: 50, category: "Dessert", img: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=200" },
  { id: 72, name: "Rasgulla", price: 50, category: "Dessert", img: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=200" },
  { id: 73, name: "Ice Cream", price: 70, category: "Dessert", img: "https://images.unsplash.com/photo-1567206563064-6f60f4078b57?w=200" }
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
  const specials = restaurantMenu.filter(i => i.isSpecial);
  container.innerHTML = `
    <div class="header-top">
      <div class="brand-title">S&A FAMILY RESTAURANT</div>
      <div class="tagline">Freshly Made, Especially for You</div>
    </div>
    
    <div class="info-box">
      <div><i class="fa-solid fa-location-dot"></i> U.T. ROAD BENGBARI, DIST: UDALGURI 784523</div>
      <div><i class="fa-solid fa-clock"></i> 8:00 AM - 9:00 PM (Monday Closed)</div>
      <div><i class="fa-solid fa-motorcycle"></i> Delivery Range: 5 - 12 KM</div>
    </div>

    <div class="banner">
      <div>
        <small style="color: #ffcdd2;">SPECIAL ITEM</small>
        <h3>Chicken Biryani</h3>
        <p class="price" style="margin: 5px 0;">₹180</p>
        <button class="btn-primary" onclick="addToCart(1)">ORDER NOW</button>
      </div>
      <img src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200" alt="Biryani">
    </div>

    <h4 style="margin: 15px 15px 5px 15px;">POPULAR & SPECIALS</h4>
    <div id="home-specials-list"></div>
  `;
  renderItemsList(specials, 'home-specials-list');
}

function renderMenuScreen(container) {
  container.innerHTML = `
    <h3 style="padding: 15px 15px 0 15px;">FULL MENU</h3>
    <div class="category-pills">
      <button class="pill active" onclick="filterCategory('All', this)">All</button>
      <button class="pill" onclick="filterCategory('Main Course', this)">Main Course / Dinner</button>
      <button class="pill" onclick="filterCategory('Breakfast & Snacks', this)">Breakfast & Snacks</button>
      <button class="pill" onclick="filterCategory('Fast Food', this)">Fast Food & Momos</button>
      <button class="pill" onclick="filterCategory('Drinks', this)">Tea & Beverages</button>
      <button class="pill" onclick="filterCategory('Dessert', this)">Desserts</button>
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
  if (!list) return;

  list.innerHTML = items.map(item => {
    const cartItem = cart.find(c => c.id === item.id);
    return `
      <div class="item-card">
        <img src="${item.img}" alt="${item.name}">
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
          <button class="btn-add" onclick="addToCart(${item.id})">ADD +</button>
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
  const currentTab = document.querySelector('.nav-item.active span').innerText.toLowerCase();
  switchTab(currentTab);
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
  const container = document.getElementById('app-container');
  const activeBtn = document.querySelector('.nav-item.active span');
  if (activeBtn) {
    const currentTab = activeBtn.innerText.toLowerCase();
    switchTab(currentTab);
  }
}

function renderCartScreen(container) {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const delivery = subtotal > 0 ? 40 : 0;
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
      <div style="padding: 15px; background: var(--card-bg); margin: 15px; border-radius:10px; border:1px solid var(--border-color);">
        <div style="display:flex; justify-content:space-between; margin-bottom:8px;"><span>Subtotal</span> <span>₹${subtotal}</span></div>
        <div style="display:flex; justify-content:space-between; margin-bottom:8px;"><span>Delivery Charge</span> <span>₹${delivery}</span></div>
        <hr style="border-color:var(--border-color); margin:10px 0;">
        <div style="display:flex; justify-content:space-between; font-weight:bold;"><span>TOTAL AMOUNT</span> <span class="price">₹${total}</span></div>
      </div>
      <div style="padding:0 15px;">
        <button class="btn-primary" style="padding:12px;" onclick="switchTab('checkout')">PROCEED TO CHECKOUT</button>
      </div>
    ` : '<p style="padding:20px; text-align:center; color:var(--text-gray);">Your Cart is Empty</p>'}
  `;
}

function renderCheckoutScreen(container) {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const delivery = 40;
  const total = subtotal + delivery;

  container.innerHTML = `
    <h3 style="padding: 15px;">CHECKOUT DETAILS</h3>
    <div style="padding: 15px;">
      <label style="font-size:12px; color:var(--text-gray);">Full Name *</label>
      <input type="text" id="cust-name" class="input-box" placeholder="Enter your full name">
      
      <label style="font-size:12px; color:var(--text-gray);">Mobile Number *</label>
      <input type="tel" id="cust-phone" class="input-box" placeholder="Enter mobile number">
      
      <label style="font-size:12px; color:var(--text-gray);">Delivery Address (Village/Town/Landmark) *</label>
      <textarea id="cust-address" class="input-box" rows="3" placeholder="Enter complete address"></textarea>

      <div style="background:var(--card-bg); padding:12px; border-radius:8px; margin-bottom:15px; border:1px solid var(--border-color);">
        <div style="font-size:12px; color:var(--text-gray);">UPI Payment ID</div>
        <div style="font-weight:bold; color:var(--primary-red); margin-top:2px;">6000026478@okbizaxis</div>
        <small style="color:var(--text-gray); font-size:11px;">You can pay via UPI or Cash on Delivery</small>
      </div>

      <div style="background:var(--card-bg); padding:12px; border-radius:8px; margin-bottom:15px; border:1px solid var(--border-color);">
        <div style="display:flex; justify-content:space-between;">
          <span>Total Amount Payable:</span>
          <strong class="price">₹${total}</strong>
        </div>
      </div>

      <button class="btn-primary" style="padding:12px;" onclick="placeFinalOrder(${total})">SEND ORDER ON WHATSAPP</button>
    </div>
  `;
}

function placeFinalOrder(total) {
  const name = document.getElementById('cust-name').value.trim();
  const phone = document.getElementById('cust-phone').value.trim();
  const address = document.getElementById('cust-address').value.trim();

  if (!name || !phone || !address) {
    alert('Please enter Name, Mobile Number and Complete Address!');
    return;
  }

  const orderId = Math.floor(100000 + Math.random() * 900000);
  activeOrdersList.push({ id: orderId, items: [...cart], total: total, status: 'Order Placed' });

  let message = `*NEW ORDER - S&A FAMILY RESTAURANT*\n`;
  message += `----------------------------------------\n`;
  message += `*Order ID:* %23${orderId}\n`;
  message += `*Customer Name:* ${name}\n`;
  message += `*Mobile Number:* ${phone}\n`;
  message += `*Delivery Address:* ${address}\n`;
  message += `----------------------------------------\n`;
  message += `*ORDERED ITEMS:*\n`;
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
    <h3 style="padding:15px;">RECENT ORDERS</h3>
    ${activeOrdersList.length === 0 ? '<p style="padding:15px; color:var(--text-gray);">No recent orders placed in this session.</p>' : 
      activeOrdersList.map(o => `
        <div style="background:var(--card-bg); margin:15px; padding:15px; border-radius:8px; border:1px solid var(--border-color);">
          <div style="display:flex; justify-content:space-between;">
            <strong>Order #${o.id}</strong>
            <span style="color:var(--primary-red);">${o.status}</span>
          </div>
          <div style="margin-top:8px; font-size:12px; color:var(--text-gray);">
            ${o.items.map(i => `${i.name} (${i.qty})`).join(', ')}
          </div>
          <div style="margin-top:10px; font-weight:bold;">Total Amount: ₹${o.total}</div>
        </div>
      `).join('')}
  `;
}

function renderProfileScreen(container) {
  container.innerHTML = `
    <h3 style="padding:15px;">RESTAURANT DETAILS</h3>
    <div style="padding:15px; background:var(--card-bg); margin:15px; border-radius:8px; border:1px solid var(--border-color);">
      <h4>S&A FAMILY RESTAURANT</h4>
      <p style="color:var(--text-gray); font-size:12px; margin-top:5px;">U.T. ROAD BENGBARI, DIST: UDALGURI 784523</p>
      <p style="color:var(--text-gray); font-size:12px; margin-top:5px;">Phone / WhatsApp: +91 8453270362</p>
      <p style="color:var(--text-gray); font-size:12px; margin-top:5px;">UPI ID: 6000026478@okbizaxis</p>
      <p style="color:var(--text-gray); font-size:12px; margin-top:5px;">Timing: 8:00 AM - 9:00 PM (Monday Closed)</p>
    </div>
  `;
}
