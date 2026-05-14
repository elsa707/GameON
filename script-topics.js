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
    gradientCoverSvg('#14b8a6', '#22c55e')  // teal → green
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
                <button type="button" class="content-kind-tab ${kind === 'video' ? 'active' : ''}" data-kind="video" onclick="setContentKind(this)"><i class="fas fa-video"></i> Video URL</button>
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
                <input type="url" class="cp-video-url" value="${kind === 'video' ? escapeAttr(mediaName) : ''}" placeholder="https://youtube.com/watch?v=…">
            </div>
            <div class="content-pane${kind === 'text' ? '' : ' hidden'}" data-pane="text">
                <textarea class="cp-text" rows="4" placeholder="Type the sub-topic content…">${kind === 'text' ? escapeAttr(mediaName) : ''}</textarea>
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
        return { mediaType: 'text', mediaName: picker.querySelector('.cp-text').value.trim() };
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
    document.getElementById('topicContentSection').classList.remove('hidden');
}

function chooseAddSubTopic() {
    const nameInput = document.querySelector('#editFields input[name="name"]');
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
    picker.classList.add('hidden');
    picker.classList.remove('error');
    const subsTab = document.getElementById('addTabSubs');
    if (subsTab) subsTab.disabled = false;
    switchAddTab('subs');
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
        const t = picker.querySelector('.cp-text');      if (t) t.value = '';
        picker.querySelectorAll('.content-kind-tab').forEach(b => b.classList.toggle('active', b.dataset.kind === 'upload'));
        picker.querySelectorAll('.content-pane').forEach(p => p.classList.toggle('hidden', p.dataset.pane !== 'upload'));
        const label = picker.querySelector('.cp-detected'); if (label) label.innerHTML = '';
    }
    document.getElementById('choicePicker').classList.remove('hidden');
}

