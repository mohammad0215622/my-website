// Utility functions
const Utils = {
    // Format time
    formatTime(date) {
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    },

    // Format date
    formatDate(date) {
        return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    },

    // Format short date
    formatShortDate(date) {
        return date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
    },

    // Format currency
    formatCurrency(amount) {
        return '$' + Number(amount).toLocaleString('en-US', { minimumFractionDigits: 0 });
    },

    // Format relative time
    formatRelativeTime(dateStr) {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = Math.floor((now - date) / 1000);

        if (diff < 60) return 'Just now';
        if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
        if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
        return Math.floor(diff / 86400) + 'd ago';
    },

    // Generate unique ID
    generateId() {
        return 'id_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Escape HTML
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    // Debounce
    debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    },

    // Throttle
    throttle(func, limit) {
        let inThrottle;
        return function (...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // NUI Callback
    async nuiCallback(event, data = {}) {
        try {
            const resp = await fetch(`https://${GetParentResourceName()}/${event}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return await resp.json();
        } catch (e) {
            return null;
        }
    },

    // Get resource name (fallback for browser testing)
    getResourceName() {
        return typeof GetParentResourceName === 'function' ? GetParentResourceName() : 'fivem-computer';
    }
};

// Make GetParentResourceName available globally if not in FiveM
if (typeof GetParentResourceName === 'undefined') {
    window.GetParentResourceName = () => 'fivem-computer';
}
