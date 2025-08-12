document.addEventListener('DOMContentLoaded', () => {
    // 1. Check if the browser supports the Speech Synthesis API
    if (!('speechSynthesis' in window)) {
        console.log('Sorry, your browser does not support text-to-speech.');
        return; // Exit if not supported
    }

    // 2. Find the placeholder container in your HTML
    const container = document.getElementById('accessibility-container');
    if (!container) {
        console.error('Accessibility container not found. Add <div id="accessibility-container"></div> to your page.');
        return;
    }

    // 3. Build the switch widget elements dynamically
    const settingRow = document.createElement('div');
    settingRow.className = 'setting-row';
    
    const labelSpan = document.createElement('span');
    labelSpan.textContent = 'Reader Mode';
    
    const switchLabel = document.createElement('label');
    switchLabel.className = 'switch';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    
    const sliderSpan = document.createElement('span');
    sliderSpan.className = 'slider';

    // 4. Assemble the switch and add it to the page
    switchLabel.appendChild(checkbox);
    switchLabel.appendChild(sliderSpan);
    settingRow.appendChild(labelSpan);
    settingRow.appendChild(switchLabel);
    container.appendChild(settingRow);

    // 5. Add the text-to-speech functionality
    const synth = window.speechSynthesis;

    checkbox.addEventListener('change', (event) => {
        // Always stop any current speech when the switch is toggled
        synth.cancel();

        // If the switch is turned ON
        if (event.target.checked) {
            // Get all text from the main content of the page
            const contentToRead = document.querySelector('main').textContent;
            const utterance = new SpeechSynthesisUtterance(contentToRead);
            
            // IMPORTANT: When speech finishes, turn the switch back OFF
            utterance.onend = () => {
                checkbox.checked = false;
            };
            
            // Also turn off on error
            utterance.onerror = (err) => {
                console.error('An error occurred during speech synthesis:', err);
                checkbox.checked = false;
            };
            
            synth.speak(utterance);
        }
    });
});
