const quotesDatabase = {
    motivation: [
        {
            text: "The only way to do great work is to love what you do.",
            author: "Steve Jobs"
        },
        {
            text: "Everything you've ever wanted is sitting on the other side of fear.",
            author: "George Addair"
        },
        {
            text: "The future belongs to those who believe in the beauty of their dreams.",
            author: "Eleanor Roosevelt"
        }
    ],
    love: [
        {
            text: "Love is not about how many days, months, or years you have been together. Love is about how much you love each other every single day.",
            author: "Anonymous"
        },
        {
            text: "The best thing to hold onto in life is each other.",
            author: "Audrey Hepburn"
        },
        {
            text: "Love is composed of a single soul inhabiting two bodies.",
            author: "Aristotle"
        }
    ],
    mindfulness: [
        {
            text: "The present moment is filled with joy and happiness. If you are attentive, you will see it.",
            author: "Thich Nhat Hanh"
        },
        {
            text: "Life is available only in the present moment.",
            author: "Thich Nhat Hanh"
        },
        {
            text: "Mindfulness isn't difficult, we just need to remember to do it.",
            author: "Sharon Salzberg"
        }
    ],
    wisdom: [
        {
            text: "The only true wisdom is in knowing you know nothing.",
            author: "Socrates"
        },
        {
            text: "The journey of a thousand miles begins with one step.",
            author: "Lao Tzu"
        },
        {
            text: "What you are is what you have been. What you'll be is what you do now.",
            author: "Buddha"
        }
    ]
};

// Local storage key for user-submitted quotes
const USER_QUOTES_KEY = 'userSubmittedQuotes';

// Load user-submitted quotes from local storage
function loadUserQuotes() {
    const savedQuotes = localStorage.getItem(USER_QUOTES_KEY);
    if (savedQuotes) {
        const userQuotes = JSON.parse(savedQuotes);
        Object.keys(userQuotes).forEach(category => {
            if (!quotesDatabase[category]) {
                quotesDatabase[category] = [];
            }
            quotesDatabase[category] = [...quotesDatabase[category], ...userQuotes[category]];
        });
    }
}

// Save a new quote to local storage
function saveUserQuote(quote, author, category) {
    const savedQuotes = localStorage.getItem(USER_QUOTES_KEY) || '{}';
    const userQuotes = JSON.parse(savedQuotes);
    
    if (!userQuotes[category]) {
        userQuotes[category] = [];
    }
    
    userQuotes[category].push({ text: quote, author: author });
    localStorage.setItem(USER_QUOTES_KEY, JSON.stringify(userQuotes));
    
    // Add to current session
    if (!quotesDatabase[category]) {
        quotesDatabase[category] = [];
    }
    quotesDatabase[category].push({ text: quote, author: author });
}

// Initialize by loading user quotes
loadUserQuotes();
