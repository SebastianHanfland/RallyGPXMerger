import { useSelector } from 'react-redux';
import { PageItem, Pagination } from 'react-bootstrap';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { SingleTrackStreetInfo } from '../streets/SingleTrackStreetInfo.tsx';
import { getEnrichedTrackStreetInfos } from '../logic/resolving/selectors/getEnrichedTrackStreetInfos.ts';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export const PlannerSidebarStreetInfos = () => {
    const trackStreetInfos = useSelector(getEnrichedTrackStreetInfos);

    const [selectedTrackId, setSelectedTrackId] = useState<string>();
    const selectedTrack = trackStreetInfos.find((track) => track.id === selectedTrackId);
    const onHide = () => setSelectedTrackId(undefined);
    return (
        <div>
            <Pagination style={{ flexFlow: 'wrap' }}>
                {trackStreetInfos.map((track) => (
                    <PageItem
                        key={track.id}
                        active={selectedTrackId === track.id}
                        onClick={() => setSelectedTrackId(track.id)}
                    >
                        {track.name || 'N.N.'}
                    </PageItem>
                ))}
            </Pagination>
            {selectedTrack && (
                <Modal show={true} onHide={onHide} backdrop="static" keyboard={false} size={'xl'}>
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedTrack.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <SingleTrackStreetInfo trackStreetInfo={selectedTrack} />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={onHide}>
                            <FormattedMessage id={'msg.close'} />
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
};
