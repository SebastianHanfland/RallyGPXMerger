# FAQs

## Functionality of the tool

### General

- Import, edit, split, reverse, reorder, and download GPX segments.
- Combine segments and breaks into calculated tracks.
- Calculate timing from speeds, elevation, participant counts, buffers,
  arrival times, and node behavior.
- Highlight gaps and unresolved street information and allow manual corrections.
- Add points of interest, entry points, and construction-site overlays.
- Preview plans on a map with a time slider and selectable layers.
- View live CriticalMaps locations when the public map is connected to that
  service.
- Download calculated/source GPX files, JSON planning files, CSV data, and PDFs.
- Publish a plan as a map, table, or vertical table and embed those views.
- Compare multiple saved plans.
- Configure personal GeoApify and BigDataCloud API keys.
- Configure node ordering and simultaneous joins in Complex mode.

### Simple

- Upload GPX files.
- Reorder and combine them into one ordered track.
- Configure breaks, timing, participants, and speed for the track.

### Complex

- Upload GPX files.
- Create multiple named tracks and assign segments to them.
- Reuse segments across branches and merge branches at nodes.
- Adjust track priorities and node join behavior.

## Possible Problems

Street resolution uses [GeoApify](https://www.geoapify.com/) for map matching
and [BigDataCloud](https://www.bigdatacloud.com/) for postcode and district
lookup. Their quotas may be exceeded. Users can create their own accounts and
enter API keys in the planner settings.

Large plans may also be limited by browser storage or the server's 50 MB JSON
request limit.
