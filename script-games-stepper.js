// =============================================================================
// Games Add — 3-step stepper for index-games.html
//
// Wraps addGame() so clicking "Add Game" on the regular Games page shows the
// same Game → Questions → Share stepper as Games v2.
// Must load AFTER script-games.js.
// =============================================================================

(function () {

    var _gsStep          = 1;
    var _GS_TOTAL_STEPS  = 3;
    var _gsSavedGameId   = null;
    var _gsSavedGameName = null;
    var _gsSavedGameRow  = null;
    var _gsSavedCatId    = null;   // category created when question form first opens
    var _gsSelectedQType = null;   // last question type the user picked (for re-select)
    var _gsShareGameId   = null;   // game id at the moment the share step opens
    var _gsOrigBackToQTypePicker = null; // stashed original so cancel can restore it

    var _GS_QTYPES = [
        { key: 'mcq',         icon: 'fa-circle-question', title: 'Multiple Choice'    },
        { key: 'fill-blank',  icon: 'fa-pen',             title: 'Fill in the Blanks' },
        { key: 'stmt-blank',  icon: 'fa-pen-to-square',   title: 'Statement Blanking'  },
        { key: 'select-img',  icon: 'fa-image',           title: 'Select on Image'     },
        { key: 'match-terms', icon: 'fa-link',            title: 'Match the Terms'     },
        { key: 'word-bucket', icon: 'fa-bucket',          title: 'Word Bucket'         },
        { key: 'crossword',   icon: 'fa-border-all',      title: 'Crossword'           }
    ];

    // ── Override addGame ──────────────────────────────────────────────────────
    window.addGame = function () { _gsManualFlow(); };

    function _gsManualFlow() {
        _gsStep          = 1;
        _gsSavedGameId   = null;
        _gsSavedGameName = null;
        _gsSavedGameRow  = null;
        _gsSavedCatId    = null;
        _gsSelectedQType = null;
        _gsRestoreBackToQTypePicker();

        window._gameAddCats   = [];
        window._editingCatIdx = null;
        window._isGameAddMode = true;
        window._isAIGameFlow  = false;
        window._gameEditRow   = null;
        window._gameEditType  = 'game';

        document.getElementById('gameEditTitle').textContent    = 'Add Game';
        document.getElementById('gameEditSubtitle').textContent = getGamesScopeSubtitle();
        document.getElementById('gameEditFields').innerHTML     = _gsStepperHtml();

        // setGamePanelMode MUST come before the custom action bar so it can't
        // overwrite our buttons.
        setGamePanelMode('add');
        _gsSetActions(1);
        showGameEdit();
    }

    // ── Stepper HTML ──────────────────────────────────────────────────────────
    function _gsStepperHtml() {
        var labels = ['Game Setup', 'Content', 'Share'];
        var html = '<div class="add-stepper" id="gsStepper">';
        labels.forEach(function (label, i) {
            if (i > 0) html += '<div class="add-step-connector"></div>';
            html +=
                '<div class="add-step' + (i === 0 ? ' active' : '') + '" data-step="' + (i + 1) + '" onclick="gsStepClick(' + (i + 1) + ')">' +
                    '<span class="add-step-num">' + (i + 1) + '</span>' +
                    '<span class="add-step-label">' + label + '</span>' +
                '</div>';
        });
        html += '</div>';
        html += '<div class="add-step-pane"         id="gsPane1">' + _gsPane1Html() + '</div>';
        html += '<div class="add-step-pane hidden"   id="gsPane2">' + _gsPane2Html() + '</div>';
        html += '<div class="add-step-pane hidden"   id="gsPane3"></div>';
        return html;
    }

    // ── Step 1: game details ──────────────────────────────────────────────────
    // extraConfigHtml — optional HTML injected at the bottom of the Configure block.
    // Used by the AI flow to add the AI Model picker inside Configure.
    function _gsPane1Html(extraConfigHtml) {
        var topicOpts = typeof getAIGameTopicOptions === 'function'
            ? (getAIGameTopicOptions() || '')
            : '';
        return [
            '<div class="form-group">',
            '  <label>Cover image</label>',
            '  ' + gameCoverPickerHtml(GAME_COVER_PRESETS[0]),
            '</div>',
            '<div class="form-group">',
            '  <label for="addGameTopic">Topic</label>',
            '  <select id="addGameTopic" class="ai-model-select" onchange="onAddGameTopicChange(this)">',
            '    <option value="">Select a topic</option>',
            '    ' + topicOpts,
            '  </select>',
            '</div>',
            '<div class="form-group">',
            '  <label>Game name <span class="required-mark">*</span></label>',
            '  <input type="text" id="addGameName" placeholder="Game name" oninput="gsUpdateStepAccess()">',
            '</div>',
            '<div class="form-group">',
            '  <label>Description</label>',
            '  <textarea id="addGameDesc" rows="3" placeholder="What will players learn?"></textarea>',
            '</div>',
            '<div class="add-game-advanced">',
            '  <button type="button" class="add-game-advanced-toggle"',
            '      onclick="toggleAddGameAdvanced(this)" data-body="addGameAdvancedBody">',
            '    Configure <i class="fas fa-chevron-down add-game-advanced-icon"></i>',
            '  </button>',
            '  <div class="add-game-advanced-body hidden" id="addGameAdvancedBody">',
            '    <div class="configure-grid">',
            '      <div class="form-group"><label>Max attempts</label>',
            '        <input type="number" id="addGameMaxAttempts" placeholder="e.g. 3" min="1" max="99"></div>',
            '      <div class="form-group"><label>Questions for this game</label>',
            '        <input type="number" id="addGameQPerSession" value="5" min="1" max="100"></div>',
            '      <div class="form-group"><label>Pass Threshold (%)</label>',
            '        <input type="number" id="addGamePassThreshold" placeholder="e.g. 60" min="0" max="100"></div>',
            (extraConfigHtml || ''),
            '    </div>',
            '  </div>',
            '</div>'
        ].join('\n');
    }

    // ── Step 2: question type picker ──────────────────────────────────────────
    function _gsPane2Html() {
        var cards = _GS_QTYPES.map(function (t) {
            return (
                '<button type="button" class="q-type-card" data-qtype="' + t.key + '" onclick="gsPickQType(this)">' +
                    '<span class="q-type-card-icon"><i class="fas ' + t.icon + '"></i></span>' +
                    '<span class="q-type-card-title">' + t.title + '</span>' +
                '</button>'
            );
        }).join('');
        return (
            '<p class="step-pane-lead">Choose the type of questions for this game:</p>' +
            '<div class="q-type-picker q-type-picker--sm" id="gsQTypePicker">' + cards + '</div>' +
            '<div id="gsImportBulkBar" class="gs-import-bulk-bar hidden">' +
                '<button type="button" class="btn btn-outline" onclick="gsImportBulk()">' +
                    '<i class="fas fa-file-import"></i> Import Bulk' +
                '</button>' +
            '</div>'
        );
    }

    // ── Step 3: share ─────────────────────────────────────────────────────────
    function _gsPopulatePane3() {
        var pane = document.getElementById('gsPane3');
        if (!pane || !_gsSavedGameRow) return;

        var name       = _gsSavedGameName || '';
        var companyKey = (_currentGameScope && _currentGameScope.companyKey) || '';
        var currentDept = (_currentGameScope && _currentGameScope.dept) || '';

        var gCompanies = (typeof GAMES_SIDEBAR_COMPANIES   !== 'undefined') ? GAMES_SIDEBAR_COMPANIES   : [];
        var gDepts     = (typeof GAMES_SIDEBAR_DEPARTMENTS !== 'undefined') ? GAMES_SIDEBAR_DEPARTMENTS : [];
        var company    = null;
        for (var ci = 0; ci < gCompanies.length; ci++) {
            if (gCompanies[ci].name.toLowerCase() === companyKey) { company = gCompanies[ci]; break; }
        }

        var allDepts = company
            ? gDepts.filter(function (d) { return d.companyId === company.id; })
            : [];

        var sharedNow = (typeof getGameSharedDepts === 'function')
            ? new Set(getGameSharedDepts(companyKey, name))
            : new Set();

        window._currentGameShareTarget = {
            name: name, row: _gsSavedGameRow,
            sharedDepts: Array.from(sharedNow), isNew: true,
            initialStart: '', initialEnd: ''
        };
        window._postShareCallback = null;

        var items = allDepts.map(function (d) {
            var precheck = sharedNow.has(d.name) || d.name === currentDept;
            return (
                '<label class="share-dept-item">' +
                    '<input type="checkbox" value="' + escapeAttr(d.name) + '"' + (precheck ? ' checked' : '') + '>' +
                    '<span class="share-dept-name">' + escapeAttr(d.name) + '</span>' +
                '</label>'
            );
        }).join('') || '<p class="share-empty">No departments to share with.</p>';

        pane.innerHTML =
            '<p class="step-pane-lead"><strong>' + escapeAttr(name) + '</strong></p>' +
            '<div class="share-dept-list" id="gameShareDeptList">' + items + '</div>';
    }

    // ── Action bar ────────────────────────────────────────────────────────────
    function _gsSetActions(step) {
        var actions = document.querySelector('#detailEdit .edit-actions');
        if (!actions) return;

        var cancelBtn = '<button type="button" class="btn btn-outline" onclick="gsCancelWithWarning()">Cancel</button>';
        var backBtn   = '<button type="button" class="btn btn-outline" onclick="gsGoBack()"><i class="fas fa-arrow-left"></i> Back</button>';

        if (step === 1) {
            actions.innerHTML =
                cancelBtn +
                '<button type="button" class="btn btn-primary" onclick="gsGoNext()">Next <i class="fas fa-arrow-right"></i></button>';
        } else if (step === 2) {
            actions.innerHTML =
                cancelBtn + backBtn +
                '<button type="button" class="btn btn-primary" id="gsNextBtn" onclick="gsSaveAndShare()" disabled>Next <i class="fas fa-arrow-right"></i></button>';
        } else {
            actions.innerHTML =
                cancelBtn + backBtn +
                '<button type="button" class="btn btn-primary" onclick="gsConfirmShare()">Share</button>';
        }
    }

    // ── Stepper navigation ────────────────────────────────────────────────────
    function _gsActivateStep(step) {
        document.querySelectorAll('#gsStepper .add-step').forEach(function (el) {
            var s = parseInt(el.dataset.step, 10);
            el.classList.toggle('active', s === step);
            el.classList.toggle('done',   s < step);
        });
        for (var i = 1; i <= _GS_TOTAL_STEPS; i++) {
            var pane = document.getElementById('gsPane' + i);
            if (pane) pane.classList.toggle('hidden', i !== step);
        }
        _gsSetActions(step);

        // When returning to step 2, re-enable Next if a type is already selected
        if (step === 2) {
            var selectedCard = document.querySelector('#gsQTypePicker .q-type-card.selected');
            var nextBtn = document.getElementById('gsNextBtn');
            if (selectedCard && nextBtn) nextBtn.disabled = false;
            var importBar = document.getElementById('gsImportBulkBar');
            if (importBar) importBar.classList.toggle('hidden', !selectedCard);
        }

        // Refresh which steps appear clickable
        _gsUpdateStepAccess();
    }

    window.gsGoNext = function () {
        if (_gsStep === 1) {
            var nameEl = document.getElementById('addGameName');
            if (!nameEl || !nameEl.value.trim()) {
                if (nameEl) { nameEl.classList.add('input-error'); nameEl.focus(); }
                return;
            }
            if (nameEl) nameEl.classList.remove('input-error');
        }
        _gsStep = Math.min(_GS_TOTAL_STEPS, _gsStep + 1);
        _gsActivateStep(_gsStep);
    };

    window.gsGoBack = function () {
        _gsStep = Math.max(1, _gsStep - 1);
        _gsActivateStep(_gsStep);
    };

    // Updates the gs-step-reachable class on future steps based on form state.
    // Step 2 becomes reachable once the game name is filled.
    // Called on every name keystroke and after every step change.
    function _gsUpdateStepAccess() {
        var nameEl  = document.getElementById('addGameName');
        var hasName = nameEl && nameEl.value.trim().length > 0;
        var step2El = document.querySelector('#gsStepper .add-step[data-step="2"]');
        if (step2El) step2El.classList.toggle('gs-step-reachable', hasName);
    }
    // Public wrapper — called by oninput on the name field; updates both steppers.
    window.gsUpdateStepAccess = function () {
        _gsUpdateStepAccess();
        _gsAIUpdateStepAccess();
    };

    // Click handler attached to each stepper dot.
    // Back navigation is always allowed; forward navigation validates current step.
    window.gsStepClick = function (n) {
        if (n === _gsStep) return; // already on this step

        // Step 1 is not navigable once the game has been saved
        if (n === 1 && _gsSavedGameId) return;

        if (n < _gsStep) {
            // Always allowed to go back
            _gsStep = n;
            _gsActivateStep(_gsStep);
            return;
        }

        // Step 3 is only reachable via the full save → questions flow, not by clicking
        if (n === 3) return;

        // Forward: validate and advance (same logic as the Next button)
        if (_gsStep === 1) {
            gsGoNext();         // validates name, advances to step 2
        } else if (_gsStep === 2) {
            gsSaveAndShare();   // validates type selection, saves game
        }
    };

    window.gsCancelWithWarning = function () {
        if (confirm('Cancel adding this game? Your changes will be lost.')) {
            _gsRestoreBackToQTypePicker();
            cancelGameEdit();
        }
    };

    // ── Question type selection ───────────────────────────────────────────────
    window.gsPickQType = function (btn) {
        document.querySelectorAll('#gsQTypePicker .q-type-card').forEach(function (c) {
            c.classList.remove('selected');
        });
        btn.classList.add('selected');
        _gsSelectedQType = btn.dataset.qtype;
        var nextBtn = document.getElementById('gsNextBtn');
        if (nextBtn) nextBtn.disabled = false;
        var importBar = document.getElementById('gsImportBulkBar');
        if (importBar) importBar.classList.remove('hidden');
    };

    window.gsImportBulk = function () {
        // Placeholder — wire to Excel/CSV import when backend is ready.
        alert('Bulk import coming soon.');
    };

    // ── Save game then open the Add Question form ─────────────────────────────
    window.gsSaveAndShare = function () {
        var typeCard = document.querySelector('#gsQTypePicker .q-type-card.selected');
        if (!typeCard) return;
        var questionType = typeCard.dataset.qtype;
        _gsSelectedQType = questionType;

        // If the game was already saved (user came back via "← Change type"),
        // just reopen the question form with the new type — no new game/category.
        if (_gsSavedGameId && _gsSavedCatId) {
            openAddQuestionForm(questionType, _gsSavedGameId, _gsSavedCatId);
            _gsSetupChangeTypeOverride();
            return;
        }

        var nameInput = document.getElementById('addGameName');
        var descInput = document.getElementById('addGameDesc');
        var name      = nameInput ? nameInput.value.trim() : '';
        var desc      = descInput ? descInput.value.trim() : '';

        if (!name) {
            _gsStep = 1;
            _gsActivateStep(1);
            var n2 = document.getElementById('addGameName');
            if (n2) { n2.classList.add('input-error'); n2.focus(); }
            return;
        }

        var cover         = readGameCoverPicker() || randomGameCover();
        var maxAttempts   = parseInt((document.getElementById('addGameMaxAttempts')   || {}).value, 10) || null;
        var qPerSession   = parseInt((document.getElementById('addGameQPerSession')   || {}).value, 10) || 5;
        var passThreshold = parseInt((document.getElementById('addGamePassThreshold') || {}).value, 10) || null;

        var tbody = document.querySelector('#gamesTable tbody');
        if (!tbody) return;

        var newId   = Date.now();
        var gameObj = {
            id: newId, name: name, description: desc, cover: cover,
            active: true, scheduledDate: null,
            maxAttempts: maxAttempts, qPerSession: qPerSession,
            passThreshold: passThreshold, questionType: questionType,
            categories: []
        };

        tbody.insertAdjacentHTML('beforeend', gameRowHtml(gameObj, newId));
        var gameRow = document.querySelector('tr.row-game[data-game="' + newId + '"]');
        if (gameRow) updateGameRowChips(gameRow);
        persistGamesScope();
        updateGamesCount(document.querySelectorAll('#gamesTable tbody tr.row-game'));
        showGameToast('"' + name + '" added');

        _gsSavedGameId   = newId;
        _gsSavedGameName = name;
        _gsSavedGameRow  = gameRow;

        // Open the Add Question form directly for the chosen type.
        _gsOpenQuestionForm(newId, name, questionType);
    };

    // ── Confirm share ─────────────────────────────────────────────────────────
    window.gsConfirmShare = function () {
        // Delegate department sharing to the shared helper.
        if (typeof confirmGameSharePanel === 'function') confirmGameSharePanel();

        // Apply schedule dates (confirmGameSharePanel doesn't read them).
        var startVal = (document.getElementById('scheduleStartDate') || {}).value || '';
        var endVal   = (document.getElementById('scheduleEndDate')   || {}).value || '';
        if (startVal || endVal) {
            // Re-query after confirmGameSharePanel may have refreshed rows.
            var targetRow = _gsShareGameId
                ? document.querySelector('tr.row-game[data-game="' + _gsShareGameId + '"]')
                : null;
            if (targetRow) {
                if (startVal) targetRow.dataset.scheduledDate    = startVal;
                if (endVal)   targetRow.dataset.scheduledEndDate = endVal;
                if (typeof updateGameRowChips === 'function') updateGameRowChips(targetRow);
                if (typeof persistGamesScope  === 'function') persistGamesScope();
                if (startVal && typeof showGameToast === 'function') {
                    showGameToast('Scheduled ' + startVal + (endVal ? ' → ' + endVal : ''));
                }
            }
        }
    };

    // ── Open question form ────────────────────────────────────────────────────
    function _gsOpenQuestionForm(gameId, gameName, questionType) {
        var gameRow = document.querySelector('tr.row-game[data-game="' + gameId + '"]');
        if (!gameRow) { showGameEmpty(); return; }

        var catId  = Date.now();
        var newCat = { id: catId, name: 'Category 1', description: '', questions: [] };
        var tbody  = document.querySelector('#gamesTable tbody');
        if (tbody) {
            gameRow.insertAdjacentHTML('afterend', catRowHtml(newCat, gameId, gameRow.dataset.cover || ''));
            updateGameRowChips(gameRow);
            persistGamesScope();
        }
        _gsSavedCatId = catId;   // remember so "← Change type" can reuse it
        openAddQuestionForm(questionType || 'mcq', gameId, catId);
        _gsSetupChangeTypeOverride();
    }

    // ── "← Change type" intercept ────────────────────────────────────────────
    // Replaces the global backToQTypePicker with one that rebuilds the stepper
    // at step 2 instead of showing the old large-card type picker.
    function _gsSetupChangeTypeOverride() {
        if (!_gsOrigBackToQTypePicker) {
            _gsOrigBackToQTypePicker = window.backToQTypePicker;
        }
        window.backToQTypePicker = function () {
            _gsGoBackToStep2();
        };
    }

    function _gsRestoreBackToQTypePicker() {
        if (_gsOrigBackToQTypePicker) {
            window.backToQTypePicker = _gsOrigBackToQTypePicker;
            _gsOrigBackToQTypePicker = null;
        }
    }

    // Rebuilds the stepper at step 2 (Upload) with the type picker visible
    // and the previously selected type pre-highlighted.
    function _gsGoBackToStep2() {
        _gsStep = 2;

        var labels = ['Game Setup', 'Content', 'Share'];
        var stepperHtml = '<div class="add-stepper" id="gsStepper">';
        labels.forEach(function (label, i) {
            if (i > 0) stepperHtml += '<div class="add-step-connector"></div>';
            // Step 1 is committed (game saved) — show as done but not clickable
            var cls     = (i === 0) ? ' done gs-step-committed' : (i === 1 ? ' active' : '');
            var onclick = (i === 0) ? '' : ' onclick="gsStepClick(' + (i + 1) + ')"';
            stepperHtml +=
                '<div class="add-step' + cls + '" data-step="' + (i + 1) + '"' + onclick + '>' +
                    '<span class="add-step-num">' + (i + 1) + '</span>' +
                    '<span class="add-step-label">' + label + '</span>' +
                '</div>';
        });
        stepperHtml += '</div>';

        document.getElementById('gameEditTitle').textContent    = 'Add Game';
        document.getElementById('gameEditSubtitle').textContent = getGamesScopeSubtitle();
        document.getElementById('gameEditFields').innerHTML =
            stepperHtml +
            '<div class="add-step-pane hidden" id="gsPane1"></div>' +
            '<div class="add-step-pane"        id="gsPane2">' + _gsPane2Html() + '</div>' +
            '<div class="add-step-pane hidden" id="gsPane3"></div>';

        setGamePanelMode('add');
        _gsSetActions(2);
        showGameEdit();

        // Re-select the type the user had previously chosen
        if (_gsSelectedQType) {
            var prevCard = document.querySelector(
                '#gsQTypePicker .q-type-card[data-qtype="' + _gsSelectedQType + '"]'
            );
            if (prevCard) {
                prevCard.classList.add('selected');
                var nextBtn = document.getElementById('gsNextBtn');
                if (nextBtn) nextBtn.disabled = false;
                var importBar = document.getElementById('gsImportBulkBar');
                if (importBar) importBar.classList.remove('hidden');
            }
        }

        // Re-install override for next time the user clicks "← Change type"
        _gsSetupChangeTypeOverride();
    }

    // ── Override _navigateToQuestionsPage so it goes to the v2 questions page ─
    // Tag the nav entry with returnTo:'index-games.html' so goBackToGames knows
    // which page to come back to.
    window._navigateToQuestionsPage = function (gameId, catId, openPicker) {
        try {
            localStorage.setItem('gameon.questionsNav', JSON.stringify({
                gameId:     String(gameId),
                catId:      String(catId),
                openPicker: !!openPicker,
                returnTo:   'index-games.html',
                companyKey: (_currentGameScope && _currentGameScope.companyKey) || '',
                dept:       (_currentGameScope && _currentGameScope.dept)       || ''
            }));
        } catch (e) {}
        window.location.href = 'index-questions-v2.html';
    };

    // ── Step 3 share panel — rebuilt inline after returning from questions page ─
    function _gsOpenShareStep(gameRow) {
        var name        = gameRow.dataset.name || '';
        var companyKey  = (_currentGameScope && _currentGameScope.companyKey) || '';
        var currentDept = (_currentGameScope && _currentGameScope.dept) || '';
        var existStart  = gameRow.dataset.scheduledDate    || '';
        var existEnd    = gameRow.dataset.scheduledEndDate || '';

        _gsShareGameId = gameRow.dataset.game || null;

        var gCompanies = (typeof GAMES_SIDEBAR_COMPANIES   !== 'undefined') ? GAMES_SIDEBAR_COMPANIES   : [];
        var gDepts     = (typeof GAMES_SIDEBAR_DEPARTMENTS !== 'undefined') ? GAMES_SIDEBAR_DEPARTMENTS : [];
        var company    = null;
        for (var ci = 0; ci < gCompanies.length; ci++) {
            if (gCompanies[ci].name.toLowerCase() === companyKey) { company = gCompanies[ci]; break; }
        }
        var allDepts  = company ? gDepts.filter(function (d) { return d.companyId === company.id; }) : [];
        var sharedNow = (typeof getGameSharedDepts === 'function')
            ? new Set(getGameSharedDepts(companyKey, name)) : new Set();

        window._currentGameShareTarget = {
            name: name, row: gameRow,
            sharedDepts: Array.from(sharedNow), isNew: true,
            initialStart: existStart, initialEnd: existEnd
        };
        window._postShareCallback = null;

        var items = allDepts.map(function (d) {
            var precheck = sharedNow.has(d.name) || d.name === currentDept;
            return (
                '<label class="share-dept-item">' +
                    '<input type="checkbox" value="' + escapeAttr(d.name) + '"' + (precheck ? ' checked' : '') + '>' +
                    '<span class="share-dept-name">' + escapeAttr(d.name) + '</span>' +
                '</label>'
            );
        }).join('') || '<p class="share-empty">No departments to share with.</p>';

        // Date range picker reusing the existing buildScheduleBodyHtml helper.
        var scheduleHtml = (typeof buildScheduleBodyHtml === 'function')
            ? buildScheduleBodyHtml(existStart, existEnd)
            : (
                '<div class="schedule-form">' +
                    '<div class="schedule-date-row">' +
                        '<div class="form-group">' +
                            '<label>Start date</label>' +
                            '<input type="date" id="scheduleStartDate" class="schedule-date-input"' +
                            (existStart ? ' value="' + escapeAttr(existStart) + '"' : '') + '>' +
                        '</div>' +
                        '<div class="form-group">' +
                            '<label>End date</label>' +
                            '<input type="date" id="scheduleEndDate" class="schedule-date-input"' +
                            (existEnd ? ' value="' + escapeAttr(existEnd) + '"' : '') + '>' +
                        '</div>' +
                    '</div>' +
                '</div>'
            );

        // Stepper with Game Setup + Upload done, Share active
        var labels = ['Game Setup', 'Content', 'Share'];
        var stepperHtml = '<div class="add-stepper">';
        labels.forEach(function (label, i) {
            if (i > 0) stepperHtml += '<div class="add-step-connector"></div>';
            var cls = i < 2 ? ' done' : ' active';
            stepperHtml +=
                '<div class="add-step' + cls + '" data-step="' + (i + 1) + '">' +
                    '<span class="add-step-num">' + (i + 1) + '</span>' +
                    '<span class="add-step-label">' + label + '</span>' +
                '</div>';
        });
        stepperHtml += '</div>';

        document.getElementById('gameEditBadge').innerHTML      = '<i class="fas fa-plus"></i> Adding';
        document.getElementById('gameEditTitle').textContent    = 'Add Game';
        document.getElementById('gameEditSubtitle').textContent = getGamesScopeSubtitle();
        document.getElementById('gameEditFields').innerHTML =
            stepperHtml +
            '<div class="add-step-pane">' +
                '<p class="step-pane-lead"><strong>' + escapeAttr(name) + '</strong></p>' +
                '<div class="share-dept-list" id="gameShareDeptList">' + items + '</div>' +
                scheduleHtml +
            '</div>';

        // setGamePanelMode MUST run before we write the action bar — it checks
        // for #gameSubmitBtn and restores the default "Create Game" submit button
        // if it is missing, which would overwrite our custom Share button.
        setGamePanelMode('add');
        showGameEdit();

        var actions = document.querySelector('#detailEdit .edit-actions');
        if (actions) {
            actions.innerHTML =
                '<button type="button" class="btn btn-outline" onclick="cancelGameEdit()">Cancel</button>' +
                '<button type="button" class="btn btn-primary" onclick="gsConfirmShare()">Share</button>';
        }
    }

    // ==========================================================================
    // AI 4-step stepper — "Generate with AI" on index-games.html
    // Steps: Game Setup → Upload → Review → Share
    // ==========================================================================

    var _gsAIStep      = 1;
    var _GS_AI_TOTAL   = 4;
    var _gsAIGameId    = null;
    var _gsAIGameName  = null;
    var _gsAIGameRow   = null;
    var _gsAIGenerated = false;
    var _gsRegenIdx    = 0;   // cycles through extra question pool on each regeneration

    window.addGameAI = function () { _gsAIManualFlow(); };

    function _gsAIManualFlow() {
        _gsAIStep      = 1;
        _gsAIGameId    = null;
        _gsAIGameName  = null;
        _gsAIGameRow   = null;
        _gsAIGenerated = false;
        _gsSelectedQType = null;
        _gsRegenIdx    = 0;

        window._gameAddCats   = [];
        window._editingCatIdx = null;
        window._isGameAddMode = true;
        window._isAIGameFlow  = true;
        window._gameEditRow   = null;
        window._gameEditType  = 'game';

        var badge = document.getElementById('gameEditBadge');
        if (badge) {
            badge.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> AI';
            badge.classList.add('badge-ai');
        }

        document.getElementById('gameEditTitle').textContent    = 'Add Game';
        document.getElementById('gameEditSubtitle').textContent = getGamesScopeSubtitle();
        document.getElementById('gameEditFields').innerHTML     = _gsAIStepperHtml();

        setGamePanelMode('add');
        _gsAISetActions(1);
        showGameEdit();
    }

    // ── 4-step stepper HTML ───────────────────────────────────────────────────
    function _gsAIStepperHtml() {
        var labels = ['Game Setup', 'Content', 'Review', 'Share'];
        var html = '<div class="add-stepper gs-ai-stepper" id="gsAIStepper">';
        labels.forEach(function (label, i) {
            if (i > 0) html += '<div class="add-step-connector"></div>';
            html +=
                '<div class="add-step' + (i === 0 ? ' active' : '') + '" data-step="' + (i + 1) + '" onclick="gsAIStepClick(' + (i + 1) + ')">' +
                    '<span class="add-step-num">' + (i + 1) + '</span>' +
                    '<span class="add-step-label">' + label + '</span>' +
                '</div>';
        });
        html += '</div>';
        // Step 1 pane: same as regular flow but with AI Model as 4th Configure cell + credit estimate
        html += '<div class="add-step-pane"        id="gsAIPane1">' + _gsPane1Html(_gsAIModelPickerHtml()) + _gsCreditEstimateHtml() + '</div>';
        html += '<div class="add-step-pane hidden"  id="gsAIPane2">' + _gsAIPane2Html() + '</div>';
        html += '<div class="add-step-pane hidden"  id="gsAIPane3"></div>';
        html += '<div class="add-step-pane hidden"  id="gsAIPane4"></div>';
        return html;
    }

    // ── AI Model picker HTML — injected into Configure on step 1 ─────────────
    function _gsAIModelPickerHtml() {
        // Returns a 4th grid cell — sits flush alongside Max attempts / Questions / Pass Threshold
        return [
            '      <div class="form-group">',
            '        <label for="gsAIModel">AI Model</label>',
            '        <select id="gsAIModel" class="ai-model-select" onchange="gsAIUpdateCreditEstimate()">',
            '          <option value="claude-sonnet-4-6" selected>Claude Sonnet 4.6 — Recommended</option>',
            '          <option value="claude-opus-4-7">Claude Opus 4.7 — Most capable</option>',
            '          <option value="claude-haiku-4-5">Claude Haiku 4.5 — Fastest</option>',
            '          <option value="gpt-4o">GPT-4o</option>',
            '          <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>',
            '        </select>',
            '      </div>'
        ].join('\n');
    }

    // ── Credit estimate chip + dynamic cost calculation ──────────────────────
    var _GS_AI_MODEL_CREDITS = {
        'claude-sonnet-4-6': 50,
        'claude-opus-4-7':   150,
        'claude-haiku-4-5':  20,
        'gpt-4o':            75,
        'gemini-1.5-pro':    40
    };
    var _GS_AI_QTYPE_MULT = {
        'mcq':         1.0,
        'fill-blank':  1.2,
        'stmt-blank':  1.2,
        'select-img':  1.5,
        'match-terms': 1.3,
        'word-bucket': 1.4,
        'crossword':   2.0
    };

    function _gsCreditEstimateHtml() {
        return '<div class="gs-credit-estimate">' +
            '<i class="fas fa-coins"></i> ' +
            'Estimated cost: <strong class="gs-credit-estimate-value">~0 credits</strong>' +
        '</div>';
    }

    // Updates every visible .gs-credit-estimate-value from current model + type selection.
    // Shows 0 until a question type is chosen (no type = no cost estimate).
    window.gsAIUpdateCreditEstimate = function () {
        var modelEl = document.getElementById('gsAIModel');
        var model   = modelEl ? modelEl.value : 'claude-sonnet-4-6';
        var base    = _GS_AI_MODEL_CREDITS[model] || 50;
        var mult    = _gsSelectedQType ? (_GS_AI_QTYPE_MULT[_gsSelectedQType] || 1.0) : 0;
        var est     = Math.round(base * mult);
        document.querySelectorAll('.gs-credit-estimate-value').forEach(function (el) {
            el.textContent = '~' + est + ' credits';
        });
    };

    // ── Step 2: Question type picker — matches the manual flow + credit estimate ─
    function _gsAIPane2Html() {
        var cards = _GS_QTYPES.map(function (t) {
            return (
                '<button type="button" class="q-type-card" data-qtype="' + t.key + '" onclick="gsAIPickQType(this)">' +
                    '<span class="q-type-card-icon"><i class="fas ' + t.icon + '"></i></span>' +
                    '<span class="q-type-card-title">' + t.title + '</span>' +
                '</button>'
            );
        }).join('');
        return (
            '<p class="step-pane-lead">Choose the type of questions for this game:</p>' +
            '<div class="q-type-picker q-type-picker--sm" id="gsAIQTypePicker">' + cards + '</div>' +
            '<div id="gsAIImportBulkBar" class="gs-import-bulk-bar hidden">' +
                '<button type="button" class="btn btn-outline" onclick="gsImportBulk()">' +
                    '<i class="fas fa-file-import"></i> Import Bulk' +
                '</button>' +
            '</div>' +
            _gsCreditEstimateHtml()
        );
    }

    // ── Step 3: Upload + Generate ─────────────────────────────────────────────
    function _gsAIPane3Html() {
        return [
            '<div class="form-group">',
            '  <label>Upload file <span class="form-label-optional">(optional)</span></label>',
            '  <div class="ai-upload-zone" id="gsAIUploadZone"',
            '      onclick="document.getElementById(\'gsAIFileInput\').click()"',
            '      ondragover="event.preventDefault();this.classList.add(\'drag-over\')"',
            '      ondragleave="this.classList.remove(\'drag-over\')"',
            '      ondrop="gsAIFileDrop(this,event)">',
            '    <input type="file" id="gsAIFileInput" hidden accept=".pdf,.docx,.xlsx,.png,.jpeg,.jpg" onchange="gsAIFileChange(this)">',
            '    <i class="fas fa-cloud-upload-alt ai-upload-icon"></i>',
            '    <span class="ai-upload-prompt" id="gsAIUploadPrompt">Drop a file or click to upload</span>',
            '  </div>',
            '</div>',
            '<div class="form-group">',
            '  <label>URL <span class="form-label-optional">(optional)</span></label>',
            '  <input type="url" id="gsAIUrl" class="ai-text-input" placeholder="https://…">',
            '</div>',
            '<div class="form-group">',
            '  <label>Text <span class="form-label-optional">(optional)</span></label>',
            '  <div id="gsAIText" class="ai-rte" contenteditable="true"',
            '      data-placeholder="Paste text, notes, or reference material…"></div>',
            '</div>',
            '<div class="ai-generate-block">',
            '  <div class="form-group">',
            '    <input type="text" class="ai-text-input" id="gsAIPrompt"',
            '        placeholder="What game would you like to create today?">',
            '  </div>',
            '  <button type="button" class="btn btn-ai btn-full" id="gsAIGenerateBtn" onclick="gsAIGenerate()">',
            '    <i class="fas fa-wand-magic-sparkles"></i> Generate',
            '  </button>',
            '</div>',
            _gsCreditEstimateHtml()
        ].join('\n');
    }

    // ── AI question type selection (AI flow) ──────────────────────────────────
    window.gsAIPickQType = function (btn) {
        document.querySelectorAll('#gsAIQTypePicker .q-type-card').forEach(function (c) {
            c.classList.remove('selected');
        });
        btn.classList.add('selected');
        _gsSelectedQType = btn.dataset.qtype;
        var nextBtn = document.getElementById('gsAINextBtn');
        if (nextBtn) nextBtn.disabled = false;
        var importBar = document.getElementById('gsAIImportBulkBar');
        if (importBar) importBar.classList.remove('hidden');
        gsAIUpdateCreditEstimate();
    };

    // ── Action bar ────────────────────────────────────────────────────────────
    function _gsAISetActions(step) {
        var actions = document.querySelector('#detailEdit .edit-actions');
        if (!actions) return;

        var cancelBtn = '<button type="button" class="btn btn-outline" onclick="gsCancelWithWarning()">Cancel</button>';
        var backBtn   = '<button type="button" class="btn btn-outline" onclick="gsAIGoBack()"><i class="fas fa-arrow-left"></i> Back</button>';

        if (step === 1) {
            actions.innerHTML = cancelBtn +
                '<button type="button" class="btn btn-primary" onclick="gsAIGoNext()">Next <i class="fas fa-arrow-right"></i></button>';
        } else if (step === 2) {
            actions.innerHTML = cancelBtn + backBtn +
                '<button type="button" class="btn btn-ai" id="gsAINextBtn" onclick="gsAIGoNext()" disabled><i class="fas fa-wand-magic-sparkles"></i> Generate</button>';
        } else if (step === 3) {
            // Step 3 is only ever reached after generation completes
            actions.innerHTML = cancelBtn + backBtn +
                '<button type="button" class="btn btn-primary" onclick="gsAIGoNext()">Next <i class="fas fa-arrow-right"></i></button>';
        } else {
            actions.innerHTML =
                cancelBtn +
                '<button type="button" class="btn btn-primary" onclick="gsAIConfirmShare()">Share</button>';
        }
    }

    // ── Stepper dot state ─────────────────────────────────────────────────────
    function _gsAIActivateStep(step) {
        document.querySelectorAll('#gsAIStepper .add-step').forEach(function (el) {
            var s = parseInt(el.dataset.step, 10);
            el.classList.toggle('active', s === step);
            el.classList.toggle('done',   s < step);
        });
        for (var i = 1; i <= _GS_AI_TOTAL; i++) {
            var pane = document.getElementById('gsAIPane' + i);
            if (pane) pane.classList.toggle('hidden', i !== step);
        }
        _gsAISetActions(step);

        // Restore step 2 type-picker state when navigating back to it
        if (step === 2) {
            var selectedCard = document.querySelector('#gsAIQTypePicker .q-type-card.selected');
            var aiNextBtn = document.getElementById('gsAINextBtn');
            if (selectedCard && aiNextBtn) aiNextBtn.disabled = false;
            var importBar = document.getElementById('gsAIImportBulkBar');
            if (importBar) importBar.classList.toggle('hidden', !selectedCard);
        }

        // Sync credit estimate text whenever we enter a pane that has one
        if (typeof window.gsAIUpdateCreditEstimate === 'function') window.gsAIUpdateCreditEstimate();
        _gsAIUpdateStepAccess();
    }

    function _gsAIUpdateStepAccess() {
        var nameEl  = document.getElementById('addGameName');
        var hasName = nameEl && nameEl.value.trim().length > 0;

        var step2El = document.querySelector('#gsAIStepper .add-step[data-step="2"]');
        if (step2El) step2El.classList.toggle('gs-step-reachable', hasName);

        // Step 3 (Upload) reachable once a question type has been selected
        var hasQType = !!_gsSelectedQType || !!document.querySelector('#gsAIQTypePicker .q-type-card.selected');
        var step3El = document.querySelector('#gsAIStepper .add-step[data-step="3"]');
        if (step3El) step3El.classList.toggle('gs-step-reachable', hasQType);

        // Step 4 (Share) reachable once generation has completed
        var step4El = document.querySelector('#gsAIStepper .add-step[data-step="4"]');
        if (step4El) step4El.classList.toggle('gs-step-reachable', _gsAIGenerated);
    }

    // ── Navigation ────────────────────────────────────────────────────────────
    window.gsAIGoNext = function () {
        if (_gsAIStep === 1) {
            var nameEl = document.getElementById('addGameName');
            if (!nameEl || !nameEl.value.trim()) {
                if (nameEl) { nameEl.classList.add('input-error'); nameEl.focus(); }
                return;
            }
            if (nameEl) nameEl.classList.remove('input-error');
            _gsAIStep = 2;
            _gsAIActivateStep(2);
        } else if (_gsAIStep === 2) {
            var typeCard = document.querySelector('#gsAIQTypePicker .q-type-card.selected');
            if (!typeCard) return;
            // Trigger AI generation: show spinner on the Next button, then load step 3
            var aiNextBtn = document.getElementById('gsAINextBtn');
            if (aiNextBtn) {
                aiNextBtn.disabled = true;
                aiNextBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating…';
            }
            setTimeout(function () {
                _gsAIGenerated = true;
                _gsAIBuildReviewPane();
                _gsAIStep = 3;
                _gsAIActivateStep(3);
            }, 2000);
        } else if (_gsAIStep === 3) {
            _gsAISaveAndOpenShare();
        }
    };

    window.gsAIGoBack = function () {
        _gsAIStep = Math.max(1, _gsAIStep - 1);
        _gsAIActivateStep(_gsAIStep);
    };

    window.gsAIStepClick = function (n) {
        if (n === _gsAIStep) return;

        if (n < _gsAIStep) {
            _gsAIStep = n;
            _gsAIActivateStep(n);
            return;
        }

        // Forward navigation — delegate to gsAIGoNext so validation is centralised
        if (_gsAIStep === 1 && n >= 2) {
            gsAIGoNext();                           // validate name → step 2
        } else if (_gsAIStep === 2 && n >= 3) {
            gsAIGoNext();                           // validate type selected → step 3
        } else if (_gsAIStep === 3 && n === 4) {
            gsAIGoNext();                           // save game + open share
        }
    };

    // ── Generate (simulated) ──────────────────────────────────────────────────
    window.gsAIGenerate = function () {
        var btn = document.getElementById('gsAIGenerateBtn');
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating…';
        }
        setTimeout(function () {
            _gsAIGenerated = true;
            _gsAIBuildReviewPane();
            _gsAIStep = 3;
            _gsAIActivateStep(3);
        }, 2000);
    };

    // Mock MCQ data used by the review pane (placeholder until real AI generation)
    var _GS_MOCK_QUESTIONS = [
        {
            text: 'What is the most important step before starting any new task?',
            answers: [
                { text: 'Review the relevant safety and compliance guidelines', correct: true },
                { text: 'Notify your manager that you are starting', correct: false },
                { text: 'Update your task tracker immediately', correct: false },
                { text: 'Gather all required tools first', correct: false }
            ]
        },
        {
            text: 'Which document should be consulted for escalation procedures?',
            answers: [
                { text: 'The Standard Operating Procedure (SOP) for your department', correct: true },
                { text: 'The company org chart', correct: false },
                { text: 'The employee handbook cover page', correct: false },
                { text: 'The weekly meeting notes', correct: false }
            ]
        },
        {
            text: 'How often should compliance training be completed?',
            answers: [
                { text: 'Annually, or as required by applicable regulation', correct: true },
                { text: 'Only when onboarding new employees', correct: false },
                { text: 'Every five years', correct: false },
                { text: 'Whenever a manager requests it', correct: false }
            ]
        },
        {
            text: 'What action should be taken if you discover a potential policy violation?',
            answers: [
                { text: 'Report it to the compliance officer or appropriate team immediately', correct: true },
                { text: 'Wait to see if anyone else notices', correct: false },
                { text: 'Document it and raise it at the next quarterly meeting', correct: false },
                { text: 'Resolve it yourself without escalating', correct: false }
            ]
        },
        {
            text: 'Which of the following best describes the purpose of a knowledge check?',
            answers: [
                { text: 'To reinforce understanding and surface knowledge gaps', correct: true },
                { text: 'To rank employees by performance score', correct: false },
                { text: 'To replace formal performance reviews', correct: false },
                { text: 'To determine salary adjustments', correct: false }
            ]
        }
    ];

    // Extra question pool drawn from during regeneration
    var _GS_MOCK_QUESTIONS_EXTRA = [
        {
            text: 'What is the recommended way to handle confidential information?',
            answers: [
                { text: 'Store it securely and only share with authorised personnel', correct: true },
                { text: 'Email it to relevant team members for transparency', correct: false },
                { text: 'Keep a printed copy at your desk for easy access', correct: false },
                { text: 'Share it on the company intranet for visibility', correct: false }
            ]
        },
        {
            text: 'Which of the following is a sign of a phishing attempt?',
            answers: [
                { text: 'An urgent request for personal credentials from an unknown sender', correct: true },
                { text: 'A meeting invitation from your manager', correct: false },
                { text: 'A scheduled system maintenance notification', correct: false },
                { text: 'A password reset email you requested yourself', correct: false }
            ]
        },
        {
            text: 'What should you do if you are unsure whether an action complies with policy?',
            answers: [
                { text: 'Consult your manager or the compliance team before proceeding', correct: true },
                { text: 'Proceed if no one else has raised concerns about it', correct: false },
                { text: 'Check if a colleague has done the same thing before', correct: false },
                { text: 'Wait until the next training session for clarification', correct: false }
            ]
        },
        {
            text: 'How should workplace incidents be reported in your organisation?',
            answers: [
                { text: 'Through the official incident reporting system as soon as possible', correct: true },
                { text: 'Via a casual conversation with a senior employee', correct: false },
                { text: 'Only if the incident caused significant damage', correct: false },
                { text: 'At the end of the working week in a summary email', correct: false }
            ]
        },
        {
            text: 'What is the primary goal of continuous learning in the workplace?',
            answers: [
                { text: 'To keep skills current and adapt to changing business needs', correct: true },
                { text: 'To qualify for a promotion as quickly as possible', correct: false },
                { text: 'To replace formal qualifications entirely', correct: false },
                { text: 'To reduce the need for performance reviews', correct: false }
            ]
        }
    ];

    // ── Builds a single review item row (question + keep button + answers) ─────
    function _gsReviewItemHtml(q, i) {
        var answersHtml = q.answers.map(function (a) {
            var cls  = a.correct ? ' gs-review-answer--correct' : ' gs-review-answer--wrong';
            var icon = a.correct ? 'fa-check' : 'fa-circle';
            return '<div class="gs-review-answer' + cls + '">' +
                '<i class="fas ' + icon + '"></i>' + escapeAttr(a.text) +
            '</div>';
        }).join('');

        return '<div class="gs-review-item">' +
            '<div class="gs-review-q-row">' +
                '<button type="button" class="gs-review-q-btn" onclick="gsReviewToggle(this)">' +
                    '<span class="gs-review-q-num">' + (i + 1) + '</span>' +
                    '<span class="gs-review-q-text">' + escapeAttr(q.text) + '</span>' +
                    '<i class="fas fa-chevron-down gs-review-chevron"></i>' +
                '</button>' +
                '<button type="button" class="gs-review-keep-btn" onclick="gsReviewKeep(this)" title="Lock this question so it is not replaced on regeneration">' +
                    '<i class="fas fa-lock-open"></i><span>Keep</span>' +
                '</button>' +
            '</div>' +
            '<div class="gs-review-answers hidden">' + answersHtml + '</div>' +
        '</div>';
    }

    function _gsAIBuildReviewPane() {
        var pane = document.getElementById('gsAIPane3');
        if (!pane) return;
        var gameName = (document.getElementById('addGameName') || {}).value || 'this game';
        var count    = _GS_MOCK_QUESTIONS.length;

        var itemsHtml = _GS_MOCK_QUESTIONS.map(function (q, i) {
            return _gsReviewItemHtml(q, i);
        }).join('');

        pane.innerHTML =
            '<div class="gs-review-header">' +
                '<p>Review questions for <strong>' + escapeAttr(gameName) + '</strong></p>' +
                '<span class="chip chip-modules">' + count + ' questions</span>' +
            '</div>' +
            '<div class="gs-review-list">' + itemsHtml + '</div>' +
            '<div class="gs-review-regen-bar hidden" id="gsReviewRegenerateBar">' +
                '<button type="button" class="btn btn-ai" onclick="gsReviewRegenerate()">' +
                    '<i class="fas fa-wand-magic-sparkles"></i> Regenerate' +
                '</button>' +
            '</div>' +
            _gsCreditEstimateHtml();

        if (typeof window.gsAIUpdateCreditEstimate === 'function') window.gsAIUpdateCreditEstimate();
    }

    // ── Toggle accordion open / closed ───────────────────────────────────────
    window.gsReviewToggle = function (btn) {
        var item    = btn.closest('.gs-review-item');
        var answers = item && item.querySelector('.gs-review-answers');
        if (!answers) return;
        var opening = answers.classList.contains('hidden');
        answers.classList.toggle('hidden', !opening);
        item.classList.toggle('open', opening);
    };

    // ── Lock / unlock a question so regeneration skips it ────────────────────
    window.gsReviewKeep = function (btn) {
        var item   = btn.closest('.gs-review-item');
        var isKept = item.classList.toggle('gs-review-kept');
        var icon   = btn.querySelector('i');
        var label  = btn.querySelector('span');
        icon.className  = isKept ? 'fas fa-lock' : 'fas fa-lock-open';
        label.textContent = isKept ? 'Kept' : 'Keep';
        btn.classList.toggle('kept', isKept);

        // Show regenerate bar as soon as at least one question is kept
        var regenBar = document.getElementById('gsReviewRegenerateBar');
        if (regenBar) {
            var anyKept = !!document.querySelector('.gs-review-item.gs-review-kept');
            regenBar.classList.toggle('hidden', !anyKept);
        }
    };

    // ── Regenerate unlocked questions, keep locked ones intact ───────────────
    window.gsReviewRegenerate = function () {
        var allItems = document.querySelectorAll('.gs-review-list .gs-review-item');
        var pool     = _GS_MOCK_QUESTIONS_EXTRA;

        // Spinner on unlocked items
        allItems.forEach(function (item) {
            if (item.classList.contains('gs-review-kept')) return;
            var textEl = item.querySelector('.gs-review-q-text');
            if (textEl) textEl.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating…';
            var answers = item.querySelector('.gs-review-answers');
            if (answers) answers.classList.add('hidden');
            item.classList.remove('open');
        });

        var regenBtn = document.querySelector('#gsReviewRegenerateBar .btn-ai');
        if (regenBtn) {
            regenBtn.disabled = true;
            regenBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Regenerating…';
        }

        setTimeout(function () {
            allItems.forEach(function (item) {
                if (item.classList.contains('gs-review-kept')) return;
                var q       = pool[_gsRegenIdx % pool.length];
                _gsRegenIdx++;
                var textEl  = item.querySelector('.gs-review-q-text');
                if (textEl) textEl.textContent = q.text;
                var answersEl = item.querySelector('.gs-review-answers');
                if (answersEl) {
                    answersEl.innerHTML = q.answers.map(function (a) {
                        var cls  = a.correct ? ' gs-review-answer--correct' : ' gs-review-answer--wrong';
                        var icon = a.correct ? 'fa-check' : 'fa-circle';
                        return '<div class="gs-review-answer' + cls + '">' +
                            '<i class="fas ' + icon + '"></i>' + escapeAttr(a.text) +
                        '</div>';
                    }).join('');
                }
            });
            if (regenBtn) {
                regenBtn.disabled = false;
                regenBtn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> Regenerate';
            }
            if (typeof window.gsAIUpdateCreditEstimate === 'function') window.gsAIUpdateCreditEstimate();
        }, 1500);
    };

    // ── Save game + open Share step ───────────────────────────────────────────
    function _gsAISaveAndOpenShare() {
        if (_gsAIGameId) { _gsAIOpenShareStep(); return; }

        var name  = (document.getElementById('addGameName') || {}).value.trim();
        var desc  = (document.getElementById('addGameDesc')  || {}).value.trim();
        var cover = (typeof readGameCoverPicker === 'function' ? readGameCoverPicker() : null) || randomGameCover();
        if (!name) return;

        var tbody = document.querySelector('#gamesTable tbody');
        if (!tbody) return;

        var newId   = Date.now();
        var gameObj = { id: newId, name: name, description: desc, cover: cover,
                        active: true, scheduledDate: null, categories: [] };

        tbody.insertAdjacentHTML('beforeend', gameRowHtml(gameObj, newId));
        var gameRow = document.querySelector('tr.row-game[data-game="' + newId + '"]');
        if (gameRow) updateGameRowChips(gameRow);
        persistGamesScope();
        updateGamesCount(document.querySelectorAll('#gamesTable tbody tr.row-game'));
        showGameToast('"' + name + '" added');

        _gsAIGameId   = newId;
        _gsAIGameName = name;
        _gsAIGameRow  = gameRow;
        _gsAIOpenShareStep();
    }

    // ── Share step (step 4) ───────────────────────────────────────────────────
    function _gsAIOpenShareStep() {
        _gsAIStep = 4;
        var name        = _gsAIGameName || '';
        var gameRow     = document.querySelector('tr.row-game[data-game="' + _gsAIGameId + '"]');
        var companyKey  = (_currentGameScope && _currentGameScope.companyKey) || '';
        var currentDept = (_currentGameScope && _currentGameScope.dept) || '';
        var existStart  = gameRow ? (gameRow.dataset.scheduledDate    || '') : '';
        var existEnd    = gameRow ? (gameRow.dataset.scheduledEndDate || '') : '';

        var gCompanies = (typeof GAMES_SIDEBAR_COMPANIES   !== 'undefined') ? GAMES_SIDEBAR_COMPANIES   : [];
        var gDepts     = (typeof GAMES_SIDEBAR_DEPARTMENTS !== 'undefined') ? GAMES_SIDEBAR_DEPARTMENTS : [];
        var company    = null;
        for (var ci = 0; ci < gCompanies.length; ci++) {
            if (gCompanies[ci].name.toLowerCase() === companyKey) { company = gCompanies[ci]; break; }
        }
        var allDepts  = company ? gDepts.filter(function (d) { return d.companyId === company.id; }) : [];
        var sharedNow = (typeof getGameSharedDepts === 'function')
            ? new Set(getGameSharedDepts(companyKey, name)) : new Set();

        window._currentGameShareTarget = {
            name: name, row: gameRow,
            sharedDepts: Array.from(sharedNow), isNew: true,
            initialStart: existStart, initialEnd: existEnd
        };
        window._postShareCallback = null;

        var items = allDepts.map(function (d) {
            var precheck = sharedNow.has(d.name) || d.name === currentDept;
            return '<label class="share-dept-item">' +
                '<input type="checkbox" value="' + escapeAttr(d.name) + '"' + (precheck ? ' checked' : '') + '>' +
                '<span class="share-dept-name">' + escapeAttr(d.name) + '</span>' +
            '</label>';
        }).join('') || '<p class="share-empty">No departments to share with.</p>';

        var scheduleHtml = (typeof buildScheduleBodyHtml === 'function')
            ? buildScheduleBodyHtml(existStart, existEnd)
            : '<div class="schedule-form"><div class="schedule-date-row">' +
              '<div class="form-group"><label>Start date</label>' +
              '<input type="date" id="scheduleStartDate" class="schedule-date-input"' + (existStart ? ' value="' + escapeAttr(existStart) + '"' : '') + '></div>' +
              '<div class="form-group"><label>End date</label>' +
              '<input type="date" id="scheduleEndDate" class="schedule-date-input"' + (existEnd ? ' value="' + escapeAttr(existEnd) + '"' : '') + '></div>' +
              '</div></div>';

        // 4-step stepper header — all 4 steps committed/done (non-clickable)
        var labels = ['Game Setup', 'Content', 'Review', 'Share'];
        var stepperHtml = '<div class="add-stepper gs-ai-stepper">';
        labels.forEach(function (label, i) {
            if (i > 0) stepperHtml += '<div class="add-step-connector"></div>';
            var cls = i < 3 ? ' done gs-step-committed' : ' active';
            stepperHtml +=
                '<div class="add-step' + cls + '" data-step="' + (i + 1) + '">' +
                    '<span class="add-step-num">' + (i + 1) + '</span>' +
                    '<span class="add-step-label">' + label + '</span>' +
                '</div>';
        });
        stepperHtml += '</div>';

        var badge = document.getElementById('gameEditBadge');
        if (badge) {
            badge.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> AI';
            badge.classList.add('badge-ai');
        }
        document.getElementById('gameEditTitle').textContent    = 'Add Game';
        document.getElementById('gameEditSubtitle').textContent = getGamesScopeSubtitle();
        document.getElementById('gameEditFields').innerHTML =
            stepperHtml +
            '<div class="add-step-pane">' +
                '<p class="step-pane-lead"><strong>' + escapeAttr(name) + '</strong></p>' +
                '<div class="share-dept-list" id="gameShareDeptList">' + items + '</div>' +
                scheduleHtml +
            '</div>';

        setGamePanelMode('add');
        showGameEdit();

        var actions = document.querySelector('#detailEdit .edit-actions');
        if (actions) {
            actions.innerHTML =
                '<button type="button" class="btn btn-outline" onclick="cancelGameEdit()">Cancel</button>' +
                '<button type="button" class="btn btn-primary" onclick="gsAIConfirmShare()">Share</button>';
        }
    }

    window.gsAIConfirmShare = function () {
        if (typeof confirmGameSharePanel === 'function') confirmGameSharePanel();
        var startVal = (document.getElementById('scheduleStartDate') || {}).value || '';
        var endVal   = (document.getElementById('scheduleEndDate')   || {}).value || '';
        if (startVal || endVal) {
            var targetRow = _gsAIGameId
                ? document.querySelector('tr.row-game[data-game="' + _gsAIGameId + '"]')
                : null;
            if (targetRow) {
                if (startVal) targetRow.dataset.scheduledDate    = startVal;
                if (endVal)   targetRow.dataset.scheduledEndDate = endVal;
                if (typeof updateGameRowChips === 'function') updateGameRowChips(targetRow);
                if (typeof persistGamesScope  === 'function') persistGamesScope();
            }
        }
    };

    // File drag/drop helpers for AI upload pane
    window.gsAIFileChange = function (input) {
        var p = document.getElementById('gsAIUploadPrompt');
        if (p && input.files && input.files[0]) p.textContent = input.files[0].name;
    };
    window.gsAIFileDrop = function (zone, event) {
        event.preventDefault();
        zone.classList.remove('drag-over');
        var f = event.dataTransfer && event.dataTransfer.files[0];
        if (f) { var p = document.getElementById('gsAIUploadPrompt'); if (p) p.textContent = f.name; }
    };

    // ── Pending-share handler — runs on page load after returning from questions ─
    $(function () {
        var pending = null;
        try { pending = JSON.parse(localStorage.getItem('gameon.pendingShare') || 'null'); } catch (e) {}
        if (!pending || !pending.gameId) return;

        localStorage.removeItem('gameon.pendingShare');
        var targetId = String(pending.gameId);

        // Intercept renderGamesForScope once so that after the list renders
        // we can find the game row and open the share step.
        var _origRender = window.renderGamesForScope;
        window.renderGamesForScope = function (companyKey, dept) {
            if (typeof _origRender === 'function') _origRender(companyKey, dept);
            window.renderGamesForScope = _origRender;
            setTimeout(function () {
                var gameRow = document.querySelector('tr.row-game[data-game="' + targetId + '"]');
                if (gameRow) _gsOpenShareStep(gameRow);
            }, 100);
        };
    });

}());
