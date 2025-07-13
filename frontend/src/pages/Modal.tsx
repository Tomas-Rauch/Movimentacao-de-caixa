import React, { useState } from 'react';
import { X } from 'lucide-react';
import '../styles/Modal.css';

interface MovimentacaoData {
  valor: string;
  descricao: string;
  categoria: string;
  data: string;
  tipo: 'entrada' | 'saida';
}

interface ModalProps {
  onClose: () => void;
  onSave: (data: MovimentacaoData) => void;
}

const Modal: React.FC<ModalProps> = ({ onClose, onSave }) => {
  const [movementType, setMovementType] = useState<'entrada' | 'saida'>('entrada');
  const [formData, setFormData] = useState({
    valor: '',
    descricao: '',
    categoria: '',
    data: ''
  });

  const handleSave = () => {
    if (!formData.valor || !formData.descricao || !formData.categoria || !formData.data) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    onSave({ ...formData, tipo: movementType });
    setFormData({ valor: '', descricao: '', categoria: '', data: '' });
  };

  const handleClose = () => {
    setFormData({ valor: '', descricao: '', categoria: '', data: '' });
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <button className="modal-close-btn" onClick={handleClose} title="Fechar modal">
          <X size={20} />
        </button>

        <h2>Tipo de Movimentação</h2>

        <div className="btn-group">
          <button
            className={`btn-type ${movementType === 'entrada' ? 'active entrada' : ''}`}
            onClick={() => setMovementType('entrada')}
          >
            Entrada
            <div className="btn-subtext">Dinheiro recebido</div>
          </button>
          <button
            className={`btn-type ${movementType === 'saida' ? 'active saida' : ''}`}
            onClick={() => setMovementType('saida')}
          >
            Saída
            <div className="btn-subtext">Dinheiro gasto</div>
          </button>
        </div>

        <form
          className="form-movimentacao"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <div className="form-group">
            <label>Valor: *</label>
            <input
              type="text"
              placeholder="R$ 0,00"
              value={formData.valor}
              onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Descrição: *</label>
            <input
              type="text"
              placeholder="Ex: Pagamento da conta, compras do mercado"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="categoria-select">Categoria: *</label>
            <select
              id="categoria-select"
              title="Selecione a categoria da movimentação"
              value={formData.categoria}
              onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
              required
            >
              <option value="">Selecione uma categoria</option>
              <option value="Vendas">Vendas</option>
              <option value="Contas Fixas">Contas Fixas</option>
              <option value="Veiculos Frete">Veículos Frete</option>
              <option value="Alimentação">Alimentação</option>
              <option value="Transporte">Transporte</option>
              <option value="Outros">Outros</option>
            </select>
          </div>

          <div className="form-group">
            <label>Data: *</label>
            <input
              type="date"
              value={formData.data}
              onChange={(e) => setFormData({ ...formData, data: e.target.value })}
              required
              title="Selecione a data da movimentação"
              placeholder="Selecione a data"
            />
          </div>

          <div className="modal-buttons">
            <button
              type="button"
              className="btn-cancel"
              onClick={handleClose}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-save">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;