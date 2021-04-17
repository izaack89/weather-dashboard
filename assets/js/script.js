//Global Variables from the front-end
var cityLabel = document.querySelector("#cityLabel");
var tempMain = document.querySelector("#tempMain");
var windMain = document.querySelector("#windMain");
var humidityMain = document.querySelector("#humidityMain");
var uvIndexMain = document.querySelector("#uvIndexMain");
var forecastList = document.querySelector("#forecast-list");
//Create variables from the buttons
var findCity = document.querySelector("#findCity");
var deleteHistorical = document.querySelector("#delete");
//Input
var cityInput = document.querySelector("#city");
// API Key
var weatherAPI = "7ec7b4300005c010153d043f44737174";

var UVIndex = function (ln, lt) {
  //lets build the url for uvindex.
  var uvqURL =
    "https://api.openweathermap.org/data/2.5/uvi?appid=" +
    weatherAPI +
    "&lat=" +
    lt +
    "&lon=" +
    ln;

  fetch(uvqURL).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        console.log(data);
        var uvIndexMetric;
        var uvIndexValue = data.value;
        if (uvIndexValue > 0 && uvIndexValue < 3) {
          uvIndexMetric = "Low"; //green
        } else if (uvIndexValue >= 3 && uvIndexValue < 6) {
          uvIndexMetric = "Moderate"; //yellow
        } else if (uvIndexValue >= 6 && uvIndexValue < 8) {
          uvIndexMetric = "High"; //orange
        } else if (uvIndexValue >= 8 && uvIndexValue < 11) {
          uvIndexMetric = "Very High"; //red
        } else if (uvIndexValue > 11) {
          uvIndexMetric = "Extreme"; //purple
        }
        uvIndexMain.textContent = "UV Index: " + uvIndexValue + uvIndexMetric;
      });
    } else {
      console.log("Error");
    }
  });
};

var getWeather = function () {
  var city = cityInput.value;
  var apiUrl =
    "http://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    weatherAPI;

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        console.log(data);

        var weathericon = data.weather[0].icon;
        var iconurl =
          "https://openweathermap.org/img/wn/" + weathericon + "@2x.png";
        //Display Wind speed and convert to MPH
        var windSpeeds = data.wind.speed;
        var windSpeedsMiles = (windSpeeds * 2.237).toFixed(1);
        tempMain.textContent = data.main.temp + " °F ";
        windMain.textContent = windSpeedsMiles + " MPH";
        humidityMain.textContent = data.main.humidity + " %";
        UVIndex(data.coord.lon, data.coord.lat);
      });
    } else {
      console.log("");
    }
  });
};

var displayForecastWeather = function (cityWeather) {
  if (cityWeather.length === 0) {
    weatherContainerEl.textContent = "This city has no information!";
    return;
  }

  for (var i = 0; i < cityWeather.length; i++) {
    // Creating the elements that will print on the front-end for the forecast on each Day
    var divColEl = document.createElement("div");
    var divCardEl = document.createElement("div");
    var ulEl = document.createElement("ul");
    var liDateEl = document.createElement("li");
    var liImgEl = document.createElement("li");
    var liTempEl = document.createElement("li");
    var liWindEl = document.createElement("li");
    var liHumidityEl = document.createElement("li");

    // Append the elements
    ulEl.appendChild(liDateEl);
    ulEl.appendChild(liImgEl);
    ulEl.appendChild(liTempEl);
    ulEl.appendChild(liWindEl);
    ulEl.appendChild(liHumidityEl);
    divCardEl.append(ulEl);
    divColEl.append(divCardEl);
    forecastList.appendChild(issueEl);
  }
};

findCity.addEventListener("click", getWeather);
