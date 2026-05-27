# Changelog

All notable changes to this project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

Project contact: elsadr@agilebridge.co.za

## [2026-05-27] — Topics: "Also create a game" toggle with inline flow picker

### Changed
- **`script-topics.js`** — renamed "Create with game" toggle to "Also create a game" for clarity.
- **`script-topics.js`** — `createGameToggleHtml()` now wraps the toggle and a new segmented control (`Normal | AI`) in a `.create-game-row` flex container; the segmented control is hidden until the toggle is switched on (`onCreateGameToggleChange`).
- **`script-topics.js`** — `selectGameFlow(btn)` handles Normal / AI button selection within the picker.
- **`script-topics.js`** — `_pendingGameFlow` variable added; captured from `#gameFlowPicker` at Save time and written into `gameon.pendingGame` localStorage payload as `gameFlow`.
- **`script-topics.js`** — `doAIGenerate` preserves and restores both the toggle state and the selected flow when the topic pane is rebuilt during AI regeneration.
- **`styles-topics.css`** — `.create-game-row`, `.game-flow-picker`, `.game-flow-btn` styles added.
- `script-topics.js` version bumped to `?v=52`.

## [2026-05-26] — Schedule panel: pre-fill existing dates

### Changed
- **`script-games.js`** — `buildScheduleBodyHtml(existingStart, existingEnd)` now accepts optional date values and pre-fills the Start/End date inputs when re-opening the Schedule panel on a game that already has dates set.
- **`script-games.js`** — `openGameSchedulePanel` passes `gameRow.dataset.scheduledDate` and `gameRow.dataset.scheduledEndDate` to the panel so existing dates are visible immediately.
- `script-games.js` version bumped to `?v=38`.

## [2026-05-26] — Games page: difficulty donut tooltip + difficulty tracking

### Added
- **`script-games.js`** — difficulty donut is now a 3-segment pie (green=Easy, orange=Medium, red=Hard) matching the live site.
- **`script-games.js`** — hover tooltip on each donut shows "Easy X% / Medium X% / Hard X%" with coloured dots; tooltip dismisses on mouse-out and does not trigger row click.
- **`styles-games.css`** — `.donut-tooltip`, `.donut-tt-row`, `.donut-tt-dot` — tooltip panel styles.

### Changed
- **`script-games.js`** — `_difficultyDonutSvg(easy, medium, hard)` now takes counts per level; segments computed via `rotate()` transform on each SVG `circle`.
- **`script-games.js`** — `qRowHtml` stores `data-difficulty` on every question row so `updateGameRowChips` can re-read it after DOM edits.
- **`script-games.js`** — `persistGamesScope` now saves `difficulty` field on each saved question.
- `script-games.js` version bumped to `?v=37`.

## [2026-05-26] — Games page: schedule date range + difficulty donut chart

### Added
- **`script-games.js`** — `_fmtDate(iso)` and `_fmtDateRange(start, end)` helpers format schedule dates as "Mon DD, YYYY – Mon DD, YYYY" (matching live site).
- **`script-games.js`** — `_difficultyDonutSvg(totalQ, catCount)` renders an inline SVG donut ring per game row; arc fill = total questions / (categories × 5 required); orange when incomplete, green when complete.
- **`styles-games.css`** — `.game-donut` flex wrapper for the donut SVG; updated `.chip-scheduled` to blue palette (`#eff6ff` bg, `#1d4ed8` text, `#3b82f6` icon) to match live site.

### Changed
- **`script-games.js`** — `gameRowHtml` now includes `data-scheduled-end-date` attribute, shows the full date range in the scheduled chip, and appends the donut SVG between the status chip and the actions menu.
- **`script-games.js`** — `updateGameRowChips` updated to display the full date range (start – end) and refresh the donut SVG in-place.
- **`script-games.js`** — `persistGamesScope` now saves `scheduledEndDate` from `data-scheduled-end-date` on the game row.
- `script-games.js` version bumped to `?v=36`.

## [2026-05-26] — Questions page: remove redundant empty state

### Removed
- **`index-questions.html`** — removed the `#questionsEmpty` block (icon + "No questions yet" text + duplicate Import/Add buttons); the header already has these buttons permanently.

### Changed
- **`index-questions.html`** — `#questionsHeaderActions` is now always visible (removed `hidden` attribute); no longer toggled by question count.
- **`script-questions.js`** — `renderQuestionsPage()` simplified: always shows and renders the question list, removing dead empty-state and header-actions toggling logic.

## [2026-05-26] — Questions page layout match (Done button + row styling)

### Changed
- **`index-questions.html`** — moved `#questionsDoneBar` inside `<main>` (after `#questionsList`), removed the stale fixed-position copy outside the layout.
- **`styles-questions.css`** — `.questions-done-bar` is now inline right-aligned (`display: flex; justify-content: flex-end`) instead of `position: fixed`. Button style changed to dark solid (`background: #374151`, white text, `border-radius: 8px`) to match live site.
- **`styles-questions.css`** — `.qlist-row` now has a light grey filled background (`#f3f4f6`), horizontal padding (`12px 16px`), `border-radius: 8px`, and `gap: 6px` between rows; removed the old bottom-border separator.

## [2026-05-26] — Questions page visual polish

### Changed
- **`styles-questions.css`** — answer chip colours corrected to match live site:
  - Incorrect answers: grey background (`#f3f4f6`), grey border (`#e5e7eb`), grey text (`#6b7280`).
  - Correct answer (`.q-answer-chip--correct`): green filled (`#dcfce7` bg, `#86efac` border, `#166534` text, bold).
