<script>
  const apiKey = import.meta.env.PUBLIC_WEATHER_API_KEY;
  
  let weatherData = null;
  
  async function testAPI() {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=Amsterdam&appid=${apiKey}&units=metric`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    weatherData = data;
    console.log('Weather data:', data);
  }
</script>

<h1>Weather App</h1>

<button on:click={testAPI}>
  Test API
</button>

{#if weatherData}
  <p>Stad: {weatherData.name}</p>
  <p>Temperatuur: {weatherData.main.temp}°C</p>
{/if}