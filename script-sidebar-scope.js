// Universal sidebar scope picker.
// Drives the scope-card at the top of the sidebar and the autocomplete popup
// that lets the user pick a workspace (company + department).
// Persists selection to localStorage 'gameon.scope' so it is shared across pages,
// and dispatches a 'gameon:scope-change' DOM event for per-page handlers.

(function() {
    var SCOPE_KEY = 'gameon.scope';
    var RECENT_KEY = 'gameon.scope.recent';
    var MAX_RECENT = 5;

    var FALLBACK_COMPANIES = [
        { id: 7, name: 'Naspers',        color: '#c8102e' },
        { id: 6, name: 'Standard Bank',  color: '#005aff' },
        { id: 5, name: 'Anglo American', color: '#c41230' },
        { id: 4, name: 'Sasol',          color: '#f47920' },
        { id: 3, name: 'MTN Group',      color: '#ffcc00' },
        { id: 2, name: 'Discovery',      color: '#7b2d8b' },
        { id: 1, name: 'Shoprite',       color: '#e31d1a' }
    ];

    var FALLBACK_DEPARTMENTS = [
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

    // Logo URLs keyed by company name (lowercased). Uses Clearbit's logo API
    // for instant, license-free brand marks. Names that don't resolve fall
    // back to a tinted initial avatar.
    var COMPANY_LOGOS = {
        'naspers':        'https://logo.clearbit.com/naspers.com',
        'standard bank':  'https://logo.clearbit.com/standardbank.com',
        'anglo american': 'https://logo.clearbit.com/angloamerican.com',
        'sasol':          'https://logo.clearbit.com/sasol.com',
        'mtn group':      'https://logo.clearbit.com/mtn.com',
        'discovery':      'https://logo.clearbit.com/discovery.co.za',
        'shoprite':       'https://logo.clearbit.com/shoprite.co.za'
    };

    function logoFor(companyName) {
        if (!companyName) return null;
        return COMPANY_LOGOS[companyName.toLowerCase()] || null;
    }

    function getCompanies() {
        return (typeof companies !== 'undefined' && Array.isArray(companies) && companies.length)
            ? companies : FALLBACK_COMPANIES;
    }
    function getDepartments() {
        return (typeof departments !== 'undefined' && Array.isArray(departments) && departments.length)
            ? departments : FALLBACK_DEPARTMENTS;
    }

    function findCompany(id) {
        if (id == null) return null;
        return getCompanies().find(function(c) { return c.id === id; }) || null;
    }
    function findDepartment(id) {
        if (id == null) return null;
        return getDepartments().find(function(d) { return d.id === id; }) || null;
    }

    function readScope() {
        try { return JSON.parse(localStorage.getItem(SCOPE_KEY) || '{}'); }
        catch (e) { return {}; }
    }
    function writeScope(companyId, departmentId) {
        try {
            localStorage.setItem(SCOPE_KEY, JSON.stringify({
                companyId: companyId == null ? null : companyId,
                departmentId: departmentId == null ? null : departmentId
            }));
        } catch (e) {}
    }

    function readRecent() {
        try {
            var raw = localStorage.getItem(RECENT_KEY);
            var arr = raw ? JSON.parse(raw) : [];
            return Array.isArray(arr) ? arr : [];
        } catch (e) { return []; }
    }
    function writeRecent(arr) {
        try { localStorage.setItem(RECENT_KEY, JSON.stringify(arr)); }
        catch (e) {}
    }
    function dispatchScopeChange(companyId, departmentId) {
        document.dispatchEvent(new CustomEvent('gameon:scope-change', {
            detail: { companyId: companyId, departmentId: departmentId }
        }));
    }

    // ---------- Card rendering ----------

    function renderCard() {
        var stored = readScope();
        var company = findCompany(stored.companyId);
        var department = findDepartment(stored.departmentId);
        var $company = document.getElementById('scopePickerCompany');
        var $dept = document.getElementById('scopePickerDept');
        var $logo = document.querySelector('#scopePicker .scope-card-logo');
        if (!$company || !$dept) return;

        if ($logo) {
            if (!company) {
                // No company picked — hide the logo box entirely.
                $logo.classList.remove('has-logo', 'has-initial');
                $logo.innerHTML = '';
                $logo.hidden = true;
            } else {
                $logo.hidden = false;
                var logoUrl = logoFor(company.name);
                var initial = escapeHtml((company.name || '?').charAt(0).toUpperCase());
                var safeName = escapeHtml(company.name || '');
                var brandColor = company.color || '';
                var textCol = isLightColor(brandColor) ? '#000' : '#fff';
                if (brandColor) {
                    $logo.style.background = brandColor;
                    $logo.style.color = textCol;
                } else {
                    $logo.style.background = '';
                    $logo.style.color = '';
                }
                if (logoUrl) {
                    $logo.classList.add('has-logo');
                    $logo.classList.remove('has-initial');
                    // If the brand mark fails to load, fall back to an initial avatar.
                    $logo.innerHTML =
                        '<img src="' + escapeHtml(logoUrl) + '" alt="' + safeName + '" ' +
                        'onerror="this.parentNode.classList.remove(\'has-logo\');' +
                        'this.parentNode.classList.add(\'has-initial\');' +
                        'this.parentNode.textContent=\'' + initial + '\';">';
                } else {
                    $logo.classList.remove('has-logo');
                    $logo.classList.add('has-initial');
                    $logo.textContent = initial;
                }
            }
        }

        if (company) {
            $company.textContent = company.name;
            $dept.textContent = department ? department.name : '';
        } else {
            $company.textContent = 'Select company';
            $dept.textContent = '';
        }
    }

    // ---------- Popup ----------

    var popup, backdrop, input, body;
    var currentFilter = '';

    function ensurePopup() {
        if (popup) return;
        popup = document.createElement('div');
        popup.className = 'scope-popup';
        popup.id = 'scopePopup';
        popup.hidden = true;
        popup.innerHTML =
            '<div class="scope-popup-search">' +
                '<i class="fas fa-search"></i>' +
                '<input type="text" id="scopePopupInput" autocomplete="off" placeholder="">' +
            '</div>' +
            '<div class="scope-popup-body" id="scopePopupBody"></div>';

        document.body.appendChild(popup);

        input = popup.querySelector('#scopePopupInput');
        body = popup.querySelector('#scopePopupBody');

        input.addEventListener('input', function() {
            currentFilter = (input.value || '').trim().toLowerCase();
            renderPopup();
        });
        document.addEventListener('keydown', function(e) {
            if (popup.hidden) return;
            if (e.key === 'Escape') closePopup();
        });

        // Click outside the popup or picker closes it.
        document.addEventListener('mousedown', function(e) {
            if (popup.hidden) return;
            var picker = document.getElementById('scopePicker');
            if (popup.contains(e.target)) return;
            if (picker && picker.contains(e.target)) return;
            closePopup();
        });
    }

    function positionPopup() {
        var sidebar = document.getElementById('sidebar');
        var card = document.getElementById('scopePicker');
        if (!sidebar || !card || !popup) return;
        var sbRect = sidebar.getBoundingClientRect();
        // Position the popup to the right of the sidebar.
        popup.style.top = sbRect.top + 'px';
        popup.style.left = sbRect.right + 'px';
        popup.style.height = sbRect.height + 'px';
    }

    function openPopup() {
        ensurePopup();
        currentFilter = '';
        input.value = '';
        var companyCount = getCompanies().length;
        input.placeholder = 'Search ' + companyCount + ' companies..';
        popup.hidden = false;
        positionPopup();
        renderPopup();
        setTimeout(function() { input.focus(); }, 0);
    }

    function closePopup() {
        if (!popup) return;
        popup.hidden = true;
    }

    function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, function(c) {
            return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
        });
    }

    function isLightColor(hex) {
        if (!hex) return false;
        var h = hex.replace('#', '');
        var r = parseInt(h.substr(0, 2), 16);
        var g = parseInt(h.substr(2, 2), 16);
        var b = parseInt(h.substr(4, 2), 16);
        return (r * 299 + g * 587 + b * 114) / 1000 > 155;
    }

    function avatarHtml(companyName, sizeClass, color) {
        var initial = (companyName || '?').charAt(0).toUpperCase();
        var logo = logoFor(companyName);
        var cls = 'scope-item-avatar' + (sizeClass ? ' ' + sizeClass : '');
        var textCol = isLightColor(color) ? '#000' : '#fff';
        var bgStyle = color ? ' style="background:' + color + ';color:' + textCol + '"' : '';
        if (logo) {
            return '<div class="' + cls + '"' + bgStyle + '>' +
                '<img src="' + escapeHtml(logo) + '" alt="' + escapeHtml(companyName) + '" ' +
                'onerror="this.style.display=\'none\';this.parentNode.dataset.fallback=\'1\';this.parentNode.textContent=\'' +
                escapeHtml(initial) + '\';">' +
            '</div>';
        }
        return '<div class="' + cls + '"' + bgStyle + '>' + escapeHtml(initial) + '</div>';
    }

    function buildCompanyItem(comp, isSelected) {
        var deptCount = getDepartments().filter(function(d) {
            return d.companyId === comp.id;
        }).length;
        return '<div class="scope-item' + (isSelected ? ' selected' : '') +
            '" data-company-id="' + comp.id + '">' +
                avatarHtml(comp.name, null, comp.color) +
                '<div class="scope-item-text">' +
                    '<div class="scope-item-company">' + escapeHtml(comp.name) + '</div>' +
                    '<div class="scope-item-dept">' + deptCount +
                        ' department' + (deptCount !== 1 ? 's' : '') + '</div>' +
                '</div>' +
            '</div>';
    }

    function renderPopup() {
        var stored = readScope();
        var selectedId = stored.companyId;
        var comps = getCompanies();
        var q = currentFilter;
        var filtered = comps.filter(function(c) {
            return !q || c.name.toLowerCase().indexOf(q) !== -1;
        });

        var html = '';

        if (!q) {
            var recentRaw = readRecent();
            var seenIds = {};
            var recent = [];
            recentRaw.forEach(function(r) {
                if (r.companyId == null || seenIds[r.companyId]) return;
                var c = findCompany(r.companyId);
                if (!c) return;
                seenIds[r.companyId] = true;
                recent.push(c);
            });

            if (recent.length) {
                html += '<div class="scope-section-label">Recent</div>';
                recent.forEach(function(c) {
                    html += buildCompanyItem(c, c.id === selectedId);
                });
            }

            html += '<div class="scope-section-label">All companies</div>';
            filtered.forEach(function(c) {
                html += buildCompanyItem(c, c.id === selectedId);
            });
        } else if (!filtered.length) {
            html += '<div class="scope-popup-empty">No matches for &ldquo;' + escapeHtml(q) + '&rdquo;</div>';
        } else {
            filtered.forEach(function(c) {
                html += buildCompanyItem(c, c.id === selectedId);
            });
        }

        body.innerHTML = html;

        Array.prototype.forEach.call(body.querySelectorAll('.scope-item'), function(el) {
            el.addEventListener('click', function() {
                var cid = parseInt(el.getAttribute('data-company-id'), 10);
                selectCompany(cid);
            });
        });
    }

    function pushRecentCompany(companyId) {
        if (companyId == null) return;
        var existing = readRecent().filter(function(r) {
            return r.companyId !== companyId;
        });
        existing.unshift({ companyId: companyId });
        writeRecent(existing.slice(0, MAX_RECENT));
    }

    function selectCompany(companyId) {
        writeScope(companyId, null);
        pushRecentCompany(companyId);
        renderCard();
        refreshDeptPicker(companyId, null);
        dispatchScopeChange(companyId, null);
        closePopup();
    }

    function selectDepartment(companyId, departmentId) {
        writeScope(companyId, departmentId);
        renderCard();
        dispatchScopeChange(companyId, departmentId);
    }

    // ---------- Department autocomplete (under the scope card) ----------

    var deptHostEl = null;
    var deptWidget = null;
    var _suppressDeptChange = false;

    function ensureDeptPicker() {
        if (deptHostEl) return;
        var picker = document.getElementById('scopePicker');
        if (!picker || !picker.parentNode) return;

        deptHostEl = document.createElement('div');
        deptHostEl.className = 'scope-dept-picker';
        deptHostEl.id = 'scopeDeptPicker';
        deptHostEl.innerHTML = '<div id="scopeDeptInput"></div>';
        picker.parentNode.insertBefore(deptHostEl, picker.nextSibling);

        if (typeof $ === 'undefined' || !$.fn || !$.fn.dxSelectBox) return;

        deptWidget = $('#scopeDeptInput').dxSelectBox({
            placeholder: 'Search department…',
            searchEnabled: true,
            searchMode: 'contains',
            searchExpr: 'name',
            displayExpr: 'name',
            valueExpr: 'id',
            showClearButton: true,
            noDataText: 'No departments',
            disabled: true,
            dataSource: [],
            onValueChanged: function(e) {
                if (_suppressDeptChange) return;
                var stored = readScope();
                if (stored.companyId == null) return;
                var did = e.value == null ? null : parseInt(e.value, 10);
                selectDepartment(stored.companyId, did);
            }
        }).dxSelectBox('instance');
    }

    function refreshDeptPicker(companyId, departmentId) {
        ensureDeptPicker();
        if (!deptWidget) return;

        if (companyId == null) {
            _suppressDeptChange = true;
            deptWidget.option('dataSource', []);
            deptWidget.option('value', null);
            deptWidget.option('disabled', true);
            deptWidget.option('placeholder', 'Select a company first');
            _suppressDeptChange = false;
            return;
        }

        var depts = getDepartments().filter(function(d) {
            return d.companyId === companyId;
        });

        _suppressDeptChange = true;
        deptWidget.option('dataSource', depts);
        deptWidget.option('disabled', depts.length === 0);
        deptWidget.option('placeholder',
            depts.length ? 'Search department…' : 'No departments for this company');
        deptWidget.option('value', departmentId == null ? null : departmentId);
        _suppressDeptChange = false;
    }

    // ---------- Init ----------

    function init() {
        var picker = document.getElementById('scopePicker');
        if (!picker) return;
        renderCard();
        ensureDeptPicker();
        var stored = readScope();
        refreshDeptPicker(stored.companyId == null ? null : stored.companyId,
                          stored.departmentId == null ? null : stored.departmentId);
        picker.addEventListener('click', function() {
            if (popup && !popup.hidden) {
                closePopup();
            } else {
                openPopup();
            }
        });
        window.addEventListener('resize', function() {
            if (popup && !popup.hidden) positionPopup();
        });
        // Sync card if scope changes on another tab
        window.addEventListener('storage', function(e) {
            if (e.key !== SCOPE_KEY) return;
            renderCard();
            var s = readScope();
            refreshDeptPicker(s.companyId == null ? null : s.companyId,
                              s.departmentId == null ? null : s.departmentId);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Public API so other pages can drive scope selection.
    window.GameOnScope = {
        selectCompany: selectCompany,
        selectDepartment: selectDepartment
    };
})();
