
// ***********************
// Configurações em geral*
// ***********************
console.log("INICIANDO IO")

var cors = require('cors')
var express = require('express')
var app = express()
app.use(cors());
const http = require('http').createServer(app)
const ioClient = require('../socket/client')
ioClient
const Functions = require('../Services/functions')
const versaoMES = require('../package.json').version
const clientEcoat = require('./client')
const bdMES = require('../BD/MES')
const storage = require('../Services/storage')
const apiZeno = require('../BD/apiZeno')

const main = require('../server')

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
var listaCTsMeta = [] // Centro de trabalho


const connMES = "Data Source=srvmes;Initial Catalog=PCF4;User ID=supervisorio;Password=magius"
const queryCTs = `select (ct.Code + ' ' + ct.Name) as CT, ct.IDResource, mg.Code, st.Name as CC, st.IDSector, ar.Name as Depto, ar.IDArea from TBLResource ct inner join TBLManagerGrp mg on (ct.IDManagerGrp = mg.IDManagerGrp) inner join TBLSector st on (mg.IDSector = st.IDSector) inner join TBLArea ar on (st.IDArea = ar.IDArea) WHERE ar.Code LIKE '11%' OR ct.Code LIKE '1014001'`

apiZeno.getDataSQL(queryCTs, connMES).then(
    res => {
        listaCT = res.data.result
        console.log("resposta do BD", res.data.result)
    }
)
/*
bdMES.selectBD(queryCTs).then(
    function (res) {
        //listaCT.push({ IDResource: "EE", Name: "ENGANCHAMENTO E-COAT" })
        listaCT = res[0].recordset
    }
)
*/
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

        socket.emit("id", socket.id)

        // Função para receber a versão do serverSup e enviar os valores ao cliente
        clientEcoat.enviaVersSup().then(

            function (res) {
                socket.emit("Versoes", [versaoMES, res])
            }
        )


        socket.on("disconnecting", function () {
            console.log(`Cliente ${socket.id} desconectando`)

        })

        // Atualiza lista de MGrps e CTs no cliente
        socket.emit("sListaCTs", listaCT)


        /*********************************************************************** */

        socket.on("dadosSolicitados", function () {
            socket.emit("AtualizaDados", dadosServer)

        })

        socket.on("gravaLog", function (msg) {
            console.log("Escrevendo o arquivo com a mensagem: ", msg)

            storage.setLS("log", msg)
        })

        socket.on("lerLog", function () {

                    socket.emit("respostaLog", storage.getLS("log"))
                
            

            /*
            Functions.lerFS().then(
                function (val) {
                    console.log("Valor obtido do arquivo: ", val)
                    socket.emit("respostaLog", val)
                }
            )
            */
        })


        // Socket para inserir novo valor no banco de dados NeDB
        socket.on("gravarConfig", function (dados) {
            console.log(`Gravando os dados no banco de Dados: ${JSON.stringify(dados)}`)
            storage.setLS("metas", dados)
        })


        // Leitura das configurações de meta
        function leituraConfig() {
            let respConfig = {}

            try {
                respConfig = storage.getLS("metas")

            } catch (err) {
                let msg = "Falha ao gravar arquivo de configuração. Erro: " + err
                storage.setLS("log", msg)
            }

            socket.emit("respStorage", respConfig)
        }
        leituraConfig();


        // Socket para ler valores do banco de dados NeDB 
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

            async function sectorSelect(parametros) {
                let CTs = parametros.CT

                if (parametros.CT.includes('ecoat')) {
                    queryQtd = "select data, convert(time, data) Hora, CASE WHEN DATEPART(hh,data)<6 then data-1 ELSE data END DtMov from cicloEcoat where CASE WHEN DATEPART(hh,data)<6 then data-1 ELSE data END between " + parametros.dtInicio + " and " + parametros.dtFim
                    queryHt = "select pev.dtprod,pev.IDResource,TBLResource.Code,TBLResource.Nickname,rsev.ShiftDtStart,rsev.ShiftDtEnd,pev.Shift from TBLProductionEv pev inner join TBLResourceStatusEv rsev on (rsev.IDProdEv = pev.IDProdEv) inner join TBLResource on (TBLResource.IDResource = pev.IDResource) where rsev.RSClassification=5 and rsev.FlgDeleted=0 and pev.IDResource = 31 and DtProd between " + parametros.dtInicio + " and " + parametros.dtFim
                    await Functions.solicitaBD(queryQtd, queryHt, parametros, "ecoat")
                } else if (parametros.CT.includes("EE")) {
                    queryQtd = "select ctbl.IDWOGRP, item.Code, ctbl.IDBastidor, ctbl.Quantidade AS MovQty, ctbl.DTTIMESTAMP, convert(time, ctbl.DTTIMESTAMP) Hora, CASE WHEN DATEPART(hh,ctbl.DTTIMESTAMP)<6 then ctbl.DTTIMESTAMP-1 ELSE ctbl.DTTIMESTAMP END as DtMov from CTBLWOGRP ctbl inner join TBLWOHD op on (op.Code = ctbl.WOCODE) inner join TBLProduct item on (item.IDProduct = op.IDProduct) where ctbl.IDBastidor is not null  and CASE WHEN DATEPART(hh,ctbl.DTTIMESTAMP)<6 then ctbl.DTTIMESTAMP-1 ELSE ctbl.DTTIMESTAMP END between CONVERT(datetime," + parametros.dtInicio + ", 121) and CONVERT(datetime," + parametros.dtFim + ", 121)"
                    queryHt = "select pev.dtprod,pev.IDResource,TBLResource.Code,TBLResource.Nickname,rsev.ShiftDtStart,rsev.ShiftDtEnd,pev.Shift from TBLProductionEv pev inner join TBLResourceStatusEv rsev on (rsev.IDProdEv = pev.IDProdEv) inner join TBLResource on (TBLResource.IDResource = pev.IDResource) where rsev.RSClassification=5 and rsev.FlgDeleted=0 and pev.IDResource = 31 and DtProd between " + parametros.dtInicio + " and " + parametros.dtFim
                    await Functions.solicitaBD(queryQtd, queryHt, parametros)
                } else if (parametros.CT === '') {
                    console.log("Nenhum CT selecionado")
                } else if (parametros.CT === undefined) {
                    console.log("Nenhum CT selecionado")
                } else {
                    queryQtd = "select me.DtMov, me.DtTimeStamp, convert(time, me.DtTimeStamp) Hora, me.Shift, me.MovQty, p.Code from TBLMovEv me inner join TBLProduct p on (p.IDProduct = me.IDProduct) where me.IDResource IN(" + parametros.CT + ") and me.DtMov between " + parametros.dtInicio + " and " + parametros.dtFim
                    queryHt = "select pev.dtprod,pev.IDResource,TBLResource.Code,TBLResource.Nickname,rsev.ShiftDtStart,rsev.ShiftDtEnd,pev.Shift from TBLProductionEv pev inner join TBLResourceStatusEv rsev on (rsev.IDProdEv = pev.IDProdEv) inner join TBLResource on (TBLResource.IDResource = pev.IDResource) where rsev.RSClassification=5 and rsev.FlgDeleted=0 and pev.IDResource IN(" + CTs + ") and DtProd between " + parametros.dtInicio + " and " + parametros.dtFim
                    await Functions.solicitaBD(queryQtd, queryHt, parametros)
                }


            }
            sectorSelect(msg);

        })

    })
} catch (err) {
    let msg = "Erro ao subir o servidor de socket. Erro: " + err
    
    storage.setLS("log", msg)
}

module.exports.io = io