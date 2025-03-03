// Set a character limit for the cookie value
const valueLimit = 50; // You can change this to any value you like

// Function to generate a random string of a specific length
function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

var logged = 0;

document.getElementById("logCookies").addEventListener("click", () => {
    if (logged === 5){
        alert("Cookies are already shown");
        logged = 0
    }else{
        logged += 1
        // Show the "Clear Cookies" button
        //document.getElementById("feelLucky").style.display = "inline-block"; 
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
                
                // Display the cookie names in the <a> element
                if (cookie_name.length > 0) {
                    document.getElementById("cookieDisplay").innerHTML = cookie_name.join(", ");
                } else {
                    document.getElementById("cookieDisplay").innerHTML = "No cookies found.";
                }
                 // Clear the cookie display text (no cookie names here anymore)
                 document.getElementById("cookieDisplay").innerHTML = "";
    
                // Create and populate the table with cookie details
                const table = document.getElementById("cookieTable");
    
                // Clear the table before inserting new data
                table.innerHTML = ""; // Remove any previous rows (if any)
    
                // Create table header
                const headerRow = document.createElement("tr");
                headerRow.innerHTML = `
                    <th>Crumble</th>
                    <th>Cookie Name</th>
                    <th>Domain</th>
                    <th>Value</th>
                `;
                table.appendChild(headerRow);
    
                // Create rows for each cookie
                for (let i = 0; i < cookie_name.length; i++) {
                    const row = document.createElement("tr");
    
                    // Truncate value if it's too long, and add a "Show More" link
                    let displayValue = cookie_value[i];
                    let fullValue = cookie_value[i];
                    let truncatedValue = displayValue.length > valueLimit ? displayValue.slice(0, valueLimit) + '...' : displayValue;
    
                    // Add the Scramble button and the other data
                    row.innerHTML = `
                        <td><button class="scrambleBtn" data-index="${i}" data-name="${cookie_name[i]}" data-domain="${cookie_domain[i]}">Crumble</button></td>
                        <td>${cookie_name[i]}</td>
                        <td>${cookie_domain[i]}</td>
                        <td>
                            <span class="valueText">${truncatedValue}</span>
                            ${displayValue.length > valueLimit ? `<a href="#" class="showMore" data-index="${i}">Show More</a>` : ''}
                        </td>
                    `;
                    table.appendChild(row);
                }
    
                // Add event listener for "Show More" link
                document.querySelectorAll(".showMore").forEach(link => {
                    link.addEventListener("click", (event) => {
                        event.preventDefault();
                        const index = event.target.dataset.index;
                        const valueCell = event.target.closest("td");
                        const fullValue = cookie_value[index];
                        const span = valueCell.querySelector(".valueText");
    
                        // Toggle between showing full and truncated value
                        if (span.innerHTML.includes('...')) {
                            span.innerHTML = fullValue;
                            event.target.innerHTML = "Show Less";
                        } else {
                            span.innerHTML = fullValue.slice(0, valueLimit) + '...';
                            event.target.innerHTML = "Show More";
                        }
                    });
                });
    
                // Add event listener for "Scramble" button
                document.querySelectorAll(".scrambleBtn").forEach(button => {
                    button.addEventListener("click", (event) => {
                        logged = 0;
                        const index = event.currentTarget.dataset.index;
                        const cookieName = event.currentTarget.dataset.name;
                        //const cookieDomain = event.currentTarget.dataset.domain.replace(/^\./, '');
    
    
                        // Generate a scrambled random value of the same length as the original value
                        const scrambledValue = generateRandomString(cookie_value[index].length);
    
                        // Scramble the cookie by updating it in the browser using chrome.cookies.set
    
                        const urlObj = new URL(tabs[0].url);
                        const baseUrl = `${urlObj.protocol}//${urlObj.hostname}`;
                        
                        chrome.cookies.set({
                            url: baseUrl,  // Use only protocol + hostname
                            name: cookieName,
                            value: scrambledValue,
                            //domain: cookieDomain, 
                            //path: '/',
                            //secure: urlObj.protocol === "https:", // Ensure secure is true for HTTPS sites
                            //httpOnly: false
                        }, (updatedCookie) => {
                            if (chrome.runtime.lastError) {
                                console.error("Error setting cookie:", chrome.runtime.lastError);
                            } else {
                                cookie_value[index] = scrambledValue; // Update local array
                                console.log(`Cookie scrambled:`, updatedCookie);
                                console.log("cookie value", scrambledValue);
                            }
                        });
                           
    
                            // Update the displayed value in the table
                            const valueCell = event.target.closest("tr").querySelector(".valueText");
                            valueCell.innerHTML = scrambledValue.slice(0, valueLimit) + '...'; // Show the scrambled value truncated

                        });
                    });
                });
        });
    }
});

/*// feeling lucky button
document.getElementById("feelLucky").addEventListener("click", () => {
        if (cookie_name.length === 0){
            return null;
        }else {
            if (tabs.length > 0) {
                const urlObj = new URL(tabs[0].url); // Define urlObj here before using it

                // Select a random cookie index
                const luck = Math.floor(Math.random() * cookie_name.length);

                // Generate a scrambled random value
                const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                let result = '';
                for (let i = 0; i < cookie_value[luck].length; i++) {
                    result += characters.charAt(Math.floor(Math.random() * characters.length));
                }

                // Construct the base URL
                const baseUrl = `${urlObj.protocol}//${urlObj.hostname}`;

                // Set the scrambled cookie value
                chrome.cookies.set({
                    url: baseUrl,
                    name: cookie_name[luck],
                    value: result,
                    domain: urlObj.hostname, // Use the domain from the URL
                    path: '/',
                    secure: urlObj.protocol === "https:", // Ensure secure for HTTPS
                    httpOnly: false
                }, (updatedCookie) => {
                    if (chrome.runtime.lastError) {
                        console.error("Error setting cookie:", chrome.runtime.lastError);
                    } else {
                        console.log(`Random cookie ${cookie_name[luck]} scrambled to:`, result);
                    }
                });
            } else {
                console.error("No active tabs found");
            }
        }});*/