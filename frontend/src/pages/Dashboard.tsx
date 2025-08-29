import { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Search, Plus, User, ArrowUp, ArrowDown, LayoutDashboard, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';   // 👈 Import para navegação
import Modal from './Modal';
import '../styles/Dashboard.css';
import { getMovimentacoes, createMovimentacao } from '../services/movimentacaoApi';

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('Todas');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [activeSection, setActiveSection] = useState('Dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [movimentacoes, setMovimentacoes] = useState<any[]>([]);
  const [token, setToken] = useState('');

  const navigate = useNavigate(); // 👈 Hook de navegação

  useEffect(() => {
    const t = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    if (t) setToken(t);
  }, []);

  useEffect(() => {
    if (token) {
      getMovimentacoes(token).then(setMovimentacoes);
    }
  }, [token]);

  const handleNovaMovimentacao = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveMovimentacao = async (data: any) => {
    if (!token) return;
    const nova = await createMovimentacao(data, token);
    setMovimentacoes([nova, ...movimentacoes]);
    setIsModalOpen(false);
  };

  const filteredMovimentacoes = movimentacoes.filter(mov => {
    const matchesSearch = mov.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mov.categorias?.nome?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'Todas' || mov.tipo === selectedType;
    const matchesCategory = selectedCategory === 'Todas' || mov.categorias?.nome === selectedCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  const totalEntradas = movimentacoes
    .filter(mov => mov.tipo === 'entrada')
    .reduce((sum, mov) => sum + parseFloat(mov.valor), 0);

  const totalSaidas = movimentacoes
    .filter(mov => mov.tipo === 'saida')
    .reduce((sum, mov) => sum + parseFloat(mov.valor), 0);

  const saldoAtual = totalEntradas - totalSaidas;

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-container">
            <img src="/public/img/logo.png" alt="Logo" className="logo-img" />
          </div>
          <div className="nav-buttons">
            <button 
              className={`btn ${activeSection === 'Dashboard' ? 'btn-active' : ''}`}
              onClick={() => setActiveSection('Dashboard')}
            >
              <LayoutDashboard className="icon" /> Dashboard
            </button>
            <button 
              className="btn"
              onClick={handleNovaMovimentacao}
            >
              <Plus className="icon" /> Nova movimentação
            </button>
            <button className="btn" onClick={() => navigate('/profile')}>
              <User className="icon" /> Perfil
            </button>
            <button className="btn-icon" aria-label="Sair" title="Sair"><LogOut className="icon" /></button>
          </div>
        </div>
      </header>
      <main className="dashboard-content">
        <div className="page-title">
          <h1>{activeSection}</h1>
          <p>
            {activeSection === 'Dashboard' && 'Visão geral de suas finanças.'}
            {activeSection === 'Perfil' && 'Gerencie suas informações pessoais.'}
          </p>
        </div>
        {activeSection === 'Dashboard' && (
          <>
            <div className="chart-wrapper">
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Area type="monotone" dataKey="entradas" stackId="1" stroke="#16a34a" fill="#16a34a" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="saidas" stackId="2" stroke="#dc2626" fill="#dc2626" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="cards-panel">
                <div className="card">
                  <div className="label">Saldo Atual</div>
                  <div className="value">{formatCurrency(saldoAtual)}</div>
                </div>
                <div className="card">
                  <div className="label-group">
                    <div className="label">Entradas</div>
                    <ArrowUp className="icon green" />
                  </div>
                  <div className="value green">{formatCurrency(totalEntradas)}</div>
                </div>
                <div className="card">
                  <div className="label-group">
                    <div className="label">Saídas</div>
                    <ArrowDown className="icon red" />
                  </div>
                  <div className="value red">{formatCurrency(totalSaidas)}</div>
                </div>
              </div>
            </div>
            <div className="history">
              <div className="history-header">
                <h2>Histórico de movimentações</h2>
                <div className="filters">
                  <div className="filter">
                    <label>Buscar:</label>
                    <div className="search-box">
                      <Search className="search" />
                      <input
                        type="text"
                        placeholder="Buscar por descrição ou categoria..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="filter">
                    <label htmlFor="tipo-select">Tipo:</label>
                    <select
                      id="tipo-select"
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                    >
                      <option value="Todas">Todas</option>
                      <option value="entrada">Entradas</option>
                      <option value="saida">Saídas</option>
                    </select>
                  </div>
                  <div className="filter">
                    <label htmlFor="categoria-select">Categoria:</label>
                    <select
                      id="categoria-select"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}>
                      <option value="Todas">Todas</option>
                      {/* Renderizar categorias dinamicamente se desejar */}
                      <option value="Vendas">Vendas</option>
                      <option value="Veiculos Frete">Veículos Frete</option>
                      <option value="Contas Fixas">Contas Fixas</option>
                      <option value="Alimentação">Alimentação</option>
                      <option value="Transporte">Transporte</option>
                      <option value="Outros">Outros</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Descrição</th>
                      <th>Categoria</th>
                      <th>Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMovimentacoes.map((mov, index) => (
                      <tr key={index}>
                        <td>{mov.data}</td>
                        <td>
                          <div className="desc">
                            {mov.tipo === 'entrada' ? (
                              <ArrowUp className="small green" />
                            ) : (
                              <ArrowDown className="small red" />
                            )}
                            <div>
                              <div className="text">{mov.descricao}</div>
                              <div className="subtext">{mov.categorias?.nome}</div>
                            </div>
                          </div>
                        </td>
                        <td>{mov.categorias?.nome}</td>
                        <td className={mov.tipo === 'entrada' ? 'green' : 'red'}>
                          {mov.tipo === 'entrada' ? '+' : '-'}R$ {parseFloat(mov.valor).toFixed(2).replace('.', ',')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
      {isModalOpen && (
        <Modal
          onClose={handleCloseModal}
          onSave={handleSaveMovimentacao}
          token={token}
        />
      )}
    </div>
  );
};

export default Dashboard;
