<template>
  <div>
    <TabMenu :model="itemsMenu" />

    <router-view name="panel" :listaCTsRecebC="listaCTsReceb" :listaCTs="listaCTsC" :metasRec="metas"
      :ctsSelecRec="selecaoCTs"></router-view>

  </div>

</template>
<script>

export default {
  name: "Service",
  props: {
    listaCTsReceb: Boolean, // Sinaliza se os dados dos Centros de Trabalhos foram recebidos para mostrar o formulário
    listaCTsC: Array, // Lista completa de Centros de trabalho consultadas no BD do MES
    metas: Object, // Variavel com os valores de metas configurados (storage)
    selecaoCTs: Array // Variável com a seleção de CTs utilizáveis nos relatórios
  },

  data: function () {
    return {
      itemsMenu: [
        { label: 'Metas', icon: 'pi pi-fw pi-chart-line', to: '/service/metas' },
        { label: 'Seleção CTs', icon: 'pi pi-fw pi-list', to: '/service/selecaocts' },
        { label: 'Log', icon: 'pi pi-fw pi-exclamation-circle', to: '/service/logs' },
        { label: 'Testes', icon: 'pi pi-fw pi-cog', to: '/service/testes' }
      ]
    }
  }
}

</script>
<style>

</style>