// Weather app

const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const apikey = "cd92c006dc31de0b38a401c7054f4869";

weatherForm.addEventListener("submit", async event => {
    event.preventDefault();

    const city = cityInput.value.trim();

    if (city) {
        try {
            displayLoading();
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);
        }
        catch (error) {
            console.log(error);
            displayError(error.message || "Something went wrong. Please try again.");
        }
    }
    else {
        displayError("Please enter a city.");
    }
});

async function getWeatherData(city) {
    const apiurl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apikey}&units=metric`;
    const response = await fetch(apiurl);

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error("City not found. Try another spelling.");
        }

        if (response.status === 401) {
            throw new Error("API key issue. Please check your OpenWeather key.");
        }

        throw new Error("Couldn't fetch weather data. Please try again.");
    }

    return await response.json();
}

function displayWeatherInfo(data) {
    const {
        name: city,
        sys: { country },
        main: { temp, feels_like, humidity, pressure },
        wind: { speed },
        weather: [{ description, id }]
    } = data;

    document.body.className = `weather-theme ${getThemeClass(id)}`;
    card.textContent = "";
    card.classList.remove("stateOnly");

    const cardTop = document.createElement("div");
    const locationBlock = document.createElement("div");
    const label = document.createElement("p");
    const cityDisplay = document.createElement("h2");
    const weatherEmoji = document.createElement("p");
    const weatherMain = document.createElement("div");
    const tempDisplay = document.createElement("p");
    const descDisplay = document.createElement("p");
    const detailGrid = document.createElement("div");

    cardTop.classList.add("cardTop");
    locationBlock.classList.add("locationBlock");
    label.classList.add("label");
    cityDisplay.classList.add("cityDisplay");
    weatherEmoji.classList.add("weatherEmoji");
    weatherMain.classList.add("weatherMain");
    tempDisplay.classList.add("tempDisplay");
    descDisplay.classList.add("descDisplay");
    detailGrid.classList.add("detailGrid");

    label.textContent = "Current weather";
    cityDisplay.textContent = `${city}, ${country}`;
    weatherEmoji.textContent = getWeatherEmoji(id);
    tempDisplay.textContent = `${Math.round(temp)}\u00B0C`;
    descDisplay.textContent = toTitleCase(description);

    locationBlock.appendChild(label);
    locationBlock.appendChild(cityDisplay);
    cardTop.appendChild(locationBlock);
    cardTop.appendChild(weatherEmoji);

    weatherMain.appendChild(tempDisplay);
    weatherMain.appendChild(descDisplay);

    detailGrid.appendChild(createMetric("Feels like", `${Math.round(feels_like)}\u00B0C`));
    detailGrid.appendChild(createMetric("Humidity", `${humidity}%`));
    detailGrid.appendChild(createMetric("Wind", `${speed.toFixed(1)} m/s`));
    detailGrid.appendChild(createMetric("Pressure", `${pressure} hPa`));

    card.appendChild(cardTop);
    card.appendChild(weatherMain);
    card.appendChild(detailGrid);
}

function createMetric(label, value) {
    const metric = document.createElement("div");
    const metricLabel = document.createElement("span");
    const metricValue = document.createElement("strong");

    metric.classList.add("metric");
    metricLabel.textContent = label;
    metricValue.textContent = value;

    metric.appendChild(metricLabel);
    metric.appendChild(metricValue);

    return metric;
}

function displayLoading() {
    document.body.className = "weather-theme";
    card.classList.add("stateOnly");
    card.textContent = "";

    const loading = document.createElement("div");
    const loader = document.createElement("span");
    const text = document.createElement("p");

    loading.classList.add("loadingState");
    loader.classList.add("loader");
    text.textContent = "Fetching the latest weather...";

    loading.appendChild(loader);
    loading.appendChild(text);
    card.appendChild(loading);
}

function getWeatherEmoji(weatherId) {
    switch (true) {
        case (weatherId >= 200 && weatherId < 300):
            return "\u26C8\uFE0F";
        case (weatherId >= 300 && weatherId < 600):
            return "\uD83C\uDF27\uFE0F";
        case (weatherId >= 600 && weatherId < 700):
            return "\u2744\uFE0F";
        case (weatherId >= 700 && weatherId < 800):
            return "\uD83C\uDF2B\uFE0F";
        case (weatherId === 800):
            return "\u2600\uFE0F";
        case (weatherId >= 801 && weatherId < 810):
            return "\u2601\uFE0F";
        default:
            return "\u2753";
    }
}

function getThemeClass(weatherId) {
    switch (true) {
        case (weatherId >= 200 && weatherId < 300):
            return "themeStorm";
        case (weatherId >= 300 && weatherId < 600):
            return "themeRain";
        case (weatherId >= 600 && weatherId < 700):
            return "themeSnow";
        case (weatherId >= 700 && weatherId < 800):
            return "themeMist";
        case (weatherId === 800):
            return "themeClear";
        case (weatherId >= 801 && weatherId < 810):
            return "themeClouds";
        default:
            return "";
    }
}

function displayError(message) {
    document.body.className = "weather-theme";
    card.classList.add("stateOnly");
    card.textContent = "";

    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay");

    card.appendChild(errorDisplay);
}

function toTitleCase(text) {
    return text
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}
