const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const SESSION_KEYS = {
  user: { token: "userToken", profile: "user" },
  admin: { token: "adminToken", profile: "admin" },
};

function readJson(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "null");
  } catch {
    return null;
  }
}

export class AuthClient {
  constructor(baseUrl) {
    this.baseUrl = String(baseUrl).replace(/\/$/, "");
  }

  getToken(role = "user") {
    return localStorage.getItem(SESSION_KEYS[role].token);
  }

  getProfile(role = "user") {
    return readJson(SESSION_KEYS[role].profile);
  }

  isAuthenticated(role = "user") {
    return Boolean(this.getToken(role));
  }

  setSession(role, payload = {}) {
    const keys = SESSION_KEYS[role];
    if (payload.token) {
      localStorage.setItem(keys.token, payload.token);
    }

    const profile = role === "admin" ? payload.admin : payload.user;
    if (profile) {
      localStorage.setItem(keys.profile, JSON.stringify(profile));
    }
  }

  clearSession(role = "user") {
    const keys = SESSION_KEYS[role];
    localStorage.removeItem(keys.token);
    localStorage.removeItem(keys.profile);
  }

  async request(path, { method = "GET", body, auth = false, role = "user" } = {}) {
    const headers = { Accept: "application/json" };
    const hasBody = body !== undefined && method !== "GET" && method !== "HEAD";

    if (hasBody) {
      headers["Content-Type"] = "application/json";
    }

    if (auth) {
      const token = this.getToken(role);
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    const res = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers,
      body: hasBody ? JSON.stringify(body) : undefined,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      if (res.status === 401 && auth) {
        this.clearSession(role);
      }
      const error = new Error(data.message || "Request failed");
      error.status = res.status;
      error.data = data;
      throw error;
    }

    if (data.token || data.user || data.admin) {
      this.setSession(role, data);
    }

    return data;
  }

  get(path, options = {}) {
    return this.request(path, { ...options, method: "GET" });
  }

  post(path, body, options = {}) {
    return this.request(path, { ...options, method: "POST", body });
  }

  put(path, body, options = {}) {
    return this.request(path, { ...options, method: "PUT", body });
  }

  async postForm(path, formData, { auth = false, role = "user" } = {}) {
    const headers = { Accept: "application/json" };
    if (auth) {
      const token = this.getToken(role);
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    const res = await fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      headers,
      body: formData,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      if (res.status === 401 && auth) {
        this.clearSession(role);
      }
      const error = new Error(data.message || "Request failed");
      error.status = res.status;
      error.data = data;
      throw error;
    }
    return data;
  }

  async getBlob(path, { auth = false, role = "user" } = {}) {
    const headers = {};
    if (auth) {
      const token = this.getToken(role);
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    const res = await fetch(`${this.baseUrl}${path}`, { headers });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      if (res.status === 401 && auth) {
        this.clearSession(role);
      }
      const error = new Error(data.message || "Request failed");
      error.status = res.status;
      throw error;
    }
    return res.blob();
  }
}

export const authClient = new AuthClient(API_URL);
