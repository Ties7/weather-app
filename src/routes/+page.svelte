<script>
  const apiKey = import.meta.env.PUBLIC_WEATHER_API_KEY;
  
  let city = '';
  let weather = null;
  let forecast = null;
  let error = '';
  
  async function searchWeather() {
    // Stop als input leeg is
    if (city === '') return;

    // Reset data, zodat bij onbekende stad de oude data weg word gehaald
    weather = null;
    forecast = null;
    error = '';
    
      try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
      const response = await fetch(url);
      const data = await response.json();
      
      // Check of stad bestaat
      if (data.cod === '404') {
        error = 'Stad niet gevonden!';
        return;
      }
      
      // Sla huidig weer op
      weather = {
        city: data.name,
        temp: Math.round(data.main.temp),
        description: data.weather[0].description,
        icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
        humidity: data.main.humidity,
        wind: Math.round(data.wind.speed * 3.6)
      };

      // ---- 2E API CALL: 5-daagse forecast ----
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
      const forecastResponse = await fetch(forecastUrl);
      const forecastData = await forecastResponse.json();

      const allItems = forecastData.list;

      forecast = [
        { date: 'Dag 1', temp: Math.round(allItems[0].main.temp), icon: `https://openweathermap.org/img/wn/${allItems[0].weather[0].icon}@2x.png`, description: allItems[0].weather[0].description },
        { date: 'Dag 2', temp: Math.round(allItems[8].main.temp), icon: `https://openweathermap.org/img/wn/${allItems[8].weather[0].icon}@2x.png`, description: allItems[8].weather[0].description },
        { date: 'Dag 3', temp: Math.round(allItems[16].main.temp), icon: `https://openweathermap.org/img/wn/${allItems[16].weather[0].icon}@2x.png`, description: allItems[16].weather[0].description },
        { date: 'Dag 4', temp: Math.round(allItems[24].main.temp), icon: `https://openweathermap.org/img/wn/${allItems[24].weather[0].icon}@2x.png`, description: allItems[24].weather[0].description },
        { date: 'Dag 5', temp: Math.round(allItems[32].main.temp), icon: `https://openweathermap.org/img/wn/${allItems[32].weather[0].icon}@2x.png`, description: allItems[32].weather[0].description },
      ];

    } catch (e) {
      // Als er iets misgaat (geen internet, API down, etc.)
      error = 'Er ging iets mis!';
    }
  }
</script>

<h1>Weather App</h1>

<form on:submit|preventDefault={searchWeather}>
  <input type="text" bind:value={city} placeholder="Type een stad..."/>
  <button type="submit">Zoek</button>
</form>

{#if error}
  <p class="error-text">{error}</p>
{/if}

{#if weather}
  <p>{weather.city}</p>
  <img src={weather.icon} alt={weather.description} />
  <p>{weather.temp}°C</p>
  <p>{weather.description}</p>
  <p>💧 {weather.humidity}%</p>
  <p>💨 {weather.wind} km/u</p>
{/if}

<style>
  .error-text {
    color: red;
  }
</style>