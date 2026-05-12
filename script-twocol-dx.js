// ===== Sidebar =====
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('collapsed');
}
function toggleNavGroup(evt) {
    evt.preventDefault();
    evt.currentTarget.closest('.nav-group').classList.toggle('open');
}

// ============================================================
//  DATA
// ============================================================
var companies = [
    { id: 7, name: 'Naspers',        country: 'South Africa', departments: 6,  users: 248, games: 14, badges: 10, description: 'Global consumer internet group, JSE: NPN' },
    { id: 6, name: 'Standard Bank',  country: 'South Africa', departments: 5,  users: 155, games: 12, badges: 8,  description: "Africa's largest bank by assets, JSE: SBK" },
    { id: 5, name: 'Anglo American', country: 'South Africa', departments: 6,  users: 315, games: 19, badges: 12, description: 'Diversified mining and resources, JSE: AGL' },
    { id: 4, name: 'Sasol',          country: 'South Africa', departments: 5,  users: 120, games: 9,  badges: 6,  description: 'Integrated energy and chemicals, JSE: SOL' },
    { id: 3, name: 'MTN Group',      country: 'South Africa', departments: 15, users: 560, games: 40, badges: 27, description: 'Pan-African mobile network operator, JSE: MTN' },
    { id: 2, name: 'Discovery',      country: 'South Africa', departments: 4,  users: 162, games: 9,  badges: 5,  description: 'Financial services and insurance, JSE: DSY' },
    { id: 1, name: 'Shoprite',       country: 'South Africa', departments: 10, users: 350, games: 30, badges: 18, description: 'Largest food retailer in Africa, JSE: SHP' },
];

