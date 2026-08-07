const menuData = [
    { id: 1, name: "Roti Veg", price: 40 },
    { id: 2, name: "Puri Veg", price: 40 },
    { id: 3, name: "Aloo Paratha", price: 50 },
    { id: 4, name: "Paneer Paratha", price: 100 },
    { id: 5, name: "Veg Chow Full", price: 50 },
    { id: 6, name: "Chicken Roll", price: 80 },
    { id: 7, name: "Veg Momo Full", price: 50 },
    { id: 8, name: "Chicken Momo Full", price: 70 },
    { id: 9, name: "Chicken Biryani", price: 180 },
    { id: 10, name: "Butter Chicken Full", price: 380 }
];

let cart = [];
let currentUser = null;
let activeOrder = null;

document.addEventListener("DOMContentLoaded", () => {
    renderApp('home');
});

function renderApp(screen) {
    const container = document.getElementById('main-content');
    
    if (screen === 'home') {
        container.innerHTML = `
            <h2>Popular Items</h2>
            <div id="menu-list"></div>
        `;
        renderMenuList();
    } else if (screen === 'menu') {
        container.innerHTML = `
            <h2>Full Menu</h2>
            <div id="menu-list"></div>
        `;
        renderMenuList();
    } else if (screen === 'cart') {
        renderCartScreen(container);
    } else if (screen === 'track') {
        renderTrackScreen(container);
    }
}

function renderMenuList() {
    const list = document.getElementById('menu-list');
    list.innerHTML = menuData.map(item => `
        <div class="card">
            <div class="item-info">
                <h4>${item.name}</h4>
                <p class="price">₹${item.price}</p>
            </div>
            <button class="btn-add" onclick="addToCart(${item.id})">ADD +</button>
        </div>
    `).join('');
}

function addToCart(id) {
    const item = menuData.find(i => i.id === id);
    const existing = cart.find(i => i.id === id);
    
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...item, qty: 1 });
    }
    
    updateBadge();
    alert(`${item.name} Cart me add ho gaya!`);
}

function updateBadge() {
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    document.getElementById('cart-badge').innerText = totalQty;
}

function renderCartScreen(container) {
    if (cart.length === 0) {
        container.innerHTML = `<h2>Your Cart</h2><p style="text-align:center; color:#aaa; margin-top:30px;">Cart khali hai.</p>`;
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const total = subtotal + 40;

    container.innerHTML = `
        <h2>Your Cart</h2>
        ${cart.map(item => `
            <div class="card">
                <div>
                    <h4>${item.name}</h4>
                    <p class="price">₹${item.price} x ${item.qty} = ₹${item.price * item.qty}</p>
                </div>
            </div>
        `).join('')}
        
        <div style="margin-top:20px; background:#1e1e1e; padding:15px; border-radius:10px;">
            <p>Subtotal: ₹${subtotal}</p>
            <p>Delivery Charge: ₹40</p>
            <hr style="border-color:#333;">
            <p style="font-size:1.2rem; font-weight:bold; color:var(--primary-red);">Total: ₹${total}</p>
            <button class="btn-block" onclick="startCheckout()">PROCEED TO CHECKOUT</button>
        </div>
    `;
}

function startCheckout() {
    if (!currentUser) {
        showRegisterScreen();
    } else {
        showPlaceOrderScreen();
    }
}

function showRegisterScreen() {
    const container = document.getElementById('main-content');
    container.innerHTML = `
        <h2>Register / Login</h2>
        <div class="form-group">
            <label>Name</label>
            <input type="text" id="reg-name" placeholder="Apna Name Likhein">
        </div>
        <div class="form-group">
            <label>Mobile Number</label>
            <input type="tel" id="reg-phone" placeholder="10-digit Mobile Number" maxlength="10">
        </div>
        <button class="btn-block" onclick="handleRegistration()">Submit & Continue</button>
    `;
}

function handleRegistration() {
    const name = document.getElementById('reg-name').value;
    const phone = document.getElementById('reg-phone').value;

    if (!name || phone.length !== 10) {
        alert("Sahi Name aur 10-digit Mobile Number bharein!");
        return;
    }

    currentUser = { name, phone };
    alert("Registration Successful!");
    showPlaceOrderScreen();
}

function showPlaceOrderScreen() {
    const container = document.getElementById('main-content');
    container.innerHTML = `
        <h2>Delivery Address</h2>
        <p>Logged in as: <b>${currentUser.name} (${currentUser.phone})</b></p>
        <div class="form-group">
            <label>Full Address</label>
            <input type="text" id="del-address" placeholder="House No, Landmark, Area">
        </div>
        <button class="btn-block" onclick="confirmOrder()">Confirm & Place Order</button>
    `;
}

function confirmOrder() {
    const address = document.getElementById('del-address').value;
    if (!address) {
        alert("Address bharna zaroori hai!");
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const total = subtotal + 40;

    activeOrder = {
        id: Math.floor(100000 + Math.random() * 900000),
        items: [...cart],
        total: total,
        status: "Order Placed - Preparing...",
        address: address
    };

    let orderList = cart.map(i => `• ${i.name} (x${i.qty}) - ₹${i.price * i.qty}`).join('%0A');
    let message = `*NEW ORDER - S%26A RESTAURANT*%0A%0A` +
        `Order ID: #${activeOrder.id}%0A` +
        `Customer: ${currentUser.name}%0A` +
        `Phone: ${currentUser.phone}%0A` +
        `Address: ${address}%0A%0A` +
        `*Items:*%0A${orderList}%0A%0A` +
        `*Total Amount: ₹${total}*`;

    window.open(`https://wa.me/918453270362?text=${message}`, '_blank');

    cart = [];
    updateBadge();
    renderApp('track');
}

function renderTrackScreen(container) {
    if (!activeOrder) {
        container.innerHTML = `<h2>Order Tracking</h2><p style="text-align:center; color:#aaa; margin-top:30px;">Abhi koi active order nahi hai.</p>`;
        return;
    }

    container.innerHTML = `
        <h2>Order Tracking</h2>
        <div class="status-box">
            <h3>Order #${activeOrder.id}</h3>
            <p>Total: <b>₹${activeOrder.total}</b></p>
            <hr style="border-color:#333;">
            <p style="color:var(--primary-red); font-size:1.1rem; font-weight:bold;">Status: ${activeOrder.status}</p>
        </div>
    `;
}
