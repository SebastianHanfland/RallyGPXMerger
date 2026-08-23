# Street resolver fixtures

Each resolver scenario lives in its own directory and contains:

- `route.gpx` — the original route points;
- `geoapify-response.json` — the captured map-matching response;
- `expected-streets.ts` — one `expectedStreet(lat, lon, name)` call per GPX point.

Copy `example-street-transition` for a new case, replace the route and response,
then fill the expected street list in GPX point order. Use `null` for a point
that is intentionally expected to remain unknown.
