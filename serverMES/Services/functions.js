
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
async function solicitaBD(queryQtd, queryHt, msg, setor) {

    console.log(queryQtd)

        let promiseQtd = new Promise(
            async function (resolve, reject) {

                await apiZeno.getDataSQL(queryQtd, main.seletorConexaoBD(setor), msg).then(res => {
                    if (res[0]==={} || res[0] === undefined || res[0] === null){
                        console.log("RESPOSTA VAZIA DO BD PARA A CONSULTA: ", queryQtd)
                        resolve("vazia")}
                    pool.exec('dadosComp', [res, false, main.eItemsList(), config]).then(
                        resPool => {
                            resolve(resPool)
                        }
                    )
                    .catch(err=>{reject(err)})
                })

            }
        )

        let promiseHt = new Promise(
            function (resolve, reject) {

                apiZeno.getDataSQL(queryHt, main.seletorConexaoBD(), msg).then(res => {
                    if (res[0]==={} || res[0] === undefined || res[0] === null){
                        console.log("RESPOSTA VAZIA DO BD PARA A CONSULTA: ", queryHt)
                        resolve("vazia")}
                    pool.exec('dadosComp', [res, true, main.eItemsList(), config]).then(
                        resPool => {
                            resolve(resPool)
                        }
                    )
                    .catch(err=>{reject(err)})
                })

            }
        )


        Promise.all([promiseQtd, promiseHt]).then((res) => {
            if (res[0]==={} || res[0] === undefined || res[0] === null){
                console.log("RESPOSTA da promise VAZIA PARA AS CONSULTAS ")
                ioSocket.enviarResposta({ 'dadosQtd': res[0], 'media': res[1], 'parametros': msg })
            } else {
                calculaMedia(res[0], res[1], msg)
            }

        }

        )


}
module.exports.solicitaBD = solicitaBD


// Função para calcular a média
async function calculaMedia(Qtd, tempo, parametros) {
    let media = {}

    for (const [index, data] of Object.keys(Qtd).entries()) {
        //console.log("valor: ", Qtd[data], " - tempo: ", tempo[data])
        media[data] = media[data] || 0
        media[data] = parseFloat((Qtd[data] / tempo[data]).toFixed(1))

        if (index >= Object.keys(Qtd).length - 1) {
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



