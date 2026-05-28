# Changelog

All notable changes to this project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

Project contact: elsadr@agilebridge.co.za

## [2026-05-28] — Games v2: new page + sidebar nav link on all pages

### Added
- **`index-games-v2.html`** — New page (copy of `index-games.html`) with "Games v2" as the active nav item; uses `script-games.js?v=95`.
- **All sidebar pages** (`index-games.html`, `index-questions.html`, `index-topics.html`, `index-topics-v2.html`, `companies.html`, `index-users-dept-grid.html`) — Added "Games v2" nav link after the Games link in the sidebar.

## [2026-05-28] — Topics v2: remove Generate-with-AI option; grip-handle reorder; label fixes

### Removed
- **`script-topics-add-intent.js`** — "How would you like to create it?" method group removed from the intent screen. The "Generate with AI" card (and the "Manually" card beside it) no longer appear; the intent screen now asks only "What are you building?" Method defaults to `'manual'` in `v2Proceed()` since no method card is present.
- **`script-topics-add-intent.js`** — `v2MoveSubItem()` removed; replaced by `v2ReindexSubItems()`.
- **`styles-topics.css`** — `.ai-sub-move` / `.ai-sub-move:hover` removed.

### Added
- **`script-topics-add-intent.js`** (v12) — `var _v2DragSrc = null` global for HTML5 drag state.
- **`script-topics-add-intent.js`** — `v2ReindexSubItems(list)` — re-indexes `data-idx` and `data-field` on all sub-topic accordion items after a drag-drop, and rebuilds `_v2KeepFields` sub-* keys from the `.kept` class.
- **`styles-topics.css`** — `.ai-sub-grip` (drag handle button, right of Keep, `cursor:grab`), `.ai-sub-dragging` (opacity:0.4 while dragging), `.ai-sub-drag-over` (accent border when hovered as drop target).

### Changed
- **`script-topics-add-intent.js`** — `v2AddSubAccordionItem`: ↑/↓ arrow buttons replaced with a `fa-grip-vertical` drag handle (`.ai-sub-grip`) positioned after the Keep button. HTML5 drag events wired per item — drag only activates when mousedown on the grip, so clicks inside the contenteditable name and RTE body work normally.
- **`script-topics-add-intent.js`** — Stepper label "Sub-Topic" renamed to "Sub-topics" in all flows.
- **`script-topics-add-intent.js`** — `v2BackToIntent()`: removed AI method-card restoration (no method cards in the DOM anymore).
- **`index-topics-v2.html`** — script bumped to `?v=12`.

## [2026-05-28] — Topics v2: restore Manually / Generate with AI choice on intent screen

### Added
- **`script-topics-add-intent.js`** (v12) — Restored the **"How would you like to create it?"** question group to `v2IntentHtml()` with Manually (default selected) and Generate with AI cards. This was accidentally removed in an earlier session when the standalone header button was added.
- **`script-topics-add-intent.js`** — `v2BackToIntent()` now also restores the previous method card selection (in addition to structure) when the user navigates back to the intent screen.

## [2026-05-28] — Topics v2: remove standalone Generate with AI header button

### Removed
- **`index-topics-v2.html`** — Removed the separate "Generate with AI" (`btn-ai`) button from the page header. The Add Topic button already opens the intent screen where the user chooses between Manually and Generate with AI.

### Changed
- **`index-topics-v2.html`** — Add Topic button icon changed from `fa-layer-group` to `fa-plus` for consistency.

## [2026-05-28] — Topics v2: action bar pin on Sub-Topic step + unified stepper labels

### Changed
- **`script-topics-add-intent.js`** (v11) — `v2SwitchTo`: `v2-review-active` class is now toggled for both `ai-review` **and** `ai-subtopics` steps, so the flex-scroll chain keeps the action bar visible on the Sub-Topic step.
- **`styles-topics.css`** — Added `.v2-review-active #v2AiSubtopicsContent { flex:1; min-height:0; overflow-y:auto }` so the accordion list scrolls internally while the stepper and Cancel/Back/Next bar stay pinned at the bottom of the panel.
- **`script-topics-add-intent.js`** — All stepper labels updated to a consistent naming pattern:
  - Manual single: **Topic → Share**
  - Manual sub-topics: **Topic → Sub-Topic → Share**
  - AI single: **Create → Topic → Share**
  - AI sub-topics: **Create → Topic → Sub-Topic → Share**
- **`index-topics-v2.html`** — script bumped to `?v=11`.

## [2026-05-28] — Topics v2: sub-topics accordion — one-at-a-time, RTE toolbar, reorder

### Added
- **`script-topics-add-intent.js`** (v10) — `v2MoveSubItem(btn, direction)` — up/down arrow buttons in each sub-topic header reorder the accordion items. After a move all `data-idx` and `data-field` attributes are re-indexed in DOM order, and `_v2KeepFields` sub-* keys are rebuilt from each item's `.kept` class so locks survive reordering.

### Changed
- **`script-topics-add-intent.js`** — `v2AddSubAccordionItem`: header now includes ↑ / ↓ move buttons (`btn-icon ai-sub-move`) between the name and the Keep button; body now contains a full RTE toolbar (`.ai-sub-rte-toolbar`) above the `contenteditable` wysiwyg area.
- **`script-topics-add-intent.js`** — `v2ToggleSubItem`: adopts one-at-a-time accordion behaviour — when opening an item it first collapses every sibling (body `hidden`, chevron reset); clicking the already-open item's toggle still closes it.
- **`styles-topics.css`** — `.ai-sub-body` now `display:flex; flex-direction:column` so toolbar and editor stack correctly with no extra padding wrapper. New `.ai-sub-rte-toolbar` scopes the toolbar border-radius to zero inside the body. New `.ai-sub-move` styles the tiny up/down icon buttons. `.ai-sub-body .ai-wysiwyg` overrides the generic wysiwyg to `min-height:220px; max-height:420px` with inner padding, giving the editor comfortable room.
- **`index-topics-v2.html`** — script bumped to `?v=10`.

## [2026-05-28] — Topics v2: AI + sub-topics 4-step flow with expandable accordion

