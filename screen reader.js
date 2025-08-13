// script.js

document.addEventListener('DOMContentLoaded', () => {
    const ttsButton = document.getElementById('tts-button');
    const playIcon = ttsButton.querySelector('.feather-volume-2');
    const stopIcon = ttsButton.querySelector('.feather-square');

    // Check if the browser supports the SpeechSynthesis API
    if ('speechSynthesis' in window) {
        let isFocusReaderActive = false;

        // This function will be called whenever an element receives focus
        const handleFocus = (event) => {
            // Do nothing if the focus reader is not active
            if (!isFocusReaderActive) {
                return;
            }

            const focusedElement = event.target;
            let textToRead = '';

            // Prioritize aria-label for screen reader-specific text
            if (focusedElement.hasAttribute('aria-label')) {
                textToRead = focusedElement.getAttribute('aria-label');
            } 
            // Then check for inner text (for buttons, links, paragraphs, etc.)
            else if (focusedElement.innerText) {
                textToRead = focusedElement.innerText;
            }
            // Finally, check for the value (for input fields)
            else if (focusedElement.value) {
                textToRead = focusedElement.value;
            }

            if (textToRead.trim().length > 0) {
                // Stop any previous speech before starting a new one
                window.speechSynthesis.cancel();

                const utterance = new SpeechSynthesisUtterance(textToRead);
                utterance.rate = 1.2; // Slightly faster for quicker navigation
                utterance.pitch = 1;

                window.speechSynthesis.speak(utterance);
            }
        };

        // Listen for the 'focus' event bubbling up to the body
        // The 'true' argument makes it capture the event on its way down, which is more reliable
        document.body.addEventListener('focus', handleFocus, true);

        // Repurpose the button to toggle the focus reader ON and OFF
        ttsButton.addEventListener('click', () => {
            isFocusReaderActive = !isFocusReaderActive; // Toggle the state

            if (isFocusReaderActive) {
                // Mode is now ON
                playIcon.style.display = 'none';
                stopIcon.style.display = 'block';
                ttsButton.setAttribute('aria-label', 'Disable focus reading mode. Reading is active.');
                // Optional: Announce that the mode is on
                window.speechSynthesis.speak(new SpeechSynthesisUtterance("Focus reading activated."));
            } else {
                // Mode is now OFF
                window.speechSynthesis.cancel(); // Stop any speech
                playIcon.style.display = 'block';
                stopIcon.style.display = 'none';
                ttsButton.setAttribute('aria-label', 'Enable focus reading mode. Reading is inactive.');
            }
        });

        // Ensure speech is stopped if the user leaves the page
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
