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

export default {

  mounted() {

    setTimeout(this.ajustaAltura(), 250)

    if (this.dadosGraf.dadosQtdkg) {

      this.compilaDadosGraf(this.dadosGraf)

    }

  },


  watch: {

    dadosGraf(data) {

      this.compilaDadosGraf(data)

    }

  },

  props: {

    id: String, // Número do id para constrole do receptor dos dados
    metas: Number, // Valor da meta para status no gráfico
    dadosGraf: Object, // Dados para serem usados no gráfico
    dadosRecebidos: Boolean, // Dados recebidos do servidor
    aguarde: Boolean, // Sinalização para aguardar respota dos dados
    sufixo: String, // Sufixo para a escala do gráfico

  },

  data() {
    return {
      metaGrafico: 0,

      larguraGraf: '',
      alturaGraf: '',

      corOK: "#42A500",
      corNOK: "#ff0000",

      msg: "",

      basicData: {
        labels: ["1"],
        datasets: [
          {
            label: "Meta",
            type: "line",
            borderColor: "rgb(47, 103, 255)",
            borderWidth: 3,
            radius: 2,
            pointStyle: 'line',
            data: [0],
            datalabels: {
              display: false,
            },
            order: 0,
            stack: "Stack 1",
          },
          {
            label: "Tempo Trab.",
            type: "bar",
            backgroundColor: [],
            borderColor: [],
            borderWidth: [],
            data: [0],
            datalabels: {
              display: true,
            },
            order: 1,
            stack: "Stack 0",
          },
          {
            label: "Tempo Disp.",
            type: "bar",
            borderColor: 'rgb(144, 238, 144)',
            borderWidth: 4,
            data: [0],
            datalabels: {
              display: false,
            },
            order: 2,
            stack: "Stack 0",
          },
          {
            label: "Tempo Carga",
            type: "bar",
            borderColor: 'rgb(255, 69, 10)',
            borderWidth: 4,
            data: [0],
            datalabels: {
              display: false,
            },
            order: 3,
            stack: "Stack 0",
          },
          {
            label: "Tempo Total",
            type: "bar",
            borderColor: 'rgb(128, 128, 128)',
            borderWidth: 4,
            data: [0],
            datalabels: {
              display: false,
            },
            order: 4,
            stack: "Stack 0",
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
              stacked: false,
            title: {
              display: true,
              text: "horas",
              font: {
                weight: "bold",
                size: 14,
              },
            },
            ticks: {

              beginAtZero: true,
            }
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

      this.basicData.datasets[1].data = Object.values(data["tempoTrab"]);
      this.basicData.datasets[2].data = Object.values(data["tempoDisp"]);
      this.basicData.datasets[3].data = Object.values(data["tempoCarga"]);
      this.basicData.datasets[4].data = Object.values(data["tempoTotal"]);


      this.basicData.labels = Object.keys(data["dadosQtdkg"]);


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

      this.basicData.datasets[0].data = [];

      return Promise.resolve(


        this.basicData.datasets[1].data.forEach((element, index) => {


          this.basicData.datasets[0].data[index] = this.metas.metaD * parseFloat(this.basicData.datasets[2].data[index]) * 0.01

          if (!parseFloat(this.basicData.datasets[0].data[index]) > 0) {
            this.basicData.datasets[1].backgroundColor[index] = "#42A5F5";
            this.basicData.datasets[1].borderColor[index] = "#42A5F5";
          } else {
            if (parseFloat(element) >= parseFloat(this.basicData.datasets[0].data[index])) {
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
          this.basicData.datasets[1].backgroundColor[index] = "yellow"
          this.basicData.datasets[1].borderWidth[index] = 5
        } else if (this.diaSemana(label) === 0) {
          //this.basicData.datasets[0].backgroundColor[index] = "#42A5F5";
          this.basicData.datasets[1].backgroundColor[index] = "coral"
          this.basicData.datasets[1].borderWidth[index] = 5
        } else {
          this.basicData.datasets[1].borderWidth[index] = 0
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