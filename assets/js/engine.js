/**
 * Quiz Engine for Pools Etc Training Portal
 *
 * Renders, grades, and displays results for all module quizzes.
 *
 * Question types:
 *   'mc'  — Multiple Choice (one correct answer by index)
 *   'tf'  — True/False
 *   'sa'  — Short Answer (keyword matching, NOT gated for pass/fail)
 *
 * Pass threshold: 8 out of the non-SA questions (80%).
 * SA questions always show "Discuss with trainer" regardless of answer.
 */

// ─────────────────────────────────────────────
//  QUIZ DATA
// ─────────────────────────────────────────────

const QUIZ_DATA = {

  // ── MODULE 1: Compliance & Safety ─────────────
  module1: [
    {
      id: 'm1q1',
      type: 'mc',
      question: 'Under CA law (SB 1343), how many hours of sexual harassment prevention training are required for non-supervisory employees?',
      choices: ['30 minutes', '1 hour', '2 hours', '4 hours'],
      correct: 1,
      explanation: 'SB 1343 requires 1 hour for non-supervisory employees, renewed every 2 years.',
    },
    {
      id: 'm1q2',
      type: 'mc',
      question: 'How often must CA employees be retrained on sexual harassment prevention?',
      choices: ['Every year', 'Every 2 years', 'Every 3 years', 'Every 5 years'],
      correct: 1,
      explanation: 'Retraining is required every 2 years under CA law.',
    },
    {
      id: 'm1q3',
      type: 'sa',
      question: 'What are the 3 key words to remember for heat illness prevention?',
      keywords: ['water', 'rest', 'shade'],
      minKeywords: 2,
      explanation: 'Water, Rest, Shade — the three pillars of heat illness prevention.',
    },
    {
      id: 'm1q4',
      type: 'mc',
      question: 'At what body temperature does heat illness become a medical concern?',
      choices: ['98.6°F', '99.0°F', '100.4°F', '102.0°F'],
      correct: 2,
      explanation: 'Body temperature above 100.4°F is the threshold for heat illness concern.',
    },
    {
      id: 'm1q5',
      type: 'mc',
      question: 'How often should you drink water when working in the heat, even if not thirsty?',
      choices: ['Every 5 minutes', 'Every 15 minutes', 'Every 30 minutes', 'Every hour'],
      correct: 1,
      explanation: 'Drink water every 15 minutes regardless of thirst to prevent dehydration.',
    },
    {
      id: 'm1q6',
      type: 'sa',
      question: 'Most work-related heat deaths occur during what period of employment?',
      keywords: ['first', 'few days', 'beginning', 'early'],
      minKeywords: 1,
      explanation: 'Most deaths happen in the first few days — new workers haven\'t acclimatized yet.',
    },
    {
      id: 'm1q7',
      type: 'tf',
      question: 'Heat illness only affects people who are out of shape or in poor health.',
      correct: false,
      explanation: 'Heat illness can affect anyone regardless of age, fitness, or experience.',
    },
    {
      id: 'm1q8',
      type: 'sa',
      question: 'Name two symptoms of heat illness.',
      keywords: ['headache', 'nausea', 'dizziness', 'weakness', 'irritability', 'confusion', 'thirst', 'sweating'],
      minKeywords: 2,
      explanation: 'Symptoms include: headache, nausea, dizziness, weakness, irritability, confusion, thirst, heavy sweating.',
    },
    {
      id: 'm1q9',
      type: 'mc',
      question: 'What clothing is recommended when working in the heat?',
      choices: [
        'Dark, heavy clothing for protection',
        'Light-colored clothing and a hat',
        'Long sleeves only',
        'No specific requirements',
      ],
      correct: 1,
      explanation: 'Light-colored clothing reflects heat; a hat protects from direct sun.',
    },
    {
      id: 'm1q10',
      type: 'sa',
      question: 'The Smith System of driving focuses on what primary goal?',
      keywords: ['accident', 'safe', 'mirror', 'scanning', 'no accident', 'avoid'],
      minKeywords: 1,
      explanation: 'The Smith System focuses on no-accident driving through proper mirror use, scanning, and awareness.',
    },
  ],

  // ── MODULE 2: Pool Fundamentals ───────────────
  module2: [
    {
      id: 'm2q1',
      type: 'mc',
      question: 'What are the three elements of pool care?',
      choices: [
        'Cleaning, Chemicals, Customers',
        'Chemistry, Circulation, Maintenance',
        'Testing, Treating, Timing',
        'Pumping, Filtering, Shocking',
      ],
      correct: 1,
      explanation: 'Chemistry, Circulation, and Maintenance — the three pillars of a healthy pool.',
    },
    {
      id: 'm2q2',
      type: 'mc',
      question: 'What is the ideal pH range for a swimming pool?',
      choices: ['6.8–7.0', '7.2–7.6', '7.8–8.2', '6.5–7.0'],
      correct: 1,
      explanation: 'pH should be between 7.2 and 7.6 — slightly alkaline. Below 7.2 is corrosive; above 7.6 reduces chlorine effectiveness.',
    },
    {
      id: 'm2q3',
      type: 'mc',
      question: 'What is the ideal total alkalinity range for most pools?',
      choices: ['20–40 ppm', '50–70 ppm', '80–120 ppm', '150–200 ppm'],
      correct: 2,
      explanation: 'Total alkalinity should be 80–120 ppm. It acts as a buffer to stabilize pH.',
    },
    {
      id: 'm2q4',
      type: 'mc',
      question: 'Think of pH as the "mood" of the pool. What is the alkalinity described as?',
      choices: ['The fuel', 'The bodyguard', 'The thermostat', 'The backbone'],
      correct: 1,
      explanation: '"pH is mood, alkalinity is the bodyguard" — alkalinity stabilizes pH and prevents it from swinging.',
    },
    {
      id: 'm2q5',
      type: 'mc',
      question: 'What does CYA (cyanuric acid) do in a pool?',
      choices: [
        'Raises pH quickly',
        'Protects chlorine from UV degradation by sunlight',
        'Kills algae directly',
        'Increases calcium hardness',
      ],
      correct: 1,
      explanation: 'CYA (stabilizer) protects free chlorine from being destroyed by sunlight. Without it, chlorine can vanish in 2 hours.',
    },
    {
      id: 'm2q6',
      type: 'mc',
      question: 'What is the ideal calcium hardness range for a plaster pool?',
      choices: ['50–100 ppm', '100–150 ppm', '200–400 ppm', '500–600 ppm'],
      correct: 2,
      explanation: 'Calcium hardness should be 200–400 ppm. Too low causes plaster etching; too high causes scaling.',
    },
    {
      id: 'm2q7',
      type: 'tf',
      question: 'A pool with a pH of 8.2 will have MORE effective chlorine than a pool with a pH of 7.4.',
      correct: false,
      explanation: 'FALSE. At pH 8.2, only about 10% of chlorine is in its active form. At 7.4, approximately 50–60% is active. High pH kills chlorine effectiveness.',
    },
    {
      id: 'm2q8',
      type: 'mc',
      question: 'Which component circulates water through the filter?',
      choices: ['The heater', 'The timeclock', 'The pump', 'The skimmer'],
      correct: 2,
      explanation: 'The pump is the heart of the circulation system — it pulls water through the filter and returns it to the pool.',
    },
    {
      id: 'm2q9',
      type: 'sa',
      question: 'In your own words, why is it important to run the pump every day?',
      keywords: ['circulation', 'filter', 'clean', 'algae', 'distribute', 'chemicals'],
      minKeywords: 1,
      explanation: 'Running the pump circulates and filters the water, distributes chemicals evenly, and prevents dead zones where algae can grow.',
    },
    {
      id: 'm2q10',
      type: 'mc',
      question: 'Low alkalinity (below 80 ppm) is likely to cause which problem?',
      choices: [
        'Scaling on pool walls',
        'pH "bouncing" — rapid swings up and down',
        'Green algae bloom',
        'Cloudy water only',
      ],
      correct: 1,
      explanation: 'Low alkalinity removes the pH buffer, causing pH to swing wildly with any chemical addition. This is called "pH bounce."',
    },
  ],

  // ── MODULE 3: Weekly Service Procedures ───────
  module3: [
    {
      id: 'm3q1',
      type: 'mc',
      question: 'What is the FIRST step when arriving at a service stop?',
      choices: [
        'Start testing the water immediately',
        'Scan the pool and yard for safety issues or damage',
        'Skim the surface of the pool',
        'Check the equipment pad',
      ],
      correct: 1,
      explanation: 'Always scan first — look for obstacles, hazards, or damage before any work begins. Safety is step one.',
    },
    {
      id: 'm3q2',
      type: 'mc',
      question: 'In the correct service order, when should you add chemicals?',
      choices: [
        'Before skimming — so they mix during cleaning',
        'Immediately after testing',
        'After all cleaning steps are complete',
        'At the very beginning of the visit',
      ],
      correct: 2,
      explanation: 'Add chemicals AFTER all mechanical cleaning (skim, brush, vacuum). Adding before cleaning stirs debris and dilutes chemicals unevenly.',
    },
    {
      id: 'm3q3',
      type: 'mc',
      question: 'What is the correct order for steps 3, 4, and 5 of the service visit?',
      choices: [
        'Vacuum → Skim → Brush',
        'Skim → Brush → Vacuum',
        'Brush → Skim → Vacuum',
        'Skim → Vacuum → Brush',
      ],
      correct: 1,
      explanation: 'Skim surface first to remove floating debris, then brush walls to loosen sediment, then vacuum to collect it. Order matters.',
    },
    {
      id: 'm3q4',
      type: 'mc',
      question: 'What type of brush should you use on plaster/gunite pools?',
      choices: [
        'Soft nylon bristles only',
        'Stainless steel wire brush',
        'Combination nylon and stainless steel brush',
        'Any brush will work equally well',
      ],
      correct: 2,
      explanation: 'Plaster pools need a combination nylon/stainless steel brush. Steel-only brushes can be used on plaster; soft nylon only is for vinyl or fiberglass.',
    },
    {
      id: 'm3q5',
      type: 'mc',
      question: 'When vacuuming, what overlap percentage is recommended for each pass?',
      choices: ['5–10%', '25–30%', '50%', '75%'],
      correct: 1,
      explanation: 'Overlap each vacuuming pass by about 25–30% to ensure you don\'t miss any spots. Rushing with zero overlap leaves dirt behind.',
    },
    {
      id: 'm3q6',
      type: 'tf',
      question: 'You should test water chemistry BEFORE beginning any physical cleaning steps.',
      correct: true,
      explanation: 'TRUE. Test water early in the visit so you know what chemicals are needed. You\'ll add them later (after cleaning), but you need to know the readings first.',
    },
    {
      id: 'm3q7',
      type: 'mc',
      question: 'Why should you brush pool walls and steps even when the pool appears clean?',
      choices: [
        'To polish the surface for appearance',
        'To dislodge biofilm and algae before they become visible',
        'To loosen old chemical deposits only',
        'Brushing is optional if the water is clear',
      ],
      correct: 1,
      explanation: 'Algae starts as an invisible biofilm on surfaces before it turns green. Regular brushing prevents it from establishing — prevention is far easier than treatment.',
    },
    {
      id: 'm3q8',
      type: 'sa',
      question: 'Why do you clean the skimmer basket during every service visit?',
      keywords: ['debris', 'flow', 'suction', 'pump', 'clog', 'block', 'restrict'],
      minKeywords: 1,
      explanation: 'A clogged skimmer basket restricts water flow to the pump, reduces filtration efficiency, and can cause the pump to run dry and overheat.',
    },
    {
      id: 'm3q9',
      type: 'mc',
      question: 'What is the correct vacuuming direction for maximum efficiency?',
      choices: [
        'Always circle the pool edge first then move inward',
        'Slow, overlapping straight passes from one end to the other',
        'Quick back-and-forth in a zigzag pattern',
        'Start in the deep end and push debris toward the shallow end',
      ],
      correct: 1,
      explanation: 'Slow, deliberate overlapping passes from end to end — this ensures complete coverage and doesn\'t stir up more sediment than necessary.',
    },
    {
      id: 'm3q10',
      type: 'mc',
      question: 'At what point in the service visit do you check the equipment?',
      choices: [
        'Before any other step — always check equipment first',
        'Only if the customer mentions a problem',
        'After all cleaning and chemical additions are complete',
        'Equipment only needs checking monthly',
      ],
      correct: 2,
      explanation: 'Equipment check is the LAST step of the service visit. By this point you\'ve completed all cleaning and chemical additions and can observe the system running normally.',
    },
  ],

  // ── MODULE 4: Water Chemistry Deep Dive ───────
  module4: [
    {
      id: 'm4q1',
      type: 'mc',
      question: 'What chemical is used to RAISE total alkalinity?',
      choices: ['Muriatic acid', 'Sodium bicarbonate (baking soda)', 'Cyanuric acid', 'Calcium chloride'],
      correct: 1,
      explanation: 'Sodium bicarbonate (baking soda) raises total alkalinity. 1.5 lbs per 10,000 gallons raises alk by approximately 10 ppm.',
    },
    {
      id: 'm4q2',
      type: 'mc',
      question: 'What chemical is used to LOWER pH?',
      choices: ['Sodium bicarbonate', 'Sodium carbonate (soda ash)', 'Muriatic acid', 'Sodium thiosulfate'],
      correct: 2,
      explanation: 'Muriatic acid (hydrochloric acid) lowers pH. Always add acid to water — never water to acid.',
    },
    {
      id: 'm4q3',
      type: 'mc',
      question: 'What is the ideal CYA (stabilizer) range for an outdoor residential pool?',
      choices: ['0–10 ppm', '10–30 ppm', '30–50 ppm', '100–150 ppm'],
      correct: 2,
      explanation: 'CYA should be 30–50 ppm for outdoor pools. Too low and chlorine burns off; too high (over-stabilization) and chlorine becomes ineffective.',
    },
    {
      id: 'm4q4',
      type: 'mc',
      question: 'A pool has CYA at 150 ppm. What is the BEST solution?',
      choices: [
        'Add more chlorine to compensate',
        'Add muriatic acid to neutralize the CYA',
        'Partially drain and refill the pool with fresh water',
        'Run the pump for 24 hours',
      ],
      correct: 2,
      explanation: 'There is no chemical that removes CYA. The only solution is to dilute it by draining some water and refilling with fresh water.',
    },
    {
      id: 'm4q5',
      type: 'tf',
      question: 'It is safe to pour granular chlorine (shock) directly into the skimmer basket.',
      correct: false,
      explanation: 'FALSE. Never pour shock directly into the skimmer — it can concentrate in the pipes and equipment causing damage or a dangerous reaction. Always pre-dissolve in a bucket first.',
    },
    {
      id: 'm4q6',
      type: 'mc',
      question: 'Phosphates in pool water are a problem primarily because they:',
      choices: [
        'Directly kill chlorine',
        'Serve as the primary food source for algae',
        'Raise pH rapidly',
        'Cause scaling on pool surfaces',
      ],
      correct: 1,
      explanation: 'Phosphates are algae food. High phosphate levels (above 200 ppb) fuel algae growth. Remove with a phosphate remover chemical.',
    },
    {
      id: 'm4q7',
      type: 'mc',
      question: 'When adding shock to a bucket before adding to the pool, what order is correct?',
      choices: [
        'Add the shock to an empty bucket, then add water',
        'Add water to the bucket FIRST, then slowly add the shock',
        'Mix shock and acid together first',
        'The order does not matter',
      ],
      correct: 1,
      explanation: 'ALWAYS add the chemical to water — never add water to a chemical. This prevents dangerous splashback and heat reactions.',
    },
    {
      id: 'm4q8',
      type: 'mc',
      question: 'Calcium hardness below 200 ppm in a plaster pool is most likely to cause:',
      choices: [
        'Scale buildup on walls',
        'Etching and pitting of the plaster surface',
        'Cloudy water',
        'Algae growth',
      ],
      correct: 1,
      explanation: 'Soft water (low calcium) is aggressive — it pulls calcium FROM the plaster to reach equilibrium, causing etching, pitting, and rough surfaces.',
    },
    {
      id: 'm4q9',
      type: 'sa',
      question: 'Describe the "big red rule" about shock that every technician must know.',
      keywords: ['pre-dissolve', 'bucket', 'never', 'direct', 'skimmer', 'dilute'],
      minKeywords: 1,
      explanation: 'NEVER add shock directly to the pool or skimmer. Always pre-dissolve granular shock in a bucket of water first, then distribute the dissolved solution around the pool perimeter.',
    },
    {
      id: 'm4q10',
      type: 'mc',
      question: 'Which two chemicals must NEVER be mixed together or added to the pool at the same time?',
      choices: [
        'Baking soda and calcium chloride',
        'Shock (chlorine) and muriatic acid',
        'Algaecide and clarifier',
        'CYA and baking soda',
      ],
      correct: 1,
      explanation: 'Shock and muriatic acid create a toxic chlorine gas when combined. Never mix them, never add them near each other, and always wait 30 minutes between adding either to the pool.',
    },
  ],

  // ── MODULE 5: Equipment & Filtration ──────────
  module5: [
    {
      id: 'm5q1',
      type: 'mc',
      question: 'A sand filter that normally runs at 12 PSI now reads 22 PSI. What should you do?',
      choices: [
        'Nothing — this is normal variation',
        'Add more chemicals to balance the water',
        'Backwash the filter',
        'Replace the filter immediately',
      ],
      correct: 2,
      explanation: 'A pressure increase of 8–10+ PSI above the clean baseline means the filter media is clogged. Backwash to clean it.',
    },
    {
      id: 'm5q2',
      type: 'mc',
      question: 'How do you clean a CARTRIDGE filter?',
      choices: [
        'Backwash it the same as a sand filter',
        'Remove the cartridge and rinse with a garden hose — no backwash',
        'Run the pump on recirculate for 30 minutes',
        'Add filter cleaner chemical while running',
      ],
      correct: 1,
      explanation: 'Cartridge filters cannot be backwashed. Remove the cartridge, rinse it with a garden hose from top to bottom between the pleats, soak in filter cleaner if needed.',
    },
    {
      id: 'm5q3',
      type: 'mc',
      question: 'What is the purpose of the pump strainer basket?',
      choices: [
        'To hold the pump motor in place',
        'To catch large debris before it reaches the pump impeller',
        'To measure water flow rate',
        'To filter fine particles from the water',
      ],
      correct: 1,
      explanation: 'The strainer basket catches leaves, debris, and large particles before they reach the pump impeller. A clogged basket starves the pump of water.',
    },
    {
      id: 'm5q4',
      type: 'mc',
      question: 'What is the typical recommended pump runtime in summer (hot weather)?',
      choices: ['4–6 hours per day', '6–8 hours per day', '8–12 hours per day', '24 hours per day always'],
      correct: 2,
      explanation: 'Run the pump 8–12 hours per day in hot weather to ensure full water turnover and adequate filtration. In cooler months, 6–8 hours may suffice.',
    },
    {
      id: 'm5q5',
      type: 'mc',
      question: 'Which filter type provides the finest filtration?',
      choices: [
        'Sand filter (~20 microns)',
        'Cartridge filter (~10 microns)',
        'D.E. (diatomaceous earth) filter (~2 microns)',
        'All filter types filter identically',
      ],
      correct: 2,
      explanation: 'D.E. filters provide the finest filtration at about 2 microns — they can filter out particles invisible to the naked eye. Sand filters: ~20 microns; cartridge: ~10 microns.',
    },
    {
      id: 'm5q6',
      type: 'tf',
      question: 'After backwashing a D.E. filter, you must add fresh diatomaceous earth through the skimmer.',
      correct: true,
      explanation: 'TRUE. Backwashing flushes out the D.E. coating from the internal grids. You must re-coat them by adding fresh D.E. through the skimmer after backwashing.',
    },
    {
      id: 'm5q7',
      type: 'mc',
      question: 'A pool pump is making a loud screeching or grinding noise. This most likely indicates:',
      choices: [
        'The pump is working correctly under high load',
        'The impeller is clogged or bearings are failing',
        'The filter needs backwashing',
        'The chemical levels are off',
      ],
      correct: 1,
      explanation: 'Screeching or grinding usually means debris is caught in the impeller, or the motor bearings are worn. Report this to the customer and document it.',
    },
    {
      id: 'm5q8',
      type: 'sa',
      question: 'Name three components you would find on a typical residential pool equipment pad.',
      keywords: ['pump', 'filter', 'heater', 'timer', 'timeclock', 'gauge', 'valve', 'strainer', 'backwash'],
      minKeywords: 2,
      explanation: 'A typical equipment pad includes: pump, strainer basket, filter, pressure gauge, backwash valve (sand/DE), heater, and timeclock/timer.',
    },
    {
      id: 'm5q9',
      type: 'mc',
      question: 'The multiport valve on a sand filter has several positions. Which position is used for normal operation?',
      choices: ['Backwash', 'Rinse', 'Filter', 'Waste'],
      correct: 2,
      explanation: 'The "Filter" position routes water through the sand media and back to the pool. All normal operation uses this position.',
    },
    {
      id: 'm5q10',
      type: 'mc',
      question: 'After backwashing a sand filter, what position should you run briefly BEFORE returning to "Filter"?',
      choices: ['Waste', 'Recirculate', 'Rinse', 'Closed'],
      correct: 2,
      explanation: 'Always run "Rinse" for 15–30 seconds after backwashing. This re-settles the sand and prevents cloudy water from returning to the pool.',
    },
  ],

  // ── MODULE 6: Customer Service ─────────────────
  module6: [
    {
      id: 'm6q1',
      type: 'mc',
      question: 'What does SEC stand for in the Pools Etc customer service model?',
      choices: [
        'Service, Efficiency, Commitment',
        'Smile, Eye Contact, Comment',
        'Safety, Equipment, Chemicals',
        'Schedule, Execute, Close',
      ],
      correct: 1,
      explanation: 'SEC: Smile, Eye Contact, Comment — the three elements of every customer greeting. Do all three within 30 seconds of seeing the customer.',
    },
    {
      id: 'm6q2',
      type: 'mc',
      question: 'According to the Pools Etc model, you have approximately how long to make a first impression?',
      choices: ['3 seconds', '7 seconds', '30 seconds', '2 minutes'],
      correct: 1,
      explanation: 'Studies show people form a first impression in about 7 seconds. Your posture, smile, and greeting in those first moments set the entire relationship.',
    },
    {
      id: 'm6q3',
      type: 'mc',
      question: 'A customer says "The pool looked green last week — I\'m not happy." What is the BEST first response?',
      choices: [
        '"That\'s not possible, we were just here."',
        '"Let me look at our records."',
        '"I understand — thank you for letting me know. I\'m going to check everything today."',
        '"It was probably just the lighting."',
      ],
      correct: 2,
      explanation: 'Acknowledge first, then investigate. Customers want to feel heard. Defensiveness damages trust instantly. Listen → Acknowledge → Understand → Act.',
    },
    {
      id: 'm6q4',
      type: 'mc',
      question: 'What is the difference between a "satisfied customer" and a "raving fan"?',
      choices: [
        'A raving fan pays more; a satisfied customer pays the standard rate',
        'A satisfied customer simply doesn\'t cancel; a raving fan refers new clients and defends your business',
        'There is no real difference — both are happy',
        'Raving fans only exist for luxury service companies',
      ],
      correct: 1,
      explanation: 'A satisfied customer stays quiet. A raving fan actively promotes your business, refers friends and family, and defends you when something goes wrong. The goal is to create raving fans.',
    },
    {
      id: 'm6q5',
      type: 'mc',
      question: 'You notice the pool heater is making an unusual noise, but the customer didn\'t mention it. You should:',
      choices: [
        'Ignore it — the customer didn\'t say anything',
        'Fix it yourself without mentioning it',
        'Proactively tell the customer what you noticed and that you\'ll note it in the report',
        'Wait until next week to see if it gets worse',
      ],
      correct: 2,
      explanation: 'Proactive service — noticing problems the customer hasn\'t mentioned yet — is one of the most powerful ways to build trust and loyalty. Document it, communicate it.',
    },
    {
      id: 'm6q6',
      type: 'tf',
      question: 'When a customer complains, the best first step is to explain what went wrong and defend your work.',
      correct: false,
      explanation: 'FALSE. Lead with listening and acknowledgment, not explanation or defense. Customers need to feel heard before they\'re ready to hear your explanation.',
    },
    {
      id: 'm6q7',
      type: 'sa',
      question: 'What are the three things customers most want from their pool service technician?',
      keywords: ['reliable', 'trust', 'communicate', 'show up', 'professional', 'consistent', 'honest', 'responsive'],
      minKeywords: 1,
      explanation: 'Customers want: (1) reliability — show up as promised; (2) trust — be honest and transparent; (3) communication — keep them informed proactively.',
    },
    {
      id: 'm6q8',
      type: 'mc',
      question: 'A customer is upset and raising their voice. What is the correct approach?',
      choices: [
        'Match their energy and be firm',
        'Apologize repeatedly and offer discounts immediately',
        'Stay calm, speak slowly and softly, acknowledge their frustration',
        'Cut them off and explain the technical details',
      ],
      correct: 2,
      explanation: 'De-escalate by staying calm and lowering your own voice and pace. Acknowledgment ("I hear you, let me help") defuses most situations faster than any argument or apology.',
    },
    {
      id: 'm6q9',
      type: 'mc',
      question: 'Why is a clean, professional appearance important for a pool technician?',
      choices: [
        'Only for commercial clients — residential customers don\'t care',
        'It makes the work go faster',
        'You represent the company; appearance signals professionalism and builds trust',
        'Appearance doesn\'t matter as long as the pool is clean',
      ],
      correct: 2,
      explanation: 'You are often at customers\' homes when they\'re not there. A professional uniform and clean vehicle signal trustworthiness. Customers let strangers into their property — appearance matters enormously.',
    },
    {
      id: 'm6q10',
      type: 'mc',
      question: 'What should you do at the end of every service visit before leaving the property?',
      choices: [
        'Nothing extra — just leave',
        'Take a photo of the clean pool and add a visit note to the service record',
        'Knock on the door and give a full verbal report every time',
        'Leave a handwritten note on the door',
      ],
      correct: 1,
      explanation: 'Document every visit: photo of the clean pool, chemical readings recorded, any issues noted. This protects you, keeps the customer informed, and creates accountability.',
    },
  ],

  // ── FINAL ASSESSMENT: 25 Questions ────────────
  final: [
    // 5 from Module 1 — Safety & Compliance
    {
      id: 'fq1',
      type: 'mc',
      question: 'Under CA SB 1343, how often must non-supervisory employees receive harassment prevention training?',
      choices: ['Every year', 'Every 2 years', 'Every 3 years', 'Once at hiring only'],
      correct: 1,
      explanation: 'Every 2 years under CA law.',
    },
    {
      id: 'fq2',
      type: 'mc',
      question: 'What are the three elements of heat illness prevention?',
      choices: [
        'Water, Rest, Shade',
        'Sunscreen, Hydration, Breaks',
        'Cooling, Shade, Medication',
        'Rest, Electrolytes, Ice',
      ],
      correct: 0,
      explanation: 'Water, Rest, Shade — the official Cal/OSHA heat illness prevention mnemonic.',
    },
    {
      id: 'fq3',
      type: 'tf',
      question: 'The Smith System of defensive driving is designed to help drivers avoid accidents through proactive scanning.',
      correct: true,
      explanation: 'TRUE. The Smith System focuses on proactive mirror use, scanning ahead, and maintaining awareness to avoid accidents.',
    },
    {
      id: 'fq4',
      type: 'mc',
      question: 'At what body temperature does heat illness become a medical emergency?',
      choices: ['98.6°F', '99.5°F', '100.4°F', '103.0°F'],
      correct: 2,
      explanation: '100.4°F is the threshold — above this indicates heat illness requiring immediate attention.',
    },
    {
      id: 'fq5',
      type: 'mc',
      question: 'How often should you drink water when working in the heat?',
      choices: ['Every 5 minutes', 'Every 15 minutes', 'Every 30 minutes', 'Only when thirsty'],
      correct: 1,
      explanation: 'Every 15 minutes — don\'t wait until you\'re thirsty, as thirst is already a sign of early dehydration.',
    },
    // 5 from Module 2 — Pool Fundamentals
    {
      id: 'fq6',
      type: 'mc',
      question: 'What is the ideal pH range for a swimming pool?',
      choices: ['6.8–7.0', '7.2–7.6', '7.8–8.2', '8.0–8.5'],
      correct: 1,
      explanation: '7.2–7.6 is the ideal pH range.',
    },
    {
      id: 'fq7',
      type: 'mc',
      question: 'What are the three elements of pool care?',
      choices: [
        'Cleaning, Chemicals, Customer Service',
        'Chemistry, Circulation, Maintenance',
        'Testing, Treating, Timing',
        'Filtration, Flow, Formulae',
      ],
      correct: 1,
      explanation: 'Chemistry, Circulation, and Maintenance.',
    },
    {
      id: 'fq8',
      type: 'mc',
      question: 'What does CYA protect in pool water?',
      choices: [
        'Calcium hardness from dissolving',
        'Chlorine from UV degradation by sunlight',
        'pH from swinging',
        'Alkalinity from dropping',
      ],
      correct: 1,
      explanation: 'CYA (stabilizer) shields chlorine molecules from being destroyed by UV sunlight.',
    },
    {
      id: 'fq9',
      type: 'tf',
      question: 'High pH (above 7.8) makes chlorine MORE effective at killing bacteria.',
      correct: false,
      explanation: 'FALSE. Higher pH drastically reduces chlorine\'s effectiveness. At pH 8.0, only ~20% of chlorine is in its active form.',
    },
    {
      id: 'fq10',
      type: 'mc',
      question: 'Ideal total alkalinity for most pools is:',
      choices: ['20–50 ppm', '80–120 ppm', '150–200 ppm', '200–400 ppm'],
      correct: 1,
      explanation: '80–120 ppm is the target alkalinity range. It buffers pH from swinging.',
    },
    // 5 from Module 3 — Service Procedures
    {
      id: 'fq11',
      type: 'mc',
      question: 'What is the CORRECT order of the first four steps of a service visit?',
      choices: [
        'Test → Skim → Brush → Scan',
        'Scan → Test → Skim → Brush',
        'Skim → Scan → Brush → Test',
        'Test → Scan → Vacuum → Brush',
      ],
      correct: 1,
      explanation: 'Step 1: Scan, Step 2: Test water, Step 3: Skim surface, Step 4: Brush walls.',
    },
    {
      id: 'fq12',
      type: 'mc',
      question: 'When do you add chemicals during the service visit?',
      choices: [
        'First thing, before cleaning',
        'After testing but before any cleaning',
        'After ALL cleaning steps are complete',
        'Chemicals are added randomly — timing doesn\'t matter',
      ],
      correct: 2,
      explanation: 'Always add chemicals AFTER all physical cleaning is done.',
    },
    {
      id: 'fq13',
      type: 'tf',
      question: 'Brushing pool walls is only necessary when visible algae is present.',
      correct: false,
      explanation: 'FALSE. Brush every visit to prevent biofilm and algae from establishing — prevention is far easier than treatment.',
    },
    {
      id: 'fq14',
      type: 'mc',
      question: 'Why is it important to check equipment as the last step of the service visit?',
      choices: [
        'Equipment check is unimportant',
        'You need to observe the system running after chemicals have been added',
        'Equipment should actually be checked first',
        'It\'s just a formality with no practical benefit',
      ],
      correct: 1,
      explanation: 'Checking equipment last lets you observe everything running after chemicals are added and cleaning is done — you see the full system in its end state.',
    },
    {
      id: 'fq15',
      type: 'mc',
      question: 'The correct overlap for vacuum passes is approximately:',
      choices: ['0% — no overlap needed', '10%', '25–30%', '60%'],
      correct: 2,
      explanation: '25–30% overlap ensures complete coverage without missing patches of debris.',
    },
    // 5 from Module 4 — Water Chemistry
    {
      id: 'fq16',
      type: 'mc',
      question: 'What chemical raises total alkalinity?',
      choices: ['Muriatic acid', 'Soda ash', 'Sodium bicarbonate (baking soda)', 'Cyanuric acid'],
      correct: 2,
      explanation: 'Sodium bicarbonate (baking soda) raises alkalinity. 1.5 lbs per 10k gallons raises it ~10 ppm.',
    },
    {
      id: 'fq17',
      type: 'mc',
      question: 'The ONLY way to reduce over-stabilization (high CYA) is to:',
      choices: [
        'Add muriatic acid',
        'Shock the pool with a double dose',
        'Partially drain and refill',
        'Run the pump for 24 hours',
      ],
      correct: 2,
      explanation: 'CYA cannot be removed chemically. Dilution by draining and refilling is the only solution.',
    },
    {
      id: 'fq18',
      type: 'tf',
      question: 'Shock should always be pre-dissolved in a bucket of water before adding it to the pool.',
      correct: true,
      explanation: 'TRUE. Always pre-dissolve granular shock. Never add it directly to the pool, skimmer, or near other chemicals.',
    },
    {
      id: 'fq19',
      type: 'mc',
      question: 'Which chemical combination creates a toxic gas if mixed?',
      choices: [
        'Algaecide + clarifier',
        'Shock (chlorine) + muriatic acid',
        'Baking soda + calcium chloride',
        'CYA + salt',
      ],
      correct: 1,
      explanation: 'Shock + muriatic acid creates chlorine gas. These two must never be added near each other or mixed.',
    },
    {
      id: 'fq20',
      type: 'mc',
      question: 'Phosphates in pool water primarily cause problems because they:',
      choices: [
        'Raise pH',
        'Corrode metal equipment',
        'Fuel algae growth',
        'Destroy chlorine molecules',
      ],
      correct: 2,
      explanation: 'Phosphates are algae\'s primary food source. Remove with phosphate remover when levels exceed ~200 ppb.',
    },
    // 5 from Modules 5 & 6 — Equipment & Customer Service
    {
      id: 'fq21',
      type: 'mc',
      question: 'A filter pressure reading 10 PSI above the clean baseline means you should:',
      choices: [
        'Add more chemicals',
        'Backwash or clean the filter',
        'Replace the pump',
        'Adjust the timeclock',
      ],
      correct: 1,
      explanation: 'A rise of 8–10+ PSI above normal operating pressure indicates a clogged filter that needs backwashing or cleaning.',
    },
    {
      id: 'fq22',
      type: 'mc',
      question: 'Which filter type must NOT be backwashed?',
      choices: ['Sand filter', 'D.E. filter', 'Cartridge filter', 'All filters can be backwashed'],
      correct: 2,
      explanation: 'Cartridge filters must not be backwashed. Remove and rinse with a garden hose.',
    },
    {
      id: 'fq23',
      type: 'mc',
      question: 'SEC stands for:',
      choices: [
        'Safety, Equipment, Chemicals',
        'Smile, Eye Contact, Comment',
        'Service, Efficiency, Commitment',
        'Schedule, Execute, Close',
      ],
      correct: 1,
      explanation: 'Smile, Eye Contact, Comment — the three elements of every great customer greeting.',
    },
    {
      id: 'fq24',
      type: 'mc',
      question: 'When a customer complains, what is the FIRST thing you should do?',
      choices: [
        'Explain what happened and defend your work',
        'Offer a discount immediately',
        'Listen fully and acknowledge their frustration before responding',
        'Ask them to submit the complaint in writing',
      ],
      correct: 2,
      explanation: 'Listen first, acknowledge second, then explain and solve. Customers need to feel heard before they can hear your response.',
    },
    {
      id: 'fq25',
      type: 'mc',
      question: 'A "raving fan" customer is best described as someone who:',
      choices: [
        'Never complains about anything',
        'Actively refers new clients and defends your business to others',
        'Only pays their bill on time',
        'Has been a customer for over 5 years',
      ],
      correct: 1,
      explanation: 'Raving fans don\'t just stay — they become advocates. They refer friends, leave reviews, and defend you. The goal of every interaction is to create raving fans.',
    },
  ],
};

