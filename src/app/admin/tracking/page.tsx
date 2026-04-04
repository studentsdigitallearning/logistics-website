'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import { toast } from 'sonner'

const TRACKING_STATUSES = ['Booked', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered']

export default function AdminTrackingPage() {
  const [tracking, setTracking] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({
    trackingNumber: '',
    customerName: '',
    from_addr: '',
    to_addr: '',
    status: 'Booked',
    dispatchDate: '',
    deliveryDate: '',
    currentLocation: '',
  })

  const fetchTracking = async () => {
    try {
      const res = await fetch('/api/admin/tracking')
      const data = await res.json()
      setTracking(Array.isArray(data) ? data : [])
    } catch {
      toast.error('Failed to fetch tracking data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTracking() }, [])

  const resetForm = () => {
    setForm({ trackingNumber: '', customerName: '', from_addr: '', to_addr: '', status: 'Booked', dispatchDate: '', deliveryDate: '', currentLocation: '' })
    setEditing(null)
  }

  const handleEdit = (item: any) => {
    setEditing(item)
    setForm({
      trackingNumber: item.trackingNumber || '',
      customerName: item.customerName || '',
      from_addr: item.from_addr || '',
      to_addr: item.to_addr || '',
      status: item.status || 'Booked',
      dispatchDate: item.dispatchDate ? item.dispatchDate.split('T')[0] : '',
      deliveryDate: item.deliveryDate ? item.deliveryDate.split('T')[0] : '',
      currentLocation: item.currentLocation || '',
    })
    setDialogOpen(true)
  }

  const handleSubmit = async () => {
    if (!form.trackingNumber) {
      toast.error('Tracking number is required.')
      return
    }

    try {
      if (editing) {
        const res = await fetch(`/api/admin/tracking/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        if (!res.ok) throw new Error()
        toast.success('Tracking updated!')
      } else {
        const res = await fetch('/api/admin/tracking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        if (!res.ok) throw new Error()
        toast.success('Tracking created!')
      }
      setDialogOpen(false)
      resetForm()
      fetchTracking()
    } catch {
      toast.error('Something went wrong.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tracking entry?')) return
    try {
      const res = await fetch(`/api/admin/tracking/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Tracking deleted!')
      fetchTracking()
    } catch {
      toast.error('Failed to delete.')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-700'
      case 'Out for Delivery': return 'bg-blue-100 text-blue-700'
      case 'In Transit': return 'bg-yellow-100 text-yellow-700'
      case 'Picked Up': return 'bg-purple-100 text-purple-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tracking</h1>
          <p className="text-gray-500">Manage shipment tracking entries.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm() }}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" /> Add Tracking
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit Tracking' : 'Add Tracking'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Tracking Number *</Label>
                <Input value={form.trackingNumber} onChange={(e) => setForm({ ...form, trackingNumber: e.target.value })} disabled={!!editing} />
              </div>
              <div className="space-y-2">
                <Label>Customer Name</Label>
                <Input value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>From</Label>
                  <Input value={form.from_addr} onChange={(e) => setForm({ ...form, from_addr: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>To</Label>
                  <Input value={form.to_addr} onChange={(e) => setForm({ ...form, to_addr: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TRACKING_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Dispatch Date</Label>
                  <Input type="date" value={form.dispatchDate} onChange={(e) => setForm({ ...form, dispatchDate: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Delivery Date</Label>
                  <Input type="date" value={form.deliveryDate} onChange={(e) => setForm({ ...form, deliveryDate: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Current Location</Label>
                <Input value={form.currentLocation} onChange={(e) => setForm({ ...form, currentLocation: e.target.value })} />
              </div>
              <Button onClick={handleSubmit} className="w-full bg-blue-600 hover:bg-blue-700">
                <Save className="mr-2 h-4 w-4" /> {editing ? 'Update' : 'Create'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : tracking.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tracking #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tracking.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono font-medium">{item.trackingNumber}</TableCell>
                      <TableCell>{item.customerName || '-'}</TableCell>
                      <TableCell className="text-sm">
                        {item.from_addr && item.to_addr ? `${item.from_addr} → ${item.to_addr}` : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{item.currentLocation || '-'}</TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {new Date(item.created_at).toLocaleDateString()}
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
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">No tracking entries found.</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
