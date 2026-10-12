import { DEFAULT_VIEW, PLACE_ZOOM } from './config.js';

let map;

export function initMap(id) {
  map = L.map(id).setView([DEFAULT_VIEW.lat, DEFAULT_VIEW.lon], DEFAULT_VIEW.zoom);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);
}