// ─────────────────────────────────────────────
//  QUIZ ENGINE
// ─────────────────────────────────────────────

const QuizEngine = (function () {

  // Track current state per module
  const _state = {};

  /**
   * render(moduleId, containerId)
   * Renders all questions for a module into the given container.
   */
  function render(moduleId, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn('[QuizEngine] Container not found:', containerId);
      return;
    }

    const questions = QUIZ_DATA[moduleId];
    if (!questions || questions.length === 0) {
      container.innerHTML = '<p class="text-muted">Quiz questions for this module are coming soon.</p>';
      return;
    }

    // Initialize state
    _state[moduleId] = {
      answers: {},
      submitted: false,
    };

    // Update progress bar
    const totalGraded = questions.filter(function (q) { return q.type !== 'sa'; }).length;

    const html = [
      '<div class="quiz-header">',
      '  <h3>Module Quiz</h3>',
      '  <span class="quiz-header-meta">' + questions.length + ' questions</span>',
      '</div>',
      '<div class="quiz-progress-bar" id="' + containerId + '-progress">',
      '  <div class="quiz-progress-bar__fill" id="' + containerId + '-progress-fill" style="width: 0%"></div>',
      '</div>',
      '<div class="quiz-body" id="' + containerId + '-body">',
      _renderQuestions(questions, moduleId),
      '  <div class="quiz-actions">',
      '    <button class="btn btn-primary quiz-submit-btn" onclick="QuizEngine.grade(\'' + moduleId + '\', \'' + containerId + '\')" id="' + containerId + '-submit">',
      '      Submit Quiz',
      '    </button>',
      '  </div>',
      '</div>',
    ].join('\n');

    container.innerHTML = html;
    _attachListeners(moduleId, containerId);
  }

  /**
   * grade(moduleId, containerId)
   * Scores the current attempt and triggers result display.
   */
  function grade(moduleId, containerId) {
    const questions  = QUIZ_DATA[moduleId];
    const state      = _state[moduleId];
    if (!questions || !state) return;

    state.submitted = true;

    let scoredCorrect = 0;
    let scoredTotal   = 0;
    const results = [];

    questions.forEach(function (q) {
      const userAnswer = state.answers[q.id];
      let isCorrect    = false;
      let isSA         = (q.type === 'sa');
      let saMatched    = false;

      if (q.type === 'mc') {
        isCorrect = (parseInt(userAnswer) === q.correct);
        scoredTotal++;
        if (isCorrect) scoredCorrect++;
      } else if (q.type === 'tf') {
        const userBool = (userAnswer === 'true');
        isCorrect = (userBool === q.correct);
        scoredTotal++;
        if (isCorrect) scoredCorrect++;
      } else if (q.type === 'sa') {
        // Keyword check — SA does NOT count toward pass/fail
        const response = (userAnswer || '').toLowerCase();
        const min      = q.minKeywords || 1;
        const matched  = (q.keywords || []).filter(function (kw) {
          return response.includes(kw.toLowerCase());
        }).length;
        saMatched = (matched >= min);
      }

      results.push({
        id:         q.id,
        question:   q.question,
        type:       q.type,
        isCorrect:  isCorrect,
        isSA:       isSA,
        saMatched:  saMatched,
        userAnswer: userAnswer,
        correct:    q.correct,
        explanation: q.explanation,
        choices:    q.choices || null,
      });
    });

    const passed   = (scoredTotal > 0) ? (scoredCorrect / scoredTotal >= 0.8) : false;
    const gradeResult = {
      score:   scoredCorrect,
      total:   scoredTotal,
      passed:  passed,
      results: results,
    };

    // Mark correct/incorrect visually on question elements
    _highlightAnswers(results, moduleId, containerId);

    // Save to progress if passed
    if (passed && typeof Progress !== 'undefined') {
      Progress.markModuleComplete(moduleId, scoredCorrect);
    }

    // Show results panel
    showResults(containerId, gradeResult);

    return gradeResult;
  }

  /**
   * showResults(containerId, gradeResult)
   * Renders the result summary panel below the quiz body.
   */
  function showResults(containerId, gradeResult) {
    // Remove existing results panel if present
    const existing = document.getElementById(containerId + '-results');
    if (existing) existing.remove();

    // Hide submit button
    const submitBtn = document.getElementById(containerId + '-submit');
    if (submitBtn) submitBtn.style.display = 'none';

    const passed     = gradeResult.passed;
    const score      = gradeResult.score;
    const total      = gradeResult.total;
    const pct        = total > 0 ? Math.round((score / total) * 100) : 0;
    const circleClass = passed ? 'passed' : 'failed';
    const verdictMsg  = passed
      ? 'You passed! You\'re ready to continue to the next module.'
      : 'Not quite — review the topics below and retry when you\'re ready. You need 8/' + total + ' to pass.';

    const verdictTitle = passed ? '✅ Quiz Passed!' : '❌ Not Passed Yet';

    // Build per-question result items
    const itemsHtml = gradeResult.results.map(function (r) {
      if (r.isSA) {
        const icon    = r.saMatched ? '💬' : '💬';
        const labelClass = 'trainer-review';
        return [
          '<div class="quiz-result-item ' + labelClass + '">',
          '  <span class="quiz-result-item__icon">' + icon + '</span>',
          '  <div class="quiz-result-item__content">',
          '    <div class="quiz-result-item__q">' + _escHtml(r.question) + '</div>',
          '    <div class="quiz-result-item__answer">Your answer: ' + _escHtml(r.userAnswer || '(no answer)') + '</div>',
          '    <div class="quiz-result-item__explanation">💡 Discuss with your trainer · ' + _escHtml(r.explanation) + '</div>',
          '  </div>',
          '</div>',
        ].join('\n');
      }

      const icon       = r.isCorrect ? '✅' : '❌';
      const itemClass  = r.isCorrect ? 'correct' : 'incorrect';
      let correctLabel = '';

      if (!r.isCorrect && r.choices && r.correct !== undefined) {
        correctLabel = '<div class="quiz-result-item__answer">Correct answer: <strong>' + _escHtml(r.choices[r.correct]) + '</strong></div>';
      } else if (!r.isCorrect && r.type === 'tf') {
        correctLabel = '<div class="quiz-result-item__answer">Correct answer: <strong>' + (r.correct ? 'TRUE' : 'FALSE') + '</strong></div>';
      }

      return [
        '<div class="quiz-result-item ' + itemClass + '">',
        '  <span class="quiz-result-item__icon">' + icon + '</span>',
        '  <div class="quiz-result-item__content">',
        '    <div class="quiz-result-item__q">' + _escHtml(r.question) + '</div>',
        correctLabel,
        '    <div class="quiz-result-item__explanation">' + _escHtml(r.explanation) + '</div>',
        '  </div>',
        '</div>',
      ].join('\n');
    }).join('\n');

    const nextModuleId = _getNextModuleId(containerId);
    const nextBtn = (passed && nextModuleId)
      ? '<a href="' + nextModuleId + '" class="btn btn-primary">Continue to Next Module →</a>'
      : '';

    const retryBtn = !passed
      ? '<button class="btn btn-secondary quiz-retry-btn" onclick="QuizEngine.retry(\'' + _currentModule + '\', \'' + containerId + '\')">Retry Quiz</button>'
      : '';

    const resultsHtml = [
      '<div class="quiz-results" id="' + containerId + '-results">',
      '  <div class="quiz-results__summary">',
      '    <div class="quiz-score-circle ' + circleClass + '">',
      '      <span class="quiz-score-circle__number">' + score + '/' + total + '</span>',
      '      <span class="quiz-score-circle__label">' + pct + '%</span>',
      '    </div>',
      '    <div class="quiz-results__verdict ' + circleClass + '">',
      '      <h3>' + verdictTitle + '</h3>',
      '      <p>' + verdictMsg + '</p>',
      '    </div>',
      '  </div>',
      '  <div class="quiz-results__items">',
      itemsHtml,
      '  </div>',
      '  <div class="quiz-results__actions">',
      retryBtn,
      nextBtn,
      '  </div>',
      '</div>',
    ].join('\n');

    // Append results after the quiz body
    const quizContainer = document.getElementById(containerId);
    if (quizContainer) {
      quizContainer.insertAdjacentHTML('beforeend', resultsHtml);
      // Scroll to results
      setTimeout(function () {
        const resultsEl = document.getElementById(containerId + '-results');
        if (resultsEl) resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    }
  }

  /**
   * retry(moduleId, containerId)
   * Resets and re-renders the quiz.
   */
  function retry(moduleId, containerId) {
    _currentModule = moduleId;
    render(moduleId, containerId);
  }

  // ─────────────────────────────────────────────
  //  PRIVATE HELPERS
  // ─────────────────────────────────────────────

  let _currentModule = null;

  function _renderQuestions(questions, moduleId) {
    _currentModule = moduleId;
    return questions.map(function (q, idx) {
      return _renderQuestion(q, idx + 1, moduleId);
    }).join('\n');
  }

  function _renderQuestion(q, num, moduleId) {
    const typeLabel = { mc: 'Multiple Choice', tf: 'True / False', sa: 'Short Answer' }[q.type] || q.type;
    const typeClass = 'quiz-question__type--' + q.type;

    let inputHtml = '';

    if (q.type === 'mc') {
      const choices = q.choices.map(function (choice, i) {
        return [
          '<div class="quiz-choice" data-qid="' + q.id + '" data-val="' + i + '" role="radio" tabindex="0"',
          '  aria-checked="false" onclick="QuizEngine._selectMC(this)" onkeydown="if(event.key===\'Enter\'||event.key===\' \')QuizEngine._selectMC(this)">',
          '  <span class="quiz-choice__indicator"></span>',
          '  <span class="quiz-choice__text">' + _escHtml(choice) + '</span>',
          '</div>',
        ].join(' ');
      }).join('\n');
      inputHtml = '<div class="quiz-choices" role="radiogroup">' + choices + '</div>';

    } else if (q.type === 'tf') {
      inputHtml = [
        '<div class="quiz-tf-buttons">',
        '  <button class="quiz-tf-btn" data-qid="' + q.id + '" data-val="true"  onclick="QuizEngine._selectTF(this)">TRUE</button>',
        '  <button class="quiz-tf-btn" data-qid="' + q.id + '" data-val="false" onclick="QuizEngine._selectTF(this)">FALSE</button>',
        '</div>',
      ].join('\n');

    } else if (q.type === 'sa') {
      inputHtml = [
        '<textarea',
        '  class="sa-answer"',
        '  data-qid="' + q.id + '"',
        '  placeholder="Type your answer here..."',
        '  rows="3"',
        '  oninput="QuizEngine._recordSA(this)"',
        '  aria-label="Answer for question ' + num + '"',
        '></textarea>',
        '<p class="sa-note">📝 Short-answer questions are reviewed with your trainer — they don\'t affect your score.</p>',
      ].join('\n');
    }

    return [
      '<div class="quiz-question" id="q-' + q.id + '">',
      '  <div class="quiz-question__num">',
      '    Question ' + num,
      '    <span class="quiz-question__type ' + typeClass + '">' + typeLabel + '</span>',
      '  </div>',
      '  <div class="quiz-question__text">' + _escHtml(q.question) + '</div>',
      inputHtml,
      '  <div class="quiz-explanation" id="exp-' + q.id + '"></div>',
      '</div>',
    ].join('\n');
  }

  function _attachListeners(moduleId, containerId) {
    // Update progress bar when any answer changes
    const container = document.getElementById(containerId + '-body');
    if (!container) return;

    container.addEventListener('click', function () {
      _updateProgressBar(moduleId, containerId);
    });
    container.addEventListener('input', function () {
      _updateProgressBar(moduleId, containerId);
    });
  }

  function _updateProgressBar(moduleId, containerId) {
    const questions = QUIZ_DATA[moduleId];
    const state     = _state[moduleId];
    if (!questions || !state) return;

    const answered = Object.keys(state.answers).filter(function (k) {
      return state.answers[k] !== undefined && state.answers[k] !== '';
    }).length;

    const fill = document.getElementById(containerId + '-progress-fill');
    if (fill) {
      fill.style.width = Math.round((answered / questions.length) * 100) + '%';
    }
  }

  function _highlightAnswers(results, moduleId, containerId) {
    results.forEach(function (r) {
      const qEl = document.getElementById('q-' + r.id);
      if (!qEl) return;

      const expEl = document.getElementById('exp-' + r.id);

      if (r.isSA) {
        if (expEl) {
          expEl.textContent = '💬 Discuss with trainer: ' + r.explanation;
          expEl.classList.add('visible');
        }
        return;
      }

      if (r.type === 'mc') {
        const choices = qEl.querySelectorAll('.quiz-choice');
        choices.forEach(function (choiceEl) {
          const val = parseInt(choiceEl.dataset.val);
          choiceEl.style.pointerEvents = 'none';
          if (val === r.correct) choiceEl.classList.add('was-correct');
          if (choiceEl.classList.contains('selected')) {
            choiceEl.classList.remove('selected');
            choiceEl.classList.add(r.isCorrect ? 'correct' : 'incorrect');
          }
        });
      } else if (r.type === 'tf') {
        const btns = qEl.querySelectorAll('.quiz-tf-btn');
        btns.forEach(function (btn) {
          const val = (btn.dataset.val === 'true');
          btn.disabled = true;
          if (val === r.correct) btn.classList.add('was-correct');
          if (btn.classList.contains('selected')) {
            btn.classList.remove('selected');
            btn.classList.add(r.isCorrect ? 'correct' : 'incorrect');
          }
        });
      }

      if (expEl) {
        expEl.textContent = r.explanation;
        expEl.classList.add('visible');
      }
    });
  }

  function _getNextModuleId(containerId) {
    // Try to infer next module URL from current page URL
    const path = window.location.pathname;
    const match = path.match(/module-(\d+)/);
    if (!match) return null;
    const num = parseInt(match[1]);
    if (num >= 6) return 'final-quiz.html'; // or null if no final quiz yet
    return 'module-' + (num + 1) + '.html';
  }

  function _escHtml(str) {
    if (str === undefined || str === null) return '';
    return String(str)
      .replace(/&/g,  '&amp;')
      .replace(/</g,  '&lt;')
      .replace(/>/g,  '&gt;')
      .replace(/"/g,  '&quot;')
      .replace(/'/g,  '&#39;');
  }

  // ─────────────────────────────────────────────
  //  INTERACTION HANDLERS (called from inline HTML)
  // ─────────────────────────────────────────────

  function _selectMC(el) {
    const qid = el.dataset.qid;
    const val = el.dataset.val;
    if (!qid || !_currentModule) return;

    // Deselect siblings
    const siblings = document.querySelectorAll('[data-qid="' + qid + '"]');
    siblings.forEach(function (s) {
      s.classList.remove('selected');
      s.setAttribute('aria-checked', 'false');
    });

    el.classList.add('selected');
    el.setAttribute('aria-checked', 'true');

    if (!_state[_currentModule]) return;
    _state[_currentModule].answers[qid] = val;
  }

  function _selectTF(btn) {
    const qid = btn.dataset.qid;
    const val = btn.dataset.val;
    if (!qid || !_currentModule) return;

    const siblings = document.querySelectorAll('[data-qid="' + qid + '"]');
    siblings.forEach(function (s) { s.classList.remove('selected'); });
    btn.classList.add('selected');

    if (!_state[_currentModule]) return;
    _state[_currentModule].answers[qid] = val;
  }

  function _recordSA(textarea) {
    const qid = textarea.dataset.qid;
    if (!qid || !_currentModule) return;
    if (!_state[_currentModule]) return;
    _state[_currentModule].answers[qid] = textarea.value;
  }

  // ─────────────────────────────────────────────
  //  EXPOSE PUBLIC API
  // ─────────────────────────────────────────────
  return {
    render:      render,
    grade:       grade,
    showResults: showResults,
    retry:       retry,
    // Expose interaction handlers so inline HTML can reach them
    _selectMC:   _selectMC,
    _selectTF:   _selectTF,
    _recordSA:   _recordSA,
  };
})();
