document.addEventListener('DOMContentLoaded', () => {
    const sourceTextarea = document.getElementById('sourceText');
    const translatedTextarea = document.getElementById('translatedText');
    const sourceLanguageSelect = document.getElementById('sourceLanguage');
    const targetLanguageSelect = document.getElementById('targetLanguage');
    const translateButton = document.getElementById('translateButton');

    // Function to perform translation using the unofficial Google Translate endpoint
    async function triggerTranslation() {
        const sourceText = sourceTextarea.value.trim();
        if (!sourceText) {
            translatedTextarea.value = '';
            return;
        }

        // Changed 'auto' to be explicitly 'auto' in the URL parameter
        const sourceLang = sourceLanguageSelect.value === 'auto' ? 'auto' : sourceLanguageSelect.value;
        const targetLang = targetLanguageSelect.value;

        translatedTextarea.value = 'Translating...';
        translateButton.disabled = true; // Disable button during translation
        translateButton.classList.add('opacity-50', 'cursor-not-allowed');

        try {
            // Encode the text for URL
            const encodedText = encodeURIComponent(sourceText);
            // Construct the unofficial Google Translate API URL
            // client=gtx is often used for client-side requests
            // dt=t for translation data
            // sl for source language, tl for target language, q for query
            const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodedText}`;

            console.log('API URL:', apiUrl); // Log the URL for debugging

            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            // The response structure is an array of arrays.
            // The translated text is usually in data[0][0][0]
            let translatedResult = '';
            if (data && data[0] && data[0].length > 0) {
                data[0].forEach(segment => {
                    if (segment && segment.length > 0) {
                        translatedResult += segment[0];
                    }
                });
            }

            translatedTextarea.value = translatedResult;

        } catch (error) {
            console.error('Translation error:', error);
            translatedTextarea.value = 'Error: Could not translate. Please try again later.';
        } finally {
            translateButton.disabled = false; // Re-enable button
            translateButton.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    }

    // Event listeners
    translateButton.addEventListener('click', triggerTranslation);

    // Optional: Trigger translation on input change with a debounce for performance
    let debounceTimer;
    sourceTextarea.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(triggerTranslation, 800); // Translate after 800ms of no typing
    });

    // Handle language selection changes
    sourceLanguageSelect.addEventListener('change', triggerTranslation);
    targetLanguageSelect.addEventListener('change', triggerTranslation);

    // Set initial language selections
    sourceLanguageSelect.value = 'auto';
    targetLanguageSelect.value = 'en';
});
