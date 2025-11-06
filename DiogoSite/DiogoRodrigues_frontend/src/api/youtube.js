// src/api/youtube.js

// Usa a variável do Render se existir, ou local em desenvolvimento
const API_BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:5001/api";

export const getChannelInfo = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/youtube/channel-info`);
    if (!response.ok) throw new Error("Erro ao obter informações do canal");
    return await response.json();
  } catch (error) {
    console.error("Erro em getChannelInfo:", error);
    return null;
  }
};

export const getLatestVideos = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/youtube/latest-videos`);
    if (!response.ok) throw new Error("Erro ao obter vídeos");
    return await response.json();
  } catch (error) {
    console.error("Erro em getLatestVideos:", error);
    return [];
  }
};
