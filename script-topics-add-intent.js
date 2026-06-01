// =============================================================================
// Topics Add Flow v2 — Intent-first
//
// Overrides addTopic() from script-topics.js.
// Must be loaded AFTER script-topics.js (index-topics-v2.html only).
//
// Flows:
//   Intent screen  →  Manual + Single      →  Content → Sharing
//                 └→  Manual + Sub-topics  →  Topic → Sub-topics → Sharing
//                 └→  AI (single or subs)  →  Prompt → Review → Sharing
// =============================================================================

var _v2Config      = null;
// shape: { structure, method, createGame, totalSteps, stepLabels, stepTypes }

var _v2AISuggestion = null;
// Populated by v2AIGenerate(); consumed by v2FillAIReview().

var _v2KeepFields = {};
// Tracks which review fields are locked against regeneration.
// Keys: 'name', 'description', 'content', 'sub-N'.

var _v2DragSrc = null;
// The .ai-sub-item currently being dragged (HTML5 drag-and-drop).

// ── Entry point (shadows addTopic from script-topics.js) ─────────────────────
function addTopic() {
    clearSelection();
    currentEditRow = null;
    currentEditType = 'topic';
    currentViewRow  = null;
    _editingSubIdx  = null;
    _v2Config       = null;

    // Clear the review-mode flex layout class from any previous open.
    var _deEl = document.getElementById('detailEdit');
    if (_deEl) _deEl.classList.remove('v2-review-active');

    document.getElementById('editTitle').textContent    = 'Add Topic';
    document.getElementById('editSubtitle').textContent = getScopeSubtitle();

    document.getElementById('editFields').innerHTML = v2IntentHtml();
    setPanelMode('add');
    v2SetActions('intent', 0);
    showEdit();
}

// ── Intent screen HTML ────────────────────────────────────────────────────────
function v2IntentHtml() {
    return [
        '<div class="intent-screen" id="v2IntentScreen">',

        '  <div class="intent-group">',
        '    <p class="intent-group-label">How would you like to create it?</p>',
        '    <div class="intent-cards">',

        '      <button type="button" class="intent-card selected"',
        '          data-group="method" data-value="manual" onclick="v2PickIntent(this)">',
        '        <span class="intent-icon"><i class="fas fa-pen"></i></span>',
        '        <span class="intent-body">',
        '          <span class="intent-title">Manually</span>',
        '          <span class="intent-desc">Fill in the details and content yourself</span>',
        '        </span>',
        '        <span class="intent-check"><i class="fas fa-check"></i></span>',
        '      </button>',

        '      <button type="button" class="intent-card"',
        '          data-group="method" data-value="ai" onclick="v2PickIntent(this)">',
        '        <span class="intent-icon"><i class="fas fa-wand-magic-sparkles"></i></span>',
        '        <span class="intent-body">',
        '          <span class="intent-title">Generate with AI</span>',
        '          <span class="intent-desc">Upload a file or paste text — AI does the rest</span>',
        '        </span>',
        '        <span class="intent-check"><i class="fas fa-check"></i></span>',
        '      </button>',

        '    </div>',
        '  </div>',

        '  <div class="intent-group">',
        '    <p class="intent-group-label">What are you building?</p>',
        '    <div class="intent-cards">',

        '      <button type="button" class="intent-card selected"',
        '          data-group="structure" data-value="single" onclick="v2PickIntent(this)">',
        '        <span class="intent-icon"><i class="fas fa-file-alt"></i></span>',
        '        <span class="intent-body">',
        '          <span class="intent-title">Single topic</span>',
        '          <span class="intent-desc">One piece of content — a file, video or text</span>',
        '        </span>',
        '        <span class="intent-check"><i class="fas fa-check"></i></span>',
        '      </button>',

        '      <button type="button" class="intent-card"',
        '          data-group="structure" data-value="subtopics" onclick="v2PickIntent(this)">',
        '        <span class="intent-icon"><i class="fas fa-layer-group"></i></span>',
        '        <span class="intent-body">',
        '          <span class="intent-title">With sub-topics</span>',
        '          <span class="intent-desc">A container that groups multiple learning modules</span>',
        '        </span>',
        '        <span class="intent-check"><i class="fas fa-check"></i></span>',
        '      </button>',

        '    </div>',
        '  </div>',

        '</div>'
    ].join('\n');
}

// Toggle selection within a group (structure or method).
function v2PickIntent(btn) {
    var group = btn.dataset.group;
    document.querySelectorAll('.intent-card[data-group="' + group + '"]').forEach(function(c) {
        c.classList.remove('selected');
    });
    btn.classList.add('selected');
}

// ── Action bar ────────────────────────────────────────────────────────────────
// mode: 'intent' | 'step'
function v2SetActions(mode, step) {
    var actions = document.querySelector('#detailEdit .edit-actions');
    if (!actions) return;

    if (mode === 'intent') {
        actions.innerHTML =
            '<button type="button" class="btn btn-outline" onclick="cancelEdit()">Cancel</button>' +
            '<button type="button" class="btn btn-primary" onclick="v2Proceed()">Next <i class="fas fa-arrow-right"></i></button>';
        return;
    }

    var total   = _v2Config ? _v2Config.totalSteps : 3;
    var backBtn = step > 1
        ? '<button type="button" class="btn btn-outline" onclick="v2GoBack()"><i class="fas fa-arrow-left"></i> Back</button>'
        : '<button type="button" class="btn btn-outline" onclick="v2BackToIntent()"><i class="fas fa-arrow-left"></i> Back</button>';
    var fwdBtn;
    var curStepType = _v2Config ? _v2Config.stepTypes[step - 1] : '';

    if (curStepType === 'ai-prompt') {
        // Generate Topic replaces Next — it validates, generates, and advances.
        fwdBtn = '<button type="button" class="btn btn-ai" onclick="v2AIGenerate()">' +
                 '<i class="fas fa-wand-magic-sparkles"></i> Generate Topic</button>';
    } else if (curStepType === 'ai-review') {
        // Offer Regenerate (keeps locked fields) alongside Next.
        fwdBtn = '<button type="button" class="btn btn-ai" onclick="v2AIRegenerate()">' +
                 '<i class="fas fa-wand-magic-sparkles"></i> Regenerate</button>' +
                 '<button type="button" class="btn btn-primary" onclick="v2GoNext()">Next <i class="fas fa-arrow-right"></i></button>';
    } else if (curStepType === 'ai-subtopics') {
        // Sub-topics accordion step — Regenerate respects per-sub-topic Keep locks.
        fwdBtn = '<button type="button" class="btn btn-ai" onclick="v2AIRegenerateSubs()">' +
                 '<i class="fas fa-wand-magic-sparkles"></i> Regenerate</button>' +
                 '<button type="button" class="btn btn-primary" onclick="v2GoNext()">Next <i class="fas fa-arrow-right"></i></button>';
    } else if (step < total) {
        fwdBtn = '<button type="button" class="btn btn-primary" onclick="v2GoNext()">Next <i class="fas fa-arrow-right"></i></button>';
    } else {
        fwdBtn = '<button type="button" class="btn btn-outline" onclick="v2Commit(true)"><i class="fas fa-trophy"></i> Create Game</button>' +
                 '<button type="button" class="btn btn-primary" onclick="v2Commit(false)"><i class="fas fa-check"></i> Done</button>';
    }

    // Cancel on any stepper step warns the user they will lose their work.
    actions.innerHTML =
        '<button type="button" class="btn btn-outline" onclick="v2CancelWithWarning()">Cancel</button>' +
        backBtn + fwdBtn;
}

