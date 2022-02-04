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

async function getWeatherData(city) {
  try {
    

    const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&APPID=ba229d8f556f8a6d29e410a6aedd15ad`)
    
    if(response.status == 404){
      document.getElementById('error-text').textContent = 'City not found.'
      throw new Error('City not found');
    }
    document.getElementById('error-text').textContent = '';

    const latLonData = await response.json()
    const lat = latLonData.coord.lat;
    const lon = latLonData.coord.lon;

    console.log({lat, lon})

    const response2 = await fetch(`http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=ba229d8f556f8a6d29e410a6aedd15ad`);
    
    if(response2.status == 404){
      throw new Error('lat lon error');
    }

    console.log(response2);

    const weatherData = await response2.json();
    console.log(weatherData);
    parseWeatherData(weatherData, latLonData);
    console.log(weatherData);
    displayWeather();
  } catch (error) {
    console.log(error);
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
}

function displayWeather() {
  var iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
  document.getElementById('weather-icon').src = iconURL;

  document.getElementById('city').textContent = city + ", " + country;
  document.getElementById('currentTemp').textContent = currentTemp + "°F";
  document.getElementById('feelsLike').textContent = "Feels like: " + feelsLike + "°F";
  document.getElementById('description').textContent = description.charAt(0).toUpperCase() + description.slice(1);
  document.getElementById('humidity').textContent ="Humidity: " + humidity + "%";
  document.getElementById('wind').textContent ="Wind: " + wind + " mph";
  document.getElementById('chanceOfRain').textContent = "Chance of rain: " + chanceOfRain + "%";
  document.getElementById('rainVol').textContent = "Rain volume: " + rainVol + " in";
}

function searchCity(e, form) {
  console.log({e, form});
  e.preventDefault();
  let city = document.getElementById('city-search').value;
  getWeatherData(city);
}

getWeatherData('paris');
