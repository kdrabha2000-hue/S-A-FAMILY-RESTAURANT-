const restaurantMenu = [
    { id: 1, name: "Chicken Biryani", price: 180, category: "Main Course", img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200" },
    { id: 2, name: "Veg Thali", price: 120, category: "Main Course", img: "https://images.unsplash.com/photo-1613378026884-6faf87337f6d?w=200" },
    { id: 3, name: "Fried Rice", price: 100, category: "Main Course", img: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=200" },
    { id: 4, name: "Butter Chicken", price: 150, category: "Main Course", img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=200" },
    { id: 5, name: "Chilli Chicken", price: 120, category: "Main Course", img: "https://images.unsplash.com/photo-1525607551316-4a8e16d1f960?w=200" },
    { id: 6, name: "Chicken Roll", price: 90, category: "Rolls", img: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=200" },
    { id: 7, name: "Veg Roll", price: 50, category: "Rolls", img: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=200" },
    { id: 8, name: "Chicken Momos", price: 60, category: "Fast Food", img: "https://images.unsplash.com/photo-1625220194771-7eb5a3a670b2?w=200" },
    { id: 9, name: "Cold Coffee", price: 80, category: "Drinks", img: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=200" }
];

let cart = [];
let user = null;
let activeOrdersList = [];

document.addEventListener('DOMContentLoaded', () => {
    switchTab('home');
});

function switchTab(screenName, btnElement) {
    if (btnElement) {
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

function renderHomeScreen(container) {
    container.innerHTML = `
        <div class="hero-banner">
            <div>
                <span class="hero-tag">TRADITIONAL</span>
                <div class="hero-title">Chicken Biryani</div>
                <div class="hero-price">₹180</div>
                <button class="btn-add" onclick="addToCart(1)">ORDER NOW</button>
            </div>
            <img src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200" class="hero-img" alt="Biryani">
        </div>

        <div class="section-head">
            <h3>POPULAR ITEMS</h3>
        </div>
        <div id="home-menu-list"></div>
    `;
    renderItemsList(restaurantMenu.slice(0, 5), 'home-menu-list');
}

function renderMenuScreen(container) {
    container.innerHTML = `
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
            <img src="${item.img}" class="item-img" alt="${item.name}">
            <div class="item-info">
                <h4>${item.name}</h4>
                <p>₹${item.price}</p>
            </div>
            <button class="btn-add" onclick="addToCart(${item.id})">ADD +</button>
        </div>
    `).join('');
}

let currentCustomItem = null;

function addToCart(id) {
    const item = restaurantMenu.find(i => i.id === id);
    if (item.customizable) {
        openCustomModal(item);
    } else {
        addItemToCartList(item, item.price, "");
    }
}

function openCustomModal(item) {
    currentCustomItem = item;
    const modal = document.createElement('div');
    modal.id = 'custom-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <h3 style="margin-top:0;">Customize ${item.name}</h3>
            <div class="modal-option">
                <label><input type="checkbox" id="opt-extra"> Extra Cheese / Gravy</label>
                <span>+₹30</span>
            </div>
            <div class="modal-option">
                <label>Spicy Level:</label>
                <select id="opt-spice" style="background:#000; color:#fff; border:1px solid #333; padding:4px;">
                    <option value="Normal">Normal</option>
                    <option value="Medium">Medium</option>
                    <option value="Extra Spicy">Extra Spicy</option>
                </select>
            </div>
            <div style="display:flex; gap:10px; margin-top:20px;">
                <button class="btn-full" style="background:#444;" onclick="closeModal()">Cancel</button>
                <button class="btn-full" onclick="confirmCustomization()">Add to Cart</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function closeModal() {
    const modal = document.getElementById('custom-modal');
    if (modal) modal.remove();
}

function confirmCustomization() {
    const extra = document.getElementById('opt-extra').checked;
    const spice = document.getElementById('opt-spice').value;
    
    let extraPrice = extra ? 30 : 0;
    let customNote = [];
    if (extra) customNote.push("Extra Cheese/Gravy");
    if (spice) customNote.push(`Spicy: ${spice}`);

    const finalPrice = currentCustomItem.price + extraPrice;
    const noteText = customNote.join(", ");

    addItemToCartList(currentCustomItem, finalPrice, noteText);
    closeModal();
}

function addItemToCartList(item, price, note) {
    const cartItemId = item.id + (note ? '-' + note : '');
    const existing = cart.find(i => i.cartItemId === cartItemId);
    
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({
            cartItemId: cartItemId,
            id: item.id,
            name: item.name + (note ? ` (${note})` : ''),
            price: price,
            img: item.img,
            qty: 1
        });
    }
    updateBadge();
    alert(`${item.name} Cart me add ho gaya!`);
}


function updateBadge() {
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    let badge = document.getElementById('cart-badge');
    if (!badge && count > 0) {
        const cartNav = document.querySelectorAll('.nav-item')[2];
        cartNav.style.position = 'relative';
        cartNav.innerHTML += `<span id="cart-badge" class="badge">${count}</span>`;
    } else if (badge) {
        badge.innerText = count;
    }
}

function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
        renderCartScreen(document.getElementById('app-container'));
        updateBadge();
    }
}

function renderCartScreen(container) {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const delivery = subtotal > 0 ? 50 : 0;
    const total = subtotal + delivery;

    container.innerHTML = `
        <h3>YOUR CART</h3>
        ${cart.map(item => `
            <div class="item-card">
                <img src="${item.img}" class="item-img" alt="${item.name}">
                <div class="item-info">
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
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;"><span>Item Total</span><span>₹${subtotal}</span></div>
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;"><span>Delivery Charge</span><span>₹${delivery}</span></div>
            <hr style="border-color:var(--card-border);">
            <div style="display:flex; justify-content:space-between; font-weight:bold; font-size:1.1rem; margin-top:8px;"><span>Grand Total</span><span>₹${total}</span></div>
        </div>
        
        <button class="btn-full" onclick="startCheckout()">PROCEED TO CHECKOUT</button>
    `;
}

function startCheckout() {
    if (user) {
        showCheckoutDetailsScreen();
    } else {
        showRegisterScreen();
    }
}

function showRegisterScreen() {
    const container = document.getElementById('app-container');
    container.innerHTML = `
        <h3>REGISTER / LOGIN</h3>
        <div class="form-card">
            <label>Full Name</label>
            <input type="text" id="reg-name" class="input-box" placeholder="Enter Full Name">
            <label>Phone Number</label>
            <input type="tel" id="reg-phone" class="input-box" placeholder="Enter Phone Number">
            <button class="btn-full" onclick="saveUserAndProceed()">REGISTER & CONTINUE</button>
        </div>
    `;
}

function saveUserAndProceed() {
    const name = document.getElementById('reg-name').value;
    const phone = document.getElementById('reg-phone').value;
    if (name && phone) {
        user = { name, phone };
        showCheckoutDetailsScreen();
    } else {
        alert("Please enter Name and Phone number");
    }
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
        </div>
        
        <div class="form-card">
            <label>Delivery Address</label>
            <input type="text" id="del-address" class="input-box" placeholder="House No, Landmark, Area">
        </div>
        
        <div class="form-card">
            <label>Payment Method</label><br>
            <input type="radio" name="pay" id="upi" checked> <label for="upi">UPI / Online Payment</label><br>
            <input type="radio" name="pay" id="cod"> <label for="cod">Cash on Delivery</label>
        </div>
        
        <button class="btn-full" onclick="placeFinalOrder(${total})">PLACE ORDER NOW</button>
    `;
}

function placeFinalOrder(total) {
    const address = document.getElementById('del-address').value;
    if (!address) {
        alert('Please enter delivery address!');
        return;
    }

    const orderId = Math.floor(100000 + Math.random() * 900000);
    const newOrder = { id: orderId, items: [...cart], total, status: 'Order Placed' };
    activeOrdersList.push(newOrder);

    let message = `*NEW ORDER - S&A FAMILY RESTAURANT*%0A`;
    message += `*Order ID:* %23${orderId}%0A`;
    message += `*Customer:* ${user.name} (${user.phone})%0A`;
    message += `*Address:* ${address}%0A%0A`;
    message += `*Items:*%0A`;
    cart.forEach(i => { message += `- ${i.name} x ${i.qty} = ₹${i.price * i.qty}%0A`; });
    message += `%0A*Total Amount:* ₹${total}`;

    cart = [];
    updateBadge();

    const myWhatsAppNumber = "919365779088";
    window.location.href = `https://wa.me/${myWhatsAppNumber}?text=${message}`;
}

function renderOrdersScreen(container) {
    container.innerHTML = `
        <h3>MY ORDERS</h3>
        ${activeOrdersList.length === 0 ? '<p style="color:var(--text-muted)">No active orders.</p>' : ''}
        ${activeOrdersList.map(o => `
            <div class="form-card">
                <h4>Order #${o.id} <span style="color:var(--primary-red); font-size:0.8rem; float:right;">${o.status}</span></h4>
                <p>${o.items.map(i => `${i.name} x${i.qty}`).join(', ')}</p>
                <b>Total: ₹${o.total}</b>
            </div>
        `).join('')}
    `;
}

function renderProfileScreen(container) {
    if (!user) {
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
const restaurantMenu = [
    { id: 1, name: "Chicken Biryani", price: 180, category: "Main Course", img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200", customizable: true },
    { id: 2, name: "Veg Thali", price: 120, category: "Main Course", img: "https://images.unsplash.com/photo-1613378026884-6faf87337f6d?w=200" },
    { id: 3, name: "Fried Rice", price: 100, category: "Main Course", img: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=200" },
    { id: 4, name: "Butter Chicken", price: 150, category: "Main Course", img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=200", customizable: true },
    { id: 5, name: "Chilli Chicken", price: 120, category: "Main Course", img: "https://images.unsplash.com/photo-1525607551316-4a8e16d1f960?w=200" },
    { id: 6, name: "Chicken Roll", price: 90, category: "Rolls", img: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=200", customizable: true },
    { id: 7, name: "Veg Roll", price: 50, category: "Rolls", img: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=200" },
    { id: 8, name: "Chicken Momos", price: 60, category: "Fast Food", img: "https://images.unsplash.com/photo-1625220194771-7eb5a3a670b2?w=200" },
    { id: 9, name: "Cold Coffee", price: 80, category: "Drinks", img: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=200" }
];