// ── Intent → stepper ──────────────────────────────────────────────────────────
function v2Proceed() {
    var structure = (document.querySelector('.intent-card.selected[data-group="structure"]') || {}).dataset || {};
    var method    = (document.querySelector('.intent-card.selected[data-group="method"]')    || {}).dataset || {};
    structure = structure.value || 'single';
    method    = method.value    || 'manual';

    var stepLabels, stepTypes, totalSteps;
    if (method === 'ai' && structure === 'subtopics') {
        stepLabels = ['Create', 'Topic', 'Sub-topics', 'Share'];
        stepTypes  = ['ai-prompt', 'ai-review', 'ai-subtopics', 'sharing'];
        totalSteps = 4;
    } else if (method === 'ai') {
        stepLabels = ['Create', 'Topic', 'Share'];
        stepTypes  = ['ai-prompt', 'ai-review', 'sharing'];
        totalSteps = 3;
    } else if (structure === 'subtopics') {
        stepLabels = ['Topic', 'Sub-topics', 'Share'];
        stepTypes  = ['details', 'subtopics', 'sharing'];
        totalSteps = 3;
    } else {
        stepLabels = ['Topic', 'Share'];
        stepTypes  = ['content-single', 'sharing'];
        totalSteps = 2;
    }

    _v2Config = { structure: structure, method: method, totalSteps: totalSteps, stepLabels: stepLabels, stepTypes: stepTypes };

    // Show AI credit counter in the edit topbar for AI flows (mirrors addTopicAI behaviour).
    if (method === 'ai') {
        var companyKey = (_currentScope && _currentScope.companyKey) || '';
        var usedNow    = _companyCreditsUsed[companyKey] || 0;
        var totalNow   = getCompanyCreditsTotal(companyKey);
        var countEl    = document.getElementById('aiCreditsCount');
        if (countEl) countEl.textContent = usedNow;
        var totalEl    = document.getElementById('aiCreditsTotal');
        if (totalEl) totalEl.textContent = totalNow;
        var creditsEl  = document.getElementById('aiCreditsDisplay');
        if (creditsEl) creditsEl.hidden = false;
    }

    v2BuildStepper();
}

// ── Back to intent screen from step 1 ────────────────────────────────────────
function v2BackToIntent() {
    // Remove the review-mode flex layout class.
    var _deEl2 = document.getElementById('detailEdit');
    if (_deEl2) _deEl2.classList.remove('v2-review-active');

    // Remember both choices so we can restore the selections.
    var prevStructure = _v2Config ? _v2Config.structure : 'single';
    var prevMethod    = _v2Config ? _v2Config.method    : 'manual';
    _v2Config = null;
    _v2AISuggestion = null;

    document.getElementById('editFields').innerHTML = v2IntentHtml();
    v2SetActions('intent', 0);

    // Re-apply the previous selections.
    var selStructure = document.querySelector('.intent-card[data-group="structure"][data-value="' + prevStructure + '"]');
    if (selStructure) {
        document.querySelectorAll('.intent-card[data-group="structure"]').forEach(function(c) { c.classList.remove('selected'); });
        selStructure.classList.add('selected');
    }
    var selMethod = document.querySelector('.intent-card[data-group="method"][data-value="' + prevMethod + '"]');
    if (selMethod) {
        document.querySelectorAll('.intent-card[data-group="method"]').forEach(function(c) { c.classList.remove('selected'); });
        selMethod.classList.add('selected');
    }
}

// ── Stepper ───────────────────────────────────────────────────────────────────
function v2BuildStepper() {
    var cfg = _v2Config;

    // Stepper header
    var html = '<div class="add-stepper" id="v2Stepper">';
    cfg.stepLabels.forEach(function(label, i) {
        if (i > 0) html += '<div class="add-step-connector"></div>';
        html +=
            '<div class="add-step' + (i === 0 ? ' active' : '') + '" data-step="' + (i + 1) + '">' +
                '<span class="add-step-num">' + (i + 1) + '</span>' +
                '<span class="add-step-label">' + label + '</span>' +
            '</div>';
    });
    html += '</div>';

    // Step panes
    for (var i = 1; i <= cfg.totalSteps; i++) {
        html += '<div class="add-step-pane' + (i > 1 ? ' hidden' : '') + '" id="v2Pane' + i + '">' +
                    v2PaneHtml(i) +
                '</div>';
    }

    document.getElementById('editFields').innerHTML = html;
    v2SetActions('step', 1);
}

