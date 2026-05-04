/**
 * ZENITH-APEX OPTIMISED BRIDGE v1.2.0
 * Performance-tuned for iOS Safari and Desktop Chrome.
 */
window.initialiseReactModule = (entryPath) => {
    const mount = () => {
        if (typeof window.mountEliteFC === 'function') {
            // 1. INSTANT MOUNT: Show the app to the user immediately
            window.mountEliteFC("root");
            console.log("Zenith-Apex: React hydration initialised.");

            // 2. BACKGROUND INJECTION: Sneak the spacer in without blocking the UI
            // This happens on the next available frame (approx 16ms)
            window.requestAnimationFrame(() => {
                const root = document.getElementById("root");
                if (root && !document.getElementById("zenith-ios-spacer")) {
                    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                    if (isMobile) {
                        const spacer = document.createElement("div");
                        spacer.id = "zenith-ios-spacer";
                        // Using 'visibility: hidden' so it occupies space but isn't seen
                        spacer.style.cssText = "height: 160px !important; width: 100%; display: block; flex-shrink: 0; visibility: hidden; pointer-events: none;";
                        root.appendChild(spacer);
                        console.log("Zenith-Apex: Mobile spacer injected via background thread.");
                    }
                }
            });
        }
    };

    const existingScript = document.getElementById("external-react-entry");

    if (existingScript) {
        mount(); // Immediate call if script is cached
        return;
    }

    const script = document.createElement("script");
    script.src = entryPath;
    script.type = "module";
    script.id = "external-react-entry";
    script.onload = mount; // Mount as soon as download completes

    document.body.appendChild(script);
};

window.terminateReactModule = () => {
    if (typeof window.unmountEliteFC === 'function') {
        window.unmountEliteFC();
    }
};

/**
 * ZENITH-APEX VIEWPORT SYNCHRONISATION v1.0.0
 * This observer monitors physical changes to the visible area (Safari Toolbar shifts,
 * Keyboard interrupts). It ensures the 'Fixed' body doesn't cause a scroll-lock.
 */
if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', () => {
        // 1. Identify the active container
        const container = document.querySelector('.react-host-container');

        /* 
         * 2. Only execute if the project is actually expanded.
         * This prevents unnecessary layout calculations on the main Home/Project list pages.
         */
        if (container && document.body.classList.contains('project-expanded')) {
            // Force the container to match the physical visible area exactly
            container.style.height = `${window.visualViewport.height}px`;

            /* 
             * 3. Editorial Polish: If the keyboard was dismissed, 
             * we kick the scroll slightly to ensure the browser re-evaluates bottom reach.
             */
            if (window.visualViewport.offsetTop === 0) {
                container.scrollTop = container.scrollTop + 1;
                container.scrollTop = container.scrollTop - 1;
            }
        }
    });
}