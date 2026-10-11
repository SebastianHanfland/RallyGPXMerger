import { Dropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import { useEffect, useState } from 'react';
import { ConfirmationModal } from '../../common/ConfirmationModal.tsx';
import { FileDownloaderDropdownItem } from '../download/FileDownloader.tsx';
import { trackMergeActions } from '../store/trackMerge.reducer.ts';
import { TrackComposition } from '../store/types.ts';
import { getGpxContentFromTimedPoints } from '../../utils/SimpleGPXFromPoints.ts';
import { getColor } from '../../utils/colorUtil.ts';
import { ColorBlob } from '../../utils/ColorBlob.tsx';
import { getCalculateTracks } from '../calculation/getCalculatedTracks.ts';
import { ColorPicker } from '../../utils/ColorPicker.tsx';

interface Props {
    track: TrackComposition;
    onAction?: () => void;
}

export function SingleTrackActionItems({ track, onAction }: Props) {
    const intl = useIntl();
    const dispatch = useDispatch();
    const { id } = track;
    const [showColorModal, setShowColorModal] = useState(false);
    const [color, setColor] = useState(getColor(track));
    const calculatedTrack = useSelector(getCalculateTracks).find((candidate) => candidate.id === id);

    useEffect(() => {
        setColor(getColor(track));
    }, [track]);

    const closeMenu = () => onAction?.();

    return (
        <>
            <Dropdown.Item
                onClick={() => {
                    setShowColorModal(true);
                }}
            >
                <ColorBlob color={getColor(track)} />
                <span>
                    <FormattedMessage id={'msg.setColor'} />
                </span>
            </Dropdown.Item>
            {showColorModal && (
                <ConfirmationModal
                    onConfirm={() => {
                        dispatch(trackMergeActions.setTrackColor({ id, color }));
                        setShowColorModal(false);
                        closeMenu();
                    }}
                    closeModal={() => {
                        setShowColorModal(false);
                        closeMenu();
                    }}
                    title={`${intl.formatMessage({ id: 'msg.setColor' })} ${track.name ?? ''}`}
                    body={<ColorPicker color={color} setColor={setColor} />}
                />
            )}
            {calculatedTrack && (
                <FileDownloaderDropdownItem
                    content={() =>
                        getGpxContentFromTimedPoints(calculatedTrack.points, calculatedTrack.filename ?? 'Track')
                    }
                    name={calculatedTrack.filename + '.gpx'}
                    onClick={closeMenu}
                />
            )}
        </>
    );
}
