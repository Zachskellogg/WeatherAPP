    // jQuery
$(document).ready(function() {
    let cityInput = "";
    $("#search-button").on("click", function() {
        cityInput = $("#city-input").val();
        weatherSearch(cityInput);
        $("#city-input").val("");
    });

    let apiKey = "4e4acf6e468916faadd94e7b38023d34";
    function weatherSearch(cityInput) {
        let queryURL = ("https://api.openweathermap.org/data/2.5/weather?q=" + cityInput + "&appid=" + apiKey + "&units=imperial");
        $.ajax({
            url: queryURL,
            method: "GET",
            dataType: "json"
        }).then(function(response) {
            if (history.indexOf(cityInput) === -1) {
                history.push(cityInput);
                localStorage.setItem("history", JSON.stringify(history));
                popButtons(cityInput);
            }


            let lat = response.coord.lat;
            let lon = response.coord.lon;
            let forecastURL = ("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=imperial");
            $.ajax({
                url: forecastURL,
                method: "GET",
                dataType: "json"
            }).then(function(response) {
                console.log(response);
                console.log(response.current.uvi);

                let indexUV = response.current.uvi;
                uvIndex(indexUV, card);
                $("#forecast-container").html("");
                 for (let i = 1; i < 6; i++) {
                    let forecastCardDeck = $("<div>").addClass("card-deck");
                    let forecastCard = $("<div>").addClass("card h-100 bg-primary text-white mr-4");
                    let forecastImage = $("<img>").attr("src", "http://openweathermap.org/img/w/" + response.daily[i].weather[0].icon + ".png").addClass("card-img-top");

                    forecastImage.css("height", "150px");
                    forecastImage.css("width", "150px");
                    let forecastCardBody = $("<br></br><div>").addClass("card-body");
                    let forecastCardTitle = $("<h5>").addClass("card-title");
                    let forecastWind = $("<p>").addClass("card-text").text("Wind Speed: " + response.daily[i].wind_speed + " MPH");
                    let forecastHumidity = $("<p>").addClass("card-text").text("Humidity: " + response.daily[i].humidity + "%");
                    let forecastTemperature = $("<p>").addClass("card-text").text("Temperature: " + response.daily[i].temp.day + "°");
                    forecastCardBody.append(forecastWind, forecastHumidity, forecastTemperature);
                    forecastCard.append(forecastImage, forecastCardTitle, forecastCardBody);
                    forecastCardDeck.append(forecastCard);
                    $("#forecast-container").append(forecastCardDeck);    
                }

            });

            // console.log(response);

            $("#main-card").empty();
            let cardBody = $("<div>").addClass("card-body");
            let title = $("<h3>").addClass("card-title").text(response.name + " (" + new Date().toLocaleDateString() + ") ");
            let card = $("<div>").addClass("card");
            let wind = $("<p>").addClass("card-text").text("Wind Speed: " + response.wind.speed + " MPH");
            let humidity = $("<p>").addClass("card-text").text("Humidity: " + response.main.humidity + "%");
            let temperature = $("<p>").addClass("card-text").text("Temperature: " + response.main.temp + "°");
            let img = $("<img>").attr("src", "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png");
            title.append(img);
            cardBody.append(title, temperature, humidity, wind);
            card.append(cardBody);
            $("#main-card").append(card);
        });

    }

    function popButtons(text) {

        var button = $("<button>").addClass("btn btn-primary history").text(text);

        $("#city-weather-buttons").append(button);


    }

    let history = JSON.parse(window.localStorage.getItem("history")) || [];
    if (history.length > 0) {
        weatherSearch(history[history.length-1]);
    }

    for ( let i = 0; i < history.length; i++) {
        popButtons(history[i]);
    }
    
    $(".history").on("click", function() {
        weatherSearch($(this).text());
    });


    function uvIndex(indexUV, card) {
        let uvButton = $("<button>").addClass("card-text btn").text(indexUV);
        uvButton.attr("id", "ultra-violet-index");
        let uvLabel = $("<label>").addClass("card-text").attr("for", "ultra-violet-index").text("UV Index: ");
        if (indexUV < 2) {
            uvButton.addClass("btn-success");
        }
        else if (indexUV < 5) {
            uvButton.addClass("btn-warning");
        }
        else {
            uvButton.addClass("btn-danger");
        }
        card.append(uvLabel, uvButton);

    }


});