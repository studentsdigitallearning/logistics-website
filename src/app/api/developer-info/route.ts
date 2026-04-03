import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/developer-info - Public endpoint to fetch developer info for footer
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('developer_info')
      .select('developer_name, website_link')
      .single()

    if (error) {
      console.error('Error fetching public developer info:', error)
      return NextResponse.json(
        { developer_name: 'Logistics Solutions', website_link: '#' },
        { status: 200 }
      )
    }

    return NextResponse.json(data)
  } catch (err) {
    console.error('Error:', err)
    return NextResponse.json(
      { developer_name: 'Logistics Solutions', website_link: '#' },
      { status: 200 }
    )
  }
}
