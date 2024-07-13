const convertNumberToArray = number => {
  return Array.from({ length: number }, (_, index) => index);
}

export {
  convertNumberToArray
}
