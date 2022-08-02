<template>
  <div>
    <TelaAndon
      v-if="dadosRecebidos"
      :corOntem="corOntem"
      :corHoje="corHoje"
      :fdoOntem="fdoOntem"
      :fdoHoje="fdoHoje"
      :txtOntem="txtOntem"
      :txtHoje="txtHoje"
      :tamTxtO="tamTxtO"
      :tamTxtH="tamTxtH"
      :produzidos="produzidosEE"
      :perdidos="perdidosEE"
      :ecoat="false"
      :unidMedia="'(m2/h)'"
      :unidQtd="'(m2)'"
      :metaP="produzidosEE.metaP_EE"
      :sufixoMeta="' m2/h'"
      :alturaGraficoH="3"
      :alturaGraficoO="2"
      :larguraGraficoH="5"
      :larguraGraficoO="5"
    />
  </div>
</template>

<script>
import TelaAndon from "@/components/telaAndon.vue";

export default {
  components: {
    TelaAndon,
  },
  props: {
    dadosServer: Object, // Pacote de dados do servidor
    dadosRecebidos: Boolean, // Indica quando os dados foram recebidos do servidor
    corOntem: String,
    corHoje: String,
    fdoOntem: String,
    fdoHoje: String,
    txtOntem: String,
    txtHoje: String,
    tamTxtO: Number,
    tamTxtH: Number,
  },
  created() {
    window.addEventListener("resize", this.myEventHandler);
  },
  mounted() {
    //this.$socket.emit("dadosSolicitados", "Solicitando atualização de dados");
    if (this.dadosServer.AtualizaDadosEE != undefined) {
      this.produzidosEE = this.dadosServer.AtualizaDadosEE;
      //this.dadosRecebidosEE = true;
    }
  },
  watch: {
    dadosServer() {
      if (this.dadosServer.AtualizaDadosEE != undefined) {
        this.produzidosEE = this.dadosServer.AtualizaDadosEE;
        this.dadosRecebidosEE = true;
      }
    },
  },
  methods: {},
  sockets: {
    /*
    AtualizaDados(dados) {
      try {
        if (dados.AtualizaDadosEE != undefined) {
          //this.produzidosEE = dados.AtualizaDadosEE;
          //this.dadosRecebidosEE = true;
        }
      } catch (err) {
        console.log("FALHA AO ATUALIZAR DADOS: ", err);
      }
    },
    */
  },
  data() {
    return {
      alturaAtual: "",
      larguraGraficoH: "",
      larguraGraficoO: "",
      dadosRecebidosEE: false,
      produzidosEE: {},
      corOK: "#42A500",
      corNOK: "#ff0000",
      perdidosEE: {},
      performanceLE: {
        Hoje: {
          Turno1: "",
          Turno2: "",
          Turno3: "",
        },
        Ontem: {
          Turno1: "",
          Turno2: "",
          Turno3: "",
        },
        meta: " >= 90 ",
      },
    };
  },
};
</script>

<style scoped>
.pulsar {
  animation: blink 0.8s linear infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

.fdoOK {
  background-color: #42a500;
  color: black;
}
.fdoNOK {
  background-color: #ff0000;
  color: white;
}

.mesclVert {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  margin-top: 0px;
  margin-bottom: 0px;
}

.borda {
  border-style: solid;
  border-width: 0.4rem;
  border-color: var(--primary-color);
  padding: 2%;
  padding-bottom: 0;
}

.totalizador {
  padding: 0;
  display: table;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
}

.conteudo {
  height: 100%;
}

.colunas {
  display: table;
  margin-top: 0px;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
}

.fonteMaior {
  font-size: 2.5vh;
}

.painel {
  height: 100%;
}
.grid {
  margin-top: 0px;
  margin-bottom: 0px;
  display: flex;
  justify-content: center;
}

.meta {
  padding: 1.3%;
  font-size: 2.5vh;
  font-weight: 700;
}
.col-4 {
  padding: 2%;
}
.col-7 {
  height: 100vh;
}
.turno {
  margin-top: 0;
  margin-bottom: -1vh;
  padding: 1vh;
  font-size: 2.5vh;
}
.metaHoje {
  font-size: 2vh;
  font-weight: bold;
}
.grafico {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 0;
  padding-bottom: auto;
  margin-top: -0.5vh;
}
.geral {
  padding-top: 0%;
  padding-bottom: 0%;
}
.quadro {
  background-color: aqua;
  display: table-cell;
  height: 100%;
  width: 100%;
}

.titulo {
  display: flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  margin-top: -1vh;
  margin-bottom: -1vh;
}
.box {
  border-radius: 0px;
  margin-bottom: 1.5%;

  padding-bottom: 0rem;
  padding-top: 0rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
    0 1px 3px 0 rgba(0, 0, 0, 0.12);
}
</style>