const OWNER = 'Eslamteam7x';
const REPO = 'eslam-ahmed-portofolio';
const BRANCH = 'main';

function getToken() {
  return localStorage.getItem('github_token');
}

export function isGitHubConfigured() {
  return !!getToken();
}

export function setGitHubToken(token) {
  localStorage.setItem('github_token', token);
}

export function clearGitHubToken() {
  localStorage.removeItem('github_token');
}

async function getFileSha(path) {
  const token = getToken();
  try {
    const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}`, {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`GitHub API error: ${res.status}`);
    }
    const data = await res.json();
    return data.sha;
  } catch {
    return null;
  }
}

export async function commitFile(path, content, message) {
  const token = getToken();
  const sha = await getFileSha(path);

  const body = {
    message,
    content: btoa(unescape(encodeURIComponent(content))),
    branch: BRANCH,
  };
  if (sha) body.sha = sha;

  const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `GitHub API error: ${res.status}`);
  }

  return res.json();
}

export async function commitImage(path, base64Content, message) {
  const token = getToken();
  const sha = await getFileSha(path);

  const body = {
    message,
    content: base64Content,
    branch: BRANCH,
  };
  if (sha) body.sha = sha;

  const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `GitHub API error: ${res.status}`);
  }

  return res.json();
}

export async function publishAllData(dataMap) {
  const results = [];
  for (const [filePath, content] of Object.entries(dataMap)) {
    try {
      const msg = `Update ${filePath} via admin panel`;
      const result = await commitFile(filePath, content, msg);
      results.push({ path: filePath, success: true, result });
    } catch (err) {
      results.push({ path: filePath, success: false, error: err.message });
    }
  }
  return results;
}
