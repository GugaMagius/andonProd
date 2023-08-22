const axios = require("axios")

const SERVERURL = "http://192.168.1.4:7078/SqlQuery/QueryBrowser"


async function getDataSQL(stringRec, BD, parametros) {

    try {
        const requestBody = {
            q: stringRec,
            conn: BD
        }
        return [await axios.post(SERVERURL, requestBody).then(res => res.data.result), parametros]

    } catch (err) {
        Functions.escreverLog(`Falha ao acessar a API Zeno - erro: ${err}`)
    }
}

module.exports.getDataSQL = getDataSQL