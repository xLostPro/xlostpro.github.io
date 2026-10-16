/**
 * ZENITH-APEX UNITY BRIDGE v1.1.0
 * Orchestrates the lifecycle and communication of Unity WebGL instances.
 *
 * Only one Unity instance runs at a time. Each call to initialiseUnityInstance
 * starts a new "session", identified by an id the caller passes in. Callbacks from an older session
 * (late progress, a load that finishes after the host was disposed) are dropped,
 * and an instance that finishes loading after its session ended is quit.
 */

let activeUnityInstance = null;
let currentSession = null;
// Settles once every Quit() that has been requested so far has finished.
let pendingQuit = Promise.resolve();
// Settles once the most recent createUnityInstance call has resolved or rejected.
let pendingLoad = Promise.resolve();
// Loader script URL -> promise of the createUnityInstance function it defines.
const loaderScripts = new Map();
window.dotNetUnityHelper = null;

const loadUnityLoader = (src) => {
    const url = new URL(src, document.baseURI).href;
    if (loaderScripts.has(url)) return loaderScripts.get(url);

    const promise = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = url;
        script.dataset.unityLoader = "";
        script.onload = () => {
            if (typeof window.createUnityInstance === "function") {
                resolve(window.createUnityInstance);
            } else {
                reject(new Error(`${src} loaded but did not define createUnityInstance.`));
            }
        };
        script.onerror = () => reject(new Error(`Failed to load the Unity loader script (${src}).`));
        document.body.appendChild(script);
    });

    // Forget a failed load so a retry adds a fresh <script>.
    promise.catch(() => {
        loaderScripts.delete(url);
        document.querySelectorAll("script[data-unity-loader]").forEach((s) => {
            if (s.src === url) s.remove();
        });
    });

    loaderScripts.set(url, promise);
    return promise;
};

const quitInstance = (instance) => {
    pendingQuit = pendingQuit
        .then(() => instance.Quit())
        .then(
            () => console.log("Zenith-Apex: Unity Runtime Safely Disposed."),
            (err) => console.warn("Zenith-Apex: Unity Quit() failed.", err));
    return pendingQuit;
};

const quitActiveInstance = () => {
    const instance = activeUnityInstance;
    activeUnityInstance = null;
    return instance ? quitInstance(instance) : pendingQuit;
};

const errorMessage = (err) => (err && err.message) || String(err || "Unknown error");

window.initialiseUnityInstance = (dotNetHelper, session, folder, loader, framework, data, code) => {
    currentSession = session;
    // Unity events must not reach the previous (possibly disposed) host while this one loads.
    window.dotNetUnityHelper = null;
    const isCurrent = () => session === currentSession;
    const notify = (method, ...args) => {
        if (!isCurrent()) return;
        dotNetHelper.invokeMethodAsync(method, ...args).catch((err) => {
            console.warn(`Zenith-Apex: ${method} could not reach .NET.`, err);
        });
    };

    const run = async () => {
        // Let any earlier load finish (its instance quits itself below), then wait
        // for every pending Quit() so two engines never run at once.
        await pendingLoad.catch(() => { });
        await quitActiveInstance();
        if (!isCurrent()) return;

        window.dotNetUnityHelper = dotNetHelper;
        const create = await loadUnityLoader(`${folder}/${loader}`);
        if (!isCurrent()) return;

        const canvas = document.querySelector("#unity-canvas");
        if (!canvas) throw new Error("The Unity canvas is not in the page.");

        const load = new Promise((resolve, reject) => {
            const config = {
                dataUrl: `${folder}/${data}`,
                frameworkUrl: `${folder}/${framework}`,
                codeUrl: `${folder}/${code}`,
                streamingAssetsUrl: "StreamingAssets",
                companyName: "xLostPro",
                productName: "Zenith Portfolio",
                // Some failures (e.g. a .data download error) only reach the banner
                // and never reject createUnityInstance, so treat an error banner as a failure.
                showBanner: (msg, type) => {
                    if (type === "error") {
                        console.error(msg);
                        reject(new Error(msg));
                    } else if (type === "warning") console.warn(msg);
                    else console.log(msg);
                }
            };
            create(canvas, config, (progress) => notify("OnUnityProgress", progress)).then(resolve, reject);
        });
        pendingLoad = load.then(
            (instance) => { if (!isCurrent()) quitInstance(instance); },
            () => { });

        const instance = await load;
        if (!isCurrent()) return;
        activeUnityInstance = instance;
        notify("OnUnityLoaded");
    };

    run().catch((err) => {
        if (!isCurrent()) {
            // The host already went away (e.g. navigated off mid-load), so nobody shows this.
            console.warn("Zenith-Apex: an abandoned Unity load failed.", err);
            return;
        }
        console.error("Zenith-Apex: Unity failed to load.", err);
        notify("OnUnityLoadFailed", errorMessage(err));
    });
};

/**
 * Ends the given session and quits its instance. A stale id (a newer session has
 * started since) leaves the newer instance running. Returns a promise that settles
 * when every pending Quit() has finished.
 */
window.terminateUnityInstance = (session) => {
    if (session !== currentSession) return pendingQuit;
    currentSession = null;
    window.dotNetUnityHelper = null;
    return quitActiveInstance();
};

window.dispatchUnityEvent = (eventName, jsonPayload) => {
    if (window.dotNetUnityHelper) {
        window.dotNetUnityHelper.invokeMethodAsync("ReceiveMessageFromGame", eventName, jsonPayload).catch((err) => {
            console.warn("Zenith-Apex: ReceiveMessageFromGame could not reach .NET.", err);
        });
    }
};

window.sendToUnity = (objectName, methodName, value) => {
    if (activeUnityInstance) {
        activeUnityInstance.SendMessage(objectName, methodName, value);
    }
};
