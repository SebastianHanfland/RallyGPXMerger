import { isTrackBreak, isTrackSegment, TrackElement } from '../../store/types';
import { useSelector } from 'react-redux';
import { getParsedGpxSegments } from '../../store/segmentData.redux';
import { getColor } from '../../../utils/colorUtil';
import { limitString } from '../../../utils/stringUtil';
import { SegmentGapDisplay } from './TrackSelectionGapDisplay';
import { getGaps } from '../../calculation/getGaps';

interface Props {
    trackElement: TrackElement;
    trackId: string;
}

export const SimpleElementDisplay = ({ trackElement, trackId }: Props) => {
    const parsedGpxSegments = useSelector(getParsedGpxSegments);
    const gapsOfTrack = useSelector(getGaps).filter((gap) => gap.trackId === trackId);

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
        const shortenedFileName = limitString(filename, gapsOfTrack.length > 0 ? 6 : 8);
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
                <SegmentGapDisplay segmentId={trackElement.id} trackId={trackId} />
            </div>
        );
    }
    return <span>other</span>;
};