// ===== Inline sub-topic list + editor (used inside Add Topic) =====
function openSubEditor(mode, idx) {
    _editingSubIdx = mode === 'new' ? -1 : idx;
    let defaults = { name: '', mediaType: 'PDF', mediaName: '', kind: 'upload' };
    if (mode === 'edit') {
        const item = document.querySelectorAll('#subsList .sub-list-item')[idx];
        if (item) {
            defaults.name = item.dataset.name || '';
            defaults.mediaType = item.dataset.mediaType || 'PDF';
            defaults.mediaName = item.dataset.mediaName || '';
            defaults.kind = kindForMediaType(defaults.mediaType);
        }
    }
    const subsCount = document.querySelectorAll('#subsList .sub-list-item').length;
    const titleText = mode === 'edit'
        ? 'Edit sub-topic'
        : (subsCount > 0 ? `Add sub-topic ${subsCount + 1}` : 'New sub-topic');
    const editor = document.getElementById('subEditor');
    editor.innerHTML = `
        <div class="sub-editor-head">
            <span class="sub-editor-title"><i class="fas fa-puzzle-piece"></i> ${titleText}</span>
        </div>
        <div class="form-group">
            <label>Sub-topic name</label>
            <input type="text" class="sub-edit-name" value="${escapeAttr(defaults.name)}" placeholder="Sub-topic name">
        </div>
        <div class="form-group">
            <label>Content</label>
            ${contentPickerHtml('sub-editor', defaults)}
        </div>
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
        // No subs — revert to Tab 1 and re-offer the two choices.
        const subsTab = document.getElementById('addTabSubs');
        if (subsTab) subsTab.disabled = true;
        switchAddTab('topic');
        document.getElementById('choicePicker').classList.remove('hidden');
    }
}

function commitSubEditor(skipReopen) {
    const editor = document.getElementById('subEditor');
    const nameInput = editor.querySelector('.sub-edit-name');
    const name = (nameInput.value || '').trim();
    if (!name) { nameInput.focus(); return false; }
    const picker = editor.querySelector('.content-picker');
    if (!validateContentPicker(picker)) {
        showToast('Add content for this sub-topic (file, video URL, or text)');
        return false;
    }
    const c = readContentPicker(picker);
    const wasNew = _editingSubIdx === -1;

    if (wasNew) {
        appendSubItem({ name: name, mediaType: c.mediaType, mediaName: c.mediaName });
        document.getElementById('subsListSection').classList.remove('hidden');
    } else {
        const items = document.querySelectorAll('#subsList .sub-list-item');
        const item = items[_editingSubIdx];
        if (item) {
            item.dataset.name = name;
            item.dataset.mediaType = c.mediaType;
            item.dataset.mediaName = c.mediaName;
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

function appendSubItem(sub) {
    const list = document.getElementById('subsList');
    const html = `
        <div class="sub-list-item" data-name="${escapeAttr(sub.name)}" data-media-type="${escapeAttr(sub.mediaType)}" data-media-name="${escapeAttr(sub.mediaName)}">
            <span class="sub-list-name">${escapeAttr(sub.name)}</span>
            <div class="sub-list-actions">
                <button type="button" class="btn-icon" onclick="editSubItem(this)" title="Edit"><i class="fas fa-pen"></i></button>
                <button type="button" class="btn-icon" onclick="removeSubItem(this)" title="Remove"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `;
    list.insertAdjacentHTML('beforeend', html);
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
            // Revert to Tab 1 and re-offer the two choices.
            const subsTab = document.getElementById('addTabSubs');
            if (subsTab) subsTab.disabled = true;
            switchAddTab('topic');
            document.getElementById('choicePicker').classList.remove('hidden');
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

        // Require the user to have picked "Add content" or added at least one sub-topic.
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
                    <span class="chevron"><i class="fas fa-chevron-down"></i></span>
                    <img class="row-thumb" src="${escapeAttr(cover || randomCover())}" alt="">
                    <span class="company-name">${escapeAttr(name)}</span>
                    <span class="row-main-chip"><span class="chip chip-modules"><i class="fas fa-book-open"></i> 0 sub-topics</span></span>
                    <span class="cell-pills"></span>
                    <span class="row-status"><span class="chip chip-status chip-status-active">Active</span></span>
                    <span class="row-actions">
                        <div class="action-menu">
                            <button class="btn-icon action-menu-trigger" onclick="toggleTopicMenu(this, event)" title="Actions" aria-haspopup="true" aria-expanded="false"><i class="fas fa-ellipsis-vertical"></i></button>
                            <div class="action-menu-popup" role="menu">
                                <button type="button" class="action-item" onclick="actionAddSubTopic(this, event)"><i class="fas fa-puzzle-piece"></i> Add sub-topic</button>
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

        if (listed.length > 0) {
            // Topic acts as a container for sub-topics.
            listed.forEach(s => createSubTopicRow(newId, s));
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

        const subSummary = listed.length
            ? ` with ${listed.length} sub-topic${listed.length !== 1 ? 's' : ''}`
            : '';
        snapshotCurrentScope();
        showToast(`"${name}" added${subSummary}`);
        showEmpty();

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
        return;
    }
    mainChip.innerHTML = `<span class="chip chip-modules"><i class="fas fa-book-open"></i> ${modCount} sub-topic${modCount !== 1 ? 's' : ''}</span>`;
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
    const badge = document.getElementById('editBadge');
    const submitBtn = document.getElementById('editSubmitBtn');
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
// Default flow: topic name + description + content (single piece).
// "Add sub-topic" at the bottom opens an inline sub-topic editor; the first
// committed sub-topic promotes the topic's content to sub-topic 1.
function addTopic() {
    clearSelection();
    currentEditRow = null;
    currentEditType = 'topic';
    currentViewRow = null;
    _editingSubIdx = null;

    document.getElementById('editTitle').textContent = 'Add Topic';
    document.getElementById('editSubtitle').textContent = getScopeSubtitle();

    document.getElementById('editFields').innerHTML = `
        <div class="add-topic-tabs">
            <button type="button" class="add-topic-tab active" data-tab="topic" onclick="switchAddTab('topic')"><i class="fas fa-layer-group"></i> Topic</button>
            <button type="button" class="add-topic-tab" data-tab="subs" id="addTabSubs" onclick="switchAddTab('subs')" disabled>Sub-topics <span class="tab-badge hidden" id="addTabSubsBadge"></span></button>
        </div>

        <div class="add-topic-pane" id="tabPaneTopic">
            <div class="form-group">
                <label>Cover Image</label>
                ${coverPickerHtml('')}
            </div>
            <div class="form-group">
                <label>Topic Name</label>
                <input type="text" name="name" value="" required placeholder="Topic name">
            </div>
            <div class="form-group">
                <label>Description</label>
                <input type="text" name="description" value="" placeholder="Topic description">
            </div>
            <div class="form-group hidden" id="topicContentSection">
                <div class="content-section-head">
                    <label>Content</label>
                    <button type="button" class="btn-link-remove" onclick="removeTopicContent()" title="Remove content"><i class="fas fa-times"></i> Remove</button>
                </div>
                ${contentPickerHtml('topic-content', { kind: 'upload', mediaType: 'PDF', mediaName: '' })}
            </div>
            <div class="choice-picker" id="choicePicker">
                <p class="choice-prompt">What would you like to add to this topic?</p>
                <div class="choice-buttons">
                    <button type="button" class="btn btn-outline btn-choice" onclick="chooseAddContent()">
                        <i class="fas fa-upload"></i>
                        <span class="choice-label">Add content</span>
                        <span class="choice-hint">A single PDF, image, video URL, or text</span>
                    </button>
                    <button type="button" class="btn btn-outline btn-choice" onclick="chooseAddSubTopic()">
                        <i class="fas fa-list-ol"></i>
                        <span class="choice-label">Add sub-topics</span>
                        <span class="choice-hint">Break this topic into multiple pieces</span>
                    </button>
                </div>
            </div>
        </div>

        <div class="add-topic-pane hidden" id="tabPaneSubs">
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
    `;

    setPanelMode('add');
    showEdit();
}

function switchAddTab(tab) {
    document.querySelectorAll('#editFields .add-topic-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
    const topicPane = document.getElementById('tabPaneTopic');
    const subsPane  = document.getElementById('tabPaneSubs');
    if (topicPane) topicPane.classList.toggle('hidden', tab !== 'topic');
    if (subsPane)  subsPane.classList.toggle('hidden',  tab !== 'subs');

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

    const items = allDepts.map(d => {
        const already = sharedNow.has(d.name);
        const dateLabel = already
            ? formatSharedDate(getSharedDate(companyKey, target.name, d.name))
            : '';
        return `
            <label class="share-dept-item">
                <input type="checkbox" value="${escapeAttr(d.name)}"${already ? ' checked' : ''}>
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
    const initial = new Set((_currentShareTarget && _currentShareTarget.sharedDepts) || []);
    const current = new Set(Array.from(list.querySelectorAll('input:checked')).map(c => c.value));
    const hasChanges = current.size !== initial.size
        || Array.from(current).some(d => !initial.has(d))
        || Array.from(initial).some(d => !current.has(d));
    btn.disabled = !hasChanges;
    btn.textContent = hasChanges ? 'Save' : 'No changes';
}

