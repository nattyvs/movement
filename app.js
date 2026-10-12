'use strict';
/* Movement: a training companion. Runs offline; syncs to a private GitHub repo. */

/* ================= Library ================= */
const EX = {
  pad_warm:{name:'Walking pad warm-up',kind:'timed',dur:180,label:'Easy · 4–4.5 km/h',cue:'Easy pace. Let your hips and ankles loosen up.'},
  march_warm:{name:'Marching warm-up',kind:'timed',dur:120,label:'Knees up, arms swinging',cue:'March on the spot. Add a few slow bodyweight squats if you feel stiff.'},
  pad_cool:{name:'Cool-down walk',kind:'timed',dur:120,label:'Slow · 4 km/h',cue:'Bring the pace right down and let your breathing settle.'},
  march_cool:{name:'Cool-down march',kind:'timed',dur:120,label:'Slow march',cue:'Slow it right down. Long breaths out.'},
  goblet_box:{name:'Goblet box squat',kind:'reps',sets:3,reps:'8–12 reps',load:6,unit:'one dumbbell',rest:60,demo:'Goblet_Squat',legs:true,
    cue:'Dumbbell at your chest. Sit back until you touch the sofa edge, then stand tall.',
    how:{setup:['Stand just in front of the sofa, feet a little wider than hips.','Hold one dumbbell upright against your chest, elbows tucked.'],go:['Push your hips back and sit until you brush the sofa.','Drive through your whole foot to stand tall.'],tips:['Knees follow your toes, never cave in.','Chest proud, as if showing off a necklace.']}},
  knee_push:{name:'Knee push-up',kind:'reps',sets:3,reps:'8–12 reps',bw:true,rest:60,demo:'Pushups',demoNote:'Photo shows a full push-up. Do yours from the knees.',
    cue:'Hands under shoulders, one straight line from knees to head.',
    how:{setup:['Kneel, hands under shoulders, slightly wider.','Walk your knees back until body is one straight line.'],go:['Lower your chest towards the floor between your hands.','Press the floor away to the top.'],tips:['Squeeze glutes so hips do not sag.','Elbows at about 45 degrees, not flared wide.']}},
  hip_thrust:{name:'Dumbbell hip thrust',kind:'reps',sets:3,reps:'10–15 reps',load:3.5,unit:'across your hips',rest:60,demo:'Barbell_Hip_Thrust',demoNote:'Photo shows a barbell. Use a dumbbell across your hips.',legs:true,
    cue:'Shoulders on the sofa, feet flat. Drive up and hold one second at the top.',
    how:{setup:['Upper back against the sofa edge, feet flat, knees bent.','Rest the dumbbell on your hip crease, hands holding it steady.'],go:['Drive through your heels and lift until your body is flat like a table.','Hold one second, lower with control.'],tips:['Chin tucked, eyes forward, not at the ceiling.','Feel it in your glutes. If it is your hamstrings, bring feet closer.']}},
  rdl:{name:'Romanian deadlift',kind:'reps',sets:3,reps:'8–12 reps',load:5,unit:'each hand',rest:60,demo:'Stiff-Legged_Dumbbell_Deadlift',legs:true,
    cue:'Soft knees. Push hips back while the dumbbells slide down your thighs.',
    how:{setup:['Feet hip-width, a dumbbell in each hand in front of your thighs.','Soft bend in the knees, ribs down.'],go:['Push your hips back, sliding the weights down your legs.','Stop when you feel a hamstring stretch, then squeeze glutes to stand.'],tips:['Back stays flat the whole way.','The weights stay close, almost brushing your legs.']}},
  dead_bug:{name:'Dead bug',kind:'timed',sets:2,dur:30,rest:30,label:'Slow and controlled',demo:'Dead_Bug',
    cue:'Low back stays heavy on the floor. Reach opposite arm and leg away, then swap.',
    how:{setup:['On your back, arms to the ceiling, knees bent over hips.','Press your lower back into the floor.'],go:['Lower one arm and the opposite leg slowly towards the floor.','Return and swap sides.'],tips:['Breathe out as you reach.','If your back lifts, make the reach smaller.']}},
  split_squat:{name:'Supported split squat',kind:'reps',sets:3,reps:'8–10 each side',load:3.5,unit:'each hand',rest:60,est:60,demo:'Split_Squat_with_Dumbbells',legs:true,
    cue:'A hand on the wall if you need it. Drop the back knee straight down.',
    how:{setup:['Long stride stance, back heel lifted.','Dumbbells at your sides, or one hand on the wall.'],go:['Drop the back knee straight down towards the floor.','Push through the front heel to rise.'],tips:['Front knee tracks over the toes.','Torso tall, weight mostly on the front leg.']}},
  row:{name:'Bent-over row',kind:'reps',sets:3,reps:'10–12 reps',load:5,unit:'each hand',rest:60,demo:'Bent_Over_Two-Dumbbell_Row',
    cue:'Hinge forward with a flat back. Pull the dumbbells towards your hip pockets.',
    how:{setup:['Hinge forward to about 45 degrees, soft knees.','Arms hang straight under your shoulders.'],go:['Pull the dumbbells to your hip pockets.','Squeeze shoulder blades, lower slowly.'],tips:['Neck long, eyes on the floor ahead.','No jerking. If you swing, go lighter.']}},
  step_up:{name:'Step-up',kind:'reps',sets:3,reps:'8 each side',bw:true,rest:60,est:60,demo:'Dumbbell_Step_Ups',legs:true,
    cue:'Bottom stair or a sturdy step. Whole foot on, push through the heel, step down slowly.',
    how:{setup:['Face the bottom stair, hand on the rail if you like.','Place your whole foot on the step.'],go:['Push through that heel to stand up tall.','Step down slowly with the other foot.'],tips:['The top leg does the work, not a bounce from below.','Knee in line with your toes.']}},
  db_press:{name:'Standing dumbbell press',kind:'reps',sets:3,reps:'8–12 reps',load:3,unit:'each hand',rest:60,demo:'Standing_Dumbbell_Press',
    cue:'Ribs down, glutes on. Press overhead until your arms sit by your ears.',
    how:{setup:['Stand tall, dumbbells at shoulder height, palms forward.','Squeeze glutes and brace your middle.'],go:['Press straight up until arms are by your ears.','Lower with control to the shoulders.'],tips:['Do not lean back to finish the rep.','Stop short of any shoulder pinch.']}},
  pallof:{name:'Pallof press',kind:'reps',sets:2,reps:'10 each side',bw:true,rest:30,est:50,demo:'Pallof_Press',demoNote:'Photo shows a cable. Use your band anchored at chest height.',
    cue:'Band anchored at chest height beside you. Press straight out and resist the twist.',
    how:{setup:['Anchor the band at chest height, stand side-on to it.','Hold the band at your chest with both hands.'],go:['Press your hands straight out in front.','Hold two seconds, bring back to your chest.'],tips:['Hips and shoulders stay square.','Step further away to make it harder.']}},
  goblet_heavy:{name:'Goblet squat, heavy',kind:'reps',sets:4,reps:'5–6 reps',load:8,unit:'one dumbbell',rest:90,est:30,demo:'Goblet_Squat',legs:true,
    cue:'Your heaviest lift. Slow down, strong up. Stop each set with one or two good reps left.',
    how:{setup:['Same set-up as the box squat, a heavier dumbbell.','Big breath in and brace before each rep.'],go:['Sit down under control, as deep as feels good.','Drive up hard.'],tips:['Quality over depth. Your hip decides how low.','Rest the full 90 seconds. Heavy work needs it.']}},
  one_arm_row:{name:'One-arm row',kind:'reps',sets:4,reps:'8 each side',load:7,unit:'one dumbbell',rest:30,est:50,demo:'One-Arm_Dumbbell_Row',
    cue:'Hand and knee on the sofa. Pull your elbow back past your ribs.',
    how:{setup:['One hand and knee on the sofa, back flat.','Dumbbell hangs under your shoulder.'],go:['Pull your elbow back past your ribs.','Lower slowly to a full stretch.'],tips:['Do not twist your torso open.','Think elbow to back pocket.']}},
  rdl_heavy:{name:'Romanian deadlift, heavy',kind:'reps',sets:3,reps:'6 reps',load:7,unit:'each hand',rest:90,est:30,demo:'Stiff-Legged_Dumbbell_Deadlift',legs:true,
    cue:'Same hinge, heavier weights. Keep the dumbbells close to your legs.',
    how:{setup:['As for the Romanian deadlift, heavier dumbbells.','Brace before each rep.'],go:['Hips back, weights slide down the thighs.','Squeeze glutes to stand tall.'],tips:['Back flat, always.','Stop when the hamstrings say stop.']}},
  hops:{name:'Pogo hops',kind:'reps',sets:3,reps:'10 small hops',bw:true,rest:45,est:20,legs:true,
    cue:'Quick two-footed bounces on the balls of your feet. Impact helps bone.',note:'Skip these if your hip complains.',
    how:{setup:['Stand tall, feet hip-width, soft knees.'],go:['Small quick bounces on the balls of your feet.','Land softly and go again straight away.'],tips:['Tiny hops. Height is not the point.','Stop if your hip or knees complain.']}},
  carry:{name:'Farmer hold march',kind:'timed',sets:2,dur:40,load:10,unit:'each hand',rest:60,label:'Tall and slow',demo:'Farmers_Walk',
    cue:'A heavy dumbbell in each hand. Stand tall and march slowly on the spot.',
    how:{setup:['Pick up a heavy dumbbell in each hand with a flat back.'],go:['Stand tall and march slowly on the spot.','Put them down with the same flat back.'],tips:['Shoulders down and back, not shrugged.','Grip hard. It counts.']}},
  pad_intervals:{name:'Pad intervals',kind:'iv',rounds:3,on:45,off:45,onLabel:'Fast · 6 km/h',offLabel:'Easy · 4.5 km/h',
    cue:'Your little runs. Push the pad to 6 for the fast part, back to 4.5 to recover.'},
  pad_iv8:{name:'Pad intervals',kind:'iv',rounds:8,on:45,off:45,onLabel:'Fast · 6 km/h',offLabel:'Easy · 4.5 km/h',
    cue:'Eight rounds. Push to 6 on the fast part, back to 4.5 to recover.'},
  tempo_split:{name:'Tempo split squat',kind:'reps',sets:3,reps:'10 each side',load:3,unit:'each hand',fixed:true,rest:45,est:70,demo:'Split_Squat_with_Dumbbells',legs:true,
    cue:'Three seconds down, pause, drive up. Slow tempo makes light weights count.',
    how:{setup:['Long stride stance, light dumbbells at your sides.'],go:['Count three seconds on the way down.','Pause, then drive up.'],tips:['The slow part is the point. No rushing.','Wall for balance is fine.']}},
  band_row:{name:'Band row',kind:'reps',sets:3,reps:'15 reps',bw:true,rest:45,
    cue:'Band round a door handle or your feet. Squeeze your shoulder blades together.',
    how:{setup:['Loop the band round a closed door handle or your feet.','Step back until it is taut.'],go:['Pull your hands to your ribs.','Squeeze shoulder blades, return slowly.'],tips:['Shoulders away from your ears.','Slow on the way back.']}},
  kick_rdl:{name:'Kickstand RDL',kind:'reps',sets:3,reps:'10 each side',load:3,unit:'each hand',fixed:true,rest:45,est:60,demo:'Stiff-Legged_Dumbbell_Deadlift',demoNote:'Photo shows both feet. Rest one foot back on its toes.',legs:true,
    cue:'Back foot on its toes for balance, weight in the front leg. Hinge back, then stand.',
    how:{setup:['Front foot flat, back foot a step behind on its toes.','Most of your weight on the front leg.'],go:['Hinge back, weights sliding down the front thigh.','Squeeze the front glute to stand.'],tips:['Hips stay level.','The back foot is only a kickstand.']}},
  pull_apart:{name:'Band pull-apart',kind:'reps',sets:3,reps:'15 reps',bw:true,rest:45,est:30,demo:'Band_Pull_Apart',
    cue:'Arms straight at chest height. Pull the band apart until it touches your chest.',
    how:{setup:['Hold the band at chest height, arms straight, hands shoulder-width.'],go:['Pull the band apart until it touches your chest.','Return slowly.'],tips:['Ribs down, no arching.','Lead with the backs of your hands.']}},
  pause_bridge:{name:'Paused glute bridge',kind:'reps',sets:2,reps:'15 reps',bw:true,rest:45,est:50,demo:'Butt_Lift_Bridge',legs:true,
    cue:'Lift, hold three seconds at the top, lower slowly.',
    how:{setup:['On your back, knees bent, feet flat near your bottom.'],go:['Lift your hips until knees, hips and shoulders line up.','Hold three seconds, lower slowly.'],tips:['Push through heels.','Ribs down at the top, no over-arching.']}},
  tempo_goblet:{name:'Tempo goblet squat',kind:'reps',sets:3,reps:'12–15 reps',load:3,unit:'one dumbbell',fixed:true,rest:45,est:50,demo:'Goblet_Squat',legs:true,
    cue:'Three seconds down, a one-second pause at the bottom, then stand.',
    how:{setup:['Dumbbell at your chest, feet a little wider than hips.'],go:['Three seconds down, one-second pause.','Stand up strong.'],tips:['Use a chair behind you as a depth guide if you like.','Knees out over the toes.']}},
  face_pull:{name:'Band face pull',kind:'reps',sets:3,reps:'15 reps',bw:true,rest:45,est:35,demo:'Face_Pull',demoNote:'Photo shows a cable. Use your band anchored high.',
    cue:'Band anchored high. Pull towards your forehead, elbows wide.',
    how:{setup:['Anchor the band above head height, at a door top.','Hold the ends, arms straight, step back.'],go:['Pull towards your forehead, elbows high and wide.','Return slowly.'],tips:['Squeeze between the shoulder blades.','Light band, perfect reps.']}},
  jacks:{name:'Jacks and march',kind:'iv',rounds:4,on:30,off:30,onLabel:'Fast · jacks or quick march',offLabel:'Easy · slow march',
    cue:'Jumping jacks if your hip is happy. A fast march works just as well.'},
  jacks8:{name:'Jacks and march',kind:'iv',rounds:8,on:30,off:30,onLabel:'Fast · jacks or quick march',offLabel:'Easy · slow march',
    cue:'Eight rounds. Jacks if your hip is happy, a fast march if not.'},
  pad_walk:{name:'Easy pad walk',kind:'timed',dur:1200,label:'4.5–5 km/h',cue:'Conversational pace. A podcast helps.'},
  walk_out:{name:'Easy walk outside',kind:'timed',dur:1200,label:'Conversational pace',cue:'Out the door and round the block. Twenty minutes counts.'},
  piri_wall:{name:'Piriformis stretch against wall',kind:'hold',holds:2,dur:15,demo:'Ankle_On_The_Knee',demoNote:'Same stretch, wall optional.',
    cue:'On your back, one foot on the wall, the other ankle over that knee. Shuffle closer to deepen.',
    how:{setup:['Lie on your back near a wall, one foot flat on it.','Cross the other ankle over that knee.'],go:['Shuffle closer to the wall until you feel the stretch in your bottom.','Breathe slowly through the hold.'],tips:['Stretch, not pain.','Keep your pelvis flat on the floor.']}},
  piri_sit:{name:'Piriformis stretch in sitting',kind:'hold',holds:2,dur:15,
    cue:'Sit tall, ankle over the opposite knee. Lean forward from the hips with a long spine.',
    how:{setup:['Sit tall on a chair, feet flat.','Cross one ankle over the opposite knee.'],go:['Lean forward from your hips, spine long.','Hold and breathe.'],tips:['Lean from the hips, not by rounding your back.']}},
  glute_str:{name:'Gluteal muscle stretch',kind:'hold',holds:2,dur:15,demo:'Knee_Across_The_Body',
    cue:'On your back, draw one knee gently towards the opposite shoulder.',note:'This one brings the thigh across your body. Check with your physio that it suits your hip.',
    how:{setup:['On your back, one leg long.'],go:['Hug the other knee gently towards the opposite shoulder.','Hold and breathe.'],tips:['Gentle. Stop before any pinch at the front of the hip.']}},
  supine_flex:{name:'Supine passive hip flexion',kind:'hold',holds:2,dur:15,demo:'One_Knee_To_Chest',
    cue:'On your back, hug one knee gently towards your chest. The other leg stays long.',
    how:{setup:['On your back, both legs long.'],go:['Hug one knee gently to your chest.','Hold, then swap.'],tips:['Let the long leg relax into the floor.']}}
};

