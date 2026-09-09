import { TrackSelectionBreakOption } from './TrackSelectionBreakOption.tsx';
import { TrackSelectionSegmentOption } from './TrackSelectionSegmentOption.tsx';
import { isTrackBreak, isTrackEntryPoint, TrackElement } from '../../store/types.ts';
import { TrackSelectionEntryPointOption } from './TrackSelectionEntryPointOption.tsx';

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
