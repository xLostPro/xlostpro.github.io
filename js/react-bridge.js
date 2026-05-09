/**
 * ZENITH-APEX UNIQUE BRIDGE v3.2.0
 * RECTIFIED: Uses unique namespaces (mount_id) to prevent cross-app contamination.
 * RECTIFIED: Removed all guess-work path logic.
 */

window.initialiseReactModule = (entryPath, projectId) => {
    // 1. Clean up any previous script tag
    const oldScript = document.getElementById("external-react-entry");
    if (oldScript) oldScript.remove();

    const mount = () => {
        // Construct the unique function name (e.g., mount_omnilog)
        const uniqueMountFunction = `mount_${projectId.replace(/-/g, '_')}`;

        console.log(`Zenith-Apex: Attempting unique handshake: ${uniqueMountFunction}`);

        if (typeof window[uniqueMountFunction] === 'function') {
            window[uniqueMountFunction]("root");
        } else {
            console.error(`❌ Handshake Failed: ${uniqueMountFunction} not found in ${entryPath}`);
        }
    };

    const script = document.createElement("script");
    // Cache-busting ensures the browser always executes the latest code
    script.src = `${entryPath}?v=${Date.now()}`;
    script.type = "module";
    script.id = "external-react-entry";
    script.onload = mount;
    document.body.appendChild(script);
};

window.terminateReactModule = () => {
    // Construct purge logic for all potential apps
    ["elite_fc_manager", "source_auditor", "omnilog"].forEach(id => {
        const unmountFn = `unmount_${id}`;
        if (typeof window[unmountFn] === 'function') window[unmountFn]();
    });

    const script = document.getElementById("external-react-entry");
    if (script) script.remove();
};