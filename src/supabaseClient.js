import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fxwykgczkazhuwleceny.supabase.co';
const supabaseKey = 'sb_publishable_2ztJg1W2FzXQkVFupWC6Jg_EuP_yCN8';

export const supabase = createClient(supabaseUrl, supabaseKey);