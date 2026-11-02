# Architecture Constraints

The primary application runs in a browser as a static React/Vite frontend.
Planning state is maintained in Redux and persisted in browser `localStorage`.

A small backend is used only when a plan is uploaded or loaded by ID. It is an
Express service that stores plan JSON files and performs token checks for
editing operations; route calculation remains in the frontend.

The frontend supports English and German and calls external services for map
matching and postcode/district lookup when street information is resolved.
