// script.js (Corrected to read all content)

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
            // Return the most relevant text from an element
            return (
                el.getAttribute('aria-label') ||
                el.getAttribute('alt') ||
                el.innerText?.trim() // Use optional chaining for safety
            );
        }

        // *** THIS FUNCTION IS THE CORRECTED PART ***
        function enableFocusForAll() {
            // Select all elements that might contain readable content
            const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, button, li, [role="button"], [role="link"], img');
            
            elements.forEach(el => {
                const hasText = getElementDescription(el);
                // Check if the element is already focusable by default or has a tabindex
                const isAlreadyFocusable = el.matches('a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])');

                // If it has text and is NOT already focusable, make it focusable
                if (hasText && !isAlreadyFocusable) {
                    el.tabIndex = 0; // Add to the tab order
                    addedTabIndexes.push(el); // Keep track to remove it later
                }
            });
        }

        function removeAddedFocus() {
            // Clean up by removing the tabindex from elements we modified
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
                enableFocusForAll(); // Activate the focus logic
                speak('Screen reader mode enabled.', true);
            } else {
                playIcon.style.display = 'block';
                stopIcon.style.display = 'none';
                toggleBtn.setAttribute('aria-label', 'Enable Screen Reader Mode');
                removeAddedFocus(); // Deactivate the focus logic
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
