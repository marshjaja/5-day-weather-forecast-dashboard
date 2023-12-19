$(document).ready(function () {
	//?? Display a dummy card for #forecast section to start
	$("#today").html(`
        <div class="card before-today">
            <div class="card-body">
			<h1>Welcome to Our Weather Explorer!</h1>
			<p>Get started by searching for any city to see the current weather conditions and a 5-day forecast. </p>
			<p>Discover the weather trends and plan your days better!</p>
			
               
            </div>
        </div>
    `);

	const APIKey = "32cc7390332ed9b5800335391e652255";

	//?? Function updates the weather dashboard with current and forecast data
	function updateWeather(cityName) {
		$("#search-input").val("");
		if (!cityName) {
			Swal.fire({
				title: "City name not found",
				text: "Please enter a valid city name",
				icon: "error",
			});
			return;
		}

		let queryURLCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${APIKey}&units=metric`;
		let queryURLForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${APIKey}&units=metric`;

		//?? Fetch current weather data from api
		fetch(queryURLCurrent)
			.then((response) => response.json())
			.then((data) => {
				let weatherIcon = $("<img>").attr(
					"src",
					`http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`
				);
				//?? Display current weather
				$("#today").html(`
				<div class="card">
    <div class="card-body">
                    <h2>Welcome to ${
											data.name
										}! (${new Date().toLocaleDateString()})</h2>
					<p>${weatherIcon[0].outerHTML}</p>
                    <p>The Temperature is: ${data.main.temp} °C</p>
                    <p>The Humidity is: ${data.main.humidity}%</p>
                    <p>The Wind Speed is: ${data.wind.speed} km/h</p>
					</div>
                    </div>
                `);

				//?? Adds city to history if not already there
				if ($("#history").find(`button:contains('${cityName}')`).length === 0) {
					$("#history").append(
						`<button class="list-group-item list-group-item-action">${cityName}</button>`
					);
					//?? Store in localStorage
					let history = JSON.parse(
						localStorage.getItem("weatherHistory") || "[]"
					);
					history.push(cityName);
					localStorage.setItem("weatherHistory", JSON.stringify(history));
				}
			})
			.catch((error) => {
				console.error("Error:", error);
				//?? Custom error with sweet alert
				Swal.fire({
					title: "City name not found",
					text: "Please enter a valid city name",
					icon: "error",
				});
			});

		//?? Fetch 5-day forecast data
		fetch(queryURLForecast)
			.then((response) => response.json())
			.then((data) => {
				//?? Clear previous forecast data
				$("#forecast").empty();
				for (let i = 0; i < data.list.length; i += 8) {
					//?? Loop for forecast in 8 interval to get daily approx cause it its a forecast
					const day = data.list[i];
					let forecastIcon = $("<img>").attr(
						"src",
						`http://openweathermap.org/img/w/${day.weather[0].icon}.png`
					);
					$("#forecast").append(`
					<div class="forecast-col col-12"> <!-- Adjusted classes for responsiveness -->
					<div class="card">
						<div class="card-body">
							<h5 class="card-title">${new Date(day.dt_txt).toLocaleDateString()}</h5>
							<p>${forecastIcon[0].outerHTML}</p>
							<p>Temp: ${day.main.temp} °C</p>
							<p>Humidity: ${day.main.humidity}%</p>
							<p>Wind Speed: ${day.wind.speed} km/h</p>
						</div>
					</div>
				</div>
				
            		`);
				}
			})
			.catch((error) => {
				//?? Custom error with sweet alert
				console.error("Error:", error);
				Swal.fire({
					title: "City name not found",
					text: "Please enter a valid city name",
					icon: "error",
				});
			});
	}

	//?? Search button on click and retrieves the weather data
	$("#search-button").click(function () {
		let cityName = $("#search-input").val().trim();
		if (cityName) {
			updateWeather(cityName);
		}
	});

	//?? Enter press triggers on click and retrieves the weather data
	$("#search-input").keypress(function (e) {
		if (e.which == 13) {
			// Enter key has a keycode of 13
			e.preventDefault();
			$("#search-button").click();
		}
	});

	//?? History items on click even
	$("#history").on("click", "button", function () {
		updateWeather($(this).text());
	});

	//?? LocalStorage history load
	let storedHistory = JSON.parse(
		localStorage.getItem("weatherHistory") || "[]"
	);
	storedHistory.forEach((city) => {
		$("#history").append(
			`<button class="list-group-item list-group-item-action">${city}</button>`
		);
	});
});
