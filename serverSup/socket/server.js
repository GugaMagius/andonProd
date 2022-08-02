
// ***********************
// Configurações em geral*
// ***********************


var cors = require('cors')
var express = require('express')
var app = express()
app.use(cors());
const http = require('http').createServer(app)
const BDSuperv = require('../BD/supervisorio')
const versao = require('../package.json').version


console.log("INICIANDO IO")

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

http.listen(3005, function () {
    console.log("listening on port 3005")
})



function verifConexao() {
    return socketConectado
}


module.exports.verifConexao = verifConexao


// ########################################################################
// ************************************************************************
//                     Início da conexão com o SOCKET 
// ************************************************************************
// ########################################################################

io.on('connection', (socket) => {


    console.log("socket iniciado")

    console.log('New connection', socket.id)

    socket.emit("versao", versao) // Envia a versão para o cliente (serverMES)

    function atualizaDados(dadosRec, destino) {

        //console.log("Enviando dados para o cliente... ", dadosRec, " - Destino: ", destino)
        io.emit("atualizaDados", dadosRec, destino)

    }
    module.exports.atualizaDados = atualizaDados

    socket.on("solicitaDadosGraf", function (parametros) {
        console.log("solicitado dados pelo ServerMES. Parâmetros: ", parametros)

        var stringProd = "select data, convert(time, data) Hora, CASE WHEN DATEPART(hh,data)<6 then data-1 ELSE data END DtMov from cicloEcoat where CASE WHEN DATEPART(hh,data)<6 then data-1 ELSE data END between " + parametros.dtInicio + " and " + parametros.dtFim


        BDSuperv.selectBD(stringProd, parametros).then(
            function ([resposta, parametrosRec]) {
                //console.log("RESPOSTA DO BANCO DE DADOS ################## ", resposta, " - Parametros: ", parametrosRec)
                io.emit("respostaGrafEcoat", [resposta, parametrosRec])
            })

    })

})

module.exports.io = io
