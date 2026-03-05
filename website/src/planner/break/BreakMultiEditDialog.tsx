import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import { FormattedMessage, useIntl } from 'react-intl';
import Button from 'react-bootstrap/Button';
import { getColor } from '../../utils/colorUtil.ts';
import { BreakPosition } from '../logic/resolving/selectors/getBreakPositions.ts';
import { getTrackCompositions } from '../store/trackMerge.reducer.ts';
import { ColorBlob } from '../../utils/ColorBlob.tsx';
import { Form } from 'react-bootstrap';
import { SingleBreakEdit } from './SingleBreakEdit.tsx';

interface Props {
    breaks: Record<string, BreakPosition[]>;
    closeModal: () => void;
}

export const BreakMultiEditDialog = ({ breaks, closeModal }: Props) => {
    const intl = useIntl();
    const tracks = useSelector(getTrackCompositions);

    return (
        <Modal show={true} onHide={closeModal} backdrop="static" size={'xl'}>
            <Modal.Header closeButton>
                <Modal.Title>
                    <FormattedMessage id={'msg.editNode'} />
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {Object.entries(breaks).map(([trackId, breaks]) => {
                    const foundTrack = tracks.find((track) => track.id === trackId);
                    if (!foundTrack) {
                        return null;
                    }
                    return (
                        <div key={foundTrack.id} className={'mt-5'}>
                            <div>
                                <ColorBlob color={getColor(foundTrack)} />
                                {foundTrack.name}
                            </div>
                            <div>
                                {breaks.map((breakInfo) => (
                                    <SingleBreakEdit breakInfo={breakInfo} />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>
                    <FormattedMessage id={'msg.close'} />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