- **`styles-questions.css`** — added `.questions-saved-toast` — full-width green banner fixed at bottom (`background: #22c55e`), with white checkmark-circle icon and "Questions saved successfully." text, auto-hides after 3.5 s.
- **`index-questions.html`** — added `#questionsSavedToast` element (hidden by default) for the success toast.
- **`script-questions.js`** — added `showQSavedToast()` helper; called in `submitAddQuestion` after every successful save; also shown on page-load when arriving after a save (i.e., questions exist and `openPicker` is false).

## [2026-05-26] — Questions page (index-questions.html)

### Added
- **`index-questions.html`** — new full page for managing a category's questions, matching the live site.
  - Back arrow (← ) returns to Games page.
  - Orange warning banner when fewer than 5 questions exist: *"At least 5 questions are required before this category can be used in a game."*
  - Empty state: large question-mark icon, "No questions yet. Add the first one.", Import from Excel + Add Question buttons.
  - Numbered question rows: question text + MCQ/type chip, answer chips (correct answer highlighted green), pencil + trash action icons.
  - **Done** button fixed bottom-right.
  - **+ Add Question** header button (shown once questions exist); opens the type picker in the right detail panel.
- **`script-questions.js`** — Questions page controller (IIFE):
  - Reads `gameon.questionsNav` localStorage key written by the Games page on save.
  - Loads game/category from `gameon.games.scope` localStorage.
  - Overrides `_doSaveQuestion` to write directly to localStorage (no DOM table on this page).
  - Overrides `submitAddQuestion` / `saveQAndAddAnother` to stay on this page and re-render.
  - Overrides `onGamesScope` to prevent games-table re-render on scope change.
  - Handles question delete; edit stub (toast "coming soon").
- **`styles-questions.css`** — page-specific styles: warning banner, empty state, question list rows, type chip, answer chips, done bar.
- **`script-games.js`**: `submitAddQuestion` and `saveQAndAddAnother` now navigate to `index-questions.html` via `_navigateToQuestionsPage(gameId, catId, openPicker)` which stores context in `gameon.questionsNav`.
- `openAddQuestionForm` made resilient when no DOM cat row exists (questions page); hidden `input[name="questionType"]` added so the type is recorded on save.
- `script-games.js` version bumped to `?v=35`.

## [2026-05-26] — Add Question form: dynamic options + separate Correct Answer section

### Changed
- **Answer Options** starts with 2 inputs (not 4); **Add Option** button appends more dynamically.
- **Correct Answer** is now a separate section below Answer Options, showing a radio list that mirrors the option labels — labels update live as options are typed.
- Removed inline radio buttons from each option row.
- `aqAddOption()` — appends a new option input and syncs the correct-answer radios.
- `aqSyncCorrectRadios()` — rebuilds the Correct Answer radio list whenever an option label changes, preserving the previously selected index.
- `_doSaveQuestion()` now reads all `input[name="opt"]` elements instead of fixed `opt0–opt3` names; requires at least 2 options.
- New CSS: `.aq-add-option-btn`, `.aq-correct-radios`, `.aq-correct-row`.
- `script-games.js` version bumped to `?v=34`.

## [2026-05-26] — Add Question form matching live site

### Changed
- **Add Question form** rebuilt to match live site: `← Change type` back link, **Question \*** text input, **Difficulty** dropdown (Easy / Medium / Hard), **Question Image** drag-and-drop zone (cloud icon, "Choose File" button, accepted types hint), **Answer Options** with Option 1–4 stacked inputs each with a green radio to mark the correct answer.
- Footer buttons: **Cancel** | **Save & Add Another** (saves and returns to type picker) | **Add Question** (saves and closes panel).
- `backToQTypePicker(gameId, catId)` — clicking "← Change type" returns to the type picker without losing the category.
- `saveQAndAddAnother(gameId, catId)` — saves current question and reopens type picker for next question in same category.
- `submitAddQuestion(gameId, catId)` / `_doSaveQuestion(gameId, catId)` — replaces the old form.onsubmit override.
- `_renderQTypePickerHtml(gameId, catId)` — shared helper used by all three entry points (new game flow, `actionAddQuestion`, `backToQTypePicker`); removes three copies of the Q_TYPES array.
- New CSS: `.aq-change-type`, `.aq-required`, `.aq-question-input`, `.aq-select`, `.aq-image-zone`, `.aq-image-*`, `.aq-options`, `.aq-option-label`, `.aq-option-row`, `.aq-option-input`, `.aq-correct-radio`.
- `script-games.js` version bumped to `?v=33`.

## [2026-05-26] — Open question type picker directly after Create Game

### Changed
- After **Create Game** succeeds, the panel now opens directly on the **question type picker** (matching live site) instead of an intermediate "game created" banner.
- A **Category 1** is auto-created silently so the question picker is immediately usable — no prompt required.
- Panel title = "Add Question", subtitle = game name.
- Question type cards restyled to match live site: grey card background (`#f3f4f6`), larger centred icon circle (54 px, dark icon on `#dde1e7`), bolder title, rounded-12 corners, indigo hover.
- MCQ icon updated to `fa-circle-question` to better match the live site.
- `showGameCreatedPanel()` and `openAddCategoryFromPanel()` replaced by `showQTypePickerForNewGame()`.
- `script-games.js` version bumped to `?v=32`.

### Removed
- "Game created" banner step and "Add Category" prompt removed from the post-create flow.

## [2026-05-26] — Remove page-header credit balance; add panel topbar credit pill

