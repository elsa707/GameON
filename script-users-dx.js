// ===== Sidebar =====
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('collapsed');
}
function toggleNavGroup(evt) {
    evt.preventDefault();
    evt.currentTarget.closest('.nav-group').classList.toggle('open');
}

// ============================================================
//  LOOKUP DATA
// ============================================================
var ROLES = ['Trainee', 'Employee', 'Manager', 'Company Manager', 'Admin'];

var LOGIN_METHODS = [
    { value: 'email', name: 'Email' },
    { value: 'otp', name: 'OTP' }
];

var companies = [
    { id: 7, name: 'Naspers' },
    { id: 6, name: 'Standard Bank' },
    { id: 5, name: 'Anglo American' },
    { id: 4, name: 'Sasol' },
    { id: 3, name: 'MTN Group' },
    { id: 2, name: 'Discovery' },
    { id: 1, name: 'Shoprite' },
];

var departments = [
    { id: 101, companyId: 7, name: 'Manufacturing' },
    { id: 102, companyId: 7, name: 'R&D' },
    { id: 103, companyId: 7, name: 'Sales' },
    { id: 104, companyId: 7, name: 'Finance' },
    { id: 105, companyId: 7, name: 'Human Resources' },
    { id: 106, companyId: 7, name: 'IT & Digital' },
    { id: 201, companyId: 6, name: 'Sales' },
    { id: 202, companyId: 6, name: 'Aftersales' },
    { id: 203, companyId: 6, name: 'Finance' },
    { id: 204, companyId: 6, name: 'Marketing' },
    { id: 205, companyId: 6, name: 'Human Resources' },
    { id: 301, companyId: 5, name: 'R&D' },
    { id: 302, companyId: 5, name: 'Manufacturing' },
    { id: 303, companyId: 5, name: 'Sales' },
    { id: 304, companyId: 5, name: 'Marketing' },
    { id: 305, companyId: 5, name: 'Engineering' },
    { id: 306, companyId: 5, name: 'Finance' },
    { id: 401, companyId: 4, name: 'Operations' },
    { id: 402, companyId: 4, name: 'Marketing' },
    { id: 403, companyId: 4, name: 'Finance' },
    { id: 404, companyId: 4, name: 'Human Resources' },
    { id: 405, companyId: 4, name: 'IT' },
    { id: 501, companyId: 3, name: 'Supply Chain' },
    { id: 502, companyId: 3, name: 'Brand & Marketing' },
    { id: 503, companyId: 3, name: 'Sustainability' },
    { id: 504, companyId: 3, name: 'Engineering' },
    { id: 505, companyId: 3, name: 'Finance' },
    { id: 506, companyId: 3, name: 'Human Resources' },
    { id: 507, companyId: 3, name: 'Sales' },
    { id: 508, companyId: 3, name: 'Manufacturing' },
    { id: 509, companyId: 3, name: 'R&D' },
    { id: 510, companyId: 3, name: 'Logistics' },
    { id: 511, companyId: 3, name: 'IT & Digital' },
    { id: 512, companyId: 3, name: 'Legal' },
    { id: 513, companyId: 3, name: 'Customer Service' },
    { id: 514, companyId: 3, name: 'Quality Assurance' },
    { id: 515, companyId: 3, name: 'Procurement' },
    { id: 601, companyId: 2, name: 'R&D' },
    { id: 602, companyId: 2, name: 'Manufacturing' },
    { id: 603, companyId: 2, name: 'Finance' },
    { id: 604, companyId: 2, name: 'Logistics' },
    { id: 701, companyId: 1, name: 'Marketing' },
    { id: 702, companyId: 1, name: 'Engineering' },
    { id: 703, companyId: 1, name: 'Sales' },
    { id: 704, companyId: 1, name: 'Human Resources' },
    { id: 705, companyId: 1, name: 'Operations' },
    { id: 706, companyId: 1, name: 'Finance' },
    { id: 707, companyId: 1, name: 'Customer Support' },
    { id: 708, companyId: 1, name: 'Product' },
    { id: 709, companyId: 1, name: 'Legal' },
    { id: 710, companyId: 1, name: 'Data Analytics' },
];

