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
				function getDayName(unixTimestamp) {
					const days = [
						"Sunday",
						"Monday",
						"Tuesday",
						"Wednesday",
						"Thursday",
						"Friday",
						"Saturday",
					];
					const date = new Date(unixTimestamp * 1000);
					return days[date.getDay()];
				}

				let weatherIcon = $("<img>").attr(
					"src",
					`http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`
				);
				//?? Display current weather
				$("#today").html(`
				
				<div class="card">
        <div class="card-body">
            <h2>Welcome to ${data.name}!</h2>
			<h4 class="card-title">${getDayName(data.dt)} </h4>
            <h5 >${new Date(data.dt * 1000).toLocaleDateString()}</h5>
            
            <p>${weatherIcon[0].outerHTML}</p>
            <p class="highlight-text">The Temperature is: ${
							data.main.temp
						} °C</p>
            <p>The Humidity is: ${data.main.humidity}%</p>
            <p>The Wind Speed is: ${data.wind.speed} km/h</p>
        </div>
    </div>
                `);

				//?? Adds city to history if not already there
				if ($("#history").find(`button:contains('${cityName}')`).length === 0) {
					$("#history").append(
						`<button class="btn btn-primary btn-custom">${cityName}</button>`
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
				$("#forecast-text").text("5-Day Forecast:");

				function getDayName(dateStr) {
					const days = [
						"Sunday",
						"Monday",
						"Tuesday",
						"Wednesday",
						"Thursday",
						"Friday",
						"Saturday",
					];
					const date = new Date(dateStr);
					return days[date.getDay()];
				}
				//?? Making sure the 5-Day Forecast doesnt start at current date
				const today = new Date();
				let startIndex = data.list.findIndex(
					(slot) => new Date(slot.dt_txt).getDate() !== today.getDate()
				);

				startIndex = startIndex === -1 ? 0 : startIndex;

				//?? Loop for forecast in 8 interval to get daily approx cause it its a forecast
				for (let i = startIndex; i < data.list.length; i += 8) {
					const day = data.list[i];
					let forecastIcon = $("<img>").attr(
						"src",
						`http://openweathermap.org/img/w/${day.weather[0].icon}.png`
					);
					$("#forecast").append(`
                <div class="forecast-col col-12">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${getDayName(
															day.dt_txt
														)}</h5>
                            <h6>${new Date(
															day.dt_txt
														).toLocaleDateString()}</h6>
                            <p class='forecast-p'>${
															forecastIcon[0].outerHTML
														}</p>
                            <p class='forecast-p'>Temp: ${day.main.temp} °C</p>
                            <p class='forecast-p'>Humidity: ${
															day.main.humidity
														}%</p>
                            <p class='forecast-p'>Wind Speed: ${
															day.wind.speed
														} km/h</p>
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
			`<button class="btn btn-primary  btn-custom">${city}</button>`
		);
	});
});