### Added
- **Credit balance pill** shown in the detail panel topbar whenever the AI game flow is open — displays `🪙 X / Y used` (e.g. `35 / 300 used`) as an amber pill matching the live site.
- Pill updates live when a generation completes (credit is consumed) and turns a deeper amber when over 80% of credits are used.
- Pill is hidden in all non-AI panel states (edit, created, share, schedule).
- New element `#aiPanelCreditBal` in `index-games.html`; new CSS `.ai-panel-credit-bal` / `.ai-panel-credit-bal--warn` in `styles-games.css`.

### Removed
- **Page-header credit balance badge** (`#pageAICreditBalance`) removed from `index-games.html` — credits are now shown only in the panel topbar during AI flow.
- `.page-ai-credit-balance` CSS removed from `styles-games.css`.
- `script-games.js` version bumped to `?v=31`.

## [2026-05-26] — Game created next-step panel

### Added
- After **Create Game** succeeds, the detail panel transitions to a **"Created" state** instead of closing: shows the game's cover image, an Active chip, and the prompt *"Your game is ready. Add a category to start building questions."*
- **Add Category** button in the created panel immediately prompts for a category name, inserts the category row in the table, then opens the question-type picker — letting the user build out the game in one continuous flow.
- New function `showGameCreatedPanel(gameId, gameName, gameCover)` called at the end of `saveGameAdd()` manual path.
- New function `openAddCategoryFromPanel(gameId)` — creates the category and opens the question-type picker.
- New CSS: `.game-created-banner`, `.game-created-cover`, `.game-created-info`, `.game-created-lead`, `.game-created-actions`.
- `script-games.js` version bumped to `?v=31`.

## [2026-05-26] — Question type picker panel (matches live site Add Question flow)

### Added
- **Add Question** now opens a question type picker in the detail panel before the question form — matching the live site. Seven types shown as stacked cards with icon, title and description: Multiple Choice (MCQ), Fill in the Blanks, Statement Blanking, Select on Image, Match the Terms, Word Bucket, Crossword.
- Selecting a type transitions to the question form with a blue badge showing the chosen type above the fields.
- New function `openAddQuestionForm(type, gameId, catId)` — extracted from the old inline handler.
- New CSS: `.q-type-picker`, `.q-type-card`, `.q-type-card-icon`, `.q-type-card-title`, `.q-type-card-desc`, `.q-type-selected-badge`.

## [2026-05-26] — Move Add Game form back to right-side detail panel

### Changed
- **Add Game form** moved from centred modal overlay back to the right-side detail panel (user feedback: should not be a modal).
- All new fields remain: drag-and-drop cover zone, Name *, Description, Topic, Advanced collapsible (Max attempts / Questions per session / Pass Threshold %), Share with departments.
- Submit button in the panel labelled **"Create Game"** in add mode.
- `saveGameAdd()` manual path now reads fields by ID and applies share inline (no longer switches to a Share & Schedule tab step).
- Modal HTML and `saveAddGameModal()` removed; `closeAddGameModal()` redirects to `showGameEmpty()`.

## [2026-05-26] — Match Games page button styles to Topics page

### Changed
- **"Add Game" button**: restored to `btn-primary` (dark navy pill, trophy icon, label "Add Game") to match the "Add Topic" button style on the Topics page.
- **"Generate with AI" button**: label updated from "Generate" to **"Generate with AI"** (keeps the pink gradient `btn-ai` style), matching the Topics page "Generate with AI" button.

## [2026-05-26] — Align Add Game flow to live site (modal, Advanced section, button labels)

### Changed
- **"Add Game" button** renamed to **"+ New"** (dark button style `.btn-dark`) to match the live site.
- **"Add with AI" button** renamed to **"Generate"** (sparkles icon, existing `btn-ai` style) to match the live site.
- **Add Game flow** converted from a right-side detail panel with tabs (Game / Categories / Share & Schedule) to a **centred modal overlay** (`#addGameModal`) matching the live site layout.
  - Cover image is now a full drag-and-drop upload zone at the top of the modal (cloud icon, "Drag & drop or click to add cover image", "Recommended: 1280 × 720 · JPG or PNG").
  - Fields: Name *, Description (optional), Topic (optional).
  - **Advanced ∨ collapsible** section added with: Max attempts (placeholder "e.g. 3", hint "Defaults to 2 if left empty"), Questions per session (default 5, hint "Defaults to 5 if left empty"), **Pass Threshold (%)** (placeholder "e.g. 60", hint "Defaults to 60% if left empty" — previously missing entirely from the prototype).
  - Share with departments rendered inline at the bottom of the modal (checkbox list, applied on Create Game).
  - Modal footer: Cancel + **Create Game** buttons.
  - Clicking the backdrop closes the modal.
- `_checkPendingGame()` updated to populate modal fields (`#addGameName`, `#addGameDesc`, `#addGameCoverZone`) instead of the old panel pane (`#gameTabPaneGame`).

### Added
- New functions: `closeAddGameModal()`, `saveAddGameModal()`, `previewAddGameCover()`, `toggleAddGameAdvanced()`, `onAddGameTopicChange()`.
- New CSS: `.btn-dark`, `.modal-overlay`, `.add-game-modal`, `.add-game-modal-header/body/footer`, `.add-game-cover-zone`, `.add-game-cover-*`, `.add-game-advanced`, `.add-game-advanced-toggle/body`, `.form-field-hint`, `.add-game-share-section`.
- `script-games.js` version bumped to `?v=30`.

