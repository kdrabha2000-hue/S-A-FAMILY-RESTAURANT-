const restaurantMenu = [
    { id: 1, name: "Roti Veg", price: 40, category: "Breakfast", img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=300" },
    { id: 2, name: "Aloo Paratha", price: 50, category: "Breakfast", img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=300" },
    { id: 3, name: "Paneer Paratha", price: 100, category: "Breakfast", img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=300" },
    { id: 4, name: "Veg Chow Full", price: 50, category: "Noodles & Rolls", img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=300" },
    { id: 5, name: "Egg Chow Full", price: 70, category: "Noodles & Rolls", img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=300" },
    { id: 6, name: "Chicken Roll", price: 80, category: "Noodles & Rolls", img: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=300" },
    { id: 7, name: "Veg Momo Full", price: 50, category: "Momos & Starters", img: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=300", popular: true },
    { id: 8, name: "Chicken Momo Full", price: 70, category: "Momos & Starters", img: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=300", popular: true },
    { id: 9, name: "Chicken Biryani", price: 180, category: "Main Course", img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300", popular: true },
    { id: 10, name: "Butter Chicken Full", price: 380, category: "Main Course", img: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=300", popular: true },
    { id: 11, name: "Butter Naan", price: 80, category: "Main Course", img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300" },
    { id: 12, name: "Cold Coffee", price: 70, category: "Beverages", img: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=300" }
];

let cart = [];
let generatedOTP = null;
let activeOrder = null;

document.addEventListener("DOMContentLoaded", () => {
    loadPopularItems();
    renderMenuList('All');
});

function switchTab(tabName) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById(`screen-${tabName}`).classList.add('active');
    
    const btns = document.querySelectorAll('.nav-btn');
    if(tabName === 'home') btns[0].classList.add('active');
    if(tabName === 'menu') btns[1].classList.add('active');
    if(tabName === 'cart') { btns[2].classList.add('active'); renderCartScreen(); }
    if(tabName === 'tracking') { btns[3].classList.add('active'); renderTrackerScreen(); }
}

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

function filterCategory(cat, btn) {
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
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
    document.getElementById('subtotal-val').innerText = `₹${subtotal}`;
    document.getElementById('total-val').innerText = `₹${subtotal + 40}`;
}

function changeQty(index, delta) {
    cart[index].qty += delta;
    if(cart[index].qty <= 0) cart.splice(index, 1);
    updateCartBadge();
    renderCartScreen();
}

function goToCheckout() {
    if(cart.length === 0) {
        alert("Pehle Cart me items add karein!");
        return;
    }
    switchTab('checkout');
}

// Unique Random OTP Generator
function sendOTP() {
    const name = document.getElementById('cust-name').value;
    const phone = document.getElementById('cust-phone').value;

    if(!name || phone.length !== 10) {
        alert("Kripya apna naam aur 10-digit mobile number bharein!");
        return;
    }

    generatedOTP = Math.floor(1000 + Math.random() * 9000);
    document.getElementById('otp-field-box').classList.remove('hidden');
    alert(`Aapka Verification OTP hai: ${generatedOTP}`);
}

function verifyOTP() {
    const enteredOTP = document.getElementById('cust-otp').value;
    if(enteredOTP == generatedOTP) {
        alert("Mobile Number Verified Successfully!");
        document.getElementById('checkout-details-step').classList.remove('hidden');
    } else {
        alert("Galat OTP! Kripya sahi OTP enter karein.");
    }
}

// Order Placement & Live Tracking Simulation
function placeOrderWhatsApp() {
    const name = document.getElementById('cust-name').value;
    const phone = document.getElementById('cust-phone').value;
    const address = document.getElementById('cust-address').value;
    const payment = document.querySelector('input[name="payment"]:checked').value;

    if(!address) {
        alert("Delivery Address likhna zaroori hai!");
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const total = subtotal + 40;

    activeOrder = {
        id: Math.floor(100000 + Math.random() * 900000),
        items: [...cart],
        total: total,
        status: "Order Placed"
    };

    let orderList = cart.map(i => `• ${i.name} (x${i.qty}) - ₹${i.price * i.qty}`).join('%0A');
    let message = `*NEW ORDER - S%26A FAMILY RESTAURANT*%0A%0A` +
        `Order ID: #${activeOrder.id}%0A` +
        `Name: ${name}%0A` +
        `Phone: ${phone} (Verified)%0A` +
        `Address: ${address}%0A%0A` +
        `*Items:*%0A${orderList}%0A%0A` +
        `*Total Amount: ₹${total}*%0A` +
        `Payment: ${payment}`;

    window.open(`https://wa.me/918453270362?text=${message}`, '_blank');

    cart = [];
    updateCartBadge();
    switchTab('tracking');
}

function renderTrackerScreen() {
    const container = document.getElementById('active-tracker-container');
    if(!activeOrder) {
        container.innerHTML = `<p style="text-align:center; color:#aaa; margin-top:30px;">Abhi koi active order nahi hai.</p>`;
        return;
    }

    container.innerHTML = `
        <div class="form-card">
            <h3>Order #${activeOrder.id}</h3>
            <p>Total Payable: <b>₹${activeOrder.total}</b></p>
            <hr style="border-color:#333; margin:10px 0;">
            <p style="color:var(--primary-red); font-weight:bold;">Status: ${activeOrder.status}</p>
        </div>
    `;
}
