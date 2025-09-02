import React, { useState, useEffect } from "react";
import {
  User,
  Lock,
  Mail,
  Camera,
  Save,
  UserPlus,
  KeyRound,
  Plus,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState("perfil");

  const userRole = localStorage.getItem('perfil') || sessionStorage.getItem('perfil');

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [perfil, setPerfil] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      if (!token) {
        alert('Usuário não autenticado');
        navigate('/login');
        return;
      }
      try {
        const res = await fetch('http://localhost:3000/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setNome(data.nome);
          setEmail(data.email);
          setPerfil(data.perfil);
        } else {
          throw new Error('Falha ao buscar dados do perfil');
        }
      } catch (error) {
        console.error(error);
        alert('Erro ao carregar o perfil.');
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleNavigation = (page: string) => {
    switch (page) {
      case "dashboard":
        navigate("/dashboard");
        break;
      case "nova-movimentacao":
        navigate("/nova-movimentacao");
        break;
      case "perfil":
        navigate("/perfil");
        break;
      case "sair":
        localStorage.clear();
        sessionStorage.clear();
        navigate("/login");
        break;
      default:
        break;
    }
  };

  const handleSaveProfile = async () => {
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    if (!token) return alert('Usuário não autenticado');
    const res = await fetch('http://localhost:3000/users/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nome, email }),
    });
    if (res.ok) {
      alert('Perfil atualizado com sucesso!');
    } else {
      alert('Erro ao atualizar perfil');
    }
  };

  const [novoNome, setNovoNome] = useState('');
  const [novoEmail, setNovoEmail] = useState('');
  const [novoSenha, setNovoSenha] = useState('');
  const [novoPerfil, setNovoPerfil] = useState('admin');

  const handleCreateUser = async () => {
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    if (!token) return alert('Usuário não autenticado');
    const res = await fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        nome: novoNome,
        email: novoEmail,
        senha: novoSenha,
        perfil: novoPerfil,
      }),
    });
    if (res.ok) {
      alert('Usuário criado com sucesso!');
      setNovoNome('');
      setNovoEmail('');
      setNovoSenha('');
      setNovoPerfil('admin');
    } else {
      alert('Erro ao criar usuário');
    }
  };

  return (
    <div className="settings-page">
      {/* HEADER - igual ao Dashboard */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-container">
            <img src="/public/img/logo.png" alt="Logo" className="logo-img" />
          </div>
          <div className="nav-buttons">
            <button
              className="btn"
              onClick={() => handleNavigation("dashboard")}
            >
              <LayoutDashboard className="icon" /> Dashboard
            </button>
            <button
              className="btn"
              onClick={() => handleNavigation("nova-movimentacao")}
            >
              <Plus className="icon" /> Nova movimentação
            </button>
            <button
              className="btn btn-active" // ativo no Perfil
              onClick={() => handleNavigation("perfil")}
            >
              <User className="icon" /> Perfil
            </button>
            <button
              className="btn-icon"
              aria-label="Sair"
              title="Sair"
              onClick={() => handleNavigation("sair")}
            >
              <LogOut className="icon" />
            </button>
          </div>
        </div>
      </header>

      {/* CONTEÚDO */}
      <div className="settings-container">
        <div className="card">
          <div className="settings-header">
            <h1 className="settings-title">Meu Perfil</h1>

            <div className="settings-tabs">
              <button
                className={activeTab === "perfil" ? "active" : ""}
                onClick={() => setActiveTab("perfil")}
              >
                <User size={20} /> Perfil
              </button>
              <button
                className={activeTab === "senha" ? "active" : ""}
                onClick={() => setActiveTab("senha")}
              >
                <Lock size={20} /> Segurança
              </button>
              {userRole === 'admin' && (
                <button
                  className={activeTab === "novo" ? "active" : ""}
                  onClick={() => setActiveTab("novo")}
                >
                  <UserPlus size={20} /> Novo Usuário
                </button>
              )}
            </div>
          </div>

          <p className="settings-subtitle">
            Gerencie suas informações e preferências da conta
          </p>

          <section className="settings-content">
            {activeTab === "perfil" && (
              <>
                <h2>Informações do Perfil</h2>

                <div className="profile-section">
                  <div className="image-upload">
                    <label htmlFor="file-upload" className="image-label">
                      {profileImage ? (
                        <img src={profileImage} alt="Profile" />
                      ) : (
                        <div className="placeholder">
                          <Camera size={32} />
                          <span>Editar Foto</span>
                        </div>
                      )}
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label>Nome de Usuário</label>
                      <div className="input-icon">
                        <User size={20} />
                        <input type="text" placeholder="Digite seu nome" value={nome} onChange={e => setNome(e.target.value)} />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Email</label>
                      <div className="input-icon">
                        <Mail size={20} />
                        <input type="email" placeholder="exemplo@gmail.com" value={email} onChange={e => setEmail(e.target.value)} />
                      </div>
                    </div>

                    <div className="form-group full">
                      <label>Nível</label>
                      <input type="text" value={perfil === 'admin' ? 'ADMIN' : 'FUNCIONÁRIO'} disabled />
                    </div>
                  </div>
                </div>

                <button className="save-btn" onClick={handleSaveProfile}>
                  <Save size={20} /> Salvar Alterações
                </button>
              </>
            )}

            {activeTab === "senha" && (
              <>
                <h2>Alterar Senha</h2>

                <div className="form-group">
                  <label>Senha Atual</label>
                  <div className="input-icon">
                    <KeyRound size={20} />
                    <input
                      type="password"
                      placeholder="Digite sua senha atual"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Nova Senha</label>
                  <div className="input-icon">
                    <KeyRound size={20} />
                    <input
                      type="password"
                      placeholder="Digite sua nova senha"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Confirmar Nova Senha</label>
                  <div className="input-icon">
                    <KeyRound size={20} />
                    <input
                      type="password"
                      placeholder="Confirme sua nova senha"
                    />
                  </div>
                </div>

                <button className="save-btn">
                  <Save size={20} /> Alterar Senha
                </button>
              </>
            )}

            {activeTab === "novo" && (
              <>
                <h2>Criar Novo Usuário</h2>

                <div className="form-group">
                  <label>Nome do Usuário</label>
                  <div className="input-icon">
                    <User size={20} />
                    <input type="text" placeholder="Digite o nome do usuário" value={novoNome} onChange={e => setNovoNome(e.target.value)} />
                  </div>
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <div className="input-icon">
                    <Mail size={20} />
                    <input type="email" placeholder="Digite o email do usuário" value={novoEmail} onChange={e => setNovoEmail(e.target.value)} />
                  </div>
                </div>

                <div className="form-group">
                  <label>Senha</label>
                  <div className="input-icon">
                    <KeyRound size={20} />
                    <input type="password" placeholder="Defina uma senha" value={novoSenha} onChange={e => setNovoSenha(e.target.value)} />
                  </div>
                </div>

                <div className="form-group">
                  <label>Nível</label>
                  <select value={novoPerfil} onChange={e => setNovoPerfil(e.target.value)}>
                    <option value="admin">ADMIN</option>
                    <option value="user">FUNCIONÁRIO</option>
                  </select>
                </div>

                <button className="save-btn" onClick={handleCreateUser}>
                  <UserPlus size={20} /> Criar Usuário
                </button>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;