## [2026-05-26] — GAM-382 gap fixes: difficulty ratio, Match The Terms, file validation

### Changed
- **Difficulty mix display**: changed from mock percentage chips (`Easy 10% · Medium 70% · Hard 20%`) to the correct backend-fixed ratio `1 Easy · 1 Medium · 1 Hard` per category (user cannot set this).

### Added
- **Match The Terms question type**: added to the AI question types grid (`fa-link` icon, value `match-terms`), completing the full set from GAM-382 (MCQ, Word Bucket, Crossword, Fill in the Blank, Statement Blanking, Select on Image, Match The Terms).
- **File upload validation toasts**: `onAIGameFileChange()` now explicitly checks the file extension against the allowed list (`pdf`, `docx`, `xlsx`, `png`, `jpeg`, `jpg`) and shows *"Unsupported file type. Please upload a PDF, DOCX, XLSX, PNG, JPG, or JPEG file."* on failure, or *"File successfully uploaded."* on success.
- `script-games.js` version bumped to `?v=29`.

## [2026-05-26] — replace cover image toggle with always-visible drop zone

### Changed
- Removed the "Add cover image" on/off toggle from the Add Game and AI-generated game panels. The cover upload is now always visible as a dashed drop zone (`Drop a file or click to upload`) matching the upload design pattern.
- When a file is selected the zone shows a full-bleed preview with a "Change" overlay on hover.
- New `gameCoverDropZoneHtml()` builder and `previewGameCoverDrop()` handler replace `gameCoverToggleHtml()` / `toggleGameCoverSection()` for the add/AI flows. The edit existing game panel retains the preset-tile picker.
- Added `.cover-drop-zone`, `.cover-drop-icon`, `.cover-drop-text`, `.cover-drop-preview`, `.cover-drop-overlay` CSS rules in `styles-games.css`.
- `script-games.js` version bumped to `?v=28`.

## [2026-05-26] — remove AI credit balance from detail panel topbar

### Removed
- Removed the `#aiGameCreditsDisplay` credit balance pill (`20 / 300 used`) from the detail panel topbar. The page-header badge (`#pageAICreditBalance`) is unchanged.
- Removed associated JS references (`aiGameCreditsCount`, `aiGameCreditsTotal`, `aiGameCreditsDisplay`) from `setGamePanelMode()` and the post-generation credit update. Credits are still tracked and reflected on the page-header badge via `updateGameScopeCreditsDisplay()`.
- `script-games.js` version bumped to `?v=27`.

## [2026-05-25]

### Changed
- **Topics — Text content: rich text editor**: the "Text" tab in the sub-topic content picker now renders a `contenteditable` div with a compact formatting toolbar (Bold, Italic, Underline, Bullet list, Numbered list) instead of a plain textarea. Content is stored and restored as HTML. CSS added in `styles-topics.css`. `readContentPicker()` and `removeTopicContent()` updated to use `innerHTML`.
- **Topics — AI flow Text input: rich text editor**: the "Text" source field (`#aiTextInput`) in the AI generate flow also uses the same rich text editor pattern (toolbar + `contenteditable` div with `.ai-rte` styling).
- **Topics — AI prompt: single-line input**: the AI-flow prompt field (`#aiPromptText`) changed from a multi-row textarea to a single-line `<input type="text">`.
- Removed the "Difficulty" Easy/Medium/Hard badge row from the AI Questions setup pane.
- Added a **Difficulty mix** ratio row to the generated Game tab (results preview), showing coloured percentage chips — e.g. `Easy 10%` · `Medium 70%` · `Hard 20%`. Ratios cycle through four mock presets per generation.
- Removed old `.ai-difficulty-row / .ai-difficulty-label / .ai-difficulty-badges / .ai-diff-badge / .ai-difficulty-note` CSS; replaced with `.ai-diff-ratio / .ai-diff-ratio-label / .ai-diff-ratio-chips / .ai-diff-chip` (colour vars `.ai-diff-easy/medium/hard` retained).
- **Share & Schedule tabs merged**: The separate "Share" and "Schedule" tabs in both the manual Add Game form and the AI-generated game results panel are replaced by a single "Share & Schedule" tab. Includes department checkboxes and a date‑range picker.
- **Date range picker**: replaced the old single `datetime-local` input with two `date` inputs (Start date / End date).
- **Combined confirm action**: one "Confirm" button applies both sharing and scheduling; old functions removed.
- **Kebab-menu schedule panel** updated to use the date‑range picker.
- **Word Rocket renamed to Word Bucket** throughout the AI game setup form.
- **Question types: radio buttons** (one per generation attempt) instead of checkboxes.
- **MCQ info note**: small "No image questions" note displayed below the MCQ label.
- **AI Add Game — two-tab setup panel**: restructured into Content and Questions tabs with proper tab bar.
- **File upload — approved formats only**: restricts to `.pdf`, `.docx`, `.xlsx`, `.png`, `.jpeg`, `.jpg`.
- **Question type cards — column layout**: text above, checkbox below; equal fixed height; centred alignment fixes applied.
- **Side panel — no horizontal scrollbar**: added `overflow-x: hidden`.
- **Game categories logic** updated to match diagram (topic sub-topics vs AI-suggested categories).
- **AI game results — cover image toggle default** fixed to only default ON when topic has a cover image.

### Added
- Restored the AI credit balance pill badge (`#pageAICreditBalance`) in the games page header, showing `<used> / <total>` credits with coin icon; amber when over 80% consumed.
- **AI credit balance badge** also added to games landing page header.

