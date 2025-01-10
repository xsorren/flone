// helpers/stringToArray.js
export const stringToArray = (text = "") => {
    // Si text es falsy, retornamos []
    if (!text) return [];
    // Dividimos por comas y hacemos trim a cada valor
    return text
      .split(",")
      .map((item) => item.trim())
      .filter((val) => val.length > 0);
  };
  