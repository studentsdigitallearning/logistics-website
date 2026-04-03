import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Public client for client-side operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client for server-side operations (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export interface DeveloperInfo {
  id: number
  developer_name: string
  company_name: string | null
  website_link: string | null
  developer_email: string | null
  developer_phone: string | null
  whatsapp_number: string | null
  phone_number: string | null
  contact_email: string | null
  working_hours: string | null
  location: string | null
  image_limit: number | null
  lead_expiry_days: number | null
  tracking_expiry_days: number | null
  created_at: string
  updated_at: string
}

// Fields that admin role can edit (contact-related fields)
export const ADMIN_EDITABLE_FIELDS = [
  'contact_email',
  'phone_number',
  'whatsapp_number',
  'working_hours',
  'location',
  'website_link',
  'company_name',
] as const

// Fields that staff can only read
export const STAFF_READONLY = true
