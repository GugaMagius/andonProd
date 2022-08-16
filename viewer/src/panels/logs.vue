<template>
  <div>

    <h2>Log de falhas</h2>

    <div>
      <InputText type="text" v-model="Texto" />
      <span> <Button label="Enviar Mensagem" @click="enviaMsg()" /> </span>
      <br>
      <span ><div style="margin-top: 1vh"><Button label="Receber Mensagem" @click="recebeMsg()" /> </div></span>
      <br>
      <div style="margin-top: 1vh">
      <li v-for="log in msgRespLog" :key="log.DataHora"> {{ log }} </li>
      </div>

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
