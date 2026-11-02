# Building Block View

## Whitebox Overall System

The system consists of a React/Vite frontend and a small Express backend.
Calculation, GPX handling, map presentation, downloads, and most application
logic are in the frontend. The backend stores plan JSON files and protects
updates and deletes with the plan's admin token.

### Frontend

React UI <-> Redux Toolkit stores/selectors <-> planner and display logic

The planning store combines independent slices for backend metadata, layout,
segments, track compositions, settings, nodes, map state, points, geocoding,
and notifications. Relevant state is written to browser `localStorage` after
updates and restored when the planner starts.

Plans can also be loaded from the server by planning ID. Public reads omit the
admin token; the planner can use the token supplied in the edit URL for
authenticated updates or deletion.

`createSelector` is used to memoize derived values such as calculated tracks,
gaps, street information, node positions, and map data.

### Backend

The backend exposes Express routes under `/bike` and stores each plan as a
JSON file in `plans/`. It accepts JSON bodies up to 50 MB, enables permissive
CORS headers for the frontend, and validates UUID plan IDs.
