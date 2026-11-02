# Solution Strategy

The core logic is to combine GPX segments into track compositions and derive
timed tracks from their geometry, speeds, participant counts, breaks, entry
points, and node specifications. The calculation is exposed through memoized
Redux Toolkit selectors so it is recalculated when relevant planning inputs
change.

### Parameters

#### Arrival time

Time when the first people should arrive at the end of the track.

#### Expansion of participants

To prevent jams, we need to take into account that participants need space and tracks have a certain length.
The length can be entered at the segments. It only makes sense to add these numbers at segments that are only used by one track.
Then the numbers are added up. With shifting the arrival of the tracks, we reach that the flow of participants is optimized.

#### Average speed of the rally

When a GPX segment is uploaded, the application parses its points and derives
times from the configured speed and elevation/slope data. A default speed can
be overridden for individual segments.

#### Priority at a node

When two branches join, the default order is based on participant group size.
Track priorities can override that order so a higher-priority branch finishes
earlier.

#### Delay at a node

At each node, the join behavior can be configured, including ordering branches
or making branches join at the same time. The selected behavior contributes
delays to the calculated tracks.
