
var sql = require("mssql");

var config = require('../configs')

async function queryBD(query) {

    try {
        await sql.connect(config.connAndon);

        var request = new sql.Request();

        console.log("Consulta a ser realizada: ", query);

        return await request.query(query);

    } catch (error) {
        console.log("Erro ao consultar BD:", error);
        throw error; // Lança o erro para que possa ser tratado no chamador da função
    }
}

module.exports.queryBD = queryBD