### Removed
- Removed the "Publish immediately" / "Schedule for a date range" radio toggle from the schedule form. Start/End date inputs are now always visible. `onScheduleTypeChange` and `.schedule-option` CSS removed.
- Removed the "Questions per session" input from the AI-generated game results panel; replaced with just "Max attempts".
- Reverted the "Add question type" post-generation feature (functions and CSS removed; button removed).

### Fixed
- **Question type cards — equal height**: all six cards now exactly the same height.
- **Questions pane — no vertical scrollbar**: tightened spacing so full content fits without scroll.
- **Question type cards — text and checkbox centre alignment**: specificity fix so flex layout applies correctly.
- **Question type cards — proper centre alignment**: wrapped label in flex span for consistent alignment.
- **Question type cards — checkbox alignment**: icon+text left, checkbox right, vertically centred.
- **Select on Image — enabled**: option now selectable like others.
- **Detail panel — no outer scroll**: only form fields area scrolls; top/bottom pinned.

## [2026-05-22] — fixes

### Fixed
- **Add cover image — toggle (off by default)**: cover image picker in both the manual Add Game form and the AI Game flow result tab is now collapsed behind an "Add cover image" toggle, matching the diagram. The toggle defaults to off (no cover = random assigned on save); if a topic is linked the toggle defaults to on with the topic cover pre-selected and labelled "(from topic)". Implemented via `gameCoverToggleHtml()` and `toggleGameCoverSection()` helpers.
- **File upload preview**: uploading a file in the AI Game flow now shows a styled preview card — image thumbnail for image files, and a file-type icon (PDF, Word, etc.) + filename + file size for documents. A "Change" button lets the user re-pick. Replaces the previous plain-filename display.
- **Questions per category — clearer label**: slider label changed from "Max questions per category" to "Questions per category (max 10)" with a sub-note "Questions per attempt is configured in the manual flow", matching the diagram note that per-attempt count lives in the manual flow.
- `script-games.js` version bumped to `?v=12`.

## [2026-05-22]

### Added
- **AI game flow — Topic link**: "Link to topic" selector (populated from `TOPICS_BY_SCOPE`/`TOPICS_BY_DEPT` via newly-loaded `topics-data.js`) added to the AI Add Game form. Selecting a topic pre-fills the optional content note, and after generation pre-fills game name, description and cover on the Game tab.
- **AI game flow — Question types config**: checklist of question types (MCQ ✓, Word Rocket, Crossword, Fill in the Blank, Statement Blanking, Select on Image [disabled until image content]) added to the AI form setup panel. Each change recalculates the credit estimate.
- **AI game flow — Max questions slider**: range input 1–10 (default 5) with scale labels added below question types. Drives the live credit estimate via `updateAIGameQCount`.
- **AI game flow — Difficulty display**: read-only Easy/Medium/Hard badge row (Medium active by default) added to the AI form. Labelled "Auto-set · adjustable per attempt in manual flow" per spec.
- **AI game flow — Credits estimate**: live credit estimate pill (`ai-credits-estimate`) shown throughout the AI setup form; updates when question types, slider, or categories toggle change.
- **AI game flow — Generation progress animation**: clicking Generate now shows a 4-step animated progress bar (Analysing content → Identifying categories → Generating questions → Applying difficulty) before revealing the results. Logic extracted into `_renderAIGameResults()`.
- **AI game flow — Max attempts & Questions per session**: generated Game tab now includes a Max attempts number-stepper and a Questions per session text input.
- **Manual Add Game — Topic, Max attempts, Questions per session**: Topic dropdown, Max attempts stepper and Questions per session input added to the manual Add Game "Game" tab. Selecting a topic pre-fills name, description and cover.
- **New helpers in `script-games.js`**: `getAIGameTopicOptions()`, `onAIGameTopicChange()`, `onManualGameTopicChange()`, `updateAIGameQCount()`, `updateAIGameCreditsEstimate()`, `stepGameAttempts()`.

### Changed
- `addGameAI()` title changed to "Add Game with AI".
- AI Generate button now always enabled in prototype (previously required content first).
- `topics-data.js` added to `index-games.html` (before `script-games.js`) so topic data is available for the link-to-topic selector.
- `script-games.js` version bumped to `?v=11` in `index-games.html`.

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

## [2026-05-19]

