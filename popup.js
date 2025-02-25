var cookie_name = []
var cookie_domain = []
var cookie_value = []

document.getElementById("logCookies").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.cookies.getAll({ url: tabs[0].url }, (cookies) => {
            console.log("Cookies for", tabs[0].url, ":", cookies);
            cookie_name = cookies.map(cookie => cookie.name);
            cookie_domain = cookies.map(cookie => cookie.domain);
            cookie_value = cookies.map(cookie => cookie.cookie_value);
            console.log(cookie_name);
            console.log(cookie_domain);
            console.log(cookie_value);
        });
    });
});