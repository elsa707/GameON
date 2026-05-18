# Changelog

All notable changes to this project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

Project contact: elsadr@agilebridge.co.za

## [2026-05-14]

### Changed
- **Topic cover presets — third preset changed to purple**: the teal→green gradient (`#14b8a6` → `#22c55e`) in `COVER_PRESETS` replaced with purple→violet (`#a855f7` → `#7c3aed`) in `script-topics.js`.

### Fixed
- **Edit sub-topic — upload tile text not centred**: `.cover-upload-empty` changed to `position: absolute; inset: 0` with `justify-content: center` so the icon and "UPLOAD" label are vertically and horizontally centred within the tile.

## [2026-05-18]

### Fixed
- **Add with AI — content section collapses after Generate**: clicking Generate collapses the content picker, sub-topics toggle, and model selector into a compact one-line summary bar showing the filename/URL/text, active pills for model and sub-topics, and a chevron to re-expand. `collapseAIStep1()` and `expandAIStep1()` added to `script-topics.js`; `.ai-step1-collapsed` styles added to `styles-topics.css`. Regenerate does not re-collapse since the bar is already present.
- **Add with AI — Share tab more compact**: `#detailEdit .share-dept-list` max-height reduced to `24vh` and item padding tightened to `5px 10px` (scoped to the edit panel so the standalone share panel is unaffected).
- **Add Topic / Add with AI buttons broken after Share step**: `showAddShareStep` replaced `.edit-actions` with Skip/Share buttons, removing `#editSubmitBtn` from the DOM. The next `setPanelMode` call crashed on `null.hidden`. Fixed by restoring the original `.edit-actions` HTML at the top of `setPanelMode` when `#editSubmitBtn` is missing.
- **Topics list — share badge now shows correctly**: `getSharedDepartments` rewritten to look only in `TOPICS_BY_SCOPE` (not fallback defaults), only in departments other than the current one, and only for topic copies that carry `sharedDate` (set by `shareTopicWithDepartments`). Previous logic matched topics via the default fallback chain, causing either no badge (topic not in defaults) or inflated counts (topic in all dept defaults). `applyAddShare` now calls `persistTopicsScope()` and `refreshTopics()` after sharing so the badge appears immediately on the newly-added row.
- **Topics list — expansion chevron hidden for topics with no sub-topics**: `topicRowHtml` now renders the chevron with `visibility:hidden` when `subCount === 0`; the freshly-added row in `saveAdd` also starts hidden. `updateTopicRowChips` now shows or hides the chevron whenever the sub-topic count changes. `toggleTopic` returns early if there are no sub-topic rows, so clicking the row does nothing.

### Added
- **Add Topic / Add with AI — Share step after Save**: clicking Save in either add flow now saves the topic and then reveals a Share tab (added dynamically to the tab bar) instead of closing the panel. The Share tab lists every department in the current company as checkboxes. The action buttons swap to "Skip" (closes the panel) and "Share" (applies sharing via `shareTopicWithDepartments` and closes). `showAddShareStep()` and `applyAddShare()` added to `script-topics.js`; `_pendingShareTopicName` stores the saved topic name between the two steps.
- **Add Topic — Sub-topics tab hidden until needed**: the Sub-topics tab is no longer visible in the tab bar until the user clicks "Add sub-topics". It is re-hidden if all sub-topics are removed. Previously it was always visible but disabled.
- **Add Topic / Add with AI — Share tab grayed out until Save**: the Share tab is visible in the tab bar from the start but `disabled` (grayed out). Clicking Save saves the topic, enables the Share tab, and switches to it automatically. `showAddShareStep()` no longer injects a tab dynamically — it just enables the pre-existing disabled button.

### Changed
- **Add with AI — credits badge shows "X / 200 used"**: badge text updated from "N credits" to "N / 200 used". A persistent `_aiCreditsUsed` counter (starting at 12) increments on every Generate/Regenerate click and updates `#aiCreditsCount` in real time.

### Changed
- **Add with AI — sub-topics accordion in second tab**: when "Generate with sub-topics" is toggled on, `aiGenerateStep2()` now builds a two-tab layout inside `#aiStep2Section`. The Topic tab shows the cover picker, editable name and description, and a preview list of suggested sub-topic names with a "View Sub-topics" button. The Sub-topics tab shows an accordion: clicking the chevron expands the row (collapsing any other open row) to reveal a scrollable `contenteditable` WYSIWYG pre-populated with rich HTML. The sub-topic name in the header is also `contenteditable` so both name and content are directly editable. Each `_AI_SUGGESTIONS` entry now carries a `subtopics` array (3–4 items each) with name and HTML body. `switchAITab()` and `toggleAISub()` added to `script-topics.js`; accordion and WYSIWYG CSS added to `styles-topics.css`.

## [Unreleased]