function v2PaneHtml(step) {
    var cfg = _v2Config;
    if (!cfg) return '';
    var type = cfg.stepTypes[step - 1];

    // ── AI: Prompt ───────────────────────────────────────────────────────────
    if (type === 'ai-prompt') {
        // Cover is chosen here (user decision, not AI-generated).
        // AI model is on the intent screen.
        // "Create sub-topics" toggle is not needed — structure chosen on intent screen.
        // "Generate Topic" button moves to the action bar (replaces Next).
        return [
            '<div class="form-group">',
            '  <label>Cover image</label>',
            '  ' + coverPickerHtml(''),
            '</div>',
            '<div class="form-group" id="aiUploadSection">',
            '  <label>Upload</label>',
            '  <div class="ai-upload-zone" id="aiUploadZone"',
            '       onclick="document.getElementById(\'aiFileInput\').click()"',
            '       ondragover="event.preventDefault();this.classList.add(\'drag-over\')"',
            '       ondragleave="this.classList.remove(\'drag-over\')"',
            '       ondrop="onAIFileDrop(this,event)">',
            '    <input type="file" id="aiFileInput" hidden onchange="onAIFileChange(this)">',
            '    <i class="fas fa-cloud-upload-alt ai-upload-icon"></i>',
            '    <span class="ai-upload-prompt" id="aiUploadPrompt">Drop a file or click to upload</span>',
            '  </div>',
            '</div>',
            '<div class="form-group" id="aiUrlSection">',
            '  <label>URL</label>',
            '  <div class="ai-url-list" id="aiUrlList">',
            '    <div class="ai-url-row">',
            '      <div class="ai-url-input-wrap">',
            '        <input type="url" class="ai-text-input ai-url-input" placeholder="https://…"',
            '               oninput="aiUrlValidate(this); updateAIGenerateBtn()">',
            '        <i class="ai-url-status-icon fas"></i>',
            '      </div>',
            '      <button type="button" class="ai-url-remove-btn" onclick="aiUrlRemove(this)" title="Remove URL" hidden>',
            '        <i class="fas fa-times"></i>',
            '      </button>',
            '    </div>',
            '  </div>',
            '  <button type="button" class="ai-url-add-btn" onclick="aiUrlAdd()">',
            '    <i class="fas fa-plus"></i> Add URL',
            '  </button>',
            '</div>',
            '<div class="form-group" id="aiTextSection">',
            '  <label>Text</label>',
            '  <div class="rte-toolbar">',
            '    <button type="button" class="rte-btn" title="Bold"',
            '            onmousedown="event.preventDefault();document.execCommand(\'bold\')"><i class="fas fa-bold"></i></button>',
            '    <button type="button" class="rte-btn" title="Italic"',
            '            onmousedown="event.preventDefault();document.execCommand(\'italic\')"><i class="fas fa-italic"></i></button>',
            '    <button type="button" class="rte-btn" title="Underline"',
            '            onmousedown="event.preventDefault();document.execCommand(\'underline\')"><i class="fas fa-underline"></i></button>',
            '    <span class="rte-sep"></span>',
            '    <button type="button" class="rte-btn" title="Bullet list"',
            '            onmousedown="event.preventDefault();document.execCommand(\'insertUnorderedList\')"><i class="fas fa-list-ul"></i></button>',
            '    <button type="button" class="rte-btn" title="Numbered list"',
            '            onmousedown="event.preventDefault();document.execCommand(\'insertOrderedList\')"><i class="fas fa-list-ol"></i></button>',
            '  </div>',
            '  <div id="aiTextInput" class="ai-rte" contenteditable="true"',
            '       data-placeholder="Paste text, notes, or reference material…"',
            '       oninput="updateAIGenerateBtn()"></div>',
            '</div>',
            '<div class="ai-generate-block">',
            '  <div class="form-group">',
            '    <label>AI Model</label>',
            '    <select id="v2AiModel" class="ai-model-select">',
            '      <option value="claude-sonnet-4-6" selected>Claude Sonnet 4.6 — Recommended</option>',
            '      <option value="claude-opus-4-7">Claude Opus 4.7 — Most capable</option>',
            '      <option value="claude-haiku-4-5">Claude Haiku 4.5 — Fastest</option>',
            '      <option value="gpt-4o">GPT-4o</option>',
            '      <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>',
            '    </select>',
            '  </div>',
            '  <div class="form-group">',
            '    <input type="text" class="ai-text-input" id="aiPromptText"',
            '           placeholder="What learning content would you like to create today?">',
            '  </div>',
            '</div>'
        ].join('\n');
    }

    // ── AI: Review ───────────────────────────────────────────────────────────
    if (type === 'ai-review') {
        return '<div id="v2AiReviewContent"></div>';
    }

    // ── AI: Sub-topics accordion ──────────────────────────────────────────────
    if (type === 'ai-subtopics') {
        return '<div id="v2AiSubtopicsContent"></div>';
    }

    // ── Content + Details combined (single topic) ────────────────────────────
    if (type === 'content-single') {
        return [
            '<div class="form-group">',
            '  <label>Cover image</label>',
            '  ' + coverPickerHtml(''),
            '</div>',
            '<div class="form-group">',
            '  <label>Topic name <span class="required-mark">*</span></label>',
            '  <input type="text" id="v2Name" name="name" required placeholder="Topic name">',
            '</div>',
            '<div class="form-group">',
            '  <label>Description</label>',
            '  <input type="text" id="v2Desc" name="description" placeholder="Topic description">',
            '</div>',
            '<div class="form-group">',
            '  <label>Content</label>',
            '  ' + contentPickerHtml('topic-content', { kind: 'upload', mediaType: 'PDF', mediaName: '' }),
            '</div>'
        ].join('\n');
    }

    // ── Details only (sub-topics flow) ───────────────────────────────────────
    if (type === 'details') {
        return [
            '<div class="form-group">',
            '  <label>Cover image</label>',
            '  ' + coverPickerHtml(''),
            '</div>',
            '<div class="form-group">',
            '  <label>Topic name <span class="required-mark">*</span></label>',
            '  <input type="text" id="v2Name" name="name" required placeholder="Topic name">',
            '</div>',
            '<div class="form-group">',
            '  <label>Description</label>',
            '  <input type="text" id="v2Desc" name="description" placeholder="Topic description">',
            '</div>'
        ].join('\n');
    }

    // ── Sub-topics editor ────────────────────────────────────────────────────
    if (type === 'subtopics') {
        return [
            '<div class="sub-list-section hidden" id="subsListSection">',
            '  <div class="sub-list-head">',
            '    <label>Sub-topics</label>',
            '    <span class="sub-list-count-wrap"><span id="subsListCount">0</span> added</span>',
            '  </div>',
            '  <div id="subsList" class="sub-list"></div>',
            '</div>',
            '<div id="subEditor" class="sub-editor hidden"></div>',
            '<div class="add-sub-row hidden" id="addSubTopicBtnRow">',
            '  <button type="button" class="btn btn-outline btn-add-sub" onclick="openSubEditor(\'new\')">',
            '    <i class="fas fa-plus"></i> Add another sub-topic',
            '  </button>',
            '</div>'
        ].join('\n');
    }

    // ── Sharing ──────────────────────────────────────────────────────────────
    if (type === 'sharing') {
        return [
            '<p class="step-pane-lead">Choose which departments to share this topic with:</p>',
            '<div id="v2ShareList" class="share-dept-list"></div>'
        ].join('\n');
    }

    // ── Game ─────────────────────────────────────────────────────────────────
    if (type === 'game') {
        return [
            '<p class="step-pane-lead">Would you like to create a game for this topic?</p>',
            '<div class="game-option-cards">',

            '  <button type="button" class="game-option-card selected" data-game="none" onclick="selectGameOption(this)">',
            '    <span class="goc-icon"><i class="fas fa-times"></i></span>',
            '    <span class="goc-body">',
            '      <span class="goc-title">No game</span>',
            '      <span class="goc-desc">Skip for now — you can always add a game later.</span>',
            '    </span>',
            '  </button>',

            '  <button type="button" class="game-option-card" data-game="normal" onclick="selectGameOption(this)">',
            '    <span class="goc-icon"><i class="fas fa-trophy"></i></span>',
            '    <span class="goc-body">',
            '      <span class="goc-title">Create a game</span>',
            '      <span class="goc-desc">Set up a game manually with questions and rules.</span>',
            '    </span>',
            '  </button>',

            '  <button type="button" class="game-option-card" data-game="ai" onclick="selectGameOption(this)">',
            '    <span class="goc-icon"><i class="fas fa-wand-magic-sparkles"></i></span>',
            '    <span class="goc-body">',
            '      <span class="goc-title">Generate with AI</span>',
            '      <span class="goc-desc">Let AI create a game based on the topic content.</span>',
            '    </span>',
            '  </button>',

            '</div>'
        ].join('\n');
    }

    return '';
}

