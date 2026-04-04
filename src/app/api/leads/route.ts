import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { data, error } = await supabase
      .from('Lead')
      .insert([{
        name: body.name,
        phone: body.phone,
        moveFrom: body.moveFrom,
        moveTo: body.moveTo,
        preferredDate: body.preferredDate,
        address: body.address,
        service: body.service,
        message: body.message,
        status: 'New',
      }])
      .select()

    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
