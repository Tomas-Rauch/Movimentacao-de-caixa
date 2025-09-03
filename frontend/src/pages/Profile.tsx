import React, { useState, useEffect } from "react";
import {
  User,
  Users,
  Mail,
  Camera,
  Save,
  UserPlus,
  Trash2, // Ícone para deletar
  Plus,
  LogOut,
  LayoutDashboard,
  KeyRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";

// Definindo um tipo para o usuário, para melhor organização
interface UserData {
  id: string;
  nome: string;
  email: string;
  perfil: 'admin' | 'user';
}

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState("perfil");
  const userRole = localStorage.getItem('perfil') || sessionStorage.getItem('perfil');
  const navigate = useNavigate();

  // Estado para os dados do perfil
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [perfil, setPerfil] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Estado para a lista de usuários (admin)
  const [userList, setUserList] = useState<UserData[]>([]);

  const fetchUsers = async () => {
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setUserList(data);
      } else {
        throw new Error('Falha ao buscar a lista de usuários');
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao carregar a lista de usuários.');
    }
  };

  // Efeito para buscar dados do perfil do usuário logado
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      if (!token) {
        alert('Usuário não autenticado');
        navigate('/login');
        return;
      }
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setCurrentUserId(data.id);
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

  // Efeito para buscar a lista de usuários quando a aba for selecionada
  useEffect(() => {
    if (activeTab === 'usuarios') {
      fetchUsers();
    }
  }, [activeTab]);

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário? Esta ação é irreversível.')) {
        const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (res.ok) {
                alert(data.message || 'Usuário excluído com sucesso!');
                fetchUsers(); // Atualiza a lista
            } else {
                throw new Error(data.message || 'Falha ao excluir usuário');
            }
        } catch (error) {
            console.error(error);
            alert((error as Error).message);
        }
    }
  };

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
        navigate("/dashboard?modal=movimentacao");
        break;
      case "perfil":
        navigate("/profile");
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
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/profile`, {
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
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users`, {
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
      fetchUsers();
    } else {
      alert('Erro ao criar usuário');
    }
  };

  return (
    <div className="settings-page">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-container">
            <img src="/public/img/logo.png" alt="Logo" className="logo-img" />
          </div>
          <div className="nav-buttons">
            <button className="btn" onClick={() => handleNavigation("dashboard")}>
              <LayoutDashboard className="icon" /> Dashboard
            </button>
            <button className="btn" onClick={() => handleNavigation("nova-movimentacao")}>
              <Plus className="icon" /> Nova movimentação
            </button>
            <button className="btn btn-active" onClick={() => handleNavigation("perfil")}>
              <User className="icon" /> Perfil
            </button>
            <button className="btn-icon" aria-label="Sair" title="Sair" onClick={() => handleNavigation("sair")}>
              <LogOut className="icon" />
            </button>
          </div>
        </div>
      </header>

      <div className="settings-container">
        <div className="card">
          <div className="settings-header">
            <h1 className="settings-title">Meu Perfil</h1>
            <div className="settings-tabs">
              <button className={activeTab === "perfil" ? "active" : ""} onClick={() => setActiveTab("perfil")}>
                <User size={20} /> Perfil
              </button>
              {userRole === 'admin' && (
                <>
                  <button className={activeTab === "usuarios" ? "active" : ""} onClick={() => setActiveTab("usuarios")}>
                    <Users size={20} /> Usuários
                  </button>
                  <button className={activeTab === "novo" ? "active" : ""} onClick={() => setActiveTab("novo")}>
                    <UserPlus size={20} /> Novo Usuário
                  </button>
                </>
              )}
            </div>
          </div>

          <p className="settings-subtitle">Gerencie suas informações e preferências da conta</p>

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
                    <input id="file-upload" type="file" accept="image/*" onChange={handleImageChange} />
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Nome de Usuário</label>
                      <div className="input-icon">
                        <User size={20} />
                        <input type="text" placeholder="Digite seu nome" value={nome} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNome(e.target.value)} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <div className="input-icon">
                        <Mail size={20} />
                        <input type="email" placeholder="exemplo@gmail.com" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />
                      </div>
                    </div>
                    <div className="form-group full">
                      <label htmlFor="perfil-input">Nível</label>
                      <input id="perfil-input" type="text" value={perfil === 'admin' ? 'ADMIN' : 'FUNCIONÁRIO'} disabled />
                    </div>
                  </div>
                </div>
                <button className="save-btn" onClick={handleSaveProfile}>
                  <Save size={20} /> Salvar Alterações
                </button>
              </>
            )}

            {activeTab === "usuarios" && (
                <>
                    <h2>Lista de Usuários</h2>
                    <div className="user-list-container">
                        <table className="user-list-table">
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Email</th>
                                    <th>Perfil</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userList.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.nome}</td>
                                        <td>{user.email}</td>
                                        <td>{user.perfil === 'admin' ? 'Admin' : 'Funcionário'}</td>
                                        <td>
                                            {currentUserId && user.id !== currentUserId && user.nome.toLowerCase() !== 'cândido' && (
                                                <button type="button" aria-label="Excluir usuário" className="delete-btn" onClick={() => handleDeleteUser(user.id)}>
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {activeTab === "novo" && (
              <>
                <h2>Criar Novo Usuário</h2>
                <div className="form-group">
                  <label>Nome do Usuário</label>
                  <div className="input-icon">
                    <User size={20} />
                    <input type="text" placeholder="Digite o nome do usuário" value={novoNome} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNovoNome(e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <div className="input-icon">
                    <Mail size={20} />
                    <input type="email" placeholder="Digite o email do usuário" value={novoEmail} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNovoEmail(e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Senha</label>
                  <div className="input-icon">
                    <KeyRound size={20} />
                    <input type="password" placeholder="Defina uma senha" value={novoSenha} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNovoSenha(e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="novo-perfil-select">Nível</label>
                  <select id="novo-perfil-select" value={novoPerfil} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNovoPerfil(e.target.value)}>
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