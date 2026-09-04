import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Accordion, Button, Card, Table } from 'react-bootstrap';
import { FormattedMessage, useIntl } from 'react-intl';
import { getTrackCompositions } from '../../../store/trackMerge.reducer.ts';
import { getTrackStreetInfos } from '../../../calculation/getTrackStreetInfos.ts';
import { getGaps } from '../../../calculation/getGaps.ts';
import { getGapToleranceInKm } from '../../../store/settings.reducer.ts';
import { UnknownWarning } from '../../../streets/UnknownWarning.tsx';
import { StreetInfoModal } from '../../elements/StreetInfoModal.tsx';
import { TrackStartName } from '../../../tracks/components/TrackStartName.tsx';
import { GapFinderParameters } from '../../../parameters/GapFinderParameters.tsx';
import { DescriptionInfoButton } from '../DescriptionInfoButton.tsx';
import { PointsOfInterest } from '../../../points/PointsOfInterest.tsx';
import { StartTimeTable } from '../../../parameters/StartTimeTable.tsx';
import { TrackNodesTable } from '../../../parameters/nodes/TrackNodesTable.tsx';

export const PlannerSidebarOverview = () => {
    const tracks = useSelector(getTrackCompositions);
    const streetInfos = useSelector(getTrackStreetInfos);
    const gaps = useSelector(getGaps);
    const tolerance = useSelector(getGapToleranceInKm);
    const [selectedTrackId, setSelectedTrackId] = useState<string>();
    const intl = useIntl();
    const selectedTrack = streetInfos.find((track) => track.id === selectedTrackId);

    return (
        <div className="m-2">
            <div className="d-flex justify-content-end">
                <DescriptionInfoButton titleMessageId="msg.overview" descriptionMessageId="msg.description.overview" />
            </div>
            <Accordion defaultActiveKey="checks">
                <Accordion.Item eventKey="checks">
                    <Accordion.Header>
                        <FormattedMessage id="msg.checks" />
                    </Accordion.Header>
                    <Accordion.Body>
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
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="points">
                    <Accordion.Header>
                        <FormattedMessage id="msg.points" />
                    </Accordion.Header>
                    <Accordion.Body>
                        <GapFinderParameters />
                        <PointsOfInterest />
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="streets">
                    <Accordion.Header>
                        <FormattedMessage id="msg.streetOverview" />
                    </Accordion.Header>
                    <Accordion.Body>
                        {streetInfos.map((track) => (
                            <Card className="mb-2" key={track.id}>
                                <Card.Header>
                                    {track.name || '---'} <UnknownWarning trackId={track.id} />
                                </Card.Header>
                                <Card.Body>
                                    <Button size="sm" onClick={() => setSelectedTrackId(track.id)}>
                                        <FormattedMessage id="msg.street" />
                                    </Button>
                                </Card.Body>
                            </Card>
                        ))}
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="start-names">
                    <Accordion.Header>
                        <FormattedMessage id="msg.startNameOverwrite" />
                    </Accordion.Header>
                    <Accordion.Body>
                        {tracks.map((track) => (
                            <div className="mb-2" key={track.id}>
                                <label className="form-label">{track.name || '---'}</label>
                                <TrackStartName track={track} />
                            </div>
                        ))}
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="communicated-start">
                    <Accordion.Header>
                        <FormattedMessage id="msg.communicatedStart" />
                    </Accordion.Header>
                    <Accordion.Body>
                        <StartTimeTable />
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="nodes">
                    <Accordion.Header>
                        <FormattedMessage id="msg.nodes" />
                    </Accordion.Header>
                    <Accordion.Body>
                        <TrackNodesTable />
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
            {selectedTrack && (
                <StreetInfoModal selectedTrack={selectedTrack} onHide={() => setSelectedTrackId(undefined)} />
            )}
        </div>
    );
};
