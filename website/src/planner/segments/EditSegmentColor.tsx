import { useDispatch } from 'react-redux';
import { Dropdown } from 'react-bootstrap';
import { FormattedMessage, useIntl } from 'react-intl';
import { AppDispatch } from '../store/planningStore.ts';
import { segmentDataActions } from '../store/segmentData.redux.ts';
import { ColorBlob } from '../../utils/ColorBlob.tsx';
import { getColor } from '../../utils/colorUtil.ts';
import { useState } from 'react';
import { ConfirmationModal } from '../../common/ConfirmationModal.tsx';
import { HexColorPicker } from 'react-colorful';
import { ParsedGpxSegment } from '../store/types.ts';

interface Props {
    segment: ParsedGpxSegment;
}

export function EditSegmentColorButton({ segment }: Props) {
    const intl = useIntl();
    const dispatch: AppDispatch = useDispatch();
    const [showColorModal, setShowColorModal] = useState(false);
    const [color, setColor] = useState(getColor(segment));

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
                        dispatch(segmentDataActions.setSegmentColor({ id: segment.id, color }));
                        setShowColorModal(false);
                    }}
                    closeModal={() => setShowColorModal(false)}
                    title={`${intl.formatMessage({ id: 'msg.setColor' })} ${segment.filename ?? ''}`}
                    body={<HexColorPicker color={color} onChange={setColor} />}
                />
            )}
        </>
    );
}
