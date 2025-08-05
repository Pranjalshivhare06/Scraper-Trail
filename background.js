chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "downloadCSV") {
    // Get data from localStorage on the current page
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: () => {
          return localStorage.getItem("bing_scraped_data");
        },
      }, (injectionResults) => {
        if (injectionResults && injectionResults[0].result) {
          const data = JSON.parse(injectionResults[0].result);
          const headers = ["Name", "Address", "Phone", "Email"];
          const rows = data.map(p => [p.name, p.address, p.phone, p.email]);

          let csvContent = "data:text/csv;charset=utf-8," + 
            [headers, ...rows].map(e => e.join(",")).join("\n");

          const encodedUri = encodeURI(csvContent);

          chrome.downloads.download({
            url: encodedUri,
            filename: "places.csv"
          });
        } else {
          console.error("No data found in localStorage.");
        }
      });
    });
  }
});
