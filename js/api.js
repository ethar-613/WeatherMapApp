/**
 * Requests to the OpenWeatherMap API here 
 * this is the only file that connect directly with te network
 * all OpenWeatherMap requests pass through this file
 * and all network errors can converted into user friendly messages that displayed by ui.js as alert card
 * work as Asynchronous flow and multi-API integration 
 * useing here three OpenWeatherMap endpoints: suggest for geocoding, getweather to get current weather, getforcasts to get 5days forecasts
*/

import { getApiKey } from './storage.js'; //to read the stored key
// _________________________________________________________________________________________


const BASE = 'https://api.openweathermap.org'; //the base url so dosnt be repeated


// this internal function is the central function that pervent duplicate requests and handle errors across all functions
// its Asynchronous function that return promise and uses await that let the program to wait for the promise result without freezing or interrupting the rest of the code
// parameter "path" is a string, its the request path with parameters.
// returns a "promise" that turn to json obj from the server.
// throws "error" with a used friendly message incase of failure.
async function request(path) {
  let response; //declared outside "try" to remain visible
  try {
    // await fetch send the requestvand wait only for the header to arrive
    response = await fetch(`${BASE}${path}&appid=${encodeURIComponent(getApiKey())}`); //encodeURIComponent() to protect the URL from special chars in the key
  } catch {
    throw new Error('No internet connection :( Please check your network and try again.');
  }

  if (response.status === 401) throw new Error('Your API key is not valid. check it in "API key setup". [note: new keys can take a few hours to start working]');
  if (response.status === 404) throw new Error('Sorry, no weather data was found for this place.');
  if (response.status === 429) throw new Error('Sorry, too many requests. Please wait a minute and try again.');
  if (!response.ok) throw new Error('Sorry,the weather service has a problem. Please try again later.');

  return response.json(); //read the body and convert it to object. and return a promise so the calling function wait for it
}


// city name to get list of matching places also used for suggestions list
// parameter "query" is string,  its the string the the used typed on the search field
// returns a promise turn to array of 5 items of matched places. every item have[name, country, lat, lon, state, state] or empty array if nothing found
// its not async but returns a promise cuz it return the request result immediatly
export function suggest(query) {
  return request(`/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5`); //encodeURIComponent() important here for the names with spaces or arabic chars
}


// this function use suggest function to get the matches from the city that the user typed and chhose the best match to choose it to get its weather
// used for geotagging when click on "get weather"
// parameter "query" is string, its the city name 
// returns a promise turned to object of the best match result data then contain[city name, country, lat, lon]
// throws error if the result empty with user friendly error
export async function geocode(query) {
  const results = await suggest(query);
  if (results.length === 0) {
    throw new Error(`The city "${query}" was not found. Check the spelling and try again.`);
  }
  const { name, country, lat, lon } = results[0];
  return { name, country, lat, lon };
}


// this function is to get the current weather data for specific city knowing it with its latitude and longitude 
// used after geocode to get the coordinates from here first then use this to get the weather for it
// parameters; "lat" & "lon" its the latitude and longitude, (float numbers)
// returns promise that turn to current weather obj.
export const getWeather = (lat, lon) => request(`/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric`); //metric عشان ترجع الحرارة بالدرجة المئوية


// this function used to get the 5 days forecasts for the city, the returned list passed to GroupDaily in helpers.js from app.js
// parameters; "lat" & "lon" its the latitude and longitude, (float numbers)
// returns promise that turn to object have lists, and its array with like 40 item , each represent a 3 hour period 
export const getForecast = (lat, lon) => request(`/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric`);