// ============================================================
//  USER DATA
// ============================================================
var users = [
    { id: 1,  idPassport: '8501015800081', name: 'Thabo',    surname: 'Mokoena',    email: 'thabo.mokoena@weelee.co.za',      companyId: 1, departmentId: 702, role: 'Admin',           gameRetries: 3, active: true,  disabledDate: null },
    { id: 2,  idPassport: '9002124800082', name: 'Naledi',   surname: 'Dlamini',    email: 'naledi.dlamini@weelee.co.za',      companyId: 1, departmentId: 701, role: 'Manager',         gameRetries: 5, active: true,  disabledDate: null },
    { id: 3,  idPassport: '8807230100083', name: 'Sipho',    surname: 'Nkosi',      email: 'sipho.nkosi@weelee.co.za',         companyId: 1, departmentId: 703, role: 'Employee',        gameRetries: 2, active: false, disabledDate: '2026-02-14' },
    { id: 4,  idPassport: '9106185000084', name: 'Lerato',   surname: 'Molefe',     email: 'lerato.molefe@weelee.co.za',       companyId: 1, departmentId: 706, role: 'Employee',        gameRetries: 1, active: true,  disabledDate: null },
    { id: 5,  idPassport: '8703095100085', name: 'Kagiso',   surname: 'Van der Merwe', email: 'kagiso.vdm@weelee.co.za',       companyId: 1, departmentId: 702, role: 'Employee',        gameRetries: 4, active: true,  disabledDate: null },
    { id: 6,  idPassport: '9304261200086', name: 'Palesa',   surname: 'Mthembu',    email: 'palesa.mthembu@weelee.co.za',      companyId: 1, departmentId: 707, role: 'Employee',        gameRetries: 2, active: true,  disabledDate: null },
    { id: 7,  idPassport: '8609145300087', name: 'Bongani',  surname: 'Pretorius',  email: 'bongani.pretorius@weelee.co.za',   companyId: 1, departmentId: 708, role: 'Manager',         gameRetries: 3, active: true,  disabledDate: null },
    { id: 8,  idPassport: '9501028400088', name: 'Zanele',   surname: 'Botha',      email: 'zanele.botha@weelee.co.za',        companyId: 1, departmentId: 704, role: 'Employee',        gameRetries: 1, active: false, disabledDate: '2026-03-28' },
    { id: 9,  idPassport: '',              name: 'Mandla',   surname: 'Joubert',    email: 'mandla.joubert@weelee.co.za',      companyId: 1, departmentId: 710, role: 'Employee',        gameRetries: 0, active: true,  disabledDate: null },
    { id: 10, idPassport: '8804176500090', name: 'Ayanda',   surname: 'Khumalo',    email: 'ayanda.khumalo@weelee.co.za',      companyId: 1, departmentId: 705, role: 'Employee',        gameRetries: 2, active: true,  disabledDate: null },
    { id: 11, idPassport: '9207089600091', name: 'Pierre',   surname: 'Du Plessis', email: 'pierre.duplessis@renault.co.za',   companyId: 3, departmentId: 504, role: 'Company Manager', gameRetries: 5, active: true,  disabledDate: null },
    { id: 12, idPassport: '8705234700092', name: 'Fatima',   surname: 'Abrahams',   email: 'fatima.abrahams@renault.co.za',    companyId: 3, departmentId: 507, role: 'Manager',         gameRetries: 3, active: true,  disabledDate: null },
    { id: 13, idPassport: '9103157800093', name: 'Jacques',  surname: 'Venter',     email: 'jacques.venter@renault.co.za',     companyId: 3, departmentId: 509, role: 'Employee',        gameRetries: 2, active: false, disabledDate: '2026-01-10' },
    { id: 14, idPassport: '8901046900094', name: 'Lindiwe',  surname: 'Zulu',       email: 'lindiwe.zulu@renault.co.za',       companyId: 3, departmentId: 501, role: 'Employee',        gameRetries: 4, active: true,  disabledDate: null },
    { id: 15, idPassport: '',              name: 'David',    surname: 'Coetzee',    email: 'david.coetzee@renault.co.za',      companyId: 3, departmentId: 505, role: 'Employee',        gameRetries: 1, active: true,  disabledDate: null },
    { id: 16, idPassport: '9408293000096', name: 'Nomsa',    surname: 'Maharaj',    email: 'nomsa.maharaj@renault.co.za',      companyId: 3, departmentId: 506, role: 'Employee',        gameRetries: 0, active: true,  disabledDate: null },
    { id: 17, idPassport: '8602118100097', name: 'Ravi',     surname: 'Naidoo',     email: 'ravi.naidoo@renault.co.za',        companyId: 3, departmentId: 508, role: 'Employee',        gameRetries: 3, active: true,  disabledDate: null },
    { id: 18, idPassport: '9005062200098', name: 'Chloe',    surname: 'Swanepoel',  email: 'chloe.swanepoel@renault.co.za',    companyId: 3, departmentId: 513, role: 'Manager',         gameRetries: 2, active: true,  disabledDate: null },
    { id: 19, idPassport: '8803199300099', name: 'Themba',   surname: 'De Villiers', email: 'themba.devilliers@renault.co.za', companyId: 3, departmentId: 511, role: 'Employee',        gameRetries: 1, active: true,  disabledDate: null },
    { id: 20, idPassport: '9206254400100', name: 'Annika',   surname: 'Steyn',      email: 'annika.steyn@renault.co.za',       companyId: 3, departmentId: 502, role: 'Employee',        gameRetries: 5, active: true,  disabledDate: null },
    { id: 21, idPassport: '8704167500101', name: 'Vikram',   surname: 'Sharma',     email: 'vikram.sharma@mahindra.co.za',     companyId: 7, departmentId: 101, role: 'Company Manager', gameRetries: 3, active: true,  disabledDate: null },
    { id: 22, idPassport: '9101098600102', name: 'Priya',    surname: 'Patel',      email: 'priya.patel@mahindra.co.za',       companyId: 7, departmentId: 102, role: 'Manager',         gameRetries: 4, active: true,  disabledDate: null },
    { id: 23, idPassport: '8908231700103', name: 'Arjun',    surname: 'Singh',      email: 'arjun.singh@mahindra.co.za',       companyId: 7, departmentId: 103, role: 'Employee',        gameRetries: 2, active: true,  disabledDate: null },
    { id: 24, idPassport: '',              name: 'Meera',    surname: 'Gupta',      email: 'meera.gupta@mahindra.co.za',       companyId: 7, departmentId: 104, role: 'Employee',        gameRetries: 1, active: true,  disabledDate: null },
    { id: 25, idPassport: '9305142900105', name: 'Raj',      surname: 'Kumar',      email: 'raj.kumar@mahindra.co.za',         companyId: 7, departmentId: 106, role: 'Employee',        gameRetries: 0, active: true,  disabledDate: null },
    { id: 26, idPassport: '8506078000106', name: 'Johan',    surname: 'Grobler',    email: 'johan.grobler@motus.co.za',        companyId: 6, departmentId: 201, role: 'Company Manager', gameRetries: 5, active: true,  disabledDate: null },
    { id: 27, idPassport: '9202153100107', name: 'Sarah',    surname: 'Le Roux',    email: 'sarah.leroux@motus.co.za',         companyId: 6, departmentId: 202, role: 'Manager',         gameRetries: 3, active: true,  disabledDate: null },
    { id: 28, idPassport: '8809246200108', name: 'Michael',  surname: 'Erasmus',    email: 'michael.erasmus@motus.co.za',      companyId: 6, departmentId: 203, role: 'Employee',        gameRetries: 2, active: true,  disabledDate: null },
    { id: 29, idPassport: '9104017300109', name: 'Thandiwe', surname: 'Ndlovu',     email: 'thandiwe.ndlovu@motus.co.za',      companyId: 6, departmentId: 204, role: 'Employee',        gameRetries: 1, active: false, disabledDate: '2026-04-02' },
    { id: 30, idPassport: '8707182400110', name: 'Werner',   surname: 'Ferreira',   email: 'werner.ferreira@motus.co.za',      companyId: 6, departmentId: 205, role: 'Employee',        gameRetries: 4, active: true,  disabledDate: null },
    { id: 31, idPassport: '9003095500111', name: 'Yuki',     surname: 'Tanaka',     email: 'yuki.tanaka@honda.co.jp',          companyId: 5, departmentId: 301, role: 'Company Manager', gameRetries: 3, active: true,  disabledDate: null },
    { id: 32, idPassport: '8801234600112', name: 'Kenji',    surname: 'Yamamoto',   email: 'kenji.yamamoto@honda.co.jp',       companyId: 5, departmentId: 302, role: 'Manager',         gameRetries: 2, active: true,  disabledDate: null },
    { id: 33, idPassport: '9206187700113', name: 'Sakura',   surname: 'Suzuki',     email: 'sakura.suzuki@honda.co.jp',        companyId: 5, departmentId: 303, role: 'Employee',        gameRetries: 5, active: true,  disabledDate: null },
    { id: 34, idPassport: '',              name: 'Takeshi',  surname: 'Nakamura',   email: 'takeshi.nakamura@honda.co.jp',     companyId: 5, departmentId: 305, role: 'Employee',        gameRetries: 1, active: true,  disabledDate: null },
    { id: 35, idPassport: '8904128800115', name: 'Hana',     surname: 'Watanabe',   email: 'hana.watanabe@honda.co.jp',        companyId: 5, departmentId: 306, role: 'Employee',        gameRetries: 0, active: false, disabledDate: '2025-12-19' },
    { id: 36, idPassport: '9107051900116', name: 'Brendan',  surname: 'Murphy',     email: 'brendan.murphy@spur.co.za',        companyId: 4, departmentId: 401, role: 'Company Manager', gameRetries: 4, active: true,  disabledDate: null },
    { id: 37, idPassport: '8603294000117', name: 'Lisa',     surname: 'Van Wyk',    email: 'lisa.vanwyk@spur.co.za',           companyId: 4, departmentId: 402, role: 'Manager',         gameRetries: 3, active: true,  disabledDate: null },
    { id: 38, idPassport: '9408165100118', name: 'Chris',    surname: 'Smit',       email: 'chris.smit@spur.co.za',            companyId: 4, departmentId: 403, role: 'Employee',        gameRetries: 2, active: true,  disabledDate: null },
    { id: 39, idPassport: '8802037200119', name: 'Tumi',     surname: 'Mashaba',    email: 'tumi.mashaba@spur.co.za',          companyId: 4, departmentId: 404, role: 'Employee',        gameRetries: 1, active: true,  disabledDate: null },
    { id: 40, idPassport: '9305218300120', name: 'Daisuke',  surname: 'Ito',        email: 'daisuke.ito@suzuki.co.jp',         companyId: 2, departmentId: 601, role: 'Company Manager', gameRetries: 5, active: true,  disabledDate: null },
    { id: 41, idPassport: '8706149400121', name: 'Aiko',     surname: 'Sato',       email: 'aiko.sato@suzuki.co.jp',           companyId: 2, departmentId: 602, role: 'Manager',         gameRetries: 3, active: true,  disabledDate: null },
    { id: 42, idPassport: '9001083500122', name: 'Haruto',   surname: 'Kobayashi',  email: 'haruto.kobayashi@suzuki.co.jp',    companyId: 2, departmentId: 603, role: 'Employee',        gameRetries: 2, active: true,  disabledDate: null },
    { id: 43, idPassport: '',              name: 'Rina',     surname: 'Takahashi',  email: 'rina.takahashi@suzuki.co.jp',      companyId: 2, departmentId: 604, role: 'Employee',        gameRetries: 1, active: true,  disabledDate: null },
];

