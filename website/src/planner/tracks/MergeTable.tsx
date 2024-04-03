import { Table } from 'react-bootstrap';
import { MergeTableTrack } from './MergeTableTrack.tsx';
import { AddNewTrack } from './AddNewTrack.tsx';
import { useSelector } from 'react-redux';
import { getFilteredTrackCompositions } from '../store/trackMerge.reducer.ts';
import { FormattedMessage, useIntl } from 'react-intl';

export const MergeTable = () => {
    const intl = useIntl();
    const trackCompositions = useSelector(getFilteredTrackCompositions);

    return (
        <Table striped bordered hover style={{ width: '100%' }} size="sm">
            <thead>
                <tr>
                    <th style={{ width: '30%' }}>
                        <FormattedMessage id={'msg.trackName'} />
                    </th>
                    <th
                        style={{ width: '10%', minWidth: '80px' }}
                        title={intl.formatMessage({ id: 'msg.trackPeople' })}
                    >
                        <FormattedMessage id={'msg.people'} />
                    </th>
                    <th
                        style={{ width: '10%', minWidth: '80px' }}
                        title={intl.formatMessage({ id: 'msg.priority.hint' })}
                    >
                        <FormattedMessage id={'msg.priority'} />
                    </th>
                    <th style={{ width: '50%' }}>
                        <FormattedMessage id={'msg.trackSegments'} />
                    </th>
                    <th style={{ width: '38px' }} />
                </tr>
            </thead>
            <tbody>
                {trackCompositions.map((track) => (
                    <MergeTableTrack key={track.id} track={track} />
                ))}

                <AddNewTrack />
            </tbody>
        </Table>
    );
};
