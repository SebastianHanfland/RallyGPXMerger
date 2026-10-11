import { TrackComposition } from '../store/types.ts';
import { TrackColorActionItem } from './TrackColorActionItem.tsx';
import { TrackDownloadActionItem } from './TrackDownloadActionItem.tsx';

interface Props {
    track: TrackComposition;
    onAction?: () => void;
}

export function SingleTrackActionItems({ track, onAction }: Props) {
    return (
        <>
            <TrackColorActionItem track={track} onAction={onAction} />
            <TrackDownloadActionItem track={track} onAction={onAction} />
        </>
    );
}
