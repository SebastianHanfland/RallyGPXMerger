import { useDispatch } from 'react-redux';
import { Dropdown } from 'react-bootstrap';
import { FormattedMessage, useIntl } from 'react-intl';
import { AppDispatch } from '../store/planningStore.ts';
import { segmentDataActions } from '../store/segmentData.redux.ts';
import { ColorBlob } from '../../utils/ColorBlob.tsx';
import { getColor } from '../../utils/colorUtil.ts';
import { useEffect, useState } from 'react';
import { ConfirmationModal } from '../../common/ConfirmationModal.tsx';
import { ColorPicker } from '../../utils/ColorPicker.tsx';

interface Props {
    id: string;
    name: string;
    color?: string;
}

export function EditSegmentColorButton({ id, name, color: segmentColor }: Props) {
    const intl = useIntl();
    const dispatch: AppDispatch = useDispatch();
    const [showColorModal, setShowColorModal] = useState(false);
    const segment = { id, color: segmentColor };
    const [color, setColor] = useState(getColor(segment));

    useEffect(() => {
        setColor(getColor(segment));
    }, [id, segmentColor]);

    return (
        <>
            <Dropdown.Item title={intl.formatMessage({ id: 'msg.setColor' })} onClick={() => setShowColorModal(true)}>
                <ColorBlob color={getColor(segment)} />
                <span>
                    <FormattedMessage id={'msg.setColor'} />
                </span>
            </Dropdown.Item>
            {showColorModal && (
                <ConfirmationModal
                    onConfirm={() => {
                        dispatch(segmentDataActions.setSegmentColor({ id, color }));
                        setShowColorModal(false);
                    }}
                    closeModal={() => setShowColorModal(false)}
                    title={`${intl.formatMessage({ id: 'msg.setColor' })} ${name}`}
                    body={<ColorPicker color={color} setColor={setColor} />}
                />
            )}
        </>
    );
}
