//about sharing the weather, Facebook and copy weather info to clipboard


import { placeLabel } from './helpers.js';
// _________________________________________________________________________________________
//here the message to use for sharing and copying the waether info
function weatherText(place, weather) {
  return `Weather in ${placeLabel(place)}: ${Math.round(weather.main.temp)}°C, ${weather.weather[0].description}. ` +
    `Humidity ${weather.main.humidity}%, wind ${weather.wind.speed} m/s.`;
}

// this to open the Facebook share window and give the weather info text
export function shareOnFacebook(place, weather) {
  const pageUrl = window.location.origin + window.location.pathname;
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}&quote=${encodeURIComponent(weatherText(place, weather))}`;
  window.open(url, '_blank', 'width=600,height=500');
}

//copy the message to the clipboard and returns true if it worked
export async function copyWeatherText(place, weather) {
  try {
    await navigator.clipboard.writeText(weatherText(place, weather));
    return true;
  } catch {
    return false;
  }
}
