// This is a Test api key with only free credits. To productise, it will be better to have a server side API call with user authentication.
const GROQ_API_KEY = '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';

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'analyzeFormWithGroq') {
        handleGroqAnalysis(request.formHtml, request.systemPrompt);
    }
    return true;
});

async function handleGroqAnalysis(formHtml, systemPrompt) {
    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: "system",
                        content: systemPrompt
                    },
                    {
                        role: "user",
                        content: formHtml
                    }
                ],
                model: "meta-llama/llama-4-scout-17b-16e-instruct",
                temperature: 0.1,
                max_tokens: 1024
            })
        });

        const result = await response.json();
        
        // Send result back to content script
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                type: 'groqAnalysisResult',
                data: result
            });
        });
    } catch (error) {
        console.error('Error in Groq analysis:', error);
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                type: 'groqAnalysisError',
                error: error.message
            });
        });
    }
}
// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   if (changeInfo.status === 'complete') {
//     chrome.scripting.executeScript({
//       target: { tabId: tabId },
//       function: checkForForms
//     });
//   }
// });

// function checkForForms() {
//   const form = document.querySelector('textarea').closest('form');
//   if (form) { 
//       const formHtml = form.innerHTML;
//       console.log('background.js: checkForForms: formHtml: ', formHtml);
//   }
// }