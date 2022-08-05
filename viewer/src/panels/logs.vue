<template>
  <div>

    <h1>Manutenção do LOG</h1>

    <div>
      <InputText type="text" v-model="Texto" />

      <span> Resposta do Log: {{ msgRespLog }} </span>
      <span> <Button label="Enviar Mensagem" @click="enviaMsg()" /> </span>
      <span> <Button label="Receber Mensagem" @click="recebeMsg()" /> </span>

    </div>
    
  </div>

</template>
<script>

export default {
  name: "Logs",

  methods: {
    enviaMsg() {
      this.$socket.emit("gravaLog", this.Texto)
    },
    recebeMsg() {
      this.$socket.emit("lerLog")
    },

  },
  data: function () {
    return {
      msgRespLog: '',
      msgBD: '',
      Texto: '',
    }
  },
  sockets: {
    respostaLog(msg) {
      this.msgRespLog = msg

    },
  }
}

</script>