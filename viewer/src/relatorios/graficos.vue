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
                    Turnos:
                    <Checkbox id="turno1" name="turno" value="t1" v-model="selecTurno" />
                    <label for="turno1">Turno1</label>
                  </div>
                  <div class="checkbox inline">
                    <Checkbox id="turno2" name="turno" value="t2" v-model="selecTurno" />
                    <label for="turno2">Turno2</label>
                  </div>
                  <div class="checkbox inline">
                    <Checkbox id="turno3" name="turno" value="t3" v-model="selecTurno" />
                    <label for="turno3">Turno3</label>
                  </div>
                </div>

                <!-- ******* Seletores Unidade/período *********  -->
                <div class="selectTurno col-3">
                  <!-- Seleção de Unidade  -->
                  <div v-if="!selectEcoat">
                    <div class="checkbox inline">
                      Unidade:
                      <RadioButton id="m2" name="unid" value="m2" v-model="unidade" />
                      <label for="m2">m2</label>
                    </div>
                    <div class="checkbox inline">
                      <RadioButton id="kg" name="unid" value="kg" v-model="unidade" />
                      <label for="kg">kg</label>
                    </div>
                    <div class="checkbox inline">
                      <RadioButton id="ro" name="unid" value="RO" v-model="unidade" />
                      <label for="ro">R.O.</label>
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
                    <label for="media">Hora-máquina</label>
                  </div>

                </div>

                <!-- ********** Botão de validação ************ -->
                <div class="inline col-2">
                  <Button label="Atualizar" @click="consultaDados" />
                </div>
                <!-- <div v-if="metaGraf !== 0 && dadosRecebidos === true" class="inline vertical col-2"> Meta: {{
                metaGraf
                }} {{ sufixo }}</div> -->
                Tempo Disp: {{tempoCarga}}
                Tempo Trab: {{tempoTrabalhado}}

              </div>
            </div>
          </div>

        </div>
      </div>


      <!-- Tabela com valores e metas -->
      <div class="col-1 totalizador">

        <table v-if="dadosRecebidos && mostraTotal">
          <tr>
            <th colspan="4"> Totalizador </th>
          </tr>
          <tr>
            <th></th>
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
              <InputNumber id="total" :inputStyle="confTable(fontTable)" v-model="totCapDisponivel" readonly="true"
                :suffix="sufixoTot" />
            </td>
            <td>
              <InputNumber id="total" :inputStyle="confTable(fontTable)" v-model="ultCapDisponivel" readonly="true"
                :suffix="sufixoTot" />
            </td>
          </tr>

          <tr>
            <td class="labelLinha"> Meta R.O. </td>
            <td>
              <InputNumber id="total" :inputStyle="confTable(fontTable)" v-model="totMeta" readonly="true"
                :suffix="sufixoTot" />
            </td>

            <td>
              <InputNumber id="total" :inputStyle="confTable(fontTable)" v-model="ultMeta" readonly="true"
                :suffix="sufixoTot" />
            </td>
          </tr>

          <tr>
            <td class="labelLinha"> Produção Efetiva </td>

            <td>
              <InputNumber id="total" :inputStyle="confTable(totProdEfet>=totMeta? 'black' : 'red')"
                v-model="totProdEfet" readonly="true" :suffix="sufixoTot" />
            </td>

            <td>
              <InputNumber id="total" :inputStyle="confTable(ultProdEfet>=ultMeta? 'black' : 'red')"
                v-model="ultProdEfet" readonly="true" :suffix="sufixoTot" />
            </td>

          </tr>

          <tr>
            <td class="labelLinha"> Dif. p/ Meta R.O. </td>
            <td>
              <InputNumber id="total" :inputStyle="confTable(totDifProd >= 0 ? 'blue' : 'red')" v-model="totDifProd"
                readonly="true" :suffix="sufixoTot" />
            </td>
            <td>
              <InputNumber id="total" :inputStyle="confTable(ultDifProd >= 0 ? 'blue' : 'red')" v-model="ultDifProd"
                readonly="true" :suffix="sufixoTot" />
            </td>
          </tr>

          <tr>
            <td class="labelLinha"> Dif. p/ Cap. disponível </td>
            <td>
              <InputNumber id="total" :inputStyle="confTable(totDifProdDisp >= 0 ? 'blue' : 'red')"
                v-model="totDifProdDisp" readonly="true" :suffix="sufixoTot" />
            </td>
            <td>
              <InputNumber id="total" :inputStyle="confTable(ultDifProdDisp >= 0 ? 'blue' : 'red')"
                v-model="ultDifProdDisp" readonly="true" :suffix="sufixoTot" />
            </td>
          </tr>

        </table>
      </div>
    </div>


    <!-- ************************************ área do gráfico ****************************************************-->
    <div id="graficoRel" class="grafico">
      <div v-if="dadosRecebidos">
        <!-- GRÁFICO -->
        <Chart v-if="!aguarde" id="grafGeral" type="bar" ref="graficoProd" :height="alturaGraf" :width="larguraGraf"
          :data="basicData" :options="options" @select="excluiBarra($event)" />
      </div>

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
    </div>

  </div>
