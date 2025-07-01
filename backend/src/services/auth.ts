// src/services/auth.ts
export async function login(email: string, password: string) {
  const response = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    const erro = await response.json();
throw new Error(JSON.stringify(erro));
  }

  return response.json() // accessToken e refreshToken
}
