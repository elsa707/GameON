// =============================================================================
// Games Add Flow v2 — Intent-first + manual single stepper
//
// Overrides addGame() and addGameAI() from script-games.js.
// Must be loaded AFTER script-games.js (index-games-v2.html only).
//
// Flows:
//   Intent → Manually + Single game   → 2-step stepper (Game → Share)
//          → Manually + With categories → original addGame() panel
//          → Generate with AI          → original addGameAI() panel
// =============================================================================

(function () {

    // Capture original functions before overriding.
    var _origAddGame            = window.addGame;
    var _origAddGameAI          = window.addGameAI;
    var _origBackToQTypePicker  = window.backToQTypePicker;
    var _origActionAddQuestion  = window.actionAddQuestion;

    // ── Redirect question saves to the v2 questions page ─────────────────────
    // _navigateToQuestionsPage is called by submitAddQuestion / saveQAndAddAnother
    // after a question is saved. Override it here to land on index-questions-v2.html
    // (which has "Games v2" active in the sidebar and the correct back-link).
    window._navigateToQuestionsPage = function (gameId, catId, openPicker) {
        try {
            localStorage.setItem('gameon.questionsNav', JSON.stringify({
                gameId:     String(gameId),
                catId:      String(catId),
                openPicker: !!openPicker,
                companyKey: (_currentGameScope && _currentGameScope.companyKey) || '',
                dept:       (_currentGameScope && _currentGameScope.dept)       || '',
                deptName:   (_currentGameScope && _currentGameScope.dept)       || ''
            }));
        } catch (e) {}
        window.location.href = 'index-questions-v2.html';
    };

    var _gv2Step = 1;

    // Tracks the game/category created by the v2 flow so "← Change type" can
    // return to our compact step-2 picker instead of the full-screen one.
    var _gv2ActiveGameId = null;
    var _gv2ActiveCatId  = null;

    // ══════════════════════════════════════════════════════════════════════════
    // Entry points
    // ══════════════════════════════════════════════════════════════════════════

    window.addGame = function () { _openGameIntent(null); };
    window.addGameAI = function () { _openGameIntent('ai'); };

    // ══════════════════════════════════════════════════════════════════════════
    // Intent screen
    // ══════════════════════════════════════════════════════════════════════════

    function _openGameIntent(preMethod) {
        window._gameAddCats   = [];
        window._editingCatIdx = null;
        window._isGameAddMode = true;
        window._isAIGameFlow  = false;
        window._gameEditRow   = null;
        window._gameEditType  = 'game';

        document.getElementById('gameEditTitle').textContent    = 'Add Game';
        document.getElementById('gameEditSubtitle').textContent = getGamesScopeSubtitle();
        document.getElementById('gameEditFields').innerHTML     = _intentHtml(preMethod);

        setGamePanelMode('add');
        _setIntentActions(!preMethod);
        showGameEdit();

        if (preMethod) {
            var sg = document.getElementById('gameIntentStructureGroup');
            if (sg) sg.classList.remove('hidden');
        }
    }

    function _intentHtml(preMethod) {
        var manualSel = preMethod === 'manual' ? ' selected' : '';
        var aiSel     = preMethod === 'ai'     ? ' selected' : '';

        return (
            '<div class="intent-screen" id="gameIntentScreen">' +

                '<div class="intent-group">' +
                    '<p class="intent-group-label">How would you like to create it?</p>' +
                    '<div class="intent-cards">' +

                        '<button type="button" class="intent-card' + manualSel + '"' +
                        '    data-group="gamemethod" data-value="manual" onclick="gameIntentPickMethod(this)">' +
                            '<span class="intent-icon"><i class="fas fa-pen"></i></span>' +
                            '<span class="intent-body">' +
                                '<span class="intent-title">Manually</span>' +
                                '<span class="intent-desc">Fill in the details and questions yourself</span>' +
                            '</span>' +
                            '<span class="intent-check"><i class="fas fa-check"></i></span>' +
                        '</button>' +

                        '<button type="button" class="intent-card' + aiSel + '"' +
                        '    data-group="gamemethod" data-value="ai" onclick="gameIntentPickMethod(this)">' +
                            '<span class="intent-icon"><i class="fas fa-wand-magic-sparkles"></i></span>' +
                            '<span class="intent-body">' +
                                '<span class="intent-title">Generate with AI</span>' +
                                '<span class="intent-desc">AI builds the game from a topic</span>' +
                            '</span>' +
                            '<span class="intent-check"><i class="fas fa-check"></i></span>' +
                        '</button>' +

                    '</div>' +
                '</div>' +

                '<div class="intent-group hidden" id="gameIntentStructureGroup">' +
                    '<p class="intent-group-label">What are you building?</p>' +
                    '<div class="intent-cards">' +

                        '<button type="button" class="intent-card selected"' +
                        '    data-group="gamestructure" data-value="single" onclick="gameIntentPickStructure(this)">' +
                            '<span class="intent-icon"><i class="fas fa-trophy"></i></span>' +
                            '<span class="intent-body">' +
                                '<span class="intent-title">Single game</span>' +
                                '<span class="intent-desc">One game with a set of questions</span>' +
                            '</span>' +
                            '<span class="intent-check"><i class="fas fa-check"></i></span>' +
                        '</button>' +

                        '<button type="button" class="intent-card"' +
                        '    data-group="gamestructure" data-value="categories" onclick="gameIntentPickStructure(this)">' +
                            '<span class="intent-icon"><i class="fas fa-list-ol"></i></span>' +
                            '<span class="intent-body">' +
                                '<span class="intent-title">With categories</span>' +
                                '<span class="intent-desc">Organise questions into rounds or categories</span>' +
                            '</span>' +
                            '<span class="intent-check"><i class="fas fa-check"></i></span>' +
                        '</button>' +

                    '</div>' +
                '</div>' +

            '</div>'
        );
    }

    function _setIntentActions(nextDisabled) {
        var actions = document.querySelector('#detailEdit .edit-actions');
        if (!actions) return;
        actions.innerHTML =
            '<button type="button" class="btn btn-outline" onclick="cancelGameEdit()">Cancel</button>' +
            '<button type="button" class="btn btn-primary" id="gameIntentNextBtn" onclick="gameIntentProceed()"' +
                (nextDisabled ? ' disabled' : '') + '>Next <i class="fas fa-arrow-right"></i></button>';
    }

    window.gameIntentPickMethod = function (btn) {
        document.querySelectorAll('.intent-card[data-group="gamemethod"]').forEach(function (c) { c.classList.remove('selected'); });
        btn.classList.add('selected');
        // Show row 2 only for Manually; hide it for Generate with AI.
        var sg = document.getElementById('gameIntentStructureGroup');
        if (sg) sg.classList.toggle('hidden', btn.dataset.value !== 'manual');
        var nb = document.getElementById('gameIntentNextBtn');
        if (nb) nb.disabled = false;
    };

    window.gameIntentPickStructure = function (btn) {
        document.querySelectorAll('.intent-card[data-group="gamestructure"]').forEach(function (c) { c.classList.remove('selected'); });
        btn.classList.add('selected');
    };

    window.gameIntentProceed = function () {
        var methodCard = document.querySelector('.intent-card[data-group="gamemethod"].selected');
        var structCard = document.querySelector('.intent-card[data-group="gamestructure"].selected');
        var method     = methodCard ? methodCard.dataset.value : 'manual';
        var structure  = structCard ? structCard.dataset.value : 'single';

        if (method === 'ai') {
            _gv2AIFlow();
        } else if (structure === 'single') {
            _gv2ManualSingleFlow();
        } else {
            _origAddGame();
        }
    };

    // ══════════════════════════════════════════════════════════════════════════
    // Generate with AI flow — adds cover picker + topic auto-fill to base panel
    // ══════════════════════════════════════════════════════════════════════════

    function _gv2AIFlow() {
        // Sync user-created topics so the dropdown is up to date.
        _gv2SyncTopicsFromStorage();

        // Render the full existing AI game panel (state, tabs, generate button…).
        _origAddGameAI();

        // Override the title to stay consistent with the v2 style.
        var titleEl = document.getElementById('gameEditTitle');
        if (titleEl) titleEl.textContent = 'Add Game';

        var fieldsEl = document.getElementById('gameEditFields');
        if (fieldsEl) {
            // Build stepper header (step 1 active, same labels as manual flow).
            var stepperHtml = '<div class="add-stepper">';
            ['Game', 'Questions', 'Share'].forEach(function (label, i) {
                if (i > 0) stepperHtml += '<div class="add-step-connector"></div>';
                stepperHtml +=
                    '<div class="add-step' + (i === 0 ? ' active' : '') + '" data-step="' + (i + 1) + '">' +
                        '<span class="add-step-num">' + (i + 1) + '</span>' +
                        '<span class="add-step-label">' + label + '</span>' +
                    '</div>';
            });
            stepperHtml += '</div>';

            // Prepend stepper + cover picker above the existing tab bar.
            fieldsEl.insertAdjacentHTML('afterbegin',
                stepperHtml +
                '<div class="form-group gv2-ai-cover-row">' +
                    '<label>Cover image</label>' +
                    gameCoverPickerHtml(GAME_COVER_PRESETS[0]) +
                '</div>'
            );

            // Remove the "Generate with categories & questions" toggle.
            var toggle = fieldsEl.querySelector('.ai-subtopics-option');
            if (toggle) toggle.remove();

            // Remove the Content / Game tab bar — not needed in the v2 flow.
            var tabBar = fieldsEl.querySelector('#aiGameTabBar');
            if (tabBar) tabBar.remove();

            // Remove Upload / URL / Text content inputs and the "Topic sub-topics will
            // be used as game categories" note — content comes from the selected topic.
            ['#aiGameUploadSection', '#aiGameUrlSection', '#aiGameTextSection', '#aiGameContentSkipNote'].forEach(function (sel) {
                var el = fieldsEl.querySelector(sel);
                if (el) el.remove();
            });

            // Move AI Model select into a Configure accordion alongside the game
            // settings fields.  Remove the original .ai-model-group (which carries
            // margin-top:12px from styles-topics.css) and rebuild it as a plain
            // form-group so all four cells in the configure-grid align flush.
            var modelGroup = fieldsEl.querySelector('.ai-model-group');
            if (modelGroup) modelGroup.remove();
            var modelHtml =
                '<div class="form-group">' +
                    '<label for="aiGameModelSelect">AI Model</label>' +
                    '<select id="aiGameModelSelect" class="ai-model-select">' +
                        '<option value="claude-sonnet-4-6" selected>Claude Sonnet 4.6 — Recommended</option>' +
                        '<option value="claude-opus-4-7">Claude Opus 4.7 — Most capable</option>' +
                        '<option value="claude-haiku-4-5">Claude Haiku 4.5 — Fastest</option>' +
                    '</select>' +
                '</div>';

            // Insert Configure accordion BEFORE the generate prompt/button block.
            var generateBlock = fieldsEl.querySelector('.ai-generate-block');
            var configureHtml =
                '<div class="add-game-advanced" style="margin-top:16px">' +
                    '<button type="button" class="add-game-advanced-toggle"' +
                    '    onclick="toggleAddGameAdvanced(this)" data-body="aiGameAdvancedBody">' +
                    '  Configure <i class="fas fa-chevron-down add-game-advanced-icon"></i>' +
                    '</button>' +
                    '<div class="add-game-advanced-body hidden" id="aiGameAdvancedBody">' +
                        '<div class="configure-grid">' +
                            modelHtml +
                            '<div class="form-group"><label>Max attempts</label>' +
                                '<input type="number" id="aiGameMaxAttempts" placeholder="e.g. 3" min="1" max="99"></div>' +
                            '<div class="form-group"><label>Questions for this game</label>' +
                                '<input type="number" id="aiGameQPerSession" value="5" min="1" max="100"></div>' +
                            '<div class="form-group"><label>Pass Threshold (%)</label>' +
                                '<input type="number" id="aiGamePassThreshold" placeholder="e.g. 60" min="0" max="100"></div>' +
                        '</div>' +
                    '</div>' +
                '</div>';
            if (generateBlock) {
                generateBlock.insertAdjacentHTML('beforebegin', configureHtml);
            } else {
                fieldsEl.insertAdjacentHTML('beforeend', configureHtml);
            }
        }

        // Remove "(optional)" label suffix from the topic field.
        var topicOptional = fieldsEl.querySelector('label[for="aiGameTopicSelect"] .form-label-optional');
        if (topicOptional) topicOptional.remove();

        // Replace topic options with the full (no-cap) list from localStorage.
        var topicSel = document.getElementById('aiGameTopicSelect');
        if (topicSel) {
            topicSel.innerHTML = '<option value="">Select a topic</option>' + _gv2TopicOptions();
            // Wire cover auto-fill: swap out the original onchange for our wrapper.
            topicSel.setAttribute('onchange', 'gv2OnAITopicChange(this)');

            // Inject Game Categories info block directly after the topic form-group.
            var topicGroup = topicSel.closest('.form-group');
            if (topicGroup) {
                topicGroup.insertAdjacentHTML('afterend',
                    '<div class="form-group ai-game-cats-group">' +
                        '<label>Game Categories</label>' +
                        '<div class="ai-game-cats-info">' +
                            '<ul class="ai-game-cats-list">' +
                                '<li>Select a topic — its sub-topics will be used as game categories</li>' +
                            '</ul>' +
                        '</div>' +
                    '</div>'
                );
            }
        }

        // After AI generates the game, advance to step 2 (Questions) instead of
        // switching to the original tab pane.  Wrap _renderAIGameResults once —
        // it gets restored immediately after the first call.
        var _origRenderResults = window._renderAIGameResults;
        window._renderAIGameResults = function (action) {
            if (typeof _origRenderResults === 'function') _origRenderResults(action);
            window._renderAIGameResults = _origRenderResults;
            _gv2AIShowQuestionsStep();
        };
    }

    // ── AI flow: step 2 — question type + count ───────────────────────────────

    function _gv2AIShowQuestionsStep() {
        var stepLabels  = ['Game', 'Questions', 'Share'];
        var stepperHtml = '<div class="add-stepper">';
        stepLabels.forEach(function (label, i) {
            if (i > 0) stepperHtml += '<div class="add-step-connector"></div>';
            var cls = i === 0 ? ' done' : i === 1 ? ' active' : '';
            stepperHtml +=
                '<div class="add-step' + cls + '" data-step="' + (i + 1) + '">' +
                    '<span class="add-step-num">' + (i + 1) + '</span>' +
                    '<span class="add-step-label">' + label + '</span>' +
                '</div>';
        });
        stepperHtml += '</div>';

        var typeCards = _GV2_QTYPES.map(function (t) {
            return (
                '<button type="button" class="q-type-card" data-qtype="' + t.key + '" onclick="gv2AIPickQType(this)">' +
                    '<span class="q-type-card-icon"><i class="fas ' + t.icon + '"></i></span>' +
                    '<span class="q-type-card-title">' + t.title + '</span>' +
                '</button>'
            );
        }).join('');

        // Detach the generated panes BEFORE replacing innerHTML so saveGameAdd()
        // can still read the game name, description, and category items from them.
        var fieldsEl    = document.getElementById('gameEditFields');
        var gamePaneEl  = document.getElementById('aiGameTabPaneGame');
        var catsPaneEl  = document.getElementById('aiGameTabPaneCats');
        if (gamePaneEl && gamePaneEl.parentNode) gamePaneEl.parentNode.removeChild(gamePaneEl);
        if (catsPaneEl && catsPaneEl.parentNode) catsPaneEl.parentNode.removeChild(catsPaneEl);

        document.getElementById('gameEditBadge').innerHTML     = '<i class="fas fa-wand-magic-sparkles"></i> Generating with AI';
        document.getElementById('gameEditTitle').textContent   = 'Add Game';
        document.getElementById('gameEditSubtitle').textContent = getGamesScopeSubtitle();
        fieldsEl.innerHTML =
            stepperHtml +
            '<div class="add-step-pane">' +
                '<p class="step-pane-lead">Choose the question type to generate:</p>' +
                '<div class="q-type-picker q-type-picker--sm" id="aiQTypePicker">' + typeCards + '</div>' +
                '<div class="form-group ai-qcount-group">' +
                    '<label>Total questions &nbsp;<strong class="ai-qcount-val" id="aiQTotalVal">10</strong></label>' +
                    '<input type="range" class="ai-qcount-slider" id="aiQTotal" min="1" max="10" value="10"' +
                    '    oninput="document.getElementById(\'aiQTotalVal\').textContent=this.value">' +
                '</div>' +
                '<div class="form-group ai-qcount-group">' +
                    '<label>Questions per attempt &nbsp;<strong class="ai-qcount-val" id="aiQAttemptVal">5</strong></label>' +
                    '<input type="range" class="ai-qcount-slider" id="aiQAttempt" min="1" max="10" value="5"' +
                    '    oninput="document.getElementById(\'aiQAttemptVal\').textContent=this.value">' +
                '</div>' +
            '</div>';

        // Re-attach generated panes hidden so saveGameAdd() can still find them.
        if (gamePaneEl) { gamePaneEl.classList.add('hidden'); fieldsEl.appendChild(gamePaneEl); }
        if (catsPaneEl) { catsPaneEl.classList.add('hidden'); fieldsEl.appendChild(catsPaneEl); }

        // setGamePanelMode MUST run before we overwrite the action bar — if called
        // after, it detects the missing #gameSubmitBtn and restores the default buttons,
        // undoing our Cancel / Back / Next bar.
        setGamePanelMode('add');
        showGameEdit();

        var actions = document.querySelector('#detailEdit .edit-actions');
        if (actions) {
            actions.innerHTML =
                '<button type="button" class="btn btn-outline" onclick="cancelGameEdit()">Cancel</button>' +
                '<button type="button" class="btn btn-outline" onclick="gv2AIGoBack()">' +
                    '<i class="fas fa-arrow-left"></i> Back</button>' +
                '<button type="button" class="btn btn-primary" id="aiQNextBtn" onclick="gv2AISaveAndShare()" disabled>' +
                    'Next <i class="fas fa-arrow-right"></i>' +
                '</button>';
        }
    }

    // Back from step 2 — re-opens the AI step 1 form.
    window.gv2AIGoBack = function () { _gv2AIFlow(); };

    window.gv2AIPickQType = function (btn) {
        document.querySelectorAll('#aiQTypePicker .q-type-card').forEach(function (c) { c.classList.remove('selected'); });
        btn.classList.add('selected');
        var nextBtn = document.getElementById('aiQNextBtn');
        if (nextBtn) nextBtn.disabled = false;
    };

    window.gv2AISaveAndShare = function () {
        var selectedType = document.querySelector('#aiQTypePicker .q-type-card.selected');
        if (!selectedType) return;

        // Store question settings so they can be applied after save if needed.
        window._aiV2QuestionType = selectedType.dataset.qtype;
        window._aiV2TotalQ       = parseInt((document.getElementById('aiQTotal')   || {}).value, 10) || 10;
        window._aiV2AttemptQ     = parseInt((document.getElementById('aiQAttempt') || {}).value, 10) || 5;

        // Intercept showAddGameShareStep (called by saveGameAdd after AI save) to use
        // our inline stepper step 3 instead of the original tab-based share step.
        var _origShowShare = window.showAddGameShareStep;
        window.showAddGameShareStep = function (gameName) {
            window.showAddGameShareStep = _origShowShare; // restore immediately
            var gameRow = null;
            document.querySelectorAll('tr.row-game').forEach(function (r) {
                if (r.dataset.name === gameName) gameRow = r;
            });
            if (gameRow) {
                _gv2OpenShareStep(gameRow);
            } else if (typeof _origShowShare === 'function') {
                _origShowShare(gameName);
            }
        };

        // Trigger the AI game save.
        if (typeof saveGameAdd === 'function') saveGameAdd({ preventDefault: function () {} });
    };

    // Topic change handler for the AI flow — runs original logic then updates cover + categories.
    window.gv2OnAITopicChange = function (select) {
        // Run the original handler (sets _aiGamePendingTopic, updates UI notes, etc.).
        if (typeof onAIGameTopicChange === 'function') onAIGameTopicChange(select);

        var topic = null;
        try {
            var val = select ? select.value : '';
            if (val) topic = JSON.parse(val);
        } catch (e) {}

        // Auto-fill cover image from the selected topic.
        if (topic && topic.cover) _setAddGameCoverPreview(topic.cover);

        // Update the Game Categories info block to reflect the topic's sub-topics.
        _gv2UpdateAIGameCats(topic);
    };

    // Refreshes the Game Categories bullet list based on the currently selected topic.
    function _gv2UpdateAIGameCats(topic) {
        var list = document.querySelector('.ai-game-cats-list');
        if (!list) return;

        var subs = (topic && topic.subTopics && topic.subTopics.length) ? topic.subTopics : null;

        if (!topic) {
            list.innerHTML = '<li>Select a topic — its sub-topics will be used as game categories</li>';
        } else if (subs) {
            var names = subs.map(function (s) { return escapeAttr(s.name || s); }).join(', ');
            list.innerHTML =
                '<li>This topic has <strong>' + subs.length + ' sub-topic' + (subs.length !== 1 ? 's' : '') +
                    '</strong> that will be used as game categories</li>' +
                '<li class="ai-cats-subtopic-list">' + names + '</li>';
        } else {
            list.innerHTML = '<li>This topic has no sub-topics — no game categories will be added</li>';
        }
    }

    // ══════════════════════════════════════════════════════════════════════════
    // Manual single — 2-step stepper
    // ══════════════════════════════════════════════════════════════════════════

    function _gv2ManualSingleFlow() {
        _gv2Step = 1;
        document.getElementById('gameEditTitle').textContent    = 'Add Game';
        document.getElementById('gameEditSubtitle').textContent = getGamesScopeSubtitle();
        document.getElementById('gameEditFields').innerHTML     = _gv2StepperHtml();
        _gv2SetStepActions(1);
    }

    var _GV2_TOTAL_STEPS = 3;

    function _gv2StepperHtml() {
        var labels = ['Game', 'Questions', 'Share'];
        var html = '<div class="add-stepper" id="gv2Stepper">';
        labels.forEach(function (label, i) {
            if (i > 0) html += '<div class="add-step-connector"></div>';
            html +=
                '<div class="add-step' + (i === 0 ? ' active' : '') + '" data-step="' + (i + 1) + '">' +
                    '<span class="add-step-num">' + (i + 1) + '</span>' +
                    '<span class="add-step-label">' + label + '</span>' +
                '</div>';
        });
        html += '</div>';

        html += '<div class="add-step-pane" id="gv2Pane1">'        + _gv2Pane1Html() + '</div>';
        html += '<div class="add-step-pane hidden" id="gv2Pane2">' + _gv2Pane2Html() + '</div>';
        html += '<div class="add-step-pane hidden" id="gv2Pane3">' + _gv2Pane3Html() + '</div>';

        return html;
    }

    // ── Topic helpers ─────────────────────────────────────────────────────────

    // Merge any user-created topics saved by the Topics page into TOPICS_BY_SCOPE
    // so they are visible on the Games page without needing script-topics.js loaded.
    function _gv2SyncTopicsFromStorage() {
        try {
            var saved = localStorage.getItem('gameon.topics.scope');
            if (!saved || typeof TOPICS_BY_SCOPE === 'undefined') return;
            var parsed = JSON.parse(saved);
            Object.keys(parsed).forEach(function (k) { TOPICS_BY_SCOPE[k] = parsed[k]; });
        } catch (e) {}
    }

    // Build <option> elements for all topics in the current scope — no cap.
    function _gv2TopicOptions() {
        _gv2SyncTopicsFromStorage();

        var ck   = (_currentGameScope && _currentGameScope.companyKey) || '';
        var dept = (_currentGameScope && _currentGameScope.dept) || '';
        var topics = [];

        if (typeof TOPICS_BY_SCOPE !== 'undefined') {
            var bucket = TOPICS_BY_SCOPE[(ck || '') + '|' + (dept || '')];
            if (bucket && bucket.length) topics = bucket;
        }
        if (!topics.length && typeof TOPICS_BY_DEPT !== 'undefined') {
            var deptKey = dept ? dept.toLowerCase() : '';
            topics = (deptKey && TOPICS_BY_DEPT[deptKey])
                ? TOPICS_BY_DEPT[deptKey]
                : (TOPICS_BY_DEPT['_default'] || []);
        }
        if (!topics.length) return '';

        return topics.map(function (t) {
            var val = escapeAttr(JSON.stringify({
                name:       t.name,
                description: t.description || '',
                cover:      t.cover || '',
                subTopics:  t.subTopics || []
            }));
            return '<option value="' + val + '">' + escapeAttr(t.name) + '</option>';
        }).join('');
    }

    // ── Step 1: Cover + Topic + Name + Description + Content ─────────────────
    function _gv2Pane1Html() {
        var topicOpts = _gv2TopicOptions();
        return [
            '<div class="form-group">',
            '  <label>Cover image</label>',
            '  ' + gameCoverPickerHtml(GAME_COVER_PRESETS[0]),
            '</div>',
            '<div class="form-group">',
            '  <label for="gv2Topic">Topic</label>',
            '  <select id="gv2Topic" class="ai-model-select" onchange="gv2OnTopicChange(this)">',
            '    <option value="">Select a topic</option>',
            '    ' + topicOpts,
            '  </select>',
            '</div>',
            '<div class="form-group">',
            '  <label>Game name</label>',
            '  <input type="text" id="gv2Name" placeholder="Game name">',
            '</div>',
            '<div class="form-group">',
            '  <label>Description</label>',
            '  <input type="text" id="gv2Desc" placeholder="Game description">',
            '</div>',
            '<div class="form-group">',
            '  <label>Content</label>',
            '  ' + _gv2ContentPickerHtml(),
            '</div>',
            '<div class="add-game-advanced" style="margin-top:16px">',
            '  <button type="button" class="add-game-advanced-toggle" onclick="toggleAddGameAdvanced(this)" data-body="gv2AdvancedBody">',
            '    Configure <i class="fas fa-chevron-down add-game-advanced-icon"></i>',
            '  </button>',
            '  <div class="add-game-advanced-body hidden" id="gv2AdvancedBody">',
            '    <div class="configure-grid">',
            '      <div class="form-group"><label>Max attempts</label><input type="number" id="gv2MaxAttempts" placeholder="e.g. 3" min="1" max="99"></div>',
            '      <div class="form-group"><label>Questions for this game</label><input type="number" id="gv2QPerSession" value="5" min="1" max="100"></div>',
            '    </div>',
            '    <div class="form-group"><label>Pass Threshold (%)</label><input type="number" id="gv2PassThreshold" placeholder="e.g. 60" min="0" max="100" style="width:100px"></div>',
            '  </div>',
            '</div>'
        ].join('\n');
    }

    window.gv2OnTopicChange = function (select) {
        var val = select ? select.value : '';
        if (!val) return;
        try {
            var t = JSON.parse(val);
            var nameEl = document.getElementById('gv2Name');
            if (nameEl && !nameEl.value.trim()) nameEl.value = t.name || '';
            var descEl = document.getElementById('gv2Desc');
            if (descEl && !descEl.value.trim()) descEl.value = t.description || '';
            if (t.cover) _setAddGameCoverPreview(t.cover);
        } catch (e) {}
    };

    function _gv2ContentPickerHtml() {
        return (
            '<div class="content-picker" id="gv2ContentPicker">' +
                '<div class="content-kind-tabs" role="tablist">' +
                    '<button type="button" class="content-kind-tab active" data-kind="upload" onclick="gv2SetContentKind(this)"><i class="fas fa-upload"></i> Upload</button>' +
                    '<button type="button" class="content-kind-tab" data-kind="video"  onclick="gv2SetContentKind(this)"><i class="fas fa-link"></i> Web URL</button>' +
                    '<button type="button" class="content-kind-tab" data-kind="text"   onclick="gv2SetContentKind(this)"><i class="fas fa-align-left"></i> Text</button>' +
                '</div>' +

                '<div class="content-pane" data-pane="upload">' +
                    '<div class="cp-dropzone"' +
                    '    onclick="this.querySelector(\'.cp-file\').click()"' +
                    '    ondragover="event.preventDefault();this.classList.add(\'drag-over\')"' +
                    '    ondragleave="this.classList.remove(\'drag-over\')"' +
                    '    ondrop="gv2OnFileDrop(this,event)">' +
                        '<i class="fas fa-upload"></i>' +
                        '<span class="cp-dropzone-hint">Drop file or <u>browse</u></span>' +
                        '<span class="cp-detected cp-dropzone-name"></span>' +
                        '<input type="file" class="cp-file" accept="application/pdf,image/*" onchange="gv2OnFileChange(this)" style="display:none">' +
                    '</div>' +
                    '<input type="hidden" class="cp-media-name" value="">' +
                '</div>' +

                '<div class="content-pane hidden" data-pane="video">' +
                    '<input type="url" class="cp-video-url" placeholder="https://…">' +
                '</div>' +

                '<div class="content-pane hidden" data-pane="text">' +
                    '<div class="rte-toolbar">' +
                        '<button type="button" class="rte-btn" title="Bold"      onmousedown="event.preventDefault();document.execCommand(\'bold\')"><i class="fas fa-bold"></i></button>' +
                        '<button type="button" class="rte-btn" title="Italic"    onmousedown="event.preventDefault();document.execCommand(\'italic\')"><i class="fas fa-italic"></i></button>' +
                        '<button type="button" class="rte-btn" title="Underline" onmousedown="event.preventDefault();document.execCommand(\'underline\')"><i class="fas fa-underline"></i></button>' +
                        '<span class="rte-sep"></span>' +
                        '<button type="button" class="rte-btn" title="Bullet list"   onmousedown="event.preventDefault();document.execCommand(\'insertUnorderedList\')"><i class="fas fa-list-ul"></i></button>' +
                        '<button type="button" class="rte-btn" title="Numbered list" onmousedown="event.preventDefault();document.execCommand(\'insertOrderedList\')"><i class="fas fa-list-ol"></i></button>' +
                    '</div>' +
                    '<div class="cp-text" contenteditable="true" data-placeholder="Paste text, notes, or reference material…"></div>' +
                '</div>' +
            '</div>'
        );
    }

    // ── Step 2: Question types ────────────────────────────────────────────────
    var _GV2_QTYPES = [
        { key: 'mcq',         icon: 'fa-circle-question', title: 'Multiple Choice'   },
        { key: 'fill-blank',  icon: 'fa-pen',             title: 'Fill in the Blanks'},
        { key: 'stmt-blank',  icon: 'fa-pen-to-square',   title: 'Statement Blanking'},
        { key: 'select-img',  icon: 'fa-image',           title: 'Select on Image'   },
        { key: 'match-terms', icon: 'fa-link',            title: 'Match the Terms'   },
        { key: 'word-bucket', icon: 'fa-bucket',          title: 'Word Bucket'       },
        { key: 'crossword',   icon: 'fa-border-all',      title: 'Crossword'         }
    ];

    // Clicking a card saves the game immediately and opens the question form.
    window.gv2PickQType = function (btn) {
        var questionType = btn.dataset.qtype || 'mcq';

        // Flash selection so the user sees their choice before the panel transitions.
        document.querySelectorAll('#gv2QtypePicker .q-type-card').forEach(function (c) { c.classList.remove('selected'); });
        btn.classList.add('selected');

        var saved = _gv2DoSave(questionType);
        if (!saved) return;   // name was blank — already bounced back to step 1
        _gv2OpenQuestionForm(saved.id, saved.name, questionType);
    };

    function _gv2Pane2Html() {
        var cards = _GV2_QTYPES.map(function (t) {
            return (
                '<button type="button" class="q-type-card"' +
                '    data-qtype="' + t.key + '" onclick="gv2PickQType(this)">' +
                    '<span class="q-type-card-icon"><i class="fas ' + t.icon + '"></i></span>' +
                    '<span class="q-type-card-title">' + t.title + '</span>' +
                '</button>'
            );
        }).join('');

        return (
            '<p class="step-pane-lead">Choose the type of questions for this game:</p>' +
            '<div class="q-type-picker q-type-picker--sm" id="gv2QtypePicker">' + cards + '</div>'
        );
    }

    // ── Step 3: Share ─────────────────────────────────────────────────────────
    function _gv2Pane3Html() {
        return (
            '<p class="step-pane-lead">Choose which departments to share this game with:</p>' +
            '<div id="gv2ShareList" class="share-dept-list"></div>'
        );
    }

    // ── Action bar per step ───────────────────────────────────────────────────
    function _gv2SetStepActions(step) {
        var actions = document.querySelector('#detailEdit .edit-actions');
        if (!actions) return;

        var backBtn = step === 1
            ? '<button type="button" class="btn btn-outline" onclick="gv2BackToIntent()"><i class="fas fa-arrow-left"></i> Back</button>'
            : '<button type="button" class="btn btn-outline" onclick="gv2GoBack()"><i class="fas fa-arrow-left"></i> Back</button>';

        var fwdBtn;
        if (step === 2) {
            fwdBtn = '';
        } else if (step < _GV2_TOTAL_STEPS) {
            fwdBtn = '<button type="button" class="btn btn-primary" onclick="gv2GoNext()">Next <i class="fas fa-arrow-right"></i></button>';
        } else {
            fwdBtn = '<button type="button" class="btn btn-primary" onclick="gv2SaveManualSingle()"><i class="fas fa-check"></i> Create Game</button>';
        }

        actions.innerHTML =
            '<button type="button" class="btn btn-outline" onclick="gv2CancelWithWarning()">Cancel</button>' +
            backBtn + fwdBtn;
    }

    // ══════════════════════════════════════════════════════════════════════════
    // Navigation
    // ══════════════════════════════════════════════════════════════════════════

    window.gv2BackToIntent = function () { _openGameIntent(null); };

    window.gv2GoBack = function () {
        _gv2Step = Math.max(1, _gv2Step - 1);
        _gv2ActivateStep(_gv2Step);
    };

    window.gv2GoNext = function () {
        if (_gv2Step === 1) {
            var nameEl = document.getElementById('gv2Name');
            if (!nameEl || !nameEl.value.trim()) {
                if (nameEl) { nameEl.classList.add('input-error'); nameEl.focus(); }
                return;
            }
            if (nameEl) nameEl.classList.remove('input-error');
        }
        _gv2Step = Math.min(_GV2_TOTAL_STEPS, _gv2Step + 1);
        _gv2ActivateStep(_gv2Step);
    };

    function _gv2ActivateStep(step) {
        document.querySelectorAll('#gv2Stepper .add-step').forEach(function (el) {
            var s = parseInt(el.dataset.step, 10);
            el.classList.toggle('active', s === step);
            el.classList.toggle('done',   s < step);
        });
        for (var i = 1; i <= _GV2_TOTAL_STEPS; i++) {
            var pane = document.getElementById('gv2Pane' + i);
            if (pane) pane.classList.toggle('hidden', i !== step);
        }
        _gv2SetStepActions(step);
    }

    window.gv2CancelWithWarning = function () {
        if (confirm('Cancel adding this game? Your changes will be lost.')) {
            cancelGameEdit();
        }
    };

    // ══════════════════════════════════════════════════════════════════════════
    // Content picker helpers
    // ══════════════════════════════════════════════════════════════════════════

    window.gv2SetContentKind = function (btn) {
        var picker = btn.closest('.content-picker');
        if (!picker) return;
        var kind = btn.dataset.kind;
        picker.querySelectorAll('.content-kind-tab').forEach(function (t) { t.classList.toggle('active', t === btn); });
        picker.querySelectorAll('.content-pane').forEach(function (p) { p.classList.toggle('hidden', p.dataset.pane !== kind); });
    };

    window.gv2OnFileDrop = function (zone, event) {
        event.preventDefault();
        zone.classList.remove('drag-over');
        var file = event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0];
        if (file) gv2OnFileChange({ files: [file], _zone: zone });
    };

    window.gv2OnFileChange = function (input) {
        var file = input.files && input.files[0];
        if (!file) return;
        var picker = (input._zone && input._zone.closest('.content-picker')) ||
                     (input.closest && input.closest('.content-picker')) ||
                     document.getElementById('gv2ContentPicker');
        if (!picker) return;
        var nameEl = picker.querySelector('.cp-dropzone-name');
        if (nameEl) nameEl.textContent = file.name;
        var hidden = picker.querySelector('.cp-media-name');
        if (hidden) hidden.value = file.name;
    };

    // ══════════════════════════════════════════════════════════════════════════
    // Save helpers
    // ══════════════════════════════════════════════════════════════════════════

    // Validates, creates the game row, persists, and shows a toast.
    // Returns { id, name } on success, or null if validation failed (already
    // bounced the user back to step 1).
    function _gv2DoSave(questionType) {
        var nameEl = document.getElementById('gv2Name');
        var descEl = document.getElementById('gv2Desc');
        var name   = nameEl ? nameEl.value.trim() : '';
        var desc   = descEl ? descEl.value.trim() : '';

        if (!name) {
            _gv2Step = 1;
            _gv2ActivateStep(1);
            var n2 = document.getElementById('gv2Name');
            if (n2) { n2.classList.add('input-error'); n2.focus(); }
            return null;
        }

        var cover  = readGameCoverPicker() || randomGameCover();
        var tbody  = document.querySelector('#gamesTable tbody');
        if (!tbody) return null;

        var maxAttempts   = parseInt((document.getElementById('gv2MaxAttempts')   || {}).value, 10) || null;
        var qPerSession   = parseInt((document.getElementById('gv2QPerSession')   || {}).value, 10) || 5;
        var passThreshold = parseInt((document.getElementById('gv2PassThreshold') || {}).value, 10) || null;

        var newId   = Date.now();
        var gameObj = {
            id: newId, name: name, description: desc, cover: cover,
            active: true, scheduledDate: null,
            maxAttempts: maxAttempts, qPerSession: qPerSession, passThreshold: passThreshold,
            questionType: questionType || 'mcq', categories: []
        };

        tbody.insertAdjacentHTML('beforeend', gameRowHtml(gameObj, newId));
        var gameRow = document.querySelector('tr.row-game[data-game="' + newId + '"]');
        if (gameRow) updateGameRowChips(gameRow);

        persistGamesScope();
        updateGamesCount(document.querySelectorAll('#gamesTable tbody tr.row-game'));
        showGameToast('"' + name + '" added');
        return { id: newId, name: name };
    }

    // "Finish without questions" — saves the game and closes the panel cleanly.
    window.gv2FinishWithoutQuestions = function () {
        var saved = _gv2DoSave(null);
        if (!saved) return;
        showGameEmpty();
    };

    window.gv2SaveManualSingle = function () {
        var nameEl = document.getElementById('gv2Name');
        var descEl = document.getElementById('gv2Desc');
        var name   = nameEl ? nameEl.value.trim() : '';
        var desc   = descEl ? descEl.value.trim() : '';

        if (!name) {
            // Back to step 1 and flag the field.
            _gv2Step = 1;
            _gv2ActivateStep(1);
            var n2 = document.getElementById('gv2Name');
            if (n2) { n2.classList.add('input-error'); n2.focus(); }
            return;
        }

        var cover = readGameCoverPicker() || randomGameCover();

        var tbody = document.querySelector('#gamesTable tbody');
        if (!tbody) return;

        var maxAttempts   = parseInt((document.getElementById('gv2MaxAttempts')   || {}).value, 10) || null;
        var qPerSession   = parseInt((document.getElementById('gv2QPerSession')   || {}).value, 10) || 5;
        var passThreshold = parseInt((document.getElementById('gv2PassThreshold') || {}).value, 10) || null;
        var qtypeEl      = document.querySelector('#gv2QtypePicker .q-type-card.selected');
        var questionType = qtypeEl ? qtypeEl.dataset.qtype : 'mcq';

        var newId  = Date.now();
        var gameObj = {
            id: newId,
            name: name,
            description: desc,
            cover: cover,
            active: true,
            scheduledDate: null,
            maxAttempts: maxAttempts,
            qPerSession: qPerSession,
            passThreshold: passThreshold,
            questionType: questionType,
            categories: []
        };

        var gameHtml = gameRowHtml(gameObj, newId);
        tbody.insertAdjacentHTML('beforeend', gameHtml);
        var gameRow = document.querySelector('tr.row-game[data-game="' + newId + '"]');
        if (gameRow) updateGameRowChips(gameRow);

        persistGamesScope();
        updateGamesCount(document.querySelectorAll('#gamesTable tbody tr.row-game'));
        showGameToast('"' + name + '" added');

        var capturedId    = newId;
        var capturedName  = name;
        var capturedQType = questionType;

        window._postShareCallback = function () {
            _gv2OpenQuestionForm(capturedId, capturedName, capturedQType);
        };

        if (gameRow) {
            openGameSharePanel(gameRow, { isNew: true });
        } else {
            _gv2OpenQuestionForm(newId, name, capturedQType);
        }
    };

    // ══════════════════════════════════════════════════════════════════════════
    // Open question form for a pre-selected type (skips the type picker)
    // ══════════════════════════════════════════════════════════════════════════

    function _gv2OpenQuestionForm(gameId, gameName, questionType) {
        var gameRow = document.querySelector('tr.row-game[data-game="' + gameId + '"]');
        if (!gameRow) { showGameEmpty(); return; }

        // Silently create "Category 1" (mirrors showQTypePickerForNewGame)
        var catId  = Date.now();
        var newCat = { id: catId, name: 'Category 1', description: '', questions: [] };
        var tbody  = document.querySelector('#gamesTable tbody');
        if (tbody) {
            gameRow.insertAdjacentHTML('afterend', catRowHtml(newCat, gameId, gameRow.dataset.cover || ''));
            updateGameRowChips(gameRow);
            persistGamesScope();
        }

        // Remember context so "← Change type" can return to our step-2 picker.
        _gv2ActiveGameId = gameId;
        _gv2ActiveCatId  = catId;

        // Jump straight into the add-question form for the chosen type
        openAddQuestionForm(questionType, gameId, catId);
    }

    // ══════════════════════════════════════════════════════════════════════════
    // "← Change type" intercept — return to step-2 card picker
    // ══════════════════════════════════════════════════════════════════════════

    window.backToQTypePicker = function (gameId, catId) {
        // Only intercept calls that belong to the current v2 game.
        if (_gv2ActiveGameId && gameId === _gv2ActiveGameId) {
            _gv2ShowTypeChangePanel(gameId, catId);
            return;
        }
        if (typeof _origBackToQTypePicker === 'function') {
            _origBackToQTypePicker(gameId, catId);
        }
    };

    // ── Shared compact type-picker HTML (reused by change-type and Add Question) ──
    function _gv2CompactQTypePickerHtml(gameId, catId) {
        var cards = _GV2_QTYPES.map(function (t) {
            return (
                '<button type="button" class="q-type-card"' +
                '    data-qtype="' + t.key + '"' +
                '    onclick="openAddQuestionForm(\'' + escapeAttr(t.key) + '\',' + gameId + ',' + catId + ')">' +
                    '<span class="q-type-card-icon"><i class="fas ' + t.icon + '"></i></span>' +
                    '<span class="q-type-card-title">' + t.title + '</span>' +
                '</button>'
            );
        }).join('');
        return (
            '<p class="step-pane-lead">Choose the type of questions for this game:</p>' +
            '<div class="q-type-picker q-type-picker--sm">' + cards + '</div>'
        );
    }

    function _gv2ShowTypeChangePanel(gameId, catId) {
        // Stepper header with step 1 done, step 2 active.
        var labels = ['Game', 'Questions', 'Share'];
        var stepperHtml = '<div class="add-stepper">';
        labels.forEach(function (label, i) {
            if (i > 0) stepperHtml += '<div class="add-step-connector"></div>';
            var cls = i === 0 ? ' done' : i === 1 ? ' active' : '';
            stepperHtml +=
                '<div class="add-step' + cls + '" data-step="' + (i + 1) + '">' +
                    '<span class="add-step-num">' + (i + 1) + '</span>' +
                    '<span class="add-step-label">' + label + '</span>' +
                '</div>';
        });
        stepperHtml += '</div>';

        document.getElementById('gameEditTitle').textContent    = 'Add Game';
        document.getElementById('gameEditSubtitle').textContent = getGamesScopeSubtitle();
        document.getElementById('gameEditFields').innerHTML =
            stepperHtml +
            '<div class="add-step-pane">' + _gv2CompactQTypePickerHtml(gameId, catId) + '</div>';

        var actions = document.querySelector('#detailEdit .edit-actions');
        if (actions) {
            actions.innerHTML =
                '<button type="button" class="btn btn-outline" onclick="cancelGameEdit()">Cancel</button>';
        }

        showGameEdit();
    }

    // ── Override actionAddQuestion to use compact cards on the v2 page ────────
    window.actionAddQuestion = function (btn, evt) {
        evt.stopPropagation();
        closeAllGameMenus();
        var row = btn.closest('tr');
        if (!row) return;
        var gameId  = row.dataset.game;
        var catId   = row.dataset.cat;
        var catName = row.dataset.name || 'Category';

        _gameEditType = 'add-question';
        _gameEditRow  = row;

        document.getElementById('gameEditTitle').textContent    = 'Add Question';
        document.getElementById('gameEditSubtitle').textContent = catName;
        setGamePanelMode('add');

        document.getElementById('gameEditFields').innerHTML = _gv2CompactQTypePickerHtml(gameId, catId);

        var submitBtn = document.getElementById('gameSubmitBtn');
        if (submitBtn) submitBtn.classList.add('hidden');

        var actionsBar = document.querySelector('#detailEdit .edit-actions');
        if (actionsBar) {
            actionsBar.innerHTML =
                '<button type="button" class="btn btn-outline" onclick="showGameEmpty()">Cancel</button>';
        }

        showGameEdit();
    };

    // ── Override openAddQuestion on the v2 questions page ─────────────────────
    // script-questions.js defines openAddQuestion using the full-size picker.
    // When that script has already run (i.e. this file loads after it), wrap it
    // so the compact 2-column grid is shown instead.
    if (typeof window.openAddQuestion === 'function') {
        var _origOpenAddQ = window.openAddQuestion;
        window.openAddQuestion = function () {
            // Run original first: validates _qCat/_qNav, sets title, subtitle, etc.
            _origOpenAddQ();
            // Now swap the full-size picker for the compact grid.
            var fieldsEl = document.getElementById('gameEditFields');
            if (!fieldsEl) return;
            var firstCard = fieldsEl.querySelector('.q-type-card');
            if (!firstCard) return;
            // Parse gameId and catId from the existing card's onclick attribute.
            var m = (firstCard.getAttribute('onclick') || '')
                        .match(/openAddQuestionForm\('([^']+)',\s*(\d+),\s*(\d+)\)/);
            if (!m) return;
            fieldsEl.innerHTML = _gv2CompactQTypePickerHtml(m[2], m[3]);
        };
    }

    // ══════════════════════════════════════════════════════════════════════════
    // Step 3 — share panel rendered inline in the stepper (detailEdit)
    // ══════════════════════════════════════════════════════════════════════════

    function _gv2OpenShareStep(gameRow) {
        var name       = gameRow.dataset.name            || '';
        var existStart = gameRow.dataset.scheduledDate    || '';
        var existEnd   = gameRow.dataset.scheduledEndDate || '';
        var companyKey = _currentGameScope.companyKey;

        var gCompanies  = (typeof GAMES_SIDEBAR_COMPANIES   !== 'undefined') ? GAMES_SIDEBAR_COMPANIES   : [];
        var gDepts      = (typeof GAMES_SIDEBAR_DEPARTMENTS !== 'undefined') ? GAMES_SIDEBAR_DEPARTMENTS : [];
        var company     = gCompanies.find(function (c) { return c.name.toLowerCase() === companyKey; });
        if (!company) { showGameToast('Select a company first'); return; }

        var allDepts    = gDepts.filter(function (d) { return d.companyId === company.id; });
        var sharedNow   = new Set(getGameSharedDepts(companyKey, name));
        var currentDept = (_currentGameScope && _currentGameScope.dept) || '';

        // Populate the same target structure that confirmGameSharePanel() reads.
        window._currentGameShareTarget = {
            name: name, row: gameRow,
            sharedDepts: Array.from(sharedNow), isNew: true,
            initialStart: existStart, initialEnd: existEnd
        };
        window._postShareCallback = null;

        var items = allDepts.map(function (d) {
            var already  = sharedNow.has(d.name);
            var precheck = already || d.name === currentDept;
            return (
                '<label class="share-dept-item">' +
                    '<input type="checkbox" value="' + escapeAttr(d.name) + '"' + (precheck ? ' checked' : '') + '>' +
                    '<span class="share-dept-name">' + escapeAttr(d.name) + '</span>' +
                '</label>'
            );
        }).join('') || '<p class="share-empty">No departments to share with.</p>';

        // Stepper header — steps 1 + 2 done, step 3 active
        var stepLabels  = ['Game', 'Questions', 'Share'];
        var stepperHtml = '<div class="add-stepper">';
        stepLabels.forEach(function (label, i) {
            if (i > 0) stepperHtml += '<div class="add-step-connector"></div>';
            var cls = i < 2 ? ' done' : ' active';
            stepperHtml +=
                '<div class="add-step' + cls + '" data-step="' + (i + 1) + '">' +
                    '<span class="add-step-num">' + (i + 1) + '</span>' +
                    '<span class="add-step-label">' + label + '</span>' +
                '</div>';
        });
        stepperHtml += '</div>';

        // Use the same list id (#gameShareDeptList) so confirmGameSharePanel() works unmodified.
        document.getElementById('gameEditBadge').innerHTML     = '<i class="fas fa-plus"></i> Adding';
        document.getElementById('gameEditTitle').textContent   = 'Add Game';
        document.getElementById('gameEditSubtitle').textContent = getGamesScopeSubtitle();
        document.getElementById('gameEditFields').innerHTML =
            stepperHtml +
            '<div class="add-step-pane">' +
                '<p class="step-pane-lead"><strong>' + escapeAttr(name) + '</strong></p>' +
                '<div class="share-dept-list" id="gameShareDeptList">' + items + '</div>' +
            '</div>';

        var actions = document.querySelector('#detailEdit .edit-actions');
        if (actions) {
            actions.innerHTML =
                '<button type="button" class="btn btn-outline" onclick="cancelGameEdit()">Cancel</button>' +
                '<button type="button" class="btn btn-outline" onclick="window.location.href=\'index-questions-v2.html\'">' +
                    '<i class="fas fa-arrow-left"></i> Back</button>' +
                '<button type="button" class="btn btn-primary" onclick="confirmGameSharePanel()">Share</button>';
        }

        setGamePanelMode('add');
        showGameEdit();
    }

    // ══════════════════════════════════════════════════════════════════════════
    // "Done" return — open share panel for the game that was just set up
    // ══════════════════════════════════════════════════════════════════════════
    // index-questions-v2.html stores { gameId } in gameon.pendingShare before
    // navigating back here.  We intercept renderGamesForScope so that right
    // after the list renders we can find that game's row and open its share
    // panel inline (step 3 of the Add Game stepper).
    $(function () {
        var pending = null;
        try { pending = JSON.parse(localStorage.getItem('gameon.pendingShare') || 'null'); } catch (e) {}
        if (!pending || !pending.gameId) return;

        localStorage.removeItem('gameon.pendingShare');
        var targetId = String(pending.gameId);

        // Wrap renderGamesForScope once; restore original after first call.
        var _origRender = window.renderGamesForScope;
        window.renderGamesForScope = function (companyKey, dept) {
            if (typeof _origRender === 'function') _origRender(companyKey, dept);
            // Restore immediately so subsequent scope-changes use the real function.
            window.renderGamesForScope = _origRender;
            // Allow the DOM to settle before looking up the row.
            setTimeout(function () {
                var gameRow = document.querySelector('tr.row-game[data-game="' + targetId + '"]');
                if (gameRow) _gv2OpenShareStep(gameRow);
            }, 100);
        };
    });

}());
