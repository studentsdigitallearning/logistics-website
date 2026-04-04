'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from 'sonner'

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<any>(null)
  const [form, setForm] = useState({
    title: '',
    slug: '',
    shortDesc: '',
    fullDesc: '',
    image: '',
    banner: '',
    benefits: '',
    process: '',
    faq: '',
    showImage: true,
    status: true,
  })

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/admin/services')
      const data = await res.json()
      setServices(Array.isArray(data) ? data : [])
    } catch {
      toast.error('Failed to fetch services')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchServices() }, [])

  const resetForm = () => {
    setForm({ title: '', slug: '', shortDesc: '', fullDesc: '', image: '', banner: '', benefits: '', process: '', faq: '', showImage: true, status: true })
    setEditingService(null)
  }

  const handleEdit = (service: any) => {
    setEditingService(service)
    setForm({
      title: service.title || '',
      slug: service.slug || '',
      shortDesc: service.shortDesc || '',
      fullDesc: service.fullDesc || '',
      image: service.image || '',
      banner: service.banner || '',
      benefits: Array.isArray(service.benefits) ? service.benefits.map((b: any) => typeof b === 'string' ? b : b.title || '').join('\n') : '',
      process: Array.isArray(service.process) ? service.process.map((p: any) => typeof p === 'string' ? p : `${p.title || ''}${p.desc ? ': ' + p.desc : ''}`).join('\n') : '',
      faq: Array.isArray(service.faq) ? service.faq.map((f: any) => `Q: ${f.question || f.q || ''}\nA: ${f.answer || f.a || ''}`).join('\n\n') : '',
      showImage: service.showImage ?? true,
      status: service.status ?? true,
    })
    setDialogOpen(true)
  }

  const handleSubmit = async () => {
    if (!form.title || !form.slug) {
      toast.error('Title and slug are required.')
      return
    }

    const benefitsArr = form.benefits ? form.benefits.split('\n').filter(Boolean).map((b) => b.trim()) : []
    const processArr = form.process ? form.process.split('\n').filter(Boolean).map((p) => {
      const parts = p.split(': ')
      return parts.length > 1 ? { title: parts[0].trim(), desc: parts.slice(1).join(': ').trim() } : { title: p.trim() }
    }) : []
    const faqArr = form.faq ? form.faq.split('\n\n').filter(Boolean).map((block) => {
      const lines = block.split('\n')
      const q = lines.find((l) => l.startsWith('Q:'))?.replace('Q:', '').trim() || ''
      const a = lines.find((l) => l.startsWith('A:'))?.replace('A:', '').trim() || ''
      return { question: q, answer: a }
    }) : []

    const payload = {
      ...form,
      benefits: benefitsArr,
      process: processArr,
      faq: faqArr,
    }

    try {
      if (editingService) {
        const res = await fetch(`/api/admin/services/${editingService.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error()
        toast.success('Service updated!')
      } else {
        const res = await fetch('/api/admin/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error()
        toast.success('Service created!')
      }
      setDialogOpen(false)
      resetForm()
      fetchServices()
    } catch {
      toast.error('Something went wrong.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return
    try {
      const res = await fetch(`/api/admin/services/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Service deleted!')
      fetchServices()
    } catch {
      toast.error('Failed to delete service.')
    }
  }

  const generateSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-500">Manage your service offerings.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm() }}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" /> Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingService ? 'Edit Service' : 'Add Service'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: generateSlug(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <Label>Slug</Label>
                  <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Short Description</Label>
                <Input value={form.shortDesc} onChange={(e) => setForm({ ...form, shortDesc: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Full Description</Label>
                <Textarea rows={4} value={form.fullDesc} onChange={(e) => setForm({ ...form, fullDesc: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Image URL</Label>
                  <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Banner URL</Label>
                  <Input value={form.banner} onChange={(e) => setForm({ ...form, banner: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Benefits (one per line)</Label>
                <Textarea rows={3} placeholder="Fully insured\nExpert handling\nOn-time delivery" value={form.benefits} onChange={(e) => setForm({ ...form, benefits: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Process (one step per line, use &quot;Title: Description&quot;)</Label>
                <Textarea rows={4} placeholder="Book: Fill the form&#10;Pickup: We collect goods&#10;Transport: Safe transit&#10;Delivery: At your doorstep" value={form.process} onChange={(e) => setForm({ ...form, process: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>FAQs (Q: and A: per block, separate blocks with blank line)</Label>
                <Textarea rows={4} placeholder={`Q: How long does delivery take?\nA: Usually 3-5 business days.\n\nQ: Is it insured?\nA: Yes, all shipments are fully insured.`} value={form.faq} onChange={(e) => setForm({ ...form, faq: e.target.value })} />
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch checked={form.showImage} onCheckedChange={(c) => setForm({ ...form, showImage: c })} />
                  <Label>Show Image</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={form.status} onCheckedChange={(c) => setForm({ ...form, status: c })} />
                  <Label>Active</Label>
                </div>
              </div>
              <Button onClick={handleSubmit} className="w-full bg-blue-600 hover:bg-blue-700">
                <Save className="mr-2 h-4 w-4" /> {editingService ? 'Update' : 'Create'} Service
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : services.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">{service.title}</TableCell>
                    <TableCell className="text-sm text-gray-500">{service.slug}</TableCell>
                    <TableCell>
                      <Badge variant={service.status ? 'default' : 'secondary'}>
                        {service.status ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(service)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(service.id)} className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-8 text-center text-gray-500">No services found. Add your first service!</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
