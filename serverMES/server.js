// **************************************************
// *********************PRINCIPAL********************
// **************************************************

const ioSocket = require('./socket/server') //client SOCKET
const bdMES = require('./BD/MES');
const enviaEmail = require('./Services/enviaEmail')
const datasulApi = require('./ServiceApi/DataSulApiService')
const moment = require('moment')
datasulApi;

const config = require('./configuracao') //Configuração dos turnos (turnos / DadosIni)

// **** Conexão com arquivo de funções *********
const Functions = require('./Services/functions')

const storage = require('./Services/storage')
storage



// ********** Sem Cadastro ***************
var semCadastro = [] // Variável para indicar itens sem cadastro
var emailSemCadEnviado = true; // Sinaliza e-mail dos itens sem cadastros já enviado - enviar 1 x por dia


function fEnviaEmailSemCad(lista) {

    if (emailSemCadEnviado === false && turnoAtual === 1 && listaSemCadCompl != undefined) {

        //##Teste
        /*
        enviaEmail("Itens não cadastrados",
            "Favor regularizar o cadastro dos itens abaixo:\n\n" + lista,
            "Diones",
            'diones.nascimento@magius.com.br'
        )
        emailSemCadEnviado = true;
        semCadastro = []
*/

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



function atualizaEcoat(dados, destino) {

    dadosCompl[destino] = dados
}

module.exports.atualizaEcoat = atualizaEcoat



// *********** INICIALIZA DATA E HORA ATUAL ************
var dateTime = moment(); // Data e hora atual

var formato = "HH:mm:ss"; // fomato para data e hora utilizado nos cálculos de turno

const horaAtual = moment(dateTime, formato) // hora atual


// Função para inverter a Hora-fim e Hora-Inicio, se necessário
function verifHora(horaRec, turno) {
    let tempo = 0.0

    let horaComp = moment(horaRec, formato)
    let Inicio = moment(config["turnos"][`Turno${turno}`]["inicio"], formato)
    let Fim = moment(config["turnos"][`Turno${turno}`]["fim"], formato)

    if (moment(Inicio).isAfter(Fim)) {
        if (moment(horaComp).isBetween(moment("00:00:00", formato), Fim)) {
            tempo = (parseFloat(moment(horaComp).diff(moment("00:00:00", formato), "minute")) +
                parseFloat(moment(moment("23:59:59", formato)).diff(Inicio, "minute"))) / 60

            return { turno: turno, dif: tempo }

        } else if (moment(horaComp).isBetween(Inicio, moment("23:59:59", formato))) {
            tempo = parseFloat(moment(horaComp).diff(Inicio, "minute")) / 60
            return { turno: turno, dif: tempo }
        } else {
            tempo = (parseFloat(moment(Fim).diff(moment("00:00:00", formato), "minute")) +
                parseFloat(moment(moment("23:59:59", formato)).diff(Inicio, "minute"))) / 60
            return { turno: 0, dif: tempo }
        }

    } else if (moment(horaComp).isBetween(Inicio, Fim)) {
        tempo = parseFloat(moment(horaComp).diff(Inicio, "minute")) / 60
        return { turno: turno, dif: tempo }
    } else {
        tempo = parseFloat(moment(Fim).diff(Inicio, "minute")) / 60
        return { turno: 0, dif: tempo }
    }
}
const tempoT1 = verifHora(config.turnos.Turno1.fim, 1).dif
const tempoT2 = verifHora(config.turnos.Turno2.fim, 2).dif
const tempoT3 = verifHora(config.turnos.Turno3.fim, 3).dif


// Testes de turno para saber qual o turno
function testeTurno(horaRec) {
    let t1 = verifHora(horaRec, 1);
    let t2 = verifHora(horaRec, 2);
    let t3 = verifHora(horaRec, 3);

    if (t1.turno > 0) {
        return t1
    } else if (t2.turno > 0) {
        return t2
    } else if (t3.turno > 0) {
        return t3
    } else {
        return { turno: 0, tempo: 0 }
    }

}

/*console.log(
"1", verifHora('',1),
"2", verifHora('',2),
"3", verifHora('',3),
"1", verifHora('',1),
)*/


fEnviaEmailSemCad(listaSemCadCompl);


// *********** LEITURA DOS DADOS DO BD E SEPARAÇÃO ************
function respostaBD(string, destino) {

    bdMES.conectarMES(string).then(
        function (respostaBD) {

            let horaAtualCmp = moment(new Date()).format(formato) // Hora atual completa
            let turnoAtual = testeTurno(horaAtualCmp).turno

            function extratDados(dadosBD) {

                return new Promise(
                    function (resolve, reject) {

                        resolve(

                            dadosBD.recordset.reduce(function (acc, index) {

                                let inicioDia = moment(config.turnos.Turno1.inicio, formato).format(formato)
                                let horaReg2d = moment.utc(index.Hora, "AAAA-MM-DDTHH:mm:ss").format("HH")
                                let diaReg2d = moment.utc(index.DtMov, "AAAA-MM-DDTHH:mm:ss").format("DD")
                                let horaRegCmp = moment.utc(index.Hora, "AAAA-MM-DDTHH:mm:ss").format(formato) // Hora do registro completa
                                let diaHoje2d = moment(horaAtualCmp).isBefore(inicioDia) ? moment().subtract(1, "days").format("DD") : moment().format("DD")
                                let diaOntem2d = moment().subtract(1, "days").format("DD")
                                let turnoReg = testeTurno(horaRegCmp).turno

                                var m2RegAtual = 0.0

                                // Calcula quantidade de m2 para o item
                                if (vItemsList[index.Code]["m2"] > 0) {

                                    m2RegAtual = parseFloat(parseInt(index.MovQty) * parseFloat(vItemsList[index.Code]["m2"]))

                                } else { // Verifica itens sem cadastro e adiciona na lista nova

                                    if (!semCadastro.includes(index.Code)) {

                                        semCadastro.push(index.Code)

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

                                    acc[quando][`Turno${turnoReg}`]["horarios"][horaReg2d] = acc[quando][`Turno${turnoReg}`]["horarios"][horaReg2d] || 0
                                    acc[quando][`Turno${turnoReg}`]["soma"] = acc[quando][`Turno${turnoReg}`]["soma"] || 0
                                    acc[quando][`Turno${turnoReg}`]["horarios"][horaReg2d] += m2RegAtual
                                    acc[quando][`Turno${turnoReg}`]["soma"] += m2RegAtual

                                }

                                return acc

                            },
                                {} // valor inicial do reduce
                            )
                        )

                    }

                )


            }


            extratDados(respostaBD).then(  // Calcula média

                function (respostaED) {

                    //ioSocket.atualizaDados(respostaED, destino)

                    respostaED["metaP"] = config.metas[`metaP_${destino.split("dados")[1]}`]

                    respostaED["turnoAtual"] = turnoAtual

                    respostaED["Ontem"]["Turno1"]["media"] = respostaED["Ontem"]["Turno1"]["soma"] / tempoT1

                    respostaED["Ontem"]["Turno2"]["media"] = respostaED["Ontem"]["Turno2"]["soma"] / tempoT2

                    respostaED["Ontem"]["Turno3"]["media"] = respostaED["Ontem"]["Turno3"]["soma"] / tempoT3



                    let tempoT1Hoje
                    let tempoT2Hoje
                    let tempoT3Hoje

                    turnoAtual = 1 ? tempoT1Hoje = verifHora(horaAtualCmp, 1).dif : tempoT1Hoje = tempoT1
                    turnoAtual = 2 ? tempoT2Hoje = verifHora(horaAtualCmp, 2).dif : tempoT2Hoje = tempoT2
                    turnoAtual = 3 ? tempoT3Hoje = verifHora(horaAtualCmp, 3).dif : tempoT3Hoje = tempoT3


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


const stringPP = "select me.DtMov, convert(time, me.DtTimeStamp) Hora, me.IDResource, me.Shift, me.IDProduct, me.MovQty, me.UndoIDMovEv, me.RelatedIDMovEv, me.IDMovEv, p.Code from TBLMovEv me inner join TBLProduct p on (p.IDProduct = me.IDProduct) where me.IDResource=97 and me.DtMov >= convert(datetime2, DATEADD(dd, 0, DATEDIFF(dd, 0, GETDATE()-3)))"

const stringPL = "select me.DtMov, convert(time, me.DtTimeStamp) Hora, me.IDResource, me.Shift, me.IDProduct, me.MovQty, me.UndoIDMovEv, me.RelatedIDMovEv, me.IDMovEv, p.Code from TBLMovEv me inner join TBLProduct p on (p.IDProduct = me.IDProduct) where me.IDResource=108 and me.DtMov >= convert(datetime2, DATEADD(dd, 0, DATEDIFF(dd, 0, GETDATE()-3)))"

const formacaoKit = "select me.DtMov, convert(time, me.DtTimeStamp) Hora, me.IDResource, me.Shift, me.IDProduct, me.MovQty, me.UndoIDMovEv, me.RelatedIDMovEv, me.IDMovEv, p.Code from TBLMovEv me inner join TBLProduct p on (p.IDProduct = me.IDProduct) where me.IDResource=107 and me.DtMov >= convert(datetime2, DATEADD(dd, 0, DATEDIFF(dd, 0, GETDATE()-3)))"

const stringEE = "select ctbl.IDWOGRP, item.Code, ctbl.IDBastidor, ctbl.Quantidade AS MovQty, ctbl.DTTIMESTAMP, convert(time, ctbl.DTTIMESTAMP) Hora, CASE WHEN DATEPART(hh,ctbl.DTTIMESTAMP)<6 then ctbl.DTTIMESTAMP-1 ELSE ctbl.DTTIMESTAMP END as DtMov from CTBLWOGRP ctbl inner join TBLWOHD op on (op.Code = ctbl.WOCODE) inner join TBLProduct item on (item.IDProduct = op.IDProduct) where ctbl.IDBastidor is not null  and  CASE WHEN DATEPART(hh,ctbl.DTTIMESTAMP)<6 then ctbl.DTTIMESTAMP-1 ELSE ctbl.DTTIMESTAMP END  >= convert(datetime2, DATEADD(dd, 0, DATEDIFF(dd, 0, GETDATE()-3)))"

setTimeout(() => { respostaBD(stringPP, "dadosPP") }, 15000)

criarInterval(30000, stringPP, "dadosPP")

setTimeout(criarInterval, 2000, 30000, stringEE, "dadosEE")

setTimeout(criarInterval, 4000, 30000, stringPL, "dadosPL")

setTimeout(criarInterval, 6000, 30000, formacaoKit, "dadosFK")


function criarInterval(tempo, string, destino) {
    setInterval(respostaBD, tempo, string, destino); // Cria intervalo para leitura dos dados no BD
}

module.exports.respostaBD = respostaBD

const Zeno = require('./BD/apiZeno')
Zeno;
