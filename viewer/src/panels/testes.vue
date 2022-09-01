<template>
    <div>
        <h1>Tela de Testes</h1>
        Metas: {{ meta }}
        <br>
        <div style="{'margin-top': '5%'}">
            Seleção CTs: {{ selecaoCTs }}
        </div>
        <div style="{'margin-top': '5%'}">
            Lista CTs: {{ listaCTs }}
        </div>

    </div>

</template>
<script>

export default {
    data() {
        return {
            meta: '',
            selecaoCTs: '',
            listaCTs: ''

        }
    },
    sockets: {

        teste([meta, selecaoCTs, listaCTs]) {
            listaCTs.unshift({ ct: "*Enganchamento E-coat", idresource: "EE", cc: 'ENGANCHAMENTO E-COAT', idsector: 5000, depto: 'ENGANCHAMENTO E-COAT', idarea: 5000 })
            listaCTs.unshift({ ct: "*Linha E-coat (Bastidor)", idresource: "ecoat", cc: 'E-COAT (SUPERVISORIO)', idsector: 5001, depto: 'E-COAT (SUPERVISORIO)', idarea: 5001 })

            this.meta = meta
            this.selecaoCTs = selecaoCTs
            this.listaCTs = listaCTs

        }
    }

}


</script>