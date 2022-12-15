// **************************************************
// *********************PRINCIPAL********************
// **************************************************

const ioSocket = require('./socket/server') //client SOCKET
const enviaEmail = require('./Services/enviaEmail')
const datasulApi = require('./ServiceApi/DataSulApiService')
datasulApi;
const apiZeno = require('./BD/apiZeno')

const moment = require('moment')

const config = require('./configuracao') //Configuração dos turnos (turnos / DadosIni)

// **** Conexão com arquivo de funções *********
const Functions = require('./Services/functions')

const calcHorarios = require('./Services/calcHorarios')

const storage = require('./Services/storage')
storage

const connMES = require('./configBD').connMES
const connSuperv = require('./configBD').connSuperv

function seletorConexaoBD(CTselect) {

    if (CTselect === "ecoat") {
        return connSuperv
    } else {
        return connMES
    }

}
module.exports.seletorConexaoBD = seletorConexaoBD

// ********** Sem Cadastro ***************
var semCadastro = [] // Variável para indicar itens sem cadastro
var emailSemCadEnviado = true; // Sinaliza e-mail dos itens sem cadastros já enviado - enviar 1 x por dia


function fEnviaEmailSemCad(lista) {

    if (emailSemCadEnviado === false && turnoAtual === 1 && listaSemCadCompl != undefined) {


         //#Teste desativar quando estiver em teste 
        //  enviaEmail("Itens não cadastrados",
        //      "Favor regularizar o cadastro dos itens abaixo:\n\n" + lista,
        //     "Diones",
        //     'diones.nascimento@magius.com.br'
        // )
        // emailSemCadEnviado = true;
        // semCadastro = []
        
        enviaEmail("Itens não cadastrados",
        "Favor regularizar o cadastro dos itens abaixo:\n\n" + lista,
       "Gustavo",
       'gustavo@magius.com.br'
   )
   emailSemCadEnviado = true;
   semCadastro = []

    }
}

var msg
var listaSemCadCompl

async function mostraSemCad(lista) {
    try {
        lista.forEach(element => {
            msg = `código: ${element} - Área: ${vItemsList[element]["m2"]} - Peso-líquido: ${vItemsList[element]["kg"]} \n`
            listaSemCadCompl = listaSemCadCompl || ''
            listaSemCadCompl = listaSemCadCompl + msg
        });
        emailSemCadEnviado = false
    } catch (err) {
        let msg = `Falha ao listar itens sem cadastro - erro: ${err}`
        storage.setLS("log", msg)
    }

}

setTimeout(mostraSemCad, 50000, semCadastro);


// ****** Lista de itens cadastrados no Datasul *****
var vItemsList = {};

function eItemsList() {
    return vItemsList
}
module.exports.eItemsList = eItemsList


function itemsListUpdate(dados) {

    vItemsList = Functions.reduceDatasul(dados)
    //Functions.fItemsList(vItemsList);

}
module.exports.itemsListUpdate = itemsListUpdate



// *********** INICIALIZA DATA E HORA ATUAL ************
var dateTime = moment(); // Data e hora atual

var formato = "HH:mm:ss"; // fomato para data e hora utilizado nos cálculos de turno

const horaAtual = moment(dateTime, formato) // hora atual


const tempoT1 = calcHorarios.verifHora(config.turnos.Turno1.fim, 1).dif
const tempoT2 = calcHorarios.verifHora(config.turnos.Turno2.fim, 2).dif
const tempoT3 = calcHorarios.verifHora(config.turnos.Turno3.fim, 3).dif


fEnviaEmailSemCad(listaSemCadCompl);


