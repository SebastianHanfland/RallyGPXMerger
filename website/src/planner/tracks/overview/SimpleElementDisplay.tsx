import { isTrackBreak, isTrackSegment, TrackElement } from '../../store/types.ts';
import { useSelector } from 'react-redux';
import { getParsedGpxSegments } from '../../store/segmentData.redux.ts';
import { getColor } from '../../../utils/colorUtil.ts';
import { limitString } from '../../../utils/stringUtil.ts';

export const SimpleElementDisplay = ({ trackElement }: { trackElement: TrackElement }) => {
    const parsedGpxSegments = useSelector(getParsedGpxSegments);

    if (isTrackBreak(trackElement)) {
        return (
            <div
                style={{
                    border: '1px solid transparent',
                    borderColor: 'black',
                    cursor: 'pointer',
                    margin: '1px',
                    backgroundColor: 'white',
                }}
            >
                {trackElement.minutes} min
            </div>
        );
    }
    if (isTrackSegment(trackElement)) {
        const foundSegment = parsedGpxSegments.find((segment) => segment.id === trackElement.id);
        const filename = foundSegment?.filename?.replace('.gpx', '');
        if (!filename) {
            return <span>n.n.</span>;
        }
        const shortenedFileName = limitString(filename, 8);
        return (
            <div
                className={'rounded-2 d-flex justify-content-between'}
                style={{
                    border: '1px solid transparent',
                    borderColor: 'black',
                    cursor: 'pointer',
                    margin: '1px',
                    backgroundColor: getColor(trackElement),
                }}
                key={trackElement.id}
                title={filename}
            >
                {shortenedFileName}
            </div>
        );
    }
    return <span>other</span>;
};
