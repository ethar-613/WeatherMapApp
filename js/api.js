// Requests to the OpenWeatherMap API here

import { getApiKey } from './storage.js';

const BASE = 'https://api.openweathermap.org';



// Send request and return the json data
// and if something gone wrong, throw Error with a friendly message to the user
async function request(path) {
  let response;
  try {
    response = await fetch(`${BASE}${path}&appid=${encodeURIComponent(getApiKey())}`);
  } catch {
    throw new Error('No internet connection :( Please check your network and try again.');
  }

  if (response.status === 401) throw new Error('Your API key is not valid. check it in "API key setup". [note: new keys can take a few hours to start working]');
  if (response.status === 404) throw new Error('sorry, no weather data was found for this place.');
  if (response.status === 429) throw new Error('sorry, too many requests. Please wait a minute and try again.');
  if (!response.ok) throw new Error('Sorry,the weather service has a problem. Please try again later.');

  return response.json();
}

// city name to get list of matching places (will used for suggestions)
export function suggest(query) {
  return request(`/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5`);
}

//  city name to get coordinates of the best match
export async function geocode(query) {
  const results = await suggest(query);
  if (results.length === 0) {
    throw new Error(`The city "${query}" was not found. Check the spelling and try again.`);
  }
  const { name, country, lat, lon } = results[0];
  return { name, country, lat, lon };
}

// coordinates to get weather
export const getWeather = (lat, lon) => request(`/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric`);

export const getForecast = (lat, lon) => request(`/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric`);
