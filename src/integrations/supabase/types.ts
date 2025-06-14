export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      atividades: {
        Row: {
          created_at: string | null
          descricao: string
          id: string
          referencia_id: string | null
          tipo: string
        }
        Insert: {
          created_at?: string | null
          descricao: string
          id?: string
          referencia_id?: string | null
          tipo: string
        }
        Update: {
          created_at?: string | null
          descricao?: string
          id?: string
          referencia_id?: string | null
          tipo?: string
        }
        Relationships: []
      }
      clientes: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          email: string | null
          endereco: string | null
          id: string
          nome: string
          telefone: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          email?: string | null
          endereco?: string | null
          id?: string
          nome: string
          telefone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          email?: string | null
          endereco?: string | null
          id?: string
          nome?: string
          telefone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clientes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      CRM: {
        Row: {
          Agendamento: string | null
          CreatedAt: string | null
          Email: string | null
          Equipe: string | null
          Faturamento: string | null
          "Hora Messagem": string | null
          id: number
          Nicho: string | null
          Nome: string | null
          Pausado: boolean | null
          Resumo: string | null
          Status: string
          Telefone: number | null
        }
        Insert: {
          Agendamento?: string | null
          CreatedAt?: string | null
          Email?: string | null
          Equipe?: string | null
          Faturamento?: string | null
          "Hora Messagem"?: string | null
          id?: number
          Nicho?: string | null
          Nome?: string | null
          Pausado?: boolean | null
          Resumo?: string | null
          Status: string
          Telefone?: number | null
        }
        Update: {
          Agendamento?: string | null
          CreatedAt?: string | null
          Email?: string | null
          Equipe?: string | null
          Faturamento?: string | null
          "Hora Messagem"?: string | null
          id?: number
          Nicho?: string | null
          Nome?: string | null
          Pausado?: boolean | null
          Resumo?: string | null
          Status?: string
          Telefone?: number | null
        }
        Relationships: []
      }
      empresa_config: {
        Row: {
          created_at: string
          id: string
          nome_empresa: string
          tema_primario: string
          tema_secundario: string
          updated_at: string
          user_id: string
          webhook_url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          nome_empresa: string
          tema_primario: string
          tema_secundario: string
          updated_at?: string
          user_id: string
          webhook_url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          nome_empresa?: string
          tema_primario?: string
          tema_secundario?: string
          updated_at?: string
          user_id?: string
          webhook_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "empresa_config_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      estoque: {
        Row: {
          categoria: string | null
          created_at: string | null
          estoque_minimo: number | null
          id: string
          marca: string | null
          nome: string
          quantidade: number
          updated_at: string | null
          valor_total: number | null
          valor_unitario: number | null
        }
        Insert: {
          categoria?: string | null
          created_at?: string | null
          estoque_minimo?: number | null
          id?: string
          marca?: string | null
          nome: string
          quantidade?: number
          updated_at?: string | null
          valor_total?: number | null
          valor_unitario?: number | null
        }
        Update: {
          categoria?: string | null
          created_at?: string | null
          estoque_minimo?: number | null
          id?: string
          marca?: string | null
          nome?: string
          quantidade?: number
          updated_at?: string | null
          valor_total?: number | null
          valor_unitario?: number | null
        }
        Relationships: []
      }
      logs_atividades: {
        Row: {
          acao: string
          created_at: string | null
          descricao: string
          id: string
          ip_address: string | null
          usuario_id: string | null
        }
        Insert: {
          acao: string
          created_at?: string | null
          descricao: string
          id?: string
          ip_address?: string | null
          usuario_id?: string | null
        }
        Update: {
          acao?: string
          created_at?: string | null
          descricao?: string
          id?: string
          ip_address?: string | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "logs_atividades_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      ordens_servico: {
        Row: {
          cliente_id: string | null
          cliente_nome: string
          created_at: string | null
          dispositivo: string
          finalizada_em: string | null
          id: string
          numero_os: string
          observacoes: string | null
          status: string | null
          tecnico_responsavel: string
          tipo_reparo: string
          updated_at: string | null
          user_id: string | null
          valor: number | null
        }
        Insert: {
          cliente_id?: string | null
          cliente_nome: string
          created_at?: string | null
          dispositivo: string
          finalizada_em?: string | null
          id?: string
          numero_os: string
          observacoes?: string | null
          status?: string | null
          tecnico_responsavel: string
          tipo_reparo: string
          updated_at?: string | null
          user_id?: string | null
          valor?: number | null
        }
        Update: {
          cliente_id?: string | null
          cliente_nome?: string
          created_at?: string | null
          dispositivo?: string
          finalizada_em?: string | null
          id?: string
          numero_os?: string
          observacoes?: string | null
          status?: string | null
          tecnico_responsavel?: string
          tipo_reparo?: string
          updated_at?: string | null
          user_id?: string | null
          valor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ordens_servico_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ordens_servico_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      Tabela: {
        Row: {
          id: number
          name: string | null
          price: number | null
        }
        Insert: {
          id?: number
          name?: string | null
          price?: number | null
        }
        Update: {
          id?: number
          name?: string | null
          price?: number | null
        }
        Relationships: []
      }
      tecnicos: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          email: string | null
          id: string
          nome: string
          telefone: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          email?: string | null
          id?: string
          nome: string
          telefone?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          email?: string | null
          id?: string
          nome?: string
          telefone?: string | null
        }
        Relationships: []
      }
      usuarios: {
        Row: {
          ativo: boolean | null
          cargo: string
          created_at: string | null
          email: string
          id: string
          nome_completo: string
          senha_hash: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          cargo: string
          created_at?: string | null
          email: string
          id?: string
          nome_completo: string
          senha_hash: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          cargo?: string
          created_at?: string | null
          email?: string
          id?: string
          nome_completo?: string
          senha_hash?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      create_empresa_config: {
        Args: {
          p_user_id: string
          p_nome_empresa: string
          p_tema_primario: string
          p_tema_secundario: string
          p_webhook_url?: string
        }
        Returns: {
          id: string
          user_id: string
          nome_empresa: string
          tema_primario: string
          tema_secundario: string
          webhook_url: string
          created_at: string
          updated_at: string
        }[]
      }
      get_current_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_empresa_config: {
        Args: { p_user_id: string }
        Returns: {
          id: string
          user_id: string
          nome_empresa: string
          tema_primario: string
          tema_secundario: string
          webhook_url: string
          created_at: string
          updated_at: string
        }[]
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: unknown
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      update_empresa_config: {
        Args: {
          p_user_id: string
          p_nome_empresa: string
          p_tema_primario: string
          p_tema_secundario: string
          p_webhook_url?: string
        }
        Returns: {
          id: string
          user_id: string
          nome_empresa: string
          tema_primario: string
          tema_secundario: string
          webhook_url: string
          created_at: string
          updated_at: string
        }[]
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
