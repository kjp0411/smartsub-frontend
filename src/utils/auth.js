// Base64URL → Base64 보정
const b64urlToB64 = (s) => {
    if (!s) return "";
    s = s.replace(/-/g, "+").replace(/_/g, "/");
    const pad = s.length % 4;
    if (pad === 2) s += "==";
    else if (pad === 3) s += "=";
    else if (pad !== 0) s += "===";
    return s;
  };
  
  export const getRoles = () => {
    try {
      const saved = JSON.parse(localStorage.getItem("roles") || "[]");
      if (Array.isArray(saved) && saved.length) return saved;
    } catch {}
    try {
      const token = localStorage.getItem("token");
      if (!token) return [];
      const payload = JSON.parse(atob(b64urlToB64(token.split(".")[1])));
      return Array.isArray(payload?.roles) ? payload.roles : [];
    } catch {
      return [];
    }
  };
  
  export const isAdminUser = () => getRoles().includes("ADMIN");
  