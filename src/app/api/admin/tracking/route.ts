import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('Tracking')
      .select('*')
      .order('createdAt', { ascending: false })

    if (error) throw error
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { data, error } = await supabaseAdmin
      .from('Tracking')
      .insert([{
        trackingNumber: body.trackingNumber,
        customerName: body.customerName || null,
        from_addr: body.from_addr || null,
        to_addr: body.to_addr || null,
        status: body.status || 'Booked',
        dispatchDate: body.dispatchDate || null,
        deliveryDate: body.deliveryDate || null,
        currentLocation: body.currentLocation || null,
      }])
      .select()

    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
