// ===== RM NOTES SERVICE WORKER =====
// The service worker runs in the background and intercepts network requests.
// Its main job here is caching — storing app files locally so the app
// works offline and loads faster on repeat visits.

// Cache name — bump this version string whenever you deploy significant changes
// This tells the browser to throw out the old cache and fetch fresh files
const CACHE_NAME = "rm-notes-v1";

// Files to cache on install — everything the app needs to run offline
const FILES_TO_CACHE = [
  "/RM-Notes/",
  "/RM-Notes/index.html",
  "/RM-Notes/css/styles.css",
  "/RM-Notes/js/app.js",
  "/RM-Notes/manifest.json",
  "/RM-Notes/icons/icon-192.png",
  "/RM-Notes/icons/icon-512.png"
];

// INSTALL EVENT
// Fires when the service worker is first installed
// We open our cache and add all the files we need
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("RM Notes: caching app files");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  // Take control immediately without waiting for old SW to expire
  self.skipWaiting();
});

// ACTIVATE EVENT
// Fires when the service worker takes control
// We clean up any old caches from previous versions
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          // Delete any cache that isn't our current version
          if (key !== CACHE_NAME) {
            console.log("RM Notes: removing old cache", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  // Take control of all open pages immediately
  self.clients.claim();
});

// FETCH EVENT
// Fires on every network request the app makes
// We use a cache-first strategy: serve from cache if available,
// fall back to network if not
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version if found
      if (response) {
        return response;
      }
      // Otherwise fetch from network
      return fetch(event.request);
    })
  );
});
