<template>
  <div>
    <h1>Teste do </h1>
    <div>
      <span> Dados para gravar: </span>
      <InputText type="text" v-model="valorGravar" />
      <span> <Button label="Gravar" @click="gravar()" /> </span>
      <span> <Button label="Ler" @click="ler()" /> </span>
      {{ respConfig }}

    </div>
  </div>

</template>
<script>

export default {
  name: "Metas",
  methods: {
    gravar() {
      this.$socket.emit("gravarConfig", this.valorGravar)
    },
    ler() {
      this.$socket.emit("leituraConfig")
    }
  },
  data: function () {
    return {
      valorGravar: '',
      respConfig:'',
    }
  },
  sockets: {
    respStorage(msg) {
      this.respConfig = msg
    }
  }
}

</script>
