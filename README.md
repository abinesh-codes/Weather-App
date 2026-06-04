# 🌦️ WeatherSphere – Adaptive Weather Intelligence Platform

A modern weather forecasting platform that provides real-time weather conditions, hourly forecasts, weekly forecasts, air quality monitoring, weather metrics, and adaptive user interfaces optimized for Mobile, Tablet, Laptop, and Large Screen devices.

## 🚀 Live Demo

**Deployment Link:**
https://weather-app-delta-ebon-38.vercel.app/

---

## 📸 Application Screenshots

### Dark Theme Dashboard

![Dark Theme](./screenshots/dark-theme.png)

### Light Theme Dashboard

![Light Theme](./screenshots/light-theme.png)

---

## 🚀 Overview

WeatherSphere is an advanced weather intelligence platform built using React.js that delivers real-time weather information through an adaptive multi-device interface.

The application dynamically adjusts its layout based on screen size, providing unique user experiences for mobile phones, tablets, laptops, and large displays.

Users can monitor:

* Current Weather Conditions
* Hourly Forecast
* Weekly Forecast
* Air Quality Index (AQI)
* UV Index
* Humidity & Dew Point
* Wind Speed & Direction
* Visibility
* Atmospheric Pressure
* Sunrise & Sunset
* Moon Phase
* Saved Cities
* Dark & Light Themes

---

## 📁 Project Structure

```text
WEATHERSPHERE/
│
├── public/
│
├── src/
│   ├── assets/                 # Images, icons, animations
│   │
│   ├── components/
│   │   ├── CurrentWeather/
│   │   ├── HourlyForecast/
│   │   ├── WeeklyForecast/
│   │   ├── WeatherMetrics/
│   │   ├── AQI/
│   │   ├── Wind/
│   │   ├── Humidity/
│   │   └── ThemeSwitcher/
│   │
│   ├── layouts/
│   │   ├── MobileLayout.jsx
│   │   ├── TabletLayout.jsx
│   │   ├── LaptopLayout.jsx
│   │   └── DesktopLayout.jsx
│   │
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Radar.jsx
│   │   ├── SavedCities.jsx
│   │   └── Settings.jsx
│   │
│   ├── services/
│   │   ├── weatherApi.js
│   │   └── geolocationApi.js
│   │
│   ├── context/
│   │   └── WeatherContext.jsx
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── screenshots/
│   ├── dark-theme.png
│   └── light-theme.png
│
├── package.json
└── README.md
```

---

## 🛠️ Technology Stack

### Frontend

* React.js
* Vite
* CSS3
* React Router DOM
* Framer Motion
* React Icons

### APIs

* OpenWeather API
* Geolocation API

### State Management

* React Context API

### Deployment

* Vercel

---

## 🔄 Application Workflow

### 1. Weather Data Collection

* Detects user location using Geolocation API
* Fetches live weather information
* Retrieves weather metrics and forecasts

### 2. Data Processing

* Parses API responses
* Organizes current weather and forecast data
* Formats weather metrics for visualization

### 3. Adaptive Rendering

* Detects screen size
* Loads dedicated layouts
* Optimizes content density for each device category

### 4. User Interaction

* Search cities
* Save favorite locations
* Switch themes
* Explore forecasts and weather metrics

---

## 📊 Adaptive Layout Architecture

### Mobile Devices (320px – 767px)

* Single-column design
* Bottom navigation
* Swipeable forecast cards
* Touch-optimized interactions

### Tablets (768px – 1199px)

* Two-column dashboard
* Expanded weather cards
* Side-by-side forecasts

### Laptops (1200px – 1600px)

* Professional dashboard layout
* Sidebar navigation
* Multi-panel weather insights

### Large Screens (1600px+)

* Four-column analytics dashboard
* Multi-city weather monitoring
* Weather command center experience

---

## 🎯 Key Features

### Real-Time Weather Data

* Live weather updates
* Accurate weather conditions

### Hourly Forecast

* 24-hour weather timeline
* Temperature tracking
* Weather condition indicators

### Weekly Forecast

* 7-day forecast
* Temperature trends
* Weather probability analysis

### Weather Metrics Dashboard

* Air Quality Index
* UV Index
* Humidity
* Wind Speed
* Visibility
* Pressure
* Dew Point
* Sunrise & Sunset
* Moon Phase

### Theme Support

* Dark Mode
* Light Mode

### Adaptive UI

* Device-specific layouts
* Mobile-first optimization
* Responsive design system

---

## 🚀 Getting Started

### Prerequisites

* Node.js 18+
* npm
* OpenWeather API Key

### Installation

Clone the repository:

```bash
git clone https://github.com/abinesh-codes/Weather-App.git
```

Navigate to project folder:

```bash
cd Weather-App
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

---

## 🔧 Project Libraries

```bash
npm install react-router-dom
npm install axios
npm install react-icons
npm install framer-motion
```

---

## 🌐 Deployment

Frontend Deployment:

https://weather-app-delta-ebon-38.vercel.app/

---
## 📸 Application Screenshots

Dark Theme of the weather app

<img width="1920" height="1080" alt="dark" src="https://github.com/user-attachments/assets/a959f386-4bbe-441a-a81d-fd2f171b122a" />

Bright Theme of the weather app

<img width="1920" height="1080" alt="bright" src="https://github.com/user-attachments/assets/afa26d47-4a78-4d5f-8277-e2c1e28e4fac" />


## ⭐ Support the Project

If you found this project useful, consider giving it a star on GitHub. It helps showcase the project and supports future improvements.

### Developed by Abinesh R.
