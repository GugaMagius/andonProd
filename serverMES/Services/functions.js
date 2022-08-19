
// ***** Import das bibliotecas e módulos ******
const config = require('../configuracao')

const main = require('../server')

const bdMES = require('../BD/MES')

const ioSocket = require('../socket/server')

const path = require('path');

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

// *********** FUNÇÃO DE CÁLCULO DE DIFERENÇA DE HORAS ************
function calcDifHora(horaInicial, horaFinal) {
    let hrInic = parseInt(horaInicial.split(":")[0]);
    let mnInic = parseInt(horaInicial.split(":")[1]);
    let hrFin = parseInt(horaFinal.split(":")[0]);
    let mnFin = parseInt(horaFinal.split(":")[1]);

    return new Promise(
        function (resolve, reject) {

            if (hrInic > hrFin) {
                if (mnInic > mnFin) {
                    resolve(parseInt(24 - hrInic + hrFin - 1) + parseFloat((60 - mnInic + mnFin) / 60))
                } else {
                    resolve(parseInt(24 - hrInic + hrFin) + parseFloat((mnFin - mnInic) / 60))
                }
            } else {
                if (mnInic > mnFin) {
                    resolve(parseInt(hrFin - hrInic - 1) + parseFloat((60 - mnInic + mnFin) / 60))
                } else {
                    resolve(parseInt(hrFin - hrInic) + parseFloat((mnFin - mnInic) / 60))
                }
            }
        }
    )
}
module.exports.calcDifHora = calcDifHora

// Função para solicitar dados do banco de dados
async function solicitaBD(queryQtd, queryHt, msg, setor) {
    console.log("mensagem: ", msg)



    var paramConsQtd
    var paramConsHt

    function consultaSQL(query) {
        return new Promise(
            async function (resolve, reject) {

                await apiZeno.getDataSQL(query, main.seletorConexaoBD(setor), msg).then(res => {
                    //if (res[0].length <= 0) {
                    //    ioSocket.enviarResposta({ 'dadosQtd': 0, 'media': 0, 'parametros': msg })
                    //    reject("vazio")
                    //}
                    resolve(res)
                }
                )

            }
        )
    }


    if (setor === "ecoat") {

        console.log("é ecoat: ")

        let promiseQtd = new Promise(
            function (resolve, reject) {

                consultaSQL(queryQtd).then(res => {
                    pool.exec('dadosComp', [res, false, main.eItemsList(), config]).then(
                        resPool => {
                            console.log("Resposta do POOL: ", resPool)

                            resolve(paramConsQtd = resPool)

                        }
                    )

                })
            }
        )

        let promiseHt = new Promise(
            function (resolve, reject) {
                if (msg.ht==="media") {resolve()}
                consultaSQL(queryHt).then(res => {
                    pool.exec('dadosComp', [res, true, main.eItemsList(), config]).then(
                        resPool => {
                            resolve(paramConsHt = resPool)

                        }
                    )

                })

            }
        )


        Promise.all([promiseQtd, promiseHt]).then((res) => {

                ioSocket.enviarResposta({ 'dadosQtd': res[0], 'media': res[1], 'parametros': msg })


        }

        )




    }

    /*
        bdMES.selectBD(queryQtd, msg).then(
            async function (res) {
    
    
    
                resQtd = res
                bdMES.selectBD(queryHt, msg).then(
                    async function (res) {
    
    
    
                        if (res[0].recordset.length <= 0) {
                            ioSocket.enviarResposta({ 'dadosQtd': 0, 'media': 0, 'parametros': msg })
                            return
                        }
    
                        resHt = res
    
                        var paramConsQtd = await pool.exec('dadosComp', [resQtd, false, main.eItemsList(), config])
    
                        var paramConsHt = await pool.exec('dadosComp', [resHt, true, main.eItemsList(), config])
    
    
                        calculaMedia(paramConsQtd, paramConsHt, res[1])
    
                        console.log("**Finalizado Compilação dos dados recebidos! ", "Data-hora: ", new Date())
    
                    })
    
    
            }
        ).catch((err) => {
            storage.setLS("log", `Falha na consulta ao banco de dados para Qtd. ${err}`)
        });
        */
}
module.exports.solicitaBD = solicitaBD


// Função para calcular a média
async function calculaMedia(Qtd, tempo, parametros) {
    let media = {}
    console.log("Iniciando calculo da média: ", Qtd)

    for (const [index, data] of Object.keys(Qtd).entries()) {
        //console.log("valor: ", Qtd[data], " - tempo: ", tempo[data])
        media[data] = media[data] || 0
        media[data] = parseFloat((Qtd[data] / tempo[data]).toFixed(1))

        if (index >= Object.keys(Qtd).length - 1) {
            console.log("enviando dados compilados da média: ", media)
            ioSocket.enviarResposta({ 'dadosQtd': Qtd, 'media': media, 'parametros': parametros })
        }

    }

}

module.exports.calculaMedia = calculaMedia


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



