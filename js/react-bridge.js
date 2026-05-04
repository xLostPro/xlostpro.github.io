window.initialiseReactModule = (entryPath) => {
    const mount = () => {
        if (typeof window.mountEliteFC === 'function') {
            window.mountEliteFC("root");
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