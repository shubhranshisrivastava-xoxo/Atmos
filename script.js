const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherIcon = document.getElementById("weatherIcon");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const cityName = document.getElementById("cityName");
const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const visibility = document.getElementById("visibility");
const pressure = document.getElementById("pressure");
const API_KEY = "51db450272f796dd25f8803d35c85ecb";
searchBtn.addEventListener("click", getWeather);
cityInput.addEventListener("keypress", function(event){
    if(event.key==="Enter"){
        getWeather();
    }
});
async function getWeather(){
    const city = cityInput.value.trim();
    if(city===""){
        alert("Please enter a city.");
        return;
    }
    const url =
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
    try{
        const response = await fetch(url);
        const data = await response.json();
        if(data.cod!="200"){
            alert("City not found!");
            return;
        }
        updateUI(data);
    }
    catch(error){
        alert("Something went wrong.");
    }
}
function updateUI(data){
    const condition = data.weather[0].main;
    const icon = data.weather[0].icon;
    if (icon.includes("n")) {
    weatherIcon.textContent = "🌙";
    }
    else if (condition === "Clear") {
    weatherIcon.textContent = "☀️";
    }
    else if (condition === "Clouds") {
    weatherIcon.textContent = "☁️";
    }
    else if (condition === "Rain" || condition === "Drizzle") {
    weatherIcon.textContent = "🌧️";
    }
    else if (condition === "Thunderstorm") {
    weatherIcon.textContent = "⛈️";
    }
    else if (condition === "Snow") {
    weatherIcon.textContent = "❄️";
    }
    else {
    weatherIcon.textContent = "🌫️";
   }
    cityName.textContent = "📍 " + data.name;
    temperature.textContent =
    Math.round(data.main.temp) + "°";
    description.textContent =
    data.weather[0].description;
    feelsLike.textContent =
    "Feels like " + Math.round(data.main.feels_like) + "°";
    humidity.textContent =
    data.main.humidity + "%";
    wind.textContent =
    data.wind.speed + " km/h";
    visibility.textContent =
    (data.visibility/1000).toFixed(1) + " km";
    pressure.textContent =
    data.main.pressure + " hPa";
    changeTheme(condition, icon);
}
function changeTheme(weather, icon){
    const isNight = icon.includes("n");
    weather = weather.toLowerCase();
    if(weather==="clear"){
        if(isNight){
        document.body.style.background =
        "linear-gradient(135deg,#0F172A,#312E81)";
    }
    else{
        document.body.style.background =
        "linear-gradient(135deg,#FFD369,#FFF8E7)";
      }
    }
    else if(weather==="clouds"){
       if(isNight){
        document.body.style.background =
        "linear-gradient(135deg,#334155,#64748B)";
    }
    else{
        document.body.style.background =
        "linear-gradient(135deg,#A7C7E7,#EAF4FF)";
      }
    }
    else if(weather.includes("rain") || weather.includes("drizzle")){
        if(isNight){
        document.body.style.background =
        "linear-gradient(135deg,#1E3A5F,#355C7D)";
    }
    else{
        document.body.style.background =
        "linear-gradient(135deg,#4A6FA5,#A7C7E7)";
        }
    }
    else if(weather.includes("thunderstorm")){
         if(isNight){
        document.body.style.background =
        "linear-gradient(135deg,#1F2937,#374151)";
    }
    else{
        document.body.style.background =
        "linear-gradient(135deg,#4B5563,#9CA3AF)";
        }
    }
    else if(weather.includes("snow")){  
    if(isNight){
        document.body.style.background =
        "linear-gradient(135deg,#6B7A8F,#CBD5E1)";
    }
    else{
        document.body.style.background =
        "linear-gradient(135deg,#DDEAF6,#FFFFFF)";
        }
    }
    else if(weather.includes("mist") ||
            weather.includes("fog") ||
            weather.includes("haze")){
        document.body.style.background =
        "linear-gradient(135deg,#B8C0D9,#EEF2F7)";
    }
    else{
        document.body.style.background =
        "linear-gradient(135deg,#FFD369,#FFF8E7)";
    }
}