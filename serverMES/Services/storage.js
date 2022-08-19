if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('C:/Apps/andon/scratch');
}


function setLS(key, value) {
  if (key === "log") {
    //console.log("FALHA: ", value);

    let valorAtual = getLS(key);
    //console.log("Valor atual: ", valorAtual)
    let registroAtual = { DataHora: new Date(), Mensagem: value };

    function verifLogAtual() {

      if (valorAtual === undefined || valorAtual === null) {

        valorAtual = [];
        valorAtual.push(registroAtual);

      } else if (valorAtual.length >= 100) {

        valorAtual.shift();
        valorAtual.push(registroAtual);

      } else {

        valorAtual.push(registroAtual);

      }

    }

    Promise.resolve(verifLogAtual()).then(
      localStorage.setItem(key, JSON.stringify(valorAtual))
    )

  } else {

    localStorage.setItem(key, JSON.stringify(value));

  }
}
module.exports.setLS = setLS

function getLS(key) {

  return JSON.parse(localStorage.getItem(key))

}


module.exports.getLS = getLS