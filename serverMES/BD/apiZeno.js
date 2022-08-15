const axios = require("axios")

const SERVERURL = "http://192.168.1.4:7078/SqlQuery/QueryBrowser"

async function getDataSQL() {

    try {
        const requestBody = {
            q: "select top(10) * from cicloEcoat",
            conn: "Data Source=MGU-SERVER02;Initial Catalog=SUPERVISORIO;User ID=gustavo;Password=magius@2021"


            //q: "select (ct.Code + ' ' + ct.Name) as CT, ct.IDResource, mg.Code, st.Name as CC, st.IDSector, ar.Name as Depto, ar.IDArea from TBLResource ct inner join TBLManagerGrp mg on (ct.IDManagerGrp = mg.IDManagerGrp) inner join TBLSector st on (mg.IDSector = st.IDSector) inner join TBLArea ar on (st.IDArea = ar.IDArea) WHERE ar.Code LIKE '11%' OR ct.Code LIKE '1014001'",
            
            //conn: "Data Source=srvmes;Initial Catalog=PCF4;User ID=supervisorio;Password=magius"
        }
        return axios.post(SERVERURL, requestBody).then(res => res)

    } catch (err) {
        Functions.escreverLog(`Falha ao acessar a API Zeno - erro: ${err}`)
    }
}



// Adquire lista de itens do Datasul
async function listUpdate() {
    await getDataSQL().then(res => {
        console.log(res.data.result)
        //main.itemsListUpdate(res.result)
    })
}

listUpdate(); // Atualiza lista no primeiro ciclo


//setInterval(listUpdate, 3 * 60 * 60 * 1000) // Atualiza lista de itens a cada 3 horas