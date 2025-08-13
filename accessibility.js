// script.js - Upgraded for Focus Reading

document.addEventListener('DOMContentLoaded', () => {
    const ttsButton = document.getElementById('tts-button');
    // Ensure the button exists before trying to access its children
    if (!ttsButton) {
        console.error('TTS Button with ID "tts-button" not found.');
        return;
    }
    const playIcon = ttsButton.querySelector('.feather-volume-2');
    const stopIcon = ttsButton.querySelector('.feather-square');

    // Check if the browser supports the SpeechSynthesis API
    if ('speechSynthesis' in window) {
        let isFocusReaderActive = false;

        // This function will be called whenever an element gets focus
        const handleFocus = (event) => {
            // Do nothing if the focus reader mode is turned off
            if (!isFocusReaderActive) {
                return;
            }

            const focusedElement = event.target;
            let textToRead = '';

            // 1. Prioritize aria-label for screen-reader-specific text
            if (focusedElement.hasAttribute('aria-label')) {
                textToRead = focusedElement.getAttribute('aria-label');
            } 
            // 2. Then check for inner text (for buttons, links, paragraphs, etc.)
            else if (focusedElement.innerText) {
                textToRead = focusedElement.innerText.trim();
            }

            if (textToRead) {
                // Stop any previous speech before starting a new one
                window.speechSynthesis.cancel();

                const utterance = new SpeechSynthesisUtterance(textToRead);
                utterance.rate = 1.2; // A comfortable speed for navigation
                utterance.pitch = 1;

                window.speechSynthesis.speak(utterance);
            }
        };

        // Listen for the 'focus' event on the entire page.
        // The 'true' argument captures the event reliably.
        document.body.addEventListener('focus', handleFocus, true);

        // Repurpose the button to toggle the focus reader ON and OFF
        ttsButton.addEventListener('click', () => {
            isFocusReaderActive = !isFocusReaderActive; // Toggle the state

            if (isFocusReaderActive) {
                // Mode is now ON
                playIcon.style.display = 'none';
                stopIcon.style.display = 'block';
                ttsButton.setAttribute('aria-label', 'Disable focus reading mode.');
                // Announce that the mode is on
                const startMsg = new SpeechSynthesisUtterance("Focus reading activated.");
                window.speechSynthesis.speak(startMsg);
            } else {
                // Mode is now OFF
                window.speechSynthesis.cancel(); // Stop any active speech
                playIcon.style.display = 'block';
                stopIcon.style.display = 'none';
                ttsButton.setAttribute('aria-label', 'Enable focus reading mode.');
            }
        });

        // Ensure speech is stopped if the user navigates away from the page
        window.addEventListener('beforeunload', () => {
            if (isFocusReaderActive) {
                window.speechSynthesis.cancel();
            }
        });

    } else {
        // If the browser doesn't support the API, hide the button
        console.log("Sorry, your browser does not support text-to-speech.");
        ttsButton.style.display = 'none';
    }
});