### Added
- **`script-topics-add-intent.js`** (v9) — AI + sub-topics flow now has **4 steps**: Content → Review → Sub-topics → Share (was 3 steps with sub-topics embedded in the Review pane).
- **`script-topics-add-intent.js`** — New `'ai-subtopics'` step type: `v2PaneHtml` returns `<div id="v2AiSubtopicsContent">` which `v2SwitchTo` lazily fills via `v2FillAISubtopics()`.
- **`script-topics-add-intent.js`** — `v2FillAISubtopics()` — builds an expandable accordion (`.ai-sub-list` / `.ai-sub-item`) from `_v2AISuggestion.subtopics`. Each item has a chevron-toggle, an editable name span, and a **Keep** button wired to `v2ToggleKeep()` with key `'sub-N'`.
- **`script-topics-add-intent.js`** — `v2AddSubAccordionItem(container, sub, idx)` — creates and appends one accordion entry (reuses existing `.ai-sub-*` + `.ai-wysiwyg` CSS classes).
- **`script-topics-add-intent.js`** — `v2ToggleSubItem(btn)` — expands/collapses the `.ai-sub-body` and rotates the chevron icon.
- **`script-topics-add-intent.js`** — `v2AIRegenerateSubs()` — regenerates sub-topic names and content in-place, skipping any entry whose `'sub-N'` keep-lock is set. Wired to the **Regenerate** (`btn-ai`) button on the Sub-topics step. Updates AI credit counter.
- **`script-topics-add-intent.js`** — `readAISubtopics()` — reads name + HTML content from the accordion for `v2Commit()`.

### Changed
- **`script-topics-add-intent.js`** — `v2Proceed()`: detects `method === 'ai' && structure === 'subtopics'` first and assigns the 4-step config.
- **`script-topics-add-intent.js`** — `v2SetActions()`: added `'ai-subtopics'` case — Regenerate (`btn-ai`) + Next buttons.
- **`script-topics-add-intent.js`** — `v2FillAIReview()`: removed the embedded sub-topics list. For AI+subtopics the Review step now shows only Name + Description (sub-topic content reviewed on the next step).
- **`script-topics-add-intent.js`** — `v2AIRegenerate()`: removed the `cfg.structure === 'subtopics'` branch; only updates `#v2AiContent` (single-topic RTE). Sub-topic regeneration is handled by `v2AIRegenerateSubs()`.
- **`script-topics-add-intent.js`** — `v2Commit()`: routes AI+subtopics to `readAISubtopics()` instead of `readListedSubs()` (both for sub-row creation and for the toast sub-count).
- **`index-topics-v2.html`** — script bumped to `?v=9`.

## [2026-05-28] — Topics v2: setup screen clean-up, last-step game action, step labels

### Changed
- **`script-topics-add-intent.js`** — Intent/setup screen: removed the "Also create a game?" question group entirely. Game creation is now offered at the end of every flow via dedicated action buttons on the last stepper step (Sharing).
- **`script-topics-add-intent.js`** — Intent/setup screen: removed the AI model selector from the setup screen. It now lives inside the `ai-generate-block` on the Content (Prompt) step so model choice is made in context, right next to the Generate button.
- **`script-topics-add-intent.js`** — First stepper label is now **Content** across all three flows (was "Prompt" for AI, "Topic" for manual sub-topics; single was already "Content").
- **`script-topics-add-intent.js`** — Last step action bar changed to **Cancel | Back | Create Game | Done** in all flows. `v2Commit(createGame)` accepts a boolean; "Create Game" passes `true`, "Done" passes `false`.

## [2026-05-27] — Topics v2: promote to first-class nav item; polish AI Review buttons

### Changed
- **`index-topics-v2.html`** — removed the "Prototype review" sticky banner; the page is now a proper app page. Nav updated: Topics links to `index-topics.html` (not active), and a new **Topics v2** item links to `index-topics-v2.html` (active).
- **All other pages** (`index-topics.html`, `index-games.html`, `index-users-dept-grid.html`, `all-users.html`, `companies.html`, `reports.html`, `settings.html`, `index.html`, `index-questions.html`) — **Topics v2** nav item added immediately below Topics in every sidebar so the flow is reachable from anywhere.
- **`script-topics-add-intent.js`** — Regenerate button on the AI Review step now uses `btn-ai` (gradient pill, same as Generate Topic / Generate with AI) instead of `btn-outline`.

## [2026-05-27] — Add Topic v2: AI Review — no-scroll panel, RTE full-screen modal

### Changed
- **`script-topics-add-intent.js`** (v8) — AI Review step (step 2 of the AI flow):
  - Removed the "AI-generated — review and edit before saving" info banner from the Review pane.
  - Added `v2-review-active` CSS class toggle on `#detailEdit` when entering/leaving the `ai-review` step (also cleared in `addTopic()` and `v2BackToIntent()`). This activates a flex-column chain through `#editFields` → visible `.add-step-pane` → `#v2AiReviewContent` so the panel header/stepper/action bar are always visible and never scroll off-screen.
  - Single-topic content form-group gains class `v2-rte-form-group` which fills the remaining height inside the chain. The `#v2AiContent` RTE is the only scrollable element (`flex: 1; overflow-y: auto`).
  - Added a full-screen expand button (`fa-expand-alt`) in the RTE label row. Opens a DevExtreme `dxPopup` (72 vw × 80 vh, draggable, resizable) with a full toolbar + larger editing surface. Content syncs back to `#v2AiContent` automatically when the popup closes.
- **`styles-topics.css`** — removed `.ai-review-banner` block; added `.v2-review-active` flex-chain rules (for `#editFields`, `#v2Stepper`, `.add-step-pane:not(.hidden)`, `#v2AiReviewContent`), `.v2-rte-form-group` layout, `.v2-rte-expand-btn` icon button, and `.v2-rte-modal-body` styles for the full-screen editing surface.
- **`index-topics-v2.html`** — `script-topics-add-intent.js` version bumped to `?v=8`.

## [2026-05-27] — Add Topic v2: intent-first flow (prototype review page)

