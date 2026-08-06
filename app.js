

let cart = [];
let total = 0;

const prices = {
  "Chicken Biryani": 180,
  "Veg Thali": 120,
  "Fried Rice": 100,
  "Chicken Roll": 90,
  "Veg Roll": 50
};

function addToCart(itemName) {
  cart.push(itemName);
  total += prices[itemName];

  document.getElementById("cart").innerHTML =
    "<h2>🛒 Cart</h2>" +
    cart.map(item => "<p>" + item + "</p>").join("") +
    "<hr><h3>Total: ₹" + total + "</h3>";
}