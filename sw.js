// DMG Performance Tracker — Service Worker
// Arquivo: sw.js (na raiz do repositório GitHub)

self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('push', e => {
  if (!e.data) return;

  let data = {};
  try { data = e.data.json(); } catch { data = { title: 'DMG Performance', body: e.data.text() }; }

  const title = data.title || 'DMG Performance Tracker';
  const options = {
    body: data.body || 'Nova notificação',
    icon: '/dmg-utm-tracker/icon-192.png',
    badge: '/dmg-utm-tracker/icon-192.png',
    vibrate: [200, 100, 200],
    data: data.data || {},
    actions: [
      { action: 'open', title: 'Ver Dashboard' },
      { action: 'close', title: 'Fechar' }
    ],
    requireInteraction: false,
    silent: false,
    tag: 'dmg-sale',
    renotify: true,
  };

  e.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  if (e.action === 'close') return;
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if (client.url.includes('dmg-utm-tracker') && 'focus' in client) return client.focus();
      }
      return clients.openWindow('/dmg-utm-tracker/');
    })
  );
});
