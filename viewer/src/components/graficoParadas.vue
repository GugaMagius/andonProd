<template>
  <div class="grafico" style="
       {
        position: relative,
        height: '10vh'
      }
    ">
    <Chart v-if="GraficoPronto" :data="basicData" :options="opcoes" ref="grafico" />
  </div>
</template>

<script>
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import ChartAnnotations from "chartjs-plugin-annotation";

Chart.register(ChartDataLabels, ChartAnnotations);

export default {
  props: {
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

  },
  
  beforeMount() {

    this.GraficoPronto = true;

  },

  data() {
    return {
      GraficoPronto: false,
      novaLargura: '',
      novaAltura: '',
      basicData: {
        labels: [],
        datasets: [
          {
            type: "bar",
            data: [55, 40, 35, 10, 9],
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
            grid: {
              display: false
            },
            //display: false
            ticks: {
              display: false,
              font: {
                weight: "bold",
                size: 16,
              },
            },
          },
          y: {
            grid: {
              display: false
            },
          }
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
            text: "Top 5 motivos de paradas",
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
  height: 5vh;
}
</style>