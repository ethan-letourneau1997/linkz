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
      comment: {
        Row: {
          comment_content: string
          commenting_user_id: string
          created_at: string | null
          id: number
          parent_comment_id: number | null
          root_post: number
        }
        Insert: {
          comment_content: string
          commenting_user_id: string
          created_at?: string | null
          id?: number
          parent_comment_id?: number | null
          root_post: number
        }
        Update: {
          comment_content?: string
          commenting_user_id?: string
          created_at?: string | null
          id?: number
          parent_comment_id?: number | null
          root_post?: number
        }
        Relationships: [
          {
            foreignKeyName: "comment_commenting_user_id_fkey"
            columns: ["commenting_user_id"]
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_root_post_fkey"
            columns: ["root_post"]
            referencedRelation: "post"
            referencedColumns: ["id"]
          }
        ]
      }
      community: {
        Row: {
          community_description: string | null
          community_name: string
          created_at: string | null
          creator_user_id: string | null
          id: number
        }
        Insert: {
          community_description?: string | null
          community_name: string
          created_at?: string | null
          creator_user_id?: string | null
          id?: number
        }
        Update: {
          community_description?: string | null
          community_name?: string
          created_at?: string | null
          creator_user_id?: string | null
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "community_creator_user_id_fkey"
            columns: ["creator_user_id"]
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          }
        ]
      }
      post: {
        Row: {
          community_id: number
          created_at: string | null
          id: number
          is_image: boolean | null
          post_content: string
          post_title: string
          posting_user_id: string
        }
        Insert: {
          community_id: number
          created_at?: string | null
          id?: number
          is_image?: boolean | null
          post_content: string
          post_title: string
          posting_user_id: string
        }
        Update: {
          community_id?: number
          created_at?: string | null
          id?: number
          is_image?: boolean | null
          post_content?: string
          post_title?: string
          posting_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_community_id_fkey"
            columns: ["community_id"]
            referencedRelation: "community"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_posting_user_id_fkey"
            columns: ["posting_user_id"]
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          }
        ]
      }
      user_comment_vote: {
        Row: {
          comment_id: number
          user_vote: number
          voter_id: string
        }
        Insert: {
          comment_id: number
          user_vote: number
          voter_id: string
        }
        Update: {
          comment_id?: number
          user_vote?: number
          voter_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_comment_vote_comment_id_fkey"
            columns: ["comment_id"]
            referencedRelation: "comment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_comment_vote_voter_id_fkey"
            columns: ["voter_id"]
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          }
        ]
      }
      user_community: {
        Row: {
          community_id: number
          user_id: string
        }
        Insert: {
          community_id: number
          user_id: string
        }
        Update: {
          community_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_community_community_id_fkey"
            columns: ["community_id"]
            referencedRelation: "community"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_community_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          }
        ]
      }
      user_image: {
        Row: {
          image_path: string
          user_id: string
        }
        Insert: {
          image_path: string
          user_id: string
        }
        Update: {
          image_path?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_image_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          }
        ]
      }
      user_post_vote: {
        Row: {
          created_at: string | null
          post_id: number
          user_vote: number
          voter_id: string
        }
        Insert: {
          created_at?: string | null
          post_id: number
          user_vote?: number
          voter_id: string
        }
        Update: {
          created_at?: string | null
          post_id?: number
          user_vote?: number
          voter_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_post_vote_post_id_fkey"
            columns: ["post_id"]
            referencedRelation: "post"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_post_vote_voter_id_fkey"
            columns: ["voter_id"]
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          }
        ]
      }
      user_profile: {
        Row: {
          id: string
          username: string
        }
        Insert: {
          id: string
          username: string
        }
        Update: {
          id?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profile_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
