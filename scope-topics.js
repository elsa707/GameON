// Topics scope gate: user picks a department (autocomplete) before topics render.
// Departments are shown as "Department — Company". Last selection is restored on load.

const SCOPE_COMPANIES = [
    { id: 'naspers',        name: 'Naspers' },
    { id: 'standard bank',  name: 'Standard Bank' },
    { id: 'anglo american', name: 'Anglo American' },
    { id: 'sasol',          name: 'Sasol' },
    { id: 'mtn group',      name: 'MTN Group' },
    { id: 'discovery',      name: 'Discovery' },
    { id: 'shoprite',       name: 'Shoprite' },
];

const SCOPE_DEPARTMENTS = {
    'naspers':        ['Manufacturing', 'R&D', 'Sales', 'Finance', 'Human Resources', 'IT & Digital'],
    'standard bank':  ['Sales', 'Aftersales', 'Finance', 'Marketing', 'Human Resources'],
    'anglo american': ['R&D', 'Manufacturing', 'Sales', 'Marketing', 'Engineering', 'Finance'],
    'sasol':          ['Operations', 'Marketing', 'Finance', 'Human Resources', 'IT'],
    'mtn group':      ['Supply Chain', 'Brand & Marketing', 'Sustainability', 'Engineering', 'Finance', 'Human Resources', 'Sales', 'Manufacturing', 'R&D', 'Logistics', 'IT & Digital', 'Legal', 'Customer Service', 'Quality Assurance', 'Procurement'],
    'discovery':      ['R&D', 'Manufacturing', 'Finance', 'Logistics'],
    'shoprite':       ['Marketing', 'Engineering', 'Sales', 'Human Resources', 'Operations', 'Finance', 'Customer Support', 'Product', 'Legal', 'Data Analytics'],
};

const SCOPE_STORAGE_KEY = 'gameon.topicScope';

// Shared games catalogue. departmentName === '' means the game is company-wide.
const SCOPE_GAMES = [
    { id: 'g-nas-01', name: 'Sales Champion',           companyKey: 'naspers',        departmentName: 'Sales' },
    { id: 'g-nas-02', name: 'Showroom Sprint',          companyKey: 'naspers',        departmentName: '' },
    { id: 'g-nas-03', name: 'EV Knowledge Quest',       companyKey: 'naspers',        departmentName: 'Manufacturing' },
    { id: 'g-nas-04', name: 'Naspers R&D Trivia',       companyKey: 'naspers',        departmentName: 'R&D' },
    { id: 'g-nas-05', name: 'F&I Mastermind',           companyKey: 'naspers',        departmentName: 'Finance' },
    { id: 'g-sbk-01', name: 'Customer Hero',            companyKey: 'standard bank',  departmentName: 'Sales' },
    { id: 'g-sbk-02', name: 'Aftersales Race',          companyKey: 'standard bank',  departmentName: 'Aftersales' },
    { id: 'g-sbk-03', name: 'Standard Bank Onboarding', companyKey: 'standard bank',  departmentName: '' },
    { id: 'g-sbk-04', name: 'Marketing Sprint',         companyKey: 'standard bank',  departmentName: 'Marketing' },
    { id: 'g-aga-01', name: 'Anglo Heritage',           companyKey: 'anglo american', departmentName: '' },
    { id: 'g-aga-02', name: 'Powertrain Pro',           companyKey: 'anglo american', departmentName: 'R&D' },
    { id: 'g-aga-03', name: 'Lean Manufacturing Quiz',  companyKey: 'anglo american', departmentName: 'Manufacturing' },
    { id: 'g-aga-04', name: 'Anglo Model Race',         companyKey: 'anglo american', departmentName: 'Sales' },
    { id: 'g-sol-01', name: 'Sasol Brand Quest',        companyKey: 'sasol',          departmentName: '' },
    { id: 'g-sol-02', name: 'Operations Drill',         companyKey: 'sasol',          departmentName: 'Operations' },
    { id: 'g-sol-03', name: 'Safety First',             companyKey: 'sasol',          departmentName: 'Operations' },
    { id: 'g-mtn-01', name: 'MTN Academy',              companyKey: 'mtn group',      departmentName: '' },
    { id: 'g-mtn-02', name: 'Customer Service Champ',   companyKey: 'mtn group',      departmentName: 'Customer Service' },
    { id: 'g-mtn-03', name: 'Network Engineering Lab',  companyKey: 'mtn group',      departmentName: 'Engineering' },
    { id: 'g-mtn-04', name: 'Sales Star',               companyKey: 'mtn group',      departmentName: 'Sales' },
    { id: 'g-dsy-01', name: 'Discovery Trivia',         companyKey: 'discovery',      departmentName: '' },
    { id: 'g-dsy-02', name: 'Manufacturing Master',     companyKey: 'discovery',      departmentName: 'Manufacturing' },
    { id: 'g-shp-01', name: 'Shoprite Onboarding',      companyKey: 'shoprite',       departmentName: '' },
    { id: 'g-shp-02', name: 'Code Quest',               companyKey: 'shoprite',       departmentName: 'Engineering' },
    { id: 'g-shp-03', name: 'Marketing Maestro',        companyKey: 'shoprite',       departmentName: 'Marketing' },
    { id: 'g-shp-04', name: 'Sales Showdown',           companyKey: 'shoprite',       departmentName: 'Sales' },
    { id: 'g-shp-05', name: 'Customer Support Star',    companyKey: 'shoprite',       departmentName: 'Customer Support' }
];

function gamesForCurrentScope() {
    var company = (document.getElementById('scopeCompany') || {}).value || '';
    var dept = (document.getElementById('scopeDept') || {}).value || '';
    return SCOPE_GAMES.filter(function(g) {
        if (g.companyKey !== company) return false;
        return !g.departmentName || g.departmentName === dept;
    });
}