### Changed
- **Sub-topics list — drag to reorder**: sub-topic rows in both the manual add flow and the AI generate flow now have a grip-vertical drag handle on the left. Rows are draggable via the HTML5 Drag and Drop API; a blue line appears above or below the target row to show the insertion point, and the dragged row fades to indicate it is in flight. `subListItemHtml` helper extracted so the drag attributes and handle are defined once and used by both `appendSubItem` and `buildAISubsPaneHtml`. Drag functions `subDragStart`, `subDragOver`, `subDragLeave`, `subDrop`, `subDragEnd` and state variable `_subDragSrc` added to `script-topics.js`. CSS for `.sub-drag-handle`, `.sub-list-item.dragging`, `.drag-over-top`, `.drag-over-bottom` added to `styles-topics.css`. `script-topics.js` bumped to `?v=48`.
- **Generate with AI — "Generate with sub-topics" renamed to "Create sub-topics"**. `script-topics.js` bumped to `?v=51`.
- **Generate with AI — prompt cleared when switching to Topics or Sub-topics tab**: the prompt textarea value is now cleared (not just the placeholder updated) when switching to the Topics or Sub-topics tab, so content typed on the Content tab never carries over. `script-topics.js` bumped to `?v=50`.
- **Generate with AI — prompt box label removed, placeholder text contextual**: "Instructions" label removed from the generate block textarea. Initial placeholder is "What learning content would you like to create today?"; switches to "What would you like to change?" when on the Topics or Sub-topics tab after first generation. `updateAIGenBtnLabel` now also updates the placeholder on every tab switch. `script-topics.js` bumped to `?v=49`.
- **Generate with AI — Instructions + Generate button in a permanent block**: the Instructions textarea and Generate Topic button are grouped in a styled block (`.ai-generate-block`) permanently visible at the bottom of the form, below the tab panes. The block is always shown regardless of active tab. Removed the inject-into-edit-actions mechanism; `setPanelMode` now runs before `editFields.innerHTML` so it no longer clobbers the button. Save remains disabled until Generate has run at least once. `script-topics.js` bumped to `?v=47`.
- **Generate with AI — tab-aware regenerate**: the Generate/Regenerate button action and label now depend on the active tab after first generation. Topics tab → "Regenerate Topic" (rebuilds only the topic pane, leaves sub-topics untouched). Sub-topics tab → "Regenerate Sub-topics" (rebuilds only the sub-topics pane). Content tab → "Regenerate" (rebuilds everything). `triggerAIGenerate` replaces direct `aiGenerateStep2` call; `doAIGenerate(action)` dispatches per action; `buildAISubsPaneHtml(subs)` extracted as a shared helper; `updateAIGenBtnLabel()` called from `switchAITab` and after each generation.
- **Generate with AI — "Create with game" toggle persists across Regenerate**: the toggle state is read before the topic pane is rebuilt and restored immediately after, so regenerating a topic never unchecks it. `script-topics.js` bumped to `?v=44`.
- **Generate with AI — sub-topic editor shows AI-generated markdown**: clicking Edit on an AI-generated sub-topic now shows a markdown textarea pre-filled with the converted content instead of the media content picker. `htmlToMarkdown()` added to convert the HTML from `_AI_SUGGESTIONS` to markdown (handles headings, bold, italic, ordered/unordered lists, paragraphs, HTML entities). The markdown is stored as `data-content` on each `sub-list-item`. `openSubEditor` detects `data-content` and renders the textarea; `commitSubEditor` skips content-picker validation and writes edits back to `data-content`. `appendSubItem` carries the optional `content` field through. `script-topics.js` bumped to `?v=43`.
- **Generate with AI — Sub-topics tab uses standard list layout**: removed the "N sub-topics suggested" preview block from the Topics tab. The Sub-topics tab now renders generated sub-topics as `sub-list-item` rows (same layout as the manual add-topic flow) with edit and delete buttons per row, an inline editor via `openSubEditor`, and an "Add another sub-topic" button at the bottom. The existing `editSubItem`, `removeSubItem`, and `openSubEditor` functions work unchanged since the same DOM IDs (`#subsList`, `#subEditor`, `#addSubTopicBtnRow`) are reused. `script-topics.js` bumped to `?v=42`.
- **Generate with AI — three-tab layout (Content / Topics / Sub-topics)**: the AI generate panel now opens on a Content tab containing the model selector, Upload/URL/Text inputs, and the sub-topics toggle. Clicking Generate populates and switches to the Topics tab (cover, name, description, game toggle); if sub-topics were requested a Sub-topics tab also appears and becomes enabled. Clicking Regenerate repopulates both tabs and switches back to Topics. The Content tab is always accessible via the tab bar so inputs can be changed before Regenerating. Removed the `collapseAIStep1`/`expandAIStep1` collapse-bar mechanism (superseded by tab navigation). `switchAITab` updated to handle `ai-content`, `ai-topic`, and `ai-subs` panes. `script-topics.js` bumped to `?v=41`.
- **Generate with AI — at least one content input required**: Generate button starts disabled and enables only when Upload, URL, or Text has content. `updateAIGenerateBtn` now checks all three inputs; `onAIFileChange`/`onAIFileDrop` call it after a file is chosen. "Optional" hints removed from all three labels. `script-topics.js` bumped to `?v=40`.
- **Generate with AI — renamed labels**: button text changed from "Add with AI" to "Generate with AI" (`index-topics.html`); panel heading from "Add Topic" to "Generate Topic" (`addTopicAI` in `script-topics.js`); editing badge from "Adding with AI" to "Generating with AI" (`aiGenerateStep2`). `script-topics.js` bumped to `?v=37`.
- **Add topic — Sub-topics tab now has an icon**: `<i class="fas fa-list-ol"></i>` added to the Sub-topics tab in both the manual add flow (`addTopic`) and the AI add flow (`aiGenerateStep2`), matching the icon used in the "Add sub-topics" choice button. `script-topics.js` bumped to `?v=36`.
- **Detail panel width increased to 480 px**: `--detail-width` in `styles.css` changed from `400px` to `480px`. Applies to all pages that use the three-pane layout (topics, games, users, companies).

### Added
- **Topics → Games handoff — "Create with game" toggle**: a toggle switch labelled "Create with game" (sentence case, no icon) appears at the bottom of the Topic tab in both the manual and AI add flows (all three `aiGenerateStep2` variants). When checked and the user clicks Save, the flag and the topic's cover, name, and description are captured at the Share step (`_pendingCreateGame`, `_pendingTopicCover`, `_pendingTopicDesc`). Clicking Share or Skip writes `{ topicName, topicCover, topicDesc, companyKey, dept }` to `localStorage['gameon.pendingGame']` and navigates to `index-games.html`. On arrival, `_checkPendingGame()` in `script-games.js` reads the flag, clears it, verifies the scope still matches, calls `addGame()`, and pre-fills the Game Name, Description, and cover picker (including tile visual selection) from the stored topic data. `script-topics.js` bumped to `?v=24`, `script-games.js` to `?v=4`.

