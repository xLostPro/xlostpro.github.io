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
        const container = document.querySelector('.react-host-container');

        if (container && document.body.classList.contains('project-expanded')) {
            window.requestAnimationFrame(() => {
                container.scrollTop = container.scrollTop + 1;
                container.scrollTop = container.scrollTop - 1;
            });
        }
    });
}