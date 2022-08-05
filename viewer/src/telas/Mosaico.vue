<template>
  <div class="flexgrid-demo p-p-2">
    <div class="grid" v-if="dadosRecebidos">
      <div class="col-6 grid box painel">
        <div class="col-12 titulo">E-coat</div>
        <div class="telaReduzida col-12">

          <router-link to="/ecoat">
            <Ecoat :dadosServer="dadosServer"/>
          </router-link>
        </div>
      </div>
      <div class="col-6 grid box painel">
        <div class="col-12 titulo">Enganchamento</div>
        <div class="telaReduzida col-12">
          <router-link to="/enganchamento">
            <Enganchamento :dadosServer="dadosServer"/>
          </router-link>
        </div>
      </div>
      <div class="col-6 grid box painel">
        <div class="col-12 titulo">Pintura Pó</div>
        <div class="telaReduzida col-12">
          <router-link to="/pinturapo">
            <PinturaPo :dadosServer="dadosServer" />
          </router-link>
        </div>
      </div>
      <div class="col-6 grid box painel">
        <div class="col-12 titulo">Pintura Líquida</div>
        <div class="telaReduzida col-12">
          <router-link to="/pinturaliq">
            <PinturaLiq :dadosServer="dadosServer" />
          </router-link>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import Ecoat from "@/telas/Ecoat.vue";
import PinturaPo from "@/telas/Pinturapo.vue";
import PinturaLiq from "@/telas/Pinturaliq.vue";
import Enganchamento from "@/telas/Enganchamento.vue";

export default {
  name: "mosaico",
  data() {
    return {
      Titulo: " - Geral",
      dadosRecebidos: false
    };
  },
  watch: {
    dadosServer() {
      if (this.dadosServer != undefined && this.dadosServer != {}) {
        this.dadosRecebidos = true
      }
    }

  },
  components: {
    Ecoat,
    Enganchamento,
    PinturaPo,
    PinturaLiq,
  },
  props: {
    dadosServer: Object, // Pacote de dados do servidor
  },
};
</script>

<style scoped>
.painel {
  height: 10vh;
  width: 45vw;
}

.campo {
  background-color: var(--surface-e);
}

.titulo {
  margin-bottom: -10vh;
  margin-top: -5vh;
}

.box {
  height: 40vh;
  display: flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  padding: 0.8rem;
  margin: 1rem;
  border-radius: 4px;
  box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
    0 1px 3px 0 rgba(0, 0, 0, 0.12);
}

.box-stretched {
  display: flex;
  transform: rotate(270deg);
  align-items: center;
  justify-content: center;
  vertical-align: middle;
}

.telaReduzida {
  zoom: 0.55;
  -moz-transform: scale(0.55);
  -webkit-transform: scale(0.55);
  transform: scale(0.55);
  margin-top: -12vh;
}

/* unvisited link */
a:link {
  color: var(--text-color);
  text-decoration: none;
}

/* visited link */
a:visited {
  color: var(--text-color);
  text-decoration: none;
}

/* mouse over link */
a:hover {
  color: var(--text-color);
  text-decoration: none;
}

/* selected link */
a:active {
  color: var(--text-color);
  text-decoration: none;
}
</style>
<!--
<style scoped>

.box {
  background-color: aqua;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  margin-top: auto;
  margin-bottom: auto;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  border-radius: 4px;
  box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
    0 1px 3px 0 rgba(0, 0, 0, 0.12);
}

.box-stretched {
  height: 100%;
}

.telaReduzida {
  zoom: 0.65;
  -moz-transform: scale(0.65);
  -webkit-transform: scale(0.65);
  transform: scale(0.65);
  width: 99%;
}

.grid {
  position: absolute;
  padding: 0px;
  padding-right: -200px;
  margin-left: 0vw;
  margin-right: -200px;
  width: 100%;
  margin-top: -8vh;
}

.p-col-6 {
  width: 49%;
  padding: 0px;
  margin: 0px;
  margin-top: 0vh;
  margin-bottom: -15vh;
  padding-left: 0vw;
  padding-right: -8vw;
  margin-left: -12vw;
  margin-right: -15vw;
}

/* unvisited link */
a:link {
  color: var(--text-color);
  text-decoration: none;
}

/* visited link */
a:visited {
  color: var(--text-color);
  text-decoration: none;
}

/* mouse over link */
a:hover {
  color: var(--text-color);
  text-decoration: none;
}

/* selected link */
a:active {
  color: var(--text-color);
  text-decoration: none;
}
</style>
-->

