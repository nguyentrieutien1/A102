const setErrorMessage = (element, message) => {
  element.innerHTML = message
}

const clearErrorMessage = (element) => {
  setTimeout(() => {
    element.innerHTML = ""
  }, 3000);
}

export {
  setErrorMessage,
  clearErrorMessage
}