const SESS = {
  A:{title:'Session A',sub:'Squat, hinge and push',type:'full',loc:'uk',legs:true,items:['pad_warm',{pair:['goblet_box','knee_push']},{pair:['hip_thrust','rdl']},'dead_bug','pad_intervals']},
  B:{title:'Session B',sub:'Single leg and pull',type:'full',loc:'uk',legs:true,items:['pad_warm',{pair:['split_squat','row']},{pair:['step_up','db_press']},'pallof','pad_intervals']},
  C:{title:'Session C',sub:'The heavy day, for muscle and bone',type:'full',loc:'uk',legs:true,items:['pad_warm',{pair:['goblet_heavy','one_arm_row']},'rdl_heavy','hops','carry']},
  P1:{title:'Paris one',sub:'Slow tempo, band and light dumbbells',type:'full',loc:'paris',legs:true,items:['march_warm',{pair:['tempo_split','band_row']},{pair:['kick_rdl','pull_apart']},'pause_bridge','jacks']},
  P2:{title:'Paris two',sub:'Squat, push and stairs',type:'full',loc:'paris',legs:true,items:['march_warm',{pair:['tempo_goblet','knee_push']},{pair:['step_up','face_pull']},'dead_bug','jacks']},
  shortUK:{title:'Ten-minute version',sub:'The minimum that keeps the week alive',type:'short',loc:'uk',legs:true,items:[{id:'pad_warm',dur:120},{pair:['goblet_box','row'],sets:2,rest:45},{id:'hip_thrust',sets:2,rest:45},{id:'dead_bug',sets:1}]},
  shortParis:{title:'Ten-minute version',sub:'The minimum that keeps the week alive',type:'short',loc:'paris',legs:true,items:[{id:'march_warm',dur:120},{pair:['tempo_goblet','band_row'],sets:2,rest:45},{id:'pause_bridge',sets:2},{id:'dead_bug',sets:1}]},
  padIV:{title:'Pad intervals',sub:'Your little runs, eight rounds',type:'cardio',loc:'uk',items:['pad_warm','pad_iv8','pad_cool']},
  parisIV:{title:'Cardio intervals',sub:'Jacks and fast marching, eight rounds',type:'cardio',loc:'paris',items:['march_warm','jacks8','march_cool']},
  hip:{title:'Hip block',sub:'Your physio’s four stretches',type:'hip',items:['piri_wall','piri_sit','glute_str','supine_flex']},
  walkUK:{title:'Easy walk',sub:'Twenty minutes on the pad',type:'walk',items:['pad_walk']},
  walkParis:{title:'Easy walk',sub:'Twenty minutes outside',type:'walk',items:['walk_out']}
};
const BASE_EX = JSON.parse(JSON.stringify(EX));
const BASE_SESS = JSON.parse(JSON.stringify(SESS));
const POINTS = {full:30, short:15, cardio:20, hip:10, walk:10};
const ORDER = {uk:['A','B','C'], paris:['P1','P2']};
const TRAINING = new Set(['full','short','cardio']);

const REGIONS = [
  {name:'Hollowmere', lore:'Reed paths over still water. Every step you take, the mist gives back a little more ground.', gate:'The Ferryman’s Gate'},
  {name:'The Lantern Wood', lore:'Old trees hung with lamps nobody remembers lighting. They brighten when you pass.', gate:'The Root Arch'},
  {name:'Saltglass Coast', lore:'Cliffs of green glass where the tide hums at night. The wind does not care how tired you are.', gate:'The Tide Door'},
  {name:'Thornwick Pass', lore:'A narrow way between mountains. Slow is the only speed here, and slow still arrives.', gate:'The High Stair'},
  {name:'The Drowned Library', lore:'Shelves under shallow water. Some books still open if you are patient.', gate:'The Reading Gate'},
  {name:'Ashwell', lore:'Warm stone, a red sky, the smell of iron and fresh bread. Everyone here carries something heavy.', gate:'The Forge Arch'},
  {name:'Greywater Reach', lore:'A wide river and a long patience. The current rewards whoever keeps rowing.', gate:'The Weir'},
  {name:'The Quiet Spires', lore:'Towers that ring once a day. Nobody knows for whom. Today, possibly you.', gate:'The Bell Gate'},
  {name:'Mothlight Fen', lore:'Soft wings and softer ground. Mind your footing and keep going.', gate:'The Moth Door'},
  {name:'Harrow Vale', lore:'Fields turned and waiting. Something you planted months ago is coming up.', gate:'The Barn Gate'},
  {name:'The Glass Orchard', lore:'Fruit that chimes when the wind moves. It only ripens for the stubborn.', gate:'The Orchard Wall'},
  {name:'The Last Lookout', lore:'The final climb. From here you can see every road you walked to get here.', gate:'The Sky Gate'}
];

const STAGES = [
  {at:0,  name:'Egg', colours:null},
  {at:3,  name:'Hatchling', colours:['#6F78E6','#4C55C4','#AEB3F6']},
  {at:12, name:'Fledgling', colours:['#9A6BE0','#7246C0','#CDB5F4']},
  {at:30, name:'Drake', colours:['#C65BA8','#9A3E84','#EEB0DA']},
  {at:60, name:'Elder', colours:['#E2665E','#B5443F','#F7BE8C']}
];

const DEFAULT_REWARDS = [
  ['Coffee and a pastry somewhere lovely','small'],['A new botanical or oil for your body butters','small'],['A long bath with good salts','small'],['An hour with a book, phone off','small'],
  ['A new fantasy hardback','medium'],['An album or a record','medium'],['A long lunch on your own','medium'],['A cinema trip, your pick','medium'],
  ['A massage or spa afternoon','big'],['Concert or theatre tickets','big'],['New training kit','big'],['A proper dinner out in Paris','big']
].map((r,i)=>({id:'r'+(i+1), name:r[0], size:r[1]}));
const SIZE_COST = {small:100, medium:400, big:1200};
const SIZE_NAME = {small:'Small', medium:'Medium', big:'Big'};

/* ================= State ================= */
const S = {loc:'uk', loads:{}, step:2, voice:true, theme:'system', dragon:'Pip', rewards:DEFAULT_REWARDS, rewardsUpdated:0,
  redemptions:[], prizes:{}, planApplied:0, nudged:{}, updated:0, lastSync:0};
let sessions = [];
let plan = {};
let GH = {owner:'nattyvs', repo:'movement-data', token:''};
const ui = {tab:'today', screen:'tab', run:null, sheet:null, last:null, trainAnyway:false, sync:'off', syncMsg:'', guide:null};

const LS = 'movement-v3', LSGH = 'movement-gh';
function saveLocal(){ try{ localStorage.setItem(LS, JSON.stringify({S, sessions, plan})); }catch(e){} }
function loadLocal(){
  try{ const c = JSON.parse(localStorage.getItem(LS)||'null'); if(c){ Object.assign(S, c.S||{}); sessions = c.sessions||[]; plan = c.plan||{}; } }catch(e){}
  try{ const g = JSON.parse(localStorage.getItem(LSGH)||'null'); if(g) Object.assign(GH, g); }catch(e){}
}
function touch(){ S.updated = Date.now(); saveLocal(); queueSync(); }

/* Claude's plan.json can override exercises, sessions, loads and add a coach note. */
function applyPlan(){
  for(const k of Object.keys(EX)) delete EX[k];
  Object.assign(EX, JSON.parse(JSON.stringify(BASE_EX)));
  for(const k of Object.keys(SESS)) delete SESS[k];
  Object.assign(SESS, JSON.parse(JSON.stringify(BASE_SESS)));
  const p = plan || {};
  if(p.exercises) for(const [id,o] of Object.entries(p.exercises)) EX[id] = Object.assign(EX[id]||{}, o);
  if(p.sessions) for(const [id,o] of Object.entries(p.sessions)) SESS[id] = Object.assign(SESS[id]||{}, o);
  if(p.order) for(const [loc,arr] of Object.entries(p.order)) ORDER[loc] = arr;
  if(p.loads && (p.updated||0) > (S.planApplied||0)){ S.loads = Object.assign({}, S.loads, p.loads); S.planApplied = p.updated; }
}

/* ================= Dates & stats ================= */
const pad2 = n => String(n).padStart(2,'0');
const dayKey = d => d.getFullYear()+'-'+pad2(d.getMonth()+1)+'-'+pad2(d.getDate());
const monthKey = d => d.getFullYear()+'-'+pad2(d.getMonth()+1);
function weekStart(d){ const x = new Date(d); x.setHours(0,0,0,0); x.setDate(x.getDate()-((x.getDay()+6)%7)); return x; }
function addDays(d,n){ const x = new Date(d); x.setDate(x.getDate()+n); return x; }
const isTraining = s => TRAINING.has(s.kind);
const sorted = () => sessions.slice().sort((a,b)=>b.ts-a.ts);
function dayOfYear(d){ return Math.floor((d - new Date(d.getFullYear(),0,0))/864e5); }

function weekInfo(ref, isCurrent){
  const start = weekStart(ref), days = [];
  for(let i=0;i<7;i++){ const k = dayKey(addDays(start,i)); days.push({key:k, list:sessions.filter(s=>s.day===k)}); }
  const all = days.flatMap(d=>d.list);
  const count = all.filter(isTraining).length;
  const paris = all.some(s=>s.location==='paris') || (isCurrent && S.loc==='paris');
  return {start, days, all, count, target: paris ? 2 : 3};
}
function weeksOnTarget(){
  const now = new Date(); let n = 0;
  const cur = weekInfo(now, true); if(cur.count >= cur.target) n++;
  for(let w=1; w<200; w++){ const wi = weekInfo(addDays(weekStart(now), -7*w), false); if(wi.count >= wi.target) n++; else break; }
  return n;
}
const trainingTotal = () => sessions.filter(isTraining).length;
const earned = () => sessions.reduce((a,s)=>a+(s.points||0),0);
const spent = () => S.redemptions.reduce((a,r)=>a+(r.cost||0),0);
const balance = () => earned() - spent();
function daysSinceTraining(){
  const t = sorted().find(isTraining); if(!t) return null;
  const a = new Date(t.day+'T00:00:00'), b = new Date(dayKey(new Date())+'T00:00:00');
  return Math.round((b-a)/864e5);
}

