<template>
  <div class="meta">
    <h1>Teste do </h1>
    <div>
      <span> Dados para gravar: </span>
      <InputText type="text" v-model="valorGravar" />
      <span> <Button label="Gravar" @click="gravar()" /> </span>
      <span> <Button label="Ler" @click="ler()" /> </span>
      {{ respConfig.metaP_EE }}
      Teste: {{ teste }}

    </div>
    <div class="p-fluid seletores grid">
      <!-- Seleção do Departamento -->
      <div class="selectDepto col-3 field">
        <span class="p-float-label">
          <MultiSelect id="selDepto" :inputStyle="{ 'text-align': 'center', 'font-size': '0.9vw ' }"
            v-model="selecDepto" @change="atualizaMenu('Depto')" :options="listaFDeptos" optionValue="IDArea"
            optionLabel="Name" :filter="true" />
          <label for="selDepto"> Departamento: </label>
        </span>
      </div>


      <!-- Seleção do MGrp (Setor - Centro de Custo) -->
      <div class="selectMGrp col-3 field">
        <span class="p-float-label">
          <MultiSelect id="selCC" :inputStyle="{ 'text-align': 'center', 'font-size': '0.9vw ' }" v-model="selecCC"
            @change="atualizaMenu('CC')" :options="listaFCCs" optionValue="IDSector" optionLabel="Name"
            :filter="true" />
          <label for="selCC"> Centro de Custo: </label>
        </span>
      </div>

      <!-- Seleção do CT -->
      <div class="selectCT col-3 field ">
        <span class="p-float-label">
          <MultiSelect id="selCT" ref="selectCT" :inputStyle="{ 'text-align': 'center', 'font-size': '0.9vw ' }"
            v-model="selecCT" @change="atualizaMenu('CT')" :options="listaFCTsM" optionValue="IDResource"
            optionLabel="CT" :filter="true" />
          <label for="selCT"> Centro de Trabalho: </label>
        </span>
      </div>
    </div>

    <!-- Data Table editável -->
    <div>
      <ScrollPanel style="width: 100%; height: 70vh" class="custom">
        <DataTable :value="listaFCTs" editMode="cell" :scrollable="true" scrollHeight="flex"
          @cell-edit-complete="onCellEditComplete" class="editable-cells-table" responsiveLayout="scroll"
          sortField="dynamicSortField" :sortOrder="dynamicSortOrder">
          <Column field="Depto" header="Departamento" style="min-width:15%" :sortable="true"></Column>
          <Column field="CC" header="Centro de Custo" style="min-width:15%" :sortable="true"></Column>
          <Column field="CT" header="Centro de Trabalho" style="min-width:15%" :sortable="true"></Column>
          <Column field="metaP" header="Meta" style="min-width:15%" :sortable="true">
            <template #editor="{ data, field }">
              <InputText v-model="data[field]" autofocus />
            </template>
          </Column>
        </DataTable>
      </ScrollPanel>
    </div>

  </div>

</template>
<script>

