import { useIntl } from 'react-intl';
import { useEffect, useState } from 'react';
import { getColorFromUuid } from '../utils/colorUtil.ts';
import { ColorBlob } from '../utils/ColorBlob.tsx';
import { ConfirmationModal } from '../common/ConfirmationModal.tsx';
import { HexColorPicker } from 'react-colorful';
import { EditIcon } from '../utils/icons/EditIcon.tsx';
import { useGetVersionColors } from './versionColorsHook.ts';

interface Props {
    index: number;
    planningId: string;
}

export function EditVersionColorButton({ planningId }: Props) {
    const intl = useIntl();
    const colors = useGetVersionColors();
    const colorForPlanning = colors[planningId] ?? getColorFromUuid(planningId);

    const [showColorModal, setShowColorModal] = useState(false);
    const [color, setColor] = useState(colorForPlanning);

    useEffect(() => {
        setColor(colorForPlanning);
    }, [planningId]);

    return (
        <>
            <span
                title={intl.formatMessage({ id: 'msg.setColor' })}
                onClick={(event) => {
                    event.stopPropagation();
                    setShowColorModal(true);
                }}
            >
                <ColorBlob color={colorForPlanning} />
                <EditIcon />
            </span>
            {showColorModal && (
                <ConfirmationModal
                    onConfirm={() => {
                        setShowColorModal(false);
                    }}
                    closeModal={() => setShowColorModal(false)}
                    title={`${intl.formatMessage({ id: 'msg.setColor' })}`}
                    body={<HexColorPicker color={color} onChange={setColor} />}
                />
            )}
        </>
    );
}
