<template>
  <div>
    Dados Recebidos:
    <div>{{ dadosRecebidosEE }}</div>

    <br />

    {{ valoresEE }}
  </div>
</template>

<script>
export default {
  mounted() {
    setInterval(this.solicitaAtualiz, 2000);
  },
  methods: {
    myEventHandler() {},
    solicitaAtualiz() {
      this.$socket.emit("dadosSolicitados", "AtualizaDadosEE");
    },
  },
  components: {},
  sockets: {
    AtualizaDados(dados) {
      this.valoresEE = dados;
      if (dados != undefined) {
        this.dadosRecebidosEE = true;
      }
    },
  },

  data() {
    return {
      dadosRecebidosEE: false,
      valoresEE: {},
    };
  },
};
</script>

<style scoped>
</style>