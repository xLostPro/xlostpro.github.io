/**
 * ZENITH-APEX CORE UTILITIES v1.0.0
 * Standardised helper functions for UI and data persistence.
 */

window.downloadFile = (fileName, content) => {
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = fileName; a.click();
    URL.revokeObjectURL(url);
};

window.modifyTextAtCursor = (el, openTag, closeTag = "") => {
    const start = el.selectionStart, end = el.selectionEnd, text = el.value;
    el.value = text.substring(0, start) + openTag + text.substring(start, end) + closeTag + text.substring(end);
    el.focus();
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

