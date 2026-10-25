import { TrackComposition } from '../store/types';
import { TrackColorActionItem } from './TrackColorActionItem';
import { TrackDownloadActionItem } from './TrackDownloadActionItem';
import { TrackDeleteActionItem } from './TrackDeleteActionItem';
import { TrackSegmentIdsClipboardActionItems } from './TrackSegmentIdsClipboardActionItems';

interface Props {
    track: TrackComposition;
    onAction?: () => void;
}

export function TrackActionItems({ track, onAction }: Props) {
    return (
        <>
            <TrackDeleteActionItem track={track} onAction={onAction} />
            <TrackSegmentIdsClipboardActionItems track={track} onAction={onAction} />
            <TrackColorActionItem track={track} onAction={onAction} />
            <TrackDownloadActionItem track={track} onAction={onAction} />
        </>
    );
}
