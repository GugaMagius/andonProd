
// ****** Chamadas das bibliotecas *******
const mesSocket = require('./server') //client SOCKET

const bdMES = require('../BD/MES')

const Functions = require('../Services/functions')

const workerpool = require('workerpool');


const ActualDir = __dirname.split("socket")[0]

const pool = workerpool.pool(ActualDir + '/Services/pDadosComp.js');

const config = require('../configuracao')

const main = require('../server')

var versaoSup

function enviaVersSup() {
  return new Promise(
    function (resolve, reject) {
      if (versaoSup === undefined) {
        setTimeout(() => {
          if (versaoSup === undefined) {
            versaoSup = '0.0.0'
          } else {
            resolve(versaoSup) 
          }
        }, 10000)
      }
    }
  )
}
module.exports.enviaVersSup = enviaVersSup


// ***********************
// Configurações em geral*
// ***********************
console.log("INICIANDO IO CLIENT")

const { io } = require("socket.io-client");

const socket = io("http://localhost:3005")


try {

  socket.on("atualizaDados", (dados, destino) => {
    //console.log("DADOS RECEBIDOS DE OUTRO SERVER ", dados, " - DESTINO: ", destino)

    main.atualizaEcoat(dados, destino)

    try {

      mesSocket.atualizaDados(dados, destino)
      //console.log("ENVIANDO DADOS PARA DO ECOAT PARA O CLIENTE", dados)
    } catch (err) {
      //console.log("Nenhum cliente conectado para o Ecoat")
    }

  });

  socket.on("versao", (vers) => {
    versaoSup = vers;
    console.log("Versao supervisorio atualizada: ", versaoSup)
  })

  socket.on("respostaGrafEcoat", (dadosRec) => {

    //atualizaDados({ 'dadosQtd': dadosComp(resQtd, false), 'dadosHt': dadosComp(resHt, true), 'parametros': res[1]}, "resConsDB"
    queryHt = "select pev.dtprod,pev.IDResource,TBLResource.Code,TBLResource.Nickname,rsev.ShiftDtStart,rsev.ShiftDtEnd,pev.Shift from TBLProductionEv pev inner join TBLResourceStatusEv rsev on (rsev.IDProdEv = pev.IDProdEv) inner join TBLResource on (TBLResource.IDResource = pev.IDResource) where rsev.RSClassification=5 and rsev.FlgDeleted=0 and pev.IDResource = 31 and DtProd between " + dadosRec[1].dtInicio + " and " + dadosRec[1].dtFim

    bdMES.selectBD(queryHt, dadosRec[1]).then(
      async function (res) {
        let resHt = res
        //console.log("RESPOSTA DAS HORAS TRABALHADAS: ", resHt)

        // Calcula a média e envia para o cliente os valores 
        var paramConsQtd = await pool.exec('dadosComp', [dadosRec, false, main.eItemsList(), config])
        var paramConsHt = await pool.exec('dadosComp', [resHt, true, main.eItemsList(), config])

        //const paramConsQtd = await piscina.run({ 'respBD': dadosRec, 'ht': false, 'list': main.eItemsList(), 'config': config })
        //const paramConsHt = await piscina.run({ 'respBD': resHt, 'ht': true, 'list': main.eItemsList(), 'config': config })

        Functions.calculaMedia(paramConsQtd, paramConsHt, dadosRec[1])
      }
    )

    //mesSocket.atualizaDados({'dadosQtd': mesSocket.dadosComp(dadosRec, false), 'dadosHt': [], 'parametros': dadosRec[1]}, "resConsDB")

  })

} catch (err) {
  Functions.escreverLog("Erro ao criar socket: ", err)
}

function solicitaDadosEcoat(parametros) {
  socket.emit("solicitaDadosGraf", parametros)

}

module.exports.solicitaDadosEcoat = solicitaDadosEcoat