function lookupGameById(gameId) {
    if (!gameId) return null;
    return SCOPE_GAMES.find(function(g) { return g.id === gameId; }) || null;
}

function buildLinkedGameOptions(currentGameId) {
    var games = gamesForCurrentScope();
    var html = '<option value="">— No game —</option>';
    games.forEach(function(g) {
        var sel = g.id === currentGameId ? ' selected' : '';
        html += '<option value="' + g.id + '"' + sel + '>' +
                g.name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') +
                '</option>';
    });
    return html;
}

let SCOPE_CONTENT_ID = null;
let _scopeOnReady = null; // callback fired when a valid scope is applied
let _scopeEntries = [];   // flat list: { dept, companyId, companyName, label }
let _scopeListOpen = false;

// Build flat department list
(function buildEntries() {
    SCOPE_COMPANIES.forEach(c => {
        (SCOPE_DEPARTMENTS[c.id] || []).forEach(dept => {
            _scopeEntries.push({
                dept: dept,
                companyId: c.id,
                companyName: c.name,
                label: dept + ' — ' + c.name,
            });
        });
    });
})();

function initScope(opts) {
    SCOPE_CONTENT_ID = opts && opts.contentId;
    _scopeOnReady = opts && opts.onReady;

    const saved = loadScope();
    if (saved && saved.lastCompany && saved.deptByCompany) {
        const dept = saved.deptByCompany[saved.lastCompany];
        if (dept) {
            const entry = _scopeEntries.find(e => e.companyId === saved.lastCompany && e.dept === dept);
            if (entry) {
                document.getElementById('scopeCompany').value = entry.companyId;
                document.getElementById('scopeDept').value = entry.dept;
                document.getElementById('scopeInput').value = entry.label;
            }
        }
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        const wrap = document.querySelector('.scope-autocomplete');
        if (wrap && !wrap.contains(e.target)) closeScopeList();
    });

    // Prevent input blur when clicking inside the dropdown list
    var scopeList = document.getElementById('scopeList');
    scopeList.addEventListener('mousedown', function(e) {
        e.preventDefault();  // keeps focus on the input
    });

    // Delegate clicks on autocomplete items
    scopeList.addEventListener('click', function(e) {
        var item = e.target.closest('.scope-autocomplete-item');
        if (item) pickScopeEntry(item);
    });

    applyScope();
}

function onScopeInputFocus() {
    renderScopeList(document.getElementById('scopeInput').value);
}

function onScopeInputType(query) {
    renderScopeList(query);
}

function renderScopeList(query) {
    const list = document.getElementById('scopeList');
    const q = (query || '').trim().toLowerCase();
    const filtered = q
        ? _scopeEntries.filter(e => e.label.toLowerCase().includes(q))
        : _scopeEntries;

    if (filtered.length === 0) {
        list.innerHTML = '<div class="scope-autocomplete-empty">No departments found</div>';
    } else {
        let currentCompany = '';
        let html = '';
        filtered.forEach(e => {
            if (e.companyName !== currentCompany) {
                currentCompany = e.companyName;
                html += '<div class="scope-autocomplete-group">' + escHtml(currentCompany) + '</div>';
            }
            html += '<div class="scope-autocomplete-item" data-company="' + e.companyId + '" data-dept="' + escHtml(e.dept) + '">'
                  + escHtml(e.dept) + '<span class="scope-ac-company">' + escHtml(e.companyName) + '</span></div>';
        });
        list.innerHTML = html;
    }

    list.classList.add('open');
    _scopeListOpen = true;
}

function pickScopeEntry(el) {
    const companyId = el.getAttribute('data-company');
    const dept = el.getAttribute('data-dept');
    const entry = _scopeEntries.find(e => e.companyId === companyId && e.dept === dept);
    if (!entry) return;

    document.getElementById('scopeCompany').value = companyId;
    document.getElementById('scopeDept').value = dept;
    document.getElementById('scopeInput').value = entry.label;

    closeScopeList();
    persistScope(companyId, dept);
    applyScope();
}

function closeScopeList() {
    const list = document.getElementById('scopeList');
    if (list) list.classList.remove('open');
    _scopeListOpen = false;
}

function escHtml(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
}

function persistScope(company, dept) {
    const saved = loadScope() || { lastCompany: '', deptByCompany: {} };
    saved.lastCompany = company || '';
    saved.deptByCompany = saved.deptByCompany || {};
    if (company && dept) saved.deptByCompany[company] = dept;
    try { localStorage.setItem(SCOPE_STORAGE_KEY, JSON.stringify(saved)); } catch (e) {}
}

function applyScope() {
    const company = document.getElementById('scopeCompany').value;
    const dept = document.getElementById('scopeDept').value;
    const ready = Boolean(company && dept);

    document.getElementById('scopeGate').classList.toggle('scope-hidden', ready);
    const content = SCOPE_CONTENT_ID && document.getElementById(SCOPE_CONTENT_ID);
    if (content) content.classList.toggle('scope-hidden', !ready);

    const addTopicBtn = document.getElementById('addTopicBtn');
    const addModuleBtn = document.getElementById('addModuleBtn');
    if (addTopicBtn) addTopicBtn.disabled = !ready;
    if (addModuleBtn) addModuleBtn.disabled = !ready;

    if (ready && typeof _scopeOnReady === 'function') {
        _scopeOnReady(company, dept);
    }
}

function loadScope() {
    try { return JSON.parse(localStorage.getItem(SCOPE_STORAGE_KEY) || 'null'); } catch (e) { return null; }
}

// Keep these for backward compat — they are no-ops now but other code may call them.
function onScopeChange() { applyScope(); }
function populateDepartments() {}
