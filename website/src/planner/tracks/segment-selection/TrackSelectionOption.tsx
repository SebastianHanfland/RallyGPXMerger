import { TrackSelectionBreakOption } from './TrackSelectionBreakOption.tsx';
import { TrackSelectionSegmentOption } from './TrackSelectionSegmentOption.tsx';
import { isTrackBreak, isTrackEntry, TrackElement } from '../../store/types.ts';

interface Props {
    trackId: string;
    trackElement: TrackElement;
    segmentName: string;
    fullGpxDelete: boolean;
}

export function TrackSelectionOption({ trackElement, segmentName, trackId, fullGpxDelete }: Props) {
    if (isTrackBreak(trackElement)) {
        return <TrackSelectionBreakOption trackId={trackId} trackElement={trackElement} segmentName={segmentName} />;
    }
    if (isTrackEntry(trackElement)) {
        return <div>{trackElement.streetName}</div>;
    }

    return (
        <TrackSelectionSegmentOption
            segmentId={trackElement.id}
            segmentName={segmentName}
            trackId={trackId}
            fullGpxDelete={fullGpxDelete}
        />
    );
}