// Seed mobile numbers on ~2/3 of users (optional field)
users.forEach(function(u) {
    if (u.id % 3 === 0) { u.mobile = ''; return; }
    var n = String(10000000 + (u.id * 731) % 89999999);
    u.mobile = '+27 ' + n.slice(0, 2) + ' ' + n.slice(2, 5) + ' ' + n.slice(5);
});

// Seed login method — users without a mobile can only use Email
users.forEach(function(u) {
    u.loginMethod = u.mobile && (u.id % 2 === 0) ? 'otp' : 'email';
});

// ============================================================
//  HELPERS
// ============================================================
var toastWidget;
var selectedUser = null;
var editEntity = null; // 'edit' | 'add'
var activeStatusFilter = 'active'; // 'active' | 'disabled'
var bulkDisableBtnInstance = null;

function todayISO() {
    return new Date().toISOString().slice(0, 10);
}

function formatDate(iso) {
    if (!iso) return '';
    var parts = iso.split('-');
    return parts[2] + '/' + parts[1] + '/' + parts[0];
}

function companyName(id) {
    var c = companies.find(function(x) { return x.id === id; });
    return c ? c.name : '';
}

function deptName(id) {
    var d = departments.find(function(x) { return x.id === id; });
    return d ? d.name : '';
}

