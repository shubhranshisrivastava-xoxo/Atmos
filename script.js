const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const weatherIcon = document.getElementById("weatherIcon");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const cityName = document.getElementById("cityName");
const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const visibility = document.getElementById("visibility");
const pressure = document.getElementById("pressure");
const errorCard = document.getElementById("errorCard");
const recentSection = document.getElementById("recentSection");
const recentCities = document.getElementById("recentCities");
const API_KEY = "51db450272f796dd25f8803d35c85ecb";
const loadingCard =document.getElementById("loadingCard");
const weatherCard =document.querySelector(".weather-card");
let recentSearches =
JSON.parse(localStorage.getItem("recentSearches")) || [];
searchBtn.addEventListener("click", () => {
    getWeather(cityInput.value.trim());
});
locationBtn.addEventListener("click", getCurrentLocation);
cityInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        getWeather(cityInput.value.trim());
    }
});
async function getWeather(city) {
    if (city === "") {
        showError("Please enter a city.");
        return;
    }
    try {
        weatherCard.classList.add("fade");
        loadingCard.classList.remove("hidden");
        errorCard.classList.add("hidden");
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
        );
        const data = await response.json();
        if (data.cod != 200) {
            showError("City not found.");
            return;
        }
        hideError();
        loadingCard.classList.add("hidden");
        updateUI(data);
        saveRecentSearch(data.name);
    }
    catch (error) {
        loadingCard.classList.add("hidden");
        errorCard.classList.remove("hidden");
    }
}
const countryNames = {
    IN: "India",
    US: "United States",
    GB: "United Kingdom",
    AU: "Australia",
    CA: "Canada",
    JP: "Japan",
    CN: "China",
    FR: "France",
    DE: "Germany",
    IT: "Italy",
    ES: "Spain",
    BR: "Brazil",
    RU: "Russia",
    KR: "South Korea",
    PK: "Pakistan",
    NP: "Nepal",
    BD: "Bangladesh",
    LK: "Sri Lanka"
};
function updateUI(data) {
    const weather = data.weather[0].main.toLowerCase();
    const icon = data.weather[0].icon;
    weatherIcon.src =
        `https://openweathermap.org/img/wn/${icon}@4x.png`;
    temperature.textContent =
        Math.round(data.main.temp) + "°";
    description.textContent =
        data.weather[0].description;
    const country =
    countryNames[data.sys.country] || data.sys.country;
    cityName.textContent =
    "📍 " + data.name + " • " + country;
    feelsLike.textContent =
        "Feels like " +
        Math.round(data.main.feels_like) +
        "°";
    humidity.textContent =
        data.main.humidity + "%";
    wind.textContent =
        data.wind.speed + " km/h";
    visibility.textContent =
        (data.visibility / 1000).toFixed(1) + " km";
    pressure.textContent =
        data.main.pressure + " hPa";
    changeTheme(weather, icon);
    weatherCard.classList.remove("fade");
}
function changeTheme(weather, icon) {
    const isNight = icon.includes("n");
    if (weather === "clear") {
        if (isNight) {
            document.body.style.background =
                "linear-gradient(135deg,#0F172A,#312E81)";
        } else {
            document.body.style.background =
                "linear-gradient(135deg,#FFD369,#FFF8E7)";
        }
    }
    else if (weather === "clouds") {
        if (isNight) {
            document.body.style.background =
                "linear-gradient(135deg,#334155,#64748B)";
        } else {
            document.body.style.background =
                "linear-gradient(135deg,#A7C7E7,#EAF4FF)";
        }
    }
    else if (weather.includes("rain") || weather.includes("drizzle")) {
        if (isNight) {
            document.body.style.background =
                "linear-gradient(135deg,#1E3A5F,#355C7D)";
        } else {
            document.body.style.background =
                "linear-gradient(135deg,#4A6FA5,#A7C7E7)";
        }
    }
    else if (weather.includes("thunderstorm")) {
        document.body.style.background =
            "linear-gradient(135deg,#4B5563,#9CA3AF)";
    }
    else if (weather.includes("snow")) {
        document.body.style.background =
            "linear-gradient(135deg,#DDEAF6,#FFFFFF)";
    }
    else {
        document.body.style.background =
            "linear-gradient(135deg,#B8C0D9,#EEF2F7)";
    }
}
function saveRecentSearch(city) {
    recentSearches = recentSearches.filter(c => c !== city);
    recentSearches.unshift(city);
    if (recentSearches.length > 5) {
        recentSearches.pop();
    }
    localStorage.setItem(
        "recentSearches",
        JSON.stringify(recentSearches)
    );
    displayRecentSearches();
}
function displayRecentSearches() {
    recentCities.innerHTML = "";
    if (recentSearches.length === 0) {
        recentSection.classList.add("hidden");
        return;
    }
    recentSection.classList.remove("hidden");
    recentSearches.forEach(function (city) {
        const chip = document.createElement("div");
        chip.className = "city-chip";
        chip.textContent = "📍 " + city;
        chip.addEventListener("click", function () {
            cityInput.value = city;
            getWeather(city);
        });
        recentCities.appendChild(chip);
    });
}
function showError(message) {
    errorCard.querySelector("p").textContent = message;
    errorCard.classList.remove("hidden");
}
function hideError() {
    errorCard.classList.add("hidden");
}
function getCurrentLocation() {
    if (!navigator.geolocation) {
        return;
    }
    navigator.geolocation.getCurrentPosition(
        async function (position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            try {
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
                );
                const data = await response.json();
                hideError();
                updateUI(data);
                saveRecentSearch(data.name);
            }
            catch (error) {
                console.log(error);
            }
        },
        function () {
            console.log("Location permission denied.");
        }
    );
}
displayRecentSearches();