// ── Step navigation ───────────────────────────────────────────────────────────
function v2CurrentStep() {
    var steps = document.querySelectorAll('#v2Stepper .add-step');
    for (var i = 0; i < steps.length; i++) {
        if (steps[i].classList.contains('active')) return parseInt(steps[i].dataset.step);
    }
    return 1;
}

function v2SwitchTo(step) {
    var total = _v2Config ? _v2Config.totalSteps : 4;

    // Update step indicators
    document.querySelectorAll('#v2Stepper .add-step').forEach(function(s) {
        var n = parseInt(s.dataset.step);
        s.classList.remove('active', 'done');
        if      (n < step)  s.classList.add('done');
        else if (n === step) s.classList.add('active');
    });

    // Show/hide panes
    for (var i = 1; i <= total; i++) {
        var pane = document.getElementById('v2Pane' + i);
        if (pane) pane.classList.toggle('hidden', i !== step);
    }

    v2SetActions('step', step);

    var stepType = _v2Config ? _v2Config.stepTypes[step - 1] : '';

    // Keep panel header/stepper/actions pinned; let content area scroll internally.
    var _deEl3 = document.getElementById('detailEdit');
    if (_deEl3) _deEl3.classList.toggle('v2-review-active', stepType === 'ai-review' || stepType === 'ai-subtopics');

    // Lazy-fill sharing when arriving at the sharing pane
    if (stepType === 'sharing') v2FillSharing();

    // Simulate AI generation when arriving at the review pane
    if (stepType === 'ai-review') v2FillAIReview();

    // Fill the AI sub-topics accordion when arriving at that step
    if (stepType === 'ai-subtopics') v2FillAISubtopics();

    // Auto-open first sub editor when landing on the sub-topics pane
    if (stepType === 'subtopics') {
        if (document.querySelectorAll('#subsList .sub-list-item').length === 0) {
            openSubEditor('new');
        }
    }
}

function v2GoNext() {
    var step = v2CurrentStep();
    if (!v2Validate(step)) return;
    v2SwitchTo(step + 1);
}

function v2GoBack() {
    var step = v2CurrentStep();
    if (step > 1) v2SwitchTo(step - 1);
}

// ── Validation ────────────────────────────────────────────────────────────────
function v2Validate(step) {
    var cfg = _v2Config;
    if (!cfg) return true;
    var type = cfg.stepTypes[step - 1];

    // AI prompt: needs something in the textarea
    if (type === 'ai-prompt') {
        var promptEl = document.getElementById('v2AiPrompt');
        if (!promptEl || !promptEl.value.trim()) {
            if (promptEl) { promptEl.classList.add('input-error'); promptEl.focus(); }
            showToast('Enter a description or upload a document to continue');
            return false;
        }
        if (promptEl) promptEl.classList.remove('input-error');
        return true;
    }

    // AI review: name must be non-empty (pre-filled but user may have cleared it)
    if (type === 'ai-review') {
        var reviewNameEl = document.getElementById('v2Name');
        if (!reviewNameEl || !reviewNameEl.value.trim()) {
            if (reviewNameEl) { reviewNameEl.classList.add('input-error'); reviewNameEl.focus(); }
            showToast('Please enter a topic name');
            return false;
        }
        if (reviewNameEl) reviewNameEl.classList.remove('input-error');
        return true;
    }

    // Single topic: name + content picker in the same pane
    if (type === 'content-single') {
        var nameEl = document.getElementById('v2Name');
        if (!nameEl || !nameEl.value.trim()) {
            if (nameEl) { nameEl.classList.add('input-error'); nameEl.focus(); }
            showToast('Please enter a topic name');
            return false;
        }
        nameEl.classList.remove('input-error');
        var picker = document.querySelector('#v2Pane' + step + ' .content-picker');
        if (picker && !validateContentPicker(picker)) {
            showToast('Add content (file, video URL, or text) before continuing');
            return false;
        }
        return true;
    }

    // Sub-topics flow: details pane — name only
    if (type === 'details') {
        var nameEl2 = document.getElementById('v2Name');
        if (!nameEl2 || !nameEl2.value.trim()) {
            if (nameEl2) { nameEl2.classList.add('input-error'); nameEl2.focus(); }
            showToast('Please enter a topic name');
            return false;
        }
        nameEl2.classList.remove('input-error');
        return true;
    }

    // Sub-topics pane — at least one sub required
    if (type === 'subtopics') {
        var subEdEl = document.getElementById('subEditor');
        if (subEdEl && !subEdEl.classList.contains('hidden')) {
            var draft = ((subEdEl.querySelector('.sub-edit-name') || {}).value || '').trim();
            if (draft) {
                if (!commitSubEditor(true)) return false;
            } else {
                cancelSubEditor();
            }
        }
        if (document.querySelectorAll('#subsList .sub-list-item').length === 0) {
            showToast('Add at least one sub-topic before continuing');
            return false;
        }
        return true;
    }

    return true; // sharing and game panes have no required fields
}

// ── AI generate: run pool generation then advance to Review step ──────────────
function v2AIGenerate() {
    var cfg = _v2Config;
    if (!cfg) return;

    // Require at least one input source before generating.
    var hasFile   = !!(document.getElementById('aiUploadZone') &&
                       document.getElementById('aiUploadZone').classList.contains('has-file'));
    var hasUrl    = Array.from(document.querySelectorAll('#aiUrlList .ai-url-input')).some(function (el) {
                       return el.value.trim().length > 0;
                   });
    var hasText   = ((document.getElementById('aiTextInput')  || {}).textContent || '').trim();
    var hasPrompt = ((document.getElementById('aiPromptText') || {}).value || '').trim();
    if (!hasFile && !hasUrl && !hasText && !hasPrompt) {
        showToast('Add a file, URL, text or a prompt before generating');
        return;
    }

    // Reset keep-field locks for a fresh generation.
    _v2KeepFields = {};

    // Pick from the same pools as the original flow.
    var namePair   = nextAISuggestion();
    var suggestion = _AI_SUGGESTIONS[_aiGenerateIdx % _AI_SUGGESTIONS.length];
    suggestion = Object.assign({}, suggestion, { name: namePair.name, description: namePair.description });
    _aiGenerateIdx++;

    var coverUrl = COVER_PRESETS[(_aiGenerateIdx - 1) % COVER_PRESETS.length];

    // Store so v2FillAIReview can use it.
    _v2AISuggestion = {
        name:       suggestion.name,
        description: suggestion.description,
        coverUrl:   coverUrl,
        subtopics:  suggestion.subtopics || []
    };

    // Clear any previously filled review pane so it gets rebuilt.
    var reviewContent = document.getElementById('v2AiReviewContent');
    if (reviewContent) reviewContent.innerHTML = '';

    // Update AI credit counter (same logic as doAIGenerate).
    var ck = (_currentScope && _currentScope.companyKey) || '';
    _companyCreditsUsed[ck] = (_companyCreditsUsed[ck] || 0) + 1;
    try {
        var sc = JSON.parse(localStorage.getItem('gameon.aiCredits') || '{}');
        sc[ck] = _companyCreditsUsed[ck];
        localStorage.setItem('gameon.aiCredits', JSON.stringify(sc));
    } catch(e) {}
    var countEl = document.getElementById('aiCreditsCount');
    if (countEl) countEl.textContent = _companyCreditsUsed[ck];
    updateScopeCreditsDisplay();

    // Advance to the Review step — v2FillAIReview will populate it.
    v2SwitchTo(2);
}

