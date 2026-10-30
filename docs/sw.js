const CACHE = "yejie-v34";

const PRECACHE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon.svg",
  "./version.json",
  "./sprites/vn-mara.webp",
  "./sprites/vn-dana.webp",
  "./sprites/vn-priya.webp",
];

/** Only keep full 200 responses, and never an HTML fallback page stored under an image/script URL. */
function cacheable(request, res) {
  if (!res || res.status !== 200 || res.type === "opaque") return false;
  const type = (res.headers.get("content-type") || "").toLowerCase();
  if (request.destination === "image") return type.startsWith("image/");
  if (/\.(png|webp|jpe?g|gif|svg|glb|js|css)$/i.test(new URL(request.url).pathname)) return !type.startsWith("text/html");
  return true;
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("message", (event) => {
  const data = event.data;
  const type = typeof data === "string" ? data : data && data.type;
  if (type === "skipWaiting" || type === "SKIP_WAITING") {
    self.skipWaiting();
  }
  if (type === "clearCache" || type === "CLEAR_CACHE") {
    event.waitUntil(caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k)))));
  }
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  const path = url.pathname;

  if (path.endsWith("version.json") || url.searchParams.has("r") || url.searchParams.has("swbust")) {
    event.respondWith(
      fetch(event.request, { cache: "no-store" }).catch(() => caches.match(event.request).then((c) => c || Promise.reject())),
    );
    return;
  }

  const navigate =
    event.request.mode === "navigate" ||
    path.endsWith("/") ||
    path.endsWith("/index.html") ||
    path.endsWith("/yejie") ||
    path.endsWith("/yejie/");

  if (navigate) {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, copy));
          return res;
        })
        .catch(() => caches.match(event.request).then((c) => c || caches.match("./index.html"))),
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetched = fetch(event.request)
        .then((res) => {
          if (cacheable(event.request, res)) {
            const copy = res.clone();
            caches.open(CACHE).then((cache) => cache.put(event.request, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached && cacheable(event.request, cached) ? cached : fetched;
    }),
  );
});
