import { useDispatch, useSelector } from 'react-redux';
import { trackMergeActions } from '../../store/trackMerge.reducer';
import { Button, Dropdown } from 'react-bootstrap';
import { FormattedMessage, useIntl } from 'react-intl';
import { AppDispatch } from '../../store/planningStore';
import { TrackBreak } from '../../store/types';
import { DraggableIcon } from '../../../utils/icons/DraggableIcon';
import { BreakIcon } from '../../../utils/icons/BreakIcon';
import { WcIcon } from '../../../utils/icons/WcIcon';
import { EditIcon } from '../../../utils/icons/EditIcon';
import { BreakPosition, getBreakPositions } from '../../logic/resolving/selectors/getBreakPositions';
import { mapActions } from '../../store/map.reducer';
import { GeoLinkIcon } from '../../../utils/icons/GeoLinkIcon';
import { toLatLng } from '../../../utils/pointUtil';
import { formatTimeOnly } from '../../../utils/dateUtil';
import { BreakAtPositionEdit, getBreaksAtPlace } from '../../break/BreakAtPositionEdit';
import { useState } from 'react';
import { TrackSelectionContextMenu } from './TrackSelectionContextMenu';
import { BreakMultiEditDialog } from '../../break/BreakMultiEditDialog';
import { ConfirmationModal } from '../../../common/ConfirmationModal';

interface Props {
    trackId: string;
    trackElement: TrackBreak;
}

function getBreakLabel(trackBreak: TrackBreak, foundBreak: BreakPosition | undefined) {
    const minutesBreak = trackBreak.minutes;
    const breakText = `${minutesBreak > 0 ? '+' : '-'} ${minutesBreak > 0 ? minutesBreak : -1 * minutesBreak} min`;
    if (!foundBreak) {
        return breakText;
    }
    return `${breakText} at ${formatTimeOnly(foundBreak.at, true)}`;
}

export function TrackSelectionBreakOption({ trackElement, trackId }: Props) {
    const intl = useIntl();
    const dispatch: AppDispatch = useDispatch();
    const breakPositions = useSelector(getBreakPositions);
    const foundBreak = breakPositions.find((breakPosition) => breakPosition.breakId === trackElement.id);
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number }>();
    const [showMultiEdit, setShowMultiEdit] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const breaks = getBreaksAtPlace(foundBreak, breakPositions);

    return (
        <div
            data-testid={`track-break-${trackElement.id}`}
            className={'rounded-2 d-flex justify-content-between'}
            style={{
                border: '1px solid transparent',
                borderColor: 'black',
                cursor: 'pointer',
                margin: '1px',
                backgroundColor: 'white',
            }}
            title={trackElement.description}
            key={trackElement.id}
            onContextMenu={(event) => {
                event.preventDefault();
                setContextMenu({ x: event.clientX, y: event.clientY });
            }}
        >
            <DraggableIcon />
            <div className={'m-2'}>
                {trackElement.hasToilet ? <WcIcon /> : <BreakIcon />}
                {getBreakLabel(trackElement, foundBreak)}
                <BreakAtPositionEdit trackElement={trackElement} />
            </div>
            <div>
                {foundBreak && (
                    <span
                        title={intl.formatMessage({ id: 'msg.jumpToBreak' })}
                        style={{ padding: '5px' }}
                        className={'rounded-2'}
                        onMouseDown={(event) => event.stopPropagation()}
                        onClick={(event) => {
                            event.stopPropagation();
                            dispatch(mapActions.setPointToCenter(toLatLng(foundBreak?.point)));
                            dispatch(mapActions.setShowBreakMarker(true));
                        }}
                    >
                        <GeoLinkIcon />
                    </span>
                )}
                <Button
                    variant="danger"
                    size={'sm'}
                    className={'mx-2 my-1'}
                    onMouseDown={(event) => event.stopPropagation()}
                    onClick={(event) => {
                        event.stopPropagation();
                        dispatch(trackMergeActions.removeSegmentFromTrack({ id: trackId, segmentId: trackElement.id }));
                    }}
                    title={intl.formatMessage(
                        { id: 'msg.removeBreakSegment' },
                        { breakName: getBreakLabel(trackElement, foundBreak) }
                    )}
                >
                    X
                </Button>
                <span
                    className={'m-1'}
                    aria-label={intl.formatMessage({ id: 'msg.editBreak' })}
                    onMouseDown={(event) => event.stopPropagation()}
                    onClick={(event) => {
                        event.stopPropagation();
                        dispatch(trackMergeActions.setBreakEditInfo({ breakId: trackElement.id, trackId: trackId }));
                    }}
                >
                    <EditIcon />
                </span>
            </div>
            {contextMenu && (
                <TrackSelectionContextMenu {...contextMenu} onClose={() => setContextMenu(undefined)}>
                    <Dropdown.Item
                        onClick={() => {
                            setContextMenu(undefined);
                            if (Object.keys(breaks).length > 1) {
                                setShowMultiEdit(true);
                            } else {
                                dispatch(trackMergeActions.setBreakEditInfo({ breakId: trackElement.id, trackId }));
                            }
                        }}
                    >
                        <FormattedMessage id={'msg.editBreak'} />
                    </Dropdown.Item>
                    <Dropdown.Item
                        onClick={() => {
                            setContextMenu(undefined);
                            setShowDeleteModal(true);
                        }}
                    >
                        <FormattedMessage id={'msg.removeBreakSegment'} />
                    </Dropdown.Item>
                </TrackSelectionContextMenu>
            )}
            {showMultiEdit && <BreakMultiEditDialog breaks={breaks} closeModal={() => setShowMultiEdit(false)} />}
            {showDeleteModal && (
                <ConfirmationModal
                    onConfirm={() => {
                        dispatch(trackMergeActions.removeSegmentFromTrack({ id: trackId, segmentId: trackElement.id }));
                        setShowDeleteModal(false);
                    }}
                    closeModal={() => setShowDeleteModal(false)}
                    title={intl.formatMessage({ id: 'msg.removeBreakModalTitle' })}
                    body={intl.formatMessage(
                        { id: 'msg.removeBreakModalBody' },
                        { name: getBreakLabel(trackElement, foundBreak) }
                    )}
                />
            )}
        </div>
    );
}
