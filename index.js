// DOM elements
let searchInput = document.querySelector('#searchInput');
let city = document.querySelector('#city');
let weather = document.querySelector('#weather');
let icon = document.querySelector('#icon');
let condition = document.querySelector('#condition');
let humidity = document.querySelector('#humidity');
let wind_speed = document.querySelector('#wind-speed');
let direction = document.querySelector('#direction');
let sec_day_icon = document.querySelector('#sec-day-icon');
let sec_day_weather = document.querySelector('#sec-day-weather');
let sec_day_note = document.querySelector('#sec-day-note');
let sec_day_condition = document.querySelector('#sec-day-condition');
let third_day_icon = document.querySelector('#third-day-icon');
let third_day_weather = document.querySelector('#third-day-weather');
let third_day_note = document.querySelector('#third-day-note');
let third_day_condition = document.querySelector('#third-day-condition');

// Date handling
let today = new Date();

let monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
let dayNames = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];

let dayIndex = today.getDay();
let dayName = dayNames[dayIndex];
let monthName = monthNames[today.getMonth()];
let dayOfMonth = today.getDate();

// Update date displays
document.getElementById('dayName').innerHTML = `${dayName}`;
document.getElementById('date').innerHTML = `${dayOfMonth} ${monthName}`;
document.getElementById('sec-day').innerHTML = dayNames[(dayIndex + 1) % 7];
document.getElementById('third-day').innerHTML = dayNames[(dayIndex + 2) % 7];

// Loading state management
function setLoadingState(isLoading) {
    const cards = document.querySelectorAll('.card');
    const searchBtn = document.querySelector('.search-btn');
    
    if (isLoading) {
        cards.forEach(card => card.classList.add('loading'));
        if (searchBtn) searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    } else {
        cards.forEach(card => card.classList.remove('loading'));
        if (searchBtn) searchBtn.innerHTML = 'Search';
    }
}

// Error handling
function showError(message) {
    // Create error notification
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger position-fixed';
    errorDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; max-width: 300px;';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-triangle me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(errorDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

// Weather API function
async function getAllWeather(location) {
    try {
        setLoadingState(true);
        let response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=ee89923a6cf34770ac2212619242506&q=${location}&days=3`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        let data = await response.json();
        
        if (data.error) {
            throw new Error(data.error.message || 'Location not found');
        }
        
        return data;
    } catch (error) {
        console.error('Weather API error:', error);
        showError(error.message);
        return null;
    } finally {
        setLoadingState(false);
    }
}

// Display today's weather
async function displayToday(data) {
    try {
        city.innerHTML = data.location.name;
        weather.innerHTML = `${data.current.temp_c}°C`;
        condition.innerHTML = data.current.condition.text;
        humidity.innerHTML = data.current.humidity + '%';
        wind_speed.innerHTML = data.current.wind_kph + ' km/h';
        direction.innerHTML = data.current.wind_dir;
        
        // Update weather icon if available
        if (data.current.condition.icon) {
            icon.setAttribute("src", data.current.condition.icon);
        }
    } catch (error) {
        console.error('Error displaying today\'s weather:', error);
    }
}

// Display next days weather
async function displayNextDay(data) {
    try {
        sec_day_weather.innerHTML = data.forecast.forecastday[1].day.maxtemp_c + '°C';
        sec_day_condition.innerHTML = data.forecast.forecastday[1].day.condition.text;
        sec_day_note.innerHTML = data.forecast.forecastday[1].day.avgtemp_c + '°C';
        
        third_day_weather.innerHTML = data.forecast.forecastday[2].day.maxtemp_c + '°C';
        third_day_condition.innerHTML = data.forecast.forecastday[2].day.condition.text;
        third_day_note.innerHTML = data.forecast.forecastday[2].day.avgtemp_c + '°C';
        
        // Update weather icons if available
        if (data.forecast.forecastday[1].day.condition.icon) {
            sec_day_icon.setAttribute("src", data.forecast.forecastday[1].day.condition.icon);
        }
        if (data.forecast.forecastday[2].day.condition.icon) {
            third_day_icon.setAttribute("src", data.forecast.forecastday[2].day.condition.icon);
        }
    } catch (error) {
        console.error('Error displaying next days weather:', error);
    }
}

// Main display function
async function allDisplays(city = 'cairo') {
    let weatherdata = await getAllWeather(city);
    if (weatherdata) {
        await displayToday(weatherdata);
        await displayNextDay(weatherdata);
    }
}

// Initialize weather display
allDisplays();

// Search functionality with debouncing
let searchTimeout;
searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        if (e.target.value.trim()) {
            allDisplays(e.target.value.trim());
        }
    }, 500); // Wait 500ms after user stops typing
});

// Search button click handler
document.querySelector('.search-btn').addEventListener('click', () => {
    if (searchInput.value.trim()) {
        allDisplays(searchInput.value.trim());
    }
});

// Enter key handler for search
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && searchInput.value.trim()) {
        allDisplays(searchInput.value.trim());
    }
});

// Responsive navbar functionality
document.addEventListener('DOMContentLoaded', function() {
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const bsCollapse = new bootstrap.Collapse(navbarCollapse, {toggle: false});
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 992) {
                bsCollapse.hide();
            }
        });
    });
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Add responsive image loading
window.addEventListener('load', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });
});

// Add touch support for mobile devices
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
}

// Performance optimization: Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe cards for animation
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});
