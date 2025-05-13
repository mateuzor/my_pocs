// Service Worker Registration
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("service-worker.js")
    .then(() => console.log("Service Worker successfully registered!"))
    .catch((err) =>
      console.error("Error registering the Service Worker:", err)
    );
}
