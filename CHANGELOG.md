# Changelog

All notable changes to this project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

Project contact: elsadr@agilebridge.co.za

## [2026-05-14]

### Fixed
- **Edit sub-topic — upload tile text not centred**: `.cover-upload-empty` changed to `position: absolute; inset: 0` with `justify-content: center` so the icon and "UPLOAD" label are vertically and horizontally centred within the tile.

## [Unreleased]

### Removed
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