function deptsForCompany(companyId) {
    return departments.filter(function(d) { return d.companyId === companyId; });
}

function nextUserId() {
    return Math.max.apply(null, users.map(function(u) { return u.id; })) + 1;
}

function refreshGrid() {
    var grid = $('#usersGrid').dxDataGrid('instance');
    if (grid) grid.refresh();
}

function updateUserCount() {
    var grid = $('#usersGrid').dxDataGrid('instance');
    var total = grid ? grid.totalCount() : users.length;
    if (total < 0) total = users.length;
    $('#userCount').text(total + ' user' + (total !== 1 ? 's' : ''));
}

// ============================================================
//  STATUS FILTER CHIPS
// ============================================================
function filterByStatus(status) {
    activeStatusFilter = status;
    applyStatusFilter();

    // Update chip styling
    $('#statusChips .status-chip').removeClass('active');
    $('#statusChips .status-chip[data-status="' + status + '"]').addClass('active');
}

function applyStatusFilter() {
    var grid = $('#usersGrid').dxDataGrid('instance');
    if (!grid) return;
    var show = activeStatusFilter === 'active';
    grid.filter(function(item) {
        return item.active === show;
    });
}

// ============================================================
//  dxToolbar — page header (matches companies view)
// ============================================================
function initToolbar() {
    $('#pageToolbar').dxToolbar({
        items: [
            {
                location: 'before',
                template: function() {
                    return $('<h1>').addClass('dx-toolbar-title').text('Users');
                }
            },
            {
                location: 'before',
                template: function() {
                    return $('<span>').attr('id', 'userCount').addClass('toolbar-count');
                }
            },
            {
                location: 'after',
                widget: 'dxButton',
                options: {
                    icon: 'export',
                    text: 'Export',
                    stylingMode: 'outlined',
                    onClick: exportList
                }
            },
            {
                location: 'after',
                widget: 'dxButton',
                options: {
                    icon: 'fa fa-upload',
                    text: 'Bulk upload',
                    stylingMode: 'outlined',
                    onClick: openBatchUploadPanel
                }
            },
            {
                location: 'after',
                widget: 'dxButton',
                options: {
                    icon: 'fa fa-plus',
                    text: 'Add user',
                    type: 'default',
                    onClick: addUser
                }
            }
        ]
    });
}

// ============================================================
//  dxDataGrid — user grid (no popup editing, row click opens panel)
// ============================================================
function initUsersGrid() {
    $('#usersGrid').dxDataGrid({
        dataSource: users,
        keyExpr: 'id',
        showBorders: true,
        showRowLines: true,
        rowAlternationEnabled: true,
        columnAutoWidth: true,
        wordWrapEnabled: false,
        height: '100%',

        // --- Search + toolbar (search left, Disable button + status dropdown right) ---
        searchPanel: {
            visible: true,
            placeholder: 'Search users',
            width: 240
        },
        toolbar: {
            items: [
                { name: 'searchPanel', location: 'before' },
                {
                    location: 'after',
                    widget: 'dxButton',
                    options: {
                        icon: 'fa fa-ban',
                        text: 'Disable',
                        stylingMode: 'outlined',
                        disabled: true,
                        onInitialized: function(e) { bulkDisableBtnInstance = e.component; },
                        onClick: function() { confirmDisableSelectedUsers(); }
                    }
                },
                {
                    location: 'after',
                    widget: 'dxSelectBox',
                    options: {
                        dataSource: [
                            { value: 'active', text: 'Active' },
                            { value: 'disabled', text: 'Disabled' }
                        ],
                        valueExpr: 'value',
                        displayExpr: 'text',
                        value: activeStatusFilter,
                        width: 110,
                        onValueChanged: function(e) { filterByStatus(e.value); }
                    }
                }
            ]
        },

        // --- Sorting ---
        sorting: { mode: 'multiple' },

        // --- Paging ---
        paging: { pageSize: 15 },
        pager: {
            visible: true,
            displayMode: 'full',
            showPageSizeSelector: true,
            allowedPageSizes: [10, 15, 25, 50],
            showInfo: true,
            showNavigationButtons: true
        },

        // --- Selection ---
        selection: { mode: 'multiple', showCheckBoxesMode: 'always' },

        // --- Grouping ---
        grouping: { autoExpandAll: true },

        onSelectionChanged: function(e) {
            if (bulkDisableBtnInstance) {
                bulkDisableBtnInstance.option('disabled', e.selectedRowKeys.length < 2);
            }
        },

        onRowPrepared: function(e) {
            if (e.rowType === 'data' && !e.data.active) {
                $(e.rowElement).addClass('row-inactive');
            }
        },

        // --- Columns ---
        columns: [
            {
                dataField: 'name',
                caption: 'Name',
                sortIndex: 1,
                sortOrder: 'asc'
            },
            {
                dataField: 'surname',
                caption: 'Surname',
                sortIndex: 0,
                sortOrder: 'asc'
            },
            {
                dataField: 'email',
                caption: 'Email',
                cellTemplate: function(container, options) {
                    $('<span>').text(options.value || '').appendTo(container);
                    if ((options.data.loginMethod || 'email') === 'email') {
                        $('<span>').addClass('login-pill').text('Login').appendTo(container);
                    }
                }
            },
            {
                dataField: 'mobile',
                caption: 'Mobile',
                cellTemplate: function(container, options) {
                    $('<span>').text(options.value || '').appendTo(container);
                    if (options.data.loginMethod === 'otp') {
                        $('<span>').addClass('login-pill').text('Login').appendTo(container);
                    }
                }
            },
            {
                dataField: 'departmentId',
                caption: 'Department',
                lookup: {
                    dataSource: departments,
                    valueExpr: 'id',
                    displayExpr: 'name'
                }
            },
            {
                dataField: 'role',
                caption: 'Role'
            },
            {
                dataField: 'idPassport',
                caption: 'ID / Passport',
                visible: false,
                width: 140
            },
            {
                dataField: 'gameRetries',
                caption: 'Retries',
                dataType: 'number',
                width: 80,
                alignment: 'center'
            },
            {
                dataField: 'active',
                caption: 'Status',
                width: 150,
                allowSorting: true,
                cellTemplate: function(container, options) {
                    if (options.data.active) {
                        $('<span>').addClass('status-badge status-active').text('Active').appendTo(container);
                    } else {
                        var date = options.data.disabledDate || '';
                        var formatted = date ? formatDate(date) : '';
                        var wrap = $('<span>').addClass('status-badge status-inactive');
                        wrap.text('Disabled');
                        if (formatted) {
                            wrap.append($('<span>').addClass('status-date').text(formatted));
                        }
                        wrap.appendTo(container);
                    }
                },
                calculateCellValue: function(data) {
                    return data.active ? 'Active' : 'Disabled';
                }
            },
            {
                type: 'buttons',
                width: 50,
                buttons: [
                    {
                        hint: 'Edit',
                        icon: 'fa fa-pen',
                        onClick: function(e) {
                            selectedUser = e.row.data;
                            openEditPanel(e.row.data);
                        }
                    }
                ]
            }
        ],

        // --- Group summary (count per group) ---
        summary: {
            groupItems: [
                { summaryType: 'count', displayFormat: '{0} users' }
            ]
        },

        onContentReady: function() {
            updateUserCount();
        }
    });
}