// *********** LEITURA DOS DADOS DO BD E SEPARAÇÃO ************
function respostaBD(string, destino, BD) {

    //bdMES.conectarMES(string).then(
    apiZeno.getDataSQL(string, BD).then(
        function (respostaBD) {

            let horaAtualCmp = moment(new Date()).format(formato) // Hora atual completa
            let turnoAtual = calcHorarios.testeTurno(horaAtualCmp).turno


            function extratDados(dadosBD) {

                return new Promise(
                    function (resolve, reject) {

                        const DadosIni = {
                            Hoje: {
                                Turno1: {
                                    soma: 0,
                                    media: 0,
                                    horarios: {
                    
                                    }
                                },
                                Turno2: {
                                    soma: 0,
                                    media: 0,
                                    horarios: {
                    
                                    }
                                },
                                Turno3: {
                                    soma: 0,
                                    media: 0,
                                    horarios: {
                    
                                    }
                                }
                            },
                            Ontem: {
                                Turno1: {
                                    soma: 0,
                                    media: 0,
                                    horarios: {
                    
                                    }
                                },
                                Turno2: {
                                    soma: 0,
                                    media: 0,
                                    horarios: {
                    
                                    }
                                },
                                Turno3: {
                                    soma: 0,
                                    media: 0,
                                    horarios: {
                    
                                    }
                                }
                            },
                            
                        }

                        resolve(

                            dadosBD.reduce(function (acc, index) {


                                let inicioDia = moment(config.turnos.Turno1.inicio, formato).format(formato)
                                let horaReg2d = moment.utc(index.hora, "HH:mm:ss").format("HH")
                                let diaReg2d = moment.utc(index.dtmov, "DD/MM/AAAA HH:mm:ss").format("DD")
                                let horaRegCmp = moment.utc(index.hora, "HH:mm:ss").format(formato) // Hora do registro completa
                                let diaHoje2d = moment(horaAtualCmp, formato).isBefore(moment(inicioDia,formato)) ? moment().subtract(1, "days").format("DD") : moment().format("DD")
                                let diaOntem2d = moment().subtract(1, "days").format("DD")
                                let turnoReg = calcHorarios.testeTurno(horaRegCmp).turno

                                var regAtualCalc = 0.0

                                if (destino === "perdidos_LE" || destino === "produzidos_LE") {

                                    regAtualCalc = 1

                                } else {
                                    // Calcula quantidade de m2 para o item
                                    if (vItemsList[index.code]["m2"] > 0) {

                                        regAtualCalc = parseFloat(parseInt(index.movqty) * parseFloat(vItemsList[index.code]["m2"]))

                                    } else { // Verifica itens sem cadastro e adiciona na lista nova

                                        if (!semCadastro.includes(index.code)) {

                                            semCadastro.push(index.code)

                                        }

                                    }
                                }


                                acc["Hoje"] = acc["Hoje"] || {}

                                acc["Ontem"] = acc["Ontem"] || {}

                                acc["Hoje"]["Turno1"] = acc["Hoje"]["Turno1"] || { soma: 0, media: 0, horarios: {} }
                                acc["Hoje"]["Turno2"] = acc["Hoje"]["Turno2"] || { soma: 0, media: 0, horarios: {} }
                                acc["Hoje"]["Turno3"] = acc["Hoje"]["Turno3"] || { soma: 0, media: 0, horarios: {} }

                                acc["Ontem"]["Turno1"] = acc["Ontem"]["Turno1"] || { soma: 0, media: 0, horarios: {} }
                                acc["Ontem"]["Turno2"] = acc["Ontem"]["Turno2"] || { soma: 0, media: 0, horarios: {} }
                                acc["Ontem"]["Turno3"] = acc["Ontem"]["Turno3"] || { soma: 0, media: 0, horarios: {} }

                                // Verifica de quando é o registro
                                let quando = "" // Indica se o registro é de Hoje ou Ontem


                                if (diaReg2d === diaHoje2d) { // Verifica se o registro é de hoje
                                    quando = "Hoje"

                                } else if (diaReg2d === diaOntem2d) { // Verifica se o registro é de ontem
                                    quando = "Ontem"
                                }

                                // Compila os dados no acumulador
                                if (quando === "Hoje" || quando === "Ontem") {

                                    try {

                                        acc[quando][`Turno${turnoReg}`]["horarios"][horaReg2d] = acc[quando][`Turno${turnoReg}`]["horarios"][horaReg2d] || 0
                                        acc[quando][`Turno${turnoReg}`]["soma"] = acc[quando][`Turno${turnoReg}`]["soma"] || 0

                                        acc[quando][`Turno${turnoReg}`]["horarios"][horaReg2d] += regAtualCalc
                                        acc[quando][`Turno${turnoReg}`]["soma"] += regAtualCalc

                                    } catch (err) {
                                        console.log("falha ao tentar compilar dados: ", err, " - Dados: ", index)
                                    }
                                }

                                return acc

                            },
                                DadosIni // valor inicial do reduce
                            )
                        )

                    }

                )


            }

            extratDados(respostaBD[0]).then(  // Calcula média

                function (respostaED) {

                    respostaED["metaP"] = config.metas[`metaP_${destino.split("_")[1]}`]

                    respostaED["metaS"] = config.metas[`metaS_${destino.split("_")[1]}`]

                    respostaED["turnoAtual"] = turnoAtual

                    respostaED["Ontem"]["Turno1"]["media"] = respostaED["Ontem"]["Turno1"]["soma"] / tempoT1

                    respostaED["Ontem"]["Turno2"]["media"] = respostaED["Ontem"]["Turno2"]["soma"] / tempoT2

                    respostaED["Ontem"]["Turno3"]["media"] = respostaED["Ontem"]["Turno3"]["soma"] / tempoT3



                    let tempoT1Hoje
                    let tempoT2Hoje
                    let tempoT3Hoje

                    turnoAtual = 1 ? tempoT1Hoje = calcHorarios.verifHora(horaAtualCmp, 1).dif : tempoT1Hoje = tempoT1
                    turnoAtual = 2 ? tempoT2Hoje = calcHorarios.verifHora(horaAtualCmp, 2).dif : tempoT2Hoje = tempoT2
                    turnoAtual = 3 ? tempoT3Hoje = calcHorarios.verifHora(horaAtualCmp, 3).dif : tempoT3Hoje = tempoT3


                    respostaED["Hoje"]["Turno1"]["media"] = respostaED["Hoje"]["Turno1"]["soma"] / tempoT1Hoje

                    respostaED["Hoje"]["Turno2"]["media"] = respostaED["Hoje"]["Turno2"]["soma"] / tempoT2Hoje

                    respostaED["Hoje"]["Turno3"]["media"] = respostaED["Hoje"]["Turno3"]["soma"] / tempoT3Hoje


                    respostaED["Hoje"]["somaDia"] = parseFloat(respostaED["Hoje"]["Turno1"]["soma"]) + parseFloat(respostaED["Hoje"]["Turno2"]["soma"]) + parseFloat(respostaED["Hoje"]["Turno3"]["soma"])

                    respostaED["Ontem"]["somaDia"] = parseFloat(respostaED["Ontem"]["Turno1"]["soma"]) + parseFloat(respostaED["Ontem"]["Turno2"]["soma"]) + parseFloat(respostaED["Ontem"]["Turno3"]["soma"])

                    let tempoT1h = !parseFloat(respostaED.Hoje.Turno1.media) > 0 ? 0 : respostaED.Hoje.Turno1.soma / respostaED.Hoje.Turno1.media
                    let tempoT2h = !parseFloat(respostaED.Hoje.Turno2.media) > 0 ? 0 : respostaED.Hoje.Turno2.soma / respostaED.Hoje.Turno2.media
                    let tempoT3h = !parseFloat(respostaED.Hoje.Turno3.media) > 0 ? 0 : respostaED.Hoje.Turno3.soma / respostaED.Hoje.Turno3.media
                    let tempoT1o = !parseFloat(respostaED.Ontem.Turno1.media) > 0 ? 0 : respostaED.Ontem.Turno1.soma / respostaED.Ontem.Turno1.media
                    let tempoT2o = !parseFloat(respostaED.Ontem.Turno2.media) > 0 ? 0 : respostaED.Ontem.Turno2.soma / respostaED.Ontem.Turno2.media
                    let tempoT3o = !parseFloat(respostaED.Ontem.Turno3.media) > 0 ? 0 : respostaED.Ontem.Turno3.soma / respostaED.Ontem.Turno3.media

                    respostaED["Hoje"]["mediaDia"] = respostaED["Hoje"]["somaDia"] / (tempoT1h + tempoT2h + tempoT3h)
                    respostaED["Ontem"]["mediaDia"] = respostaED["Ontem"]["somaDia"] / (tempoT1o + tempoT2o + tempoT3o)

                    ioSocket.dadosServer[destino] = respostaED

                }
            )

        }

    )
        .catch(
            function (err) {
                let msg = "Erro ao conectar ao banco de dados: " + err

                storage.setLS("log", msg)
            }
        )
}

