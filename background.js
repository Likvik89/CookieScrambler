chrome.action.onClicked.addListener((tab) => {
    chrome.cookies.getAll({ url: tab.url }, (cookies) => {
        console.log("Cookies for", tab.url, ":", cookies);
    });
});