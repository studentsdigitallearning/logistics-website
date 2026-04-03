'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Building2,
  Globe,
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Image,
  CalendarDays,
  Truck,
  Save,
  Loader2,
  CheckCircle2,
  Shield,
  ShieldCheck,
  Eye,
  AlertTriangle,
} from 'lucide-react'
import { toast } from 'sonner'

type Role = 'super_admin' | 'admin' | 'staff'

interface DeveloperInfoData {
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

interface Permissions {
  can_edit: 'all' | 'contact_only' | 'none'
  editable_fields: string[]
}

export default function DeveloperInfoAdminPage() {
  const [data, setData] = useState<DeveloperInfoData | null>(null)
  const [permissions, setPermissions] = useState<Permissions | null>(null)
  const [role, setRole] = useState<Role>('super_admin')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<Partial<DeveloperInfoData>>({})

  // Role selector for demo - in production this would come from auth
  const roleConfig = {
    super_admin: { label: 'Super Admin', icon: ShieldCheck, color: 'bg-red-100 text-red-800 border-red-200', desc: 'Full access to all fields' },
    admin: { label: 'Admin', icon: Shield, color: 'bg-blue-100 text-blue-800 border-blue-200', desc: 'Edit contact fields only' },
    staff: { label: 'Staff', icon: Eye, color: 'bg-green-100 text-green-800 border-green-200', desc: 'Read-only access' },
  }

  const fetchData = useCallback(async (selectedRole: Role) => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/developer-info', {
        headers: { 'x-user-role': selectedRole }
      })
      const json = await res.json()
      if (json.data) {
        setData(json.data)
        setFormData(json.data)
      }
      if (json.permissions) {
        setPermissions(json.permissions)
      }
      if (json.role) {
        setRole(json.role)
      }
    } catch (err) {
      toast.error('Failed to load developer information')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData(role)
  }, [role, fetchData])

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole)
    fetchData(newRole)
  }

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!data) return
    if (permissions?.can_edit === 'none') {
      toast.error('You do not have permission to edit')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/admin/developer-info', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': role
        },
        body: JSON.stringify(formData)
      })
      const json = await res.json()
      if (res.ok) {
        setData(json.data)
        setFormData(json.data)
        toast.success('Developer information updated successfully!')
      } else {
        toast.error(json.error || 'Failed to update')
      }
    } catch (err) {
      toast.error('An error occurred while saving')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const isFieldEditable = (field: string): boolean => {
    if (role === 'super_admin') {
      return !['id', 'created_at', 'updated_at'].includes(field)
    }
    if (role === 'admin') {
      return permissions?.editable_fields.includes(field) || false
    }
    return false
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <Skeleton className="h-10 w-80" />
          <Skeleton className="h-32 w-full" />
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Building2 className="h-7 w-7 text-blue-600" />
                Developer Information
              </h1>
              <p className="text-gray-500 mt-1">
                Manage developer details, contact information, and system settings
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className={`px-3 py-1.5 text-sm font-medium ${roleConfig[role].color}`}>
                {(() => { const IconComp = roleConfig[role].icon; return <IconComp className="h-3.5 w-3.5 mr-1.5" />; })()}
                {roleConfig[role].label}
              </Badge>
              <Button
                onClick={handleSave}
                disabled={saving || permissions?.can_edit === 'none'}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Role Switcher (for demo/testing) */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6">
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <CardTitle className="text-sm font-semibold text-amber-800">Role Simulation</CardTitle>
            </div>
            <CardDescription className="text-xs text-amber-700">
              Switch between roles to test permission levels. In production, the role is determined by authentication.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {(['super_admin', 'admin', 'staff'] as Role[]).map((r) => (
                <Button
                  key={r}
                  variant={role === r ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleRoleChange(r)}
                  className={role === r ? 'bg-blue-600 hover:bg-blue-700' : ''}
                >
                  {(() => { const IconComp = roleConfig[r].icon; return <IconComp className="h-3.5 w-3.5 mr-1.5" />; })()}
                  {roleConfig[r].label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        {permissions?.can_edit === 'none' && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-3">
            <Eye className="h-5 w-5 text-yellow-600" />
            <p className="text-sm text-yellow-800">
              You have <strong>read-only</strong> access. Contact a Super Admin to make changes.
            </p>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                Company Information
              </CardTitle>
              <CardDescription>Basic developer and company details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="developer_name">Developer Name</Label>
                <Input
                  id="developer_name"
                  value={formData.developer_name || ''}
                  onChange={(e) => handleChange('developer_name', e.target.value)}
                  disabled={!isFieldEditable('developer_name')}
                  placeholder="Enter developer name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name</Label>
                <Input
                  id="company_name"
                  value={formData.company_name || ''}
                  onChange={(e) => handleChange('company_name', e.target.value)}
                  disabled={!isFieldEditable('company_name')}
                  placeholder="Enter company name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website_link" className="flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5" />
                  Website Link
                </Label>
                <Input
                  id="website_link"
                  type="url"
                  value={formData.website_link || ''}
                  onChange={(e) => handleChange('website_link', e.target.value)}
                  disabled={!isFieldEditable('website_link')}
                  placeholder="https://example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  Location
                </Label>
                <Input
                  id="location"
                  value={formData.location || ''}
                  onChange={(e) => handleChange('location', e.target.value)}
                  disabled={!isFieldEditable('location')}
                  placeholder="City, Country"
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Phone className="h-5 w-5 text-green-600" />
                Contact Information
              </CardTitle>
              <CardDescription>Email, phone, and messaging details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contact_email" className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  Contact Email
                </Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.contact_email || ''}
                  onChange={(e) => handleChange('contact_email', e.target.value)}
                  disabled={!isFieldEditable('contact_email')}
                  placeholder="contact@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="developer_email">Developer Email</Label>
                <Input
                  id="developer_email"
                  type="email"
                  value={formData.developer_email || ''}
                  onChange={(e) => handleChange('developer_email', e.target.value)}
                  disabled={!isFieldEditable('developer_email')}
                  placeholder="developer@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone_number" className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" />
                  Phone Number
                </Label>
                <Input
                  id="phone_number"
                  type="tel"
                  value={formData.phone_number || ''}
                  onChange={(e) => handleChange('phone_number', e.target.value)}
                  disabled={!isFieldEditable('phone_number')}
                  placeholder="+1 (234) 567-8900"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="developer_phone">Developer Phone</Label>
                <Input
                  id="developer_phone"
                  type="tel"
                  value={formData.developer_phone || ''}
                  onChange={(e) => handleChange('developer_phone', e.target.value)}
                  disabled={!isFieldEditable('developer_phone')}
                  placeholder="+1 (234) 567-8900"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp_number" className="flex items-center gap-1.5">
                  <MessageCircle className="h-3.5 w-3.5" />
                  WhatsApp Number
                </Label>
                <Input
                  id="whatsapp_number"
                  type="tel"
                  value={formData.whatsapp_number || ''}
                  onChange={(e) => handleChange('whatsapp_number', e.target.value)}
                  disabled={!isFieldEditable('whatsapp_number')}
                  placeholder="+1 (234) 567-8900"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="working_hours" className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  Working Hours
                </Label>
                <Input
                  id="working_hours"
                  value={formData.working_hours || ''}
                  onChange={(e) => handleChange('working_hours', e.target.value)}
                  disabled={!isFieldEditable('working_hours')}
                  placeholder="Mon-Fri: 9:00 AM - 6:00 PM"
                />
              </div>
            </CardContent>
          </Card>

          {/* System Configuration */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Truck className="h-5 w-5 text-purple-600" />
                System Configuration
              </CardTitle>
              <CardDescription>
                Configure system limits and expiry settings. Only Super Admin can modify these values.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="image_limit" className="flex items-center gap-1.5">
                    <Image className="h-3.5 w-3.5" />
                    Image Upload Limit
                  </Label>
                  <Input
                    id="image_limit"
                    type="number"
                    min={1}
                    max={50}
                    value={formData.image_limit || 5}
                    onChange={(e) => handleChange('image_limit', parseInt(e.target.value) || 5)}
                    disabled={!isFieldEditable('image_limit')}
                  />
                  <p className="text-xs text-gray-500">Max images per upload (1-50)</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lead_expiry_days" className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" />
                    Lead Expiry (Days)
                  </Label>
                  <Input
                    id="lead_expiry_days"
                    type="number"
                    min={1}
                    max={365}
                    value={formData.lead_expiry_days || 30}
                    onChange={(e) => handleChange('lead_expiry_days', parseInt(e.target.value) || 30)}
                    disabled={!isFieldEditable('lead_expiry_days')}
                  />
                  <p className="text-xs text-gray-500">Days before leads expire (1-365)</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tracking_expiry_days" className="flex items-center gap-1.5">
                    <Truck className="h-3.5 w-3.5" />
                    Tracking Expiry (Days)
                  </Label>
                  <Input
                    id="tracking_expiry_days"
                    type="number"
                    min={1}
                    max={730}
                    value={formData.tracking_expiry_days || 90}
                    onChange={(e) => handleChange('tracking_expiry_days', parseInt(e.target.value) || 90)}
                    disabled={!isFieldEditable('tracking_expiry_days')}
                  />
                  <p className="text-xs text-gray-500">Days before tracking expires (1-730)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Permission Info */}
          <Card className="lg:col-span-2 bg-gradient-to-r from-slate-50 to-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <ShieldCheck className="h-8 w-8 text-blue-600 mt-0.5 shrink-0" />
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900">Current Permissions</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-xs">
                      Role: {roleConfig[role].label}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      Edit Access: {permissions?.can_edit === 'all' ? 'All Fields' : permissions?.can_edit === 'contact_only' ? 'Contact Fields Only' : 'None (Read-Only)'}
                    </Badge>
                    {permissions?.editable_fields && permissions.editable_fields.length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        Editable: {permissions.editable_fields.join(', ')}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {role === 'super_admin'
                      ? 'You have full access to modify all developer information fields, system configuration, and settings.'
                      : role === 'admin'
                        ? 'You can edit contact-related fields such as email, phone, WhatsApp, working hours, and location. System settings require Super Admin access.'
                        : 'You have read-only access. All fields are displayed for reference but cannot be modified.'}
                  </p>
                  {data && (
                    <p className="text-xs text-gray-400 mt-2">
                      Last updated: {new Date(data.updated_at).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
