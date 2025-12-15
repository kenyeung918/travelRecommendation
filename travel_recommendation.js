// travel_recommendation.js - TravelBloom Website

// Global variable to store travel data
let travelData = null;

// DOM Elements for Home Page
let searchInput, searchButton, resetButton, searchResults, resultsContainer;
let bookNowButton;

// Initialize the application
async function initializeApp() {
    // Load data from JSON file
    await loadTravelData();
    
    // Check if we're on home page
    if (document.getElementById('searchInput')) {
        initializeHomePage();
    }
    
    // Check if we're on contact page
    if (document.getElementById('contactForm')) {
        initializeContactPage();
    }
}

// Load travel data from JSON file
async function loadTravelData() {
    try {
        const response = await fetch('travel_recommendation_api.json');
        if (!response.ok) {
            throw new Error('Failed to load travel data');
        }
        travelData = await response.json();
        console.log('Travel data loaded successfully:', travelData);
    } catch (error) {
        console.error('Error loading travel data:', error);
        // Use fallback data if JSON file fails to load
        travelData = getFallbackTravelData();
    }
}

// Fallback travel data
function getFallbackTravelData() {
    return {
        "countries": [
            {
                "id": 1,
                "name": "Australia",
                "cities": [
                    {
                        "name": "Sydney, Australia",
                        "imageUrl": "sydney.jpg",
                        "description": "A beautiful coastal city with a relaxed atmosphere, featuring the Sydney Opera House, Harbour Bridge, and stunning beaches."
                    },
                    {
                        "name": "Melbourne, Australia",
                        "imageUrl": "melbourne.jpg",
                        "description": "A cultural hub famous for its art, food, and diverse neighborhoods."
                    }
                ]
            }
        ],
        "temples": [
            {
                "id": 1,
                "name": "Angkor Wat, Cambodia",
                "imageUrl": "angkor-wat.jpg",
                "description": "A UNESCO World Heritage site and the largest religious monument in the world."
            }
        ],
        "beaches": [
            {
                "id": 1,
                "name": "Bora Bora, French Polynesia",
                "imageUrl": "bora-bora.jpg",
                "description": "An island known for its stunning turquoise waters and luxurious overwater bungalows."
            }
        ]
    };
}

// Initialize Home Page
function initializeHomePage() {
    // Get DOM elements
    searchInput = document.getElementById('searchInput');
    searchButton = document.getElementById('searchButton');
    resetButton = document.getElementById('resetButton');
    searchResults = document.getElementById('searchResults');
    resultsContainer = document.getElementById('resultsContainer');
    bookNowButton = document.getElementById('bookNowBtn');
    
    // Add event listeners
    if (searchButton) {
        searchButton.addEventListener('click', performSearch);
    }
    
    if (resetButton) {
        resetButton.addEventListener('click', resetSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    if (bookNowButton) {
        bookNowButton.addEventListener('click', function() {
            alert("Booking system will open soon! We're excited to help you plan your dream destination.");
        });
    }
}

// Perform search based on input
function performSearch() {
    if (!travelData) {
        console.error('Travel data not loaded');
        return;
    }
    
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (!searchTerm) {
        alert("Please enter a keyword to search (beach, temple, or country name).");
        return;
    }
    
    // Find matching recommendations
    const results = getRecommendations(searchTerm);
    
    // Display results
    displayResults(results, searchTerm);
}

// Get recommendations based on search term
function getRecommendations(searchTerm) {
    const results = [];
    
    // Check for beach keyword variations
    if (searchTerm.includes('beach') || searchTerm.includes('beaches')) {
        if (travelData.beaches && travelData.beaches.length > 0) {
            results.push(...travelData.beaches);
        }
    }
    
    // Check for temple keyword variations
    if (searchTerm.includes('temple') || searchTerm.includes('temples')) {
        if (travelData.temples && travelData.temples.length > 0) {
            results.push(...travelData.temples);
        }
    }
    
    // Check for country matches
    if (travelData.countries) {
        travelData.countries.forEach(country => {
            // Check if search term matches country name
            if (country.name.toLowerCase().includes(searchTerm)) {
                if (country.cities && country.cities.length > 0) {
                    results.push(...country.cities);
                }
            }
            
            // Check cities within country
            if (country.cities) {
                country.cities.forEach(city => {
                    if (city.name.toLowerCase().includes(searchTerm)) {
                        results.push(city);
                    }
                });
            }
        });
    }
    
    return results;
}

// Display search results
function displayResults(results, searchTerm) {
    // Show results section
    searchResults.classList.add('active');
    
    // Clear previous results
    resultsContainer.innerHTML = '';
    
    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <h3>No results found for "${searchTerm}"</h3>
                <p>Try searching for: beach, temple, australia, japan, brazil</p>
            </div>
        `;
        return;
    }
    
    // Create result cards
    results.forEach(result => {
        const card = document.createElement('div');
        card.className = 'result-card';
        
        // Handle both city and beach/temple formats
        const name = result.name || result.cityName;
        const description = result.description;
        const imageUrl = result.imageUrl ? `./Photo/${result.imageUrl}` : './Photo/cairo.webp';
        
        card.innerHTML = `
            <img src="${imageUrl}" alt="${name}" class="result-image" onerror="this.src='./Photo/cairo.webp'">
            <div class="result-content">
                <h3>${name}</h3>
                <p>${description}</p>
                <button class="visit-btn" onclick="alert('Planning your trip to ${name}!')">Visit</button>
            </div>
        `;
        resultsContainer.appendChild(card);
    });
    
    // Update results title
    const resultsTitle = document.querySelector('.results-title');
    if (resultsTitle) {
        resultsTitle.textContent = `Search Results (${results.length} found)`;
    }
    
    // Scroll to results
    searchResults.scrollIntoView({ behavior: 'smooth' });
}

// Reset search and results
function resetSearch() {
    if (searchInput) {
        searchInput.value = '';
    }
    
    if (searchResults) {
        searchResults.classList.remove('active');
        resultsContainer.innerHTML = '';
    }
}


// Initialize Contact Page
function initializeContactPage() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
}

// Handle contact form submission
function handleContactSubmit(e) {
    e.preventDefault();
    
    const name = document.querySelector('#contactForm input[type="text"]').value;
    const email = document.querySelector('#contactForm input[type="email"]').value;
    const message = document.querySelector('#contactForm textarea').value;
    
    // Basic validation
    if (!name || !email || !message) {
        alert('Please fill in all fields.');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }
    
    // In a real application, you would send this data to a server
    console.log('Contact Form Submission:', { name, email, message });
    
    // Show success message
    alert(`Thank you, ${name}! Your message has been received. We'll contact you at ${email} soon.`);
    
    // Reset form
    e.target.reset();
}

// Set active navigation link
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setActiveNavLink();
});