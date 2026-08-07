let cart = [];
let total = 0;

const prices = {
  'Chicken Biryani': 180,
  'Veg Thali': 120,
  'Fried Rice': 100,
  'Chicken Roll': 90,
  'Veg Roll': 50
};

function addToCart(item) {
  cart.push(item);
  total += prices[item];
  updateCart();
}

function clearCart() {
  cart = [];
  total = 0;
  updateCart();
}

function updateCart() {
  const cartList = document.getElementById("cart-items");
  const totalElement = document.getElementById("cart-total");

  if (cart.length === 0) {
    cartList.innerHTML = "<li>No items added.</li>";
  } else {
    let itemsHTML = "";
    
    // Count item quantities
    let itemCounts = {};
    cart.forEach(item => {
      itemCounts[item] = (itemCounts[item] || 0) + 1;
    });

    for (let item in itemCounts) {
      let qty = itemCounts[item];
      let itemTotal = prices[item] * qty;
      itemsHTML += `<li>${item} x ${qty} - ₹${itemTotal}</li>`;
    }
    
    cartList.innerHTML = itemsHTML;
  }
  
  if (totalElement) {
    totalElement.innerText = "Total: ₹" + total;
  }
}

function orderOnWhatsApp() {
  if (cart.length === 0) {
    alert("आपका कार्ट खाली है! कृपया पहले मेनू से आइटम जोड़ें।");
    return;
  }

  // अपना व्हाट्सएप नंबर यहाँ डालें (91 देश कोड के साथ)
  let phoneNumber = "8453270362"; 
  let message = "🍔 *S&A Family Restaurant - नया ऑर्डर*\n\n";

  let itemCounts = {};
  cart.forEach(item => {
    itemCounts[item] = (itemCounts[item] || 0) + 1;
  });

  let index = 1;
  for (let item in itemCounts) {
    let qty = itemCounts[item];
    let itemTotal = prices[item] * qty;
    message += `${index}. ${item} x ${qty} = ₹${itemTotal}\n`;
    index++;
  }

  message += `\n💵 *कुल राशि: ₹${total}*\n`;
  message += `📍 *पता:* U.T. Road, Bengbari, Udalguri, Assam\n\nकृपया इस ऑर्डर की पुष्टि करें!`;

  let whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  window.open(whatsappURL, '_blank');
}
