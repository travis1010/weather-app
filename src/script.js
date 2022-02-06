import { addDays, format } from 'date-fns'

let feelsLike = null;
let humidity = null;
let currentTemp = null;
let wind = null;
let description = null;
let city = null;
let country = null;
let iconCode = null;
let chanceOfRain = null;
let rainVol = null;
let snowVol = null;
let dailyArr = null;

async function getWeatherData(city) {
  showLoading();
  try {
    let url = null;
    if(/(^\d{5}$)|(^\d{5}-\d{4}$)/.test(city)) {
      if (/(^\d{5}-\d{4}$)/.test(city)) {
        document.getElementById('error-text').textContent = 'Please enter your 5-digit zip code.'
        throw new Error('9 digit zip code');
      } 
      url = `https://api.openweathermap.org/data/2.5/weather?zip=${city}&units=imperial&APPID=ba229d8f556f8a6d29e410a6aedd15ad`;
    } else {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&APPID=ba229d8f556f8a6d29e410a6aedd15ad`;
    }
    const response = await fetch(url)
    if(response.status == 404){
      document.getElementById('error-text').textContent = 'City not found.'
      
      throw new Error('City not found');
    }
    document.getElementById('error-text').textContent = '';

    const latLonData = await response.json()
    const lat = latLonData.coord.lat;
    const lon = latLonData.coord.lon;

    const response2 = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=ba229d8f556f8a6d29e410a6aedd15ad`);
    
    if(response2.status == 404){
      throw new Error('lat lon error');
    }

    const weatherData = await response2.json();
    parseWeatherData(weatherData, latLonData);
    displayWeather();
  } catch (error) {
    console.log(error);
  } finally {
    hideLoading();
  }
}

function parseWeatherData(weatherData, latLonData) {
  feelsLike = Math.round(weatherData.current.feels_like);
  humidity = weatherData.current.humidity;
  currentTemp = Math.round(weatherData.current.temp);
  wind = Math.round(weatherData.current.wind_speed);
  description = weatherData.current.weather[0].description;
  iconCode = weatherData.current.weather[0].icon;
  city = latLonData.name;
  country = latLonData.sys.country;
  chanceOfRain = weatherData.daily[0].pop * 100;
  rainVol = weatherData.daily[0].rain || 0;
  snowVol = weatherData.daily[0].snow || 0;
  dailyArr = weatherData.daily;
}

function displayWeather() {
  var iconURL = "https://openweathermap.org/img/w/" + iconCode + ".png";
  document.getElementById('weather-icon').src = iconURL;

  document.getElementById('city').textContent = city + ", " + country;
  document.getElementById('currentTemp').textContent = currentTemp + "°F";
  document.getElementById('feelsLike').textContent = "Feels like: " + feelsLike + "°F";
  document.getElementById('description').textContent = description.charAt(0).toUpperCase() + description.slice(1);
  document.getElementById('humidity').textContent ="Humidity: " + humidity + "%";
  document.getElementById('wind').textContent ="Wind: " + wind + " mph";
  document.getElementById('chanceOfRain').textContent = "Precipitation: " + chanceOfRain + "%";
  document.getElementById('rainVol').textContent = "Rain volume: " + rainVol + " in";
  document.getElementById('snowVol').textContent = "Snow volume: " + snowVol + " in";

  displayDaily();
}

window.searchCity = (e, form) => {
  e.preventDefault();
  let city = document.getElementById('city-search').value;
  getWeatherData(city);
}

function showLoading() {
  document.getElementById('loading').style.display = 'flex';
  document.getElementById('weather-container').style.display = 'none';
  document.getElementById('daily-weather').style.display = 'none';
}

function hideLoading() {
  document.getElementById('loading').style.display = 'none';
  document.getElementById('weather-container').style.display = 'inline';
  document.getElementById('daily-weather').style.display = 'grid';
}

function displayDaily() {
  const dailyContainer = document.getElementById('daily-weather');
  const today = new Date();
  while(dailyContainer.firstChild) {
    dailyContainer.removeChild(dailyContainer.firstChild);
  }

  for (let i = 0; i < 7; i++) {
    const currentDate = addDays(today, i);
    const day = document.createElement('div');
    day.classList.add('day');

    const dayName = document.createElement('div');
    dayName.classList.add('date');
    dayName.textContent = format(currentDate, 'EEEE');

    const date = document.createElement('div');
    dayName.classList.add('date');
    date.textContent = format(currentDate, 'MMM d')

    const highTemp = document.createElement('div');
    highTemp.classList.add('high-temp');
    highTemp.textContent = Math.round(dailyArr[i].temp.max) + "°";
    const lowTemp = document.createElement('div');
    lowTemp.classList.add('low-temp');
    lowTemp.textContent = Math.round(dailyArr[i].temp.min) + "°";

    const precip = document.createElement('div');
    precip.classList.add('date');
    precip.textContent = "Precip: " + Math.round(dailyArr[i].pop * 100) + "%";

    day.appendChild(dayName);
    day.appendChild(date);
    day.appendChild(highTemp);
    day.appendChild(lowTemp);
    day.appendChild(precip);
    dailyContainer.appendChild(day);
  }


}

getWeatherData('washington dc');
