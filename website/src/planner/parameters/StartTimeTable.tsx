import { Table } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { getTrackCompositions } from '../store/trackMerge.reducer.ts';
import { useSelector } from 'react-redux';
import { formatTimeOnly } from '../../utils/dateUtil.ts';
import { TrackBuffer } from '../ui/TrackBuffer.tsx';
import { TrackRounding } from '../ui/TrackRounding.tsx';
import { getTrackStreetInfos } from '../logic/resolving/aggregate/calculateTrackStreetInfos.ts';

export const StartTimeTable = () => {
    const tracks = useSelector(getTrackCompositions);
    const trackInfos = useSelector(getTrackStreetInfos);

    return (
        <div>
            <Table striped bordered hover style={{ width: '100%' }} size="sm">
                <thead>
                    <tr>
                        <th style={{ width: '30%' }}>
                            <FormattedMessage id={'msg.trackName'} />
                        </th>
                        <th style={{ width: '20%' }}>
                            <FormattedMessage id={'msg.start'} />
                        </th>
                        <th style={{ width: '15%' }}>
                            <FormattedMessage id={'msg.buffer'} />
                        </th>
                        <th style={{ width: '15%' }}>
                            <FormattedMessage id={'msg.rounding'} />
                        </th>
                        <th style={{ width: '20%' }}>
                            <FormattedMessage id={'msg.publicStart'} />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {tracks.map((track) => {
                        const matchedTrackInfo = trackInfos.find((trackInfo) => trackInfo.id === track.id);
                        return (
                            <tr key={track.id}>
                                <td>{track.name}</td>
                                <td>
                                    {matchedTrackInfo?.startFront ? formatTimeOnly(matchedTrackInfo?.startFront) : ''}
                                </td>
                                <td>
                                    <TrackBuffer track={track} />
                                </td>
                                <td>
                                    <TrackRounding track={track} />
                                </td>
                                <td>
                                    {matchedTrackInfo?.publicStart ? formatTimeOnly(matchedTrackInfo?.publicStart) : ''}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        </div>
    );
};
