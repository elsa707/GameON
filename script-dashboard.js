(function () {
    'use strict';

    var BASE_GAMES = [
        'Handling Sales Objections','Emotional Intelligence','Step 4 Present',
        'Step 5 Test Drive','Step 7 Closing & OTP','Step 2 Meet and Greet',
        'Step 8 Finance','7 Habits','Step 1 Introduction','Step 3 Needs Analysis',
        'Step 6 Trade-in Appraisal','Customer Service Excellence','Product Knowledge',
        'Compliance & Ethics','Digital Tools Proficiency','Team Leadership','Financial Products'
    ];

    var PERIODS = ['All Months','January2026','February2026','March2026','April2026','May2026','June2026'];
    var MONTHS_LABELS = ['2026-01','2026-02','2026-03','2026-04','2026-05','2026-06'];

    var NASPERS_MONTHLY = {
        players: [1, 5, 7, 8, 15, 9],
        plays:   [320, 380, 430, 480, 520, 370],
        acc:     [40, 56, 65, 70, 75, 78]
    };

    var NASPERS_DATA = {
        'All Months':    { plays:2300, avgAcc:71.4, userAns:0,
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
            { name:'BB Gezina Nissan - New Vehicle Sales',          players:7, avgAcc:73.8, points:4923 },
            { name:'BB Gezina Nissan - Used Vehicle Sales',         players:5, avgAcc:69.0, points:2585 },
            { name:'BB Gezina Nissan - CRM',                        players:1, avgAcc:62.0, points:456  },
            { name:'BB Gezina Nissan - Used Vehicle Sales Manager', players:1, avgAcc:67.7, points:88   },
            { name:'BB Gezina Nissan - New Vehicle Sales Manager',  players:1, avgAcc:76.0, points:19   },
            { name:'BB Gezina Nissan - DP',                         players:1, avgAcc:53.3, points:8    },
            { name:'Automotive Sales Excellence',                   players:1, avgAcc:40.0, points:2    }
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

    function areaChartConfig(data, color, isPercent, h) {
        var ds = MONTHS_LABELS.map(function(l, i) { return { arg: l, val: data[i] }; });
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

    /* ── Render: period tabs ─────────────────────────────────── */

    function renderPeriodTabs() {
        document.getElementById('dashPeriodTabs').innerHTML = PERIODS.map(function(p) {
            return '<button class="dash-period-tab' + (p===state.period?' active':'') +
                   '" onclick="dashPeriod(\''+esc(p)+'\')">' + esc(p) + '</button>';
        }).join('');
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
        var deptRaw  = COMPANY_DEPT_PLAYERS[state.companyId] || COMPANY_DEPT_PLAYERS[DEFAULT_COMPANY_ID];
        var players  = COMPANY_PLAYERS[state.companyId] || COMPANY_PLAYERS[DEFAULT_COMPANY_ID];
        var trend    = getMonthlyTrend(state.companyId);
        var allD     = getPeriodData(state.companyId, 'All Months');
        var scale    = allD && allD.plays > 0 ? d.plays / allD.plays : 1;

        var top8 = d.perf.map(function(p, i) { return { name: BASE_GAMES[i], plays: p.plays }; })
                         .sort(function(a, b) { return b.plays - a.plays; }).slice(0, 8);

        var kpiHtml =
            '<div class="kpi-grid">' +
            kpiCard('#e11d48', 'Participation',  partRate + '%',            active + ' of ' + reg + ' registered', partRate) +
            kpiCard('#16a34a', 'Active Players', active,                    fmtPlays(d.plays) + ' total plays',    null) +
            kpiCard('#2563eb', 'Total Plays',    fmtPlays(d.plays),         profile.dealers + ' dealers',          null) +
            kpiCard('#0891b2', 'Avg Accuracy',   d.avgAcc.toFixed(1) + '%', 'answer accuracy',                     null) +
            kpiCard('#d97706', 'Inactive',       inactive,                  (inactive/reg*100).toFixed(1) + '% of registered', null) +
            '</div>';

        var deptRows = depts.map(function(dep, i) {
            var dd = deptRaw[i] || {};
            var ar = dep.total > 0 ? dep.active / dep.total * 100 : 0;
            var bc = ar >= 70 ? '#22c55e' : ar >= 40 ? '#f59e0b' : '#ef4444';
            return '<tr>' +
                '<td class="summary-dept-name">' + esc(dep.name) + '</td>' +
                '<td class="summary-dept-fraction">' + dep.active + ' / ' + dep.total + '</td>' +
                '<td><div class="summary-act-cell"><div class="summary-act-track"><div class="summary-act-fill" style="width:' + Math.min(100, ar).toFixed(1) + '%;background:' + bc + '"></div></div><span class="summary-act-pct">' + ar.toFixed(0) + '%</span></div></td>' +
                '<td style="font-weight:600">' + (dd.avgPoints || 0).toLocaleString() + '</td>' +
            '</tr>';
        }).join('');

        var lbRows = players.map(function(p, i) {
            var sp = Math.max(1, Math.round(p.points * scale));
            var rc = i === 0 ? 'r1' : i === 1 ? 'r2' : i === 2 ? 'r3' : 'rn';
            var ac = p.accuracy >= 75 ? '#16a34a' : p.accuracy >= 60 ? '#f59e0b' : '#ef4444';
            return '<div class="lb-row">' +
                '<div class="lb-rank ' + rc + '">' + (i + 1) + '</div>' +
                '<div class="lb-info"><div class="lb-name">' + esc(p.name) + '</div><div class="lb-dept">' + esc(p.dept) + '</div></div>' +
                '<div class="lb-pts">' + sp.toLocaleString() + '</div>' +
                '<div class="lb-acc"><div class="lb-acc-track"><div class="lb-acc-fill" style="width:' + p.accuracy + '%;background:' + ac + '"></div></div><span class="lb-acc-pct">' + p.accuracy.toFixed(1) + '%</span></div>' +
            '</div>';
        }).join('');

        var chartH = Math.max(180, top8.length * 28 + 10);

        el.innerHTML =
            '<div class="summary-page">' +
            kpiHtml +
            '<div class="summary-2col">' +
                '<div class="panel-card"><div class="panel-card-hd">Monthly Plays</div><div class="chart-container"><div id="sumChartPlays"></div></div></div>' +
                '<div class="panel-card"><div class="panel-card-hd">Top Games by Plays</div><div class="chart-container"><div id="sumChartTopGames"></div></div></div>' +
            '</div>' +
            '<div class="summary-2col">' +
                '<div class="panel-card"><div class="panel-card-hd">Department Breakdown</div>' +
                '<table class="summary-dept-table"><thead><tr><th>Department</th><th>Active</th><th>Activity</th><th>Avg Pts</th></tr></thead><tbody>' + deptRows + '</tbody></table></div>' +
                '<div class="panel-card"><div class="panel-card-hd">Player Leaderboard <span class="panel-card-count">' + players.length + ' players</span></div>' +
                '<div class="lb-list">' + lbRows + '</div></div>' +
            '</div>' +
            '</div>';

        makeChart('sumChartPlays', areaChartConfig(trend.plays, 'rgb(37,99,235)', false));
        makeChart('sumChartTopGames', {
            opts: {
                dataSource: top8.map(function(g) { return { name: g.name, plays: g.plays }; }),
                series: [{ argumentField: 'name', valueField: 'plays', type: 'bar', color: '#e11d48', cornerRadius: 3 }],
                rotated: true,
                commonAxisSettings: { tick: { visible: false }, label: { font: { size: 10, color: '#64748b' } } },
                argumentAxis: { grid: { visible: false } },
                valueAxis:    { grid: { color: 'rgba(200,200,200,0.3)', visible: true } },
                legend:  { visible: false },
                tooltip: { enabled: true },
                size:    { height: chartH }
            }
        });
    }

    /* ── Render: Summary > Trends ────────────────────────────── */

    function renderSummaryTrends() {
        var el = document.getElementById('dashSummaryTrends');
        if (!el) return;
        var trend = getMonthlyTrend(state.companyId);

        el.innerHTML =
            '<div class="summary-page">' +
            '<div class="summary-2col">' +
                '<div class="panel-card"><div class="panel-card-hd">Player Growth</div><div class="chart-container"><div id="chartSumPlayerGrowth"></div></div></div>' +
                '<div class="panel-card"><div class="panel-card-hd">Monthly Plays</div><div class="chart-container"><div id="chartSumMonthlyPlays"></div></div></div>' +
            '</div>' +
            '<div class="panel-card" style="margin-top:14px"><div class="panel-card-hd">Accuracy Trend</div><div class="chart-container"><div id="chartSumAccTrend"></div></div></div>' +
            '</div>';

        makeChart('chartSumPlayerGrowth', areaChartConfig(trend.players, 'rgb(229,62,62)',  false));
        makeChart('chartSumMonthlyPlays', areaChartConfig(trend.plays,   'rgb(37,99,235)',  false));
        makeChart('chartSumAccTrend',     areaChartConfig(trend.acc,     'rgb(49,130,206)', true));
    }

    /* ── Render: Summary > Forecast ──────────────────────────── */

    function renderSummaryForecast() {
        var el = document.getElementById('dashSummaryForecast');
        if (!el) return;
        var trend = getMonthlyTrend(state.companyId);
        var lr    = linearRegression(trend.plays);

        var forecastLabels = ['2026-07','2026-08','2026-09','2026-10'];
        var allLabels  = MONTHS_LABELS.concat(forecastLabels);
        var allActual  = trend.plays.concat([undefined,undefined,undefined,undefined]);
        var allForecast = [undefined,undefined,undefined,undefined,undefined,undefined].concat(
            forecastLabels.map(function(_, i) {
                return Math.max(0, Math.round(lr.intercept + lr.slope * (trend.plays.length + i)));
            })
        );
        /* bridge: connect last actual to first forecast */
        allForecast[trend.plays.length - 1] = trend.plays[trend.plays.length - 1];

        var ds = allLabels.map(function(l, i) { return { arg: l, actual: allActual[i], forecast: allForecast[i] }; });

        el.innerHTML =
            '<div class="summary-page">' +
            '<div class="panel-card"><div class="panel-card-hd">Play Volume Forecast' +
            '<span style="font-size:11px;color:#94a3b8;font-weight:400;margin-left:8px">· dashed = projected</span></div>' +
            '<div class="chart-container"><div id="chartSumForecast"></div></div></div>' +
            '</div>';

        makeChart('chartSumForecast', {
            opts: {
                dataSource: ds,
                series: [
                    { argumentField: 'arg', valueField: 'actual',   type: 'area', color: '#e11d48', opacity: 0.15, name: 'Actual',   point: { visible: true, size: 5 } },
                    { argumentField: 'arg', valueField: 'forecast', type: 'line', color: '#3182ce', dashStyle: 'dash', name: 'Forecast', point: { visible: true, size: 4 } }
                ],
                commonAxisSettings: {
                    grid: { color: 'rgba(200,200,200,0.25)', visible: true },
                    tick: { visible: false },
                    label: { font: { size: 10, color: '#64748b' } }
                },
                legend:  { visible: false },
                tooltip: { enabled: true },
                size:    { height: 320 }
            }
        });
    }

    /* ── Render: Summary > Anomalies ─────────────────────────── */

    function renderSummaryAnomalies() {
        var el = document.getElementById('dashSummaryAnomalies');
        if (!el) return;
        var profile  = COMPANY_PROFILES[state.companyId] || COMPANY_PROFILES[DEFAULT_COMPANY_ID];
        var reg      = COMPANY_REGISTERED[state.companyId] || profile.players;
        var active   = profile.players;
        var inactive = Math.max(0, reg - active);
        var depts    = getDeptPlayers(state.companyId);
        var trend    = getMonthlyTrend(state.companyId);

        var deptsZero = depts.filter(function(dep) { return dep.active === 0; }).length;
        var maxPlay   = Math.max.apply(null, trend.plays);
        var lastPlay  = trend.plays[trend.plays.length - 1];
        var dropPct   = maxPlay > 0 ? (maxPlay - lastPlay) / maxPlay * 100 : 0;

        var anomalies = [];
        if (inactive > 0)  anomalies.push({ sev:'medium', icon:'fas fa-user-clock',       text: inactive + ' players (' + (inactive/reg*100).toFixed(1) + '%) inactive' });
        if (deptsZero > 0) anomalies.push({ sev:'medium', icon:'fas fa-building',         text: deptsZero + ' dept' + (deptsZero > 1 ? 's' : '') + ' with no active players' });
        if (dropPct > 25)  anomalies.push({ sev:'high',   icon:'fas fa-arrow-trend-down', text: 'Play volume dropped ' + dropPct.toFixed(1) + '% from peak' });

        var itemsHtml = anomalies.length === 0
            ? '<div class="anomaly-ok"><i class="fas fa-circle-check"></i> No anomalies detected for this period.</div>'
            : anomalies.map(function(a) {
                return '<div class="anomaly-item ' + a.sev + '">' +
                    '<div class="anomaly-item-icon"><i class="' + a.icon + '"></i></div>' +
                    '<div class="anomaly-item-text">' + esc(a.text) + '</div>' +
                    '<div class="anomaly-item-badge ' + a.sev + '">' + a.sev.toUpperCase() + '</div>' +
                '</div>';
            }).join('');

        el.innerHTML =
            '<div class="summary-page">' +
            '<div class="panel-card"><div class="panel-card-hd">Anomalies <span class="panel-card-count">' + anomalies.length + ' found</span></div>' +
            '<div class="anomaly-list">' + itemsHtml + '</div></div>' +
            '</div>';
    }

    /* ── Render: shared Trends charts (Players / Games / Dept) ── */

    function renderTrendsCharts(containerId, prefix) {
        var el = document.getElementById(containerId);
        if (!el) return;
        var trend = getMonthlyTrend(state.companyId);
        var ds    = MONTHS_LABELS.map(function(l, i) { return { arg: l, val: trend.players[i] }; });
        el.innerHTML =
            '<div class="trends-top-grid">' +
                '<div class="chart-card"><div class="chart-card-hd">Player Activity</div><div class="chart-container"><div id="'+prefix+'ChartActivity"></div></div></div>' +
                '<div class="chart-card"><div class="chart-card-hd">Accuracy Trend</div><div class="chart-container"><div id="'+prefix+'ChartAcc"></div></div></div>' +
            '</div>' +
            '<div class="chart-card" style="margin-top:14px"><div class="chart-card-hd">Combined Engagement Overview</div><div class="chart-container"><div id="'+prefix+'ChartEngagement"></div></div></div>';

        makeChart(prefix+'ChartActivity', areaChartConfig(trend.players, 'rgb(229,62,62)',  false));
        makeChart(prefix+'ChartAcc',      areaChartConfig(trend.acc,     'rgb(49,130,206)', true));
        makeChart(prefix+'ChartEngagement', {
            opts: {
                dataSource: ds,
                series: [{ argumentField: 'arg', valueField: 'val', type: 'bar', color: '#e53e3e', cornerRadius: 3 }],
                commonAxisSettings: {
                    grid: { visible: false },
                    tick: { visible: false },
                    label: { font: { size: 10, color: '#64748b' } }
                },
                valueAxis: { grid: { color: 'rgba(200,200,200,0.2)', visible: true } },
                legend:  { visible: false },
                tooltip: { enabled: true },
                size:    { height: 180 }
            }
        });
    }

    /* ── Render: Games > Overview ────────────────────────────── */

    function renderGamesOverview() {
        var d = getPeriodData(state.companyId, state.period);
        if (!d) return;
        var rows = BASE_GAMES.map(function(name,i) {
            var p = d.perf[i]; var col = accColor(p.accuracy);
            return '<tr><td class="td-game-name">'+esc(name)+'</td><td class="td-plays">'+p.plays+'</td>' +
                '<td><div class="acc-cell"><div class="acc-bar-track"><div class="acc-bar-fill '+col+'" style="width:'+p.accuracy+'%"></div></div><span class="acc-pct">'+p.accuracy+'%</span></div></td>' +
                '<td class="td-playtime">'+p.playTime.toFixed(1)+'</td></tr>';
        }).join('');
        document.getElementById('dashGamesOverview').innerHTML =
            '<div class="dash-metrics">' +
                metricCard('Games Available', BASE_GAMES.length, '', 'fas fa-gamepad', 'pink') +
                metricCard('Total Plays', fmtPlays(d.plays), 'green', 'fas fa-chart-line', 'blue') +
                metricCard('Avg Answer Acc', d.avgAcc.toFixed(1)+'%', 'teal', 'fas fa-bullseye', 'teal') +
                metricCard('User Answers', d.userAns, '', 'fas fa-list-ol', 'indigo') +
            '</div>' +
            '<div class="dash-table-card"><div class="dash-table-card-hd">Game Performance</div>' +
            '<table class="dash-perf-table"><thead><tr><th>Game Name</th><th>Plays</th><th>Answer Accuracy</th><th>Play Time (Min)</th></tr></thead>' +
            '<tbody>'+rows+'</tbody></table></div>';
    }

    /* ── Render: Players > Overview ──────────────────────────── */

    function renderPlayersOverview() {
        var players = COMPANY_PLAYERS[state.companyId] || COMPANY_PLAYERS[DEFAULT_COMPANY_ID];
        var profile = COMPANY_PROFILES[state.companyId] || COMPANY_PROFILES[DEFAULT_COMPANY_ID];
        var d       = getPeriodData(state.companyId, state.period);
        var reg     = COMPANY_REGISTERED[state.companyId] || profile.players;
        var totalInact = Math.max(0, reg - profile.players);
        var allD    = getPeriodData(state.companyId, 'All Months');
        var scale   = allD && allD.plays > 0 ? d.plays / allD.plays : 1;

        var badgeColors = ['#d97706','#6b7280','#7f1d1d'];
        var badgeBg     = ['#fef3c7','#f1f5f9','#fee2e2'];
        var top3 = players.slice(0,3);

        var spotlightHtml = '<div class="player-spotlight-row">' + top3.map(function(p,i) {
            return '<div class="player-spotlight-card">' +
                '<div class="player-spotlight-rank" style="background:'+badgeBg[i]+';color:'+badgeColors[i]+'">'+(i+1)+'</div>' +
                '<div class="player-spotlight-body">' +
                    '<div class="player-spotlight-name">'+esc(p.name)+'</div>' +
                    '<div class="player-spotlight-dept">'+esc(p.dept)+'</div>' +
                    '<div class="player-spotlight-pts" style="color:'+badgeColors[i]+'">' + Math.round(p.points*scale).toLocaleString()+' pts</div>' +
                '</div></div>';
        }).join('') + '</div>';

        var rows = players.map(function(p,i) {
            var sp  = Math.max(1, Math.round(p.points * scale));
            var sg  = Math.max(1, Math.round(p.games  * scale));
            var col = accColor(p.accuracy);
            return '<tr>' +
                '<td class="player-rank">'+(i+1)+'</td>' +
                '<td class="player-name">'+esc(p.name)+'</td>' +
                '<td class="player-dept">'+esc(p.dept)+'</td>' +
                '<td class="player-region">'+esc(p.region||'—')+'</td>' +
                '<td class="td-points">'+sp.toLocaleString()+'</td>' +
                '<td><div class="acc-cell"><div class="acc-bar-track"><div class="acc-bar-fill '+col+'" style="width:'+p.accuracy+'%"></div></div><span class="acc-pct">'+p.accuracy.toFixed(1)+'%</span></div></td>' +
                '<td class="td-plays">'+sg+'</td>' +
            '</tr>';
        }).join('');

        document.getElementById('dashPlayersPanel').innerHTML =
            '<div class="dash-metrics">' +
                '<div class="metric-card"><div class="metric-card-body"><div class="metric-lbl">Active Players</div><div class="metric-val">'+profile.players+'</div><div style="font-size:11px;color:var(--text-secondary);margin-top:2px">'+fmtPlays(d.plays)+' total plays</div></div><div class="metric-icon pink"><i class="fas fa-users"></i></div></div>' +
                metricCard('Avg Accuracy', d.avgAcc.toFixed(1)+'%', 'green', 'fas fa-bullseye', 'teal', 'across all plays') +
                metricCard('Dealers', profile.dealers, '', 'fas fa-building', 'blue', 'participating') +
                '<div class="metric-card"><div class="metric-card-body"><div class="metric-lbl">Inactive</div><div class="metric-val" style="color:#d97706">'+totalInact+'</div><div style="font-size:11px;color:var(--text-secondary);margin-top:2px">need re-engagement</div></div><div class="metric-icon" style="background:#fef3c7;color:#d97706"><i class="fas fa-circle-exclamation"></i></div></div>' +
            '</div>' +
            spotlightHtml +
            '<div class="dash-table-card"><div class="dash-table-card-hd">Full Player Rankings</div>' +
            '<table class="dash-players-table"><thead><tr><th>Rank</th><th>Player</th><th>Dept</th><th>Region</th><th>Points</th><th>Accuracy</th><th>Games</th></tr></thead>' +
            '<tbody>'+rows+'</tbody></table></div>';
    }

    /* ── Render: Departments > Overview ──────────────────────── */

    function renderDepartmentsOverview() {
        var depts    = getDeptPlayers(state.companyId);
        var deptData = COMPANY_DEPT_PLAYERS[state.companyId] || COMPANY_DEPT_PLAYERS[DEFAULT_COMPANY_ID];
        var profile  = COMPANY_PROFILES[state.companyId] || COMPANY_PROFILES[DEFAULT_COMPANY_ID];
        var activeTotal = depts.reduce(function(s,x){return s+x.active;},0);

        var rows = depts.map(function(dep, i) {
            var dd = deptData[i] || {};
            var actRate = dep.total > 0 ? (dep.active/dep.total*100).toFixed(1) : '0.0';
            var ar = parseFloat(actRate);
            var barCol = ar >= 70 ? '#22c55e' : ar >= 40 ? '#f59e0b' : '#e5e7eb';
            return '<tr>' +
                '<td class="td-game-name">'+esc(dep.name)+'</td>' +
                '<td>'+dep.total+'</td>' +
                '<td style="color:var(--text-primary);font-weight:600">'+dep.active+'</td>' +
                '<td>'+(dd.avgPoints||0).toLocaleString()+'</td>' +
                '<td><div class="acc-cell"><div class="acc-bar-track" style="width:70px"><div style="height:100%;border-radius:4px;background:'+barCol+';width:'+Math.min(100,ar)+'%"></div></div><span class="acc-pct">'+actRate+'%</span></div></td>' +
            '</tr>';
        }).join('');

        var pieColors = ['#e53e3e','#3182ce','#38a169','#d97706','#7c3aed','#db2777'];

        document.getElementById('dashDeptPanel').innerHTML =
            '<div class="dept-overview-grid">' +
                '<div class="dash-table-card"><div class="dash-table-card-hd">Department Breakdown</div>' +
                '<table class="dash-perf-table"><thead><tr><th>Department</th><th>Total</th><th>Active</th><th>Avg Points</th><th>Activity Rate</th></tr></thead>' +
                '<tbody>'+rows+'</tbody></table></div>' +
                '<div class="chart-card"><div class="chart-card-hd">Active Players by Department</div><div class="chart-container"><div id="chartDeptPie"></div></div></div>' +
            '</div>';

        makeChart('chartDeptPie', {
            isPie: true,
            opts: {
                dataSource: depts.map(function(d) { return { name: d.name, active: Math.max(0, d.active) }; }),
                palette: pieColors.slice(0, depts.length),
                series: [{ argumentField: 'name', valueField: 'active', label: { visible: false } }],
                legend: { visible: true, horizontalAlignment: 'right', verticalAlignment: 'center', font: { size: 11, color: '#64748b' } },
                tooltip: { enabled: true, customizeTooltip: function(info) {
                    var pct = activeTotal > 0 ? (info.value / activeTotal * 100).toFixed(0) : 0;
                    return { text: info.argumentText + ': ' + info.value + ' (' + pct + '%)' };
                }},
                size: { height: 260 }
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
                series: [{ argumentField: 'region', valueField: 'players', type: 'bar', color: '#e53e3e', cornerRadius: 3 }],
                rotated: true,
                commonAxisSettings: { tick: { visible: false }, label: { font: { size: 11, color: '#64748b' } } },
                argumentAxis: { grid: { visible: false } },
                valueAxis:    { grid: { color: 'rgba(200,200,200,0.3)', visible: true } },
                legend:  { visible: false },
                tooltip: { enabled: true },
                size:    { height: 130 }
            }
        });
    }

    /* ── Full refresh ────────────────────────────────────────── */

    function refreshAll() {
        renderPeriodTabs();
        renderHeaderStats();
        renderSummaryOverview();
        renderSummaryTrends();
        renderSummaryForecast();
        renderSummaryAnomalies();
        renderGamesOverview();
        renderTrendsCharts('dashGamesTrends', 'gms');
        renderPlayersOverview();
        renderTrendsCharts('dashPlayersTrends', 'plr');
        renderDepartmentsOverview();
        renderTrendsCharts('dashDeptTrends', 'dpt');
        renderRegionalOverview();
    }

    /* ── Tab/period handlers ─────────────────────────────────── */

    window.dashPeriod = function(period) {
        state.period = period;
        _dataCache   = {};
        refreshAll();
    };

    window.dashMainTab = function(tab) {
        state.mainTab = tab;
        var hasSubs = tab === 'summary' || tab === 'players' || tab === 'games' || tab === 'departments';
        var subRow  = document.getElementById('dashSubRow');
        if (subRow) subRow.style.display = hasSubs ? '' : 'none';
        document.querySelectorAll('.dash-nav-tab').forEach(function(b) { b.classList.toggle('active', b.dataset.tab===tab); });
        document.querySelectorAll('.dash-panel').forEach(function(el) { el.classList.toggle('active', el.dataset.panel===tab); });
        document.querySelectorAll('.dash-panel.active .dash-sub-panel').forEach(function(el) { el.classList.toggle('active', el.dataset.sub===state.subTab); });
    };

    window.dashSubTab = function(sub) {
        state.subTab = sub;
        document.querySelectorAll('.dash-sub-tab').forEach(function(b) { b.classList.toggle('active', b.dataset.sub===sub); });
        document.querySelectorAll('.dash-sub-panel').forEach(function(el) { el.classList.toggle('active', el.dataset.sub===sub); });
    };

    window.dashReport    = function() { alert('Report export coming soon.'); };
    window.dashPdfReport = function() { alert('PDF export coming soon.'); };

    /* ── Scope integration ───────────────────────────────────── */

    function applyScope(companyId) {
        var id = parseInt(companyId, 10);
        if (!id || !COMPANY_PROFILES[id] || id === state.companyId) return;
        state.companyId = id;
        _dataCache = {};
        refreshAll();
    }

    /* ── Init ────────────────────────────────────────────────── */

    $(function() {
        try {
            var stored = JSON.parse(localStorage.getItem('gameon.scope') || '{}');
            if (stored.companyId && COMPANY_PROFILES[stored.companyId]) state.companyId = stored.companyId;
        } catch(e) {}
        refreshAll();
        document.addEventListener('gameon:scope-change', function(e) {
            if (e.detail && e.detail.companyId != null) applyScope(e.detail.companyId);
        });
    });

}());
