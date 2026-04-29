/**
 * ZENITH-APEX UNITY BRIDGE v1.0.0
 * Orchestrates the lifecycle and communication of Unity WebGL instances.
 */

let activeUnityInstance = null;
window.dotNetUnityHelper = null;

window.initialiseUnityInstance = (dotNetHelper, folder, loader, framework, data, code) => {
    window.dotNetUnityHelper = dotNetHelper;

    // Clean up existing instances
    if (activeUnityInstance) {
        activeUnityInstance.Quit().then(() => { activeUnityInstance = null; });
    }

    const script = document.createElement("script");
    script.src = `${folder}/${loader}`;
    script.onload = () => {
        const canvas = document.querySelector("#unity-canvas");
        const config = {
            dataUrl: `${folder}/${data}`,
            frameworkUrl: `${folder}/${framework}`,
            codeUrl: `${folder}/${code}`,
            streamingAssetsUrl: "StreamingAssets",
            companyName: "xLostPro",
            productName: "Zenith Portfolio"
        };

        createUnityInstance(canvas, config, (progress) => {
            dotNetHelper.invokeMethodAsync("OnUnityProgress", progress);
        }).then((instance) => {
            activeUnityInstance = instance;
        });
    };
    document.body.appendChild(script);
};

window.terminateUnityInstance = () => {
    if (activeUnityInstance) {
        activeUnityInstance.Quit().then(() => {
            activeUnityInstance = null;
            console.log("Zenith-Apex: Unity Runtime Safely Disposed.");
        });
    }
};

window.dispatchUnityEvent = (eventName, jsonPayload) => {
    if (window.dotNetUnityHelper) {
        window.dotNetUnityHelper.invokeMethodAsync("ReceiveMessageFromGame", eventName, jsonPayload);
    }
};

window.sendToUnity = (objectName, methodName, value) => {
    if (activeUnityInstance) {
        activeUnityInstance.SendMessage(objectName, methodName, value);
    }
};