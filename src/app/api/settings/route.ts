import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabase
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
