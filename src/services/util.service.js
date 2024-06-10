
export const utilService = {
    makeId,
    saveToStorage,
    loadFromStorage,
    formatDate,
    removeEmptyKeys
}

function makeId(length = 5) {
    var text = "MUIxx-";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}

function saveToStorage(key, value) {
    localStorage[key] = JSON.stringify(value);
}

function loadFromStorage(key, defaultValue = null) {
    var value = localStorage[key] || defaultValue;
    return JSON.parse(value);
}

function formatDate(timestamp) {
    const now = new Date();
    const date = new Date(timestamp);

    if (now.getDate() === date.getDate()) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }
    return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'numeric'
    });
}

function removeEmptyKeys(obj) {
    return Object.fromEntries(
        Object.entries(obj).filter(([_, value]) => value !== "")
    );
}