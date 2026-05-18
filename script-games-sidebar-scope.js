// Games page: sidebar-driven scope.
// The Company / Department selectors in the sidebar drive which games render.
// Scope is shared with other pages via localStorage key 'gameon.scope' (numeric ids).

var GAMES_SIDEBAR_COMPANIES = [
    { id: 7, name: 'Naspers',        color: '#c8102e', credits: 500 },
    { id: 6, name: 'Standard Bank',  color: '#005aff', credits: 300 },
    { id: 5, name: 'Anglo American', color: '#c41230', credits: 150 },
    { id: 4, name: 'Sasol',          color: '#f47920', credits: 200 },
    { id: 3, name: 'MTN Group',      color: '#ffcc00', credits: 400 },
    { id: 2, name: 'Discovery',      color: '#7b2d8b', credits: 250 },
    { id: 1, name: 'Shoprite',       color: '#e31d1a', credits: 100 }
];

var GAMES_SIDEBAR_DEPARTMENTS = [
    { id: 101, companyId: 7, name: 'Manufacturing' },
    { id: 102, companyId: 7, name: 'R&D' },
    { id: 103, companyId: 7, name: 'Sales' },
    { id: 104, companyId: 7, name: 'Finance' },
    { id: 105, companyId: 7, name: 'Human Resources' },
    { id: 106, companyId: 7, name: 'IT & Digital' },
    { id: 201, companyId: 6, name: 'Sales' },
    { id: 202, companyId: 6, name: 'Aftersales' },
    { id: 203, companyId: 6, name: 'Finance' },
    { id: 204, companyId: 6, name: 'Marketing' },
    { id: 205, companyId: 6, name: 'Human Resources' },
    { id: 301, companyId: 5, name: 'R&D' },
    { id: 302, companyId: 5, name: 'Manufacturing' },
    { id: 303, companyId: 5, name: 'Sales' },
    { id: 304, companyId: 5, name: 'Marketing' },
    { id: 305, companyId: 5, name: 'Engineering' },
    { id: 306, companyId: 5, name: 'Finance' },
    { id: 401, companyId: 4, name: 'Operations' },
    { id: 402, companyId: 4, name: 'Marketing' },
    { id: 403, companyId: 4, name: 'Finance' },
    { id: 404, companyId: 4, name: 'Human Resources' },
    { id: 405, companyId: 4, name: 'IT' },
    { id: 501, companyId: 3, name: 'Supply Chain' },
    { id: 502, companyId: 3, name: 'Brand & Marketing' },
    { id: 503, companyId: 3, name: 'Sustainability' },
    { id: 504, companyId: 3, name: 'Engineering' },
    { id: 505, companyId: 3, name: 'Finance' },
    { id: 506, companyId: 3, name: 'Human Resources' },
    { id: 507, companyId: 3, name: 'Sales' },
    { id: 508, companyId: 3, name: 'Manufacturing' },
    { id: 509, companyId: 3, name: 'R&D' },
    { id: 510, companyId: 3, name: 'Logistics' },
    { id: 511, companyId: 3, name: 'IT & Digital' },
    { id: 512, companyId: 3, name: 'Legal' },
    { id: 513, companyId: 3, name: 'Customer Service' },
    { id: 514, companyId: 3, name: 'Quality Assurance' },
    { id: 515, companyId: 3, name: 'Procurement' },
    { id: 601, companyId: 2, name: 'R&D' },
    { id: 602, companyId: 2, name: 'Manufacturing' },
    { id: 603, companyId: 2, name: 'Finance' },
    { id: 604, companyId: 2, name: 'Logistics' },
    { id: 701, companyId: 1, name: 'Marketing' },
    { id: 702, companyId: 1, name: 'Engineering' },
    { id: 703, companyId: 1, name: 'Sales' },
    { id: 704, companyId: 1, name: 'Human Resources' },
    { id: 705, companyId: 1, name: 'Operations' },
    { id: 706, companyId: 1, name: 'Finance' },
    { id: 707, companyId: 1, name: 'Customer Support' },
    { id: 708, companyId: 1, name: 'Product' },
    { id: 709, companyId: 1, name: 'Legal' },
    { id: 710, companyId: 1, name: 'Data Analytics' }
];

function gamesDeptsForCompany(companyId) {
    return GAMES_SIDEBAR_DEPARTMENTS.filter(function(d) { return d.companyId === companyId; });
}

function readGamesSidebarScope() {
    try {
        var raw = localStorage.getItem('gameon.scope');
        return raw ? JSON.parse(raw) : {};
    } catch (e) {
        return {};
    }
}

function writeGamesSidebarScope(companyId, departmentId) {
    try {
        localStorage.setItem('gameon.scope', JSON.stringify({
            companyId: companyId == null ? null : companyId,
            departmentId: departmentId == null ? null : departmentId
        }));
    } catch (e) {}
}

function applyGamesScope(companyId, departmentId) {
    writeGamesSidebarScope(companyId, departmentId);

    var ready = companyId != null;
    var hasDept = departmentId != null;
    var gate = document.getElementById('scopeGate');
    if (gate) gate.classList.toggle('scope-hidden', ready);
    ['gamesTable', 'gamesListToolbar'].forEach(function(id) {
        var el = document.getElementById(id);
        if (el) el.classList.toggle('scope-hidden', !ready);
    });

    var addGameBtn = document.getElementById('addGameBtn');
    var addGameAIBtn = document.getElementById('addGameAIBtn');
    if (addGameBtn) addGameBtn.disabled = !hasDept;
    if (addGameAIBtn) addGameAIBtn.disabled = !hasDept;

    if (!ready) {
        var countEl = document.getElementById('gamesCount');
        if (countEl) {
            countEl.innerHTML = '';
            countEl.hidden = true;
        }
        var scopeLabelEmpty = document.getElementById('gamesScopeLabel');
        if (scopeLabelEmpty) scopeLabelEmpty.textContent = '';
        return;
    }

    var company = GAMES_SIDEBAR_COMPANIES.find(function(c) { return c.id === companyId; });
    if (!company) return;
    var department = hasDept
        ? GAMES_SIDEBAR_DEPARTMENTS.find(function(d) { return d.id === departmentId; })
        : null;
    if (hasDept && !department) return;

    var companyKey = company.name.toLowerCase();
    var deptName = department ? department.name : '';

    var scopeLabel = document.getElementById('gamesScopeLabel');
    if (scopeLabel) {
        scopeLabel.textContent = department
            ? (company.name + ' · ' + department.name)
            : company.name;
    }

    if (typeof onGamesScope === 'function') {
        onGamesScope(companyKey, deptName);
    }
}

$(function() {
    var stored = readGamesSidebarScope();
    applyGamesScope(stored.companyId || null, stored.departmentId || null);

    document.addEventListener('gameon:scope-change', function(e) {
        var d = (e && e.detail) || {};
        applyGamesScope(d.companyId == null ? null : d.companyId,
                        d.departmentId == null ? null : d.departmentId);
    });
});
