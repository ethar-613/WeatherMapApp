// this is a local storage to store api key that come from the user on it 

//this for api key to store it in session Storage only, so it only for this browser tap/session
export const getApiKey = () => sessionStorage.getItem('wm_api_key') || '';
export const saveApiKey = (key) => sessionStorage.setItem('wm_api_key', key);
export const clearApiKey = () => sessionStorage.removeItem('wm_api_key');

// _________________________________________________________________________________________
// reading saved value, or return a default if nothing saved here
function load(key, defaultValue) {
  try {
    return JSON.parse(localStorage.getItem(key)) || defaultValue;
  } catch {
    return defaultValue;
  }
}
// to save value
function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.log('Could not save data in this browser.');
  }
}

// to know if two places are the same city if they have the same coordinates
const sameCity = (a, b) => a.lat === b.lat && a.lon === b.lon;


// _________________________________________________________________________________________
// Favorites section

export const getFavorites = () => load('wm_favorites', []);
export const isFavorite = (place) => getFavorites().some((fav) => sameCity(fav, place));

//add the city if it is not saved before, remove it if it is in. returns true if it is saved now
export function toggleFavorite(place) {
  const favorites = getFavorites();
  if (isFavorite(place)) {
    save('wm_favorites', favorites.filter((fav) => !sameCity(fav, place)));
    return false;
  }
  favorites.push(place);
  save('wm_favorites', favorites);
  return true;
}
