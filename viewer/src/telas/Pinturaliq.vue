<template>
  <div>
    <TelaAndon
    :dadosServer="dadosServer"
    :ecoat="false"
    :unidMedia="'(m2/h)'"
    :unidQtd="'(m2)'"
    :sufixoMeta="' m2/h'"
    :setor="'PL'"
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



};

</script>

<style scoped>
</style>