// ── AI review: fill pane with generated (or simulated) content ────────────────
function v2TitleCase(str) {
    return str.replace(/\w\S*/g, function(w) {
        return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    });
}

function v2FillAIReview() {
    var reviewEl = document.getElementById('v2AiReviewContent');
    if (!reviewEl || reviewEl.children.length) return; // already filled

    var cfg = _v2Config;
    var ai  = _v2AISuggestion;
    var genName = ai ? ai.name        : 'AI-Generated Topic';
    var genDesc = ai ? ai.description : 'AI-generated topic overview.';

    // Helper: a field row with a Keep button to the right.
    function keepRow(labelText, fieldHtml, fieldKey) {
        return [
            '<div class="form-group">',
            '  <label>' + labelText + '</label>',
            '  <div class="v2-field-with-keep">',
            '    ' + fieldHtml,
            '    <button type="button" class="v2-keep-btn" data-field="' + fieldKey + '"',
            '            onclick="v2ToggleKeep(this)" title="Keep this value when regenerating">',
            '      <i class="fas fa-check"></i> Keep',
            '    </button>',
            '  </div>',
            '</div>'
        ].join('\n');
    }

    var html = [];

    // Name
    html.push(keepRow('Topic name',
        '<input type="text" id="v2Name" name="name" required value="' + escapeAttr(genName) + '">',
        'name'));

    // Description
    html.push(keepRow('Description',
        '<input type="text" id="v2Desc" name="description" value="' + escapeAttr(genDesc) + '">',
        'description'));

    // Single-topic AI: show the content RTE with a Keep button.
    // For AI+subtopics the sub-topic content is reviewed on the dedicated 'ai-subtopics' step.
    if (!cfg || cfg.structure !== 'subtopics') {
        var contentHtml = v2GenerateSingleContent(ai);
        html.push(
            '<div class="form-group v2-rte-form-group">',
            '  <div class="v2-field-with-keep v2-keep-label-row">',
            '    <label>Content</label>',
            '    <button type="button" class="btn-icon v2-rte-expand-btn" onclick="v2OpenRTEModal()" title="Open full screen"><i class="fas fa-expand-alt"></i></button>',
            '    <button type="button" class="v2-keep-btn" data-field="content"',
            '            onclick="v2ToggleKeep(this)" title="Keep content when regenerating">',
            '      <i class="fas fa-check"></i> Keep',
            '    </button>',
            '  </div>',
            '  <div class="rte-toolbar">',
            '    <button type="button" class="rte-btn" title="Bold"',
            '            onmousedown="event.preventDefault();document.execCommand(\'bold\')"><i class="fas fa-bold"></i></button>',
            '    <button type="button" class="rte-btn" title="Italic"',
            '            onmousedown="event.preventDefault();document.execCommand(\'italic\')"><i class="fas fa-italic"></i></button>',
            '    <button type="button" class="rte-btn" title="Underline"',
            '            onmousedown="event.preventDefault();document.execCommand(\'underline\')"><i class="fas fa-underline"></i></button>',
            '    <span class="rte-sep"></span>',
            '    <button type="button" class="rte-btn" title="Bullet list"',
            '            onmousedown="event.preventDefault();document.execCommand(\'insertUnorderedList\')"><i class="fas fa-list-ul"></i></button>',
            '    <button type="button" class="rte-btn" title="Numbered list"',
            '            onmousedown="event.preventDefault();document.execCommand(\'insertOrderedList\')"><i class="fas fa-list-ol"></i></button>',
            '  </div>',
            '  <div id="v2AiContent" class="ai-rte" contenteditable="true">' + contentHtml + '</div>',
            '</div>'
        );
    }

    reviewEl.innerHTML = html.join('\n');
}

// ── Keep button toggle ────────────────────────────────────────────────────────
function v2ToggleKeep(btn) {
    var field = btn.dataset.field;
    _v2KeepFields[field] = !_v2KeepFields[field];
    btn.classList.toggle('kept', !!_v2KeepFields[field]);
}

// ── Single-topic content: concatenate subtopic HTML from the AI suggestion ────
function v2GenerateSingleContent(ai) {
    if (!ai || !ai.subtopics || !ai.subtopics.length) return '';
    return ai.subtopics.map(function(s) { return s.content || ''; }).join('\n');
}

// ── Regenerate in-place (respects keep locks) ─────────────────────────────────
function v2AIRegenerate() {
    var cfg = _v2Config;
    if (!cfg) return;

    var namePair   = nextAISuggestion();
    var suggestion = _AI_SUGGESTIONS[_aiGenerateIdx % _AI_SUGGESTIONS.length];
    suggestion = Object.assign({}, suggestion, { name: namePair.name, description: namePair.description });
    _aiGenerateIdx++;

    if (!_v2KeepFields.name) {
        var nameEl = document.getElementById('v2Name');
        if (nameEl) nameEl.value = suggestion.name;
    }
    if (!_v2KeepFields.description) {
        var descEl = document.getElementById('v2Desc');
        if (descEl) descEl.value = suggestion.description;
    }

    // Single-topic AI: update the RTE content (sub-topics have their own regenerate on step 3).
    if (!_v2KeepFields.content) {
        var contentEl = document.getElementById('v2AiContent');
        if (contentEl) {
            contentEl.innerHTML = v2GenerateSingleContent({ subtopics: suggestion.subtopics });
        }
    }

    // Keep _v2AISuggestion in sync for non-locked fields.
    if (_v2AISuggestion) {
        if (!_v2KeepFields.name)        _v2AISuggestion.name        = suggestion.name;
        if (!_v2KeepFields.description) _v2AISuggestion.description = suggestion.description;
        _v2AISuggestion.subtopics = suggestion.subtopics;
    }

    // Update credit counter.
    var ck = (_currentScope && _currentScope.companyKey) || '';
    _companyCreditsUsed[ck] = (_companyCreditsUsed[ck] || 0) + 1;
    try {
        var sc = JSON.parse(localStorage.getItem('gameon.aiCredits') || '{}');
        sc[ck] = _companyCreditsUsed[ck];
        localStorage.setItem('gameon.aiCredits', JSON.stringify(sc));
    } catch(e) {}
    var countEl = document.getElementById('aiCreditsCount');
    if (countEl) countEl.textContent = _companyCreditsUsed[ck];
    updateScopeCreditsDisplay();
}

// ── Cancel with confirmation warning ─────────────────────────────────────────
function v2CancelWithWarning() {
    DevExpress.ui.dialog.confirm(
        'Are you sure you want to cancel? Any content you have entered or generated will be lost.',
        'Cancel topic creation'
    ).done(function(confirmed) {
        if (confirmed) cancelEdit();
    });
}

