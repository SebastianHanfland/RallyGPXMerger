import { useSelector } from 'react-redux';
import { FileDownloaderDropdownItem } from '../download/FileDownloader.tsx';
import { TrackComposition } from '../store/types.ts';
import { getGpxContentFromTimedPoints } from '../../utils/SimpleGPXFromPoints.ts';
import { getCalculateTracks } from '../calculation/getCalculatedTracks.ts';

interface Props {
    track: TrackComposition;
    onAction?: () => void;
}

export function TrackDownloadActionItem({ track, onAction }: Props) {
    const { id } = track;
    const calculatedTrack = useSelector(getCalculateTracks).find((candidate) => candidate.id === id);

    const closeMenu = () => onAction?.();

    if (!calculatedTrack) {
        return null;
    }

    return (
        <FileDownloaderDropdownItem
            content={() => getGpxContentFromTimedPoints(calculatedTrack.points, calculatedTrack.filename ?? 'Track')}
            name={calculatedTrack.filename + '.gpx'}
            onClick={closeMenu}
        />
    );
}
