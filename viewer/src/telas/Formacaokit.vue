<template>
  <div v-if="dadosRecebidosFK" class="semScrool">
    <TelaAndon :dadosServer="dadosServer" :ecoat="false" :unidMedia="'(m2/h)'" :unidQtd="'(m2)'" :sufixoMeta="' m2/h'"
      :setor="'FK'" :metaP="metaP" :condP="'>='" />
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
        if (this.metas['metaCC']['118']['metaS'] !== undefined) {
          this.metaP = this.metas['metaCC']['118']['metaS']
        }
      } catch (err) {
        console.log("Não foi possível ler a meta do setor de formação de Kits")
      }
      this.dadosRecebidosFK = true;
    }

  },
  data() {
    return {
      metaP: 0,
      dadosRecebidosFK: false
    }
  }

};

</script>

<style scoped>
</style>