### Added
- **`index-topics-v2.html`** — duplicate of the topics page with a dark "prototype review" banner and a "Back to current" link. Loads all the same scripts as `index-topics.html` plus `script-topics-add-intent.js` last so it shadows `addTopic()`.
- **`script-topics-add-intent.js`** (v2) — intent-first `addTopic()` override. Opens an intent screen asking two questions upfront — *What are you building?* (Single topic / With sub-topics) and *How?* (Manually / Generate with AI) — before showing a focused stepper. Steps differ by structure choice:
  - Single (3 steps): Content (name + description + cover + content picker combined) → Sharing → Game
  - Sub-topics (4 steps): Details → Sub-topics → Sharing → Game
  - AI (either): delegates to existing `addTopicAI()` unchanged.
  - Also overrides `expandTopicForm()` so that cancelling an empty sub editor in the sub-topics step re-shows the "Add sub-topic" button rather than silently doing nothing.
- **`styles-topics.css`** — `.v2-banner`, `.v2-banner-back`, `.intent-screen`, `.intent-group-label`, `.intent-cards`, `.intent-card`, `.intent-icon`, `.intent-body`, `.intent-title`, `.intent-desc`, `.intent-check` styles for the review page banner and intent picker.

### Changed
- **`script-topics-add-intent.js`** (v7) — AI Review step redesigned: name, description, and content (single) / sub-topics (sub-topics) each have a green **Keep** button that locks that field against regeneration. "Generate Topic" moves to the action bar (replacing Next on the Prompt step). Prompt step gains a cover image picker (user-chosen, not AI-generated). Review step action bar: Cancel | Back | Regenerate | Next — Regenerate calls `v2AIRegenerate()` which updates only un-locked fields in-place. Cancel on any stepper step now shows a DevExtreme confirmation dialog warning the user their work will be lost.
- **`script-topics-add-intent.js`** (v6) — AI flow restored to full fidelity with the original `addTopicAI` content: AI model dropdown appears on the intent screen when "Generate with AI" is selected (not on the stepper); Prompt step carries the exact Upload zone / URL / Text RTE / prompt-text + "Generate Topic" button from the original flow. "Generate Topic" uses the same `nextAISuggestion` + `_AI_SUGGESTIONS` pools, updates the credit counter, and auto-advances to the Review step. Review step shows the AI-pool–generated name, description, cover, and rich sub-topic content (with `htmlToMarkdown` conversion), all editable. Back-to-intent from step 1 restores method and model-group visibility. Full flows:
  - Manual single: Content → Sharing (2 steps)
  - Manual sub-topics: Topic → Sub-topics → Sharing (3 steps)
  - AI single: Prompt → Review → Share (3 steps)
  - AI sub-topics: Prompt → Review (with pre-populated sub-topics) → Share (3 steps)
- **`script-topics-add-intent.js`** (v4) — Game intent moved to the intent screen as a third question: "Also create a game for this topic?" (Not now / Yes, create a game). This means all decisions are declared upfront before the stepper begins. The final button on the last step automatically reads the intent: **Continue to game →** if Yes was chosen, **Done** if not. No split-button decision at the end. Flows are now:
  - Single: Content → Sharing (2 steps)
  - Sub-topics: Details → Sub-topics → Sharing (3 steps)
- **`script-topics-add-intent.js`** — Single topic flow merged its "Details" and "Content" steps into one combined "Content" step. The `stepTypes` architecture (`'content-single'` / `'details'` / `'subtopics'` / `'sharing'`) ensures `v2PaneHtml`, `v2SwitchTo`, `v2Validate`, and `v2Commit` all find the content picker in the correct pane dynamically.

## [2026-05-27] — Add Topic: 3-step stepper replaces tab layout

### Changed
- **`script-topics.js`** (v53) — `addTopic()` rebuilt around a 3-step stepper (Content → Sharing → Game) replacing the old Topic/Sub-topics tab layout.
  - Step 1 (Content): topic name/description/cover + the existing "Add content" / "Add sub-topics" choice cards. Choosing sub-topics now collapses the topic form into a `.topic-mini` card with an edit pencil, keeping the panel tidy while the sub-topic list builds up.
  - Step 2 (Sharing): inline department checkboxes — current department pre-checked, others opt-in. Sharing is applied directly when "Done" is clicked so the old post-save share panel is no longer needed in the normal add flow.
  - Step 3 (Game): three option cards — "No game" (default, selected), "Create a game" (normal flow), "Generate with AI". Selecting a game option and clicking Done launches the game-creation flow; "No game" closes the panel.
- **`script-topics.js`** — New stepper helper functions added: `getCurrentStepperStep`, `setupStepperActions`, `goStepNext`, `goStepBack`, `switchToStep`, `validateStep1`, `showTopicMiniCard`, `expandTopicForm`, `buildStep2`, `buildStep3`, `selectGameOption`, `commitAllSteps`.
- **`script-topics.js`** — `saveAdd()` now has a stepper intercept at the top: if the stepper is present (Enter key pressed in a text field), it calls `goStepNext()` and returns instead of jumping to commit.
- **`script-topics.js`** — `removeTopicContent()`: also un-hides `#choicePromptLabel` when restoring the picker.
- **`script-topics.js`** — `cancelSubEditor()` and `removeSubItem()`: no-subs revert path now calls `expandTopicForm()` instead of `switchAddTab('topic')`, and un-hides `#choicePromptLabel`.

### Fixed
- **`script-topics.js`** — `expandTopicForm()`: no longer clears the sub-topics list when the user clicks the edit-pencil on the topic mini-card. The sub-topics remain intact; only the mini-card is hidden and the full form is restored. The "no subs" cleanup that was here is handled by the callers (`cancelSubEditor`, `removeSubItem`) which run it only when the count actually drops to zero.
- **`styles-topics.css`** — Added `.add-stepper`, `.add-step`, `.add-step-num`, `.add-step-label`, `.add-step-connector`, `.add-step-pane`, `.step-pane-lead`, `.game-option-cards`, `.game-option-card`, `.goc-icon`, `.goc-body`, `.goc-title`, `.goc-desc` styles for the stepper and game-option cards.
- **`index-topics.html`** — `script-topics.js` version bumped to `?v=53`.

### Removed
- **`addTopic()`** — "Also create a game" toggle and Normal/AI segmented control removed from the normal add flow (they remain in the AI flow via `createGameToggleHtml()`). Game creation is now handled by the Step 3 option cards.
- **`addTopic()`** — "Topic" tab removed; the two-tab layout is gone from the normal add flow (AI flow tabs unchanged).

## [2026-05-27] — Generate Game AI: Move Topic dropdown below AI Model selector

### Changed
- **`script-games.js`** — "Topic (optional)" dropdown moved from the bottom of the Content tab to immediately after the AI Model selector. Version bumped to `?v=85`.

