console.log('content.js loaded!');
const userinfo = localStorage.getItem('personalInfo');
// Define the Groq API endpoint and API key
const GROQ_API_KEY = '';
const systemPrompt = `The users information is ${userinfo}.For given form html provide a json array of the following structure for all the form elements that can be filled and the user data that should be filled in it : [ { fieldname, queryselector, userdata }, ]`;

async function analyzeFormWithGroq(formHtml) {
    try {
        console.log('Analyzing form with Groq...');

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
                        content: formHtml.innerHTML
                    }
                ],
                model: "meta-llama/llama-4-scout-17b-16e-instruct",
                temperature: 0.1,
                max_tokens: 1024
            })
        });

        const result = await response.json();

        if (response.ok) {
            console.log('Form analysis result:', result);
            
            const aiResponse = result.choices[0].message.content;
            const formdata = extractJSON(aiResponse);
            console.log('extracted JSON:',formdata);
            // Store the analysis result

            chrome.storage.local.set({
                'lastFormAnalysis': formdata
            });

            for(let field of formdata){
                const element = formHtml.querySelector(field.queryselector);
                if(element){
                    element.value = field.userdata;
                }
            }
            // Send data to popup
            chrome.runtime.sendMessage({
                type: 'formAnalysis',
                data: result
            });
        } else {
            console.error('Error analyzing form with Groq:', result);
            // Send error message to popup
            chrome.runtime.sendMessage({
                type: 'formAnalysis',
                error: result.error || 'Failed to analyze form. Please try again.'
            });
        }
    } catch (error) {
        console.log('Error analyzing form with Groq:', error);
        // Send error message to popup
        chrome.runtime.sendMessage({
            type: 'formAnalysis',
            error: 'Failed to analyze form. Please try again.'
        });
    }
}

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