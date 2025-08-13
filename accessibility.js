(function () {
    const speech = window.speechSynthesis;
    let screenReaderEnabled = false;
    let addedTabIndexes = [];

    // This function will run once the entire page is loaded
    document.addEventListener('DOMContentLoaded', function () {
        const toggleBtn = document.getElementById('sr-toggle-btn');
        if (!toggleBtn) {
            console.error('Accessibility toggle button not found.');
            return;
        }

        const playIcon = toggleBtn.querySelector('.feather-volume-2');
        const stopIcon = toggleBtn.querySelector('.feather-square');

        function speak(text, isAnnouncement = false) {
            if (!text || !speech) return;
            speech.cancel(); // Stop any previous speech
            const utterance = new SpeechSynthesisUtterance(text);
            if (isAnnouncement) {
                utterance.rate = 1.2;
            }
            speech.speak(utterance);
        }

        function getElementDescription(el) {
            return (
                el.getAttribute('aria-label') ||
                el.getAttribute('alt') ||
                el.innerText.trim()
            );
        }

        function enableFocusForAll() {
            // Find all major content and interactive elements
            const elements = document.querySelectorAll('h1, h2, h3, p, a, button, [role="button"], [role="link"]');
            elements.forEach(el => {
                const hasText = getElementDescription(el);
                const isNaturallyFocusable = el.tabIndex >= 0;
                // If it has text but isn't focusable, make it focusable
                if (hasText && !isNaturallyFocusable) {
                    el.tabIndex = 0;
                    addedTabIndexes.push(el);
                }
            });
        }

        function removeAddedFocus() {
            addedTabIndexes.forEach(el => el.removeAttribute('tabindex'));
            addedTabIndexes = [];
        }

        function toggleScreenReader() {
            screenReaderEnabled = !screenReaderEnabled;
            speech.cancel();
            
            // Toggle the high-contrast visual mode on the body
            document.body.classList.toggle('sr-mode');

            if (screenReaderEnabled) {
                playIcon.style.display = 'none';
                stopIcon.style.display = 'block';
                toggleBtn.setAttribute('aria-label', 'Disable Screen Reader Mode');
                enableFocusForAll();
                speak('Screen reader mode enabled.', true);
            } else {
                playIcon.style.display = 'block';
                stopIcon.style.display = 'none';
                toggleBtn.setAttribute('aria-label', 'Enable Screen Reader Mode');
                removeAddedFocus();
                speak('Screen reader mode disabled.', true);
            }
        }
        
        // Main event listeners
        document.addEventListener('focus', (e) => {
            if (screenReaderEnabled) {
                const desc = getElementDescription(e.target);
                if (desc) speak(desc);
            }
        }, true);

        toggleBtn.addEventListener('click', toggleScreenReader);
    });
})();
