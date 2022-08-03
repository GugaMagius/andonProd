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
        Functions.escreverLog(msg)
    }

}

setTimeout(mostraSemCad, 50000, semCadastro);



// ********* Inicialização do arquivo de dados ***********
var arqDados = ''
var dadosCompl = require('./dados').dadosCompl
module.exports.retornaDados = dadosCompl


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


// *********** Função de cálculo do turno atual ************

function atualizaArq() {
    return new Promise(
        function (resolve2, reject) {




            /* **************** CÁLCULO DA MÉDIA DE HOJE ****************** */
            // TURNO 1
            if (turnoAtual === 1) {
                calcTurno().then(
                    function (res) {

                        medTmp = arqDados["Hoje"]["Turno1"]["soma"] / res

                        resolve(arqDados["Hoje"]["Turno1"]["media"] = medTmp)


                    }
                )
            } else {

                Functions.calcDifHora(config.turnos.Turno1.inicio, config.turnos.Turno1.fim).then(
                    function (res) {

                        medTmp = arqDados["Hoje"]["Turno1"]["soma"] / res

                        resolve(arqDados["Hoje"]["Turno1"]["media"] = medTmp)

                    }
                )

            }


            // TURNO 2

            if (turnoAtual === 2) {
                calcTurno().then(
                    function (res) {

                        medTmp = parseInt(arqDados["Hoje"]["Turno2"]["soma"]) / res

                        resolve(arqDados["Hoje"]["Turno2"]["media"] = medTmp)

                    }
                )
            } else {

                Functions.calcDifHora(config.turnos.Turno2.inicio, config.turnos.Turno2.fim).then(
                    function (res) {

                        medTmp = arqDados["Hoje"]["Turno2"]["soma"] / res

                        resolve(arqDados["Hoje"]["Turno2"]["media"] = medTmp)


                    }
                )
            }



            // TURNO 3

            if (turnoAtual === 3) {
                calcTurno().then(
                    function (res) {

                        medTmp = parseInt(arqDados["Hoje"]["Turno3"]["soma"]) / res

                        resolve(arqDados["Hoje"]["Turno3"]["media"] = medTmp)


                    }
                )
            } else {


                Functions.calcDifHora(config.turnos.Turno3.inicio, config.turnos.Turno3.fim).then(
                    function (res) {

                        medTmp = arqDados["Hoje"]["Turno3"]["soma"] / res

                        resolve(arqDados["Hoje"]["Turno3"]["media"] = medTmp)


                    }
                )
            }





            /* **************** CÁLCULO DA MÉDIA DE ONTEM ****************** */
            // TURNO 1
            Functions.calcDifHora(config.turnos.Turno1.inicio, config.turnos.Turno1.fim).then(
                function (res) {

                    medTmp = arqDados["Ontem"]["Turno1"]["soma"] / res

                    arqDados["Ontem"]["Turno1"]["media"] = medTmp
                }
            )

            // TURNO 2
            Functions.calcDifHora(config.turnos.Turno2.inicio, config.turnos.Turno2.fim).then(
                function (res) {

                    medTmp = arqDados["Ontem"]["Turno2"]["soma"] / res

                    arqDados["Ontem"]["Turno2"]["media"] = medTmp
                }
            )

            // TURNO 3
            Functions.calcDifHora(config.turnos.Turno3.inicio, config.turnos.Turno3.fim).then(
                function (res) {

                    medTmp = arqDados["Ontem"]["Turno3"]["soma"] / res

                    arqDados["Ontem"]["Turno3"]["media"] = medTmp
                }
            )

        }
    )
}