var departments = [
    { id: 101, companyId: 7, companyName: 'Naspers', name: 'Manufacturing',   users: 75, games: 3, badges: 2, description: '' },
    { id: 102, companyId: 7, companyName: 'Naspers', name: 'R&D',             users: 50, games: 3, badges: 2, description: '' },
    { id: 103, companyId: 7, companyName: 'Naspers', name: 'Sales',           users: 40, games: 3, badges: 2, description: '' },
    { id: 104, companyId: 7, companyName: 'Naspers', name: 'Finance',         users: 28, games: 2, badges: 1, description: '' },
    { id: 105, companyId: 7, companyName: 'Naspers', name: 'Human Resources', users: 20, games: 1, badges: 1, description: '' },
    { id: 106, companyId: 7, companyName: 'Naspers', name: 'IT & Digital',    users: 35, games: 2, badges: 2, description: '' },
    { id: 201, companyId: 6, companyName: 'Standard Bank', name: 'Sales',           users: 55, games: 4, badges: 3, description: '' },
    { id: 202, companyId: 6, companyName: 'Standard Bank', name: 'Aftersales',      users: 40, games: 3, badges: 2, description: '' },
    { id: 203, companyId: 6, companyName: 'Standard Bank', name: 'Finance',         users: 22, games: 2, badges: 1, description: '' },
    { id: 204, companyId: 6, companyName: 'Standard Bank', name: 'Marketing',       users: 20, games: 2, badges: 1, description: '' },
    { id: 205, companyId: 6, companyName: 'Standard Bank', name: 'Human Resources', users: 18, games: 1, badges: 1, description: '' },
    { id: 301, companyId: 5, companyName: 'Anglo American', name: 'R&D',           users: 70, games: 4, badges: 3, description: '' },
    { id: 302, companyId: 5, companyName: 'Anglo American', name: 'Manufacturing', users: 85, games: 4, badges: 3, description: '' },
    { id: 303, companyId: 5, companyName: 'Anglo American', name: 'Sales',         users: 45, games: 3, badges: 2, description: '' },
    { id: 304, companyId: 5, companyName: 'Anglo American', name: 'Marketing',     users: 30, games: 2, badges: 1, description: '' },
    { id: 305, companyId: 5, companyName: 'Anglo American', name: 'Engineering',   users: 60, games: 4, badges: 2, description: '' },
    { id: 306, companyId: 5, companyName: 'Anglo American', name: 'Finance',       users: 25, games: 2, badges: 1, description: '' },
    { id: 401, companyId: 4, companyName: 'Sasol', name: 'Operations',      users: 40, games: 3, badges: 2, description: '' },
    { id: 402, companyId: 4, companyName: 'Sasol', name: 'Marketing',       users: 25, games: 2, badges: 1, description: '' },
    { id: 403, companyId: 4, companyName: 'Sasol', name: 'Finance',         users: 18, games: 1, badges: 1, description: '' },
    { id: 404, companyId: 4, companyName: 'Sasol', name: 'Human Resources', users: 15, games: 1, badges: 1, description: '' },
    { id: 405, companyId: 4, companyName: 'Sasol', name: 'IT',              users: 22, games: 2, badges: 1, description: '' },
    { id: 501, companyId: 3, companyName: 'MTN Group', name: 'Supply Chain',      users: 45, games: 3, badges: 2, description: '' },
    { id: 502, companyId: 3, companyName: 'MTN Group', name: 'Brand & Marketing', users: 40, games: 3, badges: 2, description: '' },
    { id: 503, companyId: 3, companyName: 'MTN Group', name: 'Sustainability',    users: 35, games: 2, badges: 2, description: '' },
    { id: 504, companyId: 3, companyName: 'MTN Group', name: 'Engineering',       users: 65, games: 4, badges: 3, description: '' },
    { id: 505, companyId: 3, companyName: 'MTN Group', name: 'Finance',           users: 28, games: 2, badges: 1, description: '' },
    { id: 506, companyId: 3, companyName: 'MTN Group', name: 'Human Resources',   users: 22, games: 2, badges: 1, description: '' },
    { id: 507, companyId: 3, companyName: 'MTN Group', name: 'Sales',             users: 38, games: 3, badges: 2, description: '' },
    { id: 508, companyId: 3, companyName: 'MTN Group', name: 'Manufacturing',     users: 55, games: 3, badges: 2, description: '' },
    { id: 509, companyId: 3, companyName: 'MTN Group', name: 'R&D',               users: 48, games: 4, badges: 3, description: '' },
    { id: 510, companyId: 3, companyName: 'MTN Group', name: 'Logistics',         users: 30, games: 2, badges: 1, description: '' },
    { id: 511, companyId: 3, companyName: 'MTN Group', name: 'IT & Digital',      users: 42, games: 3, badges: 2, description: '' },
    { id: 512, companyId: 3, companyName: 'MTN Group', name: 'Legal',             users: 15, games: 1, badges: 1, description: '' },
    { id: 513, companyId: 3, companyName: 'MTN Group', name: 'Customer Service',  users: 52, games: 4, badges: 3, description: '' },
    { id: 514, companyId: 3, companyName: 'MTN Group', name: 'Quality Assurance', users: 20, games: 2, badges: 1, description: '' },
    { id: 515, companyId: 3, companyName: 'MTN Group', name: 'Procurement',       users: 25, games: 2, badges: 1, description: '' },
    { id: 601, companyId: 2, companyName: 'Discovery', name: 'R&D',           users: 60, games: 3, badges: 2, description: '' },
    { id: 602, companyId: 2, companyName: 'Discovery', name: 'Manufacturing', users: 50, games: 2, badges: 1, description: '' },
    { id: 603, companyId: 2, companyName: 'Discovery', name: 'Finance',       users: 32, games: 2, badges: 1, description: '' },
    { id: 604, companyId: 2, companyName: 'Discovery', name: 'Logistics',     users: 20, games: 2, badges: 1, description: '' },
    { id: 701, companyId: 1, companyName: 'Shoprite', name: 'Marketing',        users: 40, games: 3, badges: 2, description: '' },
    { id: 702, companyId: 1, companyName: 'Shoprite', name: 'Engineering',      users: 80, games: 5, badges: 4, description: '' },
    { id: 703, companyId: 1, companyName: 'Shoprite', name: 'Sales',            users: 30, games: 4, badges: 1, description: '' },
    { id: 704, companyId: 1, companyName: 'Shoprite', name: 'Human Resources',  users: 25, games: 2, badges: 1, description: '' },
    { id: 705, companyId: 1, companyName: 'Shoprite', name: 'Operations',       users: 25, games: 3, badges: 0, description: '' },
    { id: 706, companyId: 1, companyName: 'Shoprite', name: 'Finance',          users: 35, games: 2, badges: 2, description: '' },
    { id: 707, companyId: 1, companyName: 'Shoprite', name: 'Customer Support', users: 50, games: 4, badges: 3, description: '' },
    { id: 708, companyId: 1, companyName: 'Shoprite', name: 'Product',          users: 30, games: 3, badges: 2, description: '' },
    { id: 709, companyId: 1, companyName: 'Shoprite', name: 'Legal',            users: 15, games: 1, badges: 1, description: '' },
    { id: 710, companyId: 1, companyName: 'Shoprite', name: 'Data Analytics',   users: 20, games: 3, badges: 2, description: '' },
];

