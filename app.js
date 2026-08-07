const menu = [
    {id: 1, name: "Puri Veg", price: 40},
    {id: 2, name: "Chicken Biryani", price: 180},
    {id: 3, name: "Butter Chicken", price: 380}
];
let cart = [];
let user = null;
let orderStatus = null;

function renderApp(screen) {
    const container = document.getElementById('main-content');
    if (screen === 'home') container.innerHTML = "<h2>Welcome to S&A!</h2><p>Best food in Udalguri.</p>";
    if (screen === 'menu') container.innerHTML = menu.map(i => `<div class='card'>${i.name} - ₹${i.price} <button onclick='addToCart(${i.id})'>Add</button></div>`).join('');
    if (screen === 'cart') renderCart(container);
    if (screen === 'track') renderTrack(container);
}

function addToCart(id) {
    cart.push(menu.find(i => i.id === id));
    alert("Added!");
}

function renderCart(container) {
    container.innerHTML = "<h2>Your Cart</h2>" + cart.map(i => `<div>${i.name}</div>`).join('') + 
    `<br><button onclick='showCheckout()'>Proceed to Checkout</button>`;
}

function showCheckout() {
    document.getElementById('main-content').innerHTML = `
        <h2>Checkout</h2>
        <input type="text" id="name" placeholder="Name">
        <input type="number" id="phone" placeholder="Phone">
        <button onclick="verifyUser()">Get OTP & Verify</button>
        <div id="otp-div" style="display:none;">
            <input type="number" id="otp" placeholder="Enter OTP (1234)">
            <button onclick="finalOrder()">Place Order</button>
        </div>
    `;
}

function verifyUser() {
    user = document.getElementById('name').value;
    alert("OTP sent (Use 1234)");
    document.getElementById('otp-div').style.display = 'block';
}

function finalOrder() {
    if(document.getElementById('otp').value === "1234") {
        orderStatus = "Order Placed - Preparing...";
        alert("Order sent to WhatsApp!");
        window.open(`https://wa.me/918453270362?text=New Order for ${user}`);
        renderApp('track');
    } else {
        alert("Wrong OTP!");
    }
}

function renderTrack(container) {
    container.innerHTML = `<h2>Tracking</h2><p>${orderStatus || "No active order"}</p>`;
}
renderApp('home');
