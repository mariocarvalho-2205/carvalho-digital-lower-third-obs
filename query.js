const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fmzbpfftgxgruaveiner.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtemJwZmZ0Z3hncnVhdmVpbmVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1OTI2NDgsImV4cCI6MjEwMzE2ODY0OH0.NPILOZvnkyoNw_zscfrAtHFHELAdHlGRQ8lwTRGzk6o';

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data, error } = await supabase
    .from('overlays')
    .select('config')
    .eq('slug', 'ba-ao-vivo')
    .single();

  if (error) {
    console.error(error);
  } else {
    console.log(JSON.stringify(data.config.variations.map(v => v.name), null, 2));
  }
}

main();
