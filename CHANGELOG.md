# Changelog

All notable changes to this project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

Project contact: elsadr@agilebridge.co.za

## [2026-06-22] — Players secondary nav: Overview tab added

### Changed
- Added "Overview" as the first tab in the `.plr-sec-nav` (Inactive / Game coverage / Leave & exclusions) secondary navigation so users can return to the main players screen.
- `playerSection('overview')` shows `plrOverviewContent` and hides all section panels; Overview tab is active by default on load.
- Bumped to `script-dashboard.js?v=72`.

## [2026-06-21] — KPI cards: trend arrow inside pill, primary-colour tint

### Changed
- Trend arrow icon now sits inside the pill badge alongside the value and "vs prior period" text.
- Pill retains `#d8dde8` background / `#1C2333` text (lighter primary tint); not green.
- Down-trend pill remains red (`#fee2e2` / `#dc2626`).
- Bumped to `script-dashboard.js?v=71`, `styles-dashboard.css?v=41`.

## [2026-06-21] — KPI cards: green arrow trend indicator

### Changed
- KPI trend row now shows the `fa-arrow-trend-up` / `fa-arrow-trend-down` icon (was hidden via `display:none`).
- Removed pill badge wrapper from trend text — value and "vs prior period" now render as plain inline text.
- `.ov-kpi-trend` colour changed to `#22c55e` (green); `.ov-kpi-trend.down` colour changed to `#dc2626` (red).
- Bumped to `script-dashboard.js?v=70`, `styles-dashboard.css?v=40`.

## [2026-06-21] — Players overview: search bar right-aligned, spacing fix

### Changed
- Search bar in the Players table card moved to the right side using a flex row wrapper with `justify-content: flex-end`.
- Added `padding: 14px 16px 12px` to the search row for proper spacing inside the card.
- Bumped to `script-dashboard.js?v=69`, `styles-dashboard.css?v=39`.

## [2026-06-21] — Players spotlight cards restyled to match KPI cards

### Changed
- Top-3 player spotlight cards now use the `ov-kpi-card` style (white background, `#1C2333` left accent border, uppercase rank label, bold name as value, dept in grey, points as pill badge) — matching the Summary Overview KPI cards.
- Bumped to `script-dashboard.js?v=64`.

## [2026-06-21] — Period bar: month pills default, calendar toggle for custom range

### Changed
- Month pills now shown by default; date range picker hidden. A small calendar icon button toggles between the two modes — clicking it swaps to the date range picker (button fills `#1C2333`), clicking again returns to pills. Only one control visible at a time, saving significant horizontal space.
- Bumped to `script-dashboard.js?v=68`, `styles-dashboard.css?v=38`.

## [2026-06-21] — Period bar: right-aligned; divider line removed

### Changed
- Period filter bar (date range + month pills) right-aligned with `justify-content: flex-end` — filters sit on the right, tabs on the left, creating a clear navigation vs. filter split.
- Removed `border-top` divider line from sub-tab bar.
- Bumped to `styles-dashboard.css?v=37`.

## [2026-06-21] — Period bar / sub-tab bar: visual separation + pill colour fix

### Changed
- Added a thin `#e5e7eb` border-top and extra top margin to `.dash-subtabs-bar` so the filter zone (date range + month pills) and the navigation zone (segmented tabs) read as distinct areas.
- Month pill (`dxButtonGroup`) text colour overridden from DevExtreme orange/teal to `#4b5563`; selected pill uses `#1C2333` fill with white text; hover uses `#f1f5f9`. Consistent with the rest of the UI.
- Bumped to `styles-dashboard.css?v=36`.

## [2026-06-21] — Players spotlight cards: rank number top-right, larger

