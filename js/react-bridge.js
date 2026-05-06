/**
 * ZENITH-APEX PURE BRIDGE v3.0.0
 * Overhauled: Removed all touch-event blocking and DOM manipulation hacks.
 * This bridge safely swaps React modules and strictly manages memory.
 */

window.initialiseReactModule = (entryPath) => {
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

    if (typeof window.unmountEliteFC === 'function') window.unmountEliteFC();
    if (typeof window.unmountSourceAuditor === 'function') window.unmountSourceAuditor();

    const script = document.getElementById("external-react-entry");
    if (script) script.remove();

    window.mountEliteFC = null;
    window.mountSourceAuditor = null;
    window.unmountEliteFC = null;
    window.unmountSourceAuditor = null;
};