### Fixed
- **Add with AI — generated sub-topics now appear in the tree after Save**: `saveAdd()` now reads sub-topic names from `#aiTabPaneSubs .ai-sub-item` accordion rows (via `.ai-sub-name`) in addition to the normal `#subsList` staged list. Each AI sub-topic is created as a `text` media-type row under the new topic.
- **Topics list — sub-topics badge hidden when count is zero**: `topicRowHtml`, `updateTopicRowChips`, and the new-row HTML in `saveAdd` no longer render the "0 sub-topics" chip. The badge only appears when there is at least one sub-topic.
- **Add with AI — Save validates name and description only**: in the AI flow (`#aiStep2Section` present), `saveAdd()` now skips the content/sub-topic requirement check and instead only validates that Topic Name and Description are non-empty. If either is blank, the Topic tab is activated and focus moves to the empty field.
- **Add with AI — credits persist per company across panel openings**: replaced `_aiCreditsUsed` (single number) with `_companyCreditsUsed` (object keyed by company name). Opening "Add with AI" a second time for the same company now continues from the previously accumulated count. The panel badge and scope card indicator both reflect the live value.
- **Sidebar — AI credits indicator below company name**: a `.scope-card-credits` line (`#scopeCredits`) appears under the department name in the scope card once any AI generation has happened for the selected company. Shows "X / N AI credits used". Hidden until the first generation, hidden when no company is selected.
- **Add with AI — credits badge starts at 0 and shows company total**: counter resets to 0 each time the AI panel opens; total shown is the company's available credits (added as a `credits` field to `SIDEBAR_COMPANIES` in `script-topics-sidebar-scope.js`). Badge reads "0 / 500 used" (for Naspers), "0 / 300 used" (Standard Bank), etc. Increments by 1 on each Generate/Regenerate.
- **Add with AI — unique generated topic names**: `_AI_NAME_POOL` expanded to 25 name+description pairs, shuffled at page load into `_aiNameQueue`. Each Generate/Regenerate draws the next entry from the queue without repeating; the queue reshuffles only once exhausted. Subtopic WYSIWYG content still cycles through the 4 rich content sets in `_AI_SUGGESTIONS`.