// *********** LEITURA DOS DADOS DO BD E SEPARAÇÃO ************
function respostaBD(string, destino) {

    bdMES.conectarMES(string).then(
        function (respostaBD) {

            function extratDados(dadosBD) {

                return new Promise(
                    function (resolve, reject) {

                        resolve(

                            dadosBD.recordset.reduce(function (acc, index) {

                                let inicioDia = moment(config.turnos.Turno1.inicio, formato).format(formato)
                                let horaReg2d = moment.utc(index.Hora, "AAAA-MM-DDTHH:mm:ss").format("HH")
                                let diaReg2d = moment.utc(index.DtMov, "AAAA-MM-DDTHH:mm:ss").format("DD")
                                let horaAtualCmp = moment().format(formato) // Hora atual completa
                                let horaRegCmp = moment.utc(index.Hora, "AAAA-MM-DDTHH:mm:ss").format(formato) // Hora do registro completa
                                let diaHoje2d = moment(horaAtualCmp).isBefore(inicioDia) ? moment().subtract(1, "days").format("DD") : moment().format("DD")
                                let diaOntem2d = moment().subtract(1, "days").format("DD")
                                let turno = testeTurno(horaRegCmp).turno

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

                                    acc[quando][`Turno${turno}`]["horarios"][horaReg2d] = acc[quando][`Turno${turno}`]["horarios"][horaReg2d] || 0
                                    acc[quando][`Turno${turno}`]["soma"] = acc[quando][`Turno${turno}`]["soma"] || 0
                                    acc[quando][`Turno${turno}`]["horarios"][horaReg2d] += m2RegAtual
                                    acc[quando][`Turno${turno}`]["soma"] += m2RegAtual


                                    console.log(`Valor atual para ${quando} no turno ${turno} na hora ${horaReg2d}: ${acc[quando][`Turno${turno}`]["horarios"][horaReg2d]}`)
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
                    console.log(JSON.stringify(respostaED), destino)

                    //ioSocket.atualizaDados(respostaED, destino)
                    ioSocket.dadosServer[destino] = respostaED


                    /*
                                        try {
                                            let statusConex = ioSocket.verifConexao();
                                            if (statusConex === true) {
                    
                                                arqDados["Hoje"]["somaDia"] = parseFloat(arqDados["Hoje"]["Turno1"]["soma"]) + parseFloat(arqDados["Hoje"]["Turno2"]["soma"]) + parseFloat(arqDados["Hoje"]["Turno3"]["soma"])
                                                arqDados["Ontem"]["somaDia"] = parseFloat(arqDados["Ontem"]["Turno1"]["soma"]) + parseFloat(arqDados["Ontem"]["Turno2"]["soma"]) + parseFloat(arqDados["Ontem"]["Turno3"]["soma"])
                                                let tempoT1h = !parseFloat(arqDados.Hoje.Turno1.media) > 0 ? 0 : arqDados.Hoje.Turno1.soma / arqDados.Hoje.Turno1.media
                                                let tempoT2h = !parseFloat(arqDados.Hoje.Turno2.media) > 0 ? 0 : arqDados.Hoje.Turno2.soma / arqDados.Hoje.Turno2.media
                                                let tempoT3h = !parseFloat(arqDados.Hoje.Turno3.media) > 0 ? 0 : arqDados.Hoje.Turno3.soma / arqDados.Hoje.Turno3.media
                                                let tempoT1o = !parseFloat(arqDados.Ontem.Turno1.media) > 0 ? 0 : arqDados.Ontem.Turno1.soma / arqDados.Ontem.Turno1.media
                                                let tempoT2o = !parseFloat(arqDados.Ontem.Turno2.media) > 0 ? 0 : arqDados.Ontem.Turno2.soma / arqDados.Ontem.Turno2.media
                                                let tempoT3o = !parseFloat(arqDados.Ontem.Turno3.media) > 0 ? 0 : arqDados.Ontem.Turno3.soma / arqDados.Ontem.Turno3.media
                    
                                                arqDados["Hoje"]["mediaDia"] = arqDados["Hoje"]["somaDia"] / (tempoT1h + tempoT2h + tempoT3h)
                                                arqDados["Ontem"]["mediaDia"] = arqDados["Ontem"]["somaDia"] / (tempoT1o + tempoT2o + tempoT3o)
                    
                                                //console.log("ARQUIVO DE DADOS PRINCIPAL: ", dadosCompl)
                                            }
                    
                                            //arqDados = DadosIni
                                        } catch (err) {
                                            console.log("Falha ao conectar ao cliente: ", err, " - Verificar se existe algum cliente conectado")
                                        }
                                        */

                }
            )

        }

    )
        .catch(
            function (res) {
                Functions.escreverLog("Erro ao conectar ao banco de dados: ", res)
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
