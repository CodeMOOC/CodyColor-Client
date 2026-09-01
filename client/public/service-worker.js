self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Prende immediatamente il controllo delle pagine aperte
      await self.clients.claim();

      // Cancella le cache create dal vecchio Service Worker
      const cacheNames = await caches.keys();

      await Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      );

      // Rimuove definitivamente il Service Worker
      await self.registration.unregister();

      // Ricarica le pagine ancora controllate dal vecchio SW
      const clients = await self.clients.matchAll({
        type: "window",
      });

      for (const client of clients) {
        await client.navigate(client.url);
      }
    })()
  );
});
