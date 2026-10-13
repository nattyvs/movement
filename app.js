'use strict';
/* Movement: a training companion. Runs offline; syncs to a private GitHub repo. */

/* ================= Library ================= */
const EX = {
  pad_warm:{name:'Walking pad warm-up',kind:'timed',dur:180,label:'Easy · 4–4.5 km/h',cue:'Easy pace. Let your hips and ankles loosen up.'},
  march_warm:{name:'Marching warm-up',kind:'timed',dur:120,label:'Knees up, arms swinging',cue:'March on the spot. Add a few slow bodyweight squats if you feel stiff.'},
  pad_cool:{name:'Cool-down walk',kind:'timed',dur:120,label:'Slow · 4 km/h',cue:'Bring the pace right down and let your breathing settle.'},
  march_cool:{name:'Cool-down march',kind:'timed',dur:120,label:'Slow march',cue:'Slow it right down. Long breaths out.'},
  goblet_box:{name:'Goblet box squat',kind:'reps',sets:3,reps:'10–15 reps',load:6,unit:'one dumbbell',rest:60,demo:'Goblet_Squat',legs:true,
    cue:'Dumbbell at your chest. Sit back until you touch the sofa edge, then stand tall.',
    how:{setup:['Stand just in front of the sofa, feet a little wider than hips.','Hold one dumbbell upright against your chest, elbows tucked.'],go:['Push your hips back and sit until you brush the sofa.','Drive through your whole foot to stand tall.'],tips:['Knees follow your toes, never cave in.','Chest proud, as if showing off a necklace.']}},
  knee_push:{name:'Knee push-up',kind:'reps',sets:3,reps:'8–12 reps',bw:true,rest:60,demo:'Pushups',demoNote:'Photo shows a full push-up. Do yours from the knees.',
    cue:'Hands under shoulders, one straight line from knees to head.',
    how:{setup:['Kneel, hands under shoulders, slightly wider.','Walk your knees back until body is one straight line.'],go:['Lower your chest towards the floor between your hands.','Press the floor away to the top.'],tips:['Squeeze glutes so hips do not sag.','Elbows at about 45 degrees, not flared wide.']}},
  hip_thrust:{name:'Dumbbell hip thrust',kind:'reps',sets:3,reps:'10–15 reps',load:3.5,unit:'across your hips',rest:60,demo:'Barbell_Hip_Thrust',demoNote:'Photo shows a barbell. Use a dumbbell across your hips.',legs:true,
    cue:'Shoulders on the sofa, feet flat. Drive up and hold one second at the top.',
    how:{setup:['Upper back against the sofa edge, feet flat, knees bent.','Rest the dumbbell on your hip crease, hands holding it steady.'],go:['Drive through your heels and lift until your body is flat like a table.','Hold one second, lower with control.'],tips:['Chin tucked, eyes forward, not at the ceiling.','Feel it in your glutes. If it is your hamstrings, bring feet closer.']}},
  rdl:{name:'Romanian deadlift',kind:'reps',sets:3,reps:'10–15 reps',load:5,unit:'each hand',rest:60,demo:'Stiff-Legged_Dumbbell_Deadlift',legs:true,
    cue:'Soft knees. Push hips back while the dumbbells slide down your thighs.',
    how:{setup:['Feet hip-width, a dumbbell in each hand in front of your thighs.','Soft bend in the knees, ribs down.'],go:['Push your hips back, sliding the weights down your legs.','Stop when you feel a hamstring stretch, then squeeze glutes to stand.'],tips:['Back stays flat the whole way.','The weights stay close, almost brushing your legs.']}},
  dead_bug:{name:'Dead bug',kind:'timed',sets:2,dur:30,rest:30,label:'Slow and controlled',demo:'Dead_Bug',
    cue:'Low back stays heavy on the floor. Reach opposite arm and leg away, then swap.',
    how:{setup:['On your back, arms to the ceiling, knees bent over hips.','Press your lower back into the floor.'],go:['Lower one arm and the opposite leg slowly towards the floor.','Return and swap sides.'],tips:['Breathe out as you reach.','If your back lifts, make the reach smaller.']}},
  split_squat:{name:'Supported split squat',kind:'reps',sets:3,reps:'10–12 each side',load:3.5,unit:'each hand',rest:60,est:60,demo:'Split_Squat_with_Dumbbells',legs:true,
    cue:'A hand on the wall if you need it. Drop the back knee straight down.',
    how:{setup:['Long stride stance, back heel lifted.','Dumbbells at your sides, or one hand on the wall.'],go:['Drop the back knee straight down towards the floor.','Push through the front heel to rise.'],tips:['Front knee tracks over the toes.','Torso tall, weight mostly on the front leg.']}},
  row:{name:'Bent-over row',kind:'reps',sets:3,reps:'10–15 reps',load:5,unit:'each hand',rest:60,demo:'Bent_Over_Two-Dumbbell_Row',
    cue:'Hinge forward with a flat back. Pull the dumbbells towards your hip pockets.',
    how:{setup:['Hinge forward to about 45 degrees, soft knees.','Arms hang straight under your shoulders.'],go:['Pull the dumbbells to your hip pockets.','Squeeze shoulder blades, lower slowly.'],tips:['Neck long, eyes on the floor ahead.','No jerking. If you swing, go lighter.']}},
  step_up:{name:'Step-up',kind:'reps',sets:3,reps:'8 each side',bw:true,rest:60,est:60,demo:'Dumbbell_Step_Ups',legs:true,
    cue:'Bottom stair or a sturdy step. Whole foot on, push through the heel, step down slowly.',
    how:{setup:['Face the bottom stair, hand on the rail if you like.','Place your whole foot on the step.'],go:['Push through that heel to stand up tall.','Step down slowly with the other foot.'],tips:['The top leg does the work, not a bounce from below.','Knee in line with your toes.']}},
  db_press:{name:'Standing dumbbell press',kind:'reps',sets:3,reps:'10–15 reps',load:3,unit:'each hand',rest:60,demo:'Standing_Dumbbell_Press',
    cue:'Ribs down, glutes on. Press overhead until your arms sit by your ears.',
    how:{setup:['Stand tall, dumbbells at shoulder height, palms forward.','Squeeze glutes and brace your middle.'],go:['Press straight up until arms are by your ears.','Lower with control to the shoulders.'],tips:['Do not lean back to finish the rep.','Stop short of any shoulder pinch.']}},
  pallof:{name:'Pallof press',kind:'reps',sets:2,reps:'10 each side',bw:true,rest:30,est:50,demo:'Pallof_Press',demoNote:'Photo shows a cable. Use your band anchored at chest height.',
    cue:'Band anchored at chest height beside you. Press straight out and resist the twist.',
    how:{setup:['Anchor the band at chest height, stand side-on to it.','Hold the band at your chest with both hands.'],go:['Press your hands straight out in front.','Hold two seconds, bring back to your chest.'],tips:['Hips and shoulders stay square.','Step further away to make it harder.']}},
  goblet_heavy:{name:'Goblet squat, stronger',kind:'reps',sets:3,reps:'8–10 reps',load:8,unit:'one dumbbell',rest:75,est:40,demo:'Goblet_Squat',legs:true,
    cue:'Your heaviest lift. Slow down, strong up. Stop each set with one or two good reps left.',
    how:{setup:['Same set-up as the box squat, a heavier dumbbell.','Big breath in and brace before each rep.'],go:['Sit down under control, as deep as feels good.','Drive up hard.'],tips:['Quality over depth. Your hip decides how low.','Rest the full 90 seconds. Heavy work needs it.']}},
  one_arm_row:{name:'One-arm row',kind:'reps',sets:3,reps:'10–12 each side',load:7,unit:'one dumbbell',rest:30,est:50,demo:'One-Arm_Dumbbell_Row',
    cue:'Hand and knee on the sofa. Pull your elbow back past your ribs.',
    how:{setup:['One hand and knee on the sofa, back flat.','Dumbbell hangs under your shoulder.'],go:['Pull your elbow back past your ribs.','Lower slowly to a full stretch.'],tips:['Do not twist your torso open.','Think elbow to back pocket.']}},
  rdl_heavy:{name:'Romanian deadlift, stronger',kind:'reps',sets:3,reps:'8–10 reps',load:7,unit:'each hand',rest:75,est:40,demo:'Stiff-Legged_Dumbbell_Deadlift',legs:true,
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
  tr_squat:{name:'Chair squat',kind:'reps',sets:3,reps:'12–15 reps',bw:true,rest:45,est:50,legs:true,
    cue:'Sit back for three seconds until you touch the chair, then stand tall. Hug a full backpack to make it harder.',
    how:{setup:['Stand in front of a sturdy chair or bed, feet hip-width.','Arms forward, or hug a backpack at your chest.'],go:['Sit back slowly for three seconds until you just touch the seat.','Stand up tall without bouncing off it.'],tips:['Knees follow your toes.','A full backpack with water bottles makes a good travel weight.']}},
  tr_split:{name:'Split squat',kind:'reps',sets:3,reps:'10–12 each side',bw:true,rest:45,est:70,legs:true,
    cue:'Long stride, slow down for three, drive up. Hand on a wall for balance.',
    how:{setup:['Long stride stance, back heel lifted.','A hand on a wall or chair for balance.'],go:['Lower slowly for three seconds.','Drive up through the front heel.'],tips:['Front knee stays in line with your toes.','Hold the backpack for extra load.']}},
  tr_hinge:{name:'Backpack Romanian deadlift',kind:'reps',sets:3,reps:'12–15 reps',bw:true,rest:45,est:50,legs:true,
    cue:'Hold a backpack by the straps. Push your hips back, flat back, then squeeze to stand.',
    how:{setup:['Feet hip-width, backpack held in front of your thighs.','Soft knees, ribs down.'],go:['Push your hips back, sliding the bag down your legs.','Stop at a hamstring stretch, then squeeze your glutes to stand.'],tips:['Back stays flat, not rounded.','No bag? Do it slowly with your hands on your thighs.']}},
  tr_stepup:{name:'Stair step-up',kind:'reps',sets:3,reps:'10 each side',bw:true,rest:45,est:60,legs:true,
    cue:'Bottom stair or a sturdy step. Push through the heel, step down slowly.',
    how:{setup:['Face the bottom stair, hand on the rail if you like.'],go:['Whole foot on the step, push through the heel to stand tall.','Step down slowly.'],tips:['The top leg does the work.','Knee in line with your toes.']}},
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
  cat_cow:{name:'Cat–cow',kind:'timed',dur:45,label:'Slow, with your breath',
    cue:'On hands and knees. Breathe in, chest forward and tail up. Breathe out, round your back like a cat.',
    how:{setup:['Hands under shoulders, knees under hips, on a mat.'],go:['Breathe in: drop your belly, lift your chest and gaze.','Breathe out: round your spine, tuck your chin and tail.'],tips:['Move one vertebra at a time. Slow is the point.']}},
  thread_needle:{name:'Thread the needle',kind:'hold',holds:1,dur:30,
    cue:'On hands and knees, reach one arm to the ceiling, then thread it under your body and rest your shoulder down.',
    how:{setup:['Hands and knees, hips over knees.'],go:['Open one arm to the ceiling, eyes following your hand.','Thread it under the other arm and let your shoulder sink. Hold.'],tips:['Keep your hips still. The twist comes from your upper back.']}},
  wall_angel:{name:'Wall angel',kind:'reps',sets:1,reps:'10 slow reps',bw:true,rest:20,est:50,
    cue:'Back, head and bottom against the wall. Slide your arms from a W up to a Y and back down.',
    how:{setup:['Stand with heels a small step from the wall, back flat against it.','Arms in a W shape, elbows and wrists touching the wall if you can.'],go:['Slide your arms up into a Y.','Slide back down to the W.'],tips:['Ribs down. If your back arches, make the movement smaller.']}},
  doorway_pec:{name:'Doorway chest stretch',kind:'hold',holds:1,dur:30,
    cue:'Forearm on the door frame at shoulder height. Step through gently until you feel the front of your shoulder open.',
    how:{setup:['Forearm flat on the door frame, elbow at shoulder height.'],go:['Step the same-side foot forward and lean gently through.','Breathe and hold.'],tips:['A stretch, not a pinch. Ease off if your shoulder complains.']}},
  hip_flexor:{name:'Half-kneeling hip flexor stretch',kind:'hold',holds:1,dur:30,
    cue:'One knee down on a cushion. Tuck your tail under, squeeze that glute and shift your hips forward a little.',note:'Keep the front knee in line with your foot, never drifting inwards.',
    how:{setup:['Kneel on one knee on a cushion, other foot flat in front.'],go:['Tuck your tail under and squeeze the glute of the kneeling leg.','Shift forward a few centimetres. Reach the same-side arm up to deepen.'],tips:['Small movement, big squeeze. Your lower back stays neutral.']}},
  knee_wall:{name:'Knee to wall',kind:'reps',sets:1,reps:'10 each side',bw:true,rest:20,est:60,
    cue:'Front foot a hand-width from the wall. Drive your knee forward to touch the wall, heel stays down.',
    how:{setup:['Half kneel facing a wall, front toes a hand-width away.'],go:['Push your knee forward over your toes to touch the wall.','Come back and repeat.'],tips:['Heel glued to the floor. Move the foot back as you get better.']}},
  squat_hold:{name:'Supported deep squat',kind:'timed',sets:2,dur:40,rest:20,label:'Hold the door frame',
    cue:'Hold the door frame, sit down into a deep squat and let your hips and ankles settle.',
    how:{setup:['Hold a door frame or sturdy handle at chest height, feet a bit wider than hips.'],go:['Sit down as deep as is comfortable, using your arms for balance.','Breathe and let your weight settle.'],tips:['Heels down if you can. A folded towel under them is fine.']}},
  ham_floss:{name:'Hamstring floss',kind:'reps',sets:1,reps:'10 each side',bw:true,rest:20,est:60,
    cue:'On your back, hold behind one thigh. Straighten and bend the knee slowly.',
    how:{setup:['Lie on your back, other leg long on the floor.','Hold behind one thigh with both hands, knee bent.'],go:['Slowly straighten the knee towards the ceiling.','Bend it again. Smooth, no bouncing.'],tips:['Straight is not the goal. Comfortable tension is.']}},
  calf_raise:{name:'Slow calf raise',kind:'reps',sets:2,reps:'12 reps',bw:true,rest:20,est:40,
    cue:'Rise onto the balls of your feet for two seconds, lower for three. Hold a wall for balance.',
    how:{setup:['Stand tall, fingertips on a wall.'],go:['Rise up for a count of two.','Lower for a count of three.'],tips:['Strong ankles help your knees. Go slow.']}},
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
    how:{setup:['On your back, both legs long.'],go:['Hug one knee gently to your chest.','Hold, then swap.'],tips:['Let the long leg relax into the floor.']}},
  /* ---- mobility flows two to four ---- */
  inchworm:{name:'Inchworm',kind:'reps',sets:1,reps:'5 slow reps',bw:true,rest:20,est:70,
    cue:'Fold forward, walk your hands out to a plank, then walk them back and roll up.',
    how:{setup:['Stand tall, feet hip-width.'],go:['Fold forward and put your hands on the floor, bending your knees as much as you need.','Walk your hands out to a plank, pause, then walk them back and roll up slowly.'],tips:['Bent knees are fine. The stretch belongs in the backs of your legs, so keep your lower back long.']}},
  elbow_sky:{name:'Elbow to the sky',kind:'reps',sets:1,reps:'8 each side',bw:true,rest:20,est:70,
    cue:'On hands and knees, one hand behind your head. Turn your elbow down to the other wrist, then up to the ceiling.',
    how:{setup:['Hands and knees, hips over knees.','Put one hand behind your head.'],go:['Turn your elbow down towards the other wrist.','Then open it up to the ceiling, eyes following.'],tips:['Hips stay still. The turn comes from your upper back.']}},
  lunge_reach:{name:'Lunge with a reach',kind:'reps',sets:1,reps:'5 each side',bw:true,rest:20,est:80,
    cue:'Half-kneeling lunge, one hand on the floor beside your front foot, the other arm reaching to the ceiling.',note:'Keep the front knee in line with your foot, never drifting inwards.',
    how:{setup:['Kneel on one knee on a cushion, the other foot well in front.'],go:['Put one hand on the floor beside your front foot.','Reach the other arm up to the ceiling and follow it with your eyes. One breath, then back down.'],tips:['Squeeze the glute of the kneeling leg.','Swap legs after five.']}},
  hip_circles:{name:'Standing hip circles',kind:'reps',sets:1,reps:'5 each way, each leg',bw:true,rest:20,est:70,
    cue:'Hand on a wall. Lift one knee and draw slow, big circles with it.',note:'Keep the circles comfortable. Make them smaller if your hip complains.',
    how:{setup:['Stand side-on to a wall, one hand on it.'],go:['Lift the outside knee towards hip height.','Draw slow circles with it, five one way and five the other.'],tips:['Standing leg tall. Move only as far as feels smooth.']}},
  squat_stand:{name:'Squat to stand',kind:'reps',sets:1,reps:'8 slow reps',bw:true,rest:20,est:50,
    cue:'Fold and hold your toes, sit down into a squat, then straighten your legs while still holding on.',
    how:{setup:['Feet a bit wider than hips, toes slightly out.'],go:['Fold forward and hold your toes or shins.','Sit your hips down into a squat, chest up between your knees.','Lift your hips and straighten your legs, still holding on.'],tips:['Bend your knees as much as you need to reach.']}},
  child_reach:{name:'Child’s pose side reach',kind:'hold',holds:1,dur:30,
    cue:'Sit back towards your heels, arms long, then walk both hands to one side to stretch along your ribs.',
    how:{setup:['Kneel with knees a little apart and sit back towards your heels.'],go:['Reach your arms long in front of you.','Walk both hands to one side and breathe into the opposite ribs. Hold.'],tips:['A cushion between bottom and heels helps tight knees.']}},
  band_pass:{name:'Band pass-through',kind:'reps',sets:1,reps:'10 slow reps',bw:true,rest:20,est:45,
    cue:'Hold a band wide in both hands, arms straight. Lift it up over your head and back, then return.',
    how:{setup:['Hold the band wide, hands much further apart than your shoulders.'],go:['Keep your arms straight and lift the band up over your head.','Take it back only as far as is comfortable, then return.'],tips:['Wider hands make it easier. Ribs down.']}},
  rock_back:{name:'Rock back',kind:'reps',sets:1,reps:'10 slow reps',bw:true,rest:20,est:45,
    cue:'On hands and knees, rock your hips back towards your heels, then forward again.',
    how:{setup:['Hands under shoulders, knees under hips.'],go:['Keep your back long and rock your hips back towards your heels.','Rock forward to the start.'],tips:['Go only as far as your back stays flat.']}},
  calf_wall:{name:'Wall calf stretch',kind:'hold',holds:1,dur:30,
    cue:'Hands on the wall, one leg back with the heel down and knee straight. Lean in.',
    how:{setup:['Face a wall, hands on it at shoulder height.','Step one foot well back, heel down, knee straight.'],go:['Lean your hips towards the wall until you feel the calf stretch.','Hold and breathe.'],tips:['Back foot points straight at the wall.']}},
  /* ---- ladder rungs: harder versions that swap in as she masters each one ---- */
  incline_push:{name:'Push-up, hands on a step',kind:'reps',sets:3,reps:'8–12 reps',bw:true,rest:60,
    cue:'Hands on the bottom stair, one straight line from heels to head.',
    how:{setup:['Hands on the bottom stair or a low, sturdy step, a little wider than your shoulders.','Walk your feet back until your body is one straight line.'],go:['Lower your chest to the edge of the step.','Press the step away to the top.'],tips:['Squeeze your glutes so your hips stay in line.','Too hard today? A higher step makes it easier.']}},
  push_up:{name:'Push-up',kind:'reps',sets:3,reps:'5–10 reps',bw:true,rest:75,demo:'Pushups',
    cue:'From your toes, one straight line. Lower with control, press the floor away.',
    how:{setup:['Hands a little wider than your shoulders, on a mat.','Step back onto your toes, body one straight line.'],go:['Lower until your chest is a fist above the floor.','Press the floor away to the top.'],tips:['Last reps getting ragged? Finish the set from your knees.','Elbows at about 45 degrees, not flared wide.']}},
  step_up_db:{name:'Dumbbell step-up',kind:'reps',sets:3,reps:'8–12 each side',load:2.5,unit:'each hand',rest:60,est:60,demo:'Dumbbell_Step_Ups',legs:true,
    cue:'A dumbbell in each hand. Whole foot on the step, push through the heel, step down slowly.',
    how:{setup:['Face the bottom stair, a dumbbell in each hand.','Place your whole foot on the step.'],go:['Push through that heel to stand up tall.','Step down slowly with the other foot.'],tips:['The top leg does the work, no bounce from below.','Knee in line with your toes.']}},
  dead_bug_long:{name:'Dead bug, longer',kind:'timed',sets:2,dur:45,rest:30,label:'Slow and controlled',demo:'Dead_Bug',
    cue:'Low back stays heavy on the floor. Reach opposite arm and leg away, then swap.',
    how:{setup:['On your back, arms to the ceiling, knees bent over hips.','Press your lower back into the floor.'],go:['Lower one arm and the opposite leg slowly towards the floor.','Return and swap sides.'],tips:['Breathe out as you reach.','If your back lifts, make the reach smaller.']}},
  dead_bug_db:{name:'Dead bug with a dumbbell',kind:'timed',sets:2,dur:40,rest:30,load:2.5,fixed:true,unit:'in both hands',label:'Arms still, legs move',demo:'Dead_Bug',
    cue:'Hold a light dumbbell above your chest with both hands. Lower one leg at a time while your back stays heavy.',
    how:{setup:['On your back, knees bent over hips.','Hold one light dumbbell above your chest, arms straight.'],go:['Lower one leg slowly until the heel nearly touches the floor.','Bring it back and swap legs.'],tips:['The dumbbell stays still.','Back lifting? Bend the knee more as you lower.']}},
  hops15:{name:'Pogo hops',kind:'reps',sets:3,reps:'15 small hops',bw:true,rest:45,est:25,legs:true,
    cue:'Quick two-footed bounces on the balls of your feet. Impact helps bone.',note:'Skip these if your hip complains.',
    how:{setup:['Stand tall, feet hip-width, soft knees.'],go:['Small quick bounces on the balls of your feet.','Land softly and go again straight away.'],tips:['Tiny hops. Height is not the point.','Stop if your hip or knees complain.']}},
  hops20:{name:'Pogo hops',kind:'reps',sets:3,reps:'20 small hops',bw:true,rest:45,est:30,legs:true,
    cue:'Quick two-footed bounces on the balls of your feet. Impact helps bone.',note:'Skip these if your hip complains.',
    how:{setup:['Stand tall, feet hip-width, soft knees.'],go:['Small quick bounces on the balls of your feet.','Land softly and go again straight away.'],tips:['Tiny hops. Height is not the point.','Stop if your hip or knees complain.']}},
  sl_bridge:{name:'Single-leg glute bridge',kind:'reps',sets:2,reps:'8–12 each side',bw:true,rest:45,est:60,demo:'Butt_Lift_Bridge',legs:true,
    cue:'One foot planted, the other leg straight. Drive up through the heel and keep your hips level.',note:'If your sore side complains, go back to the two-foot bridge.',
    how:{setup:['On your back, one foot flat near your bottom.','Straighten the other leg, thighs level with each other.'],go:['Push through the planted heel and lift your hips.','Pause at the top, lower slowly.'],tips:['Hips stay level, no tipping to one side.','Ribs down at the top.']}},
  /* ---- block two: new angles ---- */
  heel_goblet:{name:'Heels-up goblet squat',kind:'reps',sets:3,reps:'10–15 reps',load:6.5,from:['goblet_box',1],unit:'one dumbbell',rest:60,demo:'Goblet_Squat',legs:true,
    cue:'Heels on a folded towel or a thin book. Sit straight down between your heels, chest tall.',
    how:{setup:['Heels on a folded towel or a thin book, feet a little wider than hips.','Hold one dumbbell upright against your chest.'],go:['Sit straight down, knees travelling forward over your toes.','Drive up through your whole foot.'],tips:['The raised heels let you sit deeper with a tall chest.','Go only as low as your hip is happy.']}},
  bstance_thrust:{name:'Staggered hip thrust',kind:'reps',sets:3,reps:'10–12 each side',load:3.5,from:['hip_thrust',.7],unit:'across your hips',rest:45,est:60,demo:'Barbell_Hip_Thrust',legs:true,
    cue:'Shoulders on the sofa. One foot flat, the other a little forward with toes up. Drive through the flat foot.',
    how:{setup:['Upper back against the sofa, dumbbell on your hip crease.','One foot flat. The other a half step forward, heel down and toes up, as a kickstand.'],go:['Drive through the flat foot until your body is a table.','Hold one second, lower with control. Swap sides after the set.'],tips:['The kickstand foot only balances you.','Hips level at the top.']}},
  kick_rdl_db:{name:'Kickstand Romanian deadlift',kind:'reps',sets:3,reps:'10–12 each side',load:3.5,from:['rdl',.7],unit:'each hand',rest:45,est:60,demo:'Stiff-Legged_Dumbbell_Deadlift',legs:true,
    cue:'Back foot on its toes for balance, weight in the front leg. Hinge back, then stand.',
    how:{setup:['Front foot flat, back foot a step behind on its toes.','Most of your weight on the front leg.'],go:['Hinge back, weights sliding down the front thigh.','Squeeze the front glute to stand.'],tips:['Hips stay level.','The back foot is only a kickstand.']}},
  rev_lunge:{name:'Reverse lunge',kind:'reps',sets:3,reps:'8–12 each side',load:3.5,from:['split_squat',1],unit:'each hand',rest:60,est:70,demo:'Split_Squat_with_Dumbbells',legs:true,
    cue:'Step back into a lunge, back knee towards the floor, then push through the front heel to stand.',
    how:{setup:['Stand tall, a dumbbell in each hand.'],go:['Take a long step back and lower the back knee towards the floor.','Push through the front heel to bring the feet back together.'],tips:['Front knee tracks over the toes.','A hand on the wall is fine while you learn it.']}},
  alt_press:{name:'Alternating dumbbell press',kind:'reps',sets:3,reps:'8–12 each side',load:3,from:['db_press',1],unit:'each hand',rest:60,est:60,demo:'Standing_Dumbbell_Press',
    cue:'Ribs down, glutes on. Press one arm up while the other waits at your shoulder.',
    how:{setup:['Stand tall, dumbbells at shoulder height, palms forward.','Squeeze glutes and brace your middle.'],go:['Press one dumbbell up until your arm is by your ear.','Lower it and press the other.'],tips:['No leaning to the side as you press.','Stop short of any shoulder pinch.']}},
  /* ---- block three: slow and strong ---- */
  slow_goblet:{name:'Slow goblet squat',kind:'reps',sets:3,reps:'10–12 reps',load:5.5,from:['goblet_box',.8],unit:'one dumbbell',rest:60,est:50,demo:'Goblet_Squat',legs:true,
    cue:'Three seconds down, a one-second pause at the bottom, then stand up strong.',
    how:{setup:['Dumbbell at your chest, feet a little wider than hips.'],go:['Count three seconds on the way down, pause for one.','Stand up strong.'],tips:['The slow part is the point.','Lighter than your usual squat is right.']}},
  pause_thrust:{name:'Paused hip thrust',kind:'reps',sets:3,reps:'10–12 reps',load:3.5,from:['hip_thrust',.8],unit:'across your hips',rest:60,est:55,demo:'Barbell_Hip_Thrust',legs:true,
    cue:'Drive up and hold three seconds at the top. Lower slowly.',
    how:{setup:['Upper back against the sofa, feet flat, dumbbell on your hip crease.'],go:['Drive up until your body is flat like a table.','Hold three seconds, lower for three.'],tips:['Squeeze your glutes through the whole hold.','Chin tucked, eyes forward.']}},
  slow_rdl:{name:'Slow Romanian deadlift',kind:'reps',sets:3,reps:'10–12 reps',load:4.5,from:['rdl',.8],unit:'each hand',rest:60,est:55,demo:'Stiff-Legged_Dumbbell_Deadlift',legs:true,
    cue:'Three seconds down the thighs, then stand up in one smooth move.',
    how:{setup:['Feet hip-width, a dumbbell in each hand in front of your thighs.'],go:['Push your hips back for a slow count of three.','Squeeze your glutes to stand.'],tips:['Back flat all the way.','Weights stay close to your legs.']}},
  slow_split:{name:'Slow split squat',kind:'reps',sets:3,reps:'8–10 each side',load:2.5,from:['split_squat',.8],unit:'each hand',rest:60,est:70,demo:'Split_Squat_with_Dumbbells',legs:true,
    cue:'Three seconds down, pause, drive up. A hand on the wall if you need it.',
    how:{setup:['Long stride stance, dumbbells at your sides.'],go:['Count three seconds on the way down.','Pause, then drive up through the front heel.'],tips:['Front knee tracks over the toes.','Torso tall.']}}
};

