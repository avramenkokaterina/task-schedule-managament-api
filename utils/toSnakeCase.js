'use strict';
module.exports = obj => obj && Object.keys(obj).reduce((result, key) => {
  let updatedKey = '';
  for (const char of key) {
    if (char.match(/[a-zA-Z]/) && char === char.toUpperCase()) {
      updatedKey = `${updatedKey}_${char.toLocaleLowerCase()}`;
    } else {
      updatedKey = `${updatedKey}${char}`;
    }
  }
  result[updatedKey] = obj[key];
  return result;
}, {});
