# 🌦️ Weatheram AI – Smart Weather App

## 🚀 Overview

Weatheram AI is a modern web-based weather application that provides **real-time weather data** along with **AI-powered insights**.
It combines traditional API-based weather forecasting with intelligent recommendations to enhance user experience.

---

## ✨ Features

### 🌍 Weather Features

* Real-time weather data for any city
* Temperature, humidity, wind speed, and conditions
* Hourly forecast
* Weekly forecast (7–10 days)

### 🤖 AI Features

* AI-generated weather explanations
* AQI-based health insights
* Personalized recommendations (what to wear, when to go out, etc.)
* Chatbot interface for interactive queries

### 🎨 UI/UX Features

* Modern landing page
* Smooth transition from landing → app
* Responsive layout
* Clean and minimal design

---

## 🛠️ Technologies Used

* **Frontend:** HTML, CSS, JavaScript
* **Weather API:** WeatherAPI.com
* **AI Integration:** Google Gemini API
* **Data Format:** JSON

---

## 📂 Project Structure

```
weather-app/
│
├── index.html       # Main UI
├── style.css        # Styling
├── script.js        # Logic & API calls
├── assets/          # Icons/images
└── README.md
```

---

## ⚙️ How It Works

1. User enters a city name
2. App fetches data from Weather API
3. Weather data is displayed dynamically
4. Data is passed to AI model
5. AI generates insights and recommendations

---

## 🔑 API Setup

### Weather API

* Get API key from: https://www.weatherapi.com/

### Gemini AI API

* Get API key from: https://aistudio.google.com/app/apikey
* Enable **Generative Language API**

---

## ▶️ How to Run

1. Clone the repository:

```
git clone https://github.com/your-username/weatheram-ai.git
```

2. Open project folder

3. Replace API keys in `script.js`:

```javascript
const GEMINI_API_KEY = "YOUR_KEY";
```

4. Open `index.html` in browser

---

## ⚠️ Known Limitations

* Requires internet connection
* Free API has rate limits
* AI responses depend on API availability

---

## 🔮 Future Enhancements

* Location-based weather detection (GPS)
* Dark mode
* Push notifications for weather alerts
* Voice assistant integration
* Backend for secure API key handling

---

## 🧠 Learning Outcomes

* API integration using `fetch()`
* Async JavaScript handling
* DOM manipulation
* UI/UX design principles
* AI integration in web apps

---

## 📌 Conclusion

Weatheram AI demonstrates how modern applications can combine **real-time data** with **AI-driven insights** to deliver a smarter and more user-friendly experience.

---

## 👨‍💻 Author

Your Name

---

