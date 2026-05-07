window.initialiseReactModule = (entryPath) => {
    const oldScript = document.getElementById("external-react-entry");
    if (oldScript) oldScript.remove();

    const mount = () => {
        console.log("Zenith-Apex: Handshake Initialised for: " + entryPath);

        // --- PATH-STRICT MOUNTING LOGIC ---
        if (entryPath.includes('elite-fc')) {
            if (typeof window.mountEliteFC === 'function') window.mountEliteFC("root");
        }
        else if (entryPath.includes('source-auditor')) {
            if (typeof window.mountSourceAuditor === 'function') window.mountSourceAuditor("root");
        }
        else if (entryPath.includes('omnilog')) {
            // NEW: OmniLog Handshake
            if (typeof window.mountOmniLog === 'function') window.mountOmniLog("root");
        }

        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) window.lockMobileBackground();
    };

    const script = document.createElement("script");
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
    if (typeof window.unmountOmniLog === 'function') window.unmountOmniLog();

    // 2. Remove the script tag
    const script = document.getElementById("external-react-entry");
    if (script) script.remove();
};