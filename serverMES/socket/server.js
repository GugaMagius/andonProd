
// ***********************
// Configurações em geral*
// ***********************
console.log("INICIANDO IO")

var cors = require('cors')
var express = require('express')
var app = express()
app.use(cors());
const http = require('http').createServer(app)
const Functions = require('../Services/functions')
const versaoMES = require('../package.json').version
const storage = require('../Services/storage')
const apiZeno = require('../BD/apiZeno')
const configBD = require('../configBD') //??? Testar método, modificado dia 11/02/2023

var dadosServer = {}
module.exports.dadosServer = dadosServer



var socketConectado = false; // Status de conexão do socket


// *************************
// Configurações do socket *
// *************************
const io = require("socket.io")(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});



http.listen(3006, function () {
    console.log("listening on port 3006")
})



function verifConexao() {
    return socketConectado
}
module.exports.verifConexao = verifConexao


// Lista de Recussos e MGrps*********/
var listaCT = [] // Centro de trabalho


const queryCTs = `select (ct.Code + ' ' + ct.Name) as CT, ct.IDResource, mg.Code, st.Name as CC, st.IDSector, ar.Name as Depto, ar.IDArea from TBLResource ct inner join TBLManagerGrp mg on (ct.IDManagerGrp = mg.IDManagerGrp) inner join TBLSector st on (mg.IDSector = st.IDSector) inner join TBLArea ar on (st.IDArea = ar.IDArea) WHERE ar.Code LIKE '11%' OR ct.Code LIKE '1014001'`
//const queryCTs = `select * from TBLResource`



apiZeno.getDataSQL(queryCTs, configBD.connMES).then(
    res => {
        listaCT = res[0]
    }
)
//**************************************/

// ########################################################################
// ************************************************************************
//                     Início da conexão com o SOCKET 
// ************************************************************************
// ########################################################################

