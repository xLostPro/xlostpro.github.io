/**
 * ZENITH-APEX PURE BRIDGE v3.1.0
 * RECTIFIED: Removed obsolete touch-lock calls to prevent Blazor JSExceptions.
 * Relies entirely on native CSS for layout constraints.
 */

window.initialiseReactModule = (entryPath) => {
    // Purge previous script
    const oldScript = document.getElementById("external-react-entry");
    if (oldScript) oldScript.remove();

    const mount = () => {
        console.log("Zenith-Apex: Hydrating " + entryPath);

        if (entryPath.includes('elite-fc') && typeof window.mountEliteFC === 'function') {
            window.mountEliteFC("root");
        }
        else if (entryPath.includes('source-auditor') && typeof window.mountSourceAuditor === 'function') {
            window.mountSourceAuditor("root");
        }
        else if (entryPath.includes('omnilog') && typeof window.mountOmniLog === 'function') {
            window.mountOmniLog("root");
        }
    };

    const script = document.createElement("script");
    script.src = `${entryPath}?v=${Date.now()}`;
    script.type = "module";
    script.id = "external-react-entry";
    script.onload = mount;
    document.body.appendChild(script);
};

window.terminateReactModule = () => {
    console.log("Zenith-Apex: Purging React Environment...");

    // 1. Safely unmount active React trees
    if (typeof window.unmountEliteFC === 'function') window.unmountEliteFC();
    if (typeof window.unmountSourceAuditor === 'function') window.unmountSourceAuditor();
    if (typeof window.unmountOmniLog === 'function') window.unmountOmniLog();

    // 2. Remove script tag
    const script = document.getElementById("external-react-entry");
    if (script) script.remove();

    // 3. Nullify functions to enforce strict handshakes on next load
    window.mountEliteFC = null;
    window.mountSourceAuditor = null;
    window.mountOmniLog = null;

    window.unmountEliteFC = null;
    window.unmountSourceAuditor = null;
    window.unmountOmniLog = null;
};