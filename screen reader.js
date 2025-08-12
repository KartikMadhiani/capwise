document.addEventListener('DOMContentLoaded', () => {
    // Check for browser support
    if (!('speechSynthesis' in window)) {
        console.log('Sorry, your browser does not support text-to-speech.');
        return;
    }

    const container = document.getElementById('accessibility-container');
    if (!container) return;

    // --- Create and add the switch directly to the container ---
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

    // Assemble the switch and the row
    switchLabel.appendChild(checkbox);
    switchLabel.appendChild(sliderSpan);
    settingRow.appendChild(labelSpan);
    settingRow.appendChild(switchLabel);
    
    // Add the row directly to the main container
    container.appendChild(settingRow);

    // --- Add Functionality ---
    const synth = window.speechSynthesis;

    // Listen for changes on the toggle switch
    checkbox.addEventListener('change', (event) => {
        // Stop any speech if the switch is toggled
        synth.cancel();

        if (event.target.checked) {
            // If switch is turned ON, start reading the page body
            const contentToRead = document.body;
            const utterance = new SpeechSynthesisUtterance(contentToRead.textContent);
            
            // When speech ends naturally, turn the switch OFF
            utterance.onend = () => {
                checkbox.checked = false;
            };
            
            utterance.onerror = (err) => {
                console.error('SpeechSynthesisUtterance.onerror', err);
                checkbox.checked = false; // Also turn off on error
            };
            
            synth.speak(utterance);
        }
    });
});
