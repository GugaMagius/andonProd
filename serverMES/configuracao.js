const turnos = {
    Turno1: {
        inicio: "06:00:00",
        fim: "15:00:00"
    },
    Turno2: {
        inicio: "15:00:00",
        fim: "23:35:00"
    },
    Turno3: {
        inicio: "23:35:00",
        fim: "06:00:00"
    },

}

module.exports.turnos = turnos

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

        metaP_PP: " >= 56",
        metaP_PL: " >= 32",
        metaP_EE: " >= 125",
        metaP_FK: " >= 130",
        turno: 0
        
    }

    
module.exports.DadosIni = DadosIni