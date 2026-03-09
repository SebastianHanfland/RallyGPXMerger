import { Table } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { getTrackCompositions } from '../store/trackMerge.reducer.ts';
import { useSelector } from 'react-redux';
import { TrackPrio } from '../tracks/components/TrackPrio.tsx';
import { ColorBlob } from '../../utils/ColorBlob.tsx';
import { getColor } from '../../utils/colorUtil.ts';
import { TrackPeople } from '../tracks/components/TrackPeople.tsx';
import { getDelaysOfTracksSelector } from '../../common/calculation/calculated-tracks/getSpecifiedDelayPerTrack.ts';

export const TrackPriorityTable = () => {
    const tracks = useSelector(getTrackCompositions);
    const delays = useSelector(getDelaysOfTracksSelector);
    return (
        <div>
            <Table striped bordered hover style={{ width: '100%' }} size="sm">
                <thead>
                    <tr>
                        <th>
                            <FormattedMessage id={'msg.trackName'} />
                        </th>
                        <th>
                            <FormattedMessage id={'msg.trackPeople'} />
                        </th>
                        <th>
                            <FormattedMessage id={'msg.priority'} />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {tracks.map((track) => (
                        <tr key={track.id}>
                            <td>
                                <ColorBlob color={getColor(track)} />
                                {track.name}
                            </td>
                            <td>
                                <TrackPeople track={track} />
                            </td>
                            <td>
                                <TrackPrio track={track} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <div>{JSON.stringify(delays)}</div>
        </div>
    );
};
