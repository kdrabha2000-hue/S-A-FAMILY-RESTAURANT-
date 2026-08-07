// Complete Restaurant Menu Data from images
const restaurantMenu = [
    // Breakfast
    { id: 1, name: "Roti Veg", price: 40, category: "Breakfast", img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=300" },
    { id: 2, name: "Puri Veg", price: 40, category: "Breakfast", img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300" },
    { id: 3, name: "Aloo Paratha", price: 50, category: "Breakfast", img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=300" },
    { id: 4, name: "Paneer Paratha", price: 100, category: "Breakfast", img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=300" },
    { id: 5, name: "Cheese Paratha", price: 120, category: "Breakfast", img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=300" },
    { id: 6, name: "Sandwich Veg", price: 50, category: "Breakfast", img: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300" },

    // Noodles & Rolls
    { id: 7, name: "Veg Chow Full", price: 50, category: "Noodles & Rolls", img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=300" },
    { id: 8, name: "Egg Chow Full", price: 70, category: "Noodles & Rolls", img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=300" },
    { id: 9, name: "Chicken Chow Full", price: 100, category: "Noodles & Rolls", img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=300" },
    { id: 10, name: "Veg Roll", price: 40, category: "Noodles & Rolls", img: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=300" },
    { id: 11, name: "Egg Roll", price: 60, category: "Noodles & Rolls", img: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=300" },
    { id: 12, name: "Chicken Roll", price: 80, category: "Noodles & Rolls", img: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=300" },

    // Momos & Starters
    { id: 13, name: "Veg Momo Full", price: 50, category: "Momos & Starters", img: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=300", popular: true },
    { id: 14, name: "Chicken Momo Full", price: 70, category: "Momos & Starters", img: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=300", popular: true },
    { id: 15, name: "Tandoori Chicken Full", price: 500, category: "Momos & Starters", img: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=300" },
    { id: 16, name: "Chilli Chicken Full", price: 200, category: "Momos & Starters", img: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=300" },

    // Main Course
    { id: 17, name: "Chicken Biryani", price: 180, category: "Main Course", img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300", popular: true },
    { id: 18, name: "Butter Chicken Full", price: 380, category: "Main Course", img: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=300", popular: true },
    { id: 19, name: "Mutton Curry Full", price: 400, category: "Main Course", img: "https://images.unsplash.com/photo-1545247181-516773cae754?w=300" },
    { id: 20, name: "Paneer Masala", price: 200, category: "Main Course", img: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300" },
    { id: 21, name: "Dal Makhani", price: 200, category: "Main Course", img: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300" },
    { id: 22, name: "Butter Naan", price: 80, category: "Main Course", img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300" },

    // Beverages
    { id: 23, name: "Cold Coffee", price: 70, category: "Beverages", img: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=300" },
    { id: 24, name: "Milk Tea", price: 20, category: "Beverages", img: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=300" }
];

let cart = [];
let isVerified = false;

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
    loadPopularItems();
    renderMenuList('All');
});

// Tab Switching
function switchTab(tabName) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById(`screen-${tabName}`).classList.add('active');
    event.currentTarget.classList.add('active');

    if(tabName === 'cart') renderCartScreen();
}

// Render Popular Items on Home
function loadPopularItems() {
    const popularBox = document.getElementById('popular-items');
    const populars = restaurantMenu.filter(i => i.popular);
    popularBox.innerHTML = populars.map(item => `
        <div class="popular-card">
            <img src="${item.img}" alt="${item.name}">
            <h4>${item.name}</h4>
            <p style="color:var(--primary-red); font-weight:bold;">₹${item.price}</p>
            <button class="btn-primary" onclick="quickAdd('${item.name}', ${item.price})" style="font-size:0.7rem; padding:4px 8px; margin-top:5px;">ADD +</button>
        </div>
    `).join('');
}

// Render Menu Filter
function filterCategory(cat) {
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    event.currentTarget.classList.add('active');
    renderMenuList(cat);
}

function renderMenuList(category) {
    const list = document.getElementById('menu-items-list');
    const items = category === 'All' ? restaurantMenu : restaurantMenu.filter(i => i.category === category);
    
    list.innerHTML = items.map(item => `
        <div class="menu-card">
            <div class="item-info">
                <img src="${item.img}" class="item-img" alt="${item.name}">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>₹${item.price}</p>
                </div>
            </div>
            <button class="btn-primary" onclick="quickAdd('${item.name}', ${item.price})">ADD +</button>
        </div>
    `).join('');
}

// Add to Cart Logic
function quickAdd(name, price) {
    const existing = cart.find(i => i.name === name);
    if(existing) {
        existing.qty += 1;
    } else {
        cart.push({ name, price, qty: 1 });
    }
    updateCartBadge();
    alert(`${name} cart me add ho gaya!`);
}

function updateCartBadge() {
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    document.getElementById('cart-count-badge').innerText = totalQty;
}

// Render Cart Screen
function renderCartScreen() {
    const container = document.getElementById('cart-items-container');
    if(cart.length === 0) {
        container.innerHTML = `<p style="text-align:center; padding:30px; color:#aaa;">Aapka cart khali hai.</p>`;
        document.getElementById('cart-summary-box').style.display = 'none';
        return;
    }

    document.getElementById('cart-summary-box').style.display = 'block';
    container.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <div>
                <h4>${item.name}</h4>
                <p style="color:var(--primary-red); font-size:0.85rem;">₹${item.price} x ${item.qty} = ₹${item.price * item.qty}</p>
            </div>
            <div class="qty-controls">
                <button class="qty-btn" onclick="changeQty(${index}, -1)">-</button>
                <span>${item.qty}</span>
                <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
            </div>
        </div>
    `).join('');

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const delivery = 40;
    document.getElementById('subtotal-val').innerText = `₹${subtotal}`;
    document.getElementById('total-val').innerText = `₹${subtotal + delivery}`;
}

function changeQty(index, delta) {
    cart[index].qty += delta;
    if(cart[index].qty <= 0) cart.splice(index, 1);
    updateCartBadge();
    renderCartScreen();
}

function goToVerification() {
    if(cart.length === 0) {
        alert("Pehle cart me items add karein!");
        return;
    }
    switchTab('checkout');
}

// Customer Verification Simulation (Demo OTP)
function sendOTP() {
    const name = document.getElementById('cust-name').value;
    const phone = document.getElementById('cust-phone').value;

    if(!name || phone.length !== 10) {
        alert("Kripya apna sahi naam aur 10-digit mobile number bharein!");
        return;
    }

    document.getElementById('otp-field-box').classList.remove('hidden');
    document.getElementById('send-otp-btn').innerText = "Resend OTP";
    alert(`OTP aapke number (${phone}) par bhej diya gaya hai! (Demo OTP is: 1234)`);
}

function verifyOTP() {
    const otp = document.getElementById('cust-otp').value;
    if(otp === "1234") {
        isVerified = true;
        alert("Mobile Number Verified Successfully!");
        document.getElementById('verification-step').classList.add('hidden');
        document.getElementById('checkout-details-step').classList.remove('hidden');
    } else {
        alert("Galat OTP! Kripya '1234' enter karein.");
    }
}

// Place Order on WhatsApp
function placeOrderWhatsApp() {
    const name = document.getElementById('cust-name').value;
    const phone = document.getElementById('cust-phone').value;
    const address = document.getElementById('cust-address').value;
    const payment = document.querySelector('input[name="payment"]:checked').value;

    if(!address) {
        alert("Kripya apna delivery address dalein!");
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const total = subtotal + 40;

    let orderList = cart.map(i => `• ${i.name} (x${i.qty}) - ₹${i.price * i.qty}`).join('%0A');

    let message = `*NEW ORDER - S%26A FAMILY RESTAURANT*%0A%0A` +
        `*Customer Details:*%0A` +
        `Name: ${name}%0A` +
        `Phone: ${phone} (Verified)%0A` +
        `Address: ${address}%0A%0A` +
        `*Order Details:*%0A${orderList}%0A%0A` +
        `Subtotal: ₹${subtotal}%0A` +
        `Delivery Charge: ₹40%0A` +
        `*Total Payable: ₹${total}*%0A%0A` +
        `Payment Option: ${payment}%0A%0A` +
        `_Please confirm my order!_`;

    const restaurantWhatsApp = "918453270362";
    window.open(`https://wa.me/${restaurantWhatsApp}?text=${message}`, '_blank');
}
