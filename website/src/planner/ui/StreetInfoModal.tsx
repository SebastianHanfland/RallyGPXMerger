import { FormattedMessage } from 'react-intl';
import { SingleTrackStreetInfo } from '../streets/SingleTrackStreetInfo.tsx';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { TrackStreetInfo } from '../logic/resolving/types.ts';

interface Props {
    selectedTrack: TrackStreetInfo;
    onHide: () => void;
}

export const StreetInfoModal = ({ selectedTrack, onHide }: Props) => {
    return (
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
    );
};
