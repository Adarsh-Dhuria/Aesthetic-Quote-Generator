// Theme Management
const THEME_KEY = 'theme';
const themeToggleBtn = document.getElementById('themeToggle');
const themeIcon = themeToggleBtn.querySelector('i');

function setTheme(isDark) {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
}

function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
    setTheme(savedTheme === 'dark');
}

themeToggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    setTheme(!isDark);
});

// Initialize theme
initTheme();

// DOM Elements
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const newQuoteBtn = document.getElementById('newQuote');
const copyQuoteBtn = document.getElementById('copyQuote');
const tweetQuoteBtn = document.getElementById('tweetQuote');
const categorySelect = document.getElementById('quoteCategory');
const dailyQuoteToggle = document.getElementById('dailyQuoteToggle');
const submitQuoteModal = document.getElementById('submitQuoteModal');
const showSubmitFormBtn = document.getElementById('showSubmitForm');
const closeModalBtn = document.querySelector('.close');
const quoteSubmissionForm = document.getElementById('quoteSubmissionForm');

// Particle.js Configuration
particlesJS('particles-js', {
    particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: '#ffffff' },
        shape: { type: 'circle' },
        opacity: { value: 0.5, random: false },
        size: { value: 3, random: true },
        line_linked: { enable: true, distance: 150, color: '#ffffff', opacity: 0.4, width: 1 },
        move: { enable: true, speed: 2, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: { enable: true, mode: 'repulse' },
            onclick: { enable: true, mode: 'push' },
            resize: true
        }
    },
    retina_detect: true
});

// Variables
let currentQuote = null;
const DAILY_QUOTE_KEY = 'dailyQuote';
const DAILY_QUOTE_DATE_KEY = 'dailyQuoteDate';

// Functions
function getRandomQuote(category = 'all') {
    let availableQuotes = [];
    
    if (category === 'all') {
        Object.values(quotesDatabase).forEach(categoryQuotes => {
            availableQuotes = [...availableQuotes, ...categoryQuotes];
        });
    } else {
        availableQuotes = quotesDatabase[category] || [];
    }
    
    if (availableQuotes.length === 0) {
        return {
            text: "No quotes available in this category.",
            author: "System"
        };
    }
    
    return availableQuotes[Math.floor(Math.random() * availableQuotes.length)];
}

function displayQuote(quote) {
    quoteText.style.opacity = 0;
    authorText.style.opacity = 0;
    
    setTimeout(() => {
        quoteText.textContent = quote.text;
        authorText.textContent = `― ${quote.author}`;
        
        quoteText.style.opacity = 1;
        authorText.style.opacity = 1;
    }, 500);
    
    currentQuote = quote;
}

function generateNewQuote() {
    const selectedCategory = categorySelect.value;
    const quote = getRandomQuote(selectedCategory);
    displayQuote(quote);
}

function copyQuote() {
    if (!currentQuote) return;
    
    const textToCopy = `"${currentQuote.text}" ― ${currentQuote.author}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = copyQuoteBtn.innerHTML;
        copyQuoteBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
            copyQuoteBtn.innerHTML = originalText;
        }, 2000);
    });
}

function tweetQuote() {
    if (!currentQuote) return;
    
    const tweetText = encodeURIComponent(`"${currentQuote.text}" ― ${currentQuote.author}`);
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank');
}

function checkDailyQuote() {
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem(DAILY_QUOTE_DATE_KEY);
    
    if (dailyQuoteToggle.checked) {
        if (today !== savedDate) {
            const newQuote = getRandomQuote('all');
            localStorage.setItem(DAILY_QUOTE_KEY, JSON.stringify(newQuote));
            localStorage.setItem(DAILY_QUOTE_DATE_KEY, today);
            displayQuote(newQuote);
        } else {
            const savedQuote = JSON.parse(localStorage.getItem(DAILY_QUOTE_KEY));
            if (savedQuote) {
                displayQuote(savedQuote);
            }
        }
        newQuoteBtn.disabled = true;
        categorySelect.disabled = true;
    } else {
        newQuoteBtn.disabled = false;
        categorySelect.disabled = false;
        generateNewQuote();
    }
}

// Event Listeners
newQuoteBtn.addEventListener('click', generateNewQuote);
copyQuoteBtn.addEventListener('click', copyQuote);
tweetQuoteBtn.addEventListener('click', tweetQuote);
categorySelect.addEventListener('change', generateNewQuote);
dailyQuoteToggle.addEventListener('change', checkDailyQuote);

showSubmitFormBtn.addEventListener('click', () => {
    submitQuoteModal.style.display = 'block';
});

closeModalBtn.addEventListener('click', () => {
    submitQuoteModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === submitQuoteModal) {
        submitQuoteModal.style.display = 'none';
    }
});

quoteSubmissionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteAuthor = document.getElementById('newQuoteAuthor').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;
    
    saveUserQuote(newQuoteText, newQuoteAuthor, newQuoteCategory);
    
    quoteSubmissionForm.reset();
    submitQuoteModal.style.display = 'none';
    
    // Show the newly added quote
    categorySelect.value = newQuoteCategory;
    generateNewQuote();
});

// Initialize
generateNewQuote();

// Check if daily quote mode was previously enabled
const dailyQuoteEnabled = localStorage.getItem('dailyQuoteEnabled') === 'true';
dailyQuoteToggle.checked = dailyQuoteEnabled;
if (dailyQuoteEnabled) {
    checkDailyQuote();
}

// Save daily quote mode preference
dailyQuoteToggle.addEventListener('change', () => {
    localStorage.setItem('dailyQuoteEnabled', dailyQuoteToggle.checked);
});
