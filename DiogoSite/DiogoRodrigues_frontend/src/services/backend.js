const BACKEND_URL = "https://diogorodrigues-backend.onrender.com";

export async function getLatestVideos() {
    const res = await fetch(`${BACKEND_URL}/api/latest-videos`);
    return res.json();
}

export async function getLiveStatus() {
    const res = await fetch(`${BACKEND_URL}/api/live`);
    return res.json();
}