function cancelShare() {
    _currentShareTarget = null;
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
        if (!bucket.some(t => t.name === topicName)) {
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
    if (!companyKey || !topicName) return [];
    if (typeof getTopicsForScope !== 'function') return [];
    const companies = (typeof SIDEBAR_COMPANIES !== 'undefined') ? SIDEBAR_COMPANIES : [];
    const departments = (typeof SIDEBAR_DEPARTMENTS !== 'undefined') ? SIDEBAR_DEPARTMENTS : [];
    const company = companies.find(c => c.name.toLowerCase() === companyKey);
    if (!company) return [];
    return departments
        .filter(d => d.companyId === company.id)
        .filter(d => (getTopicsForScope(companyKey, d.name) || []).some(t => t.name === topicName))
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
    const shareChip = shareCount > 1
        ? `<span class="chip chip-shares" onclick="event.stopPropagation();openShareInPanel({kind:'topic',name:'${escapeAttr(topic.name)}'})">
               <i class="fas fa-people-group"></i> ${shareCount} shares
               <span class="chip-tooltip">${sharedDepts.map(d => escapeAttr(d)).join(', ')}</span>
           </span>`
        : '';

    const topicCover = topic.cover || randomCover();
    return `
        <tr class="${rowClass}" data-topic="${id}" data-categories="${escapeAttr(cats)}" data-description="${escapeAttr(topic.description || '')}" data-cover="${escapeAttr(topicCover)}" data-active="${isActive}" data-name="${nameAttr}" onclick="toggleTopic(${id})">
            <td class="col-name">
                <div class="cell-row">
                    <span class="row-select"><input type="checkbox" class="row-checkbox" data-topic-name="${nameAttr}" onclick="onSelectCheckbox(event)"></span>
                    <span class="chevron"><i class="fas fa-chevron-right"></i></span>
                    <img class="row-thumb" src="${escapeAttr(topicCover)}" alt="">
                    <span class="company-name">${escapeAttr(topic.name)}</span>
                    <span class="row-main-chip"><span class="chip chip-modules"><i class="fas fa-book-open"></i> ${subCount} sub-topic${subCount !== 1 ? 's' : ''}</span></span>
                    <span class="cell-pills">${shareChip}</span>
                    <span class="row-status">${statusChip}</span>
                    <span class="row-actions">
                        <div class="action-menu">
                            <button class="btn-icon action-menu-trigger" onclick="toggleTopicMenu(this, event)" title="Actions" aria-haspopup="true" aria-expanded="false"><i class="fas fa-ellipsis-vertical"></i></button>
                            <div class="action-menu-popup" role="menu">
                                <button type="button" class="action-item" onclick="actionAddSubTopic(this, event)"><i class="fas fa-puzzle-piece"></i> Add sub-topic</button>
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
function onScopeReady(companyKey, dept) {
    renderTopicsForScope(companyKey, dept);
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
