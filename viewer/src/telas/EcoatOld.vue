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
      :produzidos="produzidosLE"
      :perdidos="perdidosLE"
      :performance="performanceLE"
      :ecoat="true"
      :unidMedia="'(bast/h)'"
      :unidQtd="'(bast)'"
      :prefixoMeta="'performance'"
      :metaP="produzidosLE.metaP"
      :perfMeta="performanceLE.meta"
      :sufixoMeta="' %'"
      :alturaGraficoH="3"
      :alturaGraficoO="2"
      :larguraGraficoH="5"
      :larguraGraficoO="5"
    />
  </div>
</template>

<script>
import TelaAndon from "../components/telaAndon.vue";

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
    this.$socket.emit("dadosSolicitados", "Solicitando atualização de dados");
    if (this.dadosServer.produzidosLE != undefined) {
      this.produzidosLE = this.dadosServer.produzidosLE;
      this.perdidosLE = this.dadosServer.perdidosLE;
      this.dadosRecebidosLE = true;
    }
  },
  watch: {
    dadosServer() {
      if (this.dadosServer.produzidosLE != undefined) {
        this.produzidosLE = this.dadosServer.produzidosLE;
        this.perdidosLE = this.dadosServer.perdidosLE;
        this.dadosRecebidosLE = true;
      }
    },
  },
  methods: {},
  sockets: {
    AtualizaDados(dados) {
      try {
        if (dados.produzidosLE != undefined) {
          this.produzidosLE = dados.produzidosLE;
          this.perdidosLE = dados.perdidosLE;

          this.performanceLE["Hoje"]["Turno1"] =
            (this.produzidosLE["Hoje"]["Turno1"]["soma"] * 100) /
            (this.produzidosLE["Hoje"]["Turno1"]["soma"] +
              this.perdidosLE["Hoje"]["Turno1"]["soma"]);
          this.performanceLE["Hoje"]["Turno2"] =
            (this.produzidosLE["Hoje"]["Turno2"]["soma"] * 100) /
            (this.produzidosLE["Hoje"]["Turno2"]["soma"] +
              this.perdidosLE["Hoje"]["Turno2"]["soma"]);
          this.performanceLE["Hoje"]["Turno3"] =
            (this.produzidosLE["Hoje"]["Turno3"]["soma"] * 100) /
            (this.produzidosLE["Hoje"]["Turno3"]["soma"] +
              this.perdidosLE["Hoje"]["Turno3"]["soma"]);
          this.performanceLE["Ontem"]["Turno1"] =
            (this.produzidosLE["Ontem"]["Turno1"]["soma"] * 100) /
            (this.produzidosLE["Ontem"]["Turno1"]["soma"] +
              this.perdidosLE["Ontem"]["Turno1"]["soma"]);
          this.performanceLE["Ontem"]["Turno2"] =
            (this.produzidosLE["Ontem"]["Turno2"]["soma"] * 100) /
            (this.produzidosLE["Ontem"]["Turno2"]["soma"] +
              this.perdidosLE["Ontem"]["Turno2"]["soma"]);
          this.performanceLE["Ontem"]["Turno3"] =
            (this.produzidosLE["Ontem"]["Turno3"]["soma"] * 100) /
            (this.produzidosLE["Ontem"]["Turno3"]["soma"] +
              this.perdidosLE["Ontem"]["Turno3"]["soma"]);
          let somaHojeProd =
            this.produzidosLE["Hoje"]["Turno1"]["soma"] +
            this.produzidosLE["Hoje"]["Turno2"]["soma"] +
            this.produzidosLE["Hoje"]["Turno3"]["soma"];
          let somaOntemProd =
            this.produzidosLE["Ontem"]["Turno1"]["soma"] +
            this.produzidosLE["Ontem"]["Turno2"]["soma"] +
            this.produzidosLE["Ontem"]["Turno3"]["soma"];

          let somaHojePerd =
            this.perdidosLE["Hoje"]["Turno1"]["soma"] +
            this.perdidosLE["Hoje"]["Turno2"]["soma"] +
            this.perdidosLE["Hoje"]["Turno3"]["soma"];
          let somaOntemPerd =
            this.perdidosLE["Ontem"]["Turno1"]["soma"] +
            this.perdidosLE["Ontem"]["Turno2"]["soma"] +
            this.perdidosLE["Ontem"]["Turno3"]["soma"];

          this.performanceLE["Hoje"]["total"] =
            (somaHojeProd / (somaHojeProd + somaHojePerd)) * 100;
          this.performanceLE["Ontem"]["total"] =
            (somaOntemProd / (somaOntemProd + somaOntemPerd)) * 100;

          if (
            eval(
              `${this.performanceLE["Hoje"]["total"]} ${this.performanceLE.meta}`
            )
          ) {
            this.metaPerfHoje = this.corOK;
          } else {
            this.metaPerfHoje = this.corNOK;
          }

          if (
            eval(
              `${this.performanceLE["Ontem"]["total"]} ${this.performanceLE.meta}`
            )
          ) {
            this.metaPerfOntem = this.corOK;
          } else {
            this.metaPerfOntem = this.corNOK;
          }

          this.dadosRecebidosLE = true;
        }
      } catch (err) {
        console.log("FALHA AO ATUALIZAR DADOS: ", err);
      }
    },
  },
  data() {
    return {
      alturaAtual: "",
      larguraGraficoH: "",
      larguraGraficoO: "",
      dadosRecebidosLE: false,
      produzidosLE: {},
      corOK: "#42A500",
      corNOK: "#ff0000",
      perdidosLE: {},
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
      metaPerfHoje: false,
      metaPerfOntem: false,
      tamGrafOntem: 90,
      tamGrafHoje: 140,
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