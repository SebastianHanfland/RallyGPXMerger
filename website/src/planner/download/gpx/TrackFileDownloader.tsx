import { getGpxContentFromTimedPoints } from '../../../utils/SimpleGPXFromPoints.ts';
import { FileDownloader } from '../FileDownloader.tsx';
import { CalculatedTrack } from '../../../common/types.ts';

export const TrackFileDownloader = ({ track }: { track: CalculatedTrack }) => {
    return (
        <FileDownloader
            name={`${track.filename}.gpx`}
            content={getGpxContentFromTimedPoints(track.points, track.filename!)}
            id={track.id}
            color={track.color}
            label={'GPX'}
            onlyIcon={true}
            size={'sm'}
        />
    );
};
