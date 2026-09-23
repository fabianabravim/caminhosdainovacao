/** Dados de referência fornecidos pela equipe: DRS/IJSN e PDUI/IJSN.
 * Nunca são combinados com as atividades de campo dos Conectores.
 */
export type OrigemDado = "referencia" | "caminhos";

export interface PerfilTerritorialReferencia {
  apresentacao?: string;
  municipios: string[];
  vocacoes: string[];
  potencialidades: string[];
  desafios: string[];
  inovacaoPontosFortes: string[];
  inovacaoPontosAInvestigar: string[];
  fonte: string;
  inovacaoEmConsolidacao?: boolean;
}

const DRS = "Fonte: Desenvolvimento Regional Sustentável — DRS/IJSN.";
const PDUI = "Fonte: PDUI — Diagnóstico Integrado da Região Metropolitana da Grande Vitória / IJSN.";
const CONSOLIDACAO = "Dados de referência em consolidação.";
const NOTA_DIVISAO = "Dados de referência em consolidação para adequação à divisão territorial adotada pelo Caminhos da Inovação.";

/** Os nomes e os agrupamentos seguem exclusivamente o material fornecido pela equipe. */
export const referenciaTerritorial: Record<string, PerfilTerritorialReferencia> = {
  "central-serrana": {
    municipios: ["Itaguaçu", "Itarana", "Santa Teresa", "Santa Maria de Jetibá", "Santa Leopoldina"],
    vocacoes: ["Agropecuária, com destaque para a cafeicultura", "Agroindústria", "Setor granjeiro (avicultura)", "Agroturismo", "Turismo histórico-cultural"],
    potencialidades: ["Patrimônio histórico-cultural ligado à imigração italiana, alemã e pomerana", "Cobertura de Mata Atlântica preservada e biodiversidade exuberante", "Rio Santa Maria da Vitória, com afluentes e cachoeiras aproveitáveis para o turismo", "Clima de montanha valorizado pelo turismo rural", "Identidade cultural marcante associada à vocação rural do território"],
    desafios: ["Fortalecimento do turismo rural e do ecoturismo, com melhoria da infraestrutura de transporte e mobilidade", "Desenvolvimento de cadeias de agricultura sustentável, incluindo cafés especiais e uvas, e da agroindústria", "Segurança hídrica e uso eficiente dos recursos hídricos", "Restauração e preservação da cobertura vegetal nativa e ampliação de áreas naturais protegidas", "Melhoria dos indicadores educacionais e ampliação da infraestrutura rural de telefonia e internet"],
    inovacaoPontosFortes: ["Ações voltadas ao desenvolvimento de soluções tecnológicas inovadoras para desafios diagnosticados pelo poder público", "Iniciativa de qualificação em gestão de projetos por meio do Sistema UniversidadES"],
    inovacaoPontosAInvestigar: ["Cobertura de internet e telefonia móvel nas comunidades rurais", "Capacidade técnica das prefeituras para elaboração e captação de projetos", "Desafios relacionados aos indicadores educacionais"],
    fonte: DRS,
  },
  "sudoeste-serrana": {
    municipios: ["Laranja da Terra", "Afonso Cláudio", "Brejetuba", "Conceição do Castelo", "Venda Nova do Imigrante", "Domingos Martins", "Marechal Floriano"],
    vocacoes: ["Agricultura familiar, com predomínio de pequenas propriedades", "Cafeicultura, com destaque para Brejetuba", "Agroindústria diversificada, incluindo fruticultura e olericultura", "Turismo, incluindo agroturismo, ecoturismo e turismo de aventura", "Pecuária"],
    potencialidades: ["Ampla cobertura de Mata Atlântica e unidades de conservação relevantes, incluindo o Parque Estadual Pedra Azul", "Patrimônio histórico associado à imigração europeia e à Rota Imperial", "Proximidade estratégica do litoral e da Região Metropolitana da Grande Vitória", "Paisagem e clima de montanha valorizados na Região Turística Montanhas Capixabas", "Reconhecimento da cafeicultura local e seu potencial associado ao agroturismo"],
    desafios: ["Valorização da agricultura familiar e desenvolvimento sustentável da agroindústria", "Melhoria da infraestrutura de transporte e mobilidade", "Estruturação da cadeia de cafés especiais e da economia verde", "Universalização da educação básica e fortalecimento da cultura local", "Gestão e uso eficiente dos recursos hídricos"],
    inovacaoPontosFortes: ["Presença do IFES e estímulo à cooperação entre instituições de ensino, empresas e instituições de fomento", "Oferta prevista de cursos relacionados à inovação e economia criativa", "Atuação do INCAPER em assistência técnica, extensão rural e agroecologia", "Participação de universidades e agências de fomento no território"],
    inovacaoPontosAInvestigar: ["Cobertura de internet e telefonia", "Capacidade municipal de captação de recursos e gestão de projetos", "Diversificação produtiva para além das cadeias tradicionais"],
    fonte: DRS,
  },
  "litoral-sul": {
    municipios: ["Alfredo Chaves", "Anchieta", "Iconha", "Piúma", "Rio Novo do Sul", "Itapemirim", "Marataízes", "Presidente Kennedy"],
    vocacoes: ["Mineração e atividade portuária", "Petróleo e gás", "Pesca e aquicultura", "Agricultura, com café, banana e abacaxi, e pecuária", "Turismo religioso, de aventura e agroturismo"],
    potencialidades: ["Patrimônio histórico, cultural e arquitetônico", "Praias, falésias, cachoeiras e áreas para voo livre", "Biodiversidade marinha e manguezais preservados no Rio Benevente", "Turismo religioso consolidado", "Agroturismo consolidado e eventos associados à produção regional"],
    desafios: ["Redução da desigualdade social, urbana e ambiental", "Diversificação da estrutura econômica regional", "Universalização da educação básica", "Ampliação da infraestrutura de água, esgoto e coleta de resíduos sólidos", "Ordenamento da orla costeira e proteção ambiental"],
    inovacaoPontosFortes: ["Ações de estímulo ao empreendedorismo, avanços tecnológicos e associativismo", "Objetivo regional relacionado à criação de um ecossistema de inovação", "Expansão da formação técnica e atendimento a empreendedores"],
    inovacaoPontosAInvestigar: ["Qualificação técnica e superior da mão de obra", "Acesso à internet e telefonia móvel", "Atratividade do ambiente de negócios para novos investimentos"],
    fonte: DRS,
  },
  "centro-sul": {
    municipios: ["Castelo", "Vargem Alta", "Cachoeiro de Itapemirim", "Muqui", "Atílio Vivácqua", "Mimoso do Sul", "Apiacá"],
    vocacoes: ["Rochas ornamentais e mármore", "Indústria de máquinas e equipamentos para extração e beneficiamento mineral", "Agricultura, especialmente cana-de-açúcar e café", "Pecuária", "Turismo e agroturismo"],
    potencialidades: ["Cadeia produtiva diversificada e forte presença do setor de rochas ornamentais", "Patrimônio arquitetônico e cultural preservado", "Atrativos naturais, incluindo montanhas, cachoeiras, grutas e parque estadual", "Polo regional de saúde e educação técnica/superior", "Infraestrutura ferroviária estratégica"],
    desafios: ["Redução da desigualdade social e da pobreza extrema", "Melhoria da integração rodoviária e ferroviária", "Qualificação da infraestrutura turística", "Redução do déficit habitacional e da irregularidade fundiária", "Recuperação da cobertura vegetal degradada e integração da infraestrutura econômica regional"],
    inovacaoPontosFortes: ["Ações relacionadas à desburocratização e apoio à inovação", "Previsão de espaço voltado à Ciência, Tecnologia e Inovação"],
    inovacaoPontosAInvestigar: ["Qualidade do acesso à internet e telefonia móvel", "Modernização e ampliação da educação técnica", "Alcance dos programas de empreendedorismo"],
    fonte: DRS,
  },
  caparao: {
    municipios: ["Ibatiba", "Irupi", "Iúna", "Ibitirama", "Muniz Freire", "Divino de São Lourenço", "Jerônimo Monteiro", "Alegre", "Dores do Rio Preto", "Guaçuí", "São José do Calçado", "Bom Jesus do Norte"],
    vocacoes: ["Cafeicultura, com destaque para cafés especiais", "Fruticultura", "Silvicultura", "Turismo ecológico e de aventura", "Agroturismo e agricultura familiar"],
    potencialidades: ["Parque Nacional do Caparaó e Pico da Bandeira", "Acesso capixaba ao Pico da Bandeira, favorecendo o turismo local", "Qualidade de vida e ambiente natural preservado", "Identidade territorial associada ao empreendedorismo e ao turismo", "Potencial consolidado em cafés especiais e rota do café"],
    desafios: ["Melhoria da infraestrutura, mobilidade, logística e habitação", "Ampliação do saneamento básico nas áreas rurais", "Gestão e uso eficiente dos recursos hídricos", "Fortalecimento da governança regional e institucional", "Ampliação do acesso à internet e telefonia móvel"],
    inovacaoPontosFortes: ["Programas de ampliação da base tecnológica da agroecologia", "Parcerias de pesquisa agropecuária envolvendo instituições como IJSN, FAPES, UFES e IFES", "Iniciativas de marketing territorial relacionadas aos cafés de qualidade"],
    inovacaoPontosAInvestigar: ["Conectividade digital", "Capacidade de atendimento da assistência técnica e extensão rural", "Diversificação de setores intensivos em tecnologia para além da agropecuária"],
    fonte: DRS,
  },
  "rio-doce": {
    municipios: ["Aracruz", "Ibiraçu", "João Neiva", "Linhares", "Rio Bananal", "Sooretama"],
    vocacoes: ["Indústria e atividade portuária, incluindo celulose, energia, metalmecânica, petróleo e gás", "Fruticultura", "Café conilon e silvicultura", "Pecuária", "Turismo relacionado a praias, reservas florestais e lagoas"],
    potencialidades: ["Importantes remanescentes de Mata Atlântica e unidades de conservação", "Lagoa Juparanã e Rio Doce", "Centralidade urbana e econômica de Linhares e Aracruz", "Atrativos culturais diferenciados", "Mercado consumidor regional relevante"],
    desafios: ["Ampliação da geração de empregos em setores estratégicos", "Fortalecimento do turismo regional", "Ampliação da infraestrutura logística", "Gestão e conservação dos recursos hídricos e redução de riscos de eventos críticos", "Universalização do saneamento básico"],
    inovacaoPontosFortes: ["Ações e desafios temáticos relacionados a mudanças climáticas, Indústria 4.0 e inteligência artificial", "Proposta de criação de Centro Tecnológico do Cacau", "Base industrial instalada com potencial de encadeamento tecnológico"],
    inovacaoPontosAInvestigar: ["Conservação e qualidade dos recursos hídricos", "Estruturação do turismo associado aos ativos naturais", "Ampliação da oferta de qualificação técnica"],
    fonte: DRS,
  },
  "centro-oeste": {
    municipios: ["Baixo Guandu", "São Roque do Canaã", "Colatina", "Marilândia", "Pancas", "Governador Lindenberg", "São Domingos do Norte", "Alto Rio Novo", "Vila Valério", "São Gabriel da Palha"],
    vocacoes: ["Agropecuária, com destaque para café conilon", "Extração e beneficiamento de rochas e granitos", "Indústria", "Serviços", "Agroturismo e turismo de aventura"],
    potencialidades: ["Paisagem natural entre montanhas e vales", "Diversidade étnico-cultural e tradição pomerana", "Monumento Natural dos Pontões Capixabas", "Patrimônio histórico do Distrito de Itapina", "Centralidade regional de Colatina em saúde e educação"],
    desafios: ["Ampliação da geração de empregos em setores estratégicos", "Desenvolvimento do turismo", "Melhoria da gestão hídrica e redução de riscos de eventos críticos", "Fortalecimento da agricultura orgânica e da pecuária", "Ampliação da cobertura de água, esgoto e coleta de resíduos sólidos"],
    inovacaoPontosFortes: ["Ações de ampliação de mecanismos de investimento e financiamento", "Centralidade de Colatina como polo regional de educação técnica e superior"],
    inovacaoPontosAInvestigar: ["Estruturação de iniciativas e ecossistema empreendedor regional", "Capilaridade da educação técnica e superior para os demais municípios", "Acesso à internet e telefonia"],
    fonte: DRS,
  },
  nordeste: {
    municipios: ["Jaguaré", "São Mateus", "Conceição da Barra", "Boa Esperança", "Pinheiros", "Pedro Canário", "Montanha", "Ponto Belo", "Mucurici"],
    vocacoes: ["Petróleo e gás", "Silvicultura", "Agropecuária, incluindo café conilon, cana-de-açúcar e pecuária", "Fruticultura", "Turismo litorâneo e cultural"],
    potencialidades: ["Extenso litoral e paisagens naturais, históricas e culturais", "Patrimônio histórico do Porto de São Mateus", "Parque Estadual de Itaúnas", "Manifestações culturais tradicionais", "Presença de campi da UFES e do Instituto Federal"],
    desafios: ["Ampliação da infraestrutura logística", "Universalização dos serviços de água, esgoto e resíduos sólidos", "Redução da desigualdade e pobreza extrema", "Maior integração e articulação institucional regional", "Ampliação do acesso à internet e telefonia móvel"],
    inovacaoPontosFortes: ["Presença da UFES e Instituto Federal como polos de ensino e pesquisa", "Ações relacionadas ao desenvolvimento do ecossistema de inovação", "Estímulo a soluções tecnológicas para desafios regionais", "Discussões relacionadas às economias da inovação e da energia"],
    inovacaoPontosAInvestigar: ["Conectividade digital, principalmente nas áreas rurais", "Qualificação técnica do corpo administrativo municipal", "Estruturação do empreendedorismo e associativismo para além dos grandes setores econômicos"],
    fonte: DRS,
  },
  noroeste: {
    municipios: ["Águia Branca", "Mantenópolis", "Barra de São Francisco", "Nova Venécia", "Vila Pavão", "Água Doce do Norte", "Ecoporanga"],
    vocacoes: ["Café conilon", "Pecuária leiteira e de corte", "Fruticultura", "Rochas ornamentais, especialmente granito", "Comércio, serviços e turismo"],
    potencialidades: ["Unidades de conservação e paisagens naturais preservadas", "Potencial de expansão da cadeia do granito", "Recursos hídricos diversificados", "Localização estratégica na BR-381, conectando a região a Minas Gerais", "Centros urbanos regionais em crescimento, especialmente Nova Venécia e Barra de São Francisco"],
    desafios: ["Mitigação dos impactos da sazonalidade das chuvas sobre a produção", "Incorporação de novas tecnologias voltadas à sustentabilidade", "Melhoria da educação básica nas escolas rurais", "Ampliação do acesso à água, esgoto e comunicação", "Questões de segurança pública na área rural"],
    inovacaoPontosFortes: ["Programas relacionados ao desenvolvimento de tecnologias de reprodução animal e tecnologias agrícolas", "Ações de intercâmbio entre diferentes níveis de ensino"],
    inovacaoPontosAInvestigar: ["Acesso à internet e telefonia móvel", "Oferta de educação técnica nas áreas rurais", "Diversificação produtiva para além da base agropecuária e mineral"],
    fonte: DRS,
  },
  cariacica: {
    municipios: ["Cariacica"],
    vocacoes: ["Logística e comércio atacadista no eixo BR-262/BR-101", "Indústria de base", "Comércio e serviços na centralidade de Campo Grande e Jardim América", "Apoio logístico portuário", "Agricultura periurbana e hortifrutigranjeira"],
    potencialidades: ["Centralidade consolidada de Campo Grande", "Eixos viários estruturantes", "Potencial de transporte multimodal", "Manguezais e unidades de conservação na Baía de Vitória", "Corredor ecológico Duas Bocas–Mestre Álvaro"],
    desafios: ["Tráfego pesado associado às atividades industriais", "Qualidade e estrutura do sistema viário", "Transporte público e gestão operacional do trânsito", "Controle do uso do solo no entorno dos novos eixos viários", "Capacidade fiscal e arrecadação municipal no contexto metropolitano"],
    inovacaoPontosFortes: ["Proximidade do eixo logístico-industrial metropolitano, favorecendo encadeamentos tecnológicos", "Potencial de integração rodoviária, ferroviária e hidroviária para inovação logística"],
    inovacaoPontosAInvestigar: ["Existência e alcance de programas locais de inovação e empreendedorismo", "Relação entre gestão territorial, mobilidade e atração de novos negócios", "Capacidade de investimento em novas cadeias produtivas"],
    fonte: PDUI,
  },
  "vila-velha": {
    municipios: ["Vila Velha"],
    vocacoes: ["Comércio e confecções", "Setor automotivo", "Turismo litorâneo e histórico-cultural", "Logística", "Comércio e serviços de grande porte"],
    potencialidades: ["Dinâmica urbana e econômica da orla", "Infraestrutura ferroviária existente e novos eixos ferroviários previstos", "Eixos viários estruturantes", "Manguezal do estuário do Rio Jucu e áreas de restinga", "Parque Natural Municipal de Jacarenema e potencial de transporte aquaviário"],
    desafios: ["Alagamentos e problemas de drenagem na Bacia do Baixo Jucu", "Deslocamentos pendulares para outros polos metropolitanos", "Integração do transporte municipal ao sistema metropolitano", "Pressão urbana sobre áreas ambientalmente prioritárias", "Questões relacionadas à balneabilidade das praias"],
    inovacaoPontosFortes: [],
    inovacaoPontosAInvestigar: [],
    inovacaoEmConsolidacao: true,
    fonte: PDUI,
  },
  vitoria: {
    municipios: ["Vitória"],
    vocacoes: ["Administração pública e gestão institucional", "Atividade portuária", "Serviços financeiros e corporativos", "Comércio e serviços especializados", "Indústria extrativa historicamente presente na base produtiva"],
    potencialidades: ["Forte participação econômica e tributária no contexto metropolitano", "Eixos viários estruturantes e conexão metropolitana", "Porto de Vitória e potencial logístico", "Potencial de desenvolvimento turístico", "Centralidades históricas e econômicas consolidadas"],
    desafios: ["Impactos do crescimento urbano sobre trânsito e qualidade de vida", "Questões habitacionais na escala metropolitana", "Mobilidade, poluição e atratividade de centralidades urbanas", "Impactos e integração das infraestruturas portuária e aeroportuária", "Conservação ambiental e qualidade dos recursos hídricos"],
    inovacaoPontosFortes: ["Reconhecimento da necessidade de integração da inovação tecnológica ao sistema produtivo", "Concentração de atividades de gestão, serviços especializados e finanças, com potencial para economia do conhecimento"],
    inovacaoPontosAInvestigar: ["Diversificação tecnológica da base econômica", "Relação entre qualidade ambiental e atração de atividades econômicas inovadoras", "Revitalização de áreas centrais e atração de novos negócios"],
    fonte: PDUI,
  },
  serra: {
    municipios: ["Serra"],
    apresentacao: NOTA_DIVISAO,
    vocacoes: [], potencialidades: [], desafios: [], inovacaoPontosFortes: [], inovacaoPontosAInvestigar: [],
    fonte: CONSOLIDACAO,
  },
  "viana-fundao-guarapari": {
    municipios: ["Viana", "Fundão", "Guarapari"],
    apresentacao: NOTA_DIVISAO,
    vocacoes: [], potencialidades: [], desafios: [], inovacaoPontosFortes: [], inovacaoPontosAInvestigar: [],
    fonte: CONSOLIDACAO,
  },
};

