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
    }).catch(() => {});
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

// ==================== TABLE QR & ORDER MODE SYSTEM ====================
let currentOrderMode = 'delivery'; // 'delivery' or 'dinein'
let selectedTableNumber = null;

function detectTableFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const table = params.get('table');
  if (table) {
    confirmTableNumber(table, false);
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

// ==================== 2. MENU DATA & STORAGE (TOP BESTSELLERS FIRST) ====================
const defaultMenu = [
  // --- TOP BESTSELLERS / MOST ORDERED ---
  { id: "nb_m1", name: "Chicken Momo", price: 60, mrp: 80, cat: "momos", isBestseller: true, inStock: true, img: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=500" },
  { id: "nb_r2", name: "Chicken Roll", price: 80, mrp: 100, cat: "rolls", isBestseller: true, inStock: true, img: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500" },
  { id: "nb_r3", name: "Baba Roll (Special)", price: 120, mrp: 150, cat: "rolls", isBestseller: true, inStock: true, img: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=500" },
  { id: "nb_c2", name: "Chicken Chowmein (Full)", price: 100, mrp: 130, cat: "chow_thukpa", isBestseller: true, inStock: true, img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500" },
  { id: "nb_t8", name: "Cold Coffee (Special)", price: 70, mrp: 90, cat: "drinks", isBestseller: true, inStock: true, img: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=500" },

  // --- TEA & COFFEE ---
  { id: "nb_t1", name: "Black Tea", price: 10, mrp: 15, cat: "drinks", inStock: true, img: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500" },
  { id: "nb_t2", name: "Milk Tea (Normal)", price: 10, mrp: 15, cat: "drinks", inStock: true, img: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500" },
  { id: "nb_t3", name: "Milk Tea (Special)", price: 20, mrp: 25, cat: "drinks", inStock: true, img: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500" },
  { id: "nb_t4", name: "Black Coffee", price: 20, mrp: 30, cat: "drinks", inStock: true, img: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500" },
  { id: "nb_t5", name: "Milk Coffee (Normal)", price: 30, mrp: 40, cat: "drinks", inStock: true, img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500" },
  { id: "nb_t6", name: "Milk Coffee (Special)", price: 40, mrp: 50, cat: "drinks", inStock: true, img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500" },
  { id: "nb_t7", name: "Cold Coffee (Normal)", price: 50, mrp: 60, cat: "drinks", inStock: true, img: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=500" },

  // --- ROLLS ---
  { id: "nb_r1", name: "Veg Roll", price: 40, mrp: 50, cat: "rolls", inStock: true, img: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500" },

  // --- CHOWMEIN ---
  { id: "nb_c1", name: "Chicken Chowmein (Half)", price: 70, mrp: 90, cat: "chow_thukpa", inStock: true, img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500" },
  { id: "nb_c3", name: "Veg Chowmein (Half)", price: 40, mrp: 50, cat: "chow_thukpa", inStock: true, img: "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=500" },
  { id: "nb_c4", name: "Veg Chowmein (Full)", price: 60, mrp: 80, cat: "chow_thukpa", inStock: true, img: "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=500" },
  { id: "nb_c5", name: "Egg Chowmein (Half)", price: 50, mrp: 60, cat: "chow_thukpa", inStock: true, img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500" },
  { id: "nb_c6", name: "Egg Chowmein (Full)", price: 70, mrp: 90, cat: "chow_thukpa", inStock: true, img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500" },
  { id: "nb_c7", name: "Chicken Egg Mix Chowmein (Half)", price: 80, mrp: 100, cat: "chow_thukpa", inStock: true, img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500" },
  { id: "nb_c8", name: "Chicken Egg Mix Chowmein (Full)", price: 120, mrp: 150, cat: "chow_thukpa", inStock: true, img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500" },

  // --- MOMOS ---
  { id: "nb_m2", name: "Veg Momo", price: 50, mrp: 70, cat: "momos", inStock: true, img: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500" },

  // --- FRIED RICE ---
  { id: "nb_fr1", name: "Veg Fried Rice", price: 50, mrp: 70, cat: "chow_thukpa", inStock: true, img: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500" },
  { id: "nb_fr2", name: "Egg Fried Rice (Half)", price: 60, mrp: 80, cat: "chow_thukpa", inStock: true, img: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500" },
  { id: "nb_fr3", name: "Egg Fried Rice (Full)", price: 80, mrp: 100, cat: "chow_thukpa", inStock: true, img: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500" },
  { id: "nb_fr4", name: "Chicken Fried Rice (Half)", price: 70, mrp: 90, cat: "chow_thukpa", inStock: true, img: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500" },
  { id: "nb_fr5", name: "Chicken Fried Rice (Full)", price: 100, mrp: 130, cat: "chow_thukpa", inStock: true, img: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500" },
  { id: "nb_fr6", name: "Chicken Egg Mix Fried Rice (Half)", price: 70, mrp: 90, cat: "chow_thukpa", inStock: true, img: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500" },
  { id: "nb_fr7", name: "Chicken Egg Mix Fried Rice (Full)", price: 120, mrp: 150, cat: "chow_thukpa", inStock: true, img: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500" },

  // --- CHICKEN MAIN COURSE ---
  { id: "nb_ch1", name: "Chilli Chicken (Half)", price: 110, mrp: 140, cat: "chicken", inStock: true, img: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500" },
  { id: "nb_ch2", name: "Chilli Chicken (Full)", price: 200, mrp: 240, cat: "chicken", inStock: true, img: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500" },
  { id: "nb_ch3", name: "Chicken Gravy (Half)", price: 150, mrp: 180, cat: "chicken", inStock: true, img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500" },
  { id: "nb_ch4", name: "Chicken Gravy (Full)", price: 200, mrp: 250, cat: "chicken", inStock: true, img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500" },

  // --- PREVIOUS MENU ITEMS (KEPT SAFE AS REQUESTED) ---
  { id: "m1", name: "Chicken Steamed Momo (10 Pcs)", price: 120, mrp: 160, cat: "momos", inStock: true, img: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=500" },
  { id: "m2", name: "Chicken Fried Momo (10 Pcs)", price: 140, mrp: 180, cat: "momos", inStock: true, img: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500" },
  { id: "m3", name: "Chicken Schezwan Gravy Momo", price: 160, mrp: 200, cat: "momos", inStock: true, img: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=500" },
  { id: "m4", name: "Pork Steamed Momo (10 Pcs)", price: 130, mrp: 170, cat: "momos", inStock: true, img: "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=500" },
  { id: "m5", name: "Pork Fried Momo (10 Pcs)", price: 150, mrp: 190, cat: "momos", inStock: true, img: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500" },
  { id: "r4", name: "Crispy French Fries (Peri-Peri)", price: 80, mrp: 110, cat: "rolls", inStock: true, img: "https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500" },
  { id: "c1", name: "Chicken Butter Masala (Boneless)", price: 280, mrp: 350, cat: "chicken", inStock: true, img: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=500" },
  { id: "p1", name: "Pork Curry with Bamboo Shoot", price: 300, mrp: 380, cat: "pork", inStock: true, img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500" },
  { id: "p2", name: "Smoked Pork Dry Fry", price: 320, mrp: 400, cat: "pork", inStock: true, img: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=500" },
  { id: "ck1", name: "Chocolate Truffle Cake (1 Kg)", price: 850, mrp: 1100, cat: "cakes", inStock: true, img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500" },
  { id: "dr1", name: "Cold Drinks 750ml (Coke / Sprite)", price: 45, mrp: 50, cat: "drinks", inStock: true, img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500" }
];

let menuCatalog = defaultMenu;
try {
  const cached = localStorage.getItem("kd_live_menu");
  if (cached) {
    const parsed = JSON.parse(cached);
    if (Array.isArray(parsed) && parsed.some(d => d.id.startsWith("nb_"))) {
      menuCatalog = parsed;
    } else {
      menuCatalog = defaultMenu;
      localStorage.setItem("kd_live_menu", JSON.stringify(defaultMenu));
    }
  }
} catch(e) {}

let cart = [];
let wishlist = JSON.parse(localStorage.getItem("kd_wishlist") || "[]");
let activePayment = 'COD';
let appliedDiscount = 0;
let appliedPromoCode = "";
let coinsRedeemed = false;
let currentPdpItem = null;
let currentPortionType = 'standard';
let selectedCakeWeight = 1.0;
let selectedCakePrice = 850;
let isStoreOpen = true;

// ==================== PAYMENT SETTINGS SYNC ====================
let paymentSettings = {
  codEnabled: true,
  upiId: "6000026478@okbizaxis",
  payeeName: "S&A FAMILY RESTAURANT"
};

if (db) {
  db.ref("restaurant_menu").on("value", snapshot => {
    const cloudMenu = snapshot.val();
    if (cloudMenu && Array.isArray(cloudMenu) && cloudMenu.length > 0) {
      menuCatalog = cloudMenu;
      try { localStorage.setItem("kd_live_menu", JSON.stringify(menuCatalog)); } catch(e) {}
      renderFoodItems(menuCatalog);
      if (document.getElementById('adminDashboard')?.style.display === 'block') {
        renderAdminMenuItems();
      }
    } else {
      // Sync fresh default catalog to cloud if empty
      db.ref("restaurant_menu").set(defaultMenu);
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
    if (headline) updateBannerUI(headline);
  });

  db.ref("payment_settings").on("value", snap => {
    const val = snap.val();
    if (val) {
      paymentSettings.codEnabled = (val.codEnabled !== undefined) ? val.codEnabled : true;
      paymentSettings.upiId = val.upiId || "6000026478@okbizaxis";
      paymentSettings.payeeName = val.payeeName || "S&A FAMILY RESTAURANT";
      updatePaymentSettingsUI();
    }
  });
}

function updatePaymentSettingsUI() {
  const codBtn = document.getElementById('codBtn');
  const adminCodBtn = document.getElementById('adminCodToggleBtn');
  if (adminCodBtn) {
    adminCodBtn.innerText = paymentSettings.codEnabled ? "Cash on Delivery: ENABLED" : "Cash on Delivery: DISABLED";
    adminCodBtn.style.background = paymentSettings.codEnabled ? "#10b981" : "#ef4444";
  }

  if (codBtn) {
    codBtn.style.display = paymentSettings.codEnabled ? 'block' : 'none';
    if (!paymentSettings.codEnabled) {
      setPaymentMethod('UPI');
    }
  }

  const upiText = document.getElementById('displayUpiIdText');
  if (upiText) upiText.innerText = paymentSettings.upiId || "6000026478@okbizaxis";

  const adminUpi = document.getElementById('adminUpiInput');
  const adminName = document.getElementById('adminUpiNameInput');
  if (adminUpi) adminUpi.value = paymentSettings.upiId || "6000026478@okbizaxis";
  if (adminName) adminName.value = paymentSettings.payeeName || "S&A FAMILY RESTAURANT";
}

function toggleCodStatus() {
  paymentSettings.codEnabled = !paymentSettings.codEnabled;
  if (db) {
    db.ref("payment_settings/codEnabled").set(paymentSettings.codEnabled);
  }
  updatePaymentSettingsUI();
}

function saveAdminPaymentSettings() {
  const newUpi = document.getElementById('adminUpiInput')?.value.trim() || "6000026478@okbizaxis";
  const newName = document.getElementById('adminUpiNameInput')?.value.trim() || "S&A FAMILY RESTAURANT";

  paymentSettings.upiId = newUpi;
  paymentSettings.payeeName = newName;

  if (db) {
    db.ref("payment_settings").set(paymentSettings);
  }
  updatePaymentSettingsUI();
  alert("UPI ID and QR settings successfully updated!");
}

function copyUpiId() {
  navigator.clipboard.writeText(paymentSettings.upiId).then(() => {
    alert("UPI ID copied: " + paymentSettings.upiId);
  });
}

function launchDirectUpiPayment() {
  const step3Total = document.getElementById('step3GrandTotal')?.innerText.replace('₹', '') || '0';
  const upiUri = `upi://pay?pa=${encodeURIComponent(paymentSettings.upiId)}&pn=${encodeURIComponent(paymentSettings.payeeName)}&am=${step3Total}&cu=INR`;
  window.location.href = upiUri;
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
}

function saveMenuToStorageAndCloud() {
  try {
    localStorage.setItem("kd_live_menu", JSON.stringify(menuCatalog));
  } catch (e) {}
  if (db) {
    db.ref("restaurant_menu").set(menuCatalog);
  }
  renderFoodItems(menuCatalog);
  renderAdminMenuItems();
}

// ==================== 3. MODAL STATE ====================
let isAnyModalOpen = false;

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
    isAnyModalOpen = false;
    event.preventDefault();
  }
});

function openModal(id) {
  const m = document.getElementById(id);
  if (m) {
    m.style.setProperty('display', 'flex', 'important');
    isAnyModalOpen = true;
    pushModalState(id);
  }
}

function closeModal(id) {
  const m = document.getElementById(id);
  if (m) {
    m.style.setProperty('display', 'none', 'important');
    isAnyModalOpen = false;
  }
}

// ==================== 4. RENDER FOOD CATALOG & SEARCH ====================
function renderFoodItems(items) {
  const container = document.getElementById('foodGrid');
  if (!container) return;
  container.innerHTML = '';

  items.forEach(dish => {
    const isWished = wishlist.includes(dish.id);
    const stockBadge = dish.inStock ? '' : '<span class="out-of-stock-badge" style="position:absolute;top:8px;left:8px;background:#ef4444;color:#fff;font-size:10px;padding:2px 6px;border-radius:4px;font-weight:bold;z-index:2;">SOLD OUT</span>';
    
    // Bestseller Badge
    const bestsellerBadge = dish.isBestseller ? '<span style="position:absolute;top:8px;right:8px;background:#f59e0b;color:#000;font-size:10px;padding:2px 7px;border-radius:4px;font-weight:800;z-index:2;box-shadow:0 2px 5px rgba(0,0,0,0.5);">🔥 BESTSELLER</span>' : '';

    const addBtnHtml = (dish.inStock && isStoreOpen)
      ? `<button class="add-btn" onclick="event.stopPropagation(); addToCart('${dish.id}', '${dish.name}', ${dish.price}, '${dish.img}')">ADD +</button>`
      : `<button class="add-btn" style="background:#262626; color:#777; border-color:#333;" disabled>${isStoreOpen ? 'SOLD OUT' : 'CLOSED'}</button>`;

    container.innerHTML += `
      <div class="food-card" onclick="openProductDetail('${dish.id}')">
        <div class="dish-img-wrap" style="position:relative;">
          <img src="${dish.img}" alt="${dish.name}" loading="lazy" />
          ${stockBadge}
          ${bestsellerBadge}
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
  alert("Voice Search: Say dish name (e.g. 'Chicken Momo' or 'Chicken Roll')");
}

// ==================== 5. PDP & DYNAMIC COMBO ====================
function calculateDoubleCombo(basePrice) {
  const doubleRaw = basePrice * 2;
  const comboDiscount = Math.round(doubleRaw * 0.05);
  return doubleRaw - comboDiscount;
}

function openProductDetail(dishId) {
  const dish = menuCatalog.find(d => d.id === dishId);
  if (!dish) return;
  currentPdpItem = dish;
  currentPortionType = 'standard';

  if (document.getElementById('pdpImg')) document.getElementById('pdpImg').src = dish.img;
  if (document.getElementById('pdpTitle')) document.getElementById('pdpTitle').innerText = dish.name;
  if (document.getElementById('pdpPrice')) document.getElementById('pdpPrice').innerText = `₹${dish.price}`;
  if (document.getElementById('pdpMrp')) document.getElementById('pdpMrp').innerText = `₹${dish.mrp || (dish.price + 40)}`;

  const comboPrice = calculateDoubleCombo(dish.price);
  const pillDbl = document.getElementById('pillDouble');
  if (pillDbl) pillDbl.innerText = `Double Combo (2 Plates - ₹${comboPrice})`;

  document.querySelectorAll('#pdpVariantBox .weight-pill').forEach(p => p.classList.remove('active'));
  const pillStd = document.getElementById('pillStandard');
  if (pillStd) pillStd.classList.add('active');

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

function selectDishPortion(type) {
  currentPortionType = type;
  document.querySelectorAll('#pdpVariantBox .weight-pill').forEach(p => p.classList.remove('active'));

  if (type === 'double') {
    document.getElementById('pillDouble')?.classList.add('active');
    const comboPrice = calculateDoubleCombo(currentPdpItem.price);
    document.getElementById('pdpPrice').innerText = `₹${comboPrice}`;
  } else {
    document.getElementById('pillStandard')?.classList.add('active');
    document.getElementById('pdpPrice').innerText = `₹${currentPdpItem.price}`;
  }
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
  try { localStorage.setItem("kd_wishlist", JSON.stringify(wishlist)); } catch(e) {}
}

function addPdpToCart() {
  if (!currentPdpItem) return;
  if (currentPortionType === 'double') {
    const comboPrice = calculateDoubleCombo(currentPdpItem.price);
    addToCart(currentPdpItem.id + "_dbl", `${currentPdpItem.name} (Double Combo - 2x)`, comboPrice, currentPdpItem.img);
  } else {
    addToCart(currentPdpItem.id, currentPdpItem.name, currentPdpItem.price, currentPdpItem.img);
  }
  closeModal('productDetailModal');
}

function buyNowPdp() {
  addPdpToCart();
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
    db.ref("customer_reviews").push({ author, rating, message: msg, timestamp: Date.now() });
  }

  alert("Thank you for your valuable review!");
  if (document.getElementById('reviewText')) document.getElementById('reviewText').value = '';
  closeModal('reviewModal');
}

// ==================== 6. CART OPERATIONS ====================
function showCartToast(dishName) {
  const toast = document.getElementById('cartToast');
  if (toast) {
    toast.innerText = `✅ ${dishName} Added to Cart!`;
    toast.style.display = 'block';
    setTimeout(() => { toast.style.display = 'none'; }, 2200);
  }
}

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
  showCartToast(name);
}

function changeCartQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== id);
  }
  updateCartBar();
  renderCartModalItems();
}

function removeCartItem(id) {
  cart = cart.filter(i => i.id !== id);
  updateCartBar();
  renderCartModalItems();
}

function moveCartItemToSaved(id) {
  const item = cart.find(i => i.id === id);
  if (!item) return;

  const rawId = id.replace('_dbl', '');
  if (!wishlist.includes(rawId)) {
    wishlist.push(rawId);
    try { localStorage.setItem("kd_wishlist", JSON.stringify(wishlist)); } catch(e) {}
  }
  cart = cart.filter(i => i.id !== id);
  updateCartBar();
  renderCartModalItems();
  alert(`❤️ "${item.name}" moved to Saved Items!`);
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

function renderCartModalItems() {
  const list = document.getElementById('cartItemsList');
  if (!list) return;
  list.innerHTML = '';
  let subtotal = 0;

  if (cart.length === 0) {
    list.innerHTML = '<p style="text-align:center; color:#888; padding:20px;">Your cart is empty.</p>';
    goToCheckoutStep(1);
    return;
  }

  cart.forEach(item => {
    subtotal += (item.price * item.qty);
    list.innerHTML += `
      <div style="background:#1e1e1e; border-radius:12px; padding:10px 12px; margin-bottom:10px; border:1px solid #2a2a2a; box-shadow:0 2px 6px rgba(0,0,0,0.5);">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div style="display:flex; align-items:center; gap:10px;">
            <img src="${item.img}" style="width:44px; height:44px; border-radius:8px; object-fit:cover;" />
            <div>
              <div style="font-size:13px; font-weight:700; color:#fff;">${item.name}</div>
              <div style="font-size:12px; color:#E21B24; font-weight:700;">₹${item.price}</div>
            </div>
          </div>
          <div style="font-weight:800; font-size:14px; color:#fff;">₹${item.price * item.qty}</div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px; padding-top:8px; border-top:1px dashed #333;">
          <div style="display:flex; align-items:center; gap:8px;">
            <button onclick="changeCartQty('${item.id}', -1)" style="width:26px; height:26px; border-radius:6px; border:1px solid #444; background:#2a2a2a; color:#fff; font-weight:bold; cursor:pointer;">-</button>
            <span style="font-weight:700; font-size:13px; min-width:16px; text-align:center; color:#fff;">${item.qty}</span>
            <button onclick="changeCartQty('${item.id}', 1)" style="width:26px; height:26px; border-radius:6px; border:1px solid #444; background:#2a2a2a; color:#fff; font-weight:bold; cursor:pointer;">+</button>
          </div>

          <div style="display:flex; gap:8px;">
            <button onclick="moveCartItemToSaved('${item.id}')" style="background:#261012; color:#ef4444; border:none; padding:4px 8px; border-radius:6px; font-size:11px; font-weight:600; cursor:pointer;" title="Save for Later">
              <i class="fa-solid fa-heart"></i> Save
            </button>
            <button onclick="removeCartItem('${item.id}')" style="background:#2a2a2a; color:#aaa; border:none; padding:4px 8px; border-radius:6px; font-size:11px; font-weight:600; cursor:pointer;" title="Remove Item">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  });

  const deliveryCharge = (currentOrderMode === 'dinein') ? 0 : 9;
  const coinDiscount = coinsRedeemed ? 20 : 0;
  if (document.getElementById('billSubtotal')) document.getElementById('billSubtotal').innerText = `₹${subtotal}`;
  if (document.getElementById('billGrandTotal')) document.getElementById('billGrandTotal').innerText = `₹${Math.max(0, subtotal + deliveryCharge - appliedDiscount - coinDiscount)}`;
}

// ==================== CHECKOUT STEP CONTROLLER ====================
function goToCheckoutStep(step) {
  const s1 = document.getElementById('checkoutStep1');
  const s2 = document.getElementById('checkoutStep2');
  const s3 = document.getElementById('checkoutStep3');
  const title = document.getElementById('checkoutStepTitle');
  const step2Btn = document.getElementById('step2ConfirmBtn');

  if (step === 2) {
    if (cart.length === 0) {
      alert("Bag khali hai! Kripya pehle items add karein.");
      return;
    }
    if (currentOrderMode === 'dinein' && !selectedTableNumber) {
      openTableSelectorModal();
      return;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const coinDiscount = coinsRedeemed ? 20 : 0;
    const grandTotal = Math.max(0, subtotal - appliedDiscount - coinDiscount);

    if (currentOrderMode === 'dinein') {
      if (document.getElementById('dineInBillTotal')) document.getElementById('dineInBillTotal').innerText = `₹${subtotal}`;
      if (document.getElementById('dineInGrandTotal')) document.getElementById('dineInGrandTotal').innerText = `₹${grandTotal}`;
      if (title) title.innerText = `Table #${selectedTableNumber} - Bill & Order`;
      if (step2Btn) {
        step2Btn.innerText = "CONFIRM TABLE ORDER ✅";
        step2Btn.className = "admin-btn btn-green";
      }
    } else {
      if (title) title.innerText = "2. Delivery Address";
      if (step2Btn) {
        step2Btn.innerText = "PROCEED TO PAYMENT ➔";
        step2Btn.className = "admin-btn btn-primary";
      }
    }

    s1.style.display = 'none';
    s2.style.display = 'block';
    s3.style.display = 'none';

  } else if (step === 3) {
    const name = document.getElementById('custName')?.value.trim();
    const phone = document.getElementById('custPhone')?.value.trim();
    const address = document.getElementById('custAddress')?.value.trim();

    if (!name || !phone || !address) {
      alert("Please fill Name, Phone and Delivery Address!");
      return;
    }
    try { localStorage.setItem("kd_cust_profile", JSON.stringify({ name, phone, address })); } catch(e) {}

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const coinDiscount = coinsRedeemed ? 20 : 0;
    const grandTotal = Math.max(0, subtotal + 9 - appliedDiscount - coinDiscount);

    const step3Total = document.getElementById('step3GrandTotal');
    if (step3Total) step3Total.innerText = `₹${grandTotal}`;

    const qrImg = document.getElementById('checkoutQrImg');
    if (qrImg) {
      const upiUri = `upi://pay?pa=${encodeURIComponent(paymentSettings.upiId)}&pn=${encodeURIComponent(paymentSettings.payeeName)}&am=${grandTotal}&cu=INR`;
      qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUri)}`;
    }

    setPaymentMethod(paymentSettings.codEnabled ? 'COD' : 'UPI');

    s1.style.display = 'none';
    s2.style.display = 'none';
    s3.style.display = 'block';
    if (title) title.innerText = "3. Select Payment";

  } else {
    s1.style.display = 'block';
    s2.style.display = 'none';
    s3.style.display = 'none';
    if (title) title.innerText = "1. Review Cart & Summary";
  }
}

function handleStep2Action() {
  if (currentOrderMode === 'dinein') {
    placeOrder();
  } else {
    goToCheckoutStep(3);
  }
}

function openCartModal() {
  renderCartModalItems();

  const savedProfile = JSON.parse(localStorage.getItem("kd_cust_profile") || "{}");
  if (savedProfile.name && document.getElementById('custName')) document.getElementById('custName').value = savedProfile.name;
  if (savedProfile.phone && document.getElementById('custPhone')) document.getElementById('custPhone').value = savedProfile.phone;
  if (savedProfile.address && document.getElementById('custAddress')) document.getElementById('custAddress').value = savedProfile.address;

  setOrderMode(currentOrderMode);
  goToCheckoutStep(1);
  openModal('cartModal');
}

function setPaymentMethod(method) {
  if (method === 'COD' && !paymentSettings.codEnabled) {
    method = 'UPI';
  }
  activePayment = method;
  const cod = document.getElementById('codBtn');
  const upi = document.getElementById('upiBtn');
  const qrBox = document.getElementById('upiQrBox');

  if (cod) {
    cod.style.background = (method === 'COD') ? '#E21B24' : '#1c1c1e';
    cod.style.color = (method === 'COD') ? '#fff' : '#aaa';
  }
  if (upi) {
    upi.style.background = (method === 'UPI') ? '#E21B24' : '#1c1c1e';
    upi.style.color = (method === 'UPI') ? '#fff' : '#aaa';
  }
  if (qrBox) {
    qrBox.style.display = (method === 'UPI') ? 'block' : 'none';
  }
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
    renderCartModalItems();
    return;
  }

  coinsRedeemed = chk.checked;
  const row = document.getElementById('coinsDiscountRow');
  if (row) row.style.display = coinsRedeemed ? 'flex' : 'none';
  updateCartBar();
  renderCartModalItems();
}

// ==================== DYNAMIC & FLASH COUPON SYSTEM ====================
const defaultStaticCoupons = {
  "KD20": { discount: 20, minBill: 100, maxUses: 9999, used: 0 },
  "WELCOME": { discount: 20, minBill: 100, maxUses: 9999, used: 0 },
  "BIKASH50": { discount: 50, minBill: 250, maxUses: 9999, used: 0 },
  "FIRST5": { discount: 50, minBill: 299, maxUses: 5, used: 0 },
  "BENGBARI10": { discount: 30, minBill: 199, maxUses: 10, used: 0 }
};

function applyDiscountCoupon() {
  const codeEl = document.getElementById('couponCodeInput') || document.querySelector('input[placeholder*="Promo Code"]');
  const code = codeEl ? codeEl.value.trim().toUpperCase() : '';

  if (!code) {
    alert("Kripya promo code enter karein!");
    return;
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  if (subtotal <= 0) {
    alert("Cart khali hai! Pehle kuch item add karein.");
    return;
  }

  const usedPromos = JSON.parse(localStorage.getItem("kd_used_promos") || "[]");
  if (usedPromos.includes(code)) {
    alert(`❌ Code "${code}" aap pehle hi use kar chuke hain!`);
    return;
  }

  if (typeof db !== 'undefined' && db) {
    db.ref("promos/" + code).once("value", snap => {
      const pData = snap.val();

      if (pData) {
        let disc = 0;
        let minBill = 0;
        let maxUses = 9999;
        let usedCount = 0;

        if (typeof pData === 'object') {
          disc = Number(pData.discount || 0);
          minBill = Number(pData.minBill || 0);
          maxUses = Number(pData.maxUses || 9999);
          usedCount = Number(pData.used || 0);
        } else {
          disc = Number(pData);
        }

        if (usedCount >= maxUses) {
          alert(`❌ Maaf kijiye! Promo Code '${code}' ki limit puri ho chuki hai. Agli baar sabse pehle order karein!`);
          return;
        }

        if (subtotal < minBill) {
          alert(`❌ Yeh code kam se kam ₹${minBill} ke bill par hi valid hai.`);
          return;
        }

        setCouponDiscount(disc, code);
      } else if (defaultStaticCoupons[code]) {
        validateStaticCoupon(code, subtotal);
      } else {
        alert("❌ Invalid Promo Code! Kripya sahi code enter karein.");
      }
    });
  } else {
    if (defaultStaticCoupons[code]) {
      validateStaticCoupon(code, subtotal);
    } else {
      alert("❌ Invalid Promo Code!");
    }
  }
}

function validateStaticCoupon(code, subtotal) {
  const promo = defaultStaticCoupons[code];
  const localUsed = Number(localStorage.getItem("kd_promo_used_" + code) || promo.used);

  if (localUsed >= promo.maxUses) {
    alert(`❌ Maaf kijiye! '${code}' offer pehle hi claim ho chuka hai.`);
    return;
  }

  if (subtotal < promo.minBill) {
    alert(`❌ Yeh promo code kam se kam ₹${promo.minBill} ke order par hi valid hai.`);
    return;
  }

  setCouponDiscount(promo.discount, code);
}

function setCouponDiscount(amount, code) {
  appliedDiscount = amount;
  appliedPromoCode = code;

  const dRow = document.getElementById('discountRow');
  const bDisc = document.getElementById('billDiscount');
  if (dRow) dRow.style.display = 'flex';
  if (bDisc) bDisc.innerText = `-₹${amount}`;

  alert(`🎉 Badhai ho! Promo Code '${code}' apply ho gaya: ₹${amount} Discount!`);
  updateCartBar();
  renderCartModalItems();
}

// ==================== 7. PLACE ORDER ====================
function placeOrder() {
  if (!isStoreOpen) {
    alert("Sorry, the restaurant is currently closed!");
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
  }

  // Strict Online Payment Check
  let utrVal = "";
  if (currentOrderMode === 'delivery' && activePayment === 'UPI') {
    const utrInput = document.getElementById('upiUtrInput');
    utrVal = utrInput ? utrInput.value.trim() : '';
    if (!utrVal || utrVal.length < 10) {
      alert("⚠️ Kripya pehle PAY NOW dabakar payment karein aur receipt ka 12-digit UTR/UPI Ref number yahan daalein!");
      if (utrInput) utrInput.focus();
      return;
    }
  }

  if (currentOrderMode === 'delivery') {
    try { localStorage.setItem("kd_cust_profile", JSON.stringify({ name, phone, address })); } catch(e) {}
  }

  if (coinsRedeemed) {
    try { localStorage.setItem("kd_coins_used", "true"); } catch(e) {}
  }

  // Record Promo Usage
  if (appliedPromoCode) {
    const usedPromos = JSON.parse(localStorage.getItem("kd_used_promos") || "[]");
    if (!usedPromos.includes(appliedPromoCode)) {
      usedPromos.push(appliedPromoCode);
      try { localStorage.setItem("kd_used_promos", JSON.stringify(usedPromos)); } catch(e) {}
    }

    if (typeof db !== 'undefined' && db) {
      db.ref("promos/" + appliedPromoCode).transaction(promo => {
        if (promo) {
          if (typeof promo === 'object') {
            promo.used = (promo.used || 0) + 1;
          } else {
            promo = { discount: Number(promo), used: 1, maxUses: 9999, minBill: 0 };
          }
        }
        return promo;
      });
    } else {
      let cur = Number(localStorage.getItem("kd_promo_used_" + appliedPromoCode) || 0);
      localStorage.setItem("kd_promo_used_" + appliedPromoCode, cur + 1);
    }
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
    appliedPromo: appliedPromoCode || "None",
    discountAmount: appliedDiscount,
    paymentMode: currentOrderMode === 'dinein' ? 'Pay at Counter' : activePayment,
    utrNumber: currentOrderMode === 'dinein' ? 'N/A (Dine-in Pay at Counter)' : (utrVal || "N/A (Cash on Delivery)"),
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
  appliedPromoCode = "";
  coinsRedeemed = false;
  const utrEl = document.getElementById('upiUtrInput');
  if (utrEl) utrEl.value = '';

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
    updatePaymentSettingsUI();
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
          ${ord.appliedPromo && ord.appliedPromo !== 'None' ? `<div style="font-size:11px; margin-bottom:6px; color:#10b981; font-weight:bold;">🎟️ Promo: ${ord.appliedPromo} (-₹${ord.discountAmount})</div>` : ''}
          ${ord.paymentMode === 'UPI' ? `<div style="font-size:11px; margin-bottom:6px; color:#ffca42; font-weight:bold;">💳 UTR / Ref: ${ord.utrNumber || 'N/A'}</div>` : ''}
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

// ==================== 10. IMAGE COMPRESSOR & MENU EDIT ====================
let adminUploadBase64 = "";
let editUploadBase64 = "";

function compressImage(file, callback) {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function (event) {
    const img = new Image();
    img.src = event.target.result;
    img.onload = function () {
      const canvas = document.createElement('canvas');
      const max_width = 450;
      const scaleSize = max_width / img.width;
      canvas.width = max_width;
      canvas.height = img.height * scaleSize;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const compressedUrl = canvas.toDataURL('image/jpeg', 0.7);
      callback(compressedUrl);
    };
  };
}

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
    compressImage(input.files[0], (compressed) => {
      editUploadBase64 = compressed;
      const preview = document.getElementById(`editPreviewImg_${id}`);
      if (preview) preview.src = compressed;
    });
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

function previewAdminDishUpload(input) {
  if (input.files && input.files[0]) {
    compressImage(input.files[0], (compressed) => {
      adminUploadBase64 = compressed;
      const prev = document.getElementById('adminDishPreview');
      if (prev) {
        prev.src = compressed;
        prev.style.display = 'block';
      }
    });
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
  const imgUrl = adminUploadBase64 || (urlInput ? urlInput.value.trim() : '') || "https://images.unsplash.com/photo-1544025162-d76694265947?w=500";

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
  const prev = document.getElementById('adminDishPreview');
  if (prev) prev.style.display = 'none';
  adminUploadBase64 = '';
}

// ==================== 11. CONTROLS ====================
function adminCreateCoupon() {
  const codeEl = document.getElementById('newCouponCode');
  const discEl = document.getElementById('newCouponDiscount');
  const maxUsesEl = document.getElementById('newCouponUses');

  const code = codeEl ? codeEl.value.trim().toUpperCase() : '';
  const disc = discEl ? Number(discEl.value) : 0;
  const maxUses = maxUsesEl ? (Number(maxUsesEl.value) || 9999) : 9999;

  if (!code || !disc) {
    alert("Please enter promo code and discount amount!");
    return;
  }

  const couponPayload = {
    discount: disc,
    minBill: 100,
    maxUses: maxUses,
    used: 0
  };

  if (db) {
    db.ref("promos/" + code).set(couponPayload).then(() => {
      alert(`🎉 Flash Promo '${code}' (₹${disc} OFF, Max Uses: ${maxUses}) created online!`);
      if (codeEl) codeEl.value = '';
      if (discEl) discEl.value = '';
      if (maxUsesEl) maxUsesEl.value = '';
    });
  } else {
    defaultStaticCoupons[code] = couponPayload;
    try { localStorage.setItem("kd_promo_" + code, JSON.stringify(couponPayload)); } catch(e) {}
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
    { title: "MOMO & CHOWMEIN CELEBRATION 🥟", sub: "Fresh Steamed Momo & Special Chowmein starting at ₹40 only!" }
  ];
  let curr = 0;
  const bannerBox = document.querySelector('.promo-carousel, .hero-banner');
  if (!bannerBox) return;

  setInterval(() => {
    curr = (curr + 1) % deals.length;
    const titleEl = document.getElementById('bannerTitle');
    const subEl = document.getElementById('bannerSub');
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
    compressImage(input.files[0], (compressed) => {
      const p = document.getElementById('cakePhotoPreview');
      if (p) {
        p.src = compressed;
        p.style.display = 'block';
      }
    });
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
  try { localStorage.setItem("kd_cust_profile", JSON.stringify(profile)); } catch(e) {}

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
    compressImage(input.files[0], (compressed) => {
      const img = document.getElementById('userAvatarImg');
      if (img) img.src = compressed;
    });
  }
}

// ==================== 13. NAVIGATION TABS ====================
function switchNavTab(tab) {
  document.querySelectorAll('.bottom-nav .nav-tab').forEach(t => t.classList.remove('active'));

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
