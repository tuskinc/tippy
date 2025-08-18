// Clear all caches
caches.keys().then(cacheNames => {
  return Promise.all(
    cacheNames.map(cacheName => {
      return caches.delete(cacheName);
    })
  );
}).then(() => {
  console.log('All caches cleared');
});

// Unregister all service workers
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    for (const registration of registrations) {
      registration.unregister().then(success => {
        console.log('Service worker unregistered:', success);
      });
    }
  });
}
