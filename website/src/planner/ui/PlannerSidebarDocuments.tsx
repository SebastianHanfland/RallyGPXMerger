import { useDispatch, useSelector } from 'react-redux';
import { trackMergeActions } from '../store/trackMerge.reducer.ts';
import { PageItem, Pagination } from 'react-bootstrap';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { v4 as uuidv4 } from 'uuid';
import { SingleTrackStreetInfo } from '../streets/SingleTrackStreetInfo.tsx';
import { getEnrichedTrackStreetInfos } from '../logic/resolving/selectors/getEnrichedTrackStreetInfos.ts';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export const PlannerSidebarDocuments = () => {
    const trackStreetInfos = useSelector(getEnrichedTrackStreetInfos);
    const dispatch = useDispatch();

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
                <PageItem
                    key={'new track'}
                    onClick={() => {
                        const newTrackId = uuidv4();
                        dispatch(trackMergeActions.addTrackComposition({ id: newTrackId, segmentIds: [], name: '' }));
                        setSelectedTrackId(newTrackId);
                    }}
                >
                    + <FormattedMessage id={'msg.addNewTrack'} />
                </PageItem>
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
