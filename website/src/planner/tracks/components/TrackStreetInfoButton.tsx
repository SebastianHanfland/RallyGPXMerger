import { Button, Col, Row } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { useState } from 'react';
import { TrackStreetInfo } from '../../logic/resolving/types.ts';
import { UnknownWarning } from '../../streets/UnknownWarning.tsx';
import { StreetInfoModal } from '../../ui/elements/StreetInfoModal.tsx';

export function TrackStreetInfoButton({ matchedTrackInfo }: { matchedTrackInfo: TrackStreetInfo | undefined }) {
    const [displayStreetInfo, setDisplayStreetInfo] = useState(false);

    if (!matchedTrackInfo) {
        return null;
    }

    return (
        <>
            <Row>
                <Col>
                    <Button size={'sm'} className={'m-1'} onClick={() => setDisplayStreetInfo(true)}>
                        <UnknownWarning trackId={matchedTrackInfo.id} />
                        <FormattedMessage id={'msg.trackStreetInfo'} />
                    </Button>
                    {displayStreetInfo && (
                        <StreetInfoModal selectedTrack={matchedTrackInfo} onHide={() => setDisplayStreetInfo(false)} />
                    )}
                </Col>
            </Row>
            <hr />
        </>
    );
}
