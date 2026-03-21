import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { FormattedMessage, useIntl } from 'react-intl';
import { batch, useDispatch, useSelector } from 'react-redux';
import { displayMapActions, getShowSingleTrackInfo, getShowTrackInfo } from '../store/displayMapReducer.ts';
import { TrackInformationModalBody } from './TrackInformationModalBody.tsx';
import { ZipFilesDownloader } from './TracksDownload.tsx';
import L from 'leaflet';
import {
    getDisplayBlockedStreets,
    getDisplayPlanningLabel,
    getDisplayTitle,
    getDisplayTrackStreetInfos,
} from '../store/displayTracksReducer.ts';
import { generatePdfsInZip } from '../../planner/download/pdf/PdfDocumentInZip.tsx';

export function TrackInformationModal() {
    const intl = useIntl();
    const dispatch = useDispatch();
    const showModal = useSelector(getShowTrackInfo);
    const singleTrackId = useSelector(getShowSingleTrackInfo);
    const planningLabel = useSelector(getDisplayPlanningLabel) ?? '';
    const planningTitle = useSelector(getDisplayTitle) ?? '';
    const blockedStreetInfos = useSelector(getDisplayBlockedStreets);
    const trackStreetInfos = useSelector(getDisplayTrackStreetInfos);

    const setShowModal = (value: boolean) => dispatch(displayMapActions.setShowTrackInfo(value));

    const close = () => {
        batch(() => {
            setShowModal(false);
            setTimeout(() => {
                dispatch(displayMapActions.setShowSingleTrackInfo(undefined));
            }, 200);
        });
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
                    {blockedStreetInfos && trackStreetInfos && (
                        <Button
                            variant="success"
                            onClick={() =>
                                generatePdfsInZip(
                                    trackStreetInfos,
                                    blockedStreetInfos,
                                    intl,
                                    planningTitle,
                                    planningLabel
                                )
                            }
                        >
                            Alle PDF herunterladen
                        </Button>
                    )}
                    <Button variant="secondary" onClick={close}>
                        <FormattedMessage id={'msg.close'} />
                    </Button>
                </Modal.Footer>
            )}
        </Modal>
    );
}
