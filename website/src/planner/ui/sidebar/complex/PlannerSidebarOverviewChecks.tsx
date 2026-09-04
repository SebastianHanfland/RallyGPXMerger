import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Table } from 'react-bootstrap';
import { FormattedMessage, useIntl } from 'react-intl';
import { getTrackCompositions } from '../../../store/trackMerge.reducer.ts';
import { getTrackStreetInfos } from '../../../calculation/getTrackStreetInfos.ts';
import { getGaps } from '../../../calculation/getGaps.ts';
import { getGapToleranceInKm } from '../../../store/settings.reducer.ts';
import { UnknownWarning } from '../../../streets/UnknownWarning.tsx';
import { StreetInfoModal } from '../../elements/StreetInfoModal.tsx';
import { GapFinderParameters } from '../../../parameters/GapFinderParameters.tsx';

export const PlannerSidebarOverviewChecks = () => {
    const tracks = useSelector(getTrackCompositions);
    const streetInfos = useSelector(getTrackStreetInfos);
    const gaps = useSelector(getGaps);
    const tolerance = useSelector(getGapToleranceInKm);
    const [selectedTrackId, setSelectedTrackId] = useState<string>();
    const intl = useIntl();
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
                        <th>
                            <FormattedMessage id="msg.gaps" />
                        </th>
                        <th />
                    </tr>
                </thead>
                <tbody>
                    {tracks.map((track) => {
                        const gapCount = gaps.filter((gap) => gap.trackId === track.id).length;
                        return (
                            <tr key={track.id}>
                                <td>{track.name || '---'}</td>
                                <td>
                                    <UnknownWarning trackId={track.id} withText={true} />
                                </td>
                                <td>
                                    {gapCount} <small>({intl.formatNumber(tolerance * 1000)} m)</small>
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
                        );
                    })}
                </tbody>
            </Table>
            <GapFinderParameters />
            {selectedTrack && (
                <StreetInfoModal selectedTrack={selectedTrack} onHide={() => setSelectedTrackId(undefined)} />
            )}
        </>
    );
};
