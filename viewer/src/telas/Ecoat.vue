<template>
  <div>
    <TelaAndon
    :dadosServer="dadosServerLE"
    :ecoat="true"
    :unidMedia="'(bast/h)'"
    :unidQtd="'(bast)'"
    :sufixoMeta="' bast/h'"
    :setor="'LE'"
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
  },
  data() {
    return {
      performance_LE: {},
      dadosServerLE: {}
    }
  },
  watch: {
    dadosServer() {
      
      try {
        if (this.dadosServer.produzidos_LE != undefined) {
          this.dadosServerLE = this.dadosServer
          this.dadosServerLE["performance_LE"] = {Hoje: {}, Ontem: {}}
          this.dadosServerLE["performance_LE"]["metaP"] = this.dadosServer.produzidos_LE.metaP

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
              `${this.dadosServerLE.performance_LE["Hoje"]["total"]} ${this.dadosServerLE.performance_LE.metaP}`
            )
          ) {
            this.metaPerfHoje = this.corOK;
          } else {
            this.metaPerfHoje = this.corNOK;
          }

          if (
            eval(
              `${this.dadosServerLE.performance_LE["Ontem"]["total"]} ${this.dadosServerLE.performance_LE.metaP}`
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
    }
  }


};

</script>

<style scoped>

</style>