### Changed
- Rank number (#1, #2, #3) repositioned to top-right corner of the card using absolute positioning; increased to 22px bold. Player name gets right padding to avoid overlap.
- Bumped to `script-dashboard.js?v=67`.

## [2026-06-21] — Players spotlight cards: larger rank label, spaced name

### Changed
- Rank label (#1, #2, #3) increased from 12px to 15px.
- Player name letter-spacing increased for a more open, readable feel.
- Bumped to `script-dashboard.js?v=66`.

## [2026-06-21] — Departments Overview: reverted to stacked layout

### Changed
- Reverted Departments Overview back to stacked layout (table above, pie chart below) at user request.
- Bumped to `script-dashboard.js?v=65`.

## [2026-06-21] — Background; period bar; Players inner tabs; divider lines removed

### Added
- Players sub-tab (in `index2.html`): secondary underline tab row — Inactive | Game coverage | Leave & exclusions — rendered within the Players panel. Clicking a tab hides the overview and shows the relevant screen. Panels populated by existing render functions (`renderPlayersInactive`, `renderPlayersGamesPlayed`, `renderPlayersLeave`). Not rendered in `index.html` where those screens are accessible via the main segmented sub-tab bar.

### Changed
- Page background unified to `#f8fafc` throughout: updated `--bg` CSS variable, header, period bar, and sub-tab bar backgrounds all changed from `#fff` to `#f8fafc`. White cards stand out on the consistent light background.
- Period filter bar: increased padding, gap and added `align-items: center` wrappers so the date range box and month pills sit at the same vertical midpoint. Date range box given explicit `height: 38px` and `border-radius: 8px`; button group matched to same height.
- Header and period bar horizontal divider lines removed.
- Bumped to `script-dashboard.js?v=62`, `styles-dashboard.css?v=35`.

## [2026-06-21] — Header: Report button removed

### Removed
- "Report" button from the dashboard header top-right. Export button remains.
- Bumped to `script-dashboard.js?v=61`.

## [2026-06-21] — KPI trend pills: primary-colour tint; sub-tab init fix

### Changed
- KPI trend pills (positive) changed from green (`#dcfce7` / `#15803d`) to a light tint of the primary colour (`#d8dde8` background, `#1C2333` text). Down-trend pills remain red.
- Sub-tab widget init: removed conflicting `selectedIndex`/`selectedItemKeys` on construction; now sets `selectedItemKeys` after the instance is created so the first tab reliably shows the active fill on page load.
- Bumped to `script-dashboard.js?v=60`, `styles-dashboard.css?v=33`.

## [2026-06-21] — Sub-tabs: first tab selected on load; chart bars square

### Fixed
- First sub-tab was not visually selected on page load. When `keyExpr` is set on `dxTabs`, selection is driven by `selectedItemKeys`, not `selectedIndex`. Added `selectedItemKeys: [firstKey]` on both widget init and when `dashMainTab` resets sub-tabs.
- Chart bars now have square corners — removed `cornerRadius: 3` from Top Games and Department Activity series.
- Bumped to `script-dashboard.js?v=59`.

## [2026-06-21] — Sub-tabs: active tab tracks click correctly; chart bar labels removed

### Fixed
- Clicking a sub-tab updated the panel content but left the previous tab visually active. Root cause: `onItemClick` was calling `dashSubTab()` which wrote `selectedIndex` back to the `dxTabs` instance, causing DX to re-render and reset its own selection state. Separated panel-switching (`_applySubPanel`) from the programmatic widget update (`dashSubTab`). `onItemClick` now calls `_applySubPanel` only — DX manages its own visual selection on click; `dashSubTab` still updates `selectedIndex` when called programmatically (e.g., from `dashMainTab`).

### Changed
- Removed data labels (count values printed on bars) from Top Games and Department Activity charts — values are already visible on hover tooltip.
- Bumped to `script-dashboard.js?v=57`.

## [2026-06-21] — Sub-tabs: segmented control no longer stretches full width

### Fixed
- DevExtreme's `.dx-tabs` root element defaults to `display: block; width: 100%`, causing the segmented pill group border to span the entire header. Added `display: inline-block; width: auto` override so the group only occupies the space its tabs need.
- Bumped to `styles-dashboard.css?v=32`.

## [2026-06-21] — Segmented tabs; #1C2333 color sweep; nested gamification dropdown; header stats removed

### Added
- Gamification filter controls: replaced separate Department and Player dropdowns with a single `dxDropDownBox` + `dxTreeView` nested dropdown. Departments are expandable nodes; players are leaves. Selecting a department filters to all players in that department; selecting a player sets both filters. "All players" root item and the clear button both reset all filters.

### Changed
- Sub-tab bar restyled to connected segmented-button appearance: `.dx-tabs-wrapper` rendered as a single pill group (`border: 1.5px solid #d1d5db; border-radius: 8px; overflow: hidden`), tabs divided by right-border separators, active tab filled solid `#1C2333` with white text.
- Primary accent color changed to `#1C2333` throughout the dashboard — KPI card left-border accents, Department Activity and Top Games chart bar colors, and Export button background all updated. Green (`#16a34a`) is reserved for success indicators only; red for danger/error only.
- Header stat strip ("17 players · 2.5K plays · 7 dealers") removed from `index.html`. Hidden stub elements retained in `index2.html` for JS compatibility.
- Bumped to `script-dashboard.js?v=56`, `styles-dashboard.css?v=31`.

## [2026-06-21] — Sub-tabs: remove focus/active border box on tabs

### Fixed
- DevExtreme applies a full `border` and `box-shadow` directly on `.dx-state-focused` / `.dx-state-active` tab elements, drawing a visible black rectangle when a tab is clicked. Suppressed `box-shadow`, `outline`, and all non-bottom borders on those states; selected focused tabs keep only the `#2563eb` bottom underline.
- Bumped to `styles-dashboard.css?v=29`.

## [2026-06-21] — Sub-tabs: colour fix + white background; gamification player dropdown

### Fixed
- Sub-tab text colour was being overridden by DevExtreme's inner `.dx-tab-text` span. Added `* { color: inherit !important; font-weight: inherit !important; }` on tab children to force our colour through.
- Active tab colour changed to `#2563eb` (blue-700), weight 600; inactive updated to `#9ca3af`.
- Tab bar underline thickened to 2px, subtle box-shadow added; `margin-bottom: -2px` on tabs so the active underline sits exactly on the bar's border line.

### Changed
- Gamification "Player name" text input replaced with a `dxSelectBox` dropdown. The list populates from the current company's players and is re-filtered whenever the Department dropdown changes. Selecting a player applies the filter immediately; clearing returns to "All players".
- `_gamInitDeptBox` now also resets `_gamNameFilter` when the department changes so the player picker resets to "All players".
- Bumped to `script-dashboard.js?v=54`, `styles-dashboard.css?v=28`.

## [2026-06-21] — Sub-tabs: bold active tab; gamification search removed

### Changed
- Active sub-tab now uses `font-weight: 700` (bold) to match the reference screenshot.
- Search bar removed from Leagues and Play Days gamification controls rows — no gamification tab shows a search input now.
- Bumped to `script-dashboard.js?v=53`, `styles-dashboard.css?v=27`.

## [2026-06-21] — Sub-tabs: mixed-case labels matching screenshot style

### Changed
- Removed `text-transform: uppercase` and `letter-spacing` from sub-tab items — labels now render in their natural mixed-case form (Summary, Players, etc.).
- Increased font-size from 12px to 14px and vertical padding from 8px to 10px for a more comfortable tap target.
- Active tab colour changed to `#3b82f6` (blue-500) with `font-weight: 500`; inactive tabs remain `#94a3b8`.
- Bumped to `styles-dashboard.css?v=26`.

## [2026-06-21] — Sub-tabs: don't stretch to full width; gamification controls in one row

### Changed
- Sub-tab items no longer stretch to fill the full bar width — added `flex: 0 0 auto` so each tab is only as wide as its label.
- Gamification toolbar restructured: Department dropdown, Player name input, period/week/toggle nav, and Search bar are now all in a single flex row (`.gam-controls-row`) for all four sub-tabs (Leagues, Scoreboard, Streaks, Play Days). Export button is pushed to the far right with `margin-left: auto`.
- Replaced three old helper functions (`_gamToolbarHtml`, `_gamPeriodRowHtml`, `_gamSearchBarHtml`) with two new composable ones (`_gamPeriodNavHtml`, `_gamControlsRowHtml`).
- Bumped to `script-dashboard.js?v=52`, `styles-dashboard.css?v=25`.

## [2026-06-21] — Sub-tabs: compact uppercase style matching DevExtreme screenshot

### Changed
- Sub-tab bar tabs now much smaller: font-size 12px (was 14px), vertical padding 8px (was 13px), gap 20px (was 28px).
- Active tab colour changed from dark `#0f172a` to DevExtreme blue `#0ea5e9`; underline indicator matches.
- Tab labels now uppercase with slight letter-spacing to match the DevExtreme native tab look.
- Inactive colour lightened to `#94a3b8` for better contrast against the active blue.
- Bumped to `styles-dashboard.css?v=24`.

## [2026-06-21] — index2.html: Trends section has no sub-tabs

### Changed
- `script-dashboard2.js` (v=2): Trends main-tab now returns an empty sub-tab list; `dashMainTab` hides `.dash-subtabs-bar` entirely when there are no sub-tabs and restores it when switching to any other section. The single `dashSummaryTrends` panel is shown directly — no Summary/Players/Games redundant tabs.
- Bumped to `script-dashboard2.js?v=2` in `index2.html`.

## [2026-06-19] — index2.html: alternative nav layout (preview only)

### Added
- `index2.html` — preview file for an alternative navigation structure where the main Reports sections are **Overview / Trends / Forecasts & anomalies / Gamification** and the sub-tabs within each are **Summary / Players / Games / Departments**.
- `script-dashboard2.js` — small shim (~50 lines) that runs after `script-dashboard.js` and patches only `dashMainTab` + the dxTabs data-source. Does not modify any existing files.
- All existing chart/grid/card render functions reuse the same element IDs so content renders correctly in the new layout.
- No changes to `index.html`, `script-dashboard.js`, or any CSS files.

## [2026-06-19] — Trends: granularity tabs outside chart card, right-aligned

### Changed
- Daily/Weekly/Monthly toggle buttons moved outside the chart card entirely — rendered in a right-aligned row directly above the card so they sit "just above the chart". The chart title "Participation and achievement over time" remains inside the card at the top left.
- Bumped to `script-dashboard.js?v=50`, `styles-dashboard.css?v=22`.

## [2026-06-19] — Period bar: date range box styling fix

### Fixed
- Labels changed from "Start Date"/"End Date" to "From"/"To" (`startDateLabel`/`endDateLabel` options).
- Removed aggressive custom padding overrides that made the widget tall and misaligned; let DX's default `labelMode: 'floating'` + `stylingMode: 'outlined'` produce the compact floating-label look matching the target design.
- Reduced `.dash-period` padding to `6px 24px` for tighter bar height.
- Bumped to `script-dashboard.js?v=51`, `styles-dashboard.css?v=23`.

## [2026-06-19] — Period bar: date range picker + month pills

### Changed
- Replaced "DATA PERIOD" label + `dxSelectBox` dropdown with a `dxDateRangeBox` (From → To) plus six month quick-select pill buttons (Jan–Jun 2026).
- Clicking a month pill calls `dashPeriod()` and highlights the active month; the date range box updates to show that month's date range.
- Changing the date range box attempts to match to a month period; partial/custom ranges default to All Months.
- Removed old `#dashPeriodSelect` CSS; added `.dash-period-months`, `.dash-month-btn`, `.dash-month-btn.active` styles.
- Bumped to `script-dashboard.js?v=48`, `styles-dashboard.css?v=20`.

## [2026-06-18] — Players Overview table: badge truncation + name colour fix

### Fixed
- **"Bronze ..." badge truncation**: DevExtreme's `.dx-datagrid-text-content` applies `overflow: hidden` on cell template containers, clipping the badge. Added `cssClass: 'plr-league-col'` to the LEAGUE column and a CSS rule `.plr-league-col .dx-datagrid-text-content { overflow: visible; }` to prevent clipping. Column width increased from 120 → 130 for additional breathing room.
- **Name colour specificity**: Added `!important` to `.plr-name-link { color: #1d4ed8 }` so DevExtreme's cell-level colour rules cannot override it.
- Bumped to `script-dashboard.js?v=47`, `styles-dashboard.css?v=19`.

## [2026-06-18] — Gamification tab — all 4 sub-tabs complete

### Added
- **Scoreboard sub-tab** (`renderGamificationScoreboard()`): Department + Player name toolbar with Export to Excel right-aligned, period nav row, dxDataGrid with RANK (gray) / PLAYER (blue link) / DEPARTMENT / POINTS / ACCURACY (1 dp) / GAMES PLAYED columns.
- **Streaks sub-tab** (`renderGamificationStreaks()`): shared toolbar, Weekly/Monthly toggle + right-aligned period label, description text, 3 KPI cards (Active streaks / Avg. current / Avg. longest), Department averages card, dxDataGrid with PLAYER / DEPARTMENT / CURRENT STREAK / LONGEST STREAK / ACTIVE DAYS / GAMES COMPLETED. `window.gamStreakGran()` toggles granularity.
- **Play days sub-tab** (`renderGamificationPlayDays()`): shared toolbar, week arrow navigator (< | Week: date range | >) with right-aligned threshold label, custom search bar, HTML table with PLAYER / DEPARTMENT / DAYS PLAYED / MET THRESH... / MON–SAT columns (blue checkmarks via `.gam-check`). `window.gamWeekOlder/gamWeekNewer()` navigate week index.
- New CSS: `.gam-player-name-input`, `.gam-period-row`, `.gam-toggle-row/group/btn`, `.gam-streak-period-lbl`, `.gam-streak-desc`, `.gam-streak-kpi-row/card/lbl/val`, `.gam-dept-avg-card/title/row/right`, `.gam-week-nav-row/left/btn/label`, `.gam-threshold-lbl`, `.gam-pdy-table`, `.gam-check`.

### Changed
- **Leagues sub-tab**: export button moved to right of toolbar (not in left group); period nav moved to its own `.gam-period-row` below toolbar; search upgraded to `.plr-search-bar` style (matching Players Overview); badges changed from solid `.league-X` to outline `.plr-league-X` classes; player names now plain text (not `.gam-player-link` span).
- `_gamLeagueTier()`: thresholds updated to Diamond ≥ 20 000 / Gold ≥ 5 000 / Silver ≥ 2 000, returns `.plr-league-X` classes.
- `_applyGamFilter()`: now reads `row.cells[0].textContent` directly instead of `.gam-player-link` selector.
- `gamPeriodOlder/Newer`: now re-render both Leagues and Scoreboard.
- `refreshAll()`: now calls `renderGamificationScoreboard()`, `renderGamificationStreaks()`, `renderGamificationPlayDays()`.
- `index.html` gamification sub-panels: placeholders removed, IDs added (`dashGamScoreboard`, `dashGamStreaks`, `dashGamPlayDays`).
- Bumped to `script-dashboard.js?v=46`, `styles-dashboard.css?v=18`.

## [2026-06-18] — Players Overview table styling

### Changed
- **League badge style**: Players table now uses outline pill badges (`.plr-league-badge`) — border + text colour only, no fill — matching dev site. Classes: `.plr-league-diamond` (teal), `.plr-league-gold` (amber), `.plr-league-silver` (gray), `.plr-league-bronze` (brown).
- **`getLeague` thresholds** aligned to dev site: Diamond ≥ 20 000 XP, Gold ≥ 5 000, Silver ≥ 2 000, Bronze < 2 000.
- **Player name**: rendered in blue (`.plr-name-link`) via `cellTemplate`.
- **Search bar**: replaced DX built-in `searchPanel` with a custom styled input + teal icon button (`.plr-search-bar`). DX `searchPanel` kept hidden for programmatic filtering via `window.plrSearch`.
- **SCORE column**: now shows `x.x%` (deterministic score metric, float with 1 decimal), distinct from PASS RATE.
- **LAST PLAY column**: now shows actual dates (e.g. "02 Jun 2026") computed deterministically from player name and session count.
- **Action column**: ⋮ dots button added as last column.
- Bumped to `script-dashboard.js?v=45`, `styles-dashboard.css?v=17`.

## [2026-06-18] — Trends panel: correct chart headings and series

### Changed
- **All Trends tabs** (Summary, Players, Games, Departments): main chart retitled to "Participation and achievement over time"; series renamed "Participation" (dark, participation %) and "Achievement" (green, accuracy %). Small chart order changed to "Sessions" (plays) + "Active players" (player count). Bumped to `script-dashboard.js?v=44`.

## [2026-06-18] — Gamification tab — Leagues

### Added
- **Gamification** added as a 5th main tab (sidebar sub-item + `MAIN_TABS` entry + `dashGamification` panel in `index.html`).
- `getSubTabItems` extended: Gamification returns Leagues / Scoreboard / Streaks / Play days; Scoreboard/Streaks/Play days show "Coming soon" placeholder.
- **Leagues sub-tab** (`renderGamificationLeagues()`): Department dxSelectBox filter, Player name input, Export to Excel button, period navigator (< Older | June 2026 | Newer >), Search input, table (PLAYER / DEPARTMENT / LEAGUE badge / SEASON XP). XP scaled from player `points × 5`, period-adjusted via play-ratio vs All Months. Rows hide/show on filter changes without full re-render.
- League badge pills: Diamond (teal `#0d9488` ≥ 15000 XP), Gold (amber ≥ 5000), Silver (gray ≥ 2000), Bronze (brown < 2000).
- CSS: `.gam-leagues-container`, `.gam-toolbar`, `.gam-period-nav`, `.gam-period-label`, `.gam-period-btn`, `.gam-search-input`, `.gam-text-input`, `.gam-export-btn`, `.gam-table`, `.gam-player-link`, `.gam-xp`, `.league-badge`, `.league-diamond`, `.league-gold`, `.league-silver`, `.league-bronze`.
- `dashMainTab()` now activates the first sub-tab by key (not hardcoded `overview`) so Gamification correctly opens Leagues by default.

### Changed
- Bumped to `script-dashboard.js?v=43`, `styles-dashboard.css?v=16`.

## [2026-06-18] — Games Overview redesign + topic collapsible rows

### Added
- **`GAME_TOPICS`** data: groups BASE_GAMES into 9 topics (Sales Objections, Emotional Intelligence, Customer Service, Compliance, Digital Skills, Leadership, Financial Products, Product Knowledge, No topic).
- **Games Overview** fully rewritten: collapsible topic-group rows (chevron, topic name, count) that expand to show a table (GAME / ASSIGNED / ATTEMPTED / COMPLETION % / AVG. ACCURACY / AVG. PLAY TIME); "Top 10 games by completion rate" horizontal bar chart below.
- `fmtGamePlayTime(ptMult)` helper for 0h:mm:ss formatted play-time.
- CSS: `.gtopic-list`, `.gtopic-row`, `.gtopic-chevron`, `.gtopic-name`, `.gtopic-count`, `.gtopic-body`.
- Bumped to `script-dashboard.js?v=41`, `styles-dashboard.css?v=15`.

## [2026-06-18] — Departments Forecasts & anomalies tab

### Added
- **Departments > Forecasts & anomalies** tab implemented: "Forecasts" section with "Participation rate forecast" card listing each department with its projected next-period participation %; "Anomalies" section with "Underperforming departments" card (departments > 15% below company average, or "No underperforming departments in this period").
- `dashDeptForecastAnomalies` div added to departments panel replacing old separate `forecast`/`anomalies` divs.

### Changed
- Bumped to `script-dashboard.js?v=40`.

## [2026-06-18] — Departments Overview redesign + Players KPI removed + sidebar nav + gridlines

### Added
- **Departments > Overview** redesigned to match dev site: search box, full-width table (DEPARTMENT / TOTAL USERS / ACTIVE PLAYERS / PARTICIPATION / SESSIONS / AVG. POINTS / ACTIVITY RATE with dot+bar), full-width solid pie chart below.
- **Reports sub-navigation in sidebar**: Summary / Players / Games / Departments are now sub-items under "Reports" in the main sidebar (using existing `.nav-group` / `.nav-sub-item` pattern). Clicking a sub-item calls `dashMainTab()` and syncs the active highlight. `toggleReportsNav()` collapses/expands the group.

### Changed
- **Players > Overview KPI cards removed**: "Active players", "Avg. pass rate", "Dealers", "Inactive" cards removed to match dev site (no KPI row).
- **Dashboard left-nav column removed** from layout; Reports sub-nav in sidebar replaces it.
- Bumped to `script-dashboard.js?v=39`.

## [2026-06-18] — Charts: horizontal gridlines only

### Changed
- All dxChart instances now show horizontal gridlines only: `argumentAxis.grid` hidden on non-rotated charts; `valueAxis.grid` hidden on rotated bar charts. Affects area sparklines, Summary/Games bar charts, all Trends spline charts, Forecast chart, Games accuracy chart, Players dept chart, Regional chart.
- Bumped to `script-dashboard.js?v=38`.

## [2026-06-18] — Trends redesign + Leave & exclusions tab

### Added
- **Shared `renderTrendsPanel(elId, gran, setGranFn)`** function: renders the standard trends layout (Daily/Weekly/Monthly granularity toggle, combined dual-series spline chart "Active players and participation over time", two smaller spline charts "Active players" / "Participation rate") used by all Trends sub-tabs.
- **`_gamesTrendsGran`**, **`_deptTrendsGran`** state vars + **`window.setGamesTrendsGran`** / **`window.setDeptTrendsGran`** so Games and Departments Trends panels each have independent granularity toggles.
- **Players > Leave & exclusions** tab fully implemented: "Leave" section with "Record leave" form (Player dxSelectBox, Start/End date inputs, Reason field, Add leave button) + search + table (NAME / DEPARTMENT / START DATE / END DATE / REASON); "Exclusions" section with search + table (NAME / REASON / EXCLUDED SINCE). Both tables start empty ("No records found.").
- CSS: `.lve-heading`, `.lve-subtext`, `.lve-form-card`, `.lve-form-row`, `.lve-daterange`, `.lve-date-wrap`, `.lve-date-lbl`, `.lve-date-input`, `.lve-text-input`, `.lve-add-btn`, `.lve-search-row`, `.lve-search-input`, `.lve-search-btn`.

### Changed
- `renderSummaryTrends()`, `renderPlayersTrends()`, `renderTrendsCharts()` all replaced with one-liner calls to `renderTrendsPanel()` — unified look across Summary, Players, Games, Departments Trends tabs.
- Participation rate series colour updated to `#22c55e` (green), Active players to `#1e293b` (dark navy), both spline type with dot markers.
- Bumped to `script-dashboard.js?v=37`, `styles-dashboard.css?v=14`.

## [2026-06-18] — Players: Inactive tab + Game coverage redesign

### Added
- **Players > Inactive** tab fully implemented: KPI card ("Inactive players"), "Days inactive (threshold)" number input (default 30), search box, and a four-column table (NAME, DEPARTMENT, LAST PLAYED, DAYS INACTIVE). Threshold is live-filtered — changing it re-computes the count instantly.
- **`INACTIVE_PLAYERS`** data restructured to `{ name, dept, lastPlayed, daysInactive }` format with entries for companies 5, 6, 7. Players with `lastPlayed: null` always show (never played).
- **Players > Game coverage** tab completely rewritten to match dev site:
  - "By game" / "By player" underline sub-tabs
  - KPI card: "Game coverage X%"
  - dxChart spline line chart: "Game coverage over time" (31-day daily data)
  - Scrollable game card list per game: game name, avg. accuracy, coverage %, colour-coded progress bar (amber ≥ 50%, red > 0%, gray 0%), player count
- **`GAME_COVERAGE`** data for company 7 (17 games with players and avgAcc values).
- **`getGameCoverageDaily()`** deterministic daily coverage data generator (May 18 – Jun 17).
- **`.plr-rank-card`** and related CSS classes (`.plr-rank-label`, `.plr-rank-name`, `.plr-rank-dept`, `.plr-rank-pts`) for spotlight card vertical layout.
- **`.gc-sub-tabs`**, **`.gc-sub-btn`**, **`.gc-game-card`** and related CSS for game coverage cards.
- **Game coverage "By player" view**: 4 KPI cards (Games this period, Full coverage, Incomplete, Avg. coverage), "Games loaded (N)" link, search input, Department dxSelectBox filter, "Incomplete only" and "Group by department" checkboxes, Export button, and player rows sorted by games played desc — each row shows player name, X/total count, colour-coded progress bar (amber ≥ 50%, red > 0%, gray 0%), "N missing" link, coverage %, department.
- **`.gc-kpi-row`**, **`.gc-filter-bar`**, **`.gc-filter-check`**, **`.gc-player-row`** and related CSS for player coverage rows.

### Changed
- dxDataGrid (Players > Overview) column widths increased: SESSIONS 90→110px, LEAGUE 100→130px, LAST PLAY 130→150px — prevents header/badge truncation.
- Bumped to `script-dashboard.js?v=36`, `styles-dashboard.css?v=13`.

## [2026-06-18] — Fix: Forecasts & anomalies tab blank

### Fixed
- `dashSubTab()` had a leftover special-case for `forecastsanomalies` that toggled the old separate `data-sub="forecast"` / `data-sub="anomalies"` panels (since removed). Removed the branch; all sub-tab keys now use the standard toggle path. Bumped to `?v=35`.

## [2026-06-17] — Forecasts & anomalies combined tab

### Added
- **`renderForecastsAnomaliesPanel()`** shared helper: builds a "Forecasts" section (Participation forecast card with projected participation rate and avg. accuracy) + "Anomalies" section (list of daily dates with red drop-percentage rows, matching dev site style).
- **`renderSummaryForecastsAnomalies()`** and **`renderPlayersForecastsAnomalies()`** wired to `dashSummaryForecastAnomalies` and `dashPlayersForecastAnomalies` panel IDs.
- CSS: `.fc-section-title`, `.fc-card`, `.fc-metrics-row / .fc-metric-*`, `.fc-anomaly-list / .fc-anomaly-row / .fc-anomaly-date / .fc-anomaly-pct`, `.fc-no-anomalies`.

### Changed
- Summary HTML: replaced separate `data-sub="forecast"` + `data-sub="anomalies"` panels with single `data-sub="forecastsanomalies"` panel.
- Players HTML: `data-sub="forecastsanomalies"` placeholder upgraded to real panel with id.
- Bumped `script-dashboard.js` to `?v=34`, `styles-dashboard.css` to `?v=12`.

## [2026-06-17] — Chart bars: remove corner radius

### Changed
- All dashboard bar chart series now use `cornerRadius: 0` (straight corners) across every chart in `script-dashboard.js`. Bumped to `?v=33`.

## [2026-06-17] — Players > Overview & Trends redesign

### Changed
- **Players sub-tabs**: Updated from 4 items (Overview / Games Played / Trends / Forecasts & anomalies) to 6 matching dev site: Overview | Trends | Forecasts & anomalies | Inactive | Game coverage | Leave & exclusions.
- **Players > Overview** rewritten to match dev site layout:
  - Top 3 spotlight rank cards with gold/silver/bronze border & background styling.
  - "Participation by dealer" bar chart (dark navy) and "Active players by department" horizontal bar chart side-by-side.
  - Player performance `dxDataGrid` replacing plain HTML table; columns: NAME, DEPARTMENT, PASS RATE, SCORE, SESSIONS, XP, LEAGUE (coloured badge), LAST PLAY.
- **Players > Trends** rewritten with granularity toggle (Daily / Weekly / Monthly) and three charts: combined Active players + Participation rate line chart; two smaller area charts below.

### Added
- Helper functions: `getLeague(xp)`, `getPlayerLastPlay(sessions)`, `devSpotlightCard(rank, name, dept, xp)`.
- `window.setPlayerTrendsGran` for granularity toggle click handler.
- CSS: `.plr-charts-row` (2-col chart grid), `.plr-gran-row / .plr-gran-btn` (granularity toggle), `.league-badge` + `.bronze / .silver / .gold / .diamond` variants.
- Bumped `script-dashboard.js` to `?v=32`, `styles-dashboard.css` to `?v=11`.

## [2026-06-17] — Dev-site visual redesign; DevExtreme nav/tabs

### Changed
- **Layout**: Replaced horizontal pill nav + floating sub-menu with a two-column grid: 200 px left vertical tab list (Summary / Players / Games / Departments) + right content area with horizontal underline sub-tab bar.
- **Header**: Background changed from dark navy to white; title enlarged to 24 px; stat pills now use dark-on-white colour scheme.
- **Period bar**: Now white background (was dark navy).
- **Sub-tab bar**: Implemented as a DevExtreme `dxTabs` component with underline styling matching the dev site; updates its item list when main tab changes (adds "Games Played" under Players).
- **KPI cards**: Redesigned to clean white cards — gray label, large bold number (42 px), green trend line. Removed coloured icon circles and gradient "featured" card.
- **Charts**: Department Activity and Top Games bars changed to dark navy (`#1e293b`) matching dev site; Department Activity series simplified to "Sessions".
- **Header buttons** (Report / Export): Replaced plain `<button>` elements with DevExtreme `dxButton` instances.
- Bumped `script-dashboard.js` to `?v=31`, `styles-dashboard.css` to `?v=10`.

## [2026-06-17] — Leave & Exclusions; context heading; combined pill nav

### Added
- **Leave & Exclusions** sub-menu entry (icon: `fa-user-clock`) added to the floating sub-menu for all main tabs; placeholder "Coming soon" panel wired up.
- **Context heading** (`Summary › Trends` style) shown above the content area; updates whenever main tab or sub-tab changes.

### Changed
- Main tab pills (Summary / Players / Games / Departments) are now split-buttons: clicking the label switches the tab (Overview), clicking the chevron opens a floating sub-menu. The separate sub-tab row is removed entirely.
- Forecast and Anomalies merged into a single "Forecasts & Anomalies" sub-menu entry; activates both panels stacked.
- Bumped `script-dashboard.js` to `?v=30`, `styles-dashboard.css` to `?v=9`.

## [2026-06-16] — Combined Trends view + Summary Trends layout + spotlight name weight

### Reverted
- Trends shared-routing reverted — Players/Games/Departments each keep their own Trends panel again.

### Changed
- Summary > Trends: moved Accuracy Trend to top-right (next to Player Growth) to mirror Players > Trends layout (gray area left, blue area right).
- Summary > Trends: bottom chart changed from Accuracy area to a bar chart (Monthly Plays, `#334155`) — same visual style as Combined Engagement on other tabs.
- Players > Overview spotlight cards: player name `font-weight` 400 → 500 (slightly bolder). Bumped `script-dashboard.js` to `?v=25`.

## [2026-06-16] — Games & Departments Anomalies implemented

### Added
- `renderGamesAnomalies()` — checks: low accuracy games (<60%), zero-play games, play volume drop. Uses same `anomalyCard` + `anomalySevRow` pattern.
- `renderDeptAnomalies()` — checks: departments with zero active players, departments with participation <50%, play volume drop.
- `id="dashGamesAnomalies"` and `id="dashDeptAnomalies"` added to `index.html`.
- Both called during init. Bumped `script-dashboard.js` to `?v=23`.

## [2026-06-16] — Chart colour fixes + Regional tab hidden

### Changed
- Regional nav tab hidden (`hidden` attribute) until content is ready.
- Summary Trends Monthly Plays chart: `#334155` → `#1e3a5f` so it matches Player Growth and the other tabs.
- Games Overview "Answer Accuracy by Game" bar chart: `#2563eb` bright blue → `#1e3a5f` dark navy to match other bar charts. Bumped `script-dashboard.js` to `?v=22`.

## [2026-06-16] — Games Overview: revert table/chart to stacked layout

### Changed
- Game Performance table and Answer Accuracy chart reverted from side-by-side grid to stacked vertically (table full-width, chart full-width below). KPI cards at top retained. Bumped `script-dashboard.js` to `?v=21`.

## [2026-06-16] — Summary > Trends: navy colour palette

### Changed
- Player Growth area chart: red → `#1e3a5f` dark navy.
- Monthly Plays area chart: blue → `#334155` slate-navy.
- Accuracy Trend area chart: blue → `#2563eb` (already consistent with other tabs).
- All four trends sections (Summary, Players, Games, Departments) now share the same navy palette. Bumped `script-dashboard.js` to `?v=20`.

## [2026-06-16] — Players > Anomalies + severity count row

### Added
- `renderPlayersAnomalies()` — same `anomalyCard` pattern as Summary, with player-specific checks: inactive players, low accuracy (<65%), play volume drop.
- `anomalySevRow(cards)` helper builds the High / Medium / Low severity count row shown above the anomaly list in both Summary and Players > Anomalies.
- `id="dashPlayersAnomalies"` added to the Players anomalies panel in `index.html`.
- `renderPlayersAnomalies()` called during init alongside the other Players renders.

## [2026-06-16] — Games Overview: table and chart side by side

### Changed
- Game Performance table and Answer Accuracy by Game chart now sit in a 1fr/1fr grid side by side instead of stacked vertically.
- KPI cards at the top now use `ovKpiCard()` (matching other overview tabs) instead of the old `metricCard` + sidebar layout.
- Bumped `script-dashboard.js` to `?v=19`.

## [2026-06-16] — Trends charts: navy colour palette

### Changed
- Player Activity area chart: `rgb(229,62,62)` red → `#1e3a5f` dark navy.
- Accuracy Trend area chart: `rgb(49,130,206)` blue → `#2563eb` company blue.
- Combined Engagement bar chart: `#e53e3e` red → `#334155` slate-navy.
- Applies to Players, Games, and Departments Trends tabs (all use `renderTrendsCharts`). Bumped `script-dashboard.js` to `?v=18`.

## [2026-06-16] — Players Overview: row gap + spotlight card styling

### Fixed
- Added `margin-bottom: 16px` to the KPI row so there is visible spacing between the KPI cards and the spotlight leaderboard row.
- Spotlight cards reverted to plain white `ov-kpi-card` style (no tinted background, no coloured border/shadow) to match the KPI cards above. Bumped `script-dashboard.js` to `?v=17`.

## [2026-06-16] — Game-a-Day: filter bar + horizontal scroll table

### Added
- Filter bar above the Game-a-Day table: search input (player/dealer), "All departments" dropdown, "Non-compliant only" toggle, player count, Download button.
- Table uses `overflow-x: auto` with `width: max-content` so it scrolls horizontally for 12 weeks of data.
- Player name column is sticky (left:0) so it stays visible while scrolling.
- Filters update only the table body without re-rendering the full view (no lost focus on search).
- Bumped `script-dashboard.js` to `?v=16`.

## [2026-06-16] — Players spotlight cards: consistent spacing and visible border/shadow

### Fixed
- `.player-spotlight-row` gap changed 14px → 16px to match `.ov-kpi-row` (equal horizontal spacing).
- Spotlight cards now carry an inline `border-color` and `box-shadow` derived from the rank colour at ~25% / ~13% opacity respectively, so the shadow remains visible against the tinted background. Bumped `styles-dashboard.css?v=6`, `script-dashboard.js?v=15`.

## [2026-06-16] — Players > Games Played: Game-a-Day view implemented

### Added
- `renderGadView()` builds the full Game-a-Day section: 5 KPI cards (Participation, On Track, Below Target, Working Days, Avg games/day), and a horizontally-scrollable 12-week compliance table (WK1–WK12) with colour-coded cells — green (5/5), amber (1–4/5), red (0/5).
- "Non-compliant only" toggle filters the table to players with at least one zero-play week.
- Synthetic week data generated deterministically per player using their `played` score as a compliance proxy.
- `_gadNcOnly` state variable; `window.gadToggleNc` handler.

## [2026-06-16] — Players spotlight cards: name not bold; rank-tinted card background

### Changed
- Top-3 spotlight cards: player name `font-weight` changed from 800 → 400 (not bold).
- Card background now uses the rank colour at ~9% opacity (e.g. gold `#d9770618`) so each card has a subtle tint matching its badge.
- Bumped `script-dashboard.js` to `?v=14`.

## [2026-06-16] — Players spotlight cards: match ov-kpi-card layout

### Fixed
- Top-3 leaderboard cards now use the identical HTML structure as `ovKpiCard()` — icon absolutely positioned top-right, rank label → name (value) → dept → pts flowing below. Previously used an inline flex layout that didn't match. Bumped `script-dashboard.js` to `?v=12`.

## [2026-06-16] — KPI cards: coloured icon backgrounds restored

### Fixed
- `ovKpiCard()` was hardcoding `#1e293b` (dark navy) for every icon background and ignoring the `iconColor` parameter entirely. Fixed to use `iconColor` as the icon tint and `iconColor + '20'` (8-digit hex alpha, ~12% opacity) as the pastel background — matching the original metric-card pink/teal/blue/amber style. Bumped `script-dashboard.js` to `?v=11`.

## [2026-06-16] — Summary Overview: KPI cards align to chart columns

### Changed
- `ov-kpi-row` changed from `2fr 1fr 1fr 1fr` to `1fr 1fr 1fr 1fr` — all four KPI cards are now equal width, so cards 1+2 span exactly the same total width as the left chart and cards 3+4 span the right chart (same gap arithmetic). Bumped `styles-dashboard.css` to `?v=5`.

## [2026-06-16] — Sub-tab row: transparent background

### Changed
- `.dash-sub` background changed from `#fff` to `transparent` so the sub-tab row blends with the page background instead of showing a white band.

## [2026-06-16] — Players > Overview: cards match Summary Overview styling

### Changed
- KPI row (Active Players, Avg Accuracy, Dealers, Inactive) now uses `ovKpiCard()` — same white card with coloured icon as Summary > Overview.
- Top-3 spotlight leaderboard cards restyled to `ov-kpi-card` layout: rank label, player name as headline value in rank colour, dept as subtitle, points below, rank number badge as the icon block.
- Bumped `script-dashboard.js` to `?v=10` and `styles-dashboard.css` to `?v=4`.

## [2026-06-14] — Navigation: tiered hierarchy with pill + underline treatment

### Changed
- Primary nav tabs (Summary, Players, etc.) now use a solid filled pill for the active state on a slate-100 background — communicates top-level hierarchy.
- Sub-tabs (Overview, Trends, etc.) retain the lighter underline-only active indicator on a white background — communicates child level.
- Inactive primary tabs: ghost/transparent; inactive sub-tabs: muted grey (#94a3b8), smaller font (12px).

## [2026-06-14] — Summary > Trends: real dates on chart x-axis

### Changed
- Daily view now shows actual calendar dates (e.g. "May 17", "Jun 13") for the last 30 days instead of "D01…D30".
- Weekly view now shows the Monday start-date of each week (e.g. "Jan 12", "Jan 19") instead of "2026-01/W1".

## [2026-06-14] — Summary > Trends: Accuracy Trend moved to full-width bottom row

### Changed
- Trends layout changed from 3-equal-column to 2-column top (Player Growth + Plays) with Accuracy Trend spanning full width below.

## [2026-06-14] — Summary > Trends: Daily / Weekly / Monthly granularity toggle

### Added
- Segmented toggle (Daily / Weekly / Monthly) at the top-right of the Trends charts.
- Switching granularity re-renders all three charts with the appropriate data density.
- Chart title updates to match granularity (e.g. "Weekly Plays", "Daily Plays").

## [2026-06-14] — Players > Games Played: Content Coverage / Game-a-Day toggle

### Added
- "Content Coverage" and "Game-a-Day" view-toggle buttons at the top of the Games Played sub-tab.
- Active view highlights in the company chrome colour; Game-a-Day shows a "coming soon" placeholder.

## [2026-06-14] — Summary > Forecast: remove KPI cards

### Changed
- Removed the 4 projected KPI cards (Projected Players, Projected Plays, Projected Accuracy, Play Growth) from Summary > Forecast — page now shows only the Play Volume Forecast chart full-width.

## [2026-06-14] — Players > Games Played: compact games-loaded row

### Changed
- Replaced the sprawling chip list under "Games loaded" with a compact badge showing the count (`17 games`) and a "show games / hide games" toggle that expands the chip list on demand.

## [2026-06-14] — Summary > Trends: remove KPI cards

### Changed
- Removed the 4 MoM KPI cards from Summary > Trends — page now shows only the 3 trend charts (Player Growth, Monthly Plays, Accuracy Trend).

## [2026-06-14] — Summary > Anomalies: expandable detail rows

### Changed
- Anomaly cards are now collapsed by default; click "Show details (N rows)" to expand the detail table.
- Inactive-players card expands a Name / Email / Dealer table from `INACTIVE_PLAYERS` data.
- Zero-active-departments card expands a Department / Enrolled / Active table.
- Added `toggleAnomalyDetail()` global handler and `.anomaly-toggle` / `.anomaly-table` CSS.

## [2026-06-14] — Regional: add sub-tab navigation

### Added
- Regional tab now shows Overview, Trends, Forecast, Anomalies sub-tabs (same pattern as other main tabs).

## [2026-06-14] — Fix: Games Played sub-tab visible on wrong tabs

### Fixed
- `Games Played` sub-tab was appearing on all tabs (Summary, Games, Departments) because `.dash-sub-tab { display: inline-flex }` in CSS was overriding the HTML `hidden` attribute. Added `.dash-sub-tab[hidden] { display: none !important }` to enforce it.

## [2026-06-14] — Overview: Department Activity chart shows dealer groups

### Changed
- `Department Activity` chart now groups individual dealer sub-departments (e.g. all "BB Gezina Nissan - *" entries) into a single bar per dealer brand, matching the live site.
- Added `getDealerGroups(companyId)` helper function.
- Added `BB Gezina Nissan - Parts` (3 players, 0 active) and `Citton Cars` (2 players, 0 active) to `COMPANY_DEALERS[7]`.
- Updated `Automotive Sales Excellence` to 3 total players (3 active).

## [2026-06-14] — Players: Games Played sub-tab

### Added
- "Games Played" sub-tab under Players — only visible when the Players main tab is active.
- `PLAYER_COVERAGE` data for company 7: 22 players (17 active + 5 inactive) with game completion counts.
- 4 KPI cards: Games This Period, Full Coverage, Incomplete, Avg Coverage.
- "Games loaded" chip row listing all BASE_GAMES.
- Filter bar: live search, "Incomplete only" toggle, player count, Download button.
- Player list with colored progress bars (green/orange/gray), X/17 count, % and missing count.
- `gpRenderList`, `gpApplyFilter`, `gpToggleIncomplete` helpers wired to inline handlers.

## [2026-06-14] — Summary Trends tab: MoM cards + 3-column chart grid

### Changed
- Added 4 metric cards at the top of Trends: Players This Month, Plays This Month, Accuracy This Month (each with MoM delta and %) and Peak Month.
- Moved all 3 trend charts (Player Growth, Monthly Plays, Accuracy Trend) into an equal 3-column grid below the cards.

## [2026-06-14] — Summary Forecast tab: 2×2 cards + chart layout

### Changed
- Forecast tab now shows 4 KPI projection cards (Projected Players, Projected Plays, Projected Accuracy, Play Growth) in a 2×2 grid on the left, with the Play Volume Forecast chart filling the right column.
- Added "Today" dashed constant line and Actual/Forecast legend to the chart.

## [2026-06-14] — Departments: modernise Active Players pie chart

### Changed
- Converted "Active Players by Department" from a flat pie to a doughnut chart with `innerRadius: 0.62`.
- Updated color palette to a modern indigo/cyan/teal/orange/purple/pink set.
- Added white 2px segment borders for clean separation.
- Center of donut shows total active player count overlaid via absolute-positioned div.
- Tooltip styled with dark background, rounded corners, and percentage breakdown.

## [2026-06-14] — Players tab: Participation by Dealer and Inactive Players side by side

### Changed
- "Participation by Dealer" and "Inactive Players" cards now sit in a 50/50 grid side by side instead of stacking vertically.

## [2026-06-14] — Games tab: Answer Accuracy by Game chart; Players tab: fix Inactive Players visibility

### Added
- `renderGamesOverview`: horizontal DevExtreme bar chart "Answer Accuracy by Game" added below the Game Performance table, showing accuracy % per game with blue bars.

### Fixed
- Inactive Players section under Players > Overview now falls back to the default company (Naspers) data when the current company has no specific inactive-player records defined, so the section always renders.

## [2026-06-14] — Dark content area follows company theme

### Changed
- `.dash-sub` (sub-tab bar) background now uses `var(--chrome-dark)` with white-tinted tab text so it stays readable on dark.
- `.dash-body` (content area) background now uses `var(--chrome-dark)` — white cards float on the company-branded dark background and update when switching companies.

## [2026-06-14] — Company-branded chrome colours

### Added
- `COMPANY_THEMES` map in `script-dashboard.js` — a `{bg, dark}` colour pair for each company.
- `applyCompanyTheme(id)` updates CSS variables `--chrome-bg` / `--chrome-dark` on `:root` immediately when the company scope changes (and on page load).

### Changed
- Sidebar background now uses `linear-gradient(var(--chrome-bg), var(--chrome-dark))` instead of hardcoded values.
- `.dash-hd` and `.dash-period` now use `var(--chrome-bg)`; `.dash-nav` uses `var(--chrome-dark)` — matching the sidebar gradient and updating with company changes.
- Added `--chrome-bg` and `--chrome-dark` CSS variables to `:root` in `styles.css` with Naspers defaults.

## [2026-06-14] — Participation Rate card: add progress bar and legend

### Changed
- Featured KPI card now shows all live-site data: participation % value, "N active of N registered players" sub-text, white progress bar showing the rate, and a dot legend for registered / active / inactive counts.

## [2026-06-14] — Add Top Games by Plays chart to Overview

### Changed
- Replaced Active Players list in the middle row with a "Top Games by Plays" horizontal bar chart (top 8 games, red bars, matching live GameOn site layout).

## [2026-06-14] — Players tab: Participation by Dealer + Inactive Players

### Added
- `INACTIVE_PLAYERS` data map (company 7 seeded with 5 real inactive players: name, surname, email, dealer).
- `COMPANY_DEALERS[7]` updated with `total`/`active` counts per dealer + "BB Gezina Nissan - Parts Manager" (0 active).
- "Participation by Dealer" section below Full Player Rankings — progress bar per dealer with %, active/total count, Export CSV placeholder.
- "Inactive Players (N)" section below Participation by Dealer — table with Name, Surname, Email, Dealer columns.

### Changed
- Main nav tab bar (`dash-nav`): white background, gray text, navy active underline (matching sub-tab bar style).

## [2026-06-14] — Remove duplicate bottom stat cards from Overview

### Removed
- Bottom row of AVG ACCURACY / INACTIVE / GAMES AVAILABLE stat cards — these metrics are already shown in the top KPI row.

## [2026-06-14] — Remove donut chart from Overview bottom row

### Changed
- Removed "Participation Rate" donut chart + legend from the bottom row (data already shown in featured KPI card at top).
- Bottom row is now three equal full-width stat cards (AVG ACCURACY, INACTIVE, GAMES AVAILABLE) in a clean `ov-stat-row` grid.
- Mini stat cards: padding increased, `min-height: 110px`, value font bumped to 32px so they read as proper cards not micro widgets.

## [2026-06-14] — Fix inspo-image label bleed-through

### Changed
- Renamed "Project Progress" → "Participation Rate" (inspo label, not from GameOn).
- Renamed "Team Collaboration" → "Active Players" (inspo label, not from GameOn).

## [2026-06-14] — Dashboard visual polish: inspo image style

### Changed
- Unhid Incentives, Prizes, AI Analysis nav tabs so all 8 main tabs are visible (matching live GameOn site).
- Fixed initial "2.3K" plays display to "2.5K" in header HTML (JS was already correct).
- Sidebar active nav item colour: `#456eab` → `#2563eb` (vivid blue pill, matching inspo image).
- Overview KPI card icon badges: non-featured cards now use dark navy (`#1e293b`) square badge with white icon instead of coloured light badges.
- Overview mini stat card icons: same dark navy square treatment; icons repositioned to `top-right` absolute (matching inspo image layout).
- Department Activity chart bars: colour changed from red/blue → dark navy (`#1e3a5f`) / sky blue (`#93c5fd`); `cornerRadius` raised from 3 → 8 for pill/capsule bar shape matching inspo image.

## [2026-06-12] — Dashboard Overview: GameOn content + inspiration design

### Changed
- Overview panel rebuilt to match GameOn live dashboard content (PARTICIPATION RATE, AVG ACCURACY, INACTIVE, GAMES AVAILABLE) with inspiration image visual style.
- PARTICIPATION RATE card: featured blue gradient (`#2563eb→#1d4ed8`), shows rate %, active/registered counts, progress bar, legend.
- AVG ACCURACY, INACTIVE, GAMES AVAILABLE: white cards with coloured circular icon badges (green bullseye, amber warning, blue gamepad).
- Chart section: Department Activity (grouped red/blue horizontal bars — Total Players vs Active) + Top Games by Plays (red horizontal bars).
- Period dropdown text/icon changed to navy for legibility on white background.

## [2026-06-12] — Dashboard Overview redesign

### Changed
- **Summary > Overview** completely redesigned to match target mockup:
  - 4 KPI cards: first card is featured (blue gradient fill, white text); others white with coloured icon badge (top-right corner). Cards: Total Players, Games Played, Avg Accuracy, Dealers.
  - Middle row: "Project Analytics" grouped bar chart (Active vs Total per department, navy/light-blue paired bars) alongside "Team Collaboration" list (avatar, name, dept, Active/Inactive status pill).
  - Bottom row: "Project Progress" donut/ring chart (participation %, centre label) with legend; three mini stat cards beside it (Avg Accuracy, Inactive, Games Available) each with coloured icon badge.
- Removed old KPI colour-fill cards, Monthly Plays area chart, Top Games bar chart, and Department Breakdown table from the Overview sub-tab (those charts remain in the Trends sub-tab).

### Added
- New CSS classes: `.ov-kpi-*`, `.ov-mid-row`, `.ov-bot-row`, `.ov-progress-*`, `.ov-leg-*`, `.ov-mini-*`, `.tc-*` for the redesigned Overview layout.

---

## [2026-06-12] — Dashboard tweaks

### Changed
- Period dxSelectBox: text and dropdown icon now navy (`#0f172a`) on white background for legibility against the dark period bar.

---

## [2026-06-12] — Dashboard: dark chrome header + nav; leaderboard & table polish; period dropdown

### Added
- **Dark top chrome**: header bar, period bar, and main nav tabs all use `#0f172a` background, creating a strong visual split between chrome and content area.
- Period dxSelectBox styled for dark background (white text, translucent border, red focus ring).
- Nav badge gets a dark halo (`box-shadow: 0 0 0 2px #0f172a`) so it reads well on the dark nav.

### Changed
- **Leaderboard avatars, rank medals, top-3 row tints, points badge** as described above — points badge changed from red to dark slate pill.
- **Period filter**: replaced pill buttons with compact dxSelectBox; labels formatted with space before year ("January 2026").
- Tables: lighter dividers, bolder headers, more row padding.
- Buttons in header now use translucent-white ghost style on the dark background.
- Hidden tabs fix: `.dash-nav-tab[hidden] { display:none !important }`.

## [2026-06-12] — Dashboard: leaderboard redesign, table polish, period dropdown, tab fix

### Added
- **Leaderboard avatar initials**: coloured circle per player using rotating palette.
- **Leaderboard rank medals**: top-3 badges use gold/silver/red gradients with a glow shadow; rest are plain grey.
- **Leaderboard row tints**: first three rows have a subtle gold/grey/red gradient wash.
- **Points pill badge** (`.lb-pts-badge`): replaces plain points number — red tint pill with "pts" suffix.
- `.lb-avatar`, `.lb-pts-badge`, `.lb-top1/.lb-top2/.lb-top3` CSS classes.

### Changed
- **Period filter**: replaced row of pill buttons with a compact DevExtreme `dxSelectBox` dropdown (175 px). Period bar now single-line and much smaller.
- **Tables** (perf, players, dept): header background `#f4f6f9`, `2px` bottom border, `font-weight:700`, row dividers lightened to `#f1f5f9`, row padding increased to 13px for more breathing room.
- **Accuracy bars**: height reduced to 6px (game/players tables) and 5px (leaderboard), `font-weight:600` on percentage label.
- **Hidden nav tabs fix**: added `.dash-nav-tab[hidden] { display:none !important }` — CSS `display:inline-flex` was overriding the HTML `hidden` attribute, causing Incentives/Prizes/AI tabs to remain visible.

## [2026-06-12] — Dashboard UI polish: colour-fill KPI cards, improved card styling

### Changed
- **KPI cards**: replaced left-border accent design with soft colour-fill background (`--accent-light` computed from accent hex) and a 3px top accent stripe; value text enlarged to 32px bold in the accent colour; hover lifts card slightly.
- **Buttons**: PDF button changed to brand red (`#e11d48`); Report button style lightened.
- **Card radius**: all cards (metric, chart, panel, table) updated to `border-radius: 12px`.
- **Card shadows**: upgraded from `shadow-sm` to `0 2px 8px rgba(0,0,0,0.06)` for subtle depth; metric cards also gain a hover shadow.
- **Spacing**: dashboard body padding increased to `28px 32px`; nav/sub-tab/period bars aligned to 32px horizontal padding.
- **Sub-tab bar**: faint `#fafbfc` background to visually separate it from the main nav.
- **Typography**: dashboard title, card headings, and KPI values get tighter letter-spacing.
- JS: added `hexRgba(hex, a)` helper; `kpiCard()` now injects `--accent-light` CSS variable.

## [2026-06-12] — Hide Incentives, Prizes, AI Analysis tabs

### Changed
- Incentives, Prizes, and AI Analysis main nav tabs hidden (`hidden` attribute); panels and JS retained for easy restore.

## [2026-06-12] — Dashboard: restore sub-tabs; switch to DevExtreme charts

### Added
- **Summary Trends sub-tab**: Player Growth, Monthly Plays and Accuracy Trend area charts (DevExtreme dxChart).
- **Summary Forecast sub-tab**: dual-series area+dashed-line play-volume forecast using linear regression for 4 future months (DevExtreme dxChart).
- **Summary Anomalies sub-tab**: styled anomaly cards with severity badge and coloured icon (replaces anomaly strip on Overview).
- New CSS classes: `anomaly-list`, `anomaly-ok`, `anomaly-item`, `anomaly-item-icon`, `anomaly-item-text`, `anomaly-item-badge`.

### Changed
- **Summary tab** restored to **Overview / Trends / Forecast / Anomalies** sub-tab structure (reverts single-page layout from prior session).
- **Sub-tab row** restored to 4 tabs with Forecast and Anomalies; shown for Summary, Players, Games, Departments.
- **Players, Games, Departments** panels each have Forecast and Anomalies placeholders ("Coming soon") restored.
- **All charts migrated from Chart.js to DevExtreme** (`dxChart` / `dxPieChart`): area charts (all trend charts), horizontal bar charts (Top Games, Regional), vertical bar chart (Engagement Overview), pie chart (Dept breakdown).
- `destroyChart()` / `makeChart()` rewritten to use DevExtreme widget API (`instance().dispose()`).
- `areaChartConfig()` rewritten to return DevExtreme options object.
- All `<canvas>` chart hosts replaced with `<div>` hosts; `size.height` set via DevExtreme options.
- CSS: `.chart-container canvas` selector changed to `.chart-container > div`.
- Chart.js CDN removed from `index.html`.

## [2026-06-12] — Dashboard UI redesign: clean single-page Summary

### Added
- **KPI card row**: 5 accent-bordered cards (Participation %, Active Players, Total Plays, Avg Accuracy, Inactive) with CSS `--accent` custom property for per-card colour theming and an inline progress bar on the Participation card.
- **Player Leaderboard** in Summary: compact rank-badge rows (gold/silver/bronze/gray) with name, dept, points and colour-coded accuracy mini-bar — replaces the separate Players > Overview spotlight cards on the Summary screen.
- **Department Breakdown** in Summary: mini table (Active / Activity bar / Avg Pts) replacing the separate chart card.
- **Anomaly strip**: compact horizontal chip row at the bottom of Summary (medium = amber, high = red) replacing the full Anomalies sub-tab.
- New CSS classes: `summary-page`, `kpi-grid`, `kpi-card`, `kpi-value`, `kpi-progress`, `summary-2col`, `panel-card`, `panel-card-hd`, `summary-dept-table`, `lb-list`, `lb-row`, `lb-rank`, `lb-acc`, `anomaly-strip`, `anomaly-chip` and related helpers.

### Changed
- **Summary tab** is now one scrollable page — Overview / Trends / Forecast / Anomalies sub-tabs removed.
- Sub-tab row (`#dashSubRow`) now only appears for Players, Games, Departments tabs; hidden on all others.
- Sub-tab row trimmed to two items: **Overview** and **Trends** only (Forecast + Anomalies placeholders removed).
- Forecast / Anomalies placeholder sub-panels removed from Players, Games, Departments, Regional panels.
- Regional panel now renders directly (no sub-panel wrapper).
- `refreshAll()`: replaced four separate summary render calls with single `renderSummaryPage()`.
- `kpiCard()` helper function added.
- Summary charts: "Monthly Plays" area chart (blue) + "Top Games by Plays" bar (red) replace the old Dept Activity / Top Games pair.

## [2026-06-11] — Dashboard participation rate fixes

### Fixed
- `renderSummaryOverview`: participation rate now uses `profile.players` (active headcount) instead of summing `dept.active` values, so Naspers correctly shows 17/22 = 77% instead of 18/22 = 81.8%.
- `renderSummaryAnomalies`: inactive-player count now uses same `profile.players` source, giving "5 players (22.7%) are inactive" matching the reference.
- Removed stale "registered" legend dot from participation card legend (only active + inactive shown now).

### Added
- Participation card right-side mini bar visualisation: two proportional bars (active=red, inactive=gray) with player counts, matching the reference layout.
- `participation-card-right`, `participation-mini-bars`, `pmb-row`, `pmb-track`, `pmb-fill`, `pmb-lbl` CSS rules in `styles-dashboard.css`.
- Period labels stripped of spaces: `January2026`, `February2026`, etc. — keys in `NASPERS_DATA` and `PERIODS` array updated accordingly to match reference tab labels.

## [2026-06-11] — Dashboard full tab content

### Added
- **Summary > Trends**: Player Growth (red area) + Monthly Plays (blue area) side-by-side, Accuracy Trend (green area) full-width — Chart.js area charts from per-company monthly trend data.
- **Summary > Forecast**: Player Count Forecast (Linear Regression) — actual red line + blue dashed projection for +1/+2/+3 months.
- **Summary > Anomalies**: Dynamic anomaly cards (inactive players, depts with zero active, play-volume drop) with medium/high severity styling matching the reference.
- **Players > Overview**: Rebuilt to match reference — 4 metric cards, top-3 player spotlight badges (gold/silver/bronze), Full Player Rankings table (Rank / Player / Dept / Region / Points / Accuracy / Games). Naspers uses exact reference player names (Rihcard Moroke 4,177 pts, Johann Kok 1,345 pts, Hein Hein 510 pts, etc.).
- **Players > Trends**, **Games > Trends**, **Departments > Trends**: Player Activity (red area) + Accuracy Trend (blue area) + Combined Engagement Overview (red bars) — shared render function. Renamed "Player Trend" → "Player Activity".
- **Departments > Overview**: Department Breakdown table (Total / Active / Avg Points / Activity Rate colour bar) + Active Players by Department pie chart.
- **Regional > Overview**: Regions table, Players per Region horizontal bar, Top Dealers table — Naspers uses exact reference dealer data.
- `COMPANY_REGISTERED` map, `COMPANY_DEALERS` map, `avgPoints` on dept records, `NASPERS_MONTHLY` trend arrays.
- Sidebar nav label: "Users" → "Players".

### Changed
- `NASPERS_DATA['All Months'].plays` corrected to 2300 (matches reference "2.3K").
- `COMPANY_DEPT_PLAYERS[7]`: BB Gezina Nissan total=22, Auto Sales Excellence total=5.
- `COMPANY_PLAYERS` schema: `{plays, streak}` → `{points, games, region}` across all companies.
- `styles-dashboard.css`: added trends, spotlight, anomaly, dept/regional grid rules.
- `index.html`: sub-panels now have render IDs; placeholder content removed from implemented panels.

## [2026-06-11] — Dashboard scope-driven data

### Changed
- **Dashboard (`script-dashboard.js`) — dynamic per-company data**: all metric cards, header stats (players / plays / dealers), game performance table, player leaderboard, and department table now update automatically whenever the sidebar scope changes to a different company. Listens for `gameon:scope-change` and reads `localStorage['gameon.scope']` on load.
- Added `COMPANY_PROFILES` (7 companies, each with `players`, `dealers`, `playScale`, `accShift`) and `COMPANY_PLAYERS` (per-company leaderboard rosters). Period data for non-Naspers companies is derived by scaling the Naspers base data with each company's `playScale` and `accShift` offsets.

## [2026-06-11] — Analytics Dashboard

### Added
- **Analytics Dashboard (`index.html`)**: replaced placeholder with full dashboard matching the reference design. Includes:
  - Sticky header bar with title, live player/play/dealer stats and Report / PDF Report action buttons.
  - **DATA PERIOD** pill-tab filter across 7 periods (All Months, Jan–Jun 2026); selecting a period re-renders all stats and the performance table.
  - **Main tab navigation**: Summary, Players, Games (default active), Departments, Regional, Incentives, Prizes, AI Analysis (badge). Each tab shows its panel; unsupported tabs display a placeholder.
  - **Games › Overview**: four metric cards (Games Available, Total Plays, Avg Answer Accuracy, User Answers) plus a Game Performance table with play count, colour-coded accuracy bars (green ≥ 75 %, orange 60–74 %, red < 60 %), and play-time column for all 17 games.
  - **Games sub-tabs**: Overview, Trends, Forecast, Anomalies (with count badge); non-overview sub-tabs show a coming-soon placeholder.
  - **Summary tab**: six KPI cards with trend indicators.
  - **Players tab**: player leaderboard table with accuracy bars and streak column.
  - **Departments tab**: department performance comparison table.
  - Hard-coded data for every period (`script-dashboard.js`) and dashboard-specific styles (`styles-dashboard.css`).
- **Sidebar**: added Dashboard as the first nav item with `active` class on `index.html`.

## [2026-06-01] — Remove categories feature from Game Setup stepper

### Removed
- **`script-games-stepper.js`** (v40) — Removed all "categories on Game Setup" code:
  - Deleted the entire categories helpers block: IIFE that wrapped `onAddGameTopicChange`, `_gsShowCategoriesFromTopic`, `gsAddCustomCategory`, and `_gsGetSelectedCategories`.
  - Removed the categories HTML section (`gsGameCategoriesSection`) from `_gsPane1Html`.
  - Reverted `_gsOpenQuestionForm` to always create a default "Category 1" unconditionally (removed the conditional check for pre-existing category rows).
  - Removed the `_gsGetSelectedCategories()` category-creation block from `gsSaveAndShare`.
- **`styles-games.css`** — Removed the `/* ===== Game Setup — Categories section ===== */` block (`.gs-categories-section`, `.gs-subtopics-cat-chips`, `.gs-subtopic-cat-chip`, `.gs-custom-cat-row`, `.gs-cat-name-input`, `.gs-add-cat-btn`).

## [2026-06-01] — AI topics flow: 4-step Topic Setup → Content → Review → Share

### Changed
- **`script-topics.js`** (v74) — Redesigned AI flow to a fixed 4-step sequence:
  - **Step 1 "Topic Setup"**: cover picker, topic name (required, validated on Next), description, sub-topics toggle, AI model selector, credit estimate. No more combined content+config on step 1.
  - **Step 2 "Content"**: choice-picker cards — "Upload content" (file/URL/RTE) or "AI suggest resources" (prompt + mock suggestions list). Each card toggles its section independently.
  - **Step 3 "Review"**: both `aiTabPaneTopic` and `aiTabPaneSubs` shown together (populated by `doAIGenerate`). Regenerate + Next buttons in action bar.
  - **Step 4 "Share"**: unchanged `_buildAISharePane()` output.
  - `_aiTotalSteps` is now always `4`; `_aiRebuildStepper` retained but no longer called.
  - `setupAIStepperActions` updated for steps 1–4 with correct action bars.
  - `switchAITab` simplified — always maps to step 3, shows both review panes.
  - `goAIStepNext` validates topic name on step 1, advances 1→2 and 3→4.
  - `goAIStepBack` navigates 4→3 (via `switchAITab`), 3→2, 2→1, 1→cancel.
  - `_switchToAIStepManual` now hides/shows `aiTabPaneContent` for step 2.
  - New functions: `aiSelectMode(mode, btn)` (upload/suggest toggle), `aiGetSuggestions()` (mock suggestions), `_aiMockSuggestions` data array.
- **`index-topics.html`** — bumped `script-topics.js` to `?v=74`.

## [2026-05-28] — Topics AI Create step: sub-topics checkbox, Configure, panel scroll

### Changed
- **`script-topics.js`** (v61) — Create step redesigned: prominent “Generate with sub-topics” checkbox (default checked, purple highlight = AI recommends topic categories); Configure accordion with AI Model selector; panel scrolls vertically via `overflow-y: auto` on `#detailEdit`.
- **`styles-topics.css`** — `.ai-subtopics-check-row` card-style checkbox + `#detailEdit` overflow fix.
- **`index-topics.html`** — bumped `script-topics.js` to `?v=61`.

## [2026-05-28] — Topics AI flow: requirements implementation (URL/file validation, progress, credit estimate)

### Added
- **`script-topics.js`** (v60): URL validation extended to reject YouTube/Vimeo/Twitch video URLs with tooltip message. File upload validates format (PDF, DOCX, XLSX, PNG, JPG, JPEG) and rejects unsupported types with toast. Accepted files show an inline preview (image thumbnail for images, colour-coded file-type icon + size for documents). Generate button shows spinner + progress bar during 1.5 s mock generation then auto-clears. Topic name validated before generation starts. Invalid URL check blocks generation. Credit estimate chip in step 1 (15 credits default) updates live when AI Model is changed via `aiTopicUpdateCredit()`.
- **`styles-topics.css`** â€” `.ai-file-preview-img`, `.ai-file-preview-doc-icon`, `.ai-file-preview-meta`, `.ai-gen-progress*` styles.
- **`index-topics.html`** â€” bumped `script-topics.js` to `?v=60`.

## [2026-05-28] â€” Topics AI flow: align with sitemap (dynamic 3/4-step)

### Changed
- **`script-topics.js`** (v59) â€” `addTopicAI()` restructured to match the sitemap:
  - **AI Single** (no sub-topics): **1 Create â†’ 2 Topic Review â†’ 3 Share**
  - **AI Sub-topics**: **1 Create â†’ 2 Topic Review â†’ 3 Sub-topics â†’ 4 Share**
  - **Step 1 "Create"** is now a single comprehensive pane containing: Cover image picker, Topic name \* (required), Description, AI Model, Upload zone, URL (multi-url), Text RTE, Create sub-topics toggle, prompt input. Action bar = Cancel \| **âœ¦ Generate Topic**.
  - **Stepper is rebuilt dynamically** after generation via `_aiRebuildStepper(hasSubs)` â€” 3-dot stepper initially, expands to 4 dots when sub-topics are generated.
  - `_aiTotalSteps` variable tracks 3 or 4, driving `setupAIStepperActions` to always show the correct last-step button (Next or Done).
  - `switchAITab` updated: no 'ai-content' tab anymore; 'ai-topic' â†’ step 2, 'ai-subs' â†’ step 3 (only when subs exist).
  - Navigation: `_switchToAIStepManual(1)` for back-to-Create; `_switchToAIShareStep()` for last step (replaces `_switchToAIStep4`).
  - `_aiHasGenerated` and `_aiTotalSteps` both reset when `addTopicAI()` is called.
- **`index-topics.html`** â€” bumped `script-topics.js` to `?v=59`.

## [2026-05-28] â€” Topics AI flow: 4-step stepper matching the games AI flow

### Changed
- **`script-topics.js`** (v58) â€” `addTopicAI()` now uses a **4-step stepper** (Topic Setup â†’ Content â†’ Review â†’ Sharing) matching the games AI flow pattern.
  - **Step 1 (Topic Setup):** Cover image picker, Topic name \* (required, validates on Next), Description â€” same layout as the games AI flow step 1.
  - **Step 2 (Content):** AI Model, Upload, URL (multi-url), Text, Create sub-topics toggle, prompt input. Action bar shows Cancel + â† Back + **âœ¦ Generate Topic** (btn-ai). Clicking Generate â†’ auto-advances to step 3.
  - **Step 3 (Review):** AI-generated topic details (`aiTabPaneTopic` + `aiTabPaneSubs`). Action bar: Cancel + â† Back + Next â†’.
  - **Step 4 (Sharing):** Department checkbox list. Action bar: Cancel + â† Back + âœ“ Done.
  - `switchAITab` remapped: contentâ†’step 2, topic/subsâ†’step 3.
  - New helpers: `_setAIStepperDots`, `_switchToAIStepManual`, `_switchToAIStep4` (replaces `_switchToAIStep3`). `_buildAISharePane` updated to use `aiStepPane4`.
  - `_aiHasGenerated` reset to false on each new `addTopicAI()` call.
- **`index-topics.html`** â€” bumped `script-topics.js` to `?v=58`.

## [2026-05-28] â€” Topics AI flow: replace tab bar with 3-step stepper

### Changed
- **`script-topics.js`** (v56) â€” `addTopicAI()` now renders a `.add-stepper` with steps **Content â†’ Topic â†’ Sharing** instead of the `.add-topic-tabs` tab bar, matching the visual style of the manual add-topic flow.
  - Step 1 (Content): AI model, upload, URL, text, sub-topics toggle, prompt + Generate button â€” all inside `add-step-pane`. Generate button in the pane; action bar shows Cancel + Next â†’ (Next disabled until first generation completes).
  - Step 2 (Topic): populated by `doAIGenerate` as before (`aiTabPaneTopic` / `aiTabPaneSubs`); action bar shows Cancel + â† Back + Next â†’.
  - Step 3 (Sharing): department checkbox list built by `_buildAISharePane()`; action bar shows Cancel + â† Back + Done. Done calls `commitAIAllSteps()` which stores selected departments and triggers the existing save.
  - `switchAITab(tab)` updated to drive stepper dots instead of tab button `.active` class; `triggerAIGenerate()` and `updateAIGenBtnLabel()` updated to check pane visibility instead of `#aiTabBar`.
  - New helpers: `setupAIStepperActions`, `getAICurrentStep`, `goAIStepNext`, `goAIStepBack`, `_switchToAIStep3`, `_buildAISharePane`, `commitAIAllSteps`.
- **`index-topics.html`** â€” bumped `script-topics.js` to `?v=56`.

## [2026-05-28] â€” Add Question form: remove "(optional)" labels; default difficulty to Medium

### Changed
- **`script-games.js`** (v98) â€” in `openAddQuestionForm`: removed `(optional)` text from Difficulty and Question Image labels; Difficulty dropdown now defaults to "Medium" (removed the blank "Select difficulty" placeholder option).
- **`index-games.html`**, **`index-questions.html`**, **`index-questions-v2.html`** â€” bumped `script-games.js` to `?v=98`.

## [2026-05-28] â€” Game Setup step 1: Topic is required

### Changed
- **`script-games-stepper.js`** (v32) â€” Topic dropdown now shows a `*` required mark. Both `gsGoNext()` (manual flow) and `gsAIGoNext()` (AI flow) validate that a topic is selected before advancing to step 2; if not, the dropdown gets `input-error` focus and the step does not advance.
- **`index-games.html`** â€” bumped to `?v=32`.

## [2026-05-28] â€” Configure: rename "Questions for this game" label

### Changed
- **`script-games-stepper.js`** (v31) â€” renamed Configure field label from "Questions for this game" to "Number of Questions to Generate" on both the manual and AI game flows.
- **`index-games.html`** â€” bumped to `?v=31`.

## [2026-05-28] â€” AI review step: remove Import button

### Changed
- **`script-games-stepper.js`** (v30) â€” removed the Import file-label button from the AI review step header. Export button remains.
- **`index-games.html`** â€” bumped to `?v=30`.

## [2026-05-28] â€” Share step: Department / Individual toggle on both game flows

### Added
- **`script-games-stepper.js`** (v29):
  - Both the manual flow (step 3 Share) and the AI flow (step 4 Share) now show a segmented toggle: **Department** | **Individual** above the share list.
  - **Department** view (default) â€” existing department checkbox list, unchanged.
  - **Individual** view â€” search input + list of 2 mock users per department (name + department sub-label). Typing in the search box filters the list live via `gsFilterShareUsers()`.
  - `_gsShareToggleHtml(deptItems, userItems)` â€” builds the toggle + both views.
  - `_gsShareUserItemsHtml(allDepts)` â€” generates placeholder users from the department list.
  - `window.gsShareMode(mode)` â€” switches between `'dept'` and `'individual'` views.
  - `window.gsFilterShareUsers(query)` â€” hides non-matching user rows on input.
- **`styles-games.css`** â€” `.gs-share-toggle`, `.gs-share-toggle-btn`, `.gs-share-active`, `.share-user-info`, `.gs-share-user-dept`.
- **`index-games.html`** â€” bumped `script-games-stepper.js` to `?v=29`.

## [2026-05-28] â€” AI review step: Export and Import buttons for question editing

### Added
- **`script-games-stepper.js`** (v28) â€” Export and Import buttons in the AI review step 3 header. Export downloads the current questions as `questions.csv` (columns: Question, Option A, Option B, Option C, Option D, Correct 1-4). Import opens a file picker; the selected CSV is parsed and replaces the review list. CSV parser handles quoted fields, embedded commas, and header row. Imported questions reset the Keep/Regenerate bar and update the question count chip.
- **`styles-games.css`** â€” `.gs-review-header-actions` (flex group) and `.gs-review-action-btn` (small bordered button/label used for both Export and Import).
- **`index-games.html`** â€” bumped `script-games-stepper.js` to `?v=28`.

## [2026-05-28] â€” Fix: share badge appears immediately after sharing a topic

### Added
- **`script-topics.js`** (v54) â€” `updateTopicShareChip(topicName)` â€” finds every `tr[data-topic]` whose `data-name` matches and updates only its `.cell-pills` with the current share chip (count + dept tooltip). Replaces the previous `refreshTopics()` rebuild which was unsafe: topics added by the v2 flow live only in the DOM, not in `TOPICS_BY_SCOPE`, and would vanish when the table was rebuilt from the data source.

### Fixed
- **`script-topics.js`** â€” `confirmShare()`: replaced `refreshTopics()` with `updateTopicShareChip(target.name)`. Share badge now appears in the topic row immediately after confirming the share panel.
- **`script-topics-add-intent.js`** (v13) â€” `v2Commit()`: calls `updateTopicShareChip(name)` after sharing so the badge is visible on the new row straight away.
- **`script-topics.js`** (v55) â€” `_aiUrlSyncRemoveBtns` now hides the Ã— button on the first row unconditionally (`index === 0`), regardless of how many rows exist. Only rows added via "+ Add URL" ever show their Ã— button.
- **`index-topics-v2.html`**, **`index-topics.html`** â€” bumped `script-topics.js` to `?v=55`.

## [2026-05-28] â€” Topics AI panel: fix remove button visible on first URL row

### Fixed
- **`styles-topics.css`** â€” added `.ai-url-remove-btn[hidden] { display: none; }` so the `hidden` HTML attribute is not overridden by the `display: flex` rule on the button. The Ã— button on the first row now stays hidden until a second URL is added.

## [2026-05-28] â€” Topics AI panel: multi-URL input with inline validation

### Added
- **`script-topics.js`** (v54) â€” four new global helpers for the multi-URL field:
  - `aiUrlValidate(input)` â€” runs on every keystroke; tests `^https?://` and sets a `fa-check` (green) or `fa-times` (red) icon inside the input. Clears icon when the field is empty.
  - `aiUrlAdd()` â€” appends a new URL row to `#aiUrlList`, focuses its input, then calls `_aiUrlSyncRemoveBtns`.
  - `aiUrlRemove(btn)` â€” removes the row, syncs remove-button visibility.
  - `_aiUrlSyncRemoveBtns()` â€” shows the Ã— button on all rows when there are 2+; hides it when only one row remains.
- **`styles-topics.css`** â€” added `.ai-url-list`, `.ai-url-row`, `.ai-url-input-wrap`, `.ai-url-status-icon` (`.fa-check` green / `.fa-times` red), `.ai-url-remove-btn` (red hover), `.ai-url-add-btn` (indigo dashed border).

### Changed
- **`script-topics.js`** (v54) â€” replaced single `<input id="aiUrlInput">` with the multi-row URL list (first row pre-rendered with a hidden remove button).
- **`script-topics-add-intent.js`** (v14) â€” same HTML change for the v2 AI flow; updated `hasUrl` check in `v2AIGenerate` to read all `.ai-url-input` values via `querySelectorAll` instead of `getElementById('aiUrlInput')`.
- **`index-topics-v2.html`** â€” bumped `script-topics.js` to `?v=54`, `script-topics-add-intent.js` to `?v=14`.
- **`index-topics.html`** â€” bumped `script-topics.js` to `?v=54`.

## [2026-05-28] â€” Manual flow: show stepper on add-question form

### Changed
- **`script-games-stepper.js`** (v27) â€” added `_gsInjectStepperIntoForm()`: after every `openAddQuestionForm()` call (first open via `_gsOpenQuestionForm`, re-open via `gsInlineAddQuestion`, and "Save & Add Another" via the `_navigateToQuestionsPage` override), the committed stepper (step 1 done, step 2 active, step 3 greyed) is prepended to `#gameEditFields` so the user always sees their progress while filling in the question form.
- **`index-games.html`** â€” bumped `script-games-stepper.js` to `?v=27`.

## [2026-05-28] â€” Manual flow: questions list shown inline in games panel after each save

### Changed
- **`script-games-stepper.js`** (v26):
  - **`_navigateToQuestionsPage` override replaced** â€” no longer navigates to `index-questions-v2.html`. After "Add Question" saves a question, `_gsShowInlineQuestionsView(gameId, catId)` is called to rebuild the stepper panel at step 2 with an accordion list. After "Save & Add Another", `openAddQuestionForm` re-opens with the same type.
  - **`_gsShowInlineQuestionsView(gameId, catId)`** â€” reads saved questions from DOM `tr.row-q` data attributes (`data-text`, `data-options`, `data-correct`), rebuilds the stepper HTML at step 2 with the questions list and an "Add Question" button. Action bar: Cancel + Next â†’.
  - **`_gsInlineQItemHtml(q, i)`** â€” renders each question as an accordion item (same style as AI review â€” numbered circle, chevron, âœ“ correct in green, â—‹ wrong in grey). Uses the `{ text, options, correct }` format from `_doSaveQuestion`.
  - **`_gsPatchFormCancelBtn(gameId, catId)`** â€” after `openAddQuestionForm` renders, replaces the Cancel button's `showGameEmpty()` with `gsInlineCancelForm(gameId, catId)`.
  - **`window.gsInlineCancelForm`** â€” if questions already saved, returns to the list; otherwise returns to the type picker via `_gsGoBackToStep2()`.
  - **`window.gsInlineAddQuestion`** â€” re-opens the add form from the inline list view.
  - **`window.gsQuestionsNext`** â€” calls `_gsOpenShareStep` to advance to Share.
  - **`_gsOpenQuestionForm`** calls `_gsPatchFormCancelBtn` on first form open.
- **`styles-games.css`** â€” added `.gs-q-view-header`, `.gs-inline-add-btn`, `.gs-q-empty`.
- **`index-games.html`** â€” bumped `script-games-stepper.js` to `?v=26`.

## [2026-05-28] â€” Questions page: move question list into the right-side panel

### Changed
- **`index-questions.html`**, **`index-questions-v2.html`** â€” removed `<div id="questionsList">` from the main content area; added `<div class="detail-content hidden" id="detailQuestionsList"><div id="questionsList"></div></div>` to the detail panel so questions render in the right-hand panel alongside the add form.
- **`script-questions.js`** (v4):
  - Added `_showQListPanel()` â€” hides all panel sections and shows `#detailQuestionsList`.
  - Added `_showQEmptyPanel()` â€” shows `#detailEmpty` and hides list/form.
  - `renderQuestionsPage()` calls `_showQListPanel()` when questions exist, `_showQEmptyPanel()` when none.
  - `submitAddQuestion()` no longer calls `showGameEmpty()` â€” `renderQuestionsPage()` handles panel state.
  - `closeQPanel()` shows the list panel if questions exist, empty state otherwise.

## [2026-05-28] â€” Questions page: accordion list matching AI review style

### Changed
- **`script-questions.js`** (v3) â€” `renderQuestionRows` rewritten to use the same `.gs-review-item` accordion markup as the AI review step. Each question row shows: numbered purple circle, question text, question-type chip, edit/delete buttons on the right (behind a border), and a chevron. Clicking the row expands it to show answer options â€” correct answer in green with âœ“, wrong answers in grey with â—‹. Added `window.qToggle(btn)` accordion toggle (mirrors `gsReviewToggle` for use on the questions page which doesn't load the stepper script).
- **`styles-questions.css`** â€” added `#questionsList` flex container rule, `.q-accordion-actions` (edit/delete button group inside the row), and `#questionsList .gs-review-answers { padding-left: 44px }` to align answers under the question text.
- **`script-games-stepper.js`** (v25) â€” reverted the accidental inline-questions-view changes from v24; manual flow navigates to the questions page as before.
- **`index-questions.html`**, **`index-questions-v2.html`** â€” bumped `script-questions.js` to `?v=3`.
- **`index-games.html`** â€” bumped `script-games-stepper.js` to `?v=25`.

## [2026-05-28] â€” Manual flow: inline questions list in step 2 panel (accordion style)

### Changed
- **`script-games-stepper.js`** (v24):
  - After clicking **Next** on step 2 (content/type picker), the panel no longer navigates to `index-questions-v2.html`. Instead, step 2 transforms in-place to an **inline questions view** matching the AI review accordion style.
  - The questions view shows: game name header + question count chip; an **Add Question** form (MCQ: 4 option inputs with radio buttons for correct answer; other types: single answer input); the question list in accordion format (numbered circles, âœ“ correct in green, â—‹ wrong in grey, chevron expand); empty-state note until the first question is added.
  - Action bar in questions mode: **Cancel** | **Next â†’** (advances to the Share step via `_gsOpenShareStep`). No Back button since the game is already saved.
  - `window.gsAddInlineQuestion()` â€” reads and validates the form, pushes to `_gsInlineQuestions[]`, re-renders the list and clears the form.
  - `window.gsQuestionsNext()` â€” opens the Share step for the saved game row.
  - `_gsQuestionsMode` flag gates `_gsSetActions(2)` so the questions action bar persists even if the step is re-activated.
  - Resets `_gsInlineQuestions`, `_gsInlineQType`, `_gsQuestionsMode` on each new manual flow start.
- **`styles-games.css`** â€” added `.gs-q-view-header`, `.gs-add-q-form`, `.gs-q-textarea`, `.gs-add-q-options`, `.gs-add-q-opt-row`, `.gs-q-radio`, `.gs-q-opt-input`, `.gs-add-q-hint`, `.gs-add-q-btn`, `.gs-q-empty`.
- **`index-games.html`** â€” bumped `script-games-stepper.js` to `?v=24`.

## [2026-05-28] â€” AI flow: remove Import Bulk button from step 2

### Changed
- **`script-games-stepper.js`** (v23) â€” Import Bulk bar removed from `_gsAIPane2Html()` (not shown in the AI flow). Corresponding show/hide references removed from `gsAIPickQType()` and `_gsAIActivateStep()`. The Import Bulk button remains in the manual 3-step flow (step 2) unchanged.
- **`index-games.html`** â€” bumped `script-games-stepper.js` to `?v=23`.

## [2026-05-28] â€” Rename stepper step 2 label from "Upload" to "Content"

### Changed
- **`script-games-stepper.js`** (v22) â€” all stepper label arrays updated: `'Upload'` â†’ `'Content'` in both the 3-step manual stepper and the 4-step AI stepper, including the committed re-renders in `_gsGoBackToStep2`, `_gsOpenShareStep`, and `_gsAIOpenShareStep`.
- **`index-games.html`** â€” bumped `script-games-stepper.js` to `?v=22`.

## [2026-05-28] â€” AI flow: remove placeholder note from review step

### Changed
- **`script-games-stepper.js`** (v21) â€” removed the "Placeholder questions â€” real AI generation will populate this list." note from `_gsAIBuildReviewPane()`.
- **`index-games.html`** â€” bumped `script-games-stepper.js` to `?v=21`.

## [2026-05-28] â€” AI flow: review step â€” Keep lock + Regenerate for individual questions

### Changed
- **`script-games-stepper.js`** (v20):
  - Each question row now has a **Keep** button (ðŸ”“ lock-open icon) on the right side. Clicking it locks the question (ðŸ”’ lock icon, green tint, `gs-review-kept` class on the item). Clicking again unlocks it.
  - As soon as any question is kept, a **âœ¦ Regenerate** button (AI-styled) appears above the note row.
  - `window.gsReviewRegenerate()` â€” replaces all non-kept questions with questions from `_GS_MOCK_QUESTIONS_EXTRA` (5 extra placeholder MCQs), cycling with `_gsRegenIdx`. Shows a spinner on unlocked questions for 1.5 s before swapping content.
  - `window.gsReviewKeep(btn)` â€” toggles kept state and shows/hides the regenerate bar.
  - `_gsReviewItemHtml(q, i)` helper extracted so both initial render and regeneration reuse the same HTML builder.
  - `_gsRegenIdx` reset to 0 on new AI flow start.
- **`styles-games.css`** â€” added `.gs-review-q-row` (flex row), `.gs-review-keep-btn` (right-side keep button, locked/hover states), `.gs-review-item.gs-review-kept` (green border + background), `.gs-review-regen-bar` (right-aligned container, hidden until a question is kept).
- **`index-games.html`** â€” bumped `script-games-stepper.js` to `?v=20`.

## [2026-05-28] â€” AI flow: step 2 action bar â€” replace Next with AI-themed Generate button

### Changed
- **`script-games-stepper.js`** (v19) â€” `_gsAISetActions(2)`: replaced the "Next â†’" primary button with `<button class="btn btn-ai" id="gsAINextBtn">âœ¦ Generate</button>`. Button is still disabled until a question type is selected; clicking it triggers the 2-second generation spinner and auto-advances to step 3.
- **`index-games.html`** â€” bumped `script-games-stepper.js` to `?v=19`.

## [2026-05-28] â€” AI flow: step 3 is now the review; generation fires from step 2 Next button

### Changed
- **`script-games-stepper.js`** (v18):
  - Step 3 pane no longer pre-renders the upload form. Clicking **Next** on step 2 (question type picker) now triggers generation inline: the Next button shows a `fa-spinner` and "Generatingâ€¦" for 2 seconds, then `_gsAIBuildReviewPane()` populates step 3 and the stepper advances automatically.
  - `_gsAISetActions(3)` simplified â€” step 3 is always reached post-generation so it unconditionally renders Cancel / â† Back / Next â†’.
  - The `_gsAIPane3Html()` upload form function is kept in code but is no longer injected into the stepper HTML.
- **`index-games.html`** â€” bumped `script-games-stepper.js` to `?v=18`.

## [2026-05-28] â€” AI flow: step 3 review panel â€” accordion questions with answers

### Changed
- **`script-games-stepper.js`** (v17):
  - `_gsAIBuildReviewPane()` completely rewritten. Step 3 now shows 5 MCQ placeholder questions in collapsible accordion cards. Each card shows the question text and a chevron; clicking opens the answers panel revealing all 4 options â€” correct answer highlighted in green with a âœ“ icon, wrong answers in light grey with a â—‹ icon. A question-count chip (`5 questions`) appears next to the game name in the header.
  - `window.gsReviewToggle(btn)` added â€” toggles the `.hidden` class on the answers panel and the `.open` class on the item for chevron rotation.
  - `_GS_MOCK_QUESTIONS` array holds 5 realistic MCQ training questions (placeholder until real AI generation).
- **`styles-games.css`** â€” replaced flat `.gs-ai-review-*` rules with full accordion styles: `.gs-review-item`, `.gs-review-q-btn`, `.gs-review-q-num`, `.gs-review-q-text`, `.gs-review-chevron`, `.gs-review-answers`, `.gs-review-answer`, `.gs-review-answer--correct`, `.gs-review-answer--wrong`, `.gs-review-note`.
- **`index-games.html`** â€” bumped `script-games-stepper.js` to `?v=17`.

## [2026-05-28] â€” AI flow: credit estimate starts at 0; shown on steps 1, 2, and 3

### Changed
- **`script-games-stepper.js`** (v16):
  - Credit estimate chip now initialises to `~0 credits` on all three panes (steps 1, 2, 3).
  - `gsAIUpdateCreditEstimate()` uses a multiplier of `0` when no question type has been selected yet, so the displayed cost is 0 until the user picks a type card. Once a type is picked the cost updates immediately to `base Ã— multiplier`.
  - Credit estimate chip added to step 2 (question-type picker pane) so it is visible and updates as the user selects a type.
- **`index-games.html`** â€” bumped `script-games-stepper.js` to `?v=16`.

## [2026-05-28] â€” AI flow: step 2 matches manual flow; step 3 = Upload; dynamic credit estimate

### Changed
- **`script-games-stepper.js`** (v15):
  - **Step 2 (Upload)** in the AI 4-step flow now looks identical to the manual flow: question-type card picker, Import Bulk button (hidden until a type is selected), Cancel / â† Back / Next â†’ action bar. The Next button is disabled until a type card is picked.
  - **Step 3 (Review)** now holds the upload zone, URL, text, prompt, and Generate button (previously on step 2). Action bar shows Cancel + â† Back before generating; Cancel + â† Back + Next â†’ once generation completes.
  - **Step reachability** updated: step 3 dot becomes clickable once a question type is selected; step 4 dot only after generation completes.
  - **Dynamic credit estimate** â€” `window.gsAIUpdateCreditEstimate()` reads the selected AI Model (`#gsAIModel`) and question type (`_gsSelectedQType`) and updates every `.gs-credit-estimate-value` element in real-time. Model costs: Haiku ~20, Sonnet ~50, Opus ~150, GPT-4o ~75, Gemini ~40. Question-type multipliers: MCQ Ã—1.0, Fill blank Ã—1.2, Statement blanking Ã—1.2, Select on image Ã—1.5, Match terms Ã—1.3, Word bucket Ã—1.4, Crossword Ã—2.0. Called on model `onchange` and after each type-card click.
  - `_gsCreditEstimateHtml()` marks the estimate `<strong>` with class `gs-credit-estimate-value` so all chips can be updated together.
  - Resets `_gsSelectedQType` on new AI flow start so stale type from a previous session does not pollute step reachability.
- **`index-games.html`** â€” bumped `script-games-stepper.js` to `?v=15`.

## [2026-05-28] â€” Questions page: disable Done until 5 questions added

### Changed
- **`script-questions.js`** (v2) â€” "Done" button in `#questionsDoneBar` is now rendered disabled when fewer than 5 questions exist, and re-enables as soon as the 5th question is saved. Tooltip `"Add at least 5 questions to continue"` appears on the disabled button; it clears once the threshold is met. This mirrors the existing orange warning banner (which already hides at 5) and fires on every `renderQuestionsPage()` call so the state is always current.
- **`index-questions-v2.html`**, **`index-questions.html`** â€” bumped `script-questions.js` to `?v=2`.

## [2026-05-28] â€” Games: AI flow â€” Configure 2Ã—2 grid, step 2 type picker, credit estimates

### Changed
- **`script-games-stepper.js`** (v14):
  - **Configure grid** â€” Pass Threshold moved inside `.configure-grid` so all four fields (Max attempts, Questions for game, Pass Threshold, AI Model) share the same 2-column equal-width grid. Removed `style="width:100px"` from Pass Threshold; the grid's existing `1fr 1fr` CSS handles sizing. For the regular manual flow, only 3 cells are present; grid places Pass Threshold in the left column of the second row.
  - **AI step 2 (Upload)** â€” rebuilt to match the regular flow: compact 2-column question-type card picker (`#gsAIQTypePicker`) at the top ("Choose the type of questionsâ€¦"), followed by file upload, URL, text area, and the prompt + Generate button below. `gsAIPickQType()` handles card selection and tracks `_gsSelectedQType`.
  - **Credit estimates** â€” amber "Estimated cost: ~50 credits" chip added to the bottom of step 1 (Game Setup), step 2 (Upload), and step 3 (Review) in the AI flow via `_gsCreditEstimateHtml()`.
- **`styles-games.css`** â€” added `.gs-credit-estimate` amber chip styles.
- **`index-games.html`** â€” bumped `script-games-stepper.js` to `?v=14`.

## [2026-05-28] â€” Games: AI flow â€” move AI Model picker into Configure (step 1)

### Changed
- **`script-games-stepper.js`** (v13) â€” AI Model dropdown moved from step 2 (Upload) into the **Configure** collapsible block on step 1 (Game Setup), below Pass Threshold. It only appears in the AI flow â€” `_gsPane1Html` now accepts an optional `extraConfigHtml` argument injected at the bottom of the Configure block; the regular manual flow passes nothing so its Configure section is unchanged. `_gsAIModelPickerHtml()` helper builds the select, and `_gsAIPane2Html` no longer renders it.
- **`index-games.html`** â€” bumped `script-games-stepper.js` to `?v=13`.

## [2026-05-28] â€” Games: AI flow 4-step stepper (Generate with AI on index-games.html)

### Added
- **`script-games-stepper.js`** (v12) â€” overrides `window.addGameAI` to launch a 4-step stepper: **Game Setup â†’ Upload â†’ Review â†’ Share**.
  - **Step 1 (Game Setup)**: identical to the regular manual flow (Cover image, Topic, Game name *, Description, Configure). Uses the same `_gsPane1Html()` so field IDs and validation are shared.
  - **Step 2 (Upload)**: AI content panel â€” AI Model picker, file upload zone (drag-and-drop), URL field, rich-text area, and prompt input with a "Generate â†’" button. Clicking Generate shows a loading spinner, then advances to Review after a 2-second simulated delay.
  - **Step 3 (Review)**: shows the AI-generated questions list (placeholder mock questions for now). Action bar: Cancel | â† Back | Next â†’.
  - **Step 4 (Share)**: same department checkboxes + from/to schedule picker as the regular flow. Action bar: Cancel | Share.
  - Stepper dots are clickable with the same rules as the regular 3-step stepper: backward always allowed; step 2 reachable once a name is entered; step 3 reachable only after generation; step 4 reachable after reviewing. `gsUpdateStepAccess()` now updates both `#gsStepper` (regular) and `#gsAIStepper` (AI) in one call.
- **`styles-games.css`** â€” added `.gs-ai-stepper .add-step-label` (font-size 0.68rem so 4 nodes fit); `#gsAIStepper` click-interaction rules; `.gs-ai-review-list/item/num/text/note` styles for the Review step question list.
- **`index-games.html`** â€” bumped `script-games-stepper.js` to `?v=12`.

## [2026-05-28] â€” Games stepper: "â† Change type" returns to stepper step 2

### Fixed
- **`script-games-stepper.js`** (v11) â€” clicking "â† Change type" in the question form now returns to the stepper's compact step 2 type-picker (same 2-column grid) instead of the old full-panel large-card picker. Previously selected type is pre-highlighted and the "Next â†’" button is pre-enabled. Picking a new type and clicking "Next â†’" reuses the already-saved game and category â€” no duplicate rows are created. Step 1 ("Game Setup") shows as a committed (non-clickable) completed step since the game is already saved. Cancelling from any point restores the original `backToQTypePicker` so normal question flows on other games are unaffected.
- **`styles-games.css`** â€” added `#gsStepper .add-step.gs-step-committed` rule (`cursor: default; pointer-events: none`) for the non-navigable step 1 when the game is already saved.
- **`index-games.html`** â€” bumped `script-games-stepper.js` to `?v=11`.

## [2026-05-28] â€” Games stepper: clickable step navigation

### Added
- **`script-games-stepper.js`** (v10) â€” stepper dots are now interactive:
  - Each dot has `onclick="gsStepClick(N)"`.
  - **Backward**: clicking any completed (green âœ“) step always navigates back to it; the question-type selection on step 2 is preserved and the Next button is re-enabled if a type was already chosen.
  - **Forward**: clicking the next step dot is only allowed when the current step's required fields are filled â€” clicking step 2 from step 1 validates the game name (same logic as the "Next â†’" button); clicking step 3 from step 2 saves the game (same as "Next â†’" on step 2, which then navigates to the questions page). Step 3 cannot be reached by clicking the dot directly â€” it is only opened via the full save â†’ questions â†’ return flow.
  - `gsUpdateStepAccess()` is called on every name keypress and after every step transition to toggle the `gs-step-reachable` class on step 2, making it visually clickable only when a game name is present.
- **`styles-games.css`** â€” added `#gsStepper`-scoped CSS: locked future steps (`opacity: 0.45`, `cursor: not-allowed`, `pointer-events: none`); reachable next step (full opacity, `cursor: pointer`); done steps (`cursor: pointer`); hover brightness on done/reachable step circles.
- **`index-games.html`** â€” bumped `script-games-stepper.js` to `?v=10`.

## [2026-05-28] â€” Games stepper: rename step 1 label to "Game Setup"

### Changed
- **`script-games-stepper.js`** (v9) â€” step 1 label changed from "Game" to "Game Setup" in both the active stepper (`_gsStepperHtml`) and the completed stepper shown on step 3 (`_gsOpenShareStep`).
- **`index-games.html`** â€” bumped `script-games-stepper.js` to `?v=9`.

## [2026-05-28] â€” Games: restore scheduled-date chip on game list rows

### Added
- **`script-games.js`** (v97) â€” added `_buildScheduleChip(startDate, endDate)` helper that returns a `<span class="chip chip-scheduled">` showing the date range (e.g. "30 May â€“ 5 Jun '26"), or empty string when no start date is set. Used by `gameRowHtml()` (via `.cell-sched` wrapper) and `updateGameRowChips()` so the chip appears on first render and updates whenever the schedule changes.
- **`index-games.html`**, **`index-games-v2.html`**, **`index-questions-v2.html`** â€” bumped `script-games.js` to `?v=97`.

## [2026-05-28] â€” Games stepper (index-games.html): labels, Upload step, cross-page navigation, share step fixes

### Added
- **`script-games-stepper.js`** (v8) â€” step 2 renamed from "Questions" to "Upload"; step 2 shows an **Import Bulk** button (`gsImportBulk`) once a question type card is selected; clicking **Next** on step 2 opens the Add Question form in the right-hand panel (calls `openAddQuestionForm`) rather than immediately going to step 3; `_navigateToQuestionsPage` stores `returnTo: 'index-games.html'` in `gameon.questionsNav` so "Done" on the questions page navigates back to `index-games.html`; `_gsOpenShareStep` now calls `setGamePanelMode('add')` + `showGameEdit()` **before** assigning custom action-bar HTML, preventing the default "Create Game" submit button from re-appearing; step 3 includes a `buildScheduleBodyHtml` date-range picker (from/to); `gsConfirmShare` reads `scheduleStartDate` / `scheduleEndDate` values and writes them to the game row's `data-scheduled-date` / `data-scheduled-end-date` attributes, then calls `updateGameRowChips`.
- **`styles-games.css`** â€” added `.gs-import-bulk-bar` and `.gs-import-bulk-bar.hidden` for the Import Bulk bar shown on step 2.
- **`index-questions-v2.html`** â€” inline `goBackToGames` override now reads `nav.returnTo` from `gameon.questionsNav` and redirects to that URL (defaults to `index-games-v2.html`), enabling the v1 stepper to return to `index-games.html`.

### Changed
- **`script-games-stepper.js`** â€” step labels changed to **Game / Upload / Share**; "Name" field label changed to "Game name *"; "Topic" and "Description" labels no longer include "(optional)".

### Fixed
- **`script-games-stepper.js`** â€” `_gsOpenShareStep` action bar ordering bug: `setGamePanelMode('add')` is now always called before `actions.innerHTML` is overwritten so the Share button is never replaced by a default "Create Game" submit button.

## [2026-05-28] â€” Games: 3-step stepper on regular Add Game panel; stepper border removed

### Added
- **`script-games-stepper.js`** (v1) â€” new script for `index-games.html` that wraps `addGame()` to deliver the same 3-step stepper flow (Game â†’ Questions â†’ Share) as Games v2. Step 1 uses the same field IDs (`addGameName`, `addGameDesc`, etc.) as the original form so the rest of `script-games.js` stays unchanged. Step 2 shows a compact 7-card question-type picker; clicking Next saves the game and advances to step 3. Step 3 renders an inline department share checklist backed by `confirmGameSharePanel()`.
- **`index-games.html`** â€” loads `script-games-stepper.js?v=1` after `script-games.js`; also upgraded `script-games.js` reference from `?v=85` to `?v=96` so it matches the other pages.

### Fixed
- **`styles-topics.css`** â€” removed `border-bottom: 1px solid var(--border)` and `padding-bottom: 16px` from `.add-stepper`. These produced a visible horizontal divider line below the stepper row on every panel that uses the stepper (AI game flow, manual flow, topics).
- **`index-games-v2.html`**, **`index-questions-v2.html`** â€” bumped `script-games-v2-intent.js` to `?v=36` to deliver the `setGamePanelMode` ordering fix (actions bar no longer overwritten on AI step 2).

## [2026-05-28] â€” Games v2: fix "Game name is required" on AI step 2 Next

### Fixed
- **`script-games-v2-intent.js`** (v35) â€” `_gv2AIShowQuestionsStep()` was replacing `gameEditFields.innerHTML`, destroying `#aiGameTabPaneGame` and `#aiGameTabPaneCats` before `saveGameAdd()` could read the generated name, description, and category items. Fix: detach both panes from the DOM before the innerHTML swap, then re-append them with the `hidden` class so they remain accessible to `saveGameAdd()` without appearing on screen.
- **`index-games-v2.html`**, **`index-questions-v2.html`** â€” script bumped to `?v=35`.

## [2026-05-28] â€” Games v2: Back button on AI step 2 (Questions)

### Added
- **`script-games-v2-intent.js`** (v34) â€” `_gv2AIShowQuestionsStep()` action bar now includes a `â† Back` button between Cancel and Next. Clicking it calls `gv2AIGoBack()` which re-runs `_gv2AIFlow()` to return to step 1 of the AI game form.
- **`index-games-v2.html`**, **`index-questions-v2.html`** â€” script bumped to `?v=34`.

## [2026-05-28] â€” Games v2: AI flow step 2 â€” question type + count after generation

### Added
- **`script-games-v2-intent.js`** (v33) â€” `_gv2AIFlow()` now wraps `window._renderAIGameResults` once. After the original renders the generated game data (hidden panes), `_gv2AIShowQuestionsStep()` is called instead of the tab switch, advancing the stepper to step 2. Step 2 shows: compact question-type card grid (`#aiQTypePicker`), a "Total questions" range slider (1â€“10, default 10), and a "Questions per attempt" range slider (1â€“10, default 5). "Next" button is enabled only after a type card is selected; clicking it calls `gv2AISaveAndShare()` which saves the AI game (via `saveGameAdd`) and intercepts `showAddGameShareStep` to open `_gv2OpenShareStep` (step 3) instead of the original tab-based share pane.
- **`styles-games.css`** â€” Added `.ai-qcount-slider` (purple range input) and `.ai-qcount-group` / `.ai-qcount-val` helper styles.
- **`index-games-v2.html`**, **`index-questions-v2.html`** â€” script bumped to `?v=33`.

## [2026-05-28] â€” Games v2: remove opt-out checkbox from Game Categories block

### Removed
- **`script-games-v2-intent.js`** (v32) â€” Removed the "Opt out of AI-suggested categories" checkbox and label from the Game Categories block entirely â€” both from the initial injected HTML and from `_gv2UpdateAIGameCats`.
- **`index-games-v2.html`**, **`index-questions-v2.html`** â€” script bumped to `?v=32`.

## [2026-05-28] â€” Games v2: remove "Topic sub-topics will be used as game categories" note from AI panel

### Removed
- **`script-games-v2-intent.js`** (v31) â€” `_gv2AIFlow()` now also removes `#aiGameContentSkipNote` (the blue "Topic sub-topics will be used as game categories" info box rendered by the original AI panel). This information is already conveyed by the Game Categories block.
- **`index-games-v2.html`**, **`index-questions-v2.html`** â€” script bumped to `?v=31`.

## [2026-05-28] â€” Games v2: Game Categories â€” no AI suggestion when topic has no sub-topics

### Changed
- **`script-games-v2-intent.js`** (v30) â€” `_gv2UpdateAIGameCats` now has three states: (1) no topic selected â†’ "Select a topic â€” its sub-topics will be used as game categories" + opt-out hidden; (2) topic with sub-topics â†’ count + italic name list + opt-out visible; (3) topic with no sub-topics â†’ "This topic has no sub-topics â€” no game categories will be added" + opt-out hidden. Removed the "AI will suggest categories" fallback entirely. Initial HTML also starts with state 1 and opt-out hidden.
- **`index-games-v2.html`**, **`index-questions-v2.html`** â€” script bumped to `?v=30`.

## [2026-05-28] â€” Games v2: Game Categories block shows topic sub-topics dynamically

### Changed
- **`script-games-v2-intent.js`** (v29) â€” `gv2OnAITopicChange` now calls `_gv2UpdateAIGameCats(topic)` on every topic selection. When the selected topic has sub-topics, the bullet list updates to: "This topic has N sub-topic(s) that will be used as game categories" + an italic comma-separated list of their names. When no sub-topics exist (or no topic selected), it falls back to the original two-bullet AI-suggest message.
- **`styles-games.css`** â€” Added `.ai-cats-subtopic-list` to style the sub-topic name list in purple italic.
- **`index-games-v2.html`**, **`index-questions-v2.html`** â€” script bumped to `?v=29`.

## [2026-05-28] â€” Games v2: Configure accordion moved above Generate section on AI panel

### Changed
- **`script-games-v2-intent.js`** (v28) â€” `_gv2AIFlow()` now inserts the Configure accordion before `.ai-generate-block` (the prompt input + Generate Game button) using `insertAdjacentHTML('beforebegin')`, with a fallback to `beforeend` if the block isn't found. Previously it was appended after the generate section.
- **`index-games-v2.html`**, **`index-questions-v2.html`** â€” script bumped to `?v=28`.

## [2026-05-28] â€” Games v2: Game Categories block on AI panel

### Added
- **`script-games-v2-intent.js`** (v27) â€” `_gv2AIFlow()` now injects a **Game Categories** form group directly after the Topic select. The block shows: (1) categories will match the selected topic's categories; (2) if no topic categories exist, AI will suggest them unless opted out â€” with an "Opt out of AI-suggested categories" checkbox (`#aiGameCatsOptOut`).
- **`styles-games.css`** â€” Added `.ai-game-cats-info`, `.ai-game-cats-list`, `.ai-game-cats-optout` styles for the purple-tinted info card.
- **`index-games-v2.html`**, **`index-questions-v2.html`** â€” script bumped to `?v=27`.

## [2026-05-28] â€” Games v2: remove "(optional)" from Topic label on AI panel

### Changed
- **`script-games-v2-intent.js`** (v26) â€” `_gv2AIFlow()` now removes the `.form-label-optional` span from the Topic label after the original AI panel renders, so the label reads "Topic" instead of "Topic (optional)".
- **`index-games-v2.html`**, **`index-questions-v2.html`** â€” script bumped to `?v=26`.

## [2026-05-28] â€” Games v2: remove Upload/URL/Text from AI game panel

### Removed
- **`script-games-v2-intent.js`** (v25) â€” `_gv2AIFlow()` now removes `#aiGameUploadSection`, `#aiGameUrlSection`, and `#aiGameTextSection` after the original AI panel renders. Content is sourced from the selected topic; manual upload/URL/text entry is not needed in this flow.
- **`index-games-v2.html`**, **`index-questions-v2.html`** â€” script bumped to `?v=25`.

## [2026-05-28] â€” Games v2: fix configure-grid alignment

### Fixed
- **`script-games-v2-intent.js`** (v24) â€” `_gv2AIFlow()` now discards the `.ai-model-group` element (which carries `margin-top:12px` from `styles-topics.css`) and rebuilds the AI Model form-group as a plain `div.form-group`, so all four cells in the configure-grid sit flush at the top.
- **`styles-games.css`** â€” Added `.configure-grid select { width: 100% }` so the AI Model dropdown stretches to fill its cell like the number inputs do. Added `.configure-grid .form-group { margin-top: 0 }` to neutralise any inherited top-margin on grid cells.
- **`index-games-v2.html`**, **`index-questions-v2.html`** â€” script bumped to `?v=24`.

## [2026-05-28] â€” Games v2: Back button on share step (step 3)

### Added
- **`script-games-v2-intent.js`** (v23) â€” `_gv2OpenShareStep()` action bar now includes a `â† Back` button between Cancel and Share. Clicking it navigates back to `index-questions-v2.html`; `gameon.questionsNav` is still in localStorage so the questions page restores correctly.
- **`index-games-v2.html`**, **`index-questions-v2.html`** â€” script bumped to `?v=23`.

## [2026-05-28] â€” Games v2: Configure accordion on AI game panel

### Changed
- **`script-games-v2-intent.js`** (v22) â€” `_gv2AIFlow()` now appends a Configure accordion at the bottom of the AI panel. The AI Model select (`.ai-model-group`) is extracted from its original position and embedded as the first cell of a 2-column `.configure-grid`, alongside Max attempts, Questions for this game, and Pass Threshold â€” four fields in a 2Ã—2 layout, matching the manual flow's Configure section.
- **`index-games-v2.html`**, **`index-questions-v2.html`** â€” script bumped to `?v=22`.

## [2026-05-28] â€” Games v2: share department list inline in stepper (step 3)

### Changed
- **`script-games-v2-intent.js`** (v21) â€” Added `_gv2OpenShareStep(gameRow)`: renders the department checklist inside `#detailEdit` under the stepper header (steps 1+2 marked done, step 3 "Share" active) instead of opening the separate `#detailShare` panel. Populates `_currentGameShareTarget` identically to `openGameSharePanel` so the existing `confirmGameSharePanel()` function handles the actual share write unchanged. Updated the pending-share `$(function(){})` handler to call `_gv2OpenShareStep` instead of `openGameSharePanel` when returning from the questions page via "Done".
- **`index-games-v2.html`**, **`index-questions-v2.html`** â€” script bumped to `?v=21`.

## [2026-05-28] â€” Games v2: remove Content/Game tab bar from AI flow

### Removed
- **`script-games-v2-intent.js`** (v20) â€” `_gv2AIFlow()` now removes the `#aiGameTabBar` (Content / Game tabs) after the original AI panel renders. The tab bar is redundant in the v2 flow where the cover image and topic fields are injected directly without tabbed navigation.
- **`index-games-v2.html`**, **`index-questions-v2.html`** â€” script bumped to `?v=20`.

## [2026-05-28] â€” Games v2: "Done" on questions page opens share panel on return

### Added
- **`script-games-v2-intent.js`** (v19) â€” Added a jQuery ready handler inside the IIFE that reads `gameon.pendingShare` from localStorage on page load. If present (written by `goBackToGames` on the questions page) it wraps `renderGamesForScope` once: after the game list renders it locates the target game row and calls `openGameSharePanel(row, { isNew: true })`, completing the Game â†’ Questions â†’ Share wizard flow. The wrap is self-removing so subsequent scope changes use the original function.
- **`index-questions-v2.html`** â€” inline `goBackToGames` override now saves `{ gameId }` to `gameon.pendingShare` before navigating to `index-games-v2.html`. Script bumped to `?v=19`.
- **`index-games-v2.html`** â€” script bumped to `?v=19`.

## [2026-05-28] â€” Games v2: AI panel stepper + toggle removed; questions page uses compact picker

### Changed
- **`script-games-v2-intent.js`** (v18) â€” `_gv2AIFlow()` now prepends the stepper header (step 1 "Game" active, matching the manual flow labels) above the cover picker in the AI panel. Also removes the "Generate with categories & questions" toggle from that panel. Added `openAddQuestion` override: when `script-questions.js` has already run (i.e. on `index-questions-v2.html`), wraps the function so the compact 2-column card grid is shown instead of the full-size single-column picker.
- **`index-questions-v2.html`** â€” reordered scripts so `script-games-v2-intent.js` loads after `script-questions.js`, enabling the `openAddQuestion` override to take effect. Version bumped to `?v=18`.
- **`index-games-v2.html`** â€” script bumped to `?v=18`.

## [2026-05-28] â€” Games v2: question save lands on v2 questions page

### Added
- **`index-questions-v2.html`** (new) â€” Copy of `index-questions.html` with "Games v2" as the active sidebar item, back button pointing to `index-games-v2.html`, and `script-games-v2-intent.js` loaded so the compact question-type picker is used. Inline script overrides `goBackToGames()` so the "Done" button also returns to Games v2.
- **`script-games-v2-intent.js`** (v17) â€” Overrides `window._navigateToQuestionsPage` so that after a question is saved via the v2 flow, the browser navigates to `index-questions-v2.html` instead of `index-questions.html`.
- **`index-games-v2.html`** â€” script bumped to `?v=17`.

## [2026-05-28] â€” Games v2: AI flow adds cover picker + topic auto-fill

### Added
- **`script-games-v2-intent.js`** (v16) â€” "Generate with AI" now goes through `_gv2AIFlow()` instead of calling the original `addGameAI()` directly. The wrapper: (1) syncs user-created topics from localStorage; (2) calls the original to render the full AI panel (tabs, generate button, etc.); (3) injects a cover image picker (preset gradients + upload) above the content tabs; (4) replaces the topic dropdown options with the full uncapped list; (5) swaps the topic select's `onchange` to `gv2OnAITopicChange`, which runs the original handler then also calls `_setAddGameCoverPreview` so the cover auto-fills when a topic is selected.
- **`index-games-v2.html`** â€” script bumped to `?v=16`.

## [2026-05-28] â€” Games v2: Add Question uses compact card picker

### Changed
- **`script-games-v2-intent.js`** (v15) â€” Overrides `actionAddQuestion` so that clicking "Add Question" from a category's action menu (and the "+ Add Question" button on the questions view) now shows the compact 2-column `.q-type-picker--sm` grid instead of the original full-size single-column cards. Extracted shared `_gv2CompactQTypePickerHtml(gameId, catId)` helper reused by both `actionAddQuestion` and `_gv2ShowTypeChangePanel`.
- **`index-games-v2.html`** â€” script bumped to `?v=15`.

## [2026-05-28] â€” Games v2: remove "Finish without questions" button

### Removed
- **`script-games-v2-intent.js`** (v14) â€” Removed "Finish without questions" button from both the step-2 action bar and the change-type return panel. Step 2 now only shows Cancel + Back; the change-type panel shows only Cancel.
- **`index-games-v2.html`** â€” script bumped to `?v=14`.

## [2026-05-28] â€” Games v2: "â† Change type" returns to step-2 card picker

### Added
- **`script-games-v2-intent.js`** (v13) â€” Overrides `backToQTypePicker` so that clicking "â† Change type" in the Add Question form (when the game was created via the v2 flow) returns to the compact step-2 question-type card grid rather than the original full-screen picker. Stores `_gv2ActiveGameId` / `_gv2ActiveCatId` when `_gv2OpenQuestionForm` runs; the override only intercepts calls for that specific game. Cards rendered in the return view call `openAddQuestionForm` directly (the category already exists â€” no duplicate is created). Action bar shows Cancel + "Finish without questions".
- **`index-games-v2.html`** â€” script bumped to `?v=13`.

## [2026-05-28] â€” Games v2: move Configure back to Step 1

### Changed
- **`script-games-v2-intent.js`** (v12) â€” Configure accordion (Max attempts, Questions for this game, Pass Threshold) moved from Step 2 "Questions" back to Step 1 "Game", appearing below the Content picker. Removed from Step 2 entirely.
- **`index-games-v2.html`** â€” script bumped to `?v=12`.

## [2026-05-28] â€” Games v2: question type card click opens Add Question form

### Changed
- **`script-games-v2-intent.js`** (v11) â€” Step 2 question-type cards no longer have a default selection. Clicking a card is now the action: it saves the game, creates Category 1 silently, and opens the Add Question form for that type directly (no extra "Next" â†’ Step 3 needed). A quiet "Finish without questions" button is provided for users who want to save the game without adding a question right away.
- Extracted shared `_gv2DoSave(questionType)` helper used by both `gv2PickQType` (card click) and the new `gv2FinishWithoutQuestions()`.
- `_gv2SetStepActions`: step 2 now renders "Finish without questions" instead of the "Next â†’" primary button.
- **`index-games-v2.html`** â€” script bumped to `?v=11`.

## [2026-05-28] â€” Games v2: Topic dropdown shows all user-created topics

### Fixed
- **`script-games-v2-intent.js`** (v10) â€” The Topic dropdown in Step 1 now shows all topics created on the Topics page. Root cause: the games page never loaded `localStorage['gameon.topics.scope']` (where the Topics page persists additions/edits) into the in-memory `TOPICS_BY_SCOPE` global. Added `_gv2SyncTopicsFromStorage()` to merge that localStorage key into `TOPICS_BY_SCOPE` each time the step-1 pane renders. Also replaced the `getAIGameTopicOptions()` call with a local `_gv2TopicOptions()` that has no 30-topic cap.
- **`index-games-v2.html`** â€” script bumped to `?v=10`.

## [2026-05-28] â€” Games v2: open question form after game creation

### Added
- **`script-games-v2-intent.js`** (v9) â€” Added `_gv2OpenQuestionForm(gameId, gameName, questionType)`. After a new single game is saved (and the share step is confirmed or skipped), this function silently creates "Category 1" for the game, then calls `openAddQuestionForm()` directly with the question type chosen in Step 2 â€” bypassing the type-picker panel and landing the user straight in the question setup form.
- **`index-games-v2.html`** â€” script bumped to `?v=9`.

## [2026-05-28] â€” Topics v2: swap intent screen row order

### Changed
- **`script-topics-add-intent.js`** (v13) â€” Intent screen now shows "How would you like to create it?" (Manually / Generate with AI) as the first row, and "What are you building?" (Single topic / With sub-topics) as the second row.
- **`index-topics-v2.html`** â€” script bumped to `?v=13`.

## [2026-05-28] â€” Games v2: question-type cards use q-type-card style

### Changed
- **`script-games-v2-intent.js`** (v8) â€” Step 2 "Questions" now uses the existing `.q-type-card` visual style (icon circle + title) in a compact 2-column grid (`q-type-picker--sm`). Single-select via `gv2PickQType()` which toggles the `.selected` class. Descriptions hidden in compact view.
- **`styles-games.css`** â€” Added `.q-type-picker--sm` grid modifier, compact card sizing overrides, and `.q-type-card.selected` highlight state (blue border, tinted background, coloured icon).

## [2026-05-28] â€” Games v2: move Configure to Questions step

### Changed
- **`script-games-v2-intent.js`** (v6) â€” Configure accordion (Max attempts, Questions for this game, Pass Threshold) moved from Step 1 "Game" to Step 2 "Questions", sitting below the question-type cards.

## [2026-05-28] â€” Games v2: question-type card styles

### Added
- **`styles-games.css`** â€” Added `.ai-qtype-grid` (2-column grid) and `.ai-qtype-card` styles: hidden radio input, bordered card with icon + label, blue highlight on `:has(input:checked)` for the selected card.

## [2026-05-28] â€” Games v2: remove Generate with AI header button

### Removed
- **`index-games-v2.html`** â€” Removed the "Generate with AI" (`btn-ai`) button from the page header. The AI flow is now accessible from the intent screen via the Add Game button.

## [2026-05-28] â€” Games v2: Questions step with question-type cards

### Changed
- **`script-games-v2-intent.js`** (v5) â€” Stepper expanded from 2 to 3 steps: **Game â†’ Questions â†’ Share**. Step 2 "Questions" shows 7 single-select question-type cards (Multiple Choice, Fill in the Blanks, Statement Blanking, Select on Image, Match the Terms, Word Bucket, Crossword) using the existing `.ai-qtype-grid` / `.ai-qtype-card` styles. Only one card can be selected at a time (radio group `gv2QType`). Selected question type is saved on the game object.

## [2026-05-28] â€” Games v2: Configure accordion on manual single step 1

### Changed
- **`script-games-v2-intent.js`** (v4) â€” Step 1 now includes a Configure accordion (Max attempts, Questions for this game, Pass Threshold) at the bottom, matching the existing manual Add Game panel. Configure values are read on save and stored on the game object.

## [2026-05-28] â€” Games v2: topic dropdown + auto-fill in manual single stepper

### Changed
- **`script-games-v2-intent.js`** (v3) â€” Step 1 now includes a Topic dropdown (pulled from live scope data via `getAIGameTopicOptions()`). Selecting a topic auto-fills Game name and Description if empty, and pre-sets the cover image from the topic cover. New `gv2OnTopicChange()` handler.

## [2026-05-28] â€” Games v2: manual single-game 2-step stepper

### Added
- **`script-games-v2-intent.js`** (v2) â€” Manually + Single game path now opens a 2-step stepper (Game â†’ Share) matching the Topics v2 manual flow. Step 1 shows Cover image picker, Game name, Description, and a Content picker (Upload / Web URL / Text tabs). Step 2 shows the Share screen. "Create Game" on step 2 saves and opens the share panel then the question-type picker. Back on step 1 returns to the intent screen.

## [2026-05-28] â€” Games v2: intent-first Add Game screen

### Added
- **`script-games-v2-intent.js`** (v1) â€” Intent-first Add Game screen for Games v2 only. Overrides `addGame()` and `addGameAI()` from `script-games.js`. Shows "How would you like to create it?" (Manually / Generate with AI) as the first row. The second row ("What are you building?" â€” Single game / With categories) is hidden and only revealed after the user selects a method. Next button is disabled until row 1 is clicked. Clicking Next routes to the original manual or AI flow.
- **`index-games-v2.html`** â€” Loads `script-games-v2-intent.js?v=1` after `script-games.js`. Script-games bumped to `?v=96`.

## [2026-05-28] â€” Games v2: new page + sidebar nav link on all pages

### Added
- **`index-games-v2.html`** â€” New page (copy of `index-games.html`) with "Games v2" as the active nav item; uses `script-games.js?v=95`.
- **All sidebar pages** (`index-games.html`, `index-questions.html`, `index-topics.html`, `index-topics-v2.html`, `companies.html`, `index-users-dept-grid.html`) â€” Added "Games v2" nav link after the Games link in the sidebar.

## [2026-05-28] â€” Topics v2: remove Generate-with-AI option; grip-handle reorder; label fixes

### Removed
- **`script-topics-add-intent.js`** â€” "How would you like to create it?" method group removed from the intent screen. The "Generate with AI" card (and the "Manually" card beside it) no longer appear; the intent screen now asks only "What are you building?" Method defaults to `'manual'` in `v2Proceed()` since no method card is present.
- **`script-topics-add-intent.js`** â€” `v2MoveSubItem()` removed; replaced by `v2ReindexSubItems()`.
- **`styles-topics.css`** â€” `.ai-sub-move` / `.ai-sub-move:hover` removed.

### Added
- **`script-topics-add-intent.js`** (v12) â€” `var _v2DragSrc = null` global for HTML5 drag state.
- **`script-topics-add-intent.js`** â€” `v2ReindexSubItems(list)` â€” re-indexes `data-idx` and `data-field` on all sub-topic accordion items after a drag-drop, and rebuilds `_v2KeepFields` sub-* keys from the `.kept` class.
- **`styles-topics.css`** â€” `.ai-sub-grip` (drag handle button, right of Keep, `cursor:grab`), `.ai-sub-dragging` (opacity:0.4 while dragging), `.ai-sub-drag-over` (accent border when hovered as drop target).

### Changed
- **`script-topics-add-intent.js`** â€” `v2AddSubAccordionItem`: â†‘/â†“ arrow buttons replaced with a `fa-grip-vertical` drag handle (`.ai-sub-grip`) positioned after the Keep button. HTML5 drag events wired per item â€” drag only activates when mousedown on the grip, so clicks inside the contenteditable name and RTE body work normally.
- **`script-topics-add-intent.js`** â€” Stepper label "Sub-Topic" renamed to "Sub-topics" in all flows.
- **`script-topics-add-intent.js`** â€” `v2BackToIntent()`: removed AI method-card restoration (no method cards in the DOM anymore).
- **`index-topics-v2.html`** â€” script bumped to `?v=12`.

## [2026-05-28] â€” Topics v2: restore Manually / Generate with AI choice on intent screen

### Added
- **`script-topics-add-intent.js`** (v12) â€” Restored the **"How would you like to create it?"** question group to `v2IntentHtml()` with Manually (default selected) and Generate with AI cards. This was accidentally removed in an earlier session when the standalone header button was added.
- **`script-topics-add-intent.js`** â€” `v2BackToIntent()` now also restores the previous method card selection (in addition to structure) when the user navigates back to the intent screen.

## [2026-05-28] â€” Topics v2: remove standalone Generate with AI header button

### Removed
- **`index-topics-v2.html`** â€” Removed the separate "Generate with AI" (`btn-ai`) button from the page header. The Add Topic button already opens the intent screen where the user chooses between Manually and Generate with AI.

### Changed
- **`index-topics-v2.html`** â€” Add Topic button icon changed from `fa-layer-group` to `fa-plus` for consistency.

## [2026-05-28] â€” Topics v2: action bar pin on Sub-Topic step + unified stepper labels

### Changed
- **`script-topics-add-intent.js`** (v11) â€” `v2SwitchTo`: `v2-review-active` class is now toggled for both `ai-review` **and** `ai-subtopics` steps, so the flex-scroll chain keeps the action bar visible on the Sub-Topic step.
- **`styles-topics.css`** â€” Added `.v2-review-active #v2AiSubtopicsContent { flex:1; min-height:0; overflow-y:auto }` so the accordion list scrolls internally while the stepper and Cancel/Back/Next bar stay pinned at the bottom of the panel.
- **`script-topics-add-intent.js`** â€” All stepper labels updated to a consistent naming pattern:
  - Manual single: **Topic â†’ Share**
  - Manual sub-topics: **Topic â†’ Sub-Topic â†’ Share**
  - AI single: **Create â†’ Topic â†’ Share**
  - AI sub-topics: **Create â†’ Topic â†’ Sub-Topic â†’ Share**
- **`index-topics-v2.html`** â€” script bumped to `?v=11`.

## [2026-05-28] â€” Topics v2: sub-topics accordion â€” one-at-a-time, RTE toolbar, reorder

### Added
- **`script-topics-add-intent.js`** (v10) â€” `v2MoveSubItem(btn, direction)` â€” up/down arrow buttons in each sub-topic header reorder the accordion items. After a move all `data-idx` and `data-field` attributes are re-indexed in DOM order, and `_v2KeepFields` sub-* keys are rebuilt from each item's `.kept` class so locks survive reordering.

### Changed
- **`script-topics-add-intent.js`** â€” `v2AddSubAccordionItem`: header now includes â†‘ / â†“ move buttons (`btn-icon ai-sub-move`) between the name and the Keep button; body now contains a full RTE toolbar (`.ai-sub-rte-toolbar`) above the `contenteditable` wysiwyg area.
- **`script-topics-add-intent.js`** â€” `v2ToggleSubItem`: adopts one-at-a-time accordion behaviour â€” when opening an item it first collapses every sibling (body `hidden`, chevron reset); clicking the already-open item's toggle still closes it.
- **`styles-topics.css`** â€” `.ai-sub-body` now `display:flex; flex-direction:column` so toolbar and editor stack correctly with no extra padding wrapper. New `.ai-sub-rte-toolbar` scopes the toolbar border-radius to zero inside the body. New `.ai-sub-move` styles the tiny up/down icon buttons. `.ai-sub-body .ai-wysiwyg` overrides the generic wysiwyg to `min-height:220px; max-height:420px` with inner padding, giving the editor comfortable room.
- **`index-topics-v2.html`** â€” script bumped to `?v=10`.

## [2026-05-28] â€” Topics v2: AI + sub-topics 4-step flow with expandable accordion

### Added
- **`script-topics-add-intent.js`** (v9) â€” AI + sub-topics flow now has **4 steps**: Content â†’ Review â†’ Sub-topics â†’ Share (was 3 steps with sub-topics embedded in the Review pane).
- **`script-topics-add-intent.js`** â€” New `'ai-subtopics'` step type: `v2PaneHtml` returns `<div id="v2AiSubtopicsContent">` which `v2SwitchTo` lazily fills via `v2FillAISubtopics()`.
- **`script-topics-add-intent.js`** â€” `v2FillAISubtopics()` â€” builds an expandable accordion (`.ai-sub-list` / `.ai-sub-item`) from `_v2AISuggestion.subtopics`. Each item has a chevron-toggle, an editable name span, and a **Keep** button wired to `v2ToggleKeep()` with key `'sub-N'`.
- **`script-topics-add-intent.js`** â€” `v2AddSubAccordionItem(container, sub, idx)` â€” creates and appends one accordion entry (reuses existing `.ai-sub-*` + `.ai-wysiwyg` CSS classes).
- **`script-topics-add-intent.js`** â€” `v2ToggleSubItem(btn)` â€” expands/collapses the `.ai-sub-body` and rotates the chevron icon.
- **`script-topics-add-intent.js`** â€” `v2AIRegenerateSubs()` â€” regenerates sub-topic names and content in-place, skipping any entry whose `'sub-N'` keep-lock is set. Wired to the **Regenerate** (`btn-ai`) button on the Sub-topics step. Updates AI credit counter.
- **`script-topics-add-intent.js`** â€” `readAISubtopics()` â€” reads name + HTML content from the accordion for `v2Commit()`.

### Changed
- **`script-topics-add-intent.js`** â€” `v2Proceed()`: detects `method === 'ai' && structure === 'subtopics'` first and assigns the 4-step config.
- **`script-topics-add-intent.js`** â€” `v2SetActions()`: added `'ai-subtopics'` case â€” Regenerate (`btn-ai`) + Next buttons.
- **`script-topics-add-intent.js`** â€” `v2FillAIReview()`: removed the embedded sub-topics list. For AI+subtopics the Review step now shows only Name + Description (sub-topic content reviewed on the next step).
- **`script-topics-add-intent.js`** â€” `v2AIRegenerate()`: removed the `cfg.structure === 'subtopics'` branch; only updates `#v2AiContent` (single-topic RTE). Sub-topic regeneration is handled by `v2AIRegenerateSubs()`.
- **`script-topics-add-intent.js`** â€” `v2Commit()`: routes AI+subtopics to `readAISubtopics()` instead of `readListedSubs()` (both for sub-row creation and for the toast sub-count).
- **`index-topics-v2.html`** â€” script bumped to `?v=9`.

## [2026-05-28] â€” Topics v2: setup screen clean-up, last-step game action, step labels

### Changed
- **`script-topics-add-intent.js`** â€” Intent/setup screen: removed the "Also create a game?" question group entirely. Game creation is now offered at the end of every flow via dedicated action buttons on the last stepper step (Sharing).
- **`script-topics-add-intent.js`** â€” Intent/setup screen: removed the AI model selector from the setup screen. It now lives inside the `ai-generate-block` on the Content (Prompt) step so model choice is made in context, right next to the Generate button.
- **`script-topics-add-intent.js`** â€” First stepper label is now **Content** across all three flows (was "Prompt" for AI, "Topic" for manual sub-topics; single was already "Content").
- **`script-topics-add-intent.js`** â€” Last step action bar changed to **Cancel | Back | Create Game | Done** in all flows. `v2Commit(createGame)` accepts a boolean; "Create Game" passes `true`, "Done" passes `false`.

## [2026-05-27] â€” Topics v2: promote to first-class nav item; polish AI Review buttons

### Changed
- **`index-topics-v2.html`** â€” removed the "Prototype review" sticky banner; the page is now a proper app page. Nav updated: Topics links to `index-topics.html` (not active), and a new **Topics v2** item links to `index-topics-v2.html` (active).
- **All other pages** (`index-topics.html`, `index-games.html`, `index-users-dept-grid.html`, `all-users.html`, `companies.html`, `reports.html`, `settings.html`, `index.html`, `index-questions.html`) â€” **Topics v2** nav item added immediately below Topics in every sidebar so the flow is reachable from anywhere.
- **`script-topics-add-intent.js`** â€” Regenerate button on the AI Review step now uses `btn-ai` (gradient pill, same as Generate Topic / Generate with AI) instead of `btn-outline`.

## [2026-05-27] â€” Add Topic v2: AI Review â€” no-scroll panel, RTE full-screen modal

### Changed
- **`script-topics-add-intent.js`** (v8) â€” AI Review step (step 2 of the AI flow):
  - Removed the "AI-generated â€” review and edit before saving" info banner from the Review pane.
  - Added `v2-review-active` CSS class toggle on `#detailEdit` when entering/leaving the `ai-review` step (also cleared in `addTopic()` and `v2BackToIntent()`). This activates a flex-column chain through `#editFields` â†’ visible `.add-step-pane` â†’ `#v2AiReviewContent` so the panel header/stepper/action bar are always visible and never scroll off-screen.
  - Single-topic content form-group gains class `v2-rte-form-group` which fills the remaining height inside the chain. The `#v2AiContent` RTE is the only scrollable element (`flex: 1; overflow-y: auto`).
  - Added a full-screen expand button (`fa-expand-alt`) in the RTE label row. Opens a DevExtreme `dxPopup` (72 vw Ã— 80 vh, draggable, resizable) with a full toolbar + larger editing surface. Content syncs back to `#v2AiContent` automatically when the popup closes.
- **`styles-topics.css`** â€” removed `.ai-review-banner` block; added `.v2-review-active` flex-chain rules (for `#editFields`, `#v2Stepper`, `.add-step-pane:not(.hidden)`, `#v2AiReviewContent`), `.v2-rte-form-group` layout, `.v2-rte-expand-btn` icon button, and `.v2-rte-modal-body` styles for the full-screen editing surface.
- **`index-topics-v2.html`** â€” `script-topics-add-intent.js` version bumped to `?v=8`.

## [2026-05-27] â€” Add Topic v2: intent-first flow (prototype review page)

### Added
- **`index-topics-v2.html`** â€” duplicate of the topics page with a dark "prototype review" banner and a "Back to current" link. Loads all the same scripts as `index-topics.html` plus `script-topics-add-intent.js` last so it shadows `addTopic()`.
- **`script-topics-add-intent.js`** (v2) â€” intent-first `addTopic()` override. Opens an intent screen asking two questions upfront â€” *What are you building?* (Single topic / With sub-topics) and *How?* (Manually / Generate with AI) â€” before showing a focused stepper. Steps differ by structure choice:
  - Single (3 steps): Content (name + description + cover + content picker combined) â†’ Sharing â†’ Game
  - Sub-topics (4 steps): Details â†’ Sub-topics â†’ Sharing â†’ Game
  - AI (either): delegates to existing `addTopicAI()` unchanged.
  - Also overrides `expandTopicForm()` so that cancelling an empty sub editor in the sub-topics step re-shows the "Add sub-topic" button rather than silently doing nothing.
- **`styles-topics.css`** â€” `.v2-banner`, `.v2-banner-back`, `.intent-screen`, `.intent-group-label`, `.intent-cards`, `.intent-card`, `.intent-icon`, `.intent-body`, `.intent-title`, `.intent-desc`, `.intent-check` styles for the review page banner and intent picker.

### Changed
- **`script-topics-add-intent.js`** (v7) â€” AI Review step redesigned: name, description, and content (single) / sub-topics (sub-topics) each have a green **Keep** button that locks that field against regeneration. "Generate Topic" moves to the action bar (replacing Next on the Prompt step). Prompt step gains a cover image picker (user-chosen, not AI-generated). Review step action bar: Cancel | Back | Regenerate | Next â€” Regenerate calls `v2AIRegenerate()` which updates only un-locked fields in-place. Cancel on any stepper step now shows a DevExtreme confirmation dialog warning the user their work will be lost.
- **`script-topics-add-intent.js`** (v6) â€” AI flow restored to full fidelity with the original `addTopicAI` content: AI model dropdown appears on the intent screen when "Generate with AI" is selected (not on the stepper); Prompt step carries the exact Upload zone / URL / Text RTE / prompt-text + "Generate Topic" button from the original flow. "Generate Topic" uses the same `nextAISuggestion` + `_AI_SUGGESTIONS` pools, updates the credit counter, and auto-advances to the Review step. Review step shows the AI-poolâ€“generated name, description, cover, and rich sub-topic content (with `htmlToMarkdown` conversion), all editable. Back-to-intent from step 1 restores method and model-group visibility. Full flows:
  - Manual single: Content â†’ Sharing (2 steps)
  - Manual sub-topics: Topic â†’ Sub-topics â†’ Sharing (3 steps)
  - AI single: Prompt â†’ Review â†’ Share (3 steps)
  - AI sub-topics: Prompt â†’ Review (with pre-populated sub-topics) â†’ Share (3 steps)
- **`script-topics-add-intent.js`** (v4) â€” Game intent moved to the intent screen as a third question: "Also create a game for this topic?" (Not now / Yes, create a game). This means all decisions are declared upfront before the stepper begins. The final button on the last step automatically reads the intent: **Continue to game â†’** if Yes was chosen, **Done** if not. No split-button decision at the end. Flows are now:
  - Single: Content â†’ Sharing (2 steps)
  - Sub-topics: Details â†’ Sub-topics â†’ Sharing (3 steps)
- **`script-topics-add-intent.js`** â€” Single topic flow merged its "Details" and "Content" steps into one combined "Content" step. The `stepTypes` architecture (`'content-single'` / `'details'` / `'subtopics'` / `'sharing'`) ensures `v2PaneHtml`, `v2SwitchTo`, `v2Validate`, and `v2Commit` all find the content picker in the correct pane dynamically.

## [2026-05-27] â€” Add Topic: 3-step stepper replaces tab layout

### Changed
- **`script-topics.js`** (v53) â€” `addTopic()` rebuilt around a 3-step stepper (Content â†’ Sharing â†’ Game) replacing the old Topic/Sub-topics tab layout.
  - Step 1 (Content): topic name/description/cover + the existing "Add content" / "Add sub-topics" choice cards. Choosing sub-topics now collapses the topic form into a `.topic-mini` card with an edit pencil, keeping the panel tidy while the sub-topic list builds up.
  - Step 2 (Sharing): inline department checkboxes â€” current department pre-checked, others opt-in. Sharing is applied directly when "Done" is clicked so the old post-save share panel is no longer needed in the normal add flow.
  - Step 3 (Game): three option cards â€” "No game" (default, selected), "Create a game" (normal flow), "Generate with AI". Selecting a game option and clicking Done launches the game-creation flow; "No game" closes the panel.
- **`script-topics.js`** â€” New stepper helper functions added: `getCurrentStepperStep`, `setupStepperActions`, `goStepNext`, `goStepBack`, `switchToStep`, `validateStep1`, `showTopicMiniCard`, `expandTopicForm`, `buildStep2`, `buildStep3`, `selectGameOption`, `commitAllSteps`.
- **`script-topics.js`** â€” `saveAdd()` now has a stepper intercept at the top: if the stepper is present (Enter key pressed in a text field), it calls `goStepNext()` and returns instead of jumping to commit.
- **`script-topics.js`** â€” `removeTopicContent()`: also un-hides `#choicePromptLabel` when restoring the picker.
- **`script-topics.js`** â€” `cancelSubEditor()` and `removeSubItem()`: no-subs revert path now calls `expandTopicForm()` instead of `switchAddTab('topic')`, and un-hides `#choicePromptLabel`.

### Fixed
- **`script-topics.js`** â€” `expandTopicForm()`: no longer clears the sub-topics list when the user clicks the edit-pencil on the topic mini-card. The sub-topics remain intact; only the mini-card is hidden and the full form is restored. The "no subs" cleanup that was here is handled by the callers (`cancelSubEditor`, `removeSubItem`) which run it only when the count actually drops to zero.
- **`styles-topics.css`** â€” Added `.add-stepper`, `.add-step`, `.add-step-num`, `.add-step-label`, `.add-step-connector`, `.add-step-pane`, `.step-pane-lead`, `.game-option-cards`, `.game-option-card`, `.goc-icon`, `.goc-body`, `.goc-title`, `.goc-desc` styles for the stepper and game-option cards.
- **`index-topics.html`** â€” `script-topics.js` version bumped to `?v=53`.

### Removed
- **`addTopic()`** â€” "Also create a game" toggle and Normal/AI segmented control removed from the normal add flow (they remain in the AI flow via `createGameToggleHtml()`). Game creation is now handled by the Step 3 option cards.
- **`addTopic()`** â€” "Topic" tab removed; the two-tab layout is gone from the normal add flow (AI flow tabs unchanged).

## [2026-05-27] â€” Generate Game AI: Move Topic dropdown below AI Model selector

### Changed
- **`script-games.js`** â€” "Topic (optional)" dropdown moved from the bottom of the Content tab to immediately after the AI Model selector. Version bumped to `?v=85`.

## [2026-05-27] â€” Add Game: Remove "Add content" card

### Removed
- **`script-games.js`** â€” "Add content" card button and the hidden content picker form removed from the manual Add Game panel. Version bumped to `?v=84`.

## [2026-05-27] â€” Generate Game AI: Replace "Link to topic" toggle with plain dropdown

### Changed
- **`script-games.js`** â€” Replaced the "Link to a topic" toggle + hidden dropdown row with a plain `Topic (optional)` label + `Select a topic` dropdown, matching the manual Add Game panel style exactly.
- **`script-games.js`** â€” `toggleAIGameTopicLink` function removed (no longer needed). Version bumped to `?v=83`.

## [2026-05-27] â€” Generate Game AI: Add "Link to topic" toggle to Content tab

### Added
- **`script-games.js`** â€” "Link to a topic" toggle added to the bottom of the Content tab (after the categories toggle). Off by default (standalone game). When switched on, shows a topic dropdown populated from the current scope's topics.
- **`script-games.js`** â€” `toggleAIGameTopicLink(checkbox)` â€” shows/hides the topic dropdown row; clears `_aiGamePendingTopic` when toggled off.
- **`script-games.js`** â€” `onAIGameTopicChange` updated to find the categories toggle label by content scan (robust to DOM restructure). Selecting a topic with sub-topics updates the categories toggle label to "Use topic categories & generate questions"; deselecting resets it.
- **`script-games.js`** â€” Blue info note (`#aiGameContentSkipNote`) shown below the dropdown when a topic with sub-topics is selected: "Topic sub-topics will be used as game categories". Version bumped to `?v=82`.
- **`styles-games.css`** â€” `.ai-topic-linked-note` styles added (blue info pill).

## [2026-05-27] â€” Generate Game AI: Remove difficulty ratio display

### Removed
- **`script-games.js`** â€” Difficulty ratio info row removed from the generate block. Version bumped to `?v=81`.
- **`styles-games.css`** â€” `.ai-diff-info` styles removed.

## [2026-05-27] â€” Generate Game AI: Add read-only difficulty ratio to generate block

### Added
- **`script-games.js`** â€” Difficulty info row added to the generate block (visible before generation): ðŸ”’ "Difficulty per category: Easy Â· Medium Â· Hard â€” set by backend". Non-editable, communicates the backend-controlled ratio per the user story. Version bumped to `?v=80`.
- **`styles-games.css`** â€” `.ai-diff-info`, `.ai-diff-info-lock`, `.ai-diff-info-note` styles added.

## [2026-05-27] â€” Generate Game AI: Remove credits used display from Game tab

### Removed
- **`script-games.js`** â€” "X / Y AI credits used" row removed from the Game tab. Version bumped to `?v=79`.
- **`styles-games.css`** â€” `.ai-credits-estimate` styles removed.

## [2026-05-27] â€” Generate Game AI: Use actual input content to shape generated output

### Changed
- **`script-games.js`** â€” `_deriveAIGameContext()` added â€” reads the URL input (extracts brand from domain), prompt text, uploaded file name, and text body to produce a `{ topic, brand }` context object.
- **`script-games.js`** â€” `_contextCats(brand, suggestion)` added â€” maps the brand name onto category names ("Weelee Overview", "Weelee Products & Services", etc.) instead of using generic mock category names.
- **`script-games.js`** â€” `_renderAIGameResults` now uses the derived context: game name becomes "[Topic] Knowledge Challenge", description becomes "Test your knowledge of [topic].", and category names are branded if a URL was provided. Linked-topic data still takes priority. Version bumped to `?v=78`.

## [2026-05-27] â€” Generate Game AI: Move estimated credit spend to Game tab (last step)

### Changed
- **`script-games.js`** â€” Estimated credits moved from the Content tab to the bottom of the Game tab (shown after generation as "X / Y AI credits used"). Version bumped to `?v=77`.
- **`styles-games.css`** â€” `.ai-credits-estimate` styles restored for the Game tab position.

## [2026-05-27] â€” Generate Game AI: Revert question type picker and Q-count additions

### Removed
- **`script-games.js`** â€” Question type radio grid, questions per category stepper, and estimated credits row removed from the Content tab (reverted to upload / URL / text / categories toggle only). Version bumped to `?v=76`.
- **`styles-games.css`** â€” `.ai-credits-estimate` styles removed.

## [2026-05-27] â€” Generate Game AI: Remove difficulty mix display from Game tab

### Removed
- **`script-games.js`** â€” "Difficulty mix" (1 Easy / 1 Medium / 1 Hard chips) removed from the generated Game tab. Version bumped to `?v=75`.

## [2026-05-27] â€” Generate Game AI: Question type picker, Q-count stepper, estimated credits

### Added
- **`script-games.js`** â€” `_AI_Q_TYPES` constant â€” the 7 question types defined in the user story (MCQ, Fill in the Blank, Statement Blanking, Select on Image, Match the Terms, Word Bucket, Crossword).
- **`script-games.js`** â€” `_aiGameQTypeGridHtml()` â€” builds the 2-column radio-card grid for the Content tab; first selection defaults to MCQ.
- **`script-games.js`** â€” **Question type** section added to the Content tab â€” single-select radio cards (one type per game as per user story).
- **`script-games.js`** â€” **Questions per category** stepper (1â€“20, default 5) added to the Content tab; `stepAIGameQCount(delta)` handles button clicks.
- **`script-games.js`** â€” `updateAIGameCreditsEstimate()` â€” computes estimated AI credits (base 1 + 0.4 Ã— Q-count, Ã—3 weight if categories on) and updates the `#aiGameCreditsEstVal` span; called on question count, type, and categories-toggle changes.
- **`script-games.js`** â€” Estimated credits row added inside the generate block, above the Generate button, with a gold coin icon. Version bumped to `?v=74`.
- **`styles-games.css`** â€” `.ai-credits-estimate` styles added (flex row, coin icon in amber, bold count value).

## [2026-05-27] â€” Generate Game AI: Tab-based flow matching Topics AI panel

### Changed
- **`script-games.js`** â€” Generate Game AI panel restructured to mirror the Topics AI flow:
  - Tab bar at top: **Content** (active on open) | **Game** (disabled until first generate) | **Categories** (hidden, appears with count badge after generate if categories were requested)
  - Content pane contains AI MODEL, UPLOAD, URL, TEXT, and the "Generate with categories & questions" toggle â€” unchanged fields, new layout
  - Game pane (cover, name, description, max attempts, difficulty mix) and Categories pane (accordion of categories with questions) are now persistent tab panes, not rebuilt inside `aiGameStep2`
  - On first Generate â†’ spinner in button â†’ fills Game + Categories panes â†’ switches to Game tab
  - Subsequent generates respect the active tab: Game tab â†’ "Regenerate Game" rebuilds game pane only; Categories tab â†’ "Regenerate Categories" rebuilds categories only; Content tab â†’ "Regenerate" rebuilds both
  - `updateAIGameGenBtnLabel()` added â€” updates button label and prompt placeholder based on active tab (mirrors Topics' `updateAIGenBtnLabel`)
  - `switchAIGameTab(tab)` replaces old `switchGameAITab` (tab bar ID was `aiGameTabsBar`, now `aiGameTabBar` to match Topics pattern)
  - Removed: `collapseAIGameStep1`, `expandAIGameStep1`, `switchGameAITab`, `updateAIGameCreditsEstimate`, step-progress animation
  - `_aiGameHasGenerated` state variable added (mirrors Topics' `_aiHasGenerated`)
- `script-games.js` version bumped to `?v=73`.

## [2026-05-27] â€” Generate Game: Fix "Create Game" button visible but disabled during AI generation

### Fixed
- **`script-games.js`** â€” "Create Game" button was showing (disabled) during the Generate Game flow because DevExtreme's CSS reset overrides the HTML `hidden` attribute. Switched all `submitBtn.hidden = true/false` to `submitBtn.classList.add/remove('hidden')`, which hits `.hidden { display: none !important; }` from `styles.css` and wins.
- **`script-games.js`** â€” After `generateAIGame()` completes, button now re-labels as "Create Game" (was "Save"). Version bumped to `?v=72`.

## [2026-05-27] â€” Add Game: Move "Add content" card above Configure accordion

### Changed
- **`script-games.js`** â€” "Add content" card section now renders before the Configure accordion (previously it was after). Version bumped to `?v=71`.

## [2026-05-27] â€” Add Game: Remove "Add categories" card (categories managed in background)

### Removed
- **`script-games.js`** â€” "Add categories" card button removed from the Add Game panel; the BA confirmed categories are managed in the background, not by the admin.
- **`script-games.js`** â€” `openGameCategoriesForm`, `cancelGameCategoriesForm`, `saveGameCategoriesForm`, `addGameCategoryItem`, `removeGameCategoryItem` functions removed (dead code).
- **`styles-games.css`** â€” `.game-choice-cards` 2-column grid removed.

### Changed
- **`script-games.js`** â€” "Add content" card is now full-width (`.btn-choice-full`); container `#gameChoiceCards` retained for the show/hide toggle.
- **`styles-games.css`** â€” Added `.btn-choice-full { width: 100%; }` in place of the grid.
- `script-games.js` version bumped to `?v=70` (`index-games.html`, `index-questions.html`).

## [2026-05-27] â€” Topics: sentence-case labels + choice prompt moved outside picker

### Changed
- **`styles-topics.css`** â€” added `#detailEdit .form-group label` override to remove `text-transform: uppercase` and `letter-spacing` so all Add/Edit panel labels display in sentence case.
- **`script-topics.js`** â€” "What would you like to add to this topic?" moved out of the `.choice-picker` block and rendered as a `<label>` in its own `form-group` above the picker.

## [2026-05-27] â€” Topics: updated "Add sub-topics" hint text

### Changed
- **`script-topics.js`** â€” "Add sub-topics" hint updated to "Create multiple learning topics".

## [2026-05-27] â€” Topics: side-by-side choice buttons + updated hint text

### Changed
- **`styles-topics.css`** â€” `.choice-buttons` grid changed from `1fr` to `1fr 1fr` so "Add content" and "Add sub-topics" sit side by side.
- **`script-topics.js`** â€” "Add content" hint updated to "Provide a single file, video URL or text".

## [2026-05-27] â€” Topics: "Also create a game" toggle with inline flow picker

### Changed
- **`script-topics.js`** â€” renamed "Create with game" toggle to "Also create a game" for clarity.
- **`script-topics.js`** â€” `createGameToggleHtml()` now wraps the toggle and a new segmented control (`Normal | AI`) in a `.create-game-row` flex container; the segmented control is hidden until the toggle is switched on (`onCreateGameToggleChange`).
- **`script-topics.js`** â€” `selectGameFlow(btn)` handles Normal / AI button selection within the picker.
- **`script-topics.js`** â€” `_pendingGameFlow` variable added; captured from `#gameFlowPicker` at Save time and written into `gameon.pendingGame` localStorage payload as `gameFlow`.
- **`script-topics.js`** â€” `doAIGenerate` preserves and restores both the toggle state and the selected flow when the topic pane is rebuilt during AI regeneration.
- **`styles-topics.css`** â€” `.create-game-row`, `.game-flow-picker`, `.game-flow-btn` styles added.
- `script-topics.js` version bumped to `?v=52`.

## [2026-05-27] â€” Add Game: Content and Categories as card buttons (no prompt wrapper)

### Changed
- **`script-games.js`** â€” Replaced accordion toggles with the original card-button style (`.btn-choice`): two cards in a 2-column grid, no dashed wrapper box, no prompt text. Each card toggles its body section open/closed and highlights blue when active.
- **`script-games.js`** â€” `toggleGameSection(bodyId, btn)` added: toggles the section, syncs the card's `.btn-choice-active` class, focuses the category input when opening categories.
- **`styles-games.css`** â€” `.game-choice-cards` (2-column grid) and `.btn-choice-active` (blue highlight) added; removed old `.game-section-row/col` rules.
- `script-games.js` version bumped to `?v=68`.

## [2026-05-27] â€” Add Game: Content and Categories accordions side by side

### Changed
- **`script-games.js`** â€” Content and Categories accordion sections are now wrapped in `.game-section-row` so they sit next to each other. When either body is expanded it stretches to full width via `:has()` CSS.
- **`styles-games.css`** â€” `.game-section-row` / `.game-section-col` flex layout added; `:has(.add-game-advanced-body:not(.hidden))` expands an open column to full width.
- `script-games.js` version bumped to `?v=67`.

## [2026-05-27] â€” Add Game: replace choice picker with collapsible accordions

### Changed
- **`script-games.js`** â€” Removed the "What would you like to add?" choice picker. Content and Categories are now two collapsible accordions (same `.add-game-advanced` / `.add-game-advanced-toggle` / `.add-game-advanced-body` pattern as Configure), both collapsed by default.
- **`script-games.js`** â€” `toggleAddGameAdvanced` now reads `btn.dataset.body` to support all three accordions (Configure, Content, Categories) with one function.
- **`script-games.js`** â€” Removed `chooseAddGameContent`, `chooseAddGameCategories`, `removeGameContent`, `_syncGameChoiceBtns` (all replaced by the shared accordion toggle).
- **`styles-games.css`** â€” Removed `.btn-choice-active` rule (no longer needed).
- `script-games.js` version bumped to `?v=66`.

## [2026-05-27] â€” Add Game: choice picker stays visible; both sections can be open together

### Changed
- **`script-games.js`** â€” `chooseAddGameContent` and `chooseAddGameCategories` no longer hide the choice picker. Instead they **toggle** the respective section open/closed so both content and categories can be expanded simultaneously.
- **`script-games.js`** â€” `_syncGameChoiceBtns()` added: keeps the two choice buttons highlighted (`.btn-choice-active`) when their section is open.
- **`styles-games.css`** â€” `.btn-choice-active` style added (blue border + light blue background) to indicate an open section.
- `script-games.js` version bumped to `?v=65`.

## [2026-05-27] â€” Add Game: content picker and categories choice (matches Add Topic)

### Added
- **`script-games.js`** â€” Add Game panel now has a **choice picker** at the bottom (same `.choice-picker` / `.btn-choice` pattern as Add Topic): "Add content" (PDF/image/video URL/text) and "Add categories" (inline category list).
- **`script-games.js`** â€” `_gameContentPickerHtml()` â€” generates Upload / Web URL / Text tab picker HTML reusing Topics' `.content-picker` / `.content-kind-tab` / `.content-pane` / `.cp-dropzone` CSS classes.
- **`script-games.js`** â€” `setGameContentKind`, `onGameContentFileChange`, `onGameContentFileDrop` â€” content picker interaction handlers.
- **`script-games.js`** â€” `chooseAddGameContent` / `removeGameContent` â€” show/hide the content section.
- **`script-games.js`** â€” `chooseAddGameCategories` / `removeGameCategories` â€” show/hide the inline category add section (requires game name before opening).
- **`script-games.js`** â€” `addGameCategoryItem`, `removeGameCategoryItem`, `renderGameAddCatList` â€” manage the staged `_gameAddCats` list with an Add row and removable chips.
- **`script-games.js`** â€” `saveGameAdd` now seeds the new game's `categories` array from `_gameAddCats` if any were staged.
- **`styles-games.css`** â€” `.game-cat-add-row`, `.game-add-cat-list`, `.game-add-cat-item`, `.btn-icon-sm` for the category add UI.
- `script-games.js` version bumped to `?v=64`.

## [2026-05-27] â€” Generate Game AI: fix "Generate Game" button being removed on open

### Fixed
- **`script-games.js`** â€” `addGameAI()` called `setGamePanelMode('add')` **after** setting `gameEditFields.innerHTML`, so `setGamePanelMode` found and removed the freshly-injected `aiGameGenerateBtn`. Moved `setGamePanelMode('add')` to run **before** the `innerHTML` assignment so the generate button survives. Removed the now-redundant second `setGamePanelMode` / `_isAIGameFlow = true` call at the bottom of the function.
- `script-games.js` version bumped to `?v=63`.

## [2026-05-27] â€” Generate Game AI: remove Questions tab

### Removed
- **`script-games.js`** â€” "Questions" tab button removed from the Generate Game AI panel tab bar (the "Generate with categories & questions" toggle at the bottom already covers this). The entire `aiGameSetupPaneQuestions` pane (question-type picker + count slider) is removed. `collapseAIGameStep1`, `expandAIGameStep1`, and `switchAIGameSetupTab` simplified â€” no longer reference the now-gone Questions pane or tab bar.
- `script-games.js` version bumped to `?v=62`.

## [2026-05-27] â€” Share Game panel: date tag shows scheduled From â€“ To range

### Changed
- **`script-games.js`** â€” The date tag next to already-shared departments in the Share panel now shows the game's **scheduled date range** (e.g. "30 May â€“ 30 Jun '26") instead of the single share date. New helper `_fmtScheduleTag(start, end)` produces the compact format; tag is omitted when no schedule dates are set.
- `script-games.js` version bumped to `?v=61`.

## [2026-05-27] â€” Games list: shares badge opens Share panel

### Changed
- **`script-games.js`** â€” `_buildShareChip` now fires `openGameSharePanelFromChip(this)` on click (in addition to stopping propagation); new helper `openGameSharePanelFromChip` walks up to the nearest `tr.row-game` and calls `openGameSharePanel`. Clicking the "X shares" badge on any game row now opens the Share panel for that game.
- `script-games.js` version bumped to `?v=60`.

## [2026-05-27] â€” Share Game panel: remove From / To date inputs

### Removed
- **`script-games.js`** â€” From / To date fields removed from the Share panel body; date-change detection removed from `syncGameShareConfirmButton`; date reading/applying removed from `confirmGameSharePanel`.
- **`styles-games.css`** â€” `.share-date-row` rule removed.
- `script-games.js` version bumped to `?v=59`.

## [2026-05-27] â€” Games list: remove scheduled date chip from rows

### Changed
- **`script-games.js`** â€” `gameRowHtml` and `updateGameRowChips` no longer render the `.chip-scheduled` date chip on game list rows. The `scheduledDate` / `scheduledEndDate` values are still stored on the row's `dataset` so the Share panel can read and pre-fill the From / To fields.
- `script-games.js` version bumped to `?v=58`.

## [2026-05-27] â€” Share Game panel: show scheduled date range from Schedule step

### Changed
- **`script-games.js`** â€” `openGameSharePanel` now renders a **From / To** date row (separated by a divider) below the department checkbox list; dates are pre-filled from the game row's `scheduledDate` / `scheduledEndDate` (i.e. whatever was set via the Schedule kebab option).
- **`script-games.js`** â€” `syncGameShareConfirmButton` now also detects changes to the date inputs and enables "Save" when either the dept selection OR the dates have changed.
- **`script-games.js`** â€” `confirmGameSharePanel` reads the date inputs and applies them to the game row (finding the fresh DOM node after any `refreshGames()` re-render), then calls `updateGameRowChips` and `persistGamesScope`.
- **`styles-games.css`** â€” `.share-date-row` re-added with a top border/divider to visually separate it from the dept list.
- `script-games.js` version bumped to `?v=57`.

## [2026-05-27] â€” Share Game panel: match Topics share panel design

### Changed
- **`script-games.js`** â€” `openGameSharePanel(gameRow, opts)` completely rewritten: replaced the collapsible checkbox-dropdown with a flat `.share-dept-list` (same markup as Topics), showing a date tag on already-shared departments. `opts.isNew = true` pre-checks the current department and keeps the confirm button always enabled (used after creating a new game).
- **`script-games.js`** â€” `syncGameShareConfirmButton` now shows "No changes" / "Save" dynamically (enabled only when the selection has changed from the initial state), matching the Topics share panel.
- **`script-games.js`** â€” `confirmGameSharePanel` now diffs initial vs current selection to produce `toShare` / `toUnshare` lists; calls new `unshareGameFromDepts` for removals; removed From/To date input handling.
- **`script-games.js`** â€” `unshareGameFromDepts(companyKey, gameName, deptNames)` added: removes a game from target departments' `GAMES_BY_SCOPE` buckets and trims the source game's `sharedDepts` array.
- **`script-games.js`** â€” Helper functions added: `formatGameSharedDate`, `getGameSharedDepts`, `getGameSharedDate`.
- **`index-games.html`** â€” confirm button initial label changed to "No changes" (updated dynamically by `syncGameShareConfirmButton`).
- **`styles-games.css`** â€” removed `.share-date-row` rule (date inputs removed from share panel).
- `script-games.js` version bumped to `?v=56`.

## [2026-05-27] â€” Share Game panel: date chip appears on main game list

### Fixed
- **`script-games.js`** â€” `confirmGameSharePanel()` was calling `updateGameRowChips` on a stale (detached) DOM node because `refreshGames()` had already re-rendered all rows. Now queries `tr.row-game[data-name]` to find the fresh node after the refresh before applying dates and updating chips. `script-games.js` version bumped to `?v=55`.

## [2026-05-27] â€” Share Game panel: From / To date fields

### Added
- **`script-games.js`** â€” `openGameSharePanel()` now renders a two-column "From / To" date row (`#shareStartDate` / `#shareEndDate`) below the department dropdown; pre-fills if the game row already has scheduled dates.
- **`script-games.js`** â€” `confirmGameSharePanel()` reads the date inputs and applies them to the game row (`dataset.scheduledDate` / `scheduledEndDate`), then calls `updateGameRowChips` and `persistGamesScope` so the date chip appears immediately on the row.
- **`styles-games.css`** â€” `.share-date-row` â€” two-column grid for the date inputs.
- `script-games.js` version bumped to `?v=54`.

## [2026-05-27] â€” Topics "Also create a game": AI flow routes to Generate Game AI panel

### Changed
- **`script-games.js`** â€” `_checkPendingGame()` now reads `pending.gameFlow` from `gameon.pendingGame`; when it is `'ai'`, calls `addGameAI()` (Generate Game AI panel) instead of `addGame()` (manual panel). `script-games.js` version bumped to `?v=53`.

## [2026-05-27] â€” Add Game Configure: rename "Questions per session" label

### Changed
- **`script-games.js`** â€” Configure field label changed from "Questions per session" to "Questions for this game".

## [2026-05-27] â€” Games detail panel: remove inner scroll

### Changed
- **`styles-games.css`** â€” `#gameEditFields` changed from `overflow-y: auto / flex: 1` to `overflow: visible / flex: none` â€” content no longer has its own scrollbar.
- **`styles-games.css`** â€” `#detailEdit` set to `overflow-y: auto` and `#detailEdit .edit-form` set to `overflow: visible / flex: none` so the whole panel scrolls as one unit.
- **`styles-games.css`** â€” `#detailPanel.open` set to `overflow-y: auto` to allow the panel container itself to scroll.

## [2026-05-27] â€” Add Game Configure: two-column layout

### Changed
- **`script-games.js`** â€” Max Attempts and Questions per Session moved into a `.configure-grid` two-column row; Pass Threshold stays full-width below. Inline `style="width:100px"` removed from the two grid inputs.
- **`styles-games.css`** â€” `.configure-grid` added: `display: grid; grid-template-columns: 1fr 1fr; gap: 12px`.
- `script-games.js` version bumped to `?v=52`.

## [2026-05-27] â€” Add Game Configure: remove hint text below inputs

### Removed
- **`script-games.js`** â€” "Defaults to X if left empty" hint spans removed from Max Attempts, Questions per Session, and Pass Threshold fields in the Configure section. `script-games.js` version bumped to `?v=51`.

## [2026-05-27] â€” Detail panel: title and scope subtitle on same line

### Changed
- **`styles.css`** â€” `.detail-header` changed to `display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap` so the panel title (`h3`) and scope subtitle (`.detail-parent`) render on the same line, matching the Topics AI panel style. Applies to all detail panels (games, topics, users, companies).

## [2026-05-27] â€” Generate Game AI: remove "Link to topic" dropdown

### Removed
- **`script-games.js`** â€” "Link to topic (optional)" dropdown removed from the Generate Game AI panel's generate block. `script-games.js` version bumped to `?v=50`.

## [2026-05-27] â€” Generate Game AI: topbar and content layout matches Topics AI panel

### Changed
- **`index-games.html`** â€” Credit pill element changed from custom `ai-panel-credit-bal` to the shared `ai-credits-display` class (same orange/red coin pill as topics); inner HTML uses `#aiGameCreditsCount` / `#aiGameCreditsTotal` spans so JS updates them individually.
- **`script-games.js`** â€” `addGameAI()` title updated to "Generate Game"; badge text updated to "Generating with AI" to match topics badge wording.
- **`script-games.js`** â€” `addGameAI()` content pane restructured: AI MODEL first â†’ UPLOAD (always visible, `ai-upload-zone` style) â†’ URL (always visible) â†’ TEXT (always visible, RTE toolbar matching topics) â†’ Generate with categories toggle. Mini-tab switcher removed.
- **`script-games.js`** â€” `addGameAI()` bottom block: prompt text input + full-width "Generate Game" button (`ai-generate-block`) replaces the dynamically-injected button in the edit-actions bar. Topic link dropdown moved into this block.
- **`script-games.js`** â€” `onAIGameFileDrop` helper added for drag-and-drop on the new upload zone.
- **`script-games.js`** â€” Credit display JS updated to write `#aiGameCreditsCount` / `#aiGameCreditsTotal` spans instead of setting innerHTML on the container.
- `script-games.js` version bumped to `?v=49`.

## [2026-05-27] â€” Add Game: question type picker resumes after share step

### Changed
- **`script-games.js`** â€” `_postShareCallback` state variable added; set to `showQTypePickerForNewGame` when the share panel opens from a new-game save.
- **`script-games.js`** â€” `confirmGameSharePanel()` and `cancelGameSharePanel()` fire `_postShareCallback` (if set) instead of `showGameEmpty()`, so the question type picker appears immediately after sharing/skipping â€” whether the user shares or cancels.
- `script-games.js` version bumped to `?v=48`.

## [2026-05-27] â€” Add Game: share as separate panel after save

### Changed
- **`script-games.js`** â€” "Share with departments" section removed from the Add Game form; the form now ends at Configure.
- **`script-games.js`** â€” `saveGameAdd()` (manual flow): after the game is created, the dedicated Share panel (`detailShare`) opens automatically via `openGameSharePanel(gameRow)` â€” the same panel used from the kebab menu â€” with title, game name, dept checkboxes, and Cancel / Share buttons.
- `script-games.js` version bumped to `?v=47`.

## [2026-05-27] â€” Add Game: rename "Advanced" toggle to "Configure"

### Changed
- **`script-games.js`** â€” `addGame()` form: collapsible settings toggle label changed from "Advanced" to "Configure". `script-games.js` version bumped to `?v=46`.

## [2026-05-27] â€” Add Game: topic always pre-selected in dropdown when arriving from Topics page

### Fixed
- **`script-games.js`** â€” `_checkPendingGame()` no longer falls back to filling the Name field with the topic name. Instead, if the topic isn't already in the dropdown options, a new option is injected and selected â€” so the topic name always appears selected in the TOPIC dropdown.
- `script-games.js` version bumped to `?v=45`.

## [2026-05-27] â€” Add Game: cover image swatch picker replaces drag-drop zone

### Changed
- **`script-games.js`** â€” `addGame()` form layout updated: "Cover Image" section (swatch picker with 3 gradient presets + Upload tile) now appears first, matching the Add Topic panel; Topic dropdown is immediately below it.
- **`script-games.js`** â€” `_setAddGameCoverPreview(src)` rewritten to drive the swatch picker: selects the matching preset tile when the cover is a preset gradient, otherwise populates and selects the upload tile.
- **`script-games.js`** â€” `saveGameAdd()` now reads the cover via `readGameCoverPicker()` (`.cover-hidden-input`) instead of the old `#addGameCoverHidden` element.

### Removed
- **`script-games.js`** â€” Dead `saveAddGameModal()` function (never called â€” form submits to `saveGameAdd`).
- **`script-games.js`** â€” Dead `previewAddGameCover()` function (belonged to the old drag-drop zone).
- `script-games.js` version bumped to `?v=44`.

## [2026-05-27] â€” Simplify: script-games.js cleanup

### Changed
- **`script-games.js`** â€” `_checkPendingGame()` refactored: merged double `if (pending.topicName)` block into a single `topicFound` flag; fallback branch only runs when the topic was not found in the dropdown. Replaced inline cover-zone DOM manipulation with `_setAddGameCoverPreview()`.
- **`script-games.js`** â€” Topic option scan converted from `Array.from().forEach()` to a `for/break` loop for early exit once a match is found.
- **`script-games.js`** â€” Removed empty `$(function(){})` Init block (comment noted it was already handled by a `document.addEventListener` above).
- `script-games.js` version bumped to `?v=43`.

## [2026-05-27] â€” Add Game panel: topic at top + pre-selected from topics page

### Changed
- **`script-games.js`** â€” `addGame()` form reordered: TOPIC dropdown is now the first field (above cover zone, Name, Description) so selecting a topic auto-fills the rest.
- **`script-games.js`** â€” `_checkPendingGame()` now pre-selects the matching topic option in `#addGameTopic` and fires `onAddGameTopicChange()` to auto-fill name/description/cover; falls back to manual field fill if the topic isn't in the dropdown.
- `script-games.js` version bumped to `?v=42`.

## [2026-05-27] â€” Games page: share chip hover shows department names

### Added
- **`script-games.js`** â€” `_buildShareChip(depts)` helper renders the share pill with an inline hover tooltip listing each shared department name.
- **`styles-games.css`** â€” `.shares-tooltip` and `.shares-tt-item` â€” tooltip panel that appears below the chip on hover.

### Changed
- `script-games.js` version bumped to `?v=41`.

## [2026-05-27] â€” Games page: share count pill on game rows

### Added
- **`script-games.js`** â€” `shareGameWithDepts` now appends each target department to `sourceGame.sharedDepts[]` (deduped); shared copies get an empty `sharedDepts: []` so they don't carry the parent's share list.
- **`script-games.js`** â€” `gameRowHtml` reads `game.sharedDepts`, stores it in `data-shared-depts`, and renders a `chip-shares` pill ("1 share" / "N shares") between the date chip and the Active chip.
- **`script-games.js`** â€” `updateGameRowChips` refreshes the `cell-share` span from `data-shared-depts` after any chip update.
- **`script-games.js`** â€” `persistGamesScope` saves `sharedDepts` from `data-shared-depts` so the count survives page refresh.
- **`styles-games.css`** â€” `.chip-shares` â€” grey neutral chip matching the live site "1 share" style.
- `script-games.js` version bumped to `?v=40`.

## [2026-05-26] â€” Share departments: checkbox dropdown component

### Added
- **`script-games.js`** â€” `_buildShareDeptDropdown(items, wrapperId, menuId)` helper builds a reusable checkbox-dropdown: trigger button with chevron, collapsible menu, label reflects selection count.
- **`script-games.js`** â€” `window.toggleShareDropdown(id, e)` opens/closes a dropdown by ID; closes any other open dropdowns automatically.
- **`script-games.js`** â€” `window.syncShareDropdownLabel(id)` updates the trigger label ("Select departmentsâ€¦" / single name / "N departments selected") and re-syncs the Share confirm button.
- **`script-games.js`** â€” document `click` listener closes all open share dropdowns when clicking outside.
- **`styles-games.css`** â€” `.share-dept-dropdown`, `.share-dept-trigger`, `.share-dept-menu`, `.sdd-label`, `.sdd-chevron` â€” full dropdown component styles with open/close transitions.

### Changed
- **`script-games.js`** â€” `buildGameShareTabHtml()` now renders the dropdown instead of a fixed scrollable list; checkboxes retain `name="shareDept"` so save logic is unchanged.
- **`script-games.js`** â€” `openGameSharePanel()` now renders the dropdown with `id="gameShareDeptList"` on the menu element so existing confirm-button sync still works.
- `script-games.js` version bumped to `?v=39`.

## [2026-05-26] â€” Schedule panel: pre-fill existing dates

### Changed
- **`script-games.js`** â€” `buildScheduleBodyHtml(existingStart, existingEnd)` now accepts optional date values and pre-fills the Start/End date inputs when re-opening the Schedule panel on a game that already has dates set.
- **`script-games.js`** â€” `openGameSchedulePanel` passes `gameRow.dataset.scheduledDate` and `gameRow.dataset.scheduledEndDate` to the panel so existing dates are visible immediately.
- `script-games.js` version bumped to `?v=38`.

## [2026-05-26] â€” Games page: difficulty donut tooltip + difficulty tracking

### Added
- **`script-games.js`** â€” difficulty donut is now a 3-segment pie (green=Easy, orange=Medium, red=Hard) matching the live site.
- **`script-games.js`** â€” hover tooltip on each donut shows "Easy X% / Medium X% / Hard X%" with coloured dots; tooltip dismisses on mouse-out and does not trigger row click.
- **`styles-games.css`** â€” `.donut-tooltip`, `.donut-tt-row`, `.donut-tt-dot` â€” tooltip panel styles.

### Changed
- **`script-games.js`** â€” `_difficultyDonutSvg(easy, medium, hard)` now takes counts per level; segments computed via `rotate()` transform on each SVG `circle`.
- **`script-games.js`** â€” `qRowHtml` stores `data-difficulty` on every question row so `updateGameRowChips` can re-read it after DOM edits.
- **`script-games.js`** â€” `persistGamesScope` now saves `difficulty` field on each saved question.
- `script-games.js` version bumped to `?v=37`.

## [2026-05-26] â€” Games page: schedule date range + difficulty donut chart

### Added
- **`script-games.js`** â€” `_fmtDate(iso)` and `_fmtDateRange(start, end)` helpers format schedule dates as "Mon DD, YYYY â€“ Mon DD, YYYY" (matching live site).
- **`script-games.js`** â€” `_difficultyDonutSvg(totalQ, catCount)` renders an inline SVG donut ring per game row; arc fill = total questions / (categories Ã— 5 required); orange when incomplete, green when complete.
- **`styles-games.css`** â€” `.game-donut` flex wrapper for the donut SVG; updated `.chip-scheduled` to blue palette (`#eff6ff` bg, `#1d4ed8` text, `#3b82f6` icon) to match live site.

### Changed
- **`script-games.js`** â€” `gameRowHtml` now includes `data-scheduled-end-date` attribute, shows the full date range in the scheduled chip, and appends the donut SVG between the status chip and the actions menu.
- **`script-games.js`** â€” `updateGameRowChips` updated to display the full date range (start â€“ end) and refresh the donut SVG in-place.
- **`script-games.js`** â€” `persistGamesScope` now saves `scheduledEndDate` from `data-scheduled-end-date` on the game row.
- `script-games.js` version bumped to `?v=36`.

## [2026-05-26] â€” Questions page: remove redundant empty state

### Removed
- **`index-questions.html`** â€” removed the `#questionsEmpty` block (icon + "No questions yet" text + duplicate Import/Add buttons); the header already has these buttons permanently.

### Changed
- **`index-questions.html`** â€” `#questionsHeaderActions` is now always visible (removed `hidden` attribute); no longer toggled by question count.
- **`script-questions.js`** â€” `renderQuestionsPage()` simplified: always shows and renders the question list, removing dead empty-state and header-actions toggling logic.

## [2026-05-26] â€” Questions page layout match (Done button + row styling)

### Changed
- **`index-questions.html`** â€” moved `#questionsDoneBar` inside `<main>` (after `#questionsList`), removed the stale fixed-position copy outside the layout.
- **`styles-questions.css`** â€” `.questions-done-bar` is now inline right-aligned (`display: flex; justify-content: flex-end`) instead of `position: fixed`. Button style changed to dark solid (`background: #374151`, white text, `border-radius: 8px`) to match live site.
- **`styles-questions.css`** â€” `.qlist-row` now has a light grey filled background (`#f3f4f6`), horizontal padding (`12px 16px`), `border-radius: 8px`, and `gap: 6px` between rows; removed the old bottom-border separator.

## [2026-05-26] â€” Questions page visual polish

### Changed
- **`styles-questions.css`** â€” answer chip colours corrected to match live site:
  - Incorrect answers: grey background (`#f3f4f6`), grey border (`#e5e7eb`), grey text (`#6b7280`).
  - Correct answer (`.q-answer-chip--correct`): green filled (`#dcfce7` bg, `#86efac` border, `#166534` text, bold).
- **`styles-questions.css`** â€” added `.questions-saved-toast` â€” full-width green banner fixed at bottom (`background: #22c55e`), with white checkmark-circle icon and "Questions saved successfully." text, auto-hides after 3.5 s.
- **`index-questions.html`** â€” added `#questionsSavedToast` element (hidden by default) for the success toast.
- **`script-questions.js`** â€” added `showQSavedToast()` helper; called in `submitAddQuestion` after every successful save; also shown on page-load when arriving after a save (i.e., questions exist and `openPicker` is false).

## [2026-05-26] â€” Questions page (index-questions.html)

### Added
- **`index-questions.html`** â€” new full page for managing a category's questions, matching the live site.
  - Back arrow (â† ) returns to Games page.
  - Orange warning banner when fewer than 5 questions exist: *"At least 5 questions are required before this category can be used in a game."*
  - Empty state: large question-mark icon, "No questions yet. Add the first one.", Import from Excel + Add Question buttons.
  - Numbered question rows: question text + MCQ/type chip, answer chips (correct answer highlighted green), pencil + trash action icons.
  - **Done** button fixed bottom-right.
  - **+ Add Question** header button (shown once questions exist); opens the type picker in the right detail panel.
- **`script-questions.js`** â€” Questions page controller (IIFE):
  - Reads `gameon.questionsNav` localStorage key written by the Games page on save.
  - Loads game/category from `gameon.games.scope` localStorage.
  - Overrides `_doSaveQuestion` to write directly to localStorage (no DOM table on this page).
  - Overrides `submitAddQuestion` / `saveQAndAddAnother` to stay on this page and re-render.
  - Overrides `onGamesScope` to prevent games-table re-render on scope change.
  - Handles question delete; edit stub (toast "coming soon").
- **`styles-questions.css`** â€” page-specific styles: warning banner, empty state, question list rows, type chip, answer chips, done bar.
- **`script-games.js`**: `submitAddQuestion` and `saveQAndAddAnother` now navigate to `index-questions.html` via `_navigateToQuestionsPage(gameId, catId, openPicker)` which stores context in `gameon.questionsNav`.
- `openAddQuestionForm` made resilient when no DOM cat row exists (questions page); hidden `input[name="questionType"]` added so the type is recorded on save.
- `script-games.js` version bumped to `?v=35`.

## [2026-05-26] â€” Add Question form: dynamic options + separate Correct Answer section

### Changed
- **Answer Options** starts with 2 inputs (not 4); **Add Option** button appends more dynamically.
- **Correct Answer** is now a separate section below Answer Options, showing a radio list that mirrors the option labels â€” labels update live as options are typed.
- Removed inline radio buttons from each option row.
- `aqAddOption()` â€” appends a new option input and syncs the correct-answer radios.
- `aqSyncCorrectRadios()` â€” rebuilds the Correct Answer radio list whenever an option label changes, preserving the previously selected index.
- `_doSaveQuestion()` now reads all `input[name="opt"]` elements instead of fixed `opt0â€“opt3` names; requires at least 2 options.
- New CSS: `.aq-add-option-btn`, `.aq-correct-radios`, `.aq-correct-row`.
- `script-games.js` version bumped to `?v=34`.

## [2026-05-26] â€” Add Question form matching live site

### Changed
- **Add Question form** rebuilt to match live site: `â† Change type` back link, **Question \*** text input, **Difficulty** dropdown (Easy / Medium / Hard), **Question Image** drag-and-drop zone (cloud icon, "Choose File" button, accepted types hint), **Answer Options** with Option 1â€“4 stacked inputs each with a green radio to mark the correct answer.
- Footer buttons: **Cancel** | **Save & Add Another** (saves and returns to type picker) | **Add Question** (saves and closes panel).
- `backToQTypePicker(gameId, catId)` â€” clicking "â† Change type" returns to the type picker without losing the category.
- `saveQAndAddAnother(gameId, catId)` â€” saves current question and reopens type picker for next question in same category.
- `submitAddQuestion(gameId, catId)` / `_doSaveQuestion(gameId, catId)` â€” replaces the old form.onsubmit override.
- `_renderQTypePickerHtml(gameId, catId)` â€” shared helper used by all three entry points (new game flow, `actionAddQuestion`, `backToQTypePicker`); removes three copies of the Q_TYPES array.
- New CSS: `.aq-change-type`, `.aq-required`, `.aq-question-input`, `.aq-select`, `.aq-image-zone`, `.aq-image-*`, `.aq-options`, `.aq-option-label`, `.aq-option-row`, `.aq-option-input`, `.aq-correct-radio`.
- `script-games.js` version bumped to `?v=33`.

## [2026-05-26] â€” Open question type picker directly after Create Game

### Changed
- After **Create Game** succeeds, the panel now opens directly on the **question type picker** (matching live site) instead of an intermediate "game created" banner.
- A **Category 1** is auto-created silently so the question picker is immediately usable â€” no prompt required.
- Panel title = "Add Question", subtitle = game name.
- Question type cards restyled to match live site: grey card background (`#f3f4f6`), larger centred icon circle (54 px, dark icon on `#dde1e7`), bolder title, rounded-12 corners, indigo hover.
- MCQ icon updated to `fa-circle-question` to better match the live site.
- `showGameCreatedPanel()` and `openAddCategoryFromPanel()` replaced by `showQTypePickerForNewGame()`.
- `script-games.js` version bumped to `?v=32`.

### Removed
- "Game created" banner step and "Add Category" prompt removed from the post-create flow.

## [2026-05-26] â€” Remove page-header credit balance; add panel topbar credit pill

### Added
- **Credit balance pill** shown in the detail panel topbar whenever the AI game flow is open â€” displays `ðŸª™ X / Y used` (e.g. `35 / 300 used`) as an amber pill matching the live site.
- Pill updates live when a generation completes (credit is consumed) and turns a deeper amber when over 80% of credits are used.
- Pill is hidden in all non-AI panel states (edit, created, share, schedule).
- New element `#aiPanelCreditBal` in `index-games.html`; new CSS `.ai-panel-credit-bal` / `.ai-panel-credit-bal--warn` in `styles-games.css`.

### Removed
- **Page-header credit balance badge** (`#pageAICreditBalance`) removed from `index-games.html` â€” credits are now shown only in the panel topbar during AI flow.
- `.page-ai-credit-balance` CSS removed from `styles-games.css`.
- `script-games.js` version bumped to `?v=31`.

## [2026-05-26] â€” Game created next-step panel

### Added
- After **Create Game** succeeds, the detail panel transitions to a **"Created" state** instead of closing: shows the game's cover image, an Active chip, and the prompt *"Your game is ready. Add a category to start building questions."*
- **Add Category** button in the created panel immediately prompts for a category name, inserts the category row in the table, then opens the question-type picker â€” letting the user build out the game in one continuous flow.
- New function `showGameCreatedPanel(gameId, gameName, gameCover)` called at the end of `saveGameAdd()` manual path.
- New function `openAddCategoryFromPanel(gameId)` â€” creates the category and opens the question-type picker.
- New CSS: `.game-created-banner`, `.game-created-cover`, `.game-created-info`, `.game-created-lead`, `.game-created-actions`.
- `script-games.js` version bumped to `?v=31`.

## [2026-05-26] â€” Question type picker panel (matches live site Add Question flow)

### Added
- **Add Question** now opens a question type picker in the detail panel before the question form â€” matching the live site. Seven types shown as stacked cards with icon, title and description: Multiple Choice (MCQ), Fill in the Blanks, Statement Blanking, Select on Image, Match the Terms, Word Bucket, Crossword.
- Selecting a type transitions to the question form with a blue badge showing the chosen type above the fields.
- New function `openAddQuestionForm(type, gameId, catId)` â€” extracted from the old inline handler.
- New CSS: `.q-type-picker`, `.q-type-card`, `.q-type-card-icon`, `.q-type-card-title`, `.q-type-card-desc`, `.q-type-selected-badge`.

## [2026-05-26] â€” Move Add Game form back to right-side detail panel

### Changed
- **Add Game form** moved from centred modal overlay back to the right-side detail panel (user feedback: should not be a modal).
- All new fields remain: drag-and-drop cover zone, Name *, Description, Topic, Advanced collapsible (Max attempts / Questions per session / Pass Threshold %), Share with departments.
- Submit button in the panel labelled **"Create Game"** in add mode.
- `saveGameAdd()` manual path now reads fields by ID and applies share inline (no longer switches to a Share & Schedule tab step).
- Modal HTML and `saveAddGameModal()` removed; `closeAddGameModal()` redirects to `showGameEmpty()`.

## [2026-05-26] â€” Match Games page button styles to Topics page

### Changed
- **"Add Game" button**: restored to `btn-primary` (dark navy pill, trophy icon, label "Add Game") to match the "Add Topic" button style on the Topics page.
- **"Generate with AI" button**: label updated from "Generate" to **"Generate with AI"** (keeps the pink gradient `btn-ai` style), matching the Topics page "Generate with AI" button.

## [2026-05-26] â€” Align Add Game flow to live site (modal, Advanced section, button labels)

### Changed
- **"Add Game" button** renamed to **"+ New"** (dark button style `.btn-dark`) to match the live site.
- **"Add with AI" button** renamed to **"Generate"** (sparkles icon, existing `btn-ai` style) to match the live site.
- **Add Game flow** converted from a right-side detail panel with tabs (Game / Categories / Share & Schedule) to a **centred modal overlay** (`#addGameModal`) matching the live site layout.
  - Cover image is now a full drag-and-drop upload zone at the top of the modal (cloud icon, "Drag & drop or click to add cover image", "Recommended: 1280 Ã— 720 Â· JPG or PNG").
  - Fields: Name *, Description (optional), Topic (optional).
  - **Advanced âˆ¨ collapsible** section added with: Max attempts (placeholder "e.g. 3", hint "Defaults to 2 if left empty"), Questions per session (default 5, hint "Defaults to 5 if left empty"), **Pass Threshold (%)** (placeholder "e.g. 60", hint "Defaults to 60% if left empty" â€” previously missing entirely from the prototype).
  - Share with departments rendered inline at the bottom of the modal (checkbox list, applied on Create Game).
  - Modal footer: Cancel + **Create Game** buttons.
  - Clicking the backdrop closes the modal.
- `_checkPendingGame()` updated to populate modal fields (`#addGameName`, `#addGameDesc`, `#addGameCoverZone`) instead of the old panel pane (`#gameTabPaneGame`).

### Added
- New functions: `closeAddGameModal()`, `saveAddGameModal()`, `previewAddGameCover()`, `toggleAddGameAdvanced()`, `onAddGameTopicChange()`.
- New CSS: `.btn-dark`, `.modal-overlay`, `.add-game-modal`, `.add-game-modal-header/body/footer`, `.add-game-cover-zone`, `.add-game-cover-*`, `.add-game-advanced`, `.add-game-advanced-toggle/body`, `.form-field-hint`, `.add-game-share-section`.
- `script-games.js` version bumped to `?v=30`.

## [2026-05-26] â€” GAM-382 gap fixes: difficulty ratio, Match The Terms, file validation

### Changed
- **Difficulty mix display**: changed from mock percentage chips (`Easy 10% Â· Medium 70% Â· Hard 20%`) to the correct backend-fixed ratio `1 Easy Â· 1 Medium Â· 1 Hard` per category (user cannot set this).

### Added
- **Match The Terms question type**: added to the AI question types grid (`fa-link` icon, value `match-terms`), completing the full set from GAM-382 (MCQ, Word Bucket, Crossword, Fill in the Blank, Statement Blanking, Select on Image, Match The Terms).
- **File upload validation toasts**: `onAIGameFileChange()` now explicitly checks the file extension against the allowed list (`pdf`, `docx`, `xlsx`, `png`, `jpeg`, `jpg`) and shows *"Unsupported file type. Please upload a PDF, DOCX, XLSX, PNG, JPG, or JPEG file."* on failure, or *"File successfully uploaded."* on success.
- `script-games.js` version bumped to `?v=29`.

## [2026-05-26] â€” replace cover image toggle with always-visible drop zone

### Changed
- Removed the "Add cover image" on/off toggle from the Add Game and AI-generated game panels. The cover upload is now always visible as a dashed drop zone (`Drop a file or click to upload`) matching the upload design pattern.
- When a file is selected the zone shows a full-bleed preview with a "Change" overlay on hover.
- New `gameCoverDropZoneHtml()` builder and `previewGameCoverDrop()` handler replace `gameCoverToggleHtml()` / `toggleGameCoverSection()` for the add/AI flows. The edit existing game panel retains the preset-tile picker.
- Added `.cover-drop-zone`, `.cover-drop-icon`, `.cover-drop-text`, `.cover-drop-preview`, `.cover-drop-overlay` CSS rules in `styles-games.css`.
- `script-games.js` version bumped to `?v=28`.

## [2026-05-26] â€” remove AI credit balance from detail panel topbar

### Removed
- Removed the `#aiGameCreditsDisplay` credit balance pill (`20 / 300 used`) from the detail panel topbar. The page-header badge (`#pageAICreditBalance`) is unchanged.
- Removed associated JS references (`aiGameCreditsCount`, `aiGameCreditsTotal`, `aiGameCreditsDisplay`) from `setGamePanelMode()` and the post-generation credit update. Credits are still tracked and reflected on the page-header badge via `updateGameScopeCreditsDisplay()`.
- `script-games.js` version bumped to `?v=27`.

## [2026-05-25]

### Changed
- **Topics â€” Text content: rich text editor**: the "Text" tab in the sub-topic content picker now renders a `contenteditable` div with a compact formatting toolbar (Bold, Italic, Underline, Bullet list, Numbered list) instead of a plain textarea. Content is stored and restored as HTML. CSS added in `styles-topics.css`. `readContentPicker()` and `removeTopicContent()` updated to use `innerHTML`.
- **Topics â€” AI flow Text input: rich text editor**: the "Text" source field (`#aiTextInput`) in the AI generate flow also uses the same rich text editor pattern (toolbar + `contenteditable` div with `.ai-rte` styling).
- **Topics â€” AI prompt: single-line input**: the AI-flow prompt field (`#aiPromptText`) changed from a multi-row textarea to a single-line `<input type="text">`.
- Removed the "Difficulty" Easy/Medium/Hard badge row from the AI Questions setup pane.
- Added a **Difficulty mix** ratio row to the generated Game tab (results preview), showing coloured percentage chips â€” e.g. `Easy 10%` Â· `Medium 70%` Â· `Hard 20%`. Ratios cycle through four mock presets per generation.
- Removed old `.ai-difficulty-row / .ai-difficulty-label / .ai-difficulty-badges / .ai-diff-badge / .ai-difficulty-note` CSS; replaced with `.ai-diff-ratio / .ai-diff-ratio-label / .ai-diff-ratio-chips / .ai-diff-chip` (colour vars `.ai-diff-easy/medium/hard` retained).
- **Share & Schedule tabs merged**: The separate "Share" and "Schedule" tabs in both the manual Add Game form and the AI-generated game results panel are replaced by a single "Share & Schedule" tab. Includes department checkboxes and a dateâ€‘range picker.
- **Date range picker**: replaced the old single `datetime-local` input with two `date` inputs (Start date / End date).
- **Combined confirm action**: one "Confirm" button applies both sharing and scheduling; old functions removed.
- **Kebab-menu schedule panel** updated to use the dateâ€‘range picker.
- **Word Rocket renamed to Word Bucket** throughout the AI game setup form.
- **Question types: radio buttons** (one per generation attempt) instead of checkboxes.
- **MCQ info note**: small "No image questions" note displayed below the MCQ label.
- **AI Add Game â€” two-tab setup panel**: restructured into Content and Questions tabs with proper tab bar.
- **File upload â€” approved formats only**: restricts to `.pdf`, `.docx`, `.xlsx`, `.png`, `.jpeg`, `.jpg`.
- **Question type cards â€” column layout**: text above, checkbox below; equal fixed height; centred alignment fixes applied.
- **Side panel â€” no horizontal scrollbar**: added `overflow-x: hidden`.
- **Game categories logic** updated to match diagram (topic sub-topics vs AI-suggested categories).
- **AI game results â€” cover image toggle default** fixed to only default ON when topic has a cover image.

### Added
- Restored the AI credit balance pill badge (`#pageAICreditBalance`) in the games page header, showing `<used> / <total>` credits with coin icon; amber when over 80% consumed.
- **AI credit balance badge** also added to games landing page header.

### Removed
- Removed the "Publish immediately" / "Schedule for a date range" radio toggle from the schedule form. Start/End date inputs are now always visible. `onScheduleTypeChange` and `.schedule-option` CSS removed.
- Removed the "Questions per session" input from the AI-generated game results panel; replaced with just "Max attempts".
- Reverted the "Add question type" post-generation feature (functions and CSS removed; button removed).

### Fixed
- **Question type cards â€” equal height**: all six cards now exactly the same height.
- **Questions pane â€” no vertical scrollbar**: tightened spacing so full content fits without scroll.
- **Question type cards â€” text and checkbox centre alignment**: specificity fix so flex layout applies correctly.
- **Question type cards â€” proper centre alignment**: wrapped label in flex span for consistent alignment.
- **Question type cards â€” checkbox alignment**: icon+text left, checkbox right, vertically centred.
- **Select on Image â€” enabled**: option now selectable like others.
- **Detail panel â€” no outer scroll**: only form fields area scrolls; top/bottom pinned.

## [2026-05-22] â€” fixes

### Fixed
- **Add cover image â€” toggle (off by default)**: cover image picker in both the manual Add Game form and the AI Game flow result tab is now collapsed behind an "Add cover image" toggle, matching the diagram. The toggle defaults to off (no cover = random assigned on save); if a topic is linked the toggle defaults to on with the topic cover pre-selected and labelled "(from topic)". Implemented via `gameCoverToggleHtml()` and `toggleGameCoverSection()` helpers.
- **File upload preview**: uploading a file in the AI Game flow now shows a styled preview card â€” image thumbnail for image files, and a file-type icon (PDF, Word, etc.) + filename + file size for documents. A "Change" button lets the user re-pick. Replaces the previous plain-filename display.
- **Questions per category â€” clearer label**: slider label changed from "Max questions per category" to "Questions per category (max 10)" with a sub-note "Questions per attempt is configured in the manual flow", matching the diagram note that per-attempt count lives in the manual flow.
- `script-games.js` version bumped to `?v=12`.

## [2026-05-22]

### Added
- **AI game flow â€” Topic link**: "Link to topic" selector (populated from `TOPICS_BY_SCOPE`/`TOPICS_BY_DEPT` via newly-loaded `topics-data.js`) added to the AI Add Game form. Selecting a topic pre-fills the optional content note, and after generation pre-fills game name, description and cover on the Game tab.
- **AI game flow â€” Question types config**: checklist of question types (MCQ âœ“, Word Rocket, Crossword, Fill in the Blank, Statement Blanking, Select on Image [disabled until image content]) added to the AI form setup panel. Each change recalculates the credit estimate.
- **AI game flow â€” Max questions slider**: range input 1â€“10 (default 5) with scale labels added below question types. Drives the live credit estimate via `updateAIGameQCount`.
- **AI game flow â€” Difficulty display**: read-only Easy/Medium/Hard badge row (Medium active by default) added to the AI form. Labelled "Auto-set Â· adjustable per attempt in manual flow" per spec.
- **AI game flow â€” Credits estimate**: live credit estimate pill (`ai-credits-estimate`) shown throughout the AI setup form; updates when question types, slider, or categories toggle change.
- **AI game flow â€” Generation progress animation**: clicking Generate now shows a 4-step animated progress bar (Analysing content â†’ Identifying categories â†’ Generating questions â†’ Applying difficulty) before revealing the results. Logic extracted into `_renderAIGameResults()`.
- **AI game flow â€” Max attempts & Questions per session**: generated Game tab now includes a Max attempts number-stepper and a Questions per session text input.
- **Manual Add Game â€” Topic, Max attempts, Questions per session**: Topic dropdown, Max attempts stepper and Questions per session input added to the manual Add Game "Game" tab. Selecting a topic pre-fills name, description and cover.
- **New helpers in `script-games.js`**: `getAIGameTopicOptions()`, `onAIGameTopicChange()`, `onManualGameTopicChange()`, `updateAIGameQCount()`, `updateAIGameCreditsEstimate()`, `stepGameAttempts()`.

### Changed
- `addGameAI()` title changed to "Add Game with AI".
- AI Generate button now always enabled in prototype (previously required content first).
- `topics-data.js` added to `index-games.html` (before `script-games.js`) so topic data is available for the link-to-topic selector.
- `script-games.js` version bumped to `?v=11` in `index-games.html`.

## [2026-05-14]

### Changed
- **Topic cover presets â€” third preset changed to purple**: the tealâ†’green gradient (`#14b8a6` â†’ `#22c55e`) in `COVER_PRESETS` replaced with purpleâ†’violet (`#a855f7` â†’ `#7c3aed`) in `script-topics.js`.

### Fixed
- **Edit sub-topic â€” upload tile text not centred**: `.cover-upload-empty` changed to `position: absolute; inset: 0` with `justify-content: center` so the icon and "UPLOAD" label are vertically and horizontally centred within the tile.

## [2026-05-18]

### Fixed
- **Add with AI â€” content section collapses after Generate**: clicking Generate collapses the content picker, sub-topics toggle, and model selector into a compact one-line summary bar showing the filename/URL/text, active pills for model and sub-topics, and a chevron to re-expand. `collapseAIStep1()` and `expandAIStep1()` added to `script-topics.js`; `.ai-step1-collapsed` styles added to `styles-topics.css`. Regenerate does not re-collapse since the bar is already present.
- **Add with AI â€” Share tab more compact**: `#detailEdit .share-dept-list` max-height reduced to `24vh` and item padding tightened to `5px 10px` (scoped to the edit panel so the standalone share panel is unaffected).
- **Add Topic / Add with AI buttons broken after Share step**: `showAddShareStep` replaced `.edit-actions` with Skip/Share buttons, removing `#editSubmitBtn` from the DOM. The next `setPanelMode` call crashed on `null.hidden`. Fixed by restoring the original `.edit-actions` HTML at the top of `setPanelMode` when `#editSubmitBtn` is missing.
- **Topics list â€” share badge now shows correctly**: `getSharedDepartments` rewritten to look only in `TOPICS_BY_SCOPE` (not fallback defaults), only in departments other than the current one, and only for topic copies that carry `sharedDate` (set by `shareTopicWithDepartments`). Previous logic matched topics via the default fallback chain, causing either no badge (topic not in defaults) or inflated counts (topic in all dept defaults). `applyAddShare` now calls `persistTopicsScope()` and `refreshTopics()` after sharing so the badge appears immediately on the newly-added row.
- **Topics list â€” expansion chevron hidden for topics with no sub-topics**: `topicRowHtml` now renders the chevron with `visibility:hidden` when `subCount === 0`; the freshly-added row in `saveAdd` also starts hidden. `updateTopicRowChips` now shows or hides the chevron whenever the sub-topic count changes. `toggleTopic` returns early if there are no sub-topic rows, so clicking the row does nothing.

### Added
- **Add Topic / Add with AI â€” Share step after Save**: clicking Save in either add flow now saves the topic and then reveals a Share tab (added dynamically to the tab bar) instead of closing the panel. The Share tab lists every department in the current company as checkboxes. The action buttons swap to "Skip" (closes the panel) and "Share" (applies sharing via `shareTopicWithDepartments` and closes). `showAddShareStep()` and `applyAddShare()` added to `script-topics.js`; `_pendingShareTopicName` stores the saved topic name between the two steps.
- **Add Topic â€” Sub-topics tab hidden until needed**: the Sub-topics tab is no longer visible in the tab bar until the user clicks "Add sub-topics". It is re-hidden if all sub-topics are removed. Previously it was always visible but disabled.
- **Add Topic / Add with AI â€” Share tab grayed out until Save**: the Share tab is visible in the tab bar from the start but `disabled` (grayed out). Clicking Save saves the topic, enables the Share tab, and switches to it automatically. `showAddShareStep()` no longer injects a tab dynamically â€” it just enables the pre-existing disabled button.

### Changed
- **Add with AI â€” credits badge shows "X / 200 used"**: badge text updated from "N credits" to "N / 200 used". A persistent `_aiCreditsUsed` counter (starting at 12) increments on every Generate/Regenerate click and updates `#aiCreditsCount` in real time.

### Changed
- **Add with AI â€” sub-topics accordion in second tab**: when "Generate with sub-topics" is toggled on, `aiGenerateStep2()` now builds a two-tab layout inside `#aiStep2Section`. The Topic tab shows the cover picker, editable name and description, and a preview list of suggested sub-topic names with a "View Sub-topics" button. The Sub-topics tab shows an accordion: clicking the chevron expands the row (collapsing any other open row) to reveal a scrollable `contenteditable` WYSIWYG pre-populated with rich HTML. The sub-topic name in the header is also `contenteditable` so both name and content are directly editable. Each `_AI_SUGGESTIONS` entry now carries a `subtopics` array (3â€“4 items each) with name and HTML body. `switchAITab()` and `toggleAISub()` added to `script-topics.js`; accordion and WYSIWYG CSS added to `styles-topics.css`.

## [2026-05-19]

### Changed
- **Sub-topics list â€” drag to reorder**: sub-topic rows in both the manual add flow and the AI generate flow now have a grip-vertical drag handle on the left. Rows are draggable via the HTML5 Drag and Drop API; a blue line appears above or below the target row to show the insertion point, and the dragged row fades to indicate it is in flight. `subListItemHtml` helper extracted so the drag attributes and handle are defined once and used by both `appendSubItem` and `buildAISubsPaneHtml`. Drag functions `subDragStart`, `subDragOver`, `subDragLeave`, `subDrop`, `subDragEnd` and state variable `_subDragSrc` added to `script-topics.js`. CSS for `.sub-drag-handle`, `.sub-list-item.dragging`, `.drag-over-top`, `.drag-over-bottom` added to `styles-topics.css`. `script-topics.js` bumped to `?v=48`.
- **Generate with AI â€” "Generate with sub-topics" renamed to "Create sub-topics"**. `script-topics.js` bumped to `?v=51`.
- **Generate with AI â€” prompt cleared when switching to Topics or Sub-topics tab**: the prompt textarea value is now cleared (not just the placeholder updated) when switching to the Topics or Sub-topics tab, so content typed on the Content tab never carries over. `script-topics.js` bumped to `?v=50`.
- **Generate with AI â€” prompt box label removed, placeholder text contextual**: "Instructions" label removed from the generate block textarea. Initial placeholder is "What learning content would you like to create today?"; switches to "What would you like to change?" when on the Topics or Sub-topics tab after first generation. `updateAIGenBtnLabel` now also updates the placeholder on every tab switch. `script-topics.js` bumped to `?v=49`.
- **Generate with AI â€” Instructions + Generate button in a permanent block**: the Instructions textarea and Generate Topic button are grouped in a styled block (`.ai-generate-block`) permanently visible at the bottom of the form, below the tab panes. The block is always shown regardless of active tab. Removed the inject-into-edit-actions mechanism; `setPanelMode` now runs before `editFields.innerHTML` so it no longer clobbers the button. Save remains disabled until Generate has run at least once. `script-topics.js` bumped to `?v=47`.
- **Generate with AI â€” tab-aware regenerate**: the Generate/Regenerate button action and label now depend on the active tab after first generation. Topics tab â†’ "Regenerate Topic" (rebuilds only the topic pane, leaves sub-topics untouched). Sub-topics tab â†’ "Regenerate Sub-topics" (rebuilds only the sub-topics pane). Content tab â†’ "Regenerate" (rebuilds everything). `triggerAIGenerate` replaces direct `aiGenerateStep2` call; `doAIGenerate(action)` dispatches per action; `buildAISubsPaneHtml(subs)` extracted as a shared helper; `updateAIGenBtnLabel()` called from `switchAITab` and after each generation.
- **Generate with AI â€” "Create with game" toggle persists across Regenerate**: the toggle state is read before the topic pane is rebuilt and restored immediately after, so regenerating a topic never unchecks it. `script-topics.js` bumped to `?v=44`.
- **Generate with AI â€” sub-topic editor shows AI-generated markdown**: clicking Edit on an AI-generated sub-topic now shows a markdown textarea pre-filled with the converted content instead of the media content picker. `htmlToMarkdown()` added to convert the HTML from `_AI_SUGGESTIONS` to markdown (handles headings, bold, italic, ordered/unordered lists, paragraphs, HTML entities). The markdown is stored as `data-content` on each `sub-list-item`. `openSubEditor` detects `data-content` and renders the textarea; `commitSubEditor` skips content-picker validation and writes edits back to `data-content`. `appendSubItem` carries the optional `content` field through. `script-topics.js` bumped to `?v=43`.
- **Generate with AI â€” Sub-topics tab uses standard list layout**: removed the "N sub-topics suggested" preview block from the Topics tab. The Sub-topics tab now renders generated sub-topics as `sub-list-item` rows (same layout as the manual add-topic flow) with edit and delete buttons per row, an inline editor via `openSubEditor`, and an "Add another sub-topic" button at the bottom. The existing `editSubItem`, `removeSubItem`, and `openSubEditor` functions work unchanged since the same DOM IDs (`#subsList`, `#subEditor`, `#addSubTopicBtnRow`) are reused. `script-topics.js` bumped to `?v=42`.
- **Generate with AI â€” three-tab layout (Content / Topics / Sub-topics)**: the AI generate panel now opens on a Content tab containing the model selector, Upload/URL/Text inputs, and the sub-topics toggle. Clicking Generate populates and switches to the Topics tab (cover, name, description, game toggle); if sub-topics were requested a Sub-topics tab also appears and becomes enabled. Clicking Regenerate repopulates both tabs and switches back to Topics. The Content tab is always accessible via the tab bar so inputs can be changed before Regenerating. Removed the `collapseAIStep1`/`expandAIStep1` collapse-bar mechanism (superseded by tab navigation). `switchAITab` updated to handle `ai-content`, `ai-topic`, and `ai-subs` panes. `script-topics.js` bumped to `?v=41`.
- **Generate with AI â€” at least one content input required**: Generate button starts disabled and enables only when Upload, URL, or Text has content. `updateAIGenerateBtn` now checks all three inputs; `onAIFileChange`/`onAIFileDrop` call it after a file is chosen. "Optional" hints removed from all three labels. `script-topics.js` bumped to `?v=40`.
- **Generate with AI â€” renamed labels**: button text changed from "Add with AI" to "Generate with AI" (`index-topics.html`); panel heading from "Add Topic" to "Generate Topic" (`addTopicAI` in `script-topics.js`); editing badge from "Adding with AI" to "Generating with AI" (`aiGenerateStep2`). `script-topics.js` bumped to `?v=37`.
- **Add topic â€” Sub-topics tab now has an icon**: `<i class="fas fa-list-ol"></i>` added to the Sub-topics tab in both the manual add flow (`addTopic`) and the AI add flow (`aiGenerateStep2`), matching the icon used in the "Add sub-topics" choice button. `script-topics.js` bumped to `?v=36`.
- **Detail panel width increased to 480 px**: `--detail-width` in `styles.css` changed from `400px` to `480px`. Applies to all pages that use the three-pane layout (topics, games, users, companies).

### Added
- **Topics â†’ Games handoff â€” "Create with game" toggle**: a toggle switch labelled "Create with game" (sentence case, no icon) appears at the bottom of the Topic tab in both the manual and AI add flows (all three `aiGenerateStep2` variants). When checked and the user clicks Save, the flag and the topic's cover, name, and description are captured at the Share step (`_pendingCreateGame`, `_pendingTopicCover`, `_pendingTopicDesc`). Clicking Share or Skip writes `{ topicName, topicCover, topicDesc, companyKey, dept }` to `localStorage['gameon.pendingGame']` and navigates to `index-games.html`. On arrival, `_checkPendingGame()` in `script-games.js` reads the flag, clears it, verifies the scope still matches, calls `addGame()`, and pre-fills the Game Name, Description, and cover picker (including tile visual selection) from the stored topic data. `script-topics.js` bumped to `?v=24`, `script-games.js` to `?v=4`.

### Fixed
- **Games â€” tree thumbnails now match topics**: removed `filter: none` from `.row-thumb-game` so the base `.row-thumb { filter: saturate(0.3) brightness(1.15) }` applies, giving game covers the same muted look as topic covers. Added the parent game's cover as a thumbnail on category rows â€” `catRowHtml()` now accepts an optional `gameCover` parameter and renders `gameCoverHtml(gameCover)` when supplied. All four call sites updated: `renderGamesForScope` passes `game.cover`, save/AI-save flows read `gameRow.dataset.cover`, and single-category add reads `row.dataset.cover`. `script-games.js` bumped to `?v=8`.
- **Games â€” cover presets now match topics in hue and format**: `GAME_COVER_PRESETS` replaced from raw CSS gradient strings to SVG data URLs via a new `gradientCoverSvg()` helper (identical implementation to `script-topics.js`), using the same three color pairs â€” blueâ†’purple (`#3b82f6`â†’`#8b5cf6`), orangeâ†’pink (`#f97316`â†’`#ec4899`), purpleâ†’violet (`#a855f7`â†’`#7c3aed`). Because the `data-cover` values are now identical across both pages, `_checkPendingGame()` can match the incoming topic cover string directly and highlight the correct tile. `script-games.js` bumped to `?v=5`.
- **"Create with game" toggle â€” switch first, sentence-case label**: reverted HTML order to switch-first. Fixed uppercase text caused by `.form-group label { text-transform: uppercase }` overriding the toggle via higher specificity; corrected with `.create-game-toggle-row label` rule in `styles-topics.css` which also restores `display: inline-flex` and `gap: 10px` (both were being overridden by the `display: block` from `.form-group label`). `script-topics.js` bumped to `?v=27`.
- **Games â€” cover images blank after SVG data URL switch**: `gameCoverHtml()` and `gameCoverPickerHtml()` were using `style="background: <data-url>"` (invalid CSS syntax for data URLs). Switched both to `<img src="...">` matching the topics approach. `script-games.js` bumped to `?v=6`.

### Fixed
- **Share tab â€” panel closes after clicking Share so badge is visible**: `applyAddShare()` now always calls `showEmpty()` after a successful share (when not launching a game), so the detail panel closes and the share badge in the topic tree is immediately visible. Previously the panel stayed open and the badge was hidden behind it.
- **Share tab â€” current department pre-selected**: `buildAddShareTabHtml()` now checks `_currentScope.dept` and marks the matching department checkbox `checked` by default, so the user can share to the current dept without manually ticking it.
- **Add topic â€” Share panel is now the standalone panel, not an inline tab**: clicking Save in both the manual and AI add flows now closes the edit panel and opens the dedicated `#detailShare` panel (same one used by the kebab-menu Share action on existing topics). The current department is pre-checked by default; the confirm button always reads "Share" and is always enabled for new topics. `confirmShare` and `cancelShare` both honour the "Create with game" flag, so the game handoff still works. Removed: the Share tab and pane from `addTopic()` / `aiGenerateStep2()`, `buildAddShareTabHtml`, `showAddShareStep`, `skipAddShareStep`, `applyAddShare`, `_syncAddShareButtons`, `_inShareStep`, `_pendingShareTopicName`. `script-topics.js` bumped to `?v=35`.
- **Share tab â€” badge count matches selected departments**: the current department is now a real share target, not just a visual marker. Three fixes together: (1) `shareTopicWithDepartments` now stamps `sharedDate` on an already-existing topic entry (the newly-created topic is already in `TOPICS_BY_SCOPE` from `snapshotCurrentScope`, so the old guard silently skipped it); (2) `getSharedDepartments` no longer excludes `currentDept`, so sharing to N departments â€” including the home dept â€” correctly returns N results for the badge; (3) `applyAddShare` no longer filters out the current dept from `deptNames`. `script-topics.js` bumped to `?v=34`.
- **Share tab â€” checked departments persist when switching tabs**: replaced the `editSubmitBtn`-presence heuristic in `_syncAddShareButtons` with an explicit `_inShareStep` flag. Previously, switching from Share â†’ Topic tab restored the Save button, and switching back to Share left Cancel/Save visible instead of Skip/Share â€” clicking Save would rebuild the entire form and reset all checkbox selections. Now `_inShareStep` is set `true` in `showAddShareStep` and cleared in `applyAddShare`, `skipAddShareStep`, and `setPanelMode`, so the Skip/Share buttons are always shown on any tab while in the share step, and the share pane HTML is never inadvertently rebuilt. `script-topics.js` bumped to `?v=32`.

### Added
- **AI credits persist across all pages**: credits are now written to `localStorage['gameon.aiCredits']` (object keyed by company name) whenever a Generate is triggered in `script-topics.js` or `script-games.js`, and read back on page load so the count is never lost on navigation. `script-sidebar-scope.js` now reads from this key in a new `updateCreditsDisplay()` function called from `renderCard()` on every scope change â€” so the `#scopeCredits` line appears on every page as soon as a company with prior AI usage is selected. Added `credits` quota field to `FALLBACK_COMPANIES` in `script-sidebar-scope.js` (matching `SIDEBAR_COMPANIES` values). Added `#scopeCredits` div to all six pages that were missing it: `index.html`, `all-users.html`, `companies.html`, `index-users-dept-grid.html`, `reports.html`, `settings.html`. `script-topics.js` bumped to `?v=28`, `script-games.js` to `?v=7`.
- **Nav â€” "Calendar" renamed to "Game Calendar"**: updated label and `data-tooltip` on all eight pages.
- **Games â€” cover images blank after SVG data URL switch**: `gameCoverHtml()` and `gameCoverPickerHtml()` were using `style="background: <data-url>"` which is invalid CSS syntax (needs `url(...)`). Switched both to render `<img src="...">` elements matching the topics approach. `script-games.js` bumped to `?v=6`.

### Changed
- **Scope card â€” AI credits on its own row**: moved `#scopeCredits` from inside `.scope-card-text` to a direct child of `.scope-card` in `index-topics.html` and `index-games.html`. Added `flex-wrap: wrap` and `flex-basis: 100%` to `.scope-card` / `.scope-card-credits` in `styles.css` so the credits line wraps below the logo + name + arrows row.

### Added
- **Topics â€” "Add game" kebab menu item**: added below "Add sub-topic" in the topic row action menu (both the `topicRowHtml` template and the newly-added row in `saveAdd`). Clicking it navigates to `index-games.html`. `script-topics.js` bumped to `?v=22`.



### Fixed
- **AI credits always visible below company name**: `updateGameScopeCreditsDisplay()` added to `script-games.js` (mirrors `updateScopeCreditsDisplay` in topics). Called from `onGamesScope()` so the credit line appears as soon as a company is selected (showing "0 / N AI credits used"), and again after each AI generation to keep the count live. `script-games.js` bumped to `?v=2`.

## [2026-05-18] â€” Games styling consistency

### Fixed
- **Games page â€” tree row spacing too tight**: added `padding-top/bottom` to `.row-game td` (12 px), `.row-cat td` (9 px), and `.row-q td` (7 px) in `styles-games.css`, matching the `.row-company td` rhythm used on the topics page.
- **Games page â€” category count badge purple**: removed the custom purple `background`/`color` overrides from `.chip-cats`; only the icon colour remains, changed to `#3b82f6` (blue) to match the `.chip-modules` icon on the topics page.
- **Games page â€” Active badge shows coloured background**: added `.row-game .chip, .row-cat .chip, .row-q .chip { background: var(--white) }` to `styles-games.css`, mirroring the `.row-company .chip` rule in `styles.css` that strips the green fill on active chips in topics rows.
- **Detail panel â€” no padding and content not scrollable**: added `padding: 16px 20px` and `box-sizing: border-box` to `.detail-content` in `styles.css` (applies to all pages). Changed `.detail-panel.open` from `overflow-y: hidden` to `overflow-y: auto` so the panel scrolls when content is taller than the viewport.
- **Games page â€” cover picker shows 5 tiles instead of 3**: `GAME_COVER_PRESETS` in `script-games.js` reduced from 5 entries to 3 (blueâ†’purple, pinkâ†’red, blueâ†’cyan), matching the 3-tile pattern used in the topics cover picker.
- **Games page â€” cover thumbnail in row**: `gameCoverHtml()` now returns `<div class="row-thumb row-thumb-game" style="background:â€¦">` instead of a fully-inline-styled div. Picks up `.row-thumb` sizing/border-radius from `styles-topics.css`; `.row-thumb-game` in `styles-games.css` overrides `filter:none` so gradient covers display at full saturation.
- **Games page â€” extra left margin on game name**: removed `style="margin-left:8px"` inline style from the `company-name` span in `gameRowHtml()`; spacing is handled by `.cell-row`'s `gap: 8px`.
- **Games page â€” category row chevron visibility**: `catRowHtml()` had two `style` attributes on the chevron span (only the last was honoured by browsers), so `visibility:hidden` was silently ignored. Merged into a single `style="visibility:hidden"` attribute; the CSS `padding-left: 56px` on `.row-cat .cell-row` already handles indentation.

## [2026-05-18] â€” Games page

### Added
- **Games page (`index-games.html`)**: new page with a 3-level tree (Game â†’ Category â†’ Question), manual add flow (4 tabs: Game, Categories, Share, Schedule), and AI add flow with generated categories and questions shown in a reviewable accordion. Share step matches the topics pattern. Schedule step adds a date/time picker with "publish immediately" or "schedule for a date" options. `games-data.js`, `script-games.js`, `script-games-sidebar-scope.js`, and `styles-games.css` added.
- **`games-data.js`**: seed data for `_default` (2 games), `sales` (1 game), `human resources` (1 game), and `marketing` (1 game). Each game has 2 categories with 2â€“3 questions. Realistic corporate learning content (leadership, compliance, sales, digital marketing, HR). `GAMES_BY_SCOPE` runtime override object also exported.
- **`script-games-sidebar-scope.js`**: scope adapter following the exact `script-topics-sidebar-scope.js` pattern. Variables prefixed `GAMES_` to avoid conflicts. Calls `onGamesScope(companyKey, deptName)` on scope change; disables `#addGameBtn` and `#addGameAIBtn` until both company and department are selected.
- **`styles-games.css`**: game-specific CSS only â€” `.detail-schedule-badge` (green/teal), `.row-cat` / `.row-q` tree indentation, `.chip-cats` / `.chip-questions` / `.chip-scheduled` chips, staged category and question editor styles (`.game-cat-item`, `.q-editor`, `.q-opts-grid`), schedule form styles, AI accordion styles (`.ai-game-cat-item`, `.ai-game-q-item`).
- **Games nav link**: `index-topics.html`, `index-users-dept-grid.html`, and `companies.html` updated from `href="#"` to `href="index-games.html"` for the Games nav item.

## [Unreleased]

### Fixed
- **Add with AI â€” generated sub-topics now appear in the tree after Save**: `saveAdd()` now reads sub-topic names from `#aiTabPaneSubs .ai-sub-item` accordion rows (via `.ai-sub-name`) in addition to the normal `#subsList` staged list. Each AI sub-topic is created as a `text` media-type row under the new topic.
- **Topics list â€” sub-topics badge hidden when count is zero**: `topicRowHtml`, `updateTopicRowChips`, and the new-row HTML in `saveAdd` no longer render the "0 sub-topics" chip. The badge only appears when there is at least one sub-topic.
- **Add with AI â€” Save validates name and description only**: in the AI flow (`#aiStep2Section` present), `saveAdd()` now skips the content/sub-topic requirement check and instead only validates that Topic Name and Description are non-empty. If either is blank, the Topic tab is activated and focus moves to the empty field.
- **Add with AI â€” credits persist per company across panel openings**: replaced `_aiCreditsUsed` (single number) with `_companyCreditsUsed` (object keyed by company name). Opening "Add with AI" a second time for the same company now continues from the previously accumulated count. The panel badge and scope card indicator both reflect the live value.
- **Sidebar â€” AI credits indicator below company name**: a `.scope-card-credits` line (`#scopeCredits`) appears under the department name in the scope card once any AI generation has happened for the selected company. Shows "X / N AI credits used". Hidden until the first generation, hidden when no company is selected.
- **Add with AI â€” credits badge starts at 0 and shows company total**: counter resets to 0 each time the AI panel opens; total shown is the company's available credits (added as a `credits` field to `SIDEBAR_COMPANIES` in `script-topics-sidebar-scope.js`). Badge reads "0 / 500 used" (for Naspers), "0 / 300 used" (Standard Bank), etc. Increments by 1 on each Generate/Regenerate.
- **Add with AI â€” unique generated topic names**: `_AI_NAME_POOL` expanded to 25 name+description pairs, shuffled at page load into `_aiNameQueue`. Each Generate/Regenerate draws the next entry from the queue without repeating; the queue reshuffles only once exhausted. Subtopic WYSIWYG content still cycles through the 4 rich content sets in `_AI_SUGGESTIONS`.

### Changed
- **Add with AI â€” model selector**: a dropdown (`#aiModelSelect`) in step 1 lets the user choose the AI model; defaults to Claude Sonnet 4.6 with options for Opus 4.7, Haiku 4.5, GPT-4o, and Gemini 1.5 Pro. Styled via the existing `.form-group select` rules.
- **Add with AI â€” sub-topics toggle**: a "Generate with sub-topics" toggle switch appears in step 1 below the content picker (`#aiIncludeSubtopics`). UI only â€” sub-topic generation flow to follow.
- **Add with AI â€” Regenerate updates fields**: each Regenerate click cycles through `_AI_SUGGESTIONS` (4 preset name/description pairs) and rotates the cover tile selection. Index resets when the AI panel opens.
- **Add with AI â€” two-step flow**: Generate/Regenerate injected into `.edit-actions` (same `flex: 1` width as Save). Generate starts disabled and enables reactively when content is provided (file upload, URL typed, or text entered) via `updateAIGenerateBtn()` hooked into `setContentKind`, `onContentFileChange`, `onContentFileDrop`, and an `input` event listener on the picker. Save stays disabled until first Generate click. `.badge-ai` uses `--accent-light`/`--accent`, matching other panel badges. Clicking Generate runs `aiGenerateStep2()` which reveals the cover picker, pre-populated Topic Name, and Description below the content section in the same open panel â€” all three fields remain editable. Submit button becomes "Save". A gradient "Generated details" divider separates the content from the generated fields.
- **Content picker â€” Video URL â†’ Web URL**: the video/URL tab in all content pickers now reads "Web URL" with a link icon (`fa-link`); placeholder updated to `https://â€¦`.
- **Add with AI button**: new `.btn-ai` button added to the topics toolbar (right of "Add Topic"), styled with the same `#ab7197 â†’ #f9604d` left-to-right gradient as the top banner, with a pill radius and animated gradient-shift on hover. Clicking it runs the same Add Topic flow but replaces the panel badge with "Adding with AI" (gradient-filled `.badge-ai` class). `addTopicAI()` added to `script-topics.js`; `#addTopicAIBtn` wired into the scope-enable/disable logic in `script-topics-sidebar-scope.js`; `setPanelMode` clears `.badge-ai` so normal add/edit flows are unaffected.
- **CTA / accent color**: `--accent` updated to `#244173`; `btn-primary` hover updated to `#1a3058`; scope-selected border rgba tints updated to `36, 65, 115`.
- **Sidebar gradient**: updated to `linear-gradient(to bottom, #2e5795 0%, #111935 100%)`.
- **Top accent banner**: a 6 px fixed bar at the top of the content area (starts after the sidebar, not behind it) with a left-to-right gradient (`#ab7197` â†’ `#f9604d`); implemented via `body::before` with `left: var(--sidebar-width)`; `body:has(.sidebar.collapsed)::before` shifts it to `left: 60px` when the nav is collapsed; `.layout` gains `padding-top: 6px`.
- **CTA / accent color**: `--accent` updated to `#3b56bb` (was `#375496`); `btn-primary` hover updated to `#2e44a0`; scope-selected border rgba tints updated to `59, 86, 187`.
- **Sidebar gradient**: `.sidebar` background changed from flat `var(--sidebar-bg)` to `linear-gradient(to bottom, #3b56bb 0%, #111937 100%)`.
- **Sidebar menu text color**: `--sidebar-text` updated to `#c0c6d4` (was `#94a3b8`).
- **Active nav item background**: `.nav-item.active` background updated to `#456eab` (was `#4055a9`).
- **CTA buttons â€” pill shape**: `border-radius: 9999px` added to `.btn-primary` and `.btn-outline` so primary and Cancel buttons render as fully rounded pills. `.btn-choice` (Add content / Add sub-topics cards) overridden to `border-radius: 10px` and `.btn-add-sub` (dashed add row) to `border-radius: 8px` to preserve their card/tile appearance.
- **Add Topic button â€” larger size**: `#addTopicBtn` overridden with `padding: 9px 20px` and `font-size: 13.5px` to make it slightly more prominent in the toolbar.
- **Scope card â€” company brand color**: `renderCard()` in `script-sidebar-scope.js` now applies the company's `color` field as the inline background of the `$logo` element (the top-left initial/avatar box), using `isLightColor` to auto-pick black or white text for legibility.
- **Sidebar background**: `--sidebar-bg` updated to `#24272e`.
- **CTA / accent color**: `--accent` updated to `#375496`; `btn-primary` hover updated to `#2c4280`; `--accent-light` updated to `#e8eef8`; hardcoded blue rgba tints in scope-selected state updated to match.
- **Company brand colors**: added a `color` field to every company in `FALLBACK_COMPANIES` (`script-sidebar-scope.js`) and `SIDEBAR_COMPANIES` (`script-topics-sidebar-scope.js`). `avatarHtml` now applies the brand color as the avatar background; a new `isLightColor` helper picks black or white text for legibility. MTN Group `#ffcc00`, Standard Bank `#005aff`, and five other realistic brand colors assigned.
- **Bulk select â€” always-visible faint checkboxes**: removed the "Bulk Select" toolbar button. Checkboxes are now always rendered on topic rows at `opacity: 0.2`, rising to `0.5` on row hover and `1.0` when checked. The Disable button still appears only when at least one checkbox is selected. `select-mode` body class and all related CSS rules removed; `toggleBulkSelect` reduced to a reset helper.

### Changed
- **Share icon updated to `fa-people-group`**: replaced `fa-share-nodes` with `fa-people-group` in the tree chip, both kebab menu "Share" items (`script-topics.js`), and the panel topbar badge (`index-topics.html`).
- **Share panel badge â€” indigo**: `.detail-share-badge` background/text/icon updated from orange to indigo (`#eef2ff` / `#3730a3` / `#6366f1`) in `styles-topics.css`.
- **Shares chip + share panel â€” orange â†’ indigo, chip style â†’ gray outline**: `.chip-shares` row badge now uses the base gray `.chip` style (white background, gray border/text) with an indigo icon, matching the sub-topics and file-type chips. Share panel: checkbox `accent-color` and `.share-dept-tag` date badge are indigo. Confirm button uses the standard `btn-primary` style.

### Added
- **Share panel â€” shared date badge**: the "Currently shared" tag on already-shared departments now shows the date the topic was shared (e.g. "12 Apr '26"). `shareTopicWithDepartments` stamps `sharedDate` (ISO string) on the pushed copy; two new helpers `formatSharedDate` and `getSharedDate` in `script-topics.js` look it up and format it. Falls back to "Shared" for topics shared before this change.
- **Add Topic â€” sub-topic list scrollbar**: `.sub-list` now has `max-height: 210px; overflow-y: auto` so that a sixth sub-topic activates a vertical scrollbar instead of expanding the panel indefinitely.

### Removed
- **Sub-topic cover/thumbnail in add and edit forms**: removed the Cover Image picker from `openSubEditor` (tab flow), `openModuleEdit`, and `addModule` (kebab). Cover data is no longer read, stored, or persisted for sub-topics anywhere (`commitSubEditor`, `appendSubItem`, `readListedSubs`, `saveEdit`, `saveAdd`, `createSubTopicRow`, `subTopicRowHtml`, `snapshotCurrentScope`). The `.sub-list-cover` img element and CSS rule removed from `styles-topics.css`.
- **Sub-topic linked game**: removed the Linked Game field from all sub-topic add/edit forms (`addModule`, `openSubEditor`, `openModuleEdit`), from all row-rendering paths (`createSubTopicRow`, `subTopicRowHtml`), from the staged-list data model (`appendSubItem`, `readListedSubs`, `commitSubEditor`), from `saveEdit`/`saveAdd`, `updateModuleRowChips`, and `snapshotCurrentScope`. The `data-linked-game-id`/`data-linked-game-name` dataset attributes and `chip-game` chips are no longer written anywhere.
- **Sub-topic row thumbnails**: the 28Ã—28 px thumbnail image has been removed from sub-topic rows in both `createSubTopicRow` and `subTopicRowHtml` in `script-topics.js`. Only topic rows retain their thumbnail. The `.row-thumb-sub` CSS rule has been removed from `styles-topics.css`.

### Fixed
- **Add sub-topic (kebab menu) â€” cover picker missing**: `addModule()` now renders a Cover Image picker above the Sub-Topic Name field, matching the field order used in the edit panel. Cover is passed through to `createSubTopicRow` via `data.get('cover')`.
- **Edit topic/sub-topic â€” panel stays open after Save**: saving a topic edit now calls `showEmpty()` instead of re-opening `openTopicEdit`. Sub-topic edits already called `showEmpty()`; topic edits now do the same.
- **Sub-topic linked games not persisting**: `subTopicRowHtml` (used by `renderTopicsForScope`) was missing the `data-linked-game-id` and `data-linked-game-name` attributes and the game chip in `.cell-pills`. After a scope re-render the linked game was lost from the DOM even though it was correctly stored in `TOPICS_BY_SCOPE`. Both attributes and the chip are now rendered from the stored `sub.linkedGameId`.

### Added
- **Topics list â€” inline primary chip**: the sub-topic count badge (topics) and media-type badge (sub-topics) now sit immediately after the row name rather than in the grouped chip area. Descriptions removed from topic rows. Remaining badges (shares, status, game) stay in their existing positions. `updateTopicRowChips` and `updateModuleRowChips` updated to target the new `.row-main-chip` wrapper instead of `.cell-pills`.

- **Add Topic â€” two-tab panel**: the Add Topic detail panel now has a "Topic" tab (cover, name, description, content choice) and a "Sub-topics" tab (staged list + inline editor). The Sub-topics tab is disabled until the user picks "Add sub-topics", then activates automatically; cancelling back to zero sub-topics re-disables it. The topic mini-card collapse/expand pattern is removed. Tab badge shows the current sub-topic count. Implemented via new `switchAddTab()` in `script-topics.js` and `.add-topic-tabs` / `.add-topic-tab` / `.add-topic-pane` rules in `styles-topics.css`.

- **Removed topic descriptions from list rows**: the inline `.row-description` span has been removed from `topicRowHtml` and `subTopicRowHtml` in `script-topics.js`, and the `.row-description` CSS rule removed from `styles-topics.css`. Descriptions are still stored on the data objects and editable in the detail panel.
- **Topics list â€” randomized thumbnail colours**: topic and sub-topic thumbnails now pick randomly from the three gradient presets (blueâ†’purple, orangeâ†’pink, tealâ†’green) via a new `randomCover()` helper in `script-topics.js`, instead of always showing the blueâ†’purple default.
- **Topics list â€” square thumbnails**: topic rows show a 36Ã—36 px thumbnail and sub-topic rows a 28Ã—28 px thumbnail, placed between the chevron/connector and the name. All three row-generation paths updated (`topicRowHtml`, `subTopicRowHtml`, `createSubTopicRow` in `script-topics.js`); styled with `.row-thumb` / `.row-thumb-sub` in `styles-topics.css`. Falls back to the default blueâ†’purple gradient when no custom cover is set.
- **Topics list â€” inline descriptions**: topic and sub-topic rows in `index-topics.html` now show the item's description as muted secondary text immediately after the name. Rendered by `topicRowHtml` and `subTopicRowHtml` in `script-topics.js`; styled with the new `.row-description` rule in `styles-topics.css`. Descriptions truncate with an ellipsis at 260 px so chips/status badges are never crowded out.

- `CLAUDE.md` â€” onboarding notes for Claude Code covering page/script map, the cross-page scope mechanism, the duplicated company/department reference data, the topics data model, and DevExtreme conventions.
- `CHANGELOG.md` â€” this file. All future changes (by the user or by Claude) should be appended here under a dated section.
- Working-agreement section in `CLAUDE.md`: no tests; Tailwind preferred for new styling (target stack Tailwind + DevExtreme + React); project contact pinned to elsadr@agilebridge.co.za; commit-prompt expectation for Claude; no Claude `Co-Authored-By` trailer in commit messages.
- Git repository initialised; default branch renamed to `main`; `user.email` set to `elsadr@agilebridge.co.za`.

### Changed
- `.gitignore` expanded to cover `node_modules/`, `.DS_Store`, `Thumbs.db`, and editor swap files (`*.swp`, `*.swo`).

