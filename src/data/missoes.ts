import type { Missao, MissaoColaborativa } from "@/types";

export const missoes: Missao[] = [
  {
    id: "m-mapa-ativos",
    titulo: "Mapear 10 ativos de inovação",
    descricao:
      "Registre laboratórios, coletivos, escolas técnicas e espaços maker do Núcleo Serra.",
    dimensao: "explorar",
    pontos: 180,
    progresso: 7,
    meta: 10,
    recompensa: "Badge Cartógrafo do Território",
  },
  {
    id: "m-caminhada",
    titulo: "Caminhada territorial em Jacaraípe",
    descricao: "Percorra o bairro registrando pontos de encontro e economia local.",
    dimensao: "explorar",
    pontos: 120,
    progresso: 1,
    meta: 2,
    recompensa: "+120 pontos de impacto",
  },
  {
    id: "m-atlas",
    titulo: "Atualizar o atlas de vocações",
    descricao: "Classifique as vocações produtivas identificadas nas últimas escutas.",
    dimensao: "explorar",
    pontos: 90,
    progresso: 0,
    meta: 4,
    recompensa: "Selo Atlas Vivo",
  },
  {
    id: "m-roda",
    titulo: "Roda de conversa com 3 setores",
    descricao: "Reúna poder público, iniciativa privada e sociedade civil na mesma mesa.",
    dimensao: "conectar",
    pontos: 240,
    progresso: 2,
    meta: 3,
    recompensa: "Badge Articulador Regional",
  },
  {
    id: "m-agenda",
    titulo: "Agenda com 5 novos atores",
    descricao: "Convide atores ainda não cadastrados para a rede capixaba.",
    dimensao: "conectar",
    pontos: 150,
    progresso: 3,
    meta: 5,
    recompensa: "+150 pontos de impacto",
  },
  {
    id: "m-escutas",
    titulo: "Realizar 8 escutas ativas",
    descricao: "Ouça empreendedores e lideranças comunitárias e registre suas histórias.",
    dimensao: "descobrir",
    pontos: 200,
    progresso: 5,
    meta: 8,
    recompensa: "Badge Escuta Profunda",
  },
  {
    id: "m-invisivel",
    titulo: "Revelar uma inovação invisível",
    descricao: "Publique nas Descobertas uma solução local que ninguém documentou ainda.",
    dimensao: "descobrir",
    pontos: 260,
    progresso: 0,
    meta: 1,
    recompensa: "Destaque no Desafio do Mês",
    prazo: "Desafio do Mês",
  },
  {
    id: "m-prototipo",
    titulo: "Prototipar solução com a comunidade",
    descricao: "Transforme uma dor escutada em protótipo testado no território.",
    dimensao: "transformar",
    pontos: 320,
    progresso: 1,
    meta: 3,
    recompensa: "Badge Catalisador de Soluções",
  },
  {
    id: "m-politica",
    titulo: "Levar 1 recomendação ao IJSN",
    descricao: "Sistematize evidências e proponha uma recomendação de política pública.",
    dimensao: "transformar",
    pontos: 300,
    progresso: 0,
    meta: 1,
    recompensa: "Selo Inteligência Territorial",
  },
];

export const missoesColaborativas: MissaoColaborativa[] = [
  {
    id: "mc-pontes",
    titulo: "Pontes da Inovação: Serra + Caparaó",
    descricao:
      "Intercâmbio entre a indústria tecnológica da Serra e o turismo de base comunitária do Caparaó. Cada etapa acende uma conexão luminosa no Mapa Vivo.",
    nucleos: ["serra", "caparao"],
    progresso: 65,
    pontos: 400,
    dimensao: "conectar",
  },
  {
    id: "mc-bioeconomia",
    titulo: "Corredor da Bioeconomia: Serra + Rio Doce",
    descricao:
      "Conectar startups ambientais da Serra às iniciativas de restauração do Rio Doce.",
    nucleos: ["serra", "rio-doce"],
    progresso: 35,
    pontos: 360,
    dimensao: "transformar",
  },
  {
    id: "mc-serranas",
    titulo: "Trilhas Serranas: Central Serrana + Sudoeste Serrana",
    descricao: "Rota conjunta de agroinovação e cafés especiais nas montanhas capixabas.",
    nucleos: ["central-serrana", "sudoeste-serrana"],
    progresso: 20,
    pontos: 280,
    dimensao: "explorar",
  },
];

export const desafioDoMes = {
  titulo: "Inovação que ninguém conhece",
  descricao:
    "Encontre e documente uma solução criada no seu território que nunca foi registrada por nenhuma instituição. As três melhores histórias serão publicadas pelo IJSN.",
  pontos: 500,
  participantes: 96,
  /** Encerramento simulado do desafio. */
  fim: "2026-09-30T23:59:59",
};
