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
    </div>

      <!-- Seletores de departamento/CC/CT -->
    <div class="p-fluid seletores grid" v-if="metaPor != 'depto'">
      <!-- Seleção do Departamento -->
      <div class="selectDepto col-3 field">
        <span class="p-float-label">
          <MultiSelect id="selDepto" :inputStyle="{ 'text-align': 'center', 'font-size': '0.9vw ' }"
            v-model="selecDepto" @change="atualizaMenu('Depto')" :options="Object.values(listaDeptos)"
            optionValue="IDArea" optionLabel="Depto" :filter="true" />
          <label for="selDepto"> Departamento: </label>
        </span>
      </div>


      <!-- Seleção do MGrp (Setor - Centro de Custo)  -->
      <div class="selectMGrp col-3 field">
        <span class="p-float-label">
          <MultiSelect id="selCC" :inputStyle="{ 'text-align': 'center', 'font-size': '0.9vw ' }" v-model="selecCC"
            @change="atualizaMenu('CC')" :options="Object.values(listaFCCs)" optionValue="IDSector" optionLabel="CC"
            :filter="true" />
          <label for="selCC"> Centro de Custo: </label>
        </span>
      </div>


      <!-- Seleção do CT -->
      <div class="selectCT col-5 field">
        <span class="p-float-label">
          <MultiSelect id="selCT" ref="selectCT" :inputStyle="{ 'text-align': 'center', 'font-size': '0.9vw ' }"
            v-model="selecCT" @change="atualizaMenu('CT')" :options="Object.values(listaFCTsM)" optionValue="IDResource"
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
          <Column field="IDResource" header="IDResource" style="min-width:15%" :sortable="true"></Column>
          <Column field="CC" header="Centro de Custo" style="min-width:15%" :sortable="true"></Column>
          <Column field="CT" header="Centro de Trabalho" style="min-width:15%" :sortable="true"></Column>
          <Column field="metaKg" header="Meta (kg)" style="min-width:15%" :sortable="true">
            <template #editor="{ data, field }">
              <InputNumber v-model="data[field]" autofocus />
            </template>
          </Column>
          <Column field="metaM2" header="Meta (m2)" style="min-width:15%" :sortable="true">
            <template #editor="{ data, field }">
              <InputNumber v-model="data[field]" autofocus />
            </template>
          </Column>
          <Column field="altName" header="Nome Alternativo" style="min-width:15%" :sortable="true">
            <template #editor="{ data, field }">
              <InputText v-model="data[field]" autofocus />
            </template>
          </Column>
        </DataTable>
        <!-- Se meta por Departamento -->
        <DataTable v-if="metaPor === 'depto'" :value="listaFDeptos" editMode="cell" :scrollable="true"
          scrollHeight="flex" @cell-edit-complete="onCellEditComplete" class="editable-cells-table"
          responsiveLayout="scroll" sortField="dynamicSortField" :sortOrder="dynamicSortOrder">
          <Column field="Depto" header="Departamento" style="min-width:15%" :sortable="true"></Column>
          <Column field="metaKg" header="Meta (kg)" style="min-width:15%" :sortable="true">
            <template #editor="{ data, field }">
              <InputNumber v-model="data[field]" autofocus />
            </template>
          </Column>
          <Column field="metaM2" header="Meta (m2)" style="min-width:15%" :sortable="true">
            <template #editor="{ data, field }">
              <InputNumber v-model="data[field]" autofocus />
            </template>
          </Column>
          <Column field="altName" header="Nome Alternativo" style="min-width:15%" :sortable="true">
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
      listaFCTs: {}, // Lista de Centros de Trabalho Filtrados para DataTable
      listaFCTsM: [], // Lista de Centros de Trabalho Filtrados para o Menu
      listaCCs: [], // Lista de Centros de Custo
      listaFCCs: [], // Lista de Centros de Custo Filtrados
      listaDeptos: [], // Lista de Departamentos
      listaFDeptos: {}, // Lista de Departamentos Filtrados
      listaCTmetas: {}, // Lista de Centros de trabalho com as respectivas metas
      selecCT: [], // Centros de Trabalho Selecionados
      selecCC: [], // Centros de Custos Selecionados
      selecDepto: [],  // Departamentos Selecionados
      valorGravar: '',
      respConfig: '',
      metaPor: "depto", // Seletor para configuração da meta, Por DEPARTAMENTO ou por CENTRO DE TRABALHO
      metasEnv: { // Arquivo de metas para enviar ao server
        metaCT: {}, // Valores temporários de meta por Centro de Trabalho
        metaDepto: {} // Valores temporários de meta por departamento
      }
    }
  },

  mounted: function () {
    this.toinitVar();
    this.metasEnv = this.metasRec
    this.atualizaConfig();

  },

  watch: {

    listaCTsReceb() {

      this.initVar();
      this.atualizaConfig();

    },
    metasRec() {
      this["metasEnv"]["metaCT"] = this.metasRec.metaCT || {};
      this["metasEnv"]["metaDepto"] = this.metasRec.metaDepto || {};
      this.atualizaConfig();
    }

  },


  props: {
    listaCTsRecebC: Boolean, // Sinaliza se os dados dos Centros de Trabalhos foram recebidos para mostrar o formulário
    listaCTs: Array, // Lista completa de Centros de trabalho consultadas no BD do MES
    metasRec: Object // Variável com os valores de metas configurados (Storage)
  },


  methods: {

    atualizaConfig() {
      try {

        if (this.metasRec.metaDepto != undefined) {

          Object.keys(this.metasRec.metaDepto).forEach(element => {

            this.listaFDeptos[element] = Object.assign(this.listaFDeptos[element], this.metasRec.metaDepto[element])

          })

        }
        if (this.metasRec.metaCT != undefined) {

          Object.keys(this.metasRec.metaCT).forEach(element => {

            this.listaFCTs[element] = Object.assign(this.listaFCTs[element], this.metasRec.metaCT[element])

          })

        }
      } catch (err) {
        let tempoTentativa = 2000
        console.log("falha ao tentar atualizar variáveis. Erro: ", err, " - Iniciando nova tentativa em ", tempoTentativa, " segundos")
        setTimeout(this.atualizaConfig, tempoTentativa)
      }

    },

    onCellEditComplete(event) {
      let { data, newValue, field } = event;
      console.log("#$#$#$# EVENTO:", event)

      if (this.metaPor === "depto") {
        this["metasEnv"]["metaDepto"][data.IDArea] = this["metasEnv"]["metaDepto"][data.IDArea] || {}
        this["metasEnv"]["metaDepto"][data.IDArea][field] = newValue || 0
        this.listaFDeptos[data.IDArea][field] = newValue
        this.$socket.emit("gravarConfig", this.metasEnv)

      } else {

        this["metasEnv"]["metaCT"][data.IDResource] = this["metasEnv"]["metaCT"][data.IDResource] || {}
        this["metasEnv"]["metaCT"][data.IDResource][field] = newValue || 0
        this.listaFCTs[data.IDResource][field] = newValue
        this.$socket.emit("gravarConfig", this.metasEnv)

      }


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
      this.$socket.emit("leituraConfig")
    },
    initVar() {

      // Atualiza lista de itens filtrados dos Centros de Trabalho
      this.listaFCTs = this.listaCTs

      this.listaFCTsM = this.listaFCTs

      // Filtra Departamentos disponíveis e elimina duplicados
      this.listaDeptos = Object.values(this.listaCTs).reduce((acc, index) => { acc[index.IDArea] = index; return acc}, {})

      // Filtra Centros de Custo (Setores) e elimina duplicados
      this.listaCCs = Object.values(this.listaCTs).reduce((acc, index) => { acc[index.IDSector] = index; return acc}, {})

      this.listaFDeptos = this.listaDeptos
      this.listaFCCs = this.listaCCs

    },

    atualizaFCTs() {

      try {

        this.listaFCTs = Object.values(this.listaCTs).reduce((acc, index) => {


          if ((this.selecDepto.indexOf(index.IDArea) != -1 || this.selecDepto.length === 0) &&
            (this.selecCC.indexOf(index.IDSector) != -1 || this.selecCC.length === 0) &&
            (this.selecCT.indexOf(index.IDResource) != -1 || this.selecCT.length === 0)) {
            acc[index.IDResource] = index
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

          this.listaFCCs = Object.values(this.listaCCs).filter((item) => { return (this.selecDepto.indexOf(item.IDArea) != -1) })

          this.selecCC = this.listaFCCs.reduce((acc, index) => { acc.push(index.IDSector); return acc }, [])

          this.atualizaFCTs()

          this.listaFCTsM = this.listaFCTs

          this.selecCT = Object.values(this.listaFCTs).reduce((acc, index) => { acc.push(index.IDResource); return acc }, [])

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

          this.selecCT = Object.values(this.listaFCTs).reduce((acc, index) => { acc.push(index.IDResource); return acc }, [])

        }

      } else if (seletor === "CT") {

        //this.selecDepto = [] // Zera marcação do seletor de Departamentos

        //this.selecCC = [] // Zera marcação do setor de Centros de Custo

        if (this.selecCT.length === 0) {

          this.atualizaFCTs()

          //this.listaFCTsM = this.listaFCTs

          //this.selecCT = []

        } else {

          this.atualizaFCTs()

          //this.listaFCTsM = this.listaFCTs

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

.meta {
  overflow-x: hidden;
}
</style>