import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('Service')
      .select('id, title, slug, shortDesc, image, showImage, status')
      .eq('status', 'active')
      .order('title', { ascending: true })

    if (error) throw error
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

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
