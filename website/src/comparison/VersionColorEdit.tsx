import { useIntl } from 'react-intl';
import { useEffect, useState } from 'react';
import { getColorFromUuid } from '../utils/colorUtil.ts';
import { ColorBlob } from '../utils/ColorBlob.tsx';
import { ConfirmationModal } from '../common/ConfirmationModal.tsx';
import { EditIcon } from '../utils/icons/EditIcon.tsx';
import { useGetVersionColors } from './versionColorsHook.ts';
import { useGetUrlParam } from '../utils/linkUtil.ts';
import { NavigateFunction, useNavigate } from 'react-router';
import { ColorPicker } from '../utils/ColorPicker.tsx';

interface Props {
    index: number;
    planningId: string;
}

function setUrlColor(
    planningIds: string[],
    planningId: string,
    color: string,
    colors: Record<string, string | undefined>,
    navigateTo: NavigateFunction
) {
    const colorsParams = planningIds
        .map((pId) => {
            const colorsFromUrlElement = colors[pId] ?? getColorFromUuid(pId);
            const colorToSet = pId === planningId ? color : colorsFromUrlElement;
            return colorToSet.replace('#', '');
        })
        .join(',');
    const newUrl = `?comparison=${planningIds.join(',')}&colors=${colorsParams}`;

    navigateTo(newUrl, { relative: 'path' });
}

export function EditVersionColorButton({ planningId }: Props) {
    const intl = useIntl();
    const colors = useGetVersionColors();
    const planningIdsFromUrl = useGetUrlParam('comparison=');
    const planningIds = planningIdsFromUrl?.split(',') ?? [];
    const navigateTo = useNavigate();

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
                    event.preventDefault();
                    setShowColorModal(true);
                }}
            >
                <ColorBlob color={colorForPlanning} />
                <EditIcon />
            </span>
            {showColorModal && (
                <ConfirmationModal
                    onConfirm={() => {
                        setUrlColor(planningIds, planningId, color, colors, navigateTo);
                        setShowColorModal(false);
                    }}
                    closeModal={() => setShowColorModal(false)}
                    title={`${intl.formatMessage({ id: 'msg.setColor' })}`}
                    body={<ColorPicker color={color} setColor={setColor} />}
                />
            )}
        </>
    );
}
