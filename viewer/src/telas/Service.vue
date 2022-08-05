<template>
  <div>
<h1>Manutenção do LOG</h1>
<div>
    <InputText type="text" v-model="Texto" />

    <span> Resposta do Log: {{ msgRespLog }} </span>
    <span> <Button label="Enviar Mensagem" @click="enviaMsg()" /> </span>
    <span> <Button label="Receber Mensagem" @click="recebeMsg()" /> </span>

</div>

<h1>Teste do </h1>
<div>
    <InputText type="text" v-model="variavel" />

    <span> Dados para gravar: {{ variavel }} </span>
    <span> <Button label="Gravar" @click="gravaVariavel()" /> </span>
    <span> <Button label="Ler" @click="leituraBD()" /> </span>
    {{msgBD}}

</div>
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
    },
    gravaVariavel() {
      this.$socket.emit("inserir", this.variavel)
    },
    leituraBD() {
      this.$socket.emit("leituraBD")
    }

  },
  data: function () {
    return {
      msgRespLog: '',
      msgBD: '',
      variavel:'',
      Texto: ''
    }
  },
  sockets: {
    respostaLog(msg) {
      this.msgRespLog = msg

    },
    respostaBD(msg) {
      this.msgBD = msg
    }
  }
}

</script>
<style>
</style>