
// Função para calcular os dados recebidos da consulta do banco de dados
const workerpool = require('workerpool');

const moment = require('moment')

const calcHorarios = require('../Services/calcHorarios')

async function dadosComp(respBD, ht, list, unid) {

    console.log("Iniciando Compilação dos dados recebidos! Horas trabalhadas? ", ht, "Data-hora: ", new Date())

    // Calcular início e fim da coleta de dados e criar os index para cada hora se for por hora ou index do dia se for dia, ou mês se for mês
    // Gráfico tem que ser pelos index do intervalo total

    const turnosSelec = respBD[1].turnos

    return respBD[0].reduce(function (acc, index) {
        
        let dataElement = moment.utc(index["dtmov"], "DD/MM/YYYY HH:mm:ss")
        let horaElement = moment.utc(index["hora"], "DD/MM/YYYY HH:mm:ss").format("HH:mm:ss")

        // Formata dataIndex de acordo com as datas recebidas
        var dataIndex = ''
        let ano = moment.utc(dataElement).format("YYYY")
        let mes = moment.utc(dataElement).format("MM")
        let dia = moment.utc(dataElement).format("DD")
        let hora = moment.utc(horaElement, "HH:mm:ss").format("HH")

        if (respBD[1].periodo === "hora") {
            dataIndex = `${ano}${mes}${dia}${hora}`
        } else if (respBD[1].periodo === "dia") {
            dataIndex = `${ano}${mes}${dia}`
        } else {
            dataIndex = `${ano}${mes}`
        }

        
        if ( // Verifica se o turno foi selecionado para o horário do index atual

        (turnosSelec.includes("t" + calcHorarios.testeTurno(horaElement).turno) && (respBD[1]["CT"].includes("EE") || respBD[1]["CT"].includes("ecoat"))) ||
            turnosSelec.includes("t" + index.shift)

        ) {

            acc = acc || {}

            acc[dataIndex] = acc[dataIndex] || 0

            if (ht === true) {

                    let formatoCompleto = "DD/MM/YYYY HH:mm:ss"
                    let formatoHora = "DD/MM/YYYY HH"

                    let horaHtInicio = moment.utc(index.shiftdtstart, formatoCompleto)
                    let horaHtFim = moment.utc(index.shiftdtend, formatoCompleto)
                    let horaIniInt = parseInt(moment(horaHtInicio, formatoCompleto).format("HH"))
                    let horaFimInt = parseInt(moment(horaHtFim, formatoCompleto).format("HH"))
                    let horaFimArred = moment.utc(moment.utc(horaHtFim).format(formatoHora), formatoHora)

                    let horaTmp = moment.utc(JSON.stringify(moment.utc(horaHtInicio).format(formatoHora))+":00:00", formatoCompleto)

                    if (moment(horaHtFim, formatoCompleto).isValid()) {

                        acc[dataIndex] = acc[dataIndex] || parseFloat(0.0)
          
                        // Se a hora final for maior do que a hora inicial e o relatório pede por hora e hora
                        if (!moment(horaIniInt).isSame(horaFimInt) && respBD[1].periodo === "hora") {//!moment(horaHtInicio).isSame(horaHtFim) ){ // && respBD[1].periodo === "hora") {

                            //Enquanto hora temporária for menor do que a hora fim
                            while (moment(horaTmp).isSameOrBefore(horaHtFim)) {
                                let difHora = 0.0
                                
                                //console.log(horaFimArred)

 
                                if (moment(horaTmp).isSame(horaFimArred)) {
                                    difHora = parseFloat(parseInt(moment(horaHtFim).diff(horaTmp,"seconds")) / 60 / 60)
                                    
                                } else if(parseInt(moment(horaTmp).format("HH")) === horaIniInt) {
                                    difHora = parseFloat(parseInt(moment(horaTmp).add(1,"hours").diff(horaHtInicio,"seconds")) / 60 / 60)

                                } else {
                                    difHora = 1
                                }

                                acc[dataIndex] += difHora;
                               
                                horaTmp = moment(horaTmp).add(1, 'hours')

                            }

                        } else {
                            let difHora = parseFloat(moment(horaHtFim, formatoCompleto).diff(moment(horaHtInicio, formatoCompleto), "seconds")) / 60 / 60

                            acc[dataIndex] += difHora;

                        }


                        
                        let accTemp = acc[dataIndex].toFixed(1)

                        acc[dataIndex] = parseFloat(accTemp)


                    }


                    return acc

            } else if (respBD[1].CT.includes('ecoat')) {

                acc[dataIndex] = acc[dataIndex] + 1

                return acc

            } else {
                let quantidade = 0.0
                if (index.undoidmovev !== '' && index.relatedidmovev === '') {
                    quantidade = parseFloat(index["movqty"]) * (-1)
                } else {
                    quantidade = parseFloat(index["movqty"])
                }

                try {
                    if (list[index.code][unid] > 0) {

                        acc[dataIndex] = (parseFloat(acc[dataIndex]) + parseFloat(quantidade * parseFloat(list[index.code][unid]))).toFixed(1)


                    } else {
                        console.log(" ITEM NÃO CADASTRADO: ", index.code, " - Valor: ", list[index.code][unid], " - Unidade: ", unid)
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
