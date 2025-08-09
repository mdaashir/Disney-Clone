/* eslint-disable no-console */
// Disney Clone Service Worker
// Handles caching, offline functionality, and background sync

const CACHE_NAME = "disney-clone-v1.0.1";
const API_CACHE_NAME = "disney-api-v1.0.1";
const IMAGE_CACHE_NAME = "disney-images-v1.0.1";

// Assets to cache immediately
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  // Add other static assets as needed
];

// API endpoints to cache
const API_ENDPOINTS = [
  "/api/trending",
  "/api/popular",
  "/api/genres",
  "https://api.themoviedb.org/3/",
];

// Image domains to cache
const IMAGE_DOMAINS = ["image.tmdb.org", "img.youtube.com"];

// Development logging helper
const swLog = (...args) => {
  // Only log in development
  if (
    self.location.hostname === "localhost" ||
    self.location.hostname === "127.0.0.1"
  ) {
    console.log(...args);
  }
};

// Install event - cache static assets
self.addEventListener("install", (event) => {
  swLog("Service Worker installing...");

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        swLog("Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        swLog("Static assets cached");
        return self.skipWaiting();
      }),
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  swLog("Service Worker activating...");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              // Delete old versions of our cache
              return (
                cacheName.startsWith("disney-clone-") &&
                cacheName !== CACHE_NAME &&
                cacheName !== API_CACHE_NAME &&
                cacheName !== IMAGE_CACHE_NAME
              );
            })
            .map((cacheName) => {
              swLog("Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }),
        );
      })
      .then(() => {
        swLog("Service Worker activated");
        return self.clients.claim();
      }),
  );
});

// Fetch event - implement caching strategies
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle different types of requests
  if (request.method !== "GET") {
    return; // Only cache GET requests
  }

  // Static assets - Cache first strategy
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request, CACHE_NAME));
    return;
  }

  // API requests - Network first with fallback
  if (isAPIRequest(url)) {
    event.respondWith(networkFirstWithFallback(request, API_CACHE_NAME));
    return;
  }

  // Images - Stale while revalidate
  if (isImageRequest(url)) {
    event.respondWith(staleWhileRevalidate(request, IMAGE_CACHE_NAME));
    return;
  }

  // Default - Network first
  event.respondWith(networkFirst(request, CACHE_NAME));
});

// Helper functions
function isStaticAsset(url) {
  return (
    url.origin === location.origin &&
    (url.pathname.endsWith(".js") ||
      url.pathname.endsWith(".css") ||
      url.pathname.endsWith(".html") ||
      url.pathname === "/" ||
      url.pathname.startsWith("/assets/"))
  );
}

function isAPIRequest(url) {
  return (
    API_ENDPOINTS.some((endpoint) => url.href.includes(endpoint)) ||
    url.pathname.startsWith("/api/")
  );
}

function isImageRequest(url) {
  return (
    IMAGE_DOMAINS.some((domain) => url.hostname.includes(domain)) ||
    url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)
  );
}

// Caching strategies
async function cacheFirst(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);

    if (cached) {
      return cached;
    }

    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    console.error("Cache first strategy failed:", error);
    return new Response("Offline content unavailable", { status: 503 });
  }
}

async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);

    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    swLog("Network failed, trying cache:", error);
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);

    if (cached) {
      return cached;
    }

    return new Response("Content unavailable offline", { status: 503 });
  }
}

async function networkFirstWithFallback(request, cacheName) {
  try {
    // Try network first
    const response = await fetch(request);

    if (response.ok) {
      const cache = await caches.open(cacheName);
      // Cache API responses with timestamp
      const responseToCache = response.clone();
      const headers = new Headers(responseToCache.headers);
      headers.set("sw-cache-timestamp", Date.now().toString());

      const modifiedResponse = new Response(responseToCache.body, {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers: headers,
      });

      cache.put(request, modifiedResponse);
    }

    return response;
  } catch (error) {
    swLog("API request failed, trying cache:", error);
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);

    if (cached) {
      // Check if cached response is too old (1 hour)
      const cacheTimestamp = cached.headers.get("sw-cache-timestamp");
      if (cacheTimestamp) {
        const age = Date.now() - parseInt(cacheTimestamp);
        if (age > 3600000) {
          // 1 hour
          swLog("Cached API response is stale");
        }
      }
      return cached;
    }

    // Return offline fallback for API
    return new Response(
      JSON.stringify({
        error: "Offline",
        message: "This content is not available offline",
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  // Start revalidation in background
  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => {
      // Silently fail background updates
    });

  // Return cached version immediately if available
  return cached || fetchPromise;
}

// Background sync for failed requests
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    event.waitUntil(handleBackgroundSync());
  }
});

async function handleBackgroundSync() {
  // Handle queued requests when back online
  swLog("Handling background sync...");

  // You can implement request queuing here
  // For example, sync user data, watchlist updates, etc.
}

// Push notifications
self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json();

    const options = {
      body: data.body,
      icon: "/Disney.ico",
      badge: "/Disney.ico",
      tag: data.tag || "disney-notification",
      data: data.data,
      actions: [
        {
          action: "view",
          title: "View",
        },
        {
          action: "dismiss",
          title: "Dismiss",
        },
      ],
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

// Notification click handling
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "view") {
    // Handle view action
    event.waitUntil(clients.openWindow(event.notification.data?.url || "/"));
  } else if (event.action === "dismiss") {
    // Action button clicked: Dismiss
    swLog("Notification dismissed");
  } else {
    // Default action
    event.waitUntil(clients.openWindow("/"));
  }
});

// Cache management
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "CACHE_STATS") {
    getCacheStats().then((stats) => {
      event.ports[0].postMessage(stats);
    });
  }

  if (event.data && event.data.type === "CLEAR_CACHE") {
    clearAllCaches().then(() => {
      event.ports[0].postMessage({ success: true });
    });
  }
});

async function getCacheStats() {
  const cacheNames = await caches.keys();
  const stats = {};

  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    stats[cacheName] = keys.length;
  }

  return stats;
}

async function clearAllCaches() {
  const cacheNames = await caches.keys();
  return Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
}

// Periodic cleanup
setInterval(() => {
  cleanupCache();
}, 86400000); // Daily cleanup

async function cleanupCache() {
  swLog("Running cache cleanup...");

  const imageCache = await caches.open(IMAGE_CACHE_NAME);
  const keys = await imageCache.keys();

  // Delete cached images older than 24 hours
  const keysToDelete = [];
  for (const request of keys) {
    const response = await imageCache.match(request);
    if (response) {
      const timestamp = response.headers.get("sw-cache-timestamp");
      if (timestamp && Date.now() - parseInt(timestamp) > 86400000) {
        // 24 hours
        keysToDelete.push(request);
      }
    }
  }

  await Promise.all(keysToDelete.map((key) => imageCache.delete(key)));
  swLog(`Cleaned up ${keysToDelete.length} old cached images`);
}
