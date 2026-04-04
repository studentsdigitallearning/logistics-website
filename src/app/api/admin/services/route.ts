import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('Service')
      .select('*')
      .order('created_at', { ascending: false })

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
      .from('Service')
      .insert([{
        title: body.title,
        slug: body.slug,
        shortDesc: body.shortDesc || null,
        fullDesc: body.fullDesc || null,
        image: body.image || null,
        banner: body.banner || null,
        benefits: body.benefits || [],
        process: body.process || [],
        faq: body.faq || [],
        showImage: body.showImage ?? true,
        status: body.status ?? true,
      }])
      .select()

    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
