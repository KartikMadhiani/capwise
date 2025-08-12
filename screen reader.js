document.addEventListener('DOMContentLoaded', () => {
    // Check if the browser supports the Speech Synthesis API
    if (!('speechSynthesis' in window)) {
        console.log('Sorry, your browser does not support text-to-speech.');
        return; // Exit if not supported
    }

    const container = document.getElementById('accessibility-container');
    if (!container) return;

    // --- Create Widget Elements ---
    // The ♿ icon is a universal symbol for accessibility
    const toggleButton = document.createElement('button');
    toggleButton.id = 'accessibility-toggle';
    toggleButton.innerHTML = '♿'; 
    toggleButton.title = 'Accessibility Tools';

    const controlsDiv = document.createElement('div');
    controlsDiv.id = 'accessibility-controls';

    const readButton = document.createElement('button');
    readButton.id = 'readButton';
    readButton.textContent = '▶️ Read Page';

    const stopButton = document.createElement('button');
    stopButton.id = 'stopButton';
    stopButton.textContent = '⏹️ Stop Reading';
    
    // Add elements to the controls panel, then to the main container
    controlsDiv.appendChild(readButton);
    controlsDiv.appendChild(stopButton);
    container.appendChild(toggleButton);
    container.appendChild(controlsDiv);


    // --- Add Functionality ---
    const synth = window.speechSynthesis;
    const contentToRead = document.body;

    // Toggle the controls panel visibility
    toggleButton.addEventListener('click', () => {
        controlsDiv.classList.toggle('visible');
    });
    
    // Function to start reading
    readButton.addEventListener('click', () => {
        if (synth.speaking) {
            synth.cancel(); // Stop any current speech before starting
        }
        const utterance = new SpeechSynthesisUtterance(contentToRead.textContent);
        utterance.onerror = (event) => console.error('SpeechSynthesisUtterance.onerror', event);
        synth.speak(utterance);
        controlsDiv.classList.remove('visible'); // Hide menu after clicking
    });

    // Function to stop reading
    stopButton.addEventListener('click', () => {
        synth.cancel();
        controlsDiv.classList.remove('visible'); // Hide menu after clicking
    });
});