try {

    // Função para envio dos dados para os clientes (TODOS OS CLIENTES)
    function atualizaDados(dadosRec, destino) {
        console.log("enviando dados.... ", destino)

        io.sockets.emit(destino, dadosRec)
    }

    module.exports.atualizaDados = atualizaDados



    function atualizaCliente() {
        try {
            io.emit("AtualizaDados", dadosServer)
        } catch (err) {
            let msg = "Falha ao tentar enviar atualização de dados ao cliente: " + err

            storage.setLS("log", msg)
        }
    }

    // Intervalo para atualizar dados no cliente ************************** */
    setInterval(atualizaCliente, 15000)


    // Monitora clientes que foram desconectados e fecha a conexão socket
    io.sockets.on('disconnect', function () {
        // handle disconnect
        io.sockets.disconnect();
        io.sockets.close();
    });


    // *******************Conexão SOCKET *****************************
    io.on('connection', (socket) => {


        socketConectado = true;

        console.log("socket iniciado")

        console.log('New connection', socket.id)


        atualizaCliente() // Atualiza o cliente ao conectar ao socket

        socket.emit("id", socket.id)

        socket.on("disconnecting", function () {
            console.log(`Cliente ${socket.id} desconectando`)

        })


        // Envia versão do serverMES
        socket.emit("versao", versaoMES)


        /*********************************************************************** */

        socket.on("dadosSolicitados", function () {
            socket.emit("AtualizaDados", dadosServer)

        })


        // Socket para inserir novo valor no banco de dados NeDB
        socket.on("gravarConfig", function ([dados, arquivo]) {
            console.log(`Gravando os dados no banco de Dados: ${JSON.stringify(dados)} no arquivo: ${arquivo}`)
            storage.setLS(arquivo, dados)
        })

        
        // Leitura das configurações de meta
        function leituraConfig() {
            let respConfig = {}

            try {

                respConfig["metas"] = storage.getLS("metas")
                respConfig["selecaoCTs"] = storage.getLS("selecaoCTs")

            } catch (err) {

                let msg = "Falha ao gravar arquivo de configuração. Erro: " + err
                storage.setLS("log", msg)

            } finally {

                socket.emit("respStorage", respConfig)
                // Atualiza lista de CTs no cliente
                socket.emit("sListaCTs", listaCT)

            }

        }
        leituraConfig();


        Promise.all([storage.getLSpromise("metas"), storage.getLSpromise("selecaoCTs")]).then((valores)=>{

            //console.log("valor meta: ", valores[0], "- Valor lista: ", valores[1])
            socket.emit('teste', [valores[0], valores[1], listaCT])

        })


        // Socket para ler valores do arquivo de configuração
        socket.on("leituraConfig", leituraConfig)


        // Função para resposta dos dados consultados ao cliente que solicitou
        function enviarResposta(dados) {

            io.emit("resConsDB", dados)

        }

        module.exports.enviarResposta = enviarResposta



        // Solicitação de dados pelo cliente
        socket.on("solicitaDados", function (msg) {

            // Para criar para outros MGrps, consultar a tabela [TBLResource], montar grupos conforme o campo [IDManagerGrp] e nome do grupo na tabela [TBLManagerGrp]

            let queryQtd = ''; // Query para solicitar quantidade produzida
            let queryHt = ''; // Query para solicitar horas trabalhadas
            let queryHd= ''; // Query para solicitar horas Disponíveis
            let queryHc= ''; // Query para solicitar horas Carga
            let queryHtt= ''; // Query para solicitar horas Totais

            async function sectorSelect(parametros) {

                if (parametros.CT.includes('ecoat')) {
                    queryQtd = "set dateformat ymd select data as hora, CASE WHEN DATEPART(hh,data)<6 then data-1 ELSE data END DtMov from cicloEcoat where CASE WHEN DATEPART(hh,data)<6 then data-1 ELSE data END >= '" + parametros.dtInicio + " 00:00:00' and CASE WHEN DATEPART(hh,data)<6 then data-1 ELSE data END <= '" + parametros.dtFim + " 23:59:00'"
                    // queryHt = "set dateformat ymd select pev.DtProd as DtMov, rsev.ShiftDtStart as hora, rsev.ShiftDtStart, pev.IDResource,TBLResource.Code,TBLResource.Nickname, rsev.ShiftDtEnd,pev.Shift from TBLProductionEv pev inner join TBLResourceStatusEv rsev on (rsev.IDProdEv = pev.IDProdEv) inner join TBLResource on (TBLResource.IDResource = pev.IDResource) where rsev.RSClassification=5 and rsev.FlgDeleted=0 and pev.IDResource IN(31) and DtProd >='" + parametros.dtInicio + "' and DtProd <= '" + parametros.dtFim + "'"
                    queryHt = "set dateformat ymd select pev.DtProd as DtMov, rsev.ShiftDtStart as hora, rsev.ShiftDtStart, pev.IDResource,TBLResource.Code,TBLResource.Nickname, rsev.ShiftDtEnd,pev.Shift from TBLProductionEv pev inner join TBLResourceStatusEv rsev on (rsev.IDProdEv = pev.IDProdEv) inner join TBLResource on (TBLResource.IDResource = pev.IDResource) where rsev.RSClassification=5 and rsev.FlgDeleted=0 and pev.IDResource IN(31) and DtProd >='" + parametros.dtInicio + "' and DtProd <= '" + parametros.dtFim + "'"
                    queryHd = "set dateformat ymd select pev.DtProd as DtMov, rsev.ShiftDtStart as hora, rsev.ShiftDtStart, pev.IDResource,TBLResource.Code,TBLResource.Nickname, rsev.ShiftDtEnd,pev.Shift from TBLProductionEv pev inner join TBLResourceStatusEv rsev on (rsev.IDProdEv = pev.IDProdEv) inner join TBLResource on (TBLResource.IDResource = pev.IDResource) where rsev.RSClassification!=1 and rsev.RSClassification!=2 and rsev.FlgDeleted=0 and pev.IDResource IN(31) and DtProd >='" + parametros.dtInicio + "' and DtProd <= '" + parametros.dtFim + "'"
                    queryHc = "set dateformat ymd select pev.DtProd as DtMov, rsev.ShiftDtStart as hora, rsev.ShiftDtStart, pev.IDResource,TBLResource.Code,TBLResource.Nickname, rsev.ShiftDtEnd,pev.Shift from TBLProductionEv pev inner join TBLResourceStatusEv rsev on (rsev.IDProdEv = pev.IDProdEv) inner join TBLResource on (TBLResource.IDResource = pev.IDResource) where rsev.RSClassification!=1 and rsev.FlgDeleted=0 and pev.IDResource IN(31) and DtProd >='" + parametros.dtInicio + "' and DtProd <= '" + parametros.dtFim + "'"
                    queryHtt = "set dateformat ymd select pev.DtProd as DtMov, rsev.ShiftDtStart as hora, rsev.ShiftDtStart, pev.IDResource,TBLResource.Code,TBLResource.Nickname, rsev.ShiftDtEnd,pev.Shift from TBLProductionEv pev inner join TBLResourceStatusEv rsev on (rsev.IDProdEv = pev.IDProdEv) inner join TBLResource on (TBLResource.IDResource = pev.IDResource) where rsev.FlgDeleted=0 and pev.IDResource IN(31) and DtProd >='" + parametros.dtInicio + "' and DtProd <= '" + parametros.dtFim + "'"
                    await Functions.solicitaBD(queryQtd, queryHt, queryHd, queryHc, queryHtt, parametros, "ecoat")
                } else if (parametros.CT.includes("EE")) {
                    queryQtd = "set dateformat ymd select ctbl.IDWOGRP, item.Code, ctbl.IDBastidor, ctbl.Quantidade AS MovQty, ctbl.DTTIMESTAMP AS Hora, CASE WHEN DATEPART(hh,ctbl.DTTIMESTAMP)<6 then ctbl.DTTIMESTAMP-1 ELSE ctbl.DTTIMESTAMP END as DtMov from CTBLWOGRP ctbl inner join TBLWOHD op on (op.Code = ctbl.WOCODE) inner join TBLProduct item on (item.IDProduct = op.IDProduct) where ctbl.IDBastidor is not null  and CASE WHEN DATEPART(hh,ctbl.DTTIMESTAMP)<6 then ctbl.DTTIMESTAMP-1 ELSE ctbl.DTTIMESTAMP END >= '" + parametros.dtInicio + " 00:00:00' and CASE WHEN DATEPART(hh,ctbl.DTTIMESTAMP)<6 then ctbl.DTTIMESTAMP-1 ELSE ctbl.DTTIMESTAMP END <= '" + parametros.dtFim + " 23:59:59'"
                    // queryHt = "set dateformat ymd select pev.DtProd as DtMov, rsev.ShiftDtStart as hora, rsev.ShiftDtStart, pev.IDResource,TBLResource.Code,TBLResource.Nickname, rsev.ShiftDtEnd,pev.Shift from TBLProductionEv pev inner join TBLResourceStatusEv rsev on (rsev.IDProdEv = pev.IDProdEv) inner join TBLResource on (TBLResource.IDResource = pev.IDResource) where rsev.RSClassification=5 and rsev.FlgDeleted=0 and pev.IDResource IN(31) and DtProd >='" + parametros.dtInicio + "' and DtProd <= '" + parametros.dtFim + "'"
                    queryHt = "set dateformat ymd select pev.DtProd as DtMov, rsev.ShiftDtStart as hora, rsev.ShiftDtStart, pev.IDResource,TBLResource.Code,TBLResource.Nickname, rsev.ShiftDtEnd,pev.Shift from TBLProductionEv pev inner join TBLResourceStatusEv rsev on (rsev.IDProdEv = pev.IDProdEv) inner join TBLResource on (TBLResource.IDResource = pev.IDResource) where rsev.RSClassification=5 and rsev.FlgDeleted=0 and pev.IDResource IN(31) and DtProd >='" + parametros.dtInicio + "' and DtProd <= '" + parametros.dtFim + "'"
                    queryHd = "set dateformat ymd select pev.DtProd as DtMov, rsev.ShiftDtStart as hora, rsev.ShiftDtStart, pev.IDResource,TBLResource.Code,TBLResource.Nickname, rsev.ShiftDtEnd,pev.Shift from TBLProductionEv pev inner join TBLResourceStatusEv rsev on (rsev.IDProdEv = pev.IDProdEv) inner join TBLResource on (TBLResource.IDResource = pev.IDResource) where rsev.RSClassification!=1 and rsev.RSClassification!=2 and rsev.FlgDeleted=0 and pev.IDResource IN(31) and DtProd >='" + parametros.dtInicio + "' and DtProd <= '" + parametros.dtFim + "'"
                    queryHc = "set dateformat ymd select pev.DtProd as DtMov, rsev.ShiftDtStart as hora, rsev.ShiftDtStart, pev.IDResource,TBLResource.Code,TBLResource.Nickname, rsev.ShiftDtEnd,pev.Shift from TBLProductionEv pev inner join TBLResourceStatusEv rsev on (rsev.IDProdEv = pev.IDProdEv) inner join TBLResource on (TBLResource.IDResource = pev.IDResource) where rsev.RSClassification!=1 and rsev.FlgDeleted=0 and pev.IDResource IN(31) and DtProd >='" + parametros.dtInicio + "' and DtProd <= '" + parametros.dtFim + "'"
                    queryHtt = "set dateformat ymd select pev.DtProd as DtMov, rsev.ShiftDtStart as hora, rsev.ShiftDtStart, pev.IDResource,TBLResource.Code,TBLResource.Nickname, rsev.ShiftDtEnd,pev.Shift from TBLProductionEv pev inner join TBLResourceStatusEv rsev on (rsev.IDProdEv = pev.IDProdEv) inner join TBLResource on (TBLResource.IDResource = pev.IDResource) where rsev.FlgDeleted=0 and pev.IDResource IN(31) and DtProd >='" + parametros.dtInicio + "' and DtProd <= '" + parametros.dtFim + "'"
                    await Functions.solicitaBD(queryQtd, queryHt, queryHd, queryHc, queryHtt, parametros)
                } else if (parametros.CT === '') {
                    console.log("Nenhum CT selecionado")
                } else if (parametros.CT === undefined) {
                    console.log("Nenhum CT selecionado")
                } else {
                    queryQtd = "set dateformat ymd select me.DtMov, me.DtTimeStamp as hora, me.Shift, me.MovQty, me.UndoIDMovEv, me.RelatedIDMovEv, p.Code from TBLMovEv me inner join TBLProduct p on (p.IDProduct = me.IDProduct) where me.IDResource IN(" + parametros.CT + ") and DtMov >= '" + parametros.dtInicio + "' and DtMov <= '" + parametros.dtFim + "'"
                    queryHt = "set dateformat ymd select pev.DtProd as DtMov, rsev.ShiftDtStart as hora, rsev.ShiftDtStart, pev.IDResource,TBLResource.Code,TBLResource.Nickname, rsev.ShiftDtEnd,pev.Shift from TBLProductionEv pev inner join TBLResourceStatusEv rsev on (rsev.IDProdEv = pev.IDProdEv) inner join TBLResource on (TBLResource.IDResource = pev.IDResource) where rsev.RSClassification=5 and rsev.FlgDeleted=0 and pev.IDResource IN(" + parametros.CT + ") and DtProd >='" + parametros.dtInicio + "' and DtProd <= '" + parametros.dtFim + "'"
                    queryHd = "set dateformat ymd select pev.DtProd as DtMov, rsev.ShiftDtStart as hora, rsev.ShiftDtStart, pev.IDResource,TBLResource.Code,TBLResource.Nickname, rsev.ShiftDtEnd,pev.Shift from TBLProductionEv pev inner join TBLResourceStatusEv rsev on (rsev.IDProdEv = pev.IDProdEv) inner join TBLResource on (TBLResource.IDResource = pev.IDResource) where rsev.RSClassification!=1 and rsev.RSClassification!=2 and rsev.FlgDeleted=0 and pev.IDResource IN(" + parametros.CT + ") and DtProd >='" + parametros.dtInicio + "' and DtProd <= '" + parametros.dtFim + "'"
                    queryHc = "set dateformat ymd select pev.DtProd as DtMov, rsev.ShiftDtStart as hora, rsev.ShiftDtStart, pev.IDResource,TBLResource.Code,TBLResource.Nickname, rsev.ShiftDtEnd,pev.Shift from TBLProductionEv pev inner join TBLResourceStatusEv rsev on (rsev.IDProdEv = pev.IDProdEv) inner join TBLResource on (TBLResource.IDResource = pev.IDResource) where rsev.RSClassification!=1 and rsev.FlgDeleted=0 and pev.IDResource IN(" + parametros.CT + ") and DtProd >='" + parametros.dtInicio + "' and DtProd <= '" + parametros.dtFim + "'"
                    queryHtt = "set dateformat ymd select pev.DtProd as DtMov, rsev.ShiftDtStart as hora, rsev.ShiftDtStart, pev.IDResource,TBLResource.Code,TBLResource.Nickname, rsev.ShiftDtEnd,pev.Shift from TBLProductionEv pev inner join TBLResourceStatusEv rsev on (rsev.IDProdEv = pev.IDProdEv) inner join TBLResource on (TBLResource.IDResource = pev.IDResource) where rsev.FlgDeleted=0 and pev.IDResource IN(" + parametros.CT + ") and DtProd >='" + parametros.dtInicio + "' and DtProd <= '" + parametros.dtFim + "'"
                    await Functions.solicitaBD(queryQtd, queryHt, queryHd, queryHc, queryHtt, parametros)
                }

            }
            sectorSelect(msg);

        })


        socket.on("atualizaAndonGP", parametros=>{


//             Declare @JSON varchar(max)
// SELECT @JSON=BulkColumn
// FROM OPENROWSET (BULK 'C:\ProjetosNode\testeJsonSQL\teste.json', SINGLE_CLOB) import
// SELECT * FROM OPENJSON (@JSON)
// WITH  (
//    [Firstname] varchar(20),  
//    [Lastname] varchar(20),  
//    [Gender] varchar(20),  
//    [AGE] int );

            queryHt = "set dateformat ymd select convert(float,SUM(DATEDIFF (SECOND, rsev.ShiftDtStart, rsev.ShiftDtEnd)))/3600 as Horas, format(rsev.ShiftDtStart, 'yyyyMM') AS MES from TBLProductionEv pev inner join TBLResourceStatusEv rsev on (rsev.IDProdEv = pev.IDProdEv) inner join TBLResource on (TBLResource.IDResource = pev.IDResource) where rsev.RSClassification=5 and rsev.FlgDeleted=0 and pev.IDResource IN(" + parametros.CT + ") and DtProd >='" + parametros.dtInicio + "' and DtProd <= '" + parametros.dtFim + "'"
            Functions.solicitaBD(queryQtd, queryHt, queryHd, queryHc, queryHtt, parametros)
        })

    })
} catch (err) {
    let msg = "Erro ao subir o servidor de socket. Erro: " + err

    storage.setLS("log", msg)
}

module.exports.io = io