const SESS = {
  A:{title:'Session A',sub:'Squat, hinge and push, then a pad run',type:'full',loc:'uk',legs:true,items:['pad_warm',{pair:['goblet_box','knee_push']},{pair:['hip_thrust','rdl']},'dead_bug','pad_intervals']},
  B:{title:'Session B',sub:'Single leg and pull, then a pad run',type:'full',loc:'uk',legs:true,items:['pad_warm',{pair:['split_squat','row']},{pair:['step_up','db_press']},'pallof','pad_intervals']},
  C:{title:'Session C',sub:'The stronger day: a bit more weight, fewer reps',type:'full',loc:'uk',legs:true,items:['pad_warm',{pair:['goblet_heavy','one_arm_row']},'rdl_heavy','hops','carry']},
  P1:{title:'Paris one',sub:'Slow tempo, band and light dumbbells',type:'full',loc:'paris',legs:true,items:['march_warm',{pair:['tempo_split','band_row']},{pair:['kick_rdl','pull_apart']},'pause_bridge','jacks']},
  P2:{title:'Paris two',sub:'Squat, push and stairs',type:'full',loc:'paris',legs:true,items:['march_warm',{pair:['tempo_goblet','knee_push']},{pair:['step_up','face_pull']},'dead_bug','jacks']},
  shortUK:{title:'Ten-minute version',sub:'The minimum that keeps the week alive',type:'short',loc:'uk',legs:true,items:[{id:'pad_warm',dur:120},{pair:['goblet_box','row'],sets:2,rest:45},{id:'hip_thrust',sets:2,rest:45},{id:'dead_bug',sets:1}]},
  shortParis:{title:'Ten-minute version',sub:'The minimum that keeps the week alive',type:'short',loc:'paris',legs:true,items:[{id:'march_warm',dur:120},{pair:['tempo_goblet','band_row'],sets:2,rest:45},{id:'pause_bridge',sets:2},{id:'dead_bug',sets:1}]},
  padIV:{title:'Pad intervals',sub:'Your little runs, eight rounds',type:'cardio',loc:'uk',items:['pad_warm','pad_iv8','pad_cool']},
  parisIV:{title:'Cardio intervals',sub:'Jacks and fast marching, eight rounds',type:'cardio',loc:'paris',items:['march_warm','jacks8','march_cool']},
  T1:{title:'Travel one',sub:'Squat, pull and core. Band and a chair',type:'full',loc:'away',legs:true,items:['march_warm',{pair:['tr_squat','band_row']},{pair:['tr_split','pull_apart']},'pause_bridge','dead_bug']},
  T2:{title:'Travel two',sub:'Hinge, push and stairs. Band and a backpack',type:'full',loc:'away',legs:true,items:['march_warm',{pair:['tr_hinge','knee_push']},{pair:['tr_stepup','face_pull']},'pallof','jacks']},
  shortAway:{title:'Ten-minute version',sub:'Anywhere, no kit',type:'short',loc:'away',legs:true,items:[{id:'march_warm',dur:120},{pair:['tr_squat','knee_push'],sets:2,rest:45},{id:'pause_bridge',sets:2},'dead_bug']},
  mobility:{title:'Full body flow',sub:'Spine, shoulders, hips and ankles',type:'mobility',items:['cat_cow','thread_needle','wall_angel','doorway_pec','hip_flexor','knee_wall','squat_hold','ham_floss','calf_raise']},
  mobHips:{title:'Hips and ankles flow',sub:'Hip circles, lunges, deep squat and calves',type:'mobility',items:['hip_circles','rock_back','hip_flexor','lunge_reach','knee_wall','squat_hold','calf_wall','calf_raise']},
  mobility2:{title:'Full body flow two',sub:'Hamstrings, upper back, hips and shoulders',type:'mobility',items:['inchworm','elbow_sky','lunge_reach','hip_circles','squat_stand','child_reach','band_pass','calf_wall']},
  mobSpine:{title:'Spine and shoulders flow',sub:'Upper back, ribs and shoulders',type:'mobility',items:['cat_cow','elbow_sky','thread_needle','rock_back','child_reach','wall_angel','band_pass','doorway_pec','inchworm']},
  hip:{title:'Hip block',sub:'Your physio’s four stretches',type:'hip',items:['piri_wall','piri_sit','glute_str','supine_flex']},
  coolUK:{title:'Cool-down',sub:'Slow walk and four stretches, with the story',type:'cool',loc:'uk',items:['pad_cool','hip_flexor','thread_needle','ham_floss','doorway_pec']},
  coolParis:{title:'Cool-down',sub:'Slow march and four stretches, with the story',type:'cool',loc:'paris',items:['march_cool','hip_flexor','thread_needle','ham_floss','doorway_pec']},
  walkUK:{title:'Easy walk',sub:'Twenty minutes on the pad',type:'walk',items:['pad_walk']},
  walkParis:{title:'Easy walk',sub:'Twenty minutes outside',type:'walk',items:['walk_out']}
};
const GROUPS = [['legs','Legs','var(--coral)'],['glutes','Glutes','var(--g2)'],['back','Back','var(--indigo)'],['chest','Chest and arms','var(--amber)'],['shoulders','Shoulders','var(--teal)'],['core','Core','var(--good)'],['mobility','Mobility','var(--violet)']];
const MUSCLES = {tr_squat:['legs','glutes'], tr_split:['legs','glutes'], tr_hinge:['glutes','legs'], tr_stepup:['legs','glutes'], goblet_box:['legs','glutes'], goblet_heavy:['legs','glutes'], tempo_goblet:['legs','glutes'], knee_push:['chest'], hip_thrust:['glutes'], rdl:['glutes','legs'], rdl_heavy:['glutes','legs'], kick_rdl:['glutes','legs'],
  dead_bug:['core'], split_squat:['legs','glutes'], tempo_split:['legs','glutes'], row:['back'], one_arm_row:['back'], band_row:['back'], step_up:['legs','glutes'], db_press:['shoulders'], pallof:['core'],
  hops:['legs'], carry:['core','back'], pull_apart:['shoulders','back'], face_pull:['shoulders'], pause_bridge:['glutes'],
  piri_wall:['mobility'], piri_sit:['mobility'], glute_str:['mobility'], supine_flex:['mobility'], cat_cow:['mobility'], thread_needle:['mobility'], wall_angel:['mobility','shoulders'], doorway_pec:['mobility'],
  hip_flexor:['mobility'], knee_wall:['mobility'], squat_hold:['mobility'], ham_floss:['mobility'], calf_raise:['legs','mobility'],
  inchworm:['mobility'], elbow_sky:['mobility'], lunge_reach:['mobility'], hip_circles:['mobility'], squat_stand:['mobility'], child_reach:['mobility'], band_pass:['mobility','shoulders'], rock_back:['mobility'], calf_wall:['mobility'],
  incline_push:['chest'], push_up:['chest','core'], step_up_db:['legs','glutes'], dead_bug_long:['core'], dead_bug_db:['core'], hops15:['legs'], hops20:['legs'], sl_bridge:['glutes'],
  heel_goblet:['legs','glutes'], bstance_thrust:['glutes'], kick_rdl_db:['glutes','legs'], rev_lunge:['legs','glutes'], alt_press:['shoulders'],
  slow_goblet:['legs','glutes'], pause_thrust:['glutes'], slow_rdl:['glutes','legs'], slow_split:['legs','glutes']};
