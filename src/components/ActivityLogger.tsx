
import { supabase } from '@/integrations/supabase/client';

export class ActivityLogger {
  static async logActivity(tipo: string, descricao: string, referenciaId?: string, usuario?: string) {
    try {
      const payload = {
        tipo,
        descricao,
        referencia_id: referenciaId,
        usuario_nome: usuario ?? null,
      };
      const { error } = await supabase
        .from('atividades')
        .insert(payload);

      if (error) {
        console.error('Erro ao registrar atividade:', error);
      }
    } catch (error) {
      console.error('Erro ao registrar atividade:', error);
    }
  }

  static async logNewOS(numeroOS: string, cliente: string, usuario?: string) {
    await this.logActivity(
      'nova_os',
      `Nova OS #${numeroOS} - ${cliente}`,
      numeroOS,
      usuario
    );
  }

  static async logEditOS(numeroOS: string, cliente: string, usuario?: string) {
    await this.logActivity(
      'editar_os',
      `OS #${numeroOS} editada - ${cliente}`,
      numeroOS,
      usuario
    );
  }

  static async logCompletedOS(numeroOS: string, cliente: string, usuario?: string) {
    await this.logActivity(
      'os_finalizada',
      `OS #${numeroOS} finalizada - ${cliente}`,
      numeroOS,
      usuario
    );
  }

  static async logLowStock(item: string, quantidade: number, usuario?: string) {
    await this.logActivity(
      'estoque_baixo',
      `Estoque baixo: ${item} - ${quantidade} unidades`,
      item,
      usuario
    );
  }

  static async logStockUpdate(item: string, tipo: string, usuario?: string) {
    await this.logActivity(
      'estoque_atualizado',
      `Item de estoque ${item} foi ${tipo}`,
      item,
      usuario
    );
  }

  static async logNewClient(clienteNome: string, usuario?: string) {
    await this.logActivity(
      'novo_cliente',
      `Novo cliente cadastrado: ${clienteNome}`,
      clienteNome,
      usuario
    );
  }
}
