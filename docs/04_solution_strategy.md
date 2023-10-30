# Solution Strategy

The core logic of this tool is to merge different GPX segments into tracks, with respect to the number of participants.

### Parameters
#### Arrival time
Time when the first people should arrive at the end of the track.

#### Expansion of participants
To prevent jams, we need to take into account that participants need space and tracks have a certain length.
The length can be entered at the segments. It only makes sense to add these numbers at segments that are only used by one track.
Then the numbers are added up. With shifting the arrival of the tracks, we reach that the flow of participants is optimized.

#### Average speed of the rally
When adding a GPX Segment without times, the times can be calculated bases on an average speed and the slopes.
This value can be set here.