export function referenciaDoNucleo(nucleoId: string): PerfilTerritorialReferencia {
  return referenciaTerritorial[nucleoId] ?? {
    municipios: [], vocacoes: [], potencialidades: [], desafios: [],
    inovacaoPontosFortes: [], inovacaoPontosAInvestigar: [], fonte: CONSOLIDACAO,
  };
}

export const FONTE_REFERENCIA_PADRAO = CONSOLIDACAO;
export const FONTE_CAMINHOS = "Caminhos da Inovação — coleta de campo";

export type AreaPerfilTerritorial = "visao-geral" | "vocacoes" | "potencialidades" | "inovacao" | "descobertas";
export const areasPerfilTerritorial: { id: AreaPerfilTerritorial; rotulo: string; origem: OrigemDado }[] = [
  { id: "visao-geral", rotulo: "Visão geral", origem: "referencia" },
  { id: "vocacoes", rotulo: "Vocações", origem: "referencia" },
  { id: "potencialidades", rotulo: "Potencialidades e desafios", origem: "referencia" },
  { id: "inovacao", rotulo: "Inovação", origem: "referencia" },
  { id: "descobertas", rotulo: "Descobertas", origem: "caminhos" },
];

/** Categorias de campo existentes: não derivar descobertas do conteúdo de referência. */
export const categoriasDescoberta = [
  { id: "atores", rotulo: "Atores", icone: "🤝", descricao: "Pessoas, grupos e instituições identificados no território.", fontes: ["conexoes_atores", "articulacoes"] },
  { id: "ativos", rotulo: "Ativos", icone: "🧭", descricao: "Ativos e ambientes de inovação mapeados.", fontes: ["ativos_inovacao", "ambientes_inovacao"] },
  { id: "iniciativas", rotulo: "Iniciativas", icone: "💡", descricao: "Inovações e práticas reveladas pelo trabalho de campo.", fontes: ["iniciativas_reveladas"] },
  { id: "oportunidades", rotulo: "Oportunidades", icone: "🔎", descricao: "Caminhos possíveis percebidos pelos Conectores.", fontes: ["oportunidades_identificadas"] },
  { id: "lacunas", rotulo: "Lacunas", icone: "🕳️", descricao: "Ausências percebidas em campo — registro qualitativo, em construção.", fontes: [] },
] as const;
