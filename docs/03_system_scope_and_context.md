# System Scope and Context

## Business Context

Associations might want to organize a rally to demonstrate.
For a bigger rally with multiple start points and one endpoint, one needs to calculate the timing for the different branches.
An extra complexity comes with the expected number of people on the branches. This result in a not-zero length of a branch.
To prevent jams in nodes where branches are joined a clever timing is required.

## Technical Context

The frontend is mostly standalone and can calculate a plan locally. It also
publishes plans through the backend and exposes public map, table, vertical
table, and comparison views through URL query parameters.

External services used by the frontend include GeoApify for map matching,
BigDataCloud for postcode and district lookup, and CriticalMaps for the live
participant layer.
