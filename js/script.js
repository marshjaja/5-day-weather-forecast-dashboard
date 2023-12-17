let searchBtn = $("#search-button");
let forecastDetails = $("#forecast");
let todaysDetails = $("#today");
let APIKey = "32cc7390332ed9b5800335391e652255";
let queryURL = "";
let allWeatherData = $("#weather-data");

const getWeather = () => {
	let newName = $("#search-input").val();
	let cityName = $("#weather-search");
	cityName.text(newName);
	queryURL =
		"https://api.openweathermap.org/data/2.5/forecast?q=" +
		newName +
		"&units=metric&cnt=5&appid=" +
		APIKey;
};

searchBtn.on("click", function (event) {
	event.preventDefault();
	getWeather();

	fetch(queryURL)
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			console.log(data);
			// console.log(data.list[0].wind.speed);
			// console.log(data.list[0].main.humidity);
			// console.log(data.list[0].weather[0].icon);

			//?? CITY
			let city = $("#search-input").val();
			$("#search-input").val("");
			let displayCity = $("<h3>").text("Welcome to " + city);
			displayCity.attr("class", "card-city");
			todaysDetails.find("#card-city").text(city);

			//?? DAYs ICON
			let daysIcon = data.list[0].weather[0].icon;
			let displayIcon = $("<img>");
			displayIcon.attr(
				"src",
				"https://openweathermap.org/img/wn/" + daysIcon + "@4x.png"
			);
			todaysDetails.find("#card-img").attr("src", displayIcon.attr("src"));

			//?? DATE
			let startDate = dayjs();
			let currentDate = startDate;
			let formattedDate = currentDate.format("DD-MM-YYYY");
			let dateElement = $("<p>").html(
				"(" + "<strong>" + formattedDate + "</strong>" + ")"
			);
			todaysDetails.find("#card-date").append(dateElement);

			//?? TEMP
			let daysTemp = data.list[0].main.temp;
			let displayTemp = $("<p>").text(
				"The temperature is: " + daysTemp + " °C"
			);
			todaysDetails.find("#card-temp").append(displayTemp);

			//? WIND SPEED
			let daysWind = data.list[0].wind.speed;
			displayWind = $("<p>").text("Winds of " + daysWind + " km/h");
			todaysDetails.find("#card-wind").append(displayWind);

			//?? HUMIDITY
			let daysHumidity = data.list[0].main.humidity;
			let displayHumidity = $("<p>").text(
				"The humidity is: " + daysHumidity + "%"
			);
			todaysDetails.find("#card-humidity").append(displayHumidity);
		});
});