### Changed
- **Add with AI — model selector**: a dropdown (`#aiModelSelect`) in step 1 lets the user choose the AI model; defaults to Claude Sonnet 4.6 with options for Opus 4.7, Haiku 4.5, GPT-4o, and Gemini 1.5 Pro. Styled via the existing `.form-group select` rules.
- **Add with AI — sub-topics toggle**: a "Generate with sub-topics" toggle switch appears in step 1 below the content picker (`#aiIncludeSubtopics`). UI only — sub-topic generation flow to follow.
- **Add with AI — Regenerate updates fields**: each Regenerate click cycles through `_AI_SUGGESTIONS` (4 preset name/description pairs) and rotates the cover tile selection. Index resets when the AI panel opens.
- **Add with AI — two-step flow**: Generate/Regenerate injected into `.edit-actions` (same `flex: 1` width as Save). Generate starts disabled and enables reactively when content is provided (file upload, URL typed, or text entered) via `updateAIGenerateBtn()` hooked into `setContentKind`, `onContentFileChange`, `onContentFileDrop`, and an `input` event listener on the picker. Save stays disabled until first Generate click. `.badge-ai` uses `--accent-light`/`--accent`, matching other panel badges. Clicking Generate runs `aiGenerateStep2()` which reveals the cover picker, pre-populated Topic Name, and Description below the content section in the same open panel — all three fields remain editable. Submit button becomes "Save". A gradient "Generated details" divider separates the content from the generated fields.
- **Content picker — Video URL → Web URL**: the video/URL tab in all content pickers now reads "Web URL" with a link icon (`fa-link`); placeholder updated to `https://…`.
- **Add with AI button**: new `.btn-ai` button added to the topics toolbar (right of "Add Topic"), styled with the same `#ab7197 → #f9604d` left-to-right gradient as the top banner, with a pill radius and animated gradient-shift on hover. Clicking it runs the same Add Topic flow but replaces the panel badge with "Adding with AI" (gradient-filled `.badge-ai` class). `addTopicAI()` added to `script-topics.js`; `#addTopicAIBtn` wired into the scope-enable/disable logic in `script-topics-sidebar-scope.js`; `setPanelMode` clears `.badge-ai` so normal add/edit flows are unaffected.
- **CTA / accent color**: `--accent` updated to `#244173`; `btn-primary` hover updated to `#1a3058`; scope-selected border rgba tints updated to `36, 65, 115`.
- **Sidebar gradient**: updated to `linear-gradient(to bottom, #2e5795 0%, #111935 100%)`.
- **Top accent banner**: a 6 px fixed bar at the top of the content area (starts after the sidebar, not behind it) with a left-to-right gradient (`#ab7197` → `#f9604d`); implemented via `body::before` with `left: var(--sidebar-width)`; `body:has(.sidebar.collapsed)::before` shifts it to `left: 60px` when the nav is collapsed; `.layout` gains `padding-top: 6px`.
- **CTA / accent color**: `--accent` updated to `#3b56bb` (was `#375496`); `btn-primary` hover updated to `#2e44a0`; scope-selected border rgba tints updated to `59, 86, 187`.
- **Sidebar gradient**: `.sidebar` background changed from flat `var(--sidebar-bg)` to `linear-gradient(to bottom, #3b56bb 0%, #111937 100%)`.
- **Sidebar menu text color**: `--sidebar-text` updated to `#c0c6d4` (was `#94a3b8`).
- **Active nav item background**: `.nav-item.active` background updated to `#456eab` (was `#4055a9`).
- **CTA buttons — pill shape**: `border-radius: 9999px` added to `.btn-primary` and `.btn-outline` so primary and Cancel buttons render as fully rounded pills. `.btn-choice` (Add content / Add sub-topics cards) overridden to `border-radius: 10px` and `.btn-add-sub` (dashed add row) to `border-radius: 8px` to preserve their card/tile appearance.
- **Add Topic button — larger size**: `#addTopicBtn` overridden with `padding: 9px 20px` and `font-size: 13.5px` to make it slightly more prominent in the toolbar.
- **Scope card — company brand color**: `renderCard()` in `script-sidebar-scope.js` now applies the company's `color` field as the inline background of the `$logo` element (the top-left initial/avatar box), using `isLightColor` to auto-pick black or white text for legibility.
- **Sidebar background**: `--sidebar-bg` updated to `#24272e`.
- **CTA / accent color**: `--accent` updated to `#375496`; `btn-primary` hover updated to `#2c4280`; `--accent-light` updated to `#e8eef8`; hardcoded blue rgba tints in scope-selected state updated to match.
- **Company brand colors**: added a `color` field to every company in `FALLBACK_COMPANIES` (`script-sidebar-scope.js`) and `SIDEBAR_COMPANIES` (`script-topics-sidebar-scope.js`). `avatarHtml` now applies the brand color as the avatar background; a new `isLightColor` helper picks black or white text for legibility. MTN Group `#ffcc00`, Standard Bank `#005aff`, and five other realistic brand colors assigned.
- **Bulk select — always-visible faint checkboxes**: removed the "Bulk Select" toolbar button. Checkboxes are now always rendered on topic rows at `opacity: 0.2`, rising to `0.5` on row hover and `1.0` when checked. The Disable button still appears only when at least one checkbox is selected. `select-mode` body class and all related CSS rules removed; `toggleBulkSelect` reduced to a reset helper.

### Changed
- **Share icon updated to `fa-people-group`**: replaced `fa-share-nodes` with `fa-people-group` in the tree chip, both kebab menu "Share" items (`script-topics.js`), and the panel topbar badge (`index-topics.html`).
- **Share panel badge — indigo**: `.detail-share-badge` background/text/icon updated from orange to indigo (`#eef2ff` / `#3730a3` / `#6366f1`) in `styles-topics.css`.
- **Shares chip + share panel — orange → indigo, chip style → gray outline**: `.chip-shares` row badge now uses the base gray `.chip` style (white background, gray border/text) with an indigo icon, matching the sub-topics and file-type chips. Share panel: checkbox `accent-color` and `.share-dept-tag` date badge are indigo. Confirm button uses the standard `btn-primary` style.

### Added
- **Share panel — shared date badge**: the "Currently shared" tag on already-shared departments now shows the date the topic was shared (e.g. "12 Apr '26"). `shareTopicWithDepartments` stamps `sharedDate` (ISO string) on the pushed copy; two new helpers `formatSharedDate` and `getSharedDate` in `script-topics.js` look it up and format it. Falls back to "Shared" for topics shared before this change.
- **Add Topic — sub-topic list scrollbar**: `.sub-list` now has `max-height: 210px; overflow-y: auto` so that a sixth sub-topic activates a vertical scrollbar instead of expanding the panel indefinitely.

