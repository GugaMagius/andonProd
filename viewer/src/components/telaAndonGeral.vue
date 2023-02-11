<template>
    <div>
        <!-- Tabela com valores e metas -->
        <div class="totalizador">

            <linhaAndonGeral Equipamento="Maquina1" :Meses="mesesM1" :Ontem="ontemM1" :Hoje="hojeM1" :meta="meta" :titulo=true />

            <linhaAndonGeral Equipamento="Maquina2" :Meses="mesesM1" :Ontem="ontemM1" :Hoje="hojeM1" :meta="meta" :titulo=false />

            <linhaAndonGeral Equipamento="Maquina3" :Meses="mesesM1" :Ontem="ontemM1" :Hoje="hojeM1" :meta="meta" :titulo=false />

            <linhaAndonGeral Equipamento="Maquina4" :Meses="mesesM1" :Ontem="ontemM1" :Hoje="hojeM1" :meta="meta" :titulo=false />

        </div>

    </div>

</template>

<script>
import linhaAndonGeral from "../components/linhaAndonGeral.vue";

export default {

    components: {
        linhaAndonGeral

    },

    data() {
        return {
            meta: 43,
            mesesM1: {
                T1: [43, 55, 32, 88, 93, 23, 9, 15, 22, 21, 15, 12],
                T2: [55, 32, 43, 87, 24, 91, 12, 9, 32, 44, 81, 8],
                T3: [52, 22, 27, 74, 8, 34, 65, 71, 23, 11, 43, 34],
                Tot: [13, 101, 35, 56, 51, 44, 38, 88, 90, 57, 60, 61]
            },
            ontemM1: {
                T1: 44,
                T2: 41,
                T3: 53,
                Tot: 48
            },
            hojeM1: {
                T1: 41,
                T2: 47,
                T3: 48,
                Tot: 53
            }

        }
    },
    methods: {

        confTable() {
            return { 'text-align': 'center', 'font-size': '0.8vw ', color: 'lightgray', height: '0.3vh', width: '5vw' }
        },

    }
}
</script>

<style scoped>
label {
    text-align: center;
    font-size: 0.8vw;
    color: black;
    height: 0.3vh;
    width: 5vw;
}
</style>