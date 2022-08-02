const axios = require("axios")

const Functions = require('../Services/functions')

const main = require('../server')

const SERVERURL = "http://192.168.1.4:7078/home/Query"

/*
function getDataOneItem(itemCode){

    const requestBody = {
        q: 'select item."it-codigo", item."peso-liquido", "es-item"."area" from pub.item left join custom.pub."es-item" on ("es-item"."it-codigo" = item."it-codigo") where item."it-codigo"=\''+itemCode+'\'  with(nolock)',
        bd: null,
        port: "24611"
    }
    return axios.post(SERVERURL, requestBody).then(res=>res.data)
}


getDataOneItem("CCI510-6526").then( res => {
    console.log("valor obtido do item: ", res)
})
*/
async function getDataAllOfThem() {

    try {
        const requestBody = {
            q: 'select item."it-codigo", item."peso-liquido", "es-item"."area" from pub.item left join custom.pub."es-item" on ("es-item"."it-codigo" = item."it-codigo")  with(nolock)',
            bd: null,
            port: "23611"
        }
        return axios.post(SERVERURL, requestBody).then(res => res.data)

    } catch (err) {
        Functions.escreverLog(`Falha ao acessar o BD do Datasul - erro: ${err}`)
    }
}



// Adquire lista de itens do Datasul
async function listUpdate() {
    await getDataAllOfThem().then(res => {
        main.itemsListUpdate(res.result)
    })
}

listUpdate(); // Atualiza lista no primeiro ciclo


setInterval(listUpdate, 3 * 60 * 60 * 1000) // Atualiza lista de itens a cada 3 horas

