<template>
  <div class="flexgrid-demo p-p-2">
    <div class="grid">
      <!-- TAG -->
      <div
        class="col-4 disp"
        :style="{
          'font-size': tamanhoC,
          'background-color': corFundoR,
          color: txtCor,
        }"
      >
        {{ teste }}{{ tag }}
      </div>

      <!-- VALOR -->
      <div
        :class="mesclar ? 'col-8' : 'col-4'"
        class="disp"
        :style="{
          'font-size': tamanhoC,
          'background-color': corFundo,
          color: corTexto,
        }"
      >
        <div
          v-if="dispVis"
          :style="{ color: statusFonte, 'background-color': corFundoP }"
          :class="{ negrito: negrito }"
        >
          {{ valorP }}{{ sufixo }}
        </div>
      </div>
      <!-- PERDIDO -->
      <div
        class="col-4 disp"
        v-if="!mesclar"
        :style="{
          'font-size': tamanhoC,
          'background-color': corFundo,
          color: corTexto,
        }"
      >
        <div
          v-if="dispVis"
          :style="{ color: statusFonte, 'background-color': corFundoP }"
          :class="{ negrito: negrito }"
        >
          {{ valorS }}{{ sufixo }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  computed: {
    eNumeroP: () => {
      return this.valorP >= 0;
    },
    tamanhoC() {
      return this.tamanho + "vh";
    },
  },
  props: {
    fixo: Boolean, // Indica quando o display é fixo, ou seja, sempre visivel, idendependentemente do turno ou hora
    tag: String,
    valorP: Number, // Valor principal
    valorS: Number, // Valor secundário
    metaP: String, // Meta principal
    metaS: String, // Meta secundária
    tamanho: Number,
    turnoAtual: Number,
    turnoDisp: Number,
    sufixo: String,
    titulo: Boolean,
    corFundoR: String, // Cor de fundo recebida
    txtCor: String, // cor do texto
    mesclar: Boolean, // Se true, fica com apenas 1 coluna, caso contrário, mantém 2 colunas
    ecoat: Boolean, // Indica se é e-coat pois tem uma condição diferente para as cores baseado no valor e meta secundário
    statusFdo: Boolean, // Indica quando utiliza o status no fundo ao invés da fonte
  },
  watch: {
    valorP: function () {
      this.verificaCor();
      //this.horaAtual = new Date().getHours;
      this.atualizaHora();
    },

    valorS: function () {
      this.verificaCor();
    },
  },
  beforeMount() {
    this.atualizaHora();
    setInterval(this.atualizaHora, 10000);

    this.verificaCor();

    if (this.mesclada !== true) {
      if (isNaN(this.valorP) && this.valorP != undefined) {
        this.corFundo = this.corFundoR;
        this.corTexto = this.txtCor;
      } else {
        this.corFundo = "";
      }
    } else {
      this.corFundo = "";
    }

    if (isNaN(this.valorP) && this.valorP != undefined) {
      this.negrito = false;
    } else {
      this.negrito = true;
    }
  },
  mounted() {},
  methods: {
    atualizaHora() {
      try {
        let dataHora = new Date();
        this.horaAtual = dataHora.getHours();
      } catch (err) {
        alert(
          "Falha ao atualizar a hora atual para o display: ",
          this.tag,
          " - Erro: ",
          err
        );
      }
      //console.log("Hora atual: ", this.horaAtual, " - Turno: ", this.turnoAtual)
    },
    verificaCor: function () {        
      
        if (
          this.turnoAtual > this.turnoDisp ||
          (this.turnoAtual === this.turnoDisp &&
            (this.horaAtual >= parseInt(this.tag)) || (this.turnoAtual === 3 && parseInt(this.tag) > 20)) ||
          (this.fixo === true && this.turnoAtual === this.turnoDisp)
        ) {
          // Mostra valores
          this.dispVis = true;

          if (this.ecoat !== true) {
            // Se não é display do e-coat ...
            if (this.valorP === undefined || this.valorP === "") {
              this.corStatusP = this.corNOK;
            } else if (this.metaP != undefined) {
              if (eval(`${this.valorP} ${this.metaP}`)) {
                this.corStatusP = this.corOK;
              } else {
                this.corStatusP = this.corNOK;
              }
            } else {
              this.corStatusP = "";
            }
          } else {
            //Se for para o E-coat...

            if (this.metaS != undefined && this.turnoAtual >= this.turnoDisp) {
              if (this.valorS == undefined) {
                this.corStatusS = "";
                if (this.ecoat === true) {
                  this.corStatusP = this.corOK;
                }
              } else if (eval(`${this.valorS} ${this.metaS}`)) {
                this.corStatusS = this.corOK;
                if (this.ecoat === true) {
                  this.corStatusP = this.corOK;
                }
              } else {
                this.corStatusS = this.corNOK;
                if (this.ecoat === true) {
                  this.corStatusP = this.corNOK;
                }
              }
            } else if (
              this.tag === "Perf." &&
              this.turnoAtual >= this.turnoDisp
            ) {
              if (
                this.metaP != undefined &&
                this.valorP != undefined &&
                this.valorP != ""
              ) {
                if (eval(`${this.valorP} ${this.metaP}`)) {
                  this.corStatusP = this.corOK;
                } else {
                  this.corStatusP = this.corNOK;
                }
              } else {
                this.corStatusP = "";
              }
            } else if (
              this.tag === "Total" &&
              this.turnoAtual >= this.turnoDisp
            ) {
              if (eval(`${this.valorS} ${this.metaS}`)) {
                this.corStatusS = this.corOK;
                this.corStatusP = this.corOK;
              } else {
                this.corStatusS = this.corNOK;
                this.corStatusP = this.corNOK;
              }
            } else {
              this.corStatusS = "";
              if (this.ecoat === true) {
                this.corStatusP = "";
              }
            }
          }
        } else {
          // Não mostra valores

          this.dispVis = false;
        }


        if (this.statusFdo === true && ((this.tag === "Méd." && this.ecoat !== true) || (this.tag === "Perf."))) {
          this.corFundoP = this.corStatusP
          this.corTexto = 'white'
        } else {
          this.corFundoP = ''
          this.corTexto = this.corStatusP        
        }
      



      /*
      if (
        this.turnoAtual > this.turnoDisp ||
        (this.turnoAtual === this.turnoDisp &&
          this.horaAtual >= parseInt(this.tag)) ||
        this.fixo === true
      ) {
        this.dispVis = true;
      } else {
        this.dispVis = false;
      }

      if (this.ecoat !== true) {
        if (
          (this.turnoAtual >= this.turnoDisp &&
            this.horaAtual >= parseInt(this.tag)) ||
          this.turnoAtual > this.turnoDisp
        ) {
          if (this.valorP === undefined || this.valorP === "") {
            this.corStatusP = this.corNOK;
          } else if (this.metaP != undefined) {
            if (eval(`${this.valorP} ${this.metaP}`)) {
              this.corStatusP = this.corOK;
            } else {
              this.corStatusP = this.corNOK;
            }
          } else {
            this.corStatusP = "";
          }
        }
      }

      if (this.metaS != undefined && this.turnoAtual >= this.turnoDisp) {
        if (this.valorS == undefined) {
          this.corStatusS= "";
          if (this.ecoat === true) {
            this.corStatusP = this.corOK;
          }
        } else if (eval(`${this.valorS} ${this.metaS}`)) {
          this.corStatusS= this.corOK;
          if (this.ecoat === true) {
            this.corStatusP = this.corOK;
          }
        } else {
          this.corStatusS= this.corNOK;
          if (this.ecoat === true) {
            this.corStatusP = this.corNOK;
          }
        }
      } else if (this.tag === "Perf." && this.turnoAtual >= this.turnoDisp) {
        if (
          this.metaP != undefined &&
          this.valorP != undefined &&
          this.valorP != "" &&
          this.turnoAtual >= this.turnoDisp
        ) {
          if (eval(`${this.valorP} ${this.metaP}`)) {
            this.corStatusP = this.corOK;
          } else {
            this.corStatusP = this.corNOK;
          }
        } else {
          this.corStatusP = "";
        }
      } else if (
        this.tag === "Total" &&
        this.ecoat === true &&
        this.turnoAtual >= this.turnoDisp
      ) {
        if (eval(`${this.valorS} ${this.metaS}`)) {
          this.corStatusS= this.corOK;
          this.corStatusP = this.corOK;
        } else {
          this.corStatusS= this.corNOK;
          this.corStatusP = this.corNOK;
        }
      } else {
        this.corStatusS= "";
        if (this.ecoat === true) {
          this.corStatusP = "";
        }
      }
      */
    },
  },

  data() {
    return {
      dispVis: false, // Sinaliza se i display vai ficar visivel
      horaAtual: 0, // Hora atual
      corStatusP: "", // Cor da fonte no display principal
      corStatusS: "", // Cor da fonte no display secundário
      corFundo: "", // Cor de fundo
      corFundoP: "#42A5F5", // Cor de fundo padrão principal
      corFundoS: "#42A5F5", // cor de fundo padrão secundário
      corOK: "#42A500", // Cor OK
      corNOK: "#ff0000", // Cor NOK
      corTexto: "", // Cor do texto
      negrito: false, // Text em negrito
      teste: "", // Variável para testes de algoritimo
    };
  },
};
</script>

<style scoped>
.mesclada {
  background-color: white;
}
.grid {
  height: 100%;
  margin-top: 0;
}
.negrito {
  font-weight: 700;
}

.disp {
  margin: 0;
  padding: 1%;
}
</style>