const API_URL = `${import.meta.env.VITE_BACKEND_URL}/movimentacoes`;

export async function getMovimentacoes(token: string) {
  const res = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

export async function createMovimentacao(data: any, token: string) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function updateMovimentacao(id: number, data: any, token: string) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function deleteMovimentacao(id: number, token: string) {
  await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function getCategorias(token: string) {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/categorias`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}
