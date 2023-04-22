<template>
  <div class="painel">

    <!-- ************************************ área do gráfico **************************************************** -->
    <div id="graficoRel" class="grafico">
      <div v-if="dadosRecebidos">
        <!-- GRÁFICO -->
        <Chart v-if="!aguarde" id="grafGeral" type="bar" ref="graficoProd" :height="alturaGraf" :width="larguraGraf"
          :data="basicData" :options="options" @select="excluiBarra($event)" />
      </div>

    </div>

  </div>
</template>

<script>
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import ChartAnnotations from "chartjs-plugin-annotation";

Chart.register(ChartDataLabels, ChartAnnotations);

export default {

  mounted() {

    setTimeout(this.ajustaAltura(), 250)

    if (this.dadosGraf.dadosQtdkg) {

      this.options.scales.y.title.text = this.sufixo;
      this.compilaDadosGraf(this.dadosGraf)
    }

  },

  watch: {
    dadosGraf(data) {


      this.options.scales.y.title.text = this.sufixo;
      this.compilaDadosGraf(data)

    },


    sufixo(valor) {

      if (this.dadosGraf.dadosQtdkg) {
        this.options.scales.y.title.text = valor;
        this.compilaDadosGraf(this.dadosGraf)
        this.$refs.graficoProd.refresh();
      }
    }


  },

  props: {
    id: String, // Número do id para constrole do receptor dos dados
    metas: Number, // Valor da meta para status no gráfico
    dadosGraf: Object, // Dados para serem usados no gráfico
    dadosRecebidos: Boolean, // Dados recebidos do servidor
    aguarde: Boolean, // Sinalização para aguardar respota dos dados
    sufixo: String, // Sufixo para a escala do gráfico
    unidade: String, // Unidade selecionada para o gráfico
  },

  data() {
    return {

      dadosIni: [0],

      larguraGraf: '',
      alturaGraf: '',

      corOK: "#42A500",
      corNOK: "#ff0000",

      msg: "",

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
            order: 2,
          },
          {
            type: "line",
            label: "Prod Disp",
            borderColor: "rgb(144, 238, 144)",
            borderWidth: 3,
            radius: 2,
            pointStyle: 'line',
            data: [0],
            datalabels: {
              display: false,
            },
            order: 0,
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
            order: 1,
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
            formatter: function (value, context) {
              console.log("context: ", context)
              // return context.chart.data.labels[context.dataIndex];
              return value > 1000? Math.round(value).toLocaleString('pt-BR') : parseFloat(value).toLocaleString('pt-BR', {style: 'decimal', minimumFractionDigits: 1})
            },
            padding: 1,
          },

          // annotation: {
          //   annotations: {
          //     line1: {
          //       type: 'line',
          //       yMin: 15000,
          //       yMax: 15000,
          //       borderColor: 'rgb(23, 50, 217)',
          //       borderWidth: 3,
          //     }
          //   }
          // },

          title: {
            display: false,
          },
          legend: {
            display: true,
          },
        },
      },
    };
  },


  methods: {

    compilaDadosGraf(data) {

      this.$parent.dadosRecebidos = true;

      this.mostraTotal = true;

      this.basicData.datasets[0].data = Object.values(data[`dadosQtd${this.unidade}`]);
      this.basicData.datasets[1].data = Object.values(data[`prodDisp${this.unidade}`]);
      this.basicData.datasets[2].data = Object.values(data[`prodMeta${this.unidade}`]);

      this.basicData.labels = Object.keys(data[`dadosQtd${this.unidade}`]);


      this.verificaMeta();

      setTimeout(() => {

        // Ajusta altura do gráfico
        this.ajustaAltura();

        this.$emit('fAguarde', false)
        this.$emit('fDadosRecebidos', true)

      }, 250)
      //})

      this.verifFDS(this.basicData.labels);


      this.$emit('calculaTotal')


    },

    confTable(variavel) {
      return { 'text-align': 'center', 'font-size': '0.8vw ', color: variavel, height: '0.3vh', width: '8vw' }
    },



    verificaMeta() {

      return Promise.resolve(


        this.basicData.datasets[0].data.forEach((element, index) => {

          if (!parseFloat(this.basicData.datasets[2].data[index]) > 0) {
            this.basicData.datasets[0].backgroundColor[index] = "#42A5F5";
            this.basicData.datasets[0].borderColor[index] = "#42A5F5";
          } else {
            if (parseFloat(element) >= parseFloat(this.basicData.datasets[2].data[index])) {
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


    ajustaAltura() {

      // Ajusta altura do gráfico
      this.larguraGraf = document.getElementById("graficoRel").clientWidth * 0.97;
      this.alturaGraf = (document.getElementById("graficoRel").clientHeight - 70) * 1;
    },



    verifFDS(labels) {

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

      }
      )


    },

    excluiBarra(e) {
      console.log("Evento do clique no gráfico", e);



      function excluiItem(dados) {
        return dados.reduce(function (
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
      }

      this.basicData.datasets[0].data = excluiItem(this.basicData.datasets[0].data);
      this.basicData.datasets[1].data = excluiItem(this.basicData.datasets[1].data);
      this.basicData.datasets[2].data = excluiItem(this.basicData.datasets[2].data);
      this.basicData.labels = excluiItem(this.basicData.labels);

      this.verificaMeta();

      this.verifFDS(this.basicData.labels);

      this.$emit('calculaTotal', e.element.index)

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


.grafico {
  position: relative;
  height: 70vh;
  width: 100%;
  padding: 0%;
  margin-bottom: -5vh;
}
</style>