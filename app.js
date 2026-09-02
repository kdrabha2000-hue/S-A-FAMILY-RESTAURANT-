// ==================== 1. FIREBASE SETUP ====================
const firebaseConfig = {
  apiKey: "AIzaSyDDTFzD8eaxS6hsQ_W5akOWRWixyZdjkSo",
  authDomain: "kd-ka-khana-ghar-tak.firebaseapp.com",
  databaseURL: "https://kd-ka-khana-ghar-tak-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "kd-ka-khana-ghar-tak",
  storageBucket: "kd-ka-khana-ghar-tak.firebasestorage.app",
  messagingSenderId: "69933070653",
  appId: "1:69933070653:web:f9b93ba827d794bb376d54"
};

if (typeof firebase !== 'undefined' && !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = (typeof firebase !== 'undefined') ? firebase.database() : null;

// ==================== LIVE RINGER SETUP ====================
const adminRingerAudio = new Audio('https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg');
adminRingerAudio.loop = true;
let isAudioUnlocked = false;

document.addEventListener('click', () => {
  if (!isAudioUnlocked) {
    adminRingerAudio.play().then(() => {
      adminRingerAudio.pause();
      adminRingerAudio.currentTime = 0;
      isAudioUnlocked = true;
    }).catch(() => {});
  }
}, { once: true });

// ==================== PWA INSTALL SETUP ====================
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const banner = document.getElementById('pwaInstallBanner');
  if (banner) banner.style.display = 'flex';
});

function triggerPwaInstall() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        const banner = document.getElementById('pwaInstallBanner');
        if (banner) banner.style.display = 'none';
      }
      deferredPrompt = null;
    });
  } else {
    alert("App already installed or please use Chrome 'Add to Home screen' option!");
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const installBtn = document.getElementById('pwaInstallBtn');
  if (installBtn) installBtn.addEventListener('click', triggerPwaInstall);
});

// ==================== LANGUAGE MODAL ====================
function openLanguageModal() {
  openModal('languageModal');
}

function selectLanguage(lang) {
  alert(`Language set to ${lang}`);
  closeModal('languageModal');
}

// ==================== REFER & EARN SHARE SYSTEM ====================
function shareReferralLink() {
  const profile = JSON.parse(localStorage.getItem("kd_cust_profile") || "{}");
  const custName = profile.name || "Aapke dost";
  const appUrl = window.location.origin + window.location.pathname;

  const shareText = `🍔 ${custName} ne aapko S&A FAMILY RESTAURANT par invite kiya hai!\n\n🎉 Use Promo Code: *KD20* to get Flat ₹20 OFF on your first order!\n\n👉 Abhi online order karein ya App install karein:\n${appUrl}`;

  if (navigator.share) {
    navigator.share({
      title: "S&A Family Restaurant - Special Offer",
      text: shareText,
      url: appUrl
    }).catch(() => console.log("Share dismissed"));
  } else {
    navigator.clipboard.writeText(shareText).then(() => {
      const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
      window.open(waUrl, '_blank');
    }).catch(() => {
      const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
      window.open(waUrl, '_blank');
    });
  }
}

// ==================== TABLE ORDER & MODE SYSTEM ====================
let currentOrderMode = 'delivery'; // 'delivery' or 'dinein'
let selectedTableNumber = null;

function detectTableFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const table = params.get('table');
  if (table) {
    confirmTableNumber(table, false);
    // Smooth scroll to menu for quick dine-in ordering
    setTimeout(() => {
      const grid = document.getElementById('foodGrid');
      if (grid) grid.scrollIntoView({ behavior: 'smooth' });
    }, 600);
  }
}

function setOrderMode(mode) {
  currentOrderMode = mode;
  const delBtn = document.getElementById('modeDeliveryBtn');
  const dineBtn = document.getElementById('modeDineinBtn');
  const tableBanner = document.getElementById('activeTableBanner');
  const delSection = document.getElementById('deliveryOrderSection');
  const dineSection = document.getElementById('dineInOrderSection');
  const delFeeRow = document.getElementById('deliveryFeeRow');
  const floatDelTag = document.getElementById('floatingDeliveryTag');

  if (mode === 'delivery') {
    if (delBtn) delBtn.classList.add('active');
    if (dineBtn) dineBtn.classList.remove('active');
    if (tableBanner) tableBanner.style.display = 'none';
    if (delSection) delSection.style.display = 'block';
    if (dineSection) dineSection.style.display = 'none';
    if (delFeeRow) delFeeRow.style.display = 'flex';
    if (floatDelTag) floatDelTag.innerText = '+ ₹9 Fixed Delivery';
    selectedTableNumber = null;
  } else {
    if (delBtn) delBtn.classList.remove('active');
    if (dineBtn) dineBtn.classList.add('active');
    if (tableBanner) tableBanner.style.display = 'flex';
    if (delSection) delSection.style.display = 'none';
    if (dineSection) dineSection.style.display = 'block';
    if (delFeeRow) delFeeRow.style.display = 'none';
    if (floatDelTag) floatDelTag.innerText = '🍽️ Dine-in (₹0 Delivery)';
  }
  updateCartBar();
}

function openTableSelectorModal() {
  openModal('tableSelectorModal');
}

function confirmTableNumber(tableNo, shouldScroll = true) {
  selectedTableNumber = tableNo;
  setOrderMode('dinein');
  closeModal('tableSelectorModal');

  const lbl = document.getElementById('activeTableLabel');
  const chkLbl = document.getElementById('checkoutTableDisplay');
  if (lbl) lbl.innerText = `Table #${tableNo}`;
  if (chkLbl) chkLbl.innerText = `Table #${tableNo}`;

  if (shouldScroll) {
    const grid = document.getElementById('foodGrid');
    if (grid) grid.scrollIntoView({ behavior: 'smooth' });
  }
}

