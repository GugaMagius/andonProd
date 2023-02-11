
// ***** Import das bibliotecas e módulos ******
const config = require('../configuracao')

const main = require('../server')

const ioSocket = require('../socket/server')

var fs = require('fs');

const workerpool = require('workerpool');

const pool = workerpool.pool(__dirname + '/pDadosComp.js');

const storage = require('../Services/storage')

const apiZeno = require('../BD/apiZeno')

// Função para organizar dados do datasul em uma variável objeto
function reduceDatasul(dados) {
    return dados.reduce(function (acc, index) {
        acc = acc || {}
        acc[index["it-codigo"]] = acc[index["it-codigo"]] || { 'm2': 0, 'kg': 0 }
        acc[index["it-codigo"]]["m2"] = parseFloat(index["area"].toString().replace(",", "."))
        acc[index["it-codigo"]]["kg"] = parseFloat(index["peso-liquido"].toString().replace(",", "."))
        return acc
    }, {})
}
module.exports.reduceDatasul = reduceDatasul


// Função para solicitar dados do banco de dados
async function solicitaBD(queryQtd, queryHt, queryHd, queryHc, queryHtt, parametros, setor) {

    let promiseQtdM2 = new Promise(
        async function (resolve, reject) {

            await apiZeno.getDataSQL(queryQtd, main.seletorConexaoBD(setor), parametros).then(res => {
                if (res[0] === {} || res[0] === undefined || res[0] === null) {
                    console.log("RESPOSTA VAZIA DO BD PARA A CONSULTA: ", queryQtd)
                    resolve("vazia")
                }
                pool.exec('dadosComp', [res, false, main.eItemsList(), 'm2']).then(
                    resPool => {
                        resolve(resPool)
                    }
                )
                    .catch(err => { reject(err) })
            })

        }
    )

    let promiseQtdKg = new Promise(
        async function (resolve, reject) {

            await apiZeno.getDataSQL(queryQtd, main.seletorConexaoBD(setor), parametros).then(res => {
                if (res[0] === {} || res[0] === undefined || res[0] === null) {
                    console.log("RESPOSTA VAZIA DO BD PARA A CONSULTA: ", queryQtd)
                    resolve("vazia")
                }
                pool.exec('dadosComp', [res, false, main.eItemsList(), 'kg']).then(
                    resPool => {
                        resolve(resPool)
                    }
                )
                    .catch(err => { reject(err) })
            })

        }
    )

    let promiseHt = new Promise(
        function (resolve, reject) {

            apiZeno.getDataSQL(queryHt, main.seletorConexaoBD(), parametros).then(res => {
                if (res[0] === {} || res[0] === undefined || res[0] === null) {
                    console.log("RESPOSTA VAZIA DO BD PARA A CONSULTA: ", queryHt)
                    resolve("vazia")
                }
                pool.exec('dadosComp', [res, true, main.eItemsList()]).then(
                    resPool => {
                        resolve(resPool)
                    }
                )
                    .catch(err => { reject(err) })
            })

        }
    )

    let promiseHd = new Promise(
        function (resolve, reject) {

            apiZeno.getDataSQL(queryHd, main.seletorConexaoBD(), parametros).then(res => {
                if (res[0] === {} || res[0] === undefined || res[0] === null) {
                    console.log("RESPOSTA VAZIA DO BD PARA A CONSULTA: ", queryHd)
                    resolve("vazia")
                }
                pool.exec('dadosComp', [res, true, main.eItemsList()]).then(
                    resPool => {
                        resolve(resPool)
                    }
                )
                    .catch(err => { reject(err) })
            })

        }
    )

    let promiseHc = new Promise(
        function (resolve, reject) {

            apiZeno.getDataSQL(queryHc, main.seletorConexaoBD(), parametros).then(res => {
                if (res[0] === {} || res[0] === undefined || res[0] === null) {
                    console.log("RESPOSTA VAZIA DO BD PARA A CONSULTA: ", queryHc)
                    resolve("vazia")
                }
                pool.exec('dadosComp', [res, true, main.eItemsList()]).then(
                    resPool => {
                        resolve(resPool)
                    }
                )
                    .catch(err => { reject(err) })
            })

        }
    )

    let promiseHtt = new Promise(
        function (resolve, reject) {

            apiZeno.getDataSQL(queryHtt, main.seletorConexaoBD(), parametros).then(res => {
                if (res[0] === {} || res[0] === undefined || res[0] === null) {
                    console.log("RESPOSTA VAZIA DO BD PARA A CONSULTA: ", queryHtt)
                    resolve("vazia")
                }
                pool.exec('dadosComp', [res, true, main.eItemsList()]).then(
                    resPool => {
                        resolve(resPool)
                    }
                )
                    .catch(err => { reject(err) })
            })

        }
    )


    Promise.all([promiseQtdM2, promiseQtdKg, promiseHt, promiseHd, promiseHc, promiseHtt]).then((res) => {
        if (res[0] === {} || res[0] === undefined || res[0] === null) {

            ioSocket.enviarResposta({ 'dadosQtd': res[0], 'media': res[1], 'tempoDisp': res[2], 'parametros': parametros })

        } else {

            calculaMedia(res[0], res[1], res[2], res[3], res[4], res[5], parametros)

        }

    }

    )


}
module.exports.solicitaBD = solicitaBD


