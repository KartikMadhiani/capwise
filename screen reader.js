// script.js

document.addEventListener('DOMContentLoaded', () => {
    const ttsButton = document.getElementById('tts-button');
    const playIcon = ttsButton.querySelector('.feather-volume-2');
    const stopIcon = ttsButton.querySelector('.feather-square');

    // Check if the browser supports the SpeechSynthesis API
    if ('speechSynthesis' in window) {
        let isSpeaking = false;
        
        ttsButton.addEventListener('click', () => {
            if (!isSpeaking) {
                // Get the main text content of the page
                // You can customize the selector to target specific content areas
                const contentToRead = document.querySelector('main')?.innerText || document.body.innerText;
                
                if (contentToRead.trim().length > 0) {
                    const utterance = new SpeechSynthesisUtterance(contentToRead);
                    
                    // Optional: Configure voice, rate, pitch
                    // const voices = window.speechSynthesis.getVoices();
                    // utterance.voice = voices[0]; // Select a preferred voice
                    utterance.rate = 1; // Speed of speech
                    utterance.pitch = 1; // Pitch of speech

                    utterance.onstart = () => {
                        isSpeaking = true;
                        playIcon.style.display = 'none';
                        stopIcon.style.display = 'block';
                        ttsButton.setAttribute('aria-label', 'Stop listening');
                    };

                    utterance.onend = () => {
                        isSpeaking = false;
                        playIcon.style.display = 'block';
                        stopIcon.style.display = 'none';
                        ttsButton.setAttribute('aria-label', 'Listen to this page');
                    };

                    window.speechSynthesis.speak(utterance);
                }
            } else {
                // If it's currently speaking, stop it
                window.speechSynthesis.cancel();
                isSpeaking = false; // Manually reset state as onend might not fire immediately
                playIcon.style.display = 'block';
                stopIcon.style.display = 'none';
                ttsButton.setAttribute('aria-label', 'Listen to this page');
            }
        });

        // Ensure speech is stopped if the user leaves the page
        window.addEventListener('beforeunload', () => {
            window.speechSynthesis.cancel();
        });

    } else {
        // If the browser doesn't support the API, hide the button
        console.log("Sorry, your browser does not support text-to-speech.");
        ttsButton.style.display = 'none';
    }
});
