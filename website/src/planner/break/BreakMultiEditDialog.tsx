import { useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import { FormattedMessage } from 'react-intl';
import Button from 'react-bootstrap/Button';
import { getColor } from '../../utils/colorUtil.ts';
import { BreakPosition } from '../logic/resolving/selectors/getBreakPositions.ts';
import { getTrackCompositions } from '../store/trackMerge.reducer.ts';
import { ColorBlob } from '../../utils/ColorBlob.tsx';
import { SingleBreakEdit } from './SingleBreakEdit.tsx';

interface Props {
    breaks: Record<string, BreakPosition[]>;
    closeModal: () => void;
}

export const BreakMultiEditDialog = ({ breaks, closeModal }: Props) => {
    const tracks = useSelector(getTrackCompositions);

    return (
        <Modal show={true} onHide={closeModal} backdrop="static" size={'xl'}>
            <Modal.Header closeButton>
                <Modal.Title>
                    <FormattedMessage id={'msg.editBreak'} />
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {Object.entries(breaks).map(([trackId, breaks]) => {
                    const foundTrack = tracks.find((track) => track.id === trackId);
                    if (!foundTrack) {
                        return null;
                    }
                    return (
                        <>
                            <div
                                key={foundTrack.id}
                                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
                            >
                                <span>
                                    <ColorBlob color={getColor(foundTrack)} />
                                    {foundTrack.name}
                                </span>
                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                    {breaks.map((breakInfo) => (
                                        <SingleBreakEdit breakInfo={breakInfo} />
                                    ))}
                                </div>
                            </div>
                            <hr />
                        </>
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
