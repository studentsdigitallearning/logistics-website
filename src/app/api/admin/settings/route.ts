import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('Setting')
      .select('key, value')

    if (error) throw error

    const settingsMap: Record<string, string> = {}
    for (const item of data) {
      if (item.key) {
        settingsMap[item.key] = item.value || ''
      }
    }

    return NextResponse.json(settingsMap)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()

    const upserts = Object.entries(body).map(([key, value]) => ({
      key,
      value: String(value),
    }))

    const { data, error } = await supabaseAdmin
      .from('Setting')
      .upsert(upserts, { onConflict: 'key' })
      .select()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
