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