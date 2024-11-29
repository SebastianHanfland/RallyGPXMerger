import { Table } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { getTrackCompositions } from '../store/trackMerge.reducer.ts';
import { useSelector } from 'react-redux';
import { TrackPrio } from '../ui/TrackPrio.tsx';
import { getEnrichedTrackStreetInfos } from '../logic/resolving/selectors/getEnrichedTrackStreetInfos.ts';
import { formatTimeOnly } from '../../utils/dateUtil.ts';

export const StartTimeTable = () => {
    const tracks = useSelector(getTrackCompositions);
    const trackInfos = useSelector(getEnrichedTrackStreetInfos);

    return (
        <div>
            <Table striped bordered hover style={{ width: '100%' }} size="sm">
                <thead>
                    <tr>
                        <th>
                            <FormattedMessage id={'msg.trackName'} />
                        </th>
                        <th>
                            <FormattedMessage id={'msg.start'} />
                        </th>
                        <th>
                            <FormattedMessage id={'msg.buffer'} />
                        </th>
                        <th>
                            <FormattedMessage id={'msg.rounding'} />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {tracks.map((track) => {
                        const matchedTrackInfo = trackInfos.find((trackInfo) => trackInfo.id === track.id);
                        return (
                            <tr>
                                <td>{track.name}</td>
                                <td>
                                    {matchedTrackInfo?.startFront ? formatTimeOnly(matchedTrackInfo?.startFront) : ''}
                                </td>
                                <td>
                                    <TrackPrio track={track} />
                                </td>
                                <td>
                                    <TrackPrio track={track} />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        </div>
    );
};
