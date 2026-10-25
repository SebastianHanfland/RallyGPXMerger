import { getGpxContentFromTimedPoints } from '../../../utils/SimpleGPXFromPoints';
import { FileDownloader } from '../FileDownloader';
import { CalculatedTrack } from '../../../common/types';

export const TrackFileDownloader = ({ track }: { track: CalculatedTrack }) => {
    return (
        <FileDownloader
            name={`${track.filename}.gpx`}
            content={() => getGpxContentFromTimedPoints(track.points, track.filename!)}
            id={track.id}
            color={track.color}
            label={'GPX'}
            onlyIcon={true}
            size={'sm'}
        />
    );
};
