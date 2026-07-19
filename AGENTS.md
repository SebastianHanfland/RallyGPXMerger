# RallyGPXMerger: guide for coding agents

## Purpose

RallyGPXMerger helps organisers plan bicycle rallies from existing GPX route
segments. It does **not** create routes. It composes segments into one or more
tracks, simulates timing at joins and breaks, and publishes/downloads the
result.

The two supported planning models are:

- **Simple (line):** one ordered track built from uploaded segments.
- **Complex (tree):** several named tracks may reuse segments and merge at
  nodes; priorities, group sizes, and node settings affect calculated times.

## Repository map

- `website/` — React 19, TypeScript, Vite frontend; this is the usual place to
  work.
- `website/src/planner/` — editable planner UI, Redux state, GPX handling, and
  planner-specific calculations.
- `website/src/common/calculation/` — domain calculation logic shared by
  planner/display views. Prefer focused unit tests here for timing or node
  changes.
- `website/src/display/` — public map and table views for saved plans.
- `website/src/comparison/` — comparison of saved plans.
- `website/test/integration/` — browser-like Vitest/Testing Library workflows.
- `testdata/` and `website/test/integration/data/` — GPX fixtures.
- `server/` — Express API for plan persistence. It stores plan JSON files in a
  local `plans/` directory and listens on port 3004.

## Start locally

Run commands from the relevant package directory:

```bash
cd website
npm install
npm run dev
```

For the persistence API, in a second terminal:

```bash
cd server
npm install
npm run dev
```

Do not commit generated `dist/`, `plans/`, `node_modules/`, or local `.env`
files.

## Verify changes

In `website/`:

```bash
npm test
npm run lint
npm run prettier
npm run build
```

`npm test` first type-checks `src` and then runs the Vitest suite. During a
tight edit/test loop, run the most relevant test directly, for example:

```bash
npx vitest run test/integration/PlanningDisplay.test.tsx
```

Use `npm run prettier:fix` only when formatting changes are intended; otherwise
the check is sufficient.

## Planner data flow

The planner is Redux-based. `createPlanningStore` combines independent slices
such as `segmentData`, `trackMerge`, `settings`, `nodes`, `map`, and `backend`.
State is persisted to browser storage after actions.

The key derived value is `getCalculateTracks`: it combines arrival settings,
track compositions, parsed GPX segments, participant delay, and node
specifications, then calls the shared calculation layer. Treat it as derived
state: update the appropriate input slice instead of storing duplicate
calculated data.

`PlanningDisplay.test.tsx` is the best orientation test for the primary user
flow:

1. start wizard;
2. select simple or complex planning;
3. upload GPX segments;
4. in complex mode, create tracks and select their segments;
5. assert the parsed inputs and derived calculated tracks.

It mocks external API, geocoding/map matching, and PDF rendering. Add or adjust
an integration assertion when changing a visible workflow; test calculation
rules in `src/common/calculation/**/__tests__` where possible.

## Conventions and guardrails

- Use TypeScript and existing relative imports with their explicit `.ts`/`.tsx`
  extension style.
- Keep React components focused; place state transitions in Redux actions,
  thunks, or selectors rather than component-local copies of planning data.
- GPX parsing, segment splitting, breaks, shared segments, and branch joins are
  domain-sensitive. Preserve IDs and test both input state and calculated
  output when changing them.
- The UI supports English and German. Add/modify message IDs in both
  `website/src/lang/en.json` and `website/src/lang/de.json`; do not hard-code
  new user-facing strings.
- Public plan loading must not expose edit credentials. Check the server's
  read endpoints whenever changing saved-plan fields.
- Do not alter or remove unrelated uncommitted files. The worktree may contain
  user experiments.
- Never create Git commits, amend commits, push, or open pull requests unless the
  user explicitly requests that exact action in the current conversation.
  File edits and verification commands do not imply permission to commit.
- For planner features, update both translations, add one focused integration test where appropriate, and run Prettier plus the targeted Vitest command
## Suggested agent workflow

1. Read the closest component, reducer/selector, and an existing nearby test.
2. Make the smallest scoped change.
3. Run the focused test, then the appropriate broader check.
4. Report changed files, behavior, and exact verification command/result.

## Working preferences

- For bug reports, diagnose and propose the smallest fix first. Do not implement unless asked.
- Before modifying calculation logic, explain the expected user-visible timing change and add or update a focused test.
- Prefer a focused Vitest command while iterating; run the full frontend suite before handoff only for cross-cutting changes.
- Keep commentary updates brief: state what is being inspected, what changed, and test results.
- Do not make backend, deployment, dependency, or API-contract changes without explicit approval.
- When requirements are ambiguous, inspect nearby tests and existing UI behavior before asking a question.

## Feature-work process

For a new feature or a non-trivial behavior change:

1. First inspect and propose a plan only—do not edit files.
2. Include affected files, UX behavior, state/calculation impact, edge cases,
   alternatives where useful, and a test plan.
3. Wait for explicit approval before implementation.
4. After approval, implement only the agreed scope, verify it, and report the
   changed files and command results.

Small, clearly specified fixes may be implemented directly unless the user asks
for planning first.

## Learning mode

When the user asks for “learning mode” or “teaching mode”:

- Explain the relevant existing code and data flow before editing.
- Propose the smallest change and test strategy; wait for approval unless asked
  to implement directly.
- Work in small logical steps, explaining each change and what it verifies.
- Use questions or short prediction prompts where useful.
- Do not hide important decisions behind large batches of edits.

## Code-review reports

When asked to find bugs or flaws, do not edit files unless requested. Report
findings ordered by severity. For each finding, include evidence, a realistic
failure scenario, confidence level, and a focused regression test. Distinguish
confirmed defects from hypotheses and questions about intended behavior.