const prodLE = "select ce.id, ce.data, convert(time, data) hora, CASE WHEN DATEPART(hh,ce.data)<6 then data-1 ELSE data END dtmov from cicloEcoat ce where CASE WHEN DATEPART(hh,ce.data)<6 then data-1 ELSE data END >= convert(datetime2, DATEADD(dd, 0, DATEDIFF(dd, 0, GETDATE()-3)))"

const perdLE = "select ce.id, ce.data, convert(time, data) hora, CASE WHEN DATEPART(hh,ce.data)<6 then DAY(data-1) ELSE DAY(data) END dtmov from bastPerdido ce where CASE WHEN DATEPART(hh,ce.data)<6 then data-1 ELSE data END >= convert(datetime2, DATEADD(dd, 0, DATEDIFF(dd, 0, GETDATE()-3)))"

const stringPP = "select me.DtMov, convert(time, me.DtTimeStamp) hora, me.IDResource, me.Shift, me.IDProduct, me.movqty, me.UndoIDMovEv, me.RelatedIDMovEv, me.IDMovEv, p.Code from TBLMovEv me inner join TBLProduct p on (p.IDProduct = me.IDProduct) where me.IDResource=97 and me.DtMov >= convert(datetime2, DATEADD(dd, 0, DATEDIFF(dd, 0, GETDATE()-3)))"

