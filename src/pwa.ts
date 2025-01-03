import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    if (confirm("Nueva actualización disponible. ¿Recargar?")) {
      updateSW(true);
    }
  },
  onRegisteredSW(swScriptUrl) {
    console.log("SW registered: ", swScriptUrl);
  },
  onOfflineReady() {
    console.log("PWA application ready to work offline");
  },
});
