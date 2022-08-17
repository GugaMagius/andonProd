const axios = require("axios")

const SERVERURL = "http://192.168.1.4:7078/SqlQuery/QueryBrowser"


async function getDataSQL(stringRec, BD) {

    try {
        const requestBody = {
            q: stringRec,
            conn: BD


            //q: "select (ct.Code + ' ' + ct.Name) as CT, ct.IDResource, mg.Code, st.Name as CC, st.IDSector, ar.Name as Depto, ar.IDArea from TBLResource ct inner join TBLManagerGrp mg on (ct.IDManagerGrp = mg.IDManagerGrp) inner join TBLSector st on (mg.IDSector = st.IDSector) inner join TBLArea ar on (st.IDArea = ar.IDArea) WHERE ar.Code LIKE '11%' OR ct.Code LIKE '1014001'",
            
            //conn: "Data Source=srvmes;Initial Catalog=PCF4;User ID=supervisorio;Password=magius"
        }
        return axios.post(SERVERURL, requestBody).then(res => res)


    } catch (err) {
        Functions.escreverLog(`Falha ao acessar a API Zeno - erro: ${err}`)
    }
}

module.exports.getDataSQL = getDataSQL

/*
getDataSQL("select top(10) * from cicloEcoat","Data Source=MGU-SERVER02;Initial Catalog=SUPERVISORIO;User ID=gustavo;Password=magius@2021").then(
    function(res){
        console.log(res.data.result)
    }
)
*/