import { BREAK_IDENTIFIER } from '../logic/calculate/types.ts';
import { TrackSelectionBreakOption } from './TrackSelectionBreakOption.tsx';
import { TrackSelectionSegmentOption } from './TrackSelectionSegmentOption.tsx';

interface Props {
    trackId: string;
    segmentId: string;
    segmentName: string;
    fullGpxDelete: boolean;
}

function isABreak(segmentId: string) {
    return segmentId.includes(BREAK_IDENTIFIER);
}

export function TrackSelectionOption({ segmentId, segmentName, trackId, fullGpxDelete }: Props) {
    if (isABreak(segmentId)) {
        return <TrackSelectionBreakOption trackId={trackId} segmentId={segmentId} segmentName={segmentName} />;
    }

    return (
        <TrackSelectionSegmentOption
            segmentId={segmentId}
            segmentName={segmentName}
            trackId={trackId}
            fullGpxDelete={fullGpxDelete}
        />
    );
}
