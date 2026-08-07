// Firebase Configuration (Apni Keys Yahan Badlein)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "SENDER_ID",
    appId: "APP_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

let currentUser = null;

// Auth State Check
auth.onAuthStateChanged(user => {
    if (user) {
        currentUser = user;
        document.getElementById('login-btn').classList.add('hidden');
        document.getElementById('user-name-display').innerText = `Hi, ${user.email.split('@')[0]}`;
        document.getElementById('user-name-display').classList.remove('hidden');
        listenToLiveOrders();
    } else {
        currentUser = null;
        document.getElementById('login-btn').classList.remove('hidden');
        document.getElementById('user-name-display').classList.add('hidden');
    }
});

// Login Check Before Ordering
function checkoutOrder() {
    if (!currentUser) {
        alert("Pehle Login Karein!");
        openLoginModal();
        return;
    }
    
    // Save Order to Database for Real-Time Tracking
    const orderData = {
        userId: currentUser.uid,
        items: cart,
        totalAmount: calculateTotal(),
        status: "Order Placed", // Statuses: Order Placed -> Preparing -> Out for Delivery -> Delivered
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    db.collection("orders").add(orderData).then(docRef => {
        alert("Order Successfully Placed!");
        cart = [];
        switchTab('tracking');
    });
}

// Real-time Live Order Tracking Listener
function listenToLiveOrders() {
    if (!currentUser) return;

    db.collection("orders")
      .where("userId", "==", currentUser.uid)
      .orderBy("timestamp", "desc")
      .onSnapshot(snapshot => {
          const trackerContainer = document.getElementById('orders-tracker-list');
          trackerContainer.innerHTML = "";

          snapshot.forEach(doc => {
              const data = doc.data();
              trackerContainer.innerHTML += `
                  <div class="tracker-card">
                      <h4>Order ID: ${doc.id.slice(0,6)}</h4>
                      <p>Total: ₹${data.totalAmount}</p>
                      <div class="status-bar">
                          <span class="step ${data.status === 'Order Placed' ? 'active' : ''}">Placed</span>
                          <span class="step ${data.status === 'Preparing' ? 'active' : ''}">Preparing</span>
                          <span class="step ${data.status === 'Out for Delivery' ? 'active' : ''}">Out for Delivery</span>
                          <span class="step ${data.status === 'Delivered' ? 'active' : ''}">Delivered</span>
                      </div>
                  </div>
              `;
          });
      });
}
