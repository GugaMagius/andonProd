console.log("INICIANDO BD do MES")


const sqlMES = require("mssql");
const configMES = {
    user: 'supervisorio',
    password: 'magius',
    server: 'srvmes',
    database: 'PCF4',
    trustServerCertificate: true,
    Trusted_Connection: true,
    "options": {
        "encrypt": true,
        "enableArithAbort": true
    }
}

const Function = require('../Services/functions')

try {

    function conectarMES(string) {
        return new Promise(
            function (resolve, reject) {

                try {
                    sqlMES.connect(configMES, function (err) {

                        if (err) {
                            console.log(err);

                            Function.escreverLog("falha ao conectar ao Banco de dados durante conectarMES - erro: ", err)

                            reject(err)

                        } else {

                            async function consulta() {

                                // create Request object
                                var requestMES = new sqlMES.Request();

                                let query = string

                                try {
                                    await requestMES.query(query, function (err, recordset) {

                                        if (err) {Function.escreverLog("falha ao gerar query durante conectarMES - erro: ", err) } 

                                        // send records as a response
                                        resolve(recordset);

                                    });
                                } catch (err) {
                                    Function.escreverLog("falha ao consultar o Banco de dados durante conectarMES - erro: ", err)
                                    reject(err)
                                }


                            }
                            consulta();
                        }
                    });
                } catch (err) {
                    Function.escreverLog("Erro ao consultar BD do MES durante conectarMES - erro: ", err)
                    reject(err)
                }

            }

        )
    }

    module.exports.conectarMES = conectarMES

} catch (err) {

    Function.escreverLog("Falha Geral ao conectar ao Banco de dados durante conectarMES - erro: ", err)

}

try {

    async function selectBD(selectString, parametros) {

        return new Promise(
            async function (resolve, reject) {
                // connect to your database
                try {
                    sqlMES.connect(configMES, function (err) {

                        if (err) {
                            console.log(err);

                            Function.escreverLog("Falha ao conectar ao Banco de dados durante SelectBD - erro: ", err)

                            reject("Falha ao conectar")

                        } else {

                            // create Request object
                            var request = new sqlMES.Request();

                            // query to the database and get the records
                            //let query = "select " + filtro + " from " + tabela + " where data between " + data1 + " and " + data2
                            let query = selectString
                            request.query(query, function (err, recordset) {

                                console.log("QUERY DA CONSULTA AO BANCO DE DADOS: ", query, "PARAMETROS: ", parametros)

                                if (err) {Function.escreverLog("falha ao consultar o BD durante SelectBD - erro: ", err) }

                                // send records as a response
                                resolve([recordset, parametros])

                            });
                        }
                    });
                } catch (err) {
                    console.log("Erro ao consultar BD ", err)
                    
                    Function.escreverLog("Erro ao consultar BD durante SelectBD - erro: ", err)
                }
            })
    }
    module.exports.selectBD = selectBD

} catch (err) {

    Function.escreverLog("Falha Geral ao conectar ao Banco de dados durante SelectBD - erro: ", err)

}