const BASE_EX = JSON.parse(JSON.stringify(EX));
const BASE_SESS = JSON.parse(JSON.stringify(SESS));
const POINTS = {full:30, short:15, cardio:20, hip:10, walk:10, mobility:15, cool:5};
/* Pad runs: seven levels from short bursts to a steady 20 minutes at 6 km/h (her pad's top speed).
   Up a level after a run that felt about right or easy; same again if hard; down if too much or the hip was sore. */
const RUNS = [
  {rounds:8, on:45, off:45, fin:{rounds:3, on:45, off:45}}, {rounds:6, on:60, off:60, fin:{rounds:4, on:45, off:45}},
  {rounds:5, on:120, off:60, fin:{rounds:3, on:60, off:60}}, {rounds:4, on:180, off:60, fin:{rounds:3, on:90, off:45}},
  {rounds:3, on:300, off:60, fin:{rounds:3, on:120, off:60}}, {rounds:2, on:480, off:60, fin:{rounds:2, on:180, off:45}},
  {steady:1200, fin:{steady:360}}];
/* Ladders: each one starts at the version in her sessions and swaps in the next once she masters it.
   Reps: two sessions in a row with every set at the top of the range. Timed: three sessions done. Never on a "too much" day or a sore hip. */
const LADDERS = {
  push:{name:'Push-up', rungs:['knee_push','incline_push','push_up']},
  stepup:{name:'Step-up', rungs:['step_up','step_up_db']},
  deadbug:{name:'Dead bug', rungs:['dead_bug','dead_bug_long','dead_bug_db'], timed:3},
  hops:{name:'Pogo hops', rungs:['hops','hops15','hops20']},
  bridge:{name:'Glute bridge', rungs:['pause_bridge','sl_bridge']}
};
const ladderOf = id => Object.keys(LADDERS).find(k=>LADDERS[k].rungs.includes(id));
const ladLevel = k => Math.max(0, Math.min(LADDERS[k].rungs.length-1, ((typeof S!=='undefined' && S.ladder) || {})[k] || 0));
const ladId = id => { const k = ladderOf(id); return k ? LADDERS[k].rungs[ladLevel(k)] : id; };
/* Blocks: every six weeks of London training, Sessions A, B and C rotate to fresh exercises for the same movements.
   Loads carry over per exercise; new ones start from a related lift. Paris and travel sessions stay as they are. */
const BLOCK_WEEKS = 6;
const BLOCKS = [
  {name:'Foundations', blurb:'The core lifts: box squat, hip thrust, Romanian deadlift, split squat, rows and presses.'},
  {name:'New angles', blurb:'Same movements, new angles: heels-up squats, staggered thrusts and hinges, reverse lunges and alternating presses.', sessions:{
    A:{sub:'Heels-up squat, staggered thrust and hinge, then a pad run', items:['pad_warm',{pair:['heel_goblet','knee_push']},{pair:['bstance_thrust','kick_rdl_db']},'dead_bug','pad_intervals']},
    B:{sub:'Reverse lunge, one-arm row and step-ups, then a pad run', items:['pad_warm',{pair:['rev_lunge','one_arm_row']},{pair:['step_up','alt_press']},'pallof','pad_intervals']},
    C:{sub:'The stronger day: hinge and row, then squat', items:['pad_warm',{pair:['rdl_heavy','row']},'goblet_heavy','hops','carry']}}},
  {name:'Slow and strong', blurb:'Slower lowering and pauses at the hardest point. Lighter weights, more time under tension, kind to tendons.', sessions:{
    A:{sub:'Slow squat, paused thrust and slow hinge, then a pad run', items:['pad_warm',{pair:['slow_goblet','knee_push']},{pair:['pause_thrust','slow_rdl']},'dead_bug','pad_intervals']},
    B:{sub:'Slow split squat, row and step-ups, then a pad run', items:['pad_warm',{pair:['slow_split','row']},{pair:['step_up','db_press']},'pallof','pad_intervals']}}}
];
const blockIdx = () => (((typeof S!=='undefined' && S.block && S.block.i) || 0) % BLOCKS.length);
const mapItem = it => typeof it==='string' ? ladId(it) : it.pair ? Object.assign({}, it, {pair: it.pair.map(ladId)}) : Object.assign({}, it, {id: ladId(it.id)});
const runDesc = (n, fin) => { const x = fin ? RUNS[n-1].fin : RUNS[n-1]; if(x.steady) return `${x.steady/60} minutes steady at 6 km/h`;
  const t = v => v>=60 ? (v/60)+' min' : v+' s'; return `${x.rounds} × ${t(x.on)} at 6, ${t(x.off)} easy`; };
function installRuns(){ // re-run after every plan apply, which rebuilds EX and SESS
RUNS.forEach((x,i)=>{ const n = i+1;
  EX['run'+n] = x.steady
    ? {name:'The long run', kind:'timed', dur:x.steady, label:'Steady · 6 km/h', cue:'Twenty minutes at 6. Find a rhythm you could hold a conversation at. If you need to, drop to 5 for a minute and come back.'}
    : {name:`Pad run, level ${n}`, kind:'iv', rounds:x.rounds, on:x.on, off:x.off, onLabel:'Run · 6 km/h', offLabel:'Easy · 4.5 km/h',
       cue:`${runDesc(n)}. Push the pad to 6 for the run, back to 4.5 to recover.`};
  MUSCLES['run'+n] = ['legs'];
  const f = x.fin;
  EX['fin'+n] = f.steady
    ? {name:'Pad run finisher', kind:'timed', dur:f.steady, label:'Steady · 6 km/h', cue:`${f.steady/60} minutes at 6 to finish. Steady, chatty pace.`}
    : {name:'Pad run finisher', kind:'iv', rounds:f.rounds, on:f.on, off:f.off, onLabel:'Run · 6 km/h', offLabel:'Easy · 4.5 km/h', cue:`${runDesc(n,true)}. Your little runs, growing.`};
  MUSCLES['fin'+n] = ['legs'];
});
// Every session reads its items live: London A, B and C from the current block (unless the coach's plan sets them),
// ladders swap in her current rung, and A and B finish with the run at her current level.
let ov = {}; try{ ov = (plan && plan.sessions) || {}; }catch(e){}
for(const [code, sess] of Object.entries(SESS)){ if(code==='padIV') continue;
  const base = sess.items.slice(), baseSub = sess.sub;
  const fromBlock = () => !(ov[code] && ov[code].items) && sess.loc==='uk' && (BLOCKS[blockIdx()].sessions||{})[code];
  Object.defineProperty(sess, 'items', {get(){ const b = fromBlock();
    return (b ? b.items : base).map(it => (code==='A'||code==='B') && (it==='pad_intervals' || /^fin\d$/.test(it)) ? 'fin'+runLevel() : mapItem(it)); }, configurable:true, enumerable:true});
  Object.defineProperty(sess, 'sub', {get(){ const b = fromBlock(); return b ? b.sub : baseSub; }, configurable:true, enumerable:true}); }
if(SESS.padIV){
  Object.defineProperty(SESS.padIV, 'items', {get(){ return ['pad_warm', 'run'+runLevel(), 'pad_cool']; }, configurable:true});
  Object.defineProperty(SESS.padIV, 'sub', {get(){ return `Level ${runLevel()} of ${RUNS.length}: ${runDesc(runLevel())}`; }, configurable:true});
  SESS.padIV.title = 'Pad run'; }
}
installRuns();
const runLevel = () => Math.max(1, Math.min(RUNS.length, S.runLevel || 1));
const ORDER = {uk:['A','B','C'], paris:['P1','P2'], away:['T1','T2']};
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
const S = {loc:'uk', loads:{}, step:1, voice:true, theme:'system', dragon:'Pip', read:{}, rewards:DEFAULT_REWARDS, rewardsUpdated:0,
  redemptions:[], prizes:{}, planApplied:0, nudged:{}, updated:0, lastSync:0, ladder:{}, ladTop:{}, block:null, blockSeen:0};
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
  // corrections to logged sessions (e.g. the weights she actually used), keyed by session id
  if(p.fixes) for(const x of sessions){ const f = p.fixes[x.id]; if(f) Object.assign(x, f); }
  if(p.loads && (p.updated||0) > (S.planApplied||0)){ S.loads = Object.assign({}, S.loads, p.loads); S.planApplied = p.updated; }
  installRuns();
}

/* ================= Dates & stats ================= */
const ivWord = (e, on) => ((on ? e.onLabel : e.offLabel)||'').split(' · ')[0] || (on ? 'Fast' : 'Easy');
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
  const paris = all.some(s=>s.location==='paris' || s.location==='away') || (isCurrent && S.loc!=='uk');
  return {start, days, all, count, target: paris ? 2 : 3};
}
function weeksOnTarget(){
  const now = new Date(); let n = 0;
  const cur = weekInfo(now, true); if(cur.count >= cur.target) n++;
  for(let w=1; w<200; w++){ const wi = weekInfo(addDays(weekStart(now), -7*w), false); if(wi.count >= wi.target) n++; else break; }
  return n;
}
const trainingTotal = () => sessions.filter(isTraining).length;
/* blocks: count weeks with at least one London strength session; weeks away or off don't use the block up */
const ukFull = () => sessions.filter(s=>s.kind==='full' && s.location==='uk').sort((a,b)=>a.ts-b.ts);
function ensureBlock(){
  const all = ukFull(); if(!all.length) return;
  if(!S.block){ S.block = {i:0, start: weekStart(new Date(all[0].ts)).getTime()}; S.blockSeen = 0; touch(); }
  const thisWeek = weekStart(new Date()).getTime();
  const done = new Set(all.filter(s=>s.ts>=S.block.start).map(s=>weekStart(new Date(s.ts)).getTime()).filter(w=>w<thisWeek));
  if(done.size >= BLOCK_WEEKS){ S.block = {i:S.block.i+1, start:thisWeek}; touch(); }
}
function blockInfo(){
  const b = S.block || {i:0, start:weekStart(new Date()).getTime()}, now = weekStart(new Date()).getTime();
  const wk = new Set(ukFull().filter(s=>s.ts>=b.start).map(s=>weekStart(new Date(s.ts)).getTime()));
  return {i:b.i, n:(b.i % BLOCKS.length)+1, round:Math.floor(b.i / BLOCKS.length)+1, def:BLOCKS[b.i % BLOCKS.length], week:Math.min(BLOCK_WEEKS, wk.size + (wk.has(now) ? 0 : 1))};
}
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

/* ================= Story ================= */
// longer sessions carry the story further, matching the 10, 20 and 30 minute choices on Today:
// under 15 planned minutes earns one scene, 15 to 21 earns two, 22 or more earns three. Stopping early earns one.
// The number is saved on the session, so later plan changes never move the story backwards.
function earnFor(code, trim, early){ if(!SESS[code] || !TRAINING.has(SESS[code].type)) return 0; if(early) return 1;
  const m = estMin(code, trim); return m < 15 ? 1 : m < 22 ? 2 : 3; }
const sceneEarn = s => !isTraining(s) ? 0 : (s.story ?? (s.kind==='short' || s.partial ? 1 : (s.trim || s.kind==='cardio') ? 2 : 3));
const runEarn = r => earnFor(r.code, r.trim, false);
const scenesOpen = () => Math.min(STORY.scenes.length, 1 + sessions.reduce((a,s)=>a+sceneEarn(s),0));
const chapterOf = i => STORY.chapters.find(c=>i>=c.from && i<=c.to) || STORY.chapters[STORY.chapters.length-1];
const sceneLabel = i => { const c = chapterOf(i); return i===0 ? 'Start' : String(c.from===0 ? i : i - c.from + 1); };
const NUMW = ['one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve'];
const BOOKS = () => STORY.books || [{title:STORY.title, notebook:'Kesh’s ledger', from:0, to:1e9}];
const bookOf = i => BOOKS().find(b=>i>=b.from && i<=b.to) || BOOKS()[BOOKS().length-1];
// when did chapter c open? the session that brought the earned scene count up to its first scene
function chapterStart(c){ if(c.from===0) return 0; let n = 0;
  for(const x of sessions.filter(isTraining).sort((a,b)=>a.ts-b.ts)){ n += sceneEarn(x); if(n >= c.from) return x.ts; }
  return Infinity; }
function openNotes(){
  const so = scenesOpen(), care = sessions.filter(x=>x.kind==='hip'||x.kind==='mobility'||x.kind==='cool'), out = [];
  STORY.chapters.forEach(c=>{ if(!c.notes || c.from >= so) return; const st = chapterStart(c);
    let left = care.filter(x=>x.ts>=st).length;
    // in order; an extra waits until the scene it relates to is open, so nothing spoils the story
    for(let j=c.notes[0]; j<=c.notes[1] && j<STORY.notes.length && left>0; j++){ if((STORY.notes[j].after||0) >= so) break; out.push(j); left--; } });
  return out;
}
const notesOpen = () => openNotes().length;
const unread = () => { let n = 0; for(let i=0;i<scenesOpen();i++) if(!S.read['s'+i]) n++; openNotes().forEach(i=>{ if(!S.read['n'+i]) n++; }); return n; };

