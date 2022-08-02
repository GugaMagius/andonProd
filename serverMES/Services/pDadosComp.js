
// Função para calcular os dados recebidos da consulta do banco de dados
const workerpool = require('workerpool');

async function dadosComp(respBD, ht, list, config) {

    console.log("Iniciando Compilação dos dados recebidos! Horas trabalhadas? ", ht, "Data-hora: ", new Date())
    //console.log("Lista: ", list)
    //console.log("Dados: ", respBD)
    //console.log("Parametros: ", respBD[1])


    // Calcular início e fim da coleta de dados e criar os index para cada hora se for por hora ou index do dia se for dia, ou mês se for mês
    // Gráfico tem que ser pelos index do intervalo total

    const turnosSelec = respBD[1].turnos

    const inicT1 = new Date("1970-01-01T" + config.turnos.Turno1.inicio)
    const fimT1 = new Date("1970-01-01T" + config.turnos.Turno1.fim)
    const inicT2 = new Date("1970-01-01T" + config.turnos.Turno2.inicio)
    const fimT2 = new Date("1970-01-01T" + config.turnos.Turno2.fim)
    const inicT3 = new Date("1970-01-01T" + config.turnos.Turno3.inicio)
    const fimT3 = new Date("1970-01-01T" + config.turnos.Turno3.fim)

    //console.log(`T1: ${inicT1}-${fimT1} / T2: ${inicT2}-${fimT2} / T3: ${inicT3}-${fimT3}`)


    return respBD[0].recordset.reduce(function (acc, index) {
        let dataElement;
        let horaElement;

        // Verifica se dados são para cálculo de Horas Trabalhadas
        if (ht === true) {

            let horaHt = index["ShiftDtStart"].getUTCHours().toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false, })
            let minHt = index["ShiftDtStart"].getUTCMinutes().toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false, })


            dataElement = new Date(index["dtprod"])
            horaElement = new Date(`1970-01-01T${horaHt}:${minHt}`)
            //horaElement = new Date("1970", "00", "01", horaHt, minHt)
        } else {
            dataElement = new Date(index["DtMov"])
            horaElement = new Date(`${index["Hora"]}-6:00`)
        }


        // Formata dataIndex de acordo com as datas recebidas
        var dataIndex = ''
        let ano = dataElement.getUTCFullYear()
        let mes = (parseInt(dataElement.getUTCMonth()) + 1).toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false, })
        let dia = dataElement.getUTCDate().toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false, })
        let hora = horaElement.getUTCHours().toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false, })


        if (respBD[1].periodo === "hora") {
            dataIndex = `${ano}${mes}${dia}${hora}`
        } else if (respBD[1].periodo === "dia") {
            dataIndex = `${ano}${mes}${dia}`
        } else {
            dataIndex = `${ano}${mes}`
        }


        if ( // Verifica se o turno foi selecionado para o horário do index atual
            (turnosSelec.includes('t1') && horaElement >= inicT1 && horaElement < fimT1) ||
            (turnosSelec.includes('t2') && horaElement >= inicT2 && horaElement < fimT2) ||
            (turnosSelec.includes('t3') && ((horaElement >= inicT3 || horaElement < fimT3) && inicT3 > inicT2 && fimT3 < inicT3))
        ) {


            acc = acc || {}

            acc[dataIndex] = acc[dataIndex] || 0

            if (ht === true) {


                if (index.ShiftDtEnd >= 0 && index.ShiftDtEnd != null && index.ShiftDtEnd != undefined) {
                    let horaHtInicio = index["ShiftDtStart"].getUTCHours()
                    let minHtInicio = index["ShiftDtStart"].getMinutes()
                    let horaHtFim = index["ShiftDtEnd"].getUTCHours()
                    let minHtFim = index["ShiftDtEnd"].getMinutes()


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

                        //console.log("Hora acumulada: ", acc[dataIndex], " - Inicio: ", index["ShiftDtStart"], " - Fim: ", index["ShiftDtEnd"])

                        // Se a hora for igual ou se o relatório não for por hora então executa:
                    } else {

                        let difHora = new Date(index.ShiftDtEnd - index.ShiftDtStart) / 1000 / 60 / 60;

                        acc[dataIndex] += difHora;

                    }

                }

                return acc

            } else if (respBD[1].CT.includes('ecoat')) {

                acc[dataIndex] = acc[dataIndex] + 1

                return acc

            } else {

                try {
                    if (list[index.Code][respBD[1].unidade] > 0) {

                        acc[dataIndex] = (parseFloat(acc[dataIndex]) + parseFloat(parseInt(index["MovQty"]) * list[index.Code][respBD[1].unidade])).toFixed(1)


                    } else {
                        //console.log(" ITEM NÃO CADASTRADO: ", index.Code, " - Valor: ", list[index.Code][respBD[1].unidade])
                    }

                } catch (err) {
                    //console.log("NÃO FOI POSSÍVEL LER VALORES DO ITEM: ", index.Code)
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
