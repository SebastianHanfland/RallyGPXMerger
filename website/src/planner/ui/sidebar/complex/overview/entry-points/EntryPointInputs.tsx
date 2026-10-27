import { Button, Form } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { getCount } from '../../../../../../utils/inputUtil';
import { GeoLinkIcon } from '../../../../../../utils/icons/GeoLinkIcon';
import { toLatLng } from '../../../../../../utils/pointUtil';
import { AppDispatch } from '../../../../../store/planningStore';
import { mapActions } from '../../../../../store/map.reducer';
import { trackMergeActions } from '../../../../../store/trackMerge.reducer';
import { TrackComposition, TrackEntry } from '../../../../../store/types';
import { EntryPointPosition } from '../../../../../logic/resolving/selectors/getEntryPointPositions';

interface Props {
    track: TrackComposition;
    entryPoint: TrackEntry;
    position?: EntryPointPosition;
}

const useUpdateEntryPoint = (track: TrackComposition, entryPoint: TrackEntry) => {
    const dispatch: AppDispatch = useDispatch();
    return (values: Partial<Pick<TrackEntry, 'streetName' | 'buffer' | 'rounding'>>) =>
        dispatch(trackMergeActions.updateEntryPoint({ trackId: track.id, entryPointId: entryPoint.id, values }));
};

export const EntryPointRoundingInput = ({ track, entryPoint }: Props) => {
    const intl = useIntl();
    const update = useUpdateEntryPoint(track, entryPoint);

    return (
        <Form.Control
            type="number"
            min={0}
            style={{ width: '4rem' }}
            value={entryPoint.rounding ?? ''}
            aria-label={`${intl.formatMessage({ id: 'msg.rounding' })} ${track.name ?? ''}`}
            onChange={(event) => update({ rounding: getCount(event) })}
        />
    );
};

export const EntryPointBufferInput = ({ track, entryPoint }: Props) => {
    const intl = useIntl();
    const update = useUpdateEntryPoint(track, entryPoint);

    return (
        <Form.Control
            type="number"
            min={0}
            style={{ width: '4rem' }}
            value={entryPoint.buffer ?? ''}
            aria-label={`${intl.formatMessage({ id: 'msg.buffer' })} ${track.name ?? ''}`}
            onChange={(event) => update({ buffer: getCount(event) })}
        />
    );
};

export const EntryPointStreetInput = ({ track, entryPoint, position }: Props) => {
    const dispatch: AppDispatch = useDispatch();
    const intl = useIntl();
    const update = useUpdateEntryPoint(track, entryPoint);

    return (
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
    );
};
