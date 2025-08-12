// Wait for the webpage to fully load before running the script
document.addEventListener('DOMContentLoaded', () => {

    // Select the control buttons and the main content of the page
    const readButton = document.getElementById('readButton');
    const stopButton = document.getElementById('stopButton');
    const contentToRead = document.body; // Reads the entire page body

    // Check if the browser supports the Speech Synthesis API
    if ('speechSynthesis' in window) {
        const synth = window.speechSynthesis;
        let utterance = new SpeechSynthesisUtterance();

        // Function to start reading
        readButton.addEventListener('click', () => {
            if (synth.speaking) {
                synth.cancel(); // Stop any current speech before starting anew
            }
            // Get all visible text from the page
            utterance.text = contentToRead.textContent;
            synth.speak(utterance);
        });

        // Function to stop reading
        stopButton.addEventListener('click', () => {
            synth.cancel();
        });

    } else {
        // If the browser doesn't support the API, hide the controls
        console.log('Sorry, your browser does not support text-to-speech.');
        readButton.style.display = 'none';
        stopButton.style.display = 'none';
    }
});