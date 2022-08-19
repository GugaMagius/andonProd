<template>
  <div class="painel">
    
    <div class="p-grid menu">
      <div class="col-12 inline">
        <div class="p-fluid seletores grid">

          <!-- Data inicial -->
          <div class="field col-1 md:col-1  ">
            <span class="p-float-label">
              <Calendar id="dataInicial" :inputStyle="{ 'text-align': 'center', 'font-size': '0.9vw ' }"
                v-model="dataInicio" :showTime="false" :showSeconds="true" dateFormat="dd/mm/yy" :monthNavigator="true"
                :yearNavigator="true" :showButtonBar="true" autocomplete="off" />
              <label for="dataInicial"> Data Inicial: </label>
            </span>
          </div>
          <!-- Data final -->
          <div class="field col-1 md:col-1">
            <span class="p-float-label">
              <Calendar id="dataFinal" :inputStyle="{ 'text-align': 'center', 'font-size': '0.9vw ' }" v-model="dataFim"
                :showTime="false" :showSeconds="true" dateFormat="dd/mm/yy" :monthNavigator="true" :yearNavigator="true"
                :showButtonBar="true" autocomplete="off" />
              <label for="dataFinal"> Data Final: </label>
            </span>
          </div>


          <!-- Seleção do Departamento -->
          <div class="selectDepto col-2 field col-3 md:col-2">
            <span class="p-float-label">
              <MultiSelect id="selDepto" :inputStyle="{ 'text-align': 'center', 'font-size': '0.9vw ' }"
                v-model="selecDepto" @change="atualizaMenu('Depto')" :options="Object.values(listaFDeptos)"
                optionValue="idarea" optionLabel="depto" :filter="true" />
              <label for="selDepto"> Departamento: </label>
            </span>
          </div>


          <!-- Seleção do MGrp (Setor - Centro de Custo) -->
          <div class="selectMGrp col-2 field col-3 md:col-2">
            <span class="p-float-label">
              <MultiSelect id="selCC" :inputStyle="{ 'text-align': 'center', 'font-size': '0.9vw ' }" v-model="selecCC"
                @change="atualizaMenu('CC')" :options="Object.values(listaFCCs)" optionValue="idsector" optionLabel="cc"
                :filter="true" />
              <label for="selCC"> Centro de Custo: </label>
            </span>
          </div>

          <!-- Seleção do CT -->
          <div class="selectCT field col-2 md:col-2">
            <span class="p-float-label">
              <MultiSelect id="selCT" ref="selectCT" :inputStyle="{ 'text-align': 'center', 'font-size': '0.9vw ' }"
                v-model="selecCT" @change="atualizaMenu()" :options="Object.values(listaFCTs)" optionValue="idresource"
                optionLabel="ct" :filter="true" />
              <label for="selCT"> Centro de Trabalho: </label>
            </span>
          </div>

          <!-- Seleção do período -->
          <div class="field col-1 md:col-1">
            <span class="p-float-label">
              <Dropdown v-model="selecPeriodo" :inputStyle="{ 'text-align': 'center', 'font-size': '0.9vw ' }"
                :options="opcoesPeriodo" optionLabel="periodo" display="chip" />
              <label for="dataFinal"> Período: </label>
            </span>
          </div>

          <!-- Valor Total -->
          <div class="field col-1 md:col-1">
            <span v-if="dadosRecebidos && mostraTotal" class="p-float-label">
              <InputNumber id="total" :inputStyle="{ 'text-align': 'center', 'font-size': '0.9vw ' }" v-model="total"
                readonly="true" :suffix="sufixoTot" />
              <label for="total"> Total: </label>
            </span>
          </div>

          <!-- Valor Médio dos dados selecionados -->
          <div class="field col-1 md:col-1">
            <span v-if="dadosRecebidos" class="p-float-label">
              <InputNumber id="media" :inputStyle="{ 'text-align': 'center', 'font-size': '0.9vw ' }" v-model="media"
                readonly="true" :suffix="sufixo" />
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
              </div>

              <br>
              <!-- Seleção do período  -->
              Período:
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
            <div class="inline col-3">
              <Button label="Atualizar" @click="consultaDados" />
            </div>


          </div>
        </div>
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

  mounted: function () {
    this.dataInicio = new Date();
    this.dataFim = new Date();
    this.selecTurno = ["t1", "t2", "t3"];

    setTimeout(this.ajustaAltura(), 250)


    this.inicializaMenu();

  },
  watch: {

    listaCTsReceb() {

      this.inicializaMenu();

    }

  },

  props: {
    id: String,
    listaCTsReceb: Boolean, // Sinaliza se os dados dos Centros de Trabalhos foram recebidos para mostrar o formulário
    listaCTs: Array, // Lista completa de Centros de trabalho consultadas no BD do MES
  },

  computed: {
    selectEcoat() {
      return this.selecCT.includes('ecoat') ? true : false
    },
  },

  data() {
    return {
      testeData: '',
      listaFCTs: [],
      listaFCTsM: [], // Lista de Centros de Trabalho Filtrados para o Menu
      listaCCs: [],
      listaFCCs: [],
      listaDeptos: [],
      listaFDeptos: [],

      larguraGraf: '',
      alturaGraf: '',

      mostraTotal: false, // Indica quando é para mostrar o totalizador de produção 
      periodo: 'total',
      unidade: "m2",
      sufixo: "m2",
      sufixoTot: "m2",
      dadosRecebidos: false,
      dataInicio: "",
      dataFim: "",
      msg: "",
      aguarde: "",
      coresPenas: [
        "#42A5F5",
        "#7E57C2",
        "#66BB6A",
        "#FFCA28",
        "#AB47BC",
        "#26A69A",
        "#EC407A",
      ],
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
      basicData: {
        labels: ["1"],
        datasets: [
          {
            label: "Produção",
            backgroundColor: [],
            data: [0],
          },
        ],
      },

      options: {
        responsive: false,
        hoverMode: "index",
        stacked: false,

        scales: {
          x: {
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
            align: "start",
            display: "auto",
            color: "white",
            font: {
              weight: "bold",
              size: 16,
            },
            formatter: Math.round(),
            padding: 1,
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
      if (data.dadosQtd === []) {

        this.aguarde = false;
        this.dadosRecebidos = true;

      } else if (data.parametros.id === this.id) {

        this.dadosRecebidos = true;

        let unidGrafico;

        if (this.periodo === "media") {
          unidGrafico = "media";
          this.mostraTotal = false;
        } else {
          this.mostraTotal = true;
          unidGrafico = "dadosQtd";
        }

        this.basicData.labels = Object.keys(data[unidGrafico]);
        this.basicData.datasets[0].data = Object.values(data[unidGrafico]);

        setTimeout(() => {

          // Ajusta altura do gráfico
          this.ajustaAltura();

          this.aguarde = false;

        }, 250)

        this.calculaMedia(this.basicData.datasets[0].data, this.basicData.labels);

      }
    },

  },
  methods: {
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

      if (this.selecCT.includes("ecoat")) {
        this.selecCT = ["ecoat"]
      }


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

        this.selecDepto = [] // Zera marcação do seletor de departamentos

        this.selecCT = []

        if (this.selecCC.length === 0) {

          this.selecCT = []

          this.atualizaFCTs()


        } else {

          this.atualizaFCTs()

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

    calculaMedia(dados, labels) {
      for (const [index, label] of labels.entries()) {
        if (this.diaSemana(label) === 6) {
          this.basicData.datasets[0].backgroundColor[index] = "yellow";
        } else if (this.diaSemana(label) === 0) {
          this.basicData.datasets[0].backgroundColor[index] = "coral";
        } else {
          this.basicData.datasets[0].backgroundColor[index] = "#42A5F5";
        }
        this.total = this.basicData.datasets[0].data.reduce(
          (acc, index) => parseFloat(acc) + parseFloat(index)
        );
        this.media = (
          this.total / this.basicData.datasets[0].data.length
        ).toFixed(1);
      }
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

      this.calculaMedia(dados, labels);

    },

teste(){
console.log(moment())
},
    // Realiza a consulta dos dados no banco de dados e configura as penas do gráfico
    consultaDados() {
      if (this.selecPeriodo.code === undefined) {
        alert("Selecionar o Período do Gráfico");
      } else if (this.selecCT === undefined || this.selecCT === null || this.selecCT === [] || this.selecCT.length <= 0) {
        alert("Selecionar pelo menos 1 Centro de Trabalho para o Gráfico")
      } else {

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
          dtInicio: moment(this.dataInicio).format("YYYY-MM-DD 06:00:00"), // Data inicial para os dados solicitados
          dtFim: moment(this.dataFim).add(1, "days").format("YYYY-MM-DD 05:59:00"), // Data final para os dados solicitados
          turnos: this.selecTurno, // Turnos selecionados
          ht: this.periodo,
          id: this.id // ID do cliente que está solicitando os dados
        });
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
</style>