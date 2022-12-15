<template>
    <div>
        <!-- Tabela com valores e metas -->
        <div class="col-1 totalizador">

            <table >

                <tr v-if="titulo" >
                    <th> Equipamento </th>
                    <th> Turno </th>
                    <th>
                        <label> Jan </label>
                    </th>
                    <th>
                        <label> Fev </label>
                    </th>
                    <th>
                        <label> Mar </label>
                    </th>
                    <th>
                        <label> Abr </label>
                    </th>
                    <th>
                        <label> Mai </label>
                    </th>
                    <th>
                        <label> Jun </label>
                    </th>
                    <th>
                        <label> Jul </label>
                    </th>
                    <th>
                        <label> Ago </label>
                    </th>
                    <th>
                        <label> Set </label>
                    </th>
                    <th>
                        <label> Out </label>
                    </th>
                    <th>
                        <label> Nov </label>
                    </th>
                    <th>
                        <label> Dez </label>
                    </th>
                    <th>
                        <label> </label>
                    </th>
                    <th>
                        <label> Ontem </label>
                    </th>
                    <th>
                        <label> Hoje </label>
                    </th>
                    <th></th>
                </tr>
                
                <!-- Turno 1 -->
                <tr>
                    <td rowspan="4">
                        <div class="labelLinha"> {{ Equipamento }} </div>
                    </td>
                    <td> <div style="width:3.5vw"> T1 </div> </td>
                    <td v-for="mes in Meses.T1" :key="mes">
                        <!-- <InputNumber :inputStyle="confTable(mes)" modelValue="medCapDisponivel" readonly="true"
                            :suffix="sufixoTot + '/' + selecPeriodo.code" /> -->
                        <InputNumber :inputStyle="confTable(mes)" :modelValue="parseInt(mes)" readonly="true" />
                    </td>

                    <td>
                        <div class="divisor"></div>
                    </td>
                    <td>
                        <InputNumber :inputStyle="confTable(parseInt(Ontem.T1))" :modelValue="parseInt(Ontem.T1)" readonly="true" />
                    </td>
                    <td>
                        <InputNumber :inputStyle="confTable(parseInt(Hoje.T1))" :modelValue="parseInt(Hoje.T1)" readonly="true" />
                    </td>
                    <td>kg/h</td>
                </tr>

                <!-- Turno 2 -->
                <tr>
                    <td> T2 </td>
                    <td v-for="mes in Meses.T2" :key="mes">
                        <!-- <InputNumber :inputStyle="confTable(mes)" modelValue="medCapDisponivel" readonly="true"
            :suffix="sufixoTot + '/' + selecPeriodo.code" /> -->
                        <InputNumber :inputStyle="confTable(mes)" :modelValue="parseInt(mes)" readonly="true" />
                    </td>

                    <td>
                        <div class="divisor"></div>
                    </td>
                    <td>
                        <InputNumber :inputStyle="confTable(parseInt(Ontem.T2))" :modelValue="parseInt(Ontem.T2)" readonly="true" />
                    </td>
                    <td>
                        <InputNumber :inputStyle="confTable(parseInt(Hoje.T2))" :modelValue="parseInt(Hoje.T2)" readonly="true" />
                    </td>
                    <td>kg/h</td>
                </tr>

                <!-- Turno 3 -->
                <tr>
                    <td> T3 </td>
                    <td v-for="mes in Meses.T3" :key="mes">
                        <!-- <InputNumber :inputStyle="confTable(mes)" modelValue="medCapDisponivel" readonly="true"
            :suffix="sufixoTot + '/' + selecPeriodo.code" /> -->
                        <InputNumber :inputStyle="confTable(mes)" :modelValue="parseInt(mes)" readonly="true" />
                    </td>

                    <td>
                        <div class="divisor"></div>
                    </td>
                    <td>
                        <InputNumber :inputStyle="confTable(parseInt(Ontem.T3))" :modelValue="parseInt(Ontem.T3)" readonly="true" />
                    </td>
                    <td>
                        <InputNumber :inputStyle="confTable(parseInt(Hoje.T3))" :modelValue="parseInt(Hoje.T3)" readonly="true" />
                    </td>
                    <td>kg/h</td>
                </tr>

                
                <!-- Total -->
                <tr>
                    <td> Total </td>
                    <td v-for="mes in Meses.Tot" :key="mes">
                        <!-- <InputNumber :inputStyle="confTable(mes)" modelValue="medCapDisponivel" readonly="true"
            :suffix="sufixoTot + '/' + selecPeriodo.code" /> -->
                        <InputNumber :inputStyle="confTable(mes, 'total')" :modelValue="parseInt(mes)" readonly="true" />
                    </td>

                    <td>
                        <div class="divisor"></div>
                    </td>
                    <td>
                        <InputNumber :inputStyle="confTable(parseInt(Ontem.Tot), 'total')" :modelValue="parseInt(Ontem.Tot)" readonly="true" />
                    </td>
                    <td>
                        <InputNumber :inputStyle="confTable(parseInt(Hoje.Tot), 'total')" :modelValue="parseInt(Hoje.Tot)" readonly="true" />
                    </td>
                    <td>kg/h</td>
                </tr>

            </table>
        </div>

    </div>

</template>

<script>

export default {
    props: {
        Equipamento: String,
        Meses: Array,
        Ontem: Array,
        Hoje: Array,
        titulo: Boolean,
        meta: Number
    },

    data() {
        return {

        }
    },
    methods: {

        confTable(valorRec, total) {
            let font
            let background
            if (valorRec >= parseFloat(this.meta)) {
                if (total === 'total') {
                    background = 'green'
                    font = 'black'
                } else {
                    background = ''
                    font = 'green'
                }

            } else {
                if (total === 'total') {
                    background = 'red'
                    font = 'black'
                } else {
                    background = ''
                    font = 'red'
                }

            }

            
            return { 'text-align': 'center', 'background-color': background ,'font-size': '0.8vw ', 'margin-left': '0.7vw', 'margin-right': '0.7vw', color: font, height: '0.3vh', width: '3vw' }
        },

    }
}
</script>

<style scoped>
.divisor {
    width: 2vw
}

.labelLinha {
    width: 7vw;
}


</style>