/* realm */
function startMonth(){ const s = sorted(); return s.length ? monthKey(new Date(s[s.length-1].ts)) : monthKey(new Date()); }
function monthsBetween(a,b){ const [ay,am]=a.split('-').map(Number), [by,bm]=b.split('-').map(Number); return (by-ay)*12+(bm-am); }
function monthTarget(mk){ const c = plan.challenges && plan.challenges[mk]; if(c && c.target) return c.target; return mk===startMonth() ? 10 : 12; }
function monthCount(mk){ return sessions.filter(s=>isTraining(s) && s.day.slice(0,7)===mk).length; }
function region(mk){ const i = Math.max(0, monthsBetween(startMonth(), mk)); return Object.assign({index:i}, REGIONS[i % REGIONS.length]); }
function prizeFor(mk){ const id = S.prizes[mk]; return S.rewards.find(r=>r.id===id) || S.rewards.find(r=>r.size==='big') || S.rewards[0]; }
function gateClaimed(mk){ return S.redemptions.some(r=>r.source==='gate' && r.month===mk); }

/* dragon */
function stage(){ const n = trainingTotal(); let s = STAGES[0], i = 0; STAGES.forEach((x,k)=>{ if(n>=x.at){ s=x; i=k; } }); return Object.assign({index:i, n}, s); }
function nextStage(){ const st = stage(); return STAGES[st.index+1] || null; }
function mood(){ const d = daysSinceTraining(); if(d===null) return 'new'; if(d<=1) return 'smug'; if(d<=3) return 'peckish'; return 'sulk'; }

/* ================= Dragon lines and nudges ================= */
const LINES = {
  egg:['Still an egg. Warm me up with a session, would you.','Egg. Waiting. Not impressed yet.','I can hear you not training from in here.'],
  ready:['I’ve already picked today’s session. You’re welcome.','The weights won’t lift themselves. I checked.','Begin. I’ll supervise from up here.','Twenty-odd minutes. You’ve sat through longer meetings.'],
  recovery:['Rest day. I’m napping professionally.','We rest today. Doctor’s orders. I’m the doctor.','Recovery is training. I read that somewhere. I can’t read.'],
  done:['That’ll do. I’m going back to sleep.','Fine. That was good. Don’t let it go to your head.','I saw that. I’m telling everyone.','Done. I may have grown a scale. Don’t stare.'],
  hipOnly:['Stretched. Very dignified. I might have hips. Unclear.'],
  peckish:['Three days. I’m not wasting away. I’m a bit see-through.','Remember me? Small. Scaly. Peckish.'],
  sulk:['I’m not sulking. I’m resting my face.','Fine. I’ll sit on this cold rock. Ten minutes and I’ll forget it happened.'],
  paris:['Paris stairs count as a mountain. I’ve decided.','Light kit, slow tempo. Very continental.'],
  week:['Week done. I’ve grown. Slightly. Don’t make it weird.']
};
function pickLine(key){ const a = LINES[key]; return a[dayOfYear(new Date()) % a.length]; }
function dragonLine(p){
  const st = stage();
  if(st.index===0 && !p.trained) return pickLine('egg');
  if(p.trained) return p.wk.count >= p.wk.target ? pickLine('week') : pickLine('done');
  if(p.recovery) return pickLine('recovery');
  if(S.loc==='paris') return pickLine('paris');
  const m = mood();
  if(m==='peckish') return pickLine('peckish');
  if(m==='sulk') return pickLine('sulk');
  if(p.hipDone) return pickLine('hipOnly');
  return pickLine('ready');
}

/* One nudge a day at most, only when it says something true. */
function findNudge(p){
  const today = dayKey(new Date());
  if(S.nudged[today] || p.trained) return null;
  const now = new Date(), hour = now.getHours();
  const recent = sorted();
  const st = stage();
  if(st.index>0 && S.seenStage!==st.index && trainingTotal()>=st.at && st.at>0) return {id:'stage', head:'New colours', body:`I’m a ${st.name.toLowerCase()} now. Look at me. No, properly.`, stage:true};
  const d = daysSinceTraining();
  if(d!==null && d>=5) return {id:'back', head:'Oh, you’re back', body:'I wasn’t waiting. I was resting my face. Ten minutes?', short:true};
  const shortRun = recent.filter(isTraining).slice(0,3);
  if(shortRun.length===3 && shortRun.every(s=>s.kind==='short')) return {id:'trilogy', head:'A trilogy', body:'Three short ones in a row. Bold. Book four is a full session.'};
  const hipDays = [0,1].map(k=>dayKey(addDays(now,-k-1)));
  if(sessions.length>2 && hipDays.every(k=>!sessions.some(s=>s.day===k && s.kind==='hip'))) return {id:'hip', head:'Group chat', body:'Your physio and I have a group chat. We’re concerned. Mildly. Five minutes of hip?', hip:true};
  const wk = p.wk, dow = (now.getDay()+6)%7;
  if(dow>=3 && !wk.all.some(s=>s.legs)) return {id:'legs', head:'All wings, no landing gear', body:'No legs this week yet. Dragons notice these things.'};
  const easy = Object.keys(S.loads).find(id=>{ const last2 = recent.filter(s=>s.efforts && s.efforts[id]).slice(0,2); return last2.length===2 && last2.every(s=>s.efforts[id]==='easy'); });
  if(easy && EX[easy]) return {id:'easy', head:'Easy, was it', body:`${EX[easy].name}. Rude. It’s going up.`};
  if(hour>=21) return {id:'late', head:'It’s late', body:'Hip block and bed. I’ll allow it.', hip:true};
  return null;
}

/* ================= Planning ================= */
function nextFull(){
  const order = ORDER[S.loc];
  const last = sorted().find(s => s.kind==='full' && order.includes(s.code));
  return last ? order[(order.indexOf(last.code)+1)%order.length] : order[0];
}
const shortCode = () => S.loc==='uk' ? 'shortUK' : 'shortParis';
const walkCode = () => S.loc==='uk' ? 'walkUK' : 'walkParis';
const cardioCode = () => S.loc==='uk' ? 'padIV' : 'parisIV';
function plan_(){
  const now = new Date(), t = dayKey(now), y = dayKey(addDays(now,-1));
  const todays = sessions.filter(s=>s.day===t);
  const hipDone = todays.some(s=>s.kind==='hip');
  const trained = todays.find(isTraining);
  const walked = todays.find(s=>s.kind==='walk');
  const trainedY = sessions.some(s=>s.day===y && isTraining(s));
  const recovery = !trained && trainedY && !ui.trainAnyway;
  let main = null;
  if(!trained){ main = recovery ? (walked ? null : walkCode()) : nextFull(); }
  return {hipDone, trained, walked, recovery, main, wk:weekInfo(now,true)};
}

/* ================= Building a session ================= */
function build(code, trim){
  const steps = [];
  const work = (id,s,n) => ({t:'work', ex:id, set:s, of:n});
  SESS[code].items.forEach(it => {
    const o = typeof it==='string' ? {id:it} : it;
    if(o.pair){
      const [a,b] = o.pair; let n = o.sets || EX[a].sets; if(trim) n = Math.min(2,n);
      const rest = o.rest || EX[a].rest;
      for(let s=1;s<=n;s++) steps.push(work(a,s,n),{t:'rest',dur:20},work(b,s,n),{t:'rest',dur:rest});
      return;
    }
    const e = EX[o.id];
    if(e.kind==='reps'){
      let n = o.sets || e.sets; if(trim) n = Math.min(2,n);
      for(let s=1;s<=n;s++) steps.push(work(o.id,s,n),{t:'rest',dur:o.rest||e.rest});
    } else if(e.kind==='timed'){
      const n = o.sets || e.sets || 1; let dur = o.dur || e.dur; if(trim && (o.id==='pad_warm'||o.id==='march_warm')) dur = Math.min(dur,120);
      for(let s=1;s<=n;s++){ steps.push({t:'time',ex:o.id,set:s,of:n,dur}); if(n>1 && s<n) steps.push({t:'rest',dur:e.rest||30}); }
    } else if(e.kind==='iv'){
      const R = trim ? Math.min(2,e.rounds) : e.rounds;
      for(let r=1;r<=R;r++) steps.push({t:'iv',ex:o.id,set:r,of:R,phase:'on',dur:e.on},{t:'iv',ex:o.id,set:r,of:R,phase:'off',dur:e.off});
    } else if(e.kind==='hold'){
      let first = true;
      for(let h=1;h<=e.holds;h++) for(const side of ['Left','Right']){ steps.push({t:'hold',ex:o.id,set:h,of:e.holds,side,dur:e.dur,lead:first?8:5}); first=false; }
    }
  });
  while(steps.length && steps[steps.length-1].t==='rest') steps.pop();
  steps.forEach((s,i)=>{ const p = steps[i-1]; s.auto = !!p && ((s.t==='hold'&&p.t==='hold')||(s.t==='iv'&&p.t==='iv')); });
  return steps;
}
function estMin(code, trim){
  const secs = build(code, trim).reduce((a,s)=>a+(s.t==='work' ? (EX[s.ex].est||40) : (s.dur+(s.lead||0))),0);
  return Math.max(1, Math.round(secs/60));
}
const loadOf = id => (S.loads[id] ?? EX[id].load);
const hasLoad = id => EX[id] && EX[id].load !== undefined && !EX[id].bw;

/* ================= Sound, voice, screen ================= */
let actx = null, wl = null, voiceGB = null;
function audioOn(){
  try{ if(navigator.audioSession) navigator.audioSession.type = 'playback'; }catch(e){}
  try{ if(!actx) actx = new (window.AudioContext||window.webkitAudioContext)(); if(actx.state==='suspended') actx.resume(); }catch(e){}
  try{ if(window.speechSynthesis && !voiceGB){ const vs = speechSynthesis.getVoices(); voiceGB = vs.find(v=>/en-GB/i.test(v.lang) && /female|serena|kate|stephanie|martha/i.test(v.name)) || vs.find(v=>/en-GB/i.test(v.lang)) || null; } }catch(e){}
}
function tone(f=880, len=.18, vol=.28){
  if(!actx) return;
  try{ const t = actx.currentTime, o = actx.createOscillator(), g = actx.createGain();
    o.frequency.value = f; o.type = 'sine'; g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(vol,t+.02); g.gain.exponentialRampToValueAtTime(.0001,t+len);
    o.connect(g).connect(actx.destination); o.start(t); o.stop(t+len+.03); }catch(e){}
}
const chime = () => { tone(784,.16); setTimeout(()=>tone(1046,.26),140); };
function say(text){
  if(!S.voice || !window.speechSynthesis) return;
  try{ speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = 'en-GB'; if(voiceGB) u.voice = voiceGB; u.rate = 1.02; speechSynthesis.speak(u); }catch(e){}
}
function flash(word, rest){
  const f = document.getElementById('flash'); f.textContent = word; f.classList.toggle('rest', !!rest);
  f.classList.remove('on'); void f.offsetWidth; f.classList.add('on');
}
async function lockScreen(){ try{ if(navigator.wakeLock) wl = await navigator.wakeLock.request('screen'); }catch(e){} }
function unlockScreen(){ try{ wl && wl.release(); }catch(e){} wl = null; }
document.addEventListener('visibilitychange', ()=>{ if(document.visibilityState==='visible'){ if(ui.screen==='run') lockScreen(); queueSync(); } });

