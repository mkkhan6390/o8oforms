console.log('content.js loaded!');
const userinfo = localStorage.getItem('personalInfo');
const systemPrompt = `The users information is ${userinfo}.For given form html provide a json array of the following structure for all the form elements that can be filled and the user data that should be filled in it : [ { fieldname, queryselector, userdata }, ]. The response should be a valid JSON with no extra text.`;

async function analyzeFormWithGroq(formHtml) {
    try {
        console.log('Analyzing form with Groq...');
        
        // Send message to background script to handle API call
        chrome.runtime.sendMessage({
            action: 'analyzeFormWithGroq',
            formHtml: formHtml.innerHTML,
            systemPrompt: systemPrompt
        });
    } catch (error) {
        console.log('Error analyzing form with Groq:', error);
        chrome.runtime.sendMessage({
            type: 'formAnalysis',
            error: 'Failed to analyze form. Please try again.'
        });
    }
}

// Listen for response from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'groqAnalysisResult') {
        const result = message.data;
        console.log('Form analysis result:', result);
        
        const aiResponse = result.choices[0].message.content;
        const formdata = extractJSON(aiResponse);
        console.log('extracted JSON:', formdata);

        chrome.storage.local.set({
            'lastFormAnalysis': formdata
        });

        for(let field of formdata) {
            const element = document.querySelector(field.queryselector);
            if(element) {
                element.value = field.userdata;
            }
        }

        chrome.runtime.sendMessage({
            type: 'formAnalysis',
            data: result
        });
    } else if (message.type === 'groqAnalysisError') {
        console.error('Groq analysis error:', message.error);
        chrome.runtime.sendMessage({
            type: 'formAnalysis',
            error: message.error
        });
    }
});

// Listen for messages from the background script
// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'checkForForms') {
        // Check if any forms exist on the page
        const form = document.querySelector('textarea').closest('form');
        const hasForm = !!form;
        console.log('hasForm:', hasForm);
        sendResponse({ hasForm });
    }
    else if (request.action === 'analyzeForm') {
        const form = document.querySelector('textarea').closest('form');
        console.log('analyzeForm:', form);
        analyzeFormWithGroq(form);
    }
    return true; // Required for async response
});

const extractJSON = text => {
    try {
        return JSON.parse(text.replace(/\s+/g,' ').match(/\[\s\{.+\}\s\]/g))
    } catch (error) {
        return []
    }
}