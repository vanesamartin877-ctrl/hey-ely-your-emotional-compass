export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      alerts: {
        Row: {
          category: string
          created_at: string
          id: string
          institution_id: string
          notes: string | null
          risk_level: string
          status: Database["public"]["Enums"]["alert_status"]
          student_user_id: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          institution_id: string
          notes?: string | null
          risk_level: string
          status?: Database["public"]["Enums"]["alert_status"]
          student_user_id: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          institution_id?: string
          notes?: string | null
          risk_level?: string
          status?: Database["public"]["Enums"]["alert_status"]
          student_user_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "alerts_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      avatars: {
        Row: {
          config: Json
          unlocked_items: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          config?: Json
          unlocked_items?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          config?: Json
          unlocked_items?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      game_sessions: {
        Row: {
          game_key: string
          id: string
          played_at: string
          score: number
          user_id: string
          xp_earned: number
        }
        Insert: {
          game_key: string
          id?: string
          played_at?: string
          score?: number
          user_id: string
          xp_earned?: number
        }
        Update: {
          game_key?: string
          id?: string
          played_at?: string
          score?: number
          user_id?: string
          xp_earned?: number
        }
        Relationships: []
      }
      institutions: {
        Row: {
          admin_user_id: string
          city: string
          created_at: string
          department: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          admin_user_id: string
          city: string
          created_at?: string
          department: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          admin_user_id?: string
          city?: string
          created_at?: string
          department?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      mission_progress: {
        Row: {
          completed_at: string
          id: string
          mission_id: string
          period_key: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          id?: string
          mission_id: string
          period_key: string
          user_id: string
        }
        Update: {
          completed_at?: string
          id?: string
          mission_id?: string
          period_key?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mission_progress_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
        ]
      }
      missions: {
        Row: {
          active: boolean
          category: string | null
          created_at: string
          description: string
          frequency: Database["public"]["Enums"]["mission_frequency"]
          id: string
          title: string
          xp_reward: number
        }
        Insert: {
          active?: boolean
          category?: string | null
          created_at?: string
          description: string
          frequency: Database["public"]["Enums"]["mission_frequency"]
          id?: string
          title: string
          xp_reward?: number
        }
        Update: {
          active?: boolean
          category?: string | null
          created_at?: string
          description?: string
          frequency?: Database["public"]["Enums"]["mission_frequency"]
          id?: string
          title?: string
          xp_reward?: number
        }
        Relationships: []
      }
      news: {
        Row: {
          admin_user_id: string
          body: string
          created_at: string
          id: string
          institution_id: string
          published: boolean
          title: string
        }
        Insert: {
          admin_user_id: string
          body: string
          created_at?: string
          id?: string
          institution_id: string
          published?: boolean
          title: string
        }
        Update: {
          admin_user_id?: string
          body?: string
          created_at?: string
          id?: string
          institution_id?: string
          published?: boolean
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "news_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      pets: {
        Row: {
          accessories: Json
          active_pet: string
          pet_level: number
          unlocked_pets: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          accessories?: Json
          active_pet?: string
          pet_level?: number
          unlocked_pets?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          accessories?: Json
          active_pet?: string
          pet_level?: number
          unlocked_pets?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          course: string | null
          created_at: string
          email: string | null
          full_name: string
          grade: string | null
          id: string
          institution_id: string | null
          last_active_at: string | null
          level: number
          position: string | null
          streak_days: number
          updated_at: string
          user_type: Database["public"]["Enums"]["user_type"]
          xp: number
        }
        Insert: {
          age?: number | null
          course?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          grade?: string | null
          id: string
          institution_id?: string | null
          last_active_at?: string | null
          level?: number
          position?: string | null
          streak_days?: number
          updated_at?: string
          user_type: Database["public"]["Enums"]["user_type"]
          xp?: number
        }
        Update: {
          age?: number | null
          course?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          grade?: string | null
          id?: string
          institution_id?: string | null
          last_active_at?: string | null
          level?: number
          position?: string | null
          streak_days?: number
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"]
          xp?: number
        }
        Relationships: [
          {
            foreignKeyName: "profiles_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      resource_favorites: {
        Row: {
          created_at: string
          resource_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          resource_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          resource_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "resource_favorites_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
      resources: {
        Row: {
          category: string
          content_body: string | null
          content_type: string
          content_url: string | null
          cover_emoji: string | null
          created_at: string
          description: string | null
          id: string
          title: string
        }
        Insert: {
          category: string
          content_body?: string | null
          content_type: string
          content_url?: string | null
          cover_emoji?: string | null
          created_at?: string
          description?: string | null
          id?: string
          title: string
        }
        Update: {
          category?: string
          content_body?: string | null
          content_type?: string
          content_url?: string | null
          cover_emoji?: string | null
          created_at?: string
          description?: string | null
          id?: string
          title?: string
        }
        Relationships: []
      }
      survey_responses: {
        Row: {
          answers: Json
          id: string
          submitted_at: string
          survey_id: string
          user_id: string
        }
        Insert: {
          answers?: Json
          id?: string
          submitted_at?: string
          survey_id: string
          user_id: string
        }
        Update: {
          answers?: Json
          id?: string
          submitted_at?: string
          survey_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "survey_responses_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "surveys"
            referencedColumns: ["id"]
          },
        ]
      }
      surveys: {
        Row: {
          admin_user_id: string
          category: string | null
          created_at: string
          description: string | null
          id: string
          institution_id: string
          published: boolean
          questions: Json
          title: string
        }
        Insert: {
          admin_user_id: string
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          institution_id: string
          published?: boolean
          questions?: Json
          title: string
        }
        Update: {
          admin_user_id?: string
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          institution_id?: string
          published?: boolean
          questions?: Json
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "surveys_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      alert_status: "pending" | "in_progress" | "attended" | "closed"
      app_role: "admin" | "student" | "natural"
      mission_frequency: "daily" | "weekly" | "monthly"
      user_type: "admin" | "student" | "natural"
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
    Enums: {
      alert_status: ["pending", "in_progress", "attended", "closed"],
      app_role: ["admin", "student", "natural"],
      mission_frequency: ["daily", "weekly", "monthly"],
      user_type: ["admin", "student", "natural"],
    },
  },
} as const
