(function () {
    let screenReaderEnabled = false;
    let speech = window.speechSynthesis;
    let addedTabIndexes = [];

    // Get references to the button and icons once the DOM is loaded
    let toggleBtn, playIcon, stopIcon;

    function speak(text, isAnnouncement = false) {
        if (!text) return;
        speech.cancel();
        let utterance = new SpeechSynthesisUtterance(text);
        
        // Announcements can be slightly different if needed
        if (isAnnouncement) {
            utterance.rate = 1.2;
            utterance.pitch = 1.1;
        }

        speech.speak(utterance);
    }

    function getElementDescription(el) {
        return (
            el.getAttribute('aria-label') ||
            el.alt ||
            el.innerText.trim()
        );
    }

    function onFocus(e) {
        if (!screenReaderEnabled) return;
        const desc = getElementDescription(e.target);
        if (desc) speak(desc);
    }

    function onKeyDown(e) {
        if (!screenReaderEnabled) return;
        if (e.key === 'Enter' && document.activeElement) {
            e.preventDefault();
            document.activeElement.click();
        }
    }

    function enableFocusForAll() {
        const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, img, a, button');
        elements.forEach(el => {
            // Check if the element or its children have descriptive text
            const hasText = getElementDescription(el);
            // Check if it is naturally focusable or already has a tabIndex
            const isNaturallyFocusable = el.tabIndex >= 0;

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

        // Toggle the high-contrast visual mode
        document.body.classList.toggle('sr-mode');

        if (screenReaderEnabled) {
            playIcon.style.display = 'none';
            stopIcon.style.display = 'block';
            toggleBtn.setAttribute('aria-label', 'Disable Screen Reader Mode');
            
            enableFocusForAll();
            speak('Screen reader mode enabled', true);
        } else {
            playIcon.style.display = 'block';
            stopIcon.style.display = 'none';
            toggleBtn.setAttribute('aria-label', 'Enable Screen Reader Mode');

            removeAddedFocus();
            speak('Screen reader mode disabled', true);
        }
    }

    document.addEventListener('focus', onFocus, true);
    document.addEventListener('keydown', onKeyDown);

    // Wait for the DOM to load before trying to find the button
    document.addEventListener('DOMContentLoaded', function () {
        toggleBtn = document.getElementById('sr-toggle-btn');
        if (toggleBtn) {
            playIcon = toggleBtn.querySelector('.feather-volume-2');
            stopIcon = toggleBtn.querySelector('.feather-square');
            toggleBtn.addEventListener('click', toggleScreenReader);
        } else {
            console.error('Screen Reader Toggle Button with id "sr-toggle-btn" not found.');
        }
    });
})();
