import { useDispatch, useSelector } from 'react-redux';
import { trackMergeActions } from '../../store/trackMerge.reducer.ts';
import { Button, Dropdown } from 'react-bootstrap';
import { FormattedMessage, useIntl } from 'react-intl';
import { AppDispatch } from '../../store/planningStore.ts';
import { TrackEntry } from '../../store/types.ts';
import { DraggableIcon } from '../../../utils/icons/DraggableIcon.tsx';
import { ArrowRightIcon } from '../../../utils/icons/ArrowRightIcon.tsx';
import { EditIcon } from '../../../utils/icons/EditIcon.tsx';
import { getEntryPointPositions } from '../../logic/resolving/selectors/getEntryPointPositions.ts';
import { mapActions } from '../../store/map.reducer.ts';
import { toLatLng } from '../../../utils/pointUtil.ts';
import { GeoLinkIcon } from '../../../utils/icons/GeoLinkIcon.tsx';
import { getEntryPointTooltip } from '../../../utils/entryPointUtil.ts';
import { useState } from 'react';
import { TrackSelectionContextMenu } from './TrackSelectionContextMenu.tsx';
import { ConfirmationModal } from '../../../common/ConfirmationModal.tsx';

interface Props {
    trackId: string;
    trackElement: TrackEntry;
}

function getEntryPointLabel(trackEntry: TrackEntry) {
    return trackEntry.streetName;
}

export function TrackSelectionEntryPointOption({ trackElement, trackId }: Props) {
    const intl = useIntl();
    const dispatch: AppDispatch = useDispatch();
    const entryPointPositions = useSelector(getEntryPointPositions);

    const foundPosition = entryPointPositions.find((position) => position.id === trackElement.id);
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number }>();
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    return (
        <div
            data-testid={`track-entry-point-${trackElement.id}`}
            className={'rounded-2 d-flex justify-content-between'}
            style={{
                border: '1px solid transparent',
                borderColor: 'black',
                cursor: 'pointer',
                margin: '1px',
                backgroundColor: 'white',
            }}
            title={trackElement.extraInfo}
            key={trackElement.id}
            onContextMenu={(event) => {
                event.preventDefault();
                setContextMenu({ x: event.clientX, y: event.clientY });
            }}
        >
            <DraggableIcon />
            <div className={'m-2'}>
                <ArrowRightIcon />
                {foundPosition ? getEntryPointTooltip(foundPosition) : getEntryPointLabel(trackElement)}
            </div>
            <div>
                {foundPosition && (
                    <span
                        title={intl.formatMessage({ id: 'msg.jumpToEntryPoint' })}
                        style={{ padding: '5px' }}
                        className={'rounded-2'}
                        onClick={() => {
                            dispatch(mapActions.setPointToCenter(toLatLng(foundPosition?.point)));
                            dispatch(mapActions.setShowEntryPointMarker(true));
                        }}
                    >
                        <GeoLinkIcon />
                    </span>
                )}
                <Button
                    variant="danger"
                    size={'sm'}
                    className={'mx-2 my-1'}
                    onClick={() => {
                        dispatch(trackMergeActions.removeSegmentFromTrack({ id: trackId, segmentId: trackElement.id }));
                    }}
                    title={intl.formatMessage({ id: 'msg.removeEntryPoint' })}
                >
                    X
                </Button>
                <span
                    className={'m-1'}
                    onClick={() =>
                        dispatch(trackMergeActions.setEntryPointEditInfo({ entryPointId: trackElement.id, trackId }))
                    }
                >
                    <EditIcon />
                </span>
            </div>
            {contextMenu && (
                <TrackSelectionContextMenu {...contextMenu} onClose={() => setContextMenu(undefined)}>
                    <Dropdown.Item
                        onClick={() => {
                            setContextMenu(undefined);
                            dispatch(
                                trackMergeActions.setEntryPointEditInfo({
                                    entryPointId: trackElement.id,
                                    trackId,
                                })
                            );
                        }}
                    >
                        <FormattedMessage id={'msg.editEntryPoint'} />
                    </Dropdown.Item>
                    <Dropdown.Item
                        onClick={() => {
                            setContextMenu(undefined);
                            setShowDeleteModal(true);
                        }}
                    >
                        <FormattedMessage id={'msg.removeEntryPoint'} />
                    </Dropdown.Item>
                </TrackSelectionContextMenu>
            )}
            {showDeleteModal && (
                <ConfirmationModal
                    onConfirm={() => {
                        dispatch(trackMergeActions.removeSegmentFromTrack({ id: trackId, segmentId: trackElement.id }));
                        setShowDeleteModal(false);
                    }}
                    closeModal={() => setShowDeleteModal(false)}
                    title={intl.formatMessage({ id: 'msg.removeEntryPointModalTitle' })}
                    body={intl.formatMessage(
                        { id: 'msg.removeEntryPointModalBody' },
                        { name: trackElement.streetName }
                    )}
                />
            )}
        </div>
    );
}
