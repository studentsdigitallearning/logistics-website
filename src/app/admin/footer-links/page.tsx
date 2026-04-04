'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from 'sonner'

export default function AdminFooterLinksPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({
    label: '',
    href: '',
    section: '',
    position: 0,
    status: true,
  })

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/admin/footer-links')
      const data = await res.json()
      setItems(Array.isArray(data) ? data : [])
    } catch {
      toast.error('Failed to fetch footer links')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchItems() }, [])

  const resetForm = () => {
    setForm({ label: '', href: '', section: '', position: 0, status: true })
    setEditing(null)
  }

  const handleEdit = (item: any) => {
    setEditing(item)
    setForm({
      label: item.label || '',
      href: item.href || '',
      section: item.section || '',
      position: item.position || 0,
      status: item.status ?? true,
    })
    setDialogOpen(true)
  }

  const handleSubmit = async () => {
    if (!form.label || !form.href) {
      toast.error('Label and href are required.')
      return
    }

    try {
      if (editing) {
        const res = await fetch(`/api/admin/footer-links/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        if (!res.ok) throw new Error()
        toast.success('Footer link updated!')
      } else {
        const res = await fetch('/api/admin/footer-links', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        if (!res.ok) throw new Error()
        toast.success('Footer link added!')
      }
      setDialogOpen(false)
      resetForm()
      fetchItems()
    } catch {
      toast.error('Something went wrong.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this footer link?')) return
    try {
      const res = await fetch(`/api/admin/footer-links/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Deleted!')
      fetchItems()
    } catch {
      toast.error('Failed to delete.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Footer Links</h1>
          <p className="text-gray-500">Manage footer navigation links.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm() }}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" /> Add Link
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit Footer Link' : 'Add Footer Link'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Label *</Label>
                <Input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="e.g., About Us" />
              </div>
              <div className="space-y-2">
                <Label>URL *</Label>
                <Input value={form.href} onChange={(e) => setForm({ ...form, href: e.target.value })} placeholder="/about" />
              </div>
              <div className="space-y-2">
                <Label>Section</Label>
                <Input value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })} placeholder="e.g., Company, Services" />
              </div>
              <div className="space-y-2">
                <Label>Position</Label>
                <Input type="number" value={form.position} onChange={(e) => setForm({ ...form, position: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.status} onCheckedChange={(c) => setForm({ ...form, status: c })} />
                <Label>Active</Label>
              </div>
              <Button onClick={handleSubmit} className="w-full bg-blue-600 hover:bg-blue-700">
                <Save className="mr-2 h-4 w-4" /> {editing ? 'Update' : 'Add'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : items.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Label</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.label}</TableCell>
                    <TableCell className="text-sm text-blue-600">{item.href}</TableCell>
                    <TableCell>{item.section || '-'}</TableCell>
                    <TableCell>{item.position || 0}</TableCell>
                    <TableCell>
                      <Badge variant={item.status ? 'default' : 'secondary'}>
                        {item.status ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-8 text-center text-gray-500">No footer links found.</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
