// api.js
const API_BASE = "http://localhost:8080/api";

// ===== AUTH =====
export async function login(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, contrasena: password })
  });
  if (!res.ok) throw new Error(await res.text());
  return res.text(); // devuelve mensaje o token si lo cambias
}

// ===== CATEGORÍAS =====
export async function obtenerCategorias(email) {
  const res = await fetch(`${API_BASE}/categorias?email=${email}`);
  if (!res.ok) throw new Error("Error al cargar categorías");
  return res.json();
}

export async function obtenerSubcategorias(categoriaId, email) {
  const res = await fetch(`${API_BASE}/categorias/${categoriaId}/subcategorias?email=${email}`);
  if (!res.ok) throw new Error("Error al cargar subcategorías");
  return res.json();
}

// ===== MEDIOS DE PAGO =====
export async function obtenerMediosDePago(email) {
  // Necesitas crear este endpoint (ver abajo)
  const res = await fetch(`${API_BASE}/medios-pago?email=${email}`);
  if (!res.ok) throw new Error("Error al cargar medios de pago");
  return res.json();
}

// ===== TRANSACCIONES =====
export async function guardarTransaccion(dto) {
  const res = await fetch(`${API_BASE}/transacciones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto)
  });
  if (!res.ok) throw new Error(await res.text());
  return res.text();
}

export async function obtenerTransacciones(email, inicio, fin) {
  const url = new URL(`${API_BASE}/transacciones`);
  url.searchParams.set("email", email);
  url.searchParams.set("inicio", inicio.toISOString());
  url.searchParams.set("fin", fin.toISOString());
  const res = await fetch(url);
  if (!res.ok) throw new Error("Error al cargar transacciones");
  return res.json();
}