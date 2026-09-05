const CACHE_NAME = 'sa-restaurant-v700';

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
    }).then(() => clients.claim())
  );
});

// नेटवर्क से हमेशा ताज़ा कोड लाओ
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
