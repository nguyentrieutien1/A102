const setLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Error setting localStorage:', e);
  }
}

const getLocalStorage = (key, defaultValue = null) => {
  try {
    const value = localStorage.getItem(key);
    if (value !== null) {
      return JSON.parse(value);
    } else {
      return defaultValue;
    }
  } catch (e) {
    console.error('Error getting localStorage:', e);
    return defaultValue;
  }
}

export {
  setLocalStorage,
  getLocalStorage
}
