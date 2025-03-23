class Analytics {
    async trackEvent(eventName, eventParams = {}) {

        // Use Chrome's built-in extension analytics
        if (chrome.runtime?.id) {
            try {
                await chrome.runtime.sendMessage({
                    type: 'analytics',
                    event: eventName,
                    params: eventParams
                });
            } catch (error) {
                console.debug('Analytics event not tracked:', error);
            }
        }
    }
}

// Create global analytics object
window.analytics = new Analytics(); 