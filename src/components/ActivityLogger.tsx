
import { supabase } from '@/integrations/supabase/client';

export class ActivityLogger {
  static async logActivity(tipo: string, descricao: string, referenciaId?: string) {
    try {
      const { error } = await supabase
        .from('atividades')
        .insert({
          tipo,
          descricao,
          referencia_id: referenciaId
        });

      if (error) {
        console.error('Erro ao registrar atividade:', error);
      }
    } catch (error) {
      console.error('Erro ao registrar atividade:', error);
    }
  }

  static async logNewOS(numeroOS: string, cliente: string) {
    await this.logActivity('nova_os', `Nova OS #${numeroOS} - ${cliente}`, numeroOS);
  }

  static async logCompletedOS(numeroOS: string, cliente: string) {
    await this.logActivity('os_finalizada', `OS #${numeroOS} finalizada - ${cliente}`, numeroOS);
  }

  static async logLowStock(item: string, quantidade: number) {
    await this.logActivity('estoque_baixo', `Estoque baixo: ${item} - ${quantidade} unidades`, item);
  }

  static async logNewClient(clienteNome: string) {
    await this.logActivity('novo_cliente', `Novo cliente cadastrado: ${clienteNome}`, clienteNome);
  }
}