// ── Sharing step ──────────────────────────────────────────────────────────────
function v2FillSharing() {
    var listEl = document.getElementById('v2ShareList');
    if (!listEl || listEl.children.length) return; // already filled

    var companyKey  = _currentScope.companyKey;
    var companies   = (typeof SIDEBAR_COMPANIES   !== 'undefined') ? SIDEBAR_COMPANIES   : [];
    var departments = (typeof SIDEBAR_DEPARTMENTS !== 'undefined') ? SIDEBAR_DEPARTMENTS : [];
    var company     = companies.find(function(c) { return c.name.toLowerCase() === companyKey; });
    var currentDept = (_currentScope && _currentScope.dept) || '';

    var html = '';
    if (company) {
        var allDepts = departments.filter(function(d) { return d.companyId === company.id; });
        html = allDepts.map(function(d) {
            var checked = d.name === currentDept;
            return '<label class="share-dept-item">' +
                '<input type="checkbox" value="' + escapeAttr(d.name) + '"' + (checked ? ' checked' : '') + '>' +
                '<span class="share-dept-name">' + escapeAttr(d.name) + '</span>' +
                '</label>';
        }).join('') || '<div class="share-empty">No other departments to share with.</div>';
    } else {
        html = '<div class="share-empty">Select a company to configure sharing.</div>';
    }

    listEl.innerHTML = html;
}

// ── Override expandTopicForm so cancel-with-no-subs re-shows the button ───────
// (In v1 this shows the mini-card back; in v2 subtopics, just re-show the add btn)
function expandTopicForm() {
    var miniCard = document.getElementById('topicMiniCard');
    if (miniCard) miniCard.classList.add('hidden');
    var fullForm = document.getElementById('topicFullForm');
    if (fullForm) fullForm.classList.remove('hidden');
    // v2 subtopics: re-expose the "Add sub-topic" button so the user isn't stranded
    if (_v2Config && _v2Config.structure === 'subtopics') {
        var btnRow = document.getElementById('addSubTopicBtnRow');
        if (btnRow) btnRow.classList.remove('hidden');
    }
}

// ── Commit ────────────────────────────────────────────────────────────────────
function v2Commit(createGame) {
    var cfg = _v2Config;
    if (!cfg) return;

    var name = ((document.getElementById('v2Name') || {}).value || '').trim() || 'Untitled Topic';
    var desc = ((document.getElementById('v2Desc') || {}).value || '').trim();
    // Cover picker may be in different panes depending on flow — find it wherever it is.
    var coverEl = document.querySelector('.cover-hidden-input');
    var cover   = coverEl ? coverEl.value : '';

    _pendingCreateGame = !!createGame;
    _pendingGameFlow   = 'normal'; // game flow will ask manual vs AI itself
    _pendingTopicCover = cover;
    _pendingTopicDesc  = desc;

    // Build the topic table row
    var tbody = document.querySelector('.data-table tbody');
    var existingIds = Array.from(document.querySelectorAll('tr[data-topic]'))
                          .map(function(r) { return parseInt(r.dataset.topic); });
    var newId = Math.max.apply(null, [0].concat(existingIds)) + 1;

    var tr = document.createElement('tr');
    tr.className         = 'row-company expanded';
    tr.dataset.topic       = newId;
    tr.dataset.subtitle    = '';
    tr.dataset.description = desc;
    tr.dataset.cover       = cover;
    tr.dataset.active      = 'true';
    tr.dataset.name        = name;
    tr.setAttribute('onclick', 'toggleTopic(' + newId + ')');

    tr.innerHTML =
        '<td class="col-name"><div class="cell-row">' +
        '<span class="row-select"><input type="checkbox" class="row-checkbox"' +
            ' data-topic-name="' + escapeAttr(name) + '" onclick="onSelectCheckbox(event)"></span>' +
        '<span class="chevron" style="visibility:hidden"><i class="fas fa-chevron-down"></i></span>' +
        '<img class="row-thumb" src="' + escapeAttr(cover || randomCover()) + '" alt="">' +
        '<span class="company-name">' + escapeAttr(name) + '</span>' +
        '<span class="row-main-chip"></span><span class="cell-pills"></span>' +
        '<span class="row-status"><span class="chip chip-status chip-status-active">Active</span></span>' +
        '<span class="row-actions"><div class="action-menu">' +
            '<button class="btn-icon action-menu-trigger" onclick="toggleTopicMenu(this,event)"' +
                ' title="Actions" aria-haspopup="true" aria-expanded="false">' +
                '<i class="fas fa-ellipsis-vertical"></i></button>' +
            '<div class="action-menu-popup" role="menu">' +
                '<button type="button" class="action-item" onclick="actionAddSubTopic(this,event)">' +
                    '<i class="fas fa-puzzle-piece"></i> Add sub-topic</button>' +
                '<button type="button" class="action-item" onclick="actionAddGameForTopic(this,event)">' +
                    '<i class="fas fa-trophy"></i> Add game</button>' +
                '<button type="button" class="action-item" onclick="actionEditTopic(this,event)">' +
                    '<i class="fas fa-pen"></i> Edit</button>' +
                '<button type="button" class="action-item" onclick="actionShareTopic(this,event)">' +
                    '<i class="fas fa-people-group"></i> Share</button>' +
                '<button type="button" class="action-item" onclick="actionToggleDisabled(this,event)">' +
                    '<i class="fas fa-ban"></i> Disable</button>' +
                '<div class="action-sep"></div>' +
                '<button type="button" class="action-item action-item-danger" onclick="actionDeleteTopic(this,event)">' +
                    '<i class="fas fa-trash"></i> Delete</button>' +
            '</div>' +
        '</div></span>' +
        '</div></td>';

    tbody.appendChild(tr);

    // Attach content or sub-topics
    if (cfg.structure === 'subtopics') {
        var listed = (cfg.method === 'ai') ? readAISubtopics() : readListedSubs();
        if (listed.length) {
            listed.forEach(function(s) { createSubTopicRow(newId, s); });
            updateTopicRowChips(tr);
        }
    } else if (cfg.method === 'ai') {
        // AI single: content lives in the RTE editor (would go to backend in production).
        tr.dataset.mediaType = 'PDF';
        tr.dataset.mediaName = 'AI Generated';
        updateTopicRowChips(tr);
    } else {
        // Manual single: content picker in the 'content-single' pane.
        var contentPaneIdx = cfg.stepTypes.indexOf('content-single') + 1;
        var picker = document.querySelector('#v2Pane' + contentPaneIdx + ' .content-picker');
        if (picker) {
            var c = readContentPicker(picker);
            tr.dataset.mediaType = c.mediaType;
            tr.dataset.mediaName = c.mediaName;
            updateTopicRowChips(tr);
        }
    }

    // Apply sharing choices
    var shareList   = document.getElementById('v2ShareList');
    var companyKey  = _currentScope.companyKey;
    if (shareList && companyKey) {
        var currentDept = (_currentScope && _currentScope.dept) || '';
        var toShare = Array.from(shareList.querySelectorAll('input:checked'))
            .map(function(cb) { return cb.value; })
            .filter(function(d) { return d !== currentDept; });
        if (toShare.length) {
            shareTopicWithDepartments(companyKey, name, toShare);
            persistTopicsScope();
            updateTopicShareChip(name);
        }
    }

    var subs = (cfg.structure === 'subtopics' && cfg.method === 'ai') ? readAISubtopics() : readListedSubs();
    var subNote = subs.length
        ? ' with ' + subs.length + ' sub-topic' + (subs.length !== 1 ? 's' : '')
        : '';
    snapshotCurrentScope();
    showToast('"' + name + '" added' + subNote);

    if (_pendingCreateGame) {
        closeDetail();
        _launchCreateGame(name);
    } else {
        showEmpty();
    }
}

