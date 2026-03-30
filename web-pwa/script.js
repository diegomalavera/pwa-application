if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("service-worker.js")
    .then((result) => console.log("Registros de SW exitoso"))
    .catch((error) => console.warn("Error al registrar el SW", error));
}
