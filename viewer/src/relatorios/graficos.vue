<template>
  <div class="painel">
    <div class="grid">
      <div class="col-10">
        <div class="p-grid menu">
          <div class="col-12 inline">
            <div class="p-fluid seletores grid">
              <!-- Data inicial -->
              <div class="field col-1 md:col-1  ">
                <span class="p-float-label">
                  <Calendar id="dataInicial" :inputStyle="{ 'text-align': 'center', 'font-size': '0.8vw ' }"
                    v-model="dataInicio" :showTime="false" :showSeconds="true" dateFormat="dd/mm/yy"
                    :monthNavigator="true" :yearNavigator="true" :showButtonBar="true" autocomplete="off" />
                  <label for="dataInicial"> Data Inicial: </label>
                </span>
              </div>

              <!-- Data final -->
              <div class="field col-1 md:col-1">
                <span class="p-float-label">
                  <Calendar id="dataFinal" :inputStyle="{ 'text-align': 'center', 'font-size': '0.8vw ' }"
                    v-model="dataFim" :showTime="false" :showSeconds="true" dateFormat="dd/mm/yy" :monthNavigator="true"
                    :yearNavigator="true" :showButtonBar="true" autocomplete="off" />
                  <label for="dataFinal"> Data Final: </label>
                </span>
              </div>

              <!-- Seleção do Departamento -->
              <div class="selectDepto col-2 field col-3 md:col-2">
                <span class="p-float-label">
                  <MultiSelect id="selDepto" :inputStyle="{ 'text-align': 'center', 'font-size': '0.8vw ' }"
                    v-model="selecDepto" @change="atualizaMenu('Depto')" :options="Object.values(listaFDeptos)"
                    optionValue="idarea" optionLabel="depto" :filter="true" />
                  <label for="selDepto"> Departamento: </label>
                </span>
              </div>


              <!-- Seleção do MGrp (Setor - Centro de Custo) -->
              <div class="selectMGrp col-2 field col-3 md:col-2">
                <span class="p-float-label">
                  <MultiSelect id="selCC" :inputStyle="{ 'text-align': 'center', 'font-size': '0.8vw ' }"
                    v-model="selecCC" @change="atualizaMenu('CC')" :options="Object.values(listaFCCs)"
                    optionValue="idsector" optionLabel="cc" :filter="true" />
                  <label for="selCC"> Centro de Custo: </label>
                </span>
              </div>

              <!-- Seleção do CT -->
              <div class="selectCT field col-2 md:col-2">
                <span class="p-float-label">
                  <MultiSelect id="selCT" ref="selectCT" :inputStyle="{ 'text-align': 'center', 'font-size': '0.8vw ' }"
                    v-model="selecCT" @change="atualizaMenu('CT')" :options="Object.values(listaFCTs)"
                    optionValue="idresource" optionLabel="ct" :filter="true" />
                  <label for="selCT"> Centro de Trabalho: </label>
                </span>
              </div>

              <!-- Seleção do período -->
              <div class="field col-1 md:col-1">
                <span class="p-float-label">
                  <Dropdown v-model="selecPeriodo" :inputStyle="{ 'text-align': 'center', 'font-size': '0.8vw ' }"
                    :options="opcoesPeriodo" optionLabel="periodo" display="chip" />
                  <label for="dataFinal"> Período: </label>
                </span>
              </div>

              <!-- Valor Médio dos dados selecionados -->
              <div v-if="dadosRecebidos" class="field col-2 md:col-2">
                <span class="p-float-label">
                  <InputNumber id="media"
                    :inputStyle="{ 'text-align': 'center', 'font-size': '0.8vw ', color: statusMedia }"
                    v-model="medProdEfet" readonly="true" :suffix="sufixo" />
                  <label for="media"> Média: </label>
                </span>
              </div>


            </div>
          </div>


          <!-- ************************************ linha de opções ****************************************************-->

          <div class="grid">
            <div class="col-12 inline">
              <div class="p-fluid opcoes grid">
                <div class="selectTurno col-3">
                  <!-- ******* Seleção de turnos *********** -->
                  <div class="checkbox inline">
                    <Checkbox id="turno1" name="turno" value="t1" v-model="selecTurno" />
                    <label for="turno1">Turno1</label>
                  </div>
                  <br>
                  <div class="checkbox inline">
                    <Checkbox id="turno2" name="turno" value="t2" v-model="selecTurno" />
                    <label for="turno2">Turno2</label>
                  </div>
                  <br>
                  <div class="checkbox inline">
                    <Checkbox id="turno3" name="turno" value="t3" v-model="selecTurno" />
                    <label for="turno3">Turno3</label>
                  </div>
                </div>

                <!-- ******* Seletores Unidade/período *********  -->
                <div class="selectTurno col-5">
                  <!-- Seleção de Unidade  -->
                  <div>
                    Unidade:
                    <div v-if="periodo!=='Disp' && !selectEcoat" class="checkbox inline">
                      <RadioButton id="m2" name="unid" value="m2" v-model="unidade" />
                      <label for="m2">m2</label>
                    </div>
                    <div v-if="periodo!=='Disp' && !selectEcoat" class="checkbox inline">
                      <RadioButton id="kg" name="unid" value="kg" v-model="unidade" />
                      <label for="kg">kg</label>
                    </div>
                    <div class="checkbox inline">
                      <RadioButton id="ro" name="unid" value="RO" v-model="unidade" />
                      <label for="ro">R.O.</label>
                    <div v-if="periodo==='Disp'" class="checkbox inline">
                      <RadioButton id="perc" name="perc" value="perc" v-model="unidadeDisp" />
                      <label for="perc">%</label>
                    </div>
                    <div v-if="periodo==='Disp'" class="checkbox inline">
                      <RadioButton id="horas" name="horas" value="horas" v-model="unidadeDisp" />
                      <label for="horas">horas</label>
                    </div>
                  </div>

                  <br>
                  <!-- Seleção do período  -->
                  Totalizador:
                  <div class="checkbox inline">
                    <RadioButton id="total" name="unid" value="total" v-model="periodo" />
                    <label for="total">{{ selecPeriodo.periodo || "Gráfico" }}</label>
                  </div>
                  <div class="checkbox inline">
                    <RadioButton id="media" name="unid" value="media" v-model="periodo" />
                    <label for="media">hora-maq.</label>
                  </div>
                  <div class="checkbox inline">
                    <RadioButton id="disp" name="unid" value="Disp" v-model="periodo" />
                    <label for="disp">Disp.</label>
                  </div>

                </div>

                <!-- ********** Botão de validação ************ -->
                <div class="inline col-1">
                  <Button label="Atualizar" @click="consultaDados" />
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>


      <!-- Tabela com valores e metas -->
      <div class="col-1 totalizador">

        <table v-if="dadosRecebidos && mostraTotal">
          <tr>
            <th colspan="5"> Totalizador </th>
          </tr>

          <tr>
            <th></th>
            <th>
              <label class="label" for="metaPeriodo" v-if="periodo!=='Disp'"> Média (hora): </label>
              <label class="label" for="metaPeriodo" v-if="periodo==='Disp'"> Média (%): </label>
            </th>
            <th>
              <label class="label" for="metaPeriodo"> Média ({{selecPeriodo.code}}): </label>
            </th>
            <th>
              <label class="label" for="metaPeriodo"> Total Grafico: </label>
            </th>
            <th>
              <label class="label" for="metaPeriodo"> Último período: </label>
            </th>
          </tr>

          <tr>
            <td class="labelLinha"> Capacidade Disponível </td>
            <td>
            </td>
            <td>
              <InputNumber :inputStyle="confTable(fontTable)" v-model="medCapDisponivel" readonly="true"
                :suffix="sufixoTot+'/'+selecPeriodo.code" />
            </td>
            <td>
              <InputNumber :inputStyle="confTable(fontTable)" v-model="totCapDisponivel" readonly="true"
                :suffix="sufixoTot" />
            </td>
            <td>
              <InputNumber :inputStyle="confTable(fontTable)" v-model="ultCapDisponivel" readonly="true"
                :suffix="sufixoTot" />
            </td>
          </tr>

          <tr>
            <td class="labelLinha"> Meta Prod. </td>
            <td>
              <InputNumber :inputStyle="confTable(fontTable)" v-model="medHmeta" readonly="true"
                :suffix="sufixoTot+'/h'" v-if="periodo!=='Disp'" />
              <InputNumber :inputStyle="confTable(fontTable)" v-model="metaGraf.metaD" readonly="true" :suffix="'%'"
                v-if="periodo==='Disp'" />
            </td>

            <td>
              <InputNumber :inputStyle="confTable(fontTable)" v-model="medMeta" readonly="true"
                :suffix="sufixoTot+'/'+selecPeriodo.code" />
            </td>
            <td>
              <InputNumber :inputStyle="confTable(fontTable)" v-model="totMeta" readonly="true" :suffix="sufixoTot" />
            </td>

            <td>
              <InputNumber :inputStyle="confTable(fontTable)" v-model="ultMeta" readonly="true" :suffix="sufixoTot" />
            </td>
          </tr>

          <tr>
            <td class="labelLinha"> Produção Efetiva </td>

            <td>
              <InputNumber :inputStyle="confTable(parseFloat(medHprodEfet)>=parseFloat(medHmeta)? 'green' : 'red')" v-model="medHprodEfet"
                readonly="true" :suffix="sufixoTot+'/h'" v-if="periodo!=='Disp'" />
              <InputNumber :inputStyle="confTable(parseFloat(medDisp)>=parseFloat(metaGraf.metaD)? 'green' : 'red')" v-model="medDisp"
                readonly="true" :suffix="'%'" v-if="periodo==='Disp'" />
            </td>
            <td>
              <InputNumber :inputStyle="confTable(parseFloat(medProdEfet)>=parseFloat(medMeta)? 'green' : 'red')" v-model="medProdEfet"
                readonly="true" :suffix="sufixoTot+'/'+selecPeriodo.code" />
            </td>
            <td>
              <InputNumber :inputStyle="confTable(parseFloat(totProdEfet)>=parseFloat(totMeta)? 'green' : 'red')" v-model="totProdEfet"
                readonly="true" :suffix="sufixoTot" />
            </td>

            <td>
              <InputNumber :inputStyle="confTable(parseFloat(ultProdEfet)>=parseFloat(ultMeta)? 'green' : 'red')" v-model="ultProdEfet"
                readonly="true" :suffix="sufixoTot" />
            </td>

          </tr>

          <tr>
            <td class="labelLinha"> Dif. p/ Meta Prod. </td>
            <td>
              <InputNumber :inputStyle="confTable(parseFloat(medHdifProd)/0 >= 0 ? 'blue' : 'red')" v-model="medHdifProd"
                readonly="true" :suffix="sufixoTot+'/h'" v-if="periodo!=='Disp'" />
              <InputNumber :inputStyle="confTable(parseFloat(medDifDisp) >= 0 ? 'blue' : 'red')" v-model="medDifDisp"
                readonly="true" :suffix="'% '" v-if="periodo==='Disp'" />
            </td>
            <td>
              <InputNumber :inputStyle="confTable(parseFloat(medDifProd) >= 0 ? 'blue' : 'red')" v-model="medDifProd"
                readonly="true" :suffix="sufixoTot+'/'+selecPeriodo.code" />
            </td>
            <td>
              <InputNumber :inputStyle="confTable(parseFloat(totDifProd) >= 0 ? 'blue' : 'red')" v-model="totDifProd"
                readonly="true" :suffix="sufixoTot" />
            </td>
            <td>
              <InputNumber :inputStyle="confTable(parseFloat(ultDifProd) >= 0 ? 'blue' : 'red')" v-model="ultDifProd"
                readonly="true" :suffix="sufixoTot" />
            </td>
          </tr>

          <tr>
            <td class="labelLinha"> Dif. p/ Cap. disponível </td>
            <td>
            </td>
            <td>
              <InputNumber :inputStyle="confTable(parseFloat(medDifProdDisp) >= 0 ? 'blue' : 'red')" v-model="medDifProdDisp"
                readonly="true" :suffix="sufixoTot+'/'+selecPeriodo.code" />
            </td>
            <td>
              <InputNumber :inputStyle="confTable(parseFloat(totDifProdDisp) >= 0 ? 'blue' : 'red')" v-model="totDifProdDisp"
                readonly="true" :suffix="sufixoTot" />
            </td>
            <td>
              <InputNumber :inputStyle="confTable(parseFloat(ultDifProdDisp) >= 0 ? 'blue' : 'red')" v-model="ultDifProdDisp"
                readonly="true" :suffix="sufixoTot" />
            </td>
          </tr>

        </table>
      </div>
    </div>


    <!-- ************************************ área do gráfico ****************************************************-->
    <div id="graficoRel" class="grafico">

      <!-- Aguardando... -->
      <div v-if="!dadosRecebidos">
        <p>{{ msg }}</p>

        <span>
          <ProgressSpinner v-if="aguarde" style="
          :width: larguraGraf;
          :height: alturaGraf;
          position: relative;
          top: 15vh;
        " strokeWidth="6" animationDuration=".8s" />
        </span>
      </div>

      <div>

        <!-- GRÁFICO -->
        <router-view name="grafico" :id="id" @calculaTotal="calculaTotal" @fDadosRecebidos="fDadosRecebidos"
          @fAguarde="fAguarde" :metas="metaGraf" :dadosGraf="respostaBD" :dadosRecebidos="dadosRecebidos"
          :sufixo="sufixo" :unidade="unidade"></router-view>

      </div>

    </div>

  </div>