// ── AI sub-topics accordion (ai-subtopics step) ───────────────────────────────

// Fill #v2AiSubtopicsContent with an expandable accordion, one item per sub-topic.
// Called lazily by v2SwitchTo when the 'ai-subtopics' step becomes active.
function v2FillAISubtopics() {
    var containerEl = document.getElementById('v2AiSubtopicsContent');
    if (!containerEl || containerEl.querySelector('.ai-sub-list')) return; // already filled

    var ai     = _v2AISuggestion;
    var aiSubs = (ai && ai.subtopics && ai.subtopics.length) ? ai.subtopics : null;
    var defaultSubs = [
        { name: 'Introduction',          content: '<p>An introduction to this topic.</p>' },
        { name: 'Core Concepts',         content: '<p>The key concepts you need to understand.</p>' },
        { name: 'Practical Application', content: '<p>How to apply this knowledge in practice.</p>' }
    ];
    var subs = aiSubs || defaultSubs;

    var listEl = document.createElement('div');
    listEl.className = 'ai-sub-list';
    subs.forEach(function(s, idx) {
        v2AddSubAccordionItem(listEl, s, idx);
    });

    containerEl.innerHTML = '';
    containerEl.appendChild(listEl);
}

// Build and append one accordion item (chevron + editable name + Keep + grip handle + RTE body).
// The grip handle (fa-grip-vertical, right-aligned) initiates HTML5 drag-to-reorder.
function v2AddSubAccordionItem(container, sub, idx) {
    var item = document.createElement('div');
    item.className = 'ai-sub-item';
    item.dataset.idx = idx;
    var isKept = !!_v2KeepFields['sub-' + idx];
    item.innerHTML = [
        '<div class="ai-sub-header">',
        '  <button type="button" class="ai-sub-toggle" onclick="v2ToggleSubItem(this)">',
        '    <i class="fas fa-chevron-right ai-sub-chevron"></i>',
        '  </button>',
        '  <span class="ai-sub-name" contenteditable="true">' + escapeAttr(sub.name) + '</span>',
        '  <button type="button" class="v2-keep-btn' + (isKept ? ' kept' : '') + '" data-field="sub-' + idx + '"',
        '          onclick="v2ToggleKeep(this)" title="Keep this sub-topic when regenerating">',
        '    <i class="fas fa-check"></i> Keep',
        '  </button>',
        '  <button type="button" class="ai-sub-grip" title="Drag to reorder">',
        '    <i class="fas fa-grip-vertical"></i>',
        '  </button>',
        '</div>',
        '<div class="ai-sub-body hidden">',
        '  <div class="rte-toolbar ai-sub-rte-toolbar">',
        '    <button type="button" class="rte-btn" title="Bold"',
        '            onmousedown="event.preventDefault();document.execCommand(\'bold\')"><i class="fas fa-bold"></i></button>',
        '    <button type="button" class="rte-btn" title="Italic"',
        '            onmousedown="event.preventDefault();document.execCommand(\'italic\')"><i class="fas fa-italic"></i></button>',
        '    <button type="button" class="rte-btn" title="Underline"',
        '            onmousedown="event.preventDefault();document.execCommand(\'underline\')"><i class="fas fa-underline"></i></button>',
        '    <span class="rte-sep"></span>',
        '    <button type="button" class="rte-btn" title="Bullet list"',
        '            onmousedown="event.preventDefault();document.execCommand(\'insertUnorderedList\')"><i class="fas fa-list-ul"></i></button>',
        '    <button type="button" class="rte-btn" title="Numbered list"',
        '            onmousedown="event.preventDefault();document.execCommand(\'insertOrderedList\')"><i class="fas fa-list-ol"></i></button>',
        '  </div>',
        '  <div class="ai-wysiwyg" contenteditable="true">' + (sub.content || '') + '</div>',
        '</div>'
    ].join('\n');

    // Drag-to-reorder: only activated when the user presses the grip handle.
    var grip = item.querySelector('.ai-sub-grip');
    if (grip) {
        grip.addEventListener('mousedown', function() { item.setAttribute('draggable', 'true'); });
        grip.addEventListener('mouseup',   function() { item.removeAttribute('draggable'); });
    }
    item.addEventListener('dragstart', function(e) {
        _v2DragSrc = item;
        e.dataTransfer.effectAllowed = 'move';
        setTimeout(function() { item.classList.add('ai-sub-dragging'); }, 0);
    });
    item.addEventListener('dragend', function() {
        item.removeAttribute('draggable');
        item.classList.remove('ai-sub-dragging');
        document.querySelectorAll('#v2AiSubtopicsContent .ai-sub-item').forEach(function(el) {
            el.classList.remove('ai-sub-drag-over');
        });
        _v2DragSrc = null;
    });
    item.addEventListener('dragover', function(e) {
        if (!_v2DragSrc || _v2DragSrc === item) return;
        e.preventDefault();
        document.querySelectorAll('#v2AiSubtopicsContent .ai-sub-item').forEach(function(el) {
            el.classList.remove('ai-sub-drag-over');
        });
        item.classList.add('ai-sub-drag-over');
    });
    item.addEventListener('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (!_v2DragSrc || _v2DragSrc === item) return;
        var list = item.parentElement;
        if (!list) return;
        var items = Array.from(list.querySelectorAll(':scope > .ai-sub-item'));
        var srcPos = items.indexOf(_v2DragSrc);
        var dstPos = items.indexOf(item);
        if (srcPos < dstPos) {
            list.insertBefore(_v2DragSrc, item.nextSibling);
        } else {
            list.insertBefore(_v2DragSrc, item);
        }
        item.classList.remove('ai-sub-drag-over');
        v2ReindexSubItems(list);
    });

    container.appendChild(item);
}

