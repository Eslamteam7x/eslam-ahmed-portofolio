const cache = new Map();

export async function fetchData(url) {
  if (cache.has(url)) return cache.get(url);
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    cache.set(url, data);
    return data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
}

export function clearCache() {
  cache.clear();
}
