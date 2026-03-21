// ============ CORE FUNCTIONS ============

async function get() {
    try {
        let city = getCityName();
        if (!city) throw new Error("city name is empty");

        let url = `https://api.weatherapi.com/v1/forecast.json?key=4c705e09f4574f72a84150200261903&q=${city}&days=10`;
        let f_data = await fetch(url);
        let f_dataJ = await f_data.json();
        console.log(f_dataJ);


        if (f_dataJ.error && f_dataJ.error.code === 1006) {
            alert("No Such City");
            return null;
        }
        return f_dataJ;

    } catch (err) {
        console.log('error caught: ' + err.message);
    }
}

function getCityName() {
    return document.querySelector(".search-input").value.trim();
}

// ============ SINGLE ENTRY POINT ============

async function loadWeather() {
    let city = getCityName();
    if (!city) { alert("City name is empty"); return; }

    let object = await get(); // only 1 fetch
    if (!object) return;

    data_input(object);
    hourlyRender(object);
    weeklyRender(object);
}

// ============ RENDER FUNCTIONS ============

function data_input(object) {
    document.querySelector(".temperature").innerHTML = object.current.temp_c + "°C";
    document.querySelector(".city").innerHTML = object.location.name;
    document.querySelector(".country").innerHTML = object.location.country;
    document.querySelector(".condition-weather").innerHTML = object.current.condition.text;
    document.querySelector(".highest-temperature-data").innerHTML = object.forecast.forecastday[0].day.maxtemp_c + "°C";
    document.querySelector(".lowest-temperature-data").innerHTML = object.forecast.forecastday[0].day.mintemp_c + "°C";
    document.querySelector(".wind-speed-data").innerHTML = object.current.wind_kph + " km/h";
    document.querySelector(".humidity-data").innerHTML = object.current.humidity + "%";
    document.querySelector(".current-condition-image").src = "https:" + object.current.condition.icon;
}

function hourlyRender(object) {
    const hours = object.forecast.forecastday[0].hour;
    const container = document.querySelector("#hourly-container");
    container.innerHTML = "";

    for (let i = 0; i < 24; i += 2) {
        const hour = hours[i];
        const time = new Date(hour.time).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
        const date = new Date(hour.time).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
        const icon = "https:" + hour.condition.icon;
        const condition = hour.condition.text;
        const maxTemp = hour.temp_c;
        const minTemp = hour.feelslike_c;
        const chanceOfRain = hour.chance_of_rain;

        container.innerHTML += `
            <div class="hour-card">
                <img class="hour-icon" src="${icon}" alt="${condition}" />
                <p class="hour-time">${date}, ${time}</p>
                <p class="hour-condition">${condition}</p>
                <div class="hour-temps">
                    <span class="temp-high">🌡 ${maxTemp}°</span>
                    <span class="temp-low">🔵 ${minTemp}°</span>
                </div>
                <p class="hour-precip">💧 Precipitation</p>
                <div class="rain-bar-container">
                    <div class="rain-bar">
                        <div class="rain-fill" style="width: ${chanceOfRain}%"></div>
                    </div>
                    <span class="rain-percent">${chanceOfRain}%</span>
                </div>
            </div>`;
    }
}

function weeklyRender(object) {
    const days = object.forecast.forecastday
    const conta = document.querySelector(".weekly-container")
    conta.innerHTML=""

    for (let i = 1; i <= 9; i++) {
        const daya = days[i];

        const dateObj = new Date(daya.date+"T00:00:00");

        const date = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });


        const dayName = dateObj.toLocaleDateString("en-US", { weekday: "long" });
        // e.g. "Thursday"
        const maxTemp = daya.day.maxtemp_c;
        const minTemp = daya.day.mintemp_c
        const SunR = daya.astro.sunrise;
        const sunS = daya.astro.sunset;
        const chance_of_rain = daya.day.daily_chance_of_rain;
        const icon = "https:" + daya.day.condition.icon.replace("64x64", "128x128");
        const condition = daya.day.condition.text;

        conta.innerHTML += `
        <div class="day-card">
                <img class="day-icon" src="${icon}" alt="${condition}" />
                <p class="date-day">${date}, ${dayName}</p>
                <p class="day-condition">${condition}</p>
                <div class="day-temps">
                    <span class="temp-high">🌡 ${maxTemp}°</span>
                    <span class="temp-low">🔵 ${minTemp}°</span>
                </div>
                <div class="sun-clock">
                    <span class="sun-rise">🌅${SunR}</span>
                    <span class="sun-set">🌇${sunS}</span>
                </div>
                <p class="hour-precip">💧 Precipitation</p>
                <div class="rain-bar-container">
                    <div class="rain-bar">
                        <div class="rain-fill" style="width: ${chance_of_rain}%"></div>
                    </div>
                    <span class="rain-percent">${chance_of_rain}%</span>
                </div>
            </div>`;
        


    }

}

// ============ EVENT LISTENERS ============

document.querySelector(".search-icon").addEventListener("click", loadWeather);
document.querySelector(".search-input").addEventListener("keydown", function (event) {
    if (event.key === "Enter") loadWeather();
});


document.querySelector(".today-button").addEventListener("click", function () {
    document.querySelector(".hourly-container").removeAttribute("hidden");
    document.querySelector(".weekly-container").setAttribute("hidden", "");
});

document.querySelector(".week-button").addEventListener("click", function () {
    document.querySelector(".weekly-container").removeAttribute("hidden");
    document.querySelector(".hourly-container").setAttribute("hidden", "");
});
