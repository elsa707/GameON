(function () {
    'use strict';

    var BASE_GAMES = [
        'Handling Sales Objections','Emotional Intelligence','Step 4 Present',
        'Step 5 Test Drive','Step 7 Closing & OTP','Step 2 Meet and Greet',
        'Step 8 Finance','7 Habits','Step 1 Introduction','Step 3 Needs Analysis',
        'Step 6 Trade-in Appraisal','Customer Service Excellence','Product Knowledge',
        'Compliance & Ethics','Digital Tools Proficiency','Team Leadership','Financial Products'
    ];

    /* Topic → game-index groupings for Games Overview collapsible list */
    var GAME_TOPICS = [
        { topic: 'Sales Objections',     indices: [0]             },
        { topic: 'Emotional Intelligence',indices: [1]            },
        { topic: 'Customer Service',     indices: [11]            },
        { topic: 'Compliance & Ethics',  indices: [13]            },
        { topic: 'Digital Skills',       indices: [14]            },
        { topic: 'Leadership',           indices: [7, 15]         },
        { topic: 'Financial Products',   indices: [6, 16]         },
        { topic: 'Product Knowledge',    indices: [12]            },
        { topic: 'No topic',             indices: [2,3,4,5,8,9,10] }
    ];

    var PERIODS = ['All Months','January2026','February2026','March2026','April2026','May2026','June2026'];
    var MONTHS_LABELS = ['2026-01','2026-02','2026-03','2026-04','2026-05','2026-06'];

    var NASPERS_MONTHLY = {
        players: [1, 5, 7, 8, 15, 9],
        plays:   [320, 380, 430, 480, 520, 370],
        acc:     [40, 56, 65, 70, 75, 78]
    };

    var NASPERS_DATA = {
        'All Months':    { plays:2500, avgAcc:72.1, userAns:0,
            perf:[[197,70.0,0.9],[196,75.7,1.1],[177,49.6,1.2],[176,73.3,1.0],[162,70.2,0.9],[159,52.7,1.0],[153,89.8,0.7],[150,66.3,1.0],[142,78.4,0.8],[138,61.2,1.1],[127,83.1,0.9],[119,44.8,1.3],[115,91.2,0.6],[108,77.5,1.0],[98,68.9,1.2],[87,55.3,1.4],[79,82.6,0.8]] },
        'January2026':  { plays:320, avgAcc:68.4, userAns:0,
            perf:[[26,66.3,0.9],[25,71.4,1.1],[23,46.2,1.2],[22,70.1,1.0],[21,68.5,0.9],[20,49.8,1.0],[19,85.4,0.7],[19,63.7,1.0],[18,74.9,0.8],[17,58.4,1.1],[16,80.2,0.9],[15,41.7,1.3],[14,88.1,0.6],[13,73.6,1.0],[12,64.8,1.2],[11,51.2,1.4],[9,79.4,0.8]] },
        'February2026': { plays:380, avgAcc:69.8, userAns:0,
            perf:[[31,68.8,0.9],[30,73.1,1.1],[28,47.9,1.2],[27,71.6,1.0],[26,69.3,0.9],[25,51.0,1.0],[24,87.2,0.7],[23,65.1,1.0],[22,76.3,0.8],[21,59.7,1.1],[19,81.6,0.9],[18,43.3,1.3],[17,89.4,0.6],[16,74.9,1.0],[15,66.2,1.2],[14,53.1,1.4],[12,80.7,0.8]] },
        'March2026':    { plays:430, avgAcc:71.4, userAns:0,
            perf:[[35,71.2,0.9],[34,76.8,1.1],[31,50.4,1.2],[30,74.5,1.0],[29,71.9,0.9],[28,54.2,1.0],[27,90.1,0.7],[26,67.4,1.0],[25,79.6,0.8],[24,62.3,1.1],[22,84.7,0.9],[21,45.9,1.3],[20,92.1,0.6],[19,78.3,1.0],[17,69.7,1.2],[15,56.8,1.4],[14,83.4,0.8]] },
        'April2026':    { plays:480, avgAcc:72.3, userAns:0,
            perf:[[39,71.4,0.9],[38,76.2,1.1],[35,50.8,1.2],[34,74.1,1.0],[32,71.0,0.9],[31,53.4,1.0],[30,90.4,0.7],[29,67.1,1.0],[27,79.0,0.8],[26,62.8,1.1],[24,83.9,0.9],[23,45.2,1.3],[22,91.6,0.6],[20,78.1,1.0],[19,69.3,1.2],[17,56.1,1.4],[15,83.1,0.8]] },
        'May2026':      { plays:520, avgAcc:73.1, userAns:0,
            perf:[[43,72.6,0.9],[42,77.4,1.1],[38,51.9,1.2],[37,75.3,1.0],[35,72.1,0.9],[33,55.7,1.0],[32,91.8,0.7],[31,68.4,1.0],[29,80.2,0.8],[28,63.9,1.1],[26,85.1,0.9],[25,46.4,1.3],[23,92.8,0.6],[22,79.3,1.0],[20,70.5,1.2],[18,57.4,1.4],[16,84.3,0.8]] },
        'June2026':     { plays:370, avgAcc:70.6, userAns:0,
            perf:[[30,70.8,0.9],[30,74.9,1.1],[27,48.3,1.2],[27,72.6,1.0],[25,69.7,0.9],[24,51.4,1.0],[23,88.6,0.7],[22,64.2,1.0],[21,77.1,0.8],[20,60.3,1.1],[19,82.7,0.9],[17,43.1,1.3],[16,90.4,0.6],[15,75.8,1.0],[14,67.1,1.2],[12,53.6,1.4],[10,80.9,0.8]] }
    };

    var COMPANY_PROFILES = {
        7: { name:'Naspers',        players:17, dealers:7,  playScale:1.00, accShift: 0.0 },
        6: { name:'Standard Bank',  players:24, dealers:12, playScale:1.52, accShift:+3.6 },
        5: { name:'Anglo American', players:12, dealers:5,  playScale:0.66, accShift:-2.8 },
        4: { name:'Sasol',          players:9,  dealers:4,  playScale:0.44, accShift:-7.2 },
        3: { name:'MTN Group',      players:38, dealers:18, playScale:2.84, accShift:+4.3 },
        2: { name:'Discovery',      players:8,  dealers:3,  playScale:0.33, accShift:+0.9 },
        1: { name:'Shoprite',       players:31, dealers:14, playScale:1.96, accShift:+1.5 }
    };

    var DEFAULT_COMPANY_ID = 7;

    /* Inactive player details per company — lastPlayed null = never played */
    var INACTIVE_PLAYERS = {
        7: [
            { name:'Danie Erasmus',    dept:'Parts',              lastPlayed: null,         daysInactive: null },
            { name:'Gilbert Letsoalo', dept:'Used Vehicle Sales', lastPlayed: null,         daysInactive: null },
            { name:'Henk Leibenberg',  dept:'Parts',              lastPlayed: '2026-05-02', daysInactive: 46   }
        ],
        6: [
            { name:'Bongani Nkosi',    dept:'Retail Banking',     lastPlayed: null,         daysInactive: null },
            { name:'Carla van der Berg',dept:'Operations',        lastPlayed: '2026-04-28', daysInactive: 51   },
            { name:'Sipho Dlamini',    dept:'Retail Banking',     lastPlayed: '2026-05-10', daysInactive: 39   },
            { name:'Yolanda Botha',    dept:'Operations',         lastPlayed: null,         daysInactive: null }
        ],
        5: [
            { name:'Andre du Toit',    dept:'Mining Ops',         lastPlayed: null,         daysInactive: null },
            { name:'Nomsa Khumalo',    dept:'Mining Ops',         lastPlayed: '2026-05-20', daysInactive: 29   }
        ]
    };

    /* Game coverage data per company — players who played each game vs total active */
    var GAME_COVERAGE = {
        7: {
            coveragePct: 24.3,
            byGame: [
                { name:'Handling Sales Objections', players: 9, avgAcc: 71.9 },
                { name:'Emotional Intelligence',    players: 9, avgAcc: 70.2 },
                { name:'Step 4 Present',            players: 9, avgAcc: 54.2 },
                { name:'Step 7 Closing & OTP',      players: 8, avgAcc: 80.3 },
                { name:'Step 5 Test Drive',         players: 7, avgAcc: 77.1 },
                { name:'Step 2 Meet and Greet',     players: 7, avgAcc: 92.3 },
                { name:'Step 8 Finance',            players: 7, avgAcc: 80.6 },
                { name:'7 Habits',                  players: 5, avgAcc: 68.9 },
                { name:'Step 1 Introduction',       players: 4, avgAcc: 55.3 },
                { name:'Step 3 Needs Analysis',     players: 3, avgAcc: 62.7 },
                { name:'Step 6 Trade-in Appraisal', players: 2, avgAcc: 74.8 },
                { name:'Customer Service Excellence',players:1, avgAcc: 78.4 },
                { name:'Product Knowledge',         players: 1, avgAcc: 83.1 },
                { name:'Compliance & Ethics',       players: 0, avgAcc: 0    },
                { name:'Digital Tools Proficiency', players: 0, avgAcc: 0    },
                { name:'Team Leadership',           players: 0, avgAcc: 0    },
                { name:'Financial Products',        players: 0, avgAcc: 0    }
            ]
        }
    };

    /* Brand colours per company — drives sidebar + dashboard chrome */
    var COMPANY_THEMES = {
        7: { bg: '#2e5795', dark: '#111935' },  // Naspers
        6: { bg: '#1a3a6c', dark: '#0a1e40' },  // Standard Bank
        5: { bg: '#1a4a6c', dark: '#0a2438' },  // Anglo American
        4: { bg: '#1a4060', dark: '#0a2030' },  // Sasol
        3: { bg: '#1a3050', dark: '#0d1e35' },  // MTN Group
        2: { bg: '#1a3575', dark: '#0a1e48' },  // Discovery
        1: { bg: '#5a1a20', dark: '#2d0a10' }   // Shoprite
    };

    function applyCompanyTheme(companyId) {
        var theme = COMPANY_THEMES[companyId] || COMPANY_THEMES[DEFAULT_COMPANY_ID];
        var root  = document.documentElement;
        root.style.setProperty('--chrome-bg',   theme.bg);
        root.style.setProperty('--chrome-dark', theme.dark);
    }

    var COMPANY_REGISTERED = { 7:22, 6:31, 5:15, 4:12, 3:48, 2:10, 1:38 };

    var COMPANY_DEPT_PLAYERS = {
        7: [
            { name:'BB Gezina Nissan',      total:22, active:16, avgPoints:505 },
            { name:'Auto Sales Excellence', total:5,  active:2,  avgPoints:2   },
            { name:'Citton Cars',           total:1,  active:0,  avgPoints:0   }
        ],
        6: [
            { name:'Sales',           total:14, active:11, avgPoints:380 },
            { name:'Aftersales',      total:8,  active:6,  avgPoints:290 },
            { name:'Finance',         total:5,  active:4,  avgPoints:210 },
            { name:'Marketing',       total:3,  active:2,  avgPoints:150 },
            { name:'Human Resources', total:1,  active:1,  avgPoints:80  }
        ],
        5: [
            { name:'R&D',          total:4, active:3, avgPoints:320 },
            { name:'Manufacturing', total:4, active:3, avgPoints:275 },
            { name:'Sales',         total:3, active:3, avgPoints:310 },
            { name:'Marketing',     total:2, active:2, avgPoints:240 },
            { name:'Engineering',   total:2, active:1, avgPoints:190 }
        ],
        4: [
            { name:'Operations',      total:5, active:4, avgPoints:220 },
            { name:'Marketing',       total:3, active:2, avgPoints:180 },
            { name:'Finance',         total:2, active:2, avgPoints:160 },
            { name:'Human Resources', total:2, active:1, avgPoints:110 }
        ],
        3: [
            { name:'Brand & Marketing', total:14, active:12, avgPoints:450 },
            { name:'Sales',             total:12, active:10, avgPoints:410 },
            { name:'Engineering',       total:8,  active:6,  avgPoints:380 },
            { name:'Finance',           total:7,  active:5,  avgPoints:340 },
            { name:'IT & Digital',      total:4,  active:3,  avgPoints:290 },
            { name:'Supply Chain',      total:3,  active:2,  avgPoints:260 }
        ],
        2: [
            { name:'R&D',           total:3, active:3, avgPoints:280 },
            { name:'Manufacturing',  total:3, active:2, avgPoints:240 },
            { name:'Finance',        total:2, active:2, avgPoints:210 },
            { name:'Logistics',      total:2, active:1, avgPoints:170 }
        ],
        1: [
            { name:'Operations',       total:10, active:9, avgPoints:360 },
            { name:'Sales',            total:9,  active:7, avgPoints:320 },
            { name:'Customer Support', total:7,  active:6, avgPoints:290 },
            { name:'Finance',          total:6,  active:5, avgPoints:250 },
            { name:'Product',          total:4,  active:3, avgPoints:210 },
            { name:'Engineering',      total:2,  active:1, avgPoints:180 }
        ]
    };

    /* Company 7 uses exact reference names/values */
    var COMPANY_PLAYERS = {
        7: [
            { name:'Rihcard Moroke',           dept:'BB Gezina Nissan', region:'', points:4177, accuracy:78.7, games:1061 },
            { name:'Johann Kok',               dept:'BB Gezina Nissan', region:'', points:1345, accuracy:72.7, games:370  },
            { name:'Hein Hein',                dept:'BB Gezina Nissan', region:'', points:510,  accuracy:70.8, games:144  },
            { name:'Zelda Van Nieuwenhuizen',  dept:'BB Gezina Nissan', region:'', points:456,  accuracy:62.0, games:147  },
            { name:'Hannes Swanepoel',         dept:'BB Gezina Nissan', region:'', points:446,  accuracy:63.3, games:141  },
            { name:'Esta Modiba',              dept:'BB Gezina Nissan', region:'', points:235,  accuracy:58.0, games:81   },
            { name:'Branden Smith',            dept:'BB Gezina Nissan', region:'', points:196,  accuracy:58.5, games:67   }
        ],
        6: [
            { name:'Pieter van der Berg', dept:'Sales',     region:'', points:3606, accuracy:81.7, games:441 },
            { name:'Nomvula Dlamini',     dept:'Sales',     region:'', points:3560, accuracy:85.3, games:418 },
            { name:'Riaan Botha',         dept:'Aftersales',region:'', points:2953, accuracy:74.6, games:396 },
            { name:'Thandiwe Cele',       dept:'Sales',     region:'', points:2956, accuracy:78.9, games:374 },
            { name:'Luyanda Mthembu',     dept:'Finance',   region:'', points:3264, accuracy:91.2, games:358 },
            { name:'Chantelle Fourie',    dept:'Sales',     region:'', points:2298, accuracy:67.4, games:341 },
            { name:'Siyabonga Khumalo',   dept:'Finance',   region:'', points:2399, accuracy:72.8, games:329 },
            { name:'Marlize du Plessis',  dept:'Marketing', region:'', points:2521, accuracy:80.1, games:315 },
            { name:'Musa Ngcobo',         dept:'HR',        region:'', points:1847, accuracy:61.3, games:301 },
            { name:'Yolanda Jacobs',      dept:'Sales',     region:'', points:2437, accuracy:84.6, games:288 }
        ],
        5: [
            { name:'Johan Pretorius',   dept:'Engineering',   region:'', points:1431, accuracy:72.3, games:198 },
            { name:'Nandi Mkhize',      dept:'Sales',         region:'', points:1215, accuracy:66.1, games:184 },
            { name:'Deon Erasmus',      dept:'R&D',           region:'', points:1357, accuracy:79.4, games:171 },
            { name:'Zodwa Ntuli',       dept:'Finance',       region:'', points:1007, accuracy:63.7, games:158 },
            { name:'Charl Venter',      dept:'Manufacturing', region:'', points:1027, accuracy:70.8, games:145 },
            { name:'Precious Mahlangu', dept:'Marketing',     region:'', points:769,  accuracy:58.2, games:132 },
            { name:'Gerhard Smit',      dept:'Engineering',   region:'', points:903,  accuracy:75.9, games:119 },
            { name:'Lindiwe Sithole',   dept:'R&D',           region:'', points:862,  accuracy:81.3, games:106 }
        ],
        4: [
            { name:'Francois du Toit', dept:'Operations',      region:'', points:944, accuracy:64.2, games:147 },
            { name:'Mmabatho Radebe',  dept:'Finance',         region:'', points:823, accuracy:59.7, games:138 },
            { name:'Barend Ferreira',  dept:'IT',              region:'', points:906, accuracy:71.8, games:126 },
            { name:'Nolwazi Dlamini',  dept:'Marketing',       region:'', points:637, accuracy:55.3, games:115 },
            { name:'Anton Kruger',     dept:'Operations',      region:'', points:700, accuracy:67.9, games:103 },
            { name:'Phindile Mthembu', dept:'Human Resources', region:'', points:483, accuracy:53.1, games:91  }
        ],
        3: [
            { name:'Kwame Asante',     dept:'Brand & Marketing', region:'', points:5148, accuracy:83.1, games:619 },
            { name:'Adaeze Okonkwo',   dept:'Sales',             region:'', points:5231, accuracy:87.4, games:598 },
            { name:'Emeka Nwosu',      dept:'Engineering',        region:'', points:4412, accuracy:76.9, games:574 },
            { name:'Fatima Al-Hassan', dept:'Finance',            region:'', points:5053, accuracy:91.7, games:551 },
            { name:'Kofi Boateng',     dept:'IT & Digital',       region:'', points:4182, accuracy:79.2, games:528 },
            { name:'Amara Diallo',     dept:'Sales',              region:'', points:3619, accuracy:71.8, games:504 },
            { name:'Ngozi Okafor',     dept:'Supply Chain',       region:'', points:4116, accuracy:85.6, games:481 },
            { name:'Chidi Obi',        dept:'Engineering',         region:'', points:3121, accuracy:68.3, games:457 },
            { name:'Yemi Adeyemi',     dept:'Sales',              region:'', points:3481, accuracy:80.5, games:433 },
            { name:'Seun Adesanya',    dept:'Engineering',         region:'', points:3032, accuracy:74.1, games:409 }
        ],
        2: [
            { name:'Gareth Humphreys',    dept:'R&D',           region:'', points:1266, accuracy:75.8, games:167 },
            { name:'Keabetswe Sithole',   dept:'Finance',       region:'', points:1107, accuracy:72.4, games:153 },
            { name:'Melissa van Niekerk', dept:'Manufacturing', region:'', points:958,  accuracy:68.9, games:139 },
            { name:'Lebo Mokoena',        dept:'Logistics',     region:'', points:1008, accuracy:81.3, games:124 },
            { name:'Craig Ferreira',      dept:'R&D',           region:'', points:770,  accuracy:70.6, games:109 },
            { name:'Sindisiwe Hadebe',    dept:'Finance',       region:'', points:717,  accuracy:76.2, games:94  }
        ],
        1: [
            { name:'Sizwe Mhlongo',        dept:'Operations',       region:'', points:3799, accuracy:76.3, games:498 },
            { name:'Elizma Vermeulen',     dept:'Sales',            region:'', points:3829, accuracy:80.7, games:474 },
            { name:'Bongani Ndlela',       dept:'Customer Support', region:'', points:3211, accuracy:71.2, games:451 },
            { name:'Petro Joubert',        dept:'Finance',          region:'', points:3625, accuracy:84.9, games:427 },
            { name:'Dimakatso Motsepe',    dept:'Sales',            region:'', points:2797, accuracy:69.4, games:403 },
            { name:'Hendrik Swart',        dept:'Operations',       region:'', points:2977, accuracy:78.6, games:379 },
            { name:'Nobuhle Ngema',        dept:'Product',          region:'', points:2598, accuracy:73.1, games:355 },
            { name:'Roelof van Jaarsveld', dept:'Engineering',      region:'', points:2924, accuracy:88.4, games:331 },
            { name:'Ayanda Dlamini',       dept:'Human Resources',  region:'', points:1928, accuracy:62.8, games:307 },
            { name:'Taryn Engelbrecht',    dept:'Data Analytics',   region:'', points:2329, accuracy:82.3, games:283 }
        ]
    };

    var COMPANY_DEALERS = {
        7: [
            { name:'BB Gezina Nissan - Parts',                      total:3, active:0, players:0, avgAcc:0,    points:0    },
            { name:'BB Gezina Nissan - Parts Manager',              total:1, active:0, players:0, avgAcc:0,    points:0    },
            { name:'BB Gezina Nissan - Used Vehicle Sales',         total:6, active:5, players:5, avgAcc:69.0, points:2585 },
            { name:'BB Gezina Nissan - New Vehicle Sales',          total:7, active:7, players:7, avgAcc:73.8, points:4923 },
            { name:'BB Gezina Nissan - CRM',                        total:1, active:1, players:1, avgAcc:62.0, points:456  },
            { name:'BB Gezina Nissan - Used Vehicle Sales Manager', total:1, active:1, players:1, avgAcc:67.7, points:88   },
            { name:'BB Gezina Nissan - New Vehicle Sales Manager',  total:1, active:1, players:1, avgAcc:76.0, points:19   },
            { name:'BB Gezina Nissan - DP',                         total:1, active:1, players:1, avgAcc:53.3, points:8    },
            { name:'Automotive Sales Excellence',                   total:3, active:3, players:3, avgAcc:52.3, points:2    },
            { name:'Citton Cars',                                   total:2, active:0, players:0, avgAcc:0,    points:0    }
        ]
    };

    var PLAYER_COVERAGE = {
        7: [
            { name:'Lucas Schmahl',          dealer:'BB Gezina Nissan - Used Vehicle Sales',        short:'BB Gezina Niss', played:17 },
            { name:'Branden Smith',          dealer:'BB Gezina Nissan - Used Vehicle Sales',        short:'BB Gezina Niss', played:16 },
            { name:'Celia Motlana',          dealer:'BB Gezina Nissan - New Vehicle Sales',         short:'BB Gezina Niss', played:16 },
            { name:'Rihcard Moroke',         dealer:'BB Gezina Nissan - New Vehicle Sales',         short:'BB Gezina Niss', played:15 },
            { name:'Johann Kok',             dealer:'BB Gezina Nissan - Used Vehicle Sales',        short:'BB Gezina Niss', played:14 },
            { name:'Hannes Swanepoel',       dealer:'BB Gezina Nissan - F&I',                      short:'BB Gezina Niss', played:13 },
            { name:'Esta Modiba',            dealer:'BB Gezina Nissan - Used Vehicle Sales',        short:'BB Gezina Niss', played:12 },
            { name:'Zelda Van Nieuwenhuizen',dealer:'BB Gezina Nissan - Parts',                    short:'BB Gezina Niss', played:10 },
            { name:'Hein Hein',              dealer:'BB Gezina Nissan - New Vehicle Sales',         short:'BB Gezina Niss', played: 9 },
            { name:'Johan Naude',            dealer:'BB Gezina Nissan - New Vehicle Sales',         short:'BB Gezina Niss', played: 8 },
            { name:'Kobus Venter',           dealer:'BB Gezina Nissan - New Vehicle Sales',         short:'BB Gezina Niss', played: 7 },
            { name:'George Hansen',          dealer:'BB Gezina Nissan - New Vehicle Sales Manager', short:'BB Gezina Niss', played: 4 },
            { name:'Larry Ledwaba',          dealer:'BB Gezina Nissan - New Vehicle Sales',         short:'BB Gezina Niss', played: 4 },
            { name:'Wynand Swart',           dealer:'BB Gezina Nissan - DP',                       short:'BB Gezina Niss', played: 3 },
            { name:'Molapo Letsoalo',        dealer:'Automotive Sales Excellence',                  short:'Auto Sales Exc', played: 2 },
            { name:'Priya Naidoo',           dealer:'Automotive Sales Excellence',                  short:'Auto Sales Exc', played: 2 },
            { name:'Rian Van Jaarsveld',     dealer:'Automotive Sales Excellence',                  short:'Auto Sales Exc', played: 1 },
            { name:'Danie Erasmus',          dealer:'BB Gezina Nissan - Parts',                    short:'BB Gezina Niss', played: 0 },
            { name:'Ernest Keyser',          dealer:'BB Gezina Nissan - Parts Manager',            short:'BB Gezina Niss', played: 0 },
            { name:'Gilbert Letsoalo',       dealer:'BB Gezina Nissan - Used Vehicle Sales',       short:'BB Gezina Niss', played: 0 },
            { name:'Henk Leibenberg',        dealer:'BB Gezina Nissan - Parts',                    short:'BB Gezina Niss', played: 0 },
            { name:'Letisha Vos',            dealer:'BB Gezina Nissan - Parts',                    short:'BB Gezina Niss', played: 0 }
        ]
    };

    /* ── Data generation ─────────────────────────────────────── */

    var _dataCache = {};

    function getPeriodData(companyId, period) {
        var key = companyId + '|' + period;
        if (_dataCache[key]) return _dataCache[key];
        var profile = COMPANY_PROFILES[companyId] || COMPANY_PROFILES[DEFAULT_COMPANY_ID];
        var base = NASPERS_DATA[period];
        if (!base) return null;
        var ps = profile.playScale;
        var as = profile.accShift;
        var result = {
            players: profile.players,
            plays:   Math.round(base.plays * ps),
            dealers: profile.dealers,
            avgAcc:  parseFloat((base.avgAcc + as).toFixed(1)),
            userAns: Math.round(base.userAns * ps),
            perf:    base.perf.map(function(p) {
                return {
                    plays:    Math.max(1, Math.round(p[0] * ps)),
                    accuracy: parseFloat(Math.min(98, Math.max(18, p[1] + as)).toFixed(1)),
                    playTime: p[2]
                };
            })
        };
        _dataCache[key] = result;
        return result;
    }

    function getDeptPlayers(companyId) {
        var depts = COMPANY_DEPT_PLAYERS[companyId] || COMPANY_DEPT_PLAYERS[DEFAULT_COMPANY_ID];
        if (state.period !== 'All Months') {
            var pData  = getPeriodData(companyId, state.period);
            var allData = getPeriodData(companyId, 'All Months');
            var ratio  = allData ? pData.plays / allData.plays : 1;
            return depts.map(function(d) {
                return {
                    name:      d.name,
                    total:     d.total,
                    active:    Math.min(d.total, Math.max(0, Math.round(d.active * (0.7 + ratio * 0.3)))),
                    avgPoints: d.avgPoints
                };
            });
        }
        return depts;
    }

    function getDealerGroups(companyId) {
        var dealers = COMPANY_DEALERS[companyId] || COMPANY_DEALERS[DEFAULT_COMPANY_ID] || [];
        var groups = {}, order = [];
        dealers.forEach(function(d) {
            var groupName = d.name.indexOf(' - ') > -1 ? d.name.split(' - ')[0] : d.name;
            if (!groups[groupName]) { groups[groupName] = { name: groupName, total: 0, active: 0 }; order.push(groupName); }
            groups[groupName].total  += d.total;
            groups[groupName].active += d.active;
        });
        return order.map(function(k) { return groups[k]; });
    }

    function getMonthlyTrend(companyId) {
        var profile = COMPANY_PROFILES[companyId] || COMPANY_PROFILES[DEFAULT_COMPANY_ID];
        var ps = profile.playScale;
        var as = profile.accShift;
        return {
            players: NASPERS_MONTHLY.players.map(function(p) { return Math.max(1, Math.round(p * Math.sqrt(ps))); }),
            plays:   NASPERS_MONTHLY.plays.map(function(p)   { return Math.round(p * ps); }),
            acc:     NASPERS_MONTHLY.acc.map(function(a)     { return parseFloat(Math.min(97, Math.max(20, a + as * 0.5)).toFixed(1)); })
        };
    }

    function linearRegression(data) {
        var n = data.length, sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
        for (var i = 0; i < n; i++) { sumX += i; sumY += data[i]; sumXY += i*data[i]; sumXX += i*i; }
        var denom = n*sumXX - sumX*sumX;
        if (denom === 0) return { slope:0, intercept: sumY/n };
        return { slope: (n*sumXY - sumX*sumY)/denom, intercept: (sumY - ((n*sumXY - sumX*sumY)/denom)*sumX)/n };
    }

    /* ── State ───────────────────────────────────────────────── */

    var state = { companyId: DEFAULT_COMPANY_ID, period:'All Months', mainTab:'summary', subTab:'overview' };

    var _gpFilter          = { search: '', incompleteOnly: false };
    var _gpView            = 'coverage'; /* 'coverage' | 'gameaday' */
    var _gcView            = 'bygame';   /* 'bygame' | 'byplayer' */
    var _trendsGranularity = 'monthly';  /* 'daily' | 'weekly' | 'monthly' */
    var _gadNcOnly         = false;
    var _gadSearch         = '';
    var _gadDept           = '';

    function getTrendDataForGranularity(companyId, gran) {
        var m    = getMonthlyTrend(companyId);
        var MON  = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        function fmtDate(dt) { return MON[dt.getMonth()] + ' ' + dt.getDate(); }

        if (gran === 'monthly') return { labels: MONTHS_LABELS, players: m.players, plays: m.plays, acc: m.acc };

        var labels = [], players = [], plays = [], acc = [];
        if (gran === 'weekly') {
            var wkStart = new Date(2026, 0, 12); /* Jan 12 2026 — first week of data */
            MONTHS_LABELS.forEach(function(ml, mi) {
                for (var w = 0; w < 4; w++) {
                    var idx = mi * 4 + w;
                    var v   = 0.82 + Math.abs(Math.sin(idx * 11 + companyId * 3)) * 0.36;
                    var dt  = new Date(wkStart); dt.setDate(dt.getDate() + idx * 7);
                    labels.push(fmtDate(dt));
                    players.push(Math.max(0, Math.round(m.players[mi] * v)));
                    plays.push(Math.max(0, Math.round(m.plays[mi] / 4 * v)));
                    acc.push(Math.min(99, Math.max(20, Math.round(m.acc[mi] * (0.94 + Math.abs(Math.sin(idx * 7)) * 0.12)))));
                }
            });
        } else { /* daily — last 30 days ending yesterday */
            var li = m.players.length - 1, pi = Math.max(0, li - 1);
            var today = new Date();
            for (var d = 0; d < 30; d++) {
                var t  = d / 29;
                var v  = 0.78 + Math.abs(Math.sin(d * 13 + companyId * 7)) * 0.44;
                var dt = new Date(today); dt.setDate(dt.getDate() - (29 - d));
                labels.push(fmtDate(dt));
                players.push(Math.max(0, Math.round((m.players[pi] + (m.players[li] - m.players[pi]) * t) * v)));
                plays.push(Math.max(0, Math.round((m.plays[pi] + (m.plays[li] - m.plays[pi]) * t) / 22 * v)));
                acc.push(Math.min(99, Math.max(20, Math.round((m.acc[pi] + (m.acc[li] - m.acc[pi]) * t) * (0.88 + Math.abs(Math.sin(d * 9)) * 0.24)))));
            }
        }
        return { labels: labels, players: players, plays: plays, acc: acc };
    }

    window.setTrendsGranularity = function(g) {
        _trendsGranularity = g;
        renderSummaryTrends();
    };

    /* ── Chart registry ──────────────────────────────────────── */

    var _charts = {};

    function destroyChart(id) {
        var $el = $('#' + id);
        if ($el.length) {
            try { $el.dxChart('instance').dispose();    } catch(e) {}
            try { $el.dxPieChart('instance').dispose(); } catch(e) {}
        }
        delete _charts[id];
    }

    function makeChart(id, cfg) {
        destroyChart(id);
        var $el = $('#' + id);
        if (!$el.length) return;
        _charts[id] = true;
        if (cfg.isPie) $el.dxPieChart(cfg.opts);
        else           $el.dxChart(cfg.opts);
    }

    /* ── Helpers ─────────────────────────────────────────────── */

    function fmtPlays(n) { return n >= 1000 ? (n/1000).toFixed(1).replace(/\.0$/,'')+'K' : String(n); }
    function accColor(pct) { return pct >= 75 ? 'green' : pct >= 60 ? 'orange' : 'red'; }
    function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
    function hexRgba(hex, a) {
        var r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
        return 'rgba('+r+','+g+','+b+','+a+')';
    }
    function fmtPeriod(p) {
        return p === 'All Months' ? p : p.replace(/(\d{4})$/, ' $1');
    }

    function areaChartConfig(data, color, isPercent, h, labels) {
        var lbs = labels || MONTHS_LABELS;
        var ds  = lbs.map(function(l, i) { return { arg: l, val: data[i] }; });
        return {
            opts: {
                dataSource: ds,
                series: [{ argumentField: 'arg', valueField: 'val', type: 'area', color: color, opacity: 0.18,
                           point: { visible: true, size: 5, color: color } }],
                commonAxisSettings: {
                    grid: { color: 'rgba(200,200,200,0.25)', visible: true },
                    tick: { visible: false },
                    label: { font: { size: 10, color: '#64748b' } }
                },
                argumentAxis: { grid: { visible: false } },
                valueAxis: {
                    max: isPercent ? 100 : undefined,
                    label: { customizeText: isPercent ? function(info) { return info.valueText + '%'; } : undefined }
                },
                legend:  { visible: false },
                tooltip: { enabled: true },
                size:    { height: h || 200 }
            }
        };
    }

    function metricCard(label, value, valClass, iconClass, iconTheme, subText) {
        return '<div class="metric-card">' +
            '<div class="metric-card-body">' +
                '<div class="metric-lbl">' + esc(label) + '</div>' +
                '<div class="metric-val' + (valClass ? ' '+valClass : '') + '">' + esc(String(value)) + '</div>' +
                (subText ? '<div style="font-size:11px;color:var(--text-secondary);margin-top:2px">'+esc(subText)+'</div>' : '') +
            '</div>' +
            '<div class="metric-icon ' + iconTheme + '"><i class="' + iconClass + '"></i></div>' +
        '</div>';
    }

    /* ── Overview v2 card helpers ───────────────────────────── */

    function ovKpiCard(label, value, trendText, trendUp, accentColor) {
        var accent     = accentColor || '#3b82f6';
        var trendClass = trendUp === false ? 'ov-kpi-trend down' : 'ov-kpi-trend';
        var trendIcon  = trendUp === false ? 'fa-arrow-trend-down' : 'fa-arrow-trend-up';
        return '<div class="ov-kpi-card" style="border-left-color:' + accent + '">' +
            '<div class="ov-kpi-lbl">' + esc(label) + '</div>' +
            '<div class="ov-kpi-val">' + esc(String(value)) + '</div>' +
            (trendText ? '<div class="' + trendClass + '"><span class="ov-kpi-pill"><i class="fas ' + trendIcon + '"></i> ' + esc(trendText) + ' vs prior period</span></div>' : '') +
        '</div>';
    }

    function ovMiniCard(iconClass, iconColor, iconBg, label, value) {
        return '<div class="ov-mini-card">' +
            '<div class="ov-mini-icon" style="background:' + iconBg + ';color:' + iconColor + '"><i class="' + iconClass + '"></i></div>' +
            '<div class="ov-mini-lbl">' + esc(label) + '</div>' +
            '<div class="ov-mini-val">' + esc(String(value)) + '</div>' +
        '</div>';
    }

    /* ── Render: period selector ─────────────────────────────── */

    var _MONTH_RANGES = {
        'January2026':  [new Date(2026,0,1),  new Date(2026,0,31)],
        'February2026': [new Date(2026,1,1),  new Date(2026,1,28)],
        'March2026':    [new Date(2026,2,1),  new Date(2026,2,31)],
        'April2026':    [new Date(2026,3,1),  new Date(2026,3,30)],
        'May2026':      [new Date(2026,4,1),  new Date(2026,4,31)],
        'June2026':     [new Date(2026,5,1),  new Date(2026,5,18)]
    };
    var _ALL_MONTHS_RANGE = [new Date(2026,0,1), new Date(2026,5,18)];

    function renderPeriodTabs() {
        try {
            var sel = $('#dashPeriodMonths').dxSelectBox('instance');
            if (sel) sel.option('value', state.period);
        } catch(e) {}
        try {
            var inst = $('#dashDateRangeBox').dxDateRangeBox('instance');
            var r = _MONTH_RANGES[state.period] || _ALL_MONTHS_RANGE;
            inst.option({ startDate: r[0], endDate: r[1] });
        } catch(e) {}
    }

    /* ── Render: header stats ────────────────────────────────── */

    function renderHeaderStats() {
        var d = getPeriodData(state.companyId, state.period);
        if (!d) return;
        document.getElementById('dashStatPlayers').textContent = d.players;
        document.getElementById('dashStatPlays').textContent   = fmtPlays(d.plays);
        document.getElementById('dashStatDealers').textContent = d.dealers;
    }

    /* ── KPI card helper ─────────────────────────────────────── */

    function kpiCard(accent, label, value, sub, progress) {
        var light = hexRgba(accent, 0.09);
        return '<div class="kpi-card" style="--accent:' + accent + ';--accent-light:' + light + '">' +
            '<div class="kpi-label">' + esc(label) + '</div>' +
            '<div class="kpi-value">' + esc(String(value)) + '</div>' +
            '<div class="kpi-sub">' + esc(sub) + '</div>' +
            (progress !== null ? '<div class="kpi-progress"><div class="kpi-progress-fill" style="width:' + progress + '%"></div></div>' : '') +
        '</div>';
    }

    /* ── Render: Summary > Overview ─────────────────────────── */

    function renderSummaryOverview() {
        var el = document.getElementById('dashSummaryOverview');
        if (!el) return;
        var d        = getPeriodData(state.companyId, state.period);
        var profile  = COMPANY_PROFILES[state.companyId] || COMPANY_PROFILES[DEFAULT_COMPANY_ID];
        var reg      = COMPANY_REGISTERED[state.companyId] || profile.players;
        var active   = profile.players;
        var inactive = Math.max(0, reg - active);
        var partRate = reg > 0 ? Math.round(active / reg * 100) : 0;
        var depts    = getDeptPlayers(state.companyId);
        var players  = COMPANY_PLAYERS[state.companyId] || COMPANY_PLAYERS[DEFAULT_COMPANY_ID];

        /* Top 8 games by plays */
        var topGames = BASE_GAMES.slice(0, 8).map(function(name, i) {
            return { name: name, plays: d.perf[i] ? d.perf[i].plays : 0 };
        });

        el.innerHTML =
            '<div class="summary-page">' +

            /* Row 1 — 4 KPI cards (clean white, dev-site style) */
            '<div class="ov-kpi-row">' +
                ovKpiCard('Participation rate', partRate + '%', '13.6%', true, '#1C2333') +
                ovKpiCard('Active players',     active,        '+' + Math.max(1, Math.round(active * 0.15)) + ' players', true, '#1C2333') +
                ovKpiCard('Sessions',           fmtPlays(d.plays), fmtPlays(Math.round(d.plays * 0.85)) + ' plays', true, '#1C2333') +
                ovKpiCard('Avg. accuracy',      d.avgAcc.toFixed(1) + '%', '9.8%', true, '#1C2333') +
            '</div>' +

            /* Row 2 — Department Activity chart + Top Games by Plays chart */
            '<div class="ov-mid-row">' +
                '<div class="panel-card"><div class="panel-card-hd">Department Activity</div>' +
                '<div class="chart-container"><div id="sumChartDeptActivity"></div></div></div>' +
                '<div class="panel-card"><div class="panel-card-hd">Top Games by Plays</div>' +
                '<div class="chart-container"><div id="sumChartTopGames"></div></div></div>' +
            '</div>' +


            '</div>';

        /* Top Games by Plays: horizontal bars */
        makeChart('sumChartTopGames', {
            opts: {
                dataSource: topGames,
                series: [{
                    argumentField: 'name', valueField: 'plays', type: 'bar',
                    color: '#1C2333',
                    label: { visible: false }
                }],
                rotated: true,
                commonAxisSettings: { tick: { visible: false }, label: { font: { size: 10, color: '#64748b' } } },
                argumentAxis: { grid: { visible: false } },
                valueAxis:    { grid: { visible: false } },
                legend:  { visible: false },
                tooltip: { enabled: true },
                size:    { height: 300 }
            }
        });

        /* Department Activity: bars auto-sized to number of depts */
        var deptData = getDealerGroups(state.companyId).map(function(dep) {
            return { name: dep.name, total: dep.total, active: dep.active };
        });
        makeChart('sumChartDeptActivity', {
            opts: {
                dataSource: deptData,
                series: [{
                    argumentField: 'name', valueField: 'total', type: 'bar',
                    name: 'Sessions', color: '#1C2333',
                    barWidth: 40,
                    label: { visible: false }
                }],
                rotated: true,
                commonAxisSettings: { tick: { visible: false }, label: { font: { size: 10, color: '#64748b' } } },
                argumentAxis: { grid: { visible: false } },
                valueAxis:    { grid: { visible: false } },
                legend:  { visible: false },
                tooltip: { enabled: true },
                size:    { height: 300 }
            }
        });

    }

    /* ── Shared: Trends panel renderer ─────────────────────── */

    function renderTrendsPanel(elId, gran, setGranFn) {
        var el = document.getElementById(elId);
        if (!el) return;

        var profile   = COMPANY_PROFILES[state.companyId] || COMPANY_PROFILES[DEFAULT_COMPANY_ID];
        var td        = getTrendDataForGranularity(state.companyId, gran);
        var totalPlrs = profile.players || 17;

        /* Participation rate = active players / total players * 100 */
        var partData = td.players.map(function(p) {
            return Math.round(p / totalPlrs * 100);
        });

        var showPts = td.labels.length <= 30;

        function granBtn(label, value) {
            var active = gran === value;
            return '<button class="plr-gran-btn' + (active ? ' active' : '') + '" onclick="' + setGranFn + '(\'' + value + '\')">' + label + '</button>';
        }

        /* Use elId (stripped to alphanumeric) as chart ID prefix */
        var pfx = elId.replace(/[^a-zA-Z0-9]/g, '');
        var id1 = pfx + 'Comb';
        var id2 = pfx + 'Plrs';
        var id3 = pfx + 'Part';

        el.innerHTML =
            '<div class="plr-gran-row">' +
                granBtn('Daily', 'daily') + granBtn('Weekly', 'weekly') + granBtn('Monthly', 'monthly') +
            '</div>' +
            '<div class="chart-card" style="margin-bottom:14px">' +
                '<div class="chart-card-hd">Participation and achievement over time</div>' +
                '<div class="chart-container"><div id="' + id1 + '"></div></div>' +
            '</div>' +
            '<div class="plr-charts-row">' +
                '<div class="chart-card"><div class="chart-card-hd">Sessions</div><div class="chart-container"><div id="' + id2 + '"></div></div></div>' +
                '<div class="chart-card"><div class="chart-card-hd">Active players</div><div class="chart-container"><div id="' + id3 + '"></div></div></div>' +
            '</div>';

        var combinedDs = td.labels.map(function(l, i) {
            return { arg: l, part: partData[i], achievement: td.acc[i] };
        });

        function smallDs(arr) {
            return td.labels.map(function(l, i) { return { arg: l, val: arr[i] }; });
        }

        var axisSettings = {
            grid: { color: '#f1f5f9', visible: true },
            tick: { visible: false },
            label: { font: { size: 11 } }
        };

        makeChart(id1, {
            opts: {
                dataSource: combinedDs,
                series: [
                    { argumentField: 'arg', valueField: 'part',        type: 'spline', color: '#1e293b', name: 'Participation',
                      point: { visible: showPts, size: 5, color: '#1e293b', hoverStyle: { size: 7 } } },
                    { argumentField: 'arg', valueField: 'achievement',  type: 'spline', color: '#22c55e', name: 'Achievement',
                      point: { visible: showPts, size: 5, color: '#22c55e', hoverStyle: { size: 7 } } }
                ],
                commonAxisSettings: axisSettings,
                argumentAxis: { grid: { visible: false } },
                legend: { visible: true, position: 'outside', horizontalAlignment: 'center', verticalAlignment: 'bottom' },
                tooltip: { enabled: true, shared: true, cornerRadius: 6 },
                size: { height: 280 }
            }
        });

        function smallCfg(ds) {
            return {
                opts: {
                    dataSource: ds,
                    series: [{ argumentField: 'arg', valueField: 'val', type: 'spline', color: '#1e293b',
                        point: { visible: showPts, size: 4, color: '#1e293b', hoverStyle: { size: 6 } } }],
                    commonAxisSettings: axisSettings,
                    argumentAxis: { grid: { visible: false } },
                    valueAxis: { min: 0 },
                    legend:  { visible: false },
                    tooltip: { enabled: true, cornerRadius: 6 },
                    size:    { height: 180 }
                }
            };
        }

        makeChart(id2, smallCfg(smallDs(td.plays)));
        makeChart(id3, smallCfg(smallDs(td.players)));
    }

    /* ── Render: Summary > Trends ────────────────────────────── */

    function renderSummaryTrends() {
        renderTrendsPanel('dashSummaryTrends', _trendsGranularity, 'setTrendsGranularity');
    }

    /* ── Render: Summary > Forecast ──────────────────────────── */

    /* ── Forecasts & anomalies helpers ──────────────────────── */

    function buildForecastMetrics(companyId) {
        var trend   = getMonthlyTrend(companyId);
        var reg     = COMPANY_REGISTERED[companyId] || (COMPANY_PROFILES[companyId] || COMPANY_PROFILES[DEFAULT_COMPANY_ID]).players;
        var lrP     = linearRegression(trend.players);
        var lrA     = linearRegression(trend.acc);
        var projP   = Math.max(0, Math.round(lrP.intercept + lrP.slope * trend.players.length));
        var partPct = Math.min(100, parseFloat((projP / reg * 100).toFixed(1)));
        var accPct  = parseFloat(Math.min(99, Math.max(20, lrA.intercept + lrA.slope * trend.acc.length)).toFixed(1));
        return { participation: partPct, accuracy: accPct };
    }

    function buildDailyAnomalies(companyId) {
        var m       = getMonthlyTrend(companyId);
        var profile = COMPANY_PROFILES[companyId] || COMPANY_PROFILES[DEFAULT_COMPANY_ID];
        var total   = profile.players;
        var li      = m.players.length - 1;
        var pi      = Math.max(0, li - 1);
        var today   = new Date(2026, 5, 17); /* fixed reference to keep data deterministic */

        var dailyPlayers = [], dailyDates = [];
        for (var d = 0; d < 30; d++) {
            var t   = d / 29;
            var v   = 0.78 + Math.abs(Math.sin(d * 13 + companyId * 7)) * 0.44;
            var dt  = new Date(today); dt.setDate(dt.getDate() - (29 - d));
            var iso = dt.getFullYear() + '-' +
                String(dt.getMonth() + 1).padStart(2, '0') + '-' +
                String(dt.getDate()).padStart(2, '0');
            dailyDates.push(iso);
            dailyPlayers.push(Math.max(0, Math.round((m.players[pi] + (m.players[li] - m.players[pi]) * t) * v)));
        }

        var avg = dailyPlayers.reduce(function(s, val) { return s + val; }, 0) / dailyPlayers.length;
        var threshold = avg * 0.9;

        var anomalies = [];
        dailyDates.forEach(function(date, i) {
            if (dailyPlayers[i] < threshold) {
                var missing = Math.max(1, Math.round(avg - dailyPlayers[i]));
                var pct     = Math.round(missing / total * 1000) / 10;
                anomalies.push({ date: date, pct: pct });
            }
        });
        return anomalies;
    }

    /* Combined forecasts + anomalies — used by index2.html's "Forecasts & anomalies" main tab panels */
    function renderForecastsAnomaliesPanel(elId, companyId) {
        var el = document.getElementById(elId);
        if (!el) return;
        var forecast  = buildForecastMetrics(companyId);
        var anomalies = buildDailyAnomalies(companyId);
        var anomalyRowsHtml = anomalies.length === 0
            ? '<p class="fc-no-anomalies"><i class="fas fa-circle-check"></i> No anomalies detected for this period.</p>'
            : anomalies.map(function(a) {
                return '<div class="fc-anomaly-row">' +
                    '<span class="fc-anomaly-date">' + esc(a.date) + '</span>' +
                    '<span class="fc-anomaly-pct">' + a.pct.toFixed(1) + '%</span>' +
                '</div>';
            }).join('');
        el.innerHTML =
            '<h3 class="fc-section-title">Forecasts</h3>' +
            '<div class="fc-card">' +
                '<div class="fc-card-title">Participation forecast</div>' +
                '<div class="fc-metrics-row">' +
                    '<div class="fc-metric"><div class="fc-metric-lbl">Participation rate</div><div class="fc-metric-val">' + forecast.participation + '%</div><div class="fc-metric-sub">Projected next period</div></div>' +
                    '<div class="fc-metric"><div class="fc-metric-lbl">Avg. accuracy</div><div class="fc-metric-val">' + forecast.accuracy + '%</div><div class="fc-metric-sub">Projected next period</div></div>' +
                '</div>' +
            '</div>' +
            '<h3 class="fc-section-title" style="margin-top:28px">Anomalies</h3>' +
            '<div class="fc-card">' +
                '<div class="fc-card-title">Anomalies detected</div>' +
                '<div class="fc-card-sub">Periods where participation dropped more than 10% below the period average</div>' +
                '<div class="fc-anomaly-list">' + anomalyRowsHtml + '</div>' +
            '</div>';
    }

    /* Split variants — used by index.html's separate Forecasts / Anomalies sub-tabs */
    function renderForecastsPanel(elId, companyId) {
        var el = document.getElementById(elId);
        if (!el) return;
        var forecast = buildForecastMetrics(companyId);
        el.innerHTML =
            '<h3 class="fc-section-title">Forecasts</h3>' +
            '<div class="fc-card">' +
                '<div class="fc-card-title">Participation forecast</div>' +
                '<div class="fc-metrics-row">' +
                    '<div class="fc-metric"><div class="fc-metric-lbl">Participation rate</div><div class="fc-metric-val">' + forecast.participation + '%</div><div class="fc-metric-sub">Projected next period</div></div>' +
                    '<div class="fc-metric"><div class="fc-metric-lbl">Avg. accuracy</div><div class="fc-metric-val">' + forecast.accuracy + '%</div><div class="fc-metric-sub">Projected next period</div></div>' +
                '</div>' +
            '</div>';
    }

    function renderSimpleAnomaliesPanel(elId, companyId) {
        var el = document.getElementById(elId);
        if (!el) return;
        var anomalies = buildDailyAnomalies(companyId);
        var anomalyRowsHtml = anomalies.length === 0
            ? '<p class="fc-no-anomalies"><i class="fas fa-circle-check"></i> No anomalies detected for this period.</p>'
            : anomalies.map(function(a) {
                return '<div class="fc-anomaly-row">' +
                    '<span class="fc-anomaly-date">' + esc(a.date) + '</span>' +
                    '<span class="fc-anomaly-pct">' + a.pct.toFixed(1) + '%</span>' +
                '</div>';
            }).join('');
        el.innerHTML =
            '<h3 class="fc-section-title">Anomalies</h3>' +
            '<div class="fc-card">' +
                '<div class="fc-card-title">Anomalies detected</div>' +
                '<div class="fc-card-sub">Periods where participation dropped more than 10% below the period average</div>' +
                '<div class="fc-anomaly-list">' + anomalyRowsHtml + '</div>' +
            '</div>';
    }

    function renderSummaryForecasts() {
        renderForecastsPanel('dashSummaryForecasts', state.companyId);
    }

    function renderSummaryForecastAnomaliesTab() {
        renderSimpleAnomaliesPanel('dashSummaryAnomalies', state.companyId);
    }

    function renderPlayersForecasts() {
        renderForecastsPanel('dashPlayersForecasts', state.companyId);
    }

    function renderSummaryForecast() {
        var el = document.getElementById('dashSummaryForecast');
        if (!el) return;
        var trend     = getMonthlyTrend(state.companyId);
        var lrPlays   = linearRegression(trend.plays);
        var lrPlayers = linearRegression(trend.players);
        var lrAcc     = linearRegression(trend.acc);
        var nF        = 3;
        var fLabels   = ['+1mo', '+2mo', '+3mo'];

        function buildDs(actuals, lr) {
            var allLabels = MONTHS_LABELS.concat(fLabels);
            var act  = actuals.concat([undefined, undefined, undefined]);
            var fore = actuals.slice(0, actuals.length - 1).map(function() { return undefined; });
            fore.push(actuals[actuals.length - 1]);
            for (var i = 0; i < nF; i++) fore.push(Math.max(0, Math.round(lr.intercept + lr.slope * (actuals.length + i))));
            return allLabels.map(function(l, idx) { return { arg: l, actual: act[idx], forecast: fore[idx] }; });
        }

        var projPlayers = Math.max(0, Math.round(lrPlayers.intercept + lrPlayers.slope * (trend.players.length + 2)));
        var projPlays   = Math.max(0, Math.round(lrPlays.intercept   + lrPlays.slope   * (trend.plays.length + 2)));
        var projAcc     = Math.min(99, Math.max(0, parseFloat((lrAcc.intercept + lrAcc.slope * (trend.acc.length + 2)).toFixed(1))));
        var growthPct   = trend.plays[0] > 0 ? Math.round((projPlays - trend.plays[0]) / trend.plays[0] * 100) : 0;
        var growthSign  = growthPct >= 0 ? '+' : '';
        var growthColor = growthPct >= 0 ? '#16a34a' : '#dc2626';
        var growthBg    = growthPct >= 0 ? '#dcfce7' : '#fee2e2';

        function fcastCard(icon, iconColor, iconBg, label, value, sub) {
            return '<div class="metric-card" style="min-height:0">' +
                '<div class="metric-card-body">' +
                '<div class="metric-lbl">' + label + '</div>' +
                '<div class="metric-val">' + value + '</div>' +
                '<div style="font-size:11px;color:var(--text-secondary);margin-top:2px">' + sub + '</div>' +
                '</div>' +
                '<div class="metric-icon" style="background:' + iconBg + ';color:' + iconColor + '"><i class="' + icon + '"></i></div>' +
                '</div>';
        }

        el.innerHTML =
            '<div class="summary-page">' +
            '<div class="panel-card"><div class="panel-card-hd">Play Volume Forecast' +
            '<span style="font-size:11px;color:#94a3b8;font-weight:400;margin-left:8px">· dashed = projected</span></div>' +
            '<div class="chart-container"><div id="chartSumForecast"></div></div></div>' +
            '</div>';

        makeChart('chartSumForecast', {
            opts: {
                dataSource: buildDs(trend.plays, lrPlays),
                series: [
                    { argumentField: 'arg', valueField: 'actual',   type: 'area', color: '#e11d48', opacity: 0.15, name: 'Actual',   point: { visible: true, size: 5 } },
                    { argumentField: 'arg', valueField: 'forecast', type: 'line', color: '#3182ce', dashStyle: 'dash', name: 'Forecast', point: { visible: true, size: 4 } }
                ],
                commonAxisSettings: {
                    grid: { color: 'rgba(200,200,200,0.25)', visible: true },
                    tick: { visible: false },
                    label: { font: { size: 10, color: '#64748b' } }
                },
                argumentAxis: {
                    grid: { visible: false },
                    constantLines: [{ value: MONTHS_LABELS[MONTHS_LABELS.length - 1], color: '#94a3b8', dashStyle: 'dash', width: 1,
                        label: { text: 'Today', position: 'outside', font: { size: 9, color: '#94a3b8' } } }]
                },
                legend:  { visible: true, horizontalAlignment: 'center', verticalAlignment: 'bottom', font: { size: 11, color: '#64748b' } },
                tooltip: { enabled: true },
                size:    { height: 320 }
            }
        });
    }

    /* ── Render: Summary > Anomalies ─────────────────────────── */

    window.toggleAnomalyDetail = function(id) {
        var body = document.getElementById(id);
        var btn  = document.querySelector('[data-anomaly-toggle="' + id + '"]');
        if (!body || !btn) return;
        var open = body.style.display !== 'none';
        body.style.display = open ? 'none' : '';
        var rows = body.querySelectorAll('tbody tr').length;
        btn.innerHTML = (open ? '<i class="fas fa-chevron-right"></i> Show details (' : '<i class="fas fa-chevron-down"></i> Hide details (') + rows + ' rows)';
    };

    function anomalySevRow(cards) {
        var high   = cards.filter(function(c) { return c.sev === 'high'; }).length;
        var medium = cards.filter(function(c) { return c.sev === 'medium'; }).length;
        var low    = cards.filter(function(c) { return c.sev === 'low'; }).length;
        function sevCard(count, label, color) {
            return '<div style="flex:1;background:#fff;border:1px solid var(--border);border-radius:12px;padding:20px 24px;text-align:center;box-shadow:0 1px 3px rgba(0,0,0,0.06)">' +
                '<div style="font-size:36px;font-weight:800;color:' + color + ';line-height:1">' + count + '</div>' +
                '<div style="font-size:13px;color:#64748b;margin-top:6px">' + label + '</div>' +
            '</div>';
        }
        return '<div style="display:flex;gap:16px;margin-bottom:20px">' +
            sevCard(high,   'High Severity',   '#e11d48') +
            sevCard(medium, 'Medium Severity', '#d97706') +
            sevCard(low,    'Low Severity',    '#2563eb') +
        '</div>';
    }

    function anomalyCard(sev, category, title, desc, detailId, detailHtml) {
        var toggleBtn = detailHtml
            ? '<button class="anomaly-toggle" data-anomaly-toggle="' + detailId + '" onclick="toggleAnomalyDetail(\'' + detailId + '\')">' +
              '<i class="fas fa-chevron-right"></i> Show details (' + (detailHtml.match(/<tr/g) || []).length + ' rows)</button>'
            : '';
        var detailBlock = detailHtml
            ? '<div id="' + detailId + '" class="anomaly-detail" style="display:none">' + detailHtml + '</div>'
            : '';
        return '<div class="anomaly-card ' + sev + '">' +
            '<div class="anomaly-card-hd">' +
                '<i class="fas fa-triangle-exclamation anomaly-card-icon"></i>' +
                '<span class="anomaly-badge ' + sev + '">' + sev + '</span>' +
                '<span class="anomaly-category">' + esc(category) + '</span>' +
            '</div>' +
            '<div class="anomaly-title">' + esc(title) + '</div>' +
            '<div class="anomaly-desc">' + esc(desc) + '</div>' +
            toggleBtn + detailBlock +
        '</div>';
    }

    function renderSummaryAnomalies() {
        var el = document.getElementById('dashSummaryAnomalies');
        if (!el) return;
        var profile  = COMPANY_PROFILES[state.companyId] || COMPANY_PROFILES[DEFAULT_COMPANY_ID];
        var reg      = COMPANY_REGISTERED[state.companyId] || profile.players;
        var active   = profile.players;
        var inactive = Math.max(0, reg - active);
        var depts    = getDeptPlayers(state.companyId);
        var trend    = getMonthlyTrend(state.companyId);

        var deptsZero    = depts.filter(function(d) { return d.active === 0; });
        var maxPlay      = Math.max.apply(null, trend.plays);
        var lastPlay     = trend.plays[trend.plays.length - 1];
        var dropPct      = maxPlay > 0 ? (maxPlay - lastPlay) / maxPlay * 100 : 0;

        var cards = [];

        /* Inactive players */
        if (inactive > 0) {
            var inactivePlayers = INACTIVE_PLAYERS[state.companyId] || INACTIVE_PLAYERS[DEFAULT_COMPANY_ID] || [];
            var pct = (inactive / reg * 100).toFixed(1);
            var tableRows = inactivePlayers.map(function(p) {
                return '<tr><td>' + esc(p.firstName + ' ' + p.lastName) + '</td><td>' + esc(p.email) + '</td><td>' + esc(p.dealer) + '</td></tr>';
            }).join('');
            var tableHtml = tableRows
                ? '<table class="anomaly-table"><thead><tr><th>Name</th><th>Email</th><th>Dealer</th></tr></thead><tbody>' + tableRows + '</tbody></table>'
                : '';
            cards.push(anomalyCard(
                'medium', 'Engagement',
                inactive + ' players (' + pct + '%) are inactive — re-engagement needed',
                'Send personalised re-engagement messages or reset player streaks to incentivise return.',
                'anomalyDetailInactive', tableHtml
            ));
        }

        /* Departments with zero active */
        if (deptsZero.length > 0) {
            var deptRows = deptsZero.map(function(d) {
                return '<tr><td>' + esc(d.name) + '</td><td>' + d.total + '</td><td>0</td></tr>';
            }).join('');
            var deptTableHtml = '<table class="anomaly-table"><thead><tr><th>Department</th><th>Enrolled</th><th>Active</th></tr></thead><tbody>' + deptRows + '</tbody></table>';
            cards.push(anomalyCard(
                'medium', 'Departments',
                deptsZero.length + ' department' + (deptsZero.length > 1 ? 's' : '') + ' with zero active players',
                'Reach out to department managers and promote the platform.',
                'anomalyDetailDepts', deptTableHtml
            ));
        }

        /* Play volume drop */
        if (dropPct > 25) {
            cards.push(anomalyCard(
                'high', 'Volume',
                'Play volume dropped ' + dropPct.toFixed(1) + '% from peak',
                'Investigate potential causes and consider launching a new incentive.',
                'anomalyDetailVolume', ''
            ));
        }

        var tagged = cards.map(function(html, idx) { return { sev: idx === 2 ? 'high' : 'medium', html: html }; });
        var bodyHtml = cards.length === 0
            ? '<div class="anomaly-ok"><i class="fas fa-circle-check"></i> No anomalies detected for this period.</div>'
            : cards.join('');

        el.innerHTML = '<div class="summary-page">' + anomalySevRow(tagged) + '<div class="anomaly-list">' + bodyHtml + '</div></div>';
    }

    /* ── Render: Players > Anomalies ────────────────────────── */

    function renderPlayersAnomalies() {
        var el = document.getElementById('dashPlayersAnomalies');
        if (!el) return;
        var profile  = COMPANY_PROFILES[state.companyId] || COMPANY_PROFILES[DEFAULT_COMPANY_ID];
        var reg      = COMPANY_REGISTERED[state.companyId] || profile.players;
        var active   = profile.players;
        var inactive = Math.max(0, reg - active);
        var players  = COMPANY_PLAYERS[state.companyId] || COMPANY_PLAYERS[DEFAULT_COMPANY_ID];
        var trend    = getMonthlyTrend(state.companyId);
        var maxPlay  = Math.max.apply(null, trend.plays);
        var lastPlay = trend.plays[trend.plays.length - 1];
        var dropPct  = maxPlay > 0 ? (maxPlay - lastPlay) / maxPlay * 100 : 0;

        var lowAccPlayers = players.filter(function(p) { return p.accuracy < 65; });
        var cards = [];
        var tagged = [];

        /* Inactive players */
        if (inactive > 0) {
            var inactivePlayers = INACTIVE_PLAYERS[state.companyId] || INACTIVE_PLAYERS[DEFAULT_COMPANY_ID] || [];
            var pct = (inactive / reg * 100).toFixed(1);
            var tableRows = inactivePlayers.map(function(p) {
                return '<tr><td>' + esc(p.firstName + ' ' + p.lastName) + '</td><td>' + esc(p.email) + '</td><td>' + esc(p.dealer) + '</td></tr>';
            }).join('');
            var tbl = tableRows ? '<table class="anomaly-table"><thead><tr><th>Name</th><th>Email</th><th>Dealer</th></tr></thead><tbody>' + tableRows + '</tbody></table>' : '';
            cards.push(anomalyCard('medium', 'Engagement',
                inactive + ' players (' + pct + '%) are inactive — re-engagement needed',
                'Send personalised re-engagement messages or reset player streaks to incentivise return.',
                'plrAnomalyInactive', tbl));
            tagged.push({ sev: 'medium' });
        }

        /* Low accuracy players */
        if (lowAccPlayers.length > 0) {
            var accRows = lowAccPlayers.map(function(p) {
                return '<tr><td>' + esc(p.name) + '</td><td>' + esc(p.dept) + '</td><td>' + p.accuracy.toFixed(1) + '%</td></tr>';
            }).join('');
            var accTbl = '<table class="anomaly-table"><thead><tr><th>Player</th><th>Dept</th><th>Accuracy</th></tr></thead><tbody>' + accRows + '</tbody></table>';
            cards.push(anomalyCard('medium', 'Accuracy',
                lowAccPlayers.length + ' player' + (lowAccPlayers.length > 1 ? 's' : '') + ' with accuracy below 65%',
                'Review game difficulty or provide additional coaching for these players.',
                'plrAnomalyAcc', accTbl));
            tagged.push({ sev: 'medium' });
        }

        /* Play volume drop */
        if (dropPct > 25) {
            var sev = dropPct > 40 ? 'high' : 'medium';
            cards.push(anomalyCard(sev, 'Trends',
                'Play volume dropped ' + dropPct.toFixed(1) + '% from peak',
                'Investigate whether there were platform issues or engagement drops. Consider a re-engagement campaign.',
                'plrAnomalyVolume', ''));
            tagged.push({ sev: sev });
        }

        var bodyHtml = cards.length === 0
            ? '<div class="anomaly-ok"><i class="fas fa-circle-check"></i> No player anomalies detected for this period.</div>'
            : cards.join('');

        el.innerHTML = '<div class="summary-page">' + anomalySevRow(tagged) + '<div class="anomaly-list">' + bodyHtml + '</div></div>';
    }

    /* ── Render: Games > Anomalies ──────────────────────────── */

    function renderGamesAnomalies() {
        var el = document.getElementById('dashGamesAnomalies');
        if (!el) return;
        var d       = getPeriodData(state.companyId, state.period);
        var trend   = getMonthlyTrend(state.companyId);
        var maxPlay = Math.max.apply(null, trend.plays);
        var lastPlay = trend.plays[trend.plays.length - 1];
        var dropPct  = maxPlay > 0 ? (maxPlay - lastPlay) / maxPlay * 100 : 0;

        var lowAccGames = BASE_GAMES.map(function(name, i) {
            return { name: name, accuracy: d.perf[i] ? d.perf[i].accuracy : 0, plays: d.perf[i] ? d.perf[i].plays : 0 };
        }).filter(function(g) { return g.accuracy < 60; });

        var zeroGames = BASE_GAMES.map(function(name, i) {
            return { name: name, plays: d.perf[i] ? d.perf[i].plays : 0 };
        }).filter(function(g) { return g.plays === 0; });

        var cards = [];
        var tagged = [];

        if (lowAccGames.length > 0) {
            var accRows = lowAccGames.map(function(g) {
                return '<tr><td>' + esc(g.name) + '</td><td>' + g.accuracy.toFixed(1) + '%</td><td>' + g.plays + '</td></tr>';
            }).join('');
            var tbl = '<table class="anomaly-table"><thead><tr><th>Game</th><th>Accuracy</th><th>Plays</th></tr></thead><tbody>' + accRows + '</tbody></table>';
            cards.push(anomalyCard('medium', 'Accuracy',
                lowAccGames.length + ' game' + (lowAccGames.length > 1 ? 's' : '') + ' with answer accuracy below 60%',
                'Review question difficulty or content relevance for these games.',
                'gmsAnomalyAcc', tbl));
            tagged.push({ sev: 'medium' });
        }

        if (zeroGames.length > 0) {
            var zRows = zeroGames.map(function(g) { return '<tr><td>' + esc(g.name) + '</td></tr>'; }).join('');
            var zTbl  = '<table class="anomaly-table"><thead><tr><th>Game</th></tr></thead><tbody>' + zRows + '</tbody></table>';
            cards.push(anomalyCard('high', 'Engagement',
                zeroGames.length + ' game' + (zeroGames.length > 1 ? 's' : '') + ' with zero plays this period',
                'Check if these games are published and accessible to players.',
                'gmsAnomalyZero', zTbl));
            tagged.push({ sev: 'high' });
        }

        if (dropPct > 25) {
            var sev = dropPct > 40 ? 'high' : 'medium';
            cards.push(anomalyCard(sev, 'Trends',
                'Overall play volume dropped ' + dropPct.toFixed(1) + '% from peak',
                'Investigate whether there were platform issues or engagement drops. Consider a re-engagement campaign.',
                'gmsAnomalyVolume', ''));
            tagged.push({ sev: sev });
        }

        var bodyHtml = cards.length === 0
            ? '<div class="anomaly-ok"><i class="fas fa-circle-check"></i> No game anomalies detected for this period.</div>'
            : cards.join('');
        el.innerHTML = '<div class="summary-page">' + anomalySevRow(tagged) + '<div class="anomaly-list">' + bodyHtml + '</div></div>';
    }

    /* ── Render: Departments > Anomalies ─────────────────────── */

    function renderDeptAnomalies() {
        var el = document.getElementById('dashDeptAnomalies');
        if (!el) return;
        var depts    = getDeptPlayers(state.companyId);
        var trend    = getMonthlyTrend(state.companyId);
        var maxPlay  = Math.max.apply(null, trend.plays);
        var lastPlay = trend.plays[trend.plays.length - 1];
        var dropPct  = maxPlay > 0 ? (maxPlay - lastPlay) / maxPlay * 100 : 0;

        var zeroDepts = depts.filter(function(d) { return d.active === 0; });
        var lowDepts  = depts.filter(function(d) { return d.active > 0 && d.total > 0 && (d.active / d.total) < 0.5; });

        var cards = [];
        var tagged = [];

        if (zeroDepts.length > 0) {
            var zRows = zeroDepts.map(function(d) {
                return '<tr><td>' + esc(d.name) + '</td><td>' + d.total + '</td><td>0</td></tr>';
            }).join('');
            var zTbl = '<table class="anomaly-table"><thead><tr><th>Department</th><th>Enrolled</th><th>Active</th></tr></thead><tbody>' + zRows + '</tbody></table>';
            cards.push(anomalyCard('high', 'Participation',
                zeroDepts.length + ' department' + (zeroDepts.length > 1 ? 's' : '') + ' with zero active players',
                'Reach out to department managers and promote the platform.',
                'dptAnomalyZero', zTbl));
            tagged.push({ sev: 'high' });
        }

        if (lowDepts.length > 0) {
            var lRows = lowDepts.map(function(d) {
                var pct = Math.round(d.active / d.total * 100);
                return '<tr><td>' + esc(d.name) + '</td><td>' + d.active + '/' + d.total + '</td><td>' + pct + '%</td></tr>';
            }).join('');
            var lTbl = '<table class="anomaly-table"><thead><tr><th>Department</th><th>Active/Total</th><th>Rate</th></tr></thead><tbody>' + lRows + '</tbody></table>';
            cards.push(anomalyCard('medium', 'Participation',
                lowDepts.length + ' department' + (lowDepts.length > 1 ? 's' : '') + ' with participation below 50%',
                'Consider targeted communications or incentives to boost engagement in these departments.',
                'dptAnomalyLow', lTbl));
            tagged.push({ sev: 'medium' });
        }

        if (dropPct > 25) {
            var sev = dropPct > 40 ? 'high' : 'medium';
            cards.push(anomalyCard(sev, 'Trends',
                'Department play volume dropped ' + dropPct.toFixed(1) + '% from peak',
                'Review which departments are contributing to the decline and investigate root causes.',
                'dptAnomalyVolume', ''));
            tagged.push({ sev: sev });
        }

        var bodyHtml = cards.length === 0
            ? '<div class="anomaly-ok"><i class="fas fa-circle-check"></i> No department anomalies detected for this period.</div>'
            : cards.join('');
        el.innerHTML = '<div class="summary-page">' + anomalySevRow(tagged) + '<div class="anomaly-list">' + bodyHtml + '</div></div>';
    }

    /* ── Render: Departments > Forecasts & anomalies ─────────── */

    function renderDeptForecastsAnomalies() {
        var el = document.getElementById('dashDeptForecastAnomalies');
        if (!el) return;

        var depts      = getDeptPlayers(state.companyId);
        var totalAct   = depts.reduce(function(s,d){return s+d.active;},0);
        var totalUsr   = depts.reduce(function(s,d){return s+d.total;},0);
        var avgPart    = totalUsr > 0 ? totalAct / totalUsr * 100 : 0;
        var threshold  = Math.max(0, avgPart - 15);

        var forecastRows = depts.map(function(d) {
            var part = d.total > 0 ? d.active / d.total * 100 : 0;
            /* deterministic growth: 1.5–4% above current participation */
            var growth = 1.5 + (d.name.charCodeAt(0) % 5) * 0.6;
            var proj   = Math.min(100, part + growth).toFixed(1);
            return '<div style="display:flex;justify-content:space-between;align-items:center;' +
                    'padding:12px 0;border-bottom:1px solid #f1f5f9;last-child:border-bottom:none">' +
                '<span style="font-size:14px;color:#374151">' + esc(d.name) + '</span>' +
                '<span><strong style="font-size:15px;color:#0f172a;margin-right:6px">' + proj + '%</strong>' +
                    '<span style="font-size:13px;color:#94a3b8">Projected next period</span></span>' +
            '</div>';
        }).join('');

        var underperforming = depts.filter(function(d) {
            return d.total > 0 && (d.active / d.total * 100) < threshold;
        });

        var anomalyContent;
        if (underperforming.length === 0) {
            anomalyContent = '<p style="font-size:14px;color:#1e40af;margin:12px 0 0">No underperforming departments in this period</p>';
        } else {
            anomalyContent = '<div style="margin-top:12px">' +
                underperforming.map(function(d) {
                    var pct = (d.active / d.total * 100).toFixed(1);
                    var diff = (avgPart - d.active / d.total * 100).toFixed(1);
                    return '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #f1f5f9">' +
                        '<span style="font-size:14px;color:#374151">' + esc(d.name) + '</span>' +
                        '<span style="font-size:13px;color:#ef4444">' + pct + '% <span style="color:#94a3b8">(' + diff + '% below avg)</span></span>' +
                    '</div>';
                }).join('') +
            '</div>';
        }

        el.innerHTML =
            '<h3 class="fc-section-title">Forecasts</h3>' +
            '<div class="fc-card">' +
                '<div class="fc-card-title">Participation rate forecast</div>' +
                '<div style="margin-top:4px">' + forecastRows + '</div>' +
            '</div>' +
            '<h3 class="fc-section-title" style="margin-top:28px">Anomalies</h3>' +
            '<div class="fc-card">' +
                '<div class="fc-card-title">Underperforming departments</div>' +
                '<div class="fc-card-sub">Departments with participation rate more than 15% below company average</div>' +
                anomalyContent +
            '</div>';
    }

    function renderDeptForecasts() {
        var el = document.getElementById('dashDeptForecasts');
        if (!el) return;
        var depts = getDeptPlayers(state.companyId);
        var forecastRows = depts.map(function(d) {
            var part   = d.total > 0 ? d.active / d.total * 100 : 0;
            var growth = 1.5 + (d.name.charCodeAt(0) % 5) * 0.6;
            var proj   = Math.min(100, part + growth).toFixed(1);
            return '<div style="display:flex;justify-content:space-between;align-items:center;' +
                    'padding:12px 0;border-bottom:1px solid #f1f5f9">' +
                '<span style="font-size:14px;color:#374151">' + esc(d.name) + '</span>' +
                '<span><strong style="font-size:15px;color:#0f172a;margin-right:6px">' + proj + '%</strong>' +
                    '<span style="font-size:13px;color:#94a3b8">Projected next period</span></span>' +
            '</div>';
        }).join('');
        el.innerHTML =
            '<h3 class="fc-section-title">Forecasts</h3>' +
            '<div class="fc-card">' +
                '<div class="fc-card-title">Participation rate forecast</div>' +
                '<div style="margin-top:4px">' + forecastRows + '</div>' +
            '</div>';
    }

    /* ── Render: shared Trends charts (Players / Games / Dept) ── */

    function renderTrendsCharts(containerId, prefix) {
        var gran  = containerId === 'dashGamesTrends' ? _gamesTrendsGran : _deptTrendsGran;
        var setFn = containerId === 'dashGamesTrends' ? 'setGamesTrendsGran' : 'setDeptTrendsGran';
        renderTrendsPanel(containerId, gran, setFn);
    }

    /* ── Render: Players > Trends ───────────────────────────── */

    function renderPlayersTrends() {
        renderTrendsPanel('dashPlayersTrends', _playerTrendsGran, 'setPlayerTrendsGran');
    }

    /* ── Render: Games > Overview ────────────────────────────── */

    function fmtGamePlayTime(ptMult) {
        var totalSec = Math.round(ptMult * 420); /* 7-min base */
        var h = Math.floor(totalSec / 3600);
        var m = Math.floor((totalSec % 3600) / 60);
        var s = totalSec % 60;
        return h + 'h:' + String(m).padStart(2,'0') + 'm:' + String(s).padStart(2,'0') + 's';
    }

    function renderGamesOverview() {
        var d       = getPeriodData(state.companyId, state.period);
        var profile = COMPANY_PROFILES[state.companyId] || COMPANY_PROFILES[DEFAULT_COMPANY_ID];
        var el      = document.getElementById('dashGamesOverview');
        if (!d || !el) return;

        /* Build reverse map: game index → topic name */
        var idxToTopic = {};
        GAME_TOPICS.forEach(function(tg) {
            tg.indices.forEach(function(i) { idxToTopic[i] = tg.topic; });
        });

        /* Build flat rows */
        var allGameRows = BASE_GAMES.map(function(name, i) {
            var p        = d.perf[i] || { plays: 0, accuracy: 0, playTime: 1 };
            var attempted = Math.min(profile.players, Math.max(p.plays > 0 ? 1 : 0, Math.round(p.plays / 15)));
            return {
                name:       name,
                topic:      idxToTopic[i] || 'No topic',
                assigned:   profile.players,
                attempted:  attempted,
                completion: parseFloat(p.accuracy.toFixed(1)),
                accuracy:   parseFloat(p.accuracy.toFixed(1)),
                playTime:   fmtGamePlayTime(p.playTime)
            };
        });

        el.innerHTML =
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:16px">' +
                '<div class="plr-search-bar" style="flex:0 0 260px">' +
                    '<input class="plr-search-input" id="gmsOvSearch" placeholder="Search..." oninput="gmsOvFilter()">' +
                    '<button class="plr-search-btn" onclick="gmsOvFilter()"><i class="fas fa-search"></i></button>' +
                '</div>' +
            '</div>' +
            '<div id="gmsGrid" class="dash-grid"></div>';

        function filteredRows() {
            var q = (document.getElementById('gmsOvSearch').value || '').toLowerCase();
            return q ? allGameRows.filter(function(r) {
                return r.name.toLowerCase().indexOf(q) >= 0 || r.topic.toLowerCase().indexOf(q) >= 0;
            }) : allGameRows;
        }

        function rebuildGrid() {
            var inst = $('#gmsGrid').data('dxDataGrid');
            if (inst) inst.option('dataSource', filteredRows());
        }

        window.gmsOvFilter = rebuildGrid;

        $('#gmsGrid').dxDataGrid({
            dataSource: allGameRows,
            columnAutoWidth: false,
            showBorders: false,
            showColumnLines: false,
            showRowLines: true,
            rowAlternationEnabled: false,
            hoverStateEnabled: true,
            paging: { pageSize: 20 },
            pager: { showPageSizeSelector: false, showInfo: true },
            columns: [
                { dataField: 'name',       caption: 'Game Name',      minWidth: 200 },
                { dataField: 'assigned',   caption: 'Assigned',       width: 110, alignment: 'left' },
                { dataField: 'attempted',  caption: 'Attempted',      width: 110, alignment: 'left' },
                { dataField: 'completion', caption: 'Completion %',   width: 130, alignment: 'left',
                  cellTemplate: function(container, options) {
                      $('<span>').text(options.value + '%').appendTo(container);
                  }
                },
                { dataField: 'accuracy',   caption: 'Avg. Accuracy',  width: 130, alignment: 'left',
                  cellTemplate: function(container, options) {
                      $('<span>').text(options.value + '%').appendTo(container);
                  }
                },
                { dataField: 'playTime',   caption: 'Avg. Play Time', width: 140, alignment: 'left',
                  cellTemplate: function(container, options) {
                      $('<span>').css({ color: '#64748b' }).text(options.value).appendTo(container);
                  }
                }
            ]
        });
    }

    /* ── Render: Players > Overview ──────────────────────────── */

    function getLeague(xp) {
        if (xp >= 20000) return 'Diamond';
        if (xp >= 5000)  return 'Gold';
        if (xp >= 2000)  return 'Silver';
        return 'Bronze';
    }

    function getPlayerLastPlay(playerName, sessions) {
        if (!sessions) return null;
        var MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var seed = (playerName ? playerName.charCodeAt(0) : 65) + (playerName ? playerName.charCodeAt(playerName.length - 1) : 0);
        var daysAgo = (seed % 16) + 1;
        var ref = new Date(2026, 5, 18); /* June 18 2026 */
        ref.setDate(ref.getDate() - daysAgo);
        var d = ref.getDate();
        return (d < 10 ? '0' + d : '' + d) + ' ' + MON[ref.getMonth()] + ' ' + ref.getFullYear();
    }

    function devSpotlightCard(rank, name, dept, xp) {
        return '<div class="ov-kpi-card" style="border-left-color:#1C2333;position:relative">' +
            '<div style="position:absolute;top:16px;right:18px;font-size:22px;font-weight:700;color:#1C2333;letter-spacing:-0.5px">#' + rank + '</div>' +
            '<div style="margin-top:4px">' +
                '<div class="ov-kpi-val" style="font-size:20px;letter-spacing:0.03em;padding-right:44px">' + esc(name) + '</div>' +
                '<div style="font-size:12px;color:#94a3b8;margin-top:2px;margin-bottom:10px">' + esc(dept) + '</div>' +
                '<div class="ov-kpi-trend"><span class="ov-kpi-pill">' + xp.toLocaleString() + ' pts</span></div>' +
            '</div>' +
        '</div>';
    }

    function renderPlayersOverview() {
        var players = COMPANY_PLAYERS[state.companyId] || COMPANY_PLAYERS[DEFAULT_COMPANY_ID];
        var profile = COMPANY_PROFILES[state.companyId] || COMPANY_PROFILES[DEFAULT_COMPANY_ID];
        var d       = getPeriodData(state.companyId, state.period);
        var reg     = COMPANY_REGISTERED[state.companyId] || profile.players;
        var totalInact = Math.max(0, reg - profile.players);
        var allD    = getPeriodData(state.companyId, 'All Months');
        var scale   = allD && allD.plays > 0 ? d.plays / allD.plays : 1;

        /* Spotlight top 3 */
        var top3 = players.slice(0, 3);
        var spotlightHtml = '<div class="player-spotlight-row">' +
            top3.map(function(p, i) {
                return devSpotlightCard(i + 1, p.name, p.dept, Math.round(p.points * scale));
            }).join('') +
        '</div>';

        /* Two charts */
        var chartsHtml = '<div class="plr-charts-row">' +
            '<div class="chart-card"><div class="chart-card-hd">Participation by dealer</div><div class="chart-container"><div id="plrDealerChart"></div></div></div>' +
            '<div class="chart-card"><div class="chart-card-hd">Active players by department</div><div class="chart-container"><div id="plrDeptChart"></div></div></div>' +
        '</div>';

        var gridHtml =
            '<div class="plr-search-row">' +
                '<div class="plr-search-bar">' +
                    '<input type="text" class="plr-search-input" id="plrSearchInput" placeholder="Search..." oninput="window.plrSearch()">' +
                    '<button class="plr-search-btn" onclick="window.plrSearch()"><i class="fas fa-search"></i></button>' +
                '</div>' +
            '</div>' +
            '<div class="dash-table-card" style="margin-top:8px">' +
                '<div id="dashPlayersGrid" class="dash-grid"></div>' +
            '</div>';

        /* Secondary nav — only injected when Players is a sub-tab (index2.html),
           not when it is a standalone main tab with its own segmented sub-tabs (index.html) */
        var needsSecNav = !document.querySelector('[data-panel="players"]');
        var secNavHtml = needsSecNav
            ? '<div class="plr-sec-nav">' +
                  '<button class="plr-sec-tab" onclick="window.playerSection(\'inactive\')">Inactive</button>' +
                  '<button class="plr-sec-tab" onclick="window.playerSection(\'gamecoverage\')">Game coverage</button>' +
                  '<button class="plr-sec-tab" onclick="window.playerSection(\'leave\')">Leave &amp; exclusions</button>' +
              '</div>'
            : '';
        var secPanelsHtml = needsSecNav
            ? '<div id="dashPlayersInactive"   class="plr-sec-panel" hidden></div>' +
              '<div id="dashPlayersGamesPlayed" class="plr-sec-panel" hidden></div>' +
              '<div id="dashPlayersLeave"       class="plr-sec-panel" hidden></div>'
            : '';

        document.getElementById('dashPlayersPanel').innerHTML =
            secNavHtml +
            '<div id="plrOverviewContent">' + spotlightHtml + chartsHtml + gridHtml + '</div>' +
            secPanelsHtml;

        window.playerSection = function(key) {
            var overviewEl = document.getElementById('plrOverviewContent');
            var subBar = document.querySelector('.dash-subtabs-bar');
            ['dashPlayersInactive', 'dashPlayersGamesPlayed', 'dashPlayersLeave'].forEach(function(id) {
                var el = document.getElementById(id);
                if (el) el.hidden = true;
            });
            document.querySelectorAll('.plr-sec-tab').forEach(function(b) { b.classList.remove('active'); });
            if (key === 'overview') {
                if (overviewEl) overviewEl.hidden = false;
                if (subBar) subBar.classList.remove('plr-in-subsection');
            } else {
                if (overviewEl) overviewEl.hidden = true;
                if (subBar) subBar.classList.add('plr-in-subsection');
                var idMap = { inactive: 'dashPlayersInactive', gamecoverage: 'dashPlayersGamesPlayed', leave: 'dashPlayersLeave' };
                var target = document.getElementById(idMap[key]);
                if (target) target.hidden = false;
                document.querySelectorAll('.plr-sec-tab').forEach(function(b) {
                    if ((b.getAttribute('onclick') || '').indexOf("'" + key + "'") !== -1) b.classList.add('active');
                });
            }
        };

        /* Dealer participation chart */
        var dealers = COMPANY_DEALERS[state.companyId] || [{ name: profile.name + ' — Main Office', total: profile.players, active: profile.players, players: profile.players, avgAcc: d.avgAcc, points: 0 }];
        var dealerDs = dealers.map(function(dl) {
            var tot = dl.total || dl.players || 1;
            var act = dl.active !== undefined ? dl.active : dl.players;
            var label = dl.name.replace(/^[^-]+ - /, '');
            return { name: label, activePct: tot > 0 ? Math.round(act / tot * 100) : 0 };
        }).filter(function(x) { return x.activePct > 0; });

        makeChart('plrDealerChart', {
            opts: {
                dataSource: dealerDs,
                series: [{ argumentField: 'name', valueField: 'activePct', type: 'bar', color: '#1e293b', cornerRadius: 0 }],
                rotated: false,
                commonAxisSettings: { tick: { visible: false }, label: { font: { size: 11, color: '#64748b' } } },
                argumentAxis: { grid: { visible: false } },
                valueAxis: {
                    min: 0, max: 100,
                    grid: { color: 'rgba(200,200,200,0.25)', visible: true },
                    label: { customizeText: function(i) { return i.valueText + '%'; } }
                },
                legend: { visible: false },
                tooltip: { enabled: true, customizeTooltip: function(i) { return { text: i.argumentText + ': ' + i.value + '%' }; } },
                size: { height: 200 }
            }
        });

        /* Active players by department chart */
        var deptMap = {};
        players.forEach(function(p) { deptMap[p.dept] = (deptMap[p.dept] || 0) + 1; });
        var deptDs = Object.keys(deptMap).map(function(k) { return { dept: k, count: deptMap[k] }; });

        makeChart('plrDeptChart', {
            opts: {
                dataSource: deptDs,
                series: [{ argumentField: 'dept', valueField: 'count', type: 'bar', color: '#1e293b', cornerRadius: 0 }],
                rotated: true,
                commonAxisSettings: { tick: { visible: false }, label: { font: { size: 11, color: '#64748b' } } },
                argumentAxis: { grid: { visible: false } },
                valueAxis: { min: 0, grid: { visible: false } },
                legend: { visible: false },
                tooltip: { enabled: true },
                size: { height: 200 }
            }
        });

        /* dxDataGrid */
        var gridData = players.map(function(p) {
            var xp       = Math.round(p.points * scale);
            var sessions = Math.max(1, Math.round(p.games * scale));
            var scoreSeed = Math.abs(Math.sin((p.name.charCodeAt(0) + p.name.length) * 1.9));
            var scoreVal  = parseFloat(Math.min(99.9, Math.max(0, p.accuracy * 0.8 + scoreSeed * 28)).toFixed(1));
            return {
                name:       p.name,
                department: p.dept,
                passRate:   sessions > 0 ? p.accuracy : null,
                score:      sessions > 0 ? scoreVal    : null,
                sessions:   sessions,
                xp:         xp,
                league:     sessions > 0 ? getLeague(xp) : '',
                lastPlay:   getPlayerLastPlay(p.name, sessions)
            };
        });

        window._plrGridData = gridData;

        $('#dashPlayersGrid').dxDataGrid({
            dataSource: gridData,
            showBorders: false,
            showRowLines: true,
            showColumnLines: false,
            rowAlternationEnabled: false,
            hoverStateEnabled: true,
            searchPanel: { visible: false, width: 220 },
            columns: [
                { dataField: 'name', caption: 'Name', width: 220,
                    cellTemplate: function(container, options) {
                        var parts    = String(options.value).trim().split(/\s+/);
                        var initials = parts.map(function(w) { return w[0] || ''; }).slice(0, 2).join('').toUpperCase();
                        var $cell = $('<span>').addClass('plr-name-cell');
                        $('<span>').addClass('plr-avatar').text(initials).appendTo($cell);
                        $('<span>').addClass('plr-name-link').text(options.value).appendTo($cell);
                        $cell.appendTo(container);
                    } },
                { dataField: 'department', caption: 'Department', minWidth: 160 },
                { dataField: 'passRate',   caption: 'Pass rate',  width: 90, alignment: 'left',
                    customizeText: function(info) { return info.value === null ? '—' : parseFloat(info.value).toFixed(1) + '%'; } },
                { dataField: 'score',      caption: 'Score',      width: 90, alignment: 'left',
                    customizeText: function(info) { return info.value === null ? '—' : parseFloat(info.value).toFixed(1) + '%'; } },
                { dataField: 'sessions',   caption: 'Sessions',   width: 90, alignment: 'left' },
                { dataField: 'xp',         caption: 'XP',         width: 90, alignment: 'left',
                    customizeText: function(info) { return Number(info.value).toLocaleString(); } },
                { dataField: 'league', caption: 'League', width: 100, alignment: 'center',
                    cssClass: 'plr-league-col',
                    cellTemplate: function(container, options) {
                        if (!options.value) return;
                        $('<span>').addClass('plr-league-badge plr-league-' + String(options.value).toLowerCase()).text(options.value).appendTo(container);
                    } },
                { dataField: 'lastPlay', caption: 'Last play', width: 110,
                    customizeText: function(info) { return info.value || '—'; } },
                { caption: '', width: 44, allowSorting: false, allowFiltering: false,
                    cellTemplate: function(container) {
                        $('<span>').addClass('plr-action-dots').html('&#8942;').appendTo(container);
                    } }
            ],
            paging:       { enabled: false },
            sorting:      { mode: 'single' },
            headerFilter: { visible: false }
        });

        window.plrSearch = function() {
            var q = document.getElementById('plrSearchInput');
            var inst = $('#dashPlayersGrid').dxDataGrid('instance');
            if (q && inst) inst.option('searchPanel.text', q.value);
        };
    }

    /* ── Game-a-Day helpers ──────────────────────────────────── */

    var GAD_WEEKS = 12;
    var GAD_DAYS  = 5;

    function gadWeeks(player, companyId) {
        var compliance = (player.played || 0) / 17;
        var weeks = [];
        for (var w = 0; w < GAD_WEEKS; w++) {
            var seed = Math.abs(Math.sin((player.name.charCodeAt(0) || 65) + w * 13 + companyId * 7));
            var raw  = seed * 0.35 + compliance * 0.65;
            var plays = raw > 0.85 ? GAD_DAYS :
                        raw > 0.65 ? 4 :
                        raw > 0.48 ? 3 :
                        raw > 0.32 ? 2 :
                        raw > 0.18 ? 1 : 0;
            weeks.push(Math.max(0, Math.min(GAD_DAYS, plays)));
        }
        return weeks;
    }

    function gadCellStyle(plays) {
        if (plays >= GAD_DAYS) return 'background:#dcfce7;color:#15803d';
        if (plays > 0)         return 'background:#fef3c7;color:#b45309';
        return 'background:#fee2e2;color:#b91c1c';
    }

    /* _gadData holds the generated rows — populated once per renderGadView call */
    var _gadData = [];

    function gadRenderTable() {
        var totalDays = GAD_WEEKS * GAD_DAYS;
        var search = (_gadSearch || '').toLowerCase();
        var shown = _gadData.filter(function(d) {
            if (_gadNcOnly && !d.nc) return false;
            if (_gadDept && d.dealer !== _gadDept) return false;
            if (search && d.name.toLowerCase().indexOf(search) === -1 && d.dealer.toLowerCase().indexOf(search) === -1) return false;
            return true;
        });

        var lbl = document.getElementById('gadCountLabel');
        if (lbl) lbl.textContent = shown.length + ' players';

        var rows = shown.map(function(d) {
            var ts    = gadCellStyle(d.total >= totalDays ? GAD_DAYS : (d.total > 0 ? 1 : 0));
            var cells = d.weeks.map(function(plays) {
                var cs = gadCellStyle(plays);
                return '<td style="padding:3px 3px;text-align:center"><div style="' + cs + ';border-radius:4px;font-size:11px;font-weight:600;padding:3px 0;white-space:nowrap">' + plays + '/' + GAD_DAYS + '</div></td>';
            }).join('');
            return '<tr style="border-bottom:1px solid var(--border)">' +
                '<td style="padding:10px 14px;min-width:170px;position:sticky;left:0;background:#fff;z-index:1">' +
                    '<div style="font-size:13px;font-weight:600;color:#1e293b">' + esc(d.name) + '</div>' +
                    '<div style="font-size:11px;color:#64748b;margin-top:1px">' + esc(d.dealer) + '</div></td>' +
                '<td style="padding:3px 8px;text-align:center;position:sticky;left:170px;background:#fff;z-index:1">' +
                    '<div style="' + ts + ';border-radius:4px;font-size:11px;font-weight:700;padding:3px 6px;white-space:nowrap">' + d.total + '/' + totalDays + '</div></td>' +
                cells +
            '</tr>';
        }).join('') || '<tr><td colspan="' + (GAD_WEEKS + 2) + '" style="padding:24px;text-align:center;color:#94a3b8;font-size:13px">No players match.</td></tr>';

        var tbody = document.getElementById('gadTbody');
        if (tbody) tbody.innerHTML = rows;
    }

    function renderGadView() {
        var el = document.getElementById('gpGameaDayView');
        if (!el) return;
        var allPlayers = PLAYER_COVERAGE[state.companyId] || PLAYER_COVERAGE[DEFAULT_COMPANY_ID] || [];
        var totalDays  = GAD_WEEKS * GAD_DAYS;

        _gadData = allPlayers.map(function(p) {
            var weeks = gadWeeks(p, state.companyId);
            var total = weeks.reduce(function(s, w) { return s + w; }, 0);
            return { name: p.name, dealer: p.dealer, weeks: weeks, total: total, nc: weeks.some(function(w) { return w === 0; }) };
        });

        var partN    = _gadData.filter(function(d) { return d.total > 0; }).length;
        var onTrackN = _gadData.filter(function(d) { return d.total >= totalDays; }).length;
        var belowN   = _gadData.filter(function(d) { return d.total > 0 && d.total < totalDays; }).length;
        var allPlays = _gadData.reduce(function(s, d) { return s + d.total; }, 0);
        var avgDay   = _gadData.length > 0 ? (allPlays / (_gadData.length * totalDays)).toFixed(2) : '0.00';

        /* Unique dealer list for dropdown */
        var dealers = [];
        _gadData.forEach(function(d) { if (dealers.indexOf(d.dealer) === -1) dealers.push(d.dealer); });
        var deptOptions = '<option value="">All departments</option>' +
            dealers.map(function(dl) { return '<option value="' + esc(dl) + '"' + (_gadDept === dl ? ' selected' : '') + '>' + esc(dl) + '</option>'; }).join('');

        var wkHeaders = '';
        for (var w = 1; w <= GAD_WEEKS; w++) {
            wkHeaders += '<th style="min-width:54px;padding:8px 4px;text-align:center;font-size:11px;font-weight:600;color:#64748b">WK' + w + '</th>';
        }

        var ncActive = _gadNcOnly;
        el.innerHTML =
            '<div class="ov-kpi-row" style="grid-template-columns:repeat(5,1fr);margin-bottom:16px">' +
                ovKpiCard('Participation',   Math.round(partN / _gadData.length * 100) + '%',    null) +
                ovKpiCard('On track',       Math.round(onTrackN / _gadData.length * 100) + '%', null) +
                ovKpiCard('Below target',   Math.round(belowN / _gadData.length * 100) + '%',   null) +
                ovKpiCard('Working days',   totalDays,                                            null) +
                ovKpiCard('Avg games/day',  avgDay,                                              null) +
            '</div>' +
            '<div class="dash-table-card">' +
                /* Filter bar */
                '<div style="padding:10px 14px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px;flex-wrap:wrap">' +
                    '<div class="plr-search-bar" style="flex:1;min-width:160px;max-width:240px">' +
                        '<input id="gadSearchInput" type="text" class="plr-search-input" placeholder="Search player or dealer..." oninput="gadSearch(this.value)" value="' + esc(_gadSearch) + '">' +
                        '<button class="plr-search-btn" onclick="gadSearch(document.getElementById(\'gadSearchInput\').value)"><i class="fas fa-search"></i></button>' +
                    '</div>' +
                    '<select onchange="gadSetDept(this.value)" style="padding:7px 10px;border:1px solid var(--border);border-radius:6px;font-size:12px;color:#1e293b;background:#fff;cursor:pointer;font-family:inherit">' + deptOptions + '</select>' +
                    '<button id="gadNcBtn" onclick="gadToggleNc()" style="padding:6px 14px;border:1px solid ' + (ncActive ? 'var(--chrome-bg)' : 'var(--border)') + ';border-radius:6px;font-size:12px;cursor:pointer;color:' + (ncActive ? '#fff' : '#1e293b') + ';background:' + (ncActive ? 'var(--chrome-bg)' : '#fff') + ';font-family:inherit">Non-compliant only</button>' +
                    '<span style="flex:1"></span>' +
                    '<span id="gadCountLabel" style="font-size:12px;color:#64748b">' + _gadData.length + ' players</span>' +
                    '<button onclick="alert(\'Download coming soon\')" style="display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border:1px solid var(--border);border-radius:6px;font-size:12px;cursor:pointer;background:#fff;color:#1e293b;font-family:inherit"><i class="fas fa-download"></i> Download</button>' +
                '</div>' +
                /* Scrollable table */
                '<div style="overflow-x:auto">' +
                '<table style="width:max-content;min-width:100%;border-collapse:collapse">' +
                    '<thead><tr style="background:#f8fafc;border-bottom:1px solid var(--border)">' +
                        '<th style="padding:8px 14px;text-align:left;font-size:11px;font-weight:600;color:#64748b;min-width:170px;position:sticky;left:0;background:#f8fafc;z-index:2">PLAYER</th>' +
                        '<th style="min-width:70px;padding:8px 6px;text-align:center;font-size:11px;font-weight:600;color:#64748b;position:sticky;left:170px;background:#f8fafc;z-index:2">TOTAL</th>' +
                        wkHeaders +
                    '</tr></thead>' +
                    '<tbody id="gadTbody"></tbody>' +
                '</table></div>' +
            '</div>';

        gadRenderTable();
    }

    window.gadToggleNc = function() {
        _gadNcOnly = !_gadNcOnly;
        var btn = document.getElementById('gadNcBtn');
        if (btn) {
            btn.style.background    = _gadNcOnly ? 'var(--chrome-bg)' : '#fff';
            btn.style.color         = _gadNcOnly ? '#fff' : '#1e293b';
            btn.style.borderColor   = _gadNcOnly ? 'var(--chrome-bg)' : 'var(--border)';
        }
        gadRenderTable();
    };

    window.gadSearch = function(val) {
        _gadSearch = val;
        gadRenderTable();
    };

    window.gadSetDept = function(val) {
        _gadDept = val;
        gadRenderTable();
    };

    /* ── Render: Players > Inactive ─────────────────────────── */

    function renderInactiveList(players) {
        var listEl = document.getElementById('inactivePlayerList');
        if (!listEl) return;
        if (!players.length) {
            listEl.innerHTML = '<div style="padding:32px;text-align:center;color:#94a3b8;font-size:13px">No inactive players for this threshold.</div>';
            return;
        }
        listEl.innerHTML = players.map(function(p, i) {
            var bg = i % 2 === 1 ? '#f9fafb' : '#fff';
            return '<div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;align-items:center;padding:14px 16px;background:' + bg + ';border-bottom:1px solid #f1f5f9">' +
                '<span style="font-size:14px;color:#0f172a">' + esc(p.name) + '</span>' +
                '<span style="font-size:14px;color:#475569">' + esc(p.dept) + '</span>' +
                '<span style="font-size:14px;color:#475569">' + (p.lastPlayed || '—') + '</span>' +
                '<span style="font-size:14px;color:#475569">' + (p.daysInactive !== null ? p.daysInactive : '—') + '</span>' +
            '</div>';
        }).join('');
    }

    function renderPlayersInactive() {
        var el = document.getElementById('dashPlayersInactive');
        if (!el) return;

        var allPlayers = INACTIVE_PLAYERS[state.companyId] || INACTIVE_PLAYERS[DEFAULT_COMPANY_ID] || [];
        var threshold  = 30;

        function filterPlayers(thresh, search) {
            return allPlayers.filter(function(p) {
                var meetsThresh = p.lastPlayed === null || p.daysInactive >= thresh;
                if (!meetsThresh) return false;
                if (search) {
                    var q = search.toLowerCase();
                    return p.name.toLowerCase().indexOf(q) !== -1 || p.dept.toLowerCase().indexOf(q) !== -1;
                }
                return true;
            });
        }

        var players = filterPlayers(threshold, '');

        el.innerHTML =
            /* KPI + threshold */
            '<div style="display:flex;align-items:flex-end;gap:24px;margin-bottom:20px">' +
                '<div class="ov-kpi-card" style="border-left-color:#1C2333;min-width:200px;flex-shrink:0">' +
                    '<div class="ov-kpi-lbl">Inactive players</div>' +
                    '<div class="ov-kpi-val" id="inactiveCount">' + players.length + '</div>' +
                '</div>' +
                '<div style="display:flex;align-items:center;gap:12px;padding-bottom:14px;font-size:14px;color:#475569">' +
                    '<span>Days inactive (threshold)</span>' +
                    '<input id="inactiveThresholdInput" type="number" value="' + threshold + '" min="1" max="365" ' +
                        'oninput="window.inactiveRefreshList()" ' +
                        'style="width:80px;padding:7px 10px;border:1px solid #e2e8f0;border-radius:8px;font-size:14px;color:#0f172a;text-align:center;outline:none">' +
                '</div>' +
            '</div>' +

            /* Search + table */
            '<div class="dash-table-card">' +
                '<div style="padding:10px 16px;border-bottom:1px solid #e5e7eb">' +
                    '<div class="plr-search-bar">' +
                        '<input id="inactiveSearch" type="text" class="plr-search-input" placeholder="Search..." oninput="window.inactiveRefreshList()">' +
                        '<button class="plr-search-btn"><i class="fas fa-search"></i></button>' +
                    '</div>' +
                '</div>' +
                '<div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;padding:10px 16px;border-bottom:1px solid #e5e7eb">' +
                    '<span style="font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.5px">Name</span>' +
                    '<span style="font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.5px">Department</span>' +
                    '<span style="font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.5px">Last Played</span>' +
                    '<span style="font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.5px">Days Inactive</span>' +
                '</div>' +
                '<div id="inactivePlayerList"></div>' +
            '</div>';

        renderInactiveList(players);
        window._inactiveAllPlayers = allPlayers;

        window.inactiveRefreshList = function() {
            var threshEl = document.getElementById('inactiveThresholdInput');
            var searchEl = document.getElementById('inactiveSearch');
            var thresh   = threshEl ? (parseInt(threshEl.value, 10) || 30) : 30;
            var search   = searchEl ? searchEl.value : '';
            var pl       = filterPlayers(thresh, search);
            var countEl  = document.getElementById('inactiveCount');
            if (countEl) countEl.textContent = pl.length;
            renderInactiveList(pl);
        };
    }

    /* ── Render: Players > Games Played ──────────────────────── */

    function getGameCoverageDaily(companyId) {
        var seed = companyId * 31;
        var vals = [];
        var v = 1.2;
        for (var i = 0; i < 31; i++) {
            seed = (seed * 1103515245 + 12345) & 0x7fffffff;
            var delta = ((seed % 200) / 100 - 1.0) * 0.9;
            v = Math.max(0.1, Math.min(7.0, v + delta));
            var d = new Date(2026, 4, 18 + i);
            var mon = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()];
            vals.push({ label: d.getDate() + ' ' + mon, pct: Math.round(v * 10) / 10 });
        }
        return vals;
    }

    function renderPlayersGamesPlayed() {
        var el = document.getElementById('dashPlayersGamesPlayed');
        if (!el) return;

        var profile    = COMPANY_PROFILES[state.companyId] || COMPANY_PROFILES[DEFAULT_COMPANY_ID];
        var coverage   = GAME_COVERAGE[state.companyId] || GAME_COVERAGE[DEFAULT_COMPANY_ID];
        var totalPlrs  = profile.players;
        var totalGames = BASE_GAMES.length;
        var gcDaily    = getGameCoverageDaily(state.companyId);
        var allPlayers = PLAYER_COVERAGE[state.companyId] || PLAYER_COVERAGE[DEFAULT_COMPANY_ID] || [];

        function subBtn(label, key) {
            var active = _gcView === key;
            return '<button class="gc-sub-btn' + (active ? ' active' : '') + '" onclick="window.gcSetView(\'' + key + '\')">' + label + '</button>';
        }

        function gcBarColor(pct) {
            return pct > 0 ? '#1C2333' : '#e2e8f0';
        }

        /* ── By game rows ── */
        function gameRows() {
            return coverage.byGame.map(function(g) {
                var pct = totalPlrs > 0 ? Math.round(g.players / totalPlrs * 1000) / 10 : 0;
                return '<div class="gc-game-card">' +
                    '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px">' +
                        '<span class="gc-game-name">' + esc(g.name) + '</span>' +
                        '<div style="display:flex;align-items:baseline;gap:20px">' +
                            '<span class="gc-game-acc">Avg. accuracy: ' + (g.avgAcc > 0 ? g.avgAcc.toFixed(1) + '%' : '0.0%') + '</span>' +
                            '<span class="gc-game-pct">' + pct.toFixed(1) + '%</span>' +
                        '</div>' +
                    '</div>' +
                    '<div class="gc-game-bar-wrap"><div class="gc-game-bar" style="width:' + pct + '%;background:' + gcBarColor(pct) + '"></div></div>' +
                    '<div class="gc-game-sub">' + g.players + ' / ' + totalPlrs + ' players</div>' +
                '</div>';
            }).join('');
        }

        /* ── By player rows ── */
        function playerRows(players, incOnly, search) {
            var filtered = players.filter(function(p) {
                if (incOnly && p.played >= totalGames) return false;
                if (search) {
                    var q = search.toLowerCase();
                    return p.name.toLowerCase().indexOf(q) !== -1 || p.dealer.toLowerCase().indexOf(q) !== -1;
                }
                return true;
            });
            filtered = filtered.slice().sort(function(a, b) { return b.played - a.played; });
            if (!filtered.length) {
                return '<div style="padding:32px;text-align:center;color:#94a3b8;font-size:13px">No players match the current filter.</div>';
            }
            return filtered.map(function(p) {
                var pct     = totalGames > 0 ? Math.round(p.played / totalGames * 100) : 0;
                var missing = totalGames - p.played;
                var bar     = gcBarColor(pct);
                var misCol  = pct >= 50 ? '#f59e0b' : pct > 0 ? '#ef4444' : '#94a3b8';
                return '<div class="gc-player-row">' +
                    '<div class="gc-player-name">' + esc(p.name) + '</div>' +
                    '<div class="gc-player-progress">' +
                        '<div class="gc-player-count">' + p.played + '/' + totalGames + '</div>' +
                        '<div class="gc-player-bar-wrap"><div class="gc-player-bar" style="width:' + pct + '%;background:' + bar + '"></div></div>' +
                        (missing > 0
                            ? '<div class="gc-player-missing" style="color:' + misCol + '">' + missing + ' missing</div>'
                            : '<div class="gc-player-missing" style="color:#16a34a">Complete</div>') +
                    '</div>' +
                    '<div class="gc-player-pct">' + pct + '%</div>' +
                    '<div class="gc-player-dept">' + esc(p.dealer) + '</div>' +
                '</div>';
            }).join('');
        }

        /* ── By player KPI values ── */
        var fullCount  = allPlayers.filter(function(p) { return p.played >= totalGames; }).length;
        var incomplete = allPlayers.filter(function(p) { return p.played < totalGames; }).length;
        var avgCovPct  = allPlayers.length > 0
            ? (allPlayers.reduce(function(s, p) { return s + p.played; }, 0) / (allPlayers.length * totalGames) * 100).toFixed(1)
            : '0.0';
        var avgGames   = allPlayers.length > 0
            ? (allPlayers.reduce(function(s, p) { return s + p.played; }, 0) / allPlayers.length).toFixed(1)
            : '0.0';

        /* ── Build HTML ── */
        var subTabs = '<div class="gc-sub-tabs">' + subBtn('By game', 'bygame') + subBtn('By player', 'byplayer') + '</div>';

        var byGameHtml =
            '<div style="display:flex;gap:16px;align-items:stretch;margin:20px 0">' +
                '<div style="flex:0 0 20%">' +
                    '<div class="ov-kpi-card" style="border-left-color:#1C2333;height:100%;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between">' +
                        '<div>' +
                            '<div class="ov-kpi-lbl">Game coverage</div>' +
                            '<div class="ov-kpi-val">' + coverage.coveragePct.toFixed(1) + '%</div>' +
                        '</div>' +
                        '<div style="font-size:12px;color:#64748b;line-height:1.9">' +
                            '<div>' + fullCount + ' of ' + totalPlrs + ' players complete</div>' +
                            '<div>avg ' + avgGames + ' / ' + totalGames + ' games per player</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div style="flex:1">' +
                    '<div class="dash-table-card" style="height:100%;box-sizing:border-box">' +
                        '<div style="padding:16px 20px 10px;font-size:14px;color:#475569;font-weight:500">Game coverage over time</div>' +
                        '<div id="gcTimeChart" style="height:240px;padding:0 16px 0"></div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="gc-game-grid">' + gameRows() + '</div>';

        var byPlayerHtml =
            '<div class="gc-kpi-row">' +
                '<div class="ov-kpi-card" style="border-left-color:#1C2333"><div class="ov-kpi-lbl">Games this period</div><div class="ov-kpi-val">' + totalGames + '</div></div>' +
                '<div class="ov-kpi-card" style="border-left-color:#1C2333"><div class="ov-kpi-lbl">Full coverage</div><div class="ov-kpi-val">' + fullCount + '</div></div>' +
                '<div class="ov-kpi-card" style="border-left-color:#1C2333"><div class="ov-kpi-lbl">Incomplete</div><div class="ov-kpi-val">' + incomplete + '</div></div>' +
                '<div class="ov-kpi-card" style="border-left-color:#1C2333"><div class="ov-kpi-lbl">Avg. coverage</div><div class="ov-kpi-val">' + avgCovPct + '%</div></div>' +
            '</div>' +
            '<div style="margin:12px 0 10px">' +
                '<span id="gcGamesLoadedBadge" style="display:inline-block;background:#d8dde8;color:#1C2333;font-size:12px;font-weight:600;padding:3px 12px;border-radius:20px;letter-spacing:0.2px;cursor:default">Games loaded: ' + totalGames + '</span>' +
            '</div>' +
            '<div class="gc-filter-bar">' +
                '<input id="gcPlayerSearch" type="text" placeholder="Search player or dealer" oninput="window.gcFilterPlayers()" ' +
                    'style="padding:8px 12px;border:1px solid #e2e8f0;border-radius:8px;font-size:13px;color:#0f172a;outline:none;width:200px">' +
                '<div id="gcDeptFilter" style="min-width:160px"></div>' +
                '<label class="gc-filter-check"><input type="checkbox" id="gcIncompleteOnly" onchange="window.gcFilterPlayers()"> Incomplete only</label>' +
                '<label class="gc-filter-check"><input type="checkbox" id="gcGroupByDept"> Group by department</label>' +
                '<button style="margin-left:auto;padding:7px 14px;border:1px solid #e2e8f0;border-radius:8px;font-size:13px;color:#475569;background:#fff;cursor:pointer;font-family:inherit">' +
                    '<i class="fas fa-file-export" style="margin-right:5px"></i>Export' +
                '</button>' +
            '</div>' +
            '<div id="gcPlayerList">' + playerRows(allPlayers, false, '') + '</div>';

        el.innerHTML = subTabs + (_gcView === 'bygame' ? byGameHtml : byPlayerHtml);

        if (_gcView === 'bygame') {
            setTimeout(function() {
                var chartEl = document.getElementById('gcTimeChart');
                if (!chartEl) return;
                $(chartEl).dxChart({
                    dataSource: gcDaily,
                    series: [{
                        valueField: 'pct', argumentField: 'label', type: 'spline', color: '#0f172a',
                        point: { visible: true, size: 5, color: '#0f172a', hoverStyle: { size: 7 } }
                    }],
                    legend: { visible: true, position: 'bottom', horizontalAlignment: 'center',
                        customizeItems: function() { return [{ text: 'Coverage %', marker: { fill: '#0f172a' } }]; }
                    },
                    argumentAxis: { label: { font: { size: 11 } }, tick: { visible: false }, endOnTick: false },
                    valueAxis: { min: 0, label: { font: { size: 11 } }, grid: { visible: true, color: '#f1f5f9' } },
                    commonSeriesSettings: { argumentField: 'label' },
                    tooltip: { enabled: true, cornerRadius: 6,
                        customizeTooltip: function(info) { return { text: info.argument + ': ' + info.value + '%' }; } },
                    margin: { right: 24 },
                    size: { height: 240 }
                });
            }, 0);
        }

        if (_gcView === 'byplayer') {
            var depts = ['All departments'].concat(
                allPlayers.map(function(p) { return p.dealer; })
                    .filter(function(v, i, a) { return a.indexOf(v) === i; })
            );
            $('#gcDeptFilter').dxSelectBox({
                items: depts, value: 'All departments', width: 160,
                onValueChanged: function() { window.gcFilterPlayers(); }
            });

            var gameListHtml = BASE_GAMES.map(function(name, i) {
                return '<div style="padding:3px 0;font-size:12px;color:#1e293b;text-align:left">' +
                    '<span style="color:#94a3b8;min-width:20px;display:inline-block;font-size:11px">' + (i + 1) + '.</span>' +
                    name +
                '</div>';
            }).join('');
            $('<div>').appendTo('body').dxTooltip({
                target: '#gcGamesLoadedBadge',
                showEvent: 'mouseenter',
                hideEvent: 'mouseleave',
                position: 'bottom',
                contentTemplate: function(content) {
                    content.html('<div style="padding:6px 4px;max-height:300px;overflow-y:auto;min-width:200px;text-align:left">' + gameListHtml + '</div>');
                }
            });
        }

        window.gcFilterPlayers = function() {
            var searchEl  = document.getElementById('gcPlayerSearch');
            var incEl     = document.getElementById('gcIncompleteOnly');
            var search    = searchEl ? searchEl.value : '';
            var incOnly   = incEl ? incEl.checked : false;
            var listEl    = document.getElementById('gcPlayerList');
            if (listEl) listEl.innerHTML = playerRows(allPlayers, incOnly, search);
        };
    }

    window.gcSetView = function(view) { _gcView = view; renderPlayersGamesPlayed(); };

    function gpRenderList(allPlayers, total) {
        var search  = (_gpFilter.search || '').toLowerCase();
        var incOnly = _gpFilter.incompleteOnly;
        var filtered = allPlayers.filter(function(p) {
            if (incOnly && p.played >= total) return false;
            if (search && p.name.toLowerCase().indexOf(search) === -1 && p.dealer.toLowerCase().indexOf(search) === -1) return false;
            return true;
        });

        var countEl = document.getElementById('gpCountLabel');
        if (countEl) countEl.textContent = filtered.length + ' players';

        var rows = filtered.map(function(p) {
            var pct        = total > 0 ? Math.round(p.played / total * 100) : 0;
            var missing    = total - p.played;
            var isInact    = p.played === 0;
            var barCol     = pct === 100 ? '#16a34a' : pct > 0 ? '#d97706' : '#e2e8f0';
            var numCol     = pct === 100 ? '#16a34a' : pct > 0 ? '#d97706' : '#94a3b8';
            var nameStyle  = isInact ? 'color:#94a3b8' : 'color:#1e293b;font-weight:600';
            var dealerStyle = isInact ? 'color:#94a3b8;font-size:12px' : 'color:#64748b;font-size:12px';
            var missingHtml = missing > 0 ? '<span style="font-size:11px;color:#d97706;margin-left:8px">' + missing + ' missing</span>' : '';
            return '<div style="display:flex;align-items:center;padding:12px 16px;border-bottom:1px solid var(--border);gap:12px">' +
                '<i class="fas fa-chevron-right" style="font-size:10px;color:#cbd5e1;flex-shrink:0"></i>' +
                '<div style="flex:1;min-width:0">' +
                    '<div style="' + nameStyle + ';font-size:14px">' + esc(p.name) + '</div>' +
                    '<div style="display:flex;align-items:center;gap:6px;margin-top:3px">' +
                        '<span style="background:#334155;color:#fff;border-radius:4px;padding:1px 7px;font-size:10px;font-weight:600">' + esc(p.short) + '</span>' +
                        '<span style="' + dealerStyle + '">' + esc(p.dealer) + '</span>' +
                    '</div>' +
                '</div>' +
                '<div style="display:flex;align-items:center;gap:10px;flex-shrink:0">' +
                    '<span style="font-size:13px;font-weight:600;color:' + numCol + ';min-width:36px;text-align:right">' + p.played + '/' + total + '</span>' +
                    '<div style="width:120px;height:6px;background:#f1f5f9;border-radius:3px;overflow:hidden">' +
                        '<div style="height:100%;width:' + pct + '%;background:' + barCol + ';border-radius:3px"></div>' +
                    '</div>' +
                    '<span style="font-size:12px;color:' + numCol + ';min-width:32px">' + pct + '%</span>' +
                    missingHtml +
                '</div>' +
            '</div>';
        }).join('');

        var listEl = document.getElementById('gpPlayerList');
        if (listEl) listEl.innerHTML = rows || '<div style="padding:24px 16px;text-align:center;color:#94a3b8;font-size:13px">No players match the current filter.</div>';
    }

    window.gpSetView = function(view) {
        _gpView = view;
        renderPlayersGamesPlayed();
    };

    window.gpToggleGameList = function(btn) {
        var list = document.getElementById('gpGameList');
        if (!list) return;
        var open = list.style.display !== 'none';
        list.style.display = open ? 'none' : '';
        btn.innerHTML = open
            ? '<i class="fas fa-chevron-down" style="font-size:9px;margin-right:3px"></i>show games'
            : '<i class="fas fa-chevron-up" style="font-size:9px;margin-right:3px"></i>hide games';
    };

    window.gpApplyFilter = function() {
        var searchEl = document.getElementById('gpSearch');
        if (searchEl) _gpFilter.search = searchEl.value;
        var allPlayers = PLAYER_COVERAGE[state.companyId] || PLAYER_COVERAGE[DEFAULT_COMPANY_ID] || [];
        gpRenderList(allPlayers, BASE_GAMES.length);
    };

    window.gpToggleIncomplete = function() {
        _gpFilter.incompleteOnly = !_gpFilter.incompleteOnly;
        var btn = document.getElementById('gpIncompleteBtn');
        if (btn) {
            btn.style.background = _gpFilter.incompleteOnly ? '#1e293b' : '#fff';
            btn.style.color      = _gpFilter.incompleteOnly ? '#fff'    : '#1e293b';
        }
        var allPlayers = PLAYER_COVERAGE[state.companyId] || PLAYER_COVERAGE[DEFAULT_COMPANY_ID] || [];
        gpRenderList(allPlayers, BASE_GAMES.length);
    };

    /* ── Render: Departments > Overview ──────────────────────── */

    function renderDepartmentsOverview() {
        var depts       = getDeptPlayers(state.companyId);
        var profile     = COMPANY_PROFILES[state.companyId] || COMPANY_PROFILES[DEFAULT_COMPANY_ID];
        var activeTotal = depts.reduce(function(s,x){return s+x.active;},0);
        var pieColors   = ['#1C2333','#4a6a96','#7fa3c4','#b3cde3','#dce9f3','#eef4f9'];

        function buildRow(dep) {
            var sessions  = Math.round(dep.active * (dep.avgPoints || 1) / 20);
            var partPct   = dep.total > 0 ? (dep.active / dep.total * 100).toFixed(1) : '0.0';
            var arVal     = dep.total > 0 ? Math.min(100, sessions / (dep.total * 150) * 100) : 0;
            var ar        = arVal.toFixed(1);
            var dotCol    = arVal >= 50 ? '#22c55e' : arVal >= 25 ? '#f59e0b' : '#ef4444';
            return '<tr>' +
                '<td class="td-game-name">' + esc(dep.name) + '</td>' +
                '<td>' + dep.total + '</td>' +
                '<td style="font-weight:600">' + dep.active + '</td>' +
                '<td>' + partPct + '%</td>' +
                '<td>' + sessions.toLocaleString() + '</td>' +
                '<td>' + (dep.avgPoints || 0).toLocaleString() + '</td>' +
                '<td><div style="display:flex;align-items:center;gap:6px">' +
                    '<span style="width:8px;height:8px;border-radius:50%;background:'+dotCol+';flex-shrink:0"></span>' +
                    '<div style="width:60px;height:4px;border-radius:2px;background:#e2e8f0;overflow:hidden">' +
                        '<div style="height:100%;border-radius:2px;background:'+dotCol+';width:'+Math.min(100,arVal)+'%"></div>' +
                    '</div>' +
                    '<span style="font-size:12px;color:#374151">' + ar + '%</span>' +
                '</div></td>' +
            '</tr>';
        }

        var rowData = depts.map(function(dep) { return { dep: dep, html: buildRow(dep) }; });

        document.getElementById('dashDeptPanel').innerHTML =
            '<div class="plr-search-row" style="margin-top:0;margin-bottom:14px">' +
                '<div class="plr-search-bar">' +
                    '<input type="text" class="plr-search-input" id="deptOvSearchInput" placeholder="Search..." oninput="deptOvSearch(this.value)">' +
                    '<button class="plr-search-btn"><i class="fas fa-search"></i></button>' +
                '</div>' +
            '</div>' +
            '<div class="dash-table-card" style="margin-bottom:16px">' +
                '<table class="dash-perf-table">' +
                '<thead><tr>' +
                    '<th>Department</th><th>Total Users</th><th>Active Players</th>' +
                    '<th>Participation</th><th>Sessions</th><th>Avg. Points</th><th>Activity Rate</th>' +
                '</tr></thead>' +
                '<tbody id="deptOvTableBody">' + rowData.map(function(r){return r.html;}).join('') + '</tbody>' +
                '</table>' +
            '</div>' +
            '<div class="chart-card">' +
                '<div class="chart-card-hd">Active players by department</div>' +
                '<div class="chart-container"><div id="chartDeptPie"></div></div>' +
            '</div>';

        window.deptOvSearch = function(q) {
            q = (q || '').toLowerCase();
            var filtered = rowData.filter(function(r) {
                return !q || r.dep.name.toLowerCase().indexOf(q) !== -1;
            });
            var el = document.getElementById('deptOvTableBody');
            if (el) el.innerHTML = filtered.map(function(r){return r.html;}).join('');
        };

        makeChart('chartDeptPie', {
            opts: {
                dataSource: depts.map(function(d) {
                    return { name: d.name, active: Math.max(0, d.active) };
                }),
                series: [{
                    argumentField: 'name', valueField: 'active', type: 'bar',
                    color: '#1C2333', cornerRadius: 0,
                    label: { visible: false }
                }],
                rotated: true,
                commonAxisSettings: { tick: { visible: false }, label: { font: { size: 11, color: '#64748b' } } },
                argumentAxis: { grid: { visible: false } },
                valueAxis: { min: 0, grid: { visible: false },
                    label: { customizeText: function(i) { return i.valueText + ' players'; } }
                },
                legend: { visible: false },
                tooltip: { enabled: true,
                    customizeTooltip: function(info) {
                        var pct = activeTotal > 0 ? (info.value / activeTotal * 100).toFixed(0) : 0;
                        return { text: info.argumentText + ': ' + info.value + ' players (' + pct + '%)' };
                    }
                },
                size: { height: Math.max(160, depts.length * 56) }
            }
        });
    }

    /* ── Render: Regional > Overview ─────────────────────────── */

    function renderRegionalOverview() {
        var el = document.getElementById('dashRegionalOverview');
        if (!el) return;
        var profile = COMPANY_PROFILES[state.companyId] || COMPANY_PROFILES[DEFAULT_COMPANY_ID];
        var d       = getPeriodData(state.companyId, state.period);
        var dealers = COMPANY_DEALERS[state.companyId];
        if (!dealers) {
            dealers = [{ name: profile.name + ' — Main Office', players: profile.players, avgAcc: d.avgAcc, points: Math.round(d.plays * d.avgAcc / 10) }];
        }
        var totalPts = dealers.reduce(function(s,dl){return s+dl.points;},0);

        var dealerRows = dealers.map(function(dl) {
            return '<tr><td class="td-game-name">'+esc(dl.name)+'</td><td>'+dl.players+'</td><td>'+dl.avgAcc.toFixed(1)+'%</td><td style="color:#e11d48;font-weight:600">'+dl.points.toLocaleString()+'</td></tr>';
        }).join('');

        el.innerHTML =
            '<div class="regional-top-grid">' +
                '<div class="dash-table-card"><div class="dash-table-card-hd">Regions</div>' +
                '<table class="dash-perf-table"><thead><tr><th>Region</th><th>Players</th><th>Avg Accuracy</th><th>Total Points</th></tr></thead>' +
                '<tbody><tr>' +
                    '<td style="display:flex;align-items:center;gap:6px"><i class="fas fa-globe" style="color:#94a3b8;font-size:12px"></i> Unknown</td>' +
                    '<td>'+profile.players+'</td><td>'+d.avgAcc.toFixed(1)+'%</td><td style="color:#e11d48;font-weight:600">'+totalPts.toLocaleString()+'</td>' +
                '</tr></tbody></table></div>' +
                '<div class="chart-card"><div class="chart-card-hd">Players per Region</div><div class="chart-container"><div id="chartRegionalPlayers"></div></div></div>' +
            '</div>' +
            '<div class="dash-table-card" style="margin-top:14px"><div class="dash-table-card-hd">Top Dealers</div>' +
            '<table class="dash-perf-table"><thead><tr><th>Dealer</th><th>Players</th><th>Avg Accuracy</th><th>Points</th></tr></thead>' +
            '<tbody>'+dealerRows+'</tbody></table></div>';

        makeChart('chartRegionalPlayers', {
            opts: {
                dataSource: [{ region: 'Unknown', players: profile.players }],
                series: [{ argumentField: 'region', valueField: 'players', type: 'bar', color: '#e53e3e', cornerRadius: 0 }],
                rotated: true,
                commonAxisSettings: { tick: { visible: false }, label: { font: { size: 11, color: '#64748b' } } },
                argumentAxis: { grid: { visible: false } },
                valueAxis:    { grid: { visible: false } },
                legend:  { visible: false },
                tooltip: { enabled: true },
                size:    { height: 130 }
            }
        });
    }

    /* ── Render: Leave & exclusions (shared) ────────────────── */

    var _leaveRecords = [];
    var _exclRecords  = [];

    function lveLeaveRows(records, search) {
        var filtered = records.filter(function(r) {
            if (!search) return true;
            var q = search.toLowerCase();
            return r.name.toLowerCase().indexOf(q) !== -1 || r.dept.toLowerCase().indexOf(q) !== -1;
        });
        if (!filtered.length) {
            return '<div style="padding:40px;text-align:center;color:#94a3b8;font-size:14px">No records found.</div>';
        }
        return filtered.map(function(r, i) {
            var bg = i % 2 === 1 ? '#f9fafb' : '#fff';
            return '<div style="display:grid;grid-template-columns:1.5fr 1.2fr 1fr 1fr 1.5fr;align-items:center;padding:13px 16px;background:' + bg + ';border-bottom:1px solid #f1f5f9;font-size:13px">' +
                '<span style="color:#0f172a">' + esc(r.name) + '</span>' +
                '<span style="color:#475569">' + esc(r.dept) + '</span>' +
                '<span style="color:#475569">' + esc(r.startDate) + '</span>' +
                '<span style="color:#475569">' + esc(r.endDate) + '</span>' +
                '<span style="color:#475569">' + esc(r.reason) + '</span>' +
            '</div>';
        }).join('');
    }

    function lveExclRows(records, search) {
        var filtered = records.filter(function(r) {
            if (!search) return true;
            return r.name.toLowerCase().indexOf(search.toLowerCase()) !== -1;
        });
        if (!filtered.length) {
            return '<div style="padding:40px;text-align:center;color:#94a3b8;font-size:14px">No records found.</div>';
        }
        return filtered.map(function(r, i) {
            var bg = i % 2 === 1 ? '#f9fafb' : '#fff';
            return '<div style="display:grid;grid-template-columns:2fr 2fr 1fr;align-items:center;padding:13px 16px;background:' + bg + ';border-bottom:1px solid #f1f5f9;font-size:13px">' +
                '<span style="color:#0f172a">' + esc(r.name) + '</span>' +
                '<span style="color:#475569">' + esc(r.reason) + '</span>' +
                '<span style="color:#475569">' + esc(r.since) + '</span>' +
            '</div>';
        }).join('');
    }

    function renderLeavePanel(elId) {
        var el = document.getElementById(elId);
        if (!el) return;

        var players    = COMPANY_PLAYERS[state.companyId] || COMPANY_PLAYERS[DEFAULT_COMPANY_ID] || [];
        var playerNames = players.map(function(p) { return p.name; });

        var sfx = elId.replace(/[^a-zA-Z0-9]/g, ''); /* unique DOM id prefix */

        function tableHdr(cols, grid) {
            return '<div style="display:grid;grid-template-columns:' + grid + ';padding:10px 16px;border-bottom:1px solid #e5e7eb">' +
                cols.map(function(c) {
                    return '<span style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.6px">' + c + '</span>';
                }).join('') +
            '</div>';
        }

        el.innerHTML =
            /* ── Leave ── */
            '<h2 class="lve-heading">Leave</h2>' +
            '<p class="lve-subtext">Players on leave are excluded from report data only for the specified dates.</p>' +

            '<div class="lve-form-card">' +
                '<div class="lve-form-title">Record leave</div>' +
                '<div class="lve-form-row">' +
                    '<div id="' + sfx + 'PlayerSel" style="min-width:200px;flex-shrink:0"></div>' +
                    '<div class="lve-daterange">' +
                        '<div class="lve-date-wrap">' +
                            '<label class="lve-date-lbl">Start date</label>' +
                            '<input type="date" id="' + sfx + 'StartDate" class="lve-date-input">' +
                        '</div>' +
                        '<i class="fas fa-arrow-right" style="color:#94a3b8;font-size:13px;flex-shrink:0"></i>' +
                        '<div class="lve-date-wrap">' +
                            '<label class="lve-date-lbl">End date</label>' +
                            '<input type="date" id="' + sfx + 'EndDate" class="lve-date-input">' +
                        '</div>' +
                    '</div>' +
                    '<input type="text" id="' + sfx + 'Reason" placeholder="Reason" class="lve-text-input">' +
                '</div>' +
                '<button onclick="window.lveAdd_' + sfx + '()" class="lve-add-btn"><i class="fas fa-plus" style="margin-right:6px"></i>Add leave</button>' +
            '</div>' +

            '<div class="lve-search-row">' +
                '<input id="' + sfx + 'LvSearch" type="text" placeholder="Search..." oninput="window.lveFilterLeave_' + sfx + '()" class="lve-search-input">' +
                '<button class="lve-search-btn"><i class="fas fa-search"></i></button>' +
            '</div>' +
            '<div class="dash-table-card" style="margin-bottom:32px">' +
                tableHdr(['Name','Department','Start Date','End Date','Reason'], '1.5fr 1.2fr 1fr 1fr 1.5fr') +
                '<div id="' + sfx + 'LeaveList">' + lveLeaveRows(_leaveRecords, '') + '</div>' +
            '</div>' +

            /* ── Exclusions ── */
            '<h2 class="lve-heading">Exclusions</h2>' +
            '<p class="lve-subtext">Excluded players are <span style="color:#f59e0b">hidden from all report data</span>. Restore them at any time to include them again.</p>' +

            '<div class="lve-search-row">' +
                '<input id="' + sfx + 'ExSearch" type="text" placeholder="Search..." oninput="window.lveFilterExcl_' + sfx + '()" class="lve-search-input">' +
                '<button class="lve-search-btn"><i class="fas fa-search"></i></button>' +
            '</div>' +
            '<div class="dash-table-card">' +
                tableHdr(['Name','Reason','Excluded Since'], '2fr 2fr 1fr') +
                '<div id="' + sfx + 'ExclList">' + lveExclRows(_exclRecords, '') + '</div>' +
            '</div>';

        /* Init player selectbox */
        $('#' + sfx + 'PlayerSel').dxSelectBox({ items: playerNames, placeholder: 'Player', width: '100%' });

        /* Add leave handler */
        window['lveAdd_' + sfx] = function() {
            var selInst  = $('#' + sfx + 'PlayerSel').dxSelectBox('instance');
            var player   = selInst ? selInst.option('value') : null;
            var startEl  = document.getElementById(sfx + 'StartDate');
            var endEl    = document.getElementById(sfx + 'EndDate');
            var reasonEl = document.getElementById(sfx + 'Reason');
            if (!player) { alert('Please select a player.'); return; }
            var plrObj = players.filter(function(p) { return p.name === player; })[0] || {};
            _leaveRecords.push({
                name: player,
                dept: plrObj.dept || '—',
                startDate: startEl ? (startEl.value || '—') : '—',
                endDate:   endEl   ? (endEl.value   || '—') : '—',
                reason:    reasonEl ? (reasonEl.value || '—') : '—'
            });
            document.getElementById(sfx + 'LeaveList').innerHTML = lveLeaveRows(_leaveRecords, '');
            if (selInst) selInst.reset();
            if (startEl)  startEl.value  = '';
            if (endEl)    endEl.value    = '';
            if (reasonEl) reasonEl.value = '';
        };

        window['lveFilterLeave_' + sfx] = function() {
            var search = (document.getElementById(sfx + 'LvSearch') || {}).value || '';
            document.getElementById(sfx + 'LeaveList').innerHTML = lveLeaveRows(_leaveRecords, search);
        };

        window['lveFilterExcl_' + sfx] = function() {
            var search = (document.getElementById(sfx + 'ExSearch') || {}).value || '';
            document.getElementById(sfx + 'ExclList').innerHTML = lveExclRows(_exclRecords, search);
        };
    }

    function renderPlayersLeave() { renderLeavePanel('dashPlayersLeave'); }

    /* ── Gamification ────────────────────────────────────────── */

    var _gamPeriodIdx    = 6;        // 0-6, indexes PERIODS — Leagues/Scoreboard
    var _gamDeptFilter   = '';
    var _gamNameFilter   = '';
    var _gamSearchFilter = '';
    var _gamStreakGran   = 'weekly'; // Streaks granularity
    var _gamWeekIdx     = 0;         // Play days: 0 = week Jun 8-14 2026

    function _gamPeriodLabel(idx) {
        var p = PERIODS[idx] || PERIODS[6];
        if (p === 'All Months') return 'All Months';
        return p.replace('2026', ' 2026');
    }

    function _gamLeagueTier(xp) {
        if (xp >= 20000) return { label: 'Diamond', cls: 'plr-league-diamond' };
        if (xp >= 5000)  return { label: 'Gold',    cls: 'plr-league-gold'   };
        if (xp >= 2000)  return { label: 'Silver',  cls: 'plr-league-silver' };
        return                   { label: 'Bronze',  cls: 'plr-league-bronze' };
    }

    function _gamPScale() {
        if (_gamPeriodIdx === 0) return 1.0;
        var base = getPeriodData(state.companyId, 'All Months');
        var pd   = getPeriodData(state.companyId, PERIODS[_gamPeriodIdx]);
        return (base && pd && base.plays > 0) ? pd.plays / base.plays : 1.0;
    }

    function _gamDeptList() {
        var players = COMPANY_PLAYERS[state.companyId] || COMPANY_PLAYERS[DEFAULT_COMPANY_ID];
        return players.reduce(function(acc, p) {
            if (acc.indexOf(p.dept) < 0) acc.push(p.dept);
            return acc;
        }, []);
    }

    function _gamInitDeptBox(boxId, onChange) {
        var depts = _gamDeptList();
        var items = [{ text: 'Department', value: '' }].concat(depts.map(function(d) { return { text: d, value: d }; }));
        $('#' + boxId).dxSelectBox({
            dataSource: items, displayExpr: 'text', valueExpr: 'value',
            value: _gamDeptFilter || '', placeholder: 'Department', width: 190,
            onValueChanged: function(e) { _gamDeptFilter = e.value || ''; _gamNameFilter = ''; onChange(); }
        });
    }

    function _gamInitPlayerBox(boxId, onChange) {
        var allPlayers = (COMPANY_PLAYERS[state.companyId] || COMPANY_PLAYERS[DEFAULT_COMPANY_ID]);
        var filtered = _gamDeptFilter
            ? allPlayers.filter(function(p) { return p.dept.toLowerCase() === _gamDeptFilter.toLowerCase(); })
            : allPlayers;
        var items = [{ text: 'All players', value: '' }].concat(
            filtered.map(function(p) { return { text: p.name, value: p.name }; })
        );
        $('#' + boxId).dxSelectBox({
            dataSource: items, displayExpr: 'text', valueExpr: 'value',
            value: _gamNameFilter || '', placeholder: 'Player name', width: 190,
            onValueChanged: function(e) { _gamNameFilter = e.value || ''; onChange(); }
        });
    }

    function _gamPeriodNavHtml() {
        var canOlder = _gamPeriodIdx > 0;
        var canNewer = _gamPeriodIdx < PERIODS.length - 1;
        return '<div class="gam-ctrl-period">' +
            '<button class="gam-period-btn' + (!canOlder ? ' gam-period-btn--disabled' : '') + '"' + (!canOlder ? ' disabled' : '') + ' onclick="window.gamPeriodOlder()">&lt; Older</button>' +
            '<span class="gam-period-label">' + _gamPeriodLabel(_gamPeriodIdx) + '</span>' +
            '<button class="gam-period-btn' + (!canNewer ? ' gam-period-btn--disabled' : '') + '"' + (!canNewer ? ' disabled' : '') + ' onclick="window.gamPeriodNewer()">&gt; Newer</button>' +
        '</div>';
    }

    /* Cascading dept → player selectboxes */
    function _gamInitCascadingDropdowns(deptBoxId, playerBoxId, onChange) {
        function refreshPlayerBox() {
            var allPlayers = COMPANY_PLAYERS[state.companyId] || COMPANY_PLAYERS[DEFAULT_COMPANY_ID];
            var filtered = _gamDeptFilter
                ? allPlayers.filter(function(p) { return p.dept.toLowerCase() === _gamDeptFilter.toLowerCase(); })
                : allPlayers;
            var items = [{ text: 'All players', value: '' }].concat(
                filtered.map(function(p) { return { text: p.name, value: p.name }; })
            );
            var inst = $('#' + playerBoxId).dxSelectBox('instance');
            if (inst) { inst.option('dataSource', items); inst.option('value', ''); }
        }
        _gamInitDeptBox(deptBoxId, function() { refreshPlayerBox(); onChange(); });
        _gamInitPlayerBox(playerBoxId, onChange);
    }

    function _gamControlsRowHtml(deptId, nameId, nameFilterFn, midHtml, searchId, searchFn) {
        return '<div class="gam-controls-row">' +
            '<div id="' + deptId + '" class="gam-dept-filter-box"></div>' +
            '<div id="' + nameId + '" class="gam-player-filter-box"></div>' +
            (midHtml || '') +
            '<button class="gam-export-btn" onclick="window.gamExportExcel()"><i class="fas fa-file-export"></i> Export</button>' +
        '</div>';
    }

    function _applyGamFilter() {
        var nd = _gamDeptFilter.toLowerCase();
        var nn = _gamNameFilter.toLowerCase();
        var ns = _gamSearchFilter.toLowerCase();
        document.querySelectorAll('#gamLeaguesTable tbody tr').forEach(function(row) {
            var name = (row.cells[0] ? row.cells[0].textContent : '').toLowerCase();
            var dept = (row.cells[1] ? row.cells[1].textContent : '').toLowerCase();
            var ok = (!nd || dept === nd) && (!nn || name.indexOf(nn) >= 0) &&
                     (!ns || (name + ' ' + dept).indexOf(ns) >= 0);
            row.style.display = ok ? '' : 'none';
        });
    }

    /* ── Leagues ─────────────────────────────────────────────── */

    function renderGamificationLeagues() {
        var el = document.getElementById('dashGamLeagues');
        if (!el) return;
        var players = (COMPANY_PLAYERS[state.companyId] || COMPANY_PLAYERS[DEFAULT_COMPANY_ID]).slice();
        var pScale  = _gamPScale();

        var rows = players.map(function(p) {
            return { name: p.name, dept: p.dept, xp: Math.round(p.points * 5 * pScale) };
        }).sort(function(a, b) { return b.xp - a.xp; });

        var html = _gamControlsRowHtml('gamDeptFilterBox', 'gamPlayerNameInput', 'gamNameFilter',
                       _gamPeriodNavHtml(), null, null);

        html += '<table class="gam-table" id="gamLeaguesTable"><thead><tr>' +
                '<th>PLAYER</th><th>DEPARTMENT</th><th>LEAGUE</th><th style="text-align:right">SEASON XP</th>' +
                '</tr></thead><tbody>';
        rows.forEach(function(r) {
            var t = _gamLeagueTier(r.xp);
            html += '<tr><td>' + r.name + '</td><td>' + r.dept + '</td>' +
                    '<td><span class="plr-league-badge ' + t.cls + '">' + t.label + '</span></td>' +
                    '<td class="gam-xp">' + r.xp.toLocaleString() + '</td></tr>';
        });
        html += '</tbody></table>';
        el.innerHTML = html;
        _gamInitCascadingDropdowns('gamDeptFilterBox', 'gamPlayerNameInput', function() { _applyGamFilter(); });
        _applyGamFilter();
    }

    /* ── Scoreboard ──────────────────────────────────────────── */

    function renderGamificationScoreboard() {
        var el = document.getElementById('dashGamScoreboard');
        if (!el) return;
        var players = (COMPANY_PLAYERS[state.companyId] || COMPANY_PLAYERS[DEFAULT_COMPANY_ID]).slice();
        var pScale  = _gamPScale();

        var rows = players.map(function(p) {
            return { name: p.name, dept: p.dept,
                     points:   Math.round(p.points * pScale),
                     accuracy: p.accuracy,
                     games:    Math.max(0, Math.round(p.games * pScale)) };
        }).sort(function(a, b) { return b.points - a.points; });

        if (_gamDeptFilter) rows = rows.filter(function(r) { return r.dept.toLowerCase() === _gamDeptFilter.toLowerCase(); });
        if (_gamNameFilter) rows = rows.filter(function(r) { return r.name.toLowerCase().indexOf(_gamNameFilter.toLowerCase()) >= 0; });

        var gridData = rows.map(function(r, i) {
            return { rank: i + 1, name: r.name, dept: r.dept, points: r.points, accuracy: r.accuracy, games: r.games };
        });

        el.innerHTML = _gamControlsRowHtml('gamScoreDeptBox', 'gamScorePlayerInput', 'gamScoreNameFilter',
                           _gamPeriodNavHtml(), null, null) + '<div id="gamScoreGrid" class="dash-grid"></div>';

        _gamInitCascadingDropdowns('gamScoreDeptBox', 'gamScorePlayerInput', function() { renderGamificationScoreboard(); });

        window.gamScoreNameFilter = function() {
            var inp = document.getElementById('gamScorePlayerInput');
            _gamNameFilter = inp ? inp.value : '';
            renderGamificationScoreboard();
        };

        $('#gamScoreGrid').dxDataGrid({
            dataSource: gridData, showBorders: false, showRowLines: true,
            showColumnLines: false, rowAlternationEnabled: false, hoverStateEnabled: true,
            columns: [
                { dataField: 'rank',     caption: 'RANK',         width: 75,  alignment: 'left',
                  cellTemplate: function(c, o) { $('<span>').css('color','#94a3b8').text(o.value).appendTo(c); } },
                { dataField: 'name',     caption: 'PLAYER',       minWidth: 90,
                  cellTemplate: function(c, o) { $('<span>').addClass('plr-name-link').text(o.value).appendTo(c); } },
                { dataField: 'dept',     caption: 'DEPARTMENT',   minWidth: 110 },
                { dataField: 'points',   caption: 'POINTS',       width: 90,  alignment: 'right' },
                { dataField: 'accuracy', caption: 'ACCURACY',     width: 100, alignment: 'right',
                  customizeText: function(i) { return parseFloat(i.value).toFixed(1); } },
                { dataField: 'games',    caption: 'GAMES PLAYED', width: 120, alignment: 'right' }
            ],
            paging: { enabled: false }, sorting: { mode: 'single' }, headerFilter: { visible: false },
            searchPanel: { visible: false }
        });
    }

    /* ── Streaks ─────────────────────────────────────────────── */

    function _gamStreakRow(p) {
        var seed = p.name.charCodeAt(0) + p.points;
        var cur  = Math.max(0, Math.floor(Math.abs(Math.sin(seed * 3)) * 5));
        var lng  = cur + Math.max(0, Math.floor(Math.abs(Math.sin(seed * 7)) * 4));
        var days = _gamStreakGran === 'weekly'
            ? Math.min(7, Math.max(0, Math.round(p.games / 150)))
            : Math.min(30, Math.max(0, Math.round(p.games / 35)));
        var gms  = _gamStreakGran === 'weekly'
            ? Math.max(0, Math.round(p.games / 60))
            : Math.max(0, Math.round(p.games / 12));
        return { name: p.name, dept: p.dept, current: cur, longest: lng, activeDays: days, games: gms };
    }

    function renderGamificationStreaks() {
        var el = document.getElementById('dashGamStreaks');
        if (!el) return;
        var players = (COMPANY_PLAYERS[state.companyId] || COMPANY_PLAYERS[DEFAULT_COMPANY_ID]).slice();
        var data = players.map(_gamStreakRow);

        if (_gamDeptFilter) data = data.filter(function(r) { return r.dept.toLowerCase() === _gamDeptFilter.toLowerCase(); });
        if (_gamNameFilter) data = data.filter(function(r) { return r.name.toLowerCase().indexOf(_gamNameFilter.toLowerCase()) >= 0; });

        var activeStreaks = data.filter(function(r) { return r.current > 0; }).length;
        var avgCur = data.length ? (data.reduce(function(s,r){ return s + r.current; }, 0) / data.length) : 0;
        var avgLng = data.length ? (data.reduce(function(s,r){ return s + r.longest; }, 0) / data.length) : 0;

        var deptMap = {};
        data.forEach(function(r) {
            if (!deptMap[r.dept]) deptMap[r.dept] = { cur: 0, lng: 0, n: 0 };
            deptMap[r.dept].cur += r.current; deptMap[r.dept].lng += r.longest; deptMap[r.dept].n++;
        });

        var periodLbl = _gamStreakGran === 'weekly' ? 'Period: 2026-06-08 to 2026-06-14' : 'Period: 2026-06-01 to 2026-06-30';

        var streakMidHtml =
            '<div class="gam-ctrl-toggle">' +
                '<button class="gam-toggle-btn' + (_gamStreakGran === 'weekly'  ? ' active' : '') + '" onclick="window.gamStreakGran(\'weekly\')">Weekly</button>' +
                '<button class="gam-toggle-btn' + (_gamStreakGran === 'monthly' ? ' active' : '') + '" onclick="window.gamStreakGran(\'monthly\')">Monthly</button>' +
            '</div>' +
            '<span class="gam-streak-period-lbl">' + periodLbl + '</span>';
        var html = _gamControlsRowHtml('gamStreakDeptBox', 'gamStreakPlayerInput', 'gamStreakNameFilter',
                       streakMidHtml, null, null);

        html += '<p class="gam-streak-desc">A period counts toward the streak when a player is active on at least the required number of days within it.</p>';

        html += '<div class="gc-kpi-row" style="grid-template-columns:repeat(3,1fr)">' +
            '<div class="ov-kpi-card" style="border-left-color:#1C2333"><div class="ov-kpi-lbl">Active streaks</div><div class="ov-kpi-val">' + activeStreaks + '</div></div>' +
            '<div class="ov-kpi-card" style="border-left-color:#1C2333"><div class="ov-kpi-lbl">Avg. current streak</div><div class="ov-kpi-val">' + avgCur.toFixed(2) + '</div></div>' +
            '<div class="ov-kpi-card" style="border-left-color:#1C2333"><div class="ov-kpi-lbl">Avg. longest streak</div><div class="ov-kpi-val">' + avgLng.toFixed(2) + '</div></div>' +
        '</div>';

        html += '<div class="gam-dept-avg-card"><div class="gam-dept-avg-title">Department averages</div>';
        Object.keys(deptMap).forEach(function(dept) {
            var dm = deptMap[dept];
            html += '<div class="gam-dept-avg-row"><span>' + dept + '</span>' +
                    '<span class="gam-dept-avg-right">Current ' + (dm.cur / dm.n).toFixed(2) + ' | longest ' + (dm.lng / dm.n).toFixed(2) + '</span></div>';
        });
        html += '</div><div id="gamStreaksGrid" class="dash-grid"></div>';
        el.innerHTML = html;

        _gamInitCascadingDropdowns('gamStreakDeptBox', 'gamStreakPlayerInput', function() { renderGamificationStreaks(); });

        window.gamStreakNameFilter = function() {
            var inp = document.getElementById('gamStreakPlayerInput');
            _gamNameFilter = inp ? inp.value : '';
            renderGamificationStreaks();
        };

        $('#gamStreaksGrid').dxDataGrid({
            dataSource: data, showBorders: false, showRowLines: true,
            showColumnLines: false, rowAlternationEnabled: false, hoverStateEnabled: true,
            columns: [
                { dataField: 'name',       caption: 'PLAYER',          minWidth: 120 },
                { dataField: 'dept',       caption: 'DEPARTMENT',      minWidth: 110 },
                { dataField: 'current',    caption: 'CURRENT STREAK',  width: 130, alignment: 'right' },
                { dataField: 'longest',    caption: 'LONGEST STREAK',  width: 130, alignment: 'right' },
                { dataField: 'activeDays', caption: 'ACTIVE DAYS',     width: 110, alignment: 'right' },
                { dataField: 'games',      caption: 'GAMES COMPLETED', width: 135, alignment: 'right' }
            ],
            paging: { enabled: false }, sorting: { mode: 'single' }, headerFilter: { visible: false },
            searchPanel: { visible: false }
        });
    }

    /* ── Play days ───────────────────────────────────────────── */

    var _PDY_THRESHOLD = 5;

    function _gamWeekRangeLabel() {
        var start = new Date(2026, 5, 8);
        start.setDate(start.getDate() + _gamWeekIdx * 7);
        var end = new Date(start); end.setDate(end.getDate() + 5);
        function fmt(d) {
            var m = d.getMonth() + 1, dd = d.getDate();
            return d.getFullYear() + '-' + (m < 10 ? '0' + m : m) + '-' + (dd < 10 ? '0' + dd : dd);
        }
        return 'Week: ' + fmt(start) + ' to ' + fmt(end);
    }

    function _gamPlayDaysRow(playerName, points) {
        var seed = playerName.charCodeAt(0) + playerName.length * 7 + points + (_gamWeekIdx + 5) * 31;
        var days = [], count = 0;
        for (var d = 0; d < 6; d++) {
            var played = Math.abs(Math.sin(seed * 11 + d * 17)) > 0.40;
            days.push(played);
            if (played) count++;
        }
        return { days: days, count: count, met: count >= _PDY_THRESHOLD };
    }

    function renderGamificationPlayDays() {
        var el = document.getElementById('dashGamPlayDays');
        if (!el) return;
        var players = (COMPANY_PLAYERS[state.companyId] || COMPANY_PLAYERS[DEFAULT_COMPANY_ID]).slice();

        players.sort(function(a, b) {
            return _gamPlayDaysRow(b.name, b.points).count - _gamPlayDaysRow(a.name, a.points).count;
        });

        var canNewer = _gamWeekIdx < 0;

        var pdyMidHtml =
            '<div class="gam-ctrl-weeknav">' +
                '<button class="gam-week-nav-btn" onclick="window.gamWeekOlder()">&lt;</button>' +
                '<span class="gam-week-label">' + _gamWeekRangeLabel() + '</span>' +
                '<button class="gam-week-nav-btn' + (!canNewer ? ' gam-week-nav-btn--disabled' : '') + '"' + (!canNewer ? ' disabled' : '') + ' onclick="window.gamWeekNewer()">&gt;</button>' +
            '</div>' +
            '<span class="gam-threshold-lbl">Threshold: ' + _PDY_THRESHOLD + ' days per week</span>';
        var html = _gamControlsRowHtml('gamPdyDeptBox', 'gamPdyPlayerInput', 'gamPdyNameFilter',
                       pdyMidHtml, null, null);

        var DAY_LABELS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        html += '<table class="gam-table gam-pdy-table" id="gamPdyTable"><thead><tr>' +
            '<th>PLAYER</th><th>DEPARTMENT</th><th style="text-align:right">DAYS PLAYED</th>' +
            '<th style="text-align:center">MET THRESH...</th>';
        DAY_LABELS.forEach(function(d) { html += '<th style="text-align:center">' + d + '</th>'; });
        html += '</tr></thead><tbody>';

        players.forEach(function(p) {
            var pdr = _gamPlayDaysRow(p.name, p.points);
            html += '<tr><td><span class="plr-name-link">' + p.name + '</span></td><td>' + p.dept + '</td>' +
                    '<td style="text-align:right">' + pdr.count + '</td>' +
                    '<td style="text-align:center">' + (pdr.met ? '<span class="gam-check">&#10003;</span>' : '') + '</td>';
            pdr.days.forEach(function(played) {
                html += '<td style="text-align:center">' + (played ? '<span class="gam-check">&#10003;</span>' : '') + '</td>';
            });
            html += '</tr>';
        });
        html += '</tbody></table>';
        el.innerHTML = html;

        _gamInitCascadingDropdowns('gamPdyDeptBox', 'gamPdyPlayerInput', function() { renderGamificationPlayDays(); });

        window.gamPdyApplyFilter = function() {
            var nd = _gamDeptFilter.toLowerCase(), nn = _gamNameFilter.toLowerCase(), ns = _gamSearchFilter.toLowerCase();
            document.querySelectorAll('#gamPdyTable tbody tr').forEach(function(row) {
                var name = (row.cells[0] ? row.cells[0].textContent : '').toLowerCase();
                var dept = (row.cells[1] ? row.cells[1].textContent : '').toLowerCase();
                row.style.display = (!nd || dept === nd) && (!nn || name.indexOf(nn) >= 0) && (!ns || (name + ' ' + dept).indexOf(ns) >= 0) ? '' : 'none';
            });
        };
        window.gamPdyNameFilter = function() {
            var inp = document.getElementById('gamPdyPlayerInput');
            _gamNameFilter = inp ? inp.value : '';
            window.gamPdyApplyFilter();
        };
        window.gamPdySearch = function() {
            var inp = document.getElementById('gamPdySearchInput');
            _gamSearchFilter = inp ? inp.value : '';
            window.gamPdyApplyFilter();
        };
    }

    /* ── Gamification nav handlers ───────────────────────────── */

    window.gamPeriodOlder = function() {
        if (_gamPeriodIdx > 0) { _gamPeriodIdx--; renderGamificationLeagues(); renderGamificationScoreboard(); }
    };
    window.gamPeriodNewer = function() {
        if (_gamPeriodIdx < PERIODS.length - 1) { _gamPeriodIdx++; renderGamificationLeagues(); renderGamificationScoreboard(); }
    };
    window.gamStreakGran = function(gran) { _gamStreakGran = gran; renderGamificationStreaks(); };
    window.gamWeekOlder  = function() { _gamWeekIdx--; renderGamificationPlayDays(); };
    window.gamWeekNewer  = function() { if (_gamWeekIdx < 0) { _gamWeekIdx++; renderGamificationPlayDays(); } };
    window.gamNameFilter = function() {
        var el = document.getElementById('gamPlayerNameInput');
        _gamNameFilter = el ? el.value : '';
        _applyGamFilter();
    };
    window.gamSearchFilter = function() {
        var el = document.getElementById('gamSearchInput');
        _gamSearchFilter = el ? el.value : '';
        _applyGamFilter();
    };
    window.gamExportExcel = function() { DevExpress.ui.notify('Excel export coming soon.', 'info', 2000); };

    /* ── Full refresh ────────────────────────────────────────── */

    function refreshAll() {
        renderPeriodTabs();
        renderHeaderStats();
        renderSummaryOverview();
        renderSummaryTrends();
        renderSummaryForecasts();
        renderSummaryForecastAnomaliesTab();
        renderForecastsAnomaliesPanel('dashSummaryForecastAnomalies', state.companyId);
        renderForecastsAnomaliesPanel('dashPlayersForecastAnomalies', state.companyId);
        renderDeptForecastsAnomalies();
        renderGamesOverview();
        renderGamesAnomalies();
        renderTrendsCharts('dashGamesTrends', 'gms');
        renderPlayersOverview();
        renderPlayersInactive();
        renderPlayersGamesPlayed();
        renderPlayersForecasts();
        renderPlayersAnomalies();
        renderPlayersTrends();
        renderPlayersLeave();
        renderDepartmentsOverview();
        renderDeptForecasts();
        renderDeptAnomalies();
        renderTrendsCharts('dashDeptTrends', 'dpt');
        renderRegionalOverview();
        renderGamificationLeagues();
        renderGamificationScoreboard();
        renderGamificationStreaks();
        renderGamificationPlayDays();
    }

    /* Exposed so script-dashboard2.js can re-render on tab click */
    window._dashApplySubPanel = function(key) { _applySubPanel(key); };

    window.refreshForecastsAnomalies = function() {
        renderForecastsAnomaliesPanel('dashSummaryForecastAnomalies', state.companyId);
        renderForecastsAnomaliesPanel('dashPlayersForecastAnomalies', state.companyId);
        renderForecastsAnomaliesPanel('dashGamesAnomalies', state.companyId);
        renderDeptForecastsAnomalies();
    };

    /* ── Tab/period handlers ─────────────────────────────────── */

    window.dashPeriod = function(period) {
        state.period = period;
        _dataCache   = {};
        refreshAll();
    };

    /* ── Left nav + sub-tab helpers ─────────────────────────── */

    var MAIN_TABS = [
        { key: 'summary',      label: 'Summary' },
        { key: 'players',      label: 'Players' },
        { key: 'games',        label: 'Games' },
        { key: 'departments',  label: 'Departments' },
        { key: 'gamification', label: 'Gamification' }
    ];

    function getSubTabItems(mainTab) {
        var base = [
            { text: 'Overview',   key: 'overview' },
            { text: 'Trends',     key: 'trends' },
            { text: 'Forecasts',  key: 'forecasts' },
            { text: 'Anomalies',  key: 'anomalies' }
        ];
        if (mainTab === 'players') {
            return [
                { text: 'Overview',           key: 'overview' },
                { text: 'Trends',             key: 'trends' },
                { text: 'Forecasts',          key: 'forecasts' },
                { text: 'Anomalies',          key: 'anomalies' },
                { text: 'Inactive',           key: 'inactive' },
                { text: 'Game coverage',      key: 'gamecoverage' },
                { text: 'Leave & exclusions', key: 'leave' }
            ];
        }
        if (mainTab === 'gamification') {
            return [
                { text: 'Leagues',    key: 'leagues'    },
                { text: 'Scoreboard', key: 'scoreboard' },
                { text: 'Streaks',    key: 'streaks'    },
                { text: 'Play days',  key: 'playdays'   }
            ];
        }
        return base;
    }

    var _dashSubTabsInst  = null;
    var _playerTrendsGran = 'daily';
    var _gamesTrendsGran  = 'daily';
    var _deptTrendsGran   = 'daily';

    window.setPlayerTrendsGran = function(g) { _playerTrendsGran = g; renderPlayersTrends(); };
    window.setGamesTrendsGran  = function(g) { _gamesTrendsGran  = g; renderTrendsCharts('dashGamesTrends', 'gms'); };
    window.setDeptTrendsGran   = function(g) { _deptTrendsGran   = g; renderTrendsCharts('dashDeptTrends',  'dpt'); };

    function dashRenderLeftNav() {
        var el = document.getElementById('dashLeftNav');
        if (!el) return;
        el.innerHTML = MAIN_TABS.map(function(t) {
            var cls = 'dash-left-nav-item' + (state.mainTab === t.key ? ' active' : '');
            return '<button class="' + cls + '" onclick="dashMainTab(\'' + t.key + '\')">' + t.label + '</button>';
        }).join('');
    }

    window.dashMainTab = function(tab) {
        state.mainTab = tab;
        var subItems  = getSubTabItems(tab);
        var firstSub  = subItems.length ? subItems[0].key : 'overview';
        state.subTab  = firstSub;
        dashRenderLeftNav();
        /* sync sidebar sub-items */
        document.querySelectorAll('[data-tab]').forEach(function(el) {
            el.classList.toggle('active', el.getAttribute('data-tab') === tab);
        });
        if (_dashSubTabsInst) {
            _dashSubTabsInst.option({
                dataSource: subItems,
                selectedIndex: 0,
                selectedItemKeys: subItems.length ? [subItems[0].key] : []
            });
        }
        document.querySelectorAll('.dash-panel').forEach(function(el) {
            el.classList.toggle('active', el.dataset.panel === tab);
        });
        document.querySelectorAll('.dash-panel.active .dash-sub-panel').forEach(function(el) {
            el.classList.toggle('active', el.dataset.sub === firstSub);
        });
    };

    window.toggleReportsNav = function() {
        var g = document.getElementById('reportsNavGroup');
        if (g) g.classList.toggle('open');
    };

    /* Switch only the panel visibility — called from onItemClick where DX manages its own selection */
    function _applySubPanel(sub) {
        state.subTab = sub;
        document.querySelectorAll('.dash-sub-panel').forEach(function(el) {
            el.classList.toggle('active', el.dataset.sub === sub);
        });
        if (sub === 'players' && typeof window.playerSection === 'function') {
            /* Re-clicking Players resets the secondary nav to overview */
            window.playerSection('overview');
        } else if (sub !== 'players') {
            /* Switching to a different main tab clears the outline state */
            var subBar = document.querySelector('.dash-subtabs-bar');
            if (subBar) subBar.classList.remove('plr-in-subsection');
        }
    }

    /* Programmatic switch (e.g. from dashMainTab) — also updates the widget's selectedIndex */
    window.dashSubTab = function(sub) {
        _applySubPanel(sub);
        if (_dashSubTabsInst) {
            var items = getSubTabItems(state.mainTab);
            var idx = 0;
            items.forEach(function(item, i) { if (item.key === sub) idx = i; });
            _dashSubTabsInst.option('selectedIndex', idx);
        }
    };

    window.dashReport    = function() { alert('Report export coming soon.'); };
    window.dashPdfReport = function() { alert('PDF export coming soon.'); };

    window.dashTogglePeriodMode = function() { /* period toggle removed — both controls always visible */ };

    /* ── Scope integration ───────────────────────────────────── */

    function applyScope(companyId) {
        var id = parseInt(companyId, 10);
        if (!id || !COMPANY_PROFILES[id] || id === state.companyId) return;
        state.companyId = id;
        _dataCache = {};
        applyCompanyTheme(id);
        refreshAll();
    }

    /* ── Init ────────────────────────────────────────────────── */

    $(function() {
        try {
            var stored = JSON.parse(localStorage.getItem('gameon.scope') || '{}');
            if (stored.companyId && COMPANY_PROFILES[stored.companyId]) state.companyId = stored.companyId;
        } catch(e) {}
        applyCompanyTheme(state.companyId);

        /* Date range box */
        $('#dashDateRangeBox').dxDateRangeBox({
            startDate:      _ALL_MONTHS_RANGE[0],
            endDate:        _ALL_MONTHS_RANGE[1],
            displayFormat:  'M/d/yyyy',
            startDateLabel: 'From',
            endDateLabel:   'To',
            labelMode:      'floating',
            stylingMode:    'outlined',
            min:            new Date(2026,0,1),
            max:            new Date(2026,5,30),
            width:          320,
            onValueChanged: function(e) {
                var s = e.value[0], d = e.value[1];
                if (!s || !d) return;
                var matched = 'All Months';
                Object.keys(_MONTH_RANGES).forEach(function(k) {
                    var r = _MONTH_RANGES[k];
                    if (s.getFullYear() === r[0].getFullYear() && s.getMonth() === r[0].getMonth() &&
                        d.getFullYear() === r[1].getFullYear() && d.getMonth() === r[1].getMonth()) matched = k;
                });
                if (matched !== state.period) {
                    state.period = matched; _dataCache = {};
                    try {
                        var sel2 = $('#dashPeriodMonths').dxSelectBox('instance');
                        if (sel2) sel2.option('value', matched);
                    } catch(e2) {}
                    refreshAll();
                }
            }
        });

        /* Month select dropdown */
        var _MONTH_OPTIONS = [
            { key: 'All Months',   text: 'All Months'  },
            { key: 'January2026',  text: 'Jan 2026' },
            { key: 'February2026', text: 'Feb 2026' },
            { key: 'March2026',    text: 'Mar 2026' },
            { key: 'April2026',    text: 'Apr 2026' },
            { key: 'May2026',      text: 'May 2026' },
            { key: 'June2026',     text: 'Jun 2026' }
        ];
        $('#dashPeriodMonths').dxSelectBox({
            dataSource:    _MONTH_OPTIONS,
            valueExpr:     'key',
            displayExpr:   'text',
            value:         state.period,
            width:         140,
            stylingMode:   'outlined',
            searchEnabled: false,
            onValueChanged: function(e) {
                if (e.value && e.value !== state.period) dashPeriod(e.value);
            }
        });

        /* Left vertical nav */
        dashRenderLeftNav();

        /* Sub-tab bar */
        var _initSubItems = getSubTabItems(state.mainTab);
        var _firstSubKey  = _initSubItems.length ? _initSubItems[0].key : null;
        _dashSubTabsInst = $('#dashSubTabs').dxTabs({
            dataSource: _initSubItems,
            keyExpr: 'key',
            displayExpr: 'text',
            scrollingEnabled: false,
            onItemClick: function(e) {
                if (e.itemData) _applySubPanel(e.itemData.key);
            }
        }).dxTabs('instance');
        /* Force first-tab selection after widget has finished rendering */
        if (_firstSubKey) {
            _dashSubTabsInst.option('selectedItemKeys', [_firstSubKey]);
        }

        /* Header buttons */
        $('#dashPdfBtn').dxButton({
            text: 'Export',
            icon: 'exportxlsx',
            stylingMode: 'outlined',
            onClick: function() { dashPdfReport(); }
        });

        refreshAll();
        document.addEventListener('gameon:scope-change', function(e) {
            if (e.detail && e.detail.companyId != null) applyScope(e.detail.companyId);
        });
    });

}());