</template>

<script>
import moment from 'moment'

export default {

  mounted() {
    this.$router.push("/graficos/periodo");

    this.dataInicio = new Date();
    this.dataFim = new Date();
    this.selecTurno = ["t1", "t2", "t3"];

    setTimeout(this.inicializaMenu, 800);



  },
  watch: {

    listaCTsReceb() {

      this.inicializaMenu();

    },

    periodo(valor) {

      valor === "media" ? this.$router.push("/graficos/media") : valor === "total" ? this.$router.push("/graficos/periodo") : this.unidadeDisp === 'perc' ? this.$router.push("/graficos/disp") : this.$router.push("/graficos/disphrs")

      if (valor === "media" && this.unidade === "Disp") {
        this.unidade = "m2"
      }

      this.sufixo = this.fSufixo()[1]; //Verifica o sufixo correto para os dados solicitados da Média
      this.sufixoTot = this.fSufixo()[0]; //Verifica o sufixo correto para os dados solicitados do Total

      this.inicializaArrays();

    },

    unidade() {

      this.sufixo = this.fSufixo()[1]; //Verifica o sufixo correto para os dados solicitados da Média
      this.sufixoTot = this.fSufixo()[0]; //Verifica o sufixo correto para os dados solicitados do Total

      this.inicializaArrays();

      this.respostaBD.dadosQtdkg ? this.calculaTotal() : null;

    },

    unidadeDisp(valor) {

      valor === "perc" ? this.$router.push("/graficos/disp") : this.$router.push("/graficos/disphrs")

      this.inicializaArrays();

    }



  },

  props: {
    id: String,
    listaCTsReceb: Boolean, // Sinaliza se os dados dos Centros de Trabalhos foram recebidos para mostrar o formulário
    listaCTs: Array, // Lista completa de Centros de trabalho consultadas no BD do MES
    metas: Object, // Metas por Depto e por CT
  },

  computed: {
    selectEcoat() {
      return this.selecCT.includes('ecoat') ? true : false
    },

  },


  data() {
    return {
      metaGraf: {},
      tempoDisponivel: 0.0,
      tempoTrabalhado: 0.0,

      dadosQtd: [], // Dados temporários para o totalizador
      prodDisp: [], // Dados temporários para o totalizador
      prodMeta: [], // Dados temporários para o totalizador
      mediaGraf: [], // Dados temporários para o totalizador
      tempoTrab: [], // Dados temporários para o totalizador
      tempoDisp: [], // Dados temporários para o totalizador

      respostaBD: {}, // Resposta do Banco de dados para consulta


      fontTable: "black",
      listaDatasets: [],
      listaFCTs: [],
      listaFCTsM: [], // Lista de Centros de Trabalho Filtrados para o Menu
      listaCCs: [],
      listaFCCs: [],
      listaDeptos: [],
      listaFDeptos: [],
      metaGrafico: 0,
      metasSelec: {},

      statusMedia: '',

      larguraGraf: '',
      alturaGraf: '',

      corOK: "#42A500",
      corNOK: "#ff0000",

      mostraTotal: false, // Indica quando é para mostrar o totalizador de produção 
      cargaTotal: 0.0,

      metaPeriodo: 0.0,
      medHcapDisponivel: 0.0,
      medHmeta: 0.0,
      medHprodEfet: 0.0,
      medHdifProd: 0.0,
      medHdifProdDisp: 0.0,
      medCapDisponivel: 0.0,
      medMeta: 0.0,
      medProdEfet: 0.0,
      medDifProd: 0.0,
      medDifProdDisp: 0.0,
      medDisp: 0.0,
      medDifDisp: 0.0,
      totCapDisponivel: 0.0,
      totMeta: 0.0,
      totProdEfet: 0.0,
      totDifProd: 0.0,
      totDifProdDisp: 0.0,
      ultCapDisponivel: 0.0,
      ultMeta: 0.0,
      ultProdEfet: 0.0,
      ultDifProd: 0.0,
      ultDifProdDisp: 0.0,

      periodo: 'total',
      unidade: "m2", // Unidade para os gráficos de m2 ou kg
      unidadeDisp: "perc", // Unidade para o gráfico de Disponibilidade
      sufixo: "",
      sufixoTot: "",
      dadosRecebidos: false,
      dataInicio: "",
      dataFim: "",
      msg: "",
      aguarde: "",
      selecPeriodo: {},
      selecTurno: [],
      selecCT: [],
      selecCC: [],
      selecDepto: [],
      opcoesPeriodo: [
        { periodo: "Hora", code: "hora" },
        { periodo: "Dia", code: "dia" },
        { periodo: "Mês", code: "mes" },
      ],
      opcoesTurno: [
        { turno: "Turno1", code: 1 },
        { turno: "Turno2", code: 2 },
        { turno: "Turno3", code: 3 },
      ],
      media: 0,
      total: 0,

    };
  },

  sockets: {
    resConsDB(data) {


      if (!data.dadosQtdkg) {

        this.aguarde = false
        this.dadosRecebidos = true
        alert("Nenhum dado retornado!")

      } else if (data.parametros.id === this.id) {

        this.respostaBD = data

        this.mostraTotal = true

      }

      this.inicializaArrays();

    },

  },


  methods: {

    inicializaArrays() {

      if (this.respostaBD.dadosQtdkg) {

        this.dadosQtd = Object.values(this.respostaBD[`dadosQtd${this.unidade}`])
        this.prodDisp = Object.values(this.respostaBD[`prodDisp${this.unidade}`])
        this.prodMeta = Object.values(this.respostaBD[`prodMeta${this.unidade}`])
        this.mediaGraf = Object.values(this.respostaBD[`media${this.unidade}`])
        this.tempoTrab = Object.values(this.respostaBD[`tempoTrab`])
        this.tempoDisp = Object.values(this.respostaBD[`tempoDisp`])

      }


    },

    fDadosRecebidos(valor) {
      this.dadosRecebidos = valor
    },

    fAguarde(valor) {
      this.aguarde = valor
    },

    confTable(variavel) {
      return { 'text-align': 'center', 'font-size': '0.8vw ', color: variavel, height: '0.3vh', width: '8vw' }
    },


    inicializaMenu() {

      // Atualiza lista de itens filtrados dos Centros de Trabalho
      this.listaFCTs = this.listaCTs

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


      this.metaGraf = {} // Zera a meta atual

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

        } else {

          this.listaFCCs = Object.values(this.listaCCs).filter((item) => { return (this.selecDepto.indexOf(item.idarea) != -1) })

          this.selecCC = this.listaFCCs.reduce((acc, index) => { acc.push(index.idsector); return acc }, [])

          this.atualizaFCTs()

          this.selecCT = Object.values(this.listaFCTs).reduce((acc, index) => { acc.push(index.idresource); return acc }, [])

        }

      } else if (seletor === "CC") {

        this.$refs.selectCT.filterValue = null;


        this.selecCT = []

        if (this.selecCC.length === 0) {

          this.selecCT = []

          this.atualizaFCTs()

        } else {

          this.atualizaFCTs()

          this.selecCT = Object.values(this.listaFCTs).reduce((acc, index) => { acc.push(index.idresource); return acc }, [])

        }

      } else {

        if (this.selecCT.length === 0) {

          this.selecCT = []

          this.atualizaFCTs();

        }

      }

      // Remove o E-coat caso tenha selecionado o E-coat e mais algum outro setor
      if (this.selecCT.indexOf("ecoat") != -1 && this.selecCT.length > 1) {

        this.selecCT.splice(this.selecCT.indexOf("ecoat"), 1);
        delete this.listaFCTs.ecoat;

      }

      // Remove o Enganchamento caso tenha selecionado o Enganchamento e mais algum outro setor
      if (this.selecCT.indexOf("EE") != -1 && this.selecCT.length > 1) {

        this.selecCT.splice(this.selecCT.indexOf("EE"), 1);
        delete this.listaFCTs.EE;

      }

    },


    calculaTotal(indexExcluido) { //dadosGraf



        function excluiItem(dados, indexEx) {
          return dados.reduce(function (
            acc,
            element,
            index
          ) {
            acc = acc || [];
            if (index != indexEx) {
              acc.push(element);
            }
            return acc;
          }, []);
        }

        if (indexExcluido >= 0) {

          console.log("INDEX A SER EXCLUÍDO: ", indexExcluido)

          this.dadosQtd = excluiItem(this.dadosQtd, indexExcluido)
          this.prodDisp = excluiItem(this.prodDisp, indexExcluido)
          this.prodMeta = excluiItem(this.prodMeta, indexExcluido)
          this.mediaGraf = excluiItem(this.mediaGraf, indexExcluido)
          this.tempoTrab = excluiItem(this.tempoTrab, indexExcluido)
          this.tempoDisp = excluiItem(this.tempoDisp, indexExcluido)

        }

        let tamanhoDados = this.dadosQtd.length

        // VALORES TOTAIS
        function reduceArray(dados) {
          return dados.reduce(
            (acc, index) => {
              acc = acc || 0.0
              if (index > 0) {
                acc = parseFloat(acc) + parseFloat(index)
              }
              return acc
            },
            0.0
          )
        }


        this.totProdEfet = reduceArray(this.dadosQtd).toFixed(0)

        this.totCapDisponivel = reduceArray(this.prodDisp).toFixed(0)


        this.totMeta = reduceArray(this.prodMeta).toFixed(0);

        this.totDifProd = this.totProdEfet - this.totMeta

        this.totDifProdDisp = this.totProdEfet - this.totCapDisponivel

        this.ultMeta = this.prodMeta[tamanhoDados - 1]


        // VALORES MÉDIOS HORA

        this.medHprodEfet = (reduceArray(this.mediaGraf) / tamanhoDados).toFixed(1)

        this.medHmeta = (this.metaGraf[this.unidade === 'kg' ? 'metaP' : 'metaS']).toFixed(1)

        this.medHdifProd = this.medHprodEfet - this.medHmeta


        // VALORES MÉDIOS PERÍODO

        this.medProdEfet = parseFloat((
          this.totProdEfet / parseInt(tamanhoDados)
        ).toFixed(0));

        this.medMeta = (this.metaGraf[this.unidade === 'kg' ? 'metaP' : 'metaS'] * reduceArray(this.tempoTrab) / tamanhoDados).toFixed(0)

        this.medCapDisponivel = (this.metaGraf[this.unidade === 'kg' ? 'metaP' : 'metaS'] * reduceArray(this.tempoDisp) / tamanhoDados).toFixed(0)

        this.medDifProd = this.medProdEfet - this.medMeta

        this.medDifProdDisp = this.medProdEfet - this.medCapDisponivel

        this.medDisp = (reduceArray(this.tempoTrab) / reduceArray(this.tempoDisp) * 100).toFixed(1)

        this.medDifDisp = this.medDisp - this.metaGraf.metaD


        // VALORES ULTIMA BARRA

        this.ultCapDisponivel = (this.prodDisp[tamanhoDados - 1]).toFixed(0)

        this.ultProdEfet = parseFloat(this.dadosQtd[tamanhoDados - 1]).toFixed(0)


        this.ultDifProdDisp = this.ultProdEfet - this.ultCapDisponivel

        this.ultDifProd = this.ultProdEfet - this.ultMeta


        // if (this.medProdEfet >= this.metaGraf[this.unidade === 'kg' ? 'metaP' : 'metaS'] && this.metaGraf[this.unidade === 'kg' ? 'metaP' : 'metaS'] > 0 && this.periodo === "media") {
        //   this.statusMedia = this.corOK
        // } else if (this.medProdEfet < this.metaGraf[this.unidade === 'kg' ? 'metaP' : 'metaS'] && this.metaGraf[this.unidade === 'kg' ? 'metaP' : 'metaS'] > 0 && this.periodo === "media") {
        //   this.statusMedia = this.corNOK
        // }
      
    },




    excluiBarra(e) {
      console.log("Evento do clique no gráfico", e);

      var dados = this.basicData.datasets[0].data.reduce(function (
        acc,
        element,
        index
      ) {
        acc = acc || [];
        if (index != e.element.index) {
          acc.push(element);
        }
        return acc;
      }, []);

      var labels = this.basicData.labels.reduce(function (acc, element, index) {
        acc = acc || [];
        if (index != e.element.index) {
          acc.push(element);
        }
        return acc;
      }, []);

      this.basicData.datasets[0].data = dados;
      this.basicData.labels = labels;

      this.verificaMeta();

      this.calculaTotal(dados, labels);

    },

    // Realiza a consulta dos dados no banco de dados e configura as penas do gráfico
    consultaDados() {
      // Prepara configuração pra enviar para o servidor consultar o BD

      this.metaGraf = {} // Zera a meta atual

      //this.dadosRecebidos = false

      if (this.selecPeriodo.code === undefined) {
        alert("Selecionar o Período do Gráfico");
      } else if (this.selecCT === undefined || this.selecCT === null || this.selecCT === [] || this.selecCT.length <= 0) {
        alert("Selecionar pelo menos 1 Centro de Trabalho para o Gráfico")
      } else {


        this.sufixo = this.fSufixo()[1]; //Verifica o sufixo correto para os dados solicitados da Média
        this.sufixoTot = this.fSufixo()[0]; //Verifica o sufixo correto para os dados solicitados do Total

        coletaMeta(this.selecCC, this.metas).then((res) => {

          this.metaGraf = res

          this.dadosRecebidos = false;
          this.aguarde = true;

          this.msg =
            "Solicitando atualização dos dados para os CTs selecionados... "
          this.$socket.emit("solicitaDados", {
            // Solicita dados para o gráfico
            CT: this.selecCT, // Configuração de qual CT está solicitando
            periodo: this.selecPeriodo.code, // Configuração de qual periodo está sendo solicitado (Dia / Hora / Mês)
            unidade: this.unidade, // Unidade selecionada (m2 / kg)
            dtInicio: moment.utc(this.dataInicio).format("YYYY-MM-DD"), // Data inicial para os dados solicitados
            dtFim: moment.utc(this.dataFim).format("YYYY-MM-DD"), // Data final para os dados solicitados
            turnos: this.selecTurno, // Turnos selecionados
            ht: this.periodo,
            id: this.id, // ID do cliente que está solicitando os dados
            meta: res // Meta para os dados selecionados
          });

        })

      }

      function coletaMeta(selecao, metas) {
        return new Promise(
          function (resolve) {
            // Verifica e calcula metas
            if (selecao.length === 1) {

              resolve(metas["metaCC"][selecao[0]])

            } else {
              resolve(selecao.reduce((acc, elemento, index) => {
                //let campos = { soma: 0, media: 0 }
                //acc["mediaP"] = acc["mediaP"] || campos
                //acc["mediaS"] = acc["mediaS"] || campos
                //acc["mediaD"] = acc["mediaD"] || campos

                acc["somaP"] = acc["somaP"] + metas["metaCC"][elemento][`metaP`]
                acc["metaP"] = acc["somaP"] / (index + 1)

                acc["somaS"] = acc["somaS"] + metas["metaCC"][elemento][`metaS`]
                acc["metaS"] = acc["somaS"] / (index + 1)

                acc["somaD"] = acc["somaD"] + metas["metaCC"][elemento][`metaD`]
                acc["metaD"] = acc["somaD"] / (index + 1)

                return acc

              }, { "metaP": 0, "metaS": 0, "metaD": 0, "somaP": 0, "somaS": 0, "somaD": 0 }))
              //resolve(this.metaGraf = this.metasSelec.media)

            }

          }
        )
      }

    },


    AdicionaVar(label, borderColor, data) {
      return {
        label: label,
        borderColor: borderColor,
        data: data,
        fill: false,
        pointRadius: 0.95,
        borderWidth: 0.7,
      };
    },

    fSufixo() {
      var unidTotaliz;
      var perTotaliz;

      if (this.selecCT.includes('ecoat')) {
        unidTotaliz = "bst";
      } else {
        this.unidade === "m2" ? unidTotaliz = "m2" : unidTotaliz = "kg";
      }

      if (this.periodo === "total") {
        perTotaliz = this.selecPeriodo.periodo;
      } else {
        perTotaliz = "hm";
      }

      return [" " + unidTotaliz, " " + unidTotaliz + "/" + perTotaliz]
    },
  },
}
</script>

<style scoped>
.painel {
  padding: 1%;
  overflow-x: hidden;
  overflow-y: hidden;
}



.selectCT {
  max-width: 20%;
}

.menu {
  height: auto;
}

.seletores {
  margin-bottom: -2vh;
  padding-bottom: 0px;
}

.opcoes {
  margin-top: -2vh;
  padding-top: 0px;
}

.grafico {
  position: relative;
  height: 70vh;
  width: 100%;
  padding: 0%;
  margin-bottom: -5vh;
}

.checkbox {
  margin: 1%;
}

.inline {
  display: inline;
}

.selectTurno {
  margin: 1%;
}

.totalizador {
  margin-left: -20vw;
}


.p-float-label {
  margin-top: 0px;
  padding-bottom: 2vh;
}

.label {
  font-size: small;
}

.labelLinha {
  font-size: x-small;
}
</style>