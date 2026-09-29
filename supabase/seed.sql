-- ==============================================================================
-- BorrowBuddy Seed Data — UPDATE 2: Indian Rupee (₹), Indian Campuses & 50+ Items
-- ==============================================================================

-- 1. Insert 10 Indian Student Profiles
INSERT INTO public.profiles (
  id, name, initials, avatar_color, course, university_email, verified_email,
  trust_score, on_time_returns, avg_condition, completed_borrows, completed_lends, member_since
) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Aarav Sharma', 'AS', '#4338CA', 'B.Tech CSE, Year 3', 'aarav.sharma@iitd.ac.in', true, 92, 18, 4.9, 18, 24, '2024-08-15T10:00:00Z'),
  ('00000000-0000-0000-0000-000000000002', 'Ananya Iyer', 'AI', '#0D9488', 'B.Sc Chemistry, Year 2', 'ananya.iyer@bits-pilani.ac.in', true, 94, 12, 5.0, 12, 15, '2024-07-20T12:00:00Z'),
  ('00000000-0000-0000-0000-000000000003', 'Rohan Mehta', 'RM', '#FF6B4A', 'B.Tech ECE, Year 4', 'rohan.mehta@nitk.edu.in', true, 88, 19, 4.8, 20, 10, '2024-09-01T09:00:00Z'),
  ('00000000-0000-0000-0000-000000000004', 'Priya Nair', 'PN', '#E11D48', 'MBBS 1st Year', 'priya.nair@aiims.edu', true, 90, 15, 4.9, 15, 14, '2024-08-25T14:00:00Z'),
  ('00000000-0000-0000-0000-000000000005', 'Karthik Reddy', 'KR', '#2563EB', 'B.Tech CSE, Year 2', 'karthik.reddy@iiit.ac.in', true, 85, 7, 4.7, 8, 9, '2024-10-10T08:00:00Z'),
  ('00000000-0000-0000-0000-000000000006', 'Sneha Kulkarni', 'SK', '#7C3AED', 'Architecture, Year 3', 'sneha.kulkarni@spa.ac.in', true, 91, 14, 4.9, 14, 16, '2024-09-12T11:00:00Z'),
  ('00000000-0000-0000-0000-000000000007', 'Mohammed Faiz', 'MF', '#059669', 'MBA, 1st Year', 'faiz.m@fms.edu', true, 86, 6, 4.6, 6, 5, '2025-01-15T16:00:00Z'),
  ('00000000-0000-0000-0000-000000000008', 'Ishita Banerjee', 'IB', '#D97706', 'B.Com Honours, Year 2', 'ishita.b@du.ac.in', true, 89, 11, 4.8, 11, 8, '2024-09-05T10:30:00Z'),
  ('00000000-0000-0000-0000-000000000009', 'Vikram Singh', 'VS', '#DC2626', 'Pharmacy, Year 4', 'vikram.singh@manipal.edu', false, 82, 8, 4.5, 9, 6, '2024-11-01T15:00:00Z'),
  ('00000000-0000-0000-0000-000000000010', 'Divya Menon', 'DM', '#DB2777', 'Design & Media, Year 2', 'divya.menon@nift.ac.in', true, 87, 12, 4.7, 13, 11, '2024-10-18T13:00:00Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  trust_score = EXCLUDED.trust_score,
  university_email = EXCLUDED.university_email;

-- 2. Insert 45+ Mock Items with Indian Campuses & Categories
INSERT INTO public.items (
  id, owner_id, name, category, condition, description, rules,
  campus, distance_km, max_duration_days, suggested_duration_days,
  deposit_inr, daily_rate_inr, min_trust_required, available, pickup_method, rating, borrow_count, image_seed, created_at
) VALUES
  -- Laptops & Computing
  (
    '10000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001',
    'Dell Inspiron 15 Laptop (i5, 8GB RAM, 512GB SSD)', 'laptops', 'Good',
    'Clean Ubuntu and Windows dual-boot setup. Perfect for project evaluations, viva presentations, or coding assignments.',
    ARRAY['Return with factory reset state or guest profile', 'Keep in padded laptop sleeve', 'No liquid near keyboard'],
    'Central Library', 0.4, 3, 2, 5000, 0, 70, true, 'Central Library ground floor discussion zone', 4.9, 14, 101, '2025-09-01T10:00:00Z'
  ),
  (
    '10000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000005',
    'MacBook Air M1 (16GB RAM, 256GB SSD)', 'laptops', 'Excellent',
    'Superfast Apple Silicon laptop with battery health at 94%. Ideal for iOS app builds, video render tasks, or final year capstone demos.',
    ARRAY['Only for Highly Trusted borrowers (Trust 85+)', 'Strictly indoor usage in hostel or library', 'Original MagSafe cable must be returned'],
    'Engineering Block', 0.8, 2, 2, 8000, 0, 85, true, 'Engineering Block lab porch', 5.0, 9, 102, '2025-09-03T11:30:00Z'
  ),
  (
    '10000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000003',
    'Lenovo IdeaPad Slim 3 (Ryzen 5)', 'laptops', 'Good',
    'Lightweight 14-inch laptop configured with Python, VS Code, and MATLAB for semester lab practicals.',
    ARRAY['Handle with clean hands', 'Charge only with supplied 65W round-pin charger'],
    'Boys Hostel', 1.1, 3, 2, 4500, 0, 70, false, 'Boys Hostel Block B entrance', 4.8, 11, 103, '2025-09-05T09:15:00Z'
  ),
  (
    '10000000-0000-0000-0000-000000000104', '00000000-0000-0000-0000-000000000001',
    'Laptop Cooling Pad with Dual LED Fans', 'laptops', 'Excellent',
    'Ergonomic 5-angle adjustable stand with silent high-airflow USB-powered fans. Prevents thermal throttling.',
    ARRAY['Do not place heavy textbooks on the fan mesh', 'Return with braided USB cable'],
    'Science Block', 0.3, 7, 3, 300, 0, 0, true, 'Science Block reading hall', 4.7, 18, 104, '2025-09-06T14:00:00Z'
  ),
  (
    '10000000-0000-0000-0000-000000000105', '00000000-0000-0000-0000-000000000002',
    'Wireless Optical Mouse (Logitech B170)', 'laptops', 'Excellent',
    'Reliable 2.4GHz wireless mouse with nano USB receiver and fresh AA Duracell battery installed.',
    ARRAY['Store nano receiver inside battery compartment when returning'],
    'Girls Hostel', 0.5, 7, 4, 0, 0, 0, true, 'Girls Hostel visitor desk', 4.9, 27, 105, '2025-09-07T16:20:00Z'
  ),
  (
    '10000000-0000-0000-0000-000000000106', '00000000-0000-0000-0000-000000000003',
    'Mechanical Keyboard (Red Switches, Tenkeyless)', 'laptops', 'Good',
    'Compact TKL mechanical keyboard with quiet linear red switches and warm amber backlighting.',
    ARRAY['No eating oily snacks while typing', 'Use keycap puller gently if cleaning'],
    'Engineering Block', 0.9, 5, 3, 500, 0, 0, true, 'Engineering Block corridor', 4.8, 16, 106, '2025-09-08T11:00:00Z'
  ),
  (
    '10000000-0000-0000-0000-000000000107', '00000000-0000-0000-0000-000000000007',
    'USB Hub 7-in-1 Type-C Multiport Adapter', 'adapters', 'Excellent',
    'Includes 4K HDMI, 3x USB 3.0 ports, SD/microSD card reader, and 100W Power Delivery pass-through.',
    ARRAY['Avoid yanking cable at sharp angles', 'Do not submerge or expose to spills'],
    'Central Library', 0.2, 4, 2, 0, 0, 0, true, 'Central Library counter', 4.9, 31, 107, '2025-09-09T13:45:00Z'
  ),
  (
    '10000000-0000-0000-0000-000000000108', '00000000-0000-0000-0000-000000000008',
    'HDMI Cable 2m + Gold-plated VGA Adapter', 'adapters', 'Good',
    'High-speed braided 2-meter HDMI 2.0 cable with active HDMI-to-VGA adapter for classroom seminar projectors.',
    ARRAY['Coil loosely without tight kinks', 'Return plastic connector caps'],
    'Canteen Court', 0.6, 3, 1, 0, 0, 0, true, 'Canteen Court seating pavilion', 4.9, 22, 108, '2025-09-10T15:00:00Z'
  ),
  (
    '10000000-0000-0000-0000-000000000109', '00000000-0000-0000-0000-000000000001',
    'Raspberry Pi 4 Starter Kit (4GB, Case, Heat Sinks)', 'electronics', 'Excellent',
    'Pre-flashed Raspberry Pi OS on 32GB card, official 15W USB-C PSU, and micro-HDMI cable.',
    ARRAY['Do not short 40-pin GPIO headers', 'Always cleanly shutdown before unplugging power'],
    'Engineering Block', 0.7, 7, 4, 1500, 0, 70, true, 'IoT lab entrance, Engineering Block', 5.0, 8, 109, '2025-09-11T12:00:00Z'
  ),
  (
    '10000000-0000-0000-0000-000000000110', '00000000-0000-0000-0000-000000000003',
    'Arduino Uno R3 Kit with 20+ Sensor Modules', 'electronics', 'Good',
    'Includes breadboard, jumper wires, ultrasonic sensor, IR module, and DHT11 temp/humidity sensor.',
    ARRAY['Keep all resistor values in labelled baggies', 'Avoid bending sensor pins'],
    'Science Block', 0.8, 7, 4, 800, 0, 0, true, 'Science Block foyer', 4.8, 14, 110, '2025-09-12T10:10:00Z'
  ),
  (
    '10000000-0000-0000-0000-000000000111', '00000000-0000-0000-0000-000000000005',
    'Pen Drive 64GB USB 3.2 + Portable HDD 1TB', 'electronics', 'Good',
    'Formatted in exFAT for seamless Windows and Mac file sharing. High-speed transfers for datasets.',
    ARRAY['Safely eject drive before disconnecting', 'Keep inside shockproof zippered pouch'],
    'Boys Hostel', 1.0, 5, 2, 600, 0, 0, true, 'Boys Hostel Gate 2', 4.7, 17, 111, '2025-09-13T17:00:00Z'
  ),

  -- Charging & Power
  (
    '10000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000001',
    'Mi 20000mAh Power Bank (18W Fast Charging)', 'power-banks', 'Excellent',
    'Dual USB-A output with Type-C input/output. Charges two phones simultaneously during long semester exam days.',
    ARRAY['Charge fully before returning', 'Do not leave in direct hot sun'],
    'Central Library', 0.2, 3, 1, 800, 0, 0, true, 'Central Library 1st floor desk', 4.9, 35, 201, '2025-09-14T09:00:00Z'
  ),
  (
    '10000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000002',
    'Anker PowerCore 10000mAh Ultra-Compact Power Bank', 'power-banks', 'Good',
    'Pocket-sized high speed PowerIQ external battery. Fits inside any blazer or backpack pencil pouch.',
    ARRAY['Use supplied micro-USB/Type-C short cable'],
    'Girls Hostel', 0.4, 2, 1, 500, 0, 0, true, 'Girls Hostel reception', 4.8, 24, 202, '2025-09-15T11:45:00Z'
  ),
  (
    '10000000-0000-0000-0000-000000000203', '00000000-0000-0000-0000-000000000003',
    'Dell 65W Original Laptop Charger (4.5mm Barrel)', 'chargers', 'Good',
    'Compatible with Dell Inspiron and Vostro series laptops. Includes 3-pin Indian wall power cord.',
    ARRAY['Do not yank cord from socket by cable', 'Indoor desk use only'],
    'Engineering Block', 0.7, 4, 2, 700, 0, 0, false, 'Engineering Block lobby', 4.9, 19, 203, '2025-09-16T14:30:00Z'
  ),
  (
    '10000000-0000-0000-0000-000000000204', '00000000-0000-0000-0000-000000000005',
    'MacBook USB-C 67W Power Adapter + Braided Cable', 'chargers', 'Excellent',
    'Fast charges M1/M2/M3 MacBook Air and Pro laptops, as well as iPad Pro and Samsung tablets.',
    ARRAY['Keep cable untangled in soft loop', 'Wipe clean if used in cafeteria'],
    'Student Activity Centre', 0.9, 3, 2, 800, 0, 0, true, 'Student Activity Centre cafe', 5.0, 22, 204, '2025-09-17T16:00:00Z'
  ),
  (
    '10000000-0000-0000-0000-000000000205', '00000000-0000-0000-0000-000000000008',
    'Universal All-in-One Travel Adapter (UK/US/EU/AUS)', 'adapters', 'Good',
    'Worldwide plug adapter with built-in dual USB ports (2.4A). Essential for foreign exchange students.',
    ARRAY['Press safety release button before sliding out pin set'],
    'Science Block', 0.3, 5, 3, 250, 0, 0, true, 'Science Block main steps', 4.8, 15, 205, '2025-09-18T10:00:00Z'
  ),
  (
    '10000000-0000-0000-0000-000000000206', '00000000-0000-0000-0000-000000000007',
    'Multi-plug Spike Guard Extension Board (4-Socket, 2m)', 'chargers', 'Good',
    'Heavy duty spike surge protection board with individual power switches and indicator LEDs.',
    ARRAY['Do not plug heavy immersion heaters into this board', 'Indoor hostel use only'],
    'Boys Hostel', 1.2, 14, 7, 0, 0, 0, true, 'Boys Hostel common room', 4.9, 29, 206, '2025-09-19T13:20:00Z'
  ),

  -- Audio & Electronics
  (
    '10000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000001',
    'Sony WH-CH520 Wireless Bluetooth Headphones', 'headphones', 'Excellent',
    'Up to 50 hours battery life with customized EQ and soft cushioned earcups. Great for focused study.',
    ARRAY['Clean earpads with dry cloth before return', 'Do not sleep wearing headphones'],
    'Central Library', 0.3, 4, 2, 1000, 0, 0, true, 'Central Library silence zone foyer', 4.9, 21, 301, '2025-09-21T14:30:00Z'
  ),
  (
    '10000000-0000-0000-0000-000000000302', '00000000-0000-0000-0000-000000000003',
    'boAt Rockerz 450 On-Ear Bluetooth Headphones', 'headphones', 'Good',
    'Comfortable padded on-ear headset with punchy bass and 15-hour playback. Includes aux cable.',
    ARRAY['Fold gently along hinges into pouch'],
    'Boys Hostel', 0.8, 3, 2, 600, 0, 0, true, 'Boys Hostel Block A lobby', 4.7, 19, 302, '2025-09-22T09:15:00Z'
  ),
  (
    '10000000-0000-0000-0000-000000000303', '00000000-0000-0000-0000-000000000007',
    'JBL Go 3 Portable Bluetooth Speaker (IP67 Waterproof)', 'electronics', 'Excellent',
    'Ultra-portable rugged speaker with bold JBL Pro Sound. Ideal for campus acoustic practice.',
    ARRAY['Rinse with clean water if sand settles on grille'],
    'Student Activity Centre', 0.6, 2, 1, 700, 0, 0, true, 'Student Activity Centre stage area', 5.0, 25, 303, '2025-09-22T16:00:00Z'
  ),
  (
    '10000000-0000-0000-0000-000000000307', '00000000-0000-0000-0000-000000000003',
    'Digital Multimeter with Test Probes & Continuity Buzzer', 'tools', 'Excellent',
    'Measures AC/DC voltage, DC current, resistance, and transistor testing. Crucial for circuit debugging.',
    ARRAY['Set selector knob back to OFF position after use'],
    'Engineering Block', 0.6, 4, 2, 350, 0, 0, true, 'Engineering Block Circuits Lab', 4.9, 22, 307, '2025-09-24T15:00:00Z'
  ),
  (
    '10000000-0000-0000-0000-000000000309', '00000000-0000-0000-0000-000000000001',
    'Canon EOS 1500D DSLR Camera (18-55mm IS II Lens)', 'cameras', 'Excellent',
    '24.1MP APS-C CMOS sensor camera with optical viewfinder, Full HD video, and Wi-Fi transfer.',
    ARRAY['Requires Trust Score 75+', 'Always wear neck strap while shooting', 'Never touch camera sensor'],
    'Central Library', 0.4, 2, 2, 6000, 0, 75, true, 'Central Library media lab', 5.0, 11, 309, '2025-09-25T17:00:00Z'
  ),

  -- Calculators & Stationery
  (
    '10000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000001',
    'Casio FX-991EX ClassWiz Scientific Calculator', 'calculators', 'Excellent',
    'Natural textbook display with 552 functions including matrix, equation solver, integration, and stats.',
    ARRAY['Keep in hard slide-on protective cover', 'Do not scribble on cover with permanent marker'],
    'Central Library', 0.3, 7, 3, 350, 0, 0, true, 'Central Library reception desk', 5.0, 42, 401, '2025-09-27T09:00:00Z'
  ),
  (
    '10000000-0000-0000-0000-000000000402', '00000000-0000-0000-0000-000000000008',
    'Casio FX-82MS Scientific Calculator (2-Line Display)', 'calculators', 'Good',
    'Robust 240-function non-programmable scientific calculator. Permitted in university semester exams.',
    ARRAY['Do not scratch LCD display window', 'Return right after exam completion'],
    'Science Block', 0.5, 7, 2, 0, 0, 0, true, 'Science Block lecture hall corridor', 4.9, 38, 402, '2025-09-27T10:15:00Z'
  ),
  (
    '10000000-0000-0000-0000-000000000405', '00000000-0000-0000-0000-000000000006',
    'Engineering Drawing Kit (Mini-Drafter, Set Squares, Clips)', 'stationery', 'Good',
    'Omega mini-drafter with clamp, acrylic set squares, protractor, and sheet clips for 1st Year Engineering Drawing.',
    ARRAY['Loosen clamp bolt before adjusting drafting arm', 'Keep ruler edge free of ink stains'],
    'Engineering Block', 0.6, 14, 7, 400, 0, 0, true, 'Engineering Drawing Hall 3', 4.8, 26, 405, '2025-09-27T16:00:00Z'
  ),
  (
    '10000000-0000-0000-0000-000000000407', '00000000-0000-0000-0000-000000000008',
    'Heavy Plastic Clipboard & Exam Pad (Transparent)', 'stationery', 'Excellent',
    'Smooth acrylic examination writing pad with stainless steel spring clip. Compliant with exam rules.',
    ARRAY['Do not scratch formulas or ink marks on surface', 'Return same day after exam'],
    'Canteen Court', 0.5, 5, 1, 0, 0, 0, true, 'Canteen Court entrance', 4.9, 34, 407, '2025-09-28T11:00:00Z'
  ),

  -- Books (Indian syllabus)
  (
    '10000000-0000-0000-0000-000000000501', '00000000-0000-0000-0000-000000000001',
    'Higher Engineering Mathematics (B.S. Grewal, 44th Edition)', 'books', 'Good',
    'Definitive engineering mathematics text covering calculus, differential equations, and vector analysis.',
    ARRAY['No ballpoint ink markings; light pencil underline only', 'Keep safe from water/tea spills'],
    'Central Library', 0.2, 21, 10, 200, 0, 0, true, 'Central Library circulation desk', 4.9, 36, 501, '2025-09-20T10:00:00Z'
  ),
  (
    '10000000-0000-0000-0000-000000000502', '00000000-0000-0000-0000-000000000005',
    'Data Structures Using C (Reema Thareja, 2nd Edition)', 'books', 'Excellent',
    'Lucid explanations of linked lists, trees, graphs, sorting, and recursion with complete C code.',
    ARRAY['Do not dog-ear pages; use a bookmark ribbon'],
    'Engineering Block', 0.6, 14, 7, 0, 0, 0, true, 'CSE Department lobby', 4.8, 25, 502, '2025-09-21T11:00:00Z'
  ),
  (
    '10000000-0000-0000-0000-000000000507', '00000000-0000-0000-0000-000000000001',
    'Concepts of Physics (H.C. Verma, Vol 1 & 2 Set)', 'books', 'Good',
    'The golden standard of problem-solving in physics. Includes solved short-answer questions and exercises.',
    ARRAY['Both volumes must be returned together'],
    'Central Library', 0.3, 21, 14, 0, 0, 0, true, 'Central Library steps', 5.0, 39, 507, '2025-09-24T15:30:00Z'
  ),

  -- Lab, Hostel & Daily Life
  (
    '10000000-0000-0000-0000-000000000601', '00000000-0000-0000-0000-000000000002',
    'White Unisex Lab Coat (Size Small, Pure Cotton)', 'lab-coats', 'Excellent',
    'Thick pure cotton lab coat with reinforced pockets and brass snaps. Freshly washed and ironed.',
    ARRAY['Wash and iron before returning', 'No bleach on college logo crest'],
    'Science Block', 0.3, 14, 4, 0, 0, 0, true, 'Science Block chemistry foyer', 4.9, 33, 601, '2025-09-20T08:00:00Z'
  ),
  (
    '10000000-0000-0000-0000-000000000602', '00000000-0000-0000-0000-000000000004',
    'White Unisex Lab Coat (Size Medium, Pure Cotton)', 'lab-coats', 'Good',
    'Full sleeves with knee-length cut. Clean and ironed, compliant with all college practical safety norms.',
    ARRAY['Wash before return if chemical spills occur'],
    'Science Block', 0.4, 14, 4, 0, 0, 0, true, 'Science Block main notice board', 4.8, 40, 602, '2025-09-20T09:30:00Z'
  ),
  (
    '10000000-0000-0000-0000-000000000608', '00000000-0000-0000-0000-000000000003',
    'Electric Kettle 1.5L Stainless Steel', 'kitchen', 'Good',
    'Fast boiling 1500W automatic cut-off electric kettle. Indispensable for late night study coffee and tea.',
    ARRAY['Never immerse kettle base in water', 'Rinse inside thoroughly before return'],
    'Boys Hostel', 0.8, 10, 5, 300, 0, 0, true, 'Boys Hostel Wing A foyer', 4.9, 38, 608, '2025-09-24T16:40:00Z'
  ),
  (
    '10000000-0000-0000-0000-000000000611', '00000000-0000-0000-0000-000000000001',
    'Philips Heavy Dry Iron Box (1000W Non-Stick Soleplate)', 'hostel-essentials', 'Excellent',
    'Heavyweight classic dry iron with fabric temperature dial. Razor sharp creases for interviews.',
    ARRAY['Unplug immediately after use', 'Allow soleplate to cool before wrapping cord'],
    'Central Library', 0.3, 4, 1, 0, 0, 0, true, 'Central Library side entrance', 4.9, 45, 611, '2025-09-26T09:10:00Z'
  ),
  (
    '10000000-0000-0000-0000-000000000616', '00000000-0000-0000-0000-000000000001',
    'Windproof Compact Auto-Open Umbrella', 'umbrellas', 'Excellent',
    'Reinforced 9-rib fiberglass frame umbrella with one-touch open/close button.',
    ARRAY['Let canopy air dry before collapsing into sleeve cover'],
    'Central Library', 0.3, 3, 1, 0, 0, 0, true, 'Central Library entrance', 4.9, 37, 616, '2025-09-27T14:00:00Z'
  ),

  -- Sports
  (
    '10000000-0000-0000-0000-000000000701', '00000000-0000-0000-0000-000000000001',
    'Kashmir Willow Cricket Bat + Leather Ball & Batting Pads', 'sports', 'Good',
    'Short handle seasoned Kashmir willow bat with sweet spot knocked in. Includes leather ball and leg pads.',
    ARRAY['Do not use against wet tennis balls', 'Wipe bat face clean after play'],
    'Sports Complex', 0.6, 3, 1, 300, 0, 0, true, 'Sports Complex cricket nets', 4.9, 31, 701, '2025-09-22T15:00:00Z'
  ),
  (
    '10000000-0000-0000-0000-000000000702', '00000000-0000-0000-0000-000000000002',
    'Yonex Badminton Racket Set (2 Rackets + Shuttlecock Tube)', 'sports', 'Excellent',
    'Isometric aluminum frame rackets with tight 24-lb tension and tube of 3 Mavis 350 nylon shuttlecocks.',
    ARRAY['Avoid clashing racket heads during doubles play'],
    'Sports Complex', 0.4, 2, 1, 0, 0, 0, true, 'Indoor Badminton Court foyer', 4.9, 44, 702, '2025-09-23T16:15:00Z'
  ),
  (
    '10000000-0000-0000-0000-000000000706', '00000000-0000-0000-0000-000000000003',
    'Synco Carrom Board 32" with Coins, Striker & Powder', 'sports', 'Excellent',
    'Tournament grade 32-inch carrom board with English birch ply, acrylic tournament striker, and powder.',
    ARRAY['Do not place cold glasses of water on board surface', 'Count all 19 carrom men before returning'],
    'Boys Hostel', 0.8, 3, 1, 400, 0, 0, true, 'Boys Hostel recreation room', 5.0, 35, 706, '2025-09-26T18:00:00Z'
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  deposit_inr = EXCLUDED.deposit_inr,
  min_trust_required = EXCLUDED.min_trust_required,
  campus = EXCLUDED.campus;

-- 3. Initial Borrow Requests
INSERT INTO public.borrow_requests (
  id, item_id, borrower_id, lender_id, borrow_date, return_date, message, status, created_at
) VALUES
  (
    '30000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000401',
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    '2025-10-05', '2025-10-07',
    'Hey Aarav, have my semester mathematics exam this Tuesday. Would love to borrow your ClassWiz calculator!',
    'accepted',
    '2025-09-24T10:00:00Z'
  ),
  (
    '30000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000602',
    '00000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000004',
    '2025-10-06', '2025-10-08',
    'Hi Priya, needed a clean lab coat for our chemistry practical viva this Thursday.',
    'pending',
    '2025-09-27T14:00:00Z'
  )
ON CONFLICT (id) DO NOTHING;

-- 4. Initial Campus Activities
INSERT INTO public.activity (id, user_id, type, text, created_at)
VALUES
  ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'lend', 'Aarav just lent a Casio ClassWiz calculator', NOW() - INTERVAL '2 minutes'),
  ('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000004', 'return', 'Priya returned a Lab Coat on time (100% score)', NOW() - INTERVAL '12 minutes'),
  ('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 'save', 'Rohan saved ₹2,500 borrowing textbooks this semester', NOW() - INTERVAL '35 minutes'),
  ('20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000006', 'list', 'Sneha listed an Engineering Drafter kit', NOW() - INTERVAL '1 hour')
ON CONFLICT (id) DO NOTHING;