/* ================= Session runner ================= */
function startSession(code, trim){
  audioOn(); lockScreen();
  const steps = build(code, trim), loads = {};
  steps.forEach(s=>{ if(s.ex && hasLoad(s.ex)) loads[s.ex] = loadOf(s.ex); });
  ui.run = {code, trim:!!trim, steps, i:0, timer:null, started:Date.now(), loads, done:0, efforts:{}, lastSec:null};
  ui.screen = 'run'; ui.sheet = null; enterStep(true); window.scrollTo(0,0);
}
function spokenFor(s){
  const e = EX[s.ex];
  if(s.t==='work') return `${e.name}. ${s.of>1?`Set ${s.set} of ${s.of}. `:''}${e.reps}.`;
  if(s.t==='rest'){ const nx = ui.run.steps[ui.run.i+1]; return nx && EX[nx.ex] ? `Rest. Next, ${EX[nx.ex].name}.` : 'Rest.'; }
  if(s.t==='iv') return s.phase==='on' ? (s.set===1 ? `${e.name}. Fast.` : 'Fast.') : 'Easy.';
  if(s.t==='hold') return `${s.set===1&&s.side==='Left'?e.name+'. ':''}${s.side} side. Get into position.`;
  if(s.t==='time') return `${e.name}. ${e.label}.`;
  return '';
}
function enterStep(first){
  const r = ui.run, s = r.steps[r.i]; r.timer = null; r.lastSec = null;
  if(s.t==='rest' || s.auto) startTimer(s.dur + (s.lead||0));
  say(spokenFor(s));
  render(); if(!first) window.scrollTo({top:0, behavior:'smooth'});
}
function startTimer(sec){ ui.run.timer = {end:Date.now()+sec*1000, total:sec, paused:false, remaining:0}; }
function advance(){
  const r = ui.run, s = r.steps[r.i];
  if(s.t!=='rest') r.done++;
  r.i++;
  if(r.i >= r.steps.length){ chime(); flash('Done'); say('Done. Lovely work.'); finishRun(false); return; }
  const n = r.steps[r.i];
  if(s.t==='rest'){ flash('Go'); tone(1046,.3); }
  else if(n.t==='rest'){ flash('Rest', true); tone(660,.25); }
  else if(n.t==='iv'){ flash(n.phase==='on'?'Fast':'Easy', n.phase!=='on'); tone(n.phase==='on'?1046:660,.25); }
  else if(n.t==='hold'){ flash('Switch', true); tone(880,.22); }
  else { tone(880,.22); }
  enterStep(false);
}
setInterval(()=>{
  const r = ui.run; if(ui.screen!=='run' || !r || !r.timer || r.timer.paused) return;
  const s = r.steps[r.i]; const left = Math.max(0, r.timer.end - Date.now());
  paintTimer(s, left);
  if(s.lead && !r.timer.leadDone && left <= s.dur*1000){ r.timer.leadDone = true; tone(988,.14); say('Hold.'); }
  const sec = Math.ceil(left/1000);
  if(sec !== r.lastSec){ r.lastSec = sec; if(sec<=3 && sec>0 && !(s.lead && left > s.dur*1000)){ tone(620,.08,.2); const b = document.getElementById('ring'); if(b){ b.classList.remove('tick'); void b.offsetWidth; b.classList.add('tick'); } } }
  if(left <= 0) advance();
}, 150);
function fmt(sec){ return sec >= 60 ? Math.floor(sec/60)+':'+pad2(sec%60) : String(sec); }
function paintTimer(s, left){
  const big = document.getElementById('big'); if(!big) return;
  const r = ui.run, totalMs = r.timer ? r.timer.total*1000 : 1;
  let shown = left, lead = false;
  if(s.lead && left > s.dur*1000){ shown = left - s.dur*1000; lead = true; }
  big.textContent = fmt(Math.ceil(shown/1000));
  const ring = document.getElementById('ring'); if(ring) ring.classList.toggle('lead', lead);
  const lbl = document.getElementById('rlbl'); if(lbl && s.t==='hold') lbl.textContent = lead ? 'Get into position' : 'Hold';
  const arc = document.getElementById('arc'); if(arc){ const C = 2*Math.PI*46; arc.style.strokeDashoffset = String(C * (1 - left/totalMs)); }
}
function finishRun(early){
  unlockScreen();
  const r = ui.run; r.early = early;
  r.loaded = [...new Set(r.steps.filter((s,i)=> s.ex && hasLoad(s.ex) && (!early || i < r.i)).map(s=>s.ex))];
  if(r.loaded.length){ ui.screen = 'review'; render(); window.scrollTo(0,0); } else save();
}
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2,7);
function save(){
  const r = ui.run, def = SESS[r.code];
  let kind = def.type; if(r.early && kind==='full') kind = 'short';
  const ups = [];
  (r.loaded||[]).forEach(id=>{
    const used = r.loads[id]; let next = used;
    if(r.efforts[id]==='easy' && !EX[id].fixed){ next = Math.min(25, +(used + S.step).toFixed(2)); if(next>used) ups.push({id,next}); }
    S.loads[id] = next;
  });
  const now = new Date(), mk = monthKey(now);
  const wkBefore = weekInfo(now,true), monthBefore = monthCount(mk), stageBefore = stage().index;
  let points = POINTS[kind] + ups.length*5, bonus = false;
  if(TRAINING.has(kind) && wkBefore.count+1 === wkBefore.target){ points += 25; bonus = true; }
  const doc = {id:'s'+uid(), ts:now.getTime(), day:dayKey(now), kind, code:r.code, title:(r.trim?def.title+', short':def.title), location:S.loc,
    minutes:Math.max(1, Math.round((Date.now()-r.started)/60000)), points, partial:!!r.early, trim:!!r.trim,
    legs: !!def.legs, loads:Object.fromEntries((r.loaded||[]).map(id=>[id, r.loads[id]])), efforts:r.efforts};
  sessions.push(doc);
  const gateNow = TRAINING.has(kind) && monthBefore < monthTarget(mk) && monthCount(mk) >= monthTarget(mk);
  const stageNow = stage().index > stageBefore;
  ui.last = {points, ups, bonus, code:r.code, kind, early:!!r.early, gate:gateNow, mk, stageUp:stageNow};
  ui.run = null; ui.screen = 'celebrate';
  touch(); render(); window.scrollTo(0,0);
}

