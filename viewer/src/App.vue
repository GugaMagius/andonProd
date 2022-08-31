<template>
  <div class="Principal">
    
    
    <!-- FAIXA DE TÍTULO (FIXA )-->
    <div class="Titulo">
      <div class="logo">
        <img src="../public/logoMagius.png" style="width: auto; height: auto; max-width: 300px; max-height: 300px" />
      </div>

      <h2>Andon {{ $route.name }} &nbsp;</h2>
      <div>{{ isConnected ? "" : " *** Servidor Desconectado ***" }}</div>

      <div class="botaoinicio">
        <Button type="button" icon="pi pi-bars" class="p-button-sm" @click="toggle" aria-haspopup="true" aria-controls="overlay_menu" />
        <Menu id="overlay_menu" ref="menu" :model="items" :popup="true" />
      </div>
    </div>

    <!-- CORPO DA PÁGINA -->
    <div class="RouterView">
      <router-view :dadosServer="dadosServer" :id="id" :listaCTs="listaCTsGeral.selecionados" :listaCTsReceb="listaRecReceb"
        :setor="$route.params.Setor" :metas="metas" :selecaoCTs="selecaoCTs" :listaCTsC="listaCTsGeral.completa" />
    </div>

    <!-- RODAPÉ -->
    <!-- <div class="Rodape">
      {{ valores }}
    </div> -->
  </div>
</template>

<script>
import { ref } from "vue";
import packageJson from '../package.json'

export default {
  name: "",
  components: {
  },

  mounted() {
    setInterval(this.solicitaAtualiz, 5000);
    this.versaoViewer = packageJson.version
    console.log("Versão do Viewer: ", this.versaoViewer)

  },
  data: function () {
    return {
      id: '',
      listaCTsGeral: {}, // Lista com os Centros de Trablahos completa e selecionados
      listaRecReceb: false, // Sinaliza se os dados dos MGrps foram recebidos para mostrar o formulário
      versaoViewer: '',
      versaoMES: '',
      dadosServer: {},
      dadosRecebidos: false,
      socketMessage: "Valor inicial",
      FalhaConexao: "", // Sinalização de falha de conexão
      tmpWD: 500, // Configuração do tempo de watchdog para monitorar o server
      isConnected: false, // sinalização de viewer conectado
      corOntem: "var(--surface-200)",
      corHoje: "var(--surface-300)",
      txtOntem: "var(--surface-700)",
      txtHoje: "var(--surface-900)",
      tamTxtO: 2.5,
      tamTxtH: 2.7,
      fdoOntem: "var(--surface-50)",
      fdoHoje: "var(--surface-0)",
      setorAndon: '',       
      metas: {}, // Valores temporários de metas
      selecaoCTs: [],
    };
  },
  methods: {
    msgToServer: function () {
      this.$socket.emit("msgFromViewer", [
        "Primeira informação",
        "Segunda Informação",
      ]);
    },


  },
  sockets: {
    msgServerClient(msg){
      console.log("Mensgem recebida do cliente: ", msg)

    },


    // ID enviado pelo server para conexões socket
    id(val) {
      if (this.id === 0) {
        this.id = val
      }

    },

    // Resposta do storage com as configurações
    respStorage(valor) {

        this.metas = valor.metas
        this.selecaoCTs = valor.selecaoCTs

    },

    // Resposta com a lista de Centros de trabalhos
    sListaCTs(lista) {
      lista.unshift({ ct: "*Enganchamento E-coat", idresource: "EE", cc: 'ENGANCHAMENTO E-COAT', idsector: 5000, depto: 'ENGANCHAMENTO E-COAT', idarea: 5000 })
      lista.unshift({ ct: "*Linha E-coat (Bastidor)", idresource: "ecoat", cc: 'E-COAT (SUPERVISORIO)', idsector: 5001, depto: 'E-COAT (SUPERVISORIO)', idarea: 5001 })

      Promise.resolve(this.listaCTsGeral = lista.reduce((acc, el) => {


        this.selecaoCTs.includes(el.idresource) ? acc["selecionados"][el.idresource] = el : null;
        acc["completa"][el.idresource] = el;

        return acc

      }, {selecionados: {}, completa: {}}))
        .then(
          console.log(this.listaCTsGeral),
          this.listaRecReceb = true,
        )

    },


    connect() {
      // Fired when the socket connects.
      this.id = 0
      this.isConnected = true;
      this.varWD = setTimeout(this.FalhaConexao, this.tmpWD);
    },

    disconnect() {
      this.isConnected = false;
    },

    watchdog() {
      console.log("MENSAGEM DO WATCHDOG", this.varWD);
      this.isConnected = true;
      clearTimeout(this.varWD);
      //this.varWD = setInterval(this.FalhaConexao, this.tmpWD);
    },

    // Fired when the server sends something on the "messageChannel" channel.
    messageChannel(data) {
      this.socketMessage = data;
      this.msgToServer();
    },

    // Resposta com as versões dos servers
    versao(versaoMES) {
      console.log("VersãoMES: ", versaoMES, "Versão Viewer: ", this.versaoViewer)
      this.versaoMES = versaoMES
    },

    // Atualização de dados do server para os clientes
    AtualizaDados(dados) {
      //console.log("DADOS RECEBIDOS DO SERVER: ", dados)
      try {
        if (dados !== undefined) {
          this.dadosServer = dados;

          this.dadosRecebidos = true;
        }
      } catch (err) {
        console.log("FALHA AO ATUALIZAR DADOS: ", err);
      }
    },
  },

  // Configuração do MENU
  setup() {
    const menu = ref();

    const items = ref([
      {
        label: "Mosaico",
        to: "/",
      },
      {
        label: "Telas",
        items: [
          {
            label: "Enganchamento",
            to: "/enganchamento"
          },
          {
            label: "E-coat",
            to: "/ecoat"
          },
          {
            label: "Pintura Pó",
            to: "/pinturapo"
          },
          {
            label: "Pintura líquida",
            to: "/pinturaliq"
          },
          {
            label: "Formação Kits",
            to: "/formacaokit"
          },
        ],
      },
      {
        label: "Relatorios",
        items: [
          {
            label: "Grafico",
            to: "/graficos",
          }
        ],
      },
    ]);

    const toggle = (event) => {
      menu.value.toggle(event);
    };

    return { menu, toggle, items };
  },
};
</script>



