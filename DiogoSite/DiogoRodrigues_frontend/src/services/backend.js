export async function getLatestVideos() {
    const res = await fetch(`/api/latest-videos`);
    return res.json();
}

export async function getLiveStatus() {
    const res = await fetch(`/api/live`);
    return res.json();
}
