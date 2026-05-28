// ===== Sidebar =====
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('collapsed');
}

function toggleNavGroup(evt) {
    evt.preventDefault();
    evt.currentTarget.closest('.nav-group').classList.toggle('open');
}

// ===== State =====
let currentEditRow = null;
let currentEditType = null; // 'topic' or 'module'
let currentViewRow = null;
let isAddMode = false;
let topicStatusFilter = 'active'; // 'active' | 'disabled'
let _currentScope = { companyKey: null, dept: null };
let _currentShareTarget = null;

const CATEGORIES = [
    'Sales', 'Service', 'Product', 'Compliance', 'Customer',
    'Onboarding', 'Leadership', 'Technical', 'Finance', 'Marketing'
];

// Preset cover gradients the user can pick from (or upload a custom one).
function gradientCoverSvg(c1, c2) {
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(
        "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 200' preserveAspectRatio='xMidYMid slice'>" +
            "<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>" +
                `<stop offset='0' stop-color='${c1}'/>` +
                `<stop offset='1' stop-color='${c2}'/>` +
            "</linearGradient></defs>" +
            "<rect width='320' height='200' fill='url(#g)'/>" +
        "</svg>"
    );
}

const COVER_PRESETS = [
    gradientCoverSvg('#3b82f6', '#8b5cf6'), // blue → purple
    gradientCoverSvg('#f97316', '#ec4899'), // orange → pink
    gradientCoverSvg('#22c55e', '#10b981')  // green → teal
];

const DEFAULT_COVER_URL = COVER_PRESETS[0];

function randomCover() {
    return COVER_PRESETS[Math.floor(Math.random() * COVER_PRESETS.length)];
}

function coverPickerHtml(currentCover, opts) {
    opts = opts || {};
    const url = currentCover || DEFAULT_COVER_URL;
    const presetIdx = COVER_PRESETS.indexOf(url);
    const isPreset = presetIdx >= 0;
    const customDataUrl = (!isPreset && currentCover) ? currentCover : '';
    const uploadSelected = !isPreset && customDataUrl;
    const exposeToForm = opts.embedded !== true;  // topic picker is form-named; embedded ones aren't

    const tiles = COVER_PRESETS.map((preset, idx) => {
        const sel = isPreset && idx === presetIdx;
        return `
            <button type="button" class="cover-tile${sel ? ' selected' : ''}" data-cover="${escapeAttr(preset)}" onclick="selectCoverTile(this)" aria-label="Preset cover ${idx + 1}">
                <img src="${preset}" alt="">
                ${sel ? '<span class="cover-check"><i class="fas fa-check"></i></span>' : ''}
            </button>
        `;
    }).join('');

    const uploadInner = customDataUrl
        ? `<img src="${escapeAttr(customDataUrl)}" alt="Custom cover">
           ${uploadSelected ? '<span class="cover-check"><i class="fas fa-check"></i></span>' : ''}
           <span class="cover-tile-overlay"><i class="fas fa-camera"></i></span>`
        : `<span class="cover-upload-empty"><i class="fas fa-upload"></i><span>Upload</span></span>`;

    const hiddenAttrs = exposeToForm ? ' name="cover" id="coverHiddenInput"' : '';
    const fileAttrs = exposeToForm ? ' id="coverFileInput"' : '';

    return `
        <div class="cover-picker">
            ${tiles}
            <label class="cover-tile cover-tile-upload${uploadSelected ? ' selected' : ''}" data-cover="${escapeAttr(customDataUrl)}" title="Upload a custom cover">
                ${uploadInner}
                <input type="file" class="cover-file-input"${fileAttrs} accept="image/*" onchange="previewCover(this)">
            </label>
            <input type="hidden" class="cover-hidden-input"${hiddenAttrs} value="${escapeAttr(url)}">
        </div>
    `;
}

function selectCoverTile(tile) {
    const picker = tile.closest('.cover-picker');
    if (!picker) return;
    picker.querySelectorAll('.cover-tile').forEach(t => {
        t.classList.remove('selected');
        const check = t.querySelector('.cover-check');
        if (check) check.remove();
    });
    tile.classList.add('selected');
    if (!tile.querySelector('.cover-check')) {
        tile.insertAdjacentHTML('beforeend', '<span class="cover-check"><i class="fas fa-check"></i></span>');
    }
    const hidden = picker.querySelector('.cover-hidden-input');
    if (hidden && tile.dataset.cover) hidden.value = tile.dataset.cover;
}

const MEDIA_TYPES = [
    { value: 'PDF',   icon: 'fas fa-file-pdf',   label: 'PDF' },
    { value: 'video', icon: 'fas fa-video',      label: 'Video' },
    { value: 'image', icon: 'fas fa-image',      label: 'Image' },
    { value: 'text',  icon: 'fas fa-align-left', label: 'Text' },
];

function mediaMeta(type) {
    return MEDIA_TYPES.find(m => m.value === type) || MEDIA_TYPES[0];
}

// PDF or image inferred from a File — video/text are picked explicitly.
function detectMediaTypeFromFile(file) {
    if (!file) return null;
    const t = (file.type || '').toLowerCase();
    const n = (file.name || '').toLowerCase();
    if (t === 'application/pdf' || n.endsWith('.pdf')) return 'PDF';
    if (t.startsWith('image/') || /\.(png|jpe?g|gif|webp|svg|bmp)$/.test(n)) return 'image';
    return null;
}

// Maps the stored mediaType onto the simpler 3-way picker.
function kindForMediaType(mediaType) {
    if (mediaType === 'video') return 'video';
    if (mediaType === 'text')  return 'text';
    return 'upload'; // PDF or image
}

// Tracks which listed sub-topic is being edited inside the Add Topic form.
// null = inline editor closed, -1 = adding a new one, n >= 0 = editing list[n].
let _editingSubIdx = null;

function contentPickerHtml(idPrefix, defaults) {
    const kind = defaults.kind || 'upload';
    const mediaType = defaults.mediaType || 'PDF';
    const mediaName = defaults.mediaName || '';
    const uploadLabel = '';

    return `
        <div class="content-picker" data-id="${idPrefix}">
            <div class="content-kind-tabs" role="tablist">
                <button type="button" class="content-kind-tab ${kind === 'upload' ? 'active' : ''}" data-kind="upload" onclick="setContentKind(this)"><i class="fas fa-upload"></i> Upload</button>
                <button type="button" class="content-kind-tab ${kind === 'video' ? 'active' : ''}" data-kind="video" onclick="setContentKind(this)"><i class="fas fa-link"></i> Web URL</button>
                <button type="button" class="content-kind-tab ${kind === 'text' ? 'active' : ''}" data-kind="text" onclick="setContentKind(this)"><i class="fas fa-align-left"></i> Text</button>
            </div>
            <input type="hidden" class="cp-kind" value="${kind}">
            <input type="hidden" class="cp-media-type" value="${mediaType}">

            <div class="content-pane${kind === 'upload' ? '' : ' hidden'}" data-pane="upload">
                <div class="cp-dropzone" onclick="this.querySelector('.cp-file').click()"
                     ondragover="event.preventDefault(); this.classList.add('drag-over')"
                     ondragleave="this.classList.remove('drag-over')"
                     ondrop="onContentFileDrop(this, event)">
                    <i class="fas fa-upload"></i>
                    <span class="cp-dropzone-hint">Drop file or <u>browse</u></span>
                    <span class="cp-detected cp-dropzone-name">${mediaName ? escapeAttr(mediaName) : ''}</span>
                    <input type="file" class="cp-file" accept="application/pdf,image/*" onchange="onContentFileChange(this)" style="display:none">
                </div>
                <input type="hidden" class="cp-media-name" value="${kind === 'upload' ? escapeAttr(mediaName) : ''}">
            </div>
            <div class="content-pane${kind === 'video' ? '' : ' hidden'}" data-pane="video">
                <input type="url" class="cp-video-url" value="${kind === 'video' ? escapeAttr(mediaName) : ''}" placeholder="https://…">
            </div>
            <div class="content-pane${kind === 'text' ? '' : ' hidden'}" data-pane="text">
                <div class="rte-toolbar">
                    <button type="button" class="rte-btn" title="Bold" onmousedown="event.preventDefault();document.execCommand('bold')"><i class="fas fa-bold"></i></button>
                    <button type="button" class="rte-btn" title="Italic" onmousedown="event.preventDefault();document.execCommand('italic')"><i class="fas fa-italic"></i></button>
                    <button type="button" class="rte-btn" title="Underline" onmousedown="event.preventDefault();document.execCommand('underline')"><i class="fas fa-underline"></i></button>
                    <span class="rte-sep"></span>
                    <button type="button" class="rte-btn" title="Bullet list" onmousedown="event.preventDefault();document.execCommand('insertUnorderedList')"><i class="fas fa-list-ul"></i></button>
                    <button type="button" class="rte-btn" title="Numbered list" onmousedown="event.preventDefault();document.execCommand('insertOrderedList')"><i class="fas fa-list-ol"></i></button>
                </div>
                <div class="cp-text" contenteditable="true" data-placeholder="Type the sub-topic content…">${kind === 'text' ? mediaName : ''}</div>
            </div>
        </div>
    `;
}

function setContentKind(btn) {
    const picker = btn.closest('.content-picker');
    if (!picker) return;
    const kind = btn.dataset.kind;
    picker.querySelectorAll('.content-kind-tab').forEach(t => t.classList.toggle('active', t === btn));
    picker.querySelectorAll('.content-pane').forEach(p => p.classList.toggle('hidden', p.dataset.pane !== kind));
    picker.querySelector('.cp-kind').value = kind;
    if (kind === 'video') picker.querySelector('.cp-media-type').value = 'video';
    else if (kind === 'text') picker.querySelector('.cp-media-type').value = 'text';
    // For 'upload', mediaType is set when a file is chosen.
    picker.classList.remove('error');
    updateAIGenerateBtn();
}

function updateAIGenerateBtn() {
    var genBtn = document.getElementById('aiGenerateBtn');
    if (genBtn) genBtn.disabled = false;
}

function onContentFileChange(input) {
    const file = input.files[0];
    if (!file) return;
    const picker = input.closest('.content-picker');
    if (!picker) return;
    const detected = detectMediaTypeFromFile(file) || 'PDF';
    picker.querySelector('.cp-media-type').value = detected;
    picker.querySelector('.cp-media-name').value = file.name;
    const nameEl = picker.querySelector('.cp-dropzone-name');
    if (nameEl) nameEl.textContent = file.name;
    picker.classList.remove('error');
    updateAIGenerateBtn();
}

function onContentFileDrop(zone, event) {
    event.preventDefault();
    zone.classList.remove('drag-over');
    const file = event.dataTransfer.files[0];
    if (!file) return;
    const picker = zone.closest('.content-picker');
    if (!picker) return;
    const detected = detectMediaTypeFromFile(file) || 'PDF';
    picker.querySelector('.cp-media-type').value = detected;
    picker.querySelector('.cp-media-name').value = file.name;
    const nameEl = picker.querySelector('.cp-dropzone-name');
    if (nameEl) nameEl.textContent = file.name;
    picker.classList.remove('error');
    updateAIGenerateBtn();
}

// Returns true if the picker has a non-empty value matching the active kind.
// Marks the picker with an .error class and focuses the relevant input otherwise.
function validateContentPicker(picker) {
    if (!picker) return false;
    const c = readContentPicker(picker);
    if (c.mediaName) {
        picker.classList.remove('error');
        return true;
    }
    picker.classList.add('error');
    const kind = picker.querySelector('.cp-kind').value;
    if (kind === 'video') {
        const v = picker.querySelector('.cp-video-url');
        if (v) v.focus();
    } else if (kind === 'text') {
        const t = picker.querySelector('.cp-text');
        if (t) t.focus();
    } else {
        const f = picker.querySelector('.cp-file');
        if (f) f.focus();
    }
    return false;
}

// Reads a content-picker block back into { mediaType, mediaName }.
function readContentPicker(picker) {
    const kind = picker.querySelector('.cp-kind').value;
    if (kind === 'video') {
        return { mediaType: 'video', mediaName: picker.querySelector('.cp-video-url').value.trim() };
    }
    if (kind === 'text') {
        const el = picker.querySelector('.cp-text');
        const html = el ? el.innerHTML.trim() : '';
        return { mediaType: 'text', mediaName: (html === '<br>' || html === '') ? '' : html };
    }
    return {
        mediaType: picker.querySelector('.cp-media-type').value || 'PDF',
        mediaName: picker.querySelector('.cp-media-name').value || ''
    };
}

function minimizeTopicSection() { /* no-op — replaced by tab layout */ }
function expandTopicSection()   { /* no-op — replaced by tab layout */ }

// ===== Add Topic — explicit Add Content / Add Sub-topic choice =====
function chooseAddContent() {
    const picker = document.getElementById('choicePicker');
    picker.classList.add('hidden');
    picker.classList.remove('error');
    const choicePrompt = document.getElementById('choicePromptLabel');
    if (choicePrompt) choicePrompt.classList.add('hidden');
    document.getElementById('topicContentSection').classList.remove('hidden');
}

function chooseAddSubTopic() {
    const nameInput = document.querySelector('#topicFullForm input[name="name"]') ||
                      document.querySelector('#editFields input[name="name"]');
    if (!nameInput || !nameInput.value.trim()) {
        if (nameInput) {
            nameInput.classList.add('input-error');
            nameInput.focus();
            nameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        showToast('Add a topic name before creating a sub-topic');
        return;
    }
    nameInput.classList.remove('input-error');
    const picker = document.getElementById('choicePicker');
    if (picker) { picker.classList.add('hidden'); picker.classList.remove('error'); }
    const choicePrompt = document.getElementById('choicePromptLabel');
    if (choicePrompt) choicePrompt.classList.add('hidden');
    // Collapse topic details into mini-card and reveal sub-topics area
    showTopicMiniCard();
    openSubEditor('new');
}

function removeTopicContent() {
    const section = document.getElementById('topicContentSection');
    if (!section) return;
    section.classList.add('hidden');
    // Reset the picker so a future "Add content" starts blank.
    const picker = section.querySelector('.content-picker');
    if (picker) {
        picker.querySelector('.cp-kind').value = 'upload';
        picker.querySelector('.cp-media-type').value = 'PDF';
        picker.querySelector('.cp-media-name').value = '';
        const v = picker.querySelector('.cp-video-url'); if (v) v.value = '';
        const t = picker.querySelector('.cp-text');      if (t) t.innerHTML = '';
        picker.querySelectorAll('.content-kind-tab').forEach(b => b.classList.toggle('active', b.dataset.kind === 'upload'));
        picker.querySelectorAll('.content-pane').forEach(p => p.classList.toggle('hidden', p.dataset.pane !== 'upload'));
        const label = picker.querySelector('.cp-detected'); if (label) label.innerHTML = '';
    }
    document.getElementById('choicePicker').classList.remove('hidden');
    const choicePromptLabelEl = document.getElementById('choicePromptLabel');
    if (choicePromptLabelEl) choicePromptLabelEl.classList.remove('hidden');
}

// ===== Inline sub-topic list + editor (used inside Add Topic) =====
function htmlToMarkdown(html) {
    var md = html;
    md = md.replace(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi, function(_, t) {
        return '### ' + t.replace(/<[^>]+>/g, '').trim() + '\n\n';
    });
    md = md.replace(/<strong>([\s\S]*?)<\/strong>/gi, '**$1**');
    md = md.replace(/<em>([\s\S]*?)<\/em>/gi, '_$1_');
    md = md.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, function(_, inner) {
        var i = 0;
        return inner.replace(/<li>([\s\S]*?)<\/li>/gi, function(_, t) {
            return (++i) + '. ' + t.replace(/<[^>]+>/g, '').trim() + '\n';
        }) + '\n';
    });
    md = md.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, function(_, inner) {
        return inner.replace(/<li>([\s\S]*?)<\/li>/gi, function(_, t) {
            return '- ' + t.replace(/<[^>]+>/g, '').trim() + '\n';
        }) + '\n';
    });
    md = md.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, function(_, t) { return t.trim() + '\n\n'; });
    md = md.replace(/<br\s*\/?>/gi, '\n');
    md = md.replace(/<[^>]+>/g, '');
    md = md.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ');
    return md.replace(/\n{3,}/g, '\n\n').trim();
}

