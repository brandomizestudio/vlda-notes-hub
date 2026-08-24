export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          phone: string;
          role: 'student' | 'admin';
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          phone: string;
          role?: 'student' | 'admin';
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          phone?: string;
          role?: 'student' | 'admin';
          created_at?: string;
        };
      };
      batches: {
        Row: {
          id: string;
          title: string;
          subtitle: string;
          sort_order: number;
          is_active: boolean;
        };
        Insert: {
          id: string;
          title: string;
          subtitle: string;
          sort_order?: number;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          title?: string;
          subtitle?: string;
          sort_order?: number;
          is_active?: boolean;
        };
      };
      notes: {
        Row: {
          id: string;
          batch_id: string;
          tier: 'free' | 'paid';
          title: string;
          description: string | null;
          subject: string | null;
          language: string;
          pages: number;
          file_path: string;
          file_size: number;
          price_paise: number;
          pdf_password: string | null;
          sort_order: number;
          is_published: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          batch_id: string;
          tier: 'free' | 'paid';
          title: string;
          description?: string | null;
          subject?: string | null;
          language?: string;
          pages?: number;
          file_path: string;
          file_size?: number;
          price_paise?: number;
          pdf_password?: string | null;
          sort_order?: number;
          is_published?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          batch_id?: string;
          tier?: 'free' | 'paid';
          title?: string;
          description?: string | null;
          subject?: string | null;
          language?: string;
          pages?: number;
          file_path?: string;
          file_size?: number;
          price_paise?: number;
          pdf_password?: string | null;
          sort_order?: number;
          is_published?: boolean;
          created_at?: string;
        };
      };
      unlocks: {
        Row: {
          id: string;
          user_id: string;
          note_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          note_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          note_id?: string;
          created_at?: string;
        };
      };
      payment_requests: {
        Row: {
          id: string;
          user_id: string;
          note_id: string;
          utr: string;
          amount_paise: number;
          status: 'pending' | 'approved' | 'rejected';
          admin_note: string | null;
          created_at: string;
          decided_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          note_id: string;
          utr: string;
          amount_paise: number;
          status?: 'pending' | 'approved' | 'rejected';
          admin_note?: string | null;
          created_at?: string;
          decided_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          note_id?: string;
          utr?: string;
          amount_paise?: number;
          status?: 'pending' | 'approved' | 'rejected';
          admin_note?: string | null;
          created_at?: string;
          decided_at?: string | null;
        };
      };
      settings: {
        Row: {
          key: string;
          value: string;
        };
        Insert: {
          key: string;
          value: string;
        };
        Update: {
          key?: string;
          value?: string;
        };
      };
      download_log: {
        Row: {
          id: string;
          user_id: string;
          note_id: string;
          ip: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          note_id: string;
          ip?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          note_id?: string;
          ip?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      notes_public: {
        Row: {
          id: string;
          batch_id: string;
          tier: 'free' | 'paid';
          title: string;
          description: string | null;
          subject: string | null;
          language: string;
          pages: number;
          file_size: number;
          price_paise: number;
          sort_order: number;
          is_published: boolean;
          created_at: string;
        };
      };
    };
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Batch = Database['public']['Tables']['batches']['Row'];
export type Note = Database['public']['Tables']['notes']['Row'];
export type NotePublic = Database['public']['Views']['notes_public']['Row'];
export type Unlock = Database['public']['Tables']['unlocks']['Row'];
export type PaymentRequest = Database['public']['Tables']['payment_requests']['Row'];
export type Setting = Database['public']['Tables']['settings']['Row'];