// Função para calcular a média para o relatório gráfico
async function calculaMedia(QtdM2, QtdKg, tempoTrab, tempoDisp, tempoCarga, tempoTotal, parametros) {
    let mediaM2 = {}
    let mediaKg = {}
    let prodDispM2 = {}
    let prodDispKg = {}
    let prodMetaM2 = {}
    let prodMetaKg = {}
    let Disp = {}

    for (const [index, data] of Object.keys(QtdM2).entries()) {
        //console.log("valor: ", Qtd[data], " - tempoTrab: ", tempoTrab[data])
        mediaM2[data] = mediaM2[data] || 0
        mediaKg[data] = mediaKg[data] || 0
        prodDispM2[data] = prodDispM2[data] || 0
        prodDispKg[data] = prodDispKg[data] || 0
        prodMetaM2[data] = prodMetaM2[data] || 0
        prodMetaKg[data] = prodMetaKg[data] || 0
        Disp[data] = Disp[data] || 0


        mediaM2[data] = parseFloat((QtdM2[data] / tempoTrab[data]).toFixed(1))
        mediaKg[data] = parseFloat((QtdKg[data] / tempoTrab[data]).toFixed(1))
        prodDispM2[data] = parseFloat((tempoDisp[data] * parametros.meta.metaS).toFixed(1))
        prodDispKg[data] = parseFloat((tempoDisp[data] * parametros.meta.metaP).toFixed(1))
        prodMetaM2[data] = parseFloat((tempoTrab[data] * parametros.meta.metaS).toFixed(1))
        prodMetaKg[data] = parseFloat((tempoTrab[data] * parametros.meta.metaP).toFixed(1))
        Disp[data] = parseFloat((tempoTrab[data] / tempoDisp[data] * 100)).toFixed(1)
        //tempoDisp = 

        if (index >= Object.keys(QtdM2).length - 1) {
            ioSocket.enviarResposta({
                'dadosQtdm2': QtdM2,
                'dadosQtdkg': QtdKg,
                'mediam2': mediaM2, 
                'mediakg': mediaKg, 
                'prodDispm2': prodDispM2, 
                'prodDispkg': prodDispKg, 
                'prodMetam2': prodMetaM2, 
                'prodMetakg': prodMetaKg, 
                'tempoTrab': tempoTrab,
                'tempoDisp': tempoDisp, 
                'tempoCarga': tempoCarga, 
                'tempoTotal': tempoTotal, 
                'Disp': Disp,  
                'parametros': parametros
            })
        }

    }

}

module.exports.calculaMedia = calculaMedia


// Função para calcular a média para o relatório gráfico
async function mediaAndon(QtdM2, QtdKg, tempoTrab, parametros) {
    let mediaM2 = {}
    let mediaKg = {}
    let Disp = {}

    for (const [index, data] of Object.keys(QtdKg).entries()) {
        //console.log("valor: ", Qtd[data], " - tempoTrab: ", tempoTrab[data])
        mediaM2[data] = mediaM2[data] || 0
        mediaKg[data] = mediaKg[data] || 0
        Disp[data] = Disp[data] || 0


        mediaM2[data] = parseFloat((QtdM2[data] / tempoTrab[data]).toFixed(1))
        mediaKg[data] = parseFloat((QtdKg[data] / tempoTrab[data]).toFixed(1))
        Disp[data] = parseFloat((tempoTrab[data] / tempoDisp[data] * 100)).toFixed(1)
        //tempoDisp = 

        if (index >= Object.keys(QtdKg).length - 1) {
            ioSocket.enviarResposta({
                'dadosQtdm2': QtdM2,
                'dadosQtdkg': QtdKg,
                'mediam2': mediaM2, 
                'mediakg': mediaKg, 
                'prodDispm2': prodDispM2, 
                'prodDispkg': prodDispKg, 
                'prodMetam2': prodMetaM2, 
                'prodMetakg': prodMetaKg, 
                'tempoTrab': tempoTrab,
                'tempoDisp': tempoDisp, 
                'tempoCarga': tempoCarga, 
                'tempoTotal': tempoTotal, 
                'Disp': Disp,  
                'parametros': parametros
            })
        }

    }

}

module.exports.mediaAndon = mediaAndon


function lerFS() {

    return new Promise(
        function (resolve, reject) {

            try {
                fs.readFile('./log.txt', { encoding: 'utf-8' }, (err, data) => {
                    if (err) { console.log(err); reject(err) };
                    resolve(JSON.stringify(data));
                });
            } catch (err) {
                console.log("falha ao ler arquivo: ", err)
                reject(err)
            }

        }
    )
}
module.exports.lerFS = lerFS


async function escreverFS(msg) {

    try {

        await lerFS().then(
            function (res) {
                let dataToWrite = JSON.parse(res) + "\n" + msg

                try {
                    fs.writeFile('./log.txt', dataToWrite, { encoding: 'utf-8' }, (err) => {
                        if (err) { console.log(err) };
                        console.log('Dados gravados no arquivo');
                    });
                } catch (err) {
                    console.log("falha ao escrever arquivo: ", err)
                }
            }
        );
    } catch (err) {

        console.log("Falha ao ler arquivo para atualização: ", err)
    }

}
module.exports.escreverFS = escreverFS



async function escreverLog(msg) {
    let dataHora = new Date();
    console.log(`Escrevendo log de falha. Msg: ${msg}`)
    await escreverFS(`${dataHora} - ${msg}`)
}
module.exports.escreverLog = escreverLog



