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

/*
  NOTA: Todas as outras chamadas à API (como as de telemetria) devem ser 
  adicionadas aqui para manter o código organizado e garantir que funcionam
  tanto localmente como em produção.
*/