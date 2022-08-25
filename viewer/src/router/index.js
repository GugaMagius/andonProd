import { createWebHistory, createRouter } from "vue-router";
import PinturaPo from "@/telas/Pinturapo.vue";
import PinturaLiq from "@/telas/Pinturaliq.vue";
import FormacaoKit from "@/telas/Formacaokit.vue";
import Enganchamento from "@/telas/Enganchamento.vue";
import Ecoat from "@/telas/Ecoat.vue";
import Mosaico from "@/telas/Mosaico.vue";
import Service from "@/telas/Service.vue";
import Graficos from "@/relatorios/graficos.vue";
import Metas from "@/panels/metas.vue";
import SelecaoCTs from "@/panels/selecaocts.vue";
import Logs from "@/panels/logs.vue";
import Testes from "@/panels/testes.vue";
//import Andon from "@/components/telaAndon";


const routes = [
    {
        path: "/",
        name: "- Geral",
        component: Mosaico,
        props: true
    },
    {
        path: "/ecoat",
        name: "- Ecoat",
        component: Ecoat,
        props: true
    },
    {
        path: "/enganchamento",
        name: "- Enganchamento",
        component: Enganchamento,
        props: true
    },
    {
        path: "/pinturapo",
        name: "- Pintura pó",
        component: PinturaPo,
        props: true
    },
    {
        path: "/pinturaliq",
        name: "- PinturaLiq",
        component: PinturaLiq,
        props: true
    },
    {
        path: "/formacaokit",
        name: "- Formação Kits",
        component: FormacaoKit,
        props: true
    },
    {
        path: "/graficos",
        name: "- Produtividade",
        component: Graficos,
        props: true
    },
    {
        path: "/service",
        name: "- Configurações",
        component: Service,
        props: true,
        children: [
            {
              path: 'metas',
              components: {
                panel: Metas,
              }
            },
            {
              path: 'selecaocts',
              components: {
                panel: SelecaoCTs,
              }
            },
            {
              path: 'logs',
              components: {
                panel: Logs,
              },
            },
            {
              path: 'testes',
              components: {
                panel: Testes,
              },
            },
          ],
    }

];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;