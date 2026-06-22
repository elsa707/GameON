/* script-dashboard2.js
 * Nav-structure shim for index2.html.
 * Runs AFTER script-dashboard.js (jQuery deferred queue order).
 * Patches dashMainTab and re-seeds the sub-tab bar.
 * Side nav: Summary / Players / Games / Departments / Gamification
 * Sub-tabs:  Overview / Trends / Forecasts & anomalies (combined)
 */
(function ($) {
    'use strict';

    /* Sub-tabs shown for all content tabs (Summary/Players/Games/Departments) */
    var CONTENT_SUBS = [
        { text: 'Overview',              key: 'overview'           },
        { text: 'Trends',                key: 'trends'             },
        { text: 'Forecasts & anomalies', key: 'forecastsanomalies' }
    ];

    var GAM_SUBS = [
        { text: 'Leagues',    key: 'leagues'    },
        { text: 'Scoreboard', key: 'scoreboard' },
        { text: 'Streaks',    key: 'streaks'    },
        { text: 'Play days',  key: 'playdays'   }
    ];

    function subsFor(tab) {
        if (tab === 'gamification') return GAM_SUBS;
        return CONTENT_SUBS;
    }

    $(function () {
        var tabsInst = $('#dashSubTabs').dxTabs('instance');

        /* Re-seed the dxTabs and override onItemClick to handle the combined
           "Forecasts & anomalies" sub-tab which needs an on-demand render. */
        if (tabsInst) {
            tabsInst.option({
                dataSource: CONTENT_SUBS,
                onItemClick: function (e) {
                    if (!e.itemData) return;
                    var key = e.itemData.key;
                    if (typeof window._dashApplySubPanel === 'function') {
                        window._dashApplySubPanel(key);
                    }
                    if (key === 'forecastsanomalies' && typeof window.refreshForecastsAnomalies === 'function') {
                        window.refreshForecastsAnomalies();
                    }
                }
            });
            tabsInst.option('selectedItemKeys', [CONTENT_SUBS[0].key]);
        }

        /* Patch dashMainTab for the new panel keys */
        window.dashMainTab = function (tab) {
            var subs     = subsFor(tab);
            var hasSubs  = subs.length > 0;
            var firstSub = hasSubs ? subs[0].key : 'overview';

            /* sidebar active highlight */
            document.querySelectorAll('[data-tab]').forEach(function (el) {
                el.classList.toggle('active', el.getAttribute('data-tab') === tab);
            });

            /* show/hide sub-tab bar and reseed tabs */
            var $bar = $('.dash-subtabs-bar');
            if (hasSubs) {
                $bar.show();
                if (tabsInst) {
                    tabsInst.option({ dataSource: subs });
                    tabsInst.option('selectedItemKeys', [subs[0].key]);
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
