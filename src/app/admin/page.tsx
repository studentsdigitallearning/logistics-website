'use client'

import { useState, useEffect } from 'react'
import { Users, Truck, BarChart3, Star, ArrowUpRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface Stats {
  totalLeads: number
  totalServices: number
  totalTracking: number
  totalTestimonials: number
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({ totalLeads: 0, totalServices: 0, totalTracking: 0, totalTestimonials: 0 })
  const [recentLeads, setRecentLeads] = useState<any[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        const [leadsRes, servicesRes, trackingRes, testimonialsRes] = await Promise.all([
          fetch('/api/admin/leads'),
          fetch('/api/admin/services'),
          fetch('/api/admin/tracking'),
          fetch('/api/admin/testimonials'),
        ])
        const [leadsData, servicesData, trackingData, testimonialsData] = await Promise.all([
          leadsRes.json(),
          servicesRes.json(),
          trackingRes.json(),
          testimonialsRes.json(),
        ])

        setStats({
          totalLeads: Array.isArray(leadsData) ? leadsData.length : 0,
          totalServices: Array.isArray(servicesData) ? servicesData.length : 0,
          totalTracking: Array.isArray(trackingData) ? trackingData.length : 0,
          totalTestimonials: Array.isArray(testimonialsData) ? testimonialsData.length : 0,
        })

        setRecentLeads(Array.isArray(leadsData) ? leadsData.slice(0, 10) : [])
      } catch {
        // fallback
      }
    }
    fetchData()
  }, [])

  const statCards = [
    { title: 'Total Leads', value: stats.totalLeads, icon: Users, color: 'bg-blue-50 text-blue-600' },
    { title: 'Services', value: stats.totalServices, icon: Truck, color: 'bg-green-50 text-green-600' },
    { title: 'Tracking', value: stats.totalTracking, icon: BarChart3, color: 'bg-purple-50 text-purple-600' },
    { title: 'Testimonials', value: stats.totalTestimonials, icon: Star, color: 'bg-yellow-50 text-yellow-600' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Overview of your logistics website.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Leads */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Leads</CardTitle>
          <a href="/admin/leads" className="flex items-center text-sm text-blue-600 hover:text-blue-700">
            View All <ArrowUpRight className="ml-1 h-3 w-3" />
          </a>
        </CardHeader>
        <CardContent>
          {recentLeads.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentLeads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium">{lead.name}</TableCell>
                      <TableCell>{lead.phone}</TableCell>
                      <TableCell>{lead.service || '-'}</TableCell>
                      <TableCell>{lead.moveFrom || '-'}</TableCell>
                      <TableCell>{lead.moveTo || '-'}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            lead.status === 'New' ? 'default' :
                            lead.status === 'In Progress' ? 'secondary' :
                            lead.status === 'Completed' ? 'outline' : 'destructive'
                          }
                        >
                          {lead.status || 'New'}
                        </Badge>
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
            <p className="text-center text-gray-500 py-8">No leads yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