// ============================================================
//  SIDE PANEL — edit / add (matches companies detail view)
// ============================================================
function openEditPanel(user) {
    editEntity = 'edit';
    selectedUser = user;

    var comp = companyName(user.companyId);
    var dept = deptName(user.departmentId);
    var subtitle = [comp, dept].filter(Boolean).join(' - ');

    $('#editTitle').text('Edit User');
    $('#editSubtitle').text(subtitle);
    $('#editBadge').html('<i class="fas fa-pen"></i> Editing').show();

    buildUserForm({
        name: user.name,
        surname: user.surname,
        email: user.email,
        mobile: user.mobile || '',
        companyId: user.companyId,
        departmentId: user.departmentId,
        role: user.role,
        loginMethod: user.loginMethod || 'email',
        idPassport: user.idPassport || '',
        gameRetries: user.gameRetries
    });

    $('#editDeleteBtn').dxButton({
        icon: 'trash', stylingMode: 'text', type: 'danger', visible: true, hint: 'Delete',
        onClick: function() {
            if (!confirm('Are you sure you want to delete this user?')) return;
            var idx = users.indexOf(selectedUser);
            if (idx > -1) users.splice(idx, 1);
            closeDetail();
            refreshGrid();
            showToast('"' + user.name + ' ' + user.surname + '" deleted');
        }
    });

    if (user.active) {
        $('#editDisableBtn').dxButton({
            icon: 'fa fa-ban', text: 'Disable', stylingMode: 'text', type: 'danger', visible: true,
            onClick: function() { confirmDisableUser(user); }
        });
    } else {
        $('#editDisableBtn').dxButton({
            icon: 'fa fa-check-circle', text: 'Activate', stylingMode: 'text', visible: true,
            onClick: function() {
                user.active = true;
                user.disabledDate = null;
                refreshGrid();
                showToast('"' + user.name + ' ' + user.surname + '" activated');
                openEditPanel(user);
            }
        });
    }

    $('#editCancelBtn').dxButton({ text: 'Cancel', stylingMode: 'outlined', visible: true, onClick: closeDetail });
    $('#editSaveBtn').dxButton({ text: 'Save Changes', type: 'default', visible: true, onClick: saveUser });

    showPanel();
}

function addUser() {
    editEntity = 'add';
    selectedUser = null;

    var scope = {};
    try {
        var raw = localStorage.getItem('gameon.scope');
        if (raw) scope = JSON.parse(raw);
    } catch (e) {}

    var hasCompany = scope.companyId != null;
    var hasDepartment = scope.departmentId != null;
    var companyId = hasCompany ? scope.companyId : (companies.length > 0 ? companies[0].id : null);
    var departmentId = hasDepartment ? scope.departmentId : null;
    var subtitle = [
        hasCompany ? companyName(companyId) : '',
        hasDepartment ? deptName(departmentId) : ''
    ].filter(Boolean).join(' - ');

    $('#editTitle').text('Add User');
    $('#editSubtitle').text(subtitle);
    $('#editBadge').hide();

    buildUserForm({
        name: '',
        surname: '',
        email: '',
        mobile: '',
        companyId: companyId,
        departmentId: departmentId,
        role: 'Trainee',
        loginMethod: null,
        idPassport: '',
        gameRetries: 1
    }, { mode: 'add', lockCompany: hasCompany, lockDepartment: hasDepartment });

    $('#editDeleteBtn').dxButton({ visible: false });
    $('#editDisableBtn').dxButton({ visible: false });
    $('#editCancelBtn').dxButton({ text: 'Cancel', stylingMode: 'outlined', visible: true, onClick: closeDetail });
    $('#editSaveBtn').dxButton({ text: 'Add user', type: 'default', visible: true, onClick: saveUser });

    showPanel();
}

