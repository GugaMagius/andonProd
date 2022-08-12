if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('C:/Apps/andon/scratch');
  }
  

  function setLS (key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  module.exports.setLS = setLS

  function getLS(key) {
    return localStorage.getItem(key)

  }
  module.exports.getLS = getLS