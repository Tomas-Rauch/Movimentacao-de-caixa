import { supabase } from '../database/supabaseClient';

export class MovimentacaoService {
  static async listarMovimentacoes() {
    const { data, error } = await supabase
      .from('movimentacoes')
      .select('*, categorias(nome)')
      .order('data', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }

  static async criarMovimentacao(mov: any) {
    const { data, error } = await supabase
      .from('movimentacoes')
      .insert([mov])
      .select('*, categorias(nome)')
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  static async atualizarMovimentacao(id: number, mov: any) {
    const { data, error } = await supabase
      .from('movimentacoes')
      .update(mov)
      .eq('id', id)
      .select('*, categorias(nome)')
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  static async deletarMovimentacao(id: number) {
    const { error } = await supabase
      .from('movimentacoes')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
    return true;
  }

  static async listarCategorias() {
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .order('nome', { ascending: true });

    if (error) throw new Error(error.message);
    return data;
  }
}