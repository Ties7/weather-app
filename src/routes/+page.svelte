<script>
  const apiKey = import.meta.env.PUBLIC_WEATHER_API_KEY;
  
  let city = '';
  let weather = null;
  let error = '';
  
  async function searchWeather() {
    // Reset data, zodat bij onbekende stad die data weg word gehaald
    weather = null;
    error = '';
    
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    
    try { //probeer dit
      const response = await fetch(url);
      const data = await response.json();
      
      // Check of api een error teruggaf
      if (data.cod === '404') {
        error = 'Stad niet gevonden!';
        return;
      }

      weather = {
        city: data.name,
        temp: Math.round(data.main.temp),
        description: data.weather[0].description,
        icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
        humidity: data.main.humidity,
        wind: Math.round(data.wind.speed * 3.6)
      };
      
    } catch (e) { //en doe dit als er een error is
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