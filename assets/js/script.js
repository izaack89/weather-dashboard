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
var deleteHistorical = document.querySelector("#deleteHhistory");
//Input
var cityInput = document.querySelector("#city");
// API Key
var weatherAPI = "7ec7b4300005c010153d043f44737174";
// Get today Info and format to display on the front end
var today = moment().format("MMM Do, YYYY");
// Variable that will be used to stoage what is inside of the local storage data
var citiesLocalSotage = [];


// *************************  Start Sectio of the functions *************************
// This function is used to create the butttons on the left
var createCityHistorical = function (city) {
    // Creating the elements that will show the historical data
    var buttonEl = document.createElement("button");
    // Set the classes to look nice and functional
    buttonEl.setAttribute(
        "class",
        "btn btn-block btn-lg w-100 bg-dark text-white my-2 capitalize"
    );
    // I set the attribute of data-value with the name of the city , this will be used for the historical list to bring that data
    buttonEl.setAttribute("data-value", city);
    buttonEl.textContent = city;
    // Append to the list
    listHistorical.appendChild(buttonEl);
};
// This function is to create the UVIndex
var UVIndex = function (ln, lt) {
    //I set the value of the API URL and I concatenate the longitude and latitude that I sent before and the API Key to get the data
    var uvqURL =
        "https://api.openweathermap.org/data/2.5/uvi?appid=" +
        weatherAPI +
        "&lat=" +
        lt +
        "&lon=" +
        ln;

    // I do the fecth
    fetch(uvqURL).then(function (response) {
        // I check if the API return the 200 status if not it means that there are no data 
        if (response.status == 200) {
            //if the API return 200 status I parse the information to json format
            response.json().then(function (data) {
                var uvIndexMetric, uvIndexMetricBackground, uvIndexMetricText;
                var uvIndexValue = data.value;
                // Here accroding to the WHO I set the values and colors depending on the UV data from the API
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
                // I append the value of the UV Index and I create the color background according to the scale of the WHO
                uvIndexMain.textContent = uvIndexValue;
                uvIndexMain.setAttribute(
                    "style",
                    "background-color:" +
                    uvIndexMetricBackground +
                    ";color:" +
                    uvIndexMetricText
                );
            });
        }
    });
};


var displayForecastWeather = function (ln, lt) {
    //I set the value of the API URL and I concatenate the longitude and latitude that I sent before and the API Key to get the data
    var apiForecastUrl =
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        lt +
        "&lon=" +
        ln +
        "&exclude=current&appid=" +
        weatherAPI;

    // I do the fecth
    fetch(apiForecastUrl).then(function (response) {
        // I check if the API return the 200 status if not it means that there are no data 
        if (response.status == 200) {
            //if the API return 200 status I parse the information to json format
            response.json().then(function (data) {
                //I clean the element that show the list of the 5 day-forecast
                forecastList.textContent = "";
                var dataDaily = data.daily;
                //Setting the array to 6 cause the first element is the current
                for (var i = 1; i < 6; i++) {
                    // I use moment to pase the UNIX data into a date date and I do some format 
                    var dateForecast = moment
                        .unix(dataDaily[i].dt)
                        .format("MMM Do, YYYY");
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
                    liDateEl.setAttribute(
                        "class",
                        "list-group-item border-0 bg-dark text-white size13 "
                    );
                    liImgEl.setAttribute(
                        "class",
                        "list-group-item border-0 bg-dark text-white size13"
                    );
                    liTempEl.setAttribute(
                        "class",
                        "list-group-item border-0 bg-dark text-white size13"
                    );
                    liWindEl.setAttribute(
                        "class",
                        "list-group-item border-0 bg-dark text-white size13"
                    );
                    liHumidityEl.setAttribute(
                        "class",
                        "list-group-item border-0 bg-dark text-white size13"
                    );
                    // Setting the values for the forecast
                    liDateEl.textContent = dateForecast;
                    // Get the icon and I concatenate the information into the URL so it can display the current weather
                    var weatherIcon = dataDaily[i].weather[0].icon;
                    var iconurl =
                        "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";
                    imgEl.setAttribute("src", iconurl);
                    imgEl.setAttribute("style", "width:50px;");
                    liTempEl.textContent = "Temp: " + dataDaily[i].temp.day + " °F";
                    //Display Wind speed and convert to MPH
                    var windSpeeds = dataDaily[i].wind_speed;
                    var windSpeedsMiles = (windSpeeds * 2.237).toFixed(1);
                    // Once that I get the value I set that into the list of the front end 
                    liWindEl.textContent = "Wind: " + windSpeedsMiles + " MPH";
                    liHumidityEl.textContent =
                        "Humidity: " + dataDaily[i].humidity + " %";
                    // Append the elements
                    liImgEl.appendChild(imgEl);
                    ulEl.append(liDateEl);
                    ulEl.append(liImgEl);
                    ulEl.append(liTempEl);
                    ulEl.append(liWindEl);
                    ulEl.append(liHumidityEl);
                    divCardEl.append(ulEl);
                    forecastList.appendChild(divCardEl);

                }
            });
        }
    });
};

