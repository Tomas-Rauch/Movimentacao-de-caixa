import React, { useState } from 'react'
import '../styles/Login.css'

const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  // Modal recuperação
  const [modalAberto, setModalAberto] = useState(false)
  const [emailRecuperacao, setEmailRecuperacao] = useState('')
  const [recuperacaoMsg, setRecuperacaoMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const erroResposta = await response.json()
        throw new Error(erroResposta.message || 'Erro ao fazer login')
      }

      const { accessToken, refreshToken } = await response.json()

      if (rememberMe) {
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)
      } else {
        sessionStorage.setItem('accessToken', accessToken)
        sessionStorage.setItem('refreshToken', refreshToken)
      }

      alert('Login bem-sucedido!')
      window.location.href = '/dashboard'

    } catch (err: any) {
      setErro(err.message)
    } finally {
      setCarregando(false)
    }
  }

  const handleRecuperarSenha = async () => {
    setRecuperacaoMsg('')
    try {
      const res = await fetch('http://localhost:3000/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailRecuperacao }),
      })

      const data = await res.json()
      if (res.ok) {
        setRecuperacaoMsg(data.message || 'Se o email existir, um link foi enviado.')
      } else {
        setRecuperacaoMsg(data.message || 'Erro ao solicitar recuperação.')
      }
    } catch {
      setRecuperacaoMsg('Erro inesperado ao tentar recuperar a senha.')
    }
  }

  return (
    <div className="login-container">
      <div className="login-left">
        <h1>
          Gerencie seu<br />
          fluxo financeiro<br />
          com eficiência.
        </h1>
        <p>
          Controle completo das suas<br />
          finanças em um só lugar.<br />
          Monitore entradas, saídas e<br />
          tenha relatórios detalhados.
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
          <h2>Bem-vindo de volta!</h2>
          <p className="subtitle">Entre com suas credenciais para continuar</p>

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
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Lembrar de mim
            </label>
            <a
              href="#"
              className="forgot-password"
              onClick={(e) => {
                e.preventDefault()
                setModalAberto(true)
              }}
            >
              Esqueceu a senha?
            </a>
          </div>

          <button type="submit" className="login-button" disabled={carregando}>
            {carregando ? 'Entrando...' : 'ENTRAR'}
          </button>

          {erro && <p style={{ color: 'red', marginTop: '10px' }}>{erro}</p>}

          <div className="signup-link">
            Não tem uma conta? <a href="/cadastro">Cadastre-se</a>
          </div>
        </form>
      </div>

      {/* Modal de recuperação */}
      {modalAberto && (
        <div className="modal">
          <div className="modal-content">
            <h3>Recuperar Senha</h3>
            <input
              type="email"
              placeholder="Digite seu email"
              value={emailRecuperacao}
              onChange={(e) => setEmailRecuperacao(e.target.value)}
            />
            <button onClick={handleRecuperarSenha}>Enviar link</button>
            {recuperacaoMsg && <p>{recuperacaoMsg}</p>}
            <button onClick={() => setModalAberto(false)}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Login
