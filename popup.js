document.addEventListener('DOMContentLoaded', function() {
    // Load saved data when popup opens
    loadSavedData();

    // Handle edit button click
    document.getElementById('editButton').addEventListener('click', function() {
        document.getElementById('infoDisplay').style.display = 'none';
        document.getElementById('personalInfoForm').style.display = 'block';
    });

    // Handle cancel button click
    document.getElementById('cancelButton').addEventListener('click', function() {
        document.getElementById('personalInfoForm').style.display = 'none';
        document.getElementById('infoDisplay').style.display = 'block';
    });

    // Handle form submission
    document.getElementById('personalInfoForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const personalInfo = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            company: document.getElementById('company').value,
            title: document.getElementById('title').value,
            website: document.getElementById('website').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            zip: document.getElementById('zip').value,
            country: document.getElementById('country').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value,
            bestTimeToRespond: document.getElementById('bestTimeToRespond').value,
            defaultData: document.getElementById('defaultData').value
        };

        // Save to localStorage
        localStorage.setItem('personalInfo', JSON.stringify(personalInfo));

        // Update display
        updateInfoDisplay(personalInfo);

        // Show success message
        const status = document.getElementById('status');
        status.style.display = 'block';
        setTimeout(() => {
            status.style.display = 'none';
        }, 2000);

        // Switch back to display view
        document.getElementById('personalInfoForm').style.display = 'none';
        document.getElementById('infoDisplay').style.display = 'block';
    });
});

function updateInfoDisplay(personalInfo) {
    const infoDisplay = document.getElementById('infoDisplay');
    const defaultData = personalInfo.defaultData || 'Not set';
    
    const fields = [
        { label: 'First Name', value: 'firstName' },
        { label: 'Last Name', value: 'lastName' },
        { label: 'Full Name', value: 'fullName' },
        { label: 'Email', value: 'email' },
        { label: 'Phone', value: 'phone' },
        { label: 'Company', value: 'company' },
        { label: 'Title', value: 'title' },
        { label: 'Website', value: 'website' },
        { label: 'Address', value: 'address' },
        { label: 'City', value: 'city' },
        { label: 'State', value: 'state' },
        { label: 'ZIP Code', value: 'zip' },
        { label: 'Country', value: 'country' },
        { label: 'Subject', value: 'subject' },
        { label: 'Message', value: 'message' },
        { label: 'Best Time to Respond', value: 'bestTimeToRespond' }
    ];

    let html = '';
    fields.forEach(field => {
        html += `
            <div class="info-row">
                <span class="info-label">${field.label}:</span>
                <span>${personalInfo[field.value] || defaultData}</span>
            </div>
        `;
    });

    html += `
        <div class="info-row">
            <span class="info-label">Default Value for Empty Fields:</span>
            <span>${defaultData}</span>
        </div>
    `;

    infoDisplay.innerHTML = html;
}

function loadSavedData() {
    // Get saved data from localStorage
    const savedInfo = localStorage.getItem('personalInfo');
    if (savedInfo) {
        const personalInfo = JSON.parse(savedInfo);
        
        // Fill form with saved data
        const fields = [
            'firstName', 'lastName', 'fullName', 'email', 'phone', 
            'company', 'title', 'website', 'address', 'city', 
            'state', 'zip', 'country', 'subject', 'message', 
            'bestTimeToRespond', 'defaultData'
        ];

        fields.forEach(field => {
            const element = document.getElementById(field);
            if (element) {
                element.value = personalInfo[field] || '';
            }
        });

        // Update display view
        updateInfoDisplay(personalInfo);
    } else {
        // If no saved data, show default values
        updateInfoDisplay({
            defaultData: 'Not set'
        });
    }
}

// Add this new function to handle form analysis results
function handleFormAnalysis() {
    chrome.storage.local.get(['lastFormAnalysis'], function(result) {
        if (result.lastFormAnalysis) {
            const analysisResult = JSON.parse(result.lastFormAnalysis);
            displayFormAnalysis(analysisResult);
        }
    });
}

// Add these styles to your existing styles
const styles = `
    .form-analysis {
        margin-top: 20px;
        border-top: 1px solid #ccc;
        padding-top: 20px;
    }
    .analysis-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
    }
    .analysis-table th,
    .analysis-table td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
    }
    .analysis-table th {
        background-color: #f5f5f5;
        font-weight: bold;
    }
    .analysis-table tr:nth-child(even) {
        background-color: #f9f9f9;
    }
    .analysis-table tr:hover {
        background-color: #f5f5f5;
    }
    
    .analyze-section {
        margin-top: 20px;
        text-align: center;
    }
    
    .loader {
        border: 3px solid #f3f3f3;
        border-radius: 50%;
        border-top: 3px solid #3498db;
        width: 20px;
        height: 20px;
        animation: spin 1s linear infinite;
        margin: 10px auto;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .no-form-message {
        text-align: center;
        padding: 20px;
        color: #666;
        background-color: #f9f9f9;
        border: 1px solid #ddd;
        border-radius: 4px;
        margin-top: 20px;
    }
`;

function displayFormAnalysis(analysisResult) {
    const analysisTable = document.getElementById('analysisTable');
    
    // Create table HTML
    let tableHtml = `
        <div class="form-analysis">
            <h3>Detected Form Fields</h3>
            <table class="analysis-table">
                <thead>
                    <tr>
                        <th>Field Name</th>
                        <th>Field XPath</th>
                    </tr>
                </thead>
                <tbody>
    `;

    // Add rows for each field
    analysisResult.forEach(field => {
        tableHtml += `
            <tr>
                <td>${field.fieldname}</td>
                <td>${field.fieldxpath}</td>
            </tr>
        `;
    });

    tableHtml += `
                </tbody>
            </table>
        </div>
    `;

    // Add the table to the display
    analysisTable.innerHTML = tableHtml;
    analysisTable.style.display = 'block';
}

// Add this to your DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function() {
    // Add listener for form analysis results
    handleFormAnalysis();

    // Add analyze button click handler
    document.getElementById('analyzeButton').addEventListener('click', async function() {
        const loader = document.getElementById('loader');
        const analysisTable = document.getElementById('analysisTable');
        
        // Show loader
        loader.style.display = 'block';
        analysisTable.style.display = 'none';

        try {
            // Query the active tab and check for forms
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {action: 'checkForForms'}, function(response) {
                    console.log('Response from background script:', response);
                    if (response && response.hasForm) {
                        // If form exists, send analyze request
                        chrome.tabs.sendMessage(tabs[0].id, {action: 'analyzeForm'});
                    } else {
                        // If no form exists, show message and hide loader
                        loader.style.display = 'none';
                        const analysisTable = document.getElementById('analysisTable');
                        analysisTable.innerHTML = `
                            <div class="no-form-message">
                                <p>No forms detected on the current page.</p>
                            </div>
                        `;
                        analysisTable.style.display = 'block';
                    }
                });
            });
        } catch (error) {
            console.error('Error checking for forms:', error);
            loader.style.display = 'none';
        }
    });

    // Listen for analysis results
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.type === 'formAnalysis') {
            const loader = document.getElementById('loader');
            loader.style.display = 'none';
            
            if (message.data) {
                console.log(message.data)
                displayFormAnalysis(JSON.parse(message.data));
            }
        }
    });
});