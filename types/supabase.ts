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
          created_at: string
          id: number
          parent_comment_id: number | null
          root_post: number
        }
        Insert: {
          comment_content: string
          commenting_user_id: string
          created_at?: string
          id?: number
          parent_comment_id?: number | null
          root_post: number
        }
        Update: {
          comment_content?: string
          commenting_user_id?: string
          created_at?: string
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
            foreignKeyName: "comment_commenting_user_id_fkey"
            columns: ["commenting_user_id"]
            referencedRelation: "post_comments"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "comment_commenting_user_id_fkey"
            columns: ["commenting_user_id"]
            referencedRelation: "post_details"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "comment_commenting_user_id_fkey"
            columns: ["commenting_user_id"]
            referencedRelation: "user_subscriptions"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "comment_root_post_fkey"
            columns: ["root_post"]
            referencedRelation: "post"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_root_post_fkey"
            columns: ["root_post"]
            referencedRelation: "post_comments_count"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "comment_root_post_fkey"
            columns: ["root_post"]
            referencedRelation: "post_details"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "comment_root_post_fkey"
            columns: ["root_post"]
            referencedRelation: "post_preview"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "comment_root_post_fkey"
            columns: ["root_post"]
            referencedRelation: "post_preview_plus_votes"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "comment_root_post_fkey"
            columns: ["root_post"]
            referencedRelation: "post_vote_count"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "comment_root_post_fkey"
            columns: ["root_post"]
            referencedRelation: "user_comment"
            referencedColumns: ["post_id"]
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
          },
          {
            foreignKeyName: "community_creator_user_id_fkey"
            columns: ["creator_user_id"]
            referencedRelation: "post_comments"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "community_creator_user_id_fkey"
            columns: ["creator_user_id"]
            referencedRelation: "post_details"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "community_creator_user_id_fkey"
            columns: ["creator_user_id"]
            referencedRelation: "user_subscriptions"
            referencedColumns: ["user_id"]
          }
        ]
      }
      conversation: {
        Row: {
          created_at: string | null
          id: number
          user1: string
          user2: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          user1: string
          user2: string
        }
        Update: {
          created_at?: string | null
          id?: number
          user1?: string
          user2?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_user1_fkey"
            columns: ["user1"]
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_user1_fkey"
            columns: ["user1"]
            referencedRelation: "post_comments"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "conversation_user1_fkey"
            columns: ["user1"]
            referencedRelation: "post_details"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "conversation_user1_fkey"
            columns: ["user1"]
            referencedRelation: "user_subscriptions"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "conversation_user2_fkey"
            columns: ["user2"]
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_user2_fkey"
            columns: ["user2"]
            referencedRelation: "post_comments"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "conversation_user2_fkey"
            columns: ["user2"]
            referencedRelation: "post_details"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "conversation_user2_fkey"
            columns: ["user2"]
            referencedRelation: "user_subscriptions"
            referencedColumns: ["user_id"]
          }
        ]
      }
      message: {
        Row: {
          content: string
          conversation: number | null
          created_at: string | null
          id: number
          sender: string
        }
        Insert: {
          content: string
          conversation?: number | null
          created_at?: string | null
          id?: number
          sender: string
        }
        Update: {
          content?: string
          conversation?: number | null
          created_at?: string | null
          id?: number
          sender?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_conversation_fkey"
            columns: ["conversation"]
            referencedRelation: "conversation"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_conversation_fkey"
            columns: ["conversation"]
            referencedRelation: "conversation_messages_view"
            referencedColumns: ["conversation_id"]
          },
          {
            foreignKeyName: "message_sender_fkey"
            columns: ["sender"]
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_sender_fkey"
            columns: ["sender"]
            referencedRelation: "post_comments"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "message_sender_fkey"
            columns: ["sender"]
            referencedRelation: "post_details"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "message_sender_fkey"
            columns: ["sender"]
            referencedRelation: "user_subscriptions"
            referencedColumns: ["user_id"]
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
            foreignKeyName: "post_community_id_fkey"
            columns: ["community_id"]
            referencedRelation: "community_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_community_id_fkey"
            columns: ["community_id"]
            referencedRelation: "community_sub_count"
            referencedColumns: ["community_id"]
          },
          {
            foreignKeyName: "post_community_id_fkey"
            columns: ["community_id"]
            referencedRelation: "post_details"
            referencedColumns: ["community_id"]
          },
          {
            foreignKeyName: "post_community_id_fkey"
            columns: ["community_id"]
            referencedRelation: "user_comment"
            referencedColumns: ["community_id"]
          },
          {
            foreignKeyName: "post_community_id_fkey"
            columns: ["community_id"]
            referencedRelation: "user_subscriptions"
            referencedColumns: ["community_id"]
          },
          {
            foreignKeyName: "post_posting_user_id_fkey"
            columns: ["posting_user_id"]
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_posting_user_id_fkey"
            columns: ["posting_user_id"]
            referencedRelation: "post_comments"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "post_posting_user_id_fkey"
            columns: ["posting_user_id"]
            referencedRelation: "post_details"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "post_posting_user_id_fkey"
            columns: ["posting_user_id"]
            referencedRelation: "user_subscriptions"
            referencedColumns: ["user_id"]
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
            foreignKeyName: "user_comment_vote_comment_id_fkey"
            columns: ["comment_id"]
            referencedRelation: "comment_vote_count"
            referencedColumns: ["comment_id"]
          },
          {
            foreignKeyName: "user_comment_vote_comment_id_fkey"
            columns: ["comment_id"]
            referencedRelation: "post_comments"
            referencedColumns: ["comment_id"]
          },
          {
            foreignKeyName: "user_comment_vote_comment_id_fkey"
            columns: ["comment_id"]
            referencedRelation: "user_comment"
            referencedColumns: ["comment_id"]
          },
          {
            foreignKeyName: "user_comment_vote_voter_id_fkey"
            columns: ["voter_id"]
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_comment_vote_voter_id_fkey"
            columns: ["voter_id"]
            referencedRelation: "post_comments"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_comment_vote_voter_id_fkey"
            columns: ["voter_id"]
            referencedRelation: "post_details"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_comment_vote_voter_id_fkey"
            columns: ["voter_id"]
            referencedRelation: "user_subscriptions"
            referencedColumns: ["user_id"]
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
            foreignKeyName: "user_community_community_id_fkey"
            columns: ["community_id"]
            referencedRelation: "community_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_community_community_id_fkey"
            columns: ["community_id"]
            referencedRelation: "community_sub_count"
            referencedColumns: ["community_id"]
          },
          {
            foreignKeyName: "user_community_community_id_fkey"
            columns: ["community_id"]
            referencedRelation: "post_details"
            referencedColumns: ["community_id"]
          },
          {
            foreignKeyName: "user_community_community_id_fkey"
            columns: ["community_id"]
            referencedRelation: "user_comment"
            referencedColumns: ["community_id"]
          },
          {
            foreignKeyName: "user_community_community_id_fkey"
            columns: ["community_id"]
            referencedRelation: "user_subscriptions"
            referencedColumns: ["community_id"]
          },
          {
            foreignKeyName: "user_community_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_community_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "post_comments"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_community_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "post_details"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_community_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "user_subscriptions"
            referencedColumns: ["user_id"]
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
          },
          {
            foreignKeyName: "user_image_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "post_comments"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_image_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "post_details"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_image_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "user_subscriptions"
            referencedColumns: ["user_id"]
          }
        ]
      }
      user_post_vote: {
        Row: {
          created_at: string
          post_id: number
          user_vote: number | null
          voter_id: string
        }
        Insert: {
          created_at?: string
          post_id: number
          user_vote?: number | null
          voter_id: string
        }
        Update: {
          created_at?: string
          post_id?: number
          user_vote?: number | null
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
            foreignKeyName: "user_post_vote_post_id_fkey"
            columns: ["post_id"]
            referencedRelation: "post_comments_count"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "user_post_vote_post_id_fkey"
            columns: ["post_id"]
            referencedRelation: "post_details"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "user_post_vote_post_id_fkey"
            columns: ["post_id"]
            referencedRelation: "post_preview"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "user_post_vote_post_id_fkey"
            columns: ["post_id"]
            referencedRelation: "post_preview_plus_votes"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "user_post_vote_post_id_fkey"
            columns: ["post_id"]
            referencedRelation: "post_vote_count"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "user_post_vote_post_id_fkey"
            columns: ["post_id"]
            referencedRelation: "user_comment"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "user_post_vote_voter_id_fkey"
            columns: ["voter_id"]
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_post_vote_voter_id_fkey"
            columns: ["voter_id"]
            referencedRelation: "post_comments"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_post_vote_voter_id_fkey"
            columns: ["voter_id"]
            referencedRelation: "post_details"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_post_vote_voter_id_fkey"
            columns: ["voter_id"]
            referencedRelation: "user_subscriptions"
            referencedColumns: ["user_id"]
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
      user_user: {
        Row: {
          relationship: string | null
          user1: string
          user2: string
        }
        Insert: {
          relationship?: string | null
          user1: string
          user2: string
        }
        Update: {
          relationship?: string | null
          user1?: string
          user2?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_user_user1_fkey"
            columns: ["user1"]
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_user_user1_fkey"
            columns: ["user1"]
            referencedRelation: "post_comments"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_user_user1_fkey"
            columns: ["user1"]
            referencedRelation: "post_details"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_user_user1_fkey"
            columns: ["user1"]
            referencedRelation: "user_subscriptions"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_user_user2_fkey"
            columns: ["user2"]
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_user_user2_fkey"
            columns: ["user2"]
            referencedRelation: "post_comments"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_user_user2_fkey"
            columns: ["user2"]
            referencedRelation: "post_details"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_user_user2_fkey"
            columns: ["user2"]
            referencedRelation: "user_subscriptions"
            referencedColumns: ["user_id"]
          }
        ]
      }
    }
    Views: {
      comment_vote_count: {
        Row: {
          comment_id: number | null
          total_votes: number | null
        }
        Relationships: []
      }
      community_details: {
        Row: {
          community_description: string | null
          community_name: string | null
          created_at: string | null
          id: number | null
          total_subscribers: number | null
        }
        Relationships: []
      }
      community_sub_count: {
        Row: {
          community_id: number | null
          community_name: string | null
          total_subscribers: number | null
        }
        Relationships: []
      }
      conversation_messages_view: {
        Row: {
          conversation_created_at: string | null
          conversation_id: number | null
          message_content: string | null
          message_created_at: string | null
          message_id: number | null
          message_sender: string | null
          sender_username: string | null
          user1: string | null
          user2: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversation_user1_fkey"
            columns: ["user1"]
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_user1_fkey"
            columns: ["user1"]
            referencedRelation: "post_comments"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "conversation_user1_fkey"
            columns: ["user1"]
            referencedRelation: "post_details"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "conversation_user1_fkey"
            columns: ["user1"]
            referencedRelation: "user_subscriptions"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "conversation_user2_fkey"
            columns: ["user2"]
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_user2_fkey"
            columns: ["user2"]
            referencedRelation: "post_comments"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "conversation_user2_fkey"
            columns: ["user2"]
            referencedRelation: "post_details"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "conversation_user2_fkey"
            columns: ["user2"]
            referencedRelation: "user_subscriptions"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "message_sender_fkey"
            columns: ["message_sender"]
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_sender_fkey"
            columns: ["message_sender"]
            referencedRelation: "post_comments"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "message_sender_fkey"
            columns: ["message_sender"]
            referencedRelation: "post_details"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "message_sender_fkey"
            columns: ["message_sender"]
            referencedRelation: "user_subscriptions"
            referencedColumns: ["user_id"]
          }
        ]
      }
      post_comments: {
        Row: {
          comment_content: string | null
          comment_id: number | null
          commenting_user_id: string | null
          created_at: string | null
          parent_comment_id: number | null
          root_post: number | null
          total_votes: number | null
          user_id: string | null
          username: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comment_commenting_user_id_fkey"
            columns: ["commenting_user_id"]
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_commenting_user_id_fkey"
            columns: ["commenting_user_id"]
            referencedRelation: "post_comments"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "comment_commenting_user_id_fkey"
            columns: ["commenting_user_id"]
            referencedRelation: "post_details"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "comment_commenting_user_id_fkey"
            columns: ["commenting_user_id"]
            referencedRelation: "user_subscriptions"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "comment_root_post_fkey"
            columns: ["root_post"]
            referencedRelation: "post"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_root_post_fkey"
            columns: ["root_post"]
            referencedRelation: "post_comments_count"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "comment_root_post_fkey"
            columns: ["root_post"]
            referencedRelation: "post_details"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "comment_root_post_fkey"
            columns: ["root_post"]
            referencedRelation: "post_preview"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "comment_root_post_fkey"
            columns: ["root_post"]
            referencedRelation: "post_preview_plus_votes"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "comment_root_post_fkey"
            columns: ["root_post"]
            referencedRelation: "post_vote_count"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "comment_root_post_fkey"
            columns: ["root_post"]
            referencedRelation: "user_comment"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "user_profile_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      post_comments_count: {
        Row: {
          comment_count: number | null
          post_id: number | null
          post_title: string | null
        }
        Relationships: []
      }
      post_details: {
        Row: {
          community_id: number | null
          community_name: string | null
          created_at: string | null
          is_image: boolean | null
          post_content: string | null
          post_id: number | null
          post_title: string | null
          posting_user_id: string | null
          user_id: string | null
          username: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_posting_user_id_fkey"
            columns: ["posting_user_id"]
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_posting_user_id_fkey"
            columns: ["posting_user_id"]
            referencedRelation: "post_comments"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "post_posting_user_id_fkey"
            columns: ["posting_user_id"]
            referencedRelation: "post_details"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "post_posting_user_id_fkey"
            columns: ["posting_user_id"]
            referencedRelation: "user_subscriptions"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_profile_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      post_preview: {
        Row: {
          comment_count: number | null
          community_id: number | null
          created_at: string | null
          is_image: boolean | null
          post_community: string | null
          post_content: string | null
          post_id: number | null
          post_title: string | null
          posting_user_id: string | null
          posting_username: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_community_id_fkey"
            columns: ["community_id"]
            referencedRelation: "community"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_community_id_fkey"
            columns: ["community_id"]
            referencedRelation: "community_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_community_id_fkey"
            columns: ["community_id"]
            referencedRelation: "community_sub_count"
            referencedColumns: ["community_id"]
          },
          {
            foreignKeyName: "post_community_id_fkey"
            columns: ["community_id"]
            referencedRelation: "post_details"
            referencedColumns: ["community_id"]
          },
          {
            foreignKeyName: "post_community_id_fkey"
            columns: ["community_id"]
            referencedRelation: "user_comment"
            referencedColumns: ["community_id"]
          },
          {
            foreignKeyName: "post_community_id_fkey"
            columns: ["community_id"]
            referencedRelation: "user_subscriptions"
            referencedColumns: ["community_id"]
          },
          {
            foreignKeyName: "post_posting_user_id_fkey"
            columns: ["posting_user_id"]
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_posting_user_id_fkey"
            columns: ["posting_user_id"]
            referencedRelation: "post_comments"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "post_posting_user_id_fkey"
            columns: ["posting_user_id"]
            referencedRelation: "post_details"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "post_posting_user_id_fkey"
            columns: ["posting_user_id"]
            referencedRelation: "user_subscriptions"
            referencedColumns: ["user_id"]
          }
        ]
      }
      post_preview_plus_votes: {
        Row: {
          comment_count: number | null
          community_id: number | null
          created_at: string | null
          is_image: boolean | null
          post_community: string | null
          post_content: string | null
          post_id: number | null
          post_title: string | null
          posting_user_id: string | null
          posting_username: string | null
          total_votes: number | null
        }
        Relationships: [
          {
            foreignKeyName: "post_community_id_fkey"
            columns: ["community_id"]
            referencedRelation: "community"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_community_id_fkey"
            columns: ["community_id"]
            referencedRelation: "community_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_community_id_fkey"
            columns: ["community_id"]
            referencedRelation: "community_sub_count"
            referencedColumns: ["community_id"]
          },
          {
            foreignKeyName: "post_community_id_fkey"
            columns: ["community_id"]
            referencedRelation: "post_details"
            referencedColumns: ["community_id"]
          },
          {
            foreignKeyName: "post_community_id_fkey"
            columns: ["community_id"]
            referencedRelation: "user_comment"
            referencedColumns: ["community_id"]
          },
          {
            foreignKeyName: "post_community_id_fkey"
            columns: ["community_id"]
            referencedRelation: "user_subscriptions"
            referencedColumns: ["community_id"]
          },
          {
            foreignKeyName: "post_posting_user_id_fkey"
            columns: ["posting_user_id"]
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_posting_user_id_fkey"
            columns: ["posting_user_id"]
            referencedRelation: "post_comments"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "post_posting_user_id_fkey"
            columns: ["posting_user_id"]
            referencedRelation: "post_details"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "post_posting_user_id_fkey"
            columns: ["posting_user_id"]
            referencedRelation: "user_subscriptions"
            referencedColumns: ["user_id"]
          }
        ]
      }
      post_vote_count: {
        Row: {
          post_id: number | null
          post_title: string | null
          total_votes: number | null
        }
        Relationships: []
      }
      user_comment: {
        Row: {
          comment_content: string | null
          comment_id: number | null
          commenting_user_id: string | null
          community_id: number | null
          community_name: string | null
          created_at: string | null
          post_community: number | null
          post_id: number | null
          post_title: string | null
          root_post: number | null
        }
        Relationships: [
          {
            foreignKeyName: "comment_commenting_user_id_fkey"
            columns: ["commenting_user_id"]
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_commenting_user_id_fkey"
            columns: ["commenting_user_id"]
            referencedRelation: "post_comments"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "comment_commenting_user_id_fkey"
            columns: ["commenting_user_id"]
            referencedRelation: "post_details"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "comment_commenting_user_id_fkey"
            columns: ["commenting_user_id"]
            referencedRelation: "user_subscriptions"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "comment_root_post_fkey"
            columns: ["root_post"]
            referencedRelation: "post"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_root_post_fkey"
            columns: ["root_post"]
            referencedRelation: "post_comments_count"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "comment_root_post_fkey"
            columns: ["root_post"]
            referencedRelation: "post_details"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "comment_root_post_fkey"
            columns: ["root_post"]
            referencedRelation: "post_preview"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "comment_root_post_fkey"
            columns: ["root_post"]
            referencedRelation: "post_preview_plus_votes"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "comment_root_post_fkey"
            columns: ["root_post"]
            referencedRelation: "post_vote_count"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "comment_root_post_fkey"
            columns: ["root_post"]
            referencedRelation: "user_comment"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "post_community_id_fkey"
            columns: ["post_community"]
            referencedRelation: "community"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_community_id_fkey"
            columns: ["post_community"]
            referencedRelation: "community_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_community_id_fkey"
            columns: ["post_community"]
            referencedRelation: "community_sub_count"
            referencedColumns: ["community_id"]
          },
          {
            foreignKeyName: "post_community_id_fkey"
            columns: ["post_community"]
            referencedRelation: "post_details"
            referencedColumns: ["community_id"]
          },
          {
            foreignKeyName: "post_community_id_fkey"
            columns: ["post_community"]
            referencedRelation: "user_comment"
            referencedColumns: ["community_id"]
          },
          {
            foreignKeyName: "post_community_id_fkey"
            columns: ["post_community"]
            referencedRelation: "user_subscriptions"
            referencedColumns: ["community_id"]
          }
        ]
      }
      user_friends: {
        Row: {
          friend_id: string | null
          friend_username: string | null
          relationship: string | null
          user_id: string | null
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          community_description: string | null
          community_id: number | null
          community_name: string | null
          user_id: string | null
          username: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profile_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Functions: {
      gtrgm_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_options: {
        Args: {
          "": unknown
        }
        Returns: undefined
      }
      gtrgm_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      set_limit: {
        Args: {
          "": number
        }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: {
          "": string
        }
        Returns: unknown
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
