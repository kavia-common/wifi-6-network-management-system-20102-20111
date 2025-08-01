const TOKEN_KEY = "wifi6_token";

// PUBLIC_INTERFACE
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

// PUBLIC_INTERFACE
export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

// PUBLIC_INTERFACE
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}