function openSubEditor(mode, idx) {
    _editingSubIdx = mode === 'new' ? -1 : idx;
    let defaults = { name: '', mediaType: 'PDF', mediaName: '', kind: 'upload', content: '' };
    if (mode === 'edit') {
        const item = document.querySelectorAll('#subsList .sub-list-item')[idx];
        if (item) {
            defaults.name = item.dataset.name || '';
            defaults.mediaType = item.dataset.mediaType || 'PDF';
            defaults.mediaName = item.dataset.mediaName || '';
            defaults.kind = kindForMediaType(defaults.mediaType);
            defaults.content = item.dataset.content || '';
        }
    }
    const subsCount = document.querySelectorAll('#subsList .sub-list-item').length;
    const titleText = mode === 'edit'
        ? 'Edit sub-topic'
        : (subsCount > 0 ? `Add sub-topic ${subsCount + 1}` : 'New sub-topic');
    const editor = document.getElementById('subEditor');
    const contentSection = defaults.content
        ? `<div class="form-group">
            <label>Content</label>
            <textarea class="sub-edit-content ai-text-input" rows="10" placeholder="Markdown content…">${escapeAttr(defaults.content)}</textarea>
           </div>`
        : `<div class="form-group">
            <label>Content</label>
            ${contentPickerHtml('sub-editor', defaults)}
           </div>`;
    editor.innerHTML = `
        <div class="sub-editor-head">
            <span class="sub-editor-title"><i class="fas fa-puzzle-piece"></i> ${titleText}</span>
        </div>
        <div class="form-group">
            <label>Sub-topic name</label>
            <input type="text" class="sub-edit-name" value="${escapeAttr(defaults.name)}" placeholder="Sub-topic name">
        </div>
        ${contentSection}
        <div class="sub-editor-actions">
            <button type="button" class="btn btn-outline" onclick="cancelSubEditor()">Cancel</button>
            <button type="button" class="btn btn-primary" onclick="commitSubEditor()">${mode === 'edit' ? 'Save sub-topic' : 'Add sub-topic'}</button>
        </div>
    `;
    editor.classList.remove('hidden');

    document.getElementById('addSubTopicBtnRow').classList.add('hidden');
    setTimeout(() => editor.querySelector('.sub-edit-name').focus(), 0);
}

function cancelSubEditor() {
    _editingSubIdx = null;
    const editor = document.getElementById('subEditor');
    editor.classList.add('hidden');
    editor.innerHTML = '';
    const hasSubs = document.querySelectorAll('#subsList .sub-list-item').length > 0;
    if (hasSubs) {
        document.getElementById('addSubTopicBtnRow').classList.remove('hidden');
    } else {
        // No subs — expand the full topic form and re-offer the two choices.
        expandTopicForm();
        const choicePicker = document.getElementById('choicePicker');
        if (choicePicker) choicePicker.classList.remove('hidden');
        const choicePromptLabelEl = document.getElementById('choicePromptLabel');
        if (choicePromptLabelEl) choicePromptLabelEl.classList.remove('hidden');
    }
}

function commitSubEditor(skipReopen) {
    const editor = document.getElementById('subEditor');
    const nameInput = editor.querySelector('.sub-edit-name');
    const name = (nameInput.value || '').trim();
    if (!name) { nameInput.focus(); return false; }
    const contentArea = editor.querySelector('.sub-edit-content');
    const picker = contentArea ? null : editor.querySelector('.content-picker');
    if (!contentArea && !validateContentPicker(picker)) {
        showToast('Add content for this sub-topic (file, video URL, or text)');
        return false;
    }
    const c = contentArea ? { mediaType: 'PDF', mediaName: '' } : readContentPicker(picker);
    const mdContent = contentArea ? contentArea.value : '';
    const wasNew = _editingSubIdx === -1;

    if (wasNew) {
        appendSubItem({ name: name, mediaType: c.mediaType, mediaName: c.mediaName, content: mdContent });
        document.getElementById('subsListSection').classList.remove('hidden');
    } else {
        const items = document.querySelectorAll('#subsList .sub-list-item');
        const item = items[_editingSubIdx];
        if (item) {
            item.dataset.name = name;
            item.dataset.mediaType = c.mediaType;
            item.dataset.mediaName = c.mediaName;
            if (contentArea) item.dataset.content = mdContent;
            item.querySelector('.sub-list-name').textContent = name;
        }
    }

    updateSubsCount();
    _editingSubIdx = null;

    if (wasNew && !skipReopen) {
        // Stay in "add another sub-topic" mode — re-open a fresh editor.
        openSubEditor('new');
    } else {
        // Close the editor and restore the +Add button.
        editor.classList.add('hidden');
        editor.innerHTML = '';
        document.getElementById('addSubTopicBtnRow').classList.remove('hidden');
    }
    return true;
}

function subListItemHtml(name, mediaType, mediaName, content) {
    var contentAttr = content ? ' data-content="' + escapeAttr(content) + '"' : '';
    return '<div class="sub-list-item" draggable="true"' +
        ' data-name="' + escapeAttr(name) + '"' +
        ' data-media-type="' + escapeAttr(mediaType) + '"' +
        ' data-media-name="' + escapeAttr(mediaName) + '"' +
        contentAttr +
        ' ondragstart="subDragStart(event,this)"' +
        ' ondragover="subDragOver(event,this)"' +
        ' ondragleave="subDragLeave(event,this)"' +
        ' ondrop="subDrop(event,this)"' +
        ' ondragend="subDragEnd(event,this)">' +
        '<span class="sub-drag-handle"><i class="fas fa-grip-vertical"></i></span>' +
        '<span class="sub-list-name">' + escapeAttr(name) + '</span>' +
        '<div class="sub-list-actions">' +
            '<button type="button" class="btn-icon" onclick="editSubItem(this)" title="Edit"><i class="fas fa-pen"></i></button>' +
            '<button type="button" class="btn-icon" onclick="removeSubItem(this)" title="Remove"><i class="fas fa-trash"></i></button>' +
        '</div>' +
    '</div>';
}

function appendSubItem(sub) {
    const list = document.getElementById('subsList');
    list.insertAdjacentHTML('beforeend', subListItemHtml(sub.name, sub.mediaType, sub.mediaName, sub.content || ''));
}

var _subDragSrc = null;

function subDragStart(e, el) {
    _subDragSrc = el;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', '');
    setTimeout(function() { el.classList.add('dragging'); }, 0);
}

function subDragOver(e, el) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (el === _subDragSrc) return;
    el.classList.remove('drag-over-top', 'drag-over-bottom');
    var midY = el.getBoundingClientRect().top + el.offsetHeight / 2;
    el.classList.add(e.clientY < midY ? 'drag-over-top' : 'drag-over-bottom');
}

function subDragLeave(e, el) {
    el.classList.remove('drag-over-top', 'drag-over-bottom');
}

function subDrop(e, el) {
    e.preventDefault();
    e.stopPropagation();
    if (!_subDragSrc || _subDragSrc === el) return;
    var midY = el.getBoundingClientRect().top + el.offsetHeight / 2;
    if (e.clientY < midY) {
        el.parentNode.insertBefore(_subDragSrc, el);
    } else {
        el.parentNode.insertBefore(_subDragSrc, el.nextSibling);
    }
    el.classList.remove('drag-over-top', 'drag-over-bottom');
}

function subDragEnd(e, el) {
    el.classList.remove('dragging');
    document.querySelectorAll('.sub-list-item').forEach(function(item) {
        item.classList.remove('drag-over-top', 'drag-over-bottom');
    });
    _subDragSrc = null;
}

function editSubItem(btn) {
    const item = btn.closest('.sub-list-item');
    const idx = Array.from(item.parentNode.children).indexOf(item);
    openSubEditor('edit', idx);
}

function removeSubItem(btn) {
    const item = btn.closest('.sub-list-item');
    if (!item) return;
    item.remove();
    updateSubsCount();
    if (document.querySelectorAll('#subsList .sub-list-item').length === 0) {
        document.getElementById('subsListSection').classList.add('hidden');
        document.getElementById('addSubTopicBtnRow').classList.add('hidden');
        const editor = document.getElementById('subEditor');
        if (editor.classList.contains('hidden')) {
            // Expand the full topic form and re-offer the two choices.
            expandTopicForm();
            const choicePicker = document.getElementById('choicePicker');
            if (choicePicker) choicePicker.classList.remove('hidden');
            const choicePromptLabelEl = document.getElementById('choicePromptLabel');
            if (choicePromptLabelEl) choicePromptLabelEl.classList.remove('hidden');
        }
    }
}

function updateSubsCount() {
    const count = document.querySelectorAll('#subsList .sub-list-item').length;
    const el = document.getElementById('subsListCount');
    if (el) el.textContent = count;
    const badge = document.getElementById('addTabSubsBadge');
    if (badge) {
        badge.textContent = count;
        badge.classList.toggle('hidden', count === 0);
    }
}

