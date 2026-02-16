<script>
  const apiKey = import.meta.env.PUBLIC_WEATHER_API_KEY;
  
  let city = '';
  let weatherData = null;
  let error = '';
  
  async function searchWeather() {
    if (city === '') {
      alert('Typ eerst een stad!');
      return;
    }
    
    // Reset oude data
    weatherData = null;
    error = '';
    
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      // Check of API een error teruggaf
      if (data.cod === '404') {
        error = 'Stad niet gevonden!';
      } else {
        weatherData = data;
      }
      
    } catch (e) {
      error = 'Er ging iets mis!';
    }
  }
</script>

<h1>Weather App</h1>

<input 
  type="text" 
  bind:value={city}
  placeholder="Type een stad..."
/>

<button on:click={searchWeather}>
  Zoek Weer
</button>

{#if error}
  <p style="color: red;">{error}</p>
{/if}

{#if weatherData}
  <p>Stad: {weatherData.name}</p>
  <p>Temperatuur: {weatherData.main.temp}°C</p>
{/if}