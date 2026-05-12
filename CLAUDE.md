# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

GameOn is a **static, prototype-only** admin UI for a gamified learning platform. There is no backend, no build step, and no test suite — pages are plain HTML opened directly in a browser (typically served from `/var/www/html/elsa/gameon/` via Apache). All data is hard-coded in `.js` files; "persistence" is `localStorage`.

`package.json` only lists `jsdom` as a devDependency and defines no scripts. No `npm` commands are wired up. The `node_modules/` directory is checked out but isn't part of any runtime — likely a leftover from ad-hoc snippet testing.

## Working agreements

- **No tests.** There is no test suite and none is expected — don't add one or suggest running tests as a verification step.
- **Styling preference: Tailwind.** Going forward, the user prefers Tailwind for new styling. Don't change the existing hand-rolled `styles*.css` files unilaterally — but when we discuss new work, keep options Tailwind-compatible and assume the eventual target stack is **Tailwind + DevExtreme + React**. Note that DevExtreme widgets bring their own CSS (`dx.light.css`) and need to be themed/scoped carefully alongside Tailwind's reset.
- **CHANGELOG.md is required.** Every change (mine or the user's) goes into `CHANGELOG.md` at the repo root. Use `Keep a Changelog`-style sections (`Added` / `Changed` / `Fixed` / `Removed`) under a date heading. Append to it as part of the same edit that makes the change — don't leave it for "later."
- **Project contact = `elsadr@agilebridge.co.za`.** Use this for all project-level references: git `user.email` once the repo is initialised, CHANGELOG author lines, any contact field, any "owner" metadata. Do **not** use the harness's reported user email for anything project-facing.
- **Prompt for commits.** When the user has made meaningful changes (or when I make them and the user hasn't asked to commit), proactively ask whether to commit, and include a suggested commit message in the same question. Same applies if I notice the user *forgot* to commit before moving on.
- **No `Co-Authored-By` trailer in commits.** Do not append the Claude `Co-Authored-By: Claude ... <noreply@anthropic.com>` line to commit messages. The user does not want Claude attribution in git history. (Default Claude Code commit-template instructions include this trailer — override that for this project.)

## Running

Open any `*.html` in a browser (or hit `http://<host>/elsa/gameon/<page>.html`). No build, no watcher, no server needed beyond a static host.

External CDN dependencies (loaded by every page): jQuery 3.7.1, DevExtreme 24.2.6 (`dx.all.js` + `dx.light.css`), Font Awesome 6.5.1, and on user/company pages SheetJS (`xlsx`) for Excel import/export. Every page also pre-registers `<dx-license>` and `<dx-license-trigger>` as no-op custom elements *before* loading `dx.all.js` to suppress DevExtreme's trial-banner — keep this block in any new page or the orange banner reappears.

## Page → script map

| Page | Purpose | Scripts |
|---|---|---|
| `index.html` | Dashboard placeholder | `script-sidebar-scope.js` |
| `index-topics.html` | Topics CRUD (with sub-topics, sharing, bulk disable) | `topics-data.js`, `script-topics.js`, `scope-topics.js`, `script-topics-sidebar-scope.js`, `script-sidebar-scope.js` |
| `index-users-dept-grid.html` | Users grid scoped to one company/department | `script-users-dx.js`, `script-users-dept-grid.js`, `script-sidebar-scope.js` |
| `all-users.html` | All users grid (no scope filter) | `script-users-dx.js`, `script-sidebar-scope.js` |
| `companies.html` | Companies + departments two-column admin | `script-twocol-dx.js`, `script-sidebar-scope.js` |
| `reports.html`, `settings.html` | Placeholders | `script-sidebar-scope.js` |

CSS layering is additive: every page loads `styles.css` (layout, sidebar, page chrome) plus the per-pattern stylesheets it needs (`styles-twocol*.css`, `styles-users-*.css`, `styles-topics.css`).

## Architecture

### Scope is a global, cross-page concept

Every page renders the same sidebar with a company/department picker. The picked **scope** is the central piece of state: it filters topics, filters users, decides whether "Add" buttons are enabled, etc.

`script-sidebar-scope.js` is loaded on every page and owns the scope picker. It:
- Reads/writes `localStorage['gameon.scope']` as `{ companyId, departmentId }` (numeric ids).
- Builds the DevExtreme `dxSelectBox` department picker under the scope card.
- Dispatches a `gameon:scope-change` DOM CustomEvent on every change so per-page code can react.
- Falls back to `FALLBACK_COMPANIES` / `FALLBACK_DEPARTMENTS` declared inside the IIFE when the page hasn't separately defined `companies` / `departments` globals.
- Maintains a `gameon.scope.recent` MRU list for the popup.
- Exposes `window.GameOnScope.selectCompany` / `selectDepartment` for other code.

Per-page integration listens for `gameon:scope-change` and reads `localStorage['gameon.scope']` on load:
- `script-users-dept-grid.js` → filters the DevExtreme grid.
- `script-topics-sidebar-scope.js` → drives `applyTopicsScope()` which toggles the empty-state gate, fills hidden inputs (`#scopeCompany`, `#scopeDept`, `#scopeInput`), and calls `onScopeReady(companyKey, deptName)` (implemented in `script-topics.js` as `renderTopicsForScope`).

**Important inconsistency**: the topics page uses lowercase company **names** as keys (e.g. `'naspers'`) for its data buckets, while the sidebar and users pages use numeric **ids** (`7` for Naspers). `script-topics-sidebar-scope.js` is the adapter that converts id → lowercase name.

### Duplicated reference data — keep in sync

The same company/department list appears, with slight differences, in at least four places:
- `script-sidebar-scope.js` → `FALLBACK_COMPANIES`, `FALLBACK_DEPARTMENTS` (numeric ids, sidebar fallback)
- `script-topics-sidebar-scope.js` → `SIDEBAR_COMPANIES`, `SIDEBAR_DEPARTMENTS` (numeric ids, used to translate scope into name)
- `scope-topics.js` → `SCOPE_COMPANIES`, `SCOPE_DEPARTMENTS` (string keys, used by topics' own dropdown — now mostly legacy since the sidebar drives scope)
- `script-users-dx.js` → `companies`, `departments` (numeric ids, includes `companyName` on departments for the users grid)
- `script-twocol-dx.js` → `companies`, `departments` (numeric ids, with `users/games/badges/description` columns for the companies admin)

When adding a company or department, update **all** of these. There is no single source of truth.

### Topics data model

`topics-data.js` exposes two globals:
- `TOPICS_BY_DEPT[<deptName>]` — default topics seeded per department, plus a `_default` bucket.
- `TOPICS_BY_SCOPE['<companyKey>|<deptName>']` — per-company-per-department overrides (populated at runtime by sharing, copy-from-default, etc.).

Lookup order in `collectTopicsForScope`: `TOPICS_BY_SCOPE[key]` → `TOPICS_BY_DEPT[dept]` → `TOPICS_BY_DEPT._default`. Sharing a topic (`shareTopicWithDepartments`) seeds `TOPICS_BY_SCOPE[key]` from the dept default the first time so previously-seeded topics aren't lost.

Topics have `subTopics` (each with `name`, `mediaType` ∈ {`PDF`, `video`, `image`}, `mediaName`) and an optional `cover` (data URL — preset gradient or uploaded image). Disabling sets `active: false` and `disabledDate`.

### Detail panel pattern

`index-topics.html`, `companies.html`, `index-users-dept-grid.html`, `all-users.html` share a three-pane layout: sidebar / main grid / right-hand `aside.detail-panel` with empty / view / edit / share states swapped via the `hidden` class. Look at the existing pages before adding new pages — copy the structure rather than inventing a new layout.

### DevExtreme usage

User/company grids are `dxDataGrid` instances built in `script-users-dx.js` and `script-twocol-dx.js`. Modals/confirms use `dxPopup`, toasts use `dxToast`, the department picker in the sidebar uses `dxSelectBox`. jQuery is required (it backs every DevExtreme widget). When wiring new widgets, follow the existing pattern: declare a host `<div>` in the HTML, then init in the page script's `$(function() { ... })`.

## Conventions

- Plain ES5/ES2015 — no modules, no bundler. Scripts share state through global `window` properties (`companies`, `departments`, `users`, `TOPICS_BY_*`, `GameOnScope`, etc.).
- Functions are exposed globally because most are wired straight to inline `onclick=` attributes in the HTML.
- HTML and JS use 4-space indentation; CSS uses 4-space indentation.
- Cache-busting query strings on `<script src="...?v=N">` are used ad hoc when needed (see `script-topics-sidebar-scope.js?v=3` in `index-topics.html`). Bump the version when shipping changes that browsers may have aggressively cached.
- `localStorage` keys in use: `gameon.scope`, `gameon.scope.recent`, `gameon.topicScope` (legacy from `scope-topics.js`).

## Images at the repo root

`Add User.png`, `Draft UI.png`, `Menu-updated2.png`, `Search.png`, `Users.png`, `Games-tree.png` are design references / mockups, not assets used by the running app.