// With this function I sent a request to the API of the weather to get the data
var getWeather = function () {
    //I get the value of the input
    var city = cityInput.value;
    //I set the value of the API URL and I concatenate the city and the API Key
    var apiUrl =
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&appid=" +
        weatherAPI;
    // I do the fecth
    fetch(apiUrl).then(function (response) {
        // I check if the API return the 200 status if not it means that there are no data 
        if (response.status == 200) {
            //if the API return 200 status I parse the information to json format
            response.json().then(function (data) {
                // I start to pass the information into the front-end elements 
                cityLabel.textContent = city.toUpperCase();
                cityDateLabel.textContent = "(" + today + ")";
                // Get the icon and I concatenate the information into the URL so it can display the current weather
                var weatherIcon = data.weather[0].icon;
                var iconurl =
                    "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";
                iconWeather.setAttribute("src", iconurl);
                //Display Wind speed and convert to MPH
                var windSpeeds = data.wind.speed;
                var windSpeedsMiles = (windSpeeds * 2.237).toFixed(1);
                windMain.textContent = windSpeedsMiles + " MPH";
                // Print the information of the temparature and the humidity to the front-end 
                tempMain.textContent = data.main.temp + " °F ";
                humidityMain.textContent = data.main.humidity + " %";
                // I call the function that display the UV index
                UVIndex(data.coord.lon, data.coord.lat);
                
                // I do a loop of the local Storage information so if it detects if break the loop and set a varaible to false  
                var checkCityLocalStorage = false;
                for (var it = 0; it < citiesLocalSotage.length; it++) {
                    if (citiesLocalSotage[it].toUpperCase() == city.toUpperCase()) {
                        checkCityLocalStorage = true;
                        break;
                    }
                }
                // If the variable that check if the city is on the local Storage is false I save it so it can be displayed as a button for an easy access
                if (!checkCityLocalStorage) {
                    // I call the function that create the button of the city
                    createCityHistorical(city);
                    citiesLocalSotage.push(city);
                    localStorage.setItem(
                        "weathercities",
                        JSON.stringify(citiesLocalSotage)
                    );
                }
                // I call to the function of the 5 day forecast using the Latitude and Longitude 
                displayForecastWeather(data.coord.lon, data.coord.lat);
            });
        } else {
            // Here I display an error so the user can know that the city that they enter didnt return weather data 
            alert("No information from the city " + city);
            // I do a clean up of the elements so it can start again
            tempMain.textContent = "";
            windMain.textContent = "";
            humidityMain.textContent = "";
            uvIndexMain.textContent = "";
            cityLabel.textContent = "";
            iconWeather.setAttribute("src", "");
            cityDateLabel.textContent = "";
            uvIndexMain.setAttribute("style", "background-color:transparent;");
        }
    });
};
// This function is when the user clicks on the historical list and I used to bring the data weather 
var getOldWeather = function (event) {
    // I check if the click was under a button on a part of the list if is on the button I get the value if the dataset 
    if (event.target.dataset.value) {
        cityInput.value = event.target.dataset.value;
        getWeather();
    }
};
// I clean the Local Storage
var cleanLStorage = function () {
    // Clean the varaible 
    citiesLocalSotage = [];
    // Clean the local Storage
    localStorage.setItem("weathercities", '');
    // Cleant the list of the front end 
    listHistorical.textContent = "";
    //Clear the input
    cityInput.value = "";
}

// This function is to initialize the variable that have the information of the local Storage and if are data can create the buttons
var initSystem = function () {
    // I pass what is inside of the local Storage 
    citiesLocalSotage = localStorage.getItem("weathercities");    
    if (citiesLocalSotage !== null) {
        //If exist I parse the elements in order to be array
        citiesLocalSotage = JSON.parse(localStorage.getItem("weathercities"));    
        // if is not null I do a loop to get the information of all the cities         
        for (i = 0; i < citiesLocalSotage.length; i++) {
            // I call the function that create the buttons
            createCityHistorical(citiesLocalSotage[i]);
        }
    } else {
        // if is null I declare the variable as null and as array
        citiesLocalSotage = [];
    }
};

// *************************  End Sectio of the functions *************************


// *************************   Sectio of the Event Listeners *************************
// I define the event listener that find the city weather
findCity.addEventListener("click", getWeather);
// I create a listener on the UL of the historical list so it can detect if the user click on a previous city and can get teh information
listHistorical.addEventListener("click", getOldWeather);
// This function is to clean the local Storage 
deleteHistorical.addEventListener("click", cleanLStorage);

// ************************* End  Sectio of the Event Listeners *************************


// call the funtion to get the data that is on the localStorage
initSystem();
