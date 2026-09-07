import { Table } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { TrackStartName } from '../../../tracks/components/TrackStartName.tsx';
import { getTrackCompositions } from '../../../store/trackMerge.reducer.ts';
import { getTrackStreetInfos } from '../../../calculation/getTrackStreetInfos.ts';

export const PlannerSidebarOverviewStartNames = () => {
    const tracks = useSelector(getTrackCompositions);
    const trackInfos = useSelector(getTrackStreetInfos);

    return (
        <Table striped bordered hover style={{ width: '100%' }} size="sm">
            <thead>
                <tr>
                    <th style={{ width: '30%' }}>
                        <FormattedMessage id="msg.trackName" />
                    </th>
                    <th style={{ width: '30%' }}>
                        <FormattedMessage id="msg.originalStartName" />
                    </th>
                    <th style={{ width: '40%' }}>
                        <FormattedMessage id="msg.startName" />
                    </th>
                </tr>
            </thead>
            <tbody>
                {tracks.map((track) => {
                    const matchedTrackInfo = trackInfos.find((trackInfo) => trackInfo.id === track.id);
                    const firstStreetName = matchedTrackInfo?.wayPoints[0]?.streetName;

                    return (
                        <tr key={track.id}>
                            <td>{track.name || '---'}</td>
                            <td>{firstStreetName ?? ''}</td>
                            <td>
                                <TrackStartName track={track} />
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </Table>
    );
};