## [2026-05-27] — Add Game: Remove "Add content" card

### Removed
- **`script-games.js`** — "Add content" card button and the hidden content picker form removed from the manual Add Game panel. Version bumped to `?v=84`.

## [2026-05-27] — Generate Game AI: Replace "Link to topic" toggle with plain dropdown

### Changed
- **`script-games.js`** — Replaced the "Link to a topic" toggle + hidden dropdown row with a plain `Topic (optional)` label + `Select a topic` dropdown, matching the manual Add Game panel style exactly.
- **`script-games.js`** — `toggleAIGameTopicLink` function removed (no longer needed). Version bumped to `?v=83`.

## [2026-05-27] — Generate Game AI: Add "Link to topic" toggle to Content tab

### Added
- **`script-games.js`** — "Link to a topic" toggle added to the bottom of the Content tab (after the categories toggle). Off by default (standalone game). When switched on, shows a topic dropdown populated from the current scope's topics.
- **`script-games.js`** — `toggleAIGameTopicLink(checkbox)` — shows/hides the topic dropdown row; clears `_aiGamePendingTopic` when toggled off.
- **`script-games.js`** — `onAIGameTopicChange` updated to find the categories toggle label by content scan (robust to DOM restructure). Selecting a topic with sub-topics updates the categories toggle label to "Use topic categories & generate questions"; deselecting resets it.
- **`script-games.js`** — Blue info note (`#aiGameContentSkipNote`) shown below the dropdown when a topic with sub-topics is selected: "Topic sub-topics will be used as game categories". Version bumped to `?v=82`.
- **`styles-games.css`** — `.ai-topic-linked-note` styles added (blue info pill).

## [2026-05-27] — Generate Game AI: Remove difficulty ratio display

### Removed
- **`script-games.js`** — Difficulty ratio info row removed from the generate block. Version bumped to `?v=81`.
- **`styles-games.css`** — `.ai-diff-info` styles removed.

## [2026-05-27] — Generate Game AI: Add read-only difficulty ratio to generate block

### Added
- **`script-games.js`** — Difficulty info row added to the generate block (visible before generation): 🔒 "Difficulty per category: Easy · Medium · Hard — set by backend". Non-editable, communicates the backend-controlled ratio per the user story. Version bumped to `?v=80`.
- **`styles-games.css`** — `.ai-diff-info`, `.ai-diff-info-lock`, `.ai-diff-info-note` styles added.

## [2026-05-27] — Generate Game AI: Remove credits used display from Game tab

### Removed
- **`script-games.js`** — "X / Y AI credits used" row removed from the Game tab. Version bumped to `?v=79`.
- **`styles-games.css`** — `.ai-credits-estimate` styles removed.

## [2026-05-27] — Generate Game AI: Use actual input content to shape generated output

### Changed
- **`script-games.js`** — `_deriveAIGameContext()` added — reads the URL input (extracts brand from domain), prompt text, uploaded file name, and text body to produce a `{ topic, brand }` context object.
- **`script-games.js`** — `_contextCats(brand, suggestion)` added — maps the brand name onto category names ("Weelee Overview", "Weelee Products & Services", etc.) instead of using generic mock category names.
- **`script-games.js`** — `_renderAIGameResults` now uses the derived context: game name becomes "[Topic] Knowledge Challenge", description becomes "Test your knowledge of [topic].", and category names are branded if a URL was provided. Linked-topic data still takes priority. Version bumped to `?v=78`.

## [2026-05-27] — Generate Game AI: Move estimated credit spend to Game tab (last step)

### Changed
- **`script-games.js`** — Estimated credits moved from the Content tab to the bottom of the Game tab (shown after generation as "X / Y AI credits used"). Version bumped to `?v=77`.
- **`styles-games.css`** — `.ai-credits-estimate` styles restored for the Game tab position.

## [2026-05-27] — Generate Game AI: Revert question type picker and Q-count additions

### Removed
- **`script-games.js`** — Question type radio grid, questions per category stepper, and estimated credits row removed from the Content tab (reverted to upload / URL / text / categories toggle only). Version bumped to `?v=76`.
- **`styles-games.css`** — `.ai-credits-estimate` styles removed.

## [2026-05-27] — Generate Game AI: Remove difficulty mix display from Game tab

### Removed
- **`script-games.js`** — "Difficulty mix" (1 Easy / 1 Medium / 1 Hard chips) removed from the generated Game tab. Version bumped to `?v=75`.

## [2026-05-27] — Generate Game AI: Question type picker, Q-count stepper, estimated credits

### Added
- **`script-games.js`** — `_AI_Q_TYPES` constant — the 7 question types defined in the user story (MCQ, Fill in the Blank, Statement Blanking, Select on Image, Match the Terms, Word Bucket, Crossword).
- **`script-games.js`** — `_aiGameQTypeGridHtml()` — builds the 2-column radio-card grid for the Content tab; first selection defaults to MCQ.
- **`script-games.js`** — **Question type** section added to the Content tab — single-select radio cards (one type per game as per user story).
- **`script-games.js`** — **Questions per category** stepper (1–20, default 5) added to the Content tab; `stepAIGameQCount(delta)` handles button clicks.
- **`script-games.js`** — `updateAIGameCreditsEstimate()` — computes estimated AI credits (base 1 + 0.4 × Q-count, ×3 weight if categories on) and updates the `#aiGameCreditsEstVal` span; called on question count, type, and categories-toggle changes.
- **`script-games.js`** — Estimated credits row added inside the generate block, above the Generate button, with a gold coin icon. Version bumped to `?v=74`.
- **`styles-games.css`** — `.ai-credits-estimate` styles added (flex row, coin icon in amber, bold count value).

## [2026-05-27] — Generate Game AI: Tab-based flow matching Topics AI panel

