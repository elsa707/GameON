// ============================================================
//  Scoped Users page — filters the grid by the company/department
//  selected in the sidebar. Relies on script-users-dx.js for data
//  (users, companies, departments) and the grid/edit panel setup.
// ============================================================

function readScope() {
    try {
        var raw = localStorage.getItem('gameon.scope');
        return raw ? JSON.parse(raw) : {};
    } catch (err) {
        return {};
    }
}

function writeScope(companyId, departmentId) {
    try {
        localStorage.setItem('gameon.scope', JSON.stringify({
            companyId: companyId == null ? null : companyId,
            departmentId: departmentId == null ? null : departmentId
        }));
    } catch (err) {}
}

function scopedUsers(companyId, departmentId) {
    return users.filter(function(u) {
        if (companyId != null && u.companyId !== companyId) return false;
        if (departmentId != null && u.departmentId !== departmentId) return false;
        return true;
    });
}

function applyScopeToGrid(companyId, departmentId) {
    var grid = $('#usersGrid').dxDataGrid('instance');
    if (!grid) return;

    var hasScope = companyId != null || departmentId != null;
    $('#scopeEmptyState').toggleClass('hidden', hasScope);
    $('#usersGrid').toggleClass('hidden', !hasScope);

    grid.option('dataSource', hasScope ? scopedUsers(companyId, departmentId) : []);
    if (hasScope) grid.updateDimensions();

    $('.dx-toolbar-title').text('Users');
}

$(function() {
    var stored = readScope();
    applyScopeToGrid(stored.companyId || null, stored.departmentId || null);

    document.addEventListener('gameon:scope-change', function(e) {
        var d = (e && e.detail) || {};
        applyScopeToGrid(d.companyId == null ? null : d.companyId,
                         d.departmentId == null ? null : d.departmentId);
    });
});
