import malhaMunicipal from "@/data/es-municipios-2024.geojson.json";

type Coordenada = [number, number];
type GeometriaMunicipal = {
  type: "Polygon" | "MultiPolygon";
  coordinates: Coordenada[][] | Coordenada[][][];
};

type FeicaoMunicipal = {
  properties: { codigo: string; nome: string };
  geometry: GeometriaMunicipal;
};

const feicoes = (malhaMunicipal as unknown as { features: FeicaoMunicipal[] }).features;
const todasCoordenadas: Coordenada[] = [];

function coletarCoordenadas(valor: unknown): void {
  if (!Array.isArray(valor)) return;
  if (typeof valor[0] === "number" && typeof valor[1] === "number") {
    todasCoordenadas.push([valor[0], valor[1]]);
    return;
  }
  valor.forEach(coletarCoordenadas);
}

feicoes.forEach((feicao) => coletarCoordenadas(feicao.geometry.coordinates));

const longitudes = todasCoordenadas.map(([longitude]) => longitude);
const latitudes = todasCoordenadas.map(([, latitude]) => latitude);
const longitudeMinima = Math.min(...longitudes);
const longitudeMaxima = Math.max(...longitudes);
const latitudeMinima = Math.min(...latitudes);
const latitudeMaxima = Math.max(...latitudes);
const latitudeMedia = ((latitudeMinima + latitudeMaxima) / 2) * (Math.PI / 180);
const fatorLongitude = Math.cos(latitudeMedia);
const MARGEM = 18;
export const MUNICIPIOS_VIEW_WIDTH = 620;
const escala = (MUNICIPIOS_VIEW_WIDTH - MARGEM * 2) / ((longitudeMaxima - longitudeMinima) * fatorLongitude);
export const MUNICIPIOS_VIEW_HEIGHT = Number(((latitudeMaxima - latitudeMinima) * escala + MARGEM * 2).toFixed(2));
export const MUNICIPIOS_VIEWBOX = `0 0 ${MUNICIPIOS_VIEW_WIDTH} ${MUNICIPIOS_VIEW_HEIGHT}`;

function projetar([longitude, latitude]: Coordenada) {
  return {
    x: Number((MARGEM + (longitude - longitudeMinima) * fatorLongitude * escala).toFixed(2)),
    y: Number((MARGEM + (latitudeMaxima - latitude) * escala).toFixed(2)),
  };
}

function anelParaPath(anel: Coordenada[]) {
  return `${anel.map((coordenada, indice) => {
    const { x, y } = projetar(coordenada);
    return `${indice === 0 ? "M" : "L"}${x} ${y}`;
  }).join(" ")} Z`;
}

function geometriaParaAneis(geometria: GeometriaMunicipal): Coordenada[][] {
  if (geometria.type === "Polygon") return geometria.coordinates as Coordenada[][];
  return (geometria.coordinates as Coordenada[][][]).flat();
}

export interface MunicipioES {
  codigo: string;
  nome: string;
  path: string;
  centro: { x: number; y: number };
  limites: { x: number; y: number; largura: number; altura: number };
}

export const municipiosES: MunicipioES[] = feicoes
  .map((feicao) => {
    const aneis = geometriaParaAneis(feicao.geometry);
    const pontos = aneis.flat().map(projetar);
    const xs = pontos.map(({ x }) => x);
    const ys = pontos.map(({ y }) => y);
    const xMin = Math.min(...xs);
    const xMax = Math.max(...xs);
    const yMin = Math.min(...ys);
    const yMax = Math.max(...ys);
    return {
      codigo: feicao.properties.codigo,
      nome: feicao.properties.nome,
      path: aneis.map(anelParaPath).join(" "),
      centro: { x: (xMin + xMax) / 2, y: (yMin + yMax) / 2 },
      limites: { x: xMin, y: yMin, largura: xMax - xMin, altura: yMax - yMin },
    };
  })
  .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));

export function normalizarBusca(valor: string) {
  return valor.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
}