<style>
/*
.p-knob-value.path {
  stroke: blue;
}
*/
.logo {
  position: absolute;
  left: 0;
  z-index: 10;
  margin-top: auto;
  margin-bottom: auto;
  padding-top: 0;
  padding-bottom: 0;
  padding-left: 1%;
}

h2 {
  padding: 0;
  margin-top: auto;
  margin-bottom: auto;
}

.RouterView {
  overflow-y: auto;
  height: 100%;
  z-index: 0;
}

.botaoinicio {
  position: absolute;
  right: 0;
  margin-top: auto;
  margin-bottom: auto;
  padding-right: 1%;
  z-index: 10;
}

.Principal {
  height: 100%;
  width: 100%;
}

.Rodape {
  height: 8vh;
  background-color: var(--surface-a);
  padding: 10px;
  width: 100%;
  bottom: 0;
  margin-bottom: 0;
  padding-bottom: 0;
}

.Titulo {
  height: 7vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--surface-d);
  padding-top: auto;
  padding-bottom: auto;
  margin-bottom: 0px;
  margin-top: 0px;
  z-index: 10;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  /*color: #2c3e50;*/
  margin-top: 0;
  padding-top: 0px;
  margin-bottom: 0;
  padding-bottom: 0px;
  height: 100%;
}

.app-container {
  text-align: center;
}

body {
  margin: 0;
  height: 100%;
  background-color: var(--surface-b);
  font-family: var(--font-family);
  font-weight: 400;
  color: var(--text-color);
  margin-top: 0px;
  margin-bottom: 0px;
  padding-top: 0px;
  padding-bottom: 0px;
  overflow-x: hidden;
  overflow-y: scroll;
}
</style>




