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
      community: {
        Row: {
          community_description: string | null;
          community_name: string;
          created_at: string | null;
          created_by: string | null;
          id: number;
        };
        Insert: {
          community_description?: string | null;
          community_name: string;
          created_at?: string | null;
          created_by?: string | null;
          id?: number;
        };
        Update: {
          community_description?: string | null;
          community_name?: string;
          created_at?: string | null;
          created_by?: string | null;
          id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "community_created_by_fkey";
            columns: ["created_by"];
            referencedRelation: "user_profile";
            referencedColumns: ["id"];
          }
        ];
      };
      post: {
        Row: {
          created_at: string | null;
          id: number;
          post_content: string;
          post_title: string;
          posting_user_id: string;
          posted_in: number;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          post_content: string;
          post_title: string;
          posting_user_id: string;
          posted_in: number;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          post_content?: string;
          post_title?: string;
          posting_user_id?: string;
          posted_in?: number;
        };
        Relationships: [
          {
            foreignKeyName: "post_posting_user_id_fkey";
            columns: ["posting_user_id"];
            referencedRelation: "user_profile";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "post_posted_in_fkey";
            columns: ["posted_in"];
            referencedRelation: "community";
            referencedColumns: ["id"];
          }
        ];
      };
      profile: {
        Row: {
          id: string;
          username: string | null;
        };
        Insert: {
          id: string;
          username?: string | null;
        };
        Update: {
          id?: string;
          username?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profile_id_fkey";
            columns: ["id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      profile_community: {
        Row: {
          community_id: number;
          user_id: string;
        };
        Insert: {
          community_id: number;
          user_id: string;
        };
        Update: {
          community_id?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profile_community_community_id_fkey";
            columns: ["community_id"];
            referencedRelation: "community";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "profile_community_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profile";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
