document.getElementById("logCookies").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.cookies.getAll({ url: tabs[0].url }, (cookies) => {
            console.log("Cookies for", tabs[0].url, ":", cookies);
        });
    });
});