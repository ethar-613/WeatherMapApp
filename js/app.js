//the main file to run the app

import { initMap, showPlace  } from './map.js';
import * as ui from './ui.js'; 
import { $, placeLabel } from './helpers.js';
import * as store from './storage.js';
import { geocode, getWeather } from './api.js';
import { shareOnFacebook, copyWeatherText } from './share.js';





const form = $('#search-form');
const input = $('#city');

let loading = false;

initMap('map');
ui.initKeyDialog();

// Run the search for city
async function run(getPlace) {
  if (loading) return;

  if (!store.getApiKey()) {
    ui.showError('Please add your OpenWeatherMap API key first (click "API key setup").');
    ui.openKeyDialog();
    return;
  }

  loading = true;
  ui.clearError();
  ui.showLoading(true);

  try {
    const place = await getPlace();                            // finds the coordinates, gives the place info [name, lat, lon]
    const weather = await getWeather(place.lat, place.lon);    // get current weather
    const popup = ui.buildPopup(place, weather, {
      onShare: () => shareOnFacebook(place, weather),
      onCopy: () => copyWeatherText(place, weather),
    });
    showPlace(place, popup);
    input.value = placeLabel(place);

  } catch (error) {
    ui.showError(error.message); // showing the problem in an error card
  } finally {
    loading = false;
    ui.showLoading(false);
  }
}

// event listener for get weather button to get the weather for the city 
form.addEventListener('submit', (event) => {
  event.preventDefault(); // stop the page from reloading
  const text = input.value.trim();
  if (text === '') {
    ui.showError('Please type a city name first.');
    return;
  }
  run(() => geocode(text));
});
