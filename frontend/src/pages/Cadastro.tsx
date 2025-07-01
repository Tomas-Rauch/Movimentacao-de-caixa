import React, { useState } from 'react';
import '../styles/Login.css'; // Reutilizando o estilo do login

const Cadastro: React.FC = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setSucesso('');
    setCarregando(true);

    try {
      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, password, role }),
      });

      if (!response.ok) {
        const erroResposta = await response.json();
        throw new Error(erroResposta.message || 'Erro ao cadastrar');
      }

      setSucesso('Cadastro realizado com sucesso!');
      setNome('');
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h1>
          Crie sua conta<br />
          e organize suas<br />
          finanças com facilidade.
        </h1>
        <p>
          Acompanhe tudo<br />
          com clareza e segurança.
        </p>
        <div className="detective-container">
          <img
            src="/img/detetive.jpg"
            alt="Logo Detetive"
            className="detective-logo"
          />
        </div>
      </div>

      <div className="login-right">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Crie sua conta</h2>
          <p className="subtitle">Preencha seus dados para se registrar</p>

          <div className="form-group">
            <label htmlFor="nome">Nome completo:</label>
            <input
              type="text"
              id="nome"
              placeholder="Digite seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha:</label>
            <input
              type="password"
              id="password"
              placeholder="Crie uma senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-button" disabled={carregando}>
            {carregando ? 'Cadastrando...' : 'CADASTRAR'}
          </button>

          {erro && <p style={{ color: 'red', marginTop: '10px' }}>{erro}</p>}
          {sucesso && <p style={{ color: 'green', marginTop: '10px' }}>{sucesso}</p>}

          <div className="signup-link">
            Já tem conta? <a href="/">Fazer login</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Cadastro;
