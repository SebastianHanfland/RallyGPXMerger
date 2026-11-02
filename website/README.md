# RallyGPXMerger

The frontend is a React 19 and TypeScript application built with Vite.

### Requirements

Use a current Node.js version supported by the CI workflow (Node 24.x).

### Getting started

From this directory, install dependencies:

```bash
npm install
```

Start the local development server with:

```bash
npm run dev
```

Other useful commands are:

```bash
npm run build       # Type-check and create the Vite production build
npm run preview     # Preview the production build locally
npm test            # Type-check and run the Vitest suite
npm run lint        # Run ESLint
npm run prettier    # Check formatting
```

The GitHub Actions workflow builds and tests the website, then publishes
`dist/` with the `gh-pages` script.
