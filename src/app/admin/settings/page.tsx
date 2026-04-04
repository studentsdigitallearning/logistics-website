'use client'

import { useState, useEffect } from 'react'
import { Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

const SETTINGS_KEYS = [
  { key: 'site_name', label: 'Site Name', type: 'text' },
  { key: 'company_phone', label: 'Company Phone', type: 'text' },
  { key: 'company_address', label: 'Company Address', type: 'text' },
  { key: 'whatsapp_number', label: 'WhatsApp Number', type: 'text' },
  { key: 'working_hours', label: 'Working Hours', type: 'text' },
  { key: 'show_tracking_homepage', label: 'Show Tracking on Homepage', type: 'boolean' },
  { key: 'show_gallery_homepage', label: 'Show Gallery on Homepage', type: 'boolean' },
]

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/admin/settings')
        const data = await res.json()
        setSettings(data)
      } catch {
        toast.error('Failed to fetch settings')
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      if (!res.ok) throw new Error()
      toast.success('Settings saved!')
    } catch {
      toast.error('Failed to save settings.')
    } finally {
      setSaving(false)
    }
  }

  const updateSetting = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500">Manage website settings.</p>
        </div>
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700" disabled={saving}>
          <Save className="mr-2 h-4 w-4" /> {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {SETTINGS_KEYS.map(({ key, label, type }) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={key}>{label}</Label>
              {type === 'boolean' ? (
                <select
                  id={key}
                  value={settings[key] || 'true'}
                  onChange={(e) => updateSetting(key, e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              ) : (
                <Input
                  id={key}
                  value={settings[key] || ''}
                  onChange={(e) => updateSetting(key, e.target.value)}
                />
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
