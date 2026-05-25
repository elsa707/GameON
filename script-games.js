// ===== Games page main script =====

// ===== State =====
var _currentGameScope = { companyKey: '', dept: '' };
var _expandedGames    = {};  // { gameId: true }
var _expandedCats     = {};  // { 'gameId-catId': true }
var _gameEditType     = null;  // 'game' | 'category' | 'question'
var _gameEditRow      = null;
var _pendingGameName  = null;
var _gameAddCats      = [];    // staged categories during add flow
var _editingCatIdx    = null;  // which staged cat is open
var _isGameAddMode    = false;
var _isAIGameFlow     = false;
var _gameStatusFilter = 'active';
var _currentGameShareTarget = null;
var _schedulingGameRow = null;

// ===== Utilities =====
function escapeAttr(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function showGameToast(msg) {
    if (typeof DevExpress !== 'undefined' && DevExpress.ui && DevExpress.ui.notify) {
        DevExpress.ui.notify(msg, 'info', 2500);
    } else {
        // fallback: simple DOM toast matching topics pattern
        var existing = document.querySelector('.toast');
        if (existing) existing.remove();
        var toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = '<i class="fas fa-check-circle"></i> ' + escapeAttr(msg);
        document.body.appendChild(toast);
        requestAnimationFrame(function() { toast.classList.add('show'); });
        setTimeout(function() {
            toast.classList.remove('show');
            setTimeout(function() { toast.remove(); }, 300);
        }, 2500);
    }
}

function getGamesScopeSubtitle() {
    var ck = _currentGameScope.companyKey || '';
    var dept = _currentGameScope.dept || '';
    var compName = ck ? (ck.charAt(0).toUpperCase() + ck.slice(1)) : '';
    return [compName, dept].filter(Boolean).join(' - ');
}

// ===== Cover presets =====
function gradientCoverSvg(c1, c2) {
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(
        "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 200' preserveAspectRatio='xMidYMid slice'>" +
            "<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>" +
                "<stop offset='0' stop-color='" + c1 + "'/>" +
                "<stop offset='1' stop-color='" + c2 + "'/>" +
            "</linearGradient></defs>" +
            "<rect width='320' height='200' fill='url(#g)'/>" +
        "</svg>"
    );
}

var GAME_COVER_PRESETS = [
    gradientCoverSvg('#3b82f6', '#8b5cf6'), // blue → purple
    gradientCoverSvg('#f97316', '#ec4899'), // orange → pink
    gradientCoverSvg('#22c55e', '#10b981')  // green → teal
];

function randomGameCover() {
    return GAME_COVER_PRESETS[Math.floor(Math.random() * GAME_COVER_PRESETS.length)];
}

function gameCoverHtml(bg) {
    if (!bg) return '';
    var bgCss = bg.indexOf('data:') === 0
        ? 'url("' + bg + '")'
        : bg;
    return '<div class="row-thumb row-thumb-game" style="background:' + escapeAttr(bgCss) + '"></div>';
}

function gameCoverPickerHtml(currentCover) {
    var url = currentCover || GAME_COVER_PRESETS[0];
    var presetIdx = GAME_COVER_PRESETS.indexOf(url);
    var isPreset = presetIdx >= 0;
    var customDataUrl = (!isPreset && currentCover) ? currentCover : '';
    var uploadSelected = !isPreset && customDataUrl;

    var tiles = GAME_COVER_PRESETS.map(function(preset, idx) {
        var sel = isPreset && idx === presetIdx;
        return '<button type="button" class="cover-tile' + (sel ? ' selected' : '') + '" data-cover="' + escapeAttr(preset) + '" onclick="selectGameCoverTile(this)" aria-label="Preset cover ' + (idx + 1) + '">' +
            '<img src="' + escapeAttr(preset) + '" alt="">' +
            (sel ? '<span class="cover-check"><i class="fas fa-check"></i></span>' : '') +
        '</button>';
    }).join('');

    var uploadInner = customDataUrl
        ? '<img src="' + escapeAttr(customDataUrl) + '" alt="Custom cover">' +
          (uploadSelected ? '<span class="cover-check"><i class="fas fa-check"></i></span>' : '') +
          '<span class="cover-tile-overlay"><i class="fas fa-camera"></i></span>'
        : '<span class="cover-upload-empty"><i class="fas fa-upload"></i><span>Upload</span></span>';

    return '<div class="cover-picker">' +
        tiles +
        '<label class="cover-tile cover-tile-upload' + (uploadSelected ? ' selected' : '') + '" data-cover="' + escapeAttr(customDataUrl) + '" title="Upload a custom cover">' +
            uploadInner +
            '<input type="file" class="cover-file-input" id="gameCoverFileInput" accept="image/*" onchange="previewGameCover(this)">' +
        '</label>' +
        '<input type="hidden" class="cover-hidden-input" name="cover" id="gameCoverHiddenInput" value="' + escapeAttr(url) + '">' +
    '</div>';
}

function selectGameCoverTile(tile) {
    var picker = tile.closest('.cover-picker');
    if (!picker) return;
    picker.querySelectorAll('.cover-tile').forEach(function(t) {
        t.classList.remove('selected');
        var check = t.querySelector('.cover-check');
        if (check) check.remove();
    });
    tile.classList.add('selected');
    if (!tile.querySelector('.cover-check')) {
        tile.insertAdjacentHTML('beforeend', '<span class="cover-check"><i class="fas fa-check"></i></span>');
    }
    var hidden = picker.querySelector('.cover-hidden-input');
    if (hidden && tile.dataset.cover) hidden.value = tile.dataset.cover;
}

function previewGameCover(input) {
    var file = input.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(e) {
        var dataUrl = e.target.result;
        var tile = input.closest('.cover-tile-upload');
        if (!tile) return;
        tile.dataset.cover = dataUrl;
        var empty = tile.querySelector('.cover-upload-empty');
        if (empty) empty.remove();
        var img = tile.querySelector('img');
        if (!img) {
            img = document.createElement('img');
            img.alt = 'Custom cover';
            tile.insertBefore(img, tile.firstChild);
        }
        img.src = dataUrl;
        if (!tile.querySelector('.cover-tile-overlay')) {
            tile.insertAdjacentHTML('beforeend', '<span class="cover-tile-overlay"><i class="fas fa-camera"></i></span>');
        }
        selectGameCoverTile(tile);
    };
    reader.readAsDataURL(file);
}

function readGameCoverPicker() {
    var hidden = document.querySelector('#gameEditFields .cover-hidden-input');
    return hidden ? hidden.value : '';
}

// ===== Scope / data helpers =====
function collectGamesForScope(companyKey, dept) {
    if (typeof GAMES_BY_SCOPE !== 'undefined') {
        var key = (companyKey || '') + '|' + (dept || '');
        if (GAMES_BY_SCOPE[key]) return GAMES_BY_SCOPE[key];
    }
    if (typeof GAMES_BY_DEPT !== 'undefined') {
        if (dept && GAMES_BY_DEPT[dept.toLowerCase()]) return GAMES_BY_DEPT[dept.toLowerCase()];
        if (GAMES_BY_DEPT['_default']) return GAMES_BY_DEPT['_default'];
    }
    return [];
}

function persistGamesScope() {
    var companyKey = _currentGameScope.companyKey;
    var dept = _currentGameScope.dept;
    if (!companyKey) return;
    var key = (companyKey || '') + '|' + (dept || '');
    var games = [];
    document.querySelectorAll('#gamesTable tbody tr.row-game').forEach(function(gameRow) {
        var gameId = gameRow.dataset.game;
        var cats = [];
        document.querySelectorAll('tr.row-cat[data-game="' + gameId + '"]').forEach(function(catRow) {
            var catId = catRow.dataset.cat;
            var qs = [];
            document.querySelectorAll('tr.row-q[data-game="' + gameId + '"][data-cat="' + catId + '"]').forEach(function(qRow) {
                var opts = [];
                try { opts = JSON.parse(qRow.dataset.options || '[]'); } catch(e) {}
                qs.push({
                    id: parseInt(qRow.dataset.q, 10) || Date.now(),
                    text: qRow.dataset.text || '',
                    options: opts,
                    correct: parseInt(qRow.dataset.correct, 10) || 0,
                    points: parseInt(qRow.dataset.points, 10) || 1
                });
            });
            cats.push({
                id: parseInt(catId, 10) || Date.now(),
                name: catRow.dataset.name || '',
                description: catRow.dataset.description || '',
                questions: qs
            });
        });
        games.push({
            id: parseInt(gameRow.dataset.game, 10) || Date.now(),
            name: gameRow.dataset.name || '',
            description: gameRow.dataset.description || '',
            cover: gameRow.dataset.cover || '',
            active: gameRow.dataset.active !== 'false',
            scheduledDate: gameRow.dataset.scheduledDate || null,
            categories: cats
        });
    });
    if (typeof GAMES_BY_SCOPE !== 'undefined') {
        GAMES_BY_SCOPE[key] = games;
    }
    try {
        localStorage.setItem('gameon.games.scope', JSON.stringify(typeof GAMES_BY_SCOPE !== 'undefined' ? GAMES_BY_SCOPE : {}));
    } catch(e) {}
}

function loadGamesScope() {
    try {
        var saved = localStorage.getItem('gameon.games.scope');
        if (!saved) return;
        var parsed = JSON.parse(saved);
        if (typeof GAMES_BY_SCOPE !== 'undefined') {
            Object.keys(parsed).forEach(function(k) { GAMES_BY_SCOPE[k] = parsed[k]; });
        }
    } catch(e) {}
}

function refreshGames() {
    renderGamesForScope(_currentGameScope.companyKey, _currentGameScope.dept);
}

// ===== Chip helpers =====
function updateGameRowChips(gameRow) {
    if (!gameRow) return;
    var gameId = gameRow.dataset.game;
    var catRows = document.querySelectorAll('tr.row-cat[data-game="' + gameId + '"]');
    var catCount = catRows.length;
    var qCount = document.querySelectorAll('tr.row-q[data-game="' + gameId + '"]').length;

    var mainChip = gameRow.querySelector('.row-main-chip');
    if (mainChip) {
        if (catCount > 0) {
            mainChip.innerHTML = '<span class="chip chip-cats"><i class="fas fa-list"></i> ' + catCount + ' categor' + (catCount !== 1 ? 'ies' : 'y') + '</span>';
        } else {
            mainChip.innerHTML = '';
        }
    }

    var chevron = gameRow.querySelector('.chevron');
    if (chevron) chevron.style.visibility = catCount > 0 ? '' : 'hidden';

    // Scheduled chip
    var cellPills = gameRow.querySelector('.cell-pills');
    if (cellPills) {
        var sd = gameRow.dataset.scheduledDate || '';
        var existing = cellPills.querySelector('.chip-scheduled');
        if (existing) existing.remove();
        if (sd) {
            var d = new Date(sd);
            var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            var label = d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
            cellPills.insertAdjacentHTML('afterbegin', '<span class="chip chip-scheduled"><i class="fas fa-calendar-alt"></i> ' + escapeAttr(label) + '</span>');
        }
    }
}

function updateCatRowChips(catRow) {
    if (!catRow) return;
    var gameId = catRow.dataset.game;
    var catId = catRow.dataset.cat;
    var qCount = document.querySelectorAll('tr.row-q[data-game="' + gameId + '"][data-cat="' + catId + '"]').length;

    var mainChip = catRow.querySelector('.row-main-chip');
    if (mainChip) {
        if (qCount > 0) {
            mainChip.innerHTML = '<span class="chip chip-questions"><i class="fas fa-question-circle"></i> ' + qCount + ' question' + (qCount !== 1 ? 's' : '') + '</span>';
        } else {
            mainChip.innerHTML = '';
        }
    }

    var chevron = catRow.querySelector('.chevron');
    if (chevron) chevron.style.visibility = qCount > 0 ? '' : 'hidden';
}

// ===== Row HTML builders =====
function gameRowHtml(game, id) {
    var cover = game.cover || randomGameCover();
    var isActive = game.active !== false;
    var rowClass = 'row-game' + (isActive ? '' : ' topic-disabled');
    var statusChip = isActive
        ? '<span class="chip chip-status chip-status-active">Active</span>'
        : '<span class="chip chip-status chip-status-disabled">Disabled</span>';
    var disableLabel = isActive ? 'Disable' : 'Enable';
    var disableIcon = isActive ? 'fa-ban' : 'fa-circle-check';
    var catCount = (game.categories || []).length;
    var catChip = catCount > 0
        ? '<span class="chip chip-cats"><i class="fas fa-list"></i> ' + catCount + ' categor' + (catCount !== 1 ? 'ies' : 'y') + '</span>'
        : '';

    var scheduledChip = '';
    if (game.scheduledDate) {
        var d = new Date(game.scheduledDate);
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var dateLabel = d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
        scheduledChip = '<span class="chip chip-scheduled"><i class="fas fa-calendar-alt"></i> ' + escapeAttr(dateLabel) + '</span>';
    }

    var optionsPart = '' +
        '<button type="button" class="action-item" onclick="actionAddCategory(this,event)"><i class="fas fa-list"></i> Add Category</button>' +
        '<button type="button" class="action-item" onclick="actionEditGame(this,event)"><i class="fas fa-pen"></i> Edit</button>' +
        '<button type="button" class="action-item" onclick="actionShareGame(this,event)"><i class="fas fa-people-group"></i> Share</button>' +
        '<button type="button" class="action-item" onclick="actionScheduleGame(this,event)"><i class="fas fa-calendar-alt"></i> Schedule</button>' +
        '<button type="button" class="action-item" onclick="actionToggleGameActive(this,event)"><i class="fas ' + disableIcon + '"></i> ' + escapeAttr(disableLabel) + '</button>' +
        '<div class="action-sep"></div>' +
        '<button type="button" class="action-item action-item-danger" onclick="actionDeleteGame(this,event)"><i class="fas fa-trash"></i> Delete</button>';

    return '<tr class="' + escapeAttr(rowClass) + '" data-game="' + id + '" data-name="' + escapeAttr(game.name) + '" data-description="' + escapeAttr(game.description || '') + '" data-cover="' + escapeAttr(cover) + '" data-active="' + isActive + '" data-scheduled-date="' + escapeAttr(game.scheduledDate || '') + '" onclick="toggleGame(' + id + ')">' +
        '<td class="col-name"><div class="cell-row">' +
            '<span class="chevron"' + (catCount === 0 ? ' style="visibility:hidden"' : '') + '><i class="fas fa-chevron-right"></i></span>' +
            gameCoverHtml(cover) +
            '<span class="company-name">' + escapeAttr(game.name) + '</span>' +
            '<span class="row-main-chip">' + catChip + '</span>' +
            '<span class="cell-pills">' + scheduledChip + '</span>' +
            '<span class="row-status">' + statusChip + '</span>' +
            '<span class="row-actions"><div class="action-menu">' +
                '<button class="btn-icon action-menu-trigger" onclick="toggleGameMenu(this,event)" title="Actions" aria-haspopup="true" aria-expanded="false"><i class="fas fa-ellipsis-vertical"></i></button>' +
                '<div class="action-menu-popup" role="menu">' + optionsPart + '</div>' +
            '</div></span>' +
        '</div></td>' +
    '</tr>';
}

function catRowHtml(cat, gameId, gameCover) {
    var qCount = (cat.questions || []).length;
    var qChip = qCount > 0
        ? '<span class="chip chip-questions"><i class="fas fa-question-circle"></i> ' + qCount + ' question' + (qCount !== 1 ? 's' : '') + '</span>'
        : '';
    var catOptions = '' +
        '<button type="button" class="action-item" onclick="actionAddQuestion(this,event)"><i class="fas fa-plus"></i> Add Question</button>' +
        '<button type="button" class="action-item" onclick="actionEditCat(this,event)"><i class="fas fa-pen"></i> Edit</button>' +
        '<div class="action-sep"></div>' +
        '<button type="button" class="action-item action-item-danger" onclick="actionDeleteCat(this,event)"><i class="fas fa-trash"></i> Delete</button>';

    return '<tr class="row-cat hidden" data-game="' + gameId + '" data-cat="' + cat.id + '" data-name="' + escapeAttr(cat.name) + '" data-description="' + escapeAttr(cat.description || '') + '" onclick="toggleCat(' + gameId + ',' + cat.id + ')">' +
        '<td class="col-name"><div class="cell-row">' +
            '<span class="chevron"' + (qCount === 0 ? ' style="visibility:hidden"' : '') + '><i class="fas fa-chevron-right"></i></span>' +
            (gameCover ? gameCoverHtml(gameCover) : '') +
            '<span class="company-name">' + escapeAttr(cat.name) + '</span>' +
            '<span class="row-main-chip">' + qChip + '</span>' +
            '<span class="cell-pills"></span>' +
            '<span class="row-actions"><div class="action-menu">' +
                '<button class="btn-icon action-menu-trigger" onclick="toggleGameMenu(this,event)" title="Actions" aria-haspopup="true" aria-expanded="false"><i class="fas fa-ellipsis-vertical"></i></button>' +
                '<div class="action-menu-popup" role="menu">' + catOptions + '</div>' +
            '</div></span>' +
        '</div></td>' +
    '</tr>';
}

function qRowHtml(q, gameId, catId, qNum) {
    var pointsChip = q.points > 1
        ? '<span class="chip chip-questions" style="margin-left:4px"><i class="fas fa-star"></i> ' + q.points + ' pts</span>'
        : '';
    var textPreview = (q.text || '').length > 80 ? (q.text || '').substring(0, 80) + '…' : (q.text || '');
    var qOptions = '' +
        '<button type="button" class="action-item" onclick="actionEditQuestion(this,event)"><i class="fas fa-pen"></i> Edit</button>' +
        '<div class="action-sep"></div>' +
        '<button type="button" class="action-item action-item-danger" onclick="actionDeleteQuestion(this,event)"><i class="fas fa-trash"></i> Delete</button>';

    return '<tr class="row-q hidden" data-game="' + gameId + '" data-cat="' + catId + '" data-q="' + q.id + '" data-text="' + escapeAttr(q.text) + '" data-options=\'' + JSON.stringify(q.options || []).replace(/'/g, '&#39;') + '\' data-correct="' + (q.correct || 0) + '" data-points="' + (q.points || 1) + '">' +
        '<td class="col-name"><div class="cell-row">' +
            '<span class="q-num">Q' + qNum + '</span>' +
            '<span class="company-name">' + escapeAttr(textPreview) + '</span>' +
            pointsChip +
            '<span class="cell-pills"></span>' +
            '<span class="row-actions"><div class="action-menu">' +
                '<button class="btn-icon action-menu-trigger" onclick="toggleGameMenu(this,event)" title="Actions" aria-haspopup="true" aria-expanded="false"><i class="fas fa-ellipsis-vertical"></i></button>' +
                '<div class="action-menu-popup" role="menu">' + qOptions + '</div>' +
            '</div></span>' +
        '</div></td>' +
    '</tr>';
}

// ===== Render =====
function renderGamesForScope(companyKey, dept) {
    var tbody = document.querySelector('#gamesTable tbody');
    if (!tbody) return;

    _currentGameScope = { companyKey: companyKey, dept: dept };
    _expandedGames = {};
    _expandedCats = {};

    var allGames = collectGamesForScope(companyKey, dept);
    allGames.forEach(function(g) { if (typeof g.active !== 'boolean') g.active = true; });

    var visible = (_gameStatusFilter === 'all') ? allGames
        : allGames.filter(function(g) { return Boolean(g.active) === (_gameStatusFilter === 'active'); });

    var html = '';
    visible.forEach(function(game, i) {
        var gid = game.id || (i + 1);
        html += gameRowHtml(game, gid);
        var gameCover = game.cover || randomGameCover();
        (game.categories || []).forEach(function(cat) {
            html += catRowHtml(cat, gid, gameCover);
            var qs = cat.questions || [];
            qs.forEach(function(q, qi) {
                html += qRowHtml(q, gid, cat.id, qi + 1);
            });
        });
    });
    tbody.innerHTML = html;
    updateGamesCount(visible);
    showGameEmpty();
}

function updateGamesCount(games) {
    var el = document.getElementById('gamesCount');
    if (!el) return;
    var n = games.length;
    el.hidden = false;
    el.innerHTML = '<i class="fas fa-trophy"></i> ' + n + ' game' + (n !== 1 ? 's' : '');
}

// ===== Expand / collapse =====
function toggleGame(gameId) {
    var catRows = document.querySelectorAll('tr.row-cat[data-game="' + gameId + '"]');
    if (!catRows.length) return;
    var gameRow = document.querySelector('tr.row-game[data-game="' + gameId + '"]');
    if (!gameRow) return;

    var isExpanded = _expandedGames[gameId];
    _expandedGames[gameId] = !isExpanded;

    var chevronI = gameRow.querySelector('.chevron i');
    if (isExpanded) {
        // collapse
        if (chevronI) chevronI.className = 'fas fa-chevron-right';
        catRows.forEach(function(cr) {
            cr.classList.add('hidden');
            var catId = cr.dataset.cat;
            var qRows = document.querySelectorAll('tr.row-q[data-game="' + gameId + '"][data-cat="' + catId + '"]');
            qRows.forEach(function(qr) { qr.classList.add('hidden'); });
            _expandedCats[gameId + '-' + catId] = false;
            var cv = cr.querySelector('.chevron i');
            if (cv) cv.className = 'fas fa-chevron-right';
        });
    } else {
        // expand — show cats, not questions
        if (chevronI) chevronI.className = 'fas fa-chevron-down';
        catRows.forEach(function(cr) { cr.classList.remove('hidden'); });
    }
}

function toggleCat(gameId, catId) {
    var qRows = document.querySelectorAll('tr.row-q[data-game="' + gameId + '"][data-cat="' + catId + '"]');
    if (!qRows.length) return;
    var catRow = document.querySelector('tr.row-cat[data-game="' + gameId + '"][data-cat="' + catId + '"]');
    if (!catRow) return;

    var key = gameId + '-' + catId;
    var isExpanded = _expandedCats[key];
    _expandedCats[key] = !isExpanded;

    var chevronI = catRow.querySelector('.chevron i');
    if (isExpanded) {
        if (chevronI) chevronI.className = 'fas fa-chevron-right';
        qRows.forEach(function(qr) { qr.classList.add('hidden'); });
    } else {
        if (chevronI) chevronI.className = 'fas fa-chevron-down';
        qRows.forEach(function(qr) { qr.classList.remove('hidden'); });
    }
}

// ===== Panel show/hide =====
function _hideAllDetailPanes() {
    var ids = ['detailEmpty','detailView','detailEdit','detailShare','detailSchedule'];
    ids.forEach(function(id) {
        var el = document.getElementById(id);
        if (el) {
            if (id === 'detailEmpty') el.style.display = 'none';
            else el.classList.add('hidden');
        }
    });
}

function showGameEmpty() {
    var panel = document.getElementById('detailPanel');
    if (panel) panel.classList.remove('open');
    var empty = document.getElementById('detailEmpty');
    if (empty) empty.style.display = '';
    ['detailView','detailEdit','detailShare','detailSchedule'].forEach(function(id) {
        var el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });
    _gameEditRow = null;
}

function showGameView() {
    var panel = document.getElementById('detailPanel');
    if (panel) panel.classList.add('open');
    _hideAllDetailPanes();
    var el = document.getElementById('detailView');
    if (el) el.classList.remove('hidden');
}

function showGameEdit() {
    var panel = document.getElementById('detailPanel');
    if (panel) panel.classList.add('open');
    _hideAllDetailPanes();
    var el = document.getElementById('detailEdit');
    if (el) el.classList.remove('hidden');
}

function showGameShare() {
    var panel = document.getElementById('detailPanel');
    if (panel) panel.classList.add('open');
    _hideAllDetailPanes();
    var el = document.getElementById('detailShare');
    if (el) el.classList.remove('hidden');
}

function showGameSchedule() {
    var panel = document.getElementById('detailPanel');
    if (panel) panel.classList.add('open');
    _hideAllDetailPanes();
    var el = document.getElementById('detailSchedule');
    if (el) el.classList.remove('hidden');
}

function closeGameDetail() { showGameEmpty(); }
function cancelGameEdit() { showGameEmpty(); }

// ===== setGamePanelMode =====
function setGamePanelMode(mode) {
    // If the share step replaced .edit-actions, restore before proceeding.
    if (!document.getElementById('gameSubmitBtn')) {
        var actions = document.querySelector('#detailEdit .edit-actions');
        if (actions) {
            actions.innerHTML =
                '<button type="button" class="btn-icon btn-delete-icon hidden" id="gameEditDeleteBtn" onclick="deleteCurrentGame()" title="Delete"><i class="fas fa-trash"></i></button>' +
                '<button type="button" class="btn btn-text-danger hidden" id="gameEditDisableBtn" onclick="toggleCurrentGameActive()"><i class="fas fa-ban"></i> Disable</button>' +
                '<button type="button" class="btn btn-outline" onclick="cancelGameEdit()">Cancel</button>' +
                '<button type="submit" class="btn btn-primary" id="gameSubmitBtn">Save</button>';
        }
    }
    var badge = document.getElementById('gameEditBadge');
    var submitBtn = document.getElementById('gameSubmitBtn');
    var creditsEl = document.getElementById('aiGameCreditsDisplay');
    if (badge) badge.classList.remove('badge-ai');
    if (creditsEl) creditsEl.hidden = true;
    if (submitBtn) { submitBtn.hidden = false; submitBtn.disabled = false; }

    var genBtn = document.getElementById('aiGameGenerateBtn');
    if (genBtn) genBtn.remove();

    _isAIGameFlow = false;

    if (mode === 'add') {
        _isGameAddMode = true;
        if (badge) badge.innerHTML = '<i class="fas fa-plus"></i> Adding';
        if (submitBtn) submitBtn.textContent = 'Save';
        // hide delete/disable for add
        var delBtn = document.getElementById('gameEditDeleteBtn');
        var disBtn = document.getElementById('gameEditDisableBtn');
        if (delBtn) delBtn.classList.add('hidden');
        if (disBtn) disBtn.classList.add('hidden');
    } else {
        _isGameAddMode = false;
        if (badge) badge.innerHTML = '<i class="fas fa-pen"></i> Editing';
        if (submitBtn) submitBtn.textContent = 'Save Changes';
    }
}

// ===== Share tab HTML builder =====
function buildGameShareTabHtml() {
    var companyKey = _currentGameScope.companyKey;
    if (!companyKey) return '<p class="share-empty">Select a company scope first.</p>';
    var companies = (typeof GAMES_SIDEBAR_COMPANIES !== 'undefined') ? GAMES_SIDEBAR_COMPANIES : [];
    var departments = (typeof GAMES_SIDEBAR_DEPARTMENTS !== 'undefined') ? GAMES_SIDEBAR_DEPARTMENTS : [];
    var company = companies.find(function(c) { return c.name.toLowerCase() === companyKey; });
    if (!company) return '<p class="share-empty">Company not found.</p>';
    var allDepts = departments.filter(function(d) { return d.companyId === company.id; });
    if (!allDepts.length) return '<p class="share-empty">No departments to share with.</p>';
    var items = allDepts.map(function(d) {
        return '<label class="share-dept-item">' +
            '<input type="checkbox" name="shareDept" value="' + escapeAttr(d.name) + '">' +
            '<span class="share-dept-name">' + escapeAttr(d.name) + '</span>' +
        '</label>';
    }).join('');
    return '<p class="share-panel-lead">Share this game with departments in <strong>' +
        escapeAttr(company.name) + '</strong> when saving.</p>' +
        '<div class="share-dept-list">' + items + '</div>';
}

// ===== Schedule HTML =====
function buildScheduleBodyHtml() {
    return '<div class="schedule-form">' +
        '<p class="schedule-lead">When should this game go live?</p>' +
        '<label class="schedule-option">' +
            '<input type="radio" name="scheduleType" value="now" checked onchange="onScheduleTypeChange(this)"> Publish immediately' +
        '</label>' +
        '<label class="schedule-option">' +
            '<input type="radio" name="scheduleType" value="date" onchange="onScheduleTypeChange(this)"> Schedule for a date' +
        '</label>' +
        '<div class="schedule-date-group hidden" id="scheduleDateGroup">' +
            '<input type="datetime-local" id="scheduleDateTime" class="schedule-datetime-input">' +
        '</div>' +
    '</div>';
}

function onScheduleTypeChange(radio) {
    var group = document.getElementById('scheduleDateGroup');
    if (!group) return;
    if (radio.value === 'date') {
        group.classList.remove('hidden');
    } else {
        group.classList.add('hidden');
    }
}

// ===== Add Game (manual) =====
function addGame() {
    _gameAddCats = [];
    _editingCatIdx = null;
    _gameEditRow = null;
    _gameEditType = 'game';

    document.getElementById('gameEditTitle').textContent = 'Add Game';
    document.getElementById('gameEditSubtitle').textContent = getGamesScopeSubtitle();

    document.getElementById('gameEditFields').innerHTML =
        '<div class="add-topic-tabs" id="gameAddTabs">' +
            '<button type="button" class="add-topic-tab active" data-tab="game" onclick="switchGameTab(\'game\')"><i class="fas fa-trophy"></i> Game</button>' +
            '<button type="button" class="add-topic-tab" data-tab="cats" onclick="switchGameTab(\'cats\')"><i class="fas fa-list"></i> Categories</button>' +
            '<button type="button" class="add-topic-tab" data-tab="share" id="gameTabShare" disabled onclick="switchGameTab(\'share\')"><i class="fas fa-people-group"></i> Share</button>' +
            '<button type="button" class="add-topic-tab" data-tab="schedule" id="gameTabSchedule" disabled onclick="switchGameTab(\'schedule\')"><i class="fas fa-calendar-alt"></i> Schedule</button>' +
        '</div>' +
        '<div class="add-topic-pane" id="gameTabPaneGame">' +
            gameCoverToggleHtml('', 'gameAddCoverToggle', 'gameAddCoverBody', false) +
            '<div class="form-group"><label>Game Name <span class="required-mark">*</span></label><input type="text" name="name" value="" required placeholder="Game name"></div>' +
            '<div class="form-group"><label>Description <span class="form-label-optional">(optional)</span></label><textarea name="description" rows="3" placeholder="What will players learn?"></textarea></div>' +
            '<div class="form-group"><label for="gameTopicSelect">Topic <span class="form-label-optional">(optional)</span></label>' +
                '<select id="gameTopicSelect" class="ai-model-select" onchange="onManualGameTopicChange(this)">' +
                    '<option value="">Select a topic</option>' +
                    getAIGameTopicOptions() +
                '</select>' +
            '</div>' +
            '<div class="form-row-2">' +
                '<div class="form-group">' +
                    '<label>Max attempts</label>' +
                    '<div class="number-stepper">' +
                        '<button type="button" class="stepper-btn" onclick="stepGameAttempts(-1,\'gameMaxAttempts\')"><i class="fas fa-minus"></i></button>' +
                        '<input type="number" name="maxAttempts" id="gameMaxAttempts" value="1" min="1" max="99">' +
                        '<button type="button" class="stepper-btn" onclick="stepGameAttempts(1,\'gameMaxAttempts\')"><i class="fas fa-plus"></i></button>' +
                    '</div>' +
                '</div>' +
                '<div class="form-group">' +
                    '<label>Questions per session</label>' +
                    '<input type="text" name="questionsPerSession" placeholder="Server default">' +
                '</div>' +
            '</div>' +
        '</div>' +
        '<div class="add-topic-pane hidden" id="gameTabPaneCats">' +
            '<div id="gameCatsList"></div>' +
        '</div>' +
        '<div class="add-topic-pane hidden" id="gameTabPaneShare">' +
            buildGameShareTabHtml() +
        '</div>' +
        '<div class="add-topic-pane hidden" id="gameTabPaneSchedule">' +
            buildScheduleBodyHtml() +
        '</div>';

    renderGameCatList();
    setGamePanelMode('add');
    showGameEdit();
}

function switchGameTab(tab) {
    var tabs = document.querySelectorAll('#gameAddTabs .add-topic-tab');
    tabs.forEach(function(t) { t.classList.toggle('active', t.dataset.tab === tab); });
    var panes = ['game','cats','share','schedule'];
    panes.forEach(function(p) {
        var el = document.getElementById('gameTabPane' + p.charAt(0).toUpperCase() + p.slice(1));
        if (el) el.classList.toggle('hidden', p !== tab);
    });
}

// ===== Staged category editor =====
function renderGameCatList() {
    var container = document.getElementById('gameCatsList');
    if (!container) return;

    var html = '<div class="game-cat-list" id="gameCatListItems">';
    _gameAddCats.forEach(function(cat, idx) {
        var isOpen = _editingCatIdx === idx;
        html += '<div class="game-cat-item' + (isOpen ? ' expanded' : '') + '" data-cat-idx="' + idx + '">' +
            '<div class="game-cat-item-header" onclick="toggleStagedCat(' + idx + ')">' +
                '<button type="button" class="game-cat-toggle" onclick="event.stopPropagation();toggleStagedCat(' + idx + ')"><i class="fas fa-chevron-right"></i></button>' +
                '<span class="game-cat-name">' + escapeAttr(cat.name) + '</span>' +
                '<span class="game-cat-q-badge">' + cat.questions.length + ' Q</span>' +
                '<button type="button" class="game-cat-del-btn" onclick="event.stopPropagation();deleteStagedCat(' + idx + ')" title="Remove"><i class="fas fa-times"></i></button>' +
            '</div>' +
            '<div class="game-cat-questions">' +
                renderStagedCatQuestionsHtml(idx) +
                questionEditorHtml(idx) +
            '</div>' +
        '</div>';
    });
    html += '</div>';

    // Inline new-category form
    html += '<div class="game-new-cat-form">' +
        '<input type="text" id="newCatNameInput" placeholder="Category name" onkeydown="if(event.key===\'Enter\'){event.preventDefault();addStagedCat()}">' +
        '<button type="button" class="btn btn-outline btn-sm" onclick="addStagedCat()"><i class="fas fa-plus"></i> Add</button>' +
    '</div>';

    container.innerHTML = html;
}

function renderStagedCatQuestionsHtml(catIdx) {
    var cat = _gameAddCats[catIdx];
    if (!cat || !cat.questions.length) return '<div class="q-staged-list" id="qStagedList' + catIdx + '"><p style="font-size:0.82rem;color:#9ca3af;margin:8px 0 4px">No questions yet.</p></div>';
    var html = '<div class="q-staged-list" id="qStagedList' + catIdx + '">';
    cat.questions.forEach(function(q, qi) {
        var preview = (q.text || '').length > 60 ? (q.text || '').substring(0, 60) + '…' : (q.text || '');
        html += '<div class="q-staged-item">' +
            '<span class="q-staged-num">Q' + (qi + 1) + '</span>' +
            '<span class="q-staged-text">' + escapeAttr(preview) + '</span>' +
            '<button type="button" class="q-staged-del" onclick="deleteStagedQuestion(' + catIdx + ',' + qi + ')" title="Remove"><i class="fas fa-times"></i></button>' +
        '</div>';
    });
    html += '</div>';
    return html;
}

function questionEditorHtml(catIdx) {
    return '<div class="q-editor" id="qEditor' + catIdx + '">' +
        '<label>Question text</label>' +
        '<textarea class="q-text" id="qText' + catIdx + '" rows="3" placeholder="Enter question text…"></textarea>' +
        '<label>Options (select the correct answer)</label>' +
        '<div class="q-opts-grid">' +
            ['A','B','C','D'].map(function(letter, li) {
                return '<div class="q-opt">' +
                    '<input type="radio" name="qCorrect' + catIdx + '" value="' + li + '" id="qOpt' + catIdx + '_' + li + '">' +
                    '<span class="q-opt-label">' + letter + '</span>' +
                    '<input type="text" id="qOptText' + catIdx + '_' + li + '" placeholder="Option ' + letter + '">' +
                '</div>';
            }).join('') +
        '</div>' +
        '<div class="q-points-row">' +
            '<label>Points</label>' +
            '<input type="number" id="qPoints' + catIdx + '" min="1" max="10" value="1">' +
            '<button type="button" class="btn btn-primary btn-sm q-add-btn" onclick="addStagedQuestion(' + catIdx + ')"><i class="fas fa-plus"></i> Add Question</button>' +
        '</div>' +
    '</div>';
}

function addStagedCat() {
    var input = document.getElementById('newCatNameInput');
    if (!input) return;
    var name = input.value.trim();
    if (!name) { input.focus(); return; }
    _gameAddCats.push({ id: Date.now(), name: name, description: '', questions: [] });
    _editingCatIdx = _gameAddCats.length - 1;
    renderGameCatList();
}

function deleteStagedCat(idx) {
    _gameAddCats.splice(idx, 1);
    if (_editingCatIdx === idx) _editingCatIdx = null;
    else if (_editingCatIdx > idx) _editingCatIdx--;
    renderGameCatList();
}

function toggleStagedCat(idx) {
    _editingCatIdx = (_editingCatIdx === idx) ? null : idx;
    renderGameCatList();
}

function addStagedQuestion(catIdx) {
    var textEl = document.getElementById('qText' + catIdx);
    var text = textEl ? textEl.value.trim() : '';
    if (!text) { if (textEl) textEl.focus(); showGameToast('Enter a question first'); return; }

    var opts = [];
    var correct = 0;
    for (var i = 0; i < 4; i++) {
        var optEl = document.getElementById('qOptText' + catIdx + '_' + i);
        var val = optEl ? optEl.value.trim() : '';
        if (!val) { showGameToast('Fill in all 4 options'); return; }
        opts.push(val);
    }
    var radioEls = document.querySelectorAll('input[name="qCorrect' + catIdx + '"]:checked');
    if (radioEls.length) correct = parseInt(radioEls[0].value, 10) || 0;

    var pointsEl = document.getElementById('qPoints' + catIdx);
    var points = pointsEl ? (parseInt(pointsEl.value, 10) || 1) : 1;

    _gameAddCats[catIdx].questions.push({
        id: Date.now() + Math.floor(Math.random() * 1000),
        text: text,
        options: opts,
        correct: correct,
        points: points
    });
    renderGameCatList();
    // Re-open the same cat
    _editingCatIdx = catIdx;
    renderGameCatList();
}

function deleteStagedQuestion(catIdx, qIdx) {
    _gameAddCats[catIdx].questions.splice(qIdx, 1);
    _editingCatIdx = catIdx;
    renderGameCatList();
}

// ===== Save Game (add/edit) =====
function saveGameAdd(event) {
    if (event) event.preventDefault();

    if (_isGameAddMode && !_isAIGameFlow) {
        // Manual add
        var form = document.getElementById('gameEditForm');
        var data = new FormData(form);
        var name = (data.get('name') || '').trim();
        if (!name) {
            showGameToast('Game name is required');
            var nameInput = form.querySelector('input[name="name"]');
            if (nameInput) nameInput.focus();
            return;
        }
        var description = (data.get('description') || '').trim();
        var cover = readGameCoverPicker() || randomGameCover();

        var tbody = document.querySelector('#gamesTable tbody');
        if (!tbody) return;

        // Generate unique id
        var newId = Date.now();
        var gameObj = {
            id: newId,
            name: name,
            description: description,
            cover: cover,
            active: true,
            scheduledDate: null,
            categories: _gameAddCats
        };

        var gameHtml = gameRowHtml(gameObj, newId);
        tbody.insertAdjacentHTML('beforeend', gameHtml);
        var gameRow = document.querySelector('tr.row-game[data-game="' + newId + '"]');

        var newGameCover = gameRow ? (gameRow.dataset.cover || '') : '';
        _gameAddCats.forEach(function(cat) {
            var catHtml = catRowHtml(cat, newId, newGameCover);
            tbody.insertAdjacentHTML('beforeend', catHtml);
            var catRow = document.querySelector('tr.row-cat[data-game="' + newId + '"][data-cat="' + cat.id + '"]');
            cat.questions.forEach(function(q, qi) {
                var qHtml = qRowHtml(q, newId, cat.id, qi + 1);
                tbody.insertAdjacentHTML('beforeend', qHtml);
            });
            if (catRow) updateCatRowChips(catRow);
        });
        if (gameRow) updateGameRowChips(gameRow);

        persistGamesScope();
        updateGamesCount(document.querySelectorAll('#gamesTable tbody tr.row-game'));
        showGameToast('"' + name + '" added');
        showAddGameShareStep(name);
        return;
    }

    if (_isGameAddMode && _isAIGameFlow) {
        // AI add — save from accordion
        var nameInput = document.querySelector('#aiGameTabPaneGame input[name="name"]');
        var descInput = document.querySelector('#aiGameTabPaneGame textarea[name="description"]');
        var name = nameInput ? nameInput.value.trim() : '';
        var description = descInput ? descInput.value.trim() : '';
        if (!name) { showGameToast('Game name is required'); if (nameInput) nameInput.focus(); return; }

        var cover = readGameCoverPicker() || randomGameCover();
        var tbody = document.querySelector('#gamesTable tbody');
        if (!tbody) return;

        var newId = Date.now();
        var cats = [];
        document.querySelectorAll('.ai-game-cat-item').forEach(function(catEl, ci) {
            var catName = '';
            var catNameEl = catEl.querySelector('.ai-sub-name');
            if (catNameEl) catName = catNameEl.textContent.trim();
            if (!catName) catName = 'Category ' + (ci + 1);
            var qs = [];
            catEl.querySelectorAll('.ai-game-q-item').forEach(function(qEl, qi) {
                var textEl = qEl.querySelector('.ai-game-q-text');
                var qText = textEl ? textEl.textContent.trim() : '';
                var optEls = qEl.querySelectorAll('.ai-game-q-opt');
                var opts = [];
                var correct = 0;
                optEls.forEach(function(optEl, oi) {
                    // Strip leading "A. ", "B. " etc. and the " (✓)" marker
                    var raw = optEl.textContent.replace(/^[A-D]\.\s*/, '').replace(/\s*\(✓\)\s*$/, '').trim();
                    opts.push(raw);
                    if (optEl.classList.contains('correct')) correct = oi;
                });
                if (opts.length < 4) { for (var x = opts.length; x < 4; x++) opts.push('Option ' + (x + 1)); }
                qs.push({ id: Date.now() + qi + ci * 100, text: qText, options: opts, correct: correct, points: 1 });
            });
            cats.push({ id: Date.now() + ci, name: catName, description: '', questions: qs });
        });

        var gameObj = { id: newId, name: name, description: description, cover: cover, active: true, scheduledDate: null, categories: cats };
        var gameHtml = gameRowHtml(gameObj, newId);
        tbody.insertAdjacentHTML('beforeend', gameHtml);
        var gameRow = document.querySelector('tr.row-game[data-game="' + newId + '"]');

        var aiGameCover = gameRow ? (gameRow.dataset.cover || '') : '';
        cats.forEach(function(cat) {
            tbody.insertAdjacentHTML('beforeend', catRowHtml(cat, newId, aiGameCover));
            var catRow = document.querySelector('tr.row-cat[data-game="' + newId + '"][data-cat="' + cat.id + '"]');
            cat.questions.forEach(function(q, qi) {
                tbody.insertAdjacentHTML('beforeend', qRowHtml(q, newId, cat.id, qi + 1));
            });
            if (catRow) updateCatRowChips(catRow);
        });
        if (gameRow) updateGameRowChips(gameRow);

        persistGamesScope();
        updateGamesCount(document.querySelectorAll('#gamesTable tbody tr.row-game'));
        showGameToast('"' + name + '" added');
        showAddGameShareStep(name);
        return;
    }

    // Edit existing game
    if (_gameEditType === 'game' && _gameEditRow) {
        var form = document.getElementById('gameEditForm');
        var data = new FormData(form);
        var name = (data.get('name') || '').trim();
        var description = (data.get('description') || '').trim();
        var cover = readGameCoverPicker() || _gameEditRow.dataset.cover || randomGameCover();

        var nameEl = _gameEditRow.querySelector('.company-name');
        if (nameEl) nameEl.textContent = name;
        _gameEditRow.dataset.name = name;
        _gameEditRow.dataset.description = description;
        _gameEditRow.dataset.cover = cover;

        // Update cover tile
        var coverDiv = _gameEditRow.querySelector('div[style*="border-radius:6px"]');
        if (coverDiv) coverDiv.style.background = cover;

        updateGameRowChips(_gameEditRow);
        persistGamesScope();
        showGameToast('"' + name + '" updated');
        showGameEmpty();
        return;
    }

    if (_gameEditType === 'category' && _gameEditRow) {
        var form = document.getElementById('gameEditForm');
        var data = new FormData(form);
        var name = (data.get('name') || '').trim();
        var description = (data.get('description') || '').trim();
        var nameEl = _gameEditRow.querySelector('.company-name');
        if (nameEl) nameEl.textContent = name;
        _gameEditRow.dataset.name = name;
        _gameEditRow.dataset.description = description;
        persistGamesScope();
        showGameToast('"' + name + '" updated');
        showGameEmpty();
        return;
    }

    if (_gameEditType === 'question' && _gameEditRow) {
        var form = document.getElementById('gameEditForm');
        var data = new FormData(form);
        var text = (data.get('qtext') || '').trim();
        var opts = [];
        for (var i = 0; i < 4; i++) opts.push((data.get('opt' + i) || '').trim());
        var correct = parseInt(data.get('correct') || '0', 10);
        var points = parseInt(data.get('points') || '1', 10);

        _gameEditRow.dataset.text = text;
        _gameEditRow.dataset.options = JSON.stringify(opts);
        _gameEditRow.dataset.correct = correct;
        _gameEditRow.dataset.points = points;

        var preview = text.length > 80 ? text.substring(0, 80) + '…' : text;
        var nameEl = _gameEditRow.querySelector('.company-name');
        if (nameEl) nameEl.textContent = preview;

        persistGamesScope();
        showGameToast('Question updated');
        showGameEmpty();
        return;
    }
}

// ===== Share step (after add) =====
function showAddGameShareStep(gameName) {
    _pendingGameName = gameName;

    var isAI = !!document.getElementById('aiGameTabShare');
    var shareTabBtn = document.getElementById(isAI ? 'aiGameTabShare' : 'gameTabShare');
    if (shareTabBtn) shareTabBtn.disabled = false;

    if (isAI) { switchGameAITab('ai-share'); } else { switchGameTab('share'); }

    var actions = document.querySelector('#detailEdit .edit-actions');
    if (actions) {
        actions.innerHTML =
            '<button type="button" class="btn btn-outline" onclick="skipGameShare()">Skip</button>' +
            '<button type="button" class="btn btn-primary" onclick="applyGameShare()">Share</button>';
    }
}

function applyGameShare() {
    var gameName = _pendingGameName;
    _pendingGameName = null;
    var deptNames = Array.from(document.querySelectorAll('input[name="shareDept"]:checked'))
        .map(function(i) { return i.value; });
    if (deptNames.length) {
        shareGameWithDepts(_currentGameScope.companyKey, gameName, deptNames);
        persistGamesScope();
        showGameToast('"' + gameName + '" shared to ' + deptNames.length + ' dept' + (deptNames.length !== 1 ? 's' : ''));
        refreshGames();
    }
    showGameScheduleStep(gameName);
}

function skipGameShare() {
    showGameScheduleStep(_pendingGameName || '');
}

function shareGameWithDepts(companyKey, gameName, deptNames) {
    if (typeof GAMES_BY_SCOPE === 'undefined' || typeof GAMES_BY_DEPT === 'undefined') return;
    var visible = collectGamesForScope(companyKey, _currentGameScope.dept);
    var sourceGame = visible.find ? visible.find(function(g) { return g.name === gameName; }) : null;
    if (!sourceGame) return;
    deptNames.forEach(function(dn) {
        var key = (companyKey || '') + '|' + dn;
        var bucket = GAMES_BY_SCOPE[key];
        if (!bucket) {
            var seed = GAMES_BY_DEPT[dn.toLowerCase()] || [];
            bucket = seed.slice();
            GAMES_BY_SCOPE[key] = bucket;
        }
        if (!bucket.some(function(g) { return g.name === gameName; })) {
            var copy = JSON.parse(JSON.stringify(sourceGame));
            copy.sharedDate = new Date().toISOString();
            bucket.push(copy);
        }
    });
}

// ===== Schedule step =====
function showGameScheduleStep(gameName) {
    _pendingGameName = gameName || _pendingGameName;

    var isAI = !!document.getElementById('aiGameTabSchedule');
    var scheduleTabBtn = document.getElementById(isAI ? 'aiGameTabSchedule' : 'gameTabSchedule');
    if (scheduleTabBtn) scheduleTabBtn.disabled = false;

    if (isAI) { switchGameAITab('ai-schedule'); } else { switchGameTab('schedule'); }

    // Ensure schedule body is populated
    var schedulePane = document.getElementById(isAI ? 'aiGameTabPaneSchedule' : 'gameTabPaneSchedule');
    if (schedulePane && !schedulePane.querySelector('.schedule-form')) {
        schedulePane.innerHTML = buildScheduleBodyHtml();
    }

    var actions = document.querySelector('#detailEdit .edit-actions');
    if (actions) {
        actions.innerHTML =
            '<button type="button" class="btn btn-outline" onclick="skipGameSchedule()">Skip</button>' +
            '<button type="button" class="btn btn-primary" onclick="confirmGameSchedule()">Schedule</button>';
    }

    var titleEl = document.getElementById('scheduleTitle');
    var subtitleEl = document.getElementById('scheduleSubtitle');
    // In edit panel, show schedule title inline (panel not used in add flow)
}

function confirmGameSchedule() {
    var typeRadio = document.querySelector('input[name="scheduleType"]:checked');
    var type = typeRadio ? typeRadio.value : 'now';
    if (type === 'date') {
        var dtInput = document.getElementById('scheduleDateTime');
        var val = dtInput ? dtInput.value : '';
        if (!val) { showGameToast('Please pick a date and time'); return; }
        // Find the most recently added game row (last row-game in tbody)
        var gameRows = document.querySelectorAll('#gamesTable tbody tr.row-game');
        var targetRow = _schedulingGameRow || (gameRows.length ? gameRows[gameRows.length - 1] : null);
        if (targetRow) {
            targetRow.dataset.scheduledDate = val;
            updateGameRowChips(targetRow);
        }
        showGameToast('Game scheduled for ' + val.replace('T', ' '));
    } else {
        showGameToast('Game published immediately');
    }
    persistGamesScope();
    showGameEmpty();
}

function cancelGameSchedule() { showGameEmpty(); }
function skipGameSchedule() {
    persistGamesScope();
    showGameEmpty();
}

// ===== Panel share (for existing game from kebab menu) =====
function openGameSharePanel(gameRow) {
    var name = gameRow.dataset.name || '';
    var companyKey = _currentGameScope.companyKey;
    var companies = (typeof GAMES_SIDEBAR_COMPANIES !== 'undefined') ? GAMES_SIDEBAR_COMPANIES : [];
    var departments = (typeof GAMES_SIDEBAR_DEPARTMENTS !== 'undefined') ? GAMES_SIDEBAR_DEPARTMENTS : [];
    var company = companies.find(function(c) { return c.name.toLowerCase() === companyKey; });
    if (!company) { showGameToast('Select a company first'); return; }

    var allDepts = departments.filter(function(d) { return d.companyId === company.id; });
    _currentGameShareTarget = { name: name, row: gameRow };

    var items = allDepts.map(function(d) {
        return '<label class="share-dept-item">' +
            '<input type="checkbox" value="' + escapeAttr(d.name) + '">' +
            '<span class="share-dept-name">' + escapeAttr(d.name) + '</span>' +
        '</label>';
    }).join('') || '<div class="share-empty">No departments to share with.</div>';

    document.getElementById('gameShareTitle').textContent = 'Share Game';
    document.getElementById('gameShareSubtitle').textContent = getGamesScopeSubtitle();
    document.getElementById('gameShareBody').innerHTML =
        '<p class="share-panel-lead"><strong>' + escapeAttr(name) + '</strong></p>' +
        '<div class="share-dept-list" id="gameShareDeptList">' + items + '</div>';

    var list = document.getElementById('gameShareDeptList');
    if (list) list.addEventListener('change', syncGameShareConfirmButton);
    syncGameShareConfirmButton();
    showGameShare();
}

function syncGameShareConfirmButton() {
    var btn = document.getElementById('gameShareConfirmBtn');
    var list = document.getElementById('gameShareDeptList');
    if (!btn || !list) return;
    var anyChecked = list.querySelectorAll('input:checked').length > 0;
    btn.disabled = !anyChecked;
}

function cancelGameSharePanel() {
    _currentGameShareTarget = null;
    showGameEmpty();
}

function confirmGameSharePanel() {
    var target = _currentGameShareTarget;
    if (!target) { showGameEmpty(); return; }
    var list = document.getElementById('gameShareDeptList');
    if (!list) { showGameEmpty(); return; }
    var depts = Array.from(list.querySelectorAll('input:checked')).map(function(c) { return c.value; });
    if (depts.length) {
        shareGameWithDepts(_currentGameScope.companyKey, target.name, depts);
        persistGamesScope();
        showGameToast('"' + target.name + '" shared to ' + depts.length + ' dept' + (depts.length !== 1 ? 's' : ''));
        refreshGames();
    }
    _currentGameShareTarget = null;
    showGameEmpty();
}

// ===== Panel schedule (from kebab menu) =====
function openGameSchedulePanel(gameRow) {
    _schedulingGameRow = gameRow;
    var name = gameRow.dataset.name || '';
    document.getElementById('scheduleTitle').textContent = 'Schedule Game';
    document.getElementById('scheduleSubtitle').textContent = escapeAttr(name);
    document.getElementById('scheduleBody').innerHTML = buildScheduleBodyHtml();
    showGameSchedule();
}

// ===== Edit existing game =====
function openGameEdit(row) {
    _gameEditType = 'game';
    _gameEditRow = row;
    var name = row.dataset.name || '';
    var description = row.dataset.description || '';
    var cover = row.dataset.cover || '';
    var isActive = row.dataset.active !== 'false';

    document.getElementById('gameEditTitle').textContent = 'Edit Game';
    document.getElementById('gameEditSubtitle').textContent = getGamesScopeSubtitle();
    setGamePanelMode('edit');

    // Show disable button
    var disBtn = document.getElementById('gameEditDisableBtn');
    var delBtn = document.getElementById('gameEditDeleteBtn');
    if (disBtn) {
        disBtn.classList.remove('hidden');
        disBtn.innerHTML = isActive ? '<i class="fas fa-ban"></i> Disable' : '<i class="fas fa-circle-check"></i> Enable';
        disBtn.className = isBtn => isActive ? 'btn btn-text-danger' : 'btn btn-text-success';
        disBtn.className = 'btn ' + (isActive ? 'btn-text-danger' : 'btn-text-success');
    }
    if (delBtn) delBtn.classList.remove('hidden');

    document.getElementById('gameEditFields').innerHTML =
        '<div class="form-group"><label>Cover Image</label>' + gameCoverPickerHtml(cover) + '</div>' +
        '<div class="form-group"><label>Game Name</label><input type="text" name="name" value="' + escapeAttr(name) + '" required></div>' +
        '<div class="form-group"><label>Description</label><textarea name="description" rows="3">' + escapeAttr(description) + '</textarea></div>';

    showGameEdit();
}

function openCatEdit(row) {
    _gameEditType = 'category';
    _gameEditRow = row;
    var name = row.dataset.name || '';
    var description = row.dataset.description || '';

    document.getElementById('gameEditTitle').textContent = 'Edit Category';
    document.getElementById('gameEditSubtitle').textContent = getGamesScopeSubtitle();
    setGamePanelMode('edit');

    var delBtn = document.getElementById('gameEditDeleteBtn');
    if (delBtn) delBtn.classList.remove('hidden');

    document.getElementById('gameEditFields').innerHTML =
        '<div class="form-group"><label>Category Name</label><input type="text" name="name" value="' + escapeAttr(name) + '" required></div>' +
        '<div class="form-group"><label>Description</label><textarea name="description" rows="3">' + escapeAttr(description) + '</textarea></div>';

    showGameEdit();
}

function openQEdit(row) {
    _gameEditType = 'question';
    _gameEditRow = row;
    var text = row.dataset.text || '';
    var opts = [];
    try { opts = JSON.parse(row.dataset.options || '[]'); } catch(e) {}
    while (opts.length < 4) opts.push('');
    var correct = parseInt(row.dataset.correct, 10) || 0;
    var points = parseInt(row.dataset.points, 10) || 1;

    document.getElementById('gameEditTitle').textContent = 'Edit Question';
    document.getElementById('gameEditSubtitle').textContent = getGamesScopeSubtitle();
    setGamePanelMode('edit');

    var delBtn = document.getElementById('gameEditDeleteBtn');
    if (delBtn) delBtn.classList.remove('hidden');

    var optsHtml = ['A','B','C','D'].map(function(letter, i) {
        return '<div class="q-opt">' +
            '<input type="radio" name="correct" value="' + i + '"' + (i === correct ? ' checked' : '') + '>' +
            '<span class="q-opt-label">' + letter + '</span>' +
            '<input type="text" name="opt' + i + '" value="' + escapeAttr(opts[i] || '') + '" placeholder="Option ' + letter + '">' +
        '</div>';
    }).join('');

    document.getElementById('gameEditFields').innerHTML =
        '<div class="form-group">' +
            '<label>Question Text</label>' +
            '<textarea name="qtext" rows="3">' + escapeAttr(text) + '</textarea>' +
        '</div>' +
        '<div class="form-group">' +
            '<label>Options (select the correct answer)</label>' +
            '<div class="q-opts-grid">' + optsHtml + '</div>' +
        '</div>' +
        '<div class="form-group"><label>Points</label><input type="number" name="points" min="1" max="10" value="' + points + '" style="width:70px"></div>';

    showGameEdit();
}

// ===== Delete helpers =====
function deleteCurrentGame() {
    if (!_gameEditRow) return;
    var name = _gameEditRow.dataset.name || '';
    if (!confirm('Delete "' + name + '" and all its categories and questions? This cannot be undone.')) return;
    var gameId = _gameEditRow.dataset.game;
    document.querySelectorAll('tr.row-q[data-game="' + gameId + '"]').forEach(function(r) { r.remove(); });
    document.querySelectorAll('tr.row-cat[data-game="' + gameId + '"]').forEach(function(r) { r.remove(); });
    _gameEditRow.remove();
    persistGamesScope();
    updateGamesCount(document.querySelectorAll('#gamesTable tbody tr.row-game'));
    showGameToast('"' + name + '" deleted');
    showGameEmpty();
}

function toggleCurrentGameActive() {
    if (!_gameEditRow) return;
    var name = _gameEditRow.dataset.name || '';
    var isActive = _gameEditRow.dataset.active !== 'false';
    if (isActive) {
        if (!confirm('Disable "' + name + '"? It will no longer be visible to users.')) return;
        _gameEditRow.dataset.active = 'false';
        _gameEditRow.classList.add('topic-disabled');
        showGameToast('"' + name + '" disabled');
    } else {
        _gameEditRow.dataset.active = 'true';
        _gameEditRow.classList.remove('topic-disabled');
        showGameToast('"' + name + '" enabled');
    }
    // Update status chip
    var statusEl = _gameEditRow.querySelector('.row-status');
    var nowActive = _gameEditRow.dataset.active !== 'false';
    if (statusEl) {
        statusEl.innerHTML = nowActive
            ? '<span class="chip chip-status chip-status-active">Active</span>'
            : '<span class="chip chip-status chip-status-disabled">Disabled</span>';
    }
    persistGamesScope();
    showGameEmpty();
}

// ===== Kebab menu =====
function toggleGameMenu(btn, evt) {
    evt.stopPropagation();
    var menu = btn.parentElement;
    var popup = menu.querySelector('.action-menu-popup');
    var wasOpen = menu.classList.contains('open');
    closeAllGameMenus();
    if (wasOpen || !popup) return;

    popup.style.visibility = 'hidden';
    menu.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');

    var r = btn.getBoundingClientRect();
    var pw = popup.offsetWidth;
    var ph = popup.offsetHeight;
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var left = r.right - pw;
    if (left < 8) left = 8;
    if (left + pw > vw - 8) left = vw - 8 - pw;
    var top = r.bottom + 4;
    if (top + ph > vh - 8) top = Math.max(8, r.top - ph - 4);
    popup.style.left = left + 'px';
    popup.style.top = top + 'px';
    popup.style.visibility = '';
}

function closeAllGameMenus() {
    document.querySelectorAll('.action-menu.open').forEach(function(m) {
        m.classList.remove('open');
        var t = m.querySelector('.action-menu-trigger');
        if (t) t.setAttribute('aria-expanded', 'false');
    });
}

document.addEventListener('click', function(evt) {
    if (evt.target.closest && evt.target.closest('.action-menu-popup')) return;
    if (evt.target.closest && evt.target.closest('.action-menu')) return;
    closeAllGameMenus();
});
document.addEventListener('keydown', function(evt) {
    if (evt.key === 'Escape') closeAllGameMenus();
});
window.addEventListener('scroll', closeAllGameMenus, true);
window.addEventListener('resize', closeAllGameMenus);

// ===== Kebab action handlers =====
function actionAddCategory(btn, evt) {
    evt.stopPropagation();
    closeAllGameMenus();
    var row = btn.closest('tr');
    if (!row) return;
    var gameId = row.dataset.game;
    var gameName = row.dataset.name || '';
    var catName = prompt('Category name:');
    if (!catName || !catName.trim()) return;
    var catId = Date.now();
    var newCat = { id: catId, name: catName.trim(), description: '', questions: [] };
    var tbody = document.querySelector('#gamesTable tbody');
    if (!tbody) return;
    // Insert after last cat row for this game (or after game row)
    var lastCat = null;
    document.querySelectorAll('tr.row-cat[data-game="' + gameId + '"]').forEach(function(cr) { lastCat = cr; });
    var insertAfter = lastCat || row;
    var addCatCover = row.dataset.cover || '';
    insertAfter.insertAdjacentHTML('afterend', catRowHtml(newCat, gameId, addCatCover));
    updateGameRowChips(row);
    persistGamesScope();
    showGameToast('Category "' + catName.trim() + '" added');
}

function actionEditGame(btn, evt) {
    evt.stopPropagation();
    closeAllGameMenus();
    var row = btn.closest('tr');
    if (!row) return;
    openGameEdit(row);
}

function actionShareGame(btn, evt) {
    evt.stopPropagation();
    closeAllGameMenus();
    var row = btn.closest('tr');
    if (!row) return;
    openGameSharePanel(row);
}

function actionScheduleGame(btn, evt) {
    evt.stopPropagation();
    closeAllGameMenus();
    var row = btn.closest('tr');
    if (!row) return;
    openGameSchedulePanel(row);
}

function actionToggleGameActive(btn, evt) {
    evt.stopPropagation();
    closeAllGameMenus();
    var row = btn.closest('tr');
    if (!row) return;
    var name = row.dataset.name || '';
    var isActive = row.dataset.active !== 'false';
    if (isActive) {
        if (!confirm('Disable "' + name + '"? It will no longer be visible to users.')) return;
        row.dataset.active = 'false';
        row.classList.add('topic-disabled');
        showGameToast('"' + name + '" disabled');
    } else {
        row.dataset.active = 'true';
        row.classList.remove('topic-disabled');
        showGameToast('"' + name + '" enabled');
    }
    var statusEl = row.querySelector('.row-status');
    var nowActive = row.dataset.active !== 'false';
    if (statusEl) {
        statusEl.innerHTML = nowActive
            ? '<span class="chip chip-status chip-status-active">Active</span>'
            : '<span class="chip chip-status chip-status-disabled">Disabled</span>';
    }
    persistGamesScope();
}

function actionDeleteGame(btn, evt) {
    evt.stopPropagation();
    closeAllGameMenus();
    var row = btn.closest('tr');
    if (!row) return;
    var name = row.dataset.name || '';
    if (!confirm('Delete "' + name + '" and all its categories and questions? This cannot be undone.')) return;
    var gameId = row.dataset.game;
    document.querySelectorAll('tr.row-q[data-game="' + gameId + '"]').forEach(function(r) { r.remove(); });
    document.querySelectorAll('tr.row-cat[data-game="' + gameId + '"]').forEach(function(r) { r.remove(); });
    row.remove();
    persistGamesScope();
    updateGamesCount(document.querySelectorAll('#gamesTable tbody tr.row-game'));
    showGameToast('"' + name + '" deleted');
    showGameEmpty();
}

function actionAddQuestion(btn, evt) {
    evt.stopPropagation();
    closeAllGameMenus();
    var row = btn.closest('tr');
    if (!row) return;
    var gameId = row.dataset.game;
    var catId = row.dataset.cat;
    var catName = row.dataset.name || 'Category';

    _gameEditType = 'add-question';
    _gameEditRow = row;

    document.getElementById('gameEditTitle').textContent = 'Add Question';
    document.getElementById('gameEditSubtitle').textContent = escapeAttr(catName);
    setGamePanelMode('add');

    var optsHtml = ['A','B','C','D'].map(function(letter, i) {
        return '<div class="q-opt">' +
            '<input type="radio" name="correct" value="' + i + '"' + (i === 0 ? ' checked' : '') + '>' +
            '<span class="q-opt-label">' + letter + '</span>' +
            '<input type="text" name="opt' + i + '" placeholder="Option ' + letter + '">' +
        '</div>';
    }).join('');

    document.getElementById('gameEditFields').innerHTML =
        '<div class="form-group"><label>Question Text</label><textarea name="qtext" rows="3" placeholder="Enter question text…"></textarea></div>' +
        '<div class="form-group"><label>Options (select the correct answer)</label><div class="q-opts-grid">' + optsHtml + '</div></div>' +
        '<div class="form-group"><label>Points</label><input type="number" name="points" min="1" max="10" value="1" style="width:70px"></div>';

    // Override submit to add question to existing cat row
    var form = document.getElementById('gameEditForm');
    form.onsubmit = function(e) {
        e.preventDefault();
        var data = new FormData(form);
        var text = (data.get('qtext') || '').trim();
        if (!text) { showGameToast('Enter question text'); return; }
        var opts = [];
        for (var i = 0; i < 4; i++) {
            var v = (data.get('opt' + i) || '').trim();
            if (!v) { showGameToast('Fill in all 4 options'); return; }
            opts.push(v);
        }
        var correct = parseInt(data.get('correct') || '0', 10);
        var points = parseInt(data.get('points') || '1', 10);
        var newQ = { id: Date.now() + Math.floor(Math.random() * 1000), text: text, options: opts, correct: correct, points: points };
        var tbody = document.querySelector('#gamesTable tbody');
        var existingQs = document.querySelectorAll('tr.row-q[data-game="' + gameId + '"][data-cat="' + catId + '"]');
        var qNum = existingQs.length + 1;
        var insertAfter = existingQs.length ? existingQs[existingQs.length - 1] : row;
        insertAfter.insertAdjacentHTML('afterend', qRowHtml(newQ, gameId, catId, qNum));
        updateCatRowChips(row);
        var gameRow = document.querySelector('tr.row-game[data-game="' + gameId + '"]');
        if (gameRow) updateGameRowChips(gameRow);
        persistGamesScope();
        showGameToast('Question added');
        // Restore default onsubmit
        form.onsubmit = saveGameAdd;
        showGameEmpty();
    };

    showGameEdit();
}

function actionEditCat(btn, evt) {
    evt.stopPropagation();
    closeAllGameMenus();
    var row = btn.closest('tr');
    if (!row) return;
    openCatEdit(row);
}

function actionDeleteCat(btn, evt) {
    evt.stopPropagation();
    closeAllGameMenus();
    var row = btn.closest('tr');
    if (!row) return;
    var name = row.dataset.name || '';
    if (!confirm('Delete category "' + name + '" and all its questions? This cannot be undone.')) return;
    var gameId = row.dataset.game;
    var catId = row.dataset.cat;
    document.querySelectorAll('tr.row-q[data-game="' + gameId + '"][data-cat="' + catId + '"]').forEach(function(r) { r.remove(); });
    row.remove();
    var gameRow = document.querySelector('tr.row-game[data-game="' + gameId + '"]');
    if (gameRow) updateGameRowChips(gameRow);
    persistGamesScope();
    showGameToast('"' + name + '" deleted');
    showGameEmpty();
}

function actionEditQuestion(btn, evt) {
    evt.stopPropagation();
    closeAllGameMenus();
    var row = btn.closest('tr');
    if (!row) return;
    openQEdit(row);
}

function actionDeleteQuestion(btn, evt) {
    evt.stopPropagation();
    closeAllGameMenus();
    var row = btn.closest('tr');
    if (!row) return;
    var text = (row.dataset.text || '').substring(0, 40);
    if (!confirm('Delete question "' + text + '…"? This cannot be undone.')) return;
    var gameId = row.dataset.game;
    var catId = row.dataset.cat;
    row.remove();
    var catRow = document.querySelector('tr.row-cat[data-game="' + gameId + '"][data-cat="' + catId + '"]');
    if (catRow) updateCatRowChips(catRow);
    var gameRow = document.querySelector('tr.row-game[data-game="' + gameId + '"]');
    if (gameRow) updateGameRowChips(gameRow);
    persistGamesScope();
    showGameToast('Question deleted');
    showGameEmpty();
}

// ===== Filter / search =====
function filterGames(query) {
    var q = (query || '').toLowerCase().trim();
    document.querySelectorAll('#gamesTable tbody tr.row-game').forEach(function(gameRow) {
        var gameName = (gameRow.dataset.name || '').toLowerCase();
        var gameId = gameRow.dataset.game;
        var match = q === '' || gameName.includes(q);
        gameRow.classList.toggle('hidden', !match);
        document.querySelectorAll('tr.row-cat[data-game="' + gameId + '"]').forEach(function(cr) {
            cr.classList.toggle('hidden', !match || !_expandedGames[gameId]);
            var catId = cr.dataset.cat;
            document.querySelectorAll('tr.row-q[data-game="' + gameId + '"][data-cat="' + catId + '"]').forEach(function(qr) {
                qr.classList.toggle('hidden', !match || !_expandedGames[gameId] || !_expandedCats[gameId + '-' + catId]);
            });
        });
    });
}

function filterByGameStatus(status) {
    _gameStatusFilter = status;
    refreshGames();
}

// ===== AI flow =====
var _gameAiCreditsUsed = {};
(function() {
    try {
        var s = JSON.parse(localStorage.getItem('gameon.aiCredits') || '{}');
        Object.keys(s).forEach(function(k) { _gameAiCreditsUsed[k] = s[k]; });
    } catch(e) {}
})();
var _aiGameGenerateIdx = 0;

var _GAME_AI_NAME_POOL = [
    { name: 'Digital Marketing Challenge',   description: 'Test your knowledge of modern digital marketing strategies and channels.' },
    { name: 'Product Knowledge Quiz',        description: 'Deepen your understanding of our product range, features and benefits.' },
    { name: 'Sales Mastery Game',            description: 'Master the end-to-end sales process from prospecting to closing.' },
    { name: 'Leadership IQ',                 description: 'Explore core leadership principles and test your people management skills.' },
    { name: 'Compliance Essentials',         description: 'Core compliance and regulatory knowledge every employee must have.' },
    { name: 'Customer Service Challenge',    description: 'Practise handling customer interactions with empathy and professionalism.' },
    { name: 'Brand Ambassador Quiz',         description: 'Everything you need to know to represent our brand with confidence.' },
    { name: 'Financial Literacy Game',       description: 'Build confidence with budgeting, forecasting and financial reporting.' },
    { name: 'Cybersecurity Awareness',       description: 'Recognise threats, protect data and stay safe in the digital workplace.' },
    { name: 'Project Management Challenge',  description: 'Test your ability to plan, execute and close projects on time.' },
    { name: 'Diversity & Inclusion Quiz',    description: 'Understand how to create an inclusive and equitable workplace.' },
    { name: 'Innovation Mindset Game',       description: 'Challenge yourself to think creatively and solve problems differently.' },
    { name: 'Negotiation Skills Challenge',  description: 'Practise strategies to reach mutually beneficial agreements.' },
    { name: 'Supply Chain Fundamentals',     description: 'Understand how goods and information flow from supplier to customer.' },
    { name: 'Agile Ways of Working',         description: 'Test your knowledge of iterative, collaborative agile practices.' },
    { name: 'Emotional Intelligence Quiz',   description: 'Harness self-awareness and empathy to improve working relationships.' },
    { name: 'Change Management Challenge',   description: 'Guide teams and organisations through transformation successfully.' },
    { name: 'Data Literacy Game',            description: 'Read, interpret and communicate data to make smarter decisions.' },
    { name: 'Sustainability & ESG Quiz',     description: 'Explore environmental, social and governance principles for business.' },
    { name: 'Coaching & Mentoring Skills',   description: 'Support the growth of others through structured coaching conversations.' },
    { name: 'Critical Thinking Challenge',   description: 'Apply structured reasoning to analyse complex problems effectively.' },
    { name: 'Presentation Skills Quiz',      description: 'Craft and deliver compelling presentations with confidence.' }
];

var _gameAiNameQueue = (function() {
    var arr = _GAME_AI_NAME_POOL.slice();
    for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    return arr;
}());
var _gameAiNameQueueIdx = 0;

function nextGameAISuggestion() {
    if (_gameAiNameQueueIdx >= _gameAiNameQueue.length) {
        _gameAiNameQueue = _GAME_AI_NAME_POOL.slice();
        for (var i = _gameAiNameQueue.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = _gameAiNameQueue[i]; _gameAiNameQueue[i] = _gameAiNameQueue[j]; _gameAiNameQueue[j] = tmp;
        }
        _gameAiNameQueueIdx = 0;
    }
    return _gameAiNameQueue[_gameAiNameQueueIdx++];
}

var _GAME_AI_SUGGESTIONS = [
    {
        categories: [
            {
                name: 'Understanding the Customer',
                questions: [
                    { text: 'Which technique is most effective for uncovering a customer\'s true pain point?', options: ['Presenting a product brochure', 'Asking open-ended discovery questions', 'Sending an email follow-up', 'Offering an immediate discount'], correct: 1 },
                    { text: 'The "voice of the customer" refers to:', options: ['Internal feedback from the sales team', 'A documented process capturing customer expectations and preferences', 'Marketing copy written in a friendly tone', 'The tone of customer service calls'], correct: 1 },
                    { text: 'Customer lifetime value (CLV) is important because:', options: ['It measures how long a contract lasts', 'It helps prioritise which customers deserve the most attention and investment', 'It tracks daily transaction volume', 'It replaces net promoter score'], correct: 1 }
                ]
            },
            {
                name: 'Sales Techniques',
                questions: [
                    { text: 'The SPIN selling methodology stands for:', options: ['Sell, Pitch, Influence, Negotiate', 'Situation, Problem, Implication, Need-Payoff', 'Strategy, Planning, Insight, Nurture', 'Speed, Persistence, Interest, Numbers'], correct: 1 },
                    { text: 'A "feature dump" in a sales call is problematic because:', options: ['It takes too long to prepare', 'It focuses on product attributes rather than customer value', 'Features are confidential information', 'Customers prefer technical details only'], correct: 1 },
                    { text: 'Social selling primarily leverages:', options: ['Cold calling lists', 'Professional networks like LinkedIn to build relationships and trust', 'Television advertising', 'Trade shows and events'], correct: 1 }
                ]
            },
            {
                name: 'Closing & Follow-up',
                questions: [
                    { text: 'The "summary close" technique involves:', options: ['Asking the prospect to sign immediately', 'Recapping agreed benefits before asking for commitment', 'Sending a price list with no context', 'Introducing a new stakeholder late in the process'], correct: 1 },
                    { text: 'After a proposal is submitted, the ideal follow-up cadence is:', options: ['Wait for the prospect to contact you', 'Call daily until you get a response', 'Agree on a specific follow-up date with the prospect', 'Send increasingly urgent emails'], correct: 2 },
                    { text: 'A lost deal should result in:', options: ['Removing the prospect from your CRM', 'A structured debrief to identify lessons and keep the relationship warm', 'Escalating to management immediately', 'Offering a large retroactive discount'], correct: 1 }
                ]
            }
        ]
    },
    {
        categories: [
            {
                name: 'Brand Identity',
                questions: [
                    { text: 'A brand\'s "tone of voice" is best described as:', options: ['The volume of the company\'s advertising spend', 'The personality and style reflected in all written and spoken communications', 'The colour palette in marketing materials', 'The name and logo of the company'], correct: 1 },
                    { text: 'Brand equity refers to:', options: ['The total marketing budget allocated to a brand', 'The commercial value derived from consumer perception of a brand name', 'The number of products under a brand portfolio', 'Annual brand revenue'], correct: 1 },
                    { text: 'Which element is NOT typically part of a visual identity system?', options: ['Logo', 'Typography', 'Pricing strategy', 'Colour palette'], correct: 2 }
                ]
            },
            {
                name: 'Digital Channels',
                questions: [
                    { text: 'Organic social media reach has declined mainly because:', options: ['Users spend less time online', 'Platform algorithms prioritise paid content and personal connections over brand pages', 'Content quality has improved', 'Mobile usage has decreased'], correct: 1 },
                    { text: 'An email open rate of 25% means:', options: ['25% of recipients clicked a link in the email', '25 people opened the email', '25% of the people who received the email opened it', '25% of the emails were delivered'], correct: 2 },
                    { text: 'A/B testing in digital marketing involves:', options: ['Testing two different products simultaneously', 'Comparing two versions of a campaign element to determine which performs better', 'Running ads on two different platforms at the same time', 'Testing with two different target audiences per month'], correct: 1 }
                ]
            },
            {
                name: 'Campaign Measurement',
                questions: [
                    { text: 'Return on ad spend (ROAS) is calculated as:', options: ['Total ad spend ÷ number of clicks', 'Revenue generated from ads ÷ cost of those ads', 'Impressions × click-through rate', 'Conversion rate × average order value'], correct: 1 },
                    { text: 'A marketing attribution model assigns credit for a conversion. The "last-click" model:', options: ['Gives equal credit to every touchpoint', 'Gives full credit to the first channel the customer interacted with', 'Gives full credit to the final channel before conversion', 'Ignores paid channels entirely'], correct: 2 },
                    { text: 'Customer acquisition cost (CAC) is important because:', options: ['It replaces revenue as the primary success metric', 'It must be lower than customer lifetime value for a sustainable business model', 'It measures how satisfied customers are', 'It is only relevant to B2C businesses'], correct: 1 }
                ]
            }
        ]
    },
    {
        categories: [
            {
                name: 'Leadership Principles',
                questions: [
                    { text: 'Psychological safety in a team means:', options: ['Team members never disagree', 'People feel safe to speak up, take risks and admit mistakes without fear of punishment', 'The workplace has been physically risk-assessed', 'All decisions are approved by HR'], correct: 1 },
                    { text: 'A leader who delegates effectively should:', options: ['Delegate only tasks they find boring', 'Provide clear context and authority, then step back to let others execute', 'Check in hourly to monitor progress', 'Only delegate to senior team members'], correct: 1 },
                    { text: 'The difference between management and leadership is best described as:', options: ['Managers earn more than leaders', 'Management focuses on tasks and processes; leadership focuses on people and direction', 'Leadership is a formal role; management is informal', 'They are interchangeable terms'], correct: 1 }
                ]
            },
            {
                name: 'Feedback & Coaching',
                questions: [
                    { text: 'The SBI feedback model stands for:', options: ['Strengths, Behaviours, Improvements', 'Situation, Behaviour, Impact', 'Set goals, Build skills, Inspect results', 'Specify, Brief, Iterate'], correct: 1 },
                    { text: 'Active listening involves:', options: ['Waiting for your turn to speak', 'Fully concentrating, understanding and responding thoughtfully to the speaker', 'Taking notes while the other person speaks', 'Paraphrasing every sentence immediately'], correct: 1 },
                    { text: 'A coaching conversation differs from a mentoring conversation primarily because:', options: ['Coaching is more expensive', 'Coaching draws out the coachee\'s own solutions; mentoring shares the mentor\'s experience and advice', 'Mentoring is always one-off; coaching is ongoing', 'They are the same thing'], correct: 1 }
                ]
            },
            {
                name: 'Decision Making',
                questions: [
                    { text: 'Analysis paralysis occurs when:', options: ['A team makes a decision too quickly', 'Excessive analysis delays decision-making beyond the point where action is needed', 'A leader makes all decisions alone', 'Data is not available for a decision'], correct: 1 },
                    { text: 'The RACI framework helps teams by:', options: ['Ranking employees by performance', 'Clarifying who is Responsible, Accountable, Consulted and Informed for each task', 'Measuring return on investment', 'Scheduling recurring meetings'], correct: 1 },
                    { text: 'Cognitive bias in decision-making refers to:', options: ['A preference for data-driven decisions', 'Systematic patterns of deviation from rationality that affect judgement', 'Using only recent data to forecast', 'A tendency to consult too many stakeholders'], correct: 1 }
                ]
            }
        ]
    },
    {
        categories: [
            {
                name: 'Data Protection & Privacy',
                questions: [
                    { text: 'Under POPIA, a "responsible party" is:', options: ['The person whose data is being processed', 'The entity that determines the purpose and means of processing personal information', 'The IT administrator who manages data systems', 'The regulator who oversees data protection'], correct: 1 },
                    { text: 'A data subject\'s right of access allows them to:', options: ['Delete anyone\'s data at any time', 'Request confirmation of whether their personal information is being processed and obtain a copy', 'Access another person\'s data', 'Opt out of all marketing automatically'], correct: 1 },
                    { text: 'Which of the following is a lawful basis for processing personal information under POPIA?', options: ['The data has been publicly posted online', 'Processing is necessary to comply with a legal obligation', 'The company has been in business for more than 5 years', 'The data is stored on a secure server'], correct: 1 }
                ]
            },
            {
                name: 'Workplace Ethics',
                questions: [
                    { text: 'Whistleblowing legislation protects employees who:', options: ['Report their manager to clients', 'Disclose information about illegal or unethical conduct in good faith', 'Resign from the company', 'Refuse to follow instructions they disagree with'], correct: 1 },
                    { text: 'The King IV governance code emphasises which principle above all?', options: ['Maximising short-term shareholder returns', 'Integrated thinking and ethical, effective leadership', 'Minimising regulatory reporting requirements', 'Centralising all decision-making with the board'], correct: 1 },
                    { text: 'An anti-bribery policy typically requires employees to:', options: ['Refuse all gifts regardless of value', 'Declare and seek approval for gifts and hospitality above a defined threshold', 'Avoid all contact with government officials', 'Report every supplier interaction to compliance'], correct: 1 }
                ]
            },
            {
                name: 'Health & Safety',
                questions: [
                    { text: 'Under the Occupational Health and Safety Act, employees have a duty to:', options: ['Report all incidents to the media', 'Take reasonable care for their own safety and that of others in the workplace', 'Inspect all equipment daily', 'Conduct monthly fire drills'], correct: 1 },
                    { text: 'A hazard identification and risk assessment (HIRA) should be reviewed:', options: ['Only when a serious accident occurs', 'At regular intervals and whenever there is a change in work processes or environment', 'Once when the workplace opens', 'Only by the health and safety representative'], correct: 1 },
                    { text: 'The purpose of a safety data sheet (SDS) is to:', options: ['List all employees trained in chemical handling', 'Provide information on the properties, hazards and safe handling of a chemical substance', 'Record all chemical purchases', 'Replace the need for personal protective equipment'], correct: 1 }
                ]
            }
        ]
    }
];

// ===== AI flow helpers =====

function getAIGameTopicOptions() {
    var topics = [];
    var ck = (_currentGameScope && _currentGameScope.companyKey) || '';
    var dept = (_currentGameScope && _currentGameScope.dept) || '';
    if (typeof TOPICS_BY_SCOPE !== 'undefined') {
        var bucket = TOPICS_BY_SCOPE[(ck || '') + '|' + (dept || '')];
        if (bucket && bucket.length) topics = bucket;
    }
    if (!topics.length && typeof TOPICS_BY_DEPT !== 'undefined') {
        var deptKey = dept ? dept.toLowerCase() : '';
        topics = (deptKey && TOPICS_BY_DEPT[deptKey]) ? TOPICS_BY_DEPT[deptKey] : (TOPICS_BY_DEPT['_default'] || []);
    }
    if (!topics.length) return '';
    return topics.slice(0, 30).map(function(t) {
        var val = escapeAttr(JSON.stringify({ name: t.name, description: t.description || '', cover: t.cover || '' }));
        return '<option value="' + val + '">' + escapeAttr(t.name) + '</option>';
    }).join('');
}

function onAIGameTopicChange(select) {
    window._aiGamePendingTopic = null;
    var val = select ? select.value : '';
    var note = document.getElementById('aiGameContentSkipNote');
    if (!val) {
        if (note) note.classList.add('hidden');
        return;
    }
    try { window._aiGamePendingTopic = JSON.parse(val); } catch(e) { window._aiGamePendingTopic = { name: val }; }
    if (note) note.classList.remove('hidden');
    updateAIGameGenerateBtn();
}

function onManualGameTopicChange(select) {
    var val = select ? select.value : '';
    if (!val) return;
    try {
        var t = JSON.parse(val);
        var pane = document.getElementById('gameTabPaneGame');
        if (!pane) return;
        var nameInput = pane.querySelector('input[name="name"]');
        if (nameInput && !nameInput.value.trim()) nameInput.value = t.name || '';
        var descInput = pane.querySelector('textarea[name="description"]');
        if (descInput && !descInput.value.trim()) descInput.value = t.description || '';
        if (t.cover) {
            var hidden = pane.querySelector('.cover-hidden-input');
            if (hidden) {
                hidden.value = t.cover;
                var picker = hidden.closest('.cover-picker');
                if (picker) {
                    picker.querySelectorAll('.cover-tile').forEach(function(tile) {
                        tile.classList.remove('selected');
                        var chk = tile.querySelector('.cover-check'); if (chk) chk.remove();
                        if (tile.dataset.cover === t.cover) {
                            tile.classList.add('selected');
                            tile.insertAdjacentHTML('beforeend', '<span class="cover-check"><i class="fas fa-check"></i></span>');
                        }
                    });
                }
            }
        }
    } catch(e) {}
}

function updateAIGameQCount(slider) {
    var label = document.getElementById('aiGameQCountLabel');
    if (label) label.textContent = slider.value;
    updateAIGameCreditsEstimate();
}

function updateAIGameCreditsEstimate() {
    var valEl = document.getElementById('aiGameCreditsEstimateVal');
    if (!valEl) return;
    var qCount = parseInt((document.getElementById('aiGameQCount') || { value: '5' }).value, 10) || 5;
    var includeCats = document.getElementById('aiGameIncludeCats');
    var withCats = !includeCats || includeCats.checked;
    var typeCount = Math.max(1, document.querySelectorAll('#aiGameQConfig input[name="qtype"]:checked').length);
    var estimate = Math.max(1, Math.round(1 + (withCats ? 3 : 1) * 0.4 * qCount * typeCount));
    valEl.textContent = estimate;
}

function toggleGameCoverSection(checkbox, bodyId) {
    var el = document.getElementById(bodyId);
    if (el) el.classList.toggle('hidden', !checkbox.checked);
}

function gameCoverToggleHtml(currentCover, toggleId, bodyId, fromTopic) {
    var hasPreset = !!currentCover;
    var labelExtra = fromTopic ? ' <span class="form-label-optional">(from topic)</span>' : '';
    return '<div class="form-group">' +
        '<label class="ai-toggle-label" style="margin-bottom:0">' +
            '<span class="ai-toggle-wrap">' +
                '<input type="checkbox" class="ai-toggle-input" id="' + escapeAttr(toggleId) + '"' + (hasPreset ? ' checked' : '') +
                    ' onchange="toggleGameCoverSection(this,\'' + escapeAttr(bodyId) + '\')">' +
                '<span class="ai-toggle-track"></span>' +
            '</span>' +
            '<span class="ai-toggle-text">Add cover image' + labelExtra + '</span>' +
        '</label>' +
        '<div id="' + escapeAttr(bodyId) + '"' + (!hasPreset ? ' class="hidden"' : '') + ' style="margin-top:8px">' +
            gameCoverPickerHtml(currentCover || '') +
        '</div>' +
    '</div>';
}

function stepGameAttempts(delta, inputId) {
    var inp = document.getElementById(inputId || 'aiGameMaxAttempts');
    if (!inp) return;
    var val = Math.max(1, Math.min(99, (parseInt(inp.value, 10) || 1) + delta));
    inp.value = val;
}

function addGameAI() {
    _gameAddCats = [];
    _editingCatIdx = null;
    _gameEditRow = null;
    _gameEditType = 'game';
    _isAIGameFlow = true;

    document.getElementById('gameEditTitle').textContent = 'Add Game with AI';
    document.getElementById('gameEditSubtitle').textContent = getGamesScopeSubtitle();
    window._aiGamePendingTopic = null;

    var topicOpts = getAIGameTopicOptions();

    document.getElementById('gameEditFields').innerHTML =

        // ── Setup tab bar ──────────────────────────────────────────────────
        '<div class="add-topic-tabs" id="aiGameSetupTabBar">' +
            '<button type="button" class="add-topic-tab active" data-tab="content" onclick="switchAIGameSetupTab(\'content\')">Content</button>' +
            '<button type="button" class="add-topic-tab" data-tab="questions" onclick="switchAIGameSetupTab(\'questions\')">Questions</button>' +
        '</div>' +

        // ── Content pane ───────────────────────────────────────────────────
        '<div class="add-topic-pane" id="aiGameSetupPaneContent">' +

            // Link to existing topic
            '<div class="form-group" id="aiGameTopicGroup">' +
                '<label for="aiGameTopicSelect">Link to topic <span class="form-label-optional">(optional)</span></label>' +
                '<select id="aiGameTopicSelect" class="ai-model-select" onchange="onAIGameTopicChange(this)">' +
                    '<option value="">— no topic —</option>' +
                    (topicOpts || '<option value="" disabled style="color:#9ca3af">No topics in current scope</option>') +
                '</select>' +
            '</div>' +

            // Content input
            '<div class="form-group" id="aiGameStep1">' +
                '<label>Content to base the game on' +
                    '<span class="form-label-optional ai-content-skip-note hidden" id="aiGameContentSkipNote"> — optional when linked to a topic</span>' +
                '</label>' +
                '<div class="content-kind-tabs" style="display:flex;gap:6px;margin-bottom:8px">' +
                    '<button type="button" class="content-kind-tab active" onclick="switchAIGameContentTab(this,\'upload\')"><i class="fas fa-upload"></i> Upload</button>' +
                    '<button type="button" class="content-kind-tab" onclick="switchAIGameContentTab(this,\'url\')"><i class="fas fa-link"></i> URL</button>' +
                    '<button type="button" class="content-kind-tab" onclick="switchAIGameContentTab(this,\'text\')"><i class="fas fa-align-left"></i> Text</button>' +
                '</div>' +
                '<div id="aiGameContentUpload" class="ai-content-pane">' +
                    '<label class="file-upload-zone" style="display:flex;align-items:center;justify-content:center;height:80px;border:2px dashed #d1d5db;border-radius:8px;cursor:pointer;color:#6b7280;font-size:0.85rem;gap:8px">' +
                        '<i class="fas fa-upload"></i> Upload PDF, DOCX, XLSX, PNG or JPEG' +
                        '<input type="file" accept=".pdf,.docx,.xlsx,.png,.jpeg,.jpg" style="display:none" onchange="onAIGameFileChange(this)">' +
                    '</label>' +
                '</div>' +
                '<div id="aiGameContentUrl" class="ai-content-pane hidden">' +
                    '<input type="text" id="aiGameUrlInput" placeholder="https://…" style="width:100%;padding:7px 10px;font-size:0.85rem;border:1px solid #d1d5db;border-radius:6px" oninput="updateAIGameGenerateBtn()">' +
                '</div>' +
                '<div id="aiGameContentText" class="ai-content-pane hidden">' +
                    '<textarea id="aiGameTextInput" rows="5" placeholder="Paste learning content here…" style="width:100%;padding:7px 10px;font-size:0.85rem;border:1px solid #d1d5db;border-radius:6px;resize:vertical;font-family:inherit" oninput="updateAIGameGenerateBtn()"></textarea>' +
                '</div>' +
            '</div>' +

            // Categories toggle
            '<div class="ai-subtopics-option" id="aiGameCatsToggle">' +
                '<label class="ai-toggle-label">' +
                    '<span class="ai-toggle-wrap">' +
                        '<input type="checkbox" id="aiGameIncludeCats" class="ai-toggle-input" checked onchange="updateAIGameCreditsEstimate()">' +
                        '<span class="ai-toggle-track"></span>' +
                    '</span>' +
                    '<span class="ai-toggle-text">Generate with categories &amp; questions</span>' +
                '</label>' +
            '</div>' +

            // AI model
            '<div class="form-group ai-model-group">' +
                '<label for="aiGameModelSelect">AI Model</label>' +
                '<select id="aiGameModelSelect" class="ai-model-select">' +
                    '<option value="claude-sonnet-4-6" selected>Claude Sonnet 4.6 — Recommended</option>' +
                    '<option value="claude-opus-4-7">Claude Opus 4.7 — Most capable</option>' +
                    '<option value="claude-haiku-4-5">Claude Haiku 4.5 — Fastest</option>' +
                    '<option value="gpt-4o">GPT-4o</option>' +
                    '<option value="gemini-1.5-pro">Gemini 1.5 Pro</option>' +
                '</select>' +
            '</div>' +

        '</div>' +

        // ── Questions pane ─────────────────────────────────────────────────
        '<div class="add-topic-pane hidden" id="aiGameSetupPaneQuestions">' +

            // Question types
            '<div class="form-group ai-game-qconfig" id="aiGameQConfig">' +
                '<label>Question types</label>' +
                '<div class="ai-q-types-grid">' +
                    '<label class="ai-q-type-option"><span class="ai-q-type-label"><i class="fas fa-list-ol"></i> MCQ</span><input type="checkbox" name="qtype" value="mcq" checked onchange="updateAIGameCreditsEstimate()"></label>' +
                    '<label class="ai-q-type-option"><span class="ai-q-type-label"><i class="fas fa-rocket"></i> Word Rocket</span><input type="checkbox" name="qtype" value="word-rocket" onchange="updateAIGameCreditsEstimate()"></label>' +
                    '<label class="ai-q-type-option"><span class="ai-q-type-label"><i class="fas fa-border-all"></i> Crossword</span><input type="checkbox" name="qtype" value="crossword" onchange="updateAIGameCreditsEstimate()"></label>' +
                    '<label class="ai-q-type-option"><span class="ai-q-type-label"><i class="fas fa-underline"></i> Fill in the Blank</span><input type="checkbox" name="qtype" value="fill-blank" onchange="updateAIGameCreditsEstimate()"></label>' +
                    '<label class="ai-q-type-option"><span class="ai-q-type-label"><i class="fas fa-align-left"></i> Statement Blanking</span><input type="checkbox" name="qtype" value="stmt-blank" onchange="updateAIGameCreditsEstimate()"></label>' +
                    '<label class="ai-q-type-option"><span class="ai-q-type-label"><i class="fas fa-image"></i> Select on Image</span><input type="checkbox" name="qtype" value="select-img" onchange="updateAIGameCreditsEstimate()"></label>' +
                '</div>' +
            '</div>' +

            // Max questions slider
            '<div class="form-group ai-qcount-group" id="aiGameQCountGroup">' +
                '<label>Questions per category — <strong><span id="aiGameQCountLabel">5</span></strong> <span class="form-label-optional">(max 10)</span></label>' +
                '<input type="range" id="aiGameQCount" min="1" max="10" value="5" class="ai-qcount-slider" oninput="updateAIGameQCount(this)">' +
                '<div class="ai-qcount-scale"><span>1</span><span>5</span><span>10</span></div>' +
                '<div class="ai-qcount-note">Questions per attempt is configured in the manual flow</div>' +
            '</div>' +

            // Difficulty (auto-set, display only)
            '<div class="ai-difficulty-row" id="aiGameDifficultyRow">' +
                '<span class="ai-difficulty-label"><i class="fas fa-sliders"></i> Difficulty</span>' +
                '<div class="ai-difficulty-badges">' +
                    '<span class="ai-diff-badge ai-diff-easy">Easy</span>' +
                    '<span class="ai-diff-badge ai-diff-medium ai-diff-active">Medium</span>' +
                    '<span class="ai-diff-badge ai-diff-hard">Hard</span>' +
                '</div>' +
                '<span class="ai-difficulty-note">Auto-set · adjustable per attempt in manual flow</span>' +
            '</div>' +

            // Credits estimate
            '<div class="ai-credits-estimate" id="aiGameCreditsEstimate">' +
                '<i class="fas fa-coins"></i> Estimated <strong><span id="aiGameCreditsEstimateVal">3</span> credits</strong> for this generation' +
            '</div>' +

        '</div>' +

        '<div class="hidden" id="aiGameStep2"></div>';

    _aiGameGenerateIdx = 0;
    updateAIGameCreditsEstimate();

    setGamePanelMode('add');
    _isAIGameFlow = true;

    var badge = document.getElementById('gameEditBadge');
    if (badge) {
        badge.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> Adding with AI';
        badge.classList.add('badge-ai');
    }

    var ck = (_currentGameScope && _currentGameScope.companyKey) || '';
    var usedNow = _gameAiCreditsUsed[ck] || 0;
    var totalNow = getGameCompanyCreditsTotal(ck);
    var countEl = document.getElementById('aiGameCreditsCount');
    if (countEl) countEl.textContent = usedNow;
    var totalEl = document.getElementById('aiGameCreditsTotal');
    if (totalEl) totalEl.textContent = totalNow;
    var creditsEl = document.getElementById('aiGameCreditsDisplay');
    if (creditsEl) creditsEl.hidden = false;

    var submitBtn = document.getElementById('gameSubmitBtn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Save';
        var genBtn = document.createElement('button');
        genBtn.type = 'button';
        genBtn.id = 'aiGameGenerateBtn';
        genBtn.className = 'btn btn-ai';
        genBtn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> Generate';
        genBtn.disabled = false;  // Always enabled in prototype
        genBtn.onclick = aiGameGenerate;
        submitBtn.parentNode.insertBefore(genBtn, submitBtn);
    }

    showGameEdit();
}

function getGameCompanyCreditsTotal(companyKey) {
    if (typeof GAMES_SIDEBAR_COMPANIES !== 'undefined' && companyKey) {
        var co = GAMES_SIDEBAR_COMPANIES.find(function(c) { return c.name.toLowerCase() === companyKey; });
        return (co && co.credits) ? co.credits : 200;
    }
    return 200;
}

function updateGameScopeCreditsDisplay() {
    var key = _currentGameScope && _currentGameScope.companyKey;
    var used  = key ? (_gameAiCreditsUsed[key] || 0) : 0;
    var total = getGameCompanyCreditsTotal(key || '');

    // Sidebar scope-card credit line
    var sidebarEl = document.getElementById('scopeCredits');
    if (sidebarEl) {
        if (!key) { sidebarEl.hidden = true; }
        else {
            sidebarEl.hidden = false;
            sidebarEl.innerHTML = '<i class="fas fa-coins"></i> ' + used + ' / ' + total + ' AI credits used';
        }
    }

    // Page-header credit balance badge
    var pageEl = document.getElementById('pageAICreditBalance');
    if (pageEl) {
        if (!key) { pageEl.hidden = true; }
        else {
            pageEl.hidden = false;
            var usedEl  = document.getElementById('pageCreditsUsed');
            var totalEl = document.getElementById('pageCreditsTotal');
            if (usedEl)  usedEl.textContent  = used;
            if (totalEl) totalEl.textContent = total;
            // Colour the badge amber when over 80 % consumed
            pageEl.classList.toggle('page-ai-credit-balance--warn', used / total >= 0.8);
        }
    }
}

function switchAIGameContentTab(btn, kind) {
    document.querySelectorAll('#aiGameStep1 .content-kind-tab').forEach(function(t) { t.classList.remove('active'); });
    btn.classList.add('active');
    ['upload','url','text'].forEach(function(k) {
        var el = document.getElementById('aiGameContent' + k.charAt(0).toUpperCase() + k.slice(1));
        if (el) el.classList.toggle('hidden', k !== kind);
    });
    updateAIGameGenerateBtn();
}

function onAIGameFileChange(input) {
    var file = input.files && input.files[0];
    if (!file) return;
    var container = document.getElementById('aiGameContentUpload');
    if (!container) return;

    var ext = file.name.split('.').pop().toLowerCase();
    var isImage = (ext === 'png' || ext === 'jpeg' || ext === 'jpg');
    var iconClass = isImage    ? 'fa-image' :
                    ext === 'pdf'  ? 'fa-file-pdf' :
                    ext === 'docx' ? 'fa-file-word' :
                    ext === 'xlsx' ? 'fa-file-excel' : 'fa-file-alt';
    var iconColor = isImage    ? '#8b5cf6' :
                    ext === 'pdf'  ? '#ef4444' :
                    ext === 'docx' ? '#2563eb' :
                    ext === 'xlsx' ? '#16a34a' : '#6b7280';
    var sizeStr = file.size < 1024 ? file.size + ' B' :
                  file.size < 1048576 ? Math.round(file.size / 1024) + ' KB' :
                  (file.size / 1048576).toFixed(1) + ' MB';

    function renderPreview(imgSrc) {
        container.innerHTML =
            '<div class="ai-file-preview">' +
                (imgSrc ? '<img class="ai-file-preview-thumb" src="' + imgSrc + '" alt="Preview">' : '') +
                '<div class="ai-file-preview-info">' +
                    '<i class="fas ' + iconClass + ' ai-file-preview-icon" style="color:' + iconColor + '"></i>' +
                    '<div class="ai-file-preview-meta">' +
                        '<span class="ai-file-preview-name">' + escapeAttr(file.name) + '</span>' +
                        '<span class="ai-file-preview-size">' + escapeAttr(sizeStr) + '</span>' +
                    '</div>' +
                '</div>' +
                '<label class="ai-file-preview-change" title="Change file">' +
                    '<i class="fas fa-arrows-rotate"></i> Change' +
                    '<input type="file" accept=".pdf,.docx,.xlsx,.png,.jpeg,.jpg" style="display:none" onchange="onAIGameFileChange(this)">' +
                '</label>' +
            '</div>';
        updateAIGameGenerateBtn();
    }

    if (isImage) {
        var reader = new FileReader();
        reader.onload = function(e) { renderPreview(e.target.result); };
        reader.readAsDataURL(file);
    } else {
        renderPreview(null);
    }
}

function updateAIGameGenerateBtn() {
    var btn = document.getElementById('aiGameGenerateBtn');
    if (!btn) return;
    // Enable if any content tab has input
    var urlInput = document.getElementById('aiGameUrlInput');
    var textInput = document.getElementById('aiGameTextInput');
    var hasUrl = urlInput && urlInput.value.trim();
    var hasText = textInput && textInput.value.trim();
    var hasFile = document.querySelector('#aiGameContentUpload input[type=file]') &&
                  document.querySelector('#aiGameContentUpload input[type=file]').files &&
                  document.querySelector('#aiGameContentUpload input[type=file]').files.length > 0;
    // Also enable immediately for convenience (prototype — no real API call)
    btn.disabled = false;
}

function aiGameGenerate() {
    var step2 = document.getElementById('aiGameStep2');
    if (!step2) return;

    // Show progress animation
    step2.innerHTML =
        '<div class="ai-gen-progress-wrap" id="aiGenProgressWrap">' +
            '<div class="ai-gen-progress-bar"><div class="ai-gen-progress-fill" id="aiGenProgressFill"></div></div>' +
            '<div class="ai-gen-progress-steps">' +
                '<div class="ai-gen-step ai-gen-step-active" id="aiGenStep0"><i class="fas fa-file-alt"></i> Analysing content</div>' +
                '<div class="ai-gen-step" id="aiGenStep1"><i class="fas fa-sitemap"></i> Identifying categories</div>' +
                '<div class="ai-gen-step" id="aiGenStep2"><i class="fas fa-question-circle"></i> Generating questions</div>' +
                '<div class="ai-gen-step" id="aiGenStep3"><i class="fas fa-sliders"></i> Applying difficulty settings</div>' +
            '</div>' +
        '</div>';
    step2.classList.remove('hidden');

    if (!document.getElementById('aiGameStep1Collapsed')) collapseAIGameStep1();

    var genBtn = document.getElementById('aiGameGenerateBtn');
    if (genBtn) { genBtn.disabled = true; genBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating…'; }
    var submitBtn = document.getElementById('gameSubmitBtn');
    if (submitBtn) submitBtn.disabled = true;

    // Simulate progress steps
    var stepDefs = [
        { pct: 25, active: 1, done: [0] },
        { pct: 55, active: 2, done: [0, 1] },
        { pct: 80, active: 3, done: [0, 1, 2] },
        { pct: 100, active: -1, done: [0, 1, 2, 3] }
    ];
    var si = 0;
    function advance() {
        if (si >= stepDefs.length) {
            setTimeout(_renderAIGameResults, 300);
            return;
        }
        var s = stepDefs[si++];
        var fill = document.getElementById('aiGenProgressFill');
        if (fill) fill.style.width = s.pct + '%';
        for (var idx = 0; idx < 4; idx++) {
            var el = document.getElementById('aiGenStep' + idx);
            if (!el) continue;
            el.classList.remove('ai-gen-step-active', 'ai-gen-step-done');
            if (s.done.indexOf(idx) >= 0) el.classList.add('ai-gen-step-done');
            else if (idx === s.active) el.classList.add('ai-gen-step-active');
        }
        setTimeout(advance, si === stepDefs.length ? 400 : 300);
    }
    setTimeout(advance, 80);
}

function _renderAIGameResults() {
    var step2 = document.getElementById('aiGameStep2');
    if (!step2) return;

    var namePair = nextGameAISuggestion();
    // If linked to a topic, use topic name/description as defaults
    if (window._aiGamePendingTopic && window._aiGamePendingTopic.name) {
        namePair = {
            name: window._aiGamePendingTopic.name,
            description: window._aiGamePendingTopic.description || namePair.description
        };
    }

    var suggestion = _GAME_AI_SUGGESTIONS[_aiGameGenerateIdx % _GAME_AI_SUGGESTIONS.length];
    _aiGameGenerateIdx++;

    var coverUrl = (window._aiGamePendingTopic && window._aiGamePendingTopic.cover) ||
                   GAME_COVER_PRESETS[(_aiGameGenerateIdx - 1) % GAME_COVER_PRESETS.length];
    var cats = suggestion.categories;
    var catCount = cats.length;

    var accordionItems = cats.map(function(cat) {
        var qCount = cat.questions.length;
        var qItems = cat.questions.map(function(q) {
            var optsHtml = q.options.map(function(opt, oi) {
                var letter = ['A','B','C','D'][oi];
                var isCorrect = oi === q.correct;
                return '<div class="ai-game-q-opt' + (isCorrect ? ' correct' : '') + '" contenteditable="true">' +
                    letter + '. ' + escapeAttr(opt) + (isCorrect ? ' (✓)' : '') +
                '</div>';
            }).join('');
            return '<div class="ai-game-q-item">' +
                '<div class="ai-game-q-text" contenteditable="true">' + escapeAttr(q.text) + '</div>' +
                '<div class="ai-game-q-opts">' + optsHtml + '</div>' +
            '</div>';
        }).join('');
        return '<div class="ai-game-cat-item">' +
            '<div class="ai-game-cat-header">' +
                '<button type="button" class="ai-sub-toggle" onclick="toggleAIGameCat(this)"><i class="fas fa-chevron-right ai-sub-chevron"></i></button>' +
                '<span class="ai-sub-name" contenteditable="true">' + escapeAttr(cat.name) + '</span>' +
                '<span class="chip">' + qCount + ' question' + (qCount !== 1 ? 's' : '') + '</span>' +
            '</div>' +
            '<div class="ai-game-cat-body hidden">' + qItems + '</div>' +
        '</div>';
    }).join('');

    var attemptsHtml =
        '<div class="form-row-2">' +
            '<div class="form-group">' +
                '<label>Max attempts</label>' +
                '<div class="number-stepper">' +
                    '<button type="button" class="stepper-btn" onclick="stepGameAttempts(-1,\'aiGameMaxAttempts\')"><i class="fas fa-minus"></i></button>' +
                    '<input type="number" name="maxAttempts" id="aiGameMaxAttempts" value="1" min="1" max="99">' +
                    '<button type="button" class="stepper-btn" onclick="stepGameAttempts(1,\'aiGameMaxAttempts\')"><i class="fas fa-plus"></i></button>' +
                '</div>' +
            '</div>' +
            '<div class="form-group">' +
                '<label>Questions per session</label>' +
                '<input type="text" name="questionsPerSession" placeholder="Server default">' +
            '</div>' +
        '</div>';

    step2.innerHTML =
        '<div class="add-topic-tabs" id="aiGameTabsBar">' +
            '<button type="button" class="add-topic-tab active" data-tab="ai-game" onclick="switchGameAITab(\'ai-game\')">Game</button>' +
            '<button type="button" class="add-topic-tab" data-tab="ai-cats" onclick="switchGameAITab(\'ai-cats\')">' +
                'Categories <span class="tab-badge">' + catCount + '</span>' +
            '</button>' +
            '<button type="button" class="add-topic-tab" data-tab="ai-share" id="aiGameTabShare" onclick="switchGameAITab(\'ai-share\')" disabled><i class="fas fa-people-group"></i> Share</button>' +
            '<button type="button" class="add-topic-tab" data-tab="ai-schedule" id="aiGameTabSchedule" onclick="switchGameAITab(\'ai-schedule\')" disabled><i class="fas fa-calendar-alt"></i> Schedule</button>' +
        '</div>' +
        '<div class="add-topic-pane" id="aiGameTabPaneGame">' +
            gameCoverToggleHtml(coverUrl, 'aiGameCoverToggle', 'aiGameCoverBody', !!(window._aiGamePendingTopic && window._aiGamePendingTopic.cover)) +
            '<div class="form-group"><label>Game Name</label><input type="text" name="name" value="' + escapeAttr(namePair.name) + '" placeholder="Game name"></div>' +
            '<div class="form-group"><label>Description</label><textarea name="description" rows="3">' + escapeAttr(namePair.description) + '</textarea></div>' +
            attemptsHtml +
        '</div>' +
        '<div class="add-topic-pane hidden" id="aiGameTabPaneCats">' +
            '<div class="ai-sub-list">' + accordionItems + '</div>' +
        '</div>' +
        '<div class="add-topic-pane hidden" id="aiGameTabPaneShare">' + buildGameShareTabHtml() + '</div>' +
        '<div class="add-topic-pane hidden" id="aiGameTabPaneSchedule">' + buildScheduleBodyHtml() + '</div>';

    var genBtn = document.getElementById('aiGameGenerateBtn');
    if (genBtn) { genBtn.disabled = false; genBtn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> Regenerate'; }
    var submitBtn = document.getElementById('gameSubmitBtn');
    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Save'; }

    var ck = (_currentGameScope && _currentGameScope.companyKey) || '';
    _gameAiCreditsUsed[ck] = (_gameAiCreditsUsed[ck] || 0) + 1;
    try {
        var _sc = JSON.parse(localStorage.getItem('gameon.aiCredits') || '{}');
        _sc[ck] = _gameAiCreditsUsed[ck];
        localStorage.setItem('gameon.aiCredits', JSON.stringify(_sc));
    } catch(e) {}
    var countEl = document.getElementById('aiGameCreditsCount');
    if (countEl) countEl.textContent = _gameAiCreditsUsed[ck];
    updateGameScopeCreditsDisplay();
}

function collapseAIGameStep1() {
    var tabBar = document.getElementById('aiGameSetupTabBar');
    var contentPane = document.getElementById('aiGameSetupPaneContent');
    var questionsPane = document.getElementById('aiGameSetupPaneQuestions');
    if (!tabBar && !contentPane) return;

    var summaryText = 'Content provided';
    var urlInput = document.getElementById('aiGameUrlInput');
    var textInput = document.getElementById('aiGameTextInput');
    if (urlInput && urlInput.value.trim()) summaryText = urlInput.value.trim().substring(0, 50) + (urlInput.value.trim().length > 50 ? '…' : '');
    else if (textInput && textInput.value.trim()) summaryText = textInput.value.trim().substring(0, 50) + (textInput.value.trim().length > 50 ? '…' : '');

    var collapsed = document.createElement('div');
    collapsed.id = 'aiGameStep1Collapsed';
    collapsed.className = 'ai-step1-collapsed';
    collapsed.innerHTML =
        '<span class="ai-step1-summary">' + escapeAttr(summaryText) + '</span>' +
        '<button type="button" class="btn-link" onclick="expandAIGameStep1()" style="font-size:0.8rem;margin-left:auto">Edit</button>';

    if (tabBar) tabBar.style.display = 'none';
    if (contentPane) contentPane.style.display = 'none';
    if (questionsPane) questionsPane.style.display = 'none';
    var fields = document.getElementById('gameEditFields');
    if (fields) fields.insertBefore(collapsed, fields.firstChild);
}

function expandAIGameStep1() {
    var collapsed = document.getElementById('aiGameStep1Collapsed');
    var tabBar = document.getElementById('aiGameSetupTabBar');
    var contentPane = document.getElementById('aiGameSetupPaneContent');
    var questionsPane = document.getElementById('aiGameSetupPaneQuestions');
    if (collapsed) collapsed.remove();
    if (tabBar) tabBar.style.display = '';
    if (contentPane) contentPane.style.display = '';
    // restore questions pane visibility based on active tab
    if (questionsPane) {
        var activeTab = document.querySelector('#aiGameSetupTabBar .add-topic-tab.active');
        var isQTab = activeTab && activeTab.dataset.tab === 'questions';
        questionsPane.style.display = '';
        if (!isQTab) questionsPane.classList.add('hidden');
        else questionsPane.classList.remove('hidden');
    }
}

function switchAIGameSetupTab(tab) {
    var tabBtns = document.querySelectorAll('#aiGameSetupTabBar .add-topic-tab');
    tabBtns.forEach(function(t) { t.classList.toggle('active', t.dataset.tab === tab); });
    var contentPane = document.getElementById('aiGameSetupPaneContent');
    var questionsPane = document.getElementById('aiGameSetupPaneQuestions');
    if (contentPane) contentPane.classList.toggle('hidden', tab !== 'content');
    if (questionsPane) questionsPane.classList.toggle('hidden', tab !== 'questions');
}

function switchGameAITab(tab) {
    var tabBtns = document.querySelectorAll('#aiGameTabsBar .add-topic-tab');
    tabBtns.forEach(function(t) { t.classList.toggle('active', t.dataset.tab === tab); });
    var panes = ['ai-game','ai-cats','ai-share','ai-schedule'];
    panes.forEach(function(p) {
        var idPart = p === 'ai-game' ? 'Game' : p === 'ai-cats' ? 'Cats' : p === 'ai-share' ? 'Share' : 'Schedule';
        var el = document.getElementById('aiGameTabPane' + idPart);
        if (el) el.classList.toggle('hidden', p !== tab);
    });
}

function toggleAIGameCat(btn) {
    // Single-open accordion
    var allCats = document.querySelectorAll('.ai-game-cat-item');
    var thisCat = btn.closest('.ai-game-cat-item');
    var thisBody = thisCat ? thisCat.querySelector('.ai-game-cat-body') : null;
    var isOpen = thisBody && !thisBody.classList.contains('hidden');

    allCats.forEach(function(cat) {
        var body = cat.querySelector('.ai-game-cat-body');
        var chevron = cat.querySelector('.ai-sub-chevron');
        if (body) body.classList.add('hidden');
        if (chevron) chevron.style.transform = '';
    });

    if (!isOpen && thisBody) {
        thisBody.classList.remove('hidden');
        var chevron = btn.querySelector('.ai-sub-chevron');
        if (chevron) chevron.style.transform = 'rotate(90deg)';
    }
}

// ===== onGamesScope — called by script-games-sidebar-scope.js =====
function onGamesScope(companyKey, deptName) {
    loadGamesScope();
    renderGamesForScope(companyKey, deptName);
    updateGameScopeCreditsDisplay();
    _checkPendingGame(companyKey, deptName);
}

function _checkPendingGame(companyKey, deptName) {
    try {
        var raw = localStorage.getItem('gameon.pendingGame');
        if (!raw) return;
        var pending = JSON.parse(raw);
        localStorage.removeItem('gameon.pendingGame');
        if (pending.companyKey !== companyKey || pending.dept !== deptName) return;
        addGame();
        setTimeout(function() {
            var pane = document.getElementById('gameTabPaneGame');
            if (!pane) return;

            if (pending.topicName) {
                var nameInput = pane.querySelector('input[name="name"]');
                if (nameInput) nameInput.value = pending.topicName;
            }

            if (pending.topicDesc) {
                var descInput = pane.querySelector('textarea[name="description"]');
                if (descInput) descInput.value = pending.topicDesc;
            }

            if (pending.topicCover) {
                var hidden = pane.querySelector('.cover-hidden-input');
                if (hidden) {
                    hidden.value = pending.topicCover;
                    var picker = hidden.closest('.cover-picker');
                    if (picker) {
                        picker.querySelectorAll('.cover-tile').forEach(function(t) {
                            t.classList.remove('selected');
                            var chk = t.querySelector('.cover-check');
                            if (chk) chk.remove();
                            if (t.dataset.cover === pending.topicCover) {
                                t.classList.add('selected');
                                t.insertAdjacentHTML('beforeend', '<span class="cover-check"><i class="fas fa-check"></i></span>');
                            }
                        });
                    }
                }
            }
        }, 0);
    } catch(e) {}
}

// ===== Init =====
$(function() {
    // Close menus on outside click — already wired above via document.addEventListener
});