/* ================= Dragon lines and nudges ================= */
const LINES = {
  egg:['Still an egg. Warm me up with a session, would you.','Egg. Waiting. Not impressed yet.','I can hear you not training from in here.'],
  ready:['I’ve already picked today’s session. You’re welcome.','The weights won’t lift themselves. I checked.','Begin. I’ll supervise from up here.','Twenty-odd minutes. You’ve sat through longer meetings.'],
  recovery:['Rest day. I’m napping professionally.','We rest today. Doctor’s orders. I’m the doctor.','Recovery is training. I read that somewhere. I can’t read.'],
  done:['That’ll do. I’m going back to sleep.','Fine. That was good. Don’t let it go to your head.','I saw that. I’m telling everyone.','Done. I may have grown a scale. Don’t stare.'],
  hipOnly:['Stretched. Very dignified. I might have hips. Unclear.'],
  peckish:['Three days. I’m not wasting away. I’m a bit see-through.','Remember me? Small. Scaly. Peckish.'],
  sulk:['I’m not sulking. I’m resting my face.','Fine. I’ll sit on this cold rock. Ten minutes and I’ll forget it happened.'],
  away:['New place, same dragon. A chair and a band will do.','Travel week. Two sessions keeps the streak. I counted.','Hotel rooms are just gyms with worse lighting.'],
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
  if(S.loc==='away') return pickLine('away');
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
  if(hour>=21) return {id:'late', head:'It’s late', body:'Hip block and bed. I’ll allow it.', hip:true};
  return null;
}

/* ================= Planning ================= */
function nextFull(){
  const order = ORDER[S.loc];
  const last = sorted().find(s => s.kind==='full' && order.includes(s.code));
  return last ? order[(order.indexOf(last.code)+1)%order.length] : order[0];
}
const shortCode = () => ({uk:'shortUK', paris:'shortParis', away:'shortAway'})[S.loc] || 'shortUK';
const walkCode = () => S.loc==='uk' ? 'walkUK' : 'walkParis';
const cardioCode = () => S.loc==='uk' ? 'padIV' : 'parisIV';
// mobility flows take turns: full body, hips and ankles, full body two, spine and shoulders
const MOB = ['mobility','mobHips','mobility2','mobSpine'];
function mobilityCode(){ const last = sorted().find(s=>s.kind==='mobility' && MOB.includes(s.code)); return last ? MOB[(MOB.indexOf(last.code)+1) % MOB.length] : MOB[0]; }
const coolCode = () => S.loc==='uk' ? 'coolUK' : 'coolParis';
const LOCNAME = {uk:'London', paris:'Paris', away:'Travelling'};
function plan_(){
  const now = new Date(), t = dayKey(now), y = dayKey(addDays(now,-1));
  const todays = sessions.filter(s=>s.day===t);
  const hipDone = todays.some(s=>s.kind==='hip');
  const trained = todays.find(isTraining);
  const walked = todays.find(s=>s.kind==='walk' || s.kind==='mobility');
  const trainedY = sessions.some(s=>s.day===y && isTraining(s));
  const recovery = !trained && trainedY && !ui.trainAnyway;
  let main = null;
  if(!trained){ main = recovery ? (walked ? null : mobilityCode()) : nextFull(); }
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
  const calmRun = ['hip','mobility','cool'].includes(SESS[code].type);
  if(calmRun){
    // stretching sessions run hands-free: bodyweight reps become timed, and each step starts itself after a visible get-ready
    for(let k=0;k<steps.length;k++){ const st = steps[k], e = EX[st.ex];
      if(st.t==='work' && e && e.bw){ steps[k] = {t:'time', ex:st.ex, set:st.set, of:st.of, dur:e.est||45, lead:5, label:e.reps};
        if(steps[k+1] && steps[k+1].t==='rest') steps.splice(k+1, 1); }
      else if(st.t==='time' && !st.lead) st.lead = 5; }
  }
  steps.forEach((s,i)=>{ const p = steps[i-1]; s.auto = (calmRun && (s.t==='time'||s.t==='hold')) || (!!p && ((s.t==='hold'&&p.t==='hold')||(s.t==='iv'&&p.t==='iv'))); });
  return steps;
}
function estMin(code, trim){
  const secs = build(code, trim).reduce((a,s)=>a+(s.t==='work' ? (EX[s.ex].est||40) : (s.dur+(s.lead||0))),0);
  return Math.max(1, Math.round(secs/60));
}
// a lift she hasn't done yet starts from a related one (e.g. reverse lunge from split squat), snapped to her dial
const loadOf = id => S.loads[id] ?? (EX[id].from && EX[EX[id].from[0]] ? snapKg(loadOf(EX[id].from[0]) * EX[id].from[1]) : EX[id].load);
const hasLoad = id => EX[id] && EX[id].load !== undefined && !EX[id].bw;

/* ================= Sound, voice, screen ================= */
let actx = null, wl = null, voiceGB = null;
function audioOn(){
  setAudioMode();
  try{ if(!actx) actx = new (window.AudioContext||window.webkitAudioContext)(); if(actx.state==='suspended') actx.resume(); }catch(e){}
  try{ if(window.speechSynthesis && !voiceGB){ const vs = speechSynthesis.getVoices(); voiceGB = vs.find(v=>/en-GB/i.test(v.lang) && /female|serena|kate|stephanie|martha/i.test(v.name)) || vs.find(v=>/en-GB/i.test(v.lang)) || null; } }catch(e){}
}
// 'transient' plays over other apps' music (iOS treats it as ambient: muted in silent mode).
// 'playback' takes over: pauses music, ignores silent mode, keeps going when the phone locks. The story uses it.
function setAudioMode(){ try{ if(navigator.audioSession) navigator.audioSession.type = (NARR.active && NARR.rec) || S.overMusic===false ? 'playback' : 'transient'; }catch(e){} }
function tone(f=880, len=.18, vol=.28){
  if(!actx) return;
  try{ const t = actx.currentTime, o = actx.createOscillator(), g = actx.createGain();
    o.frequency.value = f; o.type = 'sine'; g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(vol,t+.02); g.gain.exponentialRampToValueAtTime(.0001,t+len);
    o.connect(g).connect(actx.destination); o.start(t); o.stop(t+len+.03); }catch(e){}
}
const chime = () => { tone(784,.16,.4); setTimeout(()=>tone(1046,.26,.4),140); };
function say(text){
  if(!S.voice || !window.speechSynthesis || NARR.playing) return; // the story has the floor; tones and flashes still mark changes
  try{ speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = 'en-GB'; if(voiceGB) u.voice = voiceGB; u.rate = 1.02; speechSynthesis.speak(u); }catch(e){}
}
function flash(word, rest){
  const f = document.getElementById('flash'); f.textContent = word; f.classList.toggle('rest', !!rest);
  f.classList.remove('on'); void f.offsetWidth; f.classList.add('on');
}
/* ================= Story narrator =================
   Recorded narration (audio.js, made by movement-data/tools/voice) when an item has it,
   otherwise the phone's own voice. One queue, one mini player. */