const stringPL = "select me.DtMov, convert(time, me.DtTimeStamp) hora, me.IDResource, me.Shift, me.IDProduct, me.movqty, me.UndoIDMovEv, me.RelatedIDMovEv, me.IDMovEv, p.Code from TBLMovEv me inner join TBLProduct p on (p.IDProduct = me.IDProduct) where me.IDResource=108 and me.DtMov >= convert(datetime2, DATEADD(dd, 0, DATEDIFF(dd, 0, GETDATE()-3)))"

const formacaoKit = "select me.DtMov, convert(time, me.DtTimeStamp) hora, me.IDResource, me.Shift, me.IDProduct, me.movqty, me.UndoIDMovEv, me.RelatedIDMovEv, me.IDMovEv, p.Code from TBLMovEv me inner join TBLProduct p on (p.IDProduct = me.IDProduct) where me.IDResource=107 and me.DtMov >= convert(datetime2, DATEADD(dd, 0, DATEDIFF(dd, 0, GETDATE()-3)))"

const stringEE = "select ctbl.IDWOGRP, item.Code, ctbl.IDBastidor, ctbl.Quantidade AS movqty, ctbl.DTTIMESTAMP, convert(time, ctbl.DTTIMESTAMP) hora, CASE WHEN DATEPART(hh,ctbl.DTTIMESTAMP)<6 then ctbl.DTTIMESTAMP-1 ELSE ctbl.DTTIMESTAMP END as DtMov from CTBLWOGRP ctbl inner join TBLWOHD op on (op.Code = ctbl.WOCODE) inner join TBLProduct item on (item.IDProduct = op.IDProduct) where ctbl.IDBastidor is not null  and  CASE WHEN DATEPART(hh,ctbl.DTTIMESTAMP)<6 then ctbl.DTTIMESTAMP-1 ELSE ctbl.DTTIMESTAMP END  >= convert(datetime2, DATEADD(dd, 0, DATEDIFF(dd, 0, GETDATE()-3)))"

setTimeout(() => { respostaBD(stringPP, "dados_PP", connMES) }, 15000)

criarInterval(30000, stringPP, "dados_PP", connMES)

setTimeout(criarInterval, 2000, 30000, stringEE, "dados_EE", connMES)

setTimeout(criarInterval, 4000, 30000, stringPL, "dados_PL", connMES)

setTimeout(criarInterval, 6000, 30000, formacaoKit, "dados_FK", connMES)

setTimeout(criarInterval, 8000, 30000, prodLE, "produzidos_LE", connSuperv)

setTimeout(criarInterval, 10000, 30000, perdLE, "perdidos_LE", connSuperv)


function criarInterval(tempo, string, destino, BD) {
    setInterval(respostaBD, tempo, string, destino, BD); // Cria intervalo para leitura dos dados no BD
}

module.exports.respostaBD = respostaBD

