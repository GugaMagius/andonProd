<template>
  <div class="principal">


    <!-- Seletores de departamento/CC/CT -->
    <div class="p-fluid seletores grid">
      <!-- Seleção do Departamento -->
      <div class="selectDepto col-3 field">
        <span class="p-float-label">
          <MultiSelect id="selDepto" :inputStyle="{ 'text-align': 'center', 'font-size': '0.9vw ' }"
            v-model="selecDepto" @change="atualizaMenu('Depto')" :options="Object.values(listaDeptos)"
            optionValue="idarea" optionLabel="depto" :filter="true" />
          <label for="selDepto"> Departamento: </label>
        </span>
      </div>


      <!-- Seleção do MGrp (Setor - Centro de Custo) -->
      <div class="selectMGrp col-3 field">
        <span class="p-float-label">
          <MultiSelect id="selCC" :inputStyle="{ 'text-align': 'center', 'font-size': '0.9vw ' }" v-model="selecCC"
            @change="atualizaMenu('CC')" :options="Object.values(listaFCCs)" optionValue="idsector" optionLabel="cc"
            :filter="true" />
          <label for="selCC"> Centro de Custo: </label>
        </span>
      </div>


      <!-- Seleção do CT -->
      <div class="selectCT col-5 field">
        <span class="p-float-label">
          <MultiSelect id="selCT" ref="selectCT" :inputStyle="{ 'text-align': 'center', 'font-size': '0.9vw ' }"
            v-model="selecCT" @change="atualizaMenu('CT')" :options="Object.values(listaFCTsM)" optionValue="idresource"
            optionLabel="ct" :filter="true" />
          <label for="selCT"> Centro de Trabalho: </label>
        </span>
      </div>
    </div>
    

    <!-- Data Table com checkbox -->
    <div>
      <ScrollPanel style="width: 100%; height: 70vh" class="custom">
        <!-- Se meta por Centro de Trabalho -->
        <DataTable :value="listaFCTs" editMode="cell" :scrollable="true" scrollHeight="flex"
          @cell-edit-complete="onCellEditComplete" class="editable-cells-table" responsiveLayout="scroll"
          sortField="dynamicSortField" :sortOrder="dynamicSortOrder">
          <Column field="depto" header="Departamento" style="min-width:15%" :sortable="true"></Column>
          <Column field="idresource" header="idresource" style="min-width:15%" :sortable="true"></Column>
          <Column field="cc" header="Centro de Custo" style="min-width:15%" :sortable="true"></Column>
          <Column field="ct" header="Centro de Trabalho" style="min-width:15%" :sortable="true"></Column>
          <Column field="check" header="Listar?" style="min-width:15%" :sortable="false">
            <template #body="{ data, field }">
              <Checkbox v-model="data[field]" value="check" />
            </template>
          </Column>
        </DataTable>
      </ScrollPanel>
    </div>
  </div>

</template>
<script>