// Toggle one accordion item open/closed — only one item open at a time.
function v2ToggleSubItem(btn) {
    var item    = btn.closest('.ai-sub-item');
    if (!item) return;
    var list    = item.closest('.ai-sub-list');
    var body    = item.querySelector('.ai-sub-body');
    var chevron = item.querySelector('.ai-sub-chevron');
    if (!body) return;
    var isOpen  = !body.classList.contains('hidden');

    // When opening, collapse every other item first.
    if (!isOpen && list) {
        list.querySelectorAll('.ai-sub-item').forEach(function(other) {
            if (other === item) return;
            var otherBody    = other.querySelector('.ai-sub-body');
            var otherChevron = other.querySelector('.ai-sub-chevron');
            if (otherBody)    otherBody.classList.add('hidden');
            if (otherChevron) otherChevron.style.transform = '';
        });
    }

    body.classList.toggle('hidden', isOpen);
    if (chevron) chevron.style.transform = isOpen ? '' : 'rotate(90deg)';
}

// Re-index all sub-topic items after a drag-drop reorder.
// Updates data-idx, Keep-button data-field, and rebuilds _v2KeepFields 'sub-*' keys.
function v2ReindexSubItems(list) {
    Object.keys(_v2KeepFields).forEach(function(k) {
        if (/^sub-\d+$/.test(k)) delete _v2KeepFields[k];
    });
    Array.from(list.querySelectorAll('.ai-sub-item')).forEach(function(el, i) {
        el.dataset.idx = i;
        var keepBtn = el.querySelector('.v2-keep-btn');
        if (keepBtn) {
            keepBtn.dataset.field = 'sub-' + i;
            if (keepBtn.classList.contains('kept')) _v2KeepFields['sub-' + i] = true;
        }
    });
}

// Regenerate sub-topics in-place, respecting per-sub-topic Keep locks.
function v2AIRegenerateSubs() {
    var cfg = _v2Config;
    if (!cfg) return;

    var namePair   = nextAISuggestion();
    var suggestion = _AI_SUGGESTIONS[_aiGenerateIdx % _AI_SUGGESTIONS.length];
    suggestion = Object.assign({}, suggestion, { name: namePair.name, description: namePair.description });
    _aiGenerateIdx++;

    var newSubs = (suggestion.subtopics && suggestion.subtopics.length)
        ? suggestion.subtopics
        : [
            { name: 'Introduction',          content: '<p>An introduction to this topic.</p>' },
            { name: 'Core Concepts',         content: '<p>The key concepts you need to understand.</p>' },
            { name: 'Practical Application', content: '<p>How to apply this knowledge in practice.</p>' }
          ];

    var listEl = document.querySelector('#v2AiSubtopicsContent .ai-sub-list');
    if (!listEl) return;

    newSubs.forEach(function(s, idx) {
        if (_v2KeepFields['sub-' + idx]) return; // locked — skip this sub-topic
        var existingItem = listEl.querySelector('.ai-sub-item[data-idx="' + idx + '"]');
        if (existingItem) {
            var nameSpan = existingItem.querySelector('.ai-sub-name');
            if (nameSpan) nameSpan.textContent = s.name;
            var wysiwygEl = existingItem.querySelector('.ai-wysiwyg');
            if (wysiwygEl) wysiwygEl.innerHTML = s.content || '';
        } else {
            v2AddSubAccordionItem(listEl, s, idx);
        }
    });

    if (_v2AISuggestion) {
        _v2AISuggestion.subtopics = newSubs;
    }

    // Update credit counter.
    var ck = (_currentScope && _currentScope.companyKey) || '';
    _companyCreditsUsed[ck] = (_companyCreditsUsed[ck] || 0) + 1;
    try {
        var sc = JSON.parse(localStorage.getItem('gameon.aiCredits') || '{}');
        sc[ck] = _companyCreditsUsed[ck];
        localStorage.setItem('gameon.aiCredits', JSON.stringify(sc));
    } catch(e) {}
    var countEl = document.getElementById('aiCreditsCount');
    if (countEl) countEl.textContent = _companyCreditsUsed[ck];
    updateScopeCreditsDisplay();
}

// Read current sub-topic names + content from the accordion (for v2Commit).
function readAISubtopics() {
    return Array.from(document.querySelectorAll('#v2AiSubtopicsContent .ai-sub-item')).map(function(item) {
        var nameEl    = item.querySelector('.ai-sub-name');
        var contentEl = item.querySelector('.ai-wysiwyg');
        return {
            name:        (nameEl ? nameEl.textContent.trim() : '') || 'Sub-topic',
            mediaType:   'PDF',
            mediaName:   '',
            description: contentEl ? contentEl.innerHTML : ''
        };
    });
}

// ── Full-screen RTE modal ─────────────────────────────────────────────────────
// Opens a DevExtreme popup containing a copy of the AI content RTE.
// Changes sync back to #v2AiContent when the popup is closed.
function v2OpenRTEModal() {
    var src = document.getElementById('v2AiContent');
    if (!src) return;

    var currentHtml = src.innerHTML;
    var $host = $('<div class="v2-rte-modal-host">').appendTo(document.body);

    $host.dxPopup({
        title: 'Edit Content',
        showTitle: true,
        width: '72vw',
        height: '80vh',
        minWidth: 480,
        minHeight: 360,
        visible: true,
        dragEnabled: true,
        resizeEnabled: true,
        showCloseButton: true,
        // Sync RTE content back on every close (×, Escape, or programmatic hide).
        onHiding: function() {
            var modalRte = document.getElementById('v2RteModalContent');
            if (modalRte) {
                var origRte = document.getElementById('v2AiContent');
                if (origRte) origRte.innerHTML = modalRte.innerHTML;
            }
        },
        onHidden: function() {
            $host.remove();
        },
        contentTemplate: function(contentEl) {
            var rteHtml =
                '<div style="display:flex;flex-direction:column;height:100%">' +
                    '<div class="rte-toolbar" style="flex-shrink:0;border-radius:0">' +
                        '<button type="button" class="rte-btn" title="Bold"' +
                            ' onmousedown="event.preventDefault();document.execCommand(\'bold\')"><i class="fas fa-bold"></i></button>' +
                        '<button type="button" class="rte-btn" title="Italic"' +
                            ' onmousedown="event.preventDefault();document.execCommand(\'italic\')"><i class="fas fa-italic"></i></button>' +
                        '<button type="button" class="rte-btn" title="Underline"' +
                            ' onmousedown="event.preventDefault();document.execCommand(\'underline\')"><i class="fas fa-underline"></i></button>' +
                        '<span class="rte-sep"></span>' +
                        '<button type="button" class="rte-btn" title="Bullet list"' +
                            ' onmousedown="event.preventDefault();document.execCommand(\'insertUnorderedList\')"><i class="fas fa-list-ul"></i></button>' +
                        '<button type="button" class="rte-btn" title="Numbered list"' +
                            ' onmousedown="event.preventDefault();document.execCommand(\'insertOrderedList\')"><i class="fas fa-list-ol"></i></button>' +
                    '</div>' +
                    '<div id="v2RteModalContent" class="v2-rte-modal-body" contenteditable="true">' + currentHtml + '</div>' +
                '</div>';
            $(contentEl).css({ padding: 0, overflow: 'hidden', height: '100%' }).html(rteHtml);
        }
    });
}