function ensureBatchContainer() {
    if (document.getElementById('batchUploadContainer')) return;
    $('<div>').attr('id', 'batchUploadContainer')
        .hide()
        .insertAfter('#editFormContainer');
}

function showEditForm() {
    $('#editFormContainer').show();
    $('#batchUploadContainer').hide();
}

function showBatchUpload() {
    $('#editFormContainer').hide();
    $('#batchUploadContainer').show();
}

function openBatchUploadPanel() {
    editEntity = 'batch-upload';
    selectedUser = null;

    ensureBatchContainer();

    var scope = {};
    try {
        var raw = localStorage.getItem('gameon.scope');
        if (raw) scope = JSON.parse(raw);
    } catch (e) {}
    var hasCompany = scope.companyId != null;
    var hasDepartment = scope.departmentId != null;
    var hasScope = hasCompany && hasDepartment;
    var subtitle = [
        hasCompany ? companyName(scope.companyId) : '',
        hasDepartment ? deptName(scope.departmentId) : ''
    ].filter(Boolean).join(' - ');

    $('#editTitle').text('Bulk upload');
    $('#editSubtitle').text(subtitle);
    $('#editBadge').hide();

    $('#batchUploadContainer').empty().append(
        $('<div>').addClass('batch-upload-body').append(
            $('<p>').addClass('batch-upload-hint').text(
                hasScope
                    ? 'Uploaded users will be assigned to this company / department with role "Trainee".'
                    : 'Select the target company and department. Uploaded users will be assigned to them with role "Trainee".'
            ),
            $('<div>').attr('id', 'batchCompanySelect'),
            $('<div>').attr('id', 'batchDepartmentSelect'),
            $('<div>').addClass('batch-actions').append(
                $('<div>').attr('id', 'batchTemplateBtn'),
                $('<div>').attr('id', 'batchUploadBtn')
            ),
            $('<div>').attr('id', 'batchFileUploader').addClass('batch-file-uploader'),
            $('<div>').attr('id', 'batchUploadResult').addClass('batch-upload-result')
        )
    );

    $('#batchCompanySelect').dxSelectBox({
        dataSource: companies,
        displayExpr: 'name',
        valueExpr: 'id',
        placeholder: 'Select company...',
        label: 'Company',
        labelMode: 'floating',
        searchEnabled: true,
        searchMode: 'contains',
        searchExpr: 'name',
        searchTimeout: 200,
        minSearchLength: 0,
        showDataBeforeSearch: true,
        value: hasCompany ? scope.companyId : null,
        readOnly: hasCompany,
        onValueChanged: function(e) {
            var deptSelect = $('#batchDepartmentSelect').dxSelectBox('instance');
            deptSelect.option('dataSource', e.value != null ? deptsForCompany(e.value) : []);
            deptSelect.option('value', null);
            updateBatchReadiness();
        }
    });

    $('#batchDepartmentSelect').dxSelectBox({
        dataSource: hasCompany ? deptsForCompany(scope.companyId) : [],
        displayExpr: 'name',
        valueExpr: 'id',
        placeholder: 'Select department...',
        label: 'Department',
        labelMode: 'floating',
        searchEnabled: true,
        searchMode: 'contains',
        searchExpr: 'name',
        searchTimeout: 200,
        minSearchLength: 0,
        showDataBeforeSearch: true,
        value: hasDepartment ? scope.departmentId : null,
        readOnly: hasDepartment,
        onValueChanged: updateBatchReadiness
    });

    $('#batchTemplateBtn').dxButton({
        icon: 'fa fa-download',
        text: 'Download template',
        stylingMode: 'outlined',
        onClick: downloadBatchTemplate
    });

    $('#batchUploadBtn').dxButton({
        icon: 'fa fa-file-excel',
        text: 'Upload Excel',
        type: 'default',
        disabled: !hasScope,
        onClick: function() {
            $('#batchFileUploader').find('.dx-fileuploader-button').first().trigger('click');
        }
    });

    $('#batchFileUploader').dxFileUploader({
        selectButtonText: 'Choose Excel file',
        labelText: 'or drop file here',
        accept: '.xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel',
        uploadMode: 'useButtons',
        allowedFileExtensions: ['.xlsx', '.xls'],
        disabled: !hasScope,
        onValueChanged: function(e) {
            var files = e.value || [];
            if (!files.length) return;
            readBatchFile(files[0]);
        }
    });

    showBatchUpload();

    $('#editDeleteBtn').dxButton({ visible: false });
    $('#editDisableBtn').dxButton({ visible: false });
    $('#editCancelBtn').dxButton({ text: 'Close', stylingMode: 'outlined', visible: true, onClick: closeDetail });
    $('#editSaveBtn').dxButton({ visible: false });

    showPanel();
}

function updateBatchReadiness() {
    var companyId = $('#batchCompanySelect').dxSelectBox('instance').option('value');
    var departmentId = $('#batchDepartmentSelect').dxSelectBox('instance').option('value');
    var ready = !!companyId && !!departmentId;
    $('#batchFileUploader').dxFileUploader('instance').option('disabled', !ready);
    var uploadBtn = $('#batchUploadBtn').dxButton('instance');
    if (uploadBtn) uploadBtn.option('disabled', !ready);
}

function downloadBatchTemplate() {
    var headers = ['Name', 'Surname', 'Email', 'Mobile', 'ID_Passport'];
    var sample = ['Jane', 'Doe', 'jane.doe@example.com', '+27 82 123 4567', 'YYMMDDSSSSCAZ'];
    var ws = XLSX.utils.aoa_to_sheet([headers, sample]);
    ws['!cols'] = [{ wch: 14 }, { wch: 16 }, { wch: 28 }, { wch: 18 }, { wch: 16 }];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Users');
    XLSX.writeFile(wb, 'users-template.xlsx');
}

