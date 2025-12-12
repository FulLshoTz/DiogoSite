// Determina a URL do backend com base no ambiente (desenvolvimento ou produção)
const getBackendUrl = () => {
  // Se o site estiver em produção (no Render), usa a URL do Render.
  if (import.meta.env.PROD) {
    return "https://diogorodrigues-backend.onrender.com";
  }
  // Caso contrário (no seu PC), usa o servidor local na porta 5000.
  return "http://localhost:5000"; 
};

const BACKEND_URL = getBackendUrl();

/**
 * Busca os vídeos mais recentes do YouTube.
 */
export async function getLatestVideos() {
  const res = await fetch(`${BACKEND_URL}/api/latest-videos`);
  if (!res.ok) {
    console.error("Falha ao buscar vídeos:", res.status, await res.text());
    throw new Error(`Failed to fetch latest videos: ${res.statusText}`);
  }
  return res.json();
}

/**
 * Envia um ficheiro de telemetria para análise inicial.
 * @param {FormData} formData O formulário de dados contendo o ficheiro.
 * @returns {Promise<object>} Os dados da análise inicial (voltas, etc.).
 */
export async function analyzeTelemetry(formData) {
  const res = await fetch(`${BACKEND_URL}/api/telemetry/analyze`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    // Tenta ler o erro como texto, pois pode não ser JSON
    const errorText = await res.text();
    console.error("Falha na análise de telemetria:", res.status, errorText);
    try {
      // Tenta fazer parse do erro como JSON, pode ser que o backend tenha enviado um erro estruturado
      const errorJson = JSON.parse(errorText);
      throw new Error(errorJson.error || `Erro ${res.status}`);
    } catch (e) {
      // Se o parse falhar, lança o texto do erro ou um erro genérico
      throw new Error(errorText || `Erro ${res.status}`);
    }
  }
  return res.json();
}

/**
 * Executa uma query SQL no ficheiro de telemetria especificado.
 * @param {string} filename O nome do ficheiro no servidor.
 * @param {string} query A query SQL a ser executada.
 * @returns {Promise<object>} O resultado da query.
 */
export async function runTelemetryQuery(filename, query) {
  const res = await fetch(`${BACKEND_URL}/api/telemetry/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename, query }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    console.error("Falha na query de telemetria:", res.status, errorData);
    throw new Error(errorData.error || `Erro ${res.status}`);
  }
  return res.json();
}
