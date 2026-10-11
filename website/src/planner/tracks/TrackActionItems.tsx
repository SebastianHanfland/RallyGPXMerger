import { TrackComposition } from '../store/types.ts';
import { TrackColorActionItem } from './TrackColorActionItem.tsx';
import { TrackDownloadActionItem } from './TrackDownloadActionItem.tsx';
import { TrackDeleteActionItem } from './TrackDeleteActionItem.tsx';
import { TrackSegmentIdsClipboardActionItems } from './TrackSegmentIdsClipboardActionItems.tsx';

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
