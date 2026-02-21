import { TrackSelectionBreakOption } from './TrackSelectionBreakOption.tsx';
import { TrackSelectionSegmentOption } from './TrackSelectionSegmentOption.tsx';
import { BREAK, TrackElement } from '../../store/types.ts';

interface Props {
    trackId: string;
    trackElement: TrackElement;
    segmentName: string;
    fullGpxDelete: boolean;
}

export function TrackSelectionOption({ trackElement, segmentName, trackId, fullGpxDelete }: Props) {
    if (trackElement.type === BREAK) {
        return <TrackSelectionBreakOption trackId={trackId} trackElement={trackElement} segmentName={segmentName} />;
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