### Changed
- **`script-games.js`** — Generate Game AI panel restructured to mirror the Topics AI flow:
  - Tab bar at top: **Content** (active on open) | **Game** (disabled until first generate) | **Categories** (hidden, appears with count badge after generate if categories were requested)
  - Content pane contains AI MODEL, UPLOAD, URL, TEXT, and the "Generate with categories & questions" toggle — unchanged fields, new layout
  - Game pane (cover, name, description, max attempts, difficulty mix) and Categories pane (accordion of categories with questions) are now persistent tab panes, not rebuilt inside `aiGameStep2`
  - On first Generate → spinner in button → fills Game + Categories panes → switches to Game tab
  - Subsequent generates respect the active tab: Game tab → "Regenerate Game" rebuilds game pane only; Categories tab → "Regenerate Categories" rebuilds categories only; Content tab → "Regenerate" rebuilds both
  - `updateAIGameGenBtnLabel()` added — updates button label and prompt placeholder based on active tab (mirrors Topics' `updateAIGenBtnLabel`)
  - `switchAIGameTab(tab)` replaces old `switchGameAITab` (tab bar ID was `aiGameTabsBar`, now `aiGameTabBar` to match Topics pattern)
  - Removed: `collapseAIGameStep1`, `expandAIGameStep1`, `switchGameAITab`, `updateAIGameCreditsEstimate`, step-progress animation
  - `_aiGameHasGenerated` state variable added (mirrors Topics' `_aiHasGenerated`)
- `script-games.js` version bumped to `?v=73`.

## [2026-05-27] — Generate Game: Fix "Create Game" button visible but disabled during AI generation

### Fixed
- **`script-games.js`** — "Create Game" button was showing (disabled) during the Generate Game flow because DevExtreme's CSS reset overrides the HTML `hidden` attribute. Switched all `submitBtn.hidden = true/false` to `submitBtn.classList.add/remove('hidden')`, which hits `.hidden { display: none !important; }` from `styles.css` and wins.
- **`script-games.js`** — After `generateAIGame()` completes, button now re-labels as "Create Game" (was "Save"). Version bumped to `?v=72`.

## [2026-05-27] — Add Game: Move "Add content" card above Configure accordion

### Changed
- **`script-games.js`** — "Add content" card section now renders before the Configure accordion (previously it was after). Version bumped to `?v=71`.

## [2026-05-27] — Add Game: Remove "Add categories" card (categories managed in background)

### Removed
- **`script-games.js`** — "Add categories" card button removed from the Add Game panel; the BA confirmed categories are managed in the background, not by the admin.
- **`script-games.js`** — `openGameCategoriesForm`, `cancelGameCategoriesForm`, `saveGameCategoriesForm`, `addGameCategoryItem`, `removeGameCategoryItem` functions removed (dead code).
- **`styles-games.css`** — `.game-choice-cards` 2-column grid removed.

### Changed
- **`script-games.js`** — "Add content" card is now full-width (`.btn-choice-full`); container `#gameChoiceCards` retained for the show/hide toggle.
- **`styles-games.css`** — Added `.btn-choice-full { width: 100%; }` in place of the grid.
- `script-games.js` version bumped to `?v=70` (`index-games.html`, `index-questions.html`).

## [2026-05-27] — Topics: sentence-case labels + choice prompt moved outside picker

### Changed
- **`styles-topics.css`** — added `#detailEdit .form-group label` override to remove `text-transform: uppercase` and `letter-spacing` so all Add/Edit panel labels display in sentence case.
- **`script-topics.js`** — "What would you like to add to this topic?" moved out of the `.choice-picker` block and rendered as a `<label>` in its own `form-group` above the picker.

## [2026-05-27] — Topics: updated "Add sub-topics" hint text

### Changed
- **`script-topics.js`** — "Add sub-topics" hint updated to "Create multiple learning topics".

## [2026-05-27] — Topics: side-by-side choice buttons + updated hint text

### Changed
- **`styles-topics.css`** — `.choice-buttons` grid changed from `1fr` to `1fr 1fr` so "Add content" and "Add sub-topics" sit side by side.
- **`script-topics.js`** — "Add content" hint updated to "Provide a single file, video URL or text".

## [2026-05-27] — Topics: "Also create a game" toggle with inline flow picker

### Changed
- **`script-topics.js`** — renamed "Create with game" toggle to "Also create a game" for clarity.
- **`script-topics.js`** — `createGameToggleHtml()` now wraps the toggle and a new segmented control (`Normal | AI`) in a `.create-game-row` flex container; the segmented control is hidden until the toggle is switched on (`onCreateGameToggleChange`).
- **`script-topics.js`** — `selectGameFlow(btn)` handles Normal / AI button selection within the picker.
- **`script-topics.js`** — `_pendingGameFlow` variable added; captured from `#gameFlowPicker` at Save time and written into `gameon.pendingGame` localStorage payload as `gameFlow`.
- **`script-topics.js`** — `doAIGenerate` preserves and restores both the toggle state and the selected flow when the topic pane is rebuilt during AI regeneration.
- **`styles-topics.css`** — `.create-game-row`, `.game-flow-picker`, `.game-flow-btn` styles added.
- `script-topics.js` version bumped to `?v=52`.

## [2026-05-27] — Add Game: Content and Categories as card buttons (no prompt wrapper)

### Changed
- **`script-games.js`** — Replaced accordion toggles with the original card-button style (`.btn-choice`): two cards in a 2-column grid, no dashed wrapper box, no prompt text. Each card toggles its body section open/closed and highlights blue when active.
- **`script-games.js`** — `toggleGameSection(bodyId, btn)` added: toggles the section, syncs the card's `.btn-choice-active` class, focuses the category input when opening categories.
- **`styles-games.css`** — `.game-choice-cards` (2-column grid) and `.btn-choice-active` (blue highlight) added; removed old `.game-section-row/col` rules.
- `script-games.js` version bumped to `?v=68`.

## [2026-05-27] — Add Game: Content and Categories accordions side by side

### Changed
- **`script-games.js`** — Content and Categories accordion sections are now wrapped in `.game-section-row` so they sit next to each other. When either body is expanded it stretches to full width via `:has()` CSS.
- **`styles-games.css`** — `.game-section-row` / `.game-section-col` flex layout added; `:has(.add-game-advanced-body:not(.hidden))` expands an open column to full width.
- `script-games.js` version bumped to `?v=67`.

## [2026-05-27] — Add Game: replace choice picker with collapsible accordions

### Changed
- **`script-games.js`** — Removed the "What would you like to add?" choice picker. Content and Categories are now two collapsible accordions (same `.add-game-advanced` / `.add-game-advanced-toggle` / `.add-game-advanced-body` pattern as Configure), both collapsed by default.
- **`script-games.js`** — `toggleAddGameAdvanced` now reads `btn.dataset.body` to support all three accordions (Configure, Content, Categories) with one function.
- **`script-games.js`** — Removed `chooseAddGameContent`, `chooseAddGameCategories`, `removeGameContent`, `_syncGameChoiceBtns` (all replaced by the shared accordion toggle).
- **`styles-games.css`** — Removed `.btn-choice-active` rule (no longer needed).
- `script-games.js` version bumped to `?v=66`.

## [2026-05-27] — Add Game: choice picker stays visible; both sections can be open together

### Changed
- **`script-games.js`** — `chooseAddGameContent` and `chooseAddGameCategories` no longer hide the choice picker. Instead they **toggle** the respective section open/closed so both content and categories can be expanded simultaneously.
- **`script-games.js`** — `_syncGameChoiceBtns()` added: keeps the two choice buttons highlighted (`.btn-choice-active`) when their section is open.
- **`styles-games.css`** — `.btn-choice-active` style added (blue border + light blue background) to indicate an open section.
- `script-games.js` version bumped to `?v=65`.

## [2026-05-27] — Add Game: content picker and categories choice (matches Add Topic)

### Added
- **`script-games.js`** — Add Game panel now has a **choice picker** at the bottom (same `.choice-picker` / `.btn-choice` pattern as Add Topic): "Add content" (PDF/image/video URL/text) and "Add categories" (inline category list).
- **`script-games.js`** — `_gameContentPickerHtml()` — generates Upload / Web URL / Text tab picker HTML reusing Topics' `.content-picker` / `.content-kind-tab` / `.content-pane` / `.cp-dropzone` CSS classes.
- **`script-games.js`** — `setGameContentKind`, `onGameContentFileChange`, `onGameContentFileDrop` — content picker interaction handlers.
- **`script-games.js`** — `chooseAddGameContent` / `removeGameContent` — show/hide the content section.
- **`script-games.js`** — `chooseAddGameCategories` / `removeGameCategories` — show/hide the inline category add section (requires game name before opening).
- **`script-games.js`** — `addGameCategoryItem`, `removeGameCategoryItem`, `renderGameAddCatList` — manage the staged `_gameAddCats` list with an Add row and removable chips.
- **`script-games.js`** — `saveGameAdd` now seeds the new game's `categories` array from `_gameAddCats` if any were staged.
- **`styles-games.css`** — `.game-cat-add-row`, `.game-add-cat-list`, `.game-add-cat-item`, `.btn-icon-sm` for the category add UI.
- `script-games.js` version bumped to `?v=64`.

## [2026-05-27] — Generate Game AI: fix "Generate Game" button being removed on open

### Fixed
- **`script-games.js`** — `addGameAI()` called `setGamePanelMode('add')` **after** setting `gameEditFields.innerHTML`, so `setGamePanelMode` found and removed the freshly-injected `aiGameGenerateBtn`. Moved `setGamePanelMode('add')` to run **before** the `innerHTML` assignment so the generate button survives. Removed the now-redundant second `setGamePanelMode` / `_isAIGameFlow = true` call at the bottom of the function.
- `script-games.js` version bumped to `?v=63`.

## [2026-05-27] — Generate Game AI: remove Questions tab

### Removed
- **`script-games.js`** — "Questions" tab button removed from the Generate Game AI panel tab bar (the "Generate with categories & questions" toggle at the bottom already covers this). The entire `aiGameSetupPaneQuestions` pane (question-type picker + count slider) is removed. `collapseAIGameStep1`, `expandAIGameStep1`, and `switchAIGameSetupTab` simplified — no longer reference the now-gone Questions pane or tab bar.
- `script-games.js` version bumped to `?v=62`.

## [2026-05-27] — Share Game panel: date tag shows scheduled From – To range

### Changed
- **`script-games.js`** — The date tag next to already-shared departments in the Share panel now shows the game's **scheduled date range** (e.g. "30 May – 30 Jun '26") instead of the single share date. New helper `_fmtScheduleTag(start, end)` produces the compact format; tag is omitted when no schedule dates are set.
- `script-games.js` version bumped to `?v=61`.

## [2026-05-27] — Games list: shares badge opens Share panel

### Changed
- **`script-games.js`** — `_buildShareChip` now fires `openGameSharePanelFromChip(this)` on click (in addition to stopping propagation); new helper `openGameSharePanelFromChip` walks up to the nearest `tr.row-game` and calls `openGameSharePanel`. Clicking the "X shares" badge on any game row now opens the Share panel for that game.
- `script-games.js` version bumped to `?v=60`.

## [2026-05-27] — Share Game panel: remove From / To date inputs

### Removed
- **`script-games.js`** — From / To date fields removed from the Share panel body; date-change detection removed from `syncGameShareConfirmButton`; date reading/applying removed from `confirmGameSharePanel`.
- **`styles-games.css`** — `.share-date-row` rule removed.
- `script-games.js` version bumped to `?v=59`.

## [2026-05-27] — Games list: remove scheduled date chip from rows

### Changed
- **`script-games.js`** — `gameRowHtml` and `updateGameRowChips` no longer render the `.chip-scheduled` date chip on game list rows. The `scheduledDate` / `scheduledEndDate` values are still stored on the row's `dataset` so the Share panel can read and pre-fill the From / To fields.
- `script-games.js` version bumped to `?v=58`.

## [2026-05-27] — Share Game panel: show scheduled date range from Schedule step

### Changed
- **`script-games.js`** — `openGameSharePanel` now renders a **From / To** date row (separated by a divider) below the department checkbox list; dates are pre-filled from the game row's `scheduledDate` / `scheduledEndDate` (i.e. whatever was set via the Schedule kebab option).
- **`script-games.js`** — `syncGameShareConfirmButton` now also detects changes to the date inputs and enables "Save" when either the dept selection OR the dates have changed.
- **`script-games.js`** — `confirmGameSharePanel` reads the date inputs and applies them to the game row (finding the fresh DOM node after any `refreshGames()` re-render), then calls `updateGameRowChips` and `persistGamesScope`.
- **`styles-games.css`** — `.share-date-row` re-added with a top border/divider to visually separate it from the dept list.
- `script-games.js` version bumped to `?v=57`.

## [2026-05-27] — Share Game panel: match Topics share panel design

### Changed
- **`script-games.js`** — `openGameSharePanel(gameRow, opts)` completely rewritten: replaced the collapsible checkbox-dropdown with a flat `.share-dept-list` (same markup as Topics), showing a date tag on already-shared departments. `opts.isNew = true` pre-checks the current department and keeps the confirm button always enabled (used after creating a new game).
- **`script-games.js`** — `syncGameShareConfirmButton` now shows "No changes" / "Save" dynamically (enabled only when the selection has changed from the initial state), matching the Topics share panel.
- **`script-games.js`** — `confirmGameSharePanel` now diffs initial vs current selection to produce `toShare` / `toUnshare` lists; calls new `unshareGameFromDepts` for removals; removed From/To date input handling.
- **`script-games.js`** — `unshareGameFromDepts(companyKey, gameName, deptNames)` added: removes a game from target departments' `GAMES_BY_SCOPE` buckets and trims the source game's `sharedDepts` array.
- **`script-games.js`** — Helper functions added: `formatGameSharedDate`, `getGameSharedDepts`, `getGameSharedDate`.
- **`index-games.html`** — confirm button initial label changed to "No changes" (updated dynamically by `syncGameShareConfirmButton`).
- **`styles-games.css`** — removed `.share-date-row` rule (date inputs removed from share panel).
- `script-games.js` version bumped to `?v=56`.

## [2026-05-27] — Share Game panel: date chip appears on main game list

### Fixed
- **`script-games.js`** — `confirmGameSharePanel()` was calling `updateGameRowChips` on a stale (detached) DOM node because `refreshGames()` had already re-rendered all rows. Now queries `tr.row-game[data-name]` to find the fresh node after the refresh before applying dates and updating chips. `script-games.js` version bumped to `?v=55`.

## [2026-05-27] — Share Game panel: From / To date fields

### Added
- **`script-games.js`** — `openGameSharePanel()` now renders a two-column "From / To" date row (`#shareStartDate` / `#shareEndDate`) below the department dropdown; pre-fills if the game row already has scheduled dates.
- **`script-games.js`** — `confirmGameSharePanel()` reads the date inputs and applies them to the game row (`dataset.scheduledDate` / `scheduledEndDate`), then calls `updateGameRowChips` and `persistGamesScope` so the date chip appears immediately on the row.
- **`styles-games.css`** — `.share-date-row` — two-column grid for the date inputs.
- `script-games.js` version bumped to `?v=54`.

## [2026-05-27] — Topics "Also create a game": AI flow routes to Generate Game AI panel

### Changed
- **`script-games.js`** — `_checkPendingGame()` now reads `pending.gameFlow` from `gameon.pendingGame`; when it is `'ai'`, calls `addGameAI()` (Generate Game AI panel) instead of `addGame()` (manual panel). `script-games.js` version bumped to `?v=53`.

## [2026-05-27] — Add Game Configure: rename "Questions per session" label

### Changed
- **`script-games.js`** — Configure field label changed from "Questions per session" to "Questions for this game".

## [2026-05-27] — Games detail panel: remove inner scroll

### Changed
- **`styles-games.css`** — `#gameEditFields` changed from `overflow-y: auto / flex: 1` to `overflow: visible / flex: none` — content no longer has its own scrollbar.
- **`styles-games.css`** — `#detailEdit` set to `overflow-y: auto` and `#detailEdit .edit-form` set to `overflow: visible / flex: none` so the whole panel scrolls as one unit.
- **`styles-games.css`** — `#detailPanel.open` set to `overflow-y: auto` to allow the panel container itself to scroll.

## [2026-05-27] — Add Game Configure: two-column layout

### Changed
- **`script-games.js`** — Max Attempts and Questions per Session moved into a `.configure-grid` two-column row; Pass Threshold stays full-width below. Inline `style="width:100px"` removed from the two grid inputs.
- **`styles-games.css`** — `.configure-grid` added: `display: grid; grid-template-columns: 1fr 1fr; gap: 12px`.
- `script-games.js` version bumped to `?v=52`.

## [2026-05-27] — Add Game Configure: remove hint text below inputs

### Removed
- **`script-games.js`** — "Defaults to X if left empty" hint spans removed from Max Attempts, Questions per Session, and Pass Threshold fields in the Configure section. `script-games.js` version bumped to `?v=51`.

## [2026-05-27] — Detail panel: title and scope subtitle on same line

### Changed
- **`styles.css`** — `.detail-header` changed to `display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap` so the panel title (`h3`) and scope subtitle (`.detail-parent`) render on the same line, matching the Topics AI panel style. Applies to all detail panels (games, topics, users, companies).

## [2026-05-27] — Generate Game AI: remove "Link to topic" dropdown

### Removed
- **`script-games.js`** — "Link to topic (optional)" dropdown removed from the Generate Game AI panel's generate block. `script-games.js` version bumped to `?v=50`.

## [2026-05-27] — Generate Game AI: topbar and content layout matches Topics AI panel

### Changed
- **`index-games.html`** — Credit pill element changed from custom `ai-panel-credit-bal` to the shared `ai-credits-display` class (same orange/red coin pill as topics); inner HTML uses `#aiGameCreditsCount` / `#aiGameCreditsTotal` spans so JS updates them individually.
- **`script-games.js`** — `addGameAI()` title updated to "Generate Game"; badge text updated to "Generating with AI" to match topics badge wording.
- **`script-games.js`** — `addGameAI()` content pane restructured: AI MODEL first → UPLOAD (always visible, `ai-upload-zone` style) → URL (always visible) → TEXT (always visible, RTE toolbar matching topics) → Generate with categories toggle. Mini-tab switcher removed.
- **`script-games.js`** — `addGameAI()` bottom block: prompt text input + full-width "Generate Game" button (`ai-generate-block`) replaces the dynamically-injected button in the edit-actions bar. Topic link dropdown moved into this block.
- **`script-games.js`** — `onAIGameFileDrop` helper added for drag-and-drop on the new upload zone.
- **`script-games.js`** — Credit display JS updated to write `#aiGameCreditsCount` / `#aiGameCreditsTotal` spans instead of setting innerHTML on the container.
- `script-games.js` version bumped to `?v=49`.

## [2026-05-27] — Add Game: question type picker resumes after share step

### Changed
- **`script-games.js`** — `_postShareCallback` state variable added; set to `showQTypePickerForNewGame` when the share panel opens from a new-game save.
- **`script-games.js`** — `confirmGameSharePanel()` and `cancelGameSharePanel()` fire `_postShareCallback` (if set) instead of `showGameEmpty()`, so the question type picker appears immediately after sharing/skipping — whether the user shares or cancels.
- `script-games.js` version bumped to `?v=48`.

## [2026-05-27] — Add Game: share as separate panel after save

### Changed
- **`script-games.js`** — "Share with departments" section removed from the Add Game form; the form now ends at Configure.
- **`script-games.js`** — `saveGameAdd()` (manual flow): after the game is created, the dedicated Share panel (`detailShare`) opens automatically via `openGameSharePanel(gameRow)` — the same panel used from the kebab menu — with title, game name, dept checkboxes, and Cancel / Share buttons.
- `script-games.js` version bumped to `?v=47`.

## [2026-05-27] — Add Game: rename "Advanced" toggle to "Configure"

### Changed
- **`script-games.js`** — `addGame()` form: collapsible settings toggle label changed from "Advanced" to "Configure". `script-games.js` version bumped to `?v=46`.

## [2026-05-27] — Add Game: topic always pre-selected in dropdown when arriving from Topics page

### Fixed
- **`script-games.js`** — `_checkPendingGame()` no longer falls back to filling the Name field with the topic name. Instead, if the topic isn't already in the dropdown options, a new option is injected and selected — so the topic name always appears selected in the TOPIC dropdown.
- `script-games.js` version bumped to `?v=45`.

## [2026-05-27] — Add Game: cover image swatch picker replaces drag-drop zone

### Changed
- **`script-games.js`** — `addGame()` form layout updated: "Cover Image" section (swatch picker with 3 gradient presets + Upload tile) now appears first, matching the Add Topic panel; Topic dropdown is immediately below it.
- **`script-games.js`** — `_setAddGameCoverPreview(src)` rewritten to drive the swatch picker: selects the matching preset tile when the cover is a preset gradient, otherwise populates and selects the upload tile.
- **`script-games.js`** — `saveGameAdd()` now reads the cover via `readGameCoverPicker()` (`.cover-hidden-input`) instead of the old `#addGameCoverHidden` element.

### Removed
- **`script-games.js`** — Dead `saveAddGameModal()` function (never called — form submits to `saveGameAdd`).
- **`script-games.js`** — Dead `previewAddGameCover()` function (belonged to the old drag-drop zone).
- `script-games.js` version bumped to `?v=44`.

## [2026-05-27] — Simplify: script-games.js cleanup

### Changed
- **`script-games.js`** — `_checkPendingGame()` refactored: merged double `if (pending.topicName)` block into a single `topicFound` flag; fallback branch only runs when the topic was not found in the dropdown. Replaced inline cover-zone DOM manipulation with `_setAddGameCoverPreview()`.
- **`script-games.js`** — Topic option scan converted from `Array.from().forEach()` to a `for/break` loop for early exit once a match is found.
- **`script-games.js`** — Removed empty `$(function(){})` Init block (comment noted it was already handled by a `document.addEventListener` above).
- `script-games.js` version bumped to `?v=43`.

## [2026-05-27] — Add Game panel: topic at top + pre-selected from topics page

### Changed
- **`script-games.js`** — `addGame()` form reordered: TOPIC dropdown is now the first field (above cover zone, Name, Description) so selecting a topic auto-fills the rest.
- **`script-games.js`** — `_checkPendingGame()` now pre-selects the matching topic option in `#addGameTopic` and fires `onAddGameTopicChange()` to auto-fill name/description/cover; falls back to manual field fill if the topic isn't in the dropdown.
- `script-games.js` version bumped to `?v=42`.

## [2026-05-27] — Games page: share chip hover shows department names

### Added
- **`script-games.js`** — `_buildShareChip(depts)` helper renders the share pill with an inline hover tooltip listing each shared department name.
- **`styles-games.css`** — `.shares-tooltip` and `.shares-tt-item` — tooltip panel that appears below the chip on hover.

### Changed
- `script-games.js` version bumped to `?v=41`.

## [2026-05-27] — Games page: share count pill on game rows

### Added
- **`script-games.js`** — `shareGameWithDepts` now appends each target department to `sourceGame.sharedDepts[]` (deduped); shared copies get an empty `sharedDepts: []` so they don't carry the parent's share list.
- **`script-games.js`** — `gameRowHtml` reads `game.sharedDepts`, stores it in `data-shared-depts`, and renders a `chip-shares` pill ("1 share" / "N shares") between the date chip and the Active chip.
- **`script-games.js`** — `updateGameRowChips` refreshes the `cell-share` span from `data-shared-depts` after any chip update.
- **`script-games.js`** — `persistGamesScope` saves `sharedDepts` from `data-shared-depts` so the count survives page refresh.
- **`styles-games.css`** — `.chip-shares` — grey neutral chip matching the live site "1 share" style.
- `script-games.js` version bumped to `?v=40`.

## [2026-05-26] — Share departments: checkbox dropdown component

### Added
- **`script-games.js`** — `_buildShareDeptDropdown(items, wrapperId, menuId)` helper builds a reusable checkbox-dropdown: trigger button with chevron, collapsible menu, label reflects selection count.
- **`script-games.js`** — `window.toggleShareDropdown(id, e)` opens/closes a dropdown by ID; closes any other open dropdowns automatically.
- **`script-games.js`** — `window.syncShareDropdownLabel(id)` updates the trigger label ("Select departments…" / single name / "N departments selected") and re-syncs the Share confirm button.
- **`script-games.js`** — document `click` listener closes all open share dropdowns when clicking outside.
- **`styles-games.css`** — `.share-dept-dropdown`, `.share-dept-trigger`, `.share-dept-menu`, `.sdd-label`, `.sdd-chevron` — full dropdown component styles with open/close transitions.

### Changed
- **`script-games.js`** — `buildGameShareTabHtml()` now renders the dropdown instead of a fixed scrollable list; checkboxes retain `name="shareDept"` so save logic is unchanged.
- **`script-games.js`** — `openGameSharePanel()` now renders the dropdown with `id="gameShareDeptList"` on the menu element so existing confirm-button sync still works.
- `script-games.js` version bumped to `?v=39`.

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