</template>

<script>
import moment from 'moment'

export default {

  mounted() {
    this.dataInicio = new Date();
    this.dataFim = new Date();
    this.selecTurno = ["t1", "t2", "t3"];

    setTimeout(this.ajustaAltura(), 250)


    setTimeout(this.inicializaMenu, 800);

    this.listaDatasets = this.basicData.datasets.map((el) => el.label);



  },
  watch: {

    listaCTsReceb() {

      this.inicializaMenu();

    },

    unidade() {

      if (this.respostaBD != {} && this.respostaBD != undefined && this.respostaBD != null) {

        // this.compilaDadosGraf(this.respostaBD)

      }

    },

    medProdEfet() {

      if (this.medProdEfet >= this.metaGraf && this.metaGraf > 0 && this.periodo === "media") {
        this.statusMedia = this.corOK
        this.basicData.datasets[1].borderWidth = 3;
      } else if (this.medProdEfet < this.metaGraf && this.metaGraf > 0 && this.periodo === "media") {
        this.statusMedia = this.corNOK
        this.basicData.datasets[1].borderWidth = 3;
      } /*else {
        this.statusMedia = ''
        this.basicData.datasets[1].borderWidth = 0;
        this.basicData.datasets[1].data = []

      } */
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
      tempoCarga: 0.0,
      tempoTrabalhado: 0.0,

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
      medCapDisponivel: 0.0,
      medMeta: 0.0,
      medProdEfet: 0.0,
      medDifProd: 0.0,
      medDifProdDisp: 0.0,
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
      unidade: "m2",
      sufixo: "m2",
      sufixoTot: "m2",
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


      //       const chart = new Chart(ctx, {
      //   type: 'line',
      //   data: {
      //     labels: ['Friday', 'Saturday', 'Sunday', 'Monday'],
      //     datasets: [
      //       {
      //         yAxisID: 'A', // <-- the Y axis to use for this data set
      //         label: 'Page Views',
      //         data: [13500, 5700, 6300, 8200],
      //         borderWidth: 1,
      //         backgroundColor: 'blue',
      //         borderColor: 'blue'
      //       },
      //       {
      //         yAxisID: 'B', // <-- the Y axis to use for this data set
      //         label: 'Revenue',
      //         data: [11, 3.6, 7.3, 8.1],
      //         backgroundColor: 'green',
      //         borderColor: 'green'
      //       }
      //     ]
      //   },
      //   options: {
      //     responsive: true,
      //     scales: {
      //       A: {
      //         type: 'linear',
      //         position: 'left',
      //         ticks: { beginAtZero: true, color: 'blue' },
      //         // Hide grid lines, otherwise you have separate grid lines for the 2 y axes
      //         grid: { display: false }
      //       },
      //       B: {
      //         type: 'linear',
      //         position: 'right',
      //         ticks: { beginAtZero: true, color: 'green' },
      //         grid: { display: false }
      //       },
      //       x: { ticks: { beginAtZero: true } }
      //     }
      //   }
      // });

      // stackedOptions: {
      //                 plugins: {
      //                     tooltip: {
      //                         mode: 'index',
      //                         intersect: false
      //                     },
      //                     legend: {
      //                         labels: {
      //                             color: '#495057'
      //                         }
      //                     }
      //                 },
      //                 scales: {
      //                     x: {
      //                         stacked: true,
      //                         ticks: {
      //                             color: '#495057'
      //                         },
      //                         grid: {
      //                             color: '#ebedef'
      //                         }
      //                     },
      //                     y: {
      //                         stacked: true,
      //                         ticks: {
      //                             color: '#495057'
      //                         },
      //                         grid: {
      //                             color: '#ebedef'
      //                         }
      //                     }

      basicData: {
        labels: ["1"],
        datasets: [
          {
            type: "bar",
            label: "Produção",
            backgroundColor: [],
            borderColor: [],
            borderWidth: [],
            data: [0],
            order: 4
          },
          {
            type: "bar",
            label: "Meta",
            borderColor: "rgb(47, 103, 255)",
            borderWidth: 2,
            radius: 0,
            data: [0],
            datalabels: {
              display: false,
            },
            order: 1
          },
          {
            type: "line",
            label: "Carga Total",
            borderColor: "rgb(255, 103, 47)",
            borderWidth: 3,
            radius: 2,
            pointStyle: 'line',
            data: [0],
            datalabels: {
              display: false,
            },
            order: 2
          },
          {
            type: "line",
            label: "Meta Período",
            borderColor: "rgb(47, 103, 255)",
            borderWidth: 3,
            radius: 2,
            pointStyle: 'line',
            data: [0],
            datalabels: {
              display: false,
            },
            order: 3,
          },
        ],
      },

      options: {
        responsive: false,
        hoverMode: "index",
        stacked: false,

        scales: {
          x: {
            stacked: true,
            ticks: {
              // Include a dollar sign in the ticks
              callback: function (value) {
                let label = this.getLabelForValue(value);
                let aa = label.substr(2, 2) + " ";
                let mm = label.substr(4, 2) + "/";
                let dd = label.substr(6, 2) > 0 ? label.substr(6, 2) + "/" : "";
                let hh =
                  label.substr(8, 2) !== "" ? label.substr(8, 2) + ":00" : "";
                return `${dd}${mm}${aa}${hh}`;
              },
            },
            title: {
              display: true,
              text: "data",
              font: {
                weight: "bold",
                size: 14,
              },
            },
          },
          y: {
            stacked: true,
            title: {
              display: true,
              text: "produção",
              font: {
                weight: "bold",
                size: 14,
              },
            },
          },
        },

        plugins: {
          datalabels: {
            anchor: "end",
            clamp: true,
            offset: -1,
            align: "end",
            display: "auto",
            color: "#606075",
            font: {
              weight: "bold",
              size: 16,
            },
            formatter: Math.round(),
            padding: 1,
          },

          annotation: {
            annotations: {
              line1: {
                type: 'line',
                yMin: 15000,
                yMax: 15000,
                borderColor: 'rgb(23, 50, 217)',
                borderWidth: 3,
              }
            }
          },

          title: {
            display: false,
          },
          legend: {
            display: false,
          },
        },
      },
    };
  },

  sockets: {
    resConsDB(data) {

      this.respostaBD = data

      this.compilaDadosGraf(this.respostaBD)

    },

  },


  methods: {

    compilaDadosGraf(data) {

      this.tempoTrabalhado = Object.values(data.horaMaquina).reduce(
        (acc, el) => {
          acc = acc + parseFloat(el);
          return acc
        }, 0.0)

      this.tempoCarga = Object.values(data.tempoCarga).reduce(
        (acc, el) => {
          acc = acc + parseFloat(el);
          return acc
        }, 0.0)

      if (data.dadosQtd === []) {

        this.aguarde = false;
        this.dadosRecebidos = true;
        alert("Nenhum dado retornado!")

      } else if (data.parametros.id === this.id) {

        this.dadosRecebidos = true;


        let unidGrafico;

        if (this.periodo === "media") {
          unidGrafico = "media";
          this.mostraTotal = false;
        } else {
          this.mostraTotal = true;
          unidGrafico = "dadosQtd";
          this.basicData.datasets[2].data = Object.values(data["cargaTotal"]);
          this.basicData.datasets[3].data = Object.values(data["meta"]);
        }


        this.basicData.labels = Object.keys(data[unidGrafico]);

        if (this.unidade === 'RO') {

          this.basicData.datasets[0].data = Object.values(data['RO']);

          this.basicData.datasets[1].data = []
          this.basicData.datasets[2].data = []
          this.basicData.datasets[3].data = []


        } else {

          this.basicData.datasets[0].data = Object.values(data[unidGrafico]);

        }


        setTimeout(this.infoGraf, 3000);

        this.verificaMeta();

        setTimeout(() => {

          // Ajusta altura do gráfico
          this.ajustaAltura();

          this.aguarde = false;

        }, 250)
        //})

        this.calculaTotal(this.basicData.datasets[0].data, this.basicData.labels);
      }

    },

    confTable(variavel) {
      return { 'text-align': 'center', 'font-size': '0.8vw ', color: variavel, height: '0.3vh', width: '8vw' }
    },



    verificaMeta() {
      let indexMeta = 0

      if (this.periodo !== "media" || !this.metaGraf > 0) {
        this.basicData.datasets[1].data = []
        indexMeta = 3

      } else {
        this.basicData.datasets[2].data = []
        this.basicData.datasets[3].data = []
        indexMeta = 1
      }


      return Promise.resolve(

        //Object.values(data["media"]).forEach((element, index) => {

        this.basicData.datasets[0].data.forEach((element, index) => {


          this.periodo === "media" ? this.basicData.datasets[1].data[index] = this.metaGraf : this.basicData.datasets[1].data[index] = []

          if (!parseFloat(this.basicData.datasets[indexMeta].data[index]) > 0) {
            this.basicData.datasets[0].backgroundColor[index] = "#42A5F5";
            this.basicData.datasets[0].borderColor[index] = "#42A5F5";
            //this.basicData.datasets[1].data = []
          } else {
            //this.basicData.datasets[2].data = []
            //this.basicData.datasets[3].data = []
            if (parseFloat(element) >= parseFloat(this.basicData.datasets[indexMeta].data[index])) {
              this.basicData.datasets[0].backgroundColor[index] = this.corOK;
              this.basicData.datasets[0].borderColor[index] = this.corOK;
            } else {
              this.basicData.datasets[0].backgroundColor[index] = this.corNOK;
              this.basicData.datasets[0].borderColor[index] = this.corNOK;
            }

          }
        })
      )

    },
    diaSemana(data) {
      if (data.substr(6, 2) > 0) {
        let aa = data.substr(2, 2);
        let mm = data.substr(4, 2);
        let dd = data.substr(6, 2);
        let hh = data.substr(8, 2) !== "" ? data.substr(8, 2) + ":00" : "00:00:00";
        //console.log("valor: ", this.getLabelForValue(value), " - index: ", this.getLabelForValue(index), " - ticks: ", this.getLabelForValue(ticks))
        return new Date(`${mm}-${dd}-${aa} ${hh}`).getDay();
      } else {
        return "";
      }
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

    ajustaAltura() {

      // Ajusta altura do gráfico
      this.larguraGraf = document.getElementById("graficoRel").clientWidth;
      this.alturaGraf = (document.getElementById("graficoRel").clientHeight - 70) * 1;
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


      this.metaGraf = 0 // Zera a meta atual

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


    calculaTotal(dados, labels) {
      let tamanhoDados = this.basicData.datasets[0].data.length

      //for (const [index, label] of labels.entries()) {

      labels.forEach((label, index) => {
        if (this.diaSemana(label) === 6) {
          //this.basicData.datasets[0].backgroundColor[index] = "#42A5F5";
          this.basicData.datasets[0].backgroundColor[index] = "yellow"
          this.basicData.datasets[0].borderWidth[index] = 5
        } else if (this.diaSemana(label) === 0) {
          //this.basicData.datasets[0].backgroundColor[index] = "#42A5F5";
          this.basicData.datasets[0].backgroundColor[index] = "coral"
          this.basicData.datasets[0].borderWidth[index] = 5
        } else {
          this.basicData.datasets[0].borderWidth[index] = 0
        }


        // VALORES TOTAIS

        this.totProdEfet = this.basicData.datasets[0].data.reduce(
          (acc, index) => {
            acc = acc || 0.0
            if (index > 0) {
              acc = parseFloat(acc) + parseFloat(index)
            }
            return acc
          },
          0.0
        )

        this.totCapDisponivel = this.basicData.datasets[2].data.reduce(
          (acc, index) => acc = acc + index,
          0.0
        )

        this.totMeta = this.basicData.datasets[3].data.reduce(
          (acc, index) => acc = acc + index,
          0.0
        )

        this.totDifProd = this.totProdEfet - this.totMeta

        this.totDifProdDisp = this.totProdEfet - this.totCapDisponivel


        // VALORES MÉDIOS

        this.medProdEfet = parseFloat((
          this.totProdEfet / parseInt(tamanhoDados)
        ).toFixed(1));


        // VALORES ULTIMA BARRA

        this.ultCapDisponivel = this.basicData.datasets[2].data[tamanhoDados - 1]

        this.ultProdEfet = this.basicData.datasets[0].data[tamanhoDados - 1]

        this.ultMeta = this.basicData.datasets[3].data[tamanhoDados - 1]

        this.ultDifProdDisp = this.ultProdEfet - this.ultCapDisponivel

        this.ultDifProd = this.ultProdEfet - this.ultMeta

      }

      )

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

      this.metaGraf = 0 // Zera a meta atual

      //this.dadosRecebidos = false

      if (this.selecPeriodo.code === undefined) {
        alert("Selecionar o Período do Gráfico");
      } else if (this.selecCT === undefined || this.selecCT === null || this.selecCT === [] || this.selecCT.length <= 0) {
        alert("Selecionar pelo menos 1 Centro de Trabalho para o Gráfico")
      } else {

        coletaMeta(this.selecCC, this.unidade, this.metas).then((res) => {

          this.metaGraf = res

          this.dadosRecebidos = false;
          this.aguarde = true;

          this.sufixo = this.fSufixo()[1]; //Verifica o sufixo correto para os dados solicitados da Média
          this.sufixoTot = this.fSufixo()[0]; //Verifica o sufixo correto para os dados solicitados do Total

          this.options.scales.y.title.text = this.sufixo;

          this.basicData.labels = []; // Apaga labels atuais
          this.basicData.datasets[0].data = []; // Apaga datasets atuais
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

      function coletaMeta(selecao, unidade, metas) {
        return new Promise(
          function (resolve) {
            //let metasSelec = {}
            //let metaGraf = 0;

            // Verifica e calcula metas
            if (selecao.length === 1) {
              resolve(metas["metaCC"][selecao[0]][`meta${unidade === 'kg' ? 'P' : 'S'}`])
              //metasSelec = {}
            } else if (selecao.length > 1) {
              resolve(selecao.reduce((acc, elemento, index) => {
                acc = acc || { soma: 0, media: 0 }
                acc["soma"] = acc["soma"] + metas["metaCC"][elemento][`meta${unidade === 'kg' ? 'P' : 'S'}`]
                acc["media"] = acc["media"] = acc["soma"] / (index + 1)
                return acc
              }, 0).media)
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
};
</script>

<style scoped>
.painel {
  padding: 1%;
  overflow-x: hidden;
  overflow-y: hidden;
}

.linha {
  height: 0.3vh;
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
  margin-left: -4vw;
}

.vertical {
  padding-top: 2vh
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

.streched {
  height: 100%;

}
</style>