const CACHE_NAME = 'sa-restaurant-v701';

// तुरंत नया वर्ज़न लोड करवाओ बिना इंतज़ार के
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// पुराना सारा कैशे साफ़ करके नया एक्टिवेट करो
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// नेटवर्क से हमेशा ताज़ा कोड लाओ
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

// ==================== BACKGROUND PUSH & OFFER NOTIFICATION ====================
self.addEventListener('push', (event) => {
  let data = {
    title: "🔥 Special Offer: S&A Family Restaurant",
    body: "Aaj ke special discount aur saste combos dekhne ke liye tap karein!",
    image: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=500",
    url: "/"
  };

  if (event.data) {
    try {
      data = Object.assign(data, event.data.json());
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=500",
    badge: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=500",
    image: data.image, // Bada photo dikhega jaise screenshot me tha
    vibrate: [200, 100, 200],
    data: {
      url: data.url || "/"
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification par tap/click karte hi restaurant app khulega
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification.data && event.notification.data.url ? event.notification.data.url : '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let client of windowClients) {
        if (client.url.includes(self.registration.scope) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
