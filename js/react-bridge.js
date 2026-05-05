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
    // 1. Purge any existing script tag
    const oldScript = document.getElementById("external-react-entry");
    if (oldScript) oldScript.remove();

    const mount = () => {
        console.log("Zenith-Apex: Handshake Initialised for: " + entryPath);

        /* 
         * STRICT PATH AUTHORITY:
         * Instead of checking 'if exists', we check which app the path belongs to.
         * This prevents 'Elite FC' from loading inside the 'Source Auditor' view.
         */
        if (entryPath.includes('elite-fc')) {
            if (typeof window.mountEliteFC === 'function') window.mountEliteFC("root");
        }
        else if (entryPath.includes('source-auditor')) {
            if (typeof window.mountSourceAuditor === 'function') window.mountSourceAuditor("root");
        }

        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) window.lockMobileBackground();
    };

    const script = document.createElement("script");
    // Cache-busting is essential here to ensure the script re-runs and sets the window functions
    script.src = `${entryPath}?v=${Date.now()}`;
    script.type = "module";
    script.id = "external-react-entry";
    script.onload = mount;

    document.body.appendChild(script);
};



window.terminateReactModule = () => {
    console.log("Zenith-Apex: Executing Hard Purge...");

    window.unlockMobileBackground();

    // 1. Physically unmount the React trees
    if (typeof window.unmountEliteFC === 'function') window.unmountEliteFC();
    if (typeof window.unmountSourceAuditor === 'function') window.unmountSourceAuditor();

    // 2. Remove the script tag
    const script = document.getElementById("external-react-entry");
    if (script) script.remove();

    // 3. NUCLEAR OPTION: Nullify the functions so they cannot be miscalled
    window.mountEliteFC = null;
    window.mountSourceAuditor = null;
    window.unmountEliteFC = null;
    window.unmountSourceAuditor = null;
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