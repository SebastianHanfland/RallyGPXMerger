import { Table } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { getTrackCompositions } from '../store/trackMerge.reducer.ts';
import { useSelector } from 'react-redux';
import { getTrackStreetInfos } from '../calculation/getTrackStreetInfos.ts';
import { TrackStartName } from '../tracks/components/TrackStartName.tsx';

export const StartNameOverwriteTable = () => {
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
                        <th style={{ width: '30%' }}>
                            <FormattedMessage id={'msg.originalStartName'} />
                        </th>
                        <th style={{ width: '40%' }}>
                            <FormattedMessage id={'msg.startName'} />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {tracks.map((track) => {
                        const matchedTrackInfo = trackInfos.find((trackInfo) => trackInfo.id === track.id);
                        const wayPoints = matchedTrackInfo?.wayPoints;
                        return (
                            <tr key={track.id}>
                                <td>{track.name}</td>
                                <td>{wayPoints && wayPoints?.length > 0 ? wayPoints[0].streetName : ''}</td>
                                <td>
                                    <TrackStartName track={track} />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        </div>
    );
};
