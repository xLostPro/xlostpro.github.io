/**
 * ZENITH-APEX OPTIMISED BRIDGE v1.2.0
 * Performance-tuned for iOS Safari and Desktop Chrome.
 */
window.initialiseReactModule = (entryPath) => {
    const mount = () => {
        if (typeof window.mountEliteFC === 'function') {
            window.mountEliteFC("root");
            console.log("Zenith-Apex: React hydration initialised.");

            /* 
             * BACKGROUND KICK:
             * We do a single, tiny scroll reset to make sure iOS Safari 
             * acknowledges the container's new CSS padding immediately.
             */
            window.requestAnimationFrame(() => {
                const container = document.querySelector('.react-host-container');
                if (container) container.scrollTop = 0;
            });
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