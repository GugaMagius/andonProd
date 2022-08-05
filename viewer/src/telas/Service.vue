<template>
  <div>
<TabMenu :model="itemsMenu" />

<router-view name="panel"></router-view>

  </div>

</template>
<script>

export default {
  name: "Service",

  data: function () {
    return {
      itemsMenu: [
        { label: 'Metas', icon: 'pi pi-fw pi-chart-line', to: '/service/metas' },
        { label: 'Log', icon: 'pi pi-fw pi-exclamation-circle', to: '/service/logs' },
        { label: 'Testes', icon: 'pi pi-fw pi-cog', to: '/service/testes' }
      ]
    }
  }
}

</script>
<style>
</style>