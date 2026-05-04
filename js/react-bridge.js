/**
 * ZENITH-APEX REACT BRIDGE v1.2.0 // NON-DESTRUCTIVE
 * RECTIFIED: Removed DOM-snatching logic to prevent Blazor 'removeChild' exceptions.
 * Uses the React 19 unmount API to clear content without breaking Blazor's references.
 */

window.initialiseReactModule = (entryPath) => {
    // Check if script is already in memory
    const existingScript = document.getElementById("external-react-entry");

    if (existingScript) {
        // If script exists, just trigger the mount function
        if (typeof window.mountEliteFC === 'function') {
            window.mountEliteFC("root");
        }
        return;
    }

    const script = document.createElement("script");
    script.src = entryPath;
    script.type = "module";
    script.id = "external-react-entry";

    script.onload = () => {
        console.log("Zenith-Apex: Script Loaded. Triggering Bootloader...");
        // Give the browser one tick to parse the module exports
        setTimeout(() => {
            if (typeof window.mountEliteFC === 'function') {
                window.mountEliteFC("root");
            }
        }, 10);
    };

    document.body.appendChild(script);
};

window.terminateReactModule = () => {
    // We ONLY call the React unmount. We do NOT clear innerHTML.
    // We do NOT remove the script tag, as re-injecting modules causes 
    // variables to be re-declared, leading to JS syntax errors.
    if (typeof window.unmountEliteFC === 'function') {
        window.unmountEliteFC();
    }
};