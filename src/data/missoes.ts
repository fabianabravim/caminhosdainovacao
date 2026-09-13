import type { Missao, MissaoColaborativa } from "@/types";

export const missoes: Missao[] = [
  {
    id: "m-mapa-ativos",
    titulo: "Mapear 10 ativos de inovação",
    descricao:
      "Registre laboratórios, coletivos, escolas técnicas e espaços maker do Núcleo Serra.",
    dimensao: "explorar",
    pontos: 180,
    meta_total: 10,
    fonteProgresso: "ativos_inovacao",
    cta: "Cadastrar ativo",
    requerValidacao: true,
    recompensa: "Badge Cartógrafo do Território",
  },
  {
    id: "m-caminhada",
    titulo: "Caminhada territorial em Jacaraípe",
    descricao: "Percorra o bairro registrando pontos de encontro e economia local.",
    dimensao: "explorar",
    pontos: 120,
    meta_total: 2,
    fonteProgresso: "atividades_territoriais",
    cta: "Registrar atividade",
    requerValidacao: true,
    recompensa: "+120 pontos de impacto",
  },
  {
    id: "m-atlas",
    titulo: "Atualizar o atlas de vocações",
    descricao: "Classifique as vocações produtivas identificadas nas últimas escutas.",
    dimensao: "explorar",
    pontos: 90,
    meta_total: 4,
    fonteProgresso: "vocacoes_territoriais",
    cta: "Registrar atividade",
    requerValidacao: true,
    recompensa: "Selo Atlas Vivo",
  },
  {
    id: "m-roda",
    titulo: "Roda de conversa com 3 setores",
    descricao: "Reúna poder público, iniciativa privada e sociedade civil na mesma mesa.",
    dimensao: "conectar",
    pontos: 240,
    meta_total: 3,
    fonteProgresso: "presencas_setoriais",
    cta: "Registrar atividade",
    requerValidacao: true,
    recompensa: "Badge Articulador Regional",
  },
  {
    id: "m-agenda",
    titulo: "Agenda com 5 novos atores",
    descricao: "Convide atores ainda não cadastrados para a rede capixaba.",
    dimensao: "conectar",
    pontos: 150,
    meta_total: 5,
    fonteProgresso: "atores_rede",
    cta: "Cadastrar ativo",
    requerValidacao: true,
    recompensa: "+150 pontos de impacto",
  },
  {
    id: "m-escutas",
    titulo: "Realizar 8 escutas ativas",
    descricao: "Ouça empreendedores e lideranças comunitárias e registre suas histórias.",
    dimensao: "descobrir",
    pontos: 200,
    meta_total: 8,
    fonteProgresso: "escutas_ativas",
    cta: "Registrar atividade",
    requerValidacao: true,
    recompensa: "Badge Escuta Profunda",
  },
  {
    id: "m-invisivel",
    titulo: "Revelar uma inovação invisível",
    descricao: "Publique nas Descobertas uma solução local que ninguém documentou ainda.",
    dimensao: "descobrir",
    pontos: 260,
    meta_total: 1,
    fonteProgresso: "descobertas_publicadas",
    cta: "Enviar evidência",
    requerValidacao: true,
    recompensa: "Destaque no Desafio do Mês",
    prazo: "Desafio do Mês",
  },
  {
    id: "m-prototipo",
    titulo: "Prototipar solução com a comunidade",
    descricao: "Transforme uma dor escutada em protótipo testado no território.",
    dimensao: "transformar",
    pontos: 320,
    meta_total: 3,
    fonteProgresso: "prototipos_comunitarios",
    cta: "Registrar atividade",
    requerValidacao: true,
    recompensa: "Badge Catalisador de Soluções",
  },
  {
    id: "m-politica",
    titulo: "Levar 1 recomendação ao IJSN",
    descricao: "Sistematize evidências e proponha uma recomendação de política pública.",
    dimensao: "transformar",
    pontos: 300,
    meta_total: 1,
    fonteProgresso: "relatorios_aprovados",
    cta: "Enviar relatório",
    requerValidacao: true,
    recompensa: "Selo Inteligência Territorial",
  },
];

/**
 * Quantidades demonstrativas já aprovadas. Elas substituem o antigo número
 * editável de progresso e simulam registros válidos vindos de cada fonte.
 */
export const registrosAprovadosIniciais: Record<string, number> = {
  "m-mapa-ativos": 7,
  "m-caminhada": 1,
  "m-atlas": 0,
  "m-roda": 2,
  "m-agenda": 3,
  "m-escutas": 5,
  "m-invisivel": 0,
  "m-prototipo": 1,
  "m-politica": 0,
};

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
