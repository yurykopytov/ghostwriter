// Ghostwriter Web Application - Main JavaScript

// Application State (stored in memory only)
const state = {
    apiKey: '',
    articleIdea: '',
    generatedArticle: '',
    isGenerating: false
};

// DOM Elements
const elements = {
    header: document.getElementById('header'),
    apiKeyInput: document.getElementById('apiKey'),
    apiKeyStatus: document.getElementById('apiKeyStatus'),
    articleIdeaInput: document.getElementById('articleIdea'),
    wordCountSpan: document.getElementById('wordCount'),
    charCountSpan: document.getElementById('charCount'),
    createButton: document.getElementById('createButton'),
    loadingAnimation: document.getElementById('loadingAnimation'),
    generatedSection: document.getElementById('generatedSection'),
    articleContent: document.getElementById('articleContent'),
    articleWordCount: document.getElementById('articleWordCount'),
    copyButton: document.getElementById('copyButton'),
    downloadButton: document.getElementById('downloadButton'),
    toastContainer: document.getElementById('toastContainer')
};

// Initialize Application
function init() {
    // Event Listeners
    elements.header.addEventListener('click', resetApplication);
    elements.apiKeyInput.addEventListener('input', handleApiKeyInput);
    elements.articleIdeaInput.addEventListener('input', handleArticleIdeaInput);
    elements.createButton.addEventListener('click', generateArticle);
    elements.copyButton.addEventListener('click', copyToClipboard);
    elements.downloadButton.addEventListener('click', downloadArticle);
}

// Reset Application to Initial State
function resetApplication() {
    state.apiKey = '';
    state.articleIdea = '';
    state.generatedArticle = '';
    state.isGenerating = false;

    elements.apiKeyInput.value = '';
    elements.articleIdeaInput.value = '';
    elements.createButton.style.display = 'none';
    elements.generatedSection.style.display = 'none';
    elements.loadingAnimation.style.display = 'none';

    // Set status to neutral (no warning color)
    elements.apiKeyStatus.className = 'status-indicator';
    const statusIcon = elements.apiKeyStatus.querySelector('.status-icon');
    const statusText = elements.apiKeyStatus.querySelector('.status-text');
    statusIcon.innerHTML = `
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
    `;
    statusText.textContent = 'Solution is safe and works completely locally';

    updateCounters(0, 0);
}

// Handle API Key Input
function handleApiKeyInput(event) {
    state.apiKey = event.target.value.trim();
    updateApiKeyStatus();
}

// Update API Key Status Indicator
function updateApiKeyStatus() {
    const statusIcon = elements.apiKeyStatus.querySelector('.status-icon');
    const statusText = elements.apiKeyStatus.querySelector('.status-text');

    if (!state.apiKey) {
        elements.apiKeyStatus.className = 'status-indicator invalid';
        statusIcon.innerHTML = `
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
        `;
        statusText.textContent = 'Solution is safe and works completely locally';
    } else {
        elements.apiKeyStatus.className = 'status-indicator valid';
        statusIcon.innerHTML = `
            <polyline points="20 6 9 17 4 12"></polyline>
        `;
        statusText.textContent = 'Key provided';
    }
}

// Handle Article Idea Input
function handleArticleIdeaInput(event) {
    const text = event.target.value;
    state.articleIdea = text;

    const charCount = text.length;
    const wordCount = countWords(text);

    updateCounters(wordCount, charCount);
    updateCreateButtonVisibility(wordCount);
}

// Count Words in Text
function countWords(text) {
    if (!text.trim()) return 0;
    return text.trim().split(/\s+/).length;
}

// Update Word and Character Counters
function updateCounters(wordCount, charCount) {
    elements.wordCountSpan.textContent = wordCount;
    elements.charCountSpan.textContent = charCount;
}

// Update Create Button Visibility
function updateCreateButtonVisibility(wordCount) {
    if (wordCount >= CONFIG.MIN_WORDS) {
        elements.createButton.style.display = 'block';
    } else {
        elements.createButton.style.display = 'none';
    }
}

