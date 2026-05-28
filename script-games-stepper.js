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
        var labels = ['Game Setup', 'Upload', 'Share'];
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
    function _gsPane1Html() {
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
            '    </div>',
            '    <div class="form-group"><label>Pass Threshold (%)</label>',
            '      <input type="number" id="addGamePassThreshold" placeholder="e.g. 60" min="0" max="100" style="width:100px"></div>',
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
    window.gsUpdateStepAccess = _gsUpdateStepAccess;

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

        var labels = ['Game Setup', 'Upload', 'Share'];
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
        var labels = ['Game Setup', 'Upload', 'Share'];
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
