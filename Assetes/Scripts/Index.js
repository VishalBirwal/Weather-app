 // Get the progress foreground circle
 function updateProgress(percentage) {
    const progressFG = document.querySelector('.progressFG');
    // Calculate the circumference of the circle
    const radius = parseInt(progressFG.getAttribute('r'));
    const circumference = 2 * Math.PI * radius;

    const dashOffset = circumference - (circumference * (percentage * 2)) / 100;
    progressFG.style.strokeDasharray = `${circumference}`;
    progressFG.style.strokeDashoffset = `${dashOffset}`;
}
updateProgress(30)

// dark mode
const modeImg = document.getElementById('mode');
modeImg.addEventListener('click', toggleMode);
function toggleMode() {
    const body = document.body;
    const root = document.documentElement;
    body.classList.toggle("bglight");
    if (body.classList.contains("bgdark")) {
        body.classList.remove("bgdark")
        body.classList.add("bglight")
        root.style.setProperty('--main-bg', '#2190c2');
        modeImg.src = '../Image/sun.svg';
        modeImg.alt = 'Dark Mode Image';
        modeImg.style.width = "30px"
        modeImg.classList.add("animateTheam");
    }
    else {
        body.classList.add("bgdark")
        root.style.setProperty('--main-bg', '#0f3b8d');
        modeImg.src = "../Image/moon-solid.png";
        modeImg.alt = 'Light Mode Image';
        modeImg.style.width = "25px"
        modeImg.classList.add("animateTheam");

    }
    setTimeout(() => {
        modeImg.classList.remove("animateTheam");
    }, 1000);
}

// current data
function getWeatherByCity(City) {

    const apiKey = "e2f5c7da20b76a7c1e46de5ec1326aac"; // Replace with your OpenWeatherMap API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${City}&appid=${apiKey}`;

    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onload = function () {
        if (xhr.status === 200) {
            const weatherData = JSON.parse(xhr.responseText);
            console.log(weatherData);
            displayWeather(weatherData)
        } else {
            console.error("Error fetching weather data:", xhr.statusText);
        }
    };

    xhr.onerror = function (error) {
        console.error("Error fetching weather data:", error);
    };

    xhr.send();
}

// for 24 day forecast
function get24weather(city, callback) {
    const apiKey = "e2f5c7da20b76a7c1e46de5ec1326aac"; // Replace with your OpenWeatherMap API key
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&cnt=8`;

    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onload = function () {
        if (xhr.status === 200) {
            const forecastData = JSON.parse(xhr.responseText);
            console.log(forecastData); // This will contain the 24-hour forecast data
            if (callback && typeof callback === "function") {
                callback(formatForecastData(forecastData));
            }
        } else {
            console.error("Error fetching forecast data:", xhr.statusText);
        }
    };

    xhr.onerror = function (error) {
        console.error("Error fetching forecast data:", error);
    };

    xhr.send();
}
function formatForecastData(forecastData) {
    const currentDate = new Date();
    const currentDateString = currentDate.toLocaleDateString('en-US');
    return forecastData.list.filter(function (item) {
        const itemDate = new Date(item.dt * 1000);
        const itemDateString = itemDate.toLocaleDateString('en-US');
        return itemDateString === currentDateString;
    }).map(function (item) {
        const dateTime = new Date(item.dt * 1000);
        return {
            iconUrl: `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`,
            temperature: Math.round(item.main.temp - 273.15),
            date: dateTime.toLocaleDateString('en-US'),
            time: dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
    });
}

function displayForecast24(forecastArray) {
    const cardsfuture = document.querySelector('.cardsfuture');
    cardsfuture.innerHTML = ''; // Clear existing content
    forecastArray.forEach(function (forecast) {
        const futureItem = document.createElement('div');
        futureItem.classList.add('futureitems');
        futureItem.innerHTML = `
<img class="img24" src="${forecast.iconUrl}" alt="Weather Icon">
<p class="temp24 font">${forecast.temperature}<span class="font">&#176;C</span></p>
<p class="time24 font">${forecast.date} ${forecast.time}</p>
`;
        cardsfuture.appendChild(futureItem);
    });
}

// five day forecast
function getFiveDayForecastByCity(city, callback) {
    const apiKey = "e2f5c7da20b76a7c1e46de5ec1326aac"; // Replace with your OpenWeatherMap API key
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&cnt=40`;

    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onload = function () {
        if (xhr.status === 200) {
            const forecastData = JSON.parse(xhr.responseText);
            console.log(forecastData); // This will contain the 5-day forecast data
            if (callback && typeof callback === "function") {
                callback(formatFiveDayForecastData(forecastData));
            }
        } else {
            console.error("Error fetching forecast data:", xhr.statusText);
        }
    };

    xhr.onerror = function (error) {
        console.error("Error fetching forecast data:", error);
    };

    xhr.send();
}

