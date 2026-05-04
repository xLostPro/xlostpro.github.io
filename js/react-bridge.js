/**
 * ZENITH-APEX REACT BRIDGE v1.2.0 // NON-DESTRUCTIVE
 * RECTIFIED: Removed DOM-snatching logic to prevent Blazor 'removeChild' exceptions.
 * Uses the React 19 unmount API to clear content without breaking Blazor's references.
 */

window.initialiseReactModule = (entryPath) => {
    const existingScript = document.getElementById("external-react-entry");

    const triggerMount = () => {
        if (typeof window.mountEliteFC === 'function') {
            window.mountEliteFC("root");

            /* 
             * ZENITH-APEX MOBILE SPACER INJECTION
             * We wait 1 second for the React DOM to settle, then inject a spacer 
             * ONLY if the user is on a mobile device.
             */
            setTimeout(() => {
                const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                const root = document.getElementById("root");

                if (isMobile && root && !document.getElementById("ios-safety-spacer")) {
                    const spacer = document.createElement("div");
                    spacer.id = "ios-safety-spacer";
                    spacer.style.height = "120px"; // Ensures user can scroll past UI bars
                    spacer.style.width = "100%";
                    spacer.style.flexShrink = "0";
                    root.appendChild(spacer);
                    console.log("Zenith-Apex: Mobile Safety Spacer Initialised.");
                }
            }, 1000);
        }
    };

    if (existingScript) {
        triggerMount();
        return;
    }

    const script = document.createElement("script");
    script.src = entryPath;
    script.type = "module";
    script.id = "external-react-entry";
    script.onload = triggerMount;
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