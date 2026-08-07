let cart = [];
let itemsTotal = 0;
const deliveryCharge = 50; // 5 से 12 km के लिए डिलीवरी चार्ज

const prices = {
  'Chicken Biryani': 180,
  'Veg Thali': 120,
  'Fried Rice': 100,
  'Chicken Roll': 90,
  'Veg Roll': 50
};

function addToCart(item) {
  cart.push(item);
  itemsTotal += prices[item];
  updateCart();
}

function clearCart() {
  cart = [];
  itemsTotal = 0;
  updateCart();
}

function updateCart() {
  const cartList = document.getElementById("cart-items");
  const totalElement = document.getElementById("cart-total");

  if (cart.length === 0) {
    cartList.innerHTML = "<li>No items added.</li>";
    if (totalElement) totalElement.innerText = "Total: ₹0";
  } else {
    let itemsHTML = "";
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
    
    let grandTotal = itemsTotal + deliveryCharge;
    if (totalElement) totalElement.innerText = `Total: ₹${grandTotal} (Inc. ₹50 Delivery)`;
  }
}

function openOrderModal() {
  if (cart.length === 0) {
    alert("आपका कार्ट खाली है! कृपया पहले मेनू से आइटम जोड़ें।");
    return;
  }
  document.getElementById("orderModal").style.display = "flex";
}

function closeOrderModal() {
  document.getElementById("orderModal").style.display = "none";
}

function sendWhatsAppOrder(event) {
  event.preventDefault();

  let name = document.getElementById("custName").value;
  let phone = document.getElementById("custPhone").value;
  let address = document.getElementById("custAddress").value;
  let distance = document.getElementById("custDistance").value;

  let phoneNumber = "918453270362"; // आपका व्हाट्सएप नंबर
  let grandTotal = itemsTotal + deliveryCharge;

  let message = "🍔 *S&A Family Restaurant - नया ऑर्डर*\n\n";
  message += "*ऑर्डर की जानकारी:*\n";

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

  message += `\n📦 आइटम्स कुल: ₹${itemsTotal}`;
  message += `\n🚚 डिलीवरी चार्ज (${distance}): ₹${deliveryCharge}`;
  message += `\n💵 *कुल राशि (Total): ₹${grandTotal}*\n`;
  message += `\n------------------------`;
  message += `\n👤 *ग्राहक विवरण (Customer Details):*`;
  message += `\n• नाम: ${name}`;
  message += `\n• कॉल नंबर: ${phone}`;
  message += `\n• पता: ${address}`;
  message += `\n• दूरी: ${distance}`;
  message += `\n------------------------`;
  message += `\nकृपया ऑर्डर डिलीवर करने के लिए कॉल करें!`;

  let whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  
  closeOrderModal();
  window.open(whatsappURL, '_blank');
}
