<script>
  const apiKey = import.meta.env.PUBLIC_WEATHER_API_KEY;
  
  let city = '';
  let weatherData = null;
  
  async function searchWeather() {
    // Check of er iets is ingevuld
    if (city === '') {
      alert('Typ eerst een stad!');
      return;
    }
    
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    weatherData = data;
    console.log('Weather data:', data);
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

{#if weatherData}
  <p>Stad: {weatherData.name}</p>
  <p>Temperatuur: {weatherData.main.temp}°C</p>
{/if}