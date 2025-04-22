document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const messageContainer = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-btn');
    const featureItems = document.querySelectorAll('.feature-menu li');
    const currentFeatureTitle = document.getElementById('current-feature');
    
    // Current selected feature
    let currentFeature = 'chat';
    
    // Handle feature selection
    featureItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            featureItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Update current feature
            currentFeature = this.getAttribute('data-feature');
            currentFeatureTitle.textContent = this.textContent.trim();
            
            // Clear chat and add welcome message
            clearChat();
            const welcomeMessage = getWelcomeMessage(currentFeature);
            addBotMessage(welcomeMessage);
        });
    });
    
    // Function to get welcome message based on feature
    function getWelcomeMessage(feature) {
        switch(feature) {
            case 'chat':
                return "Welcome to the general chat! How can I help you today?";
            case 'career':
                return "I'm your career advisor. I can help with job searches, interview prep, career planning, and more. What would you like assistance with?";
            case 'resume':
                return "I'll help you build a professional resume. I can provide templates, review content, and offer customization tips. How would you like to start?";
            case 'story':
                return "I'm ready to tell you an engaging story! Give me a prompt or topic to get started.";
            case 'health':
                return "I'm your health assistant. I can provide general wellness advice and healthy lifestyle tips. What would you like to know? (Remember to consult healthcare professionals for medical concerns)";
            case 'startup':
                return "I'm your startup consultant. I can help with business models, market research, funding strategies, and more. What aspect of your startup are you working on?";
            case 'books':
                return "Looking for a book summary? Just tell me which book you're interested in, and I'll provide the key insights and takeaways.";
            default:
                return "Welcome! How can I assist you today?";
        }
    }
    
    // Send message when send button is clicked
    sendButton.addEventListener('click', sendMessage);
    
    // Send message when Enter key is pressed (Shift+Enter for new line)
    userInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Function to send message
    function sendMessage() {
        const message = userInput.value.trim();
        
        if (message) {
            // Add user message to chat
            addUserMessage(message);
            
            // Clear input
            userInput.value = '';
            
            // Show loading animation
            showLoading();
            
            // Send to API
            fetchBotResponse(message);
        }
    }
    
    // Function to add user message to chat
    function addUserMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user';
        messageDiv.innerHTML = `<div class="message-content">${message}</div>`;
        messageContainer.appendChild(messageDiv);
        scrollToBottom();
    }
    
    // Function to add bot message to chat
    function addBotMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot';
        messageDiv.innerHTML = `<div class="message-content">${message}</div>`;
        messageContainer.appendChild(messageDiv);
        scrollToBottom();
    }
    
    // Function to show loading animation
    function showLoading() {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message bot loading';
        loadingDiv.innerHTML = `
            <div class="message-content">
                <div class="loading-dots">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        `;
        loadingDiv.id = 'loading-indicator';
        messageContainer.appendChild(loadingDiv);
        scrollToBottom();
    }
    
    // Function to remove loading animation
    function removeLoading() {
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.remove();
        }
    }
    
    // Function to send message to API and get response
    async function fetchBotResponse(message) {
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message, feature: currentFeature })
            });
            
            const data = await response.json();
            
            // Remove loading animation
            removeLoading();
            
            if (data.error) {
                addBotMessage(`Sorry, an error occurred: ${data.error}`);
            } else {
                // Add bot response to chat
                addBotMessage(data.reply);
            }
        } catch (error) {
            // Remove loading animation
            removeLoading();
            
            // Show error message
            addBotMessage("Sorry, I couldn't connect to the server. Please try again later.");
            console.error('Error:', error);
        }
    }
    
    // Function to scroll chat to bottom
    function scrollToBottom() {
        messageContainer.scrollTop = messageContainer.scrollHeight;
    }
    
    // Function to clear chat
    function clearChat() {
        messageContainer.innerHTML = '';
    }
});