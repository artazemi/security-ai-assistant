const WORKER_URL = "https://security-analyst-proxy.art-azemi.workers.dev";
const chatWrapper = document.getElementById('chat-wrapper');
const userInput = document.getElementById('user-input');

// --- NEW: CLOCK LOGIC ---
function updateClock() {
    const timeElement = document.getElementById('time');
    if (timeElement) {
        const now = new Date();
        timeElement.textContent = now.toTimeString().split(' ')[0];
    }
}
setInterval(updateClock, 1000);
updateClock();

// --- NEW: CURSOR GLOW TRACKING ---
const glow = document.getElementById('cursor-glow');
document.addEventListener('mousemove', (e) => {
    if (glow) {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    }
});

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    // Display user input
    chatWrapper.innerHTML += `<div class="user-msg">art@analyst:~$ ${text}</div>`;
    userInput.value = "";
    
    // Placeholder for bot
    const botId = "bot-" + Date.now();
    chatWrapper.innerHTML += `<div class="bot-msg" id="${botId}">[ANALYZING]...</div>`;
    chatWrapper.scrollTop = chatWrapper.scrollHeight;

    try {
        const response = await fetch(WORKER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: text }) 
        });

        const data = await response.json();
        
        // Simple extraction of response based on your Worker structure
        if (data.choices && data.choices[0].message) {
            const botResponse = data.choices[0].message.content;
            document.getElementById(botId).innerHTML = `[RESPONSE] ${botResponse}`;
        } else {
            throw new Error("Invalid format");
        }
        
    } catch (error) {
        document.getElementById(botId).innerHTML = `<span style="color: #ff5f56;">[ERROR] System Offline.</span>`;
    }
    chatWrapper.scrollTop = chatWrapper.scrollHeight;
}

// Simple event listener for Enter key
userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
    }
});