import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { FormattedMessage } from 'react-intl';
import { batch, useDispatch, useSelector } from 'react-redux';
import { getShowSingleTrackInfo, getShowTrackInfo, mapActions } from '../store/map.reducer.ts';
import { TrackInformationModalBody } from './TrackInformationModalBody.tsx';
import { ZipFilesDownloader } from './TracksDownload.tsx';

export function TrackInformationModal() {
    const dispatch = useDispatch();
    const showModal = useSelector(getShowTrackInfo);
    const singleTrackId = useSelector(getShowSingleTrackInfo);

    const setShowModal = (value: boolean) => dispatch(mapActions.setShowTrackInfo(value));

    const close = () => {
        batch(() => {
            setShowModal(false);
            setTimeout(() => {
                dispatch(mapActions.setShowSingleTrackInfo(undefined));
            }, 200);
        });
    };
    return (
        <>
            <Button onClick={() => setShowModal(true)}>
                <FormattedMessage id={'msg.trackInfo'} />
            </Button>
            <Modal
                show={showModal}
                onHide={close}
                backdrop="static"
                keyboard={false}
                size={singleTrackId ? 'sm' : 'xl'}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        <FormattedMessage id={'msg.trackInfo'} />
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <TrackInformationModalBody />
                </Modal.Body>
                <Modal.Footer>
                    <ZipFilesDownloader />
                    <Button variant="success" onClick={() => 2}>
                        Alle PDF herunterladen
                    </Button>
                    <Button variant="secondary" onClick={close}>
                        <FormattedMessage id={'msg.close'} />
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
