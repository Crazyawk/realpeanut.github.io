// Announcement logic (sitewide.js)
(function() {
    const sessionKey = 'announcementShown';

    // Only show if not yet shown this session
    if (sessionStorage.getItem(sessionKey)) return;

    document.addEventListener('DOMContentLoaded', () => {
        const message = "🔔 This is an important announcement!";

        const annBox = document.createElement('div');
        annBox.id = 'announcementBox';
        annBox.style.position = 'fixed';
        annBox.style.top = '50%';
        annBox.style.left = '50%';
        annBox.style.transform = 'translate(-50%, -50%)';
        annBox.style.backgroundColor = 'rgba(0,0,0,0.9)';
        annBox.style.color = 'white';
        annBox.style.padding = '20px 40px';
        annBox.style.fontFamily = 'sans-serif';
        annBox.style.fontSize = '18px';
        annBox.style.borderRadius = '10px';
        annBox.style.zIndex = 2147483647; // in front of everything
        annBox.style.textAlign = 'center';
        annBox.style.boxShadow = '0 4px 20px rgba(0,0,0,0.5)';
        annBox.style.pointerEvents = 'auto';
        annBox.style.userSelect = 'none';
        annBox.style.opacity = '1';
        annBox.style.transition = 'opacity 1.5s ease'; // fade effect
        annBox.innerText = message;

        // Click to fade out
        annBox.onclick = () => {
            annBox.style.opacity = '0';
            setTimeout(() => annBox.remove(), 1500); // remove after fade
            sessionStorage.setItem(sessionKey, 'true'); // mark as shown
        };

        document.body.appendChild(annBox);
    });
})();
/* ========================================================
   SITEWIDE PWA APP OPENING + BLACKOUT (SESSION ONLY)
======================================================== */

/* -------------------------------
   1. APP SELECTION
--------------------------------- */
let selectedApp = sessionStorage.getItem("selectedApp") || null;

function showChoiceBox() {
    const oldBox = document.getElementById("appChoiceBox");
    if (oldBox) oldBox.remove();

    const box = document.createElement("div");
    box.id = "appChoiceBox";
    box.style = `
        position:fixed;top:10%;left:5%;
        background:white;padding:20px;border-radius:8px;
        z-index:100000;font-family:sans-serif;text-align:center;
    `;
    box.innerHTML = `
        <p>When you press N, which app do you want opened?</p>
        <button data-app="notability://">Notability</button>
        <button data-app="canvas-student://">Canvas</button>
        <button data-app="googlechrome://">Chrome</button>
        <button data-app="calshow://">Apple Calendar</button>
        <button data-app="googlegmail://">Gmail</button>
        <button data-app="garageband://">Garageband</button>
        <button data-app="googledocs://">Google Docs</button>
        <button data-app="googlesheets://">Google Sheets</button>
        <button data-app="googleslides://">Google Slides</button>
        <button data-app="myhomework://">MyHomework</button>
        <button data-app="desmos://">Desmos</button>
        <button data-app="spotify://">Spotify</button>
        <button data-app="zoomus://">Zoom</button>
        <button data-app="nytimes://">NY Times</button>
        <button data-app="firefox://">Firefox</button>
    `;
    document.body.appendChild(box);

    box.querySelectorAll("button").forEach(btn => {
        btn.onclick = () => {
            selectedApp = btn.dataset.app;
            sessionStorage.setItem("selectedApp", selectedApp);
            box.remove();
        };
    });
}

/* -------------------------------
   2. BLACKOUT OVERLAY
--------------------------------- */
function ensureBlackOverlay() {
    let overlay = document.getElementById("blackOverlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "blackOverlay";
        overlay.style = `
            position:fixed;top:0;left:0;width:100vw;height:100vh;
            background:black;z-index:9999;display:none;
        `;
        document.body.appendChild(overlay);
    }
    return overlay;
}

/* -------------------------------
   3. KEYBOARD SHORTCUTS
--------------------------------- */
document.addEventListener("keydown", e => {
    const key = e.key.toLowerCase();

    // Press N → open app + blackout
    if (key === "n") {
        if (!selectedApp) {
            showChoiceBox();
            return;
        }

        const overlay = ensureBlackOverlay();
        window.location.href = selectedApp;

        setTimeout(() => {
            overlay.style.display = "block";
            document.querySelectorAll("audio, video").forEach(el => (el.muted = true));
        }, 250);
    }

    // Press K → remove blackout
    if (key === "k") {
        const overlay = document.getElementById("blackOverlay");
        if (overlay) overlay.remove();
        document.querySelectorAll("audio, video").forEach(el => (el.muted = false));
    }

    // Press M → reopen app selection
    if (key === "m") {
        showChoiceBox();
    }
});

/* -------------------------------
   4. PWA CHECK (block unless standalone)
--------------------------------- */
window.addEventListener("load", () => {
    const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone === true;

    if (!isStandalone) {
        const overlay = document.createElement("div");
        overlay.id = "pwaOverlay";
        overlay.style = `
            position:fixed;top:0;left:0;width:100vw;height:100vh;
            background:black;color:white;z-index:2147483647;
            display:flex;flex-direction:column;justify-content:center;
            align-items:center;padding:40px;text-align:center;
            font-family:sans-serif;
        `;
        overlay.innerHTML = `
            <p style="max-width:600px;font-size:18px;line-height:1.6;">
                To play this, you must install the app.<br><br>
                Open in Safari → Share → <b>Add to Home Screen</b>.<br><br>
                Then launch the saved app from your Home Screen.
            </p>
        `;
        document.body.appendChild(overlay);
        document.querySelectorAll("audio, video").forEach(el => (el.muted = true));
    }
});

/* -------------------------------
   5. SERVICE WORKER
--------------------------------- */
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("/service-worker.js")
            .then(reg => console.log("Service Worker registered:", reg.scope))
            .catch(err => console.error("Service Worker failed:", err));
    });
}

/* -------------------------------
   6. AUTO SHOW CHOICE IF NONE
--------------------------------- */
window.addEventListener("load", () => {
    if (!selectedApp) showChoiceBox();
});