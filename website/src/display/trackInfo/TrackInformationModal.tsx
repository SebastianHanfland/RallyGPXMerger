import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { displayMapActions, getShowSingleTrackInfo, getShowTrackInfo } from '../store/displayMapReducer.ts';
import { TrackInformationModalBody } from './TrackInformationModalBody.tsx';
import { ZipFilesDownloader } from './TracksDownload.tsx';
import L from 'leaflet';
import { TrackInformationPdfZipDownloadButton } from './TrackInformationPdfZipDownloadButton.tsx';

export function TrackInformationModal() {
    const dispatch = useDispatch();
    const showModal = useSelector(getShowTrackInfo);
    const singleTrackId = useSelector(getShowSingleTrackInfo);

    const setShowModal = (value: boolean) => dispatch(displayMapActions.setShowTrackInfo(value));

    const close = () => {
        setShowModal(false);
        setTimeout(() => {
            dispatch(displayMapActions.setShowSingleTrackInfo(undefined));
        }, 200);
    };
    return (
        <Modal
            show={showModal}
            onHide={close}
            size={singleTrackId ? 'sm' : 'xl'}
            dialogClassName={L.Browser.mobile ? 'm-0' : undefined}
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    <FormattedMessage id={'msg.trackInfo'} />
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <TrackInformationModalBody />
            </Modal.Body>
            {!singleTrackId && (
                <Modal.Footer>
                    <ZipFilesDownloader />
                    <TrackInformationPdfZipDownloadButton />
                    <Button variant="secondary" onClick={close}>
                        <FormattedMessage id={'msg.close'} />
                    </Button>
                </Modal.Footer>
            )}
        </Modal>
    );
}
