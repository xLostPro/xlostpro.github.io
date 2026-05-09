/**
 * ZENITH-APEX RETRY-AWARE BRIDGE v3.3.0
 * RECTIFIED: Implemented polling to wait for ES Module evaluation.
 * RECTIFIED: Uses unique namespacing to prevent cross-app contamination.
 */

window.initialiseReactModule = (entryPath, projectId) => {
    const oldScript = document.getElementById("external-react-entry");
    if (oldScript) oldScript.remove();

    const script = document.createElement("script");
    script.src = `${entryPath}?v=${Date.now()}`;
    script.type = "module";
    script.id = "external-react-entry";

    script.onload = () => {
        const uniqueMountFunction = `mount_${projectId.replace(/-/g, '_')}`;
        let attempts = 0;

        // POLLING LOOP: Wait for the module to attach the function to window
        const mountPoll = setInterval(() => {
            attempts++;
            if (typeof window[uniqueMountFunction] === 'function') {
                clearInterval(mountPoll);
                window[uniqueMountFunction]("root");
                console.log(`✅ Handshake Success: ${uniqueMountFunction} initialised.`);
            } else if (attempts > 50) { // Timeout after 500ms (50 * 10ms)
                clearInterval(mountPoll);
                console.error(`❌ Handshake Failed: ${uniqueMountFunction} not found after 500ms.`);
            }
        }, 10);
    };

    document.body.appendChild(script);
};

window.terminateReactModule = () => {
    // Purge every possible project unmount function
    ["elite_fc_manager", "source_auditor", "omnilog"].forEach(id => {
        const unmountFn = `unmount_${id}`;
        if (typeof window[unmountFn] === 'function') window[unmountFn]();
    });

    const script = document.getElementById("external-react-entry");
    if (script) script.remove();
};