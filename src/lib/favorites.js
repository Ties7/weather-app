import { writable, derived } from 'svelte/store';

export const favorites = writable([]);

export function loadFavorites() {
  if (typeof localStorage === 'undefined') return;
  const opgeslagen = localStorage.getItem('favorites');
  if (opgeslagen) {
    favorites.set(JSON.parse(opgeslagen)); //string naar array
  }
}

export function addFavorite(city) {
  favorites.update(lijst => {
    if (lijst.includes(city)) return lijst;
    const nieuweLijst = [...lijst, city];
    localStorage.setItem('favorites', JSON.stringify(nieuweLijst)); //array naar string
    return nieuweLijst;
  });
}

export function removeFavorite(city) {
  favorites.update(lijst => {
    const nieuweLijst = lijst.filter(stad => stad !== city);
    localStorage.setItem('favorites', JSON.stringify(nieuweLijst));
    return nieuweLijst;
  });
}