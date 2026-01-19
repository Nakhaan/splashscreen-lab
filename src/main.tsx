import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { check } from "@tauri-apps/plugin-updater";
import { ask } from "@tauri-apps/plugin-dialog";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Effectively a JavaScript main function
window.addEventListener("DOMContentLoaded", () => {
  checkForAppUpdates();
});

async function checkForAppUpdates(manualCheck = false) {
  try {
    const update = await check();

    if (update) {
      const yes = await ask(
        `Update to ${update.version} is available!\n\nRelease notes: ${update.body}`,
        {
          title: "Update Available",
          kind: "info",
          okLabel: "Update",
          cancelLabel: "Cancel",
        },
      );

      if (yes) {
        // Download, install, and relaunch automatically
        await update.downloadAndInstall();
        // No need for relaunch() - it's handled automatically
      }
    } else if (manualCheck) {
      await ask("You are on the latest version", {
        title: "No Updates",
        kind: "info",
      });
    }
  } catch (error) {
    console.error("Update check failed:", error);
  }
}
