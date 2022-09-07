import { createClient } from '@supabase/supabase-js'
import { updateHouseScore } from './main';

const supabase = createClient(
  'https://njpqrbzzwregemipdesj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qcHFyYnp6d3JlZ2VtaXBkZXNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjI1NjYyMzksImV4cCI6MTk3ODE0MjIzOX0.TvtUh1FKXzueDKsVoEghH5TX98TAm0zqaBMdDIkJ6b8'
);

export type House = { name: string, points: number };

const { data } = await supabase
    .from<House>('house')
    .select('*');

data!.forEach(updateHouseScore);

supabase
    .from<House>('house')
    .on('*', payload => updateHouseScore(payload.new))
    .subscribe();