function readBatchFile(file) {
    var reader = new FileReader();
    reader.onload = function(ev) {
        try {
            var data = new Uint8Array(ev.target.result);
            var workbook = XLSX.read(data, { type: 'array' });
            var firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            var rows = XLSX.utils.sheet_to_json(firstSheet, { defval: '' });
            var count = rows.length;
            $('#batchUploadResult').html(
                '<i class="fas fa-check-circle" style="color:#15803d;"></i> ' +
                'Parsed <strong>' + count + '</strong> row' + (count !== 1 ? 's' : '') +
                ' from <em>' + file.name + '</em>.'
            );
            showToast('Parsed ' + count + ' rows from ' + file.name);
        } catch (err) {
            $('#batchUploadResult').html(
                '<i class="fas fa-exclamation-circle" style="color:#b91c1c;"></i> ' +
                'Could not read <em>' + file.name + '</em>. Please use the Excel template.'
            );
        }
    };
    reader.readAsArrayBuffer(file);
}

function buildUserForm(formData, options) {
    options = options || {};
    var floating = options.mode === 'add';
    var lockCompany = options.lockCompany === true;
    var lockDepartment = options.lockDepartment === true;
    var currentCompanyId = formData.companyId;

    showEditForm();

    var items = [];

    items.push({ dataField: 'companyId',
        label: { text: 'Company' },
        editorType: 'dxSelectBox',
        editorOptions: {
            dataSource: companies,
            displayExpr: 'name',
            valueExpr: 'id',
            searchEnabled: true,
            searchMode: 'contains',
            searchExpr: 'name',
            searchTimeout: 200,
            minSearchLength: 0,
            showDataBeforeSearch: true,
            readOnly: lockCompany,
            onValueChanged: function(e) {
                currentCompanyId = e.value;
                var form = $('#editFormContainer').dxForm('instance');
                var deptEditor = form.getEditor('departmentId');
                if (deptEditor) {
                    deptEditor.option('dataSource', e.value != null ? deptsForCompany(e.value) : []);
                    deptEditor.option('value', null);
                }
            }
        } });

    items.push({ dataField: 'departmentId',
        label: { text: 'Department' },
        editorType: 'dxSelectBox',
        editorOptions: {
            dataSource: currentCompanyId != null ? deptsForCompany(currentCompanyId) : [],
            displayExpr: 'name',
            valueExpr: 'id',
            searchEnabled: true,
            searchMode: 'contains',
            searchExpr: 'name',
            searchTimeout: 200,
            minSearchLength: 0,
            showDataBeforeSearch: true,
            readOnly: lockDepartment
        } });

    items.push({ dataField: 'name',
        label: { text: 'Name' },
        labelMode: floating ? 'floating' : 'static',
        validationRules: [{ type: 'required', message: 'Name is required' }] });

    items.push({ dataField: 'surname',
        label: { text: 'Surname' },
        labelMode: floating ? 'floating' : 'static',
        validationRules: [{ type: 'required', message: 'Surname is required' }] });

    items.push({ dataField: 'email',
        label: { text: 'Email' },
        labelMode: floating ? 'floating' : 'static',
        validationRules: [
            { type: 'required', message: 'Email is required' },
            { type: 'email', message: 'Invalid email address' }
        ] });

    items.push({ dataField: 'mobile',
        label: { text: 'Mobile' },
        labelMode: floating ? 'floating' : 'static' });

    items.push({ dataField: 'role',
        label: { text: 'Role' },
        labelMode: 'static',
        editorType: 'dxSelectBox',
        editorOptions: {
            items: ROLES,
            searchEnabled: true,
            searchMode: 'contains',
            searchTimeout: 200,
            minSearchLength: 0,
            showDataBeforeSearch: true
        },
        validationRules: [{ type: 'required', message: 'Role is required' }] });

    items.push({ dataField: 'loginMethod',
        label: { text: 'Login Method' },
        labelMode: floating ? 'floating' : 'static',
        editorType: 'dxSelectBox',
        editorOptions: {
            dataSource: LOGIN_METHODS,
            valueExpr: 'value',
            displayExpr: 'name'
        },
        validationRules: [{ type: 'required', message: 'Login method is required' }] });

    items.push({ dataField: 'idPassport',
        label: { text: 'ID / Passport Number' },
        labelMode: floating ? 'floating' : 'static' });

    items.push({ dataField: 'gameRetries',
        label: { text: 'Game Retries' },
        labelMode: 'static',
        editorType: 'dxNumberBox',
        editorOptions: { min: 0, max: 99, showSpinButtons: true } });

    $('#editFormContainer').dxForm({
        formData: formData,
        labelLocation: 'top',
        colCount: 1,
        items: items
    });
}

function saveUser() {
    var form = $('#editFormContainer').dxForm('instance');
    var result = form.validate();
    if (!result.isValid) return;

    var d = form.option('formData');

    if (editEntity === 'edit' && selectedUser) {
        selectedUser.name = d.name;
        selectedUser.surname = d.surname;
        selectedUser.email = d.email;
        selectedUser.mobile = d.mobile || '';
        selectedUser.companyId = d.companyId;
        selectedUser.departmentId = d.departmentId;
        selectedUser.role = d.role;
        selectedUser.loginMethod = d.loginMethod;
        selectedUser.idPassport = d.idPassport;
        selectedUser.gameRetries = d.gameRetries;
        refreshGrid();
        showToast('"' + d.name + ' ' + d.surname + '" updated');
        // Refresh panel subtitle
        var subtitle = [companyName(d.companyId), deptName(d.departmentId)].filter(Boolean).join(' - ');
        $('#editSubtitle').text(subtitle);
    } else if (editEntity === 'add') {
        var newUser = {
            id: nextUserId(),
            name: d.name,
            surname: d.surname,
            email: d.email,
            mobile: d.mobile || '',
            companyId: d.companyId,
            departmentId: d.departmentId,
            role: d.role,
            loginMethod: d.loginMethod,
            idPassport: d.idPassport,
            gameRetries: d.gameRetries,
            active: true,
            disabledDate: null
        };
        users.push(newUser);
        refreshGrid();
        showToast('"' + d.name + ' ' + d.surname + '" added');
        closeDetail();
    }
}

