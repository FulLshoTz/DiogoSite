const BACKEND_URL = "https://diogorodrigues-backend.onrender.com";

export async function getLatestVideos() {
  const res = await fetch("https://diogorodrigues-backend.onrender.com/api/latest-videos");
  return res.json();
}


// REMOVE ISTO (o backend não tem esta rota!)
// export async function getLiveStatus() {
//     const res = await fetch(`/api/live`);
//     return res.json();
// }
