//Global Variables from the front-end
var cityLabel = document.querySelector("#cityLabel");
var cityDateLabel = document.querySelector("#cityDateLabel");
var iconWeather = document.querySelector("#iconWeather");
var tempMain = document.querySelector("#tempMain");
var windMain = document.querySelector("#windMain");
var humidityMain = document.querySelector("#humidityMain");
var uvIndexMain = document.querySelector("#uvIndexMain");
var forecastList = document.querySelector("#forecast-list");
var listHistorical = document.querySelector("#listHistorical");
//Create variables from the buttons
var findCity = document.querySelector("#findCity");
var deleteHistorical = document.querySelector("#delete");
//Input
var cityInput = document.querySelector("#city");
// API Key
var weatherAPI = "7ec7b4300005c010153d043f44737174";
// Get today Info and format to display on the front end
var today = moment().format("MMM Do, YYYY");
// Variable to get the local storage data 
var citiesLocalSotage=[];

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
        var uvIndexMetric,uvIndexMetricBackground,uvIndexMetricText;
        var uvIndexValue = data.value;
        if (uvIndexValue > 0 && uvIndexValue < 3) {
          uvIndexMetric = "Low"; //green
            uvIndexMetricBackground = "green";
            uvIndexMetricText = "white";
        } else if (uvIndexValue >= 3 && uvIndexValue < 6) {
          uvIndexMetric = "Moderate"; //yellow
            uvIndexMetricBackground = "yellow";
            uvIndexMetricText = "white";
        } else if (uvIndexValue >= 6 && uvIndexValue < 8) {
          uvIndexMetric = "High"; //orange
            uvIndexMetricBackground = "orange";
            uvIndexMetricText = "white";
        } else if (uvIndexValue >= 8 && uvIndexValue < 11) {
          uvIndexMetric = "Very High"; //red
            uvIndexMetricBackground = "red";
            uvIndexMetricText = "white";
        } else if (uvIndexValue > 11) {
            uvIndexMetric = "Extreme"; //purple
            uvIndexMetricBackground = "purple";
            uvIndexMetricText = "white";
        }
          uvIndexMain.textContent = uvIndexValue;
          uvIndexMain.setAttribute("style", "background-color:"+uvIndexMetricBackground+";color:"+uvIndexMetricText);
      });
    } 
  });
};
var createCityHistorical = function (city) {
    // Creating the elements that will show the historical data
    var buttonEl = document.createElement("button");
    // Set the classes to look nice and functional 
    buttonEl.setAttribute('class', 'btn btn-block btn-lg w-100 bg-dark text-white my-2 capitalize');

    buttonEl.setAttribute('data-value', city)
    buttonEl.textContent = city;
    // Append to the list
    listHistorical.appendChild(buttonEl)
    
}
var getWeather = function () {
  var city = cityInput.value;
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    weatherAPI;

    fetch(apiUrl).then(function (response) {
    if (response.status == 200 ) {
      response.json().then(function (data) {

        cityLabel.textContent = city.toUpperCase();
        cityDateLabel.textContent = "("+today+")";
        var weatherIcon = data.weather[0].icon;
        var iconurl =
            "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";
        iconWeather.setAttribute("src", iconurl);
        //Display Wind speed and convert to MPH
        var windSpeeds = data.wind.speed;
        var windSpeedsMiles = (windSpeeds * 2.237).toFixed(1);
        tempMain.textContent = data.main.temp + " °F ";
        windMain.textContent = windSpeedsMiles + " MPH";
        humidityMain.textContent = data.main.humidity + " %";
          UVIndex(data.coord.lon, data.coord.lat);
          var checkCityLocalStorage = false;
            // check if is on the localstorage if not it save it
          for (var it = 0; it < citiesLocalSotage.length; it++) {
              if (citiesLocalSotage[it].toUpperCase() == city.toUpperCase()) {
                  checkCityLocalStorage = true;
                  break;
              }
          }
          if (!checkCityLocalStorage) {
            createCityHistorical(city);
            citiesLocalSotage.push(city);
            localStorage.setItem("weathercities", JSON.stringify(citiesLocalSotage));
          }
          displayForecastWeather(data.coord.lon, data.coord.lat)
      });
    } else {
        alert("No information from the city " + city);
        tempMain.textContent = "";
        windMain.textContent = "";
        humidityMain.textContent = "";
        uvIndexMain.textContent = "";
        cityLabel.textContent = "";
        iconWeather.setAttribute("src", '');
        cityDateLabel.textContent = "";
        uvIndexMain.setAttribute("style", "background-color:transparent;");
    }
  });
};