### Fixed
- **Games — tree thumbnails now match topics**: removed `filter: none` from `.row-thumb-game` so the base `.row-thumb { filter: saturate(0.3) brightness(1.15) }` applies, giving game covers the same muted look as topic covers. Added the parent game's cover as a thumbnail on category rows — `catRowHtml()` now accepts an optional `gameCover` parameter and renders `gameCoverHtml(gameCover)` when supplied. All four call sites updated: `renderGamesForScope` passes `game.cover`, save/AI-save flows read `gameRow.dataset.cover`, and single-category add reads `row.dataset.cover`. `script-games.js` bumped to `?v=8`.
- **Games — cover presets now match topics in hue and format**: `GAME_COVER_PRESETS` replaced from raw CSS gradient strings to SVG data URLs via a new `gradientCoverSvg()` helper (identical implementation to `script-topics.js`), using the same three color pairs — blue→purple (`#3b82f6`→`#8b5cf6`), orange→pink (`#f97316`→`#ec4899`), purple→violet (`#a855f7`→`#7c3aed`). Because the `data-cover` values are now identical across both pages, `_checkPendingGame()` can match the incoming topic cover string directly and highlight the correct tile. `script-games.js` bumped to `?v=5`.
- **"Create with game" toggle — switch first, sentence-case label**: reverted HTML order to switch-first. Fixed uppercase text caused by `.form-group label { text-transform: uppercase }` overriding the toggle via higher specificity; corrected with `.create-game-toggle-row label` rule in `styles-topics.css` which also restores `display: inline-flex` and `gap: 10px` (both were being overridden by the `display: block` from `.form-group label`). `script-topics.js` bumped to `?v=27`.
- **Games — cover images blank after SVG data URL switch**: `gameCoverHtml()` and `gameCoverPickerHtml()` were using `style="background: <data-url>"` (invalid CSS syntax for data URLs). Switched both to `<img src="...">` matching the topics approach. `script-games.js` bumped to `?v=6`.

### Fixed
- **Share tab — panel closes after clicking Share so badge is visible**: `applyAddShare()` now always calls `showEmpty()` after a successful share (when not launching a game), so the detail panel closes and the share badge in the topic tree is immediately visible. Previously the panel stayed open and the badge was hidden behind it.
- **Share tab — current department pre-selected**: `buildAddShareTabHtml()` now checks `_currentScope.dept` and marks the matching department checkbox `checked` by default, so the user can share to the current dept without manually ticking it.
- **Add topic — Share panel is now the standalone panel, not an inline tab**: clicking Save in both the manual and AI add flows now closes the edit panel and opens the dedicated `#detailShare` panel (same one used by the kebab-menu Share action on existing topics). The current department is pre-checked by default; the confirm button always reads "Share" and is always enabled for new topics. `confirmShare` and `cancelShare` both honour the "Create with game" flag, so the game handoff still works. Removed: the Share tab and pane from `addTopic()` / `aiGenerateStep2()`, `buildAddShareTabHtml`, `showAddShareStep`, `skipAddShareStep`, `applyAddShare`, `_syncAddShareButtons`, `_inShareStep`, `_pendingShareTopicName`. `script-topics.js` bumped to `?v=35`.
- **Share tab — badge count matches selected departments**: the current department is now a real share target, not just a visual marker. Three fixes together: (1) `shareTopicWithDepartments` now stamps `sharedDate` on an already-existing topic entry (the newly-created topic is already in `TOPICS_BY_SCOPE` from `snapshotCurrentScope`, so the old guard silently skipped it); (2) `getSharedDepartments` no longer excludes `currentDept`, so sharing to N departments — including the home dept — correctly returns N results for the badge; (3) `applyAddShare` no longer filters out the current dept from `deptNames`. `script-topics.js` bumped to `?v=34`.
- **Share tab — checked departments persist when switching tabs**: replaced the `editSubmitBtn`-presence heuristic in `_syncAddShareButtons` with an explicit `_inShareStep` flag. Previously, switching from Share → Topic tab restored the Save button, and switching back to Share left Cancel/Save visible instead of Skip/Share — clicking Save would rebuild the entire form and reset all checkbox selections. Now `_inShareStep` is set `true` in `showAddShareStep` and cleared in `applyAddShare`, `skipAddShareStep`, and `setPanelMode`, so the Skip/Share buttons are always shown on any tab while in the share step, and the share pane HTML is never inadvertently rebuilt. `script-topics.js` bumped to `?v=32`.

### Added
- **AI credits persist across all pages**: credits are now written to `localStorage['gameon.aiCredits']` (object keyed by company name) whenever a Generate is triggered in `script-topics.js` or `script-games.js`, and read back on page load so the count is never lost on navigation. `script-sidebar-scope.js` now reads from this key in a new `updateCreditsDisplay()` function called from `renderCard()` on every scope change — so the `#scopeCredits` line appears on every page as soon as a company with prior AI usage is selected. Added `credits` quota field to `FALLBACK_COMPANIES` in `script-sidebar-scope.js` (matching `SIDEBAR_COMPANIES` values). Added `#scopeCredits` div to all six pages that were missing it: `index.html`, `all-users.html`, `companies.html`, `index-users-dept-grid.html`, `reports.html`, `settings.html`. `script-topics.js` bumped to `?v=28`, `script-games.js` to `?v=7`.
- **Nav — "Calendar" renamed to "Game Calendar"**: updated label and `data-tooltip` on all eight pages.
- **Games — cover images blank after SVG data URL switch**: `gameCoverHtml()` and `gameCoverPickerHtml()` were using `style="background: <data-url>"` which is invalid CSS syntax (needs `url(...)`). Switched both to render `<img src="...">` elements matching the topics approach. `script-games.js` bumped to `?v=6`.

