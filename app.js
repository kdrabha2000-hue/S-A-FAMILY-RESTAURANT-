let cart = [];
let total = 0;

const prices = {
  "Chicken Biryani": 180,
  "Veg Thali": 120,
  "Fried Rice": 100,
  "Chicken Roll": 90,
  "Veg Roll": 50
};

function addToCart(item) {
  cart.push(item);
  total += prices[item];
  updateCart();
}

function updateCart() {
    let cartList = document.getElementById("cart-items");
    
    if (cart.length === 0) {
        cartList.innerHTML = "<li>No items added.</li>";
    } else {
        let itemsHtml = "";
        cart.forEach(function(item) {
            itemsHtml += "<li>" + item + "</li>";
        });
        cartList.innerHTML = itemsHtml;
    }
}