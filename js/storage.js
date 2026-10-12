// this is a local storage to store api key that come from the user on it 

//this for api key to store it in session Storage only, so it only for this browser tap/session
export const getApiKey = () => sessionStorage.getItem('wm_api_key') || '';
export const saveApiKey = (key) => sessionStorage.setItem('wm_api_key', key);
export const clearApiKey = () => sessionStorage.removeItem('wm_api_key');
