/* script-dashboard2.js
 * Nav-structure shim for index2.html.
 * Runs AFTER script-dashboard.js (jQuery deferred queue order).
 * Patches dashMainTab and re-seeds the sub-tab bar.
 * Does NOT touch script-dashboard.js or index.html.
 */
(function ($) {
    'use strict';

    var CONTENT_SUBS = [
        { text: 'Summary',     key: 'summary'     },
        { text: 'Players',     key: 'players'     },
        { text: 'Games',       key: 'games'       },
        { text: 'Departments', key: 'departments' }
    ];

    var GAM_SUBS = [
        { text: 'Leagues',    key: 'leagues'    },
        { text: 'Scoreboard', key: 'scoreboard' },
        { text: 'Streaks',    key: 'streaks'    },
        { text: 'Play days',  key: 'playdays'   }
    ];

    /* Trends: Summary/Players/Games all show the same chart — no sub-tabs needed. */
    function subsFor(tab) {
        if (tab === 'gamification') return GAM_SUBS;
        if (tab === 'trends')       return [];
        return CONTENT_SUBS;
    }

    $(function () {
        /* Re-seed the dxTabs instance created by script-dashboard.js */
        var tabsInst = $('#dashSubTabs').dxTabs('instance');
        if (tabsInst) {
            tabsInst.option({
                dataSource:    CONTENT_SUBS,
                selectedIndex: 0
            });
        }

        /* Patch dashMainTab for the new panel keys */
        window.dashMainTab = function (tab) {
            var subs     = subsFor(tab);
            var hasSubs  = subs.length > 0;
            var firstSub = hasSubs ? subs[0].key : 'summary';

            /* sidebar active highlight */
            document.querySelectorAll('[data-tab]').forEach(function (el) {
                el.classList.toggle('active', el.getAttribute('data-tab') === tab);
            });

            /* show/hide sub-tab bar */
            var $bar = $('.dash-subtabs-bar');
            if (hasSubs) {
                $bar.show();
                if (tabsInst) {
                    tabsInst.option({ dataSource: subs, selectedIndex: 0 });
                }
            } else {
                $bar.hide();
            }

            /* show correct main panel */
            document.querySelectorAll('.dash-panel').forEach(function (el) {
                el.classList.toggle('active', el.dataset.panel === tab);
            });

            /* show first sub-panel within it */
            document.querySelectorAll('.dash-panel.active .dash-sub-panel').forEach(function (el) {
                el.classList.toggle('active', el.dataset.sub === firstSub);
            });
        };
    });

}(jQuery));
