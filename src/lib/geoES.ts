import geojson from "@/data/es-uf-32.geojson.json";

/**
 * Renderização do Espírito Santo a partir da geometria oficial fornecida
 * (limite_es_2017). WGS84 / EPSG:4326.
 *
 * O contorno não é redesenhado: os anéis do GeoJSON são apenas projetados
 * (equirretangular com correção de longitude por cos(lat)) para o espaço do
 * SVG, preservando a proporção real do Estado.
 */

type Anel = [number, number][];

const geometria = (geojson as unknown as {
  features: { geometry: { type: string; coordinates: number[][][][] | number[][][] } }[];
}).features[0]!.geometry;

const aneis: Anel[] = (() => {
  const saida: Anel[] = [];
  if (geometria.type === "MultiPolygon") {
    for (const poligono of geometria.coordinates as number[][][][]) {
      for (const anel of poligono) saida.push(anel as Anel);
    }
  } else {
    for (const anel of geometria.coordinates as number[][][]) saida.push(anel as Anel);
  }
  return saida;
})();

/**
 * O território continental é enquadrado sozinho: as ilhas oceânicas de
 * Trindade e Martim Vaz (a ~1.100 km da costa) ficam fora do recorte do mapa,
 * sem qualquer alteração da geometria continental oficial.
 */
const aneisContinentais = aneis.filter((a) => a.every((p) => p[0] < -38.5));

const lons = aneisContinentais.flatMap((a) => a.map((p) => p[0]));
const lats = aneisContinentais.flatMap((a) => a.map((p) => p[1]));

const lonMin = Math.min(...lons);
const lonMax = Math.max(...lons);
const latMin = Math.min(...lats);
const latMax = Math.max(...lats);

const latMedia = ((latMin + latMax) / 2) * (Math.PI / 180);
const fatorLon = Math.cos(latMedia);

/** Margem interna para o mapa não encostar nas bordas do container. */
const MARGEM = 14;
const LARGURA = 400;

const larguraGeo = (lonMax - lonMin) * fatorLon;
const alturaGeo = latMax - latMin;

const escala = (LARGURA - MARGEM * 2) / larguraGeo;
const ALTURA = alturaGeo * escala + MARGEM * 2;

export const ES_VIEW_WIDTH = LARGURA;
export const ES_VIEW_HEIGHT = Number(ALTURA.toFixed(2));
export const ES_VIEWBOX = `0 0 ${ES_VIEW_WIDTH} ${ES_VIEW_HEIGHT}`;

/** Projeta uma coordenada geográfica (lon, lat) para o espaço do SVG. */
export function projetar(lon: number, lat: number): { x: number; y: number } {
  return {
    x: Number((MARGEM + (lon - lonMin) * fatorLon * escala).toFixed(2)),
    y: Number((MARGEM + (latMax - lat) * escala).toFixed(2)),
  };
}

function anelParaPath(anel: Anel) {
  return (
    anel
      .map((p, i) => {
        const { x, y } = projetar(p[0], p[1]);
        return `${i === 0 ? "M" : "L"}${x} ${y}`;
      })
      .join(" ") + " Z"
  );
}

/** Paths do contorno oficial (um por anel da geometria). */
export const ES_PATHS: string[] = aneisContinentais.map(anelParaPath);

/** Path único combinando todos os anéis (para preenchimento e traçado). */
export const ES_PATH = ES_PATHS.join(" ");

function dentroDoAnel(lon: number, lat: number, anel: Anel) {
  let dentro = false;
  for (let i = 0, j = anel.length - 1; i < anel.length; j = i++) {
    const [xi, yi] = anel[i]!;
    const [xj, yj] = anel[j]!;
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
      dentro = !dentro;
    }
  }
  return dentro;
}

/** Teste geográfico: a coordenada está dentro do território capixaba? */
export function dentroDoES(lon: number, lat: number) {
  return aneisContinentais.some((anel) => dentroDoAnel(lon, lat, anel));
}

/** Gera pontos determinísticos distribuídos dentro do território real. */
export function pontosNoTerritorio(quantidade: number) {
  let semente = 20260913;
  const aleatorio = () => {
    semente = (semente * 1103515245 + 12345) % 2147483648;
    return semente / 2147483648;
  };

  const pontos: { x: number; y: number; r: number; delay: string }[] = [];
  let tentativas = 0;
  while (pontos.length < quantidade && tentativas < quantidade * 400) {
    tentativas += 1;
    const lon = lonMin + aleatorio() * (lonMax - lonMin);
    const lat = latMin + aleatorio() * (latMax - latMin);
    if (!dentroDoES(lon, lat)) continue;
    const { x, y } = projetar(lon, lat);
    if (pontos.some((p) => Math.hypot(p.x - x, p.y - y) < 22)) continue;
    pontos.push({
      x,
      y,
      r: Number((1.4 + aleatorio() * 0.7).toFixed(2)),
      delay: `${(aleatorio() * 4).toFixed(1)}s`,
    });
  }
  return pontos;
}
