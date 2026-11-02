# Deployment View

The frontend can be run locally with Vite or deployed as a static site. The
GitHub Actions workflow runs for pushes to `main` and pull requests, installs
dependencies with Node 24, builds and tests the website, writes the custom
domain to `dist/CNAME`, and publishes `dist/` with `gh-pages`.

The deployed frontend uses the fixed API base URL configured in
`website/src/api/api.ts`: `https://hase.uber.space/bike`. The backend is a
separately hosted Node/Express process. It creates a local `plans/` directory
and stores one JSON file per plan.
