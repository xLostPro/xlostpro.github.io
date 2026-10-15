/**
 * ZENITH-APEX CORE UTILITIES v1.0.0
 * Standardised helper functions for UI and data persistence.
 */

window.downloadFile = (fileName, content) => {
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = fileName; a.click();
    // Revoking synchronously can cancel the download in some browsers.
    setTimeout(() => URL.revokeObjectURL(url), 0);
};

window.modifyTextAtCursor = (el, openTag, closeTag = "") => {
    const start = el.selectionStart, end = el.selectionEnd, text = el.value;
    el.value = text.substring(0, start) + openTag + text.substring(start, end) + closeTag + text.substring(end);
    el.focus();
    // Keep the original selection highlighted inside the inserted tags.
    el.setSelectionRange(start + openTag.length, end + openTag.length);
    return el.value;
};

window.scrollToElement = (id) => {
    const el = document.getElementById(id);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.style.outline = "2px solid #2563eb";
        setTimeout(() => { el.style.outline = "none"; }, 1000);
    }
};

window.getElementRect = (el) => {
    const rect = el.getBoundingClientRect();
    return { left: rect.left, top: rect.top };
};

// Forces the browser to re-evaluate spellcheck on a specific element
window.kickSpellcheck = (el) => {
    if (!el) return;
    el.setAttribute('spellcheck', 'false');
    setTimeout(() => el.setAttribute('spellcheck', 'true'), 10);
};

// Ensures the text-beam cursor is forced on editorial areas
window.forceTextCursor = (el) => { if (el) el.style.cursor = 'text'; };

// Helper for complex text-based probing used by the IntegrityService
window.probeElementByText = (tagName, text) => {
    const items = document.getElementsByTagName(tagName);
    for (let i = 0; i < items.length; i++) {
        if (items[i].textContent.includes(text)) return true;
    }
    return false;
};

/**
 * Synchronises the scroll position of the lens div with the textarea.
 * This prevents "Highlight Drift" during long narrative entries.
 */
window.syncEditorScroll = (textarea) => {
    if (!textarea) return;
    const container = textarea.parentElement;
    const lens = container.querySelector('.editor-lens');
    if (lens) {
        lens.scrollTop = textarea.scrollTop;
        lens.scrollLeft = textarea.scrollLeft;
    }
};


// Adds or removes a class on <body> (e.g. 'project-expanded' for the full-screen runner)
window.toggleBodyClass = (cls, on) => document.body.classList.toggle(cls, !!on);

// Returns the localStorage keys that start with the given prefix
window.listLocalStorageKeys = (prefix = "") =>
    Object.keys(localStorage).filter(k => k.startsWith(prefix));

/**
 * Exit guard: warns before the tab closes while the component reports unsaved changes.
 * dotNetRef must expose a synchronous [JSInvokable] GetDirtyStatus().
 */
let unloadGuardHandler = null;
window.setUnloadGuard = (dotNetRef) => {
    window.clearUnloadGuard();
    unloadGuardHandler = (e) => {
        let dirty = false;
        try { dirty = dotNetRef.invokeMethod('GetDirtyStatus'); } catch { /* reference already disposed */ }
        if (dirty) { e.preventDefault(); e.returnValue = 'Unsaved changes'; return 'Unsaved changes'; }
    };
    window.addEventListener('beforeunload', unloadGuardHandler);
};
window.clearUnloadGuard = () => {
    if (unloadGuardHandler) window.removeEventListener('beforeunload', unloadGuardHandler);
    unloadGuardHandler = null;
};
