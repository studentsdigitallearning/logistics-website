'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Save, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from 'sonner'

export default function AdminGalleryPage() {
  const [gallery, setGallery] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({
    title: '',
    image: '',
    showHome: true,
    status: true,
  })

  const fetchGallery = async () => {
    try {
      const res = await fetch('/api/admin/gallery')
      const data = await res.json()
      setGallery(Array.isArray(data) ? data : [])
    } catch {
      toast.error('Failed to fetch gallery')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchGallery() }, [])

  const resetForm = () => {
    setForm({ title: '', image: '', showHome: true, status: true })
    setEditing(null)
  }

  const handleEdit = (item: any) => {
    setEditing(item)
    setForm({
      title: item.title || '',
      image: item.image || '',
      showHome: item.showHome ?? true,
      status: item.status ?? true,
    })
    setDialogOpen(true)
  }

  const handleSubmit = async () => {
    if (!form.image) {
      toast.error('Image URL is required.')
      return
    }

    try {
      if (editing) {
        const res = await fetch(`/api/admin/gallery/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        if (!res.ok) throw new Error()
        toast.success('Gallery updated!')
      } else {
        const res = await fetch('/api/admin/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        if (!res.ok) throw new Error()
        toast.success('Gallery image added!')
      }
      setDialogOpen(false)
      resetForm()
      fetchGallery()
    } catch {
      toast.error('Something went wrong.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Image deleted!')
      fetchGallery()
    } catch {
      toast.error('Failed to delete.')
    }
  }

  const handleToggleShowHome = async (item: any) => {
    try {
      const res = await fetch(`/api/admin/gallery/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, showHome: !item.showHome }),
      })
      if (!res.ok) throw new Error()
      fetchGallery()
    } catch {
      toast.error('Failed to update.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gallery</h1>
          <p className="text-gray-500">Manage gallery images.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm() }}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" /> Add Image
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit Image' : 'Add Image'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Image title" />
              </div>
              <div className="space-y-2">
                <Label>Image URL *</Label>
                <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
              </div>
              {form.image && (
                <div className="rounded-lg overflow-hidden border bg-gray-50">
                  <img src={form.image} alt="Preview" className="w-full h-40 object-cover" />
                </div>
              )}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch checked={form.showHome} onCheckedChange={(c) => setForm({ ...form, showHome: c })} />
                  <Label>Show on Homepage</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={form.status} onCheckedChange={(c) => setForm({ ...form, status: c })} />
                  <Label>Active</Label>
                </div>
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
          ) : gallery.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Homepage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gallery.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="w-16 h-12 rounded-md overflow-hidden bg-gray-100">
                        {item.image && (
                          <img src={item.image} alt={item.title || ''} className="w-full h-full object-cover" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{item.title || '-'}</TableCell>
                    <TableCell>
                      <Badge
                        variant={item.showHome ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => handleToggleShowHome(item)}
                      >
                        {item.showHome ? 'Shown' : 'Hidden'}
                      </Badge>
                    </TableCell>
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
            <div className="p-8 text-center text-gray-500">No gallery images found.</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