/* ================= GitHub sync ================= */
let syncing = false, syncTimer = null;
const ghReady = () => !!(GH.owner && GH.repo && GH.token);
function queueSync(){ clearTimeout(syncTimer); syncTimer = setTimeout(sync, 800); }
function b64enc(str){ const bytes = new TextEncoder().encode(str); let bin = ''; for(let i=0;i<bytes.length;i+=0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i,i+0x8000)); return btoa(bin); }
function b64dec(b64){ const bin = atob(b64.replace(/\s/g,'')); const bytes = new Uint8Array(bin.length); for(let i=0;i<bin.length;i++) bytes[i] = bin.charCodeAt(i); return new TextDecoder().decode(bytes); }
async function gh(path, opts={}){
  const res = await fetch(`https://api.github.com/repos/${encodeURIComponent(GH.owner)}/${encodeURIComponent(GH.repo)}/contents/${path}`, Object.assign({cache:'no-store', headers:{Authorization:'Bearer '+GH.token, Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'}}, opts));
  return res;
}
async function ghGet(path){
  const res = await gh(path);
  if(res.status===404) return {sha:null, data:null};
  if(!res.ok) throw new Error('get '+res.status);
  const j = await res.json(); return {sha:j.sha, data:JSON.parse(b64dec(j.content||''))};
}
async function ghPut(path, data, sha, message){
  const body = {message, content:b64enc(JSON.stringify(data,null,2)+'\n')}; if(sha) body.sha = sha;
  const res = await gh(path, {method:'PUT', body:JSON.stringify(body), headers:{Authorization:'Bearer '+GH.token, Accept:'application/vnd.github+json','Content-Type':'application/json'}});
  if(res.status===409 || res.status===422) { const e = new Error('conflict'); e.conflict = true; throw e; }
  if(!res.ok) throw new Error('put '+res.status);
}
function mergeById(a, b){ const m = new Map(); (a||[]).forEach(x=>m.set(x.id,x)); (b||[]).forEach(x=>m.set(x.id,x)); return [...m.values()]; }
const stateOut = () => ({loc:S.loc, step:S.step, voice:S.voice, theme:S.theme, dragon:S.dragon, loads:S.loads, rewards:S.rewards, rewardsUpdated:S.rewardsUpdated,
  redemptions:S.redemptions, prizes:S.prizes, planApplied:S.planApplied, seenStage:S.seenStage||0, updated:S.updated});
async function sync(retry){
  if(!ghReady()){ setSync('off'); return; }
  if(syncing) return; if(!navigator.onLine){ setSync('wait','Offline. Will sync when you have signal.'); return; }
  syncing = true; setSync('busy');
  try{
    // sessions: union by id
    let r = await ghGet('data/sessions.json');
    const remote = (r.data && r.data.sessions) || [];
    const merged = mergeById(remote, sessions).sort((a,b)=>a.ts-b.ts);
    const changed = merged.length !== remote.length || merged.some((s,i)=>JSON.stringify(s)!==JSON.stringify(remote.find(x=>x.id===s.id)));
    sessions = merged;
    if(changed) await ghPut('data/sessions.json', {sessions:merged}, r.sha, `Log ${merged.length} sessions`);
    // state: newer wins for settings, unions for history
    r = await ghGet('data/state.json');
    const rs = r.data || {};
    const remoteNewer = (rs.updated||0) > (S.updated||0);
    if(remoteNewer) ['loc','step','voice','theme','dragon','loads','seenStage'].forEach(k=>{ if(rs[k]!==undefined) S[k] = rs[k]; });
    if((rs.rewardsUpdated||0) > (S.rewardsUpdated||0)){ S.rewards = rs.rewards; S.rewardsUpdated = rs.rewardsUpdated; }
    S.redemptions = mergeById(rs.redemptions, S.redemptions);
    S.prizes = Object.assign({}, rs.prizes||{}, S.prizes);
    S.planApplied = Math.max(rs.planApplied||0, S.planApplied||0);
    S.updated = Math.max(rs.updated||0, S.updated||0);
    const out = stateOut();
    if(!r.data || Object.keys(out).some(k=>JSON.stringify(out[k])!==JSON.stringify(rs[k]))) await ghPut('data/state.json', out, r.sha, 'Update state');
    // plan from Claude
    r = await ghGet('data/plan.json');
    if(r.data){ plan = r.data; applyPlan(); }
    S.lastSync = Date.now(); setSync('ok');
  }catch(e){
    syncing = false;
    if(e.conflict && !retry) return sync(true);
    setSync('err', /401|403/.test(e.message) ? 'GitHub refused the token. Check it in Settings.' : /404/.test(e.message) ? 'Repo not found. Check the name in Settings.' : 'Sync failed. It will try again.');
    saveLocal(); return;
  }
  syncing = false; saveLocal(); applyTheme();
  if(ui.screen==='tab') render();
}
function setSync(state, msg){ ui.sync = state; ui.syncMsg = msg||''; const el = document.getElementById('syncl'); if(el) el.outerHTML = syncLineHTML(); }
function syncLineHTML(){
  const ago = S.lastSync ? relTime(S.lastSync) : '';
  const map = {off:['', 'Saved on this phone. Connect GitHub in Settings to sync.'], busy:['wait','Syncing…'], ok:['ok', `Synced ${ago}`], wait:['wait', ui.syncMsg], err:['err', ui.syncMsg]};
  const [c,t] = map[ui.sync] || map.off;
  return `<div class="syncl" id="syncl"><span class="dot ${c}"></span>${esc(t)}</div>`;
}
function relTime(ts){ const m = Math.round((Date.now()-ts)/60000); if(m<1) return 'just now'; if(m<60) return m+' min ago'; const h = Math.round(m/60); if(h<24) return h+' h ago'; return Math.round(h/24)+' days ago'; }
window.addEventListener('online', ()=>queueSync());

/* ================= Rendering helpers ================= */
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dx = t => esc(t).replace(/([WVY])(?=[a-z\u00e0-\u00ff])/g,'<span class="kw">$1</span>');
const fmtKg = n => (Math.round(n*10)/10).toString().replace(/\.0$/,'')+' kg';
const I = {
  check:'<svg class="ic" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  play:'<svg class="ic" viewBox="0 0 24 24"><path d="M8 5.5v13l10-6.5z" fill="currentColor" stroke="none"/></svg>',
  pin:'<svg class="ic" viewBox="0 0 24 24"><path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/></svg>',
  gear:'<svg class="ic" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 13.5a7.6 7.6 0 0 0 0-3l2-1.5-2-3.4-2.4 1a7.5 7.5 0 0 0-2.6-1.5L14 2.5h-4l-.4 2.6a7.5 7.5 0 0 0-2.6 1.5l-2.4-1-2 3.4 2 1.5a7.6 7.6 0 0 0 0 3l-2 1.5 2 3.4 2.4-1a7.5 7.5 0 0 0 2.6 1.5l.4 2.6h4l.4-2.6a7.5 7.5 0 0 0 2.6-1.5l2.4 1 2-3.4z"/></svg>',
  x:'<svg class="ic" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  back:'<svg class="ic" viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>',
  chev:'<svg class="ic" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>',
  minus:'<svg class="ic" viewBox="0 0 24 24"><path d="M5 12h14"/></svg>',
  plus:'<svg class="ic" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
  vol:'<svg class="ic" viewBox="0 0 24 24"><path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z"/><path d="M15.5 9a4.5 4.5 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11"/></svg>',
  mute:'<svg class="ic" viewBox="0 0 24 24"><path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z"/><path d="M16 10l4 4M20 10l-4 4"/></svg>',
  book:'<svg class="ic" viewBox="0 0 24 24"><path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5zM20 5.5A1.5 1.5 0 0 0 18.5 4H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5z"/></svg>',
  hip:'<svg class="ic" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M12 8v4.5M12 15.8v.2"/></svg>',
  trash:'<svg class="ic" viewBox="0 0 24 24"><path d="M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12"/></svg>',
  up:'<svg class="ic" viewBox="0 0 24 24"><path d="M12 19V5M6 11l6-6 6 6"/></svg>'
};

/* The dragon, drawn in code. Facing left, perched. */
function dragonSVG(opts={}){
  const st = opts.stage || stage(); const m = opts.mood || mood();
  const id = 'dg'+Math.random().toString(36).slice(2,7);
  if(st.index===0){
    const cracks = Math.min(3, trainingTotal());
    return `<svg viewBox="0 0 120 120" aria-label="An egg, waiting" role="img"><g class="bob">
      <ellipse cx="60" cy="112" rx="24" ry="4" fill="#000" opacity=".14"/>
      <path d="M60 22c18 0 30 26 30 52 0 20-13 36-30 36S30 94 30 74c0-26 12-52 30-52z" fill="#EDE6F7" stroke="#C9BEE3" stroke-width="1.5"/>
      <path d="M60 22c18 0 30 26 30 52 0 20-13 36-30 36" fill="none" stroke="#D8CCEF" stroke-width="6" opacity=".7"/>
      <circle cx="48" cy="56" r="3.2" fill="#B9A6E8"/><circle cx="70" cy="44" r="2.4" fill="#E79AC0"/><circle cx="72" cy="78" r="3.6" fill="#9FA6F2"/><circle cx="50" cy="88" r="2.2" fill="#E79AC0"/><circle cx="62" cy="64" r="1.8" fill="#B9A6E8"/>
      ${cracks>=1?'<path d="M44 50l6 5-4 5 7 4" fill="none" stroke="#7A6AA8" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>':''}
      ${cracks>=2?'<path d="M76 58l-5 6 5 4-4 6" fill="none" stroke="#7A6AA8" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>':''}
      ${cracks>=3?'<path d="M56 30l3 6-4 4 5 5" fill="none" stroke="#7A6AA8" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>':''}
    </g></svg>`;
  }
  const [c1,c2,c3] = st.colours; const sz = [0,.78,.88,.96,1][st.index];
  const wing = [0,.55,.8,1,1.12][st.index];
  const lid = m==='smug' ? 'M33 44c4-3 10-3 13 1l-0.5 3c-3-2-8-3-12.5-1z' : m==='peckish' ? 'M33 45c4-3 10-3 13 1l-0.5 5c-3-3-8-3.5-12.5-2z' : m==='sulk' ? 'M33 45c4-3 10-3 13 1l-0.3 7c-3-3.5-8-4-12.7-2.5z' : 'M33 44c4-3 10-3 13 1l-0.5 2.5c-3-2-8-2.5-12.5-1z';
  const elderHorn = st.index>=4 ? `<path d="M58 37c6-10 14-14 19-13-5 4-9 9-12 16z" fill="var(--horn)"/>` : '';
  return `<svg viewBox="0 0 120 120" role="img" aria-label="${esc(S.dragon)}, your dragon">
  <defs><linearGradient id="${id}w" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c3}"/><stop offset="1" stop-color="${c1}"/></linearGradient>
  <linearGradient id="${id}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>
  <g transform="translate(60 118) scale(${sz}) translate(-60 -118)"><g class="bob">
    <ellipse cx="66" cy="114" rx="34" ry="4.5" fill="#000" opacity=".16"/>
    <g class="wingflap"><path transform="translate(70 66) scale(${wing}) translate(-70 -66)" d="M70 66C74 46 86 30 104 22c-2 8-1 14 2 19-6 0-9 3-10 8 4 1 7 4 8 8-7-1-12 1-15 6-5-2-11-1-14 3z" fill="url(#${id}w)" stroke="${c2}" stroke-width="1.4" stroke-linejoin="round"/></g>
    <path d="M88 96c14 4 24-3 22-13-1-6-7-8-10-4 3 0 5 3 3 6-3 4-10 4-17 1z" fill="${c2}"/>
    <path d="M103 79l8-4-2 9z" fill="${c2}"/>
    <ellipse cx="68" cy="88" rx="27" ry="22" fill="url(#${id}b)"/>
    <path d="M58 68l4-7 3 7 4-7 3 7 4-6 3 7 4-5 2 7" fill="${c2}"/>
    <ellipse cx="58" cy="94" rx="15" ry="14" fill="var(--belly)"/>
    <path d="M47 89c7 2 15 2 22 0M46 96c7 2 16 2 23 0M48 103c6 2 13 2 19 0" fill="none" stroke="${c2}" stroke-width="1.1" opacity=".35" stroke-linecap="round"/>
    <ellipse cx="84" cy="104" rx="11" ry="7" fill="${c2}"/>
    <path d="M50 104c-2 5 0 9 5 9h6c2-3 1-7-2-9z" fill="${c1}" stroke="${c2}" stroke-width="1.2"/>
    <path d="M63 105c-1 5 1 8 5 8h6c2-3 0-7-3-8z" fill="${c1}" stroke="${c2}" stroke-width="1.2"/>
    <path d="M52 66c-4-8-4-14-1-18l10 5c-2 4-2 8 0 13z" fill="${c1}"/>
    <path d="M50 38c4-11 12-16 18-15-5 4-8 9-10 16z" fill="var(--horn)"/>
    <path d="M44 38c1-9 5-14 10-15-3 4-4 9-4 14z" fill="var(--horn)" opacity=".9"/>${elderHorn}
    <circle cx="45" cy="50" r="18" fill="url(#${id}b)"/>
    <ellipse cx="30" cy="57" rx="14" ry="10.5" fill="${c1}"/>
    <ellipse cx="31" cy="60" rx="11" ry="6" fill="${c3}" opacity=".35"/>
    <ellipse cx="21" cy="53.5" rx="1.6" ry="1.2" fill="${c2}"/>
    <path d="M18 63c5 2 11 2 16 0" fill="none" stroke="${c2}" stroke-width="1.6" stroke-linecap="round"/>
    <g class="blink"><ellipse cx="40" cy="48" rx="4.6" ry="5.4" fill="var(--eye)"/><circle cx="38.6" cy="46.4" r="1.5" fill="#fff"/></g>
    <path d="${lid}" fill="${c1}"/>
    <path d="M32 41.5c4.5-2.8 10-2.6 14.5 1" fill="none" stroke="${c2}" stroke-width="2.6" stroke-linecap="round"/>
  </g></g></svg>`;
}

function render(){
  document.querySelectorAll('.tab').forEach(t=>t.setAttribute('aria-current', ui.screen==='tab' && t.dataset.tab===ui.tab ? 'page' : 'false'));
  $('tabs').hidden = !(ui.screen==='tab');
  const app = $('app'); app.classList.toggle('run', ui.screen==='run');
  let html = '';
  if(ui.screen==='tab'){
    html = ui.tab==='today' ? todayHTML() : ui.tab==='realm' ? realmHTML() : ui.tab==='treasury' ? treasuryHTML() : progressHTML();
  } else if(ui.screen==='choose') html = chooseHTML();
  else if(ui.screen==='run') html = runHTML();
  else if(ui.screen==='review') html = reviewHTML();
  else if(ui.screen==='celebrate') html = celebrateHTML();
  else if(ui.screen==='settings') html = settingsHTML();
  app.innerHTML = html + (ui.sheet ? sheetHTML() : '');
  startFigure();
  if(ui.screen==='run'){ const r = ui.run; if(r && r.timer) paintTimer(r.steps[r.i], r.timer.paused ? r.timer.remaining : Math.max(0, r.timer.end-Date.now())); }
}

function topbar(){
  return `<header class="top"><span class="brand">Movement</span><div class="r">
    <button class="pill" data-a="loc" aria-label="Location: ${S.loc==='uk'?'London':'Paris'}. Tap to switch.">${I.pin}${S.loc==='uk'?'London':'Paris'}</button>
    <button class="round" data-a="settings" aria-label="Settings">${I.gear}</button></div></header>`;
}

/* ---------- Today ---------- */
function todayHTML(){
  const p = plan_(), now = new Date();
  const date = now.toLocaleDateString('en-GB',{weekday:'long', day:'numeric', month:'long'});
  const items = [{code:'hip', title:'Hip block', meta:estMin('hip')+' min', done:p.hipDone}];
  if(p.main) items.push({code:p.main, title:SESS[p.main].title, meta:estMin(p.main)+' min', done:false});
  else if(p.trained) items.push({title:p.trained.title, meta:'Done', done:true});
  else if(p.walked) items.push({title:'Easy walk', meta:'Done', done:true});
  const next = items.find(x=>!x.done && x.code);
  const mainNext = p.main;
  let head, meta;
  if(!next){ head = 'Done for today'; meta = p.wk.count>=p.wk.target ? 'Week target reached. Rest is part of the plan.' : 'Rest is part of the plan. Back tomorrow.'; }
  else if(!mainNext){ head = 'Stretch, then rest'; meta = 'You’ve trained today. Five minutes of hip work closes it.'; }
  else if(p.recovery){ head = 'Recovery day'; meta = 'You trained yesterday. Stretch, walk easy, come back stronger.'; }
  else { head = SESS[mainNext].title; meta = `${SESS[mainNext].sub} · about ${estMin(mainNext)} min`; }

  let actions = '';
  if(next){
    const firstLabel = next.code==='hip' ? `Begin with the hip block` : 'Begin';
    actions += `<button class="btn-w" data-a="start" data-code="${next.code}"><span>${firstLabel}</span><small>${next.meta}</small></button>`;
    if(mainNext && !p.recovery) actions += `<button class="btn-g" data-a="start" data-code="${shortCode()}">Low day? Ten-minute version <small>${estMin(shortCode())} min</small></button>`;
    if(p.recovery) actions += `<button class="btn-g" data-a="trainanyway">Train anyway</button>`;
  } else if(!p.trained){
    actions += `<button class="btn-g" data-a="start" data-code="${shortCode()}">Fancy ten minutes anyway? <small>${estMin(shortCode())} min</small></button>`;
  }
  actions += `<button class="alt" data-a="choose">Something else</button>`;

  const nudge = findNudge(p);
  const wk = p.wk, tk = dayKey(now);
  const bars = wk.days.map((d,i)=>{
    const k = d.list.some(s=>s.kind==='full')?'full':d.list.some(s=>s.kind==='short')?'short':d.list.some(s=>s.kind==='cardio')?'cardio':d.list.some(s=>s.kind==='walk')?'walk':d.list.some(s=>s.kind==='hip')?'hip':'';
    return `<div class="day ${d.key===tk?'now':''}"><div class="bar ${k}"></div><div class="d">${'MTWTFSS'[i]}</div></div>`;
  }).join('');
  const mk = monthKey(now), rg = region(mk), cnt = Math.min(monthCount(mk), monthTarget(mk)), tgt = monthTarget(mk);
  const log = sorted().slice(0,5).map(s=>`<li><span class="w">${new Date(s.ts).toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'})}</span><span>${esc(s.title)}${s.partial?' <span class="muted">(ended early)</span>':''}</span><span class="p">+${s.points}</span></li>`).join('');

  return `<div class="enter" style="display:grid;gap:14px">${topbar()}
  <section class="gcard" aria-label="Today">
    <div class="perch">${dragonSVG()}</div>
    <h1 style="margin-top:4px;max-width:70%">${dx(head)}</h1>
    <p class="meta">${esc(date)} · ${esc(meta)}</p>
    ${plan.note ? `<p class="meta" style="margin-top:10px;color:#fff"><b>Coach:</b> ${esc(plan.note)}</p>` : ''}
    <div class="row2">${actions}</div>
  </section>
  <div class="say"><q>${dx(dragonLine(p))}</q><span class="by">${esc(S.dragon)}, ${stage().name.toLowerCase()}</span></div>
  <section class="card"><h2 class="ct">This week${wk.all.length?` <span class="aside">${wk.count} of ${wk.target} sessions</span>`:''}</h2>
    ${wk.all.length ? `<div class="week">${bars}</div>` : `<div class="slots">${Array.from({length:wk.target},(_,i)=>`<div class="slot">Session ${i+1}</div>`).join('')}</div>`}
    ${wk.all.length?`<div class="legend"><span><i style="background:var(--g4)"></i>Session</span><span><i style="background:var(--g2)"></i>Short or cardio</span><span><i style="background:var(--teal)"></i>Walk</span><span><i style="background:var(--violet);opacity:.6"></i>Hip block</span></div>`:''}
    <div class="stats">
      <div class="stat"><div class="n c-coral">${wk.count}<span class="muted" style="font-size:18px">/${wk.target}</span></div><div class="k">Sessions</div></div>
      <div class="stat"><div class="n c-amber">${balance().toLocaleString('en-GB')}</div><div class="k">Points to spend</div></div>
      <div class="stat"><div class="n c-violet">${weeksOnTarget()}</div><div class="k">Weeks on target</div></div>
    </div>
  </section>
  <section class="card"><h2 class="ct">Today</h2><div class="items">
    ${items.map(x=>`<div class="it"><span class="tick ${x.done?'on':''}">${x.done?I.check:''}</span><span class="t">${esc(x.title)}</span><span class="m">${x.meta}</span></div>`).join('')}
  </div></section>
  <button class="card teaser" data-tab="realm" aria-label="Open the realm">
    <div><h2 class="ct" style="margin-bottom:8px">Realm</h2><div class="rn">${dx(rg.name)}</div><div class="sub">${cnt} of ${tgt} stones · gate holds ${esc(prizeFor(mk).name.toLowerCase())}</div></div>
    ${miniTrail(cnt,tgt)}
  </button>
  <section class="card"><h2 class="ct">Log <span class="aside">${sessions.length} logged</span></h2>
    ${log ? `<ul class="log">${log}</ul>` : `<p class="empty">Your sessions land here. Start with today’s hip block: five minutes, ten points.</p>`}
  </section>
  ${syncLineHTML()}
  </div>${nudge ? nudgeHTML(nudge) : ''}`;
}
function miniTrail(cnt, tgt){
  const pts = []; const N = Math.min(tgt, 12);
  for(let i=0;i<N;i++){ const t = i/(N-1); pts.push([8+t*96, 40 + Math.sin(t*Math.PI*2.2)*16]); }
  const path = 'M'+pts.map(p=>p.map(v=>v.toFixed(1)).join(' ')).join(' L');
  const filled = Math.round(cnt/tgt*N);
  return `<svg viewBox="0 0 112 64" aria-hidden="true"><path class="mini-trail" d="${path}"/>${pts.map((p,i)=>`<circle class="mini-stone ${i<filled?'on':''}" cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${i===N-1?5:3.4}"/>`).join('')}</svg>`;
}
function nudgeHTML(n){
  return `<div class="scrim" data-a="nudgeoff" role="dialog" aria-modal="true" aria-label="${esc(n.head)}"><div class="sheet" style="text-align:left">
    <div style="display:grid;grid-template-columns:96px 1fr;gap:14px;align-items:center">
      <div style="width:96px;height:96px" class="${n.stage?'hop':''}">${dragonSVG()}</div>
      <div><h3>${dx(n.head)}</h3><p style="margin:0">${esc(n.body)}</p></div>
    </div>
    ${n.short ? `<button class="btn primary" data-a="nudgego" data-code="${shortCode()}">Ten minutes, go</button>` : n.hip ? `<button class="btn primary" data-a="nudgego" data-code="hip">Hip block, five minutes</button>` : ''}
    <button class="btn" data-a="nudgeoff">${n.stage?'Very handsome':'Noted'}</button></div></div>`;
}

/* ---------- Choose ---------- */
function chooseHTML(){
  const full = nextFull();
  const opts = [
    {nm:'Strength', ds:`${SESS[full].title}: ${SESS[full].sub.toLowerCase()}`, times:[[10,'short'],[20,'trim'],[30,'full']]},
    {nm:'Hip and mobility', ds:'Your physio’s four stretches', code:'hip'},
    {nm:S.loc==='uk'?'Pad intervals':'Cardio intervals', ds:SESS[cardioCode()].sub, code:cardioCode()},
    {nm:'Easy walk', ds:SESS[walkCode()].sub, code:walkCode()}
  ];
  return `<div class="enter" style="display:grid;gap:14px">
    <button class="back" data-a="home">${I.back}Today</button>
    <section class="gcard flat"><h1>Pick your own</h1><p class="meta">${S.loc==='uk'?'London kit':'Paris kit'}. Choose a style. For strength, choose how long you’ve got.</p></section>
    <section class="card">${opts.map(o=> o.times ?
      `<div class="opt str" style="cursor:default"><span class="nm">${o.nm}</span><span class="ds">${esc(o.ds)}</span><div class="times">${o.times.map(([m,k])=>`<button class="time" data-a="${k==='trim'?'starttrim':'start'}" data-code="${k==='short'?shortCode():full}" data-trim="${k==='trim'?1:''}">${k==='short'?estMin(shortCode()):k==='trim'?estMin(full,true):estMin(full)} min</button>`).join('')}</div></div>` :
      `<button class="opt" data-a="start" data-code="${o.code}"><span class="nm">${o.nm}</span><span class="ds">${esc(o.ds)}</span><span class="go">${estMin(o.code)} min</span></button>`).join('')}
    </section></div>`;
}

/* ---------- Runner ---------- */
function poseFor(id){ const k = EX_POSE[id]; return k && POSES[k] ? {k, p:POSES[k]} : null; }
function demoBox(id, small){
  const e = EX[id], f = poseFor(id); if(!e || !f) return '';
  return `<div class="demo fig" data-pose="${f.k}">${FIG.svg(f.p.a, Object.assign({label:`${esc(e.name)}, demonstrated`}, f.p))}</div>`;
}
function startFigure(){ const el = document.querySelector('.sheet .demo.fig') || document.querySelector('.demo.fig'); if(el) FIG.animate(el, POSES[el.dataset.pose]); }
function ringHTML(s, label){
  const C = 2*Math.PI*46;
  return `<div class="ringwrap"><div class="ringbox" id="ring"><svg viewBox="0 0 100 100" aria-hidden="true">
    <defs><linearGradient id="rg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="var(--g1)"/><stop offset=".5" stop-color="var(--g3)"/><stop offset="1" stop-color="var(--g4)"/></linearGradient></defs>
    <circle class="trk" cx="50" cy="50" r="46" fill="none" stroke-width="5"/>
    <circle class="arc" id="arc" cx="50" cy="50" r="46" fill="none" stroke="url(#rg)" stroke-width="5" stroke-linecap="round" stroke-dasharray="${C.toFixed(2)}" stroke-dashoffset="0"/></svg>
    <div class="nm"><div class="big num" id="big">${fmt(s.dur)}</div><div class="lbl" id="rlbl">${esc(label||'')}</div></div></div></div>`;
}
function runHTML(){
  const r = ui.run, s = r.steps[r.i], def = SESS[r.code];
  const pct = (r.i/r.steps.length*100).toFixed(1);
  const bar = `<div class="rbar"><div class="r1"><button class="round" data-a="exit" aria-label="Leave session">${I.x}</button><span class="ttl">${esc(def.title)}${r.trim?' · shorter':''}</span>
    <button class="round" data-a="voice" aria-label="${S.voice?'Turn voice off':'Turn voice on'}" aria-pressed="${S.voice}">${S.voice?I.vol:I.mute}</button></div><div class="prog"><i style="width:${pct}%"></i></div></div>`;
  const watch = r.i===0 && TRAINING.has(def.type) ? `<p class="watchnote">Phone on silent? Voice may not play. The screen flashes at every change.</p>` : '';
  let body = '', dock = '';
  const loadRow = id => hasLoad(id) ? `<div class="loadrow"><div class="stepper"><button data-a="load" data-d="-1" aria-label="Less weight">${I.minus}</button><span class="v">${fmtKg(r.loads[id])}</span><button data-a="load" data-d="1" aria-label="More weight">${I.plus}</button></div><span class="muted">${esc(EX[id].unit)}</span></div>` : '';
  const guideBtn = id => EX[id].how ? `<button class="linkbtn" data-a="guide" data-id="${id}" style="justify-self:start">How to do it</button>` : '';

  if(s.t==='work'){
    const e = EX[s.ex];
    body = `${demoBox(s.ex)}
      <div><h1 class="exname">${dx(e.name)}</h1><div class="presc">${esc(e.reps)}<small>Set ${s.set} of ${s.of}</small></div></div>
      ${loadRow(s.ex)}
      <section class="card" style="display:grid;gap:4px"><p class="cue">${esc(e.cue)}</p>${e.note?`<div class="hipnote">${I.hip}<span>${esc(e.note)}</span></div>`:''}${guideBtn(s.ex)}</section>${watch}`;
    dock = `<button class="btn primary xl" data-a="done">${I.check} Set done</button>`;
  } else if(s.t==='rest'){
    const nx = r.steps[r.i+1], ne = nx && EX[nx.ex];
    body = `<div class="phase" style="margin-top:6px">Rest</div>${ringHTML(s,'')}
      ${ne ? `<section class="card nextcard">${poseFor(nx.ex)?`<div class="th fig">${FIG.svg(poseFor(nx.ex).p.a, poseFor(nx.ex).p)}</div>`:'<div class="th"></div>'}<div><div class="nn">Next: ${esc(ne.name)}</div><div class="muted" style="font-size:14px">${nx.of>1?`Set ${nx.set} of ${nx.of} · `:''}${esc(ne.reps||ne.label||'')}${hasLoad(nx.ex)?' · '+fmtKg(r.loads[nx.ex]):''}</div></div></section>` : ''}`;
    dock = `<button class="btn sm" data-a="plus15">+15 s</button><button class="btn primary" data-a="skip">Skip rest</button>`;
  } else {
    const e = EX[s.ex], running = !!r.timer, paused = running && r.timer.paused;
    let label = '', phase = '';
    if(s.t==='iv'){ phase = s.phase==='on' ? 'Fast' : 'Easy'; label = (s.phase==='on'?e.onLabel:e.offLabel).split(' · ')[1]||''; }
    else if(s.t==='hold'){ phase = `${s.side} side`; label = running ? 'Hold' : 'Get into position'; }
    else { phase = e.label; label = s.of>1 ? `Set ${s.set} of ${s.of}` : ''; }
    const sub = s.t==='iv' ? `Round ${s.set} of ${s.of}` : s.t==='hold' ? `Hold ${s.set} of ${s.of}` : '';
    body = `<div><h1 class="exname">${dx(e.name)}</h1></div>
      <div class="phase">${esc(phase)}<small>${esc(sub)}</small></div>
      ${ringHTML(s,label)}
      ${demoBox(s.ex,true)}${loadRow(s.ex)}
      <section class="card" style="display:grid;gap:4px"><p class="cue">${esc(e.cue)}</p>${e.note?`<div class="hipnote">${I.hip}<span>${esc(e.note)}</span></div>`:''}${guideBtn(s.ex)}</section>${watch}`;
    dock = !running ? `<button class="btn primary xl" data-a="tstart">${I.play} Start</button><button class="btn sm" data-a="skip">Skip</button>`
                    : `<button class="btn" data-a="tpause">${paused?'Resume':'Pause'}</button><button class="btn sm" data-a="skip">Skip</button>`;
  }
  return bar + `<div class="enter" style="display:grid;gap:14px" data-step="${r.i}">${body}</div><div class="dock"><div class="in">${dock}</div></div>`;
}

/* ---------- Review & celebrate ---------- */
function reviewHTML(){
  const r = ui.run;
  return `<div class="enter" style="display:grid;gap:14px">
    <section class="gcard flat"><h1>How did the weights feel?</h1><p class="meta">${esc(SESS[r.code].title)}${r.early?', ended early':''}. Reps left in the tank on your last set. Easy means it goes up next time.</p></section>
    <section class="card">${r.loaded.map(id=>{ const e = EX[id], v = r.efforts[id];
      const ch = (val,label,hint) => `<button class="chip" data-a="effort" data-id="${id}" data-v="${val}" aria-pressed="${v===val}">${label}<small>${hint}</small></button>`;
      return `<div class="eff"><div class="nm">${esc(e.name)}</div><div class="ld">${fmtKg(r.loads[id])} · ${esc(e.unit)}${e.fixed?' · Paris weights':''}</div><div class="chips">${ch('easy','Easy','3+ left')}${ch('right','Right','1–2 left')}${ch('max','Max','0 left')}</div></div>`; }).join('')}
    </section></div><div class="dock"><div class="in"><button class="btn primary xl" data-a="save">Save session</button></div></div>`;
}
function celebrateHTML(){
  const L = ui.last || {points:0, ups:[]}; const p = plan_(); const wk = p.wk;
  const cont = (L.kind==='hip' && p.main) ? p.main : null;
  const st = stage();
  const line = wk.count >= wk.target ? 'Week target reached.' : `${wk.count} of ${wk.target} sessions this week.`;
  const mk = L.mk || monthKey(new Date()); const rg = region(mk);
  const said = L.gate ? 'The gate’s open. I’d carry your prize but my arms are tiny.' : L.stageUp ? `New colours. I’m a ${st.name.toLowerCase()} now. Don’t make it weird.` : L.kind==='hip' ? pickLine('hipOnly') : pickLine('done');
  return `<div class="enter" style="display:grid;gap:14px">
    <section class="gcard">
      <div class="perch ${L.stageUp||L.gate?'hop':''}">${dragonSVG()}</div>
      <div class="pts"><svg class="sign" viewBox="0 0 10 10" aria-hidden="true"><path d="M5 0v10M0 5h10"/></svg><span class="visually-hidden" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">plus </span>${L.points}</div>
      <p class="meta">${esc(SESS[L.code]?.title||'Session')} logged. ${L.bonus?'Includes 25 for hitting your week. ':''}${line} ${TRAINING.has(L.kind)?`Stone ${Math.min(monthCount(mk),monthTarget(mk))} of ${monthTarget(mk)} in ${esc(rg.name)}.`:''}</p>
    </section>
    <div class="say"><q>${dx(said)}</q><span class="by">${esc(S.dragon)}, ${st.name.toLowerCase()}</span></div>
    ${L.gate ? `<section class="card"><h2 class="ct">${esc(rg.gate)}</h2><p style="margin:0 0 12px">You reached the gate of ${esc(rg.name)}. Your prize is waiting: <b>${esc(prizeFor(mk).name)}</b>.</p><button class="btn primary" style="width:100%" data-a="claimgate" data-mk="${mk}">Claim it</button></section>` : ''}
    ${L.ups.length ? `<section class="card"><h2 class="ct">Going up next time</h2><ul class="uplist">${L.ups.map(u=>`<li>${I.up}<span>${esc(EX[u.id].name)}: ${fmtKg(u.next)}</span></li>`).join('')}</ul></section>` : ''}
    ${TRAINING.has(L.kind) ? `<p class="watchnote">Wearing your Watch? Stop the workout there too.</p>` : ''}
  </div><div class="dock"><div class="in">${cont?`<button class="btn primary" data-a="start" data-code="${cont}">Continue to ${esc(SESS[cont].title)}</button>`:''}<button class="btn ${cont?'':'primary xl'}" data-a="home">Back to today</button></div></div>`;
}

/* ---------- Realm ---------- */
function rng(seed){ let h = 1779033703 ^ seed.length; for(let i=0;i<seed.length;i++){ h = Math.imul(h ^ seed.charCodeAt(i), 3432918353); h = h<<13 | h>>>19; } return function(){ h = Math.imul(h ^ (h>>>16), 2246822507); h = Math.imul(h ^ (h>>>13), 3266489909); return ((h ^= h>>>16)>>>0)/4294967296; }; }
function mapSVG(mk){
  const rg = region(mk), tgt = monthTarget(mk), cnt = Math.min(monthCount(mk), tgt), open = monthCount(mk) >= tgt;
  const R = rng(rg.name), W = 340, H = 430;
  let topo = '';
  for(let c=0;c<3;c++){
    const cx = 40+R()*260, cy = 60+R()*300, ph = R()*6;
    for(let k=1;k<=6;k++){
      const rad = 14*k + R()*6; let d = '';
      for(let a=0;a<=48;a++){ const t = a/48*Math.PI*2; const rr = rad*(1+.14*Math.sin(3*t+ph+k*.4)+.07*Math.sin(5*t+ph)); d += (a?'L':'M')+(cx+Math.cos(t)*rr*1.25).toFixed(1)+' '+(cy+Math.sin(t)*rr).toFixed(1); }
      topo += `<path class="topo" d="${d}Z" opacity="${(1-k*.1).toFixed(2)}"/>`;
    }
  }
  const pts = []; const ph = R()*6, amp = 70+R()*30;
  for(let i=0;i<=60;i++){ const t = i/60; pts.push([W/2 + Math.sin(t*Math.PI*2.4+ph)*amp*(1-t*.35), H-34 - t*(H-92)]); }
  const at = t => pts[Math.round(t*60)];
  const pathD = 'M'+pts.map(p=>p.map(v=>v.toFixed(1)).join(' ')).join(' L');
  const stones = []; for(let i=0;i<tgt;i++) stones.push(at(.05 + i/(tgt)*.86));
  const walkedT = cnt>0 ? (.05 + (cnt-1)/tgt*.86) : 0;
  const walkedD = 'M'+pts.slice(0, Math.round(walkedT*60)+1).map(p=>p.map(v=>v.toFixed(1)).join(' ')).join(' L');
  const gp = at(.98);
  const fogY = cnt>=tgt ? -100 : (stones[Math.min(cnt, tgt-1)][1] - 24);
  const here = cnt>0 ? stones[cnt-1] : at(0);
  const st = stage();
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Map of ${esc(rg.name)}: ${cnt} of ${tgt} stones reached${open?', gate open':''}">
    <defs><linearGradient id="trailgrad" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="var(--g4)"/><stop offset=".5" stop-color="var(--g3)"/><stop offset="1" stop-color="var(--g1)"/></linearGradient>
    <linearGradient id="fog" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="fogc" stop-opacity=".97"/><stop offset=".78" class="fogc" stop-opacity=".9"/><stop offset="1" class="fogc" stop-opacity="0"/></linearGradient></defs>
    ${topo}
    <path class="trail" d="${pathD}"/>
    ${cnt>0?`<path class="walked" d="${walkedD}"/>`:''}
    ${stones.slice(0,cnt).map(p=>`<circle class="glow" cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="13"/>`).join('')}
    ${stones.map((p,i)=>`<circle class="stone ${i<cnt?'on':''} ${i===cnt?'next':''}" cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${i<cnt?6:5}"/>`).join('')}
    <g class="gate ${open?'open':''}" transform="translate(${gp[0].toFixed(1)} ${gp[1].toFixed(1)})"><path d="M-14 12V-2a14 14 0 0 1 28 0v14M-14 12h28M-7 12V2a7 7 0 0 1 14 0v10"/></g>
    ${fogY>0?`<rect x="0" y="0" width="${W}" height="${Math.max(0,fogY+40).toFixed(0)}" fill="url(#fog)"/>`:''}
    <text class="maplbl" x="16" y="${H-14}">${esc(rg.name.toUpperCase())}</text>
    <g transform="translate(${W-34} 30)"><circle r="13" fill="none" stroke="var(--line)"/><path d="M0 -9l3 9h-6z" fill="var(--violet)"/><text class="maplbl" x="-3.5" y="-16">N</text></g>
    <g transform="translate(${(here[0]-22).toFixed(1)} ${(here[1]-44).toFixed(1)}) scale(.36)">${dragonSVG({stage:st}).replace(/<svg[^>]*>|<\/svg>/g,'')}</g>
  </svg>`;
}
function realmHTML(){
  const now = new Date(), mk = monthKey(now), rg = region(mk), tgt = monthTarget(mk), cnt = monthCount(mk), open = cnt >= tgt;
  const prize = prizeFor(mk), claimed = gateClaimed(mk);
  const sm = startMonth(), months = [];
  for(let i=0;i<=Math.max(monthsBetween(sm, mk)+2, 3); i++){ const d = new Date(+sm.slice(0,4), +sm.slice(5)-1+i, 1); months.push(monthKey(d)); }
  const st = stage(), nx = nextStage();
  return `<div class="enter" style="display:grid;gap:14px">${topbar()}
    <section class="gcard flat"><h1>${dx(rg.name)}</h1>
      <p class="meta">${now.toLocaleDateString('en-GB',{month:'long'})}, region ${rg.index+1}. ${Math.min(cnt,tgt)} of ${tgt} stones. ${open ? (claimed ? 'Gate opened, prize claimed.' : 'The gate is open.') : `${tgt-cnt} more to reach ${esc(rg.gate)}.`}</p></section>
    <section class="card map">${mapSVG(mk)}</section>
    <section class="card" style="display:grid;gap:12px"><p class="lore">${dx(rg.lore)}</p>
      <div class="prizerow"><span>At the gate: <b>${esc(prize.name)}</b></span>${claimed?'<span class="c-good" style="font-weight:700">Claimed</span>': open ? `<button class="claim ready" data-a="claimgate" data-mk="${mk}">Claim</button>` : `<button class="linkbtn" data-a="prizepick" data-mk="${mk}">Change prize</button>`}</div></section>
    <section class="card"><h2 class="ct">Your dragon</h2><div class="stage"><div style="width:96px;height:96px">${dragonSVG()}</div>
      <div><div class="nm">${esc(S.dragon)}, ${st.name.toLowerCase()}</div><div class="nx">${nx ? `${nx.at - st.n} more sessions to ${nx.name.toLowerCase()}, and new colours.` : 'Fully grown. Insufferable about it.'}</div>
      <div class="evo">${STAGES.map((s,i)=>`<i style="background:${s.colours? (i<=st.index? s.colours[0] : 'var(--line)') : (i<=st.index?'#D8CCEF':'var(--line)')}"></i>`).join('')}</div></div></div></section>
    <section class="card"><h2 class="ct">The road so far</h2><ul class="regions">${months.map(m=>{
      const rr = region(m), c = monthCount(m), t = monthTarget(m), past = m < mk, cur = m===mk;
      const stt = cur ? `<span class="st now">Here</span>` : past ? (c>=t ? `<span class="st ok">Gate opened</span>` : `<span class="st">Passed through</span>`) : `<span class="st">Unexplored</span>`;
      const label = new Date(+m.slice(0,4), +m.slice(5)-1, 1).toLocaleDateString('en-GB',{month:'short'});
      return `<li class="${!past&&!cur?'fog':''}"><span class="mo">${label}</span><span class="rn">${!past&&!cur?'Somewhere in the fog':dx(rr.name)}</span>${stt}</li>`; }).join('')}</ul></section>
  </div>`;
}

/* ---------- Treasury ---------- */
function treasuryHTML(){
  const bal = balance(); const mk = monthKey(new Date());
  const gateReady = monthCount(mk) >= monthTarget(mk) && !gateClaimed(mk);
  const groups = ['small','medium','big'].map(sz=>{
    const list = S.rewards.filter(r=>r.size===sz); if(!list.length) return '';
    const cost = SIZE_COST[sz];
    return `<section class="card"><h2 class="ct">${SIZE_NAME[sz]} <span class="aside">${cost.toLocaleString('en-GB')} points</span></h2>${list.map(r=>{
      const ok = bal >= cost;
      return `<div class="rw"><span class="nm">${esc(r.name)}</span>${ok?'':`<span class="need">${(cost-bal).toLocaleString('en-GB')} to go</span>`}<span class="acts"><button class="claim ${ok?'ready':''}" data-a="claim" data-id="${r.id}" ${ok?'':'disabled'}>Claim</button><button class="del" data-a="delreward" data-id="${r.id}" aria-label="Remove ${esc(r.name)}">${I.trash}</button></span></div>`; }).join('')}</section>`;
  }).join('');
  const hist = S.redemptions.slice().sort((a,b)=>b.ts-a.ts).slice(0,8);
  return `<div class="enter" style="display:grid;gap:14px">${topbar()}
    <section class="gcard flat"><div class="bal">${bal.toLocaleString('en-GB')}</div><p class="meta">points to spend · ${earned().toLocaleString('en-GB')} earned so far</p></section>
    ${gateReady ? `<section class="card"><h2 class="ct">Gate prize waiting</h2><p style="margin:0 0 12px">${esc(region(mk).gate)} is open. Free, no points needed: <b>${esc(prizeFor(mk).name)}</b>.</p><button class="btn primary" style="width:100%" data-a="claimgate" data-mk="${mk}">Claim it</button></section>` : ''}
    ${groups}
    <section class="card"><h2 class="ct">Add a reward</h2><form class="addrw" data-form="addreward" autocomplete="off">
      <input type="text" id="rwname" placeholder="Something you’d actually want" maxlength="80" aria-label="Reward">
      <button class="btn-ink" type="submit">Add</button>
      <div class="s"><div class="seg" role="group" aria-label="Size">${['small','medium','big'].map(s=>`<button type="button" data-a="rwsize" data-v="${s}" aria-pressed="${(ui.rwsize||'small')===s}">${SIZE_NAME[s]}</button>`).join('')}</div></div>
    </form></section>
    ${hist.length ? `<section class="card"><h2 class="ct">Claimed</h2><ul class="hist">${hist.map(h=>`<li><span>${esc(h.name)}</span><span class="muted num">${h.cost?h.cost.toLocaleString('en-GB'):'Gate prize'} · ${new Date(h.ts).toLocaleDateString('en-GB',{day:'numeric',month:'short'})}</span></li>`).join('')}</ul></section>` : ''}
  </div>`;
}

/* ---------- Progress ---------- */
function progressHTML(){
  const now = new Date(), weeks = [];
  for(let w=7; w>=0; w--){ const wi = weekInfo(addDays(weekStart(now), -7*w), w===0); weeks.push(wi); }
  const max = Math.max(4, ...weeks.map(w=>w.count));
  const W = 320, H = 150, bw = 26, gap = (W - 30 - weeks.length*bw)/(weeks.length-1);
  const y = v => H-22 - v/max*(H-40);
  const bars = weeks.map((w,i)=>{ const x = 26 + i*(bw+gap); const h = (H-22) - y(w.count);
    return `<rect x="${x.toFixed(1)}" y="${y(w.count).toFixed(1)}" width="${bw}" height="${Math.max(h,2).toFixed(1)}" rx="6" fill="${i===weeks.length-1?'url(#pbar)':'var(--g3)'}" opacity="${i===weeks.length-1?1:.55}"/>
      ${(i%2===1)?`<text class="ax" x="${(x+bw/2).toFixed(1)}" y="${H-6}" text-anchor="middle">${w.start.toLocaleDateString('en-GB',{day:'numeric',month:'short'})}</text>`:''}
      ${w.count?`<text class="ax" x="${(x+bw/2).toFixed(1)}" y="${(y(w.count)-6).toFixed(1)}" text-anchor="middle" style="fill:var(--ink);font-weight:700">${w.count}</text>`:''}`; }).join('');
  const tY = y(3);
  const lifts = Object.keys(EX).filter(id=>hasLoad(id)).map(id=>{
    const hist = sessions.filter(s=>s.loads && s.loads[id]!==undefined).sort((a,b)=>a.ts-b.ts).map(s=>s.loads[id]);
    return {id, hist, cur: loadOf(id)};
  }).filter(l=>l.hist.length);
  const spark = h => { if(h.length<2) return `<svg viewBox="0 0 92 30" aria-hidden="true"><circle class="spdot" cx="88" cy="15" r="3"/></svg>`;
    const mn = Math.min(...h), mx = Math.max(...h), sp = mx-mn || 1;
    const pts = h.map((v,i)=>[2+i/(h.length-1)*86, 26-(v-mn)/sp*22]);
    return `<svg viewBox="0 0 92 30" aria-hidden="true"><path class="sp" d="M${pts.map(p=>p.map(n=>n.toFixed(1)).join(' ')).join(' L')}"/><circle class="spdot" cx="${pts[pts.length-1][0].toFixed(1)}" cy="${pts[pts.length-1][1].toFixed(1)}" r="3"/></svg>`; };
  const mins = sessions.reduce((a,s)=>a+(s.minutes||0),0);
  return `<div class="enter" style="display:grid;gap:14px">${topbar()}
    <section class="gcard flat"><h1>${trainingTotal()} sessions</h1><p class="meta">Since you started. ${mins.toLocaleString('en-GB')} minutes moving · ${sessions.filter(s=>s.kind==='hip').length} hip blocks · ${weeksOnTarget()} ${weeksOnTarget()===1?'week':'weeks'} on target</p></section>
    <section class="card chart"><h2 class="ct">Sessions per week <span class="aside">dashed line is 3</span></h2>
      <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Training sessions per week, last eight weeks"><defs><linearGradient id="pbar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--g1)"/><stop offset="1" stop-color="var(--g4)"/></linearGradient></defs>
      <line class="gl" x1="20" x2="${W}" y1="${H-22}" y2="${H-22}"/><line class="tgt" x1="20" x2="${W}" y1="${tY.toFixed(1)}" y2="${tY.toFixed(1)}"/>${bars}</svg></section>
    <section class="card"><h2 class="ct">Strength <span class="aside">current weight</span></h2>
      ${lifts.length ? lifts.map(l=>{ const first = l.hist[0], gain = +(l.cur-first).toFixed(1);
        return `<div class="lift"><span class="nm">${esc(EX[l.id].name)}</span>${spark(l.hist.concat(l.cur!==l.hist[l.hist.length-1]?[l.cur]:[]))}<span class="kg">${fmtKg(l.cur)}${gain>0?`<small>+${fmtKg(gain)}</small>`:''}</span></div>`; }).join('')
      : `<p class="empty">Your lifts appear here after your first strength session, with every step up the weights.</p>`}
    </section></div>`;
}

/* ---------- Settings ---------- */
function settingsHTML(){
  return `<div class="enter" style="display:grid;gap:14px">
    <button class="back" data-a="home">${I.back}Today</button>
    <section class="gcard flat"><h1>Settings</h1><p class="meta">Your data, your coach, your dragon.</p></section>
    <section class="card"><h2 class="ct">Your data on GitHub</h2>
      <form data-form="gh" autocomplete="off">
      <div class="field"><label for="ghowner">GitHub username</label><input type="text" id="ghowner" value="${esc(GH.owner)}" autocapitalize="off" spellcheck="false"></div>
      <div class="field"><label for="ghrepo">Private data repo</label><input type="text" id="ghrepo" value="${esc(GH.repo)}" autocapitalize="off" spellcheck="false"></div>
      <div class="field"><label for="ghtoken">Access token</label><input type="password" id="ghtoken" value="${esc(GH.token)}" placeholder="github_pat_…" autocapitalize="off" spellcheck="false">
        <p class="hint">Fine-grained token, only this repo, Contents set to read and write. It stays on this phone.</p></div>
      <div class="field"><button class="btn primary" type="submit" style="width:100%">${GH.token?'Save and sync':'Connect'}</button></div></form>
      ${syncLineHTML()}
    </section>
    <section class="card"><h2 class="ct">Coach</h2>
      <div class="srow"><span>Voice cues</span><div class="seg"><button data-a="setvoice" data-v="1" aria-pressed="${S.voice}">On</button><button data-a="setvoice" data-v="0" aria-pressed="${!S.voice}">Off</button></div></div>
      <div class="srow"><span>Test sound and voice</span><button class="btn-ink" data-a="testsound">Play</button></div>
      <p class="hint" style="margin-top:8px">If you hear nothing, flip the silent switch off. Every cue also flashes on screen.</p>
      <div class="srow"><label for="step">Dumbbell step</label><select id="step" style="width:auto">${[1,2,2.5].map(v=>`<option value="${v}" ${S.step==v?'selected':''}>${v} kg</option>`).join('')}</select></div>
    </section>
    <section class="card"><h2 class="ct">Look</h2>
      <div class="srow"><span>Theme</span><div class="seg">${[['system','Phone'],['dark','Night'],['light','Light']].map(([v,l])=>`<button data-a="settheme" data-v="${v}" aria-pressed="${S.theme===v}">${l}</button>`).join('')}</div></div>
      <div class="field"><label for="dname">Dragon’s name</label><input type="text" id="dname" value="${esc(S.dragon)}" maxlength="24"></div>
    </section>
    <section class="card"><h2 class="ct">How points work</h2>
      <ul class="steps" style="padding-left:18px;margin:0">
        <li>Full session 30, short or cardio 15–20, hip block or walk 10.</li>
        <li>Plus 5 when a weight goes up, plus 25 for hitting your week.</li>
        <li>Three sessions a week in London, two in a Paris week. Ten minutes counts.</li>
        <li>Each month is a region. Reach its gate and its prize is free.</li></ul></section>
  </div>`;
}

/* ---------- Sheets ---------- */
function sheetHTML(){
  if(ui.sheet==='exit'){
    const r = ui.run, did = r && r.done > 0;
    return `<div class="scrim" data-a="keep"><div class="sheet" role="dialog" aria-modal="true" aria-label="Leave session">
      <h3>Stop here?</h3><p>${did?'You can log what you’ve done. It counts as a ten-minute session.':'Nothing done yet, so nothing to log.'}</p>
      <button class="btn primary" data-a="keep">Keep going</button>${did?'<button class="btn" data-a="endlog">End and log what I did</button>':''}<button class="btn" data-a="discard">Leave without logging</button></div></div>`;
  }
  if(ui.sheet && ui.sheet.type==='guide'){
    const e = EX[ui.sheet.id], h = e.how;
    const sec = (t, list) => `<h4 style="margin:14px 0 6px;font-size:12.5px;letter-spacing:.11em;text-transform:uppercase;color:var(--label)">${t}</h4><ol style="margin:0;padding-left:20px;display:grid;gap:6px">${list.map(x=>`<li>${esc(x)}</li>`).join('')}</ol>`;
    return `<div class="scrim" data-a="close"><div class="sheet" role="dialog" aria-modal="true" aria-label="How to do ${esc(e.name)}">
      ${demoBox(ui.sheet.id)}<h3 style="margin-top:14px">${esc(e.name)}</h3>${sec('Set up', h.setup)}${sec('Do it', h.go)}${sec('Form tips', h.tips)}
      <button class="btn primary" data-a="close" style="margin-top:16px">Got it</button></div></div>`;
  }
  if(ui.sheet && ui.sheet.type==='claim'){
    const r = S.rewards.find(x=>x.id===ui.sheet.id); const cost = SIZE_COST[r.size];
    return `<div class="scrim" data-a="close"><div class="sheet" role="dialog" aria-modal="true" aria-label="Claim reward">
      <h3>${esc(r.name)}</h3><p>Spend ${cost.toLocaleString('en-GB')} points on this? You’ll have ${(balance()-cost).toLocaleString('en-GB')} left.</p>
      <button class="btn primary" data-a="confirmclaim" data-id="${r.id}">Yes, I’ve earned it</button><button class="btn" data-a="close">Not yet</button></div></div>`;
  }
  if(ui.sheet && ui.sheet.type==='del'){
    const r = S.rewards.find(x=>x.id===ui.sheet.id);
    return `<div class="scrim" data-a="close"><div class="sheet" role="dialog" aria-modal="true" aria-label="Remove reward">
      <h3>Remove this?</h3><p>${esc(r.name)}</p><button class="btn primary" data-a="confirmdel" data-id="${r.id}">Remove</button><button class="btn" data-a="close">Keep it</button></div></div>`;
  }
  if(ui.sheet && ui.sheet.type==='prize'){
    const mk = ui.sheet.mk; const cur = prizeFor(mk);
    const list = S.rewards.filter(r=>r.size!=='small');
    return `<div class="scrim" data-a="close"><div class="sheet" role="dialog" aria-modal="true" aria-label="Choose the gate prize">
      <h3>The gate prize</h3><p>Reach the gate this month and this one is free.</p>
      ${list.map(r=>`<button class="pick" data-a="setprize" data-id="${r.id}" data-mk="${mk}"><span>${esc(r.name)}</span><small>${r.id===cur.id?'Chosen':SIZE_NAME[r.size]}</small></button>`).join('')}
      <button class="btn" data-a="close" style="margin-top:12px">Done</button></div></div>`;
  }
  return '';
}

let toastT;
function toast(msg){ const t = $('toast'); t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(()=>{ t.hidden = true; }, 3800); }

/* ================= Events ================= */
document.addEventListener('click', e=>{
  const tb = e.target.closest('[data-tab]');
  if(tb && !e.target.closest('[data-a]')){ ui.tab = tb.dataset.tab; ui.screen = 'tab'; render(); window.scrollTo(0,0); return; }
  const b = e.target.closest('[data-a]'); if(!b) return;
  if(b.classList.contains('scrim') && e.target !== b) return;
  const a = b.dataset.a, r = ui.run;
  switch(a){
    case 'start': ui.sheet = null; startSession(b.dataset.code, false); break;
    case 'starttrim': startSession(b.dataset.code, true); break;
    case 'choose': ui.screen = 'choose'; render(); window.scrollTo(0,0); break;
    case 'trainanyway': ui.trainAnyway = true; render(); break;
    case 'loc': S.loc = S.loc==='uk' ? 'paris' : 'uk'; ui.trainAnyway = false; touch(); render(); toast(S.loc==='uk'?'Back in London. Full kit.':'Paris mode. Light kit, slow tempo.'); break;
    case 'settings': ui.screen = 'settings'; render(); window.scrollTo(0,0); break;
    case 'home': ui.screen = 'tab'; ui.tab = 'today'; ui.last = null; ui.sheet = null; render(); window.scrollTo(0,0); break;
    case 'done': audioOn(); advance(); break;
    case 'tstart': { audioOn(); const s = r.steps[r.i]; startTimer(s.dur+(s.lead||0)); if(s.t==='hold') say('Get into position.'); render(); break; }
    case 'tpause': { const t = r.timer; if(t.paused){ t.end = Date.now()+t.remaining; t.paused = false; } else { t.remaining = Math.max(0,t.end-Date.now()); t.paused = true; } render(); break; }
    case 'skip': advance(); break;
    case 'plus15': if(r.timer){ r.timer.end += 15000; r.timer.total += 15; } break;
    case 'load': { const s = r.steps[r.i]; const step = EX[s.ex].fixed ? 1 : S.step; r.loads[s.ex] = Math.min(25, Math.max(0, +(r.loads[s.ex] + (+b.dataset.d)*step).toFixed(2))); render(); break; }
    case 'voice': S.voice = !S.voice; touch(); if(S.voice){ audioOn(); say('Voice on.'); } else { try{ speechSynthesis.cancel(); }catch(_){} } render(); break;
    case 'guide': ui.sheet = {type:'guide', id:b.dataset.id}; render(); break;
    case 'effort': r.efforts[b.dataset.id] = b.dataset.v; render(); break;
    case 'save': save(); break;
    case 'exit': ui.sheet = 'exit'; render(); break;
    case 'keep': case 'close': ui.sheet = null; render(); break;
    case 'endlog': ui.sheet = null; finishRun(true); break;
    case 'discard': ui.sheet = null; unlockScreen(); ui.run = null; ui.screen = 'tab'; ui.tab = 'today'; render(); break;
    case 'nudgeoff': S.nudged[dayKey(new Date())] = 1; S.seenStage = stage().index; touch(); render(); break;
    case 'nudgego': S.nudged[dayKey(new Date())] = 1; S.seenStage = stage().index; touch(); startSession(b.dataset.code, false); break;
    case 'claim': ui.sheet = {type:'claim', id:b.dataset.id}; render(); break;
    case 'confirmclaim': { const rw = S.rewards.find(x=>x.id===b.dataset.id); const cost = SIZE_COST[rw.size]; if(balance()>=cost){ S.redemptions.push({id:'c'+uid(), rewardId:rw.id, name:rw.name, cost, ts:Date.now(), source:'points'}); touch(); toast('Claimed. Go and enjoy it.'); chime(); } ui.sheet = null; render(); break; }
    case 'claimgate': { const mk = b.dataset.mk; if(!gateClaimed(mk)){ const pz = prizeFor(mk); S.redemptions.push({id:'g'+uid(), rewardId:pz.id, name:pz.name, cost:0, ts:Date.now(), source:'gate', month:mk}); touch(); chime(); flash('Yours'); toast(`${pz.name}. Claimed.`); } render(); break; }
    case 'delreward': ui.sheet = {type:'del', id:b.dataset.id}; render(); break;
    case 'confirmdel': S.rewards = S.rewards.filter(x=>x.id!==b.dataset.id); S.rewardsUpdated = Date.now(); touch(); ui.sheet = null; render(); break;
    case 'rwsize': ui.rwsize = b.dataset.v; document.querySelectorAll('[data-a="rwsize"]').forEach(x=>x.setAttribute('aria-pressed', x.dataset.v===ui.rwsize)); break;
    case 'prizepick': ui.sheet = {type:'prize', mk:b.dataset.mk}; render(); break;
    case 'setprize': S.prizes[b.dataset.mk] = b.dataset.id; touch(); render(); break;
    case 'setvoice': S.voice = b.dataset.v==='1'; touch(); render(); break;
    case 'testsound': audioOn(); chime(); flash('Go'); setTimeout(()=>say('Testing. If you can hear me, the voice works.'), 400); break;
    case 'settheme': S.theme = b.dataset.v; touch(); applyTheme(); render(); break;
  }
});
document.addEventListener('submit', e=>{
  const f = e.target.closest('[data-form]'); if(!f) return; e.preventDefault();
  if(f.dataset.form==='addreward'){
    const name = $('rwname').value.trim(); if(!name){ toast('Give the reward a name first.'); return; }
    S.rewards.push({id:'r'+uid(), name, size:ui.rwsize||'small'}); S.rewardsUpdated = Date.now(); touch(); render(); toast('Added to your treasury.');
  }
  if(f.dataset.form==='gh'){
    GH.owner = $('ghowner').value.trim(); GH.repo = $('ghrepo').value.trim(); GH.token = $('ghtoken').value.trim();
    try{ localStorage.setItem(LSGH, JSON.stringify(GH)); }catch(_){}
    if(!ghReady()){ toast('Fill in all three to connect.'); return; }
    toast('Connecting…'); sync();
  }
});
document.addEventListener('change', e=>{
  if(e.target.id==='step'){ S.step = +e.target.value; touch(); }
  if(e.target.id==='dname'){ S.dragon = e.target.value.trim() || 'Pip'; touch(); }
});

function applyTheme(){ const r = document.documentElement; if(S.theme==='dark'||S.theme==='light') r.setAttribute('data-theme', S.theme); else r.removeAttribute('data-theme'); }

/* ================= Boot ================= */
function boot(){
  loadLocal(); applyPlan(); applyTheme();
  try{ if(window.speechSynthesis) speechSynthesis.onvoiceschanged = ()=>{ voiceGB = null; }; }catch(e){}
  render();
  if(ghReady()) sync(); else setSync('off');
  if('serviceWorker' in navigator && location.protocol==='https:') navigator.serviceWorker.register('sw.js').catch(()=>{});
}
boot();
