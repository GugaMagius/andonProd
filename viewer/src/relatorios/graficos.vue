<template>
  <div class="painel">
    <div class="p-grid menu">
      <div class="col-12 inline">
        <div class="p-fluid seletores grid">

          <!-- Data inicial -->
          <div class="field col-1 md:col-1  ">
            <span class="p-float-label">
              <Calendar id="dataInicial" :inputStyle="{ 'text-align': 'center', 'font-size': '0.8vw ' }"
                v-model="dataInicio" :showTime="false" :showSeconds="true" dateFormat="dd/mm/yy" :monthNavigator="true"
                :yearNavigator="true" :showButtonBar="true" autocomplete="off" />
              <label for="dataInicial"> Data Inicial: </label>
            </span>
          </div>

          <!-- Data final -->
          <div class="field col-1 md:col-1">
            <span class="p-float-label">
              <Calendar id="dataFinal" :inputStyle="{ 'text-align': 'center', 'font-size': '0.8vw ' }" v-model="dataFim"
                :showTime="false" :showSeconds="true" dateFormat="dd/mm/yy" :monthNavigator="true" :yearNavigator="true"
                :showButtonBar="true" autocomplete="off" />
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
              <MultiSelect id="selCC" :inputStyle="{ 'text-align': 'center', 'font-size': '0.8vw ' }" v-model="selecCC"
                @change="atualizaMenu('CC')" :options="Object.values(listaFCCs)" optionValue="idsector" optionLabel="cc"
                :filter="true" />
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

          <!-- Valor Total -->
          <div class="field col-1 md:col-1">
            <span v-if="dadosRecebidos && mostraTotal" class="p-float-label">
              <InputNumber id="total"
                :inputStyle="{ 'text-align': 'center', 'font-size': '0.8vw ', color: statusMedia }" v-model="total"
                readonly="true" :suffix="sufixoTot" />
              <label for="total"> Total: </label>
            </span>
          </div>

          <!-- Valor Médio dos dados selecionados -->
          <div class="field col-1 md:col-2">
            <span v-if="dadosRecebidos" class="p-float-label">
              <InputNumber id="media"
                :inputStyle="{ 'text-align': 'center', 'font-size': '0.8vw ', color: statusMedia }" v-model="media"
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
            <div class="inline col-3">
              <Button label="Atualizar" @click="consultaDados" />
            </div>
            <div v-if="periodo === 'media' && dadosRecebidos === true" class="inline vertical col-2"> Meta: {{ metaGraf }} {{ sufixo }}</div>



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


    setTimeout(this.inicializaMenu, 800);

  },
  watch: {

    listaCTsReceb() {

      this.inicializaMenu();

    },

    media() {

      if (this.media >= this.metaGraf && this.metaGraf > 0 && this.periodo === "media") {
        this.statusMedia = this.corOK
        this.basicData.datasets[0].borderWidth = 3;
      } else if (this.media < this.metaGraf && this.metaGraf > 0 && this.periodo === "media") {
        this.statusMedia = this.corNOK
        this.basicData.datasets[0].borderWidth = 3;
      } else {
        this.statusMedia = ''
        this.basicData.datasets[0].borderWidth = 0;
        this.basicData.datasets[0].data = []

      }
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
      testeData: '',
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
      basicData: {
        labels: ["1"],
        datasets: [
          {
            type: "line",
            label: "Meta",
            borderColor: "rgb(47, 103, 255)",
            borderWidth: 2,
            radius: 0,
            data: [0],
            datalabels: {
              display: false,
            },
          },
          {
            type: "bar",
            label: "Produção",
            backgroundColor: [],
            borderColor: [],
            borderWidth: [],
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
        }
        this.basicData.labels = Object.keys(data[unidGrafico]);
        this.basicData.datasets[1].data = Object.values(data[unidGrafico]);

        this.verificaMeta();

        setTimeout(() => {

          // Ajusta altura do gráfico
          this.ajustaAltura();

          this.aguarde = false;

        }, 250)
        //})

        this.calculaTotal(this.basicData.datasets[1].data, this.basicData.labels);
      }

    },

  },


  methods: {
    verificaMeta() {
      return Promise.resolve(

        //Object.values(data["media"]).forEach((element, index) => {
          this.basicData.datasets[1].data.forEach((element, index) => {
          if (this.periodo !== "media" || !this.metaGraf > 0) {
            this.basicData.datasets[1].backgroundColor[index] = "#42A5F5";
            this.basicData.datasets[1].borderColor[index] = "#42A5F5";
          } else {
            this.basicData.datasets[0].data[index] = this.metaGraf
            if (element >= this.metaGraf) {
              this.basicData.datasets[1].backgroundColor[index] = this.corOK;
              this.basicData.datasets[1].borderColor[index] = this.corOK;
            } else {
              this.basicData.datasets[1].backgroundColor[index] = this.corNOK;
              this.basicData.datasets[1].borderColor[index] = this.corNOK;
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
      //for (const [index, label] of labels.entries()) {

      labels.forEach((label, index) => {
                if (this.diaSemana(label) === 6) {
          //this.basicData.datasets[1].backgroundColor[index] = "#42A5F5";
          this.basicData.datasets[1].backgroundColor[index] = "yellow"
          this.basicData.datasets[1].borderWidth[index] = 5
        } else if (this.diaSemana(label) === 0) {
          //this.basicData.datasets[1].backgroundColor[index] = "#42A5F5";
          this.basicData.datasets[1].backgroundColor[index] = "coral"
          this.basicData.datasets[1].borderWidth[index] = 5
        } else {
          this.basicData.datasets[1].borderWidth[index] = 0

        }

        this.total = this.basicData.datasets[1].data.reduce(
          (acc, index) => {
            acc = acc || 0.0
            if (index > 0) {
              acc = parseFloat(acc) + parseFloat(index)
            }
            return acc
          },
          0.0
        )
        this.media = parseFloat((
          this.total / parseInt(this.basicData.datasets[1].data.length)
        ).toFixed(1));


      }
      )

    },

    excluiBarra(e) {
      console.log("Evento do clique no gráfico", e);

      var dados = this.basicData.datasets[1].data.reduce(function (
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

      this.basicData.datasets[1].data = dados;
      this.basicData.labels = labels;
      
        this.verificaMeta();

      this.calculaTotal(dados, labels);

    },

    // Realiza a consulta dos dados no banco de dados e configura as penas do gráfico
    consultaDados() {
      // Prepara configuração pra enviar para o servidor consultar o BD

      this.metaGraf = 0 // Zera a meta atual

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
        this.basicData.datasets[1].data = []; // Apaga datasets atuais
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
          id: this.id // ID do cliente que está solicitando os dados
        });
      }


      // Verifica e calcula metas
      if (this.selecCC.length === 1) {
        this.metaGraf = this.metas["metaCC"][this.selecCC[0]][`meta${this.unidade === 'kg' ? 'P' : 'S'}`]
        this.metasSelec = {}
      } else if (this.selecCC.length > 1) {
        this.metasSelec = this.selecCC.reduce((acc, elemento, index) => {
          acc = acc || { soma: 0, media: 0 }
          acc["soma"] = acc["soma"] + this.metas["metaCC"][elemento][`meta${this.unidade === 'kg' ? 'P' : 'S'}`]
          acc["media"] = acc["media"] = acc["soma"] / (index + 1)
          return acc
        }, 0)
        this.metaGraf = this.metasSelec.media
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

.vertical {
  padding-top: 2vh
}
</style>