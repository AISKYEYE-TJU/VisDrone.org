import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://zpzwefrxckbojbotjxof.supabase.co', 'sb_publishable_kO6tEcLI7Tbhnm5gPHVU-Q_sIno20Ly');

const { data } = await supabase.from('visdrone_models').select('id, name, low_altitude_tags');
console.log('Models low_altitude_tags status:');
data?.forEach(m => console.log(m.name + ': ' + JSON.stringify(m.low_altitude_tags)));
console.log('\nTotal: ' + data?.length);
