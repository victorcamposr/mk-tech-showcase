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
      admin_activities: {
        Row: {
          action_type: string
          created_at: string
          entity_id: string | null
          entity_title: string | null
          entity_type: string
          id: string
          user_name: string | null
        }
        Insert: {
          action_type: string
          created_at?: string
          entity_id?: string | null
          entity_title?: string | null
          entity_type: string
          id?: string
          user_name?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string
          entity_id?: string | null
          entity_title?: string | null
          entity_type?: string
          id?: string
          user_name?: string | null
        }
        Relationships: []
      }
      admin_profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          is_active: boolean
          name: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          name: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          name?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string | null
          content: string
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          meta_description: string | null
          meta_title: string | null
          published_at: string | null
          slug: string
          status: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          slug: string
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          slug?: string
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      contacts: {
        Row: {
          company: string | null
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          read: boolean
          updated_at: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          read?: boolean
          updated_at?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          read?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      fiscal_data: {
        Row: {
          arquivo_token_url: string | null
          certificado_digital_url: string | null
          contador_crc: string | null
          contador_nome: string | null
          contador_telefone: string | null
          created_at: string
          email_contador: string | null
          email_empresarial: string
          endereco_cidade: string
          endereco_complemento: string | null
          endereco_estado: string
          endereco_numero: string
          endereco_rua: string
          id: string
          nome_fantasia: string | null
          razao_social: string
          senha_certificado: string | null
          serie: string | null
          token_cupom_fiscal: string | null
          ultima_nfe: string | null
          ultimo_cupom_emitido: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          arquivo_token_url?: string | null
          certificado_digital_url?: string | null
          contador_crc?: string | null
          contador_nome?: string | null
          contador_telefone?: string | null
          created_at?: string
          email_contador?: string | null
          email_empresarial: string
          endereco_cidade: string
          endereco_complemento?: string | null
          endereco_estado: string
          endereco_numero: string
          endereco_rua: string
          id?: string
          nome_fantasia?: string | null
          razao_social: string
          senha_certificado?: string | null
          serie?: string | null
          token_cupom_fiscal?: string | null
          ultima_nfe?: string | null
          ultimo_cupom_emitido?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          arquivo_token_url?: string | null
          certificado_digital_url?: string | null
          contador_crc?: string | null
          contador_nome?: string | null
          contador_telefone?: string | null
          created_at?: string
          email_contador?: string | null
          email_empresarial?: string
          endereco_cidade?: string
          endereco_complemento?: string | null
          endereco_estado?: string
          endereco_numero?: string
          endereco_rua?: string
          id?: string
          nome_fantasia?: string | null
          razao_social?: string
          senha_certificado?: string | null
          serie?: string | null
          token_cupom_fiscal?: string | null
          ultima_nfe?: string | null
          ultimo_cupom_emitido?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      home_banners: {
        Row: {
          category_id: string | null
          created_at: string
          id: string
          image_url: string
          link_url: string | null
          sort_order: number | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          id?: string
          image_url: string
          link_url?: string | null
          sort_order?: number | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          id?: string
          image_url?: string
          link_url?: string | null
          sort_order?: number | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "home_banners_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_projects: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          image_url: string | null
          results: string[]
          sort_order: number | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          results?: string[]
          sort_order?: number | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          results?: string[]
          sort_order?: number | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      portfolio_stats: {
        Row: {
          created_at: string
          id: string
          key: string
          label: string
          sort_order: number | null
          status: string | null
          suffix: string | null
          updated_at: string
          value: number
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          label: string
          sort_order?: number | null
          status?: string | null
          suffix?: string | null
          updated_at?: string
          value: number
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          label?: string
          sort_order?: number | null
          status?: string | null
          suffix?: string | null
          updated_at?: string
          value?: number
        }
        Relationships: []
      }
      portfolio_testimonials: {
        Row: {
          author: string
          company: string
          content: string
          created_at: string
          id: string
          rating: number | null
          sort_order: number | null
          status: string | null
          updated_at: string
        }
        Insert: {
          author: string
          company: string
          content: string
          created_at?: string
          id?: string
          rating?: number | null
          sort_order?: number | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          author?: string
          company?: string
          content?: string
          created_at?: string
          id?: string
          rating?: number | null
          sort_order?: number | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      service_cards: {
        Row: {
          category_id: string | null
          created_at: string
          description: string
          email: string
          id: string
          logo_url: string
          phone: string
          sort_order: number | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description: string
          email: string
          id?: string
          logo_url: string
          phone: string
          sort_order?: number | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string
          email?: string
          id?: string
          logo_url?: string
          phone?: string
          sort_order?: number | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_cards_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      service_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          sort_order: number | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      solutions: {
        Row: {
          benefits: string[]
          card_image_url: string | null
          created_at: string
          description: string
          features: string[]
          hero_image_url: string | null
          icon_name: string
          id: string
          industries: string[]
          key: string
          sort_order: number | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          benefits?: string[]
          card_image_url?: string | null
          created_at?: string
          description: string
          features?: string[]
          hero_image_url?: string | null
          icon_name: string
          id?: string
          industries?: string[]
          key: string
          sort_order?: number | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          benefits?: string[]
          card_image_url?: string | null
          created_at?: string
          description?: string
          features?: string[]
          hero_image_url?: string | null
          icon_name?: string
          id?: string
          industries?: string[]
          key?: string
          sort_order?: number | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      user_role: "admin" | "super_admin"
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
    Enums: {
      user_role: ["admin", "super_admin"],
    },
  },
} as const
