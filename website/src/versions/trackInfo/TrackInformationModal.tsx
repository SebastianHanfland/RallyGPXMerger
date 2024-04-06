import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { FormattedMessage, useIntl } from 'react-intl';
import { batch, useDispatch, useSelector } from 'react-redux';
import { getShowSingleTrackInfo, getShowTrackInfo, mapActions } from '../store/map.reducer.ts';
import { TrackInformationModalBody } from './TrackInformationModalBody.tsx';
import { ZipFilesDownloader } from './TracksDownload.tsx';
import { downloadPdfFiles } from '../../planner/streets/StreetFilesPdfMakeDownloader.tsx';
import { storedState } from '../data/loadJsonFile.ts';
import { State } from '../../planner/store/types.ts';
import { showTimes } from '../store/LoadStateButton.tsx';
import L from 'leaflet';

export function TrackInformationModal() {
    const intl = useIntl();
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
        <Modal
            show={showModal}
            onHide={close}
            keyboard={false}
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
                    {storedState && showTimes && (
                        <Button
                            variant="success"
                            onClick={() => downloadPdfFiles(intl)(undefined as any, () => storedState as State)}
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