// ===== Helpers =====
function escapeAttr(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

var _SHARE_MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function formatSharedDate(isoStr) {
    if (!isoStr) return '';
    var d = new Date(isoStr);
    return d.getDate() + ' ' + _SHARE_MONTHS[d.getMonth()] + ' \'' + String(d.getFullYear()).slice(2);
}

function getSharedDate(companyKey, topicName, deptName) {
    if (typeof TOPICS_BY_SCOPE === 'undefined') return '';
    var key = (companyKey || '') + '|' + deptName;
    var bucket = TOPICS_BY_SCOPE[key];
    if (!bucket) return '';
    var topic = bucket.find(function(t) { return t.name === topicName; });
    if (!topic) return '';
    if (!topic.sharedDate) {
        // Back-fill for topics shared before date-stamping was introduced.
        topic.sharedDate = new Date().toISOString();
        persistTopicsScope();
    }
    return topic.sharedDate;
}

function getCategories(row) {
    return (row.dataset.categories || '').split(',').map(s => s.trim()).filter(Boolean);
}

function getScopeSubtitle() {
    const key  = (document.getElementById('scopeCompany') || {}).value || '';
    const dept = (document.getElementById('scopeDept')    || {}).value || '';
    let compName = '';
    if (typeof SCOPE_COMPANIES !== 'undefined') {
        const c = SCOPE_COMPANIES.find(c => c.id === key);
        if (c) compName = c.name;
    }
    if (!compName && key) compName = key.charAt(0).toUpperCase() + key.slice(1);
    return [compName, dept].filter(Boolean).join(' - ');
}

// ===== Toggle accordion =====
function toggleTopic(topicId) {
    const topicRow = document.querySelector(`tr[data-topic="${topicId}"]`);
    const moduleRows = document.querySelectorAll(`tr[data-parent="${topicId}"]`);
    if (!moduleRows.length) return;
    const isExpanded = topicRow.classList.contains('expanded');

    if (isExpanded) {
        topicRow.classList.remove('expanded');
        topicRow.querySelector('.chevron i').className = 'fas fa-chevron-right';
        moduleRows.forEach(row => {
            row.classList.add('hidden');
            row.classList.remove('selected');
        });
        if (currentViewRow && currentViewRow.getAttribute('data-parent') === String(topicId)) {
            showEmpty();
        }
    } else {
        topicRow.classList.add('expanded');
        topicRow.querySelector('.chevron i').className = 'fas fa-chevron-down';
        moduleRows.forEach(row => row.classList.remove('hidden'));
    }
}

// ===== Panel helpers =====
function showEmpty() {
    const panel = document.getElementById('detailPanel');
    panel.classList.remove('open');
    document.getElementById('detailEmpty').style.display = '';
    document.getElementById('detailView').classList.add('hidden');
    document.getElementById('detailEdit').classList.add('hidden');
    const share = document.getElementById('detailShare');
    if (share) share.classList.add('hidden');
    clearSelection();
    currentViewRow = null;
    currentEditRow = null;
    _currentShareTarget = null;
    hideDisableButton();
}

function showEdit() {
    const panel = document.getElementById('detailPanel');
    panel.classList.add('open');
    document.getElementById('detailEmpty').style.display = 'none';
    document.getElementById('detailView').classList.add('hidden');
    document.getElementById('detailEdit').classList.remove('hidden');
    const share = document.getElementById('detailShare');
    if (share) share.classList.add('hidden');
    updateDeleteButton();
}

function showShare() {
    const panel = document.getElementById('detailPanel');
    panel.classList.add('open');
    document.getElementById('detailEmpty').style.display = 'none';
    document.getElementById('detailView').classList.add('hidden');
    document.getElementById('detailEdit').classList.add('hidden');
    document.getElementById('detailShare').classList.remove('hidden');
}

function hideDisableButton() {
    const btn = document.getElementById('editDisableBtn');
    if (btn) btn.classList.add('hidden');
}

function updateDisableButton(isActive) {
    const btn = document.getElementById('editDisableBtn');
    if (!btn) return;
    btn.classList.remove('hidden');
    if (isActive) {
        btn.innerHTML = '<i class="fas fa-ban"></i> Disable';
        btn.classList.add('btn-text-danger');
        btn.classList.remove('btn-text-success');
    } else {
        btn.innerHTML = '<i class="fas fa-check-circle"></i> Activate';
        btn.classList.remove('btn-text-danger');
        btn.classList.add('btn-text-success');
    }
}

function updateDeleteButton() {
    const btn = document.getElementById('editDeleteBtn');
    if (!btn) return;
    const canDelete = !isAddMode && (currentEditType === 'topic' || currentEditType === 'module') && currentEditRow;
    btn.classList.toggle('hidden', !canDelete);
}

function deleteCurrent() {
    if (isAddMode || !currentEditRow) return;
    if (currentEditType === 'topic') {
        const name = currentEditRow.querySelector('.company-name').textContent.trim();
        if (!confirm(`Delete "${name}" and all its sub-topics? This cannot be undone.`)) return;
        const topicId = currentEditRow.dataset.topic;
        document.querySelectorAll(`tr[data-parent="${topicId}"]`).forEach(r => r.remove());
        currentEditRow.remove();
        snapshotCurrentScope();
        showToast(`"${name}" deleted`);
        showEmpty();
    } else if (currentEditType === 'module') {
        const name = currentEditRow.querySelector('.dept-name').textContent.trim();
        if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
        const topicId = currentEditRow.getAttribute('data-parent');
        currentEditRow.remove();
        if (typeof updateTopicModuleCount === 'function') updateTopicModuleCount(topicId);
        snapshotCurrentScope();
        showToast(`"${name}" deleted`);
        showEmpty();
    }
}

function clearSelection() {
    document.querySelectorAll('.row-dept.selected, .row-company.selected').forEach(r => r.classList.remove('selected'));
}

// ===== Select module row (goes straight to edit, matching Companies UX) =====
function selectRow(row) {
    clearSelection();
    row.classList.add('selected');
    currentViewRow = row;
    currentEditRow = row;
    currentEditType = 'module';
    openModuleEdit(row);
    event.stopPropagation();
}

// ===== Switch from view to edit =====
function switchToEdit() {
    if (currentViewRow) {
        currentEditRow = currentViewRow;
        currentEditType = 'module';
        openModuleEdit(currentViewRow);
    }
}

// ===== Edit Topic =====
function editTopic(btn, evt) {
    evt.stopPropagation();
    const row = btn.closest('tr');
    clearSelection();
    row.classList.add('selected');
    currentEditRow = row;
    currentEditType = 'topic';
    currentViewRow = null;

    openTopicEdit(row);
}

function openTopicEdit(row) {
    const name = row.querySelector('.company-name').textContent.trim();
    const description = row.dataset.description || '';
    const cover = row.dataset.cover || '';
    const isActive = row.dataset.active !== 'false';

    document.getElementById('editTitle').textContent = 'Edit Topic';
    document.getElementById('editSubtitle').textContent = getScopeSubtitle();
    setPanelMode('edit');
    updateDisableButton(isActive);

    document.getElementById('editFields').innerHTML = `
        <div class="form-group">
            <label>Cover Image</label>
            ${coverPickerHtml(cover)}
        </div>
        <div class="form-group">
            <label>Topic Name</label>
            <input type="text" name="name" value="${escapeAttr(name)}" required>
        </div>
        <div class="form-group">
            <label>Description</label>
            <input type="text" name="description" value="${escapeAttr(description)}" placeholder="Topic description">
        </div>
    `;

    showEdit();
}

// ===== Edit Module =====
function editModule(btn, evt) {
    evt.stopPropagation();
    const row = btn.closest('tr');
    clearSelection();
    row.classList.add('selected');
    currentEditRow = row;
    currentEditType = 'module';
    currentViewRow = row;

    openModuleEdit(row);
}

function openModuleEdit(row) {
    const name = row.querySelector('.dept-name').textContent.trim();
    const description = row.dataset.description || '';
    const mediaType = row.dataset.mediaType || 'PDF';
    const mediaName = row.dataset.mediaName || '';
    document.getElementById('editTitle').textContent = 'Edit Sub-Topic';
    document.getElementById('editSubtitle').textContent = getScopeSubtitle();
    setPanelMode('edit');
    hideDisableButton();

    document.getElementById('editFields').innerHTML = `
        <div class="form-group">
            <label>Sub-Topic Name</label>
            <input type="text" name="name" value="${escapeAttr(name)}" required>
        </div>
        <div class="form-group">
            <label>Description</label>
            <textarea name="description" rows="3" placeholder="Sub-topic description...">${escapeAttr(description)}</textarea>
        </div>
        <div class="form-group">
            <label>Content</label>
            ${contentPickerHtml('edit', { kind: kindForMediaType(mediaType), mediaType, mediaName })}
        </div>
    `;

    showEdit();
}

function updateMediaAccept(select) {
    const input = document.getElementById('mediaFileInput');
    if (!input) return;
    const v = select.value;
    input.accept = v === 'PDF' ? 'application/pdf' : v === 'video' ? 'video/*' : 'image/*';
}

function updateMediaFilename(input) {
    const file = input.files[0];
    const label = document.getElementById('mediaFilename');
    const hidden = document.getElementById('mediaNameHidden');
    if (!file) return;
    if (label) label.textContent = file.name;
    if (hidden) hidden.value = file.name;
}

// ===== Save edit =====
function saveEdit(evt) {
    evt.preventDefault();
    const form = document.getElementById('editForm');
    const data = new FormData(form);

    if (isAddMode) {
        saveAdd(data);
        return;
    }

    const row = currentEditRow;

    if (currentEditType === 'topic') {
        const name = data.get('name');
        const description = data.get('description') || '';
        const cover = data.get('cover') || '';

        row.querySelector('.company-name').textContent = name;
        row.dataset.description = description;
        row.dataset.cover = cover;
        const topicThumb = row.querySelector('.row-thumb');
        if (topicThumb) topicThumb.src = cover || randomCover();

        updateTopicRowChips(row);
        snapshotCurrentScope();
        showToast(`"${name}" updated`);
        showEmpty();

    } else if (currentEditType === 'module') {
        const name = data.get('name');
        const description = data.get('description') || '';
        const picker = document.querySelector('#editFields .content-picker');
        if (picker && !validateContentPicker(picker)) {
            showToast('Sub-topic needs content (file, video URL, or text)');
            return;
        }
        const content = picker
            ? readContentPicker(picker)
            : { mediaType: 'PDF', mediaName: '' };
        row.querySelector('.dept-name').textContent = name;
        row.dataset.description = description;
        row.dataset.mediaType = content.mediaType;
        row.dataset.mediaName = content.mediaName;

        updateModuleRowChips(row);
        snapshotCurrentScope();
        showToast(`"${name}" updated`);
        showEmpty();
    }
}

// Builds and inserts a sub-topic row under the given parent topic.
function createSubTopicRow(parentTopicId, sub) {
    const parentRow = document.querySelector(`tr[data-topic="${parentTopicId}"]`);
    if (!parentRow) return null;
    const existingSubs = document.querySelectorAll(`tr[data-parent="${parentTopicId}"]`);
    const insertAfter = existingSubs.length > 0 ? existingSubs[existingSubs.length - 1] : parentRow;

    const mediaType = sub.mediaType || 'PDF';
    const mediaName = sub.mediaName || '';
    const meta = mediaMeta(mediaType);

    const tr = document.createElement('tr');
    tr.className = 'row-dept';
    tr.dataset.parent = parentTopicId;
    tr.dataset.description = sub.description || '';
    tr.dataset.mediaType = mediaType;
    tr.dataset.mediaName = mediaName;
    tr.setAttribute('onclick', 'selectRow(this)');
    tr.innerHTML = `
        <td class="col-name"><div class="cell-row"><span class="dept-indent"></span><span class="dept-connector"></span><span class="dept-name">${escapeAttr(sub.name)}</span><span class="row-main-chip"><span class="chip chip-media"><i class="${meta.icon}"></i> ${meta.label}</span></span><span class="cell-pills"></span><span class="row-actions">
            <div class="action-menu">
                <button class="btn-icon action-menu-trigger" onclick="toggleTopicMenu(this, event)" title="Actions" aria-haspopup="true" aria-expanded="false"><i class="fas fa-ellipsis-vertical"></i></button>
                <div class="action-menu-popup" role="menu">
                    <button type="button" class="action-item" onclick="actionEditSubTopic(this, event)"><i class="fas fa-pen"></i> Edit</button>
                    <div class="action-sep"></div>
                    <button type="button" class="action-item action-item-danger" onclick="actionDeleteSubTopic(this, event)"><i class="fas fa-trash"></i> Delete</button>
                </div>
            </div>
        </span></div></td>
    `;
    insertAfter.after(tr);
    refreshModuleConnectors(parentTopicId);
    updateTopicModuleCount(parentTopicId);
    return tr;
}

// Reads the listed sub-topic rows back into an array (in display order).
function readListedSubs() {
    return Array.from(document.querySelectorAll('#subsList .sub-list-item')).map(item => ({
        name: item.dataset.name || '',
        mediaType: item.dataset.mediaType || 'PDF',
        mediaName: item.dataset.mediaName || ''
    }));
}

// ===== Save new (add mode) =====
function saveAdd(data) {
    // Stepper intercept: if the stepper is active (Enter key pressed in a text field),
    // advance the stepper instead of jumping straight to commit.
    if (document.getElementById('addStepper')) { goStepNext(); return; }

    const tbody = document.querySelector('.data-table tbody');

    if (currentEditType === 'topic') {
        // If the inline sub-topic editor is open, auto-commit (or discard if empty)
        // so its draft isn't lost when the user clicks the panel's Save button.
        const subEditor = document.getElementById('subEditor');
        if (subEditor && !subEditor.classList.contains('hidden')) {
            const draftName = (subEditor.querySelector('.sub-edit-name').value || '').trim();
            if (draftName) {
                if (!commitSubEditor(true)) return;
            } else {
                cancelSubEditor();
            }
        }

        const isAIFlow = !!document.getElementById('aiStep2Section');

        if (isAIFlow) {
            // AI flow: only require name and description to be non-empty.
            const aiName = (data.get('name') || '').trim();
            const aiDesc = (data.get('description') || '').trim();
            if (!aiName || !aiDesc) {
                switchAITab('ai-topic');
                const emptyField = !aiName
                    ? document.querySelector('#aiTabPaneTopic input[name="name"]')
                    : document.querySelector('#aiTabPaneTopic input[name="description"]');
                if (emptyField) emptyField.focus();
                showToast(!aiName ? 'Please enter a topic name' : 'Please enter a description');
                return;
            }
        } else {
            // Normal flow: require content or at least one sub-topic.
            const contentSection = document.getElementById('topicContentSection');
            const contentVisible = contentSection && !contentSection.classList.contains('hidden');
            const hasSubs = document.querySelectorAll('#subsList .sub-list-item').length > 0;
            if (!contentVisible && !hasSubs) {
                switchAddTab('topic');
                const picker = document.getElementById('choicePicker');
                if (picker) {
                    picker.classList.add('error');
                    picker.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                showToast('Please add content or a sub-topic before saving');
                return;
            }
        }

        const contentSection = document.getElementById('topicContentSection');
        const contentVisible = !isAIFlow && contentSection && !contentSection.classList.contains('hidden');

        const existingIds = [...document.querySelectorAll('tr[data-topic]')].map(r => parseInt(r.dataset.topic));
        const newId = Math.max(0, ...existingIds) + 1;
        const name = data.get('name') || 'Untitled Topic';
        const subtitle = data.get('subtitle') || '';
        const description = data.get('description') || '';
        const cover = data.get('cover') || '';

        const tr = document.createElement('tr');
        tr.className = 'row-company expanded';
        tr.dataset.topic = newId;
        tr.dataset.subtitle = subtitle;
        tr.dataset.description = description;
        tr.dataset.cover = cover;
        tr.dataset.active = 'true';
        tr.dataset.name = name;
        tr.setAttribute('onclick', `toggleTopic(${newId})`);
        tr.innerHTML = `
            <td class="col-name">
                <div class="cell-row">
                    <span class="row-select"><input type="checkbox" class="row-checkbox" data-topic-name="${escapeAttr(name)}" onclick="onSelectCheckbox(event)"></span>
                    <span class="chevron" style="visibility:hidden"><i class="fas fa-chevron-down"></i></span>
                    <img class="row-thumb" src="${escapeAttr(cover || randomCover())}" alt="">
                    <span class="company-name">${escapeAttr(name)}</span>
                    <span class="row-main-chip"></span>
                    <span class="cell-pills"></span>
                    <span class="row-status"><span class="chip chip-status chip-status-active">Active</span></span>
                    <span class="row-actions">
                        <div class="action-menu">
                            <button class="btn-icon action-menu-trigger" onclick="toggleTopicMenu(this, event)" title="Actions" aria-haspopup="true" aria-expanded="false"><i class="fas fa-ellipsis-vertical"></i></button>
                            <div class="action-menu-popup" role="menu">
                                <button type="button" class="action-item" onclick="actionAddSubTopic(this, event)"><i class="fas fa-puzzle-piece"></i> Add sub-topic</button>
                                <button type="button" class="action-item" onclick="actionAddGameForTopic(this, event)"><i class="fas fa-trophy"></i> Add game</button>
                                <button type="button" class="action-item" onclick="actionEditTopic(this, event)"><i class="fas fa-pen"></i> Edit</button>
                                <button type="button" class="action-item" onclick="actionShareTopic(this, event)"><i class="fas fa-people-group"></i> Share</button>
                                <button type="button" class="action-item" onclick="actionToggleDisabled(this, event)"><i class="fas fa-ban"></i> Disable</button>
                                <div class="action-sep"></div>
                                <button type="button" class="action-item action-item-danger" onclick="actionDeleteTopic(this, event)"><i class="fas fa-trash"></i> Delete</button>
                            </div>
                        </div>
                    </span>
                </div>
            </td>
        `;
        tbody.appendChild(tr);

        const listed = readListedSubs();

        // In the AI flow, collect sub-topics from the generated accordion.
        const aiSubs = isAIFlow
            ? Array.from(document.querySelectorAll('#aiTabPaneSubs .ai-sub-item')).map(function(item) {
                const nameEl = item.querySelector('.ai-sub-name');
                return {
                    name: (nameEl ? nameEl.textContent.trim() : '') || 'Untitled Sub-Topic',
                    mediaType: 'text',
                    mediaName: nameEl ? nameEl.textContent.trim() : ''
                };
            })
            : [];

        const allSubs = listed.concat(aiSubs);

        if (allSubs.length > 0) {
            // Topic acts as a container for sub-topics.
            allSubs.forEach(s => createSubTopicRow(newId, s));
            updateTopicRowChips(tr);
        } else if (contentVisible) {
            // Single-content topic.
            const picker = contentSection.querySelector('.content-picker');
            if (!validateContentPicker(picker)) {
                showToast('Add content (file, video URL, or text) or switch to sub-topics');
                tr.remove();
                picker.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }
            const c = readContentPicker(picker);
            tr.dataset.mediaType = c.mediaType;
            tr.dataset.mediaName = c.mediaName;
            updateTopicRowChips(tr);
        }

        const subSummary = allSubs.length
            ? ` with ${allSubs.length} sub-topic${allSubs.length !== 1 ? 's' : ''}`
            : '';
        snapshotCurrentScope();
        showToast(`"${name}" added${subSummary}`);
        const gameToggle = document.getElementById('createGameToggle');
        _pendingCreateGame = !!(gameToggle && gameToggle.checked);
        if (_pendingCreateGame) {
            const activeFlowBtn = document.querySelector('#gameFlowPicker .game-flow-btn.active');
            _pendingGameFlow = activeFlowBtn ? activeFlowBtn.dataset.flow : 'normal';
        }
        const coverEl = document.querySelector('#editFields .cover-hidden-input');
        _pendingTopicCover = coverEl ? coverEl.value : '';
        const descEl = document.querySelector('#editFields input[name="description"]') ||
                       document.querySelector('#editFields textarea[name="description"]');
        _pendingTopicDesc = descEl ? (descEl.value || '') : '';
        openShareInPanel({ kind: 'topic', name: name, isNew: true });

    } else if (currentEditType === 'module') {
        const parentId = data.get('parentTopic');
        const picker = document.querySelector('#editFields .content-picker');
        if (picker && !validateContentPicker(picker)) {
            showToast('Sub-topic needs content (file, video URL, or text)');
            return;
        }
        const content = picker
            ? readContentPicker(picker)
            : { mediaType: data.get('mediaType') || 'PDF', mediaName: data.get('mediaName') || '' };

        const tr = createSubTopicRow(parentId, {
            name: data.get('name') || 'Untitled Sub-Topic',
            description: data.get('description') || '',
            mediaType: content.mediaType,
            mediaName: content.mediaName
        });

        const subName = data.get('name') || 'Untitled Sub-Topic';
        snapshotCurrentScope();
        showToast(`"${subName}" added`);
        currentEditRow = tr;
        currentViewRow = tr;
        setPanelMode('edit');
        openModuleEdit(tr);
    }
}

// ===== Re-render a topic row's chip area =====
function updateTopicRowChips(row) {
    const modCount = document.querySelectorAll(`tr[data-parent="${row.dataset.topic}"]`).length;
    const mainChip = row.querySelector('.row-main-chip');
    if (!mainChip) return;
    if (modCount === 0 && row.dataset.mediaType) {
        const meta = mediaMeta(row.dataset.mediaType);
        mainChip.innerHTML = `<span class="chip chip-media"><i class="${meta.icon}"></i> ${meta.label}</span>`;
    } else if (modCount > 0) {
        mainChip.innerHTML = `<span class="chip chip-modules"><i class="fas fa-book-open"></i> ${modCount} sub-topic${modCount !== 1 ? 's' : ''}</span>`;
    } else {
        mainChip.innerHTML = '';
    }
    const chevronEl = row.querySelector('.chevron');
    if (chevronEl) chevronEl.style.visibility = modCount > 0 ? '' : 'hidden';
}

function updateTopicModuleCount(topicId) {
    const topicRow = document.querySelector(`tr[data-topic="${topicId}"]`);
    if (topicRow) updateTopicRowChips(topicRow);
}

function updateModuleRowChips(row) {
    const meta = mediaMeta(row.dataset.mediaType);
    const mainChip = row.querySelector('.row-main-chip');
    if (mainChip) mainChip.innerHTML = `<span class="chip chip-media"><i class="${meta.icon}"></i> ${meta.label}</span>`;
}

function refreshModuleConnectors(topicId) {
    const rows = document.querySelectorAll(`tr[data-parent="${topicId}"]`);
    rows.forEach((r, i) => {
        const connector = r.querySelector('.dept-connector');
        if (!connector) return;
        connector.classList.toggle('last', i === rows.length - 1);
    });
}

// ===== Cancel / close =====
function cancelEdit() { showEmpty(); }
function closeDetail() { showEmpty(); }

// ===== Cover image preview =====
function previewCover(input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        const dataUrl = e.target.result;
        const tile = input.closest('.cover-tile-upload');
        if (!tile) return;
        tile.dataset.cover = dataUrl;
        const empty = tile.querySelector('.cover-upload-empty');
        if (empty) empty.remove();
        let img = tile.querySelector('img');
        if (!img) {
            img = document.createElement('img');
            img.alt = 'Custom cover';
            tile.insertBefore(img, tile.firstChild);
        }
        img.src = dataUrl;
        if (!tile.querySelector('.cover-tile-overlay')) {
            tile.insertAdjacentHTML('beforeend', '<span class="cover-tile-overlay"><i class="fas fa-camera"></i></span>');
        }
        selectCoverTile(tile);
    };
    reader.readAsDataURL(file);
}

// ===== Panel mode =====
function setPanelMode(mode) {
    // The Share step replaces .edit-actions; restore it before doing anything else.
    if (!document.getElementById('editSubmitBtn')) {
        const actions = document.querySelector('#detailEdit .edit-actions');
        if (actions) actions.innerHTML =
            '<button type="button" class="btn-icon btn-delete-icon hidden" id="editDeleteBtn" onclick="deleteCurrent()" title="Delete"><i class="fas fa-trash"></i></button>' +
            '<button type="button" class="btn btn-text-danger hidden" id="editDisableBtn" onclick="toggleCurrentTopicActive()"><i class="fas fa-ban"></i> Disable</button>' +
            '<button type="button" class="btn btn-outline" onclick="cancelEdit()">Cancel</button>' +
            '<button type="submit" class="btn btn-primary" id="editSubmitBtn">Save Changes</button>';
    }
    const badge = document.getElementById('editBadge');
    const submitBtn = document.getElementById('editSubmitBtn');
    const creditsEl = document.getElementById('aiCreditsDisplay');
    badge.classList.remove('badge-ai');
    if (creditsEl) creditsEl.hidden = true;
    submitBtn.hidden = false;
    submitBtn.disabled = false;
    var genBtn = document.getElementById('aiGenerateBtn');
    if (genBtn) genBtn.remove();
    if (mode === 'add') {
        isAddMode = true;
        badge.innerHTML = '<i class="fas fa-plus"></i> Adding';
        submitBtn.textContent = 'Save';
        hideDisableButton();
    } else {
        isAddMode = false;
        badge.innerHTML = '<i class="fas fa-pen"></i> Editing';
        submitBtn.textContent = 'Save Changes';
    }
}

// ===== Add Topic =====
// Uses a 3-step stepper: Step 1 Content, Step 2 Sharing, Step 3 Game.
// Choosing "Add sub-topics" in Step 1 collapses the topic form into a mini-card
// at the top and reveals the inline sub-topic editor below.
function addTopic() {
    clearSelection();
    currentEditRow = null;
    currentEditType = 'topic';
    currentViewRow = null;
    _editingSubIdx = null;

    document.getElementById('editTitle').textContent = 'Add Topic';
    document.getElementById('editSubtitle').textContent = getScopeSubtitle();

    document.getElementById('editFields').innerHTML = `
        <div class="add-stepper" id="addStepper">
            <div class="add-step active" data-step="1">
                <span class="add-step-num">1</span>
                <span class="add-step-label">Content</span>
            </div>
            <div class="add-step-connector"></div>
            <div class="add-step" data-step="2">
                <span class="add-step-num">2</span>
                <span class="add-step-label">Sharing</span>
            </div>
            <div class="add-step-connector"></div>
            <div class="add-step" data-step="3">
                <span class="add-step-num">3</span>
                <span class="add-step-label">Game</span>
            </div>
        </div>

        <div class="add-step-pane" id="stepPane1">
            <div class="topic-mini hidden" id="topicMiniCard">
                <img class="topic-mini-cover" id="topicMiniThumb" src="" alt="">
                <div class="topic-mini-text">
                    <div class="topic-mini-label">Topic</div>
                    <div class="topic-mini-name" id="topicMiniName"></div>
                </div>
                <div class="topic-mini-actions">
                    <button type="button" class="btn-icon" onclick="expandTopicForm()" title="Edit topic details">
                        <i class="fas fa-pen"></i>
                    </button>
                </div>
            </div>

            <div id="topicFullForm">
                <div class="form-group">
                    <label>Cover image</label>
                    ${coverPickerHtml('')}
                </div>
                <div class="form-group">
                    <label>Topic name</label>
                    <input type="text" name="name" value="" required placeholder="Topic name">
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <input type="text" name="description" value="" placeholder="Topic description">
                </div>
            </div>

            <div class="form-group hidden" id="topicContentSection">
                <div class="content-section-head">
                    <label>Content</label>
                    <button type="button" class="btn-link-remove" onclick="removeTopicContent()" title="Remove content"><i class="fas fa-times"></i> Remove</button>
                </div>
                ${contentPickerHtml('topic-content', { kind: 'upload', mediaType: 'PDF', mediaName: '' })}
            </div>

            <div class="form-group" id="choicePromptLabel">
                <label>What would you like to add to this topic?</label>
            </div>
            <div class="choice-picker" id="choicePicker">
                <div class="choice-buttons">
                    <button type="button" class="btn btn-outline btn-choice" onclick="chooseAddContent()">
                        <i class="fas fa-upload"></i>
                        <span class="choice-label">Add content</span>
                        <span class="choice-hint">Provide a single file, video URL or text</span>
                    </button>
                    <button type="button" class="btn btn-outline btn-choice" onclick="chooseAddSubTopic()">
                        <i class="fas fa-list-ol"></i>
                        <span class="choice-label">Add sub-topics</span>
                        <span class="choice-hint">Create multiple learning topics</span>
                    </button>
                </div>
            </div>

            <div class="sub-list-section hidden" id="subsListSection">
                <div class="sub-list-head">
                    <label>Sub-topics</label>
                    <span class="sub-list-count-wrap"><span id="subsListCount">0</span> in this topic</span>
                </div>
                <div id="subsList" class="sub-list"></div>
            </div>
            <div id="subEditor" class="sub-editor hidden"></div>
            <div class="add-sub-row hidden" id="addSubTopicBtnRow">
                <button type="button" class="btn btn-outline btn-add-sub" id="addSubTopicBtn" onclick="openSubEditor('new')">
                    <i class="fas fa-plus"></i> Add another sub-topic
                </button>
            </div>
        </div>

        <div class="add-step-pane hidden" id="stepPane2"></div>
        <div class="add-step-pane hidden" id="stepPane3"></div>
    `;

    setPanelMode('add');
    setupStepperActions(1);
    showEdit();
}

// ===== Stepper helpers (normal Add Topic flow only) =====

function getCurrentStepperStep() {
    var steps = document.querySelectorAll('#addStepper .add-step');
    for (var i = 0; i < steps.length; i++) {
        if (steps[i].classList.contains('active')) return parseInt(steps[i].dataset.step);
    }
    return 1;
}

function setupStepperActions(step) {
    var actions = document.querySelector('#detailEdit .edit-actions');
    if (!actions) return;
    var backBtn = step > 1
        ? '<button type="button" class="btn btn-outline" onclick="goStepBack()"><i class="fas fa-arrow-left"></i> Back</button>'
        : '';
    var fwdBtn = step < 3
        ? '<button type="button" class="btn btn-primary" onclick="goStepNext()">Next <i class="fas fa-arrow-right"></i></button>'
        : '<button type="button" class="btn btn-primary" onclick="commitAllSteps()"><i class="fas fa-check"></i> Done</button>';
    actions.innerHTML =
        '<button type="button" class="btn btn-outline" onclick="cancelEdit()">Cancel</button>' +
        backBtn +
        fwdBtn;
}

function goStepNext() {
    var stepper = document.getElementById('addStepper');
    if (!stepper) return;
    var current = getCurrentStepperStep();
    if (current === 1) {
        if (!validateStep1()) return;
        buildStep2();
        switchToStep(2);
    } else if (current === 2) {
        buildStep3();
        switchToStep(3);
    }
    // Step 3 has no next — "Done" calls commitAllSteps() directly.
}

function goStepBack() {
    var current = getCurrentStepperStep();
    if (current > 1) switchToStep(current - 1);
}

function switchToStep(step) {
    document.querySelectorAll('#addStepper .add-step').forEach(function(s) {
        var n = parseInt(s.dataset.step);
        s.classList.remove('active', 'done');
        if (n < step) s.classList.add('done');
        else if (n === step) s.classList.add('active');
    });
    for (var i = 1; i <= 3; i++) {
        var pane = document.getElementById('stepPane' + i);
        if (pane) pane.classList.toggle('hidden', i !== step);
    }
    setupStepperActions(step);
}

function validateStep1() {
    // If the mini-card is showing, sub-topics mode is active.
    var miniCard = document.getElementById('topicMiniCard');
    var isMiniMode = miniCard && !miniCard.classList.contains('hidden');

    if (isMiniMode) {
        // Auto-commit any open sub editor first.
        var subEditorEl = document.getElementById('subEditor');
        if (subEditorEl && !subEditorEl.classList.contains('hidden')) {
            var draftName = (subEditorEl.querySelector('.sub-edit-name') || {}).value || '';
            if (draftName.trim()) {
                if (!commitSubEditor(true)) return false;
            } else {
                cancelSubEditor();
            }
        }
        var hasSubs = document.querySelectorAll('#subsList .sub-list-item').length > 0;
        if (!hasSubs) {
            showToast('Add at least one sub-topic before continuing');
            return false;
        }
        return true;
    }

    // Full form is showing.
    var nameInput = document.querySelector('#topicFullForm input[name="name"]');
    if (!nameInput || !nameInput.value.trim()) {
        if (nameInput) { nameInput.classList.add('input-error'); nameInput.focus(); }
        showToast('Please enter a topic name');
        return false;
    }
    nameInput.classList.remove('input-error');

    var contentSection = document.getElementById('topicContentSection');
    var contentVisible = contentSection && !contentSection.classList.contains('hidden');
    var hasSubs2 = document.querySelectorAll('#subsList .sub-list-item').length > 0;

    if (!contentVisible && !hasSubs2) {
        var choicePicker = document.getElementById('choicePicker');
        if (choicePicker) {
            choicePicker.classList.add('error');
            choicePicker.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        showToast('Please add content or sub-topics before continuing');
        return false;
    }

    if (contentVisible) {
        var picker = contentSection ? contentSection.querySelector('.content-picker') : null;
        if (picker && !validateContentPicker(picker)) {
            showToast('Add content (file, video URL, or text) before continuing');
            return false;
        }
    }

    return true;
}

function showTopicMiniCard() {
    var nameInput = document.querySelector('#topicFullForm input[name="name"]');
    var name = nameInput ? nameInput.value.trim() : '';
    var coverEl = document.querySelector('#topicFullForm .cover-hidden-input');
    var cover = coverEl ? coverEl.value : DEFAULT_COVER_URL;

    var miniCard = document.getElementById('topicMiniCard');
    if (!miniCard) return;
    var miniName = document.getElementById('topicMiniName');
    var miniThumb = document.getElementById('topicMiniThumb');
    if (miniName) miniName.textContent = name || 'Untitled Topic';
    if (miniThumb) miniThumb.src = cover || DEFAULT_COVER_URL;

    miniCard.classList.remove('hidden');
    var fullForm = document.getElementById('topicFullForm');
    if (fullForm) fullForm.classList.add('hidden');
}

function expandTopicForm() {
    // Hide the mini-card and reveal the full form for editing.
    // Sub-topics that already exist are left untouched — the caller is responsible
    // for clearing them when the "no subs" revert is actually needed.
    var miniCard = document.getElementById('topicMiniCard');
    if (miniCard) miniCard.classList.add('hidden');
    var fullForm = document.getElementById('topicFullForm');
    if (fullForm) fullForm.classList.remove('hidden');
}

function buildStep2() {
    var pane = document.getElementById('stepPane2');
    if (!pane) return;

    var companyKey = _currentScope.companyKey;
    var companies  = (typeof SIDEBAR_COMPANIES  !== 'undefined') ? SIDEBAR_COMPANIES  : [];
    var departments = (typeof SIDEBAR_DEPARTMENTS !== 'undefined') ? SIDEBAR_DEPARTMENTS : [];
    var company = companies.find(function(c) { return c.name.toLowerCase() === companyKey; });
    var currentDept = (_currentScope && _currentScope.dept) || '';

    var items = '';
    if (company) {
        var allDepts = departments.filter(function(d) { return d.companyId === company.id; });
        items = allDepts.map(function(d) {
            var precheck = d.name === currentDept;
            return '<label class="share-dept-item">' +
                '<input type="checkbox" value="' + escapeAttr(d.name) + '"' + (precheck ? ' checked' : '') + '>' +
                '<span class="share-dept-name">' + escapeAttr(d.name) + '</span>' +
                '</label>';
        }).join('') || '<div class="share-empty">No other departments to share with.</div>';
    } else {
        items = '<div class="share-empty">Select a company to configure sharing.</div>';
    }

    pane.innerHTML =
        '<p class="step-pane-lead">Choose which departments this topic will be shared with:</p>' +
        '<div class="share-dept-list" id="stepShareDeptList">' + items + '</div>';
}

function buildStep3() {
    var pane = document.getElementById('stepPane3');
    if (!pane) return;

    pane.innerHTML =
        '<p class="step-pane-lead">Would you like to create a game for this topic?</p>' +
        '<div class="game-option-cards">' +
            '<button type="button" class="game-option-card selected" data-game="none" onclick="selectGameOption(this)">' +
                '<span class="goc-icon"><i class="fas fa-times"></i></span>' +
                '<span class="goc-body">' +
                    '<span class="goc-title">No game</span>' +
                    '<span class="goc-desc">Skip for now — you can always add a game later.</span>' +
                '</span>' +
            '</button>' +
            '<button type="button" class="game-option-card" data-game="normal" onclick="selectGameOption(this)">' +
                '<span class="goc-icon"><i class="fas fa-trophy"></i></span>' +
                '<span class="goc-body">' +
                    '<span class="goc-title">Create a game</span>' +
                    '<span class="goc-desc">Set up a game manually with questions and rules.</span>' +
                '</span>' +
            '</button>' +
            '<button type="button" class="game-option-card" data-game="ai" onclick="selectGameOption(this)">' +
                '<span class="goc-icon"><i class="fas fa-wand-magic-sparkles"></i></span>' +
                '<span class="goc-body">' +
                    '<span class="goc-title">Generate with AI</span>' +
                    '<span class="goc-desc">Let AI create a game based on the topic content.</span>' +
                '</span>' +
            '</button>' +
        '</div>';
}

function selectGameOption(btn) {
    var cards = btn.closest('.game-option-cards');
    if (!cards) return;
    cards.querySelectorAll('.game-option-card').forEach(function(c) { c.classList.remove('selected'); });
    btn.classList.add('selected');
}

function commitAllSteps() {
    // Collect topic data from step 1.
    var miniCard = document.getElementById('topicMiniCard');
    var isMiniMode = miniCard && !miniCard.classList.contains('hidden');

    var name, description, cover;
    if (isMiniMode) {
        var miniNameEl = document.getElementById('topicMiniName');
        name = miniNameEl ? miniNameEl.textContent.trim() : 'Untitled Topic';
        var descEl2 = document.querySelector('#topicFullForm input[name="description"]') ||
                      document.querySelector('#topicFullForm textarea[name="description"]');
        description = descEl2 ? descEl2.value : '';
        var coverEl2 = document.querySelector('#topicFullForm .cover-hidden-input');
        cover = coverEl2 ? coverEl2.value : '';
    } else {
        var nameEl = document.querySelector('#topicFullForm input[name="name"]');
        name = nameEl ? nameEl.value.trim() : 'Untitled Topic';
        var descEl3 = document.querySelector('#topicFullForm input[name="description"]') ||
                      document.querySelector('#topicFullForm textarea[name="description"]');
        description = descEl3 ? descEl3.value : '';
        var coverEl3 = document.querySelector('#topicFullForm .cover-hidden-input');
        cover = coverEl3 ? coverEl3.value : '';
    }
    if (!name) name = 'Untitled Topic';

    // Determine game option from step 3.
    var selectedGameCard = document.querySelector('.game-option-card.selected');
    var gameOption = selectedGameCard ? selectedGameCard.dataset.game : 'none';
    _pendingCreateGame = (gameOption === 'normal' || gameOption === 'ai');
    _pendingGameFlow   = (gameOption === 'ai') ? 'ai' : 'normal';
    _pendingTopicCover = cover;
    _pendingTopicDesc  = description;

    // Create the topic row.
    var tbody = document.querySelector('.data-table tbody');
    var existingIds = Array.from(document.querySelectorAll('tr[data-topic]')).map(function(r) { return parseInt(r.dataset.topic); });
    var newId = Math.max.apply(null, [0].concat(existingIds)) + 1;

    var tr = document.createElement('tr');
    tr.className = 'row-company expanded';
    tr.dataset.topic = newId;
    tr.dataset.subtitle = '';
    tr.dataset.description = description;
    tr.dataset.cover = cover;
    tr.dataset.active = 'true';
    tr.dataset.name = name;
    tr.setAttribute('onclick', 'toggleTopic(' + newId + ')');
    tr.innerHTML =
        '<td class="col-name">' +
            '<div class="cell-row">' +
                '<span class="row-select"><input type="checkbox" class="row-checkbox" data-topic-name="' + escapeAttr(name) + '" onclick="onSelectCheckbox(event)"></span>' +
                '<span class="chevron" style="visibility:hidden"><i class="fas fa-chevron-down"></i></span>' +
                '<img class="row-thumb" src="' + escapeAttr(cover || randomCover()) + '" alt="">' +
                '<span class="company-name">' + escapeAttr(name) + '</span>' +
                '<span class="row-main-chip"></span>' +
                '<span class="cell-pills"></span>' +
                '<span class="row-status"><span class="chip chip-status chip-status-active">Active</span></span>' +
                '<span class="row-actions">' +
                    '<div class="action-menu">' +
                        '<button class="btn-icon action-menu-trigger" onclick="toggleTopicMenu(this, event)" title="Actions" aria-haspopup="true" aria-expanded="false"><i class="fas fa-ellipsis-vertical"></i></button>' +
                        '<div class="action-menu-popup" role="menu">' +
                            '<button type="button" class="action-item" onclick="actionAddSubTopic(this, event)"><i class="fas fa-puzzle-piece"></i> Add sub-topic</button>' +
                            '<button type="button" class="action-item" onclick="actionAddGameForTopic(this, event)"><i class="fas fa-trophy"></i> Add game</button>' +
                            '<button type="button" class="action-item" onclick="actionEditTopic(this, event)"><i class="fas fa-pen"></i> Edit</button>' +
                            '<button type="button" class="action-item" onclick="actionShareTopic(this, event)"><i class="fas fa-people-group"></i> Share</button>' +
                            '<button type="button" class="action-item" onclick="actionToggleDisabled(this, event)"><i class="fas fa-ban"></i> Disable</button>' +
                            '<div class="action-sep"></div>' +
                            '<button type="button" class="action-item action-item-danger" onclick="actionDeleteTopic(this, event)"><i class="fas fa-trash"></i> Delete</button>' +
                        '</div>' +
                    '</div>' +
                '</span>' +
            '</div>' +
        '</td>';
    tbody.appendChild(tr);

    // Handle sub-topics or single content.
    var listed = readListedSubs();
    var contentSection = document.getElementById('topicContentSection');
    var contentVisible = contentSection && !contentSection.classList.contains('hidden');

    if (listed.length > 0) {
        listed.forEach(function(s) { createSubTopicRow(newId, s); });
        updateTopicRowChips(tr);
    } else if (contentVisible) {
        var picker = contentSection.querySelector('.content-picker');
        if (!validateContentPicker(picker)) {
            showToast('Add content (file, video URL, or text) before saving');
            tr.remove();
            picker.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }
        var c = readContentPicker(picker);
        tr.dataset.mediaType = c.mediaType;
        tr.dataset.mediaName = c.mediaName;
        updateTopicRowChips(tr);
    }

    // Apply sharing from step 2.
    var companyKey = _currentScope.companyKey;
    var stepShareList = document.getElementById('stepShareDeptList');
    if (stepShareList && companyKey) {
        var currentDept = (_currentScope && _currentScope.dept) || '';
        var checkedDepts = Array.from(stepShareList.querySelectorAll('input:checked')).map(function(cb) { return cb.value; });
        var toShare = checkedDepts.filter(function(d) { return d !== currentDept; });
        if (toShare.length) {
            shareTopicWithDepartments(companyKey, name, toShare);
            persistTopicsScope();
        }
    }

    var subSummary = listed.length
        ? ' with ' + listed.length + ' sub-topic' + (listed.length !== 1 ? 's' : '')
        : '';
    snapshotCurrentScope();
    showToast('"' + name + '" added' + subSummary);

    if (_pendingCreateGame) {
        closeDetail();
        _launchCreateGame(name);
    } else {
        showEmpty();
    }
}

function addTopicAI() {
    clearSelection();
    currentEditRow = null;
    currentEditType = 'topic';
    currentViewRow = null;
    _editingSubIdx = null;
    document.getElementById('editTitle').textContent = 'Generate Topic';
    document.getElementById('editSubtitle').textContent = getScopeSubtitle();

    _aiGenerateIdx = 0;
    _aiHasGenerated = false;
    setPanelMode('add');

    document.getElementById('editFields').innerHTML = `
        <div class="add-topic-tabs" id="aiTabBar">
            <button type="button" class="add-topic-tab active" data-tab="ai-content" onclick="switchAITab('ai-content')">Content</button>
            <button type="button" class="add-topic-tab" data-tab="ai-topic" id="aiTopicTab" onclick="switchAITab('ai-topic')" disabled>Topics</button>
            <button type="button" class="add-topic-tab hidden" data-tab="ai-subs" id="aiSubsTab" onclick="switchAITab('ai-subs')" disabled>
                <i class="fas fa-list-ol"></i> Sub-topics
            </button>
        </div>
        <div class="add-topic-pane" id="aiTabPaneContent">
            <div class="form-group ai-model-group">
                <label for="aiModelSelect">AI Model</label>
                <select id="aiModelSelect" class="ai-model-select">
                    <option value="claude-sonnet-4-6" selected>Claude Sonnet 4.6 — Recommended</option>
                    <option value="claude-opus-4-7">Claude Opus 4.7 — Most capable</option>
                    <option value="claude-haiku-4-5">Claude Haiku 4.5 — Fastest</option>
                    <option value="gpt-4o">GPT-4o</option>
                    <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                </select>
            </div>
            <div class="form-group" id="aiUploadSection">
                <label>Upload</label>
                <div class="ai-upload-zone" id="aiUploadZone"
                     onclick="document.getElementById('aiFileInput').click()"
                     ondragover="event.preventDefault();this.classList.add('drag-over')"
                     ondragleave="this.classList.remove('drag-over')"
                     ondrop="onAIFileDrop(this,event)">
                    <input type="file" id="aiFileInput" hidden onchange="onAIFileChange(this)">
                    <i class="fas fa-cloud-upload-alt ai-upload-icon"></i>
                    <span class="ai-upload-prompt" id="aiUploadPrompt">Drop a file or click to upload</span>
                </div>
            </div>
            <div class="form-group" id="aiUrlSection">
                <label>URL</label>
                <input type="url" id="aiUrlInput" class="ai-text-input"
                       placeholder="https://…" oninput="updateAIGenerateBtn()">
            </div>
            <div class="form-group" id="aiTextSection">
                <label>Text</label>
                <div class="rte-toolbar">
                    <button type="button" class="rte-btn" title="Bold" onmousedown="event.preventDefault();document.execCommand('bold')"><i class="fas fa-bold"></i></button>
                    <button type="button" class="rte-btn" title="Italic" onmousedown="event.preventDefault();document.execCommand('italic')"><i class="fas fa-italic"></i></button>
                    <button type="button" class="rte-btn" title="Underline" onmousedown="event.preventDefault();document.execCommand('underline')"><i class="fas fa-underline"></i></button>
                    <span class="rte-sep"></span>
                    <button type="button" class="rte-btn" title="Bullet list" onmousedown="event.preventDefault();document.execCommand('insertUnorderedList')"><i class="fas fa-list-ul"></i></button>
                    <button type="button" class="rte-btn" title="Numbered list" onmousedown="event.preventDefault();document.execCommand('insertOrderedList')"><i class="fas fa-list-ol"></i></button>
                </div>
                <div id="aiTextInput" class="ai-rte" contenteditable="true"
                     data-placeholder="Paste text, notes, or reference material…" oninput="updateAIGenerateBtn()"></div>
            </div>
            <div class="ai-subtopics-option">
                <label class="ai-toggle-label">
                    <span class="ai-toggle-wrap">
                        <input type="checkbox" id="aiIncludeSubtopics" class="ai-toggle-input">
                        <span class="ai-toggle-track"></span>
                    </span>
                    <span class="ai-toggle-text">Create sub-topics</span>
                </label>
            </div>
        </div>
        <div class="add-topic-pane hidden" id="aiTabPaneTopic"></div>
        <div class="add-topic-pane hidden" id="aiTabPaneSubs"></div>
        <div class="ai-generate-block">
            <div class="form-group">
                <input type="text" class="ai-text-input" id="aiPromptText"
                       placeholder="What learning content would you like to create today?">
            </div>
            <button type="button" class="btn btn-ai btn-full" id="aiGenerateBtn" onclick="triggerAIGenerate()">
                <i class="fas fa-wand-magic-sparkles"></i> Generate Topic
            </button>
        </div>
    `;

    var badge = document.getElementById('editBadge');
    if (badge) {
        badge.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> Generating with AI';
        badge.classList.add('badge-ai');
    }
    var companyKey = (_currentScope && _currentScope.companyKey) || '';
    var usedNow  = _companyCreditsUsed[companyKey] || 0;
    var totalNow = getCompanyCreditsTotal(companyKey);
    var countEl = document.getElementById('aiCreditsCount');
    if (countEl) countEl.textContent = usedNow;
    var totalEl = document.getElementById('aiCreditsTotal');
    if (totalEl) totalEl.textContent = totalNow;
    var creditsEl = document.getElementById('aiCreditsDisplay');
    if (creditsEl) creditsEl.hidden = false;

    // Save stays disabled until Generate has run at least once
    var submitBtn = document.getElementById('editSubmitBtn');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Save'; }

    showEdit();
}

var _aiGenerateIdx = 0;
var _aiHasGenerated = false;
var _companyCreditsUsed = {}; // keyed by companyKey; persists across AI panel openings
(function() {
    try {
        var s = JSON.parse(localStorage.getItem('gameon.aiCredits') || '{}');
        Object.keys(s).forEach(function(k) { _companyCreditsUsed[k] = s[k]; });
    } catch(e) {}
})();

// Large pool of name+description pairs — shuffled at runtime so each Generate is unique.
var _AI_NAME_POOL = [
    { name: 'Introduction to Digital Marketing',       description: 'Explore core concepts of digital marketing strategy and tools.' },
    { name: 'Foundations of Brand Strategy',           description: 'Learn how to build and position a compelling brand identity.' },
    { name: 'Customer Engagement in the Digital Age',  description: 'Discover techniques to attract, retain and delight customers online.' },
    { name: 'Data-Driven Decision Making',             description: 'Use analytics and insights to guide smarter business decisions.' },
    { name: 'Effective Business Communication',        description: 'Master written, verbal and visual communication in the workplace.' },
    { name: 'Principles of Financial Literacy',        description: 'Understand budgeting, forecasting and financial reporting fundamentals.' },
    { name: 'Leading High-Performance Teams',          description: 'Build the skills to motivate, coach and develop top-performing teams.' },
    { name: 'Project Management Essentials',           description: 'Plan, execute and close projects on time and within budget.' },
    { name: 'Innovation and Design Thinking',          description: 'Apply human-centred design to solve complex business problems.' },
    { name: 'Cybersecurity Awareness for Everyone',    description: 'Recognise threats, protect data, and stay safe online.' },
    { name: 'Diversity, Equity and Inclusion at Work', description: 'Create an inclusive culture where every employee can thrive.' },
    { name: 'Sales Fundamentals',                      description: 'Master the end-to-end sales process from prospecting to closing.' },
    { name: 'Negotiation Skills',                      description: 'Develop strategies to reach mutually beneficial agreements.' },
    { name: 'Customer Service Excellence',             description: 'Deliver consistent, empathetic service that builds lasting loyalty.' },
    { name: 'Supply Chain Management Basics',          description: 'Understand how goods and information flow from supplier to customer.' },
    { name: 'Agile Ways of Working',                   description: 'Adopt iterative, collaborative practices to deliver value faster.' },
    { name: 'Emotional Intelligence in the Workplace', description: 'Harness self-awareness and empathy to improve working relationships.' },
    { name: 'Sustainability and ESG Fundamentals',     description: 'Explore environmental, social and governance principles for business.' },
    { name: 'Change Management',                       description: 'Guide people and organisations through transformation successfully.' },
    { name: 'Critical Thinking and Problem Solving',   description: 'Apply structured reasoning to analyse problems and make sound decisions.' },
    { name: 'Presentation and Public Speaking',        description: 'Craft and deliver compelling presentations with confidence.' },
    { name: 'Introduction to Artificial Intelligence', description: 'Understand AI concepts, applications and their impact on business.' },
    { name: 'Time Management and Productivity',        description: 'Prioritise effectively and protect your focus to achieve more.' },
    { name: 'Coaching and Mentoring Skills',           description: 'Support the growth of others through structured coaching conversations.' },
    { name: 'Risk Management Fundamentals',            description: 'Identify, assess and mitigate operational and strategic risks.' },
];

// Shuffle a copy and store as the draw queue.
var _aiNameQueue = (function() {
    var arr = _AI_NAME_POOL.slice();
    for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    return arr;
}());
var _aiNameQueueIdx = 0;

function nextAISuggestion() {
    if (_aiNameQueueIdx >= _aiNameQueue.length) {
        // Re-shuffle when pool is exhausted.
        _aiNameQueue = _AI_NAME_POOL.slice();
        for (var i = _aiNameQueue.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = _aiNameQueue[i]; _aiNameQueue[i] = _aiNameQueue[j]; _aiNameQueue[j] = tmp;
        }
        _aiNameQueueIdx = 0;
    }
    return _aiNameQueue[_aiNameQueueIdx++];
}

// Rich subtopic content sets (cycled separately for WYSIWYG previews).
var _AI_SUGGESTIONS = [
    {
        subtopics: [
            { name: 'What is Digital Marketing?', content: '<h3>What is Digital Marketing?</h3><p>Digital marketing encompasses all marketing efforts that use the internet or an electronic device. Businesses leverage digital channels such as search engines, social media, email, and websites to connect with current and prospective customers.</p><ul><li>Search Engine Optimisation (SEO)</li><li>Pay-Per-Click Advertising (PPC)</li><li>Social Media Marketing</li><li>Email Campaigns</li></ul>' },
            { name: 'Setting Up Your Digital Strategy', content: '<h3>Setting Up Your Digital Strategy</h3><p>A successful digital strategy starts with clear goals and a deep understanding of your audience. Define your target personas, map their journey, and choose the right channels to reach them at every stage.</p><ol><li>Define SMART goals</li><li>Identify your target audience</li><li>Audit existing channels</li><li>Allocate budget and resources</li></ol>' },
            { name: 'Measuring Success', content: '<h3>Measuring Success</h3><p>Data is the backbone of digital marketing. Tracking the right KPIs ensures you know what is working and what needs adjustment.</p><ul><li><strong>CTR</strong> — measures ad relevance</li><li><strong>Conversion Rate</strong> — measures landing page effectiveness</li><li><strong>CAC</strong> — measures campaign efficiency</li><li><strong>CLV</strong> — measures long-term customer value</li></ul>' },
        ]
    },
    {
        subtopics: [
            { name: 'Defining Your Brand', content: '<h3>Defining Your Brand</h3><p>Your brand is more than a logo — it is the promise you make to your customers. Start by articulating your <strong>mission</strong>, <strong>vision</strong>, and <strong>core values</strong>.</p><ul><li><strong>Mission</strong>: Why you exist</li><li><strong>Vision</strong>: Where you are going</li><li><strong>Values</strong>: How you behave along the way</li></ul>' },
            { name: 'Brand Positioning', content: '<h3>Brand Positioning</h3><p>Positioning defines how your brand occupies a distinct place in the minds of your target customers. A strong positioning statement answers three questions:</p><ol><li>Who is your target customer?</li><li>What category does your brand belong to?</li><li>What is your unique benefit?</li></ol><p>Use a positioning matrix to map yourself against competitors on the dimensions that matter most to your audience.</p>' },
            { name: 'Visual Identity', content: '<h3>Visual Identity</h3><p>Consistent visual identity builds recognition and trust over time. Your visual system includes:</p><ul><li><strong>Logo</strong> — primary mark and variations</li><li><strong>Colour palette</strong> — primary, secondary, and accent colours</li><li><strong>Typography</strong> — heading and body fonts</li><li><strong>Imagery style</strong> — photography guidelines and illustrations</li></ul><p>Document everything in a brand style guide so every touchpoint looks and feels cohesive.</p>' },
            { name: 'Brand Voice & Tone', content: '<h3>Brand Voice &amp; Tone</h3><p>Your brand voice is constant — the personality behind everything you say. Tone adapts to context (a social post vs a legal notice should sound different, but both should be unmistakably <em>you</em>).</p><p>Create a voice chart with three to five descriptors, a "we are / we are not" comparison, and before/after copy examples.</p>' },
        ]
    },
    {
        subtopics: [
            { name: 'Understanding the Modern Customer', content: '<h3>Understanding the Modern Customer</h3><p>Today\'s customers are informed, connected, and expect personalised experiences. They interact with brands across multiple touchpoints — sometimes simultaneously.</p><ul><li>73% of consumers use multiple channels during their journey</li><li>Customers who have a positive experience are 5× more likely to recommend your brand</li><li>Personalisation can reduce acquisition costs by up to 50%</li></ul>' },
            { name: 'Community Building', content: '<h3>Community Building</h3><p>A brand community turns customers into advocates. Strong communities share three traits:</p><ol><li><strong>Shared identity</strong> — members feel they belong</li><li><strong>Rituals and traditions</strong> — regular events, challenges, or content</li><li><strong>Moral responsibility</strong> — members help each other</li></ol><p>Start small: a dedicated forum, a social group, or a monthly live Q&amp;A can be the seed of something much larger.</p>' },
            { name: 'Retention Strategies', content: '<h3>Retention Strategies</h3><p>Acquiring a new customer costs five to seven times more than retaining an existing one. Focus on these high-impact retention levers:</p><ul><li><strong>Onboarding</strong> — guide new users to their first value moment quickly</li><li><strong>Loyalty programmes</strong> — reward repeat behaviour meaningfully</li><li><strong>Proactive support</strong> — reach out before problems escalate</li><li><strong>Win-back campaigns</strong> — re-engage lapsed customers with targeted offers</li></ul>' },
        ]
    },
    {
        subtopics: [
            { name: 'Data Literacy Fundamentals', content: '<h3>Data Literacy Fundamentals</h3><p>Data literacy is the ability to read, understand, create, and communicate data as information. It is a critical skill at every level of an organisation.</p><ul><li><strong>Descriptive analytics</strong> — what happened?</li><li><strong>Diagnostic analytics</strong> — why did it happen?</li><li><strong>Predictive analytics</strong> — what is likely to happen?</li><li><strong>Prescriptive analytics</strong> — what should we do?</li></ul>' },
            { name: 'Building a Data Culture', content: '<h3>Building a Data Culture</h3><p>A data culture means decisions at every level are informed by evidence, not just intuition. Key pillars:</p><ol><li>Leadership buy-in and modelling of data-driven behaviour</li><li>Access to clean, trusted data for every team</li><li>Training and upskilling so all staff can interpret reports</li><li>Clear processes for turning insight into action</li></ol>' },
            { name: 'Communicating Insights', content: '<h3>Communicating Insights</h3><p>Even the best analysis fails if the audience does not understand it. Effective data communication follows the <strong>SCR framework</strong>:</p><ul><li><strong>Situation</strong> — the context your audience cares about</li><li><strong>Complication</strong> — what has changed or what problem exists</li><li><strong>Resolution</strong> — your recommendation and the data backing it</li></ul>' },
            { name: 'Ethical Use of Data', content: '<h3>Ethical Use of Data</h3><p>With great data comes great responsibility. Ethical data practices protect your customers and your organisation.</p><ul><li><strong>Consent</strong> — only collect data users have agreed to share</li><li><strong>Minimisation</strong> — collect only what you need</li><li><strong>Transparency</strong> — be clear about how data is used</li><li><strong>Security</strong> — protect data from unauthorised access</li><li><strong>Fairness</strong> — avoid algorithmic bias in automated decisions</li></ul>' },
        ]
    },
];

function triggerAIGenerate() {
    var action;
    if (!_aiHasGenerated) {
        action = 'generate';
    } else {
        var activeTab = document.querySelector('#aiTabBar .add-topic-tab.active');
        var tab = activeTab ? activeTab.dataset.tab : 'ai-content';
        if (tab === 'ai-topic') action = 'regen-topic';
        else if (tab === 'ai-subs') action = 'regen-subs';
        else action = 'regen-all';
    }
    doAIGenerate(action);
}

function buildAISubsPaneHtml(subs) {
    var subItems = subs.map(function(s) {
        return subListItemHtml(s.name, 'PDF', '', htmlToMarkdown(s.content || ''));
    }).join('');
    return '<div class="sub-list-section" id="subsListSection">' +
        '<div class="sub-list-head">' +
            '<label>Sub-topics</label>' +
            '<span class="sub-list-count-wrap"><span id="subsListCount">' + subs.length + '</span> in this topic</span>' +
        '</div>' +
        '<div id="subsList" class="sub-list">' + subItems + '</div>' +
    '</div>' +
    '<div id="subEditor" class="sub-editor hidden"></div>' +
    '<div class="add-sub-row" id="addSubTopicBtnRow">' +
        '<button type="button" class="btn btn-outline btn-add-sub" id="addSubTopicBtn" onclick="openSubEditor(\'new\')">' +
            '<i class="fas fa-plus"></i> Add another sub-topic' +
        '</button>' +
    '</div>';
}

function doAIGenerate(action) {
    var namePair   = nextAISuggestion();
    var suggestion = _AI_SUGGESTIONS[_aiGenerateIdx % _AI_SUGGESTIONS.length];
    suggestion = Object.assign({}, suggestion, { name: namePair.name, description: namePair.description });
    _aiGenerateIdx++;

    var topicPane = document.getElementById('aiTabPaneTopic');
    var subsPane  = document.getElementById('aiTabPaneSubs');
    if (!topicPane) return;

    var coverUrl = COVER_PRESETS[(_aiGenerateIdx - 1) % COVER_PRESETS.length];
    var includeSubtopics = !!(document.getElementById('aiIncludeSubtopics') &&
                              document.getElementById('aiIncludeSubtopics').checked);

    // Preserve the "Also create a game" toggle and flow picker state before any innerHTML replacement
    var gameToggleOn = false;
    var gameFlowSelected = 'normal';
    if (action !== 'regen-subs') {
        var existingGameToggle = document.getElementById('createGameToggle');
        if (existingGameToggle) gameToggleOn = existingGameToggle.checked;
        var existingFlowBtn = document.querySelector('#gameFlowPicker .game-flow-btn.active');
        if (existingFlowBtn) gameFlowSelected = existingFlowBtn.dataset.flow;
    }

    if (action === 'regen-subs') {
        // Only rebuild the sub-topics pane; leave the topic pane untouched
        var subs = (suggestion.subtopics && suggestion.subtopics.length) ? suggestion.subtopics : [];
        if (subsPane && subs.length) {
            subsPane.innerHTML = buildAISubsPaneHtml(subs);
            var subsTab = document.getElementById('aiSubsTab');
            if (subsTab) subsTab.innerHTML = '<i class="fas fa-list-ol"></i> Sub-topics <span class="tab-badge">' + subs.length + '</span>';
        }
    } else {
        // Rebuild the topic pane (for 'generate', 'regen-all', 'regen-topic')
        topicPane.innerHTML =
            '<div class="form-group"><label>Cover Image</label>' + coverPickerHtml(coverUrl) + '</div>' +
            '<div class="form-group"><label>Topic Name</label>' +
                '<input type="text" name="name" value="' + escapeAttr(suggestion.name) + '" placeholder="Topic name">' +
            '</div>' +
            '<div class="form-group"><label>Description</label>' +
                '<input type="text" name="description" value="' + escapeAttr(suggestion.description) + '" placeholder="Topic description">' +
            '</div>' +
            createGameToggleHtml();

        // Restore game toggle and flow picker
        if (gameToggleOn) {
            var restoredToggle = document.getElementById('createGameToggle');
            if (restoredToggle) restoredToggle.checked = true;
            var restoredPicker = document.getElementById('gameFlowPicker');
            if (restoredPicker) {
                restoredPicker.classList.remove('hidden');
                restoredPicker.querySelectorAll('.game-flow-btn').forEach(function(b) {
                    b.classList.toggle('active', b.dataset.flow === gameFlowSelected);
                });
            }
        }

        if (action !== 'regen-topic') {
            // Also rebuild sub-topics pane for 'generate' and 'regen-all'
            if (includeSubtopics && suggestion.subtopics && suggestion.subtopics.length) {
                var subs = suggestion.subtopics;
                if (subsPane) { subsPane.innerHTML = buildAISubsPaneHtml(subs); subsPane.classList.add('hidden'); }
                var subsTab = document.getElementById('aiSubsTab');
                if (subsTab) {
                    subsTab.classList.remove('hidden');
                    subsTab.disabled = false;
                    subsTab.innerHTML = '<i class="fas fa-list-ol"></i> Sub-topics <span class="tab-badge">' + subs.length + '</span>';
                }
            } else {
                if (subsPane) { subsPane.innerHTML = ''; subsPane.classList.add('hidden'); }
                var subsTab = document.getElementById('aiSubsTab');
                if (subsTab) { subsTab.classList.add('hidden'); subsTab.disabled = true; }
            }
        }

        // Enable Topics tab; switch to it only on first generate
        var topicTab = document.getElementById('aiTopicTab');
        if (topicTab) topicTab.disabled = false;
        if (!_aiHasGenerated) switchAITab('ai-topic');
    }

    _aiHasGenerated = true;
    updateAIGenBtnLabel();

    var submitBtn = document.getElementById('editSubmitBtn');
    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Save'; }

    var ck = (_currentScope && _currentScope.companyKey) || '';
    _companyCreditsUsed[ck] = (_companyCreditsUsed[ck] || 0) + 1;
    try {
        var _sc = JSON.parse(localStorage.getItem('gameon.aiCredits') || '{}');
        _sc[ck] = _companyCreditsUsed[ck];
        localStorage.setItem('gameon.aiCredits', JSON.stringify(_sc));
    } catch(e) {}
    var countEl = document.getElementById('aiCreditsCount');
    if (countEl) countEl.textContent = _companyCreditsUsed[ck];
    updateScopeCreditsDisplay();
}

function updateAIGenBtnLabel() {
    var genBtn   = document.getElementById('aiGenerateBtn');
    var promptEl = document.getElementById('aiPromptText');
    if (!genBtn) return;
    if (!_aiHasGenerated) {
        genBtn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> Generate Topic';
        if (promptEl) promptEl.placeholder = 'What learning content would you like to create today?';
        return;
    }
    var activeTab = document.querySelector('#aiTabBar .add-topic-tab.active');
    var tab = activeTab ? activeTab.dataset.tab : 'ai-content';
    if (tab === 'ai-topic') {
        genBtn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> Regenerate Topic';
        if (promptEl) { promptEl.placeholder = 'What would you like to change?'; promptEl.value = ''; }
    } else if (tab === 'ai-subs') {
        genBtn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> Regenerate Sub-topics';
        if (promptEl) { promptEl.placeholder = 'What would you like to change?'; promptEl.value = ''; }
    } else {
        genBtn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> Regenerate';
        if (promptEl) promptEl.placeholder = 'What learning content would you like to create today?';
    }
}

function onAIFileChange(input) {
    var file = input.files[0];
    if (!file) return;
    var prompt = document.getElementById('aiUploadPrompt');
    if (prompt) prompt.textContent = file.name;
    var zone = document.getElementById('aiUploadZone');
    if (zone) zone.classList.add('has-file');
    updateAIGenerateBtn();
}

function onAIFileDrop(zone, event) {
    event.preventDefault();
    zone.classList.remove('drag-over');
    var file = event.dataTransfer.files[0];
    if (!file) return;
    var prompt = document.getElementById('aiUploadPrompt');
    if (prompt) prompt.textContent = file.name;
    zone.classList.add('has-file');
    updateAIGenerateBtn();
}


function switchAITab(tab) {
    document.querySelectorAll('#aiTabBar .add-topic-tab').forEach(function(t) {
        t.classList.toggle('active', t.dataset.tab === tab);
    });
    var contentPane = document.getElementById('aiTabPaneContent');
    var topicPane   = document.getElementById('aiTabPaneTopic');
    var subsPane    = document.getElementById('aiTabPaneSubs');
    if (contentPane) contentPane.classList.toggle('hidden', tab !== 'ai-content');
    if (topicPane)   topicPane.classList.toggle('hidden',   tab !== 'ai-topic');
    if (subsPane)    subsPane.classList.toggle('hidden',    tab !== 'ai-subs');
    updateAIGenBtnLabel();
}

function toggleAISub(btn) {
    var item = btn.closest('.ai-sub-item');
    var body = item.querySelector('.ai-sub-body');
    var chevron = btn.querySelector('.ai-sub-chevron');
    var isOpen = !body.classList.contains('hidden');

    // Collapse all
    document.querySelectorAll('#aiTabPaneSubs .ai-sub-item').forEach(function(el) {
        el.querySelector('.ai-sub-body').classList.add('hidden');
        el.querySelector('.ai-sub-chevron').style.transform = '';
    });

    if (!isOpen) {
        body.classList.remove('hidden');
        chevron.style.transform = 'rotate(90deg)';
    }
}

function switchAddTab(tab) {
    document.querySelectorAll('#editFields .add-topic-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
    const topicPane = document.getElementById('tabPaneTopic');
    const subsPane  = document.getElementById('tabPaneSubs');
    if (topicPane) topicPane.classList.toggle('hidden', tab !== 'topic');
    if (subsPane)  subsPane.classList.toggle('hidden',  tab !== 'subs');
}

// ===== Add flow — Share step (shown after topic is saved) =====
var _pendingCreateGame = false;  // captured at Save time from #createGameToggle
var _pendingGameFlow   = 'normal'; // 'normal' | 'ai' — captured from #gameFlowPicker
var _pendingTopicCover = '';
var _pendingTopicDesc  = '';

function createGameToggleHtml() {
    return '<div class="form-group create-game-toggle-row">' +
        '<div class="create-game-row">' +
            '<label class="ai-toggle-label create-game-toggle-label">' +
                '<span class="ai-toggle-wrap">' +
                    '<input type="checkbox" id="createGameToggle" class="ai-toggle-input" onchange="onCreateGameToggleChange(this)">' +
                    '<span class="ai-toggle-track"></span>' +
                '</span>' +
                '<span class="ai-toggle-text">Also create a game</span>' +
            '</label>' +
            '<div class="game-flow-picker hidden" id="gameFlowPicker">' +
                '<button type="button" class="game-flow-btn active" data-flow="normal" onclick="selectGameFlow(this)">Normal</button>' +
                '<button type="button" class="game-flow-btn" data-flow="ai" onclick="selectGameFlow(this)"><i class="fas fa-wand-magic-sparkles"></i> AI</button>' +
            '</div>' +
        '</div>' +
    '</div>';
}

function onCreateGameToggleChange(checkbox) {
    var picker = document.getElementById('gameFlowPicker');
    if (picker) picker.classList.toggle('hidden', !checkbox.checked);
}

function selectGameFlow(btn) {
    var picker = btn.closest('.game-flow-picker');
    if (!picker) return;
    picker.querySelectorAll('.game-flow-btn').forEach(function(b) {
        b.classList.toggle('active', b === btn);
    });
}

function _launchCreateGame(topicName) {
    try {
        localStorage.setItem('gameon.pendingGame', JSON.stringify({
            topicName: topicName || '',
            topicCover: _pendingTopicCover || '',
            topicDesc:  _pendingTopicDesc  || '',
            companyKey: (_currentScope && _currentScope.companyKey) || '',
            dept: (_currentScope && _currentScope.dept) || '',
            gameFlow: _pendingGameFlow || 'normal'
        }));
    } catch(e) {}
    window.location.href = 'index-games.html';
}

// ===== Add Sub-Topic =====
function addModule() {
    const topics = document.querySelectorAll('tr[data-topic]');
    if (topics.length === 0) {
        showToast('Create a topic first');
        return;
    }

    clearSelection();
    currentEditRow = null;
    currentEditType = 'module';
    currentViewRow = null;

    const topicOptions = [...topics].map(r => {
        const name = r.querySelector('.company-name').textContent.trim();
        return `<option value="${r.dataset.topic}">${escapeAttr(name)}</option>`;
    }).join('');

    document.getElementById('editTitle').textContent = 'Add Sub-Topic';
    document.getElementById('editSubtitle').textContent = getScopeSubtitle();

    document.getElementById('editFields').innerHTML = `
        <div class="form-group">
            <label>Parent Topic</label>
            <select name="parentTopic">${topicOptions}</select>
        </div>
        <div class="form-group">
            <label>Sub-Topic Name</label>
            <input type="text" name="name" value="" required placeholder="Sub-topic name">
        </div>
        <div class="form-group">
            <label>Content</label>
            ${contentPickerHtml('add', { kind: 'upload', mediaType: 'PDF', mediaName: '' })}
        </div>
    `;

    setPanelMode('add');
    showEdit();
}

// ===== Search / Filter =====
function filterTable(query) {
    const q = query.toLowerCase().trim();
    const topicRows = document.querySelectorAll('.row-company');

    topicRows.forEach(topicRow => {
        const topicName = topicRow.querySelector('.company-name').textContent.toLowerCase();
        const topicId = topicRow.dataset.topic;
        const moduleRows = document.querySelectorAll(`tr[data-parent="${topicId}"]`);

        const topicMatch = topicName.includes(q);
        let anyModuleMatch = false;

        moduleRows.forEach(mr => {
            const modName = mr.querySelector('.dept-name').textContent.toLowerCase();
            const modMatch = modName.includes(q);
            if (modMatch) anyModuleMatch = true;

            if (q === '') {
                mr.classList.toggle('hidden', !topicRow.classList.contains('expanded'));
            } else {
                mr.classList.toggle('hidden', !modMatch && !topicMatch);
            }
        });

        topicRow.classList.toggle('hidden', q !== '' && !topicMatch && !anyModuleMatch);
    });
}

// ===== Export =====
function exportList() {
    const rows = document.querySelectorAll('.data-table tbody tr:not(.hidden)');
    let csv = 'Type,Name,Media/Categories\n';
    rows.forEach(row => {
        if (row.classList.contains('row-company')) {
            const name = row.querySelector('.company-name').textContent.trim();
            const cats = row.dataset.categories || '';
            csv += `Topic,"${name}","${cats}"\n`;
        } else if (row.classList.contains('row-dept')) {
            const name = row.querySelector('.dept-name').textContent.trim();
            const media = row.dataset.mediaType || '';
            csv += `Module,"${name}","${media}"\n`;
        }
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'topics-export.csv';
    a.click();
    URL.revokeObjectURL(url);
    showToast('List exported');
}

// ===== Render topics for the current scope =====
function renderTopicsForScope(companyKey, dept) {
    const tbody = document.querySelector('#topicsTable tbody');
    if (!tbody) return;

    _currentScope = { companyKey: companyKey, dept: dept };

    const allTopics = collectTopicsForScope(companyKey, dept);

    // Default any topic missing the active flag to true so the filter has data to match.
    allTopics.forEach(t => { if (typeof t.active !== 'boolean') t.active = true; });

    const visible = (topicStatusFilter === 'all')
        ? allTopics
        : allTopics.filter(t => Boolean(t.active) === (topicStatusFilter === 'active'));

    tbody.innerHTML = visible.map((topic, i) => topicRowHtml(topic, i + 1)).join('');
    updateTopicsCount(visible);

    // Reset detail panel — any previously selected row no longer exists.
    showEmpty();
}

// Returns topics for a specific dept, or aggregated (deduped by name) across all
// departments of the company when no dept is provided.
function collectTopicsForScope(companyKey, dept) {
    if (typeof getTopicsForScope !== 'function') return [];
    if (dept) return getTopicsForScope(companyKey, dept);

    const companies = (typeof SIDEBAR_COMPANIES !== 'undefined') ? SIDEBAR_COMPANIES : [];
    const departments = (typeof SIDEBAR_DEPARTMENTS !== 'undefined') ? SIDEBAR_DEPARTMENTS : [];
    const company = companies.find(c => c.name.toLowerCase() === companyKey);
    if (!company) return [];

    const seen = new Set();
    const out = [];
    departments
        .filter(d => d.companyId === company.id)
        .forEach(d => {
            (getTopicsForScope(companyKey, d.name) || []).forEach(t => {
                if (seen.has(t.name)) return;
                seen.add(t.name);
                out.push(t);
            });
        });
    return out;
}

function updateTopicsCount(topics) {
    const el = document.getElementById('topicsCount');
    if (!el) return;
    const tCount = topics.length;
    el.hidden = false;
    el.innerHTML = '<i class="fas fa-layer-group"></i> ' +
        tCount + ' topic' + (tCount !== 1 ? 's' : '');
}

function toggleBulkSelect() {
    document.querySelectorAll('.row-checkbox').forEach(cb => { cb.checked = false; });
    document.querySelectorAll('tr.row-company.row-selected').forEach(r => r.classList.remove('row-selected'));
    updateSelection();
}

function onSelectCheckbox(event) {
    event.stopPropagation();
    updateSelection();
}

function toggleSelectAll(source) {
    document.querySelectorAll('tr.row-company .row-checkbox').forEach(cb => {
        cb.checked = source.checked;
    });
    updateSelection();
}

function updateSelection() {
    const allBoxes = document.querySelectorAll('tr.row-company .row-checkbox');
    const checked = Array.from(allBoxes).filter(cb => cb.checked);
    allBoxes.forEach(cb => {
        cb.closest('tr').classList.toggle('row-selected', cb.checked);
    });
    const btn = document.getElementById('bulkDisableBtn');
    if (btn) btn.hidden = checked.length === 0;
    const selectAll = document.getElementById('selectAllTopics');
    if (selectAll) {
        selectAll.checked = allBoxes.length > 0 && checked.length === allBoxes.length;
        selectAll.indeterminate = checked.length > 0 && checked.length < allBoxes.length;
    }
}

function bulkDisableSelected() {
    const checked = Array.from(document.querySelectorAll('.row-checkbox:checked'));
    if (!checked.length) return;
    const names = checked.map(cb => cb.dataset.topicName).filter(Boolean);
    if (!confirm('Disable ' + names.length + ' topic' + (names.length !== 1 ? 's' : '') + '? They will no longer be visible to users.')) return;

    names.forEach(name => {
        const topic = findTopicByName(name);
        if (topic) topic.active = false;
    });
    persistTopicsScope();
    showToast(names.length + ' topic' + (names.length !== 1 ? 's' : '') + ' disabled');
    document.querySelectorAll('.row-checkbox').forEach(cb => { cb.checked = false; });
    document.querySelectorAll('tr.row-company.row-selected').forEach(r => r.classList.remove('row-selected'));
    updateSelection();
    refreshTopics();
}

function refreshTopics() {
    renderTopicsForScope(_currentScope.companyKey, _currentScope.dept);
}

function filterByTopicStatus(status) {
    topicStatusFilter = status;
    refreshTopics();
}

function findTopicByName(name) {
    if (!name) return null;
    const topics = collectTopicsForScope(_currentScope.companyKey, _currentScope.dept);
    return topics.find(t => t.name === name) || null;
}

// ===== Per-row action menu (kebab) =====
function toggleTopicMenu(btn, evt) {
    evt.stopPropagation();
    const menu = btn.parentElement;
    const popup = menu.querySelector('.action-menu-popup');
    const wasOpen = menu.classList.contains('open');
    closeAllTopicMenus();
    if (wasOpen || !popup) return;

    // Show first (off-screen) so we can measure, then position.
    popup.style.visibility = 'hidden';
    menu.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');

    const r = btn.getBoundingClientRect();
    const pw = popup.offsetWidth;
    const ph = popup.offsetHeight;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    // Right-align under the button; flip up if there isn't room below.
    let left = r.right - pw;
    if (left < 8) left = 8;
    if (left + pw > vw - 8) left = vw - 8 - pw;
    let top = r.bottom + 4;
    if (top + ph > vh - 8) top = Math.max(8, r.top - ph - 4);
    popup.style.left = left + 'px';
    popup.style.top = top + 'px';
    popup.style.visibility = '';
}

function closeAllTopicMenus() {
    document.querySelectorAll('.action-menu.open').forEach(m => {
        m.classList.remove('open');
        const t = m.querySelector('.action-menu-trigger');
        if (t) t.setAttribute('aria-expanded', 'false');
    });
}

document.addEventListener('click', evt => {
    if (evt.target.closest && evt.target.closest('.action-menu-popup')) return;
    if (evt.target.closest && evt.target.closest('.action-menu')) return;
    closeAllTopicMenus();
});
document.addEventListener('keydown', evt => {
    if (evt.key === 'Escape') closeAllTopicMenus();
});
// Close on any scroll (the popup is fixed and would detach otherwise).
window.addEventListener('scroll', closeAllTopicMenus, true);
window.addEventListener('resize', closeAllTopicMenus);

// Clear the inline red highlight on form inputs as soon as the user types.
document.addEventListener('input', evt => {
    const t = evt.target;
    if (t && t.classList && t.classList.contains('input-error')) {
        t.classList.remove('input-error');
    }
});

function actionAddGameForTopic(btn, evt) {
    evt.stopPropagation();
    closeAllTopicMenus();
    window.location.href = 'index-games.html';
}

function actionAddSubTopic(btn, evt) {
    evt.stopPropagation();
    closeAllTopicMenus();
    const row = btn.closest('tr');
    if (!row) return;
    addModule();
    // Preselect this topic as the parent in the new sub-topic form.
    setTimeout(() => {
        const sel = document.querySelector('#editFields select[name="parentTopic"]');
        if (sel && row.dataset.topic) sel.value = row.dataset.topic;
    }, 0);
}

function actionEditTopic(btn, evt) {
    evt.stopPropagation();
    closeAllTopicMenus();
    const row = btn.closest('tr');
    if (!row) return;
    clearSelection();
    row.classList.add('selected');
    currentEditRow = row;
    currentEditType = 'topic';
    currentViewRow = null;
    openTopicEdit(row);
}

function actionShareTopic(btn, evt) {
    evt.stopPropagation();
    closeAllTopicMenus();
    const row = btn.closest('tr');
    if (!row) return;
    clearSelection();
    row.classList.add('selected');
    openShareInPanel({ kind: 'topic', name: row.dataset.name || '' });
}

// ===== Share in detail panel =====
// Reusable for topics or games — the caller supplies { kind, name }.
function openShareInPanel(target) {
    const companyKey = _currentScope.companyKey;
    const companies = (typeof SIDEBAR_COMPANIES !== 'undefined') ? SIDEBAR_COMPANIES : [];
    const departments = (typeof SIDEBAR_DEPARTMENTS !== 'undefined') ? SIDEBAR_DEPARTMENTS : [];
    const company = companies.find(c => c.name.toLowerCase() === companyKey);
    if (!company) { showToast('Select a company first'); return; }

    const allDepts = departments.filter(d => d.companyId === company.id);
    const sharedNow = new Set(
        target.kind === 'topic' ? getSharedDepartments(companyKey, target.name) : []
    );
    _currentShareTarget = Object.assign({}, target, { sharedDepts: Array.from(sharedNow) });

    const currentDept = (_currentScope && _currentScope.dept) || '';
    const items = allDepts.map(d => {
        const already = sharedNow.has(d.name);
        const precheck = already || (target.isNew && d.name === currentDept);
        const dateLabel = already
            ? formatSharedDate(getSharedDate(companyKey, target.name, d.name))
            : '';
        return `
            <label class="share-dept-item">
                <input type="checkbox" value="${escapeAttr(d.name)}"${precheck ? ' checked' : ''}>
                <span class="share-dept-name">${escapeAttr(d.name)}</span>
                ${already ? `<span class="share-dept-tag">${escapeAttr(dateLabel)}</span>` : ''}
            </label>
        `;
    }).join('') || '<div class="share-empty">This company has no departments to share with.</div>';

    const kindLabel = target.kind.charAt(0).toUpperCase() + target.kind.slice(1);
    document.getElementById('shareTitle').textContent = `Share ${kindLabel}`;
    document.getElementById('shareSubtitle').textContent = getScopeSubtitle();
    document.getElementById('shareBody').innerHTML = `
        <p class="share-panel-lead"><strong>${escapeAttr(target.name)}</strong></p>
        <div class="share-dept-list" id="shareDeptList">${items}</div>
    `;

    const list = document.getElementById('shareDeptList');
    list.addEventListener('change', syncShareConfirmButton);
    syncShareConfirmButton();
    showShare();
}

function syncShareConfirmButton() {
    const btn = document.getElementById('shareConfirmBtn');
    const list = document.getElementById('shareDeptList');
    if (!btn || !list) return;
    if (_currentShareTarget && _currentShareTarget.isNew) {
        btn.disabled = false;
        btn.textContent = 'Share';
        return;
    }
    const initial = new Set((_currentShareTarget && _currentShareTarget.sharedDepts) || []);
    const current = new Set(Array.from(list.querySelectorAll('input:checked')).map(c => c.value));
    const hasChanges = current.size !== initial.size
        || Array.from(current).some(d => !initial.has(d))
        || Array.from(initial).some(d => !current.has(d));
    btn.disabled = !hasChanges;
    btn.textContent = hasChanges ? 'Save' : 'No changes';
}

function cancelShare() {
    const target = _currentShareTarget;
    _currentShareTarget = null;
    const createGame = _pendingCreateGame;
    _pendingCreateGame = false;
    if (createGame && target) { _launchCreateGame(target.name); return; }
    showEmpty();
}

function confirmShare() {
    const target = _currentShareTarget;
    if (!target) { showEmpty(); return; }
    const companyKey = _currentScope.companyKey;
    const list = document.getElementById('shareDeptList');
    if (!list) { showEmpty(); return; }

    const initial = new Set(target.sharedDepts || []);
    const current = new Set(Array.from(list.querySelectorAll('input:checked')).map(c => c.value));
    const all     = Array.from(list.querySelectorAll('input')).map(c => c.value);
    const toShare   = all.filter(d => current.has(d) && !initial.has(d));
    const toUnshare = all.filter(d => !current.has(d) && initial.has(d));

    if (target.kind === 'topic') {
        if (toShare.length)   shareTopicWithDepartments(companyKey, target.name, toShare);
        if (toUnshare.length) unshareTopicFromDepartments(companyKey, target.name, toUnshare);
        persistTopicsScope();
        const total = toShare.length + toUnshare.length;
        const parts = [];
        if (toShare.length)   parts.push(`shared with ${toShare.length}`);
        if (toUnshare.length) parts.push(`unshared from ${toUnshare.length}`);
        if (parts.length) showToast(`"${target.name}" ${parts.join(', ')} department${total !== 1 ? 's' : ''}`);
        refreshTopics();
    } else {
        showToast(`Updated sharing for "${target.name}"`);
    }
    _currentShareTarget = null;
    const createGame = _pendingCreateGame;
    const sharedTopicName = target ? target.name : '';
    _pendingCreateGame = false;
    if (createGame && sharedTopicName) { _launchCreateGame(sharedTopicName); return; }
    showEmpty();
}

function shareTopicWithDepartments(companyKey, topicName, deptNames) {
    if (typeof TOPICS_BY_SCOPE === 'undefined' || typeof TOPICS_BY_DEPT === 'undefined') return;
    // Find a canonical copy of the topic from the current scope.
    const visible = collectTopicsForScope(companyKey, _currentScope.dept);
    const sourceTopic = visible.find(t => t.name === topicName);
    if (!sourceTopic) return;

    deptNames.forEach(dn => {
        const key = (companyKey || '') + '|' + dn;
        let bucket = TOPICS_BY_SCOPE[key];
        // First share into this dept: copy the dept default so existing topics stay.
        if (!bucket) {
            const seed = TOPICS_BY_DEPT[dn] || [];
            bucket = seed.slice();
            TOPICS_BY_SCOPE[key] = bucket;
        }
        const existing = bucket.find(t => t.name === topicName);
        if (existing) {
            if (!existing.sharedDate) existing.sharedDate = new Date().toISOString();
        } else {
            var copy = JSON.parse(JSON.stringify(sourceTopic));
            copy.sharedDate = new Date().toISOString();
            bucket.push(copy);
        }
    });
}

function unshareTopicFromDepartments(companyKey, topicName, deptNames) {
    if (typeof TOPICS_BY_SCOPE === 'undefined') return;
    deptNames.forEach(dn => {
        const key = (companyKey || '') + '|' + dn;
        const bucket = TOPICS_BY_SCOPE[key];
        if (!bucket) return;
        const idx = bucket.findIndex(t => t.name === topicName);
        if (idx >= 0) bucket.splice(idx, 1);
    });
}

function actionToggleDisabled(btn, evt) {
    evt.stopPropagation();
    closeAllTopicMenus();
    const row = btn.closest('tr');
    if (!row) return;
    const name = row.dataset.name || '';
    const topic = findTopicByName(name);
    if (!topic) return;
    if (topic.active === false) {
        topic.active = true;
        showToast(`"${name}" activated`);
    } else {
        if (!confirm(`Disable "${name}"? It will no longer be visible to users.`)) return;
        topic.active = false;
        showToast(`"${name}" disabled`);
    }
    persistTopicsScope();
    refreshTopics();
}

function actionEditSubTopic(btn, evt) {
    evt.stopPropagation();
    closeAllTopicMenus();
    const row = btn.closest('tr');
    if (!row) return;
    clearSelection();
    row.classList.add('selected');
    currentEditRow = row;
    currentEditType = 'module';
    currentViewRow = row;
    openModuleEdit(row);
}

function actionDeleteSubTopic(btn, evt) {
    evt.stopPropagation();
    closeAllTopicMenus();
    const row = btn.closest('tr');
    if (!row) return;
    const name = (row.querySelector('.dept-name') || {}).textContent || '';
    if (!confirm(`Delete "${name.trim()}"? This cannot be undone.`)) return;
    const topicId = row.getAttribute('data-parent');
    row.remove();
    if (typeof updateTopicModuleCount === 'function') updateTopicModuleCount(topicId);
    snapshotCurrentScope();
    showToast(`"${name.trim()}" deleted`);
    showEmpty();
}

function actionDeleteTopic(btn, evt) {
    evt.stopPropagation();
    closeAllTopicMenus();
    const row = btn.closest('tr');
    if (!row) return;
    const name = row.dataset.name || '';
    if (!confirm(`Delete "${name}" and all its sub-topics? This cannot be undone.`)) return;
    const topicId = row.dataset.topic;
    document.querySelectorAll(`tr[data-parent="${topicId}"]`).forEach(r => r.remove());
    row.remove();
    snapshotCurrentScope();
    showToast(`"${name}" deleted`);
    showEmpty();
}

// Returns the departments (of the current company scope) that contain a topic
// with this name. Used to derive the "shares" badge + tooltip.
function getSharedDepartments(companyKey, topicName) {
    if (!companyKey || !topicName || typeof TOPICS_BY_SCOPE === 'undefined') return [];
    const companies   = (typeof SIDEBAR_COMPANIES   !== 'undefined') ? SIDEBAR_COMPANIES   : [];
    const departments = (typeof SIDEBAR_DEPARTMENTS !== 'undefined') ? SIDEBAR_DEPARTMENTS : [];
    const company = companies.find(c => c.name.toLowerCase() === companyKey);
    if (!company) return [];
    const currentDept = (_currentScope && _currentScope.dept) || '';
    return departments
        .filter(d => d.companyId === company.id)
        .filter(d => {
            const bucket = TOPICS_BY_SCOPE[companyKey + '|' + d.name];
            return bucket && bucket.some(t => t.name === topicName && t.sharedDate);
        })
        .map(d => d.name);
}

function topicRowHtml(topic, id) {
    const subTopics = topic.subTopics || [];
    const subRows = subTopics.map((s, idx) => subTopicRowHtml(s, id, idx, subTopics.length)).join('');
    const subCount = subTopics.length;
    const cats = (topic.categories || []).join(',');
    const isActive = topic.active !== false;
    const rowClass = 'row-company' + (isActive ? '' : ' topic-disabled');
    const statusChip = isActive
        ? '<span class="chip chip-status chip-status-active">Active</span>'
        : '<span class="chip chip-status chip-status-disabled">Disabled</span>';
    const disableLabel = isActive ? 'Disable' : 'Enable';
    const disableIcon = isActive ? 'fa-ban' : 'fa-circle-check';
    const nameAttr = escapeAttr(topic.name);

    const sharedDepts = getSharedDepartments(_currentScope.companyKey, topic.name);
    const shareCount = sharedDepts.length;
    const shareChip = shareCount >= 1
        ? `<span class="chip chip-shares" onclick="event.stopPropagation();openShareInPanel({kind:'topic',name:'${escapeAttr(topic.name)}'})">
               <i class="fas fa-people-group"></i> ${shareCount} share${shareCount !== 1 ? 's' : ''}
               <span class="chip-tooltip">${sharedDepts.map(d => escapeAttr(d)).join(', ')}</span>
           </span>`
        : '';

    const topicCover = topic.cover || randomCover();
    return `
        <tr class="${rowClass}" data-topic="${id}" data-categories="${escapeAttr(cats)}" data-description="${escapeAttr(topic.description || '')}" data-cover="${escapeAttr(topicCover)}" data-active="${isActive}" data-name="${nameAttr}" onclick="toggleTopic(${id})">
            <td class="col-name">
                <div class="cell-row">
                    <span class="row-select"><input type="checkbox" class="row-checkbox" data-topic-name="${nameAttr}" onclick="onSelectCheckbox(event)"></span>
                    <span class="chevron"${subCount === 0 ? ' style="visibility:hidden"' : ''}><i class="fas fa-chevron-right"></i></span>
                    <img class="row-thumb" src="${escapeAttr(topicCover)}" alt="">
                    <span class="company-name">${escapeAttr(topic.name)}</span>
                    <span class="row-main-chip">${subCount > 0 ? `<span class="chip chip-modules"><i class="fas fa-book-open"></i> ${subCount} sub-topic${subCount !== 1 ? 's' : ''}</span>` : ''}</span>
                    <span class="cell-pills">${shareChip}</span>
                    <span class="row-status">${statusChip}</span>
                    <span class="row-actions">
                        <div class="action-menu">
                            <button class="btn-icon action-menu-trigger" onclick="toggleTopicMenu(this, event)" title="Actions" aria-haspopup="true" aria-expanded="false"><i class="fas fa-ellipsis-vertical"></i></button>
                            <div class="action-menu-popup" role="menu">
                                <button type="button" class="action-item" onclick="actionAddSubTopic(this, event)"><i class="fas fa-puzzle-piece"></i> Add sub-topic</button>
                                <button type="button" class="action-item" onclick="actionAddGameForTopic(this, event)"><i class="fas fa-trophy"></i> Add game</button>
                                <button type="button" class="action-item" onclick="actionEditTopic(this, event)"><i class="fas fa-pen"></i> Edit</button>
                                <button type="button" class="action-item" onclick="actionShareTopic(this, event)"><i class="fas fa-people-group"></i> Share</button>
                                <button type="button" class="action-item" onclick="actionToggleDisabled(this, event)"><i class="fas ${disableIcon}"></i> ${disableLabel}</button>
                                <div class="action-sep"></div>
                                <button type="button" class="action-item action-item-danger" onclick="actionDeleteTopic(this, event)"><i class="fas fa-trash"></i> Delete</button>
                            </div>
                        </div>
                    </span>
                </div>
            </td>
        </tr>
        ${subRows}
    `;
}

function subTopicRowHtml(sub, parentId, idx, total) {
    const meta = mediaMeta(sub.mediaType);
    const lastClass = idx === total - 1 ? ' last' : '';
    return `
        <tr class="row-dept hidden" data-parent="${parentId}" data-media-type="${escapeAttr(sub.mediaType)}" data-media-name="${escapeAttr(sub.mediaName || '')}" data-description="${escapeAttr(sub.description || '')}" onclick="selectRow(this)">
            <td class="col-name"><div class="cell-row"><span class="dept-indent"></span><span class="dept-connector${lastClass}"></span><span class="dept-name">${escapeAttr(sub.name)}</span><span class="row-main-chip"><span class="chip chip-media"><i class="${meta.icon}"></i> ${meta.label}</span></span><span class="cell-pills"></span><span class="row-actions">
                <div class="action-menu">
                    <button class="btn-icon action-menu-trigger" onclick="toggleTopicMenu(this, event)" title="Actions" aria-haspopup="true" aria-expanded="false"><i class="fas fa-ellipsis-vertical"></i></button>
                    <div class="action-menu-popup" role="menu">
                        <button type="button" class="action-item" onclick="actionEditSubTopic(this, event)"><i class="fas fa-pen"></i> Edit</button>
                        <div class="action-sep"></div>
                        <button type="button" class="action-item action-item-danger" onclick="actionDeleteSubTopic(this, event)"><i class="fas fa-trash"></i> Delete</button>
                    </div>
                </div>
            </span></div></td>
        </tr>
    `;
}

// ===== localStorage persistence =====
var LS_TOPICS_KEY = 'gameon.topics.scope';

function persistTopicsScope() {
    try { localStorage.setItem(LS_TOPICS_KEY, JSON.stringify(TOPICS_BY_SCOPE)); } catch(e) {}
}

function loadTopicsScope() {
    try {
        var saved = localStorage.getItem(LS_TOPICS_KEY);
        if (!saved) return;
        var parsed = JSON.parse(saved);
        Object.keys(parsed).forEach(function(k) { TOPICS_BY_SCOPE[k] = parsed[k]; });
    } catch(e) {}
}

// Reads the current DOM state for the active scope and snapshots it into
// TOPICS_BY_SCOPE, then persists to localStorage.
function snapshotCurrentScope() {
    var companyKey = _currentScope.companyKey;
    var dept = _currentScope.dept;
    if (!companyKey) return;
    var key = (companyKey || '') + '|' + (dept || '');
    var topics = [];
    document.querySelectorAll('.data-table tbody tr[data-topic]').forEach(function(topicRow) {
        var topicId = topicRow.dataset.topic;
        var nameEl = topicRow.querySelector('.company-name');
        var subTopics = [];
        document.querySelectorAll('tr[data-parent="' + topicId + '"]').forEach(function(subRow) {
            var subNameEl = subRow.querySelector('.dept-name');
            subTopics.push({
                name:         subNameEl ? subNameEl.textContent.trim() : '',
                description:  subRow.dataset.description || '',
                mediaType:    subRow.dataset.mediaType   || 'PDF',
                mediaName:    subRow.dataset.mediaName   || ''
            });
        });
        topics.push({
            name:        topicRow.dataset.name || (nameEl ? nameEl.textContent.trim() : ''),
            description: topicRow.dataset.description || '',
            cover:       topicRow.dataset.cover       || '',
            categories:  (topicRow.dataset.categories || '').split(',').filter(Boolean),
            active:      topicRow.dataset.active !== 'false',
            subTopics:   subTopics
        });
    });
    TOPICS_BY_SCOPE[key] = topics;
    persistTopicsScope();
}

// Called by script-topics-sidebar-scope.js whenever a (company, department) pair is set.
function getCompanyCreditsTotal(companyKey) {
    if (typeof SIDEBAR_COMPANIES === 'undefined' || !companyKey) return 200;
    var co = SIDEBAR_COMPANIES.find(function(c) { return c.name.toLowerCase() === companyKey; });
    return (co && co.credits) ? co.credits : 200;
}

function updateScopeCreditsDisplay() {
    var el = document.getElementById('scopeCredits');
    if (!el) return;
    var key = _currentScope && _currentScope.companyKey;
    if (!key) { el.hidden = true; return; }
    var used  = _companyCreditsUsed[key] || 0;
    var total = getCompanyCreditsTotal(key);
    el.hidden = false;
    el.innerHTML = '<i class="fas fa-coins"></i> ' + used + ' / ' + total + ' AI credits used';
}

function onScopeReady(companyKey, dept) {
    renderTopicsForScope(companyKey, dept);
    updateScopeCreditsDisplay();
}

// Bootstrap: restore any previously saved scope data before the first render.
loadTopicsScope();

// ===== Active / Disabled (driven from the edit panel) =====
function toggleCurrentTopicActive() {
    if (currentEditType !== 'topic' || !currentEditRow) return;
    const name = currentEditRow.dataset.name || currentEditRow.querySelector('.company-name').textContent.trim();
    const topic = findTopicByName(name);
    if (!topic) return;

    if (topic.active === false) {
        topic.active = true;
        showToast('"' + name + '" activated');
    } else {
        if (!confirm('Disable "' + name + '"? It will no longer be visible to users.')) return;
        topic.active = false;
        showToast('"' + name + '" disabled');
    }
    persistTopicsScope();
    refreshTopics();
}

// ===== Toast =====
function showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}
