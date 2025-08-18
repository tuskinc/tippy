export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          email: string
          full_name: string | null
          avatar_url: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          created_at?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          updated_at?: string | null
        }
      }
      crafts: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string
          price: number
          image_url: string | null
          artisan_id: string
          category: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description: string
          price: number
          image_url?: string | null
          artisan_id: string
          category: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string
          price?: number
          image_url?: string | null
          artisan_id?: string
          category?: string
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 