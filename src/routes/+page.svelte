<script>
  import { enhance } from '$app/forms';
  import { onMount, tick } from 'svelte';
  import {
    favorites,
    loadFavorites,
    addFavorite,
    removeFavorite,
  } from '$lib/favorites.js';

  export let form;

  let loading = false;
  let selectedCity = '';
  let filterQuery = '';

  $: gefilterdeSteden = $favorites.filter(fav =>
    fav.toLowerCase().includes(filterQuery.toLowerCase())
  );

  onMount(() => {
    loadFavorites();
  });

  $: weather = form?.weather ?? null;
  $: forecast = form?.forecast ?? null;
  $: error = form?.error ?? null;

  async function SearchFavoriteCity(stad) {
    selectedCity = stad;
    await tick();
    document.getElementById('weather-form').requestSubmit();
  }
</script>

<main class="app">
  <h1>WEATHERRR</h1>

  <form
    id="weather-form"
    method="POST"
    action="?/search"
    use:enhance={() => {
      loading = true;
      return async ({ update }) => {
        await update();
        loading = false;
      };
    }}
  >
    <label for="city-input" class="visually-hidden">Zoek een stad</label>
    <input
      id="city-input"
      type="text"
      name="city"
      bind:value={selectedCity}
      placeholder="Zoek een stad..."
    />
    <button type="submit">
      {#if loading}
        <span>⏳</span>
      {:else}
        <span>🔍</span>
      {/if}
    </button>
  </form>

  <!-- Favorieten -->
{#if $favorites.length}
    <input bind:value={filterQuery} placeholder="Filter favorieten..." class="filter-input" />
    <nav>
      <ul class="favorites-list">
        {#each gefilterdeSteden as fav (fav)}
          <li>
            <button class="favorite-chip" on:click={() => SearchFavoriteCity(fav)}>
              {fav}
            </button>
            <button class="remove-btn" on:click={() => removeFavorite(fav)}>
              <span>×</span>
            </button>
          </li>
        {/each}
      </ul>
    </nav>
  {/if}

  <!-- Foutmelding -->
  {#if error}
    <p id="search-error" class="error">{error}</p>
  {/if}

  <!-- Huidig weer -->
  {#if weather}
    <section class="current-weather">
      <header class="city-header">
        <h2>{weather.city}</h2>
        <button class="star" on:click={() => addFavorite(weather.city)}>
          <span>{$favorites.includes(weather.city) ? '★' : '☆'}</span>
        </button>
      </header>

      <p class="temperature">
        {weather.temp}°
      </p>

      <img
        src="https://openweathermap.org/img/wn/{weather.icon}@2x.png"
        alt="{weather.description} in {weather.city}"
        width="80"
        height="80"
      />

      <p class="description">{weather.description}</p>

      <dl class="details-grid">
        <div class="detail-card">
          <dt class="detail-label">Luchtvochtigheid</dt>
          <dd class="detail-value">{weather.humidity}%</dd>
        </div>
        <div class="detail-card">
          <dt class="detail-label">Windsnelheid</dt>
          <dd class="detail-value">{weather.wind} km/u</dd>
        </div>
      </dl>
    </section>
  {/if}

  {#if forecast}
    <section>
      <h3 class="visually-hidden">5-daagse verwachting</h3>
      <ol class="forecast-grid">
        {#each forecast as day (day.label)}
          <li class="forecast-day">
            <p class="forecast-temp">{day.temp}°C</p>
            <img
              src="https://openweathermap.org/img/wn/{day.icon}@2x.png"
              alt={day.description}
              width="50"
              height="50"
            />
            <p class="forecast-date">{day.label}</p>
          </li>
        {/each}
      </ol>
    </section>
  {/if}
</main>

<style>
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    white-space: nowrap;
    border: 0;
  }

  :global(body) {
    margin: 0;
    padding: 0;
    background: #000;
    color: #fff;
    font-family: sans-serif;
  }

  .app {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  h1 {
    font-size: 3rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-align: center;
    margin: 2rem 0;
  }

  form {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  input {
    flex: 1;
    padding: 1rem 1.5rem;
    font-size: 1.1rem;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 50px;
    color: #fff;
    outline: none;
  }

  input::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  input:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 2px;
  }

  form button[type='submit'] {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 50%;
    color: #fff;
    width: 3.2rem;
    height: 3.2rem;
    font-size: 1.2rem;
    cursor: pointer;
    flex-shrink: 0;
    transition: background 0.2s;
  }

  form button[type='submit']:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  form button[type='submit']:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 2px;
  }

  /* Favorieten */
  nav {
    margin-bottom: 2rem;
  }

  .favorites-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .favorites-list li {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    overflow: hidden;
  }

  .favorite-chip {
    background: none;
    border: none;
    color: #fff;
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
    cursor: pointer;
  }

  .favorites-list li:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  .remove-btn {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.7);
    padding: 0.5rem 0.6rem 0.5rem 0;
    font-size: 1.3rem;
    line-height: 1;
    cursor: pointer;
  }

  .remove-btn:hover {
    color: #fff;
  }

  .favorite-chip:focus-visible,
  .remove-btn:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 2px;
  }

  .error {
    color: #ff4444;
    text-align: center;
    padding: 1rem;
  }

  /* Huidig weer */
  .current-weather {
    text-align: center;
    padding: 2rem 0;
  }

  .city-header {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .city-header h2 {
    font-size: 2.5rem;
    font-weight: 300;
    margin: 0;
  }

  .star {
    background: none;
    border: none;
    color: #fff;
    font-size: 2rem;
    cursor: pointer;
    padding: 0;
    line-height: 1;
  }

  .star:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 2px;
    border-radius: 4px;
  }

  .temperature {
    font-size: 8rem;
    font-weight: 200;
    margin: 1rem 0;
    line-height: 1;
  }

  .description {
    font-size: 1.5rem;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 2rem;
    text-transform: lowercase;
  }

  /* dl/dt/dd grid */
  .details-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin: 2rem 0;
  }

  .detail-card {
    background: rgba(255, 255, 255, 0.05);
    padding: 2rem 1rem;
    border-radius: 20px;
  }

  .detail-label {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.6);
    margin: 0 0 0.5rem;
  }

  .detail-value {
    font-size: 2rem;
    font-weight: 300;
    margin: 0;
  }

  /* Forecast */
  .forecast-grid {
    list-style: none;
    padding: 0;
    margin: 3rem 0 0;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 0.5rem;
  }

  .forecast-day {
    text-align: center;
  }

  .forecast-temp {
    font-size: 1rem;
    margin: 0.5rem 0;
  }

  .forecast-date {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.6);
    text-transform: uppercase;
    margin: 0.5rem 0;
  }

  .filter-input {
    width: 100%;
    box-sizing: border-box;
    margin-bottom: 1rem;
  }

  /* Responsive */
  @media (max-width: 600px) {
    h1 {
      font-size: 2rem;
    }

    .temperature {
      font-size: 5rem;
    }

    .forecast-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
</style>