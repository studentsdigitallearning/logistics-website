'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import { toast } from 'sonner'

const STATUSES = ['New', 'In Progress', 'Completed', 'Rejected']

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  const fetchLeads = async (status?: string) => {
    setLoading(true)
    try {
      const url = status && status !== 'all' ? `/api/admin/leads?status=${status}` : '/api/admin/leads'
      const res = await fetch(url)
      const data = await res.json()
      setLeads(Array.isArray(data) ? data : [])
    } catch {
      toast.error('Failed to fetch leads')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchLeads(filter) }, [filter])

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/admin/leads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      if (!res.ok) throw new Error()
      toast.success('Status updated!')
      fetchLeads(filter)
    } catch {
      toast.error('Failed to update status.')
    }
  }

  const getStatusBadge = (status: string) => {
    const variant = status === 'New' ? 'default' : status === 'In Progress' ? 'secondary' : status === 'Completed' ? 'outline' : 'destructive'
    return <Badge variant={variant}>{status || 'New'}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-500">Manage customer inquiries and leads.</p>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : leads.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>From → To</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium">{lead.name}</TableCell>
                      <TableCell>{lead.phone}</TableCell>
                      <TableCell className="text-sm">{lead.service || '-'}</TableCell>
                      <TableCell className="text-sm">
                        {lead.moveFrom && lead.moveTo
                          ? `${lead.moveFrom} → ${lead.moveTo}`
                          : lead.moveFrom || lead.moveTo || '-'}
                      </TableCell>
                      <TableCell className="text-sm">
                        {lead.preferredDate ? new Date(lead.preferredDate).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={lead.status || 'New'}
                          onValueChange={(v) => handleStatusChange(lead.id, v)}
                        >
                          <SelectTrigger className="w-32 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUSES.map((s) => (
                              <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate text-sm text-gray-500">
                        {lead.message || '-'}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">No leads found.</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
