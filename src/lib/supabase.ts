import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Public client for client-side operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client for server-side operations (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// ============== Type Interfaces ==============

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

export interface Service {
  id: string
  title: string
  slug: string
  shortDesc: string | null
  fullDesc: string | null
  image: string | null
  banner: string | null
  benefits: any[] | null
  process: any[] | null
  faq: any[] | null
  showImage: boolean | null
  status: boolean | null
  created_at: string
  updated_at: string
}

export interface SocialMedia {
  id: string
  platform: string
  url: string
  icon: string | null
  position: number | null
  status: boolean | null
  created_at: string
  updated_at: string
}

export interface Lead {
  id: string
  name: string
  phone: string
  moveFrom: string | null
  moveTo: string | null
  preferredDate: string | null
  address: string | null
  service: string | null
  message: string | null
  status: string | null
  created_at: string
  updated_at: string
}

export interface Gallery {
  id: string
  title: string | null
  image: string
  showHome: boolean | null
  status: boolean | null
  created_at: string
  updated_at: string
}

export interface FooterLink {
  id: string
  label: string
  href: string
  section: string | null
  position: number | null
  status: boolean | null
  created_at: string
  updated_at: string
}

export interface Tracking {
  id: string
  trackingNumber: string
  customerName: string | null
  from_addr: string | null
  to_addr: string | null
  status: string
  dispatchDate: string | null
  deliveryDate: string | null
  currentLocation: string | null
  created_at: string
  updated_at: string
}

export interface Testimonial {
  id: string
  name: string
  role: string | null
  review: string
  rating: number | null
  status: boolean | null
  created_at: string
  updated_at: string
}

export interface AdminUser {
  id: string
  email: string
  password: string
  name: string | null
  role: string
  created_at: string
  updated_at: string
}

export interface Setting {
  key: string
  value: string | null
}

export interface CustomPage {
  id: string
  title: string
  slug: string
  content: string | null
  status: boolean | null
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