var COUNTRIES = [
    'South Africa', 'France', 'Germany', 'United Kingdom',
    'United States', 'Japan', 'India', 'Switzerland', 'Netherlands', 'Brazil',
];

// ============================================================
//  STATE
// ============================================================
var selectedDept = null;      // currently selected department object
var editEntity = null;        // 'company' | 'dept' | 'add-company' | 'add-dept'
var editTarget = null;        // the company/dept object being edited

// Widget instances
var deleteConfirmWidget, toastWidget;

// ============================================================
//  HELPERS
// ============================================================
function chipMarkup(cls, icon, value, title) {
    return '<span class="chip ' + cls + '" title="' + title + '">' +
           '<i class="fas ' + icon + '"></i> ' + value + '</span>';
}

function renderLogoPreview(container, dataUrl) {
    container.empty();
    if (dataUrl) {
        container.append($('<img>').attr('src', dataUrl).addClass('logo-img'));
    } else {
        container.append($('<div>').addClass('logo-placeholder').html('<i class="fas fa-image"></i>'));
    }
}

function logoFormItem(formData) {
    return {
        itemType: 'simple',
        label: { text: 'Logo' },
        template: function(data, itemElement) {
            var wrap = $('<div>').addClass('logo-field');
            var preview = $('<div>').addClass('logo-preview');
            renderLogoPreview(preview, formData.logo);
            wrap.append(preview);

            var controls = $('<div>').addClass('logo-controls');
            var uploader = $('<div>');
            var removeBtn = $('<div>');
            controls.append(uploader).append(removeBtn);
            wrap.append(controls);

            var removeInstance = removeBtn.dxButton({
                icon: 'trash', stylingMode: 'text', type: 'danger', text: 'Remove',
                visible: !!formData.logo,
                onClick: function() {
                    formData.logo = null;
                    renderLogoPreview(preview, null);
                    removeInstance.option('visible', false);
                }
            }).dxButton('instance');

            uploader.dxFileUploader({
                selectButtonText: 'Select Logo',
                labelText: '',
                accept: 'image/*',
                uploadMode: 'useForm',
                showFileList: false,
                allowedFileExtensions: ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'],
                onValueChanged: function(e) {
                    var files = e.value || [];
                    if (!files.length) return;
                    var reader = new FileReader();
                    reader.onload = function() {
                        formData.logo = reader.result;
                        renderLogoPreview(preview, formData.logo);
                        removeInstance.option('visible', true);
                    };
                    reader.readAsDataURL(files[0]);
                }
            });

            itemElement.append(wrap);
        }
    };
}

function nextId(arr) {
    return Math.max.apply(null, arr.map(function(x) { return x.id; })) + 1;
}

function findCompany(id) {
    return companies.find(function(c) { return c.id === id; });
}

function findDept(id) {
    return departments.find(function(d) { return d.id === id; });
}

