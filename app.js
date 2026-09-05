// ==================== SMART PWA INSTALL & UPDATE LOGIC ====================
let deferredPrompt;

// Check if running inside installed PWA
const isAppInstalled = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  updateInstallButtonUI(false);
});

function updateInstallButtonUI(installed) {
  const installBtns = document.querySelectorAll('#pwaInstallBtn, .install-app-btn');
  installBtns.forEach(btn => {
    if (installed || isAppInstalled) {
      btn.innerHTML = `<i class="fa-solid fa-arrows-rotate"></i> Check for App Update`;
      btn.onclick = triggerAppUpdate;
    } else {
      btn.innerHTML = `<i class="fa-solid fa-download"></i> Install Mobile App`;
      btn.onclick = triggerPwaInstall;
    }
  });
}

function triggerPwaInstall() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        updateInstallButtonUI(true);
      }
      deferredPrompt = null;
    });
  } else {
    // If prompt is blocked or already added
    alert("📲 ऐप इंस्टॉल करने के लिए:\n1. ऊपर दाईं तरफ 3 डॉट्स (⋮) दबाएं।\n2. 'Add to Home screen' या 'Install app' चुनें।");
  }
}

function triggerAppUpdate() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      for (let registration of registrations) {
        registration.update();
      }
    });
  }
  // Clear cached data and reload fresh files
  localStorage.removeItem("kd_live_menu");
  alert("⚡ ऐप सफलतापूर्वक नए मेनू और ऑफर्स के साथ अपडेट हो गया है!");
  window.location.reload(true);
}

document.addEventListener('DOMContentLoaded', () => {
  updateInstallButtonUI(isAppInstalled);
});
