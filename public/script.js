// ============ CORE FUNCTIONS ============
console.log('heelo');



let currentWeatherData = null;

function startApp() {
    document.getElementById("landing").style.display = "none";
    document.getElementById("app").style.display = "block";
}

async function get() {
    try {
        let city = getCityName();
        if (!city) throw new Error("city name is empty");

        let url = `https://api.weatherapi.com/v1/forecast.json?key=4c705e09f4574f72a84150200261903&q=${city}&days=10&aqi=yes`;
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
    if (!city) {
        alert("City name is empty");
        return;
    }

    const loader = document.getElementById("loading-overlay");

    // 🔹 Show loader
    // loader.removeAttribute("hidden");

    // 🔹 Disable search
    document.querySelector(".search-icon").style.pointerEvents = "none";

    try {
        let object = await get();

        if (!object) return;

        currentWeatherData = object;

        data_input(object);
        hourlyRender(object);
        weeklyRender(object);
        renderAQI(object);

    } catch (err) {
        console.log(err);
    } finally {
        // 🔹 Hide loader ALWAYS
        // loader.setAttribute("hidden", "");

        // 🔹 Enable search
        document.querySelector(".search-icon").style.pointerEvents = "auto";
    }
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
    const days = object.forecast.forecastday;
    const dateObj = new Date(days[0].date + "T00:00:00");
    const date = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    const dayName = dateObj.toLocaleDateString("en-US", { weekday: "long" });
    document.querySelector(".date-box").innerHTML = date + " " + dayName;
    
}
function renderAQI(object) {
    const card = document.getElementById("aqi-card");
    const aqi = object.current.air_quality;

    if (!aqi) {
        card.style.display = "none";
        return;
    }

    const epa = aqi["us-epa-index"];

    const aqiConfig = [
        { label: "Good", color: "#22c55e", badgeBg: "#dcfce7", badgeColor: "#16a34a", icon: "✅", advice: "Air quality is excellent. It's a great day to be outside — enjoy activities freely with no restrictions." },
        { label: "Moderate", color: "#eab308", badgeBg: "#fef9c3", badgeColor: "#a16207", icon: "⚠️", advice: "Air quality is acceptable. Unusually sensitive individuals may want to limit prolonged outdoor exertion." },
        { label: "Unhealthy for Sensitive Groups", color: "#f97316", badgeBg: "#ffedd5", badgeColor: "#c2410c", icon: "😷", advice: "People with respiratory or heart conditions, children, and elderly should reduce prolonged outdoor activity." },
        { label: "Unhealthy", color: "#ef4444", badgeBg: "#fee2e2", badgeColor: "#b91c1c", icon: "🚫", advice: "Everyone may experience health effects. Sensitive groups should avoid outdoor activity. Consider wearing a mask." },
        { label: "Very Unhealthy", color: "#a855f7", badgeBg: "#f3e8ff", badgeColor: "#7e22ce", icon: "☣️", advice: "Health alert! Everyone should avoid prolonged outdoor exertion. Sensitive groups should stay indoors." },
        { label: "Hazardous", color: "#7f1d1d", badgeBg: "#fce7f3", badgeColor: "#9d174d", icon: "🆘", advice: "Emergency conditions. Everyone should avoid all outdoor activity. Stay indoors with windows closed." },
    ];

    const cfg = aqiConfig[(epa - 1)] || aqiConfig[0];

    // needle position: each segment is ~16.6% wide, center of each
    const needlePositions = [8.3, 25, 41.6, 58.3, 75, 91.6];
    const needleLeft = needlePositions[(epa - 1)] || 8.3;

    document.getElementById("aqi-number").textContent = epa;
    document.getElementById("aqi-location").textContent = object.location.name + ", " + object.location.country;
    document.getElementById("aqi-scale-label").textContent = "US EPA Index";

    const badge = document.getElementById("aqi-badge");
    badge.textContent = cfg.label;
    badge.style.background = cfg.badgeBg;
    badge.style.color = cfg.badgeColor;

    document.getElementById("aqi-needle").style.left = needleLeft + "%";
    document.getElementById("aqi-advice-icon").textContent = cfg.icon;
    document.getElementById("aqi-advice-text").textContent = cfg.advice;

    card.style.display = "block";
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
    const days = object.forecast.forecastday;
    const conta = document.querySelector(".weekly-container");
    conta.innerHTML = "";

    for (let i = 1; i <= 9; i++) {
        const daya = days[i];
        const dateObj = new Date(daya.date + "T00:00:00");
        const date = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
        const dayName = dateObj.toLocaleDateString("en-US", { weekday: "long" });
        const maxTemp = daya.day.maxtemp_c;
        const minTemp = daya.day.mintemp_c;
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

// ============ EVENT LISTENERS (weather) ============

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("get-started-btn").addEventListener("click", startApp);

    document.querySelector(".search-icon").addEventListener("click", loadWeather);

    document.querySelector(".search-input").addEventListener("keydown", function (event) {
        if (event.key === "Enter") loadWeather();
    });

    document.querySelector(".today-button").addEventListener("click", function () {
        document.querySelector("#hourly-container").removeAttribute("hidden");
        document.querySelector(".weekly-container").setAttribute("hidden", "");
    });

    document.querySelector(".week-button").addEventListener("click", function () {
        document.querySelector(".weekly-container").removeAttribute("hidden");
        document.querySelector("#hourly-container").setAttribute("hidden", "");
    });

    document.getElementById("chat-send").addEventListener("click", handleChatSend);

    document.getElementById("chat-input").addEventListener("keydown", function (e) {
        if (e.key === "Enter") handleChatSend();
    });

    document.getElementById("chat-toggle-btn").addEventListener("click", function () {
        const body = document.getElementById("chat-body");
        const isHidden = body.hasAttribute("hidden");
        if (isHidden) {
            body.removeAttribute("hidden");
            this.textContent = "−";
        } else {
            body.setAttribute("hidden", "");
            this.textContent = "+";
        }
    });



});

// ============ GEMINI CHATBOX ============

function appendMessage(role, text) {
    const container = document.getElementById("chat-messages");

    if (!container) {
        console.error("chat-messages div not found");
        return;
    }

    const div = document.createElement("div");
    div.className = `chat-bubble ${role}`;
    div.innerText = text;

    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function buildWeatherContext(data) {
    const c = data.current;
    const loc = data.location;
    const today = data.forecast.forecastday[0].day;

    let aqiText = "unavailable";
    if (c.air_quality) {
        const epa = c.air_quality["us-epa-index"];
        const aqiLabels = ["", "Good", "Moderate", "Unhealthy for Sensitive Groups", "Unhealthy", "Very Unhealthy", "Hazardous"];
        aqiText = `${epa} (${aqiLabels[epa] || "Unknown"})`;
    }

    return `
Location: ${loc.name}, ${loc.country}
Temperature: ${c.temp_c}°C (feels like ${c.feelslike_c}°C)
Condition: ${c.condition.text}
Humidity: ${c.humidity}%
Wind speed: ${c.wind_kph} km/h
UV Index: ${c.uv}
Visibility: ${c.vis_km} km
Today's high: ${today.maxtemp_c}°C | low: ${today.mintemp_c}°C
Chance of rain today: ${today.daily_chance_of_rain}%
US EPA Air Quality Index: ${aqiText}
    `.trim();
}

// Calls Gemini API with weather context + user question
async function geminiChat(userMessage) {
    if (!currentWeatherData) {
        return "Please search for a city first in the search box at top.";
    }

    const weatherContext = buildWeatherContext(currentWeatherData);

    const prompt = `
Weather data:
${weatherContext}

User question: ${userMessage}

Explain in structured format:
1. AQI status
2. Health impact
3. Temperature effect
4. Advice
5. Summary
7. no bolding or itallics as it breaks the format
6.use spaces for formatting
Use emojis. Keep it concise.
`;

    try {
        const response = await fetch("https://weather-backend-n05c.onrender.com/api/gemini", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        // ✅ CRITICAL CHECK
        if (!response.ok) {
            const errorText = await response.text();
            console.log("Gemini API Error:", errorText);
            return "API error. Check key or quota.";
        }

        const result = await response.json();

        // ✅ SAFE ACCESS
        if (!result.candidates || !result.candidates.length) {
            console.log("Invalid response:", result);
            return "No response from AI.";
        }

        return result.candidates[0].content.parts[0].text;

    } catch (err) {
        console.log("Network error:", err);
        return "Network error.";
    }
}

// Handles send button click or Enter key
async function handleChatSend() {
    const input = document.getElementById("chat-input");
    const message = input.value.trim();
    if (!message) return;

    appendMessage("user", message);
    input.value = "";

    // Show typing indicator
    const thinking = document.createElement("div");
    thinking.className = "chat-bubble bot thinking";
    thinking.innerText = "Thinking...";
    document.getElementById("chat-messages").appendChild(thinking);
    document.getElementById("chat-messages").scrollTop = 9999;

    const reply = await geminiChat(message);

    // Replace thinking bubble with real reply
    thinking.classList.remove("thinking");
    thinking.innerText = reply;
    document.getElementById("chat-messages").scrollTop = 9999;
}

// Fill input from suggestion chips
function fillSuggestion(text) {
    document.getElementById("chat-input").value = text;
    document.getElementById("chat-input").focus();
}

// Send on button click or Enter


// Minimise / expand toggle

