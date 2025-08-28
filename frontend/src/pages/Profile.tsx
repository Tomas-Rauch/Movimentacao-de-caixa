import React, { useState } from "react";
import { User, Lock, Mail, Camera, Save, UserPlus, KeyRound } from "lucide-react";
import "../styles/Profile.css";

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState("perfil");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="settings-container">
      <h1 className="settings-title">Configurações:</h1>
      <p className="settings-subtitle">Gerencie suas preferências e configurações da conta</p>

      <div className="settings-layout">
        <div className="settings-menu">
          <button
            className={activeTab === "perfil" ? "active" : ""}
            onClick={() => setActiveTab("perfil")}
          >
            <User size={18} /> Perfil
          </button>
          <button
            className={activeTab === "senha" ? "active" : ""}
            onClick={() => setActiveTab("senha")}
          >
            <Lock size={18} /> Segurança
          </button>
          <button
            className={activeTab === "novo" ? "active" : ""}
            onClick={() => setActiveTab("novo")}
          >
            <UserPlus size={18} /> Novo Usuário
          </button>
        </div>

        <div className="settings-content">
          {activeTab === "perfil" && (
            <div className="card">
              <h2>Informações do Perfil</h2>
              <div className="image-upload">
                <label htmlFor="file-upload">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" />
                  ) : (
                    <div className="placeholder">
                      <Camera size={28} />
                      <span>Editar Imagem de Perfil</span>
                    </div>
                  )}
                </label>
                <input id="file-upload" type="file" accept="image/*" onChange={handleImageChange} />
              </div>

              <label>Nome de Usuário:</label>
              <div className="input-icon">
                <User size={18} />
                <input type="text" placeholder="Digite seu nome" />
              </div>

              <label>Email:</label>
              <div className="input-icon">
                <Mail size={18} />
                <input type="email" placeholder="exemplo@gmail.com" />
              </div>

              <label>Nível:</label>
              <input type="text" value="ADMIN" disabled />

              <button className="save-btn">
                <Save size={18} /> Salvar Alterações
              </button>
            </div>
          )}

          {activeTab === "senha" && (
            <div className="card">
              <h2>Alterar Senha</h2>

              <label>Senha Atual:</label>
              <div className="input-icon">
                <KeyRound size={18} />
                <input type="password" placeholder="Digite sua senha atual" />
              </div>

              <label>Nova Senha:</label>
              <div className="input-icon">
                <KeyRound size={18} />
                <input type="password" placeholder="Digite sua nova senha" />
              </div>

              <label>Confirmar Nova Senha:</label>
              <div className="input-icon">
                <KeyRound size={18} />
                <input type="password" placeholder="Confirme sua nova senha" />
              </div>

              <button className="save-btn">
                <Save size={18} /> Alterar Senha
              </button>
            </div>
          )}

          {activeTab === "novo" && (
            <div className="card">
              <h2>Criar Novo Usuário</h2>

              <label>Nome do Usuário:</label>
              <div className="input-icon">
                <User size={18} />
                <input type="text" placeholder="Digite o nome do usuário" />
              </div>

              <label>Email:</label>
              <div className="input-icon">
                <Mail size={18} />
                <input type="email" placeholder="Digite o email do usuário" />
              </div>

              <label>Senha:</label>
              <div className="input-icon">
                <KeyRound size={18} />
                <input type="password" placeholder="Defina uma senha" />
              </div>

              <button className="save-btn">
                <UserPlus size={18} /> Criar Usuário
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
