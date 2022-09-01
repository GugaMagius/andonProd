<template>
  <div v-if="dadosRecebidosPL" class="semScrool">
    <TelaAndon :dadosServer="dadosServer" :ecoat="false" :unidMedia="'(m2/h)'" :unidQtd="'(m2)'" :sufixoMeta="' m2/h'"
      :setor="'PL'" :metaP="metas['metaCC']['93']['metaS']" :condP="'>='" />
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
  methods: {
    verificaDados() {
      try {
        if (this.metas['metaCC']['93']['metaS'] !== undefined && this.dadosServer.dados_PL !== undefined) {
          console.log("arquivos sendo atualizados")
          this.metaP = this.metas['metaCC']['93']['metaS']

          this.dadosRecebidosPL = true;

        } else {
          console.log("Arquivos vazios, inidicando nova tentativa")
          setTimeout(this.verificaDados, 1000) // Aguarda 1 segundo e tenta ler dados novamente

        }
      } catch (err) {
        console.log("Não foi possível ler os dados de meta ou produção", this.metas)
        setTimeout(this.verificaDados, 10000) // Aguarda 10 segundos e tenta ler dados novamente

      }
    }

  },
  data() {
    return {
      metaP: 0,
      dadosRecebidosPL: false
    }
  }

};

</script>


<style scoped>
</style>