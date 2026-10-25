import { useDispatch } from 'react-redux';
import { useIntl } from 'react-intl';
import { useEffect, useState } from 'react';
import { ConfirmationModal } from '../../common/ConfirmationModal.tsx';
import { trackMergeActions } from '../store/trackMerge.reducer.ts';
import { TrackComposition } from '../store/types.ts';
import { getColor } from '../../utils/colorUtil.ts';
import { ColorBlob } from '../../utils/ColorBlob.tsx';
import { ColorPicker } from '../../utils/ColorPicker.tsx';

interface Props {
    track: TrackComposition;
    onAction?: () => void;
}

export function SingleTrackColor({ track, onAction }: Props) {
    const intl = useIntl();
    const dispatch = useDispatch();
    const { id } = track;
    const [showColorModal, setShowColorModal] = useState(false);
    const [color, setColor] = useState(getColor(track));

    useEffect(() => {
        setColor(getColor(track));
    }, [track]);

    const closeMenu = () => onAction?.();

    return (
        <>
            <div
                className={'mt-2'}
                title={intl.formatMessage({ id: 'msg.setColor' })}
                onClick={() => {
                    setShowColorModal(true);
                }}
            >
                <ColorBlob color={getColor(track)} size={'40px'} />
            </div>
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
        </>
    );
}
