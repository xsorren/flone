// helpers/stringToArray.js
export const stringToArray = (text = "") => {
    // Si text es falsy, retornamos []
    if (!text) return [];
    
    // Asegurarse de que text sea un string
    const textStr = String(text);
    
    // Dividimos por comas y hacemos trim a cada valor
    return textStr
      .split(",")
      .map((item) => item.trim())
      .filter((val) => val.length > 0);
  };
  