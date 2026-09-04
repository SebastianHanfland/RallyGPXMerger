import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Card } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { getTrackStreetInfos } from '../../../calculation/getTrackStreetInfos.ts';
import { UnknownWarning } from '../../../streets/UnknownWarning.tsx';
import { StreetInfoModal } from '../../elements/StreetInfoModal.tsx';

export const PlannerSidebarOverviewStreets = () => {
    const streetInfos = useSelector(getTrackStreetInfos);
    const [selectedTrackId, setSelectedTrackId] = useState<string>();
    const selectedTrack = streetInfos.find((track) => track.id === selectedTrackId);

    return (
        <>
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
            {selectedTrack && (
                <StreetInfoModal selectedTrack={selectedTrack} onHide={() => setSelectedTrackId(undefined)} />
            )}
        </>
    );
};
