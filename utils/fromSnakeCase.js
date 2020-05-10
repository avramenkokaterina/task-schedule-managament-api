'use strict';
module.exports = obj => obj && Object.keys(obj).reduce((result, key) => {
  let updatedKey = '';
  let changeCase = false;
  for (const char of key) {
    if (char === '_') {
      changeCase = true;
    } else {
      const letter = changeCase ? char.toUpperCase() : char;
      updatedKey = `${updatedKey}${letter}`;
      changeCase = false;
    }
  }
  result[updatedKey] = obj[key];
  return result;
}, {});
