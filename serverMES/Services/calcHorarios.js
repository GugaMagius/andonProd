

const moment = require('moment')

const formato = "HH:mm:ss"

const config = require('../configuracao')

// Função para inverter a Hora-fim e Hora-Inicio, se necessário
function verifHora(horaRec, turno) {
    let tempo = 0.0

    let horaComp = moment(horaRec, formato)
    let Inicio = moment(config["turnos"][`Turno${turno}`]["inicio"], formato)
    let Fim = moment(config["turnos"][`Turno${turno}`]["fim"], formato)

    if (moment(Inicio).isAfter(Fim)) {
        if (moment(horaComp).isSameOrAfter(moment("00:00:00", formato)) && moment(horaComp).isBefore(Fim)) {
            tempo = (parseFloat(moment(horaComp).diff(moment("00:00:00", formato), "minute")) +
                parseFloat(moment(moment("23:59:59", formato)).diff(Inicio, "minute"))) / 60

            return { turno: turno, dif: tempo }

        } else if (moment(horaComp).isSameOrAfter(Inicio) && moment(horaComp).isSameOrBefore(moment("23:59:59", formato))) {
            tempo = parseFloat(moment(horaComp).diff(Inicio, "minute")) / 60
            return { turno: turno, dif: tempo }
        } else {
            tempo = (parseFloat(moment(Fim).diff(moment("00:00:00", formato), "minute")) +
                parseFloat(moment(moment("23:59:59", formato)).diff(Inicio, "minute"))) / 60
            return { turno: 0, dif: tempo }
        }

    } else if (moment(horaComp).isSameOrAfter(Inicio) && moment(horaComp).isBefore(Fim)) {
        tempo = parseFloat(moment(horaComp).diff(Inicio, "minute")) / 60
        return { turno: turno, dif: tempo }
    } else {
        tempo = parseFloat(moment(Fim).diff(Inicio, "minute")) / 60
        return { turno: 0, dif: tempo }
    }
}
module.exports.verifHora = verifHora

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

module.exports.testeTurno = testeTurno