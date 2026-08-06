

let cart = [];

function addToCart(itemName) {
    cart.push(itemName);

    let cartBox = document.getElementById("cart");

    if (cartBox) {
        cartBox.innerHTML =
            "<h2>🛒 Cart</h2>" +
            cart.map(item => "<p>" + item + "</p>").join("");
    }
}