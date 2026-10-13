//the main file to run the app

import { initMap } from './map.js';
import * as ui from './ui.js'; 
import { $ } from './helpers.js';
import { geocode, getWeather } from './api.js';


const form = $('#search-form');
const input = $('#city');


initMap('map');
ui.initKeyDialog();

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  try {
    const place = await geocode(text);
    const weather = await getWeather(place.lat, place.lon);
    console.log(place, weather);
  } catch (error) { console.error(error); }
});

