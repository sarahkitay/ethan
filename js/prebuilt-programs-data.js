(function () {
function ex(name, sr, rir, cues) { return { exercise: name, setsReps: sr, rir, cues }; }
const PREBUILT_PROGRAMS_DATA = [
    {
        id: 'pb-fb3',
        kind: 'template',
        name: 'FULL BODY (3× / WK)',
        badge: 'PROGRAM TEMPLATE',
        meta: 'Full Body, Rest, Full Body, Rest, Full Body, Rest, Rest — every calendar week. Tempo, sets, rep ranges, cues, substitutions for gym or home.',
        priceDisplay: '$30',
        priceSuffix: 'EACH',
        checkoutQuery: 'template-fb3',
        purchaseLabel: 'BUY TEMPLATE ($30)',
        importantNotes: [
            'Take at least 48 hours between workouts.',
            'Priority muscle groups go first in the workouts.',
            'Tempo (e.g. 2-1-0-1): 2s eccentric, 1s pause at bottom, explode up, 1s pause at top.',
            'RIR = Reps in Reserve. Double progression: add weight only when you hit the top of the rep range.',
            'Food, sleep, and hydration must be dialed in for best results.'
        ],
        days: [
            {
                title: 'Day 1 (Full Body A)',
                exercises: [
                    ex('Barbell RDLs (3001 Tempo)', '1–2 × 6–10', '1 RIR both sets', 'Midfoot pressure; snap the bar; tailbone up and back.'),
                    ex('Neutral Grip Machine Press (3100 Tempo)', '2 × 6–10', '1 RIR / 0 RIR', 'Shoulders down; drive biceps together.'),
                    ex('Unilateral Leg Press (3000 Tempo)', '1 × 6–10', '1 RIR', 'Feet low; pull into seat; drive through big toe.'),
                    ex('Neutral Grip Chest Supported Rows (3000 Tempo)', '2–3 × 6–10', '0–1 / 0 RIR', 'Index-finger pressure; chest tall.'),
                    ex('Leg Extensions (2000 Tempo)', '2 × 8–12', '0 RIR', 'Stack ankles–knees–hips; toes up.'),
                    ex('Single Arm Cable Lateral Raises (3000 Tempo)', '2 × 8–12', '0 RIR', 'Lead with elbow.'),
                    ex('EZ Bar Tricep Extensions (3000 Tempo)', '2 × 8–12', '0 RIR', 'Upper arms by sides.'),
                    ex('Seated DB Curls Supinated (3000 Tempo)', '2 × 8–12', '1 / 0 RIR', 'Palms up; curl through pinkies.'),
                    ex('Machine Abductors (3100 Tempo)', '1 × 6–10', '0 RIR', 'Knees out.')
                ]
            },
            {
                title: 'Day 2 (Full Body B)',
                exercises: [
                    ex('Smith Machine Squats (3001 Tempo)', '1 × 6–10', '1 RIR', 'Chest up; knees over toes; drive through big toe.'),
                    ex('Machine Overhead Press (3000 Tempo)', '2 × 6–10', '1 RIR / 0 RIR', 'Pelvis stacked; thumb/index pressure.'),
                    ex('Machine B-Stance Hip Thrusts (3000 Tempo)', '1 × 6–10', '0 RIR', 'Working foot flat; drive through hips.'),
                    ex('Wide Grip Lat Pulldowns (3000 Tempo)', '2 × 6–10', '0–1 / 0 RIR', 'Pressure through pinkies; elbows to hips.'),
                    ex('Seated Leg Curls (3100 Tempo)', '2 × 8–12', '0 RIR', 'Heels to glutes.'),
                    ex('Pec Deck Flies (3000 Tempo)', '2 × 8–12', '0 RIR', 'Even elbow flexion throughout.'),
                    ex('Machine Wide Grip Rows (3100 Tempo)', '2 × 6–10', '1 / 0 RIR', 'Initiate with shoulder blades.'),
                    ex('Flat DB Skullcrushers (3000 Tempo)', '2 × 8–12', '0 RIR', 'Slide hands to dumbbell edges.'),
                    ex('Single Arm DB Hammer Curls (3000 Tempo)', '2 × 8–12', '0 RIR', 'Drive hand toward shoulder.'),
                    ex('Machine Adductors (3000 Tempo)', '1 × 6–10', '0 RIR', 'Knees together.')
                ]
            }
        ]
    },
    {
        id: 'pb-fb2',
        kind: 'template',
        name: 'FULL BODY (2× / WK)',
        badge: 'PROGRAM TEMPLATE',
        meta: 'Two full-body days per week for busy schedules. Same prescription style: tempo, sets, reps, RIR, cues, substitutions.',
        priceDisplay: '$30',
        priceSuffix: 'EACH',
        checkoutQuery: 'template-fb2',
        purchaseLabel: 'BUY TEMPLATE ($30)',
        importantNotes: [
            'Space sessions at least 48–72 hours apart when possible.',
            'Progress loads using double progression within rep ranges.',
            'Prioritize sleep and protein on two-day schedules.'
        ],
        days: [
            {
                title: 'Day 1 (Full Body A)',
                exercises: [
                    ex('Trap Bar or Goblet Squat (3011 Tempo)', '3 × 6–10', '1 RIR last set', 'Ribs down; knees track over toes.'),
                    ex('DB Bench Press (3100 Tempo)', '3 × 8–12', '0–1 RIR', 'Elbows ~45°; full ROM.'),
                    ex('Chest-Supported Row (3000 Tempo)', '3 × 8–12', '1 RIR', 'Pull elbows back; pause at top.'),
                    ex('Walking Lunges (2010 Tempo)', '2 × 10–12 / leg', '1 RIR', 'Torso tall; vertical shin back leg.'),
                    ex('Cable Pallof Press (3010 Tempo)', '3 × 10–12 / side', '—', 'Brace core; resist rotation.'),
                    ex('Plank (RPE-based)', '3 × 30–45s', 'Hard but clean', 'Ribs to hips; breathe behind brace.')
                ]
            },
            {
                title: 'Day 2 (Full Body B)',
                exercises: [
                    ex('Romanian Deadlift (3011 Tempo)', '3 × 6–10', '1 RIR', 'Hips back; bar close; stand tall.'),
                    ex('Incline Machine Press (3100 Tempo)', '3 × 8–12', '0–1 RIR', 'Scap retracted; control eccentric.'),
                    ex('Lat Pulldown (3000 Tempo)', '3 × 8–12', '1 RIR', 'Chest slightly up; elbows down.'),
                    ex('Leg Press (3000 Tempo)', '3 × 10–15', '1 RIR', 'Full foot; no lockout bounce.'),
                    ex('Lateral Raise Machine or DB (3000 Tempo)', '2 × 12–15', '0–1 RIR', 'Stop shy of pain; smooth reps.'),
                    ex('Tricep Rope Pushdown (3000 Tempo)', '2 × 12–15', '0 RIR', 'Elbows fixed; split rope at bottom.')
                ]
            }
        ]
    },
    {
        id: 'pb-ul4',
        kind: 'template',
        name: 'UPPER / LOWER (4× / WK)',
        badge: 'PROGRAM TEMPLATE',
        meta: 'Upper, Lower, Rest, Upper, Lower, Rest, Rest weekly. Balanced volume with clear lower- and upper-body days.',
        priceDisplay: '$30',
        priceSuffix: 'EACH',
        checkoutQuery: 'template-ul4',
        purchaseLabel: 'BUY TEMPLATE ($30)',
        importantNotes: [
            'Upper days: horizontal + vertical push and pull each session.',
            'Lower days: hinge + squat pattern plus single-leg or accessory work.',
            'Adjust machine selections to your gym; substitutions noted in full template.'
        ],
        days: [
            {
                title: 'Day 1 — Upper A',
                exercises: [
                    ex('Barbell or Machine Bench (3100 Tempo)', '3 × 6–10', '1 RIR', 'Leg drive; bar path stable.'),
                    ex('Chest-Supported Row (3000 Tempo)', '3 × 8–12', '1 RIR', 'Retract; squeeze mid-back.'),
                    ex('Standing DB OHP (3000 Tempo)', '3 × 8–12', '1 RIR', 'Glutes on; ribs down.'),
                    ex('Lat Pulldown (3000 Tempo)', '3 × 8–12', '1 RIR', 'Stretch tall; elbows to pockets.'),
                    ex('Lateral Raise (3000 Tempo)', '2 × 12–15', '0–1 RIR', 'Control lowering phase.'),
                    ex('Rope Tricep Extension (3000 Tempo)', '2 × 12–15', '0 RIR', 'Full elbow extension.')
                ]
            },
            {
                title: 'Day 2 — Lower A',
                exercises: [
                    ex('Back Squat or Safety Bar Squat (3010 Tempo)', '3 × 6–10', '1 RIR', 'Depth you own; brace hard.'),
                    ex('Romanian Deadlift (3011 Tempo)', '3 × 8–10', '1 RIR', 'Hamstrings long; neutral spine.'),
                    ex('Split Squat (3010 Tempo)', '2 × 10–12 / leg', '1 RIR', 'Torso tall; knee tracks.'),
                    ex('Lying Leg Curl (3100 Tempo)', '2 × 10–12', '0–1 RIR', 'Hips pinned.'),
                    ex('Standing Calf Raise (2110 Tempo)', '3 × 12–15', '1 RIR', 'Pause bottom and top.'),
                    ex('Dead Bug or Copenhagen (3010 Tempo)', '3 × 8–10 / side', '—', 'Low back flat to floor.')
                ]
            },
            {
                title: 'Day 3 — Upper B',
                exercises: [
                    ex('Incline DB Press (3100 Tempo)', '3 × 8–12', '1 RIR', 'Scaps set; control stretch.'),
                    ex('Single-Arm Cable Row (3000 Tempo)', '3 × 10–12 / arm', '1 RIR', 'Rotate slightly; elbow back.'),
                    ex('Machine Shoulder Press (3000 Tempo)', '3 × 8–12', '1 RIR', 'No excessive arch.'),
                    ex('Straight-Arm Pulldown (3010 Tempo)', '2 × 12–15', '1 RIR', 'Lats initiate; arms straight.'),
                    ex('Rear Delt Fly (3000 Tempo)', '2 × 12–15', '1 RIR', 'Thumb-down or neutral grip.'),
                    ex('Incline DB Curl (3000 Tempo)', '2 × 10–12', '0–1 RIR', 'No swing.')
                ]
            },
            {
                title: 'Day 4 — Lower B',
                exercises: [
                    ex('Leg Press (3000 Tempo)', '3 × 10–15', '1 RIR', 'Feet where you feel quads + glutes.'),
                    ex('Hip Thrust (3011 Tempo)', '3 × 8–12', '1 RIR', 'Chin tucked; squeeze top.'),
                    ex('Leg Extension (2000 Tempo)', '2 × 12–15', '0–1 RIR', 'Smooth reps; no kicking.'),
                    ex('Seated Leg Curl (3100 Tempo)', '2 × 10–12', '0–1 RIR', 'Toes neutral or up.'),
                    ex('Cable Pull-Through (3010 Tempo)', '2 × 12–15', '1 RIR', 'Hinge pattern; stand tall.'),
                    ex('Ab Wheel or Plank Rollout (3010 Tempo)', '3 × 6–10', 'Clean reps', 'Stop before low back dumps.')
                ]
            }
        ]
    },
    {
        id: 'pb-ppl5',
        kind: 'template',
        name: 'UPPER / LOWER + PPL (5× / WK)',
        badge: 'PROGRAM TEMPLATE',
        meta: 'Upper, Lower, Rest, Push, Pull, Legs, Rest (order can be flipped). High-frequency split for consistent gym days.',
        priceDisplay: '$30',
        priceSuffix: 'EACH',
        checkoutQuery: 'template-ppl5',
        purchaseLabel: 'BUY TEMPLATE ($30)',
        importantNotes: [
            'Respect the rest day before repeating heavy patterns.',
            'Push/Pull/Legs use moderate volume per session to allow 5× frequency.',
            'Swap machines for equivalents; full PDF maps substitutions.'
        ],
        days: [
            {
                title: 'Day 1 — Upper (UL block)',
                exercises: [
                    ex('Bench or Machine Press (3100 Tempo)', '3 × 6–10', '1 RIR', 'Stable shoulders; full ROM.'),
                    ex('Row Variation (3000 Tempo)', '3 × 8–12', '1 RIR', 'Control negative.'),
                    ex('Lat Pulldown (3000 Tempo)', '2 × 10–12', '1 RIR', 'Stretch and squeeze.'),
                    ex('Lateral Raise (3000 Tempo)', '2 × 12–15', '1 RIR', 'Smooth tempo.'),
                    ex('Tricep Isolation (3000 Tempo)', '2 × 12–15', '0–1 RIR', 'Elbows fixed.')
                ]
            },
            {
                title: 'Day 2 — Lower (UL block)',
                exercises: [
                    ex('Squat Pattern (3010 Tempo)', '3 × 6–10', '1 RIR', 'Depth and bracing first.'),
                    ex('Hinge Pattern (3011 Tempo)', '3 × 6–10', '1 RIR', 'Hamstrings load; neutral spine.'),
                    ex('Single-Leg Work (3010 Tempo)', '2 × 10–12 / leg', '1 RIR', 'Balance quality and load.'),
                    ex('Leg Curl (3100 Tempo)', '2 × 10–12', '1 RIR', 'Control.'),
                    ex('Calf Work (2110 Tempo)', '3 × 12–15', '1 RIR', 'Full stretch.')
                ]
            },
            {
                title: 'Day 3 — Push (PPL)',
                exercises: [
                    ex('Incline Press (3100 Tempo)', '3 × 8–12', '1 RIR', 'Scaps set.'),
                    ex('Shoulder Press (3000 Tempo)', '3 × 8–12', '1 RIR', 'No excessive lean.'),
                    ex('Cable Fly or Pec Deck (3000 Tempo)', '2 × 12–15', '1 RIR', 'Stretch pecs.'),
                    ex('Lateral Raise (3000 Tempo)', '3 × 12–15', '0–1 RIR', 'Control lowering.'),
                    ex('Tricep Pushdown (3000 Tempo)', '2 × 12–20', '0 RIR', 'Full extension.')
                ]
            },
            {
                title: 'Day 4 — Pull (PPL)',
                exercises: [
                    ex('Pull-Up or Assisted (3000 Tempo)', '3 × AMRAP −1', '1 RIR', 'Full hang to chin over.'),
                    ex('Chest-Supported Row (3000 Tempo)', '3 × 8–12', '1 RIR', 'Pause top.'),
                    ex('Single-Arm Lat Row (3000 Tempo)', '2 × 10–12 / arm', '1 RIR', 'Elbow to hip.'),
                    ex('Rear Delt + Bicep Superset', '2 × 12–15 each', '1 RIR', 'Strict form.'),
                    ex('Face Pull (3011 Tempo)', '2 × 15–20', '—', 'External rotation finish.')
                ]
            },
            {
                title: 'Day 5 — Legs (PPL)',
                exercises: [
                    ex('Hack Squat or Front Squat (3010 Tempo)', '3 × 8–12', '1 RIR', 'Knees track; depth you own.'),
                    ex('Romanian Deadlift (3011 Tempo)', '3 × 8–10', '1 RIR', 'Feel hamstrings.'),
                    ex('Leg Press (3000 Tempo)', '2 × 12–15', '1 RIR', 'Constant tension.'),
                    ex('Leg Extension + Curl', '2 × 12–15 each', '0–1 RIR', 'Smooth reps.'),
                    ex('Farmer Carry or Sled (RPE)', '3 × 40–60m', 'Hard effort', 'Posture tall.')
                ]
            }
        ]
    },
    {
        id: 'pb-bundle-all4',
        kind: 'bundle',
        name: 'ALL 4 PROGRAMS',
        badge: 'PROGRAM BUNDLE',
        meta: 'Full Body 3×, Full Body 2×, Upper/Lower 4×, and Upper/Lower + PPL 5× — every template, one purchase.',
        priceDisplay: '$100',
        priceSuffix: 'BUNDLE',
        checkoutQuery: 'bundle-all4',
        purchaseLabel: 'GET BUNDLE ($100)',
        bundleIncludes: [
            'FULL BODY (3× / WK)',
            'FULL BODY (2× / WK)',
            'UPPER / LOWER (4× / WK)',
            'UPPER / LOWER + PPL (5× / WK)'
        ],
        previewSourceProgramId: 'pb-fb3'
    },
    {
        id: 'pb-coaching-online',
        kind: 'coaching',
        name: 'ONLINE COACHING',
        badge: 'MOST POPULAR',
        meta: 'Not a static PDF — training and nutrition built around you. Weekly check-in, macros, form feedback, 24/7 support.',
        priceDisplay: '$75',
        priceSuffix: '/ WEEK',
        importantNotes: [],
        features: [
            'Personalized training + nutrition',
            'One virtual check-in per week',
            'Meal plans and macro targets',
            'Form video feedback anytime',
            '24/7 messaging support'
        ],
        sampleExercises: [
            'Pattern-specific squat / hinge progressions',
            'Tiered compound work + tailored accessories',
            'Conditioning blocks matched to your goals',
            'Deloads and adjustments based on recovery'
        ]
    },
    {
        id: 'pb-coaching-inperson',
        kind: 'coaching',
        name: 'IN-PERSON TRAINING',
        badge: 'COACHING',
        meta: 'Weekly in-person session plus written program, nutrition guidance, meal plans, macros, and remote support.',
        priceDisplay: '$120',
        priceSuffix: '/ SESSION',
        importantNotes: [],
        features: [
            'One coached session per week',
            'Full program design between sessions',
            'Nutrition guidance, meal plans, macros',
            'Form checks via video when needed',
            'Ongoing accountability'
        ],
        sampleExercises: [
            'Live barbell and machine coaching',
            'Accessory selection for your facility',
            'Warm-up and prep tailored to you',
            'Intensity autoregulation in session'
        ]
    }
];
window.__PREBUILT_PROGRAMS_DATA__ = PREBUILT_PROGRAMS_DATA;
})();
