<template>
    <div>
        <div class="flex flex-column gap-2">
            <label for="adminName">Nome do administrador</label>
            <InputText id="adminName" v-model="configuracao.adminName" aria-describedby="username-help" />
        </div>
        <div class="flex flex-column gap-2">
            <label for="adminMail">e-mail do administrador</label>
            <InputText id="adminMail" v-model="configuracao.adminMail" aria-describedby="username-help" />
        </div>
        <Button  />
        <!-- @click="{$socket.emit('gravarConfig',[configuracao, 'config'])}" -->
        {{ configuracao }}
    </div>
</template>
  
<script>
export default {
    name: 'Config',
    props: [
    ],
    mounted() {
        this.$socket.emit("solicitaConfig")
    },
    data() {
        return {
            adminName: 'Nome',
            adminMail: 'e-mail',
            configuracao: {}

        }
    },
    sockets: {
        respConfig(resp) {
            this.configuracao = resp;

        }

    }
}
</script>