// ==================== 2. MENU DATA & STORAGE ====================
const defaultMenu = [
  { id: "m1", name: "Chicken Steamed Momo (10 Pcs)", price: 120, mrp: 160, cat: "momos", inStock: true, img: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=500" },
  { id: "m2", name: "Chicken Fried Momo (10 Pcs)", price: 140, mrp: 180, cat: "momos", inStock: true, img: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500" },
  { id: "m3", name: "Chicken Schezwan Gravy Momo", price: 160, mrp: 200, cat: "momos", inStock: true, img: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=500" },
  { id: "m4", name: "Pork Steamed Momo (10 Pcs)", price: 130, mrp: 170, cat: "momos", inStock: true, img: "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=500" },
  { id: "m5", name: "Pork Fried Momo (10 Pcs)", price: 150, mrp: 190, cat: "momos", inStock: true, img: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500" },
  { id: "m6", name: "Cheese & Veg Momo (10 Pcs)", price: 130, mrp: 160, cat: "momos", inStock: true, img: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500" },
  { id: "r1", name: "Single Egg Chicken Roll", price: 90, mrp: 120, cat: "rolls", inStock: true, img: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500" },
  { id: "r2", name: "Double Egg Double Chicken Roll", price: 120, mrp: 150, cat: "rolls", inStock: true, img: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=500" },
  { id: "r3", name: "Special Pork Roll", price: 130, mrp: 160, cat: "rolls", inStock: true, img: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500" },
  { id: "r4", name: "Crispy French Fries (Peri-Peri)", price: 80, mrp: 110, cat: "rolls", inStock: true, img: "https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500" },
  { id: "c1", name: "Chicken Butter Masala (Boneless)", price: 280, mrp: 350, cat: "chicken", inStock: true, img: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=500" },
  { id: "c2", name: "Chicken Curry / Kadhai Chicken", price: 260, mrp: 320, cat: "chicken", inStock: true, img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500" },
  { id: "c3", name: "Crispy Chilli Chicken (Dry)", price: 220, mrp: 280, cat: "chicken", inStock: true, img: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500" },
  { id: "p1", name: "Pork Curry with Bamboo Shoot", price: 300, mrp: 380, cat: "pork", inStock: true, img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500" },
  { id: "p2", name: "Smoked Pork Dry Fry", price: 320, mrp: 400, cat: "pork", inStock: true, img: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=500" },
  { id: "p3", name: "Pork Bhuna Masala", price: 310, mrp: 390, cat: "pork", inStock: true, img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500" },
  { id: "ct1", name: "Special Chicken Hakka Chowmein", price: 130, mrp: 170, cat: "chow_thukpa", inStock: true, img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500" },
  { id: "ct2", name: "Special Pork Chowmein", price: 150, mrp: 190, cat: "chow_thukpa", inStock: true, img: "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=500" },
  { id: "ct3", name: "Hot Chicken Thukpa Soup", price: 140, mrp: 180, cat: "chow_thukpa", inStock: true, img: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500" },
  { id: "ck1", name: "Chocolate Truffle Cake (1 Kg)", price: 850, mrp: 1100, cat: "cakes", inStock: true, img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500" },
  { id: "ck2", name: "Black Forest Cake (1 Kg)", price: 800, mrp: 1000, cat: "cakes", inStock: true, img: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=500" },
  { id: "ck3", name: "Vanilla / Pineapple Cake (1 Kg)", price: 750, mrp: 950, cat: "cakes", inStock: true, img: "https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=500" },
  { id: "dr1", name: "Cold Drinks 750ml (Coke / Sprite)", price: 45, mrp: 50, cat: "drinks", inStock: true, img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500" },
  { id: "dr2", name: "Fresh Sweet Lassi / Cold Coffee", price: 70, mrp: 90, cat: "drinks", inStock: true, img: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=500" }
];

let menuCatalog = JSON.parse(localStorage.getItem("kd_live_menu")) || defaultMenu;
let cart = [];
let wishlist = JSON.parse(localStorage.getItem("kd_wishlist") || "[]");
let activePayment = 'COD';
let appliedDiscount = 0;
let coinsRedeemed = false;
let currentPdpItem = null;
let selectedCakeWeight = 1.0;
let selectedCakePrice = 850;
let isStoreOpen = true;

// Firebase Cloud Sync
if (db) {
  db.ref("restaurant_menu").on("value", snapshot => {
    const cloudMenu = snapshot.val();
    if (cloudMenu && Array.isArray(cloudMenu)) {
      menuCatalog = cloudMenu;
      localStorage.setItem("kd_live_menu", JSON.stringify(menuCatalog));
      renderFoodItems(menuCatalog);
      if (document.getElementById('adminDashboard')?.style.display === 'block') {
        renderAdminMenuItems();
      }
    }
  });

  db.ref("store_status").on("value", snap => {
    const val = snap.val();
    if (val !== null) {
      isStoreOpen = val;
      updateStoreStatusUI(isStoreOpen);
    }
  });

  db.ref("banner_headline").on("value", snap => {
    const headline = snap.val();
    if (headline) {
      updateBannerUI(headline);
    }
  });
}

function updateStoreStatusUI(open) {
  const btn = document.getElementById('storeStatusBtn');
  if (btn) {
    btn.innerText = open ? "Restaurant is: OPEN (8am - 9:30pm)" : "Restaurant is: CLOSED (Offline)";
    btn.style.background = open ? "#10b981" : "#ef4444";
  }
  let closedAlert = document.getElementById('storeClosedBanner');
  if (!closedAlert) {
    closedAlert = document.createElement('div');
    closedAlert.id = 'storeClosedBanner';
    closedAlert.style.cssText = "background:#ef4444; color:#fff; font-weight:bold; font-size:12px; text-align:center; padding:8px; border-radius:8px; margin:10px 16px; display:none;";
    closedAlert.innerText = "⚠️ Restaurant is currently CLOSED. Ordering is temporarily disabled.";
    const header = document.querySelector('header') || document.body;
    header.parentNode.insertBefore(closedAlert, header.nextSibling);
  }
  closedAlert.style.display = open ? "none" : "block";
}

function updateBannerUI(headline) {
  const titles = document.querySelectorAll('.hero-title, #bannerTitle, .banner-title');
  titles.forEach(el => { el.innerText = headline; });
  const bannerBox = document.querySelector('.promo-carousel, .hero-banner');
  if (bannerBox) {
    const strong = bannerBox.querySelector('h2, strong');
    if (strong) strong.innerText = headline;
  }
}

function saveMenuToStorageAndCloud() {
  localStorage.setItem("kd_live_menu", JSON.stringify(menuCatalog));
  if (db) {
    db.ref("restaurant_menu").set(menuCatalog);
  }
  renderFoodItems(menuCatalog);
  renderAdminMenuItems();
}

// ==================== 3. MODAL HANDLER ====================
function pushModalState(modalId) {
  window.history.pushState({ openModal: modalId }, "");
}

window.addEventListener('popstate', function(event) {
  const allModals = [
    'productDetailModal',
    'accountModal',
    'orderHistoryModal',
    'trackingModal',
    'wishlistModal',
    'cakeStudioModal',
    'cartModal',
    'adminModal',
    'reviewModal',
    'languageModal',
    'tableSelectorModal'
  ];

  let modalClosed = false;
  allModals.forEach(id => {
    const el = document.getElementById(id);
    if (el && (el.style.display === 'flex' || el.style.display === 'block')) {
      el.style.setProperty('display', 'none', 'important');
      modalClosed = true;
    }
  });

  if (modalClosed) {
    event.preventDefault();
  }
});

function openModal(id) {
  const m = document.getElementById(id);
  if (m) {
    m.style.setProperty('display', 'flex', 'important');
    pushModalState(id);
  }
}

function closeModal(id) {
  const m = document.getElementById(id);
  if (m) {
    m.style.setProperty('display', 'none', 'important');
  }
}

// ==================== 4. RENDER FOOD CATALOG & SEARCH ====================
function renderFoodItems(items) {
  const container = document.getElementById('foodGrid');
  if (!container) return;
  container.innerHTML = '';
  items.forEach(dish => {
    const isWished = wishlist.includes(dish.id);
    const stockBadge = dish.inStock ? '' : '<span class="out-of-stock-badge" style="position:absolute;top:8px;left:8px;background:#ef4444;color:#fff;font-size:10px;padding:2px 6px;border-radius:4px;font-weight:bold;">SOLD OUT</span>';
    const addBtnHtml = (dish.inStock && isStoreOpen)
      ? `<button class="add-btn" onclick="event.stopPropagation(); addToCart('${dish.id}', '${dish.name}', ${dish.price}, '${dish.img}')">ADD +</button>`
      : `<button class="add-btn" style="background:#262626; color:#777; border-color:#333;" disabled>${isStoreOpen ? 'SOLD OUT' : 'CLOSED'}</button>`;

    container.innerHTML += `
      <div class="food-card" onclick="openProductDetail('${dish.id}')">
        <div class="dish-img-wrap" style="position:relative;">
          <img src="${dish.img}" alt="${dish.name}" />
          ${stockBadge}
          <button class="card-wish-btn ${isWished ? 'active' : ''}" onclick="event.stopPropagation(); toggleCardWish('${dish.id}', this)"><i class="fa-solid fa-heart"></i></button>
        </div>
        <div class="food-card-content">
          <div class="food-name">${dish.name}</div>
          <div class="food-price-row">
            <span class="food-price">₹${dish.price}</span>
            ${addBtnHtml}
          </div>
        </div>
      </div>
    `;
  });
}

function searchDishes() {
  const q = document.getElementById('searchInput').value.toLowerCase().trim();
  const filtered = menuCatalog.filter(d => d.name.toLowerCase().includes(q));
  renderFoodItems(filtered);
}

function filterCategory(cat, el) {
  document.querySelectorAll('.cat-item').forEach(c => c.classList.remove('active'));
  if (el) el.classList.add('active');
  if (cat === 'all') {
    renderFoodItems(menuCatalog);
  } else {
    renderFoodItems(menuCatalog.filter(d => d.cat === cat));
  }
}

function triggerVoiceSearch() {
  alert("Voice Search: Say dish name (e.g. 'Pork Momo' or 'Chicken Roll')");
}

// ==================== 5. PDP & REVIEWS ====================
function openProductDetail(dishId) {
  const dish = menuCatalog.find(d => d.id === dishId);
  if (!dish) return;
  currentPdpItem = dish;

  if (document.getElementById('pdpImg')) document.getElementById('pdpImg').src = dish.img;
  if (document.getElementById('pdpTitle')) document.getElementById('pdpTitle').innerText = dish.name;
  if (document.getElementById('pdpPrice')) document.getElementById('pdpPrice').innerText = `₹${dish.price}`;
  if (document.getElementById('pdpMrp')) document.getElementById('pdpMrp').innerText = `₹${dish.mrp || (dish.price + 50)}`;

  const isWished = wishlist.includes(dish.id);
  const wishBtn = document.getElementById('pdpWishBtn');
  if (wishBtn) {
    if (isWished) wishBtn.classList.add('active');
    else wishBtn.classList.remove('active');
  }

  const similarContainer = document.getElementById('similarDishesScroll');
  if (similarContainer) {
    similarContainer.innerHTML = '';
    menuCatalog.filter(d => d.cat === dish.cat && d.id !== dish.id).slice(0, 5).forEach(sim => {
      similarContainer.innerHTML += `
        <div class="cat-item" onclick="openProductDetail('${sim.id}')">
          <div class="cat-circle"><img src="${sim.img}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" /></div>
          <div class="cat-name">${sim.name.substring(0, 12)}..</div>
        </div>
      `;
    });
  }

  openModal('productDetailModal');
}

function toggleCurrentWish() {
  if (!currentPdpItem) return;
  toggleCardWish(currentPdpItem.id);
  const btn = document.getElementById('pdpWishBtn');
  if (btn) btn.classList.toggle('active');
}

function toggleCardWish(id, el) {
  const idx = wishlist.indexOf(id);
  if (idx > -1) {
    wishlist.splice(idx, 1);
    if (el) el.classList.remove('active');
  } else {
    wishlist.push(id);
    if (el) el.classList.add('active');
  }
  localStorage.setItem("kd_wishlist", JSON.stringify(wishlist));
}

function selectDishVariant(type, extra, el) {
  document.querySelectorAll('#pdpVariantBox .weight-pill').forEach(p => p.classList.remove('active'));
  if (el) el.classList.add('active');
  if (currentPdpItem) {
    document.getElementById('pdpPrice').innerText = `₹${currentPdpItem.price + extra}`;
  }
}

function addPdpToCart() {
  if (!currentPdpItem) return;
  addToCart(currentPdpItem.id, currentPdpItem.name, currentPdpItem.price, currentPdpItem.img);
  closeModal('productDetailModal');
}

function buyNowPdp() {
  if (!currentPdpItem) return;
  addToCart(currentPdpItem.id, currentPdpItem.name, currentPdpItem.price, currentPdpItem.img);
  closeModal('productDetailModal');
  openCartModal();
}

function shareCurrentItem() {
  if (navigator.share && currentPdpItem) {
    navigator.share({ title: currentPdpItem.name, text: `Check out ${currentPdpItem.name} at S&A FAMILY RESTAURANT!`, url: window.location.href });
  } else {
    alert("Link copied to clipboard!");
  }
}

function openReviewModal() {
  openModal('reviewModal');
}

function submitCustomerReview() {
  const rating = document.getElementById('reviewRatingSelect')?.value || "5";
  const msg = document.getElementById('reviewText')?.value.trim();
  const profile = JSON.parse(localStorage.getItem("kd_cust_profile") || "{}");
  const author = profile.name || "Happy Customer";

  if (!msg) {
    alert("Please write a few words about your experience!");
    return;
  }

  const reviewHtml = `
    <div class="review-item">
      <div class="rev-header"><span>⭐ ${rating}.0 - ${author}</span><small>Just now</small></div>
      <p>${msg}</p>
    </div>
  `;

  const list = document.getElementById('pdpReviewsList');
  if (list) list.insertAdjacentHTML('afterbegin', reviewHtml);

  if (db) {
    db.ref("customer_reviews").push({
      author: author,
      rating: rating,
      message: msg,
      timestamp: Date.now()
    });
  }

  alert("Thank you for your valuable review!");
  if (document.getElementById('reviewText')) document.getElementById('reviewText').value = '';
  closeModal('reviewModal');
}

// ==================== 6. CART OPERATIONS ====================
function addToCart(id, name, price, img) {
  if (!isStoreOpen) {
    alert("Restaurant is currently closed for new orders.");
    return;
  }
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, name, price, qty: 1, img: img || "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=500" });
  }
  updateCartBar();
}

function updateCartBar() {
  const cartBar = document.getElementById('floatingCart');
  if (!cartBar) return;
  if (cart.length === 0) {
    cartBar.style.display = 'none';
    return;
  }
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const coinDiscount = coinsRedeemed ? 20 : 0;
  const deliveryCharge = (currentOrderMode === 'dinein') ? 0 : 9;
  const grandTotal = Math.max(0, subtotal + deliveryCharge - appliedDiscount - coinDiscount);

  if (document.getElementById('cartCount')) document.getElementById('cartCount').innerText = `${totalQty} Item${totalQty > 1 ? 's' : ''}`;
  if (document.getElementById('cartTotal')) document.getElementById('cartTotal').innerText = `₹${grandTotal}`;
  cartBar.style.display = 'flex';
}

function openCartModal() {
  const list = document.getElementById('cartItemsList');
  if (!list) return;
  list.innerHTML = '';
  let subtotal = 0;

  cart.forEach(item => {
    subtotal += (item.price * item.qty);
    list.innerHTML += `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; border-bottom:1px solid #2a2a2a; padding-bottom:8px;">
        <div style="display:flex; align-items:center; gap:10px;">
          <img src="${item.img}" style="width:44px; height:44px; border-radius:8px; object-fit:cover;" />
          <div>
            <div style="font-size:13px; font-weight:600; color:#fff;">${item.name}</div>
            <div style="font-size:11px; color:#888;">₹${item.price} x ${item.qty}</div>
          </div>
        </div>
        <div style="font-weight:700; color:#E21B24;">₹${item.price * item.qty}</div>
      </div>
    `;
  });

  const savedProfile = JSON.parse(localStorage.getItem("kd_cust_profile") || "{}");
  if (savedProfile.name && document.getElementById('custName')) document.getElementById('custName').value = savedProfile.name;
  if (savedProfile.phone && document.getElementById('custPhone')) document.getElementById('custPhone').value = savedProfile.phone;
  if (savedProfile.address && document.getElementById('custAddress')) document.getElementById('custAddress').value = savedProfile.address;

  const deliveryCharge = (currentOrderMode === 'dinein') ? 0 : 9;
  const coinDiscount = coinsRedeemed ? 20 : 0;
  const grandTotal = Math.max(0, subtotal + deliveryCharge - appliedDiscount - coinDiscount);

  if (document.getElementById('billSubtotal')) document.getElementById('billSubtotal').innerText = `₹${subtotal}`;
  if (document.getElementById('billGrandTotal')) document.getElementById('billGrandTotal').innerText = `₹${grandTotal}`;

  setOrderMode(currentOrderMode);
  openModal('cartModal');
}

function setPaymentMethod(method) {
  activePayment = method;
  const cod = document.getElementById('codBtn');
  const upi = document.getElementById('upiBtn');
  const qr = document.getElementById('upiQrBox');
  if (cod) {
    cod.style.background = (method === 'COD') ? '#E21B24' : '#1e1e1e';
    cod.style.color = (method === 'COD') ? '#fff' : '#aaa';
  }
  if (upi) {
    upi.style.background = (method === 'UPI') ? '#E21B24' : '#1e1e1e';
    upi.style.color = (method === 'UPI') ? '#fff' : '#aaa';
  }
  if (qr) qr.style.display = (method === 'UPI') ? 'block' : 'none';
}

function toggleCoinRedemption() {
  const chk = document.getElementById('redeemCoinsCheck');
  if (!chk) return;

  const coinsUsed = localStorage.getItem("kd_coins_used") === "true";
  if (chk.checked && coinsUsed) {
    alert("❌ Aap pehle hi apne SuperCoins redeem kar chuke hain!");
    chk.checked = false;
    coinsRedeemed = false;
    const row = document.getElementById('coinsDiscountRow');
    if (row) row.style.display = 'none';
    updateCartBar();
    openCartModal();
    return;
  }

  coinsRedeemed = chk.checked;
  const row = document.getElementById('coinsDiscountRow');
  if (row) row.style.display = coinsRedeemed ? 'flex' : 'none';
  updateCartBar();
  openCartModal();
}

function applyDiscountCoupon() {
  const codeEl = document.getElementById('couponCodeInput') || document.querySelector('input[placeholder*="promo" i]');
  const code = codeEl ? codeEl.value.trim().toUpperCase() : '';

  if (!code) {
    alert("Please enter a promo code!");
    return;
  }

  const usedPromos = JSON.parse(localStorage.getItem("kd_used_promos") || "[]");
  if (usedPromos.includes(code)) {
    alert(`❌ Code "${code}" aap pehle use kar chuke hain!`);
    return;
  }

  if (typeof db !== 'undefined' && db) {
    db.ref("promos/" + code).once("value", snap => {
      const disc = snap.val();
      if (disc && Number(disc) > 0) {
        setCouponDiscount(Number(disc), code);
      } else if (code === "KD20" || code === "WELCOME" || code === "BIKASH50") {
        setCouponDiscount(20, code);
      } else {
        alert("Invalid Promo Code!");
      }
    });
  } else {
    if (code === "KD20" || code === "WELCOME" || code === "BIKASH50") {
      setCouponDiscount(20, code);
    } else {
      alert("Invalid Promo Code!");
    }
  }
}

function setCouponDiscount(amount, code) {
  appliedDiscount = amount;

  const usedPromos = JSON.parse(localStorage.getItem("kd_used_promos") || "[]");
  if (!usedPromos.includes(code)) {
    usedPromos.push(code);
    localStorage.setItem("kd_used_promos", JSON.stringify(usedPromos));
  }

  const dRow = document.getElementById('discountRow');
  const bDisc = document.getElementById('billDiscount');
  if (dRow) dRow.style.display = 'flex';
  if (bDisc) bDisc.innerText = `-₹${amount}`;
  alert(`🎉 Promo Code '${code}' Applied: ₹${amount} Discount!`);
  updateCartBar();
  openCartModal();
}

// ==================== 7. PLACE ORDER (HOME DELIVERY OR DINE-IN) ====================
function placeOrder() {
  if (!isStoreOpen) {
    alert("Sorry, the restaurant is currently closed!");
    return;
  }

  if (cart.length === 0) {
    alert("Your bag is empty! Add food items first.");
    return;
  }

  let name = "";
  let phone = "";
  let address = "";

  if (currentOrderMode === 'dinein') {
    if (!selectedTableNumber) {
      alert("Please select your Table Number first!");
      openTableSelectorModal();
      return;
    }
    const guest = document.getElementById('custTableGuestName')?.value.trim();
    name = guest || `Table Guest`;
    phone = "DINE-IN";
    address = `🍽️ DINE-IN TABLE ORDER - Table #${selectedTableNumber}`;
  } else {
    name = document.getElementById('custName')?.value.trim();
    phone = document.getElementById('custPhone')?.value.trim();
    address = document.getElementById('custAddress')?.value.trim();

    if (!name || !phone || !address) {
      alert("Please fill Name, Phone and Complete Delivery Address.");
      return;
    }
    localStorage.setItem("kd_cust_profile", JSON.stringify({ name, phone, address }));
  }

  if (coinsRedeemed) {
    localStorage.setItem("kd_coins_used", "true");
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const deliveryCharge = (currentOrderMode === 'dinein') ? 0 : 9;
  const coinDiscount = coinsRedeemed ? 20 : 0;
  const grandTotal = Math.max(0, subtotal + deliveryCharge - appliedDiscount - coinDiscount);
  const generatedId = "KD" + Math.floor(100000 + Math.random() * 900000);

  const orderPayload = {
    orderId: generatedId,
    orderType: currentOrderMode === 'dinein' ? `Table #${selectedTableNumber}` : 'Home Delivery',
    tableNumber: selectedTableNumber || null,
    customerName: name,
    phone: phone,
    address: address,
    items: cart,
    grandTotal: grandTotal,
    paymentMode: activePayment,
    coinsUsed: coinsRedeemed,
    status: "1. Order Confirmed",
    stage: 1,
    eta: (currentOrderMode === 'dinein') ? 15 : 30,
    timestamp: Date.now()
  };

  if (typeof db !== 'undefined' && db) {
    const newOrderRef = db.ref("orders").push();
    newOrderRef.set(orderPayload);
    if (phone !== "DINE-IN") {
      db.ref("customer_history/" + phone + "/" + newOrderRef.key).set(orderPayload);
    }
  }

  cart = [];
  appliedDiscount = 0;
  coinsRedeemed = false;
  updateCartBar();
  closeModal('cartModal');

  const animModal = document.getElementById("order-success-modal");
  const succSub = document.getElementById("orderSuccessSub");
  if (succSub) {
    succSub.innerText = (currentOrderMode === 'dinein') 
      ? `Table #${selectedTableNumber} ke liye order kitchen me bhej diya gaya hai!`
      : `Aapka swadist khana taiyar ho raha hai!`;
  }
  if (animModal) {
    animModal.style.display = "flex";
  } else {
    openOrderHistoryModal();
  }
}

// ==================== 8. ORDERS HISTORY & LIVE TRACKING ====================
function openOrderHistoryModal() {
  const profile = JSON.parse(localStorage.getItem("kd_cust_profile") || "{}");
  const phone = profile.phone;

  const container = document.getElementById('orderHistoryContainer');
  openModal('orderHistoryModal');

  if (!container) return;
  container.innerHTML = '<p style="text-align:center; color:#888; margin-top:20px;">Fetching orders...</p>';

  if (!phone || !db) {
    container.innerHTML = `
      <div style="text-align:center; padding:30px 0;">
        <i class="fa-solid fa-user-lock" style="font-size:36px; color:#444; margin-bottom:10px;"></i>
        <p style="font-size:13px; color:#aaa;">Please save your mobile number in Account tab to view orders.</p>
        <button class="admin-btn btn-primary" style="margin-top:12px;" onclick="closeModal('orderHistoryModal'); switchNavTab('account');">Open Account</button>
      </div>
    `;
    return;
  }

  db.ref("customer_history/" + phone).on("value", snapshot => {
    const data = snapshot.val();
    container.innerHTML = '';

    if (!data) {
      container.innerHTML = `<p style="font-size:13px; color:#aaa; text-align:center; padding:20px;">No orders found for +91 ${phone}</p>`;
    } else {
      Object.keys(data).reverse().forEach(key => {
        const ord = data[key];
        const primaryImg = (ord.items && ord.items[0] && ord.items[0].img) ? ord.items[0].img : "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=500";
        const itemsList = ord.items ? ord.items.map(i => `${i.name} (x${i.qty})`).join(", ") : "Items";
        const isDelivered = ord.stage === 4 || (ord.status && ord.status.includes("Delivered"));
        const isCancelled = ord.stage === 0 || (ord.status && ord.status.includes("Cancelled"));

        let statusBadge = `<span style="font-size:11px; font-weight:700; padding:3px 8px; border-radius:6px; background:#372213; color:#f97316;">🍳 ${ord.status || 'Preparing'}</span>`;
        if (isDelivered) {
          statusBadge = `<span style="font-size:11px; font-weight:700; padding:3px 8px; border-radius:6px; background:#143423; color:#22c55e;">✅ Done</span>`;
        } else if (isCancelled) {
          statusBadge = `<span style="font-size:11px; font-weight:700; padding:3px 8px; border-radius:6px; background:#361517; color:#ef4444;">✖ Cancelled</span>`;
        }

        container.innerHTML += `
          <div class="order-history-card" style="background:#1e1e1e; border-radius:12px; padding:12px; margin-bottom:12px; border:1px solid #2a2a2a;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span style="font-size:12px; font-weight:700; color:#E21B24;">#${ord.orderId}</span>
              ${statusBadge}
            </div>
            <div style="display:flex; gap:10px; align-items:center; margin-bottom:8px;">
              <img src="${primaryImg}" style="width:48px; height:48px; border-radius:8px; object-fit:cover;" />
              <div style="flex:1;">
                <div style="font-size:13px; font-weight:700; color:#fff;">${itemsList}</div>
                <div style="font-size:12px; font-weight:700; color:#E21B24; margin-top:2px;">₹${ord.grandTotal} (${ord.paymentMode})</div>
              </div>
            </div>
            ${(!isDelivered && !isCancelled) ? `
              <div style="background:#261012; border:1px solid #4a1519; padding:8px 12px; border-radius:8px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:12px; font-weight:600; color:#ff6b6b;">⏱️ ETA: ~${ord.eta || 25} Mins</span>
                <button class="add-btn" onclick="openLiveTrackingPopup('${key}', '${phone}')">Live Track 📍</button>
              </div>
            ` : ''}
          </div>
        `;
      });
    }
  });
}

function openLiveTrackingPopup(key, phone) {
  openModal('trackingModal');
  const content = document.getElementById('trackingContent');
  if (!content) return;

  if (db && phone && key) {
    db.ref("customer_history/" + phone + "/" + key).on("value", snap => {
      const ord = snap.val();
      if (!ord) return;
      const stage = Number(ord.stage) || 1;

      content.innerHTML = `
        <div style="background:#261012; padding:12px 14px; border-radius:12px; margin-bottom:16px; border:1px solid #E21B24;">
          <div style="font-size:12px; color:#E21B24; font-weight:700;">ORDER ID: #${ord.orderId}</div>
          <div style="font-size:16px; font-weight:800; color:#fff; margin:2px 0;">₹${ord.grandTotal} (${ord.paymentMode})</div>
          <div style="font-size:12px; color:#aaa;">${stage === 0 ? 'Status: Cancelled' : `Estimated Delivery: ~${ord.eta || 30} Mins`}</div>
        </div>

        ${stage === 0 ? `
          <div style="background:#fee2e2; border:1px solid #f87171; border-radius:12px; padding:14px; text-align:center; color:#991b1b; font-weight:700; margin-bottom:16px;">
            ⚠️ This order has been cancelled.
          </div>
        ` : `
          <div style="display:flex; flex-direction:column; gap:14px; margin-bottom:20px; background:#1e1e1e; padding:14px; border-radius:14px; border:1px solid #333;">
            <div style="display:flex; align-items:center; gap:12px; opacity:${stage >= 1 ? '1' : '0.35'};">
              <div style="width:28px; height:28px; border-radius:50%; background:${stage >= 1 ? '#E21B24' : '#444'}; color:#fff; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:12px;">1</div>
              <div>
                <div style="font-weight:700; font-size:13px; color:#fff;">Order Confirmed</div>
                <div style="font-size:11px; color:#888;">Restaurant received your order</div>
              </div>
            </div>

            <div style="display:flex; align-items:center; gap:12px; opacity:${stage >= 2 ? '1' : '0.35'};">
              <div style="width:28px; height:28px; border-radius:50%; background:${stage >= 2 ? '#E21B24' : '#444'}; color:#fff; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:12px;">2</div>
              <div>
                <div style="font-weight:700; font-size:13px; color:#fff;">Kitchen Preparing 🍳</div>
                <div style="font-size:11px; color:#888;">Food is freshly cooking</div>
              </div>
            </div>

            <div style="display:flex; align-items:center; gap:12px; opacity:${stage >= 3 ? '1' : '0.35'};">
              <div style="width:28px; height:28px; border-radius:50%; background:${stage >= 3 ? '#E21B24' : '#444'}; color:#fff; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:12px;">3</div>
              <div>
                <div style="font-weight:700; font-size:13px; color:#fff;">Out for Serving / Delivery 🛵</div>
                <div style="font-size:11px; color:#888;">Order on the way</div>
              </div>
            </div>

            <div style="display:flex; align-items:center; gap:12px; opacity:${stage >= 4 ? '1' : '0.35'};">
              <div style="width:28px; height:28px; border-radius:50%; background:${stage >= 4 ? '#E21B24' : '#444'}; color:#fff; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:12px;">4</div>
              <div>
                <div style="font-weight:700; font-size:13px; color:#fff;">Served / Delivered 🎉</div>
                <div style="font-size:11px; color:#888;">Enjoy your hot & fresh meal!</div>
              </div>
            </div>
          </div>
        `}

        <a href="tel:8453270362" style="display:flex; align-items:center; justify-content:center; gap:8px; background:#10b981; color:#fff; text-decoration:none; padding:12px; border-radius:10px; font-weight:700; font-size:13px;">
          📞 Call Restaurant Support (8453270362)
        </a>
      `;
    });
  }
}

// ==================== 9. ADMIN PANEL & MASTER PIN ====================
function openAdminGateway() {
  openModal('adminModal');
  const lock = document.getElementById('adminLockScreen');
  const dash = document.getElementById('adminDashboard');
  const pinInput = document.getElementById('adminPinInput');
  if (pinInput) pinInput.value = '';
  if (lock) lock.style.display = 'block';
  if (dash) dash.style.display = 'none';
}

function unlockAdminWithPin() {
  const pinInput = document.getElementById('adminPinInput');
  const pin = pinInput ? pinInput.value.trim() : '';
  const MASTER_KEY = "KD@1234";

  if (pin === MASTER_KEY) {
    adminRingerAudio.play().then(() => {
      adminRingerAudio.pause();
      adminRingerAudio.currentTime = 0;
      isAudioUnlocked = true;
    }).catch(e => console.log("Audio unlock failed: ", e));

    const lock = document.getElementById('adminLockScreen');
    const dash = document.getElementById('adminDashboard');
    if (lock) lock.style.display = 'none';
    if (dash) dash.style.display = 'block';

    loadAdminOrdersList();
    renderAdminMenuItems();
  } else {
    alert("Access Denied! Incorrect Password.");
    if (pinInput) pinInput.value = '';
  }
}

function loadAdminOrdersList() {
  const container = document.getElementById('adminLiveOrdersList');
  if (!container || !db) return;

  db.ref("orders").on("value", snapshot => {
    const data = snapshot.val();
    container.innerHTML = '';
    let count = 0;
    let rev = 0;
    let hasPendingOrders = false;

    if (!data) {
      container.innerHTML = '<p style="color:#94a3b8; text-align:center; padding:15px;">No active orders.</p>';
      adminRingerAudio.pause();
      adminRingerAudio.currentTime = 0;
      return;
    }

    Object.keys(data).reverse().forEach(k => {
      const ord = data[k];

      if (Number(ord.stage) === 1) {
        hasPendingOrders = true;
      }

      count++;
      rev += Number(ord.grandTotal || 0);
      const itemsStr = ord.items ? ord.items.map(i => `${i.name} (x${i.qty})`).join(", ") : "Items";
      const isCancelled = Number(ord.stage) === 0;

      const orderTypeTag = ord.tableNumber 
        ? `<span style="background:#E21B24; color:#fff; font-size:10px; padding:2px 6px; border-radius:4px; font-weight:bold;">🍽️ TABLE #${ord.tableNumber}</span>`
        : `<span style="background:#0284c7; color:#fff; font-size:10px; padding:2px 6px; border-radius:4px; font-weight:bold;">🛵 DELIVERY</span>`;

      container.innerHTML += `
        <div style="background:${isCancelled ? '#2b1d1d' : '#1e293b'}; border-radius:12px; padding:12px; margin-bottom:10px; border:1px solid ${isCancelled ? '#7f1d1d' : '#334155'}; color:#fff;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="display:flex; align-items:center; gap:6px;">
                <strong style="font-size:14px;">${ord.customerName || 'Customer'} (₹${ord.grandTotal})</strong>
                ${orderTypeTag}
              </div>
              <div style="font-size:11px; color:#94a3b8;">📍 ${ord.address || 'Bengbari'}</div>
            </div>
            <span style="color:#E21B24; font-weight:bold; font-size:12px;">#${ord.orderId}</span>
          </div>
          <div style="font-size:12px; color:#cbd5e1; margin:6px 0;">🍲 ${itemsStr}</div>
          <div style="font-size:11px; margin-bottom:6px; color:${isCancelled ? '#ef4444' : '#38bdf8'}; font-weight:bold;">Status: ${ord.status || 'Pending'}</div>
          <div style="display:flex; gap:6px; flex-wrap:wrap; margin-top:8px;">
            ${(ord.phone && ord.phone !== "DINE-IN") ? `
              <a href="tel:${ord.phone}" class="admin-btn" style="background:#0284c7; color:#fff; text-decoration:none; padding:5px 10px; border-radius:6px; font-size:11px; font-weight:bold;">📞 Call</a>
              <a href="https://wa.me/91${ord.phone.replace(/[^0-9]/g, '')}?text=Namaste%20${encodeURIComponent(ord.customerName || 'Customer')},%20S%26A%20Family%20Restaurant%20se%20aapka%20order%20confirm%20ho%20gaya%20hai!" target="_blank" class="admin-btn" style="background:#25d366; color:#fff; text-decoration:none; padding:5px 10px; border-radius:6px; font-size:11px; font-weight:bold;">💬 WhatsApp</a>
            ` : ''}
            ${(!isCancelled ? `
              <button onclick="setAdminOrderStatus('${k}', '${ord.orderId}', '${ord.phone}', 2, '2. In Kitchen')" style="background:#e11d48; color:#fff; border:none; padding:5px 10px; border-radius:6px; font-size:11px; font-weight:bold; cursor:pointer;">🍳 Kitchen</button>
              <button onclick="setAdminOrderStatus('${k}', '${ord.orderId}', '${ord.phone}', 3, '3. Serving / Out')" style="background:#f59e0b; color:#fff; border:none; padding:5px 10px; border-radius:6px; font-size:11px; font-weight:bold; cursor:pointer;">🛵 Serve/Out</button>
              <button onclick="setAdminOrderStatus('${k}', '${ord.orderId}', '${ord.phone}', 4, '4. Delivered / Done')" style="background:#10b981; color:#fff; border:none; padding:5px 10px; border-radius:6px; font-size:11px; font-weight:bold; cursor:pointer;">✅ Done</button>
              <button onclick="setAdminOrderStatus('${k}', '${ord.orderId}', '${ord.phone}', 0, 'Cancelled by Restaurant')" style="background:#dc2626; color:#fff; border:none; padding:5px 10px; border-radius:6px; font-size:11px; font-weight:bold; cursor:pointer;">❌ Cancel</button>
            ` : '')}
            <button onclick="deleteAdminOrder('${k}')" style="background:#475569; color:#fff; border:none; padding:5px 8px; border-radius:6px; font-size:11px; cursor:pointer;">🗑️</button>
          </div>
        </div>
      `;
    });

    if (hasPendingOrders && isAudioUnlocked) {
      adminRingerAudio.play().catch(e => console.log("Audio play error: ", e));
    } else {
      adminRingerAudio.pause();
      adminRingerAudio.currentTime = 0;
    }

    if (document.getElementById('statTotalSales')) document.getElementById('statTotalSales').innerText = `₹${rev}`;
    if (document.getElementById('statOrderCount')) document.getElementById('statOrderCount').innerText = count;
  });
}

function setAdminOrderStatus(key, orderId, phone, stage, statusText) {
  const updates = { stage: Number(stage), status: statusText };
  if (db) {
    db.ref("orders/" + key).update(updates);
    if (phone && phone !== "DINE-IN") {
      db.ref("customer_history/" + phone).once("value", snap => {
        snap.forEach(child => {
          if (child.val().orderId === orderId) {
            child.ref.update(updates);
          }
        });
      });
    }
  }
}

function deleteAdminOrder(key) {
  if (confirm("Delete this order?") && db) {
    db.ref("orders/" + key).remove();
  }
}

// ==================== 10. MENU MANAGEMENT ====================
let adminUploadBase64 = "";
let editUploadBase64 = "";

function renderAdminMenuItems() {
  const container = document.getElementById('adminMenuItemsList');
  if (!container) return;
  container.innerHTML = '';

  menuCatalog.forEach((item) => {
    container.innerHTML += `
      <div id="adminDishRow_${item.id}" style="background:#0f172a; border-radius:10px; padding:12px; margin-bottom:10px; border:1px solid #334155; color:#fff;">
        <div style="display:flex; justify-content:space-between; align-items:center; gap:10px;">
          <img src="${item.img}" style="width:45px; height:45px; border-radius:8px; object-fit:cover; flex-shrink:0;" />
          <div style="flex:1;">
            <div style="font-weight:700; font-size:13px;">${item.name}</div>
            <div style="font-size:12px; color:#38bdf8;">₹${item.price} <span style="font-size:10px; color:#94a3b8;">(${item.cat})</span></div>
          </div>
          <button onclick="openDishEditBox('${item.id}')" style="background:#38bdf8; color:#0f172a; border:none; padding:6px 12px; border-radius:6px; font-weight:700; font-size:11px; cursor:pointer;">✏️ Edit</button>
          <button onclick="toggleDishStock('${item.id}')" style="background:${item.inStock ? '#10b981' : '#ef4444'}; color:#fff; border:none; padding:6px 10px; border-radius:6px; font-weight:700; font-size:11px; cursor:pointer;">${item.inStock ? 'In Stock' : 'Sold Out'}</button>
          <button onclick="deleteMenuItem('${item.id}')" style="background:#475569; color:#fff; border:none; padding:6px 8px; border-radius:6px; font-size:11px; cursor:pointer;">🗑️</button>
        </div>

        <div id="dishEditForm_${item.id}" style="display:none; margin-top:12px; padding-top:12px; border-top:1px dashed #334155;">
          <label style="font-size:11px; color:#94a3b8;">Dish Name:</label>
          <input type="text" id="editName_${item.id}" value="${item.name}" class="form-input" style="background:#1e293b; color:#fff; border-color:#475569; margin-bottom:8px;" />
          
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:8px;">
            <div>
              <label style="font-size:11px; color:#94a3b8;">Price (₹):</label>
              <input type="number" id="editPrice_${item.id}" value="${item.price}" class="form-input" style="background:#1e293b; color:#fff; border-color:#475569;" />
            </div>
            <div>
              <label style="font-size:11px; color:#94a3b8;">Category:</label>
              <select id="editCat_${item.id}" class="form-input" style="background:#1e293b; color:#fff; border-color:#475569;">
                <option value="momos" ${item.cat === 'momos' ? 'selected' : ''}>Momos</option>
                <option value="rolls" ${item.cat === 'rolls' ? 'selected' : ''}>Rolls</option>
                <option value="chicken" ${item.cat === 'chicken' ? 'selected' : ''}>Chicken</option>
                <option value="pork" ${item.cat === 'pork' ? 'selected' : ''}>Pork</option>
                <option value="chow_thukpa" ${item.cat === 'chow_thukpa' ? 'selected' : ''}>Chow/Soup</option>
                <option value="cakes" ${item.cat === 'cakes' ? 'selected' : ''}>Cakes</option>
                <option value="drinks" ${item.cat === 'drinks' ? 'selected' : ''}>Drinks</option>
              </select>
            </div>
          </div>

          <label style="font-size:11px; color:#94a3b8;">Upload New Photo:</label>
          <input type="file" accept="image/*" class="form-input" style="background:#1e293b; color:#fff; border-color:#475569; margin-bottom:6px;" onchange="previewEditImage(this, '${item.id}')" />

          <label style="font-size:11px; color:#94a3b8;">Or Image URL Link:</label>
          <input type="text" id="editImgUrl_${item.id}" value="${item.img}" class="form-input" style="background:#1e293b; color:#fff; border-color:#475569; margin-bottom:10px;" />

          <img id="editPreviewImg_${item.id}" src="${item.img}" style="width:100%; height:110px; object-fit:cover; border-radius:8px; margin-bottom:10px;" />

          <div style="display:flex; gap:8px;">
            <button onclick="saveDishEdits('${item.id}')" class="admin-btn btn-green" style="flex:1;">💾 Save Changes</button>
            <button onclick="closeDishEditBox('${item.id}')" class="admin-btn btn-primary" style="background:#475569; flex:1;">Cancel</button>
          </div>
        </div>
      </div>
    `;
  });
}

function openDishEditBox(id) {
  const box = document.getElementById(`dishEditForm_${id}`);
  if (box) box.style.display = 'block';
}

function closeDishEditBox(id) {
  const box = document.getElementById(`dishEditForm_${id}`);
  if (box) box.style.display = 'none';
}

function previewEditImage(input, id) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      editUploadBase64 = e.target.result;
      const preview = document.getElementById(`editPreviewImg_${id}`);
      if (preview) preview.src = e.target.result;
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function saveDishEdits(id) {
  const item = menuCatalog.find(d => d.id === id);
  if (!item) return;

  const newName = document.getElementById(`editName_${id}`).value.trim();
  const newPrice = Number(document.getElementById(`editPrice_${id}`).value);
  const newCat = document.getElementById(`editCat_${id}`).value;
  const newImgUrl = document.getElementById(`editImgUrl_${id}`).value.trim();

  if (!newName || !newPrice) {
    alert("Please enter valid name and price!");
    return;
  }

  item.name = newName;
  item.price = newPrice;
  item.mrp = newPrice + 40;
  item.cat = newCat;
  item.img = editUploadBase64 || newImgUrl || item.img;

  editUploadBase64 = "";
  saveMenuToStorageAndCloud();
  alert("Dish updated successfully!");
}

function toggleDishStock(id) {
  const item = menuCatalog.find(d => d.id === id);
  if (item) {
    item.inStock = !item.inStock;
    saveMenuToStorageAndCloud();
  }
}

function deleteMenuItem(id) {
  if (confirm("Delete this dish from menu permanently?")) {
    menuCatalog = menuCatalog.filter(d => d.id !== id);
    saveMenuToStorageAndCloud();
  }
}

function adminSaveNewDish() {
  const nameInput = document.getElementById('newDishName');
  const priceInput = document.getElementById('newDishPrice');
  const catSelect = document.getElementById('newDishCat');
  const urlInput = document.getElementById('newDishImgUrl');

  const name = nameInput ? nameInput.value.trim() : '';
  const price = priceInput ? Number(priceInput.value) : 0;
  const cat = catSelect ? catSelect.value : 'momos';
  const imgUrl = (urlInput ? urlInput.value.trim() : '') || adminUploadBase64 || "https://images.unsplash.com/photo-1544025162-d76694265947?w=500";

  if (!name || !price) {
    alert("Please enter both dish name and price.");
    return;
  }

  const newDish = {
    id: "d_" + Date.now(),
    name: name,
    price: price,
    mrp: price + 40,
    cat: cat,
    inStock: true,
    img: imgUrl
  };

  menuCatalog.unshift(newDish);
  saveMenuToStorageAndCloud();
  alert("✅ New dish successfully added to menu!");

  if (nameInput) nameInput.value = '';
  if (priceInput) priceInput.value = '';
  if (urlInput) urlInput.value = '';
  adminUploadBase64 = '';
}

function previewAdminDishUpload(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      adminUploadBase64 = e.target.result;
    };
    reader.readAsDataURL(input.files[0]);
  }
}

document.addEventListener('change', function(e) {
  if (e.target && e.target.type === 'file' && e.target.closest('#adminModal, #adminDashboard')) {
    previewAdminDishUpload(e.target);
  }
});

// ==================== 11. CONTROLS ====================
function adminCreateCoupon() {
  const codeEl = document.getElementById('newCouponCode');
  const discEl = document.getElementById('newCouponDiscount');

  const code = codeEl ? codeEl.value.trim().toUpperCase() : '';
  const disc = discEl ? Number(discEl.value) : 0;

  if (!code || !disc) {
    alert("Please enter promo code and discount amount!");
    return;
  }

  if (db) {
    db.ref("promos/" + code).set(disc).then(() => {
      alert(`🎉 Promo Code '${code}' (₹${disc} OFF) created and synced online!`);
      if (codeEl) codeEl.value = '';
      if (discEl) discEl.value = '';
    });
  } else {
    localStorage.setItem("kd_promo_" + code, disc);
    alert(`Promo Code '${code}' saved locally!`);
  }
}

function toggleStoreStatus() {
  isStoreOpen = !isStoreOpen;
  if (db) {
    db.ref("store_status").set(isStoreOpen);
  }
  updateStoreStatusUI(isStoreOpen);
  renderFoodItems(menuCatalog);
  alert(`Store is now ${isStoreOpen ? 'OPEN' : 'CLOSED'}!`);
}

function editPromoBanner() {
  const currentTitle = document.getElementById('bannerTitle')?.innerText || "K.D RABHA SPECIAL";
  const newHeading = prompt("Enter new Offer / Festival headline:", currentTitle);
  if (newHeading && newHeading.trim() !== '') {
    const val = newHeading.trim();
    if (db) {
      db.ref("banner_headline").set(val);
    }
    updateBannerUI(val);
    alert("Banner headline updated across all phones!");
  }
}

function assignVipBadge() {
  const phEl = document.getElementById('vipCustPhone');
  const ph = phEl ? phEl.value.trim() : '';
  if (ph) {
    if (db) {
      db.ref("customers/" + ph + "/vip").set(true);
    }
    alert(`Customer +91 ${ph} is upgraded to VIP Gold Member!`);
    if (phEl) phEl.value = '';
  } else {
    alert("Please enter mobile number!");
  }
}

function setupBannerSlider() {
  const deals = [
    { title: "K.D RABHA SPECIAL", sub: "Freshly Made, Especially for You in Bengbari!" },
    { title: "FESTIVAL OFFER 🎉", sub: "Use Code KD20 to get Flat ₹20 OFF on orders!" },
    { title: "MOMO CELEBRATION 🥟", sub: "Fresh Steamed & Fried Momo starting at ₹120 only!" }
  ];
  let curr = 0;
  const bannerBox = document.querySelector('.promo-carousel');
  if (!bannerBox) return;

  setInterval(() => {
    curr = (curr + 1) % deals.length;
    const titleEl = bannerBox.querySelector('h2, #bannerTitle');
    const subEl = bannerBox.querySelector('p, #bannerSub');
    if (titleEl) titleEl.innerText = deals[curr].title;
    if (subEl) subEl.innerText = deals[curr].sub;
  }, 4000);
}

// ==================== 12. CAKE STUDIO & ACCOUNT ====================
function openCakeStudio() {
  openModal('cakeStudioModal');
}

function selectCakeWeight(weight, price, el) {
  selectedCakeWeight = weight;
  selectedCakePrice = price;
  document.querySelectorAll('#cakeStudioModal .weight-pill').forEach(p => p.classList.remove('active'));
  if (el) el.classList.add('active');
}

function addCustomCakeToCart() {
  const flavor = document.getElementById('cakeFlavorSelect').value;
  const msg = document.getElementById('cakeCustomText').value.trim();
  const cakeTitle = `🎂 Custom Cake: ${flavor} (${selectedCakeWeight} Kg)` + (msg ? ` [Msg: ${msg}]` : '');

  cart.push({
    id: "cake_" + Date.now(),
    name: cakeTitle,
    price: selectedCakePrice,
    qty: 1,
    img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500"
  });

  updateCartBar();
  closeModal('cakeStudioModal');
  openCartModal();
}

function previewCakeUpload(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const p = document.getElementById('cakePhotoPreview');
      if (p) {
        p.src = e.target.result;
        p.style.display = 'block';
      }
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function openSavedItemsModal() {
  openModal('wishlistModal');
  const container = document.getElementById('wishlistItemsContainer');
  if (!container) return;

  const wishedItems = menuCatalog.filter(d => wishlist.includes(d.id));
  if (wishedItems.length === 0) {
    container.innerHTML = '<p style="text-align:center; color:#888; margin-top:30px;">No saved items in your wishlist.</p>';
  } else {
    container.innerHTML = wishedItems.map(d => `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; padding-bottom:8px; border-bottom:1px solid #2a2a2a;">
        <div style="display:flex; align-items:center; gap:8px;">
          <img src="${d.img}" style="width:40px; height:40px; border-radius:6px; object-fit:cover;" />
          <div>
            <div style="font-size:13px; font-weight:700; color:#fff;">${d.name}</div>
            <div style="font-size:12px; color:#E21B24; font-weight:700;">₹${d.price}</div>
          </div>
        </div>
        <button class="add-btn" onclick="addToCart('${d.id}', '${d.name}', ${d.price}, '${d.img}')">ADD +</button>
      </div>
    `).join('');
  }
}

function saveCustomerAccount() {
  const name = document.getElementById('accInputName')?.value.trim() || '';
  const phone = document.getElementById('accInputPhone')?.value.trim() || '';
  const address = document.getElementById('accInputAddress')?.value.trim() || '';

  if (!phone) {
    alert("Please enter mobile number for sync.");
    return;
  }

  const profile = { name, phone, address };
  localStorage.setItem("kd_cust_profile", JSON.stringify(profile));

  if (document.getElementById('accNameDisplay') && name) document.getElementById('accNameDisplay').innerText = name;
  if (document.getElementById('accPhoneDisplay') && phone) document.getElementById('accPhoneDisplay').innerText = "+91 " + phone;

  if (db) {
    db.ref("customers/" + phone + "/profile").set(profile);
  }

  alert("Account details saved successfully!");
  closeModal('accountModal');
}

function uploadCustomerAvatar(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = document.getElementById('userAvatarImg');
      if (img) img.src = e.target.result;
    };
    reader.readAsDataURL(input.files[0]);
  }
}

// ==================== 13. NAVIGATION TABS ====================
function switchNavTab(tab) {
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));

  if (tab === 'home') {
    document.getElementById('tabHome')?.classList.add('active');
    closeModal('orderHistoryModal');
    closeModal('accountModal');
    renderFoodItems(menuCatalog);
  } else if (tab === 'cakes') {
    document.getElementById('tabCakes')?.classList.add('active');
    openCakeStudio();
  } else if (tab === 'orders') {
    document.getElementById('tabOrders')?.classList.add('active');
    openOrderHistoryModal();
  } else if (tab === 'account') {
    document.getElementById('tabAccount')?.classList.add('active');
    const saved = JSON.parse(localStorage.getItem("kd_cust_profile") || "{}");
    if (saved.name && document.getElementById('accInputName')) document.getElementById('accInputName').value = saved.name;
    if (saved.phone && document.getElementById('accInputPhone')) document.getElementById('accInputPhone').value = saved.phone;
    if (saved.address && document.getElementById('accInputAddress')) document.getElementById('accInputAddress').value = saved.address;
    if (saved.name && document.getElementById('accNameDisplay')) document.getElementById('accNameDisplay').innerText = saved.name;
    if (saved.phone && document.getElementById('accPhoneDisplay')) document.getElementById('accPhoneDisplay').innerText = "+91 " + saved.phone;
    openModal('accountModal');
  }
}

// ==================== 14. INITIAL RUN ====================
function hideSplashScreen() {
  const splash = document.getElementById("custom-splash-screen");
  if (splash && splash.style.display !== "none") {
    splash.style.opacity = "0";
    setTimeout(() => {
      splash.style.display = "none";
    }, 300);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  renderFoodItems(menuCatalog);
  setupBannerSlider();
  detectTableFromUrl();
  hideSplashScreen();

  const profile = JSON.parse(localStorage.getItem("kd_cust_profile") || "{}");
  if (profile.name && document.getElementById('accNameDisplay')) document.getElementById('accNameDisplay').innerText = profile.name;
  if (profile.phone && document.getElementById('accPhoneDisplay')) document.getElementById('accPhoneDisplay').innerText = "+91 " + profile.phone;
});

window.addEventListener("load", hideSplashScreen);
