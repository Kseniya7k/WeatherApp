const cityNameInp = document.querySelector('.city');
const sendBtn = document.querySelector('.btn-send');
const search = document.querySelector('.search');
let currentCity = '';

function getWeatherFromResponse({ name, weather, main, wind, clouds, sys }) {
    return {
        city: name || '',
        weather: weather && weather[0] && weather[0].description || '',
        temp: main && main.temp || '',
        feels_like: main && main.feels_like || '',
        pressure: main && main.pressure || '',
        humidity: main && main.humidity || '',
        windSpeed: wind && wind.speed || '',
        clouds: clouds && clouds.all || '',
        sunrise: sys && sys.sunrise || '',
        sunset: sys && sys.sunset || '',
        icon: weather && weather[0] && weather[0].icon || ''
    }
}

function getTemplate(weather) {
    return `
        <div class="weather">
            <h2>${weather.city}</h2>
            <div>Данные актуальны на: ${new Date().toLocaleString()}
            <button class="btn-update" onclick="getWeather(currentCity)">⭮</button>
            </div>
            <img src="http://openweathermap.org/img/wn/${weather.icon}@2x.png" alt="icon weather"/>
            <p>Погодные условия: ${weather.weather}.</p>
            <p>Температура: ${Math.ceil(weather.temp)}°С.</p>
            <p>Ощущается как: ${Math.ceil(weather.feels_like)}°С.</p>
            <p>Атмосферное давление: ${weather.pressure} мм.</p>
            <p>Влажность: ${weather.humidity} %.</p>
            <p>Скорость ветра: ${weather.windSpeed} м/с.</p>
            <p>Облачность: ${weather.clouds} %.</p>
            <p>Время восхода: ${new Date(weather.sunrise * 1000).toLocaleString()}.</p>
            <p>Время заката: ${new Date(weather.sunset * 1000).toLocaleString()}.</p>
        </div>`;
}

async function getWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=87a4e3b57fd5877a435275e9fae66ccd&lang=ru&units=metric`;
    const result = await fetch(url).then(response => response.json());

    if (result && result.cod === 200) {
        const html = getTemplate(getWeatherFromResponse(result));
        const weather = document.querySelector('.weather');
        if (weather) {
            document.body.removeChild(weather);
        }
        search.insertAdjacentHTML('afterend', html);
        currentCity = city;
    } else if (result && result.cod === '404') {
        alert(`${capitalize(result.message)}! Enter the city correctly. `);
    } else {
        alert('An error has occurred.');
    }
}

function capitalize(str) {
    return `${str.charAt(0).toUpperCase()}${str.slice(1)}`
}

cityNameInp.addEventListener('keypress', event => {
    if (event.key === 'Enter') {
        let city = cityNameInp.value.split(' ').join('');
        getWeather(city);
        cityNameInp.value = '';
    }
})

sendBtn.addEventListener('click', () => {
    let city = cityNameInp.value.split(' ').join('');
    getWeather(city);
    cityNameInp.value = '';
})
