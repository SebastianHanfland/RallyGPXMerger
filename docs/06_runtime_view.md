# Runtime View

The tool is a Vite-based React 19 application using Redux Toolkit for state
handling. At startup the planner reads its state slices from browser
`localStorage`; state changes are persisted back to the same storage.

## Workflow

- a user starts a Simple or Complex plan
- GPX segment files are uploaded and parsed
- segments are ordered or assigned to tracks
- participant, speed, timing, break, node, and entry-point settings are added
- memoized selectors derive calculated tracks and validation information
- the result is shown on a map, tables, flow views, or downloads
- the plan can be exported locally or uploaded to the persistence API

## Data storage

The planner state is held in Redux Toolkit slices. User interactions dispatch
actions, and the relevant slices are mirrored into `localStorage`.

When the website is loaded, the planner state is initialized from the values in
`localStorage`.

The calculated-track selector reads the source slices, invokes the shared
calculation layer, and returns derived data. It is recalculated when relevant
inputs change; calculated tracks are not the primary editable source of truth.

Map and display stores have their own Redux state and selectors. The current
implementation does not require a separate global mirror for planner data.

## Map simulation

To simulate the rally on the map, a timer is used. The TimeSlider component represents the time.
Start and end of tracks are calculated and then scaled with the numbers of the slider.
Thus, the value stored is only a number which results in a percentage.
The length of a track/group is calculated via the same parameter as in the merge calculation.
The map derives the displayed position from timed track points and interpolates
between GPX points for smoother animation.

## Street resolving

The gpx segments are first reduced to coordinates and are then used to resolve the street names and their post codes.
Then the waypoints are grouped by street name and post code.
Resolved street and postcode data is held in planner state and persisted with
the other state slices. Geocoding keys can be configured in the planner, and
resolved data remains available until the planning state is cleared or
replaced.
