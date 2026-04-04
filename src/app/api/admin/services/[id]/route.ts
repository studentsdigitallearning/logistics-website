import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const { data, error } = await supabaseAdmin
      .from('Service')
      .update({
        title: body.title,
        slug: body.slug,
        shortDesc: body.shortDesc,
        fullDesc: body.fullDesc,
        image: body.image,
        banner: body.banner,
        benefits: body.benefits,
        process: body.process,
        faq: body.faq,
        showImage: body.showImage,
        status: body.status,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', id)
      .select()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { error } = await supabaseAdmin.from('Service').delete().eq('id', id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
