import { supabase } from './database/supabaseClient'
import 'dotenv/config'

async function testarConexao() {
  const { data, error } = await supabase.from('usuarios').select('*')

  if (error) {
    console.error('❌ Erro de conexão:', error.message)
  } else {
    console.log('✅ Conexão bem-sucedida! Dados:', data)
  }
}

testarConexao()