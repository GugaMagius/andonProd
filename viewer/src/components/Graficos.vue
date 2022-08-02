<template>
  <div
    class="grafico"
    style="
       {
        position: initial;
      }
    "
  >
    <Chart v-if="GraficoPronto"
      :data="basicData"
      :height="novaAltura"
      :width="novaLargura"
      :options="opcoes"
      ref="grafico"
    />
  </div>
</template>

<script>
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(ChartDataLabels);

export default {
  props: {
    Turno1m: Number,
    Turno2m: Number,
    Turno3m: Number,
    Meta: Number,
    escalaY: Number,
  },
  methods: {
    ajustaTamanho(alturaMax, larguraMax) {
      this.novaLargura = larguraMax
      this.novaAltura = alturaMax
      this.GraficoPronto = true
      //this.$refs.grafico.refresh();
    },
  },
  components: {},
  watch: {
    Turno1m() {
      this.basicData.datasets[1].data[0] = this.Turno1m;
      if (this.Turno1m >= this.Meta) {
        this.basicData.datasets[1].backgroundColor[0] = this.corOK;
      } else {
        this.basicData.datasets[1].backgroundColor[0] = this.corNOK;
      }
    },
    Turno2m() {
      this.basicData.datasets[1].data[1] = this.Turno2m;
      if (this.Turno2m >= this.Meta) {
        this.basicData.datasets[1].backgroundColor[1] = this.corOK;
      } else {
        this.basicData.datasets[1].backgroundColor[1] = this.corNOK;
      }
    },
    Turno3m() {
      this.basicData.datasets[1].data[2] = this.Turno3m;
      if (this.Turno3m >= this.Meta) {
        this.basicData.datasets[1].backgroundColor[2] = this.corOK;
      } else {
        this.basicData.datasets[1].backgroundColor[2] = this.corNOK;
      }
    },

  },

  beforeMount() {
    this.basicData.datasets[1].data[0] = this.Turno1m;
    this.basicData.datasets[1].data[1] = this.Turno2m;
    this.basicData.datasets[1].data[2] = this.Turno3m;

    if (this.Turno1m >= this.Meta) {
      this.basicData.datasets[1].backgroundColor[0] = this.corOK;
    } else {
      this.basicData.datasets[1].backgroundColor[0] = this.corNOK;
    }
    if (this.Turno2m >= this.Meta) {
      this.basicData.datasets[1].backgroundColor[1] = this.corOK;
    } else {
      this.basicData.datasets[1].backgroundColor[1] = this.corNOK;
    }
    if (this.Turno3m >= this.Meta) {
      this.basicData.datasets[1].backgroundColor[2] = this.corOK;
    } else {
      this.basicData.datasets[1].backgroundColor[2] = this.corNOK;
    }
  },

  data() {
    return {
      GraficoPronto: false,
      novaLargura: '',
      novaAltura: '',
      corOK: "#42A500",
      corNOK: "#ff0000",
      basicData: {
        labels: ["turno 1", "turno 2", "turno 3"],
        datasets: [

          {
            type: "line",
            backgroundColor: ["#ff0000", "#ff0000", "#ff0000"],
            borderColor: "#000099",
            borderWidth: 2,
            data: [this.Meta, this.Meta, this.Meta],

            datalabels: {
              display: false,
            },
          },

          {
            type: "bar",
            label: this.Quando,
            backgroundColor: ["#42A5F5", "#42A500", "#ff0000"],
            data: [10, 10, 10],

            datalabels: {
              display: true,
            },
          },
          
        ],
      },

      opcoes: {
        responsive: false,

        scales: {
          x: {
            //display: false
            ticks: {
              display: false,
              font: {
                weight: "bold",
                size: 16,
              },
            },
          },
        },

        plugins: {
          datalabels: {
            anchor: "end",
            clamp: true,
            align: "start",
            display: true,
            color: "white",
            font: {
              weight: "bold",
              size: 16,
            },
            formatter: Math.round(),
            padding: 6,
          },
          title: {
            display: false,
            text: this.Quando,
          },
          legend: {
            display: false,
          },
        },
      },
    };
  },
};
</script>

<style scoped>
.grafico {
  height: 20%;
}
.box {
  border-radius: 4px;
  box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
    0 1px 3px 0 rgba(0, 0, 0, 0.12);
  margin-bottom: -3vh;
  padding: 0vh;
}

.label {
  margin-left: 0px;
  width: 4.5vw;
}
.display {
  width: 6vw;
  margin-left: 3vw;
  margin-right: 3vw;
}

.grid {
  padding: 30px;
  margin-top: -2vh;
  margin-bottom: -3vh;
  width: 50vw;
}
</style>