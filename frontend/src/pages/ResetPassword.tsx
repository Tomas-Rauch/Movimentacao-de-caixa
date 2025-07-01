import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import '../styles/Login.css'; // reutilizando o estilo do login

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (novaSenha !== confirmarSenha) {
      return setMensagem('As senhas não coincidem.');
    }

    setMensagem('');
    setCarregando(true);

    try {
      const response = await fetch('http://localhost:3000/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: novaSenha }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Erro ao redefinir senha');

      setMensagem('Senha redefinida com sucesso! Você já pode fazer login.');
    } catch (err: any) {
      setMensagem(err.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-right">
        <form className="login-form" onSubmit={handleReset}>
          <h2>Redefinir Senha</h2>

          <div className="form-group">
            <label htmlFor="novaSenha">Nova Senha:</label>
            <input
              type="password"
              id="novaSenha"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmarSenha">Confirmar Senha:</label>
            <input
              type="password"
              id="confirmarSenha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-button" disabled={carregando}>
            {carregando ? 'Salvando...' : 'Redefinir Senha'}
          </button>

          {mensagem && <p style={{ marginTop: '1rem', color: 'red' }}>{mensagem}</p>}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
