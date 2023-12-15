let searchBtn = $("#search-button");

let APIKey = "32cc7390332ed9b5800335391e652255";
let queryURL = "";

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
			console.log(queryURL);
			console.log(data);
		});
});
