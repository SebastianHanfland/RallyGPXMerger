import { TrackSelectionBreakOption } from './TrackSelectionBreakOption';
import { TrackSelectionSegmentOption } from './TrackSelectionSegmentOption';
import { isTrackBreak, isTrackEntryPoint, TrackElement } from '../../store/types';
import { TrackSelectionEntryPointOption } from './TrackSelectionEntryPointOption';

interface Props {
    trackId: string;
    trackElement: TrackElement;
    segmentIndex: number;
    segmentName: string;
    fullGpxDelete: boolean;
}

export function TrackSelectionOption({ trackElement, segmentName, trackId, fullGpxDelete, segmentIndex }: Props) {
    if (isTrackBreak(trackElement)) {
        return <TrackSelectionBreakOption trackId={trackId} trackElement={trackElement} />;
    }
    if (isTrackEntryPoint(trackElement)) {
        return <TrackSelectionEntryPointOption trackId={trackId} trackElement={trackElement} />;
    }

    return (
        <TrackSelectionSegmentOption
            segmentId={trackElement.id}
            segmentName={segmentName}
            trackId={trackId}
            segmentIndex={segmentIndex}
            fullGpxDelete={fullGpxDelete}
        />
    );
}
