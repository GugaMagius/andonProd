<template>
  <div class="painel">

    <!-- ************************************ área do gráfico ****************************************************-->
    <div id="graficoRel" class="grafico">
      Grafico Produção
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

export default {

  mounted() {

    setTimeout(this.ajustaAltura(), 250)

  },

  watch: {
    dadosGraf(data) {

      
      this.compilaDadosGraf(data)

    }

  },

  props: {
    id: String, // Número do id para constrole do receptor dos dados
    metaGraf: Number, // Valor da meta para status no gráfico
    dadosGraf: Object, // Dados para serem usados no gráfico
  },

  data() {
    return {
      metaGrafico: 0,

      larguraGraf: '',
      alturaGraf: '',

      corOK: "#42A500",
      corNOK: "#ff0000",

      dadosRecebidos: false,
      msg: "",
      aguarde: "",

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
            borderColor: "rgb(255, 103, 47)",
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

      if (data.dadosQtd === []) {

        this.aguarde = false;
        this.dadosRecebidos = true;
        alert("Nenhum dado retornado!")

      } else if (data.parametros.id === this.id) {

        this.dadosRecebidos = true;

          this.mostraTotal = true;
          
          this.basicData.datasets[0].data = Object.values(data["dadosQtd"]);
          this.basicData.datasets[1].data = Object.values(data["prodDisp"]);
          this.basicData.datasets[2].data = Object.values(data["prodMeta"]);


        this.basicData.labels = Object.keys(data["dadosQtd"]);


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
      this.larguraGraf = document.getElementById("graficoRel").clientWidth;
      this.alturaGraf = (document.getElementById("graficoRel").clientHeight - 70) * 1;
    },



    calculaTotal(dados, labels) {

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

      /*
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
*/

      this.basicData.datasets[0].data = excluiItem(this.basicData.datasets[0].data);
      this.basicData.datasets[1].data = excluiItem(this.basicData.datasets[1].data);
      this.basicData.datasets[2].data = excluiItem(this.basicData.datasets[2].data);
      this.basicData.labels = excluiItem(this.basicData.labels);

      this.verificaMeta();

      this.calculaTotal(this.basicData.datasets[0].data, this.basicData.labels);

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