var displayForecastWeather = function (ln, lt) {
    var apiForecastUrl="https://api.openweathermap.org/data/2.5/onecall?lat="+lt+"&lon="+ln+"&exclude=current&appid="+weatherAPI;


    fetch(apiForecastUrl).then(function (response) {
      
        if (response.status == 200) {

            response.json().then(function (data) {
                console.log(data);
                //I clean the element that show the list of the forecast
                forecastList.textContent = "";
                var dataDaily = data.daily;
                //Setting the array to 6 cause the first element is the current 
                for (var i = 1; i < 6; i++){
                    var dateForecast= moment.unix(dataDaily[i].dt).format("MMM Do, YYYY");
                // On this part I create the elements that will display the forecast 
                    var divCardEl = document.createElement("div");
                    var ulEl = document.createElement("ul");
                    var liDateEl = document.createElement("li");
                    var liImgEl = document.createElement("li");
                    var imgEl = document.createElement("img");
                    var liTempEl = document.createElement("li");
                    var liWindEl = document.createElement("li");
                    var liHumidityEl = document.createElement("li");
                    // Setting class for the elements 
                    divCardEl.setAttribute("class", "card w-100 mx-3");
                    ulEl.setAttribute("class", "list-group list-group-flush");
                    liDateEl.setAttribute("class", "list-group-item border-0 bg-dark text-white size13 ");
                    liImgEl.setAttribute("class", "list-group-item border-0 bg-dark text-white size13");
                    liTempEl.setAttribute("class", "list-group-item border-0 bg-dark text-white size13");
                    liWindEl.setAttribute("class", "list-group-item border-0 bg-dark text-white size13");
                    liHumidityEl.setAttribute("class", "list-group-item border-0 bg-dark text-white size13");
                    // Setting the values for the forecast 
                    liDateEl.textContent = dateForecast;
                    var weatherIcon = dataDaily[i].weather[0].icon;
                    var iconurl =
                        "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";
                    imgEl.setAttribute("src", iconurl);
                    imgEl.setAttribute("style", "width:50px;");
                    liTempEl.textContent = "Temp: " + dataDaily[i].temp.day + " °F";                    
                    var windSpeeds = dataDaily[i].wind_speed;
                    var windSpeedsMiles = (windSpeeds * 2.237).toFixed(1);
                    liWindEl.textContent = "Wind: "+windSpeedsMiles+ " MPH";
                    liHumidityEl.textContent = "Humidity: "+dataDaily[i].humidity + " %";
                    // Append the elements
                    liImgEl.appendChild(imgEl);
                    ulEl.append(liDateEl);
                    ulEl.append(liImgEl);
                    ulEl.append(liTempEl);
                    ulEl.append(liWindEl);
                    ulEl.append(liHumidityEl);
                    divCardEl.append(ulEl);
                    forecastList.appendChild(divCardEl);

                    console.log(dataDaily[i]);
                }
            });
        }
    });
        

//   if (cityWeather.length === 0) {
//     weatherContainerEl.textContent = "This city has no information!";
//     return;
//   }

//   for (var i = 0; i < cityWeather.length; i++) {
//     // Creating the elements that will print on the front-end for the forecast on each Day
//     var divColEl = document.createElement("div");
//     var divCardEl = document.createElement("div");
//     var ulEl = document.createElement("ul");
//     var liDateEl = document.createElement("li");
//     var liImgEl = document.createElement("li");
//     var liTempEl = document.createElement("li");
//     var liWindEl = document.createElement("li");
//     var liHumidityEl = document.createElement("li");

//     // Append the elements
//     ulEl.appendChild(liDateEl);
//     ulEl.appendChild(liImgEl);
//     ulEl.appendChild(liTempEl);
//     ulEl.appendChild(liWindEl);
//     ulEl.appendChild(liHumidityEl);
//     divCardEl.append(ulEl);
//     divColEl.append(divCardEl);
//     forecastList.appendChild(issueEl);
//   }
};

findCity.addEventListener("click", getWeather);

var getOldWeather = function (event) {
    if (event.target.dataset.value) {
        cityInput.value = event.target.dataset.value;
        getWeather();
    }
}

listHistorical.addEventListener("click", getOldWeather);
//localStorage.setItem("weathercities",JSON.stringify(sCity));

var initSystem = function () {
    
    citiesLocalSotage = JSON.parse(localStorage.getItem("weathercities"));
    if (citiesLocalSotage !== null) {
        citiesLocalSotage = JSON.parse(localStorage.getItem("weathercities"));
        for (i = 0; i < citiesLocalSotage.length; i++) {
            createCityHistorical(citiesLocalSotage[i]);
        }
    } else {
        citiesLocalSotage = [];
    }

}

initSystem();