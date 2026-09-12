import type { Descoberta } from "@/types";
import imgCaparao from "@/assets/caparao.jpg";
import imgComunidade from "@/assets/comunidade.jpg";
import imgLitoral from "@/assets/litoral.jpg";
import imgRioDoce from "@/assets/rio-doce.jpg";

export const descobertas: Descoberta[] = [
  {
    id: "d1",
    titulo: "O café que virou escola de inovação",
    resumo:
      "Nas encostas do Caparaó, uma família de produtores criou um método de secagem que virou currículo de escola técnica.",
    historia:
      "A cerca de 1.100 metros de altitude, os irmãos Salvador adaptaram estufas de secagem com sensores caseiros e um caderno de campo que hoje orienta 34 propriedades vizinhas. O que começou como uma tentativa de reduzir perdas na colheita se tornou material didático em duas escolas técnicas da região. Nenhuma instituição havia registrado a prática antes da escuta do Núcleo Caparaó.",
    nucleo: "Caparaó",
    autor: "Escuta do Núcleo Caparaó",
    data: "Setembro de 2026",
    imagem: imgCaparao,
    dimensao: "descobrir",
  },
  {
    id: "d2",
    titulo: "Carapina transforma resíduo em renda",
    resumo:
      "Um galpão coletivo na Serra reúne 22 pessoas que transformam plástico descartado em mobiliário urbano para o bairro.",
    historia:
      "O coletivo nasceu de uma conversa de calçada e hoje produz bancos, floreiras e brinquedos instalados em quatro praças de Carapina. A operação se sustenta com a venda de peças para condomínios da região e é hoje a inovação mais citada pelos atores escutados no Núcleo Serra.",
    nucleo: "Serra",
    autor: "Marina Coutinho",
    data: "Agosto de 2026",
    imagem: imgComunidade,
    dimensao: "transformar",
  },
  {
    id: "d3",
    titulo: "Pescadores que preveem o mar",
    resumo:
      "No Litoral Sul, um grupo de pescadores cruza registros próprios de 12 anos com dados públicos de maré.",
    historia:
      "Cada barco anota diariamente vento, temperatura da água e volume de pesca. Ao serem digitalizados durante as escutas, os cadernos revelaram uma série histórica capaz de antecipar mudanças de safra com precisão surpreendente — hoje discutida com pesquisadores parceiros do IJSN.",
    nucleo: "Litoral Sul",
    autor: "Escuta do Núcleo Litoral Sul",
    data: "Agosto de 2026",
    imagem: imgLitoral,
    dimensao: "descobrir",
  },
  {
    id: "d4",
    titulo: "Agrofloresta como infraestrutura",
    resumo:
      "No Rio Doce, jovens rurais monitoram áreas em restauração com celular e ganham renda por hectare recuperado.",
    historia:
      "A iniciativa integra restauração florestal, agroecologia e monitoramento comunitário. O modelo já inspirou uma missão colaborativa entre o Rio Doce e a Serra, aproximando startups ambientais da capital das cooperativas do interior.",
    nucleo: "Rio Doce",
    autor: "Rafael Domingues",
    data: "Julho de 2026",
    imagem: imgRioDoce,
    dimensao: "conectar",
  },
];
