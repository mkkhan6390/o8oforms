# o8oForms - AI-Powered Form Autofill Extension

## Overview
o8oForms is a Chrome extension that uses AI to intelligently analyze and autofill web forms using your personal information. It leverages the Groq AI API to understand form structures and automatically map your stored personal data to the appropriate form fields.

## Features
- 🤖 AI-powered form field analysis
- 📝 Smart form field mapping
- 🔒 Secure personal information storage
- ⚡ Quick form autofill
- 🎯 Accurate field detection
- 🔄 Default value fallback system
## Installation
1. Clone the repository
2. Install dependencies:
bash

Run

Open Folder

1

npm install

3. Build the extension:
bash

Run

Open Folder

1

npm run build

4. Load the extension in Chrome:
   - Open Chrome and navigate to chrome://extensions/
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the extension directory
## Configuration
1. Click the extension icon to open the popup
2. Enter your personal information
3. Set a default value for unidentified fields
4. Save your information
## Usage
1. Navigate to any webpage with a form
2. Click the extension icon
3. Click "Analyze Form Fields"
4. The extension will automatically fill the form with your stored information
## Technical Stack
- Chrome Extension APIs
- Groq AI API
- Webpack for bundling
- JavaScript (ES6+)
## Project Structure
plaintext

Open Folder

1

2

3

4

5

6

7

o8oform/

├── background.js    # Background service worker

├── content.js      # Content script for form analysis

├── popup.html      # Extension popup interface

├── popup.js        # Popup functionality

├── manifest.json   # Extension manifest

└── package.json    # Project dependencies

## Security
- Personal information is stored locally in Chrome storage
- API keys are securely handled in the background script
- No data is transmitted except for form analysis
## Development
To work on the extension:

1. Make changes to the source files
2. Run npm run build to rebuild
3. Reload the extension in Chrome
## License
This project is proprietary software.

## Notes
- The extension requires permissions for storage and active tab access
- Form analysis requires an active internet connection
- Some forms may require manual adjustment after autofill
## Contributing
Currently, this is a private project and not open for contributions.

For support or inquiries, please contact +91 8291430205 on Whatsapp or email at mkkhan6390@gmail.com.
