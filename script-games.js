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
var _postShareCallback = null;   // fn to call after share panel confirm/cancel (new-game flow)

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
                    difficulty: qRow.dataset.difficulty || '',
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
            scheduledEndDate: gameRow.dataset.scheduledEndDate || null,
            sharedDepts: (function() { try { return JSON.parse(gameRow.dataset.sharedDepts || '[]'); } catch(e) { return []; } })(),
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

// ===== Shared date / donut helpers =====
var _MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function _fmtDate(iso) {
    var d = new Date(iso);
    return _MONTHS[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
}

function _fmtDateRange(start, end) {
    if (!start) return '';
    return _fmtDate(start) + (end ? ' – ' + _fmtDate(end) : '');
}

function _buildShareChip(depts) {
    var count = depts.length;
    var label = count + ' share' + (count !== 1 ? 's' : '');
    var items = depts.map(function(d) {
        return '<span class="shares-tt-item">' + escapeAttr(d) + '</span>';
    }).join('');
    return '<span class="chip chip-shares" onclick="event.stopPropagation();openGameSharePanelFromChip(this)">' +
        label +
        '<div class="shares-tooltip">' + items + '</div>' +
    '</span>';
}

function openGameSharePanelFromChip(chip) {
    var row = chip.closest('tr.row-game');
    if (row) openGameSharePanel(row);
}

// easy, medium, hard are counts of questions at each level
function _difficultyDonutSvg(easy, medium, hard) {
    var total = easy + medium + hard;
    var cx = 13, cy = 13, r = 9;
    var circ = 2 * Math.PI * r; // ~56.55
    var track = '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" stroke="#e5e7eb" stroke-width="3.5" fill="none"/>';
    var segs  = '';

    if (total > 0) {
        var cumAngle = -90; // start at 12 o'clock
        function makeSeg(count, color) {
            if (count <= 0) return '';
            var arcLen = (count / total) * circ;
            var s = '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" stroke="' + color + '"' +
                ' stroke-width="3.5" fill="none"' +
                ' stroke-dasharray="' + arcLen.toFixed(2) + ' ' + circ.toFixed(2) + '"' +
                ' transform="rotate(' + cumAngle.toFixed(2) + ' ' + cx + ' ' + cy + ')"/>';
            cumAngle += (count / total) * 360;
            return s;
        }
        segs += makeSeg(easy,   '#22c55e');
        segs += makeSeg(medium, '#f97316');
        segs += makeSeg(hard,   '#ef4444');
    }

    var ep = total ? Math.round(easy   / total * 100) : 0;
    var mp = total ? Math.round(medium / total * 100) : 0;
    var hp = total ? (100 - ep - mp)                  : 0;

    var tooltip = '<div class="donut-tooltip">' +
        '<span class="donut-tt-row"><span class="donut-tt-dot" style="background:#22c55e"></span>Easy <strong>' + ep + '%</strong></span>' +
        '<span class="donut-tt-row"><span class="donut-tt-dot" style="background:#f97316"></span>Medium <strong>' + mp + '%</strong></span>' +
        '<span class="donut-tt-row"><span class="donut-tt-dot" style="background:#ef4444"></span>Hard <strong>' + hp + '%</strong></span>' +
        '</div>';

    return '<span class="game-donut" onclick="event.stopPropagation()">' +
        '<svg width="26" height="26" viewBox="0 0 26 26" fill="none">' + track + segs + '</svg>' +
        tooltip +
    '</span>';
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

    // Scheduled date chip intentionally not shown on the game list row
    // (dates are visible in the Share panel only)

    // Share count chip
    var cellShare = gameRow.querySelector('.cell-share');
    if (cellShare) {
        var sd2 = [];
        try { sd2 = JSON.parse(gameRow.dataset.sharedDepts || '[]'); } catch(e) {}
        cellShare.innerHTML = sd2.length > 0 ? _buildShareChip(sd2) : '';
    }

    // Difficulty donut — read difficulty from question row data attributes
    var easyQ = 0, medQ = 0, hardQ = 0;
    document.querySelectorAll('tr.row-q[data-game="' + gameId + '"]').forEach(function(qr) {
        var d = (qr.dataset.difficulty || '').toLowerCase();
        if (d === 'medium') medQ++;
        else if (d === 'hard') hardQ++;
        else easyQ++;
    });
    var newDonut = _difficultyDonutSvg(easyQ, medQ, hardQ);
    var donutEl = gameRow.querySelector('.game-donut');
    if (donutEl) {
        donutEl.outerHTML = newDonut;
    } else {
        var statusSpan = gameRow.querySelector('.row-status');
        if (statusSpan) statusSpan.insertAdjacentHTML('afterend', newDonut);
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

    // scheduledDate is stored on the row dataset for use in the Share panel but not shown as a chip
    var sharedDepts = game.sharedDepts || [];
    var shareChip = sharedDepts.length > 0
        ? _buildShareChip(sharedDepts)
        : '';

    var easyQ = 0, medQ = 0, hardQ = 0;
    (game.categories || []).forEach(function(c) {
        (c.questions || []).forEach(function(q) {
            var d = (q.difficulty || '').toLowerCase();
            if (d === 'medium') medQ++;
            else if (d === 'hard') hardQ++;
            else easyQ++;
        });
    });
    var donutHtml = _difficultyDonutSvg(easyQ, medQ, hardQ);

    var optionsPart = '' +
        '<button type="button" class="action-item" onclick="actionAddCategory(this,event)"><i class="fas fa-list"></i> Add Category</button>' +
        '<button type="button" class="action-item" onclick="actionEditGame(this,event)"><i class="fas fa-pen"></i> Edit</button>' +
        '<button type="button" class="action-item" onclick="actionShareGame(this,event)"><i class="fas fa-people-group"></i> Share</button>' +
        '<button type="button" class="action-item" onclick="actionScheduleGame(this,event)"><i class="fas fa-calendar-alt"></i> Schedule</button>' +
        '<button type="button" class="action-item" onclick="actionToggleGameActive(this,event)"><i class="fas ' + disableIcon + '"></i> ' + escapeAttr(disableLabel) + '</button>' +
        '<div class="action-sep"></div>' +
        '<button type="button" class="action-item action-item-danger" onclick="actionDeleteGame(this,event)"><i class="fas fa-trash"></i> Delete</button>';

    return '<tr class="' + escapeAttr(rowClass) + '" data-game="' + id + '" data-name="' + escapeAttr(game.name) + '" data-description="' + escapeAttr(game.description || '') + '" data-cover="' + escapeAttr(cover) + '" data-active="' + isActive + '" data-scheduled-date="' + escapeAttr(game.scheduledDate || '') + '" data-scheduled-end-date="' + escapeAttr(game.scheduledEndDate || '') + '" data-shared-depts="' + escapeAttr(JSON.stringify(sharedDepts)) + '" onclick="toggleGame(' + id + ')">' +
        '<td class="col-name"><div class="cell-row">' +
            '<span class="chevron"' + (catCount === 0 ? ' style="visibility:hidden"' : '') + '><i class="fas fa-chevron-right"></i></span>' +
            gameCoverHtml(cover) +
            '<span class="company-name">' + escapeAttr(game.name) + '</span>' +
            '<span class="row-main-chip">' + catChip + '</span>' +
            '<span class="cell-pills"></span>' +
            '<span class="cell-share">' + shareChip + '</span>' +
            '<span class="row-status">' + statusChip + '</span>' +
            donutHtml +
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

    return '<tr class="row-q hidden" data-game="' + gameId + '" data-cat="' + catId + '" data-q="' + q.id + '" data-text="' + escapeAttr(q.text) + '" data-options=\'' + JSON.stringify(q.options || []).replace(/'/g, '&#39;') + '\' data-correct="' + (q.correct || 0) + '" data-points="' + (q.points || 1) + '" data-difficulty="' + escapeAttr(q.difficulty || '') + '">' +
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
    if (badge) badge.classList.remove('badge-ai');
    if (submitBtn) { submitBtn.classList.remove('hidden'); submitBtn.disabled = false; }

    var genBtn = document.getElementById('aiGameGenerateBtn');
    if (genBtn) genBtn.remove();

    var creditBal = document.getElementById('aiPanelCreditBal');
    if (creditBal) creditBal.hidden = true;

    _isAIGameFlow = false;

    if (mode === 'add') {
        _isGameAddMode = true;
        if (badge) badge.innerHTML = '<i class="fas fa-plus"></i> Adding';
        if (submitBtn) submitBtn.textContent = 'Create Game';
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

// ===== Checkbox dropdown helper =====
function _buildShareDeptDropdown(checkboxItemsHtml, wrapperId, menuId) {
    var menuIdAttr = menuId ? ' id="' + escapeAttr(menuId) + '"' : '';
    return '<div class="share-dept-dropdown" id="' + escapeAttr(wrapperId) + '">' +
        '<button type="button" class="share-dept-trigger" onclick="toggleShareDropdown(\'' + escapeAttr(wrapperId) + '\',event)">' +
            '<span class="sdd-label">Select departments…</span>' +
            '<i class="fas fa-chevron-down sdd-chevron"></i>' +
        '</button>' +
        '<div class="share-dept-menu"' + menuIdAttr + '>' +
            checkboxItemsHtml +
        '</div>' +
    '</div>';
}

window.toggleShareDropdown = function(id, e) {
    e.stopPropagation();
    var wrapper = document.getElementById(id);
    if (!wrapper) return;
    var isOpen = wrapper.classList.contains('sdd-open');
    document.querySelectorAll('.share-dept-dropdown.sdd-open').forEach(function(d) { d.classList.remove('sdd-open'); });
    if (!isOpen) wrapper.classList.add('sdd-open');
};

window.syncShareDropdownLabel = function(id) {
    var wrapper = document.getElementById(id);
    if (!wrapper) return;
    var checked = wrapper.querySelectorAll('input[type="checkbox"]:checked');
    var label   = wrapper.querySelector('.sdd-label');
    if (label) {
        if (checked.length === 0)      label.textContent = 'Select departments…';
        else if (checked.length === 1) label.textContent = checked[0].value;
        else                           label.textContent = checked.length + ' departments selected';
    }
    if (typeof syncGameShareConfirmButton === 'function') syncGameShareConfirmButton();
};

document.addEventListener('click', function(e) {
    if (!e.target.closest || !e.target.closest('.share-dept-dropdown')) {
        document.querySelectorAll('.share-dept-dropdown.sdd-open').forEach(function(d) { d.classList.remove('sdd-open'); });
    }
});

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
            '<input type="checkbox" name="shareDept" value="' + escapeAttr(d.name) + '" onchange="syncShareDropdownLabel(\'addGameShareDropdown\')">' +
            '<span class="share-dept-name">' + escapeAttr(d.name) + '</span>' +
        '</label>';
    }).join('');
    return '<p class="share-panel-lead">Share this game with departments in <strong>' +
        escapeAttr(company.name) + '</strong> when saving.</p>' +
        _buildShareDeptDropdown(items, 'addGameShareDropdown', null);
}

// ===== Schedule HTML (date range) =====
function buildScheduleBodyHtml(existingStart, existingEnd) {
    var startVal = existingStart ? ' value="' + escapeAttr(existingStart) + '"' : '';
    var endVal   = existingEnd   ? ' value="' + escapeAttr(existingEnd)   + '"' : '';
    return '<div class="schedule-form">' +
        '<div class="schedule-date-row">' +
            '<div class="form-group">' +
                '<label>Start date</label>' +
                '<input type="date" id="scheduleStartDate" class="schedule-date-input"' + startVal + '>' +
            '</div>' +
            '<div class="form-group">' +
                '<label>End date</label>' +
                '<input type="date" id="scheduleEndDate" class="schedule-date-input"' + endVal + '>' +
            '</div>' +
        '</div>' +
    '</div>';
}

// ===== Combined Share + Schedule tab HTML =====
function buildShareScheduleTabHtml() {
    return '<div class="share-schedule-tab">' +
        '<div class="share-schedule-section">' +
            '<h4 class="share-schedule-heading"><i class="fas fa-people-group"></i> Share with departments</h4>' +
            buildGameShareTabHtml() +
        '</div>' +
        '<div class="share-schedule-divider"></div>' +
        '<div class="share-schedule-section">' +
            '<h4 class="share-schedule-heading"><i class="fas fa-calendar-alt"></i> Schedule</h4>' +
            buildScheduleBodyHtml() +
        '</div>' +
    '</div>';
}

// ===== Add Game (manual — side panel) =====
function addGame() {
    _gameAddCats = [];
    _editingCatIdx = null;
    _isGameAddMode = true;
    _isAIGameFlow = false;
    _gameEditRow = null;
    _gameEditType = 'game';

    document.getElementById('gameEditTitle').textContent = 'Add Game';
    document.getElementById('gameEditSubtitle').textContent = getGamesScopeSubtitle();

    var topicOpts = getAIGameTopicOptions();

    document.getElementById('gameEditFields').innerHTML =
        '<div class="form-group">' +
            '<label>Cover Image</label>' +
            gameCoverPickerHtml(GAME_COVER_PRESETS[0]) +
        '</div>' +
        '<div class="form-group">' +
            '<label for="addGameTopic">Topic <span class="form-label-optional">(optional)</span></label>' +
            '<select id="addGameTopic" class="ai-model-select" onchange="onAddGameTopicChange(this)">' +
                '<option value="">Select a topic</option>' +
                (topicOpts || '') +
            '</select>' +
        '</div>' +
        '<div class="form-group">' +
            '<label>Name <span class="required-mark">*</span></label>' +
            '<input type="text" id="addGameName" placeholder="Game name">' +
        '</div>' +
        '<div class="form-group">' +
            '<label>Description <span class="form-label-optional">(optional)</span></label>' +
            '<textarea id="addGameDesc" rows="3" placeholder="What will players learn?"></textarea>' +
        '</div>' +
        // ── Content section ───────────────────────────────────────────────────
        '<div id="gameAddChoiceSection">' +

            // Card (default view)
            '<div id="gameChoiceCards">' +
                '<button type="button" class="btn-choice btn-choice-full" id="gameContentCardBtn" onclick="openGameContentForm()">' +
                    '<i class="fas fa-upload"></i>' +
                    '<span class="choice-label">Add content</span>' +
                    '<span class="choice-hint">PDF, image, video URL, or text</span>' +
                '</button>' +
            '</div>' +

            // Content form
            '<div class="hidden" id="gameContentForm">' +
                _gameContentPickerHtml() +
                '<div class="game-section-actions">' +
                    '<button type="button" class="btn btn-outline" onclick="cancelGameContentForm()">Cancel</button>' +
                    '<button type="button" class="btn btn-primary" onclick="saveGameContentForm()">Save content</button>' +
                '</div>' +
            '</div>' +

        '</div>' +

        '<div class="add-game-advanced">' +
            '<button type="button" class="add-game-advanced-toggle" onclick="toggleAddGameAdvanced(this)" data-body="addGameAdvancedBody">' +
                'Configure <i class="fas fa-chevron-down add-game-advanced-icon"></i>' +
            '</button>' +
            '<div class="add-game-advanced-body hidden" id="addGameAdvancedBody">' +
                '<div class="configure-grid">' +
                    '<div class="form-group">' +
                        '<label>Max attempts</label>' +
                        '<input type="number" id="addGameMaxAttempts" placeholder="e.g. 3" min="1" max="99">' +
                    '</div>' +
                    '<div class="form-group">' +
                        '<label>Questions for this game</label>' +
                        '<input type="number" id="addGameQPerSession" value="5" min="1" max="100">' +
                    '</div>' +
                '</div>' +
                '<div class="form-group">' +
                    '<label>Pass Threshold (%)</label>' +
                    '<input type="number" id="addGamePassThreshold" placeholder="e.g. 60" min="0" max="100" style="width:100px">' +
                '</div>' +
            '</div>' +
        '</div>';

    setGamePanelMode('add');
    showGameEdit();
}

function closeAddGameModal() {
    // Modal removed — panel is used instead; treat as cancel
    showGameEmpty();
}


function toggleAddGameAdvanced(btn) {
    var bodyId = btn.dataset.body || 'addGameAdvancedBody';
    var body = document.getElementById(bodyId);
    if (!body) return;
    var isOpen = !body.classList.contains('hidden');
    body.classList.toggle('hidden', isOpen);
    btn.classList.toggle('open', !isOpen);
}

// ===== Add Game — content picker =====
function _gameContentPickerHtml() {
    return '<div class="content-picker" id="gameContentPicker">' +
        '<div class="content-kind-tabs" role="tablist">' +
            '<button type="button" class="content-kind-tab active" data-kind="upload" onclick="setGameContentKind(this)"><i class="fas fa-upload"></i> Upload</button>' +
            '<button type="button" class="content-kind-tab" data-kind="video" onclick="setGameContentKind(this)"><i class="fas fa-link"></i> Web URL</button>' +
            '<button type="button" class="content-kind-tab" data-kind="text" onclick="setGameContentKind(this)"><i class="fas fa-align-left"></i> Text</button>' +
        '</div>' +
        '<input type="hidden" id="gameContentKind" value="upload">' +
        '<input type="hidden" id="gameContentMediaType" value="PDF">' +

        '<div class="content-pane" data-pane="upload">' +
            '<div class="cp-dropzone" onclick="document.getElementById(\'gameContentFile\').click()"' +
                ' ondragover="event.preventDefault();this.classList.add(\'drag-over\')"' +
                ' ondragleave="this.classList.remove(\'drag-over\')"' +
                ' ondrop="onGameContentFileDrop(this,event)">' +
                '<i class="fas fa-upload"></i>' +
                '<span class="cp-dropzone-hint">Drop file or <u>browse</u></span>' +
                '<span class="cp-dropzone-name" id="gameContentFileName"></span>' +
                '<input type="file" id="gameContentFile" accept="application/pdf,image/*" onchange="onGameContentFileChange(this)" style="display:none">' +
            '</div>' +
        '</div>' +

        '<div class="content-pane hidden" data-pane="video">' +
            '<input type="url" id="gameContentUrl" placeholder="https://…">' +
        '</div>' +

        '<div class="content-pane hidden" data-pane="text">' +
            '<div class="rte-toolbar">' +
                '<button type="button" class="rte-btn" title="Bold" onmousedown="event.preventDefault();document.execCommand(\'bold\')"><i class="fas fa-bold"></i></button>' +
                '<button type="button" class="rte-btn" title="Italic" onmousedown="event.preventDefault();document.execCommand(\'italic\')"><i class="fas fa-italic"></i></button>' +
                '<button type="button" class="rte-btn" title="Underline" onmousedown="event.preventDefault();document.execCommand(\'underline\')"><i class="fas fa-underline"></i></button>' +
                '<span class="rte-sep"></span>' +
                '<button type="button" class="rte-btn" title="Bullets" onmousedown="event.preventDefault();document.execCommand(\'insertUnorderedList\')"><i class="fas fa-list-ul"></i></button>' +
                '<button type="button" class="rte-btn" title="Numbers" onmousedown="event.preventDefault();document.execCommand(\'insertOrderedList\')"><i class="fas fa-list-ol"></i></button>' +
            '</div>' +
            '<div id="gameContentText" contenteditable="true" class="cp-text" data-placeholder="Type the content…"></div>' +
        '</div>' +
    '</div>';
}

function setGameContentKind(btn) {
    var picker = document.getElementById('gameContentPicker');
    if (!picker) return;
    var kind = btn.dataset.kind;
    picker.querySelectorAll('.content-kind-tab').forEach(function(t) { t.classList.toggle('active', t === btn); });
    picker.querySelectorAll('.content-pane').forEach(function(p) { p.classList.toggle('hidden', p.dataset.pane !== kind); });
    var kindInput = document.getElementById('gameContentKind');
    if (kindInput) kindInput.value = kind;
}

function onGameContentFileChange(input) {
    var file = input.files[0];
    if (!file) return;
    var nameEl = document.getElementById('gameContentFileName');
    if (nameEl) nameEl.textContent = file.name;
    var typeInput = document.getElementById('gameContentMediaType');
    if (typeInput) {
        var ext = file.name.split('.').pop().toLowerCase();
        typeInput.value = (ext === 'pdf') ? 'PDF' : 'image';
    }
}

function onGameContentFileDrop(zone, event) {
    event.preventDefault();
    zone.classList.remove('drag-over');
    var file = event.dataTransfer.files[0];
    if (!file) return;
    var nameEl = document.getElementById('gameContentFileName');
    if (nameEl) nameEl.textContent = file.name;
    var typeInput = document.getElementById('gameContentMediaType');
    if (typeInput) {
        var ext = file.name.split('.').pop().toLowerCase();
        typeInput.value = (ext === 'pdf') ? 'PDF' : 'image';
    }
}

// ===== Add Game — Content toggle form =====
function _showGameCards() {
    var cards = document.getElementById('gameChoiceCards');
    var cf    = document.getElementById('gameContentForm');
    if (cards) cards.classList.remove('hidden');
    if (cf)    cf.classList.add('hidden');
}

function openGameContentForm() {
    var cards = document.getElementById('gameChoiceCards');
    var form  = document.getElementById('gameContentForm');
    if (cards) cards.classList.add('hidden');
    if (form)  form.classList.remove('hidden');
}

function cancelGameContentForm() { _showGameCards(); }

function saveGameContentForm() {
    var btn = document.getElementById('gameContentCardBtn');
    if (btn) {
        btn.classList.add('btn-choice-done');
        btn.querySelector('.choice-label').textContent = 'Content added';
        btn.querySelector('.choice-hint').textContent  = 'Click to change';
    }
    _showGameCards();
}

function renderGameAddCatList() {
    var list = document.getElementById('gameAddCatList');
    if (!list) return;
    if (!_gameAddCats.length) { list.innerHTML = ''; return; }
    list.innerHTML = _gameAddCats.map(function(c, i) {
        return '<div class="game-add-cat-item">' +
            '<i class="fas fa-list"></i>' +
            '<span class="game-add-cat-name">' + escapeAttr(c.name) + '</span>' +
            '<button type="button" class="btn-icon btn-icon-sm" onclick="removeGameCategoryItem(' + i + ')" title="Remove"><i class="fas fa-times"></i></button>' +
        '</div>';
    }).join('');
}

function _setAddGameCoverPreview(src) {
    var picker = document.querySelector('#gameEditFields .cover-picker');
    if (!picker) return;
    // Try to find a matching preset tile first
    var matched = null;
    picker.querySelectorAll('.cover-tile:not(.cover-tile-upload)').forEach(function(t) {
        if (t.dataset.cover === src) matched = t;
    });
    if (matched) {
        selectGameCoverTile(matched);
        return;
    }
    // Treat as custom image — populate the upload tile and select it
    var uploadTile = picker.querySelector('.cover-tile-upload');
    if (!uploadTile) return;
    uploadTile.dataset.cover = src;
    var empty = uploadTile.querySelector('.cover-upload-empty');
    if (empty) empty.remove();
    var img = uploadTile.querySelector('img');
    if (!img) {
        img = document.createElement('img');
        img.alt = 'Custom cover';
        uploadTile.insertBefore(img, uploadTile.firstChild);
    }
    img.src = src;
    if (!uploadTile.querySelector('.cover-tile-overlay')) {
        uploadTile.insertAdjacentHTML('beforeend', '<span class="cover-tile-overlay"><i class="fas fa-camera"></i></span>');
    }
    selectGameCoverTile(uploadTile);
}

function onAddGameTopicChange(select) {
    var val = select ? select.value : '';
    if (!val) return;
    try {
        var t = JSON.parse(val);
        var nameInput = document.getElementById('addGameName');
        if (nameInput && !nameInput.value.trim()) nameInput.value = t.name || '';
        var descInput = document.getElementById('addGameDesc');
        if (descInput && !descInput.value.trim()) descInput.value = t.description || '';
        if (t.cover) _setAddGameCoverPreview(t.cover);
    } catch(e) {}
}

function switchGameTab(tab) {
    // Legacy — kept for AI flow compat; manual add now uses modal.
    var tabs = document.querySelectorAll('#gameAddTabs .add-topic-tab');
    tabs.forEach(function(t) { t.classList.toggle('active', t.dataset.tab === tab); });
    var panes = { 'game': 'Game', 'cats': 'Cats', 'share-schedule': 'ShareSchedule' };
    Object.keys(panes).forEach(function(p) {
        var el = document.getElementById('gameTabPane' + panes[p]);
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
        // Manual add — fields rendered by addGame() using IDs
        var nameInput = document.getElementById('addGameName');
        var name = nameInput ? nameInput.value.trim() : '';
        if (!name) {
            showGameToast('Game name is required');
            if (nameInput) nameInput.focus();
            return;
        }
        var descInput = document.getElementById('addGameDesc');
        var description = descInput ? descInput.value.trim() : '';
        var cover = readGameCoverPicker() || randomGameCover();

        var tbody = document.querySelector('#gamesTable tbody');
        if (!tbody) return;

        var newId = Date.now();
        var gameObj = {
            id: newId,
            name: name,
            description: description,
            cover: cover,
            active: true,
            scheduledDate: null,
            categories: _gameAddCats.length ? _gameAddCats.slice() : []
        };

        var gameHtml = gameRowHtml(gameObj, newId);
        tbody.insertAdjacentHTML('beforeend', gameHtml);
        var gameRow = document.querySelector('tr.row-game[data-game="' + newId + '"]');
        if (gameRow) updateGameRowChips(gameRow);

        persistGamesScope();
        updateGamesCount(document.querySelectorAll('#gamesTable tbody tr.row-game'));
        showGameToast('"' + name + '" added');

        // After share is confirmed or skipped, go to the question type picker
        var capturedId = newId;
        var capturedName = name;
        _postShareCallback = function() { showQTypePickerForNewGame(capturedId, capturedName); };

        // Open the share panel immediately as a separate step (isNew pre-checks current dept)
        if (gameRow) {
            openGameSharePanel(gameRow, { isNew: true });
        } else {
            showQTypePickerForNewGame(newId, name);
        }
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

// ===== After Create Game: auto-create Category 1 and open question type picker =====
function showQTypePickerForNewGame(gameId, gameName) {
    var gameRow = document.querySelector('tr.row-game[data-game="' + gameId + '"]');
    if (!gameRow) { showGameEmpty(); return; }

    // Silently create "Category 1"
    var catId = Date.now();
    var newCat = { id: catId, name: 'Category 1', description: '', questions: [] };
    var tbody = document.querySelector('#gamesTable tbody');
    if (tbody) {
        gameRow.insertAdjacentHTML('afterend', catRowHtml(newCat, gameId, gameRow.dataset.cover || ''));
        updateGameRowChips(gameRow);
        persistGamesScope();
    }

    _isGameAddMode = false;
    _gameEditType  = 'add-question';
    _gameEditRow   = document.querySelector('tr.row-cat[data-game="' + gameId + '"][data-cat="' + catId + '"]');

    document.getElementById('gameEditTitle').textContent    = 'Add Question';
    document.getElementById('gameEditSubtitle').textContent = gameName;

    var badge = document.getElementById('gameEditBadge');
    if (badge) { badge.innerHTML = '<i class="fas fa-plus"></i> Adding'; badge.classList.remove('badge-ai'); }

    var creditBal = document.getElementById('aiPanelCreditBal');
    if (creditBal) creditBal.hidden = true;

    document.getElementById('gameEditFields').innerHTML = _renderQTypePickerHtml(gameId, catId);

    var submitBtn = document.getElementById('gameSubmitBtn');
    if (submitBtn) submitBtn.classList.add('hidden');

    var actionsBar = document.querySelector('#detailEdit .edit-actions');
    if (actionsBar) {
        actionsBar.innerHTML =
            '<button type="button" class="btn btn-outline" onclick="showGameEmpty()">Cancel</button>';
    }

    showGameEdit();
}

// ===== Combined Share + Schedule step (after add) =====
function showAddGameShareStep(gameName) {
    _pendingGameName = gameName;

    var isAI = !!document.getElementById('aiGameTabShareSchedule');
    var tabBtn = document.getElementById(isAI ? 'aiGameTabShareSchedule' : 'gameTabShareSchedule');
    if (tabBtn) tabBtn.disabled = false;

    if (isAI) { switchGameAITab('ai-share-schedule'); } else { switchGameTab('share-schedule'); }

    var actions = document.querySelector('#detailEdit .edit-actions');
    if (actions) {
        actions.innerHTML =
            '<button type="button" class="btn btn-outline" onclick="skipGameShareSchedule()">Skip</button>' +
            '<button type="button" class="btn btn-primary" onclick="applyGameShareSchedule()">Confirm</button>';
    }
}

function applyGameShareSchedule() {
    var gameName = _pendingGameName;
    _pendingGameName = null;

    // Apply sharing
    var deptNames = Array.from(document.querySelectorAll('input[name="shareDept"]:checked'))
        .map(function(i) { return i.value; });
    if (deptNames.length) {
        shareGameWithDepts(_currentGameScope.companyKey, gameName, deptNames);
        showGameToast('"' + gameName + '" shared to ' + deptNames.length + ' dept' + (deptNames.length !== 1 ? 's' : ''));
        refreshGames();
    }

    // Apply schedule (dates are optional)
    var startVal = document.getElementById('scheduleStartDate') ? document.getElementById('scheduleStartDate').value : '';
    var endVal   = document.getElementById('scheduleEndDate')   ? document.getElementById('scheduleEndDate').value   : '';
    if (startVal) {
        var gameRows = document.querySelectorAll('#gamesTable tbody tr.row-game');
        var targetRow = _schedulingGameRow || (gameRows.length ? gameRows[gameRows.length - 1] : null);
        if (targetRow) {
            targetRow.dataset.scheduledDate = startVal;
            if (endVal) targetRow.dataset.scheduledEndDate = endVal;
            updateGameRowChips(targetRow);
        }
        if (!deptNames.length) {
            showGameToast('Scheduled ' + startVal + (endVal ? ' → ' + endVal : ''));
        }
    } else if (!deptNames.length) {
        showGameToast('Game saved');
    }

    persistGamesScope();
    showGameEmpty();
}

function skipGameShareSchedule() {
    persistGamesScope();
    showGameEmpty();
}

function shareGameWithDepts(companyKey, gameName, deptNames) {
    if (typeof GAMES_BY_SCOPE === 'undefined' || typeof GAMES_BY_DEPT === 'undefined') return;
    var visible = collectGamesForScope(companyKey, _currentGameScope.dept);
    var sourceGame = visible.find ? visible.find(function(g) { return g.name === gameName; }) : null;
    if (!sourceGame) return;

    // Track which departments the source game is shared to
    if (!sourceGame.sharedDepts) sourceGame.sharedDepts = [];

    deptNames.forEach(function(dn) {
        // Add to source game's share list (deduped)
        if (sourceGame.sharedDepts.indexOf(dn) === -1) {
            sourceGame.sharedDepts.push(dn);
        }

        var key = (companyKey || '') + '|' + dn;
        var bucket = GAMES_BY_SCOPE[key];
        if (!bucket) {
            var seed = GAMES_BY_DEPT[dn.toLowerCase()] || [];
            bucket = seed.slice();
            GAMES_BY_SCOPE[key] = bucket;
        }
        if (!bucket.some(function(g) { return g.name === gameName; })) {
            var copy = JSON.parse(JSON.stringify(sourceGame));
            copy.sharedDate  = new Date().toISOString();
            copy.sharedDepts = []; // copies don't carry the parent's share list
            bucket.push(copy);
        }
    });

    // Sync the DOM row dataset so the chip updates immediately
    var gameRow = document.querySelector('tr.row-game[data-name="' + CSS.escape ? gameName.replace(/"/g,'&quot;') : gameName + '"]');
    if (!gameRow) {
        document.querySelectorAll('tr.row-game').forEach(function(r) {
            if (r.dataset.name === gameName) gameRow = r;
        });
    }
    if (gameRow) {
        gameRow.dataset.sharedDepts = JSON.stringify(sourceGame.sharedDepts);
        updateGameRowChips(gameRow);
    }
}

function unshareGameFromDepts(companyKey, gameName, deptNames) {
    if (typeof GAMES_BY_SCOPE === 'undefined') return;
    deptNames.forEach(function(dn) {
        var key = (companyKey || '') + '|' + dn;
        var bucket = GAMES_BY_SCOPE[key];
        if (bucket) {
            for (var i = bucket.length - 1; i >= 0; i--) {
                if (bucket[i].name === gameName) { bucket.splice(i, 1); break; }
            }
        }
    });
    // Remove from source game's sharedDepts list
    var visible = collectGamesForScope(companyKey, _currentGameScope.dept);
    var src = visible.find ? visible.find(function(g) { return g.name === gameName; }) : null;
    if (src && src.sharedDepts) {
        src.sharedDepts = src.sharedDepts.filter(function(d) { return deptNames.indexOf(d) === -1; });
    }
}

// ===== Schedule panel confirm (kebab-menu flow for existing games) =====
function confirmGameSchedule() {
    var startVal = document.getElementById('scheduleStartDate') ? document.getElementById('scheduleStartDate').value : '';
    var endVal   = document.getElementById('scheduleEndDate')   ? document.getElementById('scheduleEndDate').value   : '';
    if (!startVal) { showGameToast('Please pick a start date'); return; }
    var gameRows = document.querySelectorAll('#gamesTable tbody tr.row-game');
    var targetRow = _schedulingGameRow || (gameRows.length ? gameRows[gameRows.length - 1] : null);
    if (targetRow) {
        targetRow.dataset.scheduledDate = startVal;
        if (endVal) targetRow.dataset.scheduledEndDate = endVal;
        updateGameRowChips(targetRow);
    }
    showGameToast('Scheduled ' + startVal + (endVal ? ' → ' + endVal : ''));
    persistGamesScope();
    showGameEmpty();
}

function cancelGameSchedule() { showGameEmpty(); }
function skipGameSchedule() {
    persistGamesScope();
    showGameEmpty();
}

// ===== Share helpers =====
var _SHARE_MONTHS_GAME = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function formatGameSharedDate(isoStr) {
    if (!isoStr) return '';
    var d = new Date(isoStr);
    return d.getDate() + ' ' + _SHARE_MONTHS_GAME[d.getMonth()] + ' \'' + String(d.getFullYear()).slice(2);
}

// Formats a scheduled date range for the share-panel dept tag.
// e.g. "30 May – 30 Jun '26"  or just "30 May '26" when no end date.
function _fmtScheduleTag(start, end) {
    if (!start) return '';
    var s = new Date(start);
    var sStr = s.getDate() + ' ' + _SHARE_MONTHS_GAME[s.getMonth()];
    if (!end) return sStr + ' \'' + String(s.getFullYear()).slice(2);
    var e = new Date(end);
    var eStr = e.getDate() + ' ' + _SHARE_MONTHS_GAME[e.getMonth()];
    var yr = '\'' + String(e.getFullYear()).slice(2);
    return sStr + ' – ' + eStr + ' ' + yr;
}

function getGameSharedDepts(companyKey, gameName) {
    if (!companyKey || !gameName || typeof GAMES_BY_SCOPE === 'undefined') return [];
    var visible = collectGamesForScope(companyKey, _currentGameScope.dept);
    var src = visible.find ? visible.find(function(g) { return g.name === gameName; }) : null;
    return (src && src.sharedDepts) ? src.sharedDepts : [];
}

function getGameSharedDate(companyKey, gameName, deptName) {
    if (typeof GAMES_BY_SCOPE === 'undefined') return '';
    var key = (companyKey || '') + '|' + deptName;
    var bucket = GAMES_BY_SCOPE[key];
    if (!bucket) return '';
    var game = bucket.find ? bucket.find(function(g) { return g.name === gameName; }) : null;
    if (!game) return '';
    if (!game.sharedDate) { game.sharedDate = new Date().toISOString(); persistGamesScope(); }
    return game.sharedDate;
}

// ===== Panel share =====
// opts.isNew = true → pre-checks current dept, confirm button always enabled
function openGameSharePanel(gameRow, opts) {
    opts = opts || {};
    if (!_postShareCallback) _postShareCallback = null;
    var name        = gameRow.dataset.name            || '';
    var existStart  = gameRow.dataset.scheduledDate    || '';
    var existEnd    = gameRow.dataset.scheduledEndDate || '';
    var companyKey  = _currentGameScope.companyKey;
    var companies   = (typeof GAMES_SIDEBAR_COMPANIES   !== 'undefined') ? GAMES_SIDEBAR_COMPANIES   : [];
    var departments = (typeof GAMES_SIDEBAR_DEPARTMENTS !== 'undefined') ? GAMES_SIDEBAR_DEPARTMENTS : [];
    var company = companies.find(function(c) { return c.name.toLowerCase() === companyKey; });
    if (!company) { showGameToast('Select a company first'); return; }

    var allDepts    = departments.filter(function(d) { return d.companyId === company.id; });
    var sharedNow   = new Set(getGameSharedDepts(companyKey, name));
    var currentDept = (_currentGameScope && _currentGameScope.dept) || '';
    _currentGameShareTarget = {
        name: name, row: gameRow,
        sharedDepts: Array.from(sharedNow), isNew: !!opts.isNew,
        initialStart: existStart, initialEnd: existEnd
    };

    var scheduleTag = _fmtScheduleTag(existStart, existEnd);
    var items = allDepts.map(function(d) {
        var already  = sharedNow.has(d.name);
        var precheck = already || (opts.isNew && d.name === currentDept);
        return '<label class="share-dept-item">' +
            '<input type="checkbox" value="' + escapeAttr(d.name) + '"' + (precheck ? ' checked' : '') + '>' +
            '<span class="share-dept-name">' + escapeAttr(d.name) + '</span>' +
            (already && scheduleTag ? '<span class="share-dept-tag">' + escapeAttr(scheduleTag) + '</span>' : '') +
        '</label>';
    }).join('') || '<p class="share-empty">No departments to share with.</p>';

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
    var btn  = document.getElementById('gameShareConfirmBtn');
    var list = document.getElementById('gameShareDeptList');
    if (!btn || !list) return;
    if (_currentGameShareTarget && _currentGameShareTarget.isNew) {
        btn.disabled = false;
        btn.textContent = 'Share';
        return;
    }
    var initial    = new Set((_currentGameShareTarget && _currentGameShareTarget.sharedDepts) || []);
    var current    = new Set(Array.from(list.querySelectorAll('input:checked')).map(function(c) { return c.value; }));
    var hasChanges = current.size !== initial.size
        || Array.from(current).some(function(d) { return !initial.has(d); })
        || Array.from(initial).some(function(d) { return !current.has(d); });
    btn.disabled    = !hasChanges;
    btn.textContent = hasChanges ? 'Save' : 'No changes';
}

function cancelGameSharePanel() {
    _currentGameShareTarget = null;
    var cb = _postShareCallback;
    _postShareCallback = null;
    if (cb) { cb(); } else { showGameEmpty(); }
}

function confirmGameSharePanel() {
    var target = _currentGameShareTarget;
    _currentGameShareTarget = null;
    var cb = _postShareCallback;
    _postShareCallback = null;
    if (!target) { if (cb) { cb(); } else { showGameEmpty(); } return; }
    var list = document.getElementById('gameShareDeptList');
    if (!list) { if (cb) { cb(); } else { showGameEmpty(); } return; }

    var all       = Array.from(list.querySelectorAll('input')).map(function(c) { return c.value; });
    var current   = new Set(Array.from(list.querySelectorAll('input:checked')).map(function(c) { return c.value; }));
    var initial   = new Set(target.sharedDepts || []);
    var toShare   = all.filter(function(d) { return  current.has(d) && !initial.has(d); });
    var toUnshare = all.filter(function(d) { return !current.has(d) &&  initial.has(d); });

    if (toShare.length)   shareGameWithDepts(_currentGameScope.companyKey, target.name, toShare);
    if (toUnshare.length) unshareGameFromDepts(_currentGameScope.companyKey, target.name, toUnshare);

    if (toShare.length || toUnshare.length) {
        var parts = [];
        if (toShare.length)   parts.push('shared with ' + toShare.length);
        if (toUnshare.length) parts.push('removed from ' + toUnshare.length);
        var total = toShare.length + toUnshare.length;
        persistGamesScope();
        showGameToast('"' + target.name + '" ' + parts.join(', ') + ' dept' + (total !== 1 ? 's' : ''));
        refreshGames();
    }

    if (cb) { cb(); } else { showGameEmpty(); }
}

// ===== Panel schedule (from kebab menu) =====
function openGameSchedulePanel(gameRow) {
    _schedulingGameRow = gameRow;
    var name  = gameRow.dataset.name || '';
    var start = gameRow.dataset.scheduledDate    || '';
    var end   = gameRow.dataset.scheduledEndDate || '';
    document.getElementById('scheduleTitle').textContent    = 'Schedule Game';
    document.getElementById('scheduleSubtitle').textContent = escapeAttr(name);
    document.getElementById('scheduleBody').innerHTML = buildScheduleBodyHtml(start, end);
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
    var catId  = row.dataset.cat;
    var catName = row.dataset.name || 'Category';

    _gameEditType = 'add-question';
    _gameEditRow  = row;

    document.getElementById('gameEditTitle').textContent    = 'Add Question';
    document.getElementById('gameEditSubtitle').textContent = catName;
    setGamePanelMode('add');

    document.getElementById('gameEditFields').innerHTML = _renderQTypePickerHtml(gameId, catId);

    var submitBtn = document.getElementById('gameSubmitBtn');
    if (submitBtn) submitBtn.classList.add('hidden');

    var actionsBar = document.querySelector('#detailEdit .edit-actions');
    if (actionsBar) {
        actionsBar.innerHTML =
            '<button type="button" class="btn btn-outline" onclick="showGameEmpty()">Cancel</button>';
    }

    showGameEdit();
}

// ===== Shared Q-type picker HTML builder =====
function _renderQTypePickerHtml(gameId, catId) {
    var Q_TYPES = [
        { key: 'mcq',         icon: 'fa-circle-question', title: 'Multiple Choice (MCQ)',  desc: 'A question with multiple options and one correct answer' },
        { key: 'fill-blank',  icon: 'fa-pen',             title: 'Fill in the Blanks',     desc: 'A sentence with missing words the player must fill in' },
        { key: 'stmt-blank',  icon: 'fa-pen',             title: 'Statement Blanking',     desc: 'A statement where the player must place blanked words back in their correct positions' },
        { key: 'select-img',  icon: 'fa-image',           title: 'Select on Image',        desc: 'Click on the correct area of an image to answer' },
        { key: 'match-terms', icon: 'fa-link',            title: 'Match the Terms',        desc: 'Match terms on the left with their definitions on the right' },
        { key: 'word-bucket', icon: 'fa-bucket',          title: 'Word Bucket',            desc: 'Drag words into the correct category buckets' },
        { key: 'crossword',   icon: 'fa-border-all',      title: 'Crossword',              desc: 'Fill in a crossword puzzle using the clues provided' }
    ];
    return '<p class="q-type-prompt">What type of question would you like to add?</p>' +
        '<div class="q-type-picker">' +
        Q_TYPES.map(function(t) {
            return '<button type="button" class="q-type-card" onclick="openAddQuestionForm(\'' + escapeAttr(t.key) + '\',' + gameId + ',' + catId + ')">' +
                '<span class="q-type-card-icon"><i class="fas ' + t.icon + '"></i></span>' +
                '<span class="q-type-card-title">' + escapeAttr(t.title) + '</span>' +
                '<span class="q-type-card-desc">' + escapeAttr(t.desc) + '</span>' +
            '</button>';
        }).join('') +
        '</div>';
}

function backToQTypePicker(gameId, catId) {
    var catRow = document.querySelector('tr.row-cat[data-game="' + gameId + '"][data-cat="' + catId + '"]');
    var catName = catRow ? (catRow.dataset.name || 'Category') : 'Category';

    _gameEditType = 'add-question';
    _gameEditRow = catRow;

    document.getElementById('gameEditTitle').textContent = 'Add Question';
    document.getElementById('gameEditSubtitle').textContent = catName;

    document.getElementById('gameEditFields').innerHTML = _renderQTypePickerHtml(gameId, catId);

    var submitBtn = document.getElementById('gameSubmitBtn');
    if (submitBtn) submitBtn.classList.add('hidden');

    var actionsBar = document.querySelector('#detailEdit .edit-actions');
    if (actionsBar) {
        actionsBar.innerHTML =
            '<button type="button" class="btn btn-outline" onclick="showGameEmpty()">Cancel</button>';
    }

    var form = document.getElementById('gameEditForm');
    if (form) form.onsubmit = saveGameAdd;

    showGameEdit();
}

function openAddQuestionForm(questionType, gameId, catId) {
    // catRow may be null on the Questions page (no DOM table there)
    var catRow  = document.querySelector('tr.row-cat[data-game="' + gameId + '"][data-cat="' + catId + '"]');
    var catName = catRow ? (catRow.dataset.name || 'Category') : (document.getElementById('gameEditSubtitle') || {}).textContent || 'Category';

    _gameEditType = 'add-question';
    _gameEditRow  = catRow;

    document.getElementById('gameEditTitle').textContent    = 'Add Question';
    document.getElementById('gameEditSubtitle').textContent = catName;

    // Start with 2 options
    var initOptsHtml = [1,2].map(function(n) {
        return '<div class="aq-option">' +
            '<label class="aq-option-label">Option ' + n + '</label>' +
            '<input type="text" name="opt" placeholder="Option ' + n + '" class="aq-option-input" oninput="aqSyncCorrectRadios()">' +
        '</div>';
    }).join('');

    document.getElementById('gameEditFields').innerHTML =
        '<a class="aq-change-type" href="#" onclick="backToQTypePicker(' + gameId + ',' + catId + ');return false;">' +
            '<i class="fas fa-arrow-left"></i> Change type' +
        '</a>' +

        '<div class="form-group">' +
            '<label>Question <span class="aq-required">*</span></label>' +
            '<input type="text" name="qtext" placeholder="Enter the question text" class="aq-question-input">' +
        '</div>' +

        '<div class="form-group">' +
            '<label>Difficulty <span class="form-label-optional">(optional)</span></label>' +
            '<select name="difficulty" class="aq-select">' +
                '<option value="">Select difficulty</option>' +
                '<option value="easy">Easy</option>' +
                '<option value="medium">Medium</option>' +
                '<option value="hard">Hard</option>' +
            '</select>' +
        '</div>' +

        '<div class="form-group">' +
            '<label>Question Image <span class="form-label-optional">(optional)</span></label>' +
            '<label class="aq-image-zone">' +
                '<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" style="display:none">' +
                '<i class="fas fa-cloud-upload-alt aq-image-icon"></i>' +
                '<span class="aq-image-drag">Drag and drop your file here</span>' +
                '<span class="aq-image-or">or</span>' +
                '<span class="aq-image-btn">Choose File</span>' +
                '<span class="aq-image-hint">Accepted: PNG, JPEG, WEBP, GIF. Max 5 MB.</span>' +
            '</label>' +
        '</div>' +

        '<div class="form-group">' +
            '<label>Answer Options <span class="aq-required">*</span></label>' +
            '<div class="aq-options" id="aqOptionsList">' + initOptsHtml + '</div>' +
            '<button type="button" class="btn btn-outline aq-add-option-btn" onclick="aqAddOption()">Add Option</button>' +
        '</div>' +

        '<div class="form-group" id="aqCorrectSection">' +
            '<label>Correct Answer <span class="aq-required">*</span></label>' +
            '<div class="aq-correct-radios" id="aqCorrectRadios">' +
                '<label class="aq-correct-row"><input type="radio" name="correct" value="0" checked> Option 1</label>' +
                '<label class="aq-correct-row"><input type="radio" name="correct" value="1"> Option 2</label>' +
            '</div>' +
        '</div>' +
        '<input type="hidden" name="questionType" value="' + escapeAttr(questionType) + '">';

    var submitBtn = document.getElementById('gameSubmitBtn');
    if (submitBtn) submitBtn.classList.add('hidden');

    var actionsBar = document.querySelector('#detailEdit .edit-actions');
    if (actionsBar) {
        actionsBar.innerHTML =
            '<button type="button" class="btn btn-outline" onclick="showGameEmpty()">Cancel</button>' +
            '<button type="button" class="btn btn-outline" onclick="saveQAndAddAnother(' + gameId + ',' + catId + ')">Save &amp; Add Another</button>' +
            '<button type="button" class="btn btn-primary" onclick="submitAddQuestion(' + gameId + ',' + catId + ')">Add Question</button>';
    }

    showGameEdit();
}

function _doSaveQuestion(gameId, catId) {
    var form = document.getElementById('gameEditForm');
    if (!form) return false;
    var qtextEl = form.querySelector('input[name="qtext"]');
    var text = qtextEl ? qtextEl.value.trim() : '';
    if (!text) { showGameToast('Enter question text'); return false; }
    var opts = [];
    var optEls = form.querySelectorAll('#aqOptionsList input[name="opt"]');
    optEls.forEach(function(el) { opts.push(el.value.trim()); });
    opts = opts.filter(function(v) { return v; });
    if (opts.length < 2) { showGameToast('Add at least 2 options'); return false; }
    var correctEl = form.querySelector('input[name="correct"]:checked');
    var correct = correctEl ? parseInt(correctEl.value, 10) : 0;
    var diffEl = form.querySelector('select[name="difficulty"]');
    var difficulty = diffEl ? diffEl.value : '';

    var catRow = document.querySelector('tr.row-cat[data-game="' + gameId + '"][data-cat="' + catId + '"]');
    var newQ = { id: Date.now() + Math.floor(Math.random() * 1000), text: text, options: opts, correct: correct, difficulty: difficulty };
    var existingQs = document.querySelectorAll('tr.row-q[data-game="' + gameId + '"][data-cat="' + catId + '"]');
    var qNum = existingQs.length + 1;
    var insertAfter = existingQs.length ? existingQs[existingQs.length - 1] : catRow;
    insertAfter.insertAdjacentHTML('afterend', qRowHtml(newQ, gameId, catId, qNum));
    if (catRow) updateCatRowChips(catRow);
    var gameRow = document.querySelector('tr.row-game[data-game="' + gameId + '"]');
    if (gameRow) updateGameRowChips(gameRow);
    persistGamesScope();
    showGameToast('Question added');
    return true;
}

function _navigateToQuestionsPage(gameId, catId, openPicker) {
    try {
        localStorage.setItem('gameon.questionsNav', JSON.stringify({
            gameId:     String(gameId),
            catId:      String(catId),
            openPicker: !!openPicker,
            companyKey: (_currentGameScope && _currentGameScope.companyKey) || '',
            dept:       (_currentGameScope && _currentGameScope.dept)       || '',
            deptName:   (_currentGameScope && _currentGameScope.deptName)   || ''
        }));
    } catch(e) {}
    window.location.href = 'index-questions.html';
}

function submitAddQuestion(gameId, catId) {
    if (_doSaveQuestion(gameId, catId)) {
        var form = document.getElementById('gameEditForm');
        if (form) form.onsubmit = saveGameAdd;
        _navigateToQuestionsPage(gameId, catId, false);
    }
}

function saveQAndAddAnother(gameId, catId) {
    if (_doSaveQuestion(gameId, catId)) {
        _navigateToQuestionsPage(gameId, catId, true);
    }
}

// ===== Add Question form helpers =====
function aqAddOption() {
    var list = document.getElementById('aqOptionsList');
    if (!list) return;
    var n = list.querySelectorAll('.aq-option').length + 1;
    var div = document.createElement('div');
    div.className = 'aq-option';
    div.innerHTML =
        '<label class="aq-option-label">Option ' + n + '</label>' +
        '<input type="text" name="opt" placeholder="Option ' + n + '" class="aq-option-input" oninput="aqSyncCorrectRadios()">';
    list.appendChild(div);
    aqSyncCorrectRadios();
}

function aqSyncCorrectRadios() {
    var list = document.getElementById('aqOptionsList');
    var radiosEl = document.getElementById('aqCorrectRadios');
    if (!list || !radiosEl) return;

    var prevVal = (radiosEl.querySelector('input[name="correct"]:checked') || {}).value || '0';

    var inputs = list.querySelectorAll('input[name="opt"]');
    radiosEl.innerHTML = Array.prototype.map.call(inputs, function(inp, i) {
        var label = inp.value.trim() || ('Option ' + (i + 1));
        var checked = (String(i) === String(prevVal)) ? ' checked' : '';
        return '<label class="aq-correct-row">' +
            '<input type="radio" name="correct" value="' + i + '"' + checked + '> ' +
            escapeAttr(label) +
        '</label>';
    }).join('');
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
var _aiGameHasGenerated = false;

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
        var val = escapeAttr(JSON.stringify({
            name: t.name,
            description: t.description || '',
            cover: t.cover || '',
            subTopics: t.subTopics || []
        }));
        return '<option value="' + val + '">' + escapeAttr(t.name) + '</option>';
    }).join('');
}

function toggleAIGameTopicLink(checkbox) {
    var row = document.getElementById('aiGameTopicRow');
    if (!row) return;
    if (checkbox.checked) {
        row.classList.remove('hidden');
    } else {
        row.classList.add('hidden');
        var sel = document.getElementById('aiGameTopicSelect');
        if (sel) sel.value = '';
        onAIGameTopicChange(null);
    }
}

function onAIGameTopicChange(select) {
    window._aiGamePendingTopic = null;
    var val = select ? select.value : '';
    var note = document.getElementById('aiGameContentSkipNote');
    var catsToggleText = document.querySelector('.ai-subtopics-option #aiGameIncludeCats + .ai-toggle-track + .ai-toggle-text') ||
                         document.querySelector('#aiGameTabPaneContent .ai-toggle-text');
    if (!val) {
        if (note) note.classList.add('hidden');
        // Reset categories toggle label
        var allToggles = document.querySelectorAll('#aiGameTabPaneContent .ai-toggle-text');
        allToggles.forEach(function(t) {
            if (t.textContent.indexOf('categor') >= 0) t.textContent = 'Generate with categories & questions';
        });
        return;
    }
    try { window._aiGamePendingTopic = JSON.parse(val); } catch(e) { window._aiGamePendingTopic = { name: val }; }
    if (note) note.classList.remove('hidden');
    // Update categories toggle label to reflect topic sub-topics
    var hasSubs = window._aiGamePendingTopic.subTopics && window._aiGamePendingTopic.subTopics.length;
    var allToggles = document.querySelectorAll('#aiGameTabPaneContent .ai-toggle-text');
    allToggles.forEach(function(t) {
        if (t.textContent.indexOf('categor') >= 0) {
            t.textContent = hasSubs
                ? 'Use topic categories & generate questions'
                : 'Generate with categories & questions';
        }
    });
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

// ===== Cover image drop zone (used in add / AI result flows) =====
function gameCoverDropZoneHtml(currentCover) {
    var hasImage = !!currentCover;
    var inner = hasImage
        ? '<img src="' + escapeAttr(currentCover) + '" alt="Cover" class="cover-drop-preview">' +
          '<span class="cover-drop-overlay"><i class="fas fa-cloud-arrow-up"></i> Change</span>'
        : '<i class="fas fa-cloud-arrow-up cover-drop-icon"></i>' +
          '<span class="cover-drop-text">Drop a file or click to upload</span>';
    return '<div class="form-group">' +
        '<label>Upload</label>' +
        '<label class="cover-drop-zone" id="gameCoverDropZone">' +
            inner +
            '<input type="file" class="cover-file-input" id="gameCoverFileInput" accept="image/*" onchange="previewGameCoverDrop(this)">' +
            '<input type="hidden" class="cover-hidden-input" name="cover" id="gameCoverHiddenInput" value="' + escapeAttr(currentCover || '') + '">' +
        '</label>' +
    '</div>';
}

function previewGameCoverDrop(input) {
    var file = input.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(e) {
        var dataUrl = e.target.result;
        var zone = input.closest('.cover-drop-zone');
        if (!zone) return;
        var hidden = zone.querySelector('.cover-hidden-input');
        if (hidden) hidden.value = dataUrl;
        // Rebuild interior with preview + overlay, keep the file + hidden inputs
        var existingFile = zone.querySelector('input[type=file]');
        var existingHidden = zone.querySelector('input[type=hidden]');
        // Clear non-input children
        Array.from(zone.childNodes).forEach(function(n) {
            if (n.nodeName !== 'INPUT') zone.removeChild(n);
        });
        var img = document.createElement('img');
        img.src = dataUrl;
        img.alt = 'Cover';
        img.className = 'cover-drop-preview';
        var overlay = document.createElement('span');
        overlay.className = 'cover-drop-overlay';
        overlay.innerHTML = '<i class="fas fa-cloud-arrow-up"></i> Change';
        zone.insertBefore(overlay, zone.firstChild);
        zone.insertBefore(img, zone.firstChild);
        if (existingHidden) existingHidden.value = dataUrl;
    };
    reader.readAsDataURL(file);
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
    _aiGameHasGenerated = false;
    _gameEditRow = null;
    _gameEditType = 'game';

    // setGamePanelMode BEFORE innerHTML so it can't remove aiGameGenerateBtn
    setGamePanelMode('add');
    _isAIGameFlow = true;

    document.getElementById('gameEditTitle').textContent = 'Generate Game';
    document.getElementById('gameEditSubtitle').textContent = getGamesScopeSubtitle();
    window._aiGamePendingTopic = null;

    document.getElementById('gameEditFields').innerHTML =

        // ── Tab bar (Content active, Game + Categories unlocked after first generate) ──
        '<div class="add-topic-tabs" id="aiGameTabBar">' +
            '<button type="button" class="add-topic-tab active" data-tab="ai-content" onclick="switchAIGameTab(\'ai-content\')">Content</button>' +
            '<button type="button" class="add-topic-tab" data-tab="ai-game" id="aiGameGameTab" onclick="switchAIGameTab(\'ai-game\')" disabled>Game</button>' +
            '<button type="button" class="add-topic-tab hidden" data-tab="ai-cats" id="aiGameCatsTab" onclick="switchAIGameTab(\'ai-cats\')" disabled>' +
                '<i class="fas fa-list-ol"></i> Categories' +
            '</button>' +
        '</div>' +

        // ── Content pane ──────────────────────────────────────────────────────
        '<div class="add-topic-pane" id="aiGameTabPaneContent">' +
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
            '<div class="form-group" id="aiGameUploadSection">' +
                '<label>Upload</label>' +
                '<div class="ai-upload-zone" id="aiGameUploadZone"' +
                    ' onclick="document.getElementById(\'aiGameFileInput\').click()"' +
                    ' ondragover="event.preventDefault();this.classList.add(\'drag-over\')"' +
                    ' ondragleave="this.classList.remove(\'drag-over\')"' +
                    ' ondrop="onAIGameFileDrop(this,event)">' +
                    '<input type="file" id="aiGameFileInput" hidden accept=".pdf,.docx,.xlsx,.png,.jpeg,.jpg" onchange="onAIGameFileChange(this)">' +
                    '<i class="fas fa-cloud-upload-alt ai-upload-icon"></i>' +
                    '<span class="ai-upload-prompt" id="aiGameUploadPrompt">Drop a file or click to upload</span>' +
                '</div>' +
            '</div>' +
            '<div class="form-group" id="aiGameUrlSection">' +
                '<label>URL</label>' +
                '<input type="url" id="aiGameUrlInput" class="ai-text-input" placeholder="https://…" oninput="updateAIGameGenerateBtn()">' +
            '</div>' +
            '<div class="form-group" id="aiGameTextSection">' +
                '<label>Text</label>' +
                '<div class="rte-toolbar">' +
                    '<button type="button" class="rte-btn" title="Bold" onmousedown="event.preventDefault();document.execCommand(\'bold\')"><i class="fas fa-bold"></i></button>' +
                    '<button type="button" class="rte-btn" title="Italic" onmousedown="event.preventDefault();document.execCommand(\'italic\')"><i class="fas fa-italic"></i></button>' +
                    '<button type="button" class="rte-btn" title="Underline" onmousedown="event.preventDefault();document.execCommand(\'underline\')"><i class="fas fa-underline"></i></button>' +
                    '<span class="rte-sep"></span>' +
                    '<button type="button" class="rte-btn" title="Bullet list" onmousedown="event.preventDefault();document.execCommand(\'insertUnorderedList\')"><i class="fas fa-list-ul"></i></button>' +
                    '<button type="button" class="rte-btn" title="Numbered list" onmousedown="event.preventDefault();document.execCommand(\'insertOrderedList\')"><i class="fas fa-list-ol"></i></button>' +
                '</div>' +
                '<div id="aiGameTextInput" class="ai-rte" contenteditable="true"' +
                    ' data-placeholder="Paste text, notes, or reference material…"' +
                    ' oninput="updateAIGameGenerateBtn()"></div>' +
            '</div>' +
            '<div class="ai-subtopics-option">' +
                '<label class="ai-toggle-label">' +
                    '<span class="ai-toggle-wrap">' +
                        '<input type="checkbox" id="aiGameIncludeCats" class="ai-toggle-input" checked>' +
                        '<span class="ai-toggle-track"></span>' +
                    '</span>' +
                    '<span class="ai-toggle-text">Generate with categories &amp; questions</span>' +
                '</label>' +
            '</div>' +

            // ── Link to topic (optional) ──────────────────────────────────────
            '<div class="ai-subtopics-option">' +
                '<label class="ai-toggle-label">' +
                    '<span class="ai-toggle-wrap">' +
                        '<input type="checkbox" id="aiGameLinkTopicToggle" class="ai-toggle-input" onchange="toggleAIGameTopicLink(this)">' +
                        '<span class="ai-toggle-track"></span>' +
                    '</span>' +
                    '<span class="ai-toggle-text">Link to a topic</span>' +
                '</label>' +
            '</div>' +
            '<div class="hidden" id="aiGameTopicRow">' +
                '<div class="form-group" style="margin-top:8px">' +
                    '<select id="aiGameTopicSelect" class="ai-model-select" onchange="onAIGameTopicChange(this)">' +
                        '<option value="">Select a topic</option>' +
                        (getAIGameTopicOptions() || '') +
                    '</select>' +
                '</div>' +
                '<div class="hidden ai-topic-linked-note" id="aiGameContentSkipNote">' +
                    '<i class="fas fa-circle-info"></i> Topic sub-topics will be used as game categories' +
                '</div>' +
            '</div>' +

        '</div>' +

        // ── Game pane (filled after generation) ───────────────────────────────
        '<div class="add-topic-pane hidden" id="aiGameTabPaneGame"></div>' +

        // ── Categories pane (filled after generation, shown only if cats generated) ─
        '<div class="add-topic-pane hidden" id="aiGameTabPaneCats"></div>' +

        // ── Generate block — always at bottom ─────────────────────────────────
        '<div class="ai-generate-block">' +
            '<div class="form-group">' +
                '<input type="text" class="ai-text-input" id="aiGamePromptText" placeholder="What game would you like to create today?">' +
            '</div>' +
            '<button type="button" class="btn btn-ai btn-full" id="aiGameGenerateBtn" onclick="aiGameGenerate()">' +
                '<i class="fas fa-wand-magic-sparkles"></i> Generate Game' +
            '</button>' +
        '</div>';

    _aiGameGenerateIdx = 0;

    var badge = document.getElementById('gameEditBadge');
    if (badge) {
        badge.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> Generating with AI';
        badge.classList.add('badge-ai');
    }

    var key   = _currentGameScope && _currentGameScope.companyKey;
    var used  = key ? (_gameAiCreditsUsed[key] || 0) : 0;
    var total = getGameCompanyCreditsTotal(key || '');
    var countEl = document.getElementById('aiGameCreditsCount');
    var totalEl = document.getElementById('aiGameCreditsTotal');
    if (countEl) countEl.textContent = used;
    if (totalEl) totalEl.textContent = total;
    var creditBal = document.getElementById('aiPanelCreditBal');
    if (creditBal) creditBal.hidden = false;

    var submitBtn = document.getElementById('gameSubmitBtn');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.classList.add('hidden'); }

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


    // Panel topbar credit pill (visible only during AI flow)
    var panelBal = document.getElementById('aiPanelCreditBal');
    if (panelBal && !panelBal.hidden) {
        var pcCount = document.getElementById('aiGameCreditsCount');
        var pcTotal = document.getElementById('aiGameCreditsTotal');
        if (pcCount) pcCount.textContent = used;
        if (pcTotal) pcTotal.textContent = total;
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

function onAIGameFileDrop(zone, event) {
    event.preventDefault();
    zone.classList.remove('drag-over');
    var file = event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0];
    if (!file) return;
    var fakeInput = { files: [file] };
    onAIGameFileChange(fakeInput);
}

function onAIGameFileChange(input) {
    var file = input.files && input.files[0];
    if (!file) return;
    var container = document.getElementById('aiGameUploadZone');
    if (!container) return;

    var ext = file.name.split('.').pop().toLowerCase();
    var allowedExts = ['pdf', 'docx', 'xlsx', 'png', 'jpeg', 'jpg'];
    if (allowedExts.indexOf(ext) === -1) {
        showGameToast('Unsupported file type. Please upload a PDF, DOCX, XLSX, PNG, JPG, or JPEG file.');
        input.value = '';
        return;
    }

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
        showGameToast('File successfully uploaded.');
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
    var action;
    if (!_aiGameHasGenerated) {
        action = 'generate';
    } else {
        var activeTab = document.querySelector('#aiGameTabBar .add-topic-tab.active');
        var tab = activeTab ? activeTab.dataset.tab : 'ai-content';
        if (tab === 'ai-game')  action = 'regen-game';
        else if (tab === 'ai-cats') action = 'regen-cats';
        else action = 'regen-all';
    }

    var genBtn = document.getElementById('aiGameGenerateBtn');
    if (genBtn) { genBtn.disabled = true; genBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating…'; }
    var submitBtn = document.getElementById('gameSubmitBtn');
    if (submitBtn) submitBtn.disabled = true;

    setTimeout(function() { _renderAIGameResults(action); }, 1200);
}

// ── Derive a brand/topic label from the user's actual inputs ─────────────────
function _deriveAIGameContext() {
    var prompt    = ((document.getElementById('aiGamePromptText')  || {}).value       || '').trim();
    var url       = ((document.getElementById('aiGameUrlInput')    || {}).value       || '').trim();
    var textBody  = ((document.getElementById('aiGameTextInput')   || {}).innerText   || '').trim();
    var fileLabel = ((document.getElementById('aiGameUploadPrompt')|| {}).textContent || '').trim();
    var hasFile   = fileLabel && fileLabel !== 'Drop a file or click to upload';

    // Extract brand from URL hostname (e.g. "https://weelee.co.za/" → "Weelee")
    var brand = '';
    if (url) {
        try {
            var host = url.replace(/https?:\/\//i, '').split('/')[0].replace(/^www\./i, '');
            brand = host.split('.')[0];
            brand = brand.charAt(0).toUpperCase() + brand.slice(1);
        } catch(e) {}
    }

    // Priority: explicit prompt → URL brand → file name → body text snippet
    var topic = prompt
        || (brand ? brand : '')
        || (hasFile ? fileLabel.replace(/\.[^.]+$/, '') : '')
        || (textBody.length > 3 ? textBody.split(/\s+/).slice(0, 5).join(' ') : '');

    // Capitalise first letter of each word for display
    function titleCase(str) {
        return str.replace(/\b\w/g, function(c) { return c.toUpperCase(); });
    }

    var displayTopic = topic ? titleCase(topic) : null;
    var displayBrand = brand || null;

    return { topic: displayTopic, brand: displayBrand, hasUrl: !!url, hasFile: hasFile, hasText: !!textBody };
}

// Build context-aware category names from a topic/brand string
function _contextCats(brand, suggestion) {
    if (!brand) return suggestion.categories;
    var templates = [
        brand + ' Overview',
        brand + ' Products & Services',
        brand + ' Processes',
        brand + ' Customer Experience',
        brand + ' Compliance'
    ];
    return suggestion.categories.map(function(cat, i) {
        return { name: templates[i] || cat.name, questions: cat.questions };
    });
}

function _buildAICatsHtml(cats) {
    if (!cats.length) {
        return '<p style="color:#6b7280;font-size:0.85rem;padding:12px 0">No categories generated — toggle "Generate with categories &amp; questions" to include them.</p>';
    }
    var items = cats.map(function(cat) {
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
    return '<div class="ai-sub-list">' + items + '</div>';
}

function _renderAIGameResults(action) {
    var gamePaneEl = document.getElementById('aiGameTabPaneGame');
    var catsPaneEl = document.getElementById('aiGameTabPaneCats');
    if (!gamePaneEl) return;

    // ── Derive context from the user's actual inputs ───────────────────────
    var ctx = _deriveAIGameContext();

    var namePair = nextGameAISuggestion();
    if (window._aiGamePendingTopic && window._aiGamePendingTopic.name) {
        // Linked topic always wins
        namePair = {
            name: window._aiGamePendingTopic.name,
            description: window._aiGamePendingTopic.description || namePair.description
        };
    } else if (ctx.topic) {
        // Shape name & description from what the user actually provided
        namePair = {
            name: ctx.topic + ' Knowledge Challenge',
            description: 'Test your knowledge of ' + ctx.topic + '.'
        };
    }

    var suggestion = _GAME_AI_SUGGESTIONS[_aiGameGenerateIdx % _GAME_AI_SUGGESTIONS.length];
    _aiGameGenerateIdx++;

    var topicCover = (window._aiGamePendingTopic && window._aiGamePendingTopic.cover) || '';

    // ── Category logic ─────────────────────────────────────────────────────
    var includeCatsEl = document.getElementById('aiGameIncludeCats');
    var includeCats = !includeCatsEl || includeCatsEl.checked;
    var topicSubs = (window._aiGamePendingTopic && window._aiGamePendingTopic.subTopics) || [];
    var cats;
    if (!includeCats) {
        cats = [];
    } else if (topicSubs.length) {
        cats = topicSubs.map(function(sub, idx) {
            var mockCat = suggestion.categories[idx % suggestion.categories.length];
            return { name: sub.name, questions: mockCat.questions };
        });
    } else {
        // Use context-aware category names if we have a brand/topic
        cats = ctx.brand ? _contextCats(ctx.brand, suggestion) : suggestion.categories;
    }
    var catCount = cats.length;

    // ── Rebuild panes based on action ──────────────────────────────────────
    if (action !== 'regen-cats') {
        // Rebuild the Game pane
        var attemptsHtml =
            '<div class="form-group">' +
                '<label>Max attempts</label>' +
                '<div class="number-stepper">' +
                    '<button type="button" class="stepper-btn" onclick="stepGameAttempts(-1,\'aiGameMaxAttempts\')"><i class="fas fa-minus"></i></button>' +
                    '<input type="number" name="maxAttempts" id="aiGameMaxAttempts" value="1" min="1" max="99">' +
                    '<button type="button" class="stepper-btn" onclick="stepGameAttempts(1,\'aiGameMaxAttempts\')"><i class="fas fa-plus"></i></button>' +
                '</div>' +
            '</div>';
        gamePaneEl.innerHTML =
            '<div class="form-group"><label>Cover Image</label>' + gameCoverPickerHtml(topicCover || '') + '</div>' +
            '<div class="form-group"><label>Game Name</label><input type="text" name="name" value="' + escapeAttr(namePair.name) + '" placeholder="Game name"></div>' +
            '<div class="form-group"><label>Description</label><textarea name="description" rows="3">' + escapeAttr(namePair.description) + '</textarea></div>' +
            attemptsHtml;
    }

    if (action !== 'regen-game') {
        // Rebuild the Categories pane
        if (catsPaneEl) catsPaneEl.innerHTML = _buildAICatsHtml(cats);

        // Show/hide + badge the Categories tab
        var catsTab = document.getElementById('aiGameCatsTab');
        if (catsTab) {
            if (catCount > 0) {
                catsTab.classList.remove('hidden');
                catsTab.disabled = false;
                catsTab.innerHTML = '<i class="fas fa-list-ol"></i> Categories <span class="tab-badge">' + catCount + '</span>';
            } else {
                catsTab.classList.add('hidden');
                catsTab.disabled = true;
            }
        }
    }

    // Enable Game tab; on first generate switch to it
    var gameTab = document.getElementById('aiGameGameTab');
    if (gameTab) gameTab.disabled = false;
    if (!_aiGameHasGenerated) switchAIGameTab('ai-game');

    _aiGameHasGenerated = true;
    updateAIGameGenBtnLabel();

    var genBtn = document.getElementById('aiGameGenerateBtn');
    if (genBtn) genBtn.disabled = false;
    var submitBtn = document.getElementById('gameSubmitBtn');
    if (submitBtn) { submitBtn.classList.remove('hidden'); submitBtn.disabled = false; submitBtn.textContent = 'Create Game'; }

    var ck = (_currentGameScope && _currentGameScope.companyKey) || '';
    _gameAiCreditsUsed[ck] = (_gameAiCreditsUsed[ck] || 0) + 1;
    try {
        var _sc = JSON.parse(localStorage.getItem('gameon.aiCredits') || '{}');
        _sc[ck] = _gameAiCreditsUsed[ck];
        localStorage.setItem('gameon.aiCredits', JSON.stringify(_sc));
    } catch(e) {}
    updateGameScopeCreditsDisplay();
}

function switchAIGameTab(tab) {
    var tabBtns = document.querySelectorAll('#aiGameTabBar .add-topic-tab');
    tabBtns.forEach(function(t) { t.classList.toggle('active', t.dataset.tab === tab); });
    var paneMap = { 'ai-content': 'Content', 'ai-game': 'Game', 'ai-cats': 'Cats' };
    Object.keys(paneMap).forEach(function(p) {
        var el = document.getElementById('aiGameTabPane' + paneMap[p]);
        if (el) el.classList.toggle('hidden', p !== tab);
    });
    updateAIGameGenBtnLabel();
}

function updateAIGameGenBtnLabel() {
    var genBtn   = document.getElementById('aiGameGenerateBtn');
    var promptEl = document.getElementById('aiGamePromptText');
    if (!genBtn) return;
    if (!_aiGameHasGenerated) {
        genBtn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> Generate Game';
        if (promptEl) promptEl.placeholder = 'What game would you like to create today?';
        return;
    }
    var activeTab = document.querySelector('#aiGameTabBar .add-topic-tab.active');
    var tab = activeTab ? activeTab.dataset.tab : 'ai-content';
    if (tab === 'ai-game') {
        genBtn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> Regenerate Game';
        if (promptEl) { promptEl.placeholder = 'What would you like to change?'; promptEl.value = ''; }
    } else if (tab === 'ai-cats') {
        genBtn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> Regenerate Categories';
        if (promptEl) { promptEl.placeholder = 'What would you like to change?'; promptEl.value = ''; }
    } else {
        genBtn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> Regenerate';
        if (promptEl) promptEl.placeholder = 'What game would you like to create today?';
    }
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

        // Route to AI generate flow or manual add depending on the toggle selection
        if (pending.gameFlow === 'ai') {
            addGameAI();
            return;
        }

        addGame();
        setTimeout(function() {
            if (!pending.topicName) return;
            var topicSel = document.getElementById('addGameTopic');
            if (!topicSel) return;

            // Find existing option by display text
            var targetOpt = null;
            for (var i = 0; i < topicSel.options.length; i++) {
                if (topicSel.options[i].text === pending.topicName) {
                    targetOpt = topicSel.options[i];
                    break;
                }
            }

            // Not in list — inject it so it always lands in the dropdown, never the Name field
            if (!targetOpt) {
                targetOpt = document.createElement('option');
                targetOpt.value = JSON.stringify({
                    name: pending.topicName,
                    description: pending.topicDesc || '',
                    cover: pending.topicCover || '',
                    subTopics: []
                });
                targetOpt.textContent = pending.topicName;
                topicSel.insertBefore(targetOpt, topicSel.options[1] || null);
            }

            topicSel.value = targetOpt.value;
            onAddGameTopicChange(topicSel);
        }, 0);
    } catch(e) {}
}

