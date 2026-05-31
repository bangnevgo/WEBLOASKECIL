export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  statusCode: number
}

export interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
  bio?: string
  role: 'student' | 'instructor' | 'admin'
  subscription_status: 'free' | 'active' | 'cancelled' | 'expired'
  subscription_plan?: 'monthly' | 'yearly'
  subscription_start_date?: string
  subscription_end_date?: string
  created_at: string
  updated_at: string
}

export interface Course {
  id: string
  title: string
  slug: string
  description?: string
  category?: string
  level?: 'beginner' | 'intermediate' | 'advanced'
  instructor_id: string
  thumbnail_url?: string
  cover_image_url?: string
  total_lessons: number
  estimated_duration?: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface Lesson {
  id: string
  course_id: string
  title: string
  slug: string
  description?: string
  content?: string
  video_url?: string
  video_duration?: number
  order_index: number
  is_free: boolean
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface UserProgress {
  id: string
  user_id: string
  lesson_id: string
  course_id: string
  watched_duration: number
  is_completed: boolean
  completion_percentage: number
  completed_at?: string
  created_at: string
  updated_at: string
}

export interface CourseEnrollment {
  id: string
  user_id: string
  course_id: string
  enrollment_date: string
  completion_date?: string
  is_completed: boolean
  certificate_url?: string
  certificate_issued_at?: string
  created_at: string
  updated_at: string
}

export interface ForumTopic {
  id: string
  category_id: string
  user_id: string
  course_id?: string
  title: string
  slug: string
  content: string
  views_count: number
  replies_count: number
  is_pinned: boolean
  is_locked: boolean
  created_at: string
  updated_at: string
  last_reply_at?: string
}

export interface ForumReply {
  id: string
  topic_id: string
  user_id: string
  content: string
  is_solution: boolean
  likes_count: number
  created_at: string
  updated_at: string
}

export interface LiveSession {
  id: string
  course_id?: string
  instructor_id: string
  title: string
  description?: string
  scheduled_start_time: string
  scheduled_end_time: string
  zoom_url?: string
  meeting_id?: string
  recording_url?: string
  max_participants?: number
  actual_participants: number
  status: 'scheduled' | 'live' | 'ended' | 'cancelled'
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  user_id: string
  amount: number
  currency: string
  payment_method: string
  payment_status: 'pending' | 'success' | 'failed' | 'expired'
  midtrans_transaction_id?: string
  plan_type: 'monthly' | 'yearly'
  invoice_number: string
  paid_at?: string
  expired_at?: string
  created_at: string
  updated_at: string
}

export interface AIChatSession {
  id: string
  user_id: string
  course_id?: string
  session_type: 'tutoring' | 'recommendation' | 'general_qa'
  title?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AIMessage {
  id: string
  session_id: string
  user_message: string
  ai_response: string
  context_data?: Record<string, any>
  message_type: 'text' | 'recommendation' | 'suggestion'
  helpful?: boolean
  created_at: string
}

export interface Certificate {
  id: string
  user_id: string
  course_id: string
  certificate_number: string
  verification_code: string
  certificate_url: string
  issued_at: string
  created_at: string
}

export interface SessionRegistration {
  id: string
  user_id: string
  session_id: string
  attendance_type: 'live' | 'replay'
  attended_at?: string
  registered_at: string
}
