// Arrays for days of the week and month names
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// Input
var search = document.getElementById("search");

// Function to fetch weather data according to city for 3 days
async function fetchWeatherByCity(city) {
    const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=8cab3fcb3e06427c80b221342242006&q=${city}&days=3`);
    if (response.ok && response.status !== 400) {
        const data = await response.json();
        // Display today's weather and location
        displayCurrent(data.location, data.current);
        // Display forecast for the next days
        displayNext(data.forecast.forecastday);
    }
}

// Function to fetch weather data according to geographical coordinates (lat, lon) for 3 days
async function fetchWeatherByCoords(lat, lon) {
    const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=8cab3fcb3e06427c80b221342242006&q=${lat},${lon}&days=3`);
    if (response.ok && response.status !== 400) {
        const data = await response.json();
        console.log(data);
        // Display today's weather and location
        displayCurrent(data.location, data.current);
        // Display forecast for the next days
        displayNext(data.forecast.forecastday);
    }
}

// Function to determine location and fetch weather according to geographical coord if exist if not set deafult as cairo 
function getLocationAndFetchWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            // Success callback
            function(position) {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                fetchWeatherByCoords(lat, lon);
            },
            // Error callback
            function(error) {
                console.error('Error getting location:', error);
                fetchWeatherByCity('Cairo'); // Default to Cairo if geolocation fails
            }
        );
    } else {
        console.error('Geolocation is not supported by this browser.');
        fetchWeatherByCity('Cairo'); // Default to Cairo if geolocation is not supported
    }
}

// Add event listener to the search bar
search.addEventListener("keyup", function(event) {
    fetchWeatherByCity(event.target.value);
});

// Initial call to get location and fetch weather
getLocationAndFetchWeather();

// Function to display today's weather
function displayCurrent(location, current) {
    if (current != null) {
        // Format date from API data
        const lastUpdated = new Date(current.last_updated.replace(" ", "T"));

        const todayForecast = `
            <div class="today-weather forecast">
                <div class="forecast-header" id="today">
                    <div class="day">${days[lastUpdated.getDay()]}</div>
                    <div class="date">${lastUpdated.getDate()} ${monthNames[lastUpdated.getMonth()]}</div>
                </div>
                <div class="today-content forecast-content">
                    <div class="location">${location.name}</div>
                    <div class="degree"><div class="num">${current.temp_c}<sup>o</sup>C</div></div>
                    <div class="forecast-icon">
                        <img src="https:${current.condition.icon}" alt="" width="90">
                    </div>
                    <div class="custom">${current.condition.text}</div>
                    <span class="me-4"><img src="imgs/icon-umberella.png" alt="" class="me-1 "> 20%</span>
                    <span class="me-4"><img src="imgs/icon-wind.png" alt="" class="me-1">18km/h</span>
                    <span class="me-4"><img src="imgs/icon-compass.png" alt="" class="me-1">East</span>
                </div>
            </div>`;
        document.getElementById("forecast").innerHTML = todayForecast;
    }
}

// Function to display forecast for the next days
function displayNext(forecastDays) {
    let otherForecasts = "";
    for (let i = 1; i < forecastDays.length; i++) {
        const forecastDate = new Date(forecastDays[i].date.replace(" ", "T"));
        otherForecasts += `
            <div class="forecast" id="">
                <div class="forecast-header" id="">
                    <div class="day">${days[forecastDate.getDay()]}</div>
                </div>
                <div class="forecast-content">
                    <div class="forecast-icon mb-4">
                        <img src="https:${forecastDays[i].day.condition.icon}" alt="" width="48">
                    </div>
                    <div class="degree fs-4 me-0"><div class="num">${forecastDays[i].day.maxtemp_c}<sup>o</sup>C</div></div>
                    <small class="fs-6">${forecastDays[i].day.mintemp_c}<sup>o</sup></small>
                    <div class="custom">${forecastDays[i].day.condition.text}</div>
                </div>
            </div>`;
    }
    document.getElementById("forecast").innerHTML += otherForecasts;
}
