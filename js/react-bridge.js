/**
 * ZENITH-APEX MANAGED TOUCH BRIDGE v2.5.0
 * This bridge provides absolute authority over the iOS Safari gesture engine.
 */

// Global reference for the touch-lock listener
const preventDefault = (e) => {
    if (e.touches.length > 1) return; // Allow pinch-zoom
    e.preventDefault();
};

window.initialiseReactModule = (entryPath) => {
    const mount = () => {
        if (typeof window.mountEliteFC === 'function') {
            window.mountEliteFC("root");
            console.log("Zenith-Apex: React Authority established.");
        }
        else if (typeof window.mountSourceAuditor === 'function') {
            window.mountSourceAuditor("root");
        }
    };

    const existingScript = document.getElementById("external-react-entry");
    if (existingScript) {
        mount();
        return;
    }

    const script = document.createElement("script");
    script.src = entryPath;
    script.type = "module";
    script.id = "external-react-entry";
    script.onload = mount;
    document.body.appendChild(script);
};

window.terminateReactModule = () => {
    if (typeof window.unmountEliteFC === 'function') {
        window.unmountEliteFC();
    }
    if (typeof window.unmountSourceAuditor === 'function') {
        window.unmountSourceAuditor();
    }
};

/**
 * GESTURE AUTHORITY ORCHESTRATION
 * Physically locks the background to prevent 'Double-Scroll' and 'Rubber-banding'.
 */
window.lockMobileBackground = () => {
    // Force the scroll to the top of the container immediately
    const container = document.querySelector('.react-host-container');
    if (container) container.scrollTop = 0;

    // The 'Nuclear Option' for iOS: Physically block background movement
    document.addEventListener('touchmove', preventDefault, { passive: false });
    console.log("Zenith-Apex: Background Touch-Lock Initialised.");
};

window.unlockMobileBackground = () => {
    document.removeEventListener('touchmove', preventDefault);
    console.log("Zenith-Apex: Background Touch-Lock Purged.");
};