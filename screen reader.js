<script>
document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.getElementById('screenReaderToggle');
    let utterance = null;

    function startReading() {
        const text = document.body.innerText;
        utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1; // Speed
        utterance.pitch = 1; // Tone
        speechSynthesis.speak(utterance);
    }

    function stopReading() {
        speechSynthesis.cancel();
    }

    toggle.addEventListener('change', function () {
        if (this.checked) {
            startReading();
        } else {
            stopReading();
        }
    });
});
</script>
