<template>
  <div v-if="dadosRecebidosEE" class="semScrool">
    <TelaAndon
    :dadosServer="dadosServer"
    :ecoat="false"
    :unidMedia="'(m2/h)'"
    :unidQtd="'(m2)'"
    :sufixoMeta="' m2/h'"
    :setor="'EE'"
    :metaP="metas['metaCC']['5000']['metaS']"
    :condP="'>='"
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
  watch: {
    metas() {

      try {
        if (this.metas['metaCC']['5000']['metaS'] !== undefined) {
          this.metaP = this.metas['metaCC']['5000']['metaS']
        }
      } catch (err) {
        console.log("Não foi possível ler a meta do setor de formação de Kits")
      }
      this.dadosRecebidosEE = true;
    }

  },
  data() {
    return {
      metaP: 0,
      dadosRecebidosEE: false
    }
  }


};

</script>

<style scoped>

</style>