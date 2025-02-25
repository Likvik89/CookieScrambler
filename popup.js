document.getElementById("logCookies").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.cookies.getAll({ url: tabs[0].url }, (cookies) => {
            console.log("Cookies for", tabs[0].url, ":", cookies);
            
            // Update arrays
            cookie_name = cookies.map(cookie => cookie.name);
            cookie_domain = cookies.map(cookie => cookie.domain);
            cookie_value = cookies.map(cookie => cookie.value);
            
            console.log(cookie_name);
            console.log(cookie_domain);
            console.log(cookie_value);
            
            // Get the first cookie name (or all cookie names)
            if (cookie_name.length > 0) {
                document.getElementById("cookieDisplay").innerHTML = cookie_name.join(", ");  // Display names as comma-separated
            } else {
                document.getElementById("cookieDisplay").innerHTML = "No cookies found.";
            }
        });
    });
});