// Generate Article
async function generateArticle() {
    // Validate API Key Format
    if (!state.apiKey.startsWith('sk-')) {
        showToast('Invalid API key format. Key must start with "sk-"', 'error');
        return;
    }

    // Validate Word Count
    const wordCount = countWords(state.articleIdea);
    if (wordCount < CONFIG.MIN_WORDS) {
        showToast(`Article idea must be at least ${CONFIG.MIN_WORDS} words`, 'error');
        return;
    }

    // Set Loading State
    state.isGenerating = true;
    elements.createButton.style.display = 'none';
    elements.loadingAnimation.style.display = 'flex';
    elements.createButton.disabled = true;

    try {
        // Prepare API Request
        const messages = [
            {
                role: 'system',
                content: CONFIG.SYSTEM_PROMPT
            },
            {
                role: 'user',
                content: CONFIG.getUserPrompt(state.articleIdea)
            }
        ];

        // Call OpenAI API
        const response = await fetch(CONFIG.OPENAI_API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${state.apiKey}`
            },
            body: JSON.stringify({
                model: CONFIG.MODEL_NAME,
                messages: messages,
                max_completion_tokens: CONFIG.MAX_COMPLETION_TOKENS
            })
        });

        // Handle API Response
        if (!response.ok) {
            await handleApiError(response);
            return;
        }

        const data = await response.json();
        const generatedText = data.choices[0].message.content;

        // Store and Display Article
        state.generatedArticle = generatedText;
        displayGeneratedArticle(generatedText);

        // Show Success Toast
        showToast('Article generated successfully!', 'success');

    } catch (error) {
        console.error('Error generating article:', error);
        showToast('Network error. Please check your connection and try again.', 'error');
    } finally {
        // Reset Loading State
        state.isGenerating = false;
        elements.loadingAnimation.style.display = 'none';
        elements.createButton.style.display = 'block';
        elements.createButton.disabled = false;
    }
}

// Handle API Errors
async function handleApiError(response) {
    state.isGenerating = false;
    elements.loadingAnimation.style.display = 'none';
    elements.createButton.style.display = 'block';
    elements.createButton.disabled = false;

    let errorMessage = 'An error occurred while generating the article.';

    try {
        const errorData = await response.json();
        const errorType = errorData.error?.type || '';
        const errorCode = errorData.error?.code || '';

        if (response.status === 401 || errorType === 'invalid_request_error') {
            errorMessage = 'Authentication failed. Please check your API key.';
        } else if (response.status === 429 || errorCode === 'rate_limit_exceeded') {
            errorMessage = 'Rate limit exceeded. Please try again later.';
        } else if (errorData.error?.message) {
            errorMessage = errorData.error.message;
        }
    } catch (parseError) {
        // Use default error message if parsing fails
        if (response.status === 401) {
            errorMessage = 'Authentication failed. Please check your API key.';
        } else if (response.status === 429) {
            errorMessage = 'Rate limit exceeded. Please try again later.';
        }
    }

    showToast(errorMessage, 'error');
}

// Display Generated Article
function displayGeneratedArticle(text) {
    // Render Markdown
    const htmlContent = marked.parse(text);
    elements.articleContent.innerHTML = htmlContent;

    // Update Word Count
    const wordCount = countWords(text);
    elements.articleWordCount.textContent = `${wordCount} words`;

    // Show Generated Section
    elements.generatedSection.style.display = 'block';

    // Scroll to Generated Article
    elements.generatedSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Copy Article to Clipboard
async function copyToClipboard() {
    try {
        await navigator.clipboard.writeText(state.generatedArticle);
        showToast('Article copied to clipboard', 'success');
    } catch (error) {
        console.error('Error copying to clipboard:', error);
        showToast('Failed to copy to clipboard', 'error');
    }
}

// Download Article as Text File
function downloadArticle() {
    try {
        // Extract title from first line (remove # characters)
        const firstLine = state.generatedArticle.split('\n')[0];
        const title = firstLine.replace(/^#+\s*/, '').trim();
        const filename = title ? `${title.substring(0, 50)}.txt` : 'article.txt';

        // Create Blob and Download
        const blob = new Blob([state.generatedArticle], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showToast(`Article saved as ${filename}`, 'success');
    } catch (error) {
        console.error('Error downloading article:', error);
        showToast('Failed to download article', 'error');
    }
}

// Show Toast Notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    elements.toastContainer.appendChild(toast);

    // Auto-remove after 4 seconds
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => {
            if (toast.parentNode) {
                elements.toastContainer.removeChild(toast);
            }
        }, 300);
    }, 4000);
}

// Initialize Application on DOM Load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
