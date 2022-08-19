
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


        // Verifica se dados são para cálculo de Horas Trabalhadas
        /*
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

            turnosSelec.includes("t" + calcHorarios.testeTurno(horaElement).turno)

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
                                let difHora = 0
                                
                                //console.log(horaFimArred)

 
                                if (moment(horaTmp).isSame(horaFimArred)) {
                                    difHora = parseFloat(parseInt(moment(horaHtFim).diff(horaTmp,"seconds")) / 60 / 60)
                                    //console.log("É igual Hora Fim", difHora, index.shiftdtstart, " - Fim: ", index.shiftdtend)
                                } else if(parseInt(moment(horaTmp).format("HH")) === horaIniInt) {
                                    difHora = parseFloat(parseInt(moment(horaTmp).add(1,"hours").diff(horaHtInicio,"seconds")) / 60 / 60)
                                    console.log("É igual Hora Inicio", difHora, index.shiftdtstart, " - Fim: ", index.shiftdtend)

                                }
                               

/*
                                console.log("É diferente a hora - Hora atual: ", horaTmp)
                            
    
                                let hora2dig = hrTmpInt.toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false, })
    
                                dataIndex = `${ano}${mes}${dia}${hora2dig}` // Cria index para a hora adicional
    
    
    
                                // Se a hora temporária for menor do que a hora fim:
                                if (hrTmpInt < horaFimInt && hrTmpInt === horaIniInt) {
    
                                    difHora = (60 - minHtInicio) / 60;
    
                                } else if (hrTmpInt != horaHtFim) {
                                    difHora = 1;
                                } else {
    
                                    difHora = minHtFim / 60;
    
                                }
    
                                //let difHora = parseFloat(moment(horaHtFim, "HH:mm").diff(moment(horaHtInicio, "HH:mm"),"minutes")/60)
    
                                
                                                       
*/
//acc[dataIndex] += difHora;
                                horaTmp = moment(horaTmp).add(1, 'hours')
                                //console.log(horaTmp, " - Index: ", index.shiftdtstart, " - Fim: ", index.shiftdtend)
                                //console.log("Hora mais 1", horaTmp, " - Hora inicio: ", horaHtInicio, " - Hora Fim: ", horaHtFim)
                            }
     

/*
                            
                            //Enquanto hora temporária for menor do que a hora fim
                            while (hrTmpInt <= horaFimInt) {    
    
                                let hora2dig = hrTmpInt.toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false, })
    
                                dataIndex = `${ano}${mes}${dia}${hora2dig}` // Cria index para a hora adicional
    
    
    
                                // Se a hora temporária for menor do que a hora fim:
                                if (hrTmpInt < horaFimInt && hrTmpInt === horaIniInt) {
    
                                    difHora = (60 - minHtInicio) / 60;
    
                                } else if (hrTmpInt != horaHtFim) {
                                    difHora = 1;
                                } else {
    
                                    difHora = minHtFim / 60;
    
                                }
    
                                //let difHora = parseFloat(moment(horaHtFim, "HH:mm").diff(moment(horaHtInicio, "HH:mm"),"minutes")/60)
    
                                acc[dataIndex] += difHora;
    
                                hrTmpInt <= 23 ? hrTmpInt++ : 0
                            }
                            */

                                                        
                            //console.log("Hora acumulada: ", acc[dataIndex], " - Inicio: ", index["shiftdtstart"], " - Fim: ", index["shiftdtend"])

                            // Se a hora for igual ou se o relatório não for por hora então executa:
                        } else {

                            //let difHora = new Date(index.shiftdtend - index.shiftdtstart) / 1000 / 60 / 60;
                            let difHora = moment(horaHtFim, formatoCompleto).diff(moment(horaHtInicio, formatoCompleto), "minutes") / 60

                            acc[dataIndex] += difHora;

                        }

                        //console.log("DIFERENÇA DE TEMPO: ", acc[dataIndex], " - Hora Inicio: ", horaHtInicio, " - Hora Fim: ", horaHtFim)

                    }


                    return acc

            } else if (respBD[1].CT.includes('ecoat')) {

                acc[dataIndex] = acc[dataIndex] + 1

                return acc

            } else {

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
