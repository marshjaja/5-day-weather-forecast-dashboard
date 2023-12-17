let searchBtn = $("#search-button");
let forecastDetails = $("#forecast");
let todaysDetails = $("#today");
let mainCard = $(".card-body");
let APIKey = "32cc7390332ed9b5800335391e652255";
let queryURL = "";
let allWeatherData = $("#weather-data");

const getWeather = () => {
	let newName = $("#search-input").val();
	let cityName = $("#weather-search");
	newName = capitalizeFirstLetter(newName);

	cityName.text(newName);
	queryURL =
		"https://api.openweathermap.org/data/2.5/forecast?q=" +
		newName +
		"&units=metric&cnt=5&appid=" +
		APIKey;
};

const capitalizeFirstLetter = (str) => {
	return str.charAt(0).toUpperCase() + str.slice(1);
};

const displayError = (message) => {
	Swal.fire({
		title: "City name not found",
		text: "Please Enter A Valid City Name",
		icon: "error",
	});
	$("#search-input").val("");
};

function updateMainCard(data) {
	// Create a new card
	let mainCard = $("<div>").addClass("card mb-3 outer-card");
	let cardRow = $("<div>").addClass("row g-0 ").attr("id", "main-card");
	let cardBodyCol = $("<div>").addClass("col-md-8");
	let cardBody = $("<div>").addClass("card-body card-main");
	let cardIconCol = $("<div>").addClass("col-md-4 ");

	//?? MAIN CARD CITY
	let city = $("#search-input").val();
	$("#search-input").val("");
	let displayCity = $("<h3>").text("Welcome to " + capitalizeFirstLetter(city));
	displayCity.attr("class", "card-city");
	cardBody.append(displayCity);

	//?? MAIN CARD DATE
	let startDate = dayjs();
	let currentDate = startDate;
	let formattedDate = currentDate.format("DD-MM-YYYY");
	let dateElement = $("<p>").html(
		"(" + "<strong>" + formattedDate + "</strong>" + ")"
	);
	cardBody.append(dateElement);

	//?? MAIN CARD TEMP
	let daysTemp = data.list[0].main.temp;
	let displayTemp = $("<p>").text("The temperature is: " + daysTemp + " °C");
	cardBody.append(displayTemp);

	//?? MAIN CARD WIND SPEED
	let daysWind = data.list[0].wind.speed;
	let displayWind = $("<p>").text("Winds of " + daysWind + " km/h");
	cardBody.append(displayWind);

	//?? MAIN CARD HUMIDITY
	let daysHumidity = data.list[0].main.humidity;
	let displayHumidity = $("<p>").text("The humidity is: " + daysHumidity + "%");
	cardBody.append(displayHumidity);
	cardBodyCol.append(cardBody);

	//?? MAIN CARD ICON
	let cardImg = $("<img>").addClass("weatherIcon").attr("id", "card-img");
	let daysIcon = data.list[0].weather[0].icon;
	let iconURL = "https://openweathermap.org/img/wn/" + daysIcon + "@4x.png";
	cardImg.attr("src", iconURL);

	cardIconCol.append(cardImg);
	cardRow.append(cardBodyCol, cardIconCol);
	mainCard.append(cardRow);
	todaysDetails.append(mainCard);
}

searchBtn.on("click", function (event) {
	event.preventDefault();
	todaysDetails.empty();
	forecastDetails.empty();
	getWeather();

	fetch(queryURL)
		.then(function (response) {
			if (!response.ok) {
				throw new Error("City not found");
			}
			return response.json();
		})
		.then(function (data) {
			console.log(data);
			updateMainCard(data);

			function getTemp() {
				let forecastContainer = $("<div>").addClass(
					"row g-2 justify-content-center"
				);

				for (let i = 0; i < 5; i++) {
					// Create a new card for each day
					let newCard = $("<div>").addClass("col-md mb-2").addClass("col-8");
					let cardBody = $("<div>").addClass("card-body card-forecast");
					let cardImg = $("<img>").addClass("card-img-top");

					//?? FORECAST ICON
					let daysIcon = data.list[i].weather[0].icon;
					let iconURL =
						"https://openweathermap.org/img/wn/" + daysIcon + "@4x.png";
					cardImg.attr("src", iconURL);

					//?? FORECAST DATE
					let startDate = dayjs();
					let currentDate = startDate.add(i, "day");
					let formattedDate = currentDate.format("DD-MM-YYYY");
					let dateElement = $("<p>").html(
						"(" + "<strong>" + formattedDate + "</strong>" + ")"
					);

					//?? FORECAST TEMP
					let tempData = data.list[i].main.temp;
					let dayTemp = $("<p>").text("Temperature: " + tempData + " °C");

					//?? FORECAST WIND
					let daysWind = data.list[i].wind.speed;
					let displayWind = $("<p>").text("Winds of " + daysWind + " km/h");

					//?? FORECAST HUMIDITY
					let daysHumidity = data.list[i].main.humidity;
					let displayHumidity = $("<p>").text(
						"The humidity is: " + daysHumidity + "%"
					);

					cardBody.append(
						cardImg,
						dateElement,
						dayTemp,
						displayHumidity,
						displayWind
					);
					newCard.append(cardBody);

					forecastContainer.append(newCard);
				}

				forecastDetails.append(forecastContainer);
			}

			getTemp();
			todaysDetails.css("display", "block");
			forecastDetails.css("display", "flex");
			$("#placeholder-wrapper").css("display", "none");
		})
		.catch(function (error) {
			console.error(error.message);
			displayError("City not found. Please enter a valid city name.");
		});
});

// class="list-group" id="history"