### Removed
- **Sub-topic cover/thumbnail in add and edit forms**: removed the Cover Image picker from `openSubEditor` (tab flow), `openModuleEdit`, and `addModule` (kebab). Cover data is no longer read, stored, or persisted for sub-topics anywhere (`commitSubEditor`, `appendSubItem`, `readListedSubs`, `saveEdit`, `saveAdd`, `createSubTopicRow`, `subTopicRowHtml`, `snapshotCurrentScope`). The `.sub-list-cover` img element and CSS rule removed from `styles-topics.css`.
- **Sub-topic linked game**: removed the Linked Game field from all sub-topic add/edit forms (`addModule`, `openSubEditor`, `openModuleEdit`), from all row-rendering paths (`createSubTopicRow`, `subTopicRowHtml`), from the staged-list data model (`appendSubItem`, `readListedSubs`, `commitSubEditor`), from `saveEdit`/`saveAdd`, `updateModuleRowChips`, and `snapshotCurrentScope`. The `data-linked-game-id`/`data-linked-game-name` dataset attributes and `chip-game` chips are no longer written anywhere.
- **Sub-topic row thumbnails**: the 28×28 px thumbnail image has been removed from sub-topic rows in both `createSubTopicRow` and `subTopicRowHtml` in `script-topics.js`. Only topic rows retain their thumbnail. The `.row-thumb-sub` CSS rule has been removed from `styles-topics.css`.

### Fixed
- **Add sub-topic (kebab menu) — cover picker missing**: `addModule()` now renders a Cover Image picker above the Sub-Topic Name field, matching the field order used in the edit panel. Cover is passed through to `createSubTopicRow` via `data.get('cover')`.
- **Edit topic/sub-topic — panel stays open after Save**: saving a topic edit now calls `showEmpty()` instead of re-opening `openTopicEdit`. Sub-topic edits already called `showEmpty()`; topic edits now do the same.
- **Sub-topic linked games not persisting**: `subTopicRowHtml` (used by `renderTopicsForScope`) was missing the `data-linked-game-id` and `data-linked-game-name` attributes and the game chip in `.cell-pills`. After a scope re-render the linked game was lost from the DOM even though it was correctly stored in `TOPICS_BY_SCOPE`. Both attributes and the chip are now rendered from the stored `sub.linkedGameId`.

### Added
- **Topics list — inline primary chip**: the sub-topic count badge (topics) and media-type badge (sub-topics) now sit immediately after the row name rather than in the grouped chip area. Descriptions removed from topic rows. Remaining badges (shares, status, game) stay in their existing positions. `updateTopicRowChips` and `updateModuleRowChips` updated to target the new `.row-main-chip` wrapper instead of `.cell-pills`.

- **Add Topic — two-tab panel**: the Add Topic detail panel now has a "Topic" tab (cover, name, description, content choice) and a "Sub-topics" tab (staged list + inline editor). The Sub-topics tab is disabled until the user picks "Add sub-topics", then activates automatically; cancelling back to zero sub-topics re-disables it. The topic mini-card collapse/expand pattern is removed. Tab badge shows the current sub-topic count. Implemented via new `switchAddTab()` in `script-topics.js` and `.add-topic-tabs` / `.add-topic-tab` / `.add-topic-pane` rules in `styles-topics.css`.

- **Removed topic descriptions from list rows**: the inline `.row-description` span has been removed from `topicRowHtml` and `subTopicRowHtml` in `script-topics.js`, and the `.row-description` CSS rule removed from `styles-topics.css`. Descriptions are still stored on the data objects and editable in the detail panel.
- **Topics list — randomized thumbnail colours**: topic and sub-topic thumbnails now pick randomly from the three gradient presets (blue→purple, orange→pink, teal→green) via a new `randomCover()` helper in `script-topics.js`, instead of always showing the blue→purple default.
- **Topics list — square thumbnails**: topic rows show a 36×36 px thumbnail and sub-topic rows a 28×28 px thumbnail, placed between the chevron/connector and the name. All three row-generation paths updated (`topicRowHtml`, `subTopicRowHtml`, `createSubTopicRow` in `script-topics.js`); styled with `.row-thumb` / `.row-thumb-sub` in `styles-topics.css`. Falls back to the default blue→purple gradient when no custom cover is set.
- **Topics list — inline descriptions**: topic and sub-topic rows in `index-topics.html` now show the item's description as muted secondary text immediately after the name. Rendered by `topicRowHtml` and `subTopicRowHtml` in `script-topics.js`; styled with the new `.row-description` rule in `styles-topics.css`. Descriptions truncate with an ellipsis at 260 px so chips/status badges are never crowded out.

- `CLAUDE.md` — onboarding notes for Claude Code covering page/script map, the cross-page scope mechanism, the duplicated company/department reference data, the topics data model, and DevExtreme conventions.
- `CHANGELOG.md` — this file. All future changes (by the user or by Claude) should be appended here under a dated section.
- Working-agreement section in `CLAUDE.md`: no tests; Tailwind preferred for new styling (target stack Tailwind + DevExtreme + React); project contact pinned to elsadr@agilebridge.co.za; commit-prompt expectation for Claude; no Claude `Co-Authored-By` trailer in commit messages.
- Git repository initialised; default branch renamed to `main`; `user.email` set to `elsadr@agilebridge.co.za`.

### Changed
- `.gitignore` expanded to cover `node_modules/`, `.DS_Store`, `Thumbs.db`, and editor swap files (`*.swp`, `*.swo`).
