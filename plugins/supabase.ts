import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL: string = process.env.supabaseUrl || process.env.VITE_SUPABASE_URL || ''
const SUPABASE_KEY: string = process.env.supabaseKey || process.env.VITE_SUPABASE_KEY || ''

// @ts-ignore
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
