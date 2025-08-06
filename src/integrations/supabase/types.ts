export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      consentimento_responsavel: {
        Row: {
          aluno_nome: string
          ativo: boolean
          data_consentimento: string
          escola_id: string
          hash_assinatura: string
          id: string
          ip_address: string
          responsavel_cpf: string
          responsavel_nome: string
          user_agent: string
        }
        Insert: {
          aluno_nome: string
          ativo?: boolean
          data_consentimento?: string
          escola_id: string
          hash_assinatura: string
          id?: string
          ip_address: string
          responsavel_cpf: string
          responsavel_nome: string
          user_agent: string
        }
        Update: {
          aluno_nome?: string
          ativo?: boolean
          data_consentimento?: string
          escola_id?: string
          hash_assinatura?: string
          id?: string
          ip_address?: string
          responsavel_cpf?: string
          responsavel_nome?: string
          user_agent?: string
        }
        Relationships: []
      }
      escolas: {
        Row: {
          codigo_acesso: string
          created_at: string
          email_admin: string
          id: string
          nome: string
          senha_admin: string
        }
        Insert: {
          codigo_acesso: string
          created_at?: string
          email_admin: string
          id?: string
          nome: string
          senha_admin: string
        }
        Update: {
          codigo_acesso?: string
          created_at?: string
          email_admin?: string
          id?: string
          nome?: string
          senha_admin?: string
        }
        Relationships: []
      }
      logs: {
        Row: {
          acao: string
          detalhes: Json | null
          escola_id: string | null
          id: string
          ip_address: string | null
          timestamp: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          acao: string
          detalhes?: Json | null
          escola_id?: string | null
          id?: string
          ip_address?: string | null
          timestamp?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          acao?: string
          detalhes?: Json | null
          escola_id?: string | null
          id?: string
          ip_address?: string | null
          timestamp?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      respostas_quiz: {
        Row: {
          aluno_nome: string
          data_envio: string
          encaminhado: boolean
          escola_id: string
          id: string
          pontuacao: number
          respostas: Json
          resultado: string
          serie_id: string | null
        }
        Insert: {
          aluno_nome: string
          data_envio?: string
          encaminhado?: boolean
          escola_id: string
          id?: string
          pontuacao: number
          respostas: Json
          resultado: string
          serie_id?: string | null
        }
        Update: {
          aluno_nome?: string
          data_envio?: string
          encaminhado?: boolean
          escola_id?: string
          id?: string
          pontuacao?: number
          respostas?: Json
          resultado?: string
          serie_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "respostas_quiz_escola_id_fkey"
            columns: ["escola_id"]
            isOneToOne: false
            referencedRelation: "escolas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "respostas_quiz_serie_id_fkey"
            columns: ["serie_id"]
            isOneToOne: false
            referencedRelation: "series"
            referencedColumns: ["id"]
          },
        ]
      }
      series: {
        Row: {
          ativa: boolean
          created_at: string
          escola_id: string
          id: string
          nome: string
        }
        Insert: {
          ativa?: boolean
          created_at?: string
          escola_id: string
          id?: string
          nome: string
        }
        Update: {
          ativa?: boolean
          created_at?: string
          escola_id?: string
          id?: string
          nome?: string
        }
        Relationships: [
          {
            foreignKeyName: "series_escola_id_fkey"
            columns: ["escola_id"]
            isOneToOne: false
            referencedRelation: "escolas"
            referencedColumns: ["id"]
          },
        ]
      }
      sessoes_monitoramento: {
        Row: {
          aluno_nome: string | null
          escola_id: string | null
          id: string
          ip_address: string
          tentativa_sucesso: boolean
          timestamp: string
          user_agent: string
        }
        Insert: {
          aluno_nome?: string | null
          escola_id?: string | null
          id?: string
          ip_address: string
          tentativa_sucesso: boolean
          timestamp?: string
          user_agent: string
        }
        Update: {
          aluno_nome?: string | null
          escola_id?: string | null
          id?: string
          ip_address?: string
          tentativa_sucesso?: boolean
          timestamp?: string
          user_agent?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      hash_sensitive_data: {
        Args: { data: string }
        Returns: string
      }
      log_action: {
        Args: {
          p_user_id?: string
          p_escola_id?: string
          p_acao?: string
          p_detalhes?: Json
          p_ip_address?: string
          p_user_agent?: string
        }
        Returns: undefined
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
