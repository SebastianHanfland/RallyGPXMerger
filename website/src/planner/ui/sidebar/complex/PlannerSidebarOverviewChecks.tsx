import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Table } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { getTrackCompositions } from '../../../store/trackMerge.reducer.ts';
import { getTrackStreetInfos } from '../../../calculation/getTrackStreetInfos.ts';
import { UnknownWarning } from '../../../streets/UnknownWarning.tsx';
import { StreetInfoModal } from '../../elements/StreetInfoModal.tsx';

export const PlannerSidebarOverviewChecks = () => {
    const tracks = useSelector(getTrackCompositions);
    const streetInfos = useSelector(getTrackStreetInfos);
    const [selectedTrackId, setSelectedTrackId] = useState<string>();
    const selectedTrack = streetInfos.find((track) => track.id === selectedTrackId);

    return (
        <>
            <Table striped bordered size="sm">
                <thead>
                    <tr>
                        <th>
                            <FormattedMessage id="msg.trackName" />
                        </th>
                        <th>
                            <FormattedMessage id="msg.unknown" />
                        </th>
                        <th />
                    </tr>
                </thead>
                <tbody>
                    {tracks.map((track) => (
                        <tr key={track.id}>
                            <td>{track.name || '---'}</td>
                            <td>
                                <UnknownWarning trackId={track.id} withText={true} />
                            </td>
                            <td>
                                <Button
                                    size="sm"
                                    variant="outline-primary"
                                    onClick={() => setSelectedTrackId(track.id)}
                                >
                                    <FormattedMessage id="msg.streetOverview" />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {selectedTrack && (
                <StreetInfoModal selectedTrack={selectedTrack} onHide={() => setSelectedTrackId(undefined)} />
            )}
        </>
    );
};
