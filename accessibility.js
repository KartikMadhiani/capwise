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
                
                if (conten
