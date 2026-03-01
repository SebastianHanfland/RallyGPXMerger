import { useDispatch, useSelector } from 'react-redux';
import { trackMergeActions } from '../../store/trackMerge.reducer.ts';
import { Button } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { AppDispatch } from '../../store/planningStore.ts';
import { TrackEntry } from '../../store/types.ts';
import { DraggableIcon } from '../../../utils/icons/DraggableIcon.tsx';
import { ArrowRightIcon } from '../../../utils/icons/ArrowRightIcon.tsx';
import { EditIcon } from '../../../utils/icons/EditIcon.tsx';
import {
    getEntryPointPositions,
    getEntryPointTooltip,
} from '../../logic/resolving/selectors/getEntryPointPositions.ts';
import { mapActions } from '../../store/map.reducer.ts';
import { toLatLng } from '../../../utils/pointUtil.ts';
import { GeoLinkIcon } from '../../../utils/icons/GeoLinkIcon.tsx';

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

    return (
        <div
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
        </div>
    );
}
