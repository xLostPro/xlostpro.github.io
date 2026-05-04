/**
 * ZENITH-APEX OPTIMISED BRIDGE v1.2.0
 * Performance-tuned for iOS Safari and Desktop Chrome.
 */
window.initialiseReactModule = (entryPath) => {
    const mount = () => {
        if (typeof window.mountEliteFC === 'function') {
            window.mountEliteFC("root");
            console.log("Zenith-Apex: React Hydration Complete.");
        }
    };

    const existingScript = document.getElementById("external-react-entry");

    if (existingScript) {
        // Use requestAnimationFrame for near-instant execution
        window.requestAnimationFrame(mount);
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
};