// Complete Restaurant Menu Data
const restaurantMenu = [
    { id: 1, name: "Chicken Biryani", price: 180, category: "Main Course", img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200" },
    { id: 2, name: "Veg Thali", price: 120, category: "Main Course", img: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=200" },
    { id: 3, name: "Fried Rice", price: 100, category: "Main Course", img: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=200" },
    { id: 4, name: "Butter Chicken", price: 150, category: "Main Course", img: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=200" },
    { id: 5, name: "Chilli Chicken", price: 120, category: "Main Course", img: "https://images.unsplash.com/photo-1525607551316-4a8e16d18816?w=200" },
    { id: 6, name: "Chicken Roll", price: 90, category: "Rolls", img: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=200" },
    { id: 7, name: "Veg Roll", price: 50, category: "Rolls", img: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=200" },
    { id: 8, name: "Chicken Momos", price: 60, category: "Fast Food", img: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=200" },
    { id: 9, name: "Cold Coffee", price: 80, category: "Drinks", img: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=200" }
];

let cart = [];
let user = null;
let activeOrdersList = [];

document.addEventListener("DOMContentLoaded", () => {
    switchTab('home');
});

function switchTab(screenName, btnElement) {
    if(btnElement) {
        document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
        btnElement.classList.add('active');
    }

    const container = document.getElementById('app-container');

    if (screenName === 'home') renderHomeScreen(container);
    if (screenName === 'menu') renderMenuScreen(container);
    if (screenName === 'cart') renderCartScreen(container);
    if (screenName === 'orders') renderOrdersScreen(container);
    if (screenName === 'profile') renderProfileScreen(container);
}

// 1. HOME SCREEN
function renderHomeScreen(container) {
    container.innerHTML = `
        <div class="hero-banner">
            <div class="hero-text">
                <span>TODAY'S SPECIAL</span>
                <h2>Chicken Biryani</h2>
                <div class="hero-price">₹180</div>
                <button class="btn-red" onclick="addToCart(1)">ORDER NOW</button>
            </div>
            <img src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200" style="width:100px; height:100px; border-radius:50%; object-fit:cover;">
        </div>

        <h3 style="margin-bottom:10px;">POPULAR ITEMS</h3>
        <div id="home-menu-list"></div>
    `;
    renderItemsList(restaurantMenu.slice(0, 5), 'home-menu-list');
}

// 2. MENU SCREEN
function renderMenuScreen(container) {
    container.innerHTML = `
        <div class="category-pills">
            <button class="pill-btn active" onclick="filterCategory('All', this)">All</button>
            <button class="pill-btn" onclick="filterCategory('Main Course', this)">Main Course</button>
            <button class="pill-btn" onclick="filterCategory('Rolls', this)">Rolls</button>
            <button class="pill-btn" onclick="filterCategory('Fast Food', this)">Fast Food</button>
            <button class="pill-btn" onclick="filterCategory('Drinks', this)">Drinks</button>
        </div>
        <div id="full-menu-list"></div>
    `;
    renderItemsList(restaurantMenu, 'full-menu-list');
}

function filterCategory(cat, btn) {
    document.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filtered = cat === 'All' ? restaurantMenu : restaurantMenu.filter(i => i.category === cat);
    renderItemsList(filtered, 'full-menu-list');
}

function renderItemsList(items, targetId) {
    const list = document.getElementById(targetId);
    list.innerHTML = items.map(item => `
        <div class="item-card">
            <img src="${item.img}" class="item-img">
            <div class="item-details">
                <h4>${item.name}</h4>
                <p>₹${item.price}</p>
            </div>
            <button class="btn-add" onclick="addToCart(${item.id})">ADD +</button>
        </div>
    `).join('');
}

// CART SYSTEM
function addToCart(id) {
    const item = restaurantMenu.find(i => i.id === id);
    const existing = cart.find(i => i.id === id);
    if(existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...item, qty: 1 });
    }
    updateBadge();
    alert(`${item.name} Added to Cart!`);
}

function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if(item) {
        item.qty += delta;
        if(item.qty <= 0) cart = cart.filter(i => i.id !== id);
    }
    updateBadge();
    renderCartScreen(document.getElementById('app-container'));
}

function updateBadge() {
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    document.getElementById('cart-badge').innerText = totalQty;
}

// 3. CART & CHECKOUT SCREEN
function renderCartScreen(container) {
    if (cart.length === 0) {
        container.innerHTML = `<h3>YOUR CART</h3><p style="text-align:center; color:#aaa; margin-top:40px;">Your Cart is Empty</p>`;
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const delivery = 50;
    const total = subtotal + delivery;

    container.innerHTML = `
        <h3>YOUR CART</h3>
        ${cart.map(item => `
            <div class="item-card">
                <img src="${item.img}" class="item-img">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>₹${item.price * item.qty}</p>
                </div>
                <div class="qty-ctrl">
                    <button class="btn-qty" onclick="changeQty(${item.id}, -1)">-</button>
                    <span>${item.qty}</span>
                    <button class="btn-qty" onclick="changeQty(${item.id}, 1)">+</button>
                </div>
            </div>
        `).join('')}

        <div class="form-card" style="margin-top:20px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                <span>Subtotal</span><span>₹${subtotal}</span>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                <span>Delivery Charge</span><span>₹${delivery}</span>
            </div>
            <hr style="border-color:var(--card-border);">
            <div style="display:flex; justify-content:space-between; font-weight:bold; font-size:1.1rem; color:var(--primary-red); margin-bottom:15px;">
                <span>TOTAL AMOUNT</span><span>₹${total}</span>
            </div>
            <button class="btn-full" onclick="startCheckout()">PROCEED TO CHECKOUT ></button>
        </div>
    `;
}

// CHECKOUT & REGISTER FLOW
function startCheckout() {
    if(!user) {
        showRegisterScreen();
    } else {
        showCheckoutDetailsScreen();
    }
}

function showRegisterScreen() {
    const container = document.getElementById('app-container');
    container.innerHTML = `
        <h3>CHECKOUT / REGISTER</h3>
        <div class="form-card">
            <label>Name</label>
            <input type="text" id="reg-name" class="input-box" placeholder="Enter Full Name">
            
            <label>Mobile Number</label>
            <input type="tel" id="reg-phone" class="input-box" placeholder="10-digit Mobile Number" maxlength="10">
            
            <button class="btn-full" onclick="saveUser()">REGISTER & CONTINUE</button>
        </div>
    `;
}

function saveUser() {
    const name = document.getElementById('reg-name').value;
    const phone = document.getElementById('reg-phone').value;

    if(!name || phone.length !== 10) {
        alert("Please enter a valid Name & 10-digit Phone Number!");
        return;
    }

    user = { name, phone };
    showCheckoutDetailsScreen();
}

function showCheckoutDetailsScreen() {
    const container = document.getElementById('app-container');
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const total = subtotal + 50;

    container.innerHTML = `
        <h3>CHECKOUT DETAILS</h3>
        <div class="form-card">
            <p><b>Name:</b> ${user.name}</p>
            <p><b>Phone:</b> ${user.phone}</p>
            
            <label>Delivery Address</label>
            <input type="text" id="del-address" class="input-box" placeholder="House No, Landmark, Area">

            <label>Payment Method</label>
            <div style="margin:10px 0;">
                <input type="radio" name="pay" id="upi" checked> <label for="upi">UPI / Online Payment</label><br>
                <input type="radio" name="pay" id="cod"> <label for="cod">Cash on Delivery</label>
            </div>

            <button class="btn-full" onclick="placeFinalOrder(${total})">PLACE ORDER NOW</button>
        </div>
    `;
}

function placeFinalOrder(total) {
    const address = document.getElementById('del-address').value;
    if(!address) {
        alert("Please enter delivery address!");
        return;
    }

    const orderId = Math.floor(100000 + Math.random() * 900000);
    const newOrder = {
        id: orderId,
        items: [...cart],
        total: total,
        address: address,
        status: "Order Placed"
    };

    activeOrdersList.push(newOrder);

    // Send WhatsApp Message
    let itemListStr = cart.map(i => `• ${i.name} (x${i.qty}) - ₹${i.price * i.qty}`).join('%0A');
    let msg = `*NEW ORDER - S%26A RESTAURANT*%0A%0A` +
        `Order ID: #${orderId}%0A` +
        `Customer: ${user.name}%0A` +
        `Phone: ${user.phone}%0A` +
        `Address: ${address}%0A%0A` +
        `*Items:*%0A${itemListStr}%0A%0A` +
        `*Total Payable: ₹${total}*`;

    window.open(`https://wa.me/918453270362?text=${msg}`, '_blank');

    cart = [];
    updateBadge();
    switchTab('orders');
}

// 4. ORDERS TRACKING SCREEN
function renderOrdersScreen(container) {
    if(activeOrdersList.length === 0) {
        container.innerHTML = `<h3>YOUR ORDERS</h3><p style="text-align:center; color:#aaa; margin-top:40px;">No Active Orders Found</p>`;
        return;
    }

    container.innerHTML = `
        <h3>YOUR LIVE ORDERS</h3>
        ${activeOrdersList.map(ord => `
            <div class="form-card">
                <h4>Order #${ord.id}</h4>
                <p>Total: <b>₹${ord.total}</b></p>
                <p style="color:var(--text-gray); font-size:0.85rem;">Address: ${ord.address}</p>
                <hr style="border-color:var(--card-border);">
                <p style="color:var(--primary-red); font-weight:bold;">Status: ${ord.status}</p>
            </div>
        `).join('')}
    `;
}

// 5. PROFILE SCREEN
function renderProfileScreen(container) {
    if(!user) {
        container.innerHTML = `
            <h3>PROFILE</h3>
            <div class="form-card">
                <p>You are not logged in.</p>
                <button class="btn-full" onclick="showRegisterScreen()">LOGIN / REGISTER</button>
            </div>
        `;
    } else {
        container.innerHTML = `
            <h3>PROFILE</h3>
            <div class="form-card">
                <p><b>Name:</b> ${user.name}</p>
                <p><b>Phone:</b> ${user.phone}</p>
                <button class="btn-full" onclick="user=null; switchTab('profile');">LOGOUT</button>
            </div>
        `;
    }
}
