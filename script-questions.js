// script-questions.js — Questions page logic.
// Loaded after script-games.js; overrides save/navigate behaviour for this page.

(function() {
    'use strict';

    var _qNav  = null;   // nav context stored by games page
    var _qGame = null;   // game object
    var _qCat  = null;   // category object

    // ===== Nav context =====
    function readNavContext() {
        try { _qNav = JSON.parse(localStorage.getItem('gameon.questionsNav') || 'null'); } catch(e) { _qNav = null; }
        return _qNav;
    }

    function loadGameCat() {
        if (!_qNav) return false;
        // Set global scope so shared functions (showGameToast, etc.) work
        if (typeof _currentGameScope !== 'undefined') {
            _currentGameScope.companyKey = _qNav.companyKey || '';
            _currentGameScope.dept       = _qNav.dept       || '';
            _currentGameScope.deptName   = _qNav.deptName   || '';
        }
        try {
            var saved = localStorage.getItem('gameon.games.scope');
            if (!saved) return false;
            var allScopes = JSON.parse(saved);
            var key   = _qNav.companyKey + '|' + _qNav.dept;
            var games = allScopes[key] || [];
            for (var i = 0; i < games.length; i++) {
                if (String(games[i].id) === String(_qNav.gameId)) {
                    _qGame = games[i];
                    for (var j = 0; j < _qGame.categories.length; j++) {
                        if (String(_qGame.categories[j].id) === String(_qNav.catId)) {
                            _qCat = _qGame.categories[j];
                            return true;
                        }
                    }
                }
            }
        } catch(e) {}
        return false;
    }

    function saveQuestionsToStorage() {
        try {
            var key      = _qNav.companyKey + '|' + _qNav.dept;
            var saved    = localStorage.getItem('gameon.games.scope');
            var allScopes = saved ? JSON.parse(saved) : {};
            var games    = allScopes[key] || [];
            for (var i = 0; i < games.length; i++) {
                if (String(games[i].id) === String(_qNav.gameId)) {
                    for (var j = 0; j < games[i].categories.length; j++) {
                        if (String(games[i].categories[j].id) === String(_qNav.catId)) {
                            games[i].categories[j] = _qCat;
                        }
                    }
                }
            }
            allScopes[key] = games;
            localStorage.setItem('gameon.games.scope', JSON.stringify(allScopes));
        } catch(e) {}
    }

    // ===== Render =====
    function renderQuestionsPage() {
        var questions = _qCat ? (_qCat.questions || []) : [];

        var subtitleEl = document.getElementById('questionsSubtitle');
        if (subtitleEl) subtitleEl.textContent = _qNav ? (_qNav.deptName || _qNav.companyKey || '') : '';

        var warning = document.getElementById('questionsWarning');
        if (warning) warning.hidden = questions.length >= 5;

        var doneBar = document.getElementById('questionsDoneBar');
        if (doneBar) doneBar.hidden = false;

        var listEl = document.getElementById('questionsList');
        if (listEl) {
            listEl.hidden = false;
            renderQuestionRows(questions);
        }
    }

    var TYPE_LABELS = {
        'mcq':         'MCQ',
        'fill-blank':  'Fill in Blank',
        'stmt-blank':  'Stmt Blanking',
        'select-img':  'Select on Image',
        'match-terms': 'Match Terms',
        'word-bucket': 'Word Bucket',
        'crossword':   'Crossword'
    };

    function renderQuestionRows(questions) {
        var listEl = document.getElementById('questionsList');
        if (!listEl) return;
        listEl.innerHTML = questions.map(function(q, idx) {
            var typeLabel  = TYPE_LABELS[q.questionType] || 'MCQ';
            var answerChips = (q.options || []).map(function(opt, oi) {
                var isCorrect = (oi === q.correct);
                return '<span class="q-answer-chip' + (isCorrect ? ' q-answer-chip--correct' : '') + '">' + escapeAttr(opt) + '</span>';
            }).join('');
            return '<div class="qlist-row">' +
                '<div class="qlist-main">' +
                    '<div class="qlist-text-row">' +
                        '<span class="qlist-num">' + (idx + 1) + '.</span>' +
                        '<span class="qlist-text">' + escapeAttr(q.text) + '</span>' +
                        '<span class="chip chip-qtype">' + typeLabel + '</span>' +
                    '</div>' +
                    '<div class="qlist-chips">' + answerChips + '</div>' +
                '</div>' +
                '<div class="qlist-actions">' +
                    '<button type="button" class="btn-icon" onclick="editQuestion(' + idx + ')" title="Edit"><i class="fas fa-pen"></i></button>' +
                    '<button type="button" class="btn-icon btn-icon-danger" onclick="deleteQuestion(' + idx + ')" title="Delete"><i class="fas fa-trash"></i></button>' +
                '</div>' +
            '</div>';
        }).join('');
    }

    // ===== Add Question panel =====
    window.openAddQuestion = function() {
        if (!_qCat || !_qNav) return;
        var gameId = _qNav.gameId;
        var catId  = _qNav.catId;

        document.getElementById('gameEditTitle').textContent    = 'Add Question';
        document.getElementById('gameEditSubtitle').textContent = _qCat.name || '';

        var badge = document.getElementById('gameEditBadge');
        if (badge) { badge.innerHTML = '<i class="fas fa-plus"></i> Adding'; badge.classList.remove('badge-ai'); }

        document.getElementById('gameEditFields').innerHTML = _renderQTypePickerHtml(gameId, catId);

        var submitBtn = document.getElementById('gameSubmitBtn');
        if (submitBtn) submitBtn.hidden = true;

        var actionsBar = document.querySelector('#detailEdit .edit-actions');
        if (actionsBar) {
            actionsBar.innerHTML =
                '<button type="button" class="btn btn-outline" onclick="closeQPanel()">Cancel</button>';
        }
        showGameEdit();
    };

    window.closeQPanel = function() { showGameEmpty(); };

    window.goBackToGames = function() { window.location.href = 'index-games.html'; };

    // ===== Override: save question directly to localStorage (no DOM table on this page) =====
    window._doSaveQuestion = function(gameId, catId) {
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
        var correct   = correctEl ? parseInt(correctEl.value, 10) : 0;
        var diffEl    = form.querySelector('select[name="difficulty"]');
        var difficulty = diffEl ? diffEl.value : '';
        var typeEl    = form.querySelector('input[name="questionType"]');
        var qType     = typeEl ? typeEl.value : 'mcq';

        var newQ = {
            id:           Date.now() + Math.floor(Math.random() * 1000),
            text:         text,
            options:      opts,
            correct:      correct,
            difficulty:   difficulty,
            questionType: qType
        };

        if (!_qCat.questions) _qCat.questions = [];
        _qCat.questions.push(newQ);
        saveQuestionsToStorage();
        showGameToast('Question added');
        return true;
    };

    // ===== Override: stay on questions page after save =====
    window.submitAddQuestion = function(gameId, catId) {
        if (window._doSaveQuestion(gameId, catId)) {
            showGameEmpty();
            renderQuestionsPage();
            showQSavedToast();
        }
    };

    window.saveQAndAddAnother = function(gameId, catId) {
        if (window._doSaveQuestion(gameId, catId)) {
            renderQuestionsPage();
            window.openAddQuestion();
        }
    };

    // ===== Success toast =====
    function showQSavedToast() {
        var el = document.getElementById('questionsSavedToast');
        if (!el) return;
        el.hidden = false;
        setTimeout(function() { el.hidden = true; }, 3500);
    }

    // ===== Question row actions =====
    window.deleteQuestion = function(idx) {
        if (!_qCat || !confirm('Delete this question? This cannot be undone.')) return;
        _qCat.questions.splice(idx, 1);
        saveQuestionsToStorage();
        renderQuestionsPage();
        showGameToast('Question deleted');
    };

    window.editQuestion = function(idx) {
        showGameToast('Edit question coming soon');
    };

    // ===== Override: prevent onGamesScope from re-rendering the games table =====
    window.onGamesScope = function() { /* no-op on questions page */ };

    // ===== Init =====
    document.addEventListener('DOMContentLoaded', function() {
        readNavContext();
        if (!_qNav) {
            window.location.href = 'index-games.html';
            return;
        }
        loadGameCat();
        renderQuestionsPage();

        if (_qNav.openPicker) {
            // Small delay so the panel is ready
            setTimeout(function() { window.openAddQuestion(); }, 100);
        } else if (_qCat && _qCat.questions && _qCat.questions.length > 0) {
            // Arrived here after saving a question — show confirmation toast
            showQSavedToast();
        }
    });

})();
