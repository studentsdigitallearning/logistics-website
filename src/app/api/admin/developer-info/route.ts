import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, ADMIN_EDITABLE_FIELDS, type DeveloperInfo } from '@/lib/supabase'

// GET /api/admin/developer-info - Fetch developer info
export async function GET(request: NextRequest) {
  try {
    // Check for role header (set by middleware or client)
    const role = request.headers.get('x-user-role') || 'staff'

    const { data, error } = await supabaseAdmin
      .from('developer_info')
      .select('*')
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch developer info' },
        { status: 500 }
      )
    }

    // Staff: read-only, return all fields
    // Admin: return all fields (can only edit contact fields on PUT)
    // Super Admin: return all fields (can edit everything on PUT)
    return NextResponse.json({
      data,
      role,
      permissions: {
        can_edit: role === 'super_admin' ? 'all' : role === 'admin' ? 'contact_only' : 'none',
        editable_fields: role === 'super_admin'
          ? Object.keys(data).filter(k => !['id', 'created_at', 'updated_at'].includes(k))
          : role === 'admin'
            ? ADMIN_EDITABLE_FIELDS
            : [],
      }
    })
  } catch (err) {
    console.error('Error fetching developer info:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/developer-info - Update developer info
export async function PUT(request: NextRequest) {
  try {
    const role = request.headers.get('x-user-role') || 'staff'

    if (role === 'staff') {
      return NextResponse.json(
        { error: 'Staff users do not have permission to edit developer info' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const updates: Partial<DeveloperInfo> = { updated_at: new Date().toISOString() }

    if (role === 'super_admin') {
      // Super admin can edit all fields except id, created_at, updated_at
      const allowedFields = [
        'developer_name', 'company_name', 'website_link', 'developer_email',
        'developer_phone', 'whatsapp_number', 'phone_number', 'contact_email',
        'working_hours', 'location', 'image_limit', 'lead_expiry_days',
        'tracking_expiry_days'
      ]
      for (const field of allowedFields) {
        if (body[field] !== undefined) {
          updates[field as keyof DeveloperInfo] = body[field]
        }
      }
    } else if (role === 'admin') {
      // Admin can only edit contact-related fields
      for (const field of ADMIN_EDITABLE_FIELDS) {
        if (body[field] !== undefined) {
          updates[field as keyof DeveloperInfo] = body[field]
        }
      }
    }

    // Validate numeric fields
    if (updates.image_limit !== undefined) {
      updates.image_limit = Math.max(1, Math.min(50, Number(updates.image_limit)))
    }
    if (updates.lead_expiry_days !== undefined) {
      updates.lead_expiry_days = Math.max(1, Math.min(365, Number(updates.lead_expiry_days)))
    }
    if (updates.tracking_expiry_days !== undefined) {
      updates.tracking_expiry_days = Math.max(1, Math.min(730, Number(updates.tracking_expiry_days)))
    }

    const { data, error } = await supabaseAdmin
      .from('developer_info')
      .update(updates)
      .eq('id', 1)
      .select()
      .single()

    if (error) {
      console.error('Supabase update error:', error)
      return NextResponse.json(
        { error: 'Failed to update developer info' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data,
      message: 'Developer info updated successfully'
    })
  } catch (err) {
    console.error('Error updating developer info:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
