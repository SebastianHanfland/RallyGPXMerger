I scanned the TypeScript source by size, branching, number of responsibilities, and domain coupling. This is a heuristic ranking rather than a formal complexity score.
1.
flowGraph.ts — 608 lines
Builds the flow graph, calculates merges and groups, lays out the graph, calculates coordinates, and exposes Redux selectors. Split graph construction, layout, and selector wiring into separate modules.
2.
segmentData.redux.ts — 334 lines
Combines GPX segment state, speeds, street lookup data, manual overrides, replacement workflows, filters, sorting, and selectors. Extract domain operations into focused helpers or slices.
3.
calculateTrackStreetInfos.ts — 259 lines
Converts calculated track data into street and waypoint information while handling joins, breaks, nodes, timing, and GPX resolution. Separate waypoint construction from timing and segment resolution.
4.
PlannerSidebarTrackStreets.tsx — 295 lines
A large UI component with many imports and display decisions. Split street rows, filters, warnings, editing controls, and download actions into smaller components.
5.
SimpleGPX.ts — 277 lines
Handles parsing, normalization, time shifting, breaks, merging, duplication, and GPX serialization. Separate the mutable time operations from GPX input/output conversion.
6.
trackMerge.reducer.ts — 231 lines
Contains track composition mutations, break and entry-point editing state, clipboard state, and selectors. Separate composition operations from temporary dialog/editing state.
7.
FlowOverviewContent.tsx — 261 lines
Combines formatting, legend rendering, SVG rendering, event rendering, and layout concerns. Extract SVG sections such as tracks, merges, events, axis, and finish marker.
8.
getBlockedStreetInfo.ts — 211 lines
Merges street data across tracks, deduplicates paths, handles reversed paths, aggregates timing and speed, and counts participants. Move path merging and street aggregation into separately tested pure functions.
9.
PlannerSidebarOverviewEntryPoints.tsx — 242 lines
Combines entry-point grouping, descriptions, modal behavior, status display, and table rendering. Extract the data preparation and individual entry-point row.
10.
getSpecifiedDelayPerTrack.ts — 189 lines
Encodes complex timing rules involving nodes, branches, priorities, group sizes, and track relationships. Split the calculation into named stages and add focused tests for each timing rule.
StreetPathMap.test.tsx is not among the most complex files. It is short and has two clear scenarios. Its only likely improvement would be extracting shared application mocks if several integration tests need the same setup.
