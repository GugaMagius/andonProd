
<template>
  <div v-if="dadosRecebidosLE">
    <TelaAndon
    :dadosServer="dadosServerLE"
    :ecoat="true"
    :unidMedia="'(bast/h)'"
    :unidQtd="'(bast)'"
    :sufixoMeta="' %'"
    :setor="'LE'"
    :metaP="metaP"
    :condP="'>='"
    :metaS=0
    :condS="'<='"
    />
  </div>
</template>

<script>
import TelaAndon from "../components/telaAndon.vue";

export default {
  components: {
    TelaAndon
  },
  props: {
    dadosServer: Object, // Dados completos recebidos do servidor
    metas: Object, // Arquivo de metas
  },
  mounted() {

    this.verificaDados();

  },
  data() {
    return {

      metaP: 0,
      dadosRecebidosLE: false,
      performance_LE: {},
      dadosServerLE: {}

    }
  },
  methods: {
    verificaDados() {
      try {
        if (this.metas['metaCC']['5001']['metaP'] !== undefined && this.dadosServer.produzidos_LE !== undefined) {
          this.metaP = this.metas['metaCC']['5001']['metaP']
          this.calcPerformance();


        } else {
          console.log("Arquivos vazios, inidicando nova tentativa")
        setTimeout(this.verificaDados, 1000) // Aguarda 1 segundo e tenta ler dados novamente
          
        }
      } catch (err) {
        console.log("Não foi possível ler os dados de meta ou produção", this.metas)
        setTimeout(this.verificaDados, 10000) // Aguarda 10 segundos e tenta ler dados novamente

      }
    },
    calcPerformance() {
      try {
        if (this.dadosServer.produzidos_LE != undefined) {
          this.dadosServerLE = this.dadosServer
          this.dadosServerLE["performance_LE"] = {Hoje: {}, Ontem: {}}

          this.dadosServerLE.performance_LE["Hoje"]["Turno1"] =
            (this.dadosServerLE.produzidos_LE["Hoje"]["Turno1"]["soma"] * 100) /
            (this.dadosServerLE.produzidos_LE["Hoje"]["Turno1"]["soma"] +
              this.dadosServerLE.perdidos_LE["Hoje"]["Turno1"]["soma"]);
          this.dadosServerLE.performance_LE["Hoje"]["Turno2"] =
            (this.dadosServerLE.produzidos_LE["Hoje"]["Turno2"]["soma"] * 100) /
            (this.dadosServerLE.produzidos_LE["Hoje"]["Turno2"]["soma"] +
              this.dadosServerLE.perdidos_LE["Hoje"]["Turno2"]["soma"]);
          this.dadosServerLE.performance_LE["Hoje"]["Turno3"] =
            (this.dadosServerLE.produzidos_LE["Hoje"]["Turno3"]["soma"] * 100) /
            (this.dadosServerLE.produzidos_LE["Hoje"]["Turno3"]["soma"] +
              this.dadosServerLE.perdidos_LE["Hoje"]["Turno3"]["soma"]);
          this.dadosServerLE.performance_LE["Ontem"]["Turno1"] =
            (this.dadosServerLE.produzidos_LE["Ontem"]["Turno1"]["soma"] * 100) /
            (this.dadosServerLE.produzidos_LE["Ontem"]["Turno1"]["soma"] +
              this.dadosServerLE.perdidos_LE["Ontem"]["Turno1"]["soma"]);
          this.dadosServerLE.performance_LE["Ontem"]["Turno2"] =
            (this.dadosServerLE.produzidos_LE["Ontem"]["Turno2"]["soma"] * 100) /
            (this.dadosServerLE.produzidos_LE["Ontem"]["Turno2"]["soma"] +
              this.dadosServerLE.perdidos_LE["Ontem"]["Turno2"]["soma"]);
          this.dadosServerLE.performance_LE["Ontem"]["Turno3"] =
            (this.dadosServerLE.produzidos_LE["Ontem"]["Turno3"]["soma"] * 100) /
            (this.dadosServerLE.produzidos_LE["Ontem"]["Turno3"]["soma"] +
              this.dadosServerLE.perdidos_LE["Ontem"]["Turno3"]["soma"]);
          let somaHojeProd =
            this.dadosServerLE.produzidos_LE["Hoje"]["Turno1"]["soma"] +
            this.dadosServerLE.produzidos_LE["Hoje"]["Turno2"]["soma"] +
            this.dadosServerLE.produzidos_LE["Hoje"]["Turno3"]["soma"];
          let somaOntemProd =
            this.dadosServerLE.produzidos_LE["Ontem"]["Turno1"]["soma"] +
            this.dadosServerLE.produzidos_LE["Ontem"]["Turno2"]["soma"] +
            this.dadosServerLE.produzidos_LE["Ontem"]["Turno3"]["soma"];

          let somaHojePerd =
            this.dadosServerLE.perdidos_LE["Hoje"]["Turno1"]["soma"] +
            this.dadosServerLE.perdidos_LE["Hoje"]["Turno2"]["soma"] +
            this.dadosServerLE.perdidos_LE["Hoje"]["Turno3"]["soma"];
          let somaOntemPerd =
            this.dadosServerLE.perdidos_LE["Ontem"]["Turno1"]["soma"] +
            this.dadosServerLE.perdidos_LE["Ontem"]["Turno2"]["soma"] +
            this.dadosServerLE.perdidos_LE["Ontem"]["Turno3"]["soma"];

          this.dadosServerLE.performance_LE["Hoje"]["total"] =
            (somaHojeProd / (somaHojeProd + somaHojePerd)) * 100;
          this.dadosServerLE.performance_LE["Ontem"]["total"] =
            (somaOntemProd / (somaOntemProd + somaOntemPerd)) * 100;

          if (
            eval(
              `${this.dadosServerLE.performance_LE["Hoje"]["total"]} >= ${this.metaP}`
            )
          ) {
            this.metaPerfHoje = this.corOK;
          } else {
            this.metaPerfHoje = this.corNOK;
          }

          if (
            eval(
              `${this.dadosServerLE.performance_LE["Ontem"]["total"]} >= ${this.metaP}`
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
        setTimeout(this.calcPerformance, 1000)
      }
    }
  }



};

</script>


<style scoped>

</style>