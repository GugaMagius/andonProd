// **************************************************
// *********************PRINCIPAL********************
// **************************************************

const config = require('./configuracao')

var dateTime = new Date();
var horaAtual = dateTime.getHours().toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false, });
var minAtual = dateTime.getMinutes().toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false, });
var horaComplAtual = horaAtual + ":" + minAtual + ":00";

// ***************Conexão com o socket***************
var ioSocket = require('./socket/server') //client SOCKET

var arqDados = ''

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



// *********** Função de cálculo do turno atual ************


function atualizaArq() {
    return new Promise(
        function (resolve2, reject) {


            //console.log("Iniciando atualização do arquivo de dados")


            var turnoAtual = 0;



            function testeTurno() {
                return new Promise(
                    function (resolve, reject) {

                        dateTime = new Date();
                        horaAtual = dateTime.getHours().toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false, });
                        minAtual = dateTime.getMinutes().toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false, });
                        horaComplAtual = horaAtual + ":" + minAtual + ":00";
                        //console.log("Hora atual: ", horaAtual, ":", minAtual)


                        if ((horaAtual > config.configVar.Turno1.inicio.split(":")[0] || (horaAtual === config.configVar.Turno1.inicio.split(":")[0] && minAtual >= config.configVar.Turno1.inicio.split(":")[1])) && (horaAtual < config.configVar.Turno1.fim.split(":")[0] || (horaAtual === config.configVar.Turno1.fim.split(":")[0] && minAtual < config.configVar.Turno1.fim.split(":")[1]))) {

                            calcDifHora(config.configVar.Turno1.inicio, horaComplAtual).then(
                                function (res) {
                                    //console.log("difeerença hora turno: ", res)
                                    horaPercTurno = res
                                    turnoAtual = 1
                                    resolve(horaPercTurno)
                                }
                            )

                        } else if ((horaAtual > config.configVar.Turno2.inicio.split(":")[0] || (horaAtual === config.configVar.Turno2.inicio.split(":")[0] && minAtual >= config.configVar.Turno2.inicio.split(":")[1])) && (horaAtual < config.configVar.Turno2.fim.split(":")[0] || (horaAtual === config.configVar.Turno2.fim.split(":")[0] && minAtual < config.configVar.Turno2.fim.split(":")[1]))) {


                            calcDifHora(config.configVar.Turno2.inicio, horaComplAtual).then(
                                function (res) {
                                    //console.log("difeerença hora turno: ", res)
                                    horaPercTurno = res
                                    turnoAtual = 2
                                    resolve(horaPercTurno)
                                }
                            )




                        } else {

                            calcDifHora(config.configVar.Turno1.inicio, horaComplAtual).then(
                                function (res) {
                                    //console.log("difeerença hora turno: ", res)
                                    horaPercTurno = res
                                    turnoAtual = 3
                                    resolve(horaPercTurno)
                                }
                            )



                        }

                    }
                )

            }


            function calcTurno() {
                return new Promise(
                    function (resolve, reject) {

                        arqDados.turno = turnoAtual
                        resolve(testeTurno().then())
                    }
                )
            }



            testeTurno().then(
                function () {
                    //console.log("Finalizando calculos para média")

                    resolve2(
                        atualizaMedia().then(
                            function (res) {
                                //console.log("calculado turnos ", res)
                            }
                        )
                    )

                    function atualizaMedia() {
                        return new Promise(
                            function (resolve, reject) {


                                /* **************** CÁLCULO DA MÉDIA DE HOJE ****************** */
                                // TURNO 1
                                if (turnoAtual === 1) {
                                    calcTurno().then(
                                        function (res) {

                                            medTmp = arqDados["Hoje"]["Turno1"]["soma"] / res

                                            resolve(arqDados["Hoje"]["Turno1"]["media"] = medTmp.toFixed(1))


                                        }
                                    )
                                } else {

                                    calcDifHora(config.configVar.Turno1.inicio, config.configVar.Turno1.fim).then(
                                        function (res) {

                                            medTmp = arqDados["Hoje"]["Turno1"]["soma"] / res

                                            resolve(arqDados["Hoje"]["Turno1"]["media"] = medTmp.toFixed(1))

                                        }
                                    )

                                }


                                // TURNO 2

                                if (turnoAtual === 2) {
                                    calcTurno().then(
                                        function (res) {

                                            medTmp = parseInt(arqDados["Hoje"]["Turno2"]["soma"]) / res

                                            resolve(arqDados["Hoje"]["Turno2"]["media"] = medTmp.toFixed(1))

                                        }
                                    )
                                } else {

                                    calcDifHora(config.configVar.Turno2.inicio, config.configVar.Turno2.fim).then(
                                        function (res) {

                                            medTmp = arqDados["Hoje"]["Turno2"]["soma"] / res

                                            resolve(arqDados["Hoje"]["Turno2"]["media"] = medTmp.toFixed(1))


                                        }
                                    )
                                }



                                // TURNO 3

                                if (turnoAtual === 3) {
                                    calcTurno().then(
                                        function (res) {

                                            medTmp = parseInt(arqDados["Hoje"]["Turno3"]["soma"]) / res

                                            resolve(arqDados["Hoje"]["Turno3"]["media"] = medTmp.toFixed(1))


                                        }
                                    )
                                } else {


                                    calcDifHora(config.configVar.Turno3.inicio, config.configVar.Turno3.fim).then(
                                        function (res) {

                                            medTmp = arqDados["Hoje"]["Turno3"]["soma"] / res

                                            resolve(arqDados["Hoje"]["Turno3"]["media"] = medTmp.toFixed(1))


                                        }
                                    )
                                }




                            }
                        )
                    }


                }
            )





            /* **************** CÁLCULO DA MÉDIA DE ONTEM ****************** */
            // TURNO 1
            calcDifHora(config.configVar.Turno1.inicio, config.configVar.Turno1.fim).then(
                function (res) {

                    medTmp = arqDados["Ontem"]["Turno1"]["soma"] / res

                    arqDados["Ontem"]["Turno1"]["media"] = medTmp.toFixed(1)
                }
            )

            // TURNO 2
            calcDifHora(config.configVar.Turno2.inicio, config.configVar.Turno2.fim).then(
                function (res) {

                    medTmp = arqDados["Ontem"]["Turno2"]["soma"] / res

                    arqDados["Ontem"]["Turno2"]["media"] = medTmp.toFixed(1)
                }
            )

            // TURNO 3
            calcDifHora(config.configVar.Turno3.inicio, config.configVar.Turno3.fim).then(
                function (res) {

                    medTmp = arqDados["Ontem"]["Turno3"]["soma"] / res

                    arqDados["Ontem"]["Turno3"]["media"] = medTmp.toFixed(1)
                }
            )

        }
    )
}


// ***********Consulta ao Banco de dados ************

const bdSuperv = require('./BD/supervisorio'); // conexão com banco de dados



function respostaBD(string, destinoRec1) {


    //console.log("iniciando consulta ao Banco de dados para o destino: ", destinoRec1)

    const diaAtual = new Date().getDate();

    //console.log("dia atual", diaAtual)



    bdSuperv.conectarSuperv(string, destinoRec1).then(
        function (res) {


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

                metaP: " >= 7",
                metaS: " <= 0",

                turno: 0
            }


            //arqDados = DadosIni

            function extratDados(resp, dadosIniciais, destinoRec2) {

                return new Promise(
                    function (resolve, reject) {

                        resolve(
                            arqDados = resp.recordset.reduce(function (acc, index) {

                                var horaReg = parseInt(index.Hora.getUTCHours().toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false, }));
                                var horaRegNI = index.Hora.getUTCHours().toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false, });
                                var minReg = index.Hora.getUTCMinutes().toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false, })
                                var horarioReg = (horaRegNI + ":" + minReg + ":00")

                                //arqDados = dadosIniciais;

                                // Atualiza variáveis por DIA e por TURNO
                                // Hoje

                                function calculaDatas() {
                                    return new Promise(
                                        function (resolve, reject) {
                                            const minute = 1000 * 60;
                                            const hour = minute * 60;
                                            const day = hour * 24;

                                            var diaHojeCalc = ''
                                            var diaOntemCalc = ''

                                            if (horaComplAtual < config.configVar.Turno3.fim) {
                                                diaHojeCalc = new Date(Date.now() - (1 * day))
                                                diaOntemCalc = new Date(Date.now() - (2 * day))
                                                resolve([diaHojeCalc.getUTCDate(), diaOntemCalc.getUTCDate()])
                                            } else {
                                                diaHojeCalc = new Date();
                                                diaOntemCalc = new Date(Date.now() - (1 * day))
                                                resolve([diaHojeCalc.getUTCDate(), diaOntemCalc.getUTCDate()])
                                            }

                                        }
                                    )
                                }

                                calculaDatas().then(
                                    function ([diaHoje, diaOntem]) {
                                        //console.log("Valor1: ", diaHoje, "Valor2: ", diaOntem)

                                        if (index.DataProd === diaHoje) {

                                            // Turno 1
                                            if (horarioReg >= config.configVar.Turno1.inicio && horarioReg < config.configVar.Turno1.fim) {

                                                //console.log("TURNO 1 HOJE")

                                                acc["Hoje"]["Turno1"]["horarios"][horaReg] = acc["Hoje"]["Turno1"]["horarios"][horaReg] || 0
                                                acc["Hoje"]["Turno1"]["soma"] = acc["Hoje"]["Turno1"]["soma"] || 0
                                                acc["Hoje"]["Turno1"]["horarios"][horaReg] += 1
                                                acc["Hoje"]["Turno1"]["soma"] += 1


                                            } else if (horarioReg >= config.configVar.Turno2.inicio && horarioReg < config.configVar.Turno2.fim) {
                                                //console.log("TURNO 2 HOJE")


                                                acc["Hoje"]["Turno2"]["horarios"][horaReg] = acc["Hoje"]["Turno2"]["horarios"][horaReg] || 0
                                                acc["Hoje"]["Turno2"]["soma"] = acc["Hoje"]["Turno2"]["soma"] || 0
                                                acc["Hoje"]["Turno2"]["horarios"][horaReg] += 1
                                                acc["Hoje"]["Turno2"]["soma"] += 1


                                            } else {
                                                //console.log("TURNO 3 HOJE ")

                                                acc["Hoje"]["Turno3"]["horarios"][horaReg] = acc["Hoje"]["Turno3"]["horarios"][horaReg] || 0
                                                acc["Hoje"]["Turno3"]["soma"] = acc["Hoje"]["Turno3"]["soma"] || 0
                                                acc["Hoje"]["Turno3"]["horarios"][horaReg] += 1
                                                acc["Hoje"]["Turno3"]["soma"] += 1


                                            }

                                        } else if (index.DataProd === diaOntem) {

                                            // Turno 1
                                            if (horarioReg >= config.configVar.Turno1.inicio && horarioReg < config.configVar.Turno1.fim) {
                                                //console.log("TURNO 1 Ontem")

                                                acc["Ontem"]["Turno1"]["horarios"][horaReg] = acc["Ontem"]["Turno1"]["horarios"][horaReg] || 0
                                                acc["Ontem"]["Turno1"]["soma"] = acc["Ontem"]["Turno1"]["soma"] || 0
                                                acc["Ontem"]["Turno1"]["horarios"][horaReg] += 1
                                                acc["Ontem"]["Turno1"]["soma"] += 1


                                            } else if (horarioReg >= config.configVar.Turno2.inicio && horarioReg < config.configVar.Turno2.fim) {
                                                //console.log("TURNO 2 Ontem")

                                                acc["Ontem"]["Turno2"]["horarios"][horaReg] = acc["Ontem"]["Turno2"]["horarios"][horaReg] || 0
                                                acc["Ontem"]["Turno2"]["soma"] = acc["Ontem"]["Turno2"]["soma"] || 0
                                                acc["Ontem"]["Turno2"]["horarios"][horaReg] += 1
                                                acc["Ontem"]["Turno2"]["soma"] += 1


                                            } else {
                                                //console.log("TURNO 3 Ontem ")

                                                acc["Ontem"]["Turno3"]["horarios"][horaReg] = acc["Ontem"]["Turno3"]["horarios"][horaReg] || 0
                                                acc["Ontem"]["Turno3"]["soma"] = acc["Ontem"]["Turno3"]["soma"] || 0
                                                acc["Ontem"]["Turno3"]["horarios"][horaReg] += 1
                                                acc["Ontem"]["Turno3"]["soma"] += 1


                                            }
                                        }
                                    })

                                    return acc

                            }, dadosIniciais //Reinicializa dados para o reduce
                            )

                        )
                    }

                )


            }


            extratDados(res, DadosIni, destinoRec1).then(

                function (res) {


                    function enviarDados() {
                        return new Promise(
                            function (resolve, reject) {
                                function totalizador() {




                                }
                                //console.log("Dados calculados", arqDados)
                                resolve(totalizador())

                            }
                        )
                    }

                    atualizaArq().then(
                        function () {
                            enviarDados().then(
                                function () {

                                    arqDados["Hoje"]["somaDia"] = parseFloat(arqDados["Hoje"]["Turno1"]["soma"]) + parseFloat(arqDados["Hoje"]["Turno2"]["soma"]) + parseFloat(arqDados["Hoje"]["Turno3"]["soma"])
                                    arqDados["Ontem"]["somaDia"] = parseFloat(arqDados["Ontem"]["Turno1"]["soma"]) + parseFloat(arqDados["Ontem"]["Turno2"]["soma"]) + parseFloat(arqDados["Ontem"]["Turno3"]["soma"])
                                    let tempoT1h = arqDados.Hoje.Turno1.media > 0 ? arqDados.Hoje.Turno1.soma / arqDados.Hoje.Turno1.media : 0;
                                    let tempoT2h = arqDados.Hoje.Turno2.media > 0 ? arqDados.Hoje.Turno2.soma / arqDados.Hoje.Turno2.media : 0;
                                    let tempoT3h = arqDados.Hoje.Turno3.media > 0 ? arqDados.Hoje.Turno3.soma / arqDados.Hoje.Turno3.media : 0;
                                    let tempoT1o = arqDados.Ontem.Turno1.media > 0 ? arqDados.Ontem.Turno1.soma / arqDados.Ontem.Turno1.media : 0;
                                    let tempoT2o = arqDados.Ontem.Turno2.media > 0 ? arqDados.Ontem.Turno2.soma / arqDados.Ontem.Turno2.media : 0;
                                    let tempoT3o = arqDados.Ontem.Turno3.media > 0 ? arqDados.Ontem.Turno3.soma / arqDados.Ontem.Turno3.media : 0;
                                    arqDados["Hoje"]["mediaDia"] = arqDados["Hoje"]["somaDia"] / (tempoT1h + tempoT2h + tempoT3h)
                                    arqDados["Ontem"]["mediaDia"] = arqDados["Ontem"]["somaDia"] / (tempoT1o + tempoT2o + tempoT3o)


                                    try {
                                        ioSocket.atualizaDados(arqDados, destinoRec1)
                                        //console.log("ENVIANDO DADOS PARA O CLIENTE...2", arqDados, " - Destino: ", destinoRec1)
                                    } catch (err) {
                                        console.log("Falha ao enviar dados ao cliente, verificar se existe cliente conectado Erro: ", arqDados)
                                    }

                                    //arqDados = DadosIni
                                }
                            )
                        }
                    )


                }
            )

        }


    );


}


const prodLE = "select ce.id, ce.data, convert(time, data) Hora, CASE WHEN DATEPART(hh,ce.data)<6 then DAY(data-1) ELSE DAY(data) END DataProd from cicloEcoat ce where CASE WHEN DATEPART(hh,ce.data)<6 then data-1 ELSE data END >= convert(datetime2, DATEADD(dd, 0, DATEDIFF(dd, 0, GETDATE()-3)))"

const perdLE = "select ce.id, ce.data, convert(time, data) Hora, CASE WHEN DATEPART(hh,ce.data)<6 then DAY(data-1) ELSE DAY(data) END DataProd from bastPerdido ce where CASE WHEN DATEPART(hh,ce.data)<6 then data-1 ELSE data END >= convert(datetime2, DATEADD(dd, 0, DATEDIFF(dd, 0, GETDATE()-3)))"


criarInterval(10000, prodLE, "produzidosLE")

setTimeout(criarInterval, 5000, 10000, perdLE, "perdidosLE")

function criarInterval(tempo, string, destino) {
    setInterval(respostaBD, tempo, string, destino); // Cria intervalo para leitura dos dados no BD
}

module.exports.respostaBD = respostaBD