### Changed
- **Scope card — AI credits on its own row**: moved `#scopeCredits` from inside `.scope-card-text` to a direct child of `.scope-card` in `index-topics.html` and `index-games.html`. Added `flex-wrap: wrap` and `flex-basis: 100%` to `.scope-card` / `.scope-card-credits` in `styles.css` so the credits line wraps below the logo + name + arrows row.

### Added
- **Topics — "Add game" kebab menu item**: added below "Add sub-topic" in the topic row action menu (both the `topicRowHtml` template and the newly-added row in `saveAdd`). Clicking it navigates to `index-games.html`. `script-topics.js` bumped to `?v=22`.



### Fixed
- **AI credits always visible below company name**: `updateGameScopeCreditsDisplay()` added to `script-games.js` (mirrors `updateScopeCreditsDisplay` in topics). Called from `onGamesScope()` so the credit line appears as soon as a company is selected (showing "0 / N AI credits used"), and again after each AI generation to keep the count live. `script-games.js` bumped to `?v=2`.

## [2026-05-18] — Games styling consistency

### Fixed
- **Games page — tree row spacing too tight**: added `padding-top/bottom` to `.row-game td` (12 px), `.row-cat td` (9 px), and `.row-q td` (7 px) in `styles-games.css`, matching the `.row-company td` rhythm used on the topics page.
- **Games page — category count badge purple**: removed the custom purple `background`/`color` overrides from `.chip-cats`; only the icon colour remains, changed to `#3b82f6` (blue) to match the `.chip-modules` icon on the topics page.
- **Games page — Active badge shows coloured background**: added `.row-game .chip, .row-cat .chip, .row-q .chip { background: var(--white) }` to `styles-games.css`, mirroring the `.row-company .chip` rule in `styles.css` that strips the green fill on active chips in topics rows.
- **Detail panel — no padding and content not scrollable**: added `padding: 16px 20px` and `box-sizing: border-box` to `.detail-content` in `styles.css` (applies to all pages). Changed `.detail-panel.open` from `overflow-y: hidden` to `overflow-y: auto` so the panel scrolls when content is taller than the viewport.
- **Games page — cover picker shows 5 tiles instead of 3**: `GAME_COVER_PRESETS` in `script-games.js` reduced from 5 entries to 3 (blue→purple, pink→red, blue→cyan), matching the 3-tile pattern used in the topics cover picker.
- **Games page — cover thumbnail in row**: `gameCoverHtml()` now returns `<div class="row-thumb row-thumb-game" style="background:…">` instead of a fully-inline-styled div. Picks up `.row-thumb` sizing/border-radius from `styles-topics.css`; `.row-thumb-game` in `styles-games.css` overrides `filter:none` so gradient covers display at full saturation.
- **Games page — extra left margin on game name**: removed `style="margin-left:8px"` inline style from the `company-name` span in `gameRowHtml()`; spacing is handled by `.cell-row`'s `gap: 8px`.
- **Games page — category row chevron visibility**: `catRowHtml()` had two `style` attributes on the chevron span (only the last was honoured by browsers), so `visibility:hidden` was silently ignored. Merged into a single `style="visibility:hidden"` attribute; the CSS `padding-left: 56px` on `.row-cat .cell-row` already handles indentation.

## [2026-05-18] — Games page

### Added
- **Games page (`index-games.html`)**: new page with a 3-level tree (Game → Category → Question), manual add flow (4 tabs: Game, Categories, Share, Schedule), and AI add flow with generated categories and questions shown in a reviewable accordion. Share step matches the topics pattern. Schedule step adds a date/time picker with "publish immediately" or "schedule for a date" options. `games-data.js`, `script-games.js`, `script-games-sidebar-scope.js`, and `styles-games.css` added.
- **`games-data.js`**: seed data for `_default` (2 games), `sales` (1 game), `human resources` (1 game), and `marketing` (1 game). Each game has 2 categories with 2–3 questions. Realistic corporate learning content (leadership, compliance, sales, digital marketing, HR). `GAMES_BY_SCOPE` runtime override object also exported.
- **`script-games-sidebar-scope.js`**: scope adapter following the exact `script-topics-sidebar-scope.js` pattern. Variables prefixed `GAMES_` to avoid conflicts. Calls `onGamesScope(companyKey, deptName)` on scope change; disables `#addGameBtn` and `#addGameAIBtn` until both company and department are selected.
- **`styles-games.css`**: game-specific CSS only — `.detail-schedule-badge` (green/teal), `.row-cat` / `.row-q` tree indentation, `.chip-cats` / `.chip-questions` / `.chip-scheduled` chips, staged category and question editor styles (`.game-cat-item`, `.q-editor`, `.q-opts-grid`), schedule form styles, AI accordion styles (`.ai-game-cat-item`, `.ai-game-q-item`).
- **Games nav link**: `index-topics.html`, `index-users-dept-grid.html`, and `companies.html` updated from `href="#"` to `href="index-games.html"` for the Games nav item.

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
