console.log("INICIANDO BD do Supervisório")


const sqlSup = require("mssql");
const configSup = {
    user: 'gustavo',
    password: 'magius@2021',
    server: 'MGU-SERVER02',
    database: 'SUPERVISORIO',
    trustServerCertificate: true,
    Trusted_Connection: true,
    "options": {
        "encrypt": true,
        "enableArithAbort": true
    }
}

function conectar(string, destino) {
    return new Promise(
        async function (resolve, reject) {

            try {
                sqlSup.connect(configSup, function (err) {

                    if (err) {
                        console.log(err);

                    } else {

                        async function consulta(stringEnv, destinoEnv) {

                            // create Request object
                            var requestSup = new sqlSup.Request();

                            // query to the database and get the records
                            //let query = "select " + filtro + " from " + tabela + " where data between " + data1 + " and " + data2
                            //let query = "select " + filtro + " from " + tabela
                            //let query = "select * from cicloEcoat where data between '2022-05-12 06:00' AND '2022-05-13 18:00' "

                            let query = stringEnv //"select ce.id, ce.data, convert(time, data) Hora, CASE WHEN DATEPART(hh,ce.data)<6 then DAY(data-1) ELSE DAY(data) END DataProd from cicloEcoat ce where CASE WHEN DATEPART(hh,ce.data)<6 then data-1 ELSE data END >= convert(datetime2, DATEADD(dd, 0, DATEDIFF(dd, 0, GETDATE()-1)))"


                            await requestSup.query(query, function (err, recordset) {
                                //console.log("QUERY DA CONSULTA AO BANCO DE DADOS DO SUPERVISÓRIO: ", query)
                                if (err) console.log(err)

                                // send records as a response
                                resolve(recordset, destinoEnv);

                            });

                        }
                        consulta(string, destino);
                    }
                });
            } catch (err) {
                console.log("Erro ao consultar BD do supervisório ", err)
            }

        }

    )
}

module.exports.conectarSuperv = conectar



function selectBD(selectString, parametros) {

    return new Promise(
        function (resolve, reject) {
            // connect to your database
            try {
                sqlSup.connect(configSup, function (err) {

                    if (err) {
                        console.log(err);

                    } else {

                        // create Request object
                        var request = new sqlSup.Request();

                        // query to the database and get the records

                        let query = selectString
                        request.query(query, function (err, recordset) {
                            console.log("QUERY DA CONSULTA AO BANCO DE DADOS: ", query, "PARAMETROS: ", parametros)
                            if (err) console.log(err)

                            // send records as a response
                            resolve([recordset, parametros])

                        });
                    }
                });
            } catch (err) {
                console.log("Erro ao consultar BD ", err)
            }
        })
}
module.exports.selectBD = selectBD

