import { createClient } from '@supabase/supabase-js'
import { realPoints, setHouseScore, updateHouseScore } from './main';

const supabase = createClient(
  'https://njpqrbzzwregemipdesj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qcHFyYnp6d3JlZ2VtaXBkZXNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjI1NjYyMzksImV4cCI6MTk3ODE0MjIzOX0.TvtUh1FKXzueDKsVoEghH5TX98TAm0zqaBMdDIkJ6b8'
);

export type House = { name: "Gryffindor" | "Slytherin" | "Ravenclaw" | "Hufflepuff", points: number };
export type Code = { code: string, points: number, isUsed: boolean };

const { data } = await supabase
    .from<House>('house')
    .select('*');

data!.forEach(setHouseScore);

supabase
    .from<House>('house')
    .on('*', payload => updateHouseScore(payload.new))
    .subscribe();

const verifyCode = (code: string) => supabase
    .from<Code>("code")
    .select("*")
    .match({ code });

export const applyCode = async (code: string, house: string) => {
    code = code.toUpperCase();
    const { data: codes } = await verifyCode(code);
    console.log(codes);

    if (codes!.length === 0) return "Invalid code";
    const { isUsed, points } = codes![0];

    console.log(isUsed, points);
    if (isUsed) return "Code already used";

    await supabase
        .from("code")
        .update({ isUsed: true })
        .match({ code });

    await supabase
        .from("house")
        .update({ points: realPoints[house] + points })
        .match({ name: house });

    return points;
}