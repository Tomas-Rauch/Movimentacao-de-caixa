import { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Search, Plus, User, ArrowUp, ArrowDown, LayoutDashboard, LogOut } from 'lucide-react';
import Modal from './Modal'; // Importar o componente Modal
import '../styles/Dashboard.css';

interface Movimentacao {
  date: string;
  description: string;
  type: string;
  category: string;
  docs: string;
  value: string;
}

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('Todas');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [activeSection, setActiveSection] = useState('Dashboard'); 
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar o modal

  const handleNovaMovimentacao = () => {
    setIsModalOpen(true); // Abrir o modal ao clicar no botão
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Fechar o modal
  };

  const handleSaveMovimentacao = (data: any) => {
    // Aqui você pode processar os dados da movimentação
    console.log('Dados da movimentação:', data);
    
    // Fechar o modal após salvar
    setIsModalOpen(false);
    
    // Aqui você pode adicionar a lógica para salvar no backend
    // ou atualizar o estado local das movimentações
  };

  const chartData = [
    { month: 'Jan', entradas: 20000, saidas: 8000 },
    { month: 'Fev', entradas: 12000, saidas: 15000 },
    { month: 'Mar', entradas: 25000, saidas: 7000 },
    { month: 'Abr', entradas: 18000, saidas: 12000 },
    { month: 'Mai', entradas: 30000, saidas: 10000 },
    { month: 'Jun', entradas: 22000, saidas: 18000 }
  ];

  const movimentacoes: Movimentacao[] = [
    { date: '24/06/2025', description: 'Frete transporte', type: 'saida', category: 'Veiculos Frete', docs: '46547547', value: '100,00' },
    { date: '23/06/2025', description: 'Venda em promoção', type: 'entrada', category: 'Vendas', docs: '57547357', value: '100,00' },
    { date: '22/06/2025', description: 'Combustível', type: 'saida', category: 'Veiculos Frete', docs: '46547548', value: '200,00' },
    { date: '21/06/2025', description: 'Venda produto', type: 'entrada', category: 'Vendas', docs: '57547358', value: '350,00' }
  ];

  const filteredMovimentacoes = movimentacoes.filter(mov => {
    const matchesSearch = mov.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mov.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'Todas' || mov.type === selectedType;
    const matchesCategory = selectedCategory === 'Todas' || mov.category === selectedCategory;

    return matchesSearch && matchesType && matchesCategory;
  });

  const totalEntradas = movimentacoes
    .filter(mov => mov.type === 'entrada')
    .reduce((sum, mov) => sum + parseFloat(mov.value.replace(',', '.')), 0);

  const totalSaidas = movimentacoes
    .filter(mov => mov.type === 'saida')
    .reduce((sum, mov) => sum + parseFloat(mov.value.replace(',', '.')), 0);

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
            <button className="btn">
              <User className="icon" /> Perfil
            </button>
            <button className="btn-icon"><LogOut className="icon" /></button>
          </div>
        </div>
      </header>

      {/* Main Content */}
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
                  <AreaChart data={chartData}>
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
                    <label>Tipo:</label>
                    <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                      <option value="Todas">Todas</option>
                      <option value="entrada">Entradas</option>
                      <option value="saida">Saídas</option>
                    </select>
                  </div>
                  <div className="filter">
                    <label>Categoria:</label>
                    <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                      <option value="Todas">Todas</option>
                      <option value="Vendas">Vendas</option>
                      <option value="Veiculos Frete">Veículos Frete</option>
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
                      <th>Docs</th>
                      <th>Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMovimentacoes.map((mov, index) => (
                      <tr key={index}>
                        <td>{mov.date}</td>
                        <td>
                          <div className="desc">
                            {mov.type === 'entrada' ? (
                              <ArrowUp className="small green" />
                            ) : (
                              <ArrowDown className="small red" />
                            )}
                            <div>
                              <div className="text">{mov.description}</div>
                              <div className="subtext">{mov.category}</div>
                            </div>
                          </div>
                        </td>
                        <td>{mov.docs}</td>
                        <td className={mov.type === 'entrada' ? 'green' : 'red'}>
                          {mov.type === 'entrada' ? '+' : '-'}R$ {mov.value}
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

      {/* Modal - Renderizado condicionalmente */}
      {isModalOpen && (
        <Modal
          onClose={handleCloseModal}
          onSave={handleSaveMovimentacao}
        />
      )}
    </div>
  );
};

export default Dashboard;