// ============================================================
//  PANEL HELPERS
// ============================================================
function showPanel() {
    var panel = document.getElementById('detailPanel');
    panel.classList.add('open');
    document.getElementById('detailEmpty').style.display = 'none';
    document.getElementById('detailEdit').classList.remove('hidden');
}

function closeDetail() {
    var panel = document.getElementById('detailPanel');
    panel.classList.remove('open');
    document.getElementById('detailEmpty').style.display = '';
    document.getElementById('detailEdit').classList.add('hidden');
    selectedUser = null;
    var grid = $('#usersGrid').dxDataGrid('instance');
    if (grid) grid.deselectAll();
}

// ============================================================
//  EXPORT (toolbar button)
// ============================================================
function exportList() {
    var csv = 'Name,Surname,Email,Company,Department,Role,ID/Passport,Game Retries,Status\n';
    var grid = $('#usersGrid').dxDataGrid('instance');
    var data = grid.getDataSource().items();
    data.forEach(function(u) {
        csv += '"' + u.name + '","' + u.surname + '","' + u.email + '","' +
               companyName(u.companyId) + '","' + deptName(u.departmentId) + '","' +
               u.role + '","' + (u.idPassport || '') + '",' + u.gameRetries + ',"' +
               (u.active ? 'Active' : 'Disabled') + '"\n';
    });
    var blob = new Blob([csv], { type: 'text/csv' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'users-export.csv';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported ' + data.length + ' users');
}

// ============================================================
//  DISABLE CONFIRMATION (dxPopup)
// ============================================================
var disablePopupWidget;

function initDisableConfirm() {
    disablePopupWidget = $('#disableConfirm').dxPopup({
        width: 420,
        height: 'auto',
        showTitle: true,
        title: 'Disable User',
        visible: false,
        showCloseButton: true,
        hideOnOutsideClick: true,
        contentTemplate: function(container) {
            $('<div>').attr('id', 'disableMessage').appendTo(container);
            var btnRow = $('<div>').addClass('dx-popup-actions').appendTo(container);
            $('<div>').attr('id', 'disableCancelBtn').appendTo(btnRow);
            $('<div>').attr('id', 'disableOkBtn').appendTo(btnRow);
        }
    }).dxPopup('instance');
}

function confirmDisableUser(userData) {
    var comp = companyName(userData.companyId);
    var dept = deptName(userData.departmentId);
    var label = [comp, dept].filter(Boolean).join(' - ');

    disablePopupWidget.option('title', 'Disable User');
    disablePopupWidget.show();

    $('#disableMessage').html(
        '<p style="margin:0 0 6px;font-size:14px;">Are you sure you want to disable ' +
        '<strong>' + userData.name + ' ' + userData.surname + '</strong>' +
        (label ? ' (' + label + ')' : '') +
        '?</p>' +
        '<p style="margin:0;color:#64748b;font-size:13px;">The user will no longer be able to access the system.</p>'
    );

    $('#disableCancelBtn').dxButton({
        text: 'Cancel', stylingMode: 'outlined',
        onClick: function() { disablePopupWidget.hide(); }
    });
    $('#disableOkBtn').dxButton({
        text: 'Disable User', type: 'danger', icon: 'fa fa-ban',
        onClick: function() {
            userData.active = false;
            userData.disabledDate = todayISO();
            refreshGrid();
            disablePopupWidget.hide();
            showToast('"' + userData.name + ' ' + userData.surname + '" disabled');
            if (selectedUser === userData) closeDetail();
        }
    });
}

function confirmDisableSelectedUsers() {
    var grid = $('#usersGrid').dxDataGrid('instance');
    if (!grid) return;
    var selected = grid.getSelectedRowsData();
    if (selected.length < 2) return;

    disablePopupWidget.option('title', 'Disable Users');
    disablePopupWidget.show();

    $('#disableMessage').html(
        '<p style="margin:0 0 6px;font-size:14px;">Are you sure you want to disable ' +
        '<strong>' + selected.length + ' users</strong>?</p>' +
        '<p style="margin:0;color:#64748b;font-size:13px;">They will no longer be able to access the system.</p>'
    );

    $('#disableCancelBtn').dxButton({
        text: 'Cancel', stylingMode: 'outlined',
        onClick: function() { disablePopupWidget.hide(); }
    });
    $('#disableOkBtn').dxButton({
        text: 'Disable Users', type: 'danger', icon: 'fa fa-ban',
        onClick: function() {
            var today = todayISO();
            selected.forEach(function(u) {
                u.active = false;
                u.disabledDate = today;
            });
            grid.clearSelection();
            refreshGrid();
            disablePopupWidget.hide();
            showToast(selected.length + ' users disabled');
            if (selectedUser && selected.indexOf(selectedUser) > -1) closeDetail();
        }
    });
}

// ============================================================
//  dxToast
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
//  INIT
// ============================================================
$(function() {
    initToolbar();
    initUsersGrid();
    initToast();
    initDisableConfirm();
    applyStatusFilter();
});
