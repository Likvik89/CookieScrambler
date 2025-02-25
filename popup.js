// Set a character limit for the cookie value
const valueLimit = 50; // You can change this to any value you like

// Function to scramble a string (cookie value)
function scrambleString(str) {
    let arr = str.split('');
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap elements
    }
    return arr.join('');
}

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
            
            // Display the cookie names in the <a> element
            if (cookie_name.length > 0) {
                document.getElementById("cookieDisplay").innerHTML = cookie_name.join(", ");
            } else {
                document.getElementById("cookieDisplay").innerHTML = "No cookies found.";
            }

            // Create and populate the table with cookie details
            const table = document.getElementById("cookieTable");

            // Clear the table before inserting new data
            table.innerHTML = ""; // Remove any previous rows (if any)

            // Create table header
            const headerRow = document.createElement("tr");
            headerRow.innerHTML = `
                <th>Scramble</th>
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
                    <td><button class="scrambleBtn" data-index="${i}">Scramble</button></td>
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
                    const index = event.target.dataset.index;
                    const scrambledValue = scrambleString(cookie_value[index]); // Scramble the cookie value
                    cookie_value[index] = scrambledValue; // Update the value in the array

                    // Update the displayed value in the table
                    const valueCell = event.target.closest("tr").querySelector(".valueText");
                    valueCell.innerHTML = scrambledValue.slice(0, valueLimit) + '...'; // Show the scrambled value truncated
                });
            });
        });
    });
});
