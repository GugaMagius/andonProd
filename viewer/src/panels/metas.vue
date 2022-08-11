<template>
  <div class="meta">
    <div class="linhaSuperior grid">
      <!-- Seleção de Unidade  -->
      <div class="inline col-6">
        <div class="radiobutton inline ">
          Meta por:
          <RadioButton class="radiobutton" id="depto" name="depto" value="depto" v-model="metaPor" />
          <label for="depto">Departamento</label>
        </div>
        <div class="radiobutton inline">
          <RadioButton class="radiobutton" id="CT" name="CT" value="CT" v-model="metaPor" />
          <label for="CT">Centro de Trabalho</label>
        </div>
      </div>

      <!-- Botão para atualizar-->
      <div class="inline col-6">
        <span> Dados para gravar: </span>
        <InputText type="text" v-model="valorGravar" />
        <span> <Button label="Gravar" @click="gravar()" /> </span>
        <span> <Button label="Ler" @click="ler()" /> </span>
        {{ respConfig.metaP_EE }}

      </div>
    </div>

    <div class="p-fluid seletores grid">
      <!-- Seleção do Departamento -->
      <div class="selectDepto col-3 field" v-if="metaPor != 'depto'">
        <span class="p-float-label">
          <MultiSelect id="selDepto" :inputStyle="{ 'text-align': 'center', 'font-size': '0.9vw ' }"
            v-model="selecDepto" @change="atualizaMenu('Depto')" :options="listaFDeptos" optionValue="IDArea"
            optionLabel="Name" :filter="true" />
          <label for="selDepto"> Departamento: </label>
        </span>
      </div>


      <!-- Seleção do MGrp (Setor - Centro de Custo) -->
      <div class="selectMGrp col-3 field" v-if="metaPor != 'depto'">
        <span class="p-float-label">
          <MultiSelect id="selCC" :inputStyle="{ 'text-align': 'center', 'font-size': '0.9vw ' }" v-model="selecCC"
            @change="atualizaMenu('CC')" :options="listaFCCs" optionValue="IDSector" optionLabel="Name"
            :filter="true" />
          <label for="selCC"> Centro de Custo: </label>
        </span>
      </div>

      <!-- Seleção do CT -->
      <div class="selectCT col-5 field" v-if="metaPor != 'depto'">
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
      <!-- Se meta por Centro de Trabalho -->
        <DataTable v-if="metaPor === 'CT'" :value="listaFCTs" editMode="cell" :scrollable="true" scrollHeight="flex"
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
        <!-- Se meta por Departamento -->
        <DataTable v-if="metaPor === 'depto'" :value="listaFDeptos" editMode="cell" :scrollable="true" scrollHeight="flex"
          @cell-edit-complete="onCellEditComplete" class="editable-cells-table" responsiveLayout="scroll"
          sortField="dynamicSortField" :sortOrder="dynamicSortOrder">
          <Column field="Name" header="Departamento" style="min-width:15%" :sortable="true"></Column>
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
      metaPor: "depto", // Seletor para configuração da meta, Por DEPARTAMENTO ou por CENTRO DE TRABALHO
      metaDepto: {}, // Valores temporários de meta por departamento
      metaCT: {} // Valores temporários de meta por Centro de Trabalho
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
    listaCTs: Array, // Lista completa de Centros de trabalho consultadas no BD do MES
  },

  methods: {

    onCellEditComplete(event) {
      let { data, newValue } = event;

      if (this.metaPor === "depto") {
        this.metaDepto[data.IDArea] = newValue
      this.listaFDeptos[data.IDArea]["metaP"] = newValue
      } else {
        this.metaCT[data.IDResource] = newValue
      this.listaFCTs[data.IDResource]["metaP"] = newValue
      }
      
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
      this.listaFCTs = this.listaCTs

      this.listaFCTsM = this.listaFCTs

      console.log(this.listaCTs)

      // Filtra Departamentos disponíveis e elimina duplicados
      this.listaDeptos = Object.values(this.listaCTs).reduce((acc, index) => {
        acc["Codigos"] = acc["Codigos"] || []
        acc["Valores"] = acc["Valores"] || {}
        if (!acc["Codigos"].includes(index.IDArea) && index.IDArea < 5000) {
          acc["Codigos"].push(index.IDArea)
          acc["Valores"][index.IDArea] = { Name: index.Depto, IDArea: index.IDArea }
        }
        return acc
      }, {})


      // Filtra Centros de Custo (Setores) e elimina duplicados
      this.listaCCs = Object.values(this.listaCTs).reduce((acc, index) => {
        acc["Codigos"] = acc["Codigos"] || []
        acc["Valores"] = acc["Valores"] || []
        if (!acc["Codigos"].includes(index.IDSector) && index.IDArea < 5000) {
          acc["Codigos"].push(index.IDSector)
          acc["Valores"].push({ Name: index.CC, IDArea: index.IDArea, IDSector: index.IDSector })
        }
        return acc
      }, {})

      this.listaFDeptos = Object.values(this.listaDeptos.Valores)
      this.listaFCCs = this.listaCCs.Valores

    },
    atualizaMenu(seletor) {


      if (seletor === "Depto") {

if (this.metaPor === "CT") {

        this.$refs.selectCT.filterValue = null;

}

        if (this.selecDepto.length === 0) {

          this.listaFCCs = this.listaCCs.Valores

          this.selecCC = []

          this.listaFCTs = this.listaCTs

          this.listaFCTsM = this.listaCTs

          this.selecCT = []

        } else {

          this.listaFCCs = this.listaCCs.Valores.filter((item) => { return (this.selecDepto.indexOf(item.IDArea) != -1) })

          this.selecCC = this.listaFCCs.reduce((acc, index) => { acc.push(index.IDSector); return acc }, [])

          this.listaFCTs = Object.values(this.listaCTs).filter((item => { return (this.selecCC.indexOf(item.IDSector) != -1) }))

          this.listaFCTsM = this.listaFCTs

          this.selecCT = this.listaFCTs.reduce((acc, index) => { acc.push(index.IDResource); return acc }, [])

        }

      } else if (seletor === "CC") {

        this.$refs.selectCT.filterValue = null;

        this.selecDepto = [] // Zera marcação do seletor de departamentos

        if (this.selecCC.length === 0) {

          this.listaFCTs = this.listaCTs

          this.listaFCTsM = this.listaFCTs

          this.selecCT = []

        } else {

          this.listaFCTs = Object.values(this.listaCTs).filter((item => { return (this.selecCC.indexOf(item.IDSector) != -1) }))

          this.listaFCTsM = this.listaFCTs

          this.selecCT = this.listaFCTs.reduce((acc, index) => { acc.push(index.IDResource); return acc }, [])

        }

      } else if (seletor === "CT") {

        this.selecDepto = [] // Zera marcação do seletor de Departamentos

        this.selecCC = [] // Zera marcação do setor de Centros de Custo

        if (this.selecCT.length === 0) {

          this.listaFCTs = this.listaCTs

          //this.selecCT = []

        } else {

          this.listaFCTs = this.listaCTs.filter((item => { return (this.selecCT.indexOf(item.IDResource) != -1) }))

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

.radiobutton {
  margin: 1%;
}

.inline {
  display: inline;
}

.linhaSuperior {
  padding: 1.1%;
}

.meta{
  overflow-x: hidden;
}


</style>