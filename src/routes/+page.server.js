import { WEATHER_API_KEY } from '$env/static/private';
import { fail } from '@sveltejs/kit';

export const actions = {
  search: async ({ request }) => {
    const data = await request.formData();
    const city = data.get('city');

    if (!city) {
      return fail(400, { error: 'Vul een stad in.' });
    }

    try {
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${(city)}&appid=${WEATHER_API_KEY}&units=metric`
      );
      const weatherData = await weatherResponse.json();

      if (weatherData.cod === '404') {
        return fail(404, { error: 'Stad niet gevonden.' });
      }

      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${(city)}&appid=${WEATHER_API_KEY}&units=metric`
      );
      const forecastData = await forecastResponse.json();

      const items = forecastData.list;
      const forecast = [0, 8, 16, 24, 32].map((index, i) => ({
        label: `Dag ${i + 1}`,
        temp: Math.round(items[index].main.temp),
        icon: items[index].weather[0].icon,
        description: items[index].weather[0].description,
      }));

      return {
        weather: {
          city: weatherData.name,
          temp: Math.round(weatherData.main.temp),
          description: weatherData.weather[0].description,
          icon: weatherData.weather[0].icon,
          humidity: weatherData.main.humidity,
          wind: Math.round(weatherData.wind.speed * 3.6),
        },
        forecast,
      };
    } catch {
      return fail(500, { error: 'Er ging iets mis.' });
    }
  },
};