const NARR = {active:false, playing:false, queue:[], k:0, chunks:[], c:0, tok:0, rec:null, p:-1};
const aud = new Audio(); aud.preload = 'auto';
const recFor = q => (S.narrMode !== 'voice' && typeof AUDIO !== 'undefined' && AUDIO.items[q.t+q.i]) || null;
const recRate = () => ({.85:.9, .95:1, 1.05:1.1})[S.narrRate || .95] || 1;
function storyVoices(){ try{ const vs = speechSynthesis.getVoices() || []; return vs.filter(v=>/^en[-_]/i.test(v.lang)); }catch(e){ return []; } }
function storyVoice(){
  const vs = storyVoices(); if(S.narrator){ const v = vs.find(v=>v.voiceURI===S.narrator); if(v) return v; }
  const gb = vs.filter(v=>/en[-_]GB/i.test(v.lang));
  return gb.find(v=>/premium/i.test(v.name)) || gb.find(v=>/enhanced/i.test(v.name)) || voiceGB || gb[0] || vs[0] || null;
}
// 'r' is the short spoken recap of scene i, played before the next new scene
const itemOf = q => q.t==='s' ? STORY.scenes[q.i] : q.t==='r' ? {title:'Previously', text:[STORY.scenes[q.i].recap || '']} : STORY.notes[q.i];
function chunksFor(q){
  const it = itemOf(q), out = [{p:-1, text: smart(it.title) + '.'}];
  [].concat(it.text).map(smart).forEach((para, pi)=>{
    const sents = para.match(/[^.!?…]+[.!?…]+[’”"')]*\s*|[^.!?…]+$/g) || [para]; let buf = '';
    sents.forEach(x=>{ if(buf && (buf + x).length > 220){ out.push({p:pi, text:buf.trim()}); buf = ''; } buf += x; });
    if(buf.trim()) out.push({p:pi, text:buf.trim()});
  });
  return out;
}
function narrNext(){
  const q = NARR.queue[NARR.k]; if(q && q.t!=='r'){ S.read[q.t+q.i] = 1; touch(); }
  NARR.k++; if(NARR.k >= NARR.queue.length){ narrStop(); return; }
  narrItem(NARR.rec ? 0 : 1200);
}
// start the current queue item, recorded if we have it
function narrItem(delay){
  const q = NARR.queue[NARR.k], rec = recFor(q); const tok = ++NARR.tok;
  NARR.rec = rec; NARR.p = -1; NARR.chunks = rec ? [] : chunksFor(q); NARR.c = 0;
  if(rec){
    aud.src = rec.src; aud.playbackRate = recRate(); aud.defaultPlaybackRate = recRate();
    mediaMeta(q, rec); NARR.switching = true; const pr = aud.play(); if(pr && pr.catch) pr.catch(e=>{ if(e && e.name==='NotAllowedError'){ NARR.playing = false; paintNP(); } });
  } else { try{ aud.pause(); }catch(e){} setTimeout(()=>{ if(tok===NARR.tok) narrSpeak(); }, delay||0); }
  paintNP();
}
function narrSpeak(){
  if(!NARR.playing || NARR.rec || !window.speechSynthesis) return;
  const ch = NARR.chunks[NARR.c];
  if(!ch){ narrNext(); return; }
  NARR.p = ch.p; const tok = ++NARR.tok;
  try{ const u = new SpeechSynthesisUtterance(ch.text); u.lang = 'en-GB'; const v = storyVoice(); if(v){ u.voice = v; u.lang = v.lang; } u.rate = S.narrRate || .95;
    u.onend = ()=>{ if(tok!==NARR.tok || !NARR.playing) return; NARR.c++; paintNP(); narrSpeak(); };
    u.onerror = ()=>{ if(tok!==NARR.tok || !NARR.playing) return; NARR.c++; narrSpeak(); };
    speechSynthesis.speak(u); }catch(e){}
  paintNP();
}
aud.addEventListener('ended', ()=>{ if(NARR.active && NARR.rec) narrNext(); });
aud.addEventListener('timeupdate', ()=>{ if(!NARR.rec) return; const m = NARR.rec.marks || []; let j = 0; for(let x=0;x<m.length;x++) if(aud.currentTime >= m[x]) j = x; if(j-1 !== NARR.p){ NARR.p = j-1; } paintNP(true); });
aud.addEventListener('playing', ()=>{ NARR.switching = false; });
aud.addEventListener('pause', ()=>{ if(NARR.rec && NARR.playing && !NARR.cue && !NARR.switching && !aud.ended){ NARR.playing = false; paintNP(); } });
aud.addEventListener('play', ()=>{ if(NARR.rec && !NARR.playing){ NARR.playing = true; paintNP(); } });
function mediaMeta(q, rec){
  try{ if(!('mediaSession' in navigator)) return; const it = itemOf(q);
    navigator.mediaSession.metadata = new MediaMetadata({title: it.title, artist: q.t!=='n' ? `Read by ${AUDIO.voices.s}` : `${kindOf(it)} · read by ${AUDIO.voices.n}`, album: bookOf(q.t!=='n' ? q.i : 0).title, artwork:[{src:'icons/icon-512.png', sizes:'512x512', type:'image/png'}]});
    const h = (a, f) => { try{ navigator.mediaSession.setActionHandler(a, f); }catch(e){} };
    h('play', ()=>narrResume()); h('pause', ()=>narrPause());
    h('seekbackward', ()=>{ aud.currentTime = Math.max(0, aud.currentTime - 15); }); h('seekforward', ()=>{ aud.currentTime = Math.min(aud.duration||0, aud.currentTime + 15); });
    h('nexttrack', NARR.k+1 < NARR.queue.length ? ()=>{ aud.pause(); narrNext(); } : null);
    h('previoustrack', ()=>{ aud.currentTime = 0; });
  }catch(e){}
}
function narrStart(queue){
  if(!queue.length) return;
  audioOn(); NARR.tok++; try{ speechSynthesis.cancel(); }catch(e){}
  Object.assign(NARR, {active:true, playing:true, queue, k:0, c:0}); NARR.rec = recFor(queue[0]); setAudioMode();
  lockScreen(); narrItem(0);
}
function narrPause(){ NARR.playing = false; NARR.tok++; if(NARR.rec) aud.pause(); else try{ speechSynthesis.cancel(); }catch(e){} paintNP(); }
function narrResume(){ if(!NARR.active) return; NARR.playing = true; lockScreen(); if(NARR.rec){ aud.play(); paintNP(); } else narrSpeak(); }
function narrStop(){
  NARR.active = false; NARR.playing = false; NARR.rec = null; NARR.tok++; setAudioMode();
  try{ aud.pause(); aud.removeAttribute('src'); aud.load(); }catch(e){} try{ speechSynthesis.cancel(); }catch(e){}
  try{ navigator.mediaSession.metadata = null; }catch(e){}
  if(ui.screen!=='run') unlockScreen(); paintNP(); if(ui.screen==='read' || (ui.screen==='tab' && ui.tab==='realm')) render();
}
// how long an item takes to hear: the recording if there is one, otherwise a reading-pace estimate
function itemSecs(q){ const a = typeof AUDIO !== 'undefined' && AUDIO.items[q.t+q.i]; if(a && a.dur) return a.dur;
  const it = itemOf(q); return [].concat(it.text).join(' ').split(/\s+/).length / 2.6 + 3; }
// what to play while stretching, sized to the stretching time (budget, in seconds):
// unread scenes in order (plus any this session is about to earn), each followed by the satchel finds that belong to it.
// New scenes open with a one or two sentence "Previously" recap of the scene before, so she knows where she is.
function storyQueue(earn, budget){
  budget = budget || 420;
  const so = scenesOpen(), book = bookOf(Math.max(0, so-1)), top = Math.min(STORY.scenes.length, so + (earn||0));
  const scenes = []; for(let i=0;i<top;i++){ if(i>=so && bookOf(i)!==book) break; if(!S.read['s'+i]) scenes.push(i); }
  const notes = openNotes().filter(i=>!S.read['n'+i]), used = new Set(), cand = [];
  const notesUpTo = i => notes.forEach(j=>{ if(!used.has(j) && (STORY.notes[j].after||0) <= i){ used.add(j); cand.push({t:'n', i:j}); } });
  if(scenes.length) notesUpTo(scenes[0]-1);
  scenes.forEach(i=>{ cand.push({t:'s', i}); notesUpTo(i); });
  notesUpTo(1e9);
  if(!cand.length){ return so ? [{t:'s', i:so-1}] : []; }
  const first = scenes[0];
  if(first > 0 && bookOf(first-1)===bookOf(first) && STORY.scenes[first-1].recap) cand.unshift({t:'r', i:first-1});
  const q = []; let t = 0;
  for(const x of cand){ if(q.length && t >= budget) break; q.push(x); t += itemSecs(x); }
  return q.slice(0, 12);
}
// seconds left in the session from step k on, on the same estimate the session preview uses
const secsLeft = (steps, k) => steps.slice(k).reduce((a,s)=>a+(s.t==='work' ? (EX[s.ex].est||40) : ((s.dur||0)+(s.lead||0))),0);
function paintNP(light){
  const el = document.getElementById('np'); if(!el) return;
  if(!NARR.active){ el.hidden = true; document.body.classList.remove('np-on'); document.querySelectorAll('.rbody p.speaking').forEach(p=>p.classList.remove('speaking')); return; }
  const q = NARR.queue[NARR.k], it = itemOf(q);
  const pct = NARR.rec ? (aud.duration ? aud.currentTime/aud.duration*100 : 0) : Math.min(100, NARR.c / Math.max(1, NARR.chunks.length) * 100);
  const bar = el.querySelector('.in > i');
  if(light && bar && el.dataset.k === String(NARR.k) && el.dataset.pl === String(NARR.playing)){ bar.style.width = pct.toFixed(1)+'%'; }
  else {
    el.hidden = false; document.body.classList.add('np-on'); el.dataset.k = NARR.k; el.dataset.pl = NARR.playing;
    el.innerHTML = `<div class="in"><span class="npk">${NARR.playing ? (NARR.rec ? `Read by ${esc(q.t!=='n' ? AUDIO.voices.s : AUDIO.voices.n)}` : 'Reading') : 'Paused'}${NARR.queue.length>1 ? ` · ${NARR.k+1} of ${NARR.queue.length}` : ''}</span><span class="npt">${dx(it.title)}</span>
      <button class="npb" data-a="${NARR.playing?'narrpause':'narrplay'}" aria-label="${NARR.playing?'Pause the story':'Play the story'}">${NARR.playing?I.pause:I.play}</button>
      <button class="npb ghost" data-a="narrstop" aria-label="Stop the story">${I.x}</button><i style="width:${pct.toFixed(1)}%"></i></div>`;
  }
  const ps = document.querySelectorAll('.rbody p'); const here = ui.screen==='read' && ui.read && ui.read.t===q.t && ui.read.i===q.i;
  ps.forEach((p,x)=>p.classList.toggle('speaking', here && x===NARR.p));
}
async function lockScreen(){ try{ if(navigator.wakeLock) wl = await navigator.wakeLock.request('screen'); }catch(e){} }
function unlockScreen(){ try{ wl && wl.release(); }catch(e){} wl = null; }
try{ if(window.speechSynthesis) speechSynthesis.onvoiceschanged = ()=>{ if(ui.screen==='settings') render(); }; }catch(e){}
document.addEventListener('visibilitychange', ()=>{ if(document.visibilityState==='visible'){ if(ui.screen==='run') lockScreen(); queueSync(); } });

/* ================= Session runner ================= */
function startSession(code, trim){
  audioOn(); lockScreen();
  const steps = build(code, trim), loads = {};
  steps.forEach(s=>{ if(s.ex && hasLoad(s.ex)) loads[s.ex] = EX[s.ex].fixed ? loadOf(s.ex) : snapKg(loadOf(s.ex)); });
  ui.run = {code, trim:!!trim, steps, i:0, timer:null, started:Date.now(), loads, done:0, efforts:{}, sets:{}, repsBy:{}, lastSec:null};
  ui.screen = 'run'; ui.sheet = null;
  if(SESS[code].type==='cool' && S.storyCool!==false && !NARR.active) narrStart(storyQueue(0, secsLeft(steps, 0))); // inside the tap, so the phone allows playback
  enterStep(true); window.scrollTo(0,0);
}
function spokenFor(s){
  const e = EX[s.ex];
  if(s.t==='work') return `${e.name}. ${s.of>1?`Set ${s.set} of ${s.of}. `:''}${e.reps}.`;
  if(s.t==='rest'){ const nx = ui.run.steps[ui.run.i+1]; return nx && EX[nx.ex] ? `Rest. Next, ${EX[nx.ex].name}.` : 'Rest.'; }
  if(s.t==='iv') return s.phase==='on' ? (s.set===1 ? `${e.name}. ${ivWord(e,true)}.` : `${ivWord(e,true)}.`) : `${ivWord(e,false)}.`;
  if(s.t==='hold') return `${s.set===1&&s.side==='Left'?e.name+'. ':''}${s.side} side. Get into position.`;
  if(s.t==='time') return `${e.name}. ${e.label}.`;
  return '';
}
function enterStep(first){
  const r = ui.run, s = r.steps[r.i]; r.timer = null; r.lastSec = null;
  if(s.t==='work'){ const last = (S.lastReps||{})[s.ex]; r.repNow = (r.repsBy[s.ex]||[])[s.set-1] ?? (last && last[s.set-1]) ?? repRange(EX[s.ex])[0]; } // last time's reps, so she only taps when she beats it
  if(s.t==='rest' || s.auto) startTimer(s.dur + (s.lead||0));
  say(spokenFor(s));
  render(); if(!first) window.scrollTo({top:0, behavior:'smooth'});
}
// back to the previous exercise step (skipping rests), undoing what that step had logged
function goBack(){
  const r = ui.run; if(!r || r.i===0) return;
  let j = r.i - 1; while(j>0 && r.steps[j].t==='rest') j--;
  for(let k=j; k<r.i; k++){ const st = r.steps[k]; if(st.t==='rest') continue; r.done = Math.max(0, r.done-1);
    if(st.ex && r.sets[st.ex]) r.sets[st.ex]--; if(st.t==='work' && r.repsBy[st.ex]) r.repNow = r.repsBy[st.ex][st.set-1] ?? r.repNow; }
  r.i = j; tone(660,.15); enterStep(false);
  const s = r.steps[r.i]; if(s.t==='work' && r.repsBy[s.ex] && r.repsBy[s.ex][s.set-1]!==undefined) r.repNow = r.repsBy[s.ex][s.set-1];
  render();
}
function startTimer(sec){ ui.run.timer = {end:Date.now()+sec*1000, total:sec, paused:false, remaining:0}; }
function advance(){
  const r = ui.run, s = r.steps[r.i];
  if(s.t!=='rest') r.done++;
  if(s.ex && (s.t==='work' || s.t==='time' || (s.t==='hold'))) r.sets[s.ex] = (r.sets[s.ex]||0) + 1;
  if(s.t==='work'){ (r.repsBy[s.ex] = r.repsBy[s.ex]||[])[s.set-1] = r.repNow; }
  r.i++;
  if(r.i >= r.steps.length){ chime(); flash('Done'); say('Done. Lovely work.'); finishRun(false); return; }
  const n = r.steps[r.i];
  if(s.t==='rest'){ flash('Go'); tone(1046,.3); }
  else if(n.t==='rest'){ flash('Rest', true); tone(660,.25); }
  else if(n.t==='iv'){ flash(ivWord(EX[n.ex], n.phase==='on'), n.phase!=='on'); tone(n.phase==='on'?1046:660,.25); }
  else if(n.t==='hold'){ flash('Switch', true); tone(880,.22); }
  else { tone(880,.22); }
  enterStep(false);
}
setInterval(()=>{ const c = document.getElementById('clk'); if(c && ui.run) c.textContent = fmtClock(Date.now()-ui.run.started); }, 1000);
setInterval(()=>{
  const r = ui.run; if(ui.screen!=='run' || !r || !r.timer || r.timer.paused) return;
  const s = r.steps[r.i]; const left = Math.max(0, r.timer.end - Date.now());
  paintTimer(s, left);
  if(s.lead && !r.timer.leadDone && left <= s.dur*1000){ r.timer.leadDone = true; tone(988,.14); say('Hold.'); }
  const sec = Math.ceil(left/1000);
  if(sec !== r.lastSec){ r.lastSec = sec; if(sec<=3 && sec>0 && !(s.lead && left > s.dur*1000)){ tone(620,.08,.2); const b = document.getElementById('ring'); if(b){ b.classList.remove('pulse'); void b.offsetWidth; b.classList.add('pulse'); } } }
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
  const lbl = document.getElementById('rlbl'); if(lbl && (s.t==='hold' || s.lead)) lbl.textContent = lead ? 'Get into position' : s.t==='hold' ? 'Hold' : (s.of>1 ? `Set ${s.set} of ${s.of}` : 'Go');
  // the countdown stays visible when a sheet covers the screen
  const sc = document.getElementById('sheetclock'); if(sc) sc.textContent = `${lead ? 'Get ready' : s.t==='rest' ? 'Rest' : 'Time left'} ${fmt(Math.ceil(shown/1000))}`;
  const arc = document.getElementById('arc'); if(arc){ const C = 2*Math.PI*46; arc.style.strokeDashoffset = String(C * (1 - left/totalMs)); }
}
function finishRun(early){
  unlockScreen();
  const r = ui.run; r.early = early;
  r.loaded = [...new Set(r.steps.filter((s,i)=> s.ex && hasLoad(s.ex) && (!early || i < r.i)).map(s=>s.ex))];
  if(SESS[r.code].type==='cool'){ save(); return; }
  ui.screen = 'review'; render(); window.scrollTo(0,0);
}
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2,7);
function save(){
  const r = ui.run, def = SESS[r.code];
  let kind = def.type; if(r.early && kind==='full') kind = 'short';
  const ups = [];
  (r.loaded||[]).forEach(id=>{
    const used = r.loads[id]; let next = used;
    const reps = r.repsBy[id] || [], top = repRange(EX[id])[1];
    const toppedNow = reps.length >= Math.min(2, (EX[id].sets||2)) && reps.every(n=>n>=top);
    S.topRun = S.topRun||{}; S.topRun[id] = toppedNow ? (S.topRun[id]||0) + 1 : 0;
    const topped = S.topRun[id] >= 2; // two sessions in a row at the top of the range
    if(topped && !EX[id].fixed && r.feel!=='toomuch' && r.hip!=='sore'){
      next = stepKg(used, 1); // one notch up her dial
      if(next>used){ ups.push({id,next}); S.topRun[id] = 0; } }
    S.loads[id] = next;
  });
  // ladders: two sessions in a row at the top of the range (or three done, for timed ones) moves her up a rung
  const ladUps = [], okDay = r.feel!=='toomuch' && r.hip!=='sore'; S.ladder = S.ladder || {}; S.ladTop = S.ladTop || {};
  for(const [k, L] of Object.entries(LADDERS)){
    const lv = ladLevel(k), id = L.rungs[lv]; if(lv >= L.rungs.length-1) continue;
    if(!r.steps.some((st,i)=>st.ex===id && i < r.i)) continue;
    const e = EX[id];
    if(e.kind==='reps'){ const reps = r.repsBy[id] || [], top = repRange(e)[1];
      const topped = reps.length >= Math.min(2, e.sets||2) && reps.every(n=>n>=top);
      S.ladTop[k] = topped && okDay ? (S.ladTop[k]||0) + 1 : 0;
      if(S.ladTop[k] >= 2){ S.ladder[k] = lv+1; S.ladTop[k] = 0; ladUps.push({from:id, to:L.rungs[lv+1]}); } }
    else if(okDay){ S.ladTop[k] = (S.ladTop[k]||0) + 1;
      if(S.ladTop[k] >= (L.timed||3)){ S.ladder[k] = lv+1; S.ladTop[k] = 0; ladUps.push({from:id, to:L.rungs[lv+1]}); } }
  }
  const now = new Date(), mk = monthKey(now);
  const wkBefore = weekInfo(now,true), monthBefore = monthCount(mk), stageBefore = stage().index, scBefore = scenesOpen(), ntBefore = openNotes();
  let points = POINTS[kind] + ups.length*5, bonus = false;
  if(TRAINING.has(kind) && wkBefore.count+1 === wkBefore.target){ points += 25; bonus = true; }
  const doc = {id:'s'+uid(), ts:now.getTime(), day:dayKey(now), kind, code:r.code, title:(r.trim?def.title+', short':def.title), location:S.loc,
    minutes:Math.max(1, Math.round((Date.now()-r.started)/60000)), points, partial:!!r.early, trim:!!r.trim,
    story: earnFor(r.code, r.trim, r.early), ...(def.loc==='uk' && kind==='full' && S.block ? {block:S.block.i} : {}), legs: !!def.legs, loads:Object.fromEntries((r.loaded||[]).map(id=>[id, r.loads[id]])), efforts:r.efforts, sets:r.sets, reps:r.repsBy};
  S.lastReps = Object.assign(S.lastReps||{}, r.repsBy);
  if(r.feel) doc.feel = r.feel; if(r.runFeel) doc.runFeel = r.runFeel; if(r.hip) doc.hip = r.hip; if(r.note && r.note.trim()) doc.note = r.note.trim().slice(0,400);
  sessions.push(doc);
  const gateNow = TRAINING.has(kind) && monthBefore < monthTarget(mk) && monthCount(mk) >= monthTarget(mk);
  const stageNow = stage().index > stageBefore;
  let run = null;
  const ranRun = r.steps.some((st,k)=>/^(run|fin)\d$/.test(st.ex||'') && k < r.i);
  // the run comes last, so the one feel rating covers it. Up straight away after easy, or after two about-right runs in a row
  const runFeel = r.feel;
  if(ranRun && runFeel){ const was = runLevel(); let now = was;
    if(runFeel==='toomuch' || r.hip==='sore'){ now = Math.max(1, was-1); S.runTop = 0; }
    else if(runFeel==='easy'){ now = Math.min(RUNS.length, was+1); S.runTop = 0; }
    else if(runFeel==='right'){ S.runTop = (S.runTop||0) + 1; if(S.runTop >= 2){ now = Math.min(RUNS.length, was+1); S.runTop = 0; } }
    else S.runTop = 0;
    S.runLevel = now; doc.runLevel = was; run = {was, now}; }
  ui.last = {run, points, ups, lad:ladUps, bonus, code:r.code, kind, early:!!r.early, gate:gateNow, mk, stageUp:stageNow, newScenes: Array.from({length: scenesOpen()-scBefore}, (_,k)=>scBefore+k), newNote: (openNotes().filter(i=>!ntBefore.includes(i)).pop() ?? -1)};
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
const stateOut = () => ({loc:S.loc, step:S.step, dial:S.dial, runLevel:S.runLevel, voice:S.voice, theme:S.theme, dragon:S.dragon, loads:S.loads, rewards:S.rewards, rewardsUpdated:S.rewardsUpdated,
  redemptions:S.redemptions, prizes:S.prizes, read:S.read, planApplied:S.planApplied, seenStage:S.seenStage||0, ladder:S.ladder||{}, ladTop:S.ladTop||{}, runTop:S.runTop||0, block:S.block||null, blockSeen:S.blockSeen||0, updated:S.updated});
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
    if(remoteNewer) ['loc','step','dial','runLevel','voice','theme','dragon','loads','seenStage','ladder','ladTop','runTop','block','blockSeen'].forEach(k=>{ if(rs[k]!==undefined) S[k] = rs[k]; });
    if((rs.rewardsUpdated||0) > (S.rewardsUpdated||0)){ S.rewards = rs.rewards; S.rewardsUpdated = rs.rewardsUpdated; }
    S.redemptions = mergeById(rs.redemptions, S.redemptions);
    S.prizes = Object.assign({}, rs.prizes||{}, S.prizes);
    S.read = Object.assign({}, rs.read||{}, S.read||{});
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
const smart = s => String(s).replace(/(^|[\s(\[—–])"/g,'$1“').replace(/"/g,'”').replace(/(^|[\s(\[—–])'/g,'$1‘').replace(/'/g,'’');
const esc = s => String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dx = t => esc(t).replace(/([WVY])(?=[a-z\u00e0-\u00ff])/g,'<span class="kw">$1</span>');
const fmtClock = ms => { const t = Math.max(0, Math.floor(ms/1000)), h = Math.floor(t/3600), m = Math.floor(t/60)%60, x = t%60; return (h ? h+':'+pad2(m) : m) + ':' + pad2(x); };
// '8–12 reps' -> [8,12]; '10 each side' -> [10,10]
const repRange = e => { const m = /(\d+)\s*[–-]\s*(\d+)/.exec(e.reps||''); if(m) return [+m[1], +m[2]]; const n = /(\d+)/.exec(e.reps||''); return n ? [+n[1], +n[1]] : [10,10]; };
const DIAL = [2.5, 3.5, 4.5, 5.5, 6.5, 8, 9, 10, 11.5, 13.5, 16, 18, 20.5, 22.5, 24]; // her London dial, read off her photos 13 Oct
const dial = () => (Array.isArray(S.dial) && S.dial.length ? S.dial : DIAL).slice().sort((a,b)=>a-b);
const snapKg = x => dial().reduce((b,v)=>Math.abs(v-x) < Math.abs(b-x) ? v : b);
const stepKg = (x, d) => { const L = dial(), i = L.indexOf(snapKg(x)); return L[Math.max(0, Math.min(L.length-1, i + d))]; };
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
  up:'<svg class="ic" viewBox="0 0 24 24"><path d="M12 19V5M6 11l6-6 6 6"/></svg>',
  pause:'<svg class="ic" viewBox="0 0 24 24"><path d="M8 5.5h2.6v13H8zM13.4 5.5H16v13h-2.6z" fill="currentColor" stroke="none"/></svg>',
  ear:'<svg class="ic" viewBox="0 0 24 24"><path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3.5" y="14" width="4" height="6" rx="1.6"/><rect x="16.5" y="14" width="4" height="6" rx="1.6"/></svg>'
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
  if(ui.screen==='tab' || ui.screen==='preview') ensureBlock();
  document.querySelectorAll('.tab').forEach(t=>t.setAttribute('aria-current', ui.screen==='tab' && t.dataset.tab===ui.tab ? 'page' : 'false'));
  const rt = document.querySelector('.tab[data-tab="realm"]'); if(rt) rt.classList.toggle('unread', unread()>0);
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
  else if(ui.screen==='read') html = readHTML();
  else if(ui.screen==='preview') html = previewHTML();
  document.body.classList.toggle('inrun', ui.screen==='run');
  app.innerHTML = html + (ui.sheet ? sheetHTML() : '');
  startFigure(); paintNP();
  if(ui.screen==='run'){ const r = ui.run; if(r && r.timer) paintTimer(r.steps[r.i], r.timer.paused ? r.timer.remaining : Math.max(0, r.timer.end-Date.now())); }
}

function topbar(){
  return `<header class="top"><span class="brand">Movement</span><div class="r">
    <button class="pill" data-a="loc" aria-label="Location: ${LOCNAME[S.loc]}. Tap to switch.">${I.pin}${LOCNAME[S.loc]}</button>
    <button class="round" data-a="settings" aria-label="Settings">${I.gear}</button></div></header>`;
}

/* ---------- Today ---------- */
function todayHTML(){
  const p = plan_(), now = new Date();
  const date = now.toLocaleDateString('en-GB',{weekday:'long', day:'numeric', month:'long'});
  const items = [{code:'hip', title:'Hip block', meta:estMin('hip')+' min', done:p.hipDone}];
  if(p.main) items.push({code:p.main, title:SESS[p.main].title, meta:estMin(p.main)+' min', done:false});
  else if(p.trained) items.push({title:p.trained.title, meta:'Done', done:true});
  else if(p.walked) items.push({title:p.walked.title, meta:'Done', done:true});
  const next = items.find(x=>!x.done && x.code);
  const mainNext = p.main;
  let head, meta;
  if(!next){ head = 'Done for today'; meta = p.wk.count>=p.wk.target ? 'Week target reached. Rest is part of the plan.' : 'Rest is part of the plan. Back tomorrow.'; }
  else if(!mainNext){ head = 'Stretch, then rest'; meta = 'You’ve trained today. Five minutes of hip work closes it.'; }
  else if(p.recovery){ head = 'Recovery day'; meta = p.hipDone ? 'You trained yesterday. A mobility flow today, then a walk if you fancy it.' : 'You trained yesterday. Hip block first, then a mobility flow.'; }
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
  actions += `<div style="display:flex;gap:18px;flex-wrap:wrap">${mainNext?`<button class="alt" data-a="preview" data-code="${mainNext}">See every exercise</button>`:''}<button class="alt" data-a="choose">Something else</button></div>`;

  const nudge = findNudge(p);
  const wk = p.wk, tk = dayKey(now);
  const bars = wk.days.map((d,i)=>{
    const k = d.list.some(s=>s.kind==='full')?'full':d.list.some(s=>s.kind==='short')?'short':d.list.some(s=>s.kind==='cardio')?'cardio':d.list.some(s=>s.kind==='walk'||s.kind==='mobility')?'walk':d.list.some(s=>s.kind==='hip')?'hip':'';
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
  ${S.block && S.block.i > (S.blockSeen||0) ? (()=>{ const bi = blockInfo(); return `<section class="card newblock"><h2 class="ct">New block <span class="aside">${bi.round>1 ? `round ${bi.round}, ` : ''}${BLOCK_WEEKS} weeks</span></h2><p class="nbt">${dx(bi.def.name)}</p><p style="margin:0 0 12px">${esc(bi.def.blurb)} Your weights carry over, and anything new starts from a related lift. Paris and travel sessions stay the same.</p><button class="btn" data-a="blockseen">Got it</button></section>`; })() : ''}
  <section class="card"><h2 class="ct">This week</h2>
    ${wk.all.length ? `<div class="week">${bars}</div>` : `<div class="slots">${Array.from({length:wk.target},(_,i)=>`<div class="slot">Session ${i+1}</div>`).join('')}</div>`}
    ${wk.all.length?`<div class="legend"><span><i style="background:var(--g4)"></i>Session</span><span><i style="background:var(--g2)"></i>Short or cardio</span><span><i style="background:var(--teal)"></i>Mobility or walk</span><span><i style="background:var(--violet);opacity:.6"></i>Hip block</span></div>`:''}
    <div class="stats">
      <div class="stat"><div class="n c-coral">${wk.count}<span class="muted" style="font-size:18px">/${wk.target}</span></div><div class="k">Sessions</div></div>
      <div class="stat"><div class="n c-amber">${balance().toLocaleString('en-GB')}</div><div class="k">Points to spend</div></div>
      ${weeksOnTarget() ? `<div class="stat"><div class="n c-violet">${weeksOnTarget()}</div><div class="k">${weeksOnTarget()===1?'Week':'Weeks'} on target</div></div>` : `<div class="stat"><div class="n c-violet">${Math.min(monthCount(monthKey(now)), monthTarget(monthKey(now)))}</div><div class="k">Stones this month</div></div>`}
    </div>
  </section>
  <section class="card"><h2 class="ct">Today</h2><div class="items">
    ${items.map(x=>`<div class="it"><span class="tick ${x.done?'on':''}">${x.done?I.check:''}</span><span class="t">${esc(x.title)}</span><span class="m">${x.meta}</span></div>`).join('')}
  </div></section>
  <button class="card teaser" data-tab="realm" aria-label="Open the realm">
    <div><h2 class="ct" style="margin-bottom:8px">Realm</h2><div class="rn">${dx(rg.name)}</div><div class="sub">${cnt} of ${tgt} stones · gate holds ${esc(prizeFor(mk).name.toLowerCase())}</div><div class="sub" style="color:var(--violet);font-weight:650">${unread()?`${unread()} new in The Long Carry`:`Next scene: ${esc((STORY.scenes[scenesOpen()]||{title:'coming soon'}).title)}`}</div></div>
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
    {nm:'Mobility flow', ds:`${SESS[mobilityCode()].title}: ${SESS[mobilityCode()].sub.toLowerCase()}`, code:mobilityCode()},
    {nm:'Hip block', ds:'Your physio’s four stretches', code:'hip'},
    {nm:S.loc==='uk'?'Pad run':'Cardio intervals', ds:SESS[cardioCode()].sub, code:cardioCode()},
    {nm:'Easy walk', ds:SESS[walkCode()].sub, code:walkCode()}
  ];
  return `<div class="enter" style="display:grid;gap:14px">
    <button class="back" data-a="home">${I.back}Today</button>
    <section class="gcard flat"><h1>Pick your own</h1><p class="meta">${({uk:'London kit', paris:'Paris kit', away:'Travel kit: band, chair, stairs, backpack'})[S.loc]}. Choose a style. For strength, choose how long you’ve got: the longer you go, the more of the story you unlock.</p></section>
    <section class="card">${opts.map(o=> o.times ?
      `<div class="opt str" style="cursor:default"><span class="nm">${o.nm}</span><span class="ds">${esc(o.ds)}</span><div class="times">${o.times.map(([m,k])=>`<button class="time" data-a="${k==='trim'?'starttrim':'start'}" data-code="${k==='short'?shortCode():full}" data-trim="${k==='trim'?1:''}">${k==='short'?estMin(shortCode()):k==='trim'?estMin(full,true):estMin(full)} min</button>`).join('')}</div></div>` :
      `<button class="opt" data-a="start" data-code="${o.code}"><span class="nm">${o.nm}</span><span class="ds">${esc(o.ds)}</span><span class="go">${estMin(o.code)} min</span></button>`).join('')}
    </section></div>`;
}

/* ---------- Runner ---------- */
function poseFor(id){ const k = EX_POSE[id]; return k && POSES[k] ? {k, p:POSES[k]} : null; }
function demoBox(id, small){
  const e = EX[id], f = poseFor(id); if(!e || !f) return '';
  const still = e.kind==='hold' || id==='squat_hold';
  return `<div class="demo fig" data-pose="${f.k}"${still?' data-mode="once"':''}>${FIG.svg(f.p.a, Object.assign({label:`${esc(e.name)}, demonstrated`}, f.p))}</div>`;
}
function startFigure(){ const el = document.querySelector('.sheet .demo.fig') || document.querySelector('.demo.fig'); if(!el) return; const p = POSES[el.dataset.pose]; FIG.animate(el, Object.assign({}, p, {mode: el.dataset.mode || p.mode})); }
function ringHTML(s, label, small){
  const C = 2*Math.PI*46;
  return `<div class="ringwrap"><div class="ringbox${small?' sm':''}" id="ring"><svg viewBox="0 0 100 100" aria-hidden="true">
    <defs><linearGradient id="rg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="var(--g1)"/><stop offset=".5" stop-color="var(--g3)"/><stop offset="1" stop-color="var(--g4)"/></linearGradient></defs>
    <circle class="trk" cx="50" cy="50" r="46" fill="none" stroke-width="5"/>
    <circle class="arc" id="arc" cx="50" cy="50" r="46" fill="none" stroke="url(#rg)" stroke-width="5" stroke-linecap="round" stroke-dasharray="${C.toFixed(2)}" stroke-dashoffset="0"/></svg>
    <div class="nm"><div class="big num" id="big">${fmt(s.dur)}</div><div class="lbl" id="rlbl">${esc(label||'')}</div></div></div></div>`;
}
function runHTML(){
  const r = ui.run, s = r.steps[r.i], def = SESS[r.code];
  const pct = (r.i/r.steps.length*100).toFixed(1);
  const bar = `<div class="rbar"><div class="r1"><button class="round" data-a="exit" aria-label="Leave session">${I.x}</button><button class="round" data-a="prev" aria-label="Back to the previous exercise" ${r.i===0?'disabled':''}>${I.back}</button><button class="ttl ttlbtn" data-a="overview" aria-label="See every exercise in this session"><span class="tt">${esc(def.title)}${r.trim?' · shorter':''} <span aria-hidden="true">▾</span></span><span class="clk num" id="clk">${fmtClock(Date.now()-r.started)}</span></button>
    <button class="round" data-a="voice" aria-label="${S.voice?'Turn voice off':'Turn voice on'}" aria-pressed="${S.voice}">${S.voice?I.vol:I.mute}</button></div><div class="prog"><i style="width:${pct}%"></i></div></div>`;
  const watch = r.i===0 && TRAINING.has(def.type) ? `<p class="watchnote">${S.overMusic===false ? 'Cues pause your music. ' : 'Cues play over your music. Take the phone off silent or they’re muted. '}The screen flashes at every change.</p>` : '';
  let body = '', dock = '';
  const loadRow = id => hasLoad(id) ? `<div class="loadrow"><div class="stepper"><button data-a="load" data-d="-1" aria-label="Less weight">${I.minus}</button><span class="v">${fmtKg(r.loads[id])}</span><button data-a="load" data-d="1" aria-label="More weight">${I.plus}</button></div><span class="muted">${esc(EX[id].unit)}</span></div>` : '';
  const guideBtn = id => EX[id].how ? `<button class="linkbtn" data-a="guide" data-id="${id}" style="justify-self:start">How to do it</button>` : '';

  if(s.t==='work'){
    const e = EX[s.ex];
    body = `${demoBox(s.ex)}
      <div><h1 class="exname">${dx(e.name)}</h1><div class="presc">${esc(e.reps)}</div><div class="setof">Set <b class="num">${s.set}</b> of ${s.of}</div></div>
      <div class="loadrow">${hasLoad(s.ex) ? `<div class="stepper"><button data-a="load" data-d="-1" aria-label="Less weight">${I.minus}</button><span class="v">${fmtKg(r.loads[s.ex])}</span><button data-a="load" data-d="1" aria-label="More weight">${I.plus}</button></div>` : ''}
        <div class="stepper reps"><button data-a="reps" data-d="-1" aria-label="One rep fewer">${I.minus}</button><span class="v"><b class="num">${r.repNow}</b><small>reps</small></span><button data-a="reps" data-d="1" aria-label="One rep more">${I.plus}</button></div></div>
      <p class="hint" style="margin:-6px 0 0">${hasLoad(s.ex) ? esc(e.unit.charAt(0).toUpperCase()+e.unit.slice(1))+'. ' : ''}Set the reps you actually did before tapping done.</p>
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
    if(s.t==='iv'){ phase = ivWord(e, s.phase==='on'); label = (s.phase==='on'?e.onLabel:e.offLabel).split(' · ')[1]||''; }
    else if(s.t==='hold'){ phase = `${s.side} side`; label = running ? 'Hold' : 'Get into position'; }
    else { phase = s.label || e.label; label = s.of>1 ? `Set ${s.set} of ${s.of}` : ''; }
    const sub = s.t==='iv' ? `Round ${s.set} of ${s.of}` : s.t==='hold' && s.of>1 ? `Hold ${s.set} of ${s.of}` : '';
    body = `<div><h1 class="exname">${dx(e.name)}</h1></div>
      <div class="phase">${esc(phase)}<small>${esc(sub)}</small></div>
      ${ringHTML(s,label,!!poseFor(s.ex))}
      ${demoBox(s.ex,true)}${loadRow(s.ex)}
      <section class="card" style="display:grid;gap:4px"><p class="cue">${esc(e.cue)}</p>${e.note?`<div class="hipnote">${I.hip}<span>${esc(e.note)}</span></div>`:''}${guideBtn(s.ex)}</section>${watch}`;
    dock = !running ? `<button class="btn primary xl" data-a="tstart">${I.play} Start</button><button class="btn sm" data-a="skip">Skip</button>`
                    : `<button class="btn" data-a="tpause">${paused?'Resume':'Pause'}</button><button class="btn sm" data-a="skip">Skip</button>`;
  }
  const calm = ['hip','mobility','walk','cool'].includes(def.type) || s.t==='hold' || /_cool$/.test(s.ex||'');
  if(calm && !NARR.active && STORY.scenes.length){ const q = storyQueue(runEarn(r), Math.max(240, secsLeft(r.steps, r.i))); if(q.length) body += `<button class="card listen" data-a="storyrun">${I.ear}<span><span class="lt">Listen while you stretch</span><span class="muted">${(()=>{ const real = q.filter(x=>x.t!=='r'); return dx(itemOf(real[0]).title) + (real.length>1 ? ` and ${real.length-1} more` : ''); })()} · the coach goes quiet, beeps still mark each change</span></span></button>`; }
  return bar + `<div class="enter" style="display:grid;gap:14px" data-step="${r.i}">${body}</div><div class="dock"><div class="in">${dock}</div></div>`;
}

/* ---------- Review & celebrate ---------- */
function reviewHTML(){
  const r = ui.run;
  if(!r.feel) r.feel = 'right'; if(!r.hip) r.hip = 'fine'; // a normal day is already filled in: just Save
  const pick = (act, cur, val, label, hint) => `<button class="chip" data-a="${act}" data-v="${val}" aria-pressed="${cur===val}">${label}${hint?`<small>${hint}</small>`:''}</button>`;
  const feel = [['easy','Too easy','could do more'],['right','About right','worked, not wrecked'],['hard','Hard','glad it’s over'],['toomuch','Too much','struggled to finish']];
  const hip = [['fine','Fine'],['niggly','Niggly'],['sore','Sore']];
  const ranRun = r.steps.some((st,k)=>/^(run|fin)\d$/.test(st.ex||'') && k < r.i);
  return `<div class="enter" style="display:grid;gap:14px">
    <section class="gcard flat"><h1>How was it?</h1><p class="meta">${esc(SESS[r.code].title)}${r.early?', ended early':''}. Filled in for a normal day. If nothing was off, just save.</p></section>
    <section class="card"><h2 class="ct">Overall${ranRun ? ' <span class="aside">run included</span>' : ''}</h2><div class="chips two">${feel.map(([v,l,h])=>pick('feel',r.feel,v,l,h)).join('')}</div>
      <h2 class="ct" style="margin-top:18px">Hip today</h2><div class="chips three">${hip.map(([v,l])=>pick('hipfeel',r.hip,v,l)).join('')}</div>
      ${r.noteOpen || r.note ? `<label class="ct" for="snote" style="display:block;margin:18px 0 8px">Note</label>
      <textarea id="snote" rows="2" maxlength="400" placeholder="Knee clicked on lunges, slept badly, loved the pad bit…">${esc(r.note||'')}</textarea>` : `<button class="linkbtn" data-a="noteopen" style="margin-top:14px">Add a note</button>`}</section>
  </div><div class="dock"><div class="in"><button class="btn primary xl" data-a="save">Save session</button></div></div>`;
}
function celebrateHTML(){
  // the end of a session is the reward: points and next time in the hero, Pip's line, and at most one next step
  const L = ui.last || {points:0, ups:[], newScenes:[]}; const p = plan_(); const wk = p.wk;
  const cont = (L.kind==='hip' && p.main) ? p.main : null;
  const st = stage(), trained = TRAINING.has(L.kind);
  const mk = L.mk || monthKey(new Date()); const rg = region(mk);
  const meta = [`${esc(SESS[L.code]?.title||'Session')} logged`];
  if(trained) meta.push(wk.count >= wk.target ? 'week target reached' : `${wk.count} of ${wk.target} this week`, `stone ${Math.min(monthCount(mk),monthTarget(mk))} of ${monthTarget(mk)} in ${esc(rg.name)}`);
  if(L.bonus) meta.push('includes 25 for your week');
  if(L.newNote>=0) meta.push('something new in the satchel');
  const next = [];
  (L.ups||[]).forEach(u=>next.push(`${esc(EX[u.id].name)} <b>${fmtKg(u.next)}</b>`));
  (L.lad||[]).forEach(u=>next.push(`${esc(EX[u.from].name)} becomes <b>${esc(EX[u.to].name.toLowerCase())}</b>`));
  if(L.run && L.run.now !== L.run.was) next.push(`Pad run ${L.run.now > L.run.was ? 'up' : 'down'} to <b>level ${L.run.now}</b>`);
  const said = L.gate ? 'The gate’s open. I’d carry your prize but my arms are tiny.' : L.stageUp ? `New colours. I’m a ${st.name.toLowerCase()} now. Don’t make it weird.` : L.kind==='hip' ? pickLine('hipOnly') : pickLine('done');
  const n = (L.newScenes||[]).length;
  let action = '';
  if(cont) action = `<button class="btn-w" data-a="start" data-code="${cont}"><span>Continue to ${esc(SESS[cont].title)}</span><small>${estMin(cont)} min</small></button>`;
  else if(trained) action = `<button class="btn-w" data-a="start" data-code="${coolCode()}"><span>Cool down with the story</span><small>${estMin(coolCode())} min</small></button>`;
  return `<div class="enter" style="display:grid;gap:14px">
    <section class="gcard celebrate">
      <div class="perch ${L.stageUp||L.gate?'hop':''}">${dragonSVG()}</div>
      <div class="pts"><svg class="sign" viewBox="0 0 10 10" aria-hidden="true"><path d="M5 0v10M0 5h10"/></svg><span class="visually-hidden" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">plus </span>${L.points}</div>
      <p class="meta">${meta.join(' · ').replace(/^./, c=>c.toUpperCase())}.</p>
      ${next.length ? `<div class="gnext"><span class="gk">Next time</span><ul>${next.slice(0,4).map(x=>`<li>${I.up}<span>${x}</span></li>`).join('')}</ul></div>` : ''}
      ${n && !cont && trained ? `<div class="gscenes"><span class="gk">${n>1 ? NUMW[n-1].replace(/^./,c=>c.toUpperCase())+' new scenes' : 'A new scene'}</span><span class="gt">${L.newScenes.map(i=>dx(STORY.scenes[i].title)).join(', ')}</span></div>` : ''}
      ${action ? `<div class="row2" style="margin-top:16px">${action}</div>` : ''}
    </section>
    <div class="say"><q>${dx(said)}</q><span class="by">${esc(S.dragon)}, ${st.name.toLowerCase()}</span></div>
    ${L.gate ? `<section class="card"><h2 class="ct">${esc(rg.gate)}</h2><p style="margin:0 0 12px">You reached the gate of ${esc(rg.name)}. Your prize is waiting: <b>${esc(prizeFor(mk).name)}</b>.</p><button class="btn primary" style="width:100%" data-a="claimgate" data-mk="${mk}">Claim it</button></section>` : ''}
  </div><div class="dock"><div class="in"><button class="btn ${action ? '' : 'primary xl'}" data-a="home">${action ? 'Done for now' : 'Back to today'}</button></div></div>`;
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
    ${storyCardHTML()}
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

/* ---------- Story ---------- */
const KIND = {ledger:'Kesh’s ledger', who:'Who’s who', sketch:'Pell’s sketchbook', map:'Map', letter:'Letter', song:'Songbook', lore:'Lore'};
const kindOf = n => KIND[n.kind||'ledger'] || 'From the satchel';
const noteChapter = i => STORY.chapters.find(c=>c.notes && i>=c.notes[0] && i<=c.notes[1]);
const noteBook = i => { const c = noteChapter(i); return bookOf(c ? c.from : 0); };
function storyCardHTML(){
  const so = scenesOpen(), all = !!ui.storyAll, last = STORY.scenes.length - 1;
  const cur = chapterOf(Math.min(so, last)), book = bookOf(cur.from);
  const finished = so > book.to || (so > last && cur.to >= book.to);
  const row = i => `<button class="strow" data-a="read" data-t="s" data-i="${i}"><span class="sn">${sceneLabel(i)}</span><span class="stw"><span class="stt">${dx(STORY.scenes[i].title)}</span>${S.read['s'+i] && STORY.scenes[i].recap ? `<span class="srec">${esc(smart(STORY.scenes[i].recap))}</span>` : ''}</span>${S.read['s'+i]?'':'<span class="new">New</span>'}</button>`;
  let tail;
  if(so <= last && so <= book.to) tail = `<div class="strow locked"><span class="sn">${sceneLabel(so)}</span><span class="stt">${dx(STORY.scenes[so].title)}</span><span class="muted" style="font-size:13px">Next session</span></div>`;
  else if(finished) tail = `<p class="theend">The end.</p><p class="muted" style="margin:0;font-size:14px;text-align:center">A new story is on its way. Keep training and it starts as soon as it’s written.</p>`;
  else tail = `<p class="muted" style="margin:10px 0 0;font-size:14px">You’re all caught up. Chapter ${NUMW[cur.n] || cur.n+1} is being written.</p>`;
  const chs = STORY.chapters.filter(c=>c.from>=book.from && c.to<=book.to);
  let rows = '', hidden = 0;
  if(all){
    rows = chs.filter(c=>c.from < so).map(c=>`<h3 class="chh">Chapter ${c.n}: ${esc(c.title)}</h3>` + Array.from({length:Math.min(c.to, so-1)-c.from+1},(_,k)=>row(c.from+k)).join('')).join('');
  } else {
    for(let i=cur.from; i<Math.min(so, cur.to+1); i++){ if(i >= so-3 || !S.read['s'+i]) rows += row(i); else hidden++; }
    hidden += chs.filter(c=>c.to < cur.from).reduce((a,c)=>a + c.to - c.from + 1, 0);
  }
  rows += tail;
  const excerpt = t => { const w = smart(t).split(/\s+/); return w.length>7 ? w.slice(0,7).join(' ').replace(/[.,;:—–-]+$/,'') + '…' : w.join(' '); };
  const nOpen = openNotes().filter(i=>{ const c = noteChapter(i); return c && c.from>=book.from && c.to<=book.to; });
  const nShown = all ? nOpen : nOpen.filter((i,k)=>k >= nOpen.length-2 || !S.read['n'+i]);
  hidden += nOpen.length - nShown.length;
  const notes = nShown.map(i=>{ const n = STORY.notes[i], led = (n.kind||'ledger')==='ledger';
    return `<button class="strow note${led?'':' doc'}" data-a="read" data-t="n" data-i="${i}"><span class="nmeta"><span class="nk">${esc(kindOf(n))}</span><span class="stt">${led ? esc(excerpt([].concat(n.text).join(' '))) : dx(n.title)}</span></span>${S.read['n'+i]?'':'<span class="new">New</span>'}</button>`; }).join('');
  const capped = cur.notes && nOpen.filter(i=>noteChapter(i)===cur).length > cur.notes[1]-cur.notes[0];
  return `<section class="card story"><h2 class="ct">${esc(book.title)} <span class="aside">Chapter ${cur.n}: ${esc(cur.title)}</span></h2>
    <p class="muted" style="margin:0 0 6px;font-size:14px">Longer sessions unlock more scenes, and each one you’ve read keeps a short recap here. Hip and mobility days open something from the company’s satchel: ledger pages, who’s who, sketches, maps.</p>
    <div class="slist">${rows}</div>
    ${nOpen.length ? `<h3 class="ct" style="margin:16px 0 4px">${esc(book.notebook)} <span class="aside">${nOpen.length} ${nOpen.length===1?'thing':'things'}</span></h3><div class="slist">${notes}</div>${capped && !finished ? `<p class="muted" style="margin:8px 0 0;font-size:13.5px">That’s everything in the satchel for now. More turns up as the story moves on.</p>` : ''}` : `<p class="muted" style="margin:12px 0 0;font-size:14px">The satchel opens with your next hip or mobility session.</p>`}
    ${hidden>0 || all ? `<button class="linkbtn" data-a="storyall">${all ? 'Show fewer' : `Show everything so far`}</button>` : ''}
  </section>`;
}
function readHTML(){
  const {t, i} = ui.read; const isScene = t==='s';
  const item = isScene ? STORY.scenes[i] : STORY.notes[i];
  S.read[t+i] = 1; saveLocal(); queueSync();
  let prevI = -1, nextI = -1;
  if(isScene){ const b = bookOf(i); if(i>b.from) prevI = i-1; if(i+1 < scenesOpen() && i+1 <= b.to) nextI = i+1; }
  else { const on = openNotes(), k = on.indexOf(i); if(k>0) prevI = on[k-1]; if(k>=0 && k+1<on.length) nextI = on[k+1]; }
  const isEnd = isScene && i === bookOf(i).to;
  const prev = prevI>=0 ? `<button class="btn" data-a="read" data-t="${t}" data-i="${prevI}">Previous</button>` : '';
  const next = nextI>=0 ? `<button class="btn primary" data-a="read" data-t="${t}" data-i="${nextI}">Next</button>`
    : `<button class="btn" data-a="realmtab">${!isScene ? 'Back to the realm' : isEnd ? 'Back to the realm' : i+1 < STORY.scenes.length && i+1 <= bookOf(i).to ? 'More unlocks after your next workout' : 'The next chapter is being written'}</button>`;
  const doc = !isScene && (item.kind||'ledger')!=='ledger';
  const body = [].concat(item.text).map(p=>{ let h = esc(smart(p)); if(doc) h = h.replace(/^([A-Z][A-Za-z’ ]{1,18}):/, '<b>$1:</b>'); return `<p>${h}</p>`; }).join('');
  const c = isScene ? chapterOf(i) : null;
  return `<div class="enter reader" style="display:grid;gap:14px">
    <button class="back" data-a="realmtab">${I.back}Realm</button>
    <article class="page${isScene?'':' ledger'}${!isScene && (item.kind||'ledger')!=='ledger' ? ' doc' : ''}"><h1 class="rt">${dx(item.title)}</h1>
      <p class="rmeta">${isScene ? `${esc(bookOf(i).title)} · Chapter ${c.n} · ${i===c.from && c.n===1 ? 'Prologue' : 'Scene '+sceneLabel(i)}` : esc(kindOf(item))}</p>
      ${(()=>{ const on = NARR.active && NARR.queue[NARR.k] && NARR.queue[NARR.k].t===t && NARR.queue[NARR.k].i===i;
        return `${isScene && i>bookOf(i).from && STORY.scenes[i-1].recap ? `<aside class="prevbox"><b>Previously</b>${esc(smart(STORY.scenes[i-1].recap))}</aside>` : ''}<button class="listenbtn" data-a="${on ? (NARR.playing?'narrpause':'narrplay') : 'listen'}" data-t="${t}" data-i="${i}">${on && NARR.playing ? I.pause+' Pause' : I.ear+(on?' Carry on listening':' Listen')}</button>`; })()}
      <div class="rbody">${body}</div>${isEnd ? `<p class="theend">The end.</p>` : ''}</article>
    <div style="display:flex;gap:10px;flex-wrap:wrap">${prev}${next}</div></div>`;
}

/* ---------- Session preview ---------- */
function blocksFor(code, trim){
  return SESS[code].items.map(it=>{
    const o = typeof it==='string' ? {id:it} : it;
    const ids = o.pair ? o.pair : [o.id];
    const e0 = EX[ids[0]];
    let sets = o.sets || e0.sets || (e0.kind==='hold' ? e0.holds : 1); if(trim) sets = Math.min(2, sets);
    return {ids, pair:!!o.pair, sets, dur:o.dur};
  });
}
function exLine(id, b){
  const e = EX[id];
  if(e.kind==='reps') return `${b.sets} × ${e.reps}${hasLoad(id) ? ' · '+fmtKg(loadOf(id)) : ''}`;
  if(e.kind==='timed') return `${b.sets>1?b.sets+' × ':''}${fmt(b.dur||e.dur)}${(b.dur||e.dur)>=60?' min':' s'} · ${e.label}`;
  if(e.kind==='iv') return `${e.rounds} rounds · ${e.on} s fast, ${e.off} s easy`;
  if(e.kind==='hold') return `${e.holds} × ${e.dur} s each side`;
  return '';
}
function previewHTML(){
  const {code, trim} = ui.preview, def = SESS[code];
  const list = blocksFor(code, trim).map(b=>`<div class="pblock">${b.pair?`<span class="ptag">Pair, ${b.sets} rounds</span>`:''}${b.ids.map(id=>{
      const f = poseFor(id);
      return `<button class="pex" data-a="guide" data-id="${id}" ${EX[id].how?'':'disabled'}><span class="pth">${f?FIG.svg(f.p.a, f.p):''}</span><span><span class="pnm">${esc(EX[id].name)}</span><span class="pln">${esc(exLine(id,b))}</span>${(MUSCLES[id]||[]).length?`<span class="pmu">${(MUSCLES[id]||[]).map(g=>GROUPS.find(x=>x[0]===g)[1]).join(' · ')}</span>`:''}</span></button>`; }).join('')}</div>`).join('');
  return `<div class="enter" style="display:grid;gap:14px">
    <button class="back" data-a="home">${I.back}Today</button>
    <section class="gcard flat"><h1>${dx(def.title)}</h1><p class="meta">${esc(def.sub)} · about ${estMin(code,trim)} min${def.loc==='uk' && def.type==='full' && S.block ? (()=>{ const bi = blockInfo(); return ` · ${esc(bi.def.name)}, week ${bi.week} of ${BLOCK_WEEKS}`; })() : ''}. Tap any exercise to see how it’s done.</p></section>
    <section class="card">${list}</section>
  </div><div class="dock"><div class="in"><button class="btn primary xl" data-a="${trim?'starttrim':'start'}" data-code="${code}">${I.play} Begin</button></div></div>`;
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
    <section class="gcard flat"><h1>${trainingTotal()} sessions</h1><p class="meta">Since you started. ${mins.toLocaleString('en-GB')} minutes moving · ${sessions.filter(s=>s.kind==='hip').length} hip blocks${weeksOnTarget() ? ` · ${weeksOnTarget()} ${weeksOnTarget()===1?'week':'weeks'} on target` : ''}</p></section>
    <section class="card chart"><h2 class="ct">Sessions per week <span class="aside">dashed: target</span></h2>
      <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Training sessions per week, last eight weeks"><defs><linearGradient id="pbar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--g1)"/><stop offset="1" stop-color="var(--g4)"/></linearGradient></defs>
      <line class="gl" x1="20" x2="${W}" y1="${H-22}" y2="${H-22}"/><line class="tgt" x1="20" x2="${W}" y1="${tY.toFixed(1)}" y2="${tY.toFixed(1)}"/>${bars}</svg></section>
    ${musclesHTML()}
    <section class="card"><h2 class="ct">Strength <span class="aside">current weight</span></h2>
      ${lifts.length ? lifts.map(l=>{ const first = l.hist[0], gain = +(l.cur-first).toFixed(1);
        return `<div class="lift"><span class="nm">${esc(EX[l.id].name)}</span>${spark(l.hist.concat(l.cur!==l.hist[l.hist.length-1]?[l.cur]:[]))}<span class="kg">${fmtKg(l.cur)}${gain>0?`<small>+${fmtKg(gain)}</small>`:''}</span></div>`; }).join('')
      : `<p class="empty">Your lifts appear here after your first strength session, with every step up the weights.</p>`}
    </section></div>`;
}

function musclesHTML(){
  const since = Date.now() - 14*864e5, tot = {}; let all = 0;
  sessions.filter(x=>x.ts>=since && x.sets).forEach(x=>Object.entries(x.sets).forEach(([id,n])=>(MUSCLES[id]||[]).forEach(g=>{ tot[g] = (tot[g]||0) + n; all += n; })));
  const max = Math.max(1, ...Object.values(tot));
  const rows = GROUPS.map(([k,label,col])=>`<div class="mrow"><span class="ml">${label}</span><span class="mb"><i style="width:${((tot[k]||0)/max*100).toFixed(0)}%"></i></span><span class="mn num">${tot[k]||0}</span></div>`).join('');
  const top = Object.entries(tot).sort((a,b)=>b[1]-a[1])[0];
  return `<section class="card"><h2 class="ct">Muscles worked <span class="aside">last 2 weeks, sets</span></h2>
    ${all ? `<p style="margin:0 0 12px"><b class="num" style="font-size:26px">${all}</b> <span class="muted">sets · most worked: ${GROUPS.find(g=>g[0]===top[0])[1].toLowerCase()}</span></p>${rows}` : `<p class="empty">Your first session fills this in, set by set.</p>`}</section>`;
}

/* ---------- Settings ---------- */
function settingsHTML(){
  return `<div class="enter" style="display:grid;gap:14px">
    <button class="back" data-a="home">${I.back}Today</button>
    <section class="gcard flat"><h1>Settings</h1><p class="meta">Your data, your coach, your dragon.</p></section>
    <section class="card"><h2 class="ct">Look</h2>
      <div class="srow"><span>Theme</span><div class="seg">${[['system','Phone'],['dark','Night'],['light','Light']].map(([v,l])=>`<button data-a="settheme" data-v="${v}" aria-pressed="${S.theme===v}">${l}</button>`).join('')}</div></div>
      <div class="field"><label for="dname">Dragon’s name</label><input type="text" id="dname" value="${esc(S.dragon)}" maxlength="24"></div>
    </section>

    <section class="card"><h2 class="ct">Coach</h2>
      <div class="srow"><span>Voice cues</span><div class="seg"><button data-a="setvoice" data-v="1" aria-pressed="${S.voice}">On</button><button data-a="setvoice" data-v="0" aria-pressed="${!S.voice}">Off</button></div></div>
      <div class="srow"><span>Cues and music</span><div class="seg"><button data-a="overmusic" data-v="1" aria-pressed="${S.overMusic!==false}">On top</button><button data-a="overmusic" data-v="0" aria-pressed="${S.overMusic===false}">Pause</button></div></div>
      <p class="hint" style="margin-top:-4px">${S.overMusic!==false ? 'Cues play on top of Spotify or SoundCloud. iPhone mutes them in silent mode, so switch silent off when you train. The story still pauses your music.' : 'Cues pause your music and play even in silent mode.'}</p>
      <div class="field"><span class="flabel">Your dumbbell dial</span><div class="dialchips">${dial().map(v=>`<span class="dchip num">${String(v).replace(/\.0$/,'')}</span>`).join('')}<span class="dunit">kg</span></div>
        ${ui.dialEdit ? `<textarea id="dialkg" rows="2" inputmode="decimal" autocomplete="off" spellcheck="false">${esc(dial().join(', '))}</textarea><p class="hint">Every setting on your London dumbbells, separated by commas. Saved when you tap away.</p>` : `<button class="linkbtn" data-a="dialedit">Edit the dial</button>`}
        <p class="hint">The + and − buttons jump between these, and a lift goes up one notch at a time.</p></div>
    </section>
    <section class="card"><h2 class="ct">Story narrator</h2>
      ${typeof AUDIO!=='undefined' ? `<div class="srow"><span>Narration</span><div class="seg"><button data-a="narrmode" data-v="rec" aria-pressed="${S.narrMode!=='voice'}">Recorded</button><button data-a="narrmode" data-v="voice" aria-pressed="${S.narrMode==='voice'}">Phone voice</button></div></div>
      <p class="hint" style="margin-top:-4px">${S.narrMode!=='voice' ? `Recorded: ${esc(AUDIO.voices.s)} reads the story, ${esc(AUDIO.voices.n)} reads the satchel. Keeps playing with the phone locked. Needs internet.` : 'Your phone’s own voice. Works offline, stops if the phone locks.'}</p>` : ''}
      ${S.narrMode==='voice' || typeof AUDIO==='undefined' ? `<div class="field"><label for="narrator">Phone voice</label><select id="narrator">${(()=>{ const vs = storyVoices(), cur = storyVoice(); return vs.length ? vs.map(v=>`<option value="${esc(v.voiceURI)}" ${cur&&cur.voiceURI===v.voiceURI?'selected':''}>${esc(v.name)} · ${esc(v.lang)}</option>`).join('') : '<option>Your phone’s default voice</option>'; })()}</select>
        <p class="hint">Sounds robotic? On iPhone go to Settings, Accessibility, Read &amp; Speak, Voices, English, and download a Premium or Enhanced UK voice. Then pick it here.</p></div>` : ''}
      <div class="srow"><span>Pace</span><div class="seg">${[[.85,'Slower'],[.95,'Normal'],[1.05,'Brisk']].map(([v,l])=>`<button data-a="narrrate" data-v="${v}" aria-pressed="${(S.narrRate||.95)===v}">${l}</button>`).join('')}</div></div>
      <div class="srow"><span>Start by itself in cool-downs</span><div class="seg"><button data-a="storycool" data-v="1" aria-pressed="${S.storyCool!==false}">On</button><button data-a="storycool" data-v="0" aria-pressed="${S.storyCool===false}">Off</button></div></div>
    </section>
    <section class="card"><h2 class="ct">Test the sound</h2>
      <div class="srow"><span>Play a sample</span><div class="seg"><button data-a="testsound" aria-pressed="false">Coach</button><button data-a="narrtest" aria-pressed="false">Story</button></div></div>
      <p class="hint" style="margin-top:8px">If you hear nothing, flip the silent switch off. Every cue also flashes on screen.</p></section>

    <section class="card"><h2 class="ct">Your data on GitHub</h2>
      <form data-form="gh" autocomplete="off">
      <div class="field"><label for="ghowner">GitHub username</label><input type="text" id="ghowner" value="${esc(GH.owner)}" autocapitalize="off" spellcheck="false"></div>
      <div class="field"><label for="ghrepo">Private data repo</label><input type="text" id="ghrepo" value="${esc(GH.repo)}" autocapitalize="off" spellcheck="false"></div>
      <div class="field"><label for="ghtoken">Access token</label><input type="password" id="ghtoken" value="${esc(GH.token)}" placeholder="github_pat_…" autocapitalize="off" spellcheck="false">
        <p class="hint">Fine-grained token, only this repo, Contents set to read and write. It stays on this phone.</p></div>
      <div class="field"><button class="btn primary" type="submit" style="width:100%">${GH.token?'Save and sync':'Connect'}</button></div></form>
      ${syncLineHTML()}
    </section>
    <section class="card"><h2 class="ct">How points work</h2>
      <ul class="steps" style="padding-left:18px;margin:0">
        <li>Full session 30, cardio 20, short or mobility 15, hip block or walk 10, cool-down 5.</li>
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
      ${ui.run && ui.run.timer ? `<div class="sheetclock num" id="sheetclock" aria-live="off"></div>` : ''}${demoBox(ui.sheet.id)}<h3 style="margin-top:14px">${esc(e.name)}</h3>${(()=>{ const k = ladderOf(ui.sheet.id); if(!k) return ''; const L = LADDERS[k], v = L.rungs.indexOf(ui.sheet.id);
        return `<p class="muted" style="margin:4px 0 0;font-size:14px">Step ${v+1} of ${L.rungs.length} on the ${esc(L.name.toLowerCase())} ladder${v < L.rungs.length-1 ? `. Next: ${esc(EX[L.rungs[v+1]].name.toLowerCase())}` : '. The top step'}.</p>`; })()}${sec('Set up', h.setup)}${sec('Do it', h.go)}${sec('Form tips', h.tips)}
      ${(()=>{ const k = ladderOf(ui.sheet.id), v = k ? LADDERS[k].rungs.indexOf(ui.sheet.id) : -1; return k && v > 0 && v === ladLevel(k) ? `<button class="btn" data-a="ladback" data-k="${k}" style="margin-top:16px">Too much for now? Back to ${esc(EX[LADDERS[k].rungs[v-1]].name.toLowerCase())}</button>` : ''; })()}
      <button class="btn primary" data-a="close" style="margin-top:10px">Got it</button></div></div>`;
  }
  if(ui.sheet==='overview' && ui.run){
    const r = ui.run, cur = r.steps[r.i] && r.steps[r.i].ex, seen = [];
    r.steps.forEach((st,i)=>{ if(st.ex && !seen.find(x=>x.id===st.ex)) seen.push({id:st.ex, first:i}); });
    return `<div class="scrim" data-a="close"><div class="sheet" role="dialog" aria-modal="true" aria-label="Today’s exercises">${r.timer ? `<div class="sheetclock num" id="sheetclock" aria-live="off"></div>` : ''}<h3>${esc(SESS[r.code].title)}</h3>
      ${seen.map(x=>{ const done = r.steps.slice(x.first).every((st,j)=>st.ex!==x.id || x.first+j < r.i); const now = x.id===cur;
        return `<div class="ovr ${now?'now':''}"><span class="tick ${done&&!now?'on':''}">${done&&!now?I.check:''}</span><span>${esc(EX[x.id].name)}</span><span class="muted" style="font-size:13px">${now?'Now':''}</span></div>`; }).join('')}
      <button class="btn primary" data-a="close" style="margin-top:14px">Back to it</button></div></div>`;
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
    case 'preview': ui.preview = {code:b.dataset.code, trim:false}; ui.screen = 'preview'; render(); window.scrollTo(0,0); break;
    case 'read': ui.read = {t:b.dataset.t, i:+b.dataset.i}; ui.sheet = null; ui.screen = 'read'; render(); window.scrollTo(0,0); break;
    case 'listen': { const t = b.dataset.t, i = +b.dataset.i, pr = t==='s' && i>bookOf(i).from && STORY.scenes[i-1].recap; narrStart(pr ? [{t:'r', i:i-1}, {t, i}] : [{t, i}]); render(); break; }
    case 'storyrun': { const r2 = ui.run; narrStart(r2 ? storyQueue(runEarn(r2), Math.max(240, secsLeft(r2.steps, r2.i))) : storyQueue(0)); render(); break; }
    case 'narrpause': narrPause(); if(ui.screen==='read') render(); break;
    case 'narrplay': narrResume(); if(ui.screen==='read') render(); break;
    case 'narrstop': narrStop(); break;
    case 'overmusic': S.overMusic = b.dataset.v==='1'; touch(); setAudioMode(); render(); break;
    case 'narrmode': S.narrMode = b.dataset.v; touch(); if(NARR.active) narrStop(); render(); break;
    case 'narrrate': S.narrRate = +b.dataset.v; touch(); try{ aud.playbackRate = recRate(); }catch(e){} render(); break;
    case 'storycool': S.storyCool = b.dataset.v==='1'; touch(); render(); break;
    case 'narrtest': { if(recFor({t:'s',i:0}) && !NARR.active){ aud.src = AUDIO.items.s0.src; aud.playbackRate = recRate(); aud.play(); setTimeout(()=>{ if(!NARR.active) aud.pause(); }, 12000); break; } audioOn(); try{ speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance('They walked. They carried. By noon Kesh\u2019s arms burned and her back had opinions, and she found she did not mind.'); const v = storyVoice(); if(v){ u.voice = v; u.lang = v.lang; } u.rate = S.narrRate || .95; speechSynthesis.speak(u); }catch(e){} break; }
    case 'storyall': ui.storyAll = !ui.storyAll; render(); break;
    case 'realmtab': ui.screen = 'tab'; ui.tab = 'realm'; render(); window.scrollTo(0,0); break;
    case 'overview': ui.sheet = 'overview'; render(); break;
    case 'trainanyway': ui.trainAnyway = true; render(); break;
    case 'loc': S.loc = ({uk:'paris', paris:'away', away:'uk'})[S.loc] || 'uk'; ui.trainAnyway = false; touch(); render(); toast(({uk:'Back in London. Full kit.', paris:'Paris mode. Light kit, slow tempo.', away:'Travel mode. Band, chair, stairs. Two sessions a week keeps your streak.'})[S.loc]); break;
    case 'settings': ui.screen = 'settings'; render(); window.scrollTo(0,0); break;
    case 'home': ui.screen = 'tab'; ui.tab = 'today'; ui.last = null; ui.sheet = null; render(); window.scrollTo(0,0); break;
    case 'done': audioOn(); advance(); break;
    case 'tstart': { audioOn(); const s = r.steps[r.i]; startTimer(s.dur+(s.lead||0)); if(s.t==='hold') say('Get into position.'); render(); break; }
    case 'tpause': { const t = r.timer; if(t.paused){ t.end = Date.now()+t.remaining; t.paused = false; } else { t.remaining = Math.max(0,t.end-Date.now()); t.paused = true; } render(); break; }
    case 'skip': advance(); break;
    case 'plus15': if(r.timer){ r.timer.end += 15000; r.timer.total += 15; } break;
    case 'reps': { r.repNow = Math.max(0, Math.min(60, r.repNow + (+b.dataset.d))); render(); break; }
    case 'prev': goBack(); break;
    case 'load': { const s = r.steps[r.i]; r.loads[s.ex] = EX[s.ex].fixed ? Math.min(3, Math.max(2, r.loads[s.ex] + (+b.dataset.d))) : stepKg(r.loads[s.ex], +b.dataset.d); render(); break; }
    case 'voice': S.voice = !S.voice; touch(); if(S.voice){ audioOn(); say('Voice on.'); } else { try{ speechSynthesis.cancel(); }catch(_){} } render(); break;
    case 'guide': ui.sheet = {type:'guide', id:b.dataset.id}; render(); break;
    case 'feel': r.feel = b.dataset.v; render(); break;
    case 'hipfeel': r.hip = b.dataset.v; render(); break;
    case 'noteopen': r.noteOpen = true; render(); setTimeout(()=>{ const t = document.getElementById('snote'); if(t) t.focus(); }, 30); break;
    case 'save': save(); break;
    case 'exit': ui.sheet = 'exit'; render(); break;
    case 'keep': case 'close': ui.sheet = null; render(); break;
    case 'dialedit': ui.dialEdit = true; render(); setTimeout(()=>{ const t = document.getElementById('dialkg'); if(t) t.focus(); }, 30); break;
    case 'ladback': { const k = b.dataset.k, L = LADDERS[k], v = ladLevel(k); if(v > 0){ const was = L.rungs[v], now = L.rungs[v-1];
      S.ladder[k] = v-1; S.ladTop[k] = 0; if(ui.run) ui.run.steps.forEach((st,i)=>{ if(i >= ui.run.i && st.ex===was) st.ex = now; }); touch(); } ui.sheet = null; render(); break; }
    case 'blockseen': S.blockSeen = (S.block && S.block.i) || 0; touch(); render(); break;
    case 'endlog': ui.sheet = null; finishRun(true); break;
    case 'discard': ui.sheet = null; if(NARR.active) narrStop(); unlockScreen(); ui.run = null; ui.screen = 'tab'; ui.tab = 'today'; render(); break;
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
document.addEventListener('input', e=>{ if(e.target.id==='snote' && ui.run) ui.run.note = e.target.value; });
document.addEventListener('change', e=>{
  if(e.target.id==='dialkg'){ const L = [...new Set(e.target.value.split(/[,;\s]+/).map(x=>parseFloat(x.replace(',','.'))).filter(x=>x>0 && x<60))].sort((a,b)=>a-b); if(L.length>=2){ S.dial = L; touch(); toast('Dial saved: '+L.join(', ')+' kg'); } else toast('Add at least two weights, separated by commas.'); }
  if(e.target.id==='narrator'){ S.narrator = e.target.value; touch(); }
  if(e.target.id==='dname'){ S.dragon = e.target.value.trim() || 'Pip'; touch(); }
});

function applyTheme(){ const r = document.documentElement; if(S.theme==='dark'||S.theme==='light') r.setAttribute('data-theme', S.theme); else r.removeAttribute('data-theme'); }

/* ================= Boot ================= */
function boot(){
  loadLocal(); applyPlan(); applyTheme();
  if(!S.slowV1){ S.slowV1 = 1; if(S.step===2){ S.step = 1; touch(); } } // she chose slower progression (13 Oct)
  try{ if(window.speechSynthesis) speechSynthesis.onvoiceschanged = ()=>{ voiceGB = null; }; }catch(e){}
  render();
  if(ghReady()) sync(); else setSync('off');
  if('serviceWorker' in navigator && location.protocol==='https:'){
    // pick up new versions by itself: check whenever the app comes back to the screen,
    // and reload once the new version has taken over (never in the middle of a session or the story)
    const had = !!navigator.serviceWorker.controller; let pending = false;
    const apply = () => { if(ui.screen==='run' || ui.screen==='review' || NARR.active){ pending = true; return; } location.reload(); };
    navigator.serviceWorker.addEventListener('controllerchange', ()=>{ if(had) apply(); });
    navigator.serviceWorker.register('sw.js').then(reg=>{
      document.addEventListener('visibilitychange', ()=>{ if(document.visibilityState==='visible') reg.update().catch(()=>{}); });
      setInterval(()=>{ if(pending) apply(); }, 5000);
    }).catch(()=>{});
  }
}
boot();
