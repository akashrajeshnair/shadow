document.addEventListener("DOMContentLoaded", function () {
    console.log('Terminal.js loaded');
    const inputField = document.getElementById("commandInput");
    const outputDiv = document.getElementById("output");
    
    // Focus input field on page load
    inputField.focus();

    function appendToTerminal(html) {
        const newEntry = document.createElement("div");
        newEntry.innerHTML = html;
        outputDiv.appendChild(newEntry);
        outputDiv.scrollTop = outputDiv.scrollHeight; // Auto-scroll to latest output
    }

    inputField.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent default Enter behavior
            
            const command = inputField.value.trim();
            if (command === "") return; // Ignore empty command
            
            // Append user command to the terminal
            appendToTerminal(`<span class="prompt">root@homeserver:~$</span> ${command}`);
            
            // Clear the input field for next command
            inputField.value = "";

            // Send command to SSH emulator API
            fetch("/ssh/execute", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ command: command })
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    appendToTerminal(`<span style="color: red;">Error: ${data.error}</span>`);
                } else {
                    appendToTerminal(`<pre>${data.response}</pre>`);
                }
            })
            .catch(() => {
                appendToTerminal(`<span style="color: red;">Error: Unable to reach server.</span>`);
            });
        }
    });
});
