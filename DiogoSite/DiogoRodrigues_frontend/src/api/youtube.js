// src/api/youtube.js

const API_BASE_URL = "https://diogorodrigues-backend.onrender.com/api/youtube";

/**
 * Vai buscar as informações do canal (nome, subscritores, visualizações, etc.)
 */
export const fetchChannelInfo = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/channel-info`);
    if (!response.ok) throw new Error("Erro ao obter info do canal");
    return await response.json();
  } catch (error) {
    console.error("Erro em fetchChannelInfo:", error);
    return null;
  }
};

/**
 * Vai buscar os últimos vídeos do canal
 */
export const fetchLatestVideos = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/latest-videos`);
    if (!response.ok) throw new Error("Erro ao obter vídeos");
    return await response.json();
  } catch (error) {
    console.error("Erro em fetchLatestVideos:", error);
    return [];
  }
};
