<template>
  <div v-if="dadosRecebidosPP" class="semScrool">
    <TelaAndon :dadosServer="dadosServer" :ecoat="false" :unidMedia="'(m2/h)'" :unidQtd="'(m2)'" :sufixoMeta="' m2/h'"
      :setor="'PP'" :metaP="metas['metaCC']['91']['metaS']" :condP="'>='" />
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
  watch: {
    metas() {

      try {
        if (this.metas['metaCC']['91']['metaS'] !== undefined) {
          this.metaP = this.metas['metaCC']['91']['metaS']
        }
      } catch (err) {
        console.log("Não foi possível ler a meta do setor de PINTURA PÓ")
      }
      this.dadosRecebidosPP = true;
    }

  },
  data() {
    return {
      metaP: 0,
      dadosRecebidosPP: false
    }
  }

};

</script>

<style scoped>
.semScrool {
  overflow-x: hidden;
  overflow-y: hidden;

}
</style>