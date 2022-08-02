<template>
  <div>

    <InputText type="text" v-model="Texto" />

    <span> Resposta do Log: {{ msgRespLog }} </span>
    <span> <Button label="Enviar Mensagem" @click="enviaMsg()" /> </span>
    <span> <Button label="Receber Mensagem" @click="recebeMsg()" /> </span>

  </div>

</template>
<script>

export default {
  name: "Service",
  components: {
  },

  mounted() {

  },
  methods: {
    enviaMsg() {
      this.$socket.emit("gravaLog", this.Texto)
    },
    recebeMsg() {
      this.$socket.emit("lerLog")
    }

  },
  data: function () {
    return {
      msgRespLog: '',
      Texto: ''
    }
  },
  sockets: {
    respostaLog(msg) {
      this.msgRespLog = msg

    }
  }
}

</script>
<style>
</style>