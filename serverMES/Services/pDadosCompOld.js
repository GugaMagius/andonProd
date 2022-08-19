
// Função para calcular os dados recebidos da consulta do banco de dados
const workerpool = require('workerpool');

const moment = require('moment')

const calcHorarios = require('../Services/calcHorarios')


async function dadosComp(respBD, ht, list, config) {

    console.log("Iniciando Compilação dos dados recebidos! Horas trabalhadas? ", ht, "Data-hora: ", new Date())


    // Calcular início e fim da coleta de dados e criar os index para cada hora se for por hora ou index do dia se for dia, ou mês se for mês
    // Gráfico tem que ser pelos index do intervalo total

    const turnosSelec = respBD[1].turnos

    console.log("TURNO SELEC: ", turnosSelec)


    return respBD[0].reduce(function (acc, index) {
        let dataElement = moment.utc(index["data"], "DD/MM/YYYY HH:mm:ss")
        let horaElement = moment.utc(dataElement).format("HH:mm:ss")

    /*
        // Verifica se dados são para cálculo de Horas Trabalhadas
        if (ht === true) {


            let horaHt = moment.utc(index["shiftdtstart"], "DD/MM/YYYY hh:mm:ss").format("HH")
            let minHt = index["shiftdtend"].getUTCMinutes().toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false, })


            dataElement = new Date(index["dtprod"])
            horaElement = new Date(`1970-01-01T${horaHt}:${minHt}`)
            //horaElement = new Date("1970", "00", "01", horaHt, minHt)
        } else {
            console.log("Hora inicio", moment.utc(index["shiftdtstart"], "DD/MM/YYYY hh:mm:ss").format("HH"))
            console.log(index)
            dataElement = new Date(index["DtMov"])
            horaElement = new Date(`${index["Hora"]}-6:00`)
        }
    */

        // Formata dataIndex de acordo com as datas recebidas
        var dataIndex = ''
        let ano = moment(dataElement).format("YYYY")
        let mes = moment(dataElement).format("MM")
        let dia = moment(dataElement).format("DD")
        let hora = moment(dataElement).format("HH")


        if (respBD[1].periodo === "hora") {
            dataIndex = `${ano}${mes}${dia}${hora}`
        } else if (respBD[1].periodo === "dia") {
            dataIndex = `${ano}${mes}${dia}`
        } else {
            dataIndex = `${ano}${mes}`
        }


        if ( // Verifica se o turno foi selecionado para o horário do index atual

            turnosSelec.includes("t"+calcHorarios.testeTurno(horaElement).turno)

        ) {

            acc = acc || {}

            acc[dataIndex] = acc[dataIndex] || 0

            if (ht === true) {                
                console.log("HT")


                if (index.shiftdtend >= 0 && index.shiftdtend != null && index.shiftdtend != undefined) {
                    let horaHtInicio = index["shiftdtstart"].getUTCHours()
                    let minHtInicio = index["shiftdtstart"].getMinutes()
                    let horaHtFim = index["shiftdtend"].getUTCHours()
                    let minHtFim = index["shiftdtend"].getMinutes()


                    // Se a hora final for maior do que a hora inicial e o relatório pede por hora e hora
                    if (horaHtInicio != horaHtFim && respBD[1].periodo === "hora") {
                        let hrTmp = parseInt(horaHtInicio)

                        //Enquanto hora temporária for menor do que a hora fim
                        while (hrTmp <= horaHtFim) {
                            let hora2dig = hrTmp.toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false, })

                            dataIndex = `${ano}${mes}${dia}${hora2dig}` // Cria index para a hora adicional

                            //acc = acc || {}

                            acc[dataIndex] = acc[dataIndex] || parseFloat(0.0)


                            let difHora = 0

                            // Se a hora temporária for menor do que a hora fim:
                            if (hrTmp < horaHtFim && hrTmp === horaHtInicio) {

                                difHora = (60 - minHtInicio) / 60;

                            } else if (hrTmp != horaHtFim) {
                                difHora = 1;
                            } else {

                                difHora = minHtFim / 60;

                            }

                            acc[dataIndex] += difHora;

                            hrTmp <= 23 ? hrTmp++ : 0
                        }

                        //console.log("Hora acumulada: ", acc[dataIndex], " - Inicio: ", index["shiftdtstart"], " - Fim: ", index["shiftdtend"])

                        // Se a hora for igual ou se o relatório não for por hora então executa:
                    } else {

                        let difHora = new Date(index.shiftdtend - index.shiftdtstart) / 1000 / 60 / 60;

                        acc[dataIndex] += difHora;

                    }

                }

                return acc

            } else if (respBD[1].CT.includes('ecoat')) {
                
                acc[dataIndex] = acc[dataIndex] + 1

                return acc

            } else {
                
                console.log("Outros")

                try {
                    if (list[index.code][respBD[1].unidade] > 0) {

                        acc[dataIndex] = (parseFloat(acc[dataIndex]) + parseFloat(parseInt(index["movqty"]) * list[index.code][respBD[1].unidade])).toFixed(1)


                    } else {
                        console.log(" ITEM NÃO CADASTRADO: ", index.code, " - Valor: ", list[index.code][respBD[1].unidade])
                    }

                } catch (err) {
                    console.log("NÃO FOI POSSÍVEL LER VALORES DO ITEM: ", index.code)
                }

                return acc

            }

        } else {

            return acc
        }

    }, {});
}

// create a worker and register public functions
workerpool.worker({
    dadosComp: dadosComp
});