function escapeAttr(s) {
    return String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/"/g, '&quot;')
        .replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function deptCountFor(companyId) {
    return departments.filter(function(d) { return d.companyId === companyId; }).length;
}

// ============================================================
//  ACCORDION TABLE — render + interactions
// ============================================================
function renderCompaniesTable() {
    var tbody = document.querySelector('#companiesTable tbody');
    if (!tbody) return;

    var html = '';
    companies.forEach(function(c) {
        html += companyRowHtml(c);
        var depts = departments.filter(function(d) { return d.companyId === c.id; });
        depts.forEach(function(d, i) {
            html += deptRowHtml(d, c.id, i === depts.length - 1);
        });
    });
    tbody.innerHTML = html;
}

function companyRowHtml(c) {
    var deptCount = deptCountFor(c.id);
    var logoHtml = c.logo ? '<span class="cc-logo"><img src="' + escapeAttr(c.logo) + '" alt=""></span>' : '';
    return '' +
        '<tr class="row-company" data-company="' + c.id + '" onclick="toggleCompany(' + c.id + ')">' +
            '<td class="col-name">' +
                '<div class="cell-row">' +
                    '<span class="chevron"><i class="fas fa-chevron-right"></i></span>' +
                    logoHtml +
                    '<span class="company-name" onclick="selectCompanyAsScope(' + c.id + ', event)" title="Set as active workspace">' + escapeAttr(c.name) + '</span>' +
                    '<span class="cell-pills">' +
                        '<span class="chip chip-dept" title="' + deptCount + ' departments"><i class="fas fa-sitemap"></i> ' + deptCount + '</span>' +
                        '<span class="chip chip-users" title="' + c.users + ' users"><i class="fas fa-users"></i> ' + c.users + '</span>' +
                        '<span class="chip chip-games" title="' + c.games + ' games"><i class="fas fa-trophy"></i> ' + c.games + '</span>' +
                    '</span>' +
                    '<span class="row-actions"><button class="btn-icon" onclick="editCompanyRow(this, event)" title="Edit"><i class="fas fa-pen"></i></button></span>' +
                '</div>' +
            '</td>' +
        '</tr>';
}

function deptRowHtml(d, parentId, isLast) {
    var lastClass = isLast ? ' last' : '';
    return '' +
        '<tr class="row-dept hidden" data-parent="' + parentId + '" data-dept="' + d.id + '" onclick="selectDeptRow(this)">' +
            '<td class="col-name">' +
                '<div class="cell-row">' +
                    '<span class="dept-indent"></span>' +
                    '<span class="dept-connector' + lastClass + '"></span>' +
                    '<span class="dept-name">' + escapeAttr(d.name) + '</span>' +
                    '<span class="cell-pills">' +
                        '<span class="chip chip-users"  title="' + d.users  + ' users"><i class="fas fa-users"></i> '  + d.users  + '</span>' +
                        '<span class="chip chip-games"  title="' + d.games  + ' games"><i class="fas fa-trophy"></i> ' + d.games  + '</span>' +
                        '<span class="chip chip-badges" title="' + d.badges + ' badges"><i class="fas fa-medal"></i> ' + d.badges + '</span>' +
                    '</span>' +
                    '<span class="row-actions"><button class="btn-icon" onclick="editDeptRowBtn(this, event)" title="Edit"><i class="fas fa-pen"></i></button></span>' +
                '</div>' +
            '</td>' +
        '</tr>';
}

function selectCompanyAsScope(companyId, evt) {
    if (evt) evt.stopPropagation();
    if (window.GameOnScope && typeof window.GameOnScope.selectCompany === 'function') {
        window.GameOnScope.selectCompany(companyId);
    }
}

function toggleCompany(companyId) {
    var row  = document.querySelector('tr[data-company="' + companyId + '"]');
    var kids = document.querySelectorAll('tr[data-parent="' + companyId + '"]');
    if (!row) return;
    var expanded = row.classList.toggle('expanded');
    var icon = row.querySelector('.chevron i');
    if (icon) icon.className = expanded ? 'fas fa-chevron-down' : 'fas fa-chevron-right';
    kids.forEach(function(k) { k.classList.toggle('hidden', !expanded); });
}

function clearRowSelection() {
    document.querySelectorAll('.row-dept.selected, .row-company.selected')
        .forEach(function(r) { r.classList.remove('selected'); });
}

function selectDeptRow(rowEl) {
    if (window.event) window.event.stopPropagation();
    var deptId = parseInt(rowEl.getAttribute('data-dept'), 10);
    var dept   = findDept(deptId);
    if (!dept) return;
    clearRowSelection();
    rowEl.classList.add('selected');
    selectDept(dept);
}

function editDeptRowBtn(btn, evt) {
    evt.stopPropagation();
    var rowEl  = btn.closest('tr');
    var deptId = parseInt(rowEl.getAttribute('data-dept'), 10);
    var dept   = findDept(deptId);
    if (!dept) return;
    clearRowSelection();
    rowEl.classList.add('selected');
    selectDept(dept);
}

function editCompanyRow(btn, evt) {
    evt.stopPropagation();
    var rowEl     = btn.closest('tr');
    var companyId = parseInt(rowEl.getAttribute('data-company'), 10);
    var company   = findCompany(companyId);
    if (!company) return;
    clearRowSelection();
    rowEl.classList.add('selected');
    editCompanyCard(company);
}

// Select Department — opens edit directly
function selectDept(dept) {
    selectedDept = dept;
    switchToEdit();
}

// ============================================================
//  SIDE PANEL — edit mode (matches original detail panel)
// ============================================================
function showEdit() {
    var panel = document.getElementById('detailPanel');
    panel.classList.add('open');
    document.getElementById('detailEmpty').style.display = 'none';
    document.getElementById('detailEdit').classList.remove('hidden');
    updateDeleteButton();
}

function updateDeleteButton() {
    var btn = $('#editDeleteBtn').dxButton('instance');
    if (btn) {
        btn.option('visible', editEntity === 'dept' && selectedDept !== null);
    }
}

function closeDetail() {
    var panel = document.getElementById('detailPanel');
    panel.classList.remove('open');
    document.getElementById('detailEmpty').style.display = '';
    document.getElementById('detailEdit').classList.add('hidden');
    selectedDept = null;
    clearRowSelection();
}

function cancelEdit() {
    closeDetail();
}

// ============================================================
//  SWITCH TO EDIT — department (matches original switchToEdit)
// ============================================================
function switchToEdit() {
    if (!selectedDept) return;
    editEntity = 'dept';
    editTarget = selectedDept;

    var company = findCompany(selectedDept.companyId);
    var companyName = company ? company.name : '';

    $('#editTitle').text('Edit Department');
    $('#editSubtitle').text(companyName);
    $('#editBadge').html('<i class="fas fa-pen"></i> Editing');

    // dxForm for department editing
    $('#editFormContainer').dxForm({
        formData: { name: selectedDept.name, description: selectedDept.description || '' },
        labelLocation: 'top',
        colCount: 1,
        items: [
            { dataField: 'name', label: { text: 'Department Name' },
              editorOptions: { placeholder: 'Department name' },
              validationRules: [{ type: 'required', message: 'Name is required' }] },
            { dataField: 'description', label: { text: 'Description' },
              editorType: 'dxTextArea',
              editorOptions: { height: 80, placeholder: 'Department description...' } }
        ]
    });

    // Action buttons via dxButton
    $('#editDeleteBtn').dxButton({
        icon: 'trash',
        stylingMode: 'text',
        type: 'danger',
        visible: true,
        hint: 'Delete',
        onClick: deleteCurrent
    });
    $('#editCancelBtn').dxButton({
        text: 'Cancel',
        stylingMode: 'outlined',
        onClick: cancelEdit
    });
    $('#editSaveBtn').dxButton({
        text: 'Save Changes',
        type: 'default',
        onClick: saveEdit
    });

    showEdit();
}

// ============================================================
//  EDIT COMPANY CARD — pen button (matches original editCompanyCard)
// ============================================================
function editCompanyCard(company) {
    editEntity = 'company';
    editTarget = company;
    selectedDept = null;

    $('#editTitle').text('Edit Company');
    $('#editSubtitle').text('');
    $('#editBadge').html('<i class="fas fa-pen"></i> Editing');

    // dxForm with dxSelectBox for country
    var formData = { name: company.name, country: company.country, description: company.description || '', logo: company.logo || null };
    $('#editFormContainer').dxForm({
        formData: formData,
        labelLocation: 'top',
        colCount: 1,
        items: [
            logoFormItem(formData),
            { dataField: 'name', label: { text: 'Company Name' },
              validationRules: [{ type: 'required', message: 'Name is required' }] },
            { dataField: 'country', label: { text: 'Country' },
              editorType: 'dxSelectBox',
              editorOptions: { items: COUNTRIES, searchEnabled: true, placeholder: 'Select country...' } },
            { dataField: 'description', label: { text: 'Description' },
              editorType: 'dxTextArea',
              editorOptions: { height: 80, placeholder: 'Company description...' } }
        ]
    });

    $('#editDeleteBtn').dxButton({ visible: false });
    $('#editCancelBtn').dxButton({ text: 'Cancel', stylingMode: 'outlined', onClick: cancelEdit });
    $('#editSaveBtn').dxButton({ text: 'Save Changes', type: 'default', onClick: saveEdit });

    showEdit();
}

// ============================================================
//  ADD COMPANY (matches original addCompany)
// ============================================================
function addCompany() {
    editEntity = 'add-company';
    editTarget = null;
    selectedDept = null;
    clearRowSelection();

    $('#editTitle').text('Add Company');
    $('#editSubtitle').text('');
    $('#editBadge').html('<i class="fas fa-plus"></i> Adding');

    var formData = { name: '', country: 'South Africa', description: '', logo: null };
    $('#editFormContainer').dxForm({
        formData: formData,
        labelLocation: 'top',
        colCount: 1,
        items: [
            logoFormItem(formData),
            { dataField: 'name', label: { text: 'Company Name' },
              editorOptions: { placeholder: 'Company name' },
              validationRules: [{ type: 'required', message: 'Name is required' }] },
            { dataField: 'country', label: { text: 'Country' },
              editorType: 'dxSelectBox',
              editorOptions: { items: COUNTRIES, searchEnabled: true } },
            { dataField: 'description', label: { text: 'Description' },
              editorType: 'dxTextArea',
              editorOptions: { height: 80, placeholder: 'Company description...' } }
        ]
    });

    $('#editDeleteBtn').dxButton({ visible: false });
    $('#editCancelBtn').dxButton({ text: 'Cancel', stylingMode: 'outlined', onClick: cancelEdit });
    $('#editSaveBtn').dxButton({ text: 'Add', type: 'default', onClick: saveEdit });

    showEdit();
}

// ============================================================
//  ADD DEPARTMENT (matches original addDepartment)
// ============================================================
function addDepartment() {
    if (companies.length === 0) {
        showToast('Create a company first');
        return;
    }

    editEntity = 'add-dept';
    editTarget = null;
    selectedDept = null;
    clearRowSelection();

    var companyItems = companies.map(function(c) { return { id: c.id, name: c.name }; });
    var defaultParent = companies[0].id;
    var expandedRow = document.querySelector('tr.row-company.expanded');
    if (expandedRow) defaultParent = parseInt(expandedRow.getAttribute('data-company'), 10);

    $('#editTitle').text('Add Department');
    $('#editSubtitle').text('');
    $('#editBadge').html('<i class="fas fa-plus"></i> Adding');

    $('#editFormContainer').dxForm({
        formData: { parentCompany: defaultParent, name: '', description: '' },
        labelLocation: 'top',
        colCount: 1,
        items: [
            { dataField: 'parentCompany', label: { text: 'Parent Company' },
              editorType: 'dxSelectBox',
              editorOptions: {
                  dataSource: companyItems,
                  displayExpr: 'name',
                  valueExpr: 'id',
                  searchEnabled: true
              },
              validationRules: [{ type: 'required' }] },
            { dataField: 'name', label: { text: 'Department Name' },
              editorOptions: { placeholder: 'Department name' },
              validationRules: [{ type: 'required', message: 'Name is required' }] },
            { dataField: 'description', label: { text: 'Description' },
              editorType: 'dxTextArea',
              editorOptions: { height: 80, placeholder: 'Department description...' } }
        ]
    });

    $('#editDeleteBtn').dxButton({ visible: false });
    $('#editCancelBtn').dxButton({ text: 'Cancel', stylingMode: 'outlined', onClick: cancelEdit });
    $('#editSaveBtn').dxButton({ text: 'Add', type: 'default', onClick: saveEdit });

    showEdit();
}

// ============================================================
//  SAVE EDIT — unified handler (matches original saveEdit)
// ============================================================
function saveEdit() {
    var form = $('#editFormContainer').dxForm('instance');
    var result = form.validate();
    if (!result.isValid) return;

    var d = form.option('formData');

    if (editEntity === 'dept' && editTarget) {
        editTarget.name = d.name;
        editTarget.description = d.description;
        renderCompaniesTable();
        expandCompany(editTarget.companyId);
        showToast('"' + d.name + '" updated');
        selectDept(editTarget);

    } else if (editEntity === 'company' && editTarget) {
        editTarget.name = d.name;
        editTarget.country = d.country;
        editTarget.description = d.description;
        editTarget.logo = d.logo || null;
        departments.forEach(function(dept) {
            if (dept.companyId === editTarget.id) dept.companyName = d.name;
        });
        renderCompaniesTable();
        showToast('"' + d.name + '" updated');
        closeDetail();

    } else if (editEntity === 'add-company') {
        var newCompany = {
            id: nextId(companies),
            name: d.name,
            country: d.country,
            departments: 0, users: 0, games: 0, badges: 0,
            description: d.description,
            logo: d.logo || null
        };
        companies.push(newCompany);
        renderCompaniesTable();
        showToast('"' + d.name + '" added');
        closeDetail();

    } else if (editEntity === 'add-dept') {
        var parentId = d.parentCompany;
        var parent = findCompany(parentId);
        var newDept = {
            id: nextId(departments),
            companyId: parentId,
            companyName: parent ? parent.name : '',
            name: d.name,
            users: 0, games: 0, badges: 0,
            description: d.description
        };
        departments.push(newDept);
        if (parent) parent.departments = deptCountFor(parentId);
        renderCompaniesTable();
        expandCompany(parentId);
        showToast('"' + d.name + '" added');
        closeDetail();
    }
}

function expandCompany(companyId) {
    var row = document.querySelector('tr[data-company="' + companyId + '"]');
    if (!row || row.classList.contains('expanded')) return;
    toggleCompany(companyId);
}

// ============================================================
//  DELETE — department only (matches original deleteCurrent)
// ============================================================
function deleteCurrent() {
    if (editEntity !== 'dept' || !editTarget) return;
    var dept = editTarget;

    // Show dxPopup confirmation (replaces window.confirm)
    deleteConfirmWidget.show();
    $('#deleteMessage').html(
        '<p style="margin:0 0 8px;font-size:14px;">Are you sure you want to delete <strong>' +
        dept.name + '</strong>?</p>' +
        '<p style="margin:0;color:#64748b;font-size:13px;">This action cannot be undone.</p>'
    );
    $('#deleteCancelBtn').dxButton({
        text: 'Cancel', stylingMode: 'outlined',
        onClick: function() { deleteConfirmWidget.hide(); }
    });
    $('#deleteOkBtn').dxButton({
        text: 'Delete', type: 'danger',
        onClick: function() {
            var idx = departments.indexOf(dept);
            if (idx > -1) departments.splice(idx, 1);
            var parent = findCompany(dept.companyId);
            if (parent) parent.departments = deptCountFor(parent.id);

            selectedDept = null;
            editEntity = null;
            editTarget = null;
            closeDetail();

            renderCompaniesTable();
            if (parent) expandCompany(parent.id);
            deleteConfirmWidget.hide();
            showToast('"' + dept.name + '" deleted');
        }
    });
}

// ============================================================
//  SEARCH — accordion filter (matches topics page filterTable)
// ============================================================
function filterTable(query) {
    var q = (query || '').toLowerCase().trim();
    var companyRows = document.querySelectorAll('.row-company');

    companyRows.forEach(function(companyRow) {
        var companyName = companyRow.querySelector('.company-name').textContent.toLowerCase();
        var companyId   = companyRow.getAttribute('data-company');
        var deptRows    = document.querySelectorAll('tr[data-parent="' + companyId + '"]');

        var companyMatch = companyName.indexOf(q) !== -1;
        var anyDeptMatch = false;

        deptRows.forEach(function(dr) {
            var deptName = dr.querySelector('.dept-name').textContent.toLowerCase();
            var deptMatch = deptName.indexOf(q) !== -1;
            if (deptMatch) anyDeptMatch = true;

            if (q === '') {
                dr.classList.toggle('hidden', !companyRow.classList.contains('expanded'));
            } else {
                dr.classList.toggle('hidden', !deptMatch && !companyMatch);
            }
        });

        companyRow.classList.toggle('hidden', q !== '' && !companyMatch && !anyDeptMatch);
    });
}

// ============================================================
//  EXPORT (matches original exportList)
// ============================================================
function exportList() {
    var csv = 'Company,Department\n';
    companies.forEach(function(c) {
        departments.forEach(function(d) {
            if (d.companyId === c.id) {
                csv += '"' + c.name + '","' + d.name + '"\n';
            }
        });
    });
    var blob = new Blob([csv], { type: 'text/csv' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'companies-export.csv';
    a.click();
    URL.revokeObjectURL(url);
    showToast('List exported');
}

// ============================================================
//  dxToast — notifications (replaces original showToast)
// ============================================================
function initToast() {
    toastWidget = $('#toastNotify').dxToast({
        displayTime: 2500,
        width: 'auto',
        position: { my: 'bottom center', at: 'bottom center', of: window, offset: '0 -40' },
        animation: {
            show: { type: 'fade', from: 0, to: 1, duration: 300 },
            hide: { type: 'fade', from: 1, to: 0, duration: 300 }
        }
    }).dxToast('instance');
}

function showToast(message) {
    toastWidget.option({ message: message, type: 'success' });
    toastWidget.show();
}

// ============================================================
//  dxPopup — delete confirmation (replaces window.confirm)
// ============================================================
function initDeleteConfirm() {
    deleteConfirmWidget = $('#deleteConfirm').dxPopup({
        width: 380,
        height: 'auto',
        showTitle: true,
        title: 'Confirm Delete',
        visible: false,
        showCloseButton: true,
        hideOnOutsideClick: true,
        contentTemplate: function(container) {
            $('<div>').attr('id', 'deleteMessage').appendTo(container);
            var btnRow = $('<div>').addClass('dx-popup-actions').appendTo(container);
            $('<div>').attr('id', 'deleteCancelBtn').appendTo(btnRow);
            $('<div>').attr('id', 'deleteOkBtn').appendTo(btnRow);
        }
    }).dxPopup('instance');
}

// ============================================================
//  SIDEBAR SCOPE — company / department filter (shared with users page)
// ============================================================
function deptsForCompany(companyId) {
    return departments.filter(function(d) { return d.companyId === companyId; });
}

function readScope() {
    try {
        var raw = localStorage.getItem('gameon.scope');
        return raw ? JSON.parse(raw) : {};
    } catch (e) {
        return {};
    }
}

function writeScope(companyId, departmentId) {
    try {
        localStorage.setItem('gameon.scope', JSON.stringify({
            companyId: companyId == null ? null : companyId,
            departmentId: departmentId == null ? null : departmentId
        }));
    } catch (e) {}
}

function initScopedNav() {
    // Scope is driven by the shared sidebar picker (script-sidebar-scope.js).
    // Nothing else to do on this page when the scope changes — the sidebar
    // picker writes localStorage 'gameon.scope' itself.
}

// ============================================================
//  INIT
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    renderCompaniesTable();
    initDeleteConfirm();
    initToast();
    initScopedNav();
});