function formatFiveDayForecastData(forecastData) {
    const formattedForecast = [];
    for (let i = 0; i < 5; i++) {
        const date = new Date(forecastData.list[i * 8].dt * 1000);
        const forecastForDay = {
            date: date.toLocaleDateString('en-US'),
            forecastElements: []
        };

        // Add the first data point
        const firstItem = forecastData.list[i * 8];
        forecastForDay.forecastElements.push({
            time: new Date(firstItem.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            temperature: Math.round(firstItem.main.temp - 273.15),
            iconUrl: `https://openweathermap.org/img/wn/${firstItem.weather[0].icon}.png`
        });

        // Add the second data point
        const secondItem = forecastData.list[i * 8 + 3];
        forecastForDay.forecastElements.push({
            time: new Date(secondItem.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            temperature: Math.round(secondItem.main.temp - 273.15),
            iconUrl: `https://openweathermap.org/img/wn/${secondItem.weather[0].icon}.png`
        });

        // Add the third data point
        const thirdItem = forecastData.list[i * 8 + 6];
        forecastForDay.forecastElements.push({
            time: new Date(thirdItem.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            temperature: Math.round(thirdItem.main.temp - 273.15),
            iconUrl: `https://openweathermap.org/img/wn/${thirdItem.weather[0].icon}.png`
        });

        formattedForecast.push(forecastForDay);
    }
    return formattedForecast;
}

function displayFiveDayForecastData(forecastArray) {
const forecastDetails = document.querySelector('.forecastDetails');
forecastDetails.innerHTML="";
forecastArray.forEach(function (dayForecast) {
const forecastDay = document.createElement('div');
forecastDay.classList.add('forecastGrid');

const forecastDate = document.createElement('p');
forecastDate.classList.add('font', 'forecastDate');
forecastDate.textContent = dayForecast.date;
forecastDay.appendChild(forecastDate);

const forecastElementsContainer = document.createElement('div');
forecastElementsContainer.classList.add('forecastElements');
dayForecast.forecastElements.forEach(function (forecastElement) {
const forecastItem = document.createElement('div');
forecastItem.classList.add('forecastElement');
forecastItem.innerHTML = `
  <img class="img24" src="${forecastElement.iconUrl}" alt="Weather Icon">
  <p class="temp24 font">${forecastElement.temperature}<span class="font">&#176;C</span></p>
  <p class="time24 font">${forecastElement.time}</p>
`;
forecastElementsContainer.appendChild(forecastItem);
});
forecastDay.appendChild(forecastElementsContainer);
forecastDetails.appendChild(forecastDay);
});
}


// caling function
var btn = document.getElementById("Seachbtn")
    .addEventListener("click", runer)
function runer() {
    var City = document.getElementById('inputcity').value;
    getWeatherByCity(City);
    get24weather(City, displayForecast24)
    getFiveDayForecastByCity(City, displayFiveDayForecastData)
}







// to display the current weather data
function displayWeather(weatherData) {
    // variabele
    var cloud = document.querySelector(".cloud");
    var temp = document.querySelector(".maintemp");
    var dayTime = document.querySelector(".maindate");
    //details variable
    var wind = document.querySelector(".wind");
    var Humidity = document.querySelector(".humidity");
    var sunrise = document.querySelector(".sunrise");
    var sunset = document.querySelector(".sunset");
    var maxtemp = document.querySelector(".maxtemp");
    var mintemp = document.querySelector(".mintemp");
    var description = document.querySelector(".description")



    // console.log(weatherData);
    var iconCode = weatherData.weather[0].icon;
    var urlTemp = checkTemp(weatherData.main.temp);
    var urlCityname = weatherData.name;
    let sunriseTime = new Date(weatherData.sys.sunrise * 1000);
    let sunsetTime = new Date(weatherData.sys.sunset * 1000);
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };

    const formattedSunriseTime = sunriseTime.toLocaleTimeString('en-US', options);
    const formattedSunsetTime = sunsetTime.toLocaleTimeString('en-US', options);

    let urlwind = weatherData.wind.speed;
    let urlhumidity = weatherData.main.humidity;
    let urlMaxTemp = checkTemp(weatherData.main.temp_max);
    let urlMinTemp = checkTemp(weatherData.main.temp_min);
    let desp = weatherData.weather[0].description;
    console.log(desp)


    // time fuction

    const currentDate = new Date();
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = currentDate.toLocaleDateString(undefined, dateOptions);



    // using data for front-end
    // main 
    cloud.src = `https://openweathermap.org/img/wn/${iconCode}.png`;
    function checkTemp(x) {
        value = x
        if (value >= 45) {
            var result = (value - 273.15).toFixed(2);
            return result;
        } else {
            return result;
        }
    }
    temp.innerHTML = `${urlTemp}°C`;
    updateProgress(urlTemp)
    dayTime.innerHTML = `${formattedDate} `;

    // details
    wind.innerHTML = `${urlwind}m/s`
    Humidity.innerHTML = `${urlhumidity}%`;
    sunrise.innerHTML = formattedSunriseTime;
    sunset.innerHTML = formattedSunsetTime;
    maxtemp.innerHTML = `${urlMaxTemp}°C`;
    mintemp.innerHTML = `${urlMinTemp}°C`;
    description.innerHTML = `${desp}`;
}