export default {

  name: "SelecaoCTs",
  data: function () {
    return {
      teste: false,
      listaFCTs: {}, // Lista de Centros de Trabalho Filtrados para DataTable
      listaFCTsM: [], // Lista de Centros de Trabalho Filtrados para o Menu
      listaCCs: [], // Lista de Centros de Custo
      listaFCCs: [], // Lista de Centros de Custo Filtrados
      listaDeptos: [], // Lista de Departamentos
      listaFDeptos: {}, // Lista de Departamentos Filtrados
      selecCT: [], // Centros de Trabalho Selecionados
      selecCC: [], // Centros de Custos Selecionados
      selecDepto: [],  // Departamentos Selecionados
      valorGravar: '',
      respConfig: '',
      ctsSelecEnv: [] // Arquivo de CTs Selecionados para enviar ao server
    }
  },

  mounted: function () {
    this.toinitVar();

    this.atualizaConfig();

  },

  watch: {

    listaCTsReceb() {

      this.initVar();
      this.atualizaConfig();

    },
    ctsSelecRec() {
      this.atualizaConfig();
    }

  },


  props: {
    listaCTsRecebC: Boolean, // Sinaliza se os dados dos Centros de Trabalhos foram recebidos para mostrar o formulário
    listaCTs: Array, // Lista completa de Centros de trabalho consultadas no BD do MES
    ctsSelecRec: Object // Variável com os valores dos CTs selecionados (Storage)
  },


  methods: {

    atualizaConfig() {

      try {

        if (this.ctsSelecRec != undefined) {


          Object.keys(this.ctsSelecRec).forEach(element => {

            this.listaFDeptos[element] = Object.assign(this.listaFDeptos[element], this.ctsSelecRec[element])

          })

        }

      } catch (err) {
        let tempoTentativa = 2000
        console.log("falha ao tentar atualizar seleção de CTs. Erro: ", err, " - Iniciando nova tentativa em ", tempoTentativa, " segundos")
        setTimeout(this.atualizaConfig, tempoTentativa)
      }

    },

    onCellEditComplete(event) {
      let { data, newValue, field } = event;

      console.log(`
      ${data}
      ${newValue}
      ${field}
      `)


      //this["ctsSelecEnv"][data.idresource] = this["ctsSelecEnv"][data.idresource] || {}
      this["ctsSelecEnv"][data.idresource] = !this["ctsSelecEnv"][data.idresource]
      this.listaFCTs[data.idresource][field] = this["ctsSelecEnv"][data.idresource]
      //this.$socket.emit("gravarConfig", [this.ctsSelecEnv, "selecaoCTs"])


    },

    toinitVar() { // TimeOut para inicializar variáveis

      if (this.listaCTsRecebC === true) {
        this.initVar();
      } else {
        // Caso não recebido a lista ainda, faz nova tentativa em 10 segundos
        setTimeout(this.toinitVar, 2000)
      }

    },

    gravar() {
      this.$socket.emit("gravarConfig", this.valorGravar)
    },
    ler() {
      this.$socket.emit("leituraConfig", "selecaoCTs")
    },
    initVar() {

      // Atualiza lista de itens filtrados dos Centros de Trabalho
      this.listaFCTs = this.listaCTs

      this.listaFCTsM = this.listaFCTs

      // Filtra Departamentos disponíveis e elimina duplicados
      this.listaDeptos = Object.values(this.listaCTs).reduce((acc, index) => { acc[index.idarea] = index; return acc }, {})

      // Filtra Centros de Custo (Setores) e elimina duplicados
      this.listaCCs = Object.values(this.listaCTs).reduce((acc, index) => { acc[index.idsector] = index; return acc }, {})

      this.listaFDeptos = this.listaDeptos
      this.listaFCCs = this.listaCCs

    },

    atualizaFCTs() {

      try {

        this.listaFCTs = Object.values(this.listaCTs).reduce((acc, index) => {


          if ((this.selecDepto.indexOf(index.idarea) != -1 || this.selecDepto.length === 0) &&
            (this.selecCC.indexOf(index.idsector) != -1 || this.selecCC.length === 0) &&
            (this.selecCT.indexOf(index.idresource) != -1 || this.selecCT.length === 0)) {
            acc[index.idresource] = index
          }

          return acc

        }, {})

      } catch (err) {
        console.log("Falha ao filtrar Centros de Trabalho: ", err)
      }





    },
    atualizaMenu(seletor) {


      if (seletor === "Depto") {

        if (this.metaPor === "CT") {

          this.$refs.selectCT.filterValue = null;

        }


        this.selecCT = []

        this.selecCC = []

        if (this.selecDepto.length === 0) {

          this.listaFCCs = Object.values(this.listaCCs)

          this.selecCC = []


          this.atualizaFCTs()

          this.listaFCTsM = this.listaFCTs


        } else {

          this.listaFCCs = Object.values(this.listaCCs).filter((item) => { return (this.selecDepto.indexOf(item.idarea) != -1) })

          this.selecCC = this.listaFCCs.reduce((acc, index) => { acc.push(index.idsector); return acc }, [])

          this.atualizaFCTs()

          this.listaFCTsM = this.listaFCTs

          this.selecCT = Object.values(this.listaFCTs).reduce((acc, index) => { acc.push(index.idresource); return acc }, [])

        }

      } else if (seletor === "CC") {

        this.$refs.selectCT.filterValue = null;

        this.selecDepto = [] // Zera marcação do seletor de departamentos

        this.selecCT = []

        if (this.selecCC.length === 0) {

          this.atualizaFCTs()

          this.listaFCTsM = this.listaFCTs

          this.selecCT = []

        } else {

          this.atualizaFCTs()

          this.listaFCTsM = this.listaFCTs

          this.selecCT = Object.values(this.listaFCTs).reduce((acc, index) => { acc.push(index.idresource); return acc }, [])

        }

      } else if (seletor === "CT") {


        if (this.selecCT.length === 0) {

          this.atualizaFCTs()

        } else {

          this.atualizaFCTs()

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

.principal {
  overflow-x: hidden;
}
</style>