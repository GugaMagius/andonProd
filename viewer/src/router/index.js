import { createWebHistory, createRouter } from "vue-router";
//import PinturaPo from "@/telas/Pinturapo.vue";
import PinturaLiq from "@/telas/Pinturaliq.vue";
import FormacaoKit from "@/telas/Formacaokit.vue";
import Enganchamento from "@/telas/Enganchamento.vue";
import Ecoat from "@/telas/Ecoat.vue";
import Mosaico from "@/telas/Mosaico.vue";
import Service from "@/telas/Service.vue";
import Graficos from "@/relatorios/graficos.vue";
import Andon from "@/components/telaAndon";


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
        path: "/enganchamento/:Setor",
        name: "- Enganchamento",
        component: Enganchamento,
        props: true
    },
    {
        path: "/andon/:Setor",
        name: "- Tela Andon",
        component: Andon,
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
        name: "- Graficos",
        component: Graficos,
        props: true
    },
    {
        path: "/service",
        name: "- Service",
        component: Service,
        props: true
    }

];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;