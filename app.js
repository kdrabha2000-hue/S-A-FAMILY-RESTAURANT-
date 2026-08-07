let cart = [];
let isLoggedIn = false;

function switchTab(tabId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('screen-' + tabId).classList.add('active');
}

function addToCart(name, price) {
    cart.push({name, price});
    alert(name + " added to cart!");
}

function handleCheckout() {
    if (!isLoggedIn) {
        let name = prompt("Login/Register: Please enter your name:");
        if (name) {
            isLoggedIn = true;
            alert("Welcome " + name + "! Redirecting to checkout...");
            // Yahan se aap checkout page par redirect kar sakte hain
        } else {
            alert("Login required to proceed!");
            return;
        }
    }
    // Checkout logic here
    alert("Proceeding to payment...");
}

// Menu loading logic
const menu = [
    {name: "Puri Veg", price: 40},
    {name: "Chicken Biryani", price: 180}
];

function renderMenu() {
    const list = document.getElementById('menu-items');
    list.innerHTML = menu.map(item => `
        <div>${item.name} - ₹${item.price} 
            <button onclick="addToCart('${item.name}', ${item.price})">Add</button>
        </div>
    `).join('');
}
renderMenu();
