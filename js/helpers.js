// little helper functions used for all app

// this is a shortcut for document.querySelector
export const $ = (selector) => document.querySelector(selector);

export const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);
export const iconUrl = (code) => `https://openweathermap.org/img/wn/${code}@2x.png`;
export const placeLabel = (place) => `${place.name}, ${place.country}`;
