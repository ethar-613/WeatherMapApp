import { DEFAULT_VIEW, PLACE_ZOOM } from './config.js';

let map;
let marker;

// creating the map
export function initMap(id) {
  map = L.map(id).setView([DEFAULT_VIEW.lat, DEFAULT_VIEW.lon], DEFAULT_VIEW.zoom);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);
}


//movess the map, show one marker and open its popup
export function showPlace(place, popupContent) {
  if (marker) map.removeLayer(marker); // remove the old marker
  marker = L.marker([place.lat, place.lon]).addTo(map);
  marker.bindPopup(popupContent, { autoPan: false, minWidth: 220 });
  map.flyTo([place.lat, place.lon], PLACE_ZOOM); // smooth animation
  marker.openPopup();
}
