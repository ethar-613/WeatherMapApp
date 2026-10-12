// here everything that changes the page: spinner, alerts, popup card and so


import {$} from './helpers.js';
import {getApiKey, saveApiKey, clearApiKey } from './storage.js';

// ________________________________________________________________________________
//API key setup 
function updateKeyState() {
  const hasKey = getApiKey() !== '';
  $('#key-state').textContent = hasKey ? 'Key saved for this session' : 'No key yet';
  $('#key-state').classList.toggle('ok', hasKey);
  $('#key-remove').hidden = !hasKey;
}

export function openKeyDialog() {
  $('#key-input').value = '';
  $('#key-msg').textContent = '';
  updateKeyState();
  $('#key-dialog').showModal();
}

export function initKeyDialog() {
  updateKeyState();
  $('#key-btn').addEventListener('click', openKeyDialog);
  $('#key-cancel').addEventListener('click', () => $('#key-dialog').close());

  $('#key-remove').addEventListener('click', () => {
    clearApiKey();
    updateKeyState();
    $('#key-dialog').close();
  });

  $('#key-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const key = $('#key-input').value.trim();
    if (key.length < 16) {
      $('#key-msg').textContent = 'Please enter a valid API key (OpenWeatherMap keys have 32 characters).';
      return;
    }
    saveApiKey(key);
    updateKeyState();
    $('#key-dialog').close();
  });
}