export default {
  name: "Metas",
  data: function () {
    return {
      teste: '',
      listaFCTs: [], // Lista de Centros de Trabalho Filtrados para DataTable
      listaFCTsM: [], // Lista de Centros de Trabalho Filtrados para o Menu
      listaCCs: [], // Lista de Centros de Custo
      listaFCCs: [], // Lista de Centros de Custo Filtrados
      listaDeptos: [], // Lista de Departamentos
      listaFDeptos: [], // Lista de Departamentos Filtrados
      listaCTmetas: {}, // Lista de Centros de trabalho com as respectivas metas
      selecCT: [], // Centros de Trabalho Selecionados
      selecCC: [], // Centros de Custos Selecionados
      selecDepto: [],  // Departamentos Selecionados
      valorGravar: '',
      respConfig: '',
    }
  },
  mounted: function () {
    this.toInicializaMenu();

  },
  watch: {

    listaCTsReceb() {

      this.inicializaMenu();

    }

  },

  props: {
    listaCTsRecebC: Boolean, // Sinaliza se os dados dos Centros de Trabalhos foram recebidos para mostrar o formulário
    listaCTsC: Array, // Lista completa de Centros de trabalho consultadas no BD do MES
  },

  methods: {

    onCellEditComplete(event) {
      let { data, newValue, field } = event;


      var listaCTtmp = this.listaFCTs.map((item => {
        if (item.IDResource === data.IDResource) {
          item.metaP = newValue
          return item
        } else {
          return item
        }

      }))

      //this.listaCTmetas[data.IDResource] = newValue

      console.log("IDEX OF", this.listaFCTs.indexOf(data.IDResource))


      //this.listaFCTs[data.IDResource]["metaP"] = newValue
      //this.listaCTs[data.IDResource]["meta"]["metaP"] = newValue

      this.listaFCTs = listaCTtmp
      this.$socket.emit("atualizaMetas", this.listaFCTs)

      
      console.log(`$%$%$%$%$%$%$%$$%$%$%%$%$% Data: ${JSON.stringify(data.meta)} Novo valor: ${newValue} Field: ${field} - Lista atualizada: ${JSON.stringify(this.listaFCTs)}`)

    },
    toInicializaMenu() {

      if (this.listaCTsRecebC === true) {
        this.inicializaMenu();
      } else {
        // Caso não recebido a lista ainda, faz nova tentativa em 10 segundos
        setTimeout(this.toInicializaMenu, 2000)
      }

    },

    gravar() {
      this.$socket.emit("gravarConfig", this.valorGravar)
    },
    ler() {
      this.$socket.emit("leituraConfig")
    },
    inicializaMenu() {

      // Atualiza lista de itens filtrados dos Centros de Trabalho
      this.listaFCTs = this.listaCTsC

      this.listaFCTsM = this.listaFCTs


      // Filtra Departamentos disponíveis e elimina duplicados
      this.listaDeptos = this.listaCTsC.reduce((acc, index) => {
        acc["Codigos"] = acc["Codigos"] || []
        acc["Valores"] = acc["Valores"] || []
        if (!acc["Codigos"].includes(index.IDArea) && index.IDArea < 5000) {
          acc["Codigos"].push(index.IDArea)
          acc["Valores"].push({ Name: index.Depto, IDArea: index.IDArea })
        }
        return acc
      }, {})

      // Filtra Centros de Custo (Setores) e elimina duplicados
      this.listaCCs = this.listaCTsC.reduce((acc, index) => {
        acc["Codigos"] = acc["Codigos"] || []
        acc["Valores"] = acc["Valores"] || []
        if (!acc["Codigos"].includes(index.IDSector) && index.IDArea < 5000) {
          acc["Codigos"].push(index.IDSector)
          acc["Valores"].push({ Name: index.CC, IDArea: index.IDArea, IDSector: index.IDSector })
        }
        return acc
      }, {})

      this.listaFDeptos = this.listaDeptos.Valores
      this.listaFCCs = this.listaCCs.Valores

    },
    atualizaMenu(seletor) {


      if (seletor === "Depto") {

        this.$refs.selectCT.filterValue = null;

        if (this.selecDepto.length === 0) {

          this.listaFCCs = this.listaCCs.Valores

          this.selecCC = []

          this.listaFCTs = this.listaCTsC

          this.listaFCTsM = this.listaCTsC

          this.selecCT = []

        } else {

          this.listaFCCs = this.listaCCs.Valores.filter((item) => { return (this.selecDepto.indexOf(item.IDArea) != -1) })

          this.selecCC = this.listaFCCs.reduce((acc, index) => { acc.push(index.IDSector); return acc }, [])

          this.listaFCTs = this.listaCTsC.filter((item => { return (this.selecCC.indexOf(item.IDSector) != -1) }))

          this.listaFCTsM = this.listaFCTs

          this.selecCT = this.listaFCTs.reduce((acc, index) => { acc.push(index.IDResource); return acc }, [])


        }


      } else if (seletor === "CC") {

        this.$refs.selectCT.filterValue = null;

        this.selecDepto = [] // Zera marcação do seletor de departamentos

        if (this.selecCC.length === 0) {

          this.listaFCTs = this.listaCTsC

          this.listaFCTsM = this.listaFCTs

          this.selecCT = []

        } else {

          this.listaFCTs = this.listaCTsC.filter((item => { return (this.selecCC.indexOf(item.IDSector) != -1) }))

          this.listaFCTsM = this.listaFCTs

          this.selecCT = this.listaFCTs.reduce((acc, index) => { acc.push(index.IDResource); return acc }, [])

        }

      } else if (seletor === "CT") {

        this.selecDepto = [] // Zera marcação do seletor de Departamentos

        this.selecCC = [] // Zera marcação do setor de Centros de Custo

        if (this.selecCT.length === 0) {

          this.listaFCTs = this.listaCTsC

          //this.selecCT = []

        } else {

          this.listaFCTs = this.listaCTsC.filter((item => { return (this.selecCT.indexOf(item.IDResource) != -1) }))

          //this.selecCT = this.listaFCTs.reduce((acc, index) => { acc.push(index.IDResource); return acc }, [])

        }

      } else {


        this.selecDepto = [] // Zera marcação do seletor de departamentos
        this.selecCC = [] // Zera marcação do seletor de Centro de Custo (Setor)

      }
    },
  },
}

</script>
<style scoped>
.custom .p-scrollpanel-bar {
  background-color: #1976d2;
  opacity: 1;
  transition: background-color .3s;
}
</style>