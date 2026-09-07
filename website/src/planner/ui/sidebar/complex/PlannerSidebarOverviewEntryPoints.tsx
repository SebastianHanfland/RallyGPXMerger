import { Button, Form, Table } from 'react-bootstrap';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { ColorBlob } from '../../../../utils/ColorBlob.tsx';
import { EditIcon } from '../../../../utils/icons/EditIcon.tsx';
import { GeoLinkIcon } from '../../../../utils/icons/GeoLinkIcon.tsx';
import { TrashIcon } from '../../../../utils/icons/TrashIcon.tsx';
import { getColor } from '../../../../utils/colorUtil.ts';
import { getCount } from '../../../../utils/inputUtil.ts';
import { getEntryPointTime } from '../../../../utils/entryPointUtil.ts';
import { formatTimeOnly } from '../../../../utils/dateUtil.ts';
import { toLatLng } from '../../../../utils/pointUtil.ts';
import { ConfirmationModal } from '../../../../common/ConfirmationModal.tsx';
import { mapActions } from '../../../store/map.reducer.ts';
import { AppDispatch } from '../../../store/planningStore.ts';
import { getTrackCompositions, trackMergeActions } from '../../../store/trackMerge.reducer.ts';
import { isTrackEntryPoint, TrackComposition, TrackEntry } from '../../../store/types.ts';
import {
    getAllEntryPointPositions,
    EntryPointPosition,
} from '../../../logic/resolving/selectors/getEntryPointPositions.ts';
import { useEffect, useState } from 'react';

function EntryPointDescriptionModal({
    track,
    entryPoint,
    closeModal,
}: {
    track: TrackComposition;
    entryPoint: TrackEntry;
    closeModal: () => void;
}) {
    const dispatch: AppDispatch = useDispatch();
    const intl = useIntl();
    const [description, setDescription] = useState(entryPoint.extraInfo ?? '');

    useEffect(() => setDescription(entryPoint.extraInfo ?? ''), [entryPoint]);

    return (
        <ConfirmationModal
            onConfirm={() => {
                dispatch(
                    trackMergeActions.updateEntryPoint({
                        trackId: track.id,
                        entryPointId: entryPoint.id,
                        values: { extraInfo: description || undefined },
                    })
                );
                closeModal();
            }}
            closeModal={closeModal}
            title={intl.formatMessage({ id: 'msg.editEntryPointDescription' })}
            body={
                <Form.Control
                    as="textarea"
                    rows={3}
                    aria-label={intl.formatMessage({ id: 'msg.description' })}
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                />
            }
        />
    );
}

function EntryPointRow({
    track,
    entryPoint,
    position,
}: {
    track: TrackComposition;
    entryPoint: TrackEntry;
    position?: EntryPointPosition;
}) {
    const dispatch: AppDispatch = useDispatch();
    const intl = useIntl();
    const [showDescriptionModal, setShowDescriptionModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const update = (values: Partial<Pick<TrackEntry, 'streetName' | 'buffer' | 'rounding'>>) =>
        dispatch(trackMergeActions.updateEntryPoint({ trackId: track.id, entryPointId: entryPoint.id, values }));

    return (
        <tr title={entryPoint.extraInfo ?? undefined}>
            <td>{position ? getEntryPointTime(position) : ''}</td>
            <td>{position ? formatTimeOnly(position.passageAt, true) : ''}</td>
            <td>
                <Form.Control
                    type="number"
                    min={0}
                    style={{ width: '4rem' }}
                    value={entryPoint.rounding ?? ''}
                    aria-label={`${intl.formatMessage({ id: 'msg.rounding' })} ${track.name ?? ''}`}
                    onChange={(event) => update({ rounding: getCount(event) })}
                />
            </td>
            <td>
                <Form.Control
                    type="number"
                    min={0}
                    style={{ width: '4rem' }}
                    value={entryPoint.buffer ?? ''}
                    aria-label={`${intl.formatMessage({ id: 'msg.buffer' })} ${track.name ?? ''}`}
                    onChange={(event) => update({ buffer: getCount(event) })}
                />
            </td>
            <td style={{ whiteSpace: 'nowrap' }}>
                <div className="d-flex align-items-center">
                    {position && (
                        <Button
                            variant="link"
                            size="sm"
                            className="p-0"
                            title={intl.formatMessage({ id: 'msg.jumpToEntryPoint' })}
                            aria-label={intl.formatMessage({ id: 'msg.jumpToEntryPoint' })}
                            onClick={() => {
                                dispatch(mapActions.setPointToCenter(toLatLng(position.point)));
                                dispatch(mapActions.setShowEntryPointMarker(true));
                            }}
                        >
                            <GeoLinkIcon />
                        </Button>
                    )}
                    <Form.Control
                        type="text"
                        value={entryPoint.streetName}
                        aria-label={`${intl.formatMessage({ id: 'msg.street' })} ${track.name ?? ''}`}
                        onChange={(event) => update({ streetName: event.target.value })}
                    />
                </div>
            </td>
            <td>
                <Button
                    variant="link"
                    size="sm"
                    title={intl.formatMessage({ id: 'msg.editEntryPointDescription' })}
                    aria-label={intl.formatMessage({ id: 'msg.editEntryPointDescription' })}
                    onClick={() => setShowDescriptionModal(true)}
                >
                    <EditIcon />
                </Button>
                <Button
                    variant="link"
                    size="sm"
                    title={intl.formatMessage({ id: 'msg.removeEntryPoint' })}
                    aria-label={intl.formatMessage({ id: 'msg.removeEntryPoint' })}
                    onClick={() => setShowDeleteModal(true)}
                >
                    <TrashIcon />
                </Button>
                {showDescriptionModal && (
                    <EntryPointDescriptionModal
                        track={track}
                        entryPoint={entryPoint}
                        closeModal={() => setShowDescriptionModal(false)}
                    />
                )}
                {showDeleteModal && (
                    <ConfirmationModal
                        onConfirm={() => {
                            dispatch(
                                trackMergeActions.removeSegmentFromTrack({ id: track.id, segmentId: entryPoint.id })
                            );
                            setShowDeleteModal(false);
                        }}
                        closeModal={() => setShowDeleteModal(false)}
                        title={intl.formatMessage({ id: 'msg.removeEntryPointModalTitle' })}
                        body={intl.formatMessage(
                            { id: 'msg.removeEntryPointModalBody' },
                            { name: entryPoint.streetName }
                        )}
                    />
                )}
            </td>
        </tr>
    );
}

export const PlannerSidebarOverviewEntryPoints = () => {
    const intl = useIntl();
    const tracks = useSelector(getTrackCompositions);
    const positions = useSelector(getAllEntryPointPositions);

    return (
        <div>
            {tracks.map((track) => {
                const entryPoints = track.segments.filter(isTrackEntryPoint);
                if (entryPoints.length === 0) {
                    return null;
                }

                return (
                    <div key={track.id} className="mb-3">
                        <div className="fw-bold mb-1">
                            <ColorBlob color={getColor(track)} />
                            {track.name || '---'}{' '}
                            <FormattedMessage id="msg.entryPointsCount" values={{ amount: entryPoints.length }} />
                        </div>
                        <Table striped bordered hover style={{ width: '100%' }} size="sm">
                            <thead>
                                <tr>
                                    <th style={{ whiteSpace: 'normal' }}>
                                        <FormattedMessage id="msg.bufferedTime" />
                                    </th>
                                    <th style={{ whiteSpace: 'normal' }}>
                                        <FormattedMessage id="msg.realTime" />
                                    </th>
                                    <th style={{ whiteSpace: 'normal' }}>
                                        <FormattedMessage id="msg.rounding" />
                                    </th>
                                    <th style={{ whiteSpace: 'normal' }}>
                                        <FormattedMessage id="msg.buffer" />
                                    </th>
                                    <th style={{ whiteSpace: 'normal' }}>
                                        <FormattedMessage id="msg.street" />
                                    </th>
                                    <th style={{ whiteSpace: 'nowrap' }}>
                                        <span className="visually-hidden">
                                            {intl.formatMessage({ id: 'msg.actions' })}
                                        </span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {entryPoints.map((entryPoint) => (
                                    <EntryPointRow
                                        key={`${track.id}-${entryPoint.id}`}
                                        track={track}
                                        entryPoint={entryPoint}
                                        position={positions.find(
                                            (position) => position.trackId === track.id && position.id === entryPoint.id
                                        )}
                                    />
                                ))}
                            </tbody>
                        </Table>
                    </div>
                );
            })}
        </div>
    );
};
