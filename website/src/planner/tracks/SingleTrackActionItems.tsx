import { useSelector } from 'react-redux';
import { FileDownloaderDropdownItem } from '../download/FileDownloader.tsx';
import { TrackComposition } from '../store/types.ts';
import { getGpxContentFromTimedPoints } from '../../utils/SimpleGPXFromPoints.ts';
import { getCalculateTracks } from '../calculation/getCalculatedTracks.ts';
import { TrackColorActionItem } from './TrackColorActionItem.tsx';

interface Props {
    track: TrackComposition;
    onAction?: () => void;
}

export function SingleTrackActionItems({ track, onAction }: Props) {
    const { id } = track;
    const calculatedTrack = useSelector(getCalculateTracks).find((candidate) => candidate.id === id);

    const closeMenu = () => onAction?.();

    return (
        <>
            <TrackColorActionItem track={track} onAction={onAction} />
            {calculatedTrack && (
                <FileDownloaderDropdownItem
                    content={() =>
                        getGpxContentFromTimedPoints(calculatedTrack.points, calculatedTrack.filename ?? 'Track')
                    }
                    name={calculatedTrack.filename + '.gpx'}
                    onClick={closeMenu}
